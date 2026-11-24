// Level 3, "A prism for sound" (docs/levels_spec.md, Revision 11). Pure functions, no DOM, no audio. (The app's own
// Fourier blocks are in fourier.js; this file is only the level's.)
//
// Three scenes, one idea: something that looks like one thing hides many.
//  • The hall. The learner aims a stage light at the chandelier; a glass prism hanging from it catches the beam. White
//    light goes in and colours come out, red bent least and violet most, as in a real prism.
//  • The tuner. Your A note's signal (its shape over time) and, through the prism for sound, its four notes as bars.
//    The bars are exact: the signal is their sum (tones.js).
//  • The break. The hall's lights come back on; you stand by the stage and the radiologist who read your scan walks
//    over.
//  • The scanner. Your head, big and labelled, as its body parts (skin, skull, fluid, outer brain, inner brain). The tiny magnets in each
//    body part behave differently: each part sends its own signal, as strong as that part is bright in Level 2's
//    picture, and fading at its own pace. The scanner collects all of it at once, one signal per row (place k sends
//    tone k + 1), and converts it into pixel data with a discrete Fourier transform,
//    a_k = (2/N) Σ s_i sin(2π (k+1) i / N), exactly. Row after row, the MRI picture.
//  • The pattern, one slide at a time, each caption under its own pictures: violin note → pure tones; stage light →
//    its colours; MRI signal → proton frequencies → image. Then all three, and the grand reveal: the Fourier
//    transform.
//
// Scenes move into one another: each move is a fit of one box onto another.

import { A_NOTE, STEPS, wave } from './tones.js';
import { scanPixel } from './scanner.js';
import { figureAt, FACE, FIGURE } from './characters.js';

export const BOARD = { w: 640, h: 420 };

/** The transform (scale, then move) that lays box `from` exactly onto box `to`. */
export function fit(from, to) {
  const sx = to.w / from.w;
  const sy = to.h / from.h;
  return { sx, sy, tx: to.x - from.x * sx, ty: to.y - from.y * sy };
}
export const css = (f) => `translate(${f.tx.toFixed(2)}px, ${f.ty.toFixed(2)}px) scale(${f.sx.toFixed(4)}, ${f.sy.toFixed(4)})`;
/** A triangle pointing up, by its centre (centroid) and side: [top, right, left]. */
export function triangle({ cx, cy, size }) {
  const h = (size * Math.sqrt(3)) / 2;
  return [{ x: cx, y: cy - (2 * h) / 3 }, { x: cx + size / 2, y: cy + h / 3 }, { x: cx - size / 2, y: cy + h / 3 }];
}
const DEG = Math.PI / 180;

// ── the hall: a stage light, a chandelier, a glass prism ───────────────────────────────────────────────
export const HALL = {
  floor: 392,
  light: { x: 74, y: 352, lens: 26 },                       // the stage light turns about this point
  chandelier: { cx: 410, armY: 58, arm: 86 },
  crystal: { cx: 410, cy: 150, size: 48 },
  startAt: { x: 640, y: 304 },                              // where the light first points: the wall, well below the prism
  hitR: 26,                                                 // the beam catches the prism if it passes this close to its centre,
  catchTop: 30,                                             // or crosses the chandelier's line anywhere from just above its arm …
  catchBelow: 14,                                           // … to just below the prism
  aim: { min: -75 * DEG, max: -1 * DEG },
};
/** Real prisms bend red least and violet most. The rays, from least bent to most, in LED colours. */
export const RAINBOW = ['hsl(0, 100%, 60%)', 'hsl(28, 100%, 58%)', 'hsl(52, 100%, 55%)', 'hsl(125, 90%, 52%)', 'hsl(185, 100%, 52%)', 'hsl(222, 100%, 66%)', 'hsl(275, 100%, 70%)'];
export const BEND = { least: 26 * DEG, most: 40 * DEG };
export const crystalCorners = () => triangle(HALL.crystal);
/** The middle of the prism's near face (the one facing the light): where a caught beam goes in. */
export function nearFace() {
  const [top, , left] = crystalCorners();
  return { x: (top.x + left.x) / 2, y: (top.y + left.y) / 2 };
}

/** The angle the stage light points at, aimed at a point (clamped to up-and-to-the-right). */
export function aimAngle(p) {
  const a = Math.atan2(p.y - HALL.light.y, p.x - HALL.light.x);
  return Math.max(HALL.aim.min, Math.min(HALL.aim.max, a));
}
export const toCrystal = () => aimAngle(nearFace());
export const startAngle = () => aimAngle(HALL.startAt);

