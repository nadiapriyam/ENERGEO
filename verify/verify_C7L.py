"""C7L: final adversarial C7 lock / audit (2026-11-16).

Independent re-derivations; nothing is reused from verify_C7.py. Source: the published PRL text of Quinn, Wilber,
Townsend, Sethna, Phys. Rev. Lett. 122, 158302 (2019), read in the typeset copy deposited at NSF PAR (record 10101033);
quoted in research/sources/quinn2019.md. Crossref lists no correction for the DOI.
Audits: Eq. (2) (error box, directional widths vs ellipsoid containment, an exact counterexample under the Euclidean
reading), a proved conservative enclosing ellipsoid, the coefficient-radius and Eq. (8) constants, the Fourier /
Chebyshev complex-domain statement, node and Fourier normalization conventions, the Kolmogorov width, the absence of a
lower bound from an envelope alone, the raw-Fisher reparametrization obstruction, and the final split statuses.
Run: python3 verify/verify_C7L.py"""
import itertools
import numpy as np
import mpmath as mp
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


OK = {}
rng = np.random.default_rng(20261116)
def ell_value(Y, U, semi):
    """Σ_j ((u_jᵀY)/semi_j)² for an ellipsoid with orthonormal axes U (columns) and semi-axes semi."""
    c = U.T * Y
    return sp.simplify(sum((c[j] / semi[j])**2 for j in range(len(semi))))

# ── C7La: the published Eq. (2), formalized ─────────────────────────────────────────────────────
r_, eps_ = sp.symbols('r epsilon', positive=True)
Xs = sp.Matrix([[1, -1], [1, 1]])                               # T_0, T_1 at t = −1, 1
UL, SS, VR = Xs.singular_value_decomposition()
sig = [SS[0, 0], SS[1, 1]]
HP_semis = [r_ * s for s in sig]
HY_semis = [r_ * s + eps_ for s in sig]
# formalization check: with ε = 0 the Eq. (2) object is H_P of Eq. (1): X maps the r-ball onto it, boundary attained
b = sp.Matrix([r_, 0])
on_boundary = sp.simplify(ell_value(Xs * b, UL, HP_semis) - 1) == 0
reduces = all(sp.simplify(h.subs(eps_, 0) - p) == 0 for h, p in zip(HY_semis, HP_semis))
OK['a'] = on_boundary and reduces and sig == [sp.sqrt(2), sp.sqrt(2)]
card("C7La", "[published Eq. (2), formalized] Eq. (2) of the published PRL ('we can define a hyperellipsoid HY that must enclose model manifold Y, where the cross-sectional widths are given by ℓj(HY) = 2rσj(X) + 2‖y − pN−1‖∞') is tested as: Y ⊆ H_Y, the ellipsoid with the principal axes of H_P = X·{‖b‖₂ ≤ r} and semi-axes rσ_j(X) + ε, ε = sup_θ ‖y_θ − p_(N−1)(θ)‖∞. Check of the formalization: at ε = 0 it is H_P of Eq. (1), whose boundary X·b (‖b‖ = r) is attained; for X = [[1, −1], [1, 1]] (T_0, T_1 at t = ±1) σ_1 = σ_2 = √2 exactly",
     OK['a'])

# ── C7Lb: support function of the error box ───────────────────────────────────────────────────
okb = True
for _ in range(200):
    N = int(rng.integers(2, 7)); u = rng.normal(size=N); u /= np.linalg.norm(u); e = float(rng.uniform(0.01, 1))
    best = max(u @ (e * np.array(s)) for s in itertools.product((-1, 1), repeat=N))
    okb &= abs(best - e * np.abs(u).sum()) < 1e-12 and 1 - 1e-12 <= np.abs(u).sum() <= np.sqrt(N) + 1e-12
Nn = sp.Symbol('N', positive=True, integer=True)
e1_norm = 1
diag_norm = sp.simplify(sp.Integer(4) * (1 / sp.sqrt(4)))          # N = 4: u = (1, 1, 1, 1)/2 has ‖u‖₁ = 2 = √4
OK['b'] = okb and e1_norm == 1 and diag_norm == 2
card("C7Lb", "[error box] if ‖y − p‖∞ ≤ ε on [−1, 1], the sampled error vector lies in the box [−ε, ε]^N, not in a Euclidean ball of radius ε. For a Euclidean unit u: sup_(e ∈ [−ε, ε]^N) uᵀe = Σ|u_i|ε = ε‖u‖₁, attained at e = ε·sign(u) (linear function on a box: maximum at a vertex; checked against all 2^N vertices for 200 random u, N = 2…6). Hence the error adds up to 2ε‖u‖₁ to the width along u, with 1 ≤ ‖u‖₁ ≤ √N (Cauchy–Schwarz; equality at u = e_1 and at u = (1, …, 1)/√N)",
     OK['b'])

