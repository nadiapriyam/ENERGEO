// Level 3, "A prism for sound" (docs/levels_spec.md, Revision 12). It comes straight after Level 2: after your scan,
// you head back to the concert hall. The lights dim; the learner aims a stage light at the chandelier, and its glass
// prism takes the white light apart into colours. You wonder: is there a tool that can take apart a sound? Surprise:
// your tuner. Its screen draws your A note's signal, the signal grows to fill the board, and taking it apart gives four
// glowing bars, which the learner drags into a tuning fork and back. At the break, the hall's lights come up and the
// radiologist who read your scan walks over to you. Then the people step away and your patient's head comes back up, big and
// labelled: tap a part of the brain, then the skull, and see each one's own signal come out of the spot you tapped. Nadia's description is shown one part at a
// time, the earlier parts turning grey: each body part behaves differently; collecting that data (the head moves aside
// and one busy signal appears); converting it into pixel data, row after row; an MRI picture, with the Fourier
// transform. Then the pattern, one slide at a time, each caption under its own pictures (violin note → pure tones,
// stage light → its colours, MRI image → proton frequencies), all three together, the grand reveal of the Fourier
// transform, and: the applications are endless.
// For review, ?step=<id> stops the level at a named step (the review strip at try/?steps shows every one), and
// ?from=<id> fast-forwards to it and plays on from there (stepsPrism.js lists the steps).
// Scenes move into one another rather than swap. Every learner-facing line comes from copyPrism.js; every position,
// bar and row from src/math (prism.js, tones.js, scanner.js).
import './prism.css';

