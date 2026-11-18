// Interactive 01 (docs/prototype_try_spec.md, Revision 3). A short story inside an MRI scanner: slide in, zoom down to
// the water in the body and its hydrogen atoms, picture each proton as an arrow, pair opposite arrows until the TOTAL is
// an exact 0, watch the same 0 hold over different arrangements, then switch on the scanner's magnet, which tips the
// balance by one flipped arrow, and listen as it paints a picture.
// Every learner-facing line comes from copy.js; every position and every total comes from src/math (pieces.js,
// scanner.js).
import './try.css';   // system sans: its 0 is a plain 0

import { COPY } from './copy.js';
import {
  start, pair, dropTarget, tapTarget, totalOf, pairedCount, restingSpot, total, layout, segmentSpots, crowd, crowdDirections,
  ARRANGEMENTS, PAIRS, VIEW, PANEL, DROP, SEGMENT, CROWD, FIELD_LINES, FLIP, dirOf,
} from '../../math/pieces.js';
import { HOUSING, BORE, TUNNEL, COILS, TABLE, PEDESTAL, PATIENT, FLOOR, SLIDE, ZOOM, ATOM, molecules, hydrogenSpot, SCREEN, picture } from '../../math/scanner.js';

const NS = 'http://www.w3.org/2000/svg';
const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  e.append(...kids);
  return e;
};
const svg = (tag, attrs = {}, ...kids) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...kids);
  return e;
};
const wait = (ms) => new Promise((r) => setTimeout(r, REDUCED ? Math.min(ms, 1200) : ms));
const pause = (ms) => new Promise((r) => setTimeout(r, ms));          // reading time: the same with reduced motion
const reading = (text) => Math.min(4500, 900 + 40 * text.length);
const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
const on = (node, v = true) => node.classList.toggle('on', v);

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let state = start();
let phase = 'scanner';
let locked = true;
const dirs = {};                                   // current direction of every piece on the board

// ── page ─────────────────────────────────────────────────────────────────────────────────────────
const root = document.getElementById('lesson');
const figure = el('figure', { class: 'figure' });
const prompt = el('div', { class: 'prompt', 'aria-live': 'polite' });
root.append(figure, prompt);
const board = svg('svg', { viewBox: `0 0 ${VIEW.w} ${VIEW.h}`, class: 'board', role: 'group' });
figure.append(board);
const describe = (text) => board.setAttribute('aria-label', text);

// scene 1: the scanner, side view
const scanner = svg('g', { class: 'layer on' });
const zoomable = svg('g', { class: 'zoomable' });
const patient = svg('g', { class: 'patient' },
  svg('rect', { class: 'table', x: TABLE.x, y: TABLE.y, width: TABLE.w, height: TABLE.h, rx: TABLE.h / 2 }),
  svg('rect', { class: 'gown', x: PATIENT.body.x, y: PATIENT.body.y, width: PATIENT.body.w, height: PATIENT.body.h, rx: PATIENT.body.r }),
  svg('circle', { class: 'skin', cx: PATIENT.head.cx, cy: PATIENT.head.cy, r: PATIENT.head.r }));
const housing = svg('g', { class: 'housing' },
  svg('rect', { class: 'wall', x: HOUSING.x, y: HOUSING.y, width: HOUSING.w, height: HOUSING.h, rx: HOUSING.r }),
  svg('g', { class: 'coils' }, ...COILS.map((c) => svg('rect', { x: c.x, y: c.y, width: c.w, height: c.h, rx: c.w / 2 }))),
  svg('ellipse', { class: 'bore-face', cx: BORE.cx, cy: BORE.cy, rx: BORE.rx, ry: BORE.ry }),
  svg('ellipse', { class: 'bore-hole', cx: BORE.cx, cy: BORE.cy, rx: BORE.holeRx, ry: BORE.holeRy }));
zoomable.append(
  svg('line', { class: 'floor', x1: 20, x2: VIEW.w - 20, y1: FLOOR, y2: FLOOR }),
  svg('rect', { class: 'pedestal', x: PEDESTAL.x, y: PEDESTAL.y, width: PEDESTAL.w, height: PEDESTAL.h, rx: 8 }),
  svg('rect', { class: 'tunnel', x: TUNNEL.x, y: TUNNEL.y, width: TUNNEL.w, height: TUNNEL.h, rx: 20 }),
  patient, housing);
scanner.append(zoomable);

