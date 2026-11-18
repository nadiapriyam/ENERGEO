// Interactive 01 (docs/prototype_try_spec.md, Revision 2). The learner pairs ← pieces with → pieces; the TOTAL above
// shrinks to an exact 0; then the 0 stays still while different balanced arrangements move behind it.
// Every learner-facing line comes from copy.js; every position and every total comes from src/math/pieces.js.
import './try.css';   // system sans: its 0 is a plain 0

import { COPY } from './copy.js';
import { start, pair, dropTarget, tapTarget, totalOf, pairedCount, restingSpot, total, layout, ARRANGEMENTS, PAIRS, ROWS, VIEW, PIECE, UNIT, dirOf } from '../../math/pieces.js';

const NS = 'http://www.w3.org/2000/svg';
const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = VIEW.w / 2;

const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  e.append(...kids);
  return e;
};
const svg = (tag, attrs = {}) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const reading = (text) => Math.min(4500, 900 + 40 * text.length);

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let state = start();
let phase = 'opening';
let locked = true;

// ── layout ───────────────────────────────────────────────────────────────────────────────────────
const root = document.getElementById('lesson');
const opening = el('section', { class: 'opening' });
const figure = el('figure', { class: 'figure', hidden: '' });
const prompt = el('div', { class: 'prompt', 'aria-live': 'polite' });
root.append(opening, figure, prompt);

