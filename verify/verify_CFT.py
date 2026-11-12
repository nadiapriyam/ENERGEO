"""CFT: the CF11-B Fisher / Riemannian test (Foundation Completion Pass 3, 2026-11-12).

Preregistration: research/constructions/cf11b_fisher_prereg.md, committed at e6f3db8 before this file existed.
Cards CFT1–CFT10 are the preregistered list (prereg §13). CFT11a is an extra observation made while writing the
cards; it is labelled "not preregistered" and does not enter the decision rule (prereg §8).

Notation: P1 = invariance F*T = T (active map F); P2 = naturality of a construction under a reparametrization
(T_(p∘θ) = θ*T_p, components g_φ = Jᵀ g J; passive); P3 = equivariance of an operator (A C = C A).
Run: python3 verify/verify_CFT.py"""
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


Z = lambda n, m=None: sp.zeros(n, m or n)
oo = sp.oo


def pull(F, X, M):
    """Coordinate expression of F*T: dF(x)ᵀ M(F(x)) dF(x); M is a function returning the matrix at a point."""
    dF = sp.Matrix(F).jacobian(sp.Matrix(X))
    return sp.simplify(dF.T * M(*F) * dF)


def brioschi(E, F, G, u, v):
    """Gaussian curvature of E du² + 2F du dv + G dv² (Brioschi formula)."""
    Eu, Ev, Fu, Fv, Gu, Gv = [sp.diff(a, b) for a, b in ((E, u), (E, v), (F, u), (F, v), (G, u), (G, v))]
    A = sp.Matrix([[-sp.diff(E, v, 2) / 2 + sp.diff(F, u, v) - sp.diff(G, u, 2) / 2, Eu / 2, Fu - Ev / 2],
                   [Fv - Gu / 2, E, F], [Gv / 2, F, G]])
    B = sp.Matrix([[0, Ev / 2, Gu / 2], [Ev / 2, E, F], [Gu / 2, F, G]])
    return (A.det() - B.det()) / (E * G - F**2)**2


# ── CFT1: the constant-form bridge (BR-CF-PULLBACK) ─────────────────────────────────────────────
n = 3
A = sp.Matrix(n, n, lambda i, j: sp.Symbol(f'a{i}{j}', real=True))
M = sp.Matrix(n, n, lambda i, j: sp.Symbol(f'm{i}{j}', real=True))
u = sp.Matrix(sp.symbols('u0:3', real=True)); v = sp.Matrix(sp.symbols('v0:3', real=True))
pb = ((A * u).T * M * (A * v))[0]                       # (F*B)(u, v) = B(dF u, dF v) for F(x) = Ax
Ac = sp.Matrix(2, 2, lambda i, j: sp.Symbol(f'p{i}{j}') + sp.I * sp.Symbol(f'q{i}{j}'))
Hc = sp.Matrix(2, 2, lambda i, j: sp.Symbol(f'h{i}{j}'))
uc = sp.Matrix(sp.symbols('w0:2')); vc = sp.Matrix(sp.symbols('z0:2'))
pbc = ((Ac * uc).H * Hc * (Ac * vc))[0]
card("CFT1a", "[BR-CF-PULLBACK | CF1] for a linear map F(x) = Ax and a constant bilinear form B_M, (F*B)(u, v) = B(Au, Av) = uᵀ(AᵀMA)v exactly (generic 3×3 A, M); hence F*B = B ⟺ AᵀMA = M. Sesquilinear case: (F*h)(u, v) = u†(A†HA)v (generic complex 2×2), so F*h = h ⟺ A†HA = H. The matrix law is the coordinate form of pullback invariance",
     sp.expand(pb - (u.T * (A.T * M * A) * v)[0]) == 0 and sp.expand(pbc - (uc.H * (Ac.H * Hc * Ac) * vc)[0]) == 0)

