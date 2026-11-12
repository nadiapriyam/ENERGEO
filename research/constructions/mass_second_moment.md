# Mass-balance zero: what the zero-producing contributions reveal about the hidden second moment

The non-quantum test of the same analysis architecture (2026-11-12). It was preregistered in
`research/constructions/fourspin_mass_protocol.md`, committed at 966be69 before any second moment was computed.

| | Cards |
|---|---|
| Blind | `verify/verify_MB1.py` (MB1a–MB1b) |
| Reveal | `verify/verify_MB2.py` (MB2a–MB2c) |

Registry: `T-MASS-SECOND-MOMENT`, `T-ZERO-SYMMETRY-ARCHITECTURE`.

## 1. Construction target

Several configurations share the visible zero Σmᵢ(rᵢ − R_CM) = 0, and the zero is never left. Predict a hidden
property that the zero does not show: whether the second-moment tensor is isotropic. Use only the zero-producing
contributions and the symmetries the system independently has.

## 2. Source geometry

Equal point masses (m = 1) in ℝ² or ℝ³. The six configurations M1–M6 were fixed in the protocol:

- square;
- rectangle;
- rhombus;
- regular tetrahedron;
- an asymmetric configuration with an isotropic second moment, found by a search before the test;
- an asymmetric configuration.

## 3. Projection map

uᵢ = rᵢ − R_CM, with zero sum. The independently present structure is:

- permutations of equal masses;
- the Euclidean isometries O(d).

No particle exchange is imported.

## 4. Exact identities

| Identity | Card |
|---|---|
| Zero sum for every configuration. | MB1a |
| The stabilizer {σ : ∃Q ∈ O(d), Quᵢ = u_{σ(i)}} equals the Gram automorphisms, with Q computed exactly. | MB1b |
| T = UᵀU and G = UUᵀ have the same nonzero spectrum. | MB2b |
| T commutes with every stabilizer isometry. | MB2c |

## 5. Lower-dimensional realization

The contributions are the centered positions themselves, in physical space ℝᵈ. The symmetry acts on ℝᵈ by
isometries.

## 6. What is established

The blind predictions were fixed before T was computed (MB1b). The reveal (MB2a):

| Configuration | T | R2 (contribution Gram spectrum) | R1 (symmetry) |
|---|---|---|---|
| M1 square | isotropic | correct | correct |
| M2 rectangle | anisotropic | correct | no prediction |
| M3 rhombus | anisotropic | correct | no prediction |
| M4 tetrahedron | isotropic | correct | correct |
| M5 asymmetric | isotropic | correct | **missed** (trivial symmetry) |
| M6 asymmetric | anisotropic | correct | no prediction |

## 7. What is derived

- **Here, the contribution geometry alone suffices.** R2 cannot fail, because T and G share their nonzero spectrum.
  This is textbook.
- **Symmetry is sound but incomplete.** By Schur, R1 is never wrong when it predicts. It is silent whenever the
  stabilizer's action leaves a non-scalar symmetric commutant, and it misses accidental isotropy (M5).
- **So the roles are inverted relative to four spins:**
  - four spins: geometry blind, symmetry decisive (FOUR-SPIN-B);
  - mass: geometry decisive, symmetry sufficient but not necessary.
- **The common precise object.** An independently supplied group acts covariantly on the zero-producing tuple, and a hidden quadratic quantity commutes with that action. That quantity is scalar on every irreducible block of the
  action (Schur's lemma, textbook).
  - The quadratic quantity is S² for spins and T for masses.
  - The blocks are subspaces of H₀ for spins and ℝᵈ for masses.
- **The S_n-invariant zero gives the T′ regular simplex in both systems.** The four-spin S₄-fixed state does (FS1e),
  and so does the M4 tetrahedron (G2i). The common reason is G3c.

## 8. What is NOT established

- A mass-system fact that is not textbook. All three results (R2, R1 and the simplex) are known mathematics.
- That symmetry carries the hidden information in general. Here it does not: geometry does.
- Anything about physical protons or MRI.

## 9. Connection to Stage 2

- **Stage 3.** These are Stage 3's equal-mass systems.
- **M4.** M4 is Stage 2's first-state tetrahedron, read as a mass configuration (G2i, G4m).

## 10. Questions generated

None beyond Q-SYM-NOVEL (four-spin record).

## 11. Next construction tests

None scheduled, by the stop condition of this pass.
