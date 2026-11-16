# C7 final lock / audit

Generated from `research/tools/c7_lock_source.py` (`research/c7_lock.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Final adversarial C7 lock / audit". Cards: `verify/verify_C7L.py` (C7La–C7Lr). Audits `research/constructions/c7_fourier_width.md` (pass 1, kept).

**Decision: LOCK C7-R / CLOSE THIS BRANCH.** the audit found no mathematical defect in C7-R as corrected: every surviving statement is carded (C7La–C7Lr), the source-level problems are confined to Quinn's Eq. (2) and constants and are replaced by proved statements; C7-F(inv) stays a separate OPEN question. C7-F(inv) (OPEN) and C7-LB+ (OPEN, optional) are separate future questions; T-C7 keeps its original wording.

## A. Published-source audit

the published PRL, Phys. Rev. Lett. 122, 158302 (2019): the typeset PDF deposited at NSF PAR record 10101033 (labelled "Accepted Manuscript" on the PAR page; it carries the PRL header, pages 158302-1 to -6, the APS copyright line and the production line 0031-9007=19=122(15)=158302(6)). The APS site itself was not accessed: the PDF needs a subscription and the public link returned a bot challenge; neither was circumvented.

> Accounting for the polynomial approximation error ‖yθ − pN−1‖∞, where ‖·‖∞ is the L∞ norm on [−1, 1], we can define a hyperellipsoid HY that must enclose model manifold Y, where the cross-sectional widths are given by ℓj(HY) = 2rσj(X) + 2‖y − pN−1‖∞. (2)

- Change from arXiv v1: the only difference from arXiv v1 is the subscript of the error term (pN−1 instead of pN); the geometric claim is the same.
- Radius: "By Eq. (5), we have that ‖c̃‖2 < 4M√(4N − 3). This implies that the polynomial manifold P is bound in a hyperellipsoid HP. By Eq. (1), we have that ℓj(HP) = 8M√(4N − 3)σj(X)."
- Eq. (8): ℓj(HY) ≤ 2M√(4N² − 3N) ρ^(−j+2)/√(ρ² − 1) + 4Mρ^(−N+1)/(ρ − 1), (8) for 2 ≤ j ≤ N.
- Corrections: Crossref (DOI 10.1103/PhysRevLett.122.158302): no updated-by entry and an empty relation list; a web search found no erratum, correction or corrigendum; arXiv has only v1; the APS article page could not be opened here.

**No official correction was located in this audit.**

## B. Quinn Eq. (2) verdict

**Counterexample to Eq. (2) as written under the ordinary Euclidean prediction-space interpretation.**

- the sampled error lies in the box [−ε, ε]^N; for a Euclidean unit u, sup_(e in the box) uᵀe = ε‖u‖₁ with 1 ≤ ‖u‖₁ ≤ √N (C7Lb)
- example (i), N = 2, t = (−1, 1): y_θ(t) = θ₁ + θ₂T₂(t), |θ₁| < 1, |θ₂| ≤ 1/10; Eq. (2) gives the disk of radius √2 + 1/10; the point θ = (99/100, 1/10) gives Y = (109/100)(1, 1) with ‖Y‖² − (√2 + 1/10)² = 0.0834 > 0 (exact); the width along (1, 1)/√2 is 2.2√2 = 3.1113 > 2√2 + 1/5 = 3.0284 (C7Lc)
- example (ii), distinct singular values, t = (−1, 0, 1): y_θ = θ_a(T₀ + T₂)/√2 + θ_eT₄; σ(X) = (2, √2, √2), first axis (1, 0, 1)/√2; the Eq. (2) ellipsoid value at θ = (99/100, 1/10) is 1.0249 > 1 (C7Lc)
- even if the error were a Euclidean ball (a reading the paper's sup-norm bound does not give), containment in the ellipsoid with semi-axes rσ_j + δ fails for unequal axes: value 1.1493 > 1 for a = (1, 1/10), δ = 1/10 (C7Ld)

Not claimed: not "the published paper is wrong" in every reading: under a reading where "cross-sectional width" means a directional width along the axes AND the error is a Euclidean ball of radius ε, the widths 2rσ_j + 2ε are correct; that reading does not match the paper's sup-norm error bound.

## C. Quinn constant verdict

**internal constant inconsistency / likely typographical factor; not a new mathematical result.**

- |c̃_0| ≤ M and |c̃_j| ≤ 2M give ‖c̃‖₂² ≤ M² + 4M²(N − 1) = M²(4N − 3), so ‖c̃‖₂ ≤ M√(4N − 3) (C7Lf)
- the printed ‖c̃‖₂ < 4M√(4N − 3) is valid but loose by exactly 4, and the printed ℓj(HP) = 8M√(4N − 3)σj(X) is consistent with that loose radius (C7Lf)
- Eq. (8)'s first term equals 2·M√(4N − 3)·√Nρ^(−j+2)/√(ρ² − 1): it uses the TIGHT radius; the printed radius would give 4× Eq. (8) (C7Lg)
- Eq. (8)'s second term 4Mρ^(−N+1)/(ρ − 1) = 2ε is the additive Eq. (2) error term and inherits its issue (C7Lg)

## D. Correct enclosure geometry

| Object | Exact statement | Status | Cards |
|---|---|---|---|
| error set | [−ε, ε]^N (a box), ε = sup_θ ‖y_θ − p_(N−1)(θ)‖∞ | PROVED | C7Lb |
| coefficient-box / Minkowski set inclusion | the exact coefficient-box/Minkowski set inclusion used in the argument is Y(Θ) ⊆ H_P ⊕ [−ε, ε]^N (Quinn's ball form) and Y(Θ) ⊆ V_mD_m·[−1, 1]^m ⊕ [−R_m, R_m]^N (box / zonotope form): Minkowski sums, not ellipsoids in general; equality between the model image and these sets is NOT claimed | PROVED | C7Lb, C7Ld |
| directional width bound | width_u(Y) ≤ width_u(H_P) + 2ε‖u‖₁ = 2r‖Xᵀu‖ + 2ε‖u‖₁; along the j-th axis of H_P: 2rσ_j + 2ε‖u_j‖₁ ≤ 2rσ_j + 2√N ε; zonotope form 2‖D_mV_mᵀu‖₁ + 2R_m‖u‖₁ | PROVED | C7Lb, C7Lc |
| conservative enclosing ellipsoid | H_P ⊕ [−ε, ε]^N ⊆ E(2(AAᵀ + Nε²I)), A = rX: semi-axes √2·√(r²σ_j² + Nε²); proof by support functions, h_(E(Q))(u) = √(uᵀQu) ≥ ‖Aᵀu‖ + δ; the √2 cannot be dropped in general | PROVED | C7Le |
| Eq. (2) additive ellipsoid | the ellipsoid with semi-axes rσ_j + ε: does NOT contain Y in general (C7Lc), and does not contain H_P ⊕ B₂(ε) for unequal axes (C7Ld) | FAIL | C7Lc, C7Ld |

## E. C7-R final theorem (KNOWN-REFORMULATION; RESTRICTED STRUCTURAL CONNECTION)

Hypotheses:
- a family F = {f_θ} ⊆ C[−1, 1] with a family-wide envelope |a_k(θ)| ≤ r_k on its Chebyshev coefficients (= the cosine-Fourier coefficients of F_θ(φ) = f_θ(cos φ)), Σ r_k < ∞
- sample points x_1…x_N ∈ [−1, 1]; prediction space ℝᴺ with the Euclidean metric

Conclusions:
- (1) sup_θ ‖f_θ − Σ_(k<m) a_k(θ)T_k‖∞ ≤ R_m = Σ_(k≥m) r_k, so d_m(F; C[−1, 1]) ≤ R_m (N-free)
- (2) the exact coefficient-box/Minkowski set inclusion used in the argument is Y(Θ) ⊆ V_mD_m·[−1, 1]^m ⊕ [−R_m, R_m]^N (equality with the model image is not claimed)
- (3) directional widths: width_u(Y(Θ)) ≤ 2‖D_mV_mᵀu‖₁ + 2R_m‖u‖₁ for every Euclidean unit u
- (4) conservative ellipsoid: Y(Θ) ⊆ E(2(m·V_mD_m²V_mᵀ + N R_m² I)), semi-axes √2·√(mσ_j(V_mD_m)² + NR_m²)
- (5) at Gauss–Chebyshev (first-kind) nodes, unweighted: σ(V_mD_m) = {√N r_0} ∪ {√(N/2) r_k : 1 ≤ k < m}, m ≤ N
- (6) with a geometric envelope from uniform analyticity in E_ρ (equivalently, uniform analyticity of the even, 2π-periodic F_θ in |Im φ| < log ρ): R_m = 2Mρ^(1−m)/(ρ − 1)
- (7) every object in (1)–(6) is defined from the function set, the sample points and the metric, hence unchanged by reparametrizations that keep the set

Not claimed: any lower bound on the actual widths (C7-LB: FAIL); any relation to raw Fisher eigenvalues (C7-F(raw): FAIL); an invariant local-spectrum statement (C7-F(inv): OPEN); necessity of coefficient decay for a hierarchy; the Eq. (2) additive ellipsoid.

Conventions locked:

- **Chebyshev nodes**: exact axes σ(VD) = {√N r_0} ∪ {√(N/2) r_k} hold for Gauss–Chebyshev (first-kind) nodes x_i = cos((i + 1/2)π/N), i = 0…N − 1, with the unweighted Euclidean metric; they fail for Chebyshev–Lobatto (extrema) nodes unless the weights (1/2, 1, …, 1, 1/2) are used (norms N − 1 at k = 0, N − 1, (N − 1)/2 otherwise) (C7Li)
- **periodic Fourier route**: "exactly √N × the envelope" holds in the complex basis e^(ikt), |k| ≤ K, with an envelope on the complex coefficients and 2K + 1 ≤ N equally spaced samples (each r_k twice for ±k); in the real basis (1, cos kt, sin kt) the axes are √N r_0 and √(N/2) r_k; the Nyquist mode (N even, k = N/2) is degenerate and excluded; modes alias mod N (C7Lj)
- **Kolmogorov width**: d_m(F; C[−1, 1]) = inf_(dim L = m) sup_(f∈F) inf_(g∈L) ‖f − g‖∞. Choosing L_m = span{T_0, …, T_(m−1)} proves d_m(F; C[−1, 1]) ≤ R_m = Σ_(k≥m) r_k. Equality is not guaranteed for an arbitrary family satisfying only the coefficient envelope; sharpness requires an appropriate extremal family / function and must be stated separately (for 1/(θ − x) at θ = 2, x = 1 the TRUNCATION error equals R_m, which is a statement about that truncation, not about d_m). A function-space width, not a prediction-space ellipsoid axis (C7Lk)
- **reparametrization**: unchanged under a parameter change that keeps the set {f_θ}: the coefficient set, the family-wide envelope (a supremum over the set), the sampled prediction set Y(Θ), the exact Minkowski enclosure and the Quinn-style enclosure built from them; changed: the raw Fisher matrix and its eigenvalues (C7Lo)

## F. C7-F(raw): FAIL

Claim tested: a universal, chart-independent implication "output coefficient decay ⟹ raw Fisher eigenvalue decay".

- one parameter, θ = aφ: g_φ = a²g_θ, while the function set, its coefficients, the envelope and the prediction image are unchanged (C7Lm)
- several parameters, θ = θ₀ + A(φ − φ₀) with the domain mapped accordingly: g_φ = Aᵀg_θA, and A = g_θ^(−1/2)Λ^(1/2) realizes ANY positive spectrum Λ at that point; for F-C at θ = (1, 2): spectra (1, 1), (1, 1e12) and (5, 7) (C7Lm)
- every output-side object is a function of the set and stays fixed (C7Lo), so it cannot determine a quantity that varies arbitrarily within the same set

the original C7 wording stays in the registry (T-C7, OPEN in its invariant reading); this FAIL is about its raw-spectrum reading (T-C7-FRAW, superseded by T-C7-FINV).

C7-F(inv): **OPEN**. Would need:
- a separately supplied parameter metric h that transforms as a tensor (h_φ = Aᵀh_θA), and a prediction metric W: then σ(W^(1/2)J_Yh^(−1/2)), the singular values of dY: (T_θΘ, h) → (T_YP, W), are invariant (C7Ln)
- or generalized eigenvalues of a metric pair (g, h) with h a tensor (MMIb)
- or prediction-space geometric widths instead of Fisher eigenvalues (C7-R)

no structure of this kind is supplied by the model, and no theorem in the repository relates coefficient decay to an invariant local spectrum; not attempted (Nadia: "Do not attempt to solve C7-F(inv).").

## G. Lower-bound verdict: FAIL

**Envelope alone ⇏ nonzero actual-width lower bound.** the envelope is an upper constraint; for every envelope with r_0 > 0 and every η > 0 the family θ·(η/2√N)·T_0, θ ∈ [0, 1], satisfies it with image diameter < η and all further widths 0; the singleton {0} satisfies it with all widths 0 (C7Ll).

Would need (not pursued):
- occupancy of a coefficient region (a contained ball or box)
- surjectivity of θ ↦ a(θ) onto a coefficient region
- a bi-Lipschitz / non-degeneracy condition on θ ↦ a(θ)
- a lower singular-value bound for the composed map

a future optional branch (C7-LB+, OPEN); not a blocker for locking C7-R.

## H. Fourier / Chebyshev analyticity statement

With z = e^(iφ), φ = α + iβ, |z| = e^(−β): the annulus ρ^(−1) < |z| < ρ is the strip |Im φ| < log ρ, and x = (z + z^(−1))/2 = cos φ maps it 2-to-1 (z ↔ 1/z) onto the open region bounded by E_ρ, the unit circle folding onto [−1, 1]. Exact equivalence: f is analytic in the open region bounded by E_ρ with |f| ≤ M ⟺ F = f∘cos is analytic in |Im φ| < log ρ with |F| ≤ M; such an F is automatically 2π-periodic and even. Conversely an analytic, 2π-periodic, EVEN F on the strip descends to such an f (Laurent coefficients g_(−k) = g_k, G = g_0 + 2Σ g_kT_k(x)). Without evenness the descent fails (sin φ).

Supersedes: pass 1: "strip analyticity of F_θ is Bernstein-ellipse analyticity of f_θ" (C7-B) — correct only with the even, 2π-periodic hypothesis stated, which F = f∘cos satisfies automatically.

## I. Final C7 status table

Terminal statuses only: PROVED, KNOWN-REFORMULATION, RESTRICTED, FAIL, OPEN.

| ID | Claim | Final status | Scope | Cards |
|---|---|---|---|---|
| C7-A | Fourier / Chebyshev coefficient identity | **KNOWN-REFORMULATION** | every continuous f on [−1, 1] | C7a, C7b |
| C7-B | uniform coefficient decay → uniform approximation control | **KNOWN-REFORMULATION** | family-wide envelope required (pointwise decay fails, C7d); the analyticity link is the even-periodic equivalence (C7Lh) | C7i, C7Lh, C7Lk |
| C7-R | approximation control → prediction-space enclosure hierarchy (the representation / enclosure bridge) | **KNOWN-REFORMULATION** | RESTRICTED STRUCTURAL CONNECTION: uniformly enveloped families on an interval; upper bound only | C7Lp, C7Le, C7Lo |
| C7-LB | coefficient envelope → nonzero lower bound on actual widths | **FAIL** | envelope alone | C7Ll |
| C7-LB+ | lower bound under additional occupancy / non-degeneracy assumptions | **OPEN** | optional future branch, not pursued | — |
| C7-F(raw) | coefficient decay → raw Fisher / sloppy eigenvalue decay (universal, chart-independent) | **FAIL** | as an invariant universal claim | C7Lm, C7Lq |
| C7-F(inv) | invariant Fisher / local-sensitivity reformulation | **OPEN** | needs independently supplied structure (C7Ln); not attempted | C7Ln, C7Lr |
| TMS-W | Transtrum width spectrum as a universal reparametrization-invariant ordered spectrum | **OPEN** | NOT ESTABLISHED: individual geodesic lengths are geometric; the direction family is chart-tied (MMPg); no precise definition proved coordinate-dependent, so not FAIL | MMPg |
| Q-Eq2 | Quinn Eq. (2) as written (published PRL) | **FAIL** | under the ordinary Euclidean prediction-space interpretation (counterexample); see EQ2.notClaimed | C7Lc, C7Ld |
| Q-Eq2-fix | directional width bound 2rσ_j + 2ε‖u_j‖₁ and enclosing ellipsoid √2·√(r²σ_j² + Nε²) | **PROVED** | elementary; no priority claimed | C7Lb, C7Le |
| Q-const | coefficient radius M√(4N − 3) and Eq. (8) constants | **PROVED** | internal constant inconsistency / likely typographical factor recorded; not a new result | C7Lf, C7Lg |

## J. Backbone interpretation

Surviving chain: "orthogonal spectral representation → coefficient hierarchy → restricted accessible coefficient region → bounded prediction-space directions".

Not established: "spectral hierarchy ⟹ universal Fisher hierarchy".

Correct as stated: the surviving chain is meaningful and holds for uniformly enveloped families as an upper-bound statement about accessible prediction-space directions; it is NOT a spectral → universal Fisher-hierarchy theorem (C7-F(raw) FAIL), and it does not bound actual widths from below (C7-LB FAIL).

Gained:
- an exact, source-locked link from the founding Fourier representation to model-manifold geometry (C7-A, C7-R)
- a clean separation of parameter-coordinate spectra (chart-dependent) from prediction-space enclosures (set-level, invariant)
- negative results that explain why the chain cannot become a Fisher-spectrum theorem without extra structure
- a precise audit of a published bound (Eq. (2) counterexample under the Euclidean reading; constant inconsistency)

Novelty discipline:

- Known mathematics: the Chebyshev / cosine-Fourier coefficient identity; uniform approximation bounds (M-test; Trefethen Thm 8.2); linear evaluation operators; singular-value ellipsoid bounds; Kolmogorov upper bounds; covariance of the Fisher metric (g_φ = Aᵀg_θA).
- Project contribution / synthesis: placing the Fourier representation explicitly in the model-manifold story; separating parameter-coordinate spectra from prediction-space enclosures; the C7-R chain as a representation-level explanation; the explicit negative results showing why the chain cannot automatically become a Fisher-spectrum theorem.
- Possible correction / observation: the Eq. (2) counterexample under the Euclidean reading; the coefficient-radius / Eq. (8) constant inconsistency.
- neither observation is presented as a novel theorem, and no priority is claimed; what was independently verified: the published wording, the exact counterexamples (C7Lc, C7Ld), the support-function bound (C7Lb), the proved ellipsoid (C7Le) and the constant arithmetic (C7Lf, C7Lg).

## K. Ratings (separate; no overall score)

| Item | Backbone Support | AI Slop Risk | Transfer Depth | Breadth | Novelty |
|---|---|---|---|---|---|
| C7-R | 30% | 10% | STRUCTURAL TRANSFER (RESTRICTED STRUCTURAL CONNECTION) | 3 | KNOWN (reformulation) |
| C7-F(raw) | 0% | 5% | FAIL | 3 | KNOWN (Fisher covariance); the negative result is a project classification |
| C7-F(inv) | 5% | 30% | NOT YET FORMALIZED | 0 | OPEN (nothing derived) |
| model-manifold / Fourier connection overall | 30% | 10% | STRUCTURAL TRANSFER (restricted) | 3 | project synthesis of known mathematics |

## Pass-1 statements refined by this audit (pass-1 record kept)

| Pass 1 | Now |
|---|---|
| "the published PRL version not read" / Eq. (2) "may already be fixed" in the published version | the published PRL text was read: Eq. (2) is unchanged except for the subscript; no official correction was located |
| principal umbrella status C7-KNOWN-REFORMULATION for "C7" | split statuses (TABLE): C7-A, C7-B, C7-R KNOWN-REFORMULATION; C7-LB FAIL; C7-F(raw) FAIL; C7-F(inv) OPEN; TMS-W OPEN |
| "strip analyticity of F_θ is Bernstein-ellipse analyticity of f_θ" | With z = e^(iφ), φ = α + iβ, \|z\| = e^(−β): the annulus ρ^(−1) < \|z\| < ρ is the strip \|Im φ\| < log ρ, and x = (z + z^(−1))/2 = cos φ maps it 2-to-1 (z ↔ 1/z) onto the open region bounded by E_ρ, the unit circle folding onto [−1, 1]. Exact equivalence: f is analytic in the open region bounded by E_ρ with \|f\| ≤ M ⟺ F = f∘cos is analytic in \|Im φ\| < log ρ with \|F\| ≤ M; such an F is automatically 2π-periodic and even. Conversely an analytic, 2π-periodic, EVEN F on the strip descends to such an f (Laurent coefficients g_(−k) = g_k, G = g_0 + 2Σ g_kT_k(x)). Without evenness the descent fails (sin φ). |
| "exact axes at Chebyshev nodes" | exact axes σ(VD) = {√N r_0} ∪ {√(N/2) r_k} hold for Gauss–Chebyshev (first-kind) nodes x_i = cos((i + 1/2)π/N), i = 0…N − 1, with the unweighted Euclidean metric; they fail for Chebyshev–Lobatto (extrema) nodes unless the weights (1/2, 1, …, 1, 1/2) are used (norms N − 1 at k = 0, N − 1, (N − 1)/2 otherwise) |
| "at N equally spaced samples ... the ellipsoid axes are EXACTLY √N × the sorted envelope" | "exactly √N × the envelope" holds in the complex basis e^(ikt), \|k\| ≤ K, with an envelope on the complex coefficients and 2K + 1 ≤ N equally spaced samples (each r_k twice for ±k); in the real basis (1, cos kt, sin kt) the axes are √N r_0 and √(N/2) r_k; the Nyquist mode (N even, k = N/2) is degenerate and excluded; modes alias mod N |
| "(g) every object in (a)–(f) is unchanged by any reparametrization of Θ with the same image" | unchanged under a parameter change that keeps the set {f_θ}: the coefficient set, the family-wide envelope (a supremum over the set), the sampled prediction set Y(Θ), the exact Minkowski enclosure and the Quinn-style enclosure built from them; changed: the raw Fisher matrix and its eigenvalues |
| conclusion (c), enclosing ellipsoid with semi-axes √2·√(mσ_j² + NR_m²), asserted with a sketch | proved by support functions (C7Le) |
| "Quinn's Eq. (2) error term needs the correction of C7j" | Counterexample to Eq. (2) as written under the ordinary Euclidean prediction-space interpretation. The containment claim also fails under the Euclidean-ball reading for unequal axes (C7Ld). |
| "the stated radius 4M√(4N − 3) is valid but loose by 4" | internal constant inconsistency / likely typographical factor; not a new mathematical result |

## Wording patches (2026-11-16, Act VIII pass; C7 not reopened)

| Superseded wording | Replacement |
|---|---|
| the Kolmogorov bound is attained for that choice of L_m (C7Lk: "for this L_m the bound is attained (1/(θ − x) at θ = 2, x = 1), so the index cannot shift to R_(m+1)"; report: "The bound is attained for that choice of L_m") | Choosing L_m = span{T_0, …, T_(m−1)} proves d_m(F; C[−1, 1]) ≤ R_m. Equality is not guaranteed for an arbitrary family satisfying only the coefficient envelope. Sharpness requires an appropriate extremal family / function and must be stated separately. |
| "exact enclosure" / "the exact enclosure is the Minkowski set ..." | "the exact coefficient-box/Minkowski set inclusion used in the argument is ..." (equality between the model image and the enclosing set has not been proved and is not claimed) |

## M. Branch lock decision

**LOCK C7-R / CLOSE THIS BRANCH**

Stop: no work on C7-F(inv), H3, mass-wave, quantum, relativity or Energeo.
