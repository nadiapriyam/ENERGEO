"""FB5–FB11: Foundation bridge cards outside the Fourier strand (Foundation Completion Pass 2, 2026-11-12).

FB5 → CF7 / CF6 (BR12): a Noether instance and the Hamiltonian identity, with assumptions.
FB6 → CF10 (BR16): the Fisher metric of a Gaussian-noise model is JᵀJ/σ².
FB7 → Z9 (BR17): model-manifold null directions; null vs sloppy; statistical null vs Lorentz null.
FB8 → MW2 (BR27): the ω–k form of the relativistic dispersion relation (an established ingredient only).
FB9 → CF6 / Part III symplectic row (BR29): alternating self-pairing zero ≠ Lorentz quadratic null.
FB10 → W1 / W2 (BR18): wavelet zero mean, admissibility, translation covariance and first-order invariance.
FB11 → M3, M2, H6: three reductions, each answering "what survives the reduction?".

Each card names its Foundation object or bridge, assumptions and failure condition. Theorems that are only
instanced here are credited to their sources in research/foundation_sources.md, not to the card.
The two numeric thresholds in FB11b were fixed in this file before it was first run.
Run: python3 verify/verify_FB5_FB11.py"""
import math
import sympy as sp
from sympy.stats import Normal, E as Exp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


# ── FB5: Noether instance (CF7) and the Hamiltonian identity (CF6) ────────────────────────────
tt, mass, eps = sp.symbols('t m epsilon', positive=True)
x, y = sp.Function('x')(tt), sp.Function('y')(tt)
V = sp.Function('V')
L = mass / 2 * (x.diff(tt)**2 + y.diff(tt)**2) - V(x**2 + y**2)
# first-order invariance of L under the rotation δ(x, y) = (−y, x), velocities rotated with it
Lrot = L.subs({x.diff(tt): x.diff(tt) - eps * y.diff(tt), y.diff(tt): y.diff(tt) + eps * x.diff(tt)}, simultaneous=True)
Lrot = Lrot.subs({x: x - eps * y, y: y + eps * x}, simultaneous=True)
dL = sp.simplify(sp.diff(Lrot, eps).subs(eps, 0))
Q = sp.diff(L, x.diff(tt)) * (-y) + sp.diff(L, y.diff(tt)) * x           # Noether charge p·δq
EL = {x.diff(tt, 2): sp.solve(sp.euler_equations(L, [x, y], tt)[0].lhs, x.diff(tt, 2))[0],
      y.diff(tt, 2): sp.solve(sp.euler_equations(L, [x, y], tt)[1].lhs, y.diff(tt, 2))[0]}
dQ = sp.simplify(Q.diff(tt).subs(EL))
card("FB5a", "[CF7 | BR12, Noether instance] L = (m/2)(ẋ² + ẏ²) − V(x² + y²) with V an arbitrary C¹ function: δL = 0 to first order under the rotation δ(x,y) = (−y, x), and the Noether charge Q = p·δq = m(xẏ − yẋ) has dQ/dt = 0 on every solution of the Euler–Lagrange equations. Assumptions: autonomous C² Lagrangian, one-parameter symmetry, on-shell. Noether's general theorem (fields, divergence symmetries) is cited, not carded",
     dL == 0 and sp.simplify(Q - mass * (x * y.diff(tt) - y * x.diff(tt))) == 0 and dQ == 0)

L2 = mass / 2 * (x.diff(tt)**2 + y.diff(tt)**2) - (x**2 + 2 * y**2)
EL2 = {x.diff(tt, 2): sp.solve(sp.euler_equations(L2, [x, y], tt)[0].lhs, x.diff(tt, 2))[0],
       y.diff(tt, 2): sp.solve(sp.euler_equations(L2, [x, y], tt)[1].lhs, y.diff(tt, 2))[0]}
