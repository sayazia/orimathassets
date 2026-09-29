// Foldlings: origami animals that carry a number flag. Head points to +x, the flat
// profile faces the player (+z), feet stand on y = 0. Authored in millimetres.
import { plate, eye, happyEye, leg, surf, blob, kite } from '../lib/origami.mjs';
import { creatureClips } from '../lib/clips.mjs';
import { MISSIONS, ROLES } from '../lib/palette.mjs';

export const FOLDLING_VARIANTS = [
  ...MISSIONS.map((id) => ({ id, pal: { main: ROLES[id], trim: 'cream' } })),
  { id: 'rare', pal: { main: 'gold', trim: 'paper' } },
];

const both = (f) => { f(1); f(-1); };
const Z = (p, s) => [p[0], p[1], p[2] * s];

// Seats a pair of eyes (and hidden happy eyes) on the head hull, looking out of both sides.
function eyes(head, pts, at, { size = 4.4, tilt = [0, 0, 1], zc = 0 } = {}) {
  const hits = [1, -1].map((s) => {
    const dir = [tilt[0], tilt[1], -s * tilt[2]];
    const h = surf(typeof pts === 'function' ? pts(s) : pts, [at[0] - dir[0] * 60, at[1] - dir[1] * 60, s * zc - dir[2] * 60], dir);
    if (!h) throw new Error(`${head.name}: eye ray missed`);
    return h;
  });
  head.mesh((m) => hits.forEach((h) => eye(m, h.p, h.n, size)));
  const happy = head.add('eyes_happy', head.world, { hidden: true });
  happy.mesh((m) => hits.forEach((h) => happyEye(m, h.p, h.n, size + 0.8)));
}

function anchors(rig, flag, top) {
  rig.find('body').anchorAt('flag_anchor', flag);
  rig.root.anchorAt('label_anchor', [0, top, 0]);
}

// ---------------------------------------------------------------- fox
function fox(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [0, 24, 0]);
  body.mesh((m) => {
    // folded torso: ridge along the back, a side crease at mid height, keel under the belly
    m.hull(M, [[-16, 37, 0], [8, 38, 0], [-18, 28, 11], [-18, 28, -11], [8, 28, 11.5], [8, 28, -11.5], [-17, 17, 7], [-17, 17, -7], [8, 16, 8], [8, 16, -8], [-24, 29, 0], [-14, 13, 0], [6, 12.5, 0]]);
    // cream chest: the paper's back side folded out
    m.hull(T, [[8, 38, 0], [8, 28, 11.5], [8, 28, -11.5], [8, 16, 8], [8, 16, -8], [6, 12.5, 0], [19, 27, 0], [15, 35, 0], [16, 18, 0], [14, 27, 7], [14, 27, -7]]);
  });
  const head = body.add('head', [12, 37, 0]);
  const headPts = [[10, 48, 0], [8, 39, 9], [8, 39, -9], [20, 34, 11.5], [20, 34, -11.5], [18, 29.5, 0], [37, 31.5, 0], [26, 42, 3], [26, 42, -3], [14, 45, 6.5], [14, 45, -6.5], [29, 34, 5], [29, 34, -5]];
  head.mesh((m) => {
    m.hull(M, headPts);
    m.hull(T, [[20, 32.5, 8.5], [20, 32.5, -8.5], [18, 29.2, 0], [35.5, 30.8, 0], [28, 31.4, 4.5], [28, 31.4, -4.5]]); // muzzle
    m.hull('ink', [[34, 30.4, 2.4], [34, 30.4, -2.4], [38.6, 31.6, 0], [34.6, 34.2, 0], [33.4, 32.4, 0]]); // nose
  });
  eyes(head, headPts, [23, 39], { size: 4.6 });
  both((s) => {
    const ear = head.add(s > 0 ? 'ear_l' : 'ear_r', [14, 44, s * 6]);
    ear.mesh((m) => {
      m.hull(M, [[9, 43, s * 3], [19, 42.5, s * 5], [13, 45.5, s * 10.5], [12, 59, s * 7.5], [14.5, 45, s * 3], [14, 50, s * 5]]);
      plate(m, T, [[11.6, 45, s * 9.9], [17.2, 44.4, s * 8.2], [12.7, 55.5, s * 8.5]].map((p) => [p[0], p[1], p[2] + s * 0.4]), 1.2);
    });
  });
  const tail = body.add('tail', [-19, 29, 0]);
  tail.mesh((m) => {
    m.hull(M, [[-16, 35, 4.5], [-16, 35, -4.5], [-18, 21, 4.5], [-18, 21, -4.5], [-28, 24, 0], [-34, 32, 8], [-34, 32, -8], [-32, 44, 6.5], [-32, 44, -6.5], [-25, 42, 0], [-38, 38, 0]]);
    m.hull(T, [[-32, 44, 6.5], [-32, 44, -6.5], [-25, 42, 0], [-38, 38, 0], [-36, 45, 4.5], [-36, 45, -4.5], [-34, 57, 0], [-29, 50, 3], [-29, 50, -3]]);
  });
  for (const [n, x, z] of [['leg_fl', 6, 6], ['leg_fr', 6, -6], ['leg_bl', -14, 6], ['leg_br', -14, -6]]) {
    body.add(n, [x, 18, z]).mesh((m) => leg(m, M, [x, 19, z], [x + (x > 0 ? 2 : -1), 0, z * 1.15], 9, 5.5, 7, x > 0 ? -1.5 : 1.5));
  }
  anchors(rig, [-4, 38, 0], 72);
  creatureClips(rig, { head: 'head', tail: 'tail', legs: ['leg_fl', 'leg_fr', 'leg_bl', 'leg_br'], ears: ['ear_l', 'ear_r'] });
}

