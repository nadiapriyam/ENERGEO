# Preregistration CF11-B-FISHER-PREREG: CF11-B under Fisher / Riemannian geometry (2026-11-12)

This record was written and committed **before** any card of the test existed. The cards
(`verify/verify_CFT.py`) and the reveal record (`research/constructions/cf11b_fisher_test.md`) are written and run in
a later commit. Nothing below is edited after that commit. A correction, if one is ever needed, is added as a new
dated section.

**Disclosure (knowledge leakage).** I (Claude) know the textbook mathematics involved:

- the tensor transformation law, pullbacks and isometries;
- the Myers–Steenrod theorem (the isometry group of a Riemannian manifold is a finite-dimensional Lie group);
- Darboux's theorem (a symplectic form has no local invariants);
- Gauss's Theorema Egregium (Gaussian curvature is a coordinate invariant);
- the Fisher metric of the normal family (constant negative curvature);
- the Riemann / Klein boundary: a generic Riemannian metric has no nontrivial isometry.

So the outcome of each card is anticipatable. The test is **procedurally preregistered, not blind**, and its
mathematical content is VALIDATION OF KNOWN MATHEMATICS. What it decides is the project question: whether CF11-B, as
worded, organizes these structures, and with how many meanings of "preserved".

---

## 1. Locked wording

Not altered by this pass, whatever the result.

- **CF11-A (DERIVED / ESTABLISHED PATTERN):** In many established geometries, a relational structure together with
  the transformations preserving it characterizes substantial geometric structure.
- **CF11-B (HYPOTHESIS / OPEN), the record under test:** Can relation + admissible transformations + preserved
  structure provide a broader organizing architecture across the geometries investigated in this project?
- **CF11-CANDIDATE-REFINEMENT (candidate, not adopted):** A geometry may be characterized by relational structure
  together with transformations under which that structure is preserved or transforms coherently.

## 2. Test question

> Does CF11-B survive when the preserved structure is coordinate-invariant rather than a fixed matrix invariant?

> Is "preserved relation" the invariant geometric object, even when its coordinate matrix changes?

## 3. The object tested, and why it was chosen

| Word in CF11-B | Object tested |
|---|---|
| relation | a covariant 2-tensor field T on a space X: a pairing T_x(u, v) of two tangent vectors at each point x. Symmetric for a metric (Euclidean, Lorentz, Fisher), antisymmetric for a 2-form (symplectic), Hermitian for the complex rows. |
| admissible transformation (Type B, active) | a diffeomorphism F: X → X |
| preserved (reading P1, invariance) | F^*T = T, i.e. T_{F(x)}(dF_x u, dF_x v) = T_x(u, v) for all x, u, v |

**Why this object.** Every CF11-A row's relation is a pairing of two vectors. A pairing that may vary from point to
point is, by definition, a covariant 2-tensor field. "F preserves the pairing", applied at each point to the images
of tangent vectors, is by definition F^*T = T. The object was read off the existing rows before any calculation. It
was not chosen because it passes.

**Pullback preservation is evaluated here as a candidate common form**, declared before testing (it is not
introduced afterwards because it works). The other candidate objects in the brief appear as parts of the triple
above:

- bilinear form, tensor field and metric are kinds of T;
- diffeomorphism and isometry are kinds of F;
- group action: the set of F with F^*T = T;
- coordinate transformation: Type A below.

Natural transformations, functoriality and category theory are not used. They are at most a FUTURE POSSIBILITY.

**Type A (passive) coordinate change.**

- A change of chart θ = θ(φ). The tensor T is the same object.
- Its components transform by the tensor law g_φ(φ) = Jᵀ g_θ(θ(φ)) J, with J = ∂θ/∂φ, and the scalar
  ds² = dθᵀ g_θ dθ = dφᵀ g_φ dφ is unchanged.
- A Type A change is not a transformation of the geometry. It is never written F^*g = g, and "g is unchanged" is
  never written for it: the components change.

## 4. Two further meanings of "preserved", defined in advance

These are needed to state CF11-F2 and the refinement explicitly. They are distinct from P1.

| Reading | Statement | Where it would apply |
|---|---|---|
| P1, invariance | F^*T = T | symmetries of a fixed structure |
| P2, naturality / covariance of a construction | a construction p ↦ T_p (here: model ↦ Fisher metric) satisfies T_{p∘θ} = θ^*T_p under a reparametrization θ(φ); components g_φ = Jᵀ g J | coordinate changes of a model |
| P3, equivariance of an operator | A C = C A for an operator C and a transformation A | operators derived from a geometry (weighted centering) |

