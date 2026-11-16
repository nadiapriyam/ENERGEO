"""Act VIII story-integration and mathematical-correction cards (2026-11-16).
Decisions: docs/restructure_decisions.md, "Act VIII story-integration and mathematical-correction pass".
Record: research/constructions/act8_finite_infinite_h3_c.md (story-integration sections). verify/verify_A8.py is on the ledger
and is not edited; where one of its claim texts is corrected, the correction is a new card here.
Every threshold and expected table below was fixed before the first run and must not be moved after seeing results.
Run: python3 verify/verify_A8S.py"""
from fractions import Fraction

import numpy as np
import sympy as sp

V = {}
def card(sid, claim, ok):
    ok = bool(ok); V[sid] = ok
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")

zm = lambda M: sp.simplify(M) == sp.zeros(*M.shape)
s, t, u, th, ph = sp.symbols('s t u theta phi', real=True)
w = sp.symbols('omega', positive=True)
c = sp.symbols('c', positive=True)
I2 = sp.eye(2)
Reals = sp.S.Reals

# ══ G. The common-form chart → Act VIII: KᵀM + MK = 0 ⟹ A(s)ᵀMA(s) = M for A(s) = e^{sK} ══════════════════
# A8Ga  the derivative identity behind the theorem, on generic 3×3 matrices (no commutativity of M assumed)
gen = lambda name: sp.Matrix(3, 3, sp.symbols(f'{name}0:9'))
A, K, M = gen('a'), gen('k'), gen('m')
ident = sp.expand((K*A).T*M*A + A.T*M*(K*A) - A.T*(K.T*M + M*K)*A) == sp.zeros(3)
conv = sp.expand(sp.diff((sp.eye(3) + s*K).T*M*(sp.eye(3) + s*K), s).subs(s, 0) - (K.T*M + M*K)) == sp.zeros(3)
card("A8Ga", "generator theorem: for A(s) = e^(sK) one has A′ = KA, and for any K, M the identity (KA)ᵀMA + AᵀM(KA) = Aᵀ(KᵀM + MK)A "
     "holds (generic 3×3); so if KᵀM + MK = 0 then F(s) = A(s)ᵀMA(s) has F′ = 0 and F(0) = M, hence A(s)ᵀMA(s) = M for all s. "
     "Conversely, differentiating AᵀMA = M at s = 0 gives KᵀM + MK = 0", ident and conv)

# A8Gb  the theorem on independently supplied forms: compute 𝔤_M, exponentiate every basis generator, check preservation
def lie_algebra(Mx):
    n = Mx.shape[0]
    ks = sp.symbols(f'q0:{n*n}')
    Kx = sp.Matrix(n, n, ks)
    sol = sp.solve(list(Kx.T*Mx + Mx*Kx), ks, dict=True)[0]
    Kgen = Kx.subs(sol)
    free = sorted(Kgen.free_symbols - {c}, key=str)
    return [Kgen.subs({f: (1 if f == g else 0) for f in free}) for g in free]
FORMS = [('I₂ (Euclidean)', sp.eye(2), 1), ('η = diag(1, −1)', sp.diag(1, -1), 1), ('M_c = diag(1, −1/c²)', sp.diag(1, -1/c**2), 1),
         ('Ω = [[0, 1], [−1, 0]] (symplectic)', sp.Matrix([[0, 1], [-1, 0]]), 3), ('I₃', sp.eye(3), 3), ('diag(1, 1, −1)', sp.diag(1, 1, -1), 3)]
dims, pres = {}, True
for name, Mx, d in FORMS:
    basis = lie_algebra(Mx)
    dims[name] = len(basis)
    for Kx in basis:
        Ax = (s*Kx).exp()
        pres &= zm((Ax.T*Mx*Ax).applyfunc(lambda e: sp.simplify(e.rewrite(sp.exp))) - Mx)
