import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/copy";
import { useOps } from "@/lib/ops/store";
import { downloadText, exportBackup, MAX_BACKUP_BYTES, STORAGE_KEY } from "@/lib/ops/storage";

function useLocalOps() {
  const hydrate = useOps((state) => state.hydrateLegacy);
  useEffect(() => {
    hydrate();
    const synchronize = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) hydrate();
    };
    window.addEventListener("storage", synchronize);
    return () => window.removeEventListener("storage", synchronize);
  }, [hydrate]);
}

export function LocalData({ backup = false }: { backup?: boolean }) {
  useLocalOps();
  const copy = useCopy();
  const error = useOps((state) => state.storageError);
  const hydrated = useOps((state) => state.hydrated);
  const hydrate = useOps((state) => state.hydrateLegacy);
  const restore = useOps((state) => state.restore);
  return (
    <section
      className="mb-6 space-y-3 rounded-lg border border-white/10 p-4 text-sm text-muted"
      aria-label={copy.ops.localTitle}
    >
      <p>{copy.ops.localNotice}</p>
      {!hydrated ? <p role="status">{copy.ops.loading}</p> : null}
      {error ? (
        <div role="alert">
          <p>{copy.ops.storageError}</p>
          <Button className="mt-2" variant="outline" onClick={hydrate}>
            {copy.ops.retry}
          </Button>
        </div>
      ) : null}
      {backup ? (
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            disabled={!hydrated || Boolean(error)}
            onClick={() => {
              const { inquiries, jobs, drafts } = useOps.getState();
              downloadText(
                "sirawat-ball-local-backup.json",
                exportBackup({ inquiries, jobs, drafts }),
                "application/json",
              );
            }}
          >
            {copy.ops.exportData}
          </Button>
          <label className="relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 focus-within:ring-2 focus-within:ring-accent">
            {copy.ops.importData}
            <input
              aria-label={copy.ops.importData}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              type="file"
              accept="application/json,.json"
              disabled={!hydrated || Boolean(error)}
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                if (file.size > MAX_BACKUP_BYTES) {
                  toast.error(copy.ops.importError);
                  return;
                }
                try {
                  const result = restore(await file.text());
                  if (result)
                    toast.error(
                      result === "restore-nonempty"
                        ? copy.ops.restoreNonempty
                        : result === "storage"
                          ? copy.ops.storageError
                          : copy.ops.importError,
                    );
                  else toast.success(copy.ops.imported);
                } catch {
                  toast.error(copy.ops.importError);
                }
              }}
            />
          </label>
          <p className="basis-full text-xs text-faint">{copy.ops.backupNotice}</p>
        </div>
      ) : null}
    </section>
  );
}
