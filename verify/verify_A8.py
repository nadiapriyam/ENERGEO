"""Act VIII cards (first construction pass, 2026-11-16): finite/infinite representation, H3, ★, and the c-indexed family.
Decisions: docs/restructure_decisions.md, "Act VIII first construction pass". Record: research/constructions/act8_finite_infinite_h3_c.md.
Every threshold and every expected table below was fixed before the first run and must not be moved after seeing results.
Symbolic checks where possible; each numerical check states its fixed threshold.
Run: python3 verify/verify_A8.py"""
import itertools
from fractions import Fraction
from math import gcd

import numpy as np
import sympy as sp

V = {}
def card(sid, claim, ok):
    ok = bool(ok); V[sid] = ok
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")

zero = lambda e: sp.simplify(e) == 0
zm = lambda M: sp.simplify(M) == sp.zeros(*M.shape)
t, s, u, a_ = sp.symbols('t s u alpha', real=True)
n = sp.symbols('n', integer=True)
w = sp.symbols('omega', positive=True)          # |ω| > 0; the negative case is ω = −w
z = sp.symbols('z')                             # a point of ℂ (S¹ when |z| = 1)
Phi = lambda tt, zz, ww: sp.exp(sp.I*ww*tt)*zz  # circle action Φ_t(z) = e^{iωt} z
Reals = sp.S.Reals

# ══ Circle: Φ_t(z) = e^{iωt} z on S¹ ═══════════════════════════════════════════════════════════════
# A8Ca  group action, invariant norm, bounded orbit for an unbounded parameter
law = all(zero(Phi(t, Phi(s, z, ww), ww) - Phi(t + s, z, ww)) and Phi(0, z, ww) == z for ww in (w, -w))
norm = all(zero(sp.Abs(Phi(t, 1, ww)) - 1) for ww in (w, -w))
rng = [sp.calculus.util.function_range(f(w*t), t, Reals) for f in (sp.cos, sp.sin)]
card("A8Ca", "circle action: Φ_0 = id, Φ_t∘Φ_s = Φ_(t+s), |γ_ω(t)| = |e^(iωt)| = 1 for every real t (ω ≷ 0); "
     "cos ωt and sin ωt have range [−1, 1] although t ranges over all of ℝ",
     law and norm and rng == [sp.Interval(-1, 1)] * 2)

# A8Cb  period T = 2π/|ω|, and no smaller positive period
per = all(zero(sp.exp(sp.I*ww*(t + 2*sp.pi/w)) - sp.exp(sp.I*ww*t)) for ww in (w, -w))
phi_ = sp.symbols('phi', real=True)
minimal = sp.solveset(sp.cos(phi_) - 1, phi_, sp.Interval.open(0, 2*sp.pi)) == sp.S.EmptySet
card("A8Cb", "γ_ω(t + T) = γ_ω(t) with T = 2π/|ω| (both signs of ω); minimal: e^(iωT′) = 1 with 0 < |ω|T′ < 2π is impossible "
     "(cos φ = 1 has no solution in (0, 2π))", per and minimal)

# A8Cc  no limit as t → ∞ for ω ≠ 0; the old "converge to infinity" wording is refuted
lims = [sp.limit(f(w*t), t, sp.oo) for f in (sp.cos, sp.sin)]
ab = all(isinstance(L, sp.AccumBounds) and (L.min, L.max) == (-1, 1) for L in lims)
seqs = sp.simplify(sp.cos(w*(2*sp.pi*n/w))) == 1 and sp.simplify(sp.cos(w*((2*n + 1)*sp.pi/w))) == -1
card("A8Cc", "for ω ≠ 0, lim_(t→∞) cos ωt and sin ωt do not exist (AccumBounds(−1, 1)); t_n = 2πn/|ω| gives cos = 1 and "
     "t_n = (2n+1)π/|ω| gives cos = −1; |cos|, |sin| ≤ 1, so neither tends to ±∞: the wording "
     "'sines and cosines converge to infinity' is FALSE", ab and seqs)

# A8Cd  lift and cycle count unbounded; the image is all of S¹ after one period
lift = sp.limit(w*t, t, sp.oo) == sp.oo
cycles = sp.limit(sp.floor(w*t/(2*sp.pi)), t, sp.oo) == sp.oo
onto = zero(Phi(a_/w, 1, w) - sp.exp(sp.I*a_))
card("A8Cd", "phase lift θ(t) = ωt → ∞ and cycle count N(t) = ⌊|ω|t/2π⌋ → ∞ as t → ∞, while the image is S¹ = {|z| = 1} "
     "(closed and bounded in ℂ, hence compact): every e^(iα), α ∈ [0, 2π), is reached at t = α/ω ∈ [0, T)", lift and cycles and onto)

# A8Ce  stabilizer and quotient ℝ/Tℤ ≅ S¹ with the scaling t ↦ ωt/2π
def stab_circle(om):                                 # e^(iθ) = 1 ⟺ cos θ = 1 (modulus 1 and real part 1 force sin θ = 0)
    return sp.solveset(sp.cos(om*u) - 1, u, Reals)
ok_stab = True
for om in (3, -3, sp.Rational(1, 2), sp.sqrt(2)):
    T_ = 2*sp.pi/abs(om)
    S_ = stab_circle(om)
    ok_stab &= all(S_.contains(k*T_) == True for k in (-2, -1, 0, 1, 2)) and S_.contains(T_/2) == False and S_.contains(T_/3) == False
fixed = sp.simplify(Phi(u, z, 0) - z) == 0                        # ω = 0: every u fixes every z (Stab = ℝ)
pmap = lambda sig: sp.exp(2*sp.pi*sp.I*sig)
scal = all(zero(Phi(t, 1, ww) - pmap(ww*t/(2*sp.pi))) for ww in (w, -w)) and sp.simplify(w*(2*sp.pi/w)/(2*sp.pi)) == 1
card("A8Ce", "Stab(z) = (2π/|ω|)ℤ for every z ∈ S¹ (solved as cos ωu = 1; ω = ±3, 1/2, √2: kT ∈ Stab, T/2 and T/3 ∉ Stab); Stab = ℝ when ω = 0; "
     "the orbit map induces a bijection ℝ/Tℤ → S¹ (e^(iωt) = e^(iωs) ⟺ t − s ∈ Tℤ), and γ_ω(t) = p(ωt/2π) with "
     "p(σ) = e^(2πiσ): ℝ/Tℤ ≅ ℝ/ℤ ≅ S¹ by t ↦ ωt/2π (T ↦ ±1)", ok_stab and fixed and scal)

