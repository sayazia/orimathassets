// Origami bird (burung) traced from a flat 2D teal illustration (621x638 px, side view, head left)
// and folded into 3D: the body is a closed shell whose sides bulge out along the folds, both wings
// tilt out from the back, the tail is a pleated fan, and both sides of the head get an eye.
// Points are image pixels [x, y, z] (y down, z sideways); the model is in metres, y up, facing -x.
// Run: npm i --no-save @gltf-transform/core @gltf-transform/functions @gltf-transform/extensions
//      node scripts/tools/burung.mjs models/custom/burung.glb
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, quantize } from '@gltf-transform/functions';

const output = process.argv[2] || 'models/custom/burung.glb';
const NAME = output.split('/').pop().replace(/\.glb$/, '');
const PX = 0.0005; // metres per image pixel: about 0.27 m from beak to wing tip

// Colours sampled from the illustration's facets.
const COLOURS = {
  paper_teal_pale: '#62d4c9',
  paper_teal_light: '#4cc8bc',
  paper_teal: '#2bb7a9',
  paper_teal_mid: '#16ab9c',
  paper_teal_beak: '#139d8e',
  paper_teal_dark: '#10897a',
  paper_black: '#141518',
  paper_white: '#f6f4ee',
};

const tris = new Map(); // colour -> flat [x,y,z,...]
const tri = (c, a, b, d) => { if (!tris.has(c)) tris.set(c, []); tris.get(c).push(...a, ...b, ...d); };
const mirror = (p) => [p[0], p[1], -p[2]];

// --- head and body: silhouette points sit on z = 0, inner points bulge to ±z ---
// Bm sits just behind the head's front edge B2-B3 so the beak overlaps the head and leaves no gap.
const Bt = [32, 188, 0], B2 = [78, 105, 0], B3 = [100, 176, 0], Bm = [97, 160, 7]; // beak
const H2 = [165, 82, 0], H3 = [222, 112, 0], H4 = [127, 268, 0], Hc = [158, 168, 22]; // head
const R = [322, 210, 0], T = [445, 382, 0], Be = [340, 345, 0], Bc = [262, 262, 36]; // body
const side = [
  ['paper_teal_beak', Bt, B2, Bm], ['paper_teal_dark', Bt, Bm, B3], ['paper_teal_mid', B2, B3, Bm],
  ['paper_teal_light', B2, H2, Hc], ['paper_teal_light', H2, H3, Hc],
  ['paper_teal_mid', B2, Hc, B3], ['paper_teal_mid', B3, Hc, H4],
  ['paper_teal', H3, R, Bc], ['paper_teal_dark', R, T, Bc],
  ['paper_teal_mid', T, Be, Bc], ['paper_teal_mid', Be, H4, Bc],
  ['paper_teal', H4, Hc, Bc], ['paper_teal', Hc, H3, Bc],
];
for (const [c, a, b, d] of side) { tri(c, a, b, d); tri(c, mirror(a), mirror(d), mirror(b)); }

// --- wings: the illustrated wing, hinged on the back ridge and tilted out to each side ---
const W = { W0: [225, 82], W1: [348, 55], W2: [568, 97], W3: [445, 152], W4: [560, 214], W5: [340, 232], W6: [300, 218] };
const hinge = 226; // image y of the hinge line (the back)
const TILT = 16 * Math.PI / 180;
const wingPt = (k, s) => { const [x, y] = W[k];
  // valley fold along W1-W6: the leading edge points lift a little more
  const lift = k === 'W1' || k === 'W6' ? 0 : 10;
  const h = hinge - y; // height above the hinge (pixels)
  return [x, hinge - h * Math.cos(TILT), s * (h * Math.sin(TILT) + lift + 4)]; };
for (const s of [1, -1]) {
  const p = (k) => wingPt(k, s);
  tri('paper_teal_light', p('W0'), p('W1'), p('W6'));
  tri('paper_teal_pale', p('W1'), p('W2'), p('W3'));
  tri('paper_teal_pale', p('W1'), p('W3'), p('W6'));
  tri('paper_teal_light', p('W6'), p('W3'), p('W4'));
  tri('paper_teal_light', p('W6'), p('W4'), p('W5'));
}

