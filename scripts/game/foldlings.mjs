// Foldlings: origami animals that carry a number flag. Head points to +x, the flat
// profile faces the player (+z), feet stand on y = 0. Authored in millimetres.
import { plate, eye, happyEye, leg, surf, blob, kite, disc, flapLeg, spike, V } from '../lib/origami.mjs';
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

// A flat folded ear standing on the head: its root edge is dropped onto the head surface and sunk 2 mm
// in, so it never floats, and a pink inner-ear triangle sits on its front face.
function ear(m, headPts, M, a, b, tip, out) {
  const seat = ([x, , z]) => { // pulled towards the centre line until it lands on the head
    const cx = headPts.reduce((a, p) => a + p[0], 0) / headPts.length;
    for (let k = 1; k > 0.05; k -= 0.05) {
      const px = cx + (x - cx) * (0.3 + 0.7 * k), pz = z * k, h = surf(headPts, [px, 300, pz], [0, -1, 0]);
      if (h) return [px, h.p[1] - 2, pz];
    }
    throw new Error('ear root misses the head');
  };
  const [a2, b2] = [seat(a), seat(b)];
  spike(m, M, a2, b2, tip, out, 1.4);
  const lerp = (p, q, t) => p.map((v, i) => v + (q[i] - v) * t);
  let n = V.norm(V.cross(V.sub(b2, a2), V.sub(tip, a2)));
  if (n[0] < 0) n = V.mul(n, -1); // the face turned towards the snout
  const mid = lerp(a2, b2, 0.5), lift = (p) => V.add(p, V.mul(n, 1.1));
  plate(m, 'pink', [lerp(lerp(a2, b2, 0.22), tip, 0.18), lerp(lerp(a2, b2, 0.78), tip, 0.18), lerp(mid, tip, 0.78)].map(lift), 0.8);
}

function anchors(rig, flag, top) {
  rig.find('body').anchorAt('flag_anchor', flag);
  rig.root.anchorAt('label_anchor', [0, top, 0]);
}

// ---------------------------------------------------------------- fox
// Built like a folded paper fox: a tent-shaped body (two big side planes meeting along the back),
// a pyramid head with a long pointed snout, flat triangular ears and flat folded strips for legs and tail.
function fox(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [0, 24, 0]);
  body.mesh((m) => {
    m.hull(M, [[-17, 36, 0], [7, 38, 0], [-23, 29, 0], [-18, 20, 8], [-18, 20, -8], [7, 19, 9.5], [7, 19, -9.5], [-5, 28, 11.5], [-5, 28, -11.5], [-6, 16, 0]]); // tent body, creased across the flank
    m.hull(T, [[7, 38, 0], [7, 19, 9.5], [7, 19, -9.5], [16, 25, 0]]); // pointed cream chest
  });
  const head = body.add('head', [12, 37, 0]);
  const headPts = [[10, 47, 0], [23, 42, 0], [13, 36, 10.5], [13, 36, -10.5], [17, 30, 0], [38, 31.5, 0]];
  head.mesh((m) => {
    m.hull(M, headPts);
    m.hull(T, [[17, 30, 0], [19, 33, 7.5], [19, 33, -7.5], [36, 31, 0], [20, 30.5, 0]]); // cream lower jaw
    disc(m, 'ink', [37.6, 31.8, 0], [1, 0.1, 0], 1.7, 1.4); // nose
  });
  eyes(head, headPts, [22, 39], { size: 4.4 });
  both((s) => {
    head.add(s > 0 ? 'ear_l' : 'ear_r', [13, 44, s * 5]).mesh((m) => ear(m, headPts, M, [9, 0, s * 3], [17, 0, s * 6.5], [11, 58, s * 7], [0.6, 0, s * 1.4]));
  });
  const tail = body.add('tail', [-19, 30, 0]);
  tail.mesh((m) => {
    spike(m, M, [-18, 35, 0], [-21, 25, 0], [-40, 44, 0], [-1, 0, 5]); // long flat brush, creased down the middle
    spike(m, T, [-34.6, 40.6, 0], [-36.4, 38.2, 0], [-40.4, 44.4, 0], [0, 0, 3.4], 1); // cream tip
  });
  for (const [n, x, z] of [['leg_fl', 4, 1], ['leg_fr', 4, -1], ['leg_bl', -15, 1], ['leg_br', -15, -1]]) {
    const zz = z * 9.2;
    body.add(n, [x, 19, zz]).mesh((m) => flapLeg(m, M, [x - 4, 20, zz], [x + 4, 20, zz], [x + (x > 0 ? 1.5 : -1), 0, zz * 1.05], [0, 0, z * 1.8]));
  }
  anchors(rig, [-4, 38, 0], 72);
  creatureClips(rig, { head: 'head', tail: 'tail', legs: ['leg_fl', 'leg_fr', 'leg_bl', 'leg_br'], ears: ['ear_l', 'ear_r'] });
}

