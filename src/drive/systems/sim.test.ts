import assert from "node:assert/strict";
import { test } from "node:test";
import { advanceSimulation, BOUNDS, COLLIDERS, sim, teleport, zoneAt } from "./sim.ts";
import { dayState, setDayTime, stepDayNight } from "./dayNight.ts";

test("positive steering turns left and negative steering turns right under the chase camera", () => {
  for (const steer of [1, -1]) {
    teleport(0, 60, 0);
    for (let frame = 0; frame < 30; frame++) advanceSimulation({ steer, throttle: 1, brake: 0 }, 1 / 60);
    assert.ok(steer * sim.yaw > 0);
    assert.ok(steer * sim.x < 0);
    assert.ok(sim.z < 60);
  }
});

test("world boundaries, collider center and invalid teleport never corrupt the simulation", () => {
  teleport(1e6, -1e6, 0);
  assert.equal(sim.x, BOUNDS);
  assert.equal(sim.z, -BOUNDS);
  for (let frame = 0; frame < 240; frame++) advanceSimulation({ steer: 0, throttle: 1, brake: 0 }, 1 / 60);
  assert.ok(Math.abs(sim.x) <= BOUNDS && Math.abs(sim.z) <= BOUNDS);
  for (const collider of COLLIDERS) {
    teleport(collider.x, collider.z, 0);
    assert.ok(Math.hypot(sim.x - collider.x, sim.z - collider.z) >= collider.r - 1e-9);
  }
  const before = { ...sim };
  teleport(NaN, Infinity, NaN);
  advanceSimulation({ steer: 1, throttle: 1, brake: 0 }, NaN);
  assert.deepEqual(sim, before);
});

test("braking reduces speed and extreme frame/input values stay finite", () => {
  teleport(0, 70, 0);
  for (let frame = 0; frame < 45; frame++) advanceSimulation({ steer: 0, throttle: 1, brake: 0 }, 1 / 60);
  const speed = sim.speed;
  for (let frame = 0; frame < 20; frame++) advanceSimulation({ steer: 0, throttle: 1, brake: 1 }, 1 / 60);
  assert.ok(sim.speed < speed);
  advanceSimulation({ steer: NaN, throttle: Infinity, brake: 0 }, 1000);
  assert.ok(Object.values(sim).every(Number.isFinite));
  assert.equal(zoneAt(-42, -42), "architecture");
  assert.equal(zoneAt(0, 0), null);
});

test("daylight keeps valid colors and ignores invalid time", () => {
  setDayTime(0.23);
  const earlyDawn = dayState.sky.clone();
  setDayTime(0.27);
  assert.ok(Math.abs(earlyDawn.b - dayState.sky.b) > 0.1, "dawn must blend progressively into daylight");
  setDayTime(0.25);
  const dawn = dayState.sky.clone();
  setDayTime(0.251);
  assert.ok(Math.abs(dawn.r - dayState.sky.r) < 0.03);
  const valid = dayState.time;
  setDayTime(NaN);
  stepDayNight(Infinity);
  assert.equal(dayState.time, valid);
  assert.ok([dayState.sky.r, dayState.sky.g, dayState.sky.b].every(Number.isFinite));
});
