import { useEffect } from "react";
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
import { setMuted } from "./systems/audio";
import { installQA } from "./systems/qa";

export default function DriveApp() {
  const started = useDrive((s) => s.started);
  const muted = useDrive((s) => s.muted);
  const overlay = useDrive((s) => s.overlay);
  const activeId = useDrive((s) => s.activeId);
  const toggleOverlay = useDrive((s) => s.toggleOverlay);
  const setOverlay = useDrive((s) => s.setOverlay);
  const closeModal = useDrive((s) => s.closeModal);
  const setMutedStore = useDrive((s) => s.setMuted);

  useEffect(() => {
    installQA();
    setMuted(muted);
  }, [muted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
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
      if (e.code === "KeyM") setMutedStore(!useDrive.getState().muted);
      if (!started) return;
      if (e.code === "KeyC") toggleOverlay("catalog");
      if (e.code === "KeyP" && overlay === "none" && !activeId) toggleOverlay("pause");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, overlay, activeId, closeModal, setOverlay, toggleOverlay, setMutedStore]);

  return (
    <div className="drive-root">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
        camera={{ position: [14, 8, 14], fov: 50, near: 0.1, far: 220 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0b0d10");
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
      >
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
    </div>
  );
}
