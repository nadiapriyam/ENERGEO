// Level 3, "A prism for sound" (docs/levels_spec.md, Revision 3). It comes straight after Level 2: after your scan,
// you head back to the concert hall. The lights dim; the learner aims a stage light at a glass prism and white light
// fans out into colours. A prism for light, so a prism for sound? Surprise: your tuner has one. Its screen draws your A
// note as a signal, the signal grows to fill the board, and the prism splits it into four glowing bars, which the
// learner drags into a tuning fork and back. At the break, the technician who scanned you shows the scanner's prism on
// one row of spots across your head: the row lifts out, a stronger right side gives each spot its own note, all the
// notes together are one signal, the prism splits it into bars under their spots, tall bar, bright dot, and the row
// slides back into your picture. Row after row, the picture appears. Only then the name.
// Scenes move into one another rather than swap. Every learner-facing line comes from copyPrism.js; every position,
// bar and row from src/math (prism.js, tones.js, scanner.js).
import './prism.css';

import { COPY } from './copyPrism.js';
import { A_NOTE, STEPS, PITCH, part } from '../math/tones.js';
import {
  BOARD, css, triangle, HALL, crystalCorners, aimAngle, toCrystal, startAngle, lightPath,
  STRIP, STRIP_BOX, signal, samplesPath, TUNER, onTuner, SPECTRUM, GLYPH, barX, barHeight, barAt, stepsAt, pureTone, allBack,
  NOTE_LED, neon, ROWS, spotHz, spinRate, coarseRows, sharpRows, chordSamples, unmix, tallest, rowOrder, HAND_ROW,
  REPLY_BOX, toReply, GLYPH2, PIC, cell, headOutline, rowBand, BENCH, spotX, benchToRow, spotAt, wedge, SPOT_BARS,
  spotBarHeight, FACE, hairPath, shirtPath, lookAt,
} from '../math/prism.js';

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
const pts = (ps) => ps.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
const grey = (a) => { const v = Math.round(255 * Math.min(1, Math.max(0, a))); return `rgb(${v},${v},${v})`; };
/** Put a node somewhere at once (no transition), so its next move animates from there. */
const jump = (node, transform) => { node.style.transition = 'none'; node.style.transform = transform; node.getBoundingClientRect(); node.style.transition = ''; };

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let phase = 'opening';
let mine = [...A_NOTE];
let hitNow = false;
let angleNow = 0;                                           // where the stage light points
let stronger = false;
let painted = 0;
const ROWS_OF_YOU = coarseRows();
const ROW = ROWS_OF_YOU[HAND_ROW];                          // the row the technician lifts out

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
/** One spot's note: tone k + 1, as loud as how much of you is in the spot. */
function spotNote(k, amount, seconds = 0.9) {
  const c = audio();
  if (!c || amount <= 0) return;
  const osc = c.createOscillator();
  osc.frequency.value = spotHz(k);
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.04 + 0.18 * amount, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.001, t + seconds);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + seconds + 0.05);
}
/** Every spot's note at once: what the scanner hears. */
function allNotes(amounts, seconds = 2) {
  const c = audio();
  if (c) {
    const real = new Float32Array(amounts.length + 1);
    const imag = new Float32Array(amounts.length + 1);
    amounts.forEach((a, k) => { imag[k + 1] = Math.max(0, a); });
    const osc = c.createOscillator();
    osc.setPeriodicWave(c.createPeriodicWave(real, imag));
    osc.frequency.value = spotHz(0);
    const g = c.createGain();
    const t = c.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.06);
    g.gain.setValueAtTime(0.16, t + seconds - 0.4);
    g.gain.linearRampToValueAtTime(0, t + seconds);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + seconds + 0.05);
  }
  return pause(seconds * 1000);
}

// ── page ─────────────────────────────────────────────────────────────────────────────────────────
const root = document.getElementById('prism-lesson');
const figure = el('figure', { class: 'figure prism-figure' });
const controls = el('div', { class: 'controls' });
const prompt = el('div', { class: 'prompt', 'aria-live': 'polite' });
root.append(figure, controls, prompt);
const board = svg('svg', { viewBox: `0 0 ${BOARD.w} ${BOARD.h}`, class: 'prism-board', role: 'img' });
const describe = (text) => board.setAttribute('aria-label', text);
figure.append(board);
const led = (id, n, x2, y2) => svg('linearGradient', { id, x1: '0', y1: '0', x2, y2 },
  ...Array.from({ length: n }, (_, i) => svg('stop', { offset: `${(100 * i) / (n - 1)}%`, 'stop-color': neon(i, n) })));
