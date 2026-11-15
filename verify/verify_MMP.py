"""MMP: model-manifold precision corrections (2026-11-15).

Not a new experiment and not C7. Scopes statements of the model-manifold audit (MMI, 2026-11-13) that were too strong:
the model image vs a smooth manifold; parameters vs local coordinates; the Fisher reparametrization law written with
J_Y = ∂Y/∂θ (prediction Jacobian) and A = ∂θ/∂φ (coordinate change); the positive-definite hypothesis behind
g(v, v) = 0 ⟺ J_Y v = 0; the restricted noise-model theorem and its caveat; the volume element; geometric widths vs
chart-dependent proxies; boundary language; the function-space example; limit-specific dimension drops; the
degenerate c → ∞ form; the named measurement channel; observation-type maps that are different operations.
The MMI cards and their outputs are unchanged; research/model_manifold.json records which MMI wording each MMP card
scopes. Model F-C: Y_t = e^{−θ₁t} + e^{−θ₂t}, t = 1, 2, 3.
Run: python3 verify/verify_MMP.py"""
import sympy as sp
import mpmath as mp
from sympy.physics.quantum import TensorProduct as K


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


t1, t2 = sp.symbols('theta1 theta2', positive=True)
ts = [1, 2, 3]
Y = sp.Matrix([sp.exp(-t1 * t) + sp.exp(-t2 * t) for t in ts])
JY = Y.jacobian(sp.Matrix([t1, t2]))                              # prediction Jacobian J_Y = ∂Y/∂θ
at = lambda M, a, b: M.subs({t1: a, t2: b})
def ev(M):
    with mp.workdps(40):
        E, Q = mp.eigsy(mp.matrix(sp.Matrix(M).evalf(40).tolist()))
        return [float(e) for e in E], Q

# ── MMPa: model image vs smooth manifold ───────────────────────────────────────────────────────
th = sp.Symbol('th', real=True)
cusp = sp.Matrix([th**2, th**3]); Jc = cusp.diff(th)
node = sp.Matrix([th**2 - 1, th**3 - th]); Jn = node.diff(th)
speed2 = sp.expand((Jn.T * Jn)[0])
no_zero = sp.solveset(sp.Eq(speed2, 0), th, domain=sp.S.Reals) == sp.S.EmptySet
tang = sp.Matrix.hstack(Jn.subs(th, 1), Jn.subs(th, -1))
card("MMPa", "[model image vs manifold] M = Y(Θ) is a model image (a set) in general. Cusp: Y(θ) = (θ², θ³) has J_Y(0) = 0 (rank drop) and a cusp at the origin. Node: Y(θ) = (θ² − 1, θ³ − θ) has J_Y ≠ 0 for every real θ (an immersion), yet Y(1) = Y(−1) = (0, 0) with independent tangents (2, 2) and (−2, 2): a self-intersection, so the image is not a manifold there although the rank is constant. Smooth-manifold structure needs constant rank plus local injectivity / embedding on the region considered",
     Jc.subs(th, 0) == sp.zeros(2, 1) and no_zero and node.subs(th, 1) == node.subs(th, -1) == sp.zeros(2, 1) and tang.rank() == 2)

# ── MMPb: parameters are not automatically coordinates ────────────────────────────────────────
s_ = sp.Symbol('s', positive=True)
Ysum = sp.Matrix([sp.exp(-(t1 + t2) * t) for t in ts])
card("MMPb", "[parameters vs coordinates] θ ∈ Θ is a parameter value and Y(θ) its prediction. F-C: Y(1, 2) = Y(2, 1), so different parameter values represent the same prediction; rank J_Y = 2 at (1, 2), so θ gives local coordinates on the image of a small neighbourhood there (immersion, locally injective); rank J_Y = 1 on the diagonal, where θ is not a local coordinate system. The model Y = e^{−(θ₁+θ₂)t} has rank J_Y = 1 everywhere: θ never gives local coordinates, the identifiable combination θ₁ + θ₂ does",
     at(Y, 1, 2) == at(Y, 2, 1) and at(JY, 1, 2).rank() == 2 and at(JY, 1, 1).rank() == 1
     and sp.simplify(Ysum.jacobian(sp.Matrix([t1, t2]))).rank() == 1)

