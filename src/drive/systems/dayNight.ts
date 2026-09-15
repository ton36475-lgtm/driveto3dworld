import * as THREE from "three";

export const dayState = {
  time: 0.32,
  speed: 0.012,
  paused: false,
  night: 0,
  sunI: 1.2,
  ambI: 0.45,
  sunX: 40,
  sunY: 55,
  sunZ: 18,
  sky: new THREE.Color("#87a0b4"),
  fog: new THREE.Color("#8fa6b4"),
};

const skyDay = new THREE.Color("#9bb4c4");
const skyDusk = new THREE.Color("#c48462");
const skyNight = new THREE.Color("#07080c");
const fogDay = new THREE.Color("#a8bcc8");
const fogDusk = new THREE.Color("#b88870");
const fogNight = new THREE.Color("#0b0d12");

export function stepDayNight(dt: number) {
  if (!dayState.paused) dayState.time = (dayState.time + dt * dayState.speed) % 1;
  const t = dayState.time;
  const angle = t * Math.PI * 2;
  const elev = -Math.cos(angle);
  dayState.sunX = Math.sin(angle) * 90;
  dayState.sunZ = Math.cos(angle) * 40;
  dayState.sunY = elev * 70;
  const dayAmt = THREE.MathUtils.clamp(elev * 0.5 + 0.5, 0, 1);
  dayState.night = 1 - dayAmt;
  dayState.sunI = 0.08 + dayAmt * 1.35;
  dayState.ambI = 0.12 + dayAmt * 0.38;

  if (elev > 0.15) {
    dayState.sky.copy(skyDay);
    dayState.fog.copy(fogDay);
  } else if (elev > -0.15) {
    const k = THREE.MathUtils.smoothstep(-0.15, 0.15, elev);
    dayState.sky.copy(skyDusk).lerp(skyDay, k);
    dayState.fog.copy(fogDusk).lerp(fogDay, k);
  } else {
    const k = THREE.MathUtils.smoothstep(-0.5, -0.15, elev);
    dayState.sky.copy(skyNight).lerp(skyDusk, k);
    dayState.fog.copy(fogNight).lerp(fogDusk, k);
  }
  return dayState;
}

export const LOD_DISTANCES = [22, 55, 110];
