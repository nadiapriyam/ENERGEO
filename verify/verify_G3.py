"""G3: inverse structure of the R4 orthogonal-source construction (Q-R4-1, Q-R4-2, Q-R4-4, Q-R4-5, Q-R4-6).
Derived in project notation first (research/constructions/r4_tetrahedral_zero.md). Secondary existing-theory match,
named only after the derivation: frame theory (tight frames as projections of orthonormal bases).
Exact rational/symbolic arithmetic. Run: python3 verify/verify_G3.py"""
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

R = sp.Rational
# G3a: Nadia's reconstruction e_i = v_i + (1/2) n, on Stage 2's own realization (R^3 embedded in R^4, n = e_4)
signs = [(1, 1, 1), (1, -1, -1), (-1, 1, -1), (-1, -1, 1)]
v3 = [sp.Matrix(s) / 2 for s in signs]                       # Phi(v_i) = (sqrt3/2) TETRA_i: |v|^2 = 3/4, v_i.v_j = -1/4
emb = lambda x: sp.Matrix([x[0], x[1], x[2], 0])
nrm = sp.Matrix([0, 0, 0, 1])
E = [emb(x) + R(1, 2) * nrm for x in v3]
gram_v = all((v3[i].T * v3[j])[0] == (R(3, 4) if i == j else R(-1, 4)) for i in range(4) for j in range(4))
card("G3a", "Nadia's reconstruction: with |v_i|^2 = 3/4, v_i.v_j = -1/4 (Stage 2's realization, embedded in R^4) and a unit n perpendicular to their span, e_i = v_i + (1/2) n satisfy |e_i|^2 = 3/4 + 1/4 = 1 and e_i.e_j = -1/4 + 1/4 = 0: an orthonormal basis of R^4",
     gram_v and all((E[i].T * E[j])[0] == (1 if i == j else 0) for i in range(4) for j in range(4)))

# G3b: uniqueness. If f_i = v_i + w_i is orthonormal with every w_i perpendicular to V = span{v_j}, then
# Gram(w) = I - Gram(v) = J/4, hence |w_i - w_j|^2 = 0: all w_i equal one vector w with |w|^2 = 1/4.
n4 = 4
Gv = sp.eye(n4) - R(1, n4) * sp.ones(n4, n4)
Gw = sp.eye(n4) - Gv
diff0 = all(Gw[i, i] + Gw[j, j] - 2 * Gw[i, j] == 0 for i in range(n4) for j in range(n4))
f = [emb(x) - R(1, 2) * nrm for x in v3]                    # the other sign of the normal also works
card("G3b", "uniqueness: any orthonormal f_i = v_i + w_i with w_i perpendicular to span{v_j} has Gram(w) = I - (I - J/4) = J/4, so |w_i - w_j|^2 = 0 and all w_i equal one w with |w|^2 = 1/4: in R^4, w = +(1/2)n or -(1/2)n (both work); the removed direction is recovered as sum f_i = 4w, up to that sign",
     Gw == R(1, n4) * sp.ones(n4, n4) and diff0 and Gw[0, 0] == R(1, 4)
     and all((f[i].T * f[j])[0] == (1 if i == j else 0) for i in range(4) for j in range(4))
     and sum(E, sp.zeros(4, 1)) == 2 * nrm)

# G3n: the same for every n
nn = sp.symbols('n', integer=True, positive=True)
sym = sp.simplify((1 - (1 - 1 / nn)) - 1 / nn) == 0 and sp.simplify((0 - (-1 / nn)) - 1 / nn) == 0 and sp.simplify(2 / nn - 2 / nn) == 0
def recon(k):
    Pk = sp.eye(k) - R(1, k) * sp.ones(k, k)
    vk = [Pk[:, i] for i in range(k)]
    u1 = sp.ones(k, 1) / sp.sqrt(k)                          # unit normal to 1-perp inside R^k
    fk = [vk[i] + u1 / sp.sqrt(k) for i in range(k)]         # w = n / sqrt(k), |w|^2 = 1/k
    return all(sp.simplify((fk[i].T * fk[j])[0] - (1 if i == j else 0)) == 0 for i in range(k) for j in range(k)) \
        and all(sp.simplify(fk[i] - sp.eye(k)[:, i]) == sp.zeros(k, 1) for i in range(k))
