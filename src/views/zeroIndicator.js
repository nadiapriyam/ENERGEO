// The shared measurement grammar of Chapter I (decision D6): every stage reports "measurement → value", and a
// reading of exactly 0 always looks the same. Three states, never merged:
//   exact  the state was constructed to read 0; any printed remainder is floating-point error
//   near   within the dragging tolerance only; not 0
//   none   the reading is not 0
// The same ring appears in each stage's drawing: filled when exact, dashed when near.

import { h } from '../core/dom.js';
import { num, sci } from '../core/format.js';
import { ZERO_TOL } from '../math/zero.js';

export const vecText = (v, d = 2) => `(${v.map((x) => num(x, d)).join(', ')})`;

/** 'exact' | 'near' | 'none' for a reading of size `size`. */
export const zeroState = (size, exact, tol = ZERO_TOL) => (exact && size < 1e-9 ? 'exact' : size < tol ? 'near' : 'none');

export function createZeroIndicator() {
  const glyph = h('span', { class: 'zero-glyph', 'aria-hidden': 'true' });
  const text = h('span', { class: 'zero-text' });
  const el = h('div', { class: 'zero-indicator', 'aria-live': 'polite' }, glyph, text);
  return {
    el,
    set({ what, value, size, state, tol = ZERO_TOL, sizeLabel = '|…|' }) {
      el.dataset.state = state;
      if (state === 'exact') {
        text.innerHTML = `<b>${what} → 0 exactly.</b> The state was constructed to read 0${size === 0 ? '; residual 0' : `; the residual ${sci(size)} is floating-point error`}.`;
      } else if (state === 'near') {
        text.innerHTML = `<b>${what} → ${vecText(value)}</b>, within the tolerance ${sizeLabel} &lt; ${tol}. Near 0, not exactly 0.`;
      } else {
        text.innerHTML = `<b>${what} → ${vecText(value)}.</b> Not 0: ${sizeLabel} = ${num(size, 3)}.`;
      }
    },
  };
}
