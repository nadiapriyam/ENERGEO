// Paired bars per coordinate: a vector and its reconstruction. Both are objects, so both are ink:
// solid for the vector, outlined for the rebuild. Where they differ, the coefficients are not independent.

import { s, clear } from '../core/dom.js';
import { num } from '../core/format.js';
import { withTip } from '../core/tooltip.js';
import { responsiveSvg } from './responsive.js';

const H = 150;
const TOP = 26;
const PADL = 54;
const PADR = 20;

export function createCompareBars({ aLabel, bLabel, yMax = 2 }) {
  const svg = s('svg', { role: 'img', 'aria-label': `${aLabel} compared with ${bLabel}` });
  const g = s('g', { transform: `translate(0,${TOP})` });
  const legend = s('g');
  svg.append(legend, g);
  let lastDraw = null;
  const rs = responsiveSvg(svg, H + TOP + 22, (W) => lastDraw?.(W));

  function update(a, b, labels) {
    lastDraw = (W) => {
      clear(legend);
      legend.append(
        s('rect', { x: PADL, y: 4, width: 12, height: 12, rx: 2, style: { fill: 'var(--ink)' } }),
        s('text', { class: 'svg-label', x: PADL + 18, y: 14 }, aLabel),
        s('rect', { x: PADL + 52, y: 4, width: 12, height: 12, rx: 2, style: { fill: 'var(--surface)', stroke: 'var(--ink-2)', strokeWidth: 1.5 } }),
        s('text', { class: 'svg-label', x: PADL + 70, y: 14 }, bLabel),
      );
      clear(g);
      const plotW = W - PADL - PADR;
      const Y = (y) => H / 2 - (y / yMax) * (H / 2 - 8);
      g.append(s('line', { class: 'svg-zero', x1: PADL, y1: Y(0), x2: PADL + plotW, y2: Y(0) }));
      g.append(s('text', { class: 'svg-tick', x: PADL - 6, y: Y(yMax) + 4, 'text-anchor': 'end' }, `+${yMax}`));
      g.append(s('text', { class: 'svg-tick', x: PADL - 6, y: Y(-yMax) + 4, 'text-anchor': 'end' }, `−${yMax}`));
      const n = a.length;
      const slot = plotW / n;
      const bw = Math.min(26, slot / 3);
      a.forEach((ai, i) => {
        const x0 = PADL + slot * i + slot / 2 - bw - 2;
        const bar = (val, x, style) => s('rect', { x, y: Math.min(Y(val), Y(0)), width: bw, height: Math.max(1, Math.abs(Y(val) - Y(0))), rx: 2, style });
        const ra = bar(ai, x0, { fill: 'var(--ink)' });
        const rb = bar(b[i], x0 + bw + 4, { fill: 'var(--surface)', stroke: 'var(--ink-2)', strokeWidth: 1.5 });
        withTip(ra, () => `${labels[i]}: ${num(ai, 3)}`);
        withTip(rb, () => `${labels[i]} rebuilt: ${num(b[i], 3)}`);
        g.append(ra, rb, s('text', { class: 'svg-tick', x: PADL + slot * i + slot / 2, y: H + 14, 'text-anchor': 'middle' }, labels[i]));
      });
    };
    rs.render();
  }

  return { el: svg, update };
}
