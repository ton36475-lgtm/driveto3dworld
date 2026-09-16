import { ZONES } from "../data/projects.ts";
import type { Axes } from "./input.ts";

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
  if (!Number.isFinite(x) || !Number.isFinite(z) || (yaw !== undefined && !Number.isFinite(yaw))) return;
  sim.x = Math.max(-BOUNDS, Math.min(BOUNDS, x));
  sim.z = Math.max(-BOUNDS, Math.min(BOUNDS, z));
  sim.speed = 0;
  sim.lateral = 0;
  sim.steer = 0;
  sim.roll = 0;
  sim.vx = 0;
  sim.vz = 0;
  if (yaw != null) sim.yaw = yaw;
  resolveColliders();
}

/** Shared deterministic step for render-loop driving and steering regression tests. */
export function advanceSimulation(axes: Axes, delta: number) {
  if (!Number.isFinite(delta) || delta <= 0) return;
  const dt = Math.min(delta, 0.1);
  const clamp = (n: number, lo: number, hi: number) => Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : 0;
  const damp = (from: number, to: number, rate: number) => from + (to - from) * (1 - Math.exp(-rate * dt));
  const steer = clamp(axes.steer, -1, 1);
  const throttle = clamp(axes.throttle, -1, 1);
  sim.steer = damp(sim.steer, steer, 10);
  if (axes.brake > 0) sim.speed *= Math.pow(0.18, dt);
  else if (throttle > 0) sim.speed += 22 * throttle * dt;
  else if (throttle < 0) sim.speed += 12 * throttle * dt;
  else sim.speed *= Math.pow(0.22, dt);
  const road = onPavement(sim.x, sim.z);
  sim.speed -= 2.4 * (road ? 1 : 2.6) * dt * Math.sign(sim.speed) * Math.min(1, Math.abs(sim.speed));
  sim.speed = clamp(sim.speed, -16 * 0.55, 16 * (road ? 1 : 0.62));
  const speedFactor = clamp(Math.abs(sim.speed) / 5, 0.28, 1);
  sim.yaw += sim.steer * 2.55 * speedFactor * (sim.speed >= 0 ? 1 : -1) * dt;
  sim.lateral += sim.steer * sim.speed * 0.35 * dt;
  sim.lateral *= Math.exp(-7.5 * (road ? 1 : 0.55) * dt);
  const fx = -Math.sin(sim.yaw);
  const fz = -Math.cos(sim.yaw);
  sim.vx = fx * sim.speed + Math.cos(sim.yaw) * sim.lateral;
  sim.vz = fz * sim.speed - Math.sin(sim.yaw) * sim.lateral;
  sim.x = clamp(sim.x + sim.vx * dt, -BOUNDS, BOUNDS);
  sim.z = clamp(sim.z + sim.vz * dt, -BOUNDS, BOUNDS);
  resolveColliders();
  sim.roll = damp(sim.roll, sim.steer * 0.14 * speedFactor, 8);
  sim.wheel += sim.speed * dt * 2.4;
}

if (typeof window !== "undefined") {
  (window as unknown as { __sim: typeof sim }).__sim = sim;
}
