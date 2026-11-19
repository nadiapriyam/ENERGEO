// Level 2, "Inside the scanner" (docs/levels_spec.md; history in docs/prototype_try_spec.md). A short story inside an
// MRI scanner: slide in, zoom down to the water in the body and its hydrogen atoms, whose protons are tiny magnets (N and
// S), picture each as an arrow, and add the arrows up in the TOTAL SIGNAL, all a scanner can pick up. Pair opposite
// arrows until the signal is an exact 0; look behind more 0s and find them full. Then the scanner's magnet tips the
// balance, turning the 0 into a small signal it can read, though the 0 held far more. It paints a picture; an eye sees
// one picture that hides far more than it seems; and the violin of Level 1 turns out to work the same way. Every
// learner-facing line comes from copyMri.js; every position and every total from src/math (pieces.js, scanner.js,
// tones.js).
import './mri.css';   // system sans: its 0 is a plain 0

import { COPY } from './copyMri.js';
import {
  start, pair, dropTarget, tapTarget, totalOf, pairedCount, restingSpot, total, layout, puzzleGroups, frame, sumLayout, crowd, crowdDirections,
  ARRANGEMENTS, PAIRS, VIEW, PANEL, DROP, CROWD, CROWD_SHOWN, FIELD_LINES, FIELD_SPAN, FLIP, dirOf,
} from '../math/pieces.js';
import {
  HOUSING, BORE, TUNNEL, COILS, TABLE, PEDESTAL, PATIENT, FLOOR, SLIDE, ZOOM, ATOM, molecules, hydrogenSpot, SCREEN, picture,
  PICTURE_SHIFT, EYE, SEEN, eyeFeeds, seenTransform, COMPARE,
} from '../math/scanner.js';
import { A_NOTE, STEPS as NOTE_STEPS, part, wave } from '../math/tones.js';

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
  for (const [k, v] of Object.entries(attrs)) if (v != null) k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  e.append(...kids);
  return e;
};
const label = (attrs, text) => svg('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', ...attrs, text });
const wait = (ms) => new Promise((r) => setTimeout(r, REDUCED ? Math.min(ms, 1200) : ms));
const pause = (ms) => new Promise((r) => setTimeout(r, ms));          // reading time: the same with reduced motion
const reading = (text) => Math.min(4500, 900 + 40 * text.length);
const frameTick = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
const on = (node, v = true) => node.classList.toggle('on', v);

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let state = start();
let phase = 'scanner';
let locked = true;
const dirs = {};                                   // current direction of every piece on the board

// ── page ─────────────────────────────────────────────────────────────────────────────────────────
const root = document.getElementById('mri-lesson');
const figure = el('figure', { class: 'figure' });
const prompt = el('div', { class: 'prompt', 'aria-live': 'polite' });
root.append(figure, prompt);
const board = svg('svg', { viewBox: `0 0 ${VIEW.w} ${VIEW.h}`, class: 'board', role: 'group' });
figure.append(board);
const describe = (text) => board.setAttribute('aria-label', text);

// the magnet shapes: an arrow is an upright bar magnet with a pointed N end; a proton is a ball with an N half on top
// and an S half underneath. A down-pointing one is the up-pointing one mirrored (never rotated); its letters are
// placed, never mirrored.
const S_PART = 'M -10 9 H 10 V 20 A 10 10 0 0 1 -10 20 Z';
const N_PART = 'M -10 9 V -12 H -15 L 0 -31 L 15 -12 H 10 V 9 Z';
const LETTER = { s: 19, n: -1 };
const mirror = (d) => `scale(1, ${d > 0 ? 1 : -1})`;
const glyph = (cls = 'glyph') => svg('g', { class: cls }, svg('path', { class: 's-part', d: S_PART }), svg('path', { class: 'n-part', d: N_PART }));
const R = ATOM.proton;
const ball = (d) => svg('g', { class: 'ball' },
  svg('g', { style: `transform: ${mirror(d)}` },
    svg('path', { class: 's-part', d: `M ${-R} 0 A ${R} ${R} 0 0 0 ${R} 0 Z` }),
    svg('path', { class: 'n-part', d: `M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0 Z` })),
  label({ class: 'pole s', x: 0, y: d * R * 0.5 + 0.5 }, COPY.poles.s),
  label({ class: 'pole n', x: 0, y: -d * R * 0.5 + 0.5 }, COPY.poles.n));

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

