// Origami dog (anjing) modelled after a white paper-dog render (480x535 px, three-quarter view,
// head left). The photo is not a side view, so the facets are not traced one by one: the dog is
// built from faceted convex hulls (body, chest, head, snout, ears, four legs with paws, tail) with
// the photo's proportions. Points are [x, y, z] in image pixels with y up from the ground and z
// sideways; the model is written in metres, y up, facing -x.
// Faces turned away from the light take the `_shade` grey, like the grey facets in the photo.
// Run: npm i --no-save @gltf-transform/core @gltf-transform/functions @gltf-transform/extensions
//      node scripts/tools/anjing.mjs models/custom/anjing.glb
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, quantize } from '@gltf-transform/functions';
import { Model } from '../lib/geom.mjs';

const output = process.argv[2] || 'models/custom/anjing.glb';
const NAME = output.split('/').pop().replace(/\.glb$/, '');
const PX = 0.0005; // metres per image pixel: about 0.22 m tall at the ear tips

const COLOURS = {
  paper_white: '#f5f4f0',
  paper_white_shade: '#c9c8c4',
  paper_black: '#17181b',
};

const m = new Model(NAME);
const W = 'paper_white*';
const both = (pts) => pts.flatMap(([x, y, z]) => (z ? [[x, y, z], [x, y, -z]] : [[x, y, 0]]));

// body: a low gable with the ridge along the spine and a keel under the belly
m.hull(W, [...both([[112, 214, 52], [356, 186, 46], [115, 128, 48], [354, 122, 42]]),
  [122, 230, 0], [348, 198, 0], [235, 108, 0]]);
// chest and neck, rising forward to the head
m.hull(W, [...both([[100, 212, 48], [112, 140, 40], [150, 292, 30], [190, 282, 28], [196, 214, 44]]),
  [92, 245, 0], [170, 300, 0]]);
// head: one wedge from the wide back of the skull to the pointed snout
m.hull(W, [...both([[180, 372, 38], [192, 300, 32], [120, 374, 24], [118, 300, 20], [44, 362, 7], [46, 340, 5]]),
  [150, 392, 0], [196, 340, 0], [140, 280, 0], [80, 314, 0]]);
// nose and the mouth crease
m.hull('paper_black', [...both([[30, 364, 7], [44, 366, 8], [32, 350, 6], [46, 350, 7]]), [26, 357, 0]]);
for (const s of [1, -1]) m.hull('paper_black', [[50, 340, s * 6.2], [116, 302, s * 20.6], [116, 299, s * 20.6], [50, 337, s * 6.2], [50, 338, s * 5], [116, 300, s * 19.4]]);
// ears: three-sided pyramids leaning back a little
for (const s of [1, -1]) m.hull(W, [[122, 374, s * 6], [170, 378, s * 10], [146, 366, s * 30], [130, 440, s * 18]]);

// legs: a tapered three-sided prism with the sharp edge forward, and a folded paw
const leg = (top, bot, zc, wTop, wBot) => {
  const [tx, ty] = top, [bx, by] = bot;
  m.hull(W, [[tx - wTop, ty, zc], [tx + wTop * 0.7, ty, zc + wTop * 0.75], [tx + wTop * 0.7, ty, zc - wTop * 0.75],
    [bx - wBot, by, zc], [bx + wBot * 0.7, by, zc + wBot * 0.75], [bx + wBot * 0.7, by, zc - wBot * 0.75]]);
};
const paw = (x, zc) => m.hull(W, [[x - 34, 0, zc], [x + 10, 0, zc + 15], [x + 10, 0, zc - 15], [x + 4, 28, zc], [x - 8, 24, zc]]);
for (const s of [1, -1]) {
  const z = s * 32;
  // front legs: straight, wide at the shoulder
  leg([145, 160], [146, 24], z, 40, 17); paw(146, z);
  // back legs: thigh down to the hock, then the shank forward to the paw
  m.hull(W, [...[[290, 178], [380, 172], [292, 118], [382, 112]].flatMap(([x, y]) => [[x, y, z + s * 20], [x, y, z - s * 14]]),
    [352, 52, z + s * 6], [372, 58, z - s * 6]]);
  leg([362, 62], [340, 24], z, 18, 15); paw(340, z);
}
// tail: a folded fan rising from the rump
m.hull(W, [...both([[360, 186, 14], [372, 164, 10], [380, 258, 6]]), [446, 205, 0], [424, 186, 6], [424, 186, -6]]);

// write: centre on x/z, feet on y = 0, pixels -> metres
let cx = 0, n = 0;
for (const a of m.groups.values()) for (let i = 0; i < a.length; i += 3) { cx += a[i]; n++; }
cx /= n;
const srgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const doc = new Document(); const buf = doc.createBuffer(); const mesh = doc.createMesh(NAME);
let tris = 0;
for (const [c, a] of [...m.groups.entries()].sort(([x], [y]) => x.localeCompare(y))) {
  const pos = new Float32Array(a.length), nor = new Float32Array(a.length);
  for (let i = 0; i < a.length; i += 3) { pos[i] = (a[i] - cx) * PX; pos[i + 1] = a[i + 1] * PX; pos[i + 2] = a[i + 2] * PX; }
  for (let i = 0; i < pos.length; i += 9) {
    const u = [0, 1, 2].map(k => pos[i + 3 + k] - pos[i + k]), v = [0, 1, 2].map(k => pos[i + 6 + k] - pos[i + k]);
    const q = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const l = Math.hypot(...q) || 1;
    for (let k = 0; k < 3; k++) nor.set(q.map(x => x / l), i + 3 * k);
  }
  tris += pos.length / 9;
  const mat = doc.createMaterial(c).setBaseColorFactor([...srgb(COLOURS[c]), 1]).setMetallicFactor(0).setRoughnessFactor(0.95);
  mesh.addPrimitive(doc.createPrimitive().setMaterial(mat)
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buf))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(nor).setBuffer(buf)));
}
doc.createScene().addChild(doc.createNode(NAME).setMesh(mesh));
await doc.transform(dedup(), prune(), quantize({ quantizePosition: 14, quantizeNormal: 8 }));
await new NodeIO().registerExtensions(ALL_EXTENSIONS).write(output, doc);
console.log(output, tris, 'triangles');
