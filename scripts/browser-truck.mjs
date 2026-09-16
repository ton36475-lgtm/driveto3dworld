#!/usr/bin/env node
/** CI-only functional checks for the photo-reference food truck and its asset fallback. */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkedUrl } from "./browser-guard.mjs";

if (process.env.GITHUB_ACTIONS !== "true") {
  console.error("browser-truck is CI-only; run the GitHub Actions workflow.");
  process.exit(1);
}
const supplied = new URL(checkedUrl(process.argv[2] ?? "http://127.0.0.1:8080"));
assert.equal(supplied.pathname, "/");
assert.ok(!supplied.search && !supplied.hash && !supplied.username && !supplied.password);
const origin = supplied.origin;
const output = join(dirname(dirname(fileURLToPath(import.meta.url))), "screenshots");
mkdirSync(output, { recursive: true });
const verdict = join(output, "truck-verdict.json");
const report = { startedAt: new Date().toISOString(), origin, ok: false, scope: "Digital food-truck functional regression; screenshots are not a visual or real-vehicle certification", scenarios: [] };
let browser;
const save = () => writeFileSync(verdict, JSON.stringify(report, null, 2) + "\n");
const deadline = setTimeout(() => {
  report.error = "Truck browser suite exceeded 120 seconds";
  report.finishedAt = new Date().toISOString();
  save();
  process.exit(1);
}, 120_000);
const assetPath = "/models/foodtruck-body.glb";

async function scenario(name, forceFallback, check) {
  const result = { name, status: "FAIL", checks: [], errors: [], expectedErrors: [], warnings: [], assetResponses: [] };
  report.scenarios.push(result);
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", locale: "en-US" });
  await context.addInitScript(() => {
    localStorage.setItem("sxb-lang", JSON.stringify({ state: { lang: "en" }, version: 0 }));
    localStorage.removeItem("atelier-drive-v2");
    localStorage.removeItem("atelier-drive-v1");
  });
  if (forceFallback) await context.route(`**${assetPath}`, (route) => route.abort("failed"));
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  let recording = true;
  const addError = (kind, message, url = "") => {
    if (!recording) return;
    const entry = { kind, message: String(message).slice(0, 4000), url };
    const expected = forceFallback && (
      (url === origin + assetPath && (kind === "request" || /^Failed to load resource: net::ERR_FAILED$/.test(entry.message))) ||
      (entry.message.includes(`Could not load ${assetPath}:`) && /Failed to fetch|ERR_FAILED/.test(entry.message))
    );
    (expected ? result.expectedErrors : result.errors).push(entry);
  };
  page.on("pageerror", (error) => addError("pageerror", error.message));
  page.on("console", (message) => {
    if (message.type() === "error") addError("console", message.text(), message.location().url ?? "");
    if (recording && message.type() === "warning") result.warnings.push(message.text().slice(0, 2000));
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "request failed";
    if (request.url().startsWith(origin + "/") && failure !== "net::ERR_ABORTED") addError("request", failure, request.url());
  });
  page.on("response", (response) => {
    if (response.url() === origin + assetPath) result.assetResponses.push(response.status());
    if (response.url().startsWith(origin + "/") && response.status() >= 400) addError("http", String(response.status()), response.url());
  });
  try {
    const response = await page.goto(origin + "/drive", { waitUntil: "domcontentloaded", timeout: 25_000 });
    assert.equal(response?.status(), 200);
    await page.locator('html[data-app-ready="true"]').waitFor();
    await page.locator('[data-scene-stage="grounds"][data-scene-state="ready"]').waitFor({ timeout: 25_000 });
    await page.waitForFunction((status) => window.__driveQA?.getVehicle?.().status === status, forceFallback ? "fallback" : "glb", { timeout: 25_000 });
    result.vehicle = await page.evaluate(() => window.__driveQA.getVehicle());
    assert.equal(result.vehicle.kind, "photo-reference-food-truck");
    assert.equal(result.vehicle.wheelCount, 4);
    assert.equal(result.vehicle.bodyRoot, "FoodTruck_Body");
    if (!forceFallback) assert.ok(result.assetResponses.includes(200), "Actual body GLB must be served successfully");
    else assert.ok(result.expectedErrors.some((error) => error.kind === "request" && error.url === origin + assetPath), "Fallback must follow the intentionally failed asset request");
    result.checks.push(forceFallback ? "Actual GLB request fails and a procedural food truck renders its first frame" : "Actual body GLB responds 200 and its validated clone renders its first frame");
    await page.getByRole("button", { name: "Start driving", exact: true }).click();
    await page.waitForFunction(() => window.__driveQA.getStore().started === true);
    await check(page, result);
    assert.deepEqual(result.errors, [], "Unexpected browser or application errors");
    result.status = "PASS";
  } catch (error) {
    result.failure = String(error?.stack ?? error).slice(0, 6000);
  } finally {
    await page.keyboard.up("w").catch(() => {});
    await page.keyboard.up("a").catch(() => {});
    await page.keyboard.up("d").catch(() => {});
    try {
      const screenshot = join(output, `truck-${name}.png`);
      await page.screenshot({ path: screenshot, fullPage: false, caret: "initial", timeout: 10_000 });
      result.screenshot = screenshot;
      result.finalSim = await page.evaluate(() => window.__driveQA?.getSim?.()).catch(() => null);
    } catch (error) {
      result.status = "FAIL";
      result.screenshotError = String(error);
    }
    if (result.errors.length) result.status = "FAIL";
    recording = false;
    await context.close();
    save();
  }
}

