export function SectionKicker({ index, label }: { index: string; label: string }) {
  return (
    <p className="text-xs tracking-[0.22em] text-muted uppercase">
      <span className="tabular-nums text-faint">{index}</span>
      <span className="mx-3 text-line">/</span>
      {label}
    </p>
  );
}
