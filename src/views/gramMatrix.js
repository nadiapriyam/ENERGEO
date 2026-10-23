// A Gram matrix as a diverging heatmap: warm for positive entries, cool for negative, the neutral ground for 0.
// An orthonormal basis reads as a warm diagonal on an empty field: the off-diagonal relationships are gone.

import { s, set, clear } from '../core/dom.js';
import { num } from '../core/format.js';
import { withTip } from '../core/tooltip.js';

export function createGramMatrix({ labels, cell = 44, showValues = false, valueDigits = 2, scaleMax = 1 }) {
  const n = labels.length;
  const off = 34;
  const size = off + n * cell + 4;
  const svg = s('svg', { viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': 'Gram matrix of inner products', style: { maxWidth: `${Math.max(220, size)}px` } });
  const cells = [];
  const texts = [];
  let current = null;
  let digits = valueDigits;

  labels.forEach((lab, i) => {
    svg.append(s('text', { class: 'svg-math', x: off + i * cell + cell / 2, y: off - 10, 'text-anchor': 'middle', style: { fontSize: '14px' } }, lab));
    svg.append(s('text', { class: 'svg-math', x: off - 8, y: off + i * cell + cell / 2 + 5, 'text-anchor': 'end', style: { fontSize: '14px' } }, lab));
  });
  for (let i = 0; i < n; i++) {
    cells.push([]);
    texts.push([]);
    for (let j = 0; j < n; j++) {
      const r = s('rect', { class: 'svg-cell', x: off + j * cell, y: off + i * cell, width: cell, height: cell, rx: 3 });
      withTip(r, () => `⟨${labels[i]}, ${labels[j]}⟩ = ${num(current?.[i]?.[j], 4)}`);
      const t = s('text', { class: 'svg-cell-text', x: off + j * cell + cell / 2, y: off + i * cell + cell / 2 });
      svg.append(r, t);
      cells[i].push(r);
      texts[i].push(t);
    }
  }

  function update(G, opts = {}) {
    current = G;
    const show = opts.showValues ?? showValues;
    if (opts.digits) digits = opts.digits;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const g = G[i][j];
        const p = Math.min(100, Math.round((Math.abs(g) / scaleMax) * 100));
        const pole = g >= 0 ? 'var(--pos)' : 'var(--neg)';
        set(cells[i][j], { style: { fill: `color-mix(in oklab, ${pole} ${p}%, var(--zero))` } });
        texts[i][j].textContent = show ? num(g, digits) : '';
        texts[i][j].style.fill = p > 55 ? 'var(--surface)' : 'var(--ink)';
      }
    }
  }

  return { el: svg, update };
}
