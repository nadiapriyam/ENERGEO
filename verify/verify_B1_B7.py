"""Symbolic verification cards for blocks 1–7.

Each card states a claim, checks it exactly with SymPy, and records what the visual draws from it.
The app reads verify/cards/blocks_1_7.json and shows each card next to its live numeric check;
a visual never claims more than its card's verdict.

Run:  python3 verify/verify_B1_B7.py
"""

import json
import pathlib
import sys

import sympy as sp

CARDS = []


def card(sid, block, claim, figure, verifier, check):
    ok = bool(check())
    CARDS.append({
        "id": sid,
        "block": block,
        "claim": claim,
        "figure": figure,
        "check": {"verifier": verifier, "metric": "symbolic residual", "tolerance": "exact", "verdict": "PASS" if ok else "FAIL"},
    })
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")
    return ok


def is_zero(expr):
    return sp.simplify(expr) == 0


def mat_is_zero(M):
    return all(is_zero(e) for e in M)


# ── Block 1 ───────────────────────────────────────────────────────────────────────────────────────
a, b, c, s = sp.symbols("a b c s", real=True)
M = sp.Matrix([[a, b], [b, c]])
K = sp.Matrix([[0, -1], [1, 0]])
d = M.det()

card("B1a", 1, "Any J = M⁻¹K with K antisymmetric satisfies JᵀM + MJ = 0",
     "The tangent to every orbit is J·x; the group it generates preserves Q.",
     "sympy.simplify on 2×2 symbolic symmetric M",
     lambda: mat_is_zero((M.inv() * K).T * M + M * (M.inv() * K)))


def preserves(sign):
    # Substitute c so that det M has the requested sign: c = (b² + sign·e²)/a with e > 0, a > 0.
    e, ap = sp.symbols("e a_p", positive=True)
    Ms = M.subs({a: ap, c: (b**2 + sign * e**2) / ap})
    J = sign * e * Ms.inv() * K          # √|det M| = e
    J2 = sp.simplify(J * J)
    if sign > 0:
        A = sp.cos(s) * sp.eye(2) + sp.sin(s) * J
        j_ok = mat_is_zero(J2 + sp.eye(2))
    else:
        A = sp.cosh(s) * sp.eye(2) + sp.sinh(s) * J
        j_ok = mat_is_zero(J2 - sp.eye(2))
    return j_ok and mat_is_zero(A.T * Ms * A - Ms)


card("B1b", 1, "Elliptic case (det M > 0): A(s) = cos s·I + sin s·J has AᵀMA = M",
     "Orbits are the ellipses Q = const, closing after s = 2π; in 3D they are horizontal rings on the bowl z = Q.",
     "sympy.simplify, symbolic a, b, e with det M = e² > 0", lambda: preserves(+1))

card("B1c", 1, "Hyperbolic case (det M < 0): A(s) = cosh s·I + sinh s·J has AᵀMA = M",
     "Orbits are hyperbola branches Q = const on the saddle z = Q; they never close.",
     "sympy.simplify, symbolic a, b, e with det M = −e² < 0", lambda: preserves(-1))

eta = sp.diag(1, -1)
card("B1d", 1, "Null vectors are η-orthogonal to themselves: (1,1)ᵀη(1,1) = 0",
     "On the saddle, the null lines sit at height 0 — a vector lying on its own orthogonal line.",
     "exact arithmetic", lambda: (sp.Matrix([1, 1]).T * eta * sp.Matrix([1, 1]))[0] == 0)

# ── Block 2 ───────────────────────────────────────────────────────────────────────────────────────
g = sp.symbols("g11 g12 g13 g22 g23 g33", real=True)
G = sp.Matrix([[g[0], g[1], g[2]], [g[1], g[3], g[4]], [g[2], g[4], g[5]]])
u = sp.Matrix(sp.symbols("u1:4", real=True))
v = sp.Matrix(sp.symbols("v1:4", real=True))
x = sp.Matrix(sp.symbols("x1:4", real=True))

card("B2a", 2, "Residual of the G-projection is G-orthogonal: uᵀG(v − (uᵀGv / uᵀGu)u) = 0",
     "The drop line from v to the u-axis lands in the G-orthogonal plane, not the visually perpendicular one.",
     "sympy.simplify, symbolic symmetric 3×3 G",
     lambda: is_zero((u.T * G * (v - ((u.T * G * v)[0] / (u.T * G * u)[0]) * u))[0]))

card("B2b", 2, "∇(xᵀGx) = 2Gx, so the tangent plane of the unit ball at û has normal Gu",
     "The G-orthogonal plane of u is drawn parallel to the ellipsoid's tangent plane where u pierces it.",
     "sympy gradient", lambda: mat_is_zero(sp.Matrix([sp.diff((x.T * G * x)[0], xi) for xi in x]) - 2 * G * x))

# ── Block 3 ───────────────────────────────────────────────────────────────────────────────────────
t, L = sp.symbols("t L", positive=True)


