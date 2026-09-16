import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Experience } from "./world/Experience";
import { StartScreen } from "./ui/StartScreen";
import { HUD } from "./ui/HUD";
import { ProjectModal } from "./ui/ProjectModal";
import { TouchControls } from "./ui/TouchControls";
import { Catalog } from "./ui/Catalog";
import { Settings } from "./ui/Settings";
import { CompleteOverlay, PauseOverlay } from "./ui/Overlays";
import { useDrive } from "./store";
import { setMuted, setAudioActive } from "./systems/audio";
import { installQA } from "./systems/qa";
import { useLang } from "@/lib/lang";
import { isInteractiveTarget, setInputLocked } from "./systems/input";
import { ContextLossGuard } from "@/components/canvas/runtime";
import { useReducedMotion, useSceneVisibility } from "@/components/canvas/runtime-hooks";
import { WebGLBoundary } from "@/components/canvas/webgl-boundary";
import { StudyFallback } from "./ui/StudyFallback";

export default function DriveApp() {
  const root = useRef<HTMLDivElement>(null);
  const live = useSceneVisibility(root);
  const reducedMotion = useReducedMotion();
  const [unavailable, setUnavailable] = useState(false);
  const onUnavailable = useCallback(() => setUnavailable(true), []);
  const started = useDrive((s) => s.started);
  const quality = useDrive((s) => s.quality);
  const muted = useDrive((s) => s.muted);
  const overlay = useDrive((s) => s.overlay);
  const activeId = useDrive((s) => s.activeId);
  const toggleOverlay = useDrive((s) => s.toggleOverlay);
  const setOverlay = useDrive((s) => s.setOverlay);
  const closeModal = useDrive((s) => s.closeModal);
  const setMutedStore = useDrive((s) => s.setMuted);
  const siteLang = useLang((s) => s.lang);
  const setDriveLang = useDrive((s) => s.setLang);
  const blocked = !live || unavailable || Boolean(activeId) || overlay !== "none";

  useEffect(() => {
    setInputLocked(blocked || !started);
    setAudioActive(!blocked && started);
    return () => { setInputLocked(true); setAudioActive(false); };
  }, [blocked, started]);

  useEffect(() => {
    setDriveLang(siteLang);
  }, [siteLang, setDriveLang]);

  useEffect(() => {
    installQA();
    setMuted(muted);
  }, [muted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.code === "Escape") {
        if (activeId) {
          closeModal();
          return;
        }
        if (overlay !== "none") {
          setOverlay("none");
          return;
        }
        if (started) toggleOverlay("pause");
        return;
      }
      if (isInteractiveTarget(e.target)) return;
      if (e.code === "KeyM") setMutedStore(!useDrive.getState().muted);
      if (!started) return;
      if (e.code === "KeyC") toggleOverlay("catalog");
      if (e.code === "KeyP" && overlay === "none" && !activeId) toggleOverlay("pause");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, overlay, activeId, closeModal, setOverlay, toggleOverlay, setMutedStore]);

  return (
    <div className="drive-root" ref={root}>
      {unavailable ? <StudyFallback /> : <WebGLBoundary fallback={<StudyFallback />} onFailure={onUnavailable}>
      <Canvas
        shadows={quality !== "low"}
        dpr={quality === "low" ? 1 : [1, quality === "medium" ? 1.25 : 1.6]}
        frameloop={!live ? "never" : blocked || (reducedMotion && !started) ? "demand" : "always"}
        gl={{ antialias: false, powerPreference: "default", alpha: false }}
        camera={{ position: [14, 8, 14], fov: 50, near: 0.1, far: 220 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0b0d10");
          gl.shadowMap.enabled = quality !== "low";
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
      >
        <ContextLossGuard onLost={onUnavailable} />
        <Experience />
      </Canvas>
      {!started && overlay === "none" && <StartScreen />}
      {started && overlay !== "pause" && <HUD />}
      {started && overlay === "none" && !activeId && <TouchControls />}
      <ProjectModal />
      <Catalog />
      <Settings />
      <PauseOverlay />
      <CompleteOverlay />
      </WebGLBoundary>}
    </div>
  );
}
