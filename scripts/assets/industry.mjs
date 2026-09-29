import { PI, G, plate, patch, windowsAround, fence, car, sign, hvac } from '../lib/parts.mjs';

function truck(m, x, z, ry, cab = 'blue', box = 'paper') {
  m.with({ t: [x, G, z], ry }, () => {
    m.box(box, [-0.055, 0.03, -0.18], [0.055, 0.15, 0.08]);
    m.box({ sides: cab, top: cab }, [-0.055, 0.02, 0.08], [0.055, 0.12, 0.16]);
    m.box('glass', [-0.05, 0.075, 0.16], [0.05, 0.11, 0.162]);
    for (const wx of [-0.055, 0.055]) for (const wz of [-0.13, -0.06, 0.12]) m.with({ t: [wx, 0.022, wz], rz: PI / 2 }, () => m.prism('dark', [0, 0], 0.022, -0.01, 0.01, 8, 0, 'kerb'));
  });
}

function container(m, x, y, z, c, ry = 0) {
  m.with({ t: [x, y, z], ry }, () => {
    m.box(c, [-0.13, 0, -0.05], [0.13, 0.1, 0.05]);
    for (let i = -0.11; i <= 0.111; i += 0.037) m.box(c, [i - 0.005, 0.005, -0.053], [i + 0.005, 0.095, 0.053]);
  });
}

function factory(m) {
  plate(m, 'stone', 'dark', 2, 2);
  // saw-tooth roofed hall
  m.box('cream', [-0.9, G, -0.8], [0.4, 0.34, 0.1]);
  for (let i = 0; i < 6; i++) {
    const z0 = -0.8 + i * 0.15;
    const v = [[-0.9, 0.34, z0], [0.4, 0.34, z0], [0.4, 0.34, z0 + 0.15], [-0.9, 0.34, z0 + 0.15], [-0.9, 0.46, z0 + 0.15], [0.4, 0.46, z0 + 0.15]];
    m.solid(v, [
      { c: 'slate', v: [0, 1, 2, 3] }, { c: 'slate', v: [0, 1, 5, 4] }, { c: 'glass', v: [3, 2, 5, 4] },
      { c: 'cream', v: [0, 3, 4] }, { c: 'cream', v: [1, 2, 5] },
    ]);
  }
  windowsAround(m, [-0.9, -0.8, 0.4, 0.1], 1, { sides: '-x+x', y0: G, fh: 0.3, cols: 5, w: 0.1 });
  // loading dock
  for (const x of [-0.7, -0.4, -0.1]) {
    m.box('kerb', [x - 0.09, G, 0.1], [x + 0.09, 0.22, 0.11]);
    for (let y = G + 0.02; y < 0.22; y += 0.03) m.box('stone', [x - 0.09, y, 0.11], [x + 0.09, y + 0.005, 0.113]);
  }
  m.box({ top: 'kerb', sides: 'stone' }, [-0.85, G, 0.1], [0.05, 0.08, 0.2]);
  sign(m, 0.2, 0.24, 0.1, 0.3, 0.06, 'orange', 'paper');
  truck(m, -0.7, 0.42, PI, 'orange');
  truck(m, -0.4, 0.46, PI, 'blue', 'kerb');
  // chimneys and tanks
  for (const [x, z] of [[0.62, -0.7], [0.82, -0.7]]) {
    m.prism('terracotta', [x, z], 0.06, G, 0.95, 8);
    m.prism('paper', [x, z], 0.062, 0.8, 0.85, 8);
    m.gem('kerb', [x, 1.02, z], 0.07, 0.04, 6);
  }
  for (const [x, z] of [[0.6, -0.2], [0.85, -0.2], [0.6, 0.1], [0.85, 0.1]]) {
    m.prism('paper', [x, z], 0.1, G, 0.34, 10);
    m.frustum('kerb', [x, z], 0.1, 0.03, 0.34, 0.4, 10);
  }
  for (let x = 0.5; x < 0.95; x += 0.05) m.box('dark', [x, 0.3, -0.21], [x + 0.03, 0.31, 0.11]);
  fence(m, 0.1, 0.96, 0.96, 0.96, 10);
  hvac(m, -0.5, -0.4, 0.46);
}

