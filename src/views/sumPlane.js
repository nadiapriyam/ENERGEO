// Stage 1: two abstract arrows v, w in the plane and their resultant v + w, drawn from the origin.
// w is also drawn again from the tip of v (dashed), which is how the sum is built. Both tips are draggable.

import { s, set } from '../core/dom.js';

export function createSumPlane({ extent = 3, size = 420, onDrag }) {
  const pad = 24;
  const k = (size / 2 - pad) / extent;
  const c = size / 2;
  const X = (x) => c + x * k;
  const Y = (y) => c - y * k;
  const svg = s('svg', { viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': 'Two arrows v and w and their resultant v + w' });

  const grid = s('g');
  for (let i = -Math.floor(extent); i <= Math.floor(extent); i++) {
    grid.append(s('line', { class: i === 0 ? 'svg-axis' : 'svg-grid', x1: X(i), y1: Y(-extent), x2: X(i), y2: Y(extent) }));
    grid.append(s('line', { class: i === 0 ? 'svg-axis' : 'svg-grid', x1: X(-extent), y1: Y(i), x2: X(extent), y2: Y(i) }));
    if (i !== 0) grid.append(s('text', { class: 'svg-tick', x: X(i), y: Y(0) + 14, 'text-anchor': 'middle' }, String(i)));
  }

  const arrow = (cls, label) => {
    const g = s('g');
    const line = s('line', { class: cls });
    const head = s('path', { class: `${cls}-head` });
    const text = s('text', { class: 'svg-math' }, label);
    g.append(line, head, text);
    return { g, line, head, text };
  };
  const V = arrow('svg-vec', 'v');
  const W = arrow('svg-vec alt', 'w');
  const Wg = arrow('svg-vec ghost', '');
  const Rz = arrow('svg-resultant', 'v + w');
  const ring = s('circle', { class: 'svg-zero-ring', cx: X(0), cy: Y(0), r: 11 });
  svg.append(grid, Wg.g, V.g, W.g, Rz.g, ring);

  const headPath = (from, to) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const b = [to[0] - ux * 12, to[1] - uy * 12];
    return `M${to[0]},${to[1]} L${b[0] - uy * 5},${b[1] + ux * 5} L${b[0] + uy * 5},${b[1] - ux * 5} Z`;
  };
  const place = (A, from, to, labelOffset = 14) => {
    const o = [X(from[0]), Y(from[1])];
    const t = [X(to[0]), Y(to[1])];
    const len = Math.hypot(t[0] - o[0], t[1] - o[1]);
    const show = len > 2;
    const back = len > 14 ? 10 / len : 0;
    set(A.line, { x1: o[0], y1: o[1], x2: t[0] - (t[0] - o[0]) * back, y2: t[1] - (t[1] - o[1]) * back, visibility: show ? 'visible' : 'hidden' });
    set(A.head, { d: headPath(o, t), visibility: show ? 'visible' : 'hidden' });
    const d = [to[0] - from[0], to[1] - from[1]];
    const n = Math.hypot(...d) || 1;
    set(A.text, { x: t[0] + (d[0] / n) * labelOffset - 6, y: t[1] - (d[1] / n) * labelOffset + 5, visibility: show ? 'visible' : 'hidden' });
  };

  let state = null;
  for (const name of ['v', 'w']) {
    const hit = s('circle', { class: 'svg-handle-hit', r: 18 });
    const dot = s('circle', { class: 'svg-handle', r: 7, tabindex: 0, role: 'slider', 'aria-label': `Tip of ${name}. Arrow keys move it.` });
    svg.append(hit, dot);
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
      const move = (ev) => onDrag(name, toMath(ev));
      const up = () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      onDrag(name, toMath(e));
    };
    hit.addEventListener('pointerdown', start);
    dot.addEventListener('pointerdown', start);
    dot.addEventListener('keydown', (e) => {
      const st = e.shiftKey ? 0.25 : 0.05;
      const d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, st], ArrowDown: [0, -st] }[e.key];
      if (!d || !state) return;
      e.preventDefault();
      const p = state[name];
      onDrag(name, [p[0] + d[0], p[1] + d[1]]);
    });
    if (name === 'v') V.handle = { hit, dot };
    else W.handle = { hit, dot };
  }

  return {
    el: svg,
    update({ v, w, r, zero }) {
      state = { v, w };
      place(V, [0, 0], v);
      place(W, [0, 0], w);
      place(Wg, v, [v[0] + w[0], v[1] + w[1]]);
      place(Rz, [0, 0], r, 20);
      for (const [A, p] of [[V, v], [W, w]]) {
        set(A.handle.hit, { cx: X(p[0]), cy: Y(p[1]) });
        set(A.handle.dot, { cx: X(p[0]), cy: Y(p[1]) });
      }
      ring.dataset.state = zero;
    },
  };
}