# ── MMPc: Fisher reparametrization law in J_Y / A notation ────────────────────────────────────
p1, p2 = sp.symbols('phi1 phi2', real=True)
Sig = sp.diag(1, 2, 3)
g_th = JY.T * Sig.inv() * JY
thphi = {t1: sp.exp(p1), t2: sp.exp(p2)}
A = sp.diag(sp.exp(p1), sp.exp(p2))                              # A = ∂θ/∂φ
Yphi = Y.subs(thphi)
JYphi = Yphi.jacobian(sp.Matrix([p1, p2]))
g_phi = JYphi.T * Sig.inv() * JYphi
pt = {p1: 0, p2: sp.log(sp.Rational(6, 5))}
card("MMPc", "[Fisher notation] with J_Y = ∂Y/∂θ and Σ = diag(1, 2, 3), g_θ = J_Yᵀ Σ⁻¹ J_Y. For θ = θ(φ) = (e^{φ₁}, e^{φ₂}) with A = ∂θ/∂φ, the chain rule gives J_{Y∘θ} = J_Y A, and g_φ computed directly from Y(θ(φ)) equals Aᵀ g_θ A exactly. The matrix components differ (at φ = (0, log 6/5), g_φ ≠ g_θ entrywise); the tensor g is one object with two component matrices",
     sp.simplify(JYphi - JY.subs(thphi) * A) == sp.zeros(3, 2) and sp.simplify(g_phi - A.T * g_th.subs(thphi) * A) == sp.zeros(2, 2)
     and sp.simplify((g_phi.subs(pt) - g_th.subs({t1: 1, t2: sp.Rational(6, 5)})).evalf()) != sp.zeros(2, 2))

# ── MMPd: g(v, v) = 0 ⟺ J_Y v = 0 needs a positive-definite Σ⁻¹ ───────────────────────────────
l = sp.symbols('l11 l21 l22 l31 l32 l33', real=True)
L = sp.Matrix([[l[0], 0, 0], [l[1], l[2], 0], [l[3], l[4], l[5]]])
Jg = sp.Matrix(3, 2, sp.symbols('j0:6', real=True)); v = sp.Matrix(sp.symbols('v1 v2', real=True))
quad = sp.expand((v.T * Jg.T * (L * L.T) * Jg * v)[0] - ((L.T * Jg * v).T * (L.T * Jg * v))[0]) == 0
W0 = sp.diag(1, 0, 0)                                            # singular: only output t = 1 observed
J12 = at(JY, 1, 2)
v0 = sp.Matrix([J12[0, 1], -J12[0, 0]])
card("MMPd", "[null directions: hypothesis] g(v, v) = vᵀ J_Yᵀ Σ⁻¹ J_Y v = (J_Y v)ᵀ Σ⁻¹ (J_Y v). With Σ⁻¹ = LLᵀ positive definite (L invertible), this is |Lᵀ J_Y v|² (checked for a generic 3 × 3 Cholesky factor), so g(v, v) = 0 ⟺ J_Y v = 0. Without positive definiteness it fails: with the singular weight diag(1, 0, 0) (only t = 1 observed), F-C at (1, 2) has v with J_Y v ≠ 0 but vᵀ J_Yᵀ W J_Y v = 0",
     quad and sp.simplify((J12 * v0)[0]) == 0 and sp.simplify(J12 * v0) != sp.zeros(3, 1) and sp.simplify((v0.T * J12.T * W0 * J12 * v0)[0]) == 0)

