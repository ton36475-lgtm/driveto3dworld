import { useEffect, useRef } from "react";
import { PROJECTS, ZONES } from "../data/projects";
import { sim } from "../systems/sim";
import { useDrive } from "../store";

export function Minimap() {
  const ref = useRef<HTMLCanvasElement>(null);
  const collected = useDrive((s) => s.collected);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const size = 128;
    canvas.width = size * 2;
    canvas.height = size * 2;
    const map = (n: number) => ((n + 100) / 200) * size * 2;

    const tick = () => {
      ctx.clearRect(0, 0, size * 2, size * 2);
      ctx.fillStyle = "#0b0d10";
      ctx.fillRect(0, 0, size * 2, size * 2);
      for (const z of ZONES) {
        ctx.fillStyle = z.pad;
        const s = (z.size / 200) * size * 2;
        ctx.fillRect(map(z.x) - s / 2, map(z.z) - s / 2, s, s);
      }
      ctx.strokeStyle = "rgba(243,238,230,0.16)";
      ctx.strokeRect(map(-8), 0, map(8) - map(-8), size * 2);
      ctx.strokeRect(0, map(-8), size * 2, map(8) - map(-8));
      for (const p of PROJECTS) {
        if (collected.includes(p.id)) continue;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(map(p.x), map(p.z), 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      const x = map(sim.x);
      const z = map(sim.z);
      ctx.save();
      ctx.translate(x, z);
      ctx.rotate(-sim.yaw);
      ctx.fillStyle = "#e25b4c";
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(5, 6);
      ctx.lineTo(-5, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [collected]);

  return (
    <canvas
      ref={ref}
      width={256}
      height={256}
      className="pointer-events-none hidden sm:block"
      style={{
        width: 112,
        height: 112,
        borderRadius: 12,
        border: "1px solid color-mix(in oklab, var(--color-fg) 14%, transparent)",
        background: "var(--color-bg)",
      }}
      aria-hidden
    />
  );
}
