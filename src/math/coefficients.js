// Fourier coefficients and orthonormal bases (Master Map 7), in the form of your evidence (C4b):
//   e_k(t) = e^{2πikt} on [0, 1],   ⟨f, g⟩ = ∫₀¹ f(t) conj(g(t)) dt,   f̂(k) = ⟨f, e_k⟩,   f = Σ f̂(k) e_k.
//
// Signals here are real and built from harmonics k = 1..K, so f̂(−k) = conj(f̂(k)) and
//   f(t) = Σ_{k=1}^{K} 2 Re( f̂(k) e^{2πikt} ).
// A complex number is a pair [re, im]; `coeffs[k−1]` is f̂(k).
//
// The bridge into Orthogonality and Zero: the arrow of harmonic k is √2·f̂(k), drawn in the complex plane.
// For real signals  ⟨f, g⟩ = Σ_{k≠0} f̂(k) conj(ĝ(k)) = Σ_{k≥1} (√2 f̂(k))·(√2 ĝ(k)),
// so the dot product of coefficient arrows is the inner product of the waves, exactly.

const TAU = 2 * Math.PI;

// ── complex arithmetic on [re, im] ──
export const cx = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
  mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
  conj: (a) => [a[0], -a[1]],
  scale: (a, s) => [a[0] * s, a[1] * s],
  abs: (a) => Math.hypot(a[0], a[1]),
  arg: (a) => Math.atan2(a[1], a[0]),
  expi: (th) => [Math.cos(th), Math.sin(th)],
};

/** The k-th component f_k(t) = 2 Re( f̂(k) e^{2πikt} ). */
export const componentValue = (c, k, t) => 2 * (c[0] * Math.cos(TAU * k * t) - c[1] * Math.sin(TAU * k * t));

export const signalValue = (coeffs, t, active = null) =>
  coeffs.reduce((s, c, i) => s + (active && !active[i] ? 0 : componentValue(c, i + 1, t)), 0);

/** The signal and each of its components, sampled on [0, 1]. */
export function sampleSignal(coeffs, { M = 400, active = null } = {}) {
  const t = Array.from({ length: M + 1 }, (_, i) => i / M);
  return {
    t,
    f: t.map((x) => signalValue(coeffs, x, active)),
    comps: coeffs.map((c, i) => t.map((x) => componentValue(c, i + 1, x))),
  };
}

/** ‖f‖² = Σ_{k≠0} |f̂(k)|² = 2 Σ_{k≥1} |f̂(k)|² (Parseval), and the share of each harmonic. */
export function energy(coeffs, active = null) {
  const parts = coeffs.map((c, i) => (active && !active[i] ? 0 : 2 * (c[0] * c[0] + c[1] * c[1])));
  return { parts, total: parts.reduce((s, x) => s + x, 0) };
}

/** ∫₀¹ f(t)² dt computed from samples (the time side of Parseval). Exact for M > 2K by discrete orthogonality. */
export function energyFromSamples(coeffs, { M = 256, active = null } = {}) {
  let s = 0;
  for (let j = 0; j < M; j++) s += signalValue(coeffs, j / M, active) ** 2;
  return s / M;
}

/**
 * The projection ⟨f, e_k⟩ = ∫₀¹ f(t) e^{−2πikt} dt, computed (not assumed) as the average of the wound curve
 * w(t) = f(t) e^{−2πikt} over M equally spaced points. Exact for M > K + k (no aliasing).
 * Returns the curve for drawing and its centroid, which is the coefficient.
 */
export function winding(coeffs, k, { M = 720, active = null } = {}) {
  const re = [];
  const im = [];
  const t = [];
  let sr = 0;
  let si = 0;
  for (let j = 0; j <= M; j++) {
    const x = j / M;
    const fx = signalValue(coeffs, x, active);
    const w = cx.scale(cx.expi(-TAU * k * x), fx);
    t.push(x);
    re.push(w[0]);
    im.push(w[1]);
    if (j < M) {
      sr += w[0];
      si += w[1];
    }
  }
  return { t, re, im, centroid: [sr / M, si / M] };
}

/**
 * What each component f_j contributes to the projection onto e_k: ⟨f_j, e_k⟩, computed numerically.
 * With an orthonormal basis this is f̂(k) for j = k and 0 (up to floating point) for every other j.
 */
export function componentProjections(coeffs, k, { M = 256 } = {}) {
  return coeffs.map((c, i) => {
    let sr = 0;
    let si = 0;
    for (let j = 0; j < M; j++) {
      const x = j / M;
      const w = cx.scale(cx.expi(-TAU * k * x), componentValue(c, i + 1, x));
      sr += w[0];
      si += w[1];
    }
    return [sr / M, si / M];
  });
}

