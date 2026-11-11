"""G2: the R4 orthogonal-source construction (tetrahedral zero construction), the first outside-in construction.
Exact rational/symbolic arithmetic throughout; no floating point, no thresholds.
What these cards establish is recorded in research/constructions/r4_tetrahedral_zero.md, including what they do NOT
establish (nothing here says anything about physical protons or a physical fourth dimension).
Run: python3 verify/verify_G2.py"""
import re, pathlib
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

R = sp.Rational
I4 = sp.eye(4)
one = sp.ones(4, 1)
P = I4 - R(1, 4) * one * one.T                       # P = I - (1/4) 1 1^T
e = [I4[:, i] for i in range(4)]
v = [P * ei for ei in e]                              # v_i = P e_i = e_i - (1/4) 1

card("G2a", "P = I - (1/4) 1 1^T is the orthogonal projector onto 1-perp in R^4: P^2 = P, P^T = P, P 1 = 0, rank P = 3 (so its range is all of the 3-dimensional 1-perp)",
     P * P == P and P.T == P and P * one == sp.zeros(4, 1) and P.rank() == 3)
card("G2b", "each v_i = P e_i equals e_i - (1/4) 1 and lies in H = 1-perp: v_i . 1 = 0",
     all(v[i] == e[i] - R(1, 4) * one and (v[i].T * one)[0] == 0 for i in range(4)))
card("G2c", "zero sum: v_1 + v_2 + v_3 + v_4 = 0 (exactly)",
     v[0] + v[1] + v[2] + v[3] == sp.zeros(4, 1))
card("G2d", "equal norms: |v_i|^2 = 3/4 for every i",
     all((v[i].T * v[i])[0] == R(3, 4) for i in range(4)))
card("G2e", "equal pairwise inner products: v_i . v_j = -1/4 for every i != j",
     all((v[i].T * v[j])[0] == R(-1, 4) for i in range(4) for j in range(4) if i != j))
u = [vi / sp.sqrt(R(3, 4)) for vi in v]
card("G2f", "normalized u_i = v_i/|v_i|: u_i . u_j = -1/3 for every i != j, and |u_i| = 1 (the directions of a regular tetrahedron in H)",
     all(sp.simplify((u[i].T * u[j])[0] - (1 if i == j else R(-1, 3))) == 0 for i in range(4) for j in range(4)))
V = sp.Matrix.hstack(*v)                              # columns v_1..v_4
G = V.T * V
J = sp.ones(4, 4)
ev = G.eigenvals()
card("G2g", "Gram matrix of the columns v_1..v_4 is G = I - (1/4) J (J all-ones), which equals P itself; eigenvalues exactly 1 (multiplicity 3) and 0 (multiplicity 1), rank 3; its kernel is spanned by 1",
     G == I4 - R(1, 4) * J and G == P and ev == {1: 3, 0: 1} and G.rank() == 3 and G.nullspace()[0].normalized() == (one / 2))
card("G2h", "span{v_1,...,v_4} = 1-perp and has dimension 3: rank [v_1 ... v_4] = 3 and every v_i is orthogonal to 1 (a 3-dimensional subspace of the 3-dimensional 1-perp is all of it)",
     V.rank() == 3 and all((vi.T * one)[0] == 0 for vi in v))

