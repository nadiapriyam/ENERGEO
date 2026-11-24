// Level 1, "Inside a note" (docs/levels_spec.md; history in docs/violin_level_spec.md). You are the first violin:
// before a concert every player tunes to one note, and tonight it is your A note. You bow it and the orchestra tunes.
// A magnifying glass takes you into your violin, then into its A string, shaking. Then the story cuts inside the sound.
// Is it just one note? Slide the glass across the sound and it shows what is hidden: four notes, which you tap to hear.
// Played together they flow into an ear, and what you hear is one A note. Every learner-facing line comes from
// copyNote.js; every position from src/math/violin.js and every sound shape from src/math/tones.js.
import './note.css';

import { COPY } from './copyNote.js';
import { speaker } from './characters.js';
import {
  VIEW, HOME, transform, toView, lensCamera, lerpCamera, coverRadius, LENS, VIOLIN, STRINGS, A_STRING, BOW, musicians, ZOOMS, closeUp, stringPath,
} from '../math/violin.js';
import { PITCH, A_NOTE, STEPS, HIDDEN, part, STAGE, lane, trace, EAR, HEARD, SQUEEZE, funnel, heardPath } from '../math/tones.js';
import { keepPart } from './record.js';
import { reader } from './reader.js';
import { jumping, onArrive } from './jump.js';
import { bigIdea } from './magazine.js';

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
// going to a scene from "Scroll through" (jump.js): until it is reached, nothing waits or sounds, and every action is
// done for you
let FAST = jumping('level-1');
if (FAST) document.documentElement.classList.add('instant');
onArrive('level-1', () => { FAST = false; document.documentElement.classList.remove('instant'); });
const wait = (ms) => (FAST ? Promise.resolve() : new Promise((r) => setTimeout(r, REDUCED ? Math.min(ms, 1200) : ms)));
const pause = (ms) => (FAST ? Promise.resolve() : new Promise((r) => setTimeout(r, ms)));
const on = (node, v = true) => node.classList.toggle('on', v);
const tween = (ms, step) => new Promise((resolve) => {            // step(t) for t from 0 to 1, eased
  if (REDUCED || FAST) { step(1); resolve(); return; }
  const t0 = performance.now();
  const frame = (now) => {
    const t = Math.min(1, (now - t0) / ms);
    step(t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
    if (t < 1) requestAnimationFrame(frame); else resolve();
  };
  requestAnimationFrame(frame);
});

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let phase = 'opening';
let cam = { ...HOME };
let bowLevel = 0;                                   // how hard the A string is shaking, 0…1

// ── sound: made only after the learner touches the bow ──────────────────────────────────────────────
let ctx = null;
function audio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || FAST) return null;
  try { ctx ??= new AC(); if (ctx.state === 'suspended') ctx.resume(); } catch { return null; }
  return ctx;
}
/** A held A with the violin's hidden notes; returns a handle whose loudness follows the bow. */
function violinA(amounts = A_NOTE, hz = PITCH, peak = 0.16) {
  const c = audio();
  if (!c) return { level() {}, stop() {} };
  const real = new Float32Array(amounts.length + 1);
  const imag = new Float32Array(amounts.length + 1);
  amounts.forEach((a, k) => { imag[k + 1] = a / STEPS; });
  const osc = c.createOscillator();
  osc.setPeriodicWave(c.createPeriodicWave(real, imag, { disableNormalization: true }));
  osc.frequency.value = hz;
  const lfo = c.createOscillator();
  const depth = c.createGain();
  lfo.frequency.value = 5.5;
  depth.gain.value = hz * 0.004;
  lfo.connect(depth).connect(osc.frequency);
  const g = c.createGain();
  g.gain.value = 0;
  osc.connect(g).connect(c.destination);
  osc.start(); lfo.start();
  return {
    level(v) { g.gain.setTargetAtTime(peak * v, c.currentTime, 0.05); },
    stop() { g.gain.setTargetAtTime(0, c.currentTime, 0.12); osc.stop(c.currentTime + 0.6); lfo.stop(c.currentTime + 0.6); },
  };
}
async function playA(seconds = 2) {
  const h = violinA();
  h.level(1);
  await pause(seconds * 1000);
  h.stop();
}
/** One hidden note on its own: a pure tone. */
function pureTone(k, seconds = 1.2) {
  const c = audio();
  if (!c) return;
  const osc = c.createOscillator();
  osc.frequency.value = HIDDEN[k].hz;
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.06 + 0.06 * (HIDDEN[k].amount / STEPS), t + 0.04);
  g.gain.setValueAtTime(0.06 + 0.06 * (HIDDEN[k].amount / STEPS), t + seconds - 0.3);
  g.gain.linearRampToValueAtTime(0, t + seconds);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + seconds + 0.05);
}
/** The orchestra tunes: a few A's, low to high, start a little out of tune and slide onto yours. */
function orchestraTunes() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  [[110, -24], [220, 19], [440, -14], [880, 22]].forEach(([hz, cents], i) => {
    const osc = c.createOscillator();
    osc.setPeriodicWave(c.createPeriodicWave(new Float32Array([0, 0, 0, 0]), new Float32Array([0, 1, 0.5, 0.25]), { disableNormalization: true }));
    osc.frequency.setValueAtTime(hz * 2 ** (cents / 1200), t + i * 0.15);
    osc.frequency.exponentialRampToValueAtTime(hz, t + 1.5);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.045, t + 0.3 + i * 0.15);
    g.gain.setValueAtTime(0.045, t + 2.2);
    g.gain.linearRampToValueAtTime(0, t + 3);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 3.1);
  });
}

