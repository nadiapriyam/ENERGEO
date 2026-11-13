"""MMI: model-manifold invariance audit (2026-11-13).

Not a new experiment and not C7. Classifies which model-manifold quantities are coordinate-invariant, which depend on
the parametrization, which depend on the prediction-space (noise) metric, and what a boundary limit keeps. Model F-C
(Y = e^{−θ₁t} + e^{−θ₂t}, t = 1, 2, 3, σ = 1, g = JᵀJ) is the project's own example (CFT5).
Run: python3 verify/verify_MMI.py"""
import sympy as sp
import mpmath as mp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


t1, t2 = sp.symbols('theta1 theta2', positive=True)
ts = [1, 2, 3]
Y = sp.Matrix([sp.exp(-t1 * t) + sp.exp(-t2 * t) for t in ts])
J = Y.jacobian(sp.Matrix([t1, t2]))
g = J.T * J

# ── MMIa: rank, nullity, determinant, volume element ───────────────────────────────────────────
P = sp.Matrix(2, 2, sp.symbols('p0:4', real=True)); G = sp.Matrix(2, 2, sp.symbols('g0:4', real=True))
det_law = sp.expand((P.T * G * P).det() - P.det()**2 * G.det()) == 0
Pn = sp.Matrix([[2, 1], [1, 3]])
gdeg = g.subs({t1: 1, t2: 1})                                  # the diagonal: rank 1 (CFT5b)
ggen = g.subs({t1: 1, t2: 2})
ranks = (Pn.T * gdeg * Pn).rank(simplify=True) == gdeg.rank(simplify=True) == 1 and (Pn.T * ggen * Pn).rank(simplify=True) == ggen.rank(simplify=True) == 2
card("MMIa", "[model-manifold invariance] under an invertible change of parameters (Jacobian P): rank and nullity of g are unchanged (instances: rank 1 on the diagonal, rank 2 off it); det g is NOT invariant, det(PᵀgP) = det(P)² det g (generic 2×2, symbolic); hence the volume element √det g |dθ| IS invariant (change of variables)",
     det_law and ranks)

# ── MMIb: raw eigenvalues and condition number vs generalized eigenvalues ──────────────────────
g0 = g.subs({t1: 1, t2: sp.Rational(6, 5)})
def ev(M):
    with mp.workdps(40):
        E, _ = mp.eigsy(mp.matrix(sp.Matrix(M).evalf(40).tolist()))
        return sorted(float(e) for e in E)
D = sp.diag(1, 10)                                              # linear change of units θ = D θ′
e_raw, e_units = ev(g0), ev(D.T * g0 * D)
cond = lambda e: e[-1] / e[0]
h = sp.Matrix([[2, sp.Rational(1, 2)], [sp.Rational(1, 2), 1]])  # a second tensor (SPD) transforming the same way
Pq = sp.Matrix([[3, 1], [1, 2]])
gq = sp.Matrix([[5, 2], [2, 3]])
lam = sp.Symbol('lam')
cp1 = sp.expand(((h.inv() * gq) - lam * sp.eye(2)).det())
cp2 = sp.expand((((Pq.T * h * Pq).inv() * (Pq.T * gq * Pq)) - lam * sp.eye(2)).det())
card("MMIb", f"[model-manifold invariance] raw eigenvalues of g are NOT invariant: F-C at θ = (1, 6/5) gives {e_raw[0]:.4g}, {e_raw[1]:.4g}; after the change of units θ = diag(1, 10)θ′ they are {e_units[0]:.4g}, {e_units[1]:.4g}, and the condition number moves from {cond(e_raw):.4g} to {cond(e_units):.4g} (cf. the nonlinear chart, CFT5e). Generalized eigenvalues of g relative to a second tensor h ARE invariant: eig((PᵀhP)⁻¹PᵀgP) = eig(h⁻¹g) (same characteristic polynomial), but they depend on choosing h, and parameter space supplies no canonical h",
     abs(e_raw[0] - e_units[0]) > 1e-9 and abs(cond(e_raw) - cond(e_units)) > 1e-6 and sp.simplify(cp1 - cp2) == 0)

# ── MMIc: Jacobian singular values ─────────────────────────────────────────────────────────────
J0 = J.subs({t1: 1, t2: sp.Rational(6, 5)})
sv = lambda M: [float(mp.sqrt(e)) for e in ev(M.T * M)]
s_theta = sv(J0)
s_log = sv(J0 * sp.diag(1, sp.Rational(6, 5)))                  # θ = e^λ at λ = log θ: J_λ = J_θ diag(θ)
W = sp.diag(1, sp.sqrt(2), sp.sqrt(3))                          # a different prediction-space (noise) metric
s_w = sv(W * J0)
Jd = J.subs({t1: 1, t2: 1})
card("MMIc", f"[model-manifold invariance] singular values of J are NOT invariant: at θ = (1, 6/5) they are {s_theta[0]:.4g}, {s_theta[1]:.4g} in θ, {s_log[0]:.4g}, {s_log[1]:.4g} in log-coordinates, and {s_w[0]:.4g}, {s_w[1]:.4g} under the prediction metric diag(1, 2, 3); they depend on both the parametrization and the prediction-space metric. The kernel is invariant: on the diagonal J(1, −1) = 0 and (W J)(1, −1) = 0",
     abs(s_theta[0] - s_log[0]) > 1e-9 and abs(s_theta[0] - s_w[0]) > 1e-9 and sp.simplify(Jd * sp.Matrix([1, -1])) == sp.zeros(3, 1) and sp.simplify(W * Jd * sp.Matrix([1, -1])) == sp.zeros(3, 1))

