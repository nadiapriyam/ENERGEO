// Level 3, "The magic glasses", at try/ (docs/levels_spec.md, Level 3 Revision 2). Guards:
// - the tuner's little signal is the big signal, laid exactly on its screen;
// - the glasses' bars are exactly the A note's tones, and one bar is a pure tone;
// - dragging a bar sets that bar alone;
// - the machine's unmixing is an exact Fourier transform of each row;
// - the transitions are exact fits: tuner → strip, strip → machine input, bars → machine window;
// - the prism's rays stand where the bars will;
// - the colours are LEDs;
// - the copy is verbatim and in order, with no "squiggle" and Fourier named once at the end;
// - the frame: sound after a tap, reduced motion, Level 3 after Level 2, and the app's own Fourier math untouched.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BOARD, fit, STRIP, STRIP_BOX, signal, samplesPath, TUNER, onTuner, PRISM, prismCorners, prismRays, neon, NOTE_LED,
  SPECTRUM, SPECTRUM_BOX, barX, barHeight, barAt, stepsAt, pureTone, allBack, MACHINE, stripToInput, spectrumToWindow,
  chordSamples, unmix, pictureRows, rowOrder,
} from '../src/math/glasses.js';
import { A_NOTE, STEPS, part, wave } from '../src/math/tones.js';
import * as appFourier from '../src/math/fourier.js';
import { COPY } from '../src/levels/copyGlasses.js';
import { LEVELS } from '../src/levels/copyLevels.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const spec = read('docs/levels_spec.md');
const level3 = spec.slice(spec.indexOf('## Level 3, "The magic glasses"'));
const rev2 = level3.slice(level3.indexOf('### Revision 2'));
const copyList = rev2.slice(rev2.indexOf('#### Level 3 learner copy (Revision 2)'), rev2.indexOf('#### What the new lines claim'));
const main = read('src/levels/glasses.js');
const css = read('src/levels/glasses.css');
const inside = (r, x, y, e = 1e-6) => x >= r.x - e && x <= r.x + r.w + e && y >= r.y - e && y <= r.y + r.h + e;
const ys = (d) => d.slice(1).split('L').map((pt) => +pt.split(' ')[1]);
const apply = (f, p) => ({ x: f.tx + p.x * f.sx, y: f.ty + p.y * f.sy });
const same = (a, b) => Math.abs(a - b) < 1e-9;

test("1. the tuner: its little signal is the big signal laid exactly on its screen; the letter and the light sit clear of it", () => {
  const f = onTuner();
  const a = apply(f, { x: STRIP.x, y: STRIP.y });
  const b = apply(f, { x: STRIP.x + STRIP.w, y: STRIP.y + STRIP.h });
  const s = TUNER.signalArea;
  assert.ok(same(a.x, s.x) && same(a.y, s.y) && same(b.x, s.x + s.w) && same(b.y, s.y + s.h), 'the strip maps onto the signal area');
  const sc = TUNER.screen;
  assert.ok(inside(sc, s.x, s.y) && inside(sc, s.x + s.w, s.y + s.h), 'the signal is on the screen');
  assert.ok(inside(sc, TUNER.letter.x, TUNER.letter.y) && TUNER.letter.y > s.y + s.h + 12, 'the letter is under the signal');
  const bd = TUNER.body;
  assert.ok(inside(bd, sc.x, sc.y) && inside(bd, sc.x + sc.w, sc.y + sc.h) && inside(bd, TUNER.light.cx, TUNER.light.cy) && TUNER.light.cy > sc.y + sc.h);
  assert.ok(TUNER.clip.y <= TUNER.scroll.cy + TUNER.scroll.r && TUNER.clip.y + TUNER.clip.h >= bd.y, 'clipped to the scroll, holding the tuner');
});

