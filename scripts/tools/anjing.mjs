// Origami dog (anjing) traced from a line drawing of a folded paper dog (595x633 px, side view,
// head left), the same way as burung.mjs: every plate of the near side is a polygon of image
// pixels with a depth z, the far side is its mirror, and seams close the gap along the outline.
// Legs are thick plates (an inner copy plus a seam), ears and tail are folded sheets, and each
// side of the head gets an eye. No base plate: the paws stand on y = 0.
// Points are [x, y, z] in image pixels (y down, z sideways); the model is in metres, y up, facing -x.
// Colour schemes: toska (default) paints every plate with the colour sampled from a teal
// version of the same drawing (577x613 px); putih is white paper with the drawing's two greys.
// Run: npm i --no-save @gltf-transform/core @gltf-transform/functions @gltf-transform/extensions
//      node scripts/tools/anjing.mjs models/custom/anjing.glb [toska|putih]
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, quantize } from '@gltf-transform/functions';

const output = process.argv[2] || 'models/custom/anjing.glb';
const NAME = output.split('/').pop().replace(/\.glb$/, '');
const SCHEME = process.argv[3] || 'toska';
if (!['toska', 'putih'].includes(SCHEME)) throw new Error(`unknown colour scheme ${SCHEME}`);
const PX = 0.0004; // metres per image pixel: about 0.22 m long and 0.23 m to the ear tips

// Paper white and the two greys of the drawing's shaded plates.
const COLOURS = {
  paper_white: '#f7f6f3',
  paper_grey_light: '#e4e3df',
  paper_grey: '#cdccc8',
  paper_black: '#1a1b1e',
  paper_eye_white: '#fbfbf8',
  paper_eye_glint: '#ffffff',
};
// toska: each plate's colour, sampled from the teal drawing (keyed by the plate's points);
// seams and leg rims take the tone colour for their white / light grey / grey key.
const TOSKA = {
  'S1-H1-H2': '#349ca0', 'S1-H2-H4': '#2a8f95', 'H2-H3-H4': '#639f91', 'S1-H4-S2': '#16737a',
  'S2-H4-J3': '#177179', 'S2-J3-J2': '#114e53', 'S2-J2-J1': '#145760',
  'E1-H1-E1m': '#2da7a6', 'E1-E1m-H2': '#1d7f80', 'E2-H2-E2m': '#86c5b0', 'E2-E2m-H3': '#92cdbb',
  'J3-H4-B1': '#38bebf', 'J2-J3-C2': '#6fb39c', 'J2-C2-C1': '#79bca5', 'J3-B1-C2': '#29a9ac',
  'C2-B1-P1': '#91e6df', 'C1-C2-P1': '#71d3d4', 'C1-P1-K0': '#71d3d4', 'K0-P1-P2': '#72d1d3', 'K0-P2-K1': '#3f7478',
  'P2-P1-P3': '#45bbab', 'P1-B1-Q1': '#95d7c1', 'B1-B2-Q2-Q1': '#ade4cf', 'P1-Q1-Q3': '#91c6b4',
  'P1-Q3-P3': '#1f8788', 'P3-Q3-U2-U1': '#1c888a', 'Q1-Q2-Q3': '#90c5b3', 'Q2-Q4-Q3': '#ace6d0',
  'Q2-B2-Q4': '#8dd3b9', 'B2-R1-Q4': '#83b8b3',
  'T1-T2-T4': '#87a49f', 'T2-T3-T4': '#83b8b3', 'T4-T3-T5': '#43877a', 'B2-T1-T5': '#8bd2bb',
  'P2-P3-U1': '#34a997', 'P2-U1-L2': '#2e9e8e', 'P2-L2-L1': '#2a9486', 'L1-L2-Pf': '#299f91', 'L1-Pf-Pb': '#66bbb0',
  'Q3-Q4-H6': '#4f817c', 'Q4-R1-R2': '#679b96', 'Q4-R2-H5': '#689b96', 'Q4-H5-H6': '#5a8f8a', 'H6-H5-Hp1-Hp2': '#6b9c98',
};
const TOSKA_TONE = { paper_white: '#8fd3c0', paper_grey_light: '#4fa9a3', paper_grey: '#2b7f80' };
// colour (a palette key or '#hex') for a plate of tone `c` with points `ks`
const tone = (c, ks) => SCHEME === 'putih' || !(c in TOSKA_TONE) ? c : (ks && TOSKA[ks.join('-')]) || TOSKA_TONE[c];
const Wh = 'paper_white', Gl = 'paper_grey_light', G = 'paper_grey';