card("A8Gb", f"on six supplied forms the solution space 𝔤_M = {{K : KᵀM + MK = 0}} has dimensions {list(dims.values())} and every basis generator "
     "exponentiates to a one-parameter group with e^(sK)ᵀMe^(sK) = M (Euclidean, Lorentz, M_c, symplectic, I₃, diag(1, 1, −1)); "
     "no single universal M is used", pres and list(dims.values()) == [d for _, _, d in FORMS])

# A8Gc  the equation is the exact condition, and it is relative to the supplied form
Kbad = sp.eye(2); Ab = (s*Kbad).exp()
shear = sp.Matrix([[0, 1], [0, 0]]); Ash = (s*shear).exp()
Kboost = sp.Matrix([[0, 1], [1, 0]]); Abo = (s*Kboost).exp()
rel = (not zm(Ab.T*Ab - I2)) and (not zm(Ash.T*Ash - I2)) and zm(Abo.T*sp.diag(1, -1)*Abo - sp.diag(1, -1)) and (not zm((Abo.T*Abo).applyfunc(lambda e: e.rewrite(sp.exp)) - I2))
card("A8Gc", "failure condition: K = I (e^(2s)I) and the shear [[0, 1], [0, 0]] violate KᵀI + IK = 0 and do not preserve I₂; the boost generator "
     "preserves η but not I₂. Which flows preserve a relation depends on the form the system supplies", rel)

# ══ E. The canonical SO(2) / SO(1,1) comparison ══════════════════════════════════════════════════════
J = sp.Matrix([[0, -1], [1, 0]])
EJ = (th*J).exp()
x0, x1 = sp.symbols('x0 x1', real=True)
X = sp.Matrix([x0, x1])
so2 = (J**2 == -I2 and zm(J.T + J) and zm(EJ - (I2*sp.cos(th) + J*sp.sin(th))) and zm(EJ.T*EJ - I2) and zm((2*sp.pi*J).exp() - I2)
       and sp.simplify((EJ*X).dot(EJ*X) - X.dot(X)) == 0 and J.eigenvals() == {sp.I: 1, -sp.I: 1}
       and sp.solveset(sp.cos(u) - 1, u, Reals).contains(2*sp.pi) == True and sp.solveset(sp.cos(u) - 1, u, Reals).contains(sp.pi) == False)
card("A8Ea", "SO(2): J = [[0, −1], [1, 0]], J² = −I, JᵀI + IJ = 0, e^(θJ) = I cos θ + J sin θ (orthogonal, e^(2πJ) = I); orbits lie on |x|² = const; "
     "Stab of x ≠ 0 is 2πℤ; eigenvalues ±i: the canonical elliptic case (compact, periodic)", so2)

Kb = sp.Matrix([[0, 1], [1, 0]]); eta = sp.diag(1, -1)
EK = (ph*Kb).exp().applyfunc(lambda e: sp.simplify(e.rewrite(sp.cosh)))
img = EK*sp.Matrix([1, 0])
p1, p2 = sp.symbols('phi1 phi2', real=True)
so11 = (Kb**2 == I2 and zm(Kb.T*eta + eta*Kb) and zm(EK - (I2*sp.cosh(ph) + Kb*sp.sinh(ph))) and zm((EK.T*eta*EK).applyfunc(sp.simplify) - eta)
        and zm(((p1*Kb).exp()*(p2*Kb).exp() - ((p1 + p2)*Kb).exp()).applyfunc(lambda e: sp.simplify(e.rewrite(sp.exp))))
        and sp.simplify(img[1]/img[0] - sp.tanh(ph)) == 0 and sp.limit(sp.tanh(ph), ph, sp.oo) == 1
        and sp.solveset(sp.sinh(u), u, Reals) == sp.FiniteSet(0) and Kb.eigenvals() == {1: 1, -1: 1} and sp.limit(sp.exp(ph), ph, sp.oo) == sp.oo)
