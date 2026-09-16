import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { promisify } from "node:util";
import {
  APP_ENV_REL_PATH,
  mergeAppEnv,
  parseAppEnv,
  projectRoot,
  readAppEnv,
} from "./with-app-env.mjs";

const execFileAsync = promisify(execFile);
const WRAPPER = join(projectRoot(), "scripts/with-app-env.mjs");
const PRINT_FLAG = "process.stdout.write(String(process.env.VITE_AUTH_ENABLED));";
const temporaryRoots = [];
after(() => {
  for (const root of temporaryRoots) rmSync(root, { recursive: true, force: true });
});

function cleanEnv() {
  const env = { ...process.env };
  delete env.VITE_AUTH_ENABLED;
  return env;
}

function makeWorkspace(appEnvJson) {
  const root = mkdtempSync(join(tmpdir(), "app-env-"));
  temporaryRoots.push(root);
  if (appEnvJson !== undefined) {
    mkdirSync(join(root, ".grok"), { recursive: true });
    writeFileSync(join(root, APP_ENV_REL_PATH), appEnvJson);
  }
  return root;
}

function makeWrapper(appEnvJson) {
  const root = makeWorkspace(appEnvJson);
  mkdirSync(join(root, "scripts"));
  const wrapper = join(root, "scripts/with-app-env.mjs");
  copyFileSync(WRAPPER, wrapper);
  return { root, wrapper };
}

test("keeps VITE_-prefixed string entries", () => {
  assert.deepEqual(parseAppEnv('{"VITE_AUTH_ENABLED":"false"}'), {
    VITE_AUTH_ENABLED: "false",
  });
});

test("drops non-VITE keys, non-string values and malformed documents", () => {
  assert.deepEqual(parseAppEnv('{"DATABASE_URL":"postgres://x","VITE_N":1,"VITE_OK":"y"}'), {
    VITE_OK: "y",
  });
  assert.deepEqual(parseAppEnv("not json"), {});
  assert.deepEqual(parseAppEnv('["VITE_AUTH_ENABLED"]'), {});
  assert.deepEqual(parseAppEnv("null"), {});
});

test("a missing app-env.json retains the repository's auth-off default", () => {
  assert.deepEqual(readAppEnv(makeWorkspace()), { VITE_AUTH_ENABLED: "false" });
});

test("optional local build flags override repository defaults", () => {
  const root = makeWorkspace('{"VITE_AUTH_ENABLED":"true","VITE_THEME":"ink"}');
  assert.deepEqual(readAppEnv(root), { VITE_AUTH_ENABLED: "true", VITE_THEME: "ink" });
});

test("invalid local configuration cannot remove the repository default", () => {
  for (const raw of ["not json", "null", '{"VITE_AUTH_ENABLED":true,"DATABASE_URL":"ignored"}']) {
    assert.deepEqual(readAppEnv(makeWorkspace(raw)), { VITE_AUTH_ENABLED: "false" });
  }
});

test("an explicit process-env override wins over the file", () => {
  const merged = mergeAppEnv(
    { VITE_AUTH_ENABLED: "false" },
    { VITE_AUTH_ENABLED: "true", PATH: "/usr/bin" },
  );
  assert.equal(merged.VITE_AUTH_ENABLED, "true");
  assert.equal(merged.PATH, "/usr/bin");
});

test("the documented public environment example disables auth", () => {
  const example = JSON.parse(
    readFileSync(join(projectRoot(), "docs/runtime-environment.example.json"), "utf8"),
  );
  assert.deepEqual(example, { VITE_AUTH_ENABLED: "false" });
});

test("vite loadEnv resolves the wrapped value", () => {
  // What `import.meta.env.VITE_AUTH_ENABLED` becomes: loadEnv prefix-matches
  // process.env, so the wrapper's merge has to land before Vite starts.
  // Do not `import { loadEnv } from "vite"` here — Vite 8 loads rolldown
  // native bindings that SIGSEGV the test worker under qemu-user.
  const root = makeWorkspace('{"VITE_AUTH_ENABLED":"false"}');
  const merged = mergeAppEnv(readAppEnv(root), { PATH: "/usr/bin" });
  assert.equal(merged.VITE_AUTH_ENABLED, "false");
});

test("the wrapped command runs with the app env applied", async () => {
  const { wrapper } = makeWrapper('{"VITE_AUTH_ENABLED":"true"}');
  const { stdout } = await execFileAsync(
    process.execPath,
    [wrapper, process.execPath, "-e", PRINT_FLAG],
    { env: cleanEnv() },
  );
  assert.equal(stdout, "true");
});

test("a fresh checkout starts the wrapped command with auth off without local files", async () => {
  const { wrapper } = makeWrapper();
  const { stdout } = await execFileAsync(
    process.execPath,
    [wrapper, process.execPath, "-e", PRINT_FLAG],
    { env: cleanEnv(), cwd: makeWorkspace() },
  );
  assert.equal(stdout, "false");
});

test("the wrapped command sees an explicit override, not the file value", async () => {
  const { wrapper } = makeWrapper('{"VITE_AUTH_ENABLED":"false"}');
  const { stdout } = await execFileAsync(
    process.execPath,
    [wrapper, process.execPath, "-e", PRINT_FLAG],
    { env: { ...process.env, VITE_AUTH_ENABLED: "true" } },
  );
  assert.equal(stdout, "true");
});

test("the wrapper propagates the command's exit code", async () => {
  await assert.rejects(
    execFileAsync(process.execPath, [WRAPPER, process.execPath, "-e", "process.exit(3)"]),
    (err) => err.code === 3,
  );
});

test("a signal-killed command is never reported as success", async () => {
  // The wrapper's own SIGTERM handler must not swallow the re-raised signal:
  // a cancelled build reporting exit 0 is a silently passing gate.
  await assert.rejects(
    execFileAsync(process.execPath, [
      WRAPPER,
      process.execPath,
      "-e",
      "process.kill(process.pid, 'SIGTERM');setTimeout(() => {}, 1000);",
    ]),
    (err) => err.signal === "SIGTERM" || err.code !== 0,
  );
});

test("the CLI still runs when invoked through a symlinked path", async () => {
  // node realpaths import.meta.url but not process.argv[1], so a raw comparison
  // turns the wrapper into a no-op that exits 0 without starting anything.
  const { root } = makeWrapper();
  const link = join(makeWorkspace(), "scripts");
  symlinkSync(join(root, "scripts"), link);
  const { stdout } = await execFileAsync(
    process.execPath,
    [join(link, "with-app-env.mjs"), process.execPath, "-e", PRINT_FLAG],
    { env: cleanEnv() },
  );
  assert.equal(stdout, "false");
});
