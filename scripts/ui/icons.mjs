// Icon symbols for Numeria Arena, drawn in one colour from flat paper pieces in a 100 x 100 box (y down).
// Details are cut out (gaps between pieces, holes left open) rather than drawn in a second colour, so each
// icon embosses exactly like the paper letters.
const rad = (a) => (a * Math.PI) / 180;
export const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
export const ngon = (cx, cy, r, n = 16, rot = 0, ry = r) => [...Array(n).keys()].map((i) => { const a = rot + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * ry]; });
// straight strip of width w from a to b
export const strip = ([ax, ay], [bx, by], w) => {
  const l = Math.hypot(bx - ax, by - ay), nx = (-(by - ay) / l) * (w / 2), ny = ((bx - ax) / l) * (w / 2);
  return [[ax + nx, ay + ny], [bx + nx, by + ny], [bx - nx, by - ny], [ax - nx, ay - ny]];
};
// polyline strip with mitred joints, as one polygon per segment plus a joint square
const path = (pts, w) => { const out = []; for (let i = 0; i < pts.length - 1; i++) out.push(strip(pts[i], pts[i + 1], w)); for (let i = 1; i < pts.length - 1; i++) out.push(ngon(pts[i][0], pts[i][1], w / 2 / Math.cos(Math.PI / 8), 8, Math.PI / 8)); return out; };
// ring segment from angle a0 to a1 (degrees, 0 = +x, clockwise on screen), as quads
export const arc = (cx, cy, r, w, a0, a1, n = 24) => [...Array(n).keys()].map((i) => {
  const t0 = rad(a0 + ((a1 - a0) * i) / n), t1 = rad(a0 + ((a1 - a0) * (i + 1)) / n), ri = r - w / 2, ro = r + w / 2;
  return [[cx + Math.cos(t0) * ro, cy + Math.sin(t0) * ro], [cx + Math.cos(t1) * ro, cy + Math.sin(t1) * ro], [cx + Math.cos(t1) * ri, cy + Math.sin(t1) * ri], [cx + Math.cos(t0) * ri, cy + Math.sin(t0) * ri]];
});
// shrinks a polygon towards its centroid, leaving a cut between neighbouring pieces
const pie = (cx, cy, r, a0, a1, n = 24) => [[cx, cy], ...[...Array(n + 1).keys()].map((i) => { const a = rad(a0 + ((a1 - a0) * i) / n); return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; })];
const inset = (pts, d) => { const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length; return pts.map(([x, y]) => { const l = Math.hypot(x - cx, y - cy) || 1; return [x - ((x - cx) / l) * d, y - ((y - cy) / l) * d]; }); };
const frame = (x0, y0, x1, y1, w) => [rect(x0, y0, x1, y0 + w), rect(x0, y1 - w, x1, y1), rect(x0, y0 + w, x0 + w, y1 - w), rect(x1 - w, y0 + w, x1, y1 - w)];
const slash = () => [strip([18, 18], [82, 82], 9)];
const speaker = () => [rect(12, 38, 28, 62), [[28, 38], [48, 20], [48, 80], [28, 62]]];
const robotHead = (x, y, s) => { // head with two eye holes, antenna and ears; box about 64 x 70 at s = 1
  const P = (pts) => pts.map(([u, v]) => [x + u * s, y + v * s]);
  return [rect(0, 18, 64, 30), rect(0, 42, 64, 62), rect(0, 30, 12, 42), rect(24, 30, 40, 42), rect(52, 30, 64, 42),
    rect(28.5, 6, 35.5, 18), ngon(32, 4, 6, 8, Math.PI / 8), rect(-8, 30, -2, 50), rect(66, 30, 72, 50)].map(P);
};
const bookOpen = () => [[[8, 30], [46, 36], [46, 82], [8, 76]], [[92, 30], [54, 36], [54, 82], [92, 76]]];

