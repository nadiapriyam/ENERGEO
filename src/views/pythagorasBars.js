// ‖u‖² + ‖v‖² (+ cross term 2u·v) against ‖u+v‖², on one shared scale.
// The cross term is the only signed piece: warm when it adds, cool when it takes away.

import { s, clear } from '../core/dom.js';
import { num } from '../core/format.js';
import { responsiveSvg } from './responsive.js';

const H = 150;
const PADL = 92;
const PADR = 110;
const NICE = [10, 20, 40, 80, 160];

export function createPythagorasBars() {
  const svg = s('svg', { role: 'img', 'aria-label': 'Squared lengths compared: ‖u‖² + ‖v‖² against ‖u+v‖²' });
  const g = s('g');
  svg.append(g);
  let lastDraw = null;
  const rs = responsiveSvg(svg, H, (W) => lastDraw?.(W));
  const rowA = 34;
  const rowB = 96;
  const bh = 26;

  function update(r) {
    lastDraw = (W) => {
      clear(g);
      const a = r.gram[0][0];
      const b = r.gram[1][1];
      const c = r.crossTerm;
      const need = Math.max(a + b + Math.max(c, 0), r.normSum2);
      const scale = NICE.find((n) => n >= need * 1.05) ?? NICE.at(-1);
      const plotW = W - PADL - PADR;
      const X = (q) => PADL + (q / scale) * plotW;
      g.append(
        s('text', { class: 'svg-label', x: 0, y: rowA + 17 }, '‖u‖² + ‖v‖²'),
        s('text', { class: 'svg-label', x: 0, y: rowB + 17 }, '‖u+v‖²'),
        s('rect', { x: PADL, y: rowA, height: bh, width: X(a) - PADL, style: { fill: 'color-mix(in oklab, var(--ink) 30%, var(--surface))' } }),
        s('rect', { x: X(a), y: rowA, height: bh, width: X(a + b) - X(a), style: { fill: 'color-mix(in oklab, var(--ink-2) 16%, var(--surface))', stroke: 'var(--surface)', strokeWidth: 2 } }),
        s('rect', { x: PADL, y: rowB, height: bh, width: X(r.normSum2) - PADL, style: { fill: 'color-mix(in oklab, var(--ink) 44%, var(--surface))' } }),
        s('line', { class: 'svg-residual', x1: X(r.normSum2), x2: X(r.normSum2), y1: rowA - 8, y2: rowB + bh + 6 }),
        s('text', { class: 'svg-tick', x: PADL, y: rowA - 8 }, `‖u‖² = ${num(a, 2)}`),
        s('text', { class: 'svg-tick', x: Math.max(X(a) + 4, PADL + 96), y: rowA - 8 }, `‖v‖² = ${num(b, 2)}`),
        s('text', { class: 'svg-tick', x: X(r.normSum2) + 6, y: rowB + 17 }, num(r.normSum2, 2)),
        s('text', { class: 'svg-tick', x: W - 4, y: H - 4, 'text-anchor': 'end' }, `scale 0 to ${scale}`),
      );
      if (c >= 0) g.append(s('rect', { class: 'svg-pos', x: X(a + b), y: rowA, height: bh, width: X(a + b + c) - X(a + b) }));
      else g.append(s('rect', { class: 'svg-neg', x: X(a + b + c), y: rowA + bh / 2 - 4, height: 8, width: X(a + b) - X(a + b + c) }));
      g.append(s('text', { class: 'svg-tick', x: X(a + b + Math.max(c, 0)) + 6, y: rowA + 17, style: { fill: 'var(--ink)' } }, `2u·v = ${num(c, 2)}`));
    };
    rs.render();
  }

  return { el: svg, update };
}