// ---------------------------------------------------------------- rabbit (sitting)
function rabbit(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [-4, 18, 0]);
  body.mesh((m) => {
    m.hull(M, blob([-5, 18, 0], 15, 17, 13, 6, 0.3));
    m.hull(T, [[4, 30, 0], [9, 22, 6], [9, 22, -6], [8, 10, 5], [8, 10, -5], [12, 18, 0], [4, 8, 0]]); // cream belly flap
    m.hull(T, blob([-21, 16, 0], 5, 5, 5, 5)); // pom tail
  });
  const head = body.add('head', [6, 33, 0]);
  const headPts = [...blob([12, 40, 0], 11, 10, 11, 6, 0.26), [25, 37, 0], [23, 41, 3], [23, 41, -3]];
  head.mesh((m) => {
    m.hull(M, headPts);
    m.hull(T, [[18, 34, 6], [18, 34, -6], [25.4, 36.6, 0], [22, 33.2, 0], [23, 38, 3.5], [23, 38, -3.5]]); // muzzle
    m.hull('ink', [[24.4, 37.2, 1.8], [24.4, 37.2, -1.8], [26.2, 38.2, 0], [24.8, 39.6, 0]]); // nose
  });
  eyes(head, headPts, [17, 42], { size: 4.6 });
  both((s) => {
    const ear = head.add(s > 0 ? 'ear_l' : 'ear_r', [9, 48, s * 4]);
    ear.mesh((m) => {
      kite(m, M, [5, 47, s * 2], [13, 47, s * 6], [3, 70, s * 8], [0, 0, s * 3], 2.2);
      plate(m, T, [[6.5, 50, s * 5.6], [11, 50, s * 7.2], [4.6, 64, s * 8.9]], 1.2);
    });
  });
  both((s) => {
    body.add(s > 0 ? 'leg_bl' : 'leg_br', [-10, 12, s * 11]).mesh((m) => {
      m.hull(M, [...blob([-10, 11, s * 12.5], 10, 10, 3.5, 6), [-18, 4, s * 13]]); // haunch
      m.hull(M, [[-14, 0, s * 10], [-14, 0, s * 16], [6, 0, s * 12], [6, 0, s * 15], [-12, 5, s * 13], [2, 3, s * 13.5]]); // long hind foot
    });
    body.add(s > 0 ? 'leg_fl' : 'leg_fr', [7, 16, s * 6]).mesh((m) => leg(m, M, [7, 17, s * 6], [10, 0, s * 6.5], 6, 5, 5, -1));
  });
  anchors(rig, [-8, 34, 0], 82);
  creatureClips(rig, { head: 'head', tail: null, legs: ['leg_fl', 'leg_fr', 'leg_bl', 'leg_br'], ears: ['ear_l', 'ear_r'], hopHeight: 20 });
}