// ── A perturbed Fourier basis (cross-talk) ──
// Index order of the complex basis: −K..−1, 1..K. A basis vector is its (real) coefficient vector over e_j.
// The perturbation keeps ẽ_{−k} = conj(ẽ_k), so a real signal still rebuilds to a real signal.

export const fourierIndex = (K) => [...Array.from({ length: K }, (_, i) => -(K - i)), ...Array.from({ length: K }, (_, i) => i + 1)];

const MIX = [
  [0.0, 0.35, -0.2, 0.0, 0.45, -0.3],
  [0.25, 0.0, 0.4, -0.35, 0.0, 0.2],
  [-0.3, 0.2, 0.0, 0.5, -0.25, 0.0],
];

export function perturbedFourierBasis(K, eps) {
  const idx = fourierIndex(K);
  const n = idx.length;
  const pos = (j) => idx.indexOf(j);
  const basis = new Array(n);
  for (let k = 1; k <= K; k++) {
    const v = Array(n).fill(0);
    v[pos(k)] = 1;
    for (let j = 0; j < n; j++) v[j] += eps * (MIX[(k - 1) % MIX.length][j % 6] ?? 0);
    const nv = Math.hypot(...v);
    basis[pos(k)] = v.map((x) => x / nv);
    // conj(Σ c_j e_j) = Σ c_j e_{−j} for real c_j
    basis[pos(-k)] = idx.map((j) => basis[pos(k)][pos(-j)]);
  }
  return { idx, basis };
}

/** The signal as a complex coefficient vector over fourierIndex(K). */
export const coefficientVector = (coeffs, active = null) => {
  const K = coeffs.length;
  return fourierIndex(K).map((j) => {
    const c = coeffs[Math.abs(j) - 1];
    if (active && !active[Math.abs(j) - 1]) return [0, 0];
    return j > 0 ? c : cx.conj(c);
  });
};

/**
 * Naive projection coefficients in a (possibly non-orthogonal) basis, and what they do.
 *   G           Gram matrix ⟨ẽ_i, ẽ_j⟩ (real here)
 *   naive[k]    ã_k = ⟨f, ẽ_k⟩, in fourierIndex order
 *   rebuilt     coefficient vector of Σ ã_k ẽ_k
 *   rebuildError ‖f − Σ ã_k ẽ_k‖
 *   parsevalGap ‖f‖² − Σ |ã_k|²
 */
export function crosstalk(coeffs, eps, active = null) {
  const K = coeffs.length;
  const { idx, basis } = perturbedFourierBasis(K, eps);
  const F = coefficientVector(coeffs, active);
  const n = idx.length;
  const G = basis.map((a) => basis.map((b) => a.reduce((s, x, i) => s + x * b[i], 0)));
  const naive = basis.map((b) => F.reduce((s, Fj, j) => cx.add(s, cx.scale(Fj, b[j])), [0, 0]));
  const rebuilt = Array.from({ length: n }, (_, j) => basis.reduce((s, b, k) => cx.add(s, cx.scale(naive[k], b[j])), [0, 0]));
  const rebuildError = Math.sqrt(F.reduce((s, Fj, j) => s + cx.abs(cx.sub(Fj, rebuilt[j])) ** 2, 0));
  const norm2 = F.reduce((s, Fj) => s + cx.abs(Fj) ** 2, 0);
  const parsevalGap = norm2 - naive.reduce((s, a) => s + cx.abs(a) ** 2, 0);
  let crossTerms = 0;
  G.forEach((row, i) => row.forEach((g, j) => { if (i !== j) crossTerms = Math.max(crossTerms, Math.abs(g)); }));
  return { idx, basis, G, naive, rebuilt, rebuildError, parsevalGap, crossTerms, F };
}

/** Value at t of a function given by a complex coefficient vector over fourierIndex(K). */
export function valueFromVector(vec, K, t) {
  return fourierIndex(K).reduce((s, j, i) => s + vec[i][0] * Math.cos(TAU * j * t) - vec[i][1] * Math.sin(TAU * j * t), 0);
}

// ── Arrows: the hand-off into Orthogonality and Zero ──

export const arrowOf = (c) => [Math.SQRT2 * c[0], Math.SQRT2 * c[1]];
export const coeffOf = (a) => [a[0] / Math.SQRT2, a[1] / Math.SQRT2];

/** Real coordinates x ∈ R^{2K} (pairs = arrows √2 f̂(k)) to the wave f(t) = Σ √2 (x_{2k−1} cos 2πkt − x_{2k} sin 2πkt). */
export function waveFromCoords(x, t) {
  let s = 0;
  for (let i = 0; i < x.length; i += 2) {
    const k = i / 2 + 1;
    s += Math.SQRT2 * ((x[i] ?? 0) * Math.cos(TAU * k * t) - (x[i + 1] ?? 0) * Math.sin(TAU * k * t));
  }
  return s;
}

