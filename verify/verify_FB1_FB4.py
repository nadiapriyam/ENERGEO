"""FB1–FB4: Foundation bridge cards for the translation / Fourier strand (Foundation Completion Pass 2, 2026-11-12).

Project convention (fixed before any card ran):
  x̂(ω) = ∫ x(t) e^{−iωt} dt,   ‖x‖² = ∫|x|² dt = (1/2π) ∫|x̂|² dω   (Plancherel),
  T_τ x(t) = x(t − τ),   ⟨x, y⟩ = ∫ conj(x) y dt,
  D_x(τ) = ‖x − T_τx‖² / (2‖x‖²) = 1 − Re⟨x, T_τx⟩/‖x‖²   (B5b, Foundation T2),
  dμ_x(ω) = |x̂(ω)|² dω / (2π‖x‖²)   (a probability measure on frequencies).

Each card names its Foundation bridge / object, its assumptions and its failure condition.
FB1 → T3 (BR6, BR7); FB2 → T4 (BR9); FB3 → T5; FB4 → P1.
The cards check exact identities and named instances. A general theorem that is only instanced here
(the uncertainty inequality) is credited to its source in research/foundation_sources.md, not to the card.
Run: python3 verify/verify_FB1_FB4.py"""
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:5} {'PASS' if ok else 'FAIL'}  {claim}")


t, w, tau, nu = sp.symbols('t omega tau nu', real=True)
a, s = sp.symbols('a s', positive=True)
oo = sp.oo


def I(expr, var):
    return sp.simplify(sp.integrate(expr, (var, -oo, oo), conds='none'))


def ft(x):
    return sp.simplify(I(x * sp.exp(-sp.I * w * t), t))


def norm2(x):
    return I(sp.expand(x * sp.conjugate(x)), t)


def defect_time(x):
    """D_x(τ) from the time domain: 1 − Re⟨x, T_τx⟩/‖x‖²."""
    ip = I(sp.expand(sp.conjugate(x) * x.subs(t, t - tau)), t)
    return sp.simplify(1 - sp.re(sp.expand_complex(ip)) / norm2(x))


def mu_density(x):
    X = ft(x)
    return sp.simplify(sp.expand_complex(X * sp.conjugate(X)) / (2 * sp.pi * norm2(x)))


g = sp.exp(-t**2 / 2)                       # real Gaussian
m = sp.exp(-t**2 / 2) * sp.exp(sp.I * a * t)  # complex, modulated: spectrum centred at a
h = (1 + t) * sp.exp(-t**2 / 2)              # real, asymmetric in t
h1 = t * sp.exp(-t**2 / 2)                   # real, odd

# ── FB1: T3, the combined translation → autocorrelation → spectrum statement ──────────────────
Hh = ft(h)
card("FB1a", "[T3 | BR5, continuous] (T_τx)^(ω) = e^{−iωτ} x̂(ω) under the project convention, checked for x = (1+t)e^{−t²/2} with symbolic τ; assumption x ∈ L¹∩L²; this is the continuous form of the carded S3 (Fourier-series) rule",
     sp.simplify(ft(h.subs(t, t - tau)) - sp.exp(-sp.I * w * tau) * Hh) == 0)

ok = True
for x in (g, m, h):
    Dt = defect_time(x)
    Df = sp.simplify(1 - I(sp.expand(sp.cos(w * tau).rewrite(sp.exp) * mu_density(x)), w))
    total = sp.simplify(I(mu_density(x), w))
    ok = ok and sp.simplify(sp.expand_complex(Dt - Df)) == 0 and total == 1
Dg = defect_time(g)
card("FB1b", "[T3 | BR6+BR7 combined] D_x(τ) = 1 − Re⟨x,T_τx⟩/‖x‖² = 1 − ∫cos(ωτ) dμ_x(ω), with dμ_x = |x̂|²dω/(2π‖x‖²) a probability measure; checked exactly for e^{−t²/2} (D = 1 − e^{−τ²/4}), the complex e^{−t²/2}e^{iat} and the asymmetric (1+t)e^{−t²/2}; assumption x ∈ L²(ℝ), x ≠ 0; complex signals included (Re⟨·⟩ picks the cosine)",
     ok and sp.simplify(Dg - (1 - sp.exp(-tau**2 / 4))) == 0)

wk = True
for x in (h, m):
    c = I(sp.expand(sp.conjugate(x) * x.subs(t, t - tau)), t)  # c_x(τ) = ⟨x, T_τx⟩
    lhs = sp.simplify(I(sp.expand(c * sp.exp(sp.I * w * tau)), tau))
    X = ft(x)
    wk = wk and sp.simplify(sp.expand_complex(lhs - X * sp.conjugate(X))) == 0
card("FB1c", "[T3 | BR7, energy-signal form] the correlation c_x(τ) = ⟨x, T_τx⟩ = ∫conj(x(t))x(t−τ)dt has ∫c_x(τ)e^{iωτ}dτ = |x̂(ω)|² (autocorrelation ↔ energy spectrum, a convolution-theorem corollary; Wiener 1930 / Khintchine 1934 are the power-signal and stationary-process forms); checked exactly for (1+t)e^{−t²/2} and e^{−t²/2}e^{iat}",
     wk)

