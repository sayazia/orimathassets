import { PI, G, plate, patch, win, door, windowsAround, treeRound, treePine, bush, fence, bench, column, pool, lounger, umbrella, hedge, palm, car } from '../lib/parts.mjs';

function house(m) {
  plate(m);
  m.box({ top: 'sand', sides: 'bark' }, [-0.07, G, 0.2], [0.07, G + 0.006, 0.5]);
  m.box('cream', [-0.28, G, -0.2], [0.28, 0.34, 0.2]);
  m.gable('coral', 'cream', [-0.32, 0.34, -0.27], [0.32, 0.58, 0.27]);
  m.box({ sides: 'red', top: 'dark' }, [0.12, 0.42, -0.14], [0.2, 0.62, -0.06]);
  door(m, '+z', 0.2, 0, 0.1, 0.18);
  for (const x of [-0.17, 0.17]) win(m, '+z', 0.2, x, 0.21, 0.1, 0.09);
  for (const x of [-0.28, 0.28]) win(m, x > 0 ? '+x' : '-x', x, 0, 0.21, 0.1, 0.09);
  win(m, '-z', -0.2, 0, 0.21, 0.14, 0.09);
  bush(m, -0.35, 0.3, 0.06, 'leaf', 'pink');
  bush(m, 0.35, 0.3, 0.06, 'leaf', 'sunflower');
  treeRound(m, 0.36, -0.34, 0.9);
}

function cottage(m) {
  plate(m);
  m.box({ top: 'sand', sides: 'bark' }, [-0.06, G, 0.18], [0.06, G + 0.006, 0.5]);
  m.box('pink', [-0.2, G, -0.2], [0.2, 0.3, 0.18]);
  m.hip('teal', [-0.25, 0.3, -0.25], [0.25, 0.54, 0.23]);
  m.box({ sides: 'cream', top: 'dark' }, [-0.14, 0.36, -0.12], [-0.07, 0.56, -0.05]);
  door(m, '+z', 0.18, 0, 0.09, 0.17, 'sunflower');
  for (const x of [-0.2, 0.2]) win(m, x > 0 ? '+x' : '-x', x, -0.01, 0.19, 0.11, 0.09);
  win(m, '+z', 0.18, -0.13, 0.19, 0.06, 0.07);
  win(m, '+z', 0.18, 0.13, 0.19, 0.06, 0.07);
  fence(m, -0.46, 0.46, -0.1, 0.46, 5);
  fence(m, 0.1, 0.46, 0.46, 0.46, 5);
  fence(m, -0.46, -0.46, -0.46, 0.46, 10);
  fence(m, 0.46, -0.46, 0.46, 0.46, 10);
  bush(m, -0.3, 0.3, 0.05, 'mint', 'coral');
  bush(m, 0.3, 0.3, 0.05, 'mint', 'lavender');
  treePine(m, 0.32, -0.3, 0.8);
  treeRound(m, -0.32, -0.3, 0.8, 'grass');
}

function apartment(m) {
  plate(m, 'stone', 'dark');
  const floors = 4, fh = 0.21, top = G + floors * fh;
  m.box('lavender', [-0.3, G, -0.28], [0.3, top, 0.28]);
  for (let f = 1; f < floors; f++) m.box('paper', [-0.31, G + f * fh - 0.01, -0.29], [0.31, G + f * fh + 0.005, 0.29]);
  m.box({ sides: 'paper', top: 'purple' }, [-0.32, top, -0.3], [0.32, top + 0.035, 0.3]);
  m.prism('stone', [0.14, -0.1], 0.06, top + 0.035, top + 0.13, 8, 0, 'kerb');
  m.hip('purple', [-0.2, top + 0.035, -0.18], [-0.04, top + 0.1, -0.02]);
  for (let f = 0; f < floors; f++) {
    const y = G + f * fh + fh * 0.52;
    for (const u of [-0.18, 0, 0.18]) {
      if (f === 0 && u === 0) continue;
      win(m, '+z', 0.28, u, y, 0.1, 0.1);
      win(m, '-z', -0.28, u, y, 0.1, 0.1);
      win(m, '+x', 0.3, u, y, 0.1, 0.1);
      win(m, '-x', -0.3, u, y, 0.1, 0.1);
    }
    if (f > 0) {
      // balcony on the front
      m.box({ sides: 'paper', top: 'kerb' }, [-0.08, G + f * fh, 0.28], [0.08, G + f * fh + 0.015, 0.36]);
      m.box('paper', [-0.08, G + f * fh + 0.015, 0.35], [0.08, G + f * fh + 0.06, 0.36]);
    }
  }
  door(m, '+z', 0.28, 0, 0.1, 0.16, 'purple');
  bush(m, -0.4, 0.4, 0.05, 'leaf', 'pink');
  bush(m, 0.4, 0.4, 0.05, 'leaf', 'sunflower');
}

