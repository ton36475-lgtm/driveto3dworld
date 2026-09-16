#!/usr/bin/env node
/** CI-only rendered locale and local foodtruck checks. No live service certification. */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Keep this before importing Playwright: local execution must never launch a browser.
if (process.env.GITHUB_ACTIONS !== "true" || process.env.CI !== "true") {
  console.error("browser-locales runs only in GitHub Actions (GITHUB_ACTIONS=true and CI=true).");
  process.exit(1);
}

function localOrigin(input) {
  const url = new URL(input);
  assert.ok(["http:", "https:"].includes(url.protocol), "Only HTTP(S) is supported.");
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname), "Origin must be loopback.");
  assert.equal(url.username + url.password, "", "Origin must not contain credentials.");
  assert.equal(url.pathname, "/", "Pass an origin without a route path.");
  assert.equal(url.search + url.hash, "", "Origin must not include a query or fragment.");
  return url.origin;
}

const origin = localOrigin(process.argv[2] ?? "http://127.0.0.1:8080");
const output = fileURLToPath(new URL("../screenshots/", import.meta.url));
const reportPath = join(output, "browser-locales.json");
await mkdir(output, { recursive: true });
const report = {
  suite: "trilingual-local-foodtruck-ui",
  startedAt: new Date().toISOString(),
  origin,
  status: "running",
  scope:
    "Rendered locale/local-operations checks with WebGL deliberately unavailable; actual GPU rendering is covered by spatial CI. No live service, payment, delivery, or physical-device certification.",
  scenarios: [],
};
let browser;
let deadline;
const writeReport = () => writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

function readableFallback() {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...options) {
    if (["webgl", "webgl2", "experimental-webgl"].includes(type)) return null;
    return original.call(this, type, ...options);
  };
}

async function visit(page, path) {
  const response = await page.goto(origin + path, { waitUntil: "domcontentloaded" });
  assert.equal(response?.status(), 200, `${path} must respond successfully`);
  await page.locator('html[data-app-ready="true"]').waitFor();
  if (path === "/forge") await page.locator('main[data-page-ready="true"]').waitFor();
  if (path === "/foodtruck") await page.getByTestId("foodtruck-page").waitFor();
  if (path === "/drive")
    await page.locator('[data-scene-stage="grounds"][data-scene-state="fallback"]').waitFor();
  await page.locator("main").waitFor();
  await page.evaluate(() => document.fonts.ready);
}

const languageNames = { en: "English", th: "ไทย", zh: "简体中文" };
const htmlLanguages = { en: "en", th: "th", zh: "zh-CN" };
const homeIntroductions = {
  en: "A shared portfolio for AI, websites, music, and creative collaboration from Phitsanulok.",
  th: "พอร์ตโฟลิโอร่วมด้าน AI เว็บไซต์ ดนตรี และงานสร้างสรรค์จากพิษณุโลก",
  zh: "来自泰国彭世洛的联合创作档案，汇集人工智能、网站、音乐与创意合作。",
};

async function languageState(page, language) {
  await page.waitForFunction(
    (expected) => document.documentElement.lang === expected,
    htmlLanguages[language],
  );
  const active = page.locator(`button[data-language="${language}"]:visible`);
  assert.equal(await active.count(), 1, "Exactly one responsive locale control must be visible");
  assert.equal(await active.getAttribute("aria-label"), languageNames[language]);
  assert.equal(await active.getAttribute("aria-pressed"), "true");
  const stored = await page.evaluate(() => localStorage.getItem("sxb-lang"));
  assert.equal(
    JSON.parse(stored ?? "null")?.state?.lang,
    language,
    "Selected language must persist",
  );
}

async function selectLanguage(page, language) {
  const control = page.locator(`button[data-language="${language}"]:visible`);
  await control.click();
  await languageState(page, language);
}

async function layout(page, label) {
  const dimensions = await page.evaluate(() => {
    const controls = [...document.querySelectorAll("button[data-language]")]
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => {
        const box = element.getBoundingClientRect();
        return {
          language: element.getAttribute("data-language"),
          left: box.left,
          right: box.right,
        };
      });
    return {
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
      controls,
    };
  });
  assert.ok(
    dimensions.content <= dimensions.viewport + 1,
    `${label}: horizontal overflow ${JSON.stringify(dimensions)}`,
  );
  assert.equal(
    dimensions.controls.length,
    3,
    `${label}: all three locale controls must be visible`,
  );
  for (const control of dimensions.controls)
    assert.ok(
      control.left >= -1 && control.right <= dimensions.viewport + 1,
      `${label}: clipped locale control ${JSON.stringify(control)}`,
    );
  return dimensions;
}