hr = h.subs(t, -t)
card("FB1d", "[T3 | failure condition, what BR6/BR7 do NOT give] the defect function does not determine the signal: x = (1+t)e^{−t²/2} and its reversal x(−t) are different signals with identical D_x(τ) and identical |x̂|² (the continuous counterpart of P1b/P1c)",
     sp.simplify(hr - h) != 0 and sp.simplify(defect_time(hr) - defect_time(h)) == 0
     and sp.simplify(sp.expand_complex(ft(hr) * sp.conjugate(ft(hr)) - Hh * sp.conjugate(Hh))) == 0)

# ── FB2: T4, small translation ↔ spectral second moment ────────────────────────────────────────
ok, vals = True, {}
for name, x in (('g', g), ('m', m), ('h', h)):
    D2 = sp.simplify(sp.diff(defect_time(x), tau, 2).subs(tau, 0))
    M2 = sp.simplify(I(w**2 * mu_density(x), w))
    dx = sp.diff(x, t)
    R = sp.simplify(norm2(dx) / norm2(x))
    vals[name] = D2
    ok = ok and sp.simplify(D2 - M2) == 0 and sp.simplify(D2 - R) == 0
card("FB2a", "[T4 | BR9] D_x''(0) = ∫ω² dμ_x = ‖x'‖²/‖x‖² (exact identity, under the assumption ∫ω²|x̂|² < ∞, i.e. x' ∈ L²); values: e^{−t²/2} → 1/2, e^{−t²/2}e^{iat} → a² + 1/2, (1+t)e^{−t²/2} → 5/6",
     ok and vals['g'] == sp.Rational(1, 2) and sp.simplify(vals['m'] - (a**2 + sp.Rational(1, 2))) == 0 and vals['h'] == sp.Rational(5, 6))

ser = sp.series(Dg, tau, 0, 6).removeO()
card("FB2b", "[T4 | exact vs asymptotic] D_x(τ) = (τ²/2)∫ω²dμ_x + o(τ²) is a second-order Taylor statement, not an identity: for e^{−t²/2}, D = 1 − e^{−τ²/4} = τ²/4 − τ⁴/32 + O(τ⁶); the τ² coefficient equals (1/2)·(1/2) and the remainder is nonzero",
     sp.simplify(ser - (tau**2 / 4 - tau**4 / 32)) == 0)

box = sp.Piecewise((1, (t >= 0) & (t <= 1)), (0, True))
ip_box = sp.integrate(1, (t, tau, 1))            # ⟨x, T_τx⟩ for 0 ≤ τ ≤ 1 (overlap [τ, 1])
D_box = sp.simplify(1 - ip_box / 1)
N = sp.symbols('N', positive=True)
Xb = sp.integrate(sp.exp(-sp.I * w * t), (t, 0, 1))
dens = sp.simplify(sp.expand_complex(w**2 * Xb * sp.conjugate(Xb)))    # = 4 sin²(ω/2) = 2 − 2cos ω
second = sp.integrate(sp.simplify(dens.rewrite(sp.cos)), (w, -N, N)) / (2 * sp.pi)
card("FB2c", "[T4 | failure condition] for the box x = 1 on [0,1], D_x(τ) = |τ| on |τ| ≤ 1 (not twice differentiable at 0) and ∫_{−N}^{N}ω²|x̂|²dω/2π = (2N − 2 sin N)/π → ∞: the second-moment formula needs a finite spectral second moment",
     sp.simplify(D_box - tau) == 0 and sp.simplify(second - (2 * N - 2 * sp.sin(N)) / sp.pi) == 0 and sp.limit(second, N, oo) == oo)

mean_m = sp.simplify(I(w * mu_density(m), w))
var_m = sp.simplify(I((w - mean_m)**2 * mu_density(m), w))
mean_h = sp.simplify(I(w * mu_density(h), w))
card("FB2d", "[T4 | exact link] D_x''(0) = Δω² + ω̄² (spectral variance plus squared spectral mean); for e^{−t²/2}e^{iat}: ω̄ = a, Δω² = 1/2; for any real x, ω̄ = 0 (conjugate symmetry, FB4) so D_x''(0) = Δω² (checked for (1+t)e^{−t²/2})",
     mean_m == a and var_m == sp.Rational(1, 2) and sp.simplify(vals['m'] - (var_m + mean_m**2)) == 0 and mean_h == 0)

# ── FB3: T5, localization / uncertainty (instances; the inequality is a cited theorem) ─────────
def spreads(x, X=None, var_w=w):
    n_t = norm2(x)
    tb = sp.simplify(I(t * x * sp.conjugate(x), t) / n_t)
    dt2 = sp.simplify(I((t - tb)**2 * sp.expand(x * sp.conjugate(x)), t) / n_t)
    X = ft(x) if X is None else X
    P = sp.simplify(sp.expand_complex(X * sp.conjugate(X)))
    n_w = I(P, var_w)
    wb = sp.simplify(I(var_w * P, var_w) / n_w)
    dw2 = sp.simplify(I((var_w - wb)**2 * P, var_w) / n_w)
    return dt2, dw2


