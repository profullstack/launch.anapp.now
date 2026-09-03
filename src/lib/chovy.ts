import { campaignSecret, chovyOrigin } from "./env.ts";
import type { Attribution } from "./attribution.ts";

export type StartPayload = {
  idea: string;
  anonymous_session_id: string;
  experiment: string;
  variant: string;
  device_class?: string;
  first_touch: Attribution;
  last_touch: Attribution;
};

export type StartResult = { ok: true; handoff_url: string; context_id: string } | { ok: false; status: number; message: string };

async function post(path: string, body: unknown, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${chovyOrigin()}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${campaignSecret()}`, "user-agent": "launch.anapp.now" },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Creates the campaign context inside Chovy and returns the secure handoff URL.
 * The idea travels only in this server-to-server POST body. */
export async function startCampaign(payload: StartPayload): Promise<StartResult> {
  if (!campaignSecret()) return { ok: false, status: 503, message: "Handoff is not configured." };
  try {
    const response = await post("/api/campaign/contexts", payload, 8000);
    const data = (await response.json().catch(() => ({}))) as { handoff_url?: string; id?: string; detail?: string };
    if (!response.ok || !data.handoff_url) {
      return { ok: false, status: response.status || 502, message: data.detail || "Chovy did not accept the handoff." };
    }
    return { ok: true, handoff_url: data.handoff_url, context_id: String(data.id ?? "") };
  } catch {
    return { ok: false, status: 504, message: "Chovy took too long to answer." };
  }
}

export type ForwardedEvent = {
  name: string;
  ts: number;
  source: "landing";
  anonymous_session_id: string;
  experiment: string;
  variant: string;
  surface?: string;
  device_class?: string;
  first_touch: Attribution;
  last_touch: Attribution;
  props?: Record<string, string | number | boolean>;
};

export async function forwardEvents(events: ForwardedEvent[]): Promise<boolean> {
  if (!campaignSecret() || events.length === 0) return false;
  try {
    const response = await post("/api/campaign/events", { events }, 5000);
    return response.ok;
  } catch {
    return false;
  }
}
