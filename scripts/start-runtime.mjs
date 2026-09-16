#!/usr/bin/env node
import { spawn } from "node:child_process";
import { closeSync, mkdirSync, openSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import {
  dependencyState,
  ensureDependencies,
  ROOT,
  runtimeInfo,
  withRuntimeLock,
} from "./preflight.mjs";
import { checkHttpHealth } from "./verify-runtime.mjs";

const URL = "http://127.0.0.1:8080";
const LOG = join(ROOT, ".runtime/dev.log");
const timeoutMs = Number(process.env.APP_READY_TIMEOUT_MS ?? 60000);
const devHost = process.env.APP_DEV_HOST ?? "0.0.0.0";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function portAvailable() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", (error) => (error.code === "EADDRINUSE" ? resolve(false) : reject(error)));
    server.listen(8080, "0.0.0.0", () => server.close(() => resolve(true)));
  });
}

async function start() {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 300000)
    throw new Error("APP_READY_TIMEOUT_MS must be between 1000 and 300000.");
  if (!["0.0.0.0", "127.0.0.1"].includes(devHost))
    throw new Error("APP_DEV_HOST must be 0.0.0.0 or 127.0.0.1.");
  await withRuntimeLock(ROOT, "startup", async () => {
    const runtime = runtimeInfo();
    if (!(await portAvailable())) {
      await checkHttpHealth(URL);
      const state = await dependencyState(ROOT, runtime);
      if (!state.ready)
        throw new Error(
          "An atelier is running on 8080, but this checkout needs bootstrap. Stop its server before updating dependencies.",
        );
      console.log(
        `[startup] Atelier HTTP check passed on ${URL}; no process was replaced. This does not prove checkout identity or browser correctness.`,
      );
      return;
    }
    await ensureDependencies({ runtime });
    mkdirSync(join(ROOT, ".runtime"), { recursive: true });
    const log = openSync(LOG, "a", 0o600);
    const child = spawn(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["run", "dev", "--", "--host", devHost],
      {
        cwd: ROOT,
        detached: true,
        stdio: ["ignore", log, log],
        env: process.env,
      },
    );
    closeSync(log);
    let failure;
    child.once("error", (error) => {
      failure = error.message;
    });
    child.once("exit", (code, signal) => {
      failure = `npm run dev exited (${signal ?? code})`;
    });
    const onInterrupt = () => {
      failure = "startup cancelled by SIGINT";
    };
    const onTerminate = () => {
      failure = "startup cancelled by SIGTERM";
    };
    process.once("SIGINT", onInterrupt);
    process.once("SIGTERM", onTerminate);
    try {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline && !failure) {
        try {
          await checkHttpHealth(URL, { timeoutMs: 2000 });
          if (failure) break;
          child.unref();
          console.log(`[startup] Ready on ${URL}; log: ${LOG}`);
          return;
        } catch {
          await sleep(250);
        }
      }
      // Signal only the process group created by this invocation, never an
      // arbitrary port owner, saved/reused PID, or another worker's preview.
      if (child.pid && child.exitCode === null && child.signalCode === null) {
        try {
          process.kill(-child.pid, "SIGTERM");
        } catch {
          child.kill("SIGTERM");
        }
        await sleep(1000);
        if (child.exitCode === null && child.signalCode === null) {
          try {
            process.kill(-child.pid, "SIGKILL");
          } catch {
            child.kill("SIGKILL");
          }
        }
      }
      throw new Error(
        `${failure ?? `App did not become healthy within ${timeoutMs} ms`}. See ${LOG}`,
      );
    } finally {
      process.off("SIGINT", onInterrupt);
      process.off("SIGTERM", onTerminate);
    }
  });
}

try {
  await start();
} catch (error) {
  console.error(`[startup] ${error.message}`);
  process.exitCode = 1;
}
