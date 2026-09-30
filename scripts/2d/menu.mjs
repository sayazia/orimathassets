// Matte paper menu backgrounds: each label is part of the sheet, still fixed along its left edge while
// its right side peels up, so the shadow grows from nothing at the left to widest at the bottom right.
// No text is drawn; the game writes into the slots listed in menu_layout.json.
import { colourOf } from '../lib/palette.mjs';
import { wordFlat } from './symbols.mjs';

const mix = (hex, to, t) => {
  const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16);
  const ch = (n, s) => (n >> s) & 255;
  return '#' + [16, 8, 0].map((s) => Math.round(ch(a, s) + (ch(b, s) - ch(a, s)) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
};

export const MENU_COLOURS = ['teal', 'sky', 'coral', 'sunflower', 'lavender'];
export const MENU_W = 1920, MENU_H = 1080;

// Slot rectangles [x, y, w, h] in a 1920 x 1080 canvas.
const title = { id: 'title', rect: [510, 80, 900, 150] };
const back = { id: 'back', rect: [70, 80, 130, 130] };
export const MENU_LAYOUTS = {
  // title, two rows of four square tiles, two wide buttons
  menu_grid: [title, back,
    ...[0, 1].flatMap((r) => [0, 1, 2, 3].map((c) => ({ id: `tile_${r * 4 + c}`, rect: [345 + c * 330, 300 + r * 330, 250, 250] }))),
    { id: 'button_0', rect: [480, 950 - 20, 440, 100] }, { id: 'button_1', rect: [1000, 950 - 20, 440, 100] }],
  // title and a column of five wide bars
  menu_list: [title, back,
    ...[0, 1, 2, 3, 4].map((i) => ({ id: `bar_${i}`, rect: [560, 290 + i * 150, 800, 110] }))],
  menu_blank: [],
};

export function menuBackground(key, slots) {
  const base = colourOf(key);
  const light = mix(base, '#FFFFFF', 0.07), dark = mix(base, '#000000', 0.07), ink = mix(base, '#000000', 0.55);
  const defs = `<defs>
<radialGradient id="bg" cx="0.3" cy="0.2" r="1.1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="tight" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="hair" x="-5%" y="-100%" width="110%" height="300%"><feGaussianBlur stdDeviation="1.2"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.33 0.33 0.33 0 -0.42"/>
  <feComposite in2="SourceGraphic" operator="in"/>
</filter>
<filter id="fibres" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="3" seed="3"/>
  <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.5 0 0 0 -0.22"/>
</filter>
</defs>`;
  const W = MENU_W, H = MENU_H;
  let body = defs + `<rect width="${W}" height="${H}" fill="url(#bg)"/>`, defs2 = '';
  const shadow = mix(base, '#000000', 0.42); // tinted, never black
  slots.forEach(({ rect: [x, y, w, h] }, i) => {
    const P = (pts) => pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
    const lift = Math.min(34, 10 + w * 0.05); // how far the free bottom-right corner stands off the sheet
    defs2 += `<linearGradient id="f${i}" x1="${x}" y1="0" x2="${x + w}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${base}"/><stop offset="1" stop-color="${mix(base, '#FFFFFF', 0.06)}"/></linearGradient>`;
    // soft wedge along the bottom and up the right side, zero at the fixed left edge
    body += `<polygon points="${P([[x + w * 0.04, y + h - 3], [x + w - 3, y + h * 0.12], [x + w + lift * 0.45, y + h * 0.55], [x + w + lift * 0.6, y + h + lift], [x + w * 0.5, y + h + lift * 0.45]])}" fill="${shadow}" opacity="0.42" filter="url(#soft)"/>`;
    // tighter, slightly darker core right under the lifted corner
    body += `<polygon points="${P([[x + w * 0.35, y + h - 2], [x + w - 2, y + h * 0.6], [x + w + lift * 0.3, y + h + lift * 0.55], [x + w * 0.75, y + h + lift * 0.3]])}" fill="${shadow}" opacity="0.3" filter="url(#tight)"/>`;
    // very thin shadow along the top edge
    body += `<rect x="${x + 3}" y="${y - 1.5}" width="${w - 6}" height="3" fill="${shadow}" opacity="0.12" filter="url(#hair)"/>`;
    body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#f${i})"/>`;
  });
  body = body.replace('</defs>', defs2 + '</defs>');
  // matte paper: a fine grain and faint long fibres over everything
  body += `<rect width="${W}" height="${H}" fill="#000" filter="url(#grain)" opacity="0.5"/>`;
  body += `<rect width="${W}" height="${H}" filter="url(#fibres)" opacity="0.1"/>`;
  return body;
}

// Sticker style (colour-neutral), chosen from five tries: D, with the inner bend made even and faint.
//   lift   how far the free side stands off the sheet (shadow reach)
//   ramp   shadow sharp and thin near the fixed side, wider and blurrier towards the free corner
//   curve  light band where the paper starts to bend, a little shade where it turns away at the edge
//   edge   thin lit paper thickness along the lifted edges only (0 = none)
//   corner lift only the bottom-right corner (diagonal) instead of the whole right side
//   smooth the bend is one long even sheen with no dark band at the edge, so nothing gathers in a corner
export const LABEL_STYLE = { lift: 0.8, ramp: true, curve: 0.6, edge: 0, corner: false, smooth: true };

// Stand-alone label stickers (transparent PNG) with no paper colour of their own: the face is clear, so
// the background shows through, and only the effects are drawn. The left (or top-left) part stays fully
// clear so it reads as the background itself; the free side peels up. shape 'square' or 'circle'.
export function menuLabel(shape, lines, style = LABEL_STYLE, size = 360, pad = 48) {
  const { lift: L, ramp, curve, edge, corner, smooth } = style;
  const P = (pts) => pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
  const x = pad, y = pad, w = size, h = size, cx = x + w / 2, cy = y + h / 2, r = size / 2;
  const lift = Math.min(34, 10 + w * 0.05) * L;
  const W = w + pad * 2, H = h + pad * 2;
  const shapeEl = (fill, extra = '') => shape === 'circle' ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${extra}/>` : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;
  // gradient axis: left to right for a side lift, top-left to bottom-right for a corner lift
  const [gx1, gy1, gx2, gy2] = corner ? [x, y, x + w, y + h] : [x, 0, x + w, 0];
  const blur = (id, sd) => `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
  const c = (a) => (a * curve).toFixed(3);
  let defs = blur('b1', 1.2) + blur('b2', 3.5) + blur('b3', 7) + blur('b4', 12) + blur('hair', 3)
    + `<filter id="drop" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="1.5" dy="3" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/></filter>`
    + `<linearGradient id="bend" x1="${gx1}" y1="${gy1}" x2="${gx2}" y2="${gy2}" gradientUnits="userSpaceOnUse">`
    + (smooth
      ? `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.25" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="${c(0.07)}"/>`
      : `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${corner ? 0.55 : 0.45}" stop-color="#fff" stop-opacity="0"/>`
        + `<stop offset="${corner ? 0.72 : 0.64}" stop-color="#fff" stop-opacity="${c(0.1)}"/><stop offset="${corner ? 0.86 : 0.84}" stop-color="#fff" stop-opacity="${c(0.02)}"/>`
        + `<stop offset="0.95" stop-color="#000" stop-opacity="${c(0.05)}"/><stop offset="1" stop-color="#000" stop-opacity="${c(0.09)}"/>`)
    + `</linearGradient>`
    + `<linearGradient id="upFade" x1="0" y1="${y}" x2="0" y2="${y + h * 0.8}" gradientUnits="userSpaceOnUse">${[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => `<stop offset="${t}" stop-color="#fff" stop-opacity="${(t * t * (3 - 2 * t)).toFixed(3)}"/>`).join('')}</linearGradient>`
    + `<linearGradient id="sideFade" x1="${x + w * 0.3}" y1="0" x2="${x + w * 0.9}" y2="0" gradientUnits="userSpaceOnUse">${[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => `<stop offset="${t}" stop-color="#fff" stop-opacity="${(t * t * (3 - 2 * t)).toFixed(3)}"/>`).join('')}</linearGradient>`
    + `<mask id="side" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#sideFade)"/></mask>`
    + `<mask id="up" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#upFade)"/></mask>`
    + `<linearGradient id="edgeFade" x1="${gx1}" y1="${gy1}" x2="${gx2}" y2="${gy2}" gradientUnits="userSpaceOnUse"><stop offset="${corner ? 0.6 : 0.4}" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>`
    + `<mask id="outside" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${shapeEl('#000')}</mask>`
    + `<mask id="edgeMask" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#edgeFade)"/></mask>`;
  let out = `<g mask="url(#outside)"><g mask="${corner ? '' : 'url(#up)'}"><g mask="${shape === 'circle' && !corner ? 'url(#side)' : ''}">`;
  // shadows, outside the face only. Each layer reaches further and blurs more, starting later along the lift.
  const layers = ramp ? [[0.02, 0.12, 'b1', 0.16], [0.2, 0.35, 'b2', 0.14], [0.45, 0.7, 'b3', 0.13], [0.65, 1, 'b4', 0.1]] : [[0.04, 0.6, 'b3', 0.2], [0.35, 0.35, 'b2', 0.14]];
  for (const [start, reach, f, op] of layers) {
    const d = lift * reach;
    if (shape === 'circle') {
      // disc shifted towards the free side: the offset grows with reach, so the fixed rim gets none
      const [ox, oy] = corner ? [d * 0.55, d * 0.6] : [d * 0.6, d * 0.35];
      out += `<circle cx="${cx + ox}" cy="${cy + oy}" r="${r - 1}" fill="#000" opacity="${op}" filter="url(#${f})"/>`;
    } else if (corner) {
      const s0 = start;
      out += `<polygon points="${P([[x + w * (0.35 + s0 * 0.5), y + h - 1], [x + w - 1, y + h * (0.35 + s0 * 0.5)], [x + w + d * 0.5, y + h * (0.4 + s0 * 0.5) + d * 0.4], [x + w + d * 0.6, y + h + d * 0.7], [x + w * (0.4 + s0 * 0.5) + d * 0.4, y + h + d * 0.5]])}" fill="#000" opacity="${op}" filter="url(#${f})"/>`;
    } else {
      out += `<polygon points="${P([[x + w * start, y + h - 1], [x + w - 1, y + 1], [x + w + d * 0.55, y + h * 0.3 + d * 0.3], [x + w + d * 0.6, y + h + d], [x + w * (start + (1 - start) * 0.45), y + h + d * 0.55]])}" fill="#000" opacity="${op}" filter="url(#${f})"/>`;
    }
  }
  out += '</g></g>';
  if (shape === 'circle') out += `<circle cx="${cx}" cy="${cy - 1.5}" r="${r}" fill="#000" opacity="0.035" filter="url(#hair)"/>`;
  else out += `<rect x="${x + 3}" y="${y - 1.5}" width="${w - 6}" height="3" fill="#000" opacity="0.035" filter="url(#hair)"/>`;
  out += '</g>';
  if (curve) out += shapeEl('url(#bend)');
  if (edge) {
    // lit paper thickness on the lifted edges, fading out towards the fixed side
    const line = shape === 'circle' ? `<circle cx="${cx}" cy="${cy}" r="${r - 0.8}" fill="none" stroke="#fff" stroke-width="1.6"/>`
      : `<polyline points="${P([[x + 1, y + h - 0.8], [x + w - 0.8, y + h - 0.8], [x + w - 0.8, y + 1]])}" fill="none" stroke="#fff" stroke-width="1.6"/>`;
    out += `<g mask="url(#edgeMask)" opacity="${edge}">${line}</g>`;
  }
  // lettering: centred lines, white paper with a small shadow
  const words = lines.map((l) => wordFlat(l));
  const k = (size * (shape === 'circle' ? 0.5 : 0.66)) / Math.max(...words.map((wd) => wd.width));
  const lineGap = 3.2, total = words.length * words[0].height + (words.length - 1) * lineGap;
  let ty = cy - (total * k) / 2, letters = '';
  for (const wd of words) {
    const tx = cx - (wd.width * k) / 2;
    letters += `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(3)})">${wd.quads.map((q) => `<polygon points="${P(q)}"/>`).join('')}</g>`;
    ty += (wd.height + lineGap) * k;
  }
  const white = colourOf('paper'); // a hairline stroke in the fill colour hides the seams between ribbon pieces
  out += `<g fill="${white}" stroke="${white}" stroke-width="0.08" stroke-linejoin="round" filter="url(#drop)">${letters}</g>`;
  return { body: `<defs>${defs}</defs>` + out, W, H };
}
