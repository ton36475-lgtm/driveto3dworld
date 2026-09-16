import { OrbitControls, Preload, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { AtelierWorld, type SceneLayout } from "@/components/canvas/atelier-world";
import type { Quality } from "@/components/canvas/quality";
import { cameraForPose, framePoses } from "@/lib/frame-layout";
import { WORKS, type Work } from "@/lib/works";
import { ContextLossGuard, FirstFrameReady } from "@/components/canvas/runtime";

WORKS.forEach((work) => useTexture.preload(work.image));

const CAM = new THREE.Vector3();
const TGT = new THREE.Vector3();
const HOME = new THREE.Vector3(0, 1.02, 0);

type ControlsHandle = {
  target: THREE.Vector3;
};

type Props = {
  works: Work[];
  quality: Quality;
  reducedMotion?: boolean;
  onUnavailable: () => void;
  onReady: () => void;
  selected: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
  autoRotate?: boolean;
  enableZoom?: boolean;
  cameraZ?: number;
  layout?: SceneLayout;
  focus?: boolean;
  frameloop?: "always" | "demand" | "never";
};

export default function HeroScene({
  works,
  quality,
  reducedMotion = false,
  onUnavailable,
  onReady,
  selected,
  onHover,
  onSelect,
  autoRotate = true,
  enableZoom = false,
  cameraZ = 4.35,
  layout = "ring",
  focus = false,
  frameloop = "always",
}: Props) {
  const low = quality === "low";
  const controlsRef = useRef<ControlsHandle | null>(null);
  const solo = layout === "solo";

  return (
    <Canvas
      shadows={!low}
      dpr={low ? 1 : [1, 1.6]}
      frameloop={frameloop}
      gl={{
        antialias: !low,
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{
        position: solo ? [0, 1.42, 4.05] : [0, 1.72, cameraZ],
        fov: 48,
        near: 0.1,
        far: 48,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0b0b0c");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      style={{ touchAction: "none" }}
    >
      <ContextLossGuard onLost={onUnavailable} />
      <AtelierWorld
        works={works}
        quality={quality}
        reducedMotion={reducedMotion}
        selected={selected}
        onHover={onHover}
        onSelect={onSelect}
        layout={layout}
      />
      <CameraDirector
        selected={selected}
        works={works}
        layout={layout}
        enabled={focus}
        cameraZ={cameraZ}
        controlsRef={controlsRef}
        reducedMotion={reducedMotion}
      />
      <OrbitControls
        ref={controlsRef as never}
        enablePan={false}
        enableZoom={enableZoom}
        enableDamping={!reducedMotion}
        dampingFactor={0.055}
        autoRotate={autoRotate && !reducedMotion && !low && !selected}
        autoRotateSpeed={0.28}
        minDistance={solo ? 2.5 : 2.2}
        maxDistance={solo ? 6.2 : 6.1}
        minPolarAngle={Math.PI / 3.25}
        maxPolarAngle={Math.PI / 2.06}
        target={solo ? [0, 1.22, -0.4] : [0, 1.02, 0]}
      />
      <Preload all />
      <FirstFrameReady onReady={onReady} />
    </Canvas>
  );
}

function CameraDirector({
  selected,
  works,
  layout,
  enabled,
  cameraZ,
  controlsRef,
  reducedMotion,
}: {
  selected: string | null;
  works: Work[];
  layout: SceneLayout;
  enabled: boolean;
  cameraZ: number;
  controlsRef: RefObject<ControlsHandle | null>;
  reducedMotion: boolean;
}) {
  const poses = useMemo(() => framePoses(works.length), [works.length]);
  const fly = useRef(0);

  useEffect(() => {
    fly.current = 1.25;
  }, [selected, layout, reducedMotion, enabled, cameraZ]);

  useFrame((state, delta) => {
    if (!enabled) return;
    const d = Math.min(delta, 0.1);
    fly.current = Math.max(0, fly.current - d * 0.5);
    if (fly.current <= 0) return;
    const k = reducedMotion ? 1 : 1 - Math.exp(-3.2 * d);
    const controls = controlsRef.current;

    if (layout === "solo") {
      TGT.set(0, 1.22, -0.4);
      CAM.set(0, 1.42, 4.05);
    } else if (selected) {
      const index = works.findIndex((work) => work.slug === selected);
      if (index < 0) return;
      const pose = poses[index];
      TGT.set(pose.x, pose.y, pose.z);
      const cam = cameraForPose(pose);
      CAM.set(cam.x, cam.y, cam.z);
    } else {
      const px = state.camera.position.x;
      const pz = state.camera.position.z;
      const len = Math.hypot(px, pz) || 1;
      CAM.set((px / len) * cameraZ, 1.72, (pz / len) * cameraZ);
      TGT.copy(HOME);
    }

    state.camera.position.lerp(CAM, k);
    if (controls) controls.target.lerp(TGT, k);
    if (reducedMotion) {
      state.camera.lookAt(TGT);
      fly.current = 0;
    }
  });

  return null;
}
