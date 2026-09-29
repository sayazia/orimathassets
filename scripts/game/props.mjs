// B2: props for the six Foldlings mini-games. Millimetres, front faces +Z (the player).
// Grabbed objects have their origin at their centre (hand_anchor there too) unless noted.
import { plate, blob } from '../lib/origami.mjs';

const both = (f) => { f(1); f(-1); };
const UP = [-60, 0, 0]; // anchor tilt: +Z turned up towards a seated player's eyes

// ------------------------------------------------------------------ Orb Forge
function crystal(rig) {
  const gem = rig.root.add('gem', [0, 0, 0]);
  const ring = (y, r, off) => [...Array(8).keys()].map((i) => { const a = ((i + off) / 8) * Math.PI * 2; return [Math.cos(a) * r, y, Math.sin(a) * r]; });
  gem.mesh((m) => m.hull('lavender*', [[0, 25, 0], [0, -25, 0], ...ring(9, 14.5, 0.25), ...ring(0, 17.5, 0), ...ring(-9, 14.5, 0.25)]));
  rig.root.anchorAt('label_anchor', [0, 0, 19]);
  rig.root.anchorAt('hand_anchor', [0, 0, 0]);
}

function orb(rig) {
  const core = rig.root.add('core', [0, 0, 0]);
  core.mesh((m) => {
    m.hull('lavender*', blob([0, 0, 0], 25, 25, 25, 8, 0.2));
    for (let i = 0; i < 8; i++) { // folded gold belt: the "fused" seam of two crystals
      const a0 = (i / 8) * Math.PI * 2, a1 = ((i + 1) / 8) * Math.PI * 2, r0 = 24.2, r1 = 27;
      const p = (a, r, y) => [Math.cos(a) * r, y, Math.sin(a) * r];
      m.hull('gold*', [p(a0, r0, -3), p(a1, r0, -3), p(a0, r0, 3), p(a1, r0, 3), p(a0, r1, -2.2), p(a1, r1, -2.2), p(a0, r1, 2.2), p(a1, r1, 2.2)]);
    }
    m.hull('gold*', blob([0, 25.5, 0], 5, 3, 5, 5)); // top knot
  });
  rig.root.anchorAt('label_anchor', [0, 0, 28]);
  rig.root.anchorAt('hand_anchor', [0, 0, 0]);
}

function crystalTray(rig) {
  const tray = rig.root.add('tray', [0, 0, 0]);
  tray.mesh((m) => {
    m.box('cream*', [-230, 0, -35], [230, 5, 35]);
    for (const s of [-1, 1]) {
      m.hull('sand*', [[-230, 5, s * 35], [230, 5, s * 35], [-230, 5, s * 31], [230, 5, s * 31], [-228, 15, s * 37], [228, 15, s * 37], [-228, 15, s * 34.5], [228, 15, s * 34.5]]); // folded rim
      m.hull('sand*', [[s * 230, 5, -35], [s * 230, 5, 35], [s * 226, 5, -35], [s * 226, 5, 35], [s * 232, 15, -35], [s * 232, 15, 35], [s * 229.5, 15, -35], [s * 229.5, 15, 35]]);
    }
    for (let i = 0; i < 5; i++) m.frustum('sand*', [(i - 2) * 90, 0], 15, 12, 5, 9, 8, Math.PI / 8); // seat for a crystal
  });
  for (let i = 0; i < 5; i++) rig.root.anchorAt(`slot_${i}`, [(i - 2) * 90, 9, 0]);
}

