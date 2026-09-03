"use client";
import type { ClientEvent, EventName } from "./events.ts";
import { UTM_KEYS, type Attribution } from "./attribution.ts";

// Client-side first-party event queue. Batches into one beacon and flushes on
// pagehide. Payloads never include the idea text: the schema has no field for it.
const queue: ClientEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
const seen = new Set<string>();

export function deviceClass(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  return w < 700 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

export function lastTouch(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Attribution = { landing_path: window.location.pathname };
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 200);
  }
  if (document.referrer) out.referrer = document.referrer.slice(0, 500);
  return out;
}

export function flush(): void {
  if (timer) clearTimeout(timer);
  timer = null;
  if (queue.length === 0) return;
  const body = JSON.stringify({ events: queue.splice(0, queue.length), last_touch: lastTouch() });
  try {
    if (!navigator.sendBeacon?.("/api/campaign/events", body)) {
      void fetch("/api/campaign/events", { method: "POST", body, keepalive: true, headers: { "content-type": "text/plain" } });
    }
  } catch {
    /* analytics must never break the page */
  }
}

export function track(name: EventName, extra: Omit<ClientEvent, "name" | "ts" | "device_class"> & { once?: string } = {}): void {
  if (extra.once) {
    if (seen.has(extra.once)) return;
    seen.add(extra.once);
  }
  const { once: _once, ...rest } = extra;
  queue.push({ name, ts: Date.now(), device_class: deviceClass(), ...rest });
  if (name === "handoff_completed" || name === "handoff_failed" || name === "idea_submitted") flush();
  else if (!timer) timer = setTimeout(flush, 900);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
}
