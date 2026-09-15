import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Experience } from "./world/Experience";
import { StartScreen } from "./ui/StartScreen";
import { HUD } from "./ui/HUD";
import { ProjectModal } from "./ui/ProjectModal";
import { TouchControls } from "./ui/TouchControls";
import { useDrive } from "./store";

export default function DriveApp() {
  const started = useDrive((s) => s.started);

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
      {!started && <StartScreen />}
      {started && <HUD />}
      {started && <TouchControls />}
      <ProjectModal />
    </div>
  );
}
