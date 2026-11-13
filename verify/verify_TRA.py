"""TRA: consistency checks for the Transformation Architecture (Pass 3 architectural correction, 2026-11-12).

Not a new experiment. These cards verify only the equations the corrected classification depends on:
R1 representation covariance, R2 structural invariance (F*T = T) and its infinitesimal form (L_X T = 0),
R2 → invariant zero relations (and the failure of the converse), R3 equivariance / intertwining, and the
placement of projections. The CF11-B Fisher test (CFT cards, prereg e6f3db8) is not rerun or reinterpreted.
Run: python3 verify/verify_TRA.py"""
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


Z = lambda n, m=None: sp.zeros(n, m or n)
t = sp.Symbol('t', real=True)

# ── TRA1: R2 → infinitesimal invariance ────────────────────────────────────────────────────────
n = 3
a = [[sp.Function(f'a{i}{j}')(t) for j in range(n)] for i in range(n)]
A = sp.Matrix(n, n, lambda i, j: a[i][j])
K = sp.Matrix(n, n, lambda i, j: sp.Symbol(f'k{i}{j}', real=True))
M = sp.Matrix(n, n, lambda i, j: sp.Symbol(f'm{i}{j}', real=True))
init = {}
for i in range(n):
    for j in range(n):
        init[sp.Derivative(a[i][j], t).subs(t, 0)] = K[i, j]
d = (A.T * M * A).diff(t).subs(t, 0)
d = d.subs({sp.Derivative(a[i][j], t).subs(t, 0): K[i, j] for i in range(n) for j in range(n)})
d = d.subs({a[i][j].subs(t, 0): (1 if i == j else 0) for i in range(n) for j in range(n)})
Kc = sp.Matrix(2, 2, lambda i, j: sp.Symbol(f'x{i}{j}') + sp.I * sp.Symbol(f'y{i}{j}'))
Hc = sp.Matrix(2, 2, lambda i, j: sp.Symbol(f'h{i}{j}'))
Ac = sp.eye(2) + t * Kc                                     # first order suffices for the derivative at 0
dc = sp.expand((Ac.H * Hc * Ac).diff(t).subs(t, 0))
card("TRA1a", "[R2 → infinitesimal | CF4, TA2I] for any differentiable family A(t) with A(0) = I and A'(0) = K (e.g. A(t) = e^{tK}), d/dt[A(t)ᵀMA(t)] at t = 0 is KᵀM + MK (generic 3×3 K, M); complex case K†H + HK. So A(t)ᵀMA(t) = M for all t ⟹ KᵀM + MK = 0: the matrix form of L_X T = 0",
     sp.simplify(d - (K.T * M + M * K)) == Z(n) and sp.expand(dc - sp.expand(Kc.H * Hc + Hc * Kc)) == Z(2))

mu, sg = sp.symbols('mu sigma', real=True)
sgp = sp.Symbol('sigma', positive=True)
X2 = [mu, sgp]
g = sp.diag(1 / sgp**2, 2 / sgp**2)                          # normal-family Fisher metric (CFT4a)
def lie(Xf, gm, coords):
    """(L_X g)_ij = X^k ∂_k g_ij + g_kj ∂_i X^k + g_ik ∂_j X^k."""
    m = len(coords)
    return sp.Matrix(m, m, lambda i, j: sp.simplify(sum(Xf[k] * sp.diff(gm[i, j], coords[k]) + gm[k, j] * sp.diff(Xf[k], coords[i]) + gm[i, k] * sp.diff(Xf[k], coords[j]) for k in range(m))))
def flow_deriv(Ft, gm, coords):
    """d/dt (F_t* g) at t = 0, from the flow itself."""
    dF = sp.Matrix(Ft).jacobian(sp.Matrix(coords))
    pb = dF.T * gm.subs(dict(zip(coords, Ft)), simultaneous=True) * dF
    return sp.simplify(pb.diff(t).subs(t, 0))