x, y, s = sp.symbols('x y s', real=True)
f1, f2 = sp.Function('f1')(x, y), sp.Function('f2')(x, y)
mf = [[sp.Function(f'M{i}{j}') for j in range(2)] for i in range(2)]
Mfield = lambda a, b: sp.Matrix(2, 2, lambda i, j: mf[i][j](a, b))
u2 = sp.Matrix(sp.symbols('u0:2', real=True))
curve_img = sp.Matrix([f1, f2]).subs({x: x + s * u2[0], y: y + s * u2[1]}, simultaneous=True)
vel = sp.simplify(curve_img.diff(s).subs(s, 0))          # (F∘γ)'(0) for γ(s) = x + s u
dF = sp.Matrix([f1, f2]).jacobian(sp.Matrix([x, y]))
lhs = (vel.T * Mfield(f1, f2) * vel)[0]                 # T_{F(x)} applied to the image velocity
card("CFT1b", "[BR-CF-PULLBACK] for an arbitrary smooth F = (f₁, f₂) on ℝ² and an arbitrary tensor field T with matrix M(x), the pullback computed from curves, T_{F(x)}((F∘γ)'(0), (F∘γ)'(0)), equals uᵀ dF(x)ᵀ M(F(x)) dF(x) u; so F*T = T ⟺ dF(x)ᵀ M(F(x)) dF(x) = M(x) at every x. For constant M this is AᵀMA = M with A = dF(x) at each point",
     sp.simplify(vel - dF * u2) == Z(2, 1) and sp.simplify(lhs - (u2.T * dF.T * Mfield(f1, f2) * dF * u2)[0]) == 0)

th = sp.symbols('theta', real=True)
R = sp.Matrix([[sp.cos(th), -sp.sin(th)], [sp.sin(th), sp.cos(th)]])
Sh = sp.Matrix([[1, s], [0, 1]])
eta = sp.diag(1, -1)
Bo = sp.Matrix([[sp.cosh(s), sp.sinh(s)], [sp.sinh(s), sp.cosh(s)]])
Gm = sp.Matrix([[1, 2], [0, 1]])
card("CFT1c", "[CF1 | failure tests] Euclidean: a rotation satisfies RᵀIR = I; the shear [[1, s], [0, 1]] fails for s ≠ 0. Lorentz (η = diag(1, −1)): a boost satisfies ΛᵀηΛ = η; the matrix [[1, 2], [0, 1]] fails",
     sp.simplify(R.T * R) == sp.eye(2) and sp.simplify(Sh.T * Sh - sp.eye(2)) != Z(2) and sp.simplify(Bo.T * eta * Bo) == eta and Gm.T * eta * Gm != eta)

c1, c2 = sp.symbols('c1 c2', real=True)
rigid = [sp.cos(th) * x - sp.sin(th) * y + c1, sp.sin(th) * x + sp.cos(th) * y + c2]
nonlin = [x + y**2, y]
I2 = lambda a, b: sp.eye(2)
card("CFT1d", "[CF1 | nonlinear maps of a flat metric] an affine rigid motion preserves the Euclidean metric (F*δ = δ); the nonlinear F(x, y) = (x + y², y) does not (dFᵀdF = [[1, 2y], [2y, 1 + 4y²]]). That every isometry of a flat metric is affine is the textbook rigidity theorem, cited, not proved here",
     pull(rigid, [x, y], I2) == sp.eye(2) and pull(nonlin, [x, y], I2) == sp.Matrix([[1, 2 * y], [2 * y, 1 + 4 * y**2]]))

# ── CFT2: symplectic ───────────────────────────────────────────────────────────────────────────
q1, q2, p1, p2 = sp.symbols('q1 q2 p1 p2', real=True)
W = sp.Function('W')(q1, q2)
J4 = sp.Matrix([[0, 0, 1, 0], [0, 0, 0, 1], [-1, 0, 0, 0], [0, -1, 0, 0]])
Fs = [q1, q2, p1 + sp.diff(W, q1), p2 + sp.diff(W, q2)]
Jc = lambda *a: J4
card("CFT2a", "[CF6 | P1, nonlinear] for an arbitrary smooth W(q), F(q, p) = (q, p + ∇W(q)) on ℝ⁴ satisfies dF(x)ᵀ J dF(x) = J at every point, i.e. F*ω = ω, although F is nonlinear (the Hessian of W is symmetric). The same pullback law as CFT1, with T = ω antisymmetric",
     pull(Fs, [q1, q2, p1, p2], Jc) == J4)
