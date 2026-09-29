// Shared origami shapes for the Foldlings game assets. Units: millimetres.
// Colours ending in '*' get automatic two-tone fold shading (lit side / `_shade` side).

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => a.map((v) => v * s);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a) || 1; return a.map((v) => v / l); };

export const V = { sub, add, mul, cross, norm };

function newell(pts) {
  const n = [0, 0, 0];
  pts.forEach((a, k) => {
    const b = pts[(k + 1) % pts.length];
    n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]);
  });
  return norm(n);
}

// Flat sheet of paper: a planar polygon given the visible thickness `th` (default 2 mm).
export function plate(m, c, pts, th = 2) {
  const n = mul(newell(pts), th / 2);
  return m.hull(c, [...pts.map((p) => add(p, n)), ...pts.map((p) => sub(p, n))]);
}

// A sheet folded along the crease a-b: two flaps ending at points p and q (a valley/mountain fold).
export function folded(m, c, a, b, p, q, th = 2) {
  plate(m, c, [a, b, p], th);
  plate(m, c, [a, b, q], th);
}

// Frame around a direction n: two unit vectors perpendicular to it.
function basis(n, upHint = [0, 1, 0]) {
  n = norm(n);
  let u = cross(upHint, n);
  if (Math.hypot(...u) < 1e-3) u = cross([1, 0, 0], n);
  u = norm(u);
  return [u, cross(n, u)];
}

// Ink dot eye sitting on a surface at `at` with outward normal `n`.
// Small round detail (eye, nose, button): a flat disc facing n, sunk 1.2 mm into the surface and
// standing `h` proud of it. Small parts stay plain and round rather than folded (rx, ry: radii along u, v).
export function disc(m, colour, at, n, rx, ry = rx, { h = 0.8, sides = 18, sink = 1.2 } = {}) {
  n = norm(n);
  const [u, v] = basis(n);
  const ring = (off) => [...Array(sides).keys()].map((i) => {
    const a = (i / sides) * Math.PI * 2;
    return add(add(at, mul(n, off)), add(mul(u, Math.cos(a) * rx), mul(v, Math.sin(a) * ry)));
  });
  m.hull(colour, [...ring(-sink), ...ring(h)]);
}
// Flat round ring (glasses rims), built from short straight segments around the circle.
export function hoop(m, colour, at, n, r0, r1, { h = 2.2, sides = 24 } = {}) {
  n = norm(n);
  const [u, v] = basis(n);
  const p = (a, r, o) => add(add(at, mul(n, o)), add(mul(u, Math.cos(a) * r), mul(v, Math.sin(a) * r)));
  for (let i = 0; i < sides; i++) {
    const a0 = (i / sides) * Math.PI * 2, a1 = ((i + 1) / sides) * Math.PI * 2;
    m.hull(colour, [p(a0, r0, 0), p(a1, r0, 0), p(a0, r1, 0), p(a1, r1, 0), p(a0, r0, h), p(a1, r0, h), p(a0, r1, h), p(a1, r1, h)]);
  }
}

// Open eye: a round ink dot.
export function eye(m, at, n, d = 4.4) {
  disc(m, 'ink', at, n, d / 2);
}

// Happy (closed) eye: a smooth upward arc of ink, like a drawn "∩".
export function happyEye(m, at, n, d = 5) {
  n = norm(n);
  const [u, v] = basis(n);
  const pt = (x, y, o) => add(add(at, mul(n, o)), add(mul(u, x), mul(v, y)));
  const r = d * 0.42, t = 0.6, steps = 7, cy = -d * 0.18;
  for (let i = 0; i < steps; i++) {
    const a0 = (i / steps) * Math.PI, a1 = ((i + 1) / steps) * Math.PI;
    const q = (a, rr, o) => pt(Math.cos(a) * rr, cy + Math.sin(a) * rr, o);
    m.hull('ink', [q(a0, r - t, -1.2), q(a1, r - t, -1.2), q(a0, r + t, -1.2), q(a1, r + t, -1.2), q(a0, r - t, 0.8), q(a1, r - t, 0.8), q(a0, r + t, 0.8), q(a1, r + t, 0.8)]);
  }
}