If the tested domains need P2 or P3 in addition to P1, "preserved" has more than one precise meaning in the
project.

## 5. Examples (fixed)

| ID | Model | Coordinates | Role |
|---|---|---|---|
| F-A | Gaussian location family N(μ, σ₀²), σ₀ known | μ; nonlinear change μ = φ + φ³ | constant Fisher metric (the easy case) |
| F-B | two-parameter normal family N(μ, σ²) | (μ, σ); nonlinear change to natural parameters (η₁, η₂) = (μ/σ², −1/(2σ²)) | genuinely varying metric |
| F-B′ | Bernoulli(p) | p; nonlinear change p = sin²(θ/2) | one-dimensional control |
| F-C | Y(θ) = e^{−θ₁t} + e^{−θ₂t}, t = 1, 2, 3, Gaussian noise σ = 1 (g = JᵀJ) | (θ₁, θ₂); nonlinear change θ = e^λ (componentwise) | the project's own model; system-supplied exchange symmetry |
| F-C′ | Y(θ) = e^{−θ₁t} + 2e^{−θ₂t}, same t and noise | (θ₁, θ₂) | control: the exchange symmetry broken by unequal amplitudes |

- **F-B's nonconstancy is certified by a coordinate invariant, its Gaussian curvature K ≠ 0**, not by the look of
  its components. A constant metric has K = 0, so K ≠ 0 means no coordinate system makes g constant.
- The Fisher metric in natural parameters is computed **directly from the density in those parameters** and then
  compared with the tensor law. The law is not assumed.
- **F-B′ is included because in one dimension every metric can be made constant by a coordinate change.** "Varying"
  is not intrinsic there.

## 6. Transformations (fixed)

**Type B candidates in the Fisher examples.**

| Example | Expected isometry | Expected non-isometry |
|---|---|---|
| F-A | μ ↦ μ + b; μ ↦ b − μ | μ ↦ 2μ |
| F-B | (μ, σ) ↦ (aμ + b, aσ), a > 0; (μ, σ) ↦ (−μ, σ). These are the maps induced on parameters by the data transformations x ↦ ax + b and x ↦ −x, under which the family is closed: **system-supplied**. | (μ, σ) ↦ (μ + σ, σ); (μ, σ) ↦ (μ, σ²) |
| F-B′ | p ↦ 1 − p (relabelling the two outcomes) | p ↦ p² |
| F-C | S(θ₁, θ₂) = (θ₂, θ₁) (exchange of the two identical terms) | — |
| F-C′ | S is tested; it is expected to fail | — |

**Constant-form and symplectic transformations.**

- Euclidean: a rotation (passes); a shear (fails); an affine rigid motion (passes); a nonlinear map (fails).
- Lorentz: a boost (passes); a generic matrix (fails).
- Unitary: the unitary DFT (passes); the unnormalized DFT (fails).
- Symplectic: a nonlinear symplectomorphism (q, p) ↦ (q, p + ∇W(q)) with W arbitrary (passes); (q, p) ↦ (q, 2p)
  (fails).

## 7. Level 3 (zero / null) prediction, fixed before computing

**Lemma (derived here, elementary).**

- Hypothesis: S is an involution of parameter space with Y∘S = Y, a symmetry the system supplies.
- Conclusion: S^*g = g, and at every fixed point θ* of S, Jv = 0 for every v with dS v = −v.
- Reason: Y(θ* + εv) = Y(S(θ* + εv)) = Y(θ* − εv), so the first derivative along v vanishes.

**Predictions.**

- **F-C:** on the diagonal θ₁ = θ₂, J(1, −1) = 0 (an exact null of g).
- **F-C′:** there is no symmetry, so the lemma predicts nothing. The card records whether a null exists on the
  diagonal anyway. If it does, a symmetry is sufficient but not necessary for a Fisher null.
- **F-B:** g is positive definite everywhere (det g ≠ 0), so there is no nonzero null direction. None is invented.
- **Coordinate behaviour:** rank and the null direction (as a tangent vector, v_φ = J⁻¹v_θ) are expected to be
  invariant under θ = e^λ. The eigenvalues of the component matrix g are expected **not** to be coordinate
  invariants. This expectation comes from textbook knowledge and is recorded as such.

