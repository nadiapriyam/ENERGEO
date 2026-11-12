"""G5: weighted mass centering (WMC) and its comparison with T' (orthonormal source, uniform direction removed).
Derived outside-in: raw operators first, then kernel / image / rank / eigenvalues / idempotence / adjoints / Gram /
zero condition, then the common algebra, then the differences. Exact symbolic arithmetic.
Record: research/constructions/weighted_mass_centering.md, research/constructions/centering_comparison.md.
Run: python3 verify/verify_G5.py"""
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

R = sp.Rational
n = 3
m = sp.Matrix(sp.symbols('m1:4', positive=True)); M = sum(m)
one = sp.ones(n, 1); I = sp.eye(n); D = sp.diag(*m)
X = sp.Matrix(n, 2, sp.symbols('x1:7', real=True))             # rows r_i in R^2
Rcm = (m.T * X) / M
U = sp.Matrix.vstack(*[m[i] * (X[i, :] - Rcm) for i in range(n)])   # rows u_i = m_i (r_i - R_CM)
card("G5a", "WMC raw: R_CM = (1/M) sum m_i r_i and u_i = m_i (r_i - R_CM) give sum_i u_i = 0 for every positive masses and every positions (symbolic, n = 3, positions in R^2)",
     sp.simplify(sp.ones(1, n) * U) == sp.zeros(1, 2))

C = I - one * m.T / M                                           # centering: (C X)_i = r_i - R_CM
Lm = D * C                                                      # moments: u = D C X
ok_c = sp.simplify(C * X - sp.Matrix.vstack(*[X[i, :] - Rcm for i in range(n)])) == sp.zeros(n, 2) and sp.simplify(Lm * X - U) == sp.zeros(n, 2)
idem = sp.simplify(C * C - C) == sp.zeros(n, n)
ker = sp.simplify(C * one) == sp.zeros(n, 1)
img = sp.simplify(m.T * C) == sp.zeros(1, n)                     # image lies in m-perp (Euclidean)
mnum = {m[0]: 1, m[1]: 2, m[2]: 3}
Cn = C.subs(mnum)
ev = Cn.eigenvals() == {1: 2, 0: 1} and Cn.rank() == 2
not_sym = Cn != Cn.T
sym_equal = (I - one * one.T / 3) == (I - one * one.T / 3).T
D_adj = sp.simplify(D * C - C.T * D) == sp.zeros(n, n)
zero_rel = sp.simplify(one.T * D * C) == sp.zeros(1, n)          # <1, C x>_D = 0 for every x
card("G5b", "the centering operator C_m = I - 1 m^T / M: (C X)_i = r_i - R_CM and u = D C X with D = diag(m); C^2 = C, C 1 = 0 (kernel span{1}), m^T C = 0 (image = m-perp, Euclidean), eigenvalues {1 (x n-1), 0}, rank n-1; NOT symmetric in the Euclidean metric unless m is proportional to 1 (m = (1,2,3) checked), but self-adjoint for <x,y>_D = x^T D y (D C = C^T D); its zero relation is <1, C x>_D = 0 for every x",
     ok_c and idem and ker and img and ev and not_sym and sym_equal and D_adj and zero_rel)

Ln = Lm.subs(mnum)
card("G5c", "the moment operator L_m = D C_m = D - m m^T / M (u = L_m X): Euclidean-symmetric, positive semidefinite, kernel span{1}, image = 1-perp (so sum u_i = 0, the same zero relation as T'), rank n-1; NOT idempotent unless m = 1 (m = (1,2,3): L^2 != L, eigenvalues not in {0,1})",
     sp.simplify(Lm - Lm.T) == sp.zeros(n, n) and sp.simplify(Lm * one) == sp.zeros(n, 1) and sp.simplify(one.T * Lm) == sp.zeros(1, n)
     and all(e >= 0 for e in Ln.eigenvals()) and Ln.rank() == 2 and Ln * Ln != Ln and set(Ln.eigenvals()) - {0, 1} != set())