async function chineseContent(page, path) {
  const main = page.locator("main");
  const heading = main.getByRole("heading").first();
  await heading.waitFor();
  const title = await heading.innerText();
  if (path === "/")
    assert.match(title, /SIRAWAT\s*×\s*BALL/, "Home keeps its studio brand heading");
  else assert.match(title, /[\u3400-\u9fff]/u, `${path}: primary heading must be Chinese`);
  const content = await main.innerText();
  const chineseCharacters = (content.match(/[\u3400-\u9fff]/gu) ?? []).length;
  assert.ok(
    chineseCharacters >= 30,
    `${path}: meaningful Chinese body copy is required, found ${chineseCharacters} Chinese characters`,
  );
  // Native language names on trilingual input labels are intentionally retained.
  assert.doesNotMatch(
    content.replaceAll("ไทย", ""),
    /[\u0e01-\u0e5b]/u,
    `${path}: fresh Chinese page must not leak Thai interface copy`,
  );
  assert.doesNotMatch(
    content,
    /Shape your space|Prepare your brief\.|The desk\.|Explore the studies|Save brief on this device|Download backup/,
    `${path}: untranslated primary English copy`,
  );
  return { path, heading: await heading.innerText(), chineseCharacters };
}

async function reducedMotion(page) {
  const state = await page.evaluate(() => {
    const duration = (value) =>
      value.split(",").map((part) => parseFloat(part) * (part.trim().endsWith("ms") ? 0.001 : 1));
    const violations = [];
    for (const element of document.querySelectorAll("body *")) {
      if (element.getClientRects().length === 0) continue;
      for (const pseudo of [null, "::before", "::after"]) {
        const css = getComputedStyle(element, pseudo);
        if (pseudo && ["none", "normal"].includes(css.content)) continue;
        if (
          css.animationName !== "none" &&
          duration(css.animationDuration).some((seconds) => seconds > 0.001)
        )
          violations.push({
            tag: element.tagName,
            pseudo,
            animation: css.animationName,
            duration: css.animationDuration,
          });
      }
    }
    return {
      matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      violations: violations.slice(0, 12),
    };
  });
  assert.equal(state.matches, true);
  assert.equal(state.scrollBehavior, "auto");
  assert.deepEqual(
    state.violations,
    [],
    "Reduced motion must suppress automatic interface animation",
  );
  return state;
}

async function scenario(name, viewport, check) {
  const result = {
    name,
    viewport,
    status: "FAIL",
    checks: [],
    pageErrors: [],
    consoleErrors: [],
    mutationRequests: [],
    externalRequests: [],
    screenshots: [],
  };
  report.scenarios.push(result);
  const contexts = [];
  let lastPage;
  async function freshPage() {
    const context = await browser.newContext({
      viewport,
      locale: "en-GB",
      reducedMotion: "reduce",
      acceptDownloads: true,
    });
    contexts.push(context);
    await context.addInitScript(readableFallback);
    const page = await context.newPage();
    lastPage = page;
    page.setDefaultTimeout(12_000);
    page.setDefaultNavigationTimeout(25_000);
    page.on("pageerror", (error) => result.pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") result.consoleErrors.push(message.text());
    });
    page.on("request", (request) => {
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method()))
        result.mutationRequests.push({ method: request.method(), url: request.url() });
      if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== origin)
        result.externalRequests.push(request.url());
    });
    return page;
  }
  async function snapshot(page, label) {
    const filename = `locales-${name}-${label}.png`;
    await page.screenshot({
      path: join(output, filename),
      fullPage: false,
      caret: "initial",
      timeout: 10_000,
    });
    result.screenshots.push(filename);
  }
  try {
    await check({ freshPage, snapshot, result });
    assert.deepEqual(result.pageErrors, [], "No uncaught browser errors are allowed");
    assert.deepEqual(result.consoleErrors, [], "No console errors are allowed");
    assert.deepEqual(
      result.mutationRequests,
      [],
      "Local workflows must not send network mutations",
    );
    result.status = "PASS";
  } catch (error) {
    result.error = String(error?.stack ?? error).slice(0, 8000);
    if (lastPage) await snapshot(lastPage, "failure").catch(() => {});
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
    await writeReport();
  }
}

