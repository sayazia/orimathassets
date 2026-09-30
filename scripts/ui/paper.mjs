// Numeria Arena UI pieces: a paper shape (rectangle, circle, parallelogram, ribbon, speech bubble) with
// paper lettering, in three treatments (brief U1 section 1.1):
//   E  transparent emboss (the main one): no fill of its own (white 5%), so whatever is behind shows through;
//      shape and letters read only from a lit edge (white) on the top left and a dark edge (black) on the
//      bottom right, letters at half strength
//   W  on colour: a role colour face, cream letters with a #F6E3C0 dark side, lifted a little
//   K  solid paper: #FFFDF8 face for question cards and number tags; the game writes ink text on it
// Light always comes from the top left. Outside the shape is transparent; the shadow is baked into the PNG.
// The shape shadow is the brief's drop (offset 6, blur 14, black 15% at M size, scaled per class), faded
// out towards the left edge so that edge sits flat on the background like the approved stickers.
import { layoutLine, INK_H } from './glyphs.mjs';
import { place } from './icons.mjs';

export const INK = { paper: '#FFF8EC', paper_back: '#F6E3C0', ink: '#3A3F4B', question: '#1F4FA3' };
export const FACE_K = '#FFFDF8';
// E strengths: shape edges at full strength, letters at half (brief: light 55-65%, dark 12-18%, shadow 15%)
export const EMBOSS = { light: 0.62, dark: 0.16, fill: 0.05, shadow: 0.15, edge: 2.5, letterDark: 0.8 };

// Size classes: PNG height, letter height, world height of that PNG height.
export const CLASSES = {
  XL: { png: 400, lh: 190, world: 0.07 },
  L: { png: 256, lh: 120, world: 0.05 },
  M: { png: 160, lh: 72, world: 0.035 },
  S: { png: 96, lh: 44, world: 0.022 },
  XS: { png: 64, lh: 30, world: 0.016 },
};