// ---------------------------------------------------------------- crane (classic tsuru)
function crane(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [0, 16, 0]);
  body.mesh((m) => {
    m.hull(M, [[-15, 18, 0], [15, 18, 0], [0, 26, 5], [0, 26, -5], [-6, 4, 0], [6, 4, 0], [0, 0, 3], [0, 0, -3], [-8, 12, 7], [8, 12, 7], [-8, 12, -7], [8, 12, -7]]);
  });
  both((s) => {
    body.add(s > 0 ? 'wing_l' : 'wing_r', [0, 25, s * 4]).mesh((m) => {
      // broad wing folded once along its length (valley fold): front and back panels, cream underside tip
      const f = [12, 24, s * 4], b = [-13, 24, s * 4], mid = [-1, 27, s * 5], tip = [-8, 42, s * 35];
      plate(m, M, [f, mid, tip], 2);
      plate(m, M, [b, mid, tip], 2);
      plate(m, T, [[-3.5, 34.4, s * 21.2], [-6.5, 34, s * 21.4], tip].map((p) => [p[0], p[1] - 1.4, p[2]]), 1.2);
    });
  });
  const neck = body.add('neck', [12, 18, 0]);
  neck.mesh((m) => m.hull(M, [[9, 16, 2], [9, 16, -2], [15, 18, 0], [11, 24, 0], [27, 52, 1.6], [27, 52, -1.6], [29, 51, 0]]));
  const head = neck.add('head', [27, 51, 0]);
  const headPts = [[24, 50, 2.6], [24, 50, -2.6], [30, 55, 0], [28, 50, 0], [37, 44, 0], [27, 54, 2], [27, 54, -2]];
  head.mesh((m) => {
    m.hull(M, headPts);
  });
  eyes(head, headPts, [28, 52], { size: 4 });
  const tail = body.add('tail', [-12, 18, 0]);
  tail.mesh((m) => m.hull(M, [[-9, 16, 2], [-9, 16, -2], [-15, 18, 0], [-11, 24, 0], [-33, 50, 1.4], [-33, 50, -1.4], [-35, 49, 0]]));
  anchors(rig, [-4, 26, 0], 72);
  creatureClips(rig, { head: 'head', tail: 'tail', wings: ['wing_l', 'wing_r'], tailAxis: 'z' });
  rig.clips.find((c) => c.name === 'idle').tracks.push({ node: 'neck', path: 'rotation', keys: [[0, [0, 0, 0]], [1.2, [0, 0, 5]], [2.4, [0, 0, 0]]] });
}

// ---------------------------------------------------------------- turtle
function turtle(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [0, 8, 0]);
  const hex = (r, y, rot, sx = 1.15) => [...Array(6).keys()].map((i) => { const a = rot + (i / 6) * Math.PI * 2; return [Math.cos(a) * r * sx - 2, y, Math.sin(a) * r]; });
  body.mesh((m) => {
    // hexagon-fold shell: flat top hexagon, a turned ring of facets, then the rim
    m.hull(M, [...hex(9, 28, 0), ...hex(17, 23.5, Math.PI / 6), ...hex(24, 14, 0), ...hex(24, 9, 0)]);
    m.hull(T, [...hex(22, 9.2, 0), ...hex(18, 4, 0)]); // plastron
  });
  const head = body.add('head', [22, 12, 0]);
  const headPts = [...blob([33, 15, 0], 9, 7, 7.5, 6, 0.26), [20, 14, 5], [20, 14, -5], [20, 8, 0]];
  head.mesh((m) => m.hull(M, headPts));
  eyes(head, headPts, [36, 17], { size: 4.2 });
  for (const [n, x, z] of [['leg_fl', 13, 1], ['leg_fr', 13, -1], ['leg_bl', -16, 1], ['leg_br', -16, -1]]) {
    const front = x > 0;
    body.add(n, [x, 9, z * 15]).mesh((m) => {
      // paddle-shaped flipper folded flat against the table
      m.hull(M, [[x - 5, 10, z * 14], [x + 5, 10, z * 14], [x - 3, 6, z * 18], [x + (front ? 9 : -4), 0, z * 26], [x + (front ? 2 : -10), 0, z * 25], [x + (front ? 4 : -6), 2.5, z * 22]]);
    });
  }
  const tail = body.add('tail', [-26, 8, 0]);
  tail.mesh((m) => m.hull(M, [[-24, 10, 3], [-24, 10, -3], [-24, 5, 0], [-34, 4, 0], [-28, 8, 0]]));
  anchors(rig, [-2, 28, 0], 48);
  creatureClips(rig, { head: 'head', tail: 'tail', legs: ['leg_fl', 'leg_fr', 'leg_bl', 'leg_br'], hopHeight: 8 });
}

