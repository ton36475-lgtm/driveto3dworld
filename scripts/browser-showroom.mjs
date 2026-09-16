#!/usr/bin/env node
/** CI-only showroom regression. Pixel differences are functional evidence, not a likeness score. */
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.GITHUB_ACTIONS !== "true" || process.env.CI !== "true") {
  console.error("browser-showroom runs only in GitHub Actions (GITHUB_ACTIONS=true and CI=true).");
  process.exit(1);
}
const supplied = new URL(process.argv[2] ?? "http://127.0.0.1:8081");
assert.ok(["http:", "https:"].includes(supplied.protocol));
assert.ok(
  ["localhost", "127.0.0.1", "[::1]"].includes(supplied.hostname),
  "Origin must be loopback",
);
assert.equal(supplied.pathname, "/");
assert.equal(supplied.username + supplied.password + supplied.search + supplied.hash, "");
const origin = supplied.origin;
const output = fileURLToPath(new URL("../screenshots/", import.meta.url));
const verdict = join(output, "showroom-verdict.json");
const assetPath = "/models/foodtruck-body.glb";
await mkdir(output, { recursive: true });
const report = {
  startedAt: new Date().toISOString(),
  origin,
  ok: false,
  scope:
    "Functional reference-model/showroom checks. Screenshots require visual review; no dimensional accuracy, physical operation, or measured digital-twin certification.",
  scenarios: [],
};
let browser;
let deadline;
const save = () => writeFile(verdict, `${JSON.stringify(report, null, 2)}\n`);

function installProbe(unavailable) {
  const state = { attempts: 0, contexts: 0, draws: 0 };
  window.__showroomCI = state;
  const original = HTMLCanvasElement.prototype.getContext;
  const patched = new WeakSet();
  HTMLCanvasElement.prototype.getContext = function (type, ...options) {
    const webgl = ["webgl", "webgl2", "experimental-webgl"].includes(type);
    if (webgl) {
      state.attempts++;
      if (unavailable) return null;
    }
    const context = original.call(this, type, ...options);
    if (webgl && context && !patched.has(context)) {
      patched.add(context);
      state.contexts++;
      for (const name of [
        "drawArrays",
        "drawElements",
        "drawArraysInstanced",
        "drawElementsInstanced",
      ]) {
        if (typeof context[name] !== "function") continue;
        const draw = context[name];
        context[name] = function (...args) {
          state.draws++;
          return draw.apply(this, args);
        };
      }
    }
    return context;
  };
}

async function pixelDifference(page, before, after) {
  return page.evaluate(
    async ({ first, second }) => {
      async function pixels(encoded) {
        const img = new Image();
        img.src = `data:image/png;base64,${encoded}`;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("Screenshot pixel decoder unavailable");
        context.drawImage(img, 0, 0);
        return {
          width: canvas.width,
          height: canvas.height,
          data: context.getImageData(0, 0, canvas.width, canvas.height).data,
        };
      }
      const a = await pixels(first),
        b = await pixels(second);
      if (a.width !== b.width || a.height !== b.height)
        throw new Error("Compared viewport images must have equal dimensions");
      let changed = 0,
        absolute = 0;
      for (let i = 0; i < a.data.length; i += 4) {
        const r = Math.abs(a.data[i] - b.data[i]);
        const g = Math.abs(a.data[i + 1] - b.data[i + 1]);
        const blue = Math.abs(a.data[i + 2] - b.data[i + 2]);
        if (Math.max(r, g, blue) > 12) changed++;
        absolute += r + g + blue;
      }
      const count = a.width * a.height;
      return {
        width: a.width,
        height: a.height,
        changedPixels: changed,
        changedRatio: changed / count,
        meanChannelDifference: absolute / (count * 3),
      };
    },
    { first: before.toString("base64"), second: after.toString("base64") },
  );
}

