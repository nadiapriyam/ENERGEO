// Chapter I — Changing the Meaning of 0. Three measurements whose zero holds nonzero objects:
//   stage 1   F(v, w) = v + w                      (two vectors in R²)
//   stage 2   F(m) = Σ m_j                         (directional contributions in R³, no positions)
//   stage 3   F(R) = Σ m_i (r_i − R)               (positive point masses in R², a candidate origin R)
// "exact" is a property of how a state was constructed, never of a floating-point comparison; the numerical
// residual is reported separately. ZERO_TOL only decides whether a dragged state counts as near zero.

import { add, sub, scale, norm, matVec, cross, rotationAxisAngle } from './linalg.js';

export const ZERO_TOL = 0.04;
export const MIN_LENGTH = 0.25; // every contribution stays visibly nonzero

/** Σ v_j, summed left to right from the zero vector. The order fixes the floating-point residual. */
export function resultant(vs) {
  let s = vs[0].map(() => 0);
  for (const v of vs) s = add(s, v);
  return s;
}

// ── Stage 1 ──────────────────────────────────────────────────────────────────────────────────────

export function pairResultant(v, w) {
  const r = add(v, w);
  return { r, size: norm(r), lengths: [norm(v), norm(w)] };
}

// ── Stage 2 ──────────────────────────────────────────────────────────────────────────────────────

const T = 1 / Math.sqrt(3);
/** Four directions to the corners of a regular tetrahedron. Their sum is 0 exactly, also in floating point. */
export const TETRA = [[T, T, T], [T, -T, -T], [-T, T, -T], [-T, -T, T]];

/** The first constructed state: four contributions of equal length whose resultant is exactly zero. */
export const tetraConfiguration = (length = 1.6) => TETRA.map((d) => scale(d, length));

export const fromAngles = (az, el, length) => [length * Math.cos(el) * Math.cos(az), length * Math.cos(el) * Math.sin(az), length * Math.sin(el)];
export function anglesOf(v) {
  const L = norm(v);
  return { az: Math.atan2(v[1], v[0]), el: L > 0 ? Math.asin(Math.max(-1, Math.min(1, v[2] / L))) : 0, length: L };
}

/**
 * Keep the resultant at zero by letting contribution c absorb every change: m_c = −Σ_{j≠c} m_j.
 * Exact by construction. ok is false when m_c would become too short (every contribution must stay nonzero).
 */
export function completeToZero(ms, c) {
  const mc = scale(resultant(ms.filter((_, j) => j !== c)), -1);
  return { ms: ms.map((m, j) => (j === c ? mc : m)), ok: norm(mc) >= MIN_LENGTH };
}

function perpendicular(v) {
  const t = Math.abs(v[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  return cross(v, t);
}

/**
 * Turn contributions i and j together about the line of their sum. Their sum is unchanged (a rotation fixes its
 * own axis), so the resultant is unchanged too, while both contributions change. If m_i + m_j = 0 any axis works.
 */
export function pairTwist(ms, i, j, angle) {
  const s = add(ms[i], ms[j]);
  const axis = norm(s) > 1e-9 ? s : perpendicular(ms[i]);
  const R = rotationAxisAngle(axis, angle);
  return ms.map((m, k) => (k === i || k === j ? matVec(R, m) : m));
}

/** Changes the learner can test in stage 3b. Each returns a new configuration; none is applied by default. */
export const CHANGES = {
  turnAll: (ms, R) => ms.map((m) => matVec(R, m)),
  scaleAll: (ms, s) => ms.map((m) => scale(m, s)),
  reverseAll: (ms) => ms.map((m) => scale(m, -1)),
  swap: (ms, i, j) => ms.map((m, k) => (k === i ? ms[j] : k === j ? ms[i] : m)),
  turnOne: (ms, i, R) => ms.map((m, k) => (k === i ? matVec(R, m) : m)),
  scaleOne: (ms, i, s) => ms.map((m, k) => (k === i ? scale(m, s) : m)),
};

/** A small deterministic generator, so a "new configuration" can be reproduced from its seed. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Another exact-zero configuration of n contributions with different directions and lengths. */
export function randomZeroConfiguration(n, seed) {
  const r = rng(seed);
  for (let tries = 0; tries < 200; tries++) {
    const ms = Array.from({ length: n - 1 }, () => fromAngles(r() * 2 * Math.PI, Math.asin(2 * r() - 1), 0.8 + 1.2 * r()));
    ms.push([0, 0, 0]);
    const out = completeToZero(ms, n - 1);
    const last = norm(out.ms[n - 1]);
    if (out.ok && last >= 0.6 && last <= 2.6) return out.ms;
  }
  return tetraConfiguration();
}

// ── Stage 3 ──────────────────────────────────────────────────────────────────────────────────────

export const totalMass = (masses) => masses.reduce((a, b) => a + b, 0);

/** The weighted displacements m_i (r_i − R) and their sum F(R). */
export function firstMoment(masses, positions, R) {
  const terms = positions.map((r, i) => scale(sub(r, R), masses[i]));
  return { terms, F: resultant(terms) };
}

/** Σ m_i r_i / Σ m_i, for positive masses. */
export function balancingPoint(masses, positions) {
  const M = totalMass(masses);
  return scale(resultant(positions.map((r, i) => scale(r, masses[i]))), 1 / M);
}
