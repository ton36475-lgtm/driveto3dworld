import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg bg-elevated px-3.5 text-sm text-foreground shadow-[var(--shadow-border)] placeholder:text-faint transition-[box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        className,
      )}
      {...props}
    />
  );
}
