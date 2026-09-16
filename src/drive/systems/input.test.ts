import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { attachInput, readAxes, resetInput, setInputLocked, setTouch, setTouchBrake } from "./input.ts";

const fakeWindow = new EventTarget();
const fakeDocument = new EventTarget();
Object.defineProperty(globalThis, "window", { value: fakeWindow, configurable: true });
Object.defineProperty(globalThis, "document", { value: fakeDocument, configurable: true });
const detach = attachInput();

function key(code: string, down = true, modifiers: Record<string, boolean> = {}) {
  const event = Object.assign(new Event(down ? "keydown" : "keyup", { cancelable: true }), { code, ...modifiers });
  fakeWindow.dispatchEvent(event);
  return event;
}

beforeEach(() => { resetInput(); setInputLocked(false); });
after(() => { detach(); Reflect.deleteProperty(globalThis, "window"); Reflect.deleteProperty(globalThis, "document"); });

test("A and D map to opposite steering with correct signs", () => {
  key("KeyA");
  assert.equal(readAxes().steer, 1);
  key("KeyA", false);
  key("KeyD");
  assert.equal(readAxes().steer, -1);
});

test("blur and hidden tabs clear keyboard, touch and brake together", () => {
  for (const [target, event] of [[fakeWindow, "blur"], [fakeDocument, "visibilitychange"]] as const) {
    key("KeyW");
    setTouch(0.5, 1, true);
    setTouchBrake(true);
    target.dispatchEvent(new Event(event));
    assert.deepEqual(readAxes(), { steer: 0, throttle: 0, brake: 0 });
  }
});

test("locked controls and browser shortcuts never create stale movement", () => {
  setInputLocked(true);
  assert.equal(key("ArrowUp").defaultPrevented, false);
  setTouch(1, 1, true);
  setInputLocked(false);
  assert.deepEqual(readAxes(), { steer: 0, throttle: 0, brake: 0 });
  key("KeyW", true, { ctrlKey: true });
  key("KeyD", true, { metaKey: true });
  assert.deepEqual(readAxes(), { steer: 0, throttle: 0, brake: 0 });
  assert.equal(key("ArrowUp").defaultPrevented, true);
});
