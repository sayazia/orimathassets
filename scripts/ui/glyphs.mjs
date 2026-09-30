// Numeria Arena paper glyphs: one set of cut-paper letters, digits and symbols used by every UI file
// and by the game for dynamic text (scores, clock, questions). Each glyph is a centre line per stroke
// turned into a flat paper ribbon (the same ribbons as the approved "BEGIN HERE" sticker), plus square-ish
// dots. Units: stroke centres run 0..6 tall, ribbons are T wide, so the ink is 0..7.3 tall (the letter height).
// No fonts anywhere; everything is polygons.
import { LETTERS } from '../2d/symbols.mjs';
import { clipHalf } from '../2d/svg.mjs';

export const T = 1.3; // ribbon width
export const INK_H = 6 + T; // letter height in units
export const SIDE = 0.2; // side bearing each side, so the ink gap between letters is 0.4 like the sticker

// { w: stroke-box width, strokes: [[u, v]...], closed, dots: [[u, v, r]], t: ribbon width override, name }
const G = {
  ...LETTERS,
  C: { w: 4, strokes: [[[4, 1.2], [2.8, 0], [1.2, 0], [0, 1.2], [0, 4.8], [1.2, 6], [2.8, 6], [4, 4.8]]] },
  J: { w: 3.6, strokes: [[[3.6, 0], [3.6, 4.8], [2.4, 6], [1.2, 6], [0, 4.8]]] },
  K: { w: 4, strokes: [[[0, 0], [0, 6]], [[4, 0], [0.3, 3.5]], [[1.7, 2.3], [4, 6]]] },
  M: { w: 5, strokes: [[[0, 6], [0, 0], [2.5, 3.8], [5, 0], [5, 6]]] },
  P: { w: 4, strokes: [[[0, 6], [0, 0], [2.8, 0], [4, 1.2], [4, 2.2], [2.8, 3.4], [0, 3.4]]] },
  Q: { w: 4, strokes: [[[1.2, 0], [2.8, 0], [4, 1.2], [4, 4.8], [2.8, 6], [1.2, 6], [0, 4.8], [0, 1.2]], [[2.3, 4], [4.3, 6.2]]], closedFirst: true },
  V: { w: 4.4, strokes: [[[0, 0], [2.2, 6], [4.4, 0]]] },
  X: { w: 4.2, strokes: [[[0, 0], [4.2, 6]], [[4.2, 0], [0, 6]]] },
  Z: { w: 4, strokes: [[[0, 0], [4, 0], [0, 6], [4, 6]]] },
  // Digits: 0 is narrower than O, 1 has a flag and a foot (never a 7 or an I), 7 is a bare bar and
  // diagonal, 6 has an open hook at the top while 9 has a straight stem, so they are not rotations.
  0: { w: 2.5, strokes: [[[0.8, 0], [1.7, 0], [2.5, 0.8], [2.5, 5.2], [1.7, 6], [0.8, 6], [0, 5.2], [0, 0.8]]], closed: true },
  1: { w: 3.4, strokes: [[[0.2, 1.4], [1.7, 0], [1.7, 6]], [[0, 6], [3.4, 6]]] },
  2: { w: 4, strokes: [[[0, 1.2], [1.2, 0], [2.8, 0], [4, 1.2], [4, 2.3], [0, 6], [4, 6]]] },
  3: { w: 4, strokes: [[[0, 0.9], [0.9, 0], [3, 0], [4, 1], [4, 1.9], [3, 2.9], [1.3, 2.9]], [[3, 2.9], [4, 3.9], [4, 5], [3, 6], [0.9, 6], [0, 5.1]]] },
  4: { w: 4.2, strokes: [[[3.1, 6], [3.1, 0], [0, 4.3], [4.2, 4.3]]] },
  5: { w: 4, strokes: [[[3.9, 0], [0.3, 0], [0, 2.9], [2.8, 2.6], [4, 3.8], [4, 4.8], [2.8, 6], [1, 6], [0, 5.1]]] },
  6: { w: 4, strokes: [[[3.7, 0.5], [3, 0], [1.2, 0], [0, 1.2], [0, 4.8], [1.2, 6], [2.8, 6], [4, 4.8], [4, 3.9], [2.9, 2.8], [1.2, 2.8], [0, 3.8]]] },
  7: { w: 4, strokes: [[[0, 0], [4, 0], [1.5, 6]]] },
  8: { w: 4, strokes: [[[1, 0], [3, 0], [3.8, 0.8], [3.8, 2], [3, 2.8], [1, 2.8], [0.2, 2], [0.2, 0.8]], [[1, 2.8], [3, 2.8], [4, 3.8], [4, 5], [3, 6], [1, 6], [0, 5], [0, 3.8]]], closedAll: true },
  9: { w: 4, strokes: [[[4, 2.3], [2.8, 3.3], [1.2, 3.3], [0, 2.2], [0, 1.2], [1.2, 0], [2.8, 0], [4, 1.2], [4, 6]]] },
  '+': { w: 3.8, strokes: [[[1.9, 1.1], [1.9, 4.9]], [[0, 3], [3.8, 3]]], name: 'plus' },
  '−': { w: 3.8, strokes: [[[0, 3], [3.8, 3]]], name: 'minus' },
  '-': { w: 2.2, strokes: [[[0, 3.2], [2.2, 3.2]]], name: 'hyphen' }, // shorter and a touch lower than minus
  '×': { w: 3.2, strokes: [[[0, 1.4], [3.2, 4.6]], [[3.2, 1.4], [0, 4.6]]], name: 'multiply' },
  '÷': { w: 3.8, strokes: [[[0, 3], [3.8, 3]]], dots: [[1.9, 1.1, 0.78], [1.9, 4.9, 0.78]], name: 'divide' },
  '=': { w: 3.8, strokes: [[[0, 2], [3.8, 2]], [[0, 4.1], [3.8, 4.1]]], name: 'equals' },
  '?': { w: 3.6, strokes: [[[0, 1.2], [1.2, 0], [2.4, 0], [3.6, 1.2], [3.6, 2.1], [1.8, 3.4], [1.8, 4.3]]], dots: [[1.8, 5.95, 0.72]], name: 'question' },
  '/': { w: 3, strokes: [[[3, 0], [0, 6]]], name: 'slash' },
  '.': { w: 0.2, strokes: [], dots: [[0.1, 5.95, 0.72]], name: 'period' },
  ',': { w: 0.5, strokes: [[[0.5, 5.3], [0.5, 6], [0, 6.9]]], name: 'comma' },
  ':': { w: 0.2, strokes: [], dots: [[0.1, 1.9, 0.72], [0.1, 5.95, 0.72]], name: 'colon' },
  '%': { w: 5, t: 1, strokes: [[[0, 0.1], [1.8, 0.1], [1.8, 2.3], [0, 2.3]], [[3.2, 3.7], [5, 3.7], [5, 5.9], [3.2, 5.9]], [[4.3, 0], [0.7, 6]]], closedN: 2, name: 'percent' },
  '!': { w: 0.2, strokes: [[[0.1, 0], [0.1, 4.2]]], dots: [[0.1, 5.95, 0.72]], name: 'exclam' },
  "'": { w: 0, strokes: [[[0, 0], [0, 1.9]]], name: 'quotesingle' },
  '(': { w: 1.6, strokes: [[[1.6, -0.3], [0.2, 1.4], [0.2, 4.6], [1.6, 6.3]]], name: 'parenleft' },
  ')': { w: 1.6, strokes: [[[0, -0.3], [1.4, 1.4], [1.4, 4.6], [0, 6.3]]], name: 'parenright' },
  '²': { w: 2.4, t: 0.95, strokes: [[[0, 0.6], [0.6, 0], [1.8, 0], [2.4, 0.6], [2.4, 1.2], [0, 3], [2.4, 3]]], name: 'twosuperior' },
  ' ': { ...LETTERS[' '], name: 'space' },
};

