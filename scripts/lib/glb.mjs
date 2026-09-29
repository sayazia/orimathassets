// Minimal glTF 2.0 binary (GLB) writer: one mesh, one primitive per colour,
// non-indexed triangles with per-face normals (flat, faceted paper shading).

import { PALETTE } from './palette.mjs';

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function hexToLinear(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => +srgbToLinear(v / 255).toFixed(5));
}

function faceNormals(pos) {
  const out = new Float32Array(pos.length);
  for (let i = 0; i < pos.length; i += 9) {
    const ax = pos[i + 3] - pos[i], ay = pos[i + 4] - pos[i + 1], az = pos[i + 5] - pos[i + 2];
    const bx = pos[i + 6] - pos[i], by = pos[i + 7] - pos[i + 1], bz = pos[i + 8] - pos[i + 2];
    let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    const l = Math.hypot(nx, ny, nz) || 1;
    nx /= l; ny /= l; nz /= l;
    for (let k = 0; k < 3; k++) out.set([nx, ny, nz], i + k * 3);
  }
  return out;
}

export function toGLB(model) {
  const json = {
    asset: { version: '2.0', generator: 'orimathassets origami builder' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name: model.name, mesh: 0 }],
    meshes: [{ name: model.name, primitives: [] }],
    materials: [],
    accessors: [],
    bufferViews: [],
    buffers: [],
  };
  const chunks = [];
  let offset = 0;
  const addView = (arr) => {
    const bytes = Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
    json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, target: 34962 });
    chunks.push(bytes);
    offset += bytes.length;
    return json.bufferViews.length - 1;
  };

  for (const [key, list] of [...model.groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const hex = PALETTE[key];
    if (!hex) throw new Error(`${model.name}: unknown palette colour "${key}"`);
    const pos = new Float32Array(list);
    const nor = faceNormals(pos);
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < pos.length; i++) {
      min[i % 3] = Math.min(min[i % 3], pos[i]);
      max[i % 3] = Math.max(max[i % 3], pos[i]);
    }
    json.materials.push({
      name: key,
      pbrMetallicRoughness: { baseColorFactor: [...hexToLinear(hex), 1], metallicFactor: 0, roughnessFactor: 0.95 },
    });
    const pv = addView(pos), nv = addView(nor);
    json.accessors.push({ bufferView: pv, componentType: 5126, count: pos.length / 3, type: 'VEC3', min, max });
    json.accessors.push({ bufferView: nv, componentType: 5126, count: nor.length / 3, type: 'VEC3' });
    json.meshes[0].primitives.push({
      attributes: { POSITION: json.accessors.length - 2, NORMAL: json.accessors.length - 1 },
      material: json.materials.length - 1,
    });
  }

  const bin = Buffer.concat(chunks);
  json.buffers.push({ byteLength: bin.length });
  const pad = (buf, fill) => Buffer.concat([buf, Buffer.alloc((4 - (buf.length % 4)) % 4, fill)]);
  const jsonBuf = pad(Buffer.from(JSON.stringify(json)), 0x20);
  const binBuf = pad(bin, 0);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonBuf.length + 8 + binBuf.length, 8);
  const chunkHeader = (len, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(len, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([header, chunkHeader(jsonBuf.length, 0x4e4f534a), jsonBuf, chunkHeader(binBuf.length, 0x004e4942), binBuf]);
}
