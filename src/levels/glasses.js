// Level 3, "The magic glasses" (docs/levels_spec.md). Here is the mathematical tool that lets us start seeing it.
//
// A violin tuner hears your A note and names one note, like your ear. The sound itself is a squiggle nobody can read.
// So: magic glasses. Put them on and the squiggle splits into bars, one per hidden note. Take them off and on. Drag
// the bars to make a tuning fork, then bring the notes back. Then the scanner's messy squiggle goes through the same
// glasses, built into a machine, and each turn of its crank prints a row of the picture. Only then does the tool get
// its name. Every learner-facing line comes from copyGlasses.js; every position, bar and row from src/math (glasses.js,
// tones.js, scanner.js).
import './glasses.css';

import { COPY } from './copyGlasses.js';
import { A_NOTE, STEPS, PITCH, part } from '../math/tones.js';
import {
  BOARD, TUNER, needleAngle, tick, STRIP, SPECTRUM, squiggle, barX, barHeight, barAt, stepsAt, pureTone, allBack,
  MACHINE, chordSamples, unmix, pictureRows, rowOrder, rainbow, samplesPath,
} from '../math/glasses.js';

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
const NOTE_COLORS = ['#1a66e0', '#12907e', '#7a55d6', '#b07a12'];

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let phase = 'recap';
let mine = [...A_NOTE];
let glassesOn = false;
let turns = 0;

// ── sound (only after a tap) ─────────────────────────────────────────────────────────────────────
let ctx = null;
function audio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx ??= new AC(); if (ctx.state === 'suspended') ctx.resume(); } catch { return null; }
  return ctx;
}
/** A held note made of the given amounts of the four tones (the violin's bow and vibrato). */
function play(amounts, seconds = 1.6) {
  const c = audio();
  if (c && amounts.some((a) => a > 0)) {
    const real = new Float32Array(amounts.length + 1);
    const imag = new Float32Array(amounts.length + 1);
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
    g.gain.linearRampToValueAtTime(0.15, t + 0.08);
    g.gain.setValueAtTime(0.15, t + seconds - 0.3);
    g.gain.linearRampToValueAtTime(0, t + seconds);
    osc.connect(g).connect(c.destination);
    osc.start(t); lfo.start(t);
    osc.stop(t + seconds + 0.05); lfo.stop(t + seconds + 0.05);
  }
  return pause(seconds * 1000);
}
function clunk() {                                          // the crank turns
  const c = audio();
  if (!c) return;
  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 180;
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.16);
}

// ── page ─────────────────────────────────────────────────────────────────────────────────────────
const root = document.getElementById('glasses-lesson');
const figure = el('figure', { class: 'figure glasses-figure' });
const controls = el('div', { class: 'controls' });
const prompt = el('div', { class: 'prompt', 'aria-live': 'polite' });
root.append(figure, controls, prompt);
const board = svg('svg', { viewBox: `0 0 ${BOARD.w} ${BOARD.h}`, class: 'glasses-board', role: 'img' });
const describe = (text) => board.setAttribute('aria-label', text);
figure.append(board);
const stops = [0, 40, 60, 140, 210, 280].map((h, i, a) => svg('stop', { offset: `${(100 * i) / (a.length - 1)}%`, 'stop-color': `hsl(${h}, 80%, 55%)` }));
board.append(svg('defs', {}, svg('linearGradient', { id: 'f3-rainbow', x1: '0', y1: '0', x2: '1', y2: '1' }, ...stops)));

// the tuner
const T = TUNER;
const needle = svg('g', { class: 'needle', style: `transform-origin: ${T.meter.cx}px ${T.meter.cy}px; transform: rotate(${-T.meter.span}deg)` },
  svg('line', { x1: T.meter.cx, y1: T.meter.cy, x2: T.meter.cx, y2: T.meter.cy - T.meter.r + 6 }),
  svg('circle', { cx: T.meter.cx, cy: T.meter.cy, r: 6 }));
const letter = svg('text', { class: 'tuner-letter', x: T.letter.x, y: T.letter.y, 'text-anchor': 'middle', text: COPY.tunerLetter });
const light = svg('circle', { class: 'tuner-light', cx: T.light.cx, cy: T.light.cy, r: T.light.r });
const ticks = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map((c) => {
  const t = tick(needleAngle(c), c === 0 || Math.abs(c) === 50);
  return svg('line', { class: `tick${c === 0 ? ' centre' : ''}`, x1: t.x1.toFixed(1), y1: t.y1.toFixed(1), x2: t.x2.toFixed(1), y2: t.y2.toFixed(1) });
});
const tuner = svg('g', { class: 'scene tuner on' },
  svg('rect', { class: 'tuner-clip', x: T.clip.x, y: T.clip.y, width: T.clip.w, height: T.clip.h, rx: T.clip.r }),
  svg('rect', { class: 'tuner-body', x: T.body.x, y: T.body.y, width: T.body.w, height: T.body.h, rx: T.body.r }),
  svg('rect', { class: 'tuner-screen', x: T.screen.x, y: T.screen.y, width: T.screen.w, height: T.screen.h, rx: T.screen.r }),
  ...ticks, letter, needle, light);