# A8Cf  the covering p: ℝ → S¹ (fibres, deck translations, local injectivity, the lift of γ_ω)
sig = sp.symbols('sigma', real=True)
fib = sp.solveset(sp.cos(2*sp.pi*u) - 1, u, Reals)          # p(u) = 1 ⟺ cos 2πu = 1
fibre_ok = all(fib.contains(k) == True for k in (-3, 0, 4)) and fib.contains(sp.Rational(1, 2)) == False and fib.contains(sp.Rational(1, 3)) == False
deck = zero(pmap(sig + n) - pmap(sig))
deriv = zero(sp.Abs(sp.diff(pmap(sig), sig)) - 2*sp.pi)
liftc = all(zero(pmap(ww*t/(2*sp.pi)) - Phi(t, 1, ww)) for ww in (w, -w)) and sp.limit(w*t/(2*sp.pi), t, sp.oo) == sp.oo
card("A8Cf", "p(σ) = e^(2πiσ): fibre p⁻¹(1) = ℤ (so p is injective on every interval of length < 1), deck translations "
     "σ ↦ σ + n satisfy p(σ + n) = p(σ), |p′| = 2π ≠ 0 (local diffeomorphism); the lift of γ_ω through p from 0 is σ(t) = ωt/2π, "
     "unbounded, while S¹ itself is compact: the unbounded object is the covering coordinate, not the circle",
     fibre_ok and deck and deriv and liftc)

# ══ Torus: (e^{iω_1 t}, …, e^{iω_n t}) ═════════════════════════════════════════════════════════════
# A8Ta  periodicity criterion: ∃T > 0 with Tω_j ∈ 2πℤ ∀j  ⟺  all ratios rational (commensurable)
w1, w2, TT = sp.symbols('w1 w2 T', positive=True)
mm, nn = sp.symbols('m n', integer=True, positive=True)
solw = sp.solve([TT*w1 - 2*sp.pi*mm, TT*w2 - 2*sp.pi*nn], [w1, w2], dict=True)[0]
forward = sp.simplify(solw[w1]/solw[w2] - mm/nn) == 0
pq = sp.symbols('p q', integer=True, positive=True)
Tcand = 2*sp.pi*pq[1]/w2
backward = sp.simplify(Tcand*(pq[0]*w2/pq[1]) - 2*sp.pi*pq[0]) == 0 and sp.simplify(Tcand*w2 - 2*sp.pi*pq[1]) == 0
def min_period_formula(ws):                       # T/2π for positive rational frequencies a/b: lcm(b_j)/gcd(a_j)
    from math import lcm
    return Fraction(lcm(*[f.denominator for f in ws]), gcd(*[f.numerator for f in ws]))
def min_period_brute(ws):
    D = 1
    for f in ws: D *= f.numerator
    for r in range(1, 5000):
        k = Fraction(r, D)
        if all((k*f).denominator == 1 for f in ws): return k
TESTS = [[Fraction(1), Fraction(3, 2)], [Fraction(2), Fraction(3)], [Fraction(1, 2), Fraction(1, 3)], [Fraction(3, 4), Fraction(5, 6), Fraction(1, 10)]]
brute_ok = all(min_period_formula(ws) == min_period_brute(ws) for ws in TESTS)
known = [min_period_formula(ws) for ws in TESTS[:3]] == [2, 1, 6]          # T = 4π, 2π, 12π
card("A8Ta", "torus periodicity criterion: if Tω_1 = 2πm and Tω_2 = 2πn then ω_1/ω_2 = m/n ∈ ℚ; conversely ω_1/ω_2 = p/q gives "
     "T = 2πq/ω_2; minimal period T/2π = lcm(b_j)/gcd(a_j) for ω_j = a_j/b_j, checked against brute force "
     "((1, 3/2): 4π; (2, 3): 2π; (1/2, 1/3): 12π; (3/4, 5/6, 1/10))", forward and backward and brute_ok and known)

# A8Tb  irrational flow (1, √2): trivial stabilizer, injective orbit map; Kronecker density checked numerically
irr = sp.sqrt(2).is_rational is False                # T = 2πm and T√2 = 2πn would force √2 = n/m
grid = np.linspace(0, 2*np.pi, 50, endpoint=False) + 0.0371
def section_maxmin(ratio, K):                        # Poincaré section θ1 = a: θ2 values ratio·(a + 2πk) mod 2π
    worst = 0.0; nvals = set()
    for a in grid:
        th = np.mod(ratio*(a + 2*np.pi*np.arange(K)), 2*np.pi)
        nvals.add(len(set(np.round(th, 9))))
        d = np.abs(th[None, :] - grid[:, None]); d = np.minimum(d, 2*np.pi - d)
        worst = max(worst, d.min(axis=1).max())
    return worst, nvals
irr_worst, _ = section_maxmin(np.sqrt(2), 400)
rat_worst, rat_vals = section_maxmin(1.5, 400)
card("A8Tb", f"irrational torus flow ω = (1, √2): Tω ∈ 2πℤ² forces √2 ∈ ℚ, so Stab = {{0}} at every point (orbit map ℝ → T² injective); "
     f"density (Kronecker, source-locked): 400 section returns come within {irr_worst:.3f} < 0.1 of every point of a 50×50 grid, "
     f"while the commensurable flow (1, 3/2) meets each section in {min(rat_vals)} points and misses grid points by {rat_worst:.2f} > 1.0",
     irr and irr_worst < 0.1 and rat_vals == {2} and rat_worst > 1.0)

# A8Tc  near-recurrence is not periodicity
qs = [1, 2, 5, 12, 29, 70, 169, 408]                 # continued-fraction denominators of √2
d_ = [2*abs(np.sin(np.pi*np.sqrt(2)*q)) for q in qs]
exact_pos = all((sp.sqrt(2)*q).is_integer is False for q in qs)
card("A8Tc", f"near-recurrence of (1, √2) at t = 2πq: distance 2|sin(π√2 q)| = {[round(float(x), 4) for x in d_]} decreases below 0.01 "
     f"(q = 408) but is never 0 (√2q ∉ ℤ): recurrent, not periodic",
     exact_pos and all(x > 0 for x in d_) and all(d_[i + 1] < d_[i] for i in range(len(d_) - 1)) and d_[-1] < 0.01)