Fbad = [q1, q2, 2 * p1, 2 * p2]
card("CFT2b", "[CF6 | failure test] F(q, p) = (q, 2p) is not symplectic: F*ω = 2ω ≠ ω",
     pull(Fbad, [q1, q2, p1, p2], Jc) == 2 * J4)
q, p = sp.symbols('q p', real=True)
J2 = sp.Matrix([[0, 1], [-1, 0]])
Fs2 = [q, p + q**2]
card("CFT2c", "[CF6 vs CF1] one law, different preserving classes: F(q, p) = (q, p + q²) preserves ω (dFᵀJdF = J) but not the Euclidean metric (dFᵀdF ≠ I). Which maps are admissible is fixed by T, not by the equation F*T = T alone",
     pull(Fs2, [q, p], lambda *a: J2) == J2 and pull(Fs2, [q, p], I2) != sp.eye(2))

# ── Fisher metrics from densities ──────────────────────────────────────────────────────────────
X = sp.Symbol('X', real=True)


def fisher_cont(logp, params, dens):
    sc = [sp.diff(logp, a) for a in params]
    return sp.Matrix(len(params), len(params), lambda i, j: sp.simplify(sp.integrate(sp.expand(sc[i] * sc[j] * dens), (X, -oo, oo), conds='none')))


mu, phi, b = sp.symbols('mu phi b', real=True)
s0 = sp.symbols('sigma0', positive=True)
logpA = -(X - mu)**2 / (2 * s0**2) - sp.log(sp.sqrt(2 * sp.pi) * s0)
gA = fisher_cont(logpA, [mu], sp.exp(logpA))
card("CFT3a", "[F-A | CF10] Gaussian location family N(μ, σ₀²), σ₀ known: g(μ) = E[(∂_μ log p)²] = 1/σ₀², computed from the density (constant)",
     gA == sp.Matrix([[1 / s0**2]]))
gAf = lambda m_: sp.Matrix([[1 / s0**2]])
card("CFT3b", "[F-A | P1] μ ↦ μ + b and μ ↦ b − μ are isometries (F*g = g); μ ↦ 2μ is not (F*g = 4g)",
     pull([mu + b], [mu], gAf) == gAf(mu) and pull([b - mu], [mu], gAf) == gAf(mu) and pull([2 * mu], [mu], gAf) == 4 * gAf(mu))
mu_of = phi + phi**3
logpAphi = logpA.subs(mu, mu_of)
g_phi_direct = fisher_cont(logpAphi, [phi], sp.exp(logpAphi))
Jphi = sp.Matrix([[sp.diff(mu_of, phi)]])
g_phi_law = sp.simplify(Jphi.T * gA * Jphi)
dphi = sp.Symbol('dphi', real=True)
card("CFT3c", "[F-A | Type A, P2] under the nonlinear reparametrization μ = φ + φ³, the Fisher metric computed directly from the reparametrized density equals the tensor law Jᵀ g J = (1 + 3φ²)²/σ₀², which is NOT constant: the components change, ds² = g_φ dφ² = g_μ dμ² (dμ = (1 + 3φ²)dφ) is unchanged. A constant metric can look varying in nonlinear coordinates",
     sp.simplify(g_phi_direct - g_phi_law) == Z(1) and sp.simplify(g_phi_direct[0] - (1 + 3 * phi**2)**2 / s0**2) == 0 and sp.diff(g_phi_direct[0], phi) != 0
     and sp.simplify(g_phi_direct[0] * dphi**2 - gA[0] * (sp.diff(mu_of, phi) * dphi)**2) == 0)

# ── CFT4: F-B, the normal family ──────────────────────────────────────────────────────────────
sg = sp.symbols('sigma', positive=True)
logpB = -(X - mu)**2 / (2 * sg**2) - sp.log(sp.sqrt(2 * sp.pi) * sg)
gB = fisher_cont(logpB, [mu, sg], sp.exp(logpB))
card("CFT4a", "[F-B | CF10] normal family N(μ, σ²) in (μ, σ): g = diag(1/σ², 2/σ²), computed from the density",
     gB == sp.diag(1 / sg**2, 2 / sg**2))
KB = sp.simplify(brioschi(gB[0, 0], gB[0, 1], gB[1, 1], mu, sg))
card("CFT4b", "[F-B | intrinsic nonconstancy] the Gaussian curvature of the normal family's Fisher metric is K = −1/2 (Brioschi formula). K ≠ 0 is a coordinate invariant, so no coordinate system makes this metric constant: the variation is genuine, not a coordinate artifact",
     KB == sp.Rational(-1, 2))
