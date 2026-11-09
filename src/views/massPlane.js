// Stage 3: positive point masses in the plane (disc area ∝ mass), a draggable candidate origin R, each weighted
// displacement m_i (r_i − R) drawn from R, and their resultant F(R). All arrows share one fixed scale, so the
// drawing never encodes the answer in an arrow's length. The balancing point is drawn only after formalization.

import { s, set, clear } from '../core/dom.js';

export function createMassPlane({ extent = 3.2, size = 440, arrowScale = 0.22, onMoveMass, onMoveR, onSelect, onPlace }) {
  const pad = 22;
  const k = (size / 2 - pad) / extent;
  const c = size / 2;
  const X = (x) => c + x * k;
  const Y = (y) => c - y * k;
  const svg = s('svg', { viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': 'Point masses, a candidate origin R and the weighted displacements from R' });
  const grid = s('g');
  for (let i = -Math.floor(extent); i <= Math.floor(extent); i++) {
    grid.append(s('line', { class: i === 0 ? 'svg-axis' : 'svg-grid', x1: X(i), y1: Y(-extent), x2: X(i), y2: Y(extent) }));
    grid.append(s('line', { class: i === 0 ? 'svg-axis' : 'svg-grid', x1: X(-extent), y1: Y(i), x2: X(extent), y2: Y(i) }));
  }
  const bg = s('rect', { x: 0, y: 0, width: size, height: size, fill: 'transparent' });
  const termsG = s('g');
  const massesG = s('g');
  const predG = s('g');
  const cmG = s('g');
  const resLine = s('line', { class: 'svg-resultant' });
  const resHead = s('path', { class: 'svg-resultant-head' });
  const resLabel = s('text', { class: 'svg-math' }, 'F(R)');
  const ring = s('circle', { class: 'svg-zero-ring', r: 11 });
  const rCross = s('path', { class: 'svg-r-mark' });
  const rLabel = s('text', { class: 'svg-math' }, 'R');
  const rHit = s('circle', { class: 'svg-handle-hit', r: 18 });
  const rDot = s('circle', { class: 'svg-handle', r: 7, tabindex: 0, role: 'slider', 'aria-label': 'The candidate origin R. Arrow keys move it.' });
  svg.append(bg, grid, cmG, termsG, massesG, predG, resLine, resHead, resLabel, rCross, rLabel, ring, rHit, rDot);

  const toMath = (e) => {
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const q = p.matrixTransform(svg.getScreenCTM().inverse());
    const cl = (z) => Math.max(-extent, Math.min(extent, z));
    return [cl((q.x - c) / k), cl((c - q.y) / k)];
  };
  const dragger = (onMove, onDown) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDown?.();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (ev) => onMove(toMath(ev));
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };
  rHit.addEventListener('pointerdown', dragger(onMoveR));
  rDot.addEventListener('pointerdown', dragger(onMoveR));
  let last = null;
  rDot.addEventListener('keydown', (e) => {
    const st = e.shiftKey ? 0.25 : 0.05;
    const d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, st], ArrowDown: [0, -st] }[e.key];
    if (!d || !last) return;
    e.preventDefault();
    onMoveR([last.R[0] + d[0], last.R[1] + d[1]]);
  });
  svg.addEventListener('click', (e) => {
    if (last?.placing) onPlace(toMath(e));
  });

  const head = (from, to, L = 9, W = 4) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const b = [to[0] - ux * L, to[1] - uy * L];
    return `M${to[0]},${to[1]} L${b[0] - uy * W},${b[1] + ux * W} L${b[0] + uy * W},${b[1] - ux * W} Z`;
  };

  return {
    el: svg,
    update({ masses, positions, R, terms, F, zero, selected, prediction, placing, cm }) {
      last = { R, placing };
      svg.classList.toggle('placing', !!placing);
      clear(termsG);
      terms.forEach((t) => {
        const o = [X(R[0]), Y(R[1])];
        const e = [X(R[0] + t[0] * arrowScale), Y(R[1] + t[1] * arrowScale)];
        if (Math.hypot(e[0] - o[0], e[1] - o[1]) < 3) return;
        termsG.append(s('line', { class: 'svg-term', x1: o[0], y1: o[1], x2: e[0], y2: e[1] }), s('path', { class: 'svg-term-head', d: head(o, e, 7, 3) }));
      });
      clear(massesG);
      masses.forEach((m, i) => {
        const p = positions[i];
        const r = 7 + 9 * Math.sqrt(m);
        const g = s('g', { class: `mass${i === selected ? ' selected' : ''}`, tabindex: 0, role: 'button', 'aria-label': `Mass ${i + 1}, ${m.toFixed(1)}. Drag to move.` });
        g.append(s('circle', { class: 'svg-mass', cx: X(p[0]), cy: Y(p[1]), r }), s('text', { class: 'svg-mass-label', x: X(p[0]), y: Y(p[1]) + 4, 'text-anchor': 'middle' }, `m${'₁₂₃₄₅'[i]}`));
        g.addEventListener('pointerdown', dragger((q) => onMoveMass(i, q), () => onSelect(i)));
        g.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect(i);
        });
        massesG.append(g);
      });
      clear(predG);
      if (prediction) {
        const P = [X(prediction[0]), Y(prediction[1])];
        predG.append(s('circle', { class: 'svg-prediction', cx: P[0], cy: P[1], r: 13 }), s('text', { class: 'svg-tick', x: P[0] + 16, y: P[1] - 10 }, 'your prediction'));
      }
      clear(cmG);
      if (cm) {
        const C = [X(cm[0]), Y(cm[1])];
        cmG.append(s('path', { class: 'svg-cm', d: `M${C[0]},${C[1] - 8} L${C[0] + 8},${C[1]} L${C[0]},${C[1] + 8} L${C[0] - 8},${C[1]} Z` }), s('text', { class: 'svg-math', x: C[0] + 11, y: C[1] + 18 }, 'R_CM'));
      }
      const o = [X(R[0]), Y(R[1])];
      const e = [X(R[0] + F[0] * arrowScale), Y(R[1] + F[1] * arrowScale)];
      const len = Math.hypot(e[0] - o[0], e[1] - o[1]);
      const show = len > 3;
      set(resLine, { x1: o[0], y1: o[1], x2: e[0], y2: e[1], visibility: show ? 'visible' : 'hidden' });
      set(resHead, { d: head(o, e, 12, 5), visibility: show ? 'visible' : 'hidden' });
      set(resLabel, { x: e[0] + 8, y: e[1] - 8, visibility: show ? 'visible' : 'hidden' });
      set(rCross, { d: `M${o[0] - 9},${o[1]} L${o[0] + 9},${o[1]} M${o[0]},${o[1] - 9} L${o[0]},${o[1] + 9}` });
      set(rLabel, { x: o[0] - 20, y: o[1] - 12 });
      set(ring, { cx: o[0], cy: o[1] });
      ring.dataset.state = zero;
      set(rHit, { cx: o[0], cy: o[1] });
      set(rDot, { cx: o[0], cy: o[1] });
    },
  };
}
