// Matte paper menu backgrounds: each label slot is cut from the sheet itself and pried up, hinged on
// its right edge, so the left edge lifts and the cut hole shows behind it.
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
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
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
  const hole = mix(base, '#000000', 0.38), holeEdge = mix(base, '#000000', 0.12), crease = mix(base, '#000000', 0.2);
  slots.forEach(({ rect: [x, y, w, h] }, i) => {
    const d = Math.min(w * 0.1, 34), e = Math.min(h * 0.06, 10) + 3; // left edge swings in by d, spreads by e
    defs2 += `<linearGradient id="h${i}" x1="${x}" y1="0" x2="${x + d + 6}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${holeEdge}"/><stop offset="1" stop-color="${hole}"/></linearGradient>`
      + `<linearGradient id="f${i}" x1="${x + d}" y1="0" x2="${x + w}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${mix(base, '#FFFFFF', 0.13)}"/><stop offset="1" stop-color="${mix(base, '#000000', 0.03)}"/></linearGradient>`;
    const P = (pts) => pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
    // the hole the label was cut from, darkest under the lifted edge
    body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#h${i})"/>`;
    // shadow of the lifted flap: nothing at the hinge, widening towards the free left edge
    body += `<polygon points="${P([[x + w, y + h - 2], [x + d, y + h + e - 4], [x + d + 14, y + h + e + 20], [x + w, y + h + 2]])}" fill="${ink}" opacity="0.32" filter="url(#soft)"/>`;
    body += `<polygon points="${P([[x + d, y - e + 6], [x + d + 18, y - e + 10], [x + d + 18, y + h + e - 6], [x + d, y + h + e]])}" fill="${ink}" opacity="0.35" filter="url(#soft)"/>`;
    // the flap: hinged on the right, its left edge nearer the viewer so it reads a little taller
    body += `<polygon points="${P([[x + w, y], [x + w, y + h], [x + d, y + h + e], [x + d, y - e]])}" fill="url(#f${i})"/>`;
    body += `<polygon points="${P([[x + d, y - e], [x + d + 2.5, y - e + 0.3], [x + d + 2.5, y + h + e - 0.3], [x + d, y + h + e]])}" fill="#FFFFFF" opacity="0.18"/>`; // cut edge catching light
    body += `<rect x="${x + w - 1.5}" y="${y}" width="3" height="${h}" fill="${crease}" opacity="0.6"/>`; // hinge crease
  });
  body = body.replace('</defs>', defs2 + '</defs>');
  // matte paper: a fine grain and faint long fibres over everything
  body += `<rect width="${W}" height="${H}" fill="#000" filter="url(#grain)" opacity="0.5"/>`;
  body += `<rect width="${W}" height="${H}" filter="url(#fibres)" opacity="0.1"/>`;
  return body;
}
