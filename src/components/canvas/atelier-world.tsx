import {
  ContactShadows,
  MeshReflectorMaterial,
  Sparkles,
  Text,
  useTexture,
} from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Quality } from "@/components/canvas/quality";
import { framePoses, wallRadius } from "@/lib/frame-layout";
import type { Work } from "@/lib/works";
import { useLocale } from "@/lib/copy";
import { FrameAsset } from "@/components/canvas/frame-asset";

const FRAME_W = 1.78;
const FRAME_H = 1.24;

export type SceneLayout = "ring" | "solo";

type WorldProps = {
  works: Work[];
  quality: Quality;
  reducedMotion?: boolean;
  selected: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
  layout?: SceneLayout;
};

export function AtelierWorld({
  works,
  quality,
  reducedMotion = false,
  selected,
  onHover,
  onSelect,
  layout = "ring",
}: WorldProps) {
  const low = quality === "low";
  const solo = layout === "solo";
  const count = solo ? 1 : works.length;
  const poses = useMemo(() => framePoses(count), [count]);
  const wallR = wallRadius(solo ? 8 : Math.max(count, 4));

  return (
    <>
      <color attach="background" args={["#0b0b0c"]} />
      <fog attach="fog" args={["#0b0b0c", solo ? 11 : 14, solo ? 22 : 28]} />
      <hemisphereLight args={["#e8e2d8", "#0b0b0c", 0.42]} />
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[0, 9, 0.4]}
        intensity={low ? 1.1 : 1.55}
        color="#f1ece4"
        castShadow={!low}
        shadow-mapSize={1024}
        shadow-camera-far={22}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[0, 3.55, 0]} intensity={16} distance={16} color="#f4efe6" />
      <spotLight
        position={[0, 3.7, 0]}
        angle={1.05}
        penumbra={1}
        intensity={low ? 28 : 46}
        color="#f1ece4"
      />

      <SalonShell radius={solo ? 4.55 : wallR} quality={quality} />

      {!solo ? <Monogram animated={!low && !reducedMotion} /> : null}

      {works.map((work, index) => {
        const pose = poses[solo ? 0 : index] ?? poses[0];
        return (
          <WorkFrame
            key={work.slug}
            work={work}
            position={[pose.x, pose.y, pose.z]}
            rotation={pose.rotY}
            active={selected === work.slug}
            dimmed={Boolean(selected && selected !== work.slug)}
            lit={!low}
            reducedMotion={reducedMotion}
            onHover={onHover}
            onSelect={onSelect}
          />
        );
      })}

      {!low && !solo && !reducedMotion ? (
        <Sparkles
          count={28}
          scale={[10, 3.2, 10]}
          size={1.5}
          speed={0.22}
          opacity={0.28}
          color="#e8e4dc"
          position={[0, 2.1, 0]}
        />
      ) : null}

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.38}
        scale={solo ? 9 : 16}
        blur={2.4}
        far={6.5}
      />
    </>
  );
}

