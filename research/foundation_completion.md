# Foundation completion ledger (V1)

Object IDs are from `research/foundation_dependencies.md`. Foundation V1 may contain open questions. What blocks
completion is limited to these five things:

- missing architecture;
- an unresolved contradiction;
- an undefined central object;
- an incorrect mathematical bridge;
- major provenance loss.

An open hypothesis does not block V1.

## LOCKED

- **The Foundation definition (2026-11-12).** The complete architecture, old and new.
- **The status system:**
  - ESTABLISHED / DERIVED / HYPOTHESIS / OPEN;
  - GOVERNANCE for method rules;
  - per-result ratings: Support %, Slop %, Transfer Depth, Breadth, Mathematical Status.
- **Method rules:**
  - B-OUTSIDE-IN;
  - B-NONEXHAUSTIVE;
  - B-ZERO-PRESERVE;
  - B-INDEPENDENT-DIRECTION;
  - B-INDEPENDENT-SYMMETRY;
  - the theorem-seeking stance within construction.
- **Provenance rules:**
  - original wording kept verbatim;
  - theories are superseded, never deleted;
  - the ledger is append-only;
  - FAIL cards are kept.

## MATHEMATICALLY ESTABLISHED (carded)

- **Representation and Fourier:** R1–R6.
- **Common forms and conservation:** CF1–CF6, CF8.
- **Zeros:** Z1–Z8, Z10.
- **Orthogonality and norm:** ON1–ON5, ON7.
- **Transformations:** T1–T3 (T3 assembled from separate cards).
- **Lorentz:** L1–L3.
- **Continuation:** I1.
- **Quantum:** QZ1, QZ4.
- **Mass–wave:** MW2 (E–p form only).

## PROJECT-CONSTRUCTED (carded, with assumptions and failure conditions)

- **Source geometry:** R8, H1, H2, H4, CF9.
- **Quantum same-zero:** QZ2, QZ3.
- **Cross-domain:** Z12.
- **The compass circle:** ON7 (stage contract).

## PAPER-BACKED

- R7, CF10, M1 (S14b weak, S14a FAIL kept), M2 (source card, PDF pending).
- Z9 (no card).
- W2 (no source).

## NEEDS ONE DERIVATION (textbook; one card each)

| Object | Derivation |
|---|---|
| T3 | combined continuous statement D_x(τ) = 1 − ρ_x(τ) with ρ_x ↔ \|x̂\|² |
| T4 | D_x(τ) ≈ (τ²/2)∫ω² dμ_x |
| CF10 | g = JᵀJ/σ² for Gaussian noise |
| Z9 | a model with a redundant parameter combination has g v = 0 |
| P1 | f̂(−k) = conj f̂(k) for real f |
| MW2 | ω² = c²k² + m²c⁴/ħ² from S12 with E = ħω, p = ħk |
| W1 | ∫ψ = 0 for a stated wavelet (needs the source first) |

## NEEDS CROSS-DOMAIN TEST (chosen before testing)