Q2 = sp.diff(L2, x.diff(tt)) * (-y) + sp.diff(L2, y.diff(tt)) * x
dQ2 = sp.simplify(Q2.diff(tt).subs(EL2))
card("FB5b", "[CF7 | failure condition] without the symmetry the charge is not conserved: for V = x² + 2y², d/dt[m(xẏ − yẋ)] = −2xy on solutions (nonzero off the axes)",
     sp.simplify(dQ2 + 2 * x * y) == 0)

q1, q2, p1, p2 = sp.symbols('q1 q2 p1 p2', real=True)
H = sp.Function('H')(q1, q2, p1, p2)
z = sp.Matrix([q1, q2, p1, p2])
J = sp.Matrix([[0, 0, 1, 0], [0, 0, 0, 1], [-1, 0, 0, 0], [0, -1, 0, 0]])
gradH = sp.Matrix([H.diff(v) for v in z])
zdot = J * gradH
dHdt = sp.simplify((gradH.T * zdot)[0])
q, p = sp.symbols('q p', real=True)
Ht = p**2 / 2 + tt * q**2 / 2
dHt = sp.simplify(sp.diff(Ht, q) * sp.diff(Ht, p) + sp.diff(Ht, p) * (-sp.diff(Ht, q)) + sp.diff(Ht, tt))
card("FB5c", "[CF6 | BR12] for an arbitrary time-independent H(q₁,q₂,p₁,p₂) and the constant antisymmetric J, ż = J∇H gives dH/dt = ∇HᵀJ∇H = 0 identically. Failure condition: explicit time dependence, H = p²/2 + t q²/2 gives dH/dt = ∂H/∂t = q²/2 ≠ 0",
     dHdt == 0 and sp.simplify(dHt - q**2 / 2) == 0 and J.T == -J)

# ── FB6: Fisher metric of a Gaussian-noise model (CF10) ───────────────────────────────────────
th1, th2 = sp.symbols('theta1 theta2', positive=True)
sig = sp.symbols('sigma', positive=True)
times = [1, 2, 3]
Ymod = [sp.exp(-th1 * ti) + sp.exp(-th2 * ti) for ti in times]
Jm = sp.Matrix([[sp.diff(Yi, th) for th in (th1, th2)] for Yi in Ymod])
noise = [Normal(f'e{i}', 0, sig) for i in range(len(times))]
th0 = {th1: sp.Symbol('a1', positive=True), th2: sp.Symbol('a2', positive=True)}   # true parameters, fixed
data = [Ymod[i].subs(th0) + noise[i] for i in range(len(times))]                     # y_i = Y_i(θ₀) + ε_i
ell = sum(-(data[i] - Ymod[i])**2 / (2 * sig**2) for i in range(len(times)))          # log-likelihood up to a constant
score0 = [sp.expand(sp.diff(ell, th).subs(th0)) for th in (th1, th2)]
G_score = sp.Matrix(2, 2, lambda a_, b_: sp.simplify(Exp(sp.expand(score0[a_] * score0[b_]))))
G_hess = sp.Matrix(2, 2, lambda a_, b_: sp.simplify(Exp(sp.expand(-sp.diff(ell, (th1, th2)[a_], (th1, th2)[b_]).subs(th0)))))
target = sp.simplify((Jm.T * Jm / sig**2).subs(th0))
card("FB6a", "[CF10 | BR16] for y_i = Y_i(θ) + ε_i with independent ε_i ~ N(0, σ²), known constant σ, the Fisher information E[∂ℓ∂ℓᵀ] = −E[∂²ℓ] = JᵀJ/σ² (J = ∂Y/∂θ); checked exactly for Y_i = e^{−θ₁t_i} + e^{−θ₂t_i}, t = 1, 2, 3, expectations over the Gaussian noise. Standard Fisher geometry (Rao 1945; Amari 2016); the least-squares model-manifold reading is Transtrum–Machta–Sethna",
     sp.simplify(G_score - target) == sp.zeros(2, 2) and sp.simplify(G_hess - target) == sp.zeros(2, 2))