// the sound as a squiggle (and, for the split, its four tones)
const strip = svg('g', { class: 'scene strip' });
const squigglePath = svg('path', { class: 'squiggle' });
const parts = A_NOTE.map((_, k) => svg('path', { class: 'part', stroke: NOTE_COLORS[k], d: squiggle(part(A_NOTE, k)) }));
strip.append(svg('rect', { class: 'strip-box', x: STRIP.x - 14, y: STRIP.y - 10, width: STRIP.w + 28, height: STRIP.h + 20, rx: 16 }), squigglePath, ...parts);

// through the glasses: bars
const spectrum = svg('g', { class: 'scene spectrum' });
const bars = A_NOTE.map((_, k) => svg('rect', { class: 'bar', fill: NOTE_COLORS[k], x: barX(k) - SPECTRUM.barW / 2, width: SPECTRUM.barW, rx: 6 }));
const barLabels = A_NOTE.map((_, k) => svg('text', { class: 'bar-label', x: barX(k), y: SPECTRUM.base + 26, 'text-anchor': 'middle', fill: NOTE_COLORS[k], text: COPY.notes[k] }));
const fourBars = svg('g', { class: 'four-bars' }, ...bars, ...barLabels);
const manyBars = svg('g', { class: 'many-bars' });
spectrum.append(svg('line', { class: 'baseline', x1: SPECTRUM.x - 20, x2: SPECTRUM.x + SPECTRUM.w + 20, y1: SPECTRUM.base, y2: SPECTRUM.base }), fourBars, manyBars);

// the Fourier machine
const M = MACHINE;
const inputPath = svg('path', { class: 'input-squiggle' });
const windowBars = svg('g', { class: 'window-bars' });
const crank = svg('g', { class: 'crank', style: `transform-origin: ${M.crank.cx}px ${M.crank.cy}px`, tabindex: '0', role: 'button', 'aria-label': 'Turn the crank' },
  svg('circle', { class: 'crank-hit', cx: M.crank.cx, cy: M.crank.cy, r: M.crank.r + 18 }),
  svg('line', { class: 'crank-arm', x1: M.crank.cx, y1: M.crank.cy, x2: M.crank.cx + M.crank.r, y2: M.crank.cy - M.crank.r * 0.4 }),
  svg('circle', { class: 'crank-knob', cx: M.crank.cx + M.crank.r, cy: M.crank.cy - M.crank.r * 0.4, r: 8 }),
  svg('circle', { class: 'crank-hub', cx: M.crank.cx, cy: M.crank.cy, r: 7 }));
const canvas = svg('g', { class: 'canvas' }, svg('rect', { class: 'canvas-box', x: M.picture.x - 4, y: M.picture.y - 4, width: M.picture.size + 8, height: M.picture.size + 8, rx: 10 }));
const machine = svg('g', { class: 'scene machine' },
  svg('rect', { class: 'input-box', x: M.input.x, y: M.input.y, width: M.input.w, height: M.input.h, rx: 14 }), inputPath,
  svg('path', { class: 'chute', d: `M ${M.input.x + M.input.w} ${M.input.y + M.input.h / 2} H ${M.box.x}` }),
  svg('rect', { class: 'machine-box', x: M.box.x, y: M.box.y, width: M.box.w, height: M.box.h, rx: M.box.r }),
  svg('rect', { class: 'machine-window', x: M.window.x, y: M.window.y, width: M.window.w, height: M.window.h, rx: 10 }), windowBars,
  svg('path', { class: 'chute', d: `M ${M.box.x + M.box.w} ${M.picture.y + M.picture.size / 2} H ${M.picture.x - 6}` }),
  canvas, crank);

// the rainbow frame: you are wearing the glasses
const frame = svg('rect', { class: 'rainbow-frame', x: 4, y: 4, width: BOARD.w - 8, height: BOARD.h - 8, rx: 22 });
board.append(tuner, strip, spectrum, machine, frame);

