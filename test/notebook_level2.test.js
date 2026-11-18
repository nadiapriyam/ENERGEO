// Level 2 of the notebook, "Inside a note" (docs/notebook_spec.md). Guards:
// - the tones are pure waves at 1…6 times the pitch;
// - every recipe agrees with every other at the marked moment, yet can differ everywhere else;
// - DIFFERENCE is a whole-wave measure (Parseval), exactly 0 only when every dial matches, and each dial can be tuned
//   on its own;
// - the unmixing that paints Level 1's picture is a real computation;
// - the layout fits;
// - the learner-facing copy is verbatim from the spec list, in order, with Nadia's lines unchanged, ending with the
//   final line;
// - the notebook frame: sound only after a tap, self-hosted fonts, reduced motion.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  TONES, STEPS, PITCH, VIOLIN, OTHERS, sinTurns, wave, peak, leftover, strength, differencePercent, meanSquareGap, AGREE_AT, active,
  BOARD, SCOPE, PANEL, BRIDGE, toScreen, MARKER_X, stringPath, dialAngle, chordSamples, unmix,
} from '../src/math/tones.js';
import { picture } from '../src/math/scanner.js';
import { COPY } from '../src/notebook/copy2.js';
import { NOTEBOOK } from '../src/notebook/copyNotebook.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const spec = read('docs/notebook_spec.md');
const request = spec.slice(spec.indexOf("## Nadia's request"), spec.indexOf('## What was built'));
const copyList = spec.slice(spec.indexOf('## Level 2 learner copy'), spec.indexOf('## The mathematics'));
const main = read('src/notebook/level2.js');
const shell = read('src/notebook/main.js');
const css = read('src/notebook/level2.css') + read('src/notebook/notebook.css');
const recipes = [VIOLIN, ...OTHERS.map((o) => o.amounts)];
/** A fixed set of pseudo-random recipes (whole clicks 0…10). */
const randomRecipes = (n, seed = 7) => {
  let s = seed;
  const r = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  return Array.from({ length: n }, () => Array.from({ length: TONES }, () => Math.floor(r() * (STEPS + 1))));
};

test('1. six pure tones at 1…6 times the pitch; recipes are whole clicks on each dial', () => {
  assert.equal(TONES, 6);
  assert.equal(PITCH, 440);
  for (const r of recipes) assert.ok(r.length === TONES && r.every((a) => Number.isInteger(a) && a >= 0 && a <= STEPS));
  for (let k = 0; k < TONES; k++) {                          // a recipe with one dial at 10 is exactly tone k+1
    const one = Array.from({ length: TONES }, (_, i) => (i === k ? STEPS : 0));
    for (const x of [0.05, 0.13, 0.37, 0.61]) assert.ok(Math.abs(wave(one, x) - Math.sin(2 * Math.PI * (k + 1) * x)) < 1e-12);
  }
  assert.deepEqual(VIOLIN, [10, 5, 4, 3, 2, 2]);
  assert.ok(VIOLIN.every((a, k) => k === 0 || a <= VIOLIN[k - 1]), "the violin's tones fall off, as a bowed string's do");
  assert.equal(new Set(recipes.map(String)).size, recipes.length, 'every note has its own recipe');
  assert.equal(sinTurns(0.5), 0);
  assert.equal(sinTurns(0.25), 1);
});

test('2. one moment proves nothing: at the marked moment every recipe reads exactly 0, yet recipes still differ', () => {
  for (const r of [...recipes, ...randomRecipes(40)]) {
    assert.equal(wave(r, AGREE_AT), 0, 'exactly 0 at the marked moment');
    assert.equal(wave(r, AGREE_AT / 2), 0);
  }
  const oneTone = [10, 0, 0, 0, 0, 0];
  assert.equal(wave(oneTone, AGREE_AT), wave(VIOLIN, AGREE_AT), 'a single tone agrees with the violin there');
  assert.ok(leftover(VIOLIN, oneTone) > 0 && differencePercent(VIOLIN, oneTone) > 0, 'but not across the whole wave');
  assert.ok(Math.abs(wave(VIOLIN, 0.1) - wave(oneTone, 0.1)) > 0.1, 'they differ at other moments');
  assert.equal(MARKER_X, SCOPE.x + SCOPE.w / 2, 'the marker stands at the middle of the scope');
});

test('3. DIFFERENCE is a whole-wave measure: the mean squared gap equals ½ Σ (a_k − b_k)² / 100 (Parseval), exactly 0 only when the dials match', () => {
  const rs = randomRecipes(30, 11);
  for (const a of [...recipes, ...rs]) for (const b of rs.slice(0, 6)) {
    assert.ok(Math.abs(meanSquareGap(a, b) - leftover(a, b) / (2 * STEPS * STEPS)) < 1e-9, `${a} vs ${b}`);
  }
  assert.equal(differencePercent(VIOLIN, Array(TONES).fill(0)), 100, 'nothing built: 100% missing');
  assert.equal(differencePercent(VIOLIN, VIOLIN), 0);
  assert.equal(strength(VIOLIN), 158);
  for (const b of rs) {
    const d = differencePercent(VIOLIN, b);
    assert.ok(Number.isInteger(d));
    assert.equal(d === 0, String(b) === String(VIOLIN), 'exactly 0 only when every dial matches');
    if (String(b) !== String(VIOLIN)) assert.ok(d >= 1, 'a 0 is never produced by rounding');
  }
  for (let k = 0; k < TONES; k++) {                          // the smallest possible miss still shows
    const near = VIOLIN.map((a, i) => (i === k ? a + (a < STEPS ? 1 : -1) : a));
    assert.ok(differencePercent(VIOLIN, near) >= 1);
  }
});

