import { PI, G, plate, patch, win, door, windowsAround, treeRound, treePine, bush, bench, fence, column, hedge, palm, car, sign, hvac, umbrella, dome, flagpole, bus, plane } from '../lib/parts.mjs';

function school(m) {
  plate(m);
  m.box({ top: 'orange', sides: 'bark' }, [-0.46, G, 0.12], [0.46, G + 0.006, 0.46]);
  m.box('sunflower', [-0.42, G, -0.36], [0.42, 0.32, 0.02]);
  m.gable('red', 'sunflower', [-0.45, 0.32, -0.41], [0.45, 0.5, 0.07]);
  // central clock tower
  m.box('cream', [-0.11, G, -0.14], [0.11, 0.66, 0.1]);
  m.hip('red', [-0.14, 0.66, -0.17], [0.14, 0.86, 0.13]);
  m.box('paper', [-0.12, 0.64, -0.15], [0.12, 0.67, 0.11]);
  m.with({ t: [0, 0.53, 0.1], rx: PI / 2 }, () => {
    m.prism('paper', [0, 0], 0.06, 0, 0.014, 10, 0, 'paper');
    m.box('dark', [-0.004, 0.014, -0.004], [0.004, 0.02, 0.045]);
    m.box('dark', [-0.004, 0.014, -0.004], [0.032, 0.02, 0.004]);
  });
  door(m, '+z', 0.1, 0, 0.1, 0.2, 'blue');
  for (const x of [-0.34, -0.2, 0.2, 0.34]) win(m, '+z', 0.02, x, 0.2, 0.09, 0.12);
  win(m, '+z', 0.1, 0, 0.38, 0.08, 0.08);
  for (const x of [-0.42, 0.42]) win(m, x > 0 ? '+x' : '-x', x, -0.17, 0.2, 0.12, 0.12);
  // flag
  m.prism('paper', [0.36, 0.34], 0.008, G, 0.6, 5);
  m.box('coral', [0.365, 0.48, 0.337], [0.48, 0.58, 0.343]);
  // yard: hopscotch squares and a bench
  for (let i = 0; i < 3; i++) m.box(i % 2 ? 'paper' : 'lemon', [-0.36, G + 0.006, 0.18 + i * 0.07], [-0.3, G + 0.01, 0.24 + i * 0.07]);
  bench(m, 0.14, 0.4, 0);
  bush(m, -0.18, 0.4, 0.045, 'leaf', 'pink');
  treeRound(m, -0.44, -0.42, 0.6);
  treeRound(m, 0.44, -0.42, 0.6);
}

function kindergarten(m) {
  plate(m, 'grass');
  patch(m, 'sand', -0.46, 0.08, 0.1, 0.46);
  const blocks = [['pink', [-0.4, -0.38], [-0.08, -0.06], 'coral'], ['lemon', [-0.08, -0.38], [0.2, -0.02], 'orange'], ['sky', [0.2, -0.38], [0.42, -0.1], 'blue']];
  for (const [c, [x0, z0], [x1, z1], roof] of blocks) {
    m.box(c, [x0, G, z0], [x1, 0.24, z1]);
    m.gable(roof, c, [x0 - 0.02, 0.24, z0 - 0.02], [x1 + 0.02, 0.36, z1 + 0.02]);
    win(m, '+z', z1, (x0 + x1) / 2, 0.15, 0.08, 0.08);
  }
  door(m, '+z', -0.06, -0.24, 0.07, 0.15, 'teal');
  m.prism('sunflower', [0.06, -0.02], 0.05, 0.3, 0.31, 10);
  // slide and swings
  m.box('coral', [-0.36, G, 0.2], [-0.28, 0.16, 0.28]);
  m.with({ t: [-0.28, 0.16, 0.24], rz: -0.7 }, () => m.box('sunflower', [0, -0.006, -0.03], [0.2, 0.006, 0.03]));
  for (const x of [-0.14, 0.06]) m.box('blue', [x - 0.006, G, 0.14], [x + 0.006, 0.2, 0.36]);
  m.box('blue', [-0.146, 0.19, 0.24], [0.066, 0.2, 0.26]);
  for (const x of [-0.09, 0.01]) {
    m.box('dark', [x - 0.001, 0.1, 0.25], [x + 0.001, 0.19, 0.251]);
    m.box('red', [x - 0.02, 0.09, 0.24], [x + 0.02, 0.1, 0.26]);
  }
  m.box({ sides: 'paper', top: 'sand' }, [0.22, G, 0.18], [0.4, G + 0.02, 0.36]);
  fence(m, -0.47, 0.47, 0.47, 0.47, 12);
  treeRound(m, 0.4, 0.06, 0.7, 'grass');
}