g = sp.Matrix(sp.symbols('g1:4', positive=True)); G = sp.diag(*g)
CG = I - one * one.T * G / (one.T * G * one)[0]
fam = sp.simplify(CG * CG - CG) == sp.zeros(n, n) and sp.simplify(CG * one) == sp.zeros(n, 1) and sp.simplify(G * CG - CG.T * G) == sp.zeros(n, n) \
    and sp.simplify(one.T * G * CG) == sp.zeros(1, n)
special_T = sp.simplify(CG.subs({g[0]: 1, g[1]: 1, g[2]: 1}) - (I - one * one.T / 3)) == sp.zeros(n, n)
special_W = sp.simplify(CG.subs({g[0]: m[0], g[1]: m[1], g[2]: m[2]}) - C) == sp.zeros(n, n)
card("G5d", "one operator contains both: C_G = I - 1 1^T G / (1^T G 1) for a positive diagonal G is idempotent, kills 1, is G-self-adjoint, and satisfies <1, C_G x>_G = 0 for every x; G = I gives T' (P_n) exactly, G = diag(m) gives WMC (C_m) exactly; the metric is read off each zero relation, not inserted",
     fam and special_T and special_W)

k = 4
mm = sp.Matrix([1, 2, 3, 4]); MM = sum(mm); Dk = sp.diag(*mm); one4 = sp.ones(k, 1); E4 = sp.eye(k)
Ck = E4 - one4 * mm.T / MM
cent = [Ck[i, :].T for i in range(k)]                           # e_i - m/M
equidist = all(((cent[i] - cent[j]).T * (cent[i] - cent[j]))[0] == 2 for i in range(k) for j in range(k) if i != j)
plain_sum = sum(cent, sp.zeros(k, 1)) != sp.zeros(k, 1)
wsum = sum((mm[i] * cent[i] for i in range(k)), sp.zeros(k, 1)) == sp.zeros(k, 1)
uu = [mm[i] * cent[i] for i in range(k)]
not_regular = len({(uu[i].T * uu[i])[0] for i in range(k)}) > 1
f = [E4[:, i] / sp.sqrt(mm[i]) for i in range(k)]                # D-orthonormal source
Cf = [Ck * fi for fi in f]
GD = sp.Matrix(k, k, lambda i, j: sp.simplify((Cf[i].T * Dk * Cf[j])[0]))
s = sp.Matrix([sp.sqrt(mm[i] / MM) for i in range(k)])
tight = sp.simplify(GD - (E4 - s * s.T)) == sp.zeros(k, k)
card("G5e", "configurations, unequal masses m = (1,2,3,4) at e_1..e_4: centered positions e_i - m/M stay pairwise equidistant (|.|^2 = 2: a translated regular simplex) but their plain sum is not 0, only the weighted sum is; the moments u_i have unequal norms (not a regular simplex); a D-orthonormal source e_i/sqrt(m_i) projected by C_m has D-Gram I - s s^T with s_i = sqrt(m_i/M): a tight frame, regular only when all m_i are equal",
     equidist and plain_sum and wsum and not_regular and tight)

c = sp.Matrix(sp.symbols('c1:4'))
c0 = c.subs(c[2], -c[0] - c[1])                                  # any zero-sum vector
trivial = sp.simplify((I - one * one.T / 3) * c0 - c0) == sp.zeros(n, 1)
mixed = (sp.ones(1, 2) * sp.diag(1, -1) * sp.ones(2, 1))[0] == 0  # weights (1,-1): 1^T G 1 = 0, C_G undefined
w = sp.exp(-2 * sp.pi * sp.I / 3)
fourier_k1 = [w**j for j in range(3)]
not_positive = any(not (sp.simplify(x).is_real and sp.simplify(x) > 0) for x in fourier_k1)
removed = (one.T * one)[0] != 0
card("G5f", "discrimination and boundaries: every zero-sum vector is a fixed point of P_n, so lying in its image carries no information; the construction has content only when a source with a nonzero removed mode is mapped (sum e_i = 1 != 0). It does not apply when 1^T G 1 = 0 (weights (1,-1)) or when the weights are not positive reals (Fourier k = 1 weights w^j, w = e^{-2 pi i/3})",
     trivial and mixed and not_positive and removed)
