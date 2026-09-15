import { create } from "zustand";
import { PROJECTS } from "./data/projects";

const SAVE_KEY = "atelier-drive-v1";

function loadCollected(): string[] {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { version?: number; collected?: string[] };
    if (parsed.version !== 1 || !Array.isArray(parsed.collected)) return [];
    return parsed.collected.filter((id) => PROJECTS.some((p) => p.id === id));
  } catch {
    return [];
  }
}

function persist(collected: string[]) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, collected }));
  } catch {
    /* ignore quota */
  }
}

type DriveState = {
  started: boolean;
  muted: boolean;
  collected: string[];
  activeId: string | null;
  zoneId: string | null;
  fps: number;
  weather: "auto" | "clear" | "rain" | "snow";
  start: () => void;
  toggleMute: () => void;
  collect: (id: string) => void;
  closeModal: () => void;
  setFps: (n: number) => void;
  setZone: (id: string | null) => void;
  cycleWeather: () => void;
};

export const useDrive = create<DriveState>((set, get) => ({
  started: false,
  muted: false,
  collected: typeof window === "undefined" ? [] : loadCollected(),
  activeId: null,
  zoneId: null,
  fps: 60,
  weather: "auto",
  start: () => set({ started: true }),
  toggleMute: () => set({ muted: !get().muted }),
  collect: (id) => {
    const { collected } = get();
    const next = collected.includes(id) ? collected : [...collected, id];
    persist(next);
    set({ collected: next, activeId: id });
  },
  closeModal: () => set({ activeId: null }),
  setFps: (fps) => set({ fps }),
  setZone: (zoneId) => {
    if (get().zoneId !== zoneId) set({ zoneId });
  },
  cycleWeather: () => {
    const order = ["auto", "clear", "rain", "snow"] as const;
    const i = order.indexOf(get().weather);
    set({ weather: order[(i + 1) % order.length] });
  },
}));
