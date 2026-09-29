// Origami paper colours (sRGB hex). Every material in every model comes from
// this list, so recolouring the whole set is a one-file change.
export const PALETTE = {
  paper: '#FFF8EC', // white paper: trims, frames, road lines
  cream: '#F6E3C0',
  sand: '#EBCB93',
  coral: '#F2716B',
  red: '#E0504B',
  pink: '#F6A5C0',
  orange: '#F8961E',
  sunflower: '#F9C74F',
  lemon: '#FBE38E',
  mint: '#9EE0BD',
  teal: '#3FB6A0',
  sky: '#7CCBF2',
  blue: '#3D7DD8',
  navy: '#2F4B8A',
  lavender: '#B7A3E0',
  purple: '#8663C9',
  grass: '#8CCB5E',
  leaf: '#5DB85B',
  pine: '#2F9A62',
  bark: '#A0704B',
  asphalt: '#5E6475',
  kerb: '#D5D9E2',
  stone: '#B7BDC9',
  glass: '#BFE8F8',
  water: '#58B8E8',
  dark: '#3A3F4B',
  straw: '#E6C47A', // thatch
  wood: '#C98B55',
  terracotta: '#D9774A',
  ijuk: '#4B4A55', // dark palm-fibre roofs
  gold: '#E8B64C',
  maroon: '#9C3D48',
  slate: '#5A6C8C', // slate roofs
};

// Extra hues for the Foldlings mission colours. The city's `blue` and `purple` look alike to
// people with protanopia/deuteranopia, so missions use `cobalt` (darker) and `violet` (lighter)
// instead; see docs/FOLDLINGS.md for the simulation numbers.
PALETTE.cobalt = '#3469C4';
PALETTE.violet = '#B198EA';

// Game roles -> palette keys. The Foldlings game reads colours through these names.
export const ROLES = {
  paper: 'paper',
  paper_back: 'cream',
  ink: 'dark',
  place_value: 'coral',
  multiply_divide: 'cobalt',
  fractions: 'teal',
  decimals: 'sunflower',
  measurement: 'violet',
  correct: 'leaf',
  try_again: 'orange',
  reward_gold: 'gold',
};

export const MISSIONS = ['place_value', 'multiply_divide', 'fractions', 'decimals', 'measurement'];

// `<key>_shade`: the side of a fold that faces away from the light. About 11% darker,
// with blue pulled down a little more than red so shadows stay warm like lit paper.
export function shade(hex) {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const warm = [0.91, 0.89, 0.86];
  return '#' + rgb.map((v, i) => Math.round(v * warm[i]).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Resolves a material key: a palette key, `<key>_shade`, or a role name (`ink`, `paper_back`, ...).
export function colourOf(key) {
  const base = key.endsWith('_shade') ? key.slice(0, -6) : key;
  const hex = PALETTE[base] ?? PALETTE[ROLES[base]];
  if (!hex) return undefined;
  return key.endsWith('_shade') ? shade(hex) : hex;
}
