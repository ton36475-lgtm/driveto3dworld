export type Quality = "high" | "low";

export function getQuality(): Quality {
  if (typeof window === "undefined") return "low";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return "low";
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined && memory <= 2) return "low";
  const cores = navigator.hardwareConcurrency ?? 8;
  if (cores <= 2) return "low";
  return "high";
}