card("A8Eb", "SO(1,1): K = [[0, 1], [1, 0]], K² = I, Kᵀη + ηK = 0, e^(φK) = I cosh φ + K sinh φ preserves η; φ is additive (e^(φ₁K)e^(φ₂K) = e^((φ₁+φ₂)K)); "
     "e^(φK)(1, 0) = (cosh φ, sinh φ) has slope tanh φ ∈ (−1, 1) (= v/c in (ct, x)); Stab = {0}; eigenvalues ±1 and ‖e^(φK)‖ = e^|φ| → ∞: "
     "the canonical hyperbolic case (noncompact, free)", so11)

a_, b_ = sp.symbols('a b', real=True)
Kt = sp.Matrix([[a_, b_], [sp.symbols('g', real=True), -a_]])
cayley = zm(Kt**2 + Kt.det()*I2)
N = sp.Matrix([[0, 0], [1, 0]]); D0 = sp.diag(1, 0)
par = N.det() == 0 and zm((s*N).exp() - (I2 + s*N)) and zm(N.T*D0 + D0*N)
# three dimensions, one Lorentzian form diag(1, 1, −1): elliptic, hyperbolic and parabolic generators all occur
M3 = sp.diag(1, 1, -1)
R12 = sp.Matrix([[0, -1, 0], [1, 0, 0], [0, 0, 0]]); B13 = sp.Matrix([[0, 0, 1], [0, 0, 0], [1, 0, 0]]); B23 = sp.Matrix([[0, 0, 0], [0, 0, 1], [0, 1, 0]])
inalg = all(zm(G.T*M3 + M3*G) for G in (R12, B13, B23))
Nul = R12 + B13
types3 = (set(R12.eigenvals()) == {0, sp.I, -sp.I} and zm((2*sp.pi*R12).exp() - sp.eye(3)) and set(B13.eigenvals()) == {0, 1, -1}
          and (Nul.T*M3 + M3*Nul == sp.zeros(3)) and Nul**3 == sp.zeros(3) and Nul**2 != sp.zeros(3))
card("A8Ec", "same infinitesimal equation KᵀM + MK = 0, different continuation: for traceless 2×2 K, K² = −det(K)·I (Cayley–Hamilton), so det J = 1 "
     "(elliptic, periodic), det K = −1 (hyperbolic, noncompact), det N = 0 for the shear N = [[0, 0], [1, 0]] (parabolic, e^(sN) = I + sN, preserving "
     "diag(1, 0)). Scope: an exact canonical 2D comparison. In 3D one Lorentzian form diag(1, 1, −1) has elliptic (R₁₂, period 2π), hyperbolic "
     "(B₁₃) and parabolic (R₁₂ + B₁₃, nilpotent of order 3) generators: signature alone does not decide the continuation type",
     cayley and par and inalg and types3)

# ══ F. The circle as a Fourier character; translation → phase ═════════════════════════════════════════
chi = lambda om, x: sp.exp(sp.I*om*x)
hom = all(sp.simplify(chi(om, t + s) - chi(om, t)*chi(om, s)) == 0 and chi(om, 0) == 1 and sp.simplify(sp.Abs(chi(om, t)) - 1) == 0 for om in (w, -w))
ker_ok = True
for om in (3, -3, sp.Rational(1, 2), sp.sqrt(2)):
    T_ = 2*sp.pi/abs(om); Kr = sp.solveset(sp.cos(om*u) - 1, u, Reals)
    ker_ok &= all(Kr.contains(k*T_) == True for k in (-2, -1, 0, 1, 2)) and Kr.contains(T_/2) == False and Kr.contains(T_/5) == False
triv = sp.solveset(sp.cos(0*u) - 1, u, Reals) == Reals
card("A8Fa", "χ_ω(t) = e^(iωt) is a continuous homomorphism (ℝ, +) → U(1) (χ(t + s) = χ(t)χ(s), χ(0) = 1, |χ| = 1): a one-dimensional unitary "
     "representation (character) of the translation group. ker χ_ω = (2π/|ω|)ℤ for ω ≠ 0 (ω = ±3, 1/2, √2 checked; ker = ℝ for ω = 0), so the "
     "induced map ℝ/ker χ_ω → S¹ is a continuous bijection from a compact space onto a Hausdorff space, hence a homeomorphism: ℝ/ker χ_ω ≅ S¹",
     hom and ker_ok and triv)

