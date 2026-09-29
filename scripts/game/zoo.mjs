// Origami animals modelled on the two reference books (docs/ORIGAMI_ANIMALS.md): flat planes, a white
// underside colour where the paper turns over, plain round eyes, no ink outline. Millimetres, head to +x.
import { plate, spike, flapLeg, blob, disc, surf, V } from '../lib/origami.mjs';
import { quad, sitter, bird, swimmer, both, patch, frontPatch, stick, band, lerp, flapClip, cols, FACES } from '../lib/zoo.mjs';
import { creatureClips } from '../lib/clips.mjs';

const ASSET = (name, sheet, build, notes) => ({ name: 'origami_' + name, dir: 'origami-animals', category: 'origami_animals', sheet, build, notes });

// A tail made of a few flat folded planes that arch over: root (x, y) up to a knee and back over towards the head.
function archTail(ctx, { colour, tipColour, x = ctx.x0 + 1, y = 8, up = 28, out = 12, over = 6, w = 6 } = {}) {
  const { body, M, T } = ctx;
  const t = body.add('tail', [x, y, 0]);
  t.mesh((m) => {
    const c = colour ?? M;
    spike(m, c, [x + 3, y - 3, 0], [x + 2, y + 9, 0], [x - out, y + up, 0], [-1, 0, w]);
    spike(m, c, [x - out * 0.6, y + up * 0.5, 0], [x - out * 0.9, y + up * 0.72, 0], [x + over, y + up * 1.45, 0], [0, 0, w * 0.8]);
    if (tipColour) spike(m, tipColour, lerp([x - out * 0.6, y + up * 0.5, 0], [x + over, y + up * 1.45, 0], 0.7), lerp([x - out * 0.9, y + up * 0.72, 0], [x + over, y + up * 1.45, 0], 0.7), [x + over, y + up * 1.45, 0], [0, 0, w * 0.5], 1);
  });
  return t;
}

// Nose pad on the flat front of a square muzzle (pig, hippo): a disc with two nostrils.
function snoutPad(ctx, colour, { r = 4.6, ry = 3.8, nostril = 0.9, gap = 1.9, dy = 0 } = {}) {
  const { h, head } = ctx;
  head.mesh((m) => {
    const f = h.front(h.tip[1] + dy);
    if (!f) return;
    if (colour) disc(m, colour, f.p, f.n, r, ry, { h: 1.4 });
    [gap, -gap].forEach((z) => disc(m, 'ink', V.add(V.add(f.p, [0, 0, z]), V.mul(f.n, colour ? 1.5 : 0)), f.n, nostril, nostril * 1.2));
  });
}
// Two flat front teeth hanging under the muzzle tip (beaver).
function teeth(ctx, colour = 'paper') {
  const { h, head } = ctx, x = h.tipX - 1.2, y = h.ty - h.f.mh * h.f.taper / 2;
  head.mesh((m) => m.hull(colour, [h.P(x - 1.5, y + 0.5, 2.2), h.P(x - 1.5, y + 0.5, -2.2), h.P(x, y + 0.5, 2.2), h.P(x, y + 0.5, -2.2), h.P(x - 1.2, y - 4, 2), h.P(x - 1.2, y - 4, -2), h.P(x, y - 4, 2), h.P(x, y - 4, -2)]));
}

