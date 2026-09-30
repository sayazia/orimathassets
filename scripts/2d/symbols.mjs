// Symbols for picture passwords, game badges and mission icons, and the folded-ribbon logo letters.
// All drawn in a 100 x 100 box (y down) from polygons only.
import { C, S, poly, ngon, folded, twoTone, facets, outline, rect, crane, clipHalf } from './svg.mjs';

const R = (a) => (a * Math.PI) / 180;
const line = ([ax, ay], [bx, by], w) => { // a straight strip of width w
  const l = Math.hypot(bx - ax, by - ay), nx = (-(by - ay) / l) * (w / 2), ny = ((bx - ax) / l) * (w / 2);
  return [[ax + nx, ay + ny], [bx + nx, by + ny], [bx - nx, by - ny], [ax - nx, ay - ny]];
};

// Crescent: circle (cx, cy, r) minus a circle shifted towards the upper right.
function crescent(cx, cy, r) {
  const [dx, dy, r2] = [r * 0.5, -r * 0.18, r * 0.84];
  const inC2 = ([x, y]) => Math.hypot(x - cx - dx, y - cy - dy) < r2;
  const inC1 = ([x, y]) => Math.hypot(x - cx, y - cy) < r;
  const around = (ox, oy) => ([x, y]) => (Math.atan2(y - oy, x - ox) + Math.PI * 2) % (Math.PI * 2); // 0 at +x
  const outer = ngon(cx, cy, r, 96).filter((p) => !inC2(p)).sort((p, q) => around(cx, cy)(p) - around(cx, cy)(q));
  const inner = ngon(cx + dx, cy + dy, r2, 96).filter(inC1).sort((p, q) => around(cx + dx, cy + dy)(q) - around(cx + dx, cy + dy)(p));
  // Re-start both arcs at their gap so each runs as one piece.
  const split = (arr) => { let k = 0, best = 0; arr.forEach((p, i) => { const q = arr[(i + 1) % arr.length], d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d > best) { best = d; k = i + 1; } }); return [...arr.slice(k), ...arr.slice(0, k)]; };
  return [...split(outer), ...split(inner)];
}
const heart = (cx, cy, s) => [...Array(48).keys()].map((i) => {
  const t = (i / 48) * Math.PI * 2;
  return [cx + s * 16 * Math.sin(t) ** 3, cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))];
});

// Picture-password symbols: nine shapes that differ in outline and in colour.
export const PICTURES = {
  star: () => facets(50, 53, [40, 16], 5, 'sunflower'),
  moon: () => { const p = crescent(50, 50, 38); return twoTone(p, 'violet', [20, 90], [80, 10]); },
  sun: () => facets(50, 50, [40, 26], 10, 'orange', 0) + facets(50, 50, [22, 22], 10, 'sunflower', 0),
  leaf: () => poly(line([30, 80], [18, 92], 5), C('pine')) + folded([[26, 76], [30, 34], [74, 16], [66, 60]], 'leaf', 0, 2),
  fish: () => twoTone([[10, 26], [32, 50], [10, 74]], 'cobalt', [0, 50], [40, 50]) + twoTone([[26, 50], [56, 24], [92, 50], [56, 76]], 'cobalt', [26, 50], [92, 50])
    + poly(ngon(74, 44, 5, 6), C('paper')),
  boat: () => poly([[50, 12], [50, 62], [22, 62]], C('paper')) + poly([[54, 22], [54, 62], [76, 62]], C('cream')) + poly(line([52, 10], [52, 66], 3), C('dark'))
    + twoTone([[8, 64], [92, 64], [78, 86], [22, 86]], 'red', [8, 72], [92, 72]),
  key: () => twoTone(ngon(32, 38, 22, 8, R(22.5)), 'teal', [0, 60], [60, 10]) + poly(ngon(32, 38, 8, 8, R(22.5)), C('paper'))
    + twoTone([[46, 50], [54, 44], [90, 82], [82, 90]], 'teal', [50, 47], [86, 86])
    + poly([[64, 72], [72, 66], [80, 74], [72, 80]], C('teal')) + poly([[74, 82], [82, 76], [88, 82], [82, 88]], S('teal')),
  heart: () => twoTone(heart(50, 46, 2.5), 'pink', [50, 100], [50, 0]),
  cloud: () => {
    const puffs = [[28, 56, 15], [50, 42, 21], [72, 52, 16]];
    const base = [[14, 60], [88, 60], [84, 74], [18, 74]];
    return puffs.map(([x, y, r]) => poly(ngon(x, y + 4, r, 8, R(22.5)), S('sky'))).join('') + poly(base.map(([x, y]) => [x, y + 2]), S('sky'))
      + puffs.map(([x, y, r]) => poly(ngon(x, y, r, 8, R(22.5)), C('sky'))).join('') + poly(base, C('sky'));
  },
};