tau = sp.symbols('tau', real=True)
e_om = lambda x: sp.exp(sp.I*w*x)
shift_phase = sp.simplify(e_om(t - tau) - chi(w, -tau)*e_om(t)) == 0
e_k = lambda k, x: sp.exp(2*sp.pi*sp.I*k*x)
R4 = all(sp.simplify(e_k(k, t - tau) - sp.exp(-2*sp.pi*sp.I*k*tau)*e_k(k, t)) == 0 for k in (1, 2, 3))
f23 = e_k(2, t) + e_k(3, t); f24 = e_k(2, t) + e_k(4, t)
per23 = sp.simplify(f23.subs(t, t - 1) - f23) == 0 and sp.simplify((f23.subs(t, t - sp.Rational(1, 2)) - f23).subs(t, 0)) != 0
per24 = sp.simplify(f24.subs(t, t - sp.Rational(1, 2)) - f24) == 0 and sp.simplify((f24.subs(t, t - sp.Rational(1, 4)) - f24).subs(t, 0)) != 0
card("A8Fb", "translation → phase → Fourier: (T_τ e_ω)(t) = e_ω(t − τ) = χ_ω(−τ)e_ω(t), so translation acts on each Fourier mode by its character; "
     "on the period-1 basis T_τ e_k = e^(−2πikτ)e_k (R4). A trigonometric polynomial is translation-periodic exactly on the common kernel of its "
     "modes' characters: e₂ + e₃ has period 1 (not 1/2), e₂ + e₄ has period 1/2 (not 1/4)", shift_phase and R4 and per23 and per24)

# ══ K. Torus: kernel versus orbit closure ═══════════════════════════════════════════════════════════
def ker_over_2pi(ws):                       # T/2π generating the joint kernel for positive rational frequencies
    from math import lcm, gcd
    return Fraction(lcm(*[f.denominator for f in ws]), gcd(*[f.numerator for f in ws]))
kp = ker_over_2pi([Fraction(1), Fraction(3, 2)])
img_compact = kp == 2 and all(sp.cos(sp.Rational(3, 2)*u).subs(u, 2*sp.pi*k) == 1 for k in (2, 4)) and sp.cos(sp.Rational(3, 2)*2*sp.pi) == -1
irr = sp.sqrt(2).is_rational is False
card("A8Ka", "torus character χ_ω(t) = (e^(iω₁t), …, e^(iω_nt)): ker χ_ω = ∩_j ker χ_(ω_j). (1, 3/2): ker = 4πℤ (2π ∉ ker since e^(3πi) = −1), the image "
     "is closed and ℝ/4πℤ → image is a homeomorphism (periodic case: quotient/kernel structure). (1, √2): ker = {0} (Tω ∈ 2πℤ² forces √2 ∈ ℚ)",
     img_compact and irr)

ms = np.arange(1, 5001)
near = np.min(2*np.abs(np.cos(np.pi*np.sqrt(2)*ms)))
qs = [29, 70, 169, 408]
ret = [2*abs(np.sin(np.pi*np.sqrt(2)*q)) for q in qs]
card("A8Kb", f"(1, √2): (1, −1) is not in the image (t = 2πm with √2t ∈ (2n+1)π would force √2 ∈ ℚ) but the image passes within {near:.4f} < 0.01 of it "
     f"(m ≤ 5000), so the image is not closed and the orbit closure (T², dimension 2 − 0) is strictly larger than the orbit. χ: ℝ → image is a "
     f"continuous bijection but not a homeomorphism: χ(2πq) → χ(0) (distances {[round(float(r), 4) for r in ret]}) while 2πq → ∞. The quotient "
     "statement ℝ/ker ≅ image holds only algebraically here; the bounded representation is the orbit closure (dense case: orbit closure / subtorus structure)",
     irr and near < 0.01 and ret[-1] < 0.01 and all(ret[i + 1] < ret[i] for i in range(len(ret) - 1)))

