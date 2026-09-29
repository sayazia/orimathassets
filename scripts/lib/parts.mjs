// Shared building blocks used by many assets: ground plates, windows, doors,
// trees, bushes, street furniture and road pieces.

export const PI = Math.PI;
export const G = 0.04; // ground plate thickness
export const SW = 0.12; // sidewalk width on road tiles
export const LINE = 0.004; // paint thickness

// ---------------------------------------------------------------- helpers

export function plate(m, top = 'grass', sides = 'leaf', w = 1, d = 1) {
  m.box({ top, sides }, [-w / 2, 0, -d / 2], [w / 2, G, d / 2]);
}

// Flat painted/paved patch lying on the ground plate.
export function patch(m, colour, x0, z0, x1, z1, h = 0.006, sides = 'bark') {
  m.box({ top: colour, sides }, [x0, G, z0], [x1, G + h, z1]);
}

// Windows on the four walls of a box [x0..x1] x [z0..z1], `cols` per side, one row per floor.
export function windowsAround(m, [x0, z0, x1, z1], floors, { y0 = G, fh = 0.2, w = 0.08, h = 0.09, cols = 2, sides = '+z-z+x-x', glass = 'glass', skip = () => false } = {}) {
  for (let f = 0; f < floors; f++) {
    const y = y0 + f * fh + fh * 0.55;
    const put = (dir, face, a0, a1) => {
      if (!sides.includes(dir)) return;
      for (let i = 0; i < cols; i++) {
        const u = a0 + ((a1 - a0) * (i + 0.5)) / cols;
        if (!skip(dir, f, i)) win(m, dir, face, u, y, w, h, glass);
      }
    };
    put('+z', z1, x0, x1);
    put('-z', z0, x0, x1);
    put('+x', x1, z0, z1);
    put('-x', x0, z0, z1);
  }
}

// Window on a face. dir: '+z' | '-z' | '+x' | '-x'; (u, y) are the centre along the face.
export function win(m, dir, face, u, y, w, h, glass = 'glass') {
  const s = dir[0] === '+' ? 1 : -1;
  const f = 0.01, fw = 0.018;
  const along = (a0, a1, d0, d1) =>
    dir[1] === 'z' ? [[a0, y - h / 2 - d0, face + s * d1], [a1, y + h / 2 + d0, face]] : [[face + s * d1, y - h / 2 - d0, a0], [face, y + h / 2 + d0, a1]];
  const norm = ([a, b]) => [a.map((v, i) => Math.min(v, b[i])), a.map((v, i) => Math.max(v, b[i]))];
  m.box('paper', ...norm(along(u - w / 2 - fw, u + w / 2 + fw, fw, f)));
  m.box(glass, ...norm(along(u - w / 2, u + w / 2, 0, f + 0.008)));
}

export function door(m, dir, face, u, w, h, colour = 'blue', y0 = G) {
  const s = dir[0] === '+' ? 1 : -1;
  const box = (c, a0, a1, top, d) => {
    const p = dir[1] === 'z' ? [[a0, y0, face], [a1, top, face + s * d]] : [[face, y0, a0], [face + s * d, top, a1]];
    m.box(c, p[0].map((v, i) => Math.min(v, p[1][i])), p[0].map((v, i) => Math.max(v, p[1][i])));
  };
  box('paper', u - w / 2 - 0.018, u + w / 2 + 0.018, y0 + h + 0.018, 0.01);
  box(colour, u - w / 2, u + w / 2, y0 + h, 0.018);
}

export function treeRound(m, x, z, s = 1, crown = 'leaf') {
  m.with({ t: [x, 0, z], s }, () => {
    m.prism('bark', [0, 0], 0.025, 0, 0.14, 5);
    m.gem(crown, [0, 0.22, 0], 0.11, 0.12, 6);
  });
}

export function treePine(m, x, z, s = 1) {
  m.with({ t: [x, 0, z], s }, () => {
    m.prism('bark', [0, 0], 0.022, 0, 0.08, 5);
    m.frustum('pine', [0, 0], 0.12, 0, 0.06, 0.22, 7);
    m.frustum('pine', [0, 0], 0.095, 0, 0.15, 0.3, 7, 0.4);
    m.frustum('pine', [0, 0], 0.07, 0, 0.23, 0.38, 7, 0.8);
  });
}

