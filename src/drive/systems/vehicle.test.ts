import assert from "node:assert/strict";
import { test } from "node:test";
import { FOOD_TRUCK, TRUCK_WHEELS } from "../data/vehicle.ts";
import { PROJECTS } from "../data/projects.ts";
import { advanceSimulation, COLLIDERS, sim, teleport } from "./sim.ts";

test("truck wheels meet the body contract and stand above the ground", () => {
  assert.equal(TRUCK_WHEELS.length, 4);
  assert.ok(FOOD_TRUCK.frontAxleZ < 0 && FOOD_TRUCK.rearAxleZ > 0);
  assert.ok(FOOD_TRUCK.rideHeight >= FOOD_TRUCK.wheelRadius);
  for (const [x, y, z] of TRUCK_WHEELS) {
    assert.ok(Math.abs(x) + 0.11 <= FOOD_TRUCK.bodyWidth / 2 + 0.05, "tire stays inside the body and fender envelope");
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

test("the longer truck can traverse main roads and reach every collectible", () => {
  // The road is wider than the truck's full turning envelope. No landmark overlaps this approach.
  assert.ok(FOOD_TRUCK.collisionRadius * 2 < 8);
  teleport(0, 70, 0);
  for (let frame = 0; frame < 240; frame++) advanceSimulation({ steer: 0, throttle: 1, brake: 0 }, 1 / 60);
  assert.ok(sim.z < 25 && sim.z > 10);
  assert.ok(Math.abs(sim.x) < 0.001);
  for (const project of PROJECTS) {
    teleport(project.x, project.z, 0);
    assert.ok(Math.hypot(sim.x - project.x, sim.z - project.z) < 3.2, `${project.id} remains reachable inside its collection radius`);
  }
});
