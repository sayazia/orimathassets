// Origami cow (sapi) traced from a teal low-poly illustration (610x588 px, three-quarter view, head
// right), built like anjing.mjs: the body, neck and head are plates of the near side (image pixels
// with a depth z), mirrored to the far side and closed with seams along the outline; legs, hooves,
// horns, ears and tail are faceted convex hulls on both sides. Each plate has the colour
// sampled from the illustration, stored as COLOR_0 on one material. Two eyes; no base plate.
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

// Fixed colours; every plate's colour is sampled from the illustration (PLATE_COLOURS below).
const C = { black: '#17191c', white: '#fbfbf8' };

// Near-side points of the body, neck and head: [x, y, z], traced from the illustration (610x588 px)
const V = {
  // hindquarter and thigh
  R0: [52, 232, 20], R1: [157, 167, 26], R6: [125, 237, 48], R2: [67, 278, 36], R3: [88, 350, 38],
  Ta: [178, 300, 52], Tb: [112, 330, 56],
  // back and barrel
  B1: [240, 192, 28], B2: [350, 152, 30], Mb: [320, 200, 50], M1: [270, 290, 66], M2: [190, 252, 58], M3: [332, 245, 66],
  U0: [180, 357, 44], U1: [212, 392, 44], U2: [318, 372, 46],
  // shoulder, chest and neck
  S1: [395, 230, 56], S2: [425, 365, 32], S3: [372, 380, 44], S4: [450, 300, 34], N1: [420, 145, 28],
  // head: poll, forehead, face, nose, jaw; E/F/G/K are the folds across the face and cheek
  H1: [452, 128, 24], H2: [486, 100, 20], H3: [553, 140, 17], H4: [598, 203, 13], H5: [597, 230, 11],
  NA: [572, 206, 17], NB: [578, 235, 14], H6: [558, 238, 15], H7: [527, 225, 20], H8: [468, 272, 30],
  E: [500, 143, 30], F: [520, 158, 27], G: [487, 212, 33], K: [443, 195, 34],
};
// The picture gives no depth, so z is a guess; ZS sets how broad the cow is from the front.
const ZS = 1.55;
for (const p of Object.values(V)) p[2] *= ZS;

