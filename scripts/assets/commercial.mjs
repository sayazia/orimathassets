import { PI, G, plate, patch, win, door, windowsAround, treeRound, treePine, bush, bench, column, pool, lounger, umbrella, hedge, palm, car, tower, sign, hvac, cafeTable, awning } from '../lib/parts.mjs';

function shop(m) {
  plate(m, 'stone', 'dark');
  m.box('mint', [-0.32, G, -0.26], [0.32, 0.38, 0.2]);
  m.box({ sides: 'paper', top: 'teal' }, [-0.34, 0.38, -0.28], [0.34, 0.41, 0.22]);
  m.box({ sides: 'coral', top: 'paper' }, [-0.24, 0.41, 0.16], [0.24, 0.51, 0.21]);
  for (const x of [-0.18, -0.09, 0, 0.09, 0.18]) m.box('paper', [x - 0.025, 0.44, 0.21], [x + 0.025, 0.48, 0.215]);
  // shop window + door
  m.box('paper', [-0.29, G + 0.03, 0.2], [0.29, 0.27, 0.21]);
  m.box('glass', [-0.27, G + 0.05, 0.2], [-0.07, 0.25, 0.218]);
  m.box('glass', [0.07, G + 0.05, 0.2], [0.27, 0.25, 0.218]);
  door(m, '+z', 0.2, 0, 0.1, 0.2, 'teal');
  // striped awning
  const n = 8, w = 0.64 / n;
  for (let i = 0; i < n; i++) {
    const x = -0.32 + w * (i + 0.5);
    m.with({ t: [x, 0.32, 0.2], rx: 0.45 }, () => m.box(i % 2 ? 'paper' : 'coral', [-w / 2, -0.006, 0], [w / 2, 0.006, 0.16]));
  }
  for (const x of [-0.26, 0.26]) win(m, x > 0 ? '+x' : '-x', x > 0 ? 0.32 : -0.32, -0.05, 0.22, 0.14, 0.1);
  for (const x of [-0.38, 0.38]) {
    m.prism('orange', [x, 0.36], 0.04, G, G + 0.05, 6, 0, 'bark');
    bush(m, x, 0.36, 0.035, 'leaf', x < 0 ? 'pink' : 'sunflower');
  }
  bench(m, 0.0, 0.44, 0);
}

function parkingLines(m, x0, x1, z0, z1, step = 0.13) {
  for (let x = x0; x <= x1 + 1e-6; x += step) m.box('paper', [x - 0.004, G, z0], [x + 0.004, G + 0.004, z1]);
}

function minimarket(m) {
  plate(m, 'stone', 'dark');
  parkingLines(m, -0.4, 0.4, 0.3, 0.48);
  car(m, -0.27, 0.39, 0, 'sky');
  car(m, 0.13, 0.39, PI, 'lemon');
  m.box('paper', [-0.38, G, -0.36], [0.38, 0.3, 0.2]);
  m.box('sky', [-0.385, 0.22, -0.365], [0.385, 0.27, 0.205]);
  m.box('coral', [-0.385, 0.27, -0.365], [0.385, 0.3, 0.205]);
  m.box('glass', [-0.34, G + 0.01, 0.2], [0.34, 0.2, 0.21]);
  for (const x of [-0.17, 0, 0.17]) m.box('paper', [x - 0.006, G, 0.2], [x + 0.006, 0.2, 0.215]);
  sign(m, 0, 0.3, 0.14, 0.4, 0.08, 'sky', 'paper');
  m.box({ sides: 'coral', top: 'paper' }, [0.3, G, 0.21], [0.36, 0.14, 0.25]);
  hvac(m, -0.2, -0.2, 0.3);
  hvac(m, 0.2, -0.2, 0.3);
}

function cafe(m) {
  plate(m, 'kerb', 'stone');
  m.box('sunflower', [-0.3, G, -0.34], [0.3, 0.3, 0.06]);
  m.box({ sides: 'paper', top: 'teal' }, [-0.32, 0.3, -0.36], [0.32, 0.33, 0.08]);
  m.box('glass', [-0.25, G + 0.02, 0.06], [0.1, 0.22, 0.07]);
  door(m, '+z', 0.06, 0.18, 0.08, 0.17, 'teal');
  awning(m, -0.3, 0.3, 0.26, 0.06, 'teal', 'paper', 0.12);
  // giant coffee cup on the roof
  m.frustum('paper', [0, -0.14], 0.08, 0.1, 0.33, 0.47, 10, 0, 'bark');
  m.prism('coral', [0, -0.14], 0.092, 0.37, 0.41, 10);
  m.with({ t: [0.1, 0.4, -0.14], rx: PI / 2 }, () => m.prism('paper', [0, 0], 0.035, -0.012, 0.012, 8));
  for (const [x, z, c] of [[-0.28, 0.3, 'coral'], [0, 0.36, 'teal'], [0.28, 0.3, 'coral']]) cafeTable(m, x, z, c);
  for (const x of [-0.42, 0.42]) m.prism('terracotta', [x, -0.4], 0.03, G, G + 0.05, 6, 0, 'bark');
  for (const x of [-0.42, 0.42]) bush(m, x, -0.4, 0.035, 'leaf', 'pink');
}

