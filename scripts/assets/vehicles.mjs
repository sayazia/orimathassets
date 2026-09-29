import { person } from '../lib/parts.mjs';
import * as V from '../lib/vehicles.mjs';

// Vehicles share the buildings' scale (a car is ~0.2 units long) and sit on y = 0.
export default [
  { name: 'vehicle_sedan', footprint: [1, 1], build: (m) => V.sedan(m) },
  { name: 'vehicle_hatchback', footprint: [1, 1], build: (m) => V.hatchback(m) },
  { name: 'vehicle_taxi', footprint: [1, 1], build: (m) => V.taxi(m) },
  { name: 'vehicle_suv', footprint: [1, 1], build: (m) => V.suv(m) },
  { name: 'vehicle_pickup', footprint: [1, 1], build: (m) => V.pickup(m) },
  { name: 'vehicle_van', footprint: [1, 1], build: (m) => V.van(m) },
  { name: 'vehicle_police', footprint: [1, 1], build: (m) => V.police(m) },
  { name: 'vehicle_ambulance', footprint: [1, 1], build: (m) => V.ambulance(m) },
  { name: 'vehicle_fire_truck', footprint: [1, 1], build: (m) => V.fireTruck(m) },
  { name: 'vehicle_bus', footprint: [1, 1], build: (m) => V.bus(m) },
  { name: 'vehicle_school_bus', footprint: [1, 1], build: (m) => V.schoolBus(m) },
  { name: 'vehicle_truck', footprint: [1, 1], build: (m) => V.truck(m) },
  { name: 'vehicle_motorcycle', footprint: [1, 1], build: (m) => V.motorcycle(m, { person }) },
  { name: 'vehicle_bicycle', footprint: [1, 1], build: (m) => V.bicycle(m) },
  { name: 'vehicle_bajaj', footprint: [1, 1], build: (m) => V.bajaj(m) },
  { name: 'vehicle_becak', footprint: [1, 1], build: (m) => V.becak(m) },
  { name: 'vehicle_train_locomotive', footprint: [1, 1], build: (m) => V.locomotive(m) },
  { name: 'vehicle_train_carriage', footprint: [1, 1], build: (m) => V.carriage(m) },
];