# ── MMPe: restricted noise-model theorem and its caveat ───────────────────────────────────────
same = all(sp.Matrix(at(JY.T * W * JY, a, b)).rank(simplify=True) == at(JY, a, b).rank() for W in (sp.eye(3), Sig.inv()) for a, b in ((1, 1), (1, 2)))
null_both = all(sp.simplify(at(JY.T * W * JY, 1, 1) * sp.Matrix([1, -1])) == sp.zeros(2, 1) for W in (sp.eye(3), Sig.inv()))
yv, z = sp.symbols('y z', real=True)
mu, sv = sp.exp(-(t1 + t2)), sp.exp(t1)                          # scalar y ~ N(μ(θ), s(θ)): the variance depends on θ
ell = -sp.log(2 * sp.pi * sv) / 2 - (yv - mu)**2 / (2 * sv)
H = sp.hessian(ell, (t1, t2))
Hz = sp.expand(H.subs(yv, mu + sp.sqrt(sv) * z))
EH = Hz.applyfunc(lambda e: sp.expand(e).subs(z**2, 1).subs(z, 0))
I_full = sp.simplify(-EH)
grad_mu, grad_s = sp.Matrix([mu.diff(t1), mu.diff(t2)]), sp.Matrix([sv.diff(t1), sv.diff(t2)])
vv = sp.Matrix([1, -1])
card("MMPe", "[noise model: restricted theorem + caveat] (i) for g = J_Yᵀ W J_Y with a FIXED positive-definite W, ker g = ker J_Y and rank g = rank J_Y: on F-C, W = I and W = diag(1, 1/2, 1/3) give the same ranks (1 on the diagonal, 2 at (1, 2)) and the same null (1, −1). (ii) caveat: if the noise law depends on θ the Fisher information has further terms: for y ~ N(μ, s) with μ = e^{−(θ₁+θ₂)}, s = e^{θ₁}, the full Fisher information −E[∂²ℓ] = ∇μ∇μᵀ/s + ∇s∇sᵀ/(2s²) has rank 2, and v = (1, −1) has J_μ v = 0 but g(v, v) = 1/2. 'Null directions = ker J_Y' needs a θ-independent covariance",
     same and null_both and sp.simplify(I_full - (grad_mu * grad_mu.T / sv + grad_s * grad_s.T / (2 * sv**2))) == sp.zeros(2, 2)
     and sp.simplify((grad_mu.T * vv)[0]) == 0 and sp.simplify((vv.T * I_full * vv)[0] - sp.Rational(1, 2)) == 0 and sp.simplify(I_full.det()) != 0)

# ── MMPf: the volume element ──────────────────────────────────────────────────────────────────
g_e = JY.T * JY
g_l = (A.T * g_e.subs(thphi) * A)
det_law = sp.simplify(g_l.det() - A.det()**2 * g_e.det().subs(thphi)) == 0
f_th = sp.lambdify((t1, t2), sp.sqrt(g_e.det()), 'mpmath')
f_ph = sp.lambdify((p1, p2), sp.sqrt(g_l.det()), 'mpmath')
V_th = mp.quad(f_th, [1, 2], [3, 4])
V_ph = mp.quad(f_ph, [0, mp.log(2)], [mp.log(3), mp.log(4)])
r_th, r_ph = f_th(1, 3), f_ph(0, mp.log(3))
card("MMPf", f"[volume element] det g_φ = (det A)² det g_θ, so neither det g nor √det g alone is invariant (F-C at θ = (1, 3): √det g_θ = {float(r_th):.6g}, √det g_φ = {float(r_ph):.6g} at the same point). The invariant object is the full element √det g_θ dθ¹ dθ² = √det g_φ dφ¹ dφ²: the volume of θ ∈ [1, 2] × [3, 4] is {float(V_th):.8g} in θ and {float(V_ph):.8g} in φ = log θ",
     det_law and abs(r_th - r_ph) > 1e-6 and abs(V_th - V_ph) < 1e-9)