def gram_full_period(N):
    basis = [sp.cos(k * t) for k in range(1, N + 1)] + [sp.sin(k * t) for k in range(1, N + 1)]
    Gm = sp.Matrix(len(basis), len(basis), lambda i, j: sp.integrate(basis[i] * basis[j], (t, 0, 2 * sp.pi)))
    return mat_is_zero(Gm - sp.pi * sp.eye(len(basis)))


card("B3a", 3, "Over one period [0, 2π], {cos kt, sin kt}ₖ₌₁³ has Gram matrix π·I",
     "The Gram heatmap shows a clean diagonal at L = T; off-diagonal cells light up as L drifts from T.",
     "sympy.integrate, exact", lambda: gram_full_period(3))

card("B3b", 3, "Closed form used live: ∫₀ᴸ cos t·cos 3t dt = ½(sin 2L/2 + sin 4L/4)",
     "Each Gram cell in the app is this formula, not a numerical approximation.",
     "sympy.integrate vs closed form",
     lambda: is_zero(sp.integrate(sp.cos(t) * sp.cos(3 * t), (t, 0, L)) - sp.Rational(1, 2) * (sp.sin(2 * L) / 2 + sp.sin(4 * L) / 4)))

# ── Block 4 ───────────────────────────────────────────────────────────────────────────────────────
A = sp.symbols("a1:4", real=True)
B = sp.symbols("b1:4", real=True)
xs = sum(A[k] * sp.cos((k + 1) * t) + B[k] * sp.sin((k + 1) * t) for k in range(3))
card("B4a", 4, "Parseval for a 3-harmonic trig sum: ∫₀^{2π} x² dt = π Σ(aₖ² + bₖ²)",
     "The time-domain energy bar and the coefficient-sphere radius² are the same number.",
     "sympy.integrate, symbolic coefficients",
     lambda: is_zero(sp.integrate(sp.expand(xs**2), (t, 0, 2 * sp.pi)) - sp.pi * sum(A[k]**2 + B[k]**2 for k in range(3))))

p1, p2 = sp.symbols("p1 p2", real=True)
f1 = p1 * sp.cos(t)
f2 = p2 * sp.cos(2 * t)
n2 = lambda f: sp.integrate(f * f, (t, 0, L))
ip_ = lambda f, h: sp.integrate(f * h, (t, 0, L))
card("B4b", 4, "On any interval: ‖x₁+x₂‖² = ‖x₁‖² + ‖x₂‖² + 2⟨x₁,x₂⟩; the cross term is 0 at L = 2π",
     "The parallelepiped of parts is square-cornered exactly when the cross terms vanish.",
     "sympy.integrate, symbolic L",
     lambda: is_zero(n2(f1 + f2) - n2(f1) - n2(f2) - 2 * ip_(f1, f2)) and is_zero(ip_(f1, f2).subs(L, 2 * sp.pi)))

# ── Block 5 ───────────────────────────────────────────────────────────────────────────────────────
T, tau, w, phi = sp.symbols("T tau omega phi", positive=True)


# B5a — the ORIGINAL check, kept as it first ran on 2026-10-22. It FAILS: sympy.limit returns
# AccumBounds(-1, 1) for the sin(2Tω)/T terms instead of 0. Kept on the ledger, not rewritten (Gate 3 rule).
def time_average_original():
    avg = sp.limit(sp.integrate(sp.expand_trig(sp.cos(w * t + phi) * sp.cos(w * (t + tau) + phi)), (t, -T, T)) / (2 * T), T, sp.oo)
    return is_zero(avg - sp.cos(w * tau) / 2)


card("B5a", 5, "Time-average ⟨cos(ωt+φ), cos(ω(t+τ)+φ)⟩ = ½cos ωτ, independent of φ",
     "The defect landscape is computed from amplitudes only; changing phases leaves it unchanged.",
     "sympy.integrate + sympy.limit T → ∞", time_average_original)


# B5a2 — added after B5a FAILED: same claim, with the limit argument made explicit.
def time_average_card():
    # sympy.limit returns AccumBounds on sin(2Tω)/T, so the argument is made explicit:
    # (i) product-to-sum splits the integrand into ½cos ωτ (constant) + ½cos(2ωt + ωτ + 2φ);
    # (ii) the oscillating part integrates to a difference of sines over 2ω, so |·| ≤ 1/ω;
    # (iii) a quantity bounded by 1/ω divided by 2T → 0, leaving ½cos ωτ, with no φ.
    lhs = sp.cos(w * t + phi) * sp.cos(w * (t + tau) + phi)
    const, osc = sp.cos(w * tau) / 2, sp.cos(2 * w * t + w * tau + 2 * phi) / 2
    split_ok = is_zero(sp.expand_trig(lhs - const - osc))
    osc_int = sp.integrate(osc, (t, -T, T))
    c0 = w * tau + 2 * phi
    bounded_ok = is_zero(osc_int - (sp.sin(2 * T * w + c0) - sp.sin(-2 * T * w + c0)) / (4 * w))
    vanish_ok = sp.limit((1 / w) / (2 * T), T, sp.oo) == 0
    const_ok = is_zero(sp.integrate(const, (t, -T, T)) / (2 * T) - sp.cos(w * tau) / 2)
    return split_ok and bounded_ok and vanish_ok and const_ok and phi not in const.free_symbols