async function frameFence(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function scenario(name, options, check) {
  const result = {
    name,
    status: "FAIL",
    viewport: options.viewport ?? { width: 1440, height: 1000 },
    checks: [],
    errors: [],
    expectedErrors: [],
    assetResponses: [],
    screenshots: [],
  };
  report.scenarios.push(result);
  const context = await browser.newContext({
    viewport: result.viewport,
    reducedMotion: "reduce",
    locale: "en-GB",
  });
  await context.addInitScript(installProbe, options.unavailable === true);
  if (options.assetFailure) await context.route(`**${assetPath}`, (route) => route.abort("failed"));
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  let recording = true;
  function error(kind, message, url = "") {
    if (!recording) return;
    const entry = { kind, message: String(message).slice(0, 3000), url };
    const expected =
      options.assetFailure &&
      ((url === origin + assetPath &&
        (kind === "request" || /^Failed to load resource: net::ERR_FAILED$/.test(entry.message))) ||
        (entry.message.includes(`Could not load ${assetPath}:`) &&
          /Failed to fetch|ERR_FAILED/.test(entry.message)));
    (expected ? result.expectedErrors : result.errors).push(entry);
  }
  page.on("pageerror", (event) => error("pageerror", event.message));
  page.on("console", (event) => {
    if (event.type() === "error") error("console", event.text(), event.location().url ?? "");
  });
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText ?? "request failed";
    if (request.url().startsWith(origin + "/") && reason !== "net::ERR_ABORTED")
      error("request", reason, request.url());
  });
  page.on("response", (response) => {
    if (response.url() === origin + assetPath) result.assetResponses.push(response.status());
    if (response.url().startsWith(origin + "/") && response.status() >= 400)
      error("http", response.status(), response.url());
  });
  async function capture(locator, label) {
    const filename = `showroom-${name}-${label}.png`;
    const bytes = await locator.screenshot({
      path: join(output, filename),
      caret: "initial",
      timeout: 10_000,
    });
    result.screenshots.push(filename);
    return bytes;
  }
  try {
    const response = await page.goto(origin + "/foodtruck", {
      waitUntil: "domcontentloaded",
      timeout: 25_000,
    });
    assert.equal(response?.status(), 200);
    await page.locator('html[data-app-ready="true"]').waitFor();
    const stage = page.getByTestId("truck-showroom");
    await stage.scrollIntoViewIfNeeded();
    await check(page, stage, result, capture);
    assert.deepEqual(result.errors, [], "Unexpected showroom/browser errors");
    result.status = "PASS";
  } catch (failure) {
    result.failure = String(failure?.stack ?? failure).slice(0, 6000);
    await capture(page.locator("body"), "failure").catch(() => {});
  } finally {
    if (result.errors.length) result.status = "FAIL";
    recording = false;
    await context.close();
    await save();
  }
}

