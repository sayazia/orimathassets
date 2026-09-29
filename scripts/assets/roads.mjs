import { PI, G, SW, LINE, lamp, roadPlate, sidewalk, dashesZ, zebra, plate, patch, treeRound, treePine, bush, bench, car, bus, fence } from '../lib/parts.mjs';

function roadStraight(m) {
  roadPlate(m);
  sidewalk(m, -0.5, -0.5, -0.5 + SW, 0.5);
  sidewalk(m, 0.5 - SW, -0.5, 0.5, 0.5);
  dashesZ(m);
  lamp(m, -0.5 + SW / 2, 0);
}

// Fills the region of the tile outside radius r around corner c = (+x, +z), i.e. towards (-x, -z).
function cornerFill(m, r, colour, top, y0, y1, c = [0.5, 0.5]) {
  const n = 6;
  const hit = (a) => {
    const dx = Math.cos(a), dz = Math.sin(a);
    const ts = [(-0.5 - c[0]) / dx, (-0.5 - c[1]) / dz].filter((t) => t > 0 && Number.isFinite(t));
    const t = Math.min(...ts);
    return [c[0] + dx * t, c[1] + dz * t];
  };
  for (let i = 0; i < n; i++) {
    const a0 = PI + (i / n) * (PI / 2), a1 = PI + ((i + 1) / n) * (PI / 2);
    const p = (a) => [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r];
    const pts = [p(a0), p(a1), hit(a1)];
    if (a0 < PI * 1.25 - 1e-6 && a1 > PI * 1.25 + 1e-6) pts.push([-0.5, -0.5]);
    pts.push(hit(a0));
    m.slab(colour, pts, y0, y1, top);
  }
}

const Q0 = PI, Q1 = 1.5 * PI; // quarter arc facing the (-x, -z) side of the (+x, +z) corner

function roadCorner(m) {
  // Connects the +x and +z edges, curving around the (+x, +z) corner.
  roadPlate(m);
  const c = [0.5, 0.5];
  m.arc('kerb', c, 0, SW, Q0, Q1, G, G + 0.025, 4);
  cornerFill(m, 1 - SW, 'stone', 'kerb', G, G + 0.025);
  m.arc('paper', c, 0.5 - 0.0125, 0.5 + 0.0125, Q0, Q1, G, G + LINE, 4, 0.26);
  lamp(m, -0.44, -0.44);
}

function roadT(m) {
  // Main road along z, branch to +x.
  roadPlate(m);
  sidewalk(m, -0.5, -0.5, -0.5 + SW, 0.5);
  sidewalk(m, 0.5 - SW, -0.5, 0.5, -0.5 + SW);
  sidewalk(m, 0.5 - SW, 0.5 - SW, 0.5, 0.5);
  dashesZ(m);
  m.with({ ry: PI / 2 }, () => zebra(m));
}

function roadCross(m) {
  roadPlate(m);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) sidewalk(m, Math.min(sx * 0.5, sx * (0.5 - SW)), Math.min(sz * 0.5, sz * (0.5 - SW)), Math.max(sx * 0.5, sx * (0.5 - SW)), Math.max(sz * 0.5, sz * (0.5 - SW)));
  for (let k = 0; k < 4; k++) m.with({ ry: (k * PI) / 2 }, () => zebra(m));
  lamp(m, 0.44, 0.44);
  lamp(m, -0.44, -0.44);
}


function roadCrosswalk(m) {
  roadPlate(m);
  sidewalk(m, -0.5, -0.5, -0.5 + SW, 0.5);
  sidewalk(m, 0.5 - SW, -0.5, 0.5, 0.5);
  dashesZ(m, -0.5, -0.2);
  dashesZ(m, 0.2, 0.5);
  for (let z = -0.13; z <= 0.131; z += 0.065) m.box('paper', [-0.36, G, z - 0.022], [0.36, G + LINE, z + 0.022]);
  // pedestrian signal poles
  for (const [x, z] of [[-0.44, -0.18], [0.44, 0.18]]) {
    m.prism('dark', [x, z], 0.008, G + 0.025, 0.26, 5);
    m.box('dark', [x - 0.018, 0.2, z - 0.015], [x + 0.018, 0.27, z + 0.015]);
    m.gem('coral', [x, 0.25, z + (z < 0 ? 0.016 : -0.016)], 0.01, 0.01, 4);
    m.gem('leaf', [x, 0.22, z + (z < 0 ? 0.016 : -0.016)], 0.01, 0.01, 4);
  }
}

