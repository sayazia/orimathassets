// B7: rewards and 3D UI, B8: effects. Millimetres; standing pieces face the player (+Z).
import { plate, blob } from '../lib/origami.mjs';

const both = (f) => { f(1); f(-1); };
const ring = (n, r, off = 0, cx = 0, cy = 0) => [...Array(n).keys()].map((i) => { const a = off + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });

// Puffy folded 5-point star in the xy plane centred on (cx, cy), depth +-d.
function puffyStar(m, c, cx, cy, R, d, z = 0) {
  const outer = ring(5, R, Math.PI / 2, cx, cy), inner = ring(5, R * 0.45, Math.PI / 2 + Math.PI / 5, cx, cy);
  for (let i = 0; i < 5; i++) {
    const a = outer[i], l = inner[(i + 4) % 5], r = inner[i];
    m.hull(c, [[a[0], a[1], z], [l[0], l[1], z], [r[0], r[1], z], [cx, cy, z + d], [cx, cy, z - d]]);
  }
}
// Flat extruded convex polygon in the xy plane.
function flatPoly(m, c, pts, z0, z1) {
  m.hull(c, [...pts.map(([x, y]) => [x, y, z0]), ...pts.map(([x, y]) => [x, y, z1])]);
}

// ------------------------------------------------------------------ B7 rewards
function star(rig) {
  rig.root.add('star', [0, 0, 0]).mesh((m) => puffyStar(m, 'gold*', 0, 0, 25, 8));
}
function starEmpty(rig) {
  rig.root.add('star', [0, 0, 0]).mesh((m) => {
    const outer = ring(5, 25, Math.PI / 2), inner = ring(5, 11.25, Math.PI / 2 + Math.PI / 5);
    const pts = []; for (let i = 0; i < 5; i++) pts.push(outer[i], inner[i]);
    for (let i = 0; i < 10; i++) m.beam('cream*', [...pts[i], 0], [...pts[(i + 1) % 10], 0], 3); // paper outline of a star
  });
}

