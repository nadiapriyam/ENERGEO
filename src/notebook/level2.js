// Level 2 of the notebook, "Inside a note" (docs/notebook_spec.md). The lights go down and a violin plays one note.
// The learner builds it from six simple tones (dials), compares by ear and by eye, learns that agreeing at one moment
// proves nothing, and drives the whole-wave DIFFERENCE to an exact 0. Then: other notes have other recipes, and the
// scanner from Level 1 turns out to have done the same unmixing to paint its picture. Every learner-facing line comes
// from copy2.js; every position, amount and difference comes from src/math/tones.js (and scanner.js for the picture).
import './level2.css';

import { COPY } from './copy2.js';
import {
  TONES, STEPS, PITCH, VIOLIN, OTHERS, wavePath, gapPath, leftover, differencePercent, active, MARKER_X, SCOPE, PANEL, BOARD, BRIDGE,
  stringPath, dialAngle, chordSamples, unmix,
} from '../math/tones.js';
import { picture } from '../math/scanner.js';

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
const wait = (ms) => new Promise((r) => setTimeout(r, REDUCED ? Math.min(ms, 1200) : ms));
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const reading = (text) => Math.min(4500, 900 + 40 * text.length);
const on = (node, v = true) => node.classList.toggle('on', v);

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let phase = 'dark';
let mine = Array(TONES).fill(0);
let target = [...VIOLIN];
let locked = true;
let showGap = false;
let showDifference = false;

// ── sound: the violin and every mix are exact sums of the six tones (a periodic wave), made only after a tap ─────────
let ctx = null;
function audio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx ??= new AC(); if (ctx.state === 'suspended') ctx.resume(); } catch { return null; }
  return ctx;
}
function sound(amounts, seconds = 1.8) {
  const c = audio();
  if (c && amounts.some((a) => a > 0)) {
    const real = new Float32Array(TONES + 1);
    const imag = new Float32Array(TONES + 1);
    amounts.forEach((a, k) => { imag[k + 1] = a / STEPS; });
    const osc = c.createOscillator();
    osc.setPeriodicWave(c.createPeriodicWave(real, imag, { disableNormalization: true }));
    osc.frequency.value = PITCH;
    const lfo = c.createOscillator();          // the same gentle vibrato on every note, so the comparison stays fair
    const depth = c.createGain();
    lfo.frequency.value = 5.5;
    depth.gain.value = PITCH * 0.004;
    lfo.connect(depth).connect(osc.frequency);
    const g = c.createGain();
    const t = c.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.08);
    g.gain.linearRampToValueAtTime(0.13, t + 0.4);
    g.gain.setValueAtTime(0.13, t + seconds - 0.3);
    g.gain.linearRampToValueAtTime(0, t + seconds);
    osc.connect(g).connect(c.destination);
    osc.start(t); lfo.start(t);
    osc.stop(t + seconds + 0.05); lfo.stop(t + seconds + 0.05);
  }
  return pause(seconds * 1000);
}
function toneSound(k) {                                     // one simple tone on its own
  const c = audio();
  if (!c) return;
  const osc = c.createOscillator();
  osc.frequency.value = PITCH * (k + 1);
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.14, t + 0.03);
  g.gain.setValueAtTime(0.14, t + 0.6);
  g.gain.linearRampToValueAtTime(0, t + 0.9);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.95);
}

// ── page ─────────────────────────────────────────────────────────────────────────────────────────
const root = document.getElementById('level-2-lesson');
const page = root.closest('.page');
const figure = el('figure', { class: 'figure scope-figure' });
const mixer = el('div', { class: 'mixer', role: 'group', 'aria-label': 'Six simple tones' });
const transport = el('div', { class: 'transport' });
const prompt = el('div', { class: 'prompt', 'aria-live': 'polite' });
root.append(figure, mixer, transport, prompt);

const board = svg('svg', { viewBox: `0 0 ${BOARD.w} ${BOARD.h}`, class: 'scope-board', role: 'img' });
const describe = (text) => board.setAttribute('aria-label', text);
board.append(svg('defs', {},
  svg('filter', { id: 'glow', x: '-20%', y: '-40%', width: '140%', height: '180%' },
    svg('feGaussianBlur', { stdDeviation: '3.2', result: 'b' }),
    svg('feMerge', {}, svg('feMergeNode', { in: 'b' }), svg('feMergeNode', { in: 'SourceGraphic' }))),
  svg('clipPath', { id: 'scope-clip' }, svg('rect', { x: SCOPE.x, y: SCOPE.y, width: SCOPE.w, height: SCOPE.h, rx: 18 }))));