// --- tail: a pleated fan from under the body ---
const A = [343, 343, 0];
const fan = [[445, 382, 0], [538, 497, 9], [510, 570, -6], [435, 620, 9], [310, 522, -4]];
const fanMid = [[492, 440, -3], [524, 534, 2], [472, 595, 2], [372, 571, 3]]; // creases between the fan points
const tailCols = [['paper_teal', 'paper_teal_light'], ['paper_teal_light', 'paper_teal'], ['paper_teal', 'paper_teal_light'], ['paper_teal_light', 'paper_teal']];
for (let i = 0; i < 4; i++) {
  tri(tailCols[i][0], A, fan[i], fanMid[i]);
  tri(tailCols[i][1], A, fanMid[i], fan[i + 1]);
}

// --- eyes: a small black cone with a white glint, on each side of the head ---
// Height of the head surface at (x, y) on triangle B2-H2-Hc / B2-Hc-B3.
const zOn = (x, y) => { for (const [a, b, c] of [[B2, H2, Hc], [B2, Hc, B3], [H2, H3, Hc]]) {
  const d = (b[1]-c[1])*(a[0]-c[0]) + (c[0]-b[0])*(a[1]-c[1]);
  const u = ((b[1]-c[1])*(x-c[0]) + (c[0]-b[0])*(y-c[1])) / d, v = ((c[1]-a[1])*(x-c[0]) + (a[0]-c[0])*(y-c[1])) / d, w = 1-u-v;
  if (u >= -1e-6 && v >= -1e-6 && w >= -1e-6) return u*a[2] + v*b[2] + w*c[2]; } return 0; };
const eye = (cx, cy, r, s) => {
  const z0 = zOn(cx, cy) + 0.6, n = 10;
  const ring = (rad, zz, ox = 0, oy = 0) => Array.from({ length: n }, (_, i) => [cx + ox + rad*Math.cos(2*Math.PI*i/n), cy + oy + rad*Math.sin(2*Math.PI*i/n), zz]);
  const rim = ring(r, z0), top = [cx, cy, z0 + r*0.45];
  for (let i = 0; i < n; i++) tri('paper_black', ...(s > 0 ? [rim[i], rim[(i+1)%n], top] : [rim[(i+1)%n], rim[i], top]).map(p => s > 0 ? p : mirror(p)));
  const g = ring(r*0.32, z0 + r*0.3, -r*0.3, -r*0.3), gc = [cx - r*0.3, cy - r*0.3, z0 + r*0.42];
  for (let i = 0; i < n; i++) tri('paper_white', ...(s > 0 ? [g[i], g[(i+1)%n], gc] : [g[(i+1)%n], g[i], gc]).map(p => s > 0 ? p : mirror(p)));
};
eye(140, 140, 11, 1); eye(140, 140, 11, -1);

// --- write: image pixels -> metres, centred on x/z, standing on y = 0 ---
let minY = Infinity, cx = 0, n = 0;
for (const a of tris.values()) for (let i = 0; i < a.length; i += 3) { minY = Math.min(minY, -a[i+1]); cx += a[i]; n++; }
cx /= n;
const srgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i+2), 16) / 255).map(c => c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055) ** 2.4);
const doc = new Document(); const buf = doc.createBuffer(); const mesh = doc.createMesh(NAME);
for (const [c, a] of [...tris.entries()].sort(([x], [y]) => x.localeCompare(y))) {
  const pos = new Float32Array(a.length), nor = new Float32Array(a.length);
  for (let i = 0; i < a.length; i += 3) { pos[i] = (a[i] - cx) * PX; pos[i+1] = (-a[i+1] - minY) * PX; pos[i+2] = a[i+2] * PX; }
  for (let i = 0; i < pos.length; i += 9) {
    const u = [0,1,2].map(k => pos[i+3+k] - pos[i+k]), v = [0,1,2].map(k => pos[i+6+k] - pos[i+k]);
    const m = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]; const l = Math.hypot(...m) || 1;
    for (let k = 0; k < 3; k++) nor.set(m.map(x => x / l), i + 3*k);
  }
  const mat = doc.createMaterial(c).setBaseColorFactor([...srgb(COLOURS[c]), 1]).setMetallicFactor(0).setRoughnessFactor(0.95).setDoubleSided(true);
  mesh.addPrimitive(doc.createPrimitive().setMaterial(mat)
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buf))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(nor).setBuffer(buf)));
}
doc.createScene().addChild(doc.createNode(NAME).setMesh(mesh));
await doc.transform(dedup(), prune(), quantize({ quantizePosition: 14, quantizeNormal: 8 }));
await new NodeIO().registerExtensions(ALL_EXTENSIONS).write(output, doc);
console.log(output, [...tris.values()].reduce((s, a) => s + a.length / 9, 0), 'triangles');
