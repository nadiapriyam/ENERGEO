"""RIC2: precision checks for the Reduction / Information-Changing Architecture (2026-11-13).

Not a new experiment. Supports three wording corrections:
- a single wavelet filter is not invertible; a complete filter bank can be (under its stated assumption);
- finite-scale low-pass averaging is translation-covariant, not translation-invariant; exact invariance holds for
  the global (full-domain) average under circular shifts;
- a target zero may or may not have nonzero preimages: the fiber Φ⁻¹(0) decides.
(The generic simplex values −1/n and (n − 1)/n are already carded by G2n.)
Run: python3 verify/verify_RIC2.py"""
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


N = 8
def circ(h):
    """Circular convolution matrix of the filter h (h[0], h[1], …) on ℂ^N."""
    c = list(h) + [0] * (N - len(h))
    return sp.Matrix(N, N, lambda r, k: c[(r - k) % N])
psi = circ([1, -2, 1])                                   # zero-mean (high-pass) filter
phi = circ([sp.Rational(1, 4), sp.Rational(1, 2), sp.Rational(1, 4)])   # low-pass filter, Σ = 1
one = sp.ones(N, 1)
bank = sp.Matrix.vstack(psi, phi)
left = (bank.T * bank).inv() * bank.T                    # a left inverse exists because the bank is injective
card("RIC2a", "[Reduction | wavelet filtering] a single zero-mean filter x ↦ x ⊛ ψ (ψ = (1, −2, 1), circular, N = 8) is not invertible: rank 7, the constant signal maps to 0; the filter bank (ψ, φ) with φ = (1, 2, 1)/4 has no common spectral zero, is injective (rank 8) and has an exact left inverse. Reconstruction belongs to a complete filter bank / wavelet transform under its stated assumptions, not to one filter",
     psi.rank() == N - 1 and psi * one == sp.zeros(N, 1) and bank.rank() == N and left * bank == sp.eye(N))

x = sp.Matrix([3, -1, 4, 1, -5, 9, 2, -6])
T = sp.Matrix(N, N, lambda r, k: 1 if r == (k + 1) % N else 0)   # integer cyclic shift by one sample
absv = lambda v: v.applyfunc(sp.Abs)
first = lambda v: phi * absv(psi * v)                    # finite-scale averaged modulus |x ⊛ ψ| ⊛ φ
glob = lambda v: sum(absv(psi * v))                      # global (full-domain) average of the modulus
card("RIC2b", "[Reduction | averaging] finite-scale low-pass averaging is translation-covariant, not invariant: (T x) ⊛ φ = T(x ⊛ φ) and |Tx ⊛ ψ| ⊛ φ = T(|x ⊛ ψ| ⊛ φ), yet both differ from the unshifted output for this x; the global (full-domain) average Σ|x ⊛ ψ| is exactly invariant under circular shifts. Local invariance at a finite averaging scale is a sourced theorem (Mallat 2012), not carded",
     phi * (T * x) == T * (phi * x) and phi * (T * x) != phi * x and first(T * x) == T * first(x) and first(T * x) != first(x) and glob(T * x) == glob(x))

P = sp.eye(4) - sp.ones(4, 4) / 4
card("RIC2c", "[Zero | collapsed zero] the fiber over zero decides: for the injective filter bank, Φ⁻¹(0) = {0}, so a target zero implies a zero source; for Pₙ (n = 4), Φ⁻¹(0) = span{1}, so the target zero has nonzero preimages (a COLLAPSED ZERO). Not every target zero implies a nonzero hidden source",
     bank.nullspace() == [] and len(P.nullspace()) == 1 and P * sp.ones(4, 1) == sp.zeros(4, 1))
