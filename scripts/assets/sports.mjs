import { PI, G, plate, patch, treeRound, treePine, bush, bench, fence, lamp, umbrella, palm, flagpole, person, lounger, pool } from '../lib/parts.mjs';

const L = 0.004; // paint thickness
const line = (m, x0, z0, x1, z1, y = G, c = 'paper') => m.box(c, [x0, y, z0], [x1, y + L, z1]);

// Rectangle outline painted on the ground.
function outline(m, x0, z0, x1, z1, y, w = 0.01, c = 'paper') {
  line(m, x0, z0, x1, z0 + w, y, c);
  line(m, x0, z1 - w, x1, z1, y, c);
  line(m, x0, z0, x0 + w, z1, y, c);
  line(m, x1 - w, z0, x1, z1, y, c);
}

function chainFence(m, x0, z0, x1, z1, h = 0.14) {
  const posts = (ax, az, bx, bz) => {
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, bz - az) / 0.15));
    for (let i = 0; i <= n; i++) m.prism('dark', [ax + ((bx - ax) * i) / n, az + ((bz - az) * i) / n], 0.005, G, G + h, 4);
  };
  posts(x0, z0, x1, z0); posts(x0, z1, x1, z1); posts(x0, z0, x0, z1); posts(x1, z0, x1, z1);
  for (const y of [G + h - 0.006, G + h * 0.5]) {
    m.box('dark', [x0, y, z0 - 0.002], [x1, y + 0.005, z0 + 0.002]);
    m.box('dark', [x0, y, z1 - 0.002], [x1, y + 0.005, z1 + 0.002]);
    m.box('dark', [x0 - 0.002, y, z0], [x0 + 0.002, y + 0.005, z1]);
    m.box('dark', [x1 - 0.002, y, z0], [x1 + 0.002, y + 0.005, z1]);
  }
}

function goal(m, x, z, ry) {
  m.with({ t: [x, G, z], ry }, () => {
    for (const s of [-1, 1]) m.box('paper', [s * 0.07 - 0.005, 0, -0.005], [s * 0.07 + 0.005, 0.07, 0.005]);
    m.box('paper', [-0.075, 0.065, -0.005], [0.075, 0.075, 0.005]);
    m.box('kerb', [-0.07, 0.0, -0.04], [0.07, 0.065, -0.036]);
  });
}

function soccer(m) {
  plate(m, 'grass', 'leaf', 2, 1);
  for (let i = 0; i < 8; i++) {
    const x0 = -0.9 + i * 0.225;
    if (i % 2) m.box('leaf', [x0, G, -0.42], [x0 + 0.225, G + 0.002, 0.42]);
  }
  const y = G + 0.002;
  outline(m, -0.9, -0.42, 0.9, 0.42, y);
  line(m, -0.005, -0.42, 0.005, 0.42, y);
  m.arc('paper', [0, 0], 0.12, 0.13, 0, 2 * PI, y, y + L, 16);
  for (const s of [-1, 1]) {
    const xa = s * 0.9, xb = s * 0.64;
    outline(m, Math.min(xa, xb), -0.22, Math.max(xa, xb), 0.22, y);
    const xc = s * 0.8;
    outline(m, Math.min(xa, xc), -0.1, Math.max(xa, xc), 0.1, y);
    goal(m, s * 0.9, 0, s > 0 ? -PI / 2 : PI / 2);
  }
  for (const [x, z, c] of [[-0.3, 0.1, 'coral'], [-0.5, -0.2, 'coral'], [0.2, -0.05, 'sky'], [0.45, 0.2, 'sky'], [-0.82, 0.02, 'sunflower']]) person(m, x, z, x < 0 ? PI / 2 : -PI / 2, { shirt: c, pants: 'paper', pose: 'walk' });
  m.gem('paper', [-0.1, G + 0.012, 0.04], 0.012, 0.012, 5);
  // small stand along the back
  for (let i = 0; i < 3; i++) m.box({ sides: 'stone', top: i % 2 ? 'coral' : 'sky' }, [-0.6, G, -0.5 + i * 0.0], [0.6, G + 0.03 + i * 0.03, -0.44 - i * 0.0 + 0.0]);
}

