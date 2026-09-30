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

const GROUPS = [
  ['brand', 'Brand'], ['menu', 'Menu'], ['placement', 'Book placement'], ['race', 'Race HUD'], ['question', 'Questions and feedback'],
  ['recap', 'Recap'], ['web', 'Browser'], ['pause', 'Pause and saving'], ['buttons', 'Buttons'], ['icons', 'Small icons (128 px)'], ['icons_large', 'Large icons (512 px)'],
];

export function previewHtml(manifest, font) {
  const byDir = (d) => manifest.filter((m) => m.file.startsWith(`ui2d/${d}/`));
  const card = (m) => `<figure style="--w:${m.px[0] / 2}px"><img src="${m.file.slice(5)}" width="${m.px[0] / 2}" height="${m.px[1] / 2}" alt="${m.text || m.name}"><figcaption>${m.name}<br><span>${m.px.join(' x ')} · ${m.size_class} · P${m.priority}</span></figcaption></figure>`;
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
#hud{position:relative;width:1280px;max-width:100%;aspect-ratio:16/9;background:url(preview_bg.jpg) center/cover;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px #0002}
#hud>*{position:absolute}
.glyphs img{background:#FFFDF8;max-width:100%}
</style></head><body><main>
<h1>Numeria Arena UI, batch U1</h1>
<p>Every file from ui2d/manifest.json, shown at half size (the PNGs are 2x) on the blurred paper backdrop the game uses. Below the list is one race HUD put together from the pieces, with every number set from the paper glyph atlases.</p>
<section><h2>Race HUD example</h2><div id="hud"></div></section>
<section class="glyphs"><h2>Paper glyphs (atlases T, W and I)</h2>
<img src="font/paper_glyphs_T.png" width="512"> <img src="font/paper_glyphs_W.png" width="512" style="background:#3469C4"> <img src="font/paper_glyphs_I.png" width="512">
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
  await inSlot(${slot('race_clock_frame')}, 1080, 20, '0:42', 'I', '#1F4FA3', 72);
  const px = (n) => MAN[n].px[0] / 2;
  const rows = [['1st', 'you', 5, 40], ['2nd', 'clip', 4, 30], ['3rd', 'crease', 3, 20]];
  for (const [i, [p, n, solved, pts]] of rows.entries()) {
    const y = 140 + i * 66;
    put('race/race_place_' + p + '.png', 12, y - 14);
    put('race/race_name_' + n + '.png', 12 + px('race_place_' + p) - 8, y);
    let x = 12 + px('race_place_3rd') - 8 + px('race_name_crease') - 6;
    const a = await textAt(String(solved), 'I', 30, x, y + 6); x += a.width / 2 - 4;
    put('race/race_word_solved.png', x, y + 1); x += px('race_word_solved') - 6;
    const b = await textAt(String(pts), 'I', 30, x, y + 6); x += b.width / 2 - 4;
    put('race/race_word_pts.png', x, y + 1);
  }
  put('question/card_question_medium.png', 430, 330);
  await inSlot({ slots: [{ x: 0, y: 0, w: 820, h: 190 }] }, 430, 330, '7×8=?', 'I', '#1F4FA3', 72);
  for (const [i, v] of ['54', '56', '63'].entries()) { put('question/tag_answer_balloon.png', 470 + i * 130, 470); await inSlot(${slot('tag_answer_balloon')}, 470 + i * 130, 470, v, 'I', null, 44); }
  put('question/feedback_points.png', 500, 610);
  await inSlot(${slot('feedback_points')}, 500, 610, '+10', 'W', null, 72);
  put('race/robot_nice_cobalt.png', 1010, 420);
  put('race/race_name_clip.png', 1030, 560);
  put('question/timer_strip_correct.png', 470, 565);
  const rt = document.getElementById('readtest');
  for (const [k, bg] of [['I', '#FFFDF8'], ['W', '#3469C4'], ['T', '#FFFDF8']]) { const c = await paperText('1717 0O0O 6969 0:42', k, 30); c.style.background = bg; c.style.margin = '8px'; rt.append(c); }
})();
</script></body></html>
`;
}
