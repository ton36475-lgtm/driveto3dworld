#!/usr/bin/env node
import { isMainModule } from "./with-app-env.mjs";

export const APP_TITLE = "SIRAWAT × BALL";

export async function checkHttpHealth(
  base,
  { paths = ["/"], timeoutMs = 5000, fetchImpl = fetch } = {},
) {
  const url = new URL(base);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("Health URL must be HTTP(S), without credentials.");
  }
  for (const path of paths) {
    const response = await fetchImpl(new URL(path, url), {
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.status !== 200)
      throw new Error(`${path}: expected HTTP 200, received ${response.status}.`);
    const type = response.headers.get("content-type") ?? "";
    const html = await response.text();
    if (!type.includes("text/html") || !html.includes(APP_TITLE) || !/<body[\s>]/i.test(html)) {
      throw new Error(`${path}: response is not the expected atelier HTML.`);
    }
  }
  return { ok: true, paths };
}

if (isMainModule(import.meta.url)) {
  const [url = "http://127.0.0.1:8080", ...paths] = process.argv.slice(2);
  try {
    const result = await checkHttpHealth(url, {
      paths: paths.length ? paths : ["/", "/gallery", "/drive", "/studio", "/contact"],
    });
    console.log(`[verify-runtime] HTTP 200 and app HTML verified: ${result.paths.join(", ")}`);
    console.log(
      "[verify-runtime] Browser interactions, WebGL and production parity require browser verification.",
    );
  } catch (error) {
    console.error(`[verify-runtime] ${error.message}`);
    process.exitCode = 1;
  }
}