function roadEnd(m) {
  // Dead end: road enters from +z and finishes in a turning circle.
  plate(m, 'grass');
  m.box({ top: 'asphalt', sides: 'dark' }, [-0.38, G, 0], [0.38, G + 0.004, 0.5]);
  m.prism('asphalt', [0, -0.05], 0.4, G, G + 0.004, 16, 0, 'asphalt');
  m.box({ top: 'kerb', sides: 'stone' }, [-0.5, G, 0.1], [-0.38, G + 0.025, 0.5]);
  m.box({ top: 'kerb', sides: 'stone' }, [0.38, G, 0.1], [0.5, G + 0.025, 0.5]);
  m.arc('kerb', [0, -0.05], 0.4, 0.46, 0.5 * PI + 1.1, 2.5 * PI - 1.1, G, G + 0.025, 12);
  m.prism('grass', [0, -0.05], 0.12, G, G + 0.03, 10, 0, 'grass');
  treeRound(m, 0, -0.05, 0.8);
  dashesZ(m, 0.3, 0.5);
  lamp(m, 0.44, 0.3);
  for (const x of [-0.4, 0.4]) bush(m, x, -0.42, 0.04, 'leaf', 'pink');
}

function roundabout(m) {
  roadPlate(m);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x0 = Math.min(sx * 0.5, sx * (0.5 - SW)), x1 = Math.max(sx * 0.5, sx * (0.5 - SW));
    const z0 = Math.min(sz * 0.5, sz * (0.5 - SW)), z1 = Math.max(sz * 0.5, sz * (0.5 - SW));
    sidewalk(m, x0, z0, x1, z1);
  }
  m.prism('kerb', [0, 0], 0.2, G, G + 0.025, 14, 0, 'grass');
  m.arc('paper', [0, 0], 0.3, 0.315, 0, 2 * PI, G, G + LINE, 12, 0.18);
  m.prism('stone', [0, 0], 0.07, G + 0.025, G + 0.08, 8, 0, 'kerb');
  m.with({ t: [0, G + 0.08, 0] }, () => {
    m.frustum('gold', [0, 0], 0.03, 0.02, 0, 0.12, 6);
    m.gem('gold', [0, 0.15, 0], 0.035, 0.035, 5);
  });
  for (const [x, z] of [[0.13, 0.08], [-0.12, -0.1], [-0.08, 0.13]]) bush(m, x, z, 0.03, 'leaf', 'sunflower');
}

// ---------------------------------------------------------------- footpaths (along z)

