import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useCopy, useLocale } from "@/lib/copy";
import { loc, type Work } from "@/lib/works";
import { PortfolioEvidence } from "@/components/portfolio-evidence";

export function WorkCard({ work }: { work: Work }) {
  const lang = useLocale();
  const copy = useCopy();

  return (
    <Link
      to="/work/$slug"
      params={{ slug: work.slug }}
      className="portfolio-work-card group block rounded-xl bg-surface p-2 transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      <div className="overflow-hidden rounded-lg">
        <img
          src={work.image}
          alt={loc(work.title, lang)}
          className="media-frame aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          crossOrigin="anonymous"
        />
      </div>
      <div className="flex items-start justify-between gap-3 px-2 pb-3 pt-4">
        <div>
          <PortfolioEvidence compact />
          <h3 className="mt-3 font-display text-xl tracking-tight text-foreground">
            {loc(work.title, lang)}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{loc(work.subtitle, lang)}</p>
        </div>
        <span className="mt-1 inline-flex size-10 items-center justify-center text-muted transition-colors group-hover:text-foreground">
          <ArrowUpRight className="size-4" aria-hidden />
          <span className="sr-only">{copy.work.view}</span>
        </span>
      </div>
    </Link>
  );
}
