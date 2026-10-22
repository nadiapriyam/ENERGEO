"""Cards for the Gate 3 correction to C1 (preserve a bilinear form, not always a quadratic)
and the matching limit on C2 (conservation of z^T M z is only informative for symmetric M).
All checks are exact (SymPy); no numerical thresholds.
Run: python3 verify/verify_C1_C2.py"""
import sympy as sp

ledger = []
def card(sid, claim, ok):
    ledger.append(bool(ok)); print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

zero = lambda M: M.applyfunc(sp.simplify) == sp.zeros(*M.shape)

# C1a  For antisymmetric J, x^T J x = 0 for every real x (n = 2 and n = 4): the quadratic carries nothing
for n in (2, 4):
    a = sp.symbols(f'a0:{n*n}', real=True)
    A = sp.Matrix(n, n, a)
    J = A - A.T                                                  # general antisymmetric
    x = sp.Matrix(sp.symbols(f'x0:{n}', real=True))
    card("C1a", f"antisymmetric J ({n}x{n}): x^T J x = 0 for all real x", sp.expand((x.T*J*x)[0]) == 0)

# C1b  A^T M A = M  <=>  B(Au, Av) = B(u, v) for all u, v, with B(u, v) = u^T M v:
#      entry (A^T M A)_ij is exactly B(A e_i, A e_j), for any square M (symmetric or not)
A = sp.Matrix(2, 2, sp.symbols('p0:4', real=True))
M = sp.Matrix(2, 2, sp.symbols('m0:4', real=True))
B = lambda u, v: (u.T*M*v)[0]
e = [sp.Matrix([1, 0]), sp.Matrix([0, 1])]
card("C1b", "(A^T M A)_ij = B(A e_i, A e_j) for general 2x2 A, M  (so A^T M A = M is form preservation)",
     all(sp.expand((A.T*M*A)[i, j] - B(A*e[i], A*e[j])) == 0 for i in range(2) for j in range(2)))

# C1c  The quadratic test cannot detect symplectic structure: D = diag(2, 1) preserves x^T J x (trivially 0)
#      but does not preserve omega(u, v) = u^T J v, since D^T J D = 2J != J. A real symplectic map does.
Js = sp.Matrix([[0, 1], [-1, 0]])
D = sp.diag(2, 1)
x = sp.Matrix(sp.symbols('y0:2', real=True))
s = sp.symbols('s', real=True)
S = (s*sp.Matrix([[0, 1], [-2, 0]])).exp()                      # Hamiltonian flow of S9 (H = x^2 + p^2/2)
card("C1c", "diag(2,1) keeps x^T J x = 0 yet D^T J D = 2J != J; the Hamiltonian flow exp(sK) of S9 keeps A^T J A = J",
     sp.expand(((D*x).T*Js*(D*x))[0]) == 0 and not zero(D.T*Js*D - Js)
     and zero((S.T*Js*S - Js).applyfunc(lambda z: z.rewrite(sp.exp))))

# C2a  For symmetric M, z^T M z is conserved along z' = K z  <=>  K^T M + M K = 0
#      (K^T M + M K is symmetric, and a symmetric form vanishing on every z is the zero matrix).
#      For antisymmetric M the equivalence fails: z^T J z = 0 is "conserved" by K = I, yet K^T J + J K = 2J.
k = sp.Matrix(2, 2, sp.symbols('k0:4', real=True))
ms = sp.symbols('n0:3', real=True)
Msym = sp.Matrix([[ms[0], ms[1]], [ms[1], ms[2]]])
Q = k.T*Msym + Msym*k
symmetric_ok = zero(Q - Q.T)
I2 = sp.eye(2)
counter = sp.expand(((I2*x).T*Js*x)[0] + (x.T*Js*(I2*x))[0]) == 0 and not zero(I2.T*Js + Js*I2)
card("C2a", "symmetric M: K^T M + M K is symmetric, so conservation of z^T M z <=> K^T M + M K = 0; "
     "antisymmetric J: K = I conserves z^T J z trivially but K^T J + J K = 2J",
     symmetric_ok and counter)

print(f"\n{sum(ledger)}/{len(ledger)} checks passed")
