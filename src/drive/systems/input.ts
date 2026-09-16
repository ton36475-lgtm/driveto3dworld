export type Axes = { steer: number; throttle: number; brake: number };

const held = new Set<string>();
let injected: Set<string> | null = null;
let steerOverride: number | null = null;
let touchX = 0;
let touchY = 0;
let touchOn = false;
let touchBrake = 0;
let gamepadSteer = 0;
let gamepadThrottle = 0;
let gamepadBrake = 0;
let attached = false;
let locked = true;

function clamp(v: number, a: number, b: number) {
  return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : 0;
}

export function isInteractiveTarget(target: EventTarget | null) {
  return typeof Element !== "undefined" && target instanceof Element && Boolean(
    target.closest('input, textarea, select, button, a, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="slider"]'),
  );
}

const driveKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "ShiftLeft", "ShiftRight"]);

function onKey(e: KeyboardEvent, down: boolean) {
  if (!down) { held.delete(e.code); return; }
  if (locked || !driveKeys.has(e.code) || e.ctrlKey || e.metaKey || e.altKey || isInteractiveTarget(e.target)) return;
  if (down && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
    e.preventDefault();
  }
  if (down) held.add(e.code);
  else held.delete(e.code);
}

function onBlur() {
  resetInput();
}

export function resetInput() {
  held.clear();
  injected = null;
  steerOverride = null;
  touchOn = false;
  touchX = 0;
  touchY = 0;
  touchBrake = 0;
  gamepadSteer = 0;
  gamepadThrottle = 0;
  gamepadBrake = 0;
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
    resetInput();
  };
}

export function setInputLocked(v: boolean) {
  if (v && !locked) resetInput();
  locked = v;
}

export function isInputLocked() {
  return locked;
}

export function setTouch(x: number, y: number, active: boolean) {
  if (locked && active) return;
  touchOn = active;
  touchX = active ? clamp(x, -1, 1) : 0;
  touchY = active ? clamp(y, -1, 1) : 0;
}

export function setTouchBrake(v: boolean) {
  if (locked && v) return;
  touchBrake = v ? 1 : 0;
}

function radial(x: number, y: number, dz = 0.18) {
  const m = Math.hypot(x, y);
  if (m < dz) return { x: 0, y: 0 };
  const scale = ((Math.min(m, 1) - dz) / (1 - dz)) / m;
  return { x: x * scale, y: y * scale };
}

export function pollGamepad() {
  const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() : null;
  const pad = pads ? Array.from(pads).find((candidate) => candidate?.connected) : null;
  if (!pad) {
    gamepadSteer = 0;
    gamepadThrottle = 0;
    gamepadBrake = 0;
    return;
  }
  const stick = radial(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
  gamepadSteer = -stick.x;
  gamepadThrottle = 0;
  if (stick.y < 0) gamepadThrottle += -stick.y;
  if (stick.y > 0) gamepadThrottle -= stick.y;
  const rt = pad.buttons[7]?.value ?? 0;
  const lt = pad.buttons[6]?.value ?? 0;
  if (rt > 0.1) gamepadThrottle = Math.max(gamepadThrottle, rt);
  if (lt > 0.1) gamepadThrottle = Math.min(gamepadThrottle, -lt);
  if (pad.buttons[0]?.pressed) gamepadThrottle = Math.max(gamepadThrottle, 1);
  gamepadBrake = pad.buttons[1]?.pressed ? 1 : 0;
  if (pad.buttons[9]?.pressed) gamepadBrake = 1;
}

function fromSet(set: Set<string>): Axes {
  let steer = 0;
  if (set.has("KeyA") || set.has("ArrowLeft")) steer += 1;
  if (set.has("KeyD") || set.has("ArrowRight")) steer -= 1;
  let throttle = 0;
  if (set.has("KeyW") || set.has("ArrowUp")) throttle += 1;
  if (set.has("KeyS") || set.has("ArrowDown")) throttle -= 1;
  const brake = set.has("Space") || set.has("ShiftLeft") || set.has("ShiftRight") ? 1 : 0;
  return { steer: clamp(steer, -1, 1), throttle: clamp(throttle, -1, 1), brake };
}

export function readAxes(): Axes {
  if (locked) return { steer: 0, throttle: 0, brake: 0 };
  if (injected) {
    const a = fromSet(injected);
    if (steerOverride != null) a.steer = clamp(steerOverride, -1, 1);
    return a;
  }
  const keys = fromSet(held);
  let steer = keys.steer;
  let throttle = keys.throttle;
  const brake = Math.max(keys.brake, touchBrake, gamepadBrake);
  if (touchOn) {
    steer += -touchX;
    throttle += touchY;
  }
  steer += gamepadSteer;
  throttle += gamepadThrottle;
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
    __driveQA?: Record<string, unknown>;
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