// ── page ─────────────────────────────────────────────────────────────────────────────────────────
const root = document.getElementById('note-lesson');
const figure = el('figure', { class: 'figure' });
const notesRow = el('div', { class: 'notes', role: 'group', 'aria-label': 'Hidden notes' });
const transport = el('div', { class: 'transport' });
const prompt = el('div', { class: 'prompt', 'aria-live': 'polite' });
root.append(figure, notesRow, transport, prompt);
const story = reader(root, { fast: () => FAST });          // Next and Back, under the level (reader.js)
root.append(story.el);
const speak = speaker(prompt);                               // you, the player, beside your own lines (characters.js)

const board = svg('svg', { viewBox: `0 0 ${VIEW.w} ${VIEW.h}`, class: 'scene-board', role: 'img' });
const describe = (text) => board.setAttribute('aria-label', text);
figure.append(board);
const lensClip = svg('circle', { r: LENS.r });
const xrayClip = svg('circle', { r: LENS.r });
board.append(svg('defs', {},
  svg('clipPath', { id: 'l2-lens-clip' }, lensClip),
  svg('clipPath', { id: 'l2-xray-clip' }, xrayClip)));

// the drawing: the orchestra behind, your violin in front
const world = svg('g', { id: 'l2-world' });
const camGroup = svg('g', { class: 'cam' }, world);
world.append(
  svg('rect', { class: 'backdrop', x: -400, y: -400, width: 1440, height: 1200 }),
  svg('path', { class: 'stage-floor', d: 'M -400 250 Q 320 205 1040 250 L 1040 800 L -400 800 Z' }));
const players = musicians().map((m, i) => {
  const inst = {
    violin: () => svg('ellipse', { class: 'wood', cx: 10, cy: -6, rx: 7, ry: 3.6 }),
    cello: () => svg('g', {}, svg('ellipse', { class: 'wood', cx: 13, cy: 3, rx: 7, ry: 11 }), svg('line', { class: 'neck-line', x1: 13, y1: -8, x2: 13, y2: -24 })),
    flute: () => svg('line', { class: 'flute', x1: -4, y1: -19, x2: 18, y2: -25 }),
    horn: () => svg('circle', { class: 'brass', cx: 11, cy: -4, r: 6.5 }),
  }[m.kind]();
  const note = svg('g', { class: 'tuned-mark', style: `transition-delay: ${i * 90}ms` },
    svg('circle', { cx: -2, cy: -38, r: 3.2 }), svg('path', { d: 'M 1 -38 V -50 Q 7 -48 6 -43' }));
  const g = svg('g', { class: 'player', transform: `translate(${m.x} ${m.y}) scale(${m.s})` },
    svg('rect', { class: 'chair', x: -12, y: 6, width: 24, height: 14, rx: 3 }),
    svg('rect', { class: `body body-${i % 3}`, x: -10, y: -14, width: 20, height: 24, rx: 8 }),
    svg('circle', { class: 'skin', cx: 0, cy: -22, r: 8 }), inst, note);
  world.append(g);
  return g;
});
const V = VIOLIN;
const fHole = (x, y, flip) => svg('path', { class: 'f-hole', d: `M ${x} ${y - 9} q ${flip * 3} 4 0 9 q ${-flip * 3} 5 0 9` });
const strings = STRINGS.map((s) => svg('path', { class: `string${s === A_STRING ? ' a-string' : ''}`, d: stringPath(s) }));
const bow = svg('g', { class: 'bow' },
  svg('line', { class: 'bow-stick', x1: BOW.x, y1: BOW.top, x2: BOW.x, y2: BOW.bottom }),
  svg('line', { class: 'bow-hair', x1: BOW.x + 3.5, y1: BOW.top + 6, x2: BOW.x + 3.5, y2: BOW.bottom - 14 }),
  svg('rect', { class: 'bow-frog', x: BOW.x - 3, y: BOW.bottom - 18, width: 11, height: 16, rx: 2 }));
