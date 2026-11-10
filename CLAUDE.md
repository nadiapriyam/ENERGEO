# ENERGEO — instructions for Claude

Read these before any work, in this order:

1. `docs/claude_code_prompt.md`: the rules of work. The verifier decides, levels 1–4, step cards, gates, never move a threshold after a result.
2. `docs/objective.md`: the objective, which document governs what, terms, and level labels.
3. `docs/gate2_answers.md`, `docs/gate3_decisions.md`, `docs/restructure_decisions.md`: Nadia's decisions, verbatim. They govern wording. The restructuring decisions govern the sequence (Chapters/Acts I–IX; Chapter I is built).
4. `research/`: hypotheses H1–H3 (each opens with Nadia's exact words), connections C1–C9, open questions, sources, `graph.json` (the research graph: program, statements, relations, zero-producing sets, candidate pairs), `theories.json` (every theory with its provenance, evidence for and against, and history; ids listed append-only in `theories.ids`) and `theory_coverage.md` (generated from it by `node research/tools/build_coverage.mjs`; `test/theories.test.js` checks every quote).

## Discovery rules (every interactive from Chapter I on)

- DR-1: observe → manipulate → detect → conjecture → test → formalize. Never open a stage with the condition the learner is meant to discover.
- DR-2: do not reveal the object that explains a pattern before the learner can detect the pattern. The measurement's own definition stays visible.
- DR-3: when a new geometry enters, ask: what rules constrain it, which relations are preserved, what repeated behavior follows, and is it specific to this geometry?
- DR-4: the left pane shows the measurement and the observation record; the formal rule appears at the formalize step, in Guided, Explore and Advanced alike. Conjectures are actions (point, predict, classify, construct); learner conjectures never carry research status badges.
- `test/copy.test.js` and `test/graph.test.js` check these rules and the research graph.

## Layout

- `docs/`: the spec, the Master Map, the prompt, and gate records. These are Nadia's documents.
- `research/`: claims and their status. The app reads it and never writes it.
- `verify/`: card scripts (`verify_*.py`), card outputs (`cards/`), and the append-only ledger (`ledger/`).
- `src/`, `test/`: the app (Vite + three.js). `src/math` holds pure functions, tested with `npm test`. See `src/README.md` for the frame, the journey (carried objects) and how to add an interactive. Every visual element's position or state comes from `src/math`.

## Commands

- `npm test`: math unit tests (node:test).
- `npm run verify`: runs every `verify/verify_*.py` and appends the results to `verify/ledger/ledger.jsonl`.
- `npm run dev` / `npm run build`: the site. Pushing to `main` deploys it to GitHub Pages.

## Never

- Delete or edit a ledger line, or rewrite a FAIL. Add a new, clearly labelled card instead.
- Present a Level 3 or 4 claim as evidence, or call a result successful because a visual looks good.
- Work on the finite-energy (Energeo) application until Nadia asks.
- Call a zero-producing configuration set a kernel, fiber, manifold, equivalence class, null space or orbit in learner copy before its structure is established.
- Fill in a candidate pair's deeper common relation, or give a transfer question an answer. What cards establish goes in `sharedAlgebraicForm` with its `doesNotEstablish` list; pairs carry questions, and data is never derived across a pair.
- Delete, or silently rewrite, a theory of Nadia's because it is speculative, unproven or contradicted. Every user-origin theory has a record in `research/theories.json` with its original wording; evidence against it is attached, never used to erase it (`docs/restructure_decisions.md`, governing rule).
