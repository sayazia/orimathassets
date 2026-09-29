// Transform-only animation clips shared by the Foldlings creatures (degrees, millimetres, seconds).
// All clips play in place: the game moves the root node (hop covers one step of HOP_STEP_M).
export const HOP_STEP_M = 0.03;

const loop = (period, n, f) => [...Array(n + 1).keys()].map((i) => [+(period * i / n).toFixed(4), f(i / n)]);
const wave = (amp, phase = 0) => (t) => amp * Math.sin((t + phase) * Math.PI * 2);

// spec: { body, head, tail, legs: [], ears: [], wings: [], fins: [], extra: [{ node, axis, amp }], lift }
export function creatureClips(rig, spec) {
  const { body = 'body', head, tail, legs = [], ears = [], wings = [], fins = [], floating = false } = spec;
  const rot = (node, keys) => ({ node, path: 'rotation', keys });
  const axisRot = (axis, v) => (axis === 'x' ? [v, 0, 0] : axis === 'y' ? [0, v, 0] : [0, 0, v]);
  const swing = (node, axis, amp, period, n = 8, phase = 0) => rot(node, loop(period, n, (t) => axisRot(axis, wave(amp, phase)(t))));

  // idle: breathing body, small head nod, tail and ear sway (2.4 s loop)
  const idle = [
    { node: body, path: 'scale', keys: loop(2.4, 8, (t) => [1 + 0.015 * Math.sin(t * Math.PI * 2), 1 - 0.025 * Math.sin(t * Math.PI * 2), 1]) },
  ];
  if (floating) idle.push({ node: body, path: 'translation', keys: loop(2.4, 8, (t) => [0, 2 * Math.sin(t * Math.PI * 2), 0]) });
  if (head) idle.push(swing(head, 'z', 4, 2.4, 8, 0.25));
  if (tail) idle.push(swing(tail, spec.tailAxis ?? 'y', 10, 2.4, 8));
  ears.forEach((e, i) => idle.push(swing(e, 'x', i ? -6 : 6, 2.4, 8, 0.4)));
  wings.forEach((w, i) => idle.push(swing(w, 'x', i ? -5 : 5, 2.4, 8, 0.1)));
  fins.forEach((f, i) => idle.push(swing(f, 'x', i ? -12 : 12, 1.2, 8)));
  rig.clip('idle', idle);

  // hop: crouch, leap, land (0.6 s). Game moves the root forward (+x) by HOP_STEP_M meanwhile.
  const hopY = [[0, 0], [0.1, -2], [0.3, spec.hopHeight ?? 16], [0.5, 0], [0.6, 0]];
  const hop = [
    { node: body, path: 'translation', keys: hopY.map(([t, y]) => [t, [0, y, 0]]) },
    { node: body, path: 'rotation', keys: [[0, [0, 0, 0]], [0.1, [0, 0, -4]], [0.3, [0, 0, 10]], [0.5, [0, 0, -6]], [0.6, [0, 0, 0]]] },
    { node: body, path: 'scale', keys: [[0, [1, 1, 1]], [0.1, [1.06, 0.88, 1.06]], [0.25, [0.96, 1.08, 0.96]], [0.5, [1.08, 0.86, 1.08]], [0.6, [1, 1, 1]]] },
  ];
  legs.forEach((l) => {
    const front = /_f/.test(l);
    hop.push(rot(l, [[0, [0, 0, 0]], [0.15, [0, 0, front ? 25 : -25]], [0.35, [0, 0, front ? 35 : -35]], [0.5, [0, 0, 0]], [0.6, [0, 0, 0]]]));
  });
  if (tail) hop.push(rot(tail, [[0, [0, 0, 0]], [0.3, [0, 0, -15]], [0.6, [0, 0, 0]]]));
  ears.forEach((e) => hop.push(rot(e, [[0, [0, 0, 0]], [0.3, [0, 0, -18]], [0.5, [0, 0, 8]], [0.6, [0, 0, 0]]])));
  wings.forEach((w, i) => hop.push(rot(w, [[0, [0, 0, 0]], [0.2, [i ? -35 : 35, 0, 0]], [0.4, [i ? 10 : -10, 0, 0]], [0.6, [0, 0, 0]]])));
  fins.forEach((f, i) => hop.push(rot(f, [[0, [0, 0, 0]], [0.3, [i ? -30 : 30, 0, 0]], [0.6, [0, 0, 0]]])));
  rig.clip('hop', hop);

  // cheer: two happy jumps with the head up and a waggle (1.2 s)
  const cheerY = [[0, 0], [0.15, 12], [0.3, 0], [0.45, 12], [0.6, 0], [1.2, 0]];
  const cheer = [
    { node: body, path: 'translation', keys: cheerY.map(([t, y]) => [t, [0, y, 0]]) },
    { node: body, path: 'rotation', keys: [[0, [0, 0, 0]], [0.15, [0, 12, 0]], [0.45, [0, -12, 0]], [0.8, [0, 8, 0]], [1.2, [0, 0, 0]]] },
  ];
  if (head) cheer.push(rot(head, [[0, [0, 0, 0]], [0.15, [0, 0, 14]], [0.6, [0, 0, 14]], [1.2, [0, 0, 0]]]));
  if (tail) cheer.push(swing(tail, spec.tailAxis ?? 'y', 25, 0.4, 8));
  ears.forEach((e, i) => cheer.push(rot(e, [[0, [0, 0, 0]], [0.15, [i ? -14 : 14, 0, 0]], [0.6, [0, 0, 0]], [1.2, [0, 0, 0]]])));
  wings.forEach((w, i) => cheer.push(rot(w, loop(1.2, 12, (t) => [(i ? -1 : 1) * 40 * Math.abs(Math.sin(t * Math.PI * 4)), 0, 0]))));
  fins.forEach((f, i) => cheer.push(swing(f, 'x', i ? -30 : 30, 0.3, 8)));
  rig.clip('cheer', cheer);

  // bounce: comic squash and a dizzy head shake after a wrong answer (1.0 s)
  const bounce = [
    { node: body, path: 'scale', keys: [[0, [1, 1, 1]], [0.12, [1.18, 0.72, 1.18]], [0.3, [0.9, 1.12, 0.9]], [0.45, [1.05, 0.95, 1.05]], [0.6, [1, 1, 1]], [1, [1, 1, 1]]] },
    { node: body, path: 'translation', keys: [[0, [0, 0, 0]], [0.12, [0, 0, 0]], [0.3, [0, 8, 0]], [0.45, [0, 0, 0]], [1, [0, 0, 0]]] },
  ];
  if (head) bounce.push(rot(head, [[0, [0, 0, 0]], [0.4, [0, 0, 0]], [0.55, [0, 16, 0]], [0.7, [0, -16, 0]], [0.85, [0, 10, 0]], [1, [0, 0, 0]]]));
  ears.forEach((e, i) => bounce.push(rot(e, [[0, [0, 0, 0]], [0.12, [i ? 20 : -20, 0, 0]], [0.45, [0, 0, 0]], [1, [0, 0, 0]]])));
  if (tail) bounce.push(rot(tail, [[0, [0, 0, 0]], [0.12, [0, 0, -20]], [0.45, [0, 0, 0]], [1, [0, 0, 0]]]));
  rig.clip('bounce', bounce);

  // fold: limbs tuck in, the body flattens into a sheet, then vanishes (1.0 s); the game swaps in paper_bird
  const fold = [
    { node: body, path: 'rotation', keys: [[0, [0, 0, 0]], [0.5, [0, 0, 0]], [0.8, [0, 180, 0]], [1, [0, 360, 0]]] },
    { node: body, path: 'scale', keys: [[0, [1, 1, 1]], [0.5, [0.9, 0.9, 0.9]], [0.8, [1.1, 0.12, 1.1]], [1, [0.001, 0.001, 0.001]]] },
    { node: body, path: 'translation', keys: [[0, [0, 0, 0]], [0.5, [0, 6, 0]], [1, [0, 20, 0]]] },
  ];
  for (const n of [head, tail, ...legs, ...ears, ...wings, ...fins].filter(Boolean)) {
    fold.push({ node: n, path: 'scale', keys: [[0, [1, 1, 1]], [0.2, [1, 1, 1]], [0.5, [0.05, 0.05, 0.05]], [1, [0.05, 0.05, 0.05]]] });
  }
  rig.clip('fold', fold);
}
