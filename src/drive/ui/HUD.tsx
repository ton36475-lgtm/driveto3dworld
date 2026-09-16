import { CloudRain, Gem, LayoutGrid, Pause, Settings2, Volume2, VolumeX } from "lucide-react";
import { PROJECTS, ZONE_BY_ID, nearestProject, t } from "../data/projects";
import { COPY } from "../data/i18n";
import { useDrive } from "../store";
import { Minimap } from "./Minimap";
import { sim } from "../systems/sim";
import { useEffect, useState } from "react";

export function HUD() {
  const collected = useDrive((s) => s.collected);
  const fps = useDrive((s) => s.fps);
  const muted = useDrive((s) => s.muted);
  const setMuted = useDrive((s) => s.setMuted);
  const zoneId = useDrive((s) => s.zoneId);
  const weather = useDrive((s) => s.weather);
  const cycleWeather = useDrive((s) => s.cycleWeather);
  const lang = useDrive((s) => s.lang);
  const toggleOverlay = useDrive((s) => s.toggleOverlay);
  const speedKmh = useDrive((s) => s.speedKmh);
  const zone = zoneId ? ZONE_BY_ID[zoneId as keyof typeof ZONE_BY_ID] : null;
  const c = COPY[lang];
  const [hint, setHint] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const n = nearestProject(sim.x, sim.z, collected);
      if (!n) {
        setHint("");
        return;
      }
      setHint(`${c.nearest} · ${t(n.project.title, lang)} · ${n.dist.toFixed(0)}m`);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [collected, lang, c.nearest]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 p-3 sm:p-4"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-fg font-display text-xl leading-none sm:text-2xl">{c.title}</p>
          <p className="text-muted mt-1 text-[11px] tracking-[0.18em] uppercase">
            {zone ? t(zone.name, lang) : c.plaza}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="hud-chip">
            <Gem className="size-3.5" strokeWidth={1.75} />
            <span>
              {collected.length}/{PROJECTS.length}
            </span>
          </div>
          <div className="hud-chip hidden sm:inline-flex">{Math.round(speedKmh)} km/h</div>
          <div className="hud-chip hidden sm:inline-flex">
            {fps} {c.fps}
          </div>
          <button type="button" className="hud-chip" onClick={() => toggleOverlay("catalog")} aria-label={c.works}>
            <LayoutGrid className="size-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">{c.works}</span>
          </button>
          <button
            type="button"
            className="hud-chip"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? c.unmute : c.mute}
          >
            {muted ? <VolumeX className="size-3.5" strokeWidth={1.75} /> : <Volume2 className="size-3.5" strokeWidth={1.75} />}
            <span className="hidden sm:inline">{muted ? c.unmute : c.mute}</span>
          </button>
          <button type="button" className="hud-chip" onClick={cycleWeather} aria-label={c.weather}>
            <CloudRain className="size-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">{weather}</span>
          </button>
          <button type="button" className="hud-chip" onClick={() => toggleOverlay("settings")} aria-label={c.settings}>
            <Settings2 className="size-3.5" strokeWidth={1.75} />
          </button>
          <button type="button" className="hud-chip" onClick={() => toggleOverlay("pause")} aria-label={c.pause}>
            <Pause className="size-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <div className="pointer-events-auto absolute right-3 top-[4.5rem] hidden sm:block">
        <Minimap interactive />
      </div>
      {hint && (
        <p className="text-muted pointer-events-none absolute bottom-16 left-1/2 hidden max-w-xs -translate-x-1/2 text-center text-[11px] tracking-wide sm:block">
          {hint}
        </p>
      )}
      <p className="text-faint pointer-events-none absolute bottom-4 left-4 hidden text-[11px] tracking-wide sm:block">
        {c.hint}
      </p>
    </div>
  );
}
