# R4 orthogonal-source construction (tetrahedral zero construction)

The first outside-in construction (`docs/research_method.md` §3), 2026-11-12. Cards: `verify/verify_G2.py`
(G2a–G2k, G2n); `verify/verify_G3.py` (G3a–G3d, G3n). Registry: `T-R4-TETRA`, `T-R4-DERIVED`, `T-R4-GENERAL`, `B-HIGHER-GEOMETRY-CHAIN`, `Q-R4-1` …
`Q-R4-8`. Neutral names only: this is not called "the origin geometry", "the true higher geometry" or "the quantum
geometry".

## 1. Construction target

Construct an exact lower-dimensional zero-sum configuration from an explicitly orthogonal higher-dimensional
source. Then record which relations of the source survive in it. This bears on:

- B-HIGHER-GEOMETRY, through the chain *zero output ← lower-dimensional relational structure ← higher-dimensional
  organization*;
- "0 is orthogonal", reading C (`T-ZERO-ORTHOGONAL-C`).

It does not close either.

## 2. Source geometry

- e₁, e₂, e₃, e₄: the standard orthonormal basis of ℝ⁴ (eᵢ · eⱼ = δᵢⱼ).
- **1** = (1, 1, 1, 1)ᵀ = Σᵢ eᵢ, with **1** · **1** = 4 and eᵢ · **1** = 1.
- H = **1**^⊥ = {x ∈ ℝ⁴ : x · **1** = 0}, a 3-dimensional subspace.

## 3. Projection map

P = I − ¼ **1** **1**ᵀ.

- P² = P, Pᵀ = P, P**1** = 0, rank P = 3 (G2a). So P is the orthogonal projector onto H.
- vᵢ = P eᵢ = eᵢ − ¼ **1** ∈ H (G2b).

## 4. Exact identities

Each line is derived by bilinear expansion with eᵢ · eⱼ = δᵢⱼ, eᵢ · **1** = 1 and **1** · **1** = 4. All are
checked in exact rational arithmetic.

| Identity | Derivation | Card |
|---|---|---|
| Σᵢ vᵢ = 0 | Σᵢ vᵢ = P Σᵢ eᵢ = P**1** = 0 | G2c |
| ‖vᵢ‖² = ¾ | 1 − 2·¼·1 + (¼)²·4 = 1 − ½ + ¼ | G2d |
| vᵢ · vⱼ = −¼ (i ≠ j) | 0 − ¼ − ¼ + (¼)²·4 | G2e |
| uᵢ · uⱼ = −⅓ (i ≠ j), uᵢ = vᵢ/‖vᵢ‖ | (−¼)/(¾) | G2f |
| Gram matrix of the columns v₁…v₄: G = I − ¼J = P | Gᵢⱼ = vᵢ · vⱼ; eigenvalues 1 (×3) and 0 (×1), kernel span{**1**} | G2g |
| span{vᵢ} = H, dim 3 | rank [v₁ … v₄] = 3, each vᵢ ⊥ **1** | G2h |

General n (G2n): Pₙ = I − (1/n) **1** **1**ᵀ and vᵢ = Pₙ eᵢ give:

- Σ vᵢ = 0;
- ‖vᵢ‖² = (n−1)/n;
- vᵢ · vⱼ = −1/n for i ≠ j;
- normalized, −1/(n−1).

These are derived symbolically in n, then checked exactly for n = 2…10 (rank n − 1).

Differences (G2j): vᵢ − vⱼ = P(eᵢ − eⱼ) = eᵢ − eⱼ, because (eᵢ − eⱼ) · **1** = 0. So:

- ‖vᵢ − vⱼ‖² = 2 for every i ≠ j;
- the n points vᵢ affinely span the (n−1)-dimensional **1**^⊥;
- vᵢ = eᵢ − (1/n)**1**, the source point minus the centroid of the source points.

These are checked exactly for n = 2…10.

## 5. Lower-dimensional realization

An orthonormal basis of H:

- h₁ = ½(1, 1, −1, −1)
- h₂ = ½(1, −1, 1, −1)
- h₃ = ½(1, −1, −1, 1)