e1 = sp.Symbol('eta1', real=True); kk = sp.Symbol('k', positive=True)   # η₂ = −k < 0
logp_eta = e1 * X - kk * X**2 - e1**2 / (4 * kk) - sp.log(sp.sqrt(sp.pi / kk))   # N(μ, σ²) written in natural parameters (η₁, η₂ = −k)
g_k_direct = fisher_cont(logp_eta, [e1, kk], sp.exp(logp_eta))
Jnat = sp.diag(1, -1)                                         # ∂(η₁, η₂)/∂(η₁, k)
g_eta_direct = sp.simplify(Jnat.T * g_k_direct * Jnat)        # components in (η₁, η₂)
mu_eta, sg_eta = e1 / (2 * kk), 1 / sp.sqrt(2 * kk)           # μ = −η₁/(2η₂), σ = (−2η₂)^(−1/2)
J_th_eta = sp.Matrix([mu_eta, sg_eta]).jacobian(sp.Matrix([e1, kk])) * Jnat   # ∂(μ, σ)/∂(η₁, η₂)
g_eta_law = sp.simplify(J_th_eta.T * gB.subs({mu: mu_eta, sg: sg_eta}) * J_th_eta)
K_eta = sp.simplify(brioschi(g_k_direct[0, 0], g_k_direct[0, 1], g_k_direct[1, 1], e1, kk))
pt = {e1: 1, kk: sp.Rational(1, 2)}                            # (μ, σ) = (1, 1)
deta = sp.Matrix(sp.symbols('d1 d2', real=True))
ds2_eta = (deta.T * g_eta_direct * deta)[0]
dth = J_th_eta * deta
ds2_th = (dth.T * gB.subs({mu: mu_eta, sg: sg_eta}) * dth)[0]
card("CFT4c", "[F-B | Type A, P2] in natural parameters (η₁, η₂) = (μ/σ², −1/(2σ²)) the Fisher metric computed directly from the density in η equals the tensor law Jᵀ g(θ(η)) J; its components differ from those in (μ, σ) (at (μ, σ) = (1, 1): " + str(list(g_eta_direct.subs(pt))) + " vs [1, 0, 0, 2]); ds² agrees for every tangent vector; the curvature computed in η is again −1/2",
     sp.simplify(g_eta_direct - g_eta_law) == Z(2) and g_eta_direct.subs(pt) != gB.subs({mu: 1, sg: 1}) and sp.simplify(ds2_eta - ds2_th) == 0 and K_eta == sp.Rational(-1, 2))
aa, bb = sp.symbols('a b', real=True)
apos = sp.Symbol('a', positive=True)
gBf = lambda m_, s_: sp.diag(1 / s_**2, 2 / s_**2)
iso_ls = pull([apos * mu + bb, apos * sg], [mu, sg], gBf) == gBf(mu, sg)
iso_ref = pull([-mu, sg], [mu, sg], gBf) == gBf(mu, sg)
non1 = pull([mu + sg, sg], [mu, sg], gBf) != gBf(mu, sg)
non2 = pull([mu, sg**2], [mu, sg], gBf) != gBf(mu, sg)
push = sp.simplify(sp.exp(logpB).subs(X, (X - bb) / apos) / apos - sp.exp(logpB.subs({mu: apos * mu + bb, sg: apos * sg})))
card("CFT4d", "[F-B | Type B, P1] the data map x ↦ ax + b (a > 0) sends N(μ, σ²) to N(aμ + b, a²σ²) (pushforward density checked), so the system supplies F(μ, σ) = (aμ + b, aσ); F*g = g holds for it and for the reflection (μ, σ) ↦ (−μ, σ); the non-isometries (μ, σ) ↦ (μ + σ, σ) and (μ, σ) ↦ (μ, σ²) fail F*g = g",
     push == 0 and iso_ls and iso_ref and non1 and non2)
