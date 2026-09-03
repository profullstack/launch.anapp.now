import { cookies, headers } from "next/headers";
import { COOKIE_FIRST_TOUCH, COOKIE_SESSION, COOKIE_VARIANT, DEFAULT_EXPERIMENT_ID, decodeAssignment, isVariant, type Variant } from "./experiment.ts";
import { decodeAttributionCookie, type Attribution } from "./attribution.ts";
import { runtimeEnv } from "./env.ts";

export type CampaignSession = { sid: string; experiment: string; variant: Variant; firstTouch: Attribution };

/** Reads what proxy.ts established. Works on the first request (headers set by
 * the proxy) and on later ones (cookies). */
export async function campaignSession(): Promise<CampaignSession> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const experiment = headerStore.get("x-lan-experiment") || runtimeEnv("EXPERIMENT_ID", DEFAULT_EXPERIMENT_ID);
  const fromHeader = headerStore.get("x-lan-variant");
  const variant = isVariant(fromHeader) ? fromHeader : (decodeAssignment(cookieStore.get(COOKIE_VARIANT)?.value, experiment) ?? "hero_control");
  const sid = headerStore.get("x-lan-sid") || cookieStore.get(COOKIE_SESSION)?.value || "";
  return { sid, experiment, variant, firstTouch: decodeAttributionCookie(cookieStore.get(COOKIE_FIRST_TOUCH)?.value) };
}

/** Same thing for route handlers, which only have the request cookies. */
export function campaignSessionFromRequest(request: Request): CampaignSession {
  const jar = new Map<string, string>();
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const index = part.indexOf("=");
    if (index > 0) jar.set(part.slice(0, index).trim(), safeDecode(part.slice(index + 1).trim()));
  }
  const experiment = runtimeEnv("EXPERIMENT_ID", DEFAULT_EXPERIMENT_ID);
  return {
    sid: jar.get(COOKIE_SESSION) ?? "",
    experiment,
    variant: decodeAssignment(jar.get(COOKIE_VARIANT), experiment) ?? "hero_control",
    firstTouch: decodeAttributionCookie(jar.get(COOKIE_FIRST_TOUCH)),
  };
}

/** Raw Cookie header values are percent-encoded by the cookie layer that set them. */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