export function bush(m, x, z, r = 0.05, c = 'leaf', flower = null, y = G) {
  m.gem(c, [x, y + r * 0.6, z], r, r * 0.7, 5);
  if (flower) {
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * PI * 2 + 0.5;
      m.gem(flower, [x + Math.cos(a) * r * 0.55, y + r * 1.15, z + Math.sin(a) * r * 0.55], r * 0.28, r * 0.28, 4);
    }
  }
}

export function bench(m, x, z, ry = 0) {
  m.with({ t: [x, 0, z], ry }, () => {
    for (const bx of [-0.055, 0.055]) m.box('dark', [bx - 0.008, 0, -0.02], [bx + 0.008, 0.035, 0.02]);
    m.box('orange', [-0.07, 0.035, -0.022], [0.07, 0.045, 0.022]);
    m.box('orange', [-0.07, 0.045, -0.025], [0.07, 0.085, -0.015]);
  });
}

export function lamp(m, x, z) {
  m.with({ t: [x, 0, z] }, () => {
    m.prism('dark', [0, 0], 0.018, 0, 0.02, 6);
    m.prism('dark', [0, 0], 0.007, 0.02, 0.3, 5);
    m.frustum('lemon', [0, 0], 0.02, 0.035, 0.29, 0.33, 6, 0, 'dark');
    m.hip('dark', [-0.03, 0.33, -0.03], [0.03, 0.36, 0.03]);
  });
}

export function fence(m, x0, z0, x1, z1, n) {
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n, z = z0 + ((z1 - z0) * i) / n;
    m.box('paper', [x - 0.008, G, z - 0.008], [x + 0.008, G + 0.07, z + 0.008]);
  }
  const t = 0.004;
  const lo = [Math.min(x0, x1) - t, G + 0.045, Math.min(z0, z1) - t], hi = [Math.max(x0, x1) + t, G + 0.058, Math.max(z0, z1) + t];
  m.box('paper', lo, hi);
}

export function roadPlate(m) {
  m.box({ top: 'asphalt', sides: 'dark' }, [-0.5, 0, -0.5], [0.5, G, 0.5]);
}

export function sidewalk(m, x0, z0, x1, z1) {
  m.box({ top: 'kerb', sides: 'stone' }, [x0, G, z0], [x1, G + 0.025, z1]);
}

// Dashed centre line along z at x = 0 (four dashes per tile, period 0.25).
export function dashesZ(m, from = -0.5, to = 0.5) {
  for (let c = -0.375; c <= 0.375; c += 0.25) {
    if (c < from || c > to) continue;
    m.box('paper', [-0.0125, G, c - 0.06], [0.0125, G + LINE, c + 0.06]);
  }
}

export function zebra(m) {
  // Pedestrian crossing across the +z arm, between the sidewalk corners.
  for (let x = -0.3; x <= 0.301; x += 0.1) m.box('paper', [x - 0.025, G, 0.395], [x + 0.025, G + LINE, 0.485]);
}

// ---------------------------------------------------------------- shared pieces

export function column(m, x, z, y0, y1, r = 0.014, c = 'paper') {
  m.prism(c, [x, z], r, y0, y1, 6);
  m.box(c, [x - r * 1.5, y0, z - r * 1.5], [x + r * 1.5, y0 + 0.012, z + r * 1.5]);
  m.box(c, [x - r * 1.5, y1 - 0.012, z - r * 1.5], [x + r * 1.5, y1, z + r * 1.5]);
}

// Swimming pool with a paved rim, sunk into the ground plate.
export function pool(m, x0, z0, x1, z1, rim = 0.03) {
  m.box({ top: 'kerb', sides: 'stone' }, [x0 - rim, G, z0 - rim], [x1 + rim, G + 0.012, z1 + rim]);
  m.box('water', [x0, G + 0.012, z0], [x1, G + 0.016, z1]);
}

export function lounger(m, x, z, ry = 0, c = 'paper') {
  m.with({ t: [x, G, z], ry }, () => {
    m.box(c, [-0.02, 0.01, -0.045], [0.02, 0.018, 0.03]);
    m.with({ t: [0, 0.014, 0.03], rx: -0.7 }, () => m.box(c, [-0.02, 0, 0], [0.02, 0.008, 0.035]));
    m.box('dark', [-0.018, 0, -0.04], [0.018, 0.01, 0.025]);
  });
}

