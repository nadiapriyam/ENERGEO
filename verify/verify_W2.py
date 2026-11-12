"""W2: stage 2b under an ideal projective measurement of S^2, outcome ignored; and the comparison with which-path
dephasing. Calculation only; no interpretation beyond what is computed. No observer claims.
Run: python3 verify/verify_W2.py"""
import sympy as sp
from sympy.physics.quantum import TensorProduct as K

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

hb = sp.symbols('hbar', positive=True)
up, dn = sp.Matrix([1, 0]), sp.Matrix([0, 1]); I2 = sp.eye(2)
sx, sy, sz = sp.Matrix([[0, 1], [1, 0]]), sp.Matrix([[0, -sp.I], [sp.I, 0]]), sp.Matrix([[1, 0], [0, -1]])
S1 = [hb / 2 * K(s, I2) for s in (sx, sy, sz)]; S2_ = [hb / 2 * K(I2, s) for s in (sx, sy, sz)]
Sz = S1[2] + S2_[2]
S2 = sp.simplify(sum(((a + b) * (a + b) for a, b in zip(S1, S2_)), sp.zeros(4, 4)))
ud, du = K(up, dn), K(dn, up)
A = (ud + du) / sp.sqrt(2); B = (ud - du) / sp.sqrt(2)          # |1,0> and |0,0>
psi = (A + B) / sp.sqrt(2)
rho = psi * psi.H
Ps = B * B.H; Pt = sp.eye(4) - Ps
rho2 = sp.simplify(Pt * rho * Pt + Ps * rho * Ps)
blk = lambda r: sp.Matrix([[(A.H * r * A)[0], (A.H * r * B)[0]], [(B.H * r * A)[0], (B.H * r * B)[0]]])
card("W2a", "psi = (|1,0> + |0,0>)/sqrt2 = |ud>; before: rho = |ud><ud|, in the {|1,0>, |0,0>} basis [[1/2, 1/2], [1/2, 1/2]]; after the S^2 measurement with the outcome ignored, rho' = P_t rho P_t + P_s rho P_s = [[1/2, 0], [0, 1/2]]: exactly the two off-diagonal terms <1,0|rho|0,0> = <0,0|rho|1,0> = 1/2 become 0",
     sp.simplify(psi - ud) == sp.zeros(4, 1) and sp.simplify(blk(rho) - sp.Matrix([[1, 1], [1, 1]]) / 2) == sp.zeros(2, 2)
     and sp.simplify(blk(rho2) - sp.eye(2) / 2) == sp.zeros(2, 2))
card("W2b", "S_z stays 0 (S_z rho' = rho' S_z = 0); S^2 information becomes available (outcomes 2 hbar^2 and 0, probability 1/2 each); the coherence between the two S^2 sectors is lost; purity Tr rho^2 drops from 1 to 1/2",
     sp.simplify(Sz * rho2) == sp.zeros(4, 4) and sp.simplify(rho2 * Sz) == sp.zeros(4, 4) and sp.simplify(S2 - 2 * hb**2 * Pt) == sp.zeros(4, 4)
     and sp.simplify((Pt * rho).trace() - sp.Rational(1, 2)) == 0 and sp.simplify((Ps * rho).trace() - sp.Rational(1, 2)) == 0
     and sp.simplify((rho * rho).trace() - 1) == 0 and sp.simplify((rho2 * rho2).trace() - sp.Rational(1, 2)) == 0)
card("W2c", "what changes inside the zero: <S_z^(1)> goes from +hbar/2 to 0 and <S_z^(2)> from -hbar/2 to 0 (the zero stops being a cancellation of +hbar/2 and -hbar/2); product-basis populations of |ud>, |du> go from (1, 0) to (1/2, 1/2)",
     sp.simplify((S1[2] * rho).trace() - hb / 2) == 0 and sp.simplify((S1[2] * rho2).trace()) == 0
     and sp.simplify((S2_[2] * rho).trace() + hb / 2) == 0 and sp.simplify((S2_[2] * rho2).trace()) == 0
     and sp.simplify((ud.H * rho2 * ud)[0] - sp.Rational(1, 2)) == 0 and sp.simplify((du.H * rho2 * du)[0] - sp.Rational(1, 2)) == 0)
a, b = sp.symbols('a b', real=True); cc = sp.symbols('c')
Rg = a * A * A.H + b * B * B.H + cc * A * B.H + sp.conjugate(cc) * B * A.H     # a generic state on the S_z = 0 sector
Rg2 = Pt * Rg * Pt + Ps * Rg * Ps
path = sp.Matrix([[a, cc], [sp.conjugate(cc), b]])
ma, mb = sp.Matrix([1, 0]), sp.Matrix([0, 1])
marked = sp.Matrix(2, 2, lambda i, j: path[i, j] * ([ma, mb][j].H * [ma, mb][i])[0])  # trace over orthogonal markers
card("W2d", "structural comparison: on the S_z = 0 sector, the S^2 measurement maps [[a, c], [c*, b]] (basis |1,0>, |0,0>) to [[a, 0], [0, b]]; two-path which-path marking with orthogonal markers maps the path matrix [[a, c], [c*, b]] to the same [[a, 0], [0, b]]: the same dephasing map on a two-sector decomposition",
     sp.simplify(blk(Rg2) - sp.Matrix([[a, 0], [0, b]])) == sp.zeros(2, 2) and sp.simplify(marked - sp.Matrix([[a, 0], [0, b]])) == sp.zeros(2, 2))
comm = lambda X, Y: sp.simplify(X * Y - Y * X)
card("W2e", "two incompatible zero-preserving interrogations: S^2 and S_z^(1) both commute with S_z, but [S^2, S_z^(1)] != 0. On |ud>, measuring S_z^(1) leaves the state unchanged; on |1,0>, measuring S_z^(1) leaves S_z = 0 but destroys the S^2 definiteness",
     comm(S2, Sz) == sp.zeros(4, 4) and comm(S1[2], Sz) == sp.zeros(4, 4) and comm(S2, S1[2]) != sp.zeros(4, 4)
     and sp.simplify(S1[2] * ud - hb / 2 * ud) == sp.zeros(4, 1)
     and sp.simplify((A.H * (ud * ud.H * A * A.H * ud * ud.H + du * du.H * A * A.H * du * du.H) * A)[0] - sp.Rational(1, 2)) == 0)
card("W2f", "the quantum zero is a cancellation at the vector level: S_z^(1)|1,0> = (hbar/2)|0,0> and S_z^(2)|1,0> = -(hbar/2)|0,0>, nonzero and opposite (likewise with |1,0> and |0,0> exchanged), while the expectations <S_z^(1)> and <S_z^(2)> are each 0 in |1,0> and |0,0>: a zero resultant of nonzero vector contributions, whose contributions point to the other state",
     sp.simplify(S1[2] * A - hb / 2 * B) == sp.zeros(4, 1) and sp.simplify(S2_[2] * A + hb / 2 * B) == sp.zeros(4, 1)
     and sp.simplify(S1[2] * B - hb / 2 * A) == sp.zeros(4, 1) and sp.simplify(S2_[2] * B + hb / 2 * A) == sp.zeros(4, 1)
     and all(sp.simplify((X.H * Op * X)[0]) == 0 for X in (A, B) for Op in (S1[2], S2_[2])))
