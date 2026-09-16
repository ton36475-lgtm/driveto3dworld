// Install pinned gltf-validator in a separate tool directory; website has no new dependency.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const validator = createRequire(import.meta.url)('gltf-validator');
const directory = path.dirname(fileURLToPath(import.meta.url));
const model = path.resolve(process.argv[2] || path.join(directory, '../public/models/foodtruck-body.glb'));
const output = process.argv[3];
try {
  const bytes = fs.readFileSync(model);
  const report = await validator.validateBytes(new Uint8Array(bytes), { uri: 'foodtruck-body.glb', maxIssues: 100 });
  const result = {
    filename: 'foodtruck-body.glb', validator: validator.version(),
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    status: report.issues.numErrors === 0 ? 'PASS' : 'FAIL', report,
  };
  if (output) fs.writeFileSync(path.resolve(output), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ status: result.status, errors: report.issues.numErrors, warnings: report.issues.numWarnings }));
  process.exitCode = result.status === 'PASS' ? 0 : 1;
} catch(error) {
  console.error(error);
  process.exitCode = 1;
}