// Game badges: a folded rosette, ribbon tails, a paper disc and a symbol of the game.
const GAME_SYMBOLS = {
  orb_forge: () => facets(50, 50, [20, 20], 8, 'sunflower', R(22.5)) + poly([[44, 38], [52, 36], [46, 44]], C('paper')),
  balloon_burst: () => poly(line([50, 64], [46, 82], 2), C('dark')) + twoTone(ngon(50, 42, 1, 12).map(([x, y]) => [50 + (x - 50) * 17, 42 + (y - 42) * 21]), 'coral', [50, 10], [50, 70])
    + poly([[46, 66], [54, 66], [50, 60]], S('coral')),
  factory_sort: () => poly([[50, 24], [74, 36], [50, 48], [26, 36]], C('cobalt')) + poly([[26, 36], [50, 48], [50, 76], [26, 64]], C('sky')) + poly([[74, 36], [50, 48], [50, 76], [74, 64]], S('cobalt')),
  bridge_builder: () => [0, 1, 2, 3, 4].map((i) => poly(rect(22 + i * 11.6, 40, 10, 8), i % 2 ? S('wood') : C('wood'))).join('')
    + poly([[20, 72], [30, 50], [70, 50], [80, 72], [70, 72], [62, 58], [38, 58], [30, 72]], C('teal')),
  balance_gate: () => poly([[50, 42], [60, 76], [40, 76]], S('violet')) + poly(rect(20, 36, 60, 6), C('violet'))
    + poly([[16, 50], [34, 50], [30, 58], [20, 58]], C('violet')) + poly([[66, 50], [84, 50], [80, 58], [70, 58]], S('violet'))
    + poly(line([25, 42], [22, 50], 1.6), C('dark')) + poly(line([25, 42], [30, 50], 1.6), C('dark')) + poly(line([75, 42], [72, 50], 1.6), C('dark')) + poly(line([75, 42], [80, 50], 1.6), C('dark')),
  measure_hunt: () => {
    const a = [22, 64], b = [72, 26], w = 16;
    let out = twoTone(line(a, b, w), 'orange', a, b);
    for (let i = 1; i < 9; i++) { const t = i / 9, p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], n = [0.6, 0.8]; const L = i % 3 ? 4 : 7; out += poly(line([p[0] - n[0] * 8, p[1] - n[1] * 8], [p[0] - n[0] * (8 - L), p[1] - n[1] * (8 - L)], 1.6), C('dark')); }
    return out;
  },
};
export const GAME_COLOURS = { orb_forge: 'sunflower', balloon_burst: 'coral', factory_sort: 'cobalt', bridge_builder: 'teal', balance_gate: 'violet', measure_hunt: 'orange' };
export function gameBadge(id) {
  const k = GAME_COLOURS[id];
  const tails = poly([[34, 70], [46, 74], [40, 98], [34, 92], [28, 96]], S(k)) + poly([[66, 70], [54, 74], [60, 98], [66, 92], [72, 96]], C(k));
  const rosette = facets(50, 44, [42, 36], 12, k);
  const disc = poly(ngon(50, 44, 30, 16), C('paper')) + poly(ngon(50, 44, 30, 16).filter(([x, y]) => x + y >= 94 - 1e-6), C('cream'));
  const body = tails + rosette + disc;
  return outline(body, 4) + body + `<g transform="translate(9 3) scale(0.82)">${GAME_SYMBOLS[id]()}</g>`;
}

