// Needles as directional contributions (prototype `try/`, docs/prototype_try_spec.md). Pure functions, no DOM.
//
// Each needle is a unit vector u_i = (cos θ_i, sin θ_i). The total is Σ u_i. When a needle is turned to within SNAP of the
// exact opposite of an unpaired needle, it snaps: the pair is stored as one vector and its exact negation, so the pair's
// contribution u + (−u) is exactly (0, 0) in floating point. The total is therefore exactly zero when every needle is
// paired — by construction, not by rounding — and never shown as zero otherwise.

export const TAU = 2 * Math.PI;
export const SNAP = (12 * Math.PI) / 180;      // snap into exact opposition within 12°
export const RELEASE = (20 * Math.PI) / 180;   // a snapped needle follows the pointer again beyond 20°

/** The starting directions, in degrees: no two needles within 35° of opposite; total length ≈ 2.26. */
export const INITIAL_DEG = [280, 10, 350, 135, 260, 30];

export const rad = (deg) => (deg * Math.PI) / 180;
export const deg = (r) => (r * 180) / Math.PI;
/** Angle in [0, 2π). */
export const wrap = (a) => ((a % TAU) + TAU) % TAU;
/** Smallest absolute difference between two angles, in [0, π]. */
export const angleGap = (a, b) => {
  const d = wrap(a - b);
  return d > Math.PI ? TAU - d : d;
};
export const unit = (a) => [Math.cos(a), Math.sin(a)];

/** A fresh arrangement: every needle unpaired. */
export function createState(degrees = INITIAL_DEG) {
  return { theta: degrees.map((d) => wrap(rad(d))), partner: degrees.map(() => null) };
}

const clone = (s) => ({ theta: [...s.theta], partner: [...s.partner] });

/** The pair partner a needle at angle `a` would snap to: the unpaired needle (≠ i) closest to exactly opposite, within SNAP. */
export function snapPartner(state, i, a) {
  let best = null;
  let gap = SNAP;
  state.theta.forEach((t, j) => {
    if (j === i || state.partner[j] !== null) return;
    const g = angleGap(a, t + Math.PI);
    if (g <= gap) { gap = g; best = j; }
  });
  return best;
}

/**
 * Turn needle i towards the angle `a` (radians). Returns a new state.
 * - a paired needle stays exactly opposite its partner while `a` is within RELEASE of that position; beyond it, the pair
 *   breaks and the needle follows `a`;
 * - an unpaired needle snaps to the exact opposite of the nearest unpaired needle within SNAP, and the two are paired.
 */
export function turn(state, i, a) {
  const s = clone(state);
  const j = s.partner[i];
  if (j !== null) {
    if (angleGap(a, s.theta[j] + Math.PI) <= RELEASE) return s;
    s.partner[i] = s.partner[j] = null;
  }
  const k = snapPartner(s, i, a);
  if (k !== null) {
    s.theta[i] = wrap(s.theta[k] + Math.PI);
    s.partner[i] = k;
    s.partner[k] = i;
  } else {
    s.theta[i] = wrap(a);
  }
  return s;
}

/** The pairs, each as [leader, follower] with leader < follower. */
export const pairs = (s) => s.partner.flatMap((j, i) => (j !== null && i < j ? [[i, j]] : []));

/**
 * The contribution vectors. The follower of a pair is the exact negation of the leader's vector (negation is exact in
 * IEEE arithmetic), so u_leader + u_follower = (0, 0) exactly.
 */
export function contributions(s) {
  const u = s.theta.map(unit);
  for (const [i, j] of pairs(s)) u[j] = [-u[i][0], -u[i][1]];
  return u;
}

/** The total Σ u_i, summed pair by pair (each pair exactly 0) and then over the unpaired needles. exact: every needle paired. */
export function total(s) {
  const u = contributions(s);
  let x = 0;
  let y = 0;
  for (const [i, j] of pairs(s)) { x += u[i][0] + u[j][0]; y += u[i][1] + u[j][1]; }
  s.partner.forEach((j, i) => { if (j === null) { x += u[i][0]; y += u[i][1]; } });
  const exactZero = s.partner.every((j) => j !== null);
  return { x, y, length: Math.hypot(x, y), exactZero };
}

/** Pairing as a fraction: how many needles are paired. */
export const pairedCount = (s) => s.partner.filter((j) => j !== null).length;
