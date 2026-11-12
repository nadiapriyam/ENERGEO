# WMC — Weighted Mass Centering

A candidate construction, derived for unequal masses (2026-11-12). It is **not** T′, and it is not a repaired T′:
T′ requires equal weighting and Euclidean orthogonality. Cards: `verify/verify_G5.py` (G5a–G5f) and
`verify/verify_G4.py` (G4m). The comparison with T′ is `research/constructions/centering_comparison.md`. Registry:
`T-WMC`.

## 1. Construction target

Write the first-moment zero of Stage 3 for arbitrary positive masses as an explicit operator construction. Record
what it preserves, what it removes, and when it fails. Whether WMC and T′ belong to one geometry is a separate
question (comparison record).

## 2. Source geometry

The source objects, as given in Stage 3:

- n point masses with weights mᵢ > 0 and total mass M = Σmᵢ;
- positions rᵢ ∈ ℝᵈ, stacked as the rows of X (n × d).

The configuration lives in the index space ℝⁿ tensored with ℝᵈ. The uniform direction **1** ∈ ℝⁿ, tensored with a
vector a, is a common translation of every point.

## 3. Projection map

- R_CM = (1/M)Σmᵢrᵢ = mᵀX/M.
- **Centering:** C_m = I − **1**mᵀ/M, so (C_mX)ᵢ = rᵢ − R_CM.
- **Moments:** L_m = D C_m = D − mmᵀ/M with D = diag(m), so (L_mX)ᵢ = uᵢ = mᵢ(rᵢ − R_CM).

## 4. Exact identities

| Identity | Card |
|---|---|
| Σᵢ uᵢ = 0, for every positive mass vector and every set of positions | G5a |
| C_m² = C_m; C_m**1** = 0 (kernel span{**1**}); mᵀC_m = 0 (image m^⊥, Euclidean); eigenvalues 1 (× n−1) and 0; rank n − 1 | G5b |
| C_m is not Euclidean-symmetric unless m ∝ **1**. It is self-adjoint for ⟨x, y⟩_D = xᵀDy (D C_m = C_mᵀ D). Its zero relation is ⟨**1**, C_m x⟩_D = 0 for every x | G5b |
| L_m is Euclidean-symmetric and positive semidefinite, with kernel span{**1**} and image **1**^⊥, so Σuᵢ = 0. It is not idempotent unless m ∝ **1** | G5c |
| With m = (1, 2, 3, 4) at e₁ … e₄, the centered positions eᵢ − m/M are pairwise equidistant (‖·‖² = 2) but have a nonzero plain sum; the moments uᵢ have unequal norms | G5e |

## 5. Lower-dimensional realization

C_m maps the configuration space onto the configurations with zero weighted mean (dimension (n−1)·d), removing the
translation **1** ⊗ R_CM. The moments uᵢ live in **1**^⊥: the same zero-sum relation as T′'s target, reached through a
different operator.

## 6. What is established

- **The zero, for every positive mass vector:** Σuᵢ = 0 (G5a).
- **The operators:**
  - C_m is a projection with kernel span{**1**} and image m^⊥ (G5b);
  - C_m is an orthogonal projection in the D-metric and an oblique projection in the Euclidean one (G5b);
  - L_m = D C_m is symmetric PSD with image **1**^⊥ (G5c).
- **What is preserved:** every relative position rᵢ − rⱼ, because centering subtracts one common vector (G5e).
- **What is lost:** the absolute location R_CM.
- **Equal masses (G4m):** C_m = Pₙ = L_m·(n/M). The simplex configuration appears when the positions are e₁ … eₙ.

## 7. What is derived

- **The metric is read off the zero relation, not inserted.** The first-moment zero Σmᵢ(rᵢ − R_CM) = 0 is exactly
  ⟨**1**, C_m X⟩_D = 0. The weights that define the zero are the weights that make C_m an orthogonal projection.
- **Which object carries the zero sum.** For unequal masses, the regular-simplex shape survives in the centered
  positions (as a translated simplex, G5e), but not as a zero-sum configuration. The zero sum is carried by the
  moments uᵢ, which are not a regular simplex.

## 8. What is NOT established

- That WMC and T′ belong to one geometry. The comparison record gives an exact operator-level family. Whether that
  family is a project geometry, or only weighted centering, is open.
- That WMC applies to the directional ensemble of Stage 2. That ensemble has no positions and no masses (D3).
- Anything physical beyond the mechanics of the center of mass.

## 9. Connection to Stage 2

None directly. Stage 2's contributions have no positions or weights. The link runs through Pair A only in the
equal-mass, standard-basis subclass (G4m with G2i). There the centered positions are exactly Stage 2's first-state
vectors, up to the isometry of G2i.

## 10. Questions generated

| ID | Question |
|---|---|
| Q-WMC-1 | Does a reconstruction analogous to G3b hold for WMC in the D-metric? Given centered positions and the masses, are the positions recovered up to a translation, and nothing else? |
| Q-WMC-2 | Which of Stage 3's zero-preserving changes, if any, are induced by D-orthogonal maps of the index space that fix **1**? |

## 11. Next construction tests

1. Q-WMC-1: repeat the G3b Gram argument in the D-metric.
2. Apply WMC unchanged to a system not built from masses: any weighted zero Σwᵢxᵢ = 0 with wᵢ > 0. Record whether
   this transfer is TRIVIAL CONSEQUENCE (a restatement) or STRUCTURAL TRANSFER.
3. Failure cases to keep: weights with Σwᵢ = 0 (C undefined); weights that are not positive reals (G5f).
