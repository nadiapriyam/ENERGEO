// Level 3, "The magic glasses" (docs/levels_spec.md). Pure functions, no DOM, no audio. (The app's own Fourier blocks
// are in fourier.js; this file is only the level's.)
//
// A sound is a squiggle in time. The glasses show the same sound as bars: one bar for each pure tone hiding in it, as
// tall as how much of that tone there is. That is what the Fourier transform does. Here it is done exactly: the A note
// of Level 1 is its four tones (tones.js), and the scanner's reply is a chord of radio tones, one per spot along a row
// of the picture, which the machine unmixes with a discrete Fourier transform, a_k = (2/N) Σ s_i sin(2π k i / N), to paint
// that row.

import { A_NOTE, STEPS, wave } from './tones.js';
import { picture } from './scanner.js';

export const BOARD = { w: 640, h: 420 };

// ── the tuner: it listens, and names one note ─────────────────────────────────────────────────────
export const TUNER = {
  body: { x: 210, y: 64, w: 220, h: 270, r: 28 },
  clip: { x: 296, y: 30, w: 48, h: 40, r: 8 },
  screen: { x: 230, y: 86, w: 180, h: 186, r: 14 },
  meter: { cx: 320, cy: 196, r: 86, span: 56 },           // the needle swings ±56° about straight up
  letter: { x: 320, y: 254 },                               // under the dial, clear of the needle
  light: { cx: 320, cy: 304, r: 9 },
};
/** The needle's angle for a pitch `cents` away from the note (±50 cents fill the dial). */
export const needleAngle = (cents) => (Math.max(-50, Math.min(50, cents)) / 50) * TUNER.meter.span;
/** A tick on the dial at angle a (degrees from straight up): its two ends. */
export function tick(a, long = false) {
  const { cx, cy, r } = TUNER.meter;
  const t = ((a - 90) * Math.PI) / 180;
  const r0 = r - (long ? 18 : 10);
  return { x1: cx + r0 * Math.cos(t), y1: cy + r0 * Math.sin(t), x2: cx + r * Math.cos(t), y2: cy + r * Math.sin(t) };
}

// ── the sound as a squiggle, and through the glasses as bars ───────────────────────────────────────
export const STRIP = { x: 40, y: 36, w: 560, h: 150, periods: 2.5 };
export const SPECTRUM = { x: 110, y: 226, w: 420, base: 368, unit: 40, slots: 4, barW: 52 };
const PEAK_A = (() => { let m = 0; for (let i = 0; i < 2000; i++) m = Math.max(m, Math.abs(wave(A_NOTE, i / 2000))); return m; })();
/** The squiggle of a mix (amounts in steps 0…3), across the strip, shifted by `shift` periods. */
export function squiggle(amounts, shift = 0, n = 280) {
  const px = (STRIP.h / 2 - 10) / PEAK_A;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    d += `${i ? 'L' : 'M'}${(STRIP.x + u * STRIP.w).toFixed(1)} ${(STRIP.y + STRIP.h / 2 - wave(amounts, u * STRIP.periods + shift) * px).toFixed(1)}`;
  }
  return d;
}
/** Where bar k stands, and how tall a bar of `a` steps is. */
export const barX = (k, slots = SPECTRUM.slots) => SPECTRUM.x + ((k + 0.5) * SPECTRUM.w) / slots;
export const barHeight = (a) => a * SPECTRUM.unit;
/** Dragging on the bars: which bar is under x, and the height (in whole steps) for a pointer at y. */
export const barAt = (x) => Math.max(0, Math.min(SPECTRUM.slots - 1, Math.floor(((x - SPECTRUM.x) / SPECTRUM.w) * SPECTRUM.slots)));
export const stepsAt = (y) => Math.max(0, Math.min(STEPS, Math.round((SPECTRUM.base - y) / SPECTRUM.unit)));
/** A pure tone: exactly one bar left. All notes back: every bar up again. */
export const pureTone = (amounts) => amounts.filter((a) => a > 0).length === 1;
export const allBack = (amounts) => amounts.every((a) => a > 0);

// ── the Fourier machine: the scanner's squiggles go in, rows of a picture come out ─────────────────────
export const MACHINE = {
  input: { x: 22, y: 150, w: 200, h: 120 },
  box: { x: 248, y: 112, w: 150, h: 196, r: 18 },
  window: { x: 266, y: 168, w: 114, h: 82 },
  crank: { cx: 323, cy: 98, r: 26 },                       // on top of the machine
  picture: { x: 424, y: 112, size: 196 },
};
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
/** A colour for spot i of n: the glasses split things into a rainbow. */
export const rainbow = (i, n) => `hsl(${Math.round((280 * i) / Math.max(1, n - 1))}, 70%, 52%)`;
/** A path through sampled values, fitted into a box. */
export function samplesPath(samples, box) {
  const m = Math.max(1e-9, ...samples.map(Math.abs));
  return samples.map((v, i) => `${i ? 'L' : 'M'}${(box.x + (i / (samples.length - 1)) * box.w).toFixed(1)} ${(box.y + box.h / 2 - (v / m) * (box.h / 2 - 6)).toFixed(1)}`).join('');
}