const scopeBg = svg('rect', { class: 'scope-bg', x: SCOPE.x, y: SCOPE.y, width: SCOPE.w, height: SCOPE.h, rx: 18 });
const axis = svg('line', { class: 'axis', x1: SCOPE.x + 10, x2: SCOPE.x + SCOPE.w - 10, y1: SCOPE.y + SCOPE.h / 2, y2: SCOPE.y + SCOPE.h / 2 });
const waves = svg('g', { 'clip-path': 'url(#scope-clip)' });
const gap = svg('path', { class: 'gap' });
const violinWave = svg('path', { class: 'wave violin-wave', filter: 'url(#glow)' });
const mineWave = svg('path', { class: 'wave mine-wave', filter: 'url(#glow)' });
waves.append(gap, violinWave, mineWave);
const legend = svg('g', { class: 'legend' },
  svg('line', { class: 'violin-swatch', x1: SCOPE.x + 4, x2: SCOPE.x + 28, y1: 40, y2: 40 }),
  svg('text', { class: 'legend-text', x: SCOPE.x + 36, y: 45, text: COPY.legend.violin }),
  svg('line', { class: 'mine-swatch', x1: SCOPE.x + 4, x2: SCOPE.x + 28, y1: 72, y2: 72 }),
  svg('text', { class: 'legend-text', x: SCOPE.x + 36, y: 77, text: COPY.legend.mine }));
const marker = svg('g', { class: 'marker' },
  svg('line', { x1: MARKER_X, x2: MARKER_X, y1: SCOPE.y + 6, y2: SCOPE.y + SCOPE.h - 6 }),
  svg('circle', { cx: MARKER_X, cy: SCOPE.y + SCOPE.h / 2, r: 7 }),
  svg('rect', { class: 'bubble', x: PANEL.x, y: PANEL.y + 8, width: PANEL.w, height: PANEL.h - 16, rx: 16 }),
  svg('text', { class: 'readout violin-read', x: PANEL.cx, y: PANEL.y + 44, 'text-anchor': 'middle', text: COPY.readout.violin }),
  svg('text', { class: 'readout mine-read', x: PANEL.cx, y: PANEL.y + 74, 'text-anchor': 'middle', text: COPY.readout.mine }));
