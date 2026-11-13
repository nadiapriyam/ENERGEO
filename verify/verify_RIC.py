"""RIC: consistency checks for the Reduction / Information-Changing Architecture (2026-11-13).

Not a new experiment. These cards verify only the equations the new classification relies on: what the simplex
projection and weighted centering keep, collapse, send to zero and leave as fibers; that a lossy Fourier-side
operation can still respect translations (band-limiting: equivariant; magnitude: invariant); and the difference
between a preserved zero (R2) and a collapsed zero (a nonzero source mapped to 0).
Run: python3 verify/verify_RIC.py"""
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


Z = lambda n, m=None: sp.zeros(n, m or n)

# ── RIC1a: simplex projection Pₙ: ℝⁿ → 1^⊥ ─────────────────────────────────────────────────────
n = 4
one = sp.ones(n, 1)
P = sp.eye(n) - one * one.T / n
e = [sp.eye(n)[:, i] for i in range(n)]
v = [P * ei for ei in e]
x = sp.Matrix(sp.symbols('x0:4', real=True)); c = sp.Symbol('c', real=True)
perms = [sp.Matrix(n, n, lambda i, j: 1 if j == s[i] else 0) for s in ((1, 0, 2, 3), (1, 2, 3, 0), (3, 2, 1, 0))]
card("RIC1a", "[Reduction | simplex projection Pₙ = I − 11ᵀ/n, n = 4] survives: every difference vᵢ − vⱼ = eᵢ − eⱼ; collapses: x and x + c1 have the same image (fibers x + span{1}); zero: Pₙ1 = 0, a nonzero source with zero image, and Pₙx = 0 ⟺ x ∈ span{1}; lost: the common component 1ᵀx/n; Σvᵢ = 0; not invertible (rank n − 1); compatible with symmetry: Pₙ commutes with permutations (R3). Reconstruction holds only under the orthonormal-source assumptions (G3b, G3n)",
     all(v[i] - v[j] == e[i] - e[j] for i in range(n) for j in range(n)) and sp.simplify(P * (x + c * one) - P * x) == Z(n, 1) and P * one == Z(n, 1)
     and len(P.nullspace()) == 1 and sp.Matrix.hstack(P.nullspace()[0], one).rank() == 1
     and sum(v, Z(n, 1)) == Z(n, 1) and P.rank() == n - 1 and all(Q * P == P * Q for Q in perms))

# ── RIC1b: weighted centering C_m ─────────────────────────────────────────────────────────────
m = sp.Matrix([1, 2, 3]); M = sum(m); o3 = sp.ones(3, 1)
C = sp.eye(3) - o3 * m.T / M
y = sp.Matrix(sp.symbols('y0:3', real=True))
Cy = C * y
card("RIC1b", "[Reduction | weighted centering C_m = I − 1mᵀ/M, m = (1, 2, 3)] survives: every difference (C_m y)ᵢ − (C_m y)ⱼ = yᵢ − yⱼ (relative positions); collapses: y and y + c1 (fibers y + span{1}); zero: C_m1 = 0, and C_m y = 0 ⟺ y ∈ span{1}; lost: the weighted mean mᵀy/M (R_CM); y is recovered from (C_m y, mᵀy/M). Its R3 role (commuting with D-isometries preserving span{1}) is CFT8c",
     all(sp.simplify(Cy[i] - Cy[j] - (y[i] - y[j])) == 0 for i in range(3) for j in range(3)) and sp.simplify(C * (y + c * o3) - Cy) == Z(3, 1)
     and C * o3 == Z(3, 1) and len(C.nullspace()) == 1 and sp.simplify(Cy + o3 * (m.T * y)[0] / M - y) == Z(3, 1))

# ── RIC1c: Fourier-side operations: the transform is lossless, band-limiting and magnitude are not ─
N = 6
w = sp.exp(-2 * sp.pi * sp.I / N)
F = sp.Matrix(N, N, lambda j, k: w**(j * k))
U = F / sp.sqrt(N)
shift = sp.Matrix(N, N, lambda r, k: 1 if r == (k + 1) % N else 0)
mask = sp.diag(1, 1, 0, 0, 0, 1)                                   # keep frequencies 0, ±1
Pb = sp.simplify(U.H * mask * U)
xs = [sp.Rational(t) for t in (3, -1, 4, 1, -5, 9)]
xv = sp.Matrix(xs)
iszero = lambda Mx: all(sp.simplify(sp.expand_complex(z)) == 0 for z in Mx)
mag = lambda vec: [sp.simplify(sp.Abs(sp.expand_complex(z))) for z in (F * vec)]
card("RIC1c", "[Reduction vs R1 | Fourier] the unitary DFT is invertible (U†U = I: lossless, R1); band-limiting P = U† diag(1,1,0,0,0,1) U is information-changing (P² = P, rank 3 < 6) yet commutes with the integer cyclic shift (equivariant, R3); keeping magnitudes only, x ↦ |x̂|, is invariant under the cyclic shift and many-to-one (the shifted signal differs, the magnitudes agree)",
     iszero(U.H * U - sp.eye(N)) and iszero(Pb * Pb - Pb) and Pb.rank(simplify=True) == 3 and iszero(Pb * shift - shift * Pb)
     and shift * xv != xv and mag(shift * xv) == mag(xv))

# ── RIC1d: preserved zero (R2) vs collapsed zero (reduction) ───────────────────────────────────
s = sp.Symbol('s', real=True)
eta = sp.diag(1, -1); Lam = sp.Matrix([[sp.cosh(s), sp.sinh(s)], [sp.sinh(s), sp.cosh(s)]]); lv = sp.Matrix([1, 1])
img = sp.simplify(Lam * lv)
card("RIC1d", "[Zero | PRESERVED ZERO vs COLLAPSED ZERO] preserved: under the Lorentz symmetry Λ (R2) the light-like v = (1, 1) keeps q_η = 0 and stays a nonzero vector (Λv = e^s(1, 1)); collapsed: under the reduction Pₙ the nonzero source 1 becomes the zero vector (Pₙ1 = 0). Different mechanisms: an invertible symmetry keeps a zero relation between surviving vectors; a non-invertible map sends a nonzero state to 0",
     (lv.T * eta * lv)[0] == 0 and sp.simplify((img.T * eta * img)[0]) == 0 and img != Z(2, 1) and Lam.det().simplify() == 1 and one != Z(n, 1) and P * one == Z(n, 1))
