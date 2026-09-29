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
export function eye(m, at, n, d = 4.4) {
  n = norm(n);
  const [u, v] = basis(n);
  const ring = (off) => [...Array(6).keys()].map((i) => {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    return add(add(at, mul(n, off)), add(mul(u, Math.cos(a) * d / 2), mul(v, Math.sin(a) * d / 2)));
  });
  m.hull('ink', [...ring(-1.2), ...ring(0.8)]);
}

// Happy (closed, upward arc) eye: two short ink bars forming a soft ^.
export function happyEye(m, at, n, d = 5) {
  n = norm(n);
  const [u, v] = basis(n);
  const pt = (x, y, o) => add(add(at, mul(n, o)), add(mul(u, x), mul(v, y)));
  for (const s of [-1, 1]) {
    const a = [s * d * 0.5, -d * 0.2], b = [0, d * 0.25];
    m.hull('ink', [
      pt(a[0], a[1] - 1, -1.2), pt(a[0], a[1] + 1, -1.2), pt(b[0], b[1] - 1, -1.2), pt(b[0], b[1] + 1, -1.2),
      pt(a[0], a[1] - 1, 0.8), pt(a[0], a[1] + 1, 0.8), pt(b[0], b[1] - 1, 0.8), pt(b[0], b[1] + 1, 0.8),
    ]);
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
