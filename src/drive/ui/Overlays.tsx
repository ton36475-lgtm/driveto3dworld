import { COPY } from "../data/i18n";
import { useDrive } from "../store";

export function PauseOverlay() {
  const overlay = useDrive((s) => s.overlay);
  const setOverlay = useDrive((s) => s.setOverlay);
  const lang = useDrive((s) => s.lang);
  const c = COPY[lang];
  if (overlay !== "pause") return null;
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-5"
      style={{ background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" }}
      onClick={() => setOverlay("none")}
      role="presentation"
    >
      <div
        className="overlay-panel w-full max-w-sm px-7 py-8 text-center"
        style={{ borderRadius: "var(--radius-sheet)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="pause-title"
      >
        <h2 id="pause-title" className="text-fg font-display mb-2 text-4xl">
          {c.pausedTitle}
        </h2>
        <p className="text-muted mb-6 text-sm">{c.pausedBody}</p>
        <button type="button" className="primary-btn" onClick={() => setOverlay("none")}>
          {c.resume}
        </button>
      </div>
    </div>
  );
}

export function CompleteOverlay() {
  const overlay = useDrive((s) => s.overlay);
  const mark = useDrive((s) => s.markCompleteSeen);
  const setOverlay = useDrive((s) => s.setOverlay);
  const lang = useDrive((s) => s.lang);
  const c = COPY[lang];
  if (overlay !== "complete") return null;
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-5"
      style={{ background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" }}
      role="presentation"
    >
      <div
        className="overlay-panel w-full max-w-md px-7 py-8 text-center"
        style={{ borderRadius: "var(--radius-sheet)" }}
        role="dialog"
        aria-labelledby="done-title"
      >
        <h2 id="done-title" className="text-fg font-display mb-3 text-4xl">
          {c.completeTitle}
        </h2>
        <p className="text-muted mb-7 text-sm leading-relaxed">{c.completeBody}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="primary-btn" onClick={mark}>
            {c.completeCta}
          </button>
          <button type="button" className="ghost-btn" onClick={() => setOverlay("catalog")}>
            {c.works}
          </button>
        </div>
      </div>
    </div>
  );
}
