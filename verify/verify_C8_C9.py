"""Cards for the proposed connections C8 and C9 (Claude's proposals; see connections/proposed.md).
Each underlying fact is checked here. The connections themselves remain hypotheses until approved.
Thresholds below were fixed before the first run and must not be moved after seeing results.
Run: python3 verify_C8_C9.py"""
import sympy as sp
import numpy as np

ledger = []
def card(sid, claim, ok):
    ledger.append(bool(ok)); print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

t, w, s, th = sp.symbols('t omega s theta', positive=True)

# C8  Unbounded parameter -> bounded image, two ways: wrapping (no limit) vs compressing (limit at the edge)

# C8a wrapping: |e^{i w t}| = 1 for every t, yet t -> oo has no limit (sympy returns bounds, not a value)
mod_ok = sp.simplify(sp.Abs(sp.exp(sp.I*w*t))) == 1
lim = sp.limit(sp.cos(w*t), t, sp.oo)
card("C8a", "wrapping: |e^{iwt}| = 1 for all t, and lim_{t->oo} cos(wt) does not exist (AccumBounds(-1,1))",
     mod_ok and isinstance(lim, sp.calculus.accumulationbounds.AccumBounds))

# C8b compressing: exponential model y(theta) = (e^{-theta t1}, e^{-theta t2}, e^{-theta t3}) is bounded
#     in (0,1)^3 and has limits at both ends of theta in (0, oo): the curve's endpoints are boundary points
times = [sp.Rational(1, 2), 1, 2]
y = [sp.exp(-th*ti) for ti in times]
ends = [sp.limit(yi, th, 0, '+') for yi in y], [sp.limit(yi, th, sp.oo) for yi in y]
card("C8b", "compressing: theta in (0,oo) -> e^{-theta t_i} in (0,1); theta->0+ gives (1,1,1), theta->oo gives (0,0,0)",
     ends == ([1, 1, 1], [0, 0, 0]))

# C8c Fourier partial sums of the square wave: mean-square error -> 0 while the overshoot does not (Gibbs).
#     Fixed in advance: L2 error ratio N=1001 vs N=11 below 0.05; max S_N above 1.17 for every N tested.
xg = np.linspace(1e-6, np.pi - 1e-6, 400001)
def S_(N, x):
    k = np.arange(1, N + 1, 2)
    out = np.zeros_like(x)
    for kk in k: out += (4/np.pi) * np.sin(kk*x) / kk
    return out
l2 = {}
peak = {}
for N in (11, 101, 1001):
    sN = S_(N, xg)
    l2[N] = np.sqrt(np.trapezoid((sN - 1.0)**2, xg) / np.pi)
    peak[N] = sN.max()
card("C8c", f"square wave: ||S_N - f||_2 shrinks (ratio {l2[1001]/l2[11]:.3f} < 0.05) but max S_N stays > 1.17 "
     f"({peak[11]:.4f}, {peak[101]:.4f}, {peak[1001]:.4f})",
     l2[1001]/l2[11] < 0.05 and all(p > 1.17 for p in peak.values()))

# C8c2 [added after C8c FAILED; C8c stays on the ledger]. C8c's 0.05 assumed the error falls like 1/N;
#     the RMS error falls like 1/sqrt(N). This card replaces a guessed number with the theory's prediction:
#     by Parseval, mean-square error = tail sum (8/pi^2) sum_{k odd > N} 1/k^2, and that tail -> 0
#     (sum_{j>=n} 1/(2j+1)^2 = psi'(n + 1/2)/4 -> 0).
#     Tolerance 1% relative is the quadrature accuracy of the 400k-point grid, fixed before running C8c2.
tail_to_zero = sp.limit(8/(sp.pi**2) * (sp.polygamma(1, sp.Symbol('n', positive=True) + sp.Rational(1, 2)) / 4),
                        sp.Symbol('n', positive=True), sp.oo) == 0
pred = {N: np.sqrt(sum(8/(np.pi**2 * k**2) for k in range(N + 2, 2_000_001, 2)) + 8/(np.pi**2)/(2*2_000_001)) for N in l2}
rel = {N: abs(l2[N] - pred[N]) / pred[N] for N in l2}
card("C8c2", f"square wave: RMS error equals the Parseval tail (rel. err {max(rel.values()):.4f} < 0.01) and the tail -> 0; "
     f"overshoot persists (max S_N > 1.17)",
     max(rel.values()) < 0.01 and tail_to_zero and all(p > 1.17 for p in peak.values()))

# C8d where it breaks: x = cos t + cos(sqrt2 t) is bounded, has no limit, and never returns exactly
#     (cos tau = cos(sqrt2 tau) = 1 needs sqrt2 = m/n), yet returns arbitrarily closely at tau = 2 pi q
#     for continued-fraction denominators q. Fixed in advance: D(2 pi * 29) < 0.01, all D > 0.
irr = sp.sqrt(2).is_rational is False
D = lambda q: (1 - np.cos(2*np.pi*np.sqrt(2)*q)) / 2
qs = [1, 2, 5, 12, 29]
card("C8d", f"quasi-periodic: no exact return (sqrt2 irrational) but near-returns D(2pi q) = {[round(float(D(q)), 4) for q in qs]}",
     irr and D(29) < 0.01 and all(D(q) > 0 for q in qs))

# C9  c -> oo degenerates the invariant form and turns the boost from hyperbolic into shear (S4's middle case)
c, v = sp.symbols('c v', positive=True)
g = 1/sp.sqrt(1 - v**2/c**2)
Lam = sp.Matrix([[g, -g*v/c**2], [-g*v, g]])          # acts on (t, x)
Mc = sp.diag(1, -1/c**2)                                # (1/c^2)(c^2 t^2 - x^2) = t^2 - x^2/c^2
card("C9a", "Lambda_c^T M_c Lambda_c = M_c with M_c = diag(1, -1/c^2)  [S5c in matrix form]",
     sp.simplify(Lam.T*Mc*Lam - Mc) == sp.zeros(2))
Minf = Mc.applyfunc(lambda z: sp.limit(z, c, sp.oo))
card("C9b", "c -> oo: M_c -> diag(1, 0), det M_c = -1/c^2 -> 0  (the form degenerates: only time is measured)",
     Minf == sp.diag(1, 0) and sp.limit(Mc.det(), c, sp.oo) == 0)
Kc = Lam.diff(v).subs(v, 0)
Kinf = Kc.applyfunc(lambda z: sp.limit(z, c, sp.oo))
card("C9c", "boost generator K_c = [[0,-1/c^2],[-1,0]]: det K_c = -1/c^2 < 0 (hyperbolic); K_oo = [[0,0],[-1,0]], K_oo^2 = 0 (shear)",
     Kc == sp.Matrix([[0, -1/c**2], [-1, 0]]) and sp.simplify(Kc.det() + 1/c**2) == 0
     and Kinf == sp.Matrix([[0, 0], [-1, 0]]) and Kinf*Kinf == sp.zeros(2))
G = (v*Kinf).exp()
card("C9d", "Galilean boost exp(v K_oo) = [[1,0],[-v,1]] preserves the degenerate form diag(1,0)",
     G == sp.Matrix([[1, 0], [-v, 1]]) and sp.simplify(G.T*Minf*G - Minf) == sp.zeros(2))

print(f"\n{sum(ledger)}/{len(ledger)} checks passed")
