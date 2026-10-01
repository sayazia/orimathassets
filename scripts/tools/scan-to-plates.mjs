// Turns a textured origami scan (e.g. kelinci_1.glb, 25 MB) into a small flat-colour GLB:
// welds and simplifies the mesh (crease grooves disappear), splits it into flat plates by
// face normal, merges thin strips into their neighbours and paints each plate one brown
// shade so neighbouring plates differ. No textures; KHR_mesh_quantization.
// Run: npm i --no-save @gltf-transform/core @gltf-transform/functions @gltf-transform/extensions meshoptimizer
//      node scripts/tools/scan-to-plates.mjs in.glb out.glb [targetTris=5000] [angleDeg=22] [minAreaFrac=0.004] [palette=brown|brown_soft|orange_soft|sky_soft|grey]
// Env PLATE_IDS=1 writes one material per plate named plate_<id> (to find a plate in a render);
// env PLATE_COLORS=id:material,... then repaints those plates with a palette entry, e.g. 12:paper_orange.
// models/custom (kelinci, kucing, ayam built with PLATE_ADJ=edge): kelinci = brown_soft; kucing = orange_soft; gajah = sky_soft; ayam = orange_soft with
//   PLATE_COLORS=25:paper_orange,29:paper_orange,32:paper_orange_pale,28:paper_orange_light
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptSimplifier } from 'meshoptimizer';
import { writeFileSync } from 'node:fs';
import { quantize, dedup, prune } from '@gltf-transform/functions';
const [,, input, output, TARGET = '6000', ANG = '22', MINAREA = '0.004', PALETTE = 'brown'] = process.argv;
const NAME = output.split('/').pop().replace(/\.glb$/, '');
await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(input);
const node = doc.getRoot().listNodes().find(n => n.getMesh());
const prim = node.getMesh().listPrimitives()[0];
const M = node.getWorldMatrix();
const pa = prim.getAttribute('POSITION'), ia = prim.getIndices();
// weld by position, baking world transform
const map = new Map(), pos = [], remap = new Uint32Array(pa.getCount()); const e = [];
for (let i = 0; i < pa.getCount(); i++) {
  pa.getElement(i, e); const k = e.join(',');
  let v = map.get(k); if (v === undefined) { v = pos.length / 3; map.set(k, v);
    pos.push(M[0]*e[0]+M[4]*e[1]+M[8]*e[2]+M[12], M[1]*e[0]+M[5]*e[1]+M[9]*e[2]+M[13], M[2]*e[0]+M[6]*e[1]+M[10]*e[2]+M[14]); }
  remap[i] = v;
}
const P = new Float32Array(pos); const src = ia.getArray(); const I0 = new Uint32Array(src.length);
for (let i = 0; i < src.length; i++) I0[i] = remap[src[i]];
console.log('welded verts', P.length/3, 'tris', I0.length/3);
const [I1, err] = MeshoptSimplifier.simplify(I0, P, 3, +TARGET * 3, 0.05, []);
console.log('simplified tris', I1.length/3, 'err', err);
// faces
const F = I1.length / 3, N = new Float32Array(F*3), A = new Float32Array(F);
let totalA = 0;
for (let f = 0; f < F; f++) {
  const [a,b,c] = [I1[3*f],I1[3*f+1],I1[3*f+2]].map(i=>[P[3*i],P[3*i+1],P[3*i+2]]);
  const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]], v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
  const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]; const l=Math.hypot(...n)||1e-12;
  N.set([n[0]/l,n[1]/l,n[2]/l],3*f); A[f]=l/2; totalA+=l/2;
}
// face adjacency via edges
const edges = new Map(); const adj = Array.from({length:F},()=>[]);
for (let f = 0; f < F; f++) for (let k = 0; k < 3; k++) {
  const x=I1[3*f+k], y=I1[3*f+(k+1)%3]; const key = x<y?x+'_'+y:y+'_'+x;
  const o = edges.get(key); if (o) for (const g of o){ adj[f].push(g); adj[g].push(f);} else edges.set(key,[]); edges.get(key).push(f);
}
// region growing on normals (compare against region mean normal)
const cosT = Math.cos(+ANG*Math.PI/180); const R = new Int32Array(F).fill(-1); const regions = [];
const order = [...Array(F).keys()].sort((a,b)=>A[b]-A[a]);
for (const s of order) { if (R[s] >= 0) continue;
  const id = regions.length; const r = {faces:[], n:[0,0,0], area:0}; regions.push(r);
  const q=[s]; R[s]=id;
  while (q.length) { const f=q.pop(); r.faces.push(f); r.area+=A[f]; for(let k=0;k<3;k++) r.n[k]+=N[3*f+k]*A[f];
    const l=Math.hypot(...r.n); const m=r.n.map(x=>x/l);
    for (const g of adj[f]) if (R[g]<0 && N[3*g]*m[0]+N[3*g+1]*m[1]+N[3*g+2]*m[2] > cosT) { R[g]=id; q.push(g); } }
}
// merge small regions into the neighbour sharing the longest border
const minA = +MINAREA * totalA;
for (let pass = 0; pass < 10; pass++) { let changed = 0;
  const idx = regions.map((r,i)=>i).filter(i=>regions[i].faces.length && regions[i].area < minA).sort((a,b)=>regions[a].area-regions[b].area);
  for (const i of idx) { const r = regions[i]; if (!r.faces.length || r.area >= minA) continue;
    const cnt = new Map(); for (const f of r.faces) for (const g of adj[f]) if (R[g]!==i) cnt.set(R[g],(cnt.get(R[g])||0)+1);
    if (!cnt.size) continue; const j=[...cnt].sort((a,b)=>b[1]-a[1])[0][0];
    for (const f of r.faces) R[f]=j; const t=regions[j]; t.faces.push(...r.faces); t.area+=r.area; for(let k=0;k<3;k++) t.n[k]+=r.n[k]; r.faces=[]; r.area=0; changed++; }
  if (!changed) break; }