# A8Te  rationally dependent but not commensurable: orbit confined to a 2-dimensional subtorus
z1, z2, z3 = (sp.exp(sp.I*t), sp.exp(sp.I*sp.sqrt(2)*t), sp.exp(sp.I*(1 + sp.sqrt(2))*t))
inv3 = zero(z3*sp.conjugate(z1)*sp.conjugate(z2) - 1)
rel = sp.Matrix([[1, 0, 1], [0, 1, 1]]).nullspace()        # ω_j = α_j + β_j√2, relation m·ω = 0 ⟺ m ∈ null([α; β])
rel_ok = len(rel) == 1 and list(rel[0]) in ([-1, -1, 1], [1, 1, -1])
card("A8Te", "ω = (1, √2, 1 + √2): the integer relation lattice {m ∈ ℤ³ : m·ω = 0} = ℤ(1, 1, −1) has rank 1, z₃·z̄₁·z̄₂ ≡ 1 along "
     "the orbit (a 2-dimensional subtorus), and the orbit is not periodic (it contains the (1, √2) flow)", inv3 and rel_ok and irr)

# A8Ua  the "rule": the integer relation lattice of ω decides the orbit closure, not the torus or its invariants
def closure_dim(coeffs):                              # coeffs: columns = frequencies over a ℚ-basis
    M = sp.Matrix(coeffs)
    return M.shape[1] - len(M.nullspace())            # n − rank(relation lattice)
cases = {'(1, 3/2)': [[1, sp.Rational(3, 2)]], '(2, 3)': [[2, 3]], '(1, √2)': [[1, 0], [0, 1]], '(1, √2, 1+√2)': [[1, 0, 1], [0, 1, 1]]}
dims = {k: closure_dim(v) for k, v in cases.items()}
invs = all(zero(sp.Abs(sp.exp(sp.I*om*t)) - 1) for om in (1, sp.Rational(3, 2), sp.sqrt(2), 1 + sp.sqrt(2)))
card("A8Ua", f"same compact torus, same invariants |z_j| = 1 for every ω; orbit-closure dimension n − rank(relation lattice) = {dims}: "
     "dimension 1 exactly in the commensurable (periodic) cases. The frequency vector's integer relations decide the behaviour; "
     "compactness and the invariant norms do not", invs and dims == {'(1, 3/2)': 1, '(2, 3)': 1, '(1, √2)': 2, '(1, √2, 1+√2)': 2})

# ══ Counterexamples H3-X1 … H3-X6 (each also serves the ★ readings) ═════════════════════════════════
# A8X1  compact state space + preserved invariants + no fixed points, yet NO periodic orbit at all
th1, th2 = sp.symbols('theta1 theta2', real=True)
flowT = sp.Matrix([th1 + t, th2 + sp.sqrt(2)*t])
jacT = flowT.jacobian([th1, th2]) == sp.eye(2)        # translation in angle coordinates: the same for every base point
card("A8X1", "H3-X1 / STAR-A: on the compact torus T² the flow (θ₁ + t, θ₂ + √2 t) preserves |z₁| = |z₂| = 1 and has no fixed point, "
     "but Stab = {0} at EVERY point (the stabilizer equation does not involve the base point): unbounded parameter + compact "
     "image + no exact periodicity anywhere", irr and jacT)

# A8X2  cylinder: periodic projection, non-periodic noncompact full state
v = sp.symbols('v', real=True, nonzero=True)
gam_cyl = lambda tt: (sp.exp(sp.I*w*tt), v*tt)
proj_per = zero(gam_cyl(t + 2*sp.pi/w)[0] - gam_cyl(t)[0])
full_stab = sp.solveset(v*u, u, Reals) == sp.FiniteSet(0)
escape = sp.limit(sp.Abs(v)*t, t, sp.oo) == sp.oo
card("A8X2", "H3-X2: on S¹ × ℝ, Φ_t(z, x) = (e^(iωt)z, x + vt), v ≠ 0: the angular projection has period 2π/ω, but the full state has "
     "Stab = {0} (vT = 0 ⇒ T = 0), |x(t)| = |v|·|t| → ∞ (the orbit leaves every compact set; no recurrence): "
     "periodic representation, non-periodic noncompact state", proj_per and full_stab and escape)

# A8X3  compact geometry, non-periodic dynamics: logistic flow on [0, 1] (non-recurrent) and the torus flow (recurrent)
x = sp.symbols('x', real=True)
lg = lambda tt, xx: xx*sp.exp(tt)/(1 - xx + xx*sp.exp(tt))
lg_law = zero(lg(t, lg(s, x)) - lg(t + s, x)) and zero(lg(0, x) - x)
lg_ode = zero(sp.diff(lg(t, x), t) - lg(t, x)*(1 - lg(t, x)))
half = sp.Rational(1, 2)
lg_stab = sp.solveset(lg(u, half) - half, u, Reals) == sp.FiniteSet(0)
lg_lims = (sp.limit(lg(t, half), t, sp.oo), sp.limit(lg(t, half), t, -sp.oo)) == (1, 0)
lg_mono = sp.simplify(sp.diff(lg(t, half), t) - sp.exp(t)/(1 + sp.exp(t))**2) == 0
card("A8X3", "H3-X3: the logistic flow φ_t(x) = xe^t/(1 − x + xe^t) on the compact interval [0, 1] is a one-parameter group (ẋ = x(1 − x)); "
     "the orbit of 1/2 has Stab = {0}, increases strictly from 0 to 1 and never returns near 1/2 (non-recurrent), its closure [0, 1] "
     "is compact. With A8X1 (compact, recurrent, non-periodic): compactness forces neither periodicity nor recurrence",
     lg_law and lg_ode and lg_stab and lg_lims and lg_mono and V['A8X1'])

# A8X4  periodic behaviour on a noncompact state space: rotation of ℝ²
Rm = lambda tt: sp.Matrix([[sp.cos(w*tt), -sp.sin(w*tt)], [sp.sin(w*tt), sp.cos(w*tt)]])
X0 = sp.Matrix(sp.symbols('x0 y0', real=True))
rot_law = zm(Rm(t)*Rm(s) - Rm(t + s))
rot_per = zm(Rm(t + 2*sp.pi/w)*X0 - Rm(t)*X0)
card("A8X4", "H3-X4: R(ωt) on ℝ² is a one-parameter group, every orbit is periodic with period 2π/ω (the origin is fixed), and ℝ² is not "
     "compact: compactness of the state space is not necessary for periodicity", rot_law and rot_per)

