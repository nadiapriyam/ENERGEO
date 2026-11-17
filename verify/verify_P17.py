"""P17: first construction of Master Map #17, "Conjugacy and physical pairs — Search for hidden relationships" (2026-11-17).

Decisions: docs/restructure_decisions.md, "Pre-#17 story patches and the first #17 construction".
Order of the cards follows the discovery path decided for #17:
  Fourier pair → exact mathematical conjugacy → what information does the pairing encode?
  → do physical pairings ever share an exact relation of comparable structural depth?
Only after that question do candidate physical examples (a real classical field; the dispersion relation) enter.

Conventions (fixed before any card ran; the project convention of FB1–FB4):
  x̂(ω) = ∫ x(t) e^{−iωt} dt;   DFT X_k = Σ_n x_n e^{−2πikn/N};
  space-time transform φ̃(ω, k) = ∬ φ(t, x) e^{−iωt} e^{−ikx} dt dx;
  η = diag(1, −1) on P = (ω/c, k) (spectral variables) and on X = (ct, x) (event variables), kept as different planes;
  the physics plane wave e^{i(kx − ωt)} = e^{−iη(P, X)}.
  ω and k are angular (rad/s, rad/m). E = ħω and p = ħk are physical identifications (Planck–Einstein, de Broglie):
  inputs, never derived here. μ is the parameter of the Klein–Gordon-form PDE (units 1/length); μ = mc/ħ is an
  identification.
No quantum field theory is used: no operators, no particle/antiparticle reading, no CPT. A card names its assumptions
and its failure condition. Families: F (Fourier source lock), R (real classical field), D (dispersion / mass-shell
geometry), E (energy–momentum form), C (comparison with true conjugacy; counterexamples P17-X1–X5), M (mass/wave
reading MW-D boundary).
Run: python3 verify/verify_P17.py"""
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


t, x, w, k = sp.symbols('t x omega k', real=True)
I_, oo = sp.I, sp.oo
c, mu, hbar, m, kp, om = sp.symbols('c mu hbar m kappa Omega', positive=True)
phi_r = sp.symbols('phi', real=True)


def ft(f, var=t, dual=w):
    return sp.simplify(sp.integrate(f * sp.exp(-I_ * dual * var), (var, -oo, oo), conds='none'))


def zero(e):
    if isinstance(e, sp.MatrixBase):
        return all(zero(z) for z in e)
    return sp.simplify(sp.expand(e)) == 0


# ══ F. Fourier conjugacy, source-locked ═════════════════════════════════════════════════════════════════
u = (1 + t) * sp.exp(-t**2 / 2)            # real part (asymmetric, so û is not real)
v = t * sp.exp(-t**2)                      # imaginary part
U, V = ft(u), ft(v)
Xc = ft(u + I_ * v)
diff = sp.simplify(Xc.subs(w, -w) - sp.conjugate(Xc))
card("P17Fa", "[source relation | continuous] for x = u + iv (u, v real, integrable): x̂(−ω) − conj x̂(ω) = 2i·v̂(−ω); so x̂(−ω) = conj x̂(ω) for all ω ⟺ v̂ ≡ 0 ⟺ v = 0 (Fourier uniqueness, source-locked). Realness is exactly the property that forces the conjugacy. Checked for u = (1+t)e^{−t²/2}, v = te^{−t²}: the defect is 2i·v̂(−ω) ≠ 0, and it vanishes for v = 0",
     zero(diff - 2 * I_ * V.subs(w, -w)) and not zero(V) and zero(U.subs(w, -w) - sp.conjugate(U)))

Ct = lambda F: sp.conjugate(F.subs(w, -w))   # C̃: X(ω) ↦ conj X(−ω)
card("P17Fb", "[source relation | involutions] C: x ↦ conj x (time side) and C̃: X(ω) ↦ conj X(−ω) (frequency side) are antilinear involutions (C̃² = id, C̃(iX) = −iC̃X) and F∘C = C̃∘F; real signals are Fix(C), Hermitian-symmetric spectra are Fix(C̃): the conjugate pairing is the fixed-point condition of an antilinear involution",
     zero(Ct(Ct(Xc)) - Xc) and zero(Ct(I_ * Xc) + I_ * Ct(Xc)) and zero(ft(sp.conjugate(u + I_ * v)) - Ct(Xc)))

Y = ft((1 + I_) * sp.exp(-t**2 / 2))
Zs = sp.exp(-(w - 1)**2 / 2) * sp.exp(I_ * w)
card("P17Fc", "[four properties separated] conjugate pair ⟺ equal magnitude AND opposite phase (where X ≠ 0); neither alone suffices: y = (1+i)e^{−t²/2} has |ŷ(−ω)| = |ŷ(ω)| with equal (not opposite) phase π/4, so ŷ(−ω) ≠ conj ŷ(ω); Z(ω) = e^{−(ω−1)²/2}e^{iω} has odd phase but |Z(−1)| = e^{−2} ≠ |Z(1)| = 1",
     zero(sp.Abs(Y.subs(w, -w))**2 - sp.Abs(Y)**2) and not zero(Y.subs(w, -w) - sp.conjugate(Y))
     and sp.simplify(sp.Abs(Zs.subs(w, -1)) - sp.exp(-2)) == 0 and sp.simplify(sp.Abs(Zs.subs(w, 1)) - 1) == 0)


