import { useCopy } from "@/lib/copy";
import { useProgress } from "@react-three/drei";

export function LoadingVeil({ label }: { label?: string }) {
  const { active, progress } = useProgress();
  const copy = useCopy();
  if (!active && (progress === 0 || progress >= 100)) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center bg-background/55 pb-20">
      <p className="text-xs tracking-[0.22em] text-muted uppercase tabular-nums">
        {label ?? copy.gallery.loading}
        <span className="ml-3 text-foreground">{Math.round(progress)}</span>
      </p>
    </div>
  );
}