test("2. the glasses' bars are exactly the A note's tones, and the signal is exactly the bars added up; one bar is a pure tone", () => {
  A_NOTE.forEach((a) => assert.equal(barHeight(a), a * SPECTRUM.unit));
  const whole = ys(signal(A_NOTE));
  const parts = A_NOTE.map((_, k) => ys(signal(part(A_NOTE, k))));
  const mid = STRIP.y + STRIP.h / 2;
  whole.forEach((y, i) => assert.ok(Math.abs((y - mid) - parts.reduce((s, p) => s + (p[i] - mid), 0)) < 0.25, 'every bump comes from a bar'));
  for (const y of whole) assert.ok(y > STRIP.y && y < STRIP.y + STRIP.h);
  assert.ok(pureTone([3, 0, 0, 0]) && pureTone([0, 0, 2, 0]) && !pureTone(A_NOTE) && !pureTone([0, 0, 0, 0]));
  assert.ok(allBack(A_NOTE) && allBack([1, 1, 1, 1]) && !allBack([3, 1, 0, 1]));
  for (const x of [0.07, 0.31, 0.62]) assert.ok(Math.abs(wave([3, 0, 0, 0], x) - Math.sin(2 * Math.PI * x)) < 1e-12, 'one bar: a smooth wave, a tuning fork');
});

test('3. dragging: each bar answers only over itself, and its height follows the pointer in whole steps', () => {
  for (let k = 0; k < SPECTRUM.slots; k++) {
    assert.equal(barAt(barX(k)), k);
    assert.equal(barAt(barX(k) - SPECTRUM.barW / 2 + 1), k);
    assert.equal(barAt(barX(k) + SPECTRUM.barW / 2 - 1), k);
  }
  assert.equal(barAt(-100), 0);
  assert.equal(barAt(10000), SPECTRUM.slots - 1);
  for (let v = 0; v <= STEPS; v++) assert.equal(stepsAt(SPECTRUM.base - barHeight(v)), v);
  assert.equal(stepsAt(SPECTRUM.base + 40), 0);
  assert.equal(stepsAt(0), STEPS);
  for (let k = 1; k < SPECTRUM.slots; k++) assert.ok(barX(k) - barX(k - 1) > SPECTRUM.barW + 8, 'bars apart');
});

test('4. the machine: unmixing each signal gives back exactly that row of the picture; rows print from the middle out', () => {
  const rows = pictureRows();
  const n = rows.length;
  for (const row of rows) {
    const samples = chordSamples(row);
    assert.ok(samples.length > 2 * n);
    unmix(samples, n).forEach((a, i) => assert.ok(Math.abs(a - row[i]) < 1e-9));
  }
  const order = rowOrder(n);
  assert.deepEqual([...order].sort((a, b) => a - b), Array.from({ length: n }, (_, i) => i), 'every row, once');
  assert.equal(order[0], Math.floor(n / 2), 'the first turn prints the middle of the head');
  assert.ok(Math.abs(order[1] - order[0]) === 1 && Math.abs(order[2] - order[0]) === 1);
  for (const y of ys(samplesPath(chordSamples(rows[order[0]]), STRIP))) assert.ok(y >= STRIP.y && y <= STRIP.y + STRIP.h);
});

test('5. the transitions are exact fits: the strip shrinks onto the machine input, the bars onto its window; the machine fits the board', () => {
  for (const [f, from, to] of [[stripToInput(), STRIP_BOX, MACHINE.input], [spectrumToWindow(), SPECTRUM_BOX, MACHINE.window], [fit({ x: 1, y: 2, w: 3, h: 4 }, { x: 10, y: 20, w: 6, h: 2 }), { x: 1, y: 2, w: 3, h: 4 }, { x: 10, y: 20, w: 6, h: 2 }]]) {
    const a = apply(f, { x: from.x, y: from.y });
    const b = apply(f, { x: from.x + from.w, y: from.y + from.h });
    assert.ok(same(a.x, to.x) && same(a.y, to.y) && same(b.x, to.x + to.w) && same(b.y, to.y + to.h));
  }
  const B = { x: 0, y: 0, w: BOARD.w, h: BOARD.h };
  const M = MACHINE;
  const pic = { x: M.picture.x, y: M.picture.y, w: M.picture.size, h: M.picture.size };
  for (const r of [STRIP_BOX, SPECTRUM_BOX, M.input, M.box, pic]) assert.ok(inside(B, r.x, r.y) && inside(B, r.x + r.w, r.y + r.h));
  assert.ok(inside(M.box, M.window.x, M.window.y) && inside(M.box, M.window.x + M.window.w, M.window.y + M.window.h), 'the window is in the machine');
  assert.ok(M.input.x + M.input.w < M.box.x && M.box.x + M.box.w < pic.x, 'signal, machine, picture: left to right');
  const reach = M.crank.r + 8;
  assert.ok(M.crank.cx + reach < pic.x && M.crank.cx - reach > M.input.x + M.input.w && M.crank.cy - reach > 0, 'the crank is clear');
  for (let k = 0; k < SPECTRUM.slots; k++) assert.ok(inside(SPECTRUM_BOX, barX(k), SPECTRUM.base - barHeight(STEPS)) && inside(SPECTRUM_BOX, barX(k), SPECTRUM.base + 30), 'the bars and their names move with the box');
  assert.ok(STRIP_BOX.y + STRIP_BOX.h < SPECTRUM.base - barHeight(STEPS), 'the tallest bar stays under the signal');
});

