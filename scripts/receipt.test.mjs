import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createReceipt, verifyReceipt, digest } from "./receipt.mjs";
test("tampered receipt and artifact fail independent digest check", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-receipt-"));
  try {
    writeFileSync(join(root, "proof.txt"), "passed");
    const bytes = Buffer.from(JSON.stringify(createReceipt(root, ["proof.txt"])));
    const hash = digest(bytes);
    assert.equal(verifyReceipt(root, bytes, hash), true);
    assert.throws(
      () => verifyReceipt(root, Buffer.concat([bytes, Buffer.from(" ")]), hash),
      /Receipt bytes changed/,
    );
    writeFileSync(join(root, "proof.txt"), "modified");
    assert.throws(() => verifyReceipt(root, bytes, hash), /Evidence changed/);
    assert.throws(() => createReceipt(root, ["../escape"]), /escapes root/);
    assert.throws(() => createReceipt(root, ["proof.txt", "proof.txt"]), /unique/);
    symlinkSync("/etc/hosts", join(root, "outside"));
    assert.throws(() => createReceipt(root, ["outside"]), /Symlink/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