// the zoom: a disc of water that grows from the chest
const lens = svg('g', { class: 'lens layer' }, svg('circle', { r: 1 }));
const lensAt = (s) => { lens.style.transform = `translate(${ZOOM.x}px, ${ZOOM.y}px) scale(${s})`; };
lensAt(0.01);

// scene 2: water molecules
const water = svg('g', { class: 'water layer' });
molecules().forEach((m, k) => {
  const g = svg('g', { class: 'molecule', style: `animation-delay: ${-k * 1.7}s` });
  for (const h of m.h) g.append(svg('line', { class: 'bond', x1: m.o.x, y1: m.o.y, x2: h.x, y2: h.y }));
  g.append(svg('circle', { class: 'oxygen', cx: m.o.x, cy: m.o.y, r: ATOM.o }));
  for (const h of m.h) g.append(svg('circle', { class: 'hydrogen', cx: h.x, cy: h.y, r: ATOM.h }), svg('circle', { class: 'proton', cx: h.x, cy: h.y, r: 5 }));
  water.append(g);
});

// scene 3: the drop, the TOTAL, the pieces
const puzzle = svg('g', { class: 'puzzle layer' });
const drop = svg('rect', { class: 'drop', x: DROP.x, y: DROP.y, width: DROP.w, height: DROP.h, rx: DROP.r });
const field = svg('g', { class: 'field' });
for (const y of FIELD_LINES) {
  field.append(svg('path', { class: 'field-line', d: `M ${DROP.x + 18} ${y} H ${DROP.x + DROP.w - 26}` }),
    svg('path', { class: 'field-head', d: `M ${DROP.x + DROP.w - 30} ${y - 5} L ${DROP.x + DROP.w - 22} ${y} L ${DROP.x + DROP.w - 30} ${y + 5}` }));
}
const SHAPE = 'M -24 -6 H 4 V -12.5 L 29 0 L 4 12.5 V 6 H -24 A 6 6 0 0 1 -24 -6 Z';   // a rounded bar with a clear head
const slots = PAIRS.map(({ left }) => svg('g', { class: 'slot', style: `transform: translate(${left.x}px, ${left.y}px)` },
  svg('path', { d: SHAPE, transform: 'scale(-1 1)' })));
const pairZeros = PAIRS.map(({ zero }) => svg('text', { class: 'pair-zero', x: zero.x, y: zero.y, 'text-anchor': 'middle', 'dominant-baseline': 'central' }));
pairZeros.forEach((t) => { t.textContent = COPY.pairZero; });
const crowdZeros = svg('g', { class: 'crowd-zeros' });
const ring = svg('rect', { class: 'ring' });
puzzle.append(drop, field, ...slots, ...pairZeros, crowdZeros, ring);