// Near-side points: [x, y, z]
const V = {
  // nose and head
  N1: [25, 113, 5], S1: [47, 111, 7], S2: [41, 137, 7], N4: [27, 135, 5],
  H1: [78, 100, 14], H2: [140, 80, 20], H3: [212, 90, 26], H4: [222, 148, 34],
  J1: [45, 157, 7], J2: [100, 200, 18], J3: [157, 207, 30],
  // ears: tip and the rib they fold along
  E1: [77, 37, 16], E1m: [109, 92, 24], E2: [175, 33, 24], E2m: [176, 87, 32],
  // neck, chest and body
  C1: [115, 253, 30], C2: [145, 262, 40], B1: [242, 241, 36], P1: [248, 300, 52],
  K0: [104, 300, 32], K1: [80, 365, 26], P2: [122, 380, 44], P3: [248, 420, 48],
  Q1: [408, 332, 46], Q2: [421, 360, 50], B2: [470, 368, 30], R1: [494, 461, 32],
  Q3: [352, 422, 46], Q4: [400, 455, 46], U1: [242, 457, 40], U2: [290, 452, 38],
  // front leg and paw
  L1: [150, 540, 38], L2: [225, 542, 38], Pf: [178, 616, 38], Pb: [137, 600, 38],
  // hind leg and paw
  R2: [488, 560, 34], H5: [469, 582, 36], H6: [430, 567, 38], Hp1: [455, 606, 38], Hp2: [413, 592, 38],
  // tail
  T1: [452, 355, 14], T2: [477, 259, 8], T3: [570, 326, 5], T4: [500, 348, 14], T5: [480, 397, 14],
};
// The drawing gives no depth, so z is a guess; ZS widens the whole dog from the front.
const ZS = 1.35;
for (const p of Object.values(V)) p[2] *= ZS;

const tris = new Map();
const put = (c, a, b, d) => { if (!tris.has(c)) tris.set(c, []); tris.get(c).push(...a, ...b, ...d); };
const mir = (p) => [p[0], p[1], -p[2]];
const P = (k, dz = 0) => { const p = V[k]; return [p[0], p[1], p[2] + dz]; };
// a convex plate on the near side and its mirror on the far side (sides: 1 near only, -1 far only)
const plate = (c, ks, dz = 0, sides = 0) => { c = tone(c, ks); const pts = ks.map(k => P(k, dz));
  for (let i = 1; i < pts.length - 1; i++) {
    if (sides >= 0) put(c, pts[0], pts[i], pts[i + 1]);
    if (sides <= 0) put(c, mir(pts[0]), mir(pts[i + 1]), mir(pts[i])); } };
// seam joining the two sides along a chain of outline points
const seam = (c, ks) => { c = tone(c); for (let i = 0; i < ks.length - 1; i++) {
  const a = P(ks[i]), b = P(ks[i + 1]); put(c, a, b, mir(b)); put(c, a, mir(b), mir(a)); } };
// a thick plate (legs): the plates, an inner copy pushed in by t, and a rim along the outline
const slab = (faces, outline, t) => {
  for (const [c, ...ks] of faces) { plate(c, ks); plate(c, ks, -t); }
  for (let i = 0; i < outline.length - 1; i++) {
    const a = P(outline[i]), b = P(outline[i + 1]), ai = P(outline[i], -t), bi = P(outline[i + 1], -t);
    const r = tone(G); put(r, a, b, bi); put(r, a, bi, ai); put(r, mir(a), mir(bi), mir(b)); put(r, mir(a), mir(ai), mir(bi));
  }
};

