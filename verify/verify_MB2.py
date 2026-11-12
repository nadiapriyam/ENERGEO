"""MB2: mass-balance REVEAL. Written and run after verify/verify_MB1.py's predictions were committed (commit 966be69).
Computes the second-moment tensor and compares with R1 (symmetry) and R2 (contribution geometry).
Run: python3 verify/verify_MB2.py"""
import json, pathlib
import sympy as sp

def card(sid, claim, ok):
    print(f"{sid:5} {'PASS' if ok else 'FAIL'}  {claim}")

ROOT = pathlib.Path(__file__).resolve().parents[1]
CONF = {'M1': [(1, 1), (-1, 1), (-1, -1), (1, -1)], 'M2': [(2, 1), (-2, 1), (-2, -1), (2, -1)], 'M3': [(2, 0), (0, 1), (-2, 0), (0, -1)],
        'M4': [(1, 1, 1), (1, -1, -1), (-1, 1, -1), (-1, -1, 1)], 'M5': [(-2, 4), (-3, -2), (3, -2), (3, 2), (-1, -2)], 'M6': [(3, 1), (-1, 2), (-2, -2), (0, -1)]}
pred = json.loads((ROOT / 'research/constructions/mass_blind_predictions.json').read_text())['predictions']
truth, spec_ok = {}, True
for name, pts in CONF.items():
    X = sp.Matrix(pts); n, d = X.shape
    U = X - sp.ones(n, 1) * (sp.ones(1, n) * X / n)
    Tm = U.T * U
    truth[name] = 'isotropic' if Tm == Tm[0, 0] * sp.eye(d) else 'anisotropic'
    G = U * U.T
    spec_ok = spec_ok and {k: m for k, m in G.eigenvals().items() if k != 0} == Tm.eigenvals()
r2_right = all(pred[k]['R2'] == truth[k] for k in CONF)
r1_sound = all(pred[k]['R1'] == truth[k] for k in CONF if pred[k]['R1'] != 'no prediction')
r1_missed = [k for k in CONF if pred[k]['R1'] == 'no prediction' and truth[k] == 'isotropic']
card("MB2a", "reveal: second-moment isotropy is " + ', '.join(f'{k}:{v}' for k, v in truth.items()) + "; R2 (contribution Gram spectrum) is right for all six; R1 (symmetry) is right whenever it predicts (M1, M4) and silent elsewhere; it misses " + ', '.join(r1_missed) + " (isotropic with trivial symmetry)",
     r2_right and r1_sound and r1_missed == ['M5'])
card("MB2b", "why R2 cannot fail here (textbook): with equal masses the second-moment tensor T = U^T U and the contribution Gram G = U U^T have the same nonzero spectrum, so the contribution geometry alone determines the hidden second-moment isotropy",
     spec_ok)
import itertools
commutes = True
for name, pts in CONF.items():
    X = sp.Matrix(pts); n, d = X.shape
    U = X - sp.ones(n, 1) * (sp.ones(1, n) * X / n); G = U * U.T; Tm = U.T * U
    Upinv = (U.T * U).inv() * U.T
    for s in itertools.permutations(range(n)):
        if all(G[s[i], s[j]] == G[i, j] for i in range(n) for j in range(n)):
            Q = (Upinv * U.extract(list(s), list(range(d)))).T
            commutes = commutes and Tm * Q == Q * Tm
card("MB2c", "why R1 is sound but incomplete (Schur, textbook): T commutes with every stabilizer isometry Q of every configuration (checked), so a one-dimensional symmetric commutant forces T to be scalar; isotropy can also occur with trivial symmetry (M5)",
     commutes and truth['M5'] == 'isotropic' and pred['M5']['stabilizer_order'] == 1)
