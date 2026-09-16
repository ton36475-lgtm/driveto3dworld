#!/usr/bin/env node
/** Functional CI checks. Screenshots are evidence, not a visual or performance score. */
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkedUrl } from "./browser-guard.mjs";
import { validateConfig } from "../src/lib/forge/config.mjs";

// This test is deliberately executable only by the repository's GitHub CI job.
if (process.env.GITHUB_ACTIONS !== "true") {
  console.error("browser-spatial is CI-only; run it through the GitHub Actions workflow.");
  process.exit(1);
}

const suppliedOrigin = new URL(checkedUrl(process.argv[2] ?? "http://127.0.0.1:8080"));
assert.equal(suppliedOrigin.pathname, "/", "Pass an origin without a route");
assert.ok(!suppliedOrigin.search && !suppliedOrigin.hash && !suppliedOrigin.username && !suppliedOrigin.password);
const origin = suppliedOrigin.origin;
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "screenshots");
mkdirSync(output, { recursive: true });
const verdictPath = join(output, "spatial-verdict.json");
const report = {
  schemaVersion: 1,
  startedAt: new Date().toISOString(),
  origin,
  scope: "Functional regression only; no visual quality, performance or physical-device certification",
  ok: false,
  scenarios: [],
};
let browser;
const writeReport = () => writeFileSync(verdictPath, JSON.stringify(report, null, 2) + "\n");
const deadline = setTimeout(() => {
  report.error = "Spatial browser checks exceeded the 180-second suite deadline";
  report.finishedAt = new Date().toISOString();
  writeReport();
  console.error(report.error);
  process.exit(1);
}, 180_000);

function installProbe({ unavailable }) {
  localStorage.setItem("sxb-lang", JSON.stringify({ state: { lang: "en" }, version: 0 }));
  const probe = { attempts: 0, contexts: 0, draws: 0, lastDraw: 0 };
  window.__spatialCI = probe;
  const original = HTMLCanvasElement.prototype.getContext;
  const patched = new WeakSet();
  HTMLCanvasElement.prototype.getContext = function (type, ...options) {
    const webgl = ["webgl", "webgl2", "experimental-webgl"].includes(type);
    if (webgl) {
      probe.attempts++;
      if (unavailable) return null;
    }
    const context = original.call(this, type, ...options);
    if (webgl && context && !patched.has(context)) {
      probe.contexts++;
      patched.add(context);
      for (const name of ["drawArrays", "drawElements", "drawArraysInstanced", "drawElementsInstanced"]) {
        if (typeof context[name] !== "function") continue;
        const draw = context[name];
        context[name] = function (...args) {
          probe.draws++;
          probe.lastDraw = performance.now();
          return draw.apply(this, args);
        };
      }
    }
    return context;
  };
}

async function navigate(page, route) {
  const response = await page.goto(origin + route, { waitUntil: "domcontentloaded", timeout: 25_000 });
  assert.equal(response?.status(), 200, `${route} must respond successfully`);
  await page.locator('html[data-app-ready="true"]').waitFor();
  if (route === "/forge") await page.locator('main[data-page-ready="true"]').waitFor();
}

async function scenario(name, options, check) {
  const result = { name, status: "FAIL", checks: [], errors: [], expectedErrors: [], warnings: [] };
  report.scenarios.push(result);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
    locale: "en-US",
    reducedMotion: options.reducedMotion ?? "no-preference",
    acceptDownloads: true,
  });
  await context.addInitScript(installProbe, { unavailable: options.unavailable === true });
  const page = await context.newPage();
  page.setDefaultTimeout(12_000);
  let recording = true;
  const recordError = (kind, message) => {
    if (!recording) return;
    const entry = { kind, message: String(message).slice(0, 4000) };
    // A deliberately absent WebGL context is expected to reach the React boundary.
    // No other browser or application errors are allowed through this filter.
    const expected = (options.unavailable && (
      /Error creating WebGL context[.!]?/i.test(entry.message) ||
      /The above error occurred in the <CanvasImpl> component/.test(entry.message)
    )) || (options.contextLoss && entry.message === "THREE.WebGLRenderer: Context Lost.");
    (expected ? result.expectedErrors : result.errors).push(entry);
  };
  page.on("pageerror", (error) => recordError("pageerror", error.message));
  page.on("console", (message) => {
    if (message.type() === "error") recordError("console", message.text());
    if (recording && message.type() === "warning") result.warnings.push(message.text().slice(0, 2000));
  });
  page.on("response", (response) => {
    if (response.url().startsWith(origin + "/") && response.status() >= 400)
      recordError("http", `${response.status()} ${new URL(response.url()).pathname}`);
  });
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText ?? "request failed";
    if (request.url().startsWith(origin + "/") && reason !== "net::ERR_ABORTED")
      recordError("request", `${reason} ${new URL(request.url()).pathname}`);
  });
  try {
    await check(page, result);
    assert.deepEqual(result.errors, [], "Unexpected browser or application errors");
    result.status = "PASS";
  } catch (error) {
    result.failure = String(error?.stack ?? error).slice(0, 6000);
  } finally {
    try {
      const screenshot = join(output, `spatial-${name}.png`);
      await page.screenshot({ path: screenshot, fullPage: false, timeout: 10_000 });
      result.screenshot = screenshot;
      result.probe = await page.evaluate(() => window.__spatialCI).catch(() => null);
    } catch (error) {
      result.status = "FAIL";
      result.screenshotError = String(error);
    }
    recording = false;
    if (result.errors.length) result.status = "FAIL";
    await context.close();
    writeReport();
  }
}