# ── C7Lc: counterexamples to Eq. (2) as written (Euclidean prediction space) ─────────────────
# (i) N = 2, t = (−1, 1): y_θ(t) = θ1 + θ2 T_2(t), |θ1| < r, |θ2| ≤ ε; p_1 = θ1 (b = (θ1, 0)), y − p_1 = θ2 T_2, sup = |θ2|
r1, e1 = sp.Integer(1), sp.Rational(1, 10)
th1 = sp.Rational(99, 100)
Y1 = sp.Matrix([th1 + e1 * 1, th1 + e1 * 1])                     # T_2(−1) = T_2(1) = 1
rad = r1 * sp.sqrt(2) + e1                                        # Eq. (2): semi-axes rσ_j + ε, σ_1 = σ_2 = √2 (a disk)
excess1 = sp.nsimplify((Y1.T * Y1)[0] - rad**2)
out1 = sp.simplify((Y1.T * Y1)[0] - rad**2) > 0
u = sp.Matrix([1, 1]) / sp.sqrt(2)
width_actual = 2 * (u.T * sp.Matrix([1 + e1, 1 + e1]))[0]       # sup over the family (θ1 → r, θ2 = ε); the family is symmetric
width_eq2 = 2 * r1 * sp.sqrt(2) + 2 * e1
width_fix = 2 * r1 * sp.sqrt(2) + 2 * e1 * sp.Abs(u[0]) * 2     # 2rσ + 2ε‖u‖₁
dir1 = sp.simplify(width_actual - width_eq2) > 0 and sp.simplify(width_actual - width_fix) == 0
# (ii) N = 3, t = (−1, 0, 1), distinct σ: y_θ = θa (T_0 + T_2)/√2 + θe T_4, |θa| < r, |θe| ≤ ε; T_4(−1, 0, 1) = (1, 1, 1)
X3 = sp.Matrix([[1, -1, 1], [1, 0, -1], [1, 1, 1]])
ev = (X3.T * X3).eigenvals()
s1 = sp.Integer(2)
u1 = sp.Matrix([1, 0, 1]) / sp.sqrt(2)
v1 = sp.Matrix([1, 0, 1]) / sp.sqrt(2)
is_axis = sp.simplify(X3 * v1 - s1 * u1) == sp.zeros(3, 1) and ev == {2: 2, 4: 1}
ta = sp.Rational(99, 100)
Y3 = X3 * (ta * v1) + e1 * sp.Matrix([1, 1, 1])
c1 = (u1.T * Y3)[0]
rest = sp.sqrt(sp.simplify((Y3.T * Y3)[0] - c1**2))              # the remaining components lie in the σ = √2 plane
val3 = sp.simplify((c1 / (r1 * s1 + e1))**2 + (rest / (r1 * sp.sqrt(2) + e1))**2)
out3 = val3 > 1
dir3 = sp.simplify(2 * (r1 * s1 + sp.sqrt(2) * e1) - 2 * (r1 * s1 + e1)) > 0
OK['c'] = out1 and dir1 and is_axis and out3 and dir3
card("C7Lc", f"[Eq. (2): exact counterexamples, Euclidean prediction space] (i) N = 2, t = (−1, 1), Chebyshev basis: y_θ(t) = θ₁ + θ₂T₂(t), |θ₁| < r = 1, |θ₂| ≤ ε = 1/10; then p₁ = θ₁ (b = (θ₁, 0), ‖b‖₂ < r) and ‖y − p₁‖∞ = |θ₂| ≤ ε. X = [[1, −1], [1, 1]], σ₁ = σ₂ = √2, so Eq. (2) gives the disk of radius √2 + 1/10; the model point at θ = (99/100, 1/10) is Y = (109/100)(1, 1) with ‖Y‖² − (√2 + 1/10)² = {float(excess1):.4f} > 0 (exact): outside. Along u = (1, 1)/√2 the family's width is 2.2√2 = {float(width_actual):.4f} > 2√2 + 1/5 = {float(width_eq2):.4f}, equal to the corrected 2rσ + 2ε‖u‖₁. (ii) Distinct singular values: t = (−1, 0, 1), y_θ = θ_a(T₀ + T₂)/√2 + θ_eT₄ (T₄ = 1 at all three points), X has σ = (2, √2, √2) with first axis u₁ = (1, 0, 1)/√2; at θ = (99/100, 1/10) the Eq. (2) ellipsoid value is {float(val3):.4f} > 1. Counterexample to Eq. (2) as written under the ordinary Euclidean prediction-space interpretation",
     OK['c'])

