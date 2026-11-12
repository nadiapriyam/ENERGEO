# Zero as connector: the linear case

Pass 3 of the research sequence (2026-11-12). Cards: `verify/verify_G4.py` (G4a–G4c, G4m) and `verify/verify_G3.py`
(G3b, G3n). Registry: `T-ZERO-CONNECTOR-LINEAR`, `T-ZERO-CONNECTOR`, `Q-R4-8-INVERSE`. Transfer tests:
`research/application_matrix.md`.

## 1. Construction target

State exactly when a zero in a target representation is the image of a nonzero relation in a source representation,
for linear maps. Then determine what is recoverable when the map is known, and when it is unknown. The project
hypothesis T-ZERO-CONNECTOR (zero as an interface between descriptions) is the target. The linear case is one exact
realization and does not establish it.

## 2. Source geometry

A real or complex vector space V (the source description), with vectors x₁ … x_k whose sum Σxᵢ may or may not be 0.

## 3. Projection map

A linear map L : V → W (the representation), with kernel ker L = {x : Lx = 0}. Projections are one kind of L.
Linear functionals are another: the Fourier coefficient f ↦ ⟨f, e_k⟩, and v ↦ ⟨u, v⟩.

## 4. Exact identities

| Identity | Card |
|---|---|
| Σᵢ Lxᵢ = L(Σᵢ xᵢ), so Σᵢ Lxᵢ = 0 ⟺ Σᵢ xᵢ ∈ ker L | G4a |
| With L known, the sources consistent with a target y form x₀ + ker L, with dim ker L free parameters | G4b |
| With L unknown, one target zero-sum configuration (the tetrahedral vᵢ) comes from: P applied to eᵢ (removing **1**); P applied to vᵢ, whose sum is already 0 (nothing removed); and an oblique projection along d = e₁ applied to vᵢ + aᵢd (removing 10d) | G4c |
| With the source class fixed (orthonormal), the map class fixed (orthogonal projection onto the span) and L unknown, the source is fᵢ = vᵢ + w with ‖w‖² = 1/n, unique up to an isometry fixing the span; in ℝⁿ, up to the sign of the normal. The removed direction is Σfᵢ = n·w. | G3b, G3n |
| Mass balance: C_m = I − **1**mᵀ/M is a projection with ker C_m = span{**1**} and mᵀC_m = 0 | G4m |

## 5. Lower-dimensional realization

For a projection, the target is the range of L, of dimension dim V − dim ker L. For a functional, the target is one
number. In both, the target's zero is connected to a whole subspace of the source: x₀ + ker L, or the hyperplane
u^⊥ or e_k^⊥. A zero in the target is an interface to that source subspace. It is not "the lower-dimensional object".

## 6. What is established

- **The linear connector (G4a).** For every linear map: a source relation in ker L becomes a zero in the target, and
  only such relations do.
- **Recoverability with L known (G4b).** The source is determined exactly modulo ker L.
- **Recoverability with the class known (G3b, G3n).** For orthogonal projections of orthonormal sources, the source
  and the removed direction are determined up to the sign of the normal and the ambient isometry fixing the span.
- **Exact obstruction with L unknown and the class unconstrained (G4c).** The target zero does not determine whether
  any relation was removed, nor which one.

## 7. What is derived

- **The connector has three cases**, depending on what is known: L itself (source mod ker L); the class of L and of
  the source (source up to a stated equivalence); or nothing (no recovery; G4c).
- **Not every zero is created by the map.** The zero can be inherited: when Σxᵢ = 0 already in the source, the map
  removes nothing (G4c, case ii).
- **The same structure in an independent system.** The first-moment zero of Stage 3 has it (G4m): a projection whose
  kernel is the uniform direction **1**, with the weighted resultant annihilating its range. With equal masses at
  e₁ … eₙ, the centering map equals Pₙ, and the centered positions are exactly the simplex vᵢ. With unequal masses
  the unchanged Pₙ fails (mᵀP₄ = (−3/2, −1/2, 1/2, 3/2) ≠ 0), and the weighted variant C_m is needed.

## 8. What is NOT established

- **T-ZERO-CONNECTOR in general.** The hypothesis that a zero/resultant functions as an interface between a larger
  geometry and a lower-dimensional representation is not established. The linear case is one exact realization.
- **Zeros of nonlinear relations.** Null vectors q(v) = 0 of an indefinite form, and |x|² = 0, are not kernels of
  linear maps, so this template does not reach them (application matrix).
- **Recovery without knowing the map or the source class.** This is open beyond the special case, and has an exact
  obstruction (G4c).
- **Anything physical.** That physical cancellations (protons, MRI) arise from removed source relations. Physical
  validation needs physical theory or data.
- **Pair A.** Any filled-in common relation for Pair A. The equal-mass identity of G4m is recorded, but it does not
  fill in the pair.

## 9. Connection to Stage 2

- **Stage 2's first state (G2i)** is the target of case (i) in G4c: P applied to e₁ … e₄.
- **Stage 2's later states** (varied magnitudes, zero sum) have a Gram matrix that is generally not tight. So they have
  no orthonormal-basis source of this type (G3d), although the linear connector still applies to them with other
  sources (G4c).
- **Stage 3 with equal masses at e₁ … e₄** produces exactly Stage 2's first-state vectors (G4m). This identity links
  the two sides of Pair A in one special configuration. It is recorded here and in the application matrix. It does
  not fill in Pair A's deeper common relation.

## 10. Questions generated

| ID | Question |
|---|---|
| Q-R4-8-INVERSE | Given only the target zero/configuration, and without already knowing L, can the removed source direction or larger geometry be recovered? (Nadia's words.) Special case proved (G3b); exact obstruction without constraints (G4c); open in general. |
| Q-CONNECT-1 | Which source classes, other than orthonormal sets, make the removed relation recoverable from the target zero alone? |
| Q-CONNECT-2 | Is there a connector template for nonlinear zero conditions (q(v) = 0, \|x\|² = 0) that reduces to the linear one when the relation is linear? |

## 11. Next construction tests

1. **Q-CONNECT-1.** Repeat G3b's Gram argument with "orthonormal" replaced by "orthogonal with known norms", then by
   "equal norms".
2. **Weighted mass balance.** Determine whether the C_m variant (an orthogonal projection in the m-weighted inner
   product) reconstructs positions from centered ones up to translation. This is the analogue of G3b for Stage 3.
3. **Q-CONNECT-2.** Construct the nonlinear case on the null cone of η before naming any structure.
4. Apply the unchanged template to a system not yet in the project, and record the result in the application matrix.