// ================================================================ land animals
const land = [
  ASSET('squirrel', 'origami_land', (rig) => sitter(rig, {
    main: 'terracotta', trim: 'paper', accent: 'pink', H: 28, kx: 0.78, Bw: 9, belly: 1.2, shoulder: 0.6, lean: 0.55, armEnd: 12, armY: 0.7,
    face: 'squirrel', ear: { kind: 'point', h: 6, w: 4, x: -3, inner: null }, tail: { kind: 'none' }, headY: -1,
    extra: (ctx) => { archTail(ctx, { y: 5, up: 30, out: 16, over: 12, w: 9, tipColour: ctx.T }); },
  })),
  ASSET('rabbit', 'origami_land', (rig) => sitter(rig, {
    main: 'paper', trim: 'paper', accent: 'red', eyeColour: 'red', H: 28, kx: 0.8, Bw: 11, belly: 1.3, shoulder: 0.5, lean: 0.4, foot: 1.5, armEnd: 0,
    face: 'rabbit', ear: { kind: 'long', h: 26, w: 5.5, x: -4, lean: -4, spread: 5 }, tail: { kind: 'ball', trim: true },
  })),
  ASSET('fox', 'origami_land', (rig) => sitter(rig, {
    main: 'orange', trim: 'paper', accent: 'pink', H: 40, kx: 0.8, Bw: 8, belly: 1.05, shoulder: 0.55, lean: 0.45,
    face: 'fox', ear: { kind: 'point', h: 12, w: 6 }, tail: { kind: 'brush', len: 28, up: -2, w: 7, tip: true },
  })),
  ASSET('cat', 'origami_land', (rig) => quad(rig, { // a loaf: lying down with the paws tucked in, big round head
    main: 'dark', trim: 'paper', accent: 'pink', L: 32, Hb: 17, legH: 3, W: 11, legW: 4, barrel: 1, back: 0.02, chestTrim: 4,
    face: { ...FACES.cat, s: 1.1 }, ear: { kind: 'point', h: 7, w: 7, x: -2, spread: 9 }, eyeTilt: [-0.35, 0, 1], headX: 2, headY: 1, muzzle: false,
    tail: { kind: 'whip', len: 36, w: 2.4, drop: -2 }, hop: 8,
    extra: (ctx) => { const { h } = ctx, y0 = h.P(0, h.my + h.f.mh / 2 + 1.5)[1], y1 = h.P(0, -h.f.hh * 0.5)[1]; ctx.head.mesh((m) => frontPatch(m, ctx.T, h.pts, [[y0, 0], [y0 + 1, 6.5], [(y0 + y1) / 2, 7], [y1 + 0.5, 3], [y1 + 0.5, -3], [(y0 + y1) / 2, -7], [y0 + 1, -6.5]])); }, // white mask round the mouth
  })),
  ASSET('pig', 'origami_land', (rig) => quad(rig, { // round barrel on four stubby legs, flat nose pad, ears flopped forward
    main: 'pink', trim: 'paper', accent: 'coral', L: 34, Hb: 20, legH: 8, W: 12, legW: 4.5, barrel: 1, back: 0.02, chest: false,
    face: 'pig', ear: { kind: 'flop', h: 8, w: 7, x: -3, z: 6 }, nose: false, muzzle: false, headX: 3, headY: -4,
    tail: { kind: 'stub', len: 5 },
    extra: (ctx) => snoutPad(ctx, 'coral', { r: 5, ry: 4.2, dy: 0.5 }),
  })),
  ASSET('beaver', 'origami_land', (rig) => quad(rig, { // low and round, rounded head with buck teeth, flat paddle tail
    main: 'bark', trim: 'paper', accent: 'paper', L: 32, Hb: 17, legH: 5, W: 10, legW: 4, barrel: 0.9, chest: false, belly: true, back: 0.12,
    face: 'beaver', ear: { kind: 'round', h: 3, x: -4, inner: null }, headX: 1, headY: -3, tail: { kind: 'paddle', len: 26, w: 8 },
    extra: (ctx) => teeth(ctx),
  })),
  ASSET('tiger', 'origami_land', (rig) => quad(rig, { // big cat: broad face, short square muzzle, round ears, stripes
    main: 'sunflower', trim: 'paper', accent: 'paper', L: 42, Hb: 15, legH: 16, W: 8.5, legW: 4.4,
    face: 'bigcat', ear: { kind: 'round', h: 4.5, x: -4, spread: 7 }, tail: { kind: 'up', len: 32 }, headX: 2,
    extra: (ctx) => {
      const { x0, x1, yt, bodyPts, h } = ctx;
      ctx.body.mesh((m) => both((s) => [-14, -7, 0, 7].forEach((dx, i) => {
        const cx = (x0 + x1) / 2 + dx, top = yt - i * 0.4 - 1;
        patch(m, 'ink', bodyPts, s, [[cx - 1.6, top], [cx + 1.6, top - 0.5], [cx + 0.3, top - 9 - (i % 2) * 2]]);
      })));
      ctx.head.mesh((m) => [[-1, 7, -3.5], [3, 6.5, -1]].forEach(([x, y, x2]) => both((sd) => patch(m, 'ink', h.pts, sd, [h.P(x - 3, y), h.P(x, y - 0.5), h.P(x2, y - 4)].map((p) => [p[0], p[1]]))))); // cheek stripes
    },
  })),
  ASSET('hippo', 'origami_land', (rig) => quad(rig, { // huge barrel, short legs, a wide square muzzle, eyes and ears on top
    main: 'stone', trim: 'pink', accent: 'pink', L: 46, Hb: 22, legH: 9, W: 14, legW: 6, legZ: 2.4, barrel: 1, back: 0.02, chest: false,
    face: { ...FACES.hippo, s: 1.05, ml: 13 }, ear: { kind: 'round', h: 2.6, x: -7, spread: 6, inner: 'pink' }, muzzle: false, nose: false, headX: 5, headY: -5,
    tail: { kind: 'stub', len: 6 },
    extra: (ctx) => {
      const { h, head } = ctx;
      head.mesh((m) => both((sd) => m.hull(ctx.M, [h.P(-1, h.f.hh * 0.3, sd * 4), h.P(4, h.f.hh * 0.3, sd * 4), h.P(1.5, h.f.hh * 0.5 + 3, sd * 5), h.P(1.5, h.f.hh * 0.35, sd * 7.5), h.P(1.5, h.f.hh * 0.35, sd * 2)]))); // eye bumps on top of the head
      head.mesh((m) => { // nostrils on top of the muzzle, a pink mouth line along its sides
        [3.2, -3.2].forEach((z) => { const t = surf(h.pts, [h.P(h.tipX - 3, 0)[0], 300, z], [0, -1, 0]); if (t) disc(m, 'ink', t.p, t.n, 1.2, 0.9); });
        both((sd) => patch(m, 'pink', h.pts, sd, [h.P(h.xf + 2, h.my - 1.2), h.P(h.tipX, h.ty - 1.2), h.P(h.tipX, h.ty - 3), h.P(h.xf + 2, h.my - 2.2)].map((p) => [p[0], p[1]])));
      });
    },
  })),
  ASSET('meerkat', 'origami_land', (rig) => sitter(rig, { // standing upright on the hind feet, arms hanging, tail as a prop
    main: 'straw', trim: 'paper', accent: 'bark', H: 46, kx: 0.55, Bw: 7, belly: 1.0, shoulder: 0.72, lean: 0.25, armY: 0.7, armEnd: 20, haunch: 0.4, foot: 0.8,
    face: 'meerkat', ear: { kind: 'round', h: 2.5, x: -3, inner: null }, noseColour: 'ink', tail: { kind: 'whip', len: 40, w: 2, colour: 'bark' }, hop: 10,
    extra: (ctx) => { // dark eye patches around the eyes
      const { h } = ctx, [ex, ey] = [h.eyeAt[0], h.eyeAt[1]];
      ctx.head.mesh((m) => both((s) => patch(m, 'bark', h.pts, s, [[ex - 3, ey + 2.4], [ex + 3.4, ey + 1.2], [ex + 2.6, ey - 2.6], [ex - 2.6, ey - 2]])));
    },
  })),
  ASSET('wolf', 'origami_land', (rig) => quad(rig, { // long legs, long snout, shaggy ruff
    main: 'blue', trim: 'paper', accent: 'pink', L: 46, Hb: 16, legH: 21, W: 7.5, legW: 3.6, face: 'wolf', ear: { kind: 'point', h: 12, w: 6 }, tail: { kind: 'brush', len: 34, up: 2, w: 6 }, legSplay: 1.3, headX: 3, headY: 3,
    extra: (ctx) => {
      const { x1, yt, W, body } = ctx;
      body.mesh((m) => both((s) => {
        spike(m, ctx.M, [x1 - 8, yt - 1, s * 2], [x1 - 3, yt - 9, s * (W + 2)], [x1 - 15, yt + 1, s * (W + 4)], [0, 0, s * 1.4], 1.3);
        spike(m, ctx.M, [x1 - 3, yt - 9, s * (W + 2)], [x1 + 2, yt - 15, s * (W - 1)], [x1 - 9, yt - 10, s * (W + 6)], [0, 0, s * 1.2], 1.3);
      }));
    },
  })),
  ASSET('mammoth', 'origami_land', (rig) => quad(rig, { // high domed head, sloping back, trunk and long curved tusks
    main: 'wood', trim: 'paper', accent: 'paper', L: 40, Hb: 26, legH: 14, W: 13, legW: 6.5, legZ: 2.8, chest: false, back: 0.2, muzzle: false, nose: false,
    face: { ...FACES.mammoth, s: 1.1, hw: 23, hh: 22, dome: 5 }, ear: { kind: 'side', h: 9, x: -3, y: 2 }, tail: { kind: 'stub', len: 9 }, headY: 0, headX: 0,
    extra: (ctx) => {
      const { h, head, M } = ctx, tx = h.tipX, ty = h.ty;
      const tr = head.add('trunk', h.P(tx - 1, ty));
      tr.mesh((m) => { // trunk: a strip folded down the front of the face, curling out at the tip
        spike(m, M, h.P(tx - 7, ty + 4, 0), h.P(tx + 1, ty - 2, 0), h.P(tx + 3, ty - 30, 0), [2.2, 0, 6], 1.5);
        spike(m, M, h.P(tx + 1, ty - 24, 0), h.P(tx + 4.4, ty - 28, 0), h.P(tx + 10, ty - 23, 0), [0, 0, 2.4], 1.2);
      });
      both((s) => head.mesh((m) => spike(m, 'paper*', h.P(tx - 5, ty - 3, s * 5), h.P(tx - 2, ty, s * 5), h.P(tx + 18, ty - 13, s * 7.6), [0, -1, s * 1.2], 1.5))); // curved tusks
      ctx.body.mesh((m) => m.hull(M, [[ctx.x1 - 10, ctx.yt + 1, 0], [ctx.x1 - 18, ctx.yt + 6, 4], [ctx.x1 - 18, ctx.yt + 6, -4], [ctx.x1 - 3, ctx.yt - 2, 7], [ctx.x1 - 3, ctx.yt - 2, -7]])); // shaggy hump
    },
  })),
];

