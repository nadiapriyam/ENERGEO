// Stacked waves on a shared time axis [0, T]. Each row holds one or more series and its own label and scale.
// Styles: 'ink' (an object), 'ink2' (a second object), 'ghost' (something removed or not counted), 'dashed'.

import { s, clear } from '../core/dom.js';
import { num } from '../core/format.js';
import { responsiveSvg } from './responsive.js';

const PADL = 54;
const PADR = 96;
const STYLE = {
  ink: { class: 'svg-curve' },
  ink2: { class: 'svg-curve alt' },
  dashed: { class: 'svg-curve', 'stroke-dasharray': '5 4', style: { stroke: 'var(--ink-2)' } },
  ghost: { class: 'svg-curve', 'stroke-dasharray': '2 4', style: { stroke: 'var(--ink-3)' } },
};

export function createWavesPlot({ rows: rowSpec, T = 1, ticks = [0.5, 1] }) {
  const heights = rowSpec.map((r) => r.height ?? 70);
  const GAP = 10;
  const total = heights.reduce((a, b) => a + b, 0) + GAP * (rowSpec.length - 1) + 18;
  const svg = s('svg', { role: 'img', 'aria-label': rowSpec.map((r) => r.label).join(', ') });
  const g = s('g');
  svg.append(g);
  let lastDraw = null;
  const rs = responsiveSvg(svg, total, (W) => lastDraw?.(W));

  function update(t, rows) {
    lastDraw = (W) => {
      clear(g);
      const plotW = W - PADL - PADR;
      const X = (x) => PADL + (x / T) * plotW;
      let y0 = 0;
      rows.forEach((row, ri) => {
        const hgt = heights[ri];
        const yMax = row.yMax ?? 1;
        const Y = (v) => y0 + hgt / 2 - (v / yMax) * (hgt / 2 - 4);
        g.append(s('line', { class: 'svg-zero', x1: PADL, y1: Y(0), x2: PADL + plotW, y2: Y(0) }));
        g.append(s('text', { class: 'svg-tick', x: PADL - 6, y: y0 + 11, 'text-anchor': 'end' }, `+${num(yMax, 1)}`));
        g.append(s('text', { class: 'svg-tick', x: PADL - 6, y: y0 + hgt - 2, 'text-anchor': 'end' }, `−${num(yMax, 1)}`));
        for (const tk of ticks) if (tk <= T + 1e-9) g.append(s('line', { class: 'svg-grid', x1: X(tk), y1: y0, x2: X(tk), y2: y0 + hgt }));
        row.series.forEach((ser) => {
          let d = '';
          ser.values.forEach((v, i) => {
            d += `${i ? 'L' : 'M'}${X(t[i])},${Y(Math.max(-yMax * 1.05, Math.min(yMax * 1.05, v)))} `;
          });
          g.append(s('path', { d, ...STYLE[ser.style ?? 'ink'], 'stroke-width': ser.width ?? 1.75 }));
        });
        g.append(s('text', { class: 'svg-label', x: PADL + plotW + 8, y: y0 + hgt / 2 + 4, style: { fill: row.muted ? 'var(--ink-3)' : 'var(--ink)' } }, row.label));
        y0 += hgt + GAP;
      });
      for (const tk of ticks) if (tk <= T + 1e-9) g.append(s('text', { class: 'svg-tick', x: X(tk), y: y0 + 4, 'text-anchor': 'middle' }, `t = ${tk}`));
    };
    rs.render();
  }

  return { el: svg, update };
}
