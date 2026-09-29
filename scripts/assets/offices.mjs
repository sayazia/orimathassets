import { PI, G, plate, patch, win, door, windowsAround, treeRound, treePine, bush, bench, column, hedge, car, tower, roundTower, sign, hvac } from '../lib/parts.mjs';

function office(m) {
  plate(m, 'stone', 'dark');
  const lobby = 0.16, floors = 8, fh = 0.15;
  const top = G + lobby + floors * fh;
  m.box({ sides: 'navy', top: 'stone' }, [-0.27, G, -0.27], [0.27, G + lobby, 0.27]);
  m.box({ sides: 'glass' }, [-0.2, G, -0.28], [0.2, G + lobby - 0.02, 0.28]);
  m.box({ sides: 'paper' }, [-0.24, G + lobby - 0.02, 0.27], [0.24, G + lobby, 0.38]);
  m.box('sky', [-0.25, G + lobby, -0.25], [0.25, top, 0.25]);
  for (let f = 0; f <= floors; f++) {
    const y = G + lobby + f * fh;
    m.box('paper', [-0.262, y - 0.012, -0.262], [0.262, y + 0.018, 0.262]);
  }
  for (const u of [-0.125, 0, 0.125]) {
    for (const [x0, x1, z0, z1] of [[u - 0.006, u + 0.006, -0.258, 0.258], [-0.258, 0.258, u - 0.006, u + 0.006]]) {
      m.box('blue', [x0, G + lobby, z0], [x1, top, z1]);
    }
  }
  m.box({ sides: 'sky', top: 'stone' }, [-0.17, top, -0.17], [0.17, top + 0.14, 0.17]);
  m.box('paper', [-0.18, top + 0.13, -0.18], [0.18, top + 0.16, 0.18]);
  m.prism('dark', [0.08, 0.06], 0.008, top + 0.16, top + 0.36, 5);
  m.gem('coral', [0.08, top + 0.37, 0.06], 0.015, 0.015, 4);
  m.box({ sides: 'kerb', top: 'stone' }, [-0.1, top + 0.16, -0.12], [0.02, top + 0.2, -0.02]);
  for (const x of [-0.38, 0.38]) {
    m.box({ sides: 'paper', top: 'bark' }, [x - 0.06, G, 0.32], [x + 0.06, G + 0.05, 0.44]);
    m.gem('leaf', [x, G + 0.08, 0.38], 0.055, 0.045, 5);
  }
}

function shophouse(m) {
  plate(m, 'stone', 'dark');
  const units = [['terracotta', 'coral'], ['cream', 'blue']];
  units.forEach(([wall, signC], i) => {
    const x0 = -0.44 + i * 0.44, x1 = x0 + 0.44;
    m.box(wall, [x0, G, -0.3], [x1, 0.62, 0.18]);
    m.box('paper', [x0, 0.62, -0.3], [x1, 0.66, 0.18]);
    // rolling shutter and sign on the ground floor
    m.box('kerb', [x0 + 0.04, G, 0.18], [x1 - 0.04, 0.18, 0.19]);
    for (let y = G + 0.02; y < 0.18; y += 0.025) m.box('stone', [x0 + 0.04, y, 0.19], [x1 - 0.04, y + 0.005, 0.193]);
    sign(m, (x0 + x1) / 2, 0.2, 0.18, 0.36, 0.06, signC);
    for (const f of [0, 1]) {
      const y = 0.36 + f * 0.17;
      for (const u of [-0.1, 0.1]) win(m, '+z', 0.18, (x0 + x1) / 2 + u, y, 0.1, 0.09);
    }
    m.box({ top: 'kerb', sides: 'paper' }, [x0 + 0.02, 0.27, 0.18], [x1 - 0.02, 0.285, 0.26]);
  });
  m.box('paper', [-0.006, G, -0.31], [0.006, 0.66, 0.19]);
  windowsAround(m, [-0.44, -0.3, 0.44, 0.18], 3, { sides: '+x-x', y0: G, fh: 0.19, cols: 2 });
  hvac(m, -0.2, -0.1, 0.66);
  hvac(m, 0.24, -0.16, 0.66);
  m.box('dark', [-0.46, G, 0.3], [0.46, G + 0.004, 0.31]);
  car(m, 0.28, 0.4, PI / 2, 'sunflower');
}

