// Tiny SVG kit for the 2D Foldlings assets: faceted two-tone paper shapes from the shared palette.
// Every shape is a polygon; no fonts or third-party images are used anywhere.
import { colourOf } from '../lib/palette.mjs';

export const C = (key) => colourOf(key);
export const S = (key) => colourOf(key + '_shade');

const f = (n) => +n.toFixed(2);
export const poly = (pts, fill, extra = '') => `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}" fill="${fill}"${extra}/>`;
export const circle = (cx, cy, r, fill, extra = '') => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"${extra}/>`;
export const ngon = (cx, cy, r, n, rot = 0) => [...Array(n).keys()].map((i) => { const a = rot + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
export const g = (body, t = '') => `<g${t ? ` transform="${t}"` : ''}>${body}</g>`;
export const svg = (w, h, body, vb = `0 0 ${w} ${h}`) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}">${body}</svg>\n`;

// Splits a convex polygon into a lit and a shaded half along the line a-b (indices), like a valley fold.
export function folded(pts, key, i = 0, j = Math.floor(pts.length / 2)) {
  const A = pts.slice(i, j + 1), B = [...pts.slice(j), ...pts.slice(0, i + 1)];
  return poly(A, C(key)) + poly(B, S(key));
}
// Ink contour around a polygon (drawn underneath to read on any background).
export const inked = (pts, w = 6) => poly(pts, C('ink'), ` stroke="${C('ink')}" stroke-width="${w}" stroke-linejoin="round"`);

// A classic origami crane facing right, in a 100 x 100 box.
export function crane(key = 'coral', trim = 'cream', ink = true) {
  const parts = [
    [[16, 60], [84, 60], [50, 78]], // body keel
    [[34, 58], [52, 60], [18, 8]], // far wing, swept back
    [[46, 60], [66, 58], [44, 2]], // near wing
    [[64, 62], [74, 59], [90, 28], [87, 27]], // neck
    [[87, 27], [92, 25], [99, 38]], // head and beak
    [[36, 62], [26, 59], [2, 42], [5, 40]], // tail
  ];
  let out = ink ? parts.map((p) => inked(p, 5)).join('') : '';
  out += poly(parts[0], S(key)) + poly([[16, 60], [50, 60], [50, 78]], C(key));
  out += poly(parts[1], S(key)) + poly([[34, 58], [43, 59], [18, 8]], C(trim));
  out += folded(parts[2], key, 0, 2);
  out += poly(parts[3], C(key)) + poly(parts[4], S(key)) + poly(parts[5], C(key));
  return out;
}

// Open book seen from the front, in a 100 x 60 box.
export function book() {
  let out = poly([[2, 18], [50, 26], [98, 18], [98, 56], [50, 60], [2, 56]], C('navy'));
  out += poly([[6, 14], [50, 22], [50, 54], [6, 50]], C('paper')) + poly([[94, 14], [50, 22], [50, 54], [94, 50]], S('paper'));
  out += poly([[6, 50], [50, 54], [50, 57], [6, 53]], C('cream')) + poly([[94, 50], [50, 54], [50, 57], [94, 53]], S('cream'));
  out += poly([[2, 56], [50, 60], [98, 56], [98, 58], [50, 62], [2, 58]], C('gold'));
  return out;
}

// Keeps the part of a polygon on the left of the directed line a -> b (Sutherland-Hodgman, one plane).
export function clipHalf(pts, [ax, ay], [bx, by]) {
  const side = ([x, y]) => (bx - ax) * (y - ay) - (by - ay) * (x - ax);
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length], sp = side(p), sq = side(q);
    if (sp <= 0) out.push(p);
    if ((sp < 0) !== (sq < 0) && sp !== sq) { const t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
  }
  return out;
}
// Whole shape in the lit tone, with the half beyond the fold line a -> b in the shade tone.
export function twoTone(pts, key, a, b) {
  const s = clipHalf(pts, b, a);
  return poly(pts, C(key)) + (s.length > 2 ? poly(s, S(key)) : '');
}
// Star-like shape split into facets that alternate lit and shade, like a folded rosette.
export function facets(cx, cy, radii, n, key, rot = -Math.PI / 2) {
  const m = radii.length, pts = ngon(cx, cy, 1, n * m, rot).map(([x, y], i) => [cx + (x - cx) * radii[i % m], cy + (y - cy) * radii[i % m]]);
  return pts.map((p, i) => poly([[cx, cy], p, pts[(i + 1) % pts.length]], i % 2 ? S(key) : C(key))).join('');
}
// The same drawing flattened to one colour and fattened, drawn under it as a contour.
export const outline = (body, w = 5, colour = C('ink')) =>
  body.replace(/fill="[^"]+"/g, `fill="${colour}" stroke="${colour}" stroke-width="${w}" stroke-linejoin="round"`);
export const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