function restaurant(m) {
  plate(m, 'kerb', 'stone');
  m.box('maroon', [-0.34, G, -0.34], [0.34, 0.34, 0.06]);
  m.gable('ijuk', 'maroon', [-0.38, 0.34, -0.39], [0.38, 0.52, 0.11]);
  for (const x of [-0.22, 0.22]) win(m, '+z', 0.06, x, 0.2, 0.12, 0.12, 'lemon');
  door(m, '+z', 0.06, 0, 0.1, 0.19, 'wood');
  sign(m, 0, 0.28, 0.08, 0.34, 0.05, 'gold', 'maroon');
  // terrace with a pergola and lanterns
  m.box({ top: 'wood', sides: 'bark' }, [-0.4, G, 0.08], [0.4, G + 0.015, 0.44]);
  for (const x of [-0.38, 0, 0.38]) m.prism('bark', [x, 0.42], 0.01, G, 0.3, 5);
  m.box('bark', [-0.4, 0.29, 0.4], [0.4, 0.31, 0.44]);
  for (let x = -0.36; x <= 0.37; x += 0.08) m.box('bark', [x - 0.006, 0.31, 0.06], [x + 0.006, 0.325, 0.44]);
  for (const x of [-0.27, -0.09, 0.09, 0.27]) {
    m.prism('dark', [x, 0.43], 0.002, 0.24, 0.29, 3);
    m.gem('red', [x, 0.22, 0.43], 0.018, 0.024, 6);
  }
  for (const x of [-0.2, 0.2]) {
    m.box('wood', [x - 0.06, G + 0.05, 0.2], [x + 0.06, G + 0.06, 0.3]);
    m.box('bark', [x - 0.005, G, 0.245], [x + 0.005, G + 0.05, 0.255]);
    for (const s of [-1, 1]) m.box('bark', [x - 0.05, G, 0.25 + s * 0.08 - 0.015], [x + 0.05, G + 0.03, 0.25 + s * 0.08 + 0.015]);
  }
}

function market(m) {
  plate(m, 'kerb', 'stone', 2, 1);
  const roofs = ['coral', 'sky', 'sunflower', 'mint', 'pink', 'orange'];
  const produce = [['coral', 'sunflower'], ['leaf', 'orange'], ['red', 'lemon'], ['purple', 'leaf']];
  let k = 0;
  for (const z of [-0.26, 0.16]) {
    for (let i = 0; i < 5; i++) {
      const x = -0.8 + i * 0.4;
      const c = roofs[k % roofs.length];
      for (const px of [-0.14, 0.14]) for (const pz of [-0.12, 0.12]) m.prism('bark', [x + px, z + pz], 0.008, G, 0.2, 4);
      m.gable(c, 'paper', [x - 0.17, 0.2, z - 0.16], [x + 0.17, 0.3, z + 0.16]);
      m.box({ top: 'wood', sides: 'bark' }, [x - 0.13, G, z - 0.04], [x + 0.13, G + 0.08, z + 0.1]);
      const [a, b] = produce[k % produce.length];
      for (let j = 0; j < 4; j++) m.gem(j % 2 ? a : b, [x - 0.09 + j * 0.06, G + 0.095, z + 0.03], 0.022, 0.018, 5);
      m.box({ sides: 'bark', top: 'straw' }, [x + 0.06, G, z - 0.12], [x + 0.12, G + 0.05, z - 0.06]);
      k++;
    }
  }
  umbrella(m, -0.95, 0.44, 'coral');
  umbrella(m, 0.95, 0.44, 'teal');
  sign(m, 0, 0.36, 0.34, 0.5, 0.08, 'red', 'paper');
  for (const x of [-0.24, 0.24]) m.prism('dark', [x, 0.35], 0.008, G, 0.4, 4);
}

