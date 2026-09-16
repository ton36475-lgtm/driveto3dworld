import type { ReactNode } from "react";
import { Html } from "@react-three/drei";
import { PROJECTS, ZONES } from "../data/projects";
import { useDrive } from "../store";

function Label({ text, color }: { text: string; color: string }) {
  return (
    <Html position={[0, 4.2, 0]} transform sprite center distanceFactor={22} style={{ pointerEvents: "none" }}>
      <span className="block whitespace-nowrap rounded-full border border-white/20 bg-[#0b0d10]/85 px-3 py-1.5 text-sm font-semibold shadow-sm" style={{ color }}>
        {text}
      </span>
    </Html>
  );
}

function Pavilion() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[8, 0.3, 8]} />
        <meshStandardMaterial color="#d8d2c8" roughness={0.6} />
      </mesh>
      {[
        [-3.2, 1.6, -3.2],
        [3.2, 1.6, -3.2],
        [-3.2, 1.6, 3.2],
        [3.2, 1.6, 3.2],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.22, 3.2, 0.22]} />
          <meshStandardMaterial color="#cfc8be" metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 3.3, 0]} castShadow>
        <boxGeometry args={[8.4, 0.12, 8.4]} />
        <meshStandardMaterial color="#e8e2d6" metalness={0.15} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[7.4, 2.8, 7.4]} />
        <meshStandardMaterial color="#9ec4d8" transparent opacity={0.22} metalness={0.6} roughness={0.08} />
      </mesh>
    </group>
  );
}

function Robot() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[1.4, 1.6, 0.4, 8]} />
        <meshStandardMaterial color="#2a2428" />
      </mesh>
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[1.1, 1.4, 0.8]} />
        <meshStandardMaterial color="#c9c4be" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.25, 0]} castShadow>
        <boxGeometry args={[0.7, 0.55, 0.6]} />
        <meshStandardMaterial color="#d8d4ce" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.3, 0.32]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#e25b4c" emissive="#e25b4c" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} />
        <meshStandardMaterial color="#8b93a1" metalness={0.8} />
      </mesh>
      <mesh position={[-0.8, 1.4, 0]} castShadow>
        <boxGeometry args={[0.28, 1.1, 0.28]} />
        <meshStandardMaterial color="#b8b3ad" />
      </mesh>
      <mesh position={[0.8, 1.4, 0]} castShadow>
        <boxGeometry args={[0.28, 1.1, 0.28]} />
        <meshStandardMaterial color="#b8b3ad" />
      </mesh>
    </group>
  );
}

function HoverBike() {
  return (
    <group>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.16, 16]} />
        <meshStandardMaterial color="#2a3128" />
      </mesh>
      <mesh position={[0, 1.15, 0]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.28, 2.4]} />
        <meshStandardMaterial color="#7eae6e" metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.45, 0.2]} castShadow>
        <boxGeometry args={[0.5, 0.22, 0.8]} />
        <meshStandardMaterial color="#1a1c20" />
      </mesh>
      <mesh position={[0, 0.85, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.08, 8, 16]} />
        <meshStandardMaterial color="#8b93a1" metalness={0.7} emissive="#7eae6e" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.85, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.08, 8, 16]} />
        <meshStandardMaterial color="#8b93a1" metalness={0.7} emissive="#7eae6e" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function LampProduct() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.3, 2.2]} />
        <meshStandardMaterial color="#3a2e1c" />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1.6, 8]} />
        <meshStandardMaterial color="#cfc8be" metalness={0.6} roughness={0.3} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 1.7 + i * 0.28, 0]}>
          <torusGeometry args={[0.55 - i * 0.08, 0.07, 8, 20]} />
          <meshStandardMaterial color="#e8c078" metalness={0.4} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color="#f3eee6" emissive="#f3eee6" emissiveIntensity={1.1} />
      </mesh>
    </group>
  );
}

function MiniHouse({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.4, 0.9, 1.1]} />
        <meshStandardMaterial color="#d8d2c8" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.05, 0.7, 4]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
      </mesh>
    </group>
  );
}

function MiniBust({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.5, 8]} />
        <meshStandardMaterial color="#c9c4be" />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.32, 10, 10]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
      </mesh>
    </group>
  );
}

function MiniWheel({ color }: { color: string }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <torusGeometry args={[0.55, 0.12, 8, 18]} />
        <meshStandardMaterial color="#1a1c20" metalness={0.4} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.16, 8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function MiniObject({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.34, 0.9, 10]} />
        <meshStandardMaterial color="#cfc8be" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}

const SHOW: Record<string, () => ReactNode> = {
  architecture: Pavilion,
  characters: Robot,
  vehicles: HoverBike,
  products: LampProduct,
};

const MINI: Record<string, (c: string) => ReactNode> = {
  architecture: (c) => <MiniHouse color={c} />,
  characters: (c) => <MiniBust color={c} />,
  vehicles: (c) => <MiniWheel color={c} />,
  products: (c) => <MiniObject color={c} />,
};

export function Landmarks() {
  const lang = useDrive((s) => s.lang);
  return (
    <group>
      {ZONES.map((z) => {
        const Piece = SHOW[z.id];
        return (
          <group key={z.id} position={[z.x, 0, z.z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
              <circleGeometry args={[7.5, 24]} />
              <meshStandardMaterial color={z.pad} roughness={0.8} />
            </mesh>
            <Piece />
            <Label text={z.name[lang]} color={z.color} />
          </group>
        );
      })}
      {PROJECTS.map((p) => (
        <group key={p.id} position={[p.x + 2.4, 0, p.z - 1.6]}>
          {MINI[p.zone](p.color)}
        </group>
      ))}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[11, 15.5, 48]} />
        <meshStandardMaterial color="#3a3e46" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2.2, 0.8, 2.2]} />
        <meshStandardMaterial color="#e25b4c" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#f3eee6" emissive="#e25b4c" emissiveIntensity={0.35} metalness={0.4} />
      </mesh>
    </group>
  );
}
