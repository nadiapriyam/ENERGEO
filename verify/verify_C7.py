"""C7: first construction pass (2026-11-15). Fourier / Chebyshev coefficient decay → prediction-space enclosure.

Tests the chain
  C7-A  Chebyshev coefficients of f(x) = cosine-Fourier coefficients of F(φ) = f(cos φ)  (exact identity)
  C7-B  a uniform coefficient envelope on the Fourier side is the same envelope on the Chebyshev side
  C7-C  a uniform envelope bounds the model image Y(Θ) ⊆ ℝᴺ inside an enclosing set (Quinn et al. 2019, as read
        from arXiv v1; research/sources/quinn2019.md), with explicit constants, and only as an UPPER bound.
Every counterexample is kept. Sources: Quinn, Wilber, Townsend, Sethna 2019 (arXiv v1); Trefethen, Approximation
Theory and Approximation Practice (2013), Ch. 3, 8 (cited by Quinn; not opened here).
Run: python3 verify/verify_C7.py"""
import numpy as np
import mpmath as mp
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


OK = {}
T = lambda k, x: np.cos(k * np.arccos(np.clip(x, -1, 1)))                     # T_k(x) = cos(k arccos x)
def cheb(f, K, n=512):
    """Chebyshev coefficients a_0..a_{K-1} of f via the cosine transform of F(φ) = f(cos φ) (Gauss–Chebyshev nodes)."""
    ph = np.pi * (np.arange(n) + 0.5) / n
    F = f(np.cos(ph))
    a = np.array([2.0 / n * np.sum(F * np.cos(k * ph)) for k in range(K)])
    a[0] /= 2
    return a
def V(x, m):
    return np.array([[T(k, xi) for k in range(m)] for xi in x])                 # evaluation matrix V_ik = T_k(x_i)
cheb_nodes = lambda N: np.cos((2 * np.arange(1, N + 1) - 1) * np.pi / (2 * N))
def extent(P, u):
    s = P @ u
    return s.max() - s.min()

# ── C7a: the identity T_k(cos φ) = cos(kφ) ─────────────────────────────────────────────────────
phi, k = sp.symbols('phi k', real=True)
small = all(sp.simplify(sp.expand_trig(sp.cos(j * phi)) - sp.chebyshevt(j, sp.cos(phi))) == 0 for j in range(0, 13))
recur = sp.simplify((sp.cos((k + 1) * phi) + sp.cos((k - 1) * phi) - 2 * sp.cos(phi) * sp.cos(k * phi)).rewrite(sp.exp).expand()) == 0
OK['a'] = small and recur
card("C7a", "[C7-A | identity] T_k(cos φ) = cos(kφ): checked symbolically for k = 0…12, and for every k by induction: T_0 = 1, T_1(x) = x, and T_{k+1} = 2xT_k − T_{k−1} matches cos((k+1)φ) + cos((k−1)φ) = 2 cos φ cos(kφ) (symbolic in k). Hence f(x) = Σ a_k T_k(x) on [−1, 1] ⟺ F(φ) = f(cos φ) = Σ a_k cos(kφ): the Chebyshev series of f is the cosine-Fourier series of the even, 2π-periodic F, with the same coefficients",
     OK['a'])

# ── C7b: normalization ─────────────────────────────────────────────────────────────────────────
mp.mp.dps = 30
f2 = lambda x: 1 / (2 - x)
s3 = mp.sqrt(3)
closed = lambda kk: (1 / s3) if kk == 0 else (2 / s3) * (2 - s3)**kk
ax = lambda kk: (1 if kk == 0 else 2) / mp.pi * mp.quad(lambda x: f2(x) * mp.chebyt(kk, x) / mp.sqrt(1 - x**2), [-1, 1])
aphi = lambda kk: (1 if kk == 0 else 2) / mp.pi * mp.quad(lambda p: f2(mp.cos(p)) * mp.cos(kk * p), [0, mp.pi])
Fhat = lambda kk: 1 / (2 * mp.pi) * mp.quad(lambda p: f2(mp.cos(p)) * mp.exp(-1j * kk * p), [-mp.pi, mp.pi])
errs = max(max(abs(ax(kk) - closed(kk)), abs(aphi(kk) - closed(kk))) for kk in range(9))
ferr = max(abs(Fhat(kk) - closed(abs(kk)) / 2) for kk in (-3, -1, 1, 2, 5)) + abs(Fhat(0) - closed(0))
errx = max(abs(ax(kk) - closed(kk)) for kk in range(9)); errp = max(abs(aphi(kk) - closed(kk)) for kk in range(9))
OK['b'] = errx < 1e-14 and errp < 1e-25 and ferr < 1e-25
card("C7b", f"[C7-A | normalization] with a_0 = (1/π)∫₀^π F(φ) dφ and a_k = (2/π)∫₀^π F(φ) cos(kφ) dφ (k ≥ 1), equivalently a_k = (2/π)∫₋₁¹ f(x)T_k(x)/√(1 − x²) dx (dx/√(1 − x²) = −dφ), the coefficients of f(x) = 1/(2 − x) are a_0 = 1/√3, a_k = (2/√3)(2 − √3)^k (both integrals agree with the closed form for k = 0…8: φ-integral error {float(errp):.0e}, x-integral {float(errx):.0e}, limited by the endpoint singularity of the quadrature). The complex Fourier coefficients of F are F̂(0) = a_0 and F̂(±k) = a_k/2 (k ≥ 1): the factor 2 and the halved a_0 are the only convention differences",
     OK['b'])

