"""W3: what the S^2 dephasing removes from the zero, and how that compares with which-path dephasing.
Exact symbolic arithmetic. Run: python3 verify/verify_W3.py"""
import sympy as sp
from sympy.physics.quantum import TensorProduct as K

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

hb = sp.symbols('hbar', positive=True)
I2 = sp.eye(2); sz = sp.Matrix([[1, 0], [0, -1]])
Sz1, Sz2 = hb / 2 * K(sz, I2), hb / 2 * K(I2, sz)
r2 = sp.sqrt(2)
A = sp.Matrix([0, 1, 1, 0]) / r2; B = sp.Matrix([0, 1, -1, 0]) / r2
al, be = sp.symbols('alpha beta')
psi = al * A + be * B
rho = psi * psi.H
rhoAB = (A.H * rho * B)[0]
exp1 = sp.expand((psi.H * Sz1 * psi)[0]); exp2 = sp.expand((psi.H * Sz2 * psi)[0])
Ps = B * B.H; Pt = A * A.H + sp.Matrix([1, 0, 0, 0]) * sp.Matrix([[1, 0, 0, 0]]) + sp.Matrix([0, 0, 0, 1]) * sp.Matrix([[0, 0, 0, 1]])
rho2 = Pt * rho * Pt + Ps * rho * Ps
card("W3a", "for every psi = alpha|1,0> + beta|0,0> (S_z = 0): S_z^(1) psi = (hbar/2)(beta|1,0> + alpha|0,0>); <S_z^(1)> = hbar Re(rho_AB) = -<S_z^(2)>, where rho_AB = <1,0|rho|0,0>; S_z^(1) has zero diagonal in the {|1,0>, |0,0>} basis (a pure cross-term observable), so the S^2 dephasing sets both expectations to 0 while S_z = 0 holds",
     sp.simplify(Sz1 * psi - hb / 2 * (be * A + al * B)) == sp.zeros(4, 1)
     and sp.simplify(exp1 - hb * (rhoAB + sp.conjugate(rhoAB)) / 2) == 0 and sp.simplify(exp1 + exp2) == 0
     and (A.H * Sz1 * A)[0] == 0 and (B.H * Sz1 * B)[0] == 0
     and sp.simplify((Sz1 * rho2).trace()) == 0 and sp.simplify((Sz2 * rho2).trace()) == 0)
a, b = sp.symbols('a b', real=True); c, o = sp.symbols('c o')
R = sp.Matrix([[a, c], [sp.conjugate(c), b]]); O = sp.Matrix([[0, o], [sp.conjugate(o), 0]])
deph = sp.Matrix([[a, 0], [0, b]])
card("W3b", "the shared mathematics with which-path dephasing is generic: for any two-sector state [[a, c], [c*, b]] and any observable with zero diagonal blocks [[0, o], [o*, 0]], <O> = 2 Re(c o*) and dephasing makes it 0. The stage 2b case is this with o = hbar/2 and c = rho_AB; the double-slit fringe term is this with the path coherence",
     sp.simplify((R * O).trace() - (c * sp.conjugate(o) + sp.conjugate(c) * o)) == 0 and sp.simplify((deph * O).trace()) == 0)
