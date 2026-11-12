# Quantum Additive Cancellation Pair

A separate research object (2026-11-12). It is not part of Pair A: the spin pair stays distinct from the MRI-motivated
ensemble. Cards: `verify/verify_Q2.py` (Q2a–Q2g), `verify/verify_W3.py` (W3a–W3b), `verify/verify_W2.py`
(W2a–W2f). Blind protocol, pre-registered before the cards ran: `research/constructions/qacp_blind_protocol.md`.
Registry: `T-QACP`, `T-QACP-OBSTRUCTION`, `T-QACP-EXCHANGE`, `Q-QACP-C`, `Q-SAME-ZERO`.

## 1. Construction target

Two states both satisfy S_zψ = 0 exactly. Determine what distinguishes the two zeros while both remain zero, using
only structure present inside the zero-producing contributions. This is a zero-preserving interrogation. S² is used
only as validation data, never as the descriptor.

## 2. Source geometry

The setting:

- the two-spin-½ state space ℂ² ⊗ ℂ², with basis |↑↑⟩, |↑↓⟩, |↓↑⟩, |↓↓⟩;
- the decomposition of one observable by particle, S_z = S_z⁽¹⁾ + S_z⁽²⁾, with S_z⁽¹⁾ = (ħ/2)σ_z ⊗ I and
  S_z⁽²⁾ = (ħ/2) I ⊗ σ_z.

The states:

- X = (|↑↓⟩ + |↓↑⟩)/√2 (revealed later as |1,0⟩);
- Y = (|↑↓⟩ − |↓↑⟩)/√2 (revealed later as |0,0⟩).

The three levels, kept separate:

- **Level A, additive algebra:** y₁ + y₂ = 0. This is trivial.
- **Level B, source construction:** one state plus a decomposition of an observable gives two nonzero state-space
  contributions whose total action is exactly zero.
- **Level C, larger geometry:** open.

## 3. Projection map

ψ ↦ (c₁, c₂) = (S_z⁽¹⁾ψ, S_z⁽²⁾ψ). This is the internal-zero representation of ψ.

## 4. Exact identities

| Identity | Card |
|---|---|
| S_z⁽¹⁾X = +(ħ/2)Y and S_z⁽²⁾X = −(ħ/2)Y; S_z⁽¹⁾Y = +(ħ/2)X and S_z⁽²⁾Y = −(ħ/2)X. All four are nonzero, and each pair sums to 0. | Q2a |
| Gram(c₁, c₂) = (ħ²/4)[[1, −1], [−1, 1]] for both states. Gram(ψ, c₁, c₂) is identical for both (each contribution is orthogonal to its own state). | Q2b |
| U = exp(iπS_z⁽¹⁾/ħ) = diag(i, i, −i, −i) is unitary and commutes with S_z⁽¹⁾ and S_z⁽²⁾. It maps X → iY and each contribution of X → i·(the matching contribution of Y). It does not commute with the exchange P or with S². | Q2c |
| With the canonical exchange P of the two tensor factors, Pc₁ = ε c₂ gives ε(X) = +1 and ε(Y) = −1. ε equals the exchange parity of the state, because P S_z⁽¹⁾ P = S_z⁽²⁾. With V = PU, which also swaps the summands, ε is undefined for both states. | Q2d |
| After the descriptors were fixed: S²X = 2ħ²X and S²Y = 0. The identity S² = ħ²(1 + P) holds on the whole space (a textbook identity, secondary). | Q2e |
| For ψ = α\|1,0⟩ + β\|0,0⟩: S_z⁽¹⁾ψ = (ħ/2)(β\|1,0⟩ + α\|0,0⟩), and ⟨S_z⁽¹⁾⟩ = ħ Re ρ_AB = −⟨S_z⁽²⁾⟩. S_z⁽¹⁾ has zero diagonal in the {\|1,0⟩, \|0,0⟩} basis. | W3a |
| \|↑↓⟩ has S_z = 0 but is not an exchange eigenstate. Its contributions are ±(ħ/2)\|↑↓⟩, parallel to the state, and ε is undefined. | Q2g |

## 5. Lower-dimensional realization

The contributions never leave the S_z = 0 eigenspace span_C{|1,0⟩, |0,0⟩}. Inside it, S_z⁽¹⁾ acts as (ħ/2) times the
swap of the two sector states. The zero of each state is built from the *other* state:

- the triplet's contributions are ±(ħ/2)|0,0⟩;
- the singlet's contributions are ±(ħ/2)|1,0⟩.

## 6. What is established

- **Both zeros are exact cancellations of nonzero vectors (Q2a).** This is ESTABLISHED.
- **Obstruction (Q2b, Q2c).** The zero-producing structure alone cannot tell the two zeros apart. Here that structure
  means the state, the two contribution operators and the inner product. A symmetry of that structure (U) maps one
  internal-zero configuration exactly onto the other. Every descriptor built from it agrees on both states: Gram
  matrices, norms, signs, spans up to that symmetry.
- **What separates them (Q2d).** The canonical exchange of the two identical subsystems, P, which commutes with S_z.
  With P, the relation between the two contributions differs: Pc₁ = +c₂ for the triplet and Pc₁ = −c₂ for the singlet.
  Equivalently, the triplet's contributions lie in the exchange-antisymmetric sector and the singlet's in the symmetric
  sector. A different summand-swapping unitary (V = PU) defines no ε, so the separating structure is precisely the
  canonical identification of the two factors.
