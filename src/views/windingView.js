// The projection ⟨f, e_k⟩ as geometry: wind f around the circle at frequency k, w(t) = f(t) e^{−2πikt},
// and take the centroid of the wound curve. The centroid is the coefficient f̂(k). The dashed arrow is the
// coefficient as set in the phasor panel; when the basis is orthonormal the two coincide.

import { s, set, clear } from '../core/dom.js';

export function createWindingView({ extent = 4.5 } = {}) {
  const size = 360;
  const c = size / 2;
  const k = (size / 2 - 16) / extent;
  const X = (x) => c + x * k;
  const Y = (y) => c - y * k;
  const svg = s('svg', { viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': 'The signal wound around the circle; its centroid is the coefficient' });
  const grid = s('g');
  for (let r = 1; r <= Math.floor(extent); r++) grid.append(s('circle', { class: 'svg-grid', cx: c, cy: c, r: r * k }));
  grid.append(
    s('line', { class: 'svg-axis', x1: 8, y1: c, x2: size - 8, y2: c }),
    s('line', { class: 'svg-axis', x1: c, y1: 8, x2: c, y2: size - 8 }),
    s('text', { class: 'svg-tick', x: size - 10, y: c - 6, 'text-anchor': 'end' }, 'Re'),
    s('text', { class: 'svg-tick', x: c + 6, y: 18 }, 'Im'),
  );
  const curve = s('path', { class: 'svg-curve', 'stroke-width': 1.25, style: { stroke: 'var(--ink-2)' } });
  const given = s('line', { class: 'svg-vec', 'stroke-width': 2, 'stroke-dasharray': '5 4', style: { stroke: 'var(--ink-3)' } });
  const arrow = s('line', { class: 'svg-vec', 'stroke-width': 3 });
  const dot = s('circle', { r: 6, style: { fill: 'var(--ink)' } });
  const label = s('text', { class: 'svg-math', style: { fontSize: '15px' } });
  svg.append(grid, curve, given, arrow, dot, label);

  function update({ wound, coefficient, k: freq }) {
    let d = '';
    wound.re.forEach((re, i) => {
      d += `${i ? 'L' : 'M'}${X(re)},${Y(wound.im[i])} `;
    });
    set(curve, { d });
    const [cr, ci] = wound.centroid;
    set(arrow, { x1: X(0), y1: Y(0), x2: X(cr), y2: Y(ci) });
    set(dot, { cx: X(cr), cy: Y(ci) });
    set(given, { x1: X(0), y1: Y(0), x2: X(coefficient[0]), y2: Y(coefficient[1]) });
    set(label, { x: X(cr) + 10, y: Y(ci) - 10 });
    label.textContent = `⟨f, e${['₀', '₁', '₂', '₃', '₄'][freq] ?? freq}⟩`;
  }

  return { el: svg, update };
}
