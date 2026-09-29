// B6: Fold Town skill buildings (three tiers each) and the town page. Measured in city TILES like
// the rest of the city set: authored with 1000 units per tile. Each tier is a complete building.
import { plate } from '../lib/origami.mjs';

const T = 1000; // units per tile
const G = 40; // ground plate thickness (0.04 tile, same as the city set)
const both = (f) => { f(1); f(-1); };

function ground(node, w, d) {
  node.mesh((m) => m.box({ top: 'grass', sides: 'leaf' }, [-w * T / 2, 0, -d * T / 2], [w * T / 2, G, d * T / 2]));
}
function tileRig(rig) {
  rig.outline = 20; // 0.6 mm on the book page, where a tile is 3 cm
}

// ------------------------------------------------------------------ fraction bridge (2 x 1, teal)
function fractionBridge(tier) {
  return (rig) => {
    tileRig(rig);
    const base = rig.root.add('base', [0, 0, 0]);
    base.mesh((m) => both((s) => m.box({ top: 'grass', sides: 'leaf' }, [s > 0 ? 350 : -1000, 0, -500], [s > 0 ? 1000 : -350, G, 500]))); // two banks
    base.mesh((m) => m.box('paper', [-350, 0, -500], [350, 12, 500])); // pale paper stream bed between the banks
    const M = 'teal*';
    if (tier === 1) {
      rig.root.add('grow_deck', [0, G, 0]).mesh((m) => {
        m.box(M, [-520, G + 40, -110], [520, G + 70, 110]);
        both((s) => m.box(M, [s * 300 - 30, 0, -100], [s * 300 + 30, G + 40, 100]));
      });
      rig.root.add('grow_rails', [0, G + 70, 0]).mesh((m) => both((z) => {
        m.box('paper', [-500, G + 150, z * 100 - 12], [500, G + 175, z * 100 + 12]);
        for (let x = -450; x <= 450; x += 150) m.box('paper', [x - 12, G + 70, z * 100 - 12], [x + 12, G + 150, z * 100 + 12]);
      }));
    } else if (tier === 2) {
      rig.root.add('grow_arch', [0, G, 0]).mesh((m) => {
        const pts = [...Array(9).keys()].map((i) => { const a = Math.PI * (i / 8); return [-Math.cos(a) * 420, G + Math.sin(a) * 200]; });
        for (let i = 0; i < 8; i++) both((z) => m.hull(M, [[pts[i][0], pts[i][1], z * 120 - 25], [pts[i + 1][0], pts[i + 1][1], z * 120 - 25], [pts[i][0], pts[i][1] + 45, z * 120 - 25], [pts[i + 1][0], pts[i + 1][1] + 45, z * 120 - 25], [pts[i][0], pts[i][1], z * 120 + 25], [pts[i + 1][0], pts[i + 1][1], z * 120 + 25], [pts[i][0], pts[i][1] + 45, z * 120 + 25], [pts[i + 1][0], pts[i + 1][1] + 45, z * 120 + 25]]));
      });
      rig.root.add('grow_deck', [0, G + 200, 0]).mesh((m) => {
        m.box(M, [-700, G + 245, -130], [700, G + 280, 130]);
        both((s) => m.hull(M, [[s * 700, G, -130], [s * 700, G, 130], [s * 460, G, -130], [s * 460, G, 130], [s * 700, G + 245, -130], [s * 700, G + 245, 130], [s * 480, G + 245, -130], [s * 480, G + 245, 130]]));
      });
      rig.root.add('grow_rails', [0, G + 280, 0]).mesh((m) => both((z) => {
        m.box('paper', [-680, G + 370, z * 115 - 12], [680, G + 395, z * 115 + 12]);
        for (let x = -640; x <= 640; x += 160) m.box('paper', [x - 12, G + 280, z * 115 - 12], [x + 12, G + 370, z * 115 + 12]);
      }));
    } else {
      rig.root.add('grow_towers', [0, G, 0]).mesh((m) => both((s) => {
        for (const z of [-1, 1]) m.box(M, [s * 520 - 45, G, z * 160 - 45], [s * 520 + 45, G + 700, z * 160 + 45]);
        m.box(M, [s * 520 - 45, G + 560, -200], [s * 520 + 45, G + 620, 200]); // cross beam
        for (const z of [-1, 1]) m.hull(M, [[s * 520 - 50, G + 700, z * 160 - 50], [s * 520 + 50, G + 700, z * 160 - 50], [s * 520 - 50, G + 700, z * 160 + 50], [s * 520 + 50, G + 700, z * 160 + 50], [s * 520, G + 800, z * 160]]); // folded caps
      }));
      rig.root.add('grow_deck', [0, G + 250, 0]).mesh((m) => {
        m.box(M, [-950, G + 230, -140], [950, G + 270, 140]);
        both((s) => m.box(M, [Math.min(s * 950, s * 870), G, -140], [Math.max(s * 950, s * 870), G + 230, 140])); // abutments
      });
      rig.root.add('grow_cables', [0, G + 700, 0]).mesh((m) => {
        for (const z of [-1, 1]) {
          const cz = z * 160;
          const curve = (x0, x1, y0, y1, sag) => [...Array(7).keys()].map((i) => { const t = i / 6; return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - sag * 4 * t * (1 - t), cz]; });
          for (const c of [curve(-520, 520, G + 690, G + 690, 380), curve(-950, -520, G + 280, G + 690, -60), curve(520, 950, G + 690, G + 280, -60)]) for (let i = 0; i < c.length - 1; i++) m.beam('paper', c[i], c[i + 1], 22);
          for (let x = -390; x <= 390; x += 130) { const t = (x + 520) / 1040; m.beam('paper', [x, G + 270, cz], [x, G + 690 - 380 * 4 * t * (1 - t), cz], 14); } // hangers
        }
      });
    }
  };
}