# ── C7Ld: directional widths vs ellipsoid containment ────────────────────────────────────────
a1, a2, dl = sp.Integer(1), sp.Rational(1, 10), sp.Rational(1, 10)
tq = sp.pi / 4
y0 = sp.Matrix([a1 * sp.cos(tq), a2 * sp.sin(tq)])
nrm = sp.Matrix([sp.cos(tq) / a1, sp.sin(tq) / a2]); nrm = nrm / sp.sqrt((nrm.T * nrm)[0])
xq = y0 + dl * nrm
valq = sp.nsimplify(sp.simplify((xq[0] / (a1 + dl))**2 + (xq[1] / (a2 + dl))**2))
axis_widths = [2 * (a1 + dl), 2 * (a2 + dl)]                     # support of E ⊕ δB along each axis: a_j + δ
OK['d'] = float(valq) > 1 and axis_widths == [sp.Rational(11, 5), sp.Rational(2, 5)]
card("C7Ld", f"[directional width ≠ containment] a bound on the widths of a set along chosen axes does not give an enclosing ellipsoid with those widths. Even with a Euclidean-ball error (the most favourable reading), E ⊕ δB₂ has width exactly 2(a_j + δ) along each axis of E (support functions add), yet it is not contained in the ellipsoid with semi-axes a_j + δ: for a = (1, 1/10), δ = 1/10 the point of E at angle π/4 moved by δ along its normal gives {float(valq):.4f} > 1. Three objects are kept apart: the exact Minkowski set H_P ⊕ [−ε, ε]^N, the directional support-function bound h(u) = h_(H_P)(u) + ε‖u‖₁, and an enclosing-ellipsoid relaxation (C7Le)",
     OK['d'])

# ── C7Le: a proved conservative enclosing ellipsoid ──────────────────────────────────────────
pa, pb = sp.symbols('alpha beta', nonnegative=True)
scalar = sp.expand(2 * (pa**2 + pb**2) - (pa + pb)**2) == sp.expand((pa - pb)**2)
oke = True
for _ in range(60):
    N = int(rng.integers(2, 6)); n = int(rng.integers(1, N + 1)); A = rng.normal(size=(N, n)); e = float(rng.uniform(0.01, 0.5))
    Q = 2 * (A @ A.T + N * e**2 * np.eye(N)); Qi = np.linalg.inv(Q)
    for _ in range(300):
        z = rng.normal(size=n); z /= max(1.0, np.linalg.norm(z)) if rng.uniform() < 0.5 else np.linalg.norm(z)
        x = A @ z + e * rng.choice((-1.0, 1.0), size=N)            # box corners are the extreme error vectors
        oke &= x @ Qi @ x <= 1 + 1e-10
    w, Ux = np.linalg.eigh(Q)
    s = np.r_[np.linalg.svd(A, compute_uv=False), np.zeros(N - min(N, n))]
    oke &= np.allclose(np.sort(np.sqrt(w)), np.sort(np.sqrt(2) * np.sqrt(s**2 + N * e**2)))
segA = np.array([[1.0], [0.0]]); dseg = 0.3
tight_needed = np.array([1.0 + dseg, 0.0]) @ np.linalg.inv(segA @ segA.T + dseg**2 * np.eye(2)) @ np.array([1.0 + dseg, 0.0]) > 1
OK['e'] = scalar and oke and tight_needed
card("C7Le", "[conservative ellipsoid, PROVED] for H_P = {Az : ‖z‖₂ ≤ 1} and δ > 0: H_P ⊕ B₂(δ) ⊆ E(Q) = {x : xᵀQ⁻¹x ≤ 1} with Q = 2(AAᵀ + δ²I). Proof: support functions h_(H_P)(u) = ‖Aᵀu‖, h_(B₂(δ))(u) = δ, h_(E(Q))(u) = √(uᵀQu) = √2·√(‖Aᵀu‖² + δ²) ≥ ‖Aᵀu‖ + δ because 2(α² + β²) − (α + β)² = (α − β)² ≥ 0; compact convex sets satisfy K ⊆ L ⟺ h_K ≤ h_L. Since [−ε, ε]^N ⊆ B₂(√N ε), H_P ⊕ [−ε, ε]^N ⊆ E(2(AAᵀ + Nε²I)), whose semi-axes are √2·√(s_j(A)² + Nε²) (s_j padded with zeros to N): checked on 60 random (A, ε) with 300 points each, box corners included. The factor √2 cannot be dropped in general: for a segment plus a ball, the point (1 + δ, 0) lies outside E(AAᵀ + δ²I)",
     OK['e'])

