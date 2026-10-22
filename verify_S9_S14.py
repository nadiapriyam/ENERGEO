"""S9-S14: cross-block connections. Each is a known result (Level 1); the *connection pattern* is the hypothesis.
Run: python3 verify_S9_S14.py"""
import sympy as sp
import numpy as np

ledger = []
def card(sid, claim, ok):
    ledger.append(bool(ok)); print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

s, t = sp.symbols('s t', real=True)
Z = lambda n: sp.zeros(n)
simp = lambda Mx: Mx.applyfunc(lambda z: sp.simplify(sp.expand(z.rewrite(sp.exp))))

# S9  One equation, four geometries: A^T M A = M holds for the flows of Blocks 1, 4, 9, 15.
#     Infinitesimal form (Lie algebra): K^T M + M K = 0  <=>  z^T M z conserved along z' = K z.
J2 = sp.Matrix([[0, 1], [-1, 0]])                      # symplectic form (Block 15)
cases = {
    "Euclidean  M=I   (rotation)":   (sp.eye(2),        sp.Matrix([[0, -1], [1, 0]])),
    "Minkowski  M=eta (boost)":      (sp.diag(1, -1),   sp.Matrix([[0, 1], [1, 0]])),
    "Symplectic M=J   (Hamiltonian)": (J2,              sp.Matrix([[0, 1], [-2, 0]])),   # H = x^2 + p^2/2
}
for name, (M, K) in cases.items():
    lie = simp(K.T*M + M*K) == Z(2)
    A = (s*K).exp()
    group = simp(A.T*M*A - M) == Z(2)
    card("S9", f"{name}: K^T M + M K = 0 and exp(sK)^T M exp(sK) = M", lie and group)
z1, z2 = sp.symbols('z1 z2', real=True); zz = sp.Matrix([z1, z2])
M, K = sp.diag(1, -1), sp.Matrix([[0, 1], [1, 0]])
dQ = sp.simplify((2*(zz.T*M*(K*zz)))[0])
card("S9b", "d/dt (z^T M z) = z^T (K^T M + M K) z = 0 along z' = K z  (conservation = invariant form)", dQ == 0)

# S10 Hamiltonian flow conserves H (Block 15); sign of the conserved quantity picks bounded vs unbounded
#     Kepler (space): E<0 ellipse, E=0 parabola, E>0 hyperbola  <=>  e<1, e=1, e>1
E, L, mu, m = sp.symbols('E L mu m', real=True)
e = sp.sqrt(1 + 2*E*L**2/(m*mu**2))
card("S10", "Kepler eccentricity: e^2 - 1 = 2 E L^2/(m mu^2), so sign(E) = sign(e - 1)  (same trichotomy as S4)",
     sp.simplify(e**2 - 1 - 2*E*L**2/(m*mu**2)) == 0)

# S11 The Fourier transform is itself a quarter-turn: Hermite functions are its eigenvectors, eigenvalues (-i)^n, F^4 = I
x = np.linspace(-12, 12, 4097); dx = x[1]-x[0]; k = x.copy()
F = np.exp(-1j*np.outer(k, x)) * dx / np.sqrt(2*np.pi)
ok = True
for n in range(5):
    h = np.polynomial.hermite.hermval(x, [0]*n + [1]) * np.exp(-x**2/2)
    ok &= np.max(np.abs(F @ h - (-1j)**n * h)) / np.max(np.abs(h)) < 1e-6
card("S11", "F h_n = (-i)^n h_n for n = 0..4 (numeric, rel. err < 1e-6): F is rotation by 90 deg; F^4 = I", ok)
Rq = (sp.pi/2*sp.Matrix([[0, 1], [-1, 0]])).exp()
card("S11b", "harmonic-oscillator flow for a quarter period maps (x,p) -> (p,-x)  [phase-space picture of F]",
     simp(Rq - sp.Matrix([[0, 1], [-1, 0]])) == Z(2))

# S12 'Quadratic equals 0', two meanings: orthogonality <u,v>_M = 0 and null vectors Q(v) = 0 (light)
c, px, Em, mm = sp.symbols('c p E m', positive=True)
P = sp.Matrix([Em/c, px]); eta = sp.diag(1, -1)
card("S12", "4-momentum: P^T eta P = m^2 c^2 <=> E^2 = p^2 c^2 + m^2 c^4 (Block 10 is Block 9's invariant form)",
     sp.simplify((P.T*eta*P)[0].subs(Em, sp.sqrt(px**2*c**2 + mm**2*c**4)) - mm**2*c**2) == 0)
light = sp.Matrix([1, 1])
card("S12b", "Minkowski: a light ray is orthogonal to itself, <l,l>_eta = 0 with l != 0", (light.T*eta*light)[0] == 0)

# S13 Projection by averaging (Block 7) is an orthogonal projection: P^2 = P, P^T = P, residual _|_ projected part
N = 8; Ush = np.roll(np.eye(N), 1, axis=0)
Hgrp = [np.linalg.matrix_power(Ush, j) for j in (0, 4)]          # subgroup {0, 4} of C_8
Pmat = sum(Hgrp)/len(Hgrp); xv = np.random.default_rng(0).normal(size=N)
card("S13", "P_H = avg_h U_h: P^2=P, P^T=P, <P x, x - P x> = 0",
     np.allclose(Pmat@Pmat, Pmat) and np.allclose(Pmat.T, Pmat) and abs((Pmat@xv)@(xv - Pmat@xv)) < 1e-12)

# S14 Sloppiness = spectral decay (Blocks 11-12): Fisher eigenvalues of y = sum exp(-theta_i t) span many decades, ~log-even
tt = np.linspace(0, 5, 60); th = np.array([0.3, 0.7, 1.5, 3.0, 6.0])
Jac = np.stack([-tt*np.exp(-a*tt) for a in th], axis=1) * th      # d y / d log(theta)
lam = np.sort(np.linalg.eigvalsh(Jac.T@Jac))[::-1]
gaps = np.diff(np.log10(lam))
card("S14a", f"[my threshold, kept on record] 5-param spectrum spans > 4 decades (got {np.log10(lam[0]/lam[-1]):.1f})",
     np.log10(lam[0]/lam[-1]) > 4)
card("S14b", f"[paper's claim] eigenvalues roughly evenly spaced in log: gaps {np.round(gaps,2).tolist()}, spread {np.ptp(gaps):.2f} < 0.35 decade",
     np.ptp(gaps) < 0.35 and np.all(gaps < -0.5))

print(f"\n{sum(ledger)}/{len(ledger)} checks passed")
