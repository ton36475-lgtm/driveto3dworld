import { Lighting, Ground, Trees, Lamps, Stars } from "./Environment";
import { Landmarks } from "./Landmarks";
import { Collectibles } from "./Collectibles";
import { Weather } from "./Weather";
import { Car } from "./Car";
import { useFrame } from "@react-three/fiber";
import { zoneAt, sim } from "../systems/sim";
import { setZoneBed } from "../systems/audio";
import { useDrive } from "../store";

function Systems() {
  const setZone = useDrive((s) => s.setZone);
  const started = useDrive((s) => s.started);
  useFrame(() => {
    if (!started) return;
    const z = zoneAt(sim.x, sim.z);
    setZone(z);
    setZoneBed(z);
  });
  return null;
}

export function Experience() {
  return (
    <>
      <Lighting />
      <Stars />
      <Ground />
      <Trees />
      <Lamps />
      <Landmarks />
      <Collectibles />
      <Weather />
      <Car />
      <Systems />
    </>
  );
}