card("B5a2", 5, "[added after B5a FAILED] time-average ⟨cos(ωt+φ), cos(ω(t+τ)+φ)⟩ = ½cos ωτ, independent of φ",
     "The defect landscape is computed from amplitudes only; changing phases leaves it unchanged.",
     "product-to-sum identity + bound |∫osc| ≤ 1/ω, then limit T → ∞", time_average_card)

nx, ux = sp.symbols("n_x u_x", real=True)
card("B5b", 5, "For unitary U: ‖x − Ux‖² / 2‖x‖² = 1 − ⟨x,Ux⟩/‖x‖²",
     "The defect curve is the autocorrelation curve flipped: valleys of D are peaks of ρ.",
     "expansion with ‖Ux‖ = ‖x‖",
     lambda: is_zero((nx + nx - 2 * ux) / (2 * nx) - (1 - ux / nx)))

pq = [(3, 2), (5, 3), (7, 4)]
card("B5c", 5, "r = p/q ⇒ D(2πq) = 0 exactly (a true symmetry of the shifted signal)",
     "Rational ridges of the landscape touch zero at τ = 2πq; irrational ones never do.",
     "exact trig evaluation",
     lambda: all(sp.simplify(1 - (sp.cos(2 * sp.pi * q) + sp.cos(sp.Rational(p, q) * 2 * sp.pi * q)) / 2) == 0 for p, q in pq))

# ── Block 6 ───────────────────────────────────────────────────────────────────────────────────────
import itertools


def signed_perms():
    out = []
    for perm in itertools.permutations(range(3)):
        for signs in itertools.product([1, -1], repeat=3):
            out.append(sp.Matrix(3, 3, lambda i, j: signs[i] if j == perm[i] else 0))
    return out


O = [m for m in signed_perms() if m.det() == 1]


def closure(Gs):
    keys = {tuple(m) for m in Gs}
    return all(tuple(a_ * b_) in keys for a_ in Gs for b_ in Gs)


def orbit_stab(Gs, pt):
    p = sp.Matrix(pt)
    orb = {tuple(m * p) for m in Gs}
    stab = [m for m in Gs if m * p == p]
    return len(orb), len(stab)


card("B6a", 6, "The 24 signed permutation matrices with det +1 form a group (closed under products)",
     "Every animated rotation in the panel is one of these 24, played as a turn about its axis.",
     "exact integer matrices", lambda: len(O) == 24 and closure(O))

expected = {(5, 3, 1): (24, 1), (1, 1, 0): (12, 2), (1, 1, 1): (8, 3), (0, 0, 1): (6, 4)}
card("B6b", 6, "|orbit|·|stab| = 24: generic 24·1, edge 12·2, vertex 8·3, face 6·4",
     "Dragging the point onto a symmetry axis merges orbit points and grows the stabilizer.",
     "exact orbit enumeration", lambda: all(orbit_stab(O, k) == v for k, v in expected.items()))

# ── Block 7 ───────────────────────────────────────────────────────────────────────────────────────
S = sp.Matrix([[0, 0, 1], [1, 0, 0], [0, 1, 0]])
P = (sp.eye(3) + S + S * S) / 3
n_ = sp.Matrix([1, 1, 1]) / sp.sqrt(3)
th = 2 * sp.pi / 3
Kx = sp.Matrix([[0, -n_[2], n_[1]], [n_[2], 0, -n_[0]], [-n_[1], n_[0], 0]])
R = sp.eye(3) + sp.sin(th) * Kx + (1 - sp.cos(th)) * Kx * Kx

card("B7a", 7, "The cyclic shift (x₁,x₂,x₃) ↦ (x₃,x₁,x₂) equals the 120° rotation about (1,1,1)",
     "Shifting the signal is drawn as turning the point about the diagonal; the orbit is an equilateral triangle.",
     "Rodrigues formula, exact", lambda: mat_is_zero(R - S))

card("B7b", 7, "P = (I + S + S²)/3 is the orthogonal projector onto span(1,1,1): P² = P, Pᵀ = P",
     "The orbit's centroid sits on the diagonal; the residual lies in the plane x₁+x₂+x₃ = 0.",
     "exact arithmetic",
     lambda: mat_is_zero(P * P - P) and mat_is_zero(P.T - P) and mat_is_zero(P - sp.ones(3, 3) / 3))

# ── write ─────────────────────────────────────────────────────────────────────────────────────────
out = pathlib.Path(__file__).resolve().parent / "cards" / "blocks_1_7.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps({"generator": "verify/run_all.py", "sympy": sp.__version__, "cards": CARDS}, ensure_ascii=False, indent=2))
failed = [c_ for c_ in CARDS if c_["check"]["verdict"] != "PASS"]
print(f"\n{len(CARDS) - len(failed)}/{len(CARDS)} cards PASS → {out}")
sys.exit(0)  # FAILs are recorded, not fatal: the ledger keeps them
