"""G4: the zero-connector template, linear case, and its first independent application (mass balance).
Exact symbolic checks. Run: python3 verify/verify_G4.py"""
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

R = sp.Rational
L = sp.Matrix(2, 3, sp.symbols('l1:7'))
xs = [sp.Matrix(sp.symbols(f'x{k}_1:4')) for k in range(1, 4)]
card("G4a", "linear connector: for every linear L (symbolic 2x3) and vectors x_1, x_2, x_3: sum_i L x_i = L(sum_i x_i), so sum_i L x_i = 0 iff sum_i x_i is in ker L",
     sp.expand(sum((L * x for x in xs), sp.zeros(2, 1)) - L * (xs[0] + xs[1] + xs[2])) == sp.zeros(2, 1))

L0 = sp.Matrix([[1, 0, 1], [0, 1, 1]])
k0 = L0.nullspace()[0]
t = sp.symbols('t')
x0 = sp.Matrix([1, 2, 0]); y0 = L0 * x0
sol = sp.linsolve((L0, y0), *sp.symbols('z1:4'))
card("G4b", "L known: the sources consistent with a target y are exactly x0 + ker L (here L = [[1,0,1],[0,1,1]], ker spanned by (-1,-1,1)): L(x0 + t k) = y for every t, and the solution set has one free parameter (dim ker L = 1)",
     sp.simplify(L0 * (x0 + t * k0) - y0) == sp.zeros(2, 1) and len(sol.free_symbols) == 1 and L0.rank() == 2)

I4 = sp.eye(4); one = sp.ones(4, 1)
P = I4 - R(1, 4) * one * one.T
v = [P * I4[:, i] for i in range(4)]
d = sp.Matrix([1, 0, 0, 0])                                   # an oblique direction, d . 1 = 1
Lob = I4 - d * one.T / (d.T * one)[0]                         # projects onto 1-perp along d
a = [1, 2, 3, 4]
case1 = all(P * I4[:, i] == v[i] for i in range(4)) and sum((I4[:, i] for i in range(4)), sp.zeros(4, 1)) == one
case2 = all(P * v[i] == v[i] for i in range(4)) and sum(v, sp.zeros(4, 1)) == sp.zeros(4, 1)
src3 = [v[i] + a[i] * d for i in range(4)]
case3 = all(sp.simplify(Lob * src3[i] - v[i]) == sp.zeros(4, 1) for i in range(4)) and sum(src3, sp.zeros(4, 1)) == 10 * d
card("G4c", "L unknown, obstruction: the same tetrahedral target v_1..v_4 (zero sum) comes from (i) P applied to e_i, removing the source sum 1; (ii) P applied to v_i themselves, whose sum is already 0 (nothing removed: the zero is inherited); (iii) the oblique projection onto 1-perp along d = e_1 applied to v_i + a_i d, removing 10 d. The target zero alone does not determine whether, or which, source relation was removed",
     case1 and case2 and case3)

m = sp.Matrix(sp.symbols('m1:4', positive=True)); M = sum(m)
C = sp.eye(3) - sp.ones(3, 1) * m.T / M
X = sp.Matrix(3, 2, sp.symbols('X1:7'))
Rcm = (m.T * X) / M
centered_ok = all(sp.simplify((C * X)[i, :] - (X[i, :] - Rcm)) == sp.zeros(1, 2) for i in range(3))
D = sp.diag(*m)
mass = sp.simplify(C * C - C) == sp.zeros(3, 3) and sp.simplify(C * sp.ones(3, 1)) == sp.zeros(3, 1) and sp.simplify(m.T * C) == sp.zeros(1, 3) \
    and centered_ok and sp.simplify(D * C - C.T * D) == sp.zeros(3, 3)
equal_masses = (I4 - one * one.T / 4) == P and all((P * I4)[:, i] == v[i] for i in range(4))
mu = sp.Matrix([1, 2, 3, 4])
unchanged_fails = (mu.T * P * I4) == sp.Matrix([[R(-3, 2), R(-1, 2), R(1, 2), R(3, 2)]])
card("G4m", "mass balance through the same template: the centering map C_m = I - 1 m^T / M on the index space is a projection (C^2 = C) with kernel spanned by 1 (uniform translation), m^T C = 0 (zero first moment for every configuration), (C X)_i = r_i - R_CM, and C is self-adjoint for <x,y>_m = x^T diag(m) y; with equal masses at e_1..e_4, C = P and the centered positions are exactly v_i; the UNCHANGED template P with unequal masses m = (1,2,3,4) fails: m^T P = (-3/2, -1/2, 1/2, 3/2) != 0",
     mass and equal_masses and unchanged_fails)
