// Interactive 01 at try/ (docs/prototype_try_spec.md, Revision 4). Pure functions, no DOM.
//
// A piece is one proton: a tiny magnet, drawn as an arrow from its S end to its N end. It points up (↑, +1, with the
// scanner's magnet, drawn pointing up as MRI pictures usually draw it) or down (↓, −1). The TOTAL adds up every arrow
// inside the drop, and the page shows that adding as a row of arrows with + between them and = and the result after
// them, so the learner sees that the 0 is the result of adding things up. The result is an integer, so every value
// shown, the 0 included, is exact.
//
// Sliding arrows around inside the drop never changes a sum; what changes the TOTAL is an arrow entering the drop. So
// the three ↑ start inside the drop (TOTAL 3) and the three ↓ wait outside it; each ↓ paired with an ↑ enters the drop,
// and the TOTAL goes 3 → 2 → 1 → 0. Every arrow stays visible throughout, and every balanced group is shown as a group,
// with its own 0.

export const UP = 1;
export const DOWN = -1;

/** Direction of a piece id: 'U…' points up, 'D…' points down (a flipped piece is tracked by the caller). */
export const dirOf = (id) => (id[0] === 'U' ? UP : DOWN);
/** The TOTAL of a set of pieces (ids or directions). */
export const total = (pieces) => pieces.reduce((s, p) => s + (typeof p === 'string' ? dirOf(p) : p), 0);

// ── geometry (SVG user units) ──────────────────────────────────────────────────────────────────────
export const VIEW = { w: 640, h: 440 };
export const PIECE = { length: 61, width: 30 };              // an upright bar magnet with a pointed N end
export const PANEL = { x: 120, y: 6, w: 400, h: 150, cx: 320, labelY: 22, sumY: 56, bracketY: 84, resultY: 126, sumWidth: 360, eqX: 298, valueX: 340 };
export const DROP = { x: 24, y: 146, w: 592, h: 208, r: 36 };
export const ROWS = { mat: 248, supply: 400 };
export const GROUP = { pad: 10, label: 20 };                 // the outline around a balanced group, and its 0 below it
const C = VIEW.w / 2;

/** Three pairs inside the drop; each pair is a ↓ spot then an ↑ spot, side by side. */
export const PAIRS = [0, 1, 2].map((p) => {
  const cx = C + (p - 1) * 172;
  return { cx, down: { x: cx - 19, y: ROWS.mat }, up: { x: cx + 19, y: ROWS.mat } };
});

/** The start: three ↑ in the drop (one per pair), three ↓ waiting outside it. */
export function start() {
  return {
    row: ['U0', 'U1', 'U2'],
    waiting: ['D0', 'D1', 'D2'],
    pairedWith: [null, null, null],          // pair p holds the id of the ↓ paired with U p
  };
}
export const supplySpot = (k) => ({ x: C + (k - 1) * 100, y: ROWS.supply });
export const restingSpot = (id) => (id[0] === 'U' ? PAIRS[+id.slice(1)].up : supplySpot(+id.slice(1)));

/** The pieces counted by the TOTAL: the ones inside the drop. */
export const inPlay = (s) => [...s.row, ...s.pairedWith.filter(Boolean)];
export const totalOf = (s) => total(inPlay(s));
export const pairedCount = (s) => s.pairedWith.filter(Boolean).length;
export const freePairs = (s) => s.pairedWith.map((v, p) => (v ? -1 : p)).filter((p) => p >= 0);

/**
 * Where a ↓ dropped at (x, y) goes. Generous: anywhere above the bottom edge of the drop (and a little below it) counts
 * as an attempt to pair, and the piece joins the free pair whose ↓ spot is nearest in x. Returns the pair index, or null
 * (back to its waiting spot).
 */
export const DROP_LINE = DROP.y + DROP.h + 8;
export function dropTarget(s, x, y) {
  const free = freePairs(s);
  if (!free.length || y > DROP_LINE) return null;
  return free.reduce((best, p) => (Math.abs(PAIRS[p].down.x - x) < Math.abs(PAIRS[best].down.x - x) ? p : best), free[0]);
}
/** A tap on a waiting ↓: it pairs with the free ↑ nearest to it. */
export const tapTarget = (s, id) => dropTarget(s, supplySpot(+id.slice(1)).x, ROWS.mat);

/** Pair ↓ `id` with pair p. Returns a new state. */
export function pair(s, id, p) {
  if (s.pairedWith[p] || !s.waiting.includes(id)) return s;
  const pairedWith = [...s.pairedWith];
  pairedWith[p] = id;
  return { row: s.row, waiting: s.waiting.filter((w) => w !== id), pairedWith };
}

