import test from "node:test";
import assert from "node:assert/strict";
import { defaultConfig, validateConfig } from "../src/lib/forge/config.mjs";
test("round trip config preserves selected controls", () => {
  const c = {
    ...defaultConfig(),
    preset: "music-event",
    scene: "static",
    theme: "slate",
    density: 2,
    motion: "paused",
    sections: ["contact"],
  };
  assert.deepEqual(validateConfig(JSON.parse(JSON.stringify(c))), []);
});
test("unverified metrics and unsafe integration fields are rejected", () => {
  for (const bad of [
    null,
    [],
    { ...defaultConfig(), endpoint: "https://bad.test" },
    { ...defaultConfig(), evidence: { state: "VERIFIED", clientWorkVerified: true } },
    { ...defaultConfig(), kpis: { primary: 95, driver: "N/A", guardrail: "N/A" } },
    {
      ...defaultConfig(),
      integrations: { delivery: "manual", analytics: "not-instrumented", apiKey: "secret" },
    },
  ])
    assert.notDeepEqual(validateConfig(bad), []);
});
test("invalid and duplicate sections cannot enter a template", () => {
  for (const sections of [[], ["work", "work"], ["unknown"]])
    assert.notDeepEqual(validateConfig({ ...defaultConfig(), sections }), []);
});