/** How high the stage light's beam is (y) where it crosses the vertical line x: aiming at the chandelier means crossing its line between its arm and its prism. */
export const beamHeightAt = (a, x) => HALL.light.y + Math.tan(a) * (x - HALL.light.x);
/** Where a ray from `p` at angle `a` leaves the board (the wall on the right or the ceiling). */
export function edge(p, a) {
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const ts = [];
  if (dx > 1e-9) ts.push((BOARD.w - p.x) / dx);
  if (dx < -1e-9) ts.push(-p.x / dx);
  if (dy < -1e-9) ts.push(-p.y / dy);
  if (dy > 1e-9) ts.push((HALL.floor - p.y) / dy);
  const t = Math.min(...ts);
  return { x: p.x + t * dx, y: p.y + t * dy };
}
/** Where a ray from `p` along `d` first crosses segment ab (or null). */
function cross(p, d, a, b) {
  const ex = b.x - a.x;
  const ey = b.y - a.y;
  const den = d.x * ey - d.y * ex;
  if (Math.abs(den) < 1e-12) return null;
  const t = ((a.x - p.x) * ey - (a.y - p.y) * ex) / den;
  const s = ((a.x - p.x) * d.y - (a.y - p.y) * d.x) / den;
  return t > 0 && s >= 0 && s <= 1 ? { t, x: p.x + t * d.x, y: p.y + t * d.y } : null;
}
/**
 * The light, aimed at angle `a`. If the beam is aimed at the chandelier (or passes close to its prism), it is caught: the beam snaps onto the
 * middle of the prism's near face, goes in there, and seven coloured rays leave its far face, each bent a little more than the last.
 */
export function lightPath(a) {
  const L = HALL.light;
  const C = HALL.crystal;
  let d = { x: Math.cos(a), y: Math.sin(a) };
  const off = Math.abs((C.cx - L.x) * d.y - (C.cy - L.y) * d.x);
  const ahead = (C.cx - L.x) * d.x + (C.cy - L.y) * d.y > 0;
  const across = beamHeightAt(a, C.cx);
  const hit = ahead && (off <= HALL.hitR || (across >= HALL.catchTop && across <= crystalCorners()[1].y + HALL.catchBelow));
  const angle = hit ? toCrystal() : a;
  d = { x: Math.cos(angle), y: Math.sin(angle) };
  const from = { x: L.x + d.x * L.lens, y: L.y + d.y * L.lens };
  if (!hit) return { hit, angle, beam: { from, to: edge(L, angle) }, rays: [] };
  const [top, right, left] = crystalCorners();
  const enter = [[top, left], [left, right], [right, top]].map(([p, q]) => cross(L, d, p, q)).filter(Boolean).sort((u, v) => u.t - v.t)[0];
  const exit = { x: (top.x + right.x) / 2, y: (top.y + right.y) / 2 };
  const rays = RAINBOW.map((color, i) => {
    const bent = angle + BEND.least + ((BEND.most - BEND.least) * i) / (RAINBOW.length - 1);
    return { from: exit, to: edge(exit, bent), color, bent };
  });
  return { hit, angle, beam: { from, to: { x: enter.x, y: enter.y } }, rays };
}

// ── your A note: its signal, big ────────────────────────────────────────────────────────────────────
export const STRIP = { x: 40, y: 36, w: 560, h: 150, periods: 2.5 };
export const STRIP_BOX = { x: 26, y: 26, w: 588, h: 170 };
/** The signal's repeats across the strip: one band per period of the A note (the last cut off by the edge), so the bumps can be seen to be one shape, again and again. */
export function repeats() {
  const w = STRIP.w / STRIP.periods;
  return Array.from({ length: Math.ceil(STRIP.periods - 1e-9) }, (_, k) => ({ x: STRIP.x + k * w, w: Math.min(w, STRIP.w - k * w) }));
}
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

// ── the prism for sound: four glowing bars ───────────────────────────────────────────────────────────
export const SPECTRUM = { x: 110, y: 226, w: 420, base: 368, unit: 40, slots: 4, barW: 52 };
/** The little prism the signal passes through on its way into the bars. */
export const GLYPH = { cx: 320, cy: 222, size: 30 };
export const barX = (k, slots = SPECTRUM.slots) => SPECTRUM.x + ((k + 0.5) * SPECTRUM.w) / slots;
export const barHeight = (a) => a * SPECTRUM.unit;
export const barAt = (x) => Math.max(0, Math.min(SPECTRUM.slots - 1, Math.floor(((x - SPECTRUM.x) / SPECTRUM.w) * SPECTRUM.slots)));
export const stepsAt = (y) => Math.max(0, Math.min(STEPS, Math.round((SPECTRUM.base - y) / SPECTRUM.unit)));
/** A pure tone: exactly one bar left. All notes back: every bar up again. */
export const pureTone = (amounts) => amounts.filter((a) => a > 0).length === 1;
export const allBack = (amounts) => amounts.every((a) => a > 0);
/** The four notes' colours from Level 1, as LEDs: blue, teal, violet, amber. */
export const NOTE_LED = ['#3d8bff', '#16e0b8', '#b07cff', '#ffb02e'];