# ── MMId: curve length: chart-independent and equal to arc length in prediction space ───────────
s = sp.Symbol('s', real=True)
curve = {t1: 1 + s, t2: 2 + s}
dth = sp.Matrix([1, 1])
integ_theta = (dth.T * g.subs(curve) * dth)[0]
lam1, lam2 = sp.log(1 + s), sp.log(2 + s)
Jl = sp.diag(sp.exp(sp.Symbol('l1')), sp.exp(sp.Symbol('l2')))
gl = (Jl.T * g.subs({t1: sp.exp(sp.Symbol('l1')), t2: sp.exp(sp.Symbol('l2'))}) * Jl).subs({sp.Symbol('l1'): lam1, sp.Symbol('l2'): lam2})
dlam = sp.Matrix([sp.diff(lam1, s), sp.diff(lam2, s)])
integ_log = (dlam.T * gl * dlam)[0]
Ys = Y.subs(curve).diff(s)
integ_pred = (Ys.T * Ys)[0]
f = sp.lambdify(s, sp.sqrt(integ_theta), 'mpmath')
L = mp.quad(f, [0, 1])
card("MMId", f"[model-manifold invariance] the length of a curve in parameter space, ∫√(θ′ᵀ g θ′) ds, is the same in θ and in log-coordinates (the integrands agree exactly) and equals the Euclidean arc length of the image curve Y(θ(s)) in prediction space (g = JᵀJ is the induced metric): for θ(s) = (1 + s, 2 + s), s ∈ [0, 1], L = {float(L):.6g}. Lengths are chart-invariant but depend on the prediction-space metric (the noise model)",
     sp.simplify(integ_theta - integ_log) == 0 and sp.simplify(integ_theta - integ_pred) == 0)

# ── MMIe: noise model ──────────────────────────────────────────────────────────────────────────
Sig = sp.diag(1, 2, 3)
gS = J.T * Sig.inv() * J
card("MMIe", "[model-manifold invariance] the same model and parametrization with noise covariance Σ = diag(1, 2, 3) has metric JᵀΣ⁻¹J ≠ JᵀJ (magnitudes and eigenvalues are noise-model dependent); the null direction is not: on the diagonal JᵀΣ⁻¹J (1, −1) = 0 and the rank stays 1, off the diagonal it stays 2",
     sp.simplify((gS - g).subs({t1: 1, t2: 2})) != sp.zeros(2) and sp.simplify(gS.subs({t1: 1, t2: 1}) * sp.Matrix([1, -1])) == sp.zeros(2, 1)
     and gS.subs({t1: 1, t2: 1}).rank(simplify=True) == 1 and gS.subs({t1: 1, t2: 2}).rank(simplify=True) == 2)

# ── MMIf: a width is a property of the image set and the ambient metric ─────────────────────────
th = sp.Symbol('th', positive=True); la = sp.Symbol('la', real=True); u = sp.Symbol('u', positive=True)
Yc = sp.Matrix([sp.exp(-k * th) for k in (1, 2, 3)])
speed = lambda Yv, v, Wm=sp.eye(3): sp.sqrt(((Wm * Yv.diff(v)).T * (Wm * Yv.diff(v)))[0])
Yu = sp.Matrix([u, u**2, u**3])                                 # the same image set, charted by u = e^{−θ} ∈ (0, 1)
chain_la = sp.simplify(speed(Yc.subs(th, sp.exp(la)), la) - speed(Yc, th).subs(th, sp.exp(la)) * sp.exp(la)) == 0
chain_u = sp.simplify(speed(Yc, th) - speed(Yu, u).subs(u, sp.exp(-th)) * sp.exp(-th)) == 0
Ww = sp.diag(1, 2, 3)                                           # prediction metric WᵀW = diag(1, 4, 9)
L_u = mp.quad(sp.lambdify(u, speed(Yu, u), 'mpmath'), [0, 1])
L_th = mp.quad(sp.lambdify(th, speed(Yc, th), 'mpmath'), [0, mp.inf])
L_w = mp.quad(sp.lambdify(u, speed(Yu, u, Ww), 'mpmath'), [0, 1])
card("MMIf", f"[hyperribbon widths, 1-D illustration] the one-parameter model Y(θ) = (e^{{−θ}}, e^{{−2θ}}, e^{{−3θ}}), θ ∈ (0, ∞), is the curve (u, u², u³), u ∈ (0, 1); its extent (total length, the only width of a 1-D manifold) is the same in every chart (θ, λ = log θ, u = e^{{−θ}}: the speed transforms by the chain rule exactly) and equals {float(L_u):.8g} (θ-chart quadrature {float(L_th):.8g}), but {float(L_w):.8g} under the prediction metric diag(1, 4, 9). Widths are parametrization-independent and depend on the ambient (prediction / noise) metric",
     chain_la and chain_u and abs(L_th - L_u) < 1e-8 and abs(L_u - L_w) > 1e-3)

