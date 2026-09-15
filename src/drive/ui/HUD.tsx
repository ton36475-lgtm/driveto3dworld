import { CloudRain, Gem, Volume2, VolumeX } from "lucide-react";
import { PROJECTS, ZONE_BY_ID } from "../data/projects";
import { setMuted } from "../systems/audio";
import { useDrive } from "../store";
import { Minimap } from "./Minimap";

export function HUD() {
  const collected = useDrive((s) => s.collected);
  const fps = useDrive((s) => s.fps);
  const muted = useDrive((s) => s.muted);
  const toggleMute = useDrive((s) => s.toggleMute);
  const zoneId = useDrive((s) => s.zoneId);
  const weather = useDrive((s) => s.weather);
  const cycleWeather = useDrive((s) => s.cycleWeather);
  const zone = zoneId ? ZONE_BY_ID[zoneId as keyof typeof ZONE_BY_ID] : null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-3 sm:p-4" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-fg text-xl leading-none sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Atelier Drive
          </p>
          <p className="text-muted mt-1 text-[11px] tracking-[0.18em] uppercase">
            {zone ? zone.name : "Plaza"}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="hud-chip">
            <Gem className="size-3.5" strokeWidth={1.75} />
            <span>
              {collected.length}/{PROJECTS.length}
            </span>
          </div>
          <div className="hud-chip hidden sm:inline-flex">{fps} fps</div>
          <button
            type="button"
            className="hud-chip"
            onClick={() => {
              toggleMute();
              setMuted(!muted);
            }}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="size-3.5" strokeWidth={1.75} /> : <Volume2 className="size-3.5" strokeWidth={1.75} />}
            <span className="hidden sm:inline">{muted ? "Unmute" : "Mute"}</span>
          </button>
          <button type="button" className="hud-chip" onClick={cycleWeather} aria-label="Cycle weather">
            <CloudRain className="size-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">{weather}</span>
          </button>
        </div>
      </div>
      <div className="pointer-events-none absolute right-3 top-[4.5rem] hidden sm:block">
        <Minimap />
      </div>
      <p className="text-faint pointer-events-none absolute bottom-4 left-4 hidden text-[11px] tracking-wide sm:block">
        WASD · arrows · space · touch · gamepad
      </p>
    </div>
  );
}