# A8X5  c → ∞ without contraction: hold β = v/c fixed (and use x̃ = x/c)
c, c1, c2, beta = sp.symbols('c c1 c2 beta', positive=True)
eta = sp.diag(1, -1); Mc = sp.diag(1, -1/c**2); Pc = sp.diag(1, 1/c)
Lam = lambda vv, cc: (1/sp.sqrt(1 - vv**2/cc**2))*sp.Matrix([[1, -vv/cc**2], [-vv, 1]])
Lb = Lam(beta*c, c)
diverges = sp.limit(Lb[1, 0].subs(beta, sp.Rational(3, 5)), c, sp.oo) == -sp.oo   # β = 3/5
Lt = sp.simplify(Pc*Lb*Pc.inv())
c_free = all(sp.diff(e, c) == 0 for e in Lt) and zm(Pc.inv().T*Mc*Pc.inv() - eta)
card("A8X5", "H3-X5: with β = v/c fixed, Λ_c(βc) has entry −γβc → −∞ in (t, x) (no limit), and in x̃ = x/c it is the c-independent "
     "γ_β[[1, −β], [−β, 1]] with c-independent form η: c → ∞ produces no contraction and no rank loss. 'c → ∞' has content only "
     "once what is held fixed (v, x) is specified", diverges and c_free)

# A8X6  two unrelated uses of an unbounded parameter: Fourier truncation index N vs flow time t on the same coefficient space
K = 6
SN = lambda N: sp.diag(*[1 if k <= N else 0 for k in range(K + 1)])
semi = all(SN(N)*SN(M) == SN(min(N, M)) for N in range(K + 1) for M in range(K + 1))
noninv = all(SN(N).det() == 0 for N in range(K)) and SN(K) == sp.eye(K + 1)
Ut = lambda tt: sp.diag(*[sp.exp(sp.I*k*w*tt) for k in range(K + 1)])
grp = zm(Ut(t)*Ut(s) - Ut(t + s)) and zm(Ut(t)*Ut(-t) - sp.eye(K + 1))
tail = [sum(sp.Rational(1, (k + 1)**4) for k in range(N + 1, K + 1)) for N in range(K + 1)]
conv = all(tail[i + 1] <= tail[i] for i in range(K)) and tail[-1] == 0
nolim = isinstance(sp.limit(sp.cos(w*t), t, sp.oo), sp.AccumBounds)
card("A8X6", "H3-X6: on one coefficient space, the truncation index N gives S_N S_M = S_min(N,M), S_N² = S_N, S_N singular for N < K "
     "(an idempotent semigroup; N → ∞ is approximation, ‖f − S_N f‖ → 0), while flow time t gives a group of invertible "
     "U_t = diag(e^(ikωt)) with no limit as t → ∞; both indices are unbounded, the structures share no group law, no orbit and no limit type",
     semi and noninv and grp and conv and nolim)

# ══ Cylinder: projection periodicity vs state periodicity ══════════════════════════════════════════
st_per = zero(sp.expand(Phi(t + 2*sp.pi/w, 1, w)) - Phi(t, 1, w))     # equal arguments, so f(γ(t + T)) = f(γ(t)) for every f
obs_x = sp.simplify(gam_cyl(t + 2*sp.pi/w)[1] - gam_cyl(t)[1]) == 2*sp.pi*v/w
card("A8Yb", "a periodic state makes every observable periodic (f(γ(t + T)) = f(γ(t)) for arbitrary f); on the cylinder the observable "
     "Re z is periodic while x(t + T) − x(t) = 2πv/ω ≠ 0: periodicity of a projection does not imply periodicity of the state",
     st_per and obs_x and V['A8X2'])

# ══ Action / stabilizer framework ═════════════════════════════════════════════════════════════════
# A8Pa  stabilizers are closed subgroups of ℝ: ℝ, Tℤ or {0}; the dense subgroup ℤ + √2ℤ is not one
st_fixed = sp.solveset(sp.exp(0*u) - 1, u, Reals) == Reals
st_circ = stab_circle(3).contains(2*sp.pi/3) == True and stab_circle(3).contains(sp.pi/3) == False
nn_ = np.arange(1, 1001)
dens = np.min(np.abs(nn_*np.sqrt(2) - np.round(nn_*np.sqrt(2))))
card("A8Pa", f"stabilizer classes: ω = 0 circle Stab = ℝ (fixed); ω = 3 circle Stab = (2π/3)ℤ (periodic); (1, √2) torus, cylinder and "
     f"logistic orbit Stab = {{0}} (free); the subgroup ℤ + √2ℤ has elements in (0, {dens:.1e}) ⊂ (0, 10⁻³), so it is dense, not closed, "
     "and cannot be the stabilizer of a continuous action on a Hausdorff space (a stabilizer is the preimage of a point)",
     st_fixed and st_circ and V['A8X1'] and V['A8X2'] and lg_stab and dens < 1e-3)

# A8Pb  free orbits split further: compact closure (recurrent or not) vs drift
card("A8Pb", "free orbits (Stab = {0}) are not one class: (1, √2) torus: compact closure, recurrent; logistic orbit: compact closure, "
     "non-recurrent (converges to fixed points); cylinder: noncompact, escapes. 'Aperiodic recurrent' needs recurrence, not compactness",
     V['A8X1'] and V['A8Tc'] and V['A8X3'] and V['A8X2'])

# A8Pc  periodic vs recurrent: periodic ⇒ recurrent (t_k = kT); recurrent ⇏ periodic
per_rec = zero(Phi(n*2*sp.pi/w, 1, w) - 1)
table_pr = {'circle ω≠0': (True, True), 'fixed point': (True, True), 'torus (1, √2)': (False, True), 'cylinder': (False, False), 'logistic': (False, False)}
derived = {'circle ω≠0': (V['A8Cb'], per_rec), 'fixed point': (fixed, fixed), 'torus (1, √2)': (not V['A8X1'], V['A8Tc']),
           'cylinder': (not V['A8X2'], not V['A8X2']), 'logistic': (not V['A8X3'], not V['A8X3'])}
card("A8Pc", "periodic ⇒ recurrent (γ(kT) = γ(0) for every k ∈ ℤ); the table (periodic, recurrent): circle (yes, yes), fixed point (yes, yes), "
     "(1, √2) torus (no, yes), cylinder (no, no), logistic (no, no): recurrence and periodicity are different properties",
     per_rec and derived == table_pr)

