import { PI, G, plate, patch, treeRound, treePine, bush, palm, umbrella, person, lounger } from '../lib/parts.mjs';
import { bird, cow } from '../lib/animals.mjs';

function grassTile(m) {
  plate(m);
  const spots = [[-0.3, -0.25, 'pink'], [0.25, -0.3, 'sunflower'], [0.05, 0.1, null], [-0.2, 0.3, 'lavender'], [0.32, 0.28, null]];
  for (const [x, z, f] of spots) {
    if (f) {
      for (let i = 0; i < 3; i++) m.gem(f, [x + (i - 1) * 0.035, G + 0.02, z + (i % 2) * 0.03], 0.018, 0.015, 5);
    } else {
      for (let i = 0; i < 3; i++) m.frustum('leaf', [x + (i - 1) * 0.02, z], 0.015, 0, G, G + 0.05 + i * 0.01, 4, i);
    }
  }
}

function forest(m) {
  plate(m, 'grass', 'leaf');
  const spots = [[-0.34, -0.36, 'p', 1.1], [-0.08, -0.32, 'r', 1], [0.2, -0.36, 'p', 1.2], [0.38, -0.12, 'r', 0.9], [-0.38, -0.08, 'r', 1.1], [-0.14, -0.04, 'p', 0.9],
    [0.12, -0.06, 'p', 1.3], [0.34, 0.16, 'p', 1], [-0.3, 0.2, 'p', 1.2], [-0.04, 0.22, 'r', 1], [0.2, 0.36, 'r', 0.8], [-0.4, 0.4, 'r', 0.8]];
  spots.forEach(([x, z, t, s], i) => (t === 'p' ? treePine(m, x, z, s) : treeRound(m, x, z, s, i % 2 ? 'leaf' : 'grass')));
  for (const [x, z] of [[0.05, 0.4], [-0.2, 0.36], [0.4, 0.42]]) {
    m.prism('paper', [x, z], 0.006, G, G + 0.025, 5);
    m.frustum('red', [x, z], 0.02, 0, G + 0.02, G + 0.04, 6);
  }
  m.gem('stone', [0.24, G + 0.02, 0.1], 0.05, 0.03, 5);
  bush(m, -0.2, 0.08, 0.05, 'pine');
  bird(m, 0.02, 0.1, 0.4, 'coral', 1.2);
}

function riceField(m) {
  plate(m, 'grass', 'leaf');
  // three terraces stepping down towards +z
  for (let t = 0; t < 3; t++) {
    const z0 = -0.46 + t * 0.3, h = 0.06 - t * 0.02;
    m.box({ top: 'leaf', sides: 'bark' }, [-0.46, G, z0], [0.46, G + h + 0.01, z0 + 0.3]);
    for (const x0 of [-0.44, 0.02]) {
      m.box('water', [x0, G + h + 0.01, z0 + 0.02], [x0 + 0.42, G + h + 0.014, z0 + 0.28]);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
        const x = x0 + 0.04 + c * 0.057, z = z0 + 0.05 + r * 0.065;
        m.frustum(t === 1 ? 'straw' : 'grass', [x, z], 0.01, 0, G + h + 0.01, G + h + 0.05, 4, r + c);
      }
    }
  }
  // farmer with a caping hat and a small hut
  person(m, -0.2, 0.33, 0.5, { shirt: 'sky', pants: 'dark', y: G + 0.034 });
  m.frustum('straw', [-0.2, 0.33], 0.03, 0, G + 0.034 + 0.1, G + 0.034 + 0.13, 8);
  m.with({ t: [0.34, G + 0.03, 0.34] }, () => {
    for (const [x, z] of [[-0.05, -0.05], [0.05, -0.05], [-0.05, 0.05], [0.05, 0.05]]) m.prism('bark', [x, z], 0.006, 0, 0.1, 4);
    m.box({ sides: 'bark', top: 'wood' }, [-0.06, 0.05, -0.06], [0.06, 0.06, 0.06]);
    m.hip('straw', [-0.08, 0.1, -0.08], [0.08, 0.16, 0.08], 0.04);
  });
  bird(m, 0.1, 0.1, 1, 'paper', 1.4, G + 0.024);
}