gs = sp.exp(-t**2 / (2 * s**2))
dt2, dw2 = spreads(gs)
card("FB3a", "[T5] equality case: for x = e^{−t²/(2s²)} (any width s > 0), Δt² = s²/2 and Δω² = 1/(2s²), so Δt·Δω = 1/2 exactly (variances taken with weights |x|² and |x̂|², each normalized); project convention x̂(ω) = ∫x e^{−iωt}dt",
     sp.simplify(dt2 - s**2 / 2) == 0 and sp.simplify(dw2 - 1 / (2 * s**2)) == 0 and sp.simplify(sp.sqrt(dt2 * dw2) - sp.Rational(1, 2)) == 0)

dt2b, dw2b = spreads(h1)
dt2c, dw2c = spreads(h)
card("FB3b", "[T5] strict cases: x = t e^{−t²/2} has Δt² = Δω² = 3/2, Δt·Δω = 3/2 > 1/2; x = (1+t)e^{−t²/2} has Δt·Δω = " + str(sp.nsimplify(sp.sqrt(dt2c * dw2c))) + " > 1/2. These are instances; the inequality Δt·Δω ≥ 1/2 for all x with finite moments is the cited theorem (Kennard 1927; Folland–Sitaram 1997), not proved by this card",
     dt2b == sp.Rational(3, 2) and dw2b == sp.Rational(3, 2) and sp.sqrt(dt2c * dw2c) > sp.Rational(1, 2))

xi = sp.symbols('xi', real=True)
Xf = sp.simplify(I(gs * sp.exp(-2 * sp.pi * sp.I * t * xi), t))
_, dxi2 = spreads(gs, X=Xf, var_w=xi)
card("FB3c", "[T5 | convention] with the 2π-in-the-exponent convention x̂(ξ) = ∫x e^{−2πitξ}dt (used by Folland–Sitaram), ξ = ω/2π, so Δξ = Δω/2π and the bound reads Δt·Δξ ≥ 1/(4π); the Gaussian attains Δt·Δξ = 1/(4π) exactly; the constant depends on the convention, the statement does not",
     sp.simplify(dxi2 - dw2 / (4 * sp.pi**2)) == 0 and sp.simplify(sp.sqrt(dt2 * dxi2) - 1 / (4 * sp.pi)) == 0)

card("FB3d", "[T5 vs T4, kept distinct] corollary for real x with finite moments: D_x''(0) = Δω² ≥ 1/(4Δt²) (FB2d + the cited inequality); instances: e^{−t²/2} gives 1/2 = 1/(4·1/2) (equality), t e^{−t²/2} gives 3/2 > 1/6. FB2 is an identity about one representation; FB3 is an inequality coupling two",
     vals['g'] == 1 / (4 * sp.Rational(1, 2)) and dw2b > 1 / (4 * dt2b))

# ── FB4: P1, real-signal conjugate symmetry ───────────────────────────────────────────────────
card("FB4a", "[P1] for real x, x̂(−ω) = conj x̂(ω) (so |x̂| is even); checked exactly for the asymmetric real x = (1+t)e^{−t²/2}, where x̂ = √(2π)(1 − iω)e^{−ω²/2} is not real",
     sp.simplify(Hh.subs(w, -w) - sp.conjugate(Hh)) == 0 and sp.simplify(sp.im(sp.expand_complex(Hh))) != 0)

xs = [sp.Rational(v) for v in (3, -1, 4, 1, -5, 9, 2, -6)]
Nn = len(xs)
X = [sp.nsimplify(sp.expand_complex(sum(xs[n] * sp.exp(-2 * sp.pi * sp.I * k * n / Nn) for n in range(Nn)))) for k in range(Nn)]
card("FB4b", "[P1, discrete] for a real vector x ∈ ℚ⁸, the DFT X_k = Σ x_n e^{−2πikn/8} satisfies X_{8−k} = conj X_k for every k (exact arithmetic)",
     all(sp.simplify(X[(Nn - k) % Nn] - sp.conjugate(X[k])) == 0 for k in range(Nn)))

M_ = ft(m.subs(a, 1))
card("FB4c", "[P1 | failure condition] the symmetry needs x real: for complex x = e^{−t²/2}e^{it}, |x̂(1)| = √(2π) but |x̂(−1)| = √(2π)e^{−2}. Nadia's physical-pair question (P2, T-CONJUGACY) is not addressed by this card",
     sp.simplify(sp.Abs(M_.subs(w, 1)) - sp.sqrt(2 * sp.pi)) == 0 and sp.simplify(sp.Abs(M_.subs(w, -1)) - sp.sqrt(2 * sp.pi) * sp.exp(-2)) == 0)
