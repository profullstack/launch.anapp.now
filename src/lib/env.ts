// Next.js statically replaces `process.env.NAME` at build time, even in server
// code, so a variable that is absent while the image builds compiles in as
// `undefined` forever. Indexing with a non-literal key defeats that and reads
// the value at request time, which is what Railway variables need.
export function runtimeEnv(name: string, fallback = ""): string {
  const key = String(name);
  const value = process.env[key];
  return value === undefined || value === "" ? fallback : value;
}

export const siteOrigin = () => runtimeEnv("SITE_ORIGIN", "https://launch.anapp.now").replace(/\/$/, "");
export const chovyOrigin = () => runtimeEnv("CHOVY_ORIGIN", "https://chovy.com").replace(/\/$/, "");
export const campaignSecret = () => runtimeEnv("CHOVY_CAMPAIGN_SECRET");
