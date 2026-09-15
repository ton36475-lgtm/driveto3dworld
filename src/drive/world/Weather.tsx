import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sim, zoneAt } from "../systems/sim";
import { useDrive } from "../store";
import { dayState } from "../systems/dayNight";

export function Weather() {
  const rainRef = useRef<THREE.Points>(null);
  const snowRef = useRef<THREE.Points>(null);
  const mode = useDrive((s) => s.weather);

  const rain = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 280;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = (Math.random() - 0.5) * 40;
      a[i * 3 + 1] = Math.random() * 14;
      a[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, []);

  const snow = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 180;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = (Math.random() - 0.5) * 40;
      a[i * 3 + 1] = Math.random() * 12;
      a[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const zone = zoneAt(sim.x, sim.z);
    let rainOn = mode === "rain";
    let snowOn = mode === "snow";
    if (mode === "auto") {
      rainOn = zone === "vehicles" && dayState.night > 0.35;
      snowOn = zone === "characters" && dayState.night > 0.2;
    }
    if (rainRef.current) {
      rainRef.current.visible = rainOn;
      rainRef.current.position.set(sim.x, 0, sim.z);
      if (rainOn) {
        const arr = (rainRef.current.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] -= dt * 14;
          if (arr[i + 1] < 0) arr[i + 1] = 12;
        }
        rainRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
    if (snowRef.current) {
      snowRef.current.visible = snowOn;
      snowRef.current.position.set(sim.x, 0, sim.z);
      if (snowOn) {
        const arr = (snowRef.current.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] -= dt * 2.2;
          arr[i] += Math.sin(arr[i + 1]) * dt * 0.4;
          if (arr[i + 1] < 0) arr[i + 1] = 11;
        }
        snowRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      <points ref={rainRef} geometry={rain} visible={false}>
        <pointsMaterial color="#c8d4de" size={0.08} transparent opacity={0.55} depthWrite={false} />
      </points>
      <points ref={snowRef} geometry={snow} visible={false}>
        <pointsMaterial color="#f3eee6" size={0.14} transparent opacity={0.8} depthWrite={false} />
      </points>
    </group>
  );
}
