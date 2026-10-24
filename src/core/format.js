// Number formatting for readouts. Every displayed number is rounded; the rounding is stated where it matters.

const MINUS = '−';

export function num(x, digits = 3) {
  if (x == null || Number.isNaN(x)) return '—';
  const r = Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x;
  const str = Math.abs(r).toFixed(digits);
  return (r < 0 ? MINUS : '') + str;
}

export function signed(x, digits = 3) {
  const t = num(x, digits);
  return x > 0.5 * 10 ** -digits ? `+${t}` : t;
}

export const deg = (rad, digits = 1) => (rad == null ? '—' : `${num((rad * 180) / Math.PI, digits)}°`);

/** Class name that underlines a readout in the colour of its sign (zero gets none). */
export const signClass = (x, tol = 5e-4) => (x > tol ? 'sign-pos' : x < -tol ? 'sign-neg' : '');

export const sci = (x) => (x === 0 ? '0' : Math.abs(x) < 1e-3 ? x.toExponential(1).replaceAll('-', MINUS) : num(x, 4));
