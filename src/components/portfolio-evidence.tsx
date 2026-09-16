import { useLocale } from "@/lib/copy";
import { CONCEPT_EVIDENCE } from "@/lib/portfolio-profiles";
import { cn } from "@/lib/utils";
import { loc } from "@/lib/works";

export function PortfolioEvidence({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const lang = useLocale();

  if (compact) {
    return (
      <span
        data-evidence-status={CONCEPT_EVIDENCE.status}
        className={cn(
          "inline-flex rounded-full border border-line bg-background px-3 py-1 text-xs text-muted",
          className,
        )}
      >
        {loc(CONCEPT_EVIDENCE.label, lang)}
      </span>
    );
  }

  return (
    <div
      data-evidence-status={CONCEPT_EVIDENCE.status}
      className={cn("rounded-xl border border-line bg-surface p-5", className)}
    >
      <p className="text-sm font-medium text-foreground">{loc(CONCEPT_EVIDENCE.label, lang)}</p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {loc(CONCEPT_EVIDENCE.description, lang)}
      </p>
    </div>
  );
}
