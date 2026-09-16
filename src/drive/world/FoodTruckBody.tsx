import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { FirstFrameReady } from "@/components/canvas/runtime";
import { cloneFoodTruck } from "../systems/truck-asset";
import { vehicleAssetState } from "../data/vehicle";

function Wordmark({ rear = false }: { rear?: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#e9e5de";
    context.textAlign = "center";
    context.font = "500 106px Figtree, Arial, sans-serif";
    context.fillText("S × B", 512, 116);
    context.font = "500 44px Figtree, Arial, sans-serif";
    context.fillText("F O O D   S T U D I O", 512, 198);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={rear ? [0, 1.45, 1.708] : [-0.958, 1.5, 0.5]} rotation={rear ? [0, 0, 0] : [0, -Math.PI / 2, 0]}>
      <planeGeometry args={rear ? [1.48, 0.37] : [1.72, 0.43]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

/** Complete original geometry stays playable while a detailed body asset loads. */
export function ProceduralFoodTruck({ onReady }: { onReady?: () => void }) {
  return (
    <group name="FoodTruck_GeometryFallback">
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.9, 0.34, 3.4]} />
        <meshStandardMaterial color="#11151b" roughness={0.45} metalness={0.48} />
      </mesh>
      <mesh position={[0, 1.32, 0.57]} castShadow>
        <boxGeometry args={[1.9, 1.66, 2.26]} />
        <meshStandardMaterial color="#151a22" roughness={0.5} metalness={0.38} />
      </mesh>
      <mesh position={[0, 1.155, -1.1]} castShadow>
        <boxGeometry args={[1.78, 1.35, 1.2]} />
        <meshStandardMaterial color="#eee8de" roughness={0.3} metalness={0.28} />
      </mesh>
      <mesh position={[0, 1.89, -1.08]} castShadow>
        <boxGeometry args={[1.84, 0.12, 1.24]} />
        <meshStandardMaterial color="#ddd9d1" roughness={0.34} metalness={0.25} />
      </mesh>
      <mesh position={[0, 1.39, -1.708]}>
        <boxGeometry args={[1.54, 0.56, 0.025]} />
        <meshStandardMaterial color="#273a48" roughness={0.15} metalness={0.6} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh position={[side * 0.897, 1.38, -1.13]}>
            <boxGeometry args={[0.022, 0.54, 0.83]} />
            <meshStandardMaterial color="#273a48" roughness={0.16} metalness={0.55} />
          </mesh>
          <mesh position={[side * 1.025, 1.22, -1.57]} castShadow>
            <boxGeometry args={[0.13, 0.26, 0.12]} />
            <meshStandardMaterial color="#bcc4ca" roughness={0.24} metalness={0.82} />
          </mesh>
          <mesh position={[side * 0.959, 0.57, 0.06]}>
            <boxGeometry args={[0.025, 0.075, 3.2]} />
            <meshStandardMaterial color="#cbd0d3" roughness={0.28} metalness={0.8} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.968, 1.36, 0.55]}>
        <boxGeometry args={[0.03, 0.8, 1.58]} />
        <meshStandardMaterial color="#05080b" roughness={0.85} />
      </mesh>
      <mesh position={[1.03, 0.97, 0.55]} castShadow>
        <boxGeometry args={[0.26, 0.06, 1.69]} />
        <meshStandardMaterial color="#bec6ca" roughness={0.25} metalness={0.78} />
      </mesh>
      <mesh position={[1.03, 1.84, 0.55]} rotation={[0, 0, 0.07]} castShadow>
        <boxGeometry args={[0.27, 0.06, 1.74]} />
        <meshStandardMaterial color="#e6e0d6" roughness={0.35} metalness={0.18} />
      </mesh>
      <mesh position={[0.988, 1.72, 0.55]}>
        <boxGeometry args={[0.02, 0.018, 1.45]} />
        <meshStandardMaterial color="#ece8dd" emissive="#ece8dd" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.39, -1.72]}>
        <boxGeometry args={[1.76, 0.16, 0.14]} />
        <meshStandardMaterial color="#bac1c6" roughness={0.27} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.75, -1.714]}>
        <boxGeometry args={[0.7, 0.2, 0.026]} />
        <meshStandardMaterial color="#101318" roughness={0.5} />
      </mesh>
      <Wordmark />
      <Wordmark rear />
      {onReady && <FirstFrameReady onReady={onReady} />}
    </group>
  );
}

class TruckAssetBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <ProceduralFoodTruck onReady={markFallbackReady} /> : this.props.children; }
}

function markFallbackReady() { vehicleAssetState.status = "fallback"; }

function ImportedFoodTruck() {
  const { scene } = useGLTF(vehicleAssetState.asset);
  const truck = useMemo(() => cloneFoodTruck(scene), [scene]);
  const ready = useCallback(() => { vehicleAssetState.status = "glb"; }, []);
  return (
    <group name="FoodTruck_LoadedAsset">
      <primitive object={truck} dispose={null} />
      <FirstFrameReady onReady={ready} />
    </group>
  );
}

export function FoodTruckBody() {
  useLayoutEffect(() => {
    vehicleAssetState.status = "loading";
    return () => { vehicleAssetState.status = "loading"; };
  }, []);
  return (
    <TruckAssetBoundary>
      <Suspense fallback={<ProceduralFoodTruck />}>
        <ImportedFoodTruck />
      </Suspense>
    </TruckAssetBoundary>
  );
}
