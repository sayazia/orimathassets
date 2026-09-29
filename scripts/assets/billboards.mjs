import { PI } from '../lib/parts.mjs';

// Advert "artwork" made of coloured paper blocks (no text, so any brand can be added later).
function artwork(m, w, h, z, scheme) {
  const [bg, a, b, c] = scheme;
  m.box(bg, [-w / 2, 0, z], [w / 2, h, z + 0.004]);
  m.with({ t: [-w * 0.24, h * 0.5, z + 0.004], rx: PI / 2 }, () => m.prism(a, [0, 0], h * 0.3, 0, 0.003, 10));
  m.box(b, [w * 0.02, h * 0.55, z + 0.004], [w * 0.42, h * 0.72, z + 0.007]);
  m.box(c, [w * 0.02, h * 0.3, z + 0.004], [w * 0.32, h * 0.42, z + 0.007]);
  m.box('paper', [w * 0.02, h * 0.12, z + 0.004], [w * 0.2, h * 0.2, z + 0.007]);
}

function pole(m) {
  m.prism('stone', [0, 0], 0.02, 0, 0.36, 6);
  m.box('dark', [-0.2, 0.36, -0.02], [0.2, 0.38, 0.02]);
  m.box('dark', [-0.2, 0.36, -0.015], [0.2, 0.52, 0.0]);
  m.with({ t: [0, 0.37, 0.0] }, () => artwork(m, 0.38, 0.14, 0, ['sky', 'sunflower', 'coral', 'paper']));
  m.box('dark', [-0.2, 0.355, 0.0], [0.2, 0.36, 0.04]);
  for (const x of [-0.12, 0, 0.12]) m.beam('dark', [x, 0.358, 0.03], [x, 0.39, 0.05], 0.004);
}

function wide(m) {
  // Baliho: a wide roadside board on two legs.
  for (const x of [-0.22, 0.22]) m.box('stone', [x - 0.012, 0, -0.012], [x + 0.012, 0.12, 0.012]);
  m.box('dark', [-0.3, 0.12, -0.015], [0.3, 0.3, 0.0]);
  m.with({ t: [0, 0.125, 0] }, () => artwork(m, 0.58, 0.17, 0, ['coral', 'lemon', 'paper', 'navy']));
}

function digital(m) {
  m.box({ sides: 'dark', top: 'dark' }, [-0.03, 0, -0.03], [0.03, 0.2, 0.03]);
  m.box({ sides: 'dark', top: 'dark' }, [-0.16, 0.2, -0.03], [0.16, 0.42, 0.02]);
  const cols = ['purple', 'pink', 'sky', 'mint', 'lemon', 'coral'];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) {
    const x = -0.14 + c * 0.035, y = 0.215 + r * 0.04;
    m.box(cols[(r * 3 + c) % cols.length], [x, y, 0.02], [x + 0.032, y + 0.036, 0.024]);
  }
}

function rooftop(m) {
  // Frame for mounting on a flat roof.
  for (const x of [-0.2, 0, 0.2]) {
    m.box('dark', [x - 0.006, 0, -0.06], [x + 0.006, 0.08, -0.05]);
    m.beam('dark', [x, 0, 0.02], [x, 0.08, -0.05], 0.008);
  }
  m.box('dark', [-0.24, 0.08, -0.06], [0.24, 0.22, -0.045]);
  m.with({ t: [0, 0.085, -0.045] }, () => artwork(m, 0.46, 0.13, 0, ['paper', 'red', 'sunflower', 'sky']));
  for (const x of [-0.16, 0.0, 0.16]) {
    m.beam('dark', [x, 0.22, -0.05], [x, 0.24, -0.0], 0.004);
    m.gem('lemon', [x, 0.24, 0.0], 0.008, 0.006, 4);
  }
}

function standing(m) {
  // Small A-frame shop sign.
  for (const s of [-1, 1]) m.with({ rx: s * 0.2 }, () => m.box(s > 0 ? 'dark' : 'dark', [-0.03, 0, -0.003], [0.03, 0.09, 0.003]));
  m.with({ rx: 0.2 }, () => m.with({ t: [0, 0.015, 0.003] }, () => {
    m.box('paper', [-0.024, 0, 0], [0.024, 0.065, 0.002]);
    for (let i = 0; i < 3; i++) m.box(['coral', 'teal', 'sunflower'][i], [-0.018, 0.012 + i * 0.018, 0.002], [0.012 + (i % 2) * 0.006, 0.02 + i * 0.018, 0.003]);
  }));
}

export default [
  { name: 'billboard_pole', footprint: [1, 1], build: pole },
  { name: 'billboard_wide', footprint: [1, 1], build: wide },
  { name: 'billboard_digital', footprint: [1, 1], build: digital },
  { name: 'billboard_rooftop', footprint: [1, 1], build: rooftop },
  { name: 'billboard_standing', footprint: [1, 1], build: standing },
];
