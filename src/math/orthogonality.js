// Orthogonality and zero: one relationship, ⟨u,v⟩ = 0, read in several representations.
// Every reading below is computed here; the views only draw what these functions return.
//
// The thread through all of them: an inner product is a sum of signed contributions,
//   R^n:  ⟨u,v⟩ = Σ u_i v_i        L²[0,L]:  ⟨f,g⟩ = ∫ f(t) g(t) dt,
// and orthogonality is the case where those contributions cancel exactly.

import { dot, add, sub, scale, norm, matVec, rotationAxisAngle } from './linalg.js';
import { basisValue, basisInner, basisGram } from './fourier.js';

const clamp1 = (c) => Math.min(1, Math.max(-1, c));

/** Coordinate-wise contributions u_i v_i. Their sum is the Euclidean inner product. */
export const contributions = (u, v) => u.map((ui, i) => ui * v[i]);

/**
 * One pair (u, v) read as: an inner product, an angle, a shadow (projection of v on u),
 * a residual, a Pythagorean comparison, and a 2×2 Gram matrix.
 */
export function pairReadings(u, v) {
  const uv = dot(u, v);
  const uu = dot(u, u);
  const vv = dot(v, v);
  const shadowCoeff = uv / uu;
  const shadow = scale(u, shadowCoeff);
  const residual = sub(v, shadow);
  const s = add(u, v);
  return {
    inner: uv,
    contributions: contributions(u, v),
    angle: Math.acos(clamp1(uv / Math.sqrt(uu * vv))),
    shadow,
    shadowCoeff,
    residual,
    residualDot: dot(residual, u),
    normSum2: dot(s, s),
    pythagoras: uu + vv,
    crossTerm: 2 * uv,
    gram: [[uu, uv], [uv, vv]],
  };
}

/** Angle between u and v after orthographic projection onto the plane with normal n (a screen). */
export function projectedAngle(u, v, n) {
  const nn = scale(n, 1 / norm(n));
  const pu = sub(u, scale(nn, dot(u, nn)));
  const pv = sub(v, scale(nn, dot(v, nn)));
  return Math.acos(clamp1(dot(pu, pv) / (norm(pu) * norm(pv))));
}

/** Rotate both vectors by the same R ∈ SO(3): coordinates change, the inner product does not. */
export function rotatePair(u, v, axis, angle) {
  const R = rotationAxisAngle(axis, angle);
  return { u: matVec(R, u), v: matVec(R, v) };
}

/** Shadow of a pair in R^n on the coordinate plane (x_i, x_j), and the angle it appears to make there. */
export function coordinateShadow(u, v, i, j) {
  const a = [u[i], u[j]];
  const b = [v[i], v[j]];
  const na = norm(a);
  const nb = norm(b);
  const angle = na < 1e-12 || nb < 1e-12 ? null : Math.acos(clamp1(dot(a, b) / (na * nb)));
  return { u: a, v: b, angle };
}

/** All coordinate planes (i < j) of R^n. */
export const coordinatePlanes = (n) => {
  const out = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]);
  return out;
};

/** Embed a vector in a higher dimension by appending zeros (the same arrow, more coordinates). */
export const pad = (x, n) => [...x, ...Array(Math.max(0, n - x.length)).fill(0)];

/**
 * The orthogonality signature (H1-1) for a basis {e_k} of R^n and a vector x.
 * Holds all at once when the basis is orthonormal:
 *   crossTerms     max |G_ij|, i ≠ j                     (zero cross terms)
 *   reconError     ‖x − Σ ⟨x,e_k⟩ e_k‖                    (independent projection coefficients)
 *   parsevalGap    ‖x‖² − Σ ⟨x,e_k⟩²                      (Pythagorean/Parseval additivity)
 *   residualMax    max_{j<r} |⟨x − Σ_{k<r} ⟨x,e_k⟩e_k, e_j⟩| (residual ⟂ the r retained components)
 */
export function basisSignature(basis, x, retained = Math.max(1, basis.length >> 1)) {
  const G = basis.map((a) => basis.map((b) => dot(a, b)));
  let crossTerms = 0;
  let diagDeviation = 0;
  G.forEach((row, i) =>
    row.forEach((g, j) => {
      if (i === j) diagDeviation = Math.max(diagDeviation, Math.abs(g - 1));
      else crossTerms = Math.max(crossTerms, Math.abs(g));
    }),
  );
  const coeffs = basis.map((e) => dot(x, e));
  const recon = basis.reduce((s, e, k) => add(s, scale(e, coeffs[k])), x.map(() => 0));
  const kept = basis.slice(0, retained).reduce((s, e, k) => add(s, scale(e, coeffs[k])), x.map(() => 0));
  const residual = sub(x, kept);
  const residualMax = Math.max(...basis.slice(0, retained).map((e) => Math.abs(dot(residual, e))));
  return {
    G,
    crossTerms,
    diagDeviation,
    coeffs,
    reconError: norm(sub(x, recon)),
    parsevalGap: dot(x, x) - coeffs.reduce((s, a) => s + a * a, 0),
    residualMax,
    retained,
  };
}