function hut(m) {
  plate(m, 'grass');
  patch(m, 'sand', -0.3, -0.26, 0.3, 0.3);
  m.box('wood', [-0.15, G, -0.13], [0.15, 0.22, 0.13]);
  for (const x of [-0.15, 0.15]) for (const z of [-0.13, 0.13]) m.box('bark', [x - 0.012, G, z - 0.012], [x + 0.012, 0.22, z + 0.012]);
  m.hip('straw', [-0.23, 0.2, -0.21], [0.23, 0.44, 0.21], 0.12);
  door(m, '+z', 0.13, -0.04, 0.07, 0.14, 'bark');
  win(m, '+z', 0.13, 0.08, 0.15, 0.05, 0.05, 'dark');
  // firewood, clay pots and a little fence
  for (let i = 0; i < 3; i++) m.with({ t: [0.24, G + 0.012 + i * 0.018, -0.05], rx: PI / 2 }, () => m.prism('bark', [0, 0], 0.01, -0.06, 0.06, 5));
  m.frustum('terracotta', [-0.24, 0.2], 0.03, 0.02, G, G + 0.05, 6);
  m.frustum('terracotta', [-0.2, 0.26], 0.022, 0.015, G, G + 0.035, 6);
  fence(m, -0.44, 0.44, 0.44, 0.44, 9);
  palm(m, 0.34, -0.32, 1.1);
  bush(m, -0.36, -0.3, 0.05, 'leaf', 'coral');
}

function stilt(m) {
  plate(m);
  for (const x of [-0.24, 0, 0.24]) for (const z of [-0.18, 0.22]) m.prism('bark', [x, z], 0.016, G, 0.17, 5);
  m.box({ top: 'wood', sides: 'bark' }, [-0.27, 0.16, -0.21], [0.27, 0.19, 0.26]);
  m.box('wood', [-0.22, 0.19, -0.18], [0.22, 0.38, 0.1]);
  for (let i = 0; i < 5; i++) m.box('bark', [-0.225, 0.2 + i * 0.038, 0.1], [0.225, 0.205 + i * 0.038, 0.104]);
  m.gable('straw', 'wood', [-0.28, 0.38, -0.25], [0.28, 0.58, 0.19]);
  door(m, '+z', 0.104, -0.08, 0.07, 0.14, 'bark', 0.19);
  win(m, '+z', 0.104, 0.1, 0.28, 0.08, 0.06, 'dark');
  // porch railing and stairs
  for (let x = -0.26; x <= 0.261; x += 0.065) if (x < 0.08 || x > 0.2) m.box('bark', [x - 0.006, 0.19, 0.245], [x + 0.006, 0.25, 0.257]);
  m.box('bark', [-0.27, 0.245, 0.245], [0.08, 0.255, 0.258]);
  for (let i = 0; i < 4; i++) m.box({ top: 'wood', sides: 'bark' }, [0.1, G, 0.26 + i * 0.04], [0.2, 0.16 - i * 0.035, 0.3 + i * 0.04]);
  treeRound(m, -0.36, 0.36, 0.8);
  palm(m, 0.38, -0.36, 1);
}

function minimalist(m) {
  plate(m);
  patch(m, 'stone', 0.06, 0.18, 0.28, 0.5, 0.006, 'dark');
  m.box('paper', [-0.28, G, -0.22], [0.1, 0.38, 0.18]);
  m.box({ top: 'dark', sides: 'dark' }, [-0.29, 0.38, -0.23], [0.11, 0.4, 0.19]);
  m.box('stone', [0.1, G, -0.22], [0.3, 0.26, 0.14]);
  m.box({ top: 'dark', sides: 'dark' }, [0.1, 0.26, -0.23], [0.31, 0.28, 0.15]);
  // wood slats and a big window
  for (let x = -0.26; x < -0.1; x += 0.025) m.box('wood', [x, G + 0.02, 0.18], [x + 0.012, 0.36, 0.195]);
  m.box('glass', [-0.08, 0.22, 0.18], [0.08, 0.35, 0.192]);
  m.box('glass', [0.12, G + 0.02, 0.14], [0.28, 0.2, 0.152]);
  door(m, '+z', 0.18, 0, 0.08, 0.17, 'dark');
  windowsAround(m, [-0.28, -0.22, 0.1, 0.18], 1, { sides: '-x', fh: 0.3, h: 0.12 });
  treePine(m, -0.36, 0.34, 0.8);
  bush(m, 0.38, 0.3, 0.04);
  bush(m, -0.2, 0.34, 0.035, 'mint');
}

