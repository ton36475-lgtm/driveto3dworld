type Bus = {
  ctx: AudioContext;
  master: GainNode;
  music: GainNode;
  sfx: GainNode;
};

const FILES: Record<string, string> = {
  engine: "/audio/engine.wav",
  wind: "/audio/wind.wav",
  collect: "/audio/collect.wav",
  architecture: "/audio/zone-arch.wav",
  characters: "/audio/zone-char.wav",
  vehicles: "/audio/zone-veh.wav",
  products: "/audio/zone-prod.wav",
};

let bus: Bus | null = null;
const buffers = new Map<string, AudioBuffer>();
const loops = new Map<string, { src: AudioBufferSourceNode; gain: GainNode }>();
let currentZone: string | null = null;
let muted = false;
let unlocked = false;

function ensure(): Bus | null {
  if (typeof window === "undefined") return null;
  if (bus) return bus;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC({ latencyHint: "interactive" });
  const master = ctx.createGain();
  const music = ctx.createGain();
  const sfx = ctx.createGain();
  music.gain.value = 0.9;
  sfx.gain.value = 1;
  master.gain.value = muted ? 0 : 0.85;
  music.connect(master);
  sfx.connect(master);
  master.connect(ctx.destination);
  bus = { ctx, master, music, sfx };
  return bus;
}

export function unlockAudio() {
  const b = ensure();
  if (!b) return;
  if (b.ctx.state === "suspended") void b.ctx.resume();
  unlocked = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && b.ctx.state === "suspended") void b.ctx.resume();
  });
}

async function loadBuffer(key: string, url: string) {
  const b = ensure();
  if (!b || buffers.has(key)) return;
  try {
    const res = await fetch(url);
    const raw = await res.arrayBuffer();
    const decoded = await b.ctx.decodeAudioData(raw.slice(0));
    buffers.set(key, decoded);
  } catch {
    /* fallback oscillators later */
  }
}

function startLoop(key: string, dest: GainNode, volume: number) {
  const b = bus;
  if (!b) return;
  stopLoop(key);
  const buf = buffers.get(key);
  const gain = b.ctx.createGain();
  gain.gain.value = volume;
  gain.connect(dest);
  if (buf) {
    const src = b.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(gain);
    src.start();
    loops.set(key, { src, gain });
    return;
  }
  const osc = b.ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = key === "engine" ? 55 : 110;
  osc.connect(gain);
  osc.start();
  loops.set(key, { src: osc as unknown as AudioBufferSourceNode, gain });
}

function stopLoop(key: string) {
  const n = loops.get(key);
  if (!n || !bus) return;
  try {
    n.src.stop();
  } catch {
    /* already stopped */
  }
  n.gain.disconnect();
  loops.delete(key);
}

export async function startAudio() {
  unlockAudio();
  const b = ensure();
  if (!b) return;
  await Promise.all(Object.entries(FILES).map(([k, u]) => loadBuffer(k, u)));
  if (!loops.has("engine")) startLoop("engine", b.music, 0.12);
  if (!loops.has("wind")) startLoop("wind", b.music, 0.08);
}

export function setEngine(speed: number) {
  const n = loops.get("engine");
  const w = loops.get("wind");
  if (!bus || !n) return;
  const t = bus.ctx.currentTime;
  const abs = Math.min(1, Math.abs(speed) / 16);
  n.gain.gain.setTargetAtTime(0.08 + abs * 0.28, t, 0.05);
  const src = n.src as AudioBufferSourceNode;
  if ("playbackRate" in src) {
    src.playbackRate.setTargetAtTime(0.72 + abs * 0.7, t, 0.05);
  }
  if (w) w.gain.gain.setTargetAtTime(0.05 + abs * 0.18, t, 0.08);
}

export function setZoneBed(zone: string | null) {
  if (!bus || !unlocked) return;
  if (zone === currentZone) return;
  const t = bus.ctx.currentTime;
  if (currentZone) {
    const prev = loops.get(currentZone);
    if (prev) prev.gain.gain.setTargetAtTime(0, t, 0.25);
    window.setTimeout(() => {
      if (currentZone !== zone) stopLoop(currentZone!);
    }, 600);
  }
  currentZone = zone;
  if (zone && FILES[zone]) {
    startLoop(zone, bus.music, 0);
    const n = loops.get(zone);
    n?.gain.gain.setTargetAtTime(0.16, t, 0.35);
  }
}

export function playCollect() {
  const b = bus;
  if (!b || muted) return;
  const buf = buffers.get("collect");
  const gain = b.ctx.createGain();
  gain.gain.value = 0.55;
  gain.connect(b.sfx);
  if (buf) {
    const src = b.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(gain);
    src.start();
    src.onended = () => gain.disconnect();
    return;
  }
  const osc = b.ctx.createOscillator();
  osc.frequency.value = 880;
  osc.connect(gain);
  osc.start();
  osc.stop(b.ctx.currentTime + 0.2);
}

export function setMuted(next: boolean) {
  muted = next;
  if (!bus) return;
  bus.master.gain.setTargetAtTime(next ? 0 : 0.85, bus.ctx.currentTime, 0.04);
}

export function isAudioMuted() {
  return muted;
}
