// Registry of the Foldlings game assets (metres). City assets stay in scripts/assets/.
import foldlings from './foldlings.mjs';
import book from './book.mjs';

// One city tile measures 3 cm when Fold Town stands on the pop-up book's page.
export const CITY_TILE_ON_BOOK_M = 0.03;

export const GAME_SHEETS = [
  { sheet: 'foldlings', title: 'Foldlings', items: foldlings },
  { sheet: 'book', title: 'Pop-up Book', items: book },
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
];

export const GAME_ASSETS = GAME_SHEETS.flatMap(({ sheet, items }) => items.map((a) => ({ sheet, ...a })));
