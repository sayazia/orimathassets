// Builds every asset into models/<category>/<name>.glb plus models/manifest.json.
// Optional argument: a name prefix to rebuild only matching assets (e.g. `npm run build -- house_`).
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSETS } from './assets/index.mjs';
import { Model } from './lib/geom.mjs';
import { toGLB } from './lib/glb.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'models');
const filter = process.argv[2] ?? '';

const names = new Set();
for (const { name } of ASSETS) {
  if (names.has(name)) throw new Error(`duplicate asset name ${name}`);
  names.add(name);
}

const manifest = [];
for (const { name, category, sheet, footprint, build } of ASSETS) {
  const file = `${category}/${name}.glb`;
  const m = new Model(name);
  build(m);
  let tris = 0;
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const pos of m.groups.values()) {
    tris += pos.length / 9;
    for (let i = 0; i < pos.length; i++) {
      min[i % 3] = Math.min(min[i % 3], pos[i]);
      max[i % 3] = Math.max(max[i % 3], pos[i]);
    }
  }
  const r = (v) => +v.toFixed(3);
  manifest.push({ name, category, sheet, file, footprint, triangles: tris, bounds: { min: min.map(r), max: max.map(r) } });
  if (!name.startsWith(filter)) continue;
  mkdirSync(join(out, category), { recursive: true });
  const glb = toGLB(m);
  writeFileSync(join(out, file), glb);
  console.log(`${name.padEnd(26)} ${String(tris).padStart(5)} tris  ${(glb.length / 1024).toFixed(1)} KB`);
}
writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`${manifest.length} assets in manifest`);
