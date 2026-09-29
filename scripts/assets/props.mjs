import { PI, G, bench, lamp, fence, statue, umbrella, cafeTable, person } from '../lib/parts.mjs';

// Street furniture on y = 0 at the buildings' scale.
const onGround = (fn) => (m) => m.with({ t: [0, -G, 0] }, () => fn(m));

function trashBins(m) {
  [['leaf', -0.045], ['sunflower', 0], ['coral', 0.045]].forEach(([c, x]) => {
    m.box({ sides: c, top: 'dark' }, [x - 0.02, 0, -0.018], [x + 0.02, 0.06, 0.018]);
    m.box('dark', [x - 0.021, 0.06, -0.019], [x + 0.021, 0.066, 0.019]);
    m.box('paper', [x - 0.008, 0.035, 0.018], [x + 0.008, 0.045, 0.02]);
  });
}

function busStop(m) {
  m.box({ sides: 'stone', top: 'kerb' }, [-0.14, 0, -0.05], [0.14, 0.012, 0.05]);
  for (const x of [-0.12, 0.12]) m.box('dark', [x - 0.006, 0.012, -0.04], [x + 0.006, 0.16, -0.028]);
  m.box('glass', [-0.12, 0.03, -0.042], [0.12, 0.15, -0.036]);
  m.with({ t: [0, 0.16, -0.04], rx: -0.1 }, () => m.box({ sides: 'teal', top: 'teal' }, [-0.15, 0, -0.01], [0.15, 0.012, 0.09]));
  m.box('wood', [-0.1, 0.045, -0.03], [0.1, 0.052, 0.0]);
  m.box('paper', [0.13, 0.012, 0.0], [0.14, 0.2, 0.01]);
  m.box({ sides: 'blue', top: 'blue' }, [0.115, 0.17, -0.002], [0.155, 0.21, 0.012]);
  m.box('paper', [0.125, 0.18, 0.012], [0.145, 0.2, 0.014]);
  person(m, -0.05, -0.012, 0, { y: 0.012, shirt: 'mint', pants: 'dark', pose: 'sit' });
}

function trafficLight(m) {
  m.prism('dark', [0, 0], 0.008, 0, 0.26, 6);
  m.box('dark', [-0.018, 0.2, -0.014], [0.018, 0.3, 0.014]);
  [['red', 0.28], ['sunflower', 0.25], ['leaf', 0.22]].forEach(([c, y]) => m.gem(c, [0, y, 0.016], 0.01, 0.01, 5));
  m.box('dark', [-0.014, 0.1, -0.012], [0.014, 0.14, 0.012]);
  m.gem('leaf', [0, 0.12, 0.013], 0.007, 0.007, 4);
}

function signPost(m, face) {
  m.prism('stone', [0, 0], 0.005, 0, 0.18, 5);
  m.with({ t: [0, 0.2, 0.006], rx: PI / 2 }, face);
}

function stopSign(m) {
  signPost(m, () => {
    m.prism('paper', [0, 0], 0.035, 0, 0.004, 8, PI / 8);
    m.prism('red', [0, 0], 0.031, 0.004, 0.006, 8, PI / 8);
    m.box('paper', [-0.02, 0.006, -0.004], [0.02, 0.008, 0.004]);
  });
}

function warningSign(m) {
  signPost(m, () => {
    m.prism('red', [0, 0], 0.04, 0, 0.004, 3, PI / 2);
    m.prism('lemon', [0, 0], 0.03, 0.004, 0.006, 3, PI / 2);
    m.box('dark', [-0.003, 0.006, -0.012], [0.003, 0.008, 0.008]);
  });
}

function directionSign(m) {
  m.prism('stone', [0, 0], 0.006, 0, 0.22, 5);
  for (const [y, c, dx] of [[0.2, 'blue', 0.05], [0.16, 'leaf', -0.05]]) {
    m.box(c, [dx - 0.055, y, -0.004], [dx + 0.055, y + 0.03, 0.004]);
    m.box('paper', [dx - 0.04, y + 0.012, 0.004], [dx + 0.03, y + 0.018, 0.006]);
  }
}

function hydrant(m) {
  m.prism('red', [0, 0], 0.016, 0, 0.05, 8);
  m.prism('red', [0, 0], 0.02, 0.035, 0.042, 8);
  m.frustum('red', [0, 0], 0.016, 0.006, 0.05, 0.06, 8);
  for (const s of [-1, 1]) m.with({ t: [s * 0.016, 0.03, 0], rz: PI / 2 }, () => m.prism('paper', [0, 0], 0.007, -0.006, 0.006, 6));
}