export function umbrella(m, x, z, c = 'coral', y0 = G) {
  m.prism('paper', [x, z], 0.004, y0, y0 + 0.12, 4);
  m.frustum(c, [x, z], 0.07, 0, y0 + 0.1, y0 + 0.14, 8);
}

// Clipped hedge from (x0, z0) to (x1, z1).
export function hedge(m, x0, z0, x1, z1, h = 0.05) {
  m.box({ top: 'grass', sides: 'leaf' }, [x0, G, z0], [x1, G + h, z1]);
}

export function palm(m, x, z, s = 1, lean = 0.15) {
  m.with({ t: [x, 0, z], s }, () => {
    let px = 0, py = 0;
    for (let i = 0; i < 5; i++) {
      const nx = px + lean * 0.06 * (i + 1) * 0.5, ny = py + 0.07;
      m.beam(i % 2 ? 'bark' : 'wood', [px, py, 0], [nx, ny + 0.004, 0], 0.034 - i * 0.003);
      px = nx; py = ny;
    }
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      m.with({ t: [px, py, 0], ry: a, rz: -0.35 }, () => m.box(i % 2 ? 'leaf' : 'pine', [0, -0.004, -0.018], [0.13, 0.004, 0.018]));
    }
    m.gem('bark', [px, py - 0.01, 0], 0.02, 0.02, 4);
  });
}

// Small hatchback-sized car centred at (x, z), facing +z before rotation.
export function car(m, x = 0, z = 0, ry = 0, colour = 'coral', s = 1) {
  m.with({ t: [x, G, z], ry, s }, () => {
    m.box(colour, [-0.045, 0.02, -0.09], [0.045, 0.055, 0.09]);
    m.box({ sides: 'glass', top: colour }, [-0.04, 0.055, -0.05], [0.04, 0.088, 0.035]);
    for (const wx of [-0.045, 0.045]) {
      for (const wz of [-0.055, 0.055]) m.with({ t: [wx, 0.02, wz], rz: Math.PI / 2 }, () => m.prism('dark', [0, 0], 0.02, -0.01, 0.01, 8, 0, 'kerb'));
    }
    for (const wx of [-0.028, 0.028]) {
      m.box('lemon', [wx - 0.01, 0.035, 0.09], [wx + 0.01, 0.046, 0.093]);
      m.box('red', [wx - 0.01, 0.035, -0.093], [wx + 0.01, 0.046, -0.09]);
    }
  });
}

// Glass tower block: `floors` storeys of glass with paper floor bands and vertical mullions.
export function tower(m, [x0, z0, x1, z1], y0, floors, fh, { glass = 'sky', band = 'paper', mullion = 'blue', cols = 4 } = {}) {
  const top = y0 + floors * fh;
  m.box(glass, [x0, y0, z0], [x1, top, z1]);
  for (let f = 0; f <= floors; f++) {
    const y = y0 + f * fh;
    m.box(band, [x0 - 0.01, y - 0.01, z0 - 0.01], [x1 + 0.01, y + 0.015, z1 + 0.01]);
  }
  for (let i = 1; i < cols; i++) {
    const x = x0 + ((x1 - x0) * i) / cols, z = z0 + ((z1 - z0) * i) / cols;
    m.box(mullion, [x - 0.005, y0, z0 - 0.006], [x + 0.005, top, z1 + 0.006]);
    m.box(mullion, [x0 - 0.006, y0, z - 0.005], [x1 + 0.006, top, z + 0.005]);
  }
  return top;
}

// Round tower: alternating glass storeys and paper floor slabs.
export function roundTower(m, [cx, cz], r, y0, floors, fh, { glass = 'sky', band = 'paper', n = 12 } = {}) {
  for (let f = 0; f < floors; f++) {
    const y = y0 + f * fh;
    m.prism(glass, [cx, cz], r, y, y + fh, n);
    m.prism(band, [cx, cz], r + 0.012, y + fh - 0.012, y + fh + 0.012, n);
  }
  return y0 + floors * fh;
}

