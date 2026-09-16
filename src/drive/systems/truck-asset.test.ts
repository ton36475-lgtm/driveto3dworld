import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cloneFoodTruck } from "./truck-asset.ts";
import { FOOD_TRUCK } from "../data/vehicle.ts";

test("the actual shipped food truck loads, matches wheel anchors and fits collision clearance", async () => {
  const bytes = await readFile(new URL("../../../public/models/foodtruck-body.glb", import.meta.url));
  const source = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), "");
  const first = cloneFoodTruck(source.scene);
  const second = cloneFoodTruck(source.scene);
  assert.ok(first.getObjectByName("FoodTruck_Body"));
  assert.notEqual(first.getObjectByName("FoodTruck_Body"), second.getObjectByName("FoodTruck_Body"));
  assert.ok(source.scene.getObjectByName("Lamp_Front_0"), "cached asset keeps its original lamps");
  assert.equal(first.getObjectByName("Lamp_Front_0"), undefined, "runtime owns the cloned truck lights");
  const bounds = new THREE.Box3().setFromObject(first);
  const radius = Math.hypot(Math.max(Math.abs(bounds.min.x), Math.abs(bounds.max.x)), Math.max(Math.abs(bounds.min.z), Math.abs(bounds.max.z)));
  assert.ok(radius < FOOD_TRUCK.collisionRadius);
  assert.ok(bounds.max.y > 2 && bounds.max.y < 2.5);
  assert.equal(source.animations.length, 0, "wheel movement belongs to the driving simulation");
});

test("malformed body assets are rejected so the procedural truck remains available", () => {
  assert.throws(() => cloneFoodTruck(new THREE.Group()), /root contract/);
  const broken = new THREE.Group();
  broken.name = FOOD_TRUCK.rootName;
  assert.throws(() => cloneFoodTruck(broken), /missing anchor/);
});