# ── C7Lf: Quinn's coefficient radius ─────────────────────────────────────────────────────────
M, Ns = sp.symbols('M N', positive=True)
tight_sq = M**2 + (Ns - 1) * (2 * M)**2                          # corner of the box |c̃_0| ≤ M, |c̃_j| ≤ 2M (c̃_j = ρ^j c_j, |c_j| ≤ 2Mρ^(−j))
tight_ok = sp.expand(tight_sq - M**2 * (4 * Ns - 3)) == 0
printed = 4 * M * sp.sqrt(4 * Ns - 3)
ratio = sp.simplify(printed / (M * sp.sqrt(4 * Ns - 3)))
diam_printed = sp.simplify(2 * printed)                           # ℓ_j(H_P) = 2rσ_j with r = 4M√(4N − 3)
OK['f'] = tight_ok and ratio == 4 and sp.simplify(diam_printed - 8 * M * sp.sqrt(4 * Ns - 3)) == 0
card("C7Lf", "[coefficient radius] from |c_0| ≤ M, |c_j| ≤ 2Mρ^(−j) and c̃_j = ρ^j c_j: |c̃_0| ≤ M, |c̃_j| ≤ 2M, so ‖c̃‖₂² ≤ M² + 4M²(N − 1) = M²(4N − 3) (symbolic; equality at a corner of the box), i.e. ‖c̃‖₂ ≤ M√(4N − 3). The printed '‖c̃‖₂ < 4M√(4N − 3)' is valid but loose by exactly 4, and the printed diameter 'ℓj(HP) = 8M√(4N − 3)σj(X)' is 2rσ_j with that loose radius",
     OK['f'])

# ── C7Lg: Eq. (8) constants ──────────────────────────────────────────────────────────────────
rho = sp.Symbol('rho', positive=True); j = sp.Symbol('j', positive=True)
thm2 = sp.sqrt(Ns) * rho**(-j + 2) / sp.sqrt(rho**2 - 1)          # σ_j(X) ≤ √N ρ^(−j+2)/√(ρ² − 1), j > 1
eq8_first = 2 * M * sp.sqrt(4 * Ns**2 - 3 * Ns) * rho**(-j + 2) / sp.sqrt(rho**2 - 1)
tight_match = sp.simplify(eq8_first - 2 * M * sp.sqrt(4 * Ns - 3) * thm2) == 0
loose_factor = sp.simplify((2 * printed * thm2) / eq8_first)
eps_thm1 = 2 * M * rho**(-Ns + 1) / (rho - 1)
second = sp.simplify(4 * M * rho**(-Ns + 1) / (rho - 1) - 2 * eps_thm1) == 0
OK['g'] = tight_match and loose_factor == 4 and second
card("C7Lg", "[Eq. (8) constants] Eq. (8)'s first term 2M√(4N² − 3N)ρ^(−j+2)/√(ρ² − 1) equals 2·M√(4N − 3)·(√Nρ^(−j+2)/√(ρ² − 1)) (√(4N² − 3N) = √N√(4N − 3), symbolic): it uses the TIGHT radius M√(4N − 3), not the printed 4M√(4N − 3), which would give 4× Eq. (8). Internal constant inconsistency, likely a typographical factor; not a new mathematical result. The second term 4Mρ^(−N+1)/(ρ − 1) is 2ε with ε from Theorem 1(i): the additive error term of Eq. (2), which as a directional width along u_j needs 2ε‖u_j‖₁ (≤ 2√N ε) and as an enclosing ellipsoid needs C7Le",
     OK['g'])

# ── C7Lh: the complex-domain mapping ─────────────────────────────────────────────────────────
al, be = sp.symbols('alpha beta', real=True)
z = sp.Symbol('z')
modz = sp.simplify(sp.Abs(sp.exp(sp.I * (al + sp.I * be))) - sp.exp(-be)) == 0
Jk = lambda zz: (zz + 1 / zz) / 2
fold = sp.simplify(Jk(1 / z) - Jk(z)) == 0
cheb_laurent = all(sp.simplify(sp.expand(sp.chebyshevt(k, Jk(z)) - (z**k + z**(-k)) / 2)) == 0 for k in range(0, 9))
s_ = 2.0
pts = [complex(Jk(s_ * np.exp(1j * t))) for t in np.linspace(0, 2 * np.pi, 400)]
semi = ((s_ + 1 / s_) / 2, (s_ - 1 / s_) / 2)
on_ellipse = max(abs((p.real / semi[0])**2 + (p.imag / semi[1])**2 - 1) for p in pts) < 1e-12
same_for_inverse = max(abs(complex(Jk(s_ * np.exp(1j * t))) - complex(Jk(np.exp(-1j * t) / s_))) for t in np.linspace(0, 6, 50)) < 1e-12
G = sp.simplify(1 / (2 - Jk(z)))
poles = sp.solve(sp.denom(sp.together(G)), z)
annulus = sorted([sp.nsimplify(p) for p in poles], key=lambda q: float(q)) == [2 - sp.sqrt(3), 2 + sp.sqrt(3)]
odd = sp.simplify(sp.sin(-al) + sp.sin(al)) == 0                   # sin is odd; every f(cos φ) is even
OK['h'] = modz and fold and cheb_laurent and on_ellipse and same_for_inverse and annulus and odd
card("C7Lh", "[Fourier / Chebyshev analyticity, exact form] with z = e^(iφ), φ = α + iβ: |z| = e^(−β), so the annulus ρ^(−1) < |z| < ρ is the strip |Im φ| < log ρ. The Joukowski map x = (z + z^(−1))/2 = cos φ folds z ↔ 1/z (2-to-1), sends |z| = s and |z| = 1/s onto the same ellipse with semi-axes (s ± 1/s)/2 (checked at s = 2) and |z| = 1 onto [−1, 1] twice; T_k((z + z^(−1))/2) = (z^k + z^(−k))/2 (k ≤ 8). Exact statement: f is analytic in the open region bounded by E_ρ with |f| ≤ M ⟺ F = f∘cos is analytic in |Im φ| < log ρ with |F| ≤ M; such an F is automatically 2π-periodic and EVEN. Conversely an analytic, 2π-periodic, even F on the strip descends to such an f (G(z) = F has a Laurent series with g_(−k) = g_k, so G = g_0 + 2Σ g_k T_k(x)); without evenness it need not (sin φ is entire and periodic but odd). Example: 1/(2 − x) gives G with poles z = 2 ∓ √3, i.e. exactly the annulus with ρ = 2 + √3",
     OK['h'])

