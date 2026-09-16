import * as THREE from "three";
import { FOOD_TRUCK, TRUCK_HATCHES, TRUCK_WHEELS } from "../data/vehicle.ts";

/** Cached geometry/materials stay immutable; only the per-instance hierarchy changes. */
export function cloneFoodTruck(source: THREE.Group, { runtimeLamps = true }: { runtimeLamps?: boolean } = {}) {
  const truck = source.clone(true);
  if (!truck.getObjectByName(FOOD_TRUCK.rootName)) throw new Error("Food truck root contract mismatch");
  truck.updateMatrixWorld(true);
  for (const [index, name] of ["WheelAnchor_FL", "WheelAnchor_FR", "WheelAnchor_RL", "WheelAnchor_RR"].entries()) {
    const anchor = truck.getObjectByName(name);
    if (!anchor) throw new Error(`Food truck missing anchor: ${name}`);
    const position = anchor.getWorldPosition(new THREE.Vector3());
    if (position.distanceTo(new THREE.Vector3(...TRUCK_WHEELS[index])) > 0.001) throw new Error(`Food truck axle alignment mismatch: ${name}`);
  }
  for (const { name, position } of TRUCK_HATCHES) {
    const hatch = truck.getObjectByName(name);
    if (!hatch) throw new Error(`Food truck missing hatch: ${name}`);
    if (hatch.getWorldPosition(new THREE.Vector3()).distanceTo(new THREE.Vector3(...position)) > 0.001) throw new Error(`Food truck hatch alignment mismatch: ${name}`);
  }
  // The drive simulation supplies changing day/night lamps; the showroom retains the GLB faces.
  if (runtimeLamps) for (const name of ["Lamp_Front_0", "Lamp_Front_1", "Lamp_Rear_0", "Lamp_Rear_1"]) truck.getObjectByName(name)?.removeFromParent();
  truck.traverse((object) => {
    if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
  });
  return truck;
}

/** Hinges have independent local transforms; shared source meshes and materials stay untouched. */
export function setTruckHatches(truck: THREE.Group, open: boolean) {
  for (const { name, direction } of TRUCK_HATCHES) {
    const hatch = truck.getObjectByName(name);
    if (!hatch) throw new Error(`Food truck missing hatch: ${name}`);
    hatch.rotation.z = open ? direction * FOOD_TRUCK.hatchAngle : 0;
  }
  truck.updateMatrixWorld(true);
}
