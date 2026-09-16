import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeSave } from "./save.ts";

const ids = ["arch-01", "char-01", "veh-01"];

test("legacy progress migrates only unique known projects", () => {
  const save = normalizeSave({ version: 1, collected: ["arch-01", "arch-01", "not-real", 3, "veh-01"], lang: "th", quality: "medium" }, ids);
  assert.deepEqual(save.collected, ["arch-01", "veh-01"]);
  assert.equal(save.version, 2);
  assert.equal(save.lang, "th");
  assert.equal(save.quality, "medium");
});

test("invalid save shapes and unknown versions restore safe defaults", () => {
  for (const raw of [null, false, 4, "broken", [], { version: 999, collected: ids }, { collected: "arch-01", dayTime: Infinity }]) {
    const save = normalizeSave(raw, ids, "low");
    assert.deepEqual(save.collected, []);
    assert.equal(save.dayTime, 0.32);
    assert.equal(save.quality, "low");
  }
});

test("preferences are typed strictly and time is finite and normalized", () => {
  const save = normalizeSave({ muted: "false", dayPaused: "true", quality: "ultra", weather: "storm", dayTime: -1.25 }, ids);
  assert.equal(save.muted, false);
  assert.equal(save.dayPaused, false);
  assert.equal(save.quality, "high");
  assert.equal(save.weather, "auto");
  assert.equal(save.dayTime, 0.75);
  assert.equal(normalizeSave({ dayTime: NaN }, ids).dayTime, 0.32);
  assert.deepEqual(normalizeSave(save, ids), save);
});
