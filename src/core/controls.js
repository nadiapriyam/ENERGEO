// Control builders. `modes` limits a control to some modes ("guided explore advanced" by default).

import { h } from './dom.js';

let uid = 0;
const nextId = (p) => `${p}-${++uid}`;

export function slider({ id, label, min, max, step, value, format = (v) => v.toFixed(2), oninput, modes }) {
  const inputId = id ?? nextId('sl');
  const out = h('output', { for: inputId }, format(value));
  const input = h('input', { type: 'range', id: inputId, min, max, step, value });
  input.addEventListener('input', () => {
    const v = Number(input.value);
    out.textContent = format(v);
    oninput(v);
  });
  const el = h('div', { class: 'control', 'data-modes': modes }, h('label', { for: inputId }, h('span', { html: label }), out), input);
  return {
    el,
    set(v) {
      if (document.activeElement !== input) input.value = String(v);
      out.textContent = format(v);
    },
  };
}

export function button({ label, onclick, modes, pressed }) {
  const b = h('button', { type: 'button', class: 'btn', onclick, 'data-modes': modes, 'aria-pressed': pressed == null ? null : String(pressed) }, label);
  return { el: b, press: (on) => b.setAttribute('aria-pressed', String(on)) };
}

export function select({ id, label, options, value, onchange, modes }) {
  const sid = id ?? nextId('sel');
  const sel = h('select', { id: sid }, options.map(([v, t]) => h('option', { value: v, selected: v === value }, t)));
  sel.addEventListener('change', () => onchange(sel.value));
  return { el: h('div', { class: 'control', 'data-modes': modes }, h('label', { for: sid }, label), sel), set: (v) => (sel.value = v) };
}

export const row = (...children) => h('div', { class: 'choice-row' }, children);

export const group = (...children) => h('div', { style: { display: 'grid', gap: '12px' } }, children);
