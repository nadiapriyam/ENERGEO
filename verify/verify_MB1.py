"""MB1: mass-balance zero, BLIND part. Equal masses; the zero sum_i m(r_i - R_CM) = 0 is never left.
Computes the preregistered descriptors E1-E3 and the predictions R1 (symmetry) and R2 (contribution geometry) for
M1..M6. The withheld target (isotropy of the second-moment tensor) is NOT computed here
(research/constructions/fourspin_mass_protocol.md). Run: python3 verify/verify_MB1.py"""
import itertools, json, pathlib
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:5} {'PASS' if ok else 'FAIL'}  {claim}")

ROOT = pathlib.Path(__file__).resolve().parents[1]
CONF = {'M1': [(1, 1), (-1, 1), (-1, -1), (1, -1)], 'M2': [(2, 1), (-2, 1), (-2, -1), (2, -1)], 'M3': [(2, 0), (0, 1), (-2, 0), (0, -1)],
        'M4': [(1, 1, 1), (1, -1, -1), (-1, 1, -1), (-1, -1, 1)], 'M5': [(-2, 4), (-3, -2), (3, -2), (3, 2), (-1, -2)], 'M6': [(3, 1), (-1, 2), (-2, -2), (0, -1)]}
out = {}
for name, pts in CONF.items():
    X = sp.Matrix(pts)                       # rows r_i; m = 1
    n, d = X.shape
    R = sp.ones(1, n) * X / n
    U = X - sp.ones(n, 1) * R                # rows u_i = r_i - R_CM
    G = U * U.T
    nz = {k: m for k, m in G.eigenvals().items() if k != 0}
    Upinv = (U.T * U).inv() * U.T
    stab = []
    for s in itertools.permutations(range(n)):
        if all(G[s[i], s[j]] == G[i, j] for i in range(n) for j in range(n)):
            Qt = Upinv * U.extract(list(s), list(range(d)))
            Q = Qt.T
            assert Q.T * Q == sp.eye(d) and all(Q * U[i, :].T == U[s[i], :].T for i in range(n))
            stab.append(Q)
    Ssym = sp.Matrix(d, d, lambda i, j: sp.Symbol(f's{min(i, j)}{max(i, j)}'))
    eqs = [e for Q in stab for e in (Ssym * Q - Q * Ssym)]
    free = set(Ssym.free_symbols)
    sol = sp.solve(eqs, list(free), dict=True)
    dim_comm = len(free) - (len(sol[0]) if sol else 0) if eqs else len(free)
    r1 = 'isotropic' if dim_comm == 1 else 'no prediction'
    r2 = 'isotropic' if len(nz) == 1 else 'anisotropic'
    out[name] = dict(zero=bool(sp.ones(1, n) * U == sp.zeros(1, d)), d=d, nonzero_gram_eigenvalues={str(k): int(m) for k, m in nz.items()},
                     stabilizer_order=len(stab), symmetric_commutant_dimension=int(dim_comm), R1=r1, R2=r2)
(ROOT / 'research' / 'constructions' / 'mass_blind_predictions.json').write_text(json.dumps(
    {'about': 'Predictions R1 and R2 for M1..M6, computed before the second-moment tensor (verify/verify_MB1.py).', 'predictions': out}, indent=2) + '\n')
card("MB1a", "M1..M6: equal masses, contributions u_i = r_i - R_CM with zero sum for every configuration (the zero is kept throughout)", all(v['zero'] for v in out.values()))
card("MB1b", "blind predictions (before computing the second moment): " + '; '.join(f"{k}: |stab| {v['stabilizer_order']}, commutant dim {v['symmetric_commutant_dimension']}, R1 {v['R1']}, R2 {v['R2']}" for k, v in out.items()),
     True)
