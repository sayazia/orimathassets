# Foldlings game assets: technical guide

Assets for **Foldlings**, a mixed-reality maths game for children aged 10 to 12 that runs in the
Meta Quest browser (WebXR, three.js). A paper pop-up book opens on the player's real table and origami
animals (Foldlings) walk out carrying numbers. Everything here is built from code in `scripts/`.

Batch status and per-asset numbers are in [`CATALOG.md`](CATALOG.md) (Indonesian).

## Conventions

| Topic | Rule |
| --- | --- |
| Units | Metres (the city set stays in tiles; `models/scale.json` gives `city_tile_on_book_m: 0.03`) |
| Axes | y up, front faces +Z (the player), base at y = 0, centred on (0, 0) |
| Creatures | Flat profile faces the player (+Z), head points to +X |
| Pivots | Origin where the object touches the table; `paper_bird` at its body centre; `flag_small` at the foot of the pole |
| Materials | Plain PBR (metallic 0, roughness 0.95), named after palette keys (`coral`, `coral_shade`, `cream`, `ink`...), at most 6 per asset, no textures |
| `ink` | Unlit (`KHR_materials_unlit`), used for eyes, noses and outlines |
| Normals | Flat, per face; geometry is indexed |
| Validation | `npm run validate`: Khronos glTF validator, 0 errors and 0 warnings (infos for empty anchor nodes are expected) |

### Nodes

- Every moving part is its own node with its origin at the joint (neck, tail root, shoulder, hinge).
- **Anchors** are empty nodes: `label_anchor` (where the game draws a number; its +Z faces the player),
  `flag_anchor` (foot of the number flag), `spawn_anchor`, `exit_anchor`, `town_origin`.
- **Hidden states** (`eyes_happy`) have scale 0 and `extras.hidden_by_default: true`. Set scale to 1 to show
  them (and hide `eyes` by swapping, or simply let the happy eyes cover them).
- **`ink_outline`**: each part with geometry has a child mesh named `ink_outline`, an inverted hull
  0.6 mm thick. Toggle all of them to switch the ink contour on or off. three.js renames duplicates to
  `ink_outline_1`, `ink_outline_2`..., so match by prefix.

### Animation clips

Transform-only (no skins or morphs), linear keys, all in place.

| Clip | Length | Notes |
| --- | --- | --- |
| `idle` | 2.4 s loop | breathing body, head nod, tail and ear sway (fish also bobs) |
| `hop` | 0.6 s | crouch, leap, land; move the root +X by 0.03 m during the clip |
| `cheer` | 1.2 s | two happy jumps, head up, tail wag (elephant raises its trunk) |
| `bounce` | 1.0 s | comic squash and a dizzy head shake after a wrong answer |
| `fold` | 1.0 s | limbs tuck in, body flattens to a sheet and shrinks to nothing; swap in `paper_bird` at the end |
| `flap` | 0.4 s loop | `paper_bird` wings |
| `wave` | 2.4 s loop | `flag_small` cloth |

### Colour variants

Each Foldling and `paper_bird` ships as six files: the base file is `place_value`, the others add a suffix
(`foldling_fox_fractions.glb`...). The manifest lists them under `variant_files` and `variant_colours`.
Because materials are named after palette keys, a game may also recolour one file at runtime.

## Palette

`scripts/lib/palette.mjs` is the single source. It exports `PALETTE`, `ROLES`, `MISSIONS`, `shade()` and
`colourOf()`.

| Role | Palette key | Hex |
| --- | --- | --- |
| paper | paper | #FFF8EC |
| paper_back | cream | #F6E3C0 |
| ink | dark | #3A3F4B |
| place_value | coral | #F2716B |
| multiply_divide | cobalt (new) | #3469C4 |
| fractions | teal | #3FB6A0 |
| decimals | sunflower | #F9C74F |
| measurement | violet (new) | #B198EA |
| correct | leaf | #5DB85B |
| try_again | orange | #F8961E |
| reward_gold | gold | #E8B64C |

`<key>_shade` is generated: each sRGB channel multiplied by 0.88 / 0.86 / 0.82 (about 13% darker, a touch
warmer). Faces are assigned the lit colour or the shade automatically from their direction relative to a
key light at the upper front left, so every fold reads even under flat lighting.

### Colour-vision check

The brief's first choice (city `blue` and `purple`) failed: simulated with Machado et al. (2009) at full
severity, the pair differs by only ΔE 5.7 (protanopia) and 8.1 (deuteranopia). The mission set now uses
`cobalt` and `violet`. Smallest CIELAB ΔE76 between any two mission colours:

| Vision | Closest pair | ΔE |
| --- | --- | --- |
| normal | cobalt / violet | 29.4 |
| deuteranopia | cobalt / violet | 30.7 |
| protanopia | coral / teal | 17.2 (differs in lightness) |
| tritanopia | cobalt / teal | 27.6 |

See `previews/cvd_foldlings.png` for the rendered simulation. The game never relies on colour alone for
right and wrong answers.

## Previews

`npm run previews:game` (or `-- <sheet|name prefix|table>`) writes:

- `previews/<dir>/<name>.png`: front, three-quarter, side and a black silhouette
- `previews/sheet_<group>.png` and `sheet_<group>_variants.png`
- `previews/clips/<name>.png`: six frames of every clip
- `previews/cvd_<group>.png`: mission colours under deuteranopia, protanopia and tritanopia
- `previews/table_<batch>_wood.png` and `_white.png`: world scale on a procedurally drawn wooden and white
  table, perspective camera 45 cm above and 45 cm in front (a seated child's eye)

## 2D assets

`npm run build:2d` (or `-- <folder>`) writes `2d/`. Every SVG is written by `scripts/build-2d.mjs` from polygons
(`scripts/2d/`): no fonts, no embedded images, palette colours only. PNGs are rasterised from the same SVG in
headless Chromium; the Devpost and social images are table renders of scene `b1` with the logo banner on top,
so run `npm run build` first.

| Path | Sizes |
| --- | --- |
| `avatars/avatar_<species>_<mission>.svg` | `_256.png`, `_512.png` |
| `picture_password/pp_<star, moon, sun, leaf, fish, boat, key, heart, cloud>.svg` | `.png` 256 |
| `brand/logo_foldlings.svg` (ink contour, for light backgrounds), `logo_foldlings_dark.svg` (paper contour) | `.png` 1200 wide, transparent |
| `brand/app_icon.svg`, `app_icon_maskable.svg` (full bleed, art inside the 80% safe zone) | `_192`, `_512`, `_1024.png` |
| `brand/favicon.svg` | `_32`, `_48.png` |
| `brand/devpost_thumbnail.png`, `devpost_thumbnail_1200x630.png`, `social_preview.png` | 1920×1080, 1200×630, 1280×640 |
| `icons/game_<type>.svg` (badge style) | `_128`, `_256.png` |
| `icons/mission_<id>.svg` (symbol only) | `.png` 128 |

The logo letters are folded paper ribbons: each letter is a centre line offset to a strip with mitred
corners, alternate strips in the lit and `_shade` tone, and the letters cycle through the five mission colours.