function university(m) {
  plate(m, 'grass', 'leaf', 2, 2);
  patch(m, 'kerb', -0.1, -0.2, 0.1, 1, 0.006, 'stone');
  patch(m, 'kerb', -0.8, 0.3, 0.8, 0.44, 0.006, 'stone');
  // main hall with dome
  m.box('cream', [-0.4, G, -0.9], [0.4, 0.5, -0.3]);
  m.box({ top: 'kerb', sides: 'stone' }, [-0.24, G, -0.3], [0.24, 0.08, -0.14]);
  for (const x of [-0.2, -0.07, 0.07, 0.2]) column(m, x, -0.2, 0.08, 0.44, 0.016);
  m.box('paper', [-0.24, 0.44, -0.32], [0.24, 0.48, -0.14]);
  m.gableZ('terracotta', 'paper', [-0.25, 0.48, -0.32], [0.25, 0.6, -0.13]);
  m.box('paper', [-0.41, 0.5, -0.91], [0.41, 0.53, -0.29]);
  m.prism('cream', [0, -0.6], 0.16, 0.53, 0.64, 12);
  dome(m, 'teal', [0, -0.6], 0.16, 0.64);
  windowsAround(m, [-0.4, -0.9, 0.4, -0.3], 2, { sides: '+z+x-x', y0: G, fh: 0.23, cols: 5, w: 0.05, h: 0.12, skip: (d, f, i) => d === '+z' && f === 0 && i > 0 && i < 4 });
  door(m, '+z', -0.3, 0, 0.1, 0.2, 'wood', 0.08);
  // two faculty wings
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -0.92 : 0.5, x1 = s < 0 ? -0.5 : 0.92;
    m.box('terracotta', [x0, G, -0.9], [x1, 0.42, 0.1]);
    m.hip('slate', [x0 - 0.03, 0.42, -0.93], [x1 + 0.03, 0.56, 0.13], 0.7);
    windowsAround(m, [x0, -0.9, x1, 0.1], 2, { y0: G, fh: 0.19, cols: 4, w: 0.05, h: 0.1 });
    for (const z of [0.6, 0.85]) treeRound(m, s * 0.5, z, 1, s < 0 ? 'leaf' : 'grass');
    bench(m, s * 0.3, 0.52, 0);
    flagpole(m, s * 0.2, 0.6, 0.45, s < 0 ? 'red' : 'teal', s < 0 ? 'paper' : null);
  }
  for (const [x, z] of [[-0.85, 0.55], [0.85, 0.55], [-0.85, 0.88], [0.85, 0.88]]) treePine(m, x, z, 0.9);
}

function hospital(m) {
  plate(m, 'stone', 'dark', 2, 1);
  // main tower
  m.box('paper', [-0.85, G, -0.4], [0.1, 0.9, 0.1]);
  for (let f = 0; f < 6; f++) {
    const y = 0.14 + f * 0.13;
    m.box('glass', [-0.855, y, -0.405], [0.105, y + 0.07, 0.105]);
  }
  m.box('mint', [-0.855, G, 0.1], [0.105, 0.12, 0.11]);
  m.box('paper', [-0.86, 0.9, -0.41], [0.11, 0.93, 0.11]);
  // red cross sign on the roof edge
  m.box('paper', [-0.46, 0.93, 0.04], [-0.28, 1.11, 0.08]);
  m.box('red', [-0.4, 0.95, 0.08], [-0.34, 1.09, 0.09]);
  m.box('red', [-0.44, 0.99, 0.08], [-0.3, 1.05, 0.09]);
  // helipad
  m.prism('dark', [-0.2, -0.16], 0.16, 0.93, 0.95, 10);
  m.box('paper', [-0.25, 0.95, -0.22], [-0.23, 0.955, -0.1]);
  m.box('paper', [-0.17, 0.95, -0.22], [-0.15, 0.955, -0.1]);
  m.box('paper', [-0.23, 0.95, -0.17], [-0.17, 0.955, -0.15]);
  // low wing and emergency canopy
  m.box('paper', [0.1, G, -0.4], [0.9, 0.3, 0.0]);
  m.box('glass', [0.105, 0.12, -0.405], [0.905, 0.22, 0.005]);
  m.box('mint', [0.09, 0.3, -0.41], [0.91, 0.33, 0.01]);
  m.box({ sides: 'red', top: 'paper' }, [0.3, 0.22, 0.0], [0.7, 0.25, 0.26]);
  for (const x of [0.32, 0.68]) m.box('paper', [x - 0.01, G, 0.23], [x + 0.01, 0.22, 0.25]);
  sign(m, 0.5, 0.25, 0.26, 0.3, 0.04, 'red', 'paper');
  // ambulance
  m.with({ t: [0.5, 0, 0.14], ry: PI }, () => {
    m.box({ sides: 'paper', top: 'paper' }, [-0.045, G + 0.02, -0.1], [0.045, G + 0.11, 0.1]);
    m.box('red', [-0.046, G + 0.05, -0.1], [0.046, G + 0.065, 0.1]);
    m.box('glass', [-0.04, G + 0.07, 0.1], [0.04, G + 0.1, 0.102]);
    m.box('blue', [-0.02, G + 0.11, 0.06], [0.02, G + 0.12, 0.08]);
  });
  door(m, '+z', 0.11, -0.4, 0.14, 0.12, 'glass');
  for (const x of [-0.95, 0.95]) treeRound(m, x, 0.38, 0.7);
  for (let x = -0.7; x < 0.1; x += 0.14) m.box('paper', [x, G, 0.3], [x + 0.008, G + 0.004, 0.48]);
  car(m, -0.63, 0.39, 0, 'sky');
  car(m, -0.35, 0.39, 0, 'coral');
}