world.append(svg('g', { class: 'violin' },
  svg('circle', { class: 'wood-dark', cx: V.scroll.x, cy: V.scroll.y, r: V.scroll.r }),
  svg('rect', { class: 'wood-dark', x: V.neck.x, y: V.neck.y, width: V.neck.w, height: V.neck.h, rx: 4 }),
  svg('ellipse', { class: 'wood', cx: V.upper.cx, cy: V.upper.cy, rx: V.upper.rx, ry: V.upper.ry }),
  svg('ellipse', { class: 'wood', cx: V.lower.cx, cy: V.lower.cy, rx: V.lower.rx, ry: V.lower.ry }),
  svg('rect', { class: 'wood wood-flat', x: V.waist.x, y: V.waist.y, width: V.waist.w, height: V.waist.h }),
  fHole(204, 318, 1), fHole(266, 318, -1),
  svg('rect', { class: 'fingerboard', x: V.fingerboard.x, y: V.fingerboard.y, width: V.fingerboard.w, height: V.fingerboard.h, rx: 6 }),
  svg('rect', { class: 'tailpiece', x: V.tailpiece.x, y: V.tailpiece.y, width: V.tailpiece.w, height: V.tailpiece.h, rx: 6 }),
  svg('rect', { class: 'bridge', x: V.bridge.x, y: V.bridge.y, width: V.bridge.w, height: V.bridge.h, rx: 1 }),
  ...strings,
  svg('text', { class: 'string-label', x: ZOOMS[1].target.x - 18, y: A_STRING.y - 1.6, text: COPY.stringLabel })), bow);

// the magnifying glass: the same drawing again, magnified, inside a circle that follows the glass
const lensCam = svg('g', { class: 'lens-cam' }, svg('use', { href: '#l2-world' }));
const lensView = svg('g', { class: 'lens-view', 'clip-path': 'url(#l2-lens-clip)' }, lensCam);
const lensFrame = svg('g', { class: 'lens-frame' },
  svg('line', { class: 'lens-handle', x1: LENS.r * 0.72, y1: LENS.r * 0.72, x2: LENS.r * 1.45, y2: LENS.r * 1.45 }),
  svg('circle', { class: 'lens-rim', r: LENS.r }),
  svg('path', { class: 'lens-glare', d: `M ${-LENS.r * 0.62} ${-LENS.r * 0.2} Q ${-LENS.r * 0.55} ${-LENS.r * 0.6} ${-LENS.r * 0.18} ${-LENS.r * 0.66}` }));
const targetRing = svg('circle', { class: 'target-ring', r: 18 });

