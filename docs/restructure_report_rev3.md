# Acts I–IX Restructure Report (revision 3): recovered register

Recovered on 2026-11-16 (Act VIII story-integration pass) from the session copy of the revision-3 report (an HTML file that was never committed). The report was written by Claude, prepared from the repository at commit 3309ee8; it is a proposal document, not Nadia's words. Entries marked "Decided" implement Nadia's decisions D1–D6 and D13, which are recorded verbatim in `docs/restructure_decisions.md` ("Revision 3 decisions"); her Pair B decision, which AMB-7 implements, is recorded verbatim there under "Revision 2 decision: Pair B (recovered 2026-11-16)". The HTML was converted to text; no wording was changed. Later records that cite AMB-n refer to the entries below.

## Revision 3 decisions (D1–D13), as recorded in the report

- Decision — Entries affected — Revision 3
- D1 — AMB-1, AMB-17, §0 — Hierarchy: the program holds the primary backbone, the secondary backbone, the invariant-geometry direction, H1, H2, H3, and further hypotheses and questions including ★. H1–H3 are not rewritten, replaced or merged. ★ is cross-linked to H3, not merged. Energeo stays OPEN QUESTION.
- D2 — AMB-2 — Chapter I = Act I. "Chapter" is the learner-facing word, "Act" the internal one. Stage numbers are global.
- D3 — AMB-3, stage 2, TQ-6 — Stage 2's object: nonzero mj ∈ ℝ³, no positions. Equal magnitudes in the first state, varied afterwards. The zero is the full resultant Σ mj = 0, with no measurement axis. Exact first; the numerical residual is shown separately. No quantum machinery; no MRI simulation.
- D4 — AMB-4, stage 3 — Discrete point masses, all positive, so M > 0 and the zero of F is unique. No signed weights in Chapter I.
- D5 — AMB-5, AMB-19, AMB-20, Pair A, TQ-1–TQ-6, stage 3b — Act I returns to stage 2 after stage 3 (stage 3b, Return to the Zero). The core stage 2 exploration is zero-preserving change. TQ-1 to TQ-6 rewritten: transfer the question, not the source system's objects.
- D6 — R-1, R-3 — Distinct visuals (abstract vectors; a microscopic directional ensemble; masses in space) with a shared measurement grammar. Stage 1's drawing is not reused in stages 2 and 3.
- D13 — AMB-21, AMB-22, AMB-23, R-20 — Left pane: measurement definition and observation record, then the formal rule only after formalization. The order holds in Guided, Explore and Advanced. Conjectures are actions; free text is optional and never gates progress.

## Revision 2 changes to ambiguity entries

- Revision 2: ambiguity entries
- Entry — Revision 1 — Revision 2
- AMB-3 — Stage 2's object: lengths, "quantum", axis, exact vs near. — Adds: do the contributions have positions as well as directions? (Transfer question TQ-6 depends on it.)
- AMB-5 — Pair A: is a counterpart of R expected in stage 2? — Decided: Pair A is a directed research program, source = mass balance, target = proton cancellation. Remaining: wording of the transfer questions; the old "counterpart of R" question becomes TQ-2.
- AMB-7 — Pair B: is the circle the domain or where the values lie? — Decided: Pair B is not reduced to the circle. ★ research statement and the broader research question recorded. Domain/codomain kept as a secondary note. Remaining: the terms of ★ ("bound by rules", "periodic", "can be").
- AMB-11 — Stage 9: real or complex; which M. — Deferred to the stage 9 mathematical design review, together with the transformation families.
- AMB-12 — Stage 9 defines "admissible" by A†MA = M, so preservation holds by definition. — Decided: discovery order. A†MA = M is the conclusion, not the premise. Remaining: whether the stage bears on the invariant-geometry hypothesis as evidence (goes to AMB-18).
- AMB-17 — Can a pair be a HYPOTHESIS? — Decided: yes; pair status has four values. Remaining: the Energeo badge.
- AMB-18 — How the primary and secondary hypotheses could fail. — Adds ★, stage 9's evidence question and the two zero-inference questions.

## Ambiguity register (revision 3)

Decided parts are marked with a rule on the left. Everything else is open and is not resolved here.

