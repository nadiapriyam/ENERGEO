"""FS1: four labelled spin-1/2 subsystems, BLIND part. Reads only research/constructions/fourspin_targets.json
(amplitudes). Computes the preregistered descriptors D1-D4 and checks the preregistered predictions P1 and P2.
No S^2 is computed here (see research/constructions/fourspin_mass_protocol.md).
Run: python3 verify/verify_FS1.py"""
import itertools, json, pathlib
import sympy as sp
from sympy.physics.quantum import TensorProduct as K

def card(sid, claim, ok):
    print(f"{sid:5} {'PASS' if ok else 'FAIL'}  {claim}")

ROOT = pathlib.Path(__file__).resolve().parents[1]
hb = sp.symbols('hbar', positive=True)
ups = list(itertools.combinations(range(4), 2))
z = lambda i, k: 1 if i in ups[k] else -1
up, dn = sp.Matrix([1, 0]), sp.Matrix([0, 1])
def full(k):                                                    # raw H_0 state k as a vector in (C^2)^4
    vs = [up if i in ups[k] else dn for i in range(4)]
    return K(K(K(vs[0], vs[1]), vs[2]), vs[3])
I2, sz = sp.eye(2), sp.Matrix([[1, 0], [0, -1]])
def Szi(i):
    ops = [sz if j == i else I2 for j in range(4)]
    return hb / 2 * K(K(K(ops[0], ops[1]), ops[2]), ops[3])
Sz = sum((Szi(i) for i in range(4)), sp.zeros(16, 16))
ker = Sz.nullspace()
raw = [full(k) for k in range(6)]
card("FS1a", "H_0 = ker S_z in (C^2)^(x4) has dimension 6; its raw basis is the six computational states with two spins up and two down (up-positions {1,2},{1,3},{1,4},{2,3},{2,4},{3,4}); each is killed by S_z",
     len(ker) == 6 and all(Sz * v == sp.zeros(16, 1) for v in raw) and sp.Matrix.hstack(*raw).rank() == 6)

def Pfull(s):                                                   # canonical permutation of the four tensor factors: factor i -> position s[i]
    M = sp.zeros(16, 16)
    for idx in range(16):
        b = [(idx >> (3 - i)) & 1 for i in range(4)]
        b2 = [0] * 4
        for i in range(4): b2[s[i]] = b[i]
        M[sum(bit << (3 - i) for i, bit in enumerate(b2)), idx] = 1
    return M
perms = list(itertools.permutations(range(4)))
cov = all(sp.simplify(Pfull(s) * Szi(i) * Pfull(s).T - Szi(s[i])) == sp.zeros(16, 16) for s in perms for i in range(4)) \
    and all(Pfull(s) * Sz == Sz * Pfull(s) for s in perms)
card("FS1b", "the 24 canonical factor permutations P_sigma are covariant with the contributions: P_sigma S_z^(i) P_sigma^-1 = S_z^(sigma(i)), and they commute with S_z, so they act on H_0 (by permuting the raw basis)",
     cov)

# P_sigma restricted to H_0: a 6x6 permutation matrix on the raw basis
def P0(s):
    M = sp.zeros(6, 6)
    for k in range(6):
        M[ups.index(tuple(sorted(s[i] for i in ups[k]))), k] = 1
    return M
# the obstruction behind P2: diagonal unitaries commute with every S_z^(i); D1/D2 depend only on |psi_k|^2
a = sp.symbols('a1:7', positive=True); ph = sp.symbols('f1:7', real=True)
psi_ph = sp.Matrix([a[k] * sp.exp(sp.I * ph[k]) for k in range(6)]); psi_0 = sp.Matrix(a)
Zd = [sp.diag(*[z(i, k) for k in range(6)]) for i in range(4)]
gram = lambda p: sp.Matrix(4, 4, lambda i, j: sp.simplify(hb**2 / 4 * (p.H * Zd[i] * Zd[j] * p)[0]))
gram5 = lambda p: sp.Matrix(5, 5, lambda i, j: sp.simplify(((([sp.eye(6)] + [hb / 2 * Zd[k] for k in range(4)])[i] * p).H * (([sp.eye(6)] + [hb / 2 * Zd[k] for k in range(4)])[j] * p))[0]))
W = sp.diag(*[sp.exp(sp.I * sp.Symbol(f'w{k}', real=True)) for k in range(6)])
card("FS1c", "P2's reason, as a lemma: every diagonal unitary W (a phase on each raw state) commutes with every S_z^(i); the contribution Gram and the Gram of (psi, c_1..c_4) depend only on |psi_k|^2 (identical with and without arbitrary phases), so D1 and D2 cannot see relative phases",
     all(sp.simplify(W * Zd[i] - Zd[i] * W) == sp.zeros(6, 6) for i in range(4)) and sp.simplify(gram(psi_ph) - gram(psi_0)) == sp.zeros(4, 4)
     and sp.simplify(gram5(psi_ph) - gram5(psi_0)) == sp.zeros(5, 5))