async function liveShowroom(name, assetFailure) {
  await scenario(name, { assetFailure }, async (page, stage, result, capture) => {
    const expectedAsset = assetFailure ? "fallback" : "glb";
    await page
      .locator(
        `[data-testid="truck-showroom"][data-scene-state="ready"][data-asset-state="${expectedAsset}"]`,
      )
      .waitFor({ timeout: 30_000 });
    if (assetFailure)
      assert.ok(
        result.expectedErrors.some(
          (entry) => entry.kind === "request" && entry.url === origin + assetPath,
        ),
      );
    else assert.ok(result.assetResponses.includes(200), "Reference GLB must actually respond 200");
    assert.equal(await stage.getAttribute("data-view"), "exterior");
    const canvas = stage.locator("canvas");
    await canvas.waitFor();
    await frameFence(page);
    const exterior = await capture(canvas, "exterior-closed");
    const hatch = page.getByTestId("truck-hatch");
    assert.equal(await hatch.isEnabled(), true);
    assert.equal(await hatch.getAttribute("aria-pressed"), "false");

    async function redraw(action) {
      const previous = await page.evaluate(() => window.__showroomCI.draws);
      await action();
      await page.waitForFunction((count) => window.__showroomCI.draws > count, previous);
      await frameFence(page);
    }
    await redraw(() => hatch.click());
    assert.equal(await hatch.getAttribute("aria-pressed"), "true");
    const opened = await capture(canvas, "exterior-open");
    result.hatchDifference = await pixelDifference(page, exterior, opened);
    assert.ok(
      result.hatchDifference.changedRatio > 0.001,
      "Opening the hatch must change actual rendered truck pixels",
    );
    await redraw(() => hatch.click());
    assert.equal(await hatch.getAttribute("aria-pressed"), "false");
    const closedAgain = await capture(canvas, "exterior-closed-again");
    result.closedDifference = await pixelDifference(page, exterior, closedAgain);
    assert.ok(
      result.closedDifference.changedRatio < 0.02,
      "Closing the hatch must restore the original exterior",
    );

    const views = { exterior };
    result.viewDifferences = [];
    for (const view of ["kitchen", "rear"]) {
      await redraw(() => page.getByTestId(`truck-view-${view}`).click());
      assert.equal(await stage.getAttribute("data-view"), view);
      assert.equal(
        await page.getByTestId(`truck-view-${view}`).getAttribute("aria-pressed"),
        "true",
      );
      assert.equal(await hatch.getAttribute("aria-pressed"), "true");
      views[view] = await capture(canvas, view);
      const difference = await pixelDifference(page, exterior, views[view]);
      assert.ok(
        difference.changedRatio > 0.05,
        `${view} must show different rendered scene pixels, not only change its button label`,
      );
      result.viewDifferences.push({ view, ...difference });
    }
    const interiorDifference = await pixelDifference(page, views.kitchen, views.rear);
    assert.ok(
      interiorDifference.changedRatio > 0.05,
      "Kitchen and rear cameras must render distinct interior views",
    );
    result.viewDifferences.push({ view: "kitchen-vs-rear", ...interiorDifference });
    await redraw(() => page.getByTestId("truck-view-reset").click());
    assert.equal(await stage.getAttribute("data-view"), "exterior");
    assert.equal(
      await page.getByTestId("truck-view-exterior").getAttribute("aria-pressed"),
      "true",
    );
    const reset = await capture(canvas, "reset-exterior");
    result.resetDifference = await pixelDifference(page, opened, reset);
    assert.ok(
      result.resetDifference.changedRatio < 0.02,
      "Reset view must return the original exterior camera while retaining the hatch setting",
    );
    const bounds = await canvas.boundingBox();
    assert.ok(bounds, "Exterior canvas must be reachable for pointer interaction");
    const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
    await redraw(async () => {
      await page.mouse.move(center.x, center.y);
      await page.mouse.down();
      await page.mouse.move(center.x + 120, center.y - 30, { steps: 8 });
      await page.mouse.up();
    });
    const orbited = await capture(canvas, "orbited");
    result.orbitDifference = await pixelDifference(page, reset, orbited);
    assert.ok(
      result.orbitDifference.changedRatio > 0.02,
      "A real pointer drag must orbit the exterior scene",
    );
    await redraw(async () => {
      await page.mouse.move(center.x, center.y);
      await page.mouse.wheel(0, -500);
    });
    const zoomed = await capture(canvas, "zoomed");
    result.zoomDifference = await pixelDifference(page, orbited, zoomed);
    assert.ok(
      result.zoomDifference.changedRatio > 0.002,
      "A real wheel event must zoom the exterior scene",
    );
    await redraw(() => page.getByTestId("truck-view-reset").click());
    const resetAfterOrbit = await capture(canvas, "reset-after-orbit");
    result.orbitResetDifference = await pixelDifference(page, opened, resetAfterOrbit);
    assert.ok(
      result.orbitResetDifference.changedRatio < 0.02,
      "Reset must also restore the camera after manual orbit and zoom",
    );
    assert.equal(
      await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
      true,
    );
    const draws = await page.evaluate(() => window.__showroomCI.draws);
    await page.waitForTimeout(350);
    assert.equal(
      await page.evaluate(() => window.__showroomCI.draws),
      draws,
      "Parked showroom must stop drawing while idle",
    );
    result.checks.push(
      "Actual model/procedural fallback renders; camera, hatch, real pointer orbit and wheel zoom change canvas pixels; reset restores the exterior camera; reduced-motion idle rendering stops",
    );
  });
}

