// Parseval as two bars on one scale: the coefficient side Σ 2|f̂(k)|² split by harmonic, and the time side ∫₀¹ f² dt.
// Harmonics are objects, so they are ink tones with labels; a removed harmonic is an empty dashed slot.

import { s, clear } from '../core/dom.js';
import { num } from '../core/format.js';
import { responsiveSvg } from './responsive.js';

const H = 132;
const PADL = 118;
const PADR = 70;
const NICE = [1, 2, 4, 6, 8, 12, 16, 24];
const TONES = ['48%', '30%', '17%', '10%'];

export function createEnergyBars() {
  const svg = s('svg', { role: 'img', 'aria-label': 'Energy from the coefficients against energy from the waveform' });
  const g = s('g');
  svg.append(g);
  let lastDraw = null;
  const rs = responsiveSvg(svg, H, (W) => lastDraw?.(W));
  const rowA = 32;
  const rowB = 92;
  const bh = 24;

  function update({ parts, active, timeSide }) {
    lastDraw = (W) => {
      clear(g);
      const all = parts.reduce((a, b) => a + b, 0);
      const scale = NICE.find((n) => n >= Math.max(all, timeSide) * 1.05) ?? Math.ceil(all);
      const plotW = W - PADL - PADR;
      const X = (q) => PADL + (q / scale) * plotW;
      g.append(
        s('text', { class: 'svg-label', x: 0, y: rowA + 16 }, 'Σ 2|f̂(k)|²'),
        s('text', { class: 'svg-label', x: 0, y: rowB + 16 }, '∫₀¹ f(t)² dt'),
      );
      let acc = 0;
      parts.forEach((pk, i) => {
        if (active[i]) {
          g.append(s('rect', { x: X(acc), y: rowA, width: Math.max(0, X(acc + pk) - X(acc)), height: bh, style: { fill: `color-mix(in oklab, var(--ink) ${TONES[i] ?? '10%'}, var(--surface))`, stroke: 'var(--surface)', strokeWidth: 2 } }));
          if (X(acc + pk) - X(acc) > 34) g.append(s('text', { class: 'svg-tick', x: X(acc) + 4, y: rowA - 6 }, `k=${i + 1}`));
          acc += pk;
        }
      });
      const removed = parts.reduce((sum, pk, i) => sum + (active[i] ? 0 : pk), 0);
      if (removed > 0) {
        g.append(s('rect', { x: X(acc), y: rowA, width: X(acc + removed) - X(acc), height: bh, style: { fill: 'none', stroke: 'var(--ink-3)', strokeDasharray: '4 3', strokeWidth: 1.5 } }));
        g.append(s('text', { class: 'svg-tick', x: X(acc) + 4, y: rowA + bh + 14 }, `removed: ${num(removed, 3)}`));
      }
      g.append(s('rect', { x: PADL, y: rowB, width: X(timeSide) - PADL, height: bh, style: { fill: 'color-mix(in oklab, var(--ink) 40%, var(--surface))' } }));
      g.append(s('line', { class: 'svg-residual', x1: X(acc), x2: X(acc), y1: rowA - 10, y2: rowB + bh + 6 }));
      g.append(s('text', { class: 'svg-tick', x: X(acc) + 6, y: rowA + 16, style: { fill: 'var(--ink)' } }, num(acc, 3)));
      g.append(s('text', { class: 'svg-tick', x: X(timeSide) + 6, y: rowB + 16, style: { fill: 'var(--ink)' } }, num(timeSide, 3)));
      g.append(s('text', { class: 'svg-tick', x: W - 4, y: H - 2, 'text-anchor': 'end' }, `scale 0 to ${scale}`));
    };
    rs.render();
  }

  return { el: svg, update };
}
