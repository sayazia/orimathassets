// Paper animals, facing +z. Scale 1 is roughly life size next to a 0.1-tall person.
import { G } from './parts.mjs';

const legs = (m, c, xs, zs, y0, y1, r = 0.012) => {
  for (const x of xs) for (const z of zs) m.prism(c, [x, z], r, y0, y1, 5);
};

export function elephant(m, x, z, ry = 0, s = 1, y = G) {
  m.with({ t: [x, y, z], ry, s }, () => {
    legs(m, 'stone', [-0.045, 0.045], [-0.06, 0.06], 0, 0.1, 0.022);
    m.gem('stone', [0, 0.15, 0], 0.08, 0.07, 7);
    m.gem('stone', [0, 0.19, 0.11], 0.05, 0.05, 6);
    for (const sx of [-1, 1]) m.with({ t: [sx * 0.05, 0.19, 0.1], ry: sx * 0.4 }, () => m.box('pink', [-0.004, -0.04, -0.03], [0.004, 0.035, 0.03]));
    m.with({ t: [0, 0.17, 0.15], rx: 2.7 }, () => m.frustum('stone', [0, 0], 0.018, 0.01, 0, 0.13, 5));
    for (const sx of [-1, 1]) m.with({ t: [sx * 0.022, 0.16, 0.15], rx: 1.2 }, () => m.frustum('paper', [0, 0], 0.006, 0, 0, 0.04, 4));
    m.with({ t: [0, 0.16, -0.08], rx: -2.6 }, () => m.prism('stone', [0, 0], 0.004, 0, 0.06, 3));
  });
}

export function giraffe(m, x, z, ry = 0, s = 1, y = G) {
  m.with({ t: [x, y, z], ry, s }, () => {
    legs(m, 'sunflower', [-0.022, 0.022], [-0.04, 0.04], 0, 0.14, 0.008);
    m.gem('sunflower', [0, 0.17, 0], 0.045, 0.04, 6);
    m.with({ t: [0, 0.18, 0.03], rx: 0.35 }, () => m.frustum('sunflower', [0, 0], 0.018, 0.012, 0, 0.18, 5));
    m.gem('sunflower', [0, 0.35, 0.1], 0.02, 0.018, 5);
    m.box('sunflower', [-0.01, 0.335, 0.1], [0.01, 0.35, 0.14]);
    for (const sx of [-1, 1]) m.prism('bark', [sx * 0.008, 0.095], 0.003, 0.36, 0.385, 4);
    for (const [sx, sy, sz] of [[0.04, 0.18, 0.0], [-0.04, 0.17, 0.02], [0.03, 0.16, -0.03], [-0.035, 0.19, -0.02], [0.0, 0.21, 0.01]]) m.gem('orange', [sx * 1.05, sy, sz], 0.012, 0.01, 4);
    m.with({ t: [0, 0.16, -0.045], rx: -2.7 }, () => m.prism('bark', [0, 0], 0.003, 0, 0.06, 3));
  });
}

export function lion(m, x, z, ry = 0, s = 1, y = G, male = true) {
  m.with({ t: [x, y, z], ry, s }, () => {
    legs(m, 'orange', [-0.022, 0.022], [-0.04, 0.04], 0, 0.05, 0.01);
    m.gem('orange', [0, 0.07, 0], 0.04, 0.03, 6);
    if (male) m.gem('bark', [0, 0.09, 0.05], 0.04, 0.04, 7);
    m.gem('orange', [0, 0.09, 0.07], 0.025, 0.022, 6);
    m.gem('dark', [0, 0.085, 0.095], 0.006, 0.005, 4);
    m.with({ t: [0, 0.07, -0.04], rx: -2.2 }, () => m.prism('orange', [0, 0], 0.003, 0, 0.07, 3));
    m.gem('bark', [0, 0.06, -0.09], 0.008, 0.008, 4);
  });
}

export function zebra(m, x, z, ry = 0, s = 1, y = G) {
  m.with({ t: [x, y, z], ry, s }, () => {
    legs(m, 'paper', [-0.018, 0.018], [-0.04, 0.04], 0, 0.07, 0.008);
    m.box('paper', [-0.025, 0.07, -0.055], [0.025, 0.11, 0.055]);
    for (let zz = -0.045; zz < 0.05; zz += 0.02) m.box('dark', [-0.026, 0.072, zz], [0.026, 0.108, zz + 0.008]);
    m.with({ t: [0, 0.1, 0.05], rx: 0.6 }, () => m.box('paper', [-0.012, 0, -0.012], [0.012, 0.06, 0.012]));
    m.box('paper', [-0.012, 0.13, 0.07], [0.012, 0.15, 0.11]);
    m.box('dark', [-0.013, 0.13, 0.1], [0.013, 0.15, 0.112]);
    m.with({ t: [0, 0.1, 0.05], rx: 0.6 }, () => m.box('dark', [-0.004, 0.0, -0.016], [0.004, 0.06, -0.01]));
  });
}

