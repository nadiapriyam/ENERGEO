"""G: the compass circle and the seed "0 is orthogonal" (backbone clarification, 2026-11-11).
Established pieces only. These cards do not test B-ORTHO-FORM (organized orthogonality and global rules), which stays
a HYPOTHESIS. Exact symbolic checks; no numerical thresholds.
Run: python3 verify/verify_G1.py"""
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

v = sp.Matrix(sp.symbols('v1:4', real=True))
M = sp.Matrix(3, 3, sp.symbols('m1:10', real=True))
z = sp.zeros(3, 1)
card("G0a", "reading A of '0 is orthogonal': <0, v> = 0 and <v, 0> = 0 for every v in R^3, for the dot product and for every bilinear form x^T M y (symbolic M)",
     (z.T * v)[0] == 0 and (z.T * M * v)[0] == 0 and (v.T * M * z)[0] == 0)

r = sp.symbols('r', positive=True)
th = sp.symbols('theta', real=True)
x = sp.Matrix([r * sp.cos(th), r * sp.sin(th)])
dx = x.diff(th)
card("G1a", "compass circle x(theta) = r(cos theta, sin theta): x'(theta) = r(-sin theta, cos theta) and x(theta) . x'(theta) = 0 for every theta (radius perpendicular to tangent)",
     sp.simplify(dx - sp.Matrix([-r * sp.sin(th), r * sp.cos(th)])) == sp.zeros(2, 1) and sp.simplify(x.dot(dx)) == 0)

a, b = sp.Function('a'), sp.Function('b')
t = sp.symbols('t', real=True)
y = sp.Matrix([a(t), b(t)])
card("G1b", "for every differentiable plane curve y(t): d/dt |y|^2 = 2 y . y'; so on an interval the distance to the origin stays fixed exactly when radius is perpendicular to tangent all along it (a function is constant on an interval iff its derivative vanishes there)",
     sp.simplify((y.dot(y)).diff(t) - 2 * y.dot(y.diff(t))) == 0)

card("G1c", "the compass trace closes: x(theta + 2 pi) = x(theta) for every theta, while theta itself runs over all of R",
     sp.simplify(x.subs(th, th + 2 * sp.pi) - x) == sp.zeros(2, 1))