// scene 2: water molecules; each hydrogen atom has a proton at its heart, a tiny magnet
const water = svg('g', { class: 'water layer' });
molecules().forEach((m, k) => {
  const g = svg('g', { class: 'molecule', style: `animation-delay: ${-k * 1.7}s` });
  for (const h of m.h) g.append(svg('line', { class: 'bond', x1: m.o.x, y1: m.o.y, x2: h.x, y2: h.y }));
  g.append(svg('circle', { class: 'oxygen', cx: m.o.x, cy: m.o.y, r: ATOM.o }), label({ class: 'atom-letter o', x: m.o.x, y: m.o.y + 1 }, COPY.atoms.o));
  for (const h of m.h) {
    const b = ball(dirOf(h.id));
    b.style.transform = `translate(${h.x}px, ${h.y}px)`;
    g.append(svg('circle', { class: 'hydrogen', cx: h.x, cy: h.y, r: ATOM.h }), label({ class: 'atom-letter h', x: h.x, y: h.y + 1 }, COPY.atoms.h), b);
  }
  water.append(g);
});

// scene 3: the drop, its groups, the TOTAL
const puzzle = svg('g', { class: 'puzzle layer' });
const drop = svg('rect', { class: 'drop', x: DROP.x, y: DROP.y, width: DROP.w, height: DROP.h, rx: DROP.r });
const field = svg('g', { class: 'field' });
for (const x of FIELD_LINES) {                               // the magnet's field, pointing up
  field.append(svg('path', { class: 'field-line', d: `M ${x} ${FIELD_SPAN.bottom} V ${FIELD_SPAN.top + 4}` }),
    svg('path', { class: 'field-head', d: `M ${x - 5} ${FIELD_SPAN.top + 8} L ${x} ${FIELD_SPAN.top} L ${x + 5} ${FIELD_SPAN.top + 8}` }));
}
const slots = PAIRS.map(({ down }) => { const g = glyph('slot'); g.style.transform = `translate(${down.x}px, ${down.y}px) ${mirror(-1)}`; return g; });
const frames = svg('g', { class: 'frames' });
puzzle.append(drop, field, frames, ...slots);

// the TOTAL: the arrows in the drop, added up, and what they add up to
const panel = svg('g', { class: 'panel layer' });
const sumRow = svg('g', { class: 'sum' });
const sumMarks = svg('g', { class: 'sum-marks' });
const result = label({ class: 'result', x: PANEL.cx, y: PANEL.resultY }, '');
panel.append(svg('rect', { class: 'panel-box', x: PANEL.x, y: PANEL.y, width: PANEL.w, height: PANEL.h, rx: 18 }),
  label({ class: 'total-label', x: PANEL.cx, y: PANEL.labelY }, COPY.totalLabel), sumMarks, sumRow, result);

const cover = svg('g', { class: 'cover' },
  svg('rect', { x: DROP.x, y: DROP.y, width: DROP.w, height: DROP.h, rx: DROP.r }),
  label({ class: 'cover-mark', x: DROP.x + DROP.w / 2, y: DROP.y + DROP.h / 2 }, COPY.cover.mark));
const screen = svg('g', { class: 'screen layer', id: 'mri-screen' }, svg('rect', { class: 'screen-box', x: SCREEN.x - 6, y: SCREEN.y - 6, width: SCREEN.size + 12, height: SCREEN.size + 12, rx: 14 }));
const screenShift = svg('g', { class: 'screen-shift' }, screen);

