"""P17L: final adversarial lock of Master Map #17 (2026-11-17). Corrections and missing proofs only; no new research branch.

Decisions: docs/restructure_decisions.md, "#17 final adversarial lock (2026-11-17)".
These cards do not edit or replace any ledger line. They check the corrected live statements:
  P17La  boost scope: proper orthochronous boosts preserve each mass-shell branch; the full Lorentz group does not.
  P17Lb  the proper-time phase rate, with every assumption explicit (free plane wave, one on-shell P, its own worldline, sign convention).
  P17Lc  the Fourier converse, discrete case: for every N, a Hermitian-symmetric DFT vector has a real inverse (exact, no theorem imported).
  P17Ld  the Fourier converse on finite Hermite expansions (exact, no uniqueness theorem imported).
  P17Le  the Fourier converse, continuous case under stated hypotheses: the algebraic core given the inversion theorem.
  P17Lf  lock correction of P17Ch: a phase rate set by a parameter does not make that parameter Fourier-conjugate to time.
  P17Lg  mass selects the level: the form q is the same for every m; m = 0 ⇒ q(P) = 0; m > 0 ⇒ q(P) = (mc/ħ)² > 0.
Conventions as in verify_P17.py: x̂(ω) = ∫x(t)e^{−iωt}dt; X_k = Σx_n e^{−2πikn/N}; η = diag(1, −1); P = (ω/c, k), X = (ct, x).
Run: python3 verify/verify_P17L.py"""
import sympy as sp


def card(sid, claim, ok):
    print(f"{sid:6} {'PASS' if ok else 'FAIL'}  {claim}")


def zero(e):
    if isinstance(e, sp.MatrixBase):
        return all(zero(z) for z in e)
    return sp.simplify(sp.expand(e)) == 0


I_, oo = sp.I, sp.oo
t, w, k, tau, s = sp.symbols('t omega k tau s', real=True)
c, mu, hbar, m = sp.symbols('c mu hbar m', positive=True)
phi = sp.symbols('phi', real=True)
eta = sp.diag(1, -1)
q = lambda P: (P.T * eta * P)[0]
Lam = lambda f: sp.Matrix([[sp.cosh(f), -sp.sinh(f)], [-sp.sinh(f), sp.cosh(f)]])

# ── P17La: boost scope ──────────────────────────────────────────────────────────────────────────────────
up = sp.Matrix([sp.sqrt(k**2 + mu**2), k])           # positive-energy branch (P₀ > 0)
dn = sp.Matrix([-sp.sqrt(k**2 + mu**2), k])          # negative-energy branch (P₀ < 0)
P0b = lambda P: sp.simplify((Lam(phi) * P)[0])
# P₀′ = cosh φ·P₀ − sinh φ·P₁ and |P₁| < |P₀| on a timelike level, so sign(P₀′) = sign(P₀) for every φ
St, Stx, Sx = sp.diag(-1, 1), -sp.eye(2), sp.diag(1, -1)
card("P17La", "[lock 1: boost scope] proper orthochronous boosts Λ(φ) ∈ SO⁺(1,1) preserve each mass-shell branch separately: P₀′ = cosh φ·P₀ − sinh φ·P₁ with |P₁| < |P₀| keeps the sign of P₀ for every φ (P₀′² = μ² + P₁′² > 0 and P₀′ is continuous in φ, P₀′(0) = P₀); Λ(φ) has det 1 and Λ₀₀ = cosh φ ≥ 1. The claim is NOT made for the full Lorentz group O(1,1): time reversal S_t = diag(−1, 1) and −I preserve η and q but exchange the branches; parity S_x keeps them",
     zero(q(Lam(phi) * up) - mu**2) and zero(q(Lam(phi) * dn) - mu**2) and zero((Lam(phi) * up)[0]**2 - mu**2 - (Lam(phi) * up)[1]**2)
     and zero(P0b(up).subs(phi, 0) - up[0]) and zero(P0b(dn).subs(phi, 0) - dn[0]) and zero(Lam(phi).det() - 1) and zero((sp.cosh(phi) - 1 - 2 * sp.sinh(phi / 2)**2).rewrite(sp.exp))
     and all(Sm.T * eta * Sm == eta for Sm in (St, Stx, Sx)) and (St * up)[0] == dn[0] and (Stx * up)[0] == dn[0] and (Sx * up)[0] == up[0]
     and all(sp.simplify((Lam(phi) * up)[0].subs(phi, v).subs({k: 3, mu: 4})) > 0 for v in (-5, -1, 0, 2, 7))
     and all(sp.simplify((Lam(phi) * dn)[0].subs(phi, v).subs({k: 3, mu: 4})) < 0 for v in (-5, -1, 0, 2, 7)))

