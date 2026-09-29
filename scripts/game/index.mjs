// Registry of the Foldlings game assets (metres). City assets stay in scripts/assets/.
import foldlings from './foldlings.mjs';
import book from './book.mjs';
import { hints, portals } from './hints.mjs';
import characters from './characters.mjs';
import { orbForge, balloons, factory, bridge, balance, measure } from './props.mjs';

// One city tile measures 3 cm when Fold Town stands on the pop-up book's page.
export const CITY_TILE_ON_BOOK_M = 0.03;

export const GAME_SHEETS = [
  { sheet: 'foldlings', title: 'Foldlings', items: foldlings },
  { sheet: 'book', title: 'Pop-up Book', items: book },
  { sheet: 'orb_forge', title: 'Orb Forge', items: orbForge },
  { sheet: 'balloon', title: 'Balloon Burst', items: balloons },
  { sheet: 'factory', title: 'Factory Sort', items: factory },
  { sheet: 'bridge', title: 'Bridge Builder', items: bridge },
  { sheet: 'balance', title: 'Balance Gate', items: balance },
  { sheet: 'measure', title: 'Measure Hunt', items: measure },
  { sheet: 'hints', title: 'Hints', items: hints },
  { sheet: 'portal', title: 'Portals', items: portals },
  { sheet: 'characters', title: 'Characters', items: characters },
];

// Table-scale preview scenes (metres, world space on the table top).
// Items: { name (manifest asset) or file, x, y, z, ry }. Book pages are about 2 cm above the table.
const P = 0.021;
export const TABLE_SCENES = [
  {
    name: 'b1',
    items: [
      { name: 'popup_book' },
      { name: 'page_popup_frame', x: 0.0, y: 0.022, z: -0.1 },
      { name: 'foldling_fox', x: -0.12, y: P, z: 0.02, ry: 0.3 },
      { name: 'flag_small', x: -0.124, y: P + 0.038, z: 0.02, ry: 0.3 },
      { file: 'foldlings/foldling_rabbit_multiply_divide.glb', x: -0.06, y: P, z: 0.05, ry: -0.2 },
      { file: 'foldlings/foldling_turtle_fractions.glb', x: 0.07, y: P, z: 0.04, ry: 0.4 },
      { file: 'foldlings/foldling_frog_decimals.glb', x: 0.13, y: P, z: -0.02, ry: -0.5 },
      { file: 'foldlings/foldling_cat_measurement.glb', x: -0.05, y: P, z: -0.05, ry: 0.2 },
      { file: 'foldlings/foldling_elephant_rare.glb', x: 0.06, y: P, z: -0.05, ry: -0.3 },
      { file: 'foldlings/foldling_crane_fractions.glb', x: 0.25, y: 0, z: 0.08, ry: -0.6 },
      { file: 'foldlings/foldling_fish_multiply_divide.glb', x: -0.25, y: 0, z: 0.1, ry: 0.5 },
      { name: 'paper_bird', x: 0.02, y: 0.12, z: 0.03, ry: 0.4 },
    ],
  },
  {
    name: 'b2',
    camera: { target: [0, 0.03, -0.02] },
    items: [
      { name: 'crystal_tray', x: 0, y: 0, z: 0.13 },
      ...[0, 1, 2, 3, 4].map((i) => ({ name: 'crystal', x: (i - 2) * 0.09, y: 0.034, z: 0.13, ry: i })),
      { name: 'orb', x: 0.2, y: 0.025, z: 0.05 },
      { name: 'balloon_round', x: -0.2, y: 0, z: -0.02 },
      { name: 'balloon_long', x: -0.14, y: 0, z: -0.06 },
      { name: 'balloon_heart', x: -0.25, y: 0, z: -0.1 },
      { name: 'scale', x: 0.0, y: 0, z: -0.12 },
      { name: 'weight_block', x: -0.13, y: 0.058, z: -0.12 },
      { name: 'weight_block', x: 0.13, y: 0.058, z: -0.12 },
      { name: 'gap_cliffs', x: 0.0, y: 0, z: 0.02 },
      { name: 'plank_1_2', x: -0.06, y: 0.063, z: 0.02 },
      { name: 'plank_1_4', x: 0.03, y: 0.063, z: 0.02 },
      { name: 'treasure_chest', x: 0.22, y: 0, z: -0.08, ry: -0.4 },
      { name: 'ruler_30', x: 0.02, y: 0, z: 0.22 },
      { name: 'marker_pin', x: 0.25, y: 0, z: 0.15 },
      { file: 'game/measure/marker_pin_b.glb', x: 0.3, y: 0, z: 0.1 },
    ],
  },
  {
    name: 'b2_factory',
    camera: { target: [0, 0.03, 0] },
    items: [
      { name: 'conveyor_start', x: -0.2, y: 0, z: 0 },
      ...[0, 1, 2].map((i) => ({ name: 'conveyor_straight', x: -0.1 + i * 0.12, y: 0, z: 0 })),
      { name: 'sort_gate', x: -0.08, y: 0, z: 0 },
      { file: 'game/factory/sort_gate_2.glb', x: 0.04, y: 0, z: 0 },
      { file: 'game/factory/sort_gate_3.glb', x: 0.16, y: 0, z: 0 },
      ...[-0.08, 0.04, 0.16].map((x) => ({ name: 'sort_bin', x, y: 0, z: 0.075 })),
      { name: 'item_token', x: -0.14, y: 0.038, z: 0 },
      { name: 'item_token', x: 0.1, y: 0.038, z: 0 },
      { name: 'tape_measure', x: 0.22, y: 0, z: 0.14 },
      { name: 'gate', x: 0.0, y: 0, z: -0.14 },
      { name: 'shield_badge', x: -0.22, y: 0, z: 0.14 },
    ],
  },
];

export const GAME_ASSETS = GAME_SHEETS.flatMap(({ sheet, items }) => items.map((a) => ({ sheet, ...a })));