async function staticShowroom(width, height) {
  await scenario(
    `no-webgl-${width}`,
    { unavailable: true, viewport: { width, height } },
    async (page, stage, result, capture) => {
      await page.locator('[data-testid="truck-showroom"][data-scene-state="fallback"]').waitFor();
      assert.equal(await page.evaluate(() => window.__showroomCI.contexts), 0);
      assert.ok(await page.evaluate(() => window.__showroomCI.attempts > 0));
      assert.equal(await stage.locator("canvas").count(), 0);
      assert.equal(await page.getByTestId("truck-hatch").isDisabled(), true);
      const images = {},
        sources = [];
      for (const view of ["exterior", "kitchen", "rear"]) {
        await page.getByTestId(`truck-view-${view}`).click();
        assert.equal(await stage.getAttribute("data-view"), view);
        const img = stage.getByRole("img");
        await img.waitFor();
        await img.evaluate(async (element) => {
          await element.decode();
          if (!element.naturalWidth) throw new Error("Missing Blender render");
        });
        const source = await img.getAttribute("src");
        assert.ok(source?.startsWith("/images/"), "Fallback must use a shipped render");
        sources.push(source);
        assert.doesNotMatch(
          await stage.innerText(),
          /Loading the reference model|Drag to orbit|scroll or pinch to zoom/,
          "Unavailable 3D must not imply loading or interactive controls",
        );
        images[view] = await capture(img, view);
        const dimensions = await page.evaluate(() => ({
          content: document.documentElement.scrollWidth,
          viewport: document.documentElement.clientWidth,
        }));
        assert.ok(
          dimensions.content <= dimensions.viewport + 1,
          `No horizontal overflow at ${width}px`,
        );
        for (const id of [
          "truck-view-exterior",
          "truck-view-kitchen",
          "truck-view-rear",
          "truck-view-reset",
        ]) {
          const bounds = await page.getByTestId(id).boundingBox();
          assert.ok(
            bounds && bounds.x >= -1 && bounds.x + bounds.width <= width + 1,
            `${id} must remain reachable at ${width}px`,
          );
        }
      }
      assert.equal(
        new Set(sources).size,
        3,
        "Exterior, kitchen, and rear need three distinct Blender renders",
      );
      result.renderSources = sources;
      result.imageDifferences = [];
      for (const [a, b] of [
        ["exterior", "kitchen"],
        ["kitchen", "rear"],
      ]) {
        const difference = await pixelDifference(page, images[a], images[b]);
        assert.ok(
          difference.changedRatio > 0.05,
          "Fallback views must contain different actual image pixels",
        );
        result.imageDifferences.push({ views: [a, b], ...difference });
      }
      await page.getByTestId("truck-view-reset").click();
      assert.equal(await stage.getAttribute("data-view"), "exterior");
      await page.locator('[data-testid="truck-save"]:enabled').scrollIntoViewIfNeeded();
      assert.equal(await page.getByTestId("truck-name").isEnabled(), true);
      result.checks.push(
        "Forced WebGL unavailability retains three distinct loaded Blender renders, honest metadata, responsive view controls, and reachable planner at this width",
      );
    },
  );
}

try {
  const { chromium } = await import("playwright");
  browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    timeout: 30_000,
  });
  await Promise.race([
    (async () => {
      await liveShowroom("reference-model", false);
      await liveShowroom("asset-fallback", true);
      for (const [width, height] of [
        [360, 800],
        [390, 844],
        [768, 1024],
        [1440, 1000],
      ])
        await staticShowroom(width, height);
    })(),
    new Promise((_, reject) => {
      deadline = setTimeout(
        () => reject(new Error("Showroom suite exceeded 240 seconds")),
        240_000,
      );
    }),
  ]);
  report.ok = report.scenarios.every((entry) => entry.status === "PASS");
} catch (failure) {
  report.error = String(failure?.stack ?? failure).slice(0, 6000);
} finally {
  clearTimeout(deadline);
  await browser?.close();
  report.finishedAt = new Date().toISOString();
  await save();
}
console.log(
  JSON.stringify(
    {
      ok: report.ok,
      verdict,
      scenarios: report.scenarios.map(({ name, status, failure }) => ({ name, status, failure })),
    },
    null,
    2,
  ),
);
if (!report.ok) process.exitCode = 1;
