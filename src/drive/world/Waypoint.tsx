import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sim } from "../systems/sim";
import { useDrive } from "../store";

export function Waypoint() {
  const ref = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const waypoint = useDrive((s) => s.waypoint);
  const clear = useDrive((s) => s.setWaypoint);

  useFrame((state) => {
    const g = ref.current;
    if (!g || !waypoint) return;
    const t = state.clock.elapsedTime;
    g.position.set(waypoint.x, 0, waypoint.z);
    if (beam.current) beam.current.position.y = 4 + Math.sin(t * 2) * 0.35;
    const dx = sim.x - waypoint.x;
    const dz = sim.z - waypoint.z;
    if (dx * dx + dz * dz < 16) clear(null);
  });

  if (!waypoint) return null;

  return (
    <group ref={ref} position={[waypoint.x, 0, waypoint.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[1.1, 1.45, 24]} />
        <meshBasicMaterial color="#e25b4c" transparent opacity={0.85} />
      </mesh>
      <mesh ref={beam} position={[0, 4, 0]}>
        <cylinderGeometry args={[0.06, 0.18, 8, 6]} />
        <meshBasicMaterial color="#e25b4c" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