x0 = {mu: 0, sg: 1}
vt = sp.Matrix([0, 1])
len_th = (vt.T * gB.subs(x0) * vt)[0]
pt0 = {e1: 0, kk: sp.Rational(1, 2)}                          # (μ, σ) = (0, 1)
v_eta = J_th_eta.subs(pt0).inv() * vt                         # the same tangent vector in η components
len_eta = (v_eta.T * g_eta_direct.subs(pt0) * v_eta)[0]
dFn = sp.Matrix([[1, 1], [0, 1]]); Fx = {mu: 1, sg: 1}        # F(μ, σ) = (μ + σ, σ) maps (0, 1) to (1, 1)
len_active = ((dFn * vt).T * gB.subs(Fx) * (dFn * vt))[0]
card("CFT4e", "[F-B | Type A vs Type B] the tangent vector v = ∂_σ at (μ, σ) = (0, 1) has squared length " + str(len_th) + " in (μ, σ) components and " + str(sp.simplify(len_eta)) + " in η components (passive: same vector, same length); the active non-isometry F(μ, σ) = (μ + σ, σ) sends it to a vector of squared length " + str(len_active) + " (active: the geometry is not preserved)",
     sp.simplify(len_eta - len_th) == 0 and len_active != len_th)

# ── CFT5: F-C and F-C′, the project's sums of exponentials ─────────────────────────────────────
t1, t2 = sp.symbols('theta1 theta2', positive=True)
ts = [1, 2, 3]
def model(amp2):
    Y = sp.Matrix([sp.exp(-t1 * t) + amp2 * sp.exp(-t2 * t) for t in ts])
    Jm = Y.jacobian(sp.Matrix([t1, t2]))
    return Jm, Jm.T * Jm
JC, gC = model(1)
JCp, gCp = model(2)
gCf = lambda a_, b_: gC.subs({t1: a_, t2: b_}, simultaneous=True)
gCpf = lambda a_, b_: gCp.subs({t1: a_, t2: b_}, simultaneous=True)
card("CFT5a", "[F-C | Type B, P1] the exchange S(θ₁, θ₂) = (θ₂, θ₁) of the two identical terms satisfies S*g = g for Y = e^{−θ₁t} + e^{−θ₂t}; for the control Y = e^{−θ₁t} + 2e^{−θ₂t} it fails (S*g ≠ g): the symmetry is supplied by the first model and not by the second",
     sp.simplify(pull([t2, t1], [t1, t2], gCf) - gC) == Z(2) and sp.simplify(pull([t2, t1], [t1, t2], gCpf) - gCp) != Z(2))
tt = sp.Symbol('t', positive=True)
diag = {t1: tt, t2: tt}
card("CFT5b", "[F-C | Level 3, preregistered lemma] at every fixed point θ₁ = θ₂ of the isometry S, J v = 0 for the dS-antisymmetric v = (1, −1): an exact null of g = JᵀJ (rank 1), as predicted before the card from Y∘S = Y",
     sp.simplify(JC.subs(diag) * sp.Matrix([1, -1])) == Z(3, 1) and gC.subs(diag).rank(simplify=True) == 1)
card("CFT5c", "[F-C′ | Level 3, control] without the exchange symmetry the diagonal still carries an exact null: for Y = e^{−θ₁t} + 2e^{−θ₂t}, J(2, −1) = 0 at θ₁ = θ₂ (rank g = 1). The symmetry is sufficient for the null, not necessary: the null comes from the two terms coinciding in shape",
     sp.simplify(JCp.subs(diag) * sp.Matrix([2, -1])) == Z(3, 1) and gCp.subs(diag).rank(simplify=True) == 1)
l1, l2 = sp.symbols('lambda1 lambda2', real=True)
Jexp = sp.diag(sp.exp(l1), sp.exp(l2))                          # θ = e^λ
gL = sp.simplify(Jexp.T * gC.subs({t1: sp.exp(l1), t2: sp.exp(l2)}) * Jexp)
ll = sp.Symbol('l', real=True)
gLd = gL.subs({l1: ll, l2: ll})
vL = Jexp.subs({l1: ll, l2: ll}).inv() * sp.Matrix([1, -1])
card("CFT5d", "[F-C | Type A] under θ = e^λ the null survives as a tangent vector: on the diagonal rank g_λ = 1 and g_λ v_λ = 0 for v_λ = J⁻¹(1, −1); off the diagonal rank g_λ = 2 at (λ₁, λ₂) = (0, 1). Rank and null directions are coordinate invariants",
     gLd.rank(simplify=True) == 1 and sp.simplify(gLd * vL) == Z(2, 1) and gL.subs({l1: 0, l2: 1}).rank() == 2)