sigs = [sp.Symbol(f's{i}', positive=True) for i in range(len(times))]
noise_h = [Normal(f'f{i}', 0, sigs[i]) for i in range(len(times))]
score_h = [sp.expand(sum(noise_h[i] * Jm[i, k] / sigs[i]**2 for i in range(len(times)))) for k in range(2)]
G_h = sp.Matrix(2, 2, lambda a_, b_: sp.simplify(Exp(sp.expand(score_h[a_] * score_h[b_]))))
W = sp.diag(*[1 / si**2 for si in sigs])
card("FB6b", "[CF10 | failure condition of the formula] with unequal noise levels σ_i the Fisher metric is JᵀΣ⁻¹J, Σ = diag(σ_i²), not JᵀJ/σ² for one σ: g = JᵀJ/σ² holds only under the equal-variance Gaussian assumption",
     sp.simplify(G_h - Jm.T * W * Jm) == sp.zeros(2, 2) and sp.simplify((G_h - Jm.T * Jm / sigs[0]**2)[0, 0]) != 0)

# ── FB7: model-manifold null directions (Z9) ──────────────────────────────────────────────────
tsym = sp.symbols('t', positive=True)
Ylump = [sp.exp(-(th1 + th2) * ti) for ti in times]
Jl = sp.Matrix([[sp.diff(Yi, th) for th in (th1, th2)] for Yi in Ylump])
gl = Jl.T * Jl / sig**2
v = sp.Matrix([1, -1])
card("FB7a", "[Z9 | BR17, exact structural nonidentifiability] Y_i = e^{−(θ₁+θ₂)t_i} depends on θ₁ + θ₂ only: J v = 0 for v = (1, −1) at every θ, so g v = 0 and rank g = 1 everywhere (a reparametrization redundancy, not a small eigenvalue)",
     sp.simplify(Jl * v) == sp.zeros(3, 1) and sp.simplify(gl * v) == sp.zeros(2, 1) and gl.rank(simplify=True) == 1)

Jg = sp.Matrix(3, 2, lambda i, j: sp.Symbol(f'J{i}{j}', real=True))
u = sp.Matrix(sp.symbols('u1 u2', real=True))
card("FB7b", "[Z9 | OB1] for the positive-semidefinite g = JᵀJ/σ², the three conditions agree: uᵀgu = 0 ⟺ Ju = 0 ⟺ gu = 0, because uᵀgu = |Ju|²/σ² (checked symbolically for a generic 3×2 J)",
     sp.expand((u.T * (Jg.T * Jg / sig**2) * u)[0] - ((Jg * u).T * (Jg * u))[0] / sig**2) == 0)

ts5 = [1, 2, 3, 4, 5]
Ysum = [sp.exp(-th1 * ti) + sp.exp(-th2 * ti) for ti in ts5]
Js = sp.Matrix([[sp.diff(Yi, th) for th in (th1, th2)] for Yi in Ysum])
gs_near = (Js.T * Js).subs({th1: 1, th2: sp.Rational(6, 5)})
ev = sorted(float(e) for e in sp.Matrix(gs_near.evalf(40)).eigenvals())
gs_eq = (Js.T * Js).subs({th1: 1, th2: 1})
card("FB7c", "[Z9 | sloppy ≠ null] Y = e^{−θ₁t} + e^{−θ₂t}, t = 1…5, σ = 1: at θ = (1, 6/5) det g > 0, so no exact null, yet λ_min/λ_max = " + f"{ev[0] / ev[1]:.2e}" + " (a sloppy direction); at θ₁ = θ₂ the columns of J coincide and v = (1, −1) is an exact null (det g = 0)",
     sp.N(gs_near.det(), 40) > 0 and ev[0] / ev[1] < 1e-2 and sp.simplify(gs_eq.det()) == 0 and sp.simplify(Js.subs({th1: 1, th2: 1}) * v) == sp.zeros(5, 1))