function mall(m) {
  plate(m, 'stone', 'dark', 2, 2);
  parkingLines(m, -0.9, 0.9, 0.62, 0.9, 0.15);
  [['coral', -0.75], ['sky', -0.45], ['paper', -0.15], ['lemon', 0.45], ['dark', 0.75]].forEach(([c, x], i) => car(m, x, 0.76, i % 2 ? PI : 0, c));
  m.box('cream', [-0.9, G, -0.9], [0.9, 0.5, 0.4]);
  m.box('coral', [-0.905, 0.4, -0.905], [0.905, 0.46, 0.405]);
  m.box('paper', [-0.91, 0.5, -0.91], [0.91, 0.53, 0.41]);
  m.box('glass', [-0.86, G + 0.02, 0.4], [-0.2, 0.36, 0.41]);
  m.box('glass', [0.2, G + 0.02, 0.4], [0.86, 0.36, 0.41]);
  for (let x = -0.86; x <= 0.87; x += 0.11) if (Math.abs(x) > 0.2) m.box('paper', [x - 0.006, G, 0.4], [x + 0.006, 0.36, 0.415]);
  // entrance block with glass atrium dome
  m.box({ sides: 'glass', top: 'sky' }, [-0.2, G, 0.3], [0.2, 0.62, 0.5]);
  m.box('sky', [-0.22, 0.62, 0.28], [0.22, 0.66, 0.52]);
  m.frustum('glass', [0, -0.2], 0.34, 0.16, 0.53, 0.72, 12);
  m.frustum('sky', [0, -0.2], 0.16, 0, 0.72, 0.78, 12);
  sign(m, 0, 0.52, 0.5, 0.36, 0.08, 'coral', 'paper');
  for (const [x, z] of [[-0.6, -0.5], [0.6, -0.5], [0.6, -0.1]]) hvac(m, x, z, 0.53);
  for (const x of [-0.94, -0.3, 0.3, 0.94]) treeRound(m, x, 0.54, 0.8, 'grass');
}

function hotel(m) {
  plate(m, 'stone', 'dark');
  m.box('paper', [-0.4, G, -0.36], [0.4, 0.22, 0.26]);
  m.box({ sides: 'gold', top: 'paper' }, [-0.16, 0.17, 0.26], [0.16, 0.2, 0.42]);
  for (const x of [-0.14, 0.14]) m.prism('gold', [x, 0.4], 0.008, G, 0.17, 5);
  m.box('glass', [-0.34, G + 0.02, 0.26], [0.34, 0.16, 0.27]);
  // podium pool terrace
  m.with({ t: [0, 0.18, 0] }, () => {
    pool(m, 0.14, 0.02, 0.34, 0.2);
    lounger(m, 0.2, -0.28, 0);
  });
  const top = tower(m, [-0.36, -0.32, 0.1, 0.12], 0.22, 7, 0.14, { glass: 'coral', band: 'paper', mullion: 'maroon', cols: 4 });
  for (let f = 1; f < 7; f++) m.box({ top: 'kerb', sides: 'paper' }, [-0.34, 0.22 + f * 0.14, 0.12], [0.08, 0.22 + f * 0.14 + 0.012, 0.17]);
  m.box({ sides: 'gold', top: 'maroon' }, [0.1, 0.4, 0.02], [0.14, 1.0, 0.1]);
  for (let y = 0.45; y < 0.98; y += 0.1) m.box('paper', [0.14, y, 0.035], [0.145, y + 0.06, 0.085]);
  m.box('maroon', [-0.37, top, -0.33], [0.11, top + 0.04, 0.13]);
  umbrella(m, 0.3, -0.12, 'sunflower', 0.22);
  palm(m, 0.44, 0.42, 0.8);
  palm(m, -0.44, 0.42, 0.8);
}

function cinema(m) {
  plate(m, 'kerb', 'stone');
  m.box('purple', [-0.38, G, -0.38], [0.38, 0.46, 0.14]);
  m.box('navy', [-0.385, 0.42, -0.385], [0.385, 0.46, 0.145]);
  // marquee with bulbs
  m.box({ sides: 'lemon', top: 'navy' }, [-0.3, 0.24, 0.14], [0.3, 0.3, 0.3]);
  for (let x = -0.28; x <= 0.281; x += 0.04) m.gem('paper', [x, 0.27, 0.305], 0.008, 0.008, 4);
  for (const x of [-0.18, 0, 0.18]) m.box('dark', [x - 0.05, 0.25, 0.3], [x + 0.05, 0.29, 0.302]);
  m.box('glass', [-0.2, G + 0.01, 0.14], [0.2, 0.22, 0.15]);
  for (const x of [-0.31, 0.31]) {
    m.box('paper', [x - 0.05, 0.06, 0.14], [x + 0.05, 0.22, 0.15]);
    m.box(x < 0 ? 'coral' : 'sky', [x - 0.04, 0.07, 0.15], [x + 0.04, 0.21, 0.155]);
  }
  // vertical sign
  m.box({ sides: 'coral', top: 'navy' }, [-0.04, 0.3, 0.14], [0.04, 0.7, 0.2]);
  for (let y = 0.34; y < 0.68; y += 0.07) m.box('lemon', [-0.025, y, 0.2], [0.025, y + 0.045, 0.205]);
  m.box({ sides: 'coral', top: 'paper' }, [0.3, G, 0.34], [0.4, 0.14, 0.44]);
  m.box('glass', [0.32, 0.08, 0.44], [0.38, 0.12, 0.445]);
  for (const x of [-0.2, 0.1]) m.box('coral', [x, G, 0.36], [x + 0.2, G + 0.004, 0.46]);
}

