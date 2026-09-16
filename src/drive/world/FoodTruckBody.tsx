import { Component, Suspense, useCallback, useLayoutEffect, useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { Material } from "three";
import { FirstFrameReady } from "@/components/canvas/runtime";
import { cloneFoodTruck, setTruckHatches } from "../systems/truck-asset";
import { FOOD_TRUCK, TRUCK_ASSET, TRUCK_HATCHES, TRUCK_LAMPS, TRUCK_WHEELS, vehicleAssetState, type TruckAssetStatus } from "../data/vehicle";

type ReadyStatus = Exclude<TruckAssetStatus, "loading">;
type BodyProps = {
  hatchesOpen?: boolean;
  runtimeLamps?: boolean;
  onAssetReady?: (status: ReadyStatus) => void;
};

type BoxProps = {
  at: [number, number, number];
  size: [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
};
function Box({ at, size, color = "#292c30", metalness = 0.25, roughness = 0.45 }: BoxProps) {
  return <mesh position={at} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} /></mesh>;
}

/** Lightweight pickup and workshop geometry keeps the full vehicle available after asset failure. */
export function ProceduralFoodTruck({ hatchesOpen = false, runtimeLamps = true, onReady }: Omit<BodyProps, "onAssetReady"> & { onReady?: () => void }) {
  return (
    <group name="FoodTruck_GeometryFallback">
      <Box at={[0, 0.36, -0.03]} size={[1.95, 0.28, 5.5]} color="#15171a" />
      {/* Pickup hood and cab; the tall work box extends over the cab. */}
      <Box at={[0, 0.83, -2.13]} size={[1.9, 0.48, 1.25]} />
      <Box at={[0, 1.22, -1.16]} size={[1.86, 1.13, 1.1]} />
      <Box at={[0, 1.49, -1.723]} size={[1.61, 0.55, 0.025]} color="#18282d" metalness={0.65} roughness={0.2} />
      <Box at={[0, 0.62, -2.82]} size={[1.95, 0.2, 0.08]} color="#111417" />
      <Box at={[0, 0.79, -2.771]} size={[0.75, 0.24, 0.04]} color="#101114" />
      <Box at={[0, 0.61, 1.09]} size={[2.05, 0.13, 2.75]} color="#a9adb1" metalness={0.7} />
      <Box at={[0, 2.74, 0.3]} size={[2.05, 0.13, 4.38]} />
      <Box at={[0, 2.26, -1.14]} size={[2.05, 0.82, 1.5]} />
      <Box at={[0, 1.68, 2.46]} size={[2.05, 2.05, 0.07]} />
      <Box at={[-0.24, 1.48, 2.506]} size={[0.95, 1.66, 0.035]} color="#1d2023" />
      <Box at={[0, 0.42, 2.63]} size={[1.91, 0.1, 0.23]} color="#a9adb1" metalness={0.7} />
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <Box at={[side * 0.945, 1.5, -1.15]} size={[0.025, 0.52, 0.88]} color="#18282d" metalness={0.65} roughness={0.2} />
          <Box at={[side * 1.05, 1.28, -1.58]} size={[0.12, 0.22, 0.18]} color="#15171a" />
          <Box at={[side * 1.003, 1.0, 1.07]} size={[0.05, 0.66, 2.75]} />
          <Box at={[side * 1.003, 2.58, 1.07]} size={[0.05, 0.22, 2.75]} />
          <Box at={[side * 1.003, 1.84, -0.08]} size={[0.05, 1.01, 0.48]} />
          <Box at={[side * 1.003, 1.84, 2.275]} size={[0.05, 1.01, 0.32]} />
          {/* Warm wood inner surfaces and a stainless worktop on each side. */}
          <Box at={[side * 0.83, 1.05, 1.06]} size={[0.31, 0.67, 2.63]} color="#8f603c" metalness={0} roughness={0.75} />
          <Box at={[side * 0.73, 1.405, 1.03]} size={[0.5, 0.05, 2.61]} color="#b8bec2" metalness={0.75} roughness={0.3} />
          <Box at={[side * 0.83, 2.53, 1.07]} size={[0.3, 0.3, 2.65]} color="#15171b" />
          <Box at={[side * 0.86, 2.895, 0.2]} size={[0.055, 0.055, 3.6]} color="#121417" />
        </group>
      ))}
      {TRUCK_HATCHES.map(({ name, position, direction }) => (
        <group key={name} name={`${name}_Fallback`} position={[...position]} rotation={[0, 0, hatchesOpen ? direction * FOOD_TRUCK.hatchAngle : 0]}>
          <Box at={[0, -0.48, 0]} size={[0.035, 0.96, 1.96]} color="#1b242a" metalness={0.6} roughness={0.2} />
          <Box at={[0.023 * direction, -0.92, 0]} size={[0.018, 0.035, 1.95]} color="#393e42" />
        </group>
      ))}
      {/* Rear ladder and internal bunk, sink and ceiling panels reflect the supplied views. */}
      {[-0.2, 0.2].map((z) => <Box key={z} at={[1.095, 1.54, 2.0 + z]} size={[0.035, 2.4, 0.035]} color="#17191b" />)}
      {[0.52, 0.87, 1.22, 1.57, 1.92, 2.27, 2.62].map((y) => <Box key={y} at={[1.095, y, 2]} size={[0.035, 0.035, 0.4]} color="#17191b" />)}
      <Box at={[0, 2.005, -0.86]} size={[1.91, 0.11, 1.78]} color="#151515" metalness={0} roughness={0.9} />
      <Box at={[0, 2.663, 1.1]} size={[1.92, 0.025, 2.55]} color="#ba8c5e" metalness={0} roughness={0.75} />
      <Box at={[0, 0.69, 1.1]} size={[1.91, 0.025, 2.64]} color="#b0b5b9" metalness={0.8} />
      <Box at={[-0.72, 1.434, 0.57]} size={[0.36, 0.01, 0.42]} color="#4b5359" metalness={0.8} />
      <Box at={[-0.89, 1.57, 0.48]} size={[0.025, 0.29, 0.025]} color="#bfc6ca" metalness={0.85} />
      {!runtimeLamps && <StaticLamps />}
      {onReady && <FirstFrameReady onReady={onReady} />}
    </group>
  );
}

