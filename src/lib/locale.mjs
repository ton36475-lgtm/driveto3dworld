/** Supported public languages. Stored codes stay stable across UI revisions. */
export const LANGUAGE_OPTIONS = Object.freeze([
  Object.freeze({ code: "en", label: "EN", name: "English", html: "en" }),
  Object.freeze({ code: "th", label: "TH", name: "ไทย", html: "th" }),
  Object.freeze({ code: "zh", label: "中文", name: "简体中文", html: "zh-CN" }),
]);
export function isLang(value) {
  return LANGUAGE_OPTIONS.some((option) => option.code === value);
}
export function normalizeLang(value) {
  return isLang(value) ? value : "en";
}
export function htmlLang(value) {
  return LANGUAGE_OPTIONS.find((option) => option.code === normalizeLang(value)).html;
}
/** Retain valid v0 EN/TH preferences; never merge untrusted storage methods into the store. */
export function mergeLanguageState(persisted, current) {
  const candidate = persisted && typeof persisted === "object" ? persisted.lang : undefined;
  return { ...current, lang: normalizeLang(candidate) };
}