board.append(svg('defs', {}, led('p3-led', 7, '1', '1'),
  svg('linearGradient', { id: 'p3-ramp', x1: '0', y1: '0', x2: '1', y2: '0' },
    svg('stop', { offset: '0%', 'stop-color': '#3b2a8a' }), svg('stop', { offset: '100%', 'stop-color': '#ff3fd0' })),
  svg('filter', { id: 'p3-glow', x: '-30%', y: '-30%', width: '160%', height: '160%' },
    svg('feGaussianBlur', { stdDeviation: '3', result: 'b' }), svg('feMerge', {}, svg('feMergeNode', { in: 'b' }), svg('feMergeNode', { in: 'SourceGraphic' })))));
const bg = svg('rect', { class: 'bg', x: 0, y: 0, width: BOARD.w, height: BOARD.h });

// the hall: a stage light on the floor, a chandelier, a glass prism on a string
const L = HALL.light;
const CH = HALL.chandelier;
const [cTop, cRight, cLeft] = crystalCorners();
const beam = svg('line', { class: 'beam' });
const rays = Array.from({ length: 7 }, () => svg('line', { class: 'ray' }));
const wallGlow = svg('circle', { class: 'wall-glow', r: 9 });
const lamp = svg('g', { class: 'lamp', role: 'slider', 'aria-label': 'Stage light', 'aria-valuemin': '0', 'aria-valuemax': '90' },
  svg('rect', { class: 'lamp-can', x: L.x - 16, y: L.y - 13, width: 40, height: 26, rx: 7 }),
  svg('rect', { class: 'lamp-lens', x: L.x + L.lens - 4, y: L.y - 11, width: 6, height: 22, rx: 2 }));
const hall = svg('g', { class: 'hall' },
  svg('line', { class: 'floor', x1: 0, x2: BOARD.w, y1: HALL.floor, y2: HALL.floor }),
  svg('path', { class: 'stand', d: `M ${L.x} ${L.y} L ${L.x - 16} ${HALL.floor} M ${L.x} ${L.y} L ${L.x + 16} ${HALL.floor}` }),
  svg('line', { class: 'chain', x1: CH.cx, y1: 0, x2: CH.cx, y2: CH.armY }),
  svg('path', { class: 'arm', d: `M ${CH.cx - CH.arm} ${CH.armY} Q ${CH.cx} ${CH.armY + 18} ${CH.cx + CH.arm} ${CH.armY}` }),
  ...[-1, -0.5, 0.5, 1].map((f) => svg('circle', { class: 'bulb', cx: CH.cx + f * CH.arm, cy: CH.armY - 9 + (1 - Math.abs(f)) * 9, r: 6 })),
  svg('line', { class: 'string', x1: CH.cx, y1: CH.armY + 9, x2: cTop.x, y2: cTop.y }),
  beam, ...rays, wallGlow,
  svg('polygon', { class: 'glass', points: pts([cTop, cRight, cLeft]) }),
  svg('line', { class: 'facet', x1: cTop.x, y1: cTop.y + 8, x2: (cTop.x + cLeft.x) / 2 + 6, y2: (cTop.y + cLeft.y) / 2 + 4 }),
  lamp);

// the tuner, clipped to your violin's scroll; it rises into view with the signal on its screen
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
const signalPath = svg('path', { class: 'signal' });
const parts = A_NOTE.map((_, k) => svg('path', { class: 'part', stroke: NOTE_LED[k], d: signal(part(A_NOTE, k)) }));
const stripBox = svg('rect', { class: 'strip-box', x: STRIP_BOX.x, y: STRIP_BOX.y, width: STRIP_BOX.w, height: STRIP_BOX.h, rx: 16 });
const signalInner = svg('g', { class: 'signal-inner' }, signalPath);
const strip = svg('g', { class: 'strip small', style: `transform: ${css(onTuner())}` }, stripBox, signalInner, ...parts);
const arrive = svg('g', { class: 'arrive' }, tuner, strip);