function row(m) {
  plate(m, 'stone', 'dark');
  const cols = [['coral', 'red'], ['sunflower', 'orange'], ['mint', 'teal']];
  cols.forEach(([wall, roof], i) => {
    const x0 = -0.42 + i * 0.28, x1 = x0 + 0.28;
    m.box(wall, [x0, G, -0.28], [x1, 0.38, 0.16]);
    m.gableZ(roof, wall, [x0 - 0.005, 0.38, -0.3], [x1 + 0.005, 0.54, 0.19]);
    door(m, '+z', 0.16, (x0 + x1) / 2 - 0.05, 0.07, 0.16, ['blue', 'teal', 'purple'][i]);
    win(m, '+z', 0.16, (x0 + x1) / 2 + 0.07, 0.15, 0.06, 0.07);
    win(m, '+z', 0.16, (x0 + x1) / 2, 0.3, 0.12, 0.07);
    win(m, '+z', 0.19, (x0 + x1) / 2, 0.44, 0.05, 0.05);
    m.box({ top: 'kerb', sides: 'stone' }, [(x0 + x1) / 2 - 0.1, G, 0.16], [(x0 + x1) / 2, G + 0.02, 0.22]);
  });
  for (const x of [-0.42, 0.42]) windowsAround(m, [-0.42, -0.28, 0.42, 0.16], 1, { sides: x < 0 ? '-x' : '+x', y0: 0.12, fh: 0.2, cols: 1 });
  for (const x of [-0.28, 0, 0.28]) bush(m, x + 0.06, 0.4, 0.04, 'leaf', 'pink');
}

function garage(m) {
  plate(m);
  patch(m, 'stone', 0.1, 0.18, 0.36, 0.5, 0.006, 'dark');
  patch(m, 'sand', -0.16, 0.18, -0.08, 0.5);
  m.box('sky', [-0.34, G, -0.22], [0.08, 0.34, 0.18]);
  m.gable('coral', 'sky', [-0.38, 0.34, -0.27], [0.1, 0.56, 0.23]);
  m.box('cream', [0.08, G, -0.2], [0.38, 0.25, 0.18]);
  m.gable('coral', 'cream', [0.08, 0.25, -0.23], [0.4, 0.36, 0.21]);
  m.box('kerb', [0.12, G, 0.18], [0.34, 0.2, 0.19]);
  for (let y = G + 0.03; y < 0.2; y += 0.035) m.box('stone', [0.12, y, 0.19], [0.34, y + 0.006, 0.193]);
  door(m, '+z', 0.18, -0.12, 0.08, 0.17, 'navy');
  win(m, '+z', 0.18, -0.26, 0.21, 0.1, 0.09);
  win(m, '+z', 0.18, 0.0, 0.21, 0.07, 0.09);
  windowsAround(m, [-0.34, -0.22, 0.08, 0.18], 1, { sides: '-x', y0: 0.08, fh: 0.2, cols: 2 });
  car(m, 0.23, 0.36, 0, 'blue');
  bush(m, -0.4, 0.4, 0.045, 'leaf', 'sunflower');
  treeRound(m, -0.38, -0.36, 0.8);
}

function twoStorey(m) {
  plate(m);
  patch(m, 'sand', -0.06, 0.2, 0.06, 0.5);
  m.box('lemon', [-0.28, G, -0.22], [0.28, 0.5, 0.2]);
  m.box('paper', [-0.285, 0.26, -0.225], [0.285, 0.275, 0.205]);
  m.hip('blue', [-0.33, 0.5, -0.27], [0.33, 0.7, 0.25], 0.24);
  windowsAround(m, [-0.28, -0.22, 0.28, 0.2], 2, { y0: G + 0.01, fh: 0.23, cols: 3, w: 0.08, h: 0.1, skip: (d, f, i) => d === '+z' && f === 0 && i === 1 });
  door(m, '+z', 0.2, 0, 0.08, 0.17, 'navy');
  // porch roof on two columns
  m.box({ top: 'blue', sides: 'paper' }, [-0.1, 0.23, 0.2], [0.1, 0.25, 0.3]);
  for (const x of [-0.085, 0.085]) column(m, x, 0.285, G, 0.23, 0.009);
  m.box('mint', [0.36, G, -0.3], [0.44, 0.1, 0.3]);
  treeRound(m, -0.38, 0.36, 0.9);
  bush(m, 0.2, 0.34, 0.05, 'leaf', 'pink');
  bush(m, -0.2, 0.34, 0.05, 'leaf', 'coral');
}

function joglo(m) {
  plate(m);
  patch(m, 'sand', -0.08, 0.36, 0.08, 0.5);
  m.box({ top: 'kerb', sides: 'stone' }, [-0.38, G, -0.38], [0.38, 0.08, 0.38]);
  m.box('wood', [-0.32, 0.08, -0.32], [0.32, 0.3, -0.04]);
  door(m, '+z', -0.04, 0, 0.12, 0.16, 'bark', 0.08);
  for (const x of [-0.2, 0.2]) win(m, '+z', -0.04, x, 0.19, 0.07, 0.08, 'bark');
  for (let i = 0; i < 4; i++) {
    const u = -0.32 + (i * 0.64) / 3;
    for (const [x, z] of [[u, 0.32], [u, -0.32], [0.32, u], [-0.32, u]]) m.prism('bark', [x, z], 0.014, 0.08, 0.32, 6);
  }
  for (const x of [-0.1, 0.1]) for (const z of [-0.1, 0.1]) m.prism('bark', [x, z + 0.12], 0.018, 0.08, 0.44, 6);
  const r2 = Math.SQRT2;
  m.frustum('terracotta', [0, 0], 0.45 * r2, 0.2 * r2, 0.31, 0.44, 4, PI / 4);
  m.hip('terracotta', [-0.2, 0.44, -0.2], [0.2, 0.72, 0.2], 0.12);
  for (const x of [-0.06, 0.06]) m.gem('gold', [x, 0.73, 0], 0.012, 0.018, 4);
  bench(m, 0.14, 0.2, 0);
  for (const x of [-0.44, 0.44]) m.frustum('terracotta', [x, 0.44], 0.03, 0.022, G, G + 0.05, 6);
  treeRound(m, -0.44, -0.44, 0.7);
  treeRound(m, 0.44, -0.44, 0.7, 'grass');
}

