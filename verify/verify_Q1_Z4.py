"""Q1: stage 2b, two spin-1/2 particles (a separate exact quantum case, not a model of MRI ensemble cancellation).
Z4: a research note on Chapter I's limitation: preserving a zero resultant is too weak to single out a geometry.
Exact symbolic checks with hbar kept as a symbol. No numerical thresholds.
Run: python3 verify/verify_Q1_Z4.py"""
import sympy as sp
from sympy.physics.quantum import TensorProduct as K

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

hb = sp.symbols('hbar', positive=True)
sx = sp.Matrix([[0, 1], [1, 0]]); sy = sp.Matrix([[0, -sp.I], [sp.I, 0]]); sz = sp.Matrix([[1, 0], [0, -1]])
I2 = sp.eye(2)
Sx, Sy, Sz = (hb / 2 * (K(s, I2) + K(I2, s)) for s in (sx, sy, sz))
S2 = sp.simplify(Sx * Sx + Sy * Sy + Sz * Sz)
up = sp.Matrix([1, 0]); dn = sp.Matrix([0, 1])
ud = K(up, dn); du = K(dn, up)
A = (ud + du) / sp.sqrt(2)   # triplet |1,0>
B = (ud - du) / sp.sqrt(2)   # singlet |0,0>
Z4 = sp.zeros(4, 1)

card("Q1a", "S_z A = 0 and S_z B = 0 for A = (|ud> + |du>)/sqrt2, B = (|ud> - |du>)/sqrt2: both are eigenstates with eigenvalue 0, so S_z returns 0 with certainty",
     sp.simplify(Sz * A) == Z4 and sp.simplify(Sz * B) == Z4)
card("Q1b", "S^2 = Sx^2 + Sy^2 + Sz^2 (from the Pauli matrices, complex sigma_y) gives S^2 A = 2 hbar^2 A and S^2 B = 0",
     sp.simplify(S2 * A - 2 * hb**2 * A) == Z4 and sp.simplify(S2 * B) == Z4)
card("Q1c", "A and B are different states: both normalized, and no phase makes one a multiple of the other (rank [A B] = 2)",
     sp.simplify((A.H * A)[0] - 1) == 0 and sp.simplify((B.H * B)[0] - 1) == 0 and sp.Matrix.hstack(A, B).rank() == 2)
card("Q1d", "the states with S_z = 0 form a two-dimensional family: the null space of S_z is spanned by |ud> and |du>",
     len(Sz.nullspace()) == 2)
card("Q1e", "S^2 and S_z commute, so both can be measured on the same state: [S^2, S_z] = 0",
     sp.simplify(S2 * Sz - Sz * S2) == sp.zeros(4, 4))

# Z4: preserving a zero resultant
v = [sp.Matrix(sp.symbols(f'v{j}_1:3', real=True)) for j in range(1, 3)]
v.append(-(v[0] + v[1]))                    # a zero-resultant configuration
a = sp.Matrix(2, 2, sp.symbols('a1:5', real=True))
card("Z4a", "if v1 + v2 + v3 = 0, then A v1 + A v2 + A v3 = A (v1 + v2 + v3) = 0 for every linear map A (symbolic 2x2)",
     all(len(x) == 2 for x in v) and sp.simplify(a * v[0] + a * v[1] + a * v[2]) == sp.zeros(2, 1))
m = sp.Matrix(2, 2, sp.symbols('m1:5', real=True))
D = 2 * sp.eye(2)
sol = sp.solve(list(D.T * m * D - m), list(m), dict=True)
card("Z4b", "doubling every vector keeps every zero resultant at zero, yet it preserves a bilinear form M (D^T M D = M) only when M = 0",
     sol == [{s: 0 for s in m}])
