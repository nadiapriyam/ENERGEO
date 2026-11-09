"""Z: cards for Chapter I, Changing the Meaning of 0 (stages 1, 2, 3 and the return 3b).
Exact symbolic checks. No numerical thresholds are used, so none can be moved after seeing a result.
Run: python3 verify/verify_Z1_Z3.py"""
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

# Stage 1: two vectors in R^2, F(v, w) = v + w
v1, v2, w1, w2 = sp.symbols('v1 v2 w1 w2', real=True)
v = sp.Matrix([v1, v2]); w = sp.Matrix([w1, w2])
card("Z1a", "v + (-v) = 0 for every v in R^2, and |v|^2 = v1^2 + v2^2 is 0 only at v = 0 (so both vectors can be nonzero)",
     sp.simplify(v + (-v)) == sp.zeros(2, 1)
     and sp.solve([v1**2 + v2**2], [v1, v2], dict=True) == [{v1: 0, v2: 0}])
# Z1a FAILED on its first run because sympy.solve ignored real=True and returned complex solutions. It is kept as it is.
nz = sp.symbols('n', real=True, nonzero=True)
card("Z1a2", "[added after Z1a FAILED: the check, not the claim, was wrong] v + (-v) = 0, and a vector with a nonzero coordinate has positive length: n^2 + v2^2 > 0 and v1^2 + n^2 > 0 for real n != 0",
     sp.simplify(v + (-v)) == sp.zeros(2, 1)
     and (nz**2 + v2**2).is_positive is True and (v1**2 + nz**2).is_positive is True)
sol = sp.solve(list(v + w), [w1, w2], dict=True)
card("Z1b", "v + w = 0 has the single solution w = -v for each v: a two-parameter family of pairs gives the same zero reading",
     sol == [{w1: -v1, w2: -v2}] and (v.subs({v1: 1, v2: 2}) + (-v).subs({v1: 1, v2: 2})) == sp.zeros(2, 1)
     and (v.subs({v1: -3, v2: 5}) + (-v).subs({v1: -3, v2: 5})) == sp.zeros(2, 1))

# Stage 2: directional contributions in R^3, no positions, F = sum m_j
T = 1 / sp.sqrt(3)
tetra = [sp.Matrix(d) * T for d in ([1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1])]
card("Z2a", "four tetrahedral contributions of equal nonzero length have resultant exactly 0",
     sum(tetra, sp.zeros(3, 1)) == sp.zeros(3, 1) and all(sp.simplify(m.norm() - 1) == 0 for m in tetra))
ms = [sp.Matrix(sp.symbols(f'a{j}1:4', real=True)) for j in range(1, 4)]
m4 = -(ms[0] + ms[1] + ms[2])
card("Z2b", "any three contributions m1, m2, m3 fix a fourth, m4 = -(m1 + m2 + m3), and then the resultant is exactly 0",
     sp.simplify(ms[0] + ms[1] + ms[2] + m4) == sp.zeros(3, 1))
# Z2b FAILED on its first run because the symbol range 'a11:4' produced no symbols. It is kept as it is.
ms2 = [sp.Matrix(sp.symbols(f'a{j}_1:4', real=True)) for j in range(1, 4)]
m42 = -(ms2[0] + ms2[1] + ms2[2])
card("Z2b2", "[added after Z2b FAILED: the check, not the claim, was wrong] for symbolic m1, m2, m3 in R^3, m4 = -(m1 + m2 + m3) makes the resultant exactly 0",
     all(len(m_) == 3 for m_ in ms2) and sp.simplify(ms2[0] + ms2[1] + ms2[2] + m42) == sp.zeros(3, 1))
# a rotation about the line of m_i + m_j leaves m_i + m_j unchanged (used by the pair twist in stage 3b)
th = sp.symbols('theta', real=True)
p = sp.Matrix([1, 2, -1]); q = sp.Matrix([0, -1, 3]); s_ = p + q
k = s_ / s_.norm()
K = sp.Matrix([[0, -k[2], k[1]], [k[2], 0, -k[0]], [-k[1], k[0], 0]])
Rot = sp.eye(3) + sp.sin(th) * K + (1 - sp.cos(th)) * K * K
card("Z2c", "turning two contributions about the line of their sum keeps their sum, so the resultant stays 0 (Rodrigues, symbolic angle)",
     sp.simplify(Rot * p + Rot * q - s_) == sp.zeros(3, 1) and sp.simplify(Rot.T * Rot - sp.eye(3)) == sp.zeros(3, 3))

# Stage 3: positive point masses in R^2, F(R) = sum m_i (r_i - R)
m = sp.symbols('m1:4', positive=True)
x = sp.symbols('x1:4', real=True); y = sp.symbols('y1:4', real=True)
X, Y = sp.symbols('X Y', real=True)
r = [sp.Matrix([x[i], y[i]]) for i in range(3)]
R = sp.Matrix([X, Y])
M = sum(m)
C = sum((m[i] * r[i] for i in range(3)), sp.zeros(2, 1)) / M
F = sum((m[i] * (r[i] - R) for i in range(3)), sp.zeros(2, 1))
card("Z3a", "F(R) = sum m_i (r_i - R) equals M (R_CM - R) with M = sum m_i and R_CM = sum m_i r_i / M",
     sp.simplify(F - M * (C - R)) == sp.zeros(2, 1))
zeros = sp.solve(list(F), [X, Y], dict=True)
card("Z3b", "with every m_i > 0, F(R) = 0 has exactly one solution, R = R_CM; different configurations can share that point",
     len(zeros) == 1 and sp.simplify(sp.Matrix([zeros[0][X], zeros[0][Y]]) - C) == sp.zeros(2, 1)
     and (lambda c1, c2: c1 == c2)(
         (1 * sp.Matrix([-1, 0]) + 1 * sp.Matrix([1, 0])) / 2,
         (3 * sp.Matrix([-1, 1]) + 1 * sp.Matrix([3, -3])) / 4))
a1, a2 = sp.symbols('s1 s2', real=True)
A = sp.Matrix([a1, a2])
C_shift = sum((m[i] * (r[i] + A) for i in range(3)), sp.zeros(2, 1)) / M
card("Z3c", "shifting every mass by the same step a moves the balancing point by a: R_CM(r + a) = R_CM(r) + a",
     sp.simplify(C_shift - (C + A)) == sp.zeros(2, 1))