function gadang(m) {
  plate(m);
  patch(m, 'sand', -0.07, 0.24, 0.07, 0.5);
  for (const x of [-0.3, -0.1, 0.1, 0.3]) for (const z of [-0.14, 0.14]) m.prism('bark', [x, z], 0.018, G, 0.14, 6);
  m.box({ top: 'wood', sides: 'bark' }, [-0.36, 0.13, -0.18], [0.36, 0.16, 0.2]);
  m.with({}, () => {
    // walls flare slightly outward like the real houses
    const v = [[-0.33, 0.16, -0.15], [0.33, 0.16, -0.15], [0.33, 0.16, 0.17], [-0.33, 0.16, 0.17], [-0.37, 0.38, -0.18], [0.37, 0.38, -0.18], [0.37, 0.38, 0.2], [-0.37, 0.38, 0.2]];
    m.solid(v, [
      { c: 'maroon', v: [0, 1, 2, 3] }, { c: 'maroon', v: [4, 5, 6, 7] }, { c: 'maroon', v: [0, 1, 5, 4] },
      { c: 'maroon', v: [3, 2, 6, 7] }, { c: 'maroon', v: [0, 3, 7, 4] }, { c: 'maroon', v: [1, 2, 6, 5] },
    ]);
  });
  for (const y of [0.2, 0.3]) m.box('gold', [-0.36, y, 0.19], [0.36, y + 0.012, 0.2]);
  for (const x of [-0.24, -0.08, 0.08, 0.24]) win(m, '+z', 0.19, x, 0.25, 0.06, 0.07, 'bark');
  // swept roof: middle saddle plus two horned ends
  const z0 = -0.26, z1 = 0.28;
  m.saddle('ijuk', 'maroon', -0.16, 0.16, [0.38, 0.38], [0.56, 0.56], z0, z1);
  m.saddle('ijuk', 'maroon', -0.48, -0.16, [0.46, 0.38], [0.84, 0.56], z0 + 0.04, z1 - 0.04);
  m.saddle('ijuk', 'maroon', 0.16, 0.48, [0.38, 0.46], [0.56, 0.84], z0 + 0.04, z1 - 0.04);
  for (const x of [-0.48, 0.48]) m.frustum('gold', [x, 0.02], 0.012, 0, 0.83, 0.92, 4);
  // entrance porch with its own horn
  m.box('maroon', [-0.07, 0.16, 0.2], [0.07, 0.34, 0.3]);
  m.gableZ('ijuk', 'maroon', [-0.1, 0.34, 0.18], [0.1, 0.5, 0.34]);
  m.frustum('gold', [0, 0.34], 0.01, 0, 0.49, 0.56, 4);
  for (let i = 0; i < 3; i++) m.box({ top: 'wood', sides: 'bark' }, [-0.05, G, 0.3 + i * 0.04], [0.05, 0.14 - i * 0.045, 0.34 + i * 0.04]);
  treeRound(m, -0.42, 0.4, 0.7);
  palm(m, 0.42, 0.38, 0.9);
}

function colonial(m) {
  plate(m);
  patch(m, 'kerb', -0.07, 0.3, 0.07, 0.5, 0.006, 'stone');
  m.box('paper', [-0.32, G, -0.24], [0.32, 0.42, 0.16]);
  m.hip('terracotta', [-0.37, 0.42, -0.29], [0.37, 0.62, 0.21], 0.3);
  m.box({ top: 'kerb', sides: 'stone' }, [-0.24, G, 0.16], [0.24, 0.07, 0.3]);
  for (const x of [-0.21, -0.12, 0.12, 0.21]) column(m, x, 0.27, 0.07, 0.36, 0.012);
  m.box('paper', [-0.24, 0.36, 0.14], [0.24, 0.4, 0.3]);
  m.gableZ('terracotta', 'paper', [-0.25, 0.4, 0.14], [0.25, 0.52, 0.31]);
  door(m, '+z', 0.16, 0, 0.09, 0.2, 'teal', 0.07);
  for (const x of [-0.26, 0.26]) {
    for (const y of [0.17, 0.33]) {
      win(m, '+z', 0.16, x, y, 0.06, 0.1);
      for (const s of [-1, 1]) m.box('teal', [x + s * 0.052 - 0.014, y - 0.055, 0.16], [x + s * 0.052 + 0.014, y + 0.055, 0.172]);
    }
  }
  windowsAround(m, [-0.32, -0.24, 0.32, 0.16], 2, { sides: '+x-x-z', y0: G, fh: 0.18, cols: 2, w: 0.06, h: 0.1 });
  for (const s of [-1, 1]) {
    hedge(m, s * 0.1, 0.34, s * 0.44, 0.4);
    m.gem('leaf', [s * 0.4, G + 0.1, -0.4], 0.05, 0.1, 5);
  }
}

