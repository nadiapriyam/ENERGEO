// Block 2 — Inner product, norm, orthogonality in R³ with metric G (symmetric positive-definite).
// ⟨u,v⟩_G = uᵀGv. Orthogonality is ⟨u,v⟩_G = 0, which depends on G, not on the drawn angle.

import { form, matVec, matMul, transpose, eigSym, rotationAxisAngle, scale, sub, norm, dot, cross } from './linalg.js';

/** G = R·diag(λ)·Rᵀ with R = Rz(γ)·Ry(β)·Rx(α). λ are the squared "stretch" factors of the metric. */
export function metricFromSpectrum([l1, l2, l3], [alpha = 0, beta = 0, gamma = 0] = []) {
  const R = matMul(
    matMul(rotationAxisAngle([0, 0, 1], gamma), rotationAxisAngle([0, 1, 0], beta)),
    rotationAxisAngle([1, 0, 0], alpha),
  );
  const D = [[l1, 0, 0], [0, l2, 0], [0, 0, l3]];
  return matMul(matMul(R, D), transpose(R));
}

export const inner = (G, u, v) => form(G, u, v);
export const normG = (G, u) => Math.sqrt(form(G, u));

/** The angle the metric G assigns between u and v (not the angle you see on screen). */
export function angleG(G, u, v) {
  const c = inner(G, u, v) / (normG(G, u) * normG(G, v));
  return Math.acos(Math.min(1, Math.max(-1, c)));
}

/** Euclidean angle, i.e. what the eye reads off the picture. */
export const angleEuclid = (u, v) => Math.acos(Math.min(1, Math.max(-1, dot(u, v) / (norm(u) * norm(v)))));

/** G-orthogonal projection of v onto the line through u, and the residual. */
export function projectG(G, v, u) {
  const coeff = inner(G, u, v) / inner(G, u, u);
  const along = scale(u, coeff);
  return { coeff, along, residual: sub(v, along) };
}

/**
 * The plane of vectors G-orthogonal to u is {v : (Gu)·v = 0}; its Euclidean normal is Gu.
 * tilt = Euclidean angle between u and Gu = how far that plane leans away from the plane
 * that merely looks perpendicular to u. Zero exactly when u is an eigenvector of G.
 */
export function orthogonalPlane(G, u) {
  const n = matVec(G, u);
  return { normal: scale(n, 1 / norm(n)), tilt: angleEuclid(u, n) };
}

/** Unit ball {x : xᵀGx = 1}: principal axes are eigenvectors of G, semi-axis lengths 1/√λ. */
export function unitBall(G) {
  const { values, vectors } = eigSym(G);
  return { axes: vectors, radii: values.map((l) => 1 / Math.sqrt(l)), eigenvalues: values };
}

/**
 * Where u pierces the unit ball, the tangent plane has normal G·û — the same normal as the
 * G-orthogonal plane of u. Returns the point and the angle between the two normals (≈ 0).
 */
export function tangentAtDirection(G, u) {
  const p = scale(u, 1 / normG(G, u));
  const tn = matVec(G, p);
  const on = matVec(G, u);
  const c = cross(tn, on);
  return { point: p, normal: scale(tn, 1 / norm(tn)), misalignment: norm(c) / (norm(tn) * norm(on)) };
}

export const gram = (G, vectors) => vectors.map((a) => vectors.map((b) => inner(G, a, b)));

/** Gram–Schmidt under G. Returns a G-orthonormal list (drops dependent vectors). */
export function gramSchmidtG(G, vectors) {
  const out = [];
  for (const v of vectors) {
    let w = v.slice();
    for (const e of out) w = sub(w, scale(e, inner(G, e, w)));
    const n = normG(G, w);
    if (n > 1e-10) out.push(scale(w, 1 / n));
  }
  return out;
}
