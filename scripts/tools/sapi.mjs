// Origami cow (sapi) after a teal low-poly illustration (about 610x610 px, three-quarter view, head
// right), built like anjing.mjs: the body, neck and head are plates of the near side (image pixels
// with a depth z), mirrored to the far side and closed with seams along the outline; legs, hooves,
// horns, ears and tail are faceted convex hulls on both sides. Each plate has its own colour
// read off the illustration, stored as COLOR_0 on one material. Two eyes; no base plate.
// Points are [x, y, z] in image pixels (y down, z sideways); the model is in metres, y up, facing +x.
// Run: npm i --no-save @gltf-transform/core @gltf-transform/functions @gltf-transform/extensions
//      node scripts/tools/sapi.mjs models/custom/sapi.glb
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, quantize } from '@gltf-transform/functions';
import { Model } from '../lib/geom.mjs';

const output = process.argv[2] || 'models/custom/sapi.glb';
const NAME = output.split('/').pop().replace(/\.glb$/, '');
const PX = 0.0005; // metres per image pixel: about 0.29 m long, 0.25 m to the horn tips

// Teal shades of the illustration, darkest to lightest.
const C = {
  deep: '#1d736d', dark: '#24857e', teal: '#2c958c', mid: '#38a597', soft: '#56b9a6',
  mint: '#7fd0b6', pale: '#9fe0c8', hoof: '#2a8a80', horn: '#a9e6d0', ear_in: '#5fae9f',
  black: '#17191c', white: '#fbfbf8',
};

// Near-side points of the body, neck and head: [x, y, z]
const V = {
  // hindquarter
  R0: [52, 240, 22], R1: [150, 176, 28], R2: [100, 262, 56], R3: [58, 332, 36], R4: [176, 312, 54], R5: [112, 368, 44],
  // back and barrel
  B1: [238, 196, 30], B2: [332, 160, 30], M1: [252, 288, 72], M2: [182, 250, 62], M3: [322, 250, 70],
  U0: [172, 372, 46], U1: [218, 402, 44], U2: [302, 412, 44],
  // shoulder and chest
  S1: [384, 232, 58], S2: [432, 332, 34], S3: [382, 420, 44],
  // neck and head
  N1: [414, 150, 26], N2: [452, 254, 38],
  H1: [456, 140, 26], H2: [502, 128, 22], H3: [560, 165, 18], H4: [596, 210, 12], H5: [597, 232, 10],
  H6: [562, 243, 13], H7: [502, 252, 24], H8: [470, 254, 30], Hc: [514, 196, 34], Hm: [566, 205, 22],
};
// The picture gives no depth, so z is a guess; ZS sets how broad the cow is from the front.
const ZS = 1.55;
for (const p of Object.values(V)) p[2] *= ZS;

const tris = new Map();
const put = (c, a, b, d) => { if (!tris.has(c)) tris.set(c, []); tris.get(c).push(...a, ...b, ...d); };
const mir = (p) => [p[0], p[1], -p[2]];
const plate = (c, ks) => { const pts = ks.map(k => V[k]);
  for (let i = 1; i < pts.length - 1; i++) { put(c, pts[0], pts[i], pts[i + 1]); put(c, mir(pts[0]), mir(pts[i + 1]), mir(pts[i])); } };
const seam = (c, ks) => { for (let i = 0; i < ks.length - 1; i++) {
  const a = V[ks[i]], b = V[ks[i + 1]]; put(c, a, b, mir(b)); put(c, a, mir(b), mir(a)); } };

