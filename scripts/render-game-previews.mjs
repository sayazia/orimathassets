// Previews for the Foldlings game assets (headless Chromium + three.js):
//   previews/<dir>/<name>.png        front, three-quarter, side and a black silhouette
//   previews/sheet_<sheet>.png       contact sheet per group (+ _variants for colour variants)
//   previews/clips/<name>.png        six frames of every animation clip
//   previews/cvd_<sheet>.png         mission colours under colour-vision-deficiency simulation
//   previews/table_<scene>_<top>.png table-scale view from a seated child's eye height
// Optional argument: a sheet name or asset name prefix.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { GAME_SHEETS, TABLE_SCENES } from './game/index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'models/manifest.json'), 'utf8')).filter((a) => a.unit === 'm');
const outDir = join(root, 'previews');

const types = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'model/gltf-binary', '.json': 'application/json' };
const server = createServer((req, res) => {
  const path = normalize(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!path.startsWith(root) || !existsSync(path)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' }).end(readFileSync(path));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('page error:', e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/scripts/game-preview.html`);
await page.waitForFunction(() => window.ready === true);

const save = (name, dataUrl) => {
  mkdirSync(dirname(join(outDir, name)), { recursive: true });
  writeFileSync(join(outDir, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
};
const call = (fn, arg) => page.evaluate(({ fn, arg }) => window[fn](arg), { fn, arg });

const VIEWS = { front: [0, 0.3, 1], 'three-quarter': [0.9, 0.6, 1], side: [1, 0.3, 0] };
const only = process.argv[2] ?? '';

for (const { sheet, title } of GAME_SHEETS) {
  const assets = manifest.filter((a) => a.sheet === sheet && (!only || sheet === only || a.name.startsWith(only)));
  if (!assets.length) continue;
  const tiles = [], variantTiles = [], cvdRows = [];
  for (const a of assets) {
    const item = { file: a.file };
    const views = [];
    for (const [name, view] of Object.entries(VIEWS)) views.push({ name, png: await call('render', { items: [item], view }) });
    views.push({ name: 'silhouette', png: await call('render', { items: [item], view: VIEWS.front, silhouette: true }) });
    save(a.file.replace(/\.glb$/, '.png'), await call('grid', { tiles: views, cols: 4, cell: [400, 400], title: a.name }));
    tiles.push({ name: a.name, png: views[1].png });

    if (a.variant_files) {
      for (const [id, file] of Object.entries(a.variant_files)) variantTiles.push({ name: `${a.name.replace(/^foldling_/, '')} ${id}`, png: await call('render', { items: [{ file }], view: VIEWS['three-quarter'] }) });
      const missions = Object.entries(a.variant_files).filter(([id]) => id !== 'rare');
      cvdRows.push(await Promise.all(missions.map(([, file]) => call('render', { items: [{ file }], view: VIEWS.front, width: 240, height: 240 }))));
    }

    if (a.clips) {
      const [bmin, bmax] = [a.bounds.min, a.bounds.max];
      const span = Math.max(...bmax.map((v, i) => v - bmin[i]));
      const fitTo = { min: [bmin[0] - span * 0.15, bmin[1], bmin[2] - span * 0.15], max: [bmax[0] + span * 0.15, bmax[1] + span * 0.35, bmax[2] + span * 0.15] };
      const info = await call('clipInfo', a.file);
      const frames = [];
      for (const { name, duration } of info) {
        for (let k = 0; k < 6; k++) {
          const time = (duration * k) / 5;
          frames.push({ name: `${name} ${time.toFixed(2)}s`, png: await call('render', { items: [{ ...item, clip: name, time }], view: VIEWS['three-quarter'], width: 240, height: 240, fitTo, pad: 0.02 }) });
        }
      }
      save(`clips/${a.name}.png`, await call('grid', { tiles: frames, cols: 6, cell: [240, 240], title: `${a.name}: ${info.map((c) => c.name).join(', ')}` }));
    }
    console.log(`rendered ${a.name}`);
  }
  if (!only || only === sheet) {
    save(`sheet_${sheet}.png`, await call('grid', { tiles, cols: Math.min(tiles.length, 5), cell: [256, 256], title }));
    if (variantTiles.length) save(`sheet_${sheet}_variants.png`, await call('grid', { tiles: variantTiles, cols: 6, cell: [200, 200], title: `${title}: mission colours + rare` }));
    if (cvdRows.length) {
      const flat = cvdRows.flat();
      const cols = cvdRows[0].length;
      const sheetPng = await call('grid', { tiles: flat.map((png) => ({ png })), cols, cell: [160, 160], captions: false });
      const rows = [{ name: 'normal', png: sheetPng }];
      for (const kind of ['deuteranopia', 'protanopia', 'tritanopia']) rows.push({ name: kind, png: await call('simulate', { png: sheetPng, kind }) });
      save(`cvd_${sheet}.png`, await call('grid', { tiles: rows, cols: 2, cell: [cols * 160, cvdRows.length * 160 + 8], title: `${title}: missions left to right = place value, multiply/divide, fractions, decimals, measurement` }));
    }
    console.log(`rendered sheet ${sheet}`);
  }
}

for (const scene of TABLE_SCENES) {
  if (only && only !== scene.name && only !== 'table') continue;
  const items = scene.items.map((it) => ({ ...it, file: manifest.find((a) => a.name === it.name)?.file ?? it.file }));
  for (const table of ['wood', 'white']) save(`table_${scene.name}_${table}.png`, await call('renderTable', { items, table, ...scene.camera }));
  console.log(`rendered table scene ${scene.name}`);
}

await browser.close();
server.close();