# A8Pd  Poincaré recurrence: every hypothesis is needed, and the conclusion is 'almost every'
th = sp.symbols('theta', real=True)
cyl_flow = sp.Matrix([th + w*t, x + v*t])
cyl_mp = cyl_flow.jacobian([th, x]) == sp.eye(2)                          # measure preserving, but μ(S¹ × ℝ) = ∞
lg_jac = sp.diff(lg(t, x), x)
lg_not_mp = sp.simplify(lg_jac.subs({t: 1, x: half}) - 1) != 0 and sp.simplify(lg(1, half) - half) != 0   # Lebesgue not invariant
s1 = sp.pi + 2*sp.atan(t)                                                  # θ̇ = 1 − cos θ on S¹, orbit through π
s1_ode = zero(sp.expand_trig(sp.diff(s1, t) - (1 - sp.cos(s1))))
s1_lims = (sp.limit(s1, t, sp.oo), sp.limit(s1, t, -sp.oo)) == (2*sp.pi, 0)
card("A8Pd", "Poincaré recurrence needs (i) an invariant measure, (ii) finite total measure, and gives (iii) almost-every recurrence: "
     "T² translation flow: Jacobian I, μ(T²) = 4π² — hypotheses hold, every point recurs (A8Tc); cylinder: Jacobian I but μ = ∞ — "
     "no point recurs (A8X2); logistic on [0, 1]: μ finite but dφ_t/dx ≠ 1 (Lebesgue not invariant) — no interior point recurs (A8X3); "
     "θ̇ = 1 − cos θ on compact S¹: the only invariant probability is δ₀, and every orbit except the fixed point goes from 0 to 2π ≡ 0 "
     "without returning (θ(t) = π + 2 arctan t): recurrence holds only δ₀-almost everywhere",
     V['A8Tc'] and cyl_mp and V['A8X2'] and lg_not_mp and V['A8X3'] and s1_ode and s1_lims)

# A8Pe  STAR-B: existence of a non-constant periodic orbit depends on the class; the trivial flow makes 'fixed' vacuous
mono_lg = sp.simplify(sp.diff(lg(t, x), t) - lg(t, x)*(1 - lg(t, x))) == 0 and lg_mono
idflow = zero(Phi(u, z, 0) - z)
card("A8Pe", "STAR-B: every space carries the trivial flow Φ_t = id (all points fixed, Stab = ℝ), so 'admits a periodic evolution' is vacuous "
     "if fixed points count; flows on ℝ or an interval have strictly monotone non-constant orbits (logistic: φ̇ = φ(1 − φ) > 0 on (0, 1)), "
     "so no non-constant periodic orbit exists there (a continuous injection ℝ/Tℤ → ℝ is impossible), while the circle (also "
     "1-dimensional) has them: the answer depends on the specified class, not on 'bound by rules'",
     mono_lg and idflow and V['A8Cb'])

# A8Pg  boundary approach ≅ drift: the velocity flow on (−1, 1) is conjugate to translation on ℝ
vv = sp.symbols('v', real=True)
psi = lambda ss, x_: (x_ + sp.tanh(ss))/(1 + x_*sp.tanh(ss))
psi_law = zero((psi(t, psi(s, vv)) - psi(t + s, vv)).rewrite(sp.exp))
conj = zero(sp.expand_trig(sp.tanh(sp.atanh(vv) + s)) - psi(s, vv))
vel_rng = sp.calculus.util.function_range(sp.tanh(s), s, Reals) == sp.Interval.open(-1, 1)
vel_lim = sp.limit(psi(s, 0), s, sp.oo) == 1
card("A8Pg", "boundary approach is drift: ψ_s(v) = (v + tanh s)/(1 + v tanh s) is a flow on (−1, 1) with artanh(ψ_s(v)) = artanh(v) + s "
     "(conjugate to translation on ℝ); the orbit of 0 is all of (−1, 1) (bounded in the Euclidean v-coordinate), leaves every compact "
     "subset, and tends to 1 ∉ (−1, 1). Boundedness is not preserved by conjugacy; compactness of the orbit closure is",
     psi_law and conj and vel_rng and vel_lim)

# ══ Finite / infinite distinction table ═══════════════════════════════════════════════════════════
PROPS = ['unbounded parameter domain', 'compact orbit closure', 'unbounded lift', 'bounded observable', 'infinitely many cycles',
         'convergence', 'recurrence', 'periodicity', 'dense orbit', 'noncompact drift']
# rows: systems; entries fixed in advance from the cards cited (A8C*, A8T*, A8X*, A8P*); lift = lift to the universal cover of the state space
TABLE = {
 'circle ω≠0 on S¹':          (1, 1, 1, 1, 1, 0, 1, 1, 1, 0),
 'circle ω=0 (fixed point)':  (1, 1, 0, 1, 0, 1, 1, 1, 0, 0),
 'torus (1, 3/2)':            (1, 1, 1, 1, 1, 0, 1, 1, 0, 0),
 'torus (1, √2)':             (1, 1, 1, 1, 0, 0, 1, 0, 1, 0),
 'cylinder (ω, v≠0)':         (1, 0, 1, 0, 0, 0, 0, 0, 0, 1),
 'logistic on [0, 1]':        (1, 1, 0, 1, 0, 1, 0, 0, 1, 0),
 'velocity flow on (−1, 1)':  (1, 0, 0, 1, 0, 1, 0, 0, 1, 1),
 'rotation of ℝ²':            (1, 1, 0, 1, 1, 0, 1, 1, 0, 0),
 'translation on ℝ':          (1, 0, 1, 0, 0, 0, 0, 0, 1, 1),
 'contraction ẋ = −x on ℝ':   (1, 0, 1, 0, 0, 1, 0, 0, 0, 0),
}
CITED = ['A8Ca', 'A8Cb', 'A8Cc', 'A8Cd', 'A8Ce', 'A8Cf', 'A8Ta', 'A8Tb', 'A8Tc', 'A8X1', 'A8X2', 'A8X3', 'A8X4', 'A8Pg']
# spot-check bounded/convergence entries symbolically from closed forms (forward time t → +∞ for convergence)
closed = {'circle ω≠0 on S¹': [sp.cos(t), sp.sin(t)], 'cylinder (ω, v≠0)': [sp.cos(t), t], 'logistic on [0, 1]': [lg(t, half)],
          'velocity flow on (−1, 1)': [sp.tanh(t)], 'translation on ℝ': [t], 'contraction ẋ = −x on ℝ': [sp.exp(-t)]}
