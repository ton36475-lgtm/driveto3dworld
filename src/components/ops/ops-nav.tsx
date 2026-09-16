import { Link, useRouterState } from "@tanstack/react-router";
import { useCopy } from "@/lib/copy";
import { counts } from "@/lib/ops/engine";
import { useShallow } from "zustand/react/shallow";
import { useOps } from "@/lib/ops/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/desk", key: "desk" as const },
  { to: "/marketing", key: "marketing" as const },
  { to: "/automations", key: "automations" as const },
  { to: "/kit", key: "kit" as const },
] as const;

export function OpsNav() {
  const copy = useCopy();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const snapshot = useOps(useShallow((s) => counts(s)));

  return (
    <div className="mb-10 flex flex-wrap items-center gap-2">
      {LINKS.map((link) => {
        const active = pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-11 items-center rounded-lg px-4 text-sm transition-colors duration-150",
              active ? "bg-elevated text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {copy.ops[link.key]}
            {link.to === "/desk" && snapshot.openInquiries > 0 ? (
              <span className="ml-2 tabular-nums text-xs text-faint">{snapshot.openInquiries}</span>
            ) : null}
            {link.to === "/automations" && snapshot.overdueJobs > 0 ? (
              <span className="ml-2 tabular-nums text-xs text-faint">{snapshot.overdueJobs}</span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