cases = {'translation ∂_μ': ([1, 0], [mu + t, sgp]), 'scaling μ∂_μ + σ∂_σ': ([mu, sgp], [sp.exp(t) * mu, sp.exp(t) * sgp]), 'shear σ∂_μ': ([sgp, 0], [mu + t * sgp, sgp])}
res = {k: (lie(X, g, X2), flow_deriv(F, g, X2)) for k, (X, F) in cases.items()}
card("TRA1b", "[R2 → infinitesimal | TA2I] on the normal-family Fisher metric, d/dt(F_t*g) at t = 0 computed from each flow equals the coordinate Lie derivative (L_X g)_ij = X^k∂_k g_ij + g_kj∂_iX^k + g_ik∂_jX^k; it vanishes for the generators of the system-supplied symmetries (∂_μ, μ∂_μ + σ∂_σ: F_t*g = g ⟹ L_X g = 0) and not for the shear field σ∂_μ (not a symmetry)",
     all(sp.simplify(L - Fd) == Z(2) for L, Fd in res.values()) and res['translation ∂_μ'][0] == Z(2) and res['scaling μ∂_μ + σ∂_σ'][0] == Z(2) and res['shear σ∂_μ'][0] != Z(2))

xs = sp.symbols('x0:3', real=True)
Xlin = list(K * sp.Matrix(xs))
card("TRA1c", "[R2 → infinitesimal | CF4] for a constant form B_M and the linear field X(x) = Kx, the coordinate Lie derivative is (L_X B)_ij = (KᵀM + MK)_ij exactly (generic 3×3): the generator rule KᵀM + MK = 0 is L_X B = 0 in constant coordinates",
     sp.simplify(lie(Xlin, M, list(xs)) - (K.T * M + M * K)) == Z(3))

# ── TRA2: R2 → invariant zero relations; the converse fails ────────────────────────────────────
q, p = sp.symbols('q p', real=True)
J2 = sp.Matrix([[0, 1], [-1, 0]])
Fs = sp.Matrix([q, p + q**2]); dFs = Fs.jacobian(sp.Matrix([q, p]))
u = sp.Matrix(sp.symbols('u0:2', real=True)); v = sp.Matrix(sp.symbols('v0:2', real=True))
sym_ok = sp.expand(((dFs * u).T * J2 * (dFs * v))[0] - (u.T * J2 * v)[0]) == 0
s = sp.Symbol('s', real=True)
Bo = sp.Matrix([[sp.cosh(s), sp.sinh(s)], [sp.sinh(s), sp.cosh(s)]]); eta = sp.diag(1, -1); ln = sp.Matrix([1, 1])
lor_ok = (ln.T * eta * ln)[0] == 0 and sp.simplify(((Bo * ln).T * eta * (Bo * ln))[0]) == 0
th1, th2, tt = sp.symbols('theta1 theta2 tau', positive=True)
Y = sp.Matrix([sp.exp(-th1 * k) + sp.exp(-th2 * k) for k in (1, 2, 3)])
Jy = Y.jacobian(sp.Matrix([th1, th2]))
dS = sp.Matrix([[0, 1], [1, 0]])
nul_ok = sp.simplify(Jy.subs({th1: tt, th2: tt}) * (dS * sp.Matrix([1, -1]))) == Z(3, 1)
card("TRA2a", "[R2 → zero relations | BR44] if F*T = T then T(u, v) = 0 ⟹ T(dF u, dF v) = 0: the nonlinear symplectomorphism (q, p) ↦ (q, p + q²) gives ω(dF u, dF v) = ω(u, v) for all u, v (symplectic orthogonality kept); a Lorentz boost keeps the light-like (1, 1) null; the F-C exchange (an isometry) sends the diagonal null direction to a null direction",
     sym_ok and lor_ok and nul_ok)
x3 = sp.Matrix(sp.symbols('y0:3', real=True)); w3 = sp.Matrix(sp.symbols('w0:3', real=True))
B2 = ((2 * x3).T * M * (2 * w3))[0]
card("TRA2b", "[R2 → zero relations | the converse fails] A = 2I preserves every zero relation of every B_M (B_M(2x, 2y) = 4B_M(x, y)) but AᵀMA = 4M ≠ M: preserving zeros does not imply structural invariance (Z4b). Zeros are consequences of R2 only in the direction R2 ⟹ zero kept",
     sp.expand(B2 - 4 * (x3.T * M * w3)[0]) == 0 and (2 * sp.eye(3)).T * M * (2 * sp.eye(3)) == 4 * M)

