// Archetype builders for the origami animal set (two reference books, see docs/ORIGAMI_ANIMALS.md).
// Everything is authored in millimetres in rest-pose model space: head towards +x, flat profile to +z,
// feet on y = 0. Bodies are tents of a few large planes, heads are pyramids, legs, ears, tails and fins
// are flat strips folded once (`flapLeg`, `spike`). Small details (eyes, noses) are plain discs.
//
// Colours: `main` and `trim` get automatic lit/shade tones (4 materials), `accent` is one flat colour
// (beak, comb, inner ear...) and `ink` is the fifth; with the accent that makes six, the build limit.
import { plate, surf, disc, spike, flapLeg, blob, V } from './origami.mjs';
import { creatureClips } from './clips.mjs';

export const both = (f) => { f(1); f(-1); };
const lerp = (p, q, t) => p.map((v, i) => v + (q[i] - v) * t);

export function cols({ main, trim = 'paper', accent = 'pink' }) {
  return { M: main + '*', T: trim + '*', A: accent };
}

// Thin square rod from a to b (bird legs, necks, antennae).
export function stick(m, c, a, b, r = 1) {
  const d = V.sub(b, a);
  const up = Math.abs(d[1]) > Math.hypot(d[0], d[2]) * 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = V.mul(V.norm(V.cross(d, up)), r), w = V.mul(V.norm(V.cross(d, u)), r);
  const ring = (p) => [V.add(p, V.add(u, w)), V.add(p, V.sub(u, w)), V.sub(p, V.add(u, w)), V.add(p, V.sub(w, u))];
  m.hull(c, [...ring(a), ...ring(b)]);
}

// Flat ribbon from a to b (xy plane, z half-width wa -> wb, thickness th): snake and tail segments.
export function band(m, c, a, b, wa, wb, th = 3) {
  const d = V.norm([b[0] - a[0], b[1] - a[1], 0]), n = [-d[1] * th / 2, d[0] * th / 2, 0];
  const ring = (p, w) => [V.add(p, [n[0], n[1], w]), V.add(p, [n[0], n[1], -w]), V.sub(p, [n[0], n[1], w]).map((v, i) => (i === 2 ? p[2] - w : v)), V.sub(p, [n[0], n[1], -w]).map((v, i) => (i === 2 ? p[2] + w : v))];
  m.hull(c, [...ring([a[0], a[1], a[2] ?? 0], wa), ...ring([b[0], b[1], b[2] ?? 0], wb)]);
}

// Head pyramid: crown, forehead, two cheeks, chin, snout tip. Dimensions follow the Foldlings fox head.
// s: scale, snout: snout length multiplier, wide: cheek width, drop: snout tip lowered (mm), blunt: square nose.
export function headShape([hx, hy], { s = 1, snout = 1, wide = 1, drop = 0, blunt = false, tall = 1 } = {}) {
  const P = (x, y, z = 0) => [hx + x * s, hy + y * s, z * s];
  const tipX = 26 * snout, tipY = -5.5 - drop;
  const pts = [P(-2, 10 * tall), P(11 + (snout - 1) * 4, 5 * tall + (tall - 1) * 2), P(1, -1, 10.5 * wide), P(1, -1, -10.5 * wide), P(5, -7), P(tipX, tipY)];
  if (blunt) pts.push(P(tipX - 3, tipY + 3.5, 6.5 * wide), P(tipX - 3, tipY + 3.5, -6.5 * wide));
  return { pts, tip: P(tipX, tipY), P };
}

// Species face: a faceted cranium plus a muzzle block. Units mm, head-local x forward from the pivot.
// hl, hw, hh: cranium length, width, height. ml, mw, mh: muzzle length, width, height.
// taper: muzzle tip size vs its base (0 = pointed like a fox, 1 = square like a pig or hippo).
// drop: muzzle lowered below the eyes. dome: extra crown height. ridge: crown folded to a ridge (pointed faces).
// cheek: cheeks pushed out sideways (cats, big cats). jowl: chin pulled down (hippo, walrus). s: overall scale.
export const FACES = {
  fox: { hl: 16, hw: 19, hh: 15, ml: 17, mw: 8, mh: 7, taper: 0.1, drop: 3, ridge: true },
  wolf: { hl: 18, hw: 18, hh: 16, ml: 19, mw: 9, mh: 8, taper: 0.35, drop: 2, ridge: true },
  cat: { hl: 17, hw: 22, hh: 18, ml: 3.5, mw: 11, mh: 7, taper: 0.75, drop: 3, cheek: 1.15 },
  bigcat: { hl: 19, hw: 24, hh: 18, ml: 7, mw: 14, mh: 10, taper: 0.8, drop: 3, cheek: 1.2 },
  rabbit: { hl: 17, hw: 16, hh: 16, ml: 6, mw: 10, mh: 8, taper: 0.55, drop: 2, dome: 2 },
  squirrel: { hl: 15, hw: 16, hh: 15, ml: 6, mw: 8.5, mh: 7, taper: 0.5, drop: 2, dome: 1.5, cheek: 1.1 },
  meerkat: { hl: 14, hw: 13, hh: 12, ml: 10, mw: 6, mh: 5.5, taper: 0.35, drop: 2 },
  pig: { hl: 16, hw: 22, hh: 19, ml: 6, mw: 12, mh: 10, taper: 1, drop: 3 },
  hippo: { hl: 20, hw: 22, hh: 16, ml: 16, mw: 24, mh: 15, taper: 1, drop: 6, jowl: 3 },
  beaver: { hl: 16, hw: 18, hh: 15, ml: 6, mw: 12, mh: 9, taper: 0.8, drop: 3, dome: 1, cheek: 1.1 },
  mammoth: { hl: 18, hw: 20, hh: 24, ml: 3, mw: 12, mh: 10, taper: 0.9, drop: 4, dome: 7 },
  walrus: { hl: 18, hw: 20, hh: 16, ml: 8, mw: 20, mh: 12, taper: 0.9, drop: 4, jowl: 2 },
  dragon: { hl: 16, hw: 16, hh: 14, ml: 16, mw: 11, mh: 7, taper: 0.7, drop: 1, ridge: true },
  lizard: { hl: 12, hw: 10, hh: 9, ml: 10, mw: 7, mh: 5, taper: 0.5, drop: 1 },
  bird: { hl: 15, hw: 16, hh: 16, ml: 0, mw: 6, mh: 6, taper: 1, drop: 0, dome: 2 },
};