export function penguin(m, x, z, ry = 0, s = 1, y = G) {
  m.with({ t: [x, y, z], ry, s }, () => {
    m.gem('dark', [0, 0.035, 0], 0.022, 0.035, 6);
    m.gem('paper', [0, 0.03, 0.008], 0.018, 0.028, 6);
    m.gem('dark', [0, 0.075, 0], 0.014, 0.014, 5);
    m.frustum('orange', [0, 0.01], 0.004, 0, 0.07, 0.07, 3);
    m.with({ t: [0, 0.072, 0.012], rx: PI2 }, () => m.frustum('orange', [0, 0], 0.005, 0, 0, 0.012, 4));
    for (const sx of [-1, 1]) m.box('orange', [sx * 0.01 - 0.005, 0, 0.0], [sx * 0.01 + 0.005, 0.004, 0.015]);
    for (const sx of [-1, 1]) m.with({ t: [sx * 0.022, 0.045, 0], rz: sx * 0.3 }, () => m.box('dark', [-0.003, -0.03, -0.01], [0.003, 0, 0.01]));
  });
}
const PI2 = Math.PI / 2;

export function monkey(m, x, z, ry = 0, s = 1, y = G) {
  m.with({ t: [x, y, z], ry, s }, () => {
    m.gem('bark', [0, 0.03, 0], 0.02, 0.028, 6);
    m.gem('bark', [0, 0.07, 0.005], 0.016, 0.016, 6);
    m.gem('sand', [0, 0.066, 0.016], 0.01, 0.009, 5);
    for (const sx of [-1, 1]) m.gem('sand', [sx * 0.016, 0.075, 0.003], 0.006, 0.006, 4);
    for (const sx of [-1, 1]) m.with({ t: [sx * 0.02, 0.05, 0.005], rz: sx * 0.5 }, () => m.box('bark', [-0.004, -0.035, -0.004], [0.004, 0, 0.004]));
    m.with({ t: [0, 0.01, -0.02], rx: -2.2 }, () => m.prism('bark', [0, 0], 0.003, 0, 0.06, 3));
  });
}

export function cat(m, x, z, ry = 0, c = 'orange', s = 1, y = G) {
  m.with({ t: [x, y, z], ry, s }, () => {
    legs(m, c, [-0.008, 0.008], [-0.018, 0.018], 0, 0.018, 0.004);
    m.gem(c, [0, 0.025, 0], 0.013, 0.012, 5);
    m.gem(c, [0, 0.038, 0.022], 0.01, 0.009, 5);
    for (const sx of [-1, 1]) m.frustum(c, [sx * 0.005, 0.022], 0.004, 0, 0.044, 0.052, 3);
    m.with({ t: [0, 0.03, -0.018], rx: -0.5 }, () => m.prism(c, [0, 0], 0.003, 0, 0.03, 3));
  });
}

export function bird(m, x, z, ry = 0, c = 'sky', s = 1, y = G) {
  m.with({ t: [x, y, z], ry, s }, () => {
    m.prism('orange', [0, 0], 0.001, 0, 0.012, 3);
    m.gem(c, [0, 0.022, 0], 0.012, 0.01, 5);
    m.gem(c, [0, 0.034, 0.01], 0.008, 0.008, 5);
    m.with({ t: [0, 0.034, 0.018], rx: PI2 }, () => m.frustum('orange', [0, 0], 0.003, 0, 0, 0.008, 3));
    for (const sx of [-1, 1]) m.with({ t: [sx * 0.01, 0.025, 0], rz: sx * 0.6 }, () => m.box(c, [0, -0.002, -0.008], [0.02 * sx || 0.02, 0.002, 0.008]));
  });
}

export function cow(m, x, z, ry = 0, s = 1, y = G) {
  m.with({ t: [x, y, z], ry, s }, () => {
    legs(m, 'paper', [-0.02, 0.02], [-0.04, 0.04], 0, 0.055, 0.009);
    m.box('paper', [-0.028, 0.055, -0.06], [0.028, 0.1, 0.055]);
    for (const [px, pz] of [[0.029, 0.0], [-0.029, -0.03], [0.029, -0.04]]) m.box('dark', [px - 0.001, 0.065, pz - 0.015], [px + 0.001, 0.09, pz + 0.015]);
    m.box('paper', [-0.018, 0.075, 0.055], [0.018, 0.105, 0.085]);
    m.box('pink', [-0.016, 0.075, 0.085], [0.016, 0.09, 0.092]);
    for (const sx of [-1, 1]) m.frustum('sand', [sx * 0.016, 0.065], 0.004, 0, 0.105, 0.12, 4);
  });
}
