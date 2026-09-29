// B5: supporting characters. They face the player (+Z); their left hand is at +x.
import { plate, eye, happyEye, blob, surf, disc, hoop, spike } from '../lib/origami.mjs';

const both = (f) => { f(1); f(-1); };
const loop = (period, n, f) => [...Array(n + 1).keys()].map((i) => [+(period * i / n).toFixed(4), f(i / n)]);
const sin = (t, k = 1) => Math.sin(t * Math.PI * 2 * k);

// Deterministic pseudo-random numbers so rebuilds are identical.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// Arm/wing clips shared by Pip and the robots. armL is at +x, armR at -x.
function characterClips(rig, { body = 'body', head = 'head', armL, armR, extra = [] }) {
  const rot = (node, keys) => ({ node, path: 'rotation', keys });
  rig.clip('idle', [
    { node: body, path: 'scale', keys: loop(2.4, 8, (t) => [1 + 0.012 * sin(t), 1 - 0.02 * sin(t), 1 + 0.012 * sin(t)]) },
    rot(head, loop(2.4, 8, (t) => [0, 0, 5 * sin(t)])),
    rot(armL, loop(2.4, 8, (t) => [0, 0, 4 + 3 * sin(t)])),
    rot(armR, loop(2.4, 8, (t) => [0, 0, -4 - 3 * sin(t)])),
    ...extra.filter((e) => e.clip === 'idle').map((e) => e.track),
  ]);
  rig.clip('wave', [
    rot(armL, [[0, [0, 0, 0]], [0.25, [0, 0, 150]], ...loop(1.2, 6, (t) => [0, 0, 150 + 18 * sin(t, 2)]).map(([t, v]) => [0.25 + t, v]), [1.8, [0, 0, 0]]]),
    rot(head, [[0, [0, 0, 0]], [0.4, [0, 0, 8]], [1.5, [0, 0, 8]], [1.8, [0, 0, 0]]]),
  ]);
  rig.clip('cheer', [
    { node: body, path: 'translation', keys: [[0, [0, 0, 0]], [0.2, [0, 10, 0]], [0.4, [0, 0, 0]], [0.6, [0, 10, 0]], [0.8, [0, 0, 0]], [1.2, [0, 0, 0]]] },
    rot(armL, [[0, [0, 0, 0]], [0.2, [0, 0, 160]], [0.4, [0, 0, 130]], [0.6, [0, 0, 160]], [0.9, [0, 0, 150]], [1.2, [0, 0, 0]]]),
    rot(armR, [[0, [0, 0, 0]], [0.2, [0, 0, -160]], [0.4, [0, 0, -130]], [0.6, [0, 0, -160]], [0.9, [0, 0, -150]], [1.2, [0, 0, 0]]]),
    rot(head, [[0, [0, 0, 0]], [0.2, [-10, 0, 0]], [0.9, [-10, 0, 0]], [1.2, [0, 0, 0]]]),
  ]);
  return { rot };
}