function bungalow(m) {
  plate(m);
  patch(m, 'sand', -0.06, 0.3, 0.06, 0.5);
  m.box('wood', [-0.3, 0.06, -0.24], [0.3, 0.3, 0.1]);
  m.box({ top: 'wood', sides: 'bark' }, [-0.34, G, -0.28], [0.34, 0.07, 0.3]);
  m.hip('teal', [-0.4, 0.3, -0.32], [0.4, 0.5, 0.34], 0.36);
  for (const x of [-0.3, -0.1, 0.1, 0.3]) m.prism('bark', [x, 0.28], 0.01, 0.07, 0.31, 5);
  for (let x = -0.32; x <= 0.321; x += 0.04) if (Math.abs(x) > 0.06) m.box('bark', [x - 0.004, 0.07, 0.286], [x + 0.004, 0.12, 0.294]);
  m.box('bark', [-0.33, 0.12, 0.284], [0.33, 0.13, 0.296]);
  door(m, '+z', 0.1, 0, 0.08, 0.17, 'teal', 0.07);
  for (const x of [-0.19, 0.19]) win(m, '+z', 0.1, x, 0.2, 0.1, 0.09, 'glass');
  windowsAround(m, [-0.3, -0.24, 0.3, 0.1], 1, { sides: '+x-x', y0: 0.07, fh: 0.24, cols: 1, w: 0.1 });
  // hammock between the porch posts
  m.with({ t: [-0.2, 0.13, 0.22], rx: 0.2 }, () => m.box('coral', [-0.07, 0, -0.02], [0.07, 0.01, 0.02]));
  palm(m, 0.38, 0.38, 1.1, 0.3);
  palm(m, -0.4, -0.38, 0.9);
  bush(m, -0.4, 0.4, 0.04, 'leaf', 'pink');
}

function modernGlass(m) {
  plate(m);
  pool(m, 0.08, 0.26, 0.38, 0.42);
  patch(m, 'wood', -0.3, 0.2, 0.04, 0.44, 0.008, 'bark');
  m.box({ sides: 'glass', top: 'paper' }, [-0.28, G, -0.18], [0.12, 0.24, 0.16]);
  for (const x of [-0.28, -0.14, 0, 0.12]) m.box('dark', [x - 0.006, G, 0.16], [x + 0.006, 0.24, 0.168]);
  m.box('paper', [-0.16, 0.24, -0.24], [0.36, 0.44, 0.2]);
  m.box('dark', [-0.165, 0.44, -0.245], [0.365, 0.455, 0.205]);
  m.box('glass', [-0.12, 0.28, 0.2], [0.2, 0.4, 0.21]);
  m.box('wood', [0.22, 0.26, 0.2], [0.34, 0.43, 0.21]);
  m.box({ sides: 'wood', top: 'wood' }, [0.12, G, -0.24], [0.36, 0.24, -0.04]);
  door(m, '+z', 0.16, -0.2, 0.07, 0.17, 'dark');
  for (const x of [-0.24, -0.16]) lounger(m, x, 0.34, 0);
  umbrella(m, -0.06, 0.34, 'coral');
  treePine(m, -0.4, -0.36, 0.9);
  bush(m, 0.42, 0.1, 0.04);
}

function garden(m) {
  plate(m);
  patch(m, 'sand', -0.05, 0.12, 0.05, 0.5);
  m.box('lavender', [-0.24, G, -0.34], [0.24, 0.3, 0.04]);
  m.gable('purple', 'lavender', [-0.28, 0.3, -0.39], [0.28, 0.48, 0.09]);
  door(m, '+z', 0.04, 0, 0.08, 0.16, 'sunflower');
  for (const x of [-0.14, 0.14]) win(m, '+z', 0.04, x, 0.19, 0.08, 0.08);
  // vegetable beds
  for (const side of [-1, 1]) {
    for (let r = 0; r < 3; r++) {
      const x0 = side < 0 ? -0.44 : 0.1, z = 0.16 + r * 0.1;
      patch(m, 'bark', x0, z, x0 + 0.34, z + 0.06, 0.012, 'bark');
      for (let i = 0; i < 5; i++) {
        const c = [['leaf', 'coral'], ['grass', null], ['leaf', 'sunflower']][r];
        bush(m, x0 + 0.04 + i * 0.065, z + 0.03, 0.022, c[0], c[1], G + 0.012);
      }
    }
  }
  treeRound(m, -0.4, -0.4, 0.8, 'leaf');
  m.gem('coral', [-0.36, 0.2, -0.36], 0.015, 0.015, 4);
  m.gem('coral', [-0.44, 0.23, -0.41], 0.015, 0.015, 4);
  // water well
  m.prism('stone', [0.38, -0.2], 0.05, G, G + 0.06, 8, 0, 'water');
  for (const z of [-0.24, -0.16]) m.prism('bark', [0.38, z], 0.006, G + 0.06, G + 0.16, 4);
  m.gable('terracotta', 'bark', [0.33, G + 0.16, -0.26], [0.43, G + 0.2, -0.14]);
  fence(m, -0.46, 0.47, -0.06, 0.47, 6);
  fence(m, 0.06, 0.47, 0.46, 0.47, 6);
}

