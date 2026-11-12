# Application matrix

## Version 4 (four-spin and mass pass, 2026-11-12): current

This version tests the analysis architecture: zero-producing contributions, plus an independently supplied symmetry,
give a descriptor of a hidden label. It is tested blind in a quantum system and a non-quantum system. The
preregistration (`research/constructions/fourspin_mass_protocol.md`) was committed at 966be69, before any label.

| System | Visible zero (kept) | Hidden target | Contribution geometry (D1/E1) | Independent symmetry (D4/E2) | Result | Transfer Depth | Mathematical Status | Backbone Support % | AI Slop / Delusion Risk % | Application Breadth | Exact failure condition |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Two spin-½ | S_z = 0 | \|1,0⟩ vs \|0,0⟩ (S²) | FAIL (Q2b; restricted lemma Q2h) | exchange P separates (Q2d) | geometry blind, symmetry decisive | NOT YET FORMALIZED (within the spin family) | PROJECT-DERIVED FROM KNOWN DEFINITIONS | 40 | 8 | 1 | non-eigenstates of P (Q2g) |
| Four labelled spin-½ | S_z = 0 (dim H₀ = 6) | the S² sectors S = 0, 1, 2 | FAIL (FS1c, FS2c: identical Grams across sectors) | the S₄ cyclic dimension 1/3/2 separates all sectors, blind (FS2b) | FOUR-SPIN-B | NOT YET FORMALIZED (within the spin family) | TEXTBOOK / KNOWN (Schur–Weyl, FS2e) | 40 | 8 | 1 | none in H₀ |
| Four-spin S₄-fixed zero | S_z = 0 | — (prediction P1) | regular-simplex Gram (ħ²/3)(I − J/4), as predicted (FS1e) | full S₄ stabilizer | the T′ n = 4 configuration reappears | STRUCTURAL TRANSFER | PROJECT-DERIVED FROM KNOWN DEFINITIONS | 35 | 10 | 2 | the converse: the same Gram occurs at S = 0 (FS2d) |
| Mass balance, equal masses, M1–M6 | Σuᵢ = 0 | second-moment isotropy | R2 right for all six (MB2a, MB2b) | R1 right when it predicts (M1, M4); misses M5 | geometry decisive, symmetry sound but incomplete | NOT YET FORMALIZED (within mass) | TEXTBOOK / KNOWN | 25 | 5 | 1 | R1: accidental isotropy without symmetry (M5) |
| Cross-domain architecture | both zeros kept | S² / second moment | inverted roles | in both, a group acting covariantly on the zero-producing tuple; the commuting hidden quadratic is scalar on irreducible blocks (Schur) | the same precise object in both systems | STRUCTURAL TRANSFER | TEXTBOOK / KNOWN | 35 | 20 | 2 | a system where neither geometry nor symmetry carries the hidden label |

**Novelty.** Every blind result above is procedurally blind and reproduces known mathematics. All are classified as
VALIDATION OF KNOWN MATHEMATICS. No nontrivial predictive transfer.

## Version 3 (two-zeros pass, 2026-11-12): kept

Nothing was forced. The seven rows of version 2 stand unchanged (below). This version adds two things:

- the internal-zero descriptor ε, applied unchanged to every system where its ingredients exist;
- an Application Breadth count for every construction (`docs/research_method.md` §12.2a).

**Descriptor under test.** Write the zero as a sum of contributions c₁ + c₂ (+ …) = 0, generated from a source. Let
the system's own exchange of labels act on the contributions. ε is the sign in E c_i = ε c_j.

**Ingredients required, all specified by the system before the zero is looked at:**

- a decomposition of the zero into labelled contributions;
- a canonical exchange that acts on the space where the contributions live.

