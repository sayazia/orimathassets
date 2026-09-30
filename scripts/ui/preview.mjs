// Preview page for ui2d/: every file on a blurred (depth of field) paper backdrop, plus one race HUD put
// together the way the game does it, with the numbers set from the paper glyph atlases.

// Out-of-focus paper desk: soft blobs of the palette on the back paper colour, with a fine grain.
export function previewBackground(W, H) {
  const blobs = [['#3FB6A0', 0.1, 0.15, 420], ['#F2716B', 0.85, 0.2, 360], ['#F9C74F', 0.7, 0.85, 460], ['#B198EA', 0.2, 0.8, 380], ['#3469C4', 0.5, 0.5, 300], ['#FFF8EC', 0.35, 0.35, 520]];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
<filter id="dof" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="90"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.3 0.3 0.3 0 -0.38"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
<rect width="${W}" height="${H}" fill="#F6E3C0"/>
<g filter="url(#dof)" opacity="0.55">${blobs.map(([c, x, y, r], i) => i % 2 ? `<rect x="${x * W - r}" y="${y * H - r * 0.6}" width="${r * 2}" height="${r * 1.2}" fill="${c}" transform="rotate(${i * 9 - 20} ${x * W} ${y * H})"/>` : `<circle cx="${x * W}" cy="${y * H}" r="${r}" fill="${c}"/>`).join('')}</g>
<rect width="${W}" height="${H}" fill="#000" filter="url(#grain)" opacity="0.35"/></svg>`;
}

// Out-of-focus room seen through the headset, a little dark: wall, window light, a shelf and a sofa, all blurred.
export function previewRoom(W, H) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><filter id="dof" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="38"/></filter>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B5A5E"/><stop offset="1" stop-color="#3C3A3D"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#wall)"/>
<g filter="url(#dof)"><rect x="${W * 0.62}" y="${H * 0.1}" width="${W * 0.26}" height="${H * 0.46}" fill="#C9C3B2"/><rect x="${W * 0.64}" y="${H * 0.12}" width="${W * 0.22}" height="${H * 0.42}" fill="#E6DFC9" opacity="0.8"/>
<rect x="${W * 0.05}" y="${H * 0.18}" width="${W * 0.3}" height="${H * 0.05}" fill="#6B5541"/><rect x="${W * 0.08}" y="${H * 0.1}" width="${W * 0.04}" height="${H * 0.08}" fill="#8E3F3A"/><rect x="${W * 0.14}" y="${H * 0.12}" width="${W * 0.05}" height="${H * 0.06}" fill="#355C7D"/>
<rect x="0" y="${H * 0.7}" width="${W}" height="${H * 0.3}" fill="#2E2A28"/><rect x="${W * 0.1}" y="${H * 0.52}" width="${W * 0.42}" height="${H * 0.26}" rx="40" fill="#4E5D55"/></g></svg>`;
}

// The four test backgrounds every emboss (E) file must stay readable on (brief 1.1).
const TESTS = [['dof', 'url(preview_bg.jpg) 30% 40%/900px auto'], ['cream', '#F6E3C0'], ['teal', '#3FB6A0'], ['room', 'url(preview_room.jpg) 20% 60%/1400px auto']];

const GROUPS = [
  ['brand', 'Brand'], ['menu', 'Menu'], ['placement', 'Book placement'], ['race', 'Race HUD'], ['question', 'Questions and feedback'],
  ['recap', 'Recap'], ['web', 'Browser'], ['pause', 'Pause and saving'], ['buttons', 'Buttons'], ['icons', 'Small icons (128 px)'], ['icons_large', 'Large icons (512 px)'],
];

