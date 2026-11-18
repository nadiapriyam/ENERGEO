// Interactive 01 at try/ (docs/prototype_try_spec.md, Revision 3: the MRI story). Guards: ← and → pieces only (no
// curve, no compass, no rotation); the TOTAL is an exact integer sum of the arrows in the drop, drawn as those arrows
// joined, reaching 0 only when every piece is paired; four different balanced arrangements behind the same 0; the
// magnet tips the balance by exactly one flip; the MRI numbers in the copy; the learner-facing copy verbatim from the
// Revision 3 list, in its order, ending with the final line; and the page frame.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  start, pair, dropTarget, tapTarget, totalOf, pairedCount, total, dirOf, layout, pattern, segmentSpots, crowd, crowdDirections, crowdTotal,
  ARRANGEMENTS, PAIRS, ROWS, VIEW, PIECE, PANEL, DROP, DROP_LINE, SEGMENT, CROWD, FIELD_LINES, FLIP,
} from '../src/math/pieces.js';
import {
  excessPerMillion, timesEarth, hydrogenInDrop, molecules, hydrogenSpot, picture, scanPixel, PHYS,
  HOUSING, BORE, PATIENT, SLIDE, ZOOM, SCREEN,
} from '../src/math/scanner.js';
import { COPY } from '../src/prototypes/try/copy.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const specAll = read('docs/prototype_try_spec.md');
const rev3 = specAll.slice(0, specAll.indexOf('## Revision 2 ('));
const rev2 = specAll.slice(specAll.indexOf('## Revision 2 ('), specAll.indexOf('## Revision 1'));
const copyList = rev3.slice(rev3.indexOf('### Learner copy'), rev3.indexOf('### The physics'));
const main = read('src/prototypes/try/main.js');
const css = read('src/prototypes/try/try.css');
const html = read('try/index.html');
const inside = (r, { x, y }) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

test('1. the story pieces: six hydrogen atoms become six ← → arrows; three → in the drop, three ← outside; TOTAL 3', () => {
  const hs = molecules().flatMap((m) => m.h);
  assert.equal(hs.length, 6);
  const s = start();
  assert.deepEqual(hs.map((h) => h.id).sort(), [...s.row, ...s.waiting].sort(), 'each hydrogen atom carries one of the six arrows');
  assert.ok(hs.every((h) => [1, -1].includes(dirOf(h.id))), 'only → and ←');
  for (let i = 0; i < hs.length; i++) for (let j = i + 1; j < hs.length; j++)
    assert.ok(Math.abs(hs[i].x - hs[j].x) >= PIECE.length + 4 || Math.abs(hs[i].y - hs[j].y) >= PIECE.height + 4, `${hs[i].id} and ${hs[j].id} overlap`);
  for (const h of hs) assert.ok(h.x - PIECE.length / 2 >= 0 && h.x + PIECE.length / 2 <= VIEW.w, `${h.id} on the board`);
  assert.deepEqual(hydrogenSpot('R0'), hs.find((h) => h.id === 'R0'));
  assert.deepEqual(s.row.map(dirOf), [1, 1, 1]);
  assert.deepEqual(s.waiting.map(dirOf), [-1, -1, -1]);
  assert.equal(totalOf(s), 3);
  for (const id of s.row) assert.ok(inside(DROP, PAIRS[+id.slice(1)].right), `${id} starts inside the drop`);
  assert.ok(ROWS.supply - PIECE.height / 2 > DROP.y + DROP.h, 'the waiting ← arrows sit outside the drop');
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
  // the TOTAL is drawn as that many small arrows joined tip to tail, centred in its panel
  for (const v of [3, 2, 1]) {
    const spots = segmentSpots(v);
    assert.equal(spots.length, v);
    for (let i = 1; i < v; i++) assert.equal(spots[i].x - spots[i - 1].x, SEGMENT.pitch);
    assert.ok(Math.abs((spots[0].x + spots[v - 1].x) / 2 - PANEL.cx) < 1e-9);
    for (const sp of spots) assert.ok(inside(PANEL, { x: sp.x - 21, y: sp.y }) && inside(PANEL, { x: sp.x + 21, y: sp.y }));
  }
  assert.deepEqual(segmentSpots(0), []);
  assert.ok(SEGMENT.pitch <= PIECE.length * SEGMENT.scale, 'the small arrows touch: one joined arrow');
});

