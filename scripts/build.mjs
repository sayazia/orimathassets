// Builds every asset into models/<category>/<name>.glb plus models/manifest.json.
// City assets are measured in tiles; Foldlings game assets (scripts/game/) in metres.
// Optional argument: a name prefix to rebuild only matching assets (e.g. `npm run build -- house_`).
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSETS } from './assets/index.mjs';
import { Model } from './lib/geom.mjs';
import { toGLB } from './lib/glb.mjs';
import { GAME_ASSETS, CITY_TILE_ON_BOOK_M } from './game/index.mjs';
import { Rig } from './lib/rig.mjs';
import { toRigGLB } from './lib/rig-glb.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'models');
const filter = process.argv[2] ?? '';

const names = new Set();
for (const { name } of [...ASSETS, ...GAME_ASSETS]) {
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
// Game assets: one rig per variant; the first variant is the base file.
for (const a of GAME_ASSETS) {
  const { name, category, sheet, dir, variants = [null] } = a;
  const entry = { name, category, sheet, file: `${dir}/${name}.glb`, unit: 'm' };
  const variantFiles = {};
  for (const v of variants) {
    const rig = new Rig(name);
    a.build(rig, v?.pal ?? {});
    const info = rig.info();
    const file = v && v !== variants[0] ? `${dir}/${name}_${v.id}.glb` : entry.file;
    if (v) variantFiles[v.id] = file;
    if (!v || v === variants[0]) {
      Object.assign(entry, info);
      if (rig.clips.length) entry.clips = rig.clips.map((c) => c.name);
      if (a.size) {
        const got = [0, 2, 1].map((i) => info.bounds.max[i] - info.bounds.min[i]);
        if (got.some((g, i) => g > a.size[i] * 1.1 + 0.0015 || g < a.size[i] * 0.7 - 0.0015)) console.warn(`  ! ${name}: size ${got.map((g) => g.toFixed(3)).join('x')} vs brief ${a.size.join('x')}`);
      }
    }
    if (!name.startsWith(filter)) continue;
    mkdirSync(join(out, dirname(file)), { recursive: true });
    const glb = toRigGLB(rig);
    writeFileSync(join(out, file), glb);
    console.log(`${file.padEnd(44)} ${String(info.triangles).padStart(5)} tris +${String(info.outline_triangles).padStart(4)} outline  ${(glb.length / 1024).toFixed(1)} KB`);
  }
  if (variants[0]) {
    entry.variants = variants.map((v) => v.id);
    entry.variant_files = variantFiles;
    entry.variant_colours = Object.fromEntries(variants.map((v) => [v.id, v.pal]));
  }
  for (const k of ['notes']) if (a[k]) entry[k] = a[k];
  manifest.push(entry);
}
writeFileSync(join(out, 'scale.json'), JSON.stringify({ city_tile_on_book_m: CITY_TILE_ON_BOOK_M }, null, 2) + '\n');
writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`${manifest.length} assets in manifest`);