const live = regions.map((r,i)=>i).filter(i=>regions[i].faces.length);
console.log('regions', live.length);
// region adjacency + greedy colouring so neighbours differ
const palettes = {
  brown: [
    ['paper_brown',       [0.600,0.388,0.220]],
    ['paper_brown_light', [0.855,0.667,0.447]],
    ['paper_brown_dark',  [0.337,0.204,0.114]],
    ['paper_caramel',     [0.757,0.502,0.271]],
    ['paper_cream',       [0.945,0.839,0.667]],
  ],
  // Close shades of one hue: plates still read apart, without dramatic jumps.
  brown_soft: [
    ['paper_brown',       [0.765,0.557,0.373]],
    ['paper_brown_light', [0.824,0.624,0.439]],
    ['paper_brown_pale',  [0.867,0.690,0.518]],
    ['paper_brown_warm',  [0.722,0.514,0.337]],
    ['paper_brown_deep',  [0.682,0.478,0.310]],
  ],
  orange_soft: [
    ['paper_orange',       [0.925,0.545,0.227]],
    ['paper_orange_light', [0.957,0.620,0.310]],
    ['paper_orange_pale',  [0.973,0.690,0.408]],
    ['paper_orange_warm',  [0.890,0.490,0.196]],
    ['paper_orange_deep',  [0.851,0.443,0.165]],
  ],
  sky_soft: [
    ['paper_sky',       [0.478,0.749,0.918]],
    ['paper_sky_light', [0.561,0.800,0.945]],
    ['paper_sky_pale',  [0.659,0.851,0.965]],
    ['paper_sky_warm',  [0.412,0.698,0.890]],
    ['paper_sky_deep',  [0.357,0.651,0.859]],
  ],
  grey: [
    ['paper_grey',        [0.545,0.557,0.573]],
    ['paper_grey_light',  [0.800,0.808,0.816]],
    ['paper_grey_dark',   [0.278,0.290,0.306]],
    ['paper_slate',       [0.412,0.431,0.459]],
    ['paper_silver',      [0.925,0.929,0.933]],
  ],
};
const palette = palettes[PALETTE];
if (!palette) throw new Error(`unknown palette ${PALETTE}`);
const rAdj = new Map(live.map(i=>[i,new Map()]));
for (let f=0; f<F; f++) for (const g of adj[f]) if (R[f]!==R[g]) { const m=rAdj.get(R[f]); m.set(R[g],(m.get(R[g])||0)+1); }
// Plates that only touch in space (a flap lying on another flap) are not joined in the mesh,
// so with PLATE_ADJ=near (default) any two plates with vertices within 2% of the model size
// also count as neighbours. PLATE_ADJ=edge keeps mesh-edge neighbours only (older outputs).
if ((process.env.PLATE_ADJ || 'near') === 'near') {
  let lo=[Infinity,Infinity,Infinity], hi=[-Infinity,-Infinity,-Infinity];
  for (let v=0; v<P.length/3; v++) for (let k=0;k<3;k++){ lo[k]=Math.min(lo[k],P[3*v+k]); hi[k]=Math.max(hi[k],P[3*v+k]); }
  const eps = 0.02 * Math.hypot(hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]);
  const pts = new Map(); // vertex -> set of regions using it
  for (let f=0; f<F; f++) for (let k=0;k<3;k++){ const v=I1[3*f+k]; if(!pts.has(v)) pts.set(v,new Set()); pts.get(v).add(R[f]); }
  const cell = (x)=>Math.floor(x/eps); const grid = new Map();
  for (const v of pts.keys()) { const key=cell(P[3*v])+','+cell(P[3*v+1])+','+cell(P[3*v+2]); if(!grid.has(key)) grid.set(key,[]); grid.get(key).push(v); }
  for (const [v, rs] of pts) { const cx=cell(P[3*v]), cy=cell(P[3*v+1]), cz=cell(P[3*v+2]);
    for (let dx=-1;dx<=1;dx++) for (let dy=-1;dy<=1;dy++) for (let dz=-1;dz<=1;dz++) for (const u of grid.get((cx+dx)+','+(cy+dy)+','+(cz+dz)) || []) {
      if (u<=v || Math.hypot(P[3*u]-P[3*v],P[3*u+1]-P[3*v+1],P[3*u+2]-P[3*v+2]) > eps) continue;
      for (const a of rs) for (const b of pts.get(u)) if (a!==b) { const m=rAdj.get(a); m.set(b,(m.get(b)||0)+1); const n=rAdj.get(b); n.set(a,(n.get(a)||0)+1); } } }
}
// Greedy colouring, largest plate first. Neighbours must not share a colour and should not be
// the next shade either (rank by lightness), so every fold line stays visible.
const lum = palette.map(([,c])=>0.2126*c[0]+0.7152*c[1]+0.0722*c[2]);
const rank = lum.map(l=>lum.filter(m=>m<l).length);
const col = new Map(); const use = new Array(palette.length).fill(0);
for (const i of [...live].sort((a,b)=>regions[b].area-regions[a].area)) {
  let best=-1, bestCost=Infinity;
  for (let c=0;c<palette.length;c++) {
    let cost = use[c]/totalA;
    for (const [j,w] of rAdj.get(i)) { if (!col.has(j)) continue; const d=Math.abs(rank[c]-rank[col.get(j)]); cost += Math.sqrt(w)*(d===0?100:d===1?3:0); }
    if (cost<bestCost) { bestCost=cost; best=c; } }
  col.set(i,best); use[best]+=regions[i].area; }