// inside the sound: its shape, and under the glass, the notes hidden in it
const inside = svg('g', { class: 'inside' });
const one = lane(0, 1);
const sumPath = svg('path', { class: 'sum-wave' });
const veil = svg('circle', { class: 'veil', r: LENS.r, 'clip-path': 'url(#l2-xray-clip)' });
const partPaths = HIDDEN.map((_, k) => svg('path', { class: `part-wave part-${k}` }));
const partsGroup = svg('g', { class: 'parts', 'clip-path': 'url(#l2-xray-clip)' }, ...partPaths);
const veilRect = svg('rect', { class: 'veil-all', x: STAGE.x, y: STAGE.y, width: STAGE.w, height: STAGE.h, rx: 18 });
const laneLabels = HIDDEN.map((_, k) => svg('text', { class: `lane-label part-${k}`, x: STAGE.x + 14, y: lane(k, 4).cy + 6, text: COPY.notes[k] }));
// the ear: all four notes go in; one A note is what you hear
const funnels = HIDDEN.map((_, k) => svg('path', { class: `funnel part-${k}`, d: funnel(k) }));
const ear = svg('g', { class: 'ear', style: `transform: translate(${EAR.x}px, ${EAR.y}px)` },
  svg('path', { class: 'ear-outer', d: 'M -2 -44 C 30 -50 46 -24 40 2 C 36 22 20 26 16 42 C 13 54 0 60 -8 52' }),
  svg('path', { class: 'ear-inner', d: 'M 4 -26 C 22 -26 26 -6 18 8 C 13 16 6 16 4 24' }),
  svg('circle', { class: 'ear-canal', cx: -2, cy: 6, r: 5 }));
const heard = svg('g', { class: 'heard' },
  svg('path', { class: 'heard-arrow', d: `M ${EAR.x + 50} ${EAR.y + 6} H ${HEARD.x0 - 8} M ${HEARD.x0 - 16} ${EAR.y} L ${HEARD.x0 - 8} ${EAR.y + 6} L ${HEARD.x0 - 16} ${EAR.y + 12}` }),
  svg('path', { class: 'heard-wave', d: heardPath() }),
  svg('text', { class: 'heard-label', x: HEARD.label.x, y: HEARD.label.y, 'text-anchor': 'middle', text: COPY.heard }));
const hearing = svg('g', { class: 'hearing' }, ...funnels, ear, heard);
inside.append(svg('rect', { class: 'stage', x: STAGE.x, y: STAGE.y, width: STAGE.w, height: STAGE.h, rx: 18 }), sumPath, veilRect, veil, partsGroup, ...laneLabels, hearing);

board.append(camGroup, lensView, targetRing, inside, lensFrame);

function drawCamera() { camGroup.style.transform = transform(cam); }
drawCamera();
let lensAt = { ...LENS.rest };
let lensMag = ZOOMS[0].mag;
function drawLens() {
  lensFrame.style.transform = `translate(${lensAt.x}px, ${lensAt.y}px)`;
  for (const c of [lensClip, xrayClip]) { c.setAttribute('cx', lensAt.x); c.setAttribute('cy', lensAt.y); }
  veil.setAttribute('cx', lensAt.x); veil.setAttribute('cy', lensAt.y);
  lensCam.style.transform = transform(lensCamera(cam, lensAt, lensMag));
}
drawLens();

// the A string shakes as long as it is bowed (and a little after)
let shaking = false;
function shake() {
  if (shaking) return;
  shaking = true;
  let t0 = performance.now();
  const frame = (now) => {
    const swing = REDUCED ? 1 : Math.cos(((now - t0) / 1000) * 2 * Math.PI * 9);
    strings[1].setAttribute('d', stringPath(A_STRING, 2.4 * bowLevel, swing));
    if (bowLevel > 0.01) requestAnimationFrame(frame);
    else { strings[1].setAttribute('d', stringPath(A_STRING)); shaking = false; }
  };
  t0 = performance.now();
  requestAnimationFrame(frame);
}

// ── the prompt: one small piece of text at a time ──────────────────────────────────────────────────
const say = (text, cls = '') => {
  const p = el('p', { class: `line ${cls}`.trim(), text });
  prompt.append(p);
  requestAnimationFrame(() => p.classList.add('in'));
  return p;
};
const put = (n) => { prompt.append(n); requestAnimationFrame(() => n.classList.add('in')); return n; };   // a magazine box (magazine.js)
const clear = () => keepPart([figure, notesRow], prompt);   // the lines clear (the comic's recorder keeps the part: record.js)
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
  if (FAST) setTimeout(() => buttons[0].click(), 0);          // fast-forwarding: answered for you
});

