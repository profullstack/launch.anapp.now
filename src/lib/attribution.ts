export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Attribution = Partial<Record<UtmKey, string>> & { referrer?: string; landing_path?: string };

const clip = (value: string, max = 200) => value.replace(/[\x00-\x1f\x7f]/g, "").slice(0, max);

export function attributionFromParams(params: URLSearchParams): Attribution {
  const out: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = clip(value);
  }
  return out;
}

export function hasAttribution(attribution: Attribution): boolean {
  return UTM_KEYS.some((key) => Boolean(attribution[key]));
}

export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object") return {};
  const record = input as Record<string, unknown>;
  const out: Attribution = {};
  for (const key of [...UTM_KEYS, "referrer", "landing_path"] as const) {
    const value = record[key];
    if (typeof value === "string" && value) out[key] = clip(value, key === "referrer" ? 500 : 200);
  }
  return out;
}

/** Plain JSON; the cookie layer percent-encodes it once. */
export function encodeAttributionCookie(attribution: Attribution): string {
  return JSON.stringify(attribution);
}

export function decodeAttributionCookie(value: string | undefined): Attribution {
  if (!value) return {};
  // `cookies()` hands back a decoded value; a raw Cookie header does not.
  for (const candidate of [value, safeDecode(value)]) {
    try {
      return sanitizeAttribution(JSON.parse(candidate));
    } catch {}
  }
  return {};
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