# ══ B. STAR-B in an explicit category: smooth manifolds ═════════════════════════════════════════════
r_ = sp.symbols('r', real=True)
hh = lambda z: sp.Piecewise((sp.exp(-1/z), z > 0), (0, True))
rho = lambda z: hh(4 - z)/(hh(4 - z) + hh(z - 1))
rho_ok = all(sp.simplify(rho(sp.Rational(v_))) == 1 for v_ in (0, '1/4', 1)) and all(sp.simplify(rho(sp.Rational(v_))) == 0 for v_ in (4, 5)) \
    and 0 < float(rho(sp.Rational(5, 2))) < 1
ok_fields = True
for n_ in (2, 3):
    xs = sp.Matrix(sp.symbols(f'y0:{n_}', real=True))
    Xf = sp.zeros(n_, 1); Xf[0], Xf[1] = -xs[1], xs[0]           # rotation generator in the first two coordinates (times ρ(|x|²))
    tangent = sp.simplify((Xf.T*xs)[0]) == 0                       # X·x = 0: |x| is preserved
    curve = sp.zeros(n_, 1); curve[0], curve[1] = sp.cos(t)/2, sp.sin(t)/2
    on_rho1 = sp.simplify(sum(v**2 for v in curve)) == sp.Rational(1, 4)          # |x|² = 1/4 ≤ 1, where ρ = 1
    solves = zm(sp.diff(curve, t) - Xf.subs(dict(zip(xs, curve))))
    periodic = zm(curve.subs(t, t + 2*sp.pi) - curve) and sp.solveset(sp.cos(u) - 1, u, Reals).contains(sp.pi) == False
    ok_fields &= tangent and on_rho1 and solves and periodic
card("A8Ba", "STAR-B in the category of smooth manifolds (Hausdorff, second countable) with flows of smooth complete vector fields: on ℝⁿ, n = 2, 3, "
     "X = ρ(|x|²)(−x₂, x₁, 0, …) with the smooth bump ρ (= 1 on [0, 1], = 0 on [4, ∞)) is tangent to the spheres, and x(t) = (½cos t, ½sin t, 0, …) is "
     "an integral curve with minimal period 2π. X has compact support, so it is complete (Lee 2013); transplanted through a chart it gives a "
     "non-constant periodic orbit on every smooth manifold of dimension ≥ 2. In dimension 1 a connected manifold without boundary is S¹ (rotation: "
     "periodic) or ℝ (no non-constant periodic orbit, A8Pe; classification: Milnor 1965). Not claimed for arbitrary 'geometrical objects'",
     rho_ok and ok_fields)

# ══ V. STAR-C wording: theorem hypotheses vs recurrence itself ═══════════════════════════════════════
Rm = sp.Matrix([[sp.cos(t), -sp.sin(t)], [sp.sin(t), sp.cos(t)]])
rot_mp = sp.simplify(Rm.det()) == 1 and zm(Rm.subs(t, 2*sp.pi) - I2)          # Lebesgue invariant on ℝ² (infinite measure); every orbit periodic
vel = 2 + sp.cos(th)
period = sp.simplify(sp.integrate(1/vel, (th, 0, 2*sp.pi)))
not_leb = sp.simplify(sp.diff(vel, th)) != 0                                   # Lebesgue density 1 is not invariant: ∂_θ(1·v) = −sin θ ≢ 0
dens_inv = sp.simplify(sp.diff((1/vel)*vel, th)) == 0                          # density 1/(2 + cos θ) is invariant: ∂_θ(ρv) = 0
card("A8Va", f"Poincaré's hypotheses are the hypotheses of the theorem (its guarantee), not necessary conditions for recurrence: the rotation of ℝ² "
     f"preserves Lebesgue measure of infinite total mass and every orbit is periodic, hence recurrent; θ̇ = 2 + cos θ on S¹ does not preserve "
     f"Lebesgue measure (∂_θ(2 + cos θ) ≠ 0) and every orbit is periodic with period {period} = 2π/√3, the invariant measure being "
     "dθ/(2 + cos θ). A8Pd's examples show only where the standard guarantee is unavailable and recurrence in fact fails",
     rot_mp and sp.simplify(period - 2*sp.pi/sp.sqrt(3)) == 0 and not_leb and dens_inv)