function small(m) {
  plate(m, 'stone', 'dark');
  for (let x = -0.44; x < 0.1; x += 0.13) m.box('paper', [x, G, 0.3], [x + 0.008, G + 0.004, 0.48]);
  car(m, -0.37, 0.4, 0, 'coral');
  car(m, -0.11, 0.4, PI, 'teal');
  m.box('paper', [-0.36, G, -0.34], [0.36, 0.44, 0.18]);
  for (const y of [0.1, 0.3]) m.box('glass', [-0.365, y, -0.345], [0.365, y + 0.09, 0.185]);
  m.box('dark', [-0.37, 0.44, -0.35], [0.37, 0.46, 0.19]);
  m.box({ sides: 'glass', top: 'blue' }, [0.12, G, 0.18], [0.3, 0.22, 0.26]);
  m.box('blue', [0.1, 0.22, 0.17], [0.32, 0.24, 0.28]);
  sign(m, -0.12, 0.47, 0.1, 0.3, 0.07, 'blue');
  hvac(m, 0.2, -0.2, 0.46);
  treeRound(m, 0.4, 0.4, 0.7);
  treeRound(m, 0.42, -0.3, 0.8, 'grass');
}

function stepped(m) {
  plate(m, 'stone', 'dark');
  let top = tower(m, [-0.34, -0.34, 0.34, 0.3], G, 3, 0.15, { glass: 'mint', mullion: 'teal', cols: 5 });
  top = tower(m, [-0.26, -0.28, 0.26, 0.2], top, 3, 0.15, { glass: 'mint', mullion: 'teal', cols: 4 });
  top = tower(m, [-0.18, -0.22, 0.18, 0.1], top, 3, 0.15, { glass: 'mint', mullion: 'teal', cols: 3 });
  m.box('teal', [-0.1, top, -0.16], [0.1, top + 0.06, 0.04]);
  m.prism('dark', [0, -0.06], 0.008, top + 0.06, top + 0.24, 5);
  for (const [x, z] of [[-0.3, 0.26], [0.3, 0.26], [0.22, 0.18]]) m.gem('leaf', [x, 0.5, z], 0.03, 0.025, 5);
  m.box({ sides: 'glass', top: 'teal' }, [-0.12, G, 0.3], [0.12, 0.16, 0.4]);
  bush(m, -0.4, 0.44, 0.04, 'leaf', 'sunflower');
  bush(m, 0.4, 0.44, 0.04, 'leaf', 'pink');
}

function round(m) {
  plate(m, 'stone', 'dark');
  m.prism('kerb', [0, 0], 0.4, G, G + 0.02, 16, 0, 'stone');
  const top = roundTower(m, [0, 0], 0.26, G + 0.02, 10, 0.14, { glass: 'lavender', band: 'paper', n: 14 });
  m.frustum('purple', [0, 0], 0.27, 0.16, top + 0.012, top + 0.1, 14);
  m.frustum('paper', [0, 0], 0.03, 0.01, top + 0.1, top + 0.3, 6);
  m.box({ sides: 'glass', top: 'purple' }, [-0.1, G, 0.22], [0.1, 0.18, 0.34]);
  for (const x of [-0.4, 0.4]) treePine(m, x, 0.4, 0.7);
}

