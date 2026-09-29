import { PI, G, plate, patch, treeRound, treePine, bush, bench, fence, lamp, umbrella, palm, flagpole, person, statue, banyan } from '../lib/parts.mjs';

function park(m) {
  plate(m);
  m.box({ top: 'sand', sides: 'bark' }, [-0.07, G, -0.5], [0.07, G + 0.006, 0.5]);
  m.box({ top: 'sand', sides: 'bark' }, [-0.5, G, -0.07], [0.5, G + 0.006, 0.07]);
  // fountain
  m.prism('stone', [0, 0], 0.17, G, G + 0.06, 8, PI / 8, 'kerb');
  m.prism('water', [0, 0], 0.14, G + 0.06, G + 0.065, 8, PI / 8);
  m.prism('kerb', [0, 0], 0.025, G + 0.06, G + 0.15, 6);
  m.frustum('kerb', [0, 0], 0.03, 0.07, G + 0.15, G + 0.18, 8, 0, 'water');
  m.gem('sky', [0, G + 0.2, 0], 0.025, 0.03, 5);
  treeRound(m, -0.3, -0.3, 1);
  treePine(m, 0.3, -0.3, 0.9);
  treeRound(m, 0.3, 0.3, 0.9, 'grass');
  treePine(m, -0.3, 0.3, 0.8);
  bench(m, -0.15, 0.13, 0);
  bench(m, 0.13, -0.15, PI / 2);
  bush(m, -0.42, -0.12, 0.04, 'leaf', 'pink');
  bush(m, 0.12, 0.42, 0.04, 'leaf', 'sunflower');
  bush(m, 0.42, 0.12, 0.04, 'mint', 'coral');
  bush(m, -0.12, -0.42, 0.04, 'mint', 'lavender');
}

function pond(m) {
  plate(m);
  m.prism('sand', [0, 0], 0.4, G, G + 0.012, 10, 0, 'sand');
  m.prism('water', [0, 0], 0.35, G + 0.012, G + 0.016, 10, 0.3);
  for (const [x, z] of [[-0.14, 0.1], [0.12, 0.16], [0.18, -0.1]]) m.prism('mint', [x, z], 0.035, G + 0.016, G + 0.02, 6);
  m.gem('coral', [0.12, G + 0.03, 0.16], 0.012, 0.01, 4);
  // paper duck
  m.with({ t: [-0.08, G + 0.016, -0.1], ry: 0.6 }, () => {
    m.gem('paper', [0, 0.03, 0], 0.045, 0.03, 5);
    m.gem('paper', [0.04, 0.07, 0], 0.022, 0.022, 5);
    m.frustum('orange', [0, 0], 0.008, 0, 0, 0.03, 4);
  });
  for (const [x, z] of [[0.3, 0.3], [-0.34, 0.26], [0.36, -0.2]]) {
    for (let i = 0; i < 3; i++) m.prism('pine', [x + i * 0.02, z], 0.006, G, G + 0.08 + i * 0.02, 4);
  }
  m.gem('stone', [-0.34, G + 0.02, -0.26], 0.05, 0.035, 5);
  m.gem('kerb', [-0.27, G + 0.015, -0.33], 0.03, 0.025, 5);
  treeRound(m, 0.4, -0.4, 0.8);
}

function parkStatue(m) {
  plate(m);
  m.prism('kerb', [0, 0], 0.26, G, G + 0.008, 12, 0, 'kerb');
  for (let k = 0; k < 4; k++) m.with({ ry: (k * PI) / 2 }, () => patch(m, 'kerb', -0.06, 0.24, 0.06, 0.5, 0.008, 'stone'));
  statue(m, 0, 0, { c: 'stone', s: 2.4 });
  m.arc('leaf', [0, 0], 0.13, 0.2, 0, 2 * PI, G + 0.008, G + 0.03, 12);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * PI * 2 + PI / 8;
    m.gem(['pink', 'sunflower', 'coral', 'lavender'][i % 4], [Math.cos(a) * 0.165, G + 0.04, Math.sin(a) * 0.165], 0.018, 0.014, 4);
  }
  for (const [x, z, ry] of [[-0.3, 0.14, PI / 2], [0.14, 0.3, 0], [0.3, -0.14, -PI / 2]]) bench(m, x, z, ry);
  treeRound(m, -0.34, -0.34, 1);
  treeRound(m, 0.34, 0.34, 0.9, 'grass');
  treePine(m, 0.36, -0.36, 0.9);
  treeRound(m, -0.36, 0.36, 0.8);
}

