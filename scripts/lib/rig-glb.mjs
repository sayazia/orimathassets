// GLB writer for Rig assets: node tree, one mesh per part (indexed, flat normals, one
// primitive per material), optional inverted-hull `ink_outline` meshes, and animations.
import { colourOf } from './palette.mjs';
import { quat } from './rig.mjs';

const OUTLINE_MM = 0.6;

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const hexToLinear = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => +srgbToLinear(v / 255).toFixed(5));
};

// Shortest decimal that reads back as the same float32 (keeps accessor min/max exact but short).
const f32 = (v) => {
  const f = Math.fround(v);
  for (let p = 1; p < 10; p++) { const s = +f.toPrecision(p); if (Math.fround(s) === f) return s; }
  return f;
};

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a) => { const l = Math.hypot(...a) || 1; return a.map((v) => v / l); };

function solve3(A, b) {
  const [a, bb, c, d, e, f, g, h, i] = A;
  const det = a * (e * i - f * h) - bb * (d * i - f * g) + c * (d * h - e * g);
  if (Math.abs(det) < 1e-12) return null;
  const inv = [e * i - f * h, c * h - bb * i, bb * f - c * e, f * g - d * i, a * i - c * g, c * d - a * f, d * h - e * g, bb * g - a * h, a * e - bb * d];
  return [0, 1, 2].map((r) => (inv[r * 3] * b[0] + inv[r * 3 + 1] * b[1] + inv[r * 3 + 2] * b[2]) / det);
}

// Grows a convex solid by `d` (each face plane pushed out) and flips its winding, so only
// the far side renders: a cheap ink contour that follows the part when it animates.
function outlineSolid({ verts, faces }, d) {
  const fn = faces.map((f) => {
    const n = [0, 0, 0]; // Newell normal: robust when a polygon has collinear points
    f.forEach((i, k) => {
      const a = verts[i], b = verts[f[(k + 1) % f.length]];
      n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]);
    });
    return norm(n);
  });
  const moved = verts.map((p, vi) => {
    const ns = [];
    faces.forEach((f, k) => { if (f.includes(vi) && !ns.some((n) => dot(n, fn[k]) > 0.999)) ns.push(fn[k]); });
    const A = [1e-4, 0, 0, 0, 1e-4, 0, 0, 0, 1e-4], b = [0, 0, 0];
    for (const n of ns) for (let r = 0; r < 3; r++) { b[r] += n[r] * d; for (let c = 0; c < 3; c++) A[r * 3 + c] += n[r] * n[c]; }
    let x = solve3(A, b) ?? [0, 0, 0];
    const l = Math.hypot(...x);
    if (l > 3 * d) x = x.map((v) => (v / l) * 3 * d);
    return [p[0] + x[0], p[1] + x[1], p[2] + x[2]];
  });
  const idx = [];
  for (const f of faces) for (let i = 1; i < f.length - 1; i++) idx.push(f[0], f[i + 1], f[i]);
  return { pos: moved.flat(), idx };
}

