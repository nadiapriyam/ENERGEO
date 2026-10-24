// Two functions f and g on [0, L], optionally with their sample points (the vector they become in R^N).
// Grid lines mark multiples of tickStep (one period of the slowest wave, or half of it).

import { s, clear } from '../core/dom.js';
import { num } from '../core/format.js';
import { responsiveSvg } from './responsive.js';

const H = 150;
const PADL = 54;
const PADR = 74;

export function createFunctionPlot() {
  const svg = s('svg', { role: 'img', 'aria-label': 'The two functions f and g' });
  const g = s('g');
  svg.append(g);
  let lastDraw = null;
  const rs = responsiveSvg(svg, H, (W) => lastDraw?.(W));
  function update({ curve, L, samples, fLabel, gLabel, yMax = 1, tickStep = Math.PI }) {
    const Y = (y) => H / 2 - (y / yMax) * (H / 2 - 14);
    lastDraw = (W) => {
      clear(g);
      const plotW = W - PADL - PADR;
      const X = (t) => PADL + (t / L) * plotW;
      g.append(s('line', { class: 'svg-zero', x1: PADL, y1: Y(0), x2: PADL + plotW, y2: Y(0) }));
      g.append(s('text', { class: 'svg-tick', x: PADL - 6, y: Y(yMax) + 4, 'text-anchor': 'end' }, num(yMax, 1)));
      g.append(s('text', { class: 'svg-tick', x: PADL - 6, y: Y(-yMax) + 4, 'text-anchor': 'end' }, `−${num(yMax, 1)}`));
      for (let m = 1; m * tickStep <= L + 1e-9; m++) {
        const x = X(m * tickStep);
        g.append(s('line', { class: 'svg-grid', x1: x, y1: 4, x2: x, y2: H - 4 }));
      }
      const path = (arr) => {
        let d = '';
        for (let i = 0; i < curve.t.length; i++) d += `${i ? 'L' : 'M'}${X(curve.t[i])},${Y(arr[i])} `;
        return d;
      };
      g.append(s('path', { class: 'svg-curve', d: path(curve.f) }));
      g.append(s('path', { class: 'svg-curve alt', d: path(curve.g) }));
      g.append(s('text', { class: 'svg-label', x: X(L) + 8, y: 18, style: { fill: 'var(--ink)' } }, fLabel));
      g.append(s('text', { class: 'svg-label', x: X(L) + 8, y: 36 }, gLabel));
      if (samples) {
        samples.t.forEach((tj, j) => {
          g.append(s('circle', { cx: X(tj), cy: Y(samples.f[j]), r: 3, style: { fill: 'var(--ink)' } }));
          g.append(s('circle', { cx: X(tj), cy: Y(samples.g[j]), r: 3, style: { fill: 'var(--surface)', stroke: 'var(--ink-2)', strokeWidth: 1.5 } }));
        });
      }
    };
    rs.render();
  }

  return { el: svg, update };
}
