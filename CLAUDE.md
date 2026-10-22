# ENERGEO — instructions for Claude

Read these before any work, in this order:

1. `docs/claude_code_prompt.md`: the rules of work. The verifier decides, levels 1–4, step cards, gates, never move a threshold after a result.
2. `docs/objective.md`: the objective, which document governs what, terms, and level labels.
3. `docs/gate2_answers.md`, `docs/gate3_decisions.md`: Nadia's decisions, verbatim. They govern wording.
4. `research/`: hypotheses H1–H3 (each opens with Nadia's exact words), connections C1–C9, open questions, and sources.

## Layout

- `docs/`: the spec, the Master Map, the prompt, and gate records. These are Nadia's documents.
- `research/`: claims and their status. The app reads it and never writes it.
- `verify/`: card scripts (`verify_*.py`), card outputs (`cards/`), and the append-only ledger (`ledger/`).
- `src/`, `test/`: the app. `src/math` holds pure functions, tested with `npm test`.

## Commands

- `npm test`: math unit tests (node:test).
- `npm run verify`: runs every `verify/verify_*.py` and appends the results to `verify/ledger/ledger.jsonl`.

## Never

- Delete or edit a ledger line, or rewrite a FAIL. Add a new, clearly labelled card instead.
- Present a Level 3 or 4 claim as evidence, or call a result successful because a visual looks good.
- Work on the finite-energy (Energeo) application until Nadia asks.