function parkFlower(m) {
  plate(m);
  patch(m, 'sand', -0.05, -0.5, 0.05, 0.5);
  patch(m, 'sand', -0.5, -0.05, 0.5, 0.05);
  const cols = ['coral', 'pink', 'sunflower', 'lavender', 'orange', 'paper', 'red', 'purple'];
  let k = 0;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    for (let r = 0; r < 4; r++) {
      const c = cols[k++ % cols.length];
      const z = sz * (0.1 + r * 0.09) + sz * 0.02;
      patch(m, 'bark', sx > 0 ? 0.1 : -0.44, z - 0.03, sx > 0 ? 0.44 : -0.1, z + 0.03, 0.01, 'bark');
      for (let i = 0; i < 6; i++) {
        const x = sx * (0.13 + i * 0.056);
        m.prism('leaf', [x, z], 0.004, G + 0.01, G + 0.04, 3);
        m.gem(c, [x, G + 0.045, z], 0.014, 0.012, 5);
      }
    }
  }
  // little gazebo in the middle
  for (const [x, z] of [[-0.05, -0.05], [0.05, -0.05], [-0.05, 0.05], [0.05, 0.05]]) m.prism('paper', [x, z], 0.006, G, G + 0.14, 4);
  m.frustum('coral', [0, 0], 0.1, 0, G + 0.14, G + 0.22, 6);
}

function parkPlayground(m) {
  plate(m);
  patch(m, 'sand', -0.44, -0.44, 0.44, 0.44, 0.008);
  // slide tower
  m.box('sky', [-0.34, G, -0.34], [-0.2, 0.2, -0.2]);
  m.hip('coral', [-0.36, 0.2, -0.36], [-0.18, 0.28, -0.18]);
  m.with({ t: [-0.2, 0.18, -0.27], rz: -0.75 }, () => m.box('sunflower', [0, -0.006, -0.035], [0.24, 0.006, 0.035]));
  for (let i = 0; i < 5; i++) m.box('coral', [-0.345 + 0, G + i * 0.035, -0.2], [-0.33, G + i * 0.035 + 0.008, -0.16]);
  // swings
  for (const x of [0.1, 0.36]) {
    m.with({ t: [x, G, -0.28] }, () => {
      m.with({ rz: 0.18 }, () => m.box('blue', [-0.006, 0, -0.006], [0.006, 0.22, 0.006]));
      m.with({ rz: -0.18 }, () => m.box('blue', [-0.006, 0, -0.006], [0.006, 0.22, 0.006]));
    });
  }
  m.box('blue', [0.06, 0.21, -0.286], [0.4, 0.222, -0.274]);
  for (const x of [0.17, 0.29]) {
    for (const dx of [-0.02, 0.02]) m.box('dark', [x + dx - 0.001, 0.08, -0.281], [x + dx + 0.001, 0.21, -0.279]);
    m.box('red', [x - 0.03, 0.075, -0.3], [x + 0.03, 0.085, -0.26]);
  }
  // seesaw
  m.prism('dark', [0.24, 0.05], 0.02, G, G + 0.04, 5);
  m.with({ t: [0.24, G + 0.045, 0.05], rz: 0.2 }, () => {
    m.box('sunflower', [-0.16, 0, -0.02], [0.16, 0.01, 0.02]);
    for (const s of [-1, 1]) m.box('dark', [s * 0.14 - 0.004, 0.01, -0.02], [s * 0.14 + 0.004, 0.04, 0.02]);
  });
  // climbing dome and sandbox
  m.gem('mint', [-0.24, G, 0.18], 0.12, 0.12, 6);
  m.box({ sides: 'wood', top: 'sand' }, [0.12, G, 0.2], [0.38, G + 0.03, 0.4]);
  m.frustum('coral', [0.2, 0.28], 0.02, 0.03, G + 0.03, G + 0.05, 6);
  person(m, -0.05, 0.1, 0.4, { shirt: 'sunflower', pants: 'sky', pose: 'wave', s: 0.7 });
  person(m, 0.3, 0.32, PI, { shirt: 'pink', pants: 'purple', pose: 'sit', s: 0.7 });
  fence(m, -0.47, 0.47, 0.47, 0.47, 12);
  treeRound(m, -0.44, 0.44, 0.7);
}

