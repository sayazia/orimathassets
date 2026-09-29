// B3: visual hint models shown after a wrong answer, and B4: portals. Millimetres.
import { plate } from '../lib/origami.mjs';

const UP = [-60, 0, 0];

// ------------------------------------------------------------------ base-10 blocks (one shared 10 mm unit)
function chamferCube(m, c, [x, y, z], a = 10, k = 1) {
  const pts = [];
  for (const sx of [0, 1]) for (const sy of [0, 1]) for (const sz of [0, 1]) {
    const px = x + sx * a, py = y + sy * a, pz = z + sz * a, dx = sx ? -k : k, dy = sy ? -k : k, dz = sz ? -k : k;
    pts.push([px + dx, py, pz], [px, py + dy, pz], [px, py, pz + dz]);
  }
  m.hull(c, pts);
}
function unit(rig) {
  rig.root.add('cube', [0, 0, 0]).mesh((m) => chamferCube(m, 'coral*', [-5, 0, -5]));
}
function rod(rig) {
  const r = rig.root.add('rod', [0, 0, 0]);
  r.mesh((m) => {
    for (let i = 0; i < 10; i++) m.box('coral*', [-50 + i * 10, 0, -5], [-40 + i * 10, 10, 5]);
    for (let i = 1; i < 10; i++) { // unit creases on the top, front and back
      const x = -50 + i * 10;
      m.hull('coral_shade', [[x - 1, 10, -5], [x + 1, 10, -5], [x - 1, 10, 5], [x + 1, 10, 5], [x, 10.6, -5], [x, 10.6, 5]]);
      for (const z of [5, -5]) m.hull('coral_shade', [[x - 1, 0, z], [x + 1, 0, z], [x - 1, 10, z], [x + 1, 10, z], [x, 0, z + Math.sign(z) * 0.6], [x, 10, z + Math.sign(z) * 0.6]]);
    }
  });
}
function flat(rig) {
  const f = rig.root.add('flat', [0, 0, 0]);
  f.mesh((m) => {
    for (let i = 0; i < 10; i++) m.box('coral*', [-50, 0, -50 + i * 10], [50, 10, -40 + i * 10]); // ten rods side by side
    for (let i = 1; i < 10; i++) m.hull('coral_shade', [[-50 + i * 10 - 1, 10, -50], [-50 + i * 10 + 1, 10, -50], [-50 + i * 10 - 1, 10, 50], [-50 + i * 10 + 1, 10, 50], [-50 + i * 10, 10.6, -50], [-50 + i * 10, 10.6, 50]]); // unit creases
    for (let i = 1; i < 10; i++) { // rod seams across the top, and creases down the front and right side
      const c = -50 + i * 10;
      m.hull('coral_shade', [[-50, 10, c - 1], [-50, 10, c + 1], [50, 10, c - 1], [50, 10, c + 1], [-50, 10.6, c], [50, 10.6, c]]);
      m.hull('coral_shade', [[c - 1, 0, 50], [c + 1, 0, 50], [c - 1, 10, 50], [c + 1, 10, 50], [c, 0, 50.6], [c, 10, 50.6]]);
      m.hull('coral_shade', [[50, 0, c - 1], [50, 0, c + 1], [50, 10, c - 1], [50, 10, c + 1], [50.6, 0, c], [50.6, 10, c]]);
    }
  });
}