async function localeScenario(viewport) {
  await scenario(`locale-${viewport.width}`, viewport, async ({ freshPage, snapshot, result }) => {
    const page = await freshPage();
    await visit(page, "/");
    for (const language of ["th", "en", "zh"]) {
      await selectLanguage(page, language);
      await page.locator("main").getByText(homeIntroductions[language], { exact: true }).waitFor();
      await layout(page, `home/${language}/${viewport.width}`);
    }
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator('html[data-app-ready="true"]').waitFor();
    await languageState(page, "zh");
    result.checks.push(
      "Visible EN/TH/Chinese selector switches content and document language; Chinese persists after reload",
    );
    if (viewport.width < 1280) {
      const mobileMenu = page.locator('button[aria-controls="mobile-nav"]:visible');
      await mobileMenu.click();
      assert.equal(await mobileMenu.getAttribute("aria-expanded"), "true");
      await page.locator('#mobile-nav a[href="/foodtruck"]').click();
      await page.waitForURL(origin + "/foodtruck");
      await page.getByTestId("foodtruck-page").waitFor();
      await page.waitForFunction(
        () =>
          document
            .querySelector('button[aria-controls="mobile-nav"]')
            ?.getAttribute("aria-expanded") === "false",
      );
      assert.notEqual(
        await page.locator("body").evaluate((element) => getComputedStyle(element).overflow),
        "hidden",
      );
      await languageState(page, "zh");
      result.checks.push(
        "Mobile menu opens, navigates to Foodtruck, closes, and unlocks scrolling",
      );
    }
    const paths =
      viewport.width === 1440
        ? [
            "/",
            "/work",
            "/gallery",
            "/studio",
            "/kit",
            "/forge",
            "/contact",
            "/desk",
            "/marketing",
            "/automations",
            "/foodtruck",
            "/drive",
          ]
        : ["/", "/gallery", "/forge", "/contact", "/foodtruck", "/drive"];
    result.routes = [];
    for (const path of paths) {
      await visit(page, path);
      await languageState(page, "zh");
      result.routes.push({
        ...(await chineseContent(page, path)),
        layout: await layout(page, `${path}/${viewport.width}`),
      });
      await reducedMotion(page);
      if (["/", "/foodtruck", "/drive"].includes(path))
        await snapshot(page, path === "/" ? "home" : path.slice(1));
    }
    result.checks.push(
      "Chinese primary content persists across routes; responsive bounds and reduced-motion CSS pass",
    );
  });
}

// The operational scenario below uses only rendered form controls and downloaded files.
async function rawPlan(page) {
  return page.evaluate(() => localStorage.getItem("sxb-foodtruck-v1"));
}

async function savedPlan(page) {
  const raw = await rawPlan(page);
  assert.ok(raw, "A successful save must have durable local data");
  return JSON.parse(raw);
}

async function fillFields(page, values) {
  for (const [id, value] of Object.entries(values)) await page.getByTestId(id).fill(value);
}

async function assertPlanUnchanged(page, previous, label) {
  assert.equal(await rawPlan(page), previous, `${label} must not overwrite the saved plan`);
}