export function faceHead([hx, hy], face) {
  const f = { hl: 16, hw: 18, hh: 16, ml: 10, mw: 9, mh: 7, taper: 0.5, drop: 2, dome: 0, cheek: 1, jowl: 0, s: 1, ...face };
  const s = f.s, P = (x, y, z = 0) => [hx + x * s, hy + y * s, z * s];
  const { hl, hw, hh, ml, mw, mh, taper, drop, dome, cheek, jowl } = f;
  const top = hh * 0.5, zt = f.ridge ? 0 : hw * 0.26;
  const pts = [
    P(-hl * 0.5, hh * 0.05, hw * 0.3), P(-hl * 0.5, hh * 0.05, -hw * 0.3), // back of the skull
    P(-hl * 0.3, top, zt), P(-hl * 0.3, top, -zt), P(hl * 0.1, top * 0.92 + dome * 0.4, zt * 0.9), P(hl * 0.1, top * 0.92 + dome * 0.4, -zt * 0.9), // crown
    P(-hl * 0.05, -hh * 0.08, hw * 0.5 * cheek), P(-hl * 0.05, -hh * 0.08, -hw * 0.5 * cheek), // cheeks
    P(-hl * 0.25, -hh * 0.5 - jowl, hw * 0.24), P(-hl * 0.25, -hh * 0.5 - jowl, -hw * 0.24), // jaw
  ];
  if (dome) pts.push(P(-hl * 0.05, top + dome, 0));
  const xf = hl * 0.3, my = -hh * 0.18 - drop * 0.4, ty = my - drop * 0.6;
  const base = [[mh / 2, mw / 2], [mh / 2, -mw / 2], [-mh / 2, mw / 2], [-mh / 2, -mw / 2]];
  base.forEach(([y, z]) => pts.push(P(xf, my + y, z)));
  const tipX = xf + ml;
  if (taper < 0.12) pts.push(P(tipX, ty));
  else base.forEach(([y, z]) => pts.push(P(tipX, ty + y * taper, z * taper)));
  return {
    pts, P, f,
    tip: P(tipX, ty), // centre of the nose end
    eyeAt: P(xf - 1.5 - (ml < 5 ? 1 : 0), hh * 0.16 + dome * 0.2), // just behind the muzzle, above the cheek line
    muzzleTop: my + mh / 2, xf, my, ty, tipX,
  };
}

// Two eyes seated on a convex hull: rays from each side hit the surface, so the discs always touch it.
export function seatEyes(node, pts, at, { size = 4.4, tilt = [0, 0, 1], colour = 'ink' } = {}) {
  const hits = [1, -1].map((s) => {
    const dir = [tilt[0], tilt[1], -s * tilt[2]];
    const h = surf(pts, [at[0] - dir[0] * 60, at[1] - dir[1] * 60, -dir[2] * 60], dir);
    if (!h) throw new Error(`${node.name}: eye ray missed at ${at}`);
    return h;
  });
  node.mesh((m) => hits.forEach((h) => disc(m, colour, h.p, h.n, size / 2)));
}

// A flat folded ear standing on the head; its root is dropped onto the head surface (never floats).
export function ear(m, headPts, M, inner, a, b, tip, out) {
  const cx = headPts.reduce((q, p) => q + p[0], 0) / headPts.length;
  const seat = ([x, , z]) => {
    for (let k = 1; k > 0.05; k -= 0.05) {
      const px = cx + (x - cx) * (0.3 + 0.7 * k), pz = z * k, h = surf(headPts, [px, 400, pz], [0, -1, 0]);
      if (h) return [px, h.p[1] - 2, pz];
    }
    throw new Error('ear root misses the head');
  };
  const [a2, b2] = [seat(a), seat(b)];
  spike(m, M, a2, b2, tip, out, 1.4);
  if (!inner) return;
  let n = V.norm(V.cross(V.sub(b2, a2), V.sub(tip, a2)));
  if (n[0] < 0) n = V.mul(n, -1);
  const mid = lerp(a2, b2, 0.5), lift = (p) => V.add(p, V.mul(n, 1.1));
  plate(m, inner, [lerp(lerp(a2, b2, 0.22), tip, 0.18), lerp(lerp(a2, b2, 0.78), tip, 0.18), lerp(mid, tip, 0.78)].map(lift), 0.8);
}

// A flat coloured decal seated on a convex hull: `shape` is a list of [x, y] points, projected onto the
// surface from the side (z sign), lifted 0.5 mm and given a little thickness (stripes, eye patches, masks).
export function patch(m, colour, hullPts, side, shape, th = 0.7, lift = 0.5) {
  const cx = shape.reduce((a, p) => a + p[0], 0) / shape.length, cy = shape.reduce((a, p) => a + p[1], 0) / shape.length;
  const pts = shape.map(([x, y]) => { // points falling outside the silhouette slide towards the patch centre
    for (let t = 0; t < 0.96; t += 0.08) {
      const h = surf(hullPts, [x + (cx - x) * t, y + (cy - y) * t, side * 80], [0, 0, -side]);
      if (h) return V.add(h.p, V.mul(h.n, lift));
    }
    return null;
  });
  if (pts.some((p) => !p)) { console.warn(`  ! patch misses the hull near ${cx.toFixed(1)},${cy.toFixed(1)} (skipped)`); return; }
  plate(m, colour, pts, th);
}