// ------------------------------------------------------------------ Pip, the paper owl guide
function pip(rig) {
  const B = 'sand*', CR = 'cream', OR = 'orange', GL = 'navy';
  const body = rig.root.add('body', [0, 40, 0]);
  const ring = (y, rx, rz, n, rot = 0) => [...Array(n).keys()].map((i) => { const a = rot + (i / n) * Math.PI * 2; return [Math.cos(a) * rx, y, Math.sin(a) * rz]; });
  const bodyPts = [...ring(4, 16, 14, 4), ...ring(36, 25, 22, 6, Math.PI / 6), ...ring(66, 14, 12, 4), [0, 74, 0]]; // folded paper body: few large facets
  body.mesh((m) => {
    m.hull(B, bodyPts);
    // belly: three rows of folded chevron feathers on the player side
    for (let r = 0; r < 3; r++) for (let k = -1; k <= 1; k += r === 1 ? 2 : 1) {
      if (r === 1 && k === 0) continue;
      const y = 50 - r * 11, x = (r === 1 ? k * 6 : k * 11);
      const h = surf(bodyPts, [x, y, 60], [0, 0, -1]);
      if (!h) continue;
      const [px, py, pz] = h.p;
      m.hull(CR, [[px - 6, py + 3, pz - 1.5], [px + 6, py + 3, pz - 1.5], [px, py - 4, pz + 0.3], [px - 6, py + 3, pz + 1.2], [px + 6, py + 3, pz + 1.2], [px, py - 4, pz + 2]]);
    }
    both((s) => m.hull(OR, [[s * 12, 0, 6], [s * 4, 0, 6], [s * 8, 0, 18], [s * 8, 3, 8], [s * 12, 2, 6], [s * 4, 2, 6]])); // feet
  });
  const head = body.add('head', [0, 70, 0]);
  const headPts = [[-26, 80, 0], [26, 80, 0], [-22, 97, -10], [22, 97, -10], [-21, 96, 19], [21, 96, 19], [-21, 73, 19], [21, 73, 19], [-18, 72, -13], [18, 72, -13], [0, 86, 23], [0, 100, 4]]; // wide head, face folded down the middle
  head.mesh((m) => {
    m.hull(B, headPts);
    both((s) => spike(m, B, [s * 12, 95, 2], [s * 23, 93, 2], [s * 26, 110, 0], [0, 0, 2], 1.6)); // flat folded ear tufts
    m.hull(OR, [[-3.5, 82, 21], [3.5, 82, 21], [0, 84, 20], [0, 74, 25], [0, 80, 27]]); // beak
    both((s) => { // facial discs and round folded glasses
      const c = surf(headPts, [s * 11, 86, 60], [0, 0, -1]).p;
      disc(m, CR, [c[0], c[1], c[2] - 1], [0, 0, 1], 9, 8.5, { h: 1.6, sides: 20 }); // facial disc
      hoop(m, GL, [c[0], c[1], c[2] + 0.2], [0, 0, 1], 9, 11.4);
    });
    m.hull(GL, [[-2.5, 88, 23.5], [2.5, 88, 23.5], [-2.5, 90.4, 23.5], [2.5, 90.4, 23.5], [-2.5, 88, 25.5], [2.5, 88, 25.5], [-2.5, 90.4, 25.5], [2.5, 90.4, 25.5]]); // bridge
  });
  const eyesN = head.add('eyes', [0, 86, 20]);
  const happy = head.add('eyes_happy', [0, 86, 20], { hidden: true });
  both((s) => {
    const c = surf(headPts, [s * 11, 86, 60], [0, 0, -1]).p;
    eyesN.mesh((m) => eye(m, [c[0], c[1], c[2] + 1], [0, 0, 1], 6));
    happy.mesh((m) => happyEye(m, [c[0], c[1], c[2] + 1.2], [0, 0, 1], 7));
  });
  both((s) => {
    const w = body.add(s > 0 ? 'wing_l' : 'wing_r', [s * 22, 62, 0]);
    w.mesh((m) => {
      // three overlapping folded feathers hanging from the shoulder
      plate(m, B, [[s * 22, 64, 8], [s * 22, 64, -8], [s * 33, 26, 0]], 3);
      plate(m, B, [[s * 23, 56, 6], [s * 27, 58, -6], [s * 30, 20, 2]], 3);
      plate(m, 'cream', [[s * 24, 46, 7], [s * 29, 48, -2], [s * 31, 24, 4]].map(([x, y, z]) => [x + s * 1.6, y, z]), 1.6);
    });
  });
  rig.root.anchorAt('label_anchor', [30, 120, 0]);
  const { rot } = characterClips(rig, { head: 'head', armL: 'wing_l', armR: 'wing_r' });
  rig.clip('point', [
    rot('wing_l', [[0, [0, 0, 0]], [0.3, [0, -40, 100]], [1.4, [0, -40, 100]], [1.7, [0, 0, 0]]]),
    rot('head', [[0, [0, 0, 0]], [0.3, [0, 20, 0]], [1.4, [0, 20, 0]], [1.7, [0, 0, 0]]]),
  ]);
  rig.clip('think', [
    rot('head', [[0, [0, 0, 0]], [0.4, [0, 0, 14]], [1.6, [0, 10, 14]], [2, [0, 0, 0]]]),
    rot('wing_r', [[0, [0, 0, 0]], [0.4, [-60, 0, -40]], [1.6, [-60, 0, -40]], [2, [0, 0, 0]]]),
  ]);
}

