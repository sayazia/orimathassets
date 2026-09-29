// Node hierarchy for the Foldlings game assets: named parts with pivots at their joints,
// empty anchor nodes, hidden alternate states and transform-only animation clips.
// Everything is authored in millimetres in rest-pose model space; the writer converts to metres.
import { Model } from './geom.mjs';

const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

export class Node {
  constructor(name, t, parent, opts = {}) {
    this.name = name;
    this.t = t; // local translation (mm)
    this.parent = parent;
    this.children = [];
    this.model = null;
    this.hidden = !!opts.hidden;
    this.r = opts.r ?? null; // rest rotation in degrees (anchors only)
    this.anchor = !!opts.anchor;
    this.outline = opts.outline ?? true;
  }

  get world() {
    return this.parent ? add3(this.parent.world, this.t) : this.t;
  }

  // Child node whose pivot sits at `pivot` (model space, mm).
  add(name, pivot = this.world, opts = {}) {
    if (this.r) throw new Error(`${name}: rotated nodes cannot have children`);
    const n = new Node(name, sub3(pivot, this.world), this, opts);
    this.children.push(n);
    return n;
  }

  // Empty node the game uses as a placement point. +Z of the anchor faces the player.
  anchorAt(name, at, r = null) {
    return this.add(name, at, { anchor: true, r });
  }

  // Geometry for this node, authored in model space; stored relative to the pivot.
  mesh(fn) {
    if (!this.model) {
      this.model = new Model(this.name);
      this.model.solids = [];
    }
    const w = this.world;
    this.model.with({ t: [-w[0], -w[1], -w[2]] }, fn);
    return this;
  }

  *walk() {
    yield this;
    for (const c of this.children) yield* c.walk();
  }
}

export class Rig {
  constructor(name) {
    this.name = name;
    this.root = new Node(name, [0, 0, 0], null);
    this.clips = [];
    this.unit = 0.001;
  }

  find(name) {
    for (const n of this.root.walk()) if (n.name === name) return n;
    throw new Error(`${this.name}: no node ${name}`);
  }

  // tracks: [{ node, path: 'rotation' (deg xyz) | 'translation' (mm offset from rest) | 'scale', keys: [[t, value], ...] }]
  clip(name, tracks) {
    this.clips.push({ name, tracks });
    return this;
  }

  // Summary for the manifest.
  info() {
    let triangles = 0, outline = 0;
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    const anchors = {}, parts = [], materials = new Set();
    const hiddenUnder = (n) => { for (let p = n; p; p = p.parent) if (p.hidden) return true; return false; };
    for (const n of this.root.walk()) {
      const w = n.world.map((v) => +(v * this.unit).toFixed(4));
      if (n.anchor) anchors[n.name] = w;
      if (!n.model) continue;
      if (n !== this.root) parts.push(n.name);
      for (const [key, pos] of n.model.groups) {
        materials.add(key);
        if (hiddenUnder(n)) continue;
        triangles += pos.length / 9;
        const o = n.world;
        for (let i = 0; i < pos.length; i++) {
          const v = (pos[i] + o[i % 3]) * this.unit;
          min[i % 3] = Math.min(min[i % 3], v);
          max[i % 3] = Math.max(max[i % 3], v);
        }
      }
      if (n.outline) for (const s of n.model.solids) if (!s.ink) outline += s.faces.reduce((a, f) => a + f.length - 2, 0);
    }
    if (outline) materials.add('ink');
    if (materials.size > 6) throw new Error(`${this.name}: ${materials.size} materials (max 6): ${[...materials]}`);
    const r = (v) => +v.toFixed(4);
    return { triangles, outline_triangles: outline, bounds: { min: min.map(r), max: max.map(r) }, anchors, parts, materials: [...materials].sort() };
  }
}

// Degrees (xyz order, matching Model.with) -> quaternion [x, y, z, w].
export function quat([x, y, z]) {
  const d = Math.PI / 360;
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(x * d), Math.sin(x * d), Math.cos(y * d), Math.sin(y * d), Math.cos(z * d), Math.sin(z * d)];
  // q = qz * qy * qx
  return [
    sx * cy * cz - cx * sy * sz,
    cx * sy * cz + sx * cy * sz,
    cx * cy * sz - sx * sy * cz,
    cx * cy * cz + sx * sy * sz,
  ];
}