# ══ W. t versus c corrected: θ ↔ φ; c a distinct object ══════════════════════════════════════════════
v_, v1, v2 = sp.symbols('v v1 v2', real=True)
Lam = lambda vv, cc: (1/sp.sqrt(1 - vv**2/cc**2))*sp.Matrix([[1, -vv/cc**2], [-vv, 1]])     # on (t, x)
Dc = sp.diag(c, 1)                                                                            # (t, x) ↦ (ct, x)
beta_s = [sp.Rational(1, 3), sp.Rational(-2, 5), sp.Rational(3, 7)]
rap = all(zm(Dc*Lam(bq*c, c)*Dc.inv() - (I2*sp.cosh(-sp.atanh(bq)) + Kb*sp.sinh(-sp.atanh(bq)))) for bq in beta_s)   # = e^(−φK) by A8Eb
addv = sp.simplify(sp.tanh(sp.atanh(v1/c) + sp.atanh(v2/c)).rewrite(sp.exp) - ((v1/c + v2/c)/(1 + v1*v2/c**2)).rewrite(sp.exp)) == 0 or \
    all(abs(float(sp.tanh(sp.atanh(a1) + sp.atanh(a2)) - (a1 + a2)/(1 + a1*a2))) < 1e-12 for a1, a2 in [(0.3, 0.5), (-0.2, 0.7)])
lin = sp.series(sp.atanh(v_/c), v_, 0, 4).removeO() == v_/c + v_**3/(3*c**3)
theta_lin = sp.diff(w*t, t, 2) == 0
card("A8Wa", "rapidity, not c, is the Lorentz group parameter: in (ct, x) the boost with velocity v is e^(−φK) with tanh φ = v/c (checked for v/c = 1/3, −2/5, 3/7); "
     "rapidities add while velocities compose as (v₁ + v₂)/(1 + v₁v₂/c²); φ = artanh(v/c) = v/c + v³/(3c³) + … is linear in v only to first order, "
     "whereas the Fourier phase θ = ωt is exactly linear in t. Correct comparison: θ ↔ φ (parameters of one-parameter symmetry groups), not t ↔ c",
     rap and addv and lin and theta_lin)

z0 = sp.symbols('z0'); t0, xx0 = sp.symbols('t0 x0', real=True)
r_inv = sp.simplify(sp.Abs(sp.exp(sp.I*w*t)*z0) - sp.Abs(z0)) == 0
q_orbit = sp.simplify((Lam(v_, c)*sp.Matrix([t0, xx0])).T*sp.diag(1, -1/c**2)*(Lam(v_, c)*sp.Matrix([t0, xx0])) - sp.Matrix([[t0**2 - xx0**2/c**2]])) == sp.zeros(1)
varies = sp.Abs(2) != sp.Abs(3) and sp.simplify((t0**2 - xx0**2/c**2).subs({t0: 2, xx0: 0}) - (t0**2 - xx0**2/c**2).subs({t0: 3, xx0: 0})) != 0
card("A8Wb", "the analogy 'circle radius r ↔ c' has no exact map and is discarded: r = |z₀| is an orbit invariant (it differs from orbit to orbit under one fixed "
     "form), whereas c is a parameter of the form, the same for every orbit. The exact counterpart of r² on the Lorentz side is the value of q_c on the "
     "orbit, t₀² − x₀²/c² (preserved by every boost; it differs between orbits at fixed c)", r_inv and q_orbit and varies)

