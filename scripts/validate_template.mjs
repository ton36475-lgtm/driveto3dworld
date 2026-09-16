import { readFileSync } from "node:fs";
import { validateConfig } from "../src/lib/forge/config.mjs";
try {
  if (!process.argv[2]) throw new Error("Usage: node scripts/validate_template.mjs <config.json>");
  const errors = validateConfig(JSON.parse(readFileSync(process.argv[2], "utf8")));
  if (errors.length) throw new Error(`Invalid template: ${errors.join(", ")}`);
  console.log("Template valid");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