const PLATES = [
  // hindquarter and thigh
  ['R0', 'R1', 'R6'], ['R0', 'R6', 'R2'], ['R2', 'R6', 'Tb'], ['R2', 'Tb', 'R3'], ['R1', 'M2', 'R6'], ['R6', 'M2', 'Ta'],
  ['R6', 'Ta', 'Tb'], ['Tb', 'Ta', 'U0'], ['R3', 'Tb', 'U0'],
  // back and barrel
  ['R1', 'B1', 'M2'], ['B1', 'M1', 'M2'], ['B1', 'B2', 'Mb'], ['B1', 'Mb', 'M1'], ['Mb', 'M3', 'M1'],
  ['B2', 'S1', 'Mb'], ['Mb', 'S1', 'M3'], ['M2', 'M1', 'U1'], ['M2', 'U1', 'U0'], ['M2', 'U0', 'Ta'],
  ['M1', 'M3', 'U2'], ['M1', 'U2', 'U1'], ['M3', 'S1', 'S3'], ['M3', 'S3', 'U2'],
  // chest and neck
  ['S1', 'S2', 'S3'], ['S1', 'S4', 'S2'], ['B2', 'N1', 'S1'], ['N1', 'H1', 'K'], ['N1', 'K', 'S1'], ['S1', 'K', 'H8'], ['S1', 'H8', 'S4'],
  // head
  ['H1', 'H2', 'E'], ['H2', 'H3', 'F'], ['H2', 'F', 'E'], ['H3', 'H4', 'NA'], ['H3', 'NA', 'F'], ['NA', 'H4', 'H5', 'NB'],
  ['F', 'NA', 'NB'], ['F', 'NB', 'H6'], ['F', 'H6', 'H7'], ['E', 'F', 'G'], ['F', 'H7', 'G'], ['K', 'E', 'G'], ['H1', 'E', 'K'],
  ['G', 'H7', 'H8'], ['K', 'G', 'H8'],
];
// PLATE_COLOURS:BEGIN (sampled from the illustration at each plate's centre)
const PLATE_COLOURS = {
  'R0-R1-R6': '#4fb8ac', 'R0-R6-R2': '#288f8e', 'R2-R6-Tb': '#288f8e', 'R2-Tb-R3': '#2a8f8e',
  'R1-M2-R6': '#187071', 'R6-M2-Ta': '#0f5658', 'R6-Ta-Tb': '#1a7072', 'Tb-Ta-U0': '#98ddbe',
  'R3-Tb-U0': '#98ddc0', 'R1-B1-M2': '#187072', 'B1-M1-M2': '#288f8e', 'B1-B2-Mb': '#288f8d',
  'B1-Mb-M1': '#288f8e', 'Mb-M3-M1': '#288f8e', 'B2-S1-Mb': '#4db7ac', 'Mb-S1-M3': '#4eb8ac',
  'M2-M1-U1': '#1b7072', 'M2-U1-U0': '#186b6f', 'M2-U0-Ta': '#56aca2', 'M1-M3-U2': '#238080',
  'M1-U2-U1': '#0f5558', 'M3-S1-S3': '#278e8b', 'M3-S3-U2': '#4eb7a7', 'S1-S2-S3': '#1a7071',
  'S1-S4-S2': '#1b7073', 'B2-N1-S1': '#288f8e', 'N1-H1-K': '#69bba3', 'N1-K-S1': '#288f8e',
  'S1-K-H8': '#187072', 'S1-H8-S4': '#197173', 'H1-H2-E': '#65bda8', 'H2-H3-F': '#98ddc0',
  'H2-F-E': '#83d0b8', 'H3-H4-NA': '#99dcc0', 'H3-NA-F': '#98ddbe', 'NA-H4-H5-NB': '#125a5a',
  'F-NA-NB': '#66beab', 'F-NB-H6': '#66bfa9', 'F-H6-H7': '#66bfa9', 'E-F-G': '#2c9591',
  'F-H7-G': '#66bfa9', 'K-E-G': '#98ddc0', 'H1-E-K': '#afe5d5', 'G-H7-H8': '#0f5756',
  'K-G-H8': '#248385',
};
// PLATE_COLOURS:END
const PART = { leg_upper: '#98ddc0', leg_lower: '#66bfa9', hoof: '#2b8a82', horn: '#aadfd5', horn_tip: '#7cc7b5',
  ear: '#2e8f88', ear_in: '#86c2b8', tail: '#1f7a74', tuft: '#1c6c67', seam_top: '#2e958c', seam_low: '#1c6c67', nose: '#1e6a66' };

const tris = new Map();
const put = (c, a, b, d) => { if (!tris.has(c)) tris.set(c, []); tris.get(c).push(...a, ...b, ...d); };
const mir = (p) => [p[0], p[1], -p[2]];
const plate = (c, ks) => { const pts = ks.map(k => V[k]);
  for (let i = 1; i < pts.length - 1; i++) { put(c, pts[0], pts[i], pts[i + 1]); put(c, mir(pts[0]), mir(pts[i + 1]), mir(pts[i])); } };
const seam = (c, ks) => { for (let i = 0; i < ks.length - 1; i++) {
  const a = V[ks[i]], b = V[ks[i + 1]]; put(c, a, b, mir(b)); put(c, a, mir(b), mir(a)); } };

for (const ks of PLATES) plate(PLATE_COLOURS[ks.join('-')] || PART.seam_top, ks);
// seams: along the back and over the head, across the nose, under the jaw, throat, chest and belly, behind the rump
seam(PART.seam_top, ['R0', 'R1', 'B1', 'B2', 'N1', 'H1', 'H2', 'H3', 'H4']);
seam(PART.nose, ['H4', 'H5']);
seam(PART.seam_low, ['H5', 'NB', 'H6', 'H7', 'H8', 'S4', 'S2', 'S3', 'U2', 'U1', 'U0', 'R3', 'R2', 'R0']);