## 8. Outcome criteria (fixed; exactly one outcome is reported)

The domains are:

- constant-form geometry: Euclidean, Lorentz, unitary / DFT;
- symplectic geometry;
- Fisher geometry: F-A, F-B, F-C, F-C′.

| Question | Holds when |
|---|---|
| **Q1, one law** | In every domain, the structure-preserving transformations are exactly expressed by F^*T = T (P1), with T the domain's defining pairing: the same equation, unchanged. For constant forms and linear maps it reduces exactly to AᵀMA = M (A^†MA = M in the complex case). |
| **Q2, coordinate covariance** | Type A changes leave every geometric quantity the project uses unchanged: ds², rank and null directions (as tangent vectors), and curvature. Components transform by the tensor law, checked against a direct computation. |
| **Q3, the transformation leg organizes** | For each Fisher example, the P1-preserving class is nontrivial **and** contributes at least one exact statement the project uses (for example, where null directions sit, or homogeneity). A trivial class, or one that explains nothing used, organizes that example only vacuously. |
| **Q4, non-vacuity** | Every domain exhibits at least one transformation that fails P1. For the refinement, at least one quantity fails P2. |

**Decision rule.**

| Outcome | Condition |
|---|---|
| **CF11-F1** | Q1 in all three domains, Q2, Q3 for every Fisher example, and Q4. |
| **CF11-F2** | Q1 in all three domains, Q2 and Q4, but Q3 fails for at least one Fisher example, **and** the explicit refinement (P1 + P2, plus P3 if needed) covers that example and passes the vacuity test. |
| **CF11-F3** | Q1 fails for Fisher geometry, or Q3 fails and the refinement is vacuous (fails Q4). The architecture organizes constant-form and symplectic geometry only. |
| **CF11-F4** | Q1 fails in two or more domains, so no common law survives beyond "every geometry has rules". |

There is no fifth outcome.

**Anticipated outcome (knowledge leakage).** It is recorded here so that it cannot be adjusted afterwards:
**CF11-F2**. The reason is that a generic Riemannian metric has no nontrivial isometry, and F-C′ is expected to be
such a case, so P1 alone cannot organize generic Fisher geometry. If the cards show otherwise, the reported outcome
follows the cards, not this anticipation.

## 9. The pullback bridge (BR-CF-PULLBACK): criteria

- **YES** if all three of these hold:
  1. For linear F = A and a constant form B_M, (F^*B)(u, v) = uᵀ(AᵀMA)v exactly, so F^*B = B ⟺ AᵀMA = M.
  2. For a general F and a tensor field with matrix M(x), (F^*T)_x = dF_xᵀ M(F(x)) dF_x.
  3. P1 expresses Euclidean, Lorentz, unitary, symplectic and Fisher isometries, with a failure in each.
- **PARTIAL** if (1) holds but (3) holds in only some domains.
- **NO** if (1) fails.

Fisher coordinate reparametrization is never counted under F^*g = g unless F is an isometry.

## 10. Boundary cases (reported separately; they do not change the F-outcome)

**Weighted centering.** D = diag(m) with m = (1, 2, 3); C_m = I − 1mᵀ/M. The checks:

- Is D a metric?
- Is C_m an isometry (C_mᵀDC_m = D)?
- Is it a projection (C_m² = C_m)?
- Is it D-self-adjoint (DC_m = C_mᵀD)?
- Does it commute with a D-isometry that fixes **1** (P3)?
- Does it fail to commute with a D-isometry not fixing **1**, and with a non-isometric map fixing **1**?

**Fourier.**

- The unitary DFT U (N = 4) has U^†U = I: P1 for the Hermitian form.
- The unnormalized DFT has F^†F = 4I, so it fails P1.
- U diagonalizes the cyclic shift.
- Same mathematical structure does not imply same physical meaning: the Fourier transform is a symmetry of the
  Hilbert-space structure, not of physical spacetime.

## 11. Model change vs coordinate change

| Comparison | Intrinsic quantity |
|---|---|
| normal family (μ, σ) vs two independent unit-variance Gaussians with unknown means (μ₁, μ₂) | Gaussian curvature K: the first is expected nonzero, the second zero |
| Bernoulli(p) vs Binomial(2, p) | total Fisher length over p ∈ (0, 1) |

Different intrinsic quantities show a different model, not new coordinates.