// ── cyber-city colours for the scanner's many notes ──────────────────────────────────────────────────
const LED_HUES = [320, 285, 245, 200, 165, 120, 50, 28];
/** Colour i of n along the LED rainbow (magenta → violet → blue → cyan → green → yellow → orange). */
export function neon(i, n) {
  const t = n <= 1 ? 0 : (i / (n - 1)) * (LED_HUES.length - 1);
  const a = Math.floor(t);
  const b = Math.min(LED_HUES.length - 1, a + 1);
  const h = LED_HUES[a] + (LED_HUES[b] - LED_HUES[a]) * (t - a);
  return `hsl(${Math.round(h)}, 100%, 60%)`;
}

// ── the scanner: body parts → their data → pixel data → an MRI picture ────────────────────────────────────
export const ROWS = 48;                                     // the picture: 48 rows of 48 pixels, as in Level 2
export const MRI = {
  head: { x: 14, y: 110, size: 176 },                       // your head, as its body parts
  data: { x: 230, y: 140, w: 176, h: 116 },                 // the data (the violin's signal box moves here)
  glyph: { cx: 429, cy: 168, size: 24 },                    // the Fourier transform: taking the data apart
  picture: { x: 452, y: 110, size: 176 },                   // the pixels: the MRI picture
  arrows: [{ x1: 196, x2: 224, y: 198 }, { x1: 412, x2: 446, y: 198 }],
  label: { x: 102, y: 316 },                                // the name of the body part you tapped
};
/**
 * The body parts of Level 2's head slice, in the order of their names in the copy (skin, skull, fluid, outer brain,
 * inner brain: the grey rim of gray matter and the bright white matter inside it). `values` are the brightnesses scanner.js gives that part; `fade` is how long its signal lasts, as
 * drawn (an illustration: bone sends a faint, short signal, fading fastest; fluid fades slowest). Since 2026-11-24 the
 * skull's signal lasts about one wave, so a faint signal can be seen at all (Nadia: "i cant see the skulls signal").
 */
export const BODY_PARTS = [
  { values: [0.85], fade: 0.3, color: 'hsl(28, 100%, 60%)' },
  { values: [0.1, 0.22], fade: 0.18, color: 'hsl(275, 85%, 72%)' },
  { values: [0.16, 0.26, 0.3], fade: 1.2, color: 'hsl(200, 100%, 60%)' },
  { values: [0.52], fade: 0.45, color: 'hsl(165, 100%, 48%)' },
  { values: [0.78], fade: 0.35, color: 'hsl(320, 100%, 66%)' },
];
/** Which body part a brightness belongs to (−1 outside the head). */
export const partOf = (v) => BODY_PARTS.findIndex((b) => b.values.some((w) => Math.abs(w - v) < 1e-9));
/** How strong a body part's signal is: its brightness in the picture (the mean, where it has more than one). */
export const strength = (k) => BODY_PARTS[k].values.reduce((s, v) => s + v, 0) / BODY_PARTS[k].values.length;
/** The head slice from Level 2 (scanner.js), sampled at n × n pixels: how bright each is (0…1). */
export function coarseRows(n = ROWS) {
  return Array.from({ length: n }, (_, j) => Array.from({ length: n }, (_, i) => scanPixel(((i + 0.5) / n) * 2 - 1, ((j + 0.5) / n) * 2 - 1)));
}
/** The body part under a point of the board (−1 if it is not on your head). */
export function partAt(p, rows = coarseRows()) {
  const { x, y, size } = MRI.head;
  const i = Math.floor(((p.x - x) / size) * ROWS);
  const j = Math.floor(((p.y - y) / size) * ROWS);
  if (i < 0 || j < 0 || i >= ROWS || j >= ROWS) return -1;
  return partOf(rows[j][i]);
}
/** How strong body part k's signal is at time t (0…1 across the data box): its strength, fading at its own pace. */
export const partLoudness = (k, t) => strength(k) * Math.exp(-t / BODY_PARTS[k].fade);
/** The strongest body part's signal fills the data box's height; every other part is drawn in proportion to it. */
export const LOUDEST = Math.max(...BODY_PARTS.map((_, k) => strength(k)));
/** One body part's signal, drawn across the data box (in the strip's own units, which move with it), up to `upTo` of the way: the drawing grows from the left as the signal arrives. */
export function partWave(k, n = 200, upTo = 1) {
  const amp = (STRIP.h / 2 - 8) / LOUDEST;
  const m = Math.max(1, Math.round(n * Math.min(1, Math.max(0, upTo))));
  let d = '';
  for (let i = 0; i <= m; i++) {
    const t = i / n;
    d += `${i ? 'L' : 'M'}${(STRIP.x + t * STRIP.w).toFixed(1)} ${(STRIP.y + STRIP.h / 2 - amp * partLoudness(k, t) * Math.sin(2 * Math.PI * 6 * t)).toFixed(1)}`;
  }
  return d;
}
/** What the scanner collects from one row: place k sends tone k + 1, as strong as that pixel is bright. Sampled N > 2n times over one period, so it can be converted exactly. */
export const chordSamples = (amounts, N = 4 * amounts.length + 8) =>
  Array.from({ length: N }, (_, i) => amounts.reduce((s, a, k) => s + a * Math.sin((2 * Math.PI * (k + 1) * i) / N), 0));
