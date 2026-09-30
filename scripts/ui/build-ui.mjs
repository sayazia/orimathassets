// Builds batch U1 of the Numeria Arena UI into ui2d/: the paper glyph set (SVG per glyph, PNG atlases,
// metrics), every banner, button, word and badge (SVG + transparent PNG), small and large icons,
// ui2d/manifest.json and the preview page. Optional argument: a name prefix to rebuild only those files.
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { piece, CLASSES } from './paper.mjs';
import { ITEMS } from './items.mjs';
import { ICONS, LARGE, LARGE_NAMES } from './icons.mjs';
import { buildFont } from './font.mjs';
import { rasterizer } from './raster.mjs';
import { previewBackground, previewRoom, previewHtml } from './preview.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const out = join(root, 'ui2d');
const only = process.argv[2] ?? '';
const write = (file, data) => { mkdirSync(dirname(join(out, file)), { recursive: true }); writeFileSync(join(out, file), data); };
const svgDoc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;
if (!only && existsSync(out)) rmSync(out, { recursive: true }); // full builds start clean so renamed files do not linger
const r = await rasterizer();
const SHAPES = { R: 'rectangle', C: 'circle', J: 'parallelogram', P: 'ribbon', B: 'speech_bubble' };
const TREAT = { E: 'emboss', W: 'on_color', K: 'solid_paper' };
const manifest = [];
const r4 = (n) => Math.round(n * 10000) / 10000;

async function emit(entry, p) {
  const svg = svgDoc(p.W, p.H, p.svg);
  const base = `${entry.dir}/${entry.name}`;
  if (!only || entry.name.startsWith(only)) {
    write(`${base}.svg`, svg);
    write(`${base}.png`, await r.png(svg, p.W, p.H));
  }
  manifest.push({
    name: entry.name, file: `ui2d/${base}.png`, svg: `ui2d/${base}.svg`, text: entry.text, shape: SHAPES[entry.shape], treatment: TREAT[entry.treatment],
    background: entry.background, size_class: entry.sizeClass, px: [p.W, p.H], world_height_m: r4(entry.world * p.H / entry.classPx), priority: entry.priority,
    ...(entry.lh ? { letter_px: entry.lh } : {}),
    ...(p.slots?.length ? { slots: p.slots.map(({ x, y, w, h, digits, text }) => ({ x, y, w, h, ...(digits ? { digits } : {}), ...(text ? { fits: text.replace(/#/g, '0') } : {}) })) } : {}),
    ...(entry.note ? { note: entry.note } : {}),
  });
}

// 1.5 paper glyphs
const font = buildFont();
if (!only || 'font'.startsWith(only) || only === 'paper_glyphs') {
  if (existsSync(join(out, 'font/glyphs'))) rmSync(join(out, 'font/glyphs'), { recursive: true });
  for (const f of font.files) write(f.path, f.svg);
  const [aw, ah] = font.atlasSize;
  for (const tr of ['E', 'W', 'K']) write(`font/paper_glyphs_${tr}.png`, await r.png(font.atlas[tr], aw, ah));
  write('font/paper_glyphs.json', JSON.stringify(font.json, null, 1) + '\n');
  console.log(`glyphs: ${font.files.length} svg, 3 atlases ${aw}x${ah}`);
}

// Section 2 items. Buttons also get a pressed state (lit and dark edges swapped, no drop shadow, so it
// sinks into the paper) and an off state (effects at half strength).
const BG = (treatment, bg) => (treatment === 'W' ? bg : treatment === 'K' ? '#FFFDF8' : null);
for (const it of ITEMS) {
  const C = CLASSES[it.cls];
  const icon = it.sizeLabel === 'icon_large';
  const states = it.name.startsWith('button_') ? [null, 'pressed', 'off'] : [null];
  for (const state of states) {
    const p = piece({ ...it, name: it.name + (state ? `_${state}` : ''), state, icon: it.iconName ? ICONS[it.iconName]() : undefined });
    await emit({
      ...it, name: it.name + (state ? `_${state}` : ''), text: it.shownText ?? it.text, background: BG(it.treatment, it.bg),
      sizeClass: icon ? 'icon_large' : it.cls, world: icon ? 0.06 : C.world, classPx: icon ? 512 : C.png, lh: C.lh,
      note: [state && `${state} state`, it.note, it.iconName ? `icon ${it.iconName} on the left` : null].filter(Boolean).join('; ') || undefined,
    }, p);
  }
}

// 2.9 small icons (128 px), transparent emboss like the buttons that use them
for (const [id, draw] of Object.entries(ICONS)) {
  const p = piece({ name: `icon_${id}`, shape: 'C', treatment: 'E', cls: 'S', lh: 30, width: 104, square: 128, symbol: draw(), symbolScale: 0.62 });
  await emit({ name: `icon_${id}`, dir: 'icons', text: '', shape: 'C', treatment: 'E', background: null, sizeClass: 'icon_small', world: 0.02, classPx: 128, priority: 2 }, p);
}
// 2.10 large icons (512 px), transparent emboss
for (const [id, draw] of Object.entries(LARGE)) {
  const name = LARGE_NAMES[id];
  const p = piece({ name, shape: 'C', treatment: 'E', cls: 'L', width: 440, square: 512, symbol: draw(), symbolScale: 0.6 });
  await emit({ name, dir: 'icons_large', text: '', shape: 'C', treatment: 'E', background: null, sizeClass: 'icon_large', world: 0.06, classPx: 512, priority: 2 }, p);
}

if (!only) {
  write('manifest.json', JSON.stringify(manifest, null, 1) + '\n');
  write('preview_bg.jpg', await r.png(previewBackground(1920, 1200), 1920, 1200, true));
  write('preview_room.jpg', await r.png(previewRoom(1920, 1200), 1920, 1200, true));
  write('preview.html', previewHtml(manifest, font.json));
}
console.log(`${manifest.length} files in the manifest`);
await r.close();