def bounded_(fs): return all(sp.calculus.util.function_range(f, t, Reals).is_subset(sp.Interval(-10, 10)) for f in fs)
def converges_(fs): return all((lambda L: L.is_finite is True and not isinstance(L, sp.AccumBounds))(sp.limit(f, t, sp.oo)) for f in fs)
spot = all(bounded_(fs) == bool(TABLE[k][3]) and converges_(fs) == bool(TABLE[k][5]) for k, fs in closed.items())
rows = list(TABLE.values())
pairs_sep = all(any(r[i] != r[j] for r in rows) for i, j in itertools.combinations(range(1, len(PROPS)), 2))
const_param = all(r[0] == 1 for r in rows)
card("A8Da", "finite/infinite table (10 systems × 10 properties, entries from the cited cards; bounded/convergent entries recomputed from "
     "closed forms): the parameter domain is unbounded in every row, and every pair of the other nine properties differs in some row — "
     "no two may be identified", all(V[k] for k in CITED) and spot and pairs_sep and const_param)

# (i, j, True): i ⇒ j;  (i, j, False): i ⇒ not j.  Indices into PROPS.
IMPL = [(7, 6, True), (4, 7, True), (7, 1, True), (1, 3, True), (6, 9, False), (1, 9, False)]
impl_ok = all(all((not r[i]) or (bool(r[j]) == pos) for r in rows) for i, j, pos in IMPL)
NONIMPL = {'compact ⇏ periodic': (1, 7), 'bounded ⇏ convergent': (3, 5), 'recurrent ⇏ periodic': (6, 7), 'dense ⇏ recurrent': (8, 6),
           'convergent ⇏ bounded': (5, 3), 'periodic ⇏ unbounded lift': (7, 2)}
nonimpl_ok = all(any(r[i] and not r[j] for r in rows) for i, j in NONIMPL.values()) and any(r[0] and r[3] for r in rows)   # last: unbounded parameter, bounded observable
card("A8Db", "implications that hold in every row: periodic ⇒ recurrent, infinitely many cycles ⇒ periodic, periodic ⇒ compact closure, "
     "compact closure ⇒ bounded, recurrent ⇒ no drift, compact closure ⇒ no drift; non-implications witnessed: compact ⇏ periodic, "
     "bounded ⇏ convergent, unbounded parameter ⇏ unbounded observable, recurrent ⇏ periodic, dense ⇏ recurrent, convergent ⇏ bounded, "
     "periodic ⇏ unbounded lift (rotation of simply connected ℝ²)", impl_ok and nonimpl_ok)

# ══ c-indexed family of forms ═════════════════════════════════════════════════════════════════════
tt, xx, xt = sp.symbols('t x xtilde', real=True)
X = sp.Matrix([tt, xx])
qform = lambda M, vec: sp.expand((vec.T*M*vec)[0])
# A8Ma  M_c = P_cᵀ η P_c; finite c are congruent to each other
S12 = sp.diag(1, c2/c1)
card("A8Ma", "M_c = diag(1, −1/c²) = P_cᵀηP_c with P_c = diag(1, 1/c), η = diag(1, −1); q_c(t, x) = t² − x²/c²; for finite c₁, c₂ "
     "the spatial rescaling S = diag(1, c₂/c₁) gives SᵀM_(c₂)S = M_(c₁): every finite c is congruent to η (a representation-level normalization)",
     zm(Pc.T*eta*Pc - Mc) and zero(qform(Mc, X) - (tt**2 - xx**2/c**2)) and zm(S12.T*sp.diag(1, -1/c2**2)*S12 - sp.diag(1, -1/c1**2)))

# A8Mb  determinant, rank, eigenvalues, signature, inverse for finite c
ev = Mc.eigenvals()
card("A8Mb", "finite c > 0: det M_c = −1/c² ≠ 0, rank 2, eigenvalues {1, −1/c²}, signature (1, 1), inverse M_c⁻¹ = diag(1, −c²)",
     zero(Mc.det() + 1/c**2) and Mc.rank() == 2 and ev == {1: 1, -1/c**2: 1} and zm(Mc.inv() - sp.diag(1, -c**2)))

# A8Mc  c → ∞: a degenerate bilinear form, outside every finite-c congruence class
Minf = Mc.applyfunc(lambda e: sp.limit(e, c, sp.oo))
inv_div = sp.limit(Mc.inv()[1, 1], c, sp.oo) == -sp.oo
hlim = (Mc.inv()/c**2).applyfunc(lambda e: sp.limit(e, c, sp.oo))
tau = sp.Matrix([1, 0])
P_ = sp.Matrix(2, 2, sp.symbols('p0:4', real=True))
sylv = zero((P_.T*eta*P_).det() + P_.det()**2)                             # det(PᵀηP) = −det(P)² ≠ 0 for invertible P
card("A8Mc", "c → ∞: M_c → M_∞ = diag(1, 0) (det 0, rank 1, eigenvalues {1, 0}, signature (+, 0)), no inverse; M_c⁻¹ = diag(1, −c²) "
     "diverges while c⁻²M_c⁻¹ → h = diag(0, −1) (rank 1); M_∞ = ττᵀ with τ = dt and hτ = 0 (a degenerate clock form and a degenerate "
     "spatial cometric); P_c → diag(1, 0) is singular and det(PᵀηP) = −det(P)² ≠ 0 for every invertible P: no change of coordinates reaches M_∞",
     Minf == sp.diag(1, 0) and Minf.rank() == 1 and Minf.det() == 0 and Minf.eigenvals() == {1: 1, 0: 1} and inv_div
     and hlim == sp.diag(0, -1) and zm(Minf - tau*tau.T) and zm(hlim*tau) and Pc.applyfunc(lambda e: sp.limit(e, c, sp.oo)).det() == 0 and sylv)

# A8Md  the null cone as c varies; changing coordinates is not changing c
nulls = sp.solve(qform(Mc, X), xx)
dirs = [sp.Matrix([1, sg*c])/sp.sqrt(1 + c**2) for sg in (1, -1)]
dlim = [d.applyfunc(lambda e: sp.limit(e, c, sp.oo)) for d in dirs]
null_inf = sp.solve(qform(Minf, X), tt)
norm_coord = zero(qform(Mc, sp.Matrix([tt, c*xt])) - (tt**2 - xt**2))
card("A8Md", "finite c: q_c = 0 ⟺ x = ±ct, null directions (1, ±c)/√(1 + c²) → (0, ±1) as c → ∞; q_∞ = t² vanishes only on the line "
     "t = 0 (a double root). In x̃ = x/c every finite-c cone is x̃ = ±t: inside one finite-c theory the cone's slope is a coordinate "
     "choice, but no coordinate change produces the c → ∞ limit (A8Mc)",
     sorted(nulls, key=str) == sorted([-c*tt, c*tt], key=str) and dlim == [sp.Matrix([0, 1]), sp.Matrix([0, -1])] and null_inf == [0] and norm_coord)