/** Converting the data into pixel data: how much of each tone is in it (a discrete Fourier transform). */
export const unmix = (samples, n) =>
  Array.from({ length: n }, (_, k) => (2 / samples.length) * samples.reduce((s, v, i) => s + v * Math.sin((2 * Math.PI * (k + 1) * i) / samples.length), 0));
/** The order rows are converted in: from the middle outwards, so the first rows already cross the head. */
export function rowOrder(n) {
  const mid = Math.floor(n / 2);
  const out = [mid];
  for (let d = 1; out.length < n; d++) { if (mid - d >= 0) out.push(mid - d); if (mid + d < n) out.push(mid + d); }
  return out;
}
export const FIRST_ROW = rowOrder(ROWS)[0];
/** Row j's band across a square box (the head being read, or the picture being made). */
export const rowIn = (box, j) => ({ x: box.x, y: box.y + (j * box.size) / ROWS, w: box.size, h: box.size / ROWS });
export const toSignal = () => fit(STRIP_BOX, MRI.data);      // the violin's signal box becomes the data box
export const BRAIN = [3, 4];                                  // the outer and inner brain
export const SKULL = 1;

// first, while you tap the body parts, the head is big and labelled, and the data box sits to its right
export const EXPLORE = { head: { x: 136, y: 40, size: 264 }, data: { x: 414, y: 120, w: 216, h: 128 }, labelX: 128 };
const square = (b) => ({ x: b.x, y: b.y, w: b.size, h: b.size });
/** The head, from where it sits later (MRI.head) to where it sits while you explore it: the same picture, bigger. */
export const exploreHead = () => fit(square(MRI.head), square(EXPLORE.head));
export const exploreData = () => fit(STRIP_BOX, EXPLORE.data);
/** Where a tapped part's signal enters the data box: the middle of its left edge, where the wave starts. */
export const dataInlet = () => ({ x: EXPLORE.data.x + (EXPLORE.data.w * (STRIP.x - STRIP_BOX.x)) / STRIP_BOX.w, y: EXPLORE.data.y + EXPLORE.data.h / 2 });
/** The name of the part whose signal is on show, centred above the data box. */
export const dataTitle = () => ({ x: EXPLORE.data.x + EXPLORE.data.w / 2, y: EXPLORE.data.y - 16 });
/**
 * The path a tapped part's signal takes on the board: out of the spot you tapped (p, on the big head), across to the
 * data box, where its wave is drawn. A smooth curve that leaves level and arrives level.
 */
export function partLink(p) {
  const q = dataInlet();
  const dx = Math.max(30, (q.x - p.x) / 2);
  return { from: p, to: q, d: `M ${p.x.toFixed(1)} ${p.y.toFixed(1)} C ${(p.x + dx).toFixed(1)} ${p.y.toFixed(1)} ${(q.x - dx).toFixed(1)} ${q.y.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}` };
}
/** The ripples where you tap: rings that grow out of the spot, one after another (radius in board units, delay in ms). */
export const RIPPLES = [{ r: 34, delay: 0 }, { r: 34, delay: 180 }, { r: 34, delay: 360 }];
/** Where on the head each body part's label points (u, v as in scanner.js), spread from top to bottom: skin, inner brain, fluid, skull, outer brain. */
const AIM = [[-0.6, -0.65], [-0.72, 0.3], [0, 0.05], [-0.4, 0.62], [-0.25, -0.3]];
/** Each body part's label: its anchor (a pixel of that part, on the big head) and its name to the left, level with it, so every leader line is level and none can cross. */
export function labels(rows = coarseRows()) {
  const { head, labelX } = EXPLORE;
  const c = head.size / ROWS;
  const anchors = AIM.map(([u, v], k) => {
    let best = null;
    rows.forEach((row, j) => row.forEach((val, i) => {
      if (partOf(val) !== k) return;
      const du = ((i + 0.5) / ROWS) * 2 - 1 - u;
      const dv = ((j + 0.5) / ROWS) * 2 - 1 - v;
      const d = du * du + dv * dv;
      if (!best || d < best.d) best = { d, i, j };
    }));
    return { k, i: best.i, j: best.j, anchor: { x: head.x + (best.i + 0.5) * c, y: head.y + (best.j + 0.5) * c } };
  });
  anchors.forEach((a) => { a.label = { x: labelX, y: a.anchor.y }; });
  return anchors;
}