function anchorsAt(rig, flag, top) {
  rig.find('body').anchorAt('flag_anchor', flag);
  rig.root.anchorAt('label_anchor', [0, top, 0]);
}

// Head with muzzle trim, nose, eyes and ears. `hp` is the head pivot in model space.
// c.face: a FACES key or face object; c.ear: { kind: point | long | round | flop | none, h, x, z, spread, lean, inner }.
function buildHead(body, k, hp, c) {
  const { M, T, A } = k;
  const face = typeof c.face === 'string' ? FACES[c.face] : c.face ?? FACES.fox;
  const h = faceHead(hp, { ...face, ...(c.faceMod ?? {}) });
  const head = body.add('head', [hp[0], hp[1], 0]);
  const s = h.f.s;
  const HM = c.headMain ? c.headMain + '*' : M;
  const muzzleTrim = c.muzzle ?? (h.f.ml > 2);
  head.mesh((m) => {
    m.hull(HM, h.pts);
    if (muzzleTrim) faceTrim(m, T, h);
    if (c.nose !== false) { // the nose sits on whatever face is at the front of the snout
      const f = surf(h.pts, [h.tip[0] + 60, h.tip[1] + h.f.mh * Math.max(h.f.taper, 0.2) * 0.25 * s, 0], [-1, 0, 0]);
      if (f) disc(m, c.noseColour ?? 'ink', f.p, f.n, 1.7 * s * (c.noseSize ?? 1), 1.3 * s * (c.noseSize ?? 1));
    }
  });
  seatEyes(head, h.pts, c.eyeAt ?? h.eyeAt, { size: 4.2 * s * (c.eyeSize ?? 1), colour: c.eyeColour ?? 'ink', tilt: c.eyeTilt ?? [0, 0, 1] });
  const e = c.ear;
  if (e && e.kind !== 'none') {
    const kind = e.kind ?? 'point', ex = e.x ?? -2, ez = e.z ?? h.f.hw * 0.28, eh = e.h ?? 10;
    both((sd) => {
      const root = h.P(ex, h.f.hh * 0.5, sd * ez);
      head.add(sd > 0 ? 'ear_l' : 'ear_r', root).mesh((m) => {
        const a = h.P(ex - (e.w ?? 5) * 0.55, 0, sd * (ez - 1.8)), b = h.P(ex + (e.w ?? 5) * 0.45, 0, sd * (ez + 1.4));
        const topY = h.P(0, h.f.hh * 0.5 + (h.f.dome ?? 0) + eh)[1];
        if (kind === 'point' || kind === 'long') {
          ear(m, h.pts, HM, e.inner === undefined ? A : e.inner, a, b, [h.P(ex + (e.lean ?? -1), 0)[0], topY, sd * (e.spread ?? ez + 2) * s], [e.out ?? 0.6, 0, sd * 1.4]);
        } else if (kind === 'flop') { // folded over forwards and out, like a pig or a hound
          ear(m, h.pts, HM, null, a, b, [h.P(ex + eh * 0.8, 0)[0], h.P(0, h.f.hh * 0.5 + eh * 0.2)[1], sd * (e.spread ?? ez + eh * 0.6) * s], [0, 1.4, sd * 0.8]);
        } else if (kind === 'side') { // big flat ear lying against the side of the head (elephant, mammoth)
          const zc = sd * (h.f.hw * 0.5 * (h.f.cheek ?? 1) * s + 0.8), cx = h.P(ex, 0)[0], cy = h.P(0, e.y ?? 0)[1], r = eh * s;
          const fan = [...Array(7).keys()].map((i) => { const t = -Math.PI * 0.6 + Math.PI * 1.25 * (i / 6); return [cx - Math.cos(t) * r * 0.75 - r * 0.3, cy + Math.sin(t) * r, zc + sd * (1 - Math.cos(t)) * r * 0.25]; });
          plate(m, HM, [[cx + 1, cy + r * 0.7, zc - sd * 0.8], ...fan, [cx + 1, cy - r * 0.5, zc - sd * 0.8]], 1.6);
          if (e.inner) plate(m, e.inner, fan.slice(1, 6).map((p) => [cx - 1 + (p[0] - cx) * 0.6, cy + (p[1] - cy) * 0.6, p[2] + sd * 0.9]), 0.6);
        } else if (kind === 'round') { // short rounded ear: a fan of flat facets standing on the crown
          const cx = h.P(ex, 0)[0], seatY = seatTop(h.pts, cx, sd * ez * s), r = eh * s, zc = sd * (e.spread ?? ez) * s;
          const arc = [...Array(6).keys()].map((i) => { const t = Math.PI * (i / 5); return [cx - Math.cos(t) * r * 0.8, seatY - 1.5 + Math.sin(t) * r, zc]; });
          plate(m, HM, arc, 1.6);
          if (e.inner !== null && (e.inner ?? A)) plate(m, e.inner ?? A, [...Array(5).keys()].map((i) => { const t = Math.PI * (0.1 + 0.8 * i / 4); return [cx + 0.9 - Math.cos(t) * r * 0.5, seatY - 0.5 + Math.sin(t) * r * 0.62, zc + sd * 0.1]; }).map((p) => [p[0] + 0.9, p[1], p[2]]), 0.6);
        }
      });
    });
  }
  h.front = (y, z = 0) => surf(h.pts, [h.tip[0] + 80, y, z], [-1, 0, 0]);
  return { head, h };
}

// A flat decal on the front (+x) of a hull: shape points are [y, z], projected along -x.
export function frontPatch(m, colour, hullPts, shape, th = 0.7) {
  const pts = shape.map(([y, z]) => { const h = surf(hullPts, [400, y, z], [-1, 0, 0]); return h && V.add(h.p, V.mul(h.n, 0.45)); });
  if (pts.some((p) => !p)) return;
  plate(m, colour, pts, th);
}

