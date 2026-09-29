// Tiny low-poly modelling kit. Every shape is a convex solid made of flat
// facets; faces are auto-oriented outward from the solid's centroid, so the
// builders never have to worry about winding order.

const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]; // 3x4 row-major affine matrix

function mul(a, b) {
  const r = new Array(12);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      r[i * 4 + j] =
        a[i * 4] * b[j] + a[i * 4 + 1] * b[4 + j] + a[i * 4 + 2] * b[8 + j] + (j === 3 ? a[i * 4 + 3] : 0);
    }
  }
  return r;
}

const apply = (m, [x, y, z]) => [
  m[0] * x + m[1] * y + m[2] * z + m[3],
  m[4] * x + m[5] * y + m[6] * z + m[7],
  m[8] * x + m[9] * y + m[10] * z + m[11],
];

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// Key light used for automatic fold shading (upper front left, like the preview sun).
const LIGHT = (() => { const v = [-0.45, 0.85, 0.4]; const l = Math.hypot(...v); return v.map((x) => x / l); })();

// Outward face planes {n, d} (n·p = d) of the convex hull of a point cloud.
export function hullPlanes(pts) {
  const eps = 1e-6 * Math.max(...pts.flat().map(Math.abs), 1);
  const planes = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) for (let k = j + 1; k < pts.length; k++) {
    let n = cross(sub(pts[j], pts[i]), sub(pts[k], pts[i]));
    const l = Math.hypot(...n);
    if (l < eps) continue;
    n = n.map((x) => x / l);
    const d = dot(n, pts[i]);
    let pos = false, neg = false;
    for (const p of pts) {
      const s = dot(n, p) - d;
      if (s > eps * 10) pos = true;
      else if (s < -eps * 10) neg = true;
      if (pos && neg) break;
    }
    if (pos && neg) continue;
    if (pos) n = n.map((x) => -x);
    const dd = dot(n, pts[i]);
    if (planes.some((p) => dot(p.n, n) > 1 - 1e-9 && Math.abs(p.d - dd) < eps * 10)) continue;
    planes.push({ n, d: dd });
  }
  return { planes, eps };
}

export class Model {
  constructor(name) {
    this.name = name;
    this.groups = new Map(); // colour key -> flat triangle positions
    this.stack = [I];
  }

  get m() {
    return this.stack[this.stack.length - 1];
  }

  // Run fn with an extra transform: {t:[x,y,z], rx, ry, rz (radians), s: number|[x,y,z]}.
  // Applied in the order scale -> rotate (x, y, z) -> translate.
  with({ t = [0, 0, 0], rx = 0, ry = 0, rz = 0, s = 1 } = {}, fn) {
    const sc = Array.isArray(s) ? s : [s, s, s];
    let m = [sc[0], 0, 0, 0, 0, sc[1], 0, 0, 0, 0, sc[2], 0];
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const cz = Math.cos(rz), sz = Math.sin(rz);
    m = mul([1, 0, 0, 0, 0, cx, -sx, 0, 0, sx, cx, 0], m);
    m = mul([cy, 0, sy, 0, 0, 1, 0, 0, -sy, 0, cy, 0], m);
    m = mul([cz, -sz, 0, 0, sz, cz, 0, 0, 0, 0, 1, 0], m);
    m = mul([1, 0, 0, t[0], 0, 1, 0, t[1], 0, 0, 1, t[2]], m);
    this.stack.push(mul(this.m, m));
    try {
      fn(this);
    } finally {
      this.stack.pop();
    }
    return this;
  }

