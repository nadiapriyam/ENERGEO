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

The store persists in `localStorage` when the browser allows it, so the next interactive can pick up what this one leaves behind.

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

1. Add `src/interactives/<name>/index.js` exporting `{ id, hashPrefix, mapNumber, title, question, stages, connections, investigation }`.
2. Mark it built in `src/interactives/registry.js`.
3. Give each statement it shows an entry in `research/claims.json`, with cards on the ledger.
4. Reuse carried objects through `journey` instead of creating fresh ones.

## Commands

- `npm run dev`: local server.
- `npm run build`: static site in `dist/`. `.github/workflows/pages.yml` publishes it on every push to `main`.
- `npm test`: math tests.
- `npm run verify`: SymPy and NumPy cards; appends to the ledger.
