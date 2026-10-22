"""S6-S8: finding an orthonormal basis without visualizing it."""
import sympy as sp
x = sp.symbols('x', real=True)
ip = lambda f, g: sp.integrate(f*g, (x, -1, 1))

# S6  Gram-Schmidt on 1, x, x^2, x^3 (no picture needed) -> normalized Legendre polynomials
basis = []
for p in [1, x, x**2, x**3]:
    w = p - sum(ip(p, e)*e for e in basis)
    basis.append(sp.simplify(w / sp.sqrt(ip(w, w))))
ok = all(sp.simplify(basis[n] - sp.sqrt(sp.Rational(2*n+1, 2))*sp.legendre(n, x)) == 0 for n in range(4))
print("S6 ", "PASS" if ok else "FAIL", " Gram-Schmidt(1,x,x^2,x^3) = normalized Legendre P0..P3")
print("     ", [sp.nsimplify(b) for b in basis])

# S7  Bessel's inequality: partial sums of squared projections never exceed ||f||^2 (here f = x^4)
f = x**4
proj2 = [ip(f, e)**2 for e in basis]
running = [sum(proj2[:i+1]) for i in range(4)]
print("S7 ", "PASS" if all(r <= ip(f, f) for r in running) else "FAIL",
      " Bessel: sum_k <f,e_k>^2 <= ||f||^2  running =", [float(r) for r in running], " ||f||^2 =", float(ip(f, f)))

# S8  Self-adjoint operator -> eigenfunctions orthogonal. Legendre operator L = d/dx[(1-x^2) d/dx]
L = lambda u: sp.diff((1 - x**2)*sp.diff(u, x), x)
eig = all(sp.simplify(L(sp.legendre(n, x)) + n*(n+1)*sp.legendre(n, x)) == 0 for n in range(6))
sym = sp.simplify(ip(L(x**3), x**2 + x) - ip(x**3, L(x**2 + x))) == 0
print("S8 ", "PASS" if eig and sym else "FAIL", " L P_n = -n(n+1) P_n  and  <Lu,v> = <u,Lv>  (so eigenvectors are orthogonal)")