test('4. each dial can be tuned on its own: fixing one never undoes another, and tuning them in turn brings DIFFERENCE down to 0', () => {
  for (const start of randomRecipes(10, 3)) {
    for (let k = 0; k < TONES; k++) {
      const others = start.map((a, i) => (i === k ? 0 : a));
      for (let v = 0; v <= STEPS; v++) {
        const b = start.map((a, i) => (i === k ? v : a));
        assert.equal(leftover(VIOLIN, b) - leftover(VIOLIN, others), (VIOLIN[k] - v) ** 2 - VIOLIN[k] ** 2, 'dial k only changes its own term');
      }
    }
    let b = [...start];
    let last = differencePercent(VIOLIN, b);
    for (let k = 0; k < TONES; k++) {
      b = b.map((a, i) => (i === k ? VIOLIN[k] : a));
      const now = differencePercent(VIOLIN, b);
      assert.ok(now <= last);
      last = now;
    }
    assert.equal(last, 0);
  }
  assert.deepEqual(VIOLIN.map((_, k) => active(VIOLIN.slice(0, k + 1))), [1, 2, 3, 4, 5, 6]);
});

test('5. the scope, the dials and the strings fit: waves inside the stage, the readout above it, tone k a string of k humps', () => {
  const s = (STEPS * SCOPE.h) / 2;
  for (const r of recipes) {
    for (let i = 0; i <= 100; i++) {
      const p = toScreen(r, i / 100);
      assert.ok(p.x >= SCOPE.x && p.x <= SCOPE.x + SCOPE.w && p.y > SCOPE.y && p.y < SCOPE.y + SCOPE.h, `${r} stays on the stage`);
    }
  }
  assert.ok(peak(VIOLIN) > 1 && s > 0);
  assert.ok(PANEL.y >= 0 && PANEL.y + PANEL.h < SCOPE.y && PANEL.x + PANEL.w <= BOARD.w, 'the readout sits above the stage');
  for (let k = 1; k <= TONES; k++) {
    const ys = stringPath(k, 10).slice(1).split('L').map((pt) => +pt.split(' ')[1] - 18);
    let flips = 0;
    let last = 0;
    for (const y of ys.slice(1, -1)) { const sg = Math.abs(y) < 1e-9 ? 0 : Math.sign(y); if (sg && last && sg !== last) flips++; if (sg) last = sg; }
    assert.equal(flips, k - 1, `tone ${k} vibrates in ${k} humps`);
  }
  assert.equal(dialAngle(0), -135);
  assert.equal(dialAngle(STEPS), 135);
});

test('6. back to Level 1: unmixing each chord recovers every amount exactly, so the picture is painted from the unmixing', () => {
  const cells = picture();
  const n = Math.round(Math.sqrt(cells.length));
  for (const j of [0, 5, Math.floor(n / 2), n - 3]) {
    const row = cells.slice(j * n, (j + 1) * n).map((c) => c.g);
    const samples = chordSamples(row);
    assert.ok(samples.length > 2 * n, 'enough samples to unmix every tone');
    const back = unmix(samples, n);
    back.forEach((a, i) => assert.ok(Math.abs(a - row[i]) < 1e-9, `row ${j}, tone ${i + 1}`));
  }
  const inBoard = (r) => r.x >= 0 && r.y >= 0 && r.x + r.w <= BOARD.w && r.y + r.h <= BOARD.h;
  const pic = { x: BRIDGE.pic.x, y: BRIDGE.pic.y, w: BRIDGE.pic.size, h: BRIDGE.pic.size };
  for (const r of [BRIDGE.chord, BRIDGE.bars, pic]) assert.ok(inBoard(r));
  assert.ok(BRIDGE.chord.x + BRIDGE.chord.w < pic.x && BRIDGE.bars.x + BRIDGE.bars.w < pic.x && BRIDGE.chord.y + BRIDGE.chord.h < BRIDGE.bars.y);
});