function clinic(m) {
  plate(m, 'grass');
  patch(m, 'kerb', -0.1, 0.18, 0.1, 0.5, 0.006, 'stone');
  m.box('paper', [-0.36, G, -0.3], [0.36, 0.3, 0.18]);
  m.box('teal', [-0.365, 0.2, -0.305], [0.365, 0.23, 0.185]);
  m.gable('teal', 'paper', [-0.4, 0.3, -0.34], [0.4, 0.44, 0.22]);
  m.box({ sides: 'paper', top: 'teal' }, [-0.14, 0.2, 0.18], [0.14, 0.23, 0.3]);
  for (const x of [-0.12, 0.12]) m.box('paper', [x - 0.008, G, 0.28], [x + 0.008, 0.2, 0.296]);
  door(m, '+z', 0.18, 0, 0.1, 0.15, 'glass');
  for (const x of [-0.26, 0.26]) win(m, '+z', 0.18, x, 0.13, 0.1, 0.08);
  m.box('paper', [-0.07, 0.3, 0.2], [0.07, 0.44, 0.22]);
  m.box('leaf', [-0.02, 0.32, 0.22], [0.02, 0.42, 0.226]);
  m.box('leaf', [-0.05, 0.35, 0.22], [0.05, 0.39, 0.226]);
  windowsAround(m, [-0.36, -0.3, 0.36, 0.18], 1, { sides: '+x-x', y0: G, fh: 0.2, cols: 2 });
  for (const x of [-0.4, 0.4]) bush(m, x, 0.36, 0.045, 'leaf', 'pink');
  treeRound(m, 0.4, -0.42, 0.7);
}

function police(m) {
  plate(m, 'stone', 'dark');
  m.box('paper', [-0.38, G, -0.34], [0.38, 0.42, 0.14]);
  m.box('navy', [-0.385, G, -0.345], [0.385, 0.1, 0.145]);
  m.box('blue', [-0.385, 0.34, -0.345], [0.385, 0.38, 0.145]);
  m.box('dark', [-0.39, 0.42, -0.35], [0.39, 0.44, 0.15]);
  windowsAround(m, [-0.38, -0.34, 0.38, 0.14], 2, { y0: 0.1, fh: 0.13, cols: 4, w: 0.07, h: 0.07, skip: (d, f, i) => d === '+z' && f === 0 && (i === 1 || i === 2) });
  m.box({ top: 'navy', sides: 'paper' }, [-0.14, 0.24, 0.14], [0.14, 0.26, 0.26]);
  door(m, '+z', 0.14, 0, 0.12, 0.18, 'glass');
  sign(m, 0, 0.27, 0.14, 0.3, 0.05, 'navy', 'paper');
  m.gem('gold', [0, 0.36, 0.15], 0.03, 0.03, 6);
  flagpole(m, 0.34, 0.3, 0.5, 'red', 'paper');
  for (const [x, ry] of [[-0.22, 0], [0.06, PI]]) {
    car(m, x, 0.38, ry, 'paper');
    m.with({ t: [x, 0, 0.38], ry }, () => {
      m.box('navy', [-0.046, G + 0.035, -0.09], [0.046, G + 0.045, 0.09]);
      m.box('red', [-0.02, G + 0.088, -0.01], [0, G + 0.098, 0.01]);
      m.box('blue', [0, G + 0.088, -0.01], [0.02, G + 0.098, 0.01]);
    });
  }
  hvac(m, -0.2, -0.2, 0.44);
}

function fireStation(m) {
  plate(m, 'stone', 'dark');
  m.box('red', [-0.4, G, -0.36], [0.24, 0.36, 0.14]);
  m.box('paper', [-0.405, 0.3, -0.365], [0.245, 0.33, 0.145]);
  m.box('dark', [-0.41, 0.36, -0.37], [0.25, 0.38, 0.15]);
  for (const x of [-0.24, 0.06]) {
    m.box('paper', [x - 0.12, G, 0.14], [x + 0.12, 0.25, 0.15]);
    m.box('kerb', [x - 0.1, G, 0.15], [x + 0.1, 0.23, 0.155]);
    for (let y = G + 0.03; y < 0.23; y += 0.03) m.box('stone', [x - 0.1, y, 0.155], [x + 0.1, y + 0.005, 0.158]);
  }
  sign(m, -0.08, 0.26, 0.14, 0.4, 0.04, 'paper', 'red');
  // hose tower
  m.box('red', [0.24, G, -0.36], [0.4, 0.7, -0.2]);
  m.box('paper', [0.235, 0.66, -0.365], [0.405, 0.7, -0.195]);
  m.hip('dark', [0.22, 0.7, -0.38], [0.42, 0.78, -0.18]);
  win(m, '+z', -0.2, 0.32, 0.55, 0.06, 0.08);
  win(m, '+x', 0.4, -0.28, 0.4, 0.06, 0.08);
  // fire engine
  m.with({ t: [0.06, G, 0.34], ry: 0 }, () => {
    m.box('red', [-0.06, 0.02, -0.14], [0.06, 0.11, 0.1]);
    m.box({ sides: 'red', top: 'paper' }, [-0.06, 0.02, 0.1], [0.06, 0.13, 0.16]);
    m.box('glass', [-0.055, 0.08, 0.16], [0.055, 0.12, 0.162]);
    m.box('paper', [-0.061, 0.05, -0.14], [0.061, 0.06, 0.16]);
    m.box('stone', [-0.012, 0.11, -0.16], [0.012, 0.13, 0.08]);
    for (let z = -0.15; z < 0.08; z += 0.03) m.box('stone', [-0.03, 0.12, z], [0.03, 0.126, z + 0.006]);
    m.box('blue', [-0.03, 0.13, 0.13], [0.03, 0.14, 0.15]);
    for (const wx of [-0.06, 0.06]) for (const wz of [-0.08, 0.1]) m.with({ t: [wx, 0.022, wz], rz: PI / 2 }, () => m.prism('dark', [0, 0], 0.022, -0.01, 0.01, 8, 0, 'kerb'));
  });
  m.prism('red', [-0.38, 0.4], 0.015, G, G + 0.05, 6, 0, 'sunflower');
}