// the glasses, flying onto your face
const glassesArt = () => {
  const s = svg('svg', { viewBox: '0 0 400 160', class: 'glasses-art', 'aria-hidden': 'true' });
  s.append(svg('defs', {}, svg('linearGradient', { id: 'f3-rim', x1: '0', y1: '0', x2: '1', y2: '0' }, ...[0, 40, 60, 140, 210, 280].map((h, i) => svg('stop', { offset: `${i * 20}%`, 'stop-color': `hsl(${h}, 85%, 55%)` })))),
    svg('circle', { class: 'lens', cx: 110, cy: 84, r: 62 }), svg('circle', { class: 'lens', cx: 290, cy: 84, r: 62 }),
    svg('path', { class: 'rim', d: 'M 48 84 a 62 62 0 1 0 124 0 a 62 62 0 1 0 -124 0 M 228 84 a 62 62 0 1 0 124 0 a 62 62 0 1 0 -124 0 M 172 76 Q 200 56 228 76' }),
    svg('path', { class: 'temple', d: 'M 48 70 L 6 52 M 352 70 L 394 52' }));
  return s;
};
async function putGlassesOn() {
  if (!REDUCED) {
    const overlay = el('div', { class: 'glasses-overlay' });
    overlay.append(glassesArt());
    document.body.append(overlay);
    await new Promise((r) => { overlay.addEventListener('animationend', r, { once: true }); setTimeout(r, 1600); });
    overlay.remove();
  }
  glassesOn = true;
  figure.classList.add('glasses');
}

