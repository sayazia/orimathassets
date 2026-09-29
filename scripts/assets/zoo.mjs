import { PI, G, plate, patch, treeRound, treePine, bush, bench, fence, flagpole, person, palm, sign, umbrella } from '../lib/parts.mjs';
import { elephant, giraffe, lion, zebra, penguin, monkey, bird } from '../lib/animals.mjs';

// Low stone wall with wooden rail around an enclosure, open on the +z side for viewing.
function enclosure(m, ground = 'straw', side = 'sand') {
  plate(m, 'kerb', 'stone');
  m.box({ top: ground, sides: side }, [-0.44, G, -0.44], [0.44, G + 0.01, 0.3]);
  for (const [x0, z0, x1, z1] of [[-0.46, -0.46, 0.46, -0.44], [-0.46, -0.46, -0.44, 0.32], [0.44, -0.46, 0.46, 0.32], [-0.46, 0.3, 0.46, 0.32]]) {
    m.box({ sides: 'stone', top: 'kerb' }, [x0, G, z0], [x1, G + 0.05, z1]);
  }
  m.box('wood', [-0.46, G + 0.08, 0.305], [0.46, G + 0.09, 0.315]);
  for (let x = -0.44; x <= 0.441; x += 0.11) m.box('wood', [x - 0.006, G + 0.05, 0.304], [x + 0.006, G + 0.09, 0.316]);
}

function acacia(m, x, z, s = 1) {
  m.with({ t: [x, 0, z], s }, () => {
    m.with({ rz: 0.15 }, () => m.prism('bark', [0, 0], 0.014, G, 0.24, 5));
    m.gem('leaf', [0.03, 0.26, 0], 0.13, 0.03, 7);
  });
}

function zooGate(m) {
  plate(m, 'grass');
  patch(m, 'sand', -0.16, -0.5, 0.16, 0.5);
  for (const s of [-1, 1]) {
    m.box({ sides: 'bark', top: 'wood' }, [s * 0.2 - 0.05, G, -0.05], [s * 0.2 + 0.05, 0.36, 0.05]);
    m.frustum('leaf', [s * 0.2, 0], 0.07, 0, 0.36, 0.46, 6);
  }
  m.box('wood', [-0.28, 0.3, -0.04], [0.28, 0.38, 0.04]);
  sign(m, 0, 0.3, 0.04, 0.4, 0.07, 'leaf', 'sunflower');
  giraffe(m, -0.06, 0, PI / 2, 0.5, 0.38);
  elephant(m, 0.12, 0, -PI / 2, 0.45, 0.38);
  // ticket booth and fences
  m.box('sunflower', [0.26, G, 0.14], [0.42, 0.2, 0.3]);
  m.hip('coral', [0.24, 0.2, 0.12], [0.44, 0.28, 0.32]);
  m.box('glass', [0.28, 0.1, 0.3], [0.4, 0.17, 0.305]);
  fence(m, -0.47, 0, -0.25, 0, 4);
  fence(m, 0.25, 0, 0.47, 0, 4);
  for (const x of [-0.4, 0.4]) flagpole(m, x, 0.4, 0.34, x < 0 ? 'coral' : 'teal');
  person(m, 0.05, 0.3, PI, { shirt: 'mint', pants: 'navy', pose: 'walk' });
  person(m, -0.08, 0.22, PI, { shirt: 'pink', pants: 'dark', pose: 'wave', s: 0.7 });
  treeRound(m, -0.36, -0.34, 0.9);
  palm(m, 0.36, -0.34, 1);
}

function zooElephant(m) {
  enclosure(m, 'sand', 'bark');
  m.prism('water', [0.18, -0.2], 0.16, G + 0.01, G + 0.014, 9);
  elephant(m, -0.15, -0.1, 0.6, 1, G + 0.01);
  elephant(m, 0.05, 0.1, -0.4, 0.6, G + 0.01);
  for (let i = 0; i < 2; i++) m.with({ t: [-0.26, G + 0.02 + i * 0.024, -0.36 + i * 0.01], rz: PI / 2 }, () => m.prism('bark', [0, 0], 0.012, -0.1, 0.1, 6));
  treeRound(m, -0.34, 0.16, 0.9);
  bush(m, 0.36, 0.2, 0.05, 'leaf');
  person(m, 0.2, 0.42, PI, { shirt: 'coral', pants: 'dark' });
}

function zooGiraffe(m) {
  enclosure(m, 'straw', 'sand');
  acacia(m, -0.24, -0.26, 1.1);
  acacia(m, 0.3, -0.1, 0.9);
  giraffe(m, -0.1, -0.1, 0.4, 1, G + 0.01);
  giraffe(m, 0.16, 0.12, -0.8, 0.8, G + 0.01);
  zebra(m, -0.3, 0.15, 1.2, 1, G + 0.01);
  // feeding platform
  m.box({ sides: 'bark', top: 'wood' }, [0.28, G, 0.34], [0.44, 0.22, 0.46]);
  for (let i = 0; i < 4; i++) m.box({ sides: 'bark', top: 'wood' }, [0.14 + i * 0.035, G, 0.36], [0.175 + i * 0.035, G + 0.04 + i * 0.045, 0.44]);
  person(m, 0.36, 0.4, PI, { shirt: 'sunflower', pants: 'navy', pose: 'wave', y: 0.22 });
}