function postOffice(m) {
  plate(m, 'kerb', 'stone');
  m.box('orange', [-0.36, G, -0.34], [0.36, 0.32, 0.14]);
  m.box('paper', [-0.365, 0.24, -0.345], [0.365, 0.27, 0.145]);
  m.hip('terracotta', [-0.4, 0.32, -0.38], [0.4, 0.46, 0.18], 0.36);
  door(m, '+z', 0.14, 0, 0.1, 0.17, 'glass');
  for (const x of [-0.24, 0.24]) win(m, '+z', 0.14, x, 0.14, 0.12, 0.1);
  sign(m, 0, 0.26, 0.145, 0.34, 0.05, 'paper', 'orange');
  // envelope sign
  m.box('paper', [-0.06, 0.34, 0.16], [0.06, 0.42, 0.18]);
  m.with({ t: [0, 0.42, 0.181] }, () => {
    m.with({ rz: 0.6 }, () => m.box('orange', [-0.004, -0.07, 0], [0.004, 0, 0.004]));
    m.with({ rz: -0.6 }, () => m.box('orange', [-0.004, -0.07, 0], [0.004, 0, 0.004]));
  });
  windowsAround(m, [-0.36, -0.34, 0.36, 0.14], 1, { sides: '+x-x', y0: G, fh: 0.22, cols: 2 });
  // mailbox and delivery van
  m.box({ sides: 'orange', top: 'orange' }, [0.34, G, 0.3], [0.4, 0.14, 0.36]);
  m.box('dark', [0.35, 0.11, 0.36], [0.39, 0.115, 0.362]);
  m.with({ t: [-0.2, G, 0.34], ry: PI / 2 }, () => {
    m.box({ sides: 'orange', top: 'paper' }, [-0.045, 0.02, -0.1], [0.045, 0.11, 0.06]);
    m.box('orange', [-0.045, 0.02, 0.06], [0.045, 0.08, 0.1]);
    m.box('glass', [-0.04, 0.06, 0.06], [0.04, 0.1, 0.07]);
    for (const wx of [-0.045, 0.045]) for (const wz of [-0.06, 0.06]) m.with({ t: [wx, 0.02, wz], rz: PI / 2 }, () => m.prism('dark', [0, 0], 0.02, -0.01, 0.01, 8, 0, 'kerb'));
  });
}

function cityHall(m) {
  plate(m, 'kerb', 'stone', 2, 1);
  m.box('paper', [-0.8, G, -0.4], [0.8, 0.44, 0.08]);
  m.box('cream', [-0.805, 0.2, -0.405], [0.805, 0.22, 0.085]);
  m.box('cream', [-0.82, 0.44, -0.42], [0.82, 0.48, 0.1]);
  windowsAround(m, [-0.8, -0.4, 0.8, 0.08], 2, { y0: G, fh: 0.2, cols: 8, w: 0.05, h: 0.12, skip: (d, f, i) => d === '+z' && i > 2 && i < 5 });
  // portico
  m.box({ top: 'kerb', sides: 'stone' }, [-0.3, G, 0.08], [0.3, 0.08, 0.26]);
  for (let i = 0; i < 3; i++) m.box({ top: 'kerb', sides: 'stone' }, [-0.3, G, 0.26 + i * 0.03], [0.3, 0.08 - (i + 1) * 0.02, 0.29 + i * 0.03]);
  for (const x of [-0.26, -0.13, 0, 0.13, 0.26]) column(m, x, 0.21, 0.08, 0.44, 0.016);
  m.box('paper', [-0.3, 0.44, 0.06], [0.3, 0.49, 0.26]);
  m.gableZ('terracotta', 'paper', [-0.31, 0.49, 0.06], [0.31, 0.62, 0.27]);
  door(m, '+z', 0.08, 0, 0.12, 0.24, 'wood', 0.08);
  // clock tower with dome
  m.box('paper', [-0.12, 0.48, -0.3], [0.12, 0.82, -0.06]);
  m.with({ t: [0, 0.7, -0.06], rx: PI / 2 }, () => {
    m.prism('paper', [0, 0], 0.07, 0, 0.012, 12);
    m.prism('dark', [0, 0], 0.058, 0.012, 0.014, 12);
    m.prism('lemon', [0, 0], 0.052, 0.014, 0.016, 12);
    m.box('dark', [-0.004, 0.016, -0.004], [0.004, 0.02, 0.045]);
    m.box('dark', [-0.004, 0.016, -0.004], [0.03, 0.02, 0.004]);
  });
  m.box('cream', [-0.13, 0.82, -0.31], [0.13, 0.85, -0.05]);
  dome(m, 'terracotta', [0, -0.18], 0.12, 0.85);
  m.hip('terracotta', [-0.84, 0.48, -0.44], [-0.3, 0.6, 0.12], 0.3);
  m.hip('terracotta', [0.3, 0.48, -0.44], [0.84, 0.6, 0.12], 0.3);
  for (const x of [-0.5, 0.5]) flagpole(m, x, 0.36, 0.5, 'red', 'paper');
  for (const x of [-0.9, 0.9]) treeRound(m, x, 0.36, 0.8);
  for (const x of [-0.7, 0.7]) bush(m, x, 0.4, 0.05, 'leaf', 'sunflower');
}

