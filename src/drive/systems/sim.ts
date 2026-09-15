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
};

export const perfState = {
  fps: 60,
  frames: 0,
  last: 0,
  dpr: 1.5,
  shadows: true,
};

export function zoneAt(x: number, z: number): string | null {
  if (x < -22 && z < -22) return "architecture";
  if (x > 22 && z < -22) return "characters";
  if (x > 22 && z > 22) return "vehicles";
  if (x < -22 && z > 22) return "products";
  return null;
}

if (typeof window !== "undefined") {
  (window as unknown as { __sim: typeof sim }).__sim = sim;
}