# ── TRA3: R3 equivariance / intertwining ───────────────────────────────────────────────────────
N = 6
w = sp.exp(-2 * sp.pi * sp.I / N)
F = sp.Matrix(N, N, lambda j, k: w**(j * k))
def shift(a_):
    return sp.Matrix(N, N, lambda r, c: 1 if r == (c + a_) % N else 0)      # (T_a x)_r = x_{r−a}
def modul(a_):
    return sp.diag(*[w**(k * a_) for k in range(N)])                         # (M_a X)_k = e^{−2πika/N} X_k
inter = all(sp.simplify(sp.expand_complex(F * shift(a_) - modul(a_) * F)) == Z(N) for a_ in range(N))
card("TRA3a", "[R3 | Fourier intertwining, BR46] the DFT intertwines two different representations of the cyclic translation group: F T_a = M_a F for every a (N = 6, exact), with (T_a x)_n = x_{n−a} and M_a = diag(e^{−2πika/N}); T_a (a permutation) and M_a (a diagonal phase) are different operators for a ≠ 0. Continuous form: (T_a x)^ = e^{−iωa} x̂ (FB1a)",
     inter and all(shift(a_) != modul(a_) for a_ in range(1, N)) and F.rank() == N)
mw = sp.Matrix([1, 2, 3]); D = sp.diag(*mw); one = sp.ones(3, 1)
C = sp.eye(3) - one * mw.T / sum(mw)
wv = sp.Matrix([1, 1, -1]); Afix = sp.eye(3) - 2 * wv * wv.T * D / (wv.T * D * wv)[0]
card("TRA3b", "[R3 is not R2] intertwining and commuting are not invariance of a structure: the DFT is not a symmetry of the shift (F T₁ F⁻¹ = M₁ ≠ T₁); weighted centering C_m commutes with a D-isometry fixing 1 (A C_m = C_m A) yet is not an isometry (C_mᵀ D C_m ≠ D)",
     sp.simplify(sp.expand_complex(F * shift(1) * F.inv() - shift(1))) != Z(N) and Afix * C == C * Afix and C.T * D * C != D)

# ── TRA4: R1 representation covariance, and what is not R1 ─────────────────────────────────────
P = sp.Matrix([[1, 1], [0, 1]])
xp = sp.Matrix(sp.symbols('xp0:2', real=True)); yp = sp.Matrix(sp.symbols('yp0:2', real=True))
Mprime = P.T * sp.eye(2) * P
passive = sp.expand((xp.T * Mprime * yp)[0] - ((P * xp).T * (P * yp))[0]) == 0
active_fails = sp.expand(((P * xp).T * (P * yp))[0] - (xp.T * yp)[0]) != 0
card("TRA4a", "[R1 vs R2 | BR41] the same matrix P = [[1, 1], [0, 1]] answers two different questions. Passive (R1): new coordinates x = Px′ give new components M′ = PᵀIP = [[1, 1], [1, 2]] ≠ I for the SAME Euclidean form (B′(x′, y′) = B(Px′, Py′) for all x′, y′). Active (R2): P as a map of the plane is not a symmetry (B(Px, Py) ≠ B(x, y)). Same congruence algebra, different meaning",
     passive and Mprime == sp.Matrix([[1, 1], [1, 2]]) and active_fails)
n3 = 3
Pn = sp.eye(n3) - sp.ones(n3, n3) / n3
perms = [sp.Matrix(n3, n3, lambda i, j: 1 if j == s_[i] else 0) for s_ in ((1, 0, 2), (0, 2, 1), (1, 2, 0))]
e = [sp.eye(n3)[:, i] for i in range(n3)]
card("TRA4b", "[R1 scope | projections] the projection Pₙ = I − 11ᵀ/n (n = 3) is not a change of representation: it is not invertible (rank 2) and does not keep inner products (e₁·e₂ = 0 but Pe₁·Pe₂ = −1/3). Its transformation behaviour is R3: it commutes with every permutation matrix (cf. G2n, Q2f)",
     Pn.rank() == 2 and ((Pn * e[0]).T * (Pn * e[1]))[0] == sp.Rational(-1, 3) and all(Q * Pn == Pn * Q for Q in perms))