// hulls for legs, hooves, horns, ears and tail, on both sides
const m = new Model(NAME);
const ring = (x0, x1, y, z0, z1) => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];
for (const s of [1, -1]) {
  const Z = (z) => s * z * ZS;
  // front leg: upper to the knee, lower to the fetlock, hoof
  m.hull(PART.leg_upper, [...ring(318, 377, 335, Z(24), Z(50)), ...ring(325, 362, 436, Z(26), Z(46))]);
  m.hull(PART.leg_lower, [...ring(325, 362, 436, Z(26), Z(46)), ...ring(331, 355, 512, Z(28), Z(44))]);
  m.hull(PART.hoof, [...ring(331, 355, 512, Z(28), Z(44)), ...ring(328, 372, 542, Z(26), Z(46)), [376, 542, Z(36)]]);
  // hind leg: from under the thigh to the hock, cannon, hoof
  m.hull(PART.leg_upper, [...ring(92, 160, 345, Z(28), Z(50)), ...ring(73, 110, 426, Z(28), Z(46))]);
  m.hull(PART.leg_lower, [...ring(73, 110, 426, Z(28), Z(46)), ...ring(84, 115, 512, Z(29), Z(44))]);
  m.hull(PART.hoof, [...ring(84, 115, 512, Z(29), Z(44)), ...ring(90, 135, 538, Z(27), Z(46)), [138, 538, Z(36)]]);
  // horn: up and back to a bend, then up and forward to the tip
  m.hull(PART.horn, [...ring(448, 472, 134, Z(12), Z(24)), [440, 88, Z(26)], [452, 86, Z(22)], [446, 92, Z(30)]]);
  m.hull(PART.horn_tip, [[440, 88, Z(26)], [452, 86, Z(22)], [446, 92, Z(30)], [467, 40, Z(32)]]);
  // ear: a leaf sticking out sideways, rim and lighter inside
  m.hull(PART.ear, [[456, 134, Z(24)], [458, 152, Z(26)], [402, 111, Z(60)], [440, 112, Z(48)], [462, 140, Z(40)], [447, 157, Z(46)], [418, 157, Z(58)], [430, 135, Z(56)]]);
  m.hull(PART.ear_in, [[410, 117, Z(61)], [438, 118, Z(51)], [455, 140, Z(43)], [444, 151, Z(48)], [420, 151, Z(59)], [430, 132, Z(58)]]);
}
// tail: hangs from the rump to a tuft
m.hull(PART.tail, [[54, 236, 6], [54, 236, -6], [62, 246, 0], [44, 368, 4], [44, 368, -4], [50, 370, 0]]);
m.hull(PART.tuft, [[42, 362, 7], [42, 362, -7], [48, 376, 0], [15, 412, 0], [24, 396, 5], [24, 396, -5]]);
for (const [c, a] of m.groups) { if (!tris.has(c)) tris.set(c, []); tris.get(c).push(...a); }

// eyes: white eyeball, black pupil looking forward, white glint (as on anjing)
const headPlates = [['H2', 'F', 'E'], ['E', 'F', 'G'], ['H2', 'H3', 'F'], ['H1', 'H2', 'E'], ['H1', 'E', 'K']];
const zOn = (x, y) => { for (const ks of headPlates) { const [a, b, c] = ks.map(k => V[k]);
  const d = (b[1]-c[1])*(a[0]-c[0]) + (c[0]-b[0])*(a[1]-c[1]);
  const u = ((b[1]-c[1])*(x-c[0]) + (c[0]-b[0])*(y-c[1])) / d, v = ((c[1]-a[1])*(x-c[0]) + (a[0]-c[0])*(y-c[1])) / d, w = 1-u-v;
  if (u >= -1e-6 && v >= -1e-6 && w >= -1e-6) return u*a[2] + v*b[2] + w*c[2]; } throw new Error('eye off the head'); };
const eye = (cx, cy, r) => { const n = 12, z0 = zOn(cx, cy) + 0.8;
  const rg = (rad, zz, ox = 0, oy = 0) => Array.from({ length: n }, (_, i) => [cx + ox + rad*Math.cos(2*Math.PI*i/n), cy + oy + rad*Math.sin(2*Math.PI*i/n), zz]);
  const cone = (c, rim, top) => { for (let i = 0; i < n; i++) { put(c, rim[i], rim[(i+1)%n], top); put(c, mir(rim[(i+1)%n]), mir(rim[i]), mir(top)); } };
  cone(C.white, rg(r, z0), [cx, cy, z0 + r*0.3]);
  const px = r*0.18, pr = r*0.62; // pupil looks forward (+x)
  cone(C.black, rg(pr, z0 + r*0.22, px, 0), [cx + px, cy, z0 + r*0.42]);
  cone(C.white, rg(r*0.2, z0 + r*0.4, px - pr*0.35, -pr*0.35), [cx + px - pr*0.35, cy - pr*0.35, z0 + r*0.46]); };
eye(511, 151, 9);

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