async function foodtruckScenario(viewport) {
  await scenario(
    `foodtruck-${viewport.width}`,
    viewport,
    async ({ freshPage, snapshot, result }) => {
      const page = await freshPage();
      await visit(page, "/foodtruck");
      await selectLanguage(page, "en");
      await page.locator('[data-testid="truck-save"]:enabled').waitFor();
      assert.match(
        await page.locator("main").innerText(),
        /They are not published or synced to a team/,
      );
      await page
        .getByText("Add your first dish with a name in all three languages.", { exact: true })
        .waitFor();
      await page
        .getByText(
          "No service stops yet. Add a location and a planned time before opening directions.",
          { exact: true },
        )
        .waitFor();
      assert.equal(await page.getByTestId("menu-item").count(), 0);
      assert.equal(await page.getByTestId("service-stop").count(), 0);
      assert.equal(await page.getByTestId("stop-directions").count(), 0);
      assert.equal(
        await page.getByRole("link", { name: "Open contact / ordering page", exact: true }).count(),
        0,
      );
      result.checks.push(
        "Fresh foodtruck workspace has honest empty menu/stops and no fabricated map/contact handoff",
      );

      const truckName = `CI ${viewport.width} foodtruck`;
      const contact = `https://example.com/ci-foodtruck?viewport=${viewport.width}`;
      await fillFields(page, { "truck-name": truckName, "truck-contact": contact });
      await page.getByTestId("truck-currency").selectOption("THB");
      await page.getByTestId("truck-save").click();
      await page.getByRole("link", { name: "Open contact / ordering page", exact: true }).waitFor();
      let plan = await savedPlan(page);
      assert.equal(plan.name, truckName);
      assert.equal(plan.contactUrl, contact);
      assert.equal(plan.currency, "THB");
      const contactLink = page.getByRole("link", {
        name: "Open contact / ordering page",
        exact: true,
      });
      assert.equal(await contactLink.getAttribute("href"), contact);
      assert.match((await contactLink.getAttribute("rel")) ?? "", /noopener/);

      let before = await rawPlan(page);
      await page.getByTestId("truck-contact").fill("javascript:alert('ci')");
      await page.getByTestId("truck-save").click();
      await page
        .getByRole("alert")
        .filter({ hasText: /Nothing was saved/ })
        .waitFor();
      await assertPlanUnchanged(page, before, "Unsafe contact URL");
      assert.equal(await page.locator('a[href^="javascript:"]').count(), 0);
      await page.getByTestId("truck-contact").fill(contact);
      await page.getByTestId("truck-save").click();
      result.checks.push(
        "Valid truck profile saves locally; unsafe contact protocol is rejected without mutation",
      );

      const menuNames = { en: "CI basil rice", th: "ข้าวกะเพราทดสอบ", zh: "测试罗勒饭" };
      await fillFields(page, {
        "menu-en": menuNames.en,
        "menu-th": menuNames.th,
        "menu-zh": menuNames.zh,
        "menu-price": "145.555",
      });
      before = await rawPlan(page);
      await page.getByTestId("menu-submit").click();
      // The browser's native step validation or the application's error must reject 3 decimals.
      const invalidPrice = await page
        .getByTestId("menu-price")
        .evaluate((element) => !element.validity.valid);
      if (!invalidPrice)
        await page
          .getByRole("alert")
          .filter({ hasText: /Nothing was saved/ })
          .waitFor();
      await assertPlanUnchanged(page, before, "Invalid monetary precision");
      await page.getByTestId("menu-price").fill("145.50");
      await page.getByTestId("menu-submit").click();
      const menu = page.getByTestId("menu-item");
      await menu.getByText(menuNames.en, { exact: true }).waitFor();
      plan = await savedPlan(page);
      assert.equal(plan.menu.length, 1);
      assert.equal(plan.menu[0].priceMinor, 14550);
      assert.deepEqual(plan.menu[0].label, menuNames);
      const menuId = plan.menu[0].id;
      await menu.getByTestId("item-edit").click();
      await menu.getByTestId("item-sold-out").click();
      assert.equal((await savedPlan(page)).menu[0].soldOut, true);
      await page.getByTestId("menu-price").fill("149.25");
      await page.getByTestId("menu-submit").click();
      plan = await savedPlan(page);
      assert.equal(plan.menu.length, 1, "Editing must not duplicate a dish");
      assert.equal(plan.menu[0].id, menuId);
      assert.equal(plan.menu[0].priceMinor, 14925);
      assert.equal(plan.menu[0].soldOut, true, "Editing must retain sold-out state");
      result.checks.push(
        "Trilingual dish creation, exact monetary amount, sold-out toggle, and edit retain identity and state",
      );

      const stopNames = { en: "CI riverside stop", th: "จุดจอดทดสอบ", zh: "测试河畔停靠点" };
      await fillFields(page, {
        "stop-en": stopNames.en,
        "stop-th": stopNames.th,
        "stop-zh": stopNames.zh,
        "stop-latitude": "91",
        "stop-longitude": "100.2648",
        "stop-start": "2099-06-15T11:30",
        "stop-end": "2099-06-15T13:00",
      });
      before = await rawPlan(page);
      await page.getByTestId("stop-submit").click();
      const invalidLatitude = await page
        .getByTestId("stop-latitude")
        .evaluate((element) => !element.validity.valid);
      if (!invalidLatitude)
        await page
          .getByRole("alert")
          .filter({ hasText: /Nothing was saved/ })
          .waitFor();
      await assertPlanUnchanged(page, before, "Out-of-range latitude");
      await page.getByTestId("stop-latitude").fill("16.8211");
      await page.getByTestId("stop-end").fill("2099-06-15T10:00");
      await page.getByTestId("stop-submit").click();
      await page
        .getByRole("alert")
        .filter({ hasText: /Nothing was saved/ })
        .waitFor();
      await assertPlanUnchanged(page, before, "Reversed service time range");
      await page.getByTestId("stop-end").fill("2099-06-15T13:00");
      await page.getByTestId("stop-submit").click();
      const stop = page.getByTestId("service-stop");
      await stop.getByText(stopNames.en, { exact: true }).waitFor();
      await stop.getByText("Planned stop", { exact: true }).waitFor();
      plan = await savedPlan(page);
      assert.equal(plan.stops.length, 1);
      assert.deepEqual(plan.stops[0].label, stopNames);
      assert.equal(plan.stops[0].startAt, "2099-06-15T11:30:00+07:00");
      assert.equal(plan.stops[0].endAt, "2099-06-15T13:00:00+07:00");
      const stopId = plan.stops[0].id;
      const directions = new URL(await stop.getByTestId("stop-directions").getAttribute("href"));
      assert.equal(directions.origin, "https://www.google.com");
      assert.equal(directions.pathname, "/maps/dir/");
      assert.equal(directions.searchParams.get("api"), "1");
      assert.equal(directions.searchParams.get("destination"), "16.8211,100.2648");
      assert.equal(directions.searchParams.get("travelmode"), "driving");
      assert.equal(directions.username + directions.password, "");
      assert.match(
        (await stop.getByTestId("stop-directions").getAttribute("rel")) ?? "",
        /noopener/,
      );
      await stop.getByTestId("stop-edit").click();
      await page.getByTestId("stop-start").fill("2001-06-15T11:30");
      await page.getByTestId("stop-end").fill("2001-06-15T13:00");
      await page.getByTestId("stop-submit").click();
      await stop.getByText("Past plan", { exact: true }).waitFor();
      plan = await savedPlan(page);
      assert.equal(plan.stops.length, 1, "Editing must not duplicate a service stop");
      assert.equal(plan.stops[0].id, stopId);
      result.checks.push(
        "Coordinates/time range validate; saved +07 timestamps, planned/past statuses, and safe manual Google Maps directions are correct",
      );

      await page.reload({ waitUntil: "domcontentloaded" });
      await page.locator('html[data-app-ready="true"]').waitFor();
      await page.getByTestId("menu-item").getByText(menuNames.en, { exact: true }).waitFor();
      assert.equal(await page.getByTestId("truck-name").inputValue(), truckName);
      assert.equal((await savedPlan(page)).menu[0].soldOut, true);
      for (const language of ["th", "zh", "en"]) {
        await selectLanguage(page, language);
        await page
          .getByTestId("menu-item")
          .getByText(menuNames[language], { exact: true })
          .waitFor();
        await page
          .getByTestId("service-stop")
          .getByText(stopNames[language], { exact: true })
          .waitFor();
        await layout(page, `filled-foodtruck/${language}/${viewport.width}`);
      }
      await snapshot(page, "saved");
      result.checks.push(
        "Profile/menu/stops persist on reload and owner-entered names switch correctly in all three languages",
      );

      const downloading = page.waitForEvent("download");
      await page.getByTestId("plan-export").click();
      const download = await downloading;
      assert.equal(download.suggestedFilename(), "sxb-foodtruck-plan.json");
      const backupPath = join(output, `foodtruck-${viewport.width}-synthetic-plan.json`);
      await download.saveAs(backupPath);
      assert.equal(await download.failure(), null);
      const exported = JSON.parse(await readFile(backupPath, "utf8"));
      assert.deepEqual(
        exported,
        await savedPlan(page),
        "Downloaded plan must equal persisted state",
      );
      await page.getByTestId("menu-item").getByTestId("item-remove").click();
      await page.getByTestId("service-stop").getByTestId("stop-remove").click();
      assert.equal(await page.getByTestId("menu-item").count(), 0);
      assert.equal(await page.getByTestId("service-stop").count(), 0);
      assert.equal((await savedPlan(page)).menu.length, 0);
      assert.equal((await savedPlan(page)).stops.length, 0);

      const restored = await freshPage();
      await visit(restored, "/foodtruck");
      await selectLanguage(restored, "en");
      await restored.locator('[data-testid="plan-import"]:enabled').waitFor();
      assert.equal(await restored.getByTestId("menu-item").count(), 0);
      const emptyBeforeImport = await rawPlan(restored);
      await restored.getByTestId("plan-import").setInputFiles(backupPath);
      await restored.getByTestId("import-apply").waitFor();
      await assertPlanUnchanged(
        restored,
        emptyBeforeImport,
        "Import preview before explicit replacement",
      );
      await restored.getByTestId("import-apply").click();
      await restored.getByTestId("menu-item").getByText(menuNames.en, { exact: true }).waitFor();
      const { updatedAt: _savedAt, ...savedContent } = await savedPlan(restored);
      const { updatedAt: _exportedAt, ...exportedContent } = exported;
      assert.deepEqual(savedContent, exportedContent);
      before = await rawPlan(restored);
      const malicious = { ...exported, contactUrl: "javascript:alert('ci-import')" };
      await restored.getByTestId("plan-import").setInputFiles({
        name: "invalid-ci-plan.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(malicious)),
      });
      await restored
        .getByRole("alert")
        .filter({ hasText: /Nothing was saved/ })
        .waitFor();
      await assertPlanUnchanged(restored, before, "Unsafe imported contact URL");
      assert.equal(
        await restored.getByTestId("import-apply").count(),
        0,
        "Invalid import must not expose a replace action",
      );
      // Deterministically finish an older file read after the newer invalid selection.
      // The real file input and parser still run; only the older read's completion is delayed.
      await restored.evaluate(() => {
        const original = File.prototype.text;
        const race = {
          pending: false,
          release: null,
          restore: () => {
            File.prototype.text = original;
          },
        };
        window.__foodtruckImportRace = race;
        File.prototype.text = function () {
          if (this.name !== "slow-ci-plan.json") return original.call(this);
          race.pending = true;
          return new Promise((resolve, reject) => {
            race.release = () => original.call(this).then(resolve, reject);
          });
        };
      });
      try {
        await restored.getByTestId("plan-import").setInputFiles({
          name: "slow-ci-plan.json",
          mimeType: "application/json",
          buffer: Buffer.from(JSON.stringify(exported)),
        });
        await restored.waitForFunction(() => window.__foodtruckImportRace.pending);
        await restored.getByTestId("plan-import").setInputFiles({
          name: "newer-invalid-ci-plan.json",
          mimeType: "application/json",
          buffer: Buffer.from(JSON.stringify(malicious)),
        });
        await restored
          .getByRole("alert")
          .filter({ hasText: /Nothing was saved/ })
          .waitFor();
        await restored.evaluate(async () => {
          await window.__foodtruckImportRace.release();
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
        });
        assert.equal(
          await restored.getByTestId("import-apply").count(),
          0,
          "A superseded file read must not resurrect an old import preview",
        );
        await assertPlanUnchanged(restored, before, "Superseded import file read");
      } finally {
        await restored.evaluate(() => window.__foodtruckImportRace.restore());
      }
      await snapshot(restored, "restored");
      assert.deepEqual(
        result.externalRequests,
        [],
        "Foodtruck operations must not open map/contact services in the background",
      );
      result.checks.push(
        "Actual JSON download round-trips into a fresh context only after explicit replace; removal works; malicious/latest-file import integrity holds; no background handoffs",
      );
      result.export = backupPath;
    },
  );
}

