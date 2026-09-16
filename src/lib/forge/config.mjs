export const PRESETS = ["creative-studio", "professional-service", "music-event"];
export const THEMES = ["ink", "slate"];
export const SECTIONS = ["profile", "work", "contact"];
export function defaultConfig() {
  return {
    version: 1,
    family: "universal-business",
    preset: "creative-studio",
    theme: "ink",
    locale: "th",
    stack: "tanstack-start",
    scene: "salon",
    density: 4,
    motion: "calm",
    sections: [...SECTIONS],
    evidence: { state: "PROPOSED", clientWorkVerified: false },
    integrations: { delivery: "manual", analytics: "not-instrumented" },
    kpis: { primary: "N/A", driver: "N/A", guardrail: "N/A" },
  };
}
export function validateConfig(value) {
  const errors = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["Expected an object"];
  const exact = (actual, allowed, label) => {
    if (!allowed.includes(actual)) errors.push(label);
  };
  exact(value.version, [1], "version");
  exact(value.family, ["universal-business"], "family");
  exact(value.preset, PRESETS, "preset");
  exact(value.theme, THEMES, "theme");
  exact(value.locale, ["en", "th", "zh"], "locale");
  exact(value.stack, ["tanstack-start"], "stack");
  exact(value.scene, ["salon", "static"], "scene");
  exact(value.motion, ["calm", "paused"], "motion");
  exact(value.density, [2, 4, 8], "density");
  if (
    !Array.isArray(value.sections) ||
    !value.sections.length ||
    value.sections.some((s) => !SECTIONS.includes(s)) ||
    new Set(value.sections).size !== value.sections.length
  )
    errors.push("sections");
  if (value.evidence?.state !== "PROPOSED" || value.evidence?.clientWorkVerified !== false)
    errors.push("evidence");
  if (
    value.integrations?.delivery !== "manual" ||
    value.integrations?.analytics !== "not-instrumented"
  )
    errors.push("integrations");
  if (["primary", "driver", "guardrail"].some((k) => value.kpis?.[k] !== "N/A"))
    errors.push("kpis");
  const shape = defaultConfig();
  if (Object.keys(value).some((k) => !Object.hasOwn(shape, k))) errors.push("unknown fields");
  for (const k of ["evidence", "integrations", "kpis"]) {
    if (
      !value[k] ||
      typeof value[k] !== "object" ||
      Object.keys(value[k]).some((n) => !Object.hasOwn(shape[k], n))
    )
      errors.push(`${k} fields`);
  }
  return errors;
}
