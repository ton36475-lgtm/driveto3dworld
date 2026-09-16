import { createFileRoute, Link } from "@tanstack/react-router";
import { LocalData } from "@/components/ops/local-data";
import { OpsNav } from "@/components/ops/ops-nav";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/copy";

export const Route = createFileRoute("/kit")({ component: KitPage });

function KitPage() {
  const copy = useCopy();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.ops.kicker}</p>
      <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">{copy.ops.kitTitle}</h1>
      <p className="mt-4 max-w-2xl text-muted">{copy.ops.kitLede}</p>
      <div className="mt-8">
        <OpsNav />
      </div>
      <LocalData />

      <section className="grid gap-4 md:grid-cols-3">
        {copy.ops.reuse.map((card) => (
          <article key={card.title} className="rounded-xl bg-surface p-6">
            <h2 className="font-display text-2xl">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl">{copy.ops.channelsTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{copy.ops.channelsLede}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {copy.ops.channelFacts.map((row) => (
            <li key={row.channel} className="rounded-xl bg-surface px-5 py-4">
              <p className="text-xs tracking-[0.18em] text-faint uppercase">{row.channel}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{row.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-surface p-6">
          <h2 className="font-display text-2xl">{copy.ops.liveTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {copy.ops.liveItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl bg-surface p-6">
          <h2 className="font-display text-2xl">{copy.ops.blockedTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {copy.ops.blockedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/contact">{copy.cta.button}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/studio">{copy.duo.studioLink}</Link>
        </Button>
      </div>
    </main>
  );
}