def dft(xs):
    N = len(xs)
    return [sp.nsimplify(sp.expand_complex(sum(xs[n] * sp.exp(-2 * sp.pi * I_ * kk * n / N) for n in range(N)))) for kk in range(N)]


x8 = [sp.Integer(v_) for v_ in (3, -1, 4, 1, -5, 9, 2, -6)]
x5 = [sp.Integer(v_) for v_ in (2, 7, -1, 8, 3)]
X8, X5 = dft(x8), dft(x5)
selfp = lambda N: [kk for kk in range(N) if (-kk) % N == kk]
card("P17Fd", "[source relation | DFT, finite index] for real x ∈ ℚ^N, X_{(−k) mod N} = conj X_k: index pairs k ↔ N − k; self-paired indices are k = 0 always and k = N/2 iff N is even; X₀ and X_{N/2} are real. Checked exactly for N = 8 (pairs {1,7}, {2,6}, {3,5}; self-paired {0, 4}) and N = 5 (pairs {1,4}, {2,3}; self-paired {0}, no Nyquist index)",
     all(zero(X8[(-kk) % 8] - sp.conjugate(X8[kk])) for kk in range(8)) and all(zero(X5[(-kk) % 5] - sp.conjugate(X5[kk])) for kk in range(5))
     and selfp(8) == [0, 4] and selfp(5) == [0] and sp.im(X8[0]) == 0 and sp.simplify(sp.im(X8[4])) == 0 and sp.im(X5[0]) == 0)