# ── C7c: Bernstein ellipse ⟺ Fourier strip; Theorem 1(ii) instance ─────────────────────────────
x, y, eta = sp.symbols('x y eta', real=True)
w = sp.cos(x + sp.I * eta)
re, im = sp.re(sp.expand_complex(w)), sp.im(sp.expand_complex(w))
ell = sp.simplify((re / sp.cosh(eta))**2 + (im / sp.sinh(eta))**2 - 1) == 0
summ = sp.simplify((sp.cosh(eta) + sp.sinh(eta)).rewrite(sp.exp) - sp.exp(eta)) == 0
eta_star = mp.acosh(2)
rho_star = mp.e**eta_star
rho = 3
vertex = (rho + 1 / rho) / 2
Mtheta = np.linspace(0, 2 * np.pi, 20001)
ellpts = 0.5 * (rho * np.exp(1j * Mtheta) + np.exp(-1j * Mtheta) / rho)
M = np.max(np.abs(1 / (2 - ellpts)))
coef = [float(closed(kk)) for kk in range(31)]
thm1 = coef[0] <= M and all(coef[kk] <= 2 * M * rho**(-kk) for kk in range(1, 31))
OK['c'] = ell and summ and abs(rho_star - (2 + s3)) < 1e-25 and abs(M - 1 / (2 - vertex)) < 1e-6 and thm1
card("C7c", f"[C7-B | Fourier strip ⟺ Bernstein ellipse] x = cos(φ + iη) = cos φ cosh η − i sin φ sinh η traces the Bernstein ellipse with semi-axes cosh η, sinh η, whose sum is e^η = ρ (symbolic). So 'f analytic in E_ρ with |f| ≤ M' (Quinn, Theorem 1) is 'F(φ) = f(cos φ) analytic in the strip |Im φ| < log ρ with |F| ≤ M' (a Fourier statement). For f = 1/(2 − x) the pole x = 2 = cos(iη*) gives ρ* = e^{{η*}} = 2 + √3, exactly the decay ratio of C7b. Theorem 1(ii) instance at ρ = 3: M = max_(E_3)|f| = {M:.6g} = 1/(2 − 5/3), and |a_0| ≤ M, |a_k| ≤ 2Mρ^(−k) for k = 1…30",
     OK['c'])

# ── C7d: pointwise decay vs a uniform envelope (counterexample A) ───────────────────────────────
mp.mp.dps = 20
ja = abs(2 / mp.pi * mp.quad(lambda p: mp.cos(5 * mp.cos(p)) * mp.cos(4 * p), [0, mp.pi]) - 2 * mp.besselj(4, 5)) < 1e-15
pointwise = abs(2 * mp.besselj(30, 5)) < 1e-10
grid = np.arange(0, 300, 0.05)
sup40 = max(abs(2 * float(mp.besselj(40, th))) for th in grid[(grid > 30) & (grid < 70)])
xs = np.array([0.13, 0.29, 0.47, 0.61, 0.83, 0.97])
def cloud(th):
    P = np.cos(np.outer(th, xs)); P = P - P.mean(0)
    return np.linalg.svd(P, compute_uv=False)
s_wide, s_narrow = cloud(np.arange(0, 400, 0.01)), cloud(np.linspace(0, 1, 4001))
OK['d'] = ja and pointwise and sup40 > 0.3 and s_wide[-1] / s_wide[0] > 0.1 and s_narrow[-1] / s_narrow[0] < 1e-5
card("C7d", f"[uniformity | counterexample A] f_θ(x) = cos(θx) has Chebyshev coefficients a_2m = 2(−1)^m J_2m(θ) (Jacobi–Anger; checked at θ = 5), so each member decays super-geometrically (|a_30(5)| < 1e−10). But over θ ∈ [0, 300] there is no uniform fast envelope: sup_θ |a_40(θ)| = {sup40:.3f}, so a geometric envelope Cρ^(−k) would need C ≥ {sup40:.2f}·ρ^40. The image at 6 sample points does not form a width hierarchy: for θ ∈ [0, 400] the point cloud has σ_6/σ_1 = {s_wide[-1] / s_wide[0]:.3f}, while for θ ∈ [0, 1] (where a uniform envelope exists) it is {s_narrow[-1] / s_narrow[0]:.1e}. Pointwise spectral decay is not sufficient; C7 needs a family-wide envelope sup_θ |a_k(θ)| ≤ r_k",
     OK['d'])