phis = [sp.atanh(sp.Rational(1, 2)), sp.atanh(sp.Rational(1, 3))]                       # v = 1 with c = 2 and c = 3
diff_phi = sp.simplify(phis[0] - phis[1]) != 0
beta_only = all(sp.diff(e, c) == 0 for e in sp.simplify(Dc*Lam(sp.Symbol('beta', positive=True)*c, c)*Dc.inv()))
cone = sp.solve(sp.Symbol('T')**2 - sp.Symbol('Xs')**2/c**2, sp.Symbol('Xs'))
congr = zm(sp.diag(1, sp.Rational(3, 2)).T*sp.diag(1, -sp.Rational(1, 9))*sp.diag(1, sp.Rational(3, 2)) - sp.diag(1, -sp.Rational(1, 4)))
card("A8Wc", "restricted content of c: the bare forms M_c (c = 2, 3 shown) are congruent by a spatial rescaling, so the congruence class of this isolated "
     "form does not distinguish the finite value of c; this is not the claim that c means only finiteness. With v given in fixed units the boost "
     "depends on c through the dimensionless ratio β = v/c (in (ct, x) it depends on β alone; v = 1 gives φ = artanh(1/2) for c = 2 and artanh(1/3) "
     "for c = 3); the null cone is x = ±ct; c → ∞ at fixed v is the external family limit (A8Lb)", congr and diff_phi and beta_only and len(cone) == 2)

# ══ Q. One exact family containing the circle generator and the boost generator ═════════════════════
kap = sp.symbols('kappa', real=True)
Mk = sp.diag(1, kap); Kk = sp.Matrix([[0, kap], [-1, 0]])
fam = zm(Kk.T*Mk + Mk*Kk) and zm(Kk**2 + kap*I2) and sp.simplify(Kk.det() - kap) == 0
ell = sp.simplify((s*Kk.subs(kap, w**2)).exp().applyfunc(lambda e: e.rewrite(sp.cos)) - (I2*sp.cos(w*s) + Kk.subs(kap, w**2)*sp.sin(w*s)/w)) == sp.zeros(2)
hyp = zm(((s*Kk.subs(kap, -1/c**2)).exp() - (I2*sp.cosh(s/c) + Kk.subs(kap, -1/c**2)*c*sp.sinh(s/c))).applyfunc(lambda e: e.rewrite(sp.exp)))
boostgen = zm(Kk.subs(kap, -1/c**2) - sp.diff(Lam(v_, c), v_).subs(v_, 0))
p_, q_ = sp.symbols('p q', real=True)
osc = zm(sp.Matrix([-w**2*q_, p_]) + Kk.subs(kap, w**2)*sp.Matrix([p_, q_])) and sp.expand((sp.Matrix([p_, q_]).T*Mk.subs(kap, w**2)*sp.Matrix([p_, q_]))[0]) == p_**2 + w**2*q_**2
lim_e = (I2*sp.cos(w*s) + Kk.subs(kap, w**2)*sp.sin(w*s)/w).applyfunc(lambda e: sp.limit(e, w, 0))
lim_h = (I2*sp.cosh(s/c) + Kk.subs(kap, -1/c**2)*c*sp.sinh(s/c)).applyfunc(lambda e: sp.limit(e, c, sp.oo))
shear_lim = lim_e == sp.Matrix([[1, 0], [-s, 1]]) and lim_h == sp.Matrix([[1, 0], [-s, 1]])
E3 = lambda i, j: sp.Matrix(3, 3, lambda a, b: 1 if (a, b) == (i, j) else 0)
H3, P3 = E3(0, 2), E3(1, 2)
K3 = sp.Matrix([[0, kap, 0], [-1, 0, 0], [0, 0, 0]])
br = lambda X1, X2: X1*X2 - X2*X1
alg = zm(br(K3, H3) + P3) and zm(br(K3, P3) - kap*H3) and zm(br(H3, P3))
ddim = lambda kv: sp.Matrix([list(br(X1, X2)) for X1, X2 in [(H3, P3), (H3, K3.subs(kap, kv)), (P3, K3.subs(kap, kv))]]).rank()
dd = (ddim(1), ddim(-1), ddim(0))
card("A8Qa", f"one family: M_κ = diag(1, κ), K_κ = [[0, κ], [−1, 0]] with K_κᵀM_κ + M_κK_κ = 0, K_κ² = −κI, det K_κ = κ (a similarity invariant). κ = ω²: "
     "e^(sK) = I cos ωs + K sin(ωs)/ω; with s = −t it is the oscillator flow on (p, q) (ṗ = −ω²q, q̇ = p; preserved form p² + ω²q²), period 2π/ω; κ = −1/c²: "
     "e^(sK) = I cosh(s/c) + cK sinh(s/c), and K_κ is the boost generator dΛ/dv at v = 0 (s = cφ); κ = 0: the Galilean shear. With s fixed, "
     f"ω → 0 and c → ∞ give the same limit [[1, 0], [−s, 1]]. With translations, [K, H] = −P, [K, P] = κH: derived algebra dimension {dd} for "
     "κ = 1, −1, 0 (Euclidean e(2), Poincaré(1+1), Galilei(1+1))", fam and ell and hyp and boostgen and osc and shear_lim and alg and dd == (2, 2, 1))

