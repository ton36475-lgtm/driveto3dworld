// Optional full-spec validation. Install a pinned gltf-validator in a tooling
// directory and expose it through NODE_PATH; it is not a website dependency.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const validator = createRequire(import.meta.url)('gltf-validator');
const directoryName = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const directory = path.resolve(process.argv[2] || path.join(directoryName, '../public/models'));
  const reports = [];
  for (const filename of ['work-frame.glb', 'monogram.glb', 'plinth.glb']) {
    const bytes = fs.readFileSync(path.join(directory, filename));
    const report = await validator.validateBytes(new Uint8Array(bytes), {uri: filename, maxIssues: 100});
    reports.push({filename, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), report});
  }
  const errors = reports.reduce((n, item) => n + item.report.issues.numErrors, 0);
  const warnings = reports.reduce((n, item) => n + item.report.issues.numWarnings, 0);
  const result = {validator: validator.version(), status: errors === 0 ? 'PASS' : 'FAIL', errors, warnings, reports};
  const output = process.argv[3];
  if (output) fs.writeFileSync(path.resolve(output), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({validator: result.validator, status: result.status, errors, warnings}));
  process.exitCode = errors === 0 ? 0 : 1;
})().catch(error => {console.error(error); process.exitCode = 1;});
