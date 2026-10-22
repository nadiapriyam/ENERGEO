// Blocks 3–4 — Fourier as a change of representation, and Parseval.
// Signals are finite trig sums on [0, T), T = 2π/ω₀:
//   x(t) = Σ_k a_k cos(kω₀t) + b_k sin(kω₀t)
// The same object is stored as coefficients (frequency view) and sampled values (time view).

import { cholesky } from './linalg.js';

export const TWO_PI = 2 * Math.PI;

/** A basis function: { kind: 'cos' | 'sin', k } with angular frequency kω₀. */
export const basisValue = ({ kind, k }, t, w0 = 1) => (kind === 'cos' ? Math.cos(k * w0 * t) : Math.sin(k * w0 * t));

/**
 * ∫₀ᴸ f(t)g(t) dt for two trig basis functions, in closed form.
 * Over a whole period (L = T) distinct functions integrate to 0 — that is orthogonality.
 * Over any other L the off-diagonal entries generally don't vanish.
 */
export function basisInner(f, g, L, w0 = 1) {
  const a = f.k * w0;
  const b = g.k * w0;
  // ∫₀ᴸ cos(pt) dt and ∫₀ᴸ sin(pt) dt, with the p → 0 limits
  const C = (p) => (Math.abs(p) < 1e-12 ? L : Math.sin(p * L) / p);
  const S = (p) => (Math.abs(p) < 1e-12 ? 0 : (1 - Math.cos(p * L)) / p);
  if (f.kind === 'cos' && g.kind === 'cos') return 0.5 * (C(a - b) + C(a + b));
  if (f.kind === 'sin' && g.kind === 'sin') return 0.5 * (C(a - b) - C(a + b));
  // sin(at)cos(bt) = ½[sin((a+b)t) + sin((a−b)t)]
  const [s, c] = f.kind === 'sin' ? [a, b] : [b, a];
  return 0.5 * (S(s + c) + S(s - c));
}

/** Gram matrix of a list of basis functions over [0, L]. */
export const basisGram = (basis, L, w0 = 1) => basis.map((f) => basis.map((g) => basisInner(f, g, L, w0)));

/** Standard real basis {cos kω₀t, sin kω₀t : k = 1..N}. */
export const trigBasis = (N) =>
  Array.from({ length: N }, (_, i) => [
    { kind: 'cos', k: i + 1 },
    { kind: 'sin', k: i + 1 },
  ]).flat();

/**
 * Components: [{ k, a, b }] meaning a·cos(kω₀t) + b·sin(kω₀t).
 * Amplitude A_k = √(a²+b²), phase φ_k with a cos + b sin = A cos(kω₀t − φ).
 */
export const amplitude = ({ a, b }) => Math.hypot(a, b);
export const phase = ({ a, b }) => Math.atan2(b, a);

export const componentValue = (c, t, w0 = 1) => c.a * Math.cos(c.k * w0 * t) + c.b * Math.sin(c.k * w0 * t);
export const signalValue = (components, t, w0 = 1) => components.reduce((s, c) => s + componentValue(c, t, w0), 0);

export function sample(components, { n = 512, T = TWO_PI, w0 = TWO_PI / T } = {}) {
  const t = new Float64Array(n);
  const x = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    t[i] = (T * i) / n;
    x[i] = signalValue(components, t[i], w0);
  }
  return { t, x };
}

/** In-place iterative radix-2 FFT. re/im lengths must be a power of two. */
export function fft(re, im) {
  const n = re.length;
  if (n & (n - 1)) throw new Error('fft length must be a power of two');
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -TWO_PI / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const ur = re[i + j];
        const ui = im[i + j];
        const vr = re[i + j + len / 2] * cr - im[i + j + len / 2] * ci;
        const vi = re[i + j + len / 2] * ci + im[i + j + len / 2] * cr;
        re[i + j] = ur + vr;
        im[i + j] = ui + vi;
        re[i + j + len / 2] = ur - vr;
        im[i + j + len / 2] = ui - vi;
        const t = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = t;
      }
    }
  }
}