function parkZen(m) {
  plate(m, 'grass');
  patch(m, 'kerb', -0.44, -0.44, 0.44, 0.1, 0.008, 'stone');
  for (let z = -0.4; z < 0.08; z += 0.04) m.box('paper', [-0.42, G + 0.008, z], [0.42, G + 0.011, z + 0.01]);
  for (const [x, z, r] of [[-0.2, -0.2, 0.07], [0.15, -0.28, 0.05], [0.25, -0.05, 0.04]]) {
    m.arc('kerb', [x, z], r, r + 0.04, 0, 2 * PI, G + 0.008, G + 0.013, 10);
    m.gem('stone', [x, G + 0.02, z], r * 0.9, r * 0.6, 5);
  }
  // koi pond and a red bridge
  m.prism('water', [0, 0.3], 0.18, G, G + 0.008, 10, 0.2);
  for (const [x, z, c] of [[-0.05, 0.26, 'orange'], [0.06, 0.33, 'paper'], [-0.1, 0.36, 'coral']]) m.box(c, [x - 0.015, G + 0.008, z - 0.006], [x + 0.015, G + 0.012, z + 0.006]);
  m.with({ t: [0, G, 0.3], ry: PI / 2 }, () => {
    m.saddle('red', 'red', -0.2, 0, [0, 0.06], [0.01, 0.07], -0.04, 0.04);
    m.saddle('red', 'red', 0, 0.2, [0.06, 0], [0.07, 0.01], -0.04, 0.04);
  });
  // stone lantern and bonsai pines
  m.box('stone', [0.34, G, 0.2], [0.38, G + 0.08, 0.24]);
  m.box('kerb', [0.32, G + 0.08, 0.18], [0.4, G + 0.12, 0.26]);
  m.hip('stone', [0.31, G + 0.12, 0.17], [0.41, G + 0.16, 0.27]);
  for (const [x, z] of [[-0.38, 0.32], [0.36, -0.4]]) {
    m.with({ t: [x, 0, z] }, () => {
      m.with({ rz: 0.3 }, () => m.prism('bark', [0, 0], 0.02, G, 0.16, 5));
      m.gem('pine', [-0.04, 0.17, 0], 0.08, 0.03, 6);
      m.gem('pine', [0.03, 0.12, 0.02], 0.06, 0.025, 6);
    });
  }
  bush(m, -0.3, 0.2, 0.04, 'leaf', 'pink');
}

function parkSquare(m) {
  // Alun-alun: a big town lawn with twin banyan trees.
  plate(m, 'kerb', 'stone', 2, 2);
  m.box({ top: 'grass', sides: 'leaf' }, [-0.8, G, -0.8], [0.8, G + 0.01, 0.8]);
  patch(m, 'kerb', -0.06, -0.8, 0.06, 0.8, 0.012, 'stone');
  patch(m, 'kerb', -0.8, -0.06, 0.8, 0.06, 0.012, 'stone');
  for (const x of [-0.35, 0.35]) {
    banyan(m, x, 0.35, 1.4);
    fence(m, x - 0.18, 0.17, x + 0.18, 0.17, 5);
    fence(m, x - 0.18, 0.53, x + 0.18, 0.53, 5);
    fence(m, x - 0.18, 0.17, x - 0.18, 0.53, 5);
    fence(m, x + 0.18, 0.17, x + 0.18, 0.53, 5);
  }
  flagpole(m, 0, -0.45, 0.8, 'red', 'paper');
  m.box({ sides: 'kerb', top: 'stone' }, [-0.1, G, -0.55], [0.1, G + 0.04, -0.35]);
  for (let i = 0; i < 4; i++) {
    const x = -0.7 + i * 0.2;
    m.box({ sides: 'wood', top: 'wood' }, [x - 0.05, G, -0.9], [x + 0.05, G + 0.06, -0.84]);
    umbrella(m, x, -0.87, ['coral', 'sunflower', 'teal', 'sky'][i]);
  }
  for (const [x, z] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9], [0.9, 0], [-0.9, 0]]) lamp(m, x, z);
  for (const [x, z, ry] of [[0.3, -0.12, 0], [-0.3, -0.12, 0], [0.12, 0.3, PI / 2]]) bench(m, x, z, ry);
  person(m, 0.2, -0.3, 0.3, { shirt: 'sky', pose: 'walk' });
  person(m, -0.5, 0.0, 2, { shirt: 'sunflower', pants: 'dark', pose: 'walk' });
  person(m, 0.6, -0.5, 0, { shirt: 'pink', pants: 'purple', pose: 'wave' });
  for (const x of [-0.6, 0.6]) treeRound(m, x, -0.6, 1, 'grass');
}

