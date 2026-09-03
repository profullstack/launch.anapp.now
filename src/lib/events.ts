export const EVENT_NAMES = [
  "campaign_landing_view",
  "experiment_assigned",
  "creative_impression",
  "hero_input_focus",
  "idea_input_started",
  "idea_submitted",
  "handoff_started",
  "handoff_completed",
  "handoff_failed",
  "cta_click",
  "section_view",
] as const;
export type EventName = (typeof EVENT_NAMES)[number];

export const isEventName = (value: unknown): value is EventName =>
  typeof value === "string" && (EVENT_NAMES as readonly string[]).includes(value);

/** Client -> /api/campaign/events. Never carries the idea text. */
export type ClientEvent = {
  name: EventName;
  ts?: number;
  surface?: string;
  device_class?: "mobile" | "tablet" | "desktop";
  props?: Record<string, string | number | boolean>;
};
