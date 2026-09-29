import { PI, person, umbrella } from '../lib/parts.mjs';
import { bicycle } from '../lib/vehicles.mjs';

// People stand on y = 0 and are about 0.1 units tall (the same scale as the buildings).
const P = (opts) => (m) => person(m, 0, 0, 0, { y: 0, ...opts });

function woman(m) {
  person(m, 0, 0, 0, { y: 0, shirt: 'pink', pants: 'pink', hair: 'bark', pose: 'walk' });
  m.frustum('purple', [0, 0], 0.024, 0.017, 0.022, 0.05, 6);
  m.gem('bark', [0, 0.1, -0.012], 0.012, 0.018, 5);
}

function hijab(m) {
  person(m, 0, 0, 0, { y: 0, shirt: 'teal', pants: 'navy', hair: 'teal', pose: 'stand' });
  m.gem('teal', [0, 0.102, -0.002], 0.016, 0.018, 6);
  m.frustum('navy', [0, 0], 0.024, 0.018, 0.0, 0.05, 6);
}

function police(m) {
  person(m, 0, 0, 0, { y: 0, shirt: 'navy', pants: 'dark', hair: 'dark', pose: 'wave' });
  m.frustum('navy', [0, 0], 0.016, 0.016, 0.11, 0.118, 8);
  m.box('dark', [-0.016, 0.108, 0.0], [0.016, 0.112, 0.022]);
  m.box('gold', [-0.006, 0.075, 0.01], [0.006, 0.082, 0.012]);
}

function worker(m) {
  person(m, 0, 0, 0, { y: 0, shirt: 'orange', pants: 'navy', pose: 'stand' });
  for (const y of [0.06, 0.075]) m.box('lemon', [-0.018, y, -0.011], [0.018, y + 0.004, 0.011]);
  m.gem('sunflower', [0, 0.11, 0], 0.017, 0.01, 6);
  m.box('sunflower', [-0.017, 0.104, 0.0], [0.017, 0.107, 0.02]);
}

function doctor(m) {
  person(m, 0, 0, 0, { y: 0, shirt: 'paper', pants: 'sky', pose: 'stand' });
  m.frustum('paper', [0, 0], 0.022, 0.019, 0.03, 0.085, 6);
  m.box('mint', [-0.008, 0.07, 0.01], [0.008, 0.085, 0.022]);
}

function child(m) {
  person(m, 0, 0, 0, { y: 0, shirt: 'sunflower', pants: 'sky', pose: 'wave', s: 0.7 });
  m.gem('red', [0.03, 0.13, 0.0], 0.016, 0.02, 6);
  m.beam('paper', [0.02, 0.07, 0], [0.03, 0.11, 0], 0.001);
}

function elderly(m) {
  person(m, 0, 0, 0, { y: 0, shirt: 'lavender', pants: 'stone', hair: 'paper', pose: 'stand', s: 0.95 });
  m.beam('bark', [0.03, 0.0, 0.01], [0.028, 0.05, 0.01], 0.004);
  m.box('bark', [0.018, 0.05, 0.006], [0.03, 0.054, 0.014]);
}

function jogger(m) {
  person(m, 0, 0, 0, { y: 0, shirt: 'coral', pants: 'dark', pose: 'walk' });
  m.box('paper', [-0.014, 0.107, -0.014], [0.014, 0.112, 0.014]);
}

function cyclist(m) {
  bicycle(m, { c: 'coral' });
  person(m, 0, -0.012, 0, { y: 0.025, shirt: 'lemon', pants: 'dark', pose: 'sit' });
  m.gem('sky', [0, 0.124, -0.012], 0.016, 0.01, 6);
}

function vendor(m) {
  // Street food cart (gerobak) with its seller.
  m.box({ sides: 'sky', top: 'paper' }, [-0.07, 0.03, -0.035], [0.07, 0.09, 0.035]);
  m.box('glass', [-0.06, 0.09, -0.03], [0.06, 0.13, 0.03]);
  m.box('paper', [-0.075, 0.13, -0.04], [0.075, 0.135, 0.04]);
  for (const x of [-0.05, 0.05]) m.with({ t: [x, 0.025, 0.0], rx: PI / 2 }, () => m.prism('dark', [0, 0], 0.025, -0.04, -0.035, 10));
  for (const x of [-0.05, 0.05]) m.with({ t: [x, 0.025, 0.0], rx: PI / 2 }, () => m.prism('dark', [0, 0], 0.025, 0.035, 0.04, 10));
  m.beam('dark', [-0.07, 0.07, -0.02], [-0.13, 0.06, -0.02], 0.006);
  m.beam('dark', [-0.07, 0.07, 0.02], [-0.13, 0.06, 0.02], 0.006);
  m.prism('stone', [0.03, 0.0], 0.018, 0.09, 0.12, 8);
  m.box('red', [-0.06, 0.06, 0.035], [0.06, 0.08, 0.038]);
  person(m, -0.16, 0, PI / 2, { y: 0, shirt: 'paper', pants: 'bark', pose: 'stand' });
  m.frustum('straw', [-0.16, 0], 0.026, 0, 0.105, 0.125, 8);
}

function umbrellaWalker(m) {
  person(m, 0, 0, 0, { y: 0, shirt: 'sky', pants: 'navy', pose: 'walk' });
  m.beam('dark', [0.02, 0.05, 0.005], [0.01, 0.14, 0.0], 0.003);
  m.frustum('red', [0.01, 0.0], 0.06, 0, 0.13, 0.16, 8);
}

export default [
  { name: 'people_man', footprint: [1, 1], build: P({ shirt: 'sky', pants: 'navy', pose: 'walk' }) },
  { name: 'people_woman', footprint: [1, 1], build: woman },
  { name: 'people_hijab', footprint: [1, 1], build: hijab },
  { name: 'people_office_worker', footprint: [1, 1], build: P({ shirt: 'paper', pants: 'dark', hair: 'bark', pose: 'walk' }) },
  { name: 'people_student', footprint: [1, 1], build: P({ shirt: 'paper', pants: 'red', pose: 'wave' }) },
  { name: 'people_child', footprint: [1, 1], build: child },
  { name: 'people_elderly', footprint: [1, 1], build: elderly },
  { name: 'people_jogger', footprint: [1, 1], build: jogger },
  { name: 'people_police', footprint: [1, 1], build: police },
  { name: 'people_worker', footprint: [1, 1], build: worker },
  { name: 'people_doctor', footprint: [1, 1], build: doctor },
  { name: 'people_cyclist', footprint: [1, 1], build: cyclist },
  { name: 'people_vendor', footprint: [1, 1], build: vendor },
  { name: 'people_umbrella', footprint: [1, 1], build: umbrellaWalker },
  { name: 'people_sitting', footprint: [1, 1], build: P({ shirt: 'mint', pants: 'dark', pose: 'sit' }) },
];