// ---------------------------------------------------------------- frog (jumping frog)
function frog(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [0, 10, 0]);
  const bodyPts = [[-20, 10, 0], [-16, 5, 10], [-16, 5, -10], [-2, 17, 11], [-2, 17, -11], [9, 26, 8], [9, 26, -8], [22, 15, 0], [16, 20, 6], [16, 20, -6], [14, 6, 9], [14, 6, -9], [-4, 3, 9], [-4, 3, -9], [-2, 22, 0]];
  body.mesh((m) => {
    m.hull(M, bodyPts);
    m.hull(T, [[21, 14, 0], [14, 5.6, 8.6], [14, 5.6, -8.6], [-2, 3, 8], [-2, 3, -8], [17, 10, 5], [17, 10, -5]]); // cream throat and belly
    both((s) => m.hull(M, blob([8, 27, s * 7], 5, 5, 5, 5))); // eye bumps
    both((s) => leg(m, M, [10, 10, s * 9], [15, 0, s * 13], 6, 5, 4, 1)); // front legs
  });
  eyes(body, (s) => blob([8, 27, s * 7], 5, 5, 5, 5), [8, 28], { size: 4.4, tilt: [-0.6, -0.4, 1], zc: 7 });
  both((s) => {
    body.add(s > 0 ? 'leg_bl' : 'leg_br', [-12, 9, s * 12]).mesh((m) => {
      m.hull(M, [[-16, 12, s * 10], [-10, 5, s * 11], [-8, 13, s * 11], [4, 9, s * 19], [2, 6, s * 20], [-12, 8, s * 14]]); // thigh forward
      m.hull(M, [[4, 10, s * 18.5], [3, 5, s * 21], [-19, 3, s * 21.5], [-19, 7, s * 18.5], [-8, 9, s * 22]]); // shin back
      m.hull(M, [[-21, 0, s * 17], [-21, 0, s * 24], [-9, 0, s * 24], [-6, 0, s * 20.5], [-20, 2.4, s * 18], [-19, 2.4, s * 23], [-10, 2.4, s * 22]]); // foot
    });
  });
  anchors(rig, [-6, 20, 0], 50);
  creatureClips(rig, { head: null, legs: ['leg_bl', 'leg_br'], hopHeight: 22 });
}