test('3. generous snapping and tap pairing, into the drop only', () => {
  const s = start();
  assert.equal(dropTarget(s, PAIRS[1].left.x + 70, ROWS.mat - 40), 1, 'a loose drop near a → pairs with it');
  assert.equal(dropTarget(s, 10, PANEL.y + 10), 0, 'anywhere above the waiting row counts');
  assert.equal(dropTarget(s, PAIRS[1].left.x, ROWS.supply), null, 'a drop back in the waiting row returns the piece');
  assert.ok(DROP_LINE > ROWS.mat && DROP_LINE < ROWS.supply);
  const s1 = pair(s, 'L1', 1);
  assert.notEqual(dropTarget(s1, PAIRS[1].left.x, ROWS.mat), 1, 'never onto a taken pair');
  assert.ok([0, 1, 2].includes(tapTarget(s, 'L0')), 'a tap pairs the piece with a free →');
  for (const p of PAIRS) for (const spot of [p.left, p.right]) assert.ok(inside(DROP, spot), 'every pair spot is inside the drop');
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
  assert.deepEqual(ARRANGEMENTS.map((a) => a.rows.flat().length), [6, 6, 8, 12]);
  assert.equal(ARRANGEMENTS[3].rows.length, 2);
  const finished = layout(0);
  PAIRS.forEach((p, k) => {
    assert.deepEqual(finished[2 * k], { id: `L${k}`, ...p.left });
    assert.deepEqual(finished[2 * k + 1], { id: `R${k}`, ...p.right });
  });
  for (let k = 1; k < 4; k++) for (const id of ARRANGEMENTS[k - 1].rows.flat()) assert.ok(ARRANGEMENTS[k].rows.flat().includes(id), `${id} stays from ${k} to ${k + 1}`);
});

test('5. positions: every arrangement and the magnet crowd fit the drop without overlaps; one flip tips the TOTAL to 2', () => {
  const noOverlap = (spots, len, tag) => {
    for (let i = 0; i < spots.length; i++) for (let j = i + 1; j < spots.length; j++)
      if (Math.abs(spots[i].y - spots[j].y) < PIECE.height) assert.ok(Math.abs(spots[i].x - spots[j].x) >= len + 4, `${tag}: ${spots[i].id} and ${spots[j].id} overlap`);
  };
  for (let k = 0; k < 4; k++) {
    const spots = layout(k);
    for (const sp of spots) assert.ok(inside(DROP, { x: sp.x - PIECE.length / 2, y: sp.y }) && inside(DROP, { x: sp.x + PIECE.length / 2, y: sp.y }) && sp.y - PIECE.height / 2 > PANEL.y + PANEL.h, `${k}: ${sp.id} in the drop, below the TOTAL`);
    noOverlap(spots, PIECE.length, `arrangement ${k + 1}`);
  }
  const c = crowd();
  assert.equal(c.length, 15);
  const ends = c.flatMap((p) => [p.left, p.right]);
  const len = PIECE.length * CROWD.scale;
  noOverlap(ends, len, 'crowd');
  for (const e of ends) assert.ok(inside(DROP, { x: e.x - len / 2, y: e.y }) && inside(DROP, { x: e.x + len / 2, y: e.y }) && e.y - (PIECE.height * CROWD.scale) / 2 > PANEL.y + PANEL.h, `${e.id} in the drop`);
  for (const y of FIELD_LINES) for (const p of c) {
    assert.ok(Math.abs(y - p.y) > (PIECE.height * CROWD.scale) / 2 + 2, `field line ${y} misses the arrows of row ${p.y}`);
    assert.ok(Math.abs(y - p.zero.y) > 9, `field line ${y} misses the 0s of row ${p.y}`);
  }
  assert.equal(crowdTotal(false), 0, 'before the magnet: every pair cancels');
  assert.equal(crowdTotal(true), 2, 'with the magnet on: one ← turned to → tips the balance by exactly 2');
  const before = crowdDirections(false);
  const after = crowdDirections(true);
  assert.deepEqual(Object.keys(after).filter((id) => after[id] !== before[id]), [FLIP], 'exactly one arrow flips');
  for (let k = 0; k < 6; k++) assert.ok(ends.some((e) => e.id === `L${k}`) && ends.some((e) => e.id === `R${k}`), 'the learner\'s arrows stay in the crowd');
});