// ================================================================ sea and water
const sea = [
  ASSET('shark', 'origami_sea', (rig) => swimmer(rig, {
    main: 'blue', trim: 'paper', accent: 'pink', L: 60, H: 20, W: 8, y: 26, snout: 8, dorsal: { x: 4, len: 16, h: 14, back: 8 }, tailUp: 30, tailDown: 9, tailBack: 12, tailNotch: 8, fin: { len: 14, drop: 10, out: 12 }, eye: 1.8,
    extra: (ctx) => { ctx.body.mesh((m) => both((s) => plate(m, ctx.M, [[-2, ctx.y - 8, s * 4], [-12, ctx.y - 9, s * 4], [-16, ctx.y - 16, s * 7]], 1.6))); }, // pelvic fins
  }), 'The long upper tail lobe is the thresher shark\'s signature.'),
  ASSET('whale', 'origami_sea', (rig) => swimmer(rig, {
    main: 'cobalt', trim: 'paper', accent: 'pink', L: 62, H: 28, W: 13, y: 30, snout: 2, dorsal: { x: -14, len: 10, h: 6, back: 3 }, tailUp: 20, tailDown: 20, tailBack: 12, tailNotch: 5, fin: { len: 18, drop: 12, out: 14, colour: 'paper*' }, eye: 2,
    tailColour2: undefined,
  })),
  ASSET('pufferfish', 'origami_sea', (rig) => swimmer(rig, {
    main: 'sunflower', trim: 'paper', accent: 'orange', L: 40, H: 34, W: 16, y: 30, snout: 2, tailUp: 12, tailDown: 10, tailBack: 8, tailNotch: 4, fin: { len: 8, drop: 4, out: 6, colour: 'orange' }, tailColour: 'orange', eye: 3.2,
    extra: (ctx) => { // small spines on the back
      [8, 0, -8].forEach((x) => ctx.body.mesh((m) => plate(m, ctx.M, [[x + 3, ctx.y + 16, 0], [x - 3, ctx.y + 16, 0], [x, ctx.y + 22, 0]], 1.4)));
    },
  })),
  ASSET('squid', 'origami_sea', (rig) => {
    const M = 'sky*', T = 'paper*', y = 30;
    const body = rig.root.add('body', [0, y, 0]);
    body.mesh((m) => {
      m.hull(M, [[0, y + 26, 0], [-8, y + 4, 8], [8, y + 4, 8], [-8, y + 4, -8], [8, y + 4, -8], [0, y - 12, 0]]); // cone mantle
      both((s) => plate(m, M, [[0, y + 26, s * 2], [-9, y + 10, s * 8], [-1, y + 4, s * 20]], 1.8)); // side fins
      m.hull(T, [[-6, y - 4, 6.6], [6, y - 4, 6.6], [-6, y - 4, -6.6], [6, y - 4, -6.6], [0, y - 15, 0]]);
    });
    [[8, 6], [-8, 6], [8, -6], [-8, -6], [0, 8], [0, -8]].forEach(([dx, dz], i) => {
      const t = body.add(`tentacle_${i}`, [dx * 0.6, y - 12, dz * 0.6]);
      t.mesh((m) => spike(m, T, [dx * 0.6 - 2, y - 12, dz * 0.6], [dx * 0.6 + 2, y - 12, dz * 0.6], [dx * 1.5, y - 30 + (i % 2) * 3, dz * 1.6], [0, 0, 1.6], 1.2));
    });
    [[1, 1], [-1, 1]].forEach(([sx, sz]) => 0);
    const e = surf([[0, y + 26, 0], [-8, y + 4, 8], [8, y + 4, 8], [-8, y + 4, -8], [8, y + 4, -8], [0, y - 12, 0]], [0, y + 2, 60], [0, 0, -1]);
    body.mesh((m) => { if (e) [1, -1].forEach((sd) => { const q = surf([[0, y + 26, 0], [-8, y + 4, 8], [8, y + 4, 8], [-8, y + 4, -8], [8, y + 4, -8], [0, y - 12, 0]], [sd * 5, y + 2, sd * 60], [0, 0, -sd]); if (q) disc(m, 'ink', q.p, q.n, 1.8); }); });
    rig.root.anchorAt('label_anchor', [0, y + 38, 0]);
    body.anchorAt('flag_anchor', [0, y + 20, 0]);
    creatureClips(rig, { head: null, tail: null, floating: true, hopHeight: 8 });
  }),
  ASSET('walrus', 'origami_sea', (rig) => quad(rig, { // heavy body lying on flippers, a fat whisker pad and two long tusks
    main: 'sand', trim: 'paper', accent: 'paper', L: 46, Hb: 24, legH: 3, W: 13, legW: 4, chest: false, barrel: 0.8, face: 'walrus', ear: { kind: 'none' }, tail: { kind: 'none' }, headX: 2, headY: -6, back: 0.05, legSplay: 1.8, nose: false,
    extra: (ctx) => {
      const { h } = ctx, x = h.tipX - 4, y = h.ty - h.f.mh * h.f.taper / 2;
      both((s) => ctx.head.mesh((m) => spike(m, 'paper*', h.P(x - 1.5, y + 1, s * 3.6), h.P(x + 1.5, y + 1, s * 3.6), h.P(x + 1, y - 20, s * 4.4), [0.6, 0, s * 0.5], 1.6))); // tusks
      snoutPad(ctx, null, { gap: 2.6, dy: 2.5, nostril: 0.9 });
    },
  })),
];

