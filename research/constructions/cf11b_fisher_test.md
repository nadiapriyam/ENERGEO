# CF11-B under Fisher / Riemannian geometry: result (2026-11-12)

| | |
|---|---|
| Preregistration | `research/constructions/cf11b_fisher_prereg.md`, committed at e6f3db8 before any card existed |
| Cards | `verify/verify_CFT.py`: CFT1a–CFT10b as preregistered; CFT11a–b added and labelled "not preregistered" |
| Registry | `T-CF11-B` (wording unchanged), `T-CF11-REFINEMENT`, `T-CF-PULLBACK-Q`, `T-CF11-A` |
| Outcome | **CF11-F2, PARTIAL SURVIVAL** |

The mathematical content of every card is textbook differential geometry and information geometry: VALIDATION OF
KNOWN MATHEMATICS. The outcome concerns the project architecture only.

**Kept FAIL.** CFT6b FAILED on its first ledger run. The check was wrong, not the claim: a tidy-up edit made after
the dry run compared sp.simplify(g_ϑ) with the literal 1, and SymPy returns 2cos²(ϑ/2)/(1 + cos ϑ), which equals 1
but is not the literal 1. The FAIL stays on the ledger. CFT6b2 re-cards the claim.

## 1. The decision rule, applied

| Question (prereg §8) | Cards | Result |
|---|---|---|
| Q1: one law F*T = T in every domain | constant form CFT1a–d, CFT9a; symplectic CFT2a–c; Fisher CFT3b, CFT4d, CFT5a, CFT6c | **holds** |
| Q2: coordinate covariance | CFT3c, CFT4c, CFT4e, CFT5d | **holds** |
| Q3: the transformation leg organizes each Fisher example | F-A (translations act transitively); F-B (location–scale acts transitively); F-C (the exchange S predicts the diagonal null, CFT5b); **F-C′: the system supplies no symmetry (CFT5a), yet the diagonal carries an exact null (CFT5c)** | **fails for F-C′** |
| Q4: non-vacuity | CFT1c, CFT2b, CFT3b, CFT4d, CFT6c, CFT9b, CFT10a, CFT10b | **holds** |
| The refinement covers F-C′ and is not vacuous | P2 carries F-C′'s null as a coordinate invariant (CFT11b); P2 fails for a pseudo-structure (CFT10a) | **holds** |

Q1, Q2 and Q4 hold, Q3 fails for one Fisher example, and the explicit refinement covers it non-vacuously. By the
preregistered rule that is **CF11-F2**, which matches the anticipated outcome recorded before the cards.

## 2. Mathematical reason

**The common law (P1).**

- For a pairing T and a map F: (F*T)_x(u, v) = T_{F(x)}(dF_x u, dF_x v). In coordinates this is
  (F*T)_x = dF_xᵀ M(F(x)) dF_x (CFT1b).
- For F = Ax and a constant form B_M: (F*B)(u, v) = uᵀ(AᵀMA)v, so F*B = B ⟺ AᵀMA = M. The complex case is
  A†HA = H (CFT1a).
- The same equation F*T = T expresses every symmetry tested:
  - Euclidean and Lorentz isometries (CFT1c, CFT1d);
  - symplectomorphisms, including nonlinear ones such as (q, p) ↦ (q, p + ∇W(q)) (CFT2a);
  - Fisher isometries: μ ↦ μ + b (CFT3b); (μ, σ) ↦ (aμ + b, aσ), which the system supplies through x ↦ ax + b
    (CFT4d); the exchange S in F-C (CFT5a); p ↦ 1 − p (CFT6c).

**Where P1 stops organizing.**

- F-C has varying Gaussian curvature: K(1, 2) ≈ −0.888 and K(1, 3) ≈ −1.155 (CFT5f). An isometry maps points to
  points of equal K, so no isometry group acts transitively. The structure is carried by g itself.
- In F-C′ the system supplies no symmetry: S*g ≠ g (CFT5a). Yet at θ₁ = θ₂, J(2, −1) = 0 (CFT5c). The project-used
  feature, an exact null, comes from the two terms coinciding in shape, not from any preserving transformation.
- So P1 alone organizes F-C′ only vacuously, with the identity as its only supplied transformation.

**What carries F-C′: naturality (P2).**

- Under a reparametrization θ = θ(φ), the Fisher metric of the reparametrized model is the pullback:
  g_φ = Jᵀ g_θ(θ(φ)) J. This was checked against direct computation from the density, not assumed: F-A under
  μ = φ + φ³ (CFT3c), and F-B in natural parameters (CFT4c).
- ds², the length of a tangent vector (CFT4e), the Gaussian curvature (CFT4c), rank and null directions (CFT5d,
  CFT11b) are invariant under this law.
- **The component eigenvalues of g are not invariant** (CFT5e). Neither is the "Euclidean parameter metric", which
  fails P2 (CFT10a).