function pathBase(m) {
  plate(m, 'grass');
}
function pathZ(m, z0 = -0.5, z1 = 0.5) {
  patch(m, 'sand', -0.1, z0, 0.1, z1, 0.006, 'bark');
  for (let z = z0 + 0.04; z < z1; z += 0.12) {
    m.box({ top: 'kerb', sides: 'stone' }, [-0.06, G + 0.006, z], [-0.01, G + 0.01, z + 0.05]);
    m.box({ top: 'kerb', sides: 'stone' }, [0.01, G + 0.006, z + 0.05], [0.06, G + 0.01, z + 0.1]);
  }
}
function pathStraight(m) {
  pathBase(m);
  pathZ(m);
  bench(m, -0.2, 0.1, PI / 2);
  lamp(m, 0.2, -0.2);
  bush(m, 0.3, 0.3, 0.05, 'leaf', 'pink');
  treeRound(m, -0.34, -0.3, 0.8);
}
function pathCorner(m) {
  pathBase(m);
  m.arc('sand', [0.5, 0.5], 0.4, 0.6, Q0, Q1, G, G + 0.006, 6);
  for (let i = 0; i < 6; i++) {
    const a = Q0 + ((i + 0.5) / 6) * (PI / 2);
    m.with({ t: [0.5 + Math.cos(a) * 0.5, 0, 0.5 + Math.sin(a) * 0.5], ry: -a }, () => m.box({ top: 'kerb', sides: 'stone' }, [-0.025, G + 0.006, -0.03], [0.025, G + 0.01, 0.03]));
  }
  treeRound(m, -0.3, -0.3, 1);
  bush(m, 0.36, 0.36, 0.05, 'leaf', 'sunflower');
  lamp(m, 0.05, 0.05);
}
function pathT(m) {
  pathBase(m);
  pathZ(m);
  m.with({ ry: PI / 2 }, () => pathZ(m, 0.1, 0.5));
  bench(m, -0.2, 0.25, PI / 2);
  treePine(m, 0.3, -0.3, 0.9);
  bush(m, -0.3, -0.3, 0.05, 'leaf', 'lavender');
}
function pathCross(m) {
  pathBase(m);
  pathZ(m);
  m.with({ ry: PI / 2 }, () => { pathZ(m, -0.5, -0.1); pathZ(m, 0.1, 0.5); });
  m.prism('sand', [0, 0], 0.14, G, G + 0.008, 10, 0, 'sand');
  m.prism('stone', [0, 0], 0.05, G + 0.008, G + 0.1, 6, 0, 'kerb');
  m.gem('gold', [0, G + 0.12, 0], 0.025, 0.025, 5);
  for (const [x, z] of [[0.3, 0.3], [-0.3, -0.3]]) treeRound(m, x, z, 0.8, x > 0 ? 'grass' : 'leaf');
  for (const [x, z] of [[-0.3, 0.3], [0.3, -0.3]]) bush(m, x, z, 0.05, 'leaf', 'coral');
}

// ---------------------------------------------------------------- dirt roads (along z)

function dirtZ(m) {
  patch(m, 'sand', -0.22, -0.5, 0.22, 0.5, 0.006, 'bark');
  for (const x of [-0.1, 0.1]) patch(m, 'straw', x - 0.035, -0.5, x + 0.035, 0.5, 0.008, 'sand');
}
function dirtStraight(m) {
  plate(m, 'grass');
  dirtZ(m);
  fence(m, -0.3, -0.46, -0.3, 0.46, 8);
  for (const z of [-0.3, 0.1, 0.35]) m.frustum('leaf', [0.35, z], 0.02, 0, G, G + 0.06, 4);
  treeRound(m, 0.38, -0.1, 0.8, 'grass');
}
function dirtCorner(m) {
  plate(m, 'grass');
  m.arc('sand', [0.5, 0.5], 0.28, 0.72, Q0, Q1, G, G + 0.006, 8);
  for (const r of [0.4, 0.6]) m.arc('straw', [0.5, 0.5], r - 0.035, r + 0.035, Q0, Q1, G, G + 0.008, 8);
  treeRound(m, -0.3, -0.3, 0.9);
  bush(m, 0.4, 0.4, 0.05, 'leaf', 'sunflower');
  m.gem('stone', [-0.38, G + 0.02, 0.3], 0.04, 0.025, 5);
}

// ---------------------------------------------------------------- avenue: 4 lanes with a planted median (along z)