export function TruckWheel() {
  return <>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[FOOD_TRUCK.wheelRadius, FOOD_TRUCK.wheelRadius, 0.22, 20]} /><meshStandardMaterial color="#111214" roughness={0.83} /></mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.22, 0.22, 0.232, 12]} /><meshStandardMaterial color="#272c30" metalness={0.72} roughness={0.36} /></mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.075, 0.075, 0.24, 12]} /><meshStandardMaterial color="#858d92" metalness={0.78} roughness={0.3} /></mesh>
  </>;
}

export function TruckLampFace({ kind, side, material }: { kind: "front" | "rear"; side: number; material?: Material }) {
  const lamp = TRUCK_LAMPS[kind];
  return <mesh
    position={[side * lamp.x, lamp.y, lamp.z]}
    rotation={kind === "front" ? [Math.PI / 2, 0, 0] : undefined}
    scale={kind === "front" ? [lamp.width / lamp.height, 1, 1] : undefined}
    material={material}
  >
    {kind === "front" ? <cylinderGeometry args={[lamp.height / 2, lamp.height / 2, lamp.depth, 8]} /> : <boxGeometry args={[lamp.width, lamp.height, lamp.depth]} />}
    {!material && <meshStandardMaterial color={kind === "front" ? "#dfe3e0" : "#902e2c"} metalness={0.5} roughness={0.25} />}
  </mesh>;
}

function StaticLamps() {
  return <>{[-1, 1].map((side) => <group key={side}><TruckLampFace side={side} kind="front" /><TruckLampFace side={side} kind="rear" /></group>)}</>;
}

class TruckAssetBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function ImportedFoodTruck({ hatchesOpen = false, runtimeLamps = true, onAssetReady }: BodyProps) {
  const { scene } = useGLTF(TRUCK_ASSET);
  const truck = useMemo(() => cloneFoodTruck(scene, { runtimeLamps }), [scene, runtimeLamps]);
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => { setTruckHatches(truck, hatchesOpen); invalidate(); }, [truck, hatchesOpen, invalidate]);
  const ready = useCallback(() => onAssetReady?.("glb"), [onAssetReady]);
  return <group name="FoodTruck_LoadedAsset"><primitive object={truck} dispose={null} /><FirstFrameReady onReady={ready} /></group>;
}

function BodyAsset({ hatchesOpen = false, runtimeLamps = true, onAssetReady }: BodyProps) {
  const fallbackReady = useCallback(() => onAssetReady?.("fallback"), [onAssetReady]);
  return <TruckAssetBoundary fallback={<ProceduralFoodTruck hatchesOpen={hatchesOpen} runtimeLamps={runtimeLamps} onReady={fallbackReady} />}>
    <Suspense fallback={<ProceduralFoodTruck hatchesOpen={hatchesOpen} runtimeLamps={runtimeLamps} />}>
      <ImportedFoodTruck hatchesOpen={hatchesOpen} runtimeLamps={runtimeLamps} onAssetReady={onAssetReady} />
    </Suspense>
  </TruckAssetBoundary>;
}

/** Drive alone owns its readiness state; showroom instances cannot change driving QA. */
export function FoodTruckBody() {
  useLayoutEffect(() => {
    vehicleAssetState.status = "loading";
    return () => { vehicleAssetState.status = "loading"; };
  }, []);
  const ready = useCallback((status: ReadyStatus) => { vehicleAssetState.status = status; }, []);
  return <BodyAsset onAssetReady={ready} />;
}

/** Parked assembly; tire bottoms clear a y=0 floor. Camera and lighting belong to the host. */
export function StaticFoodTruck({ hatchesOpen = false, onAssetReady }: Pick<BodyProps, "hatchesOpen" | "onAssetReady">) {
  return <group name="FoodTruck_Inspection" position={[0, FOOD_TRUCK.rideHeight, 0]}>
    <BodyAsset runtimeLamps={false} hatchesOpen={hatchesOpen} onAssetReady={onAssetReady} />
    {TRUCK_WHEELS.map((position, index) => <group key={index} position={position}><TruckWheel /></group>)}
  </group>;
}