/** Drag anywhere on the board; `move(dx, dy, e)` for each step. Keyboard: Enter or Space calls `key()`. Resolves when `done()` says so. */
function dragOnBoard(move, key) {
  board.classList.add('dragging-on');
  board.setAttribute('tabindex', '0');
  followFocus(board);
  let last = null;
  const down = (e) => { e.preventDefault(); board.setPointerCapture(e.pointerId); last = e; move(0, 0, e, 'down'); };
  const mv = (e) => { if (!last) return; const r = board.getBoundingClientRect(); const k = VIEW.w / r.width; move((e.clientX - last.clientX) * k, (e.clientY - last.clientY) * k, e, 'move'); last = e; };
  const up = (e) => { if (!last) return; last = null; move(0, 0, e, 'up'); };
  const kd = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); key(); } };
  board.addEventListener('pointerdown', down);
  board.addEventListener('pointermove', mv);
  board.addEventListener('pointerup', up);
  board.addEventListener('pointercancel', up);
  board.addEventListener('keydown', kd);
  if (FAST) setTimeout(key, 0);                             // fast-forwarding: done for you, the keyboard's way
  return () => {
    board.classList.remove('dragging-on');
    board.removeAttribute('tabindex');
    for (const [t, f] of [['pointerdown', down], ['pointermove', mv], ['pointerup', up], ['pointercancel', up], ['keydown', kd]]) board.removeEventListener(t, f);
  };
}

// ── the story ────────────────────────────────────────────────────────────────────────────────────
async function opening() {                                  // you are the first violin
  describe('An orchestra on a stage, two curved rows of players. In front: your violin, lying across the bottom, with its bow across the strings.');
  requestAnimationFrame(() => figure.classList.add('in'));
  say(COPY.opening[0], 'lead');                              // the lines of one part follow each other, and stay
  await story.beat();
  say(COPY.opening[1]);
  await story.beat();
  say(COPY.opening[2]);
  await story.beat();
  speak(COPY.you, 'you');                                    // meet the player: that's you, in the bucket hat
  await story.beat();
  say(COPY.bow, 'hint');
  await bowTheA();
  phase = 'tuned';
  orchestraTunes();
  for (const p of players) p.classList.add('tuned');
  describe('Every player in the orchestra shows a little note: they are all tuned to your A note.');
  say(COPY.tuned);
  await story.next();
  zoomIntoViolin();
}

function bowTheA() {                                        // drag the bow up and down: the A sounds, the string shakes
  phase = 'bow';
  bow.classList.add('ready');
  return new Promise((resolve) => {
    let sound = null;
    let offset = 0;
    let travelled = 0;
    let lastT = 0;
    const finish = () => { stop(); bow.classList.remove('ready'); bowLevel = 0; sound?.stop(); resolve(); };
    const stop = dragOnBoard((dx, dy, e, kind) => {
      if (kind === 'down') { sound ??= violinA(); lastT = e.timeStamp; return; }
      if (kind === 'up') { sound?.level(0); bowLevel = 0; return; }
      offset = Math.max(-BOW.travel, Math.min(BOW.travel, offset + dy));
      bow.style.transform = `translateY(${offset}px)`;
      const dt = Math.max(8, e.timeStamp - lastT);
      lastT = e.timeStamp;
      bowLevel = Math.min(1, Math.abs(dy) / dt / 0.35 + 0.25);
      sound?.level(bowLevel);
      shake();
      travelled += Math.abs(dy);
      if (travelled > 420) finish();
    }, async () => {                                        // keyboard: a long stroke on its own
      sound ??= violinA();
      bowLevel = 0.8; sound.level(0.8); shake();
      await tween(1400, (t) => { bow.style.transform = `translateY(${BOW.travel * Math.sin(t * Math.PI * 2)}px)`; });
      finish();
    });
  });
}