function mailbox(m) {
  m.prism('dark', [0, 0], 0.008, 0, 0.08, 5);
  m.box({ sides: 'orange', top: 'orange' }, [-0.03, 0.08, -0.025], [0.03, 0.14, 0.025]);
  m.with({ t: [0, 0.14, -0.025] }, () => m.gableZ('orange', 'orange', [-0.03, 0, 0], [0.03, 0.02, 0.05]));
  m.box('dark', [-0.018, 0.125, 0.025], [0.018, 0.13, 0.027]);
}

function phoneBooth(m) {
  m.box({ sides: 'red', top: 'red' }, [-0.035, 0, -0.035], [0.035, 0.16, 0.035]);
  m.box('glass', [-0.028, 0.02, 0.035], [0.028, 0.13, 0.037]);
  m.box('paper', [-0.03, 0.14, 0.035], [0.03, 0.152, 0.038]);
  m.hip('red', [-0.04, 0.16, -0.04], [0.04, 0.18, 0.04]);
}

function vending(m) {
  m.box({ sides: 'sky', top: 'blue' }, [-0.04, 0, -0.025], [0.04, 0.16, 0.025]);
  m.box('glass', [-0.034, 0.06, 0.025], [0.012, 0.15, 0.027]);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) m.box(['coral', 'sunflower', 'mint'][(r + c) % 3], [-0.03 + c * 0.014, 0.07 + r * 0.026, 0.02], [-0.022 + c * 0.014, 0.088 + r * 0.026, 0.026]);
  m.box('dark', [0.018, 0.09, 0.025], [0.032, 0.13, 0.027]);
  m.box('dark', [-0.03, 0.015, 0.025], [0.03, 0.04, 0.027]);
}

function fountainSmall(m) {
  m.prism('stone', [0, 0], 0.1, 0, 0.04, 8, 0, 'kerb');
  m.prism('water', [0, 0], 0.085, 0.04, 0.043, 8);
  m.prism('kerb', [0, 0], 0.014, 0.04, 0.1, 6);
  m.frustum('kerb', [0, 0], 0.02, 0.045, 0.1, 0.12, 8, 0, 'water');
  m.gem('sky', [0, 0.14, 0], 0.018, 0.022, 5);
}

function fenceSegment(m) {
  fence(m, -0.2, 0, 0.2, 0, 6);
}

function flagpoleProp(m) {
  m.box({ sides: 'stone', top: 'kerb' }, [-0.03, 0, -0.03], [0.03, 0.02, 0.03]);
  m.prism('paper', [0, 0], 0.005, 0.02, 0.42, 5);
  m.box('red', [0.005, 0.34, -0.002], [0.11, 0.38, 0.002]);
  m.box('paper', [0.005, 0.3, -0.002], [0.11, 0.34, 0.002]);
  m.gem('gold', [0, 0.43, 0], 0.008, 0.008, 4);
}

export default [
  { name: 'prop_street_lamp', footprint: [1, 1], build: onGround((m) => lamp(m, 0, 0)) },
  { name: 'prop_bench', footprint: [1, 1], build: (m) => bench(m, 0, 0) },
  { name: 'prop_trash_bins', footprint: [1, 1], build: trashBins },
  { name: 'prop_bus_stop', footprint: [1, 1], build: busStop },
  { name: 'prop_traffic_light', footprint: [1, 1], build: trafficLight },
  { name: 'prop_stop_sign', footprint: [1, 1], build: stopSign },
  { name: 'prop_warning_sign', footprint: [1, 1], build: warningSign },
  { name: 'prop_direction_sign', footprint: [1, 1], build: directionSign },
  { name: 'prop_hydrant', footprint: [1, 1], build: hydrant },
  { name: 'prop_mailbox', footprint: [1, 1], build: mailbox },
  { name: 'prop_phone_booth', footprint: [1, 1], build: phoneBooth },
  { name: 'prop_vending_machine', footprint: [1, 1], build: vending },
  { name: 'prop_fountain', footprint: [1, 1], build: fountainSmall },
  { name: 'prop_statue', footprint: [1, 1], build: onGround((m) => statue(m, 0, 0, { c: 'gold', base: 'kerb' })) },
  { name: 'prop_fence', footprint: [1, 1], build: onGround(fenceSegment) },
  { name: 'prop_flagpole', footprint: [1, 1], build: flagpoleProp },
  { name: 'prop_cafe_table', footprint: [1, 1], build: onGround((m) => cafeTable(m, 0, 0, 'teal')) },
  { name: 'prop_beach_umbrella', footprint: [1, 1], build: (m) => umbrella(m, 0, 0, 'coral', 0) },
];