function warehouse(m) {
  plate(m, 'stone', 'dark', 2, 1);
  m.box('sky', [-0.9, G, -0.42], [0.3, 0.34, 0.1]);
  for (let x = -0.88; x < 0.3; x += 0.05) m.box('sky', [x, G, 0.1], [x + 0.02, 0.34, 0.106]);
  m.gable('kerb', 'sky', [-0.93, 0.34, -0.45], [0.33, 0.44, 0.13]);
  for (const x of [-0.6, -0.2]) {
    m.box('paper', [x - 0.13, G, 0.1], [x + 0.13, 0.26, 0.112]);
    m.box('stone', [x - 0.11, G, 0.112], [x + 0.11, 0.24, 0.116]);
  }
  sign(m, -0.4, 0.28, 0.11, 0.3, 0.04, 'navy', 'paper');
  // stacked shipping containers
  const cols = ['coral', 'blue', 'sunflower', 'teal', 'orange', 'lavender'];
  let k = 0;
  for (const z of [-0.3, -0.1]) for (const x of [0.5, 0.78]) for (let y = 0; y < (x > 0.6 ? 2 : 3); y++) container(m, x, G + y * 0.1, z, cols[k++ % cols.length]);
  container(m, 0.62, G, 0.3, 'red', 0.2);
  // forklift
  m.with({ t: [0.5, G, 0.2] }, () => {
    m.box('sunflower', [-0.03, 0.01, -0.04], [0.03, 0.06, 0.04]);
    m.box('dark', [-0.025, 0.06, -0.03], [0.025, 0.1, 0.01]);
    for (const x of [-0.02, 0.02]) m.box('dark', [x - 0.004, 0, 0.04], [x + 0.004, 0.14, 0.046]);
    m.box('dark', [-0.03, 0.005, 0.046], [0.03, 0.01, 0.1]);
  });
  truck(m, -0.2, 0.36, 0, 'coral');
}

function silo(m) {
  plate(m, 'grass');
  patch(m, 'stone', -0.46, -0.46, 0.46, 0.2, 0.006, 'dark');
  for (const [x, z, h] of [[-0.24, -0.22, 0.7], [0.0, -0.26, 0.8], [0.24, -0.22, 0.7]]) {
    m.prism('kerb', [x, z], 0.12, G, h, 12);
    for (let y = 0.14; y < h; y += 0.14) m.prism('paper', [x, z], 0.122, y, y + 0.012, 12);
    m.frustum('slate', [x, z], 0.125, 0.02, h, h + 0.1, 12);
  }
  // conveyor
  m.with({ t: [0.3, G, 0.1], rx: -0.9 }, () => m.box('stone', [-0.03, 0, 0], [0.03, 0.02, 0.62]));
  m.box({ sides: 'red', top: 'paper' }, [0.2, G, 0.14], [0.44, 0.18, 0.4]);
  m.gable('terracotta', 'red', [0.18, 0.18, 0.12], [0.46, 0.26, 0.42]);
  m.box('paper', [0.26, G, 0.4], [0.38, 0.14, 0.41]);
  for (let i = 0; i < 3; i++) m.with({ t: [-0.3 + i * 0.1, G, 0.34] }, () => m.box({ sides: 'straw', top: 'straw' }, [-0.04, 0, -0.04], [0.04, 0.06, 0.04]));
  car(m, -0.1, 0.36, PI / 2, 'teal');
}

export default [
  { name: 'industry_factory', footprint: [2, 2], build: factory },
  { name: 'industry_warehouse', footprint: [2, 1], build: warehouse },
  { name: 'industry_silo', footprint: [1, 1], build: silo },
];
