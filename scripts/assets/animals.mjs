import { elephant, giraffe, lion, zebra, penguin, monkey, cat, bird, cow } from '../lib/animals.mjs';

// Standalone animals (no base) for zoos, farms and streets. Small ones are shown enlarged.
export default [
  { name: 'animal_elephant', footprint: [1, 1], build: (m) => elephant(m, 0, 0, 0, 1, 0) },
  { name: 'animal_giraffe', footprint: [1, 1], build: (m) => giraffe(m, 0, 0, 0, 1, 0) },
  { name: 'animal_lion', footprint: [1, 1], build: (m) => lion(m, 0, 0, 0, 1, 0) },
  { name: 'animal_lioness', footprint: [1, 1], build: (m) => lion(m, 0, 0, 0, 1, 0, false) },
  { name: 'animal_zebra', footprint: [1, 1], build: (m) => zebra(m, 0, 0, 0, 1, 0) },
  { name: 'animal_penguin', footprint: [1, 1], build: (m) => penguin(m, 0, 0, 0, 1, 0) },
  { name: 'animal_monkey', footprint: [1, 1], build: (m) => monkey(m, 0, 0, 0, 1, 0) },
  { name: 'animal_cow', footprint: [1, 1], build: (m) => cow(m, 0, 0, 0, 1, 0) },
  { name: 'animal_cat', footprint: [1, 1], build: (m) => cat(m, 0, 0, 0, 'orange', 1, 0) },
  { name: 'animal_bird', footprint: [1, 1], build: (m) => bird(m, 0, 0, 0, 'sky', 1, 0) },
];