// ------------------------------------------------------------------ The Great Crumple
function crumpleShell(m, c, r, seed) {
  const R = rng(seed);
  const C = [0, 110, 0];
  // several jittered convex chunks overlap into one lumpy, crumpled paper ball
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 + R(), e = (R() - 0.5) * 1.4;
    const cc = [C[0] + Math.cos(a) * Math.cos(e) * r * 0.35, C[1] + Math.sin(e) * r * 0.35, C[2] + Math.sin(a) * Math.cos(e) * r * 0.35];
    const pts = [];
    for (let i = 0; i < 18; i++) {
      const u = R() * Math.PI * 2, v = Math.acos(2 * R() - 1), rr = r * (0.58 + R() * 0.12);
      pts.push([cc[0] + Math.cos(u) * Math.sin(v) * rr, cc[1] + Math.cos(v) * rr * 0.95, cc[2] + Math.sin(u) * Math.sin(v) * rr]);
    }
    m.hull(c, pts);
  }
}
function greatCrumple(rig) {
  const C = [0, 110, 0];
  rig.root.add('stage_1', C).mesh((m) => crumpleShell(m, 'lavender*', 110, 11));
  rig.root.add('stage_2', C).mesh((m) => crumpleShell(m, 'violet', 94, 23));
  rig.root.add('stage_3', C).mesh((m) => crumpleShell(m, 'lavender*', 78, 37));
  const core = rig.root.add('core', C);
  core.mesh((m) => {
    // the tidy form inside: a big folded crane
    const s = 2.4, T = ([x, y, z]) => [x * s, y * s, z * s];
    m.hull('gold', [[-15, 18, 0], [15, 18, 0], [0, 26, 5], [0, 26, -5], [-6, 4, 0], [6, 4, 0], [0, 0, 3], [0, 0, -3]].map(T));
    both((q) => { plate(m, 'gold', [[12, 24, q * 4], [-1, 27, q * 5], [-8, 42, q * 30]].map(T), 3); plate(m, 'gold', [[-13, 24, q * 4], [-1, 27, q * 5], [-8, 42, q * 30]].map(T), 3); });
    m.hull('gold', [[9, 16, 2], [9, 16, -2], [15, 18, 0], [11, 24, 0], [27, 50, 1.6], [27, 50, -1.6], [30, 48, 0], [34, 44, 0]].map(T));
    m.hull('gold', [[-9, 16, 2], [-9, 16, -2], [-15, 18, 0], [-11, 24, 0], [-33, 48, 1.4], [-33, 48, -1.4], [-35, 47, 0]].map(T));
  });
  core.s = [0.001, 0.001, 0.001]; // tiny until the last shell opens; the game (or the unfold clip) scales it to 1
  const eyes = rig.root.add('eyes', [0, 130, 112]);
  eyes.mesh((m) => {
    both((s) => {
      disc(m, 'cream', [s * 26, 132, 112], [0, 0, 1], 17, 20, { h: 4, sink: 4, sides: 24 }); // big round paper eye whites
      disc(m, 'ink', [s * 22, 128, 116], [0, 0, 1], 7.5, 8.5, { h: 1, sink: 1, sides: 18 }); // pupils looking at the player
      m.hull('cream', [[s * 10, 158, 110], [s * 40, 163, 108], [s * 12, 164, 113], [s * 40, 169, 111], [s * 26, 171, 112]]); // folded brows, slightly worried
    });
  });
  for (let i = 0; i < 3; i++) rig.root.anchorAt(`label_anchor_${i}`, [(i - 1) * 70, 200 - i * 8, 60 - Math.abs(i - 1) * 20]);
  const rot = (node, keys) => ({ node, path: 'rotation', keys });
  rig.clip('idle', [
    { node: 'stage_1', path: 'scale', keys: loop(3, 8, (t) => [1 + 0.02 * sin(t), 1 - 0.03 * sin(t), 1 + 0.02 * sin(t)]) },
    rot('stage_2', loop(3, 8, (t) => [0, 6 * sin(t), 0])),
    rot('stage_3', loop(3, 8, (t) => [0, -8 * sin(t), 0])),
    { node: 'eyes', path: 'translation', keys: loop(3, 8, (t) => [3 * sin(t), -3 * sin(t), 0]) },
  ]);
  rig.clip('hit', [
    { node: 'stage_1', path: 'scale', keys: [[0, [1, 1, 1]], [0.1, [1.15, 0.8, 1.15]], [0.3, [0.92, 1.1, 0.92]], [0.5, [1, 1, 1]], [0.8, [1, 1, 1]]] },
    rot('stage_1', [[0, [0, 0, 0]], [0.15, [0, 0, 8]], [0.3, [0, 0, -6]], [0.45, [0, 0, 3]], [0.8, [0, 0, 0]]]),
    { node: 'eyes', path: 'scale', keys: [[0, [1, 1, 1]], [0.1, [1.2, 0.3, 1]], [0.4, [1.2, 0.3, 1]], [0.55, [1, 1, 1]], [0.8, [1, 1, 1]]] },
  ]);
  // unfold: the three shells peel away one by one and the crane grows from the centre
  const peel = (node, t0) => [
    { node, path: 'scale', keys: [[0, [1, 1, 1]], [t0, [1, 1, 1]], [t0 + 0.3, [1.25, 1.25, 1.25]], [t0 + 0.6, [0.001, 0.001, 0.001]], [3, [0.001, 0.001, 0.001]]] },
    rot(node, [[0, [0, 0, 0]], [t0, [0, 0, 0]], [t0 + 0.6, [0, 120, 30]], [3, [0, 120, 30]]]),
  ];
  rig.clip('unfold', [
    ...peel('stage_1', 0), ...peel('stage_2', 0.7), ...peel('stage_3', 1.4),
    { node: 'core', path: 'scale', keys: [[0, [0.001, 0.001, 0.001]], [1.9, [0.001, 0.001, 0.001]], [2.6, [1.1, 1.1, 1.1]], [3, [1, 1, 1]]] },
    { node: 'eyes', path: 'scale', keys: [[0, [1, 1, 1]], [1.8, [1, 1, 1]], [2.0, [0.001, 0.001, 0.001]], [3, [0.001, 0.001, 0.001]]] },
  ]);
}

