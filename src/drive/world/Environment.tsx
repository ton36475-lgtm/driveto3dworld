import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ZONES } from "../data/projects";
import { dayState, stepDayNight } from "../systems/dayNight";
import { perfState } from "../systems/sim";
import { useDrive } from "../store";

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scatter(count: number, seed: number, avoid: { x: number; z: number; r: number }[]) {
  const rnd = mulberry32(seed);
  const out: { x: number; y: number; z: number; s: number; r: number }[] = [];
  let guard = 0;
  while (out.length < count && guard < count * 20) {
    guard++;
    const x = (rnd() * 2 - 1) * 92;
    const z = (rnd() * 2 - 1) * 92;
    if (Math.abs(x) < 9 || Math.abs(z) < 9) continue;
    if (Math.hypot(x, z) < 16) continue;
    if (avoid.some((a) => Math.hypot(x - a.x, z - a.z) < a.r)) continue;
    out.push({ x, y: 0, z, s: 0.75 + rnd() * 0.7, r: rnd() * Math.PI * 2 });
  }
  return out;
}

function makeGroundTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1a211c";
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.fillStyle = "#161c18";
  for (let i = 0; i < 1400; i++) {
    ctx.globalAlpha = 0.15;
    ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 4 + Math.random() * 10, 3);
  }
  ctx.globalAlpha = 1;
  const to = (n: number) => ((n + 100) / 200) * 1024;
  ctx.fillStyle = "#2a2e34";
  ctx.fillRect(to(-8), 0, to(8) - to(-8), 1024);
  ctx.fillRect(0, to(-8), 1024, to(8) - to(-8));
  ctx.beginPath();
  ctx.arc(512, 512, ((16) / 200) * 1024, 0, Math.PI * 2);
  ctx.fillStyle = "#32363d";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(512, 512, ((11) / 200) * 1024, 0, Math.PI * 2);
  ctx.fillStyle = "#1e2420";
  ctx.fill();
  for (const z of ZONES) {
    const s = ((z.size / 2) / 100) * 512;
    ctx.fillStyle = z.pad;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(to(z.x) - s, to(z.z) - s, s * 2, s * 2);
  }
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#f3eee6";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 20; i++) {
    const p = (i / 20) * 1024;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(1024, p);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function Lighting() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const { scene, gl } = useThree();
  const setFps = useDrive((s) => s.setFps);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    stepDayNight(dt);
    const d = dayState;
    scene.background = d.sky;
    scene.fog = scene.fog ?? new THREE.Fog(d.fog, 40, 150);
    (scene.fog as THREE.Fog).color.copy(d.fog);
    (scene.fog as THREE.Fog).near = 28 + d.night * 10;
    (scene.fog as THREE.Fog).far = 140 - d.night * 20;
    if (sun.current) {
      sun.current.position.set(d.sunX, Math.max(6, d.sunY), d.sunZ);
      sun.current.intensity = d.sunI;
    }
    if (hemi.current) hemi.current.intensity = d.ambI;

    const now = performance.now();
    if (!perfState.last) perfState.last = now;
    perfState.frames++;
    if (now - perfState.last >= 1000) {
      perfState.fps = perfState.frames;
      perfState.frames = 0;
      perfState.last = now;
      setFps(perfState.fps);
      const next = perfState.fps < 32 ? 1 : Math.min(window.devicePixelRatio || 1, 1.6);
      if (Math.abs(next - perfState.dpr) > 0.05) {
        perfState.dpr = next;
        gl.setPixelRatio(next);
      }
      perfState.shadows = perfState.fps >= 28;
      sun.current!.castShadow = perfState.shadows;
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#d8e4ee", "#2a241c", 0.4]} />
      <directionalLight
        ref={sun}
        castShadow
        intensity={1.2}
        position={[40, 55, 18]}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={180}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <ambientLight intensity={0.08} />
    </>
  );
}

export function Ground() {
  const tex = useMemo(() => makeGroundTexture(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 1, 1]} />
      <meshStandardMaterial map={tex} roughness={0.92} metalness={0.04} />
    </mesh>
  );
}

export function Trees() {
  const pts = useMemo(
    () => scatter(70, 42, ZONES.map((z) => ({ x: z.x, z: z.z, r: 22 }))),
    [],
  );
  const canopy = useRef<THREE.InstancedMesh>(null);
  const trunk = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    pts.forEach((t, i) => {
      q.setFromEuler(new THREE.Euler(0, t.r, 0));
      p.set(t.x, 1.7 * t.s, t.z);
      s.set(t.s, t.s, t.s);
      m.compose(p, q, s);
      canopy.current?.setMatrixAt(i, m);
      p.set(t.x, 0.55 * t.s, t.z);
      s.set(t.s * 0.28, t.s, t.s * 0.28);
      m.compose(p, q, s);
      trunk.current?.setMatrixAt(i, m);
    });
    if (canopy.current) canopy.current.instanceMatrix.needsUpdate = true;
    if (trunk.current) trunk.current.instanceMatrix.needsUpdate = true;
  }, [pts]);

  return (
    <group>
      <instancedMesh ref={trunk} args={[undefined, undefined, pts.length]} castShadow>
        <cylinderGeometry args={[0.18, 0.26, 1.2, 5]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={canopy} args={[undefined, undefined, pts.length]} castShadow>
        <coneGeometry args={[1.35, 2.6, 6]} />
        <meshStandardMaterial color="#24382c" roughness={0.85} />
      </instancedMesh>
    </group>
  );
}

export function Lamps() {
  const spots = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = -70; i <= 70; i += 20) {
      if (Math.abs(i) < 14) continue;
      list.push([8.5, i], [-8.5, i], [i, 8.5], [i, -8.5]);
    }
    return list;
  }, []);
  const glow = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    const n = 0.15 + dayState.night * 2.4;
    for (const m of glow.current) {
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = n;
    }
  });

  return (
    <group>
      {spots.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 2.8, 6]} />
            <meshStandardMaterial color="#2a2d33" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh
            position={[0, 2.9, 0]}
            ref={(el) => {
              if (el) glow.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial color="#f3eee6" emissive="#f3eee6" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Stars() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 220;
    const a = new Float32Array(n * 3);
    const rnd = mulberry32(9);
    for (let i = 0; i < n; i++) {
      const u = rnd() * Math.PI * 2;
      const v = rnd() * 0.45 + 0.12;
      a[i * 3] = Math.cos(u) * Math.cos(v) * 120;
      a[i * 3 + 1] = Math.sin(v) * 80 + 18;
      a[i * 3 + 2] = Math.sin(u) * Math.cos(v) * 120;
    }
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, []);

  useFrame(() => {
    if (ref.current) {
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.clamp(dayState.night * 1.2 - 0.15, 0, 0.9);
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#f3eee6" size={0.35} transparent opacity={0} depthWrite={false} />
    </points>
  );
}