function basketball(m) {
  plate(m, 'grass');
  m.box({ top: 'blue', sides: 'dark' }, [-0.44, G, -0.4], [0.44, G + 0.006, 0.4]);
  m.box('orange', [-0.4, G + 0.006, -0.3], [0.4, G + 0.008, 0.3]);
  const y = G + 0.008;
  outline(m, -0.4, -0.3, 0.4, 0.3, y);
  line(m, -0.005, -0.3, 0.005, 0.3, y);
  m.arc('paper', [0, 0], 0.07, 0.08, 0, 2 * PI, y, y + L, 12);
  for (const s of [-1, 1]) {
    const xa = s * 0.4, xb = s * 0.24;
    m.box('coral', [Math.min(xa, xb), y, -0.07], [Math.max(xa, xb), y + 0.001, 0.07]);
    m.arc('paper', [s * 0.36, 0], 0.2, 0.21, s > 0 ? PI / 2 : -PI / 2, s > 0 ? 1.5 * PI : PI / 2, y, y + L, 8);
    m.with({ t: [s * 0.43, 0, 0], ry: s > 0 ? -PI / 2 : PI / 2 }, () => {
      m.prism('dark', [0, 0], 0.01, G, 0.28, 5);
      m.box('dark', [-0.005, 0.26, 0], [0.005, 0.27, 0.05]);
      m.box('paper', [-0.06, 0.24, 0.05], [0.06, 0.32, 0.056]);
      m.box('coral', [-0.02, 0.255, 0.056], [0.02, 0.285, 0.058]);
      m.arc('orange', [0, 0.085], 0.022, 0.028, 0, 2 * PI, 0.25, 0.256, 8);
    });
  }
  person(m, -0.12, 0.08, PI / 2, { shirt: 'sunflower', pants: 'dark', pose: 'wave' });
  person(m, 0.1, -0.1, -PI / 2, { shirt: 'mint', pants: 'dark', pose: 'walk' });
  chainFence(m, -0.47, -0.45, 0.47, 0.45);
}

function tennis(m) {
  plate(m, 'grass');
  m.box({ top: 'teal', sides: 'dark' }, [-0.46, G, -0.46], [0.46, G + 0.006, 0.46]);
  m.box('sky', [-0.24, G + 0.006, -0.4], [0.24, G + 0.008, 0.4]);
  const y = G + 0.008;
  outline(m, -0.24, -0.4, 0.24, 0.4, y);
  for (const x of [-0.19, 0.19]) line(m, x - 0.004, -0.4, x + 0.004, 0.4, y);
  for (const z of [-0.2, 0.2]) line(m, -0.19, z - 0.004, 0.19, z + 0.004, y);
  line(m, -0.004, -0.2, 0.004, 0.2, y);
  // net
  for (const x of [-0.27, 0.27]) m.prism('dark', [x, 0], 0.006, G, G + 0.06, 4);
  m.box('paper', [-0.27, G + 0.052, -0.003], [0.27, G + 0.058, 0.003]);
  m.box('dark', [-0.27, G + 0.008, -0.001], [0.27, G + 0.052, 0.001]);
  // umpire chair
  m.box('bark', [0.32, G, -0.02], [0.36, G + 0.14, 0.02]);
  m.box('sunflower', [0.31, G + 0.14, -0.03], [0.37, G + 0.16, 0.03]);
  person(m, 0.0, -0.3, 0, { shirt: 'paper', pants: 'paper', pose: 'wave' });
  person(m, 0.1, 0.32, PI, { shirt: 'coral', pants: 'paper', pose: 'stand' });
  m.gem('lemon', [0.05, G + 0.12, 0], 0.008, 0.008, 4);
  chainFence(m, -0.47, -0.47, 0.47, 0.47, 0.18);
}

function badminton(m) {
  plate(m, 'kerb', 'stone');
  m.box({ top: 'leaf', sides: 'dark' }, [-0.24, G, -0.4], [0.24, G + 0.006, 0.4]);
  const y = G + 0.006;
  outline(m, -0.22, -0.38, 0.22, 0.38, y);
  for (const x of [-0.19, 0.19]) line(m, x - 0.003, -0.38, x + 0.003, 0.38, y);
  for (const z of [-0.12, 0.12, -0.34, 0.34]) line(m, -0.22, z - 0.003, 0.22, z + 0.003, y);
  line(m, -0.003, -0.38, 0.003, -0.12, y);
  line(m, -0.003, 0.12, 0.003, 0.38, y);
  for (const x of [-0.25, 0.25]) m.prism('dark', [x, 0], 0.005, G, G + 0.1, 4);
  m.box('paper', [-0.25, G + 0.09, -0.002], [0.25, G + 0.1, 0.002]);
  m.box('dark', [-0.25, G + 0.06, -0.001], [0.25, G + 0.09, 0.001]);
  // open roof shelter
  for (const [x, z] of [[-0.42, -0.44], [0.42, -0.44], [-0.42, 0.44], [0.42, 0.44], [-0.42, 0], [0.42, 0]]) m.box('paper', [x - 0.012, G, z - 0.012], [x + 0.012, 0.36, z + 0.012]);
  m.with({}, () => m.gableZ('sky', 'paper', [-0.46, 0.36, -0.48], [0.46, 0.5, 0.48]));
  person(m, 0.05, -0.25, 0, { shirt: 'sky', pants: 'dark', pose: 'wave' });
  person(m, -0.05, 0.25, PI, { shirt: 'red', pants: 'dark', pose: 'wave' });
  m.frustum('paper', [0.02, 0.02], 0.008, 0, G + 0.14, G + 0.155, 5);
  for (const x of [-0.36, 0.36]) bench(m, x, -0.2, x < 0 ? PI / 2 : -PI / 2);
}

