// Interactive 01 at try/ (docs/prototype_try_spec.md, Revision 3). Pure functions, no DOM.
//
// A piece is one proton pictured as an arrow: it points right (→, +1, with the scanner's magnet) or left (←, −1). The
// TOTAL is the sum of the arrows inside the drop: an integer, so every value shown, the 0 included, is exact. Sliding
// arrows around inside the drop never changes a sum; what changes the TOTAL is an arrow entering the drop. So the three
// → start inside the drop (TOTAL 3) and the three ← wait outside it; each ← paired with a → enters the drop, and the
// TOTAL goes 3 → 2 → 1 → 0. Every arrow stays visible throughout. The TOTAL is drawn as that many arrows joined tip to
// tail, so it is visibly made of the pieces.

export const RIGHT = 1;
export const LEFT = -1;

/** Direction of a piece id: 'R…' points right, 'L…' points left (a flipped piece is tracked by the caller). */
export const dirOf = (id) => (id[0] === 'R' ? RIGHT : LEFT);
/** The TOTAL of a set of pieces (ids or directions). */
export const total = (pieces) => pieces.reduce((s, p) => s + (typeof p === 'string' ? dirOf(p) : p), 0);

// ── geometry (SVG user units) ──────────────────────────────────────────────────────────────────────
export const VIEW = { w: 640, h: 400 };
export const PIECE = { length: 60, height: 26 };
export const PANEL = { x: 200, y: 8, w: 240, h: 120, cx: 320, cy: 72, labelY: 30, numberY: 114 };
export const DROP = { x: 24, y: 110, w: 592, h: 200, r: 36 };
export const ROWS = { mat: 226, pairZero: 262, supply: 356, upper: 176, lower: 270 };
const C = VIEW.w / 2;

/** Three pairs inside the drop; each pair is a ← spot then a → spot, nearly touching. */
export const PAIRS = [0, 1, 2].map((p) => {
  const cx = C + (p - 1) * 172;
  return { left: { x: cx - 33, y: ROWS.mat }, right: { x: cx + 33, y: ROWS.mat }, zero: { x: cx, y: ROWS.pairZero } };
});

/** The start: three → in the drop (one per pair), three ← waiting outside it. */
export function start() {
  return {
    row: ['R0', 'R1', 'R2'],
    waiting: ['L0', 'L1', 'L2'],
    pairedWith: [null, null, null],          // pair p holds the id of the ← paired with R p
  };
}
export const supplySpot = (k) => ({ x: C + (k - 1) * 96, y: ROWS.supply });
export const restingSpot = (id) => (id[0] === 'R' ? PAIRS[+id.slice(1)].right : supplySpot(+id.slice(1)));

/** The pieces counted by the TOTAL: the ones inside the drop. */
export const inPlay = (s) => [...s.row, ...s.pairedWith.filter(Boolean)];
export const totalOf = (s) => total(inPlay(s));
export const pairedCount = (s) => s.pairedWith.filter(Boolean).length;
export const freePairs = (s) => s.pairedWith.map((v, p) => (v ? -1 : p)).filter((p) => p >= 0);

/**
 * Where a ← dropped at (x, y) goes. Generous: anywhere above the line between the drop's row and the waiting row
 * counts as an attempt to pair, and the piece joins the free pair whose ← spot is nearest in x. Returns the pair index,
 * or null (back to its waiting spot).
 */
export const DROP_LINE = (ROWS.mat + ROWS.supply) / 2 + 8;
export function dropTarget(s, x, y) {
  const free = freePairs(s);
  if (!free.length || y > DROP_LINE) return null;
  return free.reduce((best, p) => (Math.abs(PAIRS[p].left.x - x) < Math.abs(PAIRS[best].left.x - x) ? p : best), free[0]);
}
/** A tap on a waiting ←: it pairs with the free → nearest to it. */
export const tapTarget = (s, id) => dropTarget(s, supplySpot(+id.slice(1)).x, ROWS.mat);

/** Pair ← `id` with pair p. Returns a new state. */
export function pair(s, id, p) {
  if (s.pairedWith[p] || !s.waiting.includes(id)) return s;
  const pairedWith = [...s.pairedWith];
  pairedWith[p] = id;
  return { row: s.row, waiting: s.waiting.filter((w) => w !== id), pairedWith };
}

