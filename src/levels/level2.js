// Level 2, "Inside a note" (docs/level2_spec.md). The orchestra tunes to one note. A tuning fork and a violin play
// it: same note, different sound. The learner predicts why, then tries to match the violin with one tuning fork and
// cannot, however hard they strike it. Opening the box gives smaller forks (higher tones); striking them, the learner
// brings the DIFFERENCE to an exact 0, then says what was inside the violin's note before the note is taken apart into
// its tones. Every learner-facing line comes from copy2.js; every position, amount and difference from src/math/tones.js.
import './level2.css';

import { COPY } from './copy2.js';
import {
  FORKS, STEPS, PITCH, TUNING_FORK, VIOLIN, part, differencePercent, BOARD, PANEL, STAGE, lane, wavePath, gapPath, forkHeight,
} from '../math/tones.js';

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
let phase = 'opening';
let mine = Array(FORKS).fill(0);
let open = 1;                                     // how many forks are out of the box
let locked = true;
let strikes = 0;

// ── sound: made only after a tap ─────────────────────────────────────────────────────────────────
let ctx = null;
function audio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx ??= new AC(); if (ctx.state === 'suspended') ctx.resume(); } catch { return null; }
  return ctx;
}
/** A struck fork: one pure tone that rings and fades. */
function ring(k, level, seconds = 1.8) {
  const c = audio();
  if (c && level > 0) {
    const osc = c.createOscillator();
    osc.frequency.value = PITCH * (k + 1);
    const g = c.createGain();
    const t = c.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.2 * (level / STEPS), t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.001, t + seconds);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + seconds + 0.05);
  }
  return pause(seconds * 1000);
}
/** A held note made of the given tones: the violin, or your mix. The same bow and vibrato for both, so the comparison is fair. */
function bow(amounts, seconds = 1.9) {
  const c = audio();
  if (c && amounts.some((a) => a > 0)) {
    const real = new Float32Array(FORKS + 1);
    const imag = new Float32Array(FORKS + 1);
    amounts.forEach((a, k) => { imag[k + 1] = a / STEPS; });
    const osc = c.createOscillator();
    osc.setPeriodicWave(c.createPeriodicWave(real, imag, { disableNormalization: true }));
    osc.frequency.value = PITCH;
    const lfo = c.createOscillator();
    const depth = c.createGain();
    lfo.frequency.value = 5.5;
    depth.gain.value = PITCH * 0.004;
    lfo.connect(depth).connect(osc.frequency);
    const g = c.createGain();
    const t = c.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.15, t + 0.09);
    g.gain.linearRampToValueAtTime(0.12, t + 0.4);
    g.gain.setValueAtTime(0.12, t + seconds - 0.3);
    g.gain.linearRampToValueAtTime(0, t + seconds);
    osc.connect(g).connect(c.destination);
    osc.start(t); lfo.start(t);
    osc.stop(t + seconds + 0.05); lfo.stop(t + seconds + 0.05);
  }
  return pause(seconds * 1000);
}

// ── page ─────────────────────────────────────────────────────────────────────────────────────────
const root = document.getElementById('level-2-lesson');
const figure = el('figure', { class: 'figure' });
const forksRow = el('div', { class: 'forks', role: 'group', 'aria-label': 'Tuning forks' });
const transport = el('div', { class: 'transport' });
const prompt = el('div', { class: 'prompt', 'aria-live': 'polite' });
root.append(figure, forksRow, transport, prompt);