const ASW = 0.06; // avenue sidewalk
function avenueMedianZ(m, z0 = -0.5, z1 = 0.5, trees = true) {
  m.box({ top: 'grass', sides: 'kerb' }, [-0.04, G, z0], [0.04, G + 0.025, z1]);
  if (trees) for (let z = -0.25; z <= 0.25; z += 0.5) if (z > z0 && z < z1) treeRound(m, 0, z, 0.6, 'grass');
}
function laneDashesZ(m, z0 = -0.5, z1 = 0.5) {
  for (const x of [-0.25, 0.25]) {
    for (let c = -0.375; c <= 0.375; c += 0.25) {
      if (c - 0.06 < z0 || c + 0.06 > z1) continue;
      m.box('paper', [x - 0.008, G, c - 0.06], [x + 0.008, G + LINE, c + 0.06]);
    }
  }
}
function avenueStraight(m) {
  roadPlate(m);
  sidewalk(m, -0.5, -0.5, -0.5 + ASW, 0.5);
  sidewalk(m, 0.5 - ASW, -0.5, 0.5, 0.5);
  avenueMedianZ(m);
  laneDashesZ(m);
  car(m, -0.14, 0.2, PI, 'sky');
  car(m, 0.33, -0.15, 0, 'sunflower');
}
function avenueCorner(m) {
  roadPlate(m);
  const c = [0.5, 0.5];
  m.arc('kerb', c, 0, ASW, Q0, Q1, G, G + 0.025, 4);
  cornerFill(m, 1 - ASW, 'stone', 'kerb', G, G + 0.025);
  m.arc('kerb', c, 0.46, 0.54, Q0, Q1, G, G + 0.025, 8);
  m.arc('grass', c, 0.47, 0.53, Q0, Q1, G + 0.025, G + 0.027, 8);
  for (const r of [0.25, 0.75]) m.arc('paper', c, r - 0.008, r + 0.008, Q0, Q1, G, G + LINE, r > 0.5 ? 6 : 4, 0.2);
}
function avenueJunctionCorners(m) {
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x0 = Math.min(sx * 0.5, sx * (0.5 - ASW)), x1 = Math.max(sx * 0.5, sx * (0.5 - ASW));
    const z0 = Math.min(sz * 0.5, sz * (0.5 - ASW)), z1 = Math.max(sz * 0.5, sz * (0.5 - ASW));
    sidewalk(m, x0, z0, x1, z1);
  }
}
function avenueZebra(m) {
  for (let x = -0.4; x <= 0.401; x += 0.08) if (Math.abs(x) > 0.05) m.box('paper', [x - 0.022, G, 0.4], [x + 0.022, G + LINE, 0.48]);
  avenueMedianZ(m, 0.4, 0.5, false);
}
function avenueT(m) {
  roadPlate(m);
  sidewalk(m, -0.5, -0.5, -0.5 + ASW, 0.5);
  sidewalk(m, 0.5 - ASW, -0.5, 0.5, -0.5 + ASW);
  sidewalk(m, 0.5 - ASW, 0.5 - ASW, 0.5, 0.5);
  avenueMedianZ(m, -0.5, -0.4, false);
  avenueMedianZ(m, 0.4, 0.5, false);
  m.with({ ry: PI / 2 }, () => avenueZebra(m));
  for (const x of [-0.25, 0.25]) m.box('paper', [x - 0.008, G, -0.5], [x + 0.008, G + LINE, -0.4]);
  // traffic light
  m.prism('dark', [-0.47, 0.3], 0.01, G + 0.025, 0.36, 5);
  m.box('dark', [-0.47, 0.34, 0.29], [-0.2, 0.355, 0.31]);
  m.box('dark', [-0.24, 0.26, 0.3], [-0.2, 0.36, 0.33]);
  for (const [y, c] of [[0.34, 'red'], [0.31, 'sunflower'], [0.28, 'leaf']]) m.gem(c, [-0.22, y, 0.334], 0.01, 0.01, 4);
}
function avenueCross(m) {
  roadPlate(m);
  avenueJunctionCorners(m);
  for (let k = 0; k < 4; k++) m.with({ ry: (k * PI) / 2 }, () => avenueZebra(m));
  m.prism('stone', [0, 0], 0.06, G, G + 0.02, 8, 0, 'kerb');
  m.prism('paper', [0, 0], 0.012, G + 0.02, 0.2, 5);
  m.box('coral', [-0.03, 0.2, -0.03], [0.03, 0.26, 0.03]);
  bus(m, -0.25, -0.15, PI, 'sunflower', 0.9);
  car(m, 0.14, 0.15, 0, 'mint');
}