function SalonShell({ radius, quality }: { radius: number; quality: Quality }) {
  const low = quality === "low";
  const n = 8;
  const height = 3.92;
  const theta = (Math.PI * 2) / n;
  const width = 2 * radius * Math.tan(theta / 2) - 0.16;
  const plaster = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#17171a",
        metalness: 0.18,
        roughness: 0.78,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const trim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1c1c20",
        metalness: 0.48,
        roughness: 0.42,
      }),
    [],
  );

  useEffect(
    () => () => {
      plaster.dispose();
      trim.dispose();
    },
    [plaster, trim],
  );

  const corners = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const a = ((i + 0.5) / n) * Math.PI * 2;
        return { x: Math.sin(a) * radius, z: Math.cos(a) * radius };
      }),
    [n, radius],
  );

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[radius + 1.15, low ? 48 : 72]} />
        {low ? (
          <meshStandardMaterial color="#121214" metalness={0.62} roughness={0.4} />
        ) : (
          <MeshReflectorMaterial
            blur={[280, 80]}
            resolution={512}
            mixBlur={0.85}
            mixStrength={28}
            roughness={0.82}
            metalness={0.55}
            depthScale={0.7}
            minDepthThreshold={0.35}
            maxDepthThreshold={1.35}
            color="#101012"
            mirror={0.12}
          />
        )}
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0]}>
        <circleGeometry args={[2.35, 48]} />
        <meshStandardMaterial color="#161410" metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.32, 2.38, 64]} />
        <meshStandardMaterial
          color="#c5cdd6"
          metalness={0.86}
          roughness={0.24}
          emissive="#c5cdd6"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[4.55, 4.6, 64]} />
        <meshStandardMaterial
          color="#c5cdd6"
          metalness={0.86}
          roughness={0.24}
          emissive="#c5cdd6"
          emissiveIntensity={0.08}
        />
      </mesh>

      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const x = Math.sin(a) * radius;
        const z = Math.cos(a) * radius;
        return (
          <group key={i}>
            <mesh
              position={[x, height / 2, z]}
              rotation={[0, a, 0]}
              material={plaster}
              receiveShadow
            >
              <boxGeometry args={[width, height, 0.16]} />
            </mesh>
            <mesh
              position={[Math.sin(a) * (radius - 0.04), 0.1, Math.cos(a) * (radius - 0.04)]}
              rotation={[0, a, 0]}
              material={trim}
            >
              <boxGeometry args={[width, 0.2, 0.22]} />
            </mesh>
            <mesh
              position={[
                Math.sin(a) * (radius - 0.03),
                height - 0.1,
                Math.cos(a) * (radius - 0.03),
              ]}
              rotation={[0, a, 0]}
              material={trim}
            >
              <boxGeometry args={[width, 0.14, 0.18]} />
            </mesh>
          </group>
        );
      })}

      {corners.map((node, i) => (
        <mesh key={i} position={[node.x, height / 2, node.z]} material={trim} castShadow>
          <cylinderGeometry args={[0.1, 0.12, height + 0.04, low ? 8 : 12]} />
        </mesh>
      ))}

      <mesh rotation-x={Math.PI / 2} position={[0, height, 0]} material={plaster}>
        <ringGeometry args={[1.52, radius + 0.4, 64]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, height - 0.02, 0]}>
        <ringGeometry args={[1.5, 1.68, 48]} />
        <meshStandardMaterial
          color="#c5cdd6"
          metalness={0.82}
          roughness={0.22}
          emissive="#f1ece4"
          emissiveIntensity={0.55}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, height + 0.35, 0]}>
        <circleGeometry args={[1.52, 32]} />
        <meshBasicMaterial color="#d9d4cb" />
      </mesh>
    </group>
  );
}

function Monogram({ animated }: { animated: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!animated || !group.current) return;
    const d = Math.min(delta, 0.1);
    group.current.rotation.y += d * 0.1;
  });

  return (
    <group ref={group} position={[0, 0.92, 0]}>
      <mesh position={[0, -0.58, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.7, 0.42, 32]} />
        <meshStandardMaterial color="#161618" metalness={0.5} roughness={0.38} />
      </mesh>
      <mesh position={[0, -0.36, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.5, 0.56, 48]} />
        <meshStandardMaterial
          color="#c5cdd6"
          metalness={0.88}
          roughness={0.22}
          emissive="#c5cdd6"
          emissiveIntensity={0.12}
        />
      </mesh>
      <Text
        font="/fonts/figtree-latin-400-normal.woff"
        fontSize={0.32}
        letterSpacing={0.08}
        anchorX="center"
        anchorY="middle"
        color="#f1ece4"
      >
        S × B
        <meshStandardMaterial
          color="#f1ece4"
          metalness={0.88}
          roughness={0.22}
          side={THREE.DoubleSide}
        />
      </Text>
    </group>
  );
}