function library(m) {
  plate(m, 'kerb', 'stone');
  m.box('terracotta', [-0.38, G, -0.36], [0.38, 0.44, 0.1]);
  m.box('paper', [-0.385, 0.4, -0.365], [0.385, 0.44, 0.105]);
  m.box('dark', [-0.39, 0.44, -0.37], [0.39, 0.46, 0.11]);
  for (const x of [-0.26, 0.26]) {
    m.box('paper', [x - 0.07, 0.08, 0.1], [x + 0.07, 0.36, 0.11]);
    m.box('glass', [x - 0.055, 0.09, 0.11], [x + 0.055, 0.35, 0.116]);
    m.frustum('paper', [x, 0.105], 0.07, 0.07, 0.36, 0.36, 6);
  }
  m.box({ top: 'kerb', sides: 'stone' }, [-0.14, G, 0.1], [0.14, 0.07, 0.24]);
  for (const x of [-0.11, 0.11]) column(m, x, 0.2, 0.07, 0.34, 0.013);
  m.box('paper', [-0.14, 0.34, 0.08], [0.14, 0.38, 0.24]);
  door(m, '+z', 0.1, 0, 0.09, 0.2, 'wood', 0.07);
  // stack of books on the roof
  const books = ['coral', 'sky', 'sunflower', 'mint'];
  books.forEach((c, i) => m.with({ t: [0.02, 0.46 + i * 0.035, -0.14], ry: i * 0.25 }, () => {
    m.box(c, [-0.12, 0, -0.08], [0.12, 0.03, 0.08]);
    m.box('paper', [-0.115, 0.004, 0.08], [0.115, 0.026, 0.082]);
  }));
  windowsAround(m, [-0.38, -0.36, 0.38, 0.1], 2, { sides: '+x-x', y0: G, fh: 0.18, cols: 3, w: 0.06, h: 0.1 });
  for (const x of [-0.34, 0.34]) bench(m, x, 0.36, 0);
  treeRound(m, 0.42, -0.42, 0.7);
}

function museum(m) {
  plate(m, 'kerb', 'stone', 2, 1);
  m.box('cream', [-0.8, G, -0.42], [0.8, 0.44, 0.0]);
  m.box('stone', [-0.82, 0.44, -0.44], [0.82, 0.5, 0.02]);
  m.box({ top: 'kerb', sides: 'stone' }, [-0.5, G, 0.0], [0.5, 0.08, 0.14]);
  for (let i = 0; i < 3; i++) m.box({ top: 'kerb', sides: 'stone' }, [-0.5, G, 0.14 + i * 0.03], [0.5, 0.08 - (i + 1) * 0.02, 0.17 + i * 0.03]);
  for (let x = -0.44; x <= 0.441; x += 0.11) column(m, x, 0.08, 0.08, 0.44, 0.017);
  m.box('cream', [-0.5, 0.44, -0.02], [0.5, 0.5, 0.14]);
  m.gableZ('stone', 'cream', [-0.51, 0.5, -0.02], [0.51, 0.66, 0.15]);
  door(m, '+z', 0.0, 0, 0.14, 0.26, 'dark', 0.08);
  // banners
  for (const [x, c] of [[-0.68, 'coral'], [-0.58, 'sky'], [0.58, 'sunflower'], [0.68, 'mint']]) m.box(c, [x - 0.03, 0.14, 0.0], [x + 0.03, 0.38, 0.012]);
  // glass pyramid and a paper dinosaur
  m.hip('glass', [0.52, G, 0.18], [0.84, 0.26, 0.46]);
  m.with({ t: [-0.66, G, 0.32], ry: 0.4 }, () => {
    m.gem('mint', [0, 0.1, 0], 0.08, 0.05, 6);
    m.with({ t: [0.07, 0.12, 0], rz: 0.8 }, () => m.frustum('mint', [0, 0], 0.03, 0.018, 0, 0.14, 5));
    m.gem('mint', [0.17, 0.24, 0], 0.035, 0.025, 5);
    m.with({ t: [-0.07, 0.1, 0], rz: 1.9 }, () => m.frustum('mint', [0, 0], 0.03, 0, 0, 0.14, 5));
    for (const lx of [-0.03, 0.03]) for (const lz of [-0.03, 0.03]) m.prism('teal', [lx, lz], 0.012, 0, 0.08, 5);
  });
}

function mosque(m) {
  plate(m, 'kerb', 'stone');
  m.box('paper', [-0.3, G, -0.36], [0.3, 0.32, 0.12]);
  m.box('mint', [-0.305, 0.28, -0.365], [0.305, 0.3, 0.125]);
  m.box('paper', [-0.31, 0.32, -0.37], [0.31, 0.35, 0.13]);
  m.prism('paper', [0, -0.12], 0.2, 0.35, 0.4, 12);
  dome(m, 'teal', [0, -0.12], 0.2, 0.4, { n: 12, rings: 4 });
  for (const [x, z] of [[-0.3, -0.36], [0.3, -0.36], [-0.3, 0.12], [0.3, 0.12]]) dome(m, 'teal', [x, z], 0.04, 0.35, { n: 8, rings: 2 });
  // arched doorways
  for (const x of [-0.16, 0, 0.16]) {
    m.box('teal', [x - 0.045, G, 0.12], [x + 0.045, 0.2, 0.13]);
    m.frustum('teal', [x, 0.125], 0.045, 0.0, 0.2, 0.25, 8);
  }
  windowsAround(m, [-0.3, -0.36, 0.3, 0.12], 1, { sides: '+x-x', y0: G, fh: 0.28, cols: 3, w: 0.05, h: 0.14, glass: 'mint' });
  // minaret
  m.prism('paper', [0.4, -0.38], 0.05, G, 0.72, 8);
  for (const y of [0.3, 0.56]) m.prism('mint', [0.4, -0.38], 0.065, y, y + 0.025, 8);
  m.prism('paper', [0.4, -0.38], 0.04, 0.72, 0.8, 8);
  dome(m, 'teal', [0.4, -0.38], 0.05, 0.8, { n: 8, rings: 2 });
  // courtyard ablution fountain and palms
  m.prism('stone', [-0.26, 0.34], 0.07, G, G + 0.04, 8, 0, 'water');
  palm(m, 0.38, 0.38, 0.9);
  bush(m, 0.1, 0.4, 0.04, 'leaf');
}