const board = svg('svg', { viewBox: `0 0 ${BOARD.w} ${BOARD.h}`, class: 'wave-board', role: 'img' });
const describe = (text) => board.setAttribute('aria-label', text);
const stage = svg('rect', { class: 'stage', x: STAGE.x, y: STAGE.y, width: STAGE.w, height: STAGE.h, rx: 18 });
const forkWave = svg('path', { class: 'wave fork-wave' });
const violinWave = svg('path', { class: 'wave violin-wave' });
const mineWave = svg('path', { class: 'wave mine-wave' });
const gap = svg('path', { class: 'gap' });
const label = (cls, text) => svg('text', { class: `lane-label ${cls}`, text });
const forkLabel = label('fork-label', COPY.labels.fork);
const violinLabel = label('violin-label', COPY.labels.violin);
const mineLabel = label('mine-label', COPY.labels.mine);
const parts = svg('g', { class: 'parts' });
const diffValue = svg('text', { class: 'diff-value', x: PANEL.cx, y: PANEL.valueY, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
const diffPanel = svg('g', { class: 'diff-panel' },
  svg('rect', { class: 'panel-box', x: PANEL.x, y: PANEL.y, width: PANEL.w, height: PANEL.h, rx: 18 }),
  svg('text', { class: 'diff-label', x: PANEL.cx, y: PANEL.labelY, 'text-anchor': 'middle', text: COPY.differenceLabel }),
  svg('rect', { class: 'diff-box', x: PANEL.cx - 32, y: PANEL.valueY - 27, width: 64, height: 54, rx: 12 }),
  diffValue);
board.append(stage, gap, forkWave, violinWave, mineWave, forkLabel, violinLabel, mineLabel, parts, diffPanel);
figure.append(board);
const placeLabel = (node, ln) => { node.setAttribute('x', STAGE.x + 16); node.setAttribute('y', ln.top + 22); };

// the forks: shorter forks sing higher; tapping one strikes it harder (1, 2, 3), and once more lets it fall silent
const forkGlyph = (k) => {
  const h = forkHeight(k);
  const top = 150 - 34 - h;
  return `M 30 ${150 - 34} V ${top + 7} A 7 7 0 0 1 44 ${top + 7} V ${150 - 44} Q 44 ${150 - 34} 52 ${150 - 34} Q 60 ${150 - 34} 60 ${150 - 44} V ${top + 7}`
    + ` A 7 7 0 0 1 74 ${top + 7} V ${150 - 34} Q 74 ${150 - 22} 52 ${150 - 22} Q 30 ${150 - 22} 30 ${150 - 34} Z M 48 ${150 - 22} H 56 V 148 H 48 Z`;
};
const forks = Array.from({ length: FORKS }, (_, k) => {
  const tines = svg('path', { class: 'tines', d: forkGlyph(k) });
  const ripples = svg('g', { class: 'ripples' }, ...[0, 1, 2].map((i) => svg('path', { class: 'ripple', 'data-i': String(i + 1), d: `M ${80 + i * 9} ${150 - 34 - forkHeight(k) * 0.75} q 6 ${forkHeight(k) * 0.2} 0 ${forkHeight(k) * 0.4}` })));
  const b = el('button', { type: 'button', class: 'fork', 'data-k': String(k + 1) },
    svg('svg', { viewBox: '0 0 112 150', class: 'fork-svg', 'aria-hidden': 'true' }, svg('g', { class: 'fork-body' }, tines), ripples));
  b.addEventListener('click', () => strike(k));
  forksRow.append(b);
  return b;
});
function drawFork(k) {
  const b = forks[k];
  b.dataset.level = String(mine[k]);
  b.setAttribute('aria-label', `Tuning fork ${k + 1}: ${mine[k] ? `struck ${mine[k]} of ${STEPS}` : 'silent'}`);
  b.hidden = k >= open;
}

// ── the stage ────────────────────────────────────────────────────────────────────────────────────
function drawBuild(shift = 0) {
  const ln = lane(0, 1);
  violinWave.setAttribute('d', wavePath(VIOLIN, ln, shift));
  mineWave.setAttribute('d', wavePath(mine, ln, shift));
  gap.setAttribute('d', gapPath(VIOLIN, mine, ln));
  const v = differencePercent(VIOLIN, mine);
  diffValue.textContent = v === 0 ? COPY.zero : `${v}${COPY.percent}`;
  diffPanel.classList.toggle('is-zero', v === 0);
}
function run(path, amounts, ln, ms) {                       // a sounding note runs across the stage
  if (REDUCED) return pause(ms);
  const t0 = performance.now();
  return new Promise((resolve) => {
    const step = (t) => {
      path.setAttribute('d', wavePath(amounts, ln, ((t - t0) / 1000) * 0.8));
      if (t - t0 < ms) requestAnimationFrame(step); else { path.setAttribute('d', wavePath(amounts, ln)); resolve(); }
    };
    requestAnimationFrame(step);
  });
}
async function playViolin() { await Promise.all([bow(VIOLIN), run(violinWave, VIOLIN, lane(0, 1), 1900)]); drawBuild(); }
async function playMine() { await Promise.all([bow(mine), run(mineWave, mine, lane(0, 1), 1900)]); drawBuild(); }

let afterStrike = () => {};
function strike(k) {
  if (locked || k >= open) return;
  mine = mine.map((a, i) => (i === k ? (a + 1) % (STEPS + 1) : a));
  strikes++;
  drawFork(k);
  drawBuild();
  const b = forks[k];
  b.classList.remove('ringing');
  void b.offsetWidth;
  if (mine[k] > 0 && !REDUCED) b.classList.add('ringing');
  ring(k, mine[k]);
  afterStrike();
}
function setLocked(v) {
  locked = v;
  forksRow.classList.toggle('is-locked', v);
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
addEventListener('keydown', (e) => { if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') keyboardUser = true; }, true);
addEventListener('pointerdown', () => { keyboardUser = false; }, true);
const followFocus = (t) => { if (keyboardUser) t.focus({ preventScroll: true }); };
const ask = (options) => new Promise((resolve) => {
  const row = el('div', { class: 'choices' });
  const buttons = options.map((o) => {
    const b = el('button', { type: 'button', class: 'choice', text: o });
    b.addEventListener('click', () => { buttons.forEach((x) => { x.disabled = true; }); b.classList.add('picked'); resolve(o); });
    return b;
  });
  row.append(...buttons);
  prompt.append(row);
  requestAnimationFrame(() => row.classList.add('in'));
  followFocus(buttons[0]);
});
const press = (text) => new Promise((resolve) => {
  const b = el('button', { type: 'button', class: 'action', text });
  b.addEventListener('click', () => { b.remove(); resolve(); }, { once: true });
  prompt.append(b);
  requestAnimationFrame(() => b.classList.add('in'));
  followFocus(b);
});
function transportButton(text, onClick) {
  const b = el('button', { type: 'button', class: 'transport-button', text });
  b.addEventListener('click', async () => { if (locked) return; transport.classList.add('busy'); await onClick(); transport.classList.remove('busy'); });
  transport.append(b);
}

// ── the story ────────────────────────────────────────────────────────────────────────────────────
async function opening() {                                  // same note, two sounds
  describe('An empty stage, waiting for a sound.');
  requestAnimationFrame(() => figure.classList.add('in'));
  const top = lane(0, 2);
  const bottom = lane(1, 2);
  placeLabel(forkLabel, top);
  placeLabel(violinLabel, bottom);
  say(COPY.opening, 'lead');
  await pause(reading(COPY.opening));
  await press(COPY.hearFork);
  on(forkWave); on(forkLabel);
  describe('Top: the tuning fork\'s wave, a smooth, even curve.');
  await Promise.all([ring(0, STEPS, 2.2), run(forkWave, TUNING_FORK, top, 2200)]);
  await press(COPY.hearViolin);
  on(violinWave); on(violinLabel);
  describe('Top: the tuning fork\'s smooth curve. Bottom: the violin\'s wave at the same pitch, a jagged, bumpy shape.');
  await Promise.all([bow(VIOLIN, 2.2), run(violinWave, VIOLIN, bottom, 2200)]);
  say(COPY.why.question);
  await ask(COPY.why.choices);
  say(COPY.why.after);
  await wait(900);
  oneFork();
}

async function oneFork() {                                  // try with a single fork
  phase = 'one';
  clear();
  on(forkWave, false); on(forkLabel, false);
  violinWave.classList.add('faint');
  placeLabel(violinLabel, lane(0, 1));
  placeLabel(mineLabel, { top: lane(0, 1).top + 26 });
  on(mineWave); on(mineLabel); on(diffPanel); on(gap);
  drawBuild();
  for (let k = 0; k < FORKS; k++) drawFork(k);           // one fork out; the rest stay in the box
  forksRow.classList.add('in');
  transportButton(COPY.playViolin, playViolin);
  transportButton(COPY.playMine, playMine);
  transport.classList.add('in');
  describe('The violin\'s wave, faint, with your wave over it, still flat. Above: the DIFFERENCE between them, 100%. Below: one tuning fork.');
  say(COPY.task1);
  setLocked(false);
  followFocus(forks[0]);
  const hint = setTimeout(() => { if (strikes === 0) { say(COPY.strikeHint, 'hint'); forks[0].classList.add('nudge'); } }, 6000);
  let idle = null;
  afterStrike = () => {
    clearTimeout(hint);
    forks[0].classList.remove('nudge');
    clearTimeout(idle);
    if (strikes >= 5) whyNot();
    else if (mine[0] === STEPS) idle = setTimeout(whyNot, 3500);
  };
}

async function whyNot() {                                   // it never gets there: why?
  if (phase !== 'one') return;
  phase = 'stuck';
  afterStrike = () => {};
  await wait(900);
  setLocked(true);
  clear();
  say(COPY.oneFork.question);
  await ask(COPY.oneFork.choices);
  say(COPY.oneFork.after);
  await wait(700);
  manyForks();
}

function manyForks() {                                      // the box opens: smaller forks, higher tones
  phase = 'many';
  open = FORKS;
  for (let k = 0; k < FORKS; k++) drawFork(k);
  forks.slice(1).forEach((b) => b.classList.add('new'));
  clear();
  say(COPY.task2);
  describe('Three more tuning forks, each smaller than the last.');
  setLocked(false);
  afterStrike = () => { if (differencePercent(VIOLIN, mine) === 0) matched(); };
}

async function matched() {                                  // DIFFERENCE 0
  phase = 'zero';
  setLocked(true);
  diffPanel.classList.add('glow');
  describe('Your wave lies exactly on the violin\'s. The DIFFERENCE is 0.');
  await wait(600);
  clear();
  say(COPY.reached, 'lead');
  await playMine();
  await wait(250);
  await playViolin();
  inside();
}

async function inside() {                                   // what was in the note? say it, then see it
  phase = 'inside';
  say(COPY.inside.question);
  await ask(COPY.inside.choices);
  say(COPY.inside.after);
  transport.classList.remove('in');
  for (const n of [mineWave, mineLabel, violinLabel, gap, diffPanel]) on(n, false);
  violinWave.classList.remove('faint');
  const whole = lane(0, 1);
  const shown = VIOLIN.map((_, k) => k).filter((k) => VIOLIN[k] > 0);
  parts.replaceChildren(...shown.map((k) => {
    const ln = lane(k, FORKS);
    const p = svg('path', { class: 'wave part-wave', d: wavePath(part(VIOLIN, k), ln) });
    p.style.transform = `translateY(${whole.cy - ln.cy}px)`;
    return p;
  }));
  on(parts);
  await wait(500);
  on(violinWave, false);
  parts.querySelectorAll('.part-wave').forEach((p, i) => { setTimeout(() => { p.style.transform = 'none'; }, REDUCED ? 0 : i * 160); });
  describe('The violin\'s wave comes apart into four smooth waves, one under another: one for each tuning fork, the biggest first.');
  for (let k = 0; k < FORKS; k++) { if (!REDUCED) forks[k].classList.add('ringing'); ring(k, VIOLIN[k], 1.2); await wait(380); }
  await pause(1600);
  clear();
  say(COPY.takeaway);
  await pause(reading(COPY.takeaway) + 600);
  phase = 'final';
  say(COPY.final, 'final');
}

// read-only view for automated checks (no learner-facing effect)
window.__level2 = { get phase() { return phase; }, get mine() { return [...mine]; }, get difference() { return differencePercent(VIOLIN, mine); }, get open() { return open; } };

setLocked(true);
opening();