function publicPool(m) {
  plate(m, 'kerb', 'stone');
  pool(m, -0.36, -0.3, 0.36, 0.24, 0.04);
  for (let i = 1; i < 5; i++) {
    const x = -0.36 + i * 0.144;
    for (let z = -0.3; z < 0.24; z += 0.03) m.box((Math.round(z * 100) / 3) % 2 < 1 ? 'coral' : 'paper', [x - 0.004, G + 0.016, z], [x + 0.004, G + 0.022, z + 0.02]);
  }
  // diving board and ladder
  m.box('stone', [-0.1, G, -0.4], [0.1, G + 0.03, -0.36]);
  m.box('sky', [-0.03, G + 0.03, -0.39], [0.03, G + 0.04, -0.24]);
  for (const x of [0.28, 0.32]) m.box('paper', [x - 0.003, G, 0.23], [x + 0.003, G + 0.06, 0.25]);
  person(m, -0.2, 0.0, 0.5, { shirt: 'sand', pants: 'coral', pose: 'wave', y: G - 0.03 });
  person(m, 0.15, -0.12, -0.8, { shirt: 'sand', pants: 'blue', pose: 'stand', y: G - 0.03 });
  for (const x of [-0.3, -0.18, -0.06]) lounger(m, x, 0.38, PI);
  umbrella(m, 0.1, 0.38, 'sunflower');
  // changing rooms
  m.box('sky', [0.18, G, 0.3], [0.46, 0.18, 0.46]);
  m.box('paper', [0.17, 0.18, 0.29], [0.47, 0.2, 0.47]);
  m.box('paper', [0.36, 0.1, 0.27], [0.4, 0.18, 0.3]);
  m.gem('red', [-0.42, G + 0.12, 0.3], 0.02, 0.02, 5);
  m.prism('paper', [-0.42, 0.3], 0.008, G, G + 0.1, 4);
}

function skatepark(m) {
  plate(m, 'kerb', 'stone');
  m.with({ ry: PI }, () => {
    // quarter pipes (wedges)
    const wedge = (x0, x1, z0, z1, h, rise = '+z', c = 'stone') => {
      const hi = rise === '+z' ? [[x0, G + h, z1], [x1, G + h, z1]] : [[x0, G + h, z0], [x1, G + h, z0]];
      const lo = rise === '+z' ? [[x0, G, z0], [x1, G, z0]] : [[x0, G, z1], [x1, G, z1]];
      const base = rise === '+z' ? [[x0, G, z1], [x1, G, z1]] : [[x0, G, z0], [x1, G, z0]];
      m.solid([...lo, ...hi, ...base], [
        { c: 'kerb', v: [0, 1, 3, 2] }, { c, v: [2, 3, 5, 4] }, { c, v: [0, 1, 5, 4] }, { c, v: [0, 2, 4] }, { c, v: [1, 3, 5] },
      ]);
    };
    wedge(-0.44, 0.44, 0.22, 0.44, 0.14, '+z', 'sky');
    wedge(-0.44, 0.0, -0.44, -0.22, 0.12, '-z', 'coral');
    m.box({ sides: 'stone', top: 'paper' }, [-0.44, G + 0.14, 0.44], [0.44, G + 0.15, 0.46]);
    // fun box with rail
    m.box({ sides: 'sunflower', top: 'kerb' }, [0.1, G, -0.3], [0.34, G + 0.05, -0.16]);
    m.box('dark', [0.1, G + 0.08, -0.232], [0.34, G + 0.088, -0.228]);
    for (const x of [0.12, 0.32]) m.box('dark', [x - 0.004, G + 0.05, -0.234], [x + 0.004, G + 0.08, -0.226]);
    // bowl
    m.frustum('stone', [-0.1, 0.02], 0.16, 0.2, G, G + 0.01, 10, 0, 'kerb');
    m.frustum('kerb', [-0.1, 0.02], 0.1, 0.1, G + 0.003, G + 0.012, 10);
    // graffiti on the ramp
    for (const [x, c] of [[-0.3, 'pink'], [-0.1, 'lemon'], [0.12, 'mint'], [0.3, 'purple']]) m.with({ t: [x, G + 0.07, 0.33], rx: -0.57 }, () => m.box(c, [-0.06, 0, -0.03], [0.06, 0.004, 0.03]));
    person(m, 0.22, 0.0, 1, { shirt: 'orange', pants: 'dark', pose: 'wave' });
    m.box('bark', [0.2, G, -0.02], [0.24, G + 0.006, 0.05]);
  });
}