// the prism for sound, and the four bars it finds
const glyph = svg('g', { class: 'scene glyph' }, svg('polygon', { class: 'glyph-glass', points: pts(triangle(GLYPH)) }));
const bars = A_NOTE.map((_, k) => svg('rect', { class: 'bar', fill: NOTE_LED[k], x: barX(k) - SPECTRUM.barW / 2, width: SPECTRUM.barW, rx: 6 }));
const barLabels = A_NOTE.map((_, k) => svg('text', { class: 'bar-label', x: barX(k), y: SPECTRUM.base + 26, 'text-anchor': 'middle', fill: NOTE_LED[k], text: COPY.notes[k] }));
const fourBars = svg('g', { class: 'four-bars' }, ...bars, ...barLabels);
const spectrum = svg('g', { class: 'spectrum' }, svg('line', { class: 'baseline', x1: SPECTRUM.x - 20, x2: SPECTRUM.x + SPECTRUM.w + 20, y1: SPECTRUM.base, y2: SPECTRUM.base }), fourBars);

// the scanner: your picture, one row lifted out of it, its spots, their bars
const C = cell();
const O = headOutline();
const cells = ROWS_OF_YOU.map((r, j) => r.map((_, i) => svg('rect', { class: 'cell', x: (PIC.x + i * C).toFixed(2), y: (PIC.y + j * C).toFixed(2), width: (C + 0.3).toFixed(2), height: (C + 0.3).toFixed(2) })));
const SHARP = sharpRows();
const S = PIC.size / SHARP.length;
const sharp = svg('g', { class: 'sharp-pic' }, ...SHARP.flatMap((r, j) => r.map((g, i) => svg('rect', { x: (PIC.x + i * S).toFixed(2), y: (PIC.y + j * S).toFixed(2), width: (S + 0.3).toFixed(2), height: (S + 0.3).toFixed(2), fill: grey(g) }))));
const band = svg('rect', { class: 'scene band', x: PIC.x - 3, y: PIC.y - 1, width: PIC.size + 6, height: C + 2, rx: 4 });
const headView = svg('g', { class: 'head-view' },
  svg('rect', { class: 'pic-bg', x: PIC.x - 4, y: PIC.y - 4, width: PIC.size + 8, height: PIC.size + 8, rx: 8 }),
  ...cells.flat(), sharp,
  svg('ellipse', { class: 'head-outline', cx: O.cx, cy: O.cy, rx: O.rx, ry: O.ry }), band);
const arrows = ROW.map((a, k) => (a > 0 ? svg('g', { class: 'spin' },
  svg('line', { x1: spotX(k), y1: BENCH.y + BENCH.r - 4, x2: spotX(k), y2: BENCH.y - BENCH.r + 7 }),
  svg('polygon', { points: pts([{ x: spotX(k), y: BENCH.y - BENCH.r + 2 }, { x: spotX(k) + 4.5, y: BENCH.y - BENCH.r + 9 }, { x: spotX(k) - 4.5, y: BENCH.y - BENCH.r + 9 }]) })) : null));
const spots = ROW.map((a, k) => svg('g', { class: 'spot', tabindex: '-1', role: 'button', 'aria-label': `Spot ${k + 1}` },
  svg('circle', { class: `spot-disc${a > 0 ? '' : ' empty'}`, cx: spotX(k), cy: BENCH.y, r: BENCH.r }), ...(arrows[k] ? [arrows[k]] : [])));
const dots = ROW.map((_, k) => svg('rect', { class: 'dot', x: spotX(k) - 14, y: BENCH.y - 14, width: 28, height: 28, rx: 3 }));
const rings = svg('g', { class: 'rings' });
const bench = svg('g', { class: 'scene bench' }, ...spots, ...dots, rings);
const wedgeEl = svg('polygon', { class: 'scene wedge', points: pts(wedge()) });
const spotBars = ROW.map((_, k) => svg('rect', { class: 'spot-bar growing', fill: neon(k, ROWS), x: spotX(k) - SPOT_BARS.w / 2, width: SPOT_BARS.w, rx: 4 }));
const spotBarGroup = svg('g', { class: 'scene spot-bars' }, ...spotBars);
const glyph2Tip = triangle(GLYPH2);
const barRays = svg('g', { class: 'bar-rays' });
const glyph2 = svg('g', { class: 'scene glyph' }, svg('polygon', { class: 'glyph-glass', points: pts(glyph2Tip) }));
const risers = svg('g', { class: 'risers' });
const scan = svg('g', { class: 'scene scan' }, headView, wedgeEl, spotBarGroup, barRays, bench, risers, glyph2);