function church(m) {
  plate(m, 'grass');
  patch(m, 'kerb', -0.07, 0.28, 0.07, 0.5, 0.006, 'stone');
  m.box('paper', [-0.2, G, -0.44], [0.2, 0.34, 0.14]);
  m.gableZ('slate', 'paper', [-0.24, 0.34, -0.46], [0.24, 0.56, 0.14]);
  windowsAround(m, [-0.2, -0.44, 0.2, 0.14], 1, { sides: '+x-x', y0: G, fh: 0.3, cols: 3, w: 0.05, h: 0.16, glass: 'lavender' });
  // bell tower with spire
  m.box('paper', [-0.1, G, 0.14], [0.1, 0.62, 0.3]);
  m.box('cream', [-0.105, 0.44, 0.135], [0.105, 0.46, 0.305]);
  win(m, '+z', 0.3, 0, 0.53, 0.06, 0.1, 'dark');
  const r2 = Math.SQRT2;
  m.frustum('slate', [0, 0.22], 0.1 * r2, 0, 0.62, 0.96, 4, PI / 4);
  m.box('gold', [-0.004, 0.96, 0.216], [0.004, 1.06, 0.224]);
  m.box('gold', [-0.03, 1.02, 0.216], [0.03, 1.028, 0.224]);
  door(m, '+z', 0.3, 0, 0.09, 0.18, 'wood');
  m.with({ t: [0, 0.4, 0.3], rx: PI / 2 }, () => m.prism('lavender', [0, 0], 0.05, 0, 0.01, 10));
  treePine(m, -0.36, 0.3, 1);
  treePine(m, 0.36, 0.3, 0.9);
  for (const z of [-0.2, -0.36]) for (const x of [-0.36, 0.36]) m.box({ sides: 'stone', top: 'kerb' }, [x - 0.02, G, z - 0.01], [x + 0.02, G + 0.05, z + 0.01]);
}

function temple(m) {
  plate(m, 'grass');
  patch(m, 'kerb', -0.44, -0.44, 0.44, 0.2, 0.01, 'stone');
  // split gate (candi bentar)
  for (const s of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const w = 0.12 - i * 0.018, y = G + i * 0.08;
      m.box(i % 2 ? 'terracotta' : 'bark', [s * 0.14 - (s > 0 ? 0 : w), y, 0.28 - w / 2], [s * 0.14 + (s > 0 ? w : 0), y + 0.08, 0.28 + w / 2]);
    }
  }
  patch(m, 'kerb', -0.1, 0.2, 0.1, 0.5, 0.01, 'stone');
  // meru tower with stacked roofs
  m.box({ top: 'stone', sides: 'bark' }, [0.12, G, -0.4], [0.36, 0.14, -0.16]);
  m.box('wood', [0.17, 0.14, -0.35], [0.31, 0.24, -0.21]);
  for (let i = 0; i < 5; i++) {
    const r = 0.16 - i * 0.025, y = 0.24 + i * 0.07;
    m.hip('ijuk', [0.24 - r, y, -0.28 - r], [0.24 + r, y + 0.06, -0.28 + r]);
    if (i < 4) m.prism('wood', [0.24, -0.28], 0.03, y + 0.05, y + 0.07, 4);
  }
  m.frustum('gold', [0.24, -0.28], 0.015, 0, 0.59, 0.66, 4);
  // small shrines
  for (const [x, z] of [[-0.3, -0.3], [-0.3, -0.05]]) {
    m.box({ top: 'stone', sides: 'terracotta' }, [x - 0.07, G, z - 0.07], [x + 0.07, 0.12, z + 0.07]);
    m.box('wood', [x - 0.05, 0.12, z - 0.05], [x + 0.05, 0.2, z + 0.05]);
    m.hip('ijuk', [x - 0.09, 0.2, z - 0.09], [x + 0.09, 0.3, z + 0.09]);
  }
  for (const [x, z, c] of [[0.02, -0.1, 'sunflower'], [0.08, 0.06, 'paper']]) umbrella(m, x, z, c, G + 0.01);
  palm(m, -0.4, 0.4, 0.9);
  bush(m, 0.36, 0.4, 0.05, 'leaf', 'pink');
}