function parkCommunityGarden(m) {
  plate(m);
  patch(m, 'sand', -0.46, -0.05, 0.46, 0.05);
  for (const sz of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const x = -0.3 + i * 0.3, z = sz * 0.24;
      m.box({ sides: 'wood', top: 'bark' }, [x - 0.12, G, z - 0.13], [x + 0.12, G + 0.04, z + 0.13]);
      const [c, f] = [['leaf', 'red'], ['grass', null], ['leaf', 'orange'], ['pine', null], ['leaf', 'lavender'], ['grass', 'sunflower']][i + (sz > 0 ? 3 : 0)];
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) bush(m, x - 0.075 + a * 0.075, z - 0.08 + b * 0.08, 0.026, c, f, G + 0.04);
    }
  }
  // sunflowers, scarecrow and a shed
  for (let i = 0; i < 4; i++) {
    const x = 0.44, z = -0.4 + i * 0.07;
    m.prism('leaf', [x, z], 0.005, G, G + 0.16, 4);
    m.prism('sunflower', [x, z], 0.022, G + 0.16, G + 0.17, 8, 0, 'bark');
  }
  m.box('bark', [-0.02, G, 0.43], [0.0, 0.2, 0.45]);
  m.box('wood', [-0.07, 0.14, 0.43], [0.06, 0.15, 0.45]);
  m.box('coral', [-0.03, 0.1, 0.425], [0.02, 0.16, 0.455]);
  m.gem('straw', [-0.01, 0.18, 0.44], 0.016, 0.016, 5);
  m.frustum('straw', [-0.01, 0.44], 0.03, 0, 0.19, 0.22, 6);
  m.box('teal', [-0.46, G, 0.38], [-0.3, 0.14, 0.48]);
  m.gable('coral', 'teal', [-0.47, 0.14, 0.37], [-0.29, 0.2, 0.49]);
  person(m, 0.12, 0.0, 0.5, { shirt: 'leaf', pants: 'bark', pose: 'stand' });
}

function parkPicnic(m) {
  plate(m);
  m.prism('water', [0.22, 0.2], 0.16, G, G + 0.006, 9);
  treeRound(m, -0.3, -0.3, 1.2);
  treeRound(m, 0.3, -0.34, 1, 'grass');
  palm(m, 0.42, 0.42, 0.9);
  // checked blankets
  for (const [cx, cz, c, ry] of [[-0.2, 0.05, 'coral', 0.2], [0.05, -0.15, 'sky', -0.3]]) {
    m.with({ t: [cx, G, cz], ry }, () => {
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) m.box((i + j) % 2 ? c : 'paper', [-0.1 + i * 0.05, 0, -0.08 + j * 0.04], [-0.05 + i * 0.05, 0.004, -0.04 + j * 0.04]);
      m.box({ sides: 'wood', top: 'straw' }, [0.03, 0.004, -0.03], [0.07, 0.03, 0.0]);
    });
  }
  person(m, -0.24, 0.04, 0.8, { shirt: 'sunflower', pants: 'navy', pose: 'sit' });
  person(m, -0.14, 0.1, -2.3, { shirt: 'mint', pants: 'dark', pose: 'sit' });
  person(m, 0.02, -0.2, 0.3, { shirt: 'pink', pants: 'sky', pose: 'sit' });
  person(m, -0.36, 0.3, 1, { shirt: 'coral', pants: 'navy', pose: 'wave', s: 0.7 });
  for (const [x, z] of [[-0.4, 0.4], [0.38, -0.05]]) bush(m, x, z, 0.04, 'leaf', 'sunflower');
}

export default [
  { name: 'park_fountain', footprint: [1, 1], build: park },
  { name: 'park_statue', footprint: [1, 1], build: parkStatue },
  { name: 'park_flower', footprint: [1, 1], build: parkFlower },
  { name: 'park_playground', footprint: [1, 1], build: parkPlayground },
  { name: 'park_pond', footprint: [1, 1], build: pond },
  { name: 'park_zen', footprint: [1, 1], build: parkZen },
  { name: 'park_square', footprint: [2, 2], build: parkSquare },
  { name: 'park_community_garden', footprint: [1, 1], build: parkCommunityGarden },
  { name: 'park_picnic', footprint: [1, 1], build: parkPicnic },
];
