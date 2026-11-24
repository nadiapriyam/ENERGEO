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

## Discovery stages (Chapter I on)

A stage with `discovery: true` follows the discovery rules in `CLAUDE.md`. Its words live in a copy module (`interactives/zero/copy.js`) so `test/copy.test.js` can check them. A stage supplies:

- **measurement**: what is measured, shown from the start.
- **observations** and **observe(model, ctx)**: the observation record, kept per stage in `localStorage`.
- **steps** with a **phase** each; **formal**, shown from the formalize step on, in every mode.
- **num**: the global stage number (`1`, `3b`). The hash is `#s<num>`.
- **pair**, **questions**: the candidate pair card and the research questions in the bottom strip, from `research/graph.json` and `research/claims.json`.

The shared measurement grammar (`views/zeroIndicator.js`) reports "measurement → value" and draws an exact 0, a near 0 and a nonzero reading the same way in every stage. "Exact" is a property of how a state was constructed; the floating-point residual is printed separately.

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

## Research progress preview (read-only)

`research-preview/index.html` (served at `research-preview/`) is a second, separate page: a read-only view of what the
research has proved, falsified and left open. `src/preview/main.js` only lays out `research/preview.json`, which
`node research/tools/preview_data.mjs` generates from the canonical story, the Foundation, the registry, the #17 and C7
records, the application matrix, the ledger and the test files. `test/preview.test.js` checks that it is current. It
does not touch the journey store or any interactive.

## The levels (`try/`)

Three short stories on one page, in one style, a field magazine (since 2026-11-24): a white page, bold Times New
Roman (its 0 is a plain 0), ink black, one signature yellow, warm paper and earth tones, flat print shapes with offset
shadows (`src/levels/base.css`). `docs/levels_spec.md` governs. `try/level-2/` and `notebook/` forward here.

They read like a kids' science magazine about technology, and build one thought to its end (the spec's "All three
levels: the magazine, and the thought it builds"): one note hides many; there is far more hiding in a 0 than the
signal shows, and still so much we don't know, even frequencies our ears can't hear; is there any way to perceive
these hidden things? The Fourier transform shows that going from a whole to its hidden parts is possible; we have found
a few ways; what we have found is just the surface. Then ENERGEO: the start of a new science, energy geometry, which
sets out to map transformations like the Fourier transform and build tools to see what was always there.

- **The magazine** (`page.js`, `magazine.js`): each level opens with a cover (name, headline, question); an "Up next"
  card carries the thought into the next level; "The big idea" pull quotes stand out from the story. The final level ends on a map of transformations (`MAP`, `mapKnown`, `mapUnknown` in `src/math/prism.js`)
  and the name ENERGEO.

- **One screen per level** (`base.css`): each level fills the screen under the bar and nothing in it is below the
  screen. Wide screens: the board on the left, as large as fits, the words with Back and Next on the right; narrow or
  tall screens: the board on top, the words under it. Words that outgrow their space keep the newest line in view. The
  page scrolls only from one level to the next.
- Each level plays on one board, its lines clearing between parts. **You set the pace** (`src/levels/reader.js`),
  one way forward at a time: where you act (a button, a choice, a drag), that is the way on; lines of one part follow
  a beat apart and stay; only where the story would turn the page itself does Next appear, under the level. One bar for
  the whole story sits at the top: a section per level, each ending in its marker; each Next sends stars up into it,
  and a finished level's section is full, its marker filled. Back (or ←) pages through the parts already read (kept by
  `record.js`); Next pages forward to now.
- **Scroll through, on the side.** A button in the top bar opens "The whole story": every part of all three levels as
  a comic, a picture of the board above its lines, without playing anything. The comic is recorded from the levels:
  `npm run comic` (`tools/record_comic.mjs`) plays each level on `try/?record`, where `src/levels/record.js` keeps each
  part, and writes `src/levels/comic/`. `test/comic.test.js` checks the comic's words are still the levels' own.

- **Level 1, "Inside a note"** (the violin):
  - You are the first violin; before a concert every player tunes to one note, and tonight it is your A note. Here the
    player is introduced: your face (bucket hat, round glasses, yellow shirt) beside "That's me! No pressure." You bow
    the A and the orchestra tunes.
  - A magnifying glass zooms into the violin, then into its A string.
  - Inside the sound, the glass X-rays the A note into four hidden notes, which you tap to hear.
  - Together they flow into an ear, and you hear one A note.
  - Files: `src/levels/note.js` (with `copyNote.js`), `src/math/violin.js` and `src/math/tones.js`.