eta = sp.diag(1, -1)
ln = sp.Matrix([1, 1])
card("FB7d", "[Z9 vs Z5, kept distinct] for the indefinite Lorentz form η = diag(1, −1), the light-like v = (1, 1) has vᵀηv = 0 but ηv = (1, −1) ≠ 0: a quadratic null of an indefinite form is not a kernel vector, whereas for a semidefinite Fisher metric a quadratic null is a kernel vector (FB7b)",
     (ln.T * eta * ln)[0] == 0 and eta * ln != sp.zeros(2, 1))

# ── FB8: dispersion relation, ω–k form (MW2) ──────────────────────────────────────────────────
om, k, c, hbar, m0 = sp.symbols('omega k c hbar m', positive=True)
Ee, pp = hbar * om, hbar * k
rel = sp.expand(Ee**2 - (pp**2 * c**2 + m0**2 * c**4))
card("FB8a", "[MW2 | BR27] with the inputs E = ħω and p = ħk (Planck–Einstein and de Broglie, assumed, not derived), E² = p²c² + m²c⁴ ⟺ ω² = c²k² + m²c⁴/ħ² (the dispersion relation of the Klein–Gordon form). This is an established ingredient; it does not show that mass is waves (MW1 stays a HYPOTHESIS)",
     sp.simplify(rel / hbar**2 - (om**2 - c**2 * k**2 - m0**2 * c**4 / hbar**2)) == 0)

null_q = sp.simplify(((om / c)**2 - k**2).subs(om, c * k))
mass_shell = sp.simplify(((om / c)**2 - k**2).subs(om, sp.sqrt(c**2 * k**2 + m0**2 * c**4 / hbar**2)))
card("FB8b", "[MW2 | Z5] in the variables (ω/c, k) the relation is the η-quadratic form: (ω/c)² − k² = m²c²/ħ². Massless: ω = ck lies on the null cone (form value 0, Z5). Massive: a mass shell with positive (timelike) form value",
     null_q == 0 and sp.simplify(mass_shell - m0**2 * c**2 / hbar**2) == 0)

wk_ = sp.sqrt(c**2 * k**2 + m0**2 * c**4 / hbar**2)
vp, vg = wk_ / k, sp.diff(wk_, k)
wnr = hbar * k**2 / (2 * m0)
card("FB8c", "[MW2] for ω(k) = √(c²k² + m²c⁴/ħ²): phase velocity × group velocity = c² exactly, and v_g < c for m > 0. Failure contrast: the non-relativistic ω = ħk²/2m gives v_p·v_g = ħ²k²/2m², which depends on k",
     sp.simplify(vp * vg - c**2) == 0 and sp.simplify(vg**2 - c**2) != 0 and sp.simplify(sp.diff(wnr, k) * wnr / k - hbar**2 * k**2 / (2 * m0**2)) == 0)

# ── FB9: symplectic self-pairing vs Lorentz null (Part III row) ──────────────────────────────
uu = sp.Matrix(sp.symbols('u1:5', real=True))
vv = sp.Matrix(sp.symbols('v1:5', real=True))
J4 = J
omega_ = lambda A_, B_: (A_.T * J4 * B_)[0]
eta4 = sp.diag(1, -1, -1, -1)
e1 = sp.Matrix([1, 0, 0, 0])
complement = (e1.T * J4).nullspace()
card("FB9a", "[CF6 | BR29] the symplectic form ω(u, v) = uᵀJv (J standard on ℝ⁴) is alternating: ω(v, v) = 0 for EVERY v and ω(u, v) = −ω(v, u). Symplectic orthogonality ω(u, v) = 0 is a genuine relation between two vectors: the ω-complement of e₁ is 3-dimensional and contains e₁ itself",
     sp.expand(omega_(vv, vv)) == 0 and sp.expand(omega_(uu, vv) + omega_(vv, uu)) == 0 and len(complement) == 3 and (e1.T * J4 * e1)[0] == 0)

