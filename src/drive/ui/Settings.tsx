import { COPY, LANGUAGE_LABELS } from "../data/i18n";
import { useDrive, saveDaySettings, type Quality, type Weather } from "../store";
import { dayState, setDayPaused, setDayTime } from "../systems/dayNight";
import { useEffect, useState, type ReactNode } from "react";

export function Settings() {
  const overlay = useDrive((s) => s.overlay);
  const setOverlay = useDrive((s) => s.setOverlay);
  const lang = useDrive((s) => s.lang);
  const setLang = useDrive((s) => s.setLang);
  const muted = useDrive((s) => s.muted);
  const setMuted = useDrive((s) => s.setMuted);
  const weather = useDrive((s) => s.weather);
  const setWeather = useDrive((s) => s.setWeather);
  const quality = useDrive((s) => s.quality);
  const setQuality = useDrive((s) => s.setQuality);
  const resetProgress = useDrive((s) => s.resetProgress);
  const [day, setDay] = useState(dayState.time);
  const [frozen, setFrozen] = useState(dayState.paused);
  const c = COPY[lang];

  useEffect(() => {
    if (overlay === "settings") {
      setDay(dayState.time);
      setFrozen(dayState.paused);
    }
  }, [overlay]);

  if (overlay !== "settings") return null;

  const weathers: Weather[] = ["auto", "clear", "rain", "snow"];
  const qualities: Quality[] = ["high", "medium", "low"];
  const weatherLabel: Record<Weather, string> = {
    auto: c.weatherAuto,
    clear: c.weatherClear,
    rain: c.weatherRain,
    snow: c.weatherSnow,
  };
  const qualityLabel: Record<Quality, string> = {
    high: c.qualityHigh,
    medium: c.qualityMedium,
    low: c.qualityLow,
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center p-3 sm:items-center sm:p-6"
      style={{ background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" }}
      onClick={() => setOverlay("none")}
      role="presentation"
    >
      <div
        className="overlay-panel w-full max-w-md px-5 py-5 sm:px-7 sm:py-7"
        style={{ borderRadius: "var(--radius-sheet)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="settings-title"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <h2 id="settings-title" className="text-fg font-display text-3xl leading-tight">
            {c.settings}
          </h2>
          <button type="button" className="ghost-btn" onClick={() => setOverlay("none")}>
            {c.close}
          </button>
        </div>

        <Field label={c.language}>
          <div className="flex gap-2">
            {(["th", "zh", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                className={lang === l ? "primary-btn !min-h-10 !px-4" : "ghost-btn !min-h-10 !px-4"}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
              >
                {LANGUAGE_LABELS[l]}
              </button>
            ))}
          </div>
        </Field>

        <Field label={muted ? c.unmute : c.mute}>
          <button type="button" className="ghost-btn" onClick={() => setMuted(!muted)}>
            {muted ? c.unmute : c.mute}
          </button>
        </Field>

        <Field label={c.weather}>
          <div className="flex flex-wrap gap-1.5">
            {weathers.map((w) => (
              <button
                key={w}
                type="button"
                className={weather === w ? "primary-btn !min-h-9 !px-3 text-xs" : "ghost-btn !min-h-9 !px-3 text-xs"}
                onClick={() => setWeather(w)}
              >
                {weatherLabel[w]}
              </button>
            ))}
          </div>
        </Field>

        <Field label={c.quality}>
          <div className="flex flex-wrap gap-1.5">
            {qualities.map((q) => (
              <button
                key={q}
                type="button"
                className={quality === q ? "primary-btn !min-h-9 !px-3 text-xs" : "ghost-btn !min-h-9 !px-3 text-xs"}
                onClick={() => setQuality(q)}
              >
                {qualityLabel[q]}
              </button>
            ))}
          </div>
        </Field>

        <Field label={c.dayNight}>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(day * 100)}
              onChange={(e) => {
                const v = Number(e.target.value) / 100;
                setDay(v);
                setDayTime(v);
                saveDaySettings();
              }}
              className="h-2 flex-1"
              aria-label={c.dayNight}
            />
            <button
              type="button"
              className="ghost-btn !min-h-9 !px-3 text-xs"
              onClick={() => {
                const next = !frozen;
                setFrozen(next);
                setDayPaused(next);
                saveDaySettings();
              }}
            >
              {frozen ? c.playCycle : c.freezeCycle}
            </button>
          </div>
        </Field>

        <div className="mt-2 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-faint mb-2 text-xs">{c.resetHint}</p>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              resetProgress();
              setOverlay("none");
            }}
          >
            {c.reset}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-muted mb-2 text-[11px] tracking-[0.18em] uppercase">{label}</p>
      {children}
    </div>
  );
}