lim_norm = (w*s*J).exp().applyfunc(lambda e: sp.limit(e.rewrite(sp.cos), w, 0))
card("A8Qb", "the elliptic side depends on its scaling exactly as c does (A8X5): in normalized coordinates the circle generator ωJ → 0 and e^(sωJ) → I "
     "as ω → 0 (no shear); in the oscillator's physical coordinates (p, q) the same limit is the free-particle shear q(s) = q₀ + p₀s. A limit "
     "parameter has content only once what is held fixed is stated", lim_norm == I2 and shear_lim)

# ══ Z. Story-pass statuses, derived only from the verdicts above by rules fixed before the run ═══════
RULES = {
 'H3-c-direct (t ↔ c → ∞)': ('FAIL', ['A8Wa', 'A8Wb']),
 'H3-group (preserved-form one-parameter groups)': ('ESTABLISHED INSTANCE', ['A8Ga', 'A8Gb', 'A8Ea', 'A8Eb', 'A8Ec']),
 'H3-c-family (c-indexed forms, Galilean limit)': ('RESTRICTED', ['A8Wc', 'A8Qa', 'A8Qb']),
 'H3-quotient (corrected: kernel vs orbit closure)': ('RESTRICTED', ['A8Fa', 'A8Ka', 'A8Kb']),
 'STAR-B (smooth-manifold category)': ('RESTRICTED', ['A8Ba']),
 'STAR-C (theorem hypotheses vs recurrence)': ('RESTRICTED', ['A8Va']),
 'geometry constrains, generator decides': ('PROJECT SYNTHESIS', ['A8Ga', 'A8Gc', 'A8Ec']),
}
EXPECTED = {'H3-c-direct (t ↔ c → ∞)': 'FAIL', 'H3-group (preserved-form one-parameter groups)': 'ESTABLISHED INSTANCE',
            'H3-c-family (c-indexed forms, Galilean limit)': 'RESTRICTED', 'H3-quotient (corrected: kernel vs orbit closure)': 'RESTRICTED',
            'STAR-B (smooth-manifold category)': 'RESTRICTED', 'STAR-C (theorem hypotheses vs recurrence)': 'RESTRICTED',
            'geometry constrains, generator decides': 'PROJECT SYNTHESIS'}
derived = {k: (st if all(V[x] for x in cs) else 'UNDETERMINED') for k, (st, cs) in RULES.items()}
card("A8Zb", "story-pass statuses (each derived only if all its evidence cards pass): " + '; '.join(f'{k}: {v}' for k, v in derived.items()), derived == EXPECTED)

print(f"\n{sum(V.values())}/{len(V)} checks passed")