So "preserved" has more than one precise meaning in the tested geometries:

| Reading | Law | Acts on | Examples |
|---|---|---|---|
| P1, invariance | F*T = T | active symmetries F of a fixed structure | Euclidean, Lorentz, unitary, symplectic, Fisher isometries |
| P2, naturality / covariance | g_{p∘θ} = θ*g_p, i.e. g_φ = Jᵀ g J | passive reparametrizations of a model | generic Fisher geometry (F-C, F-C′) |
| P3, operator equivariance | A C = C A | operators derived from a geometry | weighted centering (§6) |

Note, not used to change the outcome: P3 is P1 applied to the operator viewed as a (1,1)-tensor, since
A*C = A⁻¹CA. The preregistered object was a covariant 2-tensor, so P3 is reported as a separate reading.

## 3. Passive coordinate change (Type A) vs active symmetry (Type B)

| | Type A, passive | Type B, active |
|---|---|---|
| What it is | a new chart θ = θ(φ) for the same model and the same tensor | a map F of the parameter manifold to itself |
| Components | change: g_φ = Jᵀ g(θ(φ)) J (CFT3c, CFT4c; F-A's constant 1/σ₀² becomes (1 + 3φ²)²/σ₀²) | g(F(x)) is compared with g(x) |
| What is equal | ds² for the same tangent vector (CFT4e: 2 in (μ, σ) and 2 in η) | F*g = g holds only for isometries |
| Written as | the tensor law; never F*g = g | F*g = g |
| Failure | none: every chart describes the same geometry | non-isometries change lengths (CFT4e: 2 ↦ 3 under (μ + σ, σ)) |

**One-dimensional caution (CFT6b2).** In one dimension, "varying" is not intrinsic: under p = sin²(ϑ/2) the
Bernoulli metric becomes g_ϑ ≡ 1. F-B was certified as genuinely varying by K = −1/2 (CFT4b).

**Same model with different coordinates vs a different model** (CFT7):

- Two unit-variance means (μ₁, μ₂) have K = 0; the normal family has K = −1/2. No reparametrization relates them.
- Bernoulli and Binomial(2, p) have total Fisher lengths π and π√2.
- Different invariants mean a different geometry, not new coordinates.

**Admissible ≠ preserves T** (CFT11a, not preregistered). The normal-family metric's isometry group (3-dimensional,
the hyperbolic plane) is larger than the 2-dimensional location–scale group the system supplies. The inversion
(μ, σ) ↦ (−μ, σ)/(μ²/2 + σ²) is an isometry that no data transformation induces.

## 4. The common form

**Pullback preservation F*T = T is an exact common coordinate-free preservation form (YES, by the prereg §9
criteria).**

| Level | Equation | Card |
|---|---|---|
| coordinate-free | F*T = T | definition; CFT1b |
| constant bilinear form, linear F | AᵀMA = M (A†HA = H) | CFT1a |
| Riemannian / Fisher metric | F*g = g, i.e. dFᵀ g(F(x)) dF = g(x) | CFT3b, CFT4d, CFT5a, CFT6c |
| symplectic form | F*ω = ω, i.e. dF(x)ᵀ J dF(x) = J pointwise | CFT2a |
| Lorentz metric | F*η = η, i.e. ΛᵀηΛ = η | CFT1c |

**Scope.** Several major geometries in the Foundation admit a common coordinate-free preservation form in which an
admissible symmetry preserves a defining tensor/form under pullback. What this does **not** say:

- **Not "all geometry = pullback invariance".** Generic Fisher geometry is organized by its tensor and P2, not by a
  symmetry group (CFT5f, CFT5c).
- **Not one preserving class.** The same equation selects very different classes:
  - flat metrics: affine maps only (CFT1d, textbook rigidity);
  - symplectic forms: an infinite-dimensional group of nonlinear maps (CFT2a);
  - generic Fisher metrics: none (CFT5f);
  - and one map can preserve ω without preserving δ (CFT2c).
- **Not a reparametrization.** A Fisher reparametrization is never F*g = g unless F is an isometry.

## 5. Zero / null (Level 3)

- **The preregistered lemma held (CFT5b).** If Y∘S = Y for an involution S, then S*g = g and Jv = 0 at fixed points
  for dS v = −v. In F-C, J(1, −1) = 0 on the diagonal.
- **The control shows the symmetry is sufficient, not necessary (CFT5c).** F-C′ has the same diagonal null,
  J(2, −1) = 0, with no symmetry.
- **The null is coordinate-free.** Rank and the null vector transform as a tangent vector (CFT5d, CFT11b). It is
  exactly "zero metric length ↔ nonidentifiable tangent direction": g(v, v) = |Jv|² = 0 ⟺ Jv = 0 (FB7b).
- **F-B is positive definite.** It has no null, and none was invented.

## 6. Boundary cases

