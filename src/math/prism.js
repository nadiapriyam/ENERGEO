// Level 3, "A prism for sound" (docs/levels_spec.md, Revision 5). Pure functions, no DOM, no audio. (The app's own
// Fourier blocks are in fourier.js; this file is only the level's.)
//
// Three scenes, one idea: something that looks like one thing hides many.
//  • The hall. The learner aims a stage light at the chandelier; a glass prism hanging from it catches the beam. White
//    light goes in and colours come out, red bent least and violet most, as in a real prism.
//  • The tuner. Your A note's signal (its shape over time) and, through the prism for sound, its four notes as bars.
//    The bars are exact: the signal is their sum (tones.js).
//  • The scanner. Your head's tiny magnets flip and spin, faster towards the right (the scanner's magnet is a little
//    stronger there), so each place across a row has its own frequency, tone k + 1 for column k. The scanner picks up
//    a row's places all at once, as one signal. Taking it apart, a discrete Fourier transform
//    a_k = (2/N) Σ s_i sin(2π (k+1) i / N), gives back how many tiny magnets are at each place, exactly, and that is
//    the row's brightness. Row after row, the image.
//  • The pattern. Violin note → pure tones; stage light → its colours; proton frequencies → image.
//
// Scenes move into one another: each move is a fit of one box onto another.

import { A_NOTE, STEPS, wave } from './tones.js';
import { scanPixel } from './scanner.js';

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

// ── the scanner: magnets flipping → the MRI signal → its frequencies → a physical image ──────────────────────
export const ROWS = 48;                                     // the image: 48 rows of 48 places, as in Level 2
export const MRI = {
  head: { x: 14, y: 120, size: 172 },                       // your head, with its tiny magnets
  signal: { x: 226, y: 110, w: 188, h: 74 },                // the MRI signal (the violin's signal box moves here)
  glyph: { cx: 320, cy: 199, size: 20 },                    // taking it apart
  bars: { x: 226, y: 212, w: 188, h: 88 },                  // its frequencies
  picture: { x: 454, y: 120, size: 172 },                   // the physical image
  arrows: [{ x1: 192, x2: 220, y: 147 }, { x1: 420, x2: 448, y: 256 }],
  magnets: 8,                                               // tiny magnets drawn per side of the head (a few of countless)
};
export const RATE = 0.25;                                   // turns per second of the slowest spin, as drawn
/** How fast the tiny magnets at fraction xf (0 left … 1 right) across the head spin once flipped: faster to the right. */
export const spinRate = (xf) => RATE * (1 + 4 * xf);
/** The head slice from Level 2 (scanner.js), sampled at n × n places: how many tiny magnets are at each (0…1). */
export function coarseRows(n = ROWS) {
  return Array.from({ length: n }, (_, j) => Array.from({ length: n }, (_, i) => scanPixel(((i + 0.5) / n) * 2 - 1, ((j + 0.5) / n) * 2 - 1)));
}
/** The tiny magnets drawn in your head: a grid, kept only where there is some of you; each knows how far across it is. */
export function magnetSpots(n = MRI.magnets) {
  const { x, y, size } = MRI.head;
  const out = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const amount = scanPixel(((i + 0.5) / n) * 2 - 1, ((j + 0.5) / n) * 2 - 1);
    if (amount > 0) out.push({ x: x + ((i + 0.5) * size) / n, y: y + ((j + 0.5) * size) / n, xf: (i + 0.5) / n, amount });
  }
  return out;
}
/** The colour of the place at fraction xf across: the same colour as its frequency's bar. */
export const colourAt = (xf) => neon(Math.min(ROWS - 1, Math.floor(xf * ROWS)), ROWS);
/** What the scanner picks up from one row: place k sends tone k + 1, as strong as how many tiny magnets are there. Sampled N > 2n times over one period, so it can be taken apart exactly. */
export const chordSamples = (amounts, N = 4 * amounts.length + 8) =>
  Array.from({ length: N }, (_, i) => amounts.reduce((s, a, k) => s + a * Math.sin((2 * Math.PI * (k + 1) * i) / N), 0));
/** Taking a signal apart: how much of each tone is in it (a discrete Fourier transform). */
export const unmix = (samples, n) =>
  Array.from({ length: n }, (_, k) => (2 / samples.length) * samples.reduce((s, v, i) => s + v * Math.sin((2 * Math.PI * (k + 1) * i) / samples.length), 0));
/** Frequency k's bar in the bars box: as tall as its amount, in its place's colour. */
export function mriBar(k, a) {
  const { x, y, w, h } = MRI.bars;
  const step = w / ROWS;
  const height = Math.max(0, Math.min(1, a)) * (h - 8);
  return { x: x + k * step + step * 0.15, w: step * 0.7, y: y + h - 4 - height, h: height };
}
/** The order rows are read in: from the middle outwards, so the first rows already cross the head. */
export function rowOrder(n) {
  const mid = Math.floor(n / 2);
  const out = [mid];
  for (let d = 1; out.length < n; d++) { if (mid - d >= 0) out.push(mid - d); if (mid + d < n) out.push(mid + d); }
  return out;
}
export const FIRST_ROW = rowOrder(ROWS)[0];
/** Row j's band across a square box (the head being read, or the image being made). */
export const rowIn = (box, j) => ({ x: box.x, y: box.y + (j * box.size) / ROWS, w: box.size, h: box.size / ROWS });
/** The outline of your head in a square box: where Level 2's head slice ends. */
export const outlineIn = (box) => ({ cx: box.x + box.size / 2, cy: box.y + box.size / 2, rx: 0.8 * (box.size / 2), ry: 0.95 * (box.size / 2) });
export const toSignal = () => fit(STRIP_BOX, MRI.signal);    // the violin's signal box becomes the MRI signal's