# ── C7Li: node conventions ───────────────────────────────────────────────────────────────────
mp.mp.dps = 50
def gram(xs, m, w=None):
    w = w or [1] * len(xs)
    return [[mp.fsum(wi * mp.chebyt(a, x) * mp.chebyt(c, x) for wi, x in zip(w, xs)) for c in range(m)] for a in range(m)]
Ng = 7
gauss = [mp.cos((i + mp.mpf(1) / 2) * mp.pi / Ng) for i in range(Ng)]
Gg = gram(gauss, Ng)
gauss_ok = all(abs(Gg[a][c] - (Ng if a == c == 0 else (mp.mpf(Ng) / 2 if a == c else 0))) < mp.mpf(10)**-40 for a in range(Ng) for c in range(Ng))
same_set = max(abs(gauss[i] - mp.cos((2 * (i + 1) - 1) * mp.pi / (2 * Ng))) for i in range(Ng)) < mp.mpf(10)**-45
lob = [mp.cos(i * mp.pi / (Ng - 1)) for i in range(Ng)]
Gl = gram(lob, Ng)
lob_unweighted_off = abs(Gl[0][2]) > mp.mpf('0.5')
wts = [mp.mpf(1) / 2] + [1] * (Ng - 2) + [mp.mpf(1) / 2]
Gw = gram(lob, Ng, wts)
lob_weighted_ok = all(abs(Gw[a][c] - ((Ng - 1) if a == c and a in (0, Ng - 1) else ((mp.mpf(Ng - 1) / 2) if a == c else 0))) < mp.mpf(10)**-40 for a in range(Ng) for c in range(Ng))
OK['i'] = gauss_ok and same_set and lob_unweighted_off and lob_weighted_ok
card("C7Li", f"[node convention] the exact-axes statement holds for Gauss–Chebyshev (first-kind) nodes x_i = cos((i + 1/2)π/N), i = 0, …, N − 1 (the same set as cos((2i − 1)π/2N), i = 1, …, N): with the unweighted Euclidean metric, Σ_i T_j(x_i)T_k(x_i) = 0 (j ≠ k), N/2 (j = k ≥ 1), N (j = k = 0) for j, k ≤ N − 1 (N = 7, 50-digit check), so σ(V D) = {{√N r_0}} ∪ {{√(N/2) r_k}}. It FAILS for Chebyshev–Lobatto (extrema) nodes cos(iπ/(N − 1)) with the unweighted metric: Σ_i T_0T_2(x_i) = {float(Gl[0][2]):.0f} ≠ 0; there, orthogonality needs the weights (1/2, 1, …, 1, 1/2), with norms N − 1 (k = 0, N − 1) and (N − 1)/2 otherwise",
     OK['i'])