// ── drawing ──────────────────────────────────────────────────────────────────────────────────────
function drawBars() {
  bars.forEach((b, k) => { const h = barHeight(mine[k]); b.setAttribute('y', SPECTRUM.base - h); b.setAttribute('height', Math.max(0.001, h)); });
}
let scrolling = null;
function runSquiggle(amounts) {                             // the squiggle drifts by while a sound plays
  const t0 = performance.now();
  scrolling = amounts;
  const frame = (now) => {
    if (scrolling !== amounts) return;
    squigglePath.setAttribute('d', squiggle(amounts, REDUCED ? 0 : ((now - t0) / 1000) * 0.4));
    if (!REDUCED) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
const still = (amounts) => { scrolling = null; squigglePath.setAttribute('d', squiggle(amounts)); };

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
const press = (text, where = prompt) => new Promise((resolve) => {
  const b = el('button', { type: 'button', class: 'action', text });
  b.addEventListener('click', () => { b.remove(); resolve(); }, { once: true });
  where.append(b);
  requestAnimationFrame(() => b.classList.add('in'));
  followFocus(b);
});

// ── the story ────────────────────────────────────────────────────────────────────────────────────
async function recap() {                                    // what the first two levels found
  describe('A violin tuner: a small box with a dial, a needle and a light.');
  requestAnimationFrame(() => figure.classList.add('in'));
  say(COPY.recap[0], 'lead');
  await pause(reading(COPY.recap[0]));
  say(COPY.recap[1]);
  await pause(reading(COPY.recap[1]));
  say(COPY.tunerIntro);
  await press(COPY.play);
  phase = 'tuner';
  needle.style.transform = 'rotate(0deg)';
  tuner.classList.add('listening');
  await play(A_NOTE, 1.8);
  tuner.classList.add('in-tune');
  describe('The needle settles in the middle, the light turns green, and the tuner shows one letter: A.');
  say(COPY.tunerSays);
  await pause(reading(COPY.tunerSays));
  say(COPY.thanks[0]);
  await pause(reading(COPY.thanks[0]));
  say(COPY.thanks[1]);
  await pause(reading(COPY.thanks[1]) + 300);
  squiggleScene();
}

async function squiggleScene() {                            // the sound itself: a squiggle
  phase = 'squiggle';
  clear();
  on(tuner, false);
  on(strip);
  runSquiggle(A_NOTE);
  describe('The A note drawn as a squiggle: a bumpy wave running across.');
  say(COPY.squiggle);
  await pause(reading(COPY.squiggle));
  say(COPY.see.question);
  await ask(COPY.see.choices);
  say(COPY.see.after);
  await pause(reading(COPY.see.after) + 300);
  theGlasses();
}

async function theGlasses() {                               // if only…
  phase = 'glasses';
  clear();
  say(COPY.ifOnly, 'lead');
  await pause(900);
  await press(COPY.putOn);
  clear();
  await putGlassesOn();
  still(A_NOTE);
  on(spectrum);
  mine = [...A_NOTE];
  bars.forEach((b) => b.classList.add('growing'));
  drawBars();
  strip.classList.add('splitting');                         // the four tones lift out of the squiggle …
  await wait(900);
  parts.forEach((p, k) => {                                 // … and each drops into its bar
    p.style.transform = `translate(${barX(k) - (STRIP.x + STRIP.w / 2)}px, ${SPECTRUM.base - barHeight(A_NOTE[k]) / 2 - (STRIP.y + STRIP.h / 2)}px) scale(0.09, 0.5)`;
  });
  strip.classList.add('dropping');
  await wait(700);
  bars.forEach((b) => b.classList.remove('growing'));
  fourBars.classList.add('on');
  await wait(600);
  strip.classList.remove('splitting', 'dropping');
  parts.forEach((p) => { p.style.transform = ''; });
  describe('Wearing the glasses: under the squiggle, four coloured bars, labelled A, high A, E and higher A, tallest first.');
  say(COPY.bars, 'lead');
  await pause(reading(COPY.bars));
  say(COPY.prism);
  await pause(reading(COPY.prism) + 300);
  offAndOn();
}

async function offAndOn() {                                 // take them off and on: same sound, two views
  phase = 'toggle';
  clear();
  say(COPY.toggle);
  const b = el('button', { type: 'button', class: 'action in', text: COPY.takeOff });
  controls.replaceChildren(b);
  followFocus(b);
  let flips = 0;
  await new Promise((resolve) => b.addEventListener('click', () => {
    glassesOn = !glassesOn;
    figure.classList.toggle('glasses', glassesOn);
    on(spectrum, glassesOn);
    b.textContent = glassesOn ? COPY.takeOff : COPY.putBack;
    flips++;
    if (flips >= 2 && glassesOn) resolve();
  }));
  controls.replaceChildren();
  say(COPY.twoWays, 'lead');
  await pause(reading(COPY.twoWays) + 300);
  tuningFork();
}

function dragBars(onChange) {                               // drag on the bars: each bar's height follows the pointer
  board.classList.add('dragging-on');
  let down = false;
  const pt = (e) => { const p = board.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(board.getScreenCTM().inverse()); };
  const set = (e) => {
    const q = pt(e);
    if (q.y < SPECTRUM.base - barHeight(STEPS) - 40) return;
    const k = barAt(q.x);
    const v = stepsAt(q.y);
    if (mine[k] !== v) { mine = mine.map((a, i) => (i === k ? v : a)); drawBars(); still(mine); onChange(); }
  };
  const pd = (e) => { down = true; board.setPointerCapture(e.pointerId); set(e); };
  const pm = (e) => { if (down) set(e); };
  const pu = () => { if (!down) return; down = false; play(mine, 0.9); };
  board.addEventListener('pointerdown', pd);
  board.addEventListener('pointermove', pm);
  board.addEventListener('pointerup', pu);
  board.addEventListener('pointercancel', pu);
  return () => { board.classList.remove('dragging-on'); for (const [t, f] of [['pointerdown', pd], ['pointermove', pm], ['pointerup', pu], ['pointercancel', pu]]) board.removeEventListener(t, f); };
}

async function tuningFork() {                               // one bar, then all of them back
  phase = 'pure';
  clear();
  say(COPY.pure);
  describe('Drag the bars up and down. The squiggle above changes with them.');
  const hint = setTimeout(() => { if (phase === 'pure') say(COPY.pureHint, 'hint'); }, 9000);
  await new Promise((resolve) => {
    const stop = dragBars(() => {
      if (phase === 'pure' && pureTone(mine)) {
        clearTimeout(hint);
        phase = 'back';
        clear();
        say(COPY.pureDone, 'lead');
        setTimeout(() => say(COPY.back), REDUCED ? 0 : 1600);
      } else if (phase === 'back' && allBack(mine)) {
        stop();
        resolve();
      }
    });
  });
  clear();
  say(COPY.backDone, 'lead');
  await play(mine, 1.4);
  await pause(reading(COPY.backDone));
  theScanner();
}

async function theScanner() {                               // the scanner's reply: a much messier squiggle
  phase = 'scanner';
  clear();
  fourBars.classList.remove('on');
  on(spectrum, false);
  const rows = pictureRows();
  const middle = rows[Math.floor(rows.length / 2)];
  const samples = chordSamples(middle);
  scrolling = null;
  squigglePath.setAttribute('d', samplesPath(samples, { x: STRIP.x, y: STRIP.y, w: STRIP.w, h: STRIP.h }));
  strip.classList.add('radio');
  say(COPY.scanner[0], 'lead');
  await pause(reading(COPY.scanner[0]));
  say(COPY.scanner[1]);
  describe('A dense, tangled squiggle: the scanner\'s reply.');
  await press(COPY.glassesOn);
  const amounts = unmix(samples, middle.length);
  const w = SPECTRUM.w / amounts.length;
  manyBars.replaceChildren(...amounts.map((a, i) => svg('rect', { class: 'thin-bar', fill: rainbow(i, amounts.length), x: (SPECTRUM.x + i * w + w * 0.15).toFixed(2), y: (SPECTRUM.base - Math.max(0, a) * barHeight(STEPS)).toFixed(2), width: (w * 0.7).toFixed(2), height: Math.max(0.001, Math.max(0, a) * barHeight(STEPS)).toFixed(2) })));
  on(spectrum);
  manyBars.classList.add('on');
  describe('Through the glasses: a long row of thin rainbow bars, short at the ends, tall in the middle.');
  say(COPY.manyBars);
  await pause(reading(COPY.manyBars) + 600);
  theMachine(rows);
}

async function theMachine(rows) {                           // squiggles in, a picture out
  phase = 'machine';
  clear();
  on(strip, false); on(spectrum, false);
  on(machine);
  const n = rows.length;
  const cell = MACHINE.picture.size / n;
  const order = rowOrder(n);
  const printRow = (j, animate) => {
    const samples = chordSamples(rows[j]);
    const amounts = unmix(samples, n);                      // the glasses inside the machine
    const ww = MACHINE.window.w / n;
    windowBars.replaceChildren(...amounts.map((a, i) => svg('rect', { fill: rainbow(i, n), x: (MACHINE.window.x + i * ww).toFixed(2), y: (MACHINE.window.y + MACHINE.window.h - 6 - Math.max(0, a) * (MACHINE.window.h - 14)).toFixed(2), width: (ww * 0.8).toFixed(2), height: (Math.max(0, a) * (MACHINE.window.h - 14) + 0.001).toFixed(2) })));
    canvas.append(...amounts.map((a, i) => {
      const v = Math.round(255 * Math.min(1, Math.max(0, a)));
      return svg('rect', { class: animate ? 'pixel fresh' : 'pixel', x: (MACHINE.picture.x + i * cell).toFixed(2), y: (MACHINE.picture.y + j * cell).toFixed(2), width: (cell + 0.4).toFixed(2), height: (cell + 0.4).toFixed(2), fill: `rgb(${v},${v},${v})` });
    }));
  };
  const loadNext = () => { if (turns < n) inputPath.setAttribute('d', samplesPath(chordSamples(rows[order[turns]]), { x: MACHINE.input.x + 10, y: MACHINE.input.y + 10, w: MACHINE.input.w - 20, h: MACHINE.input.h - 20 })); };
  loadNext();
  describe('The Fourier machine: a squiggle waits on the left, a box with a rainbow window and a crank in the middle, an empty black picture on the right.');
  say(COPY.crankIntro);
  const button = el('button', { type: 'button', class: 'action in', text: COPY.crank });
  controls.replaceChildren(button);
  followFocus(button);
  await new Promise((resolve) => {
    let busy = false;
    const turn = async () => {
      if (busy || turns >= 4) return;
      busy = true;
      clunk();
      crank.style.transform = `rotate(${(turns + 1) * 360}deg)`;
      inputPath.classList.add('feeding');
      await wait(450);
      printRow(order[turns], true);
      turns++;
      inputPath.classList.remove('feeding');
      loadNext();
      busy = false;
      if (turns >= 4) resolve();
    };
    button.addEventListener('click', turn);
    crank.addEventListener('click', turn);
    crank.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); turn(); } });
  });
  controls.replaceChildren();
  say(COPY.speedUp);
  await pause(reading(COPY.speedUp) - 600);
  machine.classList.add('fast');
  while (turns < n) {
    crank.style.transform = `rotate(${(turns + 1) * 360}deg)`;
    printRow(order[turns], false);
    turns++;
    loadNext();
    if (!REDUCED) await pause(45);
  }
  describe('Row by row, the machine prints a picture of a head.');
  clear();
  say(COPY.pictureOut, 'lead');
  await pause(reading(COPY.pictureOut) + 600);
  naming();
}

async function naming() {                                   // only now: its name
  phase = 'name';
  clear();
  say(COPY.name[0], 'lead');
  await pause(reading(COPY.name[0]));
  say(COPY.name[1]);
  await pause(reading(COPY.name[1]) + 900);
  phase = 'final';
  clear();
  say(COPY.final, 'final');
  root.dispatchEvent(new CustomEvent('level-finished', { bubbles: true }));
}

// read-only view for automated checks (no learner-facing effect)
window.__glasses = { get phase() { return phase; }, get mine() { return [...mine]; }, get glasses() { return glassesOn; }, get turns() { return turns; } };

recap();