const SYMBOLS = {
  // open hand catching a ball
  best_save: (m, c) => {
    flatPoly(m, c, [[-12, -6], [12, -6], [14, 2], [-14, 2]], 4, 7);
    both((s) => flatPoly(m, c, [[s * 10, 0], [s * 16, 2], [s * 17, 13], [s * 12, 13]], 4, 7));
    flatPoly(m, c, ring(8, 5.5, 0, 0, 10), 4, 7.5);
  },
  // arrow pointing up
  most_improved: (m, c) => {
    flatPoly(m, c, [[-4, -15], [4, -15], [4, 4], [-4, 4]], 4, 7);
    flatPoly(m, c, [[-12, 3], [12, 3], [0, 16]], 4, 7);
  },
  // target: two rings and a bullseye
  sharpest_aim: (m, c) => {
    for (const [r0, r1] of [[13, 16.5]]) for (let i = 0; i < 12; i++) {
      const a0 = (i / 12) * Math.PI * 2, a1 = ((i + 1) / 12) * Math.PI * 2;
      flatPoly(m, c, [[Math.cos(a0) * r0, Math.sin(a0) * r0], [Math.cos(a1) * r0, Math.sin(a1) * r0], [Math.cos(a1) * r1, Math.sin(a1) * r1], [Math.cos(a0) * r1, Math.sin(a0) * r1]], 4, 7);
    }
    for (let i = 0; i < 10; i++) {
      const a0 = (i / 10) * Math.PI * 2, a1 = ((i + 1) / 10) * Math.PI * 2, r0 = 6.5, r1 = 9.5;
      flatPoly(m, c, [[Math.cos(a0) * r0, Math.sin(a0) * r0], [Math.cos(a1) * r0, Math.sin(a1) * r0], [Math.cos(a1) * r1, Math.sin(a1) * r1], [Math.cos(a0) * r1, Math.sin(a0) * r1]], 4, 7);
    }
    flatPoly(m, c, ring(8, 3.2), 4, 7.5);
  },
  // chain of three links
  steady_streak: (m, c) => {
    for (const k of [-1, 0, 1]) {
      const cx = k * 11, cy = k * 5, w = 7, h = 4.5;
      const pts = [[-w, -h], [w, -h], [w, h], [-w, h]].map(([x, y]) => [cx + x, cy + y]);
      for (let i = 0; i < 4; i++) m.beam(c, [...pts[i], 5.5], [...pts[(i + 1) % 4], 5.5], 2.6);
    }
  },
  // mountain with a snowy peak
  brave_try: (m, c) => {
    flatPoly(m, c, [[-17, -12], [7, -12], [-5, 12]], 4, 7);
    flatPoly(m, c, [[-3, -12], [17, -12], [8, 5]], 4, 6.5);
    flatPoly(m, 'cream', [[-9, 4], [-1, 4], [-5, 12]], 7, 8.2);
  },
};
function badge(kind, colour) {
  return (rig) => {
    const M = colour + '*';
    const b = rig.root.add('badge', [0, 0, 0]);
    b.mesh((m) => {
      // 12-point folded rosette rim in gold, coloured disc, raised paper symbol
      const rim = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, r = i % 2 ? 26 : 30; rim.push([Math.cos(a) * r, Math.sin(a) * r]); }
      for (let i = 0; i < 12; i++) flatPoly(m, 'gold*', [[0, 0], rim[i * 2], rim[i * 2 + 1], rim[(i * 2 + 2) % 24]], -3, 2);
      flatPoly(m, M, ring(16, 22), 1, 4);
      SYMBOLS[kind](m, 'cream');
    });
    const ribbon = rig.root.add('ribbon', [0, -18, -2]);
    ribbon.mesh((m) => both((s) => flatPoly(m, M, [[s * 4, -16], [s * 16, -16], [s * 20, -46], [s * 13, -41], [s * 7, -48]].slice(0, 4).concat([[s * 6, -44]]), -4, -1.5)));
  };
}
function streakShield(rig) {
  rig.root.add('shield', [0, 0, 0]).mesh((m) => {
    const outer = [[-22, 25], [22, 25], [22, -2], [0, -25], [-22, -2]], inner = [[-17, 20.5], [17, 20.5], [17, 0], [0, -18.5], [-17, 0]];
    flatPoly(m, 'gold*', outer, -3, 2);
    flatPoly(m, 'orange*', inner, 1.5, 4);
    for (let i = 0; i < 3; i++) { const y = 10 - i * 9; flatPoly(m, 'cream', [[-10, y], [0, y - 6], [0, y - 2], [-10, y + 4]], 4, 6.5); flatPoly(m, 'cream', [[10, y], [0, y - 6], [0, y - 2], [10, y + 4]], 4, 6.5); } // streak chevrons
  });
}
function trophy(rig) {
  rig.root.add('trophy', [0, 0, 0]).mesh((m) => {
    m.frustum('gold*', [0, 0], 18, 15, 0, 7, 8, Math.PI / 8);
    m.box('cream*', [-12, 7, -9], [12, 17, 9]); // plinth
    m.frustum('gold*', [0, 0], 7, 3.5, 17, 34, 6, 0);
    m.frustum('gold*', [0, 0], 8, 12, 34, 42, 8, Math.PI / 8);
    m.frustum('gold*', [0, 0], 12, 22, 42, 76, 8, Math.PI / 8); // folded cup
    both((s) => { m.beam('gold*', [s * 20, 70, 0], [s * 29, 64, 0], 4); m.beam('gold*', [s * 29, 64, 0], [s * 25, 50, 0], 4); m.beam('gold*', [s * 25, 50, 0], [s * 15, 48, 0], 4); }); // handles
    puffyStar(m, 'cream', 0, 58, 7, 3, 21);
  });
}