// Deterministic directions for perturbing a basis (so a slider position always means the same basis).
const WOBBLE = [
  [0.31, -0.62, 0.48, 0.17, -0.25, 0.4, -0.11, 0.2],
  [-0.54, 0.12, 0.33, -0.71, 0.3, -0.18, 0.44, -0.09],
  [0.22, 0.47, -0.65, 0.09, 0.51, 0.13, -0.36, 0.28],
  [0.6, 0.05, -0.21, -0.38, -0.14, 0.52, 0.27, -0.43],
  [-0.12, -0.33, 0.19, 0.58, -0.46, 0.07, 0.35, 0.31],
  [0.41, -0.2, -0.09, 0.26, 0.36, -0.57, 0.15, 0.24],
  [-0.27, 0.38, 0.52, -0.13, 0.08, 0.29, -0.6, 0.16],
  [0.15, 0.24, -0.36, 0.44, -0.53, -0.22, 0.12, 0.49],
];

/** An orthonormal basis of R^n (a fixed rotation of the standard basis, built by Gram–Schmidt). */
export function tiltedOrthonormalBasis(n) {
  const out = [];
  for (let k = 0; k < n; k++) {
    let w = Array.from({ length: n }, (_, i) => (i === k ? 1 : 0) + 0.35 * WOBBLE[k][i]);
    for (const e of out) w = sub(w, scale(e, dot(w, e)));
    out.push(scale(w, 1 / norm(w)));
  }
  return out;
}

/** Push an orthonormal basis away from orthogonality by ε, keeping every vector unit length. */
export const perturbBasis = (basis, eps) =>
  basis.map((e, k) => {
    const w = add(e, scale(WOBBLE[(k + 3) % WOBBLE.length].slice(0, e.length), eps));
    return scale(w, 1 / norm(w));
  });

// ── Functions on [0, L]: the same relationship with a continuum of contributions f(t)g(t) dt ──

/** Samples of a trig function at the left endpoints t_j = jL/N: the function as a vector in R^N. */
export function sampleWave(f, N, L = 2 * Math.PI) {
  return Array.from({ length: N }, (_, j) => basisValue(f, (j * L) / N));
}

/** (L/N) Σ f(t_j) g(t_j): the R^N inner product of the samples, scaled so it approaches ∫ f g. */
export function sampledInner(f, g, N, L = 2 * Math.PI) {
  const a = sampleWave(f, N, L);
  const b = sampleWave(g, N, L);
  return (L / N) * dot(a, b);
}

/** Exact ∫₀ᴸ f g dt (closed form from the Fourier module). */
export const functionInner = (f, g, L = 2 * Math.PI) => basisInner(f, g, L);

/**
 * The product curve f(t)g(t) on [0, L] for drawing its signed area, with the running integral
 * (cumulative trapezoid). The final running value matches functionInner to O(1/samples²).
 */
export function productCurve(f, g, L = 2 * Math.PI, samples = 600) {
  const t = new Float64Array(samples + 1);
  const fv = new Float64Array(samples + 1);
  const gv = new Float64Array(samples + 1);
  const p = new Float64Array(samples + 1);
  const run = new Float64Array(samples + 1);
  for (let i = 0; i <= samples; i++) {
    t[i] = (L * i) / samples;
    fv[i] = basisValue(f, t[i]);
    gv[i] = basisValue(g, t[i]);
    p[i] = fv[i] * gv[i];
    if (i > 0) run[i] = run[i - 1] + ((p[i] + p[i - 1]) / 2) * (t[i] - t[i - 1]);
  }
  let positive = 0;
  let negative = 0;
  for (let i = 1; i <= samples; i++) {
    const area = ((p[i] + p[i - 1]) / 2) * (t[i] - t[i - 1]);
    if (area > 0) positive += area;
    else negative += area;
  }
  return { t, f: fv, g: gv, product: p, running: run, positive, negative };
}

/** Gram matrix of the normalised trig basis {cos kt/√π, sin kt/√π} over [0, L]. Equals I at L = 2π. */
export const normalisedTrigGram = (basis, L) => basisGram(basis, L).map((row) => row.map((g) => g / Math.PI));