// ---------------------------------------------------------------- elevated highway (along z)

const HY = 0.34; // deck height
function highwayDeckZ(m, z0 = -0.5, z1 = 0.5) {
  m.box({ top: 'asphalt', sides: 'kerb' }, [-0.42, HY - 0.05, z0], [0.42, HY, z1]);
  for (const x of [-0.42, 0.42]) m.box({ top: 'paper', sides: 'kerb' }, [x - 0.015, HY, z0], [x + 0.015, HY + 0.04, z1]);
  m.box({ top: 'paper', sides: 'kerb' }, [-0.015, HY, z0], [0.015, HY + 0.03, z1]);
  for (const x of [-0.21, 0.21]) {
    for (let c = -0.375; c <= 0.375; c += 0.25) if (c > z0 && c < z1) m.box('paper', [x - 0.008, HY, c - 0.06], [x + 0.008, HY + LINE, c + 0.06]);
  }
  for (const x of [-0.39, 0.39]) m.box('sunflower', [x - 0.004, HY, z0], [x + 0.004, HY + LINE, z1]);
}
function pillar(m, x, z) {
  m.box({ top: 'kerb', sides: 'stone' }, [x - 0.05, G, z - 0.05], [x + 0.05, HY - 0.09, z + 0.05]);
  m.box({ top: 'kerb', sides: 'stone' }, [x - 0.3, HY - 0.09, z - 0.05], [x + 0.3, HY - 0.05, z + 0.05]);
}
function highwayStraight(m) {
  plate(m, 'grass');
  pillar(m, 0, 0);
  highwayDeckZ(m);
  m.with({ t: [0, HY - G, 0] }, () => {
    car(m, -0.3, -0.1, PI, 'sky');
    car(m, 0.1, 0.25, 0, 'sunflower');
    bus(m, 0.3, -0.2, 0, 'mint', 0.9);
  });
  for (const [x, z] of [[-0.4, 0.3], [0.4, -0.3]]) bush(m, x, z, 0.05, 'leaf');
}
function highwayCorner(m) {
  plate(m, 'grass');
  const c = [0.5, 0.5];
  m.arc({ top: 'asphalt' }.top, c, 0.08, 0.92, Q0, Q1, HY - 0.05, HY, 8);
  m.arc('paper', c, 0.065, 0.095, Q0, Q1, HY - 0.05, HY + 0.04, 8);
  m.arc('paper', c, 0.905, 0.935, Q0, Q1, HY - 0.05, HY + 0.04, 8);
  m.arc('paper', c, 0.485, 0.515, Q0, Q1, HY, HY + 0.03, 8);
  for (const r of [0.29, 0.71]) m.arc('paper', c, r - 0.008, r + 0.008, Q0, Q1, HY, HY + LINE, r > 0.5 ? 6 : 4, 0.18);
  const a = 1.25 * PI;
  m.with({ t: [0.5 + Math.cos(a) * 0.5, 0, 0.5 + Math.sin(a) * 0.5], ry: -a + PI / 2 }, () => pillar(m, 0, 0));
  treeRound(m, 0.35, 0.35, 0.7);
  bush(m, -0.4, -0.4, 0.05);
}
function highwayRamp(m) {
  // Rises from ground level at +z to deck height at -z.
  plate(m, 'grass');
  const drop = HY - G;
  m.with({}, () => {
    const v = [[-0.42, G, 0.5], [0.42, G, 0.5], [0.42, HY, -0.5], [-0.42, HY, -0.5], [-0.42, G, -0.5], [0.42, G, -0.5]];
    m.solid(v, [
      { c: 'asphalt', v: [0, 1, 2, 3] }, { c: 'kerb', v: [3, 2, 5, 4] }, { c: 'stone', v: [0, 1, 5, 4] },
      { c: 'stone', v: [0, 3, 4] }, { c: 'stone', v: [1, 2, 5] },
    ]);
  });
  for (const x of [-0.42, 0.42]) {
    const v = [[x - 0.015, G, 0.5], [x + 0.015, G, 0.5], [x + 0.015, HY, -0.5], [x - 0.015, HY, -0.5], [x - 0.015, HY + 0.04, -0.5], [x + 0.015, HY + 0.04, -0.5], [x + 0.015, G + 0.04, 0.5], [x - 0.015, G + 0.04, 0.5]];
    m.solid(v, [
      { c: 'paper', v: [0, 1, 2, 3] }, { c: 'paper', v: [7, 6, 5, 4] }, { c: 'kerb', v: [0, 1, 6, 7] }, { c: 'kerb', v: [3, 2, 5, 4] },
      { c: 'kerb', v: [0, 3, 4, 7] }, { c: 'kerb', v: [1, 2, 5, 6] },
    ]);
  }
  const slope = Math.atan2(drop, 1);
  m.with({ t: [0, (G + HY) / 2, 0], rx: slope }, () => {
    for (const x of [-0.21, 0.21]) for (let c = -0.375; c <= 0.375; c += 0.25) m.box('paper', [x - 0.008, 0, c - 0.06], [x + 0.008, 0.004, c + 0.06]);
  });
}
function highwayOverRoad(m) {
  roadPlate(m);
  m.with({ ry: PI / 2 }, () => {
    sidewalk(m, -0.5, -0.5, -0.5 + SW, 0.5);
    sidewalk(m, 0.5 - SW, -0.5, 0.5, 0.5);
    dashesZ(m);
  });
  for (const x of [-0.46, 0.46]) m.box({ top: 'kerb', sides: 'stone' }, [x - 0.04, G + 0.025, -0.05], [x + 0.04, HY - 0.05, 0.05]);
  highwayDeckZ(m);
  car(m, 0.1, 0.19, PI / 2, 'coral');
  m.with({ t: [0, HY - G, 0] }, () => car(m, 0.3, 0.1, 0, 'blue'));
}