// ── the TOTAL, drawn as arrows joined tip to tail ────────────────────────────────────────────────
export const SEGMENT = { scale: 0.7, pitch: 38 };
/** Where each of the |value| small arrows of the TOTAL sits, centred in the panel. */
export const segmentSpots = (value) => {
  const n = Math.abs(value);
  return Array.from({ length: n }, (_, i) => ({ x: PANEL.cx + (i - (n - 1) / 2) * SEGMENT.pitch, y: PANEL.cy }));
};

// ── the four arrangements behind the same 0 ────────────────────────────────────────────────────────
// Ids keep their direction, so the same pieces move between arrangements and new pieces join. Each is balanced.
export const ARRANGEMENTS = [
  { name: 'learner', rows: [['L0', 'R0', 'L1', 'R1', 'L2', 'R2']] },                                   // ← → ← → ← →
  { name: 'rearranged', rows: [['L0', 'L1', 'R0', 'R1', 'L2', 'R2']] },                                // ← ← → → ← →
  { name: 'more', rows: [['L0', 'L1', 'L2', 'R0', 'R1', 'R2', 'L3', 'R3']] },                          // ← ← ← → → → ← →
  { name: 'denser', rows: [['R0', 'R1', 'R2', 'L0', 'L1', 'L2'], ['L3', 'R3', 'R4', 'L4', 'L5', 'R5']] }, // two rows
];

/** Positions of every piece in arrangement k. Arrangement 1 is exactly the learner's finished drop. */
export function layout(k) {
  const a = ARRANGEMENTS[k];
  if (k === 0) return a.rows[0].map((id, i) => ({ id, ...(i % 2 ? PAIRS[(i - 1) / 2].right : PAIRS[i / 2].left) }));
  if (k === 3) {
    const ys = [ROWS.upper, ROWS.lower];
    return a.rows.flatMap((row, r) => row.map((id, i) => ({ id, x: C + (i - (row.length - 1) / 2) * 78, y: ys[r] })));
  }
  const row = a.rows[0];
  const step = row.length > 6 ? 72 : 78;
  return row.map((id, i) => ({ id, x: C + (i - (row.length - 1) / 2) * step, y: ROWS.mat }));
}

/** The direction pattern of an arrangement, row by row (e.g. '←→←→←→'). */
export const pattern = (k) => ARRANGEMENTS[k].rows.map((r) => r.map((id) => (dirOf(id) > 0 ? '→' : '←')).join('')).join(' / ');

// ── the scanner's magnet: a bigger crowd of cancelled pairs, then one flips ───────────────────────────
export const CROWD = { rows: [170, 222, 274], cols: 5, pitch: 112, half: 24, scale: 0.72, zeroDrop: 20 };
/** The magnet's field lines run between the rows of the crowd, never through an arrow or a 0. */
export const FIELD_LINES = [149, 205, 257, 305];
/** Fifteen ← → pairs in the drop, all cancelled: pair k holds L k and R k. */
export function crowd() {
  const out = [];
  CROWD.rows.forEach((y, r) => {
    for (let c = 0; c < CROWD.cols; c++) {
      const k = r * CROWD.cols + c;
      const cx = C + (c - (CROWD.cols - 1) / 2) * CROWD.pitch;
      out.push({ k, cx, y, zero: { x: cx, y: y + CROWD.zeroDrop }, left: { id: `L${k}`, x: cx - CROWD.half, y }, right: { id: `R${k}`, x: cx + CROWD.half, y } });
    }
  });
  return out;
}
/** With the magnet on, one ← in the middle of the crowd turns to point with it: the balance tips by exactly 2. */
export const FLIP = 'L7';
export function crowdDirections(magnetOn) {
  const dirs = {};
  for (const p of crowd()) { dirs[p.left.id] = LEFT; dirs[p.right.id] = RIGHT; }
  if (magnetOn) dirs[FLIP] = RIGHT;
  return dirs;
}
export const crowdTotal = (magnetOn) => total(Object.values(crowdDirections(magnetOn)));
