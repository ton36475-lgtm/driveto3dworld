import assert from "node:assert/strict";
import { test } from "node:test";
import { FOOD_TRUCK, TRUCK_WHEELS } from "../data/vehicle.ts";
import { COLLIDERS, sim, teleport } from "./sim.ts";

test("truck wheels meet the body contract and stand above the ground", () => {
  assert.equal(TRUCK_WHEELS.length, 4);
  assert.ok(FOOD_TRUCK.frontAxleZ < 0 && FOOD_TRUCK.rearAxleZ > 0);
  assert.ok(FOOD_TRUCK.rideHeight >= FOOD_TRUCK.wheelRadius);
  for (const [x, y, z] of TRUCK_WHEELS) {
    assert.equal(Math.abs(x), FOOD_TRUCK.bodyWidth / 2);
    assert.equal(y, 0);
    assert.ok(Math.abs(z) + FOOD_TRUCK.wheelRadius < FOOD_TRUCK.bodyLength / 2);
  }
  assert.ok(FOOD_TRUCK.collisionRadius > Math.hypot(FOOD_TRUCK.bodyWidth / 2, FOOD_TRUCK.bodyLength / 2));
});

test("landmark collision envelopes include clearance for the wider food truck", () => {
  for (const obstacle of COLLIDERS) {
    assert.ok(obstacle.r > FOOD_TRUCK.collisionRadius);
    teleport(obstacle.x, obstacle.z, 0);
    assert.ok(Math.hypot(sim.x - obstacle.x, sim.z - obstacle.z) >= obstacle.r - 1e-8);
  }
});