// ---------------------------------------------------------------- bridge and rail

function bridge(m) {
  // Road along z crossing a river that runs along x.
  plate(m, 'grass');
  m.box({ top: 'water', sides: 'blue' }, [-0.5, G, -0.28], [0.5, G + 0.004, 0.28]);
  for (const s of [-1, 1]) m.box({ top: 'sand', sides: 'bark' }, [-0.5, G, s * 0.28 - (s > 0 ? 0 : 0.05)], [0.5, G + 0.01, s * 0.28 + (s > 0 ? 0.05 : 0)]);
  m.box({ top: 'asphalt', sides: 'kerb' }, [-0.32, 0.1, -0.3], [0.32, 0.13, 0.3]);
  for (const s of [-1, 1]) {
    const v = [[-0.32, G, s * 0.5], [0.32, G, s * 0.5], [0.32, G + 0.03, s * 0.5], [-0.32, G + 0.03, s * 0.5], [-0.32, G, s * 0.3], [0.32, G, s * 0.3], [0.32, 0.13, s * 0.3], [-0.32, 0.13, s * 0.3]];
    m.solid(v, [
      { c: 'kerb', v: [0, 1, 5, 4] }, { c: 'asphalt', v: [3, 2, 6, 7] }, { c: 'kerb', v: [0, 1, 2, 3] },
      { c: 'kerb', v: [4, 5, 6, 7] }, { c: 'kerb', v: [0, 4, 7, 3] }, { c: 'kerb', v: [1, 5, 6, 2] },
    ]);
  }
  for (const x of [-0.24, 0.24]) m.box({ top: 'kerb', sides: 'stone' }, [x - 0.04, G, -0.04], [x + 0.04, 0.1, 0.04]);
  for (const x of [-0.32, 0.32]) {
    m.box('coral', [x - 0.01, 0.13, -0.33], [x + 0.01, 0.2, 0.33]);
    for (let z = -0.3; z <= 0.31; z += 0.1) m.box('coral', [x - 0.012, 0.13, z - 0.01], [x + 0.012, 0.22, z + 0.01]);
    for (const s of [-1, 1]) m.beam('coral', [x, 0.2, s * 0.3], [x, G + 0.09, s * 0.5], 0.02);
  }
  for (let c = -0.375; c <= 0.375; c += 0.25) if (Math.abs(c) < 0.3) m.box('paper', [-0.0125, 0.13, c - 0.06], [0.0125, 0.13 + LINE, c + 0.06]);
  m.with({ t: [0.3, G + 0.004, 0.1] }, () => {
    m.box('wood', [-0.06, 0, -0.025], [0.06, 0.02, 0.025]);
    m.box('paper', [-0.005, 0.02, -0.005], [0.005, 0.08, 0.005]);
  });
}
function railBedZ(m, z0 = -0.5, z1 = 0.5) {
  m.box({ top: 'stone', sides: 'dark' }, [-0.2, G, z0], [0.2, G + 0.012, z1]);
  for (let z = z0 + 0.02; z < z1 - 0.01; z += 0.07) m.box('bark', [-0.16, G + 0.012, z], [0.16, G + 0.02, z + 0.03]);
  for (const x of [-0.08, 0.08]) m.box('dark', [x - 0.007, G + 0.02, z0], [x + 0.007, G + 0.032, z1]);
}
function railStraight(m) {
  plate(m, 'grass');
  railBedZ(m);
  for (let z = -0.4; z < 0.5; z += 0.4) m.box('dark', [0.3, G, z - 0.005], [0.31, 0.3, z + 0.005]);
  m.box('dark', [0.305 - 0.001, 0.28, -0.5], [0.305 + 0.001, 0.282, 0.5]);
  bush(m, -0.36, 0.2, 0.05);
}
function railCorner(m) {
  plate(m, 'grass');
  const c = [0.5, 0.5];
  m.arc('stone', c, 0.3, 0.7, Q0, Q1, G, G + 0.012, 8);
  for (let i = 0; i < 12; i++) {
    const a = Q0 + ((i + 0.5) / 12) * (PI / 2);
    m.with({ t: [0.5 + Math.cos(a) * 0.5, 0, 0.5 + Math.sin(a) * 0.5], ry: -a }, () => m.box('bark', [-0.16, G + 0.012, -0.015], [0.16, G + 0.02, 0.015]));
  }
  for (const r of [0.42, 0.58]) m.arc('dark', c, r - 0.007, r + 0.007, Q0, Q1, G + 0.02, G + 0.032, 10);
  treeRound(m, -0.3, -0.3, 0.9);
}
function railCrossing(m) {
  // Rail along z crossing a road along x, with boom barriers.
  roadPlate(m);
  m.with({ ry: PI / 2 }, () => {
    sidewalk(m, -0.5, -0.5, -0.5 + SW, 0.5);
    sidewalk(m, 0.5 - SW, -0.5, 0.5, 0.5);
    dashesZ(m, -0.5, -0.25);
    dashesZ(m, 0.25, 0.5);
  });
  railBedZ(m, -0.5, 0.5);
  for (const [x, z, s] of [[-0.3, -0.42, 1], [0.3, 0.42, -1]]) {
    m.box({ sides: 'paper', top: 'dark' }, [x - 0.02, G + 0.025, z - 0.02], [x + 0.02, 0.14, z + 0.02]);
    m.gem('red', [x, 0.16, z], 0.015, 0.015, 4);
    for (let i = 0; i < 5; i++) m.box(i % 2 ? 'paper' : 'red', [x + s * (0.02 + i * 0.07), 0.12, z - 0.008], [x + s * (0.09 + i * 0.07), 0.135, z + 0.008]);
  }
  for (const [x, z] of [[-0.44, -0.2], [0.44, 0.2]]) {
    m.prism('dark', [x, z], 0.006, G + 0.025, 0.22, 4);
    m.with({ t: [x, 0.2, z], ry: PI / 4 }, () => {
      m.box('paper', [-0.05, -0.008, -0.004], [0.05, 0.008, 0.004]);
    });
    m.with({ t: [x, 0.2, z], ry: -PI / 4 }, () => m.box('paper', [-0.05, -0.008, -0.004], [0.05, 0.008, 0.004]));
  }
}

