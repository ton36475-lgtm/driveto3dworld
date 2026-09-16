import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SceneStage } from "@/components/scene-stage";
import { Button } from "@/components/ui/button";
import { useCopy, useLocale } from "@/lib/copy";
import { getWork, loc, WORKS } from "@/lib/works";
import { cn } from "@/lib/utils";

type GallerySearch = { work?: string };

export const Route = createFileRoute("/gallery")({
  validateSearch: (raw: Record<string, unknown>): GallerySearch => ({
    work: typeof raw.work === "string" ? raw.work : undefined,
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const copy = useCopy();
  const lang = useLocale();
  const navigate = useNavigate({ from: "/gallery" });
  const search = Route.useSearch();
  const [hovered, setHovered] = useState<string | null>(null);
  const selected = search.work && getWork(search.work) ? search.work : null;

  const selectedWork = useMemo(
    () => WORKS.find((work) => work.slug === selected),
    [selected],
  );
  const hoveredWork = hovered ? getWork(hovered) : undefined;
  const selectedIndex = selectedWork
    ? WORKS.findIndex((work) => work.slug === selectedWork.slug)
    : -1;

  function select(slug: string | null) {
    void navigate({
      search: { work: slug ?? undefined },
      replace: true,
    });
  }

  function cycle(dir: -1 | 1) {
    const current = selected ?? hovered ?? WORKS[0]?.slug;
    if (!current) return;
    const index = WORKS.findIndex((work) => work.slug === current);
    const next = WORKS[(index + dir + WORKS.length) % WORKS.length];
    select(next.slug);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        select(null);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        cycle(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        cycle(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hovered, selected]);

  useEffect(() => {
    if (!selected) return;
    document
      .querySelector(`[data-film="${selected}"]`)
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <main className="relative h-[100svh] min-h-[560px] overflow-hidden bg-background">
      <SceneStage
        works={WORKS}
        selected={selected}
        onHover={setHovered}
        onSelect={select}
        autoRotate={!selected}
        enableZoom
        focus
        label={copy.gallery.loading}
      />
      <div className="pointer-events-none absolute inset-x-0 top-16 z-10 px-4 pt-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.22em] text-muted uppercase">
              {copy.gallery.kicker}
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
              {copy.gallery.title}
            </h1>
            {hoveredWork && !selectedWork ? (
              <p className="mt-2 text-sm text-muted">{loc(hoveredWork.title, lang)}</p>
            ) : null}
          </div>
          <p className="hidden max-w-xs text-right text-xs tracking-widest text-muted uppercase sm:block">
            {copy.gallery.hint}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-3 sm:px-6">
        <div
          className={cn(
            "mx-auto mb-3 max-w-md transition-[opacity,transform] duration-200 ease-out sm:ml-auto sm:mr-0",
            selectedWork
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0",
          )}
        >
          {selectedWork ? (
            <article className="rounded-xl bg-background/92 p-3 shadow-[var(--shadow-border)] sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-widest text-muted uppercase tabular-nums">
                    {String(selectedIndex + 1).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}
                    {" · "}
                    {selectedWork.year} · {loc(selectedWork.location, lang)}
                  </p>
                  <h2 className="mt-1 font-display text-2xl tracking-tight">
                    {loc(selectedWork.title, lang)}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-11 shrink-0 px-0"
                  aria-label={copy.gallery.close}
                  onClick={() => select(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                {loc(selectedWork.excerpt, lang)}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="size-11 shrink-0 px-0"
                  aria-label={copy.case.prev}
                  onClick={() => cycle(-1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button asChild className="min-w-0 flex-1">
                  <Link to="/work/$slug" params={{ slug: selectedWork.slug }}>
                    {copy.gallery.open}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="size-11 shrink-0 px-0"
                  aria-label={copy.case.next}
                  onClick={() => cycle(1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </article>
          ) : null}
        </div>

        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-1">
          {WORKS.map((work) => {
            const on = selected === work.slug;
            return (
              <button
                key={work.slug}
                type="button"
                data-film={work.slug}
                onClick={() => select(on ? null : work.slug)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-md transition-opacity duration-150",
                  on ? "opacity-100 shadow-[var(--shadow-border-hover)]" : "opacity-70 hover:opacity-100",
                )}
                aria-pressed={on}
                aria-label={loc(work.title, lang)}
              >
                <img
                  src={work.image}
                  alt=""
                  className="size-full object-cover"
                  crossOrigin="anonymous"
                />
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