# A8Me  the preservation group of M_∞ is larger than the Galilean boosts
a, b, k, d = sp.symbols('a b k d', real=True)
A = sp.Matrix([[a, b], [k, d]])
sol = sp.solve(list(A.T*Minf*A - Minf), [a, b], dict=True)
grp_ok = sorted([(r[a], r[b]) for r in sol]) == [(-1, 0), (1, 0)]
h = sp.diag(0, -1)
dil = sp.diag(1, 2)
dil_ok = zm(dil.T*Minf*dil - Minf) and not zm(dil*h*dil.T - h)
gal = sp.Matrix([[1, 0], [k, d]])
h_forces = {tuple(r_) if isinstance(r_, tuple) else (r_,) for r_ in sp.solve(list(gal*h*gal.T - h), d)} == {(-1,), (1,)}
card("A8Me", "AᵀM_∞A = M_∞ ⟺ A = [[±1, 0], [k, d]] with k free and d ≠ 0 free: a 2-parameter identity component containing spatial "
     "dilations x ↦ dx (e.g. diag(1, 2)) that are not Galilean boosts; also preserving the cometric h forces d = ±1. The preservation "
     "group of the degenerate form alone is NOT the Galilean group", grp_ok and dil_ok and h_forces)

# ══ Lorentz → Galilean ═══════════════════════════════════════════════════════════════════════════
v1, v2, sr = sp.symbols('v1 v2 s', real=True)
B = lambda ss, cc: sp.Matrix([[sp.cosh(ss), -sp.sinh(ss)/cc], [-cc*sp.sinh(ss), sp.cosh(ss)]])     # rapidity form, v = c·tanh s
vrat = [sp.Rational(1, 3), sp.Rational(-2, 5), sp.Rational(3, 7)]
vel_form = all(zm(Lam(q*c, c) - B(sp.atanh(q), c)) for q in vrat)
inv_B = zm(B(sr, c).T*Mc*B(sr, c) - Mc) and zero(B(sr, c).det() - 1)
tp, xp = list(Lam(v, c)*X)
inv_q = zero((tp**2 - xp**2/c**2) - (tt**2 - xx**2/c**2))
comp = zm((B(s, c)*B(t, c) - B(s + t, c)).applyfunc(lambda e: e.rewrite(sp.exp)))
vadd = all(zm(Lam(p_*c, c)*Lam(q_*c, c) - Lam(((p_ + q_)/(1 + p_*q_))*c, c)) for p_, q_ in [(vrat[0], vrat[1]), (vrat[1], vrat[2])])
card("A8La", "Lorentz boost t′ = γ_c(t − vx/c²), x′ = γ_c(x − vt): ΛᵀM_cΛ = M_c, det Λ = 1, q_c(t′, x′) = q_c(t, x) (|v| < c); "
     "in rapidity Λ = B_c(s), v = c tanh s, with B_c(s)B_c(t) = B_c(s + t), and velocities compose by (v₁ + v₂)/(1 + v₁v₂/c²)",
     vel_form and inv_B and inv_q and comp and vadd)

gam_lim = sp.limit(1/sp.sqrt(1 - v**2/c**2), c, sp.oo) == 1
Lam_lim = Lam(v, c).applyfunc(lambda e: sp.limit(e, c, sp.oo)) == sp.Matrix([[1, 0], [-v, 1]])
add_lim = sp.limit((v1 + v2)/(1 + v1*v2/c**2), c, sp.oo) == v1 + v2
G = sp.Matrix([[1, 0], [-v, 1]])
gal_pres = zm(G.T*Minf*G - Minf) and zm(G*h*G.T - h)
card("A8Lb", "for fixed finite v: γ_c → 1, Λ_c(v) → [[1, 0], [−v, 1]] (t′ = t, x′ = x − vt), velocity addition → v₁ + v₂ (the Galilean "
     "boost limit); the Galilean boost preserves both M_∞ and h", gam_lim and Lam_lim and add_lim and gal_pres)

# A8Lc  form degeneration vs group contraction
E = lambda i, j: sp.Matrix(3, 3, lambda r, q: 1 if (r, q) == (i, j) else 0)
H_, P3 = E(0, 2), E(1, 2)                                   # time and space translations on (t, x, 1)
Kc = sp.Matrix([[0, -1/c**2, 0], [-1, 0, 0], [0, 0, 0]])     # boost generator dΛ/dv at v = 0
br = lambda X1, X2: X1*X2 - X2*X1
cKH, cKP, cHP = br(Kc, H_), br(Kc, P3), br(H_, P3)
rels = zm(cKH + P3) and zm(cKP + H_/c**2) and zm(cHP)
Kinf = Kc.applyfunc(lambda e: sp.limit(e, c, sp.oo))
derived_dim = lambda gens: sp.Matrix([list(br(X1, X2)) for X1, X2 in itertools.combinations(gens, 2)]).rank()
dims_ = (derived_dim([H_, P3, Kc.subs(c, 1)]), derived_dim([H_, P3, Kc.subs(c, 7)]), derived_dim([H_, P3, Kinf]))
Kp, Pp = c*Kc, c*P3                                           # c-dependent basis change: structure constants become c-free
iso = zm(br(Kp, H_) + Pp) and zm(br(Kp, Pp) + H_) and zm(br(H_, Pp))
card("A8Lc", f"group contraction: with H, P, K_c on (t, x, 1), [K_c, H] = −P, [K_c, P] = −H/c², [H, P] = 0; the derived algebra has "
     f"dimension {dims_[0]} (c = 1), {dims_[1]} (c = 7), {dims_[2]} (c = ∞): Poincaré(1+1) and Galilei(1+1) algebras are not isomorphic, "
     "while every finite c is isomorphic to every other (basis K′ = cK, P′ = cP gives c-free constants). Form degeneration is "
     "different: the limit form's preservation group (A8Me, 2 parameters) is larger than the contracted boost group (1 parameter)",
     rels and dims_ == (2, 2, 1) and iso and V['A8Me'])