Φ : H → ℝ³, x ↦ (h₁·x, h₂·x, h₃·x) is an isometry. Because hₖ ⊥ **1**, Φ(vᵢ) = ((h₁)ᵢ, (h₂)ᵢ, (h₃)ᵢ):

| i | Φ(vᵢ) | Φ(uᵢ) |
|---|---|---|
| 1 | ½(1, 1, 1) | (1, 1, 1)/√3 |
| 2 | ½(1, −1, −1) | (1, −1, −1)/√3 |
| 3 | ½(−1, 1, −1) | (−1, 1, −1)/√3 |
| 4 | ½(−1, −1, 1) | (−1, −1, 1)/√3 |

These are four vectors of equal length √3/2 in ℝ³, with pairwise angle arccos(−⅓) and zero sum.

## 6. What is established

ESTABLISHED (G2a–G2h): *An orthogonal basis in ℝ⁴ can project into a 3-dimensional subspace as four equal
tetrahedral vectors whose sum is zero.* (`T-R4-TETRA`)

The precise content behind that sentence:

- vᵢ = P eᵢ;
- Σ vᵢ = 0;
- ‖vᵢ‖² = ¾;
- vᵢ · vⱼ = −¼;
- uᵢ · uⱼ = −⅓;
- G = I − ¼J = P, with spectrum {1, 1, 1, 0};
- span = H.

ESTABLISHED (G2n): the same identities hold for every n ≥ 2 (`T-R4-GENERAL`). It was derived inside the project and
does not replace the ℝ⁴ case.

ESTABLISHED (G2j): for every n ≥ 2 the projected points are pairwise equidistant (‖vᵢ − vⱼ‖² = 2) and affinely
span **1**^⊥. They are the vertices of a regular simplex in the (n−1)-dimensional **1**^⊥. This answers Q-R4-3,
derived in project notation before any literature match.

ESTABLISHED (G2i): Stage 2's TETRA equals Φ(uᵢ), in the same order (§9).

## 7. What is derived

DERIVED CONNECTION, for this constructed example only (`T-R4-DERIVED`): *higher-dimensional orthogonal
organization → lower-dimensional zero-sum organization*. Two exact statements, inside the example:

- **The zero is the image of the removed direction.** Σ vᵢ = P(Σ eᵢ) = P**1**, and **1** spans exactly the kernel
  of P. The lower-dimensional zero is what the projection does to the sum of the source, which lies entirely along
  the one direction the projection removes.
- **The full relational structure of the shadow is the projector itself.** The Gram matrix of the shadow is
  G = PᵀP = P. The source Gram matrix is I. They differ by exactly ¼J, the part of I along **1**.

- **Differences survive exactly; only the common part is removed.** vᵢ − vⱼ = eᵢ − eⱼ (G2j), and
  vᵢ = eᵢ − (1/n)**1**. Within this example, the projection keeps every relation between source points and removes
  only their common component, the centroid ¼**1**. This is a first exact piece of Q-R4-1 and Q-R4-5, not an answer
  to either: both ask about recovering the source, which is a different matter.

CONSTRUCTION-BACKED DIRECTION (`B-HIGHER-GEOMETRY-CHAIN`): *zero output ← lower-dimensional relational structure ←
higher-dimensional organization*. One exact instance exists. It is not universal.

## 8. What is NOT established

- That physical proton cancellation comes from a hidden fourth spatial dimension, or anything about physical
  protons. Not established, and not to be implied in learner copy.
- That this construction is "the" larger geometry behind any zero, or the origin geometry of B-HIGHER-GEOMETRY.
- That every lower-dimensional zero is a shadow of orthogonal organization: Q-R4-4 and Q-R4-6 are open.
- That the source is recoverable from the zero-sum configuration: Q-R4-2 is open, and Σ vᵢ = 0 alone is weaker
  than G (Q-R4-5).
- Reading C of "0 is orthogonal" in general. This is one instance.
- Any identification with Hilbert space, spacetime or a model manifold.
- That Stage 2's tetrahedron was chosen because of this construction (chronology, §9).

