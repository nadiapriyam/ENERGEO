# T′ and weighted mass centering: outside-in comparison

This follows the six-step protocol of the transfer pass (2026-11-12). The cards are `verify/verify_G5.py`
(G5b–G5f), `verify/verify_G2.py` and `verify/verify_G4.py` (G4m). The registry records are `T-CENTERING-OPERATOR`
and `Q-CENTERING`.

## Step 1. Raw operators

- **T′.** The operator is Pₙ = I − (1/n)**1****1**ᵀ, applied to an orthonormal source e₁ … eₙ. Its outputs are
  vᵢ = Pₙeᵢ.
- **WMC.** The operator is C_m = I − **1**mᵀ/M, applied to positions X (rows rᵢ). Its outputs are centered
  positions C_mX. The moments are u = D C_mX, where D = diag(m).

## Step 2. Computed properties

| Property | T′ (Pₙ) | WMC (C_m) | WMC moments (L_m = D C_m) |
|---|---|---|---|
| kernel | span{**1**} | span{**1**} | span{**1**} |
| image | **1**^⊥ | m^⊥ (Euclidean) | **1**^⊥ |
| rank | n − 1 | n − 1 | n − 1 |
| eigenvalues | 1 (× n−1), 0 | 1 (× n−1), 0 | 0 and n − 1 positive values, not all 1 unless m ∝ **1** |
| idempotent | yes | yes | no, unless m ∝ **1** |
| symmetry / adjoint | Euclidean-symmetric | self-adjoint for ⟨x, y⟩_D = xᵀDy; not Euclidean-symmetric unless m ∝ **1** | Euclidean-symmetric, positive semidefinite |
| Gram behavior | Gram of vᵢ = Pₙ, a regular simplex | centered positions keep every pairwise difference; plain Gram is not tight in general | moments have unequal norms (G5e) |
| zero-producing condition | Σvᵢ = P**1** = 0 | ⟨**1**, C_m x⟩_D = 0 for every x | Σuᵢ = 0 (Euclidean) |

## Step 3. Exact common algebra (only after computation)

- **Same kernel.** Both operators are projections whose kernel is exactly the uniform direction **1**.
- **The zero relation has one form.** It is "orthogonal to **1**" in a metric that the zero relation itself
  specifies: the identity for T′, D = diag(m) for WMC.
- **One formula holds both (G5d).** For a positive diagonal G,

  C_G = I − **1****1**ᵀG / (**1**ᵀG**1**)

  is idempotent, kills **1**, is G-self-adjoint, and satisfies ⟨**1**, C_G x⟩_G = 0. G = I gives Pₙ exactly. G = D gives
  C_m exactly.

## Step 4. Exact differences (not hidden)

- **Different images.** T′ maps onto **1**^⊥; WMC maps onto m^⊥ (Euclidean). The two coincide only for m ∝ **1**.
- **Different metrics.** WMC's operator is orthogonal only in the D-metric. In the Euclidean metric it is an oblique
  projection.
- **Different carriers of the zero sum.** For WMC, the Euclidean zero sum is carried by the moments L_mX, and L_m is
  not a projection. For T′, the projector itself carries it.
- **Different configurations.**
  - T′ produces a regular simplex.
  - WMC on positions e₁ … eₙ produces a translated regular simplex, whose zero is a *weighted* sum, together with
    moments that are not a regular simplex.
  - A D-orthonormal source projected by C_m has D-Gram I − ssᵀ, with sᵢ = √(mᵢ/M). That is a tight frame, regular
    only if all masses are equal (G5e).
- **Different sources.** T′ needs an orthonormal source. WMC takes arbitrary positions.

## Step 5. Does one broader construction contain both?

**Answer: YES — exact construction**, at the operator and zero-relation level.

The construction is G-orthogonal removal of the uniform direction, C_G with positive diagonal G. It contains:

- T′ (G = I, orthonormal source);
- WMC (G = D, any positions).

Neither is modified.

Its scope is limited in three ways:

- **Configurations.** At the level of configurations it is a special case only. The regular-simplex zero occurs only
  for G ∝ I with an orthonormal source.
- **Content requires a nonzero removed mode.** Every zero-sum vector is a fixed point of Pₙ (G5f). So for an arbitrary
  zero sum, lying in the image says nothing. The construction has content only when a source with a nonzero removed
  mode is mapped.
- **What it excludes.** It covers only removal of **1** with positive real weights. It does not apply to weights with
  **1**ᵀG**1** = 0, to complex weights (Fourier k ≠ 0), to a removed direction other than **1**, or to nonlinear zeros
  (G5f).

Allowing the removed direction to be arbitrary would make it contain every hyperplane zero. That would lose its
discriminating power, and it is not adopted.

**The candidate research question** (not a hypothesis): *Is there a general geometry of centering/removing a
distinguished direction or weighted mode that contains the simplex projection and mass balance as exact cases?*

- At the operator level, C_G is an exact positive answer for the uniform direction with diagonal weights.
- Whether this is a project geometry, or the standard weighted centering of statistics, stays open (`Q-CENTERING`).

## Step 6. Secondary existing-theory match (after the derivation)

Comparison terms, not consulted for the derivation:

- weighted centering matrix;
- orthogonal projection in a weighted inner product;
- oblique projection (the Euclidean view of C_m);
- tight frames (the D-Gram I − ssᵀ).

C_G is a standard object. What the project adds is the observation that the metric is read off each system's own
zero relation.
