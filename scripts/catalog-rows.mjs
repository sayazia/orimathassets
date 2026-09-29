// Prints markdown table rows (for docs/CATALOG.md) for game assets whose sheet is listed as arguments.
import { readFileSync, statSync } from 'node:fs';
const sheets = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(new URL('../models/manifest.json', import.meta.url), 'utf8'));
const f = (v) => v.toFixed(3);
for (const a of manifest.filter((x) => x.unit && sheets.includes(x.sheet))) {
  const kb = (statSync(new URL(`../models/${a.file}`, import.meta.url)).size / 1024).toFixed(1);
  const [x, y, z] = a.bounds.max.map((v, i) => v - a.bounds.min[i]);
  const extra = a.variants ? ` (+${a.variants.length - 1} varian)` : '';
  console.log(`| ${a.file.replace(/\.glb$/, '')}${extra} | ${a.triangles} | ${a.outline_triangles} | ${kb} | ${f(x)}×${f(z)}×${f(y)} | ${Object.keys(a.anchors).join(', ')} | ${a.parts.join(', ')} |`);
}
