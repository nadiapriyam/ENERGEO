"""Q2: the Quantum Additive Cancellation Pair. Two exact zeros (S_z = 0) compared while both remain zero.
Protocol pre-registered in research/constructions/qacp_blind_protocol.md: the states are labelled X and Y from their
amplitudes; the descriptors (Q2b-Q2d) are computed before any S^2 value is read (Q2e).
Exact symbolic arithmetic. Run: python3 verify/verify_Q2.py"""
import sympy as sp
from sympy.physics.quantum import TensorProduct as K

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

hb = sp.symbols('hbar', positive=True)
I2 = sp.eye(2); sz = sp.Matrix([[1, 0], [0, -1]])
Sz1, Sz2 = hb / 2 * K(sz, I2), hb / 2 * K(I2, sz)
Z = sp.zeros(4, 1)
r2 = sp.sqrt(2)
X = sp.Matrix([0, 1, 1, 0]) / r2          # amplitudes only; labels withheld until Q2e
Y = sp.Matrix([0, 1, -1, 0]) / r2
contrib = lambda psi: (Sz1 * psi, Sz2 * psi)
ip = lambda a, b: sp.simplify((a.H * b)[0])
gram = lambda vs: sp.Matrix(len(vs), len(vs), lambda i, j: ip(vs[i], vs[j]))

cX, cY = contrib(X), contrib(Y)
card("Q2a", "two exact zeros made of nonzero contributions: S_z^(1)X = (hbar/2)Y, S_z^(2)X = -(hbar/2)Y, S_z^(1)Y = (hbar/2)X, S_z^(2)Y = -(hbar/2)X; each contribution is nonzero and each pair sums to 0 (S_z X = S_z Y = 0)",
     sp.simplify(cX[0] - hb / 2 * Y) == Z and sp.simplify(cX[1] + hb / 2 * Y) == Z and sp.simplify(cY[0] - hb / 2 * X) == Z and sp.simplify(cY[1] + hb / 2 * X) == Z
     and all(c != Z for c in cX + cY) and sp.simplify(cX[0] + cX[1]) == Z and sp.simplify(cY[0] + cY[1]) == Z)

g_pair = gram(list(cX)) == gram(list(cY)) and gram(list(cX)) == sp.Matrix([[1, -1], [-1, 1]]) * hb**2 / 4
g_full = gram([X, *cX]) == gram([Y, *cY])
card("Q2b", "blind descriptors 1-3 do not separate X from Y: Gram(c1, c2) = (hbar^2/4)[[1,-1],[-1,1]] for both; Gram(psi, c1, c2) identical (each contribution orthogonal to its own state); equal norms hbar/2; same relative sign (c2 = -c1)",
     g_pair and g_full)

U = sp.diag(sp.I, sp.I, -sp.I, -sp.I)       # exp(i pi S_z^(1)/hbar): rotation of particle 1 by pi about z
P = sp.Matrix([[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]])   # canonical exchange of the two factors
sx, sy = sp.Matrix([[0, 1], [1, 0]]), sp.Matrix([[0, -sp.I], [sp.I, 0]])
S = [hb / 2 * (K(s, I2) + K(I2, s)) for s in (sx, sy, sz)]
S2 = sp.simplify(sum((s * s for s in S), sp.zeros(4, 4)))
comm = lambda A, B: sp.simplify(A * B - B * A)
obstruction = sp.simplify(U.H * U - sp.eye(4)) == sp.zeros(4, 4) and comm(U, Sz1) == sp.zeros(4, 4) and comm(U, Sz2) == sp.zeros(4, 4) \
    and sp.simplify(U * X - sp.I * Y) == Z and all(sp.simplify(U * a - sp.I * b) == Z for a, b in zip(cX, cY)) \
    and comm(U, P) != sp.zeros(4, 4) and comm(U, S2) != sp.zeros(4, 4)
card("Q2c", "obstruction: U = exp(i pi S_z^(1)/hbar) is unitary, commutes with S_z^(1) and S_z^(2), and maps X to iY and each contribution of X to i times the matching contribution of Y. So no descriptor built only from (psi, S_z^(1), S_z^(2), inner products), invariant under such unitaries and global phase, can separate the two zeros. U does not commute with the exchange P or with S^2",
     obstruction)

