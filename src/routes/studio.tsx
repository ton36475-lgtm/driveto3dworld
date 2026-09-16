import { createFileRoute, Link } from "@tanstack/react-router";
import { SceneStage } from "@/components/scene-stage";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/copy";
import { featuredWorks } from "@/lib/works";

export const Route = createFileRoute("/studio")({ component: StudioPage });

function StudioPage() {
  const copy = useCopy();
  const maquette = featuredWorks();

  return (
    <main className="pb-24 pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.studio.kicker}</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
          {copy.studio.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{copy.studio.lede}</p>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <div className="relative h-[46vh] min-h-[280px] overflow-hidden rounded-xl bg-surface">
          <SceneStage
            works={maquette}
            selected={null}
            onHover={() => undefined}
            onSelect={() => undefined}
            autoRotate
            enableZoom
            label={copy.gallery.loading}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3">
            <p className="text-xs tracking-widest text-muted uppercase">{copy.gallery.inRoom}</p>
            <div className="pointer-events-auto">
              <Button asChild variant="outline" size="sm">
                <Link to="/gallery">{copy.work.open3d}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-4 px-4 sm:px-6 md:grid-cols-2">
        <figure className="rounded-xl bg-surface p-2">
          <img
            src="/works/studio-bench.jpg"
            alt={copy.studio.bench}
            className="media-frame aspect-[4/3] w-full rounded-lg object-cover"
            crossOrigin="anonymous"
          />
          <figcaption className="px-2 py-3 text-xs tracking-widest text-muted uppercase">
            {copy.studio.bench}
          </figcaption>
        </figure>
        <figure className="rounded-xl bg-surface p-2">
          <img
            src="/works/materials.jpg"
            alt={copy.studio.materials}
            className="media-frame aspect-[4/3] w-full rounded-lg object-cover"
            crossOrigin="anonymous"
          />
          <figcaption className="px-2 py-3 text-xs tracking-widest text-muted uppercase">
            {copy.studio.materials}
          </figcaption>
        </figure>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted">
          <p>{copy.studio.p1}</p>
          <p>{copy.studio.p2}</p>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
        <article className="rounded-xl bg-surface p-6 sm:p-8">
          <p className="font-display text-6xl text-accent/35">S</p>
          <h2 className="mt-4 font-display text-2xl">{copy.studio.sirawat}</h2>
          <p className="mt-1 text-xs tracking-widest text-muted uppercase">
            {copy.studio.sirawatRole}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{copy.studio.sirawatBio}</p>
        </article>
        <article className="rounded-xl bg-surface p-6 sm:p-8">
          <p className="font-display text-6xl text-accent/35">B</p>
          <h2 className="mt-4 font-display text-2xl">{copy.studio.ball}</h2>
          <p className="mt-1 text-xs tracking-widest text-muted uppercase">
            {copy.studio.ballRole}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{copy.studio.ballBio}</p>
        </article>
      </div>

      <nav
        aria-label="Profiles"
        className="mx-auto mt-12 flex max-w-6xl flex-wrap gap-3 px-4 sm:px-6"
      >
        <Button asChild variant="outline">
          <Link to="/people/$person" params={{ person: "ball" }}>
            Ball / พี่บอล
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/people/$person" params={{ person: "ton" }}>
            Sirawat / ต้น
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/people/$person" params={{ person: "studio" }}>
            SIRAWAT × BALL
          </Link>
        </Button>
      </nav>
      <div className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <Button asChild size="lg">
          <Link to="/contact">{copy.cta.button}</Link>
        </Button>
      </div>
    </main>
  );
}