// ------------------------------------------------------------------ robot partners (fictional paper robots)
function robot(kind) {
  return (rig) => {
    const M = { a: 'cobalt*', b: 'teal*', c: 'orange*' }[kind], S = 'stone*', L = 'lemon';
    const body = rig.root.add('body', [0, 14, 0]);
    let headY, shoulderY, shoulderX;
    body.mesh((m) => {
      if (kind === 'a') { // boxy robot on two block feet
        m.box(M, [-15, 12, -11], [15, 44, 11]);
        m.box(S, [-10, 20, 11], [10, 36, 12.5]); // chest panel
        for (const x of [-5, 0, 5]) m.box(L, [x - 1.6, 30, 12.5], [x + 1.6, 33.2, 14]); // indicator lights
        both((s) => m.box(S, [s * 5 - 4.5, 0, -8], [s * 5 + 4.5, 12, 9]));
        headY = 44; shoulderY = 40; shoulderX = 15;
      } else if (kind === 'b') { // round robot rolling on a wheel
        m.prism(M, [0, 0], 16, 14, 42, 8, Math.PI / 8);
        m.frustum(M, [0, 0], 16, 12, 42, 46, 8, Math.PI / 8);
        m.frustum(S, [0, 0], 12, 16, 8, 14, 8, Math.PI / 8);
        m.with({ t: [0, 6, 0], rx: Math.PI / 2 }, () => m.prism(S, [0, 0], 6, -5, 5, 8)); // wheel
        m.hull(L, blob([0, 30, 15], 4, 4, 2, 6)); // chest lamp
        headY = 46; shoulderY = 38; shoulderX = 16;
      } else { // tall robot on springy legs
        m.hull(M, [[-13, 20, -10], [13, 20, -10], [-13, 20, 10], [13, 20, 10], [-17, 48, -12], [17, 48, -12], [-17, 48, 12], [17, 48, 12]]);
        both((s) => {
          for (let i = 0; i < 4; i++) m.box(S, [s * 7 - 3, 4 + i * 4, -3], [s * 7 + 3, 6 + i * 4, 3]); // spring coils
          m.box(S, [s * 7 - 5, 0, -6], [s * 7 + 5, 4, 7]);
        });
        m.box(S, [-9, 30, 10], [9, 40, 11.5]);
        headY = 48; shoulderY = 44; shoulderX = 17;
      }
    });
    const head = body.add('head', [0, headY, 0]);
    let antennaBase, eyesAt;
    head.mesh((m) => {
      if (kind === 'a') {
        m.box(M, [-12, headY, -10], [12, headY + 18, 10]);
        m.box(S, [-9, headY + 4, 10], [9, headY + 14, 11.5]); // face plate
        both((s) => m.box(S, [s > 0 ? 12 : -15, headY + 6, -3], [s > 0 ? 15 : -12, headY + 12, 3])); // ear bolts
        antennaBase = [0, headY + 18, 0]; eyesAt = headY + 10;
      } else if (kind === 'b') {
        m.hull(M, [...blob([0, headY + 10, 0], 13, 11, 12, 8)].filter((p) => p[1] >= headY + 4).concat([[-13, headY + 4, 0], [13, headY + 4, 0], [0, headY + 4, 12], [0, headY + 4, -12]]));
        m.box('ink', [-9, headY + 8, 10], [9, headY + 13, 12.6]); // visor
        antennaBase = [0, headY + 20, 0]; eyesAt = null;
      } else {
        m.box(M, [-15, headY, -9], [15, headY + 20, 9]);
        m.box(S, [-12, headY + 3, 9], [12, headY + 17, 10.5]); // screen
        antennaBase = [0, headY + 20, 0]; eyesAt = headY + 10;
      }
    });
    if (eyesAt) head.mesh((m) => both((s) => disc(m, 'ink', [s * 4.5, eyesAt, 12.2], [0, 0, 1], 2.3, 2.3, { sink: 2 })));
    const antenna = head.add('antenna', antennaBase);
    antenna.mesh((m) => {
      if (kind === 'b') both((s) => { m.beam(S, [s * 4, antennaBase[1], 0], [s * 8, antennaBase[1] + 12, 0], 2.2); m.hull(L, blob([s * 8, antennaBase[1] + 14, 0], 3, 3, 3, 10)); });
      else if (kind === 'c') { for (let i = 0; i < 3; i++) m.beam(S, [i % 2 ? 2.5 : -2.5, antennaBase[1] + i * 4, 0], [i % 2 ? -2.5 : 2.5, antennaBase[1] + (i + 1) * 4, 0], 2.2); m.hull(L, blob([0, antennaBase[1] + 15, 0], 3.5, 3.5, 3.5, 10)); }
      else { m.prism(S, [0, 0], 1.2, antennaBase[1], antennaBase[1] + 10, 4); m.hull(L, blob([0, antennaBase[1] + 13, 0], 3.5, 3.5, 3.5, 10)); } // head light
    });
    both((s) => {
      const arm = body.add(s > 0 ? 'arm_l' : 'arm_r', [s * shoulderX, shoulderY, 0]);
      arm.mesh((m) => {
        const x0 = s * shoulderX;
        m.box(S, [Math.min(x0, x0 + s * 5), shoulderY - 4, -4], [Math.max(x0, x0 + s * 5), shoulderY + 3, 4]); // shoulder joint
        m.box(kind === 'b' ? S : M, [Math.min(x0 + s * 2, x0 + s * 7), shoulderY - 24, -3.5], [Math.max(x0 + s * 2, x0 + s * 7), shoulderY - 4, 3.5]);
        if (kind === 'c') both((q) => m.box(S, [Math.min(x0 + s * 2, x0 + s * 7), shoulderY - 31, q > 0 ? 1 : -3.5], [Math.max(x0 + s * 2, x0 + s * 7), shoulderY - 24, q > 0 ? 3.5 : -1])); // claw
        else m.hull(S, blob([x0 + s * 4.5, shoulderY - 27, 0], 4, 4, 4, 10)); // hand
      });
    });
    rig.root.anchorAt('label_anchor', [0, 100, 0]);
    const { rot } = characterClips(rig, { head: 'head', armL: 'arm_l', armR: 'arm_r', extra: [{ clip: 'idle', track: { node: 'antenna', path: 'rotation', keys: loop(2.4, 8, (t) => [0, 0, 8 * sin(t, 2)]) } }] });
    rig.clip('help', [
      rot('arm_r', [[0, [0, 0, 0]], [0.3, [-80, 0, 0]], [1.2, [-80, 0, 0]], [1.5, [0, 0, 0]]]),
      rot('arm_l', [[0, [0, 0, 0]], [0.3, [-80, 0, 0]], [1.2, [-80, 0, 0]], [1.5, [0, 0, 0]]]),
      rot('head', [[0, [0, 0, 0]], [0.3, [10, 0, 0]], [1.2, [10, 0, 0]], [1.5, [0, 0, 0]]]),
    ]);
  };
}

const CH = (name, size, build, notes) => ({ name, dir: 'characters', category: 'characters', sheet: 'characters', size, build, notes });
export default [
  CH('pip_owl', [0.064, 0.05, 0.11], pip, 'Faces the player. label_anchor marks the speech bubble, up and to Pip\'s left. eyes_happy hidden by default.'),
  CH('great_crumple', [0.22, 0.22, 0.22], greatCrumple, 'stage_1 is the outer shell (opens first), stage_3 the inner one. core (the tidy crane) rests at scale 0.001; unfold grows it. label_anchor_0..2 for the three numbers.'),
  CH('robot_partner_a', [0.06, 0.03, 0.08], robot('a'), 'Boxy robot, cobalt.'),
  CH('robot_partner_b', [0.06, 0.03, 0.08], robot('b'), 'Round robot on a wheel, teal.'),
  CH('robot_partner_c', [0.06, 0.03, 0.08], robot('c'), 'Tall robot on springs, orange.'),
];
