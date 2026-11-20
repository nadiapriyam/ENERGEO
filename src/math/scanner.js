// Interactive 01 at try/ (docs/prototype_try_spec.md, Revision 3): the story scenes around the pieces. Pure functions
// and numbers, no DOM. Every position drawn by the page comes from here or from pieces.js.
//
// The MRI facts the learner copy uses, with the numbers behind them (checked by test/try.test.js):
//   • proton excess in the scanner's field: N↑−N↓ over N ≈ γħB / 2kT (high-temperature Boltzmann limit),
//     about 5 per million at 1.5 T and 10 per million at 3 T, at body temperature (310 K);
//   • a clinical magnet (1.5–3 T) against Earth's field (about 50 µT): 30 000 to 60 000 times stronger;
//   • hydrogen atoms in one drop of water (0.05 mL): 2 × (0.05 g / 18.015 g/mol) × N_A ≈ 3.3 × 10²¹.

export const PHYS = {
  gamma: 2.675e8,          // proton gyromagnetic ratio, rad s⁻¹ T⁻¹
  hbar: 1.0546e-34,        // J s
  kB: 1.3807e-23,          // J K⁻¹
  bodyT: 310,              // K
  earthField: 50e-6,       // T
  fields: [1.5, 3],        // T, common clinical scanners
  dropMl: 0.05,
  waterMolarMass: 18.015,  // g mol⁻¹
  avogadro: 6.022e23,
};
/** Uncancelled protons per million in field B (tesla). */
export const excessPerMillion = (B) => (PHYS.gamma * PHYS.hbar * B) / (2 * PHYS.kB * PHYS.bodyT) * 1e6;
export const timesEarth = (B) => B / PHYS.earthField;
export const hydrogenInDrop = () => 2 * (PHYS.dropMl / PHYS.waterMolarMass) * PHYS.avogadro;

// ── scene 1: the scanner, seen from the side ─────────────────────────────────────────────────────
export const FLOOR = 362;
export const HOUSING = { x: 110, y: 64, w: 230, h: FLOOR - 64, r: 34 };
export const BORE = { cx: 340, cy: 206, rx: 24, ry: 84, holeRx: 15, holeRy: 62 };
export const TUNNEL = { x: 120, y: 150, w: 220, h: 112 };
export const COILS = [146, 186, 226, 266, 306].map((x) => ({ x: x - 6, y: 92, w: 12, h: 228 }));
export const TABLE = { x: 330, y: 250, w: 280, h: 14 };
export const PEDESTAL = { x: 450, y: TABLE.y + TABLE.h, w: 100, h: FLOOR - TABLE.y - TABLE.h };
export const PATIENT = {
  head: { cx: 362, cy: 234, r: 15 },
  body: { x: 378, y: 222, w: 200, h: 26, r: 13 },
};
export const SLIDE = -200;                                   // the table slides this far into the bore
/** You, taking the scan: standing on the floor beside the scanner, looking at your patient. */
export const OPERATOR = { cx: 56, height: 200, look: { x: 600, y: 120 } };
export const ZOOM = { x: 232, y: 235, scale: 4 };            // the chest, once inside

// ── scene 2: three water molecules, then their six hydrogen atoms, each with a proton at its heart ──
export const ATOM = { o: 34, h: 24, bond: 60, proton: 16, halfAngle: (104.5 / 2) * (Math.PI / 180) };
const MOLECULES = [
  { o: { x: 150, y: 205 }, tilt: 0.35, ids: ['U0', 'D1'] },
  { o: { x: 330, y: 250 }, tilt: Math.PI, ids: ['D0', 'U1'] },
  { o: { x: 506, y: 205 }, tilt: -0.4, ids: ['U2', 'D2'] },
];
/** Each molecule: its oxygen centre and its two hydrogen atoms, each carrying the id of the arrow it becomes. */
export function molecules() {
  return MOLECULES.map(({ o, tilt, ids }) => ({
    o,
    h: [tilt + ATOM.halfAngle, tilt - ATOM.halfAngle].map((t, k) => ({
      id: ids[k],
      x: +(o.x + ATOM.bond * Math.sin(t)).toFixed(2),
      y: +(o.y + ATOM.bond * Math.cos(t)).toFixed(2),
    })),
  }));
}
export const hydrogenSpot = (id) => molecules().flatMap((m) => m.h).find((h) => h.id === id);