// ------------------------------------------------------------------ 3D UI
function paperButton(rig) {
  const card = rig.root.add('card', [0, 0, 0]);
  card.mesh((m) => {
    m.box('cream*', [-50, 0, -6], [50, 65, -1]); // backing card
    m.hull('cream*', [[-50, 0, -6], [50, 0, -6], [-50, 0, 6], [50, 0, 6], [-50, 3, -6], [50, 3, -6], [-50, 3, 6], [50, 3, 6]]); // foot fold
  });
  const press = card.add('press', [0, 32.5, 0]);
  press.mesh((m) => m.hull('sky*', [[-44, 5, -1], [44, 5, -1], [-44, 60, -1], [44, 60, -1], [-41, 8, 6], [41, 8, 6], [-41, 57, 6], [41, 57, 6]]));
  press.anchorAt('label_anchor', [0, 32.5, 6.5]);
}
function paperPanel(rig) {
  const p = rig.root.add('panel', [0, 0, 0]);
  p.mesh((m) => {
    m.box('paper*', [-150, 0, -5], [150, 200, 3]);
    for (const [x, y] of [[-150, 200], [150, 200], [-150, 0], [150, 0]]) flatPoly(m, 'cream*', [[x, y], [x - Math.sign(x) * 26, y], [x, y - Math.sign(y - 100) * 26]], 3, 5); // folded corners
    m.box('cream*', [-150, 0, -5], [150, 6, 8]); // bottom fold
  });
  p.anchorAt('label_anchor', [0, 100, 3.5]);
}
function palmDisc(rig) {
  const d = rig.root.add('disc', [0, 0, 0]);
  d.mesh((m) => {
    for (let i = 0; i < 8; i++) { // eight folded petals
      const a0 = (i / 8) * Math.PI * 2, a1 = ((i + 1) / 8) * Math.PI * 2;
      flatPoly(m, i % 2 ? 'violet*' : 'lavender', [[0, 0], [Math.cos(a0) * 40, Math.sin(a0) * 40], [Math.cos(a1) * 40, Math.sin(a1) * 40]], -2, 1 + (i % 2));
    }
    flatPoly(m, 'paper', ring(8, 11, Math.PI / 8), 1, 4);
  });
  for (let i = 0; i < 4; i++) { const a = Math.PI / 2 - (i / 4) * Math.PI * 2; d.anchorAt(`slot_${i}`, [Math.cos(a) * 26, Math.sin(a) * 26, 3]); }
}

// ------------------------------------------------------------------ B8 effects
function confetti(rig) {
  const cols = ['coral', 'cobalt', 'teal', 'sunflower', 'violet'];
  for (let i = 0; i < 12; i++) {
    const c = cols[i % 5], x = ((i % 4) - 1.5) * 20, y = Math.floor(i / 4) * 20, kind = i % 4;
    rig.root.add(`piece_${i}`, [x, y, 0]).mesh((m) => {
      if (kind === 0) flatPoly(m, c, [[x - 5, y - 5], [x + 5, y - 5], [x + 5, y + 5], [x - 5, y + 5]], -1, 1); // square
      if (kind === 1) flatPoly(m, c, [[x - 6, y - 4], [x + 6, y - 4], [x, y + 6]], -1, 1); // triangle
      if (kind === 2) puffyStar(m, c, x, y, 7, 1.5); // small star
      if (kind === 3) flatPoly(m, c, ring(8, 5, 0, x, y), -1, 1); // circle
    });
  }
}
function scraps(rig) {
  const shapes = [
    [[-7, -5], [6, -6], [9, 2], [2, 7], [-6, 4]], [[-5, -8], [5, -6], [6, 5], [-4, 8], [-7, 0]], [[-9, -3], [8, -5], [7, 4], [-5, 6]],
    [[-6, -6], [7, -4], [4, 7], [-7, 3]], [[-8, -2], [0, -7], [8, -1], [3, 6], [-5, 5]], [[-4, -7], [6, -5], [8, 3], [-2, 7], [-7, 1]],
  ];
  shapes.forEach((sh, i) => {
    const cx = ((i % 3) - 1) * 24, cy = Math.floor(i / 3) * 22;
    rig.root.add(`scrap_${i}`, [cx, cy, 0]).mesh((m) => {
      // torn edge: a slightly bent sheet (two plates sharing a fold) in paper with a cream back
      const pts = sh.map(([x, y]) => [cx + x, cy + y, 0]);
      const half = Math.ceil(pts.length / 2);
      plate(m, 'paper*', pts.slice(0, half + 1).concat([[cx, cy, 1.5]]), 2);
      plate(m, 'cream*', pts.slice(half).concat([pts[0], [cx, cy, 1.5]]), 2);
    });
  });
}
function foldCrease(rig) {
  rig.root.add('crease', [0, 0, 0], { outline: false }).mesh((m) => {
    m.hull('lemon', [[-50, 0, -2], [50, 0, -2], [-50, 0, 2], [50, 0, 2], [-50, 2, 0], [50, 2, 0], [-54, 1, 0], [54, 1, 0]]);
    for (const x of [-30, 0, 30]) puffyStar(m, 'gold', x, 1, 4, 1.2, 2.5);
  });
}
function sparkle(rig) {
  rig.root.add('sparkle', [0, 0, 0], { outline: false }).mesh((m) => {
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 2, b1 = a + Math.PI / 4, b2 = a - Math.PI / 4;
      m.hull(i % 2 ? 'lemon' : 'gold', [[Math.cos(a) * 15, Math.sin(a) * 15, 0], [Math.cos(b1) * 3.5, Math.sin(b1) * 3.5, 0], [Math.cos(b2) * 3.5, Math.sin(b2) * 3.5, 0], [0, 0, 2.5], [0, 0, -2.5]]);
    }
  });
}

