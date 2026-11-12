# Four labelled spin-½ subsystems: the zero and its hidden sectors

The second quantum test of the two-zeros question (2026-11-12). The preregistration
`research/constructions/fourspin_mass_protocol.md` was committed at 966be69 before any label was computed.

| | Cards |
|---|---|
| Blind | `verify/verify_FS1.py` (FS1a–FS1f) |
| Reveal | `verify/verify_FS2.py` (FS2a–FS2e) |

Registry: `T-FOURSPIN-ZERO`, `T-FOURSPIN-GEOMETRY-BLIND`, `T-FOURSPIN-SYMMETRY`, `T-FOURSPIN-SIMPLEX`.

This is about the dimension of the state space, the relations that produce the zero, symmetry and hidden structure.
Four subsystems have nothing automatically to do with four spatial dimensions, and no spatial dimension is assumed
or proved here.

## 1. Construction target

The setting: many states share the exact zero S_z = 0, and they fall into hidden S² sectors.

The question: does the zero-producing contribution tuple separate those sectors? Does it do so alone, or only together
with a symmetry the system independently supplies? The zero is preserved throughout.

## 2. Source geometry

- **The space.** H = (ℂ²)^⊗4, with four labelled tensor factors. No indistinguishability or statistics are assumed.
- **The zero space.** S_z = Σᵢ S_z⁽ⁱ⁾ and H₀ = ker S_z, with dim H₀ = 6 (FS1a).
- **The raw basis.** The six two-up/two-down computational states, indexed by their up-positions {1,2}, {1,3},
  {1,4}, {2,3}, {2,4}, {3,4}.

## 3. Projection map

ψ ↦ C(ψ) = (c₁, c₂, c₃, c₄) with cᵢ = S_z⁽ⁱ⁾ψ, so Σcᵢ = 0.

The independently present symmetry is the 24 canonical factor permutations P_σ. They satisfy the covariance
P_σ S_z⁽ⁱ⁾ P_σ⁻¹ = S_z⁽σ⁽ⁱ⁾⁾ and commute with S_z (FS1b).

## 4. Exact identities

| Identity | Card |
|---|---|
| Every diagonal unitary (a phase on each raw state) commutes with every S_z⁽ⁱ⁾. The contribution Gram, and the Gram of (ψ, c₁ … c₄), depend only on the probabilities \|ψ_k\|². | FS1c |
| S² on H₀ has eigenvalues 0, 2ħ², 6ħ² with multiplicities 2, 3, 1. These are the S = 0, 1, 2 sectors. | FS2a |
| The S₄-fixed subspace of H₀ is one-dimensional. Its state has contribution Gram (ħ²/3)(I − J/4), the regular simplex. | FS1e |
| singlet(12)⊗singlet(34) (S = 0) and singlet(12)⊗\|1,0⟩(34) (S = 1) have identical contribution Grams. | FS2c |
| An S = 0 state with uniform \|amplitudes\| has the same Gram as the S = 2 state. | FS2c |
| The commutant of the S₄ action on H₀ has dimension 3. S² commutes with every P_σ. | FS2e |

## 5. Lower-dimensional realization

The contributions stay in H₀, because each S_z⁽ⁱ⁾ is diagonal on the raw basis. The S₄ action on H₀ permutes the
raw basis. Its invariant subspaces have dimensions 1, 3 and 2.

## 6. What is established

- **The contribution geometry fails, exactly (FS1c, FS2c).** D1 and D2 (Gram, rank, eigenvalues, norms) are blind to the relative phases between raw states. Exact pairs show that no function of them separates S = 0 from S = 1, or
  S = 0 from S = 2.
- **The symmetry action succeeds (FS2b).** The preregistered classes by cyclic dimension dim span{P_σψ} were 1, 3, 2.
  For all six blind targets they coincide with the hidden sectors S = 2, 1, 0.
- **Result: FOUR-SPIN-B.** The contribution geometry does not distinguish the sectors; the independently supplied symmetry does.
- **P1 holds, but its converse fails (FS1e, FS2d).** The S₄-fixed zero state has the regular-simplex contributions, and that is the T′ n = 4 configuration. But a regular-simplex Gram also occurs at S = 0.

## 7. What is derived

The exact rule from the brief, in this system:

> same visible zero (S_z = 0) + internal symmetry structure (the independently given S₄ action on the zero-producing
> tuple) → distinguishable hidden states (the S² sectors).

How each piece is classified:

- **The separation by S₄ is VALIDATION OF KNOWN MATHEMATICS (FS2e).** In the S_z = 0 weight space, S₄ acts
  multiplicity-free on three inequivalent irreducibles, [4], [3,1] and [2,2]. Because S² commutes with that action,
  it is constant on each block. That is Schur–Weyl duality. The blind class profiles D4c equal the normalized S₄
  characters.
- **What the project adds is a location, not a new label.** The distinction lives in how the system's own symmetry
  acts on the zero-producing tuple. The tuple's Gram geometry discards it, because the Gram is blind to phases.

## 8. What is NOT established

- A relationship not already implied by known spin and permutation theory. The test was procedurally blind, not
  mathematically novel.
- That all hidden information in a zero is symmetry information.
- That exchange or permutation is the geometry of zero.
- Anything about spatial dimensions.

## 9. Connection to Stage 2

- **Stage 2b.** This is the two-spin case of stage 2b, scaled to four subsystems. The two-spin result (exchange
  separates |1,0⟩ and |0,0⟩) has the same pattern.
- **Stage 2's first state.** The S₄-fixed four-spin zero state has the same regular-simplex contribution configuration
  as Stage 2's first state (G2i). The common reason is G3c: a zero sum plus full permutation symmetry forces the
  regular simplex.

## 10. Questions generated

| ID | Question |
|---|---|
| Q-SYM-NOVEL | Is there a system where "zero-producing tuple + independently supplied symmetry" separates states that no already-known label separates? This is the specific open obligation that would make the descriptor more than a validation. |

## 11. Next construction tests

None are scheduled. The stop condition of this pass applies. Six spins and larger groups are not pursued unless
Q-SYM-NOVEL identifies a specific candidate system.
