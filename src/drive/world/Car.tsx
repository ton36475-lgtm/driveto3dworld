import { useEffect, useLayoutEffect, useRef } from "react";
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

export function Car() {
  const reducedMotion = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const lightL = useRef<THREE.SpotLight>(null);
  const lightR = useRef<THREE.SpotLight>(null);
  const targetL = useRef<THREE.Object3D>(null);
  const targetR = useRef<THREE.Object3D>(null);
  const started = useDrive((s) => s.started);
  const setSpeedKmh = useDrive((s) => s.setSpeedKmh);
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

    if (!started) {
      g.position.set(sim.x, sim.y, sim.z);
      g.rotation.y = sim.yaw;
      if (reducedMotion) state.camera.position.set(14, 8, 14);
      else {
        const t = state.clock.elapsedTime * 0.12;
        state.camera.position.lerp(tmp.current.desired.set(Math.sin(t) * 16, 7.5, Math.cos(t) * 16), 1 - Math.exp(-2.2 * dt));
      }
      state.camera.lookAt(0, 0.6, 0);
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
    g.rotation.z = reducedMotion ? 0 : sim.roll;

    for (let i = 0; i < wheels.current.length; i++) {
      const w = wheels.current[i];
      if (!w) continue;
      w.rotation.x = sim.wheel;
      if (i < 2) w.parent!.rotation.y = sim.steer * 0.42;
    }

    const fx = -Math.sin(sim.yaw);
    const fz = -Math.cos(sim.yaw);
    const follow = 8.6;
    const height = 4.4;
    const { desired, look, cam } = tmp.current;
    desired.set(sim.x - fx * follow, sim.y + height, sim.z - fz * follow);
    look.set(sim.x + fx * 5.5, sim.y + 0.85, sim.z + fz * 5.5);
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

  const night = dayState.night;

  return (
    <group ref={group} position={[sim.x, sim.y, sim.z]}>
      <mesh castShadow position={[0, 0.28, -0.12]}>
        <boxGeometry args={[1.28, 0.36, 2.28]} />
        <meshStandardMaterial color="#e25b4c" metalness={0.35} roughness={0.38} />
      </mesh>
      <mesh castShadow position={[0, 0.52, 0.18]}>
        <boxGeometry args={[1.08, 0.34, 1.12]} />
        <meshStandardMaterial color="#1a1c20" metalness={0.2} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.58, 0.16]}>
        <boxGeometry args={[0.98, 0.22, 0.92]} />
        <meshStandardMaterial color="#8fb4c8" metalness={0.7} roughness={0.12} transparent opacity={0.45} />
      </mesh>
      <mesh position={[0, 0.22, -1.22]}>
        <boxGeometry args={[1.18, 0.12, 0.12]} />
        <meshStandardMaterial color="#cfc8be" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.42, 0.28, -1.18]}>
        <boxGeometry args={[0.18, 0.1, 0.08]} />
        <meshStandardMaterial color="#f4efe6" emissive="#f4efe6" emissiveIntensity={0.4 + night * 2.2} />
      </mesh>
      <mesh position={[0.42, 0.28, -1.18]}>
        <boxGeometry args={[0.18, 0.1, 0.08]} />
        <meshStandardMaterial color="#f4efe6" emissive="#f4efe6" emissiveIntensity={0.4 + night * 2.2} />
      </mesh>
      <mesh position={[-0.4, 0.3, 1.08]}>
        <boxGeometry args={[0.22, 0.08, 0.06]} />
        <meshStandardMaterial color="#e25b4c" emissive="#e25b4c" emissiveIntensity={0.3 + night * 1.6} />
      </mesh>
      <mesh position={[0.4, 0.3, 1.08]}>
        <boxGeometry args={[0.22, 0.08, 0.06]} />
        <meshStandardMaterial color="#e25b4c" emissive="#e25b4c" emissiveIntensity={0.3 + night * 1.6} />
      </mesh>
      {(
        [
          [-0.58, 0.18, -0.72],
          [0.58, 0.18, -0.72],
          [-0.58, 0.18, 0.78],
          [0.58, 0.18, 0.78],
        ] as const
      ).map((p, i) => (
        <group key={i} position={[p[0], p[1], p[2]]}>
          <group
            ref={(el) => {
              if (el) wheels.current[i] = el;
            }}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.16, 10]} />
              <meshStandardMaterial color="#141416" roughness={0.7} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.17, 8]} />
              <meshStandardMaterial color="#cfc8be" metalness={0.7} roughness={0.25} />
            </mesh>
          </group>
        </group>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[1.3, 12]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>
      <object3D ref={targetL} position={[-0.42, 0.1, -10]} />
      <object3D ref={targetR} position={[0.42, 0.1, -10]} />
      <spotLight
        ref={lightL}
        position={[-0.42, 0.42, -1.15]}
        angle={0.42}
        penumbra={0.55}
        distance={26}
        color="#fff4e4"
        intensity={0}
        castShadow={false}
      />
      <spotLight
        ref={lightR}
        position={[0.42, 0.42, -1.15]}
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
