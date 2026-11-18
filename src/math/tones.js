// Level 2 of the notebook ("Inside a note", docs/notebook_spec.md). Pure functions, no DOM, no audio.
//
// A note is a repeating wave. Tone k (k = 1…6) is the simple wave sin(2π k x), k times the note's pitch, where x is
// time measured in periods of the note. A recipe gives each tone a whole number of clicks, 0…10 (the dial), and the
// note is the sum of its tones:  wave(x) = Σ (a_k / 10) · sin(2π k x).
//
// DIFFERENCE compares two recipes across the whole wave, not at one moment. Its size is the mean of the squared gap
// over one period, which (because the tones are orthogonal) equals ½ Σ (a_k − b_k)² / 100. The page reports it as a
// share of the violin's own size, so it starts at 100% (nothing built) and is exactly 0 only when every dial matches.
// Every value is computed from whole numbers, so the 0 is never a rounding.

export const TONES = 6;
export const STEPS = 10;                      // clicks on a dial
export const PITCH = 440;                     // Hz, the note's pitch (A above middle C)
/** The violin's recipe: a bowed string's tones fall off roughly as 1/k (a sawtooth), shaped a little by the body. */
export const VIOLIN = [10, 5, 4, 3, 2, 2];
/** Other notes at the same pitch, for "look inside". */
export const OTHERS = [
  { name: 'hollow', amounts: [10, 0, 4, 0, 2, 0] },    // odd tones only
  { name: 'soft', amounts: [10, 3, 1, 0, 0, 0] },      // almost one tone
];

/** sin(2π t), exact at every quarter turn (so the shared zeros are exact zeros, not 1e-16). */
export function sinTurns(t) {
  const q = Math.round(t * 4);
  if (Math.abs(t * 4 - q) < 1e-12) return [0, 1, 0, -1][((q % 4) + 4) % 4];
  return Math.sin(2 * Math.PI * t);
}
/** The wave of a recipe at time x (in periods). */
export const wave = (amounts, x) => amounts.reduce((s, a, k) => s + (a / STEPS) * sinTurns((k + 1) * x), 0);
/** The highest point of a recipe's wave (sampled finely). */
export function peak(amounts, n = 2000) {
  let m = 0;
  for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(wave(amounts, i / n)));
  return m;
}

/** The leftover between two recipes, in whole clicks²: Σ (a_k − b_k)². */
export const leftover = (target, mine) => target.reduce((s, t, k) => s + (t - mine[k]) ** 2, 0);
/** The size of a recipe on the same scale: Σ a_k². */
export const strength = (amounts) => amounts.reduce((s, a) => s + a * a, 0);
/** DIFFERENCE as a whole-number percentage of the target's size; 0 exactly when the recipes match, otherwise ≥ 1. */
export function differencePercent(target, mine) {
  const d = leftover(target, mine);
  return d === 0 ? 0 : Math.max(1, Math.round((100 * d) / strength(target)));
}
/** The mean of the squared gap over one period, sampled (used to check that DIFFERENCE is a whole-wave measure). */
export function meanSquareGap(target, mine, n = 4096) {
  let s = 0;
  for (let i = 0; i < n; i++) { const x = i / n; s += (wave(target, x) - wave(mine, x)) ** 2; }
  return s / n;
}

/** The moment where any two recipes agree: half way through the display (one full period), where every tone is 0. */
export const AGREE_AT = 1;
export const active = (amounts) => amounts.filter((a) => a > 0).length;

// ── the scope (SVG user units) ───────────────────────────────────────────────────────────────────
export const BOARD = { w: 640, h: 360 };
export const SCOPE = { x: 28, y: 112, w: 584, h: 232, periods: 2 };
export const PANEL = { x: 200, y: 6, w: 240, h: 96, cx: 320, labelY: 26, valueY: 68 };
const SCALE = (SCOPE.h / 2) * 0.86 / peak(VIOLIN);     // the violin fills most of the scope's height
/** Screen point of a wave at display position u ∈ [0, 1] (u covers SCOPE.periods periods), shifted by `phase`. */
export const toScreen = (amounts, u, phase = 0) => ({
  x: SCOPE.x + u * SCOPE.w,
  y: SCOPE.y + SCOPE.h / 2 - wave(amounts, u * SCOPE.periods + phase) * SCALE,
});
/** An SVG path through a recipe's wave across the scope. */
export function wavePath(amounts, phase = 0, n = 360) {
  let d = '';
  for (let i = 0; i <= n; i++) { const p = toScreen(amounts, i / n, phase); d += `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }
  return d;
}
/** The gap between two waves as a closed SVG shape (target forwards, mine backwards). */
export function gapPath(target, mine, n = 240) {
  const a = [], b = [];
  for (let i = 0; i <= n; i++) { a.push(toScreen(target, i / n)); b.push(toScreen(mine, i / n)); }
  return `M${a.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L')}L${b.reverse().map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L')}Z`;
}
export const MARKER_X = SCOPE.x + (AGREE_AT / SCOPE.periods) * SCOPE.w;

/** A string vibrating in tone k: k humps along its length (a standing wave), height ∝ amount, at swing s ∈ [−1, 1]. */
export function stringPath(k, amount, s = 1, w = 120, h = 36, n = 96) {
  const amp = (amount / STEPS) * (h / 2 - 3) * s;
  let d = '';
  for (let i = 0; i <= n; i++) { const x = i / n; d += `${i ? 'L' : 'M'}${(x * w).toFixed(1)} ${(h / 2 - amp * Math.sin(k * Math.PI * x)).toFixed(2)}`; }
  return d;
}
/** The pointer angle of a dial at `amount` clicks, in degrees: −135° (0) … +135° (10). */
export const dialAngle = (amount) => -135 + (270 * amount) / STEPS;

// ── back to Level 1: the scanner's reply, unmixed ────────────────────────────────────────────────
/**
 * A chord of n radio tones: tone k (k = 1…n) has amount amounts[k−1]. Sampled at N points over one period, N > 2n, so
 * the tones can be unmixed exactly.
 */
export const chordSamples = (amounts, N = 4 * amounts.length + 8) =>
  Array.from({ length: N }, (_, i) => amounts.reduce((s, a, k) => s + a * Math.sin((2 * Math.PI * (k + 1) * i) / N), 0));
/** How much of each tone is in a sampled chord: a_k = (2/N) Σ s_i sin(2π k i / N). This is the unmixing. */
export const unmix = (samples, n) =>
  Array.from({ length: n }, (_, k) => (2 / samples.length) * samples.reduce((s, v, i) => s + v * Math.sin((2 * Math.PI * (k + 1) * i) / samples.length), 0));
/** Where the scanner's chord, its unmixed amounts and the picture sit on the board during the return to Level 1. */
export const BRIDGE = {
  chord: { x: 40, y: 124, w: 300, h: 92 },
  bars: { x: 40, y: 236, w: 300, h: 96 },
  pic: { x: 372, y: 116, size: 228 },
};