// the eye: lines from the picture into an eye; what it sees is one picture
const seen = seenTransform();
const eyeScene = svg('g', { class: 'eye-scene layer' },
  ...eyeFeeds().map((f) => svg('path', { class: 'eye-feed', d: `M ${f.from.x.toFixed(1)} ${f.from.y.toFixed(1)} Q ${((f.from.x + f.to.x) / 2 + 24).toFixed(1)} ${f.from.y.toFixed(1)} ${f.to.x.toFixed(1)} ${f.to.y.toFixed(1)}` })),
  svg('g', { class: 'eyeball', style: `transform: translate(${EYE.x}px, ${EYE.y}px)` },
    svg('path', { class: 'eye-white', d: `M ${-EYE.rx} 0 Q 0 ${-EYE.ry * 2} ${EYE.rx} 0 Q 0 ${EYE.ry * 2} ${-EYE.rx} 0 Z` }),
    svg('circle', { class: 'iris', cx: EYE.look, cy: 0, r: EYE.iris }),
    svg('circle', { class: 'pupil', cx: EYE.look, cy: 0, r: EYE.iris * 0.45 }),
    svg('circle', { class: 'glint', cx: EYE.look + 3, cy: -4, r: 2.4 })),
  svg('path', { class: 'seen-arrow', d: `M ${EYE.x + EYE.rx + 8} ${EYE.y} H ${SEEN.x - 10} M ${SEEN.x - 18} ${EYE.y - 6} L ${SEEN.x - 10} ${EYE.y} L ${SEEN.x - 18} ${EYE.y + 6}` }),
  svg('g', { class: 'seen', transform: `translate(${seen.tx.toFixed(2)} ${seen.ty.toFixed(2)}) scale(${seen.s.toFixed(4)})` }, svg('use', { href: '#mri-screen' })),
  svg('text', { class: 'seen-label', x: SEEN.label.x, y: SEEN.label.y, 'text-anchor': 'middle' }));
eyeScene.querySelector('.seen-label').textContent = COPY.eye.label;

// side by side with Level 1
const compareLayer = svg('g', { class: 'compare layer' });
const piecesLayer = svg('g', { class: 'pieces' });
board.append(scanner, lens, water, puzzle, screenShift, eyeScene, panel, piecesLayer, cover, compareLayer);

// ── pieces ───────────────────────────────────────────────────────────────────────────────────────
const pieces = new Map();

function makePiece(id, at, { entering = false } = {}) {
  dirs[id] = dirOf(id);
  const outer = svg('g', { class: 'piece', 'data-id': id });
  const enter = svg('g', { class: `piece-enter${entering ? ' entering' : ''}` });
  const mid = svg('g', { class: 'piece-mid' });
  const inner = svg('g', { class: 'piece-inner', style: `transform: ${mirror(dirs[id])}` }, svg('rect', { class: 'piece-hit', x: -30, y: -42, width: 60, height: 84 }), glyph('piece-shape'));
  const s = label({ class: 'pole s' }, COPY.poles.s);
  const n = label({ class: 'pole n' }, COPY.poles.n);
  const letters = svg('g', { class: 'poles' }, s, n);
  mid.append(inner, letters);
  enter.append(mid);
  outer.append(enter);
  piecesLayer.append(outer);
  const p = { id, outer, enter, mid, inner, letters, s, n, x: at.x, y: at.y };
  setLetters(p);
  pieces.set(id, p);
  place(p, at.x, at.y, false);
  if (entering) frameTick().then(() => enter.classList.remove('entering'));
  return p;
}
function setLetters(p) {
  const d = dirs[p.id];
  p.s.setAttribute('x', 0);
  p.n.setAttribute('x', 0);
  p.s.setAttribute('y', d * LETTER.s + 0.5);
  p.n.setAttribute('y', d * LETTER.n + 0.5);
}

function place(p, x, y, motion = 'moving') {
  p.x = x;
  p.y = y;
  p.outer.classList.remove('moving', 'gliding');
  if (motion && !REDUCED) p.outer.classList.add(motion);
  p.outer.style.transform = `translate(${x}px, ${y}px)`;
}

// ── the TOTAL: a sum row, brackets under balanced groups, and the result ─────────────────────────────
const termEls = new Map();
const asTerms = (groups) => groups.map((g) => g.map((id) => ({ id, dir: dirs[id] ?? dirOf(id) })));