# ── MMPg: a width taken along an FIM eigendirection is chart-dependent ────────────────────────
def pushed(Mg, Jmap):
    E, Q = ev(Mg)
    out = []
    for k in (0, 1):
        w = sp.Matrix([float(Q[0, k]), float(Q[1, k])])
        u = Jmap * w
        out.append(u / u.norm())
    return out
gt0 = at(g_e, 1, sp.Rational(6, 5)).evalf(40); J0 = at(JY, 1, sp.Rational(6, 5)).evalf(40)
A0 = sp.diag(1, sp.Rational(6, 5))
Au = sp.diag(1, 10)                                              # change of units θ = diag(1, 10)θ′ (as in MMIb)
angle = lambda U, V: [float(sp.acos(min(1, abs((a.T * b)[0])))) * 180 / float(sp.pi) for a, b in zip(U, V)]
u_th = pushed(gt0, J0)
ang = angle(u_th, pushed(A0.T * gt0 * A0, J0 * A0)); angu = angle(u_th, pushed(Au.T * gt0 * Au, J0 * Au))
card("MMPg", f"[width vs proxy] at θ = (1, 6/5) of F-C, the FIM eigendirections of different charts, pushed forward to prediction space (J_Y v and J_Y A w), point in different directions: rotated by {ang[0]:.3g}° for λ = log θ and by {angu[0]:.3g}° for the change of units θ = diag(1, 10)θ′. A width measured along 'the FIM eigendirections' of a chosen chart is chart-dependent unless the directions are fixed geometrically in prediction space; a width defined from the image set and a fixed prediction metric is not affected by this",
     min(ang) > 0.1 and min(angu) > 1)

# ── MMPh: raw Hessian eigenvalues: not even tensorial off a critical point ────────────────────
y0 = at(Y, 1, 2)
C = ((Y - y0).T * (Y - y0))[0] / 2
Hth = sp.hessian(C, (t1, t2))
l1, l2 = sp.symbols('l1 l2', real=True)
Cl = C.subs({t1: sp.exp(l1), t2: sp.exp(l2)})
Hl = sp.hessian(Cl, (l1, l2))
Al = sp.diag(sp.exp(l1), sp.exp(l2))
extra = (Hl - Al.T * Hth.subs({t1: sp.exp(l1), t2: sp.exp(l2)}) * Al)
gradC = sp.Matrix([C.diff(t1), C.diff(t2)])
off = extra.subs({l1: 0, l2: sp.log(3)}).evalf(30)
crit = extra.subs({l1: 0, l2: sp.log(2)}).evalf(30)
card("MMPh", "[raw Hessian] for the cost C = ½|Y(θ) − Y(1, 2)|², the Hessian in λ = log θ is H_λ = Aᵀ H_θ A + diag(θᵢ ∂C/∂θᵢ): off the critical point (at θ = (1, 3)) the extra term is nonzero, so the Hessian matrix does not even transform as a tensor there; at the best fit θ* = (1, 2) it does, and H_θ = J_Yᵀ J_Y = g_θ (zero residual). Raw Hessian eigenvalues are chart-dependent proxies",
     sp.simplify(extra - sp.diag(sp.exp(l1) * gradC[0].subs({t1: sp.exp(l1), t2: sp.exp(l2)}), sp.exp(l2) * gradC[1].subs({t1: sp.exp(l1), t2: sp.exp(l2)}))) == sp.zeros(2, 2)
     and max(abs(x) for x in off) > 1e-6 and max(abs(x) for x in crit) < 1e-20 and sp.simplify(at(Hth, 1, 2) - at(g_e, 1, 2)) == sp.zeros(2, 2))