// Mission icons: a two-tone disc in the mission colour with a paper symbol, no numbers.
const MISSION_SYMBOLS = {
  place_value: () => poly(rect(24, 62, 10, 10), C('paper')) + [0, 1, 2, 3, 4].map((i) => poly(rect(38, 32 + i * 8, 10, 7), C('paper'))).join('')
    + [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => poly(rect(52 + c * 8.4, 48 + r * 8.4, 7.4, 7.4), (r + c) % 2 ? C('cream') : C('paper')))).join(''),
  multiply_divide: () => [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => poly(ngon(32 + c * 18, 32 + r * 18, 7, 4), C('paper')))).join(''),
  fractions: () => { const p = [[50, 50], ...ngon(50, 50, 28, 24).slice(6)]; return poly(p, C('paper')) + poly([[55, 55], ...ngon(55, 55, 26, 24).slice(0, 7)], C('cream')); },
  decimals: () => [...Array(10).keys()].map((i) => poly(rect(24 + i * 5.3, 26, 4.6, 48), i < 3 ? C('paper') : C('cream'))).join('')
    + poly(ngon(78, 72, 4, 8), C('paper')),
  measurement: () => { let out = poly(rect(18, 40, 64, 22), C('paper')); for (let i = 1; i < 12; i++) out += poly(rect(18 + i * 5.33 - 0.8, 40, 1.6, i % 4 ? 7 : 12), C('dark')); return out; },
};
export function missionIcon(id) {
  const disc = ngon(50, 50, 46, 24);
  return twoTone(disc, id, [0, 100], [100, 0]) + MISSION_SYMBOLS[id]();
}