// ------------------------------------------------------------------ number line, bar strip, area grid, pie slices
function numberLine(rig) {
  const line = rig.root.add('line', [0, 0, 0]);
  line.mesh((m) => {
    m.box('paper*', [-150, 0, -10], [150, 4, 10]);
    m.box('slate', [-150, 4, -1.2], [150, 4.6, 1.2]); // the line itself
    for (let i = 0; i <= 10; i++) {
      const x = -140 + i * 28, h = i % 5 ? 5 : 8;
      m.hull('slate', [[x - 1, 4, -h], [x + 1, 4, -h], [x - 1, 4, h], [x + 1, 4, h], [x, 4.8, -h], [x, 4.8, h]]);
    }
  });
  for (let i = 0; i <= 10; i++) {
    rig.root.anchorAt(`tick_${i}`, [-140 + i * 28, 4, 0]);
    rig.root.anchorAt(`label_anchor_${i}`, [-140 + i * 28, 4.8, 9], UP);
  }
}
function barStrip(rig) {
  // origin at the left end so scaling x trims from the right
  rig.root.add('strip', [0, 0, 0]).mesh((m) => {
    m.box('teal*', [0, 0, -15], [240, 4, 15]);
    m.hull('teal*', [[0, 4, -13], [240, 4, -13], [0, 4, 13], [240, 4, 13], [0, 4.8, 0], [240, 4.8, 0]]); // soft centre fold
  });
}
function areaGrid(rig) {
  rig.root.add('grid', [0, 0, 0]).mesh((m) => {
    m.box('mint*', [-75, 0, -75], [75, 2, 75]);
    for (let i = 0; i <= 10; i++) {
      const p = -75 + i * 15;
      m.hull('paper', [[p - 1, 2, -75], [p + 1, 2, -75], [p - 1, 2, 75], [p + 1, 2, 75], [p, 3, -75], [p, 3, 75]]);
      m.hull('paper', [[-75, 2, p - 1], [-75, 2, p + 1], [75, 2, p - 1], [75, 2, p + 1], [-75, 3, p], [75, 3, p]]);
    }
  });
  rig.root.anchorAt('cell_origin', [-67.5, 3, -67.5]);
}
function pieSlice(n) {
  return (rig) => {
    const R = 60, ang = (Math.PI * 2) / n, seg = Math.max(2, Math.ceil(24 / n));
    const arc = (r) => [...Array(seg + 1).keys()].map((i) => { const a = -ang / 2 + (ang * i) / seg; return [Math.cos(a) * r, Math.sin(a) * r]; });
    rig.root.add('slice', [0, 0, 0]).mesh((m) => {
      // wedge pointing along +x from the pie centre (origin); rotate by k * 360/n about y to assemble
      const top = [[0, 0], ...arc(R - 4)];
      m.hull('teal*', [...top.map(([x, z]) => [x, 0, z]), ...top.map(([x, z]) => [x, 6, z])]); // a wedge (even a half disc) is convex
      const a = arc(R - 4), b = arc(R);
      for (let i = 0; i < seg; i++) m.hull('cream*', [[...a[i]], [...a[i + 1]], [...b[i]], [...b[i + 1]]].flatMap(([x, z]) => [[x, 0, z], [x, 7, z]])); // paper crust
    });
  };
}