# ── C7e: a uniform coefficient envelope ───────────────────────────────────────────────────────
ak = lambda th, kk: (1 / np.sqrt(th**2 - 1)) if kk == 0 else 2 / np.sqrt(th**2 - 1) * (th - np.sqrt(th**2 - 1))**kk
num = cheb(lambda xx: 1 / (2.5 - xx), 12)
form_ok = np.max(np.abs(num - np.array([ak(2.5, kk) for kk in range(12)]))) < 1e-12
thg = np.linspace(2, 3, 1001)
env_ok = all(np.argmax([ak(t_, kk) for t_ in thg]) == 0 for kk in range(12))
OK['e'] = form_ok and env_ok
card("C7e", "[C7-B | envelope] for the family f_θ(x) = 1/(θ − x), θ ∈ [2, 3]: a_0(θ) = 1/√(θ² − 1), a_k(θ) = (2/√(θ² − 1))(θ − √(θ² − 1))^k (checked against the cosine transform at θ = 2.5); for every k = 0…11 the supremum over θ is attained at θ = 2, so the family has the uniform envelope r_k = a_k(2) = (2/√3)(2 − √3)^k (r_0 = 1/√3). The envelope is a property of the set of functions, not of any one member",
     OK['e'])

# ── C7f: evaluation operator ──────────────────────────────────────────────────────────────────
rng = np.random.default_rng(7)
xr = np.sort(rng.uniform(-1, 1, 8)); m = 5
r = np.array([ak(2, kk) for kk in range(40)])
R = lambda mm: r[mm:].sum() + r[-1] * (2 - np.sqrt(3)) / (1 - (2 - np.sqrt(3)))   # tail Σ_{k≥m} r_k (closed geometric remainder)
Vm = V(xr, m)
dev = 0.0
for th in np.linspace(2, 3, 201):
    a = np.array([ak(th, kk) for kk in range(m)])
    e = 1 / (th - xr) - Vm @ a
    dev = max(dev, np.max(np.abs(e)))
lin = np.max(np.abs(V(xr, 3) @ np.array([0.3, -0.2, 0.1]) - (0.3 - 0.2 * xr + 0.1 * (2 * xr**2 - 1)))) < 1e-14
OK['f'] = lin and dev <= R(m) + 1e-15
card("C7f", f"[C7-C | evaluation operator] at sample points x_1…x_N, the truncated part p_(m−1)(θ) = Σ_(k<m) a_k(θ)T_k evaluates as V_m a(θ) with V_ik = T_k(x_i) (exact for polynomials); the full prediction is Y(θ) = V_m a(θ) + e(θ) with every |e_i(θ)| ≤ R_m = Σ_(k≥m) r_k. For 1/(θ − x), N = 8 random points, m = 5: max |e_i| = {dev:.3e} ≤ R_5 = {R(5):.3e}. So Y(Θ) ⊆ V_m Q_m ⊕ [−R_m, R_m]^N, Q_m = {{|a_k| ≤ r_k}}",
     OK['f'])

# ── C7g: coefficient set: box vs ball ─────────────────────────────────────────────────────────
N = 8; xc = cheb_nodes(N); Dm = np.diag(r[:N]); VD = V(xc, N) @ Dm
U, sig, _ = np.linalg.svd(VD)
hZ = lambda u: np.sum(np.abs(VD.T @ u))                       # support function of the zonotope VD·[−1, 1]^m
hE = lambda u: np.sqrt(N) * np.linalg.norm(VD.T @ u)          # ellipsoid VD·{‖z‖ ≤ √m} contains the box image
dirs = rng.normal(size=(2000, N)); dirs /= np.linalg.norm(dirs, axis=1)[:, None]
contain = all(hZ(u) <= hE(u) + 1e-15 for u in dirs)
ratio1 = hZ(U[:, 0]) / hE(U[:, 0])
corner = np.sqrt(1 + 4 * (N - 1))                             # Quinn: |c̃_0| ≤ M, |c̃_j| ≤ 2M (M = 1)
OK['g'] = contain and ratio1 < 0.99 and abs(np.linalg.norm(np.r_[1, 2 * np.ones(N - 1)]) - np.sqrt(4 * N - 3)) < 1e-12
card("C7g", f"[C7-C | box vs ball] coordinatewise bounds |a_k| ≤ r_k define a box; its image under V is a zonotope Z = VD·[−1, 1]^m with support function h_Z(u) = ‖DVᵀu‖₁, not an ellipsoid. Relaxing the box to the ball ‖z‖₂ ≤ √m costs the factor √m: h_Z(u) ≤ √m‖DVᵀu‖₂ = h_E(u) (2000 directions, N = m = 8), and along the first principal axis h_Z/h_E = {ratio1:.3f} < 1, so the end of that axis lies in E but not in Z. Quinn's box |c̃_0| ≤ M, |c̃_j| ≤ 2M has largest norm M√(4N − 3) at a corner; the stated radius 4M√(4N − 3) is valid but loose by 4; Eq. (8) uses M√(4N − 3)",
     OK['g'])