for (const pair of (process.env.PLATE_COLORS || '').split(',').filter(Boolean)) {
  const [id, name] = pair.split(':'); const c = palette.findIndex(p => p[0] === name);
  if (!col.has(+id) || c < 0) throw new Error(`bad PLATE_COLORS entry ${pair}`); col.set(+id, c);
}
if (process.env.PLATE_IDS) {
  palette.length = 0;
  for (const i of live) { col.set(i, palette.length); palette.push([`plate_${i}`, [((i+1)&255)/255, ((i+1)>>8)/255, 0]]); }
}
// build output: one primitive per colour, vertices split per region, flat region normal
const out = new Document(); const buf = out.createBuffer(); const mesh = out.createMesh(NAME);
for (let c = 0; c < palette.length; c++) {
  const vp=[], vn=[], ix=[];
  for (const i of live) { if (col.get(i)!==c) continue; const r=regions[i];
    const l=Math.hypot(...r.n); const vm=new Map();
    const big=r.faces.reduce((a,f)=>A[f]>A[a]?f:a,r.faces[0]);
    const rn=l>1e-9?r.n.map(x=>x/l):[N[3*big],N[3*big+1],N[3*big+2]];
    for (const f of r.faces) if (A[f] > 1e-10) for (let k=0;k<3;k++){ const v=I1[3*f+k]; let w=vm.get(v);
      if (w===undefined){ w=vp.length/3; vm.set(v,w); vp.push(P[3*v],P[3*v+1],P[3*v+2]);
        // blend face normal toward region normal: flat look but keeps slight fold shading
        vn.push(...rn); }
      ix.push(w);} }
  if (!ix.length) continue;
  const mat = out.createMaterial(palette[c][0]).setBaseColorFactor([...palette[c][1].map(x=>Math.pow(x,2.2)),1]).setMetallicFactor(0).setRoughnessFactor(0.95).setDoubleSided(true);
  const p = out.createPrimitive().setMaterial(mat)
    .setAttribute('POSITION', out.createAccessor().setType('VEC3').setArray(new Float32Array(vp)).setBuffer(buf))
    .setAttribute('NORMAL', out.createAccessor().setType('VEC3').setArray(new Float32Array(vn)).setBuffer(buf))
    .setIndices(out.createAccessor().setType('SCALAR').setArray(vp.length/3>65535?new Uint32Array(ix):new Uint16Array(ix)).setBuffer(buf));
  mesh.addPrimitive(p);
}
out.createScene().addChild(out.createNode(NAME).setMesh(mesh));
await out.transform(dedup(), prune(), quantize({ quantizePosition: 14, quantizeNormal: 8 }));
await new NodeIO().registerExtensions(ALL_EXTENSIONS).write(output, out);