board.append(bg, hall, scan, arrive, glyph, spectrum);

// ── the technician: his face, drawn from FACE ─────────────────────────────────────────────────────────
function face() {
  const F = FACE;
  const s = svg('svg', { viewBox: `0 0 ${F.view.w} ${F.view.h}`, class: 'face', 'aria-hidden': 'true' });
  const up = { x: F.head.cx + 30, y: -200 };                 // he looks up, at the board
  const [e0, e1] = F.eyes;
  s.append(
    svg('path', { class: 'shirt', d: shirtPath(), fill: F.shirt }),
    svg('rect', { class: 'skin', x: F.neck.x, y: F.neck.y, width: F.neck.w, height: F.neck.h }),
    ...F.ears.map((e) => svg('ellipse', { class: 'skin', cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry })),
    svg('ellipse', { class: 'skin', cx: F.head.cx, cy: F.head.cy, rx: F.head.rx, ry: F.head.ry }),
    svg('path', { class: 'hair', d: hairPath() }),
    svg('g', { class: 'eyes' },
      ...F.eyes.map((e) => svg('circle', { class: 'eye', cx: e.cx, cy: e.cy, r: F.eyeR })),
      ...F.eyes.map((e) => { const p = lookAt(e, up); return svg('circle', { class: 'pupil', cx: p.x.toFixed(2), cy: p.y.toFixed(2), r: F.pupilR }); })),
    ...F.eyes.map((e) => svg('circle', { class: 'rim', cx: e.cx, cy: e.cy, r: F.rimR })),
    svg('path', { class: 'rim', d: `M ${e0.cx + F.rimR} ${e0.cy - 2} Q ${(e0.cx + e1.cx) / 2} ${e0.cy - 6} ${e1.cx - F.rimR} ${e1.cy - 2}` }),
    svg('path', { class: 'rim', d: `M ${e0.cx - F.rimR} ${e0.cy - 2} L ${F.ears[0].cx + 2} ${F.ears[0].cy - 6} M ${e1.cx + F.rimR} ${e1.cy - 2} L ${F.ears[1].cx - 2} ${F.ears[1].cy - 6}` }),
    ...F.brows.map((b) => svg('line', { class: 'brow', x1: b.x1, y1: b.y1, x2: b.x2, y2: b.y2 })),
    svg('rect', { class: 'mouth', x: F.mouth.x1, y: F.mouth.y - 1.3, width: F.mouth.x2 - F.mouth.x1, height: 2.6, rx: 1.3 }));
  return s;
}

