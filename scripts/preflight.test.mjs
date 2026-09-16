import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  dependencyState,
  ensureDependencies,
  validateNode,
  withRuntimeLock,
} from "./preflight.mjs";
import { checkHttpHealth } from "./verify-runtime.mjs";

const runtime = { node: "24.0.0", npm: "11.0.0", platform: "test", arch: "test" };

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "atelier-runtime-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const pkg = { name: "runtime-fixture", dependencies: { fixture: "1.0.0" } };
  const lock = {
    lockfileVersion: 3,
    packages: { "": pkg, "node_modules/fixture": { version: "1.0.0" } },
  };
  await writeFile(join(root, "package.json"), JSON.stringify(pkg));
  await writeFile(join(root, "package-lock.json"), JSON.stringify(lock));
  const install = async () => {
    const current = JSON.parse(await readFile(join(root, "package-lock.json"), "utf8"));
    await mkdir(join(root, "node_modules/fixture"), { recursive: true });
    await writeFile(
      join(root, "node_modules/fixture/package.json"),
      JSON.stringify(current.packages["node_modules/fixture"]),
    );
    await writeFile(join(root, "node_modules/.package-lock.json"), JSON.stringify(current));
  };
  return {
    root,
    pkg,
    lock,
    options: { root, runtime, install, checkNative: async () => {}, announce: () => {} },
  };
}

test("supported runtimes include Node 22.12+ and Node 24; older runtimes fail early", () => {
  for (const version of ["22.12.0", "22.20.0", "v24.1.0"])
    assert.doesNotThrow(() => validateNode(version));
  for (const version of ["20.19.0", "22.11.0", "23.0.0", "invalid"])
    assert.throws(() => validateNode(version), /unsupported/);
});

test("first bootstrap installs; unchanged second run skips; a missing dependency repairs", async (t) => {
  const { root, options } = await fixture(t);
  let installs = 0;
  const install = async () => {
    installs++;
    await options.install();
  };
  assert.equal((await ensureDependencies({ ...options, install })).installed, true);
  assert.equal((await ensureDependencies({ ...options, install })).installed, false);
  await rm(join(root, "node_modules/fixture"), { recursive: true });
  assert.equal((await ensureDependencies({ ...options, install })).installed, true);
  assert.equal(installs, 2);
});

test("lockfile and runtime drift require a new installation", async (t) => {
  const { root, lock, options } = await fixture(t);
  await ensureDependencies(options);
  assert.equal((await dependencyState(root, { ...runtime, arch: "changed" })).ready, false);
  lock.packages["node_modules/fixture"].integrity = "fixture-integrity-change";
  await writeFile(join(root, "package-lock.json"), JSON.stringify(lock));
  assert.equal((await dependencyState(root, runtime)).ready, false);
  assert.equal((await ensureDependencies(options)).installed, true);
});

test("changed dependency declarations fail before installer runs", async (t) => {
  const { root, pkg, options } = await fixture(t);
  pkg.dependencies.fixture = "2.0.0";
  await writeFile(join(root, "package.json"), JSON.stringify(pkg));
  await assert.rejects(
    () => ensureDependencies({ ...options, install: () => assert.fail("must not install") }),
    /differ from package-lock/,
  );
});

test("concurrent bootstraps install exactly once", async (t) => {
  const { options } = await fixture(t);
  let installs = 0;
  const install = async () => {
    installs++;
    await new Promise((resolve) => setTimeout(resolve, 40));
    await options.install();
  };
  const results = await Promise.all([
    ensureDependencies({ ...options, install }),
    ensureDependencies({ ...options, install }),
  ]);
  assert.equal(installs, 1);
  assert.deepEqual(results.map((result) => result.installed).sort(), [false, true]);
});