test('7. the learner-facing copy is verbatim from the spec list, in its order; Nadia\'s lines unchanged; the page shows it in that order and nothing after the final line', () => {
  const ordered = [COPY.dim, COPY.violin, COPY.listen, `${COPY.legend.violin}, ${COPY.legend.mine}`, COPY.oneThing, COPY.shape, COPY.build, COPY.tones, COPY.howTo,
    `${COPY.tone} 1 … ${COPY.tone} 6, ${COPY.minus} and ${COPY.plus}`, COPY.playViolin, COPY.playMine, COPY.hint, ...COPY.react, COPY.moment,
    `${COPY.readout.violin}, ${COPY.readout.mine}`, COPY.same.question, ...COPY.same.choices, COPY.same.after, COPY.notEnough, COPY.differenceLabel,
    COPY.differenceMeans, COPY.task, ...COPY.reached, COPY.lookCloser, COPY.check2.question, ...COPY.check2.choices, COPY.check2.right, COPY.check2.wrong,
    COPY.answer, COPY.cover.intro, `${COPY.cover.mark} (on each hidden dial)`, COPY.cover.question, ...COPY.cover.choices, COPY.cover.after, COPY.captions[0],
    COPY.cover.again, COPY.cover.look, COPY.captions[1], COPY.reveal, ...COPY.mri, COPY.unmix, ...COPY.mriAfter, ...COPY.name, ...COPY.levels, COPY.final];
  let at = 0;
  for (const line of ordered) {
    const i = copyList.indexOf(line, at);
    assert.ok(i >= 0, `not in the spec list, in order: ${line}`);
    at = i;
  }
  assert.ok(copyList.includes(`47. ${COPY.final}\n\nNothing comes after line 47.`) && !/^48\. /m.test(copyList), 'the final line is last');
  for (const line of [COPY.build, ...COPY.levels]) assert.ok(request.replace(/[“”]/g, '').replace(/theorom/, 'theorom').includes(line.replace(/[“”]/g, '')), `Nadia's wording: ${line}`);
  assert.equal(COPY.check2.intended, 'No');
  for (const line of ordered) assert.ok(line.split(/(?<=[.?!])\s+/).length <= 2, `at most two sentences: ${line}`);
  const calls = ['COPY.dim', 'COPY.violin', 'COPY.listen', 'COPY.oneThing', 'COPY.shape', 'COPY.build', 'COPY.tones', 'COPY.howTo', 'COPY.playViolin', 'COPY.playMine',
    'COPY.hint', 'COPY.react[0]', 'COPY.react[1]', 'COPY.moment', 'COPY.same.question', 'COPY.same.after', 'COPY.notEnough', 'COPY.differenceMeans', 'COPY.task',
    'COPY.reached[0]', 'COPY.reached[1]', 'COPY.lookCloser', 'COPY.check2.question', 'COPY.check2.right', 'COPY.answer', 'COPY.check2.wrong',
    'COPY.cover.intro', 'COPY.cover.question', 'COPY.cover.after', 'COPY.captions[0]', 'COPY.cover.again', 'COPY.cover.look', 'COPY.captions[1]', 'COPY.reveal',
    'COPY.mri[0]', 'COPY.mri[1]', 'COPY.unmix', 'COPY.mriAfter[0]', 'COPY.mriAfter[1]', 'COPY.name[0]', 'COPY.name[1]', 'COPY.name[2]',
    'COPY.levels[0]', 'COPY.levels[1]', 'COPY.final'];
  const pos = calls.map((c) => main.indexOf(c, main.indexOf('// ── the story')));
  assert.ok(pos.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => pos[k] < 0)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|button\(|choices\(|press\(|ask\(/.test(tail.replace("say(COPY.final, 'final');", '')), 'nothing is shown after the final line');
  for (const line of [COPY.build, COPY.notEnough, COPY.reveal, COPY.final, ...COPY.levels, ...COPY.name]) assert.ok(!main.includes(line), `copy belongs in copy2.js: ${line}`);
  for (const s of [NOTEBOOK.title, NOTEBOOK.open, NOTEBOOK.turnPage, ...NOTEBOOK.levels.flatMap((l) => [l.tab, l.title, l.note, l.locked].filter(Boolean))])
    assert.ok(spec.includes(s), `notebook text in the spec: ${s}`);
});

test('8. the frame: sound only after a tap, a locked Level 3, self-hosted fonts, Level 1 then Level 2, reduced motion', () => {
  assert.equal((main.match(/new AC\(\)/g) ?? []).length, 1, 'one place makes the audio context');
  assert.ok(main.indexOf('await press(COPY.listen)') < main.indexOf('await playViolin()'), 'the first sound waits for the Listen tap');
  assert.match(main, /createPeriodicWave\(real, imag, \{ disableNormalization: true \}\)/, 'every note is played as the exact sum of its six tones');
  assert.ok(!/recording|real violin/i.test(JSON.stringify(COPY)), 'the copy never calls the note a recording');
  assert.ok(!/https?:\/\//.test(css + shell), 'no fonts or styles fetched from elsewhere');
  assert.match(shell, /@fontsource\/caveat/);
  assert.match(shell, /'level-1': \(\) => import\('\.\/level1\.js'\), 'level-2': \(\) => import\('\.\/level2\.js'\)/);
  assert.ok(NOTEBOOK.levels[2].locked && !shell.includes("'level-3'"), 'Level 3 is a locked tab, no page');
  assert.ok(!/energy|energeo/i.test(JSON.stringify(COPY) + JSON.stringify(NOTEBOOK)), 'the road to Energy Geometry is not told to the learner yet');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(read('notebook/index.html'), /src\/notebook\/main\.js/);
});
