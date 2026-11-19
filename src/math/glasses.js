// Level 3, "The magic glasses" (docs/levels_spec.md). Pure functions, no DOM, no audio. (The app's own Fourier blocks
// are in fourier.js; this file is only the level's.)
//
// A sound's signal is its shape over time. The glasses show the same sound as bars: one bar for each pure tone hiding
// in it, as tall as how much of that tone there is. That is what the Fourier transform does, and here it is done
// exactly. The A note of Level 1 is its four tones (tones.js). The scanner's reply is a chord of radio tones, one per
// spot along a row of the picture, which the machine unmixes with a discrete Fourier transform,
// a_k = (2/N) Σ s_i sin(2π k i / N), to paint that row.
//
// The scenes move into one another rather than swap: the tuner's little signal grows into the big one; the prism's
// rays sit where the bars will stand; the signal and the bars shrink into the machine's input and window. Each move is
// a fit of one box onto another.

import { A_NOTE, STEPS, wave } from './tones.js';
import { picture } from './scanner.js';

export const BOARD = { w: 640, h: 420 };

/** The transform (scale, then move) that lays box `from` exactly onto box `to`. */
export function fit(from, to) {
  const sx = to.w / from.w;
  const sy = to.h / from.h;
  return { sx, sy, tx: to.x - from.x * sx, ty: to.y - from.y * sy };
}
export const css = (f) => `translate(${f.tx.toFixed(2)}px, ${f.ty.toFixed(2)}px) scale(${f.sx.toFixed(4)}, ${f.sy.toFixed(4)})`;

// ── the sound's signal, big ───────────────────────────────────────────────────────────────────────
export const STRIP = { x: 40, y: 36, w: 560, h: 150, periods: 2.5 };
export const STRIP_BOX = { x: 26, y: 26, w: 588, h: 170 };
const PEAK_A = (() => { let m = 0; for (let i = 0; i < 2000; i++) m = Math.max(m, Math.abs(wave(A_NOTE, i / 2000))); return m; })();
/** The signal of a mix (amounts in steps 0…3) across the strip, shifted by `shift` periods. */
export function signal(amounts, shift = 0, n = 280) {
  const px = (STRIP.h / 2 - 10) / PEAK_A;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    d += `${i ? 'L' : 'M'}${(STRIP.x + u * STRIP.w).toFixed(1)} ${(STRIP.y + STRIP.h / 2 - wave(amounts, u * STRIP.periods + shift) * px).toFixed(1)}`;
  }
  return d;
}
/** A path through sampled values, fitted into a box (for the scanner's busier signals). */
export function samplesPath(samples, box) {
  const m = Math.max(1e-9, ...samples.map(Math.abs));
  return samples.map((v, i) => `${i ? 'L' : 'M'}${(box.x + (i / (samples.length - 1)) * box.w).toFixed(1)} ${(box.y + box.h / 2 - (v / m) * (box.h / 2 - 6)).toFixed(1)}`).join('');
}

// ── the tuner, clipped to your violin's scroll; its screen shows the same signal, small ──────────────────
export const TUNER = {
  pegbox: { x: 306, y: -20, w: 28, h: 104 },
  scroll: { cx: 320, cy: 84, r: 24 },
  clip: { x: 296, y: 104, w: 48, h: 48, r: 8 },
  body: { x: 210, y: 144, w: 220, h: 240, r: 28 },
  screen: { x: 228, y: 164, w: 184, h: 156, r: 14 },
  signalArea: { x: 240, y: 178, w: 160, h: 92 },
  letter: { x: 320, y: 304 },
  light: { cx: 320, cy: 354, r: 9 },
};
/** How the big signal sits small on the tuner's screen; undoing it grows the signal into the strip. */
export const onTuner = () => fit(STRIP, TUNER.signalArea);

// ── the prism: white light in, colours out, where the bars will stand ────────────────────────────────
export const PRISM = { cx: 300, cy: 316, size: 112, beamFrom: { x: 40, y: 344 }, raysTo: 604, raysTop: 236, raysBottom: 398, rays: 7 };
/** The prism's three corners (pointing up). */
export function prismCorners() {
  const { cx, cy, size } = PRISM;
  const h = (size * Math.sqrt(3)) / 2;
  return [{ x: cx, y: cy - (2 * h) / 3 }, { x: cx + size / 2, y: cy + h / 3 }, { x: cx - size / 2, y: cy + h / 3 }];
}
/** The white beam meets the prism's left face; the rays leave from its right face and fan out. */
export function prismRays() {
  const [top, right, left] = prismCorners();
  const enter = { x: (top.x + left.x) / 2, y: (top.y + left.y) / 2 };
  const exit = { x: (top.x + right.x) / 2, y: (top.y + right.y) / 2 };
  const rays = Array.from({ length: PRISM.rays }, (_, i) => {
    const y = PRISM.raysTop + ((PRISM.raysBottom - PRISM.raysTop) * i) / (PRISM.rays - 1);
    return { from: exit, to: { x: PRISM.raysTo, y }, color: neon(i, PRISM.rays) };
  });
  return { beam: { from: PRISM.beamFrom, to: enter }, rays };
}