function duplex(m) {
  plate(m, 'grass', 'leaf', 2, 1);
  m.box('cream', [-0.7, G, -0.24], [0.7, 0.36, 0.16]);
  m.box('paper', [-0.012, G, -0.25], [0.012, 0.36, 0.17]);
  m.hip('slate', [-0.75, 0.36, -0.29], [0.75, 0.56, 0.21], 1.1);
  for (const s of [-1, 1]) {
    const cx = s * 0.35;
    patch(m, 'stone', cx + s * 0.12 - 0.07, 0.16, cx + s * 0.12 + 0.07, 0.5, 0.006, 'dark');
    door(m, '+z', 0.16, cx - s * 0.05, 0.08, 0.17, s < 0 ? 'coral' : 'teal');
    win(m, '+z', 0.16, cx + s * 0.16, 0.22, 0.1, 0.1);
    win(m, '+z', 0.16, cx - s * 0.2, 0.22, 0.06, 0.1);
    m.box({ sides: 'red', top: 'dark' }, [cx + s * 0.1 - 0.035, 0.42, -0.14], [cx + s * 0.1 + 0.035, 0.6, -0.07]);
    windowsAround(m, [-0.7, -0.24, 0.7, 0.16], 1, { sides: s < 0 ? '-x' : '+x', y0: G, fh: 0.32, cols: 2, w: 0.08 });
    car(m, cx + s * 0.12, 0.38, 0, s < 0 ? 'sunflower' : 'sky');
    bush(m, cx - s * 0.2, 0.34, 0.045, 'leaf', s < 0 ? 'pink' : 'lavender');
    treeRound(m, s * 0.88, -0.36, 0.8, s < 0 ? 'leaf' : 'grass');
  }
  fence(m, 0, 0.2, 0, 0.47, 4);
}

function flats(m) {
  plate(m, 'stone', 'dark');
  const floors = 6, fh = 0.19, top = G + floors * fh;
  m.box('cream', [-0.3, G, -0.26], [0.3, top, 0.2]);
  m.box('coral', [0.3, G, -0.14], [0.4, top + 0.08, 0.08]);
  for (let f = 0; f < floors; f++) {
    const y = G + f * fh;
    if (f > 0) {
      m.box({ top: 'kerb', sides: 'paper' }, [-0.31, y, 0.2], [0.31, y + 0.015, 0.28]);
      m.box('coral', [-0.31, y + 0.015, 0.27], [0.31, y + 0.06, 0.28]);
      // laundry hanging over the railings
      [['sky', -0.22], ['sunflower', 0.05], ['pink', 0.18], ['mint', -0.08]].forEach(([c, x], i) => {
        if ((f + i) % 3 === 0) m.box(c, [x, y + 0.03, 0.281], [x + 0.04, y + 0.075, 0.285]);
      });
    }
    for (const x of [-0.2, 0, 0.2]) win(m, '+z', 0.2, x, y + fh * 0.55, 0.08, 0.09);
    win(m, '+x', 0.4, -0.03, y + fh * 0.6, 0.06, 0.06);
  }
  windowsAround(m, [-0.3, -0.26, 0.3, 0.2], floors, { sides: '-x-z', y0: G, fh, cols: 3 });
  m.box({ sides: 'paper', top: 'kerb' }, [-0.32, top, -0.28], [0.32, top + 0.03, 0.22]);
  for (const x of [-0.16, 0.06]) m.prism('blue', [x, -0.08], 0.045, top + 0.03, top + 0.11, 8);
  door(m, '+z', 0.2, 0, 0.1, 0.16, 'coral');
  bush(m, -0.4, 0.38, 0.05, 'leaf', 'sunflower');
  treeRound(m, 0.4, 0.38, 0.7);
}

