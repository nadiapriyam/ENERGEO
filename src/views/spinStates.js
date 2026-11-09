// Stage 2b: two states of a spin pair, side by side. Each card shows only what has been measured on it, until the
// learner looks inside; then its amplitudes appear as bars over the basis |↑↑⟩, |↑↓⟩, |↓↑⟩, |↓↓⟩.
// Bars go up for + and down for −: the sign is drawn by direction, so colour keeps its single job elsewhere.
// 3D design note: nothing here is spatial, so the view stays 2D.

import { h, s } from '../core/dom.js';
import { num } from '../core/format.js';
import { texEl } from '../core/tex.js';

const W = 220;
const H = 120;

function bars(amps, labels) {
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `Amplitudes ${amps.map((a) => num(a, 3)).join(', ')}` });
  const mid = H / 2 - 6;
  const slot = (W - 20) / amps.length;
  svg.append(s('line', { class: 'svg-zero', x1: 10, y1: mid, x2: W - 10, y2: mid }));
  amps.forEach((a, i) => {
    const x = 10 + slot * i + slot * 0.25;
    const hgt = Math.abs(a) * (mid - 10);
    if (hgt > 0.5) svg.append(s('rect', { class: 'svg-amp', x, y: a > 0 ? mid - hgt : mid, width: slot * 0.5, height: hgt }));
    svg.append(s('text', { class: 'svg-tick', x: x + slot * 0.25, y: H - 4, 'text-anchor': 'middle' }, labels[i]));
    if (hgt > 0.5) svg.append(s('text', { class: 'svg-tick', x: x + slot * 0.25, y: a > 0 ? mid - hgt - 4 : mid + hgt + 11, 'text-anchor': 'middle' }, a > 0 ? `+${num(a, 3)}` : num(a, 3)));
  });
  return svg;
}

export function createSpinStates({ labels }) {
  const el = h('div', { class: 'spin-states' });
  return {
    el,
    update({ states, inside }) {
      el.replaceChildren(
        ...states.map((st) => {
          const rows = [h('div', { class: 'spin-reading' }, h('span', { class: 'zero-glyph', 'data-state': st.sz == null ? 'none' : st.sz === 0 ? 'exact' : 'none' }), st.sz == null ? h('span', { class: 'muted' }, 'S_z not measured yet') : h('span', null, h('b', null, `S_z → ${num(st.sz, 0)}`), ' with certainty'))];
          if (st.s2 != null) rows.push(h('div', { class: 'spin-reading' }, h('span', { class: 'zero-glyph', 'data-state': st.s2 === 0 ? 'exact' : 'none' }), h('span', null, h('b', null, `S² → ${st.s2 === 0 ? '0' : `${num(st.s2, 0)}ħ²`}`), ' with certainty')));
          const body = inside
            ? [texEl(st.ket, { display: true, tag: 'div', cls: 'spin-ket' }), bars(st.amps, labels)]
            : [h('div', { class: 'spin-hidden' }, 'Inside hidden. This state is seen only through what is measured on it.')];
          return h('figure', { class: 'spin-card' }, h('figcaption', null, h('strong', null, `State ${st.name}`), st.formalName ? h('span', { class: 'muted', html: ` · ${st.formalName}` }) : null), ...rows, ...body);
        }),
      );
    },
  };
}