function shieldBadge(rig) {
  const badge = rig.root.add('badge', [0, 0, 0]);
  badge.mesh((m) => {
    const outer = [[-25, 60], [25, 60], [25, 26], [0, 0], [-25, 26]];
    const inner = [[-20, 55.5], [20, 55.5], [20, 27.5], [0, 7], [-20, 27.5]];
    const bevel = [[-23, 58], [23, 58], [23, 26.5], [0, 3], [-23, 26.5]];
    m.hull('gold*', [...outer.map(([x, y]) => [x, y, -3]), ...bevel.map(([x, y]) => [x, y, -5]), ...outer.map(([x, y]) => [x, y, 1.5]), ...bevel.map(([x, y]) => [x, y, 3])]);
    m.hull('cream*', [...inner.map(([x, y]) => [x, y, 2]), ...inner.map(([x, y]) => [x, y, 5])]);
  });
  rig.root.anchorAt('label_anchor', [0, 36, 5.5]);
}

// ------------------------------------------------------------------ Balloon Burst (origin at the bottom of the string)
function string(m, top) {
  // a paper ribbon that zigzags gently down from the knot
  const pts = [[0, top, 0], [2.5, top * 0.7, 0], [-2.5, top * 0.38, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) m.beam('paper*', pts[i], pts[i + 1], 2);
}
function balloon(rig, shape) {
  const skin = rig.root.add('skin', [0, 0, 0]);
  const C = 'sky*';
  let knotY, centre;
  skin.mesh((m) => {
    if (shape === 'round') { centre = [0, 87.5, 0]; m.hull(C, blob(centre, 32.5, 32.5, 32.5, 8, 0.2)); knotY = 55; }
    if (shape === 'long') { centre = [0, 90, 0]; m.hull(C, blob(centre, 22, 40, 22, 8, 0.2)); knotY = 50; }
    if (shape === 'heart') {
      centre = [0, 88, 0];
      both((s) => m.hull(C, blob([s * 15, 97, 0], 18, 18, 17, 7, 0.2)));
      m.hull(C, [[-31, 96, 0], [31, 96, 0], [0, 55, 0], [-18, 90, 13], [18, 90, 13], [-18, 90, -13], [18, 90, -13], [0, 75, 9], [0, 75, -9]]);
      knotY = 55;
    }
  });
  const knot = rig.root.add('knot', [0, knotY, 0]);
  knot.mesh((m) => m.frustum('sky*', [0, 0], 3, 6, knotY - 5, knotY + 1, 6, 0));
  rig.root.add('string', [0, 0, 0]).mesh((m) => string(m, knotY - 5));
  const zFront = shape === 'long' ? 23 : shape === 'heart' ? 18 : 33.5;
  rig.root.anchorAt('label_anchor', [0, centre[1] + (shape === 'heart' ? 4 : 0), zFront]);
}

function popPieces(rig) {
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, r = 30, s = 10 + (i % 3) * 5;
    const c = [Math.cos(a) * r, 20 + (i % 2) * 12, Math.sin(a) * r];
    rig.root.add(`piece_${i}`, c).mesh((m) => {
      const pts = [0, 1, 2].map((k) => { const b = a + (k * 2.1) + i; return [c[0] + Math.cos(b) * s / 2, c[1] + Math.sin(b * 1.3) * s / 2, c[2] + Math.sin(b) * s / 2]; });
      plate(m, 'sky*', pts, 2);
    });
  }
}

