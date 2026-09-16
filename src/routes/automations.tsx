import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect } from "react";
import { LocalData } from "@/components/ops/local-data";
import { OpsNav } from "@/components/ops/ops-nav";
import { Button } from "@/components/ui/button";
import { useCopy, useLocale } from "@/lib/copy";
import { counts } from "@/lib/ops/engine";
import { useShallow } from "zustand/react/shallow";
import { useOps } from "@/lib/ops/store";

export const Route = createFileRoute("/automations")({ component: AutomationsPage });

function AutomationsPage() {
  const copy = useCopy();
  const lang = useLocale();
  const jobs = useOps((s) => s.jobs);
  const tick = useOps((s) => s.tick);
  const parkJob = useOps((s) => s.parkJob);
  const snapshot = useOps(useShallow((s) => counts(s)));

  useEffect(() => {
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [tick]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.ops.kicker}</p>
      <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">
        {copy.ops.autoTitle}
      </h1>
      <p className="mt-4 max-w-2xl text-muted">{copy.ops.autoLede}</p>
      <div className="mt-8">
        <OpsNav />
      </div>
      <LocalData />

      <dl className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={copy.ops.statOpen} value={snapshot.openInquiries} />
        <Stat label={copy.ops.statQueue} value={snapshot.queuedJobs} />
        <Stat label={copy.ops.statOverdue} value={snapshot.overdueJobs} />
        <Stat label={copy.ops.statReady} value={snapshot.readyDrafts} />
      </dl>

      <div className="mb-6">
        <Button type="button" variant="outline" onClick={tick}>
          {copy.ops.runTick}
        </Button>
      </div>

      {jobs.length === 0 ? (
        <p className="rounded-xl bg-surface px-6 py-12 text-sm text-muted">{copy.ops.emptyJobs}</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="flex flex-col gap-3 rounded-xl bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm text-foreground">
                  {copy.ops.jobs[job.kind]} · {copy.ops.jobStatus[job.status]}
                </p>
                <p className="mt-1 text-xs text-faint">
                  {copy.ops.due}{" "}
                  {new Date(job.dueAt).toLocaleString(lang === "th" ? "th-TH" : "en-GB")}
                  {job.receipt ? ` · ${job.receipt}` : ""}
                </p>
              </div>
              {job.status !== "done" && job.status !== "dead_letter" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (parkJob(job.id, "manual-reconcile")) toast.error(copy.ops.actionError);
                  }}
                >
                  {copy.ops.park}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface px-4 py-5">
      <dt className="text-xs tracking-widest text-faint uppercase">{label}</dt>
      <dd className="mt-2 font-display text-3xl tabular-nums">{value}</dd>
    </div>
  );
}