# ── MMPi: parameter-domain boundary, limits, image boundary are different objects ─────────────
tt = sp.Symbol('t', positive=True); lam2 = sp.Symbol('lam2', real=True)
Yt = sp.exp(-t1 * tt) + sp.exp(-t2 * tt)
fin = sp.limit(Yt, t2, 0, '+'); inf_ch = sp.limit(Yt.subs(t2, sp.exp(lam2)), lam2, -sp.oo)
Ys = sp.exp(-(t1 + t2) * tt)
edge_val = Ys.subs({t1: 0, t2: s_})
inside = Ys.subs({t1: s_ / 2, t2: s_ / 2})
eps = sp.Symbol('eps', positive=True)
q = sp.Matrix([sp.Rational(1, 2), sp.Rational(1, 4), sp.Rational(1, 8) + eps])   # (u, u², u³) at u = 1/2, moved along e₃
card("MMPi", "[boundary language] (1) the parameter-domain boundary θ₂ = 0 of Θ = (0, ∞)² is a finite boundary point in θ but lies at λ₂ → −∞ in λ = log θ; the image limit e^{−θ₁t} + 1 is the same in both charts. (2) for Y = e^{−(θ₁+θ₂)t}, the boundary part {θ₁ = 0, θ₂ = s > 0} of Θ maps to e^{−st} = Y(s/2, s/2), already inside Y(Θ): a parameter-domain boundary that gives no new boundary of the image. (3) a model image of lower dimension than P has empty interior in P (the point (1/2, 1/4, 1/8 + ε) is off the curve (u, u², u³) for every ε > 0), so its ordinary topological boundary in P is its whole closure: not the boundary meant by MBAM",
     sp.simplify(fin - (sp.exp(-t1 * tt) + 1)) == 0 and sp.simplify(inf_ch - (sp.exp(-t1 * tt) + 1)) == 0
     and sp.simplify(edge_val - inside) == 0 and sp.solve([q[0] - th, q[1] - th**2, q[2] - th**3], th, dict=True) == [])

# ── MMPj: an edge of the image from interior rank-drop points ─────────────────────────────────
s, p = sp.symbols('s p', positive=True)
Cser = lambda x: 1 + x / 2 + x**2 / 24 + x**3 / 720 + x**4 / 40320          # cosh(√x) = Σ xᵏ/(2k)!, truncated (derivatives at x = 0 exact)
Yt_sp = [2 * sp.exp(-s * t / 2) * Cser(t**2 * (s**2 / 4 - p)) for t in ts]
Jsp = sp.Matrix(Yt_sp).jacobian(sp.Matrix([s, p])).subs({s: 2, p: 1})
ident = sp.expand((sp.exp(-t1 * tt) + sp.exp(-t2 * tt) - 2 * sp.exp(-(t1 + t2) * tt / 2) * sp.cosh((t1 - t2) * tt / 2)).rewrite(sp.exp)) == 0
card("MMPj", "[image boundary stratum from interior points] F-C is symmetric, Y_t = 2e^{−st/2} cosh(t√(s²/4 − p)) with s = θ₁ + θ₂, p = θ₁θ₂, and s²/4 − p = (θ₁ − θ₂)²/4 ≥ 0 with equality exactly on the diagonal. In (s, p) the map has rank 2 at the diagonal point (s, p) = (2, 1) although J_Y has rank 1 there: near Y(1, 1) the image is the image of the half-plane p ≤ s²/4, a 2-dimensional piece with an edge, and the edge comes from the diagonal, which is interior to Θ, not from ∂Θ",
     ident and Jsp.rank() == 2 and sp.expand((t1 + t2)**2 / 4 - t1 * t2 - (t1 - t2)**2 / 4) == 0 and at(JY, 1, 1).rank() == 1)