// ------------------------------------------------------------------ Factory Sort
function frameRails(m, x0, x1) {
  for (const s of [-1, 1]) {
    m.hull('orange*', [[x0, 18, s * 26], [x1, 18, s * 26], [x0, 18, s * 30], [x1, 18, s * 30], [x0, 30, s * 26], [x1, 30, s * 26], [x0, 31, s * 30], [x1, 31, s * 30]]);
    for (const x of [x0 + 8, x1 - 8]) m.box('orange*', [x - 3, 0, s * 29 - 3], [x + 3, 18, s * 29 + 3]);
  }
}
function conveyorStraight(rig) {
  rig.root.add('frame', [0, 0, 0]).mesh((m) => frameRails(m, -60, 60));
  rig.root.add('belt', [0, 26, 0]).mesh((m) => {
    m.box('slate*', [-60, 22, -25], [60, 26, 25]);
    for (let x = -52.5; x < 60; x += 15) m.hull('stone', [[x - 2, 26, -24], [x + 2, 26, -24], [x - 2, 26, 24], [x + 2, 26, 24], [x, 28, -24], [x, 28, 24]]); // belt slats
  });
}
function conveyorStart(rig) {
  const frame = rig.root.add('frame', [0, 0, 0]);
  frame.mesh((m) => {
    frameRails(m, -10, 40);
    m.box('slate', [-10, 22, -25], [40, 26, 25]);
    // little portal arch the items come out of
    for (const s of [-1, 1]) m.box('lavender', [-40, 0, s > 0 ? 26 : -30], [-30, 44, s > 0 ? 30 : -26]);
    m.hull('lavender', [[-40, 44, -30], [-30, 44, -30], [-40, 44, 30], [-30, 44, 30], [-40, 50, -22], [-30, 50, -22], [-40, 50, 22], [-30, 50, 22]]);
    m.box('violet', [-38, 0, -26], [-32, 44, 26]); // portal sheet
    m.hull('slate', [[-32, 22, -25], [-10, 22, -25], [-32, 22, 25], [-10, 22, 25], [-32, 26, -25], [-10, 26, -25], [-32, 26, 25], [-10, 26, 25]]);
  });
  rig.root.anchorAt('spawn_anchor', [-26, 26, 0]);
}
function sortGate(rig, { main }) {
  const M = main + '*';
  rig.root.add('arch', [0, 0, 0]).mesh((m) => {
    both((s) => m.hull(M, [[-8, 0, s * 26], [8, 0, s * 26], [-8, 0, s * 32], [8, 0, s * 32], [-6, 80, s * 26], [6, 80, s * 26], [-6, 80, s * 31], [6, 80, s * 31]]));
    m.hull(M, [[-8, 80, -32], [8, 80, -32], [-8, 80, 32], [8, 80, 32], [-6, 88, -28], [6, 88, -28], [-6, 88, 28], [6, 88, 28]]);
  });
  const sign = rig.root.add('sign', [0, 88, 0]);
  sign.mesh((m) => {
    m.box(M, [-3, 88, -3], [3, 93, 3]);
    m.box(M, [-32, 93, -3], [32, 121, 3]);
    m.box('paper', [-28, 96, 3], [28, 118, 4.5]); // blank label card facing the player
  });
  sign.anchorAt('label_anchor', [0, 107, 5]);
  rig.root.add('chute', [0, 30, 0]).mesh((m) => m.hull('cream*', [[-10, 30, -24], [10, 30, -24], [-10, 30, 24], [10, 30, 24], [-10, 27, -24], [10, 27, -24], [-10, 5, 30], [10, 5, 30], [-10, 8, 30], [10, 8, 30]]));
}
function sortBin(rig) {
  rig.root.add('bin', [0, 0, 0]).mesh((m) => {
    m.box('sand*', [-40, 0, -30], [40, 3, 30]);
    both((s) => {
      m.hull('sand*', [[-40, 3, s * 30], [40, 3, s * 30], [-40, 3, s * 27.5], [40, 3, s * 27.5], [-42, 40, s * 31.5], [42, 40, s * 31.5], [-42, 40, s * 29], [42, 40, s * 29]]);
      m.hull('sand*', [[s * 40, 3, -27.5], [s * 40, 3, 27.5], [s * 37.5, 3, -27.5], [s * 37.5, 3, 27.5], [s * 42, 40, -29], [s * 42, 40, 29], [s * 39.5, 40, -29], [s * 39.5, 40, 29]]);
    });
  });
  rig.root.anchorAt('drop_anchor', [0, 40, 0]);
}
function itemToken(rig) {
  rig.root.add('token', [0, 0, 0]).mesh((m) => {
    const oct = (y, a, c) => [[-a + c, y, -a], [a - c, y, -a], [a, y, -a + c], [a, y, a - c], [a - c, y, a], [-a + c, y, a], [-a, y, a - c], [-a, y, -a + c]];
    m.hull('cream*', [...oct(-10, 18.5, 2), ...oct(-8.5, 20, 2.5), ...oct(7.5, 20, 2.5), ...oct(9, 18.5, 2)]);
    m.hull('sand*', [[-19, 9, -19], [19, 9, -19], [0, 9, 3], [-19, 10.5, -19], [19, 10.5, -19], [0, 10.5, 3]]); // envelope flap
  });
  rig.root.anchorAt('label_anchor', [0, 11, 8], UP);
  rig.root.anchorAt('hand_anchor', [0, 0, 0]);
}