export const ICONS = {
  back: () => [rect(40, 43, 84, 57), [[14, 50], [46, 20], [46, 80]]],
  next: () => [rect(16, 43, 60, 57), [[86, 50], [54, 20], [54, 80]]],
  skip: () => [[[14, 24], [46, 50], [14, 76]], [[46, 24], [78, 50], [46, 76]], rect(78, 24, 88, 76)],
  home: () => [[[50, 12], [90, 48], [10, 48]], rect(20, 50, 42, 86), rect(58, 50, 80, 86), rect(42, 50, 58, 62)],
  replay: () => [...arc(50, 52, 30, 12, -40, 230), [[72, 12], [86, 44], [52, 40]]],
  play: () => [[[28, 16], [84, 50], [28, 84]]],
  pause: () => [rect(24, 18, 42, 82), rect(58, 18, 76, 82)],
  settings: () => [...arc(50, 50, 24, 16, 0, 360, 32), ...[...Array(8).keys()].map((i) => { const a = (i * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a); return [[-7, 30], [7, 30], [6, 44], [-6, 44]].map(([u, v]) => [50 + u * -s + v * c, 50 + u * c + v * s]); })],
  sound_on: () => [...speaker(), ...arc(50, 50, 16, 8, -45, 45, 8), ...arc(50, 50, 32, 8, -48, 48, 12)],
  sound_off: () => [...speaker(), strip([60, 36], [86, 64], 9), strip([86, 36], [60, 64], 9)],
  music: () => [ngon(30, 74, 13, 16, 0, 10), ngon(72, 66, 13, 16, 0, 10), rect(35, 22, 43, 74), rect(77, 14, 85, 66), [[35, 22], [85, 12], [85, 26], [35, 36]]],
  music_off: () => [...ICONS.music(), ...slash()],
  captions: () => [...frame(10, 20, 90, 80, 8), rect(24, 38, 76, 46), rect(24, 54, 62, 62)],
  captions_off: () => [...ICONS.captions(), ...slash()],
  language: () => [rect(8, 12, 54, 46), [[16, 46], [30, 46], [12, 60]], rect(46, 52, 92, 84), [[74, 84], [86, 84], [90, 96]]],
  check: () => path([[18, 52], [40, 74], [84, 28]], 14),
  cross: () => [strip([28, 28], [72, 72], 14), strip([72, 28], [28, 72], 14), ...[[28, 28], [72, 72], [72, 28], [28, 72]].map(([x, y]) => ngon(x, y, 7.5, 8, Math.PI / 8))],
  close: () => [strip([30, 30], [70, 70], 10), strip([70, 30], [30, 70], 10)],
  star: () => [ngon(50, 54, 1, 10, -Math.PI / 2).map(([x, y], i) => { const r = i % 2 ? 18 : 42; return [50 + (x - 50) * r, 54 + (y - 54) * r]; })],
  clock: () => [...arc(50, 50, 36, 10, 0, 360, 36), rect(45, 24, 55, 55), rect(45, 45, 70, 55)],
  robot: () => robotHead(18, 18, 1),
  you: () => [ngon(50, 30, 17, 16), [[16, 88], [20, 66], [36, 54], [64, 54], [80, 66], [84, 88]]],
  trophy: () => [[[26, 14], [74, 14], [70, 44], [58, 56], [42, 56], [30, 44]], rect(44, 56, 56, 70), rect(30, 70, 70, 84), ...arc(26, 30, 12, 6, 90, 270, 10), ...arc(74, 30, 12, 6, -90, 90, 10)],
  lock: () => [rect(22, 46, 44, 86), rect(56, 46, 78, 86), rect(44, 46, 56, 58), rect(44, 72, 56, 86), ...arc(50, 46, 18, 9, 180, 360, 16)],
  info: () => [ngon(50, 22, 9, 8, Math.PI / 8), rect(43, 38, 57, 80), rect(34, 38, 43, 46), rect(34, 76, 66, 84)],
  hand_poke: () => [rect(42, 10, 56, 52), [[32, 52], [78, 46], [80, 74], [70, 88], [40, 88], [30, 74]], [[32, 56], [16, 46], [12, 54], [30, 72]]],
  hand_pinch: () => [strip([28, 34], [74, 44], 13), strip([28, 72], [74, 56], 13), [[6, 26], [34, 28], [34, 78], [6, 86]]],
};

