import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { SceneStage } from "@/components/scene-stage";
import { SectionKicker } from "@/components/section-kicker";
import { Button } from "@/components/ui/button";
import { WorkCard } from "@/components/work-card";
import { useCopy, useLocale } from "@/lib/copy";
import { featuredWorks, getWork, loc, WORKS } from "@/lib/works";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const copy = useCopy();
  const lang = useLocale();
  const navigate = useNavigate();
  const selected = featuredWorks();
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredWork = hovered ? getWork(hovered) : undefined;

  return (
    <main className="portfolio-home">
      <section className="relative min-h-[100svh] overflow-hidden bg-background md:h-[100svh] md:min-h-[560px]">
        <div className="relative h-[55svh] min-h-[320px] md:absolute md:inset-0 md:h-auto">
          <SceneStage
            works={WORKS}
            selected={hovered}
            onHover={setHovered}
            onSelect={(slug) => navigate({ to: "/gallery", search: { work: slug } })}
            label={copy.gallery.loading}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/55" />
        </div>
        <div className="pointer-events-none relative z-10 px-4 pb-8 sm:px-8 sm:pb-10 md:absolute md:inset-x-0 md:bottom-0">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.hero.eyebrow}</p>
              <h1 className="mt-3 font-display text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {copy.hero.title}
              </h1>
              <p className="mt-3 max-w-md text-sm text-muted sm:text-base">
                {hoveredWork ? loc(hoveredWork.subtitle, lang) : copy.hero.lede}
              </p>
            </div>
            <div className="pointer-events-auto flex flex-col items-start gap-3 md:items-end">
              <p className="hidden text-xs tracking-widest text-muted uppercase sm:block">
                {copy.hero.hint}
              </p>
              <p className="text-xs tracking-widest text-muted uppercase sm:hidden">
                {copy.hero.hintMobile}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/gallery">{copy.hero.enterGallery}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/drive">{copy.hero.enterDrive}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/work">{copy.hero.viewWork}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/foodtruck">
                    {loc(
                      {
                        en: "Explore the food truck",
                        th: "สำรวจฟู้ดทรัก",
                        zh: "探索餐车",
                      },
                      lang,
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionKicker index={copy.manifesto.index} label={copy.manifesto.kicker} />
        <h2 className="mt-5 max-w-3xl font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
          {copy.manifesto.title}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{copy.manifesto.body}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionKicker index={copy.selected.index} label={copy.selected.kicker} />
            <h2 className="mt-5 font-display text-3xl tracking-tight sm:text-4xl">
              {copy.selected.title}
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/work" className="hidden sm:inline-flex">
              {copy.selected.all}
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {selected.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
        <div className="mt-8 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link to="/work">{copy.selected.all}</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-28 md:grid-cols-2">
          <div className="md:col-span-2">
            <SectionKicker index={copy.duo.index} label={copy.duo.kicker} />
            <h2 className="mt-5 font-display text-3xl tracking-tight sm:text-4xl">
              {copy.duo.title}
            </h2>
          </div>
          <article className="rounded-xl bg-background p-6 sm:p-8">
            <p className="font-display text-6xl text-accent/40">S</p>
            <h3 className="mt-4 font-display text-2xl">Sirawat</h3>
            <p className="mt-1 text-xs tracking-widest text-muted uppercase">
              {copy.duo.sirawatRole}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{copy.duo.sirawatBody}</p>
          </article>
          <article className="rounded-xl bg-background p-6 sm:p-8">
            <p className="font-display text-6xl text-accent/40">B</p>
            <h3 className="mt-4 font-display text-2xl">Ball</h3>
            <p className="mt-1 text-xs tracking-widest text-muted uppercase">{copy.duo.ballRole}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{copy.duo.ballBody}</p>
          </article>
          <div className="md:col-span-2">
            <Button asChild variant="outline">
              <Link to="/studio">{copy.duo.studioLink}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionKicker index={copy.process.index} label={copy.process.kicker} />
        <h2 className="mt-5 font-display text-3xl tracking-tight sm:text-4xl">
          {copy.process.title}
        </h2>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {copy.process.steps.map((step) => (
            <li key={step.n} className="rounded-xl bg-surface p-5">
              <p className="font-display text-sm tabular-nums text-faint">{step.n}</p>
              <h3 className="mt-4 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-20 sm:px-6 sm:py-28 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.cta.kicker}</p>
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
              {copy.cta.title}
            </h2>
            <p className="mt-4 text-muted">{copy.cta.body}</p>
          </div>
          <Button asChild size="lg">
            <Link to="/contact">{copy.cta.button}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