const R = (name, size, build, notes) => ({ name, dir: 'rewards', category: 'rewards', sheet: 'rewards', size, build, notes });
const U = (name, size, build, notes) => ({ name, dir: 'ui', category: 'ui', sheet: 'ui', size, build, notes });
const F = (name, size, build, notes) => ({ name, dir: 'fx', category: 'fx', sheet: 'fx', size, build, notes });
const BADGES = [['best_save', 'coral'], ['most_improved', 'leaf'], ['sharpest_aim', 'cobalt'], ['steady_streak', 'violet'], ['brave_try', 'orange']];

export const rewards = [
  R('star', [0.05, 0.016, 0.05], star, 'Origin at the centre; faces +Z.'),
  R('star_empty', [0.05, 0.004, 0.05], starEmpty, 'Paper outline of the same star (not yet earned).'),
  ...BADGES.map(([k, c]) => R(`badge_${k}`, [0.06, 0.012, 0.06], badge(k, c), 'Symbol only, no text. Origin at the disc centre; ribbon hangs below.')),
  R('streak_shield', [0.05, 0.01, 0.05], streakShield, 'Origin at the centre.'),
  R('trophy_paper', [0.058, 0.044, 0.08], trophy, 'Stands on the table.'),
];
export const ui = [
  U('paper_button', [0.1, 0.012, 0.065], paperButton, 'Poke from the front. press moves back along -z by up to 0.005 m; the game recolours sky.'),
  U('paper_panel', [0.3, 0.013, 0.2], paperPanel, 'Background for recap and menu text drawn at label_anchor.'),
  U('palm_menu_disc', [0.08, 0.006, 0.08], palmDisc, 'Faces +Z (towards the eyes when held up in the palm). slot_0 at the top, then clockwise.'),
];
export const fx = [
  F('confetti_pieces', [0.07, 0.003, 0.055], confetti, 'piece_0..11: squares, triangles, small stars and circles in the five mission colours, each with its origin at its centre.'),
  F('paper_scraps', [0.07, 0.005, 0.04], scraps, 'scrap_0..5: gently bent torn pieces for a wrong answer (funny, not destructive).'),
  F('fold_crease', [0.108, 0.004, 0.004], foldCrease, 'Shiny crease strip along x for fold animations; no ink outline.'),
  F('sparkle', [0.03, 0.005, 0.03], sparkle, 'Four-point sparkle, origin at the centre; no ink outline.'),
];
