// Block 5 — Translation symmetry, autocorrelation, and the symmetry defect.
//   D_x(g) = ‖x − U_g x‖² / (2‖x‖²),   for unitary U:  D_x(τ) = 1 − ρ_x(τ)
//
// Signals are almost-periodic tone sums x(t) = Σ A_k cos(ω_k t + φ_k) with the time-average
// inner product ⟨x,y⟩ = lim (1/2T)∫₋ᵀᵀ x y dt. Under it, shifting is unitary and
//   ρ(τ) = Σ A_k² cos(ω_k τ) / Σ A_k²      (Wiener–Khinchin: ρ only sees the power spectrum)
// so D does not depend on the phases φ_k at all. A single Gaussian pulse is handled in L²(ℝ).

export const tonesValue = (tones, t) => tones.reduce((s, { A, w, phi = 0 }) => s + A * Math.cos(w * t + phi), 0);

/** Closed-form ρ(τ) from the spectrum. */
export function rhoTones(tones, tau) {
  let num = 0;
  let den = 0;
  for (const { A, w } of tones) {
    num += A * A * Math.cos(w * tau);
    den += A * A;
  }
  return num / den;
}

export const defectTones = (tones, tau) => 1 - rhoTones(tones, tau);

/**
 * The same defect measured directly on the waveform: time averages over [0, window].
 * Converges to the closed form at rate O(1/window); the gap is the live verifier's error.
 */
export function defectTonesNumeric(tones, tau, { window = 600, samples = 60000 } = {}) {
  const h = window / samples;
  let diff = 0;
  let energy = 0;
  for (let i = 0; i < samples; i++) {
    const t = (i + 0.5) * h;
    const x = tonesValue(tones, t);
    const y = tonesValue(tones, t + tau);
    diff += (x - y) ** 2;
    energy += x * x;
  }
  return diff / (2 * energy);
}

/** Two-tone family x = a₁cos t + a₂cos(rt + φ): the landscape D(τ, r). */
export const twoTone = (r, { a1 = 1, a2 = 1, phi = 0 } = {}) => [
  { A: a1, w: 1, phi: 0 },
  { A: a2, w: r, phi },
];

export function defectLandscape({ tauMax = 8 * Math.PI, rMin = 0.5, rMax = 3, nTau = 240, nR = 120, a1 = 1, a2 = 1 } = {}) {
  const z = new Float64Array(nTau * nR);
  for (let i = 0; i < nR; i++) {
    const r = rMin + ((rMax - rMin) * i) / (nR - 1);
    const tones = twoTone(r, { a1, a2 });
    for (let j = 0; j < nTau; j++) z[i * nTau + j] = defectTones(tones, (tauMax * j) / (nTau - 1));
  }
  return { z, nTau, nR, tauMax, rMin, rMax };
}

/**
 * The translation orbit of a two-tone signal lives on a torus: the state after shift τ is fixed by
 * the phase pair (τ mod 2π, rτ mod 2π). Rational r closes the loop; irrational r winds densely.
 * (The orbit is a flat Clifford torus in function space; the 3D doughnut is its topological picture.)
 */
export function torusOrbit(r, { tauMax = 40 * Math.PI, samples = 4000 } = {}) {
  return Array.from({ length: samples }, (_, i) => {
    const tau = (tauMax * i) / (samples - 1);
    return { tau, theta1: tau % (2 * Math.PI), theta2: (r * tau) % (2 * Math.PI) };
  });
}

/** Continued-fraction convergents p/q of r. Shifts τ = 2πq give the deepest near-symmetries. */
export function convergents(r, count = 6) {
  const out = [];
  let [p0, q0, p1, q1] = [1, 0, Math.floor(r), 1];
  let x = r;
  out.push({ p: p1, q: q1 });
  for (let i = 1; i < count; i++) {
    const frac = x - Math.floor(x);
    if (frac < 1e-12) break;
    x = 1 / frac;
    const a = Math.floor(x);
    [p0, q0, p1, q1] = [p1, q1, a * p1 + p0, a * q1 + q0];
    out.push({ p: p1, q: q1 });
  }
  return out;
}

/** Local minima of D over a sampled τ range: the valleys where the shifted copy nearly coincides. */
export function valleys(tones, { tauMax = 8 * Math.PI, n = 4000, below = 0.2 } = {}) {
  const d = Array.from({ length: n }, (_, i) => defectTones(tones, (tauMax * i) / (n - 1)));
  const out = [];
  for (let i = 1; i < n - 1; i++) {
    if (d[i] < d[i - 1] && d[i] <= d[i + 1] && d[i] < below) out.push({ tau: (tauMax * i) / (n - 1), D: d[i] });
  }
  return out;
}

/** Gaussian pulse e^{−t²/2σ²} in L²(ℝ): ρ(τ) = e^{−τ²/4σ²}. Never returns to itself. */
export const defectPulse = (sigma, tau) => 1 - Math.exp(-(tau * tau) / (4 * sigma * sigma));
