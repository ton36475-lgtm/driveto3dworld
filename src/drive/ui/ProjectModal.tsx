import { useEffect } from "react";
import { PROJECTS, ZONE_BY_ID, t } from "../data/projects";
import { COPY } from "../data/i18n";
import { useDrive } from "../store";
import { unlockAudio, startAudio } from "../systems/audio";
import { CONCEPT_COPY, CONCEPT_DIRECTIONS } from "../data/concepts";

export function ProjectModal() {
  const activeId = useDrive((s) => s.activeId);
  const close = useDrive((s) => s.closeModal);
  const lang = useDrive((s) => s.lang);
  const collected = useDrive((s) => s.collected);
  const setWaypoint = useDrive((s) => s.setWaypoint);
  const start = useDrive((s) => s.start);
  const openProject = useDrive((s) => s.openProject);
  const project = PROJECTS.find((p) => p.id === activeId);
  const c = COPY[lang];
  const concept = CONCEPT_COPY[lang];

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, close]);

  if (!project) return null;
  const zone = ZONE_BY_ID[project.zone];
  const related = PROJECTS.filter((p) => p.zone === project.zone && p.id !== project.id);

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center p-3 sm:items-center sm:p-6"
      style={{ background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" }}
      onClick={close}
      role="presentation"
    >
      <div
        className="overlay-panel max-h-[88vh] w-full max-w-md overflow-y-auto px-5 py-5 sm:px-7 sm:py-7"
        style={{ borderRadius: "var(--radius-sheet)", borderTop: `2px solid ${project.color}` }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="project-title"
      >
        <div
          className="mb-4 h-24 w-full"
          style={{
            borderRadius: "var(--radius-md)",
            background: `linear-gradient(135deg, ${project.color}55, color-mix(in oklab, var(--color-surface) 80%, transparent))`,
            border: "1px solid var(--color-border)",
          }}
          aria-hidden
        />
        <p className="text-muted mb-2 text-[11px] tracking-[0.22em] uppercase">
          {t(zone.name, lang)}
        </p>
        <h2 id="project-title" className="text-fg font-display mb-3 text-3xl leading-tight">
          {t(project.title, lang)}
        </h2>
        <p className="mb-4 inline-block rounded-full border border-white/20 px-3 py-1 text-[11px] tracking-wide">{concept.label}</p>
        <p className="text-muted mb-2 text-[11px] tracking-widest uppercase">{concept.direction}</p>
        <p className="text-muted mb-4 text-sm leading-relaxed">{CONCEPT_DIRECTIONS[project.id]?.[lang]}</p>
        <dl className="mb-4 grid grid-cols-2 gap-3 rounded-lg border border-white/10 p-3 text-xs">
          <div><dt className="text-faint mb-1">{concept.metrics}</dt><dd>{concept.pending}</dd></div>
          <div><dt className="text-faint mb-1">{concept.production}</dt><dd>{concept.unverified}</dd></div>
        </dl>
        <p className="text-faint mb-6 text-xs leading-relaxed">{concept.notice}</p>
        {related.length > 0 && (
          <div className="mb-6">
            <p className="text-faint mb-2 text-[11px] tracking-[0.18em] uppercase">{c.related}</p>
            <div className="flex flex-col gap-1">
              {related.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="text-fg flex items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm"
                  style={{ background: "transparent" }}
                  onClick={() => openProject(p.id)}
                >
                  <span>{t(p.title, lang)}</span>
                  <span className="text-faint text-[11px]">{collected.includes(p.id) ? c.found : c.hidden}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-faint text-xs tracking-wide">{collected.includes(project.id) ? c.collected : c.hidden}</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => {
                setWaypoint({ x: project.x, z: project.z, id: project.id });
                unlockAudio();
                void startAudio();
                start();
                close();
                if (typeof window !== "undefined") window.__driveReady = true;
              }}
            >
              {c.driveThere}
            </button>
            <button type="button" className="primary-btn !min-h-11 !px-5" onClick={close}>
              {c.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
