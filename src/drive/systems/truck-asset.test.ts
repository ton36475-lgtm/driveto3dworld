import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cloneFoodTruck, setTruckHatches } from "./truck-asset.ts";
import { FOOD_TRUCK, TRUCK_HATCHES, TRUCK_LAMPS } from "../data/vehicle.ts";

test("the shipped food truck geometry matches wheel anchors, hatch motion and collision clearance", async () => {
  const bytes = await readFile(new URL("../../../public/models/foodtruck-body.glb", import.meta.url));
  // Node has no image decoder. Preserve actual geometry/transforms while the real-browser
  // truck regression verifies texture decoding and rendered GLB readiness separately.
  const loader = new GLTFLoader();
  loader.register(() => ({ name: "NODE_GEOMETRY_TEXTURE_PLACEHOLDER", loadTexture: () => Promise.resolve(new THREE.Texture()) }));
  const source = await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), "");
  source.scene.updateMatrixWorld(true);
  for (const [kind, expected] of Object.entries(TRUCK_LAMPS)) {
    for (const index of [0, 1]) {
      const lamp = source.scene.getObjectByName(`Lamp_${kind === "front" ? "Front" : "Rear"}_${index}`);
      assert.ok(lamp, `${kind} lamp ${index} exists`);
      const centre = new THREE.Box3().setFromObject(lamp).getCenter(new THREE.Vector3());
      assert.ok(Math.abs(Math.abs(centre.x) - expected.x) < 0.002 && Math.abs(centre.y - expected.y) < 0.002 && Math.abs(centre.z - expected.z) < 0.002, `${kind} runtime lamp aligns with the actual body face`);
    }
  }
  const first = cloneFoodTruck(source.scene);
  const second = cloneFoodTruck(source.scene);
  assert.ok(first.getObjectByName("FoodTruck_Body"));
  assert.notEqual(first.getObjectByName("FoodTruck_Body"), second.getObjectByName("FoodTruck_Body"));
  assert.ok(source.scene.getObjectByName("Lamp_Front_0"), "cached asset keeps its original lamps");
  assert.equal(first.getObjectByName("Lamp_Front_0"), undefined, "runtime owns the cloned truck lights");
  const bounds = new THREE.Box3().setFromObject(first);
  const radius = Math.hypot(Math.max(Math.abs(bounds.min.x), Math.abs(bounds.max.x)), Math.max(Math.abs(bounds.min.z), Math.abs(bounds.max.z)));
  assert.ok(radius < FOOD_TRUCK.collisionRadius);
  assert.ok(bounds.max.y > 2.7 && bounds.max.y < 3.2, "reference truck has a tall over-cab workshop");
  assert.equal(first.getObjectByName(FOOD_TRUCK.rootName)?.userData.asset_contract, "foodtruck-reference-v2");
  assert.equal(source.animations.length, 0, "wheel movement belongs to the driving simulation");
  const inspection = cloneFoodTruck(source.scene, { runtimeLamps: false });
  assert.ok(inspection.getObjectByName("Lamp_Front_0"), "parked inspection retains lamp geometry");
  const closedCenters = TRUCK_HATCHES.map(({ name }) => new THREE.Box3().setFromObject(inspection.getObjectByName(name)!).getCenter(new THREE.Vector3()));
  setTruckHatches(inspection, true);
  for (const [index, { name, direction }] of TRUCK_HATCHES.entries()) {
    const original = source.scene.getObjectByName(name)!;
    const parked = inspection.getObjectByName(name)!;
    const driving = first.getObjectByName(name)!;
    assert.equal(parked.rotation.z, direction * FOOD_TRUCK.hatchAngle);
    const openedCenter = new THREE.Box3().setFromObject(parked).getCenter(new THREE.Vector3());
    assert.ok((openedCenter.x - closedCenters[index].x) * direction > 0.2, "hatch swings outward from the body");
    assert.ok(openedCenter.y > closedCenters[index].y + 0.1, "hatch lifts above the serving window");
    assert.ok(Math.abs(original.rotation.z) < 1e-8 && Math.abs(driving.rotation.z) < 1e-8, "opening the parked truck cannot alter the cache or driving instance");
  }
  setTruckHatches(inspection, false);
  for (const { name } of TRUCK_HATCHES) assert.equal(inspection.getObjectByName(name)?.rotation.z, 0);
});

test("malformed body assets are rejected so the procedural truck remains available", () => {
  assert.throws(() => cloneFoodTruck(new THREE.Group()), /root contract/);
  const broken = new THREE.Group();
  broken.name = FOOD_TRUCK.rootName;
  assert.throws(() => cloneFoodTruck(broken), /missing anchor/);
});
