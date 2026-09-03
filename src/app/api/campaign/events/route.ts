import { NextResponse } from "next/server";
import { isEventName } from "@/lib/events.ts";
import { forwardEvents, type ForwardedEvent } from "@/lib/chovy.ts";
import { sanitizeAttribution } from "@/lib/attribution.ts";
import { clientIp, rateLimit } from "@/lib/rate-limit.ts";
import { campaignSessionFromRequest } from "@/lib/session.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BATCH = 20;
const ALLOWED_PROP = /^[a-z_]{1,32}$/;

function cleanProps(input: unknown): Record<string, string | number | boolean> | undefined {
  if (!input || typeof input !== "object") return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!ALLOWED_PROP.test(key)) continue;
    if (typeof value === "number" || typeof value === "boolean") out[key] = value;
    else if (typeof value === "string") out[key] = value.slice(0, 120);
  }
  return Object.keys(out).length ? out : undefined;
}

/** First-party funnel events from the landing page. The schema has no field
 * for the idea text and any unknown property is dropped, so it cannot leak. */
export async function POST(request: Request) {
  const limit = rateLimit(`events:${clientIp(request.headers)}`, 240, 60 * 1000);
  if (!limit.ok) return new NextResponse(null, { status: 429 });

  // sendBeacon posts text/plain; parse the body as text regardless of type.
  const raw = await request.text().catch(() => "");
  let body: { events?: unknown; last_touch?: unknown } = {};
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const session = campaignSessionFromRequest(request);
  if (!session.sid || !Array.isArray(body.events)) return new NextResponse(null, { status: 400 });

  const lastTouch = sanitizeAttribution(body.last_touch);
  const events: ForwardedEvent[] = [];
  for (const item of body.events.slice(0, MAX_BATCH)) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    if (!isEventName(record.name)) continue;
    events.push({
      name: record.name,
      ts: typeof record.ts === "number" && Number.isFinite(record.ts) ? record.ts : Date.now(),
      source: "landing",
      anonymous_session_id: session.sid,
      experiment: session.experiment,
      variant: session.variant,
      surface: typeof record.surface === "string" ? record.surface.slice(0, 40) : undefined,
      device_class: ["mobile", "tablet", "desktop"].includes(String(record.device_class)) ? String(record.device_class) : undefined,
      first_touch: session.firstTouch,
      last_touch: lastTouch,
      props: cleanProps(record.props),
    });
  }
  // Fire and forget: the page must never wait on analytics.
  void forwardEvents(events);
  return new NextResponse(null, { status: 202 });
}
