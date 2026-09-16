import { create } from "zustand";
import { PROJECTS } from "./data/projects";
import type { Lang } from "./data/i18n";
import { setMuted as setAudioMuted } from "./systems/audio";
import { dayState } from "./systems/dayNight";
import { useLang } from "@/lib/lang";
import { getQuality } from "@/components/canvas/quality";
import { normalizeSave, type DriveSave, type Quality, type Weather } from "./systems/save";

export type { Quality, Weather } from "./systems/save";

const SAVE_KEY = "atelier-drive-v2";
const LEGACY_KEY = "atelier-drive-v1";

export type Overlay = "none" | "catalog" | "settings" | "pause" | "complete";
const projectIds = PROJECTS.map((project) => project.id);
const migrate = (raw: unknown) => normalizeSave(raw, projectIds, getQuality() === "low" ? "low" : "high");

function loadSave() {
  if (typeof window === "undefined") {
    return migrate({ version: 2 });
  }
  try {
    const raw = localStorage.getItem(SAVE_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return migrate({ version: 2 });
    return migrate(JSON.parse(raw));
  } catch {
    return migrate({ version: 2 });
  }
}

function persist(partial: Partial<DriveSave>) {
  if (typeof window === "undefined") return;
  try {
    const cur = loadSave();
    const next = migrate({ ...cur, ...partial, version: 2 });
    localStorage.setItem(SAVE_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

export function saveDaySettings() {
  persist({ dayPaused: dayState.paused, dayTime: dayState.time });
}

const initial = loadSave();
if (initial.dayPaused) dayState.paused = true;
if (typeof initial.dayTime === "number") dayState.time = initial.dayTime;

type DriveState = {
  started: boolean;
  muted: boolean;
  collected: string[];
  activeId: string | null;
  zoneId: string | null;
  fps: number;
  weather: Weather;
  lang: Lang;
  quality: Quality;
  overlay: Overlay;
  waypoint: { x: number; z: number; id?: string } | null;
  speedKmh: number;
  completeSeen: boolean;
  start: () => void;
  toggleMute: () => void;
  setMuted: (v: boolean) => void;
  collect: (id: string) => void;
  openProject: (id: string) => void;
  closeModal: () => void;
  setFps: (n: number) => void;
  setZone: (id: string | null) => void;
  cycleWeather: () => void;
  setWeather: (w: Weather) => void;
  setLang: (lang: Lang) => void;
  setQuality: (q: Quality) => void;
  setOverlay: (o: Overlay) => void;
  toggleOverlay: (o: Overlay) => void;
  setWaypoint: (w: { x: number; z: number; id?: string } | null) => void;
  setSpeedKmh: (n: number) => void;
  resetProgress: () => void;
  markCompleteSeen: () => void;
  blocked: () => boolean;
};

export const useDrive = create<DriveState>((set, get) => ({
  started: false,
  muted: initial.muted,
  collected: initial.collected,
  activeId: null,
  zoneId: null,
  fps: 60,
  weather: initial.weather,
  lang: initial.lang,
  quality: initial.quality,
  overlay: "none",
  waypoint: null,
  speedKmh: 0,
  completeSeen: false,
  start: () => set({ started: true }),
  toggleMute: () => get().setMuted(!get().muted),
  setMuted: (muted) => {
    setAudioMuted(muted);
    persist({ muted });
    set({ muted });
  },
  collect: (id) => {
    if (!projectIds.includes(id)) return;
    const { collected } = get();
    const next = collected.includes(id) ? collected : [...collected, id];
    persist({ collected: next });
    const done = next.length >= PROJECTS.length;
    set({
      collected: next,
      activeId: id,
      overlay: "none",
      completeSeen: done ? get().completeSeen : false,
    });
  },
  openProject: (id) => {
    if (projectIds.includes(id)) set({ activeId: id, overlay: "none" });
  },
  closeModal: () => {
    const { collected, completeSeen } = get();
    const show = collected.length >= PROJECTS.length && !completeSeen;
    set({ activeId: null, overlay: show ? "complete" : "none" });
  },
  setFps: (fps) => set({ fps }),
  setZone: (zoneId) => {
    if (get().zoneId !== zoneId) set({ zoneId });
  },
  cycleWeather: () => {
    const order: Weather[] = ["auto", "clear", "rain", "snow"];
    const i = order.indexOf(get().weather);
    get().setWeather(order[(i + 1) % order.length]);
  },
  setWeather: (weather) => {
    persist({ weather });
    set({ weather });
  },
  setLang: (lang) => {
    persist({ lang });
    set({ lang });
    useLang.getState().setLang(lang);
  },
  setQuality: (quality) => {
    persist({ quality });
    set({ quality });
  },
  setOverlay: (overlay) => set({ overlay, activeId: overlay === "none" ? get().activeId : null }),
  toggleOverlay: (o) => {
    const cur = get().overlay;
    set({ overlay: cur === o ? "none" : o, activeId: null });
  },
  setWaypoint: (waypoint) => {
    if (waypoint && (!Number.isFinite(waypoint.x) || !Number.isFinite(waypoint.z))) return;
    set({ waypoint });
  },
  setSpeedKmh: (speedKmh) => {
    if (Math.abs(speedKmh - get().speedKmh) >= 1) set({ speedKmh });
  },
  resetProgress: () => {
    persist({ collected: [] });
    set({ collected: [], activeId: null, completeSeen: false, waypoint: null, overlay: "none" });
  },
  markCompleteSeen: () => set({ completeSeen: true, overlay: "none" }),
  blocked: () => {
    const s = get();
    return Boolean(s.activeId) || s.overlay !== "none";
  },
}));

export function isDriveBlocked() {
  const s = useDrive.getState();
  return Boolean(s.activeId) || s.overlay !== "none" || !s.started;
}