| Object | Test |
|---|---|
| CF11 | the common-form architecture on a geometry not yet used (for example, the Fisher metric's reparametrization isometries) |
| Z11 | zero as connector |
| H5 | the larger generating geometry |
| Q-SYM-NOVEL | a system where zero + independent symmetry separates what no known label separates |
| Q-DISTINGUISHED-MODE | a distinguished mode identified by a system before its zero is observed |

## NEEDS SOURCE

- The quinn2023 PDF (P-2).
- Mallat (scattering; ∫ψ = 0; stability).
- A Noether statement (CF7).
- Uncertainty (T5).
- Michaelis–Menten / effective manifolds (M3).
- Coarse-graining and RG (H6).
- **Provenance:** the ThermaLens implementation mathematics (A2), and the original wording of the mass-attraction
  intuition (MW3).

## NEEDS WORDING ONLY

- **Physical energy vs L² energy (A3)** in learner copy and records.
- **"Foundation" has two meanings:** the learner Acts I–IV, and the research architecture.
- **The act map** describes the Guide as "not the source ontology", although the older pillars are Foundation.
- **C7's title says "resembles".** Its target is an operator, map or theorem.
- **H2.md's "What false looks like"** should be phrased as an exact obstruction and refinement.

## OPEN LONG-TERM (not blocking V1)

- **Continuation and form:** ★ (I2); B-FINITE-INFINITE (I3); B-ORTHO-FORM (ON8); the two roles of c (L4).
- **Mass, fields and pairs:** the mass–wave seed (MW1); mass attraction (MW3); physical pairs (P2).
- **Information and models:** DYADIC PACKETS (W3); C7 (M4); information lost and recovered (W4); effective
  representations (H6).
- **Zero:** the inverse problem (H3); B-ZERO-LOSS; B-ZERO-INTERNAL-CHANGE; B-JOINT-ALTERNATIVES.
- **Philosophy:** the philosophical lenses (PL1).
- **Application:** Energeo (A1).

## Blocking items for Foundation V1

| Kind | Item |
|---|---|
| missing architecture | wavelets / scattering (W1, W2); effective / reduced representations (M2, M3, H6) |
| unresolved contradiction | the act map's Guide framing vs the Foundation lock; "Foundation" used for two things |
| provenance loss | ThermaLens mathematics; the original mass-attraction wording; Mallat and Noether sources; the quinn2023 PDF |
| bridge needing a card | T3, T4, CF10, Z9, P1, MW2 (the bridges are stated correctly, but uncarded) |
| undefined central object | none (DYADIC PACKETS is an open user term, not a central object of the spine) |

No incorrect bridge was found: every bridge in `research/foundation_bridges.md` names what it does not prove.

## Foundation ratings (separate dimensions, no overall score)

| Dimension | Rating | Reason |
|---|---|---|
| Foundation architecture completeness | 65% | All sixteen layers map onto the spine, with 84 objects and 28 bridges. Two branches have no mathematics in the repository (wavelets / scattering; effective reduction), and two framing contradictions remain. |
| Mathematical verification coverage | 78% | 47 of 60 established or derived objects have PASS cards (computed by `test/foundation.test.js`). The gaps are the eight uncarded bridges above. |
| Cross-domain validation | 20% | Two structural transfers, both textbook: equal-mass ↔ simplex, and the zero + symmetry architecture across spins and masses. No predictive transfer. No empirical system. |
| Project-specific construction maturity | 45% | The constructions are exact, with stated assumptions and failure conditions: R4, simplex, reconstruction, tight-frame boundary, WMC / C_G, blind spin and mass tests. None is mathematically novel, and the inverse problem is open. |
| Paper / source coverage | 20% | There is one source card (quinn2023), whose PDF is pending. There are no Mallat, Noether, uncertainty, Michaelis–Menten or RG sources. The spec and Master Map are assistant-written. |
| Application validation | 0% | Energeo is untested, and the ThermaLens mathematics is not in the repository. |

## Recommended remaining passes (by mathematical obligation)

1. **Provenance and sources.**
   - Source cards: Mallat; Noether; uncertainty; Michaelis–Menten; coarse-graining / RG.
   - Recover the quinn2023 PDF, the ThermaLens mathematics and the original mass-attraction wording, which Nadia
     must supply.
   - No new derivations.
2. **The older strands' missing cards:** T3, T4, P1, MW2, CF10, Z9, W1. All are textbook derivations, carded
   exactly.
3. **Common-form audit (CF11):**
   - finalize Part III;
   - decide CF11's status as the central architecture;
   - run one cross-domain test, preregistered: the Fisher reparametrization geometry, or the weighted metric of WMC
     generalized.
4. **Information-loss audit (W4):** one exact "what survives / what is lost" row per mechanism, scattering included
   once sourced. Ask Nadia for the intended meaning of DYADIC PACKETS.
5. **Model manifolds and C7:** an explicit operator for sums of exponentials (FIM) against coefficient decay. The
   outcome is a map or an exact obstruction.
6. **Continuation and c:** construction passes on ★ / H3 using CF8 and I1 (derive the behavior first), and on L4
   using the c-indexed family of forms (C9). This also prepares the compass-circle stage.
7. **Mass–wave and pairs:** the dispersion relation as a quadratic form in (ω, k). The massless case is the null cone
   (Z5); the massive case is a mass shell. Conjugate pairs (t, ω), (x, k). This is the construction target for MW1,
   with no QFT shortcut.
8. **Synthesis and freeze:**
   - reconcile the act map with the Foundation;
   - resolve the wording contradictions;
   - re-rate the six dimensions;
   - freeze V1.