## 9. Connection to Stage 2

**Result: ORTHOGONALLY EQUIVALENT (G2i).** Stage 2 is an exact coordinate realization of a configuration that is
orthogonally equivalent to the projected ℝ⁴ construction. The label is not "exactly equivalent": the source vectors
live in H = **1**^⊥ ⊂ ℝ⁴, Stage 2 uses displayed ℝ³, and an isometry must be chosen to identify them.

- Stage 2's first constructed state is 1.6 · TETRA, with TETRA = (±1, ±1, ±1)/√3 (even number of minus signs,
  `src/math/zero.js`).
- Under the explicit isometry Φ of §5, Φ(uᵢ) = TETRAᵢ entry for entry. There is no permutation, no sign change and
  no further rotation.
- The only differences are the isometry H → ℝ³ (unavoidable, because H ⊂ ℝ⁴) and the stage's common scale 1.6.
- Equivalently, the unnormalized shadows satisfy Φ(vᵢ) = (√3/2) TETRAᵢ.

The card reads TETRA from the app's source, so a change to Stage 2's starting state would re-test the equivalence.

**Provenance link:** Stage 2 tetrahedral cancellation ← exact realization of projected R4 orthonormal basis.

**Chronology, kept as it happened:**

1. The tetrahedron was first chosen for cancellation clarity (D3: equal magnitudes for the first constructed state).
2. Later, the R4 projection construction was discovered: proposed at the outside-in clarification (2026-11-11),
   carded 2026-11-12.

Earlier members of the same family, observed and not retro-assigned a purpose:

- **n = 2 (Stage 1).** P₂e₁ = ½(1, −1) = −P₂e₂, an opposed pair with zero sum. Any opposed pair (v, −v), v ≠ 0,
  matches it up to a rotation and a common scale.