test("failed installer does not leave a success receipt or block retry", async (t) => {
  const { root, options } = await fixture(t);
  await assert.rejects(
    () =>
      ensureDependencies({
        ...options,
        install: async () => {
          throw new Error("registry unavailable");
        },
      }),
    /registry unavailable/,
  );
  assert.equal((await dependencyState(root, runtime)).ready, false);
  assert.equal((await ensureDependencies(options)).ready, true);
});

test("failed native imports do not mark installation healthy", async (t) => {
  const { root, options } = await fixture(t);
  await assert.rejects(
    () =>
      ensureDependencies({
        ...options,
        checkNative: async () => {
          throw new Error("native binding unavailable");
        },
      }),
    /native binding/,
  );
  assert.equal((await dependencyState(root, runtime)).ready, false);
});

test("inputs changed during install fail without a success receipt", async (t) => {
  const { root, lock, options } = await fixture(t);
  await assert.rejects(
    () =>
      ensureDependencies({
        ...options,
        install: async () => {
          await options.install();
          lock.packages["node_modules/fixture"].integrity = "changed-mid-install";
          await writeFile(join(root, "package-lock.json"), JSON.stringify(lock));
        },
      }),
    /inputs changed/,
  );
  assert.equal((await dependencyState(root, runtime)).ready, false);
});

test("foreign lock is preserved and bounded timeout fails", async (t) => {
  const { root } = await fixture(t);
  const lock = join(root, ".runtime/test.lock");
  await mkdir(lock, { recursive: true });
  await writeFile(
    join(lock, "owner.json"),
    JSON.stringify({ pid: 10, host: "another-host", token: "keep" }),
  );
  await assert.rejects(
    () =>
      withRuntimeLock(root, "test", () => assert.fail("must not enter"), {
        timeoutMs: 1,
        pollMs: 2,
      }),
    /holds/,
  );
  assert.equal(JSON.parse(await readFile(join(lock, "owner.json"), "utf8")).token, "keep");
});

test(
  "SIGTERM waits for the running child and releases the owned lock",
  { timeout: 10000 },
  async (t) => {
    const { root } = await fixture(t);
    const moduleUrl = new URL("./preflight.mjs", import.meta.url).href;
    const source = `
    import { withRuntimeLock, run } from ${JSON.stringify(moduleUrl)};
    try {
      await withRuntimeLock(${JSON.stringify(root)}, "signal", () =>
        run(process.execPath, ["-e", 'console.log("child-ready"); setInterval(() => {}, 1000)'], { root: ${JSON.stringify(root)} }));
    } catch { process.exitCode = 1; }
  `;
    const child = spawn(process.execPath, ["--input-type=module", "-e", source], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    t.after(() => {
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    });
    let signalled = false;
    child.stdout.on("data", (chunk) => {
      if (!signalled && chunk.toString().includes("child-ready")) {
        signalled = true;
        child.kill("SIGTERM");
      }
    });
    const code = await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("exit", resolve);
    });
    assert.equal(signalled, true);
    assert.equal(code, 1);
    await assert.rejects(() => readFile(join(root, ".runtime/signal.lock/owner.json")), {
      code: "ENOENT",
    });
  },
);

test("HTTP readiness rejects redirects, errors and unrelated pages", async () => {
  for (const status of [301, 404, 500]) {
    await assert.rejects(
      () =>
        checkHttpHealth("http://localhost:8080", {
          fetchImpl: async () => new Response("no", { status }),
        }),
      /expected HTTP 200/,
    );
  }
  await assert.rejects(
    () =>
      checkHttpHealth("http://localhost:8080", {
        fetchImpl: async () =>
          new Response("<body>unrelated app</body>", { headers: { "content-type": "text/html" } }),
      }),
    /expected atelier/,
  );
  const result = await checkHttpHealth("http://localhost:8080", {
    fetchImpl: async () =>
      new Response("<title>SIRAWAT × BALL</title><body>ready</body>", {
        headers: { "content-type": "text/html" },
      }),
  });
  assert.equal(result.ok, true);
  await assert.rejects(() => checkHttpHealth("file:///tmp/page.html"), /must be HTTP/);
});
