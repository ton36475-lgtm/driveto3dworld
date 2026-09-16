import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PROJECTS } from "../data/projects";
import { sim } from "../systems/sim";
import { isDriveBlocked, useDrive } from "../store";
import { playCollect } from "../systems/audio";

function Sparkle({ color, active }: { color: string; active: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 18;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = (i / n) * Math.PI * 2;
      a[i * 3] = Math.cos(u) * 0.9;
      a[i * 3 + 1] = (i % 5) * 0.15;
      a[i * 3 + 2] = Math.sin(u) * 0.9;
    }
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (!ref.current || !active) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.8;
    const t = state.clock.elapsedTime;
    const arr = (ref.current.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] = 0.4 + Math.sin(t * 2 + i) * 0.35;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={color} size={0.12} transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

function Crystal({
  id,
  x,
  z,
  color,
}: {
  id: string;
  x: number;
  z: number;
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const collected = useDrive((s) => s.collected.includes(id));
  const collect = useDrive((s) => s.collect);
  const started = useDrive((s) => s.started);
  const taken = useRef(false);

  useEffect(() => {
    if (!collected) taken.current = false;
  }, [collected]);

  useFrame((state) => {
    if (taken.current || collected) return;
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.y = t * 1.4;
    m.position.y = 1.35 + Math.sin(t * 2.2 + x) * 0.22;
    const pulse = 0.85 + Math.sin(t * 4) * 0.4;
    (m.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    if (!started || isDriveBlocked()) return;
    const dx = sim.x - x;
    const dz = sim.z - z;
    if (dx * dx + dz * dz < 3.2 * 3.2) {
      taken.current = true;
      playCollect();
      collect(id);
    }
  });

  if (collected) return null;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.3, 6]} />
        <meshStandardMaterial color="#2a2d33" roughness={0.7} />
      </mesh>
      <mesh ref={mesh} position={[0, 1.35, 0]} castShadow>
        <octahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          metalness={0.25}
          roughness={0.2}
          transparent
          opacity={0.95}
        />
      </mesh>
      <Sparkle color={color} active={!collected} />
    </group>
  );
}

export function Collectibles() {
  return (
    <group>
      {PROJECTS.map((p) => (
        <Crystal key={p.id} id={p.id} x={p.x} z={p.z} color={p.color} />
      ))}
    </group>
  );
}