// Large icons: game and mission symbols, plus robot race and practice.
export const LARGE = {
  robot_race: () => [...robotHead(10, 44, 0.42), ...robotHead(46, 44, 0.42), rect(78, 12, 82, 90),
    ...[0, 1, 2, 3].flatMap((r) => [0, 1, 2].filter((c) => (r + c) % 2 === 0).map((c) => rect(82 + c * 5.5, 14 + r * 5.5, 87.5 + c * 5.5, 19.5 + r * 5.5)))],
  practice: () => bookOpen(),
  orb_forge: () => ngon(50, 50, 34, 8, Math.PI / 8).map((p, i, a) => inset([[50, 50], p, a[(i + 1) % a.length]], 2.2)),
  balloon_burst: () => [ngon(50, 42, 24, 20, 0, 28), [[44, 72], [56, 72], [50, 66]], strip([50, 72], [46, 92], 4), strip([14, 26], [22, 32], 5), strip([86, 26], [78, 32], 5), strip([10, 50], [20, 50], 5), strip([90, 50], [80, 50], 5)],
  factory_sort: () => [inset([[50, 16], [84, 34], [50, 52], [16, 34]], 2), inset([[16, 34], [50, 52], [50, 88], [16, 70]], 2), inset([[84, 34], [50, 52], [50, 88], [84, 70]], 2)],
  bridge_builder: () => [...[0, 1, 2, 3, 4].map((i) => rect(8 + i * 17, 34, 22 + i * 17, 44)), ...arc(50, 88, 34, 9, 180, 360, 20), rect(12, 44, 20, 88), rect(80, 44, 88, 88)],
  balance_gate: () => [[[50, 34], [62, 84], [38, 84]], rect(12, 26, 88, 33), [[8, 56], [32, 56], [28, 64], [12, 64]], [[68, 56], [92, 56], [88, 64], [72, 64]], strip([18, 33], [12, 56], 3), strip([26, 33], [30, 56], 3), strip([82, 33], [88, 56], 3), strip([74, 33], [70, 56], 3)],
  measure_hunt: () => [rect(8, 62, 92, 72), ...[...Array(9).keys()].map((i) => rect(10 + i * 9.5, 72, 15 + i * 9.5, i % 2 ? 80 : 88)), ...arc(40, 30, 18, 8, 0, 360, 28), strip([53, 43], [66, 56], 9)],
  place_value: () => [rect(14, 66, 26, 78), ...[0, 1, 2, 3, 4].map((i) => rect(32, 34 + i * 9, 44, 42 + i * 9)), ...[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => rect(50 + c * 12, 50 + r * 12, 60 + c * 12, 60 + r * 12)))],
  multiply_divide: () => [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ngon(28 + c * 22, 28 + r * 22, 8, 8, Math.PI / 8))),
  fractions: () => [pie(46, 54, 32, 0, 270), pie(53, 47, 32, 270, 360)],
  decimals: () => [...Array(10).keys()].map((i) => rect(14 + i * 7.4, i < 3 ? 18 : 28, 19.4 + i * 7.4, 82)),
  measurement: () => [rect(10, 36, 90, 48), ...[...Array(9).keys()].map((i) => rect(12 + i * 9.5, 48, 17 + i * 9.5, i % 2 ? 58 : 66))],
};
export const LARGE_NAMES = {
  robot_race: 'icon_robot_race', practice: 'icon_practice',
  orb_forge: 'game_orb_forge', balloon_burst: 'game_balloon_burst', factory_sort: 'game_factory_sort', bridge_builder: 'game_bridge_builder', balance_gate: 'game_balance_gate', measure_hunt: 'game_measure_hunt',
  place_value: 'mission_place_value', multiply_divide: 'mission_multiply_divide', fractions: 'mission_fractions', decimals: 'mission_decimals', measurement: 'mission_measurement',
};
// Places a 100-box symbol into px: top-left (x, y), size s.
export const place = (polys, x, y, s) => polys.map((p) => p.map(([u, v]) => [x + (u * s) / 100, y + (v * s) / 100]));
