# Application matrix

Pass 4 (2026-11-12): independent application of the zero-connector template. Each row applies the templates
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