| System | Observed zero | Contributions | Exchange acting on contributions | ε | Transfer Depth | Same rule unchanged? | Backbone Support % | AI Slop / Delusion Risk % | Application Breadth | Exact failure condition |
|---|---|---|---|---|---|---|---|---|---|---|
| Quantum \|1,0⟩ (State X, blind) | S_zψ = 0 | ±(ħ/2)\|0,0⟩ (Q2a) | P, the canonical swap of the two factors | +1 (Q2d) | STRUCTURAL TRANSFER (exchange covariance with sign +1, as in T′) | yes | 30 | 20 | 2 | — |
| Quantum \|0,0⟩ (State Y, blind) | S_zψ = 0 | ±(ħ/2)\|1,0⟩ | P | −1 (Q2d) | FAIL for the T′ sign; the covariance identity still holds (ε = −1 = the state's parity) | yes | 30 | 20 | 2 | sign −1: T′'s source permutations never produce it |
| Quantum \|↑↓⟩ | S_zψ = 0 | ±(ħ/2)\|↑↓⟩ | P | undefined (Q2g) | FAIL | yes | 10 | 15 | 2 | the state is not an exchange eigenstate |
| T′ family (n = 2, 3, 4) | Σvᵢ = 0 | vᵢ = Pₙeᵢ | transpositions of the source basis (they commute with Pₙ) | +1 (Q2f) | the construction domain itself (defines the +1 behavior) | yes | 30 | 5 | 1 | — |
| Equal-mass balance | Σ(rᵢ − r̄) = 0 | rᵢ − r̄ | none acting on ℝᵈ unless the configuration has a symmetry; relabelling is not an action | — | NOT YET FORMALIZED | — | — | — | — | no canonical exchange on the codomain |
| Stage 1 learner pair (v, −v) | v + (−v) = 0 | v, −v | none (no source, no tensor structure) | — | NOT YET FORMALIZED | — | — | — | — | no exchange is specified by the system |
| Stage 2 later states | Σcⱼ = 0 | cⱼ, varied magnitudes | none unless the configuration has a symmetry | — | NOT YET FORMALIZED | — | — | — | — | no exchange is specified by the system |

**Application Breadth of every construction so far:**

| Construction | Breadth | Independent systems actually tested |
|---|---|---|
| T′ / simplex family | 2 | the projected orthonormal basis; equal-mass balance |
| C_G (locked to **1**) | 2 | T′; mass balance |
| WMC | 1 | mass balance |
| Linear connector T | 3 | mass, quantum, Fourier, orthogonality (TRIVIAL CONSEQUENCE in three of them) |
| R4 reconstruction (G3) | 1 | the simplex family only |
| Exchange descriptor ε | 2 | T′ family; quantum S_z = 0 pair |
| Stage 2b dephasing / cross-term (W2, W3) | 2 | quantum S_z = 0 sector; the two-path model (generic map) |

## Version 2 (transfer pass, 2026-11-12): its seven rows still stand

Each construction is applied unchanged, and what survives and what fails is recorded. The constructions under test
are these:

- **T (linear connector).** A target zero is the image of a source relation in ker L (G4a, G4b, G4c).
- **T′ (orthonormal source, uniform direction removed, Euclidean).** Pₙ = I − (1/n)**1****1**ᵀ (G2, G3).
- **C_G (G-orthogonal removal of the uniform direction, positive diagonal G).** This is a separate construction
  containing T′ (G = I) and WMC (G = diag(m)) exactly (G5d). It is not a repaired T′.
- **Layer-1 form.** A zero resultant of nonzero vector contributions (Pair A's shared algebraic form).

| Observed zero | Zero kind | Underlying objects | Map / relation | Source structure | Target structure | Known or inferred larger geometry | What becomes zero | What survives | What is lost | Transfer Depth | Same rule unchanged? | Backbone Support % | AI Slop / Delusion Risk % | Exact failure condition |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1. Equal-mass balance: Σ(rᵢ − r̄) = 0 | balance / moment (G), additive (A) | n equal masses at positions rᵢ | Pₙ on the index space (T′'s operator) | positions, any; e₁ … eₙ is an orthonormal source | centered positions | configuration space; removed mode: the uniform translation **1** ⊗ r̄ | the sum of the centered positions | every difference rᵢ − rⱼ | the mean position r̄ | STRUCTURAL TRANSFER (T′'s operator unchanged; the full regular-simplex configuration when rᵢ = eᵢ, G4m) | yes (Pₙ) | 45 | 8 | unequal masses (row 2) |
| 2. Unequal-mass balance: Σmᵢ(rᵢ − R_CM) = 0 | balance / moment (G), additive (A) | masses mᵢ > 0, positions rᵢ | C_m = I − **1**mᵀ/M; moments L_m = D C_m | positions, any | centered positions; moments uᵢ | configuration space; removed mode **1** ⊗ R_CM, in the D-metric | the weighted sum; the plain sum of the moments | every difference rᵢ − rⱼ | R_CM | FAIL for T′ (G4m); STRUCTURAL TRANSFER for C_G with G = D (G5d) | T′: no. C_G: yes. | 40 | 12 | Σmᵢ = 0 or weights not positive (C_G undefined, G5f) |
| 3. Quantum S_z = 0 | observable / eigenvalue (E), additive at the vector level (A) | two spin-½, ψ ∈ ℂ⁴ | ψ ↦ S_zψ = S_z⁽¹⁾ψ + S_z⁽²⁾ψ | the state space, given | the S_z value | not derived; the state space is given | ψ ∈ span_C{\|↑↓⟩, \|↓↑⟩}; for \|1,0⟩ the contributions ±(ħ/2)\|0,0⟩ cancel (W2f) | commuting observables (S²); the zero under S² measurement (W2b) | from the zero alone, which state in a two-dimensional complex family (Q1d) | TRIVIAL CONSEQUENCE (T's kernel statement; the Layer-1 opposed pair is forced for any two summands); FAIL for T′ and C_G | T: yes. T′, C_G: no. | 15 | 25 | T′ and C_G: no orthonormal source is mapped and no uniform mode is removed |
| 4. Fourier coefficient zero: f̂(k) = 0 | coefficient / spectral (F), linear functional (B), additive (A) | a signal f | f ↦ ⟨f, e_k⟩ | L²[0,1] with {e_k} | f̂(k) ∈ ℂ | L² with the orthonormal basis | f ∈ e_k^⊥ | every other coefficient (Parseval) | only the e_k component, which is 0 | TRIVIAL CONSEQUENCE (T; T′ at k = 0 only, as a fixed point of Pₙ); FAIL for T′ and C_G when k ≠ 0 (complex weights, G5f) | T: yes. T′, C_G: k = 0 only. | 15 | 15 | k ≠ 0 for T′ and C_G |
| 5. Ordinary orthogonality: ⟨u, v⟩ = 0 | inner-product / bilinear (C), linear functional (B), additive (A) | u, v ∈ ℝⁿ | v ↦ ⟨u, v⟩ | ℝⁿ | ⟨u, v⟩ ∈ ℝ | ℝⁿ; the zero connects to the hyperplane u^⊥ | v ∈ u^⊥ | v's components within u^⊥ | only the u-component, which is 0 | TRIVIAL CONSEQUENCE (T; C_G for u > 0 componentwise, by the definition of the image); FAIL for C_G with mixed signs and Σuᵢ = 0 (G5f), and for T′ unless u ∝ **1** | T: yes. T′: u ∝ **1** only. C_G: u > 0 only. | 15 | 15 | u with Σuᵢ = 0, or mixed signs (C_G) |
| 6. Quadratic null vector: q_η(v) = 0, v ≠ 0 | quadratic null (D) | v = (x, ct) | v ↦ q_η(v) | ℝ² with η | q ∈ ℝ | none identified | the null cone (two lines) | the cone directions | — | FAIL (T, T′, C_G: not linear) | no | 10 | 20 | q is not linear. The factorization q = (x − ct)(x + ct) is a different construction (Q-CONNECT-2). |
| 7. ‖x‖² = 0 | quadratic, definite (D) | x ∈ ℝⁿ | x ↦ ‖x‖² | ℝⁿ | ℝ | none | only x = 0 | — | nothing; the zero identifies the state | FAIL (T, T′, C_G) | no | 0 | 5 | always: a zero that connects to no nonzero source relation (Z5a) |

**Rating changes from version 1, with the mathematical reason:**

| Row | Change | Reason |
|---|---|---|
| Mass balance | 35 → equal masses 45, unequal 40 | T′'s operator now transfers unchanged to every equal-mass configuration, not only those at eᵢ. Unequal masses transfer only through the separate C_G construction. |
| Fourier | 25 → 15 | The transfer is a TRIVIAL CONSEQUENCE. |
| Orthogonality | 20 → 15 | The transfer is a TRIVIAL CONSEQUENCE. |
| Quantum | unchanged at 15 | W2f's vector-level cancellation is forced for any two summands, so it adds no transfer depth. |

**What transfers unchanged, what needs a new construction, what fails:**

- **Transfers unchanged as STRUCTURAL TRANSFER:** T′'s operator, to equal-mass balance (row 1).
- **Needs a new construction:** unequal-mass balance (row 2), through C_G.
- **TRIVIAL CONSEQUENCE only:** rows 3–5.
- **Fails:** nonlinear zeros (rows 6–7).

## Version 1 (application pass, 2026-11-12), kept as history

Pass 4 (2026-11-12, superseded by version 2): independent application of the zero-connector template. Each row applies the templates
**unchanged**. Rows are not forced into one geometry, and failures are recorded. Rows 7 and 8 were added by Claude
as boundary cases already in the project.

**The two templates under test:**

- **T (linear connector).** For a linear map L: Σᵢ Lxᵢ = L(Σᵢ xᵢ), so a zero in the target is the image of a source
  relation in ker L (G4a). With L known, the source is determined mod ker L (G4b). With L unknown, the zero alone
  does not determine the removed relation (G4c).
- **T′ (orthogonal source, uniform direction removed).** An orthonormal source e₁ … eₙ, the map Pₙ = I − (1/n)**1****1**ᵀ,
  and a target with zero sum because P**1** = 0 (G2, G3).

| System / dataset | Observed zero / relation | Source representation | Target representation | Candidate larger geometry | Map | What becomes zero | What survives | What is lost | Independent of construction example? | Mathematical status | Backbone Support % | AI Slop Risk % | Failure condition |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1. Opposed vector pair (Stage 1) | v + (−v) = 0 | e₁, e₂ ∈ ℝ² (one realization; not unique, G4c) | the line **1**^⊥ ⊂ ℝ², up to rotation and scale (G2k) | ℝ² with an orthonormal pair | P₂, then rotation and scale | the source sum e₁ + e₂ = **1** | the difference e₁ − e₂ | the common component ½**1** | no (the n = 2 member of the family that defines T′) | Known theorem / textbook identity | 10 | 30 | none possible: every two-vector zero sum is an opposed pair, so this row cannot discriminate |
| 2. n-simplex family | Σvᵢ = 0, ‖vᵢ‖² = (n−1)/n, vᵢ·vⱼ = −1/n | e₁ … eₙ ∈ ℝⁿ | **1**^⊥ ≅ ℝⁿ⁻¹ | ℝⁿ with its orthonormal basis | Pₙ | **1** = Σeᵢ | all differences eᵢ − eⱼ; Gram I − J/n | the centroid (1/n)**1**, recoverable up to sign given the source class (G3n) | no (defines T′) | Project-derived theorem (textbook) | 30 | 5 | a member whose Gram is not a multiple of I − J/n |
| 3. Mass center / first moment (Stage 3) | Σmᵢ(rᵢ − R_CM) = 0 | positions r₁ … rₙ in configuration space (ℝᵈ)ⁿ, masses m | centered positions rᵢ − R_CM | configuration space, with the uniform translation **1**⊗R_CM | C_m = I − **1**mᵀ/M (orthogonal for ⟨·,·⟩_m) | the weighted resultant of centered positions (mᵀC_m = 0) | all relative positions rᵢ − rⱼ | the absolute location R_CM | yes | Known theorem / textbook identity | 35 | 20 | the unchanged Pₙ with unequal masses: mᵀP₄ = (−3/2, −1/2, 1/2, 3/2) ≠ 0 (G4m, recorded failure) |
| 4. Quantum S_z = 0 pair (stage 2b) | S_zψ = 0 (contributions +ħ/2, −ħ/2 for \|↑↓⟩) | ℂ⁴ two-spin states | the S_z value | not identified (the state space is given, not derived) | ψ ↦ S_zψ | ψ ∈ span_C{\|↑↓⟩, \|↓↑⟩} | the zero; the value of a commuting observable (S²) | which state in a two-dimensional complex family (Q1d) | yes | Known theorem / textbook identity | 15 | 25 | T′: no orthonormal source projected along a removed uniform direction |
| 5. Fourier zero coefficient (#7) | f̂(k) = ∫ f(t)e^{−2πikt}dt = 0, a resultant of contributions | f ∈ L²[0,1] | the coefficient f̂(k) ∈ ℂ | L² with the orthonormal basis {e_k} | f ↦ ⟨f, e_k⟩ | f ∈ e_k^⊥ | every other coefficient (Parseval) | nothing beyond "no e_k component" | yes | Known theorem / textbook identity | 25 | 20 | T′ for k ≠ 0: the removed direction is e_k, not the uniform one |
| 6. Orthogonality zero (#8) | ⟨u, v⟩ = Σuᵢvᵢ = 0 | v ∈ ℝⁿ (u fixed) | the number ⟨u, v⟩ | ℝⁿ; the zero connects to the hyperplane u^⊥ | v ↦ ⟨u, v⟩ | v ∈ u^⊥ | v's components within u^⊥ | only the u-component, which is 0 | yes | Known theorem / textbook identity | 20 | 20 | T′ unless u ∝ **1** |
| 7. Null vector (C5, S12b), added by Claude | x² − c²t² = 0 with v ≠ 0 | v = (x, ct) ∈ ℝ² | q_η(v) ∈ ℝ | not identified | v ↦ q_η(v), quadratic | the null cone, two lines (not a subspace) | the cone's two directions | — | yes | Known theorem / textbook identity | 10 | 25 | T: q is not linear. q = (x − ct)(x + ct) makes the cone a union of two kernels (Q-CONNECT-2), but that is a different template |
| 8. \|x\|² = 0 (Z5a), added by Claude | \|x\|² = 0 only at x = 0 | x ∈ ℝⁿ | \|x\|² ∈ ℝ | none | x ↦ \|x\|² | only x = 0 | — | nothing (the zero identifies the state) | yes | Known theorem / textbook identity | 0 | 10 | T: not linear; a zero that connects to no nonzero source relation (a boundary of T-ZERO-CONNECTOR) |

## Results per row

| Row | T (linear connector), unchanged | T′ (orthogonal source, uniform direction removed), unchanged |
|---|---|---|
| 1. Opposed pair | same rule works | same rule works (not independent) |
| 2. n-simplex family | same rule works | same rule works (not independent: defines T′) |
| 3. Mass balance | same rule works | partially works: equal masses only (G4m); unequal masses fail; the weighted variant C_m is a changed template, recorded separately |
| 4. Quantum S_z | partially works: the kernel statement only; nothing is removed by a map from a larger description | fails |
| 5. Fourier coefficient | same rule works | partially works: k = 0 only (X₀ = **1**ᵀx = 0 ⟺ x ∈ **1**^⊥) |
| 6. Orthogonality zero | same rule works | partially works: u ∝ **1** only |
| 7. Null vector | fails (not linear) | fails |
| 8. \|x\|² = 0 | fails (not linear; no source relation) | fails |

**Reading, without forcing commonality:**

- T holds on every independent linear row. In rows 4–6 it is the textbook kernel statement and carries little
  backbone weight there.
- T′ transfers unchanged only in special sub-cases: equal masses, k = 0, u ∝ **1**.
- Mass balance is the one independent system where T′'s structure appears exactly. It is a projection killing the
  uniform direction, with a resultant annihilating its range. Unequal masses need a weight parameter.
- Nonlinear zeros (rows 7–8) are outside both templates.
