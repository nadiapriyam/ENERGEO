# Zero taxonomy (working, descriptive)

These are known/project-observed categories, not an exhaustive classification.

This is not a theorem. It records the kinds of zero the project has met so that a geometry can emerge from comparing
them (transfer pass, 2026-11-12). The categories overlap: one zero can belong to several, and that overlap is
recorded as data, not resolved. Their mathematical origins are not assumed to be the same.

| Category | Definition | Example (card) | Zero-producing set | What information remains inside the zero | What transformations preserve it | Larger / source representation known? |
|---|---|---|---|---|---|---|
| A. Additive / resultant zero | Σᵢ vᵢ = 0 for contributions vᵢ | Stage 2 ensemble (Z2a); Stage 1 pair (Z1a2); S_z\|1,0⟩ = (ħ/2)\|0,0⟩ − (ħ/2)\|0,0⟩ (W2f) | a linear subspace of codimension d in (ℝᵈ)ⁿ | the contributions themselves; their Gram matrix (tight or not, G3d); every pairwise relation | any common linear map (Z4a); pair twists (Z2c); permutations | sometimes. For tight Gram, an orthonormal source exists, unique up to sign (G3b, G3d). Not in general (G4c). |
| B. Linear-functional zero | ℓ(x) = 0 | Fourier coefficient as ⟨f, e_k⟩ (O2a); v ↦ ⟨u, v⟩ | the hyperplane ker ℓ | everything except the ℓ-component | maps that preserve ker ℓ | the source is the whole space; with ℓ known, the removed direction is known (G4b) |
| C. Inner-product / bilinear zero | B(u, v) = 0 | orthogonality (S1a, O1e) | for fixed u, the hyperplane u^⊥ under B | Pythagorean additivity (S1a); all components orthogonal to u | maps with AᵀMA = M preserve it for every pair (C1b). Preserving zero resultants alone fixes no form (Z4b). | not identified |
| D. Quadratic null | q(v) = 0 | null vector of η (S12b); the definite case \|x\|² = 0 (Z5a) | indefinite q: a cone, not a subspace (in 2D, q = (x − ct)(x + ct) makes it a union of two lines). Definite q: {0}. | indefinite: the direction along the cone; definite: nothing (the zero identifies the state) | the form's own group (C1b, S4) and scalings | none |
| E. Observable / eigenvalue zero | Aψ = 0 (eigenvalue 0), or ⟨A⟩_ψ = 0 (expectation zero, a larger set) | S_z = 0 (Q1a); its eigenspace is two-dimensional complex (Q1d) | eigenvalue: an eigenspace; expectation: a larger set, e.g. (\|↑↑⟩ + \|↓↓⟩)/√2 has ⟨S_z⟩ = 0 but S_zψ ≠ 0 | commuting observables (S², Q1e); incompatible ones (S_z⁽¹⁾, W2e); the internal composition (⟨S_z⁽¹⁾⟩ = ±ħ/2 or 0, W2c) | unitaries commuting with A; measurements of commuting observables keep the zero but can change the state (Q1g, Q1h, W2a) | the state space is given, not derived |
| F. Coefficient / spectral zero | f̂(k) = 0 in a chosen basis | Fourier (#7; S2a, O2a) | e_k^⊥ | every other coefficient (Parseval, S2b) | multipliers diagonal in the basis; shifts multiply f̂(k) by a phase (S3) | L² with the basis |
| G. Balance / moment zero | Σmᵢ(rᵢ − R) = 0 at R = R_CM | Stage 3 (Z3a, Z3b); WMC (G5a) | for a fixed configuration, one point R_CM; over configurations, the image of C_m | relative positions rᵢ − rⱼ; the masses | common rigid motions (R_CM moves with them); D-orthogonal maps fixing **1**, open (Q-WMC-2) | configuration space with the translation mode removed (G5b) |

**Observed overlaps** (data, not a classification):

| Zero | Categories |
|---|---|
| S_z = 0 | E and A (at the vector level, W2f) |
| Fourier coefficient | F, B and A (a resultant of contributions f(t)e^{−2πikt}) |
| First moment | G and A |
| Orthogonality | C, B and A (Σuᵢvᵢ) |
| Stage 2's first state | A, with an orthonormal source (G2i) |
