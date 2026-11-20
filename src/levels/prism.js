// Level 3, "A prism for sound" (docs/levels_spec.md, Revision 5). It comes straight after Level 2: after your scan,
// you head back to the concert hall. The lights dim; the learner aims a stage light at the chandelier, and its glass
// prism takes the white light apart into colours. You wonder: is there a tool that can take apart a sound? Surprise:
// your tuner. Its screen draws your A note's signal, the signal grows to fill the board, and taking it apart gives four
// glowing bars, which the learner drags into a tuning fork and back. At the break, the technician from your scan says
// the scanner works the same way, and Nadia's sentence appears, faded: "MRI takes the frequencies of your flipping
// magnets from the MRI signal, and translates them into a physical image." Three buttons light it up part by part on
// the board: flip the magnets (they spin, faster to the right) and their signal appears; take it apart into its
// frequencies; make the image, row after row. Then the pattern (violin note → pure tones, stage light → its colours,
// proton frequencies → image), and only then the name.
// Scenes move into one another rather than swap. Every learner-facing line comes from copyPrism.js; every position,
// bar and row from src/math (prism.js, tones.js, scanner.js).
import './prism.css';

import { COPY } from './copyPrism.js';
import { A_NOTE, STEPS, PITCH, part } from '../math/tones.js';
import {
  BOARD, css, triangle, HALL, crystalCorners, aimAngle, toCrystal, startAngle, lightPath,
  STRIP, STRIP_BOX, signal, samplesPath, TUNER, onTuner, SPECTRUM, GLYPH, barX, barHeight, barAt, stepsAt, pureTone, allBack,
  NOTE_LED, neon, ROWS, MRI, spinRate, coarseRows, magnetSpots, colourAt, chordSamples, unmix, mriBar, rowOrder, FIRST_ROW,
  rowIn, outlineIn, toSignal, FACE, hairPath, shirtPath, lookAt, PLAYER, TECH, bucketHat,
  PATTERN, patternBox, stripToPattern, picToPattern, patternBars, patternLight,
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
const line = (p, q, attrs) => svg('line', { x1: p.x.toFixed(1), y1: p.y.toFixed(1), x2: q.x.toFixed(1), y2: q.y.toFixed(1), ...attrs });

// ── state ────────────────────────────────────────────────────────────────────────────────────────
let phase = 'opening';
let mine = [...A_NOTE];
let hitNow = false;
let angleNow = 0;                                           // where the stage light points
let flipped = false;
let painted = 0;
const ROWS_OF_YOU = coarseRows();                           // how many tiny magnets at each place of your head, row by row

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

// the hall: a stage light on the floor, a chandelier, a glass prism hanging from it
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

// taking the A note apart: four glowing bars
const glyph = svg('g', { class: 'scene glyph' }, svg('polygon', { class: 'glyph-glass', points: pts(triangle(GLYPH)) }));
const bars = A_NOTE.map((_, k) => svg('rect', { class: 'bar', fill: NOTE_LED[k], x: barX(k) - SPECTRUM.barW / 2, width: SPECTRUM.barW, rx: 6 }));
const barLabels = A_NOTE.map((_, k) => svg('text', { class: 'bar-label', x: barX(k), y: SPECTRUM.base + 26, 'text-anchor': 'middle', fill: NOTE_LED[k], text: COPY.notes[k] }));
const fourBars = svg('g', { class: 'four-bars' }, ...bars, ...barLabels);
const spectrum = svg('g', { class: 'spectrum' }, svg('line', { class: 'baseline', x1: SPECTRUM.x - 20, x2: SPECTRUM.x + SPECTRUM.w + 20, y1: SPECTRUM.base, y2: SPECTRUM.base }), fourBars);

// the scanner: your head and its tiny magnets → the MRI signal (the strip, moved) → its frequencies → a physical image
const MAGNETS = magnetSpots();
const ho = outlineIn(MRI.head);
const headBand = svg('rect', { class: 'scene band', x: MRI.head.x - 2, y: MRI.head.y, width: MRI.head.size + 4, height: (MRI.head.size / ROWS + 1).toFixed(2), rx: 1.5 });
const magnets = MAGNETS.map((m) => svg('g', { class: 'magnet', style: `opacity: ${(0.4 + 0.6 * m.amount).toFixed(2)}` },
  svg('line', { x1: m.x, y1: m.y + 7, x2: m.x, y2: m.y - 4, stroke: colourAt(m.xf) }),
  svg('polygon', { points: pts([{ x: m.x, y: m.y - 9 }, { x: m.x + 4, y: m.y - 3 }, { x: m.x - 4, y: m.y - 3 }]), fill: colourAt(m.xf) })));
const headPanel = svg('g', { class: 'mri-part' },
  svg('rect', { class: 'p-box', x: MRI.head.x - 4, y: MRI.head.y - 4, width: MRI.head.size + 8, height: MRI.head.size + 8, rx: 10 }),
  svg('ellipse', { class: 'head-outline', cx: ho.cx, cy: ho.cy, rx: ho.rx, ry: ho.ry }), ...magnets, headBand);
const mBars = Array.from({ length: ROWS }, (_, k) => svg('rect', { class: 'm-bar', fill: neon(k, ROWS) }));
const barsPanel = svg('g', { class: 'mri-part m-bars' },
  svg('rect', { class: 'p-box', x: MRI.bars.x, y: MRI.bars.y, width: MRI.bars.w, height: MRI.bars.h, rx: 10 }), ...mBars);
const mGlyph = svg('g', { class: 'scene glyph' }, svg('polygon', { class: 'glyph-glass', points: pts(triangle(MRI.glyph)) }));
const mArrows = MRI.arrows.map((a) => svg('g', { class: 'mri-part p-arrow m-arrow' },
  line({ x: a.x1, y: a.y }, { x: a.x2 - 6, y: a.y }, {}), svg('polygon', { points: pts([{ x: a.x2, y: a.y }, { x: a.x2 - 12, y: a.y - 7 }, { x: a.x2 - 12, y: a.y + 7 }]) })));
const P = MRI.picture;
const cellSize = P.size / ROWS;
const cells = ROWS_OF_YOU.map((r, j) => r.map((_, i) => svg('rect', { class: 'cell', x: (P.x + i * cellSize).toFixed(2), y: (P.y + j * cellSize).toFixed(2), width: (cellSize + 0.3).toFixed(2), height: (cellSize + 0.3).toFixed(2) })));
const image = svg('g', { class: 'mri-image' }, svg('rect', { class: 'pic-bg', x: P.x - 4, y: P.y - 4, width: P.size + 8, height: P.size + 8, rx: 8 }), ...cells.flat());
const scan = svg('g', { class: 'scene scan' }, headPanel, mArrows[0], barsPanel, mGlyph, mArrows[1], image);

// the pattern: the scanner's row is the signal and the picture, moved down; the violin and the light join them above
const arrowOf = (i) => {
  const y = PATTERN.y[i] + PATTERN.h / 2;
  const { x1, x2 } = PATTERN.arrow;
  return svg('g', { class: 'p-arrow' }, line({ x: x1, y }, { x: x2 - 6, y }, {}), svg('polygon', { points: pts([{ x: x2, y }, { x: x2 - 12, y: y - 7 }, { x: x2 - 12, y: y + 7 }]) }));
};
const violinBox = patternBox(0, 'left');
const lightRow = patternLight();
const patternRows = [
  svg('g', { class: 'p-row' },
    svg('rect', { class: 'p-box', x: violinBox.x, y: violinBox.y, width: violinBox.w, height: violinBox.h, rx: 12 }),
    svg('path', { class: 'p-signal', d: signal(A_NOTE), transform: (() => { const b = { x: violinBox.x + 10, y: violinBox.y + 8, w: violinBox.w - 20, h: violinBox.h - 16 }; const sx = b.w / STRIP.w; const sy = b.h / STRIP.h; return `translate(${(b.x - STRIP.x * sx).toFixed(2)} ${(b.y - STRIP.y * sy).toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`; })() }),
    ...patternBars().map((b, k) => svg('rect', { class: 'p-bar', fill: NOTE_LED[k], x: b.x.toFixed(1), y: b.y.toFixed(1), width: b.w.toFixed(1), height: b.h.toFixed(1), rx: 3 })),
    arrowOf(0)),
  svg('g', { class: 'p-row' },
    line(lightRow.beam.from, lightRow.beam.to, { class: 'p-beam' }),
    svg('polygon', { class: 'glass', points: pts(lightRow.corners) }),
    ...lightRow.rays.map((r) => line(r.from, r.to, { class: 'p-ray', stroke: r.color })),
    arrowOf(1)),
  svg('g', { class: 'p-row' }, arrowOf(2)),
];
const pattern = svg('g', { class: 'scene pattern' }, ...patternRows);

board.append(bg, hall, scan, arrive, glyph, spectrum, pattern);

// ── the characters: the technician, and you (the player) ───────────────────────────────────────────────
function face(who) {
  const F = FACE;
  const you = who === 'you';
  const s = svg('svg', { viewBox: `0 0 ${F.view.w} ${F.view.h}`, class: `face ${who}`, 'aria-hidden': 'true' });
  const up = { x: F.head.cx + (you ? -30 : 30), y: -200 };   // both look up, at the board
  const [e0, e1] = F.eyes;
  const hat = bucketHat();
  s.append(
    svg('path', { class: 'shirt', d: shirtPath(), fill: (you ? PLAYER : TECH).shirt }),
    svg('rect', { class: 'skin', x: F.neck.x, y: F.neck.y, width: F.neck.w, height: F.neck.h }),
    ...F.ears.map((e) => svg('ellipse', { class: 'skin', cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry })),
    svg('ellipse', { class: 'skin', cx: F.head.cx, cy: F.head.cy, rx: F.head.rx, ry: F.head.ry }),
    svg('path', { class: 'hair', d: hairPath(), fill: (you ? PLAYER : TECH).hair }),
    ...(you ? [svg('path', { class: 'hat', d: hat.crown, fill: PLAYER.hat }), svg('path', { class: 'hat-band', d: hat.band, fill: PLAYER.band }), svg('path', { class: 'hat', d: hat.brim, fill: PLAYER.hat })] : []),
    svg('g', { class: 'eyes' },
      ...F.eyes.map((e) => svg('circle', { class: 'eye', cx: e.cx, cy: e.cy, r: F.eyeR })),
      ...F.eyes.map((e) => { const p = lookAt(e, up); return svg('circle', { class: 'pupil', cx: p.x.toFixed(2), cy: p.y.toFixed(2), r: F.pupilR }); })),
    ...F.eyes.map((e) => svg('circle', { class: 'rim', cx: e.cx, cy: e.cy, r: F.rimR })),
    svg('path', { class: 'rim', d: `M ${e0.cx + F.rimR} ${e0.cy - 2} Q ${(e0.cx + e1.cx) / 2} ${e0.cy - 6} ${e1.cx - F.rimR} ${e1.cy - 2}` }),
    svg('path', { class: 'rim', d: `M ${e0.cx - F.rimR} ${e0.cy - 2} L ${F.ears[0].cx + 2} ${F.ears[0].cy - 6} M ${e1.cx + F.rimR} ${e1.cy - 2} L ${F.ears[1].cx - 2} ${F.ears[1].cy - 6}` }),
    ...F.brows.map((b) => svg('line', { class: 'brow', x1: b.x1, y1: b.y1, x2: b.x2, y2: b.y2, stroke: (you ? PLAYER : TECH).hair })),
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
let spinOn = false;
function spinning() {                                       // the tiny magnets flip over, then spin: faster to the right
  spinOn = true;
  const turn = (m, g, deg) => g.setAttribute('transform', `rotate(${deg.toFixed(1)} ${m.x} ${m.y})`);
  if (REDUCED) { MAGNETS.forEach((m, k) => turn(m, magnets[k], 90)); return; }
  const t0 = performance.now();
  const FLIP = 0.7;
  const frame = (now) => {
    if (!spinOn) return;
    const t = (now - t0) / 1000;
    MAGNETS.forEach((m, k) => turn(m, magnets[k], t < FLIP ? 90 * (t / FLIP) : 90 + 360 * spinRate(m.xf) * (t - FLIP)));
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
function drawMBars(amounts) {
  mBars.forEach((b, k) => { const r = mriBar(k, amounts[k]); for (const [a, v] of Object.entries({ x: r.x, y: r.y, width: r.w, height: Math.max(0.001, r.h) })) b.setAttribute(a, v.toFixed(2)); });
}
function paintRow(j, amounts, sweep) {
  cells[j].forEach((c, i) => {
    c.setAttribute('fill', grey(amounts[i]));
    c.style.transitionDelay = sweep && !REDUCED ? `${i * 8}ms` : '0ms';
    c.classList.add('lit');
  });
}
const showRow = (j) => { headBand.style.transform = `translateY(${(rowIn(MRI.head, j).y - MRI.head.y).toFixed(2)}px)`; };
/** Nadia's sentence, faded; light(step) lights the parts that step makes happen. */
function sentence() {
  const parts = COPY.mri.map((f) => el('span', { class: 'frag', text: f.text }));
  const p = el('p', { class: 'line mri-sentence' }, ...parts);
  prompt.append(p);
  requestAnimationFrame(() => p.classList.add('in'));
  return (step) => COPY.mri.forEach((f, i) => { if (f.step === step) parts[i].classList.add('lit'); });
}

// ── the prompt: lines fade in, and fade out together before the next part ─────────────────────────────
const say = (text, cls = '') => {
  const p = el('p', { class: `line ${cls}`.trim(), text });
  prompt.append(p);
  requestAnimationFrame(() => p.classList.add('in'));
  return p;
};
/** A character's line: a bubble beside their face (one face for lines in a row). `who` is 'tech' or 'you'; a thought gets a thought bubble. */
function speak(text, who = 'tech', thought = false) {
  let block = prompt.lastElementChild;
  if (!block || !block.classList.contains('speaker') || block.dataset.who !== who) {
    block = el('div', { class: `speaker ${who}`, 'data-who': who, role: 'group', 'aria-label': who === 'you' ? 'You' : 'The technician' },
      el('div', { class: 'who' }, face(who)), el('div', { class: 'bubbles' }));
    prompt.append(block);
    requestAnimationFrame(() => block.classList.add('in'));
  }
  const b = el('p', { class: `bubble${thought ? ' thought' : ''}`, text });
  block.querySelector('.bubbles').append(b);
  requestAnimationFrame(() => b.classList.add('in'));
  const f = block.querySelector('.face');
  f.classList.remove('talking');
  f.getBoundingClientRect();
  if (!thought) f.classList.add('talking');
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

// ── the story ────────────────────────────────────────────────────────────────────────────────────
async function theHall() {                                  // back at the concert hall: the lights dim
  describe('A concert hall: a chandelier with a piece of glass hanging from it, and a stage light on the floor.');
  requestAnimationFrame(() => figure.classList.add('in'));
  say(COPY.opening, 'lead');
  await pause(reading(COPY.opening));
  phase = 'hall';
  board.classList.add('night');
  say(COPY.dim);
  await wait(900);
  aim(startAngle());
  hall.classList.add('lit');
  describe('The hall is dark. The stage light shines a white beam across to the wall, below the chandelier.');
  await pause(reading(COPY.dim));
  await aimTheLight();
  theColors();
}

function aimTheLight() {                                    // the learner swings the light onto the chandelier
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
      describe('The white beam goes into the glass on the chandelier and comes out as a fan of colours on the wall: red, orange, yellow, green, cyan, blue, violet.');
      await pause(1300);
      resolve();
    }
  });
}

async function theColors() {                                // where did the colours come from? and a sound?
  phase = 'colors';
  await clear();
  say(COPY.where.question);
  await ask(COPY.where.choices);
  say(COPY.where.after);
  await pause(reading(COPY.where.after) + 300);
  await clear();
  speak(COPY.you.think, 'you', true);
  await pause(reading(COPY.you.think) + 300);
  say(COPY.surprise, 'lead');
  await pause(reading(COPY.surprise));
  theTuner();
}

async function theTuner() {                                 // the hall rises away; your violin and its tuner rise in
  phase = 'tuner';
  hall.classList.add('leaving');
  arrive.classList.add('up');
  await wait(1100);
  hall.style.visibility = 'hidden';
  describe('A tuner clipped to the scroll of your violin. Its screen is blank.');
  await press(COPY.play);
  await clear();
  runSignal(A_NOTE);                                         // the signal appears on the tuner's screen as you play
  await play(A_NOTE, 1.8);
  tuner.classList.add('in-tune');
  describe("On the tuner's screen, your note drawn as a bumpy line, with the letter A under it and a green light.");
  say(COPY.drawsSignal);
  await pause(reading(COPY.drawsSignal) + 300);
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
  say(COPY.see.question);
  await ask(COPY.see.choices);
  say(COPY.see.after);
  await pause(reading(COPY.see.after) + 200);
  theSplit();
}

async function theSplit() {                                 // taking it apart: four notes, four bars
  phase = 'split';
  await press(COPY.apart);
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
  await pause(reading(COPY.split) + 300);
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

async function theTechnician() {                            // at the break: the technician; the scanner, in one sentence
  phase = 'tech';
  await clear();
  fourBars.classList.remove('on');
  on(spectrum, false);
  signalInner.classList.add('swapping');                    // the violin's signal fades; its box moves to become the MRI signal's
  strip.classList.add('radio');
  strip.style.transform = css(toSignal());
  await wait(700);
  running = null;
  signalPath.setAttribute('d', '');
  signalInner.classList.remove('swapping');
  on(scan);
  describe('Your head, seen from above, with tiny magnets in it, all pointing up. Then an empty signal box, an empty box for bars, and an empty image.');
  say(COPY.arrives);
  await pause(reading(COPY.arrives));
  speak(COPY.you.tookApart, 'you');
  await pause(reading(COPY.you.tookApart));
  speak(COPY.tech.same);
  await pause(reading(COPY.tech.same));
  const light = sentence();
  await press(COPY.flip);
  phase = 'flip';                                            // your magnets flip, and spin: faster to the right
  flipped = true;
  spinning();
  light(0);
  await wait(1100);
  mArrows[0].classList.add('lit');                           // their signal
  jump(headBand, `translateY(${(rowIn(MRI.head, FIRST_ROW).y - MRI.head.y).toFixed(2)}px)`);
  on(headBand);
  signalInner.classList.add('swapping');
  signalPath.setAttribute('d', samplesPath(chordSamples(ROWS_OF_YOU[FIRST_ROW]), STRIP));
  await wait(60);
  signalInner.classList.remove('swapping');
  light(1);
  describe('The tiny magnets have flipped over and spin, faster on the right. Their signal appears in the box: a busy wave.');
  await wait(900);
  phase = 'apart';
  await press(COPY.apart);                                   // its frequencies
  on(mGlyph);
  barsPanel.classList.add('on');
  drawMBars(unmix(chordSamples(ROWS_OF_YOU[FIRST_ROW]), ROWS));
  light(2);
  describe('Under the signal, a row of thin glowing bars, one for each frequency, in the colours of the places they come from.');
  await wait(1100);
  on(mGlyph, false);
  phase = 'image';
  await press(COPY.makeImage);                               // the physical image, row after row
  mArrows[1].classList.add('lit');
  light(3);
  headBand.style.transitionDuration = REDUCED ? '0ms' : '40ms';
  for (const j of rowOrder(ROWS)) {
    showRow(j);
    const samples = chordSamples(ROWS_OF_YOU[j]);
    signalPath.setAttribute('d', samplesPath(samples, STRIP));
    const found = unmix(samples, ROWS);
    drawMBars(found);
    paintRow(j, found, j === FIRST_ROW);
    painted++;
    await pause(REDUCED ? 0 : j === FIRST_ROW ? 500 : 45);
  }
  headBand.style.transitionDuration = '';                     // back to the middle row: its signal and its frequencies stay on show
  showRow(FIRST_ROW);
  signalPath.setAttribute('d', samplesPath(chordSamples(ROWS_OF_YOU[FIRST_ROW]), STRIP));
  drawMBars(unmix(chordSamples(ROWS_OF_YOU[FIRST_ROW]), ROWS));
  mArrows.forEach((a) => a.classList.remove('lit'));
  describe('Row by row, the image has appeared: a picture of your head.');
  await pause(1800);
  thePattern();
}

async function thePattern() {                               // do you notice a pattern?
  phase = 'pattern';
  await clear();
  speak(COPY.tech.pattern.question);
  await ask(COPY.tech.pattern.choices);
  speak(COPY.tech.pattern.after);
  strip.style.transform = css(stripToPattern());             // the MRI signal and the image move down into the third row
  image.style.transform = css(picToPattern());
  scan.classList.add('to-pattern');                          // the head, the bars and the arrows give way
  setTimeout(() => { spinOn = false; }, 700);
  on(pattern);
  await wait(1200);
  describe('Three rows. A violin note’s wave, then its four bars. A white beam into a prism, then a fan of colours. The scanner’s signal, then the picture of your head.');
  for (let i = 0; i < 3; i++) {
    patternRows[i].classList.add('on');
    say(COPY.pattern[i], 'pattern-line');
    await wait(1400);
  }
  await pause(800);
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
  get phase() { return phase; }, get mine() { return [...mine]; }, get hit() { return hitNow; }, get flipped() { return flipped; }, get painted() { return painted; },
  point: (x, y) => { const m = board.getScreenCTM(); return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }; },
};

theHall();
