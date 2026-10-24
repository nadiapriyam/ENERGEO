// The thread through every representation: an inner product as a sum of signed contributions.
// Top panel: each contribution (bars for coordinates, a signed area for functions).
// Bottom panel: the running total, which ends at the inner product. Orthogonal means it ends on zero.
// Two panels, two scales, each labelled: never one panel with two y-axes.

import { s, clear } from '../core/dom.js';
import { num } from '../core/format.js';
import { withTip } from '../core/tooltip.js';
import { responsiveSvg } from './responsive.js';

const H1 = 120;
const H2 = 90;
const TOP1 = 20; // title row above panel 1
const GAP = 46; // tick labels of panel 1, then the title of panel 2
const HEIGHT = TOP1 + H1 + GAP + H2 + 8;
const PADL = 54;
const PADR = 74;

export function createContributionStrip({ title = 'Contributions', runTitle = 'Running total', unit = '' } = {}) {
  const svg = s('svg', { role: 'img', 'aria-label': 'Signed contributions to the inner product and their running total' });
  const t1 = s('text', { class: 'svg-label', x: 0, y: 12 }, title);
  const t2 = s('text', { class: 'svg-label', x: 0, y: TOP1 + H1 + GAP - 10 }, runTitle);
  const g1 = s('g', { transform: `translate(0,${TOP1})` });
  const g2 = s('g', { transform: `translate(0,${TOP1 + H1 + GAP})` });
  svg.append(t1, t2, g1, g2);
  let lastDraw = null;
  const rs = responsiveSvg(svg, HEIGHT, (W) => lastDraw?.(W));

  function frame(g, h, yMax, plotW) {
    const zeroY = h / 2;
    const fmt = (y) => num(y, y < 1 ? 2 : 1);
    g.append(s('line', { class: 'svg-zero', x1: PADL, y1: zeroY, x2: PADL + plotW, y2: zeroY }));
    g.append(s('text', { class: 'svg-tick', x: PADL - 6, y: zeroY + 4, 'text-anchor': 'end' }, '0'));
    g.append(s('text', { class: 'svg-tick', x: PADL - 6, y: 12, 'text-anchor': 'end' }, `+${fmt(yMax)}`));
    g.append(s('text', { class: 'svg-tick', x: PADL - 6, y: h - 4, 'text-anchor': 'end' }, `−${fmt(yMax)}`));
    return (y) => zeroY - (y / yMax) * (h / 2 - 6);
  }

  const endMarker = (g, x, y, value) => {
    const cls = value > 1e-9 ? 'svg-pos' : value < -1e-9 ? 'svg-neg' : 'svg-zero-mark';
    g.append(s('circle', { class: cls, cx: x, cy: y, r: 6 }));
    g.append(s('text', { class: 'svg-tick', x: x + 10, y: y + 4, style: { fill: 'var(--ink)' } }, `${num(value)}${unit}`));
  };

  /** Coordinates: values[i] = u_i v_i. */
  function bars({ values, labels, yMax, runMax, total }) {
    lastDraw = (W) => {
      clear(g1);
      clear(g2);
      const plotW = W - PADL - PADR;
      const n = values.length;
      const y1 = frame(g1, H1, yMax, plotW);
      const slot = plotW / n;
      const bw = Math.max(1.5, Math.min(28, slot - 2));
      values.forEach((val, i) => {
        const x = PADL + slot * i + (slot - bw) / 2;
        const top = Math.min(y1(val), y1(0));
        const hgt = Math.max(Math.abs(y1(val) - y1(0)), Math.abs(val) > 1e-12 ? 1 : 0);
        const rect = s('rect', { class: val >= 0 ? 'svg-pos' : 'svg-neg', x, y: top, width: bw, height: hgt, rx: Math.min(2, bw / 4) });
        withTip(rect, () => `${labels?.[i] ?? `term ${i + 1}`} = ${num(val, 4)}`);
        g1.append(rect);
        if (labels && n <= 8) g1.append(s('text', { class: 'svg-tick', x: x + bw / 2, y: H1 + 14, 'text-anchor': 'middle' }, labels[i]));
      });

      const y2 = frame(g2, H2, runMax, plotW);
      let acc = 0;
      let d = `M${PADL},${y2(0)}`;
      values.forEach((val, i) => {
        acc += val;
        d += ` L${PADL + slot * (i + 1)},${y2(acc)}`;
      });
      g2.append(s('path', { class: 'svg-curve', d, 'stroke-width': 1.75 }));
      endMarker(g2, PADL + plotW, y2(total), total);
    };
    rs.render();
  }

  /** Functions: curve = { t, product, running }, over [0, L]. */
  function area({ curve, L, yMax, runMax, total, samples, tickStep = Math.PI, tickLabel = (m) => (m === 1 ? 'π' : `${m}π`) }) {
    lastDraw = (W) => {
      clear(g1);
      clear(g2);
      const plotW = W - PADL - PADR;
      const n = curve.t.length;
      const X = (t) => PADL + (t / L) * plotW;
      const y1 = frame(g1, H1, yMax, plotW);
      let dp = `M${X(0)},${y1(0)}`;
      let dn = `M${X(0)},${y1(0)}`;
      for (let i = 0; i < n; i++) {
        dp += ` L${X(curve.t[i])},${y1(Math.max(0, curve.product[i]))}`;
        dn += ` L${X(curve.t[i])},${y1(Math.min(0, curve.product[i]))}`;
      }
      dp += ` L${X(L)},${y1(0)} Z`;
      dn += ` L${X(L)},${y1(0)} Z`;
      g1.append(s('path', { class: 'svg-area-pos', d: dp }), s('path', { class: 'svg-area-neg', d: dn }));
      let dc = '';
      for (let i = 0; i < n; i++) dc += `${i ? 'L' : 'M'}${X(curve.t[i])},${y1(curve.product[i])} `;
      g1.append(s('path', { class: 'svg-curve', d: dc, 'stroke-width': 1.25 }));
      if (samples) {
        samples.t.forEach((tj, j) => {
          const val = samples.product[j];
          g1.append(s('line', { class: val >= 0 ? 'svg-pos-stroke' : 'svg-neg-stroke', 'stroke-width': 2, x1: X(tj), y1: y1(0), x2: X(tj), y2: y1(val) }));
        });
      }
      // ticks at the multiples of tickStep that the interval actually reaches
      for (let m = 1; m * tickStep <= L + 1e-9; m++) {
        const x = X(m * tickStep);
        g1.append(s('line', { class: 'svg-grid', x1: x, y1: 0, x2: x, y2: H1 }));
        g1.append(s('text', { class: 'svg-tick', x, y: H1 + 14, 'text-anchor': 'middle' }, tickLabel(m)));
      }

      const y2 = frame(g2, H2, runMax, plotW);
      let dr = '';
      for (let i = 0; i < n; i++) dr += `${i ? 'L' : 'M'}${X(curve.t[i])},${y2(curve.running[i])} `;
      g2.append(s('path', { class: 'svg-curve', d: dr, 'stroke-width': 1.75 }));
      endMarker(g2, X(L), y2(total), total);
    };
    rs.render();
  }

  return { el: svg, bars, area };
}
