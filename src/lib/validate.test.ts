import test from "node:test";
import assert from "node:assert/strict";
import { checkIdea } from "./validate.ts";

test("checkIdea accepts a rough sentence and normalises whitespace", () => {
  const result = checkIdea("  a scheduling app   for music teachers ");
  assert.deepEqual(result, { ok: true, idea: "a scheduling app for music teachers" });
});

test("checkIdea rejects empty, tiny, and non-text input", () => {
  assert.equal(checkIdea("").ok, false);
  assert.equal(checkIdea("hi").ok, false);
  assert.equal(checkIdea("12345 !!! ???").ok, false);
  assert.equal(checkIdea(42).ok, false);
  assert.equal(checkIdea("http://x.co").ok, false);
});

test("checkIdea rejects oversize input", () => {
  assert.equal(checkIdea("a".repeat(2001)).ok, false);
});

import { decodeAttributionCookie, encodeAttributionCookie } from "./attribution.ts";
test("attribution cookie survives both raw and decoded forms", () => {
  const encoded = encodeAttributionCookie({ utm_source: "reddit", landing_path: "/", referrer: "https://r.com/a%20b" });
  assert.equal(decodeAttributionCookie(encoded).utm_source, "reddit");
  assert.equal(decodeAttributionCookie(encodeURIComponent(encoded)).utm_source, "reddit");
  assert.deepEqual(decodeAttributionCookie("garbage"), {});
  assert.deepEqual(decodeAttributionCookie(undefined), {});
});