ev_th = sorted(sp.N(e, 30) for e in gC.subs({t1: 1, t2: sp.Rational(6, 5)}).eigenvals())
ev_la = sorted(sp.N(e, 30) for e in gL.subs({l1: 0, l2: sp.log(sp.Rational(6, 5))}).eigenvals())
detok = sp.simplify(gL.det() - (Jexp.det())**2 * gC.subs({t1: sp.exp(l1), t2: sp.exp(l2)}).det()) == 0
card("CFT5e", "[F-C | boundary result] the eigenvalues of the component matrix g are NOT coordinate invariants: at the same point, θ = (1, 6/5) gives " + ', '.join(f'{float(e):.4g}' for e in ev_th) + " while λ = log θ gives " + ', '.join(f'{float(e):.4g}' for e in ev_la) + "; det g transforms by (det J)². A sloppy spectrum read from g's components depends on the parametrization; rank does not",
     abs(ev_th[0] - ev_la[0]) > 1e-6 and abs(ev_th[1] - ev_la[1]) > 1e-6 and detok)
KC = brioschi(gC[0, 0], gC[0, 1], gC[1, 1], t1, t2)
Kp1 = sp.N(KC.subs({t1: 1, t2: 2}), 30); Kp2 = sp.N(KC.subs({t1: 1, t2: 3}), 30)
card("CFT5f", f"[F-C | Erlangen boundary] the Gaussian curvature of the F-C Fisher metric varies: K(1, 2) = {float(Kp1):.4g}, K(1, 3) = {float(Kp2):.4g}. An isometry maps points to points of equal K, so no isometry group acts transitively: F-C is not a homogeneous geometry, and its structure is carried by g itself, not by a transformation group",
     abs(Kp1 - Kp2) > 1e-6)

# ── CFT6: F-B′, Bernoulli ──────────────────────────────────────────────────────────────────────
pp = sp.Symbol('p', positive=True); tb = sp.Symbol('vartheta', positive=True)
def fisher_bern(pexpr, var):
    return sp.simplify(sum(sp.diff(sp.log(pexpr) if xv else sp.log(1 - pexpr), var)**2 * (pexpr if xv else 1 - pexpr) for xv in (0, 1)))
gBer = fisher_bern(pp, pp)
gBth = fisher_bern(sp.sin(tb / 2)**2, tb)
gBerf = lambda a_: sp.Matrix([[1 / (a_ * (1 - a_))]])
card("CFT6a", "[F-B′] Bernoulli(p): g(p) = 1/(p(1 − p)) from the density", sp.simplify(gBer - 1 / (pp * (1 - pp))) == 0)
card("CFT6b", "[F-B′ | Type A] under p = sin²(ϑ/2) the Fisher metric computed from the reparametrized density is g_ϑ = 1, a constant: in one dimension a varying metric is a coordinate artifact (every 1D metric is flat), which is why F-B was certified by curvature",
     sp.simplify(gBth) == 1)
# CFT6b FAILED on its first ledger run (2026-11-12) because its check compared sp.simplify(g_ϑ) with the literal 1, and
# SymPy returns 2cos²(ϑ/2)/(1 + cos ϑ), which equals 1 but is not the literal 1. It is kept as it is. (A tidy-up edit
# made after the dry run, which had passed with the check sp.simplify(g_ϑ − 1) == 0, introduced the faulty comparison.)
card("CFT6b2", "[added after CFT6b FAILED: the check, not the claim, was wrong] under p = sin²(ϑ/2) the Bernoulli Fisher metric computed from the reparametrized density is g_ϑ = 2cos²(ϑ/2)/(1 + cos ϑ) ≡ 1 (g_ϑ − 1 simplifies to 0, and the identity 1 + cos ϑ = 2cos²(ϑ/2) is checked): in one dimension a varying metric is a coordinate artifact",
     sp.simplify(gBth - 1) == 0 and sp.simplify(sp.expand_trig(1 + sp.cos(tb) - 2 * sp.cos(tb / 2)**2)) == 0)