function stadium(m) {
  plate(m, 'kerb', 'stone', 2, 2);
  // pitch
  m.box({ top: 'grass', sides: 'leaf' }, [-0.5, G, -0.32], [0.5, G + 0.01, 0.32]);
  for (let i = 0; i < 8; i++) if (i % 2) m.box('leaf', [-0.5 + i * 0.125, G + 0.01, -0.32], [-0.375 + i * 0.125, G + 0.011, 0.32]);
  const y = G + 0.011;
  outline(m, -0.46, -0.28, 0.46, 0.28, y, 0.008);
  line(m, -0.004, -0.28, 0.004, 0.28, y);
  m.arc('paper', [0, 0], 0.08, 0.088, 0, 2 * PI, y, y + L, 14);
  for (const s of [-1, 1]) goal(m, s * 0.46, 0, s > 0 ? -PI / 2 : PI / 2);
  // running track
  m.arc('coral', [0, 0], 0.6, 0.68, 0, 2 * PI, G, G + 0.008, 24);
  // stepped stands, a ring per tier
  const tiers = [[0.7, 0.78, 0.06, 'stone'], [0.78, 0.86, 0.12, 'sky'], [0.86, 0.94, 0.18, 'coral']];
  for (const [r0, r1, h, c] of tiers) m.arc(c, [0, 0], r0, r1, 0, 2 * PI, G, G + h, 24);
  m.arc('paper', [0, 0], 0.94, 0.97, 0, 2 * PI, G, G + 0.26, 24);
  // roof over the main stand
  m.arc('paper', [0, 0], 0.74, 0.98, PI * 1.15, PI * 1.85, 0.3, 0.32, 8);
  for (let i = 0; i <= 4; i++) {
    const a = PI * 1.15 + (i / 4) * PI * 0.7;
    m.prism('paper', [Math.cos(a) * 0.96, Math.sin(a) * 0.96], 0.01, G, 0.3, 4);
  }
  // floodlights
  for (const [x, z] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) {
    m.prism('stone', [x, z], 0.015, G, 0.6, 5);
    m.box({ sides: 'dark', top: 'dark' }, [x - 0.06, 0.6, z - 0.02], [x + 0.06, 0.66, z + 0.02]);
    m.box('lemon', [x - 0.055, 0.605, z + (z < 0 ? 0.02 : -0.022)], [x + 0.055, 0.655, z + (z < 0 ? 0.022 : -0.02)]);
  }
  for (const [x, z, c] of [[-0.2, 0.1, 'coral'], [0.15, -0.1, 'sky'], [0.3, 0.12, 'sky'], [-0.35, -0.05, 'coral']]) person(m, x, z, x < 0 ? PI / 2 : -PI / 2, { shirt: c, pants: 'paper', pose: 'walk', y: G + 0.01 });
  flagpole(m, 0, 0.99, 0.5, 'red', 'paper');
}

export default [
  { name: 'sport_soccer', footprint: [2, 1], build: soccer },
  { name: 'sport_basketball', footprint: [1, 1], build: basketball },
  { name: 'sport_tennis', footprint: [1, 1], build: tennis },
  { name: 'sport_badminton', footprint: [1, 1], build: badminton },
  { name: 'sport_pool', footprint: [1, 1], build: publicPool },
  { name: 'sport_skatepark', footprint: [1, 1], build: skatepark },
  { name: 'sport_stadium', footprint: [2, 2], build: stadium },
];
