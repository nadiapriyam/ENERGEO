// Level 2, "Inside a note", at try/level-2/ (docs/level2_spec.md, Revision 2). Guards:
// - the tuning forks are pure tones at 1…4 times the pitch, drawn shorter the higher they sing;
// - one fork alone can never match the violin;
// - DIFFERENCE is a whole-wave measure (Parseval), exactly 0 only when every fork matches;
// - the forks can be tuned one at a time, and the match takes seven strikes;
// - the violin's parts add up to the violin;
// - the layout fits;
// - the copy is verbatim from the spec list and in order, the take-home last, and Fourier not named;
// - the frame: sound only after a tap, Level 1's white style, reduced motion.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  FORKS, STEPS, PITCH, TUNING_FORK, VIOLIN, sinTurns, wave, peak, part, leftover, strength, differencePercent, meanSquareGap, bestWithOneFork,
  BOARD, PANEL, STAGE, lane, wavePath, forkHeight,
} from '../src/math/tones.js';
import { COPY } from '../src/levels/copy2.js';
import { LEVELS } from '../src/levels/copyLevels.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const spec = read('docs/level2_spec.md');
const rev2 = spec.slice(0, spec.indexOf('## Revision 1'));
const copyList = rev2.slice(rev2.indexOf('### Level 2 learner copy'), rev2.indexOf('### The physics'));
const main = read('src/levels/level2.js');
const css = read('src/levels/level2.css') + read('src/levels/base.css');
const mixes = (n, seed = 5) => {
  let s = seed;
  const r = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  return Array.from({ length: n }, () => Array.from({ length: FORKS }, () => Math.floor(r() * (STEPS + 1))));
};

test('1. four tuning forks: pure tones at 1…4 times the pitch, struck 0…3, each shorter the higher it sings', () => {
  assert.equal(FORKS, 4);
  assert.equal(STEPS, 3);
  assert.equal(PITCH, 440);
  for (let k = 0; k < FORKS; k++) {
    const one = Array.from({ length: FORKS }, (_, i) => (i === k ? STEPS : 0));
    for (const x of [0.05, 0.13, 0.37, 0.61]) assert.ok(Math.abs(wave(one, x) - Math.sin(2 * Math.PI * (k + 1) * x)) < 1e-12, `fork ${k + 1} is a pure tone`);
    if (k) assert.ok(Math.abs(forkHeight(k) / forkHeight(0) - 1 / Math.sqrt(k + 1)) < 1e-12, 'prong length ∝ 1/√pitch');
  }
  assert.deepEqual(TUNING_FORK, [3, 0, 0, 0], 'the tuning fork is one pure tone');
  assert.deepEqual(VIOLIN, [3, 2, 1, 1]);
  assert.ok(VIOLIN.every((a, k) => k === 0 || a <= VIOLIN[k - 1]), "the violin's tones fall off, as a bowed string's do");
  assert.equal(TUNING_FORK[0], VIOLIN[0], 'same note: the same first tone');
  assert.equal(sinTurns(0.5), 0);
});

test('2. one fork alone can never match the violin: struck 1, 2, 3 it reads 67%, 47%, 40%', () => {
  assert.deepEqual([0, 1, 2, 3].map((v) => differencePercent(VIOLIN, [v, 0, 0, 0])), [100, 67, 47, 40]);
  assert.equal(bestWithOneFork(), 40);
  for (let k = 0; k < FORKS; k++) for (let v = 0; v <= STEPS; v++) {
    assert.ok(differencePercent(VIOLIN, part([0, 0, 0, 0].map((_, i) => (i === k ? v : 0)), k)) >= 40, 'no single fork does it');
  }
});

test('3. DIFFERENCE is a whole-wave measure: the mean squared gap equals ½ Σ (a_k − b_k)² / 9 (Parseval), exactly 0 only when every fork matches', () => {
  const all = [];
  for (let n = 0; n < (STEPS + 1) ** FORKS; n++) all.push(Array.from({ length: FORKS }, (_, k) => Math.floor(n / (STEPS + 1) ** k) % (STEPS + 1)));
  assert.equal(all.length, 256);
  for (const b of all) {
    const d = differencePercent(VIOLIN, b);
    assert.ok(Number.isInteger(d));
    assert.equal(d === 0, String(b) === String(VIOLIN), 'exactly 0 only for the violin\'s own mix');
    if (d !== 0) assert.ok(d >= 1, 'a 0 is never produced by rounding');
  }
  for (const b of mixes(20)) assert.ok(Math.abs(meanSquareGap(VIOLIN, b) - leftover(VIOLIN, b) / (2 * STEPS * STEPS)) < 1e-9);
  assert.equal(strength(VIOLIN), 15);
  assert.equal(differencePercent(VIOLIN, [0, 0, 0, 0]), 100, 'nothing struck: 100%');
});

test('4. each fork can be tuned on its own, and the match takes seven strikes', () => {
  for (const start of mixes(12, 9)) for (let k = 0; k < FORKS; k++) {
    const without = start.map((a, i) => (i === k ? 0 : a));
    for (let v = 0; v <= STEPS; v++) {
      const b = start.map((a, i) => (i === k ? v : a));
      assert.equal(leftover(VIOLIN, b) - leftover(VIOLIN, without), (VIOLIN[k] - v) ** 2 - VIOLIN[k] ** 2, 'fork k only changes its own part');
    }
  }
  assert.equal(VIOLIN.reduce((s, a) => s + a, 0), 7, 'from silence, seven strikes');
  assert.match(main, /\(a \+ 1\) % \(STEPS \+ 1\)/, 'a strike: one harder, and after 3 the fork falls silent');
});

