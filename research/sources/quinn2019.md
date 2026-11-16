# Source card: Quinn, Wilber, Townsend, Sethna 2019

**Katherine N. Quinn, Heather Wilber, Alex Townsend, James P. Sethna.** "Chebyshev approximation and the global geometry of model predictions." *Physical Review Letters* 122, 158302 (2019). DOI 10.1103/PhysRevLett.122.158302.

- arXiv: [1809.08280](https://arxiv.org/abs/1809.08280) (v1, 22 Sep 2018). The arXiv v1 title is "Chebyshev approximation and the global geometry of **sloppy models**", and v1 is the only arXiv version.
- **Read on 2026-11-15:** the full text of arXiv v1, with its supplemental material, was downloaded from arxiv.org.
- **Not read:** the published PRL version. Any wording changed between v1 and the PRL, including possible corrections, is not checked. *(Superseded 2026-11-16: the published PRL text was read; see "Published PRL" below.)*

## Exact quotations (arXiv v1)

**Model class and prediction vector** (p. 1):

> Consider a nonlinear model that depends continuously on input parameters θ = (θ1, ..., θK) to generate predictions yθ(t). We assume without loss of generality that the model is shifted and scaled so that t ∈ [−1, 1]. Using model predictions yθ(tk) = Yk at N points {tk} ⊂ [−1, 1], N ≥ K, the model manifold Y is defined as the K-dimensional surface parameterized by Y(θ) = (Y0, ..., YN−1) and embedded in the N-dimensional prediction space.

There is no noise or Fisher weighting: the prediction space is ℝᴺ with the Euclidean norm.

**Evaluation matrix and the ball** (p. 1):

> By definition, P(θ) = Xb, where Xij = φj−1(ti−1) and b = (b0, ..., bN−1)ᵀ. Here, X forms a linear map from parameter space to prediction space.

> Suppose, for example, that ‖b‖2 < r, so that the parameter space is bounded in S, an N-sphere of radius r. The action of X on S distorts it into a hyperellipsoid HP. If ℓj(HP) is the diameter of the jth cross-section of HP, then ℓj(HP) = 2rσj(X), (1)

**Error term** (p. 2):

> Accounting for the error ‖yθ − pN−1‖∞, where ‖·‖∞ is the L∞ norm on [−1, 1], we find that a hyperellipsoid HY must enclose Y, with cross-sectional widths given by ℓj(HY) = 2rσj(X) + 2‖y − pN‖∞. (2)

**Chebyshev polynomials** (p. 2):

> Tj(t) = cos(j arccos t)

**Theorem 1** (p. 2):

> Let M > 0 and ρ > 1 be constants and suppose that yθ(t), t ∈ [−1, 1], is analytically continuable to the region enclosed by the Bernstein ellipse Eρ, with |yθ| ≤ M in Eρ, uniformly in θ. Let pN−1(t; θ) be as in Eq. (3). Then, (i) ‖yθ − pN−1‖∞ ≤ 2Mρ^(−N+1)/(ρ − 1), (ii) |c0| ≤ M, |cj(θ)| ≤ 2Mρ^(−j), j ≥ 1. Proof. For a proof, see Theorem 8.2 in [9].

Reference [9] is L. N. Trefethen, *Approximation Theory and Approximation Practice* (SIAM, 2013).

**Box to ball** (p. 2):

> we define modified coefficients c̃j = ρ^j cj. We then have that P(θ) = Xc̃, where X = JD, Jij = Tj−1(ti−1), and D is diagonal with entries Djj = ρ^(−(j−1)). By (5), we have that ‖c̃‖2 < 4M√(4N − 3).

**Singular-value bound** (p. 2; this is Theorem 2 applied to XᵀX = DJᵀJD):

> for j > 1, σj(X) ≤ √N ρ^(−j+2)/√(ρ² − 1)

**Width bound, Eq. (8)** (p. 2):

> ℓj(HY) ≤ 4Mρ^(−N+1)/(ρ − 1) + 2M√(4N² − 3N) ρ^(−j+2)/√(ρ² − 1), for 2 ≤ j ≤ N.

**Upper bound, not the manifold's widths** (Fig. 1 caption):

> forming an upper bound on possible lengths of the manifolds

**Abstract** (this claim is stronger than the theorem):

> our bounds capture global geometric features that are intrinsic to their model manifolds

**Non-analytic models** (supplement §I): if yθ has ν − 1 absolutely continuous derivatives and a νth derivative of total variation V, then

> |cj| ≤ 2V/π (j − ν)^−(ν+1), j ≥ ν + 1

The widths then decay algebraically.

## What the project takes from it (C7 pass 1)

| Object | Exact meaning | What it is NOT |
|---|---|---|
| H_P | the image under X = JD of the ball ‖c̃‖₂ ≤ r. Principal semi-axes rσⱼ(X); diameters ℓⱼ(H_P) = 2rσⱼ(X) | not the model manifold's widths |
| W_j^bound | upper bounds on the extent of the model image Y along the axes of H_P | equal to the actual widths only in special cases (C7o, C7p, C7q) |
| the actual model image Y(Θ) | the set of predictions | its widths are not computed by the paper, except numerically in Fig. 1c |

## Precision notes, verified by project cards

1. **The radius is stated inconsistently.** Eq. (5) bounds a box: |c̃₀| ≤ M and |c̃ⱼ| ≤ 2M. The box's largest Euclidean norm is M√(4N − 3), at a corner. The text states 4M√(4N − 3), which is valid but loose by a factor of 4. Eq. (8) uses M√(4N − 3) (C7g).
2. **The error term in Eq. (2), as written, is too small.** The truncation error is bounded in the sup norm, so the error vector satisfies ‖e‖∞ ≤ ε, ‖e‖₂ ≤ √N ε, and its extent along a unit direction u is 2ε‖u‖₁ ≤ 2√N ε. Also, a Minkowski sum with an ellipsoid is not the ellipsoid with additively enlarged axes.
   - An exact family at two sample points (C7i) leaves the hyperellipsoid whose cross-sectional widths are 2rσⱼ + 2ε (C7j).
   - **Valid replacements:**
     - extent along the j-th axis u_j of H_P ≤ 2rσⱼ + 2ε‖u_j‖₁;
     - enclosure in the ellipsoid with semi-axes √2·√(r²σⱼ² + Nε²) (C7j).
   - This is a scope correction to arXiv v1. The published version was not checked.
3. **Nothing about the parameterization enters.** The hypotheses (Theorem 1) concern the set of functions {yθ}, and X depends only on the sample points and ρ. The enclosure is therefore unchanged by any reparametrization θ = θ(φ) with the same image (C7k). The paper does not state this; the card checks it.
4. **Fisher eigenvalues** are not mentioned. The paper relates the widths of its bounding set to σⱼ(X), the singular values of the column-scaled evaluation matrix. It does not relate them to the Fisher information matrix.

## Published PRL (read 2026-11-16, final C7 lock/audit pass)

**Which file.** The PDF hosted by the NSF Public Access Repository, record 10101033 (https://par.nsf.gov/servlets/purl/10101033).
- The PAR page labels it "Accepted Manuscript", but the file is typeset in the published format:
  - header "PHYSICAL REVIEW LETTERS 122, 158302 (2019)";
  - pages 158302-1 to 158302-6;
  - "© 2019 American Physical Society";
  - production line "0031-9007=19=122(15)=158302(6)";
  - "(Received 15 September 2018; revised manuscript received 17 February 2019; published 18 April 2019)".
- The APS site itself was not accessed: its PDF requires a subscription, and its public link returned a bot challenge. Neither was circumvented.
- The text below is therefore the published typeset text as deposited in PAR.

**Eq. (2), published wording** (p. 158302-2/-3):

> Accounting for the polynomial approximation error ‖yθ − pN−1‖∞, where ‖·‖∞ is the L∞ norm on [−1, 1], we can define a hyperellipsoid HY that must enclose model manifold Y, where the cross-sectional widths are given by ℓj(HY) = 2rσj(X) + 2‖y − pN−1‖∞. (2)

- The only change from arXiv v1 is the subscript of the truncation in the error term: pN−1, where v1 had pN.
- The geometric claim is unchanged: an enclosing hyperellipsoid whose cross-sectional widths are 2rσj(X) + 2ε.

**Eq. (1), published wording:**

> Suppose, for example, that ‖b‖2 < r, so that the coefficient space is bounded in S, an n sphere of radius r. The action of X on S distorts it into a hyperellipsoid HP. If ℓj(HP) is the diameter of the jth cross section of hyperellipsoid HP, then ℓj(HP) = 2rσj(X), (1) where σj(X) are the ordered singular values of X.

**Truncation:**

> Note that the truncation is set by the number of sampled points, N.

**Theorem 1:** unchanged from arXiv v1, including "uniformly in θ" and "Proof.—For a proof, see Theorem 8.2 in Ref. [18]."

**Coefficient radius:** unchanged from arXiv v1:

> By Eq. (5), we have that ‖c̃‖2 < 4M√(4N − 3). This implies that the polynomial manifold P is bound in a hyperellipsoid HP. By Eq. (1), we have that ℓj(HP) = 8M√(4N − 3)σj(X).

**Singular values and Eq. (8):**

> for j > 1, σj(X) ≤ √N ρ^(−j+2)/√(ρ² − 1)

> It follows from Eqs. (2) and (4) that predictions for yθ(t) are bounded by a hyperellipsoid HY, with ℓj(HY) ≤ 2M√(4N² − 3N) ρ^(−j+2)/√(ρ² − 1) + 4Mρ^(−N+1)/(ρ − 1), (8) for 2 ≤ j ≤ N, i.e., ℓj(HY) = O(ρ^(−j) + ρ^(−N)). (9)

**Model class:**

> If we consider the model predictions at N fixed points, {t0, …, tN−1}, then our predictions for parameters θ form an N-dimensional vector Y(θ) = (yθ(t0), …, yθ(tN−1)) = (Y0, …, YN−1). ... Specifically, model manifold Y is a K-dimensional surface embedded in an N-dimensional prediction space.

**Representation:**

> The hyperribbon structure of Y, of course, does not depend on our representation of yθ, but rather on intrinsic properties of the model, such as its smoothness.

**The bound's status** (Fig. 1 caption): "include the error term from Eq. (2) ..., forming an upper bound on possible lengths of the manifolds".

**Corrections search** (2026-11-16):
- Crossref metadata for DOI 10.1103/PhysRevLett.122.158302: `updated-by` absent, `relation` empty, so no Crossmark-registered correction.
- A web search for an erratum, correction or corrigendum found none.
- arXiv has only v1 (v2 does not exist).
- The APS article and issue pages could not be opened from this environment.

No official correction was located in this audit.

**Audit verdicts** (cards C7La–C7Lp):
- **Eq. (2):** counterexample to Eq. (2) as written under the ordinary Euclidean prediction-space interpretation (C7Lc). Under the alternative reading, in which the error is measured as a Euclidean ball, its containment claim also fails for unequal axes (C7Ld).
- **Coefficient radius:** an internal constant inconsistency, likely a typographical factor.
  - 4M√(4N − 3) is valid but loose by a factor of 4.
  - Eq. (8)'s first term matches the tight radius M√(4N − 3) (C7Lf, C7Lg).
  - This is not a new mathematical result.