// ---------------------------------------------------------------- rabbit (sitting)
function rabbit(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [-4, 18, 0]);
  body.mesh((m) => {
    m.hull(M, [[-19, 22, 0], [-6, 34, 0], [9, 26, 0], [-19, 1, 10], [-19, 1, -10], [7, 1, 8], [7, 1, -8], [-7, 17, 13], [-7, 17, -13], [-23, 10, 0]]); // seated pyramid
    m.hull(M, [[-4, 30, 5], [-4, 30, -5], [8, 27, 0], [3, 36, 0], [10, 34, 0]]); // neck fold up to the head
    m.hull(T, [[9, 26, 0], [7, 2, 7], [7, 2, -7], [12, 13, 0]]); // pointed cream belly
    m.hull(T, blob([-22, 16, 0], 5, 5, 5, 10)); // round pom tail
  });
  const head = body.add('head', [6, 33, 0]);
  const headPts = [[6, 48, 0], [16, 47, 0], [7, 38, 9.5], [7, 38, -9.5], [25, 37, 0], [12, 31, 0]];
  head.mesh((m) => {
    m.hull(M, headPts);
    m.hull(T, [[19, 33.4, 4.6], [19, 33.4, -4.6], [24.6, 36.4, 0], [15, 31.6, 0]]); // cream muzzle
    disc(m, 'ink', [24.9, 37.6, 0], [1, 0.3, 0], 1.5, 1.2); // nose
  });
  eyes(head, headPts, [16, 42], { size: 4.4 });
  both((s) => {
    head.add(s > 0 ? 'ear_l' : 'ear_r', [9, 47, s * 4]).mesh((m) => ear(m, headPts, M, [5, 0, s * 2.5], [13, 0, s * 5.5], [3, 72, s * 8], [0.8, 0, s * 1.8]));
  });
  both((s) => {
    body.add(s > 0 ? 'leg_bl' : 'leg_br', [-10, 12, s * 11]).mesh((m) => {
      spike(m, M, [-21, 2, s * 12], [0, 1.5, s * 11.5], [-12, 23, s * 12.5], [0, 0, s * 2.4], 1.6); // flat folded haunch
      m.hull(M, [[-15, 0, s * 10], [-15, 0, s * 15], [7, 0, s * 12.5], [-15, 2, s * 10], [-15, 2, s * 15], [7, 1.4, s * 12.5]]); // long flat hind foot
    });
    body.add(s > 0 ? 'leg_fl' : 'leg_fr', [7, 16, s * 6]).mesh((m) => flapLeg(m, M, [4, 17, s * 6], [10, 17, s * 6], [10, 0, s * 6.5], [0, 0, s * 1.4], 2.6));
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
  const headPts = [[20, 14, 5], [20, 14, -5], [20, 8, 0], [30, 21, 0], [42, 14, 0], [31, 9, 0], [32, 15, 7], [32, 15, -7]]; // pyramid head, pointed snout
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
  tail.mesh((m) => spike(m, M, [-24, 10, 0], [-24, 5, 0], [-35, 4, 0], [0, 0, 2.4], 1.4));
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
    both((s) => m.hull(M, blob([8, 27, s * 7], 5, 5, 5, 10))); // eye bumps
    both((s) => flapLeg(m, M, [8, 11, s * 9], [13, 11, s * 9], [15, 0, s * 13], [0, 0, s * 1.4], 3)); // front legs
  });
  eyes(body, (s) => blob([8, 27, s * 7], 5, 5, 5, 10), [8, 28], { size: 4.4, tilt: [-0.6, -0.4, 1], zc: 7 });
  both((s) => {
    body.add(s > 0 ? 'leg_bl' : 'leg_br', [-12, 9, s * 12]).mesh((m) => {
      spike(m, M, [-17, 12, s * 10], [-9, 4, s * 11], [5, 8, s * 19.5], [0, 1.6, s * 1.4], 1.6); // flat thigh folded forward
      spike(m, M, [5, 10, s * 19], [3, 4.5, s * 20], [-20, 4, s * 21.5], [0, 1.6, s * 1], 1.6); // flat shin folded back
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
    m.hull(M, [[-15, 0, 10], [-15, 0, -10], [6, 0, 10], [6, 0, -10], [-18, 11, 0], [-5, 38, 0], [9, 31, 0], [-6, 17, 12.5], [-6, 17, -12.5]]); // seated pyramid
    m.hull(M, [[-6, 34, 5], [-6, 34, -5], [8, 30, 0], [0, 42, 0], [8, 41, 0]]); // neck fold up to the head
    m.hull(T, [[9, 31, 0], [7, 5, 6], [7, 5, -6], [12, 17, 0]]); // pointed cream bib
    both((s) => flapLeg(m, M, [5, 19, s * 5], [11, 19, s * 5], [13, 0, s * 5.2], [0, 0, s * 1.4], 3)); // front legs
  });
  const head = body.add('head', [3, 38, 0]);
  const headPts = [[-4, 47, 0], [5, 56, 0], [14, 50, 0], [5, 40, 11], [5, 40, -11], [18, 44.5, 0], [11, 39, 0]];
  head.mesh((m) => {
    m.hull(M, headPts);
    m.hull(T, [[13, 40.6, 5], [13, 40.6, -5], [17.6, 43.6, 0], [12, 39.4, 0]]); // cream muzzle
    disc(m, 'ink', [17.9, 44.8, 0], [1, 0.3, 0], 1.4, 1.1); // nose
  });
  eyes(head, headPts, [11, 47], { size: 4.4 });
  both((s) => {
    head.add(s > 0 ? 'ear_l' : 'ear_r', [5, 55, s * 6]).mesh((m) => ear(m, headPts, M, [0, 0, s * 3.5], [10, 0, s * 6.5], [3, 66, s * 8], [0.6, 0, s * 1.6]));
  });
  const tail = body.add('tail', [-14, 6, 0]);
  tail.mesh((m) => {
    spike(m, M, [-12, 3, 0], [-15, 10, 0], [-27, 25, 0], [0, 0, 2.4], 1.4); // flat strip sweeping back...
    spike(m, M, [-24, 20, 0], [-28, 25, 0], [-19, 44, 0], [0, 0, 2.2], 1.4); // ...and folded up
  });
  anchors(rig, [-8, 34, 0], 78);
  creatureClips(rig, { head: 'head', tail: 'tail', ears: ['ear_l', 'ear_r'], tailAxis: 'z', hopHeight: 12 });
}

// ---------------------------------------------------------------- elephant
function elephant(rig, { main, trim }) {
  const M = main + '*', T = trim + '*';
  const body = rig.root.add('body', [-4, 30, 0]);
  body.mesh((m) => {
    m.hull(M, [[-22, 45, 0], [6, 48, 0], [-29, 34, 0], [-24, 20, 12], [-24, 20, -12], [9, 19, 13], [9, 19, -13], [-7, 33, 15.5], [-7, 33, -15.5], [-8, 15, 0], [13, 33, 0]]); // broad tent body, creased across the flank
    spike(m, M, [-26, 38, 0], [-28, 33, 0], [-34, 16, 0], [-1, 0, 1.6], 1.2); // thin tail
  });
  const head = body.add('head', [14, 38, 0]);
  const headPts = [[13, 53, 0], [25, 51, 0], [15, 40, 12], [15, 40, -12], [31, 38, 0], [21, 30, 0], [28, 46, 6], [28, 46, -6]];
  head.mesh((m) => {
    m.hull(M, headPts);
    both((s) => spike(m, T, [26, 33, s * 4], [28, 36, s * 4], [36, 27, s * 6.5], [0, -0.8, s * 0.6], 1.4)); // tusks
  });
  eyes(head, headPts, [26, 45], { size: 4.2 });
  const trunk = head.add('trunk', [30, 37, 0]);
  trunk.mesh((m) => {
    spike(m, M, [27, 42, 0], [31, 32, 0], [36, 9, 0], [1.4, 0, 4]); // tapered trunk, creased down the front
    spike(m, M, [34.6, 13, 0], [36.4, 10, 0], [42, 15, 0], [0, 0, 2.2], 1.2); // curled-up tip
  });
  both((s) => {
    head.add(s > 0 ? 'ear_l' : 'ear_r', [17, 46, s * 11]).mesh((m) => {
      // big flat fan ear folded once down the middle
      plate(m, M, [[20, 54, s * 12], [15, 25, s * 14], [2, 38, s * 19]], 1.6);
      plate(m, M, [[20, 54, s * 12], [2, 38, s * 19], [5, 58, s * 16]], 1.6);
      plate(m, T, [[17.4, 48, s * 13.9], [14.6, 31, s * 15.1], [7, 39.6, s * 18]], 0.8);
    });
  });
  for (const [n, x, z] of [['leg_fl', 6, 1], ['leg_fr', 6, -1], ['leg_bl', -19, 1], ['leg_br', -19, -1]]) {
    const zz = z * 12.5;
    body.add(n, [x, 20, zz]).mesh((m) => flapLeg(m, M, [x - 6, 21, zz], [x + 6, 21, zz], [x, 0, zz * 1.04], [0, 0, z * 2.6], 8, 1.8));
  }
  anchors(rig, [-8, 48, 0], 72);
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
    m.hull('wood*', blob([0, 90, 0], 2.6, 2.6, 2.6, 10)); // finial
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
