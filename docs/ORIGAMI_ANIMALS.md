# Origami animals from the two reference books

47 animals in `models/origami-animals/` (files `origami_<name>.glb`), built from code in `scripts/game/zoo.mjs` with the
archetype builders in `scripts/lib/zoo.mjs`. Catalog and per-asset numbers: [`CATALOG.md`](CATALOG.md) section B9 (Indonesian).

Sources (both scans, in the `animals` branch under `docs/`): book 1, *Comic Origami 3* (land animals, sea animals, insects,
reptiles, mythical animals) and book 2 (birds). The study notes are in the project files (`origami-books/style-guide.md`).
We learn the technique, not the folding patterns: no crease pattern or fold sequence is reproduced.

## What makes them read as folded paper

| Rule | How it is built |
| --- | --- |
| Few large planes | Bodies are hulls of 9 to 11 points: a tent (two side planes meeting on the back), heads are pyramids with a snout |
| One paper colour + white where the paper turns over | `main` colour plus `trim` (white by default) on chest, muzzle, belly, cheeks, inside of ears; one flat `accent` (beak, comb, inner ear) |
| No ink outline | Same as the Foldlings: folds are read from the lit and `_shade` faces |
| Plain details | Eyes and noses are discs (`disc`), stripes and masks are flat decals seated on the surface (`patch`) |
| Flat strips for limbs | Legs, ears, tails, fins, wings are one-fold plates (`flapLeg`, `spike`, `plate`); bird legs are thin rods with a flat foot |
| Attached, never floating | Ears root onto the head hull (`surf`); eyes and decals are ray-cast onto the hull |

Materials: at most six per file. `main*` and `trim*` give four (lit + shade), plus `ink` and one flat colour. A flat colour
that equals the base key of a starred colour (for example `orange` next to `orange*`) costs nothing.

## Faces

Every species gets its own face so the heads do not all end in the same point. `faceHead(pivot, face)` builds a faceted
cranium plus a muzzle block; `FACES` holds the presets:

| Face | Muzzle | Used by |
| --- | --- | --- |
| `fox`, `wolf` | long, tapering to a point | fox, wolf, Foldling fox |
| `cat`, `bigcat` | short and broad, wide cheeks | cat, tiger, winged lion, Foldling cat |
| `rabbit`, `squirrel`, `meerkat` | small blunt muzzle, domed crown | rabbit, squirrel, meerkat, Foldling rabbit |
| `pig`, `hippo`, `walrus` | square and flat (`taper: 1`), nose pad or whisker pad | pig, hippo, walrus |
| `beaver` | short round muzzle with front teeth | beaver |
| `mammoth` | high dome, short face, trunk from the front | mammoth, Foldling elephant |
| `dragon`, `lizard` | long flat-topped snout | dragon, stegosaurus |
| `bird` | no muzzle, a beak is added | griffin |

Ears come in five kinds: `point`, `long`, `round`, `flop` (folded forward, pig) and `side` (large, flat against the head).

## Builders (`scripts/lib/zoo.mjs`)

| Builder | Used for | Main options |
| --- | --- | --- |
| `quad` | four-legged animals, also lying (cat) | `L`, `Hb`, `legH`, `W`, `barrel`, `face`, `ear {kind, h, spread, inner}`, `tail {kind: brush, whip, up, stub, paddle}`, `extra(ctx)` |
| `sitter` | seated or upright animals (squirrel, rabbit, fox, meerkat) | `H`, `kx`, `Bw`, `belly`, `shoulder`, `lean`, `foot`, `armEnd`, face, ear, tail |
| `bird` | all birds | `bodyL`, `bodyH`, `legH`, `neck {len, curve}`, `beak {len, h, colour}`, `crest`, `tail {len, w, fork}`, `wing {len, open}`, `faceTrim`, `float` |
| `swimmer` | shark, whale, pufferfish | `L`, `H`, `W`, `snout`, `dorsal`, `tailUp/Down`, `fin` |
| custom | squid, shield bug, katydid, snake, chameleon | written directly in `zoo.mjs` |

`extra(ctx)` adds the features that make each animal recognisable: tiger stripes, cat mask, meerkat eye patches, wolf ruff,
mammoth trunk and tusks, stegosaurus plates, griffin beak and wings, lion mane, dragon whiskers, peacock fan.

## Conventions

Same as the Foldlings ([`FOLDLINGS.md`](FOLDLINGS.md)): metres, y up, head towards +x, flat profile to +z, feet on y = 0,
named nodes with pivots at the joints, `label_anchor` and `flag_anchor`, transform-only clips. The fish, sharks, whale, squid,
pufferfish, hummingbird and swallow hover (body about 2.6 to 3 cm above the table, origin on the table).

## Build

```
npm run build -- origami_          # models + manifest
npm run validate -- origami        # glTF validator
npm run previews:game -- origami_land   # or _sea, _small, _myth, _birds
```
