// The paper glyph set as files: one SVG per glyph and treatment, two PNG atlases (T and W) with the
// glyphs 128 px tall, and paper_glyphs.json with the atlas cells, advances, bearings and kerning.
import { CHARS, ALIASES, glyph, kerning, INK_H, TAB_ADVANCE, SIDE } from './glyphs.mjs';
import { lettering } from './paper.mjs';

const GH = 128, K = GH / INK_H, PAD = 10, ATLAS_W = 1024;
const r2 = (n) => Math.round(n * 100) / 100;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;
const placed = (g, x, y) => g.polys.map((p) => p.map(([u, v]) => [x + u * K, y + v * K]));

export function buildFont() {
  const files = []; // { path, svg, w, h }
  const cells = {};
  let cx = 0, cy = 0;
  for (const ch of CHARS) {
    const g = glyph(ch), w = Math.ceil(g.advance * K) + 2 * PAD, h = GH + 2 * PAD;
    if (cx + w > ATLAS_W) { cx = 0; cy += h; }
    cells[ch] = { x: cx, y: cy, w, h };
    for (const tr of ['T', 'W', 'I']) {
      if (g.polys.length) files.push({ path: `font/glyphs/${tr}/${g.name}.svg`, svg: svg(w, h, lettering(placed(g, PAD, PAD), tr, GH, `g${tr}`, null)) });
    }
    cx += w;
  }
  const atlasH = cy + GH + 2 * PAD;
  const atlas = {};
  for (const tr of ['T', 'W', 'I']) {
    const polys = CHARS.flatMap((ch) => placed(glyph(ch), cells[ch].x + PAD, cells[ch].y + PAD));
    atlas[tr] = svg(ATLAS_W, atlasH, lettering(polys, tr, GH, `a${tr}`, null));
  }
  const kern = Object.fromEntries(Object.entries(kerning()).map(([k, v]) => [k, r2(v * K)]));
  const json = {
    note: 'Numeria Arena paper glyphs. All values in px for glyphs 128 px tall; scale by (letter height / 128). '
      + 'Draw a glyph by copying its atlas cell so that cell.origin lands on the pen position (x) and the top of the line (y), '
      + 'then advance the pen by advance, adding kerning[prev + char] when present. Digits can use tabular_advance (centre the digit in it) so a running clock does not wobble. '
      + 'Atlas T is tone on tone for near-white paper; atlas W is for coloured paper and bakes its short shadow as black at 20% (it reads as the background darkened 20%). Atlas I is flat ink #3A3F4B for answer numbers and small text on paper.',
    height: GH,
    units: { letter_height: INK_H, px_per_unit: r2(K) },
    atlas: { T: 'ui2d/font/paper_glyphs_T.png', W: 'ui2d/font/paper_glyphs_W.png', I: 'ui2d/font/paper_glyphs_I.png', size: [ATLAS_W, atlasH], cell_padding: PAD },
    aliases: ALIASES,
    tabular_advance: r2(TAB_ADVANCE * K),
    space_advance: r2(glyph(' ').advance * K),
    glyphs: Object.fromEntries(CHARS.map((ch) => {
      const g = glyph(ch), c = cells[ch];
      return [ch, { name: g.name, cell: [c.x, c.y, c.w, c.h], origin: [PAD, PAD], advance: r2(g.advance * K), lsb: r2(g.inkLeft * K), rsb: r2((g.advance - g.inkRight) * K), ink_width: r2((g.inkRight - g.inkLeft) * K), svg_T: g.polys.length ? `ui2d/font/glyphs/T/${g.name}.svg` : null, svg_W: g.polys.length ? `ui2d/font/glyphs/W/${g.name}.svg` : null, svg_I: g.polys.length ? `ui2d/font/glyphs/I/${g.name}.svg` : null }];
    })),
    kerning: kern,
  };
  return { files, atlas, atlasSize: [ATLAS_W, atlasH], json };
}
export { SIDE };
