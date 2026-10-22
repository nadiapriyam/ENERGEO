// Block 7 — Projection onto a symmetric subspace by averaging over a subgroup.
//   P_H x = (1/|H|) Σ_{h∈H} U_h x
// x ∈ R³ is a three-sample signal (x₁, x₂, x₃). Subgroups act by permuting samples:
//   C₃ — cyclic shift, which in R³ is a 120° rotation about (1,1,1)
//   Z₂ — time reversal x₁ ↔ x₃, a reflection across the plane x₁ = x₃
//   S₃ — every permutation

import { matVec, matMul, transpose, identity, matSub, maxAbs, sub, dot, eigSym } from './linalg.js';

const perm = (p) => p.map((j) => [0, 1, 2].map((k) => (k === j ? 1 : 0)));

/** Cyclic shift S: (x₁, x₂, x₃) ↦ (x₃, x₁, x₂). */
export const SHIFT = perm([2, 0, 1]);
export const REVERSE = perm([2, 1, 0]);

export const SUBGROUPS = {
  c3: { label: 'Cyclic shifts C₃', elements: [identity(3), SHIFT, matMul(SHIFT, SHIFT)] },
  z2: { label: 'Time reversal Z₂', elements: [identity(3), REVERSE] },
  s3: {
    label: 'All permutations S₃',
    elements: [[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [2, 1, 0], [1, 0, 2]].map(perm),
  },
};

export const orbitPoints = (H, x) => H.map((h) => matVec(h, x));

/** The average of the orbit. This is literally its centroid. */
export function groupAverage(H, x) {
  const pts = orbitPoints(H, x);
  return [0, 1, 2].map((k) => pts.reduce((s, p) => s + p[k], 0) / H.length);
}

export function projector(H) {
  const P = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const h of H) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) P[i][j] += h[i][j] / H.length;
  return P;
}

/**
 * Everything the panel needs to certify that averaging is an orthogonal projection:
 * idempotent (P² = P), self-adjoint (Pᵀ = P), residual ⟂ symmetric part, Pythagoras.
 */
export function decompose(H, x) {
  const P = projector(H);
  const sym = matVec(P, x);
  const res = sub(x, sym);
  return {
    P,
    sym,
    res,
    idempotence: maxAbs(matSub(matMul(P, P), P)),
    selfAdjoint: maxAbs(matSub(transpose(P), P)),
    crossInner: dot(sym, res),
    pythagoras: dot(x, x) - dot(sym, sym) - dot(res, res),
    rank: eigSym(P).values.filter((v) => v > 0.5).length,
  };
}

/** Basis of the fixed subspace Fix(H) = range(P): eigenvectors of P with eigenvalue 1. */
export function fixedSubspace(H) {
  const { values, vectors } = eigSym(projector(H));
  return vectors.filter((_, i) => values[i] > 0.5);
}

// ── n-sample generalisation (Advanced): averaging over shifts by d keeps only frequencies that are
// multiples of n/d, i.e. it extracts the d-periodic part. Connects back to the Fourier block.

export function cyclicSubgroupAverage(x, d) {
  const n = x.length;
  if (n % d) throw new Error('d must divide n');
  const copies = n / d;
  return Array.from({ length: n }, (_, i) => {
    let s = 0;
    for (let j = 0; j < copies; j++) s += x[(i + j * d) % n];
    return s / copies;
  });
}