  // verts: local points; faces: [{c: colour, v: [i0, i1, i2, ...]}] (convex polygons).
  solid(verts, faces) {
    const w = verts.map((p) => apply(this.m, p));
    const centre = w.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]).map((v) => v / w.length);
    const log = this.solids ? { verts: w, faces: [], ink: faces.every(({ c }) => c === 'ink') } : null;
    for (const { c: key, v } of faces) {
      const pts = v.map((i) => w[i]);
      const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]));
      const out = dot(n, sub(pts[0], centre)) >= 0;
      const ordered = out ? pts : [...pts].reverse();
      if (log) log.faces.push(out ? v : [...v].reverse());
      // A trailing '*' picks the lit colour or its `_shade` twin from the face direction.
      let c = key;
      if (key.endsWith('*')) {
        const nn = out ? n : n.map((x) => -x);
        const lit = dot(nn, LIGHT) / (Math.hypot(...nn) || 1) > 0.12;
        c = lit ? key.slice(0, -1) : key.slice(0, -1) + '_shade';
      }
      if (!this.groups.has(c)) this.groups.set(c, []);
      const g = this.groups.get(c);
      for (let i = 1; i < ordered.length - 1; i++) {
        const [a, b, d] = [ordered[0], ordered[i], ordered[i + 1]];
        const area = cross(sub(b, a), sub(d, a));
        if (Math.hypot(...area) < 1e-9) continue; // skip degenerate slivers
        g.push(...a, ...b, ...d);
      }
    }
    if (log) this.solids.push(log);
    return this;
  }

  // Convex hull of a point cloud, faces found automatically (coplanar points merge into one polygon).
  hull(colour, pts) {
    const { planes, eps } = hullPlanes(pts);
    const faces = [];
    for (const { n, d } of planes) {
      const on = pts.map((p, i) => [p, i]).filter(([p]) => Math.abs(dot(n, p) - d) < eps * 10);
      const c = on.reduce((a, [p]) => a.map((v, q) => v + p[q] / on.length), [0, 0, 0]);
      const u = sub(on[0][0], c), w = cross(n, u);
      on.sort(([a], [b]) => Math.atan2(dot(sub(a, c), w), dot(sub(a, c), u)) - Math.atan2(dot(sub(b, c), w), dot(sub(b, c), u)));
      faces.push({ c: colour, v: on.map(([, i]) => i) });
    }
    return this.solid(pts, faces);
  }

  // Axis-aligned box. colour may be a string or {top, bottom, sides, front(+z), back, left(-x), right}.
  box(colour, [x0, y0, z0], [x1, y1, z1]) {
    const c = typeof colour === 'string' ? { sides: colour } : colour;
    const pick = (k) => c[k] ?? c.sides ?? c.top;
    const v = [
      [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
      [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1],
    ];
    return this.solid(v, [
      { c: pick('bottom'), v: [0, 1, 2, 3] },
      { c: pick('top'), v: [4, 5, 6, 7] },
      { c: c.back ?? pick('sides'), v: [0, 1, 5, 4] },
      { c: c.front ?? pick('sides'), v: [3, 2, 6, 7] },
      { c: c.left ?? pick('sides'), v: [0, 3, 7, 4] },
      { c: c.right ?? pick('sides'), v: [1, 2, 6, 5] },
    ]);
  }

  // Gable roof with the ridge running along x. Slopes use `roof`, triangle ends use `ends`.
  gable(roof, ends, [x0, y0, z0], [x1, y1, z1]) {
    const zc = (z0 + z1) / 2;
    const v = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [x0, y1, zc], [x1, y1, zc]];
    return this.solid(v, [
      { c: ends, v: [0, 1, 2, 3] },
      { c: roof, v: [0, 1, 5, 4] },
      { c: roof, v: [3, 2, 5, 4] },
      { c: ends, v: [0, 3, 4] },
      { c: ends, v: [1, 2, 5] },
    ]);
  }

  // Gable roof with the ridge running along z (gable end faces +z / -z).
  gableZ(roof, ends, [x0, y0, z0], [x1, y1, z1]) {
    const xc = (x0 + x1) / 2;
    const v = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [xc, y1, z0], [xc, y1, z1]];
    return this.solid(v, [
      { c: ends, v: [0, 1, 2, 3] },
      { c: roof, v: [0, 3, 5, 4] },
      { c: roof, v: [1, 2, 5, 4] },
      { c: ends, v: [0, 1, 4] },
      { c: ends, v: [3, 2, 5] },
    ]);
  }

  // Gable-like roof segment along x whose eave and ridge heights change from x0 to x1
  // (used for the swept "horn" roofs of rumah gadang).
  saddle(roof, ends, x0, x1, [e0, e1], [r0, r1], z0, z1) {
    const zc = (z0 + z1) / 2;
    const v = [[x0, e0, z0], [x1, e1, z0], [x1, e1, z1], [x0, e0, z1], [x0, r0, zc], [x1, r1, zc]];
    return this.solid(v, [
      { c: ends, v: [0, 1, 2, 3] },
      { c: roof, v: [0, 1, 5, 4] },
      { c: roof, v: [3, 2, 5, 4] },
      { c: ends, v: [0, 3, 4] },
      { c: ends, v: [1, 2, 5] },
    ]);
  }

  // Pyramid / hip roof over a rectangle, apex (or ridge of length `ridge` along x) at y1.
  hip(colour, [x0, y0, z0], [x1, y1, z1], ridge = 0) {
    const xc = (x0 + x1) / 2, zc = (z0 + z1) / 2, h = ridge / 2;
    const v = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [xc - h, y1, zc], [xc + h, y1, zc]];
    const faces = [
      { c: colour, v: [0, 1, 2, 3] },
      { c: colour, v: [0, 3, 4] },
      { c: colour, v: [1, 2, 5] },
    ];
    if (ridge > 0) faces.push({ c: colour, v: [0, 1, 5, 4] }, { c: colour, v: [3, 2, 5, 4] });
    else faces.push({ c: colour, v: [0, 1, 4] }, { c: colour, v: [3, 2, 4] });
    return this.solid(v, faces);
  }

  // n-sided frustum around the y axis at (cx, cz). r1 = 0 gives a cone.
  frustum(colour, [cx, cz], r0, r1, y0, y1, n = 6, rot = 0, top = colour) {
    const v = [];
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2;
      v.push([cx + Math.cos(a) * r0, y0, cz + Math.sin(a) * r0]);
    }
    const faces = [{ c: colour, v: [...Array(n).keys()] }];
    if (r1 === 0) {
      v.push([cx, y1, cz]);
      for (let i = 0; i < n; i++) faces.push({ c: colour, v: [i, (i + 1) % n, n] });
    } else {
      for (let i = 0; i < n; i++) {
        const a = rot + (i / n) * Math.PI * 2;
        v.push([cx + Math.cos(a) * r1, y1, cz + Math.sin(a) * r1]);
      }
      faces.push({ c: top, v: [...Array(n).keys()].map((i) => i + n) });
      for (let i = 0; i < n; i++) faces.push({ c: colour, v: [i, (i + 1) % n, n + ((i + 1) % n), n + i] });
    }
    return this.solid(v, faces);
  }

  prism(colour, centre, r, y0, y1, n = 6, rot = 0, top = colour) {
    return this.frustum(colour, centre, r, r, y0, y1, n, rot, top);
  }

  // Faceted "paper ball" (for tree crowns, bushes): two staggered rings between two poles.
  gem(colour, [cx, cy, cz], r, h = r, n = 6) {
    const v = [[cx, cy - h, cz], [cx, cy + h, cz]];
    for (let ring = 0; ring < 2; ring++) {
      const y = cy + (ring === 0 ? -0.35 : 0.35) * h;
      const off = ring * (Math.PI / n);
      for (let i = 0; i < n; i++) {
        const a = off + (i / n) * Math.PI * 2;
        v.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]);
      }
    }
    const A = (i) => 2 + (i % n), B = (i) => 2 + n + (i % n);
    const faces = [];
    for (let i = 0; i < n; i++) {
      faces.push({ c: colour, v: [0, A(i), A(i + 1)] });
      faces.push({ c: colour, v: [1, B(i), B(i + 1)] });
      faces.push({ c: colour, v: [A(i), A(i + 1), B(i)] });
      faces.push({ c: colour, v: [A(i + 1), B(i + 1), B(i)] });
    }
    return this.solid(v, faces);
  }

  // Thin square beam from point a to point b (for frames, cables and ribs).
  beam(colour, a, b, w = 0.006) {
    const d = sub(b, a);
    const len = Math.hypot(...d) || 1;
    const dir = d.map((v) => v / len);
    const up = Math.abs(dir[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
    let u = cross(dir, up);
    const ul = Math.hypot(...u);
    u = u.map((v) => (v / ul) * (w / 2));
    const v2 = cross(dir, u);
    const corner = (p, su, sv) => [p[0] + u[0] * su + v2[0] * sv, p[1] + u[1] * su + v2[1] * sv, p[2] + u[2] * su + v2[2] * sv];
    const verts = [];
    for (const p of [a, b]) for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) verts.push(corner(p, su, sv));
    return this.solid(verts, [
      { c: colour, v: [0, 1, 2, 3] }, { c: colour, v: [4, 5, 6, 7] },
      { c: colour, v: [0, 1, 5, 4] }, { c: colour, v: [1, 2, 6, 5] }, { c: colour, v: [2, 3, 7, 6] }, { c: colour, v: [3, 0, 4, 7] },
    ]);
  }

  // Convex polygon (list of [x, z]) extruded from y0 to y1.
  slab(colour, pts, y0, y1, top = colour) {
    const n = pts.length;
    const v = [...pts.map(([x, z]) => [x, y0, z]), ...pts.map(([x, z]) => [x, y1, z])];
    const faces = [{ c: colour, v: [...Array(n).keys()] }, { c: top, v: [...Array(n).keys()].map((i) => i + n) }];
    for (let i = 0; i < n; i++) faces.push({ c: colour, v: [i, (i + 1) % n, n + ((i + 1) % n), n + i] });
    return this.solid(v, faces);
  }

  // One segment of an annulus (flat slab), used for curved road markings / kerbs.
  // Split into `n` convex pieces between angles a0..a1 around (cx, cz).
  arc(colour, [cx, cz], rIn, rOut, a0, a1, y0, y1, n = 6, gap = 0) {
    for (let i = 0; i < n; i++) {
      const s = a0 + ((a1 - a0) * i) / n + gap / 2;
      const e = a0 + ((a1 - a0) * (i + 1)) / n - gap / 2;
      const p = (r, a, y) => [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r];
      const v = [p(rIn, s, y0), p(rOut, s, y0), p(rOut, e, y0), p(rIn, e, y0), p(rIn, s, y1), p(rOut, s, y1), p(rOut, e, y1), p(rIn, e, y1)];
      this.solid(v, [
        { c: colour, v: [0, 1, 2, 3] }, { c: colour, v: [4, 5, 6, 7] },
        { c: colour, v: [0, 1, 5, 4] }, { c: colour, v: [3, 2, 6, 7] },
        { c: colour, v: [0, 3, 7, 4] }, { c: colour, v: [1, 2, 6, 5] },
      ]);
    }
    return this;
  }
}
