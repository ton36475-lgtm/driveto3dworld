import assert from "node:assert/strict";
import { test } from "node:test";
import { COPY } from "../data/i18n.ts";
import { PROJECTS, ZONES } from "../data/projects.ts";
import { CONCEPT_COPY, CONCEPT_DIRECTIONS } from "../data/concepts.ts";

test("every Drive interface key has English, Thai and Simplified Chinese copy", () => {
  const keys = Object.keys(COPY.en).sort();
  for (const language of ["en", "th", "zh"] as const) {
    assert.deepEqual(Object.keys(COPY[language]).sort(), keys);
    for (const text of Object.values(COPY[language])) assert.ok(text.trim());
    assert.deepEqual(Object.keys(CONCEPT_COPY[language]).sort(), Object.keys(CONCEPT_COPY.en).sort());
  }
  assert.match(COPY.zh.start, /[\u4e00-\u9fff]/);
  assert.match(COPY.th.start, /[\u0e00-\u0e7f]/);
});

test("all zones, projects and concept summaries have nonempty translations", () => {
  for (const project of PROJECTS) {
    for (const language of ["en", "th", "zh"] as const) {
      for (const field of ["title", "description", "detail", "medium"] as const) assert.ok(project[field][language].trim());
      for (const tag of project.tags) assert.ok(tag[language].trim());
      assert.ok(CONCEPT_DIRECTIONS[project.id][language].trim());
    }
  }
  for (const zone of ZONES) for (const language of ["en", "th", "zh"] as const) assert.ok(zone.name[language].trim());
});