test("5. the violin's four parts add up to the violin", () => {
  for (const x of [0.03, 0.21, 0.4, 0.77, 1.33]) {
    const sum = VIOLIN.reduce((s, _, k) => s + wave(part(VIOLIN, k), x), 0);
    assert.ok(Math.abs(sum - wave(VIOLIN, x)) < 1e-12);
  }
  assert.equal(VIOLIN.filter((a) => a > 0).length, 4, 'four tones hide in the note');
});

test('6. the layout fits: every wave inside its lane, the DIFFERENCE above the stage, the lanes inside the stage', () => {
  const ys = (d) => d.slice(1).split('L').map((pt) => +pt.split(' ')[1]);
  for (const n of [1, 2, 4]) for (let i = 0; i < n; i++) {
    const ln = lane(i, n);
    assert.ok(ln.top >= STAGE.y - 1e-9 && ln.top + ln.h <= STAGE.y + STAGE.h + 1e-9);
    const mixesHere = n === 4 ? [part(VIOLIN, i)] : [VIOLIN, TUNING_FORK, ...mixes(10, 3)];
    for (const m of mixesHere) {
      const lim = peak(m) <= peak(VIOLIN) + 1e-9 ? 0 : 1;   // a mix louder than the violin may overflow its lane
      if (!lim) for (const y of ys(wavePath(m, ln))) assert.ok(y > ln.top && y < ln.top + ln.h, `lane ${i}/${n}`);
    }
  }
  assert.ok(PANEL.y >= 0 && PANEL.y + PANEL.h < STAGE.y && STAGE.y + STAGE.h <= BOARD.h);
});

test('7. the copy is verbatim from the Revision 2 list and in its order; the take-home is last; the page shows it in that order', () => {
  const ordered = [COPY.opening, COPY.hearFork, `${COPY.labels.fork}, ${COPY.labels.violin}`, COPY.hearViolin, COPY.why.question, ...COPY.why.choices, COPY.why.after,
    COPY.task1, `${COPY.labels.violin}, ${COPY.labels.mine}`, COPY.differenceLabel, COPY.playViolin, COPY.playMine, COPY.strikeHint,
    COPY.oneFork.question, ...COPY.oneFork.choices, COPY.oneFork.after, COPY.task2, COPY.reached, COPY.inside.question, ...COPY.inside.choices,
    COPY.inside.after, COPY.takeaway, COPY.final];
  let at = 0;
  for (const line of ordered) {
    const i = copyList.indexOf(line, at);
    assert.ok(i >= 0, `not in the Revision 2 list, in order: ${line}`);
    at = i;
  }
  assert.ok(copyList.includes(`19. ${COPY.final}\n\nNothing comes after line 19.`) && !/^20\. /m.test(copyList), 'the final line is last');
  for (const s of Object.values(LEVELS)) assert.ok(rev2.includes(s), `around the levels: ${s}`);
  for (const line of ordered) assert.ok(line.split(/(?<=[.?!:])\s+(?=[A-Z])/).length <= 2, `at most two sentences: ${line}`);
  assert.ok(ordered.filter((l) => /[.?!]$/.test(l)).length <= 14, 'a short level');
  assert.ok(!/fourier|frequenc|harmonic|spectrum/i.test(JSON.stringify(COPY)), 'nothing named yet: no Fourier');
  const calls = ['COPY.opening', 'COPY.hearFork', 'COPY.hearViolin', 'COPY.why.question', 'COPY.why.after', 'COPY.playViolin', 'COPY.playMine', 'COPY.task1',
    'COPY.strikeHint', 'COPY.oneFork.question', 'COPY.oneFork.after', 'COPY.task2', 'COPY.reached', 'COPY.inside.question', 'COPY.inside.after',
    'COPY.takeaway', 'COPY.final'];
  const pos = calls.map((c) => main.indexOf(c, main.indexOf('// ── the story')));
  assert.ok(pos.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => pos[k] < 0)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|press\(|ask\(/.test(tail.replace("say(COPY.final, 'final');", '')), 'nothing is shown after the final line');
  for (const line of [COPY.opening, COPY.task1, COPY.takeaway, COPY.final]) assert.ok(!main.includes(line), `copy belongs in copy2.js: ${line}`);
});

test("8. the frame: sound only after a tap, Level 1's white style, a page of its own, reduced motion", () => {
  assert.equal((main.match(/new AC\(\)/g) ?? []).length, 1, 'one place makes the audio context');
  assert.ok(main.indexOf('await press(COPY.hearFork)') < main.indexOf('ring(0, STEPS'), 'the first sound waits for a tap');
  assert.match(main, /createPeriodicWave\(real, imag, \{ disableNormalization: true \}\)/, 'a held note is exactly the sum of its tones');
  assert.ok(!/recording|real violin/i.test(JSON.stringify(COPY)), 'the copy never calls the note a recording');
  assert.match(read('src/levels/base.css'), /--bg: #ffffff;/, "Level 1's white page");
  assert.ok(!/prefers-color-scheme: dark|linear-gradient|caveat|night/i.test(css), 'no dark stage, no notebook');
  assert.ok(!existsSync(new URL('../src/levels/notebook.css', import.meta.url)) && !/caveat/.test(read('package.json')), 'the notebook is gone');
  assert.match(read('try/level-2/index.html'), /src\/levels\/page2\.js/);
  assert.match(read('vite.config.js'), /try\/level-2\/index\.html/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