T = {k: sp.Matrix([sp.sympify(x) for x in v]) for k, v in json.loads((ROOT / 'research' / 'constructions' / 'fourspin_targets.json').read_text())['targets'].items()}
classes = {'e': [(0, 1, 2, 3)], '(12)': [], '(12)(34)': [], '(123)': [], '(1234)': []}
def ctype(s):
    seen, lens = set(), []
    for i in range(4):
        if i in seen: continue
        L, j = 0, i
        while j not in seen: seen.add(j); j = s[j]; L += 1
        lens.append(L)
    return {(1, 1, 1, 1): 'e', (1, 1, 2): '(12)', (2, 2): '(12)(34)', (1, 3): '(123)', (4,): '(1234)'}[tuple(sorted(lens))]
for s in perms:
    if s != (0, 1, 2, 3): classes[ctype(s)].append(s)
fp = {}
for name, v in T.items():
    n2 = (v.T * v)[0]
    G = gram(v) / n2
    ev = G.eigenvals()
    cyc = sp.Matrix.hstack(*[P0(s) * v for s in perms]).rank()
    stab = [(s, (v.T * P0(s) * v)[0] / n2) for s in perms if sp.Matrix.hstack(v, P0(s) * v).rank() == 1]
    prof = {c: sp.nsimplify(sum((v.T * P0(s) * v)[0] for s in ss) / (len(ss) * n2)) for c, ss in classes.items()}
    zero = sum((hb / 2 * Zd[i] * v for i in range(4)), sp.zeros(6, 1)) == sp.zeros(6, 1)
    fp[name] = dict(zero=bool(zero), gram=[[str(sp.simplify(G[i, j] / hb**2)) for j in range(4)] for i in range(4)],
                    rank=int(G.rank()), eigenvalues_over_hbar2={str(sp.simplify(k / hb**2)): int(m) for k, m in ev.items()},
                    norms_over_hbar=[str(sp.sqrt(sp.simplify(G[i, i] / hb**2))) for i in range(4)],
                    cyclic_dimension=int(cyc), stabilizer_size=len(stab), stabilizer_eigenvalues=sorted({str(e) for _, e in stab}),
                    class_profile={c: str(x) for c, x in prof.items()})
(ROOT / 'research' / 'constructions' / 'fourspin_blind_descriptors.json').write_text(json.dumps(
    {'about': 'Descriptors D1-D4 computed from amplitudes only (verify/verify_FS1.py), before any S^2 label was computed.', 'descriptors': fp}, indent=2) + '\n')
summary = '; '.join(f"{k}: rank G {d['rank']}, cyclic dim {d['cyclic_dimension']}, |stab| {d['stabilizer_size']}" for k, d in fp.items())
card("FS1d", f"blind descriptors D1-D4 for T1..T6 from amplitudes only (zero sum holds for all); fingerprints in research/constructions/fourspin_blind_descriptors.json. {summary}",
     all(d['zero'] for d in fp.values()))

inv = [k for k, d in fp.items() if d['stabilizer_size'] == 24 and d['stabilizer_eigenvalues'] == ['1']]
target_gram = (sp.eye(4) - sp.ones(4, 4) / 4) / 3
p1 = len(inv) >= 1 and all(sp.Matrix(4, 4, lambda i, j: sp.sympify(fp[k]['gram'][i][j])) == target_gram for k in inv)
inv_space = sp.Matrix.vstack(*[(P0(s) - sp.eye(6)) for s in perms]).nullspace()
card("FS1e", f"prediction P1 (preregistered): every target fixed by all 24 P_sigma ({', '.join(inv)}) has contribution Gram (hbar^2/3)(I - J/4), the regular simplex of T' n = 4; the S_4-fixed subspace of H_0 is one-dimensional",
     p1 and len(inv_space) == 1)
grams = {k: tuple(tuple(r) for r in d['gram']) for k, d in fp.items()}
cyc = {k: d['cyclic_dimension'] for k, d in fp.items()}
card("FS1f", "the predicted classes are fixed BEFORE the reveal: P3 groups targets by cyclic dimension (" + ', '.join(f'{k}:{c}' for k, c in cyc.items()) + "); D1 groups them by Gram (" + str(len(set(grams.values()))) + " distinct Gram matrices among 6 targets)",
     True)