try {
  const { chromium } = await import("playwright");
  browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
    timeout: 30_000,
  });
  await Promise.race([
    (async () => {
      for (const viewport of [
        { width: 1440, height: 1000 },
        { width: 360, height: 800 },
        { width: 390, height: 844 },
        { width: 768, height: 1024 },
      ])
        await localeScenario(viewport);
      for (const viewport of [
        { width: 1440, height: 1000 },
        { width: 390, height: 844 },
      ])
        await foodtruckScenario(viewport);
    })(),
    new Promise((_, reject) => {
      deadline = setTimeout(
        () => reject(new Error("Locale/foodtruck suite exceeded 300 seconds")),
        300_000,
      );
    }),
  ]);
  report.status = report.scenarios.every((entry) => entry.status === "PASS") ? "PASS" : "FAIL";
} catch (error) {
  report.status = "FAIL";
  report.error = String(error?.stack ?? error).slice(0, 8000);
} finally {
  clearTimeout(deadline);
  await browser?.close();
  report.finishedAt = new Date().toISOString();
  await writeReport();
}
console.log(
  JSON.stringify(
    {
      status: report.status,
      report: reportPath,
      scenarios: report.scenarios.map(({ name, status, error }) => ({ name, status, error })),
    },
    null,
    2,
  ),
);
if (report.status !== "PASS") process.exitCode = 1;
