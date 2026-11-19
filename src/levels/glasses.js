// Level 3, "The magic glasses" (docs/levels_spec.md). It comes straight after Level 2: after your scan, you head back
// to the concert hall. Your tuner draws your A note as a signal and names one note; the little signal grows out of its
// screen. A stage light through a prism splits into colours, so: a prism for sound, pictured as glasses. Put them on
// and the board dims to a night-city dark; the four notes lift out of the signal and glow as bars. Take them off and
// on. Make a tuning fork, bring the notes back. The scanner's busier signal gets the same treatment, then the signal
// and the bars shrink into a machine whose crank turns signals into rows of a picture. Only then the name.
// Scenes move into one another rather than swap. Every learner-facing line comes from copyGlasses.js; every
// position, bar and row from src/math (glasses.js, tones.js, scanner.js).
import './glasses.css';

import { COPY } from './copyGlasses.js';
import { A_NOTE, STEPS, PITCH, part } from '../math/tones.js';
import {
  BOARD, css, STRIP, STRIP_BOX, signal, samplesPath, TUNER, onTuner, PRISM, prismCorners, prismRays, neon, NOTE_LED,
  SPECTRUM, barX, barHeight, barAt, stepsAt, pureTone, allBack, MACHINE, stripToInput, spectrumToWindow,
  chordSamples, unmix, pictureRows, rowOrder,
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

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let phase = 'opening';
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
const ledStops = (id, dir) => svg('linearGradient', { id, x1: '0', y1: '0', x2: dir ? '1' : '1', y2: dir ? '1' : '0' },
  ...Array.from({ length: 7 }, (_, i) => svg('stop', { offset: `${(100 * i) / 6}%`, 'stop-color': neon(i, 7) })));
board.append(svg('defs', {}, ledStops('f3-led', true),
  svg('filter', { id: 'f3-glow', x: '-30%', y: '-30%', width: '160%', height: '160%' },
    svg('feGaussianBlur', { stdDeviation: '3', result: 'b' }), svg('feMerge', {}, svg('feMergeNode', { in: 'b' }), svg('feMergeNode', { in: 'SourceGraphic' })))));
const bg = svg('rect', { class: 'bg', x: 0, y: 0, width: BOARD.w, height: BOARD.h });

// the prism, where the bars will stand
const corners = prismCorners();
const { beam, rays } = prismRays();
const prism = svg('g', { class: 'scene prism' },
  svg('line', { class: 'beam', x1: beam.from.x, y1: beam.from.y, x2: beam.to.x, y2: beam.to.y }),
  ...rays.map((r, i) => svg('line', { class: 'ray', stroke: r.color, style: `transition-delay: ${300 + i * 70}ms`, x1: r.from.x.toFixed(1), y1: r.from.y.toFixed(1), x2: r.to.x, y2: r.to.y.toFixed(1) })),
  svg('polygon', { class: 'glass', points: corners.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') }));

// the tuner, clipped to your violin's scroll
const T = TUNER;
const letter = svg('text', { class: 'tuner-letter', x: T.letter.x, y: T.letter.y, 'text-anchor': 'middle', text: COPY.tunerLetter });
const light = svg('circle', { class: 'tuner-light', cx: T.light.cx, cy: T.light.cy, r: T.light.r });
const tuner = svg('g', { class: 'scene tuner on' },
  svg('rect', { class: 'pegbox', x: T.pegbox.x, y: T.pegbox.y, width: T.pegbox.w, height: T.pegbox.h, rx: 6 }),
  svg('circle', { class: 'scroll', cx: T.scroll.cx, cy: T.scroll.cy, r: T.scroll.r }),
  svg('path', { class: 'scroll-curl', d: `M ${T.scroll.cx} ${T.scroll.cy} m -10 0 a 10 10 0 1 1 10 10 a 6 6 0 1 1 -6 -6` }),
  svg('rect', { class: 'tuner-clip', x: T.clip.x, y: T.clip.y, width: T.clip.w, height: T.clip.h, rx: T.clip.r }),
  svg('rect', { class: 'tuner-body', x: T.body.x, y: T.body.y, width: T.body.w, height: T.body.h, rx: T.body.r }),
  svg('rect', { class: 'tuner-screen', x: T.screen.x, y: T.screen.y, width: T.screen.w, height: T.screen.h, rx: T.screen.r }),
  letter, light);

// the signal: drawn big, shown small on the tuner first; later it shrinks into the machine's input
const signalPath = svg('path', { class: 'signal' });
const parts = A_NOTE.map((_, k) => svg('path', { class: 'part', stroke: NOTE_LED[k], d: signal(part(A_NOTE, k)) }));
const stripBox = svg('rect', { class: 'strip-box', x: STRIP_BOX.x, y: STRIP_BOX.y, width: STRIP_BOX.w, height: STRIP_BOX.h, rx: 16 });
const signalInner = svg('g', { class: 'signal-inner' }, signalPath);
const strip = svg('g', { class: 'strip small', style: `transform: ${css(onTuner())}` }, stripBox, signalInner, ...parts);

// through the glasses: bars (later shrinking into the machine's window)
const bars = A_NOTE.map((_, k) => svg('rect', { class: 'bar', fill: NOTE_LED[k], x: barX(k) - SPECTRUM.barW / 2, width: SPECTRUM.barW, rx: 6 }));
const barLabels = A_NOTE.map((_, k) => svg('text', { class: 'bar-label', x: barX(k), y: SPECTRUM.base + 26, 'text-anchor': 'middle', fill: NOTE_LED[k], text: COPY.notes[k] }));
const fourBars = svg('g', { class: 'four-bars' }, ...bars, ...barLabels);
const manyBars = svg('g', { class: 'many-bars' });
const spectrum = svg('g', { class: 'spectrum' }, svg('line', { class: 'baseline', x1: SPECTRUM.x - 20, x2: SPECTRUM.x + SPECTRUM.w + 20, y1: SPECTRUM.base, y2: SPECTRUM.base }), fourBars, manyBars);

// the Fourier machine, built around the shrunken signal and bars
const M = MACHINE;
const machineBack = svg('g', { class: 'scene machine-back' },
  svg('path', { class: 'chute', d: `M ${M.input.x + M.input.w} ${M.input.y + M.input.h / 2} H ${M.box.x}` }),
  svg('path', { class: 'chute', d: `M ${M.box.x + M.box.w} ${M.picture.y + M.picture.size / 2} H ${M.picture.x - 6}` }),
  svg('rect', { class: 'machine-box', x: M.box.x, y: M.box.y, width: M.box.w, height: M.box.h, rx: M.box.r }));
const crank = svg('g', { class: 'crank', style: `transform-origin: ${M.crank.cx}px ${M.crank.cy}px`, tabindex: '0', role: 'button', 'aria-label': COPY.crank },
  svg('circle', { class: 'crank-hit', cx: M.crank.cx, cy: M.crank.cy, r: M.crank.r + 18 }),
  svg('line', { class: 'crank-arm', x1: M.crank.cx, y1: M.crank.cy, x2: M.crank.cx + M.crank.r, y2: M.crank.cy - M.crank.r * 0.4 }),
  svg('circle', { class: 'crank-knob', cx: M.crank.cx + M.crank.r, cy: M.crank.cy - M.crank.r * 0.4, r: 8 }),
  svg('circle', { class: 'crank-hub', cx: M.crank.cx, cy: M.crank.cy, r: 7 }));
const canvas = svg('g', { class: 'canvas' }, svg('rect', { class: 'canvas-box', x: M.picture.x - 4, y: M.picture.y - 4, width: M.picture.size + 8, height: M.picture.size + 8, rx: 10 }));
const machineFront = svg('g', { class: 'scene machine-front' },
  svg('rect', { class: 'machine-window', x: M.window.x - 4, y: M.window.y - 4, width: M.window.w + 8, height: M.window.h + 8, rx: 10 }), canvas, crank);

// wearing the glasses: an LED frame
const frame = svg('rect', { class: 'led-frame', x: 4, y: 4, width: BOARD.w - 8, height: BOARD.h - 8, rx: 22 });
board.append(bg, prism, machineBack, tuner, strip, spectrum, machineFront, frame);

// the glasses, flying onto your face
const glassesArt = () => {
  const s = svg('svg', { viewBox: '0 0 400 160', class: 'glasses-art', 'aria-hidden': 'true' });
  s.append(svg('defs', {}, svg('linearGradient', { id: 'f3-rim', x1: '0', y1: '0', x2: '1', y2: '0' }, ...Array.from({ length: 7 }, (_, i) => svg('stop', { offset: `${(100 * i) / 6}%`, 'stop-color': neon(i, 7) })))),
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
    setTimeout(() => board.classList.add('night'), 650);   // the room dims as they reach your eyes
    await new Promise((r) => { overlay.addEventListener('animationend', r, { once: true }); setTimeout(r, 1600); });
    overlay.remove();
  }
  glassesOn = true;
  board.classList.add('night');
  figure.classList.add('glasses');
}

// ── drawing ──────────────────────────────────────────────────────────────────────────────────────
function drawBars() {
  bars.forEach((b, k) => { const h = barHeight(mine[k]); b.setAttribute('y', SPECTRUM.base - h); b.setAttribute('height', Math.max(0.001, h)); });
}
let running = null;
function runSignal(amounts) {                               // the signal drifts by, as sound does
  const t0 = performance.now();
  running = amounts;
  const frame = (now) => {
    if (running !== amounts) return;
    signalPath.setAttribute('d', signal(amounts, REDUCED ? 0 : ((now - t0) / 1000) * 0.4));
    if (!REDUCED) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
const still = (amounts) => { running = null; signalPath.setAttribute('d', signal(amounts)); };

// ── the prompt: lines fade in, and fade out together before the next part ─────────────────────────────
const say = (text, cls = '') => {
  const p = el('p', { class: `line ${cls}`.trim(), text });
  prompt.append(p);
  requestAnimationFrame(() => p.classList.add('in'));
  return p;
};
async function clear() {
  const old = [...prompt.children];
  if (!old.length) return;
  old.forEach((n) => n.classList.add('leaving'));
  await pause(REDUCED ? 0 : 280);
  old.forEach((n) => n.remove());
}
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
  controls.replaceChildren(b);
  requestAnimationFrame(() => b.classList.add('in'));
  followFocus(b);
});

// ── the story ────────────────────────────────────────────────────────────────────────────────────
async function opening() {                                  // back at the concert hall, with a tuner
  describe("A tuner clipped to the scroll of your violin. Its screen is blank.");
  requestAnimationFrame(() => figure.classList.add('in'));
  say(COPY.opening[0], 'lead');
  await pause(reading(COPY.opening[0]));
  say(COPY.opening[1]);
  await press(COPY.play);
  phase = 'tuner';
  runSignal(A_NOTE);                                         // the signal appears on the tuner's screen as you play
  tuner.classList.add('listening');
  await play(A_NOTE, 1.8);
  tuner.classList.add('in-tune');
  describe('On the tuner\'s screen, your note drawn as a bumpy line, with the letter A under it and a green light.');
  say(COPY.drawsSignal);
  await pause(reading(COPY.drawsSignal));
  say(COPY.namesOne);
  await pause(reading(COPY.namesOne) + 300);
  growTheSignal();
}

async function growTheSignal() {                            // the little signal grows out of the screen
  phase = 'signal';
  await clear();
  tuner.classList.add('leaving');
  strip.classList.remove('small');
  strip.style.transform = 'none';
  await wait(1100);
  on(tuner, false);
  describe('Your note\'s signal, big now: a bumpy line drifting across.');
  say(COPY.knowBetter);
  await pause(reading(COPY.knowBetter));
  say(COPY.see.question);
  await ask(COPY.see.choices);
  say(COPY.see.after);
  await pause(reading(COPY.see.after) + 200);
  thePrism();
}

async function thePrism() {                                 // a stage light through a prism
  phase = 'prism';
  await clear();
  on(prism);
  await wait(60);
  prism.classList.add('shining');
  describe('Below the signal, a white beam of light enters a glass prism and comes out as a fan of coloured rays.');
  say(COPY.prism[0]);
  await pause(reading(COPY.prism[0]));
  say(COPY.prism[1]);
  await pause(reading(COPY.prism[1]) + 300);
  say(COPY.ifOnly, 'lead');
  await pause(1400);
  say(COPY.thereIs);
  await press(COPY.putOn);
  theGlasses();
}

async function theGlasses() {                               // the room dims; the notes light up
  phase = 'glasses';
  await clear();
  controls.replaceChildren();
  await putGlassesOn();
  still(A_NOTE);
  prism.classList.add('fading');                            // the rays give way to the bars
  mine = [...A_NOTE];
  bars.forEach((b) => b.classList.add('growing'));
  drawBars();
  on(spectrum);
  strip.classList.add('splitting');                         // the four notes lift out of the signal …
  await wait(900);
  parts.forEach((p, k) => {                                 // … and each drops into its bar
    p.style.transform = `translate(${barX(k) - (STRIP.x + STRIP.w / 2)}px, ${SPECTRUM.base - barHeight(A_NOTE[k]) / 2 - (STRIP.y + STRIP.h / 2)}px) scale(0.09, 0.5)`;
  });
  strip.classList.add('dropping');
  on(prism, false);                                          // the rays give way as the notes land
  await wait(650);
  bars.forEach((b) => b.classList.remove('growing'));
  fourBars.classList.add('on');
  await wait(600);
  strip.classList.remove('splitting', 'dropping');
  parts.forEach((p) => { p.style.transform = ''; });
  describe('In the dark, under the signal, four glowing bars, labelled A, high A, E and higher A, tallest first.');
  say(COPY.split, 'lead');
  await pause(reading(COPY.split));
  say(COPY.howMuch);
  await pause(reading(COPY.howMuch) + 300);
  offAndOn();
}

async function offAndOn() {                                 // take them off and on: one sound, two views
  phase = 'toggle';
  await clear();
  say(COPY.toggle);
  const b = el('button', { type: 'button', class: 'action in', text: COPY.takeOff });
  controls.replaceChildren(b);
  followFocus(b);
  let flips = 0;
  await new Promise((resolve) => b.addEventListener('click', () => {
    glassesOn = !glassesOn;
    board.classList.toggle('night', glassesOn);
    figure.classList.toggle('glasses', glassesOn);
    spectrum.classList.toggle('hidden', !glassesOn);
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
  await clear();
  say(COPY.pure);
  describe('Drag the bars up and down. The signal above changes with them.');
  const hint = setTimeout(() => { if (phase === 'pure') say(COPY.pureHint, 'hint'); }, 9000);
  await new Promise((resolve) => {
    const stop = dragBars(async () => {
      if (phase === 'pure' && pureTone(mine)) {
        clearTimeout(hint);
        phase = 'back';
        await clear();
        say(COPY.pureDone, 'lead');
        setTimeout(() => say(COPY.back), REDUCED ? 0 : 1600);
      } else if (phase === 'back' && allBack(mine)) {
        stop();
        resolve();
      }
    });
  });
  await clear();
  say(COPY.backDone, 'lead');
  await play(mine, 1.4);
  await pause(reading(COPY.backDone));
  theScanner();
}

async function theScanner() {                               // the scanner's reply: a much busier signal
  phase = 'scanner';
  await clear();
  const rows = pictureRows();
  const middle = rows[Math.floor(rows.length / 2)];
  const samples = chordSamples(middle);
  fourBars.classList.remove('on');
  signalInner.classList.add('swapping');                    // the violin's signal fades into the scanner's
  await wait(350);
  running = null;
  signalPath.setAttribute('d', samplesPath(samples, STRIP));
  strip.classList.add('radio');
  signalInner.classList.remove('swapping');
  describe("A dense, busy signal: the scanner's reply.");
  say(COPY.scanner);
  await press(COPY.look);
  const amounts = unmix(samples, middle.length);
  drawManyBars(amounts, true);
  describe('Through the glasses: a long row of thin glowing bars, short at the ends, tall in the middle.');
  say(COPY.manyBars);
  await pause(reading(COPY.manyBars) + 600);
  theMachine(rows);
}
function drawManyBars(amounts, rising) {
  const w = SPECTRUM.w / amounts.length;
  manyBars.replaceChildren(...amounts.map((a, i) => {
    const h = Math.max(0, a) * barHeight(STEPS);
    const r = svg('rect', { class: `thin-bar${rising ? ' growing' : ''}`, fill: neon(i, amounts.length), x: (SPECTRUM.x + i * w + w * 0.15).toFixed(2), y: (SPECTRUM.base - h).toFixed(2), width: (w * 0.7).toFixed(2), height: Math.max(0.001, h).toFixed(2) });
    if (rising) { r.style.transitionDelay = `${i * 14}ms`; requestAnimationFrame(() => requestAnimationFrame(() => r.classList.remove('growing'))); }
    return r;
  }));
  manyBars.classList.add('on');
}

async function theMachine(rows) {                           // the signal and the bars shrink into a machine
  phase = 'machine';
  await clear();
  spectrum.classList.add('in-machine');
  strip.style.transform = css(stripToInput());
  spectrum.style.transform = css(spectrumToWindow());
  await wait(500);
  on(machineBack); on(machineFront);
  await wait(700);
  const n = rows.length;
  const cell = MACHINE.picture.size / n;
  const order = rowOrder(n);
  const printRow = (j, animate) => {
    const amounts = unmix(chordSamples(rows[j]), n);       // the glasses inside the machine
    drawManyBars(amounts, false);
    canvas.append(...amounts.map((a, i) => {
      const v = Math.round(255 * Math.min(1, Math.max(0, a)));
      return svg('rect', { class: animate ? 'pixel fresh' : 'pixel', x: (MACHINE.picture.x + i * cell).toFixed(2), y: (MACHINE.picture.y + j * cell).toFixed(2), width: (cell + 0.4).toFixed(2), height: (cell + 0.4).toFixed(2), fill: `rgb(${v},${v},${v})` });
    }));
  };
  const loadNext = () => { if (turns < n) signalPath.setAttribute('d', samplesPath(chordSamples(rows[order[turns]]), STRIP)); };
  loadNext();
  describe('The Fourier machine: the signal waits on the left, the bars glow in its window, a crank on top, and an empty picture on the right.');
  say(COPY.machine);
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
      signalInner.classList.add('feeding');
      await wait(450);
      printRow(order[turns], true);
      turns++;
      signalInner.classList.remove('feeding');
      loadNext();
      if (turns === 1) say(COPY.eachTurn);
      busy = false;
      if (turns >= 4) resolve();
    };
    button.addEventListener('click', turn);
    crank.addEventListener('click', turn);
    crank.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); turn(); } });
  });
  controls.replaceChildren();
  await pause(600);
  say(COPY.takesOver);
  machineFront.classList.add('fast');
  while (turns < n) {
    crank.style.transform = `rotate(${(turns + 1) * 360}deg)`;
    printRow(order[turns], false);
    turns++;
    loadNext();
    if (!REDUCED) await pause(50);
  }
  describe('Row by row, the machine has printed a picture of a head.');
  await pause(500);
  await clear();
  say(COPY.pictureOut, 'lead');
  await pause(reading(COPY.pictureOut) + 600);
  naming();
}

async function naming() {                                   // only now: its name
  phase = 'name';
  await clear();
  say(COPY.name[0], 'lead');
  await pause(reading(COPY.name[0]));
  say(COPY.name[1]);
  await pause(reading(COPY.name[1]) + 900);
  phase = 'final';
  await clear();
  say(COPY.final, 'final');
  root.dispatchEvent(new CustomEvent('level-finished', { bubbles: true }));
}

// read-only view for automated checks (no learner-facing effect)
window.__glasses = { get phase() { return phase; }, get mine() { return [...mine]; }, get glasses() { return glassesOn; }, get turns() { return turns; } };

opening();
