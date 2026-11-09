// Stage 2b: two spin-½ particles. A separate, exact quantum-mechanical case: it is not a model of the ensemble
// cancellation of stage 2 (the MRI intuition behind the project), and nothing here treats it as one.
// Basis order |↑↑⟩, |↑↓⟩, |↓↑⟩, |↓↓⟩. Values are in units of ħ (S_z) and ħ² (S²).

import { matVec, dot, norm, sub, scale, matMul } from './linalg.js';

export const BASIS = ['↑↑', '↑↓', '↓↑', '↓↓'];
const r = Math.SQRT1_2;
/** The two states of the stage, by their insides: A = (|↑↓⟩ + |↓↑⟩)/√2, B = (|↑↓⟩ − |↓↑⟩)/√2. */
export const STATE_A = [0, r, r, 0];
export const STATE_B = [0, r, -r, 0];

/** Total S_z = S_z,1 + S_z,2, diagonal in this basis: ħ (1, 0, 0, −1). */
export const SZ = [
  [1, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, -1],
];

/**
 * Total S² = S_x² + S_y² + S_z², in units of ħ². σ_y is complex, but S² comes out real:
 * S² = (3/2) I + (1/2)(σ_x⊗σ_x + σ_y⊗σ_y + σ_z⊗σ_z). Card Q1b derives it symbolically from the Pauli matrices.
 */
export const S2 = [
  [2, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 2],
];

/**
 * What a measurement of Op returns on psi. When psi is an eigenvector the outcome is certain: `definite` is true and
 * `value` is the eigenvalue; `residual` is |Op psi − value psi|, which is 0 exactly for these states.
 */
export function reading(Op, psi) {
  const v = matVec(Op, psi);
  const value = dot(psi, v) / dot(psi, psi);
  const residual = norm(sub(v, scale(psi, value)));
  return { value, residual, definite: residual < 1e-12 };
}

/** Two states are the same physical state only if one is a phase multiple of the other (real amplitudes: ±1). */
export const sameState = (a, b) => Math.abs(Math.abs(dot(a, b)) - norm(a) * norm(b)) < 1e-12;

export const commutes = (P, Q) => {
  const a = matMul(P, Q);
  const b = matMul(Q, P);
  return a.every((row, i) => row.every((x, j) => Math.abs(x - b[i][j]) < 1e-12));
};