// ---------------------------------------------------------------- fish (hovers; belly 1 cm above the table)
function fish(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [0, 25, 0]);
  const bodyPts = [[31, 25, 0], [24, 32, 4], [24, 32, -4], [24, 18, 4], [24, 18, -4], [4, 38, 0], [4, 12, 0], [4, 33, 9], [4, 33, -9], [4, 17, 9], [4, 17, -9], [-18, 30, 4], [-18, 30, -4], [-18, 20, 4], [-18, 20, -4], [-22, 25, 0]];
  body.mesh((m) => {
    m.hull(M, bodyPts);
    m.hull(T, [[24, 18.6, 3.6], [24, 18.6, -3.6], [30, 23, 0], [4, 12.4, 0], [4, 17.4, 8.4], [4, 17.4, -8.4], [-14, 20.5, 3], [-14, 20.5, -3], [-12, 17, 0]]); // pale belly
    plate(m, M, [[8, 36, 0], [-12, 32, 0], [-2, 45, 0]], 2.2); // dorsal fin
  });
  eyes(body, bodyPts, [20, 29], { size: 4.6 });
  const tail = body.add('tail', [-20, 25, 0]);
  tail.mesh((m) => {
    plate(m, M, [[-19, 25, 0], [-38, 41, 0], [-31, 25, 0]], 2.4);
    plate(m, T, [[-19, 25, 0], [-31, 25, 0], [-38, 9, 0]], 2.4);
  });
  both((s) => body.add(s > 0 ? 'fin_l' : 'fin_r', [8, 18, s * 8]).mesh((m) => plate(m, T, [[10, 18, s * 8], [3, 18, s * 8.6], [-2, 11, s * 14]], 1.8)));
  anchors(rig, [0, 38, 0], 58);
  creatureClips(rig, { head: null, tail: 'tail', fins: ['fin_l', 'fin_r'], floating: true, hopHeight: 10 });
}

// ---------------------------------------------------------------- cat (sitting)
function cat(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [0, 16, 0]);
  body.mesh((m) => {
    m.hull(M, [[-14, 0, 11], [-14, 0, -11], [6, 0, 11], [6, 0, -11], [-17, 12, 0], [-12, 22, 9], [-12, 22, -9], [4, 36, 7], [4, 36, -7], [-6, 38, 0], [10, 30, 0], [-4, 8, 13], [-4, 8, -13]]);
    m.hull(T, [[10, 30, 0], [4, 35.6, 6.4], [4, 35.6, -6.4], [7, 12, 6], [7, 12, -6], [11, 20, 3], [11, 20, -3], [6, 4, 0]]); // bib
    both((s) => leg(m, M, [8, 18, s * 5], [13, 0, s * 5], 6, 5.5, 5, 2)); // front legs
  });
  const head = body.add('head', [3, 38, 0]);
  const headPts = [...blob([6, 47, 0], 12, 10, 12, 6, 0.26), [17, 45, 0], [14, 42, 5], [14, 42, -5]];
  head.mesh((m) => {
    m.hull(M, headPts);
    m.hull(T, [[13, 40.6, 6], [13, 40.6, -6], [17.6, 44, 0], [15, 39.2, 0], [16, 43, 3.6], [16, 43, -3.6]]); // muzzle
    m.hull('ink', [[16.8, 44.4, 1.6], [16.8, 44.4, -1.6], [18.6, 45.2, 0], [17, 46.8, 0]]); // nose
  });
  eyes(head, headPts, [11, 48], { size: 4.6 });
  both((s) => {
    head.add(s > 0 ? 'ear_l' : 'ear_r', [5, 55, s * 6]).mesh((m) => {
      m.hull(M, [[0, 53, s * 3], [11, 53, s * 5], [5, 54, s * 11], [4, 65, s * 8], [6, 57, s * 4]]);
      plate(m, T, [[3, 55, s * 9.2], [8.6, 55, s * 8.2], [4.5, 62, s * 8.6]].map((p) => [p[0], p[1], p[2] + s * 0.4]), 1.2);
    });
  });
  const tail = body.add('tail', [-14, 6, 0]);
  tail.mesh((m) => {
    m.hull(M, [[-12, 3, 3], [-12, 3, -3], [-14, 9, 0], [-24, 14, 2.5], [-24, 14, -2.5], [-26, 18, 0]]);
    m.hull(M, [[-24, 14, 2.5], [-24, 14, -2.5], [-26, 18, 0], [-24, 34, 2], [-24, 34, -2], [-21, 33, 0]]);
    m.hull(T, [[-24, 34, 2], [-24, 34, -2], [-21, 33, 0], [-17, 42, 0], [-19, 41, 1.6], [-19, 41, -1.6]]);
  });
  anchors(rig, [-8, 34, 0], 78);
  creatureClips(rig, { head: 'head', tail: 'tail', ears: ['ear_l', 'ear_r'], tailAxis: 'z', hopHeight: 12 });
}