// ================================================================ small animals, reptiles
const small = [
  ASSET('shieldbug', 'origami_small', (rig) => {
    const M = 'grass*', T = 'lemon*', body = rig.root.add('body', [0, 6, 0]);
    body.mesh((m) => {
      m.hull(M, [[-1, 14, 0], [13, 9, 0], [10, 9, 7], [10, 9, -7], [4, 10, 14], [4, 10, -14], [-8, 9.5, 11], [-8, 9.5, -11], [-17, 8, 4], [-17, 8, -4], [12, 5, 5], [12, 5, -5], [-14, 5, 8], [-14, 5, -8]]);
      m.hull('terracotta', [[-17, 8.2, 3.6], [-16.5, 8.5, 12.5 - 12], [-7, 10, 8], [-8, 9.7, 11], [-12, 8.8, 12]].map(([x, y, z]) => [x, y + 0.4, -Math.abs(z)]));
      m.hull(T, [[13, 8, 0], [13, 5, 4], [13, 5, -4], [8, 6, 8], [8, 6, -8], [4, 3, 0]]);
    });
    const head = body.add('head', [15, 8, 0]);
    head.mesh((m) => {
      m.hull(M, [[12, 11, 0], [12, 7, 5], [12, 7, -5], [22, 8, 0], [17, 12, 0]]);
      [3.6, -3.6].forEach((z) => disc(m, 'ink', [17.5, 9.4, z * 1.03], [0.1, 0.2, Math.sign(z)], 1.3));
      stick(m, M, [20, 10, 2], [30, 17, 6], 0.7); stick(m, M, [20, 10, -2], [30, 17, -6], 0.7);
    });
    both((s) => body.mesh((m) => spike(m, M, [7, 10, s * 13], [2, 10, s * 13], [8, 13, s * 27], [0, 1.2, 0], 1.3))); // shoulder horns
    const legs = [];
    [[6, 1], [-2, 1], [-10, 1], [6, -1], [-2, -1], [-10, -1]].forEach(([x, z], i) => {
      const n = ['leg_fl', 'leg_ml', 'leg_bl', 'leg_fr', 'leg_mr', 'leg_br'][i];
      legs.push(n);
      body.add(n, [x, 6, z * 9]).mesh((m) => { stick(m, M, [x, 6, z * 9], [x + (i % 3 - 1) * 3, 7, z * 18], 0.8); stick(m, M, [x + (i % 3 - 1) * 3, 7, z * 18], [x + (i % 3 - 1) * 5, 0, z * 21], 0.8); });
    });
    body.anchorAt('flag_anchor', [0, 14, 0]);
    rig.root.anchorAt('label_anchor', [0, 40, 0]);
    creatureClips(rig, { head: 'head', tail: null, legs, hopHeight: 8 });
  }),
  ASSET('katydid', 'origami_small', (rig) => {
    const M = 'leaf*', T = 'lemon*', body = rig.root.add('body', [0, 14, 0]);
    body.mesh((m) => {
      m.hull(M, [[10, 15, 0], [-2, 20, 0], [-4, 14, 6], [-4, 14, -6], [12, 10, 3.5], [12, 10, -3.5], [-14, 18, 0], [-12, 12, 3], [-12, 12, -3]]);
      both((s) => plate(m, M, [[3, 22, 0], [-6, 23, s * 9], [-36, 34, s * 1]], 1.6)); // folded wing tent
      m.hull(M, [[3, 22.4, 0], [-6, 23.4, 3], [-6, 23.4, -3], [-36, 34.4, 0]]);
    });
    const head = body.add('head', [10, 15, 0]);
    head.mesh((m) => {
      m.hull(M, [[8, 22, 0], [16, 20, 0], [10, 12, 4.4], [10, 12, -4.4], [15, 8, 0], [17, 14, 0]]);
      both((s) => disc(m, T, [14.2, 15, s * 3.5], [0.4, 0.2, s], 2.3));
      both((s) => disc(m, 'ink', [14.6, 15, s * 4.2], [0.4, 0.2, s], 1.1));
      both((s) => stick(m, M, [12, 21, s * 2], [4, 44, s * 6], 0.6));
    });
    const legs = [];
    both((s) => {
      ['f', 'm'].forEach((w, i) => { const n = `leg_${w}${s > 0 ? 'l' : 'r'}`; legs.push(n); body.add(n, [6 - i * 8, 12, s * 5]).mesh((m) => { stick(m, M, [6 - i * 8, 12, s * 4], [8 - i * 8, 7, s * 10], 0.8); stick(m, M, [8 - i * 8, 7, s * 10], [11 - i * 8, 0, s * 12], 0.8); }); });
      const n = s > 0 ? 'leg_bl' : 'leg_br'; legs.push(n);
      body.add(n, [-12, 14, s * 5]).mesh((m) => { spike(m, M, [-10, 14, s * 5], [-14, 14, s * 5], [-4, 32, s * 7.5], [0, 0, s * 1.2], 1.3); spike(m, M, [-2, 31, s * 7.5], [-6, 30, s * 7.5], [-11, 0, s * 9], [0, 0, s * 1], 1.3); }); // big folded hind leg
    });
    body.anchorAt('flag_anchor', [-6, 30, 0]);
    rig.root.anchorAt('label_anchor', [0, 52, 0]);
    creatureClips(rig, { head: 'head', tail: null, legs, hopHeight: 22 });
  }),
  ASSET('snake', 'origami_small', (rig) => {
    const M = 'leaf*', T = 'lemon*', body = rig.root.add('body', [0, 4, 0]);
    const path = [[-30, 1.5], [-18, 3], [-4, 3.5], [10, 6], [14, 15], [6, 24], [8, 33]];
    const wz = [0.8, 3, 5.5, 6, 5.5, 4.8, 4.2];
    body.mesh((m) => {
      for (let i = 0; i < path.length - 1; i++) band(m, i % 2 ? M : 'leaf*', [...path[i], 0], [...path[i + 1], 0], wz[i], wz[i + 1], 6 - i * 0.4);
    });
    const head = body.add('head', [8, 33, 0]);
    head.mesh((m) => {
      m.hull(M, [[2, 34, 0], [12, 34, 0], [4, 31, 5.2], [4, 31, -5.2], [17, 33, 0], [10, 39, 0], [4, 38, 3.4], [4, 38, -3.4]]);
      m.hull(T, [[6, 30.6, 3.6], [6, 30.6, -3.6], [16, 32.4, 0], [8, 30, 0]]);
      both((s) => disc(m, 'ink', [11, 36.2, s * 2.6], [0.1, 0.3, s], 1.2));
      spike(m, 'red', [16.5, 33, 0.3], [16.5, 33, -0.3], [26, 32, 0], [0, 1, 0], 0.6);
    });
    body.anchorAt('flag_anchor', [0, 8, 0]);
    rig.root.anchorAt('label_anchor', [0, 52, 0]);
    creatureClips(rig, { head: 'head', tail: null, legs: [], hopHeight: 6 });
  }),
  ASSET('chameleon', 'origami_small', (rig) => {
    const M = 'leaf*', T = 'mint*', body = rig.root.add('body', [0, 14, 0]);
    body.mesh((m) => {
      m.hull('bark', [[-30, 0, -3.5], [30, 0, -3.5], [-30, 2.6, -3.5], [30, 2.6, -3.5], [-30, 0, 3.5], [30, 0, 3.5], [-30, 2.6, 3.5], [30, 2.6, 3.5]].map(([x, y, z]) => [x * 0.9, y + 0, z]));
      m.hull(M, [[12, 24, 0], [-6, 30, 0], [-14, 22, 0], [-8, 15, 6], [-8, 15, -6], [8, 15, 5.5], [8, 15, -5.5], [-1, 24, 8.5], [-1, 24, -8.5], [-2, 12, 0]]);
      m.hull(T, [[12, 24, 0], [8, 15, 5], [8, 15, -5], [17, 18, 0]]);
      // spiral tail: flat ribbons winding under the rump
      band(m, M, [-14, 22, 0], [-22, 20, 0], 3, 2.6, 3.4); band(m, M, [-22, 20, 0], [-25, 12, 0], 2.6, 2.2, 3); band(m, M, [-25, 12, 0], [-19, 8, 0], 2.2, 1.8, 2.6); band(m, M, [-19, 8, 0], [-15, 13, 0], 1.8, 1.3, 2.2);
    });
    const head = body.add('head', [12, 22, 0]);
    const hp = [[8, 32, 0], [14, 30, 0], [11, 22, 4.6], [11, 22, -4.6], [24, 22, 0], [16, 24, 3.6], [16, 24, -3.6], [4, 27, 0]];
    head.mesh((m) => {
      m.hull(M, hp);
      both((s) => { m.hull(M, blob([16, 27.5, s * 5], 3.6, 3.6, 3.6, 8)); disc(m, 'ink', [17, 28, s * 8.4], [0.2, 0.1, s], 1.5); });
      m.hull(T, [[16, 22.6, 0], [22, 22.4, 0], [14, 21, 3], [14, 21, -3]]);
    });
    const legs = [];
    [[6, 1], [-6, 1], [6, -1], [-6, -1]].forEach(([x, z], i) => {
      const n = ['leg_fl', 'leg_bl', 'leg_fr', 'leg_br'][i]; legs.push(n);
      body.add(n, [x, 16, z * 6]).mesh((m) => { stick(m, M, [x, 16, z * 6], [x + 2, 10, z * 9.5], 1.2); stick(m, M, [x + 2, 10, z * 9.5], [x + 1, 3, z * 8], 1.2); });
    });
    body.anchorAt('flag_anchor', [-4, 30, 0]);
    rig.root.anchorAt('label_anchor', [0, 46, 0]);
    creatureClips(rig, { head: 'head', tail: null, legs, hopHeight: 6 });
  }, 'Sits on a bark branch (one flat colour, the sixth material).'),
  ASSET('stegosaurus', 'origami_small', (rig) => quad(rig, {
    main: 'slate', trim: 'paper', accent: 'sky', L: 46, Hb: 16, legH: 10, W: 9, legW: 4.4, chest: false, face: { ...FACES.lizard, s: 0.85, drop: 3 }, ear: { kind: 'none' }, tail: { kind: 'stub', len: 22 }, headY: -9, headX: 4, muzzle: false, back: 0.18, hop: 8,
    extra: (ctx) => {
      const { x0, x1, yt, body } = ctx;
      [[8, 12], [2, 15], [-5, 16], [-12, 14], [-19, 10]].forEach(([x, h], i) => body.mesh((m) => {
        const y = yt - 2 - Math.abs(x) * 0.08 - i * 0.6;
        plate(m, 'paper*', [[x + 5, y, 0], [x - 5, y, 0], [x, y + h, 0]], 1.8);
      })); // back plates
      ctx.body.mesh((m) => [[-30, 2], [-36, 4], [-42, 6]].forEach(([x, dy]) => both((s) => spike(m, 'sky', [x + 2.5, ctx.yb + 6 + dy, s * 0.5], [x - 2.5, ctx.yb + 6 + dy, s * 0.5], [x - 2, ctx.yb + 6 + dy + 9, s * 5], [0, 0, s * 0.4], 1)))); // tail spikes
    },
  })),
];

