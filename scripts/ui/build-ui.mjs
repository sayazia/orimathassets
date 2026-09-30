// Builds batch U1 of the Numeria Arena UI into ui2d/: the paper glyph set (SVG per glyph, PNG atlases,
// metrics), every banner, button, word and badge (SVG + transparent PNG), small and large icons,
// ui2d/manifest.json and the preview page. Optional argument: a name prefix to rebuild only those files.
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { piece, CLASSES } from './paper.mjs';
import { ITEMS, COL, XS_INK } from './items.mjs';
import { ICONS, LARGE, LARGE_COLOURS, LARGE_NAMES } from './icons.mjs';
import { buildFont } from './font.mjs';
import { rasterizer } from './raster.mjs';
import { previewBackground, previewHtml } from './preview.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const out = join(root, 'ui2d');
const only = process.argv[2] ?? '';
const write = (file, data) => { mkdirSync(dirname(join(out, file)), { recursive: true }); writeFileSync(join(out, file), data); };
const svgDoc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;
const r = await rasterizer();
const SHAPES = { R: 'rectangle', C: 'circle', J: 'parallelogram', P: 'ribbon', B: 'speech_bubble' };
const TREAT = { T: 'on_paper', W: 'on_color', I: 'ink_on_paper' };
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
  for (const tr of ['T', 'W', 'I']) write(`font/paper_glyphs_${tr}.png`, await r.png(font.atlas[tr], aw, ah));
  write('font/paper_glyphs.json', JSON.stringify(font.json, null, 1) + '\n');
  console.log(`glyphs: ${font.files.length} svg, 3 atlases ${aw}x${ah}`);
}

// Section 2 items
for (const it of ITEMS) {
  const treatment = it.treatment === 'T' && it.cls === 'XS' && XS_INK ? 'I' : it.treatment;
  const p = piece({ ...it, treatment, icon: it.iconName ? ICONS[it.iconName]() : undefined });
  const C = CLASSES[it.cls];
  const icon = it.sizeLabel === 'icon_large';
  await emit({
    ...it, treatment, text: it.shownText ?? it.text, background: treatment === 'W' ? it.bg : '#FFFDF8',
    sizeClass: icon ? 'icon_large' : it.cls, world: icon ? 0.06 : C.world, classPx: icon ? 512 : C.png, lh: C.lh,
    note: [it.note, it.iconName ? `icon ${it.iconName} on the left` : null].filter(Boolean).join('; ') || undefined,
  }, p);
}

// 2.9 small icons (128 px): cream on cobalt, and ink on paper
for (const [id, draw] of Object.entries(ICONS)) {
  for (const [v, treatment, bg] of [['cobalt', 'W', COL.cobalt], ['paper', 'I', '#FFFDF8']]) {
    const p = piece({ name: `icon_${id}_${v}`, shape: 'C', treatment, bg, cls: 'S', lh: 30, width: 104, square: 128, symbol: draw(), symbolScale: 0.62 });
    await emit({ name: `icon_${id}_${v}`, dir: 'icons', text: '', shape: 'C', treatment, background: bg, sizeClass: 'icon_small', world: 0.02, classPx: 128, priority: 2 }, p);
  }
}
// 2.10 large icons (512 px)
for (const [id, draw] of Object.entries(LARGE)) {
  const bg = COL[LARGE_COLOURS[id]], name = LARGE_NAMES[id];
  const p = piece({ name, shape: 'C', treatment: 'W', bg, cls: 'L', width: 440, square: 512, symbol: draw(), symbolScale: 0.6 });
  await emit({ name, dir: 'icons_large', text: '', shape: 'C', treatment: 'W', background: bg, sizeClass: 'icon_large', world: 0.06, classPx: 512, priority: 2 }, p);
}

if (!only) {
  write('manifest.json', JSON.stringify(manifest, null, 1) + '\n');
  write('preview_bg.jpg', await r.png(previewBackground(1920, 1200), 1920, 1200, true));
  write('preview.html', previewHtml(manifest, font.json));
}
console.log(`${manifest.length} files in the manifest`);
await r.close();