// ------------------------------------------------------------------ Bridge Builder
function gapCliffs(rig) {
  both((s) => rig.root.add(s < 0 ? 'cliff_left' : 'cliff_right', [s * 160, 0, 0]).mesh((m) => {
    const x0 = s * 120, x1 = s * 200;
    m.hull('stone*', [[x0, 0, -50], [x1, 0, -50], [x0, 0, 50], [x1, 0, 50], [x0 + s * 6, 30, -48], [x0 + s * 6, 30, 48], [x0, 54, -44], [x0, 54, 44], [x1, 54, -50], [x1, 54, 50]]);
    m.hull('grass*', [[x0, 54, -44], [x0, 54, 44], [x1, 54, -50], [x1, 54, 50], [x0, 60, -42], [x0, 60, 42], [x1, 60, -48], [x1, 60, 48]]);
  }));
  rig.root.anchorAt('socket_plank_start', [-120, 60, 0]);
  rig.root.anchorAt('socket_plank_end', [120, 60, 0]);
}
function plank(n) {
  return (rig) => {
    const L = 240 / n;
    const p = rig.root.add('plank', [0, 0, 0], { outline: false }); // no outline: its length must read exactly
    p.mesh((m) => {
      m.hull('wood*', [[-L / 2, -3, -20], [L / 2, -3, -20], [-L / 2, -3, 20], [L / 2, -3, 20], [-L / 2, 2.2, -20], [L / 2, 2.2, -20], [-L / 2, 2.2, 20], [L / 2, 2.2, 20], [-L / 2, 3, 0], [L / 2, 3, 0]]); // soft centre crease, 6 mm thick
      if (L > 12) for (const s of [-1, 1]) m.box('sand', [s > 0 ? L / 2 - 3.5 : -L / 2 + 1.5, 1.6, -18], [s > 0 ? L / 2 - 1.5 : -L / 2 + 3.5, 2.7, 18]); // end fold marks
    });
    rig.root.anchorAt('label_anchor', [0, 3.2, 10], UP);
    rig.root.anchorAt('hand_anchor', [0, 0, 0]);
  };
}
function bridgePost(rig) {
  rig.root.add('post', [0, 0, 0]).mesh((m) => {
    m.prism('wood*', [0, 0], 7.5, 0, 45, 8, Math.PI / 8);
    m.frustum('sand*', [0, 0], 8, 3, 45, 50, 8, Math.PI / 8);
  });
}