// The paper turned over under the muzzle: the lower half of the muzzle block, a hair proud of it.
export function faceTrim(m, T, h) {
  const { mw, mh, taper } = h.f, tw = Math.max(taper, 0.2), e = 0.35;
  const x0 = h.xf - 1.5, x1 = h.tipX + e, z0 = mw / 2 + e, z1 = mw * tw / 2 + e;
  m.hull(T, [[x0, h.my - mh / 2 - e, z0], [x0, h.my, z0], [x1, h.ty - mh * tw / 2 - e, z1], [x1, h.ty, z1]].flatMap(([x, y, z]) => [h.P(x, y, z), h.P(x, y, -z)]));
}

// Round nose on the front face of the muzzle.
export function faceNose(m, colour, h, size = 1) {
  const s = h.f.s, f = surf(h.pts, [h.tip[0] + 60, h.tip[1] + h.f.mh * Math.max(h.f.taper, 0.2) * 0.25 * s, 0], [-1, 0, 0]);
  if (f) disc(m, colour, f.p, f.n, 1.7 * s * size, 1.3 * s * size);
}

// Height of the top of a hull at (x, z), for seating parts on it.
function seatTop(pts, x, z) {
  for (let k = 1; k > 0.05; k -= 0.05) { const hit = surf(pts, [x, 400, z * k], [0, -1, 0]); if (hit) return hit.p[1]; }
  throw new Error('nothing to sit on');
}

function buildTail(body, k, t, { x0, yt, yb }) {
  if (!t || t.kind === 'none') return null;
  const { T } = k, L = t.len ?? 20, M = t.colour ?? k.M;
  const tail = body.add('tail', [x0 + 2, yt - 6, 0]);
  tail.mesh((m) => {
    if (t.kind === 'brush') {
      spike(m, M, [x0 + 3, yt - 2, 0], [x0 + 1, yt - 12, 0], [x0 - L, yt + (t.up ?? 8), 0], [-1, 0, t.w ?? 5]);
      if (t.tip) spike(m, T, lerp([x0 + 3, yt - 2, 0], [x0 - L, yt + (t.up ?? 8), 0], 0.62), lerp([x0 + 1, yt - 12, 0], [x0 - L, yt + (t.up ?? 8), 0], 0.62), [x0 - L, yt + (t.up ?? 8), 0], [0, 0, (t.w ?? 5) * 0.4 + 0.6], 1);
    } else if (t.kind === 'whip') {
      spike(m, M, [x0 + 3, yt - 6, 0], [x0 + 2, yt - 12, 0], [x0 - L * 0.7, yb + (t.drop ?? 4), 0], [-1, 0, t.w ?? 1.8], 1.2);
    } else if (t.kind === 'up') {
      spike(m, M, [x0 + 2, yt - 8, 0], [x0 + 1, yt - 14, 0], [x0 - L * 0.5, yt - 10 + L * 0.35, 0], [0, 0, 2.4], 1.4);
      spike(m, M, [x0 - L * 0.4, yt - 12 + L * 0.3, 0], [x0 - L * 0.5, yt - 8 + L * 0.35, 0], [x0 - L * 0.3, yt + L * 0.8, 0], [0, 0, 2.2], 1.4);
    } else if (t.kind === 'stub') {
      spike(m, M, [x0 + 2, yt - 4, 0], [x0 + 1, yt - 10, 0], [x0 - L, yt - 2, 0], [-0.5, 0, 2]);
    } else if (t.kind === 'paddle') { // beaver: flat wide tail lying behind
      const y = yb + 1.5;
      plate(m, M, [[x0 + 2, y + 4, 4], [x0 + 2, y + 4, -4], [x0 - L, y, -t.w], [x0 - L, y, t.w]], 1.8);
    }
  });
  return tail;
}

