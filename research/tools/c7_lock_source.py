"""Final adversarial C7 lock / audit (2026-11-16).
Writes research/c7_lock.json and renders research/constructions/c7_lock_audit.md.
Decisions: docs/restructure_decisions.md, "Final adversarial C7 lock / audit". Cards: verify/verify_C7L.py (C7La–C7Lr).
Source: the published PRL text of Quinn et al. 2019 (typeset copy deposited at NSF PAR), research/sources/quinn2019.md.
The pass-1 record (research/constructions/c7_fourier_width.md) is kept; this record audits it, splits C7, and locks C7-R.
Stop: no work on C7-F(inv), H3, mass-wave, quantum, relativity or Energeo.
Run: python3 research/tools/c7_lock_source.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]

TERMINAL = ['PROVED', 'KNOWN-REFORMULATION', 'RESTRICTED', 'FAIL', 'OPEN']
CARDS = [f'C7L{c}' for c in 'abcdefghijklmnopqr']

SOURCE = dict(
 read='the published PRL, Phys. Rev. Lett. 122, 158302 (2019): the typeset PDF deposited at NSF PAR record 10101033 (labelled "Accepted Manuscript" on the PAR page; it carries the PRL header, pages 158302-1 to -6, the APS copyright line and the production line 0031-9007=19=122(15)=158302(6)). The APS site itself was not accessed: the PDF needs a subscription and the public link returned a bot challenge; neither was circumvented.',
 eq2='Accounting for the polynomial approximation error ‖yθ − pN−1‖∞, where ‖·‖∞ is the L∞ norm on [−1, 1], we can define a hyperellipsoid HY that must enclose model manifold Y, where the cross-sectional widths are given by ℓj(HY) = 2rσj(X) + 2‖y − pN−1‖∞. (2)',
 eq2Change='the only difference from arXiv v1 is the subscript of the error term (pN−1 instead of pN); the geometric claim is the same',
 radius='By Eq. (5), we have that ‖c̃‖2 < 4M√(4N − 3). This implies that the polynomial manifold P is bound in a hyperellipsoid HP. By Eq. (1), we have that ℓj(HP) = 8M√(4N − 3)σj(X).',
 eq8='ℓj(HY) ≤ 2M√(4N² − 3N) ρ^(−j+2)/√(ρ² − 1) + 4Mρ^(−N+1)/(ρ − 1), (8) for 2 ≤ j ≤ N',
 corrections='Crossref (DOI 10.1103/PhysRevLett.122.158302): no updated-by entry and an empty relation list; a web search found no erratum, correction or corrigendum; arXiv has only v1; the APS article page could not be opened here.',
 correctionVerdict='No official correction was located in this audit.')

EQ2 = dict(verdict='Counterexample to Eq. (2) as written under the ordinary Euclidean prediction-space interpretation.',
           why=['the sampled error lies in the box [−ε, ε]^N; for a Euclidean unit u, sup_(e in the box) uᵀe = ε‖u‖₁ with 1 ≤ ‖u‖₁ ≤ √N (C7Lb)',
                'example (i), N = 2, t = (−1, 1): y_θ(t) = θ₁ + θ₂T₂(t), |θ₁| < 1, |θ₂| ≤ 1/10; Eq. (2) gives the disk of radius √2 + 1/10; the point θ = (99/100, 1/10) gives Y = (109/100)(1, 1) with ‖Y‖² − (√2 + 1/10)² = 0.0834 > 0 (exact); the width along (1, 1)/√2 is 2.2√2 = 3.1113 > 2√2 + 1/5 = 3.0284 (C7Lc)',
                'example (ii), distinct singular values, t = (−1, 0, 1): y_θ = θ_a(T₀ + T₂)/√2 + θ_eT₄; σ(X) = (2, √2, √2), first axis (1, 0, 1)/√2; the Eq. (2) ellipsoid value at θ = (99/100, 1/10) is 1.0249 > 1 (C7Lc)',
                'even if the error were a Euclidean ball (a reading the paper\'s sup-norm bound does not give), containment in the ellipsoid with semi-axes rσ_j + δ fails for unequal axes: value 1.1493 > 1 for a = (1, 1/10), δ = 1/10 (C7Ld)'],
           notClaimed='not "the published paper is wrong" in every reading: under a reading where "cross-sectional width" means a directional width along the axes AND the error is a Euclidean ball of radius ε, the widths 2rσ_j + 2ε are correct; that reading does not match the paper\'s sup-norm error bound',
           wording='exact wording of the verdict: "Counterexample to Eq. (2) as written under the ordinary Euclidean prediction-space interpretation."')
CONSTANT = dict(verdict='internal constant inconsistency / likely typographical factor; not a new mathematical result',
                facts=['|c̃_0| ≤ M and |c̃_j| ≤ 2M give ‖c̃‖₂² ≤ M² + 4M²(N − 1) = M²(4N − 3), so ‖c̃‖₂ ≤ M√(4N − 3) (C7Lf)',
                       'the printed ‖c̃‖₂ < 4M√(4N − 3) is valid but loose by exactly 4, and the printed ℓj(HP) = 8M√(4N − 3)σj(X) is consistent with that loose radius (C7Lf)',
                       'Eq. (8)\'s first term equals 2·M√(4N − 3)·√Nρ^(−j+2)/√(ρ² − 1): it uses the TIGHT radius; the printed radius would give 4× Eq. (8) (C7Lg)',
                       'Eq. (8)\'s second term 4Mρ^(−N+1)/(ρ − 1) = 2ε is the additive Eq. (2) error term and inherits its issue (C7Lg)'])
GEOMETRY = [
 dict(object='error set', exact='[−ε, ε]^N (a box), ε = sup_θ ‖y_θ − p_(N−1)(θ)‖∞', status='PROVED', cards=['C7Lb']),
 dict(object='coefficient-box / Minkowski set inclusion', exact='the exact coefficient-box/Minkowski set inclusion used in the argument is Y(Θ) ⊆ H_P ⊕ [−ε, ε]^N (Quinn\'s ball form) and Y(Θ) ⊆ V_mD_m·[−1, 1]^m ⊕ [−R_m, R_m]^N (box / zonotope form): Minkowski sums, not ellipsoids in general; equality between the model image and these sets is NOT claimed', status='PROVED', cards=['C7Lb', 'C7Ld']),
 dict(object='directional width bound', exact='width_u(Y) ≤ width_u(H_P) + 2ε‖u‖₁ = 2r‖Xᵀu‖ + 2ε‖u‖₁; along the j-th axis of H_P: 2rσ_j + 2ε‖u_j‖₁ ≤ 2rσ_j + 2√N ε; zonotope form 2‖D_mV_mᵀu‖₁ + 2R_m‖u‖₁', status='PROVED', cards=['C7Lb', 'C7Lc']),
 dict(object='conservative enclosing ellipsoid', exact='H_P ⊕ [−ε, ε]^N ⊆ E(2(AAᵀ + Nε²I)), A = rX: semi-axes √2·√(r²σ_j² + Nε²); proof by support functions, h_(E(Q))(u) = √(uᵀQu) ≥ ‖Aᵀu‖ + δ; the √2 cannot be dropped in general', status='PROVED', cards=['C7Le']),
 dict(object='Eq. (2) additive ellipsoid', exact='the ellipsoid with semi-axes rσ_j + ε: does NOT contain Y in general (C7Lc), and does not contain H_P ⊕ B₂(ε) for unequal axes (C7Ld)', status='FAIL', cards=['C7Lc', 'C7Ld']),
]
ANALYTICITY = dict(statement='With z = e^(iφ), φ = α + iβ, |z| = e^(−β): the annulus ρ^(−1) < |z| < ρ is the strip |Im φ| < log ρ, and x = (z + z^(−1))/2 = cos φ maps it 2-to-1 (z ↔ 1/z) onto the open region bounded by E_ρ, the unit circle folding onto [−1, 1]. Exact equivalence: f is analytic in the open region bounded by E_ρ with |f| ≤ M ⟺ F = f∘cos is analytic in |Im φ| < log ρ with |F| ≤ M; such an F is automatically 2π-periodic and even. Conversely an analytic, 2π-periodic, EVEN F on the strip descends to such an f (Laurent coefficients g_(−k) = g_k, G = g_0 + 2Σ g_kT_k(x)). Without evenness the descent fails (sin φ).',
                   supersedes='pass 1: "strip analyticity of F_θ is Bernstein-ellipse analyticity of f_θ" (C7-B) — correct only with the even, 2π-periodic hypothesis stated, which F = f∘cos satisfies automatically', cards=['C7Lh'])
CONVENTIONS = [
 dict(item='Chebyshev nodes', statement='exact axes σ(VD) = {√N r_0} ∪ {√(N/2) r_k} hold for Gauss–Chebyshev (first-kind) nodes x_i = cos((i + 1/2)π/N), i = 0…N − 1, with the unweighted Euclidean metric; they fail for Chebyshev–Lobatto (extrema) nodes unless the weights (1/2, 1, …, 1, 1/2) are used (norms N − 1 at k = 0, N − 1, (N − 1)/2 otherwise)', cards=['C7Li']),
 dict(item='periodic Fourier route', statement='"exactly √N × the envelope" holds in the complex basis e^(ikt), |k| ≤ K, with an envelope on the complex coefficients and 2K + 1 ≤ N equally spaced samples (each r_k twice for ±k); in the real basis (1, cos kt, sin kt) the axes are √N r_0 and √(N/2) r_k; the Nyquist mode (N even, k = N/2) is degenerate and excluded; modes alias mod N', cards=['C7Lj']),
 dict(item='Kolmogorov width', statement='d_m(F; C[−1, 1]) = inf_(dim L = m) sup_(f∈F) inf_(g∈L) ‖f − g‖∞. Choosing L_m = span{T_0, …, T_(m−1)} proves d_m(F; C[−1, 1]) ≤ R_m = Σ_(k≥m) r_k. Equality is not guaranteed for an arbitrary family satisfying only the coefficient envelope; sharpness requires an appropriate extremal family / function and must be stated separately (for 1/(θ − x) at θ = 2, x = 1 the TRUNCATION error equals R_m, which is a statement about that truncation, not about d_m). A function-space width, not a prediction-space ellipsoid axis', cards=['C7Lk']),
 dict(item='reparametrization', statement='unchanged under a parameter change that keeps the set {f_θ}: the coefficient set, the family-wide envelope (a supremum over the set), the sampled prediction set Y(Θ), the exact Minkowski enclosure and the Quinn-style enclosure built from them; changed: the raw Fisher matrix and its eigenvalues', cards=['C7Lo']),
]
THEOREM = dict(name='C7-R (final, locked)',
 hypotheses=['a family F = {f_θ} ⊆ C[−1, 1] with a family-wide envelope |a_k(θ)| ≤ r_k on its Chebyshev coefficients (= the cosine-Fourier coefficients of F_θ(φ) = f_θ(cos φ)), Σ r_k < ∞',
             'sample points x_1…x_N ∈ [−1, 1]; prediction space ℝᴺ with the Euclidean metric'],
 conclusions=['(1) sup_θ ‖f_θ − Σ_(k<m) a_k(θ)T_k‖∞ ≤ R_m = Σ_(k≥m) r_k, so d_m(F; C[−1, 1]) ≤ R_m (N-free)',
              '(2) the exact coefficient-box/Minkowski set inclusion used in the argument is Y(Θ) ⊆ V_mD_m·[−1, 1]^m ⊕ [−R_m, R_m]^N (equality with the model image is not claimed)',
              '(3) directional widths: width_u(Y(Θ)) ≤ 2‖D_mV_mᵀu‖₁ + 2R_m‖u‖₁ for every Euclidean unit u',
              '(4) conservative ellipsoid: Y(Θ) ⊆ E(2(m·V_mD_m²V_mᵀ + N R_m² I)), semi-axes √2·√(mσ_j(V_mD_m)² + NR_m²)',
              '(5) at Gauss–Chebyshev (first-kind) nodes, unweighted: σ(V_mD_m) = {√N r_0} ∪ {√(N/2) r_k : 1 ≤ k < m}, m ≤ N',
              '(6) with a geometric envelope from uniform analyticity in E_ρ (equivalently, uniform analyticity of the even, 2π-periodic F_θ in |Im φ| < log ρ): R_m = 2Mρ^(1−m)/(ρ − 1)',
              '(7) every object in (1)–(6) is defined from the function set, the sample points and the metric, hence unchanged by reparametrizations that keep the set'],
 notClaimed=['any lower bound on the actual widths (C7-LB: FAIL)', 'any relation to raw Fisher eigenvalues (C7-F(raw): FAIL)', 'an invariant local-spectrum statement (C7-F(inv): OPEN)', 'necessity of coefficient decay for a hierarchy', 'the Eq. (2) additive ellipsoid'],
 status='KNOWN-REFORMULATION', transferDepth='RESTRICTED STRUCTURAL CONNECTION', cards=['C7Lp', 'C7Lb', 'C7Le', 'C7Lh', 'C7Li', 'C7Lk', 'C7Lo'])
FISHER_RAW = dict(verdict='FAIL', claim='a universal, chart-independent implication "output coefficient decay ⟹ raw Fisher eigenvalue decay"',
                  proof=['one parameter, θ = aφ: g_φ = a²g_θ, while the function set, its coefficients, the envelope and the prediction image are unchanged (C7Lm)',
                         'several parameters, θ = θ₀ + A(φ − φ₀) with the domain mapped accordingly: g_φ = Aᵀg_θA, and A = g_θ^(−1/2)Λ^(1/2) realizes ANY positive spectrum Λ at that point; for F-C at θ = (1, 2): spectra (1, 1), (1, 1e12) and (5, 7) (C7Lm)',
                         'every output-side object is a function of the set and stays fixed (C7Lo), so it cannot determine a quantity that varies arbitrarily within the same set'],
                  note='the original C7 wording stays in the registry (T-C7, OPEN in its invariant reading); this FAIL is about its raw-spectrum reading (T-C7-FRAW, superseded by T-C7-FINV)', cards=['C7Lm', 'C7Lq', 'C7Lo', 'MMIb', 'CFT5e'])
FISHER_INV = dict(verdict='OPEN', needs=['a separately supplied parameter metric h that transforms as a tensor (h_φ = Aᵀh_θA), and a prediction metric W: then σ(W^(1/2)J_Yh^(−1/2)), the singular values of dY: (T_θΘ, h) → (T_YP, W), are invariant (C7Ln)',
                                          'or generalized eigenvalues of a metric pair (g, h) with h a tensor (MMIb)',
                                          'or prediction-space geometric widths instead of Fisher eigenvalues (C7-R)'],
                  note='no structure of this kind is supplied by the model, and no theorem in the repository relates coefficient decay to an invariant local spectrum; not attempted (Nadia: "Do not attempt to solve C7-F(inv).")', cards=['C7Ln', 'C7Lr'])
LOWER = dict(verdict='FAIL', statement='Envelope alone ⇏ nonzero actual-width lower bound.',
             proof='the envelope is an upper constraint; for every envelope with r_0 > 0 and every η > 0 the family θ·(η/2√N)·T_0, θ ∈ [0, 1], satisfies it with image diameter < η and all further widths 0; the singleton {0} satisfies it with all widths 0 (C7Ll)',
             wouldNeed=['occupancy of a coefficient region (a contained ball or box)', 'surjectivity of θ ↦ a(θ) onto a coefficient region', 'a bi-Lipschitz / non-degeneracy condition on θ ↦ a(θ)', 'a lower singular-value bound for the composed map'],
             future='a future optional branch (C7-LB+, OPEN); not a blocker for locking C7-R', cards=['C7Ll'])
TABLE = [
 dict(id='C7-A', claim='Fourier / Chebyshev coefficient identity', status='KNOWN-REFORMULATION', scope='every continuous f on [−1, 1]', cards=['C7a', 'C7b']),
 dict(id='C7-B', claim='uniform coefficient decay → uniform approximation control', status='KNOWN-REFORMULATION', scope='family-wide envelope required (pointwise decay fails, C7d); the analyticity link is the even-periodic equivalence (C7Lh)', cards=['C7i', 'C7Lh', 'C7Lk']),
 dict(id='C7-R', claim='approximation control → prediction-space enclosure hierarchy (the representation / enclosure bridge)', status='KNOWN-REFORMULATION', scope='RESTRICTED STRUCTURAL CONNECTION: uniformly enveloped families on an interval; upper bound only', cards=['C7Lp', 'C7Le', 'C7Lo']),
 dict(id='C7-LB', claim='coefficient envelope → nonzero lower bound on actual widths', status='FAIL', scope='envelope alone', cards=['C7Ll']),
 dict(id='C7-LB+', claim='lower bound under additional occupancy / non-degeneracy assumptions', status='OPEN', scope='optional future branch, not pursued', cards=[]),
 dict(id='C7-F(raw)', claim='coefficient decay → raw Fisher / sloppy eigenvalue decay (universal, chart-independent)', status='FAIL', scope='as an invariant universal claim', cards=['C7Lm', 'C7Lq']),
 dict(id='C7-F(inv)', claim='invariant Fisher / local-sensitivity reformulation', status='OPEN', scope='needs independently supplied structure (C7Ln); not attempted', cards=['C7Ln', 'C7Lr']),
 dict(id='TMS-W', claim='Transtrum width spectrum as a universal reparametrization-invariant ordered spectrum', status='OPEN', scope='NOT ESTABLISHED: individual geodesic lengths are geometric; the direction family is chart-tied (MMPg); no precise definition proved coordinate-dependent, so not FAIL', cards=['MMPg']),
 dict(id='Q-Eq2', claim='Quinn Eq. (2) as written (published PRL)', status='FAIL', scope='under the ordinary Euclidean prediction-space interpretation (counterexample); see EQ2.notClaimed', cards=['C7Lc', 'C7Ld']),
 dict(id='Q-Eq2-fix', claim='directional width bound 2rσ_j + 2ε‖u_j‖₁ and enclosing ellipsoid √2·√(r²σ_j² + Nε²)', status='PROVED', scope='elementary; no priority claimed', cards=['C7Lb', 'C7Le']),
 dict(id='Q-const', claim='coefficient radius M√(4N − 3) and Eq. (8) constants', status='PROVED', scope='internal constant inconsistency / likely typographical factor recorded; not a new result', cards=['C7Lf', 'C7Lg']),
]
WORDING_PATCHES = [
 dict(date='2026-11-16', context='Act VIII pass, non-research wording patch (C7 stays locked)', old="the Kolmogorov bound is attained for that choice of L_m (C7Lk: \"for this L_m the bound is attained (1/(θ − x) at θ = 2, x = 1), so the index cannot shift to R_(m+1)\"; report: \"The bound is attained for that choice of L_m\")",
      new='Choosing L_m = span{T_0, …, T_(m−1)} proves d_m(F; C[−1, 1]) ≤ R_m. Equality is not guaranteed for an arbitrary family satisfying only the coefficient envelope. Sharpness requires an appropriate extremal family / function and must be stated separately.'),
 dict(date='2026-11-16', context='Act VIII pass, non-research wording patch (C7 stays locked)', old='"exact enclosure" / "the exact enclosure is the Minkowski set ..."',
      new='"the exact coefficient-box/Minkowski set inclusion used in the argument is ..." (equality between the model image and the enclosing set has not been proved and is not claimed)'),
]
SUPERSEDED = [
 dict(passOne='"the published PRL version not read" / Eq. (2) "may already be fixed" in the published version', now='the published PRL text was read: Eq. (2) is unchanged except for the subscript; no official correction was located'),
 dict(passOne='principal umbrella status C7-KNOWN-REFORMULATION for "C7"', now='split statuses (TABLE): C7-A, C7-B, C7-R KNOWN-REFORMULATION; C7-LB FAIL; C7-F(raw) FAIL; C7-F(inv) OPEN; TMS-W OPEN'),
 dict(passOne='"strip analyticity of F_θ is Bernstein-ellipse analyticity of f_θ"', now=ANALYTICITY['statement']),
 dict(passOne='"exact axes at Chebyshev nodes"', now=CONVENTIONS[0]['statement']),
 dict(passOne='"at N equally spaced samples ... the ellipsoid axes are EXACTLY √N × the sorted envelope"', now=CONVENTIONS[1]['statement']),
 dict(passOne='"(g) every object in (a)–(f) is unchanged by any reparametrization of Θ with the same image"', now=CONVENTIONS[3]['statement']),
 dict(passOne='conclusion (c), enclosing ellipsoid with semi-axes √2·√(mσ_j² + NR_m²), asserted with a sketch', now='proved by support functions (C7Le)'),
 dict(passOne='"Quinn\'s Eq. (2) error term needs the correction of C7j"', now=EQ2['verdict'] + ' The containment claim also fails under the Euclidean-ball reading for unequal axes (C7Ld).'),
 dict(passOne='"the stated radius 4M√(4N − 3) is valid but loose by 4"', now=CONSTANT['verdict']),
]
BACKBONE = dict(surviving='orthogonal spectral representation → coefficient hierarchy → restricted accessible coefficient region → bounded prediction-space directions',
                notYet='spectral hierarchy ⟹ universal Fisher hierarchy',
                interpretation='Correct as stated: the surviving chain is meaningful and holds for uniformly enveloped families as an upper-bound statement about accessible prediction-space directions; it is NOT a spectral → universal Fisher-hierarchy theorem (C7-F(raw) FAIL), and it does not bound actual widths from below (C7-LB FAIL).',
                gained=['an exact, source-locked link from the founding Fourier representation to model-manifold geometry (C7-A, C7-R)',
                        'a clean separation of parameter-coordinate spectra (chart-dependent) from prediction-space enclosures (set-level, invariant)',
                        'negative results that explain why the chain cannot become a Fisher-spectrum theorem without extra structure',
                        'a precise audit of a published bound (Eq. (2) counterexample under the Euclidean reading; constant inconsistency)'])
NOVELTY = dict(known=['the Chebyshev / cosine-Fourier coefficient identity', 'uniform approximation bounds (M-test; Trefethen Thm 8.2)', 'linear evaluation operators', 'singular-value ellipsoid bounds', 'Kolmogorov upper bounds', 'covariance of the Fisher metric (g_φ = Aᵀg_θA)'],
               synthesis=['placing the Fourier representation explicitly in the model-manifold story', 'separating parameter-coordinate spectra from prediction-space enclosures', 'the C7-R chain as a representation-level explanation', 'the explicit negative results showing why the chain cannot automatically become a Fisher-spectrum theorem'],
               observation=['the Eq. (2) counterexample under the Euclidean reading', 'the coefficient-radius / Eq. (8) constant inconsistency'],
               discipline='neither observation is presented as a novel theorem, and no priority is claimed; what was independently verified: the published wording, the exact counterexamples (C7Lc, C7Ld), the support-function bound (C7Lb), the proved ellipsoid (C7Le) and the constant arithmetic (C7Lf, C7Lg)')
RATINGS = [
 dict(item='C7-R', bs=30, slop=10, td='STRUCTURAL TRANSFER (RESTRICTED STRUCTURAL CONNECTION)', breadth=3, novelty='KNOWN (reformulation)'),
 dict(item='C7-F(raw)', bs=0, slop=5, td='FAIL', breadth=3, novelty='KNOWN (Fisher covariance); the negative result is a project classification'),
 dict(item='C7-F(inv)', bs=5, slop=30, td='NOT YET FORMALIZED', breadth=0, novelty='OPEN (nothing derived)'),
 dict(item='model-manifold / Fourier connection overall', bs=30, slop=10, td='STRUCTURAL TRANSFER (restricted)', breadth=3, novelty='project synthesis of known mathematics'),
]
LOCK = dict(decision='LOCK C7-R / CLOSE THIS BRANCH', reason='the audit found no mathematical defect in C7-R as corrected: every surviving statement is carded (C7La–C7Lr), the source-level problems are confined to Quinn\'s Eq. (2) and constants and are replaced by proved statements; C7-F(inv) stays a separate OPEN question',
            preserved='C7-F(inv) (OPEN) and C7-LB+ (OPEN, optional) are separate future questions; T-C7 keeps its original wording')

data = dict(about='Final adversarial C7 lock / audit (2026-11-16). Generated by research/tools/c7_lock_source.py.', terminalStatuses=TERMINAL, cards=CARDS, source=SOURCE, eq2=EQ2, constant=CONSTANT,
            geometry=GEOMETRY, analyticity=ANALYTICITY, conventions=CONVENTIONS, theorem=THEOREM, fisherRaw=FISHER_RAW, fisherInv=FISHER_INV, lowerBound=LOWER, table=TABLE,
            superseded=SUPERSEDED, wordingPatches=WORDING_PATCHES, backbone=BACKBONE, novelty=NOVELTY, ratings=RATINGS, lock=LOCK, auditOf='research/constructions/c7_fourier_width.md')
(ROOT / 'research/c7_lock.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')

cell = lambda x: '—' if x in (None, '', []) else str(x).replace('|', '\\|')
L = ['# C7 final lock / audit', '',
     'Generated from `research/tools/c7_lock_source.py` (`research/c7_lock.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Final adversarial C7 lock / audit". Cards: `verify/verify_C7L.py` (C7La–C7Lr). Audits `research/constructions/c7_fourier_width.md` (pass 1, kept).', '',
     f'**Decision: {LOCK["decision"]}.** {LOCK["reason"]}. {LOCK["preserved"]}.', '',
     '## A. Published-source audit', '', SOURCE['read'], '', f'> {SOURCE["eq2"]}', '', f'- Change from arXiv v1: {SOURCE["eq2Change"]}.', f'- Radius: "{SOURCE["radius"]}"', f'- Eq. (8): {SOURCE["eq8"]}.',
     f'- Corrections: {SOURCE["corrections"]}', '', f'**{SOURCE["correctionVerdict"]}**', '',
     '## B. Quinn Eq. (2) verdict', '', f'**{EQ2["verdict"]}**', ''] + [f'- {w}' for w in EQ2['why']] + ['', f'Not claimed: {EQ2["notClaimed"]}.', '',
     '## C. Quinn constant verdict', '', f'**{CONSTANT["verdict"]}.**', ''] + [f'- {f}' for f in CONSTANT['facts']]
L += ['', '## D. Correct enclosure geometry', '', '| Object | Exact statement | Status | Cards |', '|---|---|---|---|'] + [f'| {g["object"]} | {cell(g["exact"])} | {g["status"]} | {", ".join(g["cards"])} |' for g in GEOMETRY]
L += ['', f'## E. C7-R final theorem ({THEOREM["status"]}; {THEOREM["transferDepth"]})', '', 'Hypotheses:'] + [f'- {h}' for h in THEOREM['hypotheses']] + ['', 'Conclusions:'] + [f'- {c}' for c in THEOREM['conclusions']]
L += ['', 'Not claimed: ' + '; '.join(THEOREM['notClaimed']) + '.', '', 'Conventions locked:', ''] + [f'- **{c["item"]}**: {c["statement"]} ({", ".join(c["cards"])})' for c in CONVENTIONS]
L += ['', f'## F. C7-F(raw): {FISHER_RAW["verdict"]}', '', f'Claim tested: {FISHER_RAW["claim"]}.', ''] + [f'- {p}' for p in FISHER_RAW['proof']] + ['', FISHER_RAW['note'] + '.', '',
      f'C7-F(inv): **{FISHER_INV["verdict"]}**. Would need:'] + [f'- {n}' for n in FISHER_INV['needs']] + ['', FISHER_INV['note'] + '.']
L += ['', f'## G. Lower-bound verdict: {LOWER["verdict"]}', '', f'**{LOWER["statement"]}** {LOWER["proof"]}.', '', 'Would need (not pursued):'] + [f'- {w}' for w in LOWER['wouldNeed']] + ['', f'{LOWER["future"]}.']
L += ['', '## H. Fourier / Chebyshev analyticity statement', '', ANALYTICITY['statement'], '', f'Supersedes: {ANALYTICITY["supersedes"]}.',
      '', '## I. Final C7 status table', '', f'Terminal statuses only: {", ".join(TERMINAL)}.', '', '| ID | Claim | Final status | Scope | Cards |', '|---|---|---|---|---|'] + [f'| {t["id"]} | {cell(t["claim"])} | **{t["status"]}** | {cell(t["scope"])} | {cell(", ".join(t["cards"]))} |' for t in TABLE]
L += ['', '## J. Backbone interpretation', '', f'Surviving chain: "{BACKBONE["surviving"]}".', '', f'Not established: "{BACKBONE["notYet"]}".', '', BACKBONE['interpretation'], '', 'Gained:'] + [f'- {g}' for g in BACKBONE['gained']]
L += ['', 'Novelty discipline:', '', '- Known mathematics: ' + '; '.join(NOVELTY['known']) + '.', '- Project contribution / synthesis: ' + '; '.join(NOVELTY['synthesis']) + '.', '- Possible correction / observation: ' + '; '.join(NOVELTY['observation']) + '.', f'- {NOVELTY["discipline"]}.']
L += ['', '## K. Ratings (separate; no overall score)', '', '| Item | Backbone Support | AI Slop Risk | Transfer Depth | Breadth | Novelty |', '|---|---|---|---|---|---|'] + [f'| {r["item"]} | {r["bs"]}% | {r["slop"]}% | {r["td"]} | {r["breadth"]} | {r["novelty"]} |' for r in RATINGS]
L += ['', '## Pass-1 statements refined by this audit (pass-1 record kept)', '', '| Pass 1 | Now |', '|---|---|'] + [f'| {cell(s["passOne"])} | {cell(s["now"])} |' for s in SUPERSEDED]
L += ['', '## Wording patches (2026-11-16, Act VIII pass; C7 not reopened)', '', '| Superseded wording | Replacement |', '|---|---|'] + [f'| {cell(w["old"])} | {cell(w["new"])} |' for w in WORDING_PATCHES]
L += ['', f'## M. Branch lock decision', '', f'**{LOCK["decision"]}**', '', 'Stop: no work on C7-F(inv), H3, mass-wave, quantum, relativity or Energeo.']
(ROOT / 'research/constructions/c7_lock_audit.md').write_text('\n'.join(L) + '\n')
print(f'{len(TABLE)} status rows; decision: {LOCK["decision"]}')