// Sign board facing +z with a row of "letters".
export function sign(m, x, y, z, w, h, c = 'coral', letters = 'paper') {
  m.box(c, [x - w / 2, y, z], [x + w / 2, y + h, z + 0.02]);
  const n = Math.max(2, Math.round(w / 0.05));
  for (let i = 0; i < n; i++) {
    const lx = x - w / 2 + (w * (i + 0.5)) / n;
    m.box(letters, [lx - w / n / 3, y + h * 0.25, z + 0.02], [lx + w / n / 3, y + h * 0.75, z + 0.024]);
  }
}

// Rooftop air-conditioning units.
export function hvac(m, x, z, y) {
  m.box({ sides: 'kerb', top: 'stone' }, [x - 0.04, y, z - 0.03], [x + 0.04, y + 0.04, z + 0.03]);
  m.prism('dark', [x, z], 0.018, y + 0.04, y + 0.044, 6);
}

// Café table with an umbrella and two stools.
export function cafeTable(m, x, z, c = 'coral') {
  m.prism('paper', [x, z], 0.025, G + 0.035, G + 0.04, 8);
  m.prism('dark', [x, z], 0.004, G, G + 0.035, 4);
  for (const s of [-1, 1]) m.prism(c, [x + s * 0.04, z], 0.012, G, G + 0.022, 6);
  umbrella(m, x, z, c);
}

// Striped awning across the +z face at height y, from x0 to x1.
export function awning(m, x0, x1, y, z, c1 = 'coral', c2 = 'paper', depth = 0.14) {
  const n = Math.max(2, Math.round((x1 - x0) / 0.08)), w = (x1 - x0) / n;
  for (let i = 0; i < n; i++) {
    const x = x0 + w * (i + 0.5);
    m.with({ t: [x, y, z], rx: 0.45 }, () => m.box(i % 2 ? c2 : c1, [-w / 2, -0.006, 0], [w / 2, 0.006, depth]));
  }
}

// Faceted dome: a hemisphere approximated by stacked frusta.
export function dome(m, colour, [cx, cz], r, y0, { n = 10, rings = 3, finial = 'gold' } = {}) {
  let pr = r, py = y0;
  for (let i = 1; i <= rings; i++) {
    const a = (i / rings) * (Math.PI / 2);
    const nr = i === rings ? 0 : r * Math.cos(a), ny = y0 + r * Math.sin(a);
    m.frustum(colour, [cx, cz], pr, nr, py, ny, n);
    pr = nr; py = ny;
  }
  if (finial) m.frustum(finial, [cx, cz], r * 0.08, 0, py - 0.005, py + r * 0.4, 4);
  return py;
}

export function flagpole(m, x, z, h = 0.5, c = 'coral', c2 = null, y0 = G) {
  m.prism('paper', [x, z], 0.006, y0, y0 + h, 5);
  m.box(c, [x + 0.006, y0 + h - 0.1, z - 0.003], [x + 0.12, y0 + h - (c2 ? 0.05 : 0.01), z + 0.003]);
  if (c2) m.box(c2, [x + 0.006, y0 + h - 0.05, z - 0.003], [x + 0.12, y0 + h - 0.01, z + 0.003]);
}

// Coach / city bus, facing +z before rotation.
export function bus(m, x = 0, z = 0, ry = 0, colour = 'sky', s = 1) {
  m.with({ t: [x, G, z], ry, s }, () => {
    m.box({ sides: colour, top: 'paper' }, [-0.055, 0.02, -0.19], [0.055, 0.14, 0.19]);
    m.box('glass', [-0.056, 0.075, -0.17], [0.056, 0.125, 0.17]);
    m.box('glass', [-0.05, 0.05, 0.19], [0.05, 0.125, 0.192]);
    m.box('paper', [-0.057, 0.045, -0.19], [0.057, 0.055, 0.19]);
    for (const wx of [-0.055, 0.055]) {
      for (const wz of [-0.12, 0.12]) m.with({ t: [wx, 0.022, wz], rz: Math.PI / 2 }, () => m.prism('dark', [0, 0], 0.022, -0.01, 0.01, 8, 0, 'kerb'));
    }
  });
}