**Weighted centering (CFT8).**

- D = diag(m) is a metric. C_m is a D-orthogonal, D-self-adjoint projector (C_m² = C_m, DC_m = C_mᵀD).
- C_m is **not** an isometry (C_mᵀDC_m ≠ D).
- It commutes with exactly those D-isometries that preserve the line span{1}, and not with others or with
  non-isometries fixing 1 (P3).
- So weighted centering enters the architecture as a **geometry-derived, equivariant operator**, not as a
  structure-preserving transformation. This is evidence that CF11-B is not the whole Foundation.

**Fourier (CFT9).**

- The unitary DFT preserves the Hermitian form (U†U = I); the unnormalized DFT does not (F†F = 4I). U diagonalizes
  the cyclic shift.
- It fits P1 cleanly as the complex constant-form row.
- Fourier transform ≠ geometric symmetry of physical spacetime. It is a symmetry of the Hilbert-space structure.

## 7. H1, H2, H3

- **H1:** no change in rating.
  - CFT5b, CFT5c and CFT11b add exact instances of a quadratic form equal to 0 that marks structure: a positive
    semidefinite g with g(v, v) = 0 ⟺ Jv = 0, a nonidentifiable combination.
  - The pattern matches Z12's mass result: symmetry is sufficient, not necessary.
  - Coordinate invariance alone is not counted as evidence for the zero theory.
- **H2: STRENGTHENS.**
  - The Gate-3 pattern (H2-1) is realized exactly: Object → Representation → Transformation → Invariant / preserved
    relationship → Coordinates → Geometry. It has a decidable criterion separating three cases:
    1. the same object in different coordinates (tensor law; invariants K, ds², rank, length: CFT3c, CFT4c, CFT5d);
    2. a different object (different invariants: CFT7);
    3. coordinate artifacts (component eigenvalues, CFT5e; the Euclidean parameter metric, CFT10a).
  - The mathematics is textbook; the strengthening is architectural.
- **H3: UNCHANGED.**

## 8. Transfer, novelty and ratings

| Structure | Transfer Depth | Backbone Support | AI Slop Risk | Application Breadth | Mathematical Status |
|---|---|---|---|---|---|
| CF11-A (established pattern) | TRIVIAL CONSEQUENCE | 60% (was 55%) | 8% (was 10%) | 3 (was 4; corrected to the rubric) | TEXTBOOK / KNOWN |
| CF11-B (as worded, P1 reading) | FAIL on F-C′; STRUCTURAL TRANSFER with the refinement | 35% (was 30%) | 25% (was 30%) | 3 | PROJECT-DERIVED FROM KNOWN DEFINITIONS (was SPECULATIVE MAPPING) |
| CF11-CANDIDATE-REFINEMENT (explicit: P1 + P2, P3 noted) | STRUCTURAL TRANSFER | 45% | 20% | 3 | PROJECT-DERIVED FROM KNOWN DEFINITIONS |
| Pullback bridge F*T = T (BR36) | STRUCTURAL TRANSFER | 70% | 5% | 3 | TEXTBOOK / KNOWN |
| Symmetry-forced Fisher null (Z13) | TRIVIAL CONSEQUENCE | 25% | 10% | 1 | PROJECT-DERIVED FROM KNOWN DEFINITIONS |

- **Breadth is counted by mathematical system.** Constant-form, symplectic and Fisher geometry are three
  independent mathematical systems (rubric 3). They are not empirical applications.
- **No NONTRIVIAL PREDICTIVE TRANSFER.** The one preregistered prediction (CFT5b) is a chain-rule consequence.
- **Novelty.** Mathematical novelty: none (KNOWN MATHEMATICS). Project-architectural relevance: high. The project's
  oldest common-form question has an exact coordinate-free version (F*T = T), a stated domain (symmetries of a
  defining tensor), a stated failure boundary (generic, non-homogeneous Fisher geometry), and a stated second
  mechanism (naturality, P2).

## 9. Failures and negative results (kept)

- **CF11-B read with one meaning of "preserved"** does not organize generic Fisher geometry (F-C′).
- **Fisher nulls do not require a symmetry** (CFT5c).
- **The component eigenvalues of g are parametrization-dependent** (CFT5e). The project's sloppy-spectrum card S14
  uses log-parameters, so M1 is a statement in those coordinates.
- **F-C is not homogeneous** (CFT5f): the Erlangen characterization fails there.
- **The isometries of T are not the transformations the system supplies** (CFT11a).
- **Weighted centering is not a P1 instance** (CFT8b).
- **CFT6b is a kept FAIL**, from a check error, re-carded as CFT6b2.

## 10. Classification for the Foundation ledger

**CF11-B: REFINED.** The wording is unchanged. The test supports the explicit refinement (P1 + P2, with P3 for
derived operators) as the precise reading. Adopting it as project wording is Nadia's decision.