function villaPool(m) {
  plate(m, 'grass', 'leaf', 2, 1);
  patch(m, 'wood', -0.1, 0.02, 0.9, 0.46, 0.008, 'bark');
  pool(m, 0.0, 0.1, 0.72, 0.38);
  m.box('paper', [-0.9, G, -0.4], [-0.1, 0.4, 0.1]);
  m.box({ sides: 'glass' }, [-0.86, G + 0.01, 0.1], [-0.14, 0.34, 0.11]);
  for (const x of [-0.7, -0.5, -0.3]) m.box('paper', [x - 0.008, G, 0.1], [x + 0.008, 0.36, 0.115]);
  m.box('dark', [-0.92, 0.4, -0.42], [-0.08, 0.42, 0.14]);
  m.box('wood', [-0.1, G, -0.4], [0.5, 0.26, -0.06]);
  m.box({ sides: 'glass' }, [-0.06, G + 0.01, -0.06], [0.46, 0.22, -0.05]);
  m.box('dark', [-0.12, 0.26, -0.42], [0.52, 0.28, -0.02]);
  m.box('paper', [-0.5, 0.42, -0.36], [-0.14, 0.58, 0.02]);
  m.box({ sides: 'glass' }, [-0.48, 0.44, 0.02], [-0.16, 0.56, 0.03]);
  m.box('dark', [-0.52, 0.58, -0.38], [-0.12, 0.6, 0.04]);
  for (const x of [0.06, 0.18, 0.3]) lounger(m, x, -0.0, PI);
  umbrella(m, 0.8, 0.12, 'coral');
  umbrella(m, 0.8, 0.34, 'sunflower');
  palm(m, 0.9, -0.34, 1.2, 0.3);
  palm(m, 0.66, -0.36, 0.9);
  palm(m, -0.9, 0.38, 1.1, -0.2);
  bush(m, -0.6, 0.36, 0.05, 'leaf', 'pink');
}

function luxury(m) {
  plate(m, 'grass', 'leaf', 2, 2);
  patch(m, 'stone', 0.52, 0.2, 0.86, 1, 0.006, 'dark');
  patch(m, 'kerb', -0.12, 0.44, 0.12, 1, 0.006, 'stone');
  pool(m, -0.86, 0.4, -0.26, 0.74);
  patch(m, 'wood', -0.96, 0.26, -0.18, 0.4, 0.008, 'bark');
  // ground floor
  m.box({ sides: 'glass', top: 'paper' }, [-0.7, G, -0.6], [0.3, 0.28, 0.22]);
  for (let x = -0.7; x <= 0.301; x += 0.125) m.box('dark', [x - 0.008, G, 0.22], [x + 0.008, 0.28, 0.23]);
  m.box('stone', [0.3, G, -0.6], [0.9, 0.3, 0.2]);
  m.box('kerb', [0.54, G, 0.2], [0.84, 0.22, 0.21]);
  m.box('dark', [0.28, 0.3, -0.62], [0.92, 0.32, 0.22]);
  // cantilevered upper floor
  m.box('paper', [-0.82, 0.28, -0.7], [0.4, 0.56, 0.32]);
  m.box({ sides: 'glass' }, [-0.78, 0.32, 0.32], [0.2, 0.52, 0.33]);
  m.box('wood', [0.22, 0.3, 0.32], [0.38, 0.55, 0.335]);
  m.box('dark', [-0.84, 0.56, -0.72], [0.42, 0.58, 0.34]);
  // roof terrace
  m.box({ sides: 'wood', top: 'wood' }, [-0.5, 0.58, -0.5], [0.1, 0.78, -0.1]);
  m.box('dark', [-0.52, 0.78, -0.52], [0.12, 0.8, -0.08]);
  for (const x of [-0.7, 0.3]) umbrella(m, x, 0.1, 'coral', 0.58);
  lounger(m, 0.2, 0.2, 0, 'paper');
  m.with({ t: [0, 0.54, 0] }, () => lounger(m, -0.62, 0.2, 0));
  for (const x of [-0.74, -0.54, -0.34]) lounger(m, x, 0.33, PI);
  car(m, 0.62, 0.7, 0, 'dark', 1.2);
  car(m, 0.78, 0.5, 0, 'red', 1.2);
  door(m, '+z', 0.23, 0, 0.1, 0.2, 'wood');
  hedge(m, -0.98, 0.94, -0.16, 0.98);
  hedge(m, 0.16, 0.94, 0.5, 0.98);
  for (const [x, z] of [[-0.9, -0.88], [-0.5, -0.9], [0.9, -0.88], [0.9, 0.9]]) treePine(m, x, z, 1);
  palm(m, -0.14, 0.6, 1.2);
  bush(m, 0.4, 0.5, 0.05, 'leaf', 'pink');
}

