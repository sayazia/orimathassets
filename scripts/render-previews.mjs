// Renders a PNG per model, one contact sheet per group and a small demo town,
// using three.js in headless Chromium (Playwright).
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'models/manifest.json'), 'utf8'));
const outDir = join(root, 'previews');
mkdirSync(outDir, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'model/gltf-binary', '.json': 'application/json' };
const server = createServer((req, res) => {
  const path = normalize(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!path.startsWith(root) || !existsSync(path)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' }).end(readFileSync(path));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/scripts/preview.html`;

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('page error:', e.message));
await page.goto(url);
await page.waitForFunction(() => window.ready === true);

const save = (name, dataUrl) => writeFileSync(join(outDir, name), Buffer.from(dataUrl.split(',')[1], 'base64'));

// Optional argument: a sheet name to re-render only that sheet (e.g. `npm run previews -- houses`).
const only = process.argv[2];
const sheets = [...new Set(manifest.map((a) => a.sheet))];
const titles = {
  houses: 'Rumah / Houses', offices: 'Kantor / Offices', public: 'Layanan Publik / Public Services',
  commercial: 'Komersial / Commercial', industry: 'Industri / Industry', roads: 'Jalan / Roads',
  parks: 'Taman / Parks', sports: 'Olahraga / Sports', zoo: 'Kebun Binatang / Zoo', nature: 'Alam / Nature',
  people: 'Orang / People', vehicles: 'Kendaraan / Vehicles', plants: 'Pohon & Tanaman / Plants',
  props: 'Perabot Jalan / Street Props', billboards: 'Papan Reklame / Billboards', animals: 'Hewan / Animals',
};
for (const sheet of sheets) {
  if (only && only !== sheet && only !== 'town') continue;
  if (only === 'town') break;
  const tiles = [];
  for (const { name, file, category } of manifest.filter((a) => a.sheet === sheet)) {
    mkdirSync(join(outDir, category), { recursive: true });
    const png = await page.evaluate((file) => window.renderScene({ items: [{ file }] }), file);
    save(`${category}/${name}.png`, png);
    tiles.push({ name, png });
  }
  const cols = Math.min(tiles.length, tiles.length > 12 ? 6 : 4);
  save(`sheet_${sheet}.png`, await page.evaluate((a) => window.contactSheet(a), { tiles, cols, cell: 256, title: titles[sheet] ?? sheet }));
  console.log(`rendered sheet ${sheet} (${tiles.length})`);
}

// Demo town on a 6x6 grid. Cell (x, z) sits at world (x, z); ry in quarter turns.
const Q = Math.PI / 2;
const G = 0.04; // ground plate thickness: objects placed on tiles sit this high
const town = [
  ['park_flower', 0, 0], ['office_helipad', 1, 0], ['road_straight', 2, 0], ['house_apartment', 3, 0, -Q], ['office_round', 4, 0], ['park_pond', 5, 0],
  ['house_two_storey', 0, 1], ['shop_cafe', 1, 1], ['road_crosswalk', 2, 1], ['public_school', 3, 1], ['house_joglo', 4, 1], ['house_basic', 5, 1],
  ['road_straight', 0, 2, Q], ['road_straight', 1, 2, Q], ['road_cross', 2, 2], ['road_straight', 3, 2, Q], ['road_straight', 4, 2, Q], ['road_corner', 5, 2, -Q],
  ['house_minimalist', 0, 3, 2 * Q], ['shop_minimarket', 1, 3, 2 * Q], ['road_straight', 2, 3], ['public_mosque', 3, 3, 2 * Q], ['house_gadang', 4, 3, 2 * Q], ['road_straight', 5, 3],
  ['park_playground', 0, 4], ['house_bungalow', 1, 4, Q], ['road_t', 2, 4], ['road_straight', 3, 4, Q], ['road_straight', 4, 4, Q], ['road_t', 5, 4, 2 * Q],
  ['park_statue', 0, 5], ['house_cottage', 1, 5, Q], ['road_straight', 2, 5], ['public_clinic', 3, 5, 2 * Q], ['office_spire', 4, 5, 2 * Q], ['road_straight', 5, 5],
  ['vehicle_taxi', 1.84, 0.7, 0, G], ['vehicle_bus', 2.17, 3.5, 2 * Q, G], ['vehicle_sedan', 3.6, 2.16, Q, G], ['vehicle_bajaj', 0.5, 1.84, -Q, G],
  ['vehicle_school_bus', 3.7, 4.16, Q, G], ['vehicle_motorcycle', 4.9, 2.84, 0, G], ['vehicle_hatchback', 1.2, 2.16, Q, G], ['vehicle_ambulance', 5.16, 5.2, 2 * Q, G],
  ['people_woman', 1.56, 0.4, 0, G + 0.025], ['people_man', 2.44, 1.6, 2 * Q, G + 0.025], ['people_child', 2.45, 1.7, 2 * Q, G + 0.025], ['people_police', 1.56, 2.44, 1, G + 0.025],
  ['people_vendor', 3.3, 2.44, 0, G + 0.025], ['people_cyclist', 2.8, 4.16, Q, G],
  ['tree_round', 0.1, 4.1, 0, G], ['tree_palm', 5.3, 5.2, 0, G], ['billboard_pole', 3.5, 1.62, 0, G + 0.025],
].map(([name, x, z, ry = 0, y = 0]) => ({ file: manifest.find((a) => a.name === name).file, x, y, z, ry }));
if (!only || only === 'town') save('town.png', await page.evaluate((items) => window.renderScene({ items, width: 1600, height: 1200, pad: 0.03 }), town));
console.log('rendered town + contact sheet');

await browser.close();
server.close();