// ── drawing ──────────────────────────────────────────────────────────────────────────────────────
function aim(a) {                                           // the stage light, pointing at angle a
  const p = lightPath(a);
  hitNow = p.hit;
  angleNow = p.angle;
  lamp.setAttribute('transform', `rotate(${((p.angle * 180) / Math.PI).toFixed(2)} ${L.x} ${L.y})`);
  lamp.setAttribute('aria-valuenow', String(Math.round((-p.angle * 180) / Math.PI)));
  for (const [k, v] of Object.entries({ x1: p.beam.from.x, y1: p.beam.from.y, x2: p.beam.to.x, y2: p.beam.to.y })) beam.setAttribute(k, v.toFixed(1));
  hall.classList.toggle('hit', p.hit);
  if (p.hit) p.rays.forEach((r, i) => { for (const [k, v] of Object.entries({ x1: r.from.x, y1: r.from.y, x2: r.to.x, y2: r.to.y })) rays[i].setAttribute(k, v.toFixed(1)); rays[i].setAttribute('stroke', r.color); });
  else { wallGlow.setAttribute('cx', p.beam.to.x.toFixed(1)); wallGlow.setAttribute('cy', p.beam.to.y.toFixed(1)); }
  return p;
}
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
const angles = ROW.map(() => 0);
let spinOn = false;
function spinning(v) {                                      // the tiny magnets in each spot spin, each at its own rate
  spinOn = v;
  if (!v || REDUCED) return;
  let last = performance.now();
  const frame = (now) => {
    if (!spinOn) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    arrows.forEach((g, k) => {
      if (!g) return;
      angles[k] = (angles[k] + 360 * spinRate(k, stronger) * dt) % 360;
      g.setAttribute('transform', `rotate(${angles[k].toFixed(1)} ${spotX(k)} ${BENCH.y})`);
    });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
function pulse(k, amount) {                                 // a ring as big as the note is loud
  if (amount <= 0) return;
  const r = svg('circle', { class: 'ring', cx: spotX(k), cy: BENCH.y, r: (BENCH.r + 4 + 14 * amount).toFixed(1) });
  rings.append(r);
  setTimeout(() => r.remove(), 800);
}
function paintRow(j, amounts, sweep) {
  cells[j].forEach((c, i) => {
    c.setAttribute('fill', grey(amounts[i]));
    c.style.transitionDelay = sweep && !REDUCED ? `${i * 30}ms` : '0ms';
    c.classList.add('lit');
  });
}
const showRow = (j) => { band.style.transform = `translateY(${(rowBand(j).y - PIC.y).toFixed(2)}px)`; };

// ── the prompt: lines fade in, and fade out together before the next part ─────────────────────────────
const say = (text, cls = '') => {
  const p = el('p', { class: `line ${cls}`.trim(), text });
  prompt.append(p);
  requestAnimationFrame(() => p.classList.add('in'));
  return p;
};
/** The technician's lines: a bubble beside his face (one face for lines in a row). */
function speak(text) {
  let block = prompt.lastElementChild;
  if (!block || !block.classList.contains('speaker')) {
    block = el('div', { class: 'speaker', role: 'group', 'aria-label': 'The technician' }, el('div', { class: 'who' }, face()), el('div', { class: 'bubbles' }));
    prompt.append(block);
    requestAnimationFrame(() => block.classList.add('in'));
  }
  const b = el('p', { class: 'bubble', text });
  block.querySelector('.bubbles').append(b);
  requestAnimationFrame(() => b.classList.add('in'));
  const f = block.querySelector('.face');
  f.classList.remove('talking');
  f.getBoundingClientRect();
  f.classList.add('talking');
  return b;
}
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
const boardPoint = (e) => { const p = board.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(board.getScreenCTM().inverse()); };
/** Taps on the row of spots (or on their bars) call onTap(k); so does Enter on a spot. Returns a function that stops listening. */
function tapSpots(onTap) {
  board.classList.add('tapping');
  const pd = (e) => { const q = boardPoint(e); if (q.y > BENCH.y - BENCH.step && q.y < SPOT_BARS.base + 8) onTap(spotAt(q.x)); };
  const keys = spots.map((s, k) => { const f = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(k); } }; s.setAttribute('tabindex', '0'); s.addEventListener('keydown', f); return f; });
  board.addEventListener('pointerdown', pd);
  return () => {
    board.classList.remove('tapping');
    board.removeEventListener('pointerdown', pd);
    spots.forEach((s, k) => { s.setAttribute('tabindex', '-1'); s.removeEventListener('keydown', keys[k]); });
  };
}

// ── the story ────────────────────────────────────────────────────────────────────────────────────
async function theHall() {                                  // back at the concert hall: the lights dim
  describe('A concert hall: a chandelier with a glass prism hanging from it, and a stage light on the floor.');
  requestAnimationFrame(() => figure.classList.add('in'));
  say(COPY.opening, 'lead');
  await pause(reading(COPY.opening));
  phase = 'hall';
  board.classList.add('night');
  say(COPY.dim);
  await wait(900);
  aim(startAngle());
  hall.classList.add('lit');
  describe('The hall is dark. The stage light shines a white beam across to the wall, below the prism.');
  await pause(reading(COPY.dim));
  say(COPY.crystal);
  await pause(reading(COPY.crystal));
  await aimTheLight();
  theColors();
}

