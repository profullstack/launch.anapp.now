import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_FIRST_TOUCH,
  COOKIE_FRESH,
  COOKIE_SESSION,
  COOKIE_VARIANT,
  DEFAULT_ALLOCATION,
  DEFAULT_EXPERIMENT_ID,
  decodeAssignment,
  encodeAssignment,
  isVariant,
  parseAllocation,
  pickVariant,
} from "./lib/experiment.ts";
import { attributionFromParams, encodeAttributionCookie } from "./lib/attribution.ts";
import { runtimeEnv } from "./lib/env.ts";

const NINETY_DAYS = 60 * 60 * 24 * 90;
const ONE_YEAR = 60 * 60 * 24 * 365;

function roll(): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] / 2 ** 32;
}

/**
 * Assigns each eligible landing visitor to one hero creative and keeps that
 * assignment stable across visits. Also records an anonymous session id and
 * first-touch attribution as first-party cookies. Nothing here can see the idea.
 */
export function proxy(request: NextRequest) {
  const experiment = runtimeEnv("EXPERIMENT_ID", DEFAULT_EXPERIMENT_ID);
  const url = request.nextUrl;
  const cookies = request.cookies;
  const secure = url.protocol === "https:";
  const base = { path: "/", sameSite: "lax" as const, secure };

  let sid = cookies.get(COOKIE_SESSION)?.value ?? "";
  const newSession = !/^[0-9a-f-]{36}$/.test(sid);
  if (newSession) sid = crypto.randomUUID();

  const override = url.searchParams.get("hero");
  let variant = decodeAssignment(cookies.get(COOKIE_VARIANT)?.value, experiment);
  let assigned = false;
  if (isVariant(override)) {
    assigned = variant !== override;
    variant = override;
  } else if (!variant) {
    variant = pickVariant(parseAllocation(runtimeEnv("HERO_ALLOCATION", DEFAULT_ALLOCATION)), roll());
    assigned = true;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-lan-variant", variant);
  requestHeaders.set("x-lan-experiment", experiment);
  requestHeaders.set("x-lan-sid", sid);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (newSession) response.cookies.set(COOKIE_SESSION, sid, { ...base, httpOnly: true, maxAge: ONE_YEAR });
  if (assigned) {
    response.cookies.set(COOKIE_VARIANT, encodeAssignment(experiment, variant), { ...base, httpOnly: true, maxAge: NINETY_DAYS });
    // Short-lived flag the client reads once to emit `experiment_assigned`.
    response.cookies.set(COOKIE_FRESH, "1", { ...base, httpOnly: false, maxAge: 120 });
  }
  if (!cookies.get(COOKIE_FIRST_TOUCH)) {
    const firstTouch = {
      ...attributionFromParams(url.searchParams),
      referrer: (request.headers.get("referer") ?? "").slice(0, 500) || undefined,
      landing_path: url.pathname,
    };
    response.cookies.set(COOKIE_FIRST_TOUCH, encodeAttributionCookie(firstTouch), { ...base, httpOnly: true, maxAge: NINETY_DAYS });
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  // Landing routes only: never static assets, images, or the API.
  matcher: ["/((?!api|_next|marketing|healthz|favicon|icons|robots\\.txt|sitemap\\.xml|opengraph-image|twitter-image|.*\\.[a-z0-9]+$).*)"],
};
