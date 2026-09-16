export type Lang = "en" | "th" | "zh";
export const LANGUAGE_OPTIONS: readonly Readonly<{
  code: Lang;
  label: string;
  name: string;
  html: string;
}>[];
export function isLang(value: unknown): value is Lang;
export function normalizeLang(value: unknown): Lang;
export function htmlLang(value: unknown): string;
export function mergeLanguageState<T extends { lang: Lang }>(persisted: unknown, current: T): T;