const diffValue = svg('text', { class: 'diff-value', x: PANEL.cx, y: PANEL.valueY, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
const diffBox = svg('rect', { class: 'diff-box', x: PANEL.cx - 34, y: PANEL.valueY - 30, width: 68, height: 60, rx: 12 });
const diffPanel = svg('g', { class: 'diff-panel' },
  svg('rect', { class: 'panel-box', x: PANEL.x, y: PANEL.y, width: PANEL.w, height: PANEL.h, rx: 18 }),
  svg('text', { class: 'diff-label', x: PANEL.cx, y: PANEL.labelY, 'text-anchor': 'middle', text: COPY.differenceLabel }),
  diffBox, diffValue);
const bridge = svg('g', { class: 'bridge' });
board.append(scopeBg, axis, waves, legend, marker, diffPanel, bridge);
figure.append(board);

// ── the six tones: a string that shows the tone's shape, a dial for how much of it, and − / + ──────────────────────
const cards = Array.from({ length: TONES }, (_, k) => {
  const str = svg('path', { class: 'string' });
  const strSvg = svg('svg', { viewBox: '0 0 120 36', class: 'string-svg' }, svg('line', { class: 'string-rest', x1: 0, x2: 120, y1: 18, y2: 18 }), str);
  const hear = el('button', { type: 'button', class: 'hear', 'aria-label': `${COPY.tone} ${k + 1}: hear it` }, strSvg);
  const ticks = svg('g', { class: 'ticks' }, ...Array.from({ length: STEPS + 1 }, (_, i) => {
    const a = ((dialAngle(i) - 90) * Math.PI) / 180;
    return svg('line', { x1: (38 + 30 * Math.cos(a)).toFixed(2), y1: (38 + 30 * Math.sin(a)).toFixed(2), x2: (38 + 35 * Math.cos(a)).toFixed(2), y2: (38 + 35 * Math.sin(a)).toFixed(2) });
  }));
  const pointer = svg('g', { class: 'pointer' }, svg('line', { x1: 38, y1: 38, x2: 38, y2: 14 }));
  const value = svg('text', { class: 'dial-value', x: 38, y: 39, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
  const dialSvg = svg('svg', { viewBox: '0 0 76 76', class: 'dial-svg' }, ticks, svg('circle', { class: 'knob', cx: 38, cy: 38, r: 25 }), pointer, value);
  const dial = el('div', { class: 'dial', role: 'slider', tabindex: '0', 'aria-label': `${COPY.tone} ${k + 1}`, 'aria-valuemin': '0', 'aria-valuemax': String(STEPS) }, dialSvg);
  const minus = el('button', { type: 'button', class: 'step', 'aria-label': `${COPY.tone} ${k + 1}: less`, text: COPY.minus });
  const plus = el('button', { type: 'button', class: 'step', 'aria-label': `${COPY.tone} ${k + 1}: more`, text: COPY.plus });
  const card = el('div', { class: 'tone', 'data-k': String(k + 1) }, hear, dial, el('div', { class: 'tone-foot' }, minus, el('span', { class: 'tone-label', text: `${COPY.tone} ${k + 1}` }), plus));
  mixer.append(card);
  hear.addEventListener('click', () => { if (!locked) { toneSound(k); vibrate(k); } });
  minus.addEventListener('click', () => setAmount(k, mine[k] - 1));
  plus.addEventListener('click', () => setAmount(k, mine[k] + 1));
  dial.addEventListener('keydown', (e) => {
    const d = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 2, PageDown: -2 }[e.key];
    if (d) { e.preventDefault(); setAmount(k, mine[k] + d); }
  });
  dial.addEventListener('pointerdown', (e) => {                // drag up or right for more, down or left for less
    if (locked) return;
    e.preventDefault();
    dial.setPointerCapture(e.pointerId);
    const x0 = e.clientX, y0 = e.clientY, v0 = mine[k];
    const move = (ev) => setAmount(k, v0 + Math.round(((ev.clientX - x0) - (ev.clientY - y0)) / 14));
    const end = () => { dial.removeEventListener('pointermove', move); dial.removeEventListener('pointerup', end); dial.removeEventListener('pointercancel', end); };
    dial.addEventListener('pointermove', move);
    dial.addEventListener('pointerup', end);
    dial.addEventListener('pointercancel', end);
  });
  return { card, str, pointer, value, dial };
});

// strings vibrate while their tone sounds
function vibrate(k, ms = 900) {
  if (REDUCED) return;
  const t0 = performance.now();
  const step = (t) => {
    const s = Math.cos(((t - t0) / 1000) * 2 * Math.PI * 7) * (1 - (t - t0) / ms);
    cards[k].str.setAttribute('d', stringPath(k + 1, Math.max(mine[k], 4), s));
    if (t - t0 < ms) requestAnimationFrame(step); else drawCard(k);
  };
  requestAnimationFrame(step);
}
function drawCard(k, covered = false) {
  const c = cards[k];
  c.str.setAttribute('d', stringPath(k + 1, covered ? 0 : mine[k]));
  c.pointer.style.transform = `rotate(${dialAngle(mine[k])}deg)`;
  c.value.textContent = covered ? COPY.cover.mark : String(mine[k]);
  c.card.classList.toggle('covered', covered);
  c.card.classList.toggle('lit', !covered && mine[k] > 0);
  c.dial.setAttribute('aria-valuenow', String(mine[k]));
}

// ── what the scope shows ─────────────────────────────────────────────────────────────────────────
function drawScope(shift = 0) {
  violinWave.setAttribute('d', wavePath(target, shift));
  mineWave.setAttribute('d', wavePath(mine, shift));
  gap.setAttribute('d', showGap ? gapPath(target, mine) : '');
  if (showDifference) {
    const v = differencePercent(target, mine);
    diffValue.textContent = v === 0 ? COPY.zero : `${v}${COPY.percent}`;
    diffPanel.classList.toggle('is-zero', v === 0);
  }
}
function scroll(which, ms) {                                // a playing note runs across the scope
  if (REDUCED) return pause(ms);
  board.classList.add(`playing-${which}`);
  const t0 = performance.now();
  return new Promise((resolve) => {
    const step = (t) => {
      const p = ((t - t0) / 1000) * 0.9;
      if (which === 'violin') violinWave.setAttribute('d', wavePath(target, p));
      else mineWave.setAttribute('d', wavePath(mine, p));
      if (t - t0 < ms) requestAnimationFrame(step);
      else { board.classList.remove(`playing-${which}`); drawScope(); resolve(); }
    };
    requestAnimationFrame(step);
  });
}
async function playViolin() { await Promise.all([sound(target), scroll('violin', 1800)]); }
async function playMine() {
  mine.forEach((a, k) => { if (a > 0) vibrate(k, 1800); });
  await Promise.all([sound(mine), scroll('mine', 1800)]);
}

let reacted = 0;
let afterChange = () => {};
function setAmount(k, v) {
  if (locked) return;
  const n = Math.max(0, Math.min(STEPS, v));
  if (n === mine[k]) return;
  mine = mine.map((a, i) => (i === k ? n : a));
  drawCard(k);
  drawScope();
  if (navigator.vibrate) try { navigator.vibrate(4); } catch { /* not supported */ }
  afterChange();
}
function setLocked(v) {
  locked = v;
  mixer.classList.toggle('is-locked', v);
  transport.querySelectorAll('button').forEach((b) => { b.disabled = v; });
}

// ── the prompt: one small piece of text at a time ──────────────────────────────────────────────────
const say = (text, cls = '') => {
  const p = el('p', { class: `line ${cls}`.trim(), text });
  prompt.append(p);
  requestAnimationFrame(() => p.classList.add('in'));
  return p;
};
const clear = () => prompt.replaceChildren();
let keyboardUser = false;
root.addEventListener('keydown', (e) => { if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') keyboardUser = true; }, true);
root.addEventListener('pointerdown', () => { keyboardUser = false; }, true);
const followFocus = (t) => { if (keyboardUser) t.focus({ preventScroll: true }); };
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
const ask = (options) => new Promise((resolve) => choices(options, (o, b, all) => { all.forEach((x) => { x.disabled = true; }); b.classList.add('picked'); resolve(o); }));
function button(text, onClick) {
  const b = el('button', { type: 'button', class: 'action', text });
  b.addEventListener('click', () => { b.remove(); onClick(); }, { once: true });
  prompt.append(b);
  requestAnimationFrame(() => b.classList.add('in'));
  followFocus(b);
  return b;
}
const press = (text) => new Promise((resolve) => button(text, resolve));
function transportButton(text, onClick) {
  const b = el('button', { type: 'button', class: 'transport-button', text });
  b.addEventListener('click', async () => { if (locked) return; transport.classList.add('busy'); await onClick(); transport.classList.remove('busy'); });
  transport.append(b);
  return b;
}

// ── the story ────────────────────────────────────────────────────────────────────────────────────
async function scene1() {                                   // the lights go down; one note
  describe('A dark stage. A screen waits for a sound.');
  requestAnimationFrame(() => figure.classList.add('in'));
  page.classList.add('night');
  say(COPY.dim, 'lead');
  await pause(reading(COPY.dim));
  say(COPY.violin);
  await press(COPY.listen);
  phase = 'listen';
  on(violinWave);
  describe('A glowing wave runs across the screen while the violin plays: a repeating, jagged shape.');
  await playViolin();
  drawScope();
  say(COPY.oneThing);
  await pause(reading(COPY.oneThing));
  say(COPY.shape);
  await pause(reading(COPY.shape) + 400);
  clear();
  say(COPY.build, 'lead');
  await pause(reading(COPY.build));
  scene2();
}

function scene2() {                                         // six simple tones, and a sound of your own
  phase = 'build';
  for (let k = 0; k < TONES; k++) drawCard(k);
  mixer.classList.add('in');
  on(legend);
  on(mineWave);
  violinWave.classList.add('faint');
  showGap = true;
  drawScope();
  say(COPY.tones);
  say(COPY.howTo);
  transportButton(COPY.playViolin, playViolin);
  transportButton(COPY.playMine, playMine);
  transport.classList.add('in');
  describe('The violin wave glows faintly; your own wave, flat for now, lies over it. The space between them is shaded.');
  setLocked(false);
  followFocus(cards[0].dial);
  hintTimer = setTimeout(() => { if (active(mine) === 0) { say(COPY.hint, 'hint'); cards[0].card.classList.add('nudge'); } }, 8000);
}

let hintTimer = null;
let checkTimer = null;
afterChange = () => {
  clearTimeout(hintTimer);
  cards[0].card.classList.remove('nudge');
  if (phase === 'build') {
    const n = active(mine);
    if (n >= 1 && reacted < 1) { reacted = 1; say(COPY.react[0], 'hint'); }
    else if (n >= 2 && reacted < 2) { reacted = 2; say(COPY.react[1], 'hint'); }
    clearTimeout(checkTimer);
    if (n >= 3) checkTimer = setTimeout(checkpoint1, 1600);
  } else if (phase === 'tune' && differencePercent(target, mine) === 0) reachZero();
};

async function checkpoint1() {                              // one moment of agreement
  if (phase !== 'build') return;
  phase = 'check1';
  setLocked(true);
  clear();
  on(legend, false);
  on(marker);
  describe('A marker stands in the middle of the screen, where both waves cross the centre line: both read 0.');
  say(COPY.moment);
  await pause(reading(COPY.moment));
  say(COPY.same.question);
  await ask(COPY.same.choices);
  say(COPY.same.after);
  await wait(500);
  await playViolin();
  await wait(300);
  await playMine();
  say(COPY.notEnough);
  await pause(reading(COPY.notEnough) + 300);
  on(marker, false);
  showDifference = true;
  on(diffPanel);
  drawScope();
  clear();
  say(COPY.differenceMeans);
  await pause(reading(COPY.differenceMeans));
  say(COPY.task);
  phase = 'tune';
  setLocked(false);
  if (differencePercent(target, mine) === 0) reachZero();
}

async function reachZero() {                                // the whole-wave difference is 0
  phase = 'zero';
  setLocked(true);
  diffPanel.classList.add('glow');
  describe('Your wave lies exactly on the violin wave. The DIFFERENCE reads 0.');
  await wait(1200);
  clear();
  say(COPY.reached[0]);
  await pause(reading(COPY.reached[0]));
  say(COPY.reached[1]);
  await press(COPY.lookCloser);
  checkpoint2();
}

function checkpoint2() {                                    // is the violin gone?
  phase = 'check2';
  clear();
  say(COPY.check2.question);
  let feedback = null;
  choices(COPY.check2.choices, async (o, b, all) => {
    feedback?.remove();
    if (o === COPY.check2.intended) {
      all.forEach((x) => { x.disabled = true; });
      b.classList.add('picked');
      feedback = say(COPY.check2.right, 'feedback');
      await playMine();
      await pause(reading(COPY.check2.right));
      clear();
      say(COPY.answer);
      await pause(reading(COPY.answer) + 400);
      lookInside();
    } else {
      b.disabled = true;
      b.classList.add('missed');
      feedback = say(COPY.check2.wrong, 'feedback');
      await playViolin();
    }
  });
}

async function reveal(amounts) {                            // the dials turn to a note's recipe, one by one
  for (let k = 0; k < TONES; k++) {
    const from = mine[k];
    const step = amounts[k] > from ? 1 : -1;
    for (let v = from; v !== amounts[k]; v += step) { mine = mine.map((a, i) => (i === k ? v + step : a)); drawCard(k); drawScope(); await wait(45); }
    drawCard(k);
  }
  drawScope();
}
async function coverWith(amounts) {                         // a new note plays; its recipe is hidden
  target = [...amounts];
  mine = Array(TONES).fill(0);
  for (let k = 0; k < TONES; k++) drawCard(k, true);
  diffPanel.classList.remove('glow');
  drawScope();
  await playViolin();
}

async function lookInside() {                               // other notes, other recipes
  phase = 'others';
  transport.classList.remove('in');
  clear();
  say(COPY.cover.intro);
  await coverWith(OTHERS[0].amounts);
  say(COPY.cover.question);
  await ask(COPY.cover.choices);
  say(COPY.cover.after);
  await wait(500);
  await reveal(OTHERS[0].amounts);
  clear();
  const caption = say(COPY.captions[0], 'caption');
  await pause(2400);
  clear();
  say(COPY.cover.again);
  await coverWith(OTHERS[1].amounts);
  await press(COPY.cover.look);
  await reveal(OTHERS[1].amounts);
  clear();
  caption.textContent = COPY.captions[1];
  prompt.append(caption);
  await pause(2400);
  clear();
  say(COPY.reveal);
  await pause(reading(COPY.reveal) + 1400);
  backToTheScanner();
}

async function backToTheScanner() {                         // the scanner's reply was a chord; unmixing it paints the picture
  phase = 'mri';
  clear();
  mixer.classList.remove('in');
  transport.classList.remove('in');
  for (const n of [violinWave, mineWave, legend, diffPanel]) on(n, false);
  gap.setAttribute('d', '');
  board.classList.add('bridging');
  const chord = svg('path', { class: 'chord', filter: 'url(#glow)' });
  const bars = svg('g', { class: 'bars' });
  const pic = svg('g', { class: 'pic' }, svg('rect', { class: 'pic-frame', x: BRIDGE.pic.x - 4, y: BRIDGE.pic.y - 4, width: BRIDGE.pic.size + 8, height: BRIDGE.pic.size + 8, rx: 10 }));
  bridge.append(chord, bars, pic);
  const cells = picture();
  const n = Math.round(Math.sqrt(cells.length));
  const rows = Array.from({ length: n }, (_, j) => cells.slice(j * n, (j + 1) * n).map((c) => c.g));
  const drawChord = (row) => {
    const s = chordSamples(row);
    const m = Math.max(1e-9, ...s.map(Math.abs));
    chord.setAttribute('d', s.map((v, i) => `${i ? 'L' : 'M'}${(BRIDGE.chord.x + (i / (s.length - 1)) * BRIDGE.chord.w).toFixed(1)} ${(BRIDGE.chord.y + BRIDGE.chord.h / 2 - (v / m) * (BRIDGE.chord.h / 2 - 4)).toFixed(1)}`).join(''));
    return s;
  };
  const drawRow = (j, samples) => {
    const amounts = unmix(samples, n);                      // the unmixing: how much of each tone
    const w = BRIDGE.bars.w / n;
    bars.replaceChildren(...amounts.map((a, i) => svg('rect', { x: (BRIDGE.bars.x + i * w).toFixed(2), y: (BRIDGE.bars.y + BRIDGE.bars.h * (1 - Math.max(0, a))).toFixed(2), width: (w * 0.8).toFixed(2), height: (BRIDGE.bars.h * Math.max(0, a)).toFixed(2) })));
    const cw = BRIDGE.pic.size / n;
    for (let i = 0; i < n; i++) {
      const v = Math.round(255 * Math.min(1, Math.max(0, amounts[i])));
      pic.append(svg('rect', { x: (BRIDGE.pic.x + i * cw).toFixed(2), y: (BRIDGE.pic.y + j * cw).toFixed(2), width: (cw + 0.4).toFixed(2), height: (cw + 0.4).toFixed(2), fill: `rgb(${v},${v},${v})` }));
    }
  };
  say(COPY.mri[0], 'lead');
  on(bridge);
  const middle = Math.floor(n / 2);
  drawChord(rows[middle]);
  describe('A tangled radio wave: the scanner\'s faint reply, many tones at once.');
  await pause(reading(COPY.mri[0]));
  say(COPY.mri[1]);
  await press(COPY.unmix);
  for (let j = 0; j < n; j++) {
    const s = drawChord(rows[j]);
    drawRow(j, s);
    if (!REDUCED) await pause(j < 3 ? 700 : 55);
  }
  describe('Each tangled chord is unmixed into bars, one per tone; each set of bars becomes a row of grey dots; row by row, a picture of a head appears.');
  clear();
  say(COPY.mriAfter[0]);
  await pause(reading(COPY.mriAfter[0]));
  say(COPY.mriAfter[1]);
  await pause(reading(COPY.mriAfter[1]) + 600);
  closing();
}

async function closing() {
  phase = 'closing';
  clear();
  page.classList.add('dawn');
  say(COPY.name[0], 'lead');
  await pause(reading(COPY.name[0]));
  say(COPY.name[1]);
  await pause(reading(COPY.name[1]));
  say(COPY.name[2]);
  await pause(reading(COPY.name[2]) + 900);
  clear();
  say(COPY.levels[0]);
  await pause(reading(COPY.levels[0]) + 300);
  say(COPY.levels[1]);
  await pause(reading(COPY.levels[1]) + 900);
  phase = 'final';
  clear();
  say(COPY.final, 'final');
}

// read-only view for automated checks (no learner-facing effect)
window.__level2 = { get phase() { return phase; }, get mine() { return [...mine]; }, get target() { return [...target]; }, get difference() { return differencePercent(target, mine); }, get leftover() { return leftover(target, mine); } };

setLocked(true);
scene1();