// head
plate('paper_black', ['N1', 'S1', 'S2', 'N4']);
plate(Wh, ['S1', 'H1', 'H2']); plate(Wh, ['S1', 'H2', 'H4']); plate(Gl, ['H2', 'H3', 'H4']);
plate(Wh, ['S1', 'H4', 'S2']); plate(Gl, ['S2', 'H4', 'J3']); plate(G, ['S2', 'J3', 'J2']); plate(G, ['S2', 'J2', 'J1']);
// ears: two halves folded along the rib. The drawing shows the far ear in front (E1) and the
// near ear behind it (E2), so each is built on its own side only.
plate(G, ['E1', 'H1', 'E1m'], 0, -1); plate(Wh, ['E1', 'E1m', 'H2'], 0, -1);
plate(G, ['E2', 'H2', 'E2m'], 0, 1); plate(Wh, ['E2', 'E2m', 'H3'], 0, 1);
// neck and shoulder
plate(Wh, ['J3', 'H4', 'B1']); plate(G, ['J2', 'J3', 'C2']); plate(Gl, ['J2', 'C2', 'C1']); plate(Wh, ['J3', 'B1', 'C2']);
plate(Wh, ['C2', 'B1', 'P1']); plate(Wh, ['C1', 'C2', 'P1']); plate(Gl, ['C1', 'P1', 'K0']);
plate(Wh, ['K0', 'P1', 'P2']); plate(G, ['K0', 'P2', 'K1']);
// body
plate(Wh, ['P2', 'P1', 'P3']); plate(Wh, ['P1', 'B1', 'Q1']); plate(Wh, ['B1', 'B2', 'Q2', 'Q1']);
plate(Gl, ['P1', 'Q1', 'Q3']); plate(G, ['P1', 'Q3', 'P3']); plate(G, ['P3', 'Q3', 'U2', 'U1']);
plate(Wh, ['Q1', 'Q2', 'Q3']); plate(Wh, ['Q2', 'Q4', 'Q3']); plate(Wh, ['Q2', 'B2', 'Q4']); plate(Gl, ['B2', 'R1', 'Q4']);
// tail
plate(Gl, ['T1', 'T2', 'T4']); plate(Wh, ['T2', 'T3', 'T4']); plate(G, ['T4', 'T3', 'T5']); plate(Wh, ['B2', 'T1', 'T5']);
// legs
slab([[Wh, 'P2', 'P3', 'U1'], [Wh, 'P2', 'U1', 'L2'], [Gl, 'P2', 'L2', 'L1'], [Wh, 'L1', 'L2', 'Pf'], [G, 'L1', 'Pf', 'Pb']],
  ['P2', 'L1', 'Pb', 'Pf', 'L2', 'U1'], 26);
slab([[Wh, 'Q3', 'Q4', 'H6'], [Gl, 'Q4', 'R1', 'R2'], [Wh, 'Q4', 'R2', 'H5'], [Wh, 'Q4', 'H5', 'H6'], [G, 'H6', 'H5', 'Hp1', 'Hp2']],
  ['Q3', 'H6', 'Hp2', 'Hp1', 'H5', 'R2', 'R1'], 26);
// seams between the two sides: over the head and back, round the tail, under the belly, down the chest and jaw
seam(Wh, ['N1', 'S1', 'H1', 'H2', 'H3', 'H4', 'B1', 'B2']);
seam(Gl, ['B2', 'T1']); seam(Wh, ['T1', 'T2', 'T3']); seam(G, ['T3', 'T5', 'B2']); seam(Gl, ['B2', 'R1']);
seam(G, ['U1', 'U2', 'Q3']);
seam(G, ['P2', 'K1', 'K0', 'C1', 'J2', 'J1', 'S2', 'N4']); seam('paper_black', ['N4', 'N1']);

// eyes sit on the head plates: zOn gives the plate depth under the eye centre
const headPlates = [['S1', 'H2', 'H4'], ['S1', 'H4', 'S2'], ['S1', 'H1', 'H2']];
const zOn = (x, y) => { for (const ks of headPlates) { const [a, b, c] = ks.map(k => V[k]);
  const d = (b[1]-c[1])*(a[0]-c[0]) + (c[0]-b[0])*(a[1]-c[1]);
  const u = ((b[1]-c[1])*(x-c[0]) + (c[0]-b[0])*(y-c[1])) / d, v = ((c[1]-a[1])*(x-c[0]) + (a[0]-c[0])*(y-c[1])) / d, w = 1-u-v;
  if (u >= -1e-6 && v >= -1e-6 && w >= -1e-6) return u*a[2] + v*b[2] + w*c[2]; } throw new Error('eye off the head'); };
