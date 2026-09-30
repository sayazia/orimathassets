// Builds the 2D Foldlings assets in 2d/: SVG sources written from code, PNG exports rasterised in
// headless Chromium, and the Devpost/social images rendered from the 3D models with the logo on top.
// Run `npm run build` first so the models exist. Optional argument: a folder name (avatars, brand, ...).
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { C, S, poly, ngon, svg, g, outline, edge, twoTone, crane, book } from './2d/svg.mjs';
import { HEADS } from './2d/heads.mjs';
import { PICTURES, gameBadge, GAME_COLOURS, missionIcon, word } from './2d/symbols.mjs';
import { MISSIONS } from './lib/palette.mjs';
import { MENU_COLOURS, MENU_LAYOUTS, MENU_W, MENU_H, menuBackground, menuLabel } from './2d/menu.mjs';
import { TABLE_SCENES } from './game/index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '2d');
const only = process.argv[2] ?? '';
const jobs = []; // PNG exports: { file, svg, width, height }

const write = (file, text) => { mkdirSync(dirname(join(out, file)), { recursive: true }); writeFileSync(join(out, file), text); };
// Writes <file>.svg and queues PNG exports; sizes are [w, h] pairs, suffixed _<w> unless `plain`.
// `ext` 'jpg' is for opaque, grainy art (backgrounds) where PNG would be several MB.
function emit(file, w, h, body, sizes, plain = false, ext = 'png') {
  if (only && !file.startsWith(only)) return;
  const s = svg(w, h, body, `0 0 ${w} ${h}`);
  write(`${file}.svg`, s);
  for (const [pw, ph] of sizes) jobs.push({ file: plain ? `${file}.${ext}` : `${file}_${pw}.${ext}`, svg: s, width: pw, height: ph, jpeg: ext === 'jpg' });
}
const fit = (body, s, dx = 0, dy = 0) => g(body, `translate(${dx} ${dy}) scale(${s})`);

// Avatars: a Foldling head on a folded paper disc ringed in the mission colour.
const SPECIES = Object.keys(HEADS);
for (const sp of SPECIES) for (const m of MISSIONS) {
  const ring = ngon(50, 50, 49, 24), disc = ngon(50, 50, 43, 24);
  const head = HEADS[sp](m);
  const body = twoTone(ring, m, [0, 100], [100, 0]) + twoTone(disc, 'paper', [100, 0], [0, 100])
    + fit(outline(head, 4) + head, 0.72, 14, 15);
  emit(`avatars/avatar_${sp}_${m}`, 100, 100, body, [[256, 256], [512, 512]]);
}

// Picture passwords: each symbol on a paper card with a folded corner.
for (const [name, draw] of Object.entries(PICTURES)) {
  const card = poly([[4, 4], [96, 4], [96, 78], [78, 96], [4, 96]], C('paper')) + poly([[96, 78], [78, 78], [78, 96]], C('cream'));
  const sym = draw();
  const body = outline(card, 3) + card + fit(outline(sym, 4) + sym, 0.8, 10, 8);
  emit(`picture_password/pp_${name}`, 100, 100, body, [[256, 256]], true);
}

// Logo: the word from folded ribbons in the five mission colours, with a small crane in front.
const w = word('FOLDLINGS', MISSIONS);
function logo(contour) {
  const u = 10, pad = 12, craneW = 7.2 * u; // letter unit in px before scaling
  const W = pad * 2 + craneW + 1.4 * u + w.width * u, H = pad * 2 + w.height * u;
  const under = (b, wd) => (contour ? edge(b, wd, contour) : outline(b, wd));
  const letters = g(under(w.under, contour ? 0.3 : 0.9) + w.body, `translate(${pad + craneW + 1.4 * u} ${pad}) scale(${u})`);
  const cr = crane('coral', 'cream', false);
  const craneG = fit(under(cr, contour ? 3 : 8) + cr, craneW / 100, pad, pad - 6);
  return { W, H, body: craneG + letters };
}
for (const [id, contour] of [['logo_foldlings', null], ['logo_foldlings_dark', C('paper')]]) {
  const { W, H, body } = logo(contour);
  emit(`brand/${id}`, Math.round(W), Math.round(H), body, [[1200, Math.round((1200 * H) / W)]], true);
}