# ── P17Lb: the proper-time phase rate, assumptions explicit ─────────────────────────────────────────────
X0 = sp.Matrix(sp.symbols('a0 a1', real=True))
P = up                                                # one on-shell momentum, positive-energy branch, μ = mc/ħ > 0
Xw = X0 + (c * tau / mu) * P                          # the worldline associated with the same on-shell P (its own four-velocity)
dX = sp.diff(Xw, tau)
ph = (P.T * eta * Xw)[0]                              # wave e^{−iη(P, X)} = e^{i(kx − ωt)}: phase −η(P, X)
U_lab = sp.Matrix([c, 0])                             # another worldline: the lab rest frame, X = (cτ, 0)
ph_lab = sp.diff((P.T * eta * U_lab * tau)[0], tau)
card("P17Lb", "[lock 3: proper-time phase, scoped] assumptions: (A1) a single free massive plane wave e^{−iη(P, X)} (no superposition); (A2) P on the shell q(P) = μ², μ = mc/ħ > 0, positive-energy branch; (A3) the straight worldline X(τ) = X₀ + (cτ/μ)P associated with the same on-shell P, for which η(dX/dτ, dX/dτ) = c², so τ is proper time; (A4) the sign convention e^{−iη(P, X)} (the opposite convention reverses the sign). Then the phase is η(P, X₀) + μcτ: it accumulates at the invariant rate μc = mc²/ħ. On another worldline the rate differs: in the lab frame it is ω = c√(k² + μ²), equal to mc²/ħ only at k = 0",
     zero(q(dX) - c**2) and zero(sp.diff(ph, tau) - mu * c) and zero((mu * c).subs(mu, m * c / hbar) - m * c**2 / hbar)
     and zero(ph_lab - c * sp.sqrt(k**2 + mu**2)) and not zero(ph_lab - mu * c) and zero((ph_lab - mu * c).subs(k, 0)))

# ── P17Lc: Fourier converse, discrete, every N ──────────────────────────────────────────────────────────
Nn = sp.symbols('N', positive=True, integer=True)
j = sp.symbols('j', integer=True)
r = sp.exp(-2 * sp.pi * I_ * j / Nn)
geo = (r**Nn - 1) / (r - 1)                           # Σ_{n=0}^{N−1} r^n for r ≠ 1, i.e. j ≢ 0 (mod N)


def converse_ok(N):
    """generic Hermitian-symmetric X ∈ ℂ^N (free real parameters) → x = F⁻¹X is real, identically in the parameters"""
    X = [None] * N
    syms = []
    for kk in range(N):
        mk = (-kk) % N
        if kk < mk:
            a_, b_ = sp.symbols(f'a{kk} b{kk}', real=True)
            X[kk], X[mk] = a_ + I_ * b_, a_ - I_ * b_
        elif kk == mk:
            X[kk] = sp.Symbol(f'a{kk}', real=True)       # self-paired index (0, and N/2 for even N): a real coefficient
    xs = [sum(X[kk] * sp.exp(2 * sp.pi * I_ * kk * n / N) for kk in range(N)) / N for n in range(N)]
    return all(sp.simplify(sp.im(sp.expand_complex(v))) == 0 for v in xs)


Fm = lambda N: sp.Matrix(N, N, lambda a, b: sp.exp(-2 * sp.pi * I_ * a * b / N))
card("P17Lc", "[lock 5: Fourier converse, discrete — exact, no theorem imported] the DFT matrix satisfies F F* = N·I for every N (the off-diagonal entries are Σ_{n<N} r^n with r = e^{−2πij/N} ≠ 1 and r^N = 1, so they vanish), hence F is invertible; for every Hermitian-symmetric X (X_{−k} = conj X_k, X₀ and X_{N/2} real) the inverse x = F⁻¹X is real, checked identically in free real parameters for N = 1, …, 10. So for finite signals: X_{N−k} = conj X_k for all k ⟺ x real",
     zero(geo.subs(r**Nn, 1).subs(sp.exp(-2 * sp.pi * I_ * j), 1)) and zero(sp.simplify(r**Nn).subs(sp.exp(-2 * sp.pi * I_ * j), 1) - 1)
     and all(zero((Fm(N) * Fm(N).H - N * sp.eye(N)).applyfunc(sp.expand_complex)) for N in (2, 3, 4, 5, 6, 8)) and all(converse_ok(N) for N in range(1, 11)))

# ── P17Ld: Fourier converse on finite Hermite expansions ────────────────────────────────────────────────
def ft(f):
    return sp.simplify(sp.integrate(f * sp.exp(-I_ * w * t), (t, -oo, oo), conds='none'))


