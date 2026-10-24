"""O2: cards for "Fourier coefficients and orthonormal bases" (Master Map 7) and its hand-off into
"Orthogonality and Zero". Basis e_k(t) = e^{2 pi i k t} on [0, 1]; real signals f = sum_{k=1}^{3} 2 Re(c_k e_k).
Thresholds were fixed before the first run and must not be moved after seeing results.
(An earlier draft integrated symbolically and did not finish; it produced no verdicts. This version is exact algebra.)
Run: python3 verify/verify_O2.py"""
import sympy as sp
import numpy as np

ledger = []
def card(sid, claim, ok):
    ledger.append(bool(ok)); print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

t = sp.symbols('t', real=True)
K = 3
a = sp.symbols('a1:4', real=True); b = sp.symbols('b1:4', real=True)
p = sp.symbols('p1:4', real=True); q = sp.symbols('q1:4', real=True)
c = [a[i] + sp.I*b[i] for i in range(K)]
d = [p[i] + sp.I*q[i] for i in range(K)]

# Exact algebra for trigonometric polynomials: a function is a table {n: coefficient of e^{2 pi i n t}}.
# The only analytic fact used is O2-0 below: integral_0^1 e^{2 pi i n t} dt = 1 if n = 0, else 0.
# Then <u, v> = integral u conj(v) = sum_n u_n conj(v_n) is exact for these functions.
card("O2-0", "integral_0^1 e^{2 pi i n t} dt = delta_{n0} for n = -6..6 (sympy.integrate)",
     all(sp.simplify(sp.integrate(sp.exp(2*sp.pi*sp.I*n*t), (t, 0, 1)) - (1 if n == 0 else 0)) == 0 for n in range(-6, 7)))

def comp(ck, k):                       # 2 Re(c_k e_k) = c_k e_k + conj(c_k) e_{-k}
    return {k: ck, -k: sp.conjugate(ck)}
def add(*fs):
    out = {}
    for fn in fs:
        for n, v in fn.items():
            out[n] = out.get(n, 0) + v
    return out
def neg(fn):
    return {n: -v for n, v in fn.items()}
def inner(u, v):
    return sp.expand(sum(u[n]*sp.conjugate(v.get(n, 0)) for n in u))
basis_e = lambda k: {k: 1}
f = add(*[comp(c[k-1], k) for k in range(1, K+1)])
g = add(*[comp(d[k-1], k) for k in range(1, K+1)])
z = lambda expr: sp.simplify(sp.expand(expr)) == 0

# O2a  A coefficient is a projection, and only its own component contributes:
#      <f, e_k> = c_k, and <f_j, e_k> = 0 for j != k (k, j = 1..3), exactly.
proj_ok = all(z(inner(f, basis_e(k)) - c[k-1]) for k in range(1, K+1))
indep_ok = all(z(inner(comp(c[j-1], j), basis_e(k))) for j in range(1, K+1) for k in range(1, K+1) if j != k)
card("O2a", "<f, e_k> = f^(k) for a real 3-harmonic f, and <f_j, e_k> = 0 for j != k (symbolic coefficients)", proj_ok and indep_ok)

# O2b  Parseval and removal: ||f||^2 = 2 sum |c_k|^2, and removing component k lowers it by exactly 2|c_k|^2.
nrm = lambda u: inner(u, u)
pars_ok = z(nrm(f) - 2*sum(a[i]**2 + b[i]**2 for i in range(K)))
rem_ok = all(z(nrm(add(f, neg(comp(c[k-1], k)))) - nrm(f) + 2*(a[k-1]**2 + b[k-1]**2)) for k in range(1, K+1))
card("O2b", "||f||^2 = 2 sum |f^(k)|^2, and removing component k lowers it by exactly 2|f^(k)|^2", pars_ok and rem_ok)

# O2c  The hand-off: for real f, g, <f, g> = sum_k (sqrt2 c_k).(sqrt2 d_k) as real 2-vectors.
dots = sum(2*(a[i]*p[i] + b[i]*q[i]) for i in range(K))
card("O2c", "<f, g> on [0,1] equals the dot product of the coefficient arrows sqrt2 f^(k), sqrt2 g^(k) in R^6",
     z(inner(f, g) - dots))