import { COPY } from './copyPrism.js';
import { STEPS as STORY_STEPS } from './stepsPrism.js';
import { person as standing, speaker } from './characters.js';
import { keepPart } from './record.js';
import { reader } from './reader.js';
import { bigIdea } from './magazine.js';
import { A_NOTE, STEPS, PITCH, part } from '../math/tones.js';
import {
  BOARD, css, triangle, HALL, crystalCorners, aimAngle, toCrystal, startAngle, lightPath,
  STRIP, STRIP_BOX, repeats, signal, samplesPath, TUNER, onTuner, SPECTRUM, GLYPH, barX, barHeight, barAt, stepsAt, pureTone, allBack,
  NOTE_LED, neon, ROWS, MRI, BODY_PARTS, partOf, partAt, partWave, partLink, dataTitle, RIPPLES, coarseRows, chordSamples, unmix, rowOrder, FIRST_ROW,
  rowIn, toSignal, BRAIN, SKULL, EXPLORE, exploreHead, exploreData, labels, BREAK, figureBox,
  PATTERN, patternBox, picToPattern, patternRowBand, patternBars, patternLight, patternSpectrum, slideShift, captionAt, REVEAL, MAP, mapKnown, mapUnknown, revealToHub,
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
// review: ?step=<id> stops at that step; ?from=<id> fast-forwards to it (no waiting, every interaction done for you), then plays on
const QUERY = new URLSearchParams(location.search);
const STOP = QUERY.get('step');
const FROM = QUERY.get('from');
let FAST = [STOP, FROM].some((id) => id && STORY_STEPS.some((s) => s.id === id));
if (FAST) document.documentElement.classList.add('instant');
const reached = [];
/** A named step (stepsPrism.js). Fast-forwarding, it stops here for good if this is ?step, or hands over to you if this is ?from. */
async function step(id) {
  if (id) reached.push(id);
  if (!FAST) return;
  if (id === STOP) {
    await new Promise((r) => setTimeout(r, 80));
    document.documentElement.dataset.stopped = id;
    await new Promise(() => {});
  }
  if (id === FROM) { FAST = false; document.documentElement.classList.remove('instant'); }
}
const wait = (ms) => (FAST ? Promise.resolve() : new Promise((r) => setTimeout(r, REDUCED ? Math.min(ms, 1200) : ms)));
const pause = (ms) => (FAST ? Promise.resolve() : new Promise((r) => setTimeout(r, ms)));
const later = (fn) => (FAST ? fn() : requestAnimationFrame(fn));
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
let tapped = 0;
let painted = 0;
const ROWS_OF_YOU = coarseRows();                           // how bright each pixel of your patient's head is, row by row

// ── sound (only after a tap) ─────────────────────────────────────────────────────────────────────
let ctx = null;
function audio() {
  if (FAST) return null;
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
const story = reader(root, { fast: () => FAST });            // Next and Back, under the level (reader.js)
root.append(story.el);
const board = svg('svg', { viewBox: `0 0 ${BOARD.w} ${BOARD.h}`, class: 'prism-board', role: 'img' });
const describe = (text) => board.setAttribute('aria-label', text);
figure.append(board);
const led = (id, n, x2, y2) => svg('linearGradient', { id, x1: '0', y1: '0', x2, y2 },
  ...Array.from({ length: n }, (_, i) => svg('stop', { offset: `${(100 * i) / (n - 1)}%`, 'stop-color': neon(i, n) })));
board.append(svg('defs', {}, led('p3-led', 7, '1', '1'),
  svg('clipPath', { id: 'p3-repeat' }, svg('rect', { x: STRIP.x, y: STRIP.y - 12, width: repeats()[0].w, height: STRIP.h + 24 })),
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
const REPEAT_W = repeats()[0].w;
const repeatBands = svg('g', { class: 'repeats' },          // the signal's repeats: one shape, again and again (shown after "Can you see them?")
  ...repeats().map((r, k) => svg('rect', { class: `repeat${k % 2 ? ' odd' : ''}`, x: r.x.toFixed(1), y: STRIP.y - 6, width: r.w.toFixed(1), height: STRIP.h + 12, rx: 6 })),
  ...repeats().slice(1).map((r) => svg('line', { class: 'repeat-edge', x1: r.x.toFixed(1), x2: r.x.toFixed(1), y1: STRIP.y - 4, y2: STRIP.y + STRIP.h + 4 })));
const ghost = svg('g', { class: 'ghost-move' }, svg('g', { 'clip-path': 'url(#p3-repeat)' }, svg('path', { class: 'ghost', d: signal(A_NOTE) })));
const signalInner = svg('g', { class: 'signal-inner' }, signalPath);
const partWaves = svg('g', { class: 'part-waves' });       // later: each body part's own signal, in the data box
const strip = svg('g', { class: 'strip small', style: `transform: ${css(onTuner())}` }, stripBox, repeatBands, signalInner, ghost, partWaves, ...parts);
const arrive = svg('g', { class: 'arrive' }, tuner, strip);

// taking the A note apart: four glowing bars
const glyph = svg('g', { class: 'scene glyph' }, svg('polygon', { class: 'glyph-glass', points: pts(triangle(GLYPH)) }));
const bars = A_NOTE.map((_, k) => svg('rect', { class: 'bar', fill: NOTE_LED[k], x: barX(k) - SPECTRUM.barW / 2, width: SPECTRUM.barW, rx: 6 }));
const barLabels = A_NOTE.map((_, k) => svg('text', { class: 'bar-label', x: barX(k), y: SPECTRUM.base + 26, 'text-anchor': 'middle', fill: NOTE_LED[k], text: COPY.notes[k] }));
const fourBars = svg('g', { class: 'four-bars' }, ...bars, ...barLabels);
const spectrum = svg('g', { class: 'spectrum' }, svg('line', { class: 'baseline', x1: SPECTRUM.x - 20, x2: SPECTRUM.x + SPECTRUM.w + 20, y1: SPECTRUM.base, y2: SPECTRUM.base }), fourBars);

// the scanner: your patient's head as its body parts → their data (the strip, moved) → pixel data → an MRI picture
const H = MRI.head;
const P = MRI.picture;
const cellSize = H.size / ROWS;
const partGroups = BODY_PARTS.map((b, k) => svg('g', { class: 'part-map', fill: b.color, tabindex: '-1', role: 'button', 'aria-label': COPY.bodyParts[k] }));
ROWS_OF_YOU.forEach((row, j) => row.forEach((v, i) => {
  const k = partOf(v);
  if (k >= 0) partGroups[k].append(svg('rect', { x: (H.x + i * cellSize).toFixed(2), y: (H.y + j * cellSize).toFixed(2), width: (cellSize + 0.3).toFixed(2), height: (cellSize + 0.3).toFixed(2) }));
}));
const headBand = svg('rect', { class: 'scene band', x: H.x - 2, y: H.y, width: H.size + 4, height: (H.size / ROWS + 1).toFixed(2), rx: 1.5 });
const map = svg('g', { class: 'mri-part body-map' },
  svg('rect', { class: 'p-box', x: H.x - 4, y: H.y - 4, width: H.size + 8, height: H.size + 8, rx: 10 }), ...partGroups, headBand);
map.style.transform = css(exploreHead());                  // big while you tap its parts; it moves aside when the data is collected
const LABELS = labels(ROWS_OF_YOU);
const labelTexts = [];
const labelGroup = svg('g', { class: 'mri-part part-labels' }, ...LABELS.map((l) => {
  const t = svg('text', { class: 'part-name', x: l.label.x, y: (l.label.y + 6).toFixed(1), 'text-anchor': 'end', fill: BODY_PARTS[l.k].color, text: COPY.bodyParts[l.k] });
  labelTexts[l.k] = t;
  return svg('g', {}, line({ x: l.label.x + 6, y: l.label.y }, l.anchor, { class: 'leader', stroke: BODY_PARTS[l.k].color }), svg('circle', { class: 'anchor', cx: l.anchor.x.toFixed(1), cy: l.anchor.y.toFixed(1), r: 3.5, fill: BODY_PARTS[l.k].color }), t);
}));
const mGlyph = svg('g', { class: 'scene glyph' }, svg('polygon', { class: 'glyph-glass', points: pts(triangle(MRI.glyph)) }));
const mArrows = MRI.arrows.map((a) => svg('g', { class: 'mri-part p-arrow m-arrow' },
  line({ x: a.x1, y: a.y }, { x: a.x2 - 6, y: a.y }, {}), svg('polygon', { points: pts([{ x: a.x2, y: a.y }, { x: a.x2 - 12, y: a.y - 7 }, { x: a.x2 - 12, y: a.y + 7 }]) })));
const pixelSize = P.size / ROWS;
const cells = ROWS_OF_YOU.map((r, j) => r.map((_, i) => svg('rect', { class: 'cell', x: (P.x + i * pixelSize).toFixed(2), y: (P.y + j * pixelSize).toFixed(2), width: (pixelSize + 0.3).toFixed(2), height: (pixelSize + 0.3).toFixed(2) })));
const image = svg('g', { class: 'mri-image' }, svg('rect', { class: 'pic-bg', x: P.x - 4, y: P.y - 4, width: P.size + 8, height: P.size + 8, rx: 8 }), ...cells.flat());
const tapFx = svg('g', { class: 'tap-fx' });                // where you tap: the signal coming out of that spot and on to the data box
const dataName = svg('text', { class: 'data-name', x: dataTitle().x, y: dataTitle().y, 'text-anchor': 'middle' });
const scan = svg('g', { class: 'scene scan exploring' }, map, labelGroup, tapFx, dataName, mArrows[0], mGlyph, mArrows[1], image);

// the break: the hall's lights back on; you by the stage, the radiologist walking over
const person = (who, cx, look) => standing(who, figureBox(cx), look);
const youFigure = person('you', BREAK.you, { x: 400, y: 40 });
const radiologistFigure = svg('g', { class: 'walker', style: `transform: translateX(${BREAK.walkFrom}px)` }, person('radiologist', BREAK.radiologist, { x: -300, y: 40 }));
const CHB = HALL.chandelier;
const breakScene = svg('g', { class: 'scene break-scene' },
  svg('line', { class: 'floor', x1: 0, x2: BOARD.w, y1: HALL.floor, y2: HALL.floor }),
  svg('line', { class: 'chain', x1: CHB.cx, y1: 0, x2: CHB.cx, y2: CHB.armY }),
  svg('path', { class: 'arm', d: `M ${CHB.cx - CHB.arm} ${CHB.armY} Q ${CHB.cx} ${CHB.armY + 18} ${CHB.cx + CHB.arm} ${CHB.armY}` }),
  ...[-1, -0.5, 0.5, 1].map((f) => svg('circle', { class: 'bulb lit-bulb', cx: CHB.cx + f * CHB.arm, cy: CHB.armY - 9 + (1 - Math.abs(f)) * 9, r: 6 })),
  svg('line', { class: 'string', x1: CHB.cx, y1: CHB.armY + 9, x2: cTop.x, y2: cTop.y }),
  svg('polygon', { class: 'glass', points: pts([cTop, cRight, cLeft]) }),
  youFigure, radiologistFigure);

// the pattern: the scanner's row is your patient's picture, moved down, and its marked row's proton frequencies; the
// violin and the light join them above
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
    arrowOf(0), svg('text', { class: 'p-caption', x: captionAt(0).x, y: captionAt(0).y, 'text-anchor': 'middle', text: COPY.pattern[0] })),
  svg('g', { class: 'p-row' },
    line(lightRow.beam.from, lightRow.beam.to, { class: 'p-beam' }),
    svg('polygon', { class: 'glass', points: pts(lightRow.corners) }),
    ...lightRow.rays.map((r) => line(r.from, r.to, { class: 'p-ray', stroke: r.color })),
    arrowOf(1), svg('text', { class: 'p-caption', x: captionAt(1).x, y: captionAt(1).y, 'text-anchor': 'middle', text: COPY.pattern[1] })),
  svg('g', { class: 'p-row' },
    (() => { const r = patternRowBand(); return svg('rect', { class: 'p-row-band', x: r.x.toFixed(2), y: r.y.toFixed(2), width: r.w.toFixed(2), height: Math.max(1.5, r.h).toFixed(2), rx: 0.8 }); })(),
    ...patternSpectrum(ROWS_OF_YOU).filter((b) => b.h > 0).map((b) => svg('rect', { class: 'p-freq', x: b.x.toFixed(2), y: b.y.toFixed(2), width: b.w.toFixed(2), height: b.h.toFixed(2), rx: 1, fill: b.color })),
    arrowOf(2),
    svg('text', { class: 'p-caption', x: captionAt(2).x, y: captionAt(2).y, 'text-anchor': 'middle', text: COPY.pattern[2] })),
];
const pattern = svg('g', { class: 'scene pattern', style: `--slide-caption: ${PATTERN.slideCaption}px` }, ...patternRows);
const captions = patternRows.map((r) => r.querySelector('.p-caption'));
/** A caption never runs off the board: if it is wider than PATTERN.captionMax at its size, it is set a little smaller. */
function fitCaptions() {
  for (const t of captions) {
    t.style.fontSize = '';
    const w = t.getComputedTextLength();
    if (w > PATTERN.captionMax) t.style.fontSize = `${((parseFloat(getComputedStyle(t).fontSize) * PATTERN.captionMax) / w).toFixed(1)}px`;
  }
}
const revealTitle = svg('text', { class: 'scene reveal-title', x: REVEAL.x, y: REVEAL.y, 'text-anchor': 'middle', fill: 'url(#p3-led)', text: COPY.revealTitle });

// the finale: a map of transformations (math: MAP). The Fourier transform at the hub, the three things it already
// takes apart lit around it, and "?" everywhere else, spreading out past the edges: just the surface. Then the name.
const mapLayer = svg('g', { class: 'scene map' },
  ...mapKnown().map((p) => line(MAP.hub, p, { class: 'map-link' })),
  svg('circle', { class: 'map-hub', cx: MAP.hub.x, cy: MAP.hub.y, r: MAP.hub.r }),
  ...mapKnown().map((p, k) => svg('g', { class: 'map-leaf', style: `transition-delay: ${200 + k * 260}ms` },
    svg('circle', { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: MAP.leafR }),
    svg('text', { class: 'map-label', x: (p.x - MAP.leafR - 8).toFixed(1), y: (p.y + 5).toFixed(1), 'text-anchor': 'end', text: COPY.mapKnown[k] }))),
  ...mapUnknown().map((n) => svg('g', { class: 'map-q', style: `--o: ${n.opacity.toFixed(2)}; transition-delay: ${Math.round(n.d * 3)}ms` },
    svg('circle', { cx: n.x.toFixed(1), cy: n.y.toFixed(1), r: n.r.toFixed(1) }),
    ...(n.mark ? [svg('text', { x: n.x.toFixed(1), y: (n.y + n.r * 0.42).toFixed(1), 'text-anchor': 'middle', 'font-size': (n.r * 1.2).toFixed(1), text: COPY.mapUnknown })] : []))),
  svg('text', { class: 'map-title', x: MAP.title.x, y: MAP.title.y, 'text-anchor': 'middle', text: COPY.energeo.name }),
  svg('text', { class: 'map-sub', x: MAP.title.x, y: MAP.sub.y, 'text-anchor': 'middle', text: COPY.energeo.field }));

board.append(bg, hall, breakScene, scan, arrive, glyph, spectrum, pattern, mapLayer, revealTitle);

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
  if (FAST) { running = null; signalPath.setAttribute('d', signal(amounts)); return; }
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
const LINK_MS = 450;                                        // the signal's trip from the spot you tapped to the data box
const DRAW_MS = 1200;                                       // … and the time its wave takes to arrive, drawn from the left
let drawing = null;
/** One body part: lit on the head and named; its signal comes out of the spot you tapped (`at`, on the board), travels to the data box and is drawn there as it arrives. */
function pickPart(k, at = LABELS.find((l) => l.k === k).anchor) {
  const color = BODY_PARTS[k].color;
  partGroups.forEach((g, i) => g.classList.toggle('picked', i === k));
  map.classList.add('choosing');
  labelTexts.forEach((t, i) => t.classList.toggle('picked', i === k));
  const link = partLink(at);
  tapFx.replaceChildren(
    svg('path', { class: 'link', d: link.d, stroke: color, pathLength: 1 }),
    ...RIPPLES.map((r) => svg('circle', { class: 'ripple', cx: at.x.toFixed(1), cy: at.y.toFixed(1), r: r.r, stroke: color, style: `animation-delay: ${r.delay}ms` })),
    svg('circle', { class: 'spot', cx: at.x.toFixed(1), cy: at.y.toFixed(1), r: 5, fill: color }));
  dataName.textContent = COPY.bodyParts[k];
  dataName.setAttribute('fill', color);
  dataName.classList.add('on');
  stripBox.style.stroke = color;
  let wave = partWaves.querySelector(`[data-k="${k}"]`);
  if (!wave) { wave = svg('path', { class: 'part-wave', 'data-k': k, stroke: color }); partWaves.append(wave); }
  partWaves.querySelectorAll('.part-wave').forEach((w) => w.classList.toggle('picked', w === wave));
  partWaves.append(wave);                                   // the newest signal on top
  const me = (drawing = {});
  if (REDUCED || FAST) wave.setAttribute('d', partWave(k));
  else {
    wave.setAttribute('d', partWave(k, 200, 0));
    const t0 = performance.now();
    const frame = (now) => {
      const u = drawing === me ? (now - t0 - LINK_MS) / DRAW_MS : 1;
      wave.setAttribute('d', partWave(k, 200, u));
      if (u < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
function paintRow(j, amounts, sweep) {
  cells[j].forEach((c, i) => {
    c.setAttribute('fill', grey(amounts[i]));
    c.style.transitionDelay = sweep && !REDUCED ? `${i * 8}ms` : '0ms';
    c.classList.add('lit');
  });
}
const showRow = (j) => { headBand.style.transform = `translateY(${(rowIn(H, j).y - H.y).toFixed(2)}px)`; };
/** Nadia's description, one part at a time: show(step) adds the part that moment makes happen, and greys the parts before it. */
function sentence() {
  const spans = COPY.mri.map((f) => el('span', { class: 'frag', text: f.text }));
  const p = el('p', { class: 'line mri-sentence' }, ...spans);
  prompt.append(p);
  later(() => p.classList.add('in'));
  return (step) => COPY.mri.forEach((f, i) => {
    if (f.step === step) spans[i].classList.add('shown');
    else if (f.step < step) spans[i].classList.add('past');
  });
}
/** Taps on your (big) head's body parts call onTap(k); so do taps on their names, and Enter on a part. Returns a function that stops listening. */
function tapParts(onTap) {
  board.classList.add('tapping');
  const f = exploreHead();
  const pd = (e) => {
    const q = boardPoint(e);
    const k = partAt({ x: (q.x - f.tx) / f.sx, y: (q.y - f.ty) / f.sy }, ROWS_OF_YOU);
    if (k >= 0) { onTap(k, { x: q.x, y: q.y }); return; }  // the signal comes out of the very spot you tapped
    const byName = LABELS.find((l) => q.x < l.label.x + 8 && q.x > l.label.x - 110 && Math.abs(q.y - l.label.y) < 16)?.k ?? -1;
    if (byName >= 0) onTap(byName);
  };
  const keys = partGroups.map((g, k) => { const f = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(k); } }; g.setAttribute('tabindex', '0'); g.addEventListener('keydown', f); return f; });
  board.addEventListener('pointerdown', pd);
  followFocus(partGroups[0]);
  return () => {
    board.classList.remove('tapping');
    board.removeEventListener('pointerdown', pd);
    partGroups.forEach((g, k) => { g.setAttribute('tabindex', '-1'); g.removeEventListener('keydown', keys[k]); });
  };
}

// ── the prompt: lines fade in, and fade out together before the next part (the comic's recorder keeps the part:
// record.js) ───────────────────────────────────────────────────────────────────────────────────────────────────
const say = (text, cls = '') => {
  const p = el('p', { class: `line ${cls}`.trim(), text });
  prompt.append(p);
  later(() => p.classList.add('in'));
  return p;
};
/** A character's line: a bubble beside their face (characters.js). */
const speak = speaker(prompt, later);
const put = (n) => { prompt.append(n); later(() => n.classList.add('in')); return n; };   // a magazine box (magazine.js)
async function clear() {
  const old = [...prompt.children];
  if (!old.length) return;
  old.forEach((n) => n.classList.add('leaving'));
  await pause(REDUCED ? 0 : 280);
  keepPart([figure], prompt);
}
let keyboardUser = false;
addEventListener('keydown', (e) => { if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') keyboardUser = true; }, true);
addEventListener('pointerdown', () => { keyboardUser = false; }, true);
const followFocus = (t) => { if (keyboardUser) t.focus({ preventScroll: true }); };
const ask = (options, id) => new Promise((resolve) => {
  const row = el('div', { class: 'choices' });
  const buttons = options.map((o) => {
    const b = el('button', { type: 'button', class: 'choice', text: o });
    b.addEventListener('click', () => { buttons.forEach((x) => { x.disabled = true; }); b.classList.add('picked'); resolve(o); });
    return b;
  });
  row.append(...buttons);
  prompt.append(row);
  later(() => row.classList.add('in'));
  followFocus(buttons[0]);
  if (FAST) step(id).then(() => { if (FAST) buttons[0].click(); });
});
const press = (text, id) => new Promise((resolve) => {
  const b = el('button', { type: 'button', class: 'action', text });
  b.addEventListener('click', () => { b.remove(); resolve(); }, { once: true });
  controls.replaceChildren(b);
  later(() => b.classList.add('in'));
  followFocus(b);
  if (FAST) step(id).then(() => { if (FAST) b.click(); });
});
const boardPoint = (e) => { const p = board.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(board.getScreenCTM().inverse()); };

// ── the story ────────────────────────────────────────────────────────────────────────────────────
async function theHall() {                                  // back at the concert hall: the lights dim
  describe('A concert hall: a chandelier with a piece of glass hanging from it, and a stage light on the floor.');
  later(() => figure.classList.add('in'));
  say(COPY.opening, 'lead');                                 // the lines of one part follow each other, and stay
  await story.beat();
  phase = 'hall';
  board.classList.add('night');
  say(COPY.dim);
  await wait(900);
  aim(startAngle());
  hall.classList.add('lit');
  describe('The hall is dark. The stage light shines a white beam across to the wall, below the chandelier.');
  await story.beat();
  await step('hall');
  phase = 'aim';
  say(COPY.aim);
  const aiming = aimTheLight();
  await step('aim');
  if (FAST) aiming.auto();                                   // fast-forwarding: straight at the chandelier
  await aiming.done;
  await step('rainbow');
  theColors();
}

/** The learner swings the light onto the chandelier. Returns { done, auto }: auto() aims it there at once. */
function aimTheLight() {
  const hint = setTimeout(() => { if (phase === 'aim') say(COPY.aimHint, 'hint'); }, 8000);
  board.classList.add('aiming');
  lamp.setAttribute('tabindex', '0');
  followFocus(lamp);
  let auto = () => {};
  const done = new Promise((resolve) => {
    let down = false;
    let finished = false;
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
    auto = () => { aim(toCrystal()); finish(); };
    async function finish() {
      if (finished) return;
      finished = true;
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
  return { done, auto };
}

async function theColors() {                                // where did the colours come from? and a sound?
  phase = 'colors';
  await clear();
  say(COPY.where.question);
  await ask(COPY.where.choices, 'colors');
  say(COPY.where.after);
  await story.beat();
  speak(COPY.you.think, 'you', true);
  await story.beat();
  say(COPY.surprise, 'lead');
  await story.beat();
  await step('thought');
  theTuner();
}

async function theTuner() {                                 // the hall rises away; your violin and its tuner rise in
  phase = 'tuner';
  hall.classList.add('leaving');
  arrive.classList.add('up');
  await wait(1100);
  hall.style.visibility = 'hidden';
  describe('A tuner clipped to the scroll of your violin. Its screen is blank.');
  await press(COPY.play, 'tuner');
  await clear();
  runSignal(A_NOTE);                                         // the signal appears on the tuner's screen as you play
  await play(A_NOTE, 1.8);
  tuner.classList.add('in-tune');
  describe("On the tuner's screen, your note drawn as a bumpy line, with the letter A under it and a green light.");
  say(COPY.drawsSignal);
  await story.next();
  await step('signal');
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
  const seen = await ask(COPY.see.choices, 'hidden');
  still(A_NOTE);                                             // the bumps are one shape, again and again: a copy of one repeat
  jump(ghost, 'translateX(0px)');                            // lights up, then slides onto the next one, and fits exactly
  strip.classList.add('repeating');
  describe('The signal holds still. Faint bands mark each repeat of its shape; a glowing copy of the first repeat slides onto the second and fits it exactly.');
  await wait(700);
  ghost.style.transform = `translateX(${REPEAT_W.toFixed(1)}px)`;
  await wait(1000);
  say(seen === COPY.see.choices[0] ? COPY.see.yes : COPY.see.notReally);
  await story.beat();
  theSplit();
}

async function theSplit() {                                 // taking it apart: four notes, four bars
  phase = 'split';
  await press(COPY.apart, 'apart');
  strip.classList.remove('repeating');
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
  await story.beat();
  await step('bars');
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
  say(COPY.pure);
  describe('Drag the bars up and down. The signal above changes with them.');
  const hint = setTimeout(() => { if (phase === 'pure') say(COPY.pureHint, 'hint'); }, 9000);
  await new Promise((resolve) => {
    const changed = async () => {
      if (phase === 'pure' && pureTone(mine)) {
        clearTimeout(hint);
        phase = 'back';
        await clear();
        say(COPY.pureDone, 'lead');
        if (FAST) say(COPY.back);
        else setTimeout(() => say(COPY.back), REDUCED ? 0 : 1600);
      } else if (phase === 'back' && allBack(mine)) {
        stop();
        resolve();
      }
    };
    const stop = dragBars(changed);
    if (FAST) (async () => {                                 // fast-forward: a tuning fork, then the others back
      const set = async (v) => { mine = v; drawBars(); still(mine); await changed(); };
      await set([3, 0, 0, 0]);
      await step('fork');
      if (FAST) await set([3, 1, 1, 1]);
    })();
  });
  await clear();
  say(COPY.backDone, 'lead');
  await play(mine, 1.4);
  await story.next();
  await step('back');
  theRadiologist();
}

async function theRadiologist() {                           // at the break: the radiologist walks over
  phase = 'break';
  await clear();
  fourBars.classList.remove('on');
  on(spectrum, false);
  strip.classList.add('hidden');                             // the violin's signal steps away; its box will come back as the data box
  await wait(500);
  running = null;
  signalPath.setAttribute('d', '');
  jump(strip, css(exploreData()));
  strip.classList.add('scanner-data');                     // the scanner's data (its own name: Level 2's styles are on the same page)
  on(breakScene);
  describe('The break: the hall lights are on. You stand by the stage. The radiologist who read your scan, in a white coat, walks over to you.');
  say(COPY.arrives);
  await wait(60);
  radiologistFigure.style.transform = 'none';
  await story.beat(1600);                                    // he walks over
  await step('break');
  speak(COPY.you.tookApart, 'you');
  await story.beat();
  speak(COPY.radiologist.same);
  await story.next();
  await step('talk');
  theBrain();
}

async function theBrain() {                                 // the people step away; your patient's head comes back up, big and labelled
  phase = 'parts';
  await clear();
  on(breakScene, false);
  await wait(600);
  on(scan);
  strip.classList.remove('hidden');
  describe('Your patient’s head, big, as its body parts in different colours, each labelled: skin, skull, fluid, outer brain, inner brain. To the right, an empty data box.');
  await wait(700);
  const hint = (ks) => partGroups.forEach((g, i) => { g.classList.toggle('hint', ks.includes(i)); labelTexts[i].classList.toggle('hint', ks.includes(i)); });
  const seen = new Set();
  let wanted = null;
  const waitFor = (ks) => new Promise((r) => { if (ks.some((k) => seen.has(k))) r(); else wanted = { ks, r }; });
  const onTap = (k, at) => {
    pickPart(k, at);
    seen.add(k);
    tapped = seen.size;
    describe(`Your patient’s ${COPY.bodyParts[k]} is lit. Its signal comes out of the spot you tapped and travels to the data box, where its wave is drawn, named ${COPY.bodyParts[k]}.`);
    if (wanted && wanted.ks.includes(k)) { const r = wanted.r; wanted = null; r(); }
  };
  const stop = tapParts(onTap);
  say(COPY.tapBrain);                                       // the brain first …
  hint(BRAIN);
  await step('brain');
  if (FAST) onTap(BRAIN[1]);
  await waitFor(BRAIN);
  await pause(900);
  say(COPY.tapSkull);                                       // … then the skull
  hint([SKULL]);
  await step('skull');
  if (FAST) onTap(SKULL);
  await waitFor([SKULL]);
  hint([]);
  await pause(1100);
  await clear();
  const show = sentence();                                   // Nadia's description, one part at a time
  show(0);
  await story.beat();
  await press(COPY.collect, 'behaves');
  stop();
  phase = 'collect';                                         // collecting that data: the head moves aside, the picture's place appears
  map.classList.remove('choosing');
  scan.classList.remove('exploring');
  map.style.transform = 'none';
  strip.style.transform = css(toSignal());
  partWaves.classList.add('gone');
  tapFx.replaceChildren();
  dataName.classList.remove('on');
  stripBox.style.stroke = '';
  await wait(900);
  jump(strip, css(toSignal()));                              // settle the data box in place, freshly drawn, whatever the browser did with the move
  strip.classList.remove('hidden');
  mArrows[0].classList.add('lit');
  jump(headBand, `translateY(${(rowIn(H, FIRST_ROW).y - H.y).toFixed(2)}px)`);
  on(headBand);
  signalPath.setAttribute('d', samplesPath(chordSamples(ROWS_OF_YOU[FIRST_ROW]), STRIP));
  show(1);
  describe('All the body parts at once: one busy signal in the data box, from the marked row of your patient’s head. To the right, an empty picture.');
  await wait(900);
  partWaves.replaceChildren();
  partWaves.classList.remove('gone');
  phase = 'convert';
  await press(COPY.convert, 'collect');                      // converting it into pixel data, with the Fourier transform
  show(2);
  on(mGlyph);
  mArrows[1].classList.add('lit');
  headBand.style.transitionDuration = REDUCED ? '0ms' : '40ms';
  for (const j of rowOrder(ROWS)) {
    showRow(j);
    const samples = chordSamples(ROWS_OF_YOU[j]);
    signalPath.setAttribute('d', samplesPath(samples, STRIP));
    paintRow(j, unmix(samples, ROWS), j === FIRST_ROW);
    painted++;
    await pause(REDUCED ? 0 : j === FIRST_ROW ? 500 : 45);
  }
  headBand.style.transitionDuration = '';                     // back to the middle row: its data stays on show
  showRow(FIRST_ROW);
  signalPath.setAttribute('d', samplesPath(chordSamples(ROWS_OF_YOU[FIRST_ROW]), STRIP));
  on(mGlyph, false);
  mArrows.forEach((a) => a.classList.remove('lit'));
  show(3);
  describe('Row by row, the pixels have made an MRI picture of your patient’s head.');
  await story.next();
  await step('picture');
  thePattern();
}

async function thePattern() {                               // do you notice a pattern? one slide at a time
  phase = 'pattern';
  await clear();
  speak(COPY.radiologist.pattern.question);
  await ask(COPY.radiologist.pattern.choices, 'pattern');
  speak(COPY.radiologist.pattern.after);
  scan.classList.add('to-pattern');                          // the head and the arrows give way
  strip.classList.add('hidden');
  image.classList.add('hidden');
  await wait(700);
  pattern.classList.add('sliding');
  on(pattern);
  fitCaptions();
  const SLIDES = ['slide1', 'slide2', 'slide3'];              // named steps, one per slide
  const shown = ['A violin note’s wave, then its four bars of pure tones.', 'A white beam into a prism, then a fan of colours.', 'The MRI picture of your patient’s head, its middle row marked, then that row’s proton frequencies as a row of thin coloured bars.'];
  for (let i = 0; i < 3; i++) {
    phase = SLIDES[i];
    if (i) { patternRows[i - 1].classList.remove('on'); await wait(500); }   // the last slide fades out before the next comes in
    jump(patternRows[i], `translateY(${slideShift(i)}px)`);
    if (i === 2) {                                           // your patient's picture, as the third slide
      jump(image, css(picToPattern(slideShift(2))));
      image.classList.remove('hidden');
    }
    patternRows.forEach((r, n) => r.classList.toggle('on', n === i));
    describe(`${shown[i]} Under them: ${COPY.pattern[i]}.`);
    await wait(700);
    await step(SLIDES[i]);
    await story.next();                                      // the one Next: under the level
  }
  phase = 'together';                                        // all three, each caption under its own pictures
  pattern.classList.remove('sliding');
  fitCaptions();
  patternRows.forEach((r) => { r.classList.add('on'); r.style.transform = 'none'; });
  image.style.transform = css(picToPattern());
  describe(`Three rows, each with its caption: ${COPY.pattern.join('; ')}.`);
  await wait(1200);
  await step('together');
  await pause(3600);
  theReveal();
}

async function theReveal() {                                // the grand reveal: the tool, by name
  phase = 'reveal';
  await clear();
  [pattern, strip, image].forEach((n) => n.classList.add('dim'));
  on(revealTitle);
  say(COPY.reveal, 'final');
  describe('The three rows dim. In the middle, glowing: the Fourier transform.');
  await story.beat(1400);
  await step('reveal');
  say(COPY.name);
  await story.beat();
  say(COPY.fourier);
  await story.next();
  theSurface();
}

async function theSurface() {                               // a whole into its hidden parts is possible; a few ways found; the rest endless
  phase = 'surface';
  await clear();
  [pattern, strip, image].forEach((n) => n.classList.add('gone'));
  const h = revealToHub();                                   // the title shrinks into the hub of a map
  revealTitle.classList.add('to-hub');
  revealTitle.style.transform = `translate(${h.dx}px, ${h.dy}px) scale(${h.s})`;
  on(mapLayer);
  describe('The rows fade. The glowing title shrinks into the hub of a map, labelled the Fourier transform.');
  put(bigIdea(COPY.bigIdea));                                // the big idea
  await story.beat(1400);
  mapLayer.classList.add('known');                           // what it already takes apart: sound, light, an MRI scan
  describe('Around the hub, three lit nodes: sound, light and MRI.');
  say(COPY.few);
  await story.beat(1800);
  mapLayer.classList.add('endless');                         // everywhere else, "?": spreading out past the edges
  describe('Beyond them, the board fills with question marks, smaller and fainter the further out they go, past its edges.');
  say(COPY.surface, 'lead');
  await step('surface');
  await story.next();
  theEnergeo();
}

async function theEnergeo() {                               // the name over the map: ENERGEO, a new science
  phase = 'energeo';
  await clear();
  mapLayer.classList.add('named');
  describe('At the top of the map: ENERGEO, and under it, energy geometry.');
  say(COPY.energeo.lines[0], 'lead');
  await story.beat(1400);
  say(COPY.energeo.lines[1]);
  await story.beat(1200);
  say(COPY.energeo.lines[2]);
  await story.beat(1600);
  phase = 'final';
  say(COPY.final, 'final');
  root.dispatchEvent(new CustomEvent('level-finished', { bubbles: true }));
  await step('energeo');
}

// read-only view for automated checks (no learner-facing effect)
window.__prism = {
  get phase() { return phase; }, get mine() { return [...mine]; }, get hit() { return hitNow; }, get tapped() { return tapped; }, get reached() { return [...reached]; },
  partPoint: (k) => { const j = ROWS_OF_YOU.findIndex((r) => r.some((v) => partOf(v) === k)); const i = ROWS_OF_YOU[j].findIndex((v) => partOf(v) === k); const f = exploreHead(); return { x: f.tx + f.sx * (H.x + (i + 0.5) * cellSize), y: f.ty + f.sy * (H.y + (j + 0.5) * cellSize) }; }, get painted() { return painted; },
  point: (x, y) => { const m = board.getScreenCTM(); return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }; },
};

theHall();
