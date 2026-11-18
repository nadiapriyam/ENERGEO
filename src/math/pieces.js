// Interactive 01 at try/ (docs/prototype_try_spec.md, Revision 2). Pure functions, no DOM.
//
// A piece points right (→, +1) or left (←, −1). The TOTAL is the sum of the pieces in play: an integer, so every
// value shown — including the 0 — is exact. Sliding pieces around does not change a sum; what changes the TOTAL in the
// activity is a left piece joining a right piece in the row under the TOTAL. So the three → pieces start in that row
// (TOTAL 3, pointing right) and the three ← pieces wait below it; each ← that is paired joins the row, and the TOTAL
// goes 3 → 2 → 1 → 0. Every piece stays visible throughout.

export const RIGHT = 1;
export const LEFT = -1;

/** Direction of a piece id: 'R…' points right, 'L…' points left. */
export const dirOf = (id) => (id[0] === 'R' ? RIGHT : LEFT);
/** The TOTAL of a set of pieces (ids or directions). */
export const total = (pieces) => pieces.reduce((s, p) => s + (typeof p === 'string' ? dirOf(p) : p), 0);

// ── geometry (SVG user units) ──────────────────────────────────────────────────────────────────────
export const VIEW = { w: 640, h: 400 };
export const PIECE = { length: 60, height: 26 };
export const ROWS = { top: 52, label: 118, total: 172, mat: 268, pairZero: 302, supply: 352 };
export const UNIT = 40;                       // TOTAL arrow length per piece
const C = VIEW.w / 2;

/** Three pairs in the row under the TOTAL; each pair is ← then →, nearly touching. */
export const PAIRS = [0, 1, 2].map((p) => {
  const cx = C + (p - 1) * 172;
  return { left: { x: cx - 33, y: ROWS.mat }, right: { x: cx + 33, y: ROWS.mat }, zero: { x: cx, y: ROWS.pairZero } };
});

/** The start: three → in the row (one per pair), three ← waiting below. */
export function start() {
  return {
    row: ['R0', 'R1', 'R2'],
    waiting: ['L0', 'L1', 'L2'],
    pairedWith: [null, null, null],          // pair p holds the id of the ← paired with R p
  };
}
export const supplySpot = (k) => ({ x: C + (k - 1) * 96, y: ROWS.supply });
export const restingSpot = (id) => (id[0] === 'R' ? PAIRS[+id.slice(1)].right : supplySpot(+id.slice(1)));

/** The pieces counted by the TOTAL: the row (→ pieces and every ← paired into it). */
export const inPlay = (s) => [...s.row, ...s.pairedWith.filter(Boolean)];
export const totalOf = (s) => total(inPlay(s));
export const pairedCount = (s) => s.pairedWith.filter(Boolean).length;
export const freePairs = (s) => s.pairedWith.map((v, p) => (v ? -1 : p)).filter((p) => p >= 0);

/**
 * Where a ← dropped at (x, y) goes. Generous: anywhere above the waiting row counts as an attempt to pair, and the piece
 * joins the free pair whose ← spot is nearest in x. Returns the pair index, or null (back to its waiting spot).
 */
export function dropTarget(s, x, y) {
  const free = freePairs(s);
  if (!free.length || y > (ROWS.mat + ROWS.supply) / 2 + 8) return null;
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

// ── the four arrangements behind the same 0 ────────────────────────────────────────────────────────
// Ids keep their direction, so the same pieces move between arrangements and new pieces join. Each is balanced.
export const ARRANGEMENTS = [
  { name: 'learner', rows: [['L0', 'R0', 'L1', 'R1', 'L2', 'R2']] },                                   // ← → ← → ← →
  { name: 'rearranged', rows: [['L0', 'L1', 'R0', 'R1', 'L2', 'R2']] },                                // ← ← → → ← →
  { name: 'more', rows: [['L0', 'L1', 'L2', 'R0', 'R1', 'R2', 'L3', 'R3']] },                          // ← ← ← → → → ← →
  { name: 'denser', rows: [['R0', 'R1', 'R2', 'L0', 'L1', 'L2'], ['L3', 'R3', 'R4', 'L4', 'L5', 'R5']] }, // two rows around the 0
];

/** Positions of every piece in arrangement k. Arrangement 1 is exactly the learner's finished row. */
export function layout(k) {
  const a = ARRANGEMENTS[k];
  if (k === 0) return a.rows[0].map((id, i) => ({ id, ...(i % 2 ? PAIRS[(i - 1) / 2].right : PAIRS[i / 2].left) }));
  if (k === 3) {
    const ys = [ROWS.top, ROWS.mat];
    return a.rows.flatMap((row, r) => row.map((id, i) => ({ id, x: C + (i - (row.length - 1) / 2) * 78, y: ys[r] })));
  }
  const row = a.rows[0];
  const step = row.length > 6 ? 72 : 78;
  return row.map((id, i) => ({ id, x: C + (i - (row.length - 1) / 2) * step, y: ROWS.mat }));
}

/** The direction pattern of an arrangement, row by row (e.g. '←→←→←→'). */
export const pattern = (k) => ARRANGEMENTS[k].rows.map((r) => r.map((id) => (dirOf(id) > 0 ? '→' : '←')).join('')).join(' / ');