# G2i: Stage 2's first constructed state, read from the app's own source (src/math/zero.js), against the construction.
src = (pathlib.Path(__file__).resolve().parents[1] / 'src' / 'math' / 'zero.js').read_text()
assert re.search(r"const T = 1 / Math\.sqrt\(3\);", src), 'TETRA scale changed: re-check G2i'
rows = re.search(r"export const TETRA = \[(.*)\];", src).group(1)
signs = [[-1 if t.strip().startswith('-') else 1 for t in r.split(',')] for r in re.findall(r"\[([^\]]*)\]", rows)]
TETRA = [sp.Matrix(s) / sp.sqrt(3) for s in signs]
h = [sp.Matrix([1, 1, -1, -1]) / 2, sp.Matrix([1, -1, 1, -1]) / 2, sp.Matrix([1, -1, -1, 1]) / 2]   # an orthonormal basis of H
Hm = sp.Matrix.hstack(*h)
phi = lambda x: Hm.T * x                               # the isometry H -> R^3, x |-> (h_1.x, h_2.x, h_3.x)
card("G2i", "Stage 2's TETRA (read from src/math/zero.js) equals, entry for entry and in the same order, the normalized projected vectors u_i in the orthonormal basis h_1=(1,1,-1,-1)/2, h_2=(1,-1,1,-1)/2, h_3=(1,-1,-1,1)/2 of H: Phi(u_i) = TETRA_i with no permutation and no sign change (Phi is an isometry H -> R^3)",
     len(TETRA) == 4 and Hm.T * Hm == sp.eye(3) and all((hk.T * one)[0] == 0 for hk in h)
     and all(sp.simplify(phi(u[i]) - TETRA[i]) == sp.zeros(3, 1) for i in range(4)))

# G2n: the same construction for every n (derived in project notation by bilinear expansion, then checked for n = 2..10)
n = sp.symbols('n', integer=True, positive=True)
d = sp.symbols('delta')                                # e_i . e_j (1 if i = j else 0)
ip = d - R(1) / n * 1 - R(1) / n * 1 + (R(1) / n) ** 2 * n          # (e_i - 1/n 1).(e_j - 1/n 1), using e_i.1 = 1, 1.1 = n
sym_ok = sp.simplify(ip.subs(d, 1) - (n - 1) / n) == 0 and sp.simplify(ip.subs(d, 0) + 1 / n) == 0 \
    and sp.simplify((ip.subs(d, 0)) / (ip.subs(d, 1)) + 1 / (n - 1)) == 0 and sp.simplify(1 - n * (R(1) / n)) == 0
def concrete(k):
    Pk = sp.eye(k) - R(1, k) * sp.ones(k, k)
    vk = [Pk[:, i] for i in range(k)]
    Gk = sp.Matrix.hstack(*vk).T * sp.Matrix.hstack(*vk)
    return sum(vk, sp.zeros(k, 1)) == sp.zeros(k, 1) and all(Gk[i, j] == (R(k - 1, k) if i == j else R(-1, k)) for i in range(k) for j in range(k)) \
        and sp.Matrix.hstack(*vk).rank() == k - 1
card("G2n", "for every n >= 2, v_i = P_n e_i with P_n = I - (1/n) 1 1^T: sum v_i = 0, |v_i|^2 = (n-1)/n, v_i . v_j = -1/n (i != j), normalized -1/(n-1); derived symbolically in n, then checked exactly for n = 2..10 with rank n-1",
     sym_ok and all(concrete(k) for k in range(2, 11)))

# G2j: Q-R4-3 derived in project notation. Differences are orthogonal to 1, so P leaves them unchanged.
def simplex(k):
    Pk = sp.eye(k) - R(1, k) * sp.ones(k, k)
    ek = [sp.eye(k)[:, i] for i in range(k)]
    vk = [Pk * x for x in ek]
    diffs_kept = all(vk[i] - vk[j] == ek[i] - ek[j] for i in range(k) for j in range(k))
    equidistant = all(((vk[i] - vk[j]).T * (vk[i] - vk[j]))[0] == 2 for i in range(k) for j in range(k) if i != j)
    spanning = sp.Matrix.hstack(*[vk[i] - vk[0] for i in range(1, k)]).rank() == k - 1   # affinely independent, spanning 1-perp
    centroid_removed = all(vk[i] == ek[i] - R(1, k) * sp.ones(k, 1) for i in range(k))       # v_i = e_i minus the centroid of the e's
    return diffs_kept and equidistant and spanning and centroid_removed
card("G2j", "Q-R4-3 in project notation: v_i - v_j = P(e_i - e_j) = e_i - e_j because (e_i - e_j) . 1 = 0, so |v_i - v_j|^2 = 2 for all i != j: the n projected points are pairwise equidistant and affinely span the (n-1)-dimensional 1-perp, i.e. a regular simplex; v_i = e_i minus the centroid (1/n) 1 of the source points; checked exactly for n = 2..10",
     all(simplex(k) for k in range(2, 11)))
