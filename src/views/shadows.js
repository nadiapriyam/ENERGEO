// Small multiples: the shadow of a pair on each coordinate plane of R^n.
// Each panel is a projection and says so. The angle each shadow appears to make is computed, not drawn by eye.

import { s, set, h, clear } from '../core/dom.js';
import { deg } from '../core/format.js';
import { coordinatePlanes, coordinateShadow } from '../math/orthogonality.js';

const SUB = ['₁', '₂', '₃', '₄', '₅', '₆'];

export function createShadows({ n, extent = 2.2 }) {
  const wrap = h('div', { class: 'shadow-grid', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))', gap: '8px' } });
  const size = 120;
  const c = size / 2;
  const k = (size / 2 - 10) / extent;
  const panels = coordinatePlanes(n).map(([i, j]) => {
    const svg = s('svg', { viewBox: `0 0 ${size} ${size + 18}`, role: 'img', 'aria-label': `Shadow on the x${i + 1} x${j + 1} plane` });
    svg.append(
      s('line', { class: 'svg-axis', x1: 6, y1: c, x2: size - 6, y2: c }),
      s('line', { class: 'svg-axis', x1: c, y1: 6, x2: c, y2: size - 6 }),
      s('text', { class: 'svg-tick', x: size - 6, y: c - 4, 'text-anchor': 'end' }, `x${SUB[i]}`),
      s('text', { class: 'svg-tick', x: c + 4, y: 14 }, `x${SUB[j]}`),
    );
    const lu = s('line', { class: 'svg-vec', 'stroke-width': 2 });
    const lv = s('line', { class: 'svg-vec alt', 'stroke-width': 2 });
    const mark = s('path', { class: 'svg-right-angle' });
    const cap = s('text', { class: 'svg-tick', x: c, y: size + 12, 'text-anchor': 'middle' });
    svg.append(lu, lv, mark, cap);
    const fig = h('figure', { style: { margin: 0 } }, svg);
    wrap.append(fig);
    return { i, j, lu, lv, mark, cap };
  });

  const P = (x, y) => [c + x * k, c - y * k];

  function update(u, v) {
    for (const p of panels) {
      const sh = coordinateShadow(u, v, p.i, p.j);
      const a = P(...sh.u);
      const b = P(...sh.v);
      set(p.lu, { x1: c, y1: c, x2: a[0], y2: a[1] });
      set(p.lv, { x1: c, y1: c, x2: b[0], y2: b[1] });
      const looksRight = sh.angle != null && Math.abs(sh.angle - Math.PI / 2) < 0.5 * (Math.PI / 180);
      if (looksRight) {
        const un = Math.hypot(...sh.u);
        const vn = Math.hypot(...sh.v);
        const d1 = [sh.u[0] / un, -sh.u[1] / un];
        const d2 = [sh.v[0] / vn, -sh.v[1] / vn];
        const q1 = [c + d1[0] * 7, c + d1[1] * 7];
        const q2 = [q1[0] + d2[0] * 7, q1[1] + d2[1] * 7];
        const q3 = [c + d2[0] * 7, c + d2[1] * 7];
        set(p.mark, { d: `M${q1[0]},${q1[1]} L${q2[0]},${q2[1]} L${q3[0]},${q3[1]}` });
      } else set(p.mark, { d: '' });
      p.cap.textContent = sh.angle == null ? 'a shadow vanishes' : `looks ${deg(sh.angle, 0)}`;
    }
  }

  return { el: wrap, update };
}