// ================================================================ mythical
const myth = [
  ASSET('griffin', 'origami_myth', (rig) => quad(rig, { // lion body, eagle head with a hooked beak, big folded wings
    main: 'gold', trim: 'paper', accent: 'orange', headMain: 'paper', L: 38, Hb: 16, legH: 15, W: 9, legW: 4.4, chest: false,
    face: { ...FACES.bird, s: 1 }, ear: { kind: 'none' }, tail: { kind: 'brush', len: 24, up: 2, w: 5, tip: true }, headY: 5, headX: 2, nose: false, muzzle: false,
    extra: (ctx) => {
      const { h, head, x0, x1, yt, body } = ctx, bx = h.xf - 1;
      head.mesh((m) => { // hooked beak and a folded feather crest
        m.hull('orange', [h.P(bx, 1.5, 3.4), h.P(bx, 1.5, -3.4), h.P(bx, -5, 2.6), h.P(bx, -5, -2.6), h.P(bx + 11, -1, 0), h.P(bx + 12, -6, 0), h.P(bx + 6, -6, 0)]);
        both((s) => spike(m, 'paper*', h.P(-4, 6, s * 2), h.P(2, 6, s * 4), h.P(-14, 16, s * 6), [0, 0, s * 1.2], 1.2));
      });
      both((s) => body.mesh((m) => {
        spike(m, 'paper*', [x1 - 8, yt - 1, s * 4], [x0 + 8, yt - 2, s * 4], [x0 + 5, yt + 30, s * 22], [0, 0, s * 4], 1.5);
        spike(m, 'paper*', [x1 - 10, yt - 1, s * 5], [x1 - 22, yt - 1, s * 5], [x0 + 12, yt + 24, s * 30], [0, 0, s * 3], 1.5);
      }));
    },
  })),
  ASSET('winged_lion', 'origami_myth', (rig) => quad(rig, { // big-cat face inside a ring-shaped mane, wings
    main: 'sand', trim: 'paper', accent: 'bark', L: 40, Hb: 17, legH: 15, W: 9, legW: 4.4, chest: false,
    face: 'bigcat', ear: { kind: 'round', h: 3.5, x: -3, spread: 8, inner: null }, tail: { kind: 'whip', len: 32, w: 2 }, headX: 3, headY: 2,
    extra: (ctx) => {
      const { h, head, x1, yt } = ctx;
      head.mesh((m) => { // mane: a faceted collar behind the face
        m.hull('bark', [h.P(-5, 14, 0), h.P(-8, 6, 15), h.P(-8, 6, -15), h.P(-7, -9, 11), h.P(-7, -9, -11), h.P(-12, 0, 0), h.P(-3, 7, 12), h.P(-3, 7, -12), h.P(-3, -6, 10), h.P(-3, -6, -10), h.P(-6, -14, 0)]);
      });
      ctx.body.mesh((m) => both((s) => {
        spike(m, 'paper*', [x1 - 8, yt - 1, s * 4], [x1 - 22, yt - 2, s * 4], [x1 - 34, yt + 26, s * 24], [0, 0, s * 4], 1.5);
        spike(m, 'paper*', [x1 - 8, yt - 1, s * 5], [x1 - 14, yt - 1, s * 5], [x1 - 18, yt + 20, s * 32], [0, 0, s * 3], 1.5);
      }));
    },
  })),
  ASSET('dragon', 'origami_myth', (rig) => quad(rig, { // long flat-topped snout, horns, whiskers, spiky back
    main: 'paper', trim: 'sky', accent: 'teal', L: 36, Hb: 14, legH: 12, W: 7, legW: 3.6, chest: false,
    face: 'dragon', ear: { kind: 'point', h: 6, w: 4, x: -6, inner: 'teal', spread: 8 }, tail: { kind: 'brush', len: 34, up: -2, w: 5, tip: true, colour: 'paper' }, headY: 5, headX: 3, hop: 12,
    extra: (ctx) => {
      const { h, head, x1, yt, body } = ctx;
      head.mesh((m) => both((s) => { stick(m, 'teal', h.P(h.tipX - 2, h.ty - 1, s * 4), h.P(h.tipX + 8, h.ty - 12, s * 12), 0.6); spike(m, 'teal', h.P(-3, 6, s * 3), h.P(1, 6, s * 3), h.P(-14, 22, s * 5), [0, 0, s * 0.8], 1); }));
      body.mesh((m) => { for (let i = 0; i < 6; i++) { const x = x1 - 6 - i * 6, y = yt - i * 0.4; plate(m, 'sky*', [[x + 3, y, 0], [x - 3, y, 0], [x, y + 7 - i * 0.6, 0]], 1.4); } });
      body.mesh((m) => both((s) => spike(m, 'sky*', [x1 - 10, yt - 1, s * 3], [x1 - 22, yt - 1, s * 3], [x1 - 22, yt + 18, s * 17], [0, 0, s * 3], 1.3)));
    },
  })),
  ASSET('phoenix', 'origami_myth', (rig) => bird(rig, {
    main: 'red', trim: 'orange', accent: 'gold', bodyL: 28, bodyH: 24, legH: 12, W: 7, crest: { h: 14, back: 10, w: 2 }, beak: { len: 6, h: 3.2 }, wing: { colour: 'red*', open: { span: 38, up: 14, sweep: 10, front: 8, back: 12, trim: true } }, tail: { len: 34, w: 5, colour: 'orange*', tipY: 0.3 }, headY: 2,
    extra: (ctx) => { // tail plumes fanned above the main tail
      ctx.body.mesh((m) => [-10, 0, 10].forEach((dz, i) => spike(m, i === 1 ? 'red*' : 'gold', [ctx.x0 + 6, ctx.yb + 14, dz * 0.1], [ctx.x0 + 4, ctx.yb + 8, dz * 0.1], [ctx.x0 - 34, ctx.yb + 26 + (1 - Math.abs(dz) / 10) * 8, dz * 2.2], [0, 0, 2.2], 1.2)));
    },
  })),
];