- **Level 2, "Inside the scanner"** (the MRI), which opens underneath when Level 1 ends:
  - You take an MRI scan of a patient: you stand beside the scanner; let's see if you can do it correctly.
  - Protons become ↑ and ↓ magnets. As each joins the TOTAL SIGNAL, +1 or −1 pops up beside its result, which counts
    with it; pairing them drives it to an exact 0 signal: "Oh no! I got 0 signal for my MRI!"
  - "Here's a look at some more protons in another part of your patient's body": covered drops whose signal is 0
    turn out to be full.
  - The magnet turns the 0 into a small signal it can read (though the 0 held far more). Radio waves come in and a
    faint reply goes out; [Take the scan], and the scanner paints a picture: "I did it! My first MRI scan!"
  - An eye sees one picture.
  - "Do you see a similarity to the violin level?" Side by side: one A note = four notes; 0 signal = ↑ + ↓ + ↑ + ↓.
  - Files: `src/levels/mri.js` (with `copyMri.js`), `src/math/pieces.js` and `src/math/scanner.js`.
- **The characters** (you, and in Level 3 the radiologist) are drawn the same in every level: `src/levels/characters.js`
  draws them from `src/math/characters.js`.

- **Level 3, "A prism for sound"** (its tag: "Final level"), which opens underneath when Level 2 ends:
  - The story picks up after the scan. In the dimmed concert hall the learner aims a stage light at the chandelier,
    and the glass hanging from it takes the white light apart into LED colours (red bent least, violet most). Only
    then is it called a prism. You (the player: a deadpan face with round glasses, dark hair, a yellow shirt and a
    bucket hat) wonder: "If a prism is a tool that can take apart light, is there a tool that can take apart a
    sound?" Surprise: your tuner.
  - The tuner draws the A note's signal and names it; the signal grows to fill the board. "Can you see them?" gets
    its own answer for Yes and for Not really, while bands mark the signal's repeats and a glowing copy of one repeat
    slides onto the next: the bumps are one shape, again and again, not the notes. Taking it apart gives four glowing
    bars, four pure tones. The learner drags the bars into a tuning fork and back.
  - At the break the hall's lights come up and the radiologist who read your scan (same style, copper hair, blue shirt,
    white coat) walks over: the MRI scanner works the same way. Then the people step away and your head comes back up,
    big and labelled (skin, skull, fluid, outer brain, inner brain): "Tap a part of the brain", "Now tap the skull".
    Each part's signal comes out of the spot you tap and runs to the data box, where its wave is drawn under its name. Nadia's paragraph comes in one part at a time, the earlier parts turning grey: each tiny
    magnet behaves differently depending on its body part; Collect the data (the head moves aside, one busy signal);
    Convert it to pixels (row after row, 48 × 48, exact); an MRI picture, with the Fourier transform.
  - "Do you notice a pattern?" One slide at a time, each caption under its own pictures and staying until Next:
    violin note → pure tones; stage light → its full color spectrum; MRI image → proton frequencies (the picture with
    its middle row marked, then that row's 48 frequencies as bars, exactly as the transform finds them). Then all three
    together, and the grand reveal: "the Fourier transform", the mathematical tool that lets us start seeing what
    hides inside. All three come down to the same geometric math; the applications are endless.
  - Review (not linked from the page): `try/?steps` shows every named step of Level 3 left to right, each frame the
    level itself stopped there (`try/?step=<id>`), with "Play from here" (`try/?from=<id>`: fast-forward, then play
    on). The steps are listed in `src/levels/stepsPrism.js`; the strip is `src/levels/storyboard.js`.
  - Files: `src/levels/prism.js` (with `copyPrism.js`) and `src/math/prism.js`. The app's own Fourier blocks
    stay in `src/math/fourier.js`.

`src/levels/page.js` starts Level 1 and opens each next level; `try/#level-2` and `try/#level-3` open one level on its
own, for review. `base.css` holds the shared page, prompt, buttons and choices. `test/note.test.js`,
`test/mri.test.js` and `test/prism.test.js` check the mathematics, the layout and the copy.