// eyes: a white eyeball, a black pupil looking forward and a white glint, like the teal drawing
const eye = (cx, cy, r) => { const n = 12, z0 = zOn(cx, cy) + 0.8;
  const ring = (rad, zz, ox = 0, oy = 0) => Array.from({ length: n }, (_, i) => [cx + ox + rad*Math.cos(2*Math.PI*i/n), cy + oy + rad*Math.sin(2*Math.PI*i/n), zz]);
  const cone = (c, rim, top) => { for (let i = 0; i < n; i++) { put(c, rim[i], rim[(i+1)%n], top); put(c, mir(rim[(i+1)%n]), mir(rim[i]), mir(top)); } };
  cone('paper_eye_white', ring(r, z0), [cx, cy, z0 + r*0.3]);
  const px = -r*0.18, pr = r*0.62;
  cone('paper_black', ring(pr, z0 + r*0.22, px, 0), [cx + px, cy, z0 + r*0.42]);
  cone('paper_eye_glint', ring(r*0.2, z0 + r*0.4, px - pr*0.35, -pr*0.35), [cx + px - pr*0.35, cy - pr*0.35, z0 + r*0.46]); };
eye(140, 104, 14);

// write: centre on x/z, paws on y = 0, pixels -> metres
let maxY = -Infinity, cx = 0, n = 0;
for (const a of tris.values()) for (let i = 0; i < a.length; i += 3) { maxY = Math.max(maxY, a[i+1]); cx += a[i]; n++; }
cx /= n;
const srgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i+2), 16) / 255).map(c => c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055) ** 2.4);
const doc = new Document(); const buf = doc.createBuffer(); const mesh = doc.createMesh(NAME);
// putih: one primitive and one named material per colour, like the other models.
// toska has ~45 plate colours, so it uses a single material with the colours as COLOR_0 instead.
const VERTEX_COLOURS = SCHEME === 'toska';
const all = { pos: [], nor: [], col: [] };
let count = 0;
for (const [c, a] of [...tris.entries()].sort(([x], [y]) => x.localeCompare(y))) {
  const pos = new Float32Array(a.length), nor = new Float32Array(a.length);
  for (let i = 0; i < a.length; i += 3) { pos[i] = (a[i] - cx) * PX; pos[i+1] = (maxY - a[i+1]) * PX; pos[i+2] = a[i+2] * PX; }
  for (let i = 0; i < pos.length; i += 9) {
    const u = [0,1,2].map(k => pos[i+3+k] - pos[i+k]), v = [0,1,2].map(k => pos[i+6+k] - pos[i+k]);
    const q = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]; const l = Math.hypot(...q) || 1;
    for (let k = 0; k < 3; k++) nor.set(q.map(x => x / l), i + 3*k);
  }
  count += pos.length / 9;
  const rgb = srgb(c.startsWith('#') ? c : COLOURS[c]);
  if (VERTEX_COLOURS) {
    all.pos.push(...pos); all.nor.push(...nor);
    for (let i = 0; i < pos.length / 3; i++) all.col.push(...rgb.map(x => Math.round(x * 65535)), 65535);
    continue;
  }
  const mat = doc.createMaterial(c).setBaseColorFactor([...rgb, 1]).setMetallicFactor(0).setRoughnessFactor(0.95).setDoubleSided(true);
  mesh.addPrimitive(doc.createPrimitive().setMaterial(mat)
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buf))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(nor).setBuffer(buf)));
}
if (VERTEX_COLOURS) {
  const mat = doc.createMaterial('paper_toska').setMetallicFactor(0).setRoughnessFactor(0.95).setDoubleSided(true);
  mesh.addPrimitive(doc.createPrimitive().setMaterial(mat)
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(all.pos)).setBuffer(buf))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(all.nor)).setBuffer(buf))
    .setAttribute('COLOR_0', doc.createAccessor().setType('VEC4').setArray(new Uint16Array(all.col)).setNormalized(true).setBuffer(buf)));
}
doc.createScene().addChild(doc.createNode(NAME).setMesh(mesh));
await doc.transform(dedup(), prune(), quantize({ quantizePosition: 14, quantizeNormal: 8 }));
await new NodeIO().registerExtensions(ALL_EXTENSIONS).write(output, doc);
console.log(output, count, 'triangles');
