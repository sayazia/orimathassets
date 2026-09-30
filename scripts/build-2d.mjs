// Builds the 2D game assets (brand now Numeria Arena) in 2d/: SVG sources written from code, PNG exports rasterised in
// headless Chromium, and the Devpost/social images rendered from the 3D models with the logo on top.
// Run `npm run build` first so the models exist. Optional argument: a folder name (avatars, brand, ...).
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { C, S, poly, ngon, svg, g, outline, edge, twoTone, crane, book } from './2d/svg.mjs';
import { HEADS } from './2d/heads.mjs';
import { PICTURES, gameBadge, GAME_COLOURS, missionIcon } from './2d/symbols.mjs';
import { MISSIONS } from './lib/palette.mjs';
import { MENU_COLOURS, MENU_LAYOUTS, MENU_W, MENU_H, menuBackground, menuLabel } from './2d/menu.mjs';
import { TABLE_SCENES } from './game/index.mjs';
import { piece, lettering } from './ui/paper.mjs';
import { layoutLine } from './ui/glyphs.mjs';

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

// Logo (Numeria Arena): the title in the paper letters of the UI set (scripts/ui), cream on
// teal (stands on its own anywhere) and the clear sticker version (treatment E) that takes any background.
const title = (treatment) => piece({ name: `logo${treatment}`, text: 'NUMERIA ARENA', shape: 'R', treatment, bg: C('teal'), cls: 'XL' });
for (const [id, treatment] of [['logo_numeria_arena', 'W'], ['logo_numeria_arena_emboss', 'E']]) {
  const t = title(treatment);
  emit(`brand/${id}`, t.W, t.H, t.svg, [[1200, Math.round((1200 * t.H) / t.W)]], true);
}

// App icon, maskable icon and favicon: the paper monogram on teal.
const mono = (text, lh, cx, cy) => {
  const lay = layoutLine(text, lh), dx = cx - lay.inkMin - lay.width / 2, dy = cy - lh / 2;
  return lettering(lay.polys.map((p) => p.map(([x, y]) => [x + dx, y + dy])), 'W', lh, `m${text}${lh}`.replace(/\W/g, ''), C('teal'));
};
const bg = (rx) => `<clipPath id="r"><rect width="100" height="100" rx="${rx}"/></clipPath><g clip-path="url(#r)">${twoTone([[0, 0], [100, 0], [100, 100], [0, 100]], 'teal', [0, 100], [100, 0])}</g>`;
emit('brand/app_icon', 100, 100, bg(22) + mono('NA', 38, 50, 50), [[192, 192], [512, 512], [1024, 1024]]);
// Maskable: full bleed, art inside the central 80% safe circle.
emit('brand/app_icon_maskable', 100, 100, bg(0) + mono('NA', 28, 50, 50), [[192, 192], [512, 512], [1024, 1024]]);
emit('brand/favicon', 100, 100, bg(24) + mono('N', 60, 50, 50), [[32, 32], [48, 48]]);

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

// Menu label stickers: transparent PNGs with a clear face, so they take the colour of any background.
for (const [id, shape, lines, size] of [['start_here', 'square', ['START', 'HERE']], ['you_win', 'circle', ['YOU', 'WIN']], ['begin_here', 'square', ['BEGIN HERE'], [640, 170]]]) {
  const { body, W, H } = menuLabel(shape, lines, undefined, size);
  emit(`labels/label_${id}`, W, H, body, [[W, H]], true);
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
  // Title banner along the top.
  const t = title('W');
  const banner = (bw) => ({ svg: svg(bw, (bw * t.H) / t.W, t.svg, `0 0 ${t.W} ${t.H}`), w: bw, h: (bw * t.H) / t.W });
  const shots = [
    ['brand/devpost_thumbnail.png', 1920, 1080], ['brand/devpost_thumbnail_1200x630.png', 1200, 630], ['brand/social_preview.png', 1280, 640],
  ];
  for (const [file, pw, ph] of shots) {
    const png = await call('renderTable', { items, table: 'wood', width: pw, height: ph, eye: [0, 0.34, 0.5], target: [0, 0.07, -0.02], fov: ph / pw > 0.54 ? 44 : 40 });
    const bn = banner(pw * 0.62);
    savePng(file, await call('compose', { png, layers: [{ svg: bn.svg, x: (pw - bn.w) / 2, y: ph * 0.05, w: bn.w, h: bn.h }] }));
    console.log(`rendered ${file}`);
  }
}
await browser.close();
server.close();