// ── the characters (drawn the same in every level): see characters.js ────────────────────────────────────
export { FACE, hairPath, shirtPath, lookAt, PLAYER, RADIOLOGIST, bucketHat, coatLapels, FIGURE, figureAt } from './characters.js';

// ── the pattern: three rows, one thing on the left, what it is made of on the right ─────────────────────────
export const PATTERN = { y: [10, 146, 282], h: 92, left: { x: 40, w: 230 }, right: { x: 370, w: 230 }, arrow: { x1: 290, x2: 350 }, caption: 30, slideY: 168, slideCaption: 26, captionMax: 600 };
/** How far row i moves to stand alone in the middle of the board, as its own slide. */
export const slideShift = (i) => PATTERN.slideY - (PATTERN.y[i] + PATTERN.h / 2);
/** Where row i's caption sits, under its pictures (it moves with the row; on a slide it drops a further slideCaption, being bigger). */
export const captionAt = (i) => ({ x: BOARD.w / 2, y: PATTERN.y[i] + PATTERN.h + PATTERN.caption });
/** The grand reveal: the name, big, in the middle of the board. */
export const REVEAL = { x: BOARD.w / 2, y: 228 };
/** The box for row i ('left' or 'right'), moved down by dy (0: where it sits among all three). Row 3's picture, on the left, is square, in the middle of its box. */
export function patternBox(i, side, dy = 0) {
  const { y, h } = PATTERN;
  const b = PATTERN[side];
  if (i === 2 && side === 'left') return { x: b.x + (b.w - h) / 2, y: y[i] + dy, w: h, h };
  return { x: b.x, y: y[i] + dy, w: b.w, h };
}
/** Your patient's MRI picture moves into the third row, on the left. */
export const PIC_FRAME = { x: MRI.picture.x - 4, y: MRI.picture.y - 4, w: MRI.picture.size + 8, h: MRI.picture.size + 8 };
export const picToPattern = (dy = 0) => fit(PIC_FRAME, patternBox(2, 'left', dy));
/** The picture's middle row, marked on the third row's picture (in the row's own place; the row and the picture move together). */
export function patternRowBand() {
  const f = picToPattern();
  const r = rowIn(MRI.picture, FIRST_ROW);
  return { x: f.tx + f.sx * (r.x - 2), y: f.ty + f.sy * r.y, w: f.sx * (r.w + 4), h: f.sy * r.h };
}
/** Row 1, right: the A note's four bars, as tall as their amounts. */
export function patternBars() {
  const b = patternBox(0, 'right');
  const w = b.w / A_NOTE.length;
  return A_NOTE.map((a, k) => ({ x: b.x + k * w + w * 0.2, w: w * 0.6, y: b.y + b.h - (a / STEPS) * (b.h - 8), h: (a / STEPS) * (b.h - 8) }));
}
/**
 * Row 3, right: the proton frequencies inside the picture's marked row, one bar for each of its 48 frequencies. Each is
 * as tall as the amount the Fourier transform finds in that row's signal, which is exactly the brightness of that
 * row's pixel: the row of the image, taken apart into its proton frequencies.
 */
