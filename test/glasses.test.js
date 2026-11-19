// Level 3, "The magic glasses", at try/ (docs/levels_spec.md). Guards:
// - the tuner names one note;
// - the glasses' bars are exactly the A note's tones, and one bar is a pure tone;
// - dragging a bar sets that bar alone;
// - the machine's unmixing is an exact Fourier transform of each row;
// - everything fits the board;
// - the copy is verbatim and in order, gives Fourier's name once at the end, and keeps the jargon out;
// - the frame: sound after a tap, reduced motion, the level chained after Level 2, and the app's own Fourier math
//   untouched.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BOARD, TUNER, needleAngle, tick, STRIP, SPECTRUM, squiggle, barX, barHeight, barAt, stepsAt, pureTone, allBack,
  MACHINE, chordSamples, unmix, pictureRows, rowOrder, rainbow, samplesPath,
} from '../src/math/glasses.js';
import { A_NOTE, STEPS, part, wave } from '../src/math/tones.js';
import * as appFourier from '../src/math/fourier.js';
import { COPY } from '../src/levels/copyGlasses.js';
import { LEVELS } from '../src/levels/copyLevels.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const spec = read('docs/levels_spec.md');
const level3 = spec.slice(spec.indexOf('## Level 3, "The magic glasses"'));
const copyList = level3.slice(level3.indexOf('### Level 3, "The magic glasses": learner copy'), level3.indexOf('### What Level 3 claims'));
const main = read('src/levels/glasses.js');
const css = read('src/levels/glasses.css');
const inside = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
const ys = (d) => d.slice(1).split('L').map((pt) => +pt.split(' ')[1]);

test('1. the tuner: in tune points straight up, the dial spans ±50 cents, and the one letter sits clear of the needle', () => {
  assert.equal(needleAngle(0), 0);
  assert.equal(needleAngle(50), TUNER.meter.span);
  assert.equal(needleAngle(-80), -TUNER.meter.span, 'off the dial, the needle stops at the end');
  const up = tick(0, true);
  assert.ok(Math.abs(up.x1 - TUNER.meter.cx) < 1e-9 && up.y2 < up.y1, 'the centre tick points straight up');
  assert.ok(TUNER.letter.y > TUNER.meter.cy + 20, 'the letter is under the needle, not behind it');
  const s = TUNER.screen;
  assert.ok(inside(s, TUNER.letter.x, TUNER.letter.y) && inside(s, TUNER.meter.cx, TUNER.meter.cy - TUNER.meter.r));
  for (const c of [-50, 50]) { const t = tick(needleAngle(c)); assert.ok(inside(s, t.x2, t.y2), 'the dial stays on the screen'); }
  const b = TUNER.body;
  assert.ok(inside(b, s.x, s.y) && inside(b, s.x + s.w, s.y + s.h) && inside(b, TUNER.light.cx, TUNER.light.cy));
});