# ── C7h: ellipsoid axes; singular-value bounds ────────────────────────────────────────────────
X = np.random.default_rng(3)
axes_ok = all(abs(np.linalg.norm(VD.T @ U[:, j]) - sig[j]) < 1e-12 for j in range(N))
rho2 = 2.0; N2 = 12
J_r = V(np.sort(X.uniform(-1, 1, N2)), N2); D2 = np.diag(rho2**-np.arange(N2))
s_r = np.linalg.svd(J_r @ D2, compute_uv=False)
quinn_bd = [np.sqrt(N2) * rho2**(-j + 2) / np.sqrt(rho2**2 - 1) for j in range(1, N2 + 1)]
thm2 = all(s_r[j - 1] <= quinn_bd[j - 1] * (1 + 1e-12) for j in range(2, N2 + 1))
J_c = V(cheb_nodes(N2), N2)
orth = np.allclose(J_c.T @ J_c, np.diag([N2] + [N2 / 2] * (N2 - 1)))
s_c = np.linalg.svd(J_c @ D2, compute_uv=False)
exact = abs(s_c[0] - np.sqrt(N2)) < 1e-12 and all(abs(s_c[j - 1] - np.sqrt(N2 / 2) * rho2**(-(j - 1))) < 1e-12 for j in range(2, N2 + 1))
simple = all(s_r[j] <= np.linalg.norm(J_r, 2) * rho2**(-j) * (1 + 1e-12) for j in range(N2))
loose = quinn_bd[3] / s_c[3]
OK['h'] = axes_ok and thm2 and orth and exact and simple
card("C7h", f"[C7-C | axes] the ball of radius r maps under X to an ellipsoid with semi-axes rσ_j(X) (support function r‖Xᵀu_j‖ = rσ_j). Quinn's bound σ_j(JD) ≤ √N ρ^(−j+2)/√(ρ² − 1), j ≥ 2, holds at 12 random nodes (ρ = 2); the elementary bound σ_j(VD) ≤ ‖V‖₂ σ_j(D) holds as well. At Chebyshev nodes x_i = cos((2i − 1)π/2N), which are equally spaced in φ, discrete cosine orthogonality gives JᵀJ = diag(N, N/2, …, N/2), so the axes are EXACT: σ_1 = √N, σ_j = √(N/2)ρ^(−(j−1)) (j ≥ 2); Quinn's bound is loose there by {loose:.3f} = √2ρ/√(ρ² − 1)",
     OK['h'])

# ── C7i: approximation error ──────────────────────────────────────────────────────────────────
xg = np.linspace(-1, 1, 4001)
worst = []
for mm in range(1, 11):
    e_ = 0.0
    for th in np.linspace(2, 3, 101):
        a = np.array([ak(th, kk) for kk in range(mm)])
        e_ = max(e_, np.max(np.abs(1 / (th - xg) - V(xg, mm) @ a)))
    worst.append(e_)
Rm = [R(mm) for mm in range(1, 11)]
quinn_i = [2 * 3 * 3.0**(-mm + 1) / (3 - 1) for mm in range(1, 11)]      # Theorem 1(i) with ρ = 3, M = 3
OK['i'] = all(wv <= Rv * (1 + 1e-9) for wv, Rv in zip(worst, Rm)) and all(Rv <= qv for Rv, qv in zip(Rm, quinn_i))
card("C7i", f"[C7-C | approximation error] a uniform envelope gives sup_θ ‖f_θ − p_(m−1)(θ)‖∞ ≤ R_m = Σ_(k≥m) r_k (|T_k| ≤ 1; the Chebyshev series of a continuous f with summable coefficients converges uniformly to f). For 1/(θ − x), θ ∈ [2, 3]: the worst sup-error over θ is ≤ R_m for m = 1…10 (m = 5: {worst[4]:.3e} ≤ {Rm[4]:.3e}). For a geometric envelope r_k = 2Mρ^(−k) this is R_m = 2Mρ^(1−m)/(ρ − 1), Quinn's Theorem 1(i); here it is also below the ρ = 3, M = 3 instance of that bound",
     OK['i'])

# ── C7j: Quinn Eq. (2), error term ────────────────────────────────────────────────────────────
rr, eps = 1.0, 0.1
J2 = np.array([[1.0, -1.0], [1.0, 1.0]])                      # T_0, T_1 at x = −1, 1
s2 = np.linalg.svd(J2, compute_uv=False)                       # (√2, √2)
c0 = 0.999 * rr
Ystar = (c0 + eps) * np.array([1.0, 1.0])                      # f(x) = c0 + ε T_2(x); T_2(±1) = 1; truncation p_1 = c0
claimed = rr * s2[0] + eps                                     # semi-axis of the Eq. (2) hyperellipsoid (a disk here)
out = np.linalg.norm(Ystar) > claimed
u = np.array([1.0, 1.0]) / np.sqrt(2)
dir_ok = abs(u @ Ystar) <= rr * s2[0] + eps * np.abs(u).sum() + 1e-15
semi = np.sqrt(2) * np.sqrt(rr**2 * s2**2 + 2 * eps**2)
cpts = []
for _ in range(20000):
    b = rng.normal(size=2); b *= rr * rng.uniform() ** 0.5 / np.linalg.norm(b)
    e2 = rng.uniform(-eps, eps)
    cpts.append(J2 @ b + e2 * np.array([1.0, 1.0]))
