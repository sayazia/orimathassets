// Registry of every asset, grouped into sheets (one contact sheet each).
import houses from './houses.mjs';
import offices from './offices.mjs';
import publicBuildings from './public.mjs';
import commercial from './commercial.mjs';
import industry from './industry.mjs';
import roads from './roads.mjs';
import parks from './parks.mjs';
import sports from './sports.mjs';
import zoo from './zoo.mjs';
import animals from './animals.mjs';
import nature from './nature.mjs';
import plants from './plants.mjs';
import people from './people.mjs';
import props from './props.mjs';
import billboards from './billboards.mjs';
import vehicles from './vehicles.mjs';

export const SHEETS = [
  { sheet: 'houses', category: 'buildings', title: 'Rumah / Houses', items: houses },
  { sheet: 'offices', category: 'buildings', title: 'Kantor / Offices', items: offices },
  { sheet: 'public', category: 'buildings', title: 'Layanan Publik / Public', items: publicBuildings },
  { sheet: 'commercial', category: 'buildings', title: 'Komersial / Commercial', items: commercial },
  { sheet: 'industry', category: 'buildings', title: 'Industri / Industry', items: industry },
  { sheet: 'roads', category: 'areas', title: 'Jalan / Roads', items: roads },
  { sheet: 'parks', category: 'areas', title: 'Taman / Parks', items: parks },
  { sheet: 'sports', category: 'areas', title: 'Olahraga / Sports', items: sports },
  { sheet: 'zoo', category: 'areas', title: 'Kebun Binatang / Zoo', items: zoo },
  { sheet: 'nature', category: 'areas', title: 'Alam / Nature', items: nature },
  { sheet: 'people', category: 'objects', title: 'Orang / People', items: people },
  { sheet: 'plants', category: 'objects', title: 'Pohon & Tanaman / Plants', items: plants },
  { sheet: 'props', category: 'objects', title: 'Perabot Jalan / Street Props', items: props },
  { sheet: 'billboards', category: 'objects', title: 'Papan Reklame / Billboards', items: billboards },
  { sheet: 'animals', category: 'objects', title: 'Hewan / Animals', items: animals },
  { sheet: 'vehicles', category: 'objects', title: 'Kendaraan / Vehicles', items: vehicles },
];

export const ASSETS = SHEETS.flatMap(({ sheet, category, items }) => items.map((a) => ({ ...a, sheet, category })));
