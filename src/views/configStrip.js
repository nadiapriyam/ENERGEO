// Stage 3b: configurations the learner has collected, side by side. Each glyph is one fixed oblique drawing of the
// contributions in R³ (a 2D view, not the configuration itself), with its total and its lengths.

import { s, h } from '../core/dom.js';
import { num } from '../core/format.js';
import { norm } from '../math/linalg.js';

const SIZE = 112;
const P = (v, k) => [SIZE / 2 + k * (v[0] - 0.42 * v[1]), SIZE / 2 - k * (v[2] - 0.24 * v[1])];

export function createConfigStrip() {
  const el = h('div', { class: 'config-strip', 'aria-label': 'Collected configurations' });
  return {
    el,
    update(collection) {
      if (!collection.length) {
        el.replaceChildren(h('p', { class: 'muted' }, 'No configurations collected yet. Press Collect to keep the current one.'));
        return;
      }
      el.replaceChildren(
        ...collection.map((c, i) => {
          const k = (SIZE / 2 - 10) / Math.max(1.2, ...c.ms.map(norm));
          const svg = s('svg', { viewBox: `0 0 ${SIZE} ${SIZE}`, role: 'img', 'aria-label': `Configuration ${i + 1}` });
          for (const v of c.ms) {
            const [x, y] = P(v, k);
            svg.append(s('line', { class: 'svg-vec', x1: SIZE / 2, y1: SIZE / 2, x2: x, y2: y, 'stroke-width': 1.75 }), s('circle', { cx: x, cy: y, r: 2.5, style: { fill: 'var(--ink)' } }));
          }
          svg.append(s('circle', { class: 'svg-zero-ring', cx: SIZE / 2, cy: SIZE / 2, r: 6, 'data-state': c.exact ? 'exact' : 'near' }));
          return h('figure', { class: 'config' }, svg, h('figcaption', null, h('b', null, `#${i + 1} `), c.exact ? 'Σ = 0 exactly' : 'Σ ≈ 0', h('br'), `lengths ${c.ms.map((v) => num(norm(v), 2)).join(', ')}`));
        }),
      );
    },
  };
}
