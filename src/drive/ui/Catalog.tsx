import { useMemo, useState } from "react";
import { PROJECTS, ZONES, t, type ZoneId } from "../data/projects";
import { COPY } from "../data/i18n";
import { useDrive } from "../store";
import { unlockAudio, startAudio } from "../systems/audio";

export function Catalog() {
  const overlay = useDrive((s) => s.overlay);
  const setOverlay = useDrive((s) => s.setOverlay);
  const lang = useDrive((s) => s.lang);
  const collected = useDrive((s) => s.collected);
  const openProject = useDrive((s) => s.openProject);
  const setWaypoint = useDrive((s) => s.setWaypoint);
  const start = useDrive((s) => s.start);
  const [filter, setFilter] = useState<"all" | ZoneId>("all");
  const c = COPY[lang];

  const list = useMemo(
    () => PROJECTS.filter((p) => (filter === "all" ? true : p.zone === filter)),
    [filter],
  );

  if (overlay !== "catalog") return null;

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center p-3 sm:items-center sm:p-6"
      style={{ background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" }}
      onClick={() => setOverlay("none")}
      role="presentation"
    >
      <div
        className="overlay-panel flex max-h-[88vh] w-full max-w-lg flex-col px-5 py-5 sm:px-7 sm:py-7"
        style={{ borderRadius: "var(--radius-sheet)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="catalog-title"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-muted text-[11px] tracking-[0.22em] uppercase">
              {collected.length}/{PROJECTS.length}
            </p>
            <h2 id="catalog-title" className="text-fg font-display text-3xl leading-tight">
              {c.works}
            </h2>
          </div>
          <button type="button" className="ghost-btn" onClick={() => setOverlay("none")}>
            {c.close}
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            className={filter === "all" ? "primary-btn !min-h-9 !px-3 text-xs" : "ghost-btn !min-h-9 !px-3 text-xs"}
            onClick={() => setFilter("all")}
          >
            {c.allZones}
          </button>
          {ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              className={filter === z.id ? "primary-btn !min-h-9 !px-3 text-xs" : "ghost-btn !min-h-9 !px-3 text-xs"}
              onClick={() => setFilter(z.id)}
            >
              {t(z.name, lang)}
            </button>
          ))}
        </div>
        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {list.map((p) => {
            const found = collected.includes(p.id);
            return (
              <li key={p.id}>
                <div
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                  style={{
                    background: "color-mix(in oklab, var(--color-surface-2) 70%, transparent)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: p.color, opacity: found ? 1 : 0.35 }}
                  />
                  <button type="button" className="min-w-0 flex-1 text-left" onClick={() => openProject(p.id)}>
                    <p className="text-fg truncate text-sm">{t(p.title, lang)}</p>
                    <p className="text-faint truncate text-[11px] tracking-wide">
                      {t(ZONES.find((z) => z.id === p.zone)!.name, lang)} · {p.year} · {found ? c.found : c.hidden}
                    </p>
                  </button>
                  <button
                    type="button"
                    className="ghost-btn !min-h-9 !px-3 text-[11px]"
                    onClick={() => {
                      setWaypoint({ x: p.x, z: p.z, id: p.id });
                      unlockAudio();
                      void startAudio();
                      start();
                      setOverlay("none");
                      if (typeof window !== "undefined") window.__driveReady = true;
                    }}
                  >
                    {c.driveThere}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