function zooLion(m) {
  enclosure(m, 'straw', 'sand');
  m.gem('terracotta', [0.1, G + 0.06, -0.2], 0.2, 0.1, 7);
  m.gem('sand', [-0.22, G + 0.03, -0.28], 0.12, 0.06, 6);
  lion(m, 0.08, -0.2, 0.3, 1.2, G + 0.14);
  lion(m, -0.2, 0.05, 1.8, 1, G + 0.01, false);
  lion(m, 0.25, 0.12, -1.2, 0.9, G + 0.01, false);
  acacia(m, -0.32, -0.3, 1);
  person(m, -0.15, 0.42, PI, { shirt: 'sky', pants: 'dark' });
  person(m, -0.05, 0.42, PI, { shirt: 'pink', pants: 'purple', s: 0.7, pose: 'wave' });
}

function zooPenguin(m) {
  plate(m, 'kerb', 'stone');
  m.box({ top: 'paper', sides: 'sky' }, [-0.44, G, -0.44], [0.44, G + 0.03, 0.3]);
  m.box('water', [-0.1, G + 0.03, -0.1], [0.4, G + 0.034, 0.26]);
  for (const [x, z, h] of [[-0.3, -0.3, 0.12], [-0.15, -0.34, 0.08], [0.3, -0.32, 0.1]]) m.box({ sides: 'sky', top: 'paper' }, [x - 0.07, G + 0.03, z - 0.06], [x + 0.07, G + 0.03 + h, z + 0.06]);
  for (const [x, z, ry] of [[-0.3, -0.05, 0.3], [-0.2, 0.05, -0.2], [-0.35, 0.15, 0.8], [-0.3, -0.3, 0], [0.12, 0.06, 1.2]]) penguin(m, x, z, ry, 1, z === -0.3 ? G + 0.15 : x > 0 ? G + 0.01 : G + 0.03);
  // glass viewing wall
  m.box('glass', [-0.44, G, 0.3], [0.44, G + 0.14, 0.31]);
  m.box({ sides: 'stone', top: 'kerb' }, [-0.46, G, 0.31], [0.46, G + 0.02, 0.33]);
  person(m, 0.2, 0.42, PI, { shirt: 'coral', pants: 'navy', s: 0.7, pose: 'wave' });
  person(m, -0.1, 0.42, PI, { shirt: 'teal', pants: 'dark' });
}

function zooMonkey(m) {
  plate(m, 'kerb', 'stone');
  m.box('water', [-0.46, G, -0.46], [0.46, G + 0.006, 0.34]);
  m.prism('grass', [0, -0.08], 0.28, G, G + 0.03, 10, 0, 'grass');
  m.box({ sides: 'stone', top: 'kerb' }, [-0.46, G, 0.34], [0.46, G + 0.04, 0.36]);
  // climbing frame and a palm
  for (const [x, z] of [[-0.12, -0.2], [0.1, -0.2], [-0.12, 0.02], [0.1, 0.02]]) m.prism('wood', [x, z], 0.01, G + 0.03, 0.3, 5);
  m.box({ sides: 'wood', top: 'straw' }, [-0.14, 0.2, -0.22], [0.12, 0.22, 0.04]);
  m.box('wood', [-0.12, 0.3, -0.2], [0.1, 0.31, -0.19]);
  m.box('bark', [-0.02, 0.18, -0.2], [-0.018, 0.3, -0.198]);
  palm(m, 0.18, -0.2, 1.1);
  monkey(m, -0.02, -0.1, 0.4, 1.1, 0.22);
  monkey(m, -0.2, 0.08, 1.2, 1, G + 0.03);
  monkey(m, 0.14, 0.06, -0.8, 0.9, G + 0.03);
  m.with({ t: [-0.019, 0.24, -0.2] }, () => monkey(m, 0, 0, 0, 0.8, 0));
  for (const x of [-0.3, 0.2]) person(m, x, 0.44, PI, { shirt: x < 0 ? 'lemon' : 'lavender', pants: 'dark' });
}

function zooAviary(m) {
  plate(m, 'grass');
  const n = 8, r = 0.4, h = 0.34;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2;
    m.prism('dark', [Math.cos(a) * r, Math.sin(a) * r], 0.006, G, h, 4);
    m.beam('dark', [Math.cos(a) * r, h, Math.sin(a) * r], [0, h + 0.26, 0], 0.008);
  }
  for (const y of [G + 0.1, G + 0.2, h]) m.arc('dark', [0, 0], r - 0.004, r + 0.004, 0, 2 * PI, y - 0.004, y + 0.004, n);
  m.prism('dark', [0, 0], 0.012, h + 0.26, h + 0.28, 6);
  treeRound(m, -0.12, -0.1, 1.2);
  palm(m, 0.14, 0.05, 1.1);
  m.prism('water', [0.1, -0.2], 0.1, G, G + 0.006, 8);
  const cols = ['coral', 'sky', 'sunflower', 'mint', 'pink', 'lavender', 'red'];
  [[-0.2, 0.27, 0.1], [0.08, 0.3, -0.12], [0.2, 0.18, 0.15], [-0.05, 0.05, 0.25], [0.1, 0.01, -0.2], [-0.25, 0.01, 0.1], [0.25, 0.01, -0.05]].forEach(([x, y, z], i) => bird(m, x, z, i, cols[i], 1.3, y + G));
  patch(m, 'sand', -0.06, 0.4, 0.06, 0.5);
  person(m, 0.3, 0.44, PI * 0.8, { shirt: 'orange', pants: 'navy' });
}

export default [
  { name: 'zoo_gate', footprint: [1, 1], build: zooGate },
  { name: 'zoo_elephant', footprint: [1, 1], build: zooElephant },
  { name: 'zoo_giraffe', footprint: [1, 1], build: zooGiraffe },
  { name: 'zoo_lion', footprint: [1, 1], build: zooLion },
  { name: 'zoo_penguin', footprint: [1, 1], build: zooPenguin },
  { name: 'zoo_monkey', footprint: [1, 1], build: zooMonkey },
  { name: 'zoo_aviary', footprint: [1, 1], build: zooAviary },
];
