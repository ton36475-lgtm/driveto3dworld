import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sim, advanceSimulation } from "../systems/sim";
import {
  attachInput,
  installControlsTest,
  pollGamepad,
  readAxes,
} from "../systems/input";
import { setEngine } from "../systems/audio";
import { isDriveBlocked, useDrive } from "../store";
import { dayState } from "../systems/dayNight";
import { installQA } from "../systems/qa";
import { useReducedMotion } from "@/components/canvas/runtime-hooks";
import { FoodTruckBody, TruckLampFace, TruckWheel } from "./FoodTruckBody";
import { FOOD_TRUCK, TRUCK_LAMPS, TRUCK_WHEELS } from "../data/vehicle";

export function Car() {
  const reducedMotion = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const lightL = useRef<THREE.SpotLight>(null);
  const lightR = useRef<THREE.SpotLight>(null);
  const bodyFill = useRef<THREE.PointLight>(null);
  const targetL = useRef<THREE.Object3D>(null);
  const targetR = useRef<THREE.Object3D>(null);
  const started = useDrive((s) => s.started);
  const setSpeedKmh = useDrive((s) => s.setSpeedKmh);
  const lamps = useMemo(() => ({
    front: new THREE.MeshStandardMaterial({ color: "#f4efe6", emissive: "#f4efe6", emissiveIntensity: 0.4 }),
    rear: new THREE.MeshStandardMaterial({ color: "#a9403b", emissive: "#a9403b", emissiveIntensity: 0.3 }),
  }), []);
  useEffect(() => () => { lamps.front.dispose(); lamps.rear.dispose(); }, [lamps]);
  const tmp = useRef({
    cam: new THREE.Vector3(),
    look: new THREE.Vector3(),
    desired: new THREE.Vector3(),
  });

  useEffect(() => {
    const detach = attachInput();
    installControlsTest(
      () => sim.yaw,
      () => sim.speed,
    );
    installQA();
    return detach;
  }, []);

  useLayoutEffect(() => {
    if (lightL.current && targetL.current) lightL.current.target = targetL.current;
    if (lightR.current && targetR.current) lightR.current.target = targetR.current;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const g = group.current;
    if (!g) return;
    const blocked = isDriveBlocked();
    lamps.front.emissiveIntensity = 0.4 + dayState.night * 2.2;
    lamps.rear.emissiveIntensity = 0.3 + dayState.night * 1.6;
    if (bodyFill.current) bodyFill.current.intensity = 4 + (1 - dayState.night) * 18;

    if (!started) {
      g.position.set(sim.x, sim.y, sim.z);
      g.rotation.y = sim.yaw;
      if (reducedMotion) state.camera.position.set(sim.x + 8.8, sim.y + 5.5, sim.z + 10.5);
      else {
        const t = state.clock.elapsedTime * 0.08 + 0.7;
        state.camera.position.lerp(tmp.current.desired.set(sim.x + Math.sin(t) * 12.5, sim.y + 5.5, sim.z + Math.cos(t) * 12.5), 1 - Math.exp(-2.2 * dt));
      }
      state.camera.lookAt(sim.x, sim.y + 1.4, sim.z);
      return;
    }

    if (!blocked) {
      pollGamepad();
      advanceSimulation(readAxes(), dt);
      setEngine(sim.speed);
      setSpeedKmh(Math.abs(sim.speed) * 7.2);
    } else {
      sim.speed *= Math.pow(0.02, dt);
      setEngine(0);
    }

    g.position.set(sim.x, sim.y, sim.z);
    g.rotation.order = "YZX";
    g.rotation.y = sim.yaw;
    g.rotation.z = reducedMotion ? 0 : sim.roll * 0.35;

    for (let i = 0; i < wheels.current.length; i++) {
      const w = wheels.current[i];
      if (!w) continue;
      w.rotation.x = sim.wheel;
      if (i < 2) w.parent!.rotation.y = sim.steer * 0.42;
    }

    const fx = -Math.sin(sim.yaw);
    const fz = -Math.cos(sim.yaw);
    const follow = 12.2;
    const height = 6.8;
    const { desired, look, cam } = tmp.current;
    desired.set(sim.x - fx * follow, sim.y + height, sim.z - fz * follow);
    look.set(sim.x + fx * 5.5, sim.y + 1.45, sim.z + fz * 5.5);
    cam.copy(state.camera.position);
    cam.lerp(desired, reducedMotion ? 1 : 1 - Math.exp(-3.4 * dt));
    state.camera.position.copy(cam);
    state.camera.lookAt(look);

    const cam3 = state.camera as THREE.PerspectiveCamera;
    const targetFov = reducedMotion ? 50 : 50 + Math.min(9, Math.abs(sim.speed) * 0.5);
    cam3.fov = THREE.MathUtils.damp(cam3.fov, targetFov, 4, dt);
    cam3.updateProjectionMatrix();

    const night = dayState.night;
    const hi = night * 6.5;
    if (lightL.current) lightL.current.intensity = hi;
    if (lightR.current) lightR.current.intensity = hi;
  });

  return (
    <group ref={group} position={[sim.x, sim.y, sim.z]}>
      <FoodTruckBody />
      {/* Bounded, shadow-free rear fill keeps charcoal body details legible in the driving view. */}
      <pointLight ref={bodyFill} position={[-2.4, 4.2, 4.5]} color="#d6e0eb" intensity={16} distance={9} decay={2} castShadow={false} />
      {[-1, 1].map((side) => <group key={side}>
        <TruckLampFace side={side} kind="front" material={lamps.front} />
        <TruckLampFace side={side} kind="rear" material={lamps.rear} />
      </group>)}
      {TRUCK_WHEELS.map((p, i) => (
        <group key={i} position={[p[0], p[1], p[2]]}>
          <group
            ref={(el) => {
              if (el) wheels.current[i] = el;
            }}
          >
            <TruckWheel />
          </group>
        </group>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015 - FOOD_TRUCK.rideHeight, 0]} scale={[1, 2.4, 1]} receiveShadow>
        <circleGeometry args={[1.28, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>
      <object3D ref={targetL} position={[-0.67, 0.05, -12]} />
      <object3D ref={targetR} position={[0.67, 0.05, -12]} />
      <spotLight
        ref={lightL}
        position={[-TRUCK_LAMPS.front.x, TRUCK_LAMPS.front.y, TRUCK_LAMPS.front.z - 0.05]}
        angle={0.42}
        penumbra={0.55}
        distance={26}
        color="#fff4e4"
        intensity={0}
        castShadow={false}
      />
      <spotLight
        ref={lightR}
        position={[TRUCK_LAMPS.front.x, TRUCK_LAMPS.front.y, TRUCK_LAMPS.front.z - 0.05]}
        angle={0.42}
        penumbra={0.55}
        distance={26}
        color="#fff4e4"
        intensity={0}
        castShadow={false}
      />
    </group>
  );
}
