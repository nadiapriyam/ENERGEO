// One small complex plane per harmonic, each holding the coefficient f̂(k) as a draggable arrow.
// Length is the amplitude, angle is the phase. An optional ghost arrow (dashed) shows another estimate of the
// same coefficient, such as a naive projection in a non-orthogonal basis.

import { h, s, set } from '../core/dom.js';
import { num, deg } from '../core/format.js';

export function createPhasorPanel({ K = 3, extent = 1.5, onDrag, draggable = true, labels }) {
  const size = 170;
  const c = size / 2;
  const k = (size / 2 - 14) / extent;
  const X = (x) => c + x * k;
  const Y = (y) => c - y * k;
  const wrap = h('div', { class: 'phasors', style: { display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`, gap: '10px' } });

  const panels = Array.from({ length: K }, (_, i) => {
    const svg = s('svg', { viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': `Coefficient of harmonic ${i + 1} in the complex plane` });
    svg.append(
      s('circle', { class: 'svg-grid', cx: c, cy: c, r: k }),
      s('line', { class: 'svg-axis', x1: 6, y1: c, x2: size - 6, y2: c }),
      s('line', { class: 'svg-axis', x1: c, y1: 6, x2: c, y2: size - 6 }),
      s('text', { class: 'svg-tick', x: size - 8, y: c - 5, 'text-anchor': 'end' }, 'Re'),
      s('text', { class: 'svg-tick', x: c + 5, y: 14 }, 'Im'),
      s('text', { class: 'svg-tick', x: X(1), y: c + 13, 'text-anchor': 'middle' }, '1'),
    );
    const ghost = s('line', { class: 'svg-vec alt', 'stroke-width': 2, 'stroke-dasharray': '4 3' });
    const ghostDot = s('circle', { r: 4, style: { fill: 'var(--surface)', stroke: 'var(--ink-2)', strokeWidth: 1.5 } });
    const line = s('line', { class: 'svg-vec', 'stroke-width': 2.5 });
    const head = s('circle', { class: 'svg-handle', r: 6, tabindex: draggable ? 0 : null, role: draggable ? 'slider' : null, 'aria-label': `f̂(${i + 1}). Arrow keys move it.` });
    const hit = s('circle', { class: 'svg-handle-hit', r: 16 });
    const name = s('text', { class: 'svg-math', x: 8, y: size - 8, style: { fontSize: '15px' } }, labels?.[i] ?? `f̂(${i + 1})`);
    svg.append(ghost, ghostDot, line, hit, head, name);
    const read = h('div', { class: 'note', style: { textAlign: 'center', fontVariantNumeric: 'tabular-nums' } });
    const fig = h('figure', { style: { margin: 0, display: 'grid', gap: '2px' } }, svg, read);
    wrap.append(fig);
    let current = [0, 0];
    if (draggable) {
      const toMath = (e) => {
        const p = svg.createSVGPoint();
        p.x = e.clientX;
        p.y = e.clientY;
        const q = p.matrixTransform(svg.getScreenCTM().inverse());
        const cl = (z) => Math.max(-extent, Math.min(extent, z));
        return [cl((q.x - c) / k), cl((c - q.y) / k)];
      };
      const start = (e) => {
        e.preventDefault();
        const el = e.currentTarget;
        el.setPointerCapture(e.pointerId);
        const move = (ev) => onDrag(i, toMath(ev));
        const up = () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', up);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        onDrag(i, toMath(e));
      };
      hit.addEventListener('pointerdown', start);
      head.addEventListener('pointerdown', start);
      head.addEventListener('keydown', (e) => {
        const step = e.shiftKey ? 0.1 : 0.02;
        const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
        if (!d) return;
        e.preventDefault();
        onDrag(i, [current[0] + d[0], current[1] + d[1]]);
      });
    }
    return {
      fig,
      update(coef, { ghostCoef = null, active = true } = {}) {
        current = coef;
        set(line, { x1: X(0), y1: Y(0), x2: X(coef[0]), y2: Y(coef[1]) });
        set(head, { cx: X(coef[0]), cy: Y(coef[1]), 'aria-valuetext': `f̂(${i + 1}) = ${num(coef[0], 2)} + ${num(coef[1], 2)}i` });
        set(hit, { cx: X(coef[0]), cy: Y(coef[1]) });
        fig.style.opacity = active ? '1' : '0.35';
        const show = ghostCoef && Math.hypot(ghostCoef[0] - coef[0], ghostCoef[1] - coef[1]) > 1e-9;
        set(ghost, { x1: X(0), y1: Y(0), x2: X(ghostCoef?.[0] ?? 0), y2: Y(ghostCoef?.[1] ?? 0), visibility: show ? 'visible' : 'hidden' });
        set(ghostDot, { cx: X(ghostCoef?.[0] ?? 0), cy: Y(ghostCoef?.[1] ?? 0), visibility: show ? 'visible' : 'hidden' });
        read.textContent = active ? `|f̂| = ${num(Math.hypot(...coef), 2)}, phase ${deg(Math.atan2(coef[1], coef[0]), 0)}` : 'removed';
      },
    };
  });

  return {
    el: wrap,
    update(coeffs, opts = {}) {
      panels.forEach((p, i) => p.update(coeffs[i], { ghostCoef: opts.ghosts?.[i] ?? null, active: opts.active?.[i] ?? true }));
    },
  };
}
