import { PROJECTS, ZONE_BY_ID } from "../data/projects";
import { useDrive } from "../store";

export function ProjectModal() {
  const activeId = useDrive((s) => s.activeId);
  const close = useDrive((s) => s.closeModal);
  const project = PROJECTS.find((p) => p.id === activeId);
  if (!project) return null;
  const zone = ZONE_BY_ID[project.zone];

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center p-3 sm:items-center sm:p-6"
      style={{ background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" }}
      onClick={close}
      role="presentation"
    >
      <div
        className="overlay-panel w-full max-w-md px-5 py-5 sm:px-7 sm:py-7"
        style={{ borderRadius: "var(--radius-sheet)", borderTop: `2px solid ${project.color}` }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="project-title"
      >
        <p className="text-muted mb-2 text-[11px] tracking-[0.22em] uppercase">
          {zone.name} · {project.year} · {project.medium}
        </p>
        <h2
          id="project-title"
          className="text-fg mb-3 text-3xl leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h2>
        <p className="text-muted mb-6 text-sm leading-relaxed">{project.description}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-faint text-xs tracking-wide">Crystal collected</span>
          <button type="button" className="ghost-btn" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