// ------------------------------------------------------------------ Balance Gate
function scale(rig) {
  rig.root.add('base', [0, 0, 0]).mesh((m) => {
    m.hull('cobalt*', [[-60, 0, -40], [60, 0, -40], [-60, 0, 40], [60, 0, 40], [-52, 10, -32], [52, 10, -32], [-52, 10, 32], [52, 10, 32]]);
  });
  rig.root.add('pillar', [0, 10, 0]).mesh((m) => {
    m.frustum('cobalt*', [0, 0], 9, 6, 10, 130, 6, 0);
    m.hull('gold*', blob([0, 135, 0], 6, 6, 6, 6));
  });
  const beam = rig.root.add('beam', [0, 135, 0]);
  beam.mesh((m) => m.hull('gold*', [[-124, 132, -3], [124, 132, -3], [-124, 132, 3], [124, 132, 3], [-124, 137, 0], [124, 137, 0], [0, 142, -4], [0, 142, 4], [0, 129, 0]]));
  both((s) => {
    const pan = beam.add(s < 0 ? 'pan_left' : 'pan_right', [s * 114, 132, 0]);
    pan.mesh((m) => {
      for (const [dx, dz] of [[-20, 0], [20, 0], [0, 0]].slice(0, 2)) m.beam('cream', [s * 114, 132, 0], [s * 114 + dx, 58, dz], 2);
      m.beam('cream', [s * 114, 132, 0], [s * 114, 58, 18], 2);
      m.beam('cream', [s * 114, 132, 0], [s * 114, 58, -18], 2);
      m.frustum('cream', [s * 114, 0], 24, 36, 50, 58, 8, Math.PI / 8); // dish
    });
    pan.anchorAt(s < 0 ? 'socket_left_pan' : 'socket_right_pan', [s * 114, 58, 0]);
    pan.anchorAt(s < 0 ? 'label_anchor_left' : 'label_anchor_right', [s * 114, 40, 30]);
  });
}
function weightBlock(rig) {
  rig.root.add('block', [0, 15, 0]).mesh((m) => {
    const a = 17.5, c = 2.5; // chamfered paper box
    const pts = [];
    for (const y of [0, 30]) for (const [x, z] of [[-a + c, -a], [a - c, -a], [a, -a + c], [a, a - c], [a - c, a], [-a + c, a], [-a, a - c], [-a, -a + c]]) pts.push([x, y, z]);
    m.hull('stone*', pts);
    m.box('cream', [-12, 6, a - 0.2], [12, 24, a + 1.2]); // label card
  });
  rig.root.anchorAt('label_anchor', [0, 15, 19]);
  rig.root.anchorAt('hand_anchor', [0, 15, 0]);
}
function gate(rig) {
  rig.root.add('frame', [0, 0, 0]).mesh((m) => {
    both((s) => m.box('cobalt*', [s * 60 - 10, 0, -15], [s * 60 + 10, 120, 15]));
    m.hull('cobalt*', [[-70, 120, -15], [70, 120, -15], [-70, 120, 15], [70, 120, 15], [-56, 140, -12], [56, 140, -12], [-56, 140, 12], [56, 140, 12]]);
    m.hull('gold', blob([0, 132, 15.5], 7, 7, 2, 6));
  });
  both((s) => {
    const door = rig.root.add(s < 0 ? 'door_left' : 'door_right', [s * 50, 0, 0]);
    door.mesh((m) => {
      m.box('cream*', [Math.min(s * 50, s * 1), 2, -2], [Math.max(s * 50, s * 1), 116, 2]);
      m.box('gold', [Math.min(s * 44, s * 7), 56, 2], [Math.max(s * 44, s * 7), 62, 3.4]);
    });
  });
  rig.root.anchorAt('exit_anchor', [0, 0, -30]);
}