// ── groups: what the drop shows, and what the TOTAL adds up ──────────────────────────────────────
/** The groups of the puzzle: for each pair, its ↑ alone, or ↓ then ↑ once a ↓ has joined it. */
export const puzzleGroups = (s) => PAIRS.map((_, p) => (s.pairedWith[p] ? [s.pairedWith[p], `U${p}`] : [`U${p}`]));

/** The outline around a group of spots (pieces drawn at `scale`), and where its label sits. */
export function frame(spots, scale = 1, labelGap = GROUP.label) {
  const hx = ((PIECE.width / 2) + GROUP.pad) * scale;
  const hy = ((PIECE.length / 2) + GROUP.pad / 2) * scale;
  const x0 = Math.min(...spots.map((s) => s.x)) - hx;
  const x1 = Math.max(...spots.map((s) => s.x)) + hx;
  const y0 = Math.min(...spots.map((s) => s.y)) - hy;
  const y1 = Math.max(...spots.map((s) => s.y)) + hy;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, label: { x: (x0 + x1) / 2, y: y1 + labelGap } };
}

// ── the four arrangements behind the same 0 ────────────────────────────────────────────────────────
// Ids keep their direction, so the same pieces move between arrangements and new pieces join. Every group is balanced.
// Arrangement 1 is the learner's own drop (three ↓↑ pairs). The others stack each group: its ↑ arrows in a row on top,
// its ↓ arrows in a row underneath, one under each, so the evenness is visible. All four sit inside the 0 (below).
export const ARRANGEMENTS = [
  { name: 'learner', groups: [['D0', 'U0'], ['D1', 'U1'], ['D2', 'U2']] },
  { name: 'rearranged', groups: [['U0', 'U1', 'D0', 'D1'], ['U2', 'D2']] },
  { name: 'more', groups: [['U0', 'U1', 'U2', 'D0', 'D1', 'D2'], ['U3', 'D3']] },
  { name: 'denser', groups: [['U0', 'U1', 'U2', 'U3', 'U4', 'U5', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5']] },
];
// ── the 0 the balanced magnets live in ────────────────────────────────────────────────────────────────
// When the TOTAL reaches 0, the 0 of its result grows into a bold numeral 0 and closes around the balanced magnets: from
// then on they sit inside it, in its hollow, and the drop they were in is gone. The learner's own pairs keep their ↓↑
// form, in a row; every other arrangement is stacked, each group's ↑ in a row on top and its ↓ mirrored underneath.
// For the scanner's many pairs the 0 is wider. Its sides are thicker than its top and bottom, as a bold 0's are. It is
// drawn as two superellipses (|x/a|^n + |y/b|^n = 1) around its own centre, the inner one cut out (fill-rule evenodd).
export const ZERO = { cx: VIEW.w / 2, cy: 288, rx: 180, ry: 124, side: 46, end: 24, n: 3, scale: 0.8, pitch: 36, rows: 42, gap: 28, pairPitch: 86, pairHalf: 14, labelGap: 12 };
export const CROWD_ZERO = { cx: VIEW.w / 2, cy: 264, rx: 316, ry: 106, side: 24, end: 18, n: 3 };
/** A superellipse around (cx, cy), as a closed SVG path. */
export function superellipse(cx, cy, a, b, n, steps = 120) {
  let d = '';
  for (let i = 0; i < steps; i++) {
    const t = (2 * Math.PI * i) / steps;
    const c = Math.cos(t);
    const sn = Math.sin(t);
    const x = cx + a * Math.sign(c) * Math.abs(c) ** (2 / n);
    const y = cy + b * Math.sign(sn) * Math.abs(sn) ** (2 / n);
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}
/** The hollow inside a 0 (around the 0's own centre when `local`). */
export const zeroInner = (z) => ({ cx: z.cx, cy: z.cy, rx: z.rx - z.side, ry: z.ry - z.end, n: z.n });
/** A bold numeral 0 around its own centre (0, 0): its outline, then its hollow (draw with fill-rule evenodd). */
export const zeroPath = (z) => `${superellipse(0, 0, z.rx, z.ry, z.n)} ${superellipse(0, 0, z.rx - z.side, z.ry - z.end, z.n)}`;
/** The hollow alone, around the 0's own centre. */
export const hollowPath = (z) => superellipse(0, 0, z.rx - z.side, z.ry - z.end, z.n);
/** Whether a point (with a margin around it) is inside a 0's hollow. */
export const insideZero = (p, z, margin = 0) => {
  const h = zeroInner(z);
  return Math.abs((p.x - h.cx) / (h.rx - margin)) ** h.n + Math.abs((p.y - h.cy) / (h.ry - margin)) ** h.n <= 1;
};
/** Positions of every piece in arrangement k, inside the 0, as a list of groups of { id, x, y }. */
export function layout(k) {
  const a = ARRANGEMENTS[k];
  const { cx, cy, pitch, rows, gap, pairPitch, pairHalf } = ZERO;
  if (k === 0) {
    return a.groups.map((g, p) => {
      const x = cx + (p - (a.groups.length - 1) / 2) * pairPitch;
      return [{ id: g[0], x: x - pairHalf, y: cy }, { id: g[1], x: x + pairHalf, y: cy }];
    });
  }
  const cols = a.groups.map((g) => g.length / 2);
  const full = cols.reduce((s, c) => s + c * pitch, 0) + gap * (a.groups.length - 1);
  let x = cx - full / 2;
  return a.groups.map((g, i) => {
    const ups = g.filter((id) => dirOf(id) > 0);
    const downs = g.filter((id) => dirOf(id) < 0);
    const spots = [...ups.map((id, j) => ({ id, x: x + (j + 0.5) * pitch, y: cy - rows })), ...downs.map((id, j) => ({ id, x: x + (j + 0.5) * pitch, y: cy + rows }))];
    x += cols[i] * pitch + gap;
    return spots;
  });
}
/** The 0 of the TOTAL's result: where the big 0 grows from, as a move and a scale of the big 0 (around its centre). */
export const RESULT_GLYPH = { x: PANEL.valueX, y: PANEL.resultY, h: 44 };
export function zeroFromResult(z = ZERO) {
  return { dx: RESULT_GLYPH.x - z.cx, dy: RESULT_GLYPH.y - z.cy, s: RESULT_GLYPH.h / (2 * z.ry) };
}
/** The tag pinned to the bottom of a 0 (around the 0's own centre). */
export const zeroTag = (z) => ({ x: 0, y: z.ry - z.end / 2, h: 24 });

// ── the MRI signal, beside the TOTAL ────────────────────────────────────────────────────────────────
// A small screen in the drop's scene: what the scanner can pick up from the drop. The scanner's signal follows the
// drop's net magnetization, so the wave is as tall as |TOTAL|, against the strongest the scene's arrows can give (`full`:
// the puzzle's three ↑, or the crowd's 24 arrows all lined up), and its four bars light with it. As each ↑ joins the
// TOTAL the signal grows (Nadia, 2026-11-25: "before the user puts the arrows the mri signal should increase as well");
// as ↓ pair with ↑ it shrinks to a flat line; when the scanner's magnet tips the balance it comes back, faint.
/** The puzzle's strongest signal: its three ↑. */
export const PUZZLE_FULL = 3;
export const METER = { x: 528, y: 10, w: 104, h: 106, label: 27, wave: { y: 62, h: 34, pad: 10 }, bars: { y: 104, n: 4, w: 10, gap: 6, h: [5, 9, 13, 17] } };
export const share = (value, full) => (full ? Math.min(1, Math.abs(value) / full) : 0);
/** The meter's wave for a share (0…1), shifted along by `phase` (in waves). */
export function meterWave(s, phase = 0, n = 64) {
  const { x, w, wave } = METER;
  const amp = Math.max(0, Math.min(1, s)) * (wave.h / 2);
  let d = '';
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    d += `${i ? 'L' : 'M'}${(x + wave.pad + u * (w - 2 * wave.pad)).toFixed(1)} ${(wave.y - amp * Math.sin(2 * Math.PI * (2.5 * u + phase))).toFixed(1)}`;
  }
  return d;
}
/** How many of the meter's bars are lit for a share: none at 0, at least one for any signal. */
export const meterBars = (s) => (s <= 0 ? 0 : Math.max(1, Math.min(METER.bars.n, Math.round(s * METER.bars.n))));
/** The meter's bars, left to right, each standing on the meter's floor. */
export function meterBarSpots() {
  const { n, w, gap, y, h } = METER.bars;
  const x0 = METER.x + (METER.w - (n * w + (n - 1) * gap)) / 2;
  return h.map((hk, i) => ({ x: x0 + i * (w + gap), y: y - hk, w, h: hk }));
}

/** The direction pattern of an arrangement, group by group (e.g. '↑↑↓↓ | ↑↓'). */
export const pattern = (k) => ARRANGEMENTS[k].groups.map((g) => g.map((id) => (dirOf(id) > 0 ? '↑' : '↓')).join('')).join(' | ');

// ── the sum row in the TOTAL: the arrows in the drop, added up ──────────────────────────────────────
/**
 * Lays out `groups` (lists of { id, dir }) as terms with + between them, centred in the panel and scaled to fit.
 * `lead`/`trail` add '…' for a sum that goes on beyond what is shown. Each balanced group (or, with `labels`, each group
 * given a label) gets a bracket under its terms showing the group's own total. Returns { scale, unit, items, brackets }.
 */
export function sumLayout(groups, { lead = false, trail = false, labels = null } = {}) {
  const T = 0.75, P = 0.6, D = 0.8, S = 0.2;                  // widths in units: term, plus, dots; spacing
  const tokens = [];
  if (lead) tokens.push({ kind: 'dots' }, { kind: 'plus' });
  groups.forEach((g, gi) => {
    g.forEach((t, ti) => {
      if (gi + ti > 0) tokens.push({ kind: 'plus' });
      tokens.push({ kind: 'term', id: t.id, dir: t.dir, group: gi });
    });
  });
  if (trail) tokens.push({ kind: 'plus' }, { kind: 'dots' });
  const w = (t) => (t.kind === 'term' ? T : t.kind === 'plus' ? P : D);
  const units = tokens.reduce((s, t) => s + w(t), 0) + S * Math.max(0, tokens.length - 1);
  const unit = Math.min(34, PANEL.sumWidth / units);
  let x = PANEL.cx - (units * unit) / 2;
  const items = tokens.map((t) => {
    const it = { ...t, x: x + (w(t) * unit) / 2, y: PANEL.sumY, width: w(t) * unit };
    x += (w(t) + S) * unit;
    return it;
  });
  const brackets = groups.map((g, gi) => {
    const terms = items.filter((it) => it.kind === 'term' && it.group === gi);
    const value = labels ? labels[gi] : total(g.map((t) => t.dir));
    if (labels ? value === null : value !== 0) return null;
    return { x1: terms[0].x - (T * unit) / 2, x2: terms[terms.length - 1].x + (T * unit) / 2, y: PANEL.bracketY, value };
  }).filter(Boolean);
  return { scale: (unit * 1.05) / PIECE.length, unit, items, brackets };
}

// ── the scanner's magnet: a bigger crowd of cancelled pairs, then one flips ───────────────────────────
export const CROWD = { rows: [222, 292], cols: 6, pitch: 72, half: 14, scale: 0.72, labelGap: 10 };
/**
 * The scanner's radio waves: arcs come in from both sides of the drop toward the tiny magnets (`travel` units), and
 * a faint reply spreads out from among them, in rings. Drawn while "nudges them with radio waves" is on screen.
 */
export const RADIO = { y: (CROWD.rows[0] + CROWD.rows[1]) / 2, from: [DROP.x + 14, DROP.x + DROP.w - 14], travel: 190, arc: 46, reply: { x: C, r: 34 } };
/** Where +1 or −1 pops up as an arrow joins the TOTAL: just right of its result, which counts up or down with it. */
export const POP = { x: PANEL.valueX + 30, y: PANEL.resultY - 4 };
/** Twelve ↓↑ pairs in the drop, all cancelled: pair k holds D k and U k. */
export function crowd() {
  const out = [];
  CROWD.rows.forEach((y, r) => {
    for (let c = 0; c < CROWD.cols; c++) {
      const k = r * CROWD.cols + c;
      const cx = C + (c - (CROWD.cols - 1) / 2) * CROWD.pitch;
      out.push({ k, cx, y, down: { id: `D${k}`, x: cx - CROWD.half, y }, up: { id: `U${k}`, x: cx + CROWD.half, y } });
    }
  });
  return out;
}
/** The magnet's field lines run upward between the columns of the crowd, never through a group. */
export const FIELD_LINES = Array.from({ length: CROWD.cols + 1 }, (_, c) => C + (c - CROWD.cols / 2) * CROWD.pitch);
export const FIELD_SPAN = { top: 170, bottom: 340 };
/** With the magnet on, one ↓ turns to point with it: the balance tips by exactly 2. */
export const FLIP = 'D2';
export function crowdDirections(magnetOn) {
  const dirs = {};
  for (const p of crowd()) { dirs[p.down.id] = DOWN; dirs[p.up.id] = UP; }
  if (magnetOn) dirs[FLIP] = UP;
  return dirs;
}
export const crowdTotal = (magnetOn) => total(Object.values(crowdDirections(magnetOn)));
/** The part of the crowd the sum row shows: the flipped pair and its neighbours, with '…' on both sides. */
export const CROWD_SHOWN = [1, 2, 3];