export function toRigGLB(rig) {
  const u = rig.unit;
  const json = {
    asset: { version: '2.0', generator: 'orimathassets origami builder' },
    extensionsUsed: ['KHR_materials_unlit'],
    scene: 0,
    scenes: [{ name: rig.name, nodes: [0] }],
    nodes: [],
    meshes: [],
    materials: [],
    accessors: [],
    bufferViews: [],
    buffers: [],
  };
  // Three shared buffer views: vertex attributes (stride 12), indices, animation data.
  const pools = { vertex: [], index: [], anim: [] }, sizes = { vertex: 0, index: 0, anim: 0 };
  const accessor = (pool, typed, type, componentType, extra = {}) => {
    const bytes = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    json.accessors.push({ bufferView: pool, byteOffset: sizes[pool], componentType, count: typed.length / { SCALAR: 1, VEC3: 3, VEC4: 4 }[type], type, ...extra });
    pools[pool].push(padded);
    sizes[pool] += padded.length;
    return json.accessors.length - 1;
  };
  const vec3Accessor = (arr, bounds = true) => {
    const f = new Float32Array(arr);
    if (!bounds) return accessor('vertex', f, 'VEC3', 5126);
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < f.length; i++) { min[i % 3] = Math.min(min[i % 3], f[i]); max[i % 3] = Math.max(max[i % 3], f[i]); }
    return accessor('vertex', f, 'VEC3', 5126, { min: min.map(f32), max: max.map(f32) });
  };
  const indexAccessor = (arr) => {
    const big = arr.length && Math.max(...arr) > 65535;
    return accessor('index', big ? new Uint32Array(arr) : new Uint16Array(arr), 'SCALAR', big ? 5125 : 5123);
  };

  const matIndex = new Map();
  const material = (key) => {
    if (!matIndex.has(key)) {
      const hex = colourOf(key);
      if (!hex) throw new Error(`${rig.name}: unknown colour "${key}"`);
      const mat = { name: key, pbrMetallicRoughness: { baseColorFactor: [...hexToLinear(hex), 1], metallicFactor: 0, roughnessFactor: 0.95 } };
      if (key === 'ink') mat.extensions = { KHR_materials_unlit: {} };
      json.materials.push(mat);
      matIndex.set(key, json.materials.length - 1);
    }
    return matIndex.get(key);
  };

  const meshPrimitive = (tris, key) => {
    const pos = [], nor = [], idx = [], seen = new Map();
    for (let i = 0; i < tris.length; i += 9) {
      const a = [tris[i], tris[i + 1], tris[i + 2]], b = [tris[i + 3], tris[i + 4], tris[i + 5]], c = [tris[i + 6], tris[i + 7], tris[i + 8]];
      const n = norm(cross(sub(b, a), sub(c, a)));
      for (const p of [a, b, c]) {
        const k = [...p, ...n].map((v) => Math.round(v * 1e4)).join(',');
        if (!seen.has(k)) { seen.set(k, pos.length / 3); pos.push(...p.map((v) => v * u)); nor.push(...n); }
        idx.push(seen.get(k));
      }
    }
    return { attributes: { POSITION: vec3Accessor(pos), NORMAL: vec3Accessor(nor, false) }, indices: indexAccessor(idx), material: material(key) };
  };

  const emit = (node) => {
    const out = { name: node.name };
    json.nodes.push(out);
    const self = json.nodes.length - 1;
    if (node.t.some((v) => v !== 0)) out.translation = node.t.map((v) => +(v * u).toFixed(6));
    if (node.r) out.rotation = quat(node.r);
    if (node.s != null) out.scale = Array.isArray(node.s) ? node.s : [node.s, 1, 1];
    if (node.hidden) { out.scale = [0, 0, 0]; out.extras = { hidden_by_default: true }; }
    const children = [];
    if (node.model && node.model.groups.size) {
      const prims = [...node.model.groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, t]) => meshPrimitive(t, k));
      json.meshes.push({ name: node.name, primitives: prims });
      out.mesh = json.meshes.length - 1;
      const solids = node.outline ? node.model.solids.filter((s) => !s.ink) : [];
      if (solids.length) {
        const pos = [], idx = [];
        for (const s of solids) {
          const o = outlineSolid(s, OUTLINE_MM), base = pos.length / 3;
          pos.push(...o.pos.map((v) => v * u));
          idx.push(...o.idx.map((i) => i + base));
        }
        json.meshes.push({ name: `${node.name}_ink_outline`, primitives: [{ attributes: { POSITION: vec3Accessor(pos) }, indices: indexAccessor(idx), material: material('ink') }] });
        json.nodes.push({ name: 'ink_outline', mesh: json.meshes.length - 1 });
        children.push(json.nodes.length - 1);
      }
    }
    for (const c of node.children) children.push(emit(c));
    if (children.length) out.children = children;
    return self;
  };
  emit(rig.root);

  if (rig.clips.length) {
    json.animations = [];
    const inputs = new Map(), outputs = new Map(); // identical keyframe data share one accessor
    const byName = new Map();
    json.nodes.forEach((n, i) => { if (n.name !== 'ink_outline' && !byName.has(n.name)) byName.set(n.name, i); });
    for (const { name, tracks } of rig.clips) {
      const anim = { name, samplers: [], channels: [] };
      for (const { node, path, keys: raw } of tracks) {
        const keys = raw.filter(([t], i) => i === raw.length - 1 || raw[i + 1][0] > t); // strictly increasing times
        const ni = byName.get(node);
        if (ni === undefined) throw new Error(`${rig.name}/${name}: no node ${node}`);
        const rest = rig.find(node);
        const times = new Float32Array(keys.map(([t]) => t));
        let values, type;
        if (path === 'rotation') { values = keys.flatMap(([, v]) => quat(v)); type = 'VEC4'; }
        else if (path === 'translation') { values = keys.flatMap(([, v]) => v.map((x, i) => (x + rest.t[i]) * u)); type = 'VEC3'; }
        else { values = keys.flatMap(([, v]) => (Array.isArray(v) ? v : [v, v, v])); type = 'VEC3'; }
        const tk = times.join(',');
        if (!inputs.has(tk)) inputs.set(tk, accessor('anim', times, 'SCALAR', 5126, { min: [f32(times[0])], max: [f32(times[times.length - 1])] }));
        const input = inputs.get(tk);
        const vk = type + values.map(f32).join(',');
        if (!outputs.has(vk)) outputs.set(vk, accessor('anim', new Float32Array(values), type, 5126));
        const output = outputs.get(vk);
        anim.samplers.push({ input, output, interpolation: 'LINEAR' });
        anim.channels.push({ sampler: anim.samplers.length - 1, target: { node: ni, path } });
      }
      json.animations.push(anim);
    }
  }

  if (!json.materials.some((m) => m.extensions)) delete json.extensionsUsed;
  // Lay out the pools and renumber accessor views (pool name -> view index).
  const views = {}, chunks = [];
  let offset = 0;
  for (const [pool, target, stride] of [['vertex', 34962, 12], ['index', 34963], ['anim']]) {
    if (!sizes[pool]) continue;
    const view = { buffer: 0, byteOffset: offset, byteLength: sizes[pool] };
    if (stride) view.byteStride = stride;
    if (target) view.target = target;
    json.bufferViews.push(view);
    views[pool] = json.bufferViews.length - 1;
    chunks.push(...pools[pool]);
    offset += sizes[pool];
  }
  for (const a of json.accessors) a.bufferView = views[a.bufferView];
  const bin = Buffer.concat(chunks);
  json.buffers.push({ byteLength: bin.length });
  const pad = (buf, fill) => Buffer.concat([buf, Buffer.alloc((4 - (buf.length % 4)) % 4, fill)]);
  const jsonBuf = pad(Buffer.from(JSON.stringify(json)), 0x20);
  const binBuf = pad(bin, 0);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonBuf.length + 8 + binBuf.length, 8);
  const chunkHeader = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.writeUInt32LE(type, 4); return b; };
  return Buffer.concat([header, chunkHeader(jsonBuf.length, 0x4e4f534a), jsonBuf, chunkHeader(binBuf.length, 0x004e4942), binBuf]);
}