# ── MMPk: the function-space formula is example-specific; dim P = ∞, dim M finite ─────────────
T = sp.Symbol('T', positive=True); a1, a2 = sp.symbols('a1 a2', real=True)
lin = [sp.exp(-T), sp.exp(-2 * T)]
g_lin = sp.Matrix(2, 2, lambda i, j: sp.integrate(lin[i] * lin[j], (T, 0, sp.oo)))
gram6 = sp.Matrix(6, 6, lambda i, j: sp.Rational(1, (i + 1) + (j + 1)))
card("MMPk", "[function-space example] g_ij = 2/(θᵢ + θⱼ)³ is the Fisher metric of the specific model Y(T) = e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞) (MMIh), not a general formula: the model Y(T) = θ₁e^{−T} + θ₂e^{−2T} in the same space has the constant metric [[1/2, 1/3], [1/3, 1/4]]. dim P = ∞ (the exponentials e^{−aT}, a = 1, …, 6, are independent: Gram det ≠ 0; a Cauchy matrix for every N) while dim of the model image is 2",
     g_lin == sp.Matrix([[sp.Rational(1, 2), sp.Rational(1, 3)], [sp.Rational(1, 3), sp.Rational(1, 4)]]) and gram6.det() != 0 and g_lin.det() != 0)

# ── MMPl: a dimension drop is a property of the model and the limit ───────────────────────────
r = sp.Symbol('r', positive=True)
both = sp.limit(Yt.subs({t1: r, t2: r}), r, sp.oo)
div = sp.limit(sp.exp(-t1 * tt) + t2 * tt, t2, sp.oo)
osc = sp.limit(sp.sin(t2), t2, sp.oo)
card("MMPl", "[limit-specific dimension drop] for F-C, θ₂ → ∞ gives the 1-dimensional face e^{−θ₁t} (MMIg) but θ₁ = θ₂ = r → ∞ gives the single point Y = 0; for Y = e^{−θ₁t} + θ₂t, θ₂ → ∞ has no limit in P (it diverges); for Y = e^{−θ₁t} + sin(θ₂)t, θ₂ → ∞ has no limit (it oscillates). 'Sending a parameter to infinity drops the dimension 2 → 1' is a result of the F-C example and that limit, not a theorem about parameters",
     both == 0 and div == sp.oo and isinstance(osc, sp.AccumBounds))

# ── MMPm: c: representation normalization vs the degenerate limiting form ─────────────────────
c = sp.Symbol('c', positive=True)
eta1, etac, Pc = sp.diag(1, -1), sp.diag(1, -1 / c**2), sp.diag(1, 1 / c)
lim = etac.applyfunc(lambda e: sp.limit(e, c, sp.oo))
Pg = sp.Matrix(2, 2, sp.symbols('q0:4', real=True))
card("MMPm", "[c: three roles kept apart] on (t, x), η_c = diag(1, −1/c²). Role 1 (representation): for each finite c, η_c = P_cᵀ diag(1, −1) P_c with P_c = diag(1, 1/c), a rescaling of x; this is a statement about the matrix representation, not about the physical role of c. Role 3 (theory family): lim_{c→∞} η_c = diag(1, 0), a degenerate limiting bilinear form (rank 1). Since det(Pᵀ η P) = det(P)² det η, no invertible change of representation takes a nondegenerate η_c to it: the limit is not a coordinate change inside one finite-c form. Its kernel is span{(0, 1)}: it gives 0 for every purely spatial displacement, so it does not by itself supply spatial distances (Galilean / Newton–Cartan structure needs more; not carded)",
     Pc.T * eta1 * Pc == etac and lim == sp.diag(1, 0) and lim.rank() == 1 and sp.expand((Pg.T * eta1 * Pg).det() - Pg.det()**2 * eta1.det()) == 0
     and lim * sp.Matrix([0, 1]) == sp.zeros(2, 1))