// ---------------------------------------------------------------- four-legged walkers
// c: { main, trim, accent, L, Hb, legH, W, legW, head:{}, ear:{}, tail:{}, chest, extra }
export function quad(rig, c) {
  const k = cols(c);
  const { M, T } = k;
  const L = c.L ?? 34, Hb = c.Hb ?? 18, legH = c.legH ?? 19, W = c.W ?? 9.5, lw = c.legW ?? 4, lz = c.legZ ?? 1.8;
  const x0 = -L / 2 - (c.shift ?? 0), x1 = L / 2 - (c.shift ?? 0), yb = legH, yt = legH + Hb;
  const back = c.back ?? 0.06; // how much the rump ridge sinks
  const body = rig.root.add('body', [0, yb, 0]);
  const bodyPts = [
    [x1 - L * 0.16, yt, 0], [x0 + L * 0.2, yt - Hb * back * 2, 0], [x0 - 2, yb + Hb * 0.55, 0],
    [x0 + 2, yb - 1, W * 0.75], [x0 + 2, yb - 1, -W * 0.75], [x1 - 1, yb - 1, W * 0.9], [x1 - 1, yb - 1, -W * 0.9],
    [(x0 + x1) / 2 - L * 0.05, yb + Hb * 0.55, W * 1.18], [(x0 + x1) / 2 - L * 0.05, yb + Hb * 0.55, -W * 1.18],
    [x1 + (c.chestOut ?? 1), yb + Hb * 0.62, 0], [(x0 + x1) / 2, yb - 2, 0],
  ];
  if (c.barrel) { // round belly: fuller flanks and a flat broad back, like a pig, hippo or beaver
    const b = c.barrel;
    for (const x of [x0 + L * 0.18, x1 - L * 0.2]) bodyPts.push([x, yb + Hb * 0.5, W * (1 + 0.2 * b)], [x, yb + Hb * 0.5, -W * (1 + 0.2 * b)], [x, yt - Hb * 0.05, W * 0.55 * b], [x, yt - Hb * 0.05, -W * 0.55 * b], [x, yb - 1.5, W * 0.6], [x, yb - 1.5, -W * 0.6]);
  }
  body.mesh((m) => {
    m.hull(M, bodyPts);
    if (c.chest !== false) m.hull(T, [[x1 - L * 0.16, yt, 0], [x1 - 1, yb - 1, W * 0.86], [x1 - 1, yb - 1, -W * 0.86], [x1 + (c.chestOut ?? 1) + (c.chestTrim ?? 8), yb + Hb * 0.34, 0]]);
    if (c.belly) m.hull(T, [[x0 + 4, yb - 1.2, W * 0.6], [x0 + 4, yb - 1.2, -W * 0.6], [x1 - 2, yb - 1.2, W * 0.7], [x1 - 2, yb - 1.2, -W * 0.7], [(x0 + x1) / 2, yb - 2.4, 0], [(x0 + x1) / 2, yb + Hb * 0.4, W * 1.0], [(x0 + x1) / 2, yb + Hb * 0.4, -W * 1.0]]);
  });
  const hp = [x1 + (c.headX ?? 4), yt + (c.headY ?? 2)];
  const { head, h } = buildHead(body, k, hp, c);
  const tail = buildTail(body, k, c.tail ?? { kind: 'brush' }, { x0, yt, yb });
  const legs = [];
  for (const [n, x, z] of [['leg_fl', x1 - 4, 1], ['leg_fr', x1 - 4, -1], ['leg_bl', x0 + 5, 1], ['leg_br', x0 + 5, -1]]) {
    const zz = z * W * 0.97, front = x > 0;
    legs.push(n);
    body.add(n, [x, yb, zz]).mesh((m) => flapLeg(m, M, [x - lw, yb + 1, zz], [x + lw, yb + 1, zz], [x + (front ? 1.5 : -1) * (c.legSplay ?? 1), 0, zz * 1.05], [0, 0, z * lz], c.footW ?? 3));
  }
  const ctx = { rig, body, head, h, k, M, T, A: k.A, x0, x1, yb, yt, hp, W, L, Hb, legH, bodyPts, legs };
  c.extra?.(ctx);
  anchorsAt(rig, [(x0 + x1) / 2, yt + 1, 0], hp[1] + 10 + (c.ear?.kind === 'none' ? 0 : c.ear?.h ?? 0) + 6 + (c.topExtra ?? 0));
  const ears = c.ear && c.ear.kind !== 'none' ? ['ear_l', 'ear_r'] : [];
  creatureClips(rig, { head: 'head', tail: tail ? 'tail' : null, legs, ears, hopHeight: c.hop ?? 12, tailAxis: c.tail?.kind === 'brush' ? 'y' : 'z' });
  return ctx;
}

// ---------------------------------------------------------------- sitting animals (squirrel, rabbit, fox, cat, meerkat)
// A seated pyramid body (like the Foldlings rabbit), a chest bib, a pyramid head and folded arms.
// c: { H, kx, ky, Bw, head, ear, tail, extra, arms }
export function sitter(rig, c) {
  const k = cols(c);
  const { M, T } = k;
  const H = c.H ?? 34, kx = c.kx ?? 1, Bw = c.Bw ?? 10;
  const x0 = -19 * kx, x1 = 7 * kx, xm = (x0 + x1) / 2;
  // Seated body from rings of flat facets: a wide base, a belly ring (`belly` = how round), narrow shoulders.
  const belly = c.belly ?? 1.15, shoulder = c.shoulder ?? 0.55, lean = c.lean ?? 0.3;
  const ring = (y, rx, rz, cx) => [[cx + rx, y, 0], [cx + rx * 0.5, y, rz], [cx + rx * 0.5, y, -rz], [cx - rx * 0.5, y, rz], [cx - rx * 0.5, y, -rz], [cx - rx, y, 0]];
  const bodyPts = [
    ...ring(0.8, (x1 - x0) / 2, Bw, xm),
    ...ring(H * 0.4, (x1 - x0) / 2 * belly, Bw * belly, xm + 1),
    ...ring(H * 0.82, (x1 - x0) / 2 * shoulder, Bw * shoulder * 1.1, xm + (x1 - xm) * lean + 2),
    [xm + (x1 - xm) * lean + 3, H + 1, 0],
  ];
  const body = rig.root.add('body', [0, H / 2, 0]);
  body.mesh((m) => {
    m.hull(M, bodyPts);
    if (c.bib !== false) { // the white chest where the paper turns over: a long diamond down the front
      const bw = Bw * (c.bibW ?? 0.45);
      frontPatch(m, T, bodyPts, [[H * 0.84, 0], [H * 0.5, bw], [H * 0.08, 0], [H * 0.5, -bw]]);
    }
  });
  const hp = [xm + (x1 - xm) * lean + 5 + (c.headX ?? 0), H + 4 + (c.headY ?? 0)];
  const { head, h } = buildHead(body, k, hp, c);
  const tail = buildTail(body, k, c.tail ?? { kind: 'ball' }, { x0: x0 - 1, yt: H * 0.5, yb: 0 });
  if (c.tail?.kind === 'ball') {
    const t = body.add('tail', [x0 - 2, H * 0.3, 0]);
    t.mesh((m) => m.hull(c.tail.trim ? T : M, blob([x0 - 3 * kx, H * 0.3, 0], 5.5, 5.5, 5.5, 10)));
  }
  const legs = [];
  const hz = Bw * belly * 0.9, hx = xm - (x1 - x0) * 0.15, hh = H * (c.haunch ?? 0.62), foot = c.foot ?? 1;
  const xa = xm + 1 + (x1 - x0) / 2 * belly * 0.8, ya = H * (c.armY ?? 0.62), armEnd = c.armEnd ?? 0;
  both((s) => {
    // folded haunch and a long flat hind foot
    const n = s > 0 ? 'leg_bl' : 'leg_br';
    legs.push(n);
    body.add(n, [hx, hh * 0.5, s * hz]).mesh((m) => {
      spike(m, M, [hx - 9 * kx, 1.5, s * hz], [hx + 9 * kx, 1, s * hz], [hx - 2 * kx, hh, s * (hz + 0.5)], [0, 0, s * 2.4], 1.6);
      const fx0 = hx - 6 * kx, fx1 = hx + 12 * kx * foot;
      m.hull(M, [[fx0, 0, s * (hz - 2)], [fx0, 0, s * (hz + 3)], [fx1, 0, s * (hz + 0.5)], [fx0, 2, s * (hz - 2)], [fx0, 2, s * (hz + 3)], [fx1, 1.4, s * (hz + 0.5)]]);
    });
    if (c.arms !== false) {
      const an = s > 0 ? 'leg_fl' : 'leg_fr';
      legs.push(an);
      body.add(an, [xa, ya, s * Bw * 0.4]).mesh((m) => flapLeg(m, M, [xa - 3, ya + 1, s * Bw * 0.42], [xa + 3, ya + 1, s * Bw * 0.42], [xa + 3, armEnd, s * Bw * 0.45], [0, 0, s * 1.4], 2.6));
    }
  });
  const ctx = { rig, body, head, h, k, M, T, A: k.A, x0, x1, xm, hp, H, Bw, bodyPts };
  c.extra?.(ctx);
  anchorsAt(rig, [x0, H, 0], hp[1] + 10 + (c.ear?.kind === 'none' ? 0 : c.ear?.h ?? 0) + 6);
  const ears = c.ear && c.ear.kind !== 'none' ? ['ear_l', 'ear_r'] : [];
  creatureClips(rig, { head: 'head', tail: tail || c.tail?.kind === 'ball' ? 'tail' : null, legs, ears, hopHeight: c.hop ?? 14, tailAxis: 'z' });
  return ctx;
}