// ------------------------------------------------------------------ B4 portals
function portalMain(rig) {
  const C = [0, 72, 0];
  const seg = (m, c, r0, r1, a0, a1, z0, z1, bulge = 0) => {
    const p = (r, a, z) => [C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r, z];
    const am = (a0 + a1) / 2;
    m.hull(c, [p(r0, a0, z0), p(r0, a1, z0), p(r1, a0, z0), p(r1, a1, z0), p(r0, a0, z1), p(r0, a1, z1), p(r1, a0, z1), p(r1, a1, z1), p((r0 + r1) / 2, am, z1 + bulge)]);
  };
  const outer = rig.root.add('ring_outer', C);
  outer.mesh((m) => {
    for (let i = 0; i < 12; i++) seg(m, i % 2 ? 'violet*' : 'lavender', 56, 70, (i / 12) * Math.PI * 2, ((i + 1) / 12) * Math.PI * 2, -10, 7, 3); // folded petals
    for (const s of [-1, 1]) m.hull('violet*', [[s * 22, 0, -10], [s * 42, 0, -10], [s * 22, 0, 10], [s * 42, 0, 10], [s * 26, 12, -6], [s * 38, 12, -6], [s * 26, 12, 6], [s * 38, 12, 6]]); // feet
  });
  const inner = outer.add('ring_inner', C);
  inner.mesh((m) => {
    for (let i = 0; i < 8; i++) seg(m, 'gold', 46, 55, (i / 8) * Math.PI * 2 + 0.03, ((i + 1) / 8) * Math.PI * 2 - 0.03, -6, 6, 2);
    const disc = [...Array(16).keys()].map((i) => { const a = (i / 16) * Math.PI * 2; return [C[0] + Math.cos(a) * 47, C[1] + Math.sin(a) * 47]; });
    m.hull('navy', [...disc.map(([x, y]) => [x, y, -5]), ...disc.map(([x, y]) => [x, y, -3])]); // the portal's depth
  });
  rig.root.anchorAt('spawn_anchor', [0, 0, 14]);
}
function partnerWindow(rig) {
  const frame = rig.root.add('frame', [0, 0, 0]);
  frame.mesh((m) => {
    const W = 90, H = 60, b = 10;
    const bar = (x0, y0, x1, y1, xi0, yi0, xi1, yi1) => m.hull('cream*', [[x0, y0, -5], [x1, y1, -5], [xi1, yi1, -5], [xi0, yi0, -5], [x0, y0, 5], [x1, y1, 5], [xi1, yi1, 5], [xi0, yi0, 5]]);
    bar(-W, H, W, H, -W + b, H - b, W - b, H - b); // mitred paper strips
    bar(-W, -H, W, -H, -W + b, -H + b, W - b, -H + b);
    bar(-W, -H, -W, H, -W + b, -H + b, -W + b, H - b);
    bar(W, -H, W, H, W - b, -H + b, W - b, H - b);
    for (const [x, y] of [[-W, H], [W, H], [-W, -H], [W, -H]]) m.hull('violet*', [[x, y, 5], [x - Math.sign(x) * 16, y, 5], [x, y - Math.sign(y) * 16, 5], [x, y, 6.5]]); // folded corner tabs
  });
  rig.root.anchorAt('view_anchor', [0, 0, 0]);
  rig.root.anchorAt('label_anchor', [0, 68, 0]);
}
function helpOrbTrail(rig) {
  rig.root.add('trail', [0, 0, 0]).mesh((m) => {
    for (let i = 0; i < 5; i++) {
      const x = -8 - i * 19, s = 9 - i * 1.4, y = Math.sin(i * 1.3) * 4;
      plate(m, i % 2 ? 'gold*' : 'lemon*', [[x + s, y, 0], [x, y + s * 0.7, 0], [x - s, y, 0], [x, y - s * 0.7, 0]], 2);
    }
  });
}

const H = (name, size, build, notes) => ({ name, dir: 'hints', category: 'hints', sheet: 'hints', size, build, notes });
const P = (name, size, build, notes) => ({ name, dir: 'game/portal', category: 'game', sheet: 'portal', size, build, notes });

export const hints = [
  H('base10_unit', [0.01, 0.01, 0.01], unit, 'Origin at the bottom centre. All base-10 blocks share this 10 mm unit.'),
  H('base10_rod', [0.1, 0.01, 0.01], rod, 'Ten 10 mm cubes along x; shaded creases mark each cube.'),
  H('base10_flat', [0.1, 0.1, 0.01], flat, 'Ten rods side by side with unit creases across.'),
  H('number_line', [0.3, 0.02, 0.004], numberLine, 'tick_0..10 every 0.028 m (longer at 0, 5, 10); label_anchor_N just in front of each tick. Ends are plain so lines can be chained.'),
  H('bar_strip', [0.24, 0.03, 0.004], barStrip, 'Origin at the left end: scale x to cut it (1 = the whole unit, 0.24 m).'),
  H('area_grid', [0.15, 0.15, 0.003], areaGrid, '10 x 10 cells of 15 mm. cell_origin = centre of the -x/-z corner cell; step 0.015 m.'),
  ...[2, 3, 4, 5, 6, 8, 10, 12].map((n) => H(`pie_slice_${n}`, null, pieSlice(n), `One of ${n} slices of a 0.12 m pie. Origin at the pie centre, slice points along +x; rotate by k*${(360 / n).toFixed(1)} deg about y to assemble.`)),
];
export const portals = [
  P('portal_main', [0.14, 0.02, 0.14], portalMain, 'Stands upright on its feet at the edge of the book. ring_inner spins about z around the portal centre (0, 0.072, 0). spawn_anchor on the table just in front.'),
  P('partner_window', [0.18, 0.01, 0.12], partnerWindow, 'Floating frame, origin at its centre. view_anchor: centre of the opening (0.16 x 0.1 m) where the game renders the partner table; label_anchor above for the bot name.'),
  P('help_orb_trail', [0.1, 0.004, 0.02], helpOrbTrail, 'Origin at the head of the trail; it streams back along -x behind a flying help orb.'),
];