- **n = 3 (#8, card O1b).** Two of the three orthonormal axes, seen along (1, 1, 1), "appear at 120°" (Gate 4).
  That is the n = 3 shadow, used then to show that projection changes angles.

## 10. Questions generated

| ID | Question |
|---|---|
| Q-R4-1 | What information about the original orthonormal basis survives in the projected tetrahedral zero-sum configuration? **Resolved under assumptions (2026-11-12).** With the source class known (orthonormal, orthogonal projection onto the span), everything survives except the sign of one normal and the ambient isometry (G3b). With no source class, only the Gram matrix survives, and the removed relation is not determined (G4c). |
| Q-R4-2 | Given only the tetrahedral zero-sum configuration in H, can the R⁴ orthogonal-source construction be reconstructed uniquely, up to a natural equivalence? **PROVED UNDER EQUIVALENCE** (ambient orthogonal transformation; permutation of the vertices; sign of the normal), assuming an orthonormal source and an orthogonal projection onto the span of the vᵢ. Nadia's eᵢ = vᵢ + ½n gives ‖eᵢ‖² = 1 and eᵢ·eⱼ = 0 (G3a). Any orthonormal fᵢ = vᵢ + wᵢ with wᵢ ⊥ span has Gram(w) = I − G = J/4, so every wᵢ equals one w with ‖w‖ = ½ (G3b). In ℝ⁴ that leaves only w = ±½n. Every n: G3n. |
| Q-R4-3 | For n orthonormal basis vectors in ℝⁿ projected onto **1**^⊥, does the resulting set always form a regular simplex in ℝⁿ⁻¹? **Derived: yes** (G2n, G2j). The points are pairwise equidistant (‖vᵢ − vⱼ‖² = 2) and affinely span the (n−1)-dimensional **1**^⊥. |
| Q-R4-4 | Does every regular simplex zero-sum configuration arise, up to orthogonal equivalence and scale, from this projection construction? **Proved.** Zero sum forces c = −r²/(n−1), so Gram = r²·n/(n−1)·(I − J/n), a multiple of the Gram of Pₙeᵢ (G3c). Equal Gram matrices give an isometry of spans: Q(Σaᵢvᵢ) = Σaᵢv′ᵢ is well defined and norm-preserving because ‖Σaᵢvᵢ‖² = aᵀGa. |
| Q-R4-5 | What properties of the higher-dimensional source are encoded by Σᵢ vᵢ = 0, versus by the stronger Gram-matrix structure Gᵢⱼ = ¾ (i = j), −¼ (i ≠ j)? The zero sum is weaker than the full relational structure. **Resolved.** Σvᵢ = 0 is exactly G**1** = 0 (**1** ∈ ker G). The full G fixes the configuration up to isometry. An orthonormal source of this type exists iff a multiple of G is idempotent (G3d). The zero sum alone cannot guarantee that: (1,0), (0,1), (−1,−1) has zero sum and no such source. |
| Q-R4-6 | Which lower-dimensional zero-sum configurations do not admit an orthogonal-source construction of this type? Construct examples and necessary conditions first. **Resolved (G3d)**, in two readings of "this type". (i) Any orthogonal projection of an orthonormal basis of ℝⁿ: exactly the configurations with two or more distinct nonzero Gram eigenvalues fail; (1,0), (0,1), (−1,−1) has eigenvalues {0, 1, 3}. (ii) Projection onto **1**^⊥ specifically: everything except regular simplices fails (G3c). The frame-theory match (tight frames as projections of orthonormal bases) is secondary, named after the derivation. |
| Q-R4-7 | Chapter I's opposed pair is the n = 2 member, #8's 120° view holds the n = 3 member, and Stage 2's tetrahedron is the n = 4 member. Does the Chapter I sequence instantiate one family indexed by n? What changes with n (angle −1/(n−1)), and what does not (zero sum, equal lengths)? **Special case.** Every exact Stage 1 state is the n = 2 member up to rotation and scale (G2k). Stage 2's first state is the n = 4 member (G2i). Stage 3 with equal masses at e₁…eₙ gives the family exactly (G4m). Stage 2's varied-magnitude states and Stage 3 in general are not members. The family itself is `T-SIMPLEX-FAMILY`. |
| Q-R4-8 | Here the zero sum is the shadow of the one removed direction (Σ vᵢ = P**1**). For other maps from a larger geometry, does a lower-dimensional zero always record a direction the map removes? Can that direction be characterized from the zero state's own structure without leaving the zero (B-ZERO-PRESERVE)? **Split (2026-11-12).** The established part is that for linear L, Σ Lxᵢ = 0 iff Σxᵢ ∈ ker L (G4a). The inverse problem is `Q-R4-8-INVERSE`, and stays OPEN in general. Special case proved: with the source class known, the removed direction is Σfᵢ = 4w, up to sign (G3b). Exact obstruction: with L unknown, the zero does not determine whether or which relation was removed (G4c). |

## 11. Next construction tests

1. **Q-R4-2 (formalize, then test).** Define the candidate equivalence (O(4) elements fixing **1**, restricted to H;
   basis permutations; scale). Test whether two sources yielding the same G (or the same Σ = 0 only) are related by it.
2. **Q-R4-5 (separate the two strengths).** Construct four vectors in ℝ³ with Σ = 0 but G ≠ c(I − ¼J), such as
   Stage 2's later varied-magnitude states. Record which source properties fail to be recoverable.
3. **Q-R4-6 (boundary).** Weighted sources mᵢeᵢ with unequal mᵢ projected onto **1**^⊥ have Σ = P m, which is
   nonzero unless m ∝ **1**. Find the projections, if any, that give a zero sum for them. Derive necessary
   conditions before naming a classification.
4. **Stage 2's zero-preserving changes.** A permutation of the source basis fixes **1**, so it commutes with P and
   permutes the shadows. Test which of Stage 2's changes (swap, turn all, …) are induced by source maps that fix
   **1**.
5. **Q-R4-7.** Card the n = 2 and n = 3 instances against Stage 1's pair and O1b's configuration with the same
   method as G2i.

Literature (regular simplex, simplex frames, equiangular tight frames) is consulted only after these, and only as
a *secondary existing-theory match*.