function aimTheLight() {                                    // the learner swings the light into the prism
  phase = 'aim';
  say(COPY.aim);
  const hint = setTimeout(() => { if (phase === 'aim') say(COPY.aimHint, 'hint'); }, 8000);
  board.classList.add('aiming');
  lamp.setAttribute('tabindex', '0');
  followFocus(lamp);
  return new Promise((resolve) => {
    let down = false;
    let done = false;
    const set = (e) => aim(aimAngle(boardPoint(e)));
    const pd = (e) => { down = true; try { board.setPointerCapture(e.pointerId); } catch { /* not capturable */ } set(e); };
    const pm = (e) => { if (down) set(e); };
    const pu = () => { if (!down) return; down = false; if (hitNow) finish(); };
    const kd = (e) => {
      const step = { ArrowUp: -2, ArrowLeft: -2, ArrowDown: 2, ArrowRight: 2 }[e.key];
      if (step) { e.preventDefault(); const p = aim(angleNow + (step * Math.PI) / 180); if (p.hit) finish(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aim(toCrystal()); finish(); }
    };
    const events = [['pointerdown', pd], ['pointermove', pm], ['pointerup', pu], ['pointercancel', pu]];
    events.forEach(([t, f]) => board.addEventListener(t, f));
    lamp.addEventListener('keydown', kd);
    async function finish() {
      if (done) return;
      done = true;
      clearTimeout(hint);
      events.forEach(([t, f]) => board.removeEventListener(t, f));
      lamp.removeEventListener('keydown', kd);
      lamp.setAttribute('tabindex', '-1');
      board.classList.remove('aiming');
      describe('The white beam goes into the prism and comes out as a fan of colours on the wall: red, orange, yellow, green, cyan, blue, violet.');
      await pause(1300);
      resolve();
    }
  });
}

async function theColors() {                                // where did the colours come from?
  phase = 'colors';
  await clear();
  say(COPY.where.question);
  await ask(COPY.where.choices);
  say(COPY.where.after);
  await pause(reading(COPY.where.after) + 300);
  say(COPY.think, 'thought');
  await pause(reading(COPY.think) + 300);
  say(COPY.surprise, 'lead');
  await pause(reading(COPY.surprise) + 300);
  theTuner();
}

async function theTuner() {                                 // the hall rises away; your violin and its tuner rise in
  phase = 'tuner';
  await clear();
  hall.classList.add('leaving');
  arrive.classList.add('up');
  await wait(1100);
  hall.style.visibility = 'hidden';
  describe('A tuner clipped to the scroll of your violin. Its screen is blank.');
  say(COPY.clipOn);
  await press(COPY.play);
  runSignal(A_NOTE);                                         // the signal appears on the tuner's screen as you play
  await play(A_NOTE, 1.8);
  tuner.classList.add('in-tune');
  describe("On the tuner's screen, your note drawn as a bumpy line, with the letter A under it and a green light.");
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
  describe("Your note's signal, big now: a bumpy line drifting across.");
  say(COPY.knowBetter);
  await pause(reading(COPY.knowBetter));
  say(COPY.see.question);
  await ask(COPY.see.choices);
  say(COPY.see.after);
  await pause(reading(COPY.see.after) + 200);
  theSplit();
}

async function theSplit() {                                 // the prism for sound: four notes, four bars
  phase = 'split';
  await press(COPY.prismOn);
  await clear();
  still(A_NOTE);
  on(glyph);
  mine = [...A_NOTE];
  bars.forEach((b) => b.classList.add('growing'));
  drawBars();
  on(spectrum);
  strip.classList.add('splitting');                         // the four notes lift out of the signal …
  await wait(900);
  parts.forEach((p, k) => {                                 // … and fall through the prism into their bars
    p.style.transform = `translate(${barX(k) - (STRIP.x + STRIP.w / 2)}px, ${SPECTRUM.base - barHeight(A_NOTE[k]) / 2 - (STRIP.y + STRIP.h / 2)}px) scale(0.09, 0.5)`;
  });
  strip.classList.add('dropping');
  await wait(650);
  bars.forEach((b) => b.classList.remove('growing'));
  fourBars.classList.add('on');
  await wait(600);
  on(glyph, false);
  strip.classList.remove('splitting', 'dropping');
  parts.forEach((p) => { p.style.transform = ''; });
  describe('Under the signal, four glowing bars, labelled A, high A, E and higher A, tallest first.');
  say(COPY.split, 'lead');
  await pause(reading(COPY.split));
  say(COPY.howMuch);
  await pause(reading(COPY.howMuch));
  say(COPY.twoWays);
  await pause(reading(COPY.twoWays) + 300);
  tuningFork();
}

function dragBars(onChange) {                               // drag on the bars: each bar's height follows the pointer
  board.classList.add('dragging-on');
  let down = false;
  const set = (e) => {
    const q = boardPoint(e);
    if (q.y < SPECTRUM.base - barHeight(STEPS) - 40) return;
    const k = barAt(q.x);
    const v = stepsAt(q.y);
    if (mine[k] !== v) { mine = mine.map((a, i) => (i === k ? v : a)); drawBars(); still(mine); onChange(); }
  };
  const pd = (e) => { down = true; try { board.setPointerCapture(e.pointerId); } catch { /* not capturable */ } set(e); };
  const pm = (e) => { if (down) set(e); };
  const pu = () => { if (!down) return; down = false; play(mine, 0.9); };
  const events = [['pointerdown', pd], ['pointermove', pm], ['pointerup', pu], ['pointercancel', pu]];
  events.forEach(([t, f]) => board.addEventListener(t, f));
  return () => { board.classList.remove('dragging-on'); events.forEach(([t, f]) => board.removeEventListener(t, f)); };
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
  theTechnician();
}

async function theTechnician() {                            // at the break: the technician, and one row of you
  phase = 'tech';
  await clear();
  fourBars.classList.remove('on');
  on(spectrum, false);
  signalInner.classList.add('swapping');                    // the violin's signal fades; its box moves to the top
  strip.classList.add('radio');
  strip.style.transform = css(toReply());
  await wait(700);
  running = null;
  signalPath.setAttribute('d', '');
  signalInner.classList.remove('swapping');
  showRow(HAND_ROW);
  on(scan);
  on(band);
  describe('An empty picture with the dashed outline of your head, and one row across it marked. An empty signal box at the top.');
  say(COPY.arrives);
  await pause(reading(COPY.arrives));
  speak(COPY.tech.hi);
  await pause(reading(COPY.tech.hi));
  jump(bench, css(benchToRow(HAND_ROW)));                   // the row lifts out of the picture and spreads across the board
  on(bench);
  headView.classList.add('dim');
  requestAnimationFrame(() => { bench.style.transform = 'none'; });
  spinning(true);
  speak(COPY.tech.row);
  await wait(1100);
  describe('The row, close up: sixteen spots in a line. In most, a little arrow spins; the ones at the ends are empty. All spin at the same speed.');
  await pause(reading(COPY.tech.row));
  speak(COPY.tech.same);
  await pause(reading(COPY.tech.same) - 600);
  await press(COPY.stronger);
  stronger = true;                                           // the magnet, a little stronger to the right
  on(wedgeEl);
  describe('A wedge under the row, thin on the left and thick on the right. The arrows on the right now spin much faster than those on the left.');
  speak(COPY.tech.faster);
  await pause(reading(COPY.tech.faster) + 400);
  await clear();
  await listen();
  await allAtOnce();
}

function listen() {                                         // tap the spots: each its own note, as loud as there is of you
  phase = 'listen';
  say(COPY.tapSpots);
  return new Promise((resolve) => {
    let told = false;
    let stop = () => {};
    const tell = () => {
      if (told) return;
      told = true;
      clearTimeout(timer);
      say(COPY.radio, 'caption');
      press(COPY.allAtOnce).then(() => { stop(); resolve(); });
    };
    const timer = setTimeout(tell, 6000);
    stop = tapSpots((k) => { spotNote(k, ROW[k]); pulse(k, ROW[k]); tell(); });
  });
}

async function allAtOnce() {                                // every spot at once: one signal
  phase = 'chord';
  risers.replaceChildren(...ROW.map((a, k) => (a > 0 ? svg('path', {
    class: 'riser', stroke: neon(k, ROWS), style: `--rise: ${(REPLY_BOX.y + REPLY_BOX.h / 2 - BENCH.y).toFixed(1)}px; animation-delay: ${k * 30}ms`,
    d: `M ${spotX(k) - 9} ${BENCH.y} q 4.5 -8 9 0 t 9 0`,
  }) : null)).filter(Boolean));
  const heard = allNotes(ROW, 2.2);
  await wait(800);
  const samples = chordSamples(ROW);
  signalPath.setAttribute('d', samplesPath(samples, STRIP));
  describe('All the notes together: one busy signal at the top.');
  await heard;
  risers.replaceChildren();
  await clear();
  speak(COPY.tech.hears);
  await pause(reading(COPY.tech.hears) - 400);
  await press(COPY.prismOn);
  const found = unmix(samples, ROWS);                        // the prism for sound
  on(glyph2);
  const tip = { x: GLYPH2.cx, y: glyph2Tip[1].y };
  barRays.replaceChildren(...found.map((a, k) => (a > 0.01 ? svg('line', { class: 'bar-ray', stroke: neon(k, ROWS), x1: tip.x, y1: tip.y, x2: spotX(k), y2: (SPOT_BARS.base - spotBarHeight(a)).toFixed(1) }) : null)).filter(Boolean));
  spotBars.forEach((b, k) => { const h = spotBarHeight(found[k]); b.setAttribute('y', (SPOT_BARS.base - h).toFixed(1)); b.setAttribute('height', Math.max(0.001, h).toFixed(1)); });
  on(spotBarGroup);
  await wait(60);
  barRays.classList.add('on');
  await wait(700);
  spotBars.forEach((b, k) => { b.style.transitionDelay = REDUCED ? '0ms' : `${k * 25}ms`; b.classList.remove('growing'); });
  await wait(900);
  barRays.classList.remove('on');
  on(glyph2, false);
  describe('Under every spot, a glowing bar: none under the empty spots, short ones near the edges of the head, tall ones in between, two short ones in the middle.');
  speak(COPY.tech.underSpot);
  await pause(reading(COPY.tech.underSpot));
  await theMost(found);
}

async function theMost(found) {                             // which spot holds the most of you?
  phase = 'most';
  await clear();
  say(COPY.most);
  const k = await new Promise((resolve) => { const stop = tapSpots((i) => { stop(); resolve(i); }); });
  spotBars[k].classList.add('picked');
  tallest(found).forEach((i) => spotBars[i].classList.add('tallest'));
  speak(COPY.tech.tallest);
  await pause(reading(COPY.tech.tallest) + 300);
  speak(COPY.tech.paint);
  await press(COPY.paintRow);
  phase = 'paint';                                           // tall bar, bright dot
  dots.forEach((d, i) => d.setAttribute('fill', grey(found[i])));
  bench.classList.add('painted');
  spotBars.forEach((b) => { b.style.transitionDelay = '0ms'; b.classList.add('growing'); });
  on(wedgeEl, false);
  await wait(1000);
  spinOn = false;
  on(spotBarGroup, false);
  headView.classList.remove('dim');                          // the row slides back into its place in your picture
  bench.style.transform = css(benchToRow(HAND_ROW));
  await wait(1100);
  paintRow(HAND_ROW, found, false);
  on(bench, false);
  painted = 1;
  describe('The row of grey dots is back in the picture, at its place across your head.');
  rowByRow();
}

async function rowByRow() {                                 // one signal, one row; then row after row
  phase = 'rows';
  await clear();
  speak(COPY.tech.oneRow);
  const order = rowOrder(ROWS);
  const next = async (j, quick) => {
    showRow(j);
    const samples = chordSamples(ROWS_OF_YOU[j]);
    signalPath.setAttribute('d', samplesPath(samples, STRIP));
    if (!quick) { await wait(450); on(glyph2); await wait(350); on(glyph2, false); }
    paintRow(j, unmix(samples, ROWS), !quick);
    painted++;
    await (quick ? pause(REDUCED ? 0 : 90) : wait(800));
  };
  for (let r = 1; r <= 2; r++) {
    await press(COPY.nextRow);
    await next(order[r], false);
  }
  speak(COPY.tech.rest);
  phase = 'auto';
  for (let r = 3; r < ROWS; r++) await next(order[r], true);
  on(band, false);
  describe('Row by row, a blocky grey picture of a head has appeared.');
  await pause(900);
  phase = 'sharp';
  speak(COPY.tech.sharp);
  headView.classList.add('sharp');
  sharp.classList.add('on');
  describe('The blocky picture sharpens into a detailed picture of a head: the picture from your scan.');
  await pause(reading(COPY.tech.sharp) + 800);
  await clear();
  say(COPY.pictureOut, 'lead');
  await pause(reading(COPY.pictureOut));
  speak(COPY.tech.bothWays);
  await pause(reading(COPY.tech.bothWays) + 600);
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
window.__prism = {
  get phase() { return phase; }, get mine() { return [...mine]; }, get hit() { return hitNow; }, get stronger() { return stronger; }, get painted() { return painted; },
  point: (x, y) => { const m = board.getScreenCTM(); return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }; },
};

theHall();
