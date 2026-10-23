"""O1: cards for the claims the "Orthogonality and Zero" prototype displays.
Thresholds were fixed before the first run and must not be moved after seeing results.
Run: python3 verify/verify_O1.py"""
import sympy as sp

ledger = []
def card(sid, claim, ok):
    ledger.append(bool(ok)); print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

zero = lambda M: M.applyfunc(sp.simplify) == sp.zeros(*M.shape)

# O1a  Rotations preserve the inner product: Rodrigues R about any unit axis satisfies R^T R = I,
#      so (Ru).(Rv) = u.v. This is why orbiting the camera, or turning both vectors, cannot change u.v.
al, be, th = sp.symbols('alpha beta theta', real=True)
n = sp.Matrix([sp.sin(al)*sp.cos(be), sp.sin(al)*sp.sin(be), sp.cos(al)])
K = sp.Matrix([[0, -n[2], n[1]], [n[2], 0, -n[0]], [-n[1], n[0], 0]])
R = sp.eye(3) + sp.sin(th)*K + (1 - sp.cos(th))*K*K
card("O1a", "Rodrigues rotation about any unit axis: R^T R = I, hence (Ru).(Rv) = u.v", zero(R.T*R - sp.eye(3)))

# O1b  A screen (orthographic projection) does not preserve angles, in either direction:
#      an orthogonal pair can appear at 120 deg, and a 60 deg pair can appear at 90 deg.
def proj_angle(u, v, nrm):
    nh = nrm / sp.sqrt(nrm.dot(nrm))
    pu, pv = u - u.dot(nh)*nh, v - v.dot(nh)*nh
    return sp.acos(sp.simplify(pu.dot(pv) / sp.sqrt(pu.dot(pu)*pv.dot(pv))))
e1, e2 = sp.Matrix([1, 0, 0]), sp.Matrix([0, 1, 0])
a, b = sp.Matrix([1, 0, 1]), sp.Matrix([0, 1, 1])
card("O1b", "orthogonal (1,0,0),(0,1,0) seen along (1,1,1) appear at 120 deg; (1,0,1),(0,1,1) at 60 deg appear at 90 deg from above",
     proj_angle(e1, e2, sp.Matrix([1, 1, 1])) == 2*sp.pi/3 and a.dot(b) == 1
     and sp.acos(sp.Rational(1, 2)) == sp.pi/3 and proj_angle(a, b, sp.Matrix([0, 0, 1])) == sp.pi/2)

# O1c  Discrete orthogonality: sampled waves are orthogonal vectors in R^N, exactly.
#      sum_{j<N} cos(2 pi m j/N) cos(2 pi n j/N) = (N/2) delta_mn for 1 <= m, n and m + n < N.
def discrete_ok(N):
    j = range(N)
    for m in range(1, N):
        for k in range(1, N):
            if m + k >= N:
                continue
            s = sp.nsimplify(sum(sp.cos(2*sp.pi*m*jj/N)*sp.cos(2*sp.pi*k*jj/N) for jj in j))
            if sp.simplify(s - (sp.Rational(N, 2) if m == k else 0)) != 0:
                return False
    return True
card("O1c", "sampled cosines on N = 8 and N = 12 points: sum cos(2pi m j/N)cos(2pi n j/N) = (N/2) delta_mn for m + n < N",
     discrete_ok(8) and discrete_ok(12))

# O1d  Off a full period, the scaled sample sum (L/N) sum f(t_j)g(t_j) (left endpoints) approaches the integral.
#      Fixed in advance: error at N = 1024 below 5e-3 and below 1/8 of the error at N = 64, for both cases.
import math
def left_sum(f, g, N, L):
    return (L / N) * sum(f(i*L/N) * g(i*L/N) for i in range(N))
cases = [
    (lambda t: math.cos(t), lambda t: math.cos(3*t), 4.1,
     0.5*(math.sin(-2*4.1)/-2 + math.sin(4*4.1)/4)),
    (lambda t: math.sin(2*t), lambda t: math.cos(t), 5.0,
     0.5*((1 - math.cos(3*5.0))/3 + (1 - math.cos(1*5.0))/1)),
]
ok = True
errs = []
for f, g, L, exact in cases:
    e64, e1024 = abs(left_sum(f, g, 64, L) - exact), abs(left_sum(f, g, 1024, L) - exact)
    errs.append((round(e64, 5), round(e1024, 6)))
    ok &= e1024 < 5e-3 and e1024 < e64 / 8
card("O1d", f"left Riemann sums approach the integral off-period: errors (N=64, N=1024) = {errs}", ok)

# O1e  The signature needs orthogonality: with unit e1 = (1,0), e2 = (cos t, sin t), the Parseval gap
#      a1^2 + a2^2 - |x|^2 (a_k = <x, e_k>) vanishes for every x only at t = pi/2, and so does reconstruction.
t, x1, x2 = sp.symbols('t x1 x2', real=True)
E1, E2 = sp.Matrix([1, 0]), sp.Matrix([sp.cos(t), sp.sin(t)])
X = sp.Matrix([x1, x2])
c1, c2 = X.dot(E1), X.dot(E2)
gap = sp.expand(c1**2 + c2**2 - X.dot(X))
recon = sp.expand(c1*E1 + c2*E2 - X)
gap_coeffs = sp.Poly(gap, x1, x2).coeffs()
rec_coeffs = [cf for comp in recon for cf in sp.Poly(comp, x1, x2).coeffs()]
sol_gap = set(sp.solveset(sp.Eq(gap_coeffs[0], 0), t, sp.Interval.open(0, sp.pi)))
gap_ok = sol_gap == {sp.pi/2} and all(sp.simplify(cf.subs(t, sp.pi/2)) == 0 for cf in gap_coeffs)
rec_ok = all(sp.simplify(cf.subs(t, sp.pi/2)) == 0 for cf in rec_coeffs) and any(sp.simplify(cf.subs(t, sp.pi/3)) != 0 for cf in rec_coeffs)
card("O1e", "with unit e1=(1,0), e2=(cos t, sin t): Parseval gap is 0 for all x only at t = pi/2; reconstruction exact there, not at t = pi/3",
     gap_ok and rec_ok)

print(f"\n{sum(ledger)}/{len(ledger)} checks passed")
