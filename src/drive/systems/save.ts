export type Weather = "auto" | "clear" | "rain" | "snow";
export type Quality = "high" | "medium" | "low";
export type DriveSave = {
  version: 2;
  collected: string[];
  muted: boolean;
  weather: Weather;
  lang: "en" | "th";
  quality: Quality;
  dayPaused: boolean;
  dayTime: number;
};

/** A save file is untrusted input: old, corrupt and future versions must stay playable. */
export function normalizeSave(raw: unknown, validIds: readonly string[], defaultQuality: Quality = "high"): DriveSave {
  const value = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const data = value.version === undefined || value.version === 1 || value.version === 2 ? value : {};
  const ids = new Set(validIds);
  const collected = Array.isArray(data.collected)
    ? [...new Set(data.collected.filter((id): id is string => typeof id === "string" && ids.has(id)))]
    : [];
  return {
    version: 2,
    collected,
    muted: data.muted === true,
    weather: data.weather === "clear" || data.weather === "rain" || data.weather === "snow" ? data.weather : "auto",
    lang: data.lang === "th" ? "th" : "en",
    quality: data.quality === "high" || data.quality === "medium" || data.quality === "low" ? data.quality : defaultQuality,
    dayPaused: data.dayPaused === true,
    dayTime: typeof data.dayTime === "number" && Number.isFinite(data.dayTime)
      ? ((data.dayTime % 1) + 1) % 1 : 0.32,
  };
}