cpts = np.array(cpts)
inside = np.all(np.sum((cpts / semi)**2, axis=1) <= 1 + 1e-12)
OK['j'] = out and dir_ok and inside
card("C7j", f"[C7-C | Quinn Eq. (2), error term] exact family at N = 2 points x = ±1 (K = 2 ≤ N): f(x) = c_0 + e T_2(x) with |c_0| < r, |e| ≤ ε, so p_1 = c_0 and ‖f − p_1‖∞ = |e|. With r = 1, ε = 0.1, X = J has σ_1 = σ_2 = √2, so Eq. (2)'s hyperellipsoid is the disk of radius rσ + ε = {claimed:.4f}; the model point (c_0 + ε)(1, 1) with c_0 = 0.999 has norm {np.linalg.norm(Ystar):.4f}: outside. The sup-norm error is a box [−ε, ε]^N (Euclidean radius √N ε), and an ellipsoid ⊕ box is not the ellipsoid with additively enlarged axes. Valid replacements: (1) extent along the j-th axis u_j of H_P ≤ 2rσ_j + 2ε‖u_j‖₁ (≤ 2rσ_j + 2√N ε): equality is attained here; (2) Y ⊆ the ellipsoid with semi-axes √2·√(r²σ_j² + Nε²) (support functions; 20000 random family points inside)",
     OK['j'])

# ── C7k: reparametrization invariance of the enclosure; Fisher contrast ───────────────────────
phg = np.linspace(0, 1, 1001)
env_theta = np.array([max(ak(t_, kk) for t_ in np.linspace(2, 3, 1001)) for kk in range(10)])
env_phi = np.array([max(ak(2 + p_**3, kk) for p_ in phg) for kk in range(10)])
same = np.max(np.abs(env_theta - env_phi)) < 1e-14
xs8 = cheb_nodes(8)
dY = lambda th: 1 / (th - xs8)**2                               # ∂f_θ/∂θ at the sample points (sign irrelevant)
p0 = 0.5; th0 = 2 + p0**3
g_theta = float(dY(th0) @ dY(th0)); g_phi = float((3 * p0**2)**2 * g_theta)
OK['k'] = same and abs(g_phi / g_theta - 0.5625) < 1e-12
card("C7k", f"[C7-C | reparametrization] the hypotheses (a uniform envelope over the SET {{f_θ}}) and the enclosure (V, D, R_m) do not involve θ-coordinates: for 1/(θ − x) charted by θ ∈ [2, 3] or by θ = 2 + φ³, φ ∈ [0, 1], the envelopes agree to 1e−14 for k = 0…9, so W_j^bound is unchanged. The Fisher metric at the same point is not: g_φ/g_θ = (dθ/dφ)² = {g_phi / g_theta:.4f} at φ = 0.5. The enclosure is a prediction-space object; Fisher eigenvalues are chart-dependent (MMIb)",
     OK['k'])

# ── C7l: metric dependence (counterexample B) ─────────────────────────────────────────────────
Wh = np.diag([1.0] * 7 + [1000.0])                              # W^(1/2): weight 10⁶ on one sample
s_e = np.linalg.svd(VD, compute_uv=False); s_w = np.linalg.svd(Wh @ VD, compute_uv=False)
bound_w = all(s_w[j] <= np.linalg.norm(Wh @ V(xc, N), 2) * r[j] * (1 + 1e-12) for j in range(N))
OK['l'] = bound_w and s_w[0] / s_e[0] > 100 and abs((s_w[1] / s_w[0]) / (s_e[1] / s_e[0]) - 1) > 0.5
card("C7l", f"[metric dependence | counterexample B] the same envelope and sample points under the prediction metric W = diag(1, …, 1, 10⁶): σ_1 grows by {s_w[0] / s_e[0]:.0f}× and the ratio σ_2/σ_1 moves from {s_e[1] / s_e[0]:.3e} to {s_w[1] / s_w[0]:.3e}: the apparent hierarchy changes. What survives is the upper bound σ_j(W^(1/2)VD) ≤ ‖W^(1/2)V‖₂ r_(j): the envelope's rate with a metric-dependent constant. Widths are prediction-metric dependent",
     OK['l'])

# ── C7m: sampling dependence (counterexample C) ───────────────────────────────────────────────
N3 = 10
flatC = np.linalg.svd(V(cheb_nodes(N3), N3), compute_uv=False)
flatK = np.linalg.svd(V(np.linspace(0.9, 1.0, N3), N3), compute_uv=False)
OK['m'] = abs(flatC[-1] / flatC[0] - 1 / np.sqrt(2)) < 1e-12 and flatK[-1] / flatK[0] < 1e-8
card("C7m", f"[sampling dependence | counterexample C] with NO coefficient decay (r_k ≡ 1), the evaluation matrix alone decides: at 10 Chebyshev nodes σ_10/σ_1 = 1/√2 (no hierarchy), at 10 points clustered in [0.9, 1] σ_10/σ_1 = {flatK[-1] / flatK[0]:.1e}. Finite-N prediction-space axes depend strongly on where the model is sampled",
     OK['m'])