// hindquarter
plate(C.teal, ['R0', 'R1', 'R2']); plate(C.dark, ['R0', 'R2', 'R3']);
plate(C.mid, ['R1', 'M2', 'R2']); plate(C.soft, ['R2', 'M2', 'R4']);
plate(C.teal, ['R2', 'R4', 'R5']); plate(C.deep, ['R2', 'R5', 'R3']);
// back and barrel
plate(C.mid, ['R1', 'B1', 'M2']); plate(C.teal, ['B1', 'M1', 'M2']);
plate(C.dark, ['B1', 'B2', 'M3']); plate(C.teal, ['B1', 'M3', 'M1']);
plate(C.dark, ['M2', 'M1', 'U1']); plate(C.deep, ['M2', 'U1', 'U0']);
plate(C.dark, ['M2', 'U0', 'R4']); plate(C.deep, ['R4', 'U0', 'R5']);
plate(C.teal, ['M1', 'M3', 'U2']); plate(C.deep, ['M1', 'U2', 'U1']);
// shoulder and chest
plate(C.soft, ['B2', 'S1', 'M3']); plate(C.teal, ['M3', 'S1', 'S3']); plate(C.dark, ['M3', 'S3', 'U2']);
plate(C.deep, ['S1', 'S2', 'S3']);
// neck
plate(C.mid, ['B2', 'N1', 'S1']); plate(C.mint, ['N1', 'H1', 'H8']); plate(C.teal, ['N1', 'H8', 'S1']);
plate(C.dark, ['S1', 'H8', 'N2']); plate(C.deep, ['S1', 'N2', 'S2']);
// head
plate(C.pale, ['H1', 'H2', 'Hc']); plate(C.mint, ['H2', 'H3', 'Hc']); plate(C.pale, ['H3', 'Hm', 'Hc']);
plate(C.mint, ['H3', 'H4', 'Hm']); plate(C.soft, ['H4', 'H5', 'Hm']); plate(C.mid, ['H5', 'H6', 'Hm']);
plate(C.soft, ['H6', 'Hc', 'Hm']); plate(C.mid, ['H6', 'H7', 'Hc']); plate(C.teal, ['H7', 'H8', 'Hc']); plate(C.soft, ['H8', 'H1', 'Hc']);
// seams: along the back and over the head, round the muzzle and down the throat and chest, under the belly, behind the rump
seam(C.mid, ['R0', 'R1', 'B1', 'B2', 'N1', 'H1', 'H2', 'H3', 'H4']);
seam(C.teal, ['H4', 'H5']); seam(C.mid, ['H5', 'H6', 'H7', 'H8', 'N2', 'S2']);
seam(C.deep, ['S2', 'S3', 'U2', 'U1', 'U0', 'R5']); seam(C.dark, ['R5', 'R3', 'R0']);

// hulls for legs, hooves, horns, ears and tail, on both sides
const m = new Model(NAME);
const both = (fn) => { for (const s of [1, -1]) fn(s); };
const hull = (c, pts) => m.hull(c, pts);
const ring = (x0, x1, y, z0, z1) => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];
both((s) => {
  const Z = (z) => s * z * ZS;
  // front leg: upper, lower, hoof
  hull(C.mint, [...ring(316, 374, 330, Z(26), Z(52)), [316, 446, Z(28)], [360, 446, Z(28)], [316, 446, Z(48)], [360, 446, Z(48)]]);
  hull(C.soft, [[318, 446, Z(28)], [360, 446, Z(28)], [318, 446, Z(48)], [360, 446, Z(48)], ...ring(322, 352, 520, Z(30), Z(46))]);
  hull(C.hoof, [...ring(322, 352, 520, Z(30), Z(46)), ...ring(316, 360, 550, Z(28), Z(48)), [362, 550, Z(38)]]);
  // hind leg: thigh down to the hock, cannon, hoof
  hull(C.mint, [[62, 330, Z(30)], [62, 330, Z(48)], [150, 340, Z(30)], [150, 340, Z(50)], [72, 446, Z(30)], [72, 446, Z(46)], [112, 446, Z(30)], [112, 446, Z(46)]]);
  hull(C.soft, [[72, 446, Z(30)], [72, 446, Z(46)], [112, 446, Z(30)], [112, 446, Z(46)], ...ring(86, 114, 516, Z(31), Z(45))]);
  hull(C.hoof, [...ring(86, 114, 516, Z(31), Z(45)), ...ring(82, 124, 548, Z(29), Z(47)), [128, 548, Z(38)]]);
  // horn: a four-sided cone curving up from the poll
  hull(C.horn, [[444, 138, Z(12)], [474, 138, Z(12)], [444, 132, Z(26)], [474, 132, Z(26)], [452, 98, Z(30)], [464, 98, Z(24)]]);
  hull(C.pale, [[452, 98, Z(30)], [464, 98, Z(24)], [452, 100, Z(22)], [462, 46, Z(40)]]);
  // ear: a folded leaf pointing back and out
  hull(C.ear_in, [[444, 140, Z(26)], [450, 166, Z(28)], [396, 120, Z(62)], [412, 172, Z(58)], [426, 148, Z(40)], [420, 146, Z(52)]]);
});
// tail: hangs from the rump to a tuft
hull(C.dark, [[52, 238, 6], [52, 238, -6], [60, 250, 0], [26, 380, 4], [26, 380, -4], [34, 382, 0]]);
hull(C.teal, [[24, 376, 6], [24, 376, -6], [40, 380, 0], [10, 420, 0], [18, 412, 5], [18, 412, -5]]);
for (const [c, a] of m.groups) { if (!tris.has(c)) tris.set(c, []); tris.get(c).push(...a); }

