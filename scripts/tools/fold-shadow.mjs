// Bakes a soft fold shadow for scan-to-plates into one small greyscale texture.
// Every plate is flat, so it is unrolled onto its own plane and packed into an atlas.
// Each texel casts rays over the hemisphere and darkens by how much of it the other
// plates cover within reach (ambient occlusion). Paper is two-sided: the less covered
// side wins. On top of that, a flap lying on a plate casts a soft contact shadow onto it that
// fades out over `spread` (a stylised drop shadow; the real gap is only paper-thin).
// The texture is meant as baseColorTexture, multiplied by the plate colour.
import jpeg from 'jpeg-js';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };

// Ray against triangle (Moller-Trumbore): distance along d, or Infinity.
function hit(o, d, t) {
  const e1 = sub(t[1], t[0]), e2 = sub(t[2], t[0]), p = cross(d, e2), det = dot(e1, p);
  if (Math.abs(det) < 1e-14) return Infinity;
  const inv = 1 / det, s = sub(o, t[0]), u = dot(s, p) * inv;
  if (u < 0 || u > 1) return Infinity;
  const q = cross(s, e1), v = dot(d, q) * inv;
  if (v < 0 || u + v > 1) return Infinity;
  const tt = dot(e2, q) * inv;
  return tt > 0 ? tt : Infinity;
}

