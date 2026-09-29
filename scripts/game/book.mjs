// The pop-up book: open (the game board), closed (intro) and the pop-up backdrop frame.
// Millimetres; the spine runs along z at x = 0, the reader sits at +z.
import { plate } from '../lib/origami.mjs';

const W = 180, D = 120; // half-width of the open book, half-depth

// Page block profile (x, y) for the right-hand side; pages bow up towards the spine.
const PAGE = [[4, 3], [168, 3], [168, 15], [145, 17.5], [100, 20], [40, 22], [10, 21.5], [4, 19]];
const pageTop = (x) => {
  const t = PAGE.slice(3).reverse(); // spine -> outer edge, increasing x
  for (let i = 0; i < t.length - 1; i++) if (x >= t[i][0] && x <= t[i + 1][0]) return t[i][1] + ((t[i + 1][1] - t[i][1]) * (x - t[i][0])) / (t[i + 1][0] - t[i][0]);
  return 15;
};

// Extrudes an (x, y) profile along z. `s` mirrors to the left page.
function prismXY(m, c, profile, z0, z1, s = 1) {
  m.hull(c, [...profile.map(([x, y]) => [s * x, y, z0]), ...profile.map(([x, y]) => [s * x, y, z1])]);
}

function cover(m, s, x0, x1) {
  // navy board with a simple gold edge band that shows around the pages (no lettering)
  m.hull('navy*', [[s * x0, 0, -D], [s * x1, 0, -D], [s * x1, 0, D], [s * x0, 0, D], [s * x0, 3, -D], [s * x1, 3, -D], [s * x1, 3, D], [s * x0, 3, D]]);
  const g = 'gold', t = 3, h = 3.6;
  m.box(g, [Math.min(s * (x1 - 5), s * x1), t, -D + 0.5], [Math.max(s * (x1 - 5), s * x1), h, D - 0.5]); // outer edge
  m.box(g, [Math.min(s * x0, s * (x1 - 5)), t, -D + 0.5], [Math.max(s * x0, s * (x1 - 5)), h, -D + 4.5]); // back edge
  m.box(g, [Math.min(s * x0, s * (x1 - 5)), t, D - 4.5], [Math.max(s * x0, s * (x1 - 5)), h, D - 0.5]); // front edge
  for (const z of [-1, 1]) m.hull(g, [[s * (x1 - 5), t, z * (D - 4.5)], [s * (x1 - 22), t, z * (D - 4.5)], [s * (x1 - 5), t, z * (D - 22)], [s * (x1 - 5), 4.2, z * (D - 4.5)]]); // corner pieces
}

function pages(m, s) {
  prismXY(m, 'paper*', PAGE, -D + 10, D - 10, s);
  // page-edge lines on the fore-edge and the reader's side: the stack thickness reads at a glance
  for (const y of [7, 11]) {
    m.box('paper_shade', [Math.min(s * 168, s * 168.4), y, -D + 11], [Math.max(s * 168, s * 168.4), y + 1.2, D - 11]);
    m.box('paper_shade', [Math.min(s * 8, s * 167), y, D - 10], [Math.max(s * 8, s * 167), y + 1.2, D - 9.6]);
  }
}

function openBook(rig) {
  const spine = rig.root.add('spine', [0, 0, 0]);
  spine.mesh((m) => m.hull('navy*', [[-6, 0, -D], [6, 0, -D], [6, 0, D], [-6, 0, D], [-4, -1.5, -D], [4, -1.5, D], [-4, -1.5, D], [4, -1.5, -D], [-6, 3, -D], [6, 3, -D], [6, 3, D], [-6, 3, D]]));
  for (const [s, side] of [[-1, 'left'], [1, 'right']]) {
    const c = rig.root.add(`cover_${side}`, [s * 6, 0, 0]);
    c.mesh((m) => cover(m, s, 6, W));
    const p = c.add(`pages_${side}`, [s * 4, 3, 0]);
    p.mesh((m) => pages(m, s));
    // top leaf on its own hinge so the game can turn a page (rotate about z)
    const h = rig.root.add(`page_hinge_${side}`, [s * 4, 21, 0], { outline: false });
    h.mesh((m) => {
      const top = PAGE.slice(3).reverse().map(([x, y]) => [x, y + 0.2]);
      for (let i = 0; i < top.length - 1; i++) {
        const [a, b] = [top[i], top[i + 1]];
        m.hull('paper*', [[s * a[0], a[1], -D + 11], [s * b[0], b[1], -D + 11], [s * b[0], b[1], D - 11], [s * a[0], a[1], D - 11],
          [s * a[0], a[1] + 1.2, -D + 11], [s * b[0], b[1] + 1.2, -D + 11], [s * b[0], b[1] + 1.2, D - 11], [s * a[0], a[1] + 1.2, D - 11]]);
      }
    });
  }
  rig.root.anchorAt('spawn_anchor', [-90, pageTop(90) + 1.4, 0]);
  rig.root.anchorAt('exit_anchor', [0, 60, 0]);
  rig.root.anchorAt('town_origin', [90, pageTop(90) + 1.4, 0]);
}