card("CFT6c", "[F-B′ | Type B, P1] relabelling the outcomes, p ↦ 1 − p, is an isometry (F*g = g); p ↦ p² is not (F*g = 4/(1 − p²) ≠ 1/(p(1 − p)))",
     sp.simplify(pull([1 - pp], [pp], gBerf) - gBerf(pp)) == Z(1) and sp.simplify(pull([pp**2], [pp], gBerf)[0] - 4 / (1 - pp**2)) == 0)

# ── CFT7: model change vs coordinate change ────────────────────────────────────────────────────
m1, m2 = sp.symbols('mu1 mu2', real=True)
logp2 = -(X - m1)**2 / 2 - sp.log(sp.sqrt(2 * sp.pi))   # one coordinate's density; the two are independent
g_two = sp.diag(fisher_cont(logp2, [m1], sp.exp(logp2))[0], fisher_cont(logp2.subs(m1, m2), [m2], sp.exp(logp2.subs(m1, m2)))[0])
K_two = sp.simplify(brioschi(g_two[0, 0], g_two[0, 1], g_two[1, 1], m1, m2))
card("CFT7a", "[model change] two independent unit-variance Gaussians with unknown means (μ₁, μ₂) have g = I and K = 0; the normal family (μ, σ) has K = −1/2. Curvature is a coordinate invariant, so no reparametrization relates the two: a different model, a different geometry (not a coordinate change)",
     g_two == sp.eye(2) and K_two == 0 and KB != K_two)
Lber = sp.integrate(1 / sp.sqrt(pp * (1 - pp)), (pp, 0, 1))
Lbin = sp.integrate(sp.sqrt(2 / (pp * (1 - pp))), (pp, 0, 1))
card("CFT7b", "[model change] total Fisher length over p ∈ (0, 1): Bernoulli π, Binomial(2, p) π√2. Length is invariant under reparametrization, so the two models are not isometric although they share the parameter p",
     sp.simplify(Lber - sp.pi) == 0 and sp.simplify(Lbin - sp.pi * sp.sqrt(2)) == 0)

# ── CFT8: weighted centering (boundary case) ───────────────────────────────────────────────────
mw = sp.Matrix([1, 2, 3]); Mt = sum(mw); one = sp.ones(3, 1)
D = sp.diag(*mw)
C = sp.eye(3) - one * mw.T / Mt
card("CFT8a", "[H4 / CF9 boundary] D = diag(1, 2, 3) is a metric (positive definite); C_m = I − 1mᵀ/M is a D-orthogonal projector: C_m² = C_m, D C_m = C_mᵀ D (D-self-adjoint), C_m 1 = 0",
     all(e > 0 for e in D.eigenvals()) and C * C == C and D * C == C.T * D and C * one == sp.zeros(3, 1))
card("CFT8b", "[H4 / CF9 boundary] C_m is not an isometry: C_mᵀ D C_m ≠ D (it is singular, it removes the direction 1). Weighted centering is a geometry-derived operator, not a structure-preserving transformation (not P1)",
     C.T * D * C != D)
def drefl(w):
    return sp.eye(3) - 2 * w * w.T * D / (w.T * D * w)[0]
Afix = drefl(sp.Matrix([1, 1, -1]))          # mᵀw = 0: a D-isometry fixing 1
Anot = drefl(sp.Matrix([1, 0, 0]))           # a D-isometry that does not preserve the line span{1}
Aflip = drefl(one)                           # the D-reflection sending 1 ↦ −1
wv = sp.Matrix([1, -1, 0]); Ash = sp.eye(3) + one * wv.T   # fixes 1, not a D-isometry
card("CFT8c", "[H4 | P3, equivariance] a D-isometry fixing 1 (D-reflection in w with mᵀw = 0) commutes with C_m; a D-isometry not preserving the line span{1} does not; a map fixing 1 that is not a D-isometry (I + 1wᵀ, wᵀ1 = 0) does not. Recorded as found: the D-reflection 1 ↦ −1 also commutes, so the exact commuting class among D-isometries is the stabilizer of the line span{1}",
     Afix.T * D * Afix == D and Afix * one == one and Afix * C == C * Afix and Anot.T * D * Anot == D and Anot * C != C * Anot
     and Ash * one == one and Ash.T * D * Ash != D and Ash * C != C * Ash and Aflip * one == -one and Aflip * C == C * Aflip)

