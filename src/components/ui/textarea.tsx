import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full rounded-xl bg-elevated px-3.5 py-3 text-sm text-foreground shadow-[var(--shadow-border)] placeholder:text-faint transition-[box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        className,
      )}
      {...props}
    />
  );
}
