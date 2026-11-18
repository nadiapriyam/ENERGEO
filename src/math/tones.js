// Level 2, "Inside a note" (docs/level2_spec.md). Pure functions, no DOM, no audio.
//
// A note is a repeating wave. Tuning fork k (k = 1…4) plays the pure tone sin(2π k x): k times the note's pitch,
// where x is time measured in periods of the note. Striking a fork harder makes it louder: a fork is silent (0) or
// struck to 1, 2 or 3. A mix is the sum of its forks:  wave(x) = Σ (a_k / 3) · sin(2π k x).
//
// The tuning fork the orchestra tunes to is fork 1 alone. The violin's note at the same pitch is a mix of all four.
// DIFFERENCE compares a mix with the violin across the whole wave: the mean of the squared gap over one period, which
// (the forks' tones being orthogonal) equals ½ Σ (a_k − b_k)² / 9. The page reports it as a share of the violin's own
// size, so it starts at 100% (nothing struck) and is exactly 0 only when every fork matches. Every value is computed
// from whole numbers, so the 0 is never a rounding.

export const FORKS = 4;
export const STEPS = 3;                       // silent, then struck 1, 2, 3
export const PITCH = 440;                     // Hz: the A the orchestra tunes to
/** The tuning fork the orchestra tunes to: one pure tone. */
export const TUNING_FORK = [3, 0, 0, 0];
/** The violin's note at the same pitch: a bowed string's tones fall off roughly as 1/k (a sawtooth). */
export const VIOLIN = [3, 2, 1, 1];

/** sin(2π t), exact at every quarter turn. */
export function sinTurns(t) {
  const q = Math.round(t * 4);
  if (Math.abs(t * 4 - q) < 1e-12) return [0, 1, 0, -1][((q % 4) + 4) % 4];
  return Math.sin(2 * Math.PI * t);
}
/** The wave of a mix at time x (in periods). */
export const wave = (amounts, x) => amounts.reduce((s, a, k) => s + (a / STEPS) * sinTurns((k + 1) * x), 0);
/** The highest point of a mix's wave (sampled finely). */
export function peak(amounts, n = 2000) {
  let m = 0;
  for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(wave(amounts, i / n)));
  return m;
}
/** One fork's own tone inside a mix (for showing the parts). */
export const part = (amounts, k) => amounts.map((a, i) => (i === k ? a : 0));

/** The leftover between two mixes, in whole steps²: Σ (a_k − b_k)². */
export const leftover = (target, mine) => target.reduce((s, t, k) => s + (t - mine[k]) ** 2, 0);
/** The size of a mix on the same scale: Σ a_k². */
export const strength = (amounts) => amounts.reduce((s, a) => s + a * a, 0);
/** DIFFERENCE as a whole-number percentage of the target's size; 0 exactly when the mixes match, otherwise ≥ 1. */
export function differencePercent(target, mine) {
  const d = leftover(target, mine);
  return d === 0 ? 0 : Math.max(1, Math.round((100 * d) / strength(target)));
}
/** The mean of the squared gap over one period, sampled (to check that DIFFERENCE is a whole-wave measure). */
export function meanSquareGap(target, mine, n = 4096) {
  let s = 0;
  for (let i = 0; i < n; i++) { const x = i / n; s += (wave(target, x) - wave(mine, x)) ** 2; }
  return s / n;
}
/** The closest one fork alone can ever get to the violin. */
export const bestWithOneFork = () => Math.min(...Array.from({ length: STEPS + 1 }, (_, v) => differencePercent(VIOLIN, [v, 0, 0, 0])));

// ── the board (SVG user units) ───────────────────────────────────────────────────────────────────
export const BOARD = { w: 640, h: 400 };
export const PANEL = { x: 200, y: 6, w: 240, h: 84, cx: 320, labelY: 26, valueY: 60 };
export const STAGE = { x: 24, y: 100, w: 592, h: 292, periods: 2 };
/** Lane i of n stacked across the stage: its centre line and half height. */
export function lane(i, n) {
  const gap = n > 1 ? 10 : 0;
  const h = (STAGE.h - gap * (n - 1)) / n;
  const top = STAGE.y + i * (h + gap);
  return { i, n, top, cy: top + h / 2, half: h / 2, h };
}
const UNIT = 0.86 / peak(VIOLIN);              // the violin fills most of a lane's height
/** An SVG path through a mix's wave across the stage, in a lane, shifted by `shift` periods. */
export function wavePath(amounts, ln, shift = 0, n = 240) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = STAGE.x + 14 + u * (STAGE.w - 28);
    const y = ln.cy - wave(amounts, u * STAGE.periods + shift) * UNIT * ln.half;
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}
/** The gap between two waves in a lane, as a closed shape. */
export function gapPath(target, mine, ln, n = 200) {
  const at = (r, i) => `${(STAGE.x + 14 + (i / n) * (STAGE.w - 28)).toFixed(1)} ${(ln.cy - wave(r, (i / n) * STAGE.periods) * UNIT * ln.half).toFixed(1)}`;
  const a = Array.from({ length: n + 1 }, (_, i) => at(target, i));
  const b = Array.from({ length: n + 1 }, (_, i) => at(mine, n - i));
  return `M${a.join('L')}L${b.join('L')}Z`;
}

/** Fork k (0-based) is drawn shorter the higher it sings: a fork's pitch rises as its prongs get shorter. */
export const forkHeight = (k) => 112 / Math.sqrt(k + 1);
