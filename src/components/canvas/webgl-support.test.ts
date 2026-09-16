import assert from "node:assert/strict";
import { test } from "node:test";
import { supportsWebGL2 } from "./webgl-support.ts";

test("unavailable and throwing WebGL2 contexts are rejected before a renderer mounts", () => {
  for (const getContext of [() => null, () => { throw new Error("WebGL disabled"); }]) {
    const canvas = { width: 300, height: 150, getContext };
    assert.equal(supportsWebGL2(() => canvas), false);
    assert.equal(canvas.width, 0);
    assert.equal(canvas.height, 0);
  }
});

test("a successful probe requests WebGL2 and releases its GPU context", () => {
  let released = 0;
  const canvas = {
    width: 300,
    height: 150,
    getContext(type: string) {
      assert.equal(type, "webgl2");
      assert.equal(this.width, 1);
      assert.equal(this.height, 1);
      return { isContextLost: () => false, getExtension: () => ({ loseContext: () => { released++; } }) };
    },
  };
  assert.equal(supportsWebGL2(() => canvas), true);
  assert.equal(released, 1);
  assert.equal(canvas.width, 0);
  assert.equal(canvas.height, 0);
});

test("an already-lost context is not treated as supported", () => {
  const canvas = { width: 1, height: 1, getContext: () => ({ isContextLost: () => true, getExtension: () => null }) };
  assert.equal(supportsWebGL2(() => canvas), false);
});