// ------------------------------------------------------------------ multiply tower (1 x 1, cobalt)
function multiplyTower(tier) {
  return (rig) => {
    tileRig(rig);
    ground(rig.root.add('base', [0, 0, 0]), 1, 1);
    const floors = [2, 4, 6][tier - 1], H = 170, M = 'cobalt*';
    let y = G;
    for (let f = 0; f < floors; f++) {
      const w = 300 - f * (tier === 3 ? 18 : 12);
      rig.root.add(`floor_${f + 1}`, [0, y, 0]).mesh((m) => {
        m.box(M, [-w, y, -w], [w, y + H - 20, w]);
        m.box('paper', [-w - 15, y + H - 20, -w - 15], [w + 15, y + H, w + 15]); // folded ledge
        for (const [dx, dz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) for (const u of [-w * 0.5, w * 0.5]) {
          const cx = dx ? dx * (w + 4) : u, cz = dz ? dz * (w + 4) : u;
          m.box('paper', [cx - (dx ? 6 : 55), y + 40, cz - (dz ? 6 : 55)], [cx + (dx ? 6 : 55), y + 120, cz + (dz ? 6 : 55)]); // windows
        }
      });
      y += H;
    }
    rig.root.add('roof', [0, y, 0]).mesh((m) => {
      const w = 300 - floors * (tier === 3 ? 18 : 12) + 30;
      m.hip(M, [-w, y, -w], [w, y + 160 + tier * 40, w]);
      if (tier === 3) { m.prism('paper', [0, 0], 14, y + 280, y + 480, 4); m.hull('paper', [[-45, y + 480, 0], [45, y + 480, 0], [0, y + 560, 0], [0, y + 480, 45], [0, y + 480, -45]]); }
    });
  };
}

// ------------------------------------------------------------------ place-value hall (2 x 1, coral)
function placeValueHall(tier) {
  return (rig) => {
    tileRig(rig);
    ground(rig.root.add('base', [0, 0, 0]), 2, 1);
    const M = 'coral*';
    const block = (name, x0, x1, h, cols, ped) => rig.root.add(name, [(x0 + x1) / 2, G, 0]).mesh((m) => {
      m.box('paper', [x0 - 20, G, -300], [x1 + 20, G + 50, 260]);
      m.box(M, [x0 + 30, G + 50, -270], [x1 - 30, G + 50 + h, 150]);
      const step = (x1 - x0 - 80) / (cols - 1);
      for (let i = 0; i < cols; i++) m.prism('paper', [x0 + 40 + i * step, 210], 24, G + 50, G + 50 + h, 6);
      m.box('paper', [x0, G + 50 + h, -290], [x1, G + 90 + h, 250]);
      // pediment: triangular gable end facing the player (ridge along z)
      m.gableZ(M, 'paper', [x0, G + 90 + h, -290], [x1, G + 90 + h + ped, 250]);
    });
    if (tier === 1) block('wing_center', -300, 300, 260, 4, 140);
    if (tier >= 2) {
      block('wing_center', -320, 320, tier === 3 ? 380 : 320, 4, 170);
      block('wing_left', -900, -380, 240, 3, 110);
      block('wing_right', 380, 900, 240, 3, 110);
    }
    if (tier === 3) rig.root.add('wing_dome', [0, G + 640, -60]).mesh((m) => {
      m.prism(M, [0, -60], 170, G + 640, G + 700, 8, Math.PI / 8);
      m.frustum(M, [0, -60], 170, 110, G + 700, G + 820, 8, Math.PI / 8);
      m.frustum(M, [0, -60], 110, 0, G + 820, G + 900, 8, Math.PI / 8);
      m.hull('paper', [[-25, G + 900, -60], [25, G + 900, -60], [0, G + 1000, -60], [0, G + 900, -35], [0, G + 900, -85]]);
    });
  };
}

// ------------------------------------------------------------------ decimal market (2 x 1, sunflower)
function stall(m, x, z, w = 260) {
  const M = 'sunflower*';
  m.box('paper', [x - w / 2, G, z - 90], [x + w / 2, G + 110, z + 90]); // counter
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) m.box('paper', [x + sx * (w / 2 - 12) - 10, G, z + sz * 80 - 10], [x + sx * (w / 2 - 12) + 10, G + 260, z + sz * 80 + 10]);
  // striped folded awning: alternate sunflower and paper panels
  const n = 4, pw = w / n;
  for (let i = 0; i < n; i++) m.gableZ(i % 2 ? 'paper' : M, i % 2 ? 'paper' : M, [x - w / 2 + i * pw - (i === 0 ? 20 : 0), G + 260, z - 120], [x - w / 2 + (i + 1) * pw + (i === n - 1 ? 20 : 0), G + 360, z + 120]);
  m.box(M, [x - w / 2 + 25, G + 110, z + 30], [x - w / 2 + 85, G + 150, z + 80]); // produce crates
  m.box('sunflower_shade', [x + w / 2 - 85, G + 110, z + 30], [x + w / 2 - 25, G + 140, z + 80]);
}
function decimalMarket(tier) {
  return (rig) => {
    tileRig(rig);
    ground(rig.root.add('base', [0, 0, 0]), 2, 1);
    rig.root.add('plaza', [0, G, 0]).mesh((m) => m.box('paper', [-940, G, -440], [940, G + 12, 440]));
    const spots = tier === 1 ? [[-300, 120], [300, 120]] : tier === 2 ? [[-620, 180], [-210, 180], [210, 180], [620, 180]] : [[-660, 220], [-220, 220], [220, 220], [660, 220], [-440, -250], [440, -250]];
    spots.forEach(([x, z], i) => rig.root.add(`stall_${i + 1}`, [x, G, z]).mesh((m) => stall(m, x, z, tier === 1 ? 300 : 280)));
    if (tier === 3) rig.root.add('stall_canopy', [0, G, -200]).mesh((m) => {
      for (const [x, z] of [[-150, -350], [150, -350], [-150, -50], [150, -50]]) m.prism('paper', [x, z], 14, G, G + 420, 6);
      m.hip('sunflower*', [-200, G + 420, -400], [200, G + 560, 0]);
      m.hull('paper', [[-30, G + 560, -200], [30, G + 560, -200], [0, G + 650, -200], [0, G + 560, -170], [0, G + 560, -230]]);
    });
  };
}