// ---------------------------------------------------------------- birds
// Standing bird: a tilted wedge body, small head with a beak, a flat tail, a folded wing and two rods for legs.
// c: { main, trim, accent, bodyL, bodyH, legH, legLen, tilt, head:{s}, beak:{len,h,colour,curve}, tail:{len,w,up},
//      wing:{len,kind}, neck:{len,curve}, crest, extra, legColour }
export function bird(rig, c) {
  const k = cols(c);
  const { M, T, A } = k;
  const bl = c.bodyL ?? 30, bh = c.bodyH ?? 22, legH = c.legH ?? 10, tilt = c.tilt ?? 0.55; // tilt: how far the breast leads the tail
  const yb = legH, yt = legH + bh;
  const x1 = bl * 0.36, x0 = -bl * 0.64;
  const w = c.W ?? 9;
  const body = rig.root.add('body', [0, yb, 0]);
  const bodyPts = [
    [x1, yb + bh * 0.62, 0], [x1 - bl * 0.35, yt, 0], [x0 + bl * 0.22, yb + bh * 0.72, 0], [x0, yb + bh * 0.42, 0],
    [-bl * 0.05, yb - 0.5, 0], [x1 - bl * 0.28, yb + bh * 0.16, w * 0.55], [x1 - bl * 0.28, yb + bh * 0.16, -w * 0.55],
    [-bl * 0.08, yb + bh * 0.62, w], [-bl * 0.08, yb + bh * 0.62, -w],
  ];
  body.mesh((m) => {
    m.hull(M, bodyPts);
    if (c.belly !== false) m.hull(T, [[x1, yb + bh * 0.62, 0], [x1 - bl * 0.3, yb + bh * 0.16, w * 0.5], [x1 - bl * 0.3, yb + bh * 0.16, -w * 0.5], [-bl * 0.05, yb - 1, 0], [x1 - bl * 0.12, yb + bh * 0.42, w * 0.86], [x1 - bl * 0.12, yb + bh * 0.42, -w * 0.86], [-bl * 0.1, yb + bh * 0.35, 0]]);
  });
  // neck + head
  const hs = c.head?.s ?? 1, nl = c.neck?.len ?? 0;
  const hb = [x1 - bl * 0.1 + (c.headX ?? 0), yb + bh * 0.85 + nl * (c.neck?.up ?? 1) + (c.headY ?? 0)];
  const neck = nl > 0 ? body.add('neck', [x1 - bl * 0.12, yb + bh * 0.7, 0]) : body;
  if (nl > 0) {
    const base = [x1 - bl * 0.14, yb + bh * 0.7, 0], mid = [hb[0] - (c.neck.curve ?? 5), yb + bh * 0.7 + nl * 0.5, 0];
    neck.mesh((m) => { const nc = c.neck.colour ?? M; stick(m, nc, base, mid, c.neck.r ?? 2.2); stick(m, nc, mid, [hb[0], hb[1] - 2, 0], c.neck.r ?? 2.2); });
  }
  const head = neck.add('head', [hb[0], hb[1], 0]);
  const hpts = [[hb[0] - 2 * hs, hb[1] + 4.5 * hs, 0], [hb[0] + 4.5 * hs, hb[1] + 2 * hs, 0], [hb[0] - 1 * hs, hb[1] - 1 * hs, 4.4 * hs * (c.head?.wide ?? 1)], [hb[0] - 1 * hs, hb[1] - 1 * hs, -4.4 * hs * (c.head?.wide ?? 1)], [hb[0] + 1.5 * hs, hb[1] - 4.5 * hs, 0], [hb[0] + 5 * hs, hb[1] - 2 * hs, 0]];
  const bk = c.beak ?? {}, bc = bk.colour ?? A;
  const HM = c.headMain ? c.headMain + '*' : M;
  head.mesh((m) => {
    m.hull(HM, hpts);
    if (c.faceTrim) m.hull(T, [[hb[0] + 1.5 * hs, hb[1] - 4.4 * hs, 0], [hb[0] + 1 * hs, hb[1] - 2.2 * hs, 3.9 * hs], [hb[0] + 1 * hs, hb[1] - 2.2 * hs, -3.9 * hs], [hb[0] + 5 * hs, hb[1] - 2 * hs, 0], [hb[0] + 0.5 * hs, hb[1] - 4 * hs, 0]]);
    // beak: a small folded wedge pointing forward
    const bx = hb[0] + 4.6 * hs, by = hb[1] - 1.4 * hs, bL = (bk.len ?? 5) * hs, bH = (bk.h ?? 2.4) * hs;
    m.hull(bc, [[bx, by + bH * 0.5, 0], [bx, by - bH * 0.5, bH * 0.6], [bx, by - bH * 0.5, -bH * 0.6], [bx + bL, by - bH * (bk.curve ?? 0.4), 0]]);
    if (bk.lower !== false && bk.len !== 0) m.hull(bc, [[bx, by - bH * 0.5, bH * 0.5], [bx, by - bH * 0.5, -bH * 0.5], [bx + bL * 0.8, by - bH * (bk.curve ?? 0.4) - 0.2, 0], [bx, by - bH * 1.1, 0]]);
  });
  const eh = surf(hpts, [hb[0] + 1.5 * hs, hb[1] + 0.8 * hs, 60], [0, 0, -1]);
  const eh2 = surf(hpts, [hb[0] + 1.5 * hs, hb[1] + 0.8 * hs, -60], [0, 0, 1]);
  head.mesh((m) => [eh, eh2].forEach((e) => e && disc(m, c.eyeColour ?? 'ink', e.p, e.n, (c.eye ?? 1.5) * hs)));
  if (c.crest) {
    head.mesh((m) => spike(m, c.crest.colour ?? M, [hb[0] - 3 * hs, hb[1] + 3.6 * hs, 0], [hb[0] + 1 * hs, hb[1] + 4.6 * hs, 0], [hb[0] - (c.crest.back ?? 6) * hs, hb[1] + (c.crest.h ?? 9) * hs, 0], [0, 0, c.crest.w ?? 1.6], 1.2));
  }
  // tail
  const tl = c.tail?.len ?? 14;
  const tail = body.add('tail', [x0 + 2, yb + bh * 0.5, 0]);
  tail.mesh((m) => {
    const tc = c.tail?.colour ?? M, tw = c.tail?.w ?? 3.6, ty = yb + bh * (c.tail?.tipY ?? 0.15) + (c.tail?.up ?? 0);
    if (c.tail?.fork) both((sd) => spike(m, tc, [x0 + bl * 0.16, yb + bh * 0.62, sd * 0.3], [x0 + bl * 0.05, yb + bh * 0.3, sd * 0.3], [x0 - tl, ty, sd * c.tail.fork], [-1, 0, sd * tw * 0.6], 1.2));
    else spike(m, tc, [x0 + bl * 0.16, yb + bh * 0.66, 0], [x0 + bl * 0.05, yb + bh * 0.26, 0], [x0 - tl, ty, 0], [-1, 0, tw], 1.3);
  });
  // wings: folded along the flank, or open (flight / display) as two folded triangles per side
  const wl = c.wing?.len ?? bl * 0.5;
  if (c.wing?.open) both((s) => {
    const o = c.wing.open, wx = x1 - bl * 0.32, wy = yb + bh * 0.78;
    body.add(s > 0 ? 'wing_l' : 'wing_r', [wx, wy, s * 2]).mesh((m) => {
      const f = [wx + (o.front ?? 8), wy, s * 2], b = [wx - (o.back ?? 10), wy - 1, s * 2], mid = [wx - 1, wy + 2.4, s * 3.5];
      const tip = [wx - (o.sweep ?? 8), wy + (o.up ?? 4), s * (o.span ?? 34)];
      plate(m, c.wing.colour ?? M, [f, mid, tip], 1.4);
      plate(m, c.wing.colour2 ?? c.wing.colour ?? M, [b, mid, tip], 1.4);
      if (o.trim) plate(m, T, [lerp(f, tip, 0.5).map((v, i) => v + [0, -1.4, 0][i]), lerp(b, tip, 0.5).map((v, i) => v + [0, -1.4, 0][i]), [tip[0], tip[1] - 1.2, tip[2]]], 1);
    });
  }); else both((s) => {
    body.add(s > 0 ? 'wing_l' : 'wing_r', [x1 - bl * 0.3, yb + bh * 0.7, s * w * 0.9]).mesh((m) => {
      const z = s * (w * 0.9 + 1.2), zt = s * (w * 0.75);
      plate(m, c.wing?.colour ?? M, [[x1 - bl * 0.28, yb + bh * 0.82, z], [x1 - bl * 0.22, yb + bh * 0.28, z], [x1 - bl * 0.28 - wl, yb + bh * 0.4 + (c.wing?.tip ?? 0), zt]], 1.3);
      if (c.wing?.trim) plate(m, T, [[x1 - bl * 0.3, yb + bh * 0.58, z + s * 0.4], [x1 - bl * 0.26, yb + bh * 0.34, z + s * 0.4], [x1 - bl * 0.3 - wl * 0.8, yb + bh * 0.42 + (c.wing?.tip ?? 0), zt + s * 0.3]], 0.9);
    });
  });
  // legs: two rods and a flat triangular foot
  const legs = [];
  if (legH > 0.5 && !c.float) both((s) => {
    const n = s > 0 ? 'leg_l' : 'leg_r', zz = s * (c.legZ ?? 3.4), lx = c.legX ?? -bl * 0.02, lc = c.legColour ?? A;
    legs.push(n);
    body.add(n, [lx, yb, zz]).mesh((m) => {
      stick(m, lc, [lx, yb + 1, zz], [lx + (c.legLean ?? 0), 1, zz], c.legR ?? 0.9);
      plate(m, lc, [[lx - 1.5 + (c.legLean ?? 0), 0.5, zz - 1.6], [lx - 1.5 + (c.legLean ?? 0), 0.5, zz + 1.6], [lx + (c.footLen ?? 5) + (c.legLean ?? 0), 0.5, zz]], 0.9);
    });
  });
  const ctx = { rig, body, head, k, M, T, A, x0, x1, hb, bl, bh, yb, yt, hs, w, hpts };
  c.extra?.(ctx);
  anchorsAt(rig, [-bl * 0.1, yt + 1, 0], hb[1] + (c.crest?.h ?? 0) * hs + 8 * hs + (c.topExtra ?? 0));
  creatureClips(rig, { head: 'head', tail: 'tail', wings: ['wing_l', 'wing_r'], legs, hopHeight: c.hop ?? 10, tailAxis: 'z' });
  return ctx;
}

