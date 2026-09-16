import { ZONES } from "../data/projects";

export const WORLD = 200;
export const HALF = WORLD / 2;
export const BOUNDS = 94;

export const sim = {
  x: 0,
  y: 0.42,
  z: 10,
  yaw: 0,
  speed: 0,
  steer: 0,
  roll: 0,
  wheel: 0,
  lateral: 0,
  vx: 0,
  vz: 0,
};

export const perfState = {
  fps: 60,
  frames: 0,
  last: 0,
  dpr: 1.5,
  shadows: true,
};

export type Collider = { x: number; z: number; r: number };

export const COLLIDERS: Collider[] = [
  { x: 0, z: 0, r: 2.05 },
  { x: -42, z: -42, r: 4.4 },
  { x: 42, z: -42, r: 2.15 },
  { x: 42, z: 42, r: 2.5 },
  { x: -42, z: 42, r: 1.7 },
];

export function zoneAt(x: number, z: number): string | null {
  if (x < -22 && z < -22) return "architecture";
  if (x > 22 && z < -22) return "characters";
  if (x > 22 && z > 22) return "vehicles";
  if (x < -22 && z > 22) return "products";
  return null;
}

export function onPavement(x: number, z: number) {
  if (Math.abs(x) < 8.6 || Math.abs(z) < 8.6) return true;
  if (Math.hypot(x, z) < 16.5) return true;
  for (const z0 of ZONES) {
    if (Math.abs(x - z0.x) < z0.size / 2 && Math.abs(z - z0.z) < z0.size / 2) return true;
  }
  return false;
}

export function resolveColliders() {
  for (const c of COLLIDERS) {
    const dx = sim.x - c.x;
    const dz = sim.z - c.z;
    const d = Math.hypot(dx, dz);
    if (d >= c.r) continue;
    const nx = d < 1e-4 ? 1 : dx / d;
    const nz = d < 1e-4 ? 0 : dz / d;
    const push = c.r - d;
    sim.x += nx * push;
    sim.z += nz * push;
    sim.speed *= 0.35;
    sim.lateral *= 0.2;
  }
}

export function teleport(x: number, z: number, yaw?: number) {
  sim.x = x;
  sim.z = z;
  sim.speed = 0;
  sim.lateral = 0;
  sim.steer = 0;
  if (yaw != null) sim.yaw = yaw;
  resolveColliders();
}

if (typeof window !== "undefined") {
  (window as unknown as { __sim: typeof sim }).__sim = sim;
}