/** The glass: drag it onto the target; it grows to fill the view and the camera glides into the close-up. */
function lookCloser(k) {
  const z = ZOOMS[k];
  lensMag = z.mag;
  lensAt = { ...LENS.rest };
  drawLens();
  on(lensFrame); on(lensView); on(targetRing);
  const placeRing = () => { const t = toView(cam, z.target); targetRing.setAttribute('cx', t.x); targetRing.setAttribute('cy', t.y); return t; };
  const target = placeRing();
  return new Promise((resolve) => {
    let grabbed = false;
    const snap = async () => {
      stop();
      on(targetRing, false);
      const from = { ...lensAt };
      await tween(260, (t) => { lensAt = { x: from.x + (target.x - from.x) * t, y: from.y + (target.y - from.y) * t }; drawLens(); });
      const r0 = LENS.r;
      const r1 = coverRadius(lensAt);
      lensFrame.classList.add('fading');
      await tween(520, (t) => { lensClip.setAttribute('r', r0 + (r1 - r0) * t); });
      cam = lensCamera(cam, lensAt, lensMag);               // the camera takes over what the glass shows
      drawCamera();
      on(lensView, false); on(lensFrame, false);
      lensFrame.classList.remove('fading');
      lensClip.setAttribute('r', LENS.r);
      const a = { ...cam };
      const b = closeUp(k);
      await tween(1000, (t) => { cam = lerpCamera(a, b, t); drawCamera(); });
      cam = b; drawCamera();
      resolve();
    };
    const stop = dragOnBoard((dx, dy, e, kind) => {
      if (kind === 'down') {                                // grab the glass, or bring it to where you touch
        const r = board.getBoundingClientRect();
        const p = { x: ((e.clientX - r.left) / r.width) * VIEW.w, y: ((e.clientY - r.top) / r.height) * VIEW.h };
        if (Math.hypot(p.x - lensAt.x, p.y - lensAt.y) > LENS.r * 1.5) lensAt = p;
        grabbed = true;
      } else if (kind === 'up') grabbed = false;
      else if (grabbed) lensAt = { x: Math.max(0, Math.min(VIEW.w, lensAt.x + dx)), y: Math.max(0, Math.min(VIEW.h, lensAt.y + dy)) };
      drawLens();
      if (Math.hypot(lensAt.x - target.x, lensAt.y - target.y) < z.snap) snap();
    }, snap);
  });
}

async function zoomIntoViolin() {
  phase = 'lens1';
  clear();
  say(COPY.lens1);
  describe('A magnifying glass appears. Under it, everything looks bigger.');
  await lookCloser(0);
  phase = 'lens2';
  clear();
  describe('Your violin, close up: its body, the bridge, and four strings, one marked A.');
  say(COPY.lens2);
  await lookCloser(1);
  phase = 'string';
  clear();
  strings[1].classList.add('live');
  describe('The A string, huge, shaking back and forth.');
  bowLevel = 1;
  shake();
  say(COPY.shaking);
  await playA(2.4);
  bowLevel = 0;
  await story.next();
  insideTheSound();
}