eps = lambda c, E: (sp.simplify(E * c[0] - c[1]) == Z and 1) or (sp.simplify(E * c[0] + c[1]) == Z and -1) or None
V = P * U                                     # another unitary that swaps the summands: V S_z^(1) V^-1 = S_z^(2)
swaps = sp.simplify(V * Sz1 * V.H - Sz2) == sp.zeros(4, 4) and sp.simplify(P * Sz1 * P - Sz2) == sp.zeros(4, 4)
parity = lambda psi: (sp.simplify(P * psi - psi) == Z and 1) or (sp.simplify(P * psi + psi) == Z and -1) or None
card("Q2d", "blind descriptor 4 separates them: with the canonical exchange P, P c1 = eps c2 gives eps(X) = +1 and eps(Y) = -1; eps equals the exchange parity of the state (covariance: P S_z^(1) P = S_z^(2)); with V = P U, which also swaps the summands, V c1 is a multiple of c2 for neither state, so eps needs the canonical identification of the two factors",
     eps(cX, P) == 1 and eps(cY, P) == -1 and parity(X) == 1 and parity(Y) == -1 and swaps and eps(cX, V) is None and eps(cY, V) is None)

# ── reveal (after the descriptors above were fixed) ──
predicted = {1: 2 * hb**2, -1: 0}             # the pre-registered rule, via the textbook identity S^2 = hbar^2 (1 + P)
identity = sp.simplify(S2 - hb**2 * (sp.eye(4) + P)) == sp.zeros(4, 4)
card("Q2e", "reveal: S^2 X = 2 hbar^2 X (triplet |1,0>) and S^2 Y = 0 (singlet |0,0>); the pre-registered rule eps = +1 -> 2 hbar^2, eps = -1 -> 0 holds, through the textbook identity S^2 = hbar^2 (1 + P) (secondary existing mathematics, not project geometry)",
     identity and sp.simplify(S2 * X - predicted[eps(cX, P)] * X) == Z and sp.simplify(S2 * Y - predicted[eps(cY, P)] * Y) == Z)

def tprime(n):
    Pn = sp.eye(n) - sp.ones(n, n) / n
    v = [Pn[:, i] for i in range(n)]
    ok = True
    for i in range(n):
        for j in range(n):
            if i == j: continue
            T = sp.eye(n); T[i, i] = T[j, j] = 0; T[i, j] = T[j, i] = 1      # transposition of e_i and e_j
            ok = ok and T * Pn == Pn * T and T * v[i] == v[j]
    return ok
n2 = sp.eye(2) - sp.ones(2, 2) / 2
swap2 = sp.Matrix([[0, 1], [1, 0]])
card("Q2f", "T' under exchange: every transposition of the source basis commutes with P_n and maps v_i to v_j with sign +1 (n = 2, 3, 4); for n = 2 the shadows lie in the swap-antisymmetric line (swap v_1 = v_2 = -v_1)",
     all(tprime(k) for k in (2, 3, 4)) and swap2 * n2[:, 0] == n2[:, 1] and n2[:, 1] == -n2[:, 0])

ud = sp.Matrix([0, 1, 0, 0])
cu = contrib(ud)
card("Q2g", "domain of eps: |ud> also has S_z = 0, but it is not an exchange eigenstate; its contributions are (hbar/2)|ud> and -(hbar/2)|ud> (parallel to the state), and P c1 is a multiple of c2 for no sign, so eps is undefined there",
     sp.simplify(Sz1 * ud + Sz2 * ud) == Z and sp.simplify(cu[0] - hb / 2 * ud) == Z and eps(cu, P) is None and parity(ud) is None)

# Q2h: the corrected, restricted obstruction (replaces the broad wording of Q2c's record)
Cfg = lambda psi: [psi, Sz1 * psi, Sz2 * psi]
A_, B_ = X, Y
gram_eq = gram(Cfg(A_)) == gram(Cfg(B_))
mapped = all(sp.simplify(U * a - sp.I * b) == Z for a, b in zip(Cfg(A_), Cfg(B_)))
not_covered = sp.simplify(ip(cX[0], P * cX[0]) - ip(cY[0], P * cY[0])) != 0           # a descriptor using P, which does not commute with U
card("Q2h", "restricted obstruction: U = exp(i pi S_z^(1)/hbar) acts on C^2 (x) C^2, commutes with S_z^(1), S_z^(2) and S_z, and maps the configuration C = (psi, S_z^(1)psi, S_z^(2)psi) of |1,0> to i times that of |0,0>. Hence every descriptor D with D(W C) = D(C) for all unitaries W commuting with S_z^(1) and S_z^(2), and D(e^{i phi} C) = D(C), takes equal values on the two; this class contains every function of the Gram matrix of C (norms, inner products, the relative cancellation c2 = -c1, spans up to such W). It does NOT contain descriptors using an operator that does not commute with U, e.g. <c1, P c1> = -hbar^2/4 vs +hbar^2/4",
     gram_eq and mapped and not_covered and comm(U, Sz1 + Sz2) == sp.zeros(4, 4))