# ── C7Lj: periodic Fourier normalization ─────────────────────────────────────────────────────
Np, Kp = 12, 5
tt = 2 * np.pi * np.arange(Np) / Np
ks = np.arange(-Kp, Kp + 1)
Fc = np.exp(1j * np.outer(tt, ks))
cplx_ok = np.allclose(Fc.conj().T @ Fc, Np * np.eye(2 * Kp + 1))
Fr = np.column_stack([np.ones(Np)] + [f(k * tt) for k in range(1, Kp + 1) for f in (np.cos, np.sin)])
real_ok = np.allclose(Fr.T @ Fr, np.diag([Np] + [Np / 2] * (2 * Kp)))
ny = np.exp(1j * (Np // 2) * tt); ny_m = np.exp(-1j * (Np // 2) * tt)
nyq_degenerate = np.allclose(ny, ny_m) and np.allclose(np.sin((Np // 2) * tt), 0)
rk = 0.5**np.arange(Kp + 1)
sv_c = np.sort(np.linalg.svd(Fc @ np.diag(rk[np.abs(ks)]), compute_uv=False))[::-1]
want_c = np.sort(np.sqrt(Np) * rk[np.abs(ks)])[::-1]
sv_r = np.sort(np.linalg.svd(Fr @ np.diag(np.r_[rk[0], np.repeat(rk[1:], 2)]), compute_uv=False))[::-1]
want_r = np.sort(np.r_[np.sqrt(Np) * rk[0], np.sqrt(Np / 2) * np.repeat(rk[1:], 2)])[::-1]
alias = np.allclose(np.exp(1j * 3 * tt), np.exp(1j * (3 + Np) * tt))
OK['j'] = cplx_ok and real_ok and nyq_degenerate and np.allclose(sv_c, want_c) and np.allclose(sv_r, want_r) and alias
card("C7Lj", "[periodic convention] N equally spaced samples t_j = 2πj/N (N = 12). Complex basis e^(ikt), |k| ≤ K, with an envelope on the complex coefficients |f̂(k)| ≤ r_|k|: FᴴF = N·I exactly when the 2K + 1 frequencies are distinct mod N (2K + 1 ≤ N), and then σ(FD) = √N·r_|k|, each r_k (k ≥ 1) twice (±k). Real basis 1, cos kt, sin kt with |a_k|, |b_k| ≤ r_k: Gram diag(N, N/2, …), so σ = √N r_0 and √(N/2) r_k (twice). Nyquist mode (N even, k = N/2): e^(±iNt/2) coincide and sin(Nt/2) vanishes on the samples, so it is excluded by 2K + 1 ≤ N. Modes alias: e^(i(k+N)t_j) = e^(ikt_j). 'Exactly √N × the envelope' holds only in the complex convention with 2K + 1 ≤ N",
     OK['j'])

# ── C7Lk: the Kolmogorov width, with indexing ────────────────────────────────────────────────
ak = lambda th, k: (1 / mp.sqrt(th**2 - 1)) if k == 0 else 2 / mp.sqrt(th**2 - 1) * (th - mp.sqrt(th**2 - 1))**k
mp.mp.dps = 30
r_env = [ak(mp.mpf(2), k) for k in range(80)]
q = 2 - mp.sqrt(3)
Rm = lambda m: mp.fsum(r_env[m:]) + r_env[-1] * q / (1 - q)
xs = [mp.mpf(i) / 200 - 1 for i in range(401)]
okk = True
for m in range(1, 9):
    dims_ok = np.linalg.matrix_rank(np.array([[float(mp.chebyt(k, x)) for k in range(m)] for x in xs[::10]])) == m
    worst = max(abs(1 / (th - x) - mp.fsum(ak(th, k) * mp.chebyt(k, x) for k in range(m))) for th in (mp.mpf(2), mp.mpf('2.5'), mp.mpf(3)) for x in xs[::5])
    attained = abs(1 / (2 - mp.mpf(1)) - mp.fsum(ak(mp.mpf(2), k) for k in range(m)) - Rm(m)) < mp.mpf(10)**-20
    okk &= dims_ok and worst <= Rm(m) * (1 + mp.mpf(10)**-20) and attained and Rm(m) > Rm(m + 1)
OK['k'] = okk
card("C7Lk", "[Kolmogorov width] d_m(F; C[−1, 1]) = inf over subspaces L with dim L = m of sup_(f ∈ F) inf_(g ∈ L) ‖f − g‖∞. Choose L_m = span{T_0, …, T_(m−1)} (dimension m: degrees 0…m − 1) and g = Σ_(k<m) a_k(f)T_k: ‖f − g‖∞ ≤ Σ_(k≥m)|a_k(f)| ≤ Σ_(k≥m) r_k = R_m, so d_m ≤ R_m. Indexing checked on 1/(θ − x), θ ∈ [2, 3], m = 1…8: dim L_m = m, the truncation error is ≤ R_m, and at θ = 2, x = 1 (all a_k > 0, T_k(1) = 1) it EQUALS R_m, so this choice of L_m cannot give R_(m+1). This is a function-space width (sup norm, N-free), not an axis of the finite prediction-space hyperellipsoid",
     OK['k'])

# ── C7Ll: an envelope alone gives no lower bound ──────────────────────────────────────────────
Nl = 8; xl = np.cos((np.arange(Nl) + 0.5) * np.pi / Nl)
okl = True
for eta in (1.0, 1e-3, 1e-9):
    c0 = eta / (2 * np.sqrt(Nl))
    fam = [lambda x, th=th: th * c0 * np.ones_like(x) for th in np.linspace(0, 1, 101)]    # f_θ = θ c0 T_0: |a_0| ≤ c0 ≤ r_0
    P = np.array([f(xl) for f in fam]); Pc = P - P.mean(0)
    s = np.linalg.svd(Pc, compute_uv=False)
    diam = np.linalg.norm(P[-1] - P[0])
    okl &= c0 <= float(r_env[0]) and diam < eta and np.all(s[1:] < 1e-12)
single = np.zeros((1, Nl))
OK['l'] = okl and np.all(single == 0)
card("C7Ll", "[no lower bound from an envelope alone] the envelope is an UPPER constraint |a_k(θ)| ≤ r_k: any family occupying a subset of the allowed coefficient region satisfies it. For the 1/(θ − x) envelope (r_0 = 1/√3) and every η > 0 (η = 1, 1e−3, 1e−9 checked), the family f_θ = θ·(η/2√N)·T_0, θ ∈ [0, 1], satisfies the envelope, its image at N = 8 nodes has diameter < η and all widths beyond the first are 0; the singleton {0} satisfies it with all widths 0. Envelope alone ⇏ nonzero actual-width lower bound. A lower bound would need additional assumptions (coefficient-region occupancy, a contained ball, surjectivity onto a coefficient region, a bi-Lipschitz map θ ↦ a(θ), a lower singular-value bound): a future optional branch, not pursued here",
     OK['l'])

# ── C7Lm: the raw-Fisher reparametrization obstruction ───────────────────────────────────────
x8 = np.cos((np.arange(8) + 0.5) * np.pi / 8)
th0 = 2.5
J1 = (1 / (th0 - x8)**2).reshape(-1, 1)                            # ∂f/∂θ at the samples (sign irrelevant)
g1 = float((J1.T @ J1)[0, 0])
scale_ok = all(abs(float(((J1 * a).T @ (J1 * a))[0, 0]) - a**2 * g1) < 1e-9 * a**2 * g1 for a in (0.1, 3.0, 1e4))
tF = (x8 + 1) / 2                                                   # F-C on t ∈ [0, 1]
thF = np.array([1.0, 2.0])
JF = np.column_stack([-tF * np.exp(-thF[0] * tF), -tF * np.exp(-thF[1] * tF)])
gF = JF.T @ JF
w, Vg = np.linalg.eigh(gF); gm12 = Vg @ np.diag(w**-0.5) @ Vg.T
okm = scale_ok
for Lam in (np.diag([1.0, 1.0]), np.diag([1.0, 1e12]), np.diag([5.0, 7.0])):
    A = gm12 @ np.sqrt(Lam)
    gphi = A.T @ gF @ A
    okm &= np.allclose(np.sort(np.linalg.eigvalsh(gphi)), np.sort(np.diag(Lam)), rtol=1e-6)
ratio_theta = w.max() / w.min()
OK['m'] = okm and ratio_theta > 10
card("C7Lm", f"[raw Fisher obstruction] (1) one parameter, θ = aφ: g_φ = a²g_θ (checked for 1/(θ − x) at 8 nodes, a = 0.1, 3, 1e4), while the set of functions, their Fourier / Chebyshev coefficients, the envelope and the prediction image are unchanged (φ ranges over Θ/a). (2) Several parameters, θ = θ₀ + A(φ − φ₀) with the domain mapped accordingly (same set of functions): g_φ = Aᵀg_θA, and choosing A = g_θ^(−1/2)Λ^(1/2) gives ANY prescribed positive spectrum Λ at that point. For F-C at θ = (1, 2) (condition number {ratio_theta:.1e} in θ) the spectra (1, 1) (no decay), (1, 1e12) (any condition number) and (5, 7) are each realized, while the output coefficient envelope is unchanged. So no property of the output-function set, coefficient decay included, can imply a raw Fisher eigenvalue decay valid in every chart: C7-F(raw) FAILS as an invariant universal claim",
     OK['m'])

# ── C7Ln: what an invariant reformulation would need ─────────────────────────────────────────
okn = True
for _ in range(50):
    N = 6; n = 3
    Jr = rng.normal(size=(N, n)); Wm = np.diag(rng.uniform(0.5, 2, N)); Hm = rng.normal(size=(n, n)); Hm = Hm @ Hm.T + n * np.eye(n)
    A = rng.normal(size=(n, n)) + 3 * np.eye(n)
    msqrt = lambda S: (lambda w, V: V @ np.diag(w**-0.5) @ V.T)(*np.linalg.eigh(S))
    s0 = np.linalg.svd(np.sqrt(Wm) @ Jr @ msqrt(Hm), compute_uv=False)
    s1 = np.linalg.svd(np.sqrt(Wm) @ (Jr @ A) @ msqrt(A.T @ Hm @ A), compute_uv=False)
    sI = np.linalg.svd(np.sqrt(Wm) @ (Jr @ A), compute_uv=False)
    okn &= np.allclose(s0, s1) and not np.allclose(s0, sI)
OK['n'] = okn
card("C7Ln", "[C7-F(inv): what an invariant comparison needs] the local sensitivity spectrum σ(W^(1/2) J_Y h^(−1/2)), the singular values of dY: (T_θΘ, h) → (T_Y P, W), is invariant under θ = θ(φ) when h is a TENSOR (h_φ = Aᵀh_θA): equal in both charts for 50 random (J, W, h, A). With h = I in every chart (not a tensor) it changes. So an invariant spectral comparison needs an independently supplied parameter metric h and prediction metric W (or a geometric prediction-space width); the model does not supply h. Whether output coefficient decay controls such an invariant spectrum is not derived: C7-F(inv) stays OPEN",
     OK['n'])

# ── C7Lo: the reparametrization claim, made exact ────────────────────────────────────────────
xo = np.cos((np.arange(8) + 0.5) * np.pi / 8)
thg = np.linspace(2, 3, 4001); phg = np.linspace(0, 1, 4001); thp = 2 + phg**3
Ptheta = np.array([1 / (t - xo) for t in thg]); Pphi = np.array([1 / (t - xo) for t in thp])
def haus(A, B):
    d = lambda X, Y: max(np.min(np.linalg.norm(Y - x, axis=1)) for x in X[::40])
    return max(d(A, B), d(B, A))
coef = lambda t: np.array([float(ak(mp.mpf(t), k)) for k in range(8)])
env_t = np.max([coef(t) for t in thg[::200]], axis=0); env_p = np.max([coef(t) for t in thp[::200]], axis=0)
J_t = (1 / (2.125 - xo)**2); J_p = J_t * 3 * 0.5**2
OK['o'] = haus(Ptheta, Pphi) < 1e-3 and np.allclose(env_t, env_p) and abs(float(J_p @ J_p) / float(J_t @ J_t) - 0.5625) < 1e-12
card("C7Lo", "[reparametrization, exact list] for a change of parameters that keeps the set of functions {f_θ} (here 1/(θ − x), θ ∈ [2, 3] vs θ = 2 + φ³): UNCHANGED, because each is defined from the set: the coefficient set {a(θ)}, the family-wide envelope r_k = sup over the set, the sampled prediction set Y(Θ) (Hausdorff distance between the two charts' point clouds < 1e−3, grid-limited), the exact Minkowski enclosure V_mD_m·[−1, 1]^m ⊕ [−R_m, R_m]^N and the Quinn-style ellipsoid built from them. CHANGED: the raw Fisher matrix and its eigenvalues (ratio 0.5625 at φ = 0.5)",
     OK['o'])

# ── C7Lp / C7Lq / C7Lr: final statuses ───────────────────────────────────────────────────────
OK['p'] = OK['e'] and OK['h'] and OK['i'] and OK['j'] and OK['k'] and OK['o'] and OK['f'] and OK['g']
card("C7Lp", "[C7-R final status: KNOWN-REFORMULATION] after the audit, C7-R (cosine-Fourier ↔ Chebyshev coefficients → uniform approximation control → prediction-space enclosure) survives in corrected form: the exact enclosure is the Minkowski set V_mD_m·[−1, 1]^m ⊕ [−R_m, R_m]^N; directional widths are bounded by 2‖D_mV_mᵀu‖₁ + 2R_m‖u‖₁; a conservative enclosing ellipsoid is E(2(AAᵀ + NR_m²I)) (C7Le); exact axes hold only at Gauss–Chebyshev nodes (C7Li); the analyticity link is the exact even-periodic equivalence (C7Lh); d_m ≤ R_m (C7Lk); everything is set-level and reparametrization-invariant (C7Lo). Status KNOWN-REFORMULATION, transfer depth RESTRICTED STRUCTURAL CONNECTION, upper bound only",
     OK['p'])
OK['q'] = OK['m']
card("C7Lq", "[C7-F(raw) final status: FAIL] a universal, chart-independent implication 'output coefficient decay ⟹ raw Fisher eigenvalue decay' cannot hold: reparametrizations that keep the function set rescale or reshape the raw Fisher spectrum arbitrarily (C7Lm), while every output-side object is unchanged (C7Lo). The original C7 hypothesis is kept in the registry; this FAIL is about its raw-spectrum reading",
     OK['q'])
OK['r'] = OK['n'] and OK['l']
card("C7Lr", "[C7-F(inv) final status: OPEN] an invariant spectral comparison needs independently supplied structure (a parameter metric h as a tensor and a prediction metric W, or a geometric prediction-space width; C7Ln); no such structure is supplied by the model and no theorem in the repository relates coefficient decay to an invariant local spectrum. An envelope alone also gives no lower bound (C7Ll). C7-F(inv) stays OPEN as a separate future question",
     OK['r'])
