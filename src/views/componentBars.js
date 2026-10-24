// What each component f_j contributes to one projection: the real and imaginary parts of ⟨f_j, e⟩ as signed bars.
// Same colour rule as everywhere: warm adds, cool subtracts, the neutral ground is zero. With an orthonormal
// basis only one row is lit; with a perturbed basis the other rows light up too, which is cross-talk.

import { s, clear } from '../core/dom.js';
import { num, sci } from '../core/format.js';
import { withTip } from '../core/tooltip.js';
import { responsiveSvg } from './responsive.js';

const ROW = 30;
const PADL = 70;
const PADR = 120;

export function createComponentBars({ K = 3, title }) {
  const H = 22 + K * ROW + 8;
  const svg = s('svg', { role: 'img', 'aria-label': title });
  const g = s('g');
  svg.append(g);
  let lastDraw = null;
  const rs = responsiveSvg(svg, H, (W) => lastDraw?.(W));

  function update({ values, target, xMax = 1.5 }) {
    lastDraw = (W) => {
      clear(g);
      const half = (W - PADL - PADR) / 2;
      const colRe = PADL + half / 2;
      const colIm = PADL + half + half / 2;
      const X = (x0, v) => x0 + (Math.max(-xMax, Math.min(xMax, v)) / xMax) * (half / 2 - 6);
      g.append(s('text', { class: 'svg-label', x: colRe, y: 12, 'text-anchor': 'middle' }, 'Re'));
      g.append(s('text', { class: 'svg-label', x: colIm, y: 12, 'text-anchor': 'middle' }, 'Im'));
      values.forEach((v, j) => {
        const y = 22 + j * ROW;
        g.append(s('text', { class: 'svg-math', x: 4, y: y + 18, style: { fontSize: '14px' } }, `f${['₁', '₂', '₃', '₄'][j]} → ${target}`));
        [[colRe, v[0]], [colIm, v[1]]].forEach(([x0, val]) => {
          g.append(s('line', { class: 'svg-zero', x1: x0, y1: y + 2, x2: x0, y2: y + ROW - 4 }));
          const x1 = X(x0, val);
          if (Math.abs(val) > 1e-9) {
            const r = s('rect', { class: val > 0 ? 'svg-pos' : 'svg-neg', x: Math.min(x0, x1), y: y + 6, width: Math.max(1.5, Math.abs(x1 - x0)), height: ROW - 14, rx: 2 });
            withTip(r, () => num(val, 4));
            g.append(r);
          }
        });
        const mag = Math.hypot(v[0], v[1]);
        g.append(s('text', { class: 'svg-tick', x: W - PADR + 8, y: y + 18, style: { fill: mag > 1e-9 ? 'var(--ink)' : 'var(--ink-3)' } }, mag > 1e-9 ? `${num(v[0], 3)} ${v[1] < 0 ? '−' : '+'} ${num(Math.abs(v[1]), 3)}i` : `0 (${sci(mag)})`));
      });
    };
    rs.render();
  }

  return { el: svg, update };
}