function WorkFrame({
  work,
  position,
  rotation,
  active,
  dimmed,
  lit,
  reducedMotion,
  onHover,
  onSelect,
}: {
  work: Work;
  position: [number, number, number];
  rotation: number;
  active: boolean;
  dimmed: boolean;
  lit: boolean;
  reducedMotion: boolean;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}) {
  const tex = useTexture(work.image, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  });
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const press = useRef<{ x: number; y: number } | null>(null);
  const lift = useRef(0);
  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a2826",
        metalness: 0.74,
        roughness: 0.28,
      }),
    [],
  );

  useEffect(() => () => metal.dispose(), [metal]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const d = Math.min(delta, 0.1);
    const goal = hovered || active ? 1 : 0;
    lift.current += (goal - lift.current) * (1 - Math.exp(-10 * d));
    const s = reducedMotion ? 1 : 1 + lift.current * 0.03;
    group.current.scale.setScalar(s);
    metal.color.set(active ? "#c5cdd6" : hovered ? "#5a564e" : "#2a2826");
    metal.emissive.set(active ? "#c5cdd6" : "#000000");
    metal.emissiveIntensity = active ? 0.2 : 0;
  });

  function down(event: ThreeEvent<PointerEvent>) {
    press.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY };
  }

  function click(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    const start = press.current;
    if (start) {
      const dx = event.nativeEvent.clientX - start.x;
      const dy = event.nativeEvent.clientY - start.y;
      if (dx * dx + dy * dy > 36) return;
    }
    onSelect(work.slug);
  }

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotation, 0]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        onHover(work.slug);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = "auto";
      }}
      onPointerDown={down}
      onClick={click}
    >
      <FrameAsset metal={metal} fallback={<ProceduralFrame metal={metal} />} />
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[FRAME_W, FRAME_H]} />
        <meshStandardMaterial
          map={tex}
          roughness={0.7}
          metalness={0.06}
          emissive="#f1ece4"
          emissiveMap={tex}
          emissiveIntensity={hovered || active ? 0.22 : dimmed ? 0.03 : 0.1}
          transparent={dimmed}
          opacity={dimmed ? 0.42 : 1}
        />
      </mesh>
      {lit ? (
        <pointLight
          position={[0, 0.15, 0.55]}
          intensity={active ? 9 : hovered ? 5 : 2.4}
          distance={2.6}
          color="#f1ece4"
        />
      ) : null}
      <mesh position={[0, -FRAME_H / 2 - 0.2, 0.02]}>
        <boxGeometry args={[0.62, 0.09, 0.03]} />
        <meshStandardMaterial color="#1a1a1c" metalness={0.4} roughness={0.45} />
      </mesh>
      <ConceptPlaque active={active} />
    </group>
  );
}

/** Canvas text uses our self-hosted CSS fonts, including Thai and Chinese glyphs. */
function ConceptPlaque({ active }: { active: boolean }) {
  const lang = useLocale();
  const invalidate = useThree((state) => state.invalidate);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 96;
    const context = canvas.getContext("2d");
    if (!context) return;
    const label = { en: "CONCEPT", th: "แนวคิด", zh: "概念" }[lang];
    const family = { en: "Figtree", th: "IBM Plex Sans Thai", zh: "Noto Sans SC Variable" }[lang];
    const font = `500 64px "${family}"`;
    const next = new THREE.CanvasTexture(canvas);
    next.colorSpace = THREE.SRGBColorSpace;
    let disposed = false;
    const draw = () => {
      if (disposed) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = `${font}, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = active ? "#f1ece4" : "#8c8880";
      context.fillText(label, canvas.width / 2, canvas.height / 2, canvas.width - 24);
      next.needsUpdate = true;
      invalidate();
    };
    draw();
    setTexture(next);
    // Request the exact glyph subset; fonts.ready alone may precede the Chinese label.
    void document.fonts
      .load(font, label)
      .then(draw)
      .catch(() => undefined);
    return () => {
      disposed = true;
      next.dispose();
    };
  }, [lang, active, invalidate]);
  return texture ? (
    <mesh position={[0, -FRAME_H / 2 - 0.2, 0.04]}>
      <planeGeometry args={[0.6, 0.1125]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  ) : null;
}

function ProceduralFrame({ metal }: { metal: THREE.MeshStandardMaterial }) {
  const t = 0.055;
  const depth = 0.09;
  const outerW = FRAME_W + 0.16;
  const outerH = FRAME_H + 0.16;
  return (
    <group name="Frame_GeometryFallback">
      <mesh position={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[outerW + 0.04, outerH + 0.04, 0.05]} />
        <meshStandardMaterial color="#101012" metalness={0.35} roughness={0.6} />
      </mesh>
      <mesh position={[0, outerH / 2 - t / 2, 0]} material={metal}>
        <boxGeometry args={[outerW, t, depth]} />
      </mesh>
      <mesh position={[0, -outerH / 2 + t / 2, 0]} material={metal}>
        <boxGeometry args={[outerW, t, depth]} />
      </mesh>
      <mesh position={[-outerW / 2 + t / 2, 0, 0]} material={metal}>
        <boxGeometry args={[t, outerH, depth]} />
      </mesh>
      <mesh position={[outerW / 2 - t / 2, 0, 0]} material={metal}>
        <boxGeometry args={[t, outerH, depth]} />
      </mesh>
    </group>
  );
}
