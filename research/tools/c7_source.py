"""C7 construction pass 1 (2026-11-15): Fourier / Chebyshev coefficient decay → prediction-space enclosure.
Writes research/c7_bridge.json and renders research/constructions/c7_fourier_width.md.
Decisions: docs/restructure_decisions.md, "C7 construction pass 1". Cards: verify/verify_C7.py (C7a–C7u).
Sources, read in full text on 2026-11-15: research/sources/quinn2019.md (arXiv v1), research/sources/tms2011.md,
research/sources/quinn2023.md (secondary).
Stop condition: this pass does not begin H3, mass-wave, quantum, relativity or Energeo; the next pass is an adversarial
C7 lock / audit.
Run: python3 research/tools/c7_source.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]

STATUSES = ['C7-PROVED', 'C7-RESTRICTED', 'C7-KNOWN-REFORMULATION', 'C7-PARTIAL', 'C7-FAIL']
PRINCIPAL = 'C7-KNOWN-REFORMULATION'
NOVELTY = ['new theorem', 'restricted extension', 'reformulation', 'analogy only']

SOURCES = [
 dict(id='SRC-QUINN-2019', card='research/sources/quinn2019.md', read='arXiv v1 full text and supplement (2026-11-15); the published PRL version not read', role='PRIMARY: the enclosure theorem',
      locked=['model class: y_θ(t), t ∈ [−1, 1], continuous in θ; predictions at N points, N ≥ K; Euclidean ℝᴺ, no noise metric',
              'evaluation matrix X_ij = φ_(j−1)(t_(i−1)); Chebyshev case X = JD, J_ij = T_(j−1)(t_(i−1)), D_jj = ρ^(−(j−1))',
              'coefficient assumption (Theorem 1, via Trefethen Thm 8.2): y_θ analytic in the Bernstein ellipse E_ρ with |y_θ| ≤ M there, UNIFORMLY in θ ⇒ |c_0| ≤ M, |c_j| ≤ 2Mρ^(−j)',
              'coefficient set: a box (|c̃_0| ≤ M, |c̃_j| ≤ 2M), relaxed to a ball ‖c̃‖₂ ≤ r with the dimension factor √(4N − 3) included',
              'enclosing object: H_P = X·(ball of radius r), a hyperellipsoid; ℓ_j(H_P) = 2rσ_j(X) is "the diameter of the jth cross-section"',
              'error term: ‖y_θ − p_(N−1)‖∞ ≤ 2Mρ^(−N+1)/(ρ − 1); Eq. (2) adds 2‖y − p‖∞ to each ℓ_j to form H_Y',
              'decay claim: σ_j(X) ≤ √N ρ^(−j+2)/√(ρ² − 1) (Theorem 2), so ℓ_j(H_Y) ≤ 4Mρ^(−N+1)/(ρ − 1) + 2M√(4N² − 3N)ρ^(−j+2)/√(ρ² − 1), 2 ≤ j ≤ N (Eq. 8)',
              'non-analytic case (supplement): ν-times differentiable ⇒ algebraic coefficient decay (j − ν)^(−(ν+1)) and algebraic width bounds',
              'status of the widths: "an upper bound on possible lengths of the manifolds" (Fig. 1 caption)']),
 dict(id='SRC-TMS-2011', card='research/sources/tms2011.md', read='arXiv full texts of the 2011 PRE and the 2010 PRL (2026-11-15)', role='NOT USED as C7\'s invariant object',
      locked=['widths = data-space lengths of geodesics started "from some point located near the center" along "each of the eigendirections of the metric", followed to a boundary',
              'alternative: intersection length with a hyperplane containing "an eigenprediction of the Jacobian"',
              'the authors: agreement with singular values "may not agree if the parameters utilize different units"']),
 dict(id='SRC-QUINN-2023', card='research/sources/quinn2023.md', read='arXiv v2 full text (2026-11-15)', role='SECONDARY: restates the 2019 bound; c-boundary passage quoted (P-2 closed)',
      locked=['restates Quinn 2019 as "a hyper-ellipsoid whose jth largest principal axis length is bounded by a power law ρ^−j" (the decay is geometric)',
              'Taylor-coefficient hypercube → "hyper-parallelepiped" in prediction space; the model manifold lies "within ε_N" of it']),
]
TRANSTRUM = dict(decision='Transtrum-style geodesic widths are NOT C7\'s primary invariant object.',
                 reason=['each geodesic length is a data-space length and is coordinate invariant',
                         'the starting point ("some point located near the center") is not specified',
                         'the initial directions are the metric\'s eigendirections in a chosen parameter chart; these rotate with the chart (MMPg: 0.626° for log θ, 4.43° for a change of units)',
                         'so the collection of widths is not an invariant width spectrum unless the directions are fixed geometrically; no such definition is in the source'],
                 cards=['MMPg'])
TARGET = dict(name='W_j^bound', definition='for a family with uniform coefficient envelope r_k, sample points x_1…x_N, truncation order m, V_m = (T_k(x_i)), D_m = diag(r_0, …, r_(m−1)) and R_m = Σ_(k≥m) r_k: the enclosure Y(Θ) ⊆ Z_m ⊕ [−R_m, R_m]^N with Z_m = V_m D_m·[−1, 1]^m; W_j^bound := 2‖D_m V_mᵀ u_j‖₁ + 2R_m‖u_j‖₁, the bound on the extent of the model image along the j-th principal axis u_j of the ellipsoid E_m = V_m D_m·{‖z‖₂ ≤ √m} ⊇ Z_m',
              ellipsoid='E_m has semi-axes √m·σ_j(V_m D_m); W_j^bound ≤ 2√m σ_j(V_m D_m) + 2R_m‖u_j‖₁; Quinn\'s ℓ_j(H_Y) is this ellipsoid form (r = M√(4N − 3), D = diag(ρ^(−k))) with the error term as in Eq. (2)',
              notIdentified=['Fisher eigenvalues', 'Jacobian singular values', 'Hessian eigenvalues', 'Transtrum geodesic widths', 'intrinsic geodesic diameter',
                             'Kolmogorov n-widths (only the upper bound d_m ≤ R_m is proved, C7s)'],
              invariance='depends only on the set {f_θ} (equivalently Y(Θ)), the sample points and the prediction metric; not on θ-coordinates (C7k)')

C = 'established'
CHAIN = [
 dict(id='C7-A', frm='Chebyshev coefficients of f_θ', to='cosine-Fourier coefficients of F_θ(φ) = f_θ(cos φ)', status='EXACT IDENTITY', novelty='KNOWN (Trefethen ATAP Ch. 3)',
      statement='T_k(cos φ) = cos(kφ); a_0 = (1/π)∫₀^π F dφ, a_k = (2/π)∫₀^π F cos(kφ) dφ = (2/π)∫₋₁¹ f T_k/√(1 − x²) dx; complex coefficients F̂(0) = a_0, F̂(±k) = a_k/2', cards=['C7a', 'C7b']),
 dict(id='C7-B', frm='a uniform envelope on the Fourier side', to='the same envelope on the Chebyshev side', status='EXACT (same numbers); UNIFORMITY REQUIRED for C7-C', novelty='KNOWN',
      statement='the coefficients are identical, so |a_k(θ)| ≤ r_k on one side is the same statement on the other (r_k/2 for complex F̂). Strip analyticity of F_θ (|Im φ| < log ρ, |F_θ| ≤ M) is Bernstein-ellipse analyticity of f_θ (E_ρ, |f_θ| ≤ M). No extra assumption is needed for the transfer; a FAMILY-WIDE bound sup_θ |a_k(θ)| ≤ r_k is needed for anything global (C7d)',
      cards=['C7c', 'C7d', 'C7e']),
 dict(id='C7-B′', frm='uniform envelope', to='uniform approximation control', status='THEOREM', novelty='KNOWN (Weierstrass M-test; Trefethen Thm 8.2 for the geometric case)',
      statement='sup_θ ‖f_θ − p_(m−1)(θ)‖∞ ≤ R_m = Σ_(k≥m) r_k; geometric envelope r_k = 2Mρ^(−k): R_m = 2Mρ^(1−m)/(ρ − 1) (attained in the 1/(θ − x) example at θ = 2, x = 1)', cards=['C7i', 'C7s']),
 dict(id='C7-C', frm='uniform approximation control', to='prediction-space enclosure with widths bounded by r_k and V', status='THEOREM, UPPER BOUND ONLY', novelty='KNOWN (Quinn et al. 2019) + elementary inequalities; Eq. (2) error term corrected',
      statement='Y(Θ) ⊆ V_m D_m·[−1, 1]^m ⊕ [−R_m, R_m]^N; extent along u ≤ 2‖D_m V_mᵀu‖₁ + 2R_m‖u‖₁; ellipsoid relaxation with factor √m; σ_j(V_m D_m) ≤ ‖V_m‖₂ r_(j) and Quinn\'s Theorem 2; exact axes at Chebyshev nodes',
      cards=['C7f', 'C7g', 'C7h', 'C7j', 'C7k', 'C7s', 'C7t']),
 dict(id='C7-D', frm='enclosure', to='hierarchy of the model image\'s own widths', status='UPPER BOUND ONLY; NOT NECESSARY; METRIC- AND SAMPLING-DEPENDENT', novelty='—',
      statement='the actual extents are below W_j^bound (C7q: ratios 0.19–0.45), can be far smaller (C7o, C7p), can be hierarchical without coefficient decay (C7n, C7m), and change with the prediction metric and the sampling (C7l, C7m)',
      cards=['C7o', 'C7p', 'C7q', 'C7n', 'C7l', 'C7m']),
]
THEOREM = dict(
 name='C7-R (restricted; known ingredients)',
 hypotheses=['F = {f_θ : θ ∈ Θ} ⊆ C[−1, 1]; F_θ(φ) = f_θ(cos φ) with cosine-Fourier (equivalently Chebyshev) coefficients a_k(θ) (normalization of C7-A)',
             'a uniform envelope: |a_k(θ)| ≤ r_k for all θ ∈ Θ and k ≥ 0, with R_m = Σ_(k≥m) r_k < ∞',
             'sample points x_1, …, x_N ∈ [−1, 1]; prediction space ℝᴺ with the Euclidean metric (a fixed positive-definite metric W changes the constants: C7l)',
             'no assumption on the parameterization of Θ, on N ≥ K, or on analyticity beyond summability of r_k'],
 conclusions=['(a) function space: sup_θ ‖f_θ − Σ_(k<m) a_k(θ)T_k‖∞ ≤ R_m, so the Kolmogorov m-width d_m(F; C[−1, 1]) ≤ R_m (N-independent)',
              '(b) prediction space: Y(Θ) ⊆ Z_m ⊕ [−R_m, R_m]^N, Z_m = V_m D_m·[−1, 1]^m; for every unit u the extent of Y(Θ) along u is ≤ 2‖D_m V_mᵀu‖₁ + 2R_m‖u‖₁ (W_j^bound for u = u_j)',
              '(c) ellipsoid form: Z_m ⊆ E_m = V_m D_m·{‖z‖₂ ≤ √m}, semi-axes √m σ_j(V_m D_m) ≤ √m ‖V_m‖₂ r_(j) (r_(j): the j-th largest r_k, k < m); Y(Θ) ⊆ the ellipsoid with semi-axes √2·√(mσ_j² + N R_m²)',
              '(d) Euclidean distance of every Y(θ) to the m-dimensional subspace range(V_m) is ≤ √N R_m; ≤ R_m in the RMS metric ‖·‖₂/√N',
              '(e) at Chebyshev nodes x_i = cos((2i − 1)π/2N), m ≤ N: σ(V_m D_m) = {√N r_0} ∪ {√(N/2) r_k : 1 ≤ k < m} exactly',
              '(f) geometric envelope r_0 = M, r_k = 2Mρ^(−k) (⟸ uniform analyticity in E_ρ ⟺ uniform strip analyticity of F_θ): R_m = 2Mρ^(1−m)/(ρ − 1), so (a)–(d) decay geometrically in m (Quinn Theorem 1 + Eq. 8, corrected error term)',
              '(g) every object in (a)–(f) is unchanged by any reparametrization of Θ with the same image'],
 nature=dict(exact='(e) and the coefficient identity; the rest are inequalities', upperBoundOnly=True, asymptotic=False, finiteN='(b)–(e)', infiniteN='(a) only',
             samplingDependent='(b)–(e) yes; (a) no', metricDependent='yes (C7l); (a) uses the sup norm'),
 notClaimed=['lower bounds on the actual widths (C7o–C7q)', 'necessity of coefficient decay for a hierarchy (C7n, C7m)', 'anything from pointwise decay without a uniform envelope (C7d)',
             'a relation to Fisher, Jacobian or Hessian eigenvalues', 'that Transtrum geodesic widths are invariant'])
PROOF = [
 dict(step='coefficient identity', argument='T_k(cos φ) = cos(kφ) by induction (T_0 = 1, T_1 = x, T_(k+1) = 2xT_k − T_(k−1) ↔ cos((k+1)φ) + cos((k−1)φ) = 2cos φ cos(kφ)); substitute x = cos φ, dx/√(1 − x²) = −dφ in the Chebyshev coefficient integrals', cards=['C7a', 'C7b']),
 dict(step='uniform convergence', argument='Σ r_k < ∞ and |T_k| ≤ 1 on [−1, 1]: the series Σ a_k(θ)T_k converges absolutely and uniformly (M-test) to a continuous g with the same Chebyshev coefficients as f_θ; coefficients determine a continuous function (completeness of the cosine system for F_θ), so g = f_θ', cards=['C7i']),
 dict(step='tail bound (a)', argument='|f_θ(x) − Σ_(k<m) a_k T_k(x)| = |Σ_(k≥m) a_k T_k(x)| ≤ Σ_(k≥m) r_k = R_m; Π_(m−1) is m-dimensional, so d_m ≤ R_m', cards=['C7i', 'C7s']),
 dict(step='evaluation (b)', argument='Y(θ)_i = Σ_(k<m) a_k(θ)T_k(x_i) + e_i(θ) = (V_m a(θ))_i + e_i(θ), |e_i| ≤ R_m; a(θ) ∈ Q_m = D_m·[−1, 1]^m. Support function of a zonotope: h(u) = Σ_k r_k|uᵀv_k|; of the box: R_m‖u‖₁', cards=['C7f', 'C7g']),
 dict(step='ellipsoid (c)', argument='[−1, 1]^m ⊆ √m·B₂ (corner norm √m); A·(ball) has semi-axes ·σ_j(A); σ_j(V D) ≤ ‖V‖₂σ_j(D) (σ_j(AB) ≤ ‖A‖σ_j(B)); Minkowski sum of ellipsoid E(Q₁) and ball: h ≤ √(uᵀQ₁u) + δ ≤ √(2(uᵀQ₁u + δ²)), so E(Q₁) ⊕ δB ⊆ E(2(Q₁ + δ²I)) with δ = √N R_m', cards=['C7g', 'C7h', 'C7j']),
 dict(step='subspace distance (d)', argument='dist(Y(θ), range V_m) ≤ ‖e(θ)‖₂ ≤ √N‖e(θ)‖∞ ≤ √N R_m', cards=['C7s']),
 dict(step='Chebyshev nodes (e)', argument='x_i = cos φ_i with φ_i = (2i − 1)π/2N equally spaced: Σ_i cos(jφ_i)cos(kφ_i) = 0 (j ≠ k < N), = N/2 (j = k ≥ 1), = N (j = k = 0): V_mᵀV_m diagonal, so the singular values of V_m D_m are the scaled column norms', cards=['C7h']),
 dict(step='geometric envelope (f)', argument='Quinn Theorem 1 (Trefethen Thm 8.2): |c_0| ≤ M, |c_k| ≤ 2Mρ^(−k); the Bernstein ellipse is the image of the strip |Im φ| < log ρ under cos, so the hypothesis is a Fourier-strip bound; tail sum 2Mρ^(−m)/(1 − 1/ρ)', cards=['C7c', 'C7i']),
 dict(step='invariance (g)', argument='the hypotheses quantify over the set {f_θ}; V_m, D_m, R_m involve only sample points and the envelope; a reparametrization θ = θ(φ) with the same image leaves the set, hence every bound, unchanged; the Fisher metric does change (g_φ = Aᵀg_θA)', cards=['C7k', 'C7t']),
]
COUNTER = [
 dict(id='A', name='pointwise decay, no uniform envelope', family='f_θ(x) = cos(θx), θ ∈ [0, 300] (image: θ ∈ [0, 400])', result='each member decays super-geometrically, but sup_θ |a_40(θ)| = 0.389; the image at 6 points has σ_6/σ_1 = 0.980 (no hierarchy); restricted to θ ∈ [0, 1] it is 7.8e−15', breaks='"Fourier decay ⇒ global width control" without uniformity: FAIL', card='C7d'),
 dict(id='B', name='badly scaled prediction metric', family='same envelope, W = diag(1, …, 1, 10⁶)', result='σ_1 grows 402×; σ_2/σ_1 moves from 3.79e−1 to 1.44e−3; only σ_j(W^(1/2)VD) ≤ ‖W^(1/2)V‖₂ r_(j) survives', breaks='metric-free widths: FAIL (widths are metric-dependent)', card='C7l'),
 dict(id='C', name='sampling', family='flat envelope r_k ≡ 1, N = 10', result='Chebyshev nodes: σ_10/σ_1 = 1/√2; points clustered in [0.9, 1]: 8.6e−18', breaks='sampling-free finite-N axes: FAIL; also shows a hierarchy without decay', card='C7m'),
 dict(id='D', name='reparameterization with identical image', family='1/(θ − x), θ ∈ [2, 3] vs θ = 2 + φ³', result='envelopes equal to 1e−14, so W_j^bound unchanged; Fisher metric ratio 0.5625', breaks='nothing: the enclosure is a prediction-space object (passes)', card='C7k'),
 dict(id='E', name='thin family, weak decay', family='f_θ(x) = θ|x|, θ ∈ [0, 1]', result='coefficients ~ k^(−2), enclosure σ_2/σ_1 = 0.471; actual image a segment (σ_2/σ_1 < 1e−12)', breaks='"bound = width spectrum": FAIL (upper bound only)', card='C7o'),
 dict(id='F', name='strong decay, correlated coefficients', family='a_k(θ) = (θ/ρ)^k, θ ∈ [−1, 1], ρ = 2 (Chebyshev generating function)', result='image a curve; extent along enclosure axis 3 is 0.495 of the bound; curve σ_6/σ_1 = 1.0e−3 vs enclosure 2.2e−2', breaks='"enclosure axes = manifold widths": FAIL', card='C7p'),
 dict(id='G', name='hierarchy without decay', family='f_θ = θT_20(x), θ ∈ [0, 1]', result='image a segment (one width) while r_20 = 1', breaks='"coefficient decay is necessary": FAIL', card='C7n'),
 dict(id='H', name='Quinn Eq. (2) error term', family='f(x) = c_0 + eT_2(x), points ±1, r = 1, ε = 0.1', result='model point at norm 1.5542 outside the Eq. (2) disk of radius 1.5142; replacements hold', breaks='Eq. (2) as written in arXiv v1: FAIL; corrected forms hold', card='C7j'),
]
QUINN = dict(known=['the coefficient bound from uniform Bernstein-ellipse analyticity (Theorem 1, from Trefethen Thm 8.2)',
                    'the linear map from (scaled) coefficients to predictions, X = JD',
                    'the box → ball relaxation with the dimension factor √(4N − 3)',
                    'the enclosing hyperellipsoid with axes 2rσ_j(X) and a sampling-independent bound on σ_j(X) (Theorem 2)',
                    'the algebraic analogue for finitely smooth models (supplement)',
                    'that the result is an upper bound on possible widths (Fig. 1 caption)'],
             notInQuinn=['the cosine-Fourier reading (x = cos φ; strip analyticity), though T_j = cos(j arccos t) is written',
                         'a general (non-geometric) envelope stated as one theorem with the zonotope (box) form, without the √m relaxation',
                         'exact axes at Chebyshev nodes via discrete cosine orthogonality (Quinn bounds σ_j at arbitrary nodes)',
                         'the explicit reparametrization-invariance check',
                         'the counterexamples to pointwise decay, necessity and exactness',
                         'the corrected error term (‖u‖₁ factor; enclosing ellipsoid with √2·√(r²σ_j² + Nε²))'],
             assessment='every item in notInQuinn is elementary: standard approximation theory, a singular-value inequality or a direct calculation. None is a new theorem.')
FOURIER = ['the coefficient identity: Chebyshev analysis of f_θ IS cosine-Fourier analysis of F_θ(φ) = f_θ(cos φ) (C7a, C7b)',
           'the hypothesis of Quinn\'s Theorem 1 reads as a Fourier-strip condition: F_θ analytic and ≤ M in |Im φ| < log ρ, uniformly in θ (C7c)',
           'Chebyshev nodes are equally spaced samples of F_θ; the evaluation operator becomes a discrete cosine transform with orthogonal columns, so the enclosure\'s axes are exactly the (sorted) envelope times √(N/2) (√N for the constant mode) (C7h)',
           'the periodic analogue: equally spaced samples of a periodic family give axes exactly √N × the envelope; aliasing must be counted as error (C7r)',
           'what Fourier does NOT add: any lower bound, any converse, any relation to Fisher eigenvalues']
RATINGS = [
 dict(item='Fourier → Chebyshev identity', bs=45, slop=5, td='TRIVIAL CONSEQUENCE', breadth=3, status='ESTABLISHED (textbook; exact)', why='exact change of variables for every continuous f on [−1, 1]; it ties the project\'s founding Fourier representation to the coefficient side of the model geometry; known'),
 dict(item='coefficient decay → approximation control', bs=40, slop=5, td='TRIVIAL CONSEQUENCE', breadth=3, status='ESTABLISHED (M-test; Trefethen Thm 8.2)', why='exact tail bound, attained in an example; requires a family-wide envelope (C7d)'),
 dict(item='approximation control → prediction-space width bound', bs=35, slop=10, td='STRUCTURAL TRANSFER', breadth=3, status='ESTABLISHED (Quinn 2019, error term corrected); upper bound only', why='a valid enclosure on four families including the project\'s F-C; not exact (C7o–C7q), metric- and sampling-dependent'),
 dict(item='full C7 chain', bs=30, slop=15, td='STRUCTURAL TRANSFER', breadth=3, status='RESTRICTED STRUCTURAL CONNECTION; principal C7-KNOWN-REFORMULATION', why='sufficient, upper-bound, restricted to uniformly enveloped families; known after x = cos φ; no lower bound, no converse, no Fisher-spectrum relation'),
 dict(item='direct periodic Fourier route', bs=25, slop=5, td='TRIVIAL CONSEQUENCE', breadth=2, status='ESTABLISHED (elementary: DFT orthogonality + singular-value inequality)', why='exact axes at equally spaced samples, bounds otherwise, aliasing explicit; not a new theorem'),
]
SUBSIDIARY = [
 dict(claim='C7-A coefficient identity', status='EXACT; KNOWN'),
 dict(claim='C7-B coefficient-decay transfer', status='EXACT (same numbers); family-wide uniformity required for C7-C'),
 dict(claim='C7-C geometric consequence', status='VALID UPPER BOUND (restricted class); KNOWN (Quinn 2019) with the Eq. (2) error term corrected'),
 dict(claim='pointwise decay ⇒ global width control', status='C7-FAIL (C7d)'),
 dict(claim='width hierarchy ⇒ coefficient decay (converse)', status='C7-FAIL (C7n, C7m)'),
 dict(claim='enclosure axes = actual widths', status='C7-FAIL (C7o, C7p, C7q)'),
 dict(claim='Transtrum geodesic widths as an invariant width spectrum', status='NOT ESTABLISHED (direction choice chart-dependent; MMPg; source quote)'),
 dict(claim='C7 as first posed: coefficient spectra vs Fisher / sloppy spectra', status='OPEN (T-C7 unchanged); raw Fisher spectra are chart-dependent (MMIb)'),
]
NEXT = ['Adversarial C7 lock / audit pass: attack each hypothesis of C7-R, the corrected error term and the exact-axes claim.',
        'Unresolved: is there ANY lower bound linking the coefficient envelope to the actual widths of the model image (for example under a non-degeneracy or "spread" condition on the coefficient map θ ↦ a(θ))? Without one, C7 reaches enclosures, not the widths themselves.',
        'Unresolved: C7 as first posed (coefficient spectra vs Fisher / sloppy spectra) has no invariant formulation yet; any attempt must use a geometric object, not raw Fisher eigenvalues.',
        'Check the published PRL version of Quinn et al. 2019 for a corrected Eq. (2).']

data = dict(about='C7 construction pass 1 (2026-11-15). Generated by research/tools/c7_source.py.', statuses=STATUSES, principal=PRINCIPAL, noveltyScale=NOVELTY, novelty='reformulation',
            noveltyNote='reformulation of Quinn et al. 2019 and standard approximation theory under x = cos φ, with elementary extensions (general envelope, zonotope form, exact axes at Chebyshev nodes) and a precision correction of Quinn\'s Eq. (2); not a new theorem',
            sources=SOURCES, transtrum=TRANSTRUM, target=TARGET, chain=CHAIN, theorem=THEOREM, proof=PROOF, counterexamples=COUNTER, quinn=QUINN, fourier=FOURIER,
            ratings=RATINGS, subsidiary=SUBSIDIARY, next=NEXT, label='RESTRICTED STRUCTURAL CONNECTION',
            spectralChain='orthogonal spectral representation → decay of representation coefficients → bounded accessible directions in prediction space → hierarchical model geometry',
            spectralChainVerdict='holds as a RESTRICTED STRUCTURAL CONNECTION for its first three arrows (uniform envelope, enclosure); the last arrow ("hierarchical model geometry") holds only as an upper bound on the model image, not as its width spectrum',
            cards=[f'C7{c}' for c in 'abcdefghijklmnopqrstu'])
(ROOT / 'research/c7_bridge.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')

cell = lambda x: '—' if x in (None, '', []) else str(x).replace('|', '\\|')
L = ['# C7 construction pass 1: Fourier / Chebyshev coefficient decay → prediction-space enclosure', '',
     'Generated from `research/tools/c7_source.py` (`research/c7_bridge.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "C7 construction pass 1". Cards: `verify/verify_C7.py` (C7a–C7u).', '',
     f'**Principal status: {PRINCIPAL}.** Novelty: {data["novelty"]} ({data["noveltyNote"]}). Label of the chain: {data["label"]}.', '',
     '## A. Source-locked definitions', '']
for sx in SOURCES:
    L += [f'**{sx["id"]}** ({sx["role"]}). Read: {sx["read"]}. Card: `{sx["card"]}`.', ''] + [f'- {x}' for x in sx['locked']] + ['']
L += [f'**Transtrum widths.** {TRANSTRUM["decision"]}', ''] + [f'- {x}' for x in TRANSTRUM['reason']]
L += ['', f'**Primary target, {TARGET["name"]}.** {TARGET["definition"]}.', '', f'- Ellipsoid form: {TARGET["ellipsoid"]}.', f'- Invariance: {TARGET["invariance"]}.',
      '- Not identified with: ' + '; '.join(TARGET['notIdentified']) + '.', '', '## B. The C7 chain, arrow by arrow', '', '| Arrow | From | To | Status | Novelty | Exact statement | Cards |', '|---|---|---|---|---|---|---|']
L += [f'| {a["id"]} | {cell(a["frm"])} | {cell(a["to"])} | {a["status"]} | {cell(a["novelty"])} | {cell(a["statement"])} | {", ".join(a["cards"])} |' for a in CHAIN]
L += ['', f'Project chain: "{data["spectralChain"]}". Verdict: {data["spectralChainVerdict"]}.', '', f'## C. Candidate theorem: {THEOREM["name"]}', '', 'Hypotheses:'] + [f'- {h}' for h in THEOREM['hypotheses']]
L += ['', 'Conclusions:'] + [f'- {c}' for c in THEOREM['conclusions']]
n = THEOREM['nature']
L += ['', f'Nature: exact: {n["exact"]}; upper bound only: yes; asymptotic: no (explicit constants); finite-N: {n["finiteN"]}; infinite-N: {n["infiniteN"]}; sampling-dependent: {n["samplingDependent"]}; metric-dependent: {n["metricDependent"]}.', '',
      'Not claimed: ' + '; '.join(THEOREM['notClaimed']) + '.', '', '## D. Proof', '', '| Step | Argument | Cards |', '|---|---|---|'] + [f'| {p["step"]} | {cell(p["argument"])} | {", ".join(p["cards"])} |' for p in PROOF]
L += ['', '## E. Counterexamples and failed generalizations', '', '| # | Test | Family | Result | What it breaks | Card |', '|---|---|---|---|---|---|'] + [f'| {c["id"]} | {c["name"]} | {cell(c["family"])} | {cell(c["result"])} | {cell(c["breaks"])} | {c["card"]} |' for c in COUNTER]
L += ['', '## F. Comparison with Quinn et al. 2019', '', 'Already in Quinn (arXiv v1):'] + [f'- {x}' for x in QUINN['known']] + ['', 'Not in Quinn:'] + [f'- {x}' for x in QUINN['notInQuinn']] + ['', QUINN['assessment']]
L += ['', '## G. What Fourier contributes', ''] + [f'- {x}' for x in FOURIER]
L += ['', '## H. Novelty verdict', '', f'**{data["novelty"]}**. {data["noveltyNote"]}.', '', '## I. C7 status', '', f'Principal: **{PRINCIPAL}** (from {", ".join(STATUSES)}).', '', '| Claim | Status |', '|---|---|'] + [f'| {s["claim"]} | {s["status"]} |' for s in SUBSIDIARY]
L += ['', '## J. Ratings (separate; no overall score)', '', '| Item | Backbone Support | AI Slop Risk | Transfer Depth | Breadth | Status | Why |', '|---|---|---|---|---|---|---|'] + [f'| {r["item"]} | {r["bs"]}% | {r["slop"]}% | {r["td"]} | {r["breadth"]} | {r["status"]} | {cell(r["why"])} |' for r in RATINGS]
L += ['', '## L. Next unresolved questions', ''] + [f'- {x}' for x in NEXT]
L += ['', 'Stop: no H3, mass-wave, quantum, relativity or Energeo work in this pass.']
(ROOT / 'research/constructions/c7_fourier_width.md').write_text('\n'.join(L) + '\n')
print(f'{len(CHAIN)} arrows; {len(COUNTER)} counterexamples; principal {PRINCIPAL}')