export function patternSpectrum(rows = coarseRows()) {
  const b = patternBox(2, 'right');
  const found = unmix(chordSamples(rows[FIRST_ROW]), ROWS);
  const slot = b.w / ROWS;
  return found.map((a, k) => {
    const h = Math.max(0, a) * (b.h - 8);
    return { k, x: b.x + k * slot + slot * 0.15, w: slot * 0.7, y: b.y + b.h - h, h, color: neon(k, ROWS) };
  });
}
/** Row 2: a white beam into a small prism on the left; the colours fanning out on the right. */
export function patternLight() {
  const l = patternBox(1, 'left');
  const r = patternBox(1, 'right');
  const glass = { cx: l.x + l.w - 34, cy: l.y + l.h / 2 + 8, size: 52 };
  const [top, right, left] = triangle(glass);
  const into = { x: (top.x + left.x) / 2, y: (top.y + left.y) / 2 };
  const out = { x: (top.x + right.x) / 2, y: (top.y + right.y) / 2 };
  const rays = RAINBOW.map((color, i) => ({ from: { x: r.x, y: r.y + r.h / 2 }, to: { x: r.x + r.w, y: r.y + 8 + ((r.h - 16) * i) / (RAINBOW.length - 1) }, color }));
  return { glass, corners: [top, right, left], beam: { from: { x: l.x, y: into.y + 18 }, to: into }, out, rays };
}

// ── the break: you and the radiologist, standing in the hall ─────────────────────────────────────────────
export const BREAK = { height: 270, you: 180, radiologist: 510, walkFrom: 300 };
/** Where a figure stands at the break, centred at x, its feet on the hall's floor. */
export const figureBox = (cx) => figureAt(cx, HALL.floor, BREAK.height);

// ── the finale: a map of transformations ────────────────────────────────────────────────────────────────────────
// The Fourier transform is the hub, and the three things it already takes apart (sound, light, an MRI scan) are lit
// around it. Everywhere else, transformations not yet found: "?" nodes on a sunflower spiral, spreading out past the
// edges of the board, smaller and fainter the further they are. The name ENERGEO sits at the top.
export const MAP = { hub: { x: 196, y: 246, r: 30 }, leaf: 84, leafR: 12, spacing: 19, count: 820, title: { x: BOARD.w / 2, y: 58 }, sub: { y: 90 }, clearTop: 112, label: { dy: 54, halfW: 104 } };
/** The three things the Fourier transform already takes apart, on the hub's upper left, top to bottom: sound, light, MRI (clear of the hub's label below it). */
export function mapKnown() {
  const { hub, leaf } = MAP;
  return [230, 200, 170].map((deg, k) => {
    const a = (deg * Math.PI) / 180;
    return { k, x: hub.x + leaf * Math.cos(a), y: hub.y + leaf * Math.sin(a) };
  });
}
/**
 * The transformations not yet found: points of a sunflower spiral around the hub (golden angle), kept on the far side
 * of the hub from the known ones and clear of the name at the top, out to a little past the board's edges. Each has
 * its distance d from the hub, a radius that shrinks and an opacity that fades with d; the bigger ones carry a "?".
 */
export function mapUnknown() {
  const { hub, spacing, count, clearTop } = MAP;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out = [];
  for (let k = 6; k < count; k++) {
    const d = spacing * Math.sqrt(k);
    const x = hub.x + d * Math.cos(k * golden);
    const y = hub.y + d * Math.sin(k * golden);
    if (x < hub.x + 46 || x > BOARD.w + 30 || y < -20 || y > BOARD.h + 20) continue;
    if (y < clearTop && Math.abs(x - MAP.title.x) < 200) continue;
    if (Math.abs(x - hub.x) < MAP.label.halfW + 12 && Math.abs(y - (hub.y + MAP.label.dy)) < 22) continue;   // the hub's label
    const r = Math.max(2.5, 13 - d / 38);
    out.push({ x, y, d, r, opacity: Math.max(0.14, 1 - d / 560), mark: r >= 7.5 });
  }
  return out.sort((a, b) => a.d - b.d);
}
/** The grand reveal's title, moved and shrunk to become the hub's label, under the hub (its baseline MAP.label.dy below the hub's centre). */
export function revealToHub() {
  const s = 0.36;
  return { dx: MAP.hub.x - REVEAL.x, dy: MAP.hub.y + MAP.label.dy - REVEAL.y, s };
}

// ── a prism, drawn the same everywhere: a glass triangle with a highlight along its left face ───────────────────
// (Nadia, 2026-11-24: "making the triangle in all scenes a regular shaped prisim with no rainbow outline")
/** The highlight on a prism's left face, scaled with it (the chandelier's prism, size 48, sets the proportions). */
export function facetOf({ cx, cy, size }) {
  const [top, , left] = triangle({ cx, cy, size });
  const k = size / 48;
  return { x1: top.x, y1: top.y + 8 * k, x2: (top.x + left.x) / 2 + 6 * k, y2: (top.y + left.y) / 2 + 4 * k };
}
/** Where light (or sound) goes into a prism, the middle of its left face, and comes out, the middle of its right face. */
export function faces(t) {
  const [top, right, left] = triangle(t);
  return { into: { x: (top.x + left.x) / 2, y: (top.y + left.y) / 2 }, out: { x: (top.x + right.x) / 2, y: (top.y + right.y) / 2 } };
}

