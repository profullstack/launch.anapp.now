import test from "node:test";
import assert from "node:assert/strict";
import { decodeAssignment, encodeAssignment, parseAllocation, pickVariant, VARIANTS } from "./experiment.ts";

test("parseAllocation reads weights and drops garbage", () => {
  const allocation = parseAllocation("hero_control:50, hero_phone_rocket:50, nope:10, hero_fish_builder:-1");
  assert.deepEqual(allocation, [
    { variant: "hero_control", weight: 50 },
    { variant: "hero_phone_rocket", weight: 50 },
  ]);
});

test("parseAllocation falls back to equal weights", () => {
  assert.equal(parseAllocation("").length, VARIANTS.length);
  assert.equal(parseAllocation(undefined).length, VARIANTS.length);
  assert.equal(parseAllocation("garbage").length, VARIANTS.length);
});

test("pickVariant honours weights and never falls off the end", () => {
  const allocation = parseAllocation("hero_control:75,hero_fish_no_code:25");
  assert.equal(pickVariant(allocation, 0), "hero_control");
  assert.equal(pickVariant(allocation, 0.749), "hero_control");
  assert.equal(pickVariant(allocation, 0.75), "hero_fish_no_code");
  assert.equal(pickVariant(allocation, 0.999999), "hero_fish_no_code");
  assert.equal(pickVariant(allocation, 1), "hero_fish_no_code");
});

test("pickVariant distribution is roughly proportional", () => {
  const allocation = parseAllocation("hero_control:10,hero_fish_builder:30,hero_phone_rocket:60");
  const counts: Record<string, number> = {};
  const n = 20000;
  for (let i = 0; i < n; i++) {
    const v = pickVariant(allocation, i / n);
    counts[v] = (counts[v] ?? 0) + 1;
  }
  assert.ok(Math.abs(counts.hero_control / n - 0.1) < 0.01);
  assert.ok(Math.abs(counts.hero_fish_builder / n - 0.3) < 0.01);
  assert.ok(Math.abs(counts.hero_phone_rocket / n - 0.6) < 0.01);
});

test("assignment cookie round-trips and is experiment scoped", () => {
  const value = encodeAssignment("launch_hero_creative_v1", "hero_phone_rocket");
  assert.equal(decodeAssignment(value, "launch_hero_creative_v1"), "hero_phone_rocket");
  assert.equal(decodeAssignment(value, "launch_hero_creative_v2"), null);
  assert.equal(decodeAssignment("launch_hero_creative_v1:bogus", "launch_hero_creative_v1"), null);
  assert.equal(decodeAssignment(undefined, "x"), null);
});
