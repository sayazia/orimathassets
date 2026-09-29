import { PI, treeRound, treePine, palm, banyan, bush, hedge, G } from '../lib/parts.mjs';

// Standalone plants sit on y = 0 (the helpers are shifted down by the plate thickness).
const onGround = (fn) => (m) => m.with({ t: [0, -G, 0] }, () => fn(m));

function sakura(m) {
  m.with({ rz: 0.12 }, () => m.prism('bark', [0, 0], 0.025, 0, 0.16, 5));
  m.gem('pink', [0.02, 0.22, 0], 0.13, 0.08, 7);
  m.gem('paper', [-0.06, 0.25, 0.04], 0.06, 0.04, 5);
  m.gem('pink', [0.08, 0.27, -0.03], 0.07, 0.05, 6);
}

function cypress(m) {
  m.prism('bark', [0, 0], 0.015, 0, 0.05, 5);
  m.gem('pine', [0, 0.2, 0], 0.05, 0.17, 6);
}

function coconut(m) {
  palm(m, 0, 0, 1.4, 0.35);
  for (let i = 0; i < 3; i++) m.gem('bark', [0.05 + Math.cos(i * 2.1) * 0.018, 0.47, Math.sin(i * 2.1) * 0.018], 0.014, 0.014, 5);
}

function acacia(m) {
  m.with({ rz: 0.15 }, () => m.prism('bark', [0, 0], 0.018, 0, 0.26, 5));
  m.gem('leaf', [0.04, 0.28, 0], 0.17, 0.035, 8);
}

function bamboo(m) {
  const stems = [[0, 0, 0.36], [0.03, 0.02, 0.3], [-0.03, 0.025, 0.33], [0.01, -0.03, 0.28], [-0.025, -0.02, 0.25]];
  for (const [x, z, h] of stems) {
    for (let y = 0; y < h; y += 0.06) {
      m.prism('grass', [x, z], 0.008, y, y + 0.055, 6);
      m.prism('leaf', [x, z], 0.01, y + 0.055, y + 0.06, 6);
    }
    m.with({ t: [x, h, z], ry: x * 40, rz: 0.8 }, () => m.box('leaf', [0, -0.002, -0.008], [0.06, 0.002, 0.008]));
    m.with({ t: [x, h - 0.05, z], ry: 2 + z * 40, rz: 0.9 }, () => m.box('leaf', [0, -0.002, -0.008], [0.05, 0.002, 0.008]));
  }
}

function cactus(m) {
  m.frustum('terracotta', [0, 0], 0.04, 0.05, 0, 0.05, 8);
  m.prism('bark', [0, 0], 0.045, 0.045, 0.05, 8);
  m.prism('leaf', [0, 0], 0.022, 0.05, 0.16, 8);
  m.gem('leaf', [0, 0.16, 0], 0.022, 0.015, 8);
  for (const s of [-1, 1]) {
    m.box('leaf', [s * 0.02, 0.09, -0.01], [s * 0.045, 0.105, 0.01]);
    m.prism('leaf', [s * 0.045, 0], 0.012, 0.09, 0.13 + (s > 0 ? 0.02 : 0), 6);
  }
  m.gem('pink', [0, 0.18, 0], 0.012, 0.01, 5);
}

function flowerPot(m) {
  m.frustum('terracotta', [0, 0], 0.035, 0.045, 0, 0.06, 8);
  m.prism('bark', [0, 0], 0.04, 0.055, 0.06, 8);
  bush(m, 0, 0, 0.04, 'leaf', 'coral', 0.055);
  bush(m, 0.015, 0.01, 0.025, 'leaf', 'sunflower', 0.075);
}

function flowerBed(m) {
  m.box({ sides: 'stone', top: 'bark' }, [-0.15, 0, -0.06], [0.15, 0.03, 0.06]);
  const cols = ['coral', 'sunflower', 'pink', 'lavender', 'paper', 'red'];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) {
    const x = -0.12 + i * 0.048, z = -0.025 + j * 0.05;
    m.prism('leaf', [x, z], 0.003, 0.03, 0.06, 3);
    m.gem(cols[(i + j) % cols.length], [x, 0.065, z], 0.014, 0.012, 5);
  }
}

export default [
  { name: 'tree_round', footprint: [1, 1], build: onGround((m) => treeRound(m, 0, 0, 1.2)) },
  { name: 'tree_pine', footprint: [1, 1], build: onGround((m) => treePine(m, 0, 0, 1.2)) },
  { name: 'tree_palm', footprint: [1, 1], build: (m) => palm(m, 0, 0, 1.3) },
  { name: 'tree_coconut', footprint: [1, 1], build: coconut },
  { name: 'tree_sakura', footprint: [1, 1], build: sakura },
  { name: 'tree_cypress', footprint: [1, 1], build: cypress },
  { name: 'tree_banyan', footprint: [1, 1], build: onGround((m) => banyan(m, 0, 0, 1.3)) },
  { name: 'tree_acacia', footprint: [1, 1], build: acacia },
  { name: 'plant_bamboo', footprint: [1, 1], build: bamboo },
  { name: 'plant_bush', footprint: [1, 1], build: (m) => bush(m, 0, 0, 0.07, 'leaf', null, 0) },
  { name: 'plant_flower_bush', footprint: [1, 1], build: (m) => bush(m, 0, 0, 0.07, 'leaf', 'pink', 0) },
  { name: 'plant_hedge', footprint: [1, 1], build: onGround((m) => hedge(m, -0.2, -0.04, 0.2, 0.04, 0.07)) },
  { name: 'plant_cactus', footprint: [1, 1], build: cactus },
  { name: 'plant_flower_pot', footprint: [1, 1], build: flowerPot },
  { name: 'plant_flower_bed', footprint: [1, 1], build: flowerBed },
];
