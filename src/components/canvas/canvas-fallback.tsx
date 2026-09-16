import { cn } from "@/lib/utils";

export function CanvasFallback({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("absolute inset-0 bg-background", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-elevated),transparent_68%)]" />
      {label ? (
        <p className="absolute inset-x-0 bottom-10 text-center text-xs tracking-widest text-muted uppercase">
          {label}
        </p>
      ) : null}
    </div>
  );
}