// ---------------------------------------------------------------- flying and swimming forms (hover above the table)
// Wings flap around the x axis, as for `paper_bird`.
export function flapClip(rig, amp = 30) {
  rig.clip('flap', [
    { node: 'wing_l', path: 'rotation', keys: [[0, [-amp, 0, 0]], [0.2, [amp, 0, 0]], [0.4, [-amp, 0, 0]]] },
    { node: 'wing_r', path: 'rotation', keys: [[0, [amp, 0, 0]], [0.2, [-amp, 0, 0]], [0.4, [amp, 0, 0]]] },
    { node: 'body', path: 'translation', keys: [[0, [0, 1.5, 0]], [0.2, [0, -1.5, 0]], [0.4, [0, 1.5, 0]]] },
  ]);
}

// ---------------------------------------------------------------- swimmers (shark, whale, pufferfish): float 1 cm above the table
// c: { main, trim, accent, L, H, W, y, snout, dorsal:{h,x,len,back}, tailUp, tailDown, fin:{len,drop}, eye }
export function swimmer(rig, c) {
  const k = cols(c);
  const { M, T } = k;
  const L = c.L ?? 60, H = c.H ?? 22, W = c.W ?? 9, y = c.y ?? 28, sn = c.snout ?? 8;
  const x1 = L * 0.5, x0 = -L * 0.5;
  const body = rig.root.add('body', [0, y, 0]);
  const bodyPts = [
    [x1 + sn, y - H * 0.05, 0], [x1 - L * 0.16, y + H * 0.5, W * 0.45], [x1 - L * 0.16, y + H * 0.5, -W * 0.45],
    [x1 - L * 0.12, y - H * 0.45, W * 0.5], [x1 - L * 0.12, y - H * 0.45, -W * 0.5],
    [L * 0.1, y + H * 0.55, W * 0.95], [L * 0.1, y + H * 0.55, -W * 0.95], [L * 0.05, y - H * 0.5, W * 0.9], [L * 0.05, y - H * 0.5, -W * 0.9],
    [x0 + L * 0.12, y + H * 0.25, 0], [x0 + L * 0.12, y - H * 0.2, 0], [x0, y + H * 0.05, 0],
  ];
  body.mesh((m) => {
    m.hull(M, bodyPts);
    if (c.belly !== false) m.hull(T, [[x1 + sn - 0.6, y - H * 0.12, 0], [x1 - L * 0.12, y - H * 0.46, W * 0.48], [x1 - L * 0.12, y - H * 0.46, -W * 0.48], [L * 0.05, y - H * 0.51, W * 0.86], [L * 0.05, y - H * 0.51, -W * 0.86], [x0 + L * 0.14, y - H * 0.2, 0], [L * 0.05, y - H * 0.08, W * 0.98], [L * 0.05, y - H * 0.08, -W * 0.98], [x1 - L * 0.1, y - H * 0.16, W * 0.5], [x1 - L * 0.1, y - H * 0.16, -W * 0.5]]);
  });
  const d = c.dorsal;
  if (d) body.mesh((m) => plate(m, d.colour ?? M, [[d.x + d.len * 0.4, y + H * 0.5, 0], [d.x - d.len * 0.6, y + H * 0.5, 0], [d.x - (d.back ?? 6), y + H * 0.5 + d.h, 0]], 2));
  const eyeAt = [x1 - L * 0.08, y + H * 0.14];
  const eh = [1, -1].map((sd) => surf(bodyPts, [eyeAt[0], eyeAt[1], sd * 60], [0, 0, -sd]));
  body.mesh((m) => eh.forEach((e) => e && disc(m, 'ink', e.p, e.n, (c.eye ?? 2) )));
  const tail = body.add('tail', [x0 + L * 0.1, y, 0]);
  tail.mesh((m) => {
    const tx = x0 + L * 0.1;
    plate(m, c.tailColour ?? M, [[tx, y + H * 0.15, 0], [x0 - (c.tailBack ?? 6), y + (c.tailUp ?? 16), 0], [x0 + (c.tailNotch ?? 6), y, 0]], 2.2);
    plate(m, c.tailColour2 ?? c.tailColour ?? M, [[tx, y - H * 0.1, 0], [x0 - (c.tailBack ?? 6) * 0.6, y - (c.tailDown ?? 12), 0], [x0 + (c.tailNotch ?? 6), y, 0]], 2.2);
  });
  const fins = [];
  both((sd) => {
    const n = sd > 0 ? 'fin_l' : 'fin_r';
    fins.push(n);
    const f = c.fin ?? {};
    body.add(n, [x1 - L * 0.32, y - H * 0.3, sd * W * 0.85]).mesh((m) => plate(m, f.colour ?? M, [[x1 - L * 0.28, y - H * 0.28, sd * W * 0.85], [x1 - L * 0.4, y - H * 0.24, sd * W * 0.9], [x1 - L * 0.4 - (f.len ?? 10), y - H * 0.3 - (f.drop ?? 8), sd * (W + (f.out ?? 9))]], 1.8));
  });
  const ctx = { rig, body, k, M, T, A: k.A, L, H, W, y, x0, x1, bodyPts };
  c.extra?.(ctx);
  anchorsAt(rig, [0, y + H * 0.5, 0], y + H * 0.5 + (c.dorsal?.h ?? 0) + 8);
  creatureClips(rig, { head: null, tail: 'tail', fins, floating: true, hopHeight: 8 });
  return ctx;
}

export { anchorsAt, buildHead, buildTail, lerp };