function beach(m) {
  plate(m, 'sand', 'bark');
  m.box({ top: 'water', sides: 'blue' }, [-0.5, G, 0.1], [0.5, G + 0.004, 0.5]);
  for (const [z, w] of [[0.16, 0.9], [0.28, 0.6], [0.4, 0.8]]) m.box('paper', [-w / 2, G + 0.004, z], [w / 2, G + 0.007, z + 0.012]);
  palm(m, -0.34, -0.32, 1.3, 0.3);
  palm(m, -0.12, -0.4, 1.1);
  umbrella(m, 0.1, -0.1, 'coral');
  umbrella(m, 0.34, -0.2, 'sunflower');
  lounger(m, 0.06, -0.02, 0, 'sky');
  lounger(m, 0.3, -0.1, 0, 'pink');
  m.box('teal', [-0.2, G, -0.12], [-0.08, G + 0.004, -0.02]);
  person(m, -0.14, -0.07, 0, { shirt: 'sand', pants: 'coral', pose: 'sit' });
  person(m, 0.18, 0.2, 2.6, { shirt: 'sand', pants: 'blue', pose: 'wave', y: G - 0.03 });
  // sandcastle and a boat
  m.box('straw', [0.36, G, 0.0], [0.44, G + 0.03, 0.07]);
  m.frustum('straw', [0.4, 0.035], 0.025, 0, G + 0.03, G + 0.07, 4);
  m.with({ t: [-0.26, G + 0.024, 0.32], ry: 0.4 }, () => {
    m.hip('coral', [-0.04, -0.02, -0.1], [0.04, 0.03, 0.1], 0.12);
    m.prism('wood', [0, 0], 0.004, 0.02, 0.16, 4);
    m.with({ t: [0, 0.03, 0] }, () => m.gableZ('paper', 'paper', [0.004, 0, -0.005], [0.07, 0.12, 0.005]));
  });
}

function riverBanksZ(m) {
  m.box({ top: 'water', sides: 'blue' }, [-0.28, G, -0.5], [0.28, G + 0.004, 0.5]);
  for (const s of [-1, 1]) m.box({ top: 'sand', sides: 'bark' }, [s > 0 ? 0.28 : -0.33, G, -0.5], [s > 0 ? 0.33 : -0.28, G + 0.01, 0.5]);
}
function riverStraight(m) {
  // River along z; rotate 90° to connect with bridge_road.
  plate(m, 'grass', 'leaf');
  riverBanksZ(m);
  for (const [x, z] of [[-0.12, -0.2], [0.1, 0.25]]) m.gem('stone', [x, G + 0.006, z], 0.04, 0.02, 5);
  for (const z of [-0.35, 0.1, 0.38]) for (let i = 0; i < 3; i++) m.prism('pine', [0.36 + i * 0.02, z], 0.005, G, G + 0.08 + i * 0.02, 4);
  treeRound(m, -0.42, 0.2, 0.8);
  m.with({ t: [0.02, G + 0.012, -0.02], ry: 0.3 }, () => m.hip('orange', [-0.03, 0, -0.08], [0.03, 0.03, 0.08], 0.1));
}
function riverCorner(m) {
  plate(m, 'grass', 'leaf');
  const c = [0.5, 0.5], a0 = PI, a1 = 1.5 * PI;
  m.arc('water', c, 0.22, 0.78, a0, a1, G, G + 0.004, 8);
  m.arc('sand', c, 0.17, 0.22, a0, a1, G, G + 0.01, 8);
  m.arc('sand', c, 0.78, 0.83, a0, a1, G, G + 0.01, 8);
  treePine(m, -0.38, -0.38, 1);
  treeRound(m, 0.38, 0.38, 0.8);
  m.gem('stone', [-0.05, G + 0.006, 0.0], 0.04, 0.02, 5);
}

function hill(m) {
  plate(m, 'grass', 'leaf');
  m.frustum('grass', [0, -0.05], 0.46, 0.3, G, 0.14, 9);
  m.frustum('leaf', [0, -0.05], 0.3, 0.14, 0.14, 0.26, 9, 0.3, 'grass');
  treePine(m, -0.05, -0.1, 0.9);
  treePine(m, 0.1, 0.0, 0.7);
  m.with({ t: [0, 0.26 - G, 0] }, () => treeRound(m, -0.02, 0.08, 0.6, 'grass'));
  m.gem('stone', [0.32, G + 0.03, 0.3], 0.06, 0.04, 5);
  cow(m, -0.3, 0.32, 0.8, 1);
  cow(m, 0.12, 0.38, -0.6, 1);
}

export default [
  { name: 'nature_grass', footprint: [1, 1], build: grassTile },
  { name: 'nature_forest', footprint: [1, 1], build: forest },
  { name: 'nature_rice_field', footprint: [1, 1], build: riceField },
  { name: 'nature_beach', footprint: [1, 1], build: beach },
  { name: 'nature_river_straight', footprint: [1, 1], build: riverStraight },
  { name: 'nature_river_corner', footprint: [1, 1], build: riverCorner },
  { name: 'nature_hill', footprint: [1, 1], build: hill },
];
