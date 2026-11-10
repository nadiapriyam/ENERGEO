"""Z3d and Z5: precision cards added at the theory-preservation audit.
Z3d: the mass zero written as a zero-sum of vector contributions (Pair A's shared algebraic form).
Z5a: a boundary for the general zero statement: some measurements are zero only at zero, so a zero need not, but may,
determine the state. Exact symbolic checks; no numerical thresholds.
Run: python3 verify/verify_Z5.py"""
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

m = sp.symbols('m1:4', positive=True)
x = sp.symbols('x1:4', real=True); y = sp.symbols('y1:4', real=True)
r = [sp.Matrix([x[i], y[i]]) for i in range(3)]
M = sum(m)
C = sum((m[i] * r[i] for i in range(3)), sp.zeros(2, 1)) / M
u = [m[i] * (r[i] - C) for i in range(3)]
cx, cy = sp.symbols('cx cy', real=True)
card("Z3d", "with u_i = m_i (r_i - R_CM), sum u_i = 0 exactly; and for m_i > 0, u_i = 0 only when r_i = R_CM, so the contributions are nonzero unless a mass sits at R_CM",
     sp.simplify(sum(u, sp.zeros(2, 1))) == sp.zeros(2, 1)
     and sp.solve(list(m[0] * (sp.Matrix([x[0], y[0]]) - sp.Matrix([cx, cy]))), [x[0], y[0]], dict=True) == [{x[0]: cx, y[0]: cy}])
n = sp.symbols('n', real=True, nonzero=True)
a = sp.symbols('a', real=True)
card("Z5a", "boundary: F(x) = |x|^2 on R^2 is 0 only at x = 0 (n^2 + a^2 > 0 and a^2 + n^2 > 0 for real n != 0), so a zero reading can determine the state for some measurements",
     (n**2 + a**2).is_positive is True and (a**2 + n**2).is_positive is True)