const board = svg('svg', { viewBox: `0 0 ${VIEW.w} ${VIEW.h}`, class: 'board', role: 'group', 'aria-label': 'Pieces and their total' });
const label = svg('text', { class: 'total-label', x: C, y: ROWS.label, 'text-anchor': 'middle' });
label.textContent = COPY.totalLabel;
const totalG = svg('g', { class: 'total', role: 'img' });
const totalArrow = svg('path', { class: 'total-arrow' });
const totalZero = svg('text', { class: 'total-zero', x: C, y: ROWS.total, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
totalZero.textContent = COPY.zero;
totalG.append(totalArrow, totalZero);
const pairZeros = PAIRS.map(({ zero }) => {
  const t = svg('text', { class: 'pair-zero', x: zero.x, y: zero.y, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
  t.textContent = COPY.pairZero;
  return t;
});
const piecesLayer = svg('g', { class: 'pieces' });
board.append(label, totalG, ...pairZeros, piecesLayer);
figure.append(board);

// a rounded bar with a clear arrowhead, pointing right; a left piece is the same shape mirrored (never rotated)
const SHAPE = 'M -24 -6 H 4 V -12.5 L 29 0 L 4 12.5 V 6 H -24 A 6 6 0 0 1 -24 -6 Z';
const pieces = new Map();

function makePiece(id, at, { entering = false } = {}) {
  const outer = svg('g', { class: `piece ${dirOf(id) > 0 ? 'right' : 'left'}`, 'data-id': id });
  const enter = svg('g', { class: `piece-enter${entering ? ' entering' : ''}` });
  const mid = svg('g', { class: 'piece-mid' });
  const inner = svg('g', { transform: dirOf(id) > 0 ? '' : 'scale(-1 1)' });
  inner.append(svg('rect', { class: 'piece-hit', x: -42, y: -32, width: 84, height: 64 }), svg('path', { class: 'piece-shape', d: SHAPE }));
  mid.append(inner);
  enter.append(mid);
  outer.append(enter);
  piecesLayer.append(outer);
  const p = { id, outer, enter, mid, x: at.x, y: at.y };
  pieces.set(id, p);
  place(p, at.x, at.y, false);
  if (entering) requestAnimationFrame(() => requestAnimationFrame(() => enter.classList.remove('entering')));
  return p;
}

function place(p, x, y, animate = true) {
  p.x = x;
  p.y = y;
  p.outer.classList.toggle('moving', animate && !REDUCED);
  p.outer.style.transform = `translate(${x}px, ${y}px)`;
}

function drawTotal(value) {
  if (value === 0) {
    totalG.classList.add('is-zero');
    totalG.setAttribute('aria-label', `${COPY.totalLabel}: ${COPY.zero}`);
    return;
  }
  totalG.classList.remove('is-zero');
  totalG.setAttribute('aria-label', `${COPY.totalLabel}: an arrow pointing ${value > 0 ? 'right' : 'left'}, ${Math.abs(value)} long`);
  const len = UNIT * Math.abs(value) + 20;
  const s = Math.sign(value);
  const x0 = C - (s * len) / 2;
  const x1 = C + (s * len) / 2;
  const y = ROWS.total;
  const neck = x1 - s * 20;
  totalArrow.setAttribute('d', `M ${x0} ${y - 5} L ${neck} ${y - 5} L ${neck} ${y - 12} L ${x1} ${y} L ${neck} ${y + 12} L ${neck} ${y + 5} L ${x0} ${y + 5} Z`);
}

// ── pairing: drag or tap a waiting ← ──────────────────────────────────────────────────────────────
function toSvg(e) {
  const pt = board.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(board.getScreenCTM().inverse());
}

function settle(id, p) {
  const piece = pieces.get(id);
  if (p === null) { const home = restingSpot(id); place(piece, home.x, home.y); return; }
  state = pair(state, id, p);
  const spot = PAIRS[p].left;
  place(piece, spot.x, spot.y);
  piece.outer.classList.remove('waiting');
  piece.outer.removeAttribute('tabindex');
  piece.outer.removeAttribute('role');
  setTimeout(() => {
    drawTotal(totalOf(state));
    const z = pairZeros[p];
    z.classList.add('show');
    setTimeout(() => z.classList.remove('show'), 1500);
    afterPair();
  }, REDUCED ? 0 : 240);
}

function startDrag(e, id) {
  if (locked || !state.waiting.includes(id)) return;
  e.preventDefault();
  const piece = pieces.get(id);
  piece.outer.setPointerCapture(e.pointerId);
  const p0 = toSvg(e);
  const dx = p0.x - piece.x;
  const dy = p0.y - piece.y;
  let moved = 0;
  piece.outer.classList.add('dragging');
  const move = (ev) => {
    const q = toSvg(ev);
    moved = Math.max(moved, Math.hypot(q.x - p0.x, q.y - p0.y));
    place(piece, q.x - dx, q.y - dy, false);
  };
  const end = (ev) => {
    piece.outer.classList.remove('dragging');
    piece.outer.removeEventListener('pointermove', move);
    piece.outer.removeEventListener('pointerup', end);
    piece.outer.removeEventListener('pointercancel', end);
    if (ev.type === 'pointercancel') return settle(id, null);
    settle(id, moved < 8 ? tapTarget(state, id) : dropTarget(state, piece.x, piece.y));
  };
  piece.outer.addEventListener('pointermove', move);
  piece.outer.addEventListener('pointerup', end);
  piece.outer.addEventListener('pointercancel', end);
}

function setLocked(v) {
  locked = v;
  figure.classList.toggle('is-locked', v);
  figure.classList.toggle('is-playing', !v);
  for (const id of state.waiting) pieces.get(id)?.outer.setAttribute('aria-disabled', String(v));
}

// ── the prompt under the figure: one small piece of text at a time ─────────────────────────────────
const say = (text, cls = '') => {
  const p = el('p', { class: `line ${cls}`.trim(), text });
  prompt.append(p);
  requestAnimationFrame(() => p.classList.add('in'));
  return p;
};
const clear = () => prompt.replaceChildren();
const followFocus = (target) => { if (figure.contains(document.activeElement) || document.activeElement === document.body) target.focus({ preventScroll: true }); };

function choices(options, onPick) {
  const row = el('div', { class: 'choices' });
  const buttons = options.map((o) => {
    const b = el('button', { type: 'button', class: 'choice', text: o });
    b.addEventListener('click', () => onPick(o, b, buttons));
    return b;
  });
  row.append(...buttons);
  prompt.append(row);
  requestAnimationFrame(() => row.classList.add('in'));
  followFocus(buttons[0]);
  return buttons;
}

function button(text, onClick) {
  const b = el('button', { type: 'button', class: 'action', text });
  b.addEventListener('click', () => { b.remove(); onClick(); }, { once: true });
  prompt.append(b);
  requestAnimationFrame(() => b.classList.add('in'));
  followFocus(b);
  return b;
}

// ── the flow (Revision 2, section 15) ─────────────────────────────────────────────────────────────
async function step1() {
  opening.append(el('p', { class: 'line lead in', text: COPY.opening[0] }));
  await wait(900);
  const p = el('p', { class: 'line lead', text: COPY.opening[1] });
  const go = el('button', { type: 'button', class: 'action', text: COPY.start });
  opening.append(p, go);
  requestAnimationFrame(() => { p.classList.add('in'); go.classList.add('in'); });
  go.addEventListener('click', () => { opening.remove(); step2(); }, { once: true });
}

function step2() {
  phase = 'play';
  for (const id of state.row) makePiece(id, restingSpot(id));
  for (const id of state.waiting) {
    const p = makePiece(id, restingSpot(id));
    p.outer.classList.add('waiting');
    p.outer.setAttribute('tabindex', '0');
    p.outer.setAttribute('role', 'button');
    p.outer.setAttribute('aria-label', 'Left-pointing piece');
    p.outer.addEventListener('pointerdown', (e) => startDrag(e, id));
    p.outer.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !locked && state.waiting.includes(id)) { e.preventDefault(); settle(id, tapTarget(state, id)); }
    });
  }
  drawTotal(totalOf(state));
  figure.hidden = false;
  requestAnimationFrame(() => figure.classList.add('in'));
  say(COPY.task);
  setLocked(false);
  pieces.get(state.waiting[0]).outer.focus({ preventScroll: true });
}

function afterPair() {
  if (phase === 'play' && pairedCount(state) === 2) step4();
  else if (phase === 'play2' && totalOf(state) === 0) step5();
}

async function step4() {                       // midway checkpoint
  phase = 'check1';
  setLocked(true);
  await wait(700);
  clear();
  say(COPY.check1.question);
  choices(COPY.check1.choices, async (o, b, all) => {
    all.forEach((x) => { x.disabled = true; });
    b.classList.add('picked');
    say(COPY.check1.after);
    await wait(400);
    phase = 'play2';
    setLocked(false);
    const next = state.waiting[0];
    if (next) pieces.get(next).outer.focus({ preventScroll: true });
  });
}

async function step5() {                       // reaching 0
  phase = 'zero';
  setLocked(true);
  await wait(1400);
  clear();
  say(COPY.reached[0]);
  await wait(reading(COPY.reached[0]));
  say(COPY.reached[1]);
  button(COPY.lookCloser, step7);
}

function emphasize() {
  for (const p of pieces.values()) {
    p.outer.classList.remove('prominent');
    void p.outer.getBoundingClientRect();     // restart the emphasis
    p.outer.classList.add('prominent');
  }
}

function step7() {                             // second checkpoint
  phase = 'check2';
  emphasize();
  clear();
  say(COPY.check2.question);
  let feedback = null;
  choices(COPY.check2.choices, async (o, b, all) => {
    feedback?.remove();
    if (o === COPY.check2.intended) {
      all.forEach((x) => { x.disabled = true; });
      b.classList.add('picked');
      feedback = say(COPY.check2.right, 'feedback');
      await wait(reading(COPY.check2.right) + 700);
      step8();
    } else {
      b.disabled = true;
      b.classList.add('missed');
      feedback = say(COPY.check2.wrong, 'feedback');
      emphasize();
    }
  });
}

function showArrangement(k) {
  const spots = layout(k);
  for (const { id, x, y } of spots) {
    if (pieces.has(id)) place(pieces.get(id), x, y);
    else makePiece(id, { x, y }, { entering: !REDUCED }).outer.classList.add('prominent');
  }
  drawTotal(total(ARRANGEMENTS[k].rows.flat()));   // the same 0, computed from the pieces behind it
}

async function step8() {                       // the same 0, different arrangements behind it
  phase = 'arrangements';
  clear();
  const caption = say(COPY.arrangements[0], 'caption');
  showArrangement(0);
  await wait(2200);
  for (let k = 1; k < ARRANGEMENTS.length; k++) {
    caption.classList.remove('in');
    await wait(REDUCED ? 0 : 250);
    showArrangement(k);
    await wait(REDUCED ? 0 : 650);
    if (k < COPY.arrangements.length) {
      caption.textContent = COPY.arrangements[k];
      caption.classList.add('in');
    }
    await wait(2200);
  }
  step9();
}

async function step9() {
  phase = 'reveal';
  clear();
  say(COPY.reveal);
  await wait(reading(COPY.reveal) + 1800);
  phase = 'mri';
  clear();
  say(COPY.mri[0]);
  await wait(reading(COPY.mri[0]));
  say(COPY.mri[1]);
  await wait(reading(COPY.mri[1]) + 900);
  phase = 'final';
  clear();
  say(COPY.final, 'final');
}

// read-only view for automated checks (no learner-facing effect)
window.__try = { get state() { return state; }, get phase() { return phase; }, get shown() { return [...pieces.keys()]; } };

setLocked(true);
step1();