const panel = svg('g', { class: 'panel layer' });
const label = svg('text', { class: 'total-label', x: PANEL.cx, y: PANEL.labelY, 'text-anchor': 'middle' });
label.textContent = COPY.totalLabel;
const segments = Array.from({ length: 3 }, () => svg('g', { class: 'segment' }, svg('path', { d: SHAPE })));
const number = svg('text', { class: 'total-number', x: PANEL.cx, y: PANEL.numberY, 'text-anchor': 'middle' });
const bigZero = svg('text', { class: 'total-zero', x: PANEL.cx, y: PANEL.cy + 4, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
bigZero.textContent = COPY.zero;
panel.append(svg('rect', { class: 'panel-box', x: PANEL.x, y: PANEL.y, width: PANEL.w, height: PANEL.h, rx: 18 }), label, ...segments, number, bigZero);

const screen = svg('g', { class: 'screen layer' }, svg('rect', { class: 'screen-box', x: SCREEN.x - 6, y: SCREEN.y - 6, width: SCREEN.size + 12, height: SCREEN.size + 12, rx: 14 }));
const piecesLayer = svg('g', { class: 'pieces' });
board.append(scanner, lens, water, puzzle, screen, panel, piecesLayer);

// ── pieces ───────────────────────────────────────────────────────────────────────────────────────
const pieces = new Map();
const mirror = (d) => `scale(${d > 0 ? 1 : -1}, 1)`;      // a left piece is the right piece mirrored, never rotated

function makePiece(id, at, { entering = false } = {}) {
  dirs[id] = dirOf(id);
  const outer = svg('g', { class: 'piece', 'data-id': id });
  const enter = svg('g', { class: `piece-enter${entering ? ' entering' : ''}` });
  const mid = svg('g', { class: 'piece-mid' });
  const inner = svg('g', { class: 'piece-inner', style: `transform: ${mirror(dirs[id])}` },
    svg('rect', { class: 'piece-hit', x: -42, y: -32, width: 84, height: 64 }), svg('path', { class: 'piece-shape', d: SHAPE }));
  mid.append(inner);
  enter.append(mid);
  outer.append(enter);
  piecesLayer.append(outer);
  const p = { id, outer, enter, mid, inner, x: at.x, y: at.y };
  pieces.set(id, p);
  place(p, at.x, at.y, false);
  if (entering) frame().then(() => enter.classList.remove('entering'));
  return p;
}

function place(p, x, y, motion = 'moving') {
  p.x = x;
  p.y = y;
  p.outer.classList.remove('moving', 'gliding');
  if (motion && !REDUCED) p.outer.classList.add(motion);
  p.outer.style.transform = `translate(${x}px, ${y}px)`;
}

// the TOTAL: |value| small arrows joined tip to tail, the count under them; a large 0 when they are all gone
function drawTotal(value) {
  const spots = segmentSpots(value);
  segments.forEach((g, i) => {
    const show = i < spots.length;
    g.classList.toggle('show', show);
    if (show) g.style.transform = `translate(${spots[i].x}px, ${spots[i].y}px) scale(${Math.sign(value) * SEGMENT.scale}, ${SEGMENT.scale})`;
  });
  number.textContent = value === 0 ? '' : String(Math.abs(value));
  panel.classList.toggle('is-zero', value === 0);
  panel.setAttribute('aria-label', value === 0 ? `${COPY.totalLabel}: ${COPY.zero}` : `${COPY.totalLabel}: ${Math.abs(value)} arrows pointing ${value > 0 ? 'right' : 'left'}`);
}

// ── pairing: drag or tap a waiting ← ──────────────────────────────────────────────────────────────
let hintsOff = false;
let hintTimer = null;
let afterPair = () => {};

function toSvg(e) {
  const pt = board.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(board.getScreenCTM().inverse());
}

function settle(id, p) {
  const piece = pieces.get(id);
  if (p === null) { const home = restingSpot(id); place(piece, home.x, home.y); return; }
  hintsOff = true;
  clearTimeout(hintTimer);
  state = pair(state, id, p);
  const spot = PAIRS[p].left;
  place(piece, spot.x, spot.y);
  slots[p].classList.add('filled');
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
  clearTimeout(hintTimer);
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
    place(piece, q.x - dx, q.y - dy, null);
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
// focus follows the story only for keyboard users (a mouse or touch user never sees a focus ring appear on its own)
let keyboardUser = false;
addEventListener('keydown', (e) => { if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') keyboardUser = true; }, true);
addEventListener('pointerdown', () => { keyboardUser = false; }, true);
const followFocus = (target) => {
  if (keyboardUser && (figure.contains(document.activeElement) || prompt.contains(document.activeElement) || document.activeElement === document.body)) target.focus({ preventScroll: true });
};

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

// ── the story ────────────────────────────────────────────────────────────────────────────────────
async function scene1() {                                   // the scanner
  describe('An MRI scanner, seen from the side, with a person lying on its table.');
  requestAnimationFrame(() => figure.classList.add('in'));
  say(COPY.scanner[0], 'lead');
  await pause(reading(COPY.scanner[0]));
  say(COPY.scanner[1]);
  await pause(reading(COPY.scanner[1]));
  say(COPY.opening);
  button(COPY.slideIn, scene2);
}

async function scene2() {                                   // slide in; the magnet around you
  phase = 'inside';
  clear();
  patient.style.transform = `translateX(${SLIDE}px)`;
  await wait(1500);
  scanner.classList.add('cutaway');
  describe('The person is inside the scanner. The wall is see-through: rings of magnet coils surround them.');
  say(COPY.inside);
  await wait(900);
  button(COPY.zoomIn, scene3);
}

async function scene3() {                                   // zoom into the water
  phase = 'water';
  clear();
  zoomable.style.transform = `translate(${ZOOM.x}px, ${ZOOM.y}px) scale(${ZOOM.scale}) translate(${-ZOOM.x}px, ${-ZOOM.y}px)`;
  on(lens);
  await frame();
  lensAt(520);
  await wait(1000);
  on(scanner, false);
  on(water);
  describe('Three water molecules, each one large atom joined to two small hydrogen atoms.');
  say(COPY.water[0], 'lead');
  await pause(reading(COPY.water[0]));
  say(COPY.water[1]);
  await wait(700);
  button(COPY.closer, scene4);
}

async function scene4() {                                   // protons become arrows
  phase = 'protons';
  clear();
  water.classList.add('protons');
  say(COPY.proton[0]);
  await pause(reading(COPY.proton[0]));
  water.classList.add('still');
  say(COPY.proton[1]);
  for (const id of ['R0', 'L1', 'L0', 'R1', 'R2', 'L2']) {
    makePiece(id, hydrogenSpot(id), { entering: true });
    await wait(160);
  }
  describe('Each hydrogen atom now carries an arrow: some point right, some point left.');
  await pause(reading(COPY.proton[1]) + 600);
  scene5();
}

async function scene5() {                                   // the drop and its TOTAL
  phase = 'setup';
  clear();
  on(water, false);
  on(lens, false);
  on(puzzle);
  for (const id of [...state.row, ...state.waiting]) { const s = restingSpot(id); place(pieces.get(id), s.x, s.y, 'gliding'); }
  await wait(1000);
  on(panel);
  await wait(400);
  for (let k = 0; k < state.row.length; k++) {               // the TOTAL is built from the arrows in the drop
    const from = restingSpot(state.row[k]);
    const to = segmentSpots(k + 1)[k];
    const ghost = svg('g', { class: 'ghost', style: `transform: translate(${from.x}px, ${from.y}px)` }, svg('path', { d: SHAPE }));
    piecesLayer.append(ghost);
    await frame();
    ghost.style.transform = `translate(${to.x}px, ${to.y}px) scale(${SEGMENT.scale})`;
    await wait(480);
    ghost.remove();
    drawTotal(k + 1);
    await wait(220);
  }
  describe('A drop holding three right arrows; three left arrows wait below it. The TOTAL above the drop shows three right arrows joined: 3.');
  say(COPY.hook);
  await pause(reading(COPY.hook));
  play();
}

function play() {
  phase = 'play';
  for (const id of state.waiting) {
    const p = pieces.get(id);
    p.outer.classList.add('waiting', 'nudge');
    p.outer.setAttribute('tabindex', '0');
    p.outer.setAttribute('role', 'button');
    p.outer.setAttribute('aria-label', 'Left arrow');
    p.outer.addEventListener('pointerdown', (e) => startDrag(e, id));
    p.outer.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !locked && state.waiting.includes(id)) { e.preventDefault(); settle(id, tapTarget(state, id)); }
    });
  }
  slots.forEach((s) => on(s));
  say(COPY.task);
  setLocked(false);
  followFocus(pieces.get(state.waiting[0]).outer);
  armHint(0);
}

function armHint(count) {                                   // if nothing has moved for a while, show the move once
  clearTimeout(hintTimer);
  hintTimer = setTimeout(async () => {
    if (hintsOff || locked || !state.waiting.length) return;
    if (count === 0) say(COPY.hint, 'hint');
    const id = state.waiting[0];
    const from = restingSpot(id);
    const to = PAIRS[tapTarget(state, id)].left;
    const ghost = svg('g', { class: 'ghost hint-ghost', style: `transform: translate(${from.x}px, ${from.y}px) scale(-1, 1)` }, svg('path', { d: SHAPE }));
    piecesLayer.append(ghost);
    await frame();
    ghost.style.transform = `translate(${to.x}px, ${to.y}px) scale(-1, 1)`;
    await wait(900);
    ghost.classList.add('gone');
    await wait(400);
    ghost.remove();
    if (count < 1) armHint(count + 1);
  }, 6000);
}

afterPair = () => {
  if (phase === 'play' && pairedCount(state) === 2) checkpoint1();
  else if (phase === 'play2' && totalOf(state) === 0) reachZero();
};

async function checkpoint1() {                              // midway checkpoint
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
    if (next) followFocus(pieces.get(next).outer);
  });
}

