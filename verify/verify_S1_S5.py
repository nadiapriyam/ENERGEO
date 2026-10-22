"""Step cards S1-S5: machine checks for the 'infinite x finite -> bounded representation' pattern.
Each check prints PASS/FAIL. Nothing here is accepted on narration alone."""
import sympy as sp

ledger = []
def card(sid, claim, ok):
    ledger.append((sid, claim, bool(ok)))
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

# S1  Orthogonality <=> Pythagoras; polarization recovers inner product from the quadratic
u = sp.Matrix(sp.symbols('u1:4', real=True)); v = sp.Matrix(sp.symbols('v1:4', real=True))
Q = lambda w: (w.T*w)[0]; ip = (u.T*v)[0]
card("S1a", "||u+v||^2 = ||u||^2 + ||v||^2 + 2<u,v>", sp.expand(Q(u+v) - Q(u) - Q(v) - 2*ip) == 0)
card("S1b", "polarization: <u,v> = (Q(u+v) - Q(u-v))/4", sp.expand((Q(u+v)-Q(u-v))/4 - ip) == 0)

# S2  Fourier modes are orthonormal on the circle; Parseval for a test function
t = sp.symbols('t', real=True)
e = lambda k: sp.exp(2*sp.pi*sp.I*k*t)
inner = lambda f, g: sp.integrate(f*sp.conjugate(g), (t, 0, 1))
ortho = all(sp.simplify(inner(e(j), e(k)) - (1 if j == k else 0)) == 0 for j in range(-3, 4) for k in range(-3, 4))
card("S2a", "<e_j, e_k> = delta_jk for j,k in -3..3", ortho)
f = 3 + 2*sp.cos(2*sp.pi*t) - sp.sin(6*sp.pi*t)
coeffs = [sp.simplify(inner(f, e(k))) for k in range(-4, 5)]
card("S2b", "Parseval: ||f||^2 = sum |f_hat(k)|^2", sp.simplify(inner(f, f) - sum(abs(c)**2 for c in coeffs)) == 0)

# S3  Each Fourier mode is an eigenvector of every shift (a character of the circle group)
k, tau = sp.symbols('k tau', real=True)
shifted = sp.exp(2*sp.pi*sp.I*k*(t - tau))
card("S3", "T_tau e_k = exp(-2 pi i k tau) e_k", sp.simplify(shifted / sp.exp(2*sp.pi*sp.I*k*t) - sp.exp(-2*sp.pi*sp.I*k*tau)) == 0)

# S4  General trichotomy (not just examples): any traceless 2x2 J satisfies J^2 = -det(J) I,
#     so exp(sJ) is cos/sin, cosh/sinh, or linear depending only on sign(det J).
a, b, c, s = sp.symbols('a b c s', real=True)
J = sp.Matrix([[a, b], [c, -a]])
card("S4a", "traceless J: J^2 = -det(J) * I  (Cayley-Hamilton)", sp.simplify(J*J + J.det()*sp.eye(2)) == sp.zeros(2))
Jr, Jb, Js = sp.Matrix([[0, -1], [1, 0]]), sp.Matrix([[0, 1], [1, 0]]), sp.Matrix([[0, 0], [1, 0]])
card("S4b", "J^2=-1: exp(sJ) = cos s I + sin s J", sp.simplify((s*Jr).exp() - (sp.cos(s)*sp.eye(2) + sp.sin(s)*Jr)) == sp.zeros(2))
card("S4c", "J^2=+1: exp(sJ) = cosh s I + sinh s J", ((s*Jb).exp() - (sp.cosh(s)*sp.eye(2) + sp.sinh(s)*Jb)).applyfunc(lambda z: sp.simplify(z.rewrite(sp.exp))) == sp.zeros(2))
card("S4d", "J^2= 0: exp(sJ) = I + s J", sp.simplify((s*Js).exp() - (sp.eye(2) + s*Js)) == sp.zeros(2))
G_e, G_m = sp.eye(2), sp.diag(1, -1)
inv = lambda M, G: (M.T*G*M - G).applyfunc(lambda z: sp.simplify(z.rewrite(sp.exp))) == sp.zeros(2)
card("S4e", "rotation preserves x^2+y^2 for all s", inv((s*Jr).exp(), G_e))
card("S4f", "boost preserves x^2-y^2 for all s", inv((s*Jb).exp(), G_m))

# S5  Unbounded rapidity -> bounded velocity; c -> infinity contracts Lorentz to Galilean
s1, s2 = sp.symbols('s1 s2', real=True)
card("S5a", "velocity addition: tanh(s1+s2) = (tanh s1 + tanh s2)/(1 + tanh s1 tanh s2)",
     sp.simplify((sp.tanh(s1+s2) - (sp.tanh(s1)+sp.tanh(s2))/(1+sp.tanh(s1)*sp.tanh(s2))).rewrite(sp.exp)) == 0)
card("S5b", "lim_{s->+-inf} tanh s = +-1 (bounded by c)", sp.limit(sp.tanh(s), s, sp.oo) == 1 and sp.limit(sp.tanh(s), s, -sp.oo) == -1)
vv, cc, x, tt = sp.symbols('v c x t', positive=True)
g = 1/sp.sqrt(1 - vv**2/cc**2)
xp, tp = g*(x - vv*tt), g*(tt - vv*x/cc**2)
card("S5c", "Lorentz preserves x^2 - c^2 t^2", sp.simplify(xp**2 - cc**2*tp**2 - (x**2 - cc**2*tt**2)) == 0)
card("S5d", "c -> inf: (x', t') -> (x - v t, t)  [Galilean]", sp.limit(xp, cc, sp.oo) == x - vv*tt and sp.limit(tp, cc, sp.oo) == tt)

print(f"\n{sum(ok for *_, ok in ledger)}/{len(ledger)} checks passed")