// Distance from (x, y) to a 2D triangle, 0 inside.
function dist2(x, y, t) {
  const side = (a, b) => (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
  const s0 = side(t[0], t[1]), s1 = side(t[1], t[2]), s2 = side(t[2], t[0]);
  if ((s0 >= 0 && s1 >= 0 && s2 >= 0) || (s0 <= 0 && s1 <= 0 && s2 <= 0)) return 0;
  let d = Infinity;
  for (let k = 0; k < 3; k++) {
    const a = t[k], b = t[(k + 1) % 3], ex = b[0] - a[0], ey = b[1] - a[1], l = ex * ex + ey * ey;
    const u = l ? Math.max(0, Math.min(1, ((x - a[0]) * ex + (y - a[1]) * ey) / l)) : 0;
    d = Math.min(d, Math.hypot(x - a[0] - u * ex, y - a[1] - u * ey));
  }
  return d;
}

/**
 * plates: [{ id, faces: [[v0,v1,v2], ...], normal: [x,y,z] }] with vertex indices into P.
 * Returns { uv: Map(`${id}/${v}` -> [u,v]), image: Uint8Array (JPEG) }.
 */
export function bakeFoldShadow(P, plates, { size = 512, strength = 0.45, reach = 0.06, samples = 32, pad = 3, spread = 0.015, lift = 0.04 } = {}) {
  const pos = (v) => [P[3 * v], P[3 * v + 1], P[3 * v + 2]];
  let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (let v = 0; v < P.length / 3; v++) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], P[3 * v + k]); hi[k] = Math.max(hi[k], P[3 * v + k]); }
  const diag = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);
  const D = reach * diag, eps = 0.0008 * diag;

  // Unroll each plate onto its plane.
  for (const pl of plates) {
    const n = norm(pl.normal), a = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    pl.t1 = norm(cross(n, a)); pl.t2 = cross(n, pl.t1); pl.n = n;
    pl.p2 = new Map();
    for (const f of pl.faces) for (const v of f) if (!pl.p2.has(v)) { const p = pos(v); pl.p2.set(v, [dot(p, pl.t1), dot(p, pl.t2)]); }
    const xs = [...pl.p2.values()];
    pl.min = [Math.min(...xs.map((q) => q[0])), Math.min(...xs.map((q) => q[1]))];
    pl.w = Math.max(...xs.map((q) => q[0])) - pl.min[0]; pl.h = Math.max(...xs.map((q) => q[1])) - pl.min[1];
  }
  // Shelf-pack the plate rectangles; binary search the largest texels-per-unit that fits.
  const order = [...plates].sort((a, b) => b.h - a.h);
  const pack = (scale) => {
    let x = 0, y = 0, row = 0;
    for (const pl of order) {
      const w = Math.ceil(pl.w * scale) + 2 * pad, h = Math.ceil(pl.h * scale) + 2 * pad;
      if (w > size) return false;
      if (x + w > size) { x = 0; y += row; row = 0; }
      pl.at = [x, y]; x += w; row = Math.max(row, h);
    }
    return y + row <= size;
  };
  let a = 1, b = 1e6;
  for (let i = 0; i < 40; i++) { const m = Math.sqrt(a * b); if (pack(m)) a = m; else b = m; }
  const scale = a; pack(scale);

  // Triangles of all plates, for the rays.
  const tris = [];
  for (const pl of plates) for (const f of pl.faces) {
    const t = f.map(pos), c = [0, 1, 2].map((k) => (t[0][k] + t[1][k] + t[2][k]) / 3);
    tris.push({ t, c, rad: Math.max(...t.map((q) => Math.hypot(...sub(q, c)))), id: pl.id });
  }
  // Small BVH so each ray only tests the triangles along its way.
  const build = (items) => {
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (const tr of items) for (const q of tr.t) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], q[k]); hi[k] = Math.max(hi[k], q[k]); }
    if (items.length <= 4) return { lo, hi, items };
    const ax = [0, 1, 2].reduce((m, k) => (hi[k] - lo[k] > hi[m] - lo[m] ? k : m), 0);
    items.sort((a, b) => a.c[ax] - b.c[ax]); const mid = items.length >> 1;
    return { lo, hi, l: build(items.slice(0, mid)), r: build(items.slice(mid)) };
  };
  const root = build(tris);
  const boxHit = (o, inv, lo, hi, tmax) => {
    let t0 = 0, t1 = tmax;
    for (let k = 0; k < 3; k++) { let a = (lo[k] - o[k]) * inv[k], b = (hi[k] - o[k]) * inv[k]; if (a > b) [a, b] = [b, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, b); if (t0 > t1) return false; }
    return true;
  };
  const cast = (o, d, skip) => {
    const inv = d.map((x) => 1 / x); let best = D; const stack = [root];
    while (stack.length) { const nd = stack.pop(); if (!boxHit(o, inv, nd.lo, nd.hi, best)) continue;
      if (nd.items) { for (const tr of nd.items) if (tr.id !== skip) { const h = hit(o, d, tr.t); if (h < best) best = h; } }
      else stack.push(nd.l, nd.r); }
    return best;
  };
  const dirs = []; // cosine-weighted hemisphere around +z (Fibonacci spiral)
  for (let s = 0; s < samples; s++) { const r = Math.sqrt((s + 0.5) / samples), ang = s * 2.399963; dirs.push([r * Math.cos(ang), r * Math.sin(ang), Math.sqrt(1 - r * r)]); }
  const occlusion = (o, n, t1, t2, skip) => {
    const org = [o[0] + n[0] * eps, o[1] + n[1] * eps, o[2] + n[2] * eps]; let occ = 0;
    for (const [x, y, z] of dirs) {
      const d = [t1[0] * x + t2[0] * y + n[0] * z, t1[1] * x + t2[1] * y + n[1] * z, t1[2] * x + t2[2] * y + n[2] * z];
      occ += 1 - cast(org, d, skip) / D;
    }
    return occ / samples;
  };

  const val = new Float32Array(size * size).fill(-1);
  for (const pl of plates) {
    const neg = pl.n.map((x) => -x), t2n = pl.t2.map((x) => -x);
    // Which side of the paper shows: the one less covered at the plate's middle.
    const f0 = pl.faces.reduce((a, f) => a, pl.faces[0]).map(pos);
    const mid = [0, 1, 2].map((k) => (f0[0][k] + f0[1][k] + f0[2][k]) / 3);
    const up = occlusion(mid, pl.n, pl.t1, pl.t2, pl.id) <= occlusion(mid, neg, pl.t1, t2n, pl.id) ? pl.n : neg;
    const p0 = pos(pl.faces[0][0]), W = spread * diag, H = lift * diag;
    // Flaps above this plate (on the visible side, nearly parallel), dropped onto its plane.
    const casters = [];
    for (const q of plates) {
      if (q === pl || Math.abs(dot(q.n, pl.n)) < 0.85) continue;
      for (const f of q.faces) {
        const t = f.map(pos), h = t.map((v) => dot(sub(v, p0), up));
        if (Math.max(...h) < 0.0005 * diag || Math.min(...h) > H || Math.min(...h) < -0.002 * diag) continue;
        const t2 = t.map((v) => [dot(v, pl.t1), dot(v, pl.t2)]);
        casters.push({ t2, x0: Math.min(...t2.map((v) => v[0])) - W, x1: Math.max(...t2.map((v) => v[0])) + W, y0: Math.min(...t2.map((v) => v[1])) - W, y1: Math.max(...t2.map((v) => v[1])) + W });
      }
    }
    const contact = (o) => {
      if (!casters.length) return 0;
      const x = dot(o, pl.t1), y = dot(o, pl.t2); let d = W;
      for (const c of casters) { if (x < c.x0 || x > c.x1 || y < c.y0 || y > c.y1) continue; d = Math.min(d, dist2(x, y, c.t2)); if (d === 0) break; }
      const k = 1 - d / W; return k * k;
    };
    for (const f of pl.faces) {
      const q = f.map((v) => { const p = pl.p2.get(v); return [(p[0] - pl.min[0]) * scale + pl.at[0] + pad, (p[1] - pl.min[1]) * scale + pl.at[1] + pad]; });
      const w3 = f.map(pos);
      const den = (q[1][1] - q[2][1]) * (q[0][0] - q[2][0]) + (q[2][0] - q[1][0]) * (q[0][1] - q[2][1]);
      if (Math.abs(den) < 1e-12) continue;
      const x0 = Math.max(0, Math.floor(Math.min(...q.map((p) => p[0])))), x1 = Math.min(size - 1, Math.ceil(Math.max(...q.map((p) => p[0]))));
      const y0 = Math.max(0, Math.floor(Math.min(...q.map((p) => p[1])))), y1 = Math.min(size - 1, Math.ceil(Math.max(...q.map((p) => p[1]))));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const px = x + 0.5, py = y + 0.5;
        let l0 = ((q[1][1] - q[2][1]) * (px - q[2][0]) + (q[2][0] - q[1][0]) * (py - q[2][1])) / den;
        let l1 = ((q[2][1] - q[0][1]) * (px - q[2][0]) + (q[0][0] - q[2][0]) * (py - q[2][1])) / den;
        let l2 = 1 - l0 - l1;
        if (l0 < -1e-6 || l1 < -1e-6 || l2 < -1e-6) continue; // edge texels come from the bleed below
        l0 = Math.max(0, l0); l1 = Math.max(0, l1); l2 = Math.max(0, l2); const s = l0 + l1 + l2;
        const o = [0, 1, 2].map((k) => (l0 * w3[0][k] + l1 * w3[1][k] + l2 * w3[2][k]) / s);
        const occ = Math.min(occlusion(o, pl.n, pl.t1, pl.t2, pl.id), occlusion(o, neg, pl.t1, t2n, pl.id));
        const i = y * size + x; const g = 1 - strength * Math.max(Math.min(1, occ * 2.2), 0.8 * contact(o));
        val[i] = val[i] < 0 ? g : Math.min(val[i], g);
      }
    }
  }
  // Bleed filled texels outward so filtering at plate edges never picks up empty atlas space.
  for (let pass = 0; pass < pad + 2; pass++) {
    const nv = val.slice();
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const i = y * size + x; if (val[i] >= 0) continue; let s = 0, c = 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= size || yy >= size) continue; const w = val[yy * size + xx]; if (w >= 0) { s += w; c++; } }
      if (c) nv[i] = s / c;
    }
    val.set(nv);
  }
  const rgba = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const lin = val[i] < 0 ? 1 : val[i];
    const srgb = lin <= 0.0031308 ? 12.92 * lin : 1.055 * Math.pow(lin, 1 / 2.4) - 0.055; // texture is sRGB
    rgba.fill(Math.round(255 * srgb), 4 * i, 4 * i + 3); rgba[4 * i + 3] = 255;
  }
  const image = jpeg.encode({ data: rgba, width: size, height: size }, 82).data;

  const uv = new Map();
  for (const pl of plates) for (const [v, p] of pl.p2) {
    uv.set(`${pl.id}/${v}`, [((p[0] - pl.min[0]) * scale + pl.at[0] + pad) / size, ((p[1] - pl.min[1]) * scale + pl.at[1] + pad) / size]);
  }
  return { uv, image };
}