// ── the thought: is there a prism for sound? ─────────────────────────────────────────────────────────────────────
// (Nadia, 2026-11-24: "introducing a scene where a prisim is breaking up light, and in that same scene a prisim
// breaking apart sound into its components ... when the yellow shirt guy is thinking is there a prisim for music and
// pairing the just said visual to it in a thought bubble.") You stand in the dimmed hall; a thought bubble rises from
// your head. In it, two rows, the same prism in each: white light goes in and its colours fan out (red bent least),
// and your A note's wave goes in and its four pure tones fan out (A, high A, E, higher A, each as strong as it is in
// the note). The second row is the thought: the prism for sound, before the tuner turns out to be one.
export const THOUGHT = {
  you: { cx: 112, height: 200 },
  cloud: { x: 190, y: 12, w: 436, h: 296, r: 18 },
  rows: { light: 108, sound: 226 },
  prism: { dx: 204, size: 64 },
  inX: 46,                                                   // where the light and the sound start, from the cloud's left
  outPad: 30,                                                // where they end, from its right
  label: { dy: -38 },
  rays: { first: 4, step: 9 },
  tones: { first: -21, step: 20, fan: 0.3, cycles: 3, amp: 9 },
  wave: { periods: 2, amp: 17 },
};
/** The cloud: a scalloped outline whose arcs bulge out from a rectangle inset by r, all inside THOUGHT.cloud. */
export function cloudPath(c = THOUGHT.cloud) {
  const { x, y, w, h, r } = c;
  const x0 = x + r, y0 = y + r, x1 = x + w - r, y1 = y + h - r;
  const R = r * 1.02;
  const side = (ax, ay, bx, by) => {
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / (1.8 * r)));
    let d = '';
    for (let i = 1; i <= n; i++) d += ` A ${R.toFixed(1)} ${R.toFixed(1)} 0 0 1 ${(ax + ((bx - ax) * i) / n).toFixed(1)} ${(ay + ((by - ay) * i) / n).toFixed(1)}`;
    return d;
  };
  return `M ${x0} ${y0}${side(x0, y0, x1, y0)}${side(x1, y0, x1, y1)}${side(x1, y1, x0, y1)}${side(x0, y1, x0, y0)} Z`;
}
/** How far a cloud arc bulges out from its chord: each chord is at most 1.8 r long, each arc's radius 1.02 r. */
export const cloudBulge = (r = THOUGHT.cloud.r) => { const R = r * 1.02; const half = 0.9 * r; return R - Math.sqrt(R * R - half * half); };
/** You, thinking, standing on the hall's floor; the point just above your head, on its right, where the thought rises from. */
export const thinker = () => {
  const box = figureAt(THOUGHT.you.cx, HALL.floor, THOUGHT.you.height);
  const head = { x: box.x + (box.w * (FACE.head.cx + FACE.head.rx * 0.8)) / FIGURE.view.w, y: box.y + (box.h * (FACE.head.cy - FACE.head.ry)) / FIGURE.view.h };
  return { box, head };
};
/** The three little circles from your head up to the cloud, growing as they go. */
export function thoughtTrail() {
  const { head } = thinker();
  const c = THOUGHT.cloud;
  const to = { x: c.x + c.r * 1.6, y: c.y + c.h - c.r * 0.6 };
  return [[0.2, 4.5], [0.52, 7], [0.84, 10]].map(([t, r]) => ({ x: head.x + (to.x - head.x) * t, y: head.y + (to.y - head.y) * t, r }));
}
/** The prism in one row of the thought. */
export const thoughtPrism = (row) => ({ cx: THOUGHT.cloud.x + THOUGHT.prism.dx, cy: THOUGHT.rows[row], size: THOUGHT.prism.size });
const thoughtX = () => ({ x0: THOUGHT.cloud.x + THOUGHT.inX, x1: THOUGHT.cloud.x + THOUGHT.cloud.w - THOUGHT.outPad });
/** Light: a white beam into the prism, and its colours out of it, red bent least, violet most. */
export function thoughtLight() {
  const t = thoughtPrism('light');
  const { into, out } = faces(t);
  const { x0, x1 } = thoughtX();
  return {
    prism: t, beam: { from: { x: x0, y: into.y + 14 }, to: into },
    rays: RAINBOW.map((color, i) => ({ from: out, to: { x: x1, y: out.y + THOUGHT.rays.first + i * THOUGHT.rays.step }, color })),
    label: { x: x0, y: t.cy + THOUGHT.label.dy },
  };
}
/** Sound: your A note's wave into the prism, and its four pure tones out of it, fanning into lanes, each as strong as it is in the note. */
export function thoughtSound(n = 120) {
  const t = thoughtPrism('sound');
  const { into, out } = faces(t);
  const { x0, x1 } = thoughtX();
  const W = THOUGHT.wave;
  let note = '';
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    note += `${i ? 'L' : 'M'}${(x0 + u * (into.x - x0)).toFixed(1)} ${(into.y - (wave(A_NOTE, u * W.periods) / PEAK_A) * W.amp).toFixed(1)}`;
  }
  const T = THOUGHT.tones;
  const tones = A_NOTE.map((a, k) => {
    const lane = out.y + T.first + k * T.step;
    let d = '';
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const g = Math.min(1, u / T.fan);
      const y = out.y + (lane - out.y) * g - g * T.amp * (a / STEPS) * Math.sin(2 * Math.PI * T.cycles * (k + 1) * u);
      d += `${i ? 'L' : 'M'}${(out.x + u * (x1 - out.x)).toFixed(1)} ${y.toFixed(1)}`;
    }
    return { k, d, lane, color: NOTE_LED[k] };
  });
  return { prism: t, wave: note, tones, label: { x: x0, y: t.cy + THOUGHT.label.dy } };
}

