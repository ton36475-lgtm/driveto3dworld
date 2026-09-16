import { createFileRoute } from "@tanstack/react-router";
import { LocalData } from "@/components/ops/local-data";
import { toast } from "sonner";
import { downloadText } from "@/lib/ops/storage";
import { OpsNav } from "@/components/ops/ops-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DRAFT_FIELDS, draftText } from "@/lib/ops/localize";
import { Textarea } from "@/components/ui/textarea";
import { useCopy, useLocale } from "@/lib/copy";
import { useOps } from "@/lib/ops/store";
import type { Draft } from "@/lib/ops/types";

export const Route = createFileRoute("/marketing")({ component: MarketingPage });

const FRAMES: Record<Draft["channel"], string> = {
  line: "/media/still-linen.jpg",
  facebook: "/media/garden-night.jpg",
  instagram: "/media/palace-court.jpg",
  tiktok: "/media/resort-pool.jpg",
  google: "/media/river-facade.jpg",
  web: "/media/villa-pool.jpg",
};

function MarketingPage() {
  const copy = useCopy();
  const lang = useLocale();
  const drafts = useOps((s) => s.drafts);
  const editDraft = useOps((s) => s.editDraft);
  const readyDraft = useOps((s) => s.readyDraft);

  function perform(result: string | null) {
    if (result) toast.error(result === "storage" ? copy.ops.storageError : copy.ops.actionError);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.ops.kicker}</p>
      <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">
        {copy.ops.marketingTitle}
      </h1>
      <p className="mt-4 max-w-2xl text-muted">{copy.ops.marketingLede}</p>
      <div className="mt-8">
        <OpsNav />
      </div>
      <LocalData />

      <div className="grid gap-6 md:grid-cols-2">
        {drafts.map((draft) => {
          const { title, body } = draftText(draft, lang);
          const fields = DRAFT_FIELDS[lang];
          const needsTranslation = !draft.titleZh?.trim() || !draft.bodyZh?.trim();
          return (
            <article key={draft.id} className="overflow-hidden rounded-xl bg-surface">
              <img
                src={FRAMES[draft.channel]}
                alt=""
                className="media-frame aspect-[16/9] w-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs tracking-[0.18em] text-faint uppercase">
                    {copy.ops.channels[draft.channel]}
                  </p>
                  <p className="text-xs tracking-widest text-muted uppercase">
                    {copy.ops.draftStatus[draft.status]}
                  </p>
                </div>
                <h2 className="mt-3 font-display text-2xl">
                  {title || copy.ops.channels[draft.channel]}
                </h2>
                <label className="mt-4 block">
                  <span className="sr-only">{copy.ops.editDraftTitle}</span>
                  <Input
                    maxLength={10000}
                    value={title}
                    placeholder={copy.ops.editDraftTitle}
                    onChange={(event) =>
                      perform(editDraft(draft.id, { [fields.title]: event.target.value }))
                    }
                  />
                </label>
                {needsTranslation ? (
                  <p className="mt-3 text-xs text-muted">{copy.ops.needsTranslation}</p>
                ) : null}
                <label className="mt-4 block">
                  <span className="sr-only">{copy.ops.editDraft}</span>
                  <Textarea
                    maxLength={10000}
                    value={body}
                    onChange={(event) =>
                      perform(editDraft(draft.id, { [fields.body]: event.target.value }))
                    }
                    className="min-h-32"
                  />
                </label>
                {draft.status === "blocked" ? (
                  <p className="mt-3 text-xs text-muted">{copy.ops.blockedBody}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" onClick={() => perform(readyDraft(draft.id))}>
                    {copy.ops.markReady}
                  </Button>
                  <Button type="button" variant="outline" disabled>
                    {copy.ops.noSend}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      downloadText(`${draft.channel}-${lang}-draft.txt`, `${title}\n\n${body}`)
                    }
                  >
                    {copy.ops.downloadDraft}
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
