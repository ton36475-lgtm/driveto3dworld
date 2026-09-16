import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { WorkCard } from "@/components/work-card";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/copy";
import { DISCIPLINES, WORKS, type Discipline } from "@/lib/works";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/work/")({ component: WorkIndex });

function WorkIndex() {
  const copy = useCopy();
  const [filter, setFilter] = useState<Discipline | "all">("all");
  const list = useMemo(() => {
    if (filter === "all") return WORKS;
    return WORKS.filter((work) => work.disciplines.includes(filter));
  }, [filter]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.work.kicker}</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
            {copy.work.title}
          </h1>
          <p className="mt-4 max-w-xl text-muted">{copy.work.lede}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/gallery">{copy.work.open3d}</Link>
        </Button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          {copy.work.filterAll}
        </FilterChip>
        {DISCIPLINES.map((d) => (
          <FilterChip key={d} active={filter === d} onClick={() => setFilter(d)}>
            {copy.filters[d]}
          </FilterChip>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-muted">{copy.work.empty}</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {list.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      )}
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "primary" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn("rounded-full px-4", active ? "" : "text-muted")}
    >
      {children}
    </Button>
  );
}
