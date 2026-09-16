import { PROJECTS, t } from "../data/projects";
import { useLang } from "@/lib/lang";
import { CONCEPT_COPY, CONCEPT_DIRECTIONS } from "../data/concepts";

/** Every study remains readable without a GPU, WebGL context or driving controls. */
export function StudyFallback() {
  const lang = useLang((state) => state.lang);
  return (
    <section className="absolute inset-0 overflow-y-auto bg-background px-6 pb-12 pt-28 text-foreground" aria-labelledby="study-fallback-title">
      <div className="mx-auto max-w-4xl">
        <h1 id="study-fallback-title" className="font-display text-3xl">{lang === "th" ? "ชมผลงานแบบรายการ" : "Explore the studies"}</h1>
        <p role="status" className="mb-6 mt-3 text-muted">{lang === "th" ? "เปิดฉากสามมิติบนอุปกรณ์นี้ไม่ได้ คุณยังอ่านผลงานทั้งหมดด้านล่างได้" : "The 3D scene is unavailable on this device. All studies are available below."}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <article key={project.id} className="rounded-lg border border-white/15 p-5">
              <h2 className="font-display text-xl">{t(project.title, lang)}</h2>
              <p className="mt-1 text-xs text-muted">{CONCEPT_COPY[lang].label}</p>
              <p className="mt-3 text-sm">{CONCEPT_DIRECTIONS[project.id]?.[lang]}</p>
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer underline underline-offset-4">{lang === "th" ? "อ่านรายละเอียด" : "Read study"}</summary>
                <p className="mt-3 leading-relaxed">{CONCEPT_COPY[lang].notice}</p>
                <p className="mt-3 leading-relaxed">{CONCEPT_COPY[lang].metrics}: {CONCEPT_COPY[lang].pending}</p>
              </details>
            </article>
          ))}
        </div>
        <a href="/work" className="mt-6 inline-block underline underline-offset-4">{lang === "th" ? "สารบัญผลงาน" : "Work index"}</a>
      </div>
    </section>
  );
}