test("2. the glasses' bars are exactly the A note's tones, and the squiggle is exactly the bars added up; one bar is a pure tone", () => {
  A_NOTE.forEach((a, k) => assert.equal(barHeight(a), a * SPECTRUM.unit));
  const whole = ys(squiggle(A_NOTE));
  const parts = A_NOTE.map((_, k) => ys(squiggle(part(A_NOTE, k))));
  const mid = STRIP.y + STRIP.h / 2;
  whole.forEach((y, i) => assert.ok(Math.abs((y - mid) - parts.reduce((s, p) => s + (p[i] - mid), 0)) < 0.25, 'every bump comes from a bar'));
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

test("4. the machine: unmixing each squiggle gives back exactly that row of the picture; rows print from the middle out", () => {
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
  assert.match(rainbow(0, 48), /^hsl\(0,/);
  assert.match(rainbow(47, 48), /^hsl\(280,/);
});

test('5. everything fits the board: the strip, the bars and their names, the machine, its crank, the picture', () => {
  const B = { x: 0, y: 0, w: BOARD.w, h: BOARD.h };
  assert.ok(inside(B, STRIP.x - 14, STRIP.y - 10) && inside(B, STRIP.x + STRIP.w + 14, STRIP.y + STRIP.h + 10));
  assert.ok(STRIP.y + STRIP.h + 10 < SPECTRUM.base - barHeight(STEPS), 'the tallest bar stays under the squiggle');
  for (let k = 0; k < SPECTRUM.slots; k++) assert.ok(inside(B, barX(k) - SPECTRUM.barW / 2, SPECTRUM.base + 30) && inside(B, barX(k) + SPECTRUM.barW / 2, SPECTRUM.base - barHeight(STEPS)));
  for (const y of ys(squiggle(A_NOTE))) assert.ok(y > STRIP.y && y < STRIP.y + STRIP.h);
  const M = MACHINE;
  const pic = { x: M.picture.x, y: M.picture.y, w: M.picture.size, h: M.picture.size };
  for (const r of [M.input, M.box, pic]) assert.ok(inside(B, r.x, r.y) && inside(B, r.x + r.w, r.y + r.h));
  assert.ok(inside(M.box, M.window.x, M.window.y) && inside(M.box, M.window.x + M.window.w, M.window.y + M.window.h));
  assert.ok(M.input.x + M.input.w < M.box.x && M.box.x + M.box.w < pic.x, 'squiggle, machine, picture: left to right');
  const reach = M.crank.r + 8;
  assert.ok(M.crank.cx + reach < pic.x && M.crank.cx - reach > M.input.x + M.input.w && M.crank.cy - reach > 0, 'the crank is clear of the picture and the squiggle');
  const p = samplesPath([1, -2, 0.5, 3], M.input);
  for (const y of ys(p)) assert.ok(y >= M.input.y && y <= M.input.y + M.input.h);
});

test("6. the copy is verbatim from the Level 3 list and in order; Fourier's name comes once, at the end; no jargon before it", () => {
  const ordered = [...COPY.recap, COPY.tunerIntro, COPY.play, `${COPY.tunerLetter} (the letter`, COPY.tunerSays, ...COPY.thanks, COPY.squiggle, COPY.see.question,
    ...COPY.see.choices, COPY.see.after, COPY.ifOnly, COPY.putOn, COPY.bars, COPY.notes.join(', '), COPY.prism, COPY.toggle, `[${COPY.takeOff}] / [${COPY.putBack}]`,
    COPY.twoWays, COPY.pure, COPY.pureHint, COPY.pureDone, COPY.back, COPY.backDone, ...COPY.scanner, COPY.glassesOn, COPY.manyBars, COPY.crankIntro, COPY.crank,
    COPY.speedUp, COPY.pictureOut, ...COPY.name, COPY.final];
  let at = 0;
  for (const line of ordered) {
    const i = copyList.indexOf(line, at);
    assert.ok(i >= 0, `not in the Level 3 list, in order: ${line}`);
    at = i;
  }
  assert.ok(copyList.includes(`35. ${COPY.final}\n\nNothing comes after line 35.`) && !/^36\. /m.test(copyList), 'the final line is last');
  for (const line of ordered) assert.ok(line.split(/(?<=[.?!…])\s+(?=[A-Z])/).length <= 2, `at most two sentences: ${line}`);
  const lines = ordered.filter((l) => !/^\[/.test(l));
  const firstFourier = lines.findIndex((l) => /Fourier/.test(l));
  assert.equal(lines[firstFourier], COPY.name[0], 'the name is given in the naming line');
  assert.ok(firstFourier >= lines.length - 3, 'and only at the very end');
  assert.ok(!/frequenc|spectrum|coefficient|sine|cosine|energy|equation|integral/i.test(JSON.stringify(COPY)), 'no jargon');
  assert.match(COPY.final, /mathematical tool that lets us start seeing/, "Nadia's goal sentence");
  assert.ok(level3.includes('Here is the mathematical tool that lets us start seeing it.'));
  for (const s of [LEVELS.level3, LEVELS.next3]) assert.ok(spec.includes(s));
});

test('7. the page shows the copy in that order and nothing after the final line', () => {
  const calls = ['COPY.recap[0]', 'COPY.recap[1]', 'COPY.tunerIntro', 'COPY.play', 'COPY.tunerSays', 'COPY.thanks[0]', 'COPY.thanks[1]', 'COPY.squiggle',
    'COPY.see.question', 'COPY.see.after', 'COPY.ifOnly', 'COPY.putOn', 'COPY.bars', 'COPY.prism', 'COPY.toggle', 'COPY.takeOff', 'COPY.twoWays', 'COPY.pure',
    'COPY.pureHint', 'COPY.pureDone', 'COPY.back', 'COPY.backDone', 'COPY.scanner[0]', 'COPY.scanner[1]', 'COPY.glassesOn', 'COPY.manyBars', 'COPY.crankIntro',
    'COPY.crank', 'COPY.speedUp', 'COPY.pictureOut', 'COPY.name[0]', 'COPY.name[1]', 'COPY.final'];
  const pos = calls.map((c) => main.indexOf(c, main.indexOf('// ── the story')));
  assert.ok(pos.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => pos[k] < 0)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|ask\(|press\(/.test(tail.replace("say(COPY.final, 'final');", '')), 'nothing is shown after the final line');
  for (const line of [COPY.ifOnly, COPY.prism, COPY.name[0], COPY.final]) assert.ok(!main.includes(line), `copy belongs in copyGlasses.js: ${line}`);
});

test("8. the frame: sound after a tap, the glasses respect reduced motion, Level 3 follows Level 2, and the app's own Fourier math is untouched", () => {
  assert.equal((main.match(/new AC\(\)/g) ?? []).length, 1, 'one place makes the audio context');
  const story = main.slice(main.indexOf('// ── the story'));
  assert.ok(story.indexOf('await press(COPY.play)') < story.indexOf('await play(A_NOTE'), 'the first sound waits for a tap');
  assert.match(main, /async function putGlassesOn\(\) \{\n  if \(!REDUCED\)/, 'no flying glasses with reduced motion');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(main, /from '\.\.\/math\/glasses\.js'/);
  const page = read('src/levels/page.js');
  assert.match(page, /chain\('mri-lesson', 'next-level-3', LEVELS\.next3, 'level-3', \(\) => import\('\.\/glasses\.js'\)\)/, 'Level 3 opens when Level 2 ends');
  assert.match(read('try/index.html'), /id="glasses-lesson"/);
  for (const name of ['basisValue', 'basisInner', 'basisGram']) assert.equal(typeof appFourier[name], 'function', `the app's fourier.js still has ${name}`);
});