// ---------------------------------------------------------------- elephant
function elephant(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [-4, 30, 0]);
  body.mesh((m) => {
    m.hull(M, blob([-5, 31, 0], 22, 15, 16, 6, 0));
    m.hull(M, [[-25, 36, 1.5], [-25, 36, -1.5], [-26, 31, 0], [-31, 18, 1.4], [-31, 18, -1.4], [-33, 17, 0]]); // tail
  });
  const head = body.add('head', [14, 38, 0]);
  const headPts = [...blob([21, 41, 0], 12, 12, 12, 6, 0.26), [31, 34, 5], [31, 34, -5]];
  head.mesh((m) => {
    m.hull(M, headPts);
    both((s) => m.hull(T, [[28, 30, s * 5], [30, 34, s * 5], [36, 25, s * 8.5], [35, 27, s * 9]])); // tusks
  });
  eyes(head, headPts, [27, 45], { size: 4.4 });
  const trunk = head.add('trunk', [31, 36, 0]);
  trunk.mesh((m) => {
    m.hull(M, [[27, 38, 4.5], [27, 38, -4.5], [34, 38, 0], [28, 32, 0], [34, 20, 3.5], [34, 20, -3.5], [38, 21, 0]]);
    m.hull(M, [[34, 20, 3.5], [34, 20, -3.5], [38, 21, 0], [34, 8, 3], [34, 8, -3], [38, 7, 0], [35, 14, 0]]);
    m.hull(M, [[34, 8, 3], [34, 8, -3], [38, 7, 0], [43, 13, 2.6], [43, 13, -2.6], [44, 9, 0], [39, 3.5, 2], [39, 3.5, -2]]); // curled tip
  });
  both((s) => {
    head.add(s > 0 ? 'ear_l' : 'ear_r', [17, 46, s * 10]).mesh((m) => {
      // big fan ear: two folded panels
      plate(m, M, [[19, 52, s * 10], [15, 24, s * 13], [7, 40, s * 21]], 2.4);
      plate(m, M, [[19, 52, s * 10], [7, 40, s * 21], [8, 55, s * 16]], 2.4);
      plate(m, T, [[17, 47, s * 12.4], [15, 31, s * 14], [10, 41, s * 18.6]], 1.2);
    });
  });
  for (const [n, x, z] of [['leg_fl', 9, 9], ['leg_fr', 9, -9], ['leg_bl', -17, 9], ['leg_br', -17, -9]]) {
    body.add(n, [x, 20, z]).mesh((m) => leg(m, M, [x, 22, z], [x, 0, z * 1.05], 12, 10, 10, 0));
  }
  anchors(rig, [-8, 46, 0], 72);
  creatureClips(rig, { head: 'head', tail: null, legs: ['leg_fl', 'leg_fr', 'leg_bl', 'leg_br'], ears: ['ear_l', 'ear_r'], hopHeight: 10 });
  rig.clips.find((c) => c.name === 'idle').tracks.push({ node: 'trunk', path: 'rotation', keys: [[0, [0, 0, 0]], [1.2, [0, 0, 8]], [2.4, [0, 0, 0]]] });
  rig.clips.find((c) => c.name === 'cheer').tracks.push({ node: 'trunk', path: 'rotation', keys: [[0, [0, 0, 0]], [0.3, [0, 0, 60]], [0.9, [0, 0, 60]], [1.2, [0, 0, 0]]] });
}