# O2d  The domain is part of the inner product: b_{2k-1} = sqrt2 cos 2pi k t, b_{2k} = -sqrt2 sin 2pi k t (k = 1, 2):
#      Gram = I on [0,1], 2I on [0,2]; on [0,1.5] some cross terms are 0 and some are not. Exact.
bs = [sp.sqrt(2)*sp.cos(2*sp.pi*k*t) if s == 0 else -sp.sqrt(2)*sp.sin(2*sp.pi*k*t) for k in (1, 2) for s in (0, 1)]
gram = lambda L: sp.Matrix(4, 4, lambda i, j: sp.simplify(sp.integrate(bs[i]*bs[j], (t, 0, L))))
G1, G2, G15 = gram(1), gram(2), gram(sp.Rational(3, 2))
offs = [G15[i, j] for i in range(4) for j in range(i+1, 4)]
card("O2d", f"real basis Gram: I on [0,1], 2I on [0,2]; on [0,3/2] {sum(1 for o in offs if o == 0)} of 6 cross terms are 0",
     G1 == sp.eye(4) and G2 == 2*sp.eye(4) and any(o == 0 for o in offs) and any(o != 0 for o in offs))

# O2e  Sampling: (1/N) sum_j f(j/N) g(j/N) = sum_{N | k+l} f^(k) g^(l); it equals <f, g> once N > 2K.
#      Random coefficients (seed 7), N = 2..12; tolerance fixed in advance: 1e-9.
rng = np.random.default_rng(7)
C = rng.normal(size=K) + 1j*rng.normal(size=K)
D = rng.normal(size=K) + 1j*rng.normal(size=K)
idx = [k for k in range(-K, K+1) if k != 0]
F = {k: (C[k-1] if k > 0 else np.conj(C[-k-1])) for k in idx}
Gc = {k: (D[k-1] if k > 0 else np.conj(D[-k-1])) for k in idx}
fv = lambda s: sum(F[k]*np.exp(2j*np.pi*k*s) for k in idx).real
gv = lambda s: sum(Gc[k]*np.exp(2j*np.pi*k*s) for k in idx).real
true = sum(F[k]*np.conj(Gc[k]) for k in idx).real
worst_pred, worst_true = 0.0, 0.0
for N in range(2, 13):
    sj = np.arange(N)/N
    sampled = float(np.mean(fv(sj)*gv(sj)))
    pred = sum(F[k]*Gc[l] for k in idx for l in idx if (k + l) % N == 0).real
    worst_pred = max(worst_pred, abs(sampled - pred))
    if N > 2*K:
        worst_true = max(worst_true, abs(sampled - true))
card("O2e", f"sampled sums match the root-of-unity prediction (worst {worst_pred:.1e}) and equal <f,g> for N > 2K (worst {worst_true:.1e}); tol 1e-9",
     worst_pred < 1e-9 and worst_true < 1e-9)

# O2f  Cross-talk: the perturbed basis of the app (same mixing weights). At eps = 0 naive projections rebuild f
#      exactly; at eps = 0.3 the Gram matrix leaves I and the rebuild fails. Thresholds fixed in advance:
#      eps = 0: error < 1e-12; eps = 0.3: max off-diagonal > 1e-3 and rebuild error > 1e-3.
MIX = np.array([[0.0, 0.35, -0.2, 0.0, 0.45, -0.3], [0.25, 0.0, 0.4, -0.35, 0.0, 0.2], [-0.3, 0.2, 0.0, 0.5, -0.25, 0.0]])
order = [-3, -2, -1, 1, 2, 3]
def basis(eps):
    B = np.zeros((6, 6))
    for k in (1, 2, 3):
        v = np.zeros(6); v[order.index(k)] = 1; v += eps*MIX[k-1]
        v /= np.linalg.norm(v)
        B[order.index(k)] = v
        B[order.index(-k)] = [v[order.index(-j)] for j in order]
    return B
Fv = np.array([F[k] for k in order])
def rebuild_error(eps):
    B = basis(eps)
    naive = B @ Fv                      # <f, e~_k> with real coefficient rows
    return np.linalg.norm(Fv - B.T @ naive), np.max(np.abs(B @ B.T - np.eye(6)))
e0, g0 = rebuild_error(0.0)
e3, g3 = rebuild_error(0.3)
card("O2f", f"cross-talk: eps=0 rebuild error {e0:.1e}; eps=0.3 Gram off-diagonal {g3:.3f}, rebuild error {e3:.3f}",
     e0 < 1e-12 and g0 < 1e-12 and g3 > 1e-3 and e3 > 1e-3)

print(f"\n{sum(ledger)}/{len(ledger)} checks passed")
