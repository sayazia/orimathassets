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

// Stand-alone label stickers (transparent PNG) with no paper colour of their own: the face is clear, so
// the background shows through, and only the effects are drawn (peel shadow outside the edge, a faint
// sheen and grain on the face, paper lettering). They pick up any background they are laid on.
// shape 'square' or 'circle'; lines of capitals.
export function menuLabel(shape, lines, size = 360, pad = 48) {
  const shadow = '#000000';
  const P = (pts) => pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
  const x = pad, y = pad, w = size, h = size, cx = x + w / 2, cy = y + h / 2, r = size / 2;
  const lift = Math.min(34, 10 + w * 0.05);
  const shapeEl = (fill) => shape === 'circle' ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>` : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
  let out = `<defs>
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="tight" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="hair" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.2"/></filter>
<filter id="drop" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="1.5" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.2"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.33 0.33 0.33 0 -0.42"/>
  <feComposite in2="SourceGraphic" operator="in"/>
</filter>
<linearGradient id="sheen" x1="${x}" y1="0" x2="${x + w}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0.07"/></linearGradient>
<clipPath id="clip">${shapeEl('#fff')}</clipPath>
<mask id="outside" maskUnits="userSpaceOnUse" x="0" y="0" width="${w + pad * 2}" height="${h + pad * 2}"><rect width="${w + pad * 2}" height="${h + pad * 2}" fill="#fff"/>${shapeEl('#000')}</mask>
</defs>`;
  // shadows sit only outside the face, so nothing darkens the background showing through it
  out += '<g mask="url(#outside)">';
  if (shape === 'circle') {
    // crescent: the disc's shadow slid towards the bottom right, so the left rim stays flat on the sheet
    out += `<circle cx="${cx + lift * 0.35}" cy="${cy + lift * 0.45}" r="${r}" fill="${shadow}" opacity="0.2" filter="url(#soft)"/>`;
    out += `<circle cx="${cx + lift * 0.18}" cy="${cy + lift * 0.25}" r="${r - 2}" fill="${shadow}" opacity="0.14" filter="url(#tight)"/>`;
    out += `<circle cx="${cx}" cy="${cy - 1.5}" r="${r}" fill="${shadow}" opacity="0.07" filter="url(#hair)"/>`;
  } else {
    out += `<polygon points="${P([[x + w * 0.04, y + h - 3], [x + w - 3, y + h * 0.12], [x + w + lift * 0.45, y + h * 0.55], [x + w + lift * 0.6, y + h + lift], [x + w * 0.5, y + h + lift * 0.45]])}" fill="${shadow}" opacity="0.2" filter="url(#soft)"/>`;
    out += `<polygon points="${P([[x + w * 0.35, y + h - 2], [x + w - 2, y + h * 0.6], [x + w + lift * 0.3, y + h + lift * 0.55], [x + w * 0.75, y + h + lift * 0.3]])}" fill="${shadow}" opacity="0.14" filter="url(#tight)"/>`;
    out += `<rect x="${x + 3}" y="${y - 1.5}" width="${w - 6}" height="3" fill="${shadow}" opacity="0.07" filter="url(#hair)"/>`;
  }
  out += '</g>' + shapeEl('url(#sheen)');
  out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000" filter="url(#grain)" opacity="0.35" clip-path="url(#clip)"/>`;
  // lettering: centred lines, white paper with a small tinted shadow
  const words = lines.map((l) => wordFlat(l));
  const k = (size * (shape === 'circle' ? 0.5 : 0.66)) / Math.max(...words.map((wd) => wd.width));
  const lineGap = 3.2, total = words.length * words[0].height + (words.length - 1) * lineGap;
  let ty = cy - (total * k) / 2;
  let letters = '';
  for (const wd of words) {
    const tx = cx - (wd.width * k) / 2;
    letters += `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(3)})">${wd.quads.map((q) => `<polygon points="${P(q)}"/>`).join('')}</g>`;
    ty += (wd.height + lineGap) * k;
  }
  const white = colourOf("paper"); // a hairline stroke in the fill colour hides the seams between ribbon pieces
  out += `<g fill="${white}" stroke="${white}" stroke-width="0.08" stroke-linejoin="round" filter="url(#drop)">${letters}</g>`;
  return { body: out, W: size + pad * 2, H: size + pad * 2 };
}
