// One Mathigon-style step (docs/prototype_try_spec.md). The learner turns needles; the centre shows their total.
// Every learner-facing line comes from copy.js; every position and the total come from src/math/needles.js.
import './try.css';   // system sans: its 0 is a plain 0 (the project font draws a slashed zero, which reads as ∅)

import { COPY } from './copy.js';
import { createState, turn, total, pairs, pairedCount, contributions, rad, deg, wrap, angleGap, RELEASE } from '../../math/needles.js';

const NS = 'http://www.w3.org/2000/svg';
const S = 460;            // viewBox size
const C = S / 2;          // centre
const R = 148;            // ring of needle pivots
const L = 38;             // half-length of a needle
const W = 7;              // half-width of a needle at its pivot
const SCALE = 34;         // px per unit of total
const MAX_ARROW = 106;    // keep the total inside the ring
const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

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
const reading = (text) => Math.min(4200, 700 + 38 * text.length);
// screen coordinates (y down) of a point at angle a (math convention, y up) and distance d from (x, y)
const at = (x, y, a, d) => [x + d * Math.cos(a), y - d * Math.sin(a)];
const slot = (i) => at(C, C, rad(90 + 60 * i), R);

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let state = createState();
const shown = state.theta.slice();      // drawn angles (equal to state.theta except during a snap)
let locked = true;
let phase = 'intro';
let drag = null;

// ── layout ───────────────────────────────────────────────────────────────────────────────────────
const root = document.getElementById('lesson');
const intro = el('section', { class: 'intro' });
const figure = el('figure', { class: 'figure', hidden: '' });
const flow = el('div', { class: 'flow', 'aria-live': 'polite' });
root.append(intro, figure, flow);

const board = svg('svg', { viewBox: `0 0 ${S} ${S}`, class: 'board', role: 'group', 'aria-label': 'Needles' });
const arcs = svg('g', { class: 'arcs' });
const totalG = svg('g', { class: 'total', role: 'img' });
const arrowLine = svg('line', { class: 'total-line', x1: C, y1: C, x2: C, y2: C });
const arrowHead = svg('polygon', { class: 'total-head' });
const origin = svg('circle', { class: 'total-origin', cx: C, cy: C, r: 4 });
const zeroText = svg('text', { class: 'total-zero', x: C, y: C, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
zeroText.textContent = COPY.zero;
totalG.append(arrowLine, arrowHead, origin, zeroText);
board.append(arcs, totalG);
figure.append(board);

const needles = state.theta.map((_, i) => {
  const [px, py] = slot(i);
  const g = svg('g', { class: 'needle', tabindex: '0', role: 'slider', 'aria-label': `Needle ${i + 1}`, 'aria-valuemin': '0', 'aria-valuemax': '359' });
  const ring = svg('circle', { class: 'needle-ring', cx: px, cy: py, r: L + 9 });
  const hit = svg('circle', { class: 'needle-hit', cx: px, cy: py, r: L + 10 });
  const north = svg('polygon', { class: 'needle-north' });
  const south = svg('polygon', { class: 'needle-south' });
  const pivot = svg('circle', { class: 'needle-pivot', cx: px, cy: py, r: 3.2 });
  g.append(ring, hit, south, north, pivot);
  board.append(g);
  g.addEventListener('pointerdown', (e) => startDrag(e, i));
  g.addEventListener('keydown', (e) => keyTurn(e, i));
  return { g, north, south, px, py };
});

// ── drawing ──────────────────────────────────────────────────────────────────────────────────────
function drawNeedle(i) {
  const { north, south, px, py, g } = needles[i];
  const a = shown[i];
  const tip = at(px, py, a, L);
  const tail = at(px, py, a + Math.PI, L);
  const left = at(px, py, a + Math.PI / 2, W);
  const right = at(px, py, a - Math.PI / 2, W);
  north.setAttribute('points', [tip, left, [px, py], right].map((p) => p.join(',')).join(' '));
  south.setAttribute('points', [tail, left, [px, py], right].map((p) => p.join(',')).join(' '));
  g.setAttribute('aria-valuenow', String(Math.round(deg(wrap(state.theta[i]))) % 360));
  g.setAttribute('aria-valuetext', `pointing ${Math.round(deg(wrap(state.theta[i]))) % 360} degrees`);
}

function arcPath(i, j, r) {
  const a = rad(90 + 60 * i);
  const b = rad(90 + 60 * j);
  let d = wrap(b - a);
  const ccw = d <= Math.PI;                     // go the short way round
  if (!ccw) d = Math.PI * 2 - d;
  const [x1, y1] = at(C, C, a, r);
  const [x2, y2] = at(C, C, b, r);
  return `M${x1},${y1} A${r},${r} 0 0 ${ccw ? 0 : 1} ${x2},${y2}`;
}

function drawArcs() {
  arcs.replaceChildren(...pairs(state).map(([i, j], k) => svg('path', { class: 'arc', d: arcPath(i, j, R + L + 12 + 8 * k) })));
}

function drawTotal() {
  const t = total(state);
  if (t.exactZero) {
    totalG.classList.add('is-zero');
    totalG.setAttribute('aria-label', `Total: ${COPY.zero}`);
    return;
  }
  totalG.classList.remove('is-zero');
  totalG.setAttribute('aria-label', 'Total: an arrow');
  const len = Math.max(8, Math.min(MAX_ARROW, t.length * SCALE));   // never drawn as nothing unless exactly zero
  const a = Math.atan2(t.y, t.x);
  const [x2, y2] = at(C, C, a, len);
  const [bx, by] = at(C, C, a, len - 11);
  const l = at(bx, by, a + Math.PI / 2, 6);
  const r = at(bx, by, a - Math.PI / 2, 6);
  const [lx, ly] = at(C, C, a, len - 9);
  arrowLine.setAttribute('x2', lx);
  arrowLine.setAttribute('y2', ly);
  arrowHead.setAttribute('points', [[x2, y2], l, r].map((p) => p.join(',')).join(' '));
}

function draw() {
  needles.forEach((_, i) => drawNeedle(i));
  drawArcs();
  drawTotal();
}

// a short snap: the drawn angle eases to the exact opposite
function snapTo(i, target) {
  const from = shown[i];
  let d = wrap(target - from);
  if (d > Math.PI) d -= Math.PI * 2;
  if (REDUCED || Math.abs(d) < 1e-9) { shown[i] = target; draw(); return; }
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / 140);
    shown[i] = from + d * (1 - (1 - p) ** 3);
    draw();
    if (p < 1 && state.partner[i] !== null) requestAnimationFrame(step);
    else if (state.partner[i] !== null) { shown[i] = target; draw(); }
  };
  requestAnimationFrame(step);
}