# ── MMIg: boundary limits are properties of the set ────────────────────────────────────────────
tt = sp.Symbol('t', positive=True); l2 = sp.Symbol('l2', real=True)
Yt = sp.exp(-t1 * tt) + sp.exp(-t2 * tt)
lim1 = sp.limit(Yt, t2, sp.oo)
lim2 = sp.limit(Yt.subs(t2, sp.exp(l2)), l2, sp.oo)
dl2 = sp.limit(sp.diff(Yt.subs(t2, sp.exp(l2)), l2), l2, sp.oo)
Jb = sp.Matrix([sp.exp(-t1 * t) for t in ts]).jacobian(sp.Matrix([t1, t2]))
card("MMIg", "[manifold boundaries] the boundary reached as θ₂ → ∞ is the one-exponential model e^{−θ₁t} whether approached in θ₂ or in λ₂ = log θ₂ (the limit set is parametrization-independent; only the approach rate depends on coordinates); the tangent direction of the removed parameter vanishes (∂Y/∂λ₂ → 0), and the boundary model's Jacobian has rank 1 versus rank 2 for the full model at (1, 2): the dimension drops from 2 to 1",
     sp.simplify(lim1 - sp.exp(-t1 * tt)) == 0 and sp.simplify(lim2 - sp.exp(-t1 * tt)) == 0 and dl2 == 0 and Jb.rank() == 1 and J.subs({t1: 1, t2: 2}).rank() == 2)

# ── MMIh: function-space prediction space ──────────────────────────────────────────────────────
T = sp.Symbol('T', positive=True)
gL2 = sp.Matrix(2, 2, lambda i, j: sp.integrate(T**2 * sp.exp(-((t1, t2)[i] + (t1, t2)[j]) * T), (T, 0, sp.oo)))
gram = sp.Matrix(5, 5, lambda i, j: sp.Rational(1, (i + 1) + (j + 1)))   # ⟨e^{−aT}, e^{−bT}⟩ = 1/(a + b), a, b = 1..5
card("MMIh", "[prediction space] for continuously indexed outputs Y(T; θ) = e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞) (white noise per unit time), the metric is finite: g_ij = 2/(θᵢ + θⱼ)³, rank 2 off the diagonal and rank 1 on it: a 2-dimensional manifold. Its linear span is not finite-dimensional: any finite set of distinct exponentials is linearly independent (Gram det for a = 1…5 is nonzero). 'Function-dimensional ambient space' is justified once the outputs form a function with a stated inner product; the manifold's own dimension stays the number of identifiable parameters",
     sp.simplify(gL2[0, 1] - 2 / (t1 + t2)**3) == 0 and sp.simplify(gL2[0, 0] - 2 / (2 * t1)**3) == 0 and sp.simplify(gL2.det()) != 0 and sp.simplify(gL2.subs(t2, t1).det()) == 0 and gram.det() != 0)

# ── MMIi: c in the form vs model parameters ───────────────────────────────────────────────────
c = sp.Symbol('c', positive=True)
eta1 = sp.diag(1, -1)
etac = sp.diag(1, -1 / c**2)
Pc = sp.diag(1, 1 / c)
lim_eta = sp.Matrix(2, 2, lambda i, j: sp.limit(etac[i, j], c, sp.oo))
ss = sp.Symbol('ss', real=True)
boost = sp.Matrix([[sp.cosh(ss), sp.sinh(ss)], [sp.sinh(ss), sp.cosh(ss)]])
orbit = boost * sp.Matrix([1, 0])
card("MMIi", "[c vs model parameters] for finite c the form η_c = diag(1, −1/c²) equals Pᵀ diag(1, −1) P with P = diag(1, 1/c): different finite c are related by a change of units (R1), so the invariant content is the signature; the limit c → ∞ gives diag(1, 0), rank 1, which no invertible change reaches: a degenerate boundary of the family (C9b). The model-manifold boundary also drops rank (MMIg). Difference kept: the Lorentz allowed set uᵀη₁u = 1, u⁰ > 0 is one orbit of the boosts (homogeneous: (1, 0) ↦ (cosh s, sinh s)), whereas F-C's curvature varies (CFT5f): model parameters are coordinates on one non-homogeneous manifold, not structure constants of a form",
     Pc.T * eta1 * Pc == etac and lim_eta == sp.diag(1, 0) and lim_eta.rank() == 1 and sp.simplify((orbit.T * eta1 * orbit)[0]) == 1)