function twin(m) {
  plate(m, 'stone', 'dark', 2, 1);
  const tops = [];
  for (const s of [-1, 1]) {
    const cx = s * 0.45;
    m.box({ sides: 'navy', top: 'stone' }, [cx - 0.28, G, -0.3], [cx + 0.28, G + 0.14, 0.3]);
    tops.push(tower(m, [cx - 0.22, -0.24, cx + 0.22, 0.24], G + 0.14, 12, 0.13, { glass: 'sky', mullion: 'navy', cols: 4 }));
    const top = tops[tops.length - 1];
    m.box('paper', [cx - 0.16, top, -0.18], [cx + 0.16, top + 0.1, 0.18]);
    m.frustum('paper', [cx, 0], 0.12, 0.02, top + 0.1, top + 0.28, 8);
    m.prism('dark', [cx, 0], 0.006, top + 0.28, top + 0.42, 4);
  }
  // sky bridge
  m.box({ sides: 'glass', top: 'paper' }, [-0.24, 0.9, -0.08], [0.24, 1.0, 0.08]);
  m.box('paper', [-0.24, 0.88, -0.09], [0.24, 0.9, 0.09]);
  for (const x of [-0.08, 0.08]) m.box('paper', [x - 0.012, G, -0.04], [x + 0.012, 0.88, 0.04]);
  m.prism('stone', [0, 0.3], 0.12, G, G + 0.04, 8, 0, 'water');
  for (const x of [-0.9, 0.9]) treeRound(m, x, 0.4, 0.7);
}

function helipad(m) {
  plate(m, 'stone', 'dark');
  m.box({ sides: 'glass', top: 'navy' }, [-0.36, G, -0.34], [0.36, 0.2, 0.34]);
  m.box('navy', [-0.37, 0.18, -0.35], [0.37, 0.22, 0.35]);
  const top = tower(m, [-0.3, -0.3, 0.3, 0.3], 0.22, 9, 0.14, { glass: 'navy', band: 'kerb', mullion: 'sky', cols: 5 });
  m.box('kerb', [-0.32, top, -0.32], [0.32, top + 0.04, 0.32]);
  m.prism('dark', [0, 0], 0.26, top + 0.04, top + 0.06, 12);
  m.prism('sunflower', [0, 0], 0.2, top + 0.06, top + 0.062, 12);
  m.prism('dark', [0, 0], 0.18, top + 0.06, top + 0.064, 12);
  m.box('paper', [-0.07, top + 0.06, -0.09], [-0.04, top + 0.068, 0.09]);
  m.box('paper', [0.04, top + 0.06, -0.09], [0.07, top + 0.068, 0.09]);
  m.box('paper', [-0.04, top + 0.06, -0.015], [0.04, top + 0.068, 0.015]);
  for (const [x, z] of [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]]) m.gem('coral', [x, top + 0.07, z], 0.012, 0.012, 4);
  sign(m, 0, 0.23, 0.35, 0.36, 0.06, 'gold', 'navy');
  for (const x of [-0.42, 0.42]) bush(m, x, 0.44, 0.04, 'leaf');
}

function spire(m) {
  plate(m, 'stone', 'dark');
  let top = tower(m, [-0.3, -0.3, 0.3, 0.3], G, 5, 0.15, { glass: 'kerb', band: 'paper', mullion: 'slate', cols: 5 });
  top = tower(m, [-0.24, -0.24, 0.24, 0.24], top, 5, 0.15, { glass: 'kerb', band: 'paper', mullion: 'slate', cols: 4 });
  top = tower(m, [-0.18, -0.18, 0.18, 0.18], top, 3, 0.15, { glass: 'kerb', band: 'paper', mullion: 'slate', cols: 3 });
  const r2 = Math.SQRT2;
  m.frustum('slate', [0, 0], 0.18 * r2, 0.12 * r2, top, top + 0.1, 4, PI / 4);
  m.frustum('gold', [0, 0], 0.12 * r2, 0.04, top + 0.1, top + 0.36, 8, PI / 8);
  m.frustum('paper', [0, 0], 0.02, 0, top + 0.36, top + 0.56, 4);
  m.box({ sides: 'gold', top: 'slate' }, [-0.14, G, 0.3], [0.14, 0.2, 0.36]);
  for (const x of [-0.42, 0.42]) treePine(m, x, 0.42, 0.7);
}

