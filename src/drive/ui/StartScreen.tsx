import { Volume2 } from "lucide-react";
import { unlockAudio, startAudio } from "../systems/audio";
import { useDrive } from "../store";

export function StartScreen() {
  const start = useDrive((s) => s.start);

  const onStart = () => {
    unlockAudio();
    void startAudio();
    start();
    if (typeof window !== "undefined") window.__driveReady = true;
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center p-5 sm:items-center sm:p-8">
      <div
        className="overlay-panel pointer-events-auto w-full max-w-lg px-6 py-7 sm:px-9 sm:py-9"
        style={{ borderRadius: "var(--radius-sheet)" }}
      >
        <p className="text-muted mb-3 text-[11px] font-medium tracking-[0.28em] uppercase">
          Godzfath3r · Phitsanulok
        </p>
        <h1
          className="text-fg mb-2 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Atelier Drive
        </h1>
        <p className="text-muted mb-6 max-w-sm text-sm leading-relaxed">
          A 3D design grounds you can drive. Four zones, twelve hidden crystals. Collect a piece to open it.
        </p>
        <ul className="text-muted mb-7 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <li>W / ↑ accelerate</li>
          <li>S / ↓ reverse</li>
          <li>A / ← turn left</li>
          <li>D / → turn right</li>
          <li>Space brake</li>
          <li>Stick · gamepad</li>
        </ul>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="primary-btn" onClick={onStart}>
            Start driving
          </button>
          <span className="text-faint inline-flex items-center gap-1.5 text-xs">
            <Volume2 className="size-3.5" strokeWidth={1.75} />
            Audio unlocks on start
          </span>
        </div>
      </div>
    </div>
  );
}
