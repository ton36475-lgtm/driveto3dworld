import { PROJECTS } from "../data/projects";
import { useDrive } from "../store";
import { getAudioDebug, setMuted, startAudio, unlockAudio } from "./audio";
import { dayState, setDayPaused, setDayTime } from "./dayNight";
import { sim, teleport, zoneAt } from "./sim";

export function installQA() {
  if (typeof window === "undefined") return;

  window.__driveQA = {
    getSim: () => ({ x: sim.x, z: sim.z, yaw: sim.yaw, speed: sim.speed, steer: sim.steer }),
    getStore: () => {
      const s = useDrive.getState();
      return {
        started: s.started,
        muted: s.muted,
        collected: s.collected,
        activeId: s.activeId,
        zoneId: s.zoneId,
        weather: s.weather,
        lang: s.lang,
        quality: s.quality,
        overlay: s.overlay,
        waypoint: s.waypoint,
        fps: s.fps,
      };
    },
    getAudio: getAudioDebug,
    getDay: () => ({ time: dayState.time, night: dayState.night, paused: dayState.paused }),
    teleport: (x: number, z: number, yaw?: number) => teleport(x, z, yaw),
    start: () => {
      unlockAudio();
      void startAudio();
      useDrive.getState().start();
      window.__driveReady = true;
    },
    collect: (id: string) => useDrive.getState().collect(id),
    collectAll: () => {
      for (const p of PROJECTS) {
        const s = useDrive.getState();
        if (!s.collected.includes(p.id)) s.collect(p.id);
      }
      useDrive.getState().closeModal();
    },
    openProject: (id: string) => useDrive.getState().openProject(id),
    closeAll: () => {
      useDrive.getState().closeModal();
      useDrive.getState().setOverlay("none");
    },
    setWeather: (w: "auto" | "clear" | "rain" | "snow") => useDrive.getState().setWeather(w),
    setLang: (lang: "en" | "th") => useDrive.getState().setLang(lang),
    setQuality: (q: "high" | "medium" | "low") => useDrive.getState().setQuality(q),
    setMuted: (v: boolean) => {
      setMuted(v);
      useDrive.getState().setMuted(v);
    },
    setDayTime: (t: number) => setDayTime(t),
    setDayPaused: (v: boolean) => setDayPaused(v),
    setOverlay: (o: "none" | "catalog" | "settings" | "pause" | "complete") => useDrive.getState().setOverlay(o),
    setWaypoint: (id: string) => {
      const p = PROJECTS.find((x) => x.id === id);
      if (p) useDrive.getState().setWaypoint({ x: p.x, z: p.z, id: p.id });
    },
    reset: () => useDrive.getState().resetProgress(),
    zoneAt: (x: number, z: number) => zoneAt(x, z),
    projects: PROJECTS.map((p) => ({ id: p.id, x: p.x, z: p.z, zone: p.zone })),
  };
}
