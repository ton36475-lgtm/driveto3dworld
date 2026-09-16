#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { access, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { hostname } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isMainModule } from "./with-app-env.mjs";

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const STAMP = "node_modules/.sirinx-runtime.json";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

export function validateNode(version) {
  const [major, minor] = version.replace(/^v/, "").split(".").map(Number);
  if (!((major === 22 && minor >= 12) || major === 24)) {
    throw new Error(`Node ${version} is unsupported. Install Node 24 LTS or Node 22.12+ (22.x).`);
  }
}

export function runtimeInfo() {
  validateNode(process.versions.node);
  const result = spawnSync(npmCommand, ["--version"], { encoding: "utf8", timeout: 15000 });
  const npm = result.stdout?.trim();
  if (result.status !== 0 || !/^\d+\.\d+\.\d+/.test(npm ?? "")) {
    throw new Error("npm is unavailable. Install Node with npm and ensure both are on PATH.");
  }
  if (Number(npm.split(".")[0]) < 10)
    throw new Error(`npm ${npm} is unsupported; use npm 10 or newer.`);
  return { node: process.versions.node, npm, platform: process.platform, arch: process.arch };
}

export async function dependencyState(root, runtime) {
  let packageText, lockText;
  try {
    [packageText, lockText] = await Promise.all([
      readFile(join(root, "package.json"), "utf8"),
      readFile(join(root, "package-lock.json"), "utf8"),
    ]);
  } catch (error) {
    throw new Error(`Required package.json/package-lock.json is unavailable: ${error.code}`);
  }
  const manifest = JSON.parse(packageText);
  const lock = JSON.parse(lockText);
  if (lock.lockfileVersion < 2 || !lock.packages?.[""])
    throw new Error("A committed npm lockfile v2 or newer is required.");
  // Scripts and documentation edits do not justify an installation. Dependency
  // declarations and npm's installed lock still do: no unlocked npm install.
  const declarations = (pkg) => ({
    dependencies: pkg.dependencies ?? {},
    devDependencies: pkg.devDependencies ?? {},
    optionalDependencies: pkg.optionalDependencies ?? {},
  });
  if (JSON.stringify(declarations(manifest)) !== JSON.stringify(declarations(lock.packages[""]))) {
    throw new Error(
      "package.json dependency declarations differ from package-lock.json. Review and commit a matching lockfile first.",
    );
  }
  const fingerprint = hash(
    JSON.stringify({
      lock: hash(lockText),
      declarations: declarations(manifest),
      overrides: manifest.overrides ?? {},
      runtime,
      policy: "npm-ci-ignore-scripts-v1",
    }),
  );
  const missing = [];
  for (const name of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) {
    try {
      const installed = JSON.parse(
        await readFile(join(root, "node_modules", name, "package.json"), "utf8"),
      );
      if (installed.version !== lock.packages[`node_modules/${name}`]?.version) missing.push(name);
    } catch {
      missing.push(name);
    }
  }
  let installedLock = null;
  try {
    installedLock = hash(await readFile(join(root, "node_modules/.package-lock.json")));
  } catch {
    /* fresh checkout */
  }
  let stamp = null;
  try {
    stamp = JSON.parse(await readFile(join(root, STAMP), "utf8"));
  } catch {
    /* not bootstrapped */
  }
  const ready =
    missing.length === 0 &&
    installedLock !== null &&
    stamp?.fingerprint === fingerprint &&
    stamp?.installedLock === installedLock;
  return { fingerprint, installedLock, missing, ready, runtime };
}

function alive(pid) {
  if (!Number.isInteger(pid) || pid <= 1) return true;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code !== "ESRCH";
  }
}

/** A single writer per checkout. Ambiguous/foreign locks fail without deletion. */
export async function withRuntimeLock(
  root,
  name,
  action,
  { timeoutMs = 300000, pollMs = 200 } = {},
) {
  const directory = join(root, ".runtime");
  const lock = join(directory, `${name}.lock`);
  await mkdir(directory, { recursive: true });
  const owner = {
    pid: process.pid,
    host: hostname(),
    token: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      await mkdir(lock);
      await writeFile(join(lock, "owner.json"), JSON.stringify(owner));
      break;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      // A missing owner file may be a writer between mkdir and write. Do not
      // remove locks automatically: two reclaimers could delete a new owner.
      try {
        const previous = JSON.parse(await readFile(join(lock, "owner.json"), "utf8"));
        if (previous.host === hostname() && !alive(previous.pid)) {
          const staleError = new Error(
            `Stale runtime lock at ${lock} (owner PID ${previous.pid} has exited). Verify no install is active, then remove this lock directory and retry.`,
          );
          staleError.code = "STALE_RUNTIME_LOCK";
          throw staleError;
        }
      } catch (readError) {
        if (readError.code === "STALE_RUNTIME_LOCK") throw readError;
        // Concurrent release or unreadable lock: wait.
      }
      if (Date.now() >= deadline)
        throw new Error(
          `Another runtime operation holds ${lock}. Verify its owner before removing a stale lock.`,
        );
      await sleep(pollMs);
    }
  }
  // Keep the parent alive while run() forwards cancellation to its child and
  // waits for exit, so finally can release the owned lock. SIGKILL/power loss
  // remains a manual recovery case; never unlock while an installer is alive.
  let interrupted = null;
  const onInterrupt = () => {
    interrupted = "SIGINT";
  };
  const onTerminate = () => {
    interrupted = "SIGTERM";
  };
  process.on("SIGINT", onInterrupt);
  process.on("SIGTERM", onTerminate);
  try {
    const result = await action();
    if (interrupted) throw new Error(`Runtime operation cancelled by ${interrupted}.`);
    return result;
  } finally {
    try {
      const current = JSON.parse(await readFile(join(lock, "owner.json"), "utf8"));
      if (current.token === owner.token) await rm(lock, { recursive: true, force: true });
    } finally {
      process.off("SIGINT", onInterrupt);
      process.off("SIGTERM", onTerminate);
    }
  }
}

