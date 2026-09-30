// Matte paper menu backgrounds: label slots pressed up out of the same sheet, lifted by soft shadows.
// No text is drawn; the game writes into the slots listed in menu_layout.json.
import { colourOf } from '../lib/palette.mjs';

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
<linearGradient id="face" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${mix(base, '#FFFFFF', 0.05)}"/><stop offset="1" stop-color="${base}"/></linearGradient>
<filter id="lift" x="-20%" y="-30%" width="140%" height="170%">
  <feDropShadow dx="10" dy="14" stdDeviation="13" flood-color="${ink}" flood-opacity="0.34"/>
  <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="${ink}" flood-opacity="0.16"/>
</filter>
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
  let body = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
  for (const { rect: [x, y, w, h] } of slots) {
    // the slot is the same paper as the sheet, only lifted: a wide soft shadow plus a tight contact shadow
    body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#face)" filter="url(#lift)"/>`;
  }
  // matte paper: a fine grain and faint long fibres over everything
  body += `<rect width="${W}" height="${H}" fill="#000" filter="url(#grain)" opacity="0.5"/>`;
  body += `<rect width="${W}" height="${H}" filter="url(#fibres)" opacity="0.1"/>`;
  return defs + body;
}
