import { PROJECTS, t } from "../data/projects";
import { useLang } from "@/lib/lang";
import { CONCEPT_COPY, CONCEPT_DIRECTIONS } from "../data/concepts";
import { COPY } from "../data/i18n";

/** Every study remains readable without a GPU, WebGL context or driving controls. */
export function StudyFallback() {
  const lang = useLang((state) => state.lang);
  const c = COPY[lang];
  return (
    <section className="absolute inset-0 overflow-y-auto bg-background px-6 pb-12 pt-28 text-foreground" aria-labelledby="study-fallback-title">
      <div className="mx-auto max-w-4xl">
        <h1 id="study-fallback-title" className="font-display text-3xl">{c.fallbackTitle}</h1>
        <p role="status" className="mb-6 mt-3 text-muted">{c.fallbackBody}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <article key={project.id} className="rounded-lg border border-white/15 p-5">
              <h2 className="font-display text-xl">{t(project.title, lang)}</h2>
              <p className="mt-1 text-xs text-muted">{CONCEPT_COPY[lang].label}</p>
              <p className="mt-3 text-sm">{CONCEPT_DIRECTIONS[project.id]?.[lang]}</p>
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer underline underline-offset-4">{c.readStudy}</summary>
                <p className="mt-3 leading-relaxed">{CONCEPT_COPY[lang].notice}</p>
                <p className="mt-3 leading-relaxed">{CONCEPT_COPY[lang].metrics}: {CONCEPT_COPY[lang].pending}</p>
              </details>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-5">
          <a href="/work" className="underline underline-offset-4">{c.workIndex}</a>
          <a href="/foodtruck" className="underline underline-offset-4">{c.foodtruck}</a>
        </div>
      </div>
    </section>
  );
}