function drawSum(groups, opts = {}) {
  const { scale, items, brackets } = sumLayout(asTerms(groups), opts);
  const keep = new Set();
  sumMarks.replaceChildren();
  for (const it of items) {
    if (it.kind === 'term') {
      keep.add(it.id);
      let g = termEls.get(it.id);
      if (!g) { g = glyph('term'); termEls.set(it.id, g); sumRow.append(g); g.classList.add('fresh'); frameTick().then(() => g.classList.remove('fresh')); }
      g.style.transform = `translate(${it.x}px, ${it.y}px) scale(${scale}, ${it.dir * scale})`;
    } else {
      sumMarks.append(label({ class: it.kind === 'plus' ? 'plus' : 'more', x: it.x, y: it.y }, it.kind === 'plus' ? COPY.sum.plus : COPY.sum.more));
    }
  }
  for (const [id, g] of termEls) if (!keep.has(id)) { g.remove(); termEls.delete(id); }
  for (const b of brackets) {
    sumMarks.append(svg('path', { class: `bracket${b.value ? ' tipped' : ''}`, d: `M ${b.x1} ${b.y - 4} V ${b.y} H ${b.x2} V ${b.y - 4}` }),
      label({ class: `bracket-label${b.value ? ' tipped' : ''}`, x: (b.x1 + b.x2) / 2, y: b.y + 10 }, String(b.value)));
  }
}
function drawSumUnknown() {
  for (const g of termEls.values()) g.remove();
  termEls.clear();
  sumMarks.replaceChildren(label({ class: 'more', x: PANEL.cx, y: PANEL.sumY }, COPY.cover.mark));
}
function drawResult(value) {
  result.textContent = value === null ? '' : `${COPY.sum.equals} ${Math.abs(value)}`;
  panel.classList.toggle('is-zero', value === 0);
  panel.setAttribute('aria-label', value === null ? COPY.totalLabel : `${COPY.totalLabel}: ${value === 0 ? COPY.zero : `${Math.abs(value)} ${value > 0 ? 'up' : 'down'}`}`);
}

// outlines around balanced groups in the drop, each with its own total under it
function drawFrames(list) {
  frames.replaceChildren(...list.flatMap(({ spots, scale = 1, gap, value = 0 }) => {
    const f = frame(spots, scale, gap);
    return [svg('rect', { class: `group${value ? ' tipped' : ''}`, x: f.x, y: f.y, width: f.w, height: f.h, rx: Math.min(f.h / 2, 22) }),
      label({ class: `group-label${value ? ' tipped' : ''}${scale < 1 ? ' small' : ''}`, x: f.label.x, y: f.label.y }, String(value))];
  }));
}
const puzzleFrames = () => PAIRS.flatMap((p, k) => (state.pairedWith[k] ? [{ spots: [p.down, p.up] }] : []));

// ── pairing: drag or tap a waiting ↓ ──────────────────────────────────────────────────────────────
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
  const spot = PAIRS[p].down;
  place(piece, spot.x, spot.y);
  slots[p].classList.add('filled');
  piece.outer.classList.remove('waiting', 'nudge');
  piece.outer.removeAttribute('tabindex');
  piece.outer.removeAttribute('role');
  setTimeout(() => {
    drawFrames(puzzleFrames());
    drawSum(puzzleGroups(state));
    drawResult(totalOf(state));
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
const ask = (options) => new Promise((resolve) => choices(options, (o, b, all) => {
  all.forEach((x) => { x.disabled = true; });
  b.classList.add('picked');
  resolve(o);
}));

function button(text, onClick) {
  const b = el('button', { type: 'button', class: 'action', text });
  b.addEventListener('click', () => { b.remove(); onClick(); }, { once: true });
  prompt.append(b);
  requestAnimationFrame(() => b.classList.add('in'));
  followFocus(b);
  return b;
}
const press = (text) => new Promise((resolve) => button(text, resolve));

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
  await frameTick();
  lensAt(520);
  await wait(1000);
  on(scanner, false);
  on(water);
  describe('Three water molecules. Each is one large oxygen atom, O, joined to two small hydrogen atoms, H.');
  say(COPY.water[0], 'lead');
  await pause(reading(COPY.water[0]));
  say(COPY.water[1]);
  await wait(700);
  button(COPY.closer, scene4);
}

async function scene4() {                                   // protons: tiny magnets, then arrows
  phase = 'protons';
  clear();
  water.classList.add('protons', 'still');
  describe('At the centre of each hydrogen atom is a proton: a small ball, half marked N and half marked S.');
  say(COPY.proton[0]);
  await pause(reading(COPY.proton[0]) + 400);
  say(COPY.proton[1]);
  await wait(600);
  water.classList.add('arrows');
  for (const id of ['U0', 'D1', 'D0', 'U1', 'U2', 'D2']) {
    makePiece(id, hydrogenSpot(id), { entering: true });
    await wait(160);
  }
  describe('Each proton is now an arrow pointing from its S end to its N end: some point up, some point down.');
  await pause(reading(COPY.proton[1]) + 400);
  scene5();
}

async function scene5() {                                   // the drop, and its TOTAL, built by adding its arrows
  phase = 'setup';
  clear();
  on(water, false);
  on(lens, false);
  on(puzzle);
  for (const id of [...state.row, ...state.waiting]) { const s = restingSpot(id); place(pieces.get(id), s.x, s.y, 'gliding'); }
  await wait(1000);
  say(COPY.hook);
  await pause(reading(COPY.hook));
  on(panel);
  say(COPY.totalMeans);
  await wait(500);
  for (let k = 1; k <= state.row.length; k++) {               // each arrow in the drop is added in turn
    const id = state.row[k - 1];
    const groups = state.row.slice(0, k).map((r) => [r]);
    const to = sumLayout(asTerms(groups)).items.find((it) => it.id === id);
    const from = pieces.get(id);
    const ghost = glyph('ghost');
    ghost.style.transform = `translate(${from.x}px, ${from.y}px)`;
    piecesLayer.append(ghost);
    await frameTick();
    ghost.style.transform = `translate(${to.x}px, ${to.y}px) scale(${sumLayout(asTerms(groups)).scale})`;
    await wait(520);
    ghost.remove();
    drawSum(groups);
    await wait(260);
  }
  drawResult(totalOf(state));
  describe('A drop holding three up arrows; three down arrows wait below it. The TOTAL adds the arrows in the drop: up plus up plus up equals 3.');
  await pause(reading(COPY.totalMeans));
  play();
}

function play() {
  phase = 'play';
  for (const id of state.waiting) {
    const p = pieces.get(id);
    p.outer.classList.add('waiting', 'nudge');
    p.outer.setAttribute('tabindex', '0');
    p.outer.setAttribute('role', 'button');
    p.outer.setAttribute('aria-label', 'Down arrow');
    p.outer.addEventListener('pointerdown', (e) => startDrag(e, id));
    p.outer.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !locked && state.waiting.includes(id)) { e.preventDefault(); settle(id, tapTarget(state, id)); }
    });
  }
  slots.forEach((s) => on(s));
  clear();
  say(COPY.task);
  setLocked(false);
  followFocus(pieces.get(state.waiting[0]).outer);
  armHint(0);
}

