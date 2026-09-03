import { NextResponse } from "next/server";
import { checkIdea } from "@/lib/validate.ts";
import { sanitizeAttribution } from "@/lib/attribution.ts";
import { startCampaign } from "@/lib/chovy.ts";
import { clientIp, rateLimit } from "@/lib/rate-limit.ts";
import { campaignSessionFromRequest } from "@/lib/session.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
const RETRY_COPY = "We couldn't reach Chovy just now. Your idea is still here. Try again in a moment.";

/**
 * Idea capture. The raw idea is read from the JSON body, validated, and sent
 * server-to-server to Chovy. It never appears in a URL, a log line, or a
 * third-party analytics call. The response is only the opaque handoff URL.
 */
export async function POST(request: Request) {
  const limit = rateLimit(`start:${clientIp(request.headers)}`, 6, 10 * 60 * 1000);
  if (!limit.ok) return json({ detail: "Too many attempts. Give it a few minutes." }, 429);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json({ detail: "Give us the rough version. One sentence is enough." }, 400);
  // Honeypot: real browsers never fill this field.
  if (typeof body.website === "string" && body.website.length > 0) return json({ handoff_url: null, detail: "Thanks." }, 202);

  const idea = checkIdea(body.idea);
  if (!idea.ok) return json({ detail: idea.message }, 400);

  const session = campaignSessionFromRequest(request);
  if (!session.sid) return json({ detail: "Cookies are required to continue into Chovy." }, 400);

  const deviceClass = ["mobile", "tablet", "desktop"].includes(String(body.device_class)) ? String(body.device_class) : undefined;
  const result = await startCampaign({
    idea: idea.idea,
    anonymous_session_id: session.sid,
    experiment: session.experiment,
    variant: session.variant,
    device_class: deviceClass,
    first_touch: session.firstTouch,
    last_touch: sanitizeAttribution(body.last_touch),
  });
  if (!result.ok) {
    console.error(`[campaign] handoff failed ${result.status}: ${result.message}`);
    return json({ detail: RETRY_COPY }, result.status >= 500 ? 502 : result.status);
  }
  return json({ handoff_url: result.handoff_url });
}