let scrolling = false;
function scroll() {                                         // the sound's shape runs across the stage
  if (scrolling) return;
  scrolling = true;
  const t0 = performance.now();
  const frame = (now) => {
    if (!scrolling) return;                                 // stopped: leave the notes where the story put them
    const shift = REDUCED ? 0 : ((now - t0) / 1000) * 0.35;
    sumPath.setAttribute('d', trace(A_NOTE, one.cy, shift));
    partPaths.forEach((p, k) => p.setAttribute('d', trace(part(A_NOTE, k), one.cy, shift)));
    if (scrolling && !REDUCED) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

async function insideTheSound() {                           // cut: inside the vibration
  phase = 'inside';
  clear();
  board.classList.add('cut');
  await wait(260);
  on(inside);
  camGroup.classList.add('gone');
  board.classList.remove('cut');
  scroll();
  describe('Inside the sound: the shape of your A, a repeating wave with bumps, running across.');
  say(COPY.shape);
  await story.beat();
  phase = 'question';
  say(COPY.oneNote.question);
  await ask(COPY.oneNote.choices);
  say(COPY.oneNote.after);
  await wait(600);
  xray();
}

async function xray() {                                     // the glass shows what the A is made of
  phase = 'xray';
  clear();
  say(COPY.xray);
  lensAt = { x: STAGE.x + 150, y: one.cy };
  drawLens();
  on(lensFrame); on(veil); on(partsGroup);
  describe('Under the glass the single wave comes apart into several smoother waves, one on top of another.');
  let explored = 0;
  await new Promise((resolve) => {
    let grabbed = false;
    const done = () => { stop(); resolve(); };
    const timer = setTimeout(done, 9000);
    const stop = dragOnBoard((dx, dy, e, kind) => {
      if (kind === 'down') grabbed = true;
      else if (kind === 'up') grabbed = false;
      else if (grabbed) {
        lensAt = { x: Math.max(STAGE.x, Math.min(STAGE.x + STAGE.w, lensAt.x + dx)), y: Math.max(STAGE.y, Math.min(STAGE.y + STAGE.h, lensAt.y + dy)) };
        explored += Math.hypot(dx, dy);
        drawLens();
        if (explored > 260) { clearTimeout(timer); done(); }
      }
    }, () => { clearTimeout(timer); done(); });
  });
  const r0 = LENS.r;
  const r1 = coverRadius(lensAt);
  lensFrame.classList.add('fading');
  await tween(600, (t) => { const r = r0 + (r1 - r0) * t; xrayClip.setAttribute('r', r); veil.setAttribute('r', r); });
  on(lensFrame, false);
  on(veilRect);
  scrolling = false;
  splitNotes();
}

async function splitNotes() {                               // four notes, one under another; tap to hear each
  phase = 'notes';
  partsGroup.removeAttribute('clip-path');
  partPaths.forEach((p, k) => {
    p.setAttribute('d', trace(part(A_NOTE, k), lane(k, 4).cy));
    p.style.transform = `translateY(${one.cy - lane(k, 4).cy}px)`;
  });
  await wait(80);
  partPaths.forEach((p, k) => { setTimeout(() => { p.style.transform = 'none'; }, REDUCED ? 0 : k * 140); });
  await wait(900);
  laneLabels.forEach((l) => on(l));
  describe('Four smooth waves, one under another, each faster and smaller than the one above: A, high A, E and higher A.');
  clear();
  say(COPY.hidden, 'lead');
  let heard = false;
  const heardAll = () => { if (!heard) { heard = true; together(); } };
  const buttons = HIDDEN.map((h, k) => {
    const b = el('button', { type: 'button', class: `note part-${k}`, text: COPY.notes[k] });
    b.addEventListener('click', () => {
      pureTone(k);
      partPaths[k].classList.remove('sounding'); void partPaths[k].getBBox(); partPaths[k].classList.add('sounding');
      b.classList.add('heard');
      if (notesRow.querySelectorAll('.heard').length === HIDDEN.length) heardAll();
    });
    notesRow.append(b);
    return b;
  });
  notesRow.classList.add('in');
  await story.beat();
  say(COPY.tapNotes);
  followFocus(buttons[0]);
  setTimeout(() => { if (!heard && phase === 'notes') heardAll(); }, FAST ? 0 : 14000);
}

async function together() {                                 // all four at once, into your ear: one A note
  phase = 'together';
  const b = el('button', { type: 'button', class: 'action', text: COPY.together, disabled: '' });
  transport.replaceChildren(b);
  await story.read();                                       // once the words above are read
  b.disabled = false;
  requestAnimationFrame(() => b.classList.add('in'));
  followFocus(b);
  const pressed = new Promise((r) => b.addEventListener('click', r, { once: true }));
  if (FAST) b.click();                                      // fast-forwarding: pressed for you
  await pressed;
  b.remove();
  clear();
  notesRow.classList.remove('in');
  partsGroup.classList.add('squeezed');                     // the four rows make room for the ear
  partPaths.forEach((p) => { p.style.transform = `scaleX(${SQUEEZE})`; });
  on(hearing);
  describe('The four notes flow from their rows into an ear. Out of the ear comes one wave, labelled A note: what you hear.');
  await wait(500);
  hearing.classList.add('flowing');
  await playA(2.6);
  hearing.classList.remove('flowing');
  clear();
  phase = 'oneA';
  say(COPY.oneA);
  await story.beat();
  phase = 'final';
  put(bigIdea(COPY.final));                                  // the big idea: the first step of the thought
  root.dispatchEvent(new CustomEvent('level-finished', { bubbles: true }));   // the page offers Level 2
}

// read-only view for automated checks (no learner-facing effect)
window.__note = { get phase() { return phase; }, get camera() { return { ...cam }; }, get lens() { return { ...lensAt }; } };

opening();