## 12. Vacuity test of the refinement (fixed)

**The refinement is tested only in explicit form.** It must state:

- the tensor T;
- the class G_sym, with F^*T = T;
- the class G_cov, with T_{p∘θ} = θ^*T_p;
- the invariant quantities;
- failure cases.

**Required failures.**

1. A coordinate-dependent pseudo-structure must fail P2: the "Euclidean parameter metric" (the identity matrix in
   every coordinate system) under μ = φ + φ³.
2. A map must fail P1 in each domain.

If "transforms coherently" must be left without a specified law in order to cover a domain, the refinement is
**TOO GENERIC**.

## 13. Cards (fixed)

**`verify/verify_CFT.py`:**

| Card | Checks |
|---|---|
| **CFT1a** | For linear F = A and constant M, (F^*B)(u, v) = uᵀAᵀMAv. F^*B = B ⟺ AᵀMA = M. |
| **CFT1b** | For a general smooth F on ℝ² and a tensor field M(x), (F^*T)_x = dF_xᵀ M(F(x)) dF_x, checked symbolically. |
| **CFT1c** | Euclidean rotation passes and shear fails. Lorentz boost passes and a generic matrix fails. |
| **CFT1d** | An affine rigid motion preserves the Euclidean metric; the nonlinear (x, y) ↦ (x + y², y) does not. |
| **CFT2a** | (q, p) ↦ (q, p + ∇W(q)) on ℝ⁴ with W arbitrary has dFᵀJdF = J, so F^*ω = ω for a nonlinear F. |
| **CFT2b** | (q, p) ↦ (q, 2p) fails. |
| **CFT2c** | The same nonlinear symplectomorphism does not preserve the Euclidean metric: one law, different preserving classes. |
| **CFT3a** | F-A: g = 1/σ₀² from E[(∂ log p)²]. |
| **CFT3b** | F-A: translations and reflections are isometries; μ ↦ 2μ is not. |
| **CFT3c** | F-A under μ = φ + φ³: g_φ computed from the reparametrized density equals Jᵀ g J = (1 + 3φ²)²/σ₀², which is not constant. ds² is unchanged. |
| **CFT4a** | F-B: g = diag(1/σ², 2/σ²) from the density. |
| **CFT4b** | F-B: Gaussian curvature K (Brioschi) is a nonzero constant. |
| **CFT4c** | F-B in natural parameters: the Fisher metric computed directly in η equals Jᵀ g J. Components differ, ds² is equal, and K computed in η equals K in (μ, σ). |
| **CFT4d** | F-B: the location–scale maps and the reflection satisfy F^*g = g; (μ + σ, σ) and (μ, σ²) do not. |
| **CFT4e** | F-B: the passive change keeps the length of a tangent vector; an active non-isometry changes it. |
| **CFT5a** | F-C: S^*g = g. F-C′: S^*g ≠ g. |
| **CFT5b** | The preregistered lemma: F-C has J(1, −1) = 0 on the diagonal. |
| **CFT5c** | Control F-C′: the record of whether a null exists on the diagonal without the symmetry. |
| **CFT5d** | Rank and the null vector are invariant under θ = e^λ. |
| **CFT5e** | The eigenvalues of the component matrix g change under θ = e^λ. |
| **CFT5f** | The Gaussian curvature of F-C differs at two points, so F-C is not homogeneous. |
| **CFT6a–c** | F-B′: g = 1/(p(1 − p)); under p = sin²(θ/2), g_θ = 1. p ↦ 1 − p is an isometry; p ↦ p² is not. |
| **CFT7a–b** | Model change: K for the normal family vs two independent means; Bernoulli vs Binomial(2) total Fisher length. |
| **CFT8a–c** | Weighted centering as in §10. |
| **CFT9a–c** | Fourier as in §10. |
| **CFT10a–b** | Vacuity: the identity-matrix parameter metric fails P2 under μ = φ + φ³. The P1-preserving class of F-B is a proper subset (a failure is exhibited). |

## 14. How H1, H2 and H3 will be read

- **H1 / zero:** only an exact null relation that genuinely occurs counts (Jv = 0). Coordinate invariance alone is
  not evidence for the zero theory.
- **H2:** STRENGTHENS, UNCHANGED or WEAKENS, judged on whether one representation-independent object (the tensor)
  organizes its coordinate representations exactly.
- **H3:** default UNCHANGED. No finite / infinite claim is tested.