function campus(m) {
  plate(m, 'grass', 'leaf', 2, 1);
  patch(m, 'kerb', -0.2, -0.1, 0.4, 0.5, 0.006, 'stone');
  m.box('paper', [-0.92, G, -0.4], [-0.2, 0.34, 0.2]);
  m.box('paper', [-0.2, G, -0.4], [0.9, 0.34, -0.1]);
  for (const y of [0.08, 0.22]) {
    m.box('glass', [-0.925, y, -0.405], [-0.195, y + 0.09, 0.205]);
    m.box('glass', [-0.2, y, -0.405], [0.905, y + 0.09, -0.095]);
  }
  m.box('dark', [-0.93, 0.34, -0.41], [0.91, 0.36, -0.09]);
  m.box('dark', [-0.93, 0.34, -0.1], [-0.19, 0.36, 0.21]);
  // glass atrium at the corner
  m.box({ sides: 'glass', top: 'sky' }, [-0.3, G, -0.2], [-0.02, 0.42, 0.08]);
  m.hip('sky', [-0.3, 0.42, -0.2], [-0.02, 0.5, 0.08]);
  // rooftop solar panels
  for (let x = 0.0; x < 0.8; x += 0.14) m.with({ t: [x + 0.06, 0.37, -0.25], rx: -0.4 }, () => m.box('navy', [-0.06, 0, -0.06], [0.06, 0.008, 0.06]));
  hvac(m, -0.7, -0.2, 0.36);
  for (const [x, z] of [[0.1, 0.1], [0.3, 0.3], [0.6, 0.12], [0.8, 0.36]]) treeRound(m, x, z, 0.8, x > 0.5 ? 'grass' : 'leaf');
  for (const x of [0.02, 0.5]) bench(m, x, 0.4, 0);
  sign(m, -0.56, 0.36, 0.2, 0.4, 0.06, 'teal');
}

function creative(m) {
  plate(m, 'grass', 'leaf');
  const boxes = [
    ['coral', [-0.34, G, -0.3], [0.16, 0.24, 0.22]],
    ['sunflower', [-0.2, 0.24, -0.34], [0.34, 0.44, 0.12]],
    ['sky', [-0.3, 0.44, -0.22], [0.14, 0.62, 0.2]],
    ['mint', [0.0, 0.62, -0.3], [0.3, 0.78, 0.04]],
  ];
  for (const [c, a, b] of boxes) {
    m.box(c, a, b);
    m.box('paper', [a[0] - 0.005, b[1] - 0.012, a[2] - 0.005], [b[0] + 0.005, b[1], b[2] + 0.005]);
    const w = b[0] - a[0];
    m.box('glass', [a[0] + w * 0.12, a[1] + 0.05, b[2]], [b[0] - w * 0.12, b[1] - 0.05, b[2] + 0.01]);
    m.box('glass', [b[0], a[1] + 0.05, a[2] + 0.04], [b[0] + 0.01, b[1] - 0.05, b[2] - 0.04]);
  }
  // rooftop garden on the lower blocks
  for (const [x, z] of [[-0.28, 0.16], [0.26, 0.04], [-0.24, -0.2]]) m.gem('leaf', [x, x < 0 && z > 0 ? 0.28 : 0.48, z], 0.035, 0.03, 5);
  door(m, '+z', 0.22, -0.1, 0.1, 0.16, 'dark');
  bench(m, 0.3, 0.38, 0);
  treeRound(m, -0.42, 0.4, 0.6, 'grass');
  bush(m, 0.42, 0.2, 0.04, 'leaf', 'pink');
}

export default [
  { name: 'office_shophouse', footprint: [1, 1], build: shophouse },
  { name: 'office_small', footprint: [1, 1], build: small },
  { name: 'office_glass_tower', footprint: [1, 1], build: office },
  { name: 'office_stepped', footprint: [1, 1], build: stepped },
  { name: 'office_round', footprint: [1, 1], build: round },
  { name: 'office_twin', footprint: [2, 1], build: twin },
  { name: 'office_helipad', footprint: [1, 1], build: helipad },
  { name: 'office_spire', footprint: [1, 1], build: spire },
  { name: 'office_campus', footprint: [2, 1], build: campus },
  { name: 'office_creative', footprint: [1, 1], build: creative },
];
