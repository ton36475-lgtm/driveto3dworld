import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import {
  LANGUAGE_OPTIONS,
  isLang,
  normalizeLang,
  htmlLang,
  mergeLanguageState,
} from "../src/lib/locale.mjs";
import { defaultConfig, validateConfig } from "../src/lib/forge/config.mjs";

// Load the real TypeScript copy tables without mounting React or starting a server.
// Only local copy modules are allowed; the unused React language hook is a stub.
const sourceRoot = fileURLToPath(new URL("../src/lib/", import.meta.url));
function loadTable(relative) {
  const filename = resolve(sourceRoot, relative);
  assert.ok(filename.startsWith(sourceRoot));
  const exports = {};
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(
    compiled,
    {
      exports,
      require: (specifier) => {
        if (specifier === "@/lib/lang")
          return {
            useLang: () => {
              throw new Error("Copy test must not invoke a React hook");
            },
          };
        assert.ok(specifier.startsWith("."), `Unexpected copy dependency: ${specifier}`);
        return loadTable(resolve(dirname(filename), `${specifier}.ts`));
      },
    },
    { filename },
  );
  return exports;
}
function leaves(value, path = "", result = {}) {
  if (typeof value === "string") {
    assert.ok(value.trim().length > 0, `Empty translation at ${path}`);
    result[path] = value;
  } else {
    assert.ok(value && typeof value === "object", `Invalid copy at ${path}`);
    for (const [key, child] of Object.entries(value)) leaves(child, `${path}.${key}`, result);
  }
  return result;
}

test("saved language migration retains EN/TH and admits Simplified Chinese", () => {
  const setLang = () => {};
  for (const lang of ["en", "th", "zh"]) {
    const current = { lang: "en", setLang };
    const persisted = JSON.parse(JSON.stringify({ state: { lang }, version: 0 }));
    const merged = mergeLanguageState(persisted.state, current);
    assert.equal(merged.lang, lang);
    assert.equal(merged.setLang, setLang);
    assert.equal(isLang(lang), true);
    assert.equal(current.lang, "en", "Merging must not mutate the initial state");
  }
});
test("corrupt preferences cannot inject methods or unsupported locales", () => {
  const setLang = () => {};
  for (const lang of [null, undefined, "", "zh-CN", "fr", "__proto__", 3, {}, []]) {
    assert.equal(normalizeLang(lang), "en");
    assert.equal(isLang(lang), false);
    const merged = mergeLanguageState({ lang, setLang: "untrusted" }, { lang: "th", setLang });
    assert.equal(merged.lang, "en");
    assert.equal(merged.setLang, setLang);
  }
  assert.equal(mergeLanguageState(null, { lang: "th" }).lang, "en");
});
test("accessible language names and HTML language tags cover three distinct choices", () => {
  assert.deepEqual(
    LANGUAGE_OPTIONS.map((item) => item.code),
    ["en", "th", "zh"],
  );
  assert.deepEqual(
    LANGUAGE_OPTIONS.map((item) => item.name),
    ["English", "ไทย", "简体中文"],
  );
  assert.equal(htmlLang("zh"), "zh-CN");
  assert.equal(htmlLang("th"), "th");
  assert.equal(htmlLang("invalid"), "en");
});
test("every public and operations copy key exists in all three languages", () => {
  const { copy } = loadTable("copy.ts");
  const expected = Object.keys(leaves(copy.en)).sort();
  assert.ok(expected.length > 200, "Parity should cover the complete copy, not a subset");
  for (const lang of ["th", "zh"])
    assert.deepEqual(Object.keys(leaves(copy[lang])).sort(), expected);
  for (const [section, value] of Object.entries(copy.zh)) {
    assert.match(
      Object.values(leaves(value)).join(" "),
      /[\u3400-\u9fff]/u,
      `${section} must contain actual Chinese`,
    );
  }
  assert.match(copy.zh.contact.sentBody, /尚未发送/u);
  assert.match(copy.zh.contact.handoffNote, /不会自动发送/u);
  assert.match(copy.zh.work.lede, /证据/u);
});
test("Forge copy and exported configuration support every selected language", () => {
  const { forgeCopy } = loadTable("forge/copy.ts");
  const expected = Object.keys(leaves(forgeCopy.en)).sort();
  for (const locale of ["en", "th", "zh"]) {
    assert.deepEqual(Object.keys(leaves(forgeCopy[locale])).sort(), expected);
    const exported = JSON.parse(JSON.stringify({ ...defaultConfig(), locale }));
    assert.deepEqual(validateConfig(exported), []);
    assert.equal(exported.locale, locale);
  }
  for (const locale of ["zh-CN", "fr", "", null])
    assert.ok(validateConfig({ ...defaultConfig(), locale }).includes("locale"));
});
test("work and profile localized content includes Chinese, including every body paragraph", () => {
  const { WORKS, loc } = loadTable("works.ts");
  const { PORTFOLIO_PROFILES, CONCEPT_EVIDENCE } = loadTable("portfolio-profiles.ts");
  let checked = 0;
  function inspect(value) {
    if (!value || typeof value !== "object") return;
    if (Object.hasOwn(value, "en") && Object.hasOwn(value, "th")) {
      assert.ok(Object.hasOwn(value, "zh"), "Localized object missing zh");
      if (Array.isArray(value.en)) {
        assert.equal(value.zh.length, value.en.length);
        for (const paragraph of value.zh) assert.match(paragraph, /[\u3400-\u9fff]/u);
      } else {
        assert.ok(value.zh.trim().length > 0);
        assert.equal(loc(value, "zh"), value.zh);
      }
      checked++;
      return;
    }
    for (const child of Object.values(value)) inspect(child);
  }
  inspect([WORKS, PORTFOLIO_PROFILES, CONCEPT_EVIDENCE]);
  assert.ok(checked >= 90, "Coverage includes all projects, profiles and evidence copy");
});
