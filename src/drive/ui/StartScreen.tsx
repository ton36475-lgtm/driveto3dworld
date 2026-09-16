import { Volume2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { unlockAudio, startAudio } from "../systems/audio";
import { useDrive } from "../store";
import { COPY } from "../data/i18n";

export function StartScreen() {
  const start = useDrive((s) => s.start);
  const setOverlay = useDrive((s) => s.setOverlay);
  const lang = useDrive((s) => s.lang);
  const setLang = useDrive((s) => s.setLang);
  const c = COPY[lang];

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
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-muted text-[11px] font-medium tracking-[0.28em] uppercase">{c.kicker}</p>
          <button
            type="button"
            className="ghost-btn !min-h-8 !px-3 text-[11px] tracking-[0.14em] uppercase"
            onClick={() => setLang(lang === "en" ? "th" : "en")}
            aria-label={c.language}
          >
            {lang === "en" ? "TH" : "EN"}
          </button>
        </div>
        <h1 className="text-fg font-display mb-2 text-5xl leading-[0.95] tracking-tight sm:text-6xl">{c.title}</h1>
        <p className="text-muted mb-6 max-w-sm text-sm leading-relaxed">{c.tagline}</p>
        <ul className="text-muted mb-7 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <li>{c.w}</li>
          <li>{c.s}</li>
          <li>{c.a}</li>
          <li>{c.d}</li>
          <li>{c.space}</li>
          <li>{c.stick}</li>
        </ul>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="primary-btn" onClick={onStart}>
            {c.start}
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              unlockAudio();
              void startAudio();
              setOverlay("catalog");
            }}
          >
            {c.browse}
          </button>
          <Link to="/gallery" className="ghost-btn">
            {lang === "th" ? "แกลเลอรี 3D" : "3D salon"}
          </Link>
        </div>
        <p className="text-faint mt-4 flex items-center gap-1.5 text-xs">
          <Volume2 className="size-3.5 shrink-0" strokeWidth={1.75} />
          <span>{c.audioHint}</span>
        </p>
      </div>
    </div>
  );
}
