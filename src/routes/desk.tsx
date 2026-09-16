import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LocalData } from "@/components/ops/local-data";
import { toast } from "sonner";
import { OpsNav } from "@/components/ops/ops-nav";
import { Button } from "@/components/ui/button";
import { useCopy, useLocale } from "@/lib/copy";
import { useOps } from "@/lib/ops/store";
import type { InquiryStatus } from "@/lib/ops/types";

export const Route = createFileRoute("/desk")({ component: DeskPage });

const FILTERS: Array<InquiryStatus | "open"> = ["open", "received", "assigned", "quoted", "closed"];

function DeskPage() {
  const copy = useCopy();
  const lang = useLocale();
  const inquiries = useOps((s) => s.inquiries);
  const jobs = useOps((s) => s.jobs);
  const assign = useOps((s) => s.assign);
  const quote = useOps((s) => s.quote);
  const close = useOps((s) => s.close);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("open");
  const [assignee, setAssignee] = useState("Sirawat");

  function perform(result: string | null) {
    if (result) toast.error(result === "storage" ? copy.ops.storageError : copy.ops.actionError);
  }

  const visible = inquiries.filter((item) =>
    filter === "open" ? item.status !== "closed" : item.status === filter,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.ops.kicker}</p>
      <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">
        {copy.ops.deskTitle}
      </h1>
      <p className="mt-4 max-w-2xl text-muted">{copy.ops.deskLede}</p>
      <div className="mt-8">
        <OpsNav />
      </div>
      <LocalData backup />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={
              filter === key
                ? "h-11 rounded-lg bg-elevated px-4 text-sm text-foreground"
                : "h-11 rounded-lg px-4 text-sm text-muted hover:text-foreground"
            }
          >
            {copy.ops.filters[key]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl bg-surface px-6 py-12 text-sm text-muted">{copy.ops.emptyDesk}</p>
      ) : (
        <ul className="space-y-4">
          {visible.map((item) => {
            const related = jobs.filter((job) => job.inquiryId === item.id);
            return (
              <li key={item.id} className="rounded-xl bg-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {copy.contact.channels[item.channel]} · {item.handle} ·{" "}
                      {copy.contact.types[item.type]}
                    </p>
                  </div>
                  <p className="text-xs tracking-widest text-faint uppercase">
                    {copy.ops.status[item.status]}
                  </p>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground">
                  {item.message}
                </p>
                <p className="mt-3 text-xs text-faint">
                  {new Date(item.at).toLocaleString(lang === "th" ? "th-TH" : "en-GB")}
                  {item.assignee ? ` · ${item.assignee}` : ""}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {related.map((job) => (
                    <li
                      key={job.id}
                      className="rounded-md bg-elevated px-2.5 py-1 text-xs tracking-wide text-muted"
                    >
                      {copy.ops.jobs[job.kind]} · {copy.ops.jobStatus[job.status]}
                    </li>
                  ))}
                </ul>
                {item.status !== "closed" ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.status === "received" ? (
                      <>
                        <select
                          className="h-11 rounded-lg bg-elevated px-3 text-sm"
                          value={assignee}
                          onChange={(e) => setAssignee(e.target.value)}
                          aria-label={copy.ops.assignee}
                        >
                          <option>Sirawat</option>
                          <option>Ball</option>
                        </select>
                        <Button type="button" onClick={() => perform(assign(item.id, assignee))}>
                          {copy.ops.assign}
                        </Button>
                      </>
                    ) : null}
                    {item.status === "assigned" ? (
                      <Button type="button" onClick={() => perform(quote(item.id))}>
                        {copy.ops.quote}
                      </Button>
                    ) : null}
                    <Button type="button" variant="outline" onClick={() => perform(close(item.id))}>
                      {copy.ops.close}
                    </Button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
