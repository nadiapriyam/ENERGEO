"""Generate the four-spin blind targets (research/constructions/fourspin_targets.json).
Builds exact S^2 eigenspaces inside H_0 = ker S_z, mixes each with fixed rational coefficients, shuffles with a fixed
permutation, and writes AMPLITUDES ONLY (6 coordinates in the raw basis {1,2},{1,3},{1,4},{2,3},{2,4},{3,4} of
up-positions). No label is written. The descriptor code reads only the JSON.
Run once: python3 research/tools/fourspin_targets.py"""
import itertools, json, pathlib
import sympy as sp

ROOT = pathlib.Path(__file__).resolve().parents[2]
ups = list(itertools.combinations(range(4), 2))                       # the raw basis of H_0
def zval(i, k):                                                       # eigenvalue of Z_i on raw state k
    return 1 if i in ups[k] else -1
# S^2 restricted to H_0 in units of hbar^2: S^2 = 3 + (1/2) sum_{i<j} (X_iX_j + Y_iY_j + Z_iZ_j) ... built from flips
S2 = sp.zeros(6, 6)
for k in range(6):
    zz = sum(zval(i, k) * zval(j, k) for i, j in itertools.combinations(range(4), 2))
    S2[k, k] = sp.Rational(3) + sp.Rational(1, 2) * zz
    for i, j in itertools.combinations(range(4), 2):
        if zval(i, k) != zval(j, k):                                 # X_iX_j + Y_iY_j flips an up-down pair: amplitude 2
            new = tuple(sorted((set(ups[k]) - {i, j}) | ({i, j} - set(ups[k]))))
            S2[ups.index(new), k] += 1
sectors = {}
for val, mult, vecs in S2.eigenvects():
    sectors[val] = [sp.Matrix([sp.nsimplify(x) for x in v]) for v in vecs]
mix = {1: [[1]], 3: [[1, 2, 0], [0, 1, -3], [2, 0, 1]], 2: [[1, 1], [2, -1]]}   # by eigenspace dimension; rational, invertible
targets = []
for val, vecs in sectors.items():
    M = mix[len(vecs)]
    for row in M:
        v = sum((c * vec for c, vec in zip(row, vecs)), sp.zeros(6, 1))
        targets.append(v)
order = [3, 4, 0, 1, 5, 2]                                            # fixed shuffle
out = {f'T{n + 1}': [str(x) for x in targets[order[n]]] for n in range(6)}
(ROOT / 'research' / 'constructions' / 'fourspin_targets.json').write_text(json.dumps(
    {'about': 'Four-spin blind targets: amplitudes in the raw H_0 basis (up-positions {1,2},{1,3},{1,4},{2,3},{2,4},{3,4}), unnormalized, rational. Labels withheld; see fourspin_mass_protocol.md.',
     'targets': out}, indent=2) + '\n')
print('wrote', len(out), 'targets')