// Small twin-engine airliner, nose towards +z.
export function plane(m, x = 0, z = 0, ry = 0, s = 1, livery = 'coral') {
  m.with({ t: [x, G, z], ry, s }, () => {
    m.with({ t: [0, 0.07, 0], rx: Math.PI / 2 }, () => {
      m.prism('paper', [0, 0], 0.035, -0.22, 0.2, 8);
      m.frustum('paper', [0, 0], 0.035, 0.008, 0.2, 0.27, 8);
      m.frustum('paper', [0, 0], 0.035, 0.012, -0.22, -0.3, 8);
    });
    m.box(livery, [-0.036, 0.06, -0.22], [0.036, 0.075, 0.2]);
    m.box('paper', [-0.24, 0.05, -0.04], [0.24, 0.06, 0.05]);
    m.box('paper', [-0.09, 0.08, -0.29], [0.09, 0.088, -0.25]);
    m.box(livery, [-0.006, 0.08, -0.3], [0.006, 0.17, -0.25]);
    for (const s2 of [-1, 1]) m.with({ t: [s2 * 0.1, 0.045, 0.03], rx: Math.PI / 2 }, () => m.prism('stone', [0, 0], 0.018, -0.03, 0.04, 8));
    m.prism('dark', [0, -0.02], 0.004, 0, 0.04, 4);
    for (const s2 of [-1, 1]) m.prism('dark', [s2 * 0.06, 0], 0.004, 0, 0.045, 4);
  });
}

// Paper person, about 0.1 units tall, facing +z. pose: 'stand' | 'walk' | 'wave' | 'sit'.
export function person(m, x = 0, z = 0, ry = 0, { shirt = 'coral', pants = 'navy', skin = 'sand', hair = 'dark', pose = 'stand', s = 1, y = G } = {}) {
  m.with({ t: [x, y, z], ry, s }, () => {
    const sit = pose === 'sit';
    const legH = sit ? 0.0 : 0.045;
    if (sit) {
      for (const lx of [-0.009, 0.009]) m.box(pants, [lx - 0.007, 0.02, -0.01], [lx + 0.007, 0.032, 0.025]);
      for (const lx of [-0.009, 0.009]) m.box(pants, [lx - 0.006, 0, 0.018], [lx + 0.006, 0.03, 0.028]);
    } else {
      const swing = pose === 'walk' ? 0.35 : 0;
      for (const [lx, a] of [[-0.009, swing], [0.009, -swing]]) m.with({ t: [lx, legH, 0], rx: a }, () => m.box(pants, [-0.007, -legH, -0.007], [0.007, 0, 0.007]));
    }
    const by = sit ? 0.03 : legH;
    m.box(shirt, [-0.017, by, -0.01], [0.017, by + 0.04, 0.01]);
    for (const s2 of [-1, 1]) {
      const up = pose === 'wave' && s2 > 0;
      m.with({ t: [s2 * 0.022, by + 0.037, 0], rz: up ? 2.6 * s2 : 0.12 * s2, rx: pose === 'walk' ? s2 * 0.4 : 0 }, () => m.box(shirt, [-0.005, -0.035, -0.005], [0.005, 0, 0.005]));
    }
    m.gem(skin, [0, by + 0.055, 0], 0.013, 0.015, 6);
    m.gem(hair, [0, by + 0.064, -0.003], 0.013, 0.008, 6);
  });
}

// Statue on a pedestal (stone by default, gold for monuments).
export function statue(m, x, z, { c = 'stone', base = 'kerb', s = 2.6, ry = 0 } = {}) {
  m.box({ sides: base, top: 'stone' }, [x - 0.07, G, z - 0.07], [x + 0.07, G + 0.1, z + 0.07]);
  m.box({ sides: 'stone', top: base }, [x - 0.08, G + 0.1, z - 0.08], [x + 0.08, G + 0.115, z + 0.08]);
  person(m, x, z, ry, { shirt: c, pants: c, skin: c, hair: c, pose: 'wave', s, y: G + 0.115 });
}

// Large shady tree (beringin / banyan).
export function banyan(m, x, z, s = 1) {
  m.with({ t: [x, 0, z], s }, () => {
    m.prism('bark', [0, 0], 0.05, G, 0.2, 7);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      m.prism('bark', [Math.cos(a) * 0.12, Math.sin(a) * 0.12], 0.006, G, 0.2, 4);
    }
    m.gem('pine', [0, 0.26, 0], 0.22, 0.09, 8);
    m.gem('leaf', [0.08, 0.32, 0.05], 0.14, 0.07, 7);
    m.gem('leaf', [-0.08, 0.31, -0.06], 0.14, 0.07, 7);
  });
}