// Logo letters as folded paper ribbons: a centre line per stroke, 4 units wide and 6 tall (y down).
const LETTERS = {
  F: { w: 3.6, strokes: [[[3.6, 0], [0, 0], [0, 6]], [[0, 2.9], [2.8, 2.9]]] },
  O: { w: 4, strokes: [[[1.2, 0], [2.8, 0], [4, 1.2], [4, 4.8], [2.8, 6], [1.2, 6], [0, 4.8], [0, 1.2]]], closed: true },
  L: { w: 3.4, strokes: [[[0, 0], [0, 6], [3.4, 6]]] },
  D: { w: 4, strokes: [[[0, 0], [2.4, 0], [4, 1.6], [4, 4.4], [2.4, 6], [0, 6]]], closed: true },
  I: { w: 0, strokes: [[[0, 0], [0, 6]]] },
  N: { w: 4, strokes: [[[0, 6], [0, 0], [4, 6], [4, 0]]] },
  G: { w: 4, strokes: [[[4, 1.2], [2.8, 0], [1.2, 0], [0, 1.2], [0, 4.8], [1.2, 6], [2.8, 6], [4, 4.8], [4, 3.3], [2.2, 3.3]]] },
  S: { w: 4, strokes: [[[4, 1.1], [2.9, 0], [1.1, 0], [0, 1.1], [0, 1.9], [1.1, 3], [2.9, 3], [4, 4.1], [4, 4.9], [2.9, 6], [1.1, 6], [0, 4.9]]] },
  T: { w: 4, strokes: [[[0, 0], [4, 0]], [[2, 0], [2, 6]]] },
  A: { w: 4.4, strokes: [[[0, 6], [2.2, 0], [4.4, 6]], [[1, 4], [3.4, 4]]] },
  R: { w: 4, strokes: [[[0, 6], [0, 0], [2.8, 0], [4, 1.2], [4, 1.9], [2.8, 3.1], [0, 3.1]], [[2.2, 3.1], [4, 6]]] },
  H: { w: 4, strokes: [[[0, 0], [0, 6]], [[4, 0], [4, 6]], [[0, 3], [4, 3]]] },
  E: { w: 3.6, strokes: [[[3.6, 0], [0, 0], [0, 6], [3.6, 6]], [[0, 3], [3, 3]]] },
  Y: { w: 4.4, strokes: [[[0, 0], [2.2, 3.2], [4.4, 0]], [[2.2, 3.2], [2.2, 6]]] },
  U: { w: 4, strokes: [[[0, 0], [0, 4.8], [1.2, 6], [2.8, 6], [4, 4.8], [4, 0]]] },
  W: { w: 6, strokes: [[[0, 0], [1.5, 6], [3, 1.6], [4.5, 6], [6, 0]]] },
};
// One flat colour, no fold tones: every ribbon quad of the word, for lettering printed on a label.
export function wordFlat(text, t = 1.3, gap = 1.7) {
  const quads = [];
  let x = t / 2;
  for (const ch of text) {
    const L = LETTERS[ch];
    const [x0, x1, y0, y1] = [x - t / 2, x + L.w + t / 2, 0, 6 + t];
    const box = (pts) => [[[x1, y0], [x0, y0]], [[x0, y0], [x0, y1]], [[x0, y1], [x1, y1]], [[x1, y1], [x1, y0]]].reduce((acc, [a, b]) => clipHalf(acc, a, b), pts);
    for (const s of L.strokes) for (const quad of ribbon(s.map(([u, v]) => [x + u, v + t / 2]), t, L.closed)) quads.push(box(quad));
    x += L.w + gap;
  }
  return { quads, width: x - gap + t / 2, height: 6 + t };
}
// Offsets a polyline to a ribbon of width t with mitred joints; returns one quad per segment.
function ribbon(pts, t, closed) {
  const n = pts.length, h = t / 2, segs = closed ? n : n - 1;
  const dir = (i) => { const a = pts[i % n], b = pts[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  const offs = pts.map((p, i) => {
    const prev = i > 0 || closed ? dir((i - 1 + n) % n) : null, next = i < n - 1 || closed ? dir(i) : null;
    const d = prev && next ? [prev[0] + next[0], prev[1] + next[1]] : prev ?? next;
    const l = Math.hypot(...d), u = [d[0] / l, d[1] / l], nrm = [-u[1], u[0]];
    const ref = next ?? prev, k = Math.min(h / Math.max(0.35, Math.abs(nrm[0] * -ref[1] + nrm[1] * ref[0])), h * 2.6);
    return [[p[0] + nrm[0] * k, p[1] + nrm[1] * k], [p[0] - nrm[0] * k, p[1] - nrm[1] * k]];
  });
  return [...Array(segs).keys()].map((i) => { const [a, b] = [offs[i], offs[(i + 1) % n]]; return [a[0], b[0], b[1], a[1]]; });
}
// Returns { body, width } for the word in unit space (letter height 6), letters coloured in turn.
export function word(text, keys, t = 1.3, gap = 1.7) {
  let x = t / 2, under = '', body = '';
  [...text].forEach((ch, li) => {
    const L = LETTERS[ch], k = keys[li % keys.length];
    let q = 0;
    const [x0, x1, y0, y1] = [x - t / 2, x + L.w + t / 2, 0, 6 + t]; // sharp mitres are trimmed to the letter box
    const box = (pts) => [[[x1, y0], [x0, y0]], [[x0, y0], [x0, y1]], [[x0, y1], [x1, y1]], [[x1, y1], [x1, y0]]].reduce((acc, [a, b]) => clipHalf(acc, a, b), pts);
    for (const s of L.strokes) for (const quad of ribbon(s.map(([u, v]) => [x + u, v + t / 2]), t, L.closed)) {
      const p = poly(box(quad), q++ % 2 ? S(k) : C(k));
      under += p; body += p;
    }
    x += L.w + gap;
  });
  return { under, body, width: x - gap + t / 2, height: 6 + t };
}
export { crane };