// ── the grand reveal, lit by the stage light ────────────────────────────────────────────────────────────────────────
// (Nadia, 2026-11-24: "making the text rainbow isn't nessesary ... it can be a fun reveal with a stage light perhaps
// to keep it on theme.") The stage light from the start of the level stands on the floor again, swings to the middle
// of the board and lights a pool there; the name appears in it.
export const SPOT = { pool: { cx: REVEAL.x, cy: REVEAL.y - 15, rx: 300, ry: 62 }, spread: 64 };
/** The stage light aimed at the pool: its angle (radians, from the light's pivot), its lens, and the cone of light. */
export function spotlight() {
  const L = HALL.light;
  const { cx, cy } = SPOT.pool;
  const a = Math.atan2(cy - L.y, cx - L.x);
  const lens = { x: L.x + L.lens * Math.cos(a), y: L.y + L.lens * Math.sin(a) };
  const n = { x: -Math.sin(a), y: Math.cos(a) };
  const cone = [lens, { x: cx + n.x * SPOT.spread, y: cy + n.y * SPOT.spread }, { x: cx - n.x * SPOT.spread, y: cy - n.y * SPOT.spread }];
  return { a, deg: (a * 180) / Math.PI, lens, cone };
}

// ── the finale's other geometries ────────────────────────────────────────────────────────────────────────────────────
// (Nadia, 2026-11-24: "fourier is also just an example of using a specific geometry to uncover its given resultants.
// there are a bunch of geometries, that is the aim") When ENERGEO is named, some of the unknown nodes light up as hubs
// of their own, each with three little spokes: other geometries, each uncovering its own parts, none of them named.
export const GEOMETRIES = { min: 112, apart: 84, ring: 6, spoke: 18, dot: 3.2, max: 8, r: 5.5 };
export function otherGeometries() {
  const picked = [];
  for (const n of mapUnknown()) {
    if (picked.length >= GEOMETRIES.max) break;
    if (n.r < GEOMETRIES.r || n.d < GEOMETRIES.min) continue;
    const reach = n.r + GEOMETRIES.ring + GEOMETRIES.spoke + GEOMETRIES.dot + 4;
    if (n.x - reach < 0 || n.x + reach > BOARD.w || n.y - reach < MAP.clearTop || n.y + reach > BOARD.h) continue;
    if (Math.abs(n.x - MAP.hub.x) < MAP.label.halfW + reach && Math.abs(n.y - (MAP.hub.y + MAP.label.dy)) < 22 + reach) continue;   // clear of the hub's label
    if (picked.some((p) => Math.hypot(p.x - n.x, p.y - n.y) < GEOMETRIES.apart)) continue;
    picked.push(n);
  }
  return picked.map((n, i) => {
    const turn = (i * 0.7) % (2 * Math.PI / 3);
    const spokes = [0, 1, 2].map((j) => {
      const a = turn - Math.PI / 2 + (j * 2 * Math.PI) / 3;
      const r0 = n.r + GEOMETRIES.ring;
      const r1 = r0 + GEOMETRIES.spoke;
      return { x1: n.x + r0 * Math.cos(a), y1: n.y + r0 * Math.sin(a), x2: n.x + r1 * Math.cos(a), y2: n.y + r1 * Math.sin(a) };
    });
    return { ...n, ring: n.r + GEOMETRIES.ring, spokes };
  });
}