### AMB-1: The new backbone and H1–H3 rev 3

Decided. Hierarchy (D1): the research program holds the primary backbone, the secondary backbone, the invariant-geometry direction, H1, H2, H3, and further hypotheses and questions including ★. H1–H3 are not replaced, merged or rewritten. ★ is a distinct HYPOTHESIS, cross-linked to H3.

### AMB-2: Chapter I and Act I; stage numbering rev 3

Decided. Chapter I = Act I. "Chapter" is the learner-facing word; "Act" is used internally. Stage numbers are global through the journey (1, 2, 3, 3b, then 4…), so the experience reads as one investigation.

### AMB-3: Stage 2's object rev 3

Decided. Nonzero directional contributions m1, …, mn ∈ ℝ³ with no positions (positions would import the mass representation before anyone knows whether position matters). Magnitudes may vary; the first constructed state uses equal magnitudes. The zero is the full resultant, Σ mj = 0, with no measurement axis; component-wise zeros enter later. Exact cancellation first; near-zero is a later extension, and floating-point tolerance never redefines the object. "Quantum" is the historical and conceptual origin; no quantum machinery and no MRI simulation are added.

### AMB-4: Stage 3's weights rev 3

Decided. Discrete point masses, all positive, so M = Σ mi > 0 and F(R) = 0 ⟺ R = RCM. No signed weights in Chapter I.

### AMB-5: Pair A rev 3

Decided. A directed research program: mass zero → learn what mathematical information its zero contains → derive structural questions → return to the proton zero → apply those questions without assuming the same objects exist. The direction is epistemic, not physical. No shared mechanism is asserted; no RF excitation or field change. Transfer questions TQ-1 to TQ-6 are rewritten under one rule: transfer the question, not the source system's mathematical objects (§9). They are research prompts with no answer field.
Open. The candidate common relation (deliberately empty).

### AMB-6: Stage 4's ring field

Is q(θ) static, or does it change with time? How is it given on screen: drawn by the learner, a formula, or samples? Heat flow along the ring is not brought in unless you ask.

### AMB-7: Pair B rev 2

Decided. Pair B is not reduced to "both use a circle". Research statement, your words, HYPOTHESIS: "★ Any geometrical object that is bound by rules can be periodic." Research question, OPEN QUESTION: "What observable rules arise because an object is constrained by a particular geometry?" The circle is one transparent case, geometric structure → constraints / symmetries → repeated behavior, with eiθ, sin θ, cos θ as a recognizable example. Not encoded anywhere: "periodicity = circular geometry"; "all periodicity comes from S¹". Every later geometry is examined separately with the geometry prompt (DR-3). Pair B stays nondirectional.
Kept as a secondary mathematical note: stage 4 uses the circle as the ring's domain; stage 5 uses it as the set where eiωt takes its values.
Open, in the ★ sentence. (a) "Bound by rules": constraints, symmetries, preserved relations, or all of these? The prompt's questions 1 and 2 name both constraints and preserved relations. (b) "Periodic": exact return only, or near return as well? The repository's C8 already separates wrapping (exact return, C8a) from quasi-periodic winding (near returns only, C8d). (c) "Can be": does such an object admit some periodic behavior, or does it always show one?

### AMB-8: Stage 6's signal

Which signal is f: the existing example signal, the stage 4 ring field, or a time signal? Deriving f from the ring would build a bridge across Pair B (R-2). If f's origin changes, the journey storage key moves to v3.

### AMB-9: Stage 6's probe

Integer k only, or a continuous ω? A non-integer probe on [0, 1] is not one of the orthonormal ek, so its zero would belong to a different functional. Keep T = 1?

### AMB-10: Stage 8's boxed sentence

Is "lack of direct visual access does not imply lack of geometric structure" shown as ESTABLISHED through its instances, as a HYPOTHESIS, or as a framing line with no badge?

### AMB-11: Stage 9's setting rev 2

Deferred to the stage 9 mathematical design review: real or complex; which M; which transformation families.
Facts the review has to account for (unchanged): for antisymmetric J, BJ(x, x) = 0 for every x (C1a), so a preserved null relation is automatic there; BM(x, y) = 0 covers two zeros, orthogonality (x ≠ y) and a null vector (x = y), which H1-2 keeps apart; forms.js is real 2×2 only.