function mansion(m) {
  plate(m, 'grass', 'leaf', 2, 2);
  // circular drive and fountain
  m.prism('sand', [0, 0.52], 0.34, G, G + 0.006, 12, 0, 'sand');
  m.prism('grass', [0, 0.52], 0.2, G, G + 0.01, 12, 0, 'grass');
  m.prism('stone', [0, 0.52], 0.1, G, G + 0.05, 8, 0, 'kerb');
  m.prism('water', [0, 0.52], 0.08, G + 0.05, G + 0.054, 8);
  m.prism('kerb', [0, 0.52], 0.015, G + 0.05, G + 0.14, 6);
  m.gem('sky', [0, G + 0.16, 0.52], 0.02, 0.025, 5);
  patch(m, 'sand', -0.08, 0.84, 0.08, 1);
  // main block with portico
  m.box('cream', [-0.4, G, -0.62], [0.4, 0.58, 0.02]);
  m.box('paper', [-0.405, 0.3, -0.625], [0.405, 0.32, 0.025]);
  m.hip('slate', [-0.45, 0.58, -0.67], [0.45, 0.8, 0.07], 0.5);
  m.box({ top: 'kerb', sides: 'stone' }, [-0.22, G, 0.02], [0.22, 0.08, 0.16]);
  for (const x of [-0.19, -0.065, 0.065, 0.19]) column(m, x, 0.13, 0.08, 0.5, 0.016);
  m.box('paper', [-0.23, 0.5, -0.02], [0.23, 0.55, 0.17]);
  m.gableZ('slate', 'paper', [-0.24, 0.55, -0.02], [0.24, 0.68, 0.18]);
  m.prism('slate', [0, -0.3], 0.1, 0.78, 0.84, 8, 0, 'slate');
  m.frustum('slate', [0, -0.3], 0.1, 0.03, 0.84, 0.94, 8);
  m.frustum('gold', [0, -0.3], 0.012, 0, 0.94, 1.0, 4);
  door(m, '+z', 0.02, 0, 0.1, 0.22, 'maroon', 0.08);
  windowsAround(m, [-0.4, -0.62, 0.4, 0.02], 2, { y0: G + 0.02, fh: 0.26, cols: 4, w: 0.06, h: 0.13, skip: (d, f, i) => d === '+z' && f === 0 && (i === 1 || i === 2) });
  // wings
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -0.86 : 0.4, x1 = s < 0 ? -0.4 : 0.86;
    m.box('cream', [x0, G, -0.5], [x1, 0.4, 0.2]);
    m.hip('slate', [x0 - 0.04, 0.4, -0.54], [x1 + 0.04, 0.56, 0.24], 0.3);
    windowsAround(m, [x0, -0.5, x1, 0.2], 1, { sides: s < 0 ? '+z-x-z' : '+z+x-z', y0: G, fh: 0.34, cols: 3, w: 0.06, h: 0.14 });
    m.box({ sides: 'red', top: 'dark' }, [(x0 + x1) / 2 - 0.03, 0.46, -0.2], [(x0 + x1) / 2 + 0.03, 0.62, -0.14]);
    // formal gardens
    hedge(m, s * 0.42 - 0.2, 0.36, s * 0.42 + 0.2, 0.4);
    hedge(m, s * 0.42 - 0.2, 0.56, s * 0.42 + 0.2, 0.6);
    for (const z of [0.44, 0.52]) bush(m, s * 0.42, z, 0.035, 'leaf', 'pink');
    for (const z of [-0.2, 0.2, 0.6, 0.9]) m.gem('pine', [s * 0.94, G + 0.12, z], 0.04, 0.12, 5);
    m.box({ sides: 'kerb', top: 'stone' }, [s * 0.12 - 0.04, G, 0.9], [s * 0.12 + 0.04, 0.2, 0.98]);
    m.gem('gold', [s * 0.12, 0.23, 0.94], 0.02, 0.025, 4);
  }
  hedge(m, -0.98, 0.94, -0.18, 0.98, 0.06);
  hedge(m, 0.18, 0.94, 0.98, 0.98, 0.06);
  for (const x of [-0.7, 0.7]) treeRound(m, x, -0.84, 1.1, x < 0 ? 'leaf' : 'grass');
}

export default [
  { name: 'house_hut', footprint: [1, 1], build: hut },
  { name: 'house_stilt', footprint: [1, 1], build: stilt },
  { name: 'house_cottage', footprint: [1, 1], build: cottage },
  { name: 'house_basic', footprint: [1, 1], build: house },
  { name: 'house_minimalist', footprint: [1, 1], build: minimalist },
  { name: 'house_row', footprint: [1, 1], build: row },
  { name: 'house_garage', footprint: [1, 1], build: garage },
  { name: 'house_two_storey', footprint: [1, 1], build: twoStorey },
  { name: 'house_joglo', footprint: [1, 1], build: joglo },
  { name: 'house_gadang', footprint: [1, 1], build: gadang },
  { name: 'house_colonial', footprint: [1, 1], build: colonial },
  { name: 'house_bungalow', footprint: [1, 1], build: bungalow },
  { name: 'house_modern_glass', footprint: [1, 1], build: modernGlass },
  { name: 'house_garden', footprint: [1, 1], build: garden },
  { name: 'house_duplex', footprint: [2, 1], build: duplex },
  { name: 'house_apartment', footprint: [1, 1], build: apartment },
  { name: 'house_flats', footprint: [1, 1], build: flats },
  { name: 'house_villa_pool', footprint: [2, 1], build: villaPool },
  { name: 'house_luxury', footprint: [2, 2], build: luxury },
  { name: 'house_mansion', footprint: [2, 2], build: mansion },
];
