// Block 6 — Orbit and stabilizer.
//   O_x = {U_g x : g ∈ G},  Stab(x) = {g ∈ G : U_g x = x},  |O_x|·|Stab(x)| = |G|
// Groups here are finite sets of 3×3 orthogonal matrices acting on R³.

import { matMul, matVec, det3, norm, sub, rotationAxisAngle, axisAngle, matEqual, transpose } from './linalg.js';

const PERMS3 = [
  [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0],
];

/** All 48 signed permutation matrices: the full symmetry group O_h of the cube. */
export function cubeFull() {
  const out = [];
  for (const p of PERMS3) {
    for (let signs = 0; signs < 8; signs++) {
      const M = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (j === p[i] ? ((signs >> i) & 1 ? -1 : 1) : 0)));
      out.push(M);
    }
  }
  return out;
}

/** The 24 rotations of the cube (det = +1): the group O ≅ S₄. */
export const cubeRotations = () => cubeFull().filter((M) => det3(M) > 0);

/** Rotations about z by 2πk/n: the cyclic group C_n. */
export const cyclicZ = (n) => Array.from({ length: n }, (_, k) => rotationAxisAngle([0, 0, 1], (2 * Math.PI * k) / n));

/** C_n plus n half-turns about axes in the xy-plane: the dihedral rotation group D_n, order 2n. */
export function dihedralZ(n) {
  const flips = Array.from({ length: n }, (_, k) => {
    const a = (Math.PI * k) / n;
    return rotationAxisAngle([Math.cos(a), Math.sin(a), 0], Math.PI);
  });
  return [...cyclicZ(n), ...flips];
}

export const GROUPS = {
  cube: { label: 'Cube rotations O', make: cubeRotations },
  cubeFull: { label: 'Cube with reflections Oₕ', make: cubeFull },
  c4: { label: 'Cyclic C₄', make: () => cyclicZ(4) },
  d3: { label: 'Dihedral D₃', make: () => dihedralZ(3) },
};

/** Closure under multiplication and inverses — the group axioms we can check numerically. */
export function isGroup(G, tol = 1e-9) {
  const has = (M) => G.some((H) => matEqual(H, M, tol));
  return G.every((A) => has(transpose(A)) && G.every((B) => has(matMul(A, B))));
}

/** Orbit points (deduplicated) and, for each, the group elements that land there. */
export function orbit(G, x, tol = 1e-7) {
  const points = [];
  const preimages = [];
  G.forEach((g, gi) => {
    const y = matVec(g, x);
    const idx = points.findIndex((p) => norm(sub(p, y)) < tol);
    if (idx < 0) {
      points.push(y);
      preimages.push([gi]);
    } else preimages[idx].push(gi);
  });
  return { points, preimages };
}

export const stabilizer = (G, x, tol = 1e-7) =>
  G.map((g, i) => ({ g, i })).filter(({ g }) => norm(sub(matVec(g, x), x)) < tol);

/** Describe an element: proper rotation (axis, angle) or improper (det −1, a reflection or rotoreflection). */
export function describe(g) {
  if (det3(g) > 0) return { proper: true, ...axisAngle(g) };
  const r = g.map((row) => row.map((v) => -v)); // −g is a proper rotation because −I ∈ Oₕ
  const { axis, angle } = axisAngle(r);
  return { proper: false, axis, angle: Math.PI - angle };
}

/**
 * Continuous path from x to g·x for animation. Proper rotations turn about their axis.
 * Improper elements have no continuous path inside the group; we return the straight chord
 * so the picture shows the jump honestly.
 */
export function actionPath(g, x, steps = 48) {
  const d = describe(g);
  if (d.proper) {
    return Array.from({ length: steps + 1 }, (_, i) => matVec(rotationAxisAngle(d.axis, (d.angle * i) / steps), x));
  }
  const y = matVec(g, x);
  return Array.from({ length: steps + 1 }, (_, i) => x.map((v, k) => v + ((y[k] - v) * i) / steps));
}

/** Reference points on the unit sphere with large stabilizers under the cube group. */
export const SPECIAL_POINTS = {
  generic: { label: 'Generic', x: normalize([0.62, 0.35, 0.7]) },
  edge: { label: 'Edge midpoint', x: normalize([1, 1, 0]) },
  vertex: { label: 'Vertex', x: normalize([1, 1, 1]) },
  face: { label: 'Face centre', x: [0, 0, 1] },
};

function normalize(v) {
  const n = norm(v);
  return v.map((c) => c / n);
}