# ── C7n: sufficient, not necessary ────────────────────────────────────────────────────────────
N4 = 25; x4 = cheb_nodes(N4)
P20 = np.outer(np.linspace(0, 1, 501), T(20, x4)); P20 -= P20.mean(0)
s20 = np.linalg.svd(P20, compute_uv=False)
a20 = cheb(lambda xx: T(20, xx), 26)
OK['n'] = s20[1] / s20[0] < 1e-12 and abs(a20[20] - 1) < 1e-12 and np.max(np.abs(np.delete(a20, 20))) < 1e-12 and OK['m']
card("C7n", "[direction of implication] a uniform envelope is SUFFICIENT for the enclosure bound; it is not necessary for a width hierarchy. (1) f_θ = θT_20(x), θ ∈ [0, 1]: the image at 25 Chebyshev nodes is a segment (one nonzero width, σ_2/σ_1 < 1e−12), yet the envelope is r_20 = 1 and 0 elsewhere: hierarchy with no coefficient decay. (2) C7m: clustered sampling produces a hierarchy from a flat envelope. Hierarchies can arise for reasons unrelated to Fourier / Chebyshev smoothness",
     OK['n'])

# ── C7o: thin family, weak decay (counterexample E) ───────────────────────────────────────────
N5 = 16; x5 = cheb_nodes(N5)
aabs = cheb(np.abs, 40)
ak_abs = lambda kk: 2 / np.pi if kk == 0 else (0 if kk % 2 else (-1)**(kk // 2 + 1) * 4 / (np.pi * (kk**2 - 1)))
form_abs = np.max(np.abs(aabs - np.array([ak_abs(kk) for kk in range(40)]))) < 1e-5
Pabs = np.outer(np.linspace(0, 1, 501), np.abs(x5)); Pabs -= Pabs.mean(0)
sabs = np.linalg.svd(Pabs, compute_uv=False)
rabs = np.abs([ak_abs(kk) for kk in range(N5)])
sb = np.linalg.svd(V(x5, N5) @ np.diag(rabs), compute_uv=False)
OK['o'] = form_abs and sabs[1] / sabs[0] < 1e-12 and sb[1] / sb[0] > 1e-2
card("C7o", f"[upper bound only | counterexample E] f_θ(x) = θ|x|, θ ∈ [0, 1]: the coefficients of |x| decay only like k^(−2) (a_0 = 2/π, a_2m = (−1)^(m+1)·4/(π(4m² − 1))), so the enclosure's axes decay slowly (σ_2/σ_1 = {sb[1] / sb[0]:.3f} for VD at 16 Chebyshev nodes); the actual image is a segment (σ_2/σ_1 < 1e−12). Weak spectral decay does not imply a wide image: the bound is an upper bound, not the width spectrum",
     OK['o'])

# ── C7p: strong decay, correlated coefficients (counterexample F) ──────────────────────────────
rho3 = 2.0; N6 = 10; x6 = cheb_nodes(N6)
gen = lambda th, xx: (1 - (th / rho3) * xx) / (1 - 2 * (th / rho3) * xx + (th / rho3)**2)     # Σ (θ/ρ)^k T_k(x)
gen_ok = np.max(np.abs(cheb(lambda xx: gen(0.7, xx), 30) - (0.7 / rho3)**np.arange(30))) < 1e-12
rp = rho3**-np.arange(80); Rp = lambda mm: rp[mm:].sum()
VDp = V(x6, N6) @ np.diag(rp[:N6]); Up, sp_, _ = np.linalg.svd(VDp)
Pp = np.array([gen(th, x6) for th in np.linspace(-1, 1, 2001)])
act = np.array([extent(Pp, Up[:, j]) for j in range(N6)])
bnd = np.array([2 * np.sum(np.abs(VDp.T @ Up[:, j])) + 2 * Rp(N6) * np.abs(Up[:, j]).sum() for j in range(N6)])
cl = np.linalg.svd(Pp - Pp.mean(0), compute_uv=False)
OK['p'] = gen_ok and np.all(act <= bnd + 1e-12) and act[2] / bnd[2] < 0.5 and cl[5] / cl[0] < 0.1 * sp_[5] / sp_[0]
card("C7p", f"[enclosure ≠ manifold width | counterexample F] a_k(θ) = (θ/ρ)^k, θ ∈ [−1, 1], ρ = 2, i.e. f_θ(x) = (1 − (θ/ρ)x)/(1 − 2(θ/ρ)x + (θ/ρ)²) (Chebyshev generating function; checked at θ = 0.7): strong decay, but the coefficients are correlated and fill only a curve inside the envelope box. At 10 Chebyshev nodes, the image's extent along each axis of the enclosure is below the bound (zonotope + 2R_m‖u‖₁ error term) for all 10 axes, but along axis 3 it is only {act[2] / bnd[2]:.3f} of it. The image is a 1-parameter curve whose own point-cloud spectrum decays faster than the enclosure's axis ratios (j = 6: σ_6/σ_1 = {cl[5] / cl[0]:.1e} for the curve vs {sp_[5] / sp_[0]:.1e} for the enclosure)",
     OK['p'])

# ── C7q: actual extents vs W_j^bound ──────────────────────────────────────────────────────────
N7 = 8; x7 = cheb_nodes(N7)
VDq = V(x7, N7) @ np.diag(r[:N7]); Uq, sq, _ = np.linalg.svd(VDq)
Pq = np.array([1 / (th - x7) for th in np.linspace(2, 3, 2001)])
actq = np.array([extent(Pq, Uq[:, j]) for j in range(N7)])
bndq = np.array([2 * np.sum(np.abs(VDq.T @ Uq[:, j])) + 2 * R(N7) * np.abs(Uq[:, j]).sum() for j in range(N7)])
clq = np.linalg.svd(Pq - Pq.mean(0), compute_uv=False)
OK['q'] = np.all(actq <= bndq + 1e-12) and clq[1] / clq[0] < 0.05 and np.max(actq / bndq) < 0.5
card("C7q", f"[actual width vs W_j^bound] for 1/(θ − x), θ ∈ [2, 3], at 8 Chebyshev nodes: along every principal axis u_j of the enclosure, the actual extent of the model image E_j = sup_(θ,θ′) u_j·(Y(θ) − Y(θ′)) is ≤ W_j^bound = 2h_Z(u_j) + 2R_m‖u_j‖₁ on all 8 axes, with E_j/W_j^bound between {np.min(actq / bndq):.2f} and {np.max(actq / bndq):.2f}: the bound overestimates by 2× or more on every axis. The image is close to a curve (point-cloud σ_2/σ_1 = {clq[1] / clq[0]:.3f}, σ_3/σ_1 = {clq[2] / clq[0]:.1e}). Three objects stay distinct: the actual image's extents, the enclosing set, and the bound on its widths",
     OK['q'])

# ── C7r: the direct periodic Fourier route ────────────────────────────────────────────────────
N8 = 16; K8 = 7
tt = 2 * np.pi * np.arange(N8) / N8
ks = np.arange(-K8, K8 + 1)
Fm = np.exp(1j * np.outer(tt, ks))
rr8 = 0.6**np.abs(ks)
orth8 = np.allclose(Fm.conj().T @ Fm, N8 * np.eye(len(ks)))
s8 = np.linalg.svd(Fm @ np.diag(rr8), compute_uv=False)
exact8 = np.allclose(np.sort(s8)[::-1], np.sqrt(N8) * np.sort(rr8)[::-1])
tn = np.sort(rng.uniform(0, 2 * np.pi, N8)); Fn = np.exp(1j * np.outer(tn, ks))
sn = np.linalg.svd(Fn @ np.diag(rr8), compute_uv=False)
bdn = all(sn[j] <= np.linalg.norm(Fn, 2) * np.sort(rr8)[::-1][j] * (1 + 1e-12) for j in range(len(ks)))
alias = np.allclose(np.exp(1j * tt * (3 + N8)), np.exp(1j * tt * 3))
OK['r'] = orth8 and exact8 and bdn and not np.allclose(np.sort(sn)[::-1], np.sqrt(N8) * np.sort(rr8)[::-1]) and alias
card("C7r", "[direct periodic route] for 2π-periodic f_θ(t) = Σ f̂_θ(k)e^(ikt) with |f̂_θ(k)| ≤ r_|k| uniformly, at N equally spaced samples the Fourier evaluation matrix has orthogonal columns (FᴴF = N·I for 2K + 1 ≤ N), so the ellipsoid axes are EXACTLY √N × the sorted envelope (each r_k twice, for ±k). At non-uniform samples only σ_j(FD) ≤ ‖F‖₂ r_(j) holds, without equality. Modes |k| ≥ N alias onto lower ones (e^(i(k+N)t_j) = e^(ikt_j)), so the tail must be counted as error. This is discrete Fourier orthogonality plus a singular-value inequality: elementary, not a new theorem",
     OK['r'])

# ── C7s: function-space and N-independent statement ──────────────────────────────────────────
okN = True; rows = []
for NN in (8, 32, 128):
    xn = cheb_nodes(NN); Vm5 = V(xn, 5)
    Qm, _ = np.linalg.qr(Vm5)
    dmax = 0.0
    for th in np.linspace(2, 3, 201):
        yv = 1 / (th - xn); dmax = max(dmax, np.linalg.norm(yv - Qm @ (Qm.T @ yv)))
    rows.append(dmax / np.sqrt(NN))
    okN &= dmax <= np.sqrt(NN) * R(5) + 1e-15
OK['s'] = okN and max(rows) <= R(5)
card("C7s", f"[function space; N-dependence] the uniform envelope gives an N-independent statement: every f_θ lies within sup-norm distance R_m of the m-dimensional polynomial space Π_(m−1), so the Kolmogorov m-width d_m({{f_θ}}; C[−1, 1]) ≤ R_m. At N samples (Euclidean) the distance of Y(θ) to range(V_m) is ≤ √N·R_m; in the RMS metric ‖·‖₂/√N it is ≤ R_m for every N (1/(θ − x), m = 5: {rows[0]:.2e}, {rows[1]:.2e}, {rows[2]:.2e} ≤ R_5 = {R(5):.2e} at N = 8, 32, 128). A finite-N bound with a √N factor is not, by itself, an infinite-dimensional theorem; the function-space statement is the N-free one",
     OK['s'])

# ── C7t: the project's own model F-C ─────────────────────────────────────────────────────────
Lam = 4.0
def single(s, kk):                                               # coefficients of e^(−θ(x+1)/2) = e^(−s)·e^(−s x), s = θ/2
    return float(mp.e**(-s) * (mp.besseli(0, s) if kk == 0 else 2 * (-1)**kk * mp.besseli(kk, s)))
chk = np.max(np.abs(cheb(lambda xx: np.exp(-1.3 * (xx + 1) / 2), 10) - np.array([single(0.65, kk) for kk in range(10)]))) < 1e-12
mk = 40
env1 = np.array([max(abs(single(s, kk)) for s in np.linspace(0, Lam / 2, 401)) for kk in range(mk)])
rFC = 2 * env1                                                   # two exponential terms
RFC = lambda mm: rFC[mm:].sum()
N9 = 8; x9 = cheb_nodes(N9)
VD9 = V(x9, N9) @ np.diag(rFC[:N9]); U9, s9, _ = np.linalg.svd(VD9)
thg2 = np.linspace(0, Lam, 81)
P9 = np.array([np.exp(-a1 * (x9 + 1) / 2) + np.exp(-a2 * (x9 + 1) / 2) for a1 in thg2 for a2 in thg2])
act9 = np.array([extent(P9, U9[:, j]) for j in range(N9)])
bnd9 = np.array([2 * np.sum(np.abs(VD9.T @ U9[:, j])) + 2 * RFC(N9) * np.abs(U9[:, j]).sum() for j in range(N9)])
OK['t'] = chk and np.all(act9 <= bnd9 + 1e-12) and rFC[10] < 1e-6 * rFC[1]
card("C7t", f"[the project's model F-C] y_θ(t) = e^(−θ₁t) + e^(−θ₂t), t ∈ [0, 1] (x = 2t − 1), θ ∈ [0, 4]² (a bounded domain is needed for a uniform envelope): the coefficients of e^(−s(x+1)) are e^(−s)I_0(s) and 2(−1)^k e^(−s)I_k(s) (checked), the uniform envelope r_k = 2·sup_s |…| decays super-geometrically (r_10/r_1 = {rFC[10] / rFC[1]:.1e}), and at 8 Chebyshev nodes the extent of the F-C image along every axis of the enclosure is below W_j^bound (all 8 axes; e.g. axis 2: {act9[1]:.3e} ≤ {bnd9[1]:.3e}). The enclosure is the same for θ or log θ charts (C7k), unlike the Fisher eigenvalues (MMIb)",
     OK['t'])

# ── C7u: principal verdict ────────────────────────────────────────────────────────────────────
chain = OK['a'] and OK['b'] and OK['c'] and OK['e'] and OK['f'] and OK['h'] and OK['i'] and OK['s']
limits = OK['d'] and OK['j'] and OK['l'] and OK['m'] and OK['n'] and OK['o'] and OK['p'] and OK['q']
OK['u'] = chain and limits and OK['k'] and OK['g'] and OK['r'] and OK['t']
card("C7u", "[C7 verdict] principal status C7-KNOWN-REFORMULATION. The chain holds as a SUFFICIENT, UPPER-BOUND, restricted statement: cosine-Fourier coefficients of F_θ(φ) = f_θ(cos φ) are the Chebyshev coefficients of f_θ (exact; C7a, C7b); strip analyticity of F_θ is Bernstein-ellipse analyticity of f_θ (C7c); a FAMILY-WIDE envelope r_k ≥ sup_θ |a_k(θ)| (C7d, C7e) bounds the truncation error by R_m (C7i) and encloses Y(Θ) ⊆ ℝᴺ in V_m D_m·[−1, 1]^m ⊕ [−R_m, R_m]^N, whose widths are bounded by r_k and the evaluation operator (C7f–C7h, C7s), independently of the parameterization (C7k). Every ingredient is Quinn et al. 2019 plus standard approximation theory after x = cos φ. It is not necessary (C7n), not exact (C7o–C7q), metric- and sampling-dependent (C7l, C7m), and Quinn's Eq. (2) error term needs the correction of C7j",
     OK['u'])