// ------------------------------------------------------------------ measurement clock tower (1 x 1, violet)
function clockTower(tier) {
  return (rig) => {
    tileRig(rig);
    ground(rig.root.add('base', [0, 0, 0]), 1, 1);
    const M = 'violet*', H = [520, 760, 1000][tier - 1], w = [170, 190, 210][tier - 1];
    const tower = rig.root.add('tower', [0, G, 0]);
    tower.mesh((m) => {
      m.box('paper', [-w - 40, G, -w - 40], [w + 40, G + 60, w + 40]);
      m.box(M, [-w, G + 60, -w], [w, G + H, w]);
      for (let y = G + 200; y < G + H - 260; y += 200) m.box('paper', [-w - 12, y, -w - 12], [w + 12, y + 25, w + 12]); // folded bands
      m.box('paper', [-w - 25, G + H, -w - 25], [w + 25, G + H + 30, w + 25]);
      m.hip(M, [-w - 25, G + H + 30, -w - 25], [w + 25, G + H + 30 + 220 + tier * 60, w + 25]);
      if (tier >= 2) m.prism('paper', [0, 0], 12, G + H + 200 + tier * 60, G + H + 380 + tier * 60, 4);
    });
    // clock face on the player side: a paper disc with twelve hour marks (no numbers)
    const cy = G + H - 150, r = w * 0.8;
    const face = tower.add('clock_face', [0, cy, w]);
    face.mesh((m) => {
      const disc = [...Array(16).keys()].map((i) => { const a = (i / 16) * Math.PI * 2; return [Math.cos(a) * r, cy + Math.sin(a) * r]; });
      m.hull('paper', [...disc.map(([x, y]) => [x, y, w]), ...disc.map(([x, y]) => [x, y, w + 18])]);
      for (let h = 0; h < 12; h++) {
        const a = (h / 12) * Math.PI * 2, r0 = r * (h % 3 ? 0.8 : 0.72), r1 = r * 0.9;
        m.beam('ink', [Math.sin(a) * r0, cy + Math.cos(a) * r0, w + 20], [Math.sin(a) * r1, cy + Math.cos(a) * r1, w + 20], h % 3 ? 14 : 22);
      }
    });
    face.add('hand_hour', [0, cy, w + 26]).mesh((m) => m.hull('ink', [[-14, cy - 20, w + 22], [14, cy - 20, w + 22], [0, cy + r * 0.5, w + 22], [-14, cy - 20, w + 34], [14, cy - 20, w + 34], [0, cy + r * 0.5, w + 34]]));
    face.add('hand_minute', [0, cy, w + 38]).mesh((m) => m.hull('ink', [[-10, cy - 25, w + 36], [10, cy - 25, w + 36], [0, cy + r * 0.78, w + 36], [-10, cy - 25, w + 46], [10, cy - 25, w + 46], [0, cy + r * 0.78, w + 46]]));
  };
}