function armHint(count) {                                   // if nothing has moved for a while, show the move
  clearTimeout(hintTimer);
  hintTimer = setTimeout(async () => {
    if (hintsOff || locked || !state.waiting.length) return;
    if (count === 0) say(COPY.hint, 'hint');
    const id = state.waiting[0];
    const from = restingSpot(id);
    const to = PAIRS[tapTarget(state, id)].down;
    const ghost = glyph('ghost hint-ghost');
    ghost.style.transform = `translate(${from.x}px, ${from.y}px) ${mirror(-1)}`;
    piecesLayer.append(ghost);
    await frameTick();
    ghost.style.transform = `translate(${to.x}px, ${to.y}px) ${mirror(-1)}`;
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

function showArrangement(k) {                               // pieces move into the groups of arrangement k
  const groups = layout(k);
  for (const { id, x, y } of groups.flat()) {
    if (pieces.has(id)) place(pieces.get(id), x, y);
    else makePiece(id, { x, y }, { entering: !REDUCED });
  }
  drawFrames(groups.map((spots) => ({ spots })));
}
function revealArrangement(k) {                             // the TOTAL shows what is now behind its 0
  drawSum(ARRANGEMENTS[k].groups);
  drawResult(total(ARRANGEMENTS[k].groups.flat()));       // the same 0, computed from the pieces behind it
}
const covered = (v) => { cover.classList.toggle('on', v); if (v) drawSumUnknown(); };

async function arrangements() {                             // look behind more 0s
  phase = 'arrangements';
  for (const p of pieces.values()) p.outer.classList.remove('prominent');
  clear();
  showArrangement(0);
  revealArrangement(0);
  const caption = say(COPY.arrangements[0], 'caption');
  await pause(2400);
  clear();
  covered(true);
  await wait(500);
  showArrangement(1);                                       // rearranged out of sight; the TOTAL still reads 0
  say(COPY.cover.intro);
  await pause(reading(COPY.cover.intro));
  say(COPY.cover.question);
  await ask(COPY.cover.choices);
  say(COPY.cover.after);
  await wait(700);
  covered(false);
  revealArrangement(1);
  await wait(500);
  clear();
  caption.textContent = COPY.arrangements[1];
  prompt.append(caption);
  await pause(2400);
  clear();
  covered(true);
  await wait(500);
  showArrangement(2);
  say(COPY.cover.again);
  await press(COPY.cover.look);
  covered(false);
  revealArrangement(2);
  await wait(500);
  clear();
  caption.textContent = COPY.arrangements[2];
  prompt.append(caption);
  await pause(2400);
  clear();
  covered(true);
  await wait(500);
  showArrangement(3);
  say(COPY.cover.again);
  await press(COPY.cover.look);
  covered(false);
  revealArrangement(3);
  await wait(900);
  phase = 'reveal';
  clear();
  say(COPY.reveal);
  await pause(reading(COPY.reveal) + 1800);
  magnet();
}

const crowdTerms = () => CROWD_SHOWN.map((k) => [`D${k}`, `U${k}`]);
async function magnet() {                                   // many more pairs, all cancelled: the total is still 0
  phase = 'magnet';
  clear();
  board.style.setProperty('--s', String(CROWD.scale));
  const c = crowd();
  for (const p of c) for (const end of [p.down, p.up]) {
    if (pieces.has(end.id)) place(pieces.get(end.id), end.x, end.y);
    else makePiece(end.id, end, { entering: !REDUCED });
  }
  drawFrames(c.map((p) => ({ spots: [p.down, p.up], scale: CROWD.scale, gap: CROWD.labelGap })));
  const before = crowdDirections(false);
  drawSum(crowdTerms(), { lead: true, trail: true });
  drawResult(total(Object.values(before)));
  describe('Twelve pairs of opposite arrows in the drop, one up and one down, each pair a group with a total of 0. The TOTAL is 0.');
  await wait(800);
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
  flipped.letters.classList.add('swap');
  dirs[FLIP] = now[FLIP];
  flipped.inner.style.transform = mirror(dirs[FLIP]);
  await wait(300);
  setLetters(flipped);
  flipped.letters.classList.remove('swap');
  const c = crowd();
  drawFrames(c.map((p) => ({ spots: [p.down, p.up], scale: CROWD.scale, gap: CROWD.labelGap, value: total([dirs[p.down.id], dirs[p.up.id]]) })));
  drawSum(crowdTerms(), { lead: true, trail: true, labels: CROWD_SHOWN.map((k) => total([dirs[`D${k}`], dirs[`U${k}`]])) });
  drawResult(total(Object.values(now)));
  describe('With the magnet on, one down arrow has turned to point up, with the magnet. Its group no longer cancels: it adds up to 2. The TOTAL is 2.');
  say(COPY.magnet[1]);
  await pause(reading(COPY.magnet[1]) + 600);
  clear();
  say(COPY.magnet[2]);                                       // what an MRI does: turn the 0 into a small signal
  await pause(reading(COPY.magnet[2]));
  say(COPY.magnet[3]);
  await pause(reading(COPY.magnet[3]) + 400);
  clear();
  say(COPY.magnet[4]);                                       // the 0 held every magnet; the signal shows the few left over
  await pause(reading(COPY.magnet[4]) + 600);
  say(COPY.magnet[5]);
  await wait(500);
  button(COPY.listen, paint);
}

async function paint() {                                    // the scanner paints its picture
  phase = 'picture';
  clear();
  piecesLayer.classList.add('away');
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
    if (!REDUCED) await pause(40);
  }
  say(COPY.picture);
  await pause(reading(COPY.picture) + 600);
  seeIt();
}

async function seeIt() {                                    // your eye sees one picture; it hides far more than it seems
  phase = 'eye';
  clear();
  on(panel, false);
  screenShift.style.transform = `translateX(${PICTURE_SHIFT}px)`;
  await wait(700);
  on(eyeScene);
  await wait(400);
  eyeScene.classList.add('flowing');
  describe('The picture moves left. Lines run from all over it into an eye. Out of the eye comes the same picture, small: one picture.');
  say(COPY.eye.line);
  await pause(reading(COPY.eye.line) + 1200);
  eyeScene.classList.remove('flowing');
  phase = 'closing';
  clear();
  say(COPY.closing, 'lead');
  await pause(reading(COPY.closing));
  similar();
}

async function similar() {                                  // Level 1's violin works the same way
  phase = 'similar';
  say(COPY.similar.question);
  await ask(COPY.similar.choices);
  say(COPY.similar.after);
  on(eyeScene, false);
  on(screen, false);
  const C = COMPARE;
  const box = (side, text) => svg('g', {},
    svg('rect', { class: 'cmp-box', x: side.x, y: side.y, width: side.w, height: side.h, rx: 18 }),
    svg('text', { class: 'cmp-label', x: side.x + side.w / 2, y: C.labelY, 'text-anchor': 'middle', text }));
  const left = box(C.left, COPY.compareLabels.note);
  const right = box(C.right, COPY.compareLabels.signal);
  compareLayer.replaceChildren(left, right);
  on(compareLayer);
  const mini = (amounts, x0, w, cy, cls, amp = 15) => {
    let d = '';
    for (let i = 0; i <= 160; i++) { const u = i / 160; d += `${i ? 'L' : 'M'}${(x0 + u * w).toFixed(1)} ${(cy - wave(amounts, u * 2) * amp).toFixed(1)}`; }
    return svg('path', { class: cls, d });
  };
  const leftSteps = [];                                     // A + high A + E + higher A = one A note
  C.notesY.forEach((y, k) => {
    leftSteps.push(mini(part(A_NOTE, k), C.left.x + 46, C.left.w - 66, y, `cmp-wave cmp-${k}`));
    if (k) leftSteps.push(svg('text', { class: 'cmp-plus', x: C.left.x + 24, y: y - 17, 'text-anchor': 'middle', text: COPY.sum.plus }));
  });
  leftSteps.push(svg('text', { class: 'cmp-plus', x: C.left.x + 24, y: C.sumY + 7, 'text-anchor': 'middle', text: COPY.sum.equals }),
    mini(A_NOTE, C.left.x + 46, C.left.w - 100, C.sumY, 'cmp-wave cmp-sum', 15 / (A_NOTE[0] / NOTE_STEPS)),
    svg('text', { class: 'cmp-result', x: C.left.x + C.left.w - 30, y: C.sumY + 16, 'text-anchor': 'middle', text: COPY.aName }));
  const rightSteps = [];                                    // ↑ + ↓ + ↑ + ↓ = 0 signal
  [1, -1, 1, -1].forEach((d, i) => {
    const x = C.right.x + 44 + i * 68;
    const g = glyph('cmp-magnet');
    g.style.transform = `translate(${x}px, ${C.magnetsY}px) scale(0.8, ${0.8 * d})`;
    rightSteps.push(g);
    if (i) rightSteps.push(svg('text', { class: 'cmp-plus', x: x - 34, y: C.magnetsY + 7, 'text-anchor': 'middle', text: COPY.sum.plus }));
  });
  rightSteps.push(svg('path', { class: 'cmp-bracket', d: `M ${C.right.x + 30} ${C.bracketY - 6} V ${C.bracketY} H ${C.right.x + 126} V ${C.bracketY - 6} M ${C.right.x + 166} ${C.bracketY - 6} V ${C.bracketY} H ${C.right.x + 262} V ${C.bracketY - 6}` }),
    svg('text', { class: 'cmp-zero', x: C.right.x + 78, y: C.bracketY + 22, 'text-anchor': 'middle', text: COPY.zero }),
    svg('text', { class: 'cmp-zero', x: C.right.x + 214, y: C.bracketY + 22, 'text-anchor': 'middle', text: COPY.zero }),
    svg('text', { class: 'cmp-result', x: C.right.x + C.right.w / 2, y: C.resultY, 'text-anchor': 'middle', text: `${COPY.sum.equals} ${COPY.zero}` }));
  describe('Left, Level 1: four notes add up to one A note. Right: up, down, up, down arrows add up to a total signal of 0.');
  for (const n of leftSteps) { left.append(n); n.classList.add('pop'); await wait(200); }
  for (const n of rightSteps) { right.append(n); n.classList.add('pop'); await wait(200); }
  clear();
  say(COPY.compare);
  await pause(reading(COPY.compare) + 900);
  phase = 'final';
  clear();
  say(COPY.final, 'final');
  root.dispatchEvent(new CustomEvent('level-finished', { bubbles: true }));
}

// read-only view for automated checks (no learner-facing effect)
window.__mri = { get state() { return state; }, get phase() { return phase; }, get shown() { return [...pieces.keys()]; }, get dirs() { return { ...dirs }; } };

setLocked(true);
scene1();