try {
  const { chromium } = await import("playwright");
  browser = await chromium.launch({ headless: true, args: ["--disable-dev-shm-usage", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"], timeout: 30_000 });
  await scenario("asset-and-steering", false, async (page, result) => {
    await page.evaluate(() => window.__driveQA.teleport(0, 70, 0));
    await page.keyboard.down("w");
    await page.keyboard.down("a");
    await page.waitForFunction(() => {
      const sim = window.__driveQA.getSim();
      return sim.speed > 1 && sim.yaw > 0.12 && sim.x < -0.05 && sim.z < 70;
    });
    result.left = await page.evaluate(() => window.__driveQA.getSim());
    await page.keyboard.up("w");
    await page.keyboard.up("a");
    await page.evaluate(() => window.__driveQA.teleport(0, 70, 0));
    await page.keyboard.down("w");
    await page.keyboard.down("d");
    await page.waitForFunction(() => {
      const sim = window.__driveQA.getSim();
      return sim.speed > 1 && sim.yaw < -0.12 && sim.x > 0.05 && sim.z < 70;
    });
    result.right = await page.evaluate(() => window.__driveQA.getSim());
    await page.keyboard.up("w");
    await page.keyboard.up("d");
    await page.evaluate(() => window.__driveQA.teleport(0, 10, 0));
    const reset = await page.evaluate(() => window.__driveQA.getSim());
    assert.deepEqual({ x: reset.x, z: reset.z, yaw: reset.yaw, speed: reset.speed }, { x: 0, z: 10, yaw: 0, speed: 0 });
    result.checks.push("Real keyboard W+A turns left and W+D turns right; releasing controls and resetting restores a stationary truck");
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    const settings = page.getByRole("dialog", { name: "Settings", exact: true });
    await settings.getByRole("button", { name: "rain", exact: true }).click();
    assert.equal(await page.evaluate(() => window.__driveQA.getStore().weather), "rain");
    await settings.getByRole("button", { name: "Mute", exact: true }).click();
    assert.equal(await page.evaluate(() => window.__driveQA.getStore().muted), true);
    await settings.getByRole("button", { name: "Close", exact: true }).click();
    result.checks.push("Weather and mute settings change the live truck scene state");
    // Regression for the real minimap-over-Settings failure: use normal hit testing
    // and normal clicks after responsive/translated toolbar wrapping.
    result.toolbarLayouts = [];
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 360, height: 800 }]) {
      await page.setViewportSize(viewport);
      for (const { lang, settings: settingsLabel, close } of [
        { lang: "en", settings: "Settings", close: "Close" },
        { lang: "th", settings: "ตั้งค่า", close: "ปิด" },
        { lang: "zh", settings: "设置", close: "关闭" },
      ]) {
        await page.evaluate((value) => window.__driveQA.setLang(value), lang);
        const openSettings = page.getByRole("button", { name: settingsLabel, exact: true });
        await openSettings.waitFor();
        await page.evaluate(() => document.fonts.ready);
        const buttons = await page.getByTestId("drive-hud-toolbar").evaluate((toolbar) =>
          [...toolbar.querySelectorAll("button")].map((button) => {
            const r = button.getBoundingClientRect();
            const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
            return { label: button.getAttribute("aria-label"), hit: button === top || button.contains(top), inside: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight };
          }),
        );
        assert.ok(buttons.length >= 5 && buttons.every((button) => button.hit && button.inside), `Every ${lang} HUD control is visible and unobstructed at ${viewport.width}px: ${JSON.stringify(buttons)}`);
        await openSettings.click();
        const dialog = page.getByRole("dialog", { name: settingsLabel, exact: true });
        await dialog.waitFor();
        await dialog.getByRole("button", { name: close, exact: true }).click();
        result.toolbarLayouts.push({ width: viewport.width, lang, buttons });
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => window.__driveQA.setLang("en"));
    result.checks.push("All English, Thai and Chinese HUD controls are unobstructed at desktop and 360px mobile widths; Settings opens with real clicks");
  });
  await scenario("asset-fallback", true, async (page, result) => {
    await page.evaluate(() => window.__driveQA.teleport(0, 70, 0));
    await page.keyboard.down("w");
    await page.waitForFunction(() => {
      const sim = window.__driveQA.getSim();
      return sim.speed > 1 && sim.z < 69.8;
    });
    await page.keyboard.up("w");
    await page.evaluate(() => window.__driveQA.teleport(0, 10, 0));
    assert.equal(await page.evaluate(() => window.__driveQA.getVehicle().status), "fallback");
    result.checks.push("The complete procedural food truck still responds to actual driving input after asset failure");
  });
  report.ok = report.scenarios.every((scenario) => scenario.status === "PASS");
} catch (error) {
  report.error = String(error?.stack ?? error).slice(0, 6000);
} finally {
  if (browser) await browser.close();
  clearTimeout(deadline);
  report.finishedAt = new Date().toISOString();
  save();
  console.log(JSON.stringify({ ok: report.ok, verdict, scenarios: report.scenarios.map(({ name, status }) => ({ name, status })) }, null, 2));
  if (!report.ok) process.exitCode = 1;
}