function trainStation(m) {
  plate(m, 'kerb', 'stone', 2, 1);
  // track bed along x
  m.box({ top: 'stone', sides: 'dark' }, [-1, G, 0.16], [1, G + 0.012, 0.46]);
  for (let x = -0.98; x < 1; x += 0.07) m.box('bark', [x, G + 0.012, 0.19], [x + 0.03, G + 0.02, 0.43]);
  for (const z of [0.24, 0.38]) m.box('dark', [-1, G + 0.02, z - 0.006], [1, G + 0.03, z + 0.006]);
  // platform with canopy
  m.box({ top: 'kerb', sides: 'stone' }, [-0.9, G, 0.0], [0.9, 0.08, 0.16]);
  m.box('sunflower', [-0.9, 0.076, 0.14], [0.9, 0.082, 0.155]);
  for (let x = -0.8; x <= 0.81; x += 0.4) m.box('dark', [x - 0.01, 0.08, 0.06], [x + 0.01, 0.28, 0.08]);
  m.with({ t: [0, 0.28, 0.07], rx: -0.12 }, () => m.box('sky', [-0.88, 0, -0.1], [0.88, 0.015, 0.12]));
  for (const x of [-0.6, 0.2]) bench(m, x, 0.03, PI);
  // station building
  m.box('cream', [-0.6, G, -0.42], [0.6, 0.34, 0.0]);
  m.gable('terracotta', 'cream', [-0.64, 0.34, -0.46], [0.64, 0.5, 0.04]);
  m.box('cream', [-0.14, G, -0.44], [0.14, 0.56, 0.02]);
  m.gableZ('terracotta', 'cream', [-0.16, 0.56, -0.46], [0.16, 0.66, 0.04]);
  m.with({ t: [0, 0.47, 0.02], rx: PI / 2 }, () => {
    m.prism('paper', [0, 0], 0.05, 0, 0.012, 10);
    m.box('dark', [-0.003, 0.012, -0.003], [0.003, 0.016, 0.035]);
    m.box('dark', [-0.003, 0.012, -0.003], [0.025, 0.016, 0.003]);
  });
  windowsAround(m, [-0.6, -0.42, 0.6, 0.0], 1, { sides: '+z-x+x', y0: G, fh: 0.3, cols: 6, w: 0.06, h: 0.14, skip: (d, f, i) => d === '+z' && (i === 2 || i === 3) });
  door(m, '+z', 0.02, 0, 0.1, 0.2, 'wood');
  sign(m, 0, 0.36, 0.02, 0.2, 0.04, 'navy', 'paper');
}

function busTerminal(m) {
  plate(m, 'stone', 'dark', 2, 1);
  m.box({ top: 'asphalt', sides: 'dark' }, [-1, G, -0.05], [1, G + 0.004, 0.5]);
  for (let x = -0.8; x <= 0.81; x += 0.32) m.box('sunflower', [x - 0.004, G + 0.004, 0.0], [x + 0.004, G + 0.008, 0.45]);
  // bays canopy
  m.box({ top: 'kerb', sides: 'stone' }, [-0.95, G, -0.2], [0.95, 0.07, -0.05]);
  for (let x = -0.9; x <= 0.91; x += 0.3) m.box('paper', [x - 0.012, 0.07, -0.14], [x + 0.012, 0.3, -0.11]);
  m.with({ t: [0, 0.3, -0.12] }, () => {
    m.box({ sides: 'teal', top: 'paper' }, [-0.96, 0, -0.12], [0.96, 0.03, 0.2]);
  });
  for (const x of [-0.5, 0.1, 0.7]) bench(m, x, -0.15, 0);
  bus(m, -0.64, 0.22, 0, 'sky');
  bus(m, -0.0, 0.22, 0, 'sunflower');
  bus(m, 0.64, 0.25, PI, 'coral');
  // terminal building
  m.box('paper', [-0.95, G, -0.46], [0.95, 0.26, -0.2]);
  m.box('glass', [-0.9, 0.08, -0.2], [0.9, 0.22, -0.195]);
  sign(m, 0, 0.26, -0.21, 0.4, 0.06, 'teal', 'paper');
}

function airport(m) {
  plate(m, 'kerb', 'stone', 2, 2);
  // apron and a stretch of runway
  m.box({ top: 'asphalt', sides: 'dark' }, [-1, G, 0.1], [1, G + 0.004, 1]);
  for (let x = -0.95; x < 1; x += 0.2) m.box('paper', [x, G + 0.004, 0.78], [x + 0.1, G + 0.008, 0.8]);
  for (const z of [0.66, 0.92]) m.box('paper', [-1, G + 0.004, z], [1, G + 0.008, z + 0.01]);
  m.box('sunflower', [-0.6, G + 0.004, 0.1], [-0.59, G + 0.008, 0.6]);
  m.box('sunflower', [0.4, G + 0.004, 0.1], [0.41, G + 0.008, 0.6]);
  plane(m, -0.3, 0.42, PI, 1.6, 'coral');
  plane(m, 0.62, 0.36, PI * 0.9, 1.3, 'sky');
  // terminal with a wavy roof
  m.box({ sides: 'glass', top: 'paper' }, [-0.9, G, -0.7], [0.5, 0.3, -0.1]);
  for (let i = 0; i < 4; i++) {
    const x0 = -0.95 + i * 0.36;
    m.with({ t: [x0 + 0.18, 0.3, -0.4], rz: 0 }, () => m.saddle('paper', 'kerb', -0.18, 0.18, [0, 0], [0.1, 0.1], -0.34, 0.34));
  }
  for (let x = -0.85; x < 0.5; x += 0.15) m.box('paper', [x - 0.006, G, -0.1], [x + 0.006, 0.3, -0.094]);
  // jet bridge
  m.box({ sides: 'paper', top: 'stone' }, [-0.33, 0.12, -0.1], [-0.27, 0.18, 0.18]);
  // control tower
  m.prism('paper', [0.75, -0.6], 0.06, G, 0.8, 8);
  m.frustum('paper', [0.75, -0.6], 0.07, 0.12, 0.8, 0.86, 8);
  m.prism('glass', [0.75, -0.6], 0.12, 0.86, 0.94, 8);
  m.frustum('navy', [0.75, -0.6], 0.13, 0.05, 0.94, 0.98, 8);
  m.prism('dark', [0.75, -0.6], 0.006, 0.98, 1.08, 4);
  m.gem('coral', [0.75, 1.09, -0.6], 0.012, 0.012, 4);
  // car park
  for (const [x, c] of [[-0.9, 'coral'], [-0.7, 'sky'], [-0.5, 'lemon'], [0.1, 'mint'], [0.3, 'paper']]) car(m, x, -0.86, PI / 2, c);
}

