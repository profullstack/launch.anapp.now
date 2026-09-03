// Hero creative experiment: variant registry, allocation parsing, and the
// deterministic assignment used by proxy.ts. Everything here is pure so it can
// run in the proxy and be unit-tested with node:test.

export const VARIANTS = ["hero_control", "hero_fish_builder", "hero_phone_rocket", "hero_fish_no_code"] as const;
export type Variant = (typeof VARIANTS)[number];

export const DEFAULT_EXPERIMENT_ID = "launch_hero_creative_v1";
export const DEFAULT_ALLOCATION = "hero_control:25,hero_fish_builder:25,hero_phone_rocket:25,hero_fish_no_code:25";

export const COOKIE_VARIANT = "lan_variant";
export const COOKIE_SESSION = "lan_sid";
export const COOKIE_FIRST_TOUCH = "lan_first_touch";
export const COOKIE_FRESH = "lan_fresh";

export function isVariant(value: unknown): value is Variant {
  return typeof value === "string" && (VARIANTS as readonly string[]).includes(value);
}

export type Allocation = Array<{ variant: Variant; weight: number }>;

/** Parses "hero_control:25,hero_fish_builder:75". Unknown names and bad
 * weights are dropped; an empty or invalid list falls back to equal weights. */
export function parseAllocation(raw: string | undefined): Allocation {
  const parsed: Allocation = [];
  for (const part of (raw ?? "").split(",")) {
    const [name, weight] = part.split(":").map((s) => s.trim());
    const n = Number(weight);
    if (isVariant(name) && Number.isFinite(n) && n > 0) parsed.push({ variant: name, weight: n });
  }
  if (parsed.length === 0) return VARIANTS.map((variant) => ({ variant, weight: 1 }));
  return parsed;
}

/** Picks a variant for a uniform random number in [0, 1). */
export function pickVariant(allocation: Allocation, roll: number): Variant {
  const total = allocation.reduce((sum, a) => sum + a.weight, 0);
  let cursor = roll * total;
  for (const entry of allocation) {
    cursor -= entry.weight;
    if (cursor < 0) return entry.variant;
  }
  return allocation[allocation.length - 1].variant;
}

/** Cookie value is experiment-scoped so a new experiment id reassigns everyone. */
export function encodeAssignment(experiment: string, variant: Variant): string {
  return `${experiment}:${variant}`;
}

export function decodeAssignment(value: string | undefined, experiment: string): Variant | null {
  if (!value) return null;
  const index = value.lastIndexOf(":");
  if (index < 0) return null;
  const exp = value.slice(0, index);
  const variant = value.slice(index + 1);
  return exp === experiment && isVariant(variant) ? variant : null;
}