function parkingLot(m) {
  plate(m, 'stone', 'dark');
  m.box({ top: 'asphalt', sides: 'dark' }, [-0.46, G, -0.46], [0.46, G + 0.004, 0.46]);
  for (const zr of [[-0.44, -0.2], [0.2, 0.44]]) for (let x = -0.44; x <= 0.441; x += 0.147) m.box('paper', [x - 0.005, G + 0.004, zr[0]], [x + 0.005, G + 0.008, zr[1]]);
  for (const z of [-0.2, 0.2]) m.box('paper', [-0.44, G + 0.004, z - 0.005], [0.44, G + 0.008, z + 0.005]);
  const cols = ['coral', 'sky', 'sunflower', 'mint', 'paper', 'lavender'];
  const spots = [[-0.37, -0.32, 0], [-0.07, -0.32, 0], [0.37, -0.32, 0], [-0.22, 0.32, PI], [0.22, 0.32, PI], [0.07, 0.32, PI]];
  spots.forEach(([x, z, ry], i) => car(m, x, z, ry, cols[i]));
  for (const x of [-0.5, 0.5]) lamp(m, x * 0.94, 0);
  m.box({ top: 'kerb', sides: 'stone' }, [-0.1, G, -0.02], [0.1, G + 0.025, 0.02]);
  m.box('blue', [0.1, G, -0.02], [0.15, 0.16, 0.02]);
  m.box('paper', [0.11, 0.1, 0.02], [0.14, 0.14, 0.022]);
}