export function run(command, args, { root = ROOT, capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    });
    let output = "";
    if (capture) {
      child.stdout.on("data", (chunk) => {
        output += chunk;
      });
      child.stderr.on("data", (chunk) => {
        output += chunk;
      });
    }
    const onInterrupt = () => child.kill("SIGINT");
    const onTerminate = () => child.kill("SIGTERM");
    process.once("SIGINT", onInterrupt);
    process.once("SIGTERM", onTerminate);
    const cleanup = () => {
      process.off("SIGINT", onInterrupt);
      process.off("SIGTERM", onTerminate);
    };
    child.once("error", (error) => {
      cleanup();
      reject(new Error(`Cannot run ${command}: ${error.message}`));
    });
    child.once("exit", (code, signal) => {
      cleanup();
      if (code === 0) resolve(output.trim());
      else
        reject(
          new Error(
            `${command} ${args[0]} failed (${signal ?? `exit ${code}`}).${capture ? ` ${output.slice(-1500)}` : " See the command output above."}`,
          ),
        );
    });
  });
}

export async function checkNativeDependencies(root) {
  // These imports actually load the platform-specific rolldown, lightningcss
  // and Tailwind bindings. Optional packages from the lockfile suffice; no
  // dependency lifecycle script is enabled by this tool.
  try {
    await run(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        'await import("vite"); await import("@tailwindcss/vite"); await import("lightningcss");',
      ],
      { root, capture: true },
    );
    await access(join(root, "node_modules/.bin/vite"));
    await access(join(root, "node_modules/.bin/tsc"));
  } catch (error) {
    throw new Error(
      `Native dependency check failed: ${error.message} Review the lockfile's optional packages for this OS/architecture. Do not enable all install scripts as a workaround.`,
    );
  }
}

export async function ensureDependencies({
  root = ROOT,
  runtime = runtimeInfo(),
  install,
  checkNative = checkNativeDependencies,
  announce = console.log,
} = {}) {
  return withRuntimeLock(root, "dependencies", async () => {
    const before = await dependencyState(root, runtime);
    if (before.ready) {
      await checkNative(root);
      announce("[preflight] Dependencies match the lockfile and runtime; installation skipped.");
      return { installed: false, ...before };
    }
    announce("[preflight] Installing reviewed lockfile dependencies (lifecycle scripts disabled).");
    await rm(join(root, STAMP), { force: true });
    if (install) await install(root);
    else
      await run(
        npmCommand,
        [
          "ci",
          "--ignore-scripts",
          "--include=dev",
          "--include=optional",
          "--no-audit",
          "--no-fund",
        ],
        { root },
      );
    const after = await dependencyState(root, runtime);
    if (after.fingerprint !== before.fingerprint)
      throw new Error(
        "Dependency inputs changed during installation. Retry preflight after concurrent edits finish.",
      );
    if (after.missing.length || !after.installedLock)
      throw new Error(
        `Installation is incomplete: ${after.missing.join(", ") || "npm installed lock missing"}.`,
      );
    await checkNative(root);
    const temp = join(root, `${STAMP}.${process.pid}.tmp`);
    await writeFile(
      temp,
      JSON.stringify(
        {
          fingerprint: after.fingerprint,
          installedLock: after.installedLock,
          runtime,
          verifiedAt: new Date().toISOString(),
        },
        null,
        2,
      ) + "\n",
    );
    await rename(temp, join(root, STAMP));
    announce("[preflight] Dependency and native checks passed.");
    return { ...after, installed: true, ready: true };
  });
}

if (isMainModule(import.meta.url)) {
  if (process.argv.length > 2) {
    console.error("usage: node scripts/preflight.mjs");
    process.exitCode = 2;
  } else {
    try {
      await ensureDependencies();
    } catch (error) {
      console.error(`[preflight] ${error.message}`);
      process.exitCode = 1;
    }
  }
}