// eyes: white eyeball, black pupil looking forward, white glint (as on anjing)
const headPlates = [['H1', 'H2', 'Hc'], ['H2', 'H3', 'Hc'], ['H3', 'Hm', 'Hc']];
const zOn = (x, y) => { for (const ks of headPlates) { const [a, b, c] = ks.map(k => V[k]);
  const d = (b[1]-c[1])*(a[0]-c[0]) + (c[0]-b[0])*(a[1]-c[1]);
  const u = ((b[1]-c[1])*(x-c[0]) + (c[0]-b[0])*(y-c[1])) / d, v = ((c[1]-a[1])*(x-c[0]) + (a[0]-c[0])*(y-c[1])) / d, w = 1-u-v;
  if (u >= -1e-6 && v >= -1e-6 && w >= -1e-6) return u*a[2] + v*b[2] + w*c[2]; } throw new Error('eye off the head'); };
const eye = (cx, cy, r) => { const n = 12, z0 = zOn(cx, cy) + 0.8;
  const rg = (rad, zz, ox = 0, oy = 0) => Array.from({ length: n }, (_, i) => [cx + ox + rad*Math.cos(2*Math.PI*i/n), cy + oy + rad*Math.sin(2*Math.PI*i/n), zz]);
  const cone = (c, rim, top) => { for (let i = 0; i < n; i++) { put(c, rim[i], rim[(i+1)%n], top); put(c, mir(rim[(i+1)%n]), mir(rim[i]), mir(top)); } };
  cone(C.white, rg(r, z0), [cx, cy, z0 + r*0.3]);
  const px = r*0.18, pr = r*0.62;
  cone(C.black, rg(pr, z0 + r*0.22, px, 0), [cx + px, cy, z0 + r*0.42]);
  cone(C.white, rg(r*0.2, z0 + r*0.4, px - pr*0.35, -pr*0.35), [cx + px - pr*0.35, cy - pr*0.35, z0 + r*0.46]); };
eye(518, 160, 11);

// write: one primitive with per-vertex colours; centre on x/z, hooves on y = 0, pixels -> metres
const srgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i+2), 16) / 255).map(c => c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055) ** 2.4);
let maxY = -Infinity, cx = 0, n = 0;
for (const a of tris.values()) for (let i = 0; i < a.length; i += 3) { maxY = Math.max(maxY, a[i+1]); cx += a[i]; n++; }
cx /= n;
const pos = [], nor = [], col = [];
for (const [c, a] of tris) {
  const rgb = srgb(c).map(x => Math.round(x * 65535));
  for (let i = 0; i < a.length; i += 9) {
    const p = [0, 3, 6].map(o => [(a[i+o] - cx) * PX, (maxY - a[i+o+1]) * PX, a[i+o+2] * PX]);
    const u = [0,1,2].map(k => p[1][k] - p[0][k]), v = [0,1,2].map(k => p[2][k] - p[0][k]);
    const q = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]; const l = Math.hypot(...q);
    if (l < 1e-12) continue;
    for (const pt of p) { pos.push(...pt); nor.push(...q.map(x => x / l)); col.push(...rgb, 65535); }
  }
}
const doc = new Document(); const buf = doc.createBuffer();
const mat = doc.createMaterial('paper_sapi').setMetallicFactor(0).setRoughnessFactor(0.95).setDoubleSided(true);
const mesh = doc.createMesh(NAME).addPrimitive(doc.createPrimitive().setMaterial(mat)
  .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(pos)).setBuffer(buf))
  .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(nor)).setBuffer(buf))
  .setAttribute('COLOR_0', doc.createAccessor().setType('VEC4').setArray(new Uint16Array(col)).setNormalized(true).setBuffer(buf)));
doc.createScene().addChild(doc.createNode(NAME).setMesh(mesh));
await doc.transform(dedup(), prune(), quantize({ quantizePosition: 14, quantizeNormal: 8 }));
await new NodeIO().registerExtensions(ALL_EXTENSIONS).write(output, doc);
console.log(output, pos.length / 9, 'triangles');
