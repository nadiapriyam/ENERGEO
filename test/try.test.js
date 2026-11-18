// The one-step prototype at try/ (docs/prototype_try_spec.md). Guards: the needle mathematics (an exact 0 only when every
// piece is paired with its exact opposite; pieces are never removed), the learner-facing copy (verbatim from the spec, in
// the spec's order), and the page frame (no title revealing the concept, light page, one accent).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createState, turn, total, pairs, contributions, angleGap, rad, wrap, SNAP, RELEASE, INITIAL_DEG } from '../src/math/needles.js';
import { COPY } from '../src/prototypes/try/copy.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const spec = read('docs/prototype_try_spec.md');
const main = read('src/prototypes/try/main.js');
const css = read('src/prototypes/try/try.css');
const html = read('try/index.html');

test('1. the starting arrangement: six pieces, none near opposite, a clearly nonzero total', () => {
  const s = createState();
  assert.equal(s.theta.length, 6);
  assert.ok(INITIAL_DEG.length >= 6 && INITIAL_DEG.length <= 8, 'approximately 6–8 pieces');
  for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) assert.ok(angleGap(s.theta[i], s.theta[j] + Math.PI) >= rad(35) - 1e-9, `${i}, ${j}`);
  const t = total(s);
  assert.ok(t.length > 2 && !t.exactZero);
  assert.equal(pairs(s).length, 0);
});

test('2. turning a piece near the opposite of another snaps it exactly opposite; the pair contributes exactly (0, 0)', () => {
  let s = createState();
  s = turn(s, 1, s.theta[0] + Math.PI + rad(8));      // within SNAP
  assert.deepEqual(pairs(s), [[0, 1]]);
  assert.equal(s.theta[1], wrap(s.theta[0] + Math.PI));
  const u = contributions(s);
  assert.equal(u[1][0], -u[0][0]);
  assert.equal(u[1][1], -u[0][1]);
  assert.equal(u[0][0] + u[1][0], 0);
  assert.equal(u[0][1] + u[1][1], 0);
  const far = turn(createState(), 1, createState().theta[0] + Math.PI + SNAP + rad(3));
  assert.equal(pairs(far).length, 0, 'outside the snap window nothing pairs');
});

test('3. a paired piece stays paired within RELEASE and leaves its pair beyond it', () => {
  let s = turn(createState(), 1, createState().theta[0] + Math.PI);
  assert.deepEqual(pairs(turn(s, 1, s.theta[1] + RELEASE - rad(1))), [[0, 1]]);
  const out = turn(s, 1, s.theta[1] + RELEASE + rad(1));
  assert.equal(out.partner[0], null);
  assert.equal(out.partner[1], null);
});

test('4. the total is exactly 0 only when every piece is paired; every piece stays present', () => {
  let s = createState();
  s = turn(s, 1, s.theta[0] + Math.PI);
  s = turn(s, 3, s.theta[2] + Math.PI);
  let t = total(s);
  assert.ok(!t.exactZero && t.length > 0, 'two pairs: not zero yet');
  s = turn(s, 5, s.theta[4] + Math.PI);
  t = total(s);
  assert.equal(t.x, 0);
  assert.equal(t.y, 0);
  assert.equal(t.exactZero, true);
  assert.equal(s.theta.length, 6, 'no piece removed');
  assert.ok(contributions(s).every(([x, y]) => Math.hypot(x, y) > 0.999), 'every piece is still a nonzero contribution');
});

test('5. a near-cancelling arrangement without pairs is never shown as 0', () => {
  const s = createState([0, 120, 240, 10, 130, 250]);   // sums to ≈ 0 in floating point, but no piece is paired
  assert.equal(pairs(s).length, 0);
  const t = total(s);
  assert.ok(t.length < 1e-12);
  assert.equal(t.exactZero, false);
});

test('6. every learner-facing line is verbatim from the spec, in the spec\'s order', () => {
  const flat = [...COPY.step1, COPY.start, COPY.step2, COPY.step3.question, ...COPY.step3.choices, COPY.step3.after, COPY.zero, ...COPY.step4, COPY.lookCloser,
    COPY.step5.question, ...COPY.step5.options, COPY.step5.right, COPY.step5.wrong, ...COPY.step6, ...COPY.step7];
  for (const line of flat) assert.ok(spec.includes(line), `not in the spec: ${line}`);
  const ordered = [COPY.step1[0], COPY.step1[1], COPY.step2, COPY.step3.question, COPY.step3.after, COPY.step4[0], COPY.step4[1], COPY.step5.question,
    COPY.step5.right, COPY.step5.wrong, COPY.step6[0], COPY.step6[1], COPY.step7[0], COPY.step7[1], COPY.step7[2]];
  const at = ordered.map((l) => spec.indexOf(l));
  assert.deepEqual([...at].sort((a, b) => a - b), at, 'spec order');
  assert.ok(COPY.step5.options.includes(COPY.step5.intended));
  assert.equal(COPY.step5.intended, 'The parts can still be there');
});

test('7. the page shows the steps in the spec\'s order and writes no learner-facing text of its own', () => {
  const calls = ['COPY.step1', 'COPY.step2', 'COPY.step3.question', 'COPY.step3.after', 'COPY.step4[0]', 'COPY.step4[1]', 'COPY.lookCloser', 'COPY.step5.question',
    'COPY.step5.right', 'COPY.step5.wrong', 'COPY.step6[0]', 'COPY.step6[1]', 'COPY.step7[0]', 'COPY.step7[1]', 'COPY.step7[2]'];
  const at = calls.map((c) => main.indexOf(c));
  assert.ok(at.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => at[k] < 0)));
  assert.deepEqual([...at].sort((a, b) => a - b), at);
  const flat = [...COPY.step1, COPY.step2, COPY.step3.question, COPY.step3.after, ...COPY.step4, COPY.step5.question, COPY.step5.right, COPY.step5.wrong, ...COPY.step6, ...COPY.step7];
  for (const line of flat) assert.ok(!main.includes(line), `copy belongs in copy.js: ${line}`);
});

test('8. the frame: no title revealing the concept, a light page, one accent, a plain 0', () => {
  const title = html.match(/<title>([^<]*)<\/title>/)[1];
  assert.equal(title, 'Try this');
  assert.ok(!/zero|cancel|\b0\b|nothing/i.test(html), 'the page shell names no concept');
  assert.ok(!/<h1/i.test(html));
  assert.match(css, /--bg: #ffffff;/);
  assert.ok(!/prefers-color-scheme: dark/.test(css), 'no dark theme');
  assert.equal((css.match(/linear-gradient/g) ?? []).length, 1, 'only the soft edge under the pinned figure');
  assert.ok(!/Atkinson/.test(css), 'the project font draws a slashed zero; this page uses a plain 0');
  assert.match(read('vite.config.js'), /try\/index\.html/);
});