export const mix = (hex, to, t) => {
  const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16), ch = (n, s) => (n >> s) & 255;
  return '#' + [16, 8, 0].map((s) => Math.round(ch(a, s) + (ch(b, s) - ch(a, s)) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
};
const f = (n) => +n.toFixed(2);
const P = (pts) => pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');

// Deterministic 0.5 px wobble along the paper edges (cut paper is never perfectly straight).
function rng(seed) { let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
function wobble(pts, seed, amp = 0.5, step = 22) {
  const r = rng(seed), out = [];
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length], l = Math.hypot(bx - ax, by - ay);
    const n = Math.max(1, Math.round(l / step)), nx = -(by - ay) / l, ny = (bx - ax) / l;
    out.push([ax, ay]); // corners stay sharp
    for (let j = 1; j < n; j++) { const t = j / n, d = (r() * 2 - 1) * amp; out.push([ax + (bx - ax) * t + nx * d, ay + (by - ay) * t + ny * d]); }
  }
  return out;
}
const circlePts = (cx, cy, r, n = 120) => [...Array(n).keys()].map((i) => { const a = (i / n) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
function roundRect(x, y, w, h, rad, n = 6) {
  const pts = [];
  for (const [cx, cy, a0] of [[x + w - rad, y + rad, -90], [x + w - rad, y + h - rad, 0], [x + rad, y + h - rad, 90], [x + rad, y + rad, 180]]) {
    for (let i = 0; i <= n; i++) { const a = ((a0 + (i / n) * 90) * Math.PI) / 180; pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); }
  }
  return pts;
}

const BIG = 'x="-10000" y="-10000" width="20000" height="20000"';
// Bevel of a transparent raised shape: a lit band inside the top-left edges and a dark band inside the
// bottom-right edges, each the shape minus itself shifted by d. `body` is polygons with no fill.
export function bevel(body, d, light, dark, id, swap = false) {
  const [l, k] = swap ? [dark, light] : [light, dark];
  const m = (mid, dx) => `<mask id="${mid}" maskUnits="userSpaceOnUse" ${BIG}><g fill="#fff">${body}</g><g fill="#000" transform="translate(${f(dx)} ${f(dx)})">${body}</g></mask>`;
  return `<defs>${m(id + 'L', d)}${m(id + 'D', -d)}</defs>`
    + `<rect ${BIG} fill="${swap ? '#000' : '#fff'}" opacity="${f(l)}" mask="url(#${id}L)"/>`
    + `<rect ${BIG} fill="${swap ? '#fff' : '#000'}" opacity="${f(k)}" mask="url(#${id}D)"/>`;
}
const outsideMask = (id, body) => `<mask id="${id}" maskUnits="userSpaceOnUse" ${BIG}><rect ${BIG} fill="#fff"/><g fill="#000">${body}</g></mask>`;

// Lettering from polygons (px). E: bevel at half strength and a short shadow outside the letters;
// W: cream with a #F6E3C0 dark side and a short shadow of the background darkened 20%; K: flat ink.
// state 'pressed' swaps the lit and dark edges, 'off' halves the effects. `id` keeps defs unique.
export function lettering(polys, treatment, lh, id, bg, state, ink = INK.ink) {
  const s = Math.max(0.75, lh / 72); // 2 px shadow at M letters, scaled with the letter height (at least 1.5 px)
  const body = polys.map((p) => `<polygon points="${P(p)}"/>`).join('');
  const d = Math.max(1, lh * 0.022);
  const use = (fill, dx, dy, extra = '') => `<use href="#${id}" x="${f(dx)}" y="${f(dy)}" fill="${fill}" stroke="${fill}"${extra}/>`;
  const blur = `<filter id="${id}b" x="-10%" y="-10%" width="120%" height="130%"><feGaussianBlur stdDeviation="${f(Math.max(0.4, 0.7 * s))}"/></filter>`;
  let out = `<defs><g id="${id}" stroke-width="${f(Math.max(0.1, lh * 0.004))}" stroke-linejoin="round">${body}</g>${blur}</defs>`;
  if (treatment === 'K') {
    out += use(ink, 0, 0);
  } else if (treatment === 'E') {
    // letters: the brief's half strength for the lit edge; the dark edge and shadow at LETTER_DARK of full,
    // so thin strokes still read on light paper (the lit edge alone disappears there)
    const k = (state === 'off' ? 0.5 : 1) * 0.5, kd = (state === 'off' ? 0.5 : 1) * EMBOSS.letterDark, pressed = state === 'pressed';
    out += `<defs>${outsideMask(id + 'o', body)}</defs>`;
    if (!pressed) out += `<g mask="url(#${id}o)">${use('#000', 2 * s, 2 * s, ` filter="url(#${id}b)" opacity="${f(EMBOSS.shadow * kd)}"`)}</g>`;
    out += `<g fill="#fff">${body.replace(/<polygon /g, `<polygon opacity="${f(EMBOSS.fill * k)}" `)}</g>`;
    out += bevel(body, Math.max(1, EMBOSS.edge * s * 0.8), EMBOSS.light * k, EMBOSS.dark * kd, id + 'v', pressed);
  } else {
    const shadow = bg ? mix(bg, '#000000', 0.2) : '#000000';
    out += use(shadow, 2 * s, 2 * s, ` filter="url(#${id}b)"${bg ? '' : ' opacity="0.2"'}`) + use(INK.paper_back, d * 0.8, d * 0.8) + use(INK.paper, 0, 0);
  }
  return out;
}

// Soft shape shadow for a face polygon, fading in from the left edge; plus a faint top line.
function faceShadow(face, box, s, id, strength = 1, cut = null) {
  const [x, y, w, h] = box, dx = 6 * s, sd = 7 * s; // blur 14 px ~ Gaussian deviation 7
  const fadeTo = x + Math.min(w * 0.4, h * 1.6);
  return `<defs><filter id="${id}s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f(sd)}"/></filter>`
    + `<filter id="${id}h" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${f(Math.max(1, 1.5 * s))}"/></filter>`
    + `<linearGradient id="${id}g" x1="${f(x)}" y1="0" x2="${f(fadeTo)}" y2="0" gradientUnits="userSpaceOnUse">${[0, 0.25, 0.5, 0.75, 1].map((t) => `<stop offset="${t}" stop-color="#fff" stop-opacity="${f(t * t * (3 - 2 * t))}"/>`).join('')}</linearGradient>`
    + `<mask id="${id}m" maskUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000"><rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#${id}g)"/></mask></defs>`
    + (cut ? outsideMask(id + 'x', cut) : '')
    + `<g${cut ? ` mask="url(#${id}x)"` : ''}><g mask="url(#${id}m)"><polygon points="${P(face)}" transform="translate(${f(dx)} ${f(dx)})" fill="#000" opacity="${f(EMBOSS.shadow * strength)}" filter="url(#${id}s)"/></g>`
    + `<polygon points="${P(face)}" transform="translate(0 ${f(-1.2 * Math.max(1, s))})" fill="#000" opacity="${f(0.035 * strength)}" filter="url(#${id}h)"/></g>`;
}
// Very even sheen: the paper turns a touch lighter towards the right (LABEL_STYLE.smooth of the stickers).
function sheen(face, box, id) {
  const [x, , w] = box;
  return `<defs><linearGradient id="${id}l" x1="${f(x)}" y1="0" x2="${f(x + w)}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0.25" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0.045"/></linearGradient></defs>`
    + `<polygon points="${P(face)}" fill="url(#${id}l)"/>`;
}

// Splits text into lines for round shapes: picks the break that makes the block closest to square.
function bestLines(text, lh, aspect = 1) {
  const words = text.split(' ');
  let best = [text], bestScore = Infinity;
  const tries = [[text]];
  for (let i = 1; i < words.length; i++) tries.push([words.slice(0, i).join(' '), words.slice(i).join(' ')]);
  for (let i = 1; i < words.length; i++) for (let j = i + 1; j < words.length; j++) tries.push([words.slice(0, i).join(' '), words.slice(i, j).join(' '), words.slice(j).join(' ')]);
  for (const t of tries) {
    const w = Math.max(...t.map((l) => layoutLine(l, lh).width)), h = t.length * lh + (t.length - 1) * lh * 0.4;
    const score = Math.hypot(w, h * aspect) + (t.length - 1) * lh * 0.3;
    if (score < bestScore) { bestScore = score; best = t; }
  }
  return best;
}

// Builds one piece. opts: { name, text, shape R|C|J|P|B, treatment E|W|K, bg, state (pressed|off), cls, width (face width override),
// faceH (face height override), lines, border (hex, inner rim), slotText (blank face sized for this text),
// tall (face height factor), icon (100-box polygons left of the text), symbol (100-box polygons on a round face), square }
export function piece(opts) {
  const { name, shape, treatment, cls } = opts;
  const C = CLASSES[cls], lh = opts.lh ?? C.lh, s = lh / 72;
  const bg = treatment === 'W' ? opts.bg : FACE_K;
  const text = opts.text ?? '';
  const gapY = lh * 0.4;
  const lines = text ? (opts.lines ?? ((shape === 'C' || shape === 'B') && text.includes(' ') ? bestLines(text, lh, shape === 'B' ? 1.4 : 1) : [text])) : [];
  const lays = lines.map((l) => layoutLine(l, lh));
  const state = opts.state, E = treatment === 'E', k = state === 'off' ? 0.5 : 1;
  const measure = opts.slotText ? layoutLine(opts.slotText, lh) : null; // blank shapes sized for the text the game writes
  const iconW = opts.icon ? lh * 1.05 + lh * 0.35 : 0;
  const textW = Math.max(measure ? measure.width : 0, ...lays.map((l) => l.width)) + iconW;
  const textH = lines.length ? lines.length * lh + (lines.length - 1) * gapY : lh;
  const padX = lh * 0.6, padY = lh * 0.35;

  // Face size and polygon, in a local frame with the face box at (0, 0).
  let fw, fh, face, textBox, extraTop = 0, extraBottom = 0, extraLeft = 0, extraRight = 0, tails = '';
  const skew = Math.tan((12 * Math.PI) / 180);
  if (shape === 'C') {
    const dia = opts.width ?? Math.ceil(Math.hypot(textW + lh * 0.5, textH + lh * 0.7));
    fw = fh = dia;
    face = wobble(circlePts(dia / 2, dia / 2, dia / 2), name, 0.5, 9999);
    textBox = [0, 0, dia, dia];
  } else if (shape === 'B') {
    fw = opts.width ?? Math.ceil(Math.max(textW + 2 * padX, 1.4 * (textH + 2 * padY)));
    fh = Math.round(fw / 1.4);
    const tail = fh * 0.28;
    const body = roundRect(0, 0, fw, fh, fh * 0.2);
    // tail on the bottom edge towards the left, pointing down-left
    const bl = body.findIndex(([px, py]) => py >= fh - 0.01 && px <= fw * 0.2 + 1e-6);
    const pts = [];
    for (const p of body) { pts.push(p); if (p === body[bl - 1]) pts.push([fw * 0.36, fh], [fw * 0.08, fh + tail], [fw * 0.2, fh]); }
    face = wobble(pts, name);
    extraBottom = tail;
    textBox = [0, 0, fw, fh];
  } else if (shape === 'J') {
    fh = opts.faceH ?? Math.round(lh + 2 * padY);
    const sk = fh * skew;
    fw = opts.width ?? Math.ceil(textW + 2 * padX + sk * 0.6);
    face = wobble([[sk, 0], [fw + sk, 0], [fw, fh], [0, fh]], name);
    extraRight = sk;
    textBox = [sk / 2, 0, fw, fh];
  } else if (shape === 'P') {
    fh = opts.faceH ?? Math.round(lh + 2 * padY);
    fw = opts.width ?? Math.ceil(textW + 2 * padX);
    // back tails: lower, notched, a shade darker, with a darker fold triangle where they tuck under
    const drop = fh * 0.22, e = fh * 0.62, n = fh * 0.3, tuck = fh * 0.26;
    const tailL = [[-e, drop], [tuck, drop], [tuck, fh + drop], [-e, fh + drop], [-e + n, drop + fh / 2]];
    const tailR = [[fw - tuck, drop], [fw + e, drop], [fw + e - n, drop + fh / 2], [fw + e, fh + drop], [fw - tuck, fh + drop]];
    const back = mix(bg, '#000000', 0.1), fold = mix(bg, '#000000', 0.2);
    tails = { polys: [tailL, tailR], back, fold, folds: [[[0, fh], [tuck, fh], [tuck, fh + drop]], [[fw, fh], [fw - tuck, fh], [fw - tuck, fh + drop]]] };
    face = wobble([[0, 0], [fw, 0], [fw, fh], [0, fh]], name);
    extraLeft = e; extraRight = e; extraBottom = drop;
    textBox = [0, 0, fw, fh];
  } else {
    fh = opts.faceH ?? Math.round((textH + 2 * padY) * (opts.tall ?? 1));
    fw = opts.width ?? Math.ceil(textW + 2 * padX);
    face = wobble([[0, 0], [fw, 0], [fw, fh], [0, fh]], name);
    textBox = [0, 0, fw, fh];
  }

  // Canvas: room for the shadow (reach ~ offset + 2.5 deviations) mostly to the right and below.
  const reach = 6 * s + 7 * s * 2.4;
  const mL = Math.ceil(extraLeft + reach * 0.25 + 1), mT = Math.ceil(reach * 0.35);
  let W = Math.ceil(mL + fw + extraRight + reach), H = Math.ceil(mT + fh + extraBottom + reach);
  let ox = mL, oy = mT;
  const Hmin = C.png; // at least the class height, face centred on the class band like the brief's table
  if (H < Hmin && shape !== 'C') { const extra = Hmin - H; oy += Math.floor(extra * 0.35); H = Hmin; }
  if (shape === 'C' && opts.square) { const side = Math.max(W, H, opts.square); ox += Math.floor((side - W) * 0.35); oy += Math.floor((side - H) * 0.35); W = H = side; }
  // rectangles and parallelograms keep the class height exactly; the faint end of the shadow tail may be trimmed
  if (H > Hmin && (shape === 'R' || shape === 'J') && !opts.tall && !opts.faceH) H = Hmin;
  W += W % 2; H += H % 2;
  const tr = (pts) => pts.map(([px, py]) => [px + ox, py + oy]);
  const faceG = tr(face), box = [ox, oy, fw, fh], id = name.replace(/[^a-z0-9]/gi, '');

  const poly = (pts) => `<polygon points="${P(pts)}"/>`;
  const tailG = tails ? tails.polys.map((p) => wobble(tr(p), name + p.length)) : [];
  const allBody = [faceG, ...tailG].map(poly).join('');
  // shadow outside the shape only (an E face is see-through, so it must not darken what is behind it)
  let out = state === 'pressed' ? '' : faceShadow(faceG, box, s, id, k, E ? allBody : null);
  if (tails) {
    if (state !== 'pressed') out += tailG.map((p, i) => faceShadow(p, i ? [ox + fw, oy, extraLeft, fh] : [ox - extraLeft, oy, extraLeft, fh], s, id + 'ab'[i], k, E ? allBody : null)).join('');
    if (E) {
      // tails tuck under the face: draw them only outside it
      const tb = tailG.map(poly).join('');
      out += `<defs>${outsideMask(id + 'f', poly(faceG))}</defs><g mask="url(#${id}f)"><g fill="#fff" opacity="${f(EMBOSS.fill * k * 0.6)}">${tb}</g>`
        + bevel(tb, Math.max(1, EMBOSS.edge * s), EMBOSS.light * k * 0.8, EMBOSS.dark * k, id + 'tv', state === 'pressed')
        + tails.folds.map((p) => `<polygon points="${P(tr(p))}" fill="#000" opacity="${f(0.1 * k)}"/>`).join('') + '</g>';
    } else {
      out += tailG.map((p) => `<polygon points="${P(p)}" fill="${tails.back}"/>`).join('');
      out += tails.folds.map((p) => `<polygon points="${P(tr(p))}" fill="${tails.fold}"/>`).join('');
    }
  }
  if (E) out += `<polygon points="${P(faceG)}" fill="#fff" opacity="${f(EMBOSS.fill * k)}"/>` + bevel(poly(faceG), Math.max(1, EMBOSS.edge * s), EMBOSS.light * k, EMBOSS.dark * k, id + 'sv', state === 'pressed');
  else out += `<polygon points="${P(faceG)}" fill="${bg}"/>` + (treatment === 'W' ? sheen(faceG, box, id) : '');
  if (opts.border) {
    const bw = Math.max(2, lh * 0.075);
    const inner = shape === 'C' ? circlePts(ox + fw / 2, oy + fh / 2, fw / 2 - bw) : [[ox + bw, oy + bw], [ox + fw - bw, oy + bw], [ox + fw - bw, oy + fh - bw], [ox + bw, oy + fh - bw]];
    out += `<path d="M${P(faceG).replace(/ /g, ' L')} Z M${P(inner).replace(/ /g, ' L')} Z" fill="${opts.border}" fill-rule="evenodd"/>`;
  }

  // Lettering, centred in the text box (the J face centres on its middle line).
  const [bx, by, bw2, bh] = textBox;
  let ty = oy + by + (bh - textH) / 2;
  const slots = [];
  const polys = [];
  let iconSvg = '';
  lays.forEach((lay, i) => {
    const lw = lay.width + (i === 0 ? iconW : 0);
    let lx = ox + bx + (bw2 - lw) / 2;
    if (i === 0 && opts.icon) { iconSvg = lettering(place(opts.icon, lx, ty - lh * 0.05, lh * 1.1), treatment, lh, id + 'c', treatment === 'W' ? bg : null, state); lx += iconW; }
    const dx = lx - lay.inkMin;
    for (const p of lay.polys) polys.push(p.map(([px, py]) => [px + dx, py + ty]));
    for (const sl of lay.slots) slots.push({ x: Math.round(sl.x + dx), y: Math.round(ty), w: Math.round(sl.w), h: Math.round(lh), digits: sl.digits });
    ty += lh + gapY;
  });
  if (measure) { const th = textH * (opts.tall ?? 1); slots.push({ x: Math.round(ox + (fw - measure.width) / 2), y: Math.round(oy + (fh - th) / 2), w: Math.round(measure.width), h: Math.round(th), text: opts.slotText }); }
  if (opts.symbol) { // a 100-box icon symbol filling most of a round face
    const sz = fw * (opts.symbolScale ?? 0.6), sp = place(opts.symbol, ox + (fw - sz) / 2, oy + (fh - sz) / 2, sz);
    out += lettering(sp, treatment, sz * 0.32, id + 'i', treatment === 'W' ? bg : null, state);
  }
  out += iconSvg;
  if (polys.length) out += lettering(polys, treatment, lh, id + 't', treatment === 'W' ? bg : null, state);
  return { svg: out, W, H, face: [ox, oy, fw, fh], slots, lines, lh };
}