### AMB-12: Stage 9 and "admissible" rev 2

Decided. Stage 9 does not define admissible transformations by A†MA = M. Order: begin with a zero relation; apply several transformations; compute the relation before and after; the learner identifies which preserve it; compare preserving with non-preserving; infer the common constraint; derive A†MA = M last. The formal equation is the conclusion of the stage, not its premise. This order is the project rule DR-1.
Open. (a) The transformation families and M (AMB-11). (b) The evidential status. The learner finds which of the offered transformations preserve the relation; the invariant-geometry hypothesis speaks of "the admissible transformations of a space". Whether stage 9 counts as evidence for it depends on what counts as evidence (AMB-18). Until then, stage 9 bears on the hypothesis and does not test it.

### AMB-13: Act VI terms with no repository content

Wavelets, modulus, scattering and DYADIC PACKETS have no definition, card or source in the repository. What is a dyadic packet in your usage? No definition is imported in the meantime.

### AMB-14: Act VII's "null directions"

Three readings fit the repository's vocabulary: a zero eigenvalue of a positive semi-definite metric; a null vector of an indefinite form (C5); a small but nonzero eigenvalue (a sloppy direction). Which one?

### AMB-15: Act VIII's conjecture wording

Master Map #18: "Adding an infinite object like time to a finite circle geometry makes sines and cosines converge to infinity." Gate 2, answer 6: "An unbounded time parameter combined with a finite circular geometry generates an indefinitely continuing sine/cosine evolution whose values remain bounded." The later wording applies unless you say otherwise.

### AMB-16: Old Master Map topics without a place

#1 What is a signal?, #2 Music, #13 Zero as a mathematical cornerstone (close to Chapter I), #17 Conjugacy and physical pairs (close to the candidate-pair motif). Retire, fold in, or keep as optional? Your brief also needs recording as the document that now governs sequence; docs/objective.md still names the Master Map.

### AMB-17: Status vocabulary rev 3

Decided. A candidate pair can be open, hypothesis, derived or established. Energeo stays OPEN QUESTION.
Open. What moves a pair from open to hypothesis.

### AMB-18: How the new hypotheses could fail rev 2

Primary: what would count as evidence of "an underlying geometric constraint", and what would count against it, as H2-3 did for H2? Secondary: what makes a representation "appropriate"? Without a restriction, any two systems can be given representations in which they satisfy the same relation. Invariant-geometry: whether stage 9 counts (AMB-12). ★: under readings (a)–(c) of AMB-7, what object would be a counterexample? The two zero-inference questions: what would count as information inferred "while it remains zero"?

### AMB-19: Act I after stage 3 rev 3

Decided. Act I returns to the proton zero after stage 3: stage 3b, Return to the Zero. "We began with a zero we did not understand. We studied another zero whose hidden structure is known. What questions can we now bring back to the first zero?"

### AMB-20: "While it remains zero" at stage 2 rev 3

Decided. The core exploration is zero-preserving change: a constrained mode in which changing contributions updates others so that Σ mj stays exactly zero. The learner meets the same observed zero with different hidden configurations. A perturbation mode that leaves the zero set is a later addition, not the primary investigation. No external-field change is used.

### AMB-21: The left pane before formalization rev 3

Decided. Measurement definition plus a live observation record; the formal rule joins them only after formalization (DR-4).

### AMB-22: Discovery gating in Explore and Advanced rev 3

Decided. The order applies in all three modes. Advanced adds raw numbers, residuals, matrices and card references, never the relation before it is reached; after formalization it shows the full derivation.

### AMB-23: How a learner states a conjecture rev 3

Decided. By an action: point, predict, classify, construct. No free text as the main mechanism; no multiple choice whose options reveal the theorem. Free text is an optional notebook that never gates progress.

## Acts VI–IX rows (mapped to existing material; Act VIII is the finite / infinite act)