test('6. the scanner scenes, the picture, and the MRI numbers the copy states', () => {
  const head = PATIENT.head.cx + SLIDE;
  assert.ok(head > HOUSING.x && head < BORE.cx, 'after sliding in, the head is inside the scanner');
  assert.ok(PATIENT.head.cy + PATIENT.head.r < BORE.cy + BORE.holeRy && PATIENT.body.y > BORE.cy - BORE.holeRy, 'the patient fits the bore');
  assert.ok(ZOOM.x > PATIENT.body.x + SLIDE && ZOOM.x < PATIENT.body.x + PATIENT.body.w + SLIDE, 'the zoom goes into the body');
  const cells = picture();
  assert.equal(cells.length, SCREEN.n ** 2);
  assert.ok(cells.every((c) => c.g >= 0 && c.g <= 1 && c.x >= SCREEN.x && c.x + c.size <= SCREEN.x + SCREEN.size + 1e-9));
  assert.equal(scanPixel(0.99, 0.99), 0, 'outside the head is dark');
  assert.equal(scanPixel(0.3, 0.1), scanPixel(-0.3, 0.1), 'the illustration is left-right symmetric');
  // the numbers behind lines 8, 31 and 33 of the copy list
  const [lo, hi] = PHYS.fields.map(excessPerMillion);
  assert.ok(lo > 4.5 && lo < 5.5 && hi > 9.5 && hi < 10.5, `about five to ten per million (${lo.toFixed(1)}, ${hi.toFixed(1)})`);
  assert.match(COPY.magnet[2], /about five to ten in every million/);
  const t = PHYS.fields.map(timesEarth);
  assert.ok(t.every((x) => x >= 10_000 && x < 100_000), 'tens of thousands of times Earth\'s field');
  assert.match(COPY.magnet[0], /tens of thousands of times stronger than Earth's/);
  const h = hydrogenInDrop();
  assert.ok(h >= 1e21 && h < 1e24, 'billions of trillions');
  assert.match(COPY.water[1], /billions of trillions of hydrogen atoms/);
});

test('7. the learner-facing copy is verbatim from the Revision 3 list, in its order; Revision 2 lines unchanged; the page shows it in that order and nothing after the final line', () => {
  const ordered = [COPY.scanner[0], COPY.scanner[1], COPY.opening, COPY.slideIn, COPY.inside, COPY.zoomIn, COPY.water[0], COPY.water[1], COPY.closer,
    COPY.proton[0], COPY.proton[1], COPY.hook, COPY.totalLabel, COPY.task, COPY.hint, COPY.check1.question, ...COPY.check1.choices, COPY.check1.after,
    COPY.reached[0], COPY.reached[1], COPY.lookCloser, COPY.check2.question, ...COPY.check2.choices, COPY.check2.right, COPY.check2.wrong,
    COPY.answer, COPY.shuffle, ...COPY.arrangements, COPY.reveal, COPY.magnetQuestion, COPY.switchOn, ...COPY.magnet, COPY.listen, COPY.picture,
    ...COPY.closing, COPY.final];
  let at = 0;
  for (const line of ordered) {
    const i = copyList.indexOf(line, at);
    assert.ok(i >= 0, `not in the Revision 3 list, in order: ${line}`);
    at = i;
  }
  assert.ok(copyList.trimEnd().endsWith('Nothing comes after line 39.') && copyList.includes(`39. ${COPY.final}`), 'the final line is last');
  for (const line of [COPY.opening, COPY.task, COPY.check1.question, COPY.check1.after, ...COPY.reached, COPY.lookCloser, COPY.check2.question, COPY.check2.right, COPY.check2.wrong, ...COPY.arrangements, COPY.reveal, COPY.totalLabel])
    assert.ok(rev2.includes(line), `a Revision 2 line, unchanged: ${line}`);
  assert.equal(COPY.check2.intended, 'No');
  for (const line of ordered) assert.ok(line.split(/(?<=[.?!])\s+/).length <= 2, `at most two sentences: ${line}`);
  // the page
  const calls = ['COPY.scanner[0]', 'COPY.scanner[1]', 'COPY.opening', 'COPY.slideIn', 'COPY.inside', 'COPY.zoomIn', 'COPY.water[0]', 'COPY.water[1]', 'COPY.closer',
    'COPY.proton[0]', 'COPY.proton[1]', 'COPY.hook', 'COPY.task', 'COPY.hint', 'COPY.check1.question', 'COPY.check1.after', 'COPY.reached[0]', 'COPY.reached[1]',
    'COPY.lookCloser', 'COPY.check2.question', 'COPY.check2.right', 'COPY.answer', 'COPY.check2.wrong', 'COPY.shuffle', 'COPY.arrangements[0]', 'COPY.reveal',
    'COPY.magnetQuestion', 'COPY.switchOn', 'COPY.magnet[0]', 'COPY.magnet[1]', 'COPY.magnet[2]', 'COPY.magnet[3]', 'COPY.listen', 'COPY.picture',
    'COPY.closing[0]', 'COPY.closing[1]', 'COPY.final'];
  const pos = calls.map((c) => main.indexOf(c, main.indexOf('// ── the story')));
  assert.ok(pos.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => pos[k] < 0)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|button\(|choices\(/.test(tail.replace("say(COPY.final, 'final');", '')), 'nothing is shown after the final line');
  for (const line of [COPY.task, COPY.hook, COPY.reveal, COPY.final, ...COPY.magnet, ...COPY.closing]) assert.ok(!main.includes(line), `copy belongs in copy.js: ${line}`);
});

test('8. the frame: no curve, no compass, no rotation, no title revealing the concept; light page; reduced motion', () => {
  for (const [name, src] of [['main.js', main], ['try.css', css]]) {
    assert.ok(!/needle|compass|north|south|\barc\b|rotate\(|atan2/i.test(src), `${name}: no curve, compass or rotation`);
  }
  assert.ok(!/ A [\d.]+ [\d.]+ 0 [01] [01] (?!-24 -6)/.test(main), 'the only SVG arc is the rounded end of a piece');
  assert.match(main, /const mirror = /, 'a left piece is a mirrored right piece');
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