// ── the picture the scanner paints ───────────────────────────────────────────────────────────────
export const SCREEN = { x: 200, y: 144, size: 240, n: 48 };
/**
 * An illustration of a head slice in the style of an MRI image (not a real scan): bright scalp, dark skull, grey and
 * white matter with a folded border, two dark fluid spaces in the middle. u, v in [−1, 1]; returns brightness in [0, 1].
 */
export function scanPixel(u, v) {
  const e = Math.hypot(u / 0.8, v / 0.95);
  if (e > 1) return 0;
  if (e > 0.93) return 0.85;
  if (e > 0.86) return 0.1;
  if (e > 0.83) return 0.22;
  const w = v + 0.04;
  if (((Math.abs(u) - (0.055 + 0.9 * w * w)) / 0.045) ** 2 + (w / 0.26) ** 2 < 1) return 0.16;   // bowed outward at both ends
  if (Math.abs(u) < 0.015 && (v < -0.3 || v > 0.3)) return 0.26;
  const th = Math.atan2(v, Math.abs(u));
  const folds = 0.6 + 0.05 * Math.sin(9 * th) + 0.025 * Math.sin(17 * th + 1);
  if (e < folds) return 0.78;
  return e > folds + 0.05 && Math.sin(15 * th + 0.5) > 0.82 ? 0.3 : 0.52;                      // grooves in the grey rim
}
const grain = (i, j) => { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s) - 0.5; };
/** The picture as a grid of cells, row by row (the order it is painted in). */
export function picture() {
  const { x, y, size, n } = SCREEN;
  const c = size / n;
  const cells = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const g = scanPixel(((i + 0.5) / n) * 2 - 1, ((j + 0.5) / n) * 2 - 1);
    cells.push({ i, j, x: x + i * c, y: y + j * c, size: c, g: g === 0 ? 0 : Math.min(1, Math.max(0, g + 0.06 * grain(i, j))) });
  }
  return cells;
}

// ── the eye: the picture's parts go in, one picture is what you see ─────────────────────────────────
/** The painted picture slides left to make room; an eye looks at it; what the eye sees is drawn on the right. */
export const PICTURE_SHIFT = -150;
export const EYE = { x: 372, y: 264, rx: 38, ry: 22, iris: 12, look: -9 };
export const SEEN = { x: 452, y: 194, size: 150, label: { x: 527, y: 180 } };
/** A few of the picture's cells (after the shift), each sending a line into the eye: the parts it takes in. */
export function eyeFeeds(n = 6) {
  const { x, y, size } = SCREEN;
  return Array.from({ length: n }, (_, i) => {
    const u = 0.22 + 0.56 * ((i * 0.618) % 1);            // spread over the head, not the dark corners
    const v = 0.18 + (0.64 * i) / (n - 1);
    return { from: { x: x + PICTURE_SHIFT + u * size, y: y + v * size }, to: { x: EYE.x + EYE.look - 2, y: EYE.y } };
  });
}
/** The transform that draws the whole picture (screen box included) small, as what you see. */
export const seenTransform = () => {
  const s = SEEN.size / (SCREEN.size + 12);
  return { s, tx: SEEN.x - (SCREEN.x - 6) * s, ty: SEEN.y - (SCREEN.y - 6) * s };
};

// ── side by side with Level 1: one A note hides many notes; one 0 signal hides many tiny magnets ───────────────
export const COMPARE = {
  left: { x: 24, y: 24, w: 288, h: 392 },
  right: { x: 328, y: 24, w: 288, h: 392 },
  labelY: 58,
  notesY: [112, 160, 208, 256],                           // the four notes, one under another
  sumY: 340,
  magnetsY: 196,
  bracketY: 244,
  resultY: 352,
};