function apply(i, a) {
  const before = state.partner[i];
  state = turn(state, i, a);
  state.theta.forEach((t, k) => { if (k !== i) shown[k] = t; });
  if (state.partner[i] !== null && before === null) snapTo(i, state.theta[i]);
  else { shown[i] = state.theta[i]; draw(); }
}

// ── input ────────────────────────────────────────────────────────────────────────────────────────
function pointerAngle(e, i) {
  const p = board.createSVGPoint();
  p.x = e.clientX;
  p.y = e.clientY;
  const q = p.matrixTransform(board.getScreenCTM().inverse());
  return Math.atan2(-(q.y - needles[i].py), q.x - needles[i].px);
}

function startDrag(e, i) {
  if (locked) return;
  e.preventDefault();
  needles[i].g.setPointerCapture(e.pointerId);
  needles[i].g.classList.add('is-dragging');
  drag = { i, offset: pointerAngle(e, i) - state.theta[i] };
  const move = (ev) => apply(i, pointerAngle(ev, i) - drag.offset);
  const end = () => {
    needles[i].g.classList.remove('is-dragging');
    needles[i].g.removeEventListener('pointermove', move);
    needles[i].g.removeEventListener('pointerup', end);
    needles[i].g.removeEventListener('pointercancel', end);
    drag = null;
    afterInteraction();
  };
  needles[i].g.addEventListener('pointermove', move);
  needles[i].g.addEventListener('pointerup', end);
  needles[i].g.addEventListener('pointercancel', end);
}

function keyTurn(e, i) {
  if (locked) return;
  const dir = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
  if (!dir) return;
  e.preventDefault();
  const step = state.partner[i] !== null ? RELEASE + rad(1) : rad(15);   // a paired needle needs a full step to leave its pair
  apply(i, state.theta[i] + dir * step);
  afterInteraction();
}

function setLocked(v) {
  locked = v;
  figure.classList.toggle('is-locked', v);
  needles.forEach(({ g }) => g.setAttribute('aria-disabled', String(v)));
}

// ── the flow ─────────────────────────────────────────────────────────────────────────────────────
function line(text, cls = '') {
  const p = el('p', { class: `line ${cls}`.trim(), text });
  flow.append(p);
  if (!REDUCED) requestAnimationFrame(() => p.classList.add('in'));
  else p.classList.add('in');
  p.scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' });
  return p;
}