// Characters people will type that map onto the set.
export const ALIASES = { x: '×', '*': '×' };
export const CHARS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', '+', '−', '-', '×', '÷', '=', '?', '/', '.', ',', ':', '%', '!', "'", '(', ')', '²', ' '];
export const glyphName = (ch) => G[ch].name ?? ch;
export const DIGITS = [...'0123456789'];

// Ribbon of width t along a polyline with mitred joints (as in symbols.mjs), one quad per segment. The mitres
// may run long; the letter box trims them, so sharp apexes (A, M, V, 4) end in clean cut corners with no notch.
function ribbon(pts, t, closed) {
  const n = pts.length, h = t / 2, segs = closed ? n : n - 1;
  const dir = (i) => { const a = pts[i % n], b = pts[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  const offs = pts.map((p, i) => {
    const prev = i > 0 || closed ? dir((i - 1 + n) % n) : null, next = i < n - 1 || closed ? dir(i) : null;
    const d = prev && next ? [prev[0] + next[0], prev[1] + next[1]] : prev ?? next;
    const l = Math.hypot(...d), u = [d[0] / l, d[1] / l], nrm = [-u[1], u[0]];
    const ref = next ?? prev, k = Math.min(h / Math.max(0.12, Math.abs(nrm[0] * -ref[1] + nrm[1] * ref[0])), h * 8);
    return [[p[0] + nrm[0] * k, p[1] + nrm[1] * k], [p[0] - nrm[0] * k, p[1] - nrm[1] * k]];
  });
  return [...Array(segs).keys()].map((i) => { const [a, b] = [offs[i], offs[(i + 1) % n]]; return [a[0], b[0], b[1], a[1]]; });
}
const octagon = (cx, cy, r) => [...Array(8).keys()].map((i) => { const a = Math.PI / 8 + (i * Math.PI) / 4; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });

// Polygons of one glyph with the pen at x = 0 (ink starts at SIDE), y down, ink 0..INK_H.
const cache = new Map();
export function glyph(chIn) {
  const ch = ALIASES[chIn] ?? chIn;
  if (cache.has(ch)) return cache.get(ch);
  const L = G[ch];
  if (!L) throw new Error(`no paper glyph for ${JSON.stringify(chIn)}`);
  const t = L.t ?? T, x = SIDE + T / 2;
  const [x0, x1, y0, y1] = [x - T / 2, x + L.w + T / 2, 0, INK_H];
  const box = (pts) => [[[x1, y0], [x0, y0]], [[x0, y0], [x0, y1]], [[x0, y1], [x1, y1]], [[x1, y1], [x1, y0]]].reduce((acc, [a, b]) => clipHalf(acc, a, b), pts);
  const polys = [];
  L.strokes.forEach((s, i) => {
    const closed = (L.closedN && i < L.closedN) || L.closedAll || (L.closed && L.strokes.length === 1) || (L.closedFirst && i === 0);
    const pts = s.map(([u, v]) => [x + u, v + T / 2]);
    for (const q of ribbon(pts, t, closed)) { const b = box(q); if (b.length > 2) polys.push(b); }
  });
  for (const [u, v, r] of L.dots ?? []) polys.push(octagon(x + u, v + T / 2, r));
  const g = { ch, name: glyphName(ch), polys, advance: L.w + T + 2 * SIDE, inkLeft: SIDE, inkRight: SIDE + L.w + T };
  cache.set(ch, g);
  return g;
}

// Left and right ink profile per row (in glyph units), softened vertically so dots and bars see their neighbours.
const ROWS = 40;
function profile(g) {
  const L = new Array(ROWS).fill(Infinity), R = new Array(ROWS).fill(-Infinity);
  for (let r = 0; r < ROWS; r++) {
    const y = ((r + 0.5) / ROWS) * INK_H;
    for (const p of g.polys) for (let i = 0; i < p.length; i++) {
      const [ax, ay] = p[i], [bx, by] = p[(i + 1) % p.length];
      if ((ay <= y) !== (by <= y)) { const xx = ax + ((y - ay) / (by - ay)) * (bx - ax); L[r] = Math.min(L[r], xx); R[r] = Math.max(R[r], xx); }
    }
  }
  const reach = Math.round(ROWS * 0.16), soft = (arr, f) => arr.map((_, r) => f(...arr.slice(Math.max(0, r - reach), r + reach + 1)));
  return { L: soft(L, Math.min), R: soft(R, Math.max) };
}

// Kerning (units) for a pair: pull glyphs together where the narrowest gap is much wider than a normal
// stem-to-stem gap, about half the difference, so A V, L T, 7 . and similar sit evenly.
const BASE_GAP = 2 * SIDE;
export function kern(a, b) {
  const ga = glyph(a), gb = glyph(b);
  if (!ga.polys.length || !gb.polys.length) return 0;
  const pa = profile(ga), pb = profile(gb);
  let min = Infinity;
  for (let r = 0; r < ROWS; r++) if (isFinite(pa.R[r]) && isFinite(pb.L[r])) min = Math.min(min, ga.advance - pa.R[r] + pb.L[r]);
  if (!isFinite(min) || min < BASE_GAP * 2.2) return 0;
  const k = -Math.min((min - BASE_GAP) * 0.5, 1.4);
  return Math.round(k * 20) / 20;
}
export const KERN_CHARS = CHARS.filter((c) => c !== ' ');
let kernTable = null;
export function kerning() {
  if (kernTable) return kernTable;
  kernTable = {};
  for (const a of KERN_CHARS) for (const b of KERN_CHARS) { const k = kern(a, b); if (k) kernTable[a + b] = k; }
  return kernTable;
}
// Tabular digits: every digit takes the widest digit's advance, centred, so a running clock does not wobble.
export const TAB_ADVANCE = Math.max(...DIGITS.map((d) => glyph(d).advance));

// Lays out one line at letter height lh px. '#' reserves a tabular digit slot (runs merge into one slot).
// Returns polygons in px, the advance width, the ink box, and slots [{ x, w, digits }].
export function layoutLine(text, lh) {
  const k = lh / INK_H, kt = kerning();
  const polys = [], slots = [];
  let x = 0, prev = null, inkMin = Infinity, inkMax = -Infinity;
  for (const chIn of text) {
    if (chIn === '#') {
      const last = slots[slots.length - 1];
      if (last && last.end === x) { last.w += TAB_ADVANCE * k; last.digits++; last.end = x + TAB_ADVANCE * k; }
      else slots.push({ x, w: TAB_ADVANCE * k, digits: 1, end: x + TAB_ADVANCE * k });
      inkMin = Math.min(inkMin, x); inkMax = Math.max(inkMax, x + TAB_ADVANCE * k);
      x += TAB_ADVANCE * k; prev = null; continue;
    }
    const ch = ALIASES[chIn] ?? chIn, g = glyph(ch);
    if (prev) x += (kt[prev + ch] ?? 0) * k;
    for (const p of g.polys) polys.push(p.map(([u, v]) => [x + u * k, v * k]));
    if (g.polys.length) { inkMin = Math.min(inkMin, x + g.inkLeft * k); inkMax = Math.max(inkMax, x + g.inkRight * k); }
    x += g.advance * k; prev = ch === ' ' ? null : ch;
  }
  return { polys, advance: x, inkMin, inkMax, width: inkMax - inkMin, slots: slots.map(({ x, w, digits }) => ({ x, w, digits })) };
}
