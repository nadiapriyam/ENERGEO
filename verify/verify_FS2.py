"""FS2: four-spin REVEAL. Written and run after verify/verify_FS1.py's descriptors and predicted classes were committed
(commit 966be69). Computes S^2 on the targets and compares with the preregistered P1-P3; then the secondary match to
known theory. Run: python3 verify/verify_FS2.py"""
import itertools, json, pathlib
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:5} {'PASS' if ok else 'FAIL'}  {claim}")

ROOT = pathlib.Path(__file__).resolve().parents[1]
ups = list(itertools.combinations(range(4), 2))
z = lambda i, k: 1 if i in ups[k] else -1
S2 = sp.zeros(6, 6)                                            # S^2 on H_0, units of hbar^2 (the same construction as the generator)
for k in range(6):
    S2[k, k] = 3 + sp.Rational(1, 2) * sum(z(i, k) * z(j, k) for i, j in itertools.combinations(range(4), 2))
    for i, j in itertools.combinations(range(4), 2):
        if z(i, k) != z(j, k):
            S2[ups.index(tuple(sorted((set(ups[k]) - {i, j}) | ({i, j} - set(ups[k]))))), k] += 1
T = {k: sp.Matrix([sp.sympify(x) for x in v]) for k, v in json.loads((ROOT / 'research/constructions/fourspin_targets.json').read_text())['targets'].items()}
fp = json.loads((ROOT / 'research/constructions/fourspin_blind_descriptors.json').read_text())['descriptors']
Sval = {}
for k, v in T.items():
    for S in (0, 1, 2):
        if S2 * v == S * (S + 1) * v: Sval[k] = S
dims = {val: m for val, m in S2.eigenvals().items()}
card("FS2a", "reveal: S^2 on H_0 has eigenvalues 0, 2, 6 (x hbar^2) with multiplicities 2, 3, 1, i.e. S = 0, 1, 2 sectors of dimensions 2, 3, 1; the targets are eigenstates with S = " + ', '.join(f'{k}:{s}' for k, s in Sval.items()),
     dims == {0: 2, 2: 3, 6: 1} and len(Sval) == 6)
cyc = {k: fp[k]['cyclic_dimension'] for k in T}
mapping = {}
consistent = all(mapping.setdefault(cyc[k], Sval[k]) == Sval[k] for k in T)
bij = consistent and len(set(mapping.values())) == len(mapping) == 3
card("FS2b", "P3 against the reveal: the preregistered classes by cyclic dimension coincide exactly with the S^2 sectors (cyclic dimension 1 <-> S = 2, 3 <-> S = 1, 2 <-> S = 0, for all six targets): the independently supplied S_4 action separates the hidden sectors",
     bij and mapping == {1: 2, 3: 1, 2: 0})

hb = sp.symbols('hbar', positive=True)
Zd = [sp.diag(*[z(i, k) for k in range(6)]) for i in range(4)]
def gram(v):
    n2 = (v.H * v)[0]
    return sp.Matrix(4, 4, lambda i, j: sp.simplify((v.H * Zd[i] * Zd[j] * v)[0] / (4 * n2)))
s12s34 = sp.Matrix([0, 1, -1, -1, 1, 0])          # singlet(12) singlet(34) in the raw basis {12,13,14,23,24,34}
s12t34 = sp.Matrix([0, 1, 1, -1, -1, 0])          # singlet(12) (x) |1,0>(34)
w = sp.Rational(-1, 2) + sp.sqrt(3) * sp.I / 2
s0 = [T[k] for k in T if Sval[k] == 0]
omega_state = s0[0] + w * s0[1]
def S_of(v):
    for S in (0, 1, 2):
        if sp.simplify(S2 * v - S * (S + 1) * v) == sp.zeros(6, 1): return S
uniform = len({sp.simplify(sp.Abs(x)**2) for x in omega_state}) == 1
card("FS2c", "P2 confirmed by exact counterexamples: D1/D2 cannot separate the sectors. singlet(12)singlet(34) (S = 0) and singlet(12)|1,0>(34) (S = 1) have identical contribution Grams; and an S = 0 state with uniform |amplitudes| (T_a + omega T_b, omega = e^{2 pi i/3}) has the same Gram (1/3)(I - J/4) (x hbar^2) as the S = 2 state",
     S_of(s12s34) == 0 and S_of(s12t34) == 1 and gram(s12s34) == gram(s12t34)
     and S_of(omega_state) == 0 and uniform and sp.simplify(gram(omega_state) - (sp.eye(4) - sp.ones(4, 4) / 4) / 3) == sp.zeros(4, 4))
p1_holds = all(Sval[k] == 2 for k in T if fp[k]['stabilizer_size'] == 24)
card("FS2d", "P1 holds as preregistered (the S_4-fixed target is the S = 2 state and has the regular-simplex Gram), but its converse fails: the regular-simplex Gram also occurs at S = 0 (FS2c), so the simplex configuration alone does not identify the sector",
     p1_holds)

def P0(s):
    M = sp.zeros(6, 6)
    for k in range(6):
        M[ups.index(tuple(sorted(s[i] for i in ups[k]))), k] = 1
    return M
perms = list(itertools.permutations(range(4)))
X = sp.Matrix(6, 6, lambda i, j: sp.Symbol(f'x{i}{j}'))
eqs = [e for s in perms for e in (P0(s) * X - X * P0(s))]
sol = sp.solve(eqs, list(X.free_symbols), dict=True)[0]
comm_dim = len(X.free_symbols) - len(sol)
S2_commutes = all(S2 * P0(s) == P0(s) * S2 for s in perms)
chars = {2: {'e': 1, '(12)': 1, '(12)(34)': 1, '(123)': 1, '(1234)': 1},
         1: {'e': 1, '(12)': sp.Rational(1, 3), '(12)(34)': sp.Rational(-1, 3), '(123)': 0, '(1234)': sp.Rational(-1, 3)},
         0: {'e': 1, '(12)': 0, '(12)(34)': 1, '(123)': sp.Rational(-1, 2), '(1234)': 0}}
prof_ok = all(sp.sympify(fp[k]['class_profile'][c]) == chars[Sval[k]][c] for k in T for c in chars[2])
card("FS2e", "secondary match to known theory (after the derivation): S^2 commutes with every P_sigma; the commutant of the S_4 action on H_0 has dimension 3, so H_0 splits into 3 inequivalent invariant subspaces (dims 1, 3, 2) and S^2 is constant on each; the blind class profiles D4c equal the normalized S_4 characters of [4], [3,1], [2,2]. This is Schur-Weyl duality in the S_z = 0 weight space: VALIDATION OF KNOWN MATHEMATICS",
     comm_dim == 3 and S2_commutes and prof_ok)