// ------------------------------------------------------------------ town page (10 x 7 tiles)
function townPage(rig) {
  tileRig(rig);
  rig.root.add('page', [0, 0, 0]).mesh((m) => {
    m.box('cream*', [-5000, 0, -3500], [5000, G, 3500]);
    for (let i = -4; i <= 4; i++) m.hull('paper', [[i * T - 10, G, -3500], [i * T + 10, G, -3500], [i * T - 10, G, 3500], [i * T + 10, G, 3500], [i * T, G + 6, -3500], [i * T, G + 6, 3500]]);
    for (let j = -3; j <= 3; j++) {
      const z = j * T + 500; // rows are 1 tile apart; 7 rows => lines between them at half tiles
      if (Math.abs(z) >= 3500) continue;
      m.hull('paper', [[-5000, G, z - 10], [5000, G, z - 10], [-5000, G, z + 10], [5000, G, z + 10], [-5000, G + 6, z], [5000, G + 6, z]]);
    }
  });
  rig.root.anchorAt('cell_origin', [-4500, G, -3000]);
}

const B = (name, fp, build, notes) => ({ name, dir: 'buildings', category: 'buildings', sheet: 'foldtown', unit: 'tile', footprint: fp, build, notes });
export default [
  ...[1, 2, 3].map((t) => B(`skill_fraction_bridge_t${t}`, [2, 1], fractionBridge(t), 'grow_* parts appear in order (deck, rails / arch / towers, cables).')),
  ...[1, 2, 3].map((t) => B(`skill_multiply_tower_t${t}`, [1, 1], multiplyTower(t), `floor_1..${[2, 4, 6][t - 1]} bottom to top, then roof.`)),
  ...[1, 2, 3].map((t) => B(`skill_placevalue_hall_t${t}`, [2, 1], placeValueHall(t), 'wing_center, then wing_left/right, then wing_dome at tier 3.')),
  ...[1, 2, 3].map((t) => B(`skill_decimal_market_t${t}`, [2, 1], decimalMarket(t), 'stall_1..N (2, 4, 6) and a central stall_canopy at tier 3.')),
  ...[1, 2, 3].map((t) => B(`skill_measure_clocktower_t${t}`, [1, 1], clockTower(t), 'hand_hour and hand_minute rotate about z around the clock centre; the face has 12 marks, no numbers.')),
  { name: 'town_page_grid', dir: 'areas', category: 'areas', sheet: 'foldtown', unit: 'tile', footprint: [10, 7], build: townPage, notes: 'Fits the right-hand page of popup_book at 0.03 m per tile. cell_origin = centre of the -x/-z corner cell; cells step 1 tile.' },
];