card("FB9b", "[Z5 vs symplectic, kept distinct] the Lorentz quadratic null is a condition, not an identity: q_η(v) = vᵀηv with η = diag(1, −1, −1, −1) is 0 on the light cone (v = (1, 1, 0, 0)) and nonzero off it (q_η(e₁) = 1). Alternating self-pairing zero ≠ Lorentz quadratic null vector",
     (sp.Matrix([1, 1, 0, 0]).T * eta4 * sp.Matrix([1, 1, 0, 0]))[0] == 0 and (e1.T * eta4 * e1)[0] == 1)

sh = sp.symbols('s', real=True)
A2 = sp.Matrix([[1, sh], [0, 1]])
J2 = sp.Matrix([[0, 1], [-1, 0]])
u2, v2 = sp.Matrix(sp.symbols('a1 a2', real=True)), sp.Matrix(sp.symbols('b1 b2', real=True))
card("FB9c", "[CF2 instance] a symplectic map preserves the pairing and hence symplectic orthogonality: the shear A = [[1, s], [0, 1]] has AᵀJA = J, so ω(Au, Av) = ω(u, v) for all u, v (in ℝ², symplectic ⟺ det A = 1)",
     sp.simplify(A2.T * J2 * A2 - J2) == sp.zeros(2, 2) and sp.expand(((A2 * u2).T * J2 * (A2 * v2))[0] - (u2.T * J2 * v2)[0]) == 0)

# ── FB10: wavelet zero mean, admissibility, covariance, first-order invariance (W1, W2) ───────
t_, w_ = sp.symbols('t omega', real=True)
psi = (1 - t_**2) * sp.exp(-t_**2 / 2)                           # Mexican hat (second derivative of a Gaussian, up to sign)
psih = sp.simplify(sp.integrate(psi * sp.exp(-sp.I * w_ * t_), (t_, -sp.oo, sp.oo), conds='none'))
Cpsi = 2 * sp.integrate(sp.simplify(psih * sp.conjugate(psih)) / w_, (w_, 0, sp.oo))
card("FB10a", "[W1 | BR18] the Mexican-hat wavelet ψ(t) = (1 − t²)e^{−t²/2} has ∫ψ = 0, ψ̂(ω) = √(2π) ω² e^{−ω²/2} (so ψ̂(0) = 0), and finite admissibility constant C_ψ = ∫|ψ̂(ω)|²/|ω| dω = 2π (Grossmann–Morlet admissibility; Daubechies 1992). The zero is designed in; this card does not connect it to any project zero hypothesis",
     sp.integrate(psi, (t_, -sp.oo, sp.oo)) == 0 and sp.simplify(psih - sp.sqrt(2 * sp.pi) * w_**2 * sp.exp(-w_**2 / 2)) == 0 and sp.simplify(Cpsi - 2 * sp.pi) == 0)

epsl = sp.symbols('varepsilon', positive=True)
phih = sp.sqrt(2 * sp.pi) * sp.exp(-w_**2 / 2)
lower = sp.integrate(2 * sp.pi * sp.exp(-1) / w_, (w_, epsl, 1))                 # ≤ ∫_ε^1 |φ̂|²/ω since e^{−ω²} ≥ e^{−1} on (0, 1]
card("FB10b", "[W1 | failure condition] a filter with nonzero mean is not admissible: the Gaussian φ = e^{−t²/2} has ∫φ = √(2π) ≠ 0 and ∫_ε^1|φ̂|²/ω dω ≥ (2π/e)·log(1/ε) → ∞ as ε → 0, so C_φ = ∞",
     sp.integrate(sp.exp(-t_**2 / 2), (t_, -sp.oo, sp.oo)) == sp.sqrt(2 * sp.pi) and sp.simplify(lower - 2 * sp.pi * sp.exp(-1) * sp.log(1 / epsl)) == 0 and sp.limit(lower, epsl, 0, '+') == sp.oo)

