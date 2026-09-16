#!/usr/bin/env node
import { checkNativeDependencies, dependencyState, ROOT, runtimeInfo } from "./preflight.mjs";
import { isMainModule } from "./with-app-env.mjs";

export async function doctor({ root = ROOT, healthUrl } = {}) {
  const runtime = runtimeInfo();
  const state = await dependencyState(root, runtime);
  console.log(
    `[doctor] Node ${runtime.node}, npm ${runtime.npm}, ${runtime.platform}/${runtime.arch}`,
  );
  if (!state.ready)
    throw new Error(
      `Dependencies need bootstrap${state.missing.length ? `; missing or mismatched: ${state.missing.join(", ")}` : ""}. Run npm run bootstrap.`,
    );
  await checkNativeDependencies(root);
  console.log("[doctor] Lockfile, installed versions, install receipt and native imports passed.");
  if (healthUrl) {
    const { checkHttpHealth } = await import("./verify-runtime.mjs");
    await checkHttpHealth(healthUrl);
    console.log(`[doctor] HTTP app check passed at ${healthUrl}`);
  }
  console.log(
    "[doctor] Blender/MCP and connected-device readiness are separate, unverified checks.",
  );
}

if (isMainModule(import.meta.url)) {
  const args = process.argv.slice(2);
  if (!(args.length === 0 || (args.length === 2 && args[0] === "--url"))) {
    console.error("usage: node scripts/doctor.mjs [--url http://127.0.0.1:8080]");
    process.exitCode = 2;
  } else {
    try {
      await doctor({ healthUrl: args[1] });
    } catch (error) {
      console.error(`[doctor] ${error.message}`);
      process.exitCode = 1;
    }
  }
}