// ------------------------------------------------------------------ Measure Hunt
function tapeMeasure(rig) {
  const housing = rig.root.add('housing', [0, 10, 0]);
  housing.mesh((m) => {
    m.hull('sunflower*', [[-25, 0, -18], [18, 0, -25], [25, 0, -18], [25, 0, 18], [18, 0, 25], [-25, 0, 18], [-25, 20, -18], [18, 20, -25], [25, 20, -18], [25, 20, 18], [18, 20, 25], [-25, 20, 18]]);
    m.frustum('slate*', [-2, 0], 12, 12, 20, 21.5, 8, Math.PI / 8); // winding cap
  });
  // the tape is modelled 1 m long; its rest scale shows 2 cm. Scale x to 1 for a full metre.
  const tape = housing.add('tape', [25, 3, 0]);
  tape.mesh((m) => {
    m.box('sunflower*', [25, 1, -8], [1025, 3, 8]);
    for (let cm = 5; cm < 100; cm += 5) m.box('ink', [25 + cm * 10 - 1, 3, cm % 10 ? 2 : -8], [25 + cm * 10 + 1, 3.6, 8]);
  });
  tape.s = [0.02, 1, 1];
  const end = housing.add('tape_end', [45, 3, 0]);
  end.mesh((m) => m.box('slate*', [45, 0, -9], [48, 8, 9]));
  rig.root.anchorAt('hand_anchor', [0, 10, 0]);
}
function ruler30(rig) {
  rig.root.add('ruler', [0, 0, 0]).mesh((m) => {
    m.box('lemon*', [-155, 0, -15], [155, 4, 15]);
    for (let i = 0; i <= 60; i++) {
      const x = -150 + i * 5; // exact 5 mm steps, 0 to 30 cm
      const len = i % 2 ? 5 : i % 10 ? 8 : 12; // 5 mm, 1 cm, 5 cm
      m.hull('ink', [[x - 1, 4, 15 - len], [x + 1, 4, 15 - len], [x - 1, 4, 14], [x + 1, 4, 14], [x, 4.5, 15 - len], [x, 4.5, 14]]); // ridge mark
    }
  });
}
function markerPin(rig, { main }) {
  rig.root.add('pin', [0, 0, 0]).mesh((m) => {
    m.frustum('stone*', [0, 0], 0, 2, 0, 22, 4, 0); // needle
    m.frustum(main + '*', [0, 0], 9, 6, 22, 28, 8, 0); // collar disc
    m.frustum(main + '*', [0, 0], 4, 4, 28, 38, 6, 0);
    m.hull(main + '*', blob([0, 44, 0], 8, 6.5, 8, 6)); // head
  });
  rig.root.anchorAt('hand_anchor', [0, 42, 0]);
}
function treasureChest(rig) {
  const chest = rig.root.add('chest', [0, 0, 0]);
  chest.mesh((m) => {
    m.box('wood*', [-35, 0, -25], [35, 30, 25]);
    for (const x of [-24, 24]) m.box('gold*', [x - 3, 0, -25.8], [x + 3, 30, 25.8]);
    m.box('gold*', [-5, 20, 25], [5, 30, 27]); // latch
  });
  const lid = chest.add('lid', [0, 30, -25]);
  lid.mesh((m) => {
    const prof = [[-25, 0], [-20, 11], [-8, 18], [8, 18], [20, 11], [25, 0]].map(([z, y]) => [z, 30 + y]);
    m.hull('wood*', [...prof.map(([z, y]) => [-35, y, z]), ...prof.map(([z, y]) => [35, y, z])]);
    for (const x of [-24, 24]) m.hull('gold*', [...prof.map(([z, y]) => [x - 3, y + (y > 30 ? 0.8 : 0), z * 1.03]), ...prof.map(([z, y]) => [x + 3, y + (y > 30 ? 0.8 : 0), z * 1.03])]);
  });
  rig.root.anchorAt('reward_anchor', [0, 12, 0]);
}

const G = (group, name, size, build, extra = {}) => ({ name, dir: `game/${group}`, category: 'game', sheet: group, size, build, ...extra });
const MISSION_GATES = [
  { id: '1', pal: { main: 'coral' } },
  { id: '2', pal: { main: 'cobalt' } },
  { id: '3', pal: { main: 'sunflower' } },
];
const PINS = [{ id: 'a', pal: { main: 'coral' } }, { id: 'b', pal: { main: 'cobalt' } }];