/**
 * Spectrum of real samples x[0..n): returns |X_k| and arg X_k for k = 0..n/2,
 * plus the one-sided amplitude estimate 2|X_k|/n, which equals A_k for a pure trig sum.
 */
export function spectrum(x) {
  const n = x.length;
  const re = Float64Array.from(x);
  const im = new Float64Array(n);
  fft(re, im);
  const half = n / 2 + 1;
  const mag = new Float64Array(half);
  const arg = new Float64Array(half);
  const amp = new Float64Array(half);
  for (let k = 0; k < half; k++) {
    mag[k] = Math.hypot(re[k], im[k]);
    arg[k] = Math.atan2(im[k], re[k]);
    amp[k] = (k === 0 || k === n / 2 ? 1 : 2) * (mag[k] / n);
  }
  return { re, im, mag, arg, amp };
}

/** Discrete Parseval: Σ|x_n|² and (1/N)Σ|X_k|², which must agree. */
export function discreteParseval(x) {
  const n = x.length;
  const re = Float64Array.from(x);
  const im = new Float64Array(n);
  fft(re, im);
  let time = 0;
  let freq = 0;
  for (let i = 0; i < n; i++) {
    time += x[i] * x[i];
    freq += re[i] * re[i] + im[i] * im[i];
  }
  return { time, freq: freq / n };
}

/** Composite Simpson's rule on [lo, hi] with an even number of panels. */
export function simpson(f, lo, hi, panels = 2048) {
  const n = panels + (panels % 2);
  const h = (hi - lo) / n;
  let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(lo + i * h);
  return (s * h) / 3;
}

/** ∫₀ᵀ |x(t)|² dt for the time view, and (T/2)Σ A_k² for the coefficient view. */
export function continuousParseval(components, T = TWO_PI) {
  const w0 = TWO_PI / T;
  const time = simpson((t) => signalValue(components, t, w0) ** 2, 0, T, 4096);
  const freq = (T / 2) * components.reduce((s, c) => s + c.a * c.a + c.b * c.b, 0);
  return { time, freq };
}

/**
 * Parseval decomposition for a sum of parts x = x₁ + x₂ + x₃ over [0, L].
 * Each part is one trig component. Returns the Gram matrix G_ij = ⟨x_i, x_j⟩,
 * the "Pythagoras" total Σ‖x_i‖², the cross-term total 2Σ_{i<j}⟨x_i,x_j⟩, and ‖x‖².
 *
 * embedding: vectors v_i ∈ R³ with v_i·v_j = G_ij (rows of the Cholesky factor).
 * Drawing v_i is a faithful picture of the parts inside function space:
 * lengths and angles are the L² ones.
 */
export function partsGeometry(parts, L, w0 = 1) {
  const G = parts.map((p) => parts.map((q) => partInner(p, q, L, w0)));
  const pyth = G.reduce((s, row, i) => s + row[i], 0);
  let crossTerm = 0;
  for (let i = 0; i < G.length; i++) for (let j = i + 1; j < G.length; j++) crossTerm += 2 * G[i][j];
  const total = pyth + crossTerm;
  const L_ = cholesky(G);
  return { G, pyth, crossTerm, total, embedding: L_ };
}

/** ⟨p, q⟩ over [0, L] for components p = a cos + b sin at harmonic k. */
export function partInner(p, q, L, w0 = 1) {
  const cp = { kind: 'cos', k: p.k };
  const sp = { kind: 'sin', k: p.k };
  const cq = { kind: 'cos', k: q.k };
  const sq = { kind: 'sin', k: q.k };
  return (
    p.a * q.a * basisInner(cp, cq, L, w0) +
    p.a * q.b * basisInner(cp, sq, L, w0) +
    p.b * q.a * basisInner(sp, cq, L, w0) +
    p.b * q.b * basisInner(sp, sq, L, w0)
  );
}
