// Interactive 01 at try/ (docs/prototype_try_spec.md, Revision 2). Guards: left/right pieces only (no curve, no compass,
// no rotation); the TOTAL is an exact integer sum that reaches 0 only when every piece is paired; four different balanced
// arrangements behind the same 0; the learner-facing copy verbatim from Revision 2, in its order, ending with the final
// sentence; and the page frame.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { start, pair, dropTarget, tapTarget, totalOf, pairedCount, total, dirOf, layout, pattern, ARRANGEMENTS, PAIRS, ROWS, VIEW, PIECE } from '../src/math/pieces.js';
import { COPY } from '../src/prototypes/try/copy.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const specAll = read('docs/prototype_try_spec.md');
const spec = specAll.slice(0, specAll.indexOf('## Revision 1'));      // Revision 2 governs
const main = read('src/prototypes/try/main.js');
const css = read('src/prototypes/try/try.css');
const html = read('try/index.html');

test('1. the start: six nonzero left/right pieces; the TOTAL points right and is not 0', () => {
  const s = start();
  const all = [...s.row, ...s.waiting];
  assert.equal(all.length, 6);
  assert.ok(all.every((id) => [1, -1].includes(dirOf(id))), 'only → and ←');
  assert.deepEqual(s.row.map(dirOf), [1, 1, 1]);
  assert.deepEqual(s.waiting.map(dirOf), [-1, -1, -1]);
  assert.equal(totalOf(s), 3);
});

test('2. each pairing lowers the TOTAL by one; it is exactly 0 only when every pair is formed, and no piece is removed', () => {
  let s = start();
  const seen = [totalOf(s)];
  for (const [id, p] of [['L0', 1], ['L2', 2], ['L1', 0]]) { s = pair(s, id, p); seen.push(totalOf(s)); }
  assert.deepEqual(seen, [3, 2, 1, 0]);
  assert.ok(Number.isInteger(totalOf(s)) && totalOf(s) === 0, 'an exact integer 0');
  assert.equal(pairedCount(s), 3);
  assert.equal(s.row.length + s.pairedWith.filter(Boolean).length, 6, 'all six pieces still in play');
  assert.equal(pair(s, 'L0', 0), s, 'a taken pair cannot be taken again');
});

test('3. generous snapping and tap pairing', () => {
  const s = start();
  assert.equal(dropTarget(s, PAIRS[1].left.x + 70, ROWS.mat - 40), 1, 'a loose drop near a → pairs with it');
  assert.equal(dropTarget(s, 10, ROWS.top), 0, 'anywhere above the waiting row counts');
  assert.equal(dropTarget(s, PAIRS[1].left.x, ROWS.supply), null, 'a drop back in the waiting row returns the piece');
  const s1 = pair(s, 'L1', 1);
  assert.notEqual(dropTarget(s1, PAIRS[1].left.x, ROWS.mat), 1, 'never onto a taken pair');
  assert.ok([0, 1, 2].includes(tapTarget(s, 'L0')), 'a tap pairs the piece with a free →');
});

test('4. four visibly different arrangements, all nonzero pieces, all with TOTAL exactly 0', () => {
  assert.equal(ARRANGEMENTS.length, 4);
  const pats = ARRANGEMENTS.map((_, k) => pattern(k));
  assert.deepEqual(pats.slice(0, 3), ['←→←→←→', '←←→→←→', '←←←→→→←→']);
  assert.equal(new Set(pats).size, 4, 'each arrangement looks different');
  for (const a of ARRANGEMENTS) {
    const ids = a.rows.flat();
    assert.equal(total(ids), 0, a.name);
    assert.equal(new Set(ids).size, ids.length, `${a.name}: no piece twice`);
  }
  const sizes = ARRANGEMENTS.map((a) => a.rows.flat().length);
  assert.deepEqual(sizes, [6, 6, 8, 12]);
  assert.equal(ARRANGEMENTS[3].rows.length, 2, 'the densest one surrounds the 0, above and below');
  // arrangement 1 is exactly the learner's finished row: ← beside → in each pair
  const finished = layout(0);
  PAIRS.forEach((p, k) => {
    assert.deepEqual(finished[2 * k], { id: `L${k}`, ...p.left });
    assert.deepEqual(finished[2 * k + 1], { id: `R${k}`, ...p.right });
  });
  // pieces keep their direction while they move between arrangements
  for (let k = 1; k < 4; k++) for (const id of ARRANGEMENTS[k - 1].rows.flat()) assert.ok(ARRANGEMENTS[k].rows.flat().includes(id), `${id} stays from ${k} to ${k + 1}`);
});

