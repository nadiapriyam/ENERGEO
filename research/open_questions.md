# Open questions

Questions for Nadia. Answered questions are kept, with a pointer to the answer in your words.

## Open

| ID | Question | From |
|---|---|---|
| P-2 | **The paper PDF.** Claude can't reach arxiv.org, PMC or the Cornell PDF from this environment. Please add the PDF to `research/sources/` so the claim can be quoted directly. | [source card](sources/quinn2023.md) |
| C7-2 | What derivation would relate the eigenvalue decay of $J^TJ$ to coefficient decay of a specified $f$? This is open research, not a question that blocks anything. | [C7](connections/C7.md) |

## Answered

Answered at Gate 3 on 2026-10-22 unless the row says otherwise. Your words are in [`docs/gate3_decisions.md`](../docs/gate3_decisions.md) and [`docs/gate4_decisions.md`](../docs/gate4_decisions.md).

| ID | Question | Where the answer lives |
|---|---|---|
| H1-1 | What would show "the significance of orthogonality"? | Separability: zero cross terms, independent coefficients, Pythagoras/Parseval, residual ⟂ part, made visible through the Gram matrix. [H1](hypotheses/H1.md) |
| H1-2 | Which zero? | Orthogonality first. Null vectors are separate and compared later. Never merged. [H1](hypotheses/H1.md) |
| H2-1 | What is "the pattern"? | Object → Representation → Transformation → Invariant → Decomposition → Geometry, plus "what became visible / hidden". [H2](hypotheses/H2.md) |
| H2-2 | Orthogonality or $M$? | Both, in different roles: $M$ defines the geometry, orthogonality organizes it. [H2](hypotheses/H2.md) |
| H2-3 | What would false look like? | Four failure modes. Keep failures; the result may be several families. [H2](hypotheses/H2.md) |
| H3-1 | Which role of $c$? | The relation between the two roles (Level 3). [H3](hypotheses/H3.md), [C9](connections/C9.md) |
| H3-2 | Wrapping, compressing, quasi-periodic? | Compare all of them, without assuming they're the same. A schema with subclasses (Level 3). [H3](hypotheses/H3.md), [C8](connections/C8.md) |
| C-map | Is the H ↔ C mapping right? | Set at Gate 3; may change. Each `connections/C*.md` |
| C4-1 | Fourier series vs transform? | Split into C4a (transform on ℝ, rotation) and C4b (series on $S^1$, unitary coordinates). Your theory started from C4b. [C4](connections/C4.md) |
| C7-1 | What plays $f$ and what plays $e_k$? | A possible pairing exists, but it doesn't explain eigenvalue decay. Kept at Level 4. [C7](connections/C7.md) |
| C8, C9 | Approve? | Both approved, C8 reworded. [C8](connections/C8.md), [C9](connections/C9.md) |
| P-1 | Level labels? | Set at Gate 3. [objective](../docs/objective.md) |
| P-3 | Repo layout? | Approved with changes; applied. |
| G4 | The build form? | Option A, a Vite + three.js site with Python verifiers on GitHub Pages; first prototype Orthogonality and Zero. Answered 2026-10-23, [`docs/gate4_decisions.md`](../docs/gate4_decisions.md) |
