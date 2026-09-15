type Axes = { steer: number; throttle: number; brake: number };

const held = new Set<string>();
let injected: Set<string> | null = null;
let steerOverride: number | null = null;
let touchX = 0;
let touchY = 0;
let touchOn = false;
let gamepadSteer = 0;
let gamepadThrottle = 0;
let gamepadBrake = 0;
let attached = false;

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function onKey(e: KeyboardEvent, down: boolean) {
  if (down && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
    e.preventDefault();
  }
  if (down) held.add(e.code);
  else held.delete(e.code);
}

function onBlur() {
  held.clear();
}

export function attachInput() {
  if (attached || typeof window === "undefined") return () => {};
  attached = true;
  const kd = (e: KeyboardEvent) => onKey(e, true);
  const ku = (e: KeyboardEvent) => onKey(e, false);
  window.addEventListener("keydown", kd, { passive: false });
  window.addEventListener("keyup", ku);
  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onBlur);
  return () => {
    attached = false;
    window.removeEventListener("keydown", kd);
    window.removeEventListener("keyup", ku);
    window.removeEventListener("blur", onBlur);
    document.removeEventListener("visibilitychange", onBlur);
    held.clear();
  };
}

export function setTouch(x: number, y: number, active: boolean) {
  touchOn = active;
  touchX = active ? clamp(x, -1, 1) : 0;
  touchY = active ? clamp(y, -1, 1) : 0;
}

export function pollGamepad() {
  const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() : null;
  const pad = pads?.[0];
  if (!pad) {
    gamepadSteer = 0;
    gamepadThrottle = 0;
    gamepadBrake = 0;
    return;
  }
  const ax = pad.axes[0] ?? 0;
  const ay = pad.axes[1] ?? 0;
  gamepadSteer = Math.abs(ax) > 0.18 ? -ax : 0;
  gamepadThrottle = 0;
  if (ay < -0.18) gamepadThrottle += -ay;
  if (ay > 0.18) gamepadThrottle -= ay;
  if (pad.buttons[7]?.pressed || pad.buttons[0]?.pressed) gamepadThrottle = Math.max(gamepadThrottle, 1);
  if (pad.buttons[6]?.pressed) gamepadThrottle = Math.min(gamepadThrottle, -1);
  gamepadBrake = pad.buttons[1]?.pressed ? 1 : 0;
}

function fromSet(set: Set<string>): Axes {
  let steer = 0;
  if (set.has("KeyA") || set.has("ArrowLeft")) steer += 1;
  if (set.has("KeyD") || set.has("ArrowRight")) steer -= 1;
  let throttle = 0;
  if (set.has("KeyW") || set.has("ArrowUp")) throttle += 1;
  if (set.has("KeyS") || set.has("ArrowDown")) throttle -= 1;
  const brake = set.has("Space") ? 1 : 0;
  return { steer: clamp(steer, -1, 1), throttle: clamp(throttle, -1, 1), brake };
}

export function readAxes(): Axes {
  if (injected) {
    const a = fromSet(injected);
    if (steerOverride != null) a.steer = clamp(steerOverride, -1, 1);
    return a;
  }
  const keys = fromSet(held);
  let steer = keys.steer;
  let throttle = keys.throttle;
  let brake = keys.brake;
  if (touchOn) {
    steer += -touchX;
    throttle += touchY;
  }
  steer += gamepadSteer;
  throttle += gamepadThrottle;
  brake = Math.max(brake, gamepadBrake);
  if (steerOverride != null) steer = steerOverride;
  return {
    steer: clamp(steer, -1, 1),
    throttle: clamp(throttle, -1, 1),
    brake,
  };
}

export type ControlsProbe = {
  getYaw: () => number;
  getSpeed: () => number;
  setSteer?: (v: number) => void;
  setKeys?: (codes: string[]) => void;
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
    __driveReady?: boolean;
  }
}

export function installControlsTest(getYaw: () => number, getSpeed: () => number) {
  if (typeof window === "undefined") return;
  window.__controlsTest = {
    getYaw,
    getSpeed,
    setSteer: (v) => {
      steerOverride = v;
    },
    setKeys: (codes) => {
      injected = codes.length ? new Set(codes) : null;
      if (!codes.length) steerOverride = null;
    },
  };
}
