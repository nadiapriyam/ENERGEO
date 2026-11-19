// Level 2, "Inside a note" (docs/level2_spec.md): the sound. Pure functions, no DOM, no audio.
//
// The violin's A shakes 440 times a second. Its shape repeats, but it is not one pure tone: it is several pure tones at
// once, at 1, 2, 3 and 4 times 440 Hz. Those are the notes A, high A, E and higher A, and to our ears they fuse into one
// A. Here x is time in periods of the A (1/440 s), and the A's shape is  wave(x) = Σ (a_k / 3) · sin(2π k x).

export const PITCH = 440;                             // Hz: the violin's open A string, the note the orchestra tunes to
/** How much of each hidden note the A carries: a bowed string's tones fall off roughly as 1/k. */
export const A_NOTE = [3, 2, 1, 1];
export const STEPS = 3;
/** The hidden notes: k times the pitch, and the note each one is. */
export const HIDDEN = A_NOTE.map((a, i) => ({ k: i + 1, hz: PITCH * (i + 1), amount: a }));
/** The equal-tempered note nearest to a frequency: its name and how far off it is, in cents. */
const NAMES = ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'];
export function nearestNote(hz) {
  const semis = 12 * Math.log2(hz / 440);
  const n = Math.round(semis);
  return { name: NAMES[((n % 12) + 12) % 12], octavesUp: Math.floor(n / 12), cents: 100 * (semis - n) };
}

/** sin(2π t), exact at every quarter turn. */
export function sinTurns(t) {
  const q = Math.round(t * 4);
  if (Math.abs(t * 4 - q) < 1e-12) return [0, 1, 0, -1][((q % 4) + 4) % 4];
  return Math.sin(2 * Math.PI * t);
}
/** The shape of a mix of hidden notes at time x (in periods of the A). */
export const wave = (amounts, x) => amounts.reduce((s, a, k) => s + (a / STEPS) * sinTurns((k + 1) * x), 0);
/** One hidden note on its own. */
export const part = (amounts, k) => amounts.map((a, i) => (i === k ? a : 0));
export function peak(amounts, n = 2000) {
  let m = 0;
  for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(wave(amounts, i / n)));
  return m;
}

// ── the inside of the sound (SVG user units) ─────────────────────────────────────────────────────
export const STAGE = { x: 24, y: 24, w: 592, h: 352, periods: 2.5 };
/** Lane i of n stacked across the stage. */
export function lane(i, n) {
  const gap = n > 1 ? 8 : 0;
  const h = (STAGE.h - gap * (n - 1)) / n;
  const top = STAGE.y + i * (h + gap);
  return { i, n, top, cy: top + h / 2, half: h / 2, h };
}
const UNIT = 0.8 / peak(A_NOTE);                       // the whole A fills most of a lane
export const LABEL_W = 112;                            // room on the left of a lane for the note's name
/** A path through a mix's shape across the stage, in a lane, shifted by `shift` periods; `scale` sizes its swing. */
export function wavePath(amounts, ln, shift = 0, scale = UNIT, n = 260) {
  let d = '';
  const x0 = STAGE.x + LABEL_W;
  const w = STAGE.w - LABEL_W - 16;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const y = ln.cy - wave(amounts, u * STAGE.periods + shift) * scale * ln.half;
    d += `${i ? 'L' : 'M'}${(x0 + u * w).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}
/** Pixels per unit of swing, the same for the whole A and for each hidden note, so the notes add up on screen. */
export const PX = lane(0, 4).half * 0.88;
/** A path through a mix's shape across the stage, centred on the line y = cy, shifted by `shift` periods. */
export function trace(amounts, cy, shift = 0, n = 260) {
  let d = '';
  const x0 = STAGE.x + LABEL_W;
  const w = STAGE.w - LABEL_W - 16;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    d += `${i ? 'L' : 'M'}${(x0 + u * w).toFixed(1)} ${(cy - wave(amounts, u * STAGE.periods + shift) * PX).toFixed(1)}`;
  }
  return d;
}