# ── MMPn: the named measurement channel ──────────────────────────────────────────────────────
hb = sp.Symbol('hbar', positive=True)
up, dn = sp.Matrix([1, 0]), sp.Matrix([0, 1]); I2 = sp.eye(2)
sx, sz = sp.Matrix([[0, 1], [1, 0]]), sp.Matrix([[1, 0], [0, -1]])
Sz = hb / 2 * (K(sz, I2) + K(I2, sz))
ud, du = K(up, dn), K(dn, up)
Atr, Bsg = (ud + du) / sp.sqrt(2), (ud - du) / sp.sqrt(2)        # |1,0>, |0,0>
rho = ud * ud.H
Ps = Bsg * Bsg.H; Pt = sp.eye(4) - Ps                             # S² spectral projectors (triplet, singlet)
D = lambda R: Pt * R * Pt + Ps * R * Ps
xp, xm = (up + dn) / sp.sqrt(2), (up - dn) / sp.sqrt(2)
Qp, Qm = K(xp * xp.H, I2), K(xm * xm.H, I2)                       # S_x^(1) projectors
E = lambda R: Qp * R * Qp + Qm * R * Qm
comm = lambda X, Yo: sp.simplify(X * Yo - Yo * X)
card("MMPn", "[named channel] the existing construction (W1d, W2a, W2b) uses D(ρ) = P_t ρ P_t + P_s ρ P_s, the non-selective projective measurement of total spin S² (P_t, P_s: triplet and singlet projectors), on ρ = |ud⟩⟨ud|, |ud⟩ = (|1,0⟩ + |0,0⟩)/√2. It removes exactly the off-diagonal terms ⟨1,0|ρ|0,0⟩ = ⟨0,0|ρ|1,0⟩ = 1/2 between the measured eigenspaces. S_z = 0 survives for a checked reason: [P_t, S_z] = [P_s, S_z] = 0 and S_z ρ = 0 give S_z D(ρ) = 0. It is not generic: the non-selective S_x⁽¹⁾ measurement on the same state gives Tr(S_z E(ρ)) = −ħ/2 ([Q±, S_z] ≠ 0)",
     sp.simplify((Atr.H * rho * Bsg)[0] - sp.Rational(1, 2)) == 0 and sp.simplify((Atr.H * D(rho) * Bsg)[0]) == 0
     and comm(Pt, Sz) == sp.zeros(4, 4) and comm(Ps, Sz) == sp.zeros(4, 4) and sp.simplify(Sz * rho) == sp.zeros(4, 4) and sp.simplify(Sz * D(rho)) == sp.zeros(4, 4)
     and sp.simplify((Sz * E(rho)).trace() + hb / 2) == 0 and comm(Qp, Sz) != sp.zeros(4, 4))

# ── MMPo: observation-type maps are different operations ─────────────────────────────────────
P3 = sp.eye(3) - sp.ones(3, 3) / 3
Dr = sp.simplify(D(rho))
j1 = sp.Matrix([[sp.Rational(1, 4)] * 2] * 2); j2 = sp.diag(sp.Rational(1, 2), sp.Rational(1, 2))
marg = lambda Jt: (tuple(Jt * sp.ones(2, 1)), tuple(sp.ones(1, 2) * Jt))
Kc = sp.Symbol('K', positive=True)
rg = lambda k: sp.atanh(sp.tanh(k)**2)
k1, k2 = rg(sp.Integer(1)), rg(rg(sp.Integer(1)))
card("MMPo", "[observation-type maps are different operations] projection Pₙ (n = 3): linear and idempotent on vectors (P² = P). Measurement channel D: idempotent on density matrices (D∘D = D), but D(|ud⟩⟨ud|) has rank 2 and purity 1/2, so D is not induced by any map on state vectors (ρ ↦ KρK†/Tr keeps a pure state pure). Marginalization: the joints [[1/4, 1/4], [1/4, 1/4]] and diag(1/2, 1/2) have the same marginals; it maps to a different space. Decimation RG: tanh K′ = tanh²K acts on couplings and is not idempotent (K = 1: K′ ≠ K″). A boundary limit is not a map on states (MMIg); non-identifiability is a property of Y's fibers (MMPb). Same questions, different operations: their unification is OPEN",
     P3 * P3 == P3 and sp.simplify(D(Dr) - Dr) == sp.zeros(4, 4) and Dr.rank() == 2 and sp.simplify((Dr * Dr).trace() - sp.Rational(1, 2)) == 0
     and j1 != j2 and marg(j1) == marg(j2) and abs(float(k1 - k2)) > 1e-3)