try {
  const { chromium } = await import("playwright");
  browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    timeout: 30_000,
  });

  await scenario("forge-controls", {}, async (page, result) => {
    await navigate(page, "/forge");
    await page.getByRole("heading", { name: "Shape your space", exact: true }).waitFor();
    const configuration = page.getByRole("region", { name: "Configuration", exact: true });
    const preview = page.getByRole("region", { name: "Website preview", exact: true });
    await configuration.getByLabel("Scene", { exact: true }).selectOption("static");
    await preview.getByRole("heading", { name: "A space for creative work.", exact: true }).waitFor();
    await configuration.getByLabel("Business preset", { exact: true }).selectOption("professional-service");
    await preview.getByRole("heading", { name: "Turn an idea into a clear brief.", exact: true }).waitFor();
    await configuration.getByLabel("Business preset", { exact: true }).selectOption("music-event");
    await preview.getByRole("heading", { name: "Make room for the next performance.", exact: true }).waitFor();
    await configuration.getByLabel("Theme", { exact: true }).selectOption("slate");
    await preview.getByText("Live preview · concept imagery / Slate", { exact: true }).waitFor();
    await configuration.getByLabel("Work count", { exact: true }).selectOption("2");
    assert.equal(await preview.getByRole("img").count(), 2);
    result.checks.push("All presets change rendered headings; theme, static scene and density update preview");

    await configuration.getByRole("button", { name: "Pause motion", exact: true }).click();
    const resume = configuration.getByRole("button", { name: "Resume motion", exact: true });
    await resume.waitFor();
    assert.equal(await resume.getAttribute("aria-pressed"), "true");
    await configuration.getByRole("checkbox", { name: "Introduction", exact: true }).uncheck();
    await preview.getByRole("heading", { name: "Make room for the next performance.", exact: true }).waitFor({ state: "hidden" });
    await configuration.getByRole("checkbox", { name: "Contact", exact: true }).uncheck();
    await preview.getByRole("link", { name: "Prepare a project brief", exact: true }).waitFor({ state: "hidden" });
    assert.equal(await configuration.getByRole("checkbox", { name: "Work", exact: true }).isDisabled(), true);
    await configuration.getByRole("checkbox", { name: "Introduction", exact: true }).check();
    await configuration.getByRole("checkbox", { name: "Contact", exact: true }).check();
    result.checks.push("Motion toggle reports paused; section controls preserve at least one section");

    const downloadReady = page.waitForEvent("download", { timeout: 12_000 });
    await configuration.getByRole("button", { name: "Export configuration", exact: true }).click();
    const download = await downloadReady;
    assert.equal(download.suggestedFilename(), "sxb-music-event.v1.json");
    const destination = join(output, "spatial-export.v1.json");
    await download.saveAs(destination);
    assert.equal(await download.failure(), null);
    const config = JSON.parse(readFileSync(destination, "utf8"));
    assert.deepEqual(validateConfig(config), []);
    for (const [key, value] of Object.entries({ version: 1, preset: "music-event", theme: "slate", scene: "static", density: 2, motion: "paused", locale: "en" }))
      assert.equal(config[key], value, `Export must preserve selected ${key}`);
    assert.deepEqual([...config.sections].sort(), ["contact", "profile", "work"]);
    assert.equal(config.evidence.clientWorkVerified, false);
    assert.deepEqual(config.kpis, { primary: "N/A", driver: "N/A", guardrail: "N/A" });
    await configuration.getByRole("status").filter({ hasText: "Configuration exported" }).waitFor();
    result.export = destination;
    result.checks.push("Actual downloaded JSON validates and retains chosen controls and unverified evidence state");
  });

  await scenario("reduced-motion", { reducedMotion: "reduce" }, async (page, result) => {
    await navigate(page, "/forge");
    await page.getByRole("heading", { name: "Shape your space", exact: true }).waitFor();
    assert.equal(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true);
    const preview = page.getByRole("region", { name: "Website preview", exact: true });
    await preview.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => window.__spatialCI.attempts > 0, null, { timeout: 20_000 });
    const supported = await page.evaluate(() => window.__spatialCI.contexts > 0);
    if (!supported) {
      await preview.getByRole("link", { name: "Browse all work", exact: true }).waitFor();
      const initializationErrors = result.errors.filter(({ message }) => /Error creating WebGL context[.!]?/i.test(message));
      result.expectedErrors.push(...initializationErrors);
      result.errors = result.errors.filter((error) => !initializationErrors.includes(error));
      result.motionCheck = "NOT_TESTED: this runner could not create a WebGL context";
      result.checks.push("Reduced-motion preference emulated; readable fallback retained");
      return;
    }
    await preview.locator("canvas").waitFor();
    await page.waitForFunction(
      () => window.__spatialCI.draws > 0 && performance.now() - window.__spatialCI.lastDraw > 700,
      null,
      { timeout: 20_000 },
    );
    result.motionCheck = "PASS: scene rendered and stopped submitting frames while idle under reduced motion";
    result.checks.push("System reduced-motion preference halts idle automatic rendering; configuration remains available");
    await page.getByRole("region", { name: "Configuration", exact: true }).getByLabel("Scene", { exact: true }).selectOption("static");
    assert.equal(await preview.getByRole("img").count(), 4);
  });

  await scenario("drive-no-webgl", { unavailable: true, reducedMotion: "reduce" }, async (page, result) => {
    await navigate(page, "/drive");
    await page.getByRole("heading", { name: "Explore the studies", exact: true }).waitFor();
    assert.ok(await page.evaluate(() => window.__spatialCI.attempts > 0));
    assert.equal(await page.evaluate(() => window.__spatialCI.contexts), 0);
    const studies = page.getByRole("region", { name: "Explore the studies", exact: true });
    assert.equal(await studies.getByRole("article").count(), 12);
    assert.equal(await studies.getByText("Concept study · unverified", { exact: true }).count(), 12);
    await studies.getByText("Read study", { exact: true }).first().click();
    await studies.getByText("These are exploratory design concepts. Client commissions and production outcomes have not been verified.", { exact: true }).first().waitFor();
    assert.ok(!(await studies.innerText()).includes("Commissioned as"));
    result.checks.push("Forced WebGL failure preserves all twelve labeled concepts and readable study details");
    await page.screenshot({ path: join(output, "spatial-drive-fallback-content.png"), fullPage: false, timeout: 10_000 });
    await studies.getByRole("link", { name: "Work index", exact: true }).click();
    await page.waitForURL(origin + "/work", { timeout: 15_000 });
    await page.getByRole("main").waitFor();
    result.checks.push("Fallback Work index link navigates successfully");
  });

  await scenario("drive-context-loss", { contextLoss: true, reducedMotion: "reduce" }, async (page, result) => {
    await navigate(page, "/drive");
    const stage = page.locator('[data-scene-stage="grounds"]');
    await stage.waitFor();
    await page.waitForFunction(() => {
      const state = document.querySelector('[data-scene-stage="grounds"]')?.getAttribute("data-scene-state");
      return state === "ready" || state === "fallback";
    }, null, { timeout: 25_000 });
    if (await stage.getAttribute("data-scene-state") === "fallback") {
      await page.getByRole("heading", { name: "Explore the studies", exact: true }).waitFor();
      result.contextLossCheck = "NOT_TESTED: runner could not create a live WebGL2 scene";
      return;
    }
    const loss = await stage.locator("canvas").evaluate((canvas) => {
      const context = canvas.getContext("webgl2");
      if (!context) return "NO_CONTEXT";
      const extension = context.getExtension("WEBGL_lose_context");
      if (!extension) return "NO_EXTENSION";
      extension.loseContext();
      return "REQUESTED";
    });
    assert.notEqual(loss, "NO_CONTEXT", "A ready scene must have a live WebGL2 context");
    if (loss === "NO_EXTENSION") {
      result.contextLossCheck = "NOT_TESTED: WEBGL_lose_context extension unavailable";
      return;
    }
    await page.locator('[data-scene-stage="grounds"][data-scene-state="fallback"]').waitFor();
    const studies = page.getByRole("region", { name: "Explore the studies", exact: true });
    await studies.waitFor();
    assert.equal(await studies.getByRole("article").count(), 12);
    assert.equal(await studies.getByText("Concept study · unverified", { exact: true }).count(), 12);
    assert.equal(await stage.locator("canvas").count(), 0);
    await studies.getByText("Read study", { exact: true }).first().click();
    await studies.getByText("These are exploratory design concepts. Client commissions and production outcomes have not been verified.", { exact: true }).first().waitFor();
    result.contextLossCheck = "PASS: actual live context loss replaced the scene with all twelve readable concepts";
    result.checks.push("WEBGL_lose_context after the first rendered frame reaches permanent fallback without losing study content");
  });

  report.ok = report.scenarios.every((result) => result.status === "PASS");
} catch (error) {
  report.error = String(error?.stack ?? error).slice(0, 6000);
} finally {
  if (browser) await browser.close();
  clearTimeout(deadline);
  report.finishedAt = new Date().toISOString();
  writeReport();
  console.log(JSON.stringify({ ok: report.ok, verdict: verdictPath, scenarios: report.scenarios.map(({ name, status, motionCheck, contextLossCheck }) => ({ name, status, motionCheck, contextLossCheck })) }, null, 2));
  if (!report.ok) process.exitCode = 1;
}