function bank(m) {
  plate(m, 'kerb', 'stone');
  m.box('paper', [-0.36, G, -0.36], [0.36, 0.4, 0.1]);
  m.box({ top: 'kerb', sides: 'stone' }, [-0.3, G, 0.1], [0.3, 0.08, 0.3]);
  for (let i = 0; i < 3; i++) m.box({ top: 'kerb', sides: 'stone' }, [-0.3, G, 0.3 + i * 0.03], [0.3, 0.08 - (i + 1) * 0.02, 0.33 + i * 0.03]);
  for (const x of [-0.24, -0.08, 0.08, 0.24]) column(m, x, 0.24, 0.08, 0.4, 0.016);
  m.box('paper', [-0.3, 0.4, 0.08], [0.3, 0.45, 0.3]);
  m.gableZ('stone', 'paper', [-0.31, 0.45, 0.08], [0.31, 0.56, 0.31]);
  m.gem('gold', [0, 0.495, 0.315], 0.03, 0.03, 6);
  m.box('stone', [-0.37, 0.4, -0.37], [0.37, 0.46, 0.08]);
  door(m, '+z', 0.1, 0, 0.1, 0.22, 'navy', 0.08);
  windowsAround(m, [-0.36, -0.36, 0.36, 0.1], 1, { sides: '+x-x-z', y0: G, fh: 0.36, cols: 3, w: 0.07, h: 0.18 });
  sign(m, 0, 0.36, 0.1, 0.3, 0.035, 'gold', 'navy');
  m.box({ sides: 'navy', top: 'dark' }, [0.36, G, 0.2], [0.44, 0.2, 0.26]);
  m.box('glass', [0.37, 0.12, 0.26], [0.43, 0.17, 0.265]);
}

function gasStation(m) {
  plate(m, 'stone', 'dark');
  // canopy
  for (const [x, z] of [[-0.3, -0.02], [0.3, -0.02], [-0.3, 0.3], [0.3, 0.3]]) m.box('paper', [x - 0.02, G, z - 0.02], [x + 0.02, 0.34, z + 0.02]);
  m.box({ sides: 'coral', top: 'paper' }, [-0.42, 0.34, -0.12], [0.42, 0.4, 0.42]);
  m.box('paper', [-0.425, 0.355, -0.125], [0.425, 0.365, 0.425]);
  // pumps
  for (const x of [-0.12, 0.12]) {
    m.box({ top: 'kerb', sides: 'stone' }, [x - 0.04, G, 0.08], [x + 0.04, G + 0.02, 0.22]);
    for (const z of [0.11, 0.19]) {
      m.box({ sides: 'coral', top: 'paper' }, [x - 0.025, G + 0.02, z - 0.02], [x + 0.025, 0.17, z + 0.02]);
      m.box('dark', [x - 0.018, 0.11, z + 0.02], [x + 0.018, 0.15, z + 0.022]);
    }
  }
  car(m, -0.24, 0.15, 0, 'sky');
  car(m, 0.24, 0.15, PI, 'lemon');
  // shop at the back
  m.box('paper', [-0.4, G, -0.44], [0.1, 0.22, -0.2]);
  m.box('coral', [-0.405, 0.18, -0.445], [0.105, 0.22, -0.195]);
  m.box('glass', [-0.34, G + 0.02, -0.2], [0.04, 0.15, -0.19]);
  // price sign
  m.box('dark', [0.37, G, -0.33], [0.39, 0.4, -0.31]);
  m.box({ sides: 'paper', top: 'coral' }, [0.3, 0.4, -0.34], [0.46, 0.56, -0.3]);
  for (let i = 0; i < 3; i++) m.box(i ? 'dark' : 'coral', [0.32, 0.43 + i * 0.04, -0.3], [0.44, 0.46 + i * 0.04, -0.296]);
}

export default [
  { name: 'shop_general', footprint: [1, 1], build: shop },
  { name: 'shop_minimarket', footprint: [1, 1], build: minimarket },
  { name: 'shop_cafe', footprint: [1, 1], build: cafe },
  { name: 'shop_restaurant', footprint: [1, 1], build: restaurant },
  { name: 'shop_market', footprint: [2, 1], build: market },
  { name: 'shop_mall', footprint: [2, 2], build: mall },
  { name: 'shop_hotel', footprint: [1, 1], build: hotel },
  { name: 'shop_cinema', footprint: [1, 1], build: cinema },
  { name: 'shop_bank', footprint: [1, 1], build: bank },
  { name: 'shop_gas_station', footprint: [1, 1], build: gasStation },
];