test('6. the prism: white light enters its left face, the colours leave its right face and stand where the bars will; LED colours', () => {
  const [top, right, left] = prismCorners();
  assert.ok(top.y < right.y && same(right.y, left.y) && same(right.x - left.x, PRISM.size), 'an upright prism');
  const { beam, rays } = prismRays();
  assert.ok(same(beam.to.x, (top.x + left.x) / 2) && same(beam.to.y, (top.y + left.y) / 2), 'the beam meets the left face');
  for (const r of rays) {
    assert.ok(same(r.from.x, (top.x + right.x) / 2) && same(r.from.y, (top.y + right.y) / 2), 'each ray leaves the right face');
    assert.ok(r.to.x <= BOARD.w && r.to.y >= STRIP_BOX.y + STRIP_BOX.h && r.to.y <= BOARD.h, 'below the signal, on the board');
  }
  assert.equal(rays.length, PRISM.rays);
  assert.ok(PRISM.raysTop <= SPECTRUM.base - barHeight(STEPS) && PRISM.raysBottom >= SPECTRUM.base, 'the rays fill the space the bars will stand in');
  assert.match(neon(0, 7), /^hsl\(320, 100%, 60%\)$/, 'from magenta');
  assert.match(neon(6, 7), /^hsl\(28, 100%, 60%\)$/, 'to orange');
  for (let i = 0; i < 48; i++) assert.match(neon(i, 48), /^hsl\(\d+, 100%, 60%\)$/, 'vibrant: full saturation');
  assert.equal(new Set(rays.map((r) => r.color)).size, rays.length);
  assert.equal(NOTE_LED.length, 4);
});

