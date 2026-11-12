# ENERGEO — instructions for Claude

Read these before any work, in this order:

1. `docs/research_method.md`: HOW TO THINK/SEARCH. Outside-in geometry construction first; theorem-seeking and the existing-theorem scan second. Every research prompt also carries `docs/research_prompt_preamble.md`.
2. `docs/claude_code_prompt.md`: WHAT THE FOUNDING THEORY IS, and how verification and status work: the verifier decides, levels 1–4, step cards, gates, never move a threshold after a result.
3. `docs/objective.md`: the project objective and governance: research posture, which document governs what, terms, level labels.
4. Gate and restructure decisions: `docs/gate2_answers.md`, `docs/gate3_decisions.md`, `docs/restructure_decisions.md`. Nadia's decisions, verbatim. They govern wording. The restructuring decisions set the research method as a backbone decision. The sequence is `docs/act_map.md`: Foundation (Acts I–IV) → Guide through known mathematics → Translator/application; Chapter I is built, and the rev-3 Acts I–IX are kept there as superseded provenance. `docs/author_philosophy.md` holds the project's philosophical origin (provenance, not learner copy).
5. The research registry and graph in `research/`: hypotheses H1–H3 (each opens with Nadia's exact words), connections C1–C9, open questions, sources, `graph.json` (the research graph: program, statements, relations, zero-producing sets, candidate pairs), `theories.json` (every theory with its provenance, evidence for and against, history and proof target; ids listed append-only in `theories.ids`) and `theory_coverage.md` (generated from it by `node research/tools/build_coverage.mjs`; `test/theories.test.js` checks every quote).

**Research direction (primary):** outside-in geometry construction. **Construct first. Classify second. Preserve the zero. Investigate its geometry. Known structures are examples, not the boundary of the search space. Look from the outside in.** Existing mathematics is a reference library and validation surface, matched after a geometry has been constructed. It is not the ontology the geometry is assembled from. Order: foundational geometry → mathematical guide (Fourier, bases, forms, …) → translator (energy, Energeo, applications).

**Permanent rules:** Zero is a connector/interface, not automatically a lower-dimensional object. A construction must survive independent application before it can count as backbone proof. Low support means continue carefully, not discard. Archive only after repeated independent mathematical/empirical failure. Do not invent a geometry that only works because we designed it around the answer.

**Every substantive research result** carries a Backbone Support % and an AI Slop / Delusion Risk %, with the audit and application-validity tests of `docs/research_method.md` §12. Transfer tests go in `research/application_matrix.md`. A one-context construction is an EXAMPLE, not a BACKBONE PROOF.

**Research stance (within construction):** Every user-origin theory is a target theorem. Search narrowly for its exact representation, proof, invariant, transformation law or obstruction. Do not begin with plausibility assessment or adjacent analogies. Search as if the theorem holds; report only what the mathematics establishes.

Reported status (ESTABLISHED, DERIVED CONNECTION, HYPOTHESIS, OPEN QUESTION) is unchanged by this stance. It records how much is proved, never how hard to search. `test/method.test.js` guards this rule.

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
- Perturb a defining zero (make F(x) ≠ 0) to obtain information. Research performs zero-preserving interrogation: the defining zero relation is preserved, though other things in the state may change (never call it a "non-perturbing measurement"). Leaving the zero is allowed only in a separate experiment, labelled as one, that studies what is lost by leaving it (Zero Preservation Rule, a method rule; whether leaving destroys information is the separate hypothesis B-ZERO-LOSS).
- Close a search space with known mathematics. When writing "the possibilities are A, B, C", say whether the list is logically exhaustive (and by which theorem) or write: "These are known examples, not an exhaustive classification for this project." A behavior that fits no known category is kept as a candidate new class.
- Search for a named structure before constructing the relational object (derive the vectors, their Gram matrix and their relations first; compare with named theory after).
- Imply in learner copy that the R4 tetrahedral construction says anything about physical protons or a physical fourth dimension.
- Map Nadia's geometry into a known theory, or choose a structure (Hilbert space, Fourier, a group, a fiber, …) because existing mathematics uses it. Map known theory into the project's geometry, where justified, after construction.
- Call zero "the lower-dimensional object", or say a higher dimension automatically explains a zero.
- Use vague praise ("stronger", "closer", "promising", "interesting", "important", "suggestive") without the exact mathematical change, the Backbone Support % and why.
- Award 100% Backbone Support because a bespoke example fits, or alter a template to force agreement in the application matrix.
- Discard a branch because its percentages are low. Archive (never delete) only after repeated independent failure, keeping its provenance and failed reasoning.
- Treat a mathematical construction as physical validation (e.g. of proton/MRI behavior) because a visual resembles it; physical validation needs physical theory or data.
- Claim that a conscious observer causes collapse; use "measurement", "interaction" or "which-path information".
- Delete, or silently rewrite, a theory of Nadia's because it is speculative, unproven or contradicted. Every user-origin theory has a record in `research/theories.json` with its original wording; evidence against it is attached, never used to erase it (`docs/restructure_decisions.md`, governing rule).
