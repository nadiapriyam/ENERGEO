# The app (`src/`)

The interactive is part of the investigation, not an illustration added afterwards. Every position, colour and number on screen comes from a tested function in `src/math`.

## Layers

| Layer | Holds | Rule |
|---|---|---|
| `research/` | claims, levels, sources (`research/claims.json` is the machine-readable index) | The app reads it and never writes it. |
| `verify/` | card scripts and the append-only ledger (`verify/ledger/latest.json` is the derived view) | The app shows each card's latest verdict, and whether it has ever failed. |
| `src/math/` | pure functions, unit-tested with `npm test` | No DOM. Every reading a view draws is computed here. |
| `src/views/` | drawing only: SVG for planes, bars, areas and matrices; three.js only where space is the subject | A view receives numbers and never derives them. |
| `src/core/` | the shared frame, the journey (carried objects), status badges, controls | Same for every interactive. |
| `src/interactives/` | one folder per Master Map interactive: its stages, words and wiring | |

## The frame

Each interactive is a list of stages. A stage supplies:

- **equation, symbols**: every symbol is explained.
- **model(ctx)**: computed only through `src/math`.
- **build(ctx)**: the figure and the controls.
- **readouts**: the live numbers.
- **steps**: in Guided mode, the reader acts first, then the text explains what they did.
- **statements**: ids in `research/claims.json`, shown with their level badge and their cards' verdicts.
- **notice**: what changed, what stayed the same, what became visible, and what became hidden or lost.
- **carry**: which object and representation the stage works on.

**Modes.** Guided shows the steps. Explore frees every control. Advanced adds the full numbers and matrices.

**Level badges.** These follow `docs/objective.md`. Certainty is drawn with line style (solid, outline, dashed, dotted), never with colour. A visual can't raise a level.

## The journey: carrying objects

`core/journey.js` keeps each object under one id, with one entry per representation (ℝ², ℝ³, ℝ⁴, ℝᴺ, L²…). Each entry is derived from an earlier one by a named transformation, and the trail records every step. If a source representation changes, the derived one is rebuilt and the trail says so.

A representation can also be derived from another object's (`from: { id, rep }`), which is how one interactive hands its object to the next. Fourier Coefficients (#7) leaves the signal `f` behind (`interactives/signal.js`); Orthogonality and Zero (#8) builds its pair from it. `u` holds the coefficient arrows √2 f̂(k) of `f`, and `v` those of `g`, the same signal delayed by 0.14 of a period. The coordinates are coefficients in the orthonormal basis b = (√2 cos 2πt, −√2 sin 2πt, √2 cos 4πt, −√2 sin 4πt), so u·v = ⟨f, g⟩ on [0, 1] (card O2c). Stages 4 and 5 add second-harmonic coordinates, stage 6 perturbs that basis, and stages 7 and 8 show the same two waves as samples and as functions.

The store persists in `localStorage` when the browser allows it (key `energeo.journey.v2`), so the next interactive can pick up what this one leaves behind.

## Colour

Colour has one job: the sign of a contribution to an inner product.

| Colour | Meaning |
|---|---|
| Warm (`--pos`) | positive contribution |
| Cool (`--neg`) | negative contribution |
| Neutral ground (`--zero`) | zero |
| Ink | objects |

The pair was validated with the dataviz palette checker, in both light and dark, including colour-blind separation.

## Adding the next interactive

1. Add `src/interactives/<name>/index.js` exporting `{ id, hashPrefix, mapNumber, title, question, stages, connections, investigation }`, and optionally `next: { label, hash }`, offered once the last stage is reached.
2. Add it to `BUILT` in `src/main.js` (the hash `#<hashPrefix>-<stage>` selects it), and mark it built, with its `hashPrefix`, in `src/interactives/registry.js` so the Before/After links reach it.
3. Give each statement it shows an entry in `research/claims.json`, with cards on the ledger.
4. Reuse carried objects through `journey` instead of creating fresh ones.

## Commands

- `npm run dev`: local server.
- `npm run build`: static site in `dist/`. `.github/workflows/pages.yml` publishes it on every push to `main`.
- `npm test`: math tests.
- `npm run verify`: SymPy and NumPy cards; appends to the ledger.