h = [sp.hermite(n, t) * sp.exp(-t**2 / 2) for n in range(6)]
hw = [hn.subs(t, w) for hn in h]
eig_ok = all(zero(ft(h[n]) - sp.sqrt(2 * sp.pi) * (-I_)**n * hw[n]) for n in range(6))
cr = sp.symbols('p0:6', real=True)
ci = sp.symbols('q0:6', real=True)
xh = sum((cr[n] + I_ * ci[n]) * h[n] for n in range(6))
Xh = sum((cr[n] + I_ * ci[n]) * sp.sqrt(2 * sp.pi) * (-I_)**n * hw[n] for n in range(6))
defect = sp.expand(Xh.subs(w, -w) - sp.conjugate(Xh))
# coefficient of each h_n in the defect: by linear independence of h_0 … h_5 the defect vanishes iff every coefficient does
coef = [sp.simplify(sp.integrate(sp.expand(defect * hw[n]), (w, -oo, oo)) / sp.integrate(hw[n]**2, (w, -oo, oo))) for n in range(6)]
card("P17Ld", "[lock 5: Fourier converse on finite Hermite expansions — exact, no uniqueness theorem imported] the Hermite functions h_n = H_n(t)e^{−t²/2} satisfy ĥ_n = √(2π)(−i)ⁿh_n (n ≤ 5, project convention); for x = Σ_{n≤5} c_n h_n with complex c_n, the defect x̂(−ω) − conj x̂(ω) has h_n-coefficient 2i·√(2π)·iⁿ·Im c_n (projection with the orthogonal h_n); so Hermitian symmetry ⟺ every c_n real ⟺ x real",
     eig_ok and all(zero(coef[n] - 2 * I_ * sp.sqrt(2 * sp.pi) * I_**n * ci[n]) for n in range(6)) and zero(sp.im(sp.expand_complex(xh.subs({ci[n]: 0 for n in range(6)})))))

# ── P17Le: continuous converse under stated hypotheses ──────────────────────────────────────────────────
a, b = sp.Function('a', real=True), sp.Function('b', real=True)
A = a(w) + a(-w)                                      # a generic even real function
B = b(w) - b(-w)                                      # a generic odd real function
im_integrand = A * sp.sin(w * t) + B * sp.cos(w * t)  # Im[(A + iB)e^{iωt}]
re_integrand = A * sp.cos(w * t) - B * sp.sin(w * t)
xs_ = (1 + t) * sp.exp(-t**2 / 2) + I_ * t * sp.exp(-t**2)
y_ = sp.conjugate(xs_)
card("P17Le", "[lock 5: Fourier converse, continuous, under stated hypotheses] hypotheses (H): x ∈ L¹(ℝ) continuous and x̂ ∈ L¹(ℝ), so that the inversion theorem gives x(t) = (1/2π)∫x̂(ω)e^{iωt}dω for every t (source theorem, read and quoted in the record). Hermitian symmetry means Re x̂ = A even and Im x̂ = B odd; then Im[(A + iB)e^{iωt}] = A sin ωt + B cos ωt is odd in ω (checked for generic even A, odd B), so its integral over ℝ is 0 and x(t) is real. Equivalent form: with y = conj x, ŷ(ω) = conj x̂(−ω), so Hermitian symmetry is ŷ = x̂, and uniqueness gives y = x",
     zero(im_integrand.subs(w, -w) + im_integrand) and zero(re_integrand.subs(w, -w) - re_integrand)
     and zero(ft(y_) - sp.conjugate(ft(xs_).subs(w, -w))))

# ── P17Lf: lock correction of P17Ch ─────────────────────────────────────────────────────────────────────
rho, Tn, kap, x_ = sp.symbols('rho T kappa_s x', positive=True)
Omega0 = sp.sqrt(kap / rho)
string_mode = sp.exp(-I_ * Omega0 * t)                # the k = 0 mode of ρφ_tt = Tφ_xx − κφ
res = rho * sp.diff(string_mode, t, 2) - Tn * sp.diff(string_mode, x_, 2) + kap * string_mode
card("P17Lf", "[lock 4: correction of P17Ch's last clause] what P17Dg / P17Lb establish is a proper-time phase rate, ω_C = mc²/ħ, with phase e^{−imc²τ/ħ} along the worldline of the same on-shell momentum. That alone does NOT establish that mass and proper time are Fourier-conjugate variables: the same structure — a parameter setting the phase rate of a single mode — occurs in the elastic-foundation string, whose k = 0 mode e^{−i√(κ/ρ)t} solves ρφ_tt = Tφ_xx − κφ; the same inference would make the stiffness κ a variable conjugate to time, which nothing in the string supports. P17Ch's checks (conjugation invariance, the phase form) stand; its wording 'mc²/ħ is dual to proper time' is withdrawn",
     zero(res) and zero(sp.diff(string_mode, t) / string_mode + I_ * Omega0) and zero(sp.diff(sp.exp(-I_ * (m * c**2 / hbar) * tau), tau) / sp.exp(-I_ * (m * c**2 / hbar) * tau) + I_ * m * c**2 / hbar))

# ── P17Lg: mass selects the level; the form is the same for every m ─────────────────────────────────────
Pg = sp.Matrix([w / c, k])
lvl = lambda mm: (mm * c / hbar)**2
card("P17Lg", "[lock 2: mass selects the level] the quadratic form q(P) = (ω/c)² − k² does not depend on m (∂q/∂m = 0); the dispersion relation is q(P) = (mc/ħ)². m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level). The same SO⁺(1,1) acts on every level; m labels which invariant level, it does not change the geometry. The spectral null q(P) = 0 lives in the (ω/c, k) plane and is kept distinct from the spacetime null η(X, X) = 0 and from every other zero / null of the project",
     sp.diff(q(Pg), m) == 0 and lvl(0) == 0 and (lvl(m)).is_positive and zero(q(Lam(phi) * Pg) - q(Pg)))
