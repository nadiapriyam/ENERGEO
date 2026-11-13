"""RIC3: scope of the wavelet / filter-bank statements (2026-11-13).

Not a new experiment. Scopes three claims of the Reduction / Information-Changing Architecture:
- whether one wavelet channel is injective depends on the signal space and the frequency response (finite periodic
  vs L²(ℝ)); zero mean alone decides nothing on L²(ℝ);
- an undecimated convolutional analysis bank is injective iff its multipliers have no common zero on the signal
  space's frequencies;
- a critically sampled (decimated) filter bank needs an invertible polyphase system, R(z)E(z) = c z^(−K) I; the scalar
  no-common-zero condition is not sufficient.
RIC2a (finite periodic, undecimated) stays as recorded.
Run: python3 verify/verify_RIC3.py"""
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


w = sp.Symbol('omega', real=True)
psih = sp.sqrt(2 * sp.pi) * w**2 * sp.exp(-w**2 / 2)          # Mexican hat ψ̂ (FB10a)
zeros = sp.solveset(sp.Eq(psih, 0), w, domain=sp.S.Reals)
card("RIC3a", "[Reduction | one channel on L²(ℝ)] the Mexican-hat multiplier ψ̂(ω) = √(2π)ω²e^{−ω²/2} vanishes only at ω = 0, a null set; so x ↦ x ∗ ψ is injective on L²(ℝ) (ψ̂x̂ = 0 a.e. ⟹ x̂ = 0 a.e.; Plancherel), although ∫ψ = 0. It has no bounded inverse: inf|ψ̂| = 0 (ψ̂ → 0 at ω = 0 and as |ω| → ∞). Zero mean alone decides nothing on L²(ℝ); the constant mode is not in L²(ℝ)",
     zeros == sp.FiniteSet(0) and sp.limit(psih, w, sp.oo) == 0 and psih.subs(w, 0) == 0)

band = sp.Piecewise((1, (sp.Abs(w) >= sp.pi) & (sp.Abs(w) <= 2 * sp.pi)), (0, True))  # Shannon-type ψ̂: indicator of π ≤ |ω| ≤ 2π
xh = sp.Piecewise((1, (w >= 0) & (w < 1)), (0, True))                                   # x̂ = indicator of [0, 1)
prod = sp.integrate(sp.Abs(band * xh)**2, (w, -10, 10))
card("RIC3b", "[Reduction | one channel on L²(ℝ), positive-measure zero set] if ψ̂_λ vanishes on a set of positive measure, the channel has a nontrivial kernel: with ψ̂ = 1 on π ≤ |ω| ≤ 2π and 0 elsewhere, the signal with x̂ = 1 on [0, 1) has ‖x̂‖² = 1 but ψ̂x̂ = 0 (so x ∗ ψ = 0 with x ≠ 0). The assumption is the positive-measure zero set, not zero mean",
     sp.integrate(xh**2, (w, -10, 10)) == 1 and prod == 0)

N = 8
def circ(h):
    c = list(h) + [0] * (N - len(h))
    return sp.Matrix(N, N, lambda r, k: c[(r - k) % N])
def mult(h, k):
    return sp.nsimplify(sp.expand_complex(sum(hj * sp.exp(-2 * sp.pi * sp.I * j * k / N) for j, hj in enumerate(h))))
def no_common_zero(*hs):
    return all(any(sp.simplify(mult(h, k)) != 0 for h in hs) for k in range(N))
psi_, phi_, bad_ = [1, -2, 1], [sp.Rational(1, 4), sp.Rational(1, 2), sp.Rational(1, 4)], [1, 0, -1]
good = sp.Matrix.vstack(circ(psi_), circ(phi_)); badb = sp.Matrix.vstack(circ(psi_), circ(bad_))
card("RIC3c", "[Reduction | undecimated analysis bank, finite periodic ℂ⁸] x ↦ (H₁x, …, H_m x) with circular convolutions is injective iff at every DFT frequency some channel multiplier is nonzero: (1, −2, 1) with (1, 2, 1)/4 has no common zero and rank 8; (1, −2, 1) with (1, 0, −1) share the zero at frequency 0 and have rank 7 (the constant mode is lost). On L²(ℝ) the analogous condition is no common zero almost everywhere (stated, not carded)",
     no_common_zero(psi_, phi_) and good.rank() == N and not no_common_zero(psi_, bad_) and badb.rank() == N - 1)

z = sp.Symbol('z')
def decimated(h0, h1):
    D = sp.Matrix(N // 2, N, lambda r, k: 1 if k == 2 * r else 0)                     # keep even samples
    return sp.Matrix.vstack(D * circ(h0), D * circ(h1))
def polyphase(h):                                                                        # type-1: H(z) = E₀(z²) + z⁻¹E₁(z²)
    e0 = sum(c * z**(-(j // 2)) for j, c in enumerate(h) if j % 2 == 0)
    e1 = sum(c * z**(-(j // 2)) for j, c in enumerate(h) if j % 2 == 1)
    return [e0, e1]
h0, h1 = [1, 1], [1, 0, 1]                       # H₀ = 1 + z⁻¹ (zero at z = −1), H₁ = 1 + z⁻² (zeros at z = ±i): no common zero
E = sp.Matrix([polyphase(h0), polyphase(h1)])
und = sp.Matrix.vstack(circ(h0), circ(h1))
s2 = sp.sqrt(2)
hz0, hz1 = [1 / s2, 1 / s2], [1 / s2, -1 / s2]   # Haar
Eh = sp.Matrix([polyphase(hz0), polyphase(hz1)])
Rh = Eh.inv()
Ah = decimated(hz0, hz1)
card("RIC3d", "[Reduction | critically sampled bank] perfect reconstruction needs an invertible polyphase system, R(z)E(z) = c z^(−K) I (type-1 convention H_i(z) = E_i0(z²) + z⁻¹E_i1(z²)), not the scalar no-common-zero condition: H₀ = 1 + z⁻¹ and H₁ = 1 + z⁻² share no zero and the UNDECIMATED bank is injective (rank 8 on ℂ⁸), yet after decimation by 2 det E(z) = −(1 + z⁻¹) vanishes at z = −1 and the decimated analysis map on ℂ⁸ has rank 7. Haar: E(z) is constant and invertible, R = E⁻¹ gives R E = I (K = 0, c = 1), and the decimated Haar map is orthogonal",
     no_common_zero(h0, h1) and und.rank() == N and sp.simplify(E.det() + (1 + 1 / z)) == 0 and decimated(h0, h1).rank() == N - 1
     and sp.simplify(Rh * Eh) == sp.eye(2) and sp.simplify(Ah.T * Ah) == sp.eye(N))
