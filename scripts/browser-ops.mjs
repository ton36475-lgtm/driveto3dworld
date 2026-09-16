#!/usr/bin/env node
/**
 * GitHub Actions only. Exercises the rendered local-operations UI in fresh profiles.
 * Usage: node scripts/browser-ops.mjs http://127.0.0.1:8080
 * Evidence: screenshots/browser-ops.json and synthetic download/screenshot fixtures.
 */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Do not initialize Playwright or a browser in a local/cloud-browser work session.
if (process.env.GITHUB_ACTIONS !== "true" || process.env.CI !== "true") {
  console.error("browser-ops runs only in GitHub Actions (GITHUB_ACTIONS=true and CI=true).");
  process.exit(1);
}

const outputDirectory = fileURLToPath(new URL("../screenshots/", import.meta.url));
const outputFile = join(outputDirectory, "browser-ops.json");
await mkdir(outputDirectory, { recursive: true });
const report = {
  suite: "local-operations-ui",
  status: "running",
  startedAt: new Date().toISOString(),
  origin: null,
  scenarios: [],
  error: null,
};
let browser;
let deadline;

async function writeReport() {
  await writeFile(outputFile, `${JSON.stringify(report, null, 2)}\n`);
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

async function visit(page, origin, path, heading) {
  const response = await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
  assert.ok(response?.ok(), `${path} returned HTTP ${response?.status() ?? "no response"}`);
  await page.getByRole("heading", { name: heading, exact: true }).waitFor({ state: "visible" });
}

async function persistedState(page) {
  // Read-only observation supplements the visible flow; all mutations use real controls.
  const raw = await page.evaluate(() => window.localStorage.getItem("sxb-ops"));
  assert.ok(raw, "The form must write its local receipt before reporting success.");
  return JSON.parse(raw).state;
}

async function completeFormWithKeyboard(page, inquiry) {
  await page.locator('form button[type="submit"]:enabled').waitFor({ state: "visible" });
  const name = page.getByRole("textbox", { name: "Name", exact: true });
  await name.focus();
  await name.pressSequentially(inquiry.name);
  await name.press("Tab");
  const channel = page.getByRole("combobox", { name: "Reply channel", exact: true });
  assert.ok(
    await channel.evaluate((element) => element === document.activeElement),
    "Name must tab to the reply channel.",
  );
  await channel.selectOption("email");
  await channel.press("Tab");
  const handle = page.getByRole("textbox", { name: "LINE ID / email / phone", exact: true });
  assert.ok(
    await handle.evaluate((element) => element === document.activeElement),
    "Channel must tab to the contact field.",
  );
  await handle.fill(inquiry.handle);
  await page.getByRole("combobox", { name: "Project type", exact: true }).selectOption("three");
  const message = page.getByRole("textbox", { name: "Message", exact: true });
  await message.fill(inquiry.message);
  await message.press("Tab");
  const save = page.getByRole("button", { name: "Save brief on this device", exact: true });
  assert.ok(
    await save.evaluate((element) => element === document.activeElement),
    "Message must tab to Save.",
  );
  await save.press("Enter");
  await page
    .getByRole("heading", { name: "Saved on this device.", exact: true })
    .waitFor({ state: "visible" });
  const receipt = page.locator("main").getByRole("status");
  assert.match(await receipt.innerText(), /Your brief has not been sent\./);
  assert.equal(
    await receipt.getByText(/^(Sent|Delivered|Received)[.!]?$/i).count(),
    0,
    "A local save must not claim external delivery.",
  );
  await page
    .getByRole("button", { name: "Download brief", exact: true })
    .waitFor({ state: "visible" });
}

function inquiryCard(page, name) {
  return page
    .locator("main")
    .getByRole("listitem")
    .filter({ has: page.getByText(name, { exact: true }) });
}

async function scenario(origin, viewport) {
  const result = {
    name: viewport.name,
    viewport: { width: viewport.width, height: viewport.height },
    status: "running",
    checks: [],
    screenshots: [],
    pageErrors: [],
    mutationRequests: [],
    error: null,
  };
  report.scenarios.push(result);
  const contexts = [];
  let lastPage;
  async function freshPage() {
    const context = await browser.newContext({
      viewport: result.viewport,
      locale: "en-GB",
      acceptDownloads: true,
    });
    contexts.push(context);
    const page = await context.newPage();
    lastPage = page;
    page.setDefaultTimeout(12000);
    page.setDefaultNavigationTimeout(25000);
    page.on("pageerror", (error) => result.pageErrors.push(error.message));
    page.on("request", (request) => {
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
        const target = new URL(request.url());
        result.mutationRequests.push({
          method: request.method(),
          path: target.pathname,
          sameOrigin: target.origin === origin,
        });
      }
    });
    return page;
  }
  async function snapshot(page, label) {
    const filename = `ops-${viewport.name}-${label}.png`;
    await page.screenshot({ path: join(outputDirectory, filename), fullPage: true });
    result.screenshots.push(filename);
  }
  try {
    const page = await freshPage();
    const inquiry = {
      name: `CI ${viewport.name} enquiry`,
      handle: `ops-${viewport.name}@example.test`,
      message:
        "Synthetic regression brief: create a 3D music portfolio. No external delivery requested.",
    };
    await visit(page, origin, "/contact", "Prepare your brief.");
    await completeFormWithKeyboard(page, inquiry);
    let state = await persistedState(page);
    assert.equal(state.inquiries.length, 1);
    assert.equal(state.jobs.length, 2);
    assert.equal(state.inquiries[0].name, inquiry.name);
    assert.equal(state.inquiries[0].message, inquiry.message);
    result.checks.push("keyboard form save and truthful local receipt");

    const briefDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download brief", exact: true }).click();
    const brief = await briefDownload;
    assert.equal(brief.suggestedFilename(), "sirawat-ball-brief.txt");
    const briefPath = join(outputDirectory, `ops-${viewport.name}-brief.txt`);
    await brief.saveAs(briefPath);
    const briefText = await readFile(briefPath, "utf8");
    assert.ok(
      briefText.includes(inquiry.name) &&
        briefText.includes(inquiry.handle) &&
        briefText.includes(inquiry.message),
    );
    result.checks.push("manual handoff download contains the entered brief");
    await snapshot(page, "saved");
    if (viewport.name === "mobile") {
      assert.deepEqual(result.pageErrors, [], "Mobile save must not produce uncaught errors.");
      assert.deepEqual(result.mutationRequests, [], "Mobile save must stay local.");
      result.checks.push("no uncaught page errors or network mutation requests");
      result.status = "passed";
      return;
    }

    await page.getByRole("button", { name: "Prepare another brief", exact: true }).click();
    await completeFormWithKeyboard(page, inquiry);
    state = await persistedState(page);
    assert.equal(state.inquiries.length, 1, "Repeated submission must reuse the local receipt.");
    assert.equal(state.jobs.length, 2, "Repeated submission must not duplicate reminders.");
    result.checks.push("duplicate submission creates no duplicate inquiry or jobs");

    await page.getByRole("link", { name: "Open local desk", exact: true }).click();
    await page
      .getByRole("heading", { name: "The desk.", exact: true })
      .waitFor({ state: "visible" });
    await page.getByText(inquiry.name, { exact: true }).waitFor({ state: "visible" });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText(inquiry.name, { exact: true }).waitFor({ state: "visible" });
    const card = inquiryCard(page, inquiry.name);
    assert.equal(await card.count(), 1);
    assert.ok((await card.innerText()).includes(inquiry.message));
    result.checks.push("contact-to-desk navigation and persisted reload");

    await card.getByRole("combobox", { name: "Assignee", exact: true }).selectOption("Ball");
    await card.getByRole("button", { name: "Assign", exact: true }).click();
    await card.getByRole("button", { name: "Mark quote prepared", exact: true }).click();
    await card.getByText("Quote prepared", { exact: true }).waitFor({ state: "visible" });
    state = await persistedState(page);
    assert.equal(state.inquiries[0].status, "quoted");
    assert.equal(state.inquiries[0].assignee, "Ball");
    assert.equal(state.jobs.filter((job) => job.kind === "quote_followup").length, 1);
    result.checks.push("local assign and quote-prepared transitions");
    await snapshot(page, "desk");

    const backupDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download local backup", exact: true }).click();
    const backup = await backupDownload;
    assert.equal(backup.suggestedFilename(), "sirawat-ball-local-backup.json");
    const backupPath = join(outputDirectory, `ops-${viewport.name}-backup.json`);
    await backup.saveAs(backupPath);
    const exported = JSON.parse(await readFile(backupPath, "utf8"));
    assert.equal(exported.format, "sxb-ops-backup");
    assert.deepEqual(exported.state, state);

    const restored = await freshPage();
    await visit(restored, origin, "/desk", "The desk.");
    await restored
      .getByText("No enquiries in this view. The contact form writes here.", { exact: true })
      .waitFor({ state: "visible" });
    await restored.locator('input[type="file"]:enabled').waitFor({ state: "visible" });
    await restored.getByLabel("Restore backup", { exact: true }).setInputFiles(backupPath);
    await restored
      .getByText("Backup restored on this device.", { exact: true })
      .waitFor({ state: "visible" });
    await restored.getByText(inquiry.name, { exact: true }).waitFor({ state: "visible" });
    assert.deepEqual(await persistedState(restored), exported.state);
    await restored.reload({ waitUntil: "domcontentloaded" });
    await restored.getByText(inquiry.name, { exact: true }).waitFor({ state: "visible" });
    await inquiryCard(restored, inquiry.name)
      .getByText("Quote prepared", { exact: true })
      .waitFor({ state: "visible" });
    assert.deepEqual(await persistedState(restored), exported.state);
    result.checks.push("real backup download, restore into fresh profile, and restored reload");
    await snapshot(restored, "restored");
    assert.deepEqual(result.pageErrors, [], "Operations must not produce uncaught page errors.");
    assert.deepEqual(
      result.mutationRequests,
      [],
      "Local operations must not issue external/server mutations.",
    );
    result.checks.push("no uncaught page errors or network mutation requests");
    result.status = "passed";
  } catch (error) {
    result.status = "failed";
    result.error = String(error?.stack || error);
    if (lastPage && !lastPage.isClosed()) {
      await snapshot(lastPage, "failure").catch(() => {});
    }
    throw error;
  } finally {
    await Promise.allSettled(contexts.map((context) => context.close()));
    await writeReport();
  }
}

try {
  assert.equal(process.argv.length, 3, "Usage: node scripts/browser-ops.mjs http://127.0.0.1:8080");
  report.origin = localOrigin(process.argv[2]);
  const { chromium } = await import("playwright");
  browser = await chromium.launch({ headless: true, timeout: 30000 });
  const flow = async () => {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 900 },
      { name: "mobile", width: 390, height: 844 },
    ])
      await scenario(report.origin, viewport);
  };
  await Promise.race([
    flow(),
    new Promise((_, reject) => {
      deadline = setTimeout(
        () => reject(new Error("Operations UI suite exceeded 180 seconds.")),
        180000,
      );
    }),
  ]);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = String(error?.stack || error);
  process.exitCode = 1;
} finally {
  clearTimeout(deadline);
  await browser?.close();
  report.finishedAt = new Date().toISOString();
  await writeReport();
  console.log(
    JSON.stringify({
      status: report.status,
      evidence: outputFile,
      scenarios: report.scenarios.map(({ name, status }) => ({ name, status })),
    }),
  );
}