export default [
  { name: 'road_straight', footprint: [1, 1], build: roadStraight },
  { name: 'road_corner', footprint: [1, 1], build: roadCorner },
  { name: 'road_t', footprint: [1, 1], build: roadT },
  { name: 'road_cross', footprint: [1, 1], build: roadCross },
  { name: 'road_crosswalk', footprint: [1, 1], build: roadCrosswalk },
  { name: 'road_end', footprint: [1, 1], build: roadEnd },
  { name: 'road_roundabout', footprint: [1, 1], build: roundabout },
  { name: 'path_straight', footprint: [1, 1], build: pathStraight },
  { name: 'path_corner', footprint: [1, 1], build: pathCorner },
  { name: 'path_t', footprint: [1, 1], build: pathT },
  { name: 'path_cross', footprint: [1, 1], build: pathCross },
  { name: 'road_dirt_straight', footprint: [1, 1], build: dirtStraight },
  { name: 'road_dirt_corner', footprint: [1, 1], build: dirtCorner },
  { name: 'avenue_straight', footprint: [1, 1], build: avenueStraight },
  { name: 'avenue_corner', footprint: [1, 1], build: avenueCorner },
  { name: 'avenue_t', footprint: [1, 1], build: avenueT },
  { name: 'avenue_cross', footprint: [1, 1], build: avenueCross },
  { name: 'highway_straight', footprint: [1, 1], build: highwayStraight },
  { name: 'highway_corner', footprint: [1, 1], build: highwayCorner },
  { name: 'highway_ramp', footprint: [1, 1], build: highwayRamp },
  { name: 'highway_over_road', footprint: [1, 1], build: highwayOverRoad },
  { name: 'bridge_road', footprint: [1, 1], build: bridge },
  { name: 'rail_straight', footprint: [1, 1], build: railStraight },
  { name: 'rail_corner', footprint: [1, 1], build: railCorner },
  { name: 'rail_crossing', footprint: [1, 1], build: railCrossing },
  { name: 'parking_lot', footprint: [1, 1], build: parkingLot },
];