export function previewHtml(manifest, font) {
  const byDir = (d) => manifest.filter((m) => m.file.startsWith(`ui2d/${d}/`));
  const img = (m, sc = 2) => `<img src="${m.file.slice(5)}" width="${Math.round(m.px[0] / sc)}" height="${Math.round(m.px[1] / sc)}" alt="${m.text || m.name}">`;
  const card = (m) => m.treatment === 'emboss'
    ? `<figure class="tests">${TESTS.map(([k, bg]) => `<div class="tile" style="background:${bg}" title="${k}">${img(m, m.px[0] > 900 ? 3 : 2)}</div>`).join('')}<figcaption>${m.name}<br><span>${m.px.join(' x ')} · ${m.size_class} · ${m.treatment} · P${m.priority}</span></figcaption></figure>`
    : `<figure>${img(m)}<figcaption>${m.name}<br><span>${m.px.join(' x ')} · ${m.size_class} · ${m.treatment} · P${m.priority}</span></figcaption></figure>`;
  const sections = GROUPS.map(([d, t]) => `<section><h2>${t}</h2><div class="grid">${byDir(d).map(card).join('')}</div></section>`).join('');
  const slot = (n) => JSON.stringify(manifest.find((m) => m.name === n));
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Numeria Arena UI</title>
<style>
:root{--ink:#3A3F4B}
body{margin:0;font:14px/1.4 system-ui,sans-serif;color:var(--ink);background:#F6E3C0 url(preview_bg.jpg) center/cover fixed}
main{max-width:1500px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:22px;margin:8px 0 4px}h2{font-size:16px;margin:36px 0 10px;padding-top:12px;border-top:1px solid #3A3F4B22}
p{max-width:70ch}
.grid{display:flex;flex-wrap:wrap;gap:14px 18px;align-items:flex-end}
figure{margin:0;max-width:100%}figure img{display:block;max-width:100%;height:auto}
figcaption{font-size:12px;padding-left:6px}figcaption span{opacity:.6}
.tests{display:flex;flex-wrap:wrap;gap:4px;align-items:stretch}.tests figcaption{flex-basis:100%}.tile{padding:6px;border-radius:6px;display:flex;align-items:center}
#hud{position:relative;width:1280px;max-width:100%;aspect-ratio:16/9;background:url(preview_bg.jpg) center/cover;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px #0002}
#hud>*{position:absolute}
.glyphs img{max-width:100%}
</style></head><body><main>
<h1>Numeria Arena UI, batch U1</h1>
<p>Every file from ui2d/manifest.json at half size (the PNGs are 2x). Emboss (E) files are shown on the four test backgrounds: blurred paper, cream, teal and a dark blurred room. The race HUD below is put together from the pieces, with every number set from the paper glyph atlases.</p>
<section><h2>Race HUD example</h2><div id="hud"></div></section>
<section class="glyphs"><h2>Paper glyphs (atlases E, W and K)</h2>
<div class="tests">${TESTS.map(([k, bg]) => `<div class="tile" style="background:${bg}"><img src="font/paper_glyphs_E.png" width="340"></div>`).join('')}</div>
<img src="font/paper_glyphs_W.png" width="512" style="background:#3469C4"> <img src="font/paper_glyphs_K.png" width="512" style="background:#FFFDF8">
<div id="readtest"></div></section>
${sections}
</main>
<script>
const MAN = ${JSON.stringify(Object.fromEntries(manifest.map((m) => [m.name, { px: m.px, slots: m.slots }])))};
const FONT = ${JSON.stringify({ glyphs: font.glyphs, kerning: font.kerning, height: font.height, tabular_advance: font.tabular_advance })};
const atlases = {};
const load = (k) => atlases[k] ??= new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'font/paper_glyphs_' + k + '.png'; });
// Sets text in paper glyphs: returns a canvas at the given letter height (px), optionally tinted.
async function paperText(text, atlas, lh, tint) {
  const img = await load(atlas), s = lh / FONT.height, pad = 10 * s;
  let w = 0, prev = null;
  for (const ch of text) { const g = FONT.glyphs[ch]; w += g.advance * s + (prev ? (FONT.kerning[prev + ch] ?? 0) * s : 0); prev = ch; }
  const c = document.createElement('canvas'); c.width = Math.ceil(w + 2 * pad); c.height = Math.ceil(lh + 2 * pad);
  const x = c.getContext('2d'); let pen = pad; prev = null;
  for (const ch of text) {
    const g = FONT.glyphs[ch]; if (prev) pen += (FONT.kerning[prev + ch] ?? 0) * s;
    const [cx, cy, cw, chh] = g.cell; x.drawImage(img, cx, cy, cw, chh, pen - g.origin[0] * s, pad - g.origin[1] * s, cw * s, chh * s);
    pen += g.advance * s; prev = ch;
  }
  if (tint) { x.globalCompositeOperation = 'source-in'; x.fillStyle = tint; x.fillRect(0, 0, c.width, c.height); }
  c.style.width = c.width / 2 + 'px'; c.dataset.pad = pad;
  return c;
}
const hud = document.getElementById('hud');
const put = (src, x, y) => { const i = new Image(); i.src = src; i.onload = () => { i.style.width = i.naturalWidth / 2 + 'px'; }; i.style.left = x + 'px'; i.style.top = y + 'px'; hud.append(i); return i; };
// places set text centred in a manifest slot of an image placed at (x, y) (all at half size)
async function inSlot(m, x, y, text, atlas, tint, lh) {
  const s = m.slots[0], c = await paperText(text, atlas, lh ?? s.h, tint);
  c.style.left = x + (s.x + s.w / 2 - c.width / 2) / 2 + 'px'; c.style.top = y + (s.y + s.h / 2 - c.height / 2) / 2 + 'px'; hud.append(c);
}
async function textAt(text, atlas, lh, x, y, tint) { const c = await paperText(text, atlas, lh, tint); c.style.left = x + 'px'; c.style.top = y + 'px'; hud.append(c); return c; }
(async () => {
  put('race/race_wave_2.png', 440, 12);
  put('race/race_clock_frame.png', 1080, 20);
  await inSlot(${slot('race_clock_frame')}, 1080, 20, '0:42', 'K', '#1F4FA3', 72);
  const px = (n) => MAN[n].px[0] / 2;
  const rows = [['1st', 'you', 5, 40], ['2nd', 'clip', 4, 30], ['3rd', 'crease', 3, 20]];
  for (const [i, [p, n, solved, pts]] of rows.entries()) {
    const y = 140 + i * 66;
    put('race/race_place_' + p + '.png', 12, y - 14);
    put('race/race_name_' + n + '.png', 12 + px('race_place_' + p) - 8, y);
    let x = 12 + px('race_place_3rd') - 8 + px('race_name_crease') - 6;
    const a = await textAt(String(solved), 'K', 30, x, y + 6); x += a.width / 2 - 4;
    put('race/race_word_solved.png', x, y + 1); x += px('race_word_solved') - 6;
    const b = await textAt(String(pts), 'K', 30, x, y + 6); x += b.width / 2 - 4;
    put('race/race_word_pts.png', x, y + 1);
  }
  put('question/card_question_medium.png', 430, 330);
  await inSlot({ slots: [{ x: 0, y: 0, w: 820, h: 190 }] }, 430, 330, '7×8=?', 'K', '#1F4FA3', 72);
  for (const [i, v] of ['54', '56', '63'].entries()) { put('question/tag_answer_balloon.png', 470 + i * 130, 470); await inSlot(${slot('tag_answer_balloon')}, 470 + i * 130, 470, v, 'K', null, 44); }
  put('question/feedback_points.png', 500, 610);
  await inSlot(${slot('feedback_points')}, 500, 610, '+10', 'W', null, 72);
  put('race/robot_nice_cobalt.png', 1010, 420);
  put('race/race_name_clip.png', 1030, 560);
  put('question/timer_strip_correct.png', 470, 565);
  const rt = document.getElementById('readtest');
  for (const [k, bg] of [['K', '#FFFDF8'], ['W', '#3469C4'], ['E', '#3FB6A0'], ['E', '#F6E3C0']]) { const c = await paperText('1717 0O0O 6969 0:42', k, 30); c.style.background = bg; c.style.margin = '8px'; rt.append(c); }
})();
</script></body></html>
`;
}