card("G3n", "for every n: Gram(w) = I - (I - J/n) = J/n forces all w_i equal with |w|^2 = 1/n (derived symbolically in n); reconstructing with w = n_hat/sqrt(n) returns exactly e_1..e_n, checked for n = 2..10",
     sym and all(recon(k) for k in range(2, 11)))

# G3c: Q-R4-4. Any n vectors with zero sum, equal norms r^2 and equal pairwise products c have c = -r^2/(n-1),
# so their Gram is r^2 n/(n-1) (I - J/n): a scalar multiple of the Gram of P_n e_i.
r2, c = sp.symbols('r2 c', real=True)
csol = sp.solve(sp.Eq(r2 + (nn - 1) * c, 0), c)[0]
def gram_forced(k):
    rr = sp.symbols('rr', positive=True)
    cc = -rr / (k - 1)
    G = sp.Matrix(k, k, lambda i, j: rr if i == j else cc)
    return sp.simplify(G - rr * R(k, k - 1) * (sp.eye(k) - R(1, k) * sp.ones(k, k))) == sp.zeros(k, k) and sp.simplify(G * sp.ones(k, 1)) == sp.zeros(k, 1)
card("G3c", "Q-R4-4: zero sum gives 0 = v_i . sum_j v_j = r^2 + (n-1)c, so c = -r^2/(n-1) and Gram = r^2 n/(n-1) (I - J/n), a multiple of the Gram of P_n e_i; equal Gram matrices give an isometry of spans (derivation in the record), so every regular-simplex zero-sum configuration is, up to scale and orthogonal equivalence, the projected orthonormal basis (checked for n = 2..8)",
     sp.simplify(csol + r2 / (nn - 1)) == 0 and all(gram_forced(k) for k in range(2, 9)))

# G3d: Q-R4-6. n vectors arise (up to common scale and orthogonal equivalence) as the orthogonal projection of an
# orthonormal basis of R^n iff a positive multiple of their Gram matrix is idempotent (all nonzero eigenvalues equal).
p, q, s = sp.symbols('p q s', real=True)
K = sp.Matrix([[0, -p, -q], [p, 0, -s], [q, s, 0]])
F = (sp.eye(3) - K) * (sp.eye(3) + K).inv()                  # Cayley: a general rotation (orthogonal matrix)
Pd = sp.diag(1, 1, 0)
GF = sp.simplify(F.T * Pd * F)
necessity = sp.simplify(F.T * F - sp.eye(3)) == sp.zeros(3, 3) and sp.simplify(GF * GF - GF) == sp.zeros(3, 3)
Pi = sp.Matrix([[1, -1, 0, 0], [-1, 1, 0, 0], [0, 0, 1, -1], [0, 0, -1, 1]]) / 2   # symmetric idempotent, 1 in its kernel, rank 2
cols = [Pi[:, i] for i in range(4)]
two_pairs = Pi * Pi == Pi and Pi.T == Pi and Pi * sp.ones(4, 1) == sp.zeros(4, 1) and sum(cols, sp.zeros(4, 1)) == sp.zeros(4, 1) \
    and sp.Matrix.hstack(*cols).T * sp.Matrix.hstack(*cols) == Pi
Wb = [sp.Matrix([1, 0]), sp.Matrix([0, 1]), sp.Matrix([-1, -1])]
Gb = sp.Matrix.hstack(*Wb).T * sp.Matrix.hstack(*Wb)
boundary = sum(Wb, sp.zeros(2, 1)) == sp.zeros(2, 1) and Gb.eigenvals() == {0: 1, 1: 1, 3: 1}
card("G3d", "Q-R4-6: necessity, Gram(P f_i) = F^T P F is idempotent for every orthonormal F and orthogonal projector P (checked with a general Cayley rotation); sufficiency, if Pi = Gram/lambda^2 is symmetric idempotent then v_i ~ lambda Pi e_i (two opposed pairs in orthogonal planes: zero sum, rank 2, a projection, not a simplex); boundary, (1,0), (0,1), (-1,-1) has zero sum but Gram eigenvalues {0, 1, 3}, two distinct nonzero values, so no orthonormal-basis projection source of this type",
     necessity and two_pairs and boundary)