async function reachZero() {                                // reaching 0
  phase = 'zero';
  setLocked(true);
  await wait(1400);
  clear();
  say(COPY.reached[0]);
  await pause(reading(COPY.reached[0]));
  say(COPY.reached[1]);
  button(COPY.lookCloser, checkpoint2);
}

function emphasize() {
  for (const p of pieces.values()) {
    p.outer.classList.remove('prominent');
    void p.outer.getBoundingClientRect();     // restart the emphasis
    p.outer.classList.add('prominent');
  }
}

function checkpoint2() {                                    // second checkpoint
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
      await pause(reading(COPY.check2.right) + 500);
      clear();
      say(COPY.answer);
      await pause(reading(COPY.answer) + 400);
      arrangements();
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

async function arrangements() {                             // the same 0, different arrangements behind it
  phase = 'arrangements';
  clear();
  say(COPY.shuffle);
  await pause(reading(COPY.shuffle));
  clear();
  const caption = say(COPY.arrangements[0], 'caption');
  showArrangement(0);
  await pause(2200);
  for (let k = 1; k < ARRANGEMENTS.length; k++) {
    caption.classList.remove('in');
    await wait(250);
    showArrangement(k);
    await wait(650);
    if (k < COPY.arrangements.length) {
      caption.textContent = COPY.arrangements[k];
      caption.classList.add('in');
    }
    await pause(2200);
  }
  phase = 'reveal';
  clear();
  say(COPY.reveal);
  await pause(reading(COPY.reveal) + 1800);
  magnet();
}

async function magnet() {                                   // many more pairs, all cancelled: the total is still 0
  phase = 'magnet';
  clear();
  board.style.setProperty('--s', String(CROWD.scale));
  for (const p of crowd()) {
    for (const end of [p.left, p.right]) {
      if (pieces.has(end.id)) place(pieces.get(end.id), end.x, end.y);
      else makePiece(end.id, end, { entering: !REDUCED });
    }
    const z = svg('text', { class: 'crowd-zero', x: p.zero.x, y: p.zero.y, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'data-k': p.k });
    z.textContent = COPY.pairZero;
    crowdZeros.append(z);
  }
  for (const p of pieces.values()) p.outer.classList.remove('prominent');
  drawTotal(total(Object.values(crowdDirections(false))));
  await wait(700);
  crowdZeros.classList.add('show');
  describe('Fifteen pairs of opposite arrows in the drop, each pair cancelled. The TOTAL is 0.');
  say(COPY.magnetQuestion);
  await wait(600);
  button(COPY.switchOn, magnetOn);
}

async function magnetOn() {                                 // the magnet tips the balance by one flipped arrow
  phase = 'magnet-on';
  clear();
  on(field);
  say(COPY.magnet[0]);
  await pause(reading(COPY.magnet[0]));
  const now = crowdDirections(true);
  const flipped = pieces.get(FLIP);
  dirs[FLIP] = now[FLIP];
  flipped.inner.style.transform = mirror(dirs[FLIP]);
  const pairOf = crowd().find((p) => p.left.id === FLIP);
  crowdZeros.querySelector(`[data-k="${pairOf.k}"]`).classList.add('off');
  ring.setAttribute('x', pairOf.cx - 58);
  ring.setAttribute('y', pairOf.y - 21);
  ring.setAttribute('width', 116);
  ring.setAttribute('height', 42);
  ring.setAttribute('rx', 21);
  on(ring);
  drawTotal(total(Object.values(now)));
  describe('With the magnet on, one left arrow has turned to point right. Its pair no longer cancels. The TOTAL is 2.');
  say(COPY.magnet[1]);
  await pause(reading(COPY.magnet[1]) + 600);
  clear();
  say(COPY.magnet[2]);
  await pause(reading(COPY.magnet[2]));
  say(COPY.magnet[3]);
  await wait(500);
  button(COPY.listen, paint);
}

async function paint() {                                    // the scanner paints its picture
  phase = 'picture';
  clear();
  piecesLayer.classList.add('away');
  crowdZeros.classList.remove('show');
  on(ring, false);
  on(field, false);
  on(puzzle, false);
  on(screen);
  describe('A picture of a head, painted row by row in shades of grey, like an MRI image.');
  const cells = picture();
  const rows = SCREEN.n;
  for (let j = 0; j < rows; j++) {
    for (const c of cells.slice(j * rows, (j + 1) * rows)) {
      const v = Math.round(c.g * 255);
      screen.append(svg('rect', { x: c.x.toFixed(2), y: c.y.toFixed(2), width: (c.size + 0.4).toFixed(2), height: (c.size + 0.4).toFixed(2), fill: `rgb(${v},${v},${v})` }));
    }
    if (!REDUCED) await pause(45);
  }
  say(COPY.picture);
  await pause(reading(COPY.picture) + 600);
  phase = 'closing';
  clear();
  say(COPY.closing[0], 'lead');
  await pause(reading(COPY.closing[0]));
  say(COPY.closing[1]);
  await pause(reading(COPY.closing[1]) + 900);
  phase = 'final';
  clear();
  say(COPY.final, 'final');
}

// read-only view for automated checks (no learner-facing effect)
window.__try = { get state() { return state; }, get phase() { return phase; }, get shown() { return [...pieces.keys()]; }, get dirs() { return { ...dirs }; } };

setLocked(true);
scene1();