export const coeffsFromCoords = (x) => {
  const out = [];
  for (let i = 0; i < x.length; i += 2) out.push(coeffOf([x[i], x[i + 1] ?? 0]));
  return out;
};

/** The real orthonormal basis behind the coordinates: b_{2k−1} = √2 cos 2πkt, b_{2k} = −√2 sin 2πkt. */
export const realBasisValue = (i, t) => {
  const k = Math.floor(i / 2) + 1;
  return i % 2 === 0 ? Math.SQRT2 * Math.cos(TAU * k * t) : -Math.SQRT2 * Math.sin(TAU * k * t);
};

/** ∫₀ᴸ b_i b_j dt in closed form. Over [0,1] this is the identity; over [0,2] it is 2I. */
export function realBasisGram(n, L) {
  const k = (i) => Math.floor(i / 2) + 1;
  const sgn = (i) => (i % 2 === 0 ? 1 : -1);
  const kind = (i) => (i % 2 === 0 ? 'cos' : 'sin');
  const C = (p) => (Math.abs(p) < 1e-12 ? L : Math.sin(p * L) / p);
  const S = (p) => (Math.abs(p) < 1e-12 ? 0 : (1 - Math.cos(p * L)) / p);
  const inner = (i, j) => {
    const a = TAU * k(i);
    const b = TAU * k(j);
    let v;
    if (kind(i) === 'cos' && kind(j) === 'cos') v = 0.5 * (C(a - b) + C(a + b));
    else if (kind(i) === 'sin' && kind(j) === 'sin') v = 0.5 * (C(a - b) - C(a + b));
    else {
      const [sa, ca] = kind(i) === 'sin' ? [a, b] : [b, a];
      v = 0.5 * (S(sa + ca) + S(sa - ca));
    }
    return 2 * sgn(i) * sgn(j) * v;
  };
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => inner(i, j)));
}

/** ∫₀ᴸ f g dt for waves given by coordinates, in closed form: xᵀ G(L) y. */
export function intervalInner(x, y, L) {
  const G = realBasisGram(x.length, L);
  return x.reduce((s, xi, i) => s + xi * y.reduce((r, yj, j) => r + G[i][j] * yj, 0), 0);
}

/** The product curve f(t)g(t) on [0, L] with its running integral, for waves given by coordinates. */
export function productCurveCoords(x, y, L, samples = 600) {
  const t = new Float64Array(samples + 1);
  const f = new Float64Array(samples + 1);
  const g = new Float64Array(samples + 1);
  const product = new Float64Array(samples + 1);
  const running = new Float64Array(samples + 1);
  let positive = 0;
  let negative = 0;
  for (let i = 0; i <= samples; i++) {
    t[i] = (L * i) / samples;
    f[i] = waveFromCoords(x, t[i]);
    g[i] = waveFromCoords(y, t[i]);
    product[i] = f[i] * g[i];
    if (i > 0) {
      const area = ((product[i] + product[i - 1]) / 2) * (t[i] - t[i - 1]);
      running[i] = running[i - 1] + area;
      if (area > 0) positive += area;
      else negative += area;
    }
  }
  return { t, f, g, product, running, positive, negative };
}

/** (1/N) Σ_j f(t_j) g(t_j) at t_j = j/N: the sampled inner product of two waves given by coordinates. */
export function sampledInnerCoords(x, y, N) {
  let s = 0;
  for (let j = 0; j < N; j++) s += waveFromCoords(x, j / N) * waveFromCoords(y, j / N);
  return s / N;
}

/**
 * The exact sampled value from roots of unity: (1/N) Σ_j e^{2πi(k+l)j/N} is 1 when N divides k + l, else 0, so
 *   (1/N) Σ_j f(t_j) g(t_j) = Σ_{k,l ≠ 0, N | k+l} f̂(k) ĝ(l).
 * The true inner product keeps only k + l = 0; every other term is aliasing. For harmonics up to K, N > 2K removes them.
 */
export function sampledPredictedCoords(x, y, N) {
  return rootOfUnitySum(x, y, N, true);
}

/**
 * Only the aliased terms: Σ over N | k + l, k + l ≠ 0, of f̂(k) ĝ(l). The sampled sum is u·v plus this.
 * It is exactly 0 (not merely small) when every aliased pair involves a coefficient that is exactly 0.
 */
export function aliasedCoords(x, y, N) {
  return rootOfUnitySum(x, y, N, false);
}

function rootOfUnitySum(x, y, N, includeTrue) {
  const F = coefficientVector(coeffsFromCoords(x));
  const Gv = coefficientVector(coeffsFromCoords(y));
  const idx = fourierIndex(F.length / 2);
  let s = [0, 0];
  idx.forEach((k, a) => idx.forEach((l, b) => {
    if ((((k + l) % N) + N) % N === 0 && (includeTrue || k + l !== 0)) s = cx.add(s, cx.mul(F[a], Gv[b]));
  }));
  return s[0];
}
