import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SceneStage } from "@/components/scene-stage";
import { Button } from "@/components/ui/button";
import { useCopy, useLocale } from "@/lib/copy";
import { adjacentWork, getWork, loc } from "@/lib/works";
import { PortfolioEvidence } from "@/components/portfolio-evidence";
import { CONCEPT_EVIDENCE } from "@/lib/portfolio-profiles";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const work = getWork(params.slug);
    if (!work) throw notFound();
    return work;
  },
  component: CaseStudyPage,
  notFoundComponent: WorkMissing,
});

function CaseStudyPage() {
  const work = Route.useLoaderData();
  const copy = useCopy();
  const lang = useLocale();
  const prev = adjacentWork(work.slug, -1);
  const next = adjacentWork(work.slug, 1);

  return (
    <main className="pb-24 pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to="/work">
            <ArrowLeft className="size-4" />
            {copy.case.back}
          </Link>
        </Button>
        <PortfolioEvidence compact className="mt-8" />
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">
          {loc(work.title, lang)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{loc(work.subtitle, lang)}</p>
        <PortfolioEvidence className="mt-6" />
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <figure className="overflow-hidden rounded-xl bg-surface p-2">
          <img
            src={work.image}
            alt={loc(work.title, lang)}
            className="media-frame aspect-[16/10] w-full rounded-lg object-cover"
            crossOrigin="anonymous"
          />
          <figcaption className="px-2 py-3 text-xs leading-relaxed text-muted">
            {loc(CONCEPT_EVIDENCE.imageCaption, lang)}
          </figcaption>
        </figure>
      </div>

      <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        <div className="relative h-[48vh] min-h-[280px] overflow-hidden rounded-xl bg-surface">
          <SceneStage
            works={[work]}
            selected={work.slug}
            onHover={() => undefined}
            onSelect={() => undefined}
            autoRotate
            enableZoom
            layout="solo"
            label={copy.gallery.loading}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3">
            <p className="text-xs tracking-widest text-muted uppercase">{copy.case.inRoom}</p>
            <div className="pointer-events-auto">
              <Button asChild variant="outline" size="sm">
                <Link to="/gallery" search={{ work: work.slug }}>
                  {copy.case.openGallery}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-14 grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_16rem]">
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted">
          <h2 className="font-display text-2xl text-foreground">
            {lang === "th" ? "สำรวจแนวคิด" : "Explore the concept"}
          </h2>
          <p>
            {lang === "th"
              ? "ใช้ภาพและห้องสามมิติเพื่อสำรวจองค์ประกอบ วัสดุ แสง และการนำเสนอ เปรียบเทียบแนวทางกับงานศึกษาอื่นในแกลเลอรีได้"
              : "Use the image and 3D room to explore composition, materials, light and presentation. Compare this visual direction with the other studies in the gallery."}
          </p>
          <p>
            {lang === "th"
              ? "ข้อมูลโครงการและเครดิตจะเพิ่มเติมเมื่อมีหลักฐานยืนยัน หน้านี้ยังไม่แสดงชื่อลูกค้า บทบาทผู้สร้าง หรือผลลัพธ์การส่งมอบจริง"
              : "Project details and credits can be added when supporting evidence is available. Client commissions, creator roles and delivery outcomes remain unverified."}
          </p>
        </div>
        <aside className="space-y-6 text-sm">
          <Meta
            label={lang === "th" ? "สถานะ" : "Status"}
            value={loc(CONCEPT_EVIDENCE.label, lang)}
          />
          <Meta
            label={lang === "th" ? "หัวข้อศึกษา" : "Study areas"}
            value={work.disciplines.map((discipline) => copy.filters[discipline]).join(" · ")}
          />
          <Button asChild variant="outline" className="w-full">
            <Link to="/gallery" search={{ work: work.slug }}>
              {copy.case.openGallery}
            </Link>
          </Button>
        </aside>
      </div>

      <nav className="mx-auto mt-20 flex max-w-6xl items-center justify-between gap-4 border-t border-line px-4 pt-8 sm:px-6">
        {prev ? (
          <Link
            to="/work/$slug"
            params={{ slug: prev.slug }}
            className="group flex min-h-11 items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>
              <span className="block text-xs tracking-widest uppercase">{copy.case.prev}</span>
              {loc(prev.title, lang)}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="group flex min-h-11 items-center gap-2 text-right text-sm text-muted hover:text-foreground"
          >
            <span>
              <span className="block text-xs tracking-widest uppercase">{copy.case.next}</span>
              {loc(next.title, lang)}
            </span>
            <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </nav>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs tracking-widest text-faint uppercase">{label}</p>
      <p className="mt-1 text-foreground">{value}</p>
    </div>
  );
}

function WorkMissing() {
  const copy = useCopy();
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl">{copy.notFound.title}</h1>
      <p className="mt-3 text-muted">{copy.notFound.body}</p>
      <Button asChild className="mt-8">
        <Link to="/work">{copy.notFound.back}</Link>
      </Button>
    </main>
  );
}