function closedBook(rig) {
  // lies flat, spine on the -x side; the front cover opens around the spine (rotate about z)
  const T = 30, x0 = -90, x1 = 90;
  const spine = rig.root.add('spine', [x0, 0, 0]);
  spine.mesh((m) => m.hull('navy*', [[x0, 0, -D], [x0, 0, D], [x0 + 6, 0, -D], [x0 + 6, 0, D], [x0 + 6, T, -D], [x0 + 6, T, D], [x0, T, -D], [x0, T, D], [x0 - 2.5, T / 2, -D], [x0 - 2.5, T / 2, D]]));
  const back = rig.root.add('cover_back', [x0 + 3, 0, 0]);
  back.mesh((m) => {
    m.box('navy*', [x0 + 3, 0, -D], [x1, 3, D]);
    m.box('paper*', [x0 + 6, 3, -D + 4], [x1 - 4, T - 3, D - 4]); // page block
    for (const y of [9, 15, 21]) {
      m.box('paper_shade', [x1 - 4, y, -D + 5], [x1 - 3.6, y + 1.2, D - 5]);
      m.box('paper_shade', [x0 + 8, y, D - 4], [x1 - 5, y + 1.2, D - 3.6]);
    }
  });
  const front = rig.root.add('cover_front', [x0 + 3, T - 3, 0]);
  front.mesh((m) => {
    m.box('navy*', [x0 + 3, T - 3, -D], [x1, T, D]);
    const y0 = T, y1 = T + 0.6, g = 'gold';
    m.box(g, [x0 + 12, y0, -D + 6], [x1 - 6, y1, -D + 10]);
    m.box(g, [x0 + 12, y0, D - 10], [x1 - 6, y1, D - 6]);
    m.box(g, [x1 - 10, y0, -D + 10], [x1 - 6, y1, D - 10]);
    m.box(g, [x0 + 12, y0, -D + 10], [x0 + 16, y1, D - 10]);
    // centre emblem: a folded diamond (a shape, not lettering)
    m.hull(g, [[3, y0, -28], [3, y0, 28], [-25, y0, 0], [31, y0, 0], [3, y0 + 2.2, 0]]);
    m.hull('navy*', [[3, y0, -14], [3, y0, 14], [-11, y0, 0], [17, y0, 0], [3, y0 + 2.6, 0]]);
  });
}

// Pop-up backdrop that stands at the back of the open book. Each panel is hinged along its
// bottom edge (rotate about x from -90 flat to 0 upright); rest pose is upright.
function popupFrame(rig) {
  const P = (name, x0, x1, fill, deco) => {
    const n = rig.root.add(name, [(x0 + x1) / 2, 0, 0]);
    n.mesh((m) => {
      m.box(fill, [x0 + 1, 0, -1], [x1 - 1, 80, 1]);
      deco(m, x0, x1);
      m.box(fill, [x0 + 3, 0, 1], [x1 - 3, 2, 18]); // glue tab folded forward onto the page
    });
    return n;
  };
  const hills = (m, x0, x1, c, h) => {
    const w = (x1 - x0) / 2;
    plate(m, c, [[x0 + 1, 78, 0], [x0 + w + 1, 78, 0], [x0 + w * 0.5 + 1, 78 + h, 0]], 2);
    plate(m, c, [[x0 + w - 1, 78, 0], [x1 - 1, 78, 0], [x0 + w * 1.5 - 1, 78 + h * 0.8, 0]], 2);
  };
  P('panel_left', -150, -50, 'mint*', (m, a, b) => { hills(m, a, b, 'leaf', 34); plate(m, 'leaf', [[-120, 60, 1.4], [-104, 60, 1.4], [-112, 88, 1.4]], 1.6); });
  P('panel_back', -50, 50, 'sky', (m, a, b) => {
    m.box('sky', [a + 1, 80, -1], [b - 1, 104, 1]);
    plate(m, 'paper', [[-8, 104, 0], [8, 104, 0], [0, 118, 0]], 2); // paper peak
    for (const [cx, cy] of [[-26, 90], [22, 94]]) plate(m, 'paper', [[cx - 12, cy - 4, 1.2], [cx + 12, cy - 4, 1.2], [cx + 7, cy + 5, 1.2], [cx - 5, cy + 6, 1.2]], 1.6); // clouds
  });
  P('panel_right', 50, 150, 'mint*', (m, a, b) => { hills(m, a, b, 'leaf', 30); plate(m, 'leaf', [[104, 60, 1.4], [120, 60, 1.4], [112, 86, 1.4]], 1.6); });
}

export default [
  { name: 'popup_book', dir: 'book', category: 'book', sheet: 'book', size: [0.36, 0.24, 0.025], build: openBook, notes: 'Open flat. spawn_anchor: centre of the left page; town_origin: centre of the right page; exit_anchor: 6 cm above the spine. page_hinge_* hold the top leaf (rotate about z to turn a page).' },
  { name: 'popup_book_closed', dir: 'book', category: 'book', sheet: 'book', size: [0.18, 0.24, 0.03], build: closedBook, notes: 'Spine on the -x side; cover_front opens about z at its spine edge.' },
  { name: 'page_popup_frame', dir: 'book', category: 'book', sheet: 'book', size: [0.3, 0.02, 0.12], build: popupFrame, notes: 'Panels hinge on their bottom edge: rotate about x from -90 (flat) to 0 (upright, rest pose). Place at the back of the open book.' },
];
