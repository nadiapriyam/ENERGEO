// The plane R² with draggable arrows. Draws only what pairReadings() computed.

import { s, set } from '../core/dom.js';
import { deg } from '../core/format.js';

const ORTHO_TOL = 0.02; // |u·v| below this counts as "orthogonal within ±0.02" for the right-angle mark

export function createVectorPlane({ extent = 3, size = 420, draggable = ['v'], onDrag, triangle = false, labelTol = ORTHO_TOL }) {
  const pad = 24;
  const k = (size / 2 - pad) / extent;
  const c = size / 2;
  const X = (x) => c + x * k;
  const Y = (y) => c - y * k;

  const svg = s('svg', { viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': 'Two arrows u and v in the plane' });

  const grid = s('g');
  for (let i = -Math.floor(extent); i <= Math.floor(extent); i++) {
    grid.append(s('line', { class: i === 0 ? 'svg-axis' : 'svg-grid', x1: X(i), y1: Y(-extent), x2: X(i), y2: Y(extent) }));
    grid.append(s('line', { class: i === 0 ? 'svg-axis' : 'svg-grid', x1: X(-extent), y1: Y(i), x2: X(extent), y2: Y(i) }));
    if (i !== 0) grid.append(s('text', { class: 'svg-tick', x: X(i), y: Y(0) + 14, 'text-anchor': 'middle' }, String(i)));
  }

  const uLine = s('line', { class: 'svg-residual', 'stroke-dasharray': '2 5' }); // line through u, faint
  const shadow = s('line', { 'stroke-width': 7, 'stroke-linecap': 'round' });
  const residual = s('line', { class: 'svg-residual' });
  const resMark = s('path', { class: 'svg-right-angle' });
  const tri = s('g', { visibility: triangle ? 'visible' : 'hidden' });
  const triV = s('line', { class: 'svg-vec alt', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' });
  const triSum = s('line', { class: 'svg-vec', 'stroke-width': 1.5 });
  const triMark = s('path', { class: 'svg-right-angle' });
  const triLabel = s('text', { class: 'svg-math' }, 'u+v');
  tri.append(triV, triSum, triMark, triLabel);
  const arc = s('path', { class: 'svg-arc' });
  const square = s('path', { class: 'svg-right-angle' });
  const angleText = s('text', { class: 'svg-tick' });

  const arrow = (cls) => {
    const g = s('g');
    const line = s('line', { class: `svg-vec ${cls}` });
    const head = s('path', { class: `svg-vec-head ${cls}` });
    const label = s('text', { class: 'svg-math' });
    g.append(line, head, label);
    return { g, line, head, label };
  };
  const U = arrow('');
  const V = arrow('alt');
  U.label.textContent = 'u';
  V.label.textContent = 'v';

  svg.append(grid, uLine, shadow, residual, resMark, tri, arc, square, angleText, U.g, V.g);

  // Handles
  const handles = {};
  let state = null;
  for (const name of draggable) {
    const hit = s('circle', { class: 'svg-handle-hit', r: 18 });
    const dot = s('circle', {
      class: 'svg-handle',
      r: 7,
      tabindex: 0,
      role: 'slider',
      'aria-label': `Tip of ${name}. Arrow keys move it.`,
    });
    svg.append(hit, dot);
    handles[name] = { hit, dot };
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
      const step = e.shiftKey ? 0.25 : 0.05;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
      if (!d || !state) return;
      e.preventDefault();
      const p = state[name];
      onDrag(name, [p[0] + d[0], p[1] + d[1]]);
    });
  }

  const head = (from, to) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const L = 12;
    const W = 5;
    const tip = to;
    const b = [tip[0] - ux * L, tip[1] - uy * L];
    return `M${tip[0]},${tip[1]} L${b[0] - uy * W},${b[1] + ux * W} L${b[0] + uy * W},${b[1] - ux * W} Z`;
  };

  const place = (A, vec) => {
    const o = [X(0), Y(0)];
    const t = [X(vec[0]), Y(vec[1])];
    const len = Math.hypot(t[0] - o[0], t[1] - o[1]);
    const back = len > 14 ? 10 / len : 0;
    set(A.line, { x1: o[0], y1: o[1], x2: t[0] - (t[0] - o[0]) * back, y2: t[1] - (t[1] - o[1]) * back });
    set(A.head, { d: head(o, t) });
    const n = Math.hypot(vec[0], vec[1]) || 1;
    set(A.label, { x: t[0] + (vec[0] / n) * 14 - 4, y: t[1] - (vec[1] / n) * 14 + 5 });
  };

  const corner = (at, d1, d2, size = 10) => {
    // small square at `at` (px) along unit directions d1, d2 (px space)
    const p1 = [at[0] + d1[0] * size, at[1] + d1[1] * size];
    const p2 = [p1[0] + d2[0] * size, p1[1] + d2[1] * size];
    const p3 = [at[0] + d2[0] * size, at[1] + d2[1] * size];
    return `M${p1[0]},${p1[1]} L${p2[0]},${p2[1]} L${p3[0]},${p3[1]}`;
  };
  const pxDir = (vec) => {
    const n = Math.hypot(vec[0], vec[1]) || 1;
    return [vec[0] / n, -vec[1] / n];
  };

  function update({ u, v, r, showShadow = true, exact = false }) {
    state = { u, v };
    place(U, u);
    place(V, v);
    for (const [name, { hit, dot }] of Object.entries(handles)) {
      const p = name === 'u' ? u : v;
      set(hit, { cx: X(p[0]), cy: Y(p[1]) });
      set(dot, { cx: X(p[0]), cy: Y(p[1]), 'aria-valuetext': `${name} = (${p[0].toFixed(2)}, ${p[1].toFixed(2)})` });
    }

    // line through u
    const un = Math.hypot(u[0], u[1]) || 1;
    const ud = [u[0] / un, u[1] / un];
    set(uLine, { x1: X(-ud[0] * extent * 1.5), y1: Y(-ud[1] * extent * 1.5), x2: X(ud[0] * extent * 1.5), y2: Y(ud[1] * extent * 1.5), visibility: showShadow ? 'visible' : 'hidden' });

    // shadow, coloured by the sign of u·v
    const sh = r.shadow;
    set(shadow, {
      x1: X(0), y1: Y(0), x2: X(sh[0]), y2: Y(sh[1]),
      class: r.inner > 0 ? 'svg-pos-stroke' : 'svg-neg-stroke',
      visibility: showShadow && Math.hypot(sh[0], sh[1]) > 1e-6 ? 'visible' : 'hidden',
    });
    set(residual, { x1: X(sh[0]), y1: Y(sh[1]), x2: X(v[0]), y2: Y(v[1]), visibility: showShadow ? 'visible' : 'hidden' });
    const resLen = Math.hypot(r.residual[0], r.residual[1]);
    set(resMark, {
      d: resLen > 0.15 && Math.hypot(sh[0], sh[1]) > 0.15 ? corner([X(sh[0]), Y(sh[1])], pxDir([-sh[0], -sh[1]]), pxDir(r.residual), 8) : '',
      visibility: showShadow ? 'visible' : 'hidden',
    });

    // angle at the origin
    const a1 = Math.atan2(u[1], u[0]);
    const a2 = Math.atan2(v[1], v[0]);
    let d = a2 - a1;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const R = 30;
    const ortho = Math.abs(r.inner) < labelTol;
    const sweep = d > 0 ? 0 : 1;
    const p1 = [X(Math.cos(a1) * R / k), Y(Math.sin(a1) * R / k)];
    const p2 = [X(Math.cos(a1 + d) * R / k), Y(Math.sin(a1 + d) * R / k)];
    set(arc, { d: ortho ? '' : `M${p1[0]},${p1[1]} A${R},${R} 0 0 ${sweep} ${p2[0]},${p2[1]}` });
    // solid square: exactly orthogonal (by construction); dashed: only within the interactive tolerance
    set(square, { d: ortho ? corner([X(0), Y(0)], pxDir(u), pxDir(v), 12) : '' });
    if (exact) square.removeAttribute('stroke-dasharray');
    else square.setAttribute('stroke-dasharray', '3 2');
    const mid = a1 + d / 2;
    set(angleText, { x: X(Math.cos(mid) * (R + 18) / k) - 12, y: Y(Math.sin(mid) * (R + 18) / k) + 4 });
    angleText.textContent = deg(r.angle);

    if (triangle) {
      const s2 = [u[0] + v[0], u[1] + v[1]];
      set(triV, { x1: X(u[0]), y1: Y(u[1]), x2: X(s2[0]), y2: Y(s2[1]) });
      set(triSum, { x1: X(0), y1: Y(0), x2: X(s2[0]), y2: Y(s2[1]) });
      set(triMark, { d: ortho ? corner([X(u[0]), Y(u[1])], pxDir([-u[0], -u[1]]), pxDir(v), 9) : '' });
      if (exact) triMark.removeAttribute('stroke-dasharray');
      else triMark.setAttribute('stroke-dasharray', '3 2');
      const n2 = Math.hypot(s2[0], s2[1]) || 1;
      set(triLabel, { x: X(s2[0]) + (s2[0] / n2) * 10, y: Y(s2[1]) - (s2[1] / n2) * 10 });
    }
  }

  return { el: svg, update };
}