uu_, tau_ = sp.symbols('u tau', real=True)
xg = sp.exp(-t_**2)
conv = lambda f: sp.simplify(sp.integrate(f * psi.subs(t_, uu_ - t_), (t_, -sp.oo, sp.oo), conds='none'))
Wx, WTx = conv(xg), conv(xg.subs(t_, t_ - tau_))
Nd = 16
xs = [sp.Rational(v) for v in (3, -1, 4, 1, -5, 9, 2, -6, 5, 3, -5, 8, 9, -7, 9, 3)]
filt = [1, -2, 1] + [0] * (Nd - 3)                                                   # discrete zero-mean filter
cconv = lambda xx: [sum(xx[j] * filt[(n - j) % Nd] for j in range(Nd)) for n in range(Nd)]
shift = lambda xx, r: [xx[(n - r) % Nd] for n in range(Nd)]
yx, ysx = cconv(xs), cconv(shift(xs, 3))
S0 = lambda yy: sum(abs(v) for v in yy)
xrev = xs[::-1]
card("FB10c", "[W2 | first-order scattering, exact parts only] the wavelet transform is translation-covariant: (T_τx) ∗ ψ = T_τ(x ∗ ψ) (checked symbolically for x = e^{−t²} with the Mexican hat), and the averaged modulus Σ|x ⊛ ψ| is translation-invariant (exact, circular, ℚ¹⁶, zero-mean filter (1, −2, 1)) while x ⊛ ψ itself changes. The invariant is many-to-one (x and its reversal give the same value). Mallat's deformation stability (Lipschitz continuity to C² diffeomorphisms) and the higher-order scattering results are SOURCE-ONLY (Mallat 2012; Bruna–Mallat 2013), not carded",
     sp.simplify(WTx - Wx.subs(uu_, uu_ - tau_)) == 0 and ysx == shift(yx, 3) and ysx != yx and S0(ysx) == S0(yx) and xrev != xs and S0(cconv(xrev)) == S0(yx))

# ── FB11: reductions; what survives? (M3, M2, H6) ─────────────────────────────────────────────
k1, km1, k2, e0, S, C = sp.symbols('k1 k_m1 k2 e0 S C', positive=True)
dCdt = k1 * (e0 - C) * S - (km1 + k2) * C
Cqss = sp.solve(sp.Eq(dCdt, 0), C)[0]
KM = (km1 + k2) / k1
Vmax = k2 * e0
rate = sp.simplify(k2 * Cqss)
jac = sp.Matrix([[sp.diff(f, var) for var in (k1, km1, k2)] for f in (KM, Vmax / e0)])
card("FB11a", "[M3 | H6] Michaelis–Menten: for E + S ⇌ C → E + P with mass action and E = e₀ − C, the quasi-steady state dC/dt = 0 gives C = e₀S/(K_M + S) and rate k₂C = V_max S/(K_M + S), K_M = (k₋₁ + k₂)/k₁, V_max = k₂e₀ (Briggs–Haldane 1925). What survives: K_M and V_max. What is lost: the three rate constants map to two combinations (rank 2 Jacobian), so one direction in (k₁, k₋₁, k₂) is invisible to the reduced rate",
     sp.simplify(Cqss - e0 * S / (KM + S)) == 0 and sp.simplify(rate - Vmax * S / (KM + S)) == 0 and jac.rank(simplify=True) == 2)