def half_map(N):
    """Real-linear map x ↦ independent real coordinates of (X₀, …, X_⌊N/2⌋)."""
    rows = []
    for kk in range(N // 2 + 1):
        re = [sp.cos(2 * sp.pi * kk * n / N) for n in range(N)]
        im = [-sp.sin(2 * sp.pi * kk * n / N) for n in range(N)]
        rows.append(re)
        if not (kk == 0 or (N % 2 == 0 and kk == N // 2)):
            rows.append(im)
    return sp.Matrix(rows)


H8, H5 = half_map(8), half_map(5)
card("P17Fe", "[redundancy / degrees of freedom] the real-linear map x ↦ (X₀, X₁, …, X_⌊N/2⌋), counting X₀ (and X_{N/2} for even N) as one real number and the others as two, is a square invertible N × N real matrix (N = 8: 1 + 1 + 2·3; N = 5: 1 + 2·2): the half spectrum determines x, and the conjugate half carries no independent information",
     H8.shape == (8, 8) and sp.simplify(H8.det()) != 0 and H5.shape == (5, 5) and sp.simplify(H5.det()) != 0)

xn = [sp.Integer((-1)**(n + 1)) for n in range(8)]
Xn = dft(xn)
card("P17Ff", "[DC and Nyquist exceptions] ω = 0 is the only self-paired frequency (−ω = ω ⟺ ω = 0), and x̂(0) = ∫x is real for real x; at a self-paired index the conjugate 'pair' degenerates to a reality condition on one coefficient, whose phase is 0 or π: x = (−1, 1, −1, 1, −1, 1, −1, 1) gives X₀ = 0 and X₄ = −8 (phase π)",
     sp.solve(sp.Eq(-w, w), w) == [0] and sp.im(sp.expand_complex(U.subs(w, 0))) == 0 and Xn[0] == 0 and Xn[4] == -8)

Xg = dft([1, I_, 0, 0])
card("P17Fg", "[P17-X1: a complex signal without conjugate symmetry] x = (1, i, 0, 0) ∈ ℂ⁴: X = (1 + i, 2, 1 − i, 0), so X₃ = 0 ≠ conj X₁ = 2 and X₀ is not real. For a generic complex-valued signal the conjugate symmetry need not hold (continuous case: FB4c)",
     [sp.simplify(z) for z in Xg] == [1 + I_, 2, 1 - I_, 0] and not zero(Xg[3] - sp.conjugate(Xg[1])))

a_re, a_im, th = sp.symbols('p q theta', real=True)
aa = a_re + I_ * a_im
recon = [sp.nsimplify(sp.expand_complex((X8[0] + X8[4] * (-1)**n + sum(2 * sp.re(sp.expand_complex(X8[kk] * sp.exp(2 * sp.pi * I_ * kk * n / 8))) for kk in (1, 2, 3))) / 8)) for n in range(8)]
card("P17Fh", "[what the pairing encodes] for a real signal each pair (X_k, X_{N−k}) contributes exactly one real oscillation, (2/N)·Re(X_k e^{2πikn/N}) = (2/N)|X_k|cos(2πkn/N + arg X_k): one amplitude and one phase; the imaginary parts of a pair cancel identically, Im(a e^{iθ} + conj(a) e^{−iθ}) = 0 (a cancellation zero), and the reconstruction from X₀, X₄ and the pairs k = 1, 2, 3 returns x ∈ ℚ⁸ exactly",
     zero(sp.im(sp.expand_complex(aa * sp.exp(I_ * th) + sp.conjugate(aa) * sp.exp(-I_ * th)))) and recon == x8
     and zero(sp.re(sp.expand_complex(aa * sp.exp(I_ * th))) - (a_re * sp.cos(th) - a_im * sp.sin(th))))

# ══ R. A real classical field (the first physical candidate) ══════════════════════════════════════════
L = lambda f: sp.diff(f, t, 2) - c**2 * sp.diff(f, x, 2) + mu**2 * c**2 * f        # Klein–Gordon-form operator (a PDE)
wk = sp.sqrt(c**2 * k**2 + mu**2 * c**2)
pw = sp.exp(I_ * (k * x - w * t))
f1, g1 = (t + x) * sp.exp(-t**2 - x**2), sp.sin(x) * sp.cos(2 * t)
card("P17Ra", "[real field | the equation] L = ∂_t² − c²∂_x² + μ²c² (a PDE with a parameter μ > 0, units 1/length): L e^{i(kx − ωt)} = (c²k² + μ²c² − ω²)e^{i(kx − ωt)}, so a plane wave solves Lφ = 0 ⟺ ω² = c²k² + μ²c²; L has real coefficients, so L(conj φ) = conj(Lφ) (checked for φ = f + ig with f = (t + x)e^{−t²−x²}, g = sin x cos 2t): the solution space is closed under complex conjugation",
     zero(L(pw) / pw - (c**2 * k**2 + mu**2 * c**2 - w**2)) and zero(L(f1 - I_ * g1) - (L(f1) - I_ * L(g1))) and zero(sp.conjugate(L(f1 + I_ * g1)) - (L(f1) - I_ * L(g1))))

kk_, ww = sp.symbols('k_0 omega_0', positive=True)
a1, a2, b1, b2 = [sp.Symbol(n_, complex=True) for n_ in ('a_k', 'a_mk', 'b_k', 'b_mk')]
modes = {'a_k': (kk_, -ww), 'a_mk': (-kk_, -ww), 'b_k': (kk_, ww), 'b_mk': (-kk_, ww)}
e = lambda kx, wt: sp.exp(I_ * (kx * x + wt * t))
phi_f = a1 * e(kk_, -ww) + a2 * e(-kk_, -ww) + b1 * e(kk_, ww) + b2 * e(-kk_, ww)
Dphi = phi_f - sp.conjugate(phi_f)
box = (2 * sp.pi / kk_) * (2 * sp.pi / ww)
proj = lambda F, kx, wt: sp.simplify(sp.integrate(sp.integrate(sp.expand(F * sp.exp(-I_ * (kx * x + wt * t))), (x, 0, 2 * sp.pi / kk_)), (t, 0, 2 * sp.pi / ww)) / box)
card("P17Rb", "[real field | reality ⟺ amplitude pairing] for φ = a(k)e^{i(kx−ωt)} + a(−k)e^{i(−kx−ωt)} + b(k)e^{i(kx+ωt)} + b(−k)e^{i(−kx+ωt)} (ω = ω_k > 0): projecting φ − conj φ onto e^{i(kx+ωt)} and e^{i(kx−ωt)} over one period box gives b(k) − conj a(−k) and a(k) − conj b(−k); so φ is real ⟺ b(k) = conj a(−k) and b(−k) = conj a(k), and with these φ − conj φ ≡ 0",
     zero(proj(Dphi, kk_, ww) - (b1 - sp.conjugate(a2))) and zero(proj(Dphi, kk_, -ww) - (a1 - sp.conjugate(b2)))
     and zero(Dphi.subs({b1: sp.conjugate(a2), b2: sp.conjugate(a1)})))

g2 = (1 + t + 2 * x) * sp.exp(-t**2 - x**2 / 2)
G2 = sp.simplify(ft(ft(g2, t, w), x, k))
qf = lambda P: P[0]**2 - P[1]**2
card("P17Rc", "[real field | two-variable statement] for real g(t, x) the space-time spectrum satisfies g̃(−ω, −k) = conj g̃(ω, k): the pairing flips BOTH signs, P ↦ −P; flipping one sign fails (g̃(−ω, k) ≠ conj g̃(ω, k) for g = (1 + t + 2x)e^{−t²−x²/2}); q(−P) = q(P), so the pairing maps every level set of q to itself and exchanges the branches ω > 0 and ω < 0",
     zero(G2.subs({w: -w, k: -k}) - sp.conjugate(G2)) and not zero(G2.subs(w, -w) - sp.conjugate(G2)) and zero(qf((-w / c, -k)) - qf((w / c, k))))

cw = sp.cos(kk_ * x - ww * t)
card("P17Rd", "[real field | which modes pair] the real right-moving wave cos(kx − ωt) has a(k) = 1/2, b(−k) = 1/2 and a(−k) = b(k) = 0: at fixed k the modes (ω, k) and (−ω, k) are NOT partners (one present, one absent); the partner of (ω, k) is (−ω, −k)",
     [proj(cw, kk_, -ww), proj(cw, -kk_, ww), proj(cw, -kk_, -ww), proj(cw, kk_, ww)] == [sp.Rational(1, 2), sp.Rational(1, 2), 0, 0])

pw0 = sp.exp(I_ * (kk_ * x - wk.subs(k, kk_) * t))
card("P17Re", "[real field | the pairing is a condition, not a consequence] the single complex mode e^{i(kx − ω_k t)}, ω_k = √(c²k² + μ²c²), solves Lφ = 0 and is not real (Im ≠ 0): the equation admits complex solutions; the conjugate pairing is the reality condition on the field, as for Fourier (P17-X1)",
     zero(L(pw0)) and not zero(sp.im(sp.expand_complex(pw0.subs({x: 0, t: 1})))))

al = sp.symbols('alpha', positive=True)
S = lambda f: I_ * sp.diff(f, t) + al * sp.diff(f, x, 2)
psi = sp.exp(I_ * (kk_ * x - al * kk_**2 * t))
psi_t, psi_xx = sp.symbols('psi_t psi_xx', real=True)                    # the values ψ_t, ψ_xx of a real solution at a point
card("P17Rf", "[contrast: a PDE whose solution space has no reality pairing] for iψ_t + αψ_xx = 0 (a PDE only; no quantum reading used): ψ = e^{i(kx − αk²t)} solves it but conj ψ does not (residual −2αk²·conj ψ); its dispersion set ω = αk² has one branch, so (ω, k) ≠ 0 on it implies (−ω, −k) is not on it; real solutions satisfy ψ_t = 0 = ψ_xx. Pairing of positive and negative frequencies by reality needs an operator that commutes with conjugation (P17Ra)",
     zero(S(psi)) and zero(S(sp.conjugate(psi)) + 2 * al * kk_**2 * sp.conjugate(psi)) and sp.solve(sp.Eq(-w, al * k**2).subs(w, al * k**2), k) == [0]
     and sp.solve([sp.re(I_ * psi_t + al * psi_xx), sp.im(I_ * psi_t + al * psi_xx)], [psi_t, psi_xx]) == {psi_t: 0, psi_xx: 0})

# ══ D. Dispersion / mass-shell geometry in spectral variables (not spacetime) ══════════════════════════
dim = {'omega': (0, 0, -1), 'k': (0, -1, 0), 'c': (0, 1, -1), 'hbar': (1, 2, -1), 'm': (1, 0, 0)}
add = lambda *a: tuple(sum(z) for z in zip(*a))
neg = lambda a: tuple(-z for z in a)
energy, momentum = (1, 2, -2), (1, 1, -1)
nu_, h_ = sp.symbols('nu h', positive=True)
card("P17Da", "[conventions and dimensions] (M, L, T) exponents: [ω/c] = [k] = [mc/ħ] = L⁻¹; [mc²/ħ] = T⁻¹; [ħω] = energy, [ħk] = [E/c] = [mc] = momentum. ω and k are angular: with ν = ω/2π and h = 2πħ, hν = ħω (and p = h/λ = ħk with k = 2π/λ)",
     add(dim['omega'], neg(dim['c'])) == dim['k'] == add(dim['m'], dim['c'], neg(dim['hbar'])) and add(dim['m'], dim['c'], dim['c'], neg(dim['hbar'])) == dim['omega']
     and add(dim['hbar'], dim['omega']) == energy and add(dim['hbar'], dim['k']) == momentum == add(energy, neg(dim['c'])) == add(dim['m'], dim['c'])
     and zero((2 * sp.pi * hbar) * (w / (2 * sp.pi)) - hbar * w))

gs = sp.exp(-t**2 - x**2)
Gs = sp.simplify(ft(ft(gs, t, w), x, k))
LG = sp.simplify(ft(ft(sp.expand(L(gs)), t, w), x, k))
sym = -w**2 + c**2 * k**2 + mu**2 * c**2
card("P17Db", "[symbol in the project convention] with φ̃(ω, k) = ∬φe^{−iωt}e^{−ikx}: ∂_t ↦ iω, ∂_x ↦ ik, so (Lφ)~ = (c²k² + μ²c² − ω²)φ̃ = −c²(q(P) − μ²)φ̃ with P = (ω/c, k), q = η(P, P) (checked on e^{−t²−x²}); the support of a solution's spectrum lies on q(P) = μ². The physics positive-frequency wave e^{−iω₀t} has its spectrum at −ω₀ in this convention (Gaussian window: √(2π)e^{−(ω+ω₀)²/2}): 'positive frequency' is a convention-dependent label",
     zero(LG - sym * Gs) and zero(sym + c**2 * (qf((w / c, k)) - mu**2)) and zero((ft(sp.exp(-I_ * om * t) * sp.exp(-t**2 / 2)) - sp.sqrt(2 * sp.pi) * sp.exp(-(w + om)**2 / 2)).rewrite(sp.erf)))

card("P17Dc", "[massless null relation] m = 0: ω² = c²k² ⟺ q(P) = (ω/c)² − k² = 0 ⟺ ω = ±ck — two null lines through the origin of the spectral plane. The origin P = 0 (the zero-frequency, zero-wavenumber constant mode, a zero index) lies on it: a constant solves the μ = 0 equation, and does not solve the μ > 0 equation (Lφ = μ²c² ≠ 0 for φ = 1)",
     set(sp.solve(qf((w / c, k)), w)) == {c * k, -c * k} and zero(L(sp.Integer(1)).subs(mu, 0)) and not zero(L(sp.Integer(1))))

eta = sp.diag(1, -1)
Pn = sp.Matrix([kp, kp])
s_ = sp.symbols('s', real=True)
phase = lambda P, X: (P.T * eta * X)[0]
card("P17Dd", "[four nulls kept apart] spectral null P = (κ, κ): η(P, P) = 0 but ηP ≠ 0 (an indefinite null, not a kernel vector, as FB7d); the wave e^{−iη(P, X)} has constant phase along the event-plane null ray X = s(1, 1) (x = ct), itself null; P and X live in different planes (spectral vs event) and are related only through η. A Fourier zero coefficient (f̂(k) = 0, a zero relation) and a model-manifold null direction (Jv = 0, a kernel vector, Z9) are different objects again",
     phase(Pn, Pn) == 0 and eta * Pn != sp.zeros(2, 1) and sp.diff(phase(Pn, s_ * sp.Matrix([1, 1])), s_) == 0 and phase(sp.Matrix([1, 1]), sp.Matrix([1, 1])) == 0)

Lam = lambda f: sp.Matrix([[sp.cosh(f), -sp.sinh(f)], [-sp.sinh(f), sp.cosh(f)]])
P0 = sp.Matrix([sp.sqrt(k**2 + mu**2), k])
phi_rest = sp.atanh(k / sp.sqrt(k**2 + mu**2))
y_ = k / sp.sqrt(k**2 + mu**2)
ch_, sh_ = 1 / sp.sqrt(1 - y_**2), y_ / sp.sqrt(1 - y_**2)            # cosh, sinh of φ = artanh(y)
rest = (sp.Matrix([[ch_, -sh_], [-sh_, ch_]]) * P0).applyfunc(sp.simplify)
Pb = Lam(phi_r) * P0
card("P17De", "[massive level set] m > 0: q(P) = μ² > 0 (μ = mc/ħ) is a hyperbola with branches ω/c = ±√(k² + μ²); the boost Λ(φ) with tanh φ = ck/ω (= v_g/c) maps (ω/c, k) to the rest point (μ, 0); boosts preserve q and the branch (P₀′² = μ² + P₁′² ≥ μ² > 0 for every φ, so P₀′ never changes sign); the branch is asymptotic to the null cone (ω − c|k| = μ²c²/(ω + c|k|) → 0 as k → ∞) and tends to it as μ → 0 at fixed k",
     zero(qf(P0) - mu**2) and zero(rest[0] - mu) and zero(rest[1]) and zero(ch_**2 - sh_**2 - 1) and zero(sh_ / ch_ - c * k / wk) and zero(qf(Pb) - mu**2)
     and sp.limit(c * sp.sqrt(k**2 + mu**2) - c * k, k, oo) == 0 and zero(sp.limit(c * sp.sqrt(k**2 + mu**2), mu, 0) - c * sp.Abs(k))
     and zero((wk - c * k) * (wk + c * k) - mu**2 * c**2))

k1 = sp.Symbol('k_1')                                                  # complex: evanescent solutions allowed
ksol = sp.solve(sp.Eq((mu * c / 2 / c)**2 - k1**2, mu**2), k1)
card("P17Df", "[1 + 3 dimensions] (ω/c)² − |k|² = μ²: a two-sheeted hyperboloid (sheets ω ≥ μc and ω ≤ −μc); for |ω| < μc there is no real k (frequency gap): at ω = μc/2 the solutions are k = ±(√3/2)iμ (evanescent, e^{ikx} grows or decays); q = 0 is the double cone; q < 0 (one-sheeted hyperboloid) is not reached by any real m",
     set(ksol) == {sp.sqrt(3) * I_ * mu / 2, -sp.sqrt(3) * I_ * mu / 2} and zero(((mu * c) / c)**2 - 0 - mu**2))

vg = sp.diff(wk, k)
tau_rate = sp.sqrt(1 - vg**2 / c**2)
ph_rate = sp.simplify((wk - k * vg) / tau_rate)           # phase advance ωt − kx per unit proper time along x = v_g t
card("P17Dg", "[what m changes: one fact, four faces] for P on the upper branch: (i) the level q = μ²; (ii) a frequency gap, min_k ω = μc = mc²/ħ at k = 0 (none for m = 0, where ω = c|k| → 0); (iii) a rest frame exists (P timelike; P17De), whereas a null P is only rescaled by boosts (P17Dh); (iv) along the group worldline x = v_g t (v_g = c²k/ω) the phase ωt − kx advances at μc = mc²/ħ per unit proper time for EVERY k; for m = 0 the phase along x = ct is constant",
     sp.solve(sp.diff(wk, k), k) == [0] and zero(wk.subs(k, 0) - mu * c) and zero(vg - c**2 * k / wk) and zero(ph_rate - mu * c)
     and zero((c * k) * t - k * (c * t)))

card("P17Dh", "[null orbits and Doppler] the boost Λ(φ) maps the null vector (κ, κ) to e^{−φ}(κ, κ) and (κ, −κ) to e^{φ}(κ, −κ): null directions are eigenvectors, the factor e^{−φ} = √((1 − β)/(1 + β)) (tanh φ = β) is the relativistic Doppler factor; the cone minus the origin is four half-line orbits of SO⁺(1,1), and the origin is fixed. A massless mode is never brought to k = 0 with ω ≠ 0",
     zero((Lam(phi_r) * Pn - sp.exp(-phi_r) * Pn).applyfunc(lambda z: z.rewrite(sp.exp))) and zero((Lam(phi_r) * sp.Matrix([kp, -kp]) - sp.exp(phi_r) * sp.Matrix([kp, -kp])).applyfunc(lambda z: z.rewrite(sp.exp)))
     and zero(sp.exp(-sp.atanh(sp.Rational(3, 5)).rewrite(sp.log)) - sp.sqrt((1 - sp.Rational(3, 5)) / (1 + sp.Rational(3, 5)))))

J = sp.Matrix([[0, -1], [1, 0]])
K = sp.Matrix([[0, 1], [1, 0]])
r_ = sp.symbols('r', positive=True)
circ = (J * phi_r).exp() * sp.Matrix([r_, 0])
hyp = sp.Matrix([sp.cosh(phi_r), sp.sinh(phi_r)]) * mu
card("P17Di", "[mass as the orbit invariant: exact comparison with #14] SO(2) on (ℝ², I): JᵀI + IJ = 0, orbits are circles q_I = r²; SO⁺(1,1) on (spectral plane, η): Kᵀη + ηK = 0, the orbit through (μ, 0) is the branch q_η = μ². μ = mc/ħ plays the role r plays for circles (the label of the orbit / level), not the role of c (a form parameter, A8Wb). Not shared: q_I = 0 is {0}, while q_η = 0 contains (1, 1) ≠ 0; circles are compact and periodic, the branch is noncompact and free",
     J.T + J == sp.zeros(2) and K.T * eta + eta * K == sp.zeros(2) and zero(circ - r_ * sp.Matrix([sp.cos(phi_r), sp.sin(phi_r)])) and zero(circ[0]**2 + circ[1]**2 - r_**2)
     and zero(qf(hyp) - mu**2) and qf((1, 1)) == 0 and zero(((K * phi_r).exp() * sp.Matrix([mu, 0]) - hyp).applyfunc(lambda z: z.rewrite(sp.exp))))

# ══ E. Energy–momentum form: which parts are inputs ═══════════════════════════════════════════════════
E_, p_ = hbar * w, hbar * k
card("P17Ea", "[E = ħω, p = ħk as inputs] the map (ω/c, k) ↦ (E/c, p) = ħ(ω/c, k) is a linear scaling: q(ħP) = ħ²q(P), so q(P) = μ² with μ = mc/ħ ⟺ (E/c)² − p² = m²c² ⟺ E² = p²c² + m²c⁴ (algebra), and ħΛP = ΛħP for every boost Λ: levels, branches and orbits are the same geometry up to the scale ħ. The identifications themselves (Planck–Einstein, de Broglie) and μ = mc/ħ are physical inputs, not classical identities",
     zero(qf((E_ / c, p_)) - hbar**2 * qf((w / c, k))) and zero((qf((E_ / c, p_)) - m**2 * c**2) - hbar**2 * (qf((w / c, k)) - (m * c / hbar)**2))
     and zero(sp.expand((E_**2 - (p_**2 * c**2 + m**2 * c**4)) / c**2 - (qf((E_ / c, p_)) - m**2 * c**2)))
     and zero(Lam(phi_r) * (hbar * sp.Matrix([w / c, k])) - hbar * (Lam(phi_r) * sp.Matrix([w / c, k]))))

vv = sp.symbols('v', positive=True)
gam = 1 / sp.sqrt(1 - vv**2 / c**2)
wkm = wk.subs(mu, m * c / hbar)
card("P17Eb", "[derived under the identifications] group velocity = particle velocity: v_g = dω/dk = c²k/ω = pc²/E, and for p = γmv, E = γmc² this is v; the rest frequency is ω₀ = mc²/ħ ⟺ E₀ = mc². (de Broglie 1924–25; v_p·v_g = c² is FB8c.) These are consequences of the inputs, not evidence that mass is a wave",
     zero(sp.diff(wkm, k) - c**2 * k / wkm) and zero((gam * m * vv) * c**2 / (gam * m * c**2) - vv) and zero(wkm.subs(k, 0) - m * c**2 / hbar))

# ══ C. The #17 comparison: kinds of pairing, counterexamples P17-X2–X5, representation-theoretic origin ══
St, Sx, Stx = sp.diag(-1, 1), sp.diag(1, -1), -sp.eye(2)
upper = sp.Matrix([sp.sqrt(k**2 + mu**2), k])
card("P17Ca", "[kinds of pairing on the shell] the reflections S_t = diag(−1, 1), S_x = diag(1, −1) and S_tx = −I all preserve η (SᵀηS = η), hence every level set (sign symmetry of the relation); S_t and S_tx exchange the branches, S_x keeps them; −I has det +1 but is not in SO⁺(1,1) (it moves the upper branch to the lower). Only S_tx, together with complex conjugation of the amplitudes, is the reality pairing (P17Rc); boosts (orbit symmetry) keep the branch",
     all(Sm.T * eta * Sm == eta for Sm in (St, Sx, Stx)) and (St * upper)[0] == -upper[0] and (Stx * upper)[0] == -upper[0] and (Sx * upper)[0] == upper[0] and Stx.det() == 1)

card("P17Cb", "[P17-X2: a sign-paired relation that is not complex conjugacy] the dispersion relation is even in k, so (ω, k) and (ω, −k) both lie on it, yet it imposes no relation on the amplitudes there: e^{i(kx − ω_k t)} alone (amplitude 1 at k, 0 at −k) solves Lφ = 0, and the real field cos(kx − ωt) has a(k) = 1/2 with a(−k) = 0 (P17Rd). Left- and right-movers are independent states related by reflection, not conjugate partners",
     zero(L(pw0)) and zero(wk.subs(k, -k) - wk) and proj(cw, -kk_, -ww) == 0 and proj(cw, kk_, -ww) == sp.Rational(1, 2))

card("P17Cc", "[P17-X3: a massive dispersion relation with no null state] for μ > 0 no P on q(P) = μ² is null (q(P) = 0 would force μ = 0), so ω = ±ck never holds on the shell; P = 0 (the zero index) is not on the shell either: the constant field does not solve the μ > 0 equation (P17Dc)",
     sp.solve(sp.Eq(mu**2, 0), mu) == [] and qf((k, k)) == 0 and (mu**2).is_positive and not zero(L(sp.Integer(1))))

A1r, A1i, A2r, A2i, B1r, B1i, B2r, B2i = sp.symbols('A1r A1i A2r A2i B1r B1i B2r B2i', real=True)
cons = [B1r - A2r, B1i + A2i, B2r - A1r, B2i + A1i]
Mcons = sp.Matrix([[sp.diff(cc, vv_) for vv_ in (A1r, A1i, A2r, A2i, B1r, B1i, B2r, B2i)] for cc in cons])
card("P17Cd", "[P17-X4: paired variables that are not two independent entities] on the mode set {±k} the four complex amplitudes a(k), a(−k), b(k), b(−k) are 8 real numbers; reality imposes 4 independent real-linear conditions (rank 4), leaving 4: b is determined by a. The pair (a(k), b(−k)) is one real oscillation, not two physical entities; likewise X_k and X_{N−k} for a real signal (P17Fe)",
     Mcons.rank() == 4 and 8 - Mcons.rank() == 4)

Zan = [X8[0]] + [2 * X8[j] for j in (1, 2, 3)] + [X8[4]] + [0, 0, 0]
zan = [sp.nsimplify(sp.expand_complex(sum(Zan[j] * sp.exp(2 * sp.pi * I_ * j * n / 8) for j in range(8)) / 8)) for n in range(8)]
card("P17Ce", "[P17-X5: a pairing that disappears under another representation] the one-sided (analytic-signal) spectrum Z = (X₀, 2X₁, 2X₂, 2X₃, X₄, 0, 0, 0) has no negative-index entries, yet Re(IDFT Z) = x exactly (x ∈ ℚ⁸): the conjugate pair is absent and nothing is lost. In the real basis {cos, sin} a real oscillation is one coefficient; with the kernel e^{+iωt} the labels 'positive' and 'negative' frequency swap (x̂₊(ω) = x̂(−ω)). The pair (ω, −ω) belongs to the complex-exponential representation of a real signal, not to two physical things",
     [sp.simplify(sp.re(z)) for z in zan] == x8 and zero(sp.integrate(u * sp.exp(I_ * w * t), (t, -oo, oo), conds='none') - U.subs(w, -w)))

lam_ = sp.symbols('lambda', real=True)
z_ = sp.symbols('z')
Cz = lambda z: sp.conjugate(z)
chi = lambda P0_, P1_: sp.exp(-I_ * (P0_ * c * t - P1_ * x))                 # e^{−iη(P, X)}, X = (ct, x)
card("P17Cf", "[three meanings of 'conjugate' kept apart] (i) complex conjugation: an antilinear involution on coefficients (conj(iz) = −i conj z, conj conj z = z); (ii) Fourier duality: the bilinear, nondegenerate pairing η(P, X) (det η = −1 ≠ 0) whose character e^{−iη(P, X)} is multiplicative in X — Δt·Δω ≥ 1/2 (T5) belongs to this pairing; (iii) the canonical / symplectic pairing (CF6, FB9a). Master Map #17 begins with (i); the three are different operations",
     zero(Cz(I_ * (a_re + I_ * a_im)) + I_ * Cz(a_re + I_ * a_im)) and zero(Cz(Cz(a_re + I_ * a_im)) - (a_re + I_ * a_im)) and eta.det() == -1
     and zero(sp.expand(sp.exp(-I_ * phase(sp.Matrix([w / c, k]), sp.Matrix([c * (t + s_), x + lam_]))) - sp.exp(-I_ * phase(sp.Matrix([w / c, k]), sp.Matrix([c * t, x]))) * sp.exp(-I_ * phase(sp.Matrix([w / c, k]), sp.Matrix([c * s_, lam_]))))))

n_ = sp.symbols('n', integer=True)
Nn_ = sp.symbols('N', positive=True, integer=True)
card("P17Cg", "[representation-theoretic origin] for a unitary character χ of an abelian group, conj χ = χ⁻¹; so the Fourier coefficients of a real function satisfy f̂(χ⁻¹) = conj f̂(χ). Instances: ℝ (conj e^{iωt} = e^{−iωt}: ω ↦ −ω), ℤ_N (conj e^{2πikn/N} = e^{2πi(N−k)n/N}: k ↦ N − k), ℝ² with η (conj e^{−iη(P,X)} = e^{−iη(−P,X)}: P ↦ −P). The Fourier pairs of #12, the DFT pairs and the real-field pairing are one structure (Folland 1995, source-locked); it is the same theorem, not a new physical relation",
     zero(sp.conjugate(sp.exp(I_ * w * t)) - sp.exp(-I_ * w * t)) and zero(sp.simplify(sp.conjugate(sp.exp(2 * sp.pi * I_ * k * n_ / Nn_)) - sp.exp(2 * sp.pi * I_ * (Nn_ - k) * n_ / Nn_)))
     and zero(sp.conjugate(chi(w / c, k)) - chi(-w / c, -k)) and zero(sp.Abs(chi(w / c, k)) - 1))

tau = sp.symbols('tau', real=True)
card("P17Ch", "[MW-C tested] complex conjugation pairs P with −P and q(−P) = q(P): it maps the mass-m shell to itself (upper ↔ lower branch) and never relates m to (ω, k); m (as μ = √q(P)) is invariant under every boost and under P ↦ −P, so it is a label of the level, not a coordinate paired with (ω, k) — MW-C FAILS as complex conjugacy. What exists instead is a Fourier-duality reading: along the mode's group worldline the phase is e^{−i(mc²/ħ)τ} = χ_{−mc²/ħ}(τ), so mc²/ħ is dual to proper time τ (P17Dg; de Broglie's frequency) — a different sense of 'conjugate'",
     zero(qf((-w / c, -k)) - qf((w / c, k))) and zero(qf(Lam(phi_r) * sp.Matrix([w / c, k])) - qf((w / c, k)))
     and zero(ph_rate.subs(mu, m * c / hbar) - m * c**2 / hbar) and zero(sp.exp(-I_ * (m * c**2 / hbar) * tau) - sp.exp(I_ * (-m * c**2 / hbar) * tau)))

# ══ M. Boundary for MW-D: the same dispersion relation with no particle ═══════════════════════════════
rho, Tn, kap = sp.symbols('rho T kappa_s', positive=True)
string = lambda f: rho * sp.diff(f, t, 2) - Tn * sp.diff(f, x, 2) + kap * f       # string on an elastic foundation
card("P17Mx", "[MW-D boundary] a string on an elastic foundation, ρφ_tt = Tφ_xx − κφ (a classical continuum; Scott 1969 lists physical realizations of the Klein–Gordon form), has plane waves exactly when ω² = c²k² + μ²c² with c² = T/ρ and μ²c² = κ/ρ (μ = √(κ/T)): the same relation, the same level-set geometry and the same frequency gap, with a stiffness in place of mass and no particle. The dispersion relation alone therefore cannot establish MW-D",
     zero(string(pw) / pw - rho * (c**2 * k**2 + mu**2 * c**2 - w**2).subs({c: sp.sqrt(Tn / rho), mu: sp.sqrt(kap / Tn)})))
