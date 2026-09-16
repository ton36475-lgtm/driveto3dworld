import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, lstatSync, realpathSync } from "node:fs";
import { resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
export function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
function guarded(root, name) {
  if (typeof name !== "string" || !name || isAbsolute(name))
    throw new Error("Invalid relative evidence path");
  const path = resolve(root, name),
    rel = relative(root, path);
  if (rel === ".." || rel.startsWith("../") || rel.startsWith("..\\") || isAbsolute(rel))
    throw new Error("Evidence path escapes root");
  if (lstatSync(path).isSymbolicLink()) throw new Error("Symlink evidence is not allowed");
  const real = realpathSync(path),
    realRel = relative(root, real);
  if (realRel === ".." || realRel.startsWith("../") || isAbsolute(realRel))
    throw new Error("Evidence symlink escapes root");
  return real;
}
export function createReceipt(root, paths) {
  root = realpathSync(root);
  if (!paths.length || new Set(paths).size !== paths.length)
    throw new Error("Evidence files must be nonempty and unique");
  return {
    version: 1,
    kind: "sha256-integrity-manifest",
    status: "CHECK_PENDING_INDEPENDENT_REVIEW",
    productionReady: false,
    files: paths.map((path) => ({ path, sha256: digest(readFileSync(guarded(root, path))) })),
  };
}
export function verifyReceipt(root, bytes, trustedDigest) {
  if (!/^[a-f0-9]{64}$/.test(trustedDigest) || digest(bytes) !== trustedDigest)
    throw new Error("Receipt bytes changed");
  const receipt = JSON.parse(bytes.toString("utf8"));
  if (receipt.version !== 1 || !Array.isArray(receipt.files) || !receipt.files.length)
    throw new Error("Invalid receipt");
  root = realpathSync(root);
  const seen = new Set();
  for (const file of receipt.files) {
    if (seen.has(file.path)) throw new Error("Duplicate evidence path");
    seen.add(file.path);
    if (digest(readFileSync(guarded(root, file.path))) !== file.sha256)
      throw new Error(`Evidence changed: ${file.path}`);
  }
  return true;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [action, root, out, ...args] = process.argv.slice(2);
    if (action === "create") {
      const bytes = Buffer.from(JSON.stringify(createReceipt(root, args), null, 2) + "\n");
      writeFileSync(out, bytes);
      console.log(digest(bytes));
    } else if (action === "verify") {
      verifyReceipt(root, readFileSync(out), args[0]);
      console.log("Receipt and evidence bytes match");
    } else
      throw new Error(
        "Usage: receipt.mjs create ROOT OUT FILE... | verify ROOT RECEIPT TRUSTED_SHA256",
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
