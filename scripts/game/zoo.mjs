// Origami animals modelled on the two reference books (docs/ORIGAMI_ANIMALS.md): flat planes, a white
// underside colour where the paper turns over, plain round eyes, no ink outline. Millimetres, head to +x.
import { plate, spike, flapLeg, blob, disc, surf, V } from '../lib/origami.mjs';
import { quad, sitter, bird, swimmer, both, patch, stick, band, lerp, flapClip, cols } from '../lib/zoo.mjs';
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

// ================================================================ land animals
const land = [
  ASSET('squirrel', 'origami_land', (rig) => sitter(rig, {
    main: 'terracotta', trim: 'paper', accent: 'pink', H: 34, kx: 0.9, ear: { h: 7, spread: 5.5, inner: null }, head: { s: 0.92, snout: 0.75, wide: 1.05 }, tail: { kind: 'none' },
    extra: (ctx) => { ctx.tailNode = archTail(ctx, { y: 7, up: 26, out: 13, over: 9, w: 7, tipColour: ctx.T }); },
  })),
  ASSET('rabbit', 'origami_land', (rig) => sitter(rig, {
    main: 'paper', trim: 'paper', accent: 'red', eyeColour: 'red', H: 32, ear: { h: 24, spread: 6, x: 3, lean: -2 }, head: { s: 0.9, snout: 0.6 },
  })),
  ASSET('fox', 'origami_land', (rig) => sitter(rig, {
    main: 'orange', trim: 'paper', accent: 'pink', H: 40, ear: { h: 12 }, head: { s: 1, snout: 1.15 }, tail: { kind: 'brush', len: 28, up: 2, w: 6.5, tip: true },
  })),
  ASSET('cat', 'origami_land', (rig) => sitter(rig, {
    main: 'dark', trim: 'paper', accent: 'pink', H: 30, ear: { h: 7 }, head: { s: 1.05, snout: 0.5, wide: 1.12 }, tail: { kind: 'whip', len: 34, w: 2.2 },
    extra: (ctx) => { // the white mask: two cheek patches and a bib
      ctx.head.mesh((m) => both((s) => patch(m, ctx.T, ctx.h.pts, s, [ctx.h.P(3, -5), ctx.h.P(7, -1), ctx.h.P(11.5, -4), ctx.h.P(7, -6.5)].map((p) => [p[0], p[1]]))));
    },
  })),
  ASSET('pig', 'origami_land', (rig) => sitter(rig, {
    main: 'pink', trim: 'paper', accent: 'coral', H: 28, kx: 0.78, Bw: 12, ear: { h: 5, spread: 8.5, z: 8, x: 2, lean: 2, inner: null }, head: { s: 1.05, snout: 0.5, wide: 1.25, blunt: true }, nose: false,
    tail: { kind: 'stub', len: 5 }, bib: false,
    extra: (ctx) => { const h = ctx.h; ctx.head.mesh((m) => { const f = h.front(h.tip[1] + 2); if (!f) return; disc(m, 'coral', f.p, f.n, 5, 4.2, { h: 1.6 }); [1.9, -1.9].forEach((z) => { const q = h.front(h.tip[1] + 2, z); if (q) disc(m, 'ink', [q.p[0] + 1.9, q.p[1], q.p[2]], f.n, 0.8); }); }); },
  })),
  ASSET('beaver', 'origami_land', (rig) => quad(rig, {
    main: 'bark', trim: 'paper', accent: 'paper', L: 34, Hb: 15, legH: 8, W: 9, legW: 4, chest: false, belly: true, head: { s: 0.92, snout: 0.7, wide: 1.05 }, ear: { h: 3, spread: 6, inner: null }, tail: { kind: 'paddle', len: 24, w: 8 }, back: 0.1,
    extra: (ctx) => { const h = ctx.h; ctx.head.mesh((m) => m.hull('paper', [h.P(22, -5.5, 2.4), h.P(22, -5.5, -2.4), h.P(23, -9.5, 2), h.P(23, -9.5, -2), h.P(25, -9.5, 0)])); }, // front teeth
  })),
  ASSET('tiger', 'origami_land', (rig) => quad(rig, {
    main: 'sunflower', trim: 'paper', accent: 'pink', L: 40, Hb: 16, legH: 17, W: 8, head: { s: 1, snout: 0.6 }, ear: { h: 5, inner: null }, tail: { kind: 'up', len: 32 },
    extra: (ctx) => {
      const { x0, x1, yt, yb, bodyPts } = ctx;
      ctx.body.mesh((m) => both((s) => [-14, -7, 0, 7].forEach((dx, i) => {
        const cx = (x0 + x1) / 2 + dx, top = yt - i * 0.4 - 1;
        patch(m, 'ink', bodyPts, s, [[cx - 1.6, top], [cx + 1.6, top - 0.5], [cx + 0.3, top - 9 - (i % 2) * 2]]);
      })));
      ctx.head.mesh((m) => both((sd) => patch(m, 'ink', ctx.h.pts, sd, [ctx.h.P(3.5, 6.2), ctx.h.P(8, 4.6), ctx.h.P(5.5, 3.2)].map((p) => [p[0], p[1]]))));
    },
  })),
  ASSET('hippo', 'origami_land', (rig) => quad(rig, {
    main: 'stone', trim: 'paper', accent: 'pink', L: 42, Hb: 22, legH: 11, W: 13, legW: 6, legZ: 2.4, head: { s: 1.15, snout: 0.62, wide: 1.25, blunt: true, drop: 1 }, ear: { h: 3, spread: 8.5, z: 8, inner: null }, tail: { kind: 'stub', len: 8 }, headY: -3, back: 0.02,
    extra: (ctx) => { const h = ctx.h; ctx.head.mesh((m) => [3.4, -3.4].forEach((z) => { const f = h.front(h.tip[1] + 3.2, z); if (f) disc(m, 'ink', f.p, f.n, 1.1); })); },
  })),
  ASSET('meerkat', 'origami_land', (rig) => sitter(rig, {
    main: 'straw', trim: 'paper', accent: 'bark', H: 48, kx: 0.62, Bw: 8, ear: { h: 3, spread: 5, inner: null }, head: { s: 0.85, snout: 0.85, wide: 1.0 }, tail: { kind: 'whip', len: 38, w: 2, colour: 'bark' }, hop: 10,
    extra: (ctx) => { // dark eye patches
      ctx.head.mesh((m) => both((s) => patch(m, 'bark', ctx.h.pts, s, [ctx.h.P(7.5, 5.6), ctx.h.P(15, 3.6), ctx.h.P(12.5, 1), ctx.h.P(7.5, 2)].map((p) => [p[0], p[1]]))));
    },
  })),
  ASSET('wolf', 'origami_land', (rig) => quad(rig, {
    main: 'blue', trim: 'paper', accent: 'pink', L: 46, Hb: 16, legH: 21, W: 7.5, legW: 3.6, head: { s: 1, snout: 1.35 }, ear: { h: 13 }, tail: { kind: 'brush', len: 34, up: 2, w: 6 }, legSplay: 1.3,
    extra: (ctx) => { // shaggy ruff: spiky planes fanned around the neck
      const { x1, yt, W, body } = ctx;
      body.mesh((m) => both((s) => {
        spike(m, ctx.M, [x1 - 8, yt - 1, s * 2], [x1 - 3, yt - 9, s * (W + 2)], [x1 - 15, yt + 1, s * (W + 4)], [0, 0, s * 1.4], 1.3);
        spike(m, ctx.M, [x1 - 3, yt - 9, s * (W + 2)], [x1 + 2, yt - 15, s * (W - 1)], [x1 - 9, yt - 10, s * (W + 6)], [0, 0, s * 1.2], 1.3);
      }));
    },
  })),
  ASSET('mammoth', 'origami_land', (rig) => quad(rig, {
    main: 'wood', trim: 'paper', accent: 'paper', L: 40, Hb: 27, legH: 13, W: 13, legW: 6.5, legZ: 2.8, chest: false, head: { s: 1.25, snout: 0.5, wide: 1.05, tall: 1.25 }, ear: { h: 2, spread: 10, z: 9, inner: null }, tail: { kind: 'stub', len: 9 }, headY: -7, headX: -1, back: 0.16,
    extra: (ctx) => {
      const { h, head, M } = ctx;
      const at = (x, y) => { const p = h.P(x, y); return [p[0], p[1], 0]; };
      head.mesh((m) => { // trunk: a strip folded down the front of the face, curling up at the tip
        spike(m, M, at(6, -1), at(12, -3), at(15, -32), [1.8, 0, 4.6], 1.5);
        spike(m, M, at(13.6, -26), at(17.4, -30), at(24, -25), [0, 0, 2.6], 1.2);
      });
      both((s) => head.mesh((m) => spike(m, 'paper*', h.P(7, -6, s * 6.4), h.P(10, -1, s * 6.4), h.P(30, -17, s * 8.6), [0, -1, s * 1.2], 1.5))); // curved tusks
      ctx.body.mesh((m) => m.hull(M, [[ctx.x1 - 12, ctx.yt + 1, 0], [ctx.x1 - 20, ctx.yt + 6, 4], [ctx.x1 - 20, ctx.yt + 6, -4], [ctx.x1 - 3, ctx.yt - 2, 7], [ctx.x1 - 3, ctx.yt - 2, -7]])); // shaggy hump
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
  ASSET('walrus', 'origami_sea', (rig) => quad(rig, {
    main: 'sand', trim: 'paper', accent: 'paper', L: 46, Hb: 24, legH: 3, W: 13, legW: 4, chest: false, head: { s: 1.1, snout: 0.55, wide: 1.2, blunt: true, drop: 1 }, ear: { kind: 'none' }, tail: { kind: 'none' }, headX: 1, headY: -8, back: 0.05, legSplay: 1.8,
    extra: (ctx) => { const h = ctx.h; both((s) => ctx.head.mesh((m) => spike(m, 'paper*', h.P(9, -5.6, s * 4.6), h.P(12, -5.6, s * 4.6), h.P(11.5, -24, s * 5.4), [0.6, 0, s * 0.5], 1.6))); }, // tusks
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
    main: 'slate', trim: 'paper', accent: 'sky', L: 46, Hb: 16, legH: 10, W: 9, legW: 4.4, chest: false, head: { s: 0.7, snout: 1.25, wide: 0.75, drop: 3 }, ear: { kind: 'none' }, tail: { kind: 'stub', len: 22 }, headY: -6, headX: 3, back: 0.18, hop: 8,
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
  ASSET('griffin', 'origami_myth', (rig) => quad(rig, {
    main: 'gold', trim: 'paper', accent: 'orange', headMain: 'paper', L: 38, Hb: 16, legH: 15, W: 9, legW: 4.4, chest: false, head: { s: 0.95, snout: 0.5, wide: 0.95, tall: 1.1 }, ear: { kind: 'none' }, tail: { kind: 'brush', len: 24, up: 2, w: 5, tip: true }, headY: 3, nose: false, muzzle: false,
    extra: (ctx) => {
      const { h, head, x0, x1, yt, body } = ctx;
      head.mesh((m) => { // hooked beak
        m.hull('orange', [h.P(20, -1, 3.2), h.P(20, -1, -3.2), h.P(20, 4, 0), h.P(30, -7, 0), h.P(22, -9, 0)]);
        both((s) => spike(m, 'paper*', h.P(0, 9, s * 2), h.P(6, 7, s * 4), h.P(-9, 22, s * 6), [0, 0, s * 1.2], 1.2)); // feather crest
      });
      both((s) => body.mesh((m) => { // big wings: two folded planes each
        spike(m, 'paper*', [x1 - 8, yt - 1, s * 4], [x0 + 8, yt - 2, s * 4], [x0 + 5, yt + 30, s * 22], [0, 0, s * 4], 1.5);
        spike(m, 'paper*', [x1 - 10, yt - 1, s * 5], [x1 - 22, yt - 1, s * 5], [x0 + 12, yt + 24, s * 30], [0, 0, s * 3], 1.5);
      }));
    },
  })),
  ASSET('winged_lion', 'origami_myth', (rig) => quad(rig, {
    main: 'sand', trim: 'paper', accent: 'bark', L: 40, Hb: 17, legH: 15, W: 9, legW: 4.4, chest: false, head: { s: 1, snout: 0.5, wide: 1.1 }, ear: { h: 3, spread: 7, inner: null }, tail: { kind: 'whip', len: 32, w: 2 },
    extra: (ctx) => {
      const { h, head, x1, yt, body } = ctx;
      head.mesh((m) => { // mane: a ring of flat spikes around the face
        m.hull('bark', [h.P(-3, 12, 0), h.P(-6, 4, 12), h.P(-6, 4, -12), h.P(-4, -8, 8), h.P(-4, -8, -8), h.P(-8, -1, 0), h.P(4, 4, 9), h.P(4, 4, -9), h.P(3, -5, 7), h.P(3, -5, -7)]);
      });
      ctx.body.mesh((m) => both((s) => {
        spike(m, 'paper*', [x1 - 8, yt - 1, s * 4], [x1 - 22, yt - 2, s * 4], [x1 - 34, yt + 26, s * 24], [0, 0, s * 4], 1.5);
        spike(m, 'paper*', [x1 - 8, yt - 1, s * 5], [x1 - 14, yt - 1, s * 5], [x1 - 18, yt + 20, s * 32], [0, 0, s * 3], 1.5);
      }));
    },
  })),
  ASSET('dragon', 'origami_myth', (rig) => quad(rig, {
    main: 'paper', trim: 'sky', accent: 'teal', L: 36, Hb: 14, legH: 12, W: 7, legW: 3.6, chest: false, head: { s: 0.95, snout: 0.75, wide: 0.95 }, ear: { h: 8, inner: 'teal', spread: 7 }, tail: { kind: 'brush', len: 34, up: -2, w: 5, tip: true, colour: 'paper' }, headY: 4, hop: 12,
    extra: (ctx) => {
      const { h, head, x0, x1, yt, body } = ctx;
      head.mesh((m) => both((s) => { stick(m, 'teal', h.P(20, -2, s * 4), h.P(30, -12, s * 12), 0.6); spike(m, 'teal', h.P(3, 8, s * 3), h.P(7, 8, s * 3), h.P(-8, 24, s * 5), [0, 0, s * 0.8], 1); })); // whiskers and horns
      body.mesh((m) => { for (let i = 0; i < 6; i++) { const x = x1 - 6 - i * 6, y = yt - i * 0.4; plate(m, 'sky*', [[x + 3, y, 0], [x - 3, y, 0], [x, y + 7 - i * 0.6, 0]], 1.4); } }); // dorsal spikes
      body.mesh((m) => both((s) => spike(m, 'sky*', [x1 - 10, yt - 1, s * 3], [x1 - 22, yt - 1, s * 3], [x1 - 22, yt + 18, s * 17], [0, 0, s * 3], 1.3))); // small wings
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
