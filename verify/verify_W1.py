"""W1: the measurement branch (B-JOINT-ALTERNATIVES). A known two-path reference model, then one exact instance
inside the project's own stage 2b system. Interaction / which-path information only; no claim about observers.
Exact symbolic checks. Run: python3 verify/verify_W1.py"""
import sympy as sp
from sympy.physics.quantum import TensorProduct as K

def card(sid, claim, ok):
    print(f"{sid:4} {'PASS' if ok else 'FAIL'}  {claim}")

pa, pb = sp.symbols('psi_a psi_b')                             # path amplitudes at one screen point
th = sp.symbols('theta', real=True)
ma = sp.Matrix([1, 0]); mb = sp.Matrix([sp.cos(th), sp.sin(th)])   # marker states, <m_a|m_b> = cos theta
amp = (ma * pa + mb * pb) / sp.sqrt(2)                          # (|m_a> psi_a + |m_b> psi_b)/sqrt2
prob = sp.expand((amp.H * amp)[0])
target = (pa * sp.conjugate(pa) + pb * sp.conjugate(pb)) / 2 + (sp.conjugate(pa) * pb + pa * sp.conjugate(pb)) / 2 * sp.cos(th)
card("W1a", "two paths with which-path markers: intensity = (|psi_a|^2 + |psi_b|^2)/2 + Re(conj(psi_a) psi_b) <m_a|m_b>; the cross term (the relation that exists only while both alternatives are represented together) is weighted by the marker overlap",
     sp.simplify(prob - target) == 0)
card("W1b", "full which-path information (orthogonal markers, theta = pi/2) makes the cross term exactly zero: intensity = (|psi_a|^2 + |psi_b|^2)/2",
     sp.simplify(prob.subs(th, sp.pi / 2) - (pa * sp.conjugate(pa) + pb * sp.conjugate(pb)) / 2) == 0)
V = sp.Abs(sp.cos(th)); Dd = sp.sqrt(1 - sp.cos(th)**2)
card("W1c", "for equal-weight paths and pure markers, visibility V = |<m_a|m_b>| and distinguishability D = sqrt(1 - |<m_a|m_b>|^2) satisfy V^2 + D^2 = 1: gaining which-path information is losing the joint (interference) relation",
     sp.simplify(V**2 + Dd**2 - 1) == 0)

hb = sp.symbols('hbar', positive=True)
up, dn = sp.Matrix([1, 0]), sp.Matrix([0, 1])
ud, du = K(up, dn), K(dn, up)
A = (ud + du) / sp.sqrt(2); B = (ud - du) / sp.sqrt(2)
sz = sp.Matrix([[1, 0], [0, -1]]); I2 = sp.eye(2)
Sz = hb / 2 * (K(sz, I2) + K(I2, sz))
rho = ud * ud.H
Ps = B * B.H; Pt = sp.eye(4) - Ps
rho2 = Pt * rho * Pt + Ps * rho * Ps                            # S^2 measured, outcome not selected
card("W1d", "inside the project (stage 2b): |ud> = (A + B)/sqrt2 has coherence <A|rho|B> = 1/2; measuring S^2 (outcome not selected) gives rho' with <A|rho'|B> = 0, while S_z rho' = 0: the defining zero is preserved, the joint relation between the alternatives A and B is destroyed",
     sp.simplify((A.H * rho * B)[0] - sp.Rational(1, 2)) == 0 and sp.simplify((A.H * rho2 * B)[0]) == 0
     and sp.simplify(Sz * rho2) == sp.zeros(4, 4) and sp.simplify(rho2 - rho) != sp.zeros(4, 4))
