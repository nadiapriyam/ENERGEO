// The signal shared by Fourier Coefficients (#7) and Orthogonality and Zero (#8).
// Master Map principle: the waveform built in #7 is the object #8 starts from, not a fresh example.

import { cx } from '../math/coefficients.js';

export const SIGNAL = 'signal';
export const C3 = '\\hat f(1),\\hat f(2),\\hat f(3)';

/** An example signal (synthetic): three harmonics with chosen amplitudes and phases. */
export const DEFAULT_SIGNAL = {
  coeffs: [
    [1.1, -0.55],
    [0.32, 0.45],
    [-0.22, 0.18],
  ],
  active: [true, true, true],
  k: 2,
  eps: 0,
};

export const ensureSignal = (J) => J.ensure(SIGNAL, 'signal', C3, DEFAULT_SIGNAL, 'an example signal with three harmonics (synthetic), shaped in Fourier Coefficients');

export const readSignal = (J) => (ensureSignal(J), J.get(SIGNAL).reps[C3].data);

/** The coefficients as the signal currently is: removed components count as 0. */
export const liveCoeffs = (sig) => sig.coeffs.map((c, i) => (sig.active[i] ? c : [0, 0]));

/**
 * The second wave of #8: your signal delayed by DELAY of a period. A delay τ multiplies f̂(k) by e^{−2πikτ},
 * which turns each coefficient arrow by −2πkτ. So the starting angle between u and v comes from the delay, not a choice.
 */
export const DELAY = 0.14;
export const delayed = (coeffs, tau = DELAY) => coeffs.map((c, i) => cx.mul(c, cx.expi(-2 * Math.PI * (i + 1) * tau)));
