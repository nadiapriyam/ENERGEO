"""P1: the power spectrum (audit item R10). Exact symbolic checks; no numerical thresholds.
Supports Nadia's statement "Same power spectrum can preserve second-order information while failing to determine the
original signal." It says nothing about wavelets, scattering or DYADIC PACKETS (R11 stays OPEN).
Run: python3 verify/verify_P1.py"""
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

def dft(x):
    N = len(x)
    return [sp.expand(sum(x[n] * sp.exp(-2 * sp.pi * sp.I * k * n / N) for n in range(N))) for k in range(N)]

def power(x):
    return [sp.nsimplify(sp.simplify(sp.expand(X * sp.conjugate(X)))) for X in dft(x)]

N = 4
x = list(sp.symbols('x0:4', real=True))
r = [sum(x[n] * x[(n + m) % N] for n in range(N)) for m in range(N)]          # circular autocorrelation
R = dft(r)
card("P1a", "for every real x of length 4: |X_k|^2 is the DFT of the circular autocorrelation r_m = sum_n x_n x_(n+m) (Wiener-Khinchin), so the power spectrum carries exactly the second-order information",
     all(sp.simplify(sp.expand(X * sp.conjugate(X)) - Rk) == 0 for X, Rk in zip(dft(x), R)))

a = [1, 2, 0, 3, 0, 0]
shift = a[-1:] + a[:-1]
card("P1b", "a circular shift changes the signal but not one value of its power spectrum: (1,2,0,3,0,0) and (0,1,2,0,3,0)",
     shift != a and power(a) == power(shift))

# a pair not related by any circular shift, reversal or sign change
b = [1, 0, 0, 0, 1, 1, 0, 1]
c = [1, 0, 0, 1, 0, 0, 1, 1]
def relatives(s):
    out = set()
    for t in (s, s[::-1]):
        for k in range(len(t)):
            u = t[k:] + t[:k]
            out.add(tuple(u)); out.add(tuple(-v for v in u))
    return out
card("P1c", "(1,0,0,0,1,1,0,1) and (1,0,0,1,0,0,1,1) have the same power spectrum, yet neither is a shift, reversal or sign change of the other",
     tuple(c) not in relatives(b) and all(sp.simplify(p - q) == 0 for p, q in zip(power(b), power(c))))