test('7. the copy is verbatim from the Revision 2 list and in order: no "squiggle", no sarcasm, Fourier named once at the end; the page shows it in that order', () => {
  const ordered = [...COPY.opening, COPY.play, `${COPY.tunerLetter} (the letter`, COPY.drawsSignal, COPY.namesOne, COPY.knowBetter, COPY.see.question, ...COPY.see.choices,
    COPY.see.after, ...COPY.prism, COPY.ifOnly, COPY.thereIs, COPY.putOn, COPY.split, COPY.notes.join(', '), COPY.howMuch, COPY.toggle, `[${COPY.takeOff}] / [${COPY.putBack}]`,
    COPY.twoWays, COPY.pure, COPY.pureHint, COPY.pureDone, COPY.back, COPY.backDone, COPY.scanner, COPY.look, COPY.manyBars, COPY.machine, COPY.crank, COPY.eachTurn,
    COPY.takesOver, COPY.pictureOut, ...COPY.name, COPY.final];
  let at = 0;
  for (const line of ordered) {
    const i = copyList.indexOf(line, at);
    assert.ok(i >= 0, `not in the Revision 2 list, in order: ${line}`);
    at = i;
  }
  assert.ok(copyList.includes(`36. ${COPY.final}\n\nNothing comes after line 36.`) && !/^37\. /m.test(copyList), 'the final line is last');
  const all = JSON.stringify(COPY);
  assert.ok(!/squiggle|very helpful|terrible|nobody's watching|could take a while/i.test(all), 'signal, not squiggle; the sarcasm is gone');
  assert.match(COPY.opening[0], /After your scan/, 'the story picks up from Level 2');
  assert.ok(COPY.prism.join(' ').includes('prism') && ordered.indexOf(COPY.prism[0]) < ordered.indexOf(COPY.putOn), 'the prism comes before the glasses');
  for (const line of ordered) assert.ok(line.split(/(?<=[.?!…])\s+(?=[A-Z])/).length <= 2, `at most two sentences: ${line}`);
  const lines = ordered.filter((l) => !/^\[/.test(l));
  const first = lines.findIndex((l) => /Fourier/.test(l));
  assert.ok(lines[first] === COPY.name[0] && first >= lines.length - 3, "Fourier's name, once, at the end");
  assert.ok(!/frequenc|spectrum|coefficient|sine|cosine|energy|equation|integral/i.test(all), 'no jargon');
  assert.ok(level3.includes('Here is the mathematical tool that lets us start seeing it.'), "Nadia's goal sentence");
  for (const s of [LEVELS.level3, LEVELS.next3]) assert.ok(spec.includes(s));
  const calls = ['COPY.opening[0]', 'COPY.opening[1]', 'COPY.play', 'COPY.drawsSignal', 'COPY.namesOne', 'COPY.knowBetter', 'COPY.see.question', 'COPY.see.after',
    'COPY.prism[0]', 'COPY.prism[1]', 'COPY.ifOnly', 'COPY.thereIs', 'COPY.putOn', 'COPY.split', 'COPY.howMuch', 'COPY.toggle', 'COPY.takeOff', 'COPY.twoWays', 'COPY.pure',
    'COPY.pureHint', 'COPY.pureDone', 'COPY.back', 'COPY.backDone', 'COPY.scanner', 'COPY.look', 'COPY.manyBars', 'COPY.machine', 'COPY.crank', 'COPY.eachTurn',
    'COPY.takesOver', 'COPY.pictureOut', 'COPY.name[0]', 'COPY.name[1]', 'COPY.final'];
  const pos = calls.map((c) => main.indexOf(c, main.indexOf('// ── the story')));
  assert.ok(pos.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => pos[k] < 0)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|ask\(|press\(/.test(tail.replace("say(COPY.final, 'final');", '')), 'nothing is shown after the final line');
});

test("8. the frame: sound after a tap, the dark comes with the glasses, reduced motion, Level 3 after Level 2, and the app's own Fourier math untouched", () => {
  assert.equal((main.match(/new AC\(\)/g) ?? []).length, 1, 'one place makes the audio context');
  const story = main.slice(main.indexOf('// ── the story'));
  assert.ok(story.indexOf('await press(COPY.play)') < story.indexOf('await play(A_NOTE'), 'the first sound waits for a tap');
  assert.match(main, /async function putGlassesOn\(\) \{\n  if \(!REDUCED\)/, 'no flying glasses with reduced motion');
  assert.match(css, /\.night \.bg \{ fill: var\(--night\); \}/, 'the board dims at night');
  assert.ok((main.match(/classList\.(add|toggle)\('night'/g) ?? []).length >= 2 && !/classList\.add\('night'\)/.test(story.slice(0, story.indexOf('async function theGlasses'))), 'and only with the glasses');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.strip \{ transform-box: view-box; transform-origin: 0 0;/, 'the strip moves as one piece');
  assert.match(main, /from '\.\.\/math\/glasses\.js'/);
  assert.match(read('src/levels/page.js'), /chain\('mri-lesson', 'next-level-3', LEVELS\.next3, 'level-3', \(\) => import\('\.\/glasses\.js'\)\)/, 'Level 3 opens when Level 2 ends');
  assert.match(read('try/index.html'), /id="glasses-lesson"/);
  for (const name of ['basisValue', 'basisInner', 'basisGram']) assert.equal(typeof appFourier[name], 'function', `the app's fourier.js still has ${name}`);
});