export const orbForge = [
  G('orb_forge', 'crystal', [0.035, 0.035, 0.05], crystal, { notes: 'Neutral lavender; the game recolours the lavender materials. Origin at the centre.' }),
  G('orb_forge', 'orb', [0.05, 0.05, 0.05], orb, { notes: 'Origin at the centre.' }),
  G('orb_forge', 'crystal_tray', [0.46, 0.07, 0.015], crystalTray, { notes: 'slot_0..4 sit 0.09 m apart on the seat tops.' }),
  G('orb_forge', 'shield_badge', [0.05, 0.01, 0.06], shieldBadge),
];
export const balloons = [
  G('balloon', 'balloon_round', [0.065, 0.065, 0.12], (r) => balloon(r, 'round'), { notes: 'Origin at the bottom end of the string. Sky blue; the game recolours sky/sky_shade.' }),
  G('balloon', 'balloon_long', [0.044, 0.044, 0.13], (r) => balloon(r, 'long'), { notes: 'Origin at the bottom end of the string.' }),
  G('balloon', 'balloon_heart', [0.065, 0.035, 0.12], (r) => balloon(r, 'heart'), { notes: 'Origin at the bottom end of the string.' }),
  G('balloon', 'balloon_pop_pieces', [0.08, 0.08, 0.05], popPieces, { notes: 'Each piece_N has its origin at its own centre, laid out in a ring for the burst effect.' }),
];
export const factory = [
  G('factory', 'conveyor_straight', [0.12, 0.06, 0.03], conveyorStraight, { notes: 'Tiles end to end along x (0.12 m pitch). Belt top at y = 0.028.' }),
  G('factory', 'conveyor_start', [0.08, 0.06, 0.05], conveyorStart, { notes: 'Its belt end at x = +0.04 joins a conveyor_straight whose centre is at x = +0.1.' }),
  G('factory', 'sort_gate', [0.09, 0.06, 0.12], sortGate, { variants: MISSION_GATES, notes: 'Stands across the belt (items travel along x). Gates 1 to 3 in coral, cobalt, sunflower.' }),
  G('factory', 'sort_bin', [0.08, 0.06, 0.04], sortBin),
  G('factory', 'item_token', [0.04, 0.04, 0.02], itemToken, { notes: 'Origin at the centre.' }),
];
export const bridge = [
  G('bridge', 'gap_cliffs', [0.4, 0.1, 0.06], gapCliffs, { notes: 'Gap 0.24 m = one bridge unit, between the two sockets.' }),
  ...[1, 2, 3, 4, 5, 6, 8, 10].map((n) => G('bridge', n === 1 ? 'plank_1' : `plank_1_${n}`, [0.24 / n, 0.04, 0.006], plank(n), { notes: `Exactly ${(240 / n).toFixed(1)} mm long (1/${n} of the 0.24 m unit). Origin at the centre. No ink outline so the length reads exactly.` })),
  G('bridge', 'bridge_post', [0.015, 0.015, 0.05], bridgePost),
];
export const balance = [
  G('balance', 'scale', [0.3, 0.08, 0.16], scale, { notes: 'Rotate beam about z (0 to 20 degrees); rotate pan_left/pan_right by the opposite angle so the pans hang level.' }),
  G('balance', 'weight_block', [0.035, 0.035, 0.03], weightBlock, { notes: 'Origin at the bottom centre; stacks every 0.03 m (safe up to 4).' }),
  G('balance', 'gate', [0.14, 0.03, 0.14], gate, { notes: 'Doors hinge at their outer edges: rotate door_left by +y, door_right by -y to open.' }),
];
export const measure = [
  G('measure', 'tape_measure', [0.05, 0.05, 0.02], tapeMeasure, { notes: 'tape is 1 m long at scale x = 1 (rest scale 0.02). Keep tape_end at x = 0.025 + 1.0 * scale. Marks every 5 cm (long at 10 cm), no numbers.' }),
  G('measure', 'ruler_30', [0.3, 0.03, 0.004], ruler30, { notes: '0 to 30 cm scale (marks every 5 mm, longer at 1 cm and 5 cm, exact spacing) on a 0.31 m board. mm marks omitted: they would be thinner than the 2 mm minimum. Origin at the centre = 15 cm mark.' }),
  G('measure', 'marker_pin', [0.016, 0.016, 0.05], markerPin, { variants: PINS, notes: 'Point A coral (base file), point B cobalt (_b).' }),
  G('measure', 'treasure_chest', [0.07, 0.05, 0.05], treasureChest, { notes: 'lid hinges at the back top edge: rotate about x (negative opens).' }),
];
