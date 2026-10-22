// Block 1 — Invariant-form geometry: AᵀMA = M.
// A symmetric matrix M defines Q(x) = xᵀMx. The transformations that preserve Q form a group;
// in 2D its connected part is the one-parameter family exp(sJ) with JᵀM + MJ = 0.

import { det2, inv2, matMul, matVec, transpose, matSub, maxAbs, form, eigSym, scale } from './linalg.js';

export const METRICS = {
  euclidean: { label: 'Euclidean', M: [[1, 0], [0, 1]] },
  weighted: { label: 'Weighted', M: [[2, 0.6], [0.6, 1]] },
  minkowski: { label: 'Minkowski', M: [[1, 0], [0, -1]] },
};

const K = [[0, -1], [1, 0]];

/** 'elliptic' when det M > 0 (ellipses, compact orbits), 'hyperbolic' when det M < 0. */
export const formType = (M) => (det2(M) > 0 ? 'elliptic' : det2(M) < 0 ? 'hyperbolic' : 'degenerate');

/**
 * Generator of the M-preserving one-parameter group, normalised so J² = −sign(det M)·I.
 * Elliptic: exp(sJ) has period 2π. Hyperbolic: s is a rapidity.
 * Any J = c·M⁻¹K with K antisymmetric satisfies JᵀM + MJ = 0.
 */
export function generator(M) {
  const d = det2(M);
  if (Math.abs(d) < 1e-12) throw new Error('degenerate form: det M = 0');
  const c = Math.sign(d) * Math.sqrt(Math.abs(d));
  return matMul(inv2(M), K).map((row) => row.map((v) => c * v));
}

/** exp(sJ) in closed form, using J² = −sign(det M)·I. */
export function groupElement(M, s) {
  const J = generator(M);
  const [a, b] = formType(M) === 'elliptic' ? [Math.cos(s), Math.sin(s)] : [Math.cosh(s), Math.sinh(s)];
  return [
    [a + b * J[0][0], b * J[0][1]],
    [b * J[1][0], a + b * J[1][1]],
  ];
}

/** Transformations offered for contrast. Only 'group' preserves Q for every M. */
export function transformation(kind, M, s) {
  switch (kind) {
    case 'group':
      return groupElement(M, s);
    case 'shear':
      return [[1, s], [0, 1]];
    case 'stretch':
      return [[Math.exp(s), 0], [0, Math.exp(-s)]];
    case 'rotation':
      return [[Math.cos(s), -Math.sin(s)], [Math.sin(s), Math.cos(s)]];
    default:
      throw new Error(`unknown transformation ${kind}`);
  }
}

/** Residual of the defining identity: max |(AᵀMA − M)_ij|. Zero ⇔ A preserves the form. */
export const preservationResidual = (A, M) => maxAbs(matSub(matMul(matMul(transpose(A), M), A), M));

export const Q = (M, x) => form(M, x);

/** The orbit {exp(sJ)x₀} sampled over s. For elliptic forms this closes after 2π. */
export function orbit(M, x0, { sMin, sMax, samples = 256 } = {}) {
  const elliptic = formType(M) === 'elliptic';
  const lo = sMin ?? (elliptic ? 0 : -2.2);
  const hi = sMax ?? (elliptic ? 2 * Math.PI : 2.2);
  return Array.from({ length: samples }, (_, i) => {
    const s = lo + ((hi - lo) * i) / (samples - 1);
    return matVec(groupElement(M, s), x0);
  });
}

/**
 * Level set {x : xᵀMx = q} as polylines, built from the eigenbasis of M.
 * q = 0 on an indefinite form gives the two null lines (the light cone in 1+1D).
 */
export function levelSet(M, q, { extent = 3, samples = 160 } = {}) {
  const { values: [l1, l2], vectors: [e1, e2] } = eigSym(M);
  const pt = (y1, y2) => [y1 * e1[0] + y2 * e2[0], y1 * e1[1] + y2 * e2[1]];
  if (l1 > 0) {
    if (q <= 0) return [];
    const r1 = Math.sqrt(q / l1);
    const r2 = Math.sqrt(q / l2);
    const loop = Array.from({ length: samples + 1 }, (_, i) => {
      const t = (2 * Math.PI * i) / samples;
      return pt(r1 * Math.cos(t), r2 * Math.sin(t));
    });
    return [loop];
  }
  // indefinite: l1 < 0 < l2
  const a = Math.abs(l1);
  const b = l2;
  const umax = Math.acosh(Math.max(1.0001, extent * Math.sqrt(Math.max(a, b) / Math.max(Math.abs(q), 1e-9))));
  const branch = (sign, f) =>
    Array.from({ length: samples }, (_, i) => f(sign, -umax + (2 * umax * i) / (samples - 1)));
  if (q > 0) {
    const f = (sg, u) => pt(Math.sqrt(q / a) * Math.sinh(u), sg * Math.sqrt(q / b) * Math.cosh(u));
    return [branch(1, f), branch(-1, f)];
  }
  if (q < 0) {
    const f = (sg, u) => pt(sg * Math.sqrt(-q / a) * Math.cosh(u), Math.sqrt(-q / b) * Math.sinh(u));
    return [branch(1, f), branch(-1, f)];
  }
  const slope = Math.sqrt(a / b);
  return [1, -1].map((sg) => [pt(-extent, -sg * slope * extent), pt(extent, sg * slope * extent)]);
}

/** Height field z = Q(x, y) on a square grid, row-major, for the 3D lift. */
export function heightField(M, { extent = 2, n = 64 } = {}) {
  const z = new Float64Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = -extent + (2 * extent * j) / (n - 1);
      const y = -extent + (2 * extent * i) / (n - 1);
      z[i * n + j] = Q(M, [x, y]);
    }
  }
  return { n, extent, z };
}

/**
 * The direction M-orthogonal to u: v with uᵀMv = 0 is v ∝ K(Mu).
 * Under η a null vector is M-orthogonal to itself.
 */
export function mOrthogonalDirection(M, u) {
  const w = matVec(M, u);
  return [-w[1], w[0]];
}

export const mInner = (M, u, v) => form(M, u, v);

export const unit = (v) => scale(v, 1 / Math.hypot(...v));