# ══ t versus c ═══════════════════════════════════════════════════════════════════════════════════
# A8Sa  t is a group parameter acting on one fixed state space; c indexes different groups and acts only on the space of forms
c3 = sp.symbols('c3', positive=True)
Amix = (B(1, 1)*B(1, 2)).evalf(30)
c3sq = Amix[1, 0]**2/(Amix[0, 0]**2 - 1)
resid = abs(float(Amix[0, 1]**2 - Amix[1, 1]**2/c3sq + 1/c3sq)) + abs(float(Amix[0, 0]*Amix[0, 1] - Amix[1, 0]*Amix[1, 1]/c3sq))
Ds = lambda sg: sp.diag(1, sp.exp(-sg))
orbit_forms = zm(Ds(s).T*eta*Ds(s) - Mc.subs(c, sp.exp(s))) and zm(Ds(s)*Ds(t) - Ds(s + t))
stab_eta = sp.solveset(sp.exp(-2*u) - 1, u, Reals) == sp.FiniteSet(0)
card("A8Sa", f"internal vs external: t is the parameter of one action on one state space (A8Ca); at fixed c the boosts B_c(s) form a "
     f"one-parameter group in the rapidity s, and c is not a group parameter on spacetime: B_1(1)B_2(1) preserves no M_(c₃), "
     f"c₃ > 0 (residual {resid:.3f} > 0.01). The family itself is the orbit of η under the congruence action of D_σ = diag(1, e^(−σ)), "
     "σ = log c, on the space of forms (D_σ D_τ = D_(σ+τ), Stab(η) = {0}), drifting to the degenerate M_∞ outside the orbit",
     V['A8Ca'] and resid > 0.01 and orbit_forms and stab_eta and V['A8Mc'])

# A8Sb  the exact correspondence: t ↔ rapidity s, circle radius r ↔ c; elliptic vs hyperbolic/parabolic, never elliptic in the c-family
J = sp.Matrix([[0, -1], [1, 0]])
r = sp.symbols('r', positive=True)
ell = zm((w*J).T + w*J) and zm((w*J)**2 + w**2*sp.eye(2))
Khat = sp.Matrix([[0, -1/c], [-c, 0]])
hyp = zm(Khat.T*Mc + Mc*Khat) and zm(Khat**2 - sp.eye(2)) and zm(sp.Matrix([[0, -1/c**2], [-1, 0]])**2 - sp.eye(2)/c**2)
never_ell = sp.Matrix([[0, -1/c**2], [-1, 0]])**2 == sp.eye(2)/c**2 and (1/c**2).is_nonnegative is True and Kinf[:2, :2]**2 == sp.zeros(2)
circ_bound = sp.calculus.util.function_range(r*sp.cos(w*t), t, Reals) == sp.Interval(-r, r)
vel_bound = sp.calculus.util.function_range(c*sp.tanh(s), s, Reals) == sp.Interval.open(-c, c) and sp.limit(c*sp.tanh(s), s, sp.oo) == c
card("A8Sb", "exact correspondence: the circle generator ωJ preserves |·|² with (ωJ)² = −ω²I (elliptic: compact periodic orbits); the boost "
     "generator K̂_c preserves M_c with K̂_c² = I (hyperbolic: noncompact orbits) and the velocity-normalized K_c² = I/c² → 0 (parabolic "
     "at c = ∞): no member or limit of the c-family is elliptic. The bound r of r·cos ωt is attained; the bound c of c·tanh s is not "
     "(boundary approach, ≅ drift by A8Pg). So t corresponds to the rapidity s, and c corresponds to the form constant r, not to t",
     ell and hyp and never_ell and circ_bound and vel_bound and V['A8Pg'])

# ══ Rejected implications (item 19) ═══════════════════════════════════════════════════════════════
card("A8Ra", "REJECTED: compact geometry ⇒ periodicity (A8X1: compact T², no periodic orbit; A8X3: compact [0, 1], no periodic non-fixed orbit)",
     V['A8X1'] and V['A8X3'])
card("A8Rb", "REJECTED: bounded observable ⇒ convergence (cos ωt is bounded with no limit, A8Cc)", V['A8Cc'])
card("A8Rc", "REJECTED: unbounded parameter ⇒ unbounded observable (cos ωt ∈ [−1, 1] for t ∈ ℝ, A8Ca; c·tanh s ∈ (−c, c) for s ∈ ℝ, A8Sb)",
     V['A8Ca'] and V['A8Sb'])
dimloss_v = Minf.rank() == 1
card("A8Rd", "REJECTED: parameter → ∞ ⇒ dimension loss (β fixed: rank 2 for every c, A8X5; ω → ∞: e^(iω) has no limit at all; v fixed: "
     "rank 2 → 1, A8Mc): any rank drop depends on what the limit holds fixed",
     V['A8X5'] and isinstance(sp.limit(sp.cos(w), w, sp.oo), sp.AccumBounds) and dimloss_v)

# ══ Final statuses: derived by rules fixed before the run from the verdicts above ══════════════════
RULES = {
 'T-TIME-CIRCLE-0 (old infinity wording)': ('FAIL', ['A8Cc']),
 'corrected intuition (unbounded parameter, bounded geometry)': ('ESTABLISHED INSTANCE', ['A8Ca', 'A8Cd']),
 'H3-original': ('OPEN', ['A8Ca', 'A8Sb']),
 'H3-action': ('PROJECT SYNTHESIS', ['A8Ca', 'A8X1', 'A8X2', 'A8X3', 'A8Pa', 'A8Pb', 'A8Ua']),
 'H3-quotient': ('RESTRICTED', ['A8Ce', 'A8Cf', 'A8Tb', 'A8Pg']),
 'H3-c': ('RESTRICTED', ['A8Sa', 'A8Sb', 'A8Mc', 'A8Lc']),
 'STAR-A': ('FAIL', ['A8X1', 'A8X3']),
 'STAR-B': ('RESTRICTED', ['A8Pe']),
 'STAR-C': ('RESTRICTED', ['A8Pd']),
}
EXPECTED = {'T-TIME-CIRCLE-0 (old infinity wording)': 'FAIL', 'corrected intuition (unbounded parameter, bounded geometry)': 'ESTABLISHED INSTANCE',
            'H3-original': 'OPEN', 'H3-action': 'PROJECT SYNTHESIS', 'H3-quotient': 'RESTRICTED', 'H3-c': 'RESTRICTED',
            'STAR-A': 'FAIL', 'STAR-B': 'RESTRICTED', 'STAR-C': 'RESTRICTED'}
derived_st = {k: (st if all(V[c_] for c_ in cs) else 'UNDETERMINED') for k, (st, cs) in RULES.items()}
card("A8Za", "final statuses (each derived only if all its evidence cards pass): " + '; '.join(f'{k}: {v}' for k, v in derived_st.items()),
     derived_st == EXPECTED)

print(f"\n{sum(V.values())}/{len(V)} checks passed")