test('5. positions: inside the board, no overlapping pieces, the 0 between the rows of the densest arrangement', () => {
  for (let k = 0; k < 4; k++) {
    const spots = layout(k);
    for (const { x, y } of spots) assert.ok(x - PIECE.length / 2 >= 0 && x + PIECE.length / 2 <= VIEW.w && y >= 0 && y <= VIEW.h, `${k}: inside`);
    for (let i = 0; i < spots.length; i++) for (let j = i + 1; j < spots.length; j++)
      if (spots[i].y === spots[j].y) assert.ok(Math.abs(spots[i].x - spots[j].x) >= PIECE.length + 4, `${k}: ${spots[i].id} and ${spots[j].id} overlap`);
  }
  const ys = [...new Set(layout(3).map((s) => s.y))].sort((a, b) => a - b);
  assert.ok(ys[0] < ROWS.total && ys[1] > ROWS.total, 'the 0 sits between the two rows');
});

test('6. the learner-facing copy is verbatim from Revision 2 and in its order; the final sentence is last', () => {
  const ordered = [COPY.opening[0], COPY.opening[1], COPY.task, COPY.check1.question, COPY.check1.after, COPY.reached[0], COPY.reached[1],
    COPY.check2.question, COPY.check2.right, COPY.check2.wrong, ...COPY.arrangements, COPY.reveal, COPY.mri[0], COPY.mri[1], COPY.final];
  for (const line of [...ordered, COPY.start, COPY.lookCloser, ...COPY.check1.choices, ...COPY.check2.choices, COPY.totalLabel]) assert.ok(spec.includes(line), `not in Revision 2: ${line}`);
  const flow = spec.slice(spec.indexOf('15. FULL REQUIRED LEARNER FLOW'), spec.indexOf('16. DO NOT ADD'));
  const at = ordered.filter((l) => l !== COPY.check2.wrong && l !== COPY.check2.right).map((l) => flow.indexOf(l));
  assert.ok(at.every((i) => i >= 0));
  assert.deepEqual([...at].sort((a, b) => a - b), at, 'the order of section 15');
  assert.equal(COPY.final, 'To show that a result of 0 can come from nonzero parts cancelling each other, so 0 may contain hidden structure rather than mean “nothing.”');
  assert.equal(COPY.check2.intended, 'No');
  assert.ok(COPY.mri.length === 2 && !/proton|longitudinal|transverse|B0|RF|Larmor|signal/i.test(COPY.mri.join(' ')), 'two MRI sentences, no advanced terms');
  for (const line of ordered) assert.ok(line.split(/(?<=[.?!])\s+/).length <= 2, `at most two sentences: ${line}`);
});

test('7. the page shows the copy in that order, writes none of its own, and nothing follows the final sentence', () => {
  const calls = ['COPY.opening[0]', 'COPY.opening[1]', 'COPY.task', 'COPY.check1.question', 'COPY.check1.after', 'COPY.reached[0]', 'COPY.reached[1]', 'COPY.lookCloser',
    'COPY.check2.question', 'COPY.check2.right', 'COPY.check2.wrong', 'COPY.arrangements[0]', 'COPY.reveal', 'COPY.mri[0]', 'COPY.mri[1]', 'COPY.final'];
  const at = calls.map((c) => main.indexOf(c));
  assert.ok(at.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => at[k] < 0)));
  assert.deepEqual([...at].sort((a, b) => a - b), at);
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|button\(|choices\(/.test(tail.replace("say(COPY.final, 'final');", '')), 'nothing is shown after the final sentence');
  for (const line of [COPY.task, COPY.check1.question, COPY.reveal, COPY.final, ...COPY.mri]) assert.ok(!main.includes(line), `copy belongs in copy.js: ${line}`);
});

test('8. the frame: no curve, no compass, no rotation, no title revealing the concept; light page; reduced motion', () => {
  for (const [name, src] of [['main.js', main], ['try.css', css]]) {
    assert.ok(!/needle|compass|north|south|\barc\b|rotate\(|atan2/i.test(src), `${name}: no curve, compass or rotation`);
  }
  assert.ok(!/ A [\d.]+ [\d.]+ 0 [01] [01] (?!-24 -6)/.test(main), 'the only SVG arc is the rounded end of a piece');
  assert.ok(!existsSync(new URL('../src/math/needles.js', import.meta.url)), 'the needle model is gone');
  assert.equal(html.match(/<title>([^<]*)<\/title>/)[1], 'Try this');
  assert.ok(!/zero|cancel|\b0\b|nothing|<h1/i.test(html), 'the page shell names no concept');
  assert.match(css, /--bg: #ffffff;/);
  assert.ok(!/prefers-color-scheme: dark|linear-gradient|\bred\b|crimson/i.test(css), 'no dark theme, no gradients, no red');
  for (const hex of css.match(/#[0-9a-f]{6}\b/gi) ?? []) {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    assert.ok(!(r - g > 80 && r - b > 80), `no error red: ${hex}`);
  }
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(read('vite.config.js'), /try\/index\.html/);
});