function waterTower(m) {
  plate(m, 'grass');
  for (const [x, z] of [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]]) m.box('stone', [x - 0.015, G, z - 0.015], [x + 0.015, 0.54, z + 0.015]);
  for (const y of [0.2, 0.38]) {
    m.box('stone', [-0.17, y, -0.17], [0.17, y + 0.012, -0.15]);
    m.box('stone', [-0.17, y, 0.15], [0.17, y + 0.012, 0.17]);
    m.box('stone', [-0.17, y, -0.17], [-0.15, y + 0.012, 0.17]);
    m.box('stone', [0.15, y, -0.17], [0.17, y + 0.012, 0.17]);
  }
  m.prism('sky', [0, 0], 0.24, 0.54, 0.78, 12);
  m.prism('paper', [0, 0], 0.25, 0.64, 0.66, 12);
  m.frustum('blue', [0, 0], 0.25, 0.04, 0.78, 0.86, 12);
  m.frustum('blue', [0, 0], 0.24, 0.1, 0.54, 0.5, 12);
  for (let y = G + 0.02; y < 0.54; y += 0.04) m.box('dark', [0.17, y, -0.03], [0.18, y + 0.006, 0.03]);
  hedge(m, -0.46, 0.4, 0.46, 0.46);
  treeRound(m, -0.38, -0.38, 0.8);
}

function powerPlant(m) {
  plate(m, 'stone', 'dark', 2, 2);
  // cooling towers
  for (const [x, z] of [[-0.55, -0.45], [-0.55, 0.3]]) {
    m.frustum('kerb', [x, z], 0.34, 0.22, G, 0.6, 14);
    m.frustum('kerb', [x, z], 0.22, 0.25, 0.6, 0.8, 14);
    m.gem('paper', [x, 0.9, z], 0.2, 0.08, 7);
    m.gem('paper', [x + 0.08, 1.0, z - 0.04], 0.14, 0.06, 6);
  }
  // turbine hall and chimneys
  m.box('sky', [0.0, G, -0.8], [0.8, 0.38, -0.2]);
  m.gable('blue', 'sky', [-0.02, 0.38, -0.82], [0.82, 0.48, -0.18]);
  windowsAround(m, [0.0, -0.8, 0.8, -0.2], 1, { sides: '+z-x', y0: G, fh: 0.3, cols: 5, w: 0.08 });
  for (const x of [0.2, 0.55]) {
    m.prism('paper', [x, -0.02], 0.05, G, 1.1, 10);
    for (const y of [0.3, 0.6, 0.9]) m.prism('red', [x, -0.02], 0.052, y, y + 0.06, 10);
  }
  // transformer yard with pylons
  patch(m, 'stone', 0.1, 0.3, 0.9, 0.9, 0.006, 'dark');
  for (const [x, z] of [[0.3, 0.5], [0.7, 0.5], [0.3, 0.75], [0.7, 0.75]]) {
    m.box({ sides: 'navy', top: 'stone' }, [x - 0.06, G, z - 0.05], [x + 0.06, G + 0.1, z + 0.05]);
    for (const dx of [-0.03, 0, 0.03]) m.prism('paper', [x + dx, z], 0.008, G + 0.1, G + 0.16, 5);
  }
  m.frustum('dark', [0.5, 0.95], 0.06, 0.01, G, 0.6, 4, PI / 4);
  m.box('dark', [0.36, 0.5, 0.94], [0.64, 0.51, 0.96]);
  fence(m, 0.05, 0.25, 0.95, 0.25, 12);
}

export default [
  { name: 'public_school', footprint: [1, 1], build: school },
  { name: 'public_kindergarten', footprint: [1, 1], build: kindergarten },
  { name: 'public_university', footprint: [2, 2], build: university },
  { name: 'public_hospital', footprint: [2, 1], build: hospital },
  { name: 'public_clinic', footprint: [1, 1], build: clinic },
  { name: 'public_police', footprint: [1, 1], build: police },
  { name: 'public_fire_station', footprint: [1, 1], build: fireStation },
  { name: 'public_post_office', footprint: [1, 1], build: postOffice },
  { name: 'public_city_hall', footprint: [2, 1], build: cityHall },
  { name: 'public_library', footprint: [1, 1], build: library },
  { name: 'public_museum', footprint: [2, 1], build: museum },
  { name: 'public_mosque', footprint: [1, 1], build: mosque },
  { name: 'public_church', footprint: [1, 1], build: church },
  { name: 'public_temple', footprint: [1, 1], build: temple },
  { name: 'public_train_station', footprint: [2, 1], build: trainStation },
  { name: 'public_bus_terminal', footprint: [2, 1], build: busTerminal },
  { name: 'public_airport', footprint: [2, 2], build: airport },
  { name: 'public_water_tower', footprint: [1, 1], build: waterTower },
  { name: 'public_power_plant', footprint: [2, 2], build: powerPlant },
];