// App icon, maskable icon and favicon.
const iconArt = fit(book(), 0.78, 11, 56) + fit(outline(crane('coral', 'cream', false), 5) + crane('coral', 'cream', false), 0.62, 18, 4);
const bg = (rx) => `<clipPath id="r"><rect width="100" height="100" rx="${rx}"/></clipPath><g clip-path="url(#r)">${twoTone([[0, 0], [100, 0], [100, 100], [0, 100]], 'teal', [0, 100], [100, 0])}</g>`;
emit('brand/app_icon', 100, 100, bg(22) + iconArt, [[192, 192], [512, 512], [1024, 1024]]);
// Maskable: full bleed, art inside the central 80% safe circle.
emit('brand/app_icon_maskable', 100, 100, bg(0) + fit(iconArt, 0.7, 15, 15), [[192, 192], [512, 512], [1024, 1024]]);
const fav = crane('paper', 'cream', false);
emit('brand/favicon', 100, 100, bg(24) + fit(outline(fav, 7) + fav, 0.86, 7, 8), [[32, 32], [48, 48]]);

// Game badges and mission icons.
for (const id of Object.keys(GAME_COLOURS)) emit(`icons/game_${id}`, 100, 100, gameBadge(id), [[128, 128], [256, 256]]);
for (const m of MISSIONS) emit(`icons/mission_${m}`, 100, 100, missionIcon(m), [[128, 128]], true);

// Menu backgrounds: matte paper with label slots lifted out of the sheet, plus the slot layout.
for (const [layout, slots] of Object.entries(MENU_LAYOUTS)) for (const key of MENU_COLOURS) {
  emit(`backgrounds/${layout}_${key}`, MENU_W, MENU_H, menuBackground(key, slots), [[1920, 1080]], true, 'jpg');
}
if (!only || 'backgrounds'.startsWith(only)) {
  write('backgrounds/menu_layout.json', JSON.stringify({ size: [MENU_W, MENU_H], note: 'Slot rectangles [x, y, w, h] in pixels from the top left, same for every colour. Each is the label face exactly; its left edge stays on the sheet and its right side peels up.', layouts: MENU_LAYOUTS }, null, 2) + '\n');
}

// Menu labels: transparent PNGs of a label with its peel shadow and lettering, to lay on a background.
for (const [id, shape, lines] of [['start_here', 'square', ['START', 'HERE']], ['you_win', 'circle', ['YOU', 'WIN']]]) {
  const { body, W, H } = menuLabel('teal', shape, lines);
  emit(`labels/label_${id}_teal`, W, H, body, [[W * 2, H * 2]], true);
}

// ---- Rasterise, then render the brand images from the models.
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
const call = (fn, arg) => page.evaluate(({ fn, arg }) => window[fn](arg), { fn, arg });
const savePng = (file, dataUrl) => { mkdirSync(dirname(join(out, file)), { recursive: true }); writeFileSync(join(out, file), Buffer.from(dataUrl.split(',')[1], 'base64')); };

for (const j of jobs) savePng(j.file, await call('rasterize', j));
console.log(`exported ${jobs.length} images`);

if (!only || only === 'brand') {
  const manifest = JSON.parse(readFileSync(join(root, 'models/manifest.json'), 'utf8'));
  const items = TABLE_SCENES.find((s) => s.name === 'b1').items.map((it) => ({ ...it, file: manifest.find((a) => a.name === it.name)?.file ?? it.file }));
  const { W, H, body } = logo(null);
  // Logo on a paper banner with folded ends, placed along the top.
  const banner = (bw) => {
    const bh = (bw * H) / W, e = bh * 0.35;
    const b = poly([[0, bh * 0.2], [e, bh * 0.2], [e, bh * 1.2], [0, bh * 1.2], [e * 0.45, bh * 0.7]], S('cream'))
      + poly([[bw + 2 * e, bh * 0.2], [bw + e, bh * 0.2], [bw + e, bh * 1.2], [bw + 2 * e, bh * 1.2], [bw + e * 1.55, bh * 0.7]], S('cream'))
      + poly([[e * 0.6, 0], [bw + e * 1.4, 0], [bw + e * 1.4, bh * 1.1], [e * 0.6, bh * 1.1]], C('paper'));
    return { svg: svg(bw + 2 * e, bh * 1.2, b + g(body, `translate(${e} ${bh * 0.05}) scale(${bw / W})`)), w: bw + 2 * e, h: bh * 1.2 };
  };
  const shots = [
    ['brand/devpost_thumbnail.png', 1920, 1080], ['brand/devpost_thumbnail_1200x630.png', 1200, 630], ['brand/social_preview.png', 1280, 640],
  ];
  for (const [file, pw, ph] of shots) {
    const png = await call('renderTable', { items, table: 'wood', width: pw, height: ph, eye: [0, 0.34, 0.5], target: [0, 0.07, -0.02], fov: ph / pw > 0.54 ? 44 : 40 });
    const bn = banner(pw * 0.46);
    savePng(file, await call('compose', { png, layers: [{ svg: bn.svg, x: (pw - bn.w) / 2, y: ph * 0.05, w: bn.w, h: bn.h }] }));
    console.log(`rendered ${file}`);
  }
}
await browser.close();
server.close();