function choices(options, onPick) {
  const row = el('div', { class: 'choices' });
  const buttons = options.map((o) => {
    const b = el('button', { type: 'button', class: 'choice', text: o });
    b.addEventListener('click', () => onPick(o, b, buttons));
    return b;
  });
  row.append(...buttons);
  flow.append(row);
  followFocus(buttons[0]);
  requestAnimationFrame(() => row.classList.add('in'));
  row.scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' });
  return row;
}

function button(text, onClick) {
  const b = el('button', { type: 'button', class: 'action', text });
  b.addEventListener('click', () => { b.remove(); onClick(); }, { once: true });
  flow.append(b);
  followFocus(b);
  requestAnimationFrame(() => b.classList.add('in'));
  b.scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' });
  return b;
}

// a keyboard user working the needles is taken to the new control; a pointer user is left where they are
const followFocus = (target) => { if (figure.contains(document.activeElement)) target.focus({ preventScroll: true }); };

const settle = () => flow.querySelectorAll('.line').forEach((p) => p.classList.add('past'));

async function step1() {
  intro.append(el('p', { class: 'line lead in', text: COPY.step1[0] }));
  await wait(900);
  const p = el('p', { class: 'line lead', text: COPY.step1[1] });
  const start = el('button', { type: 'button', class: 'action', text: COPY.start });
  intro.append(p, start);
  requestAnimationFrame(() => { p.classList.add('in'); start.classList.add('in'); });
  start.addEventListener('click', () => { start.remove(); step2(); }, { once: true });
}

function step2() {
  phase = 'play';
  figure.hidden = false;
  draw();
  requestAnimationFrame(() => figure.classList.add('in'));
  line(COPY.step2);
  figure.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' });
  setLocked(false);
}

async function step3() {
  phase = 'ask3';
  setLocked(true);
  await wait(600);
  settle();
  line(COPY.step3.question);
  choices(COPY.step3.choices, (o, b, all) => {
    all.forEach((x) => { x.disabled = true; });
    b.classList.add('picked');
    line(COPY.step3.after);
    phase = 'play2';
    setLocked(false);
  });
}

async function step4() {
  phase = 'zero';
  setLocked(true);
  await wait(1300);
  settle();
  line(COPY.step4[0]);
  await wait(reading(COPY.step4[0]));
  line(COPY.step4[1]);
  button(COPY.lookCloser, step5);
}

async function emphasize() {
  for (const { g } of needles) {
    g.classList.remove('emphasis');
    void g.getBoundingClientRect();   // restart the ring animation
    g.classList.add('emphasis');
    await wait(REDUCED ? 0 : 140);
  }
}

async function step5() {
  phase = 'look';
  settle();
  await emphasize();
  await wait(700);
  line(COPY.step5.question);
  let feedback = null;
  choices(COPY.step5.options, async (o, b, all) => {
    feedback?.remove();
    if (o === COPY.step5.intended) {
      all.forEach((x) => { x.disabled = true; });
      b.classList.add('picked');
      feedback = line(COPY.step5.right, 'feedback');
      await wait(reading(COPY.step5.right) + 600);
      step6();
    } else {
      b.disabled = true;
      b.classList.add('missed');
      feedback = line(COPY.step5.wrong, 'feedback');
      emphasize();
    }
  });
}

async function step6() {
  phase = 'mri';
  settle();
  const a = line(COPY.step6[0], 'mri');
  await wait(reading(COPY.step6[0]));
  const b = line(COPY.step6[1], 'mri');
  await wait(reading(COPY.step6[1]) + 400);
  step7([a, b]);
}

async function step7(mriLines) {
  phase = 'end';
  mriLines.forEach((p) => p.classList.add('receded'));
  settle();
  emphasize();                      // attention back on the pieces and their 0
  line(COPY.step7[0], 'return');
  await wait(reading(COPY.step7[0]));
  line(COPY.step7[1], 'return');
  await wait(reading(COPY.step7[1]));
  line(COPY.step7[2], 'return final');
}

function afterInteraction() {
  if (phase === 'play' && pairedCount(state) >= 2) step3();
  else if (phase === 'play2' && total(state).exactZero) step4();
}

// expose a read-only view for automated checks (no learner-facing effect)
window.__try = { get state() { return state; }, get phase() { return phase; }, contributions: () => contributions(state), angleGap };

setLocked(true);
step1();