// Tapered folded leg from a hip/shoulder point down to a foot resting on y = 0, with a knee
// crease half way (the upper part is one hull, the lower part another, sharing the knee ring).
export function leg(m, c, top, foot, wTop = 6, wFoot = 4.5, dz = 4, knee = 0) {
  const [tx, ty, tz] = top, [fx, , fz] = foot;
  const ky = ty * 0.45, kx = (tx + fx) / 2 + knee, kz = (tz + fz) / 2, kw = (wTop + wFoot) / 2 * 0.9, kd = (dz + 4) / 2;
  const kneeRing = [[kx - kw / 2, ky, kz], [kx + kw / 2, ky, kz], [kx, ky, kz - kd / 2], [kx, ky, kz + kd / 2]];
  m.hull(c, [[tx - wTop / 2, ty, tz], [tx + wTop / 2, ty, tz], [tx, ty, tz - dz / 2], [tx, ty, tz + dz / 2], ...kneeRing]);
  m.hull(c, [
    ...kneeRing,
    [fx - wFoot / 2, 0, fz - 2.2], [fx + wFoot / 2, 0, fz - 2.2], [fx + wFoot / 2, 0, fz + 2.2], [fx - wFoot / 2, 0, fz + 2.2],
    [fx + wFoot / 2 + 1.2, 2.5, fz], // toe crease
  ]);
}

// Origami leg: a flat strip of paper from the body edge a-b down to a narrow foot, folded once along
// its length (the crease pushed out by `out`), so one half catches the light and the other is in shade.
export function flapLeg(m, c, a, b, foot, out = [0, 0, 1.6], footW = 3, th = 1.4) {
  const c0 = add(mul(add(a, b), 0.5), out), c1 = add(foot, mul(out, 0.35));
  const dir = norm(sub(b, a)), fA = sub(foot, mul(dir, footW / 2)), fB = add(foot, mul(dir, footW / 2));
  plate(m, c, [a, c0, c1, fA], th);
  plate(m, c, [b, fB, c1, c0], th);
}

// Long pointed flap (tail, trunk tip, fin): root edge a-b to a tip, folded along its centre line.
export function spike(m, c, a, b, tip, out = [0, 0, 2], th = 1.4) {
  const c0 = add(mul(add(a, b), 0.5), out);
  plate(m, c, [a, c0, tip], th);
  plate(m, c, [b, tip, c0], th);
}

// Diamond ("kite") shape used for ears, tails and fins: base edge a-b with a folded ridge to the tip.
export function kite(m, c, a, b, tip, lift, th = 2) {
  const mid = mul(add(a, b), 0.5);
  const ridgeMid = add(mul(add(mid, tip), 0.5), lift);
  plate(m, c, [a, ridgeMid, tip], th);
  plate(m, c, [b, ridgeMid, tip], th);
  plate(m, c, [a, b, ridgeMid], th);
}

// Mirror a point across z = 0.
export const mz = ([x, y, z]) => [x, y, -z];

// Where a ray from `from` along `dir` first hits the convex hull of `pts`: { p, n }.
// Used to seat eyes and trims exactly on a faceted surface.
import { hullPlanes } from './geom.mjs';
export function surf(pts, from, dir) {
  dir = norm(dir);
  const { planes } = hullPlanes(pts);
  let tIn = -Infinity, nIn = null, tOut = Infinity;
  for (const { n, d } of planes) {
    const dn = n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2];
    const dist = d - (n[0] * from[0] + n[1] * from[1] + n[2] * from[2]);
    if (Math.abs(dn) < 1e-12) { if (dist < 0) return null; continue; }
    const t = dist / dn;
    if (dn < 0) { if (t > tIn) { tIn = t; nIn = n; } } else tOut = Math.min(tOut, t);
  }
  if (tIn > tOut || !nIn) return null;
  return { p: add(from, mul(dir, tIn)), n: nIn };
}

// Faceted "paper ball" point cloud (poles + three staggered rings) to feed Model.hull.
// Stretch per axis with rx, ry, rz; `rot` turns the rings around y.
export function blob([cx, cy, cz], rx, ry, rz, n = 6, rot = 0) {
  const pts = [[cx, cy - ry, cz], [cx, cy + ry, cz]];
  [[-0.62, 0.78, 0], [0, 1, 0.5], [0.62, 0.78, 1]].forEach(([h, r, off]) => {
    for (let i = 0; i < n; i++) {
      const a = rot + ((i + off) / n) * Math.PI * 2;
      pts.push([cx + Math.cos(a) * rx * r, cy + h * ry, cz + Math.sin(a) * rz * r]);
    }
  });
  return pts;
}
