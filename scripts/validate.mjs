// Runs the Khronos glTF validator over every model (or those whose path contains the argument).
// Fails on any error or warning; infos (e.g. empty anchor nodes) are allowed.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import validator from 'gltf-validator';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'models');
const filter = process.argv[2] ?? '';
const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.glb') && files.push(p); } };
walk(root);
let bad = 0, n = 0;
for (const f of files.filter((p) => relative(root, p).includes(filter))) {
  const r = await validator.validateBytes(new Uint8Array(readFileSync(f)));
  n++;
  const { numErrors, numWarnings } = r.issues;
  if (numErrors || numWarnings) {
    bad++;
    console.log(`${relative(root, f)}: ${numErrors} errors, ${numWarnings} warnings`);
    for (const m of r.issues.messages.filter((m) => m.severity < 2)) console.log(`  ${m.code} ${m.pointer ?? ''} ${m.message}`);
  }
}
console.log(`${n} files validated, ${bad} with errors or warnings`);
process.exit(bad ? 1 : 0);