// ── cyber-city colours: dark, saturated, glowing like LEDs ─────────────────────────────────────────────
const LED_HUES = [320, 285, 245, 200, 165, 120, 50, 28];
/** Colour i of n along the LED rainbow (magenta → violet → blue → cyan → green → yellow → orange). */
export function neon(i, n) {
  const t = n <= 1 ? 0 : (i / (n - 1)) * (LED_HUES.length - 1);
  const a = Math.floor(t);
  const b = Math.min(LED_HUES.length - 1, a + 1);
  const h = LED_HUES[a] + (LED_HUES[b] - LED_HUES[a]) * (t - a);
  return `hsl(${Math.round(h)}, 100%, 60%)`;
}
/** The four notes' colours from Level 1, turned into LEDs for the dark: blue, teal, violet, amber. */
export const NOTE_LED = ['#3d8bff', '#16e0b8', '#b07cff', '#ffb02e'];

// ── through the glasses: bars ─────────────────────────────────────────────────────────────────────
export const SPECTRUM = { x: 110, y: 226, w: 420, base: 368, unit: 40, slots: 4, barW: 52 };
export const SPECTRUM_BOX = { x: 90, y: 220, w: 460, h: 180 };
export const barX = (k, slots = SPECTRUM.slots) => SPECTRUM.x + ((k + 0.5) * SPECTRUM.w) / slots;
export const barHeight = (a) => a * SPECTRUM.unit;
export const barAt = (x) => Math.max(0, Math.min(SPECTRUM.slots - 1, Math.floor(((x - SPECTRUM.x) / SPECTRUM.w) * SPECTRUM.slots)));
export const stepsAt = (y) => Math.max(0, Math.min(STEPS, Math.round((SPECTRUM.base - y) / SPECTRUM.unit)));
/** A pure tone: exactly one bar left. All notes back: every bar up again. */
export const pureTone = (amounts) => amounts.filter((a) => a > 0).length === 1;
export const allBack = (amounts) => amounts.every((a) => a > 0);

// ── the Fourier machine: the strip and the bars shrink into its input and its window ─────────────────────
export const MACHINE = {
  input: { x: 22, y: 150, w: 200, h: 120 },
  box: { x: 248, y: 112, w: 150, h: 196, r: 18 },
  window: { x: 266, y: 168, w: 114, h: 82 },
  crank: { cx: 323, cy: 98, r: 26 },
  picture: { x: 424, y: 112, size: 196 },
};
export const stripToInput = () => fit(STRIP_BOX, MACHINE.input);
export const spectrumToWindow = () => fit(SPECTRUM_BOX, MACHINE.window);
/** A chord: tone k (k = 1…n) with amount amounts[k−1], sampled N > 2n times over one period, so it can be unmixed exactly. */
export const chordSamples = (amounts, N = 4 * amounts.length + 8) =>
  Array.from({ length: N }, (_, i) => amounts.reduce((s, a, k) => s + a * Math.sin((2 * Math.PI * (k + 1) * i) / N), 0));
/** The glasses inside the machine: how much of each tone is in a sampled chord (a discrete Fourier transform). */
export const unmix = (samples, n) =>
  Array.from({ length: n }, (_, k) => (2 / samples.length) * samples.reduce((s, v, i) => s + v * Math.sin((2 * Math.PI * (k + 1) * i) / samples.length), 0));
/** The picture's rows (brightness 0…1 per spot); each row is the amounts of one chord. */
export function pictureRows() {
  const cells = picture();
  const n = Math.round(Math.sqrt(cells.length));
  return Array.from({ length: n }, (_, j) => cells.slice(j * n, (j + 1) * n).map((c) => c.g));
}
/** The order the crank prints rows in: from the middle outwards, so the first turns already show the head. */
export function rowOrder(n) {
  const mid = Math.floor(n / 2);
  const out = [mid];
  for (let d = 1; out.length < n; d++) { if (mid - d >= 0) out.push(mid - d); if (mid + d < n) out.push(mid + d); }
  return out;
}