def mm_error(e0v, S0=1.0, k1v=1.0, km1v=1.0, k2v=1.0):
    """Max |S_full(t) − S_reduced(t)|/S0 over the substrate-depletion window, RK4 for both systems."""
    KMv, Vm = (km1v + k2v) / k1v, k2v * e0v
    T = 5.0 * (KMv + S0) / Vm
    n = 200000
    dt = T / n
    f_full = lambda s_, c_: (-k1v * (e0v - c_) * s_ + km1v * c_, k1v * (e0v - c_) * s_ - (km1v + k2v) * c_)
    f_red = lambda s_: -Vm * s_ / (KMv + s_)
    s_, c_, r_, err = S0, 0.0, S0, 0.0
    for _ in range(n):
        a1 = f_full(s_, c_); a2 = f_full(s_ + dt / 2 * a1[0], c_ + dt / 2 * a1[1])
        a3 = f_full(s_ + dt / 2 * a2[0], c_ + dt / 2 * a2[1]); a4 = f_full(s_ + dt * a3[0], c_ + dt * a3[1])
        s_ += dt / 6 * (a1[0] + 2 * a2[0] + 2 * a3[0] + a4[0]); c_ += dt / 6 * (a1[1] + 2 * a2[1] + 2 * a3[1] + a4[1])
        b1 = f_red(r_); b2 = f_red(r_ + dt / 2 * b1); b3 = f_red(r_ + dt / 2 * b2); b4 = f_red(r_ + dt * b3)
        r_ += dt / 6 * (b1 + 2 * b2 + 2 * b3 + b4)
        err = max(err, abs(s_ - r_) / S0)
    return err, e0v / (S0 + KMv)


SMALL_MAX, LARGE_MIN = 0.02, 0.05      # thresholds fixed before the first run
err_s, eps_s = mm_error(0.01)
err_l, eps_l = mm_error(3.0)
card("FB11b", f"[M3 | failure condition, numeric] the reduction is valid only when ε = e₀/(S₀ + K_M) is small (Segel–Slemrod 1989): k₁ = k₋₁ = k₂ = 1, S₀ = 1; ε = {eps_s:.4f} gives max|S_full − S_red|/S₀ = {err_s:.4f} (< {SMALL_MAX}); ε = {eps_l:.2f} gives {err_l:.3f} (> {LARGE_MIN}). Thresholds fixed before the first run",
     err_s < SMALL_MAX and err_l > LARGE_MIN)

Yb = sp.exp(-th1 * tsym) + sp.exp(-th2 * tsym)
card("FB11c", "[M2 | H6, manifold boundary] for Y(θ) = e^{−θ₁t} + e^{−θ₂t} (t > 0), the limit θ₂ → ∞ is the one-exponential model e^{−θ₁t}, and ∂Y/∂θ₂ = −t e^{−θ₂t} → 0, so the metric's θ₂ direction collapses on that boundary. What survives: θ₁. What is lost: θ₂. This checks the boundary limit only; it does not implement the MBAM geodesic procedure (Transtrum–Qiu 2014)",
     sp.limit(Yb, th2, sp.oo) == sp.exp(-th1 * tsym) and sp.limit(sp.diff(Yb, th2), th2, sp.oo) == 0)

K, Kp, hf = sp.symbols('K Kp h', positive=True)
lhs = lambda s1, s3: sum(sp.exp(K * s2 * (s1 + s3)) for s2 in (1, -1))
Kprime = sp.log(sp.cosh(2 * K)) / 2
A_ = 2 * sp.sqrt(sp.cosh(2 * K))
ok_dec = all(sp.simplify((lhs(s1, s3) - A_ * sp.exp(Kprime * s1 * s3)).rewrite(sp.exp)) == 0 for s1 in (1, -1) for s3 in (1, -1))
lhs_h = lambda s1, s3: sum(sp.exp(K * s2 * (s1 + s3) + hf * s2) for s2 in (1, -1))
card("FB11d", "[H6, coarse-graining / RG instance] 1D Ising decimation, zero field: Σ_{s₂=±1} e^{Ks₂(s₁+s₃)} = A e^{K′s₁s₃} for all s₁, s₃ = ±1 with tanh K′ = tanh²K, A = 2√cosh 2K (Nelson–Fisher 1975). What survives: the nearest-neighbour coupling form, renormalized K → K′, plus a constant. What is lost: the decimated spins. Failure condition: with a field h ≠ 0 the pure-K recursion does not close (the (+,+) and (−,−) sums differ), so a field term h′ must be added",
     ok_dec and sp.simplify((sp.tanh(Kprime) - sp.tanh(K)**2).rewrite(sp.exp)) == 0 and sp.simplify(lhs_h(1, 1) - lhs_h(-1, -1)) != 0)