// ── the characters: you, the player (the style Nadia shared: short dark hair, big round glasses, a yellow shirt, plus a
//    bucket hat), and the technician who scanned you (the same deadpan face, copper hair, a blue shirt) ──
export const FACE = {
  view: { w: 120, h: 132 },
  head: { cx: 60, cy: 58, rx: 34, ry: 40 },
  ears: [{ cx: 26, cy: 62, rx: 6, ry: 9 }, { cx: 94, cy: 62, rx: 6, ry: 9 }],
  eyes: [{ cx: 45, cy: 58 }, { cx: 75, cy: 58 }],
  eyeR: 9,
  pupilR: 3.2,
  rimR: 12.5,
  brows: [{ x1: 34, y1: 41, x2: 55, y2: 43 }, { x1: 65, y1: 43, x2: 86, y2: 41 }],
  mouth: { x1: 52, x2: 68, y: 84 },
  neck: { x: 51, y: 92, w: 18, h: 16 },
};
/** The hair: a short cap over the top of the head. */
export function hairPath() {
  const { cx, cy, rx, ry } = FACE.head;
  return `M ${cx - rx - 1} ${cy - 4} C ${cx - rx - 1} ${cy - ry - 20} ${cx + rx + 1} ${cy - ry - 20} ${cx + rx + 1} ${cy - 4} C ${cx + rx - 6} ${cy - ry + 2} ${cx - rx + 6} ${cy - ry + 2} ${cx - rx - 1} ${cy - 4} Z`;
}
export function shirtPath() {
  const { w, h } = FACE.view;
  return `M 12 ${h} C 14 ${h - 20} 34 ${h - 28} ${w / 2} ${h - 28} C ${w - 34} ${h - 28} ${w - 14} ${h - 20} ${w - 12} ${h} Z`;
}
/** Where a pupil sits when its eye looks toward `target`: as far that way as it can go and still stay inside the eye. */
export function lookAt(eye, target) {
  const dx = target.x - eye.cx;
  const dy = target.y - eye.cy;
  const d = Math.hypot(dx, dy);
  const reach = FACE.eyeR - FACE.pupilR - 1;
  const k = d < 1e-9 ? 0 : Math.min(reach, d) / d;
  return { x: eye.cx + dx * k, y: eye.cy + dy * k };
}

/** You, the player: dark hair, a yellow shirt and a bucket hat. The technician: the same face, copper hair, a blue shirt. */
export const PLAYER = { hair: '#2a2a2a', shirt: '#ffd21f', hat: '#c4a46a', band: '#8a7140' };
export const TECH = { hair: '#b5602c', shirt: '#4f8fe8' };
/** The bucket hat: a crown over the top of the head (covering the hair), a band, and a brim that slopes down and out all round. */
export function bucketHat() {
  const { cx, cy, rx, ry } = FACE.head;
  const top = cy - ry - 24;                                  // the crown's curve rises above the hair
  const base = cy - ry + 13;                                 // where the crown meets the brim, just above the brows
  const wide = rx + 16;                                      // the brim reaches past the head on both sides
  return {
    crown: `M ${cx - rx - 1} ${base} C ${cx - rx + 2} ${top} ${cx + rx - 2} ${top} ${cx + rx + 1} ${base} Z`,
    band: `M ${cx - rx} ${base - 6} Q ${cx} ${base - 9} ${cx + rx} ${base - 6} L ${cx + rx + 1} ${base} L ${cx - rx - 1} ${base} Z`,
    brim: `M ${cx - rx - 2} ${base - 2} Q ${cx} ${base - 6} ${cx + rx + 2} ${base - 2} L ${cx + wide} ${base + 6} Q ${cx} ${base + 10} ${cx - wide} ${base + 6} Z`,
    top, base, wide,
  };
}

// ── the pattern: three rows, one thing on the left, what it is made of on the right ─────────────────────────
export const PATTERN = { y: [14, 150, 286], h: 104, left: { x: 40, w: 230 }, right: { x: 370, w: 230 }, arrow: { x1: 290, x2: 350 } };
/** The box for row i ('left' or 'right'). Row 2's picture is square, in the middle of its box. */
export function patternBox(i, side) {
  const { y, h } = PATTERN;
  const b = PATTERN[side];
  if (i === 2 && side === 'right') return { x: b.x + (b.w - h) / 2, y: y[i], w: h, h };
  return { x: b.x, y: y[i], w: b.w, h };
}
/** The scanner's signal box and your picture move into the third row. */
export const PIC_FRAME = { x: MRI.picture.x - 4, y: MRI.picture.y - 4, w: MRI.picture.size + 8, h: MRI.picture.size + 8 };
export const stripToPattern = () => fit(STRIP_BOX, patternBox(2, 'left'));
export const picToPattern = () => fit(PIC_FRAME, patternBox(2, 'right'));
/** Row 1, right: the A note's four bars, as tall as their amounts. */
export function patternBars() {
  const b = patternBox(0, 'right');
  const w = b.w / A_NOTE.length;
  return A_NOTE.map((a, k) => ({ x: b.x + k * w + w * 0.2, w: w * 0.6, y: b.y + b.h - (a / STEPS) * (b.h - 8), h: (a / STEPS) * (b.h - 8) }));
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