| Act | Topics | Material in the repository then | Cards | Status then |
|---|---|---|---|---|
| Act | Your topics | What the repository already has | Cards | Status now |
| VI | Information Lost and Recovered. magnitude/phase → mean-square convergence → wavelets → modulus → scattering. DYADIC PACKETS tracked. | Spec Block 16; Master Map #10, #12; the symmetry defect sees amplitudes, not phases (Block 5); C8's boundary-approach row | B5a FAIL (kept), B5a2, B5b, C8c FAIL (kept), C8c2, S2b, S7, B4a | Magnitude/phase and mean-square: ESTABLISHED instances. Wavelets, modulus, scattering, dyadic packets: nothing in the repository (AMB-13). No implementation. |
| VII | Geometry of Models. prediction manifolds → Fisher metric → null directions → sloppiness → effective models | Spec Blocks 11, 12, 13, 17; Master Map #15, #16; C7; quinn2023.md | S14a FAIL (kept), S14b (weak); S7 only inside C7, never as evidence | C7 OPEN QUESTION. "Null directions" undefined (AMB-14). Paper PDF missing (P-2). |
| VIII | Finite / Infinite Representation. circle + unbounded parameter → periodicity → your infinity conjecture → c → ∞ → relativity | H3; C8; C9; C3 (supporting exploration only); Spec Blocks 9, 10, 14; Master Map #18, #19 | C8a–d, C9a–d, S5a–d, S4a–d, S10, S12, B5c | Instances ESTABLISHED; H3 HYPOTHESIS; conjecture wording AMB-15. ★ and the geometry prompt recur here (torus, cylinder). |
| IX | Energeo. "Can energy behavior be represented so that hidden balance and invariant structure become geometrically explicit?" | Master Map #20 (parked); Spec Block 18 | none | OPEN QUESTION. Parked until you ask. A downstream test domain, not evidence. |

## Decisions still needed at review (revision 3)

- | R-23 new | Stage 2's constrained mode, in which one contribution adjusts to keep the total at zero, reads as a physical coupling between protons. | The screen says what it does: it adjusts a chosen contribution so the total stays zero. It is a way of moving within the zero-producing set, not a physical process.
- | R-21 new | A learner's in-stage conjecture ("zero only when opposite") gets a HYPOTHESIS badge and is confused with your research hypotheses, or the reverse. | Learner conjectures use their own element, never the research status badges. Research hypotheses never appear as a learner conjecture to be confirmed.
- 11
- Decisions needed at review rev 2
- rev 3 D1–D6 and D13 are decided. Remaining, act by act:
- D7: The ring field (AMB-6); the terms of ★ (AMB-7 a–c). Needed for Act II.
- D8: Stage 6's signal and probe (AMB-8, AMB-9).
- D9: Stage 8's sentence (AMB-10); the stage 9 mathematical design review (AMB-11).
- D10: Old Master Map topics (AMB-16).
- D11: Acts VI–VIII terms (AMB-13, AMB-14, AMB-15).
- D12: How the new hypotheses could fail (AMB-18).
- What moves a pair from open to hypothesis (AMB-17).

Revision 3, prepared from the repository at commit 3309ee8: research/, verify/ledger/latest.json (76 rows, 73 PASS, 3 FAIL kept), docs/ gate records, the design spec, the Master Map and the current interactives' source. Proposal only; nothing has been implemented.

## Status of the Act VIII entries (2026-11-16)

- AMB-1: decided (D1). H1–H3 are not replaced, merged or rewritten; ★ is a distinct HYPOTHESIS cross-linked to H3. Act VIII keeps H3-original (T-H3) and STAR-original (T-STAR) apart (T-ACT8-GOV).
- AMB-7: Pair B decided (not reduced to the circle). The terms of ★ (a) "bound by rules", (b) "periodic", (c) "can be" were left open here; Act VIII tests them as the readings STAR-A (forced periodicity, FAIL), STAR-B (existence, RESTRICTED) and STAR-C (recurrence, RESTRICTED) without rewriting ★ (`research/constructions/act8_finite_infinite_h3_c.md`).
- AMB-15: the later wording (Gate 2) applies; the Master Map #18 wording is kept as the historical conjecture T-TIME-CIRCLE-0, classified FAIL in Act VIII (A8Cc).