// ================================================================ birds
const mask = (ctx, colour, shape) => ctx.head.mesh((m) => both((s) => patch(m, colour, ctx.hpts, s, shape(ctx.hb, ctx.hs))));
const birds = [
  ASSET('duck', 'origami_birds', (rig) => bird(rig, { main: 'paper', trim: 'paper', accent: 'orange', bodyL: 34, bodyH: 15, legH: 6, W: 8, neck: { len: 4, curve: 3, r: 2.6 }, head: { s: 1.05 }, beak: { len: 8, h: 3.4, curve: 0.2 }, tail: { len: 8, up: 4, w: 3, tipY: 0.5 }, wing: { len: 15 } })),
  ASSET('seagull', 'origami_birds', (rig) => bird(rig, { main: 'paper', trim: 'paper', accent: 'sunflower', bodyL: 32, bodyH: 16, legH: 11, W: 7, neck: { len: 3, curve: 2, r: 2.4 }, beak: { len: 8, h: 2.8 }, tail: { len: 8, w: 3.2 }, wing: { len: 26, colour: 'stone*', tip: -1 } })),
  ASSET('vulture', 'origami_birds', (rig) => bird(rig, { main: 'asphalt', trim: 'pink', headMain: 'pink', belly: false, accent: 'lemon', bodyL: 34, bodyH: 26, legH: 10, W: 10, neck: { len: 4, curve: 4, r: 3 }, head: { s: 1.05 }, beak: { len: 8, h: 4.4, curve: 1 }, tail: { len: 10, w: 4 }, wing: { len: 22 }, headX: 1 })),
  ASSET('rooster', 'origami_birds', (rig) => bird(rig, {
    main: 'paper', trim: 'orange', accent: 'red', legColour: 'ink', bodyL: 30, bodyH: 26, legH: 10, W: 9, belly: false, beak: { len: 5, h: 3, colour: 'orange' }, tail: { len: 12, up: 26, w: 6, colour: 'orange*', tipY: 0.5 }, wing: { len: 18, colour: 'orange*' }, crest: { h: 8, back: 2, w: 2.4, colour: 'red' }, headY: 4,
    extra: (ctx) => { ctx.head.mesh((m) => plate(m, 'red', [[ctx.hb[0] + 4, ctx.hb[1] - 3.5, 0], [ctx.hb[0] + 2, ctx.hb[1] - 4.5, 0], [ctx.hb[0] + 3.4, ctx.hb[1] - 9, 0]], 1.4)); }, // wattle
  })),
  ASSET('cardinal', 'origami_birds', (rig) => bird(rig, {
    main: 'red', trim: 'red', belly: false, accent: 'orange', bodyL: 30, bodyH: 22, legH: 6, W: 8.5, crest: { h: 9, back: 7, w: 2 }, beak: { len: 5, h: 3.4 }, tail: { len: 22, w: 3.4 }, legColour: 'ink',
    extra: (ctx) => mask(ctx, 'ink', (hb, s) => [[hb[0] + 1, hb[1] + 2.4], [hb[0] + 4, hb[1] + 1.2], [hb[0] + 3.4, hb[1] - 2.4], [hb[0] + 0.5, hb[1] - 2]]),
  })),
  ASSET('sparrow', 'origami_birds', (rig) => bird(rig, { main: 'wood', trim: 'cream', accent: 'bark', bodyL: 24, bodyH: 17, legH: 7, W: 7, beak: { len: 4, h: 2.6, colour: 'bark' }, tail: { len: 15, w: 2.8, colour: 'bark' }, wing: { len: 15, colour: 'bark' }, faceTrim: true, head: { s: 1.1 } })),
  ASSET('blue_jay', 'origami_birds', (rig) => bird(rig, {
    main: 'blue', trim: 'paper', accent: 'ink', bodyL: 30, bodyH: 20, legH: 7, W: 8, crest: { h: 8, back: 5, w: 1.8 }, beak: { len: 6, h: 3.2, colour: 'ink' }, tail: { len: 20, w: 4, colour: 'blue*' }, wing: { len: 20, trim: true }, faceTrim: true, legColour: 'ink',
    extra: (ctx) => mask(ctx, 'ink', (hb) => [[hb[0] - 1.5, hb[1] - 2.6], [hb[0] + 2, hb[1] - 3.2], [hb[0] + 0.6, hb[1] - 4.2]]),
  })),
  ASSET('toucan', 'origami_birds', (rig) => bird(rig, { main: 'dark', trim: 'paper', accent: 'orange', bodyL: 28, bodyH: 26, legH: 6, W: 8, beak: { len: 18, h: 9, curve: 0.9 }, head: { s: 1.05 }, tail: { len: 16, w: 3.6 }, wing: { len: 20 }, faceTrim: true, headX: 1 })),
  ASSET('flycatcher', 'origami_birds', (rig) => bird(rig, { main: 'cobalt', trim: 'paper', accent: 'ink', bodyL: 24, bodyH: 17, legH: 7, W: 7, beak: { len: 5, h: 2.4, colour: 'ink' }, tail: { len: 16, up: 7, w: 3, colour: 'cobalt*' }, wing: { len: 16 }, legColour: 'ink', head: { s: 1.05 } })),
  ASSET('magpie', 'origami_birds', (rig) => bird(rig, { main: 'dark', trim: 'paper', accent: 'blue', bodyL: 28, bodyH: 17, legH: 8, W: 7, beak: { len: 6, h: 2.8, colour: 'ink' }, tail: { len: 40, w: 3, colour: 'blue', tipY: 0.4 }, wing: { len: 22, colour: 'blue' }, legColour: 'ink' })),
  ASSET('penguin', 'origami_birds', (rig) => bird(rig, { main: 'dark', trim: 'paper', accent: 'orange', bodyL: 24, bodyH: 34, legH: 3, W: 9, legZ: 4, footLen: 7, beak: { len: 6, h: 3 }, tail: { len: 6, w: 2.6, up: 1 }, wing: { len: 26, tip: -8 }, headY: 3, head: { s: 1.1 } })),
  ASSET('long_tailed_tit', 'origami_birds', (rig) => bird(rig, { main: 'paper', trim: 'paper', accent: 'pink', bodyL: 18, bodyH: 15, legH: 6, W: 6, beak: { len: 3, h: 2, colour: 'ink' }, tail: { len: 34, w: 2.6, colour: 'dark*', tipY: 0.55 }, wing: { len: 12, colour: 'dark*' }, legColour: 'ink', head: { s: 1.1 } })),
  ASSET('bald_eagle', 'origami_birds', (rig) => bird(rig, { main: 'bark', trim: 'paper', headMain: 'paper', accent: 'sunflower', bodyL: 32, bodyH: 26, legH: 9, W: 9, beak: { len: 8, h: 5.4, curve: 1 }, tail: { len: 12, w: 4.4, colour: 'paper*' }, wing: { colour: 'bark*', open: { span: 30, up: 10, sweep: 6, front: 8, back: 12 } }, head: { s: 1.15 }, legLean: 0 })),
  ASSET('hummingbird', 'origami_birds', (rig) => bird(rig, { main: 'teal', trim: 'paper', accent: 'ink', float: true, legH: 26, bodyL: 22, bodyH: 14, W: 6, beak: { len: 14, h: 1.6, colour: 'ink', lower: false }, tail: { len: 10, w: 3 }, wing: { colour: 'teal*', open: { span: 26, up: 12, sweep: 5, front: 6, back: 8, trim: true } }, head: { s: 1 } }), 'Hovers: the body floats 2.6 cm above the table; the origin stays on the table top. Clip flap.'),
  ASSET('swallow', 'origami_birds', (rig) => bird(rig, { main: 'navy', trim: 'paper', accent: 'ink', float: true, legH: 26, bodyL: 26, bodyH: 13, W: 6, beak: { len: 4, h: 2.6, colour: 'ink' }, tail: { len: 24, w: 3, fork: 6, colour: 'navy*', tipY: 0.4 }, wing: { colour: 'navy*', open: { span: 40, up: 6, sweep: 24, front: 3, back: 6, trim: true } } }), 'Hovers: the body floats 2.6 cm above the table; the origin stays on the table top. Clip flap.'),
  ASSET('peacock', 'origami_birds', (rig) => bird(rig, {
    main: 'blue', trim: 'teal', accent: 'gold', bodyL: 28, bodyH: 20, legH: 14, W: 7.5, neck: { len: 12, curve: 3, r: 2.2 }, head: { s: 0.9 }, beak: { len: 4, h: 2, colour: 'ink' }, tail: { len: 8, w: 3, colour: 'teal*' }, crest: { h: 7, back: 2, w: 1.4, colour: 'gold' }, wing: { len: 16, colour: 'blue*' }, legColour: 'ink',
    extra: (ctx) => { // display fan behind: seven folded planes with round gold eyes at the tips
      const { body, x0, yb, bh } = ctx;
      body.mesh((m) => [-3, -2, -1, 0, 1, 2, 3].forEach((i) => {
        const tip = [x0 - 22 - Math.abs(i) * -1.5, yb + bh * 0.4 + 26 - Math.abs(i) * 4, i * 8];
        spike(m, i % 2 ? 'teal*' : 'blue*', [x0 + 6, yb + bh * 0.55, i * 0.6], [x0 + 5, yb + bh * 0.25, i * 0.6], tip, [-1, 0, i * 0.4], 1.2);
        disc(m, 'gold', [tip[0] + 1.2, tip[1] - 3, tip[2] * 0.995], [-1, 0.1, 0], 2.2);
      }));
    },
  })),
  ASSET('flamingo', 'origami_birds', (rig) => bird(rig, { main: 'pink', trim: 'pink', belly: false, accent: 'ink', legColour: 'pink', bodyL: 26, bodyH: 15, legH: 32, W: 7, neck: { len: 24, curve: 7, r: 1.7 }, head: { s: 0.9 }, beak: { len: 6, h: 3, colour: 'ink', curve: 1.2 }, tail: { len: 8, w: 3 }, wing: { len: 16, colour: 'coral*' }, legX: -2 })),
  ASSET('egret', 'origami_birds', (rig) => bird(rig, { main: 'paper', trim: 'paper', belly: false, accent: 'sunflower', legColour: 'ink', bodyL: 24, bodyH: 13, legH: 28, W: 6, neck: { len: 26, curve: 8, r: 1.6 }, head: { s: 0.85 }, beak: { len: 12, h: 2, colour: 'sunflower' }, tail: { len: 12, w: 2.4, up: 6 }, wing: { len: 16 }, legX: -2 })),
  ASSET('ostrich', 'origami_birds', (rig) => bird(rig, { main: 'dark', trim: 'paper', accent: 'sand', legColour: 'sand', bodyL: 30, bodyH: 26, legH: 28, W: 10, neck: { len: 30, curve: 5, r: 2.2, colour: 'sand' }, head: { s: 0.9 }, beak: { len: 5, h: 2.6, colour: 'sand' }, tail: { len: 12, w: 6, colour: 'paper*', up: 3, tipY: 0.5 }, wing: { len: 18, colour: 'paper*' }, belly: false, legX: -1 })),
  ASSET('shoebill', 'origami_birds', (rig) => bird(rig, { main: 'slate', trim: 'stone', accent: 'sand', legColour: 'ink', bodyL: 24, bodyH: 22, legH: 24, W: 8, neck: { len: 5, curve: 2, r: 3 }, head: { s: 1.3 }, beak: { len: 14, h: 9, colour: 'sand', curve: 0.6 }, tail: { len: 10, w: 3 }, wing: { len: 16 } })),
  ASSET('owl', 'origami_birds', (rig) => bird(rig, {
    main: 'wood', trim: 'cream', accent: 'sunflower', bodyL: 24, bodyH: 30, legH: 4, W: 9, head: { s: 1.5, wide: 1.1 }, beak: { len: 3, h: 3, colour: 'sunflower', curve: 0.6 }, tail: { len: 8, w: 3.4 }, wing: { len: 20 }, eyeColour: 'sunflower', eye: 2.6, faceTrim: true, headY: -2, headX: 0, crest: { h: 6, back: 0, w: 1.8 }, legColour: 'sunflower',
    extra: (ctx) => mask(ctx, 'ink', (hb, s) => [[hb[0] + 2.8, hb[1] + 1.6], [hb[0] + 3.6, hb[1] + 0.4], [hb[0] + 2.4, hb[1] - 0.3]]),
  })),
  ASSET('parrot', 'origami_birds', (rig) => bird(rig, { main: 'leaf', trim: 'lemon', accent: 'red', bodyL: 26, bodyH: 26, legH: 6, W: 8, beak: { len: 7, h: 6.4, curve: 1.6, colour: 'red' }, head: { s: 1.1 }, tail: { len: 34, w: 3.6, colour: 'leaf*', tipY: 0.1 }, wing: { len: 22, colour: 'leaf*' }, legColour: 'ink', crest: { h: 4, back: 3, w: 1.6 } })),
];

export default [...land, ...sea, ...small, ...myth, ...birds];