// ---------------------------------------------------------------- paper bird ("fold home" form)
// Flies towards +x with wings along z. Origin at the centre of the body (it is never on the table).
function paperBird(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [0, 0, 0]);
  body.mesh((m) => {
    m.hull(M, [[30, 0, 0], [8, 3.5, 2.5], [8, 3.5, -2.5], [8, -3.5, 0], [-12, 3, 2.5], [-12, 3, -2.5], [-12, -3, 0]]); // head and chest
    m.hull(T, [[-12, 3, 2.5], [-12, 3, -2.5], [-12, -3, 0], [-30, 8, 1.5], [-30, 8, -1.5], [-28, 4, 0]]); // tail
  });
  eyes(body, [[30, 0, 0], [8, 3.5, 2.5], [8, 3.5, -2.5], [8, -3.5, 0]], [18, 1.2], { size: 4 });
  both((s) => {
    body.add(s > 0 ? 'wing_l' : 'wing_r', [0, 3, s * 2]).mesh((m) => {
      plate(m, M, [[10, 3, s * 2], [-2, 4.5, s * 3], [-6, 8, s * 35]], 2);
      plate(m, M, [[-12, 3, s * 2], [-2, 4.5, s * 3], [-6, 8, s * 35]], 2);
    });
  });
  rig.clip('flap', [
    { node: 'wing_l', path: 'rotation', keys: [[0, [-30, 0, 0]], [0.2, [30, 0, 0]], [0.4, [-30, 0, 0]]] },
    { node: 'wing_r', path: 'rotation', keys: [[0, [30, 0, 0]], [0.2, [-30, 0, 0]], [0.4, [30, 0, 0]]] },
    { node: 'body', path: 'translation', keys: [[0, [0, 1.5, 0]], [0.2, [0, -1.5, 0]], [0.4, [0, 1.5, 0]]] },
  ]);
}

// ---------------------------------------------------------------- number flag carried by a Foldling
// Origin at the foot of the pole (attach to a Foldling's flag_anchor). The cloth is plain; the game draws the number.
function flag(rig) {
  const pole = rig.root.add('pole', [0, 0, 0]);
  pole.mesh((m) => {
    m.prism('wood*', [0, 0], 1.6, 0, 88, 4, Math.PI / 4);
    m.hull('wood*', blob([0, 90, 0], 2.6, 2.6, 2.6, 4)); // finial
  });
  const cloth = pole.add('cloth', [1.5, 86, 0]);
  cloth.mesh((m) => {
    // two panels with a soft valley fold, like a folded paper pennant
    plate(m, 'cream*', [[1.5, 86, 0.6], [26.5, 86, -1.2], [26.5, 51, -1.2], [1.5, 51, 0.6]], 2);
    plate(m, 'cream*', [[26.5, 86, -1.2], [51.5, 86, 0.6], [51.5, 51, 0.6], [26.5, 51, -1.2]], 2);
  });
  cloth.anchorAt('label_anchor', [26.5, 68.5, 1.8]);
  rig.clip('wave', [{ node: 'cloth', path: 'rotation', keys: [[0, [0, 0, 0]], [0.6, [0, 12, 0]], [1.2, [0, 0, 0]], [1.8, [0, -12, 0]], [2.4, [0, 0, 0]]] }]);
}

const FOLDLING = (name, size, build, notes) => ({ name, dir: 'foldlings', category: 'foldlings', sheet: 'foldlings', size, variants: FOLDLING_VARIANTS, build, notes });

export default [
  FOLDLING('foldling_fox', [0.075, 0.03, 0.06], fox),
  FOLDLING('foldling_rabbit', [0.06, 0.035, 0.07], rabbit),
  FOLDLING('foldling_crane', [0.07, 0.07, 0.06], crane),
  FOLDLING('foldling_turtle', [0.07, 0.05, 0.03], turtle),
  FOLDLING('foldling_frog', [0.05, 0.045, 0.035], frog),
  FOLDLING('foldling_fish', [0.07, 0.02, 0.04], fish, 'Floats: belly 1 cm above the table; the origin stays on the table top.'),
  FOLDLING('foldling_cat', [0.05, 0.035, 0.065], cat),
  FOLDLING('foldling_elephant', [0.075, 0.045, 0.06], elephant),
  FOLDLING('paper_bird', [0.06, 0.07, 0.02], paperBird, 'Flying form after a correct answer. Origin at the body centre; flies towards +x.'),
  { name: 'flag_small', dir: 'foldlings', category: 'foldlings', sheet: 'foldlings', size: [0.053, 0.004, 0.093], build: flag, notes: 'Origin at the foot of the pole; attach to a Foldling flag_anchor. Plain cream cloth, the game draws the number at label_anchor.' },
];