# ── CFT9: Fourier (boundary case) ──────────────────────────────────────────────────────────────
N = 4
Fm = sp.Matrix(N, N, lambda j, k: sp.exp(-2 * sp.pi * sp.I * j * k / N))
U = Fm / 2
Tsh = sp.Matrix(N, N, lambda j, k: 1 if j == (k + 1) % N else 0)
Dg = sp.simplify(U * Tsh * U.H)
card("CFT9a", "[R5 / unitary row | P1] the unitary DFT U = F/√4 satisfies U†U = I: it preserves the Hermitian form (the complex constant-form row, A†HA = H with H = I)",
     sp.simplify(U.H * U) == sp.eye(N))
card("CFT9b", "[failure test] the unnormalized DFT has F†F = 4I ≠ I: it preserves the form only up to scale (P1 fails)",
     sp.simplify(Fm.H * Fm) == 4 * sp.eye(N))
card("CFT9c", "[R4] U diagonalizes the cyclic shift: U T U† is diagonal with the 4th roots of unity. Same mathematical structure, different meaning: the DFT is a symmetry of the Hilbert-space structure, not of physical spacetime",
     all(Dg[i, j] == 0 for i in range(N) for j in range(N) if i != j) and sorted(sp.simplify(Dg[i, i]**4) for i in range(N)) == [1, 1, 1, 1])

# ── CFT10: vacuity tests ───────────────────────────────────────────────────────────────────────
law = sp.simplify((Jphi.T * sp.Matrix([[1]]) * Jphi)[0])
card("CFT10a", "[refinement | P2 failure] the 'Euclidean parameter metric' (the identity matrix in whatever coordinates are used) is not a tensor: under μ = φ + φ³ the tensor law demands (1 + 3φ²)², not 1. P2 is a real constraint: the Fisher metric satisfies it (CFT3c, CFT4c), a coordinate-dependent pseudo-structure does not",
     sp.simplify(law - (1 + 3 * phi**2)**2) == 0 and law != 1)
card("CFT10b", "[refinement | P1 failure] the P1-preserving class is a proper subset in every domain: Euclidean (shear fails, CFT1c), Lorentz (CFT1c), symplectic (CFT2b), Fisher F-A (CFT3b), F-B (CFT4d), F-B′ (CFT6c), unitary (CFT9b); here re-checked for F-B: (μ, σ) ↦ (μ + σ, σ) fails",
     non1 and pull([2 * mu], [mu], gAf) != gAf(mu))

# ── CFT11: extra observation, NOT preregistered (does not enter the decision rule) ─────────────
den = mu**2 / 2 + sg**2
inv = [-mu / den, sg / den]                          # z ↦ −1/z on z = μ/√2 + iσ (upper half-plane)
card("CFT11a", "[not preregistered | F-B] the Fisher metric's isometry group is larger than the system-supplied location–scale group: the hyperbolic inversion (μ, σ) ↦ (−μ/(μ²/2 + σ²), σ/(μ²/2 + σ²)) satisfies F*g = g but is not of the form (aμ + b, aσ) and is induced by no affine data map. Isometries of T and transformations the system supplies are different classes",
     sp.simplify(pull(inv, [mu, sg], gBf) - gBf(mu, sg)) == Z(2))

gLp = sp.simplify(Jexp.T * gCp.subs({t1: sp.exp(l1), t2: sp.exp(l2)}) * Jexp)
gLpd = gLp.subs({l1: ll, l2: ll})
vLp = Jexp.subs({l1: ll, l2: ll}).inv() * sp.Matrix([2, -1])
card("CFT11b", "[not preregistered | F-C′, P2] the control's diagonal null is also a coordinate invariant: under θ = e^λ, rank g_λ = 1 on the diagonal and g_λ v_λ = 0 for v_λ = J⁻¹(2, −1). The refinement's covariance clause (P2) carries F-C′'s null structure although no system-supplied symmetry exists (checks the 'covers' clause of the decision rule on the example where Q3 fails)",
     gLpd.rank(simplify=True) == 1 and sp.simplify(gLpd * vLp) == Z(2, 1))