- **ε carries the same information as S².** By the covariance identity, ε equals the state's exchange parity. By the
  textbook identity S² = ħ²(1 + P), that parity determines S² (Q2e). Nothing beyond the known quantum labels
  distinguishes the two zeros in this representation. What the pass adds is *where* the distinction lives: in how the
  system's exchange acts on the two cancelling contributions.

## 7. What is derived

- **Answer to the success question.** Can two systems with the same exact zero be geometrically distinguished using
  structure that remains present while the zero is preserved?
  - Not by the zero-producing structure alone (exact obstruction).
  - Yes, once the representation includes the exchange of identical subsystems. That structure is present and
    zero-preserving: [P, S_z] = 0.
- **The comparison with T′.** It is covariance, not the sum.
  - In T′, every transposition of the source basis commutes with Pₙ and maps vᵢ → vⱼ with sign +1 (Q2f). For n = 2,
    the shadows lie in the swap-antisymmetric line.
  - In the quantum pair, the exchange maps c₁ → ε c₂ with ε equal to the source state's parity.
  - So the triplet's internal cancellation has the same exchange behavior as T′'s n = 2 member: sign +1, with the
    contributions in the antisymmetric sector. The singlet's has the opposite sign.
- **What the S² dephasing removes (W3a).** It removes exactly the cross-term information ρ_AB, which is the
  expectation-level composition of the zero: ⟨S_z⁽¹⁾⟩ = ħ Re ρ_AB.

Comparison with Stages 1 and 2 (item 5 of the brief):

| | Stage 1 | Stage 2 | Quantum pair |
|---|---|---|---|
| objects summed | v, −v ∈ ℝ² | c₁ … cₙ ∈ ℝ³ | S_z⁽¹⁾ψ, S_z⁽²⁾ψ ∈ ℂ⁴ (inside the S_z = 0 eigenspace) |
| source of contributions | free choice; the second is forced to −v | free, subject to one vector constraint; the first state realizes T′ (G2i) | one state and a decomposition of one observable by particle |
| codomain | ℝ² | ℝ³ | span_C{\|1,0⟩, \|0,0⟩} |
| constraints | c₂ = −c₁ | Σcⱼ = 0 only | c₂ = −c₁ and c₁ = S_z⁽¹⁾ψ, determined by ψ |
| transformation behavior | rotations | common linear maps (Z4a), twists (Z2c) | unitaries commuting with S_z⁽¹⁾ and S_z⁽²⁾; the exchange P maps c₁ → εc₂ |
| what survives the zero | the contributions themselves | the contributions; their Gram matrix | norms ħ/2; ε, once P is included |
| what the zero hides | nothing beyond the sum | everything except Σ | which state in a two-dimensional complex family |

Level A is the same in all three columns, and that is TRIVIAL CONSEQUENCE. Level B differs:

- Stage 1 is a free pair;
- Stage 2's first state is the image of an orthonormal source under one map;
- the quantum pair is the image of one state under two exchange-related maps.

The only shared source constraint found is exchange covariance with sign +1. It holds for T′ (all n) and for the
triplet. It fails for the singlet.

## 8. What is NOT established

- **A geometric descriptor beyond known quantum structure.** ε is the exchange parity, already known to determine S².
- **A predictive transfer.** The blind test separated X and Y, but the S² values were predicted only through a
  textbook identity. The test was procedurally blind, not blind in knowledge.
- **Level C.** That the source construction belongs to the simplex family, to centering, to projection, or to any
  larger geometry.
- **Physics.** Anything about the MRI-motivated ensemble or about protons.

## 9. Connection to Stage 2

**Stage 2b.** These are Stage 2b's own states A and B. The stage shows that S_z returns 0 for both and that S²
separates them. This record adds the zero-preserving picture behind it:

- both zeros are cancellations of nonzero contributions;
- the contributions' Gram geometry is identical;
- they differ only under the exchange of the two particles.

**Stage 2.** There is no direct link to Stage 2 (the ensemble). The comparison table above keeps the two apart.

## 10. Questions generated

| ID | Question |
|---|---|
| Q-QACP-C | Does the source construction reveal a representation/geometric structure analogous to any previously constructed zero? (Nadia's words; Level C, open) |
| Q-SAME-ZERO | Can two systems with the same exact zero be geometrically distinguished using structure that remains present while the zero is preserved? (Nadia's words) Answered here in a special case: obstruction without the exchange, separation with it. |
| Q-QACP-1 | For four spin-½ (S_z = 0 requires an even number), the S_z = 0 sector has dimension 6 and the exchange group is S₄. Does the internal-zero representation (c₁, …, c₄) together with the permutations separate states that share every other zero-preserving label? |
| Q-QACP-2 | Is there a non-quantum system where the contributions to a zero are generated from one source by exchange-related maps, so that the covariance sign ε can be computed unchanged? |

## 11. Next construction tests

1. **Q-QACP-1.** Four spin-½ in the S_z = 0 sector (dimension 6). Compute the four contributions and their behavior
   under S₄ before reading any S² labels. Use a blind protocol registered in advance. Three spin-½ cannot have
   S_z = 0.
2. **Q-QACP-2.** Search the existing project systems for exchange-related generating maps. Mass balance with equal
   masses has permutations that act on the source, which is the T′ type. A system of the quantum type (one source,
   several exchange-related maps) has not yet been identified.
3. **Keep the failure condition.** States that are not exchange eigenstates (|↑↓⟩) have no ε (Q2g).
