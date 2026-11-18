// Interactive 01 at try/ (docs/prototype_try_spec.md, Revision 4: magnets, adding up, groups, up and down). Guards: ↑
// and ↓ pieces only (no curve, no compass, no rotation); the TOTAL adds up the arrows in the drop, shown as a sum with
// + and =, reaching an exact 0 only when every piece is paired; every balanced group drawn as a group with its own 0;
// four different arrangements behind the same 0; the magnet tips the balance by exactly one flip; the MRI numbers in
// the copy; the learner-facing copy verbatim from the Revision 4 list, in its order, ending with the final line; and the
// page frame.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  start, pair, dropTarget, tapTarget, totalOf, pairedCount, total, dirOf, layout, pattern, puzzleGroups, frame, sumLayout, crowd, crowdDirections, crowdTotal,
  ARRANGEMENTS, PAIRS, ROWS, VIEW, PIECE, PANEL, DROP, DROP_LINE, CROWD, CROWD_SHOWN, FIELD_LINES, FIELD_SPAN, FLIP,
} from '../src/math/pieces.js';
import {
  excessPerMillion, timesEarth, hydrogenInDrop, molecules, hydrogenSpot, picture, scanPixel, PHYS,
  HOUSING, BORE, PATIENT, SLIDE, ZOOM, SCREEN,
} from '../src/math/scanner.js';
import { COPY } from '../src/prototypes/try/copy.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const specAll = read('docs/prototype_try_spec.md');
const rev4 = specAll.slice(0, specAll.indexOf('## Revision 3 ('));
const rev2 = specAll.slice(specAll.indexOf('## Revision 2 ('), specAll.indexOf('## Revision 1'));
const copyList = rev4.slice(rev4.indexOf('### Learner copy'), rev4.indexOf('### The physics'));
const main = read('src/prototypes/try/main.js');
const css = read('src/prototypes/try/try.css');
const html = read('try/index.html');
const inside = (r, { x, y }) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
const terms = (groups) => groups.map((g) => g.map((id) => ({ id, dir: dirOf(id) })));
/** No two pieces (drawn at `scale`) overlap. */
const apart = (spots, scale, tag) => {
  for (let i = 0; i < spots.length; i++) for (let j = i + 1; j < spots.length; j++)
    assert.ok(Math.abs(spots[i].x - spots[j].x) >= PIECE.width * scale + 2 || Math.abs(spots[i].y - spots[j].y) >= PIECE.length * scale + 2, `${tag}: ${spots[i].id} and ${spots[j].id} overlap`);
};
/** Every piece (drawn at `scale`) inside the drop and below the TOTAL. */
const inDrop = (spots, scale, tag) => {
  for (const s of spots) {
    const hw = (PIECE.width * scale) / 2, hl = (PIECE.length * scale) / 2;
    assert.ok(inside(DROP, { x: s.x - hw, y: s.y - hl }) && inside(DROP, { x: s.x + hw, y: s.y + hl }) && s.y - hl > PANEL.y + PANEL.h, `${tag}: ${s.id} in the drop, below the TOTAL`);
  }
};

test('1. the story pieces: six hydrogen atoms become six ↑ ↓ magnets; three ↑ in the drop, three ↓ outside; TOTAL 3', () => {
  const hs = molecules().flatMap((m) => m.h);
  assert.equal(hs.length, 6);
  const s = start();
  assert.deepEqual(hs.map((h) => h.id).sort(), [...s.row, ...s.waiting].sort(), 'each hydrogen atom carries one of the six arrows');
  assert.ok(hs.every((h) => [1, -1].includes(dirOf(h.id))), 'only ↑ and ↓');
  apart(hs, 1, 'arrows on the atoms');
  for (const h of hs) assert.ok(h.x - PIECE.width / 2 >= 0 && h.x + PIECE.width / 2 <= VIEW.w && h.y - PIECE.length / 2 >= 0, `${h.id} on the board`);
  assert.deepEqual(hydrogenSpot('U0'), hs.find((h) => h.id === 'U0'));
  assert.deepEqual(s.row.map(dirOf), [1, 1, 1]);
  assert.deepEqual(s.waiting.map(dirOf), [-1, -1, -1]);
  assert.equal(totalOf(s), 3);
  inDrop(s.row.map((id) => ({ id, ...PAIRS[+id.slice(1)].up })), 1, 'start');
  assert.ok(ROWS.supply - PIECE.length / 2 > DROP.y + DROP.h, 'the waiting ↓ arrows sit outside the drop');
  assert.ok(ROWS.supply + PIECE.length / 2 <= VIEW.h);
});

test('2. the TOTAL adds up the arrows in the drop: ↑ + ↑ + ↑ = 3, each ↓ makes it one smaller, six arrows = 0', () => {
  let s = start();
  const seen = [totalOf(s)];
  const sums = [sumLayout(terms(puzzleGroups(s)))];
  for (const [id, p] of [['D0', 1], ['D2', 2], ['D1', 0]]) { s = pair(s, id, p); seen.push(totalOf(s)); sums.push(sumLayout(terms(puzzleGroups(s)))); }
  assert.deepEqual(seen, [3, 2, 1, 0]);
  assert.ok(Number.isInteger(totalOf(s)) && totalOf(s) === 0, 'an exact integer 0');
  assert.equal(pairedCount(s), 3);
  assert.equal(s.row.length + s.pairedWith.filter(Boolean).length, 6, 'all six pieces still in play');
  assert.equal(pair(s, 'D0', 0), s, 'a taken pair cannot be taken again');
  sums.forEach((L, k) => {
    const t = L.items.filter((i) => i.kind === 'term');
    assert.equal(t.length, 3 + k, 'every arrow in the drop is in the sum');
    assert.equal(L.items.filter((i) => i.kind === 'plus').length, t.length - 1, 'a + between each two arrows');
    assert.equal(total(t.map((i) => i.dir)), seen[k], 'the sum is the TOTAL');
    assert.deepEqual(L.brackets.map((b) => b.value), Array(k).fill(0), 'each pair is bracketed with its own 0');
    for (const it of L.items) assert.ok(it.x - it.width / 2 >= PANEL.x && it.x + it.width / 2 <= PANEL.x + PANEL.w, 'the sum fits the TOTAL');
  });
  const big = sumLayout(terms(ARRANGEMENTS[3].groups));
  assert.ok(big.items.every((it) => it.x - it.width / 2 >= PANEL.x && it.x + it.width / 2 <= PANEL.x + PANEL.w), 'twelve arrows still fit');
});

test('3. generous snapping and tap pairing, into the drop only', () => {
  const s = start();
  assert.equal(dropTarget(s, PAIRS[1].down.x + 70, ROWS.mat - 40), 1, 'a loose drop near an ↑ pairs with it');
  assert.equal(dropTarget(s, 10, PANEL.y + 10), 0, 'anywhere above the waiting row counts');
  assert.equal(dropTarget(s, PAIRS[1].down.x, ROWS.supply), null, 'a drop back in the waiting row returns the piece');
  assert.ok(DROP_LINE >= DROP.y + DROP.h && DROP_LINE < ROWS.supply);
  const s1 = pair(s, 'D1', 1);
  assert.notEqual(dropTarget(s1, PAIRS[1].down.x, ROWS.mat), 1, 'never onto a taken pair');
  assert.ok([0, 1, 2].includes(tapTarget(s, 'D0')), 'a tap pairs the piece with a free ↑');
  inDrop(PAIRS.flatMap((p, k) => [{ id: `D${k}`, ...p.down }, { id: `U${k}`, ...p.up }]), 1, 'pairs');
});

test('4. four visibly different arrangements, every group balanced, the stacked ones ↑ over ↓ one under each', () => {
  assert.equal(ARRANGEMENTS.length, 4);
  assert.deepEqual(ARRANGEMENTS.map((_, k) => pattern(k)), ['↓↑ | ↓↑ | ↓↑', '↑↑↓↓ | ↑↓', '↑↑↑↓↓↓ | ↑↓', '↑↑↑↑↑↑↓↓↓↓↓↓']);
  for (const a of ARRANGEMENTS) {
    for (const g of a.groups) assert.equal(total(g), 0, `${a.name}: every group adds up to 0`);
    const ids = a.groups.flat();
    assert.equal(new Set(ids).size, ids.length, `${a.name}: no piece twice`);
  }
  assert.deepEqual(ARRANGEMENTS.map((a) => a.groups.flat().length), [6, 6, 8, 12]);
  const finished = layout(0);
  PAIRS.forEach((p, k) => assert.deepEqual(finished[k], [{ id: `D${k}`, ...p.down }, { id: `U${k}`, ...p.up }]), 'arrangement 1 is the learner\'s own drop');
  for (let k = 1; k < 4; k++) for (const g of layout(k)) {
    const ups = g.filter((s) => dirOf(s.id) > 0);
    const downs = g.filter((s) => dirOf(s.id) < 0);
    assert.deepEqual(ups.map((s) => s.x), downs.map((s) => s.x), 'one ↓ directly under each ↑');
    assert.ok(ups.every((u) => u.y < downs[0].y));
  }
  for (let k = 1; k < 4; k++) for (const id of ARRANGEMENTS[k - 1].groups.flat()) assert.ok(ARRANGEMENTS[k].groups.flat().includes(id), `${id} stays from ${k} to ${k + 1}`);
});

test('5. positions: arrangements and the magnet crowd fit the drop without overlaps; groups and their 0s apart; one flip tips the TOTAL to 2', () => {
  const framesApart = (fs, tag) => {
    for (const f of fs) assert.ok(inside(DROP, f) && inside(DROP, { x: f.x + f.w, y: f.y + f.h }) && inside(DROP, f.label) && f.y > PANEL.y + PANEL.h, `${tag}: group and its 0 in the drop`);
    for (let i = 0; i < fs.length; i++) for (let j = i + 1; j < fs.length; j++) {
      const a = fs[i], b = fs[j];
      assert.ok(a.x + a.w < b.x || b.x + b.w < a.x || a.label.y + 8 < b.y || b.label.y + 8 < a.y, `${tag}: groups ${i} and ${j} overlap`);
    }
  };
  for (let k = 0; k < 4; k++) {
    const groups = layout(k);
    inDrop(groups.flat(), 1, `arrangement ${k + 1}`);
    apart(groups.flat(), 1, `arrangement ${k + 1}`);
    framesApart(groups.map((g) => frame(g)), `arrangement ${k + 1}`);
  }
  const c = crowd();
  assert.equal(c.length, 12);
  const ends = c.flatMap((p) => [p.down, p.up]);
  inDrop(ends, CROWD.scale, 'crowd');
  apart(ends, CROWD.scale, 'crowd');
  const fs = c.map((p) => frame([p.down, p.up], CROWD.scale, CROWD.labelGap));
  framesApart(fs, 'crowd');
  for (const x of FIELD_LINES) for (const f of fs) assert.ok(x < f.x - 2 || x > f.x + f.w + 2, `field line ${x} passes between the groups`);
  assert.ok(FIELD_SPAN.top > PANEL.y + PANEL.h && FIELD_SPAN.bottom < DROP.y + DROP.h);
  assert.equal(crowdTotal(false), 0, 'before the magnet: every pair cancels');
  assert.equal(crowdTotal(true), 2, 'with the magnet on: one ↓ turned to ↑ tips the balance by exactly 2');
  const before = crowdDirections(false);
  const after = crowdDirections(true);
  assert.deepEqual(Object.keys(after).filter((id) => after[id] !== before[id]), [FLIP], 'exactly one arrow flips');
  assert.equal(after[FLIP], 1, 'it turns to point with the magnet, up');
  assert.ok(CROWD_SHOWN.includes(+FLIP.slice(1)), 'the sum shows the flipped pair');
  for (let k = 0; k < 6; k++) assert.ok(ends.some((e) => e.id === `D${k}`) && ends.some((e) => e.id === `U${k}`), 'the learner\'s arrows stay in the crowd');
});

test('6. the scanner scenes, the picture, and the MRI numbers the copy states', () => {
  const head = PATIENT.head.cx + SLIDE;
  assert.ok(head > HOUSING.x && head < BORE.cx, 'after sliding in, the head is inside the scanner');
  assert.ok(PATIENT.head.cy + PATIENT.head.r < BORE.cy + BORE.holeRy && PATIENT.body.y > BORE.cy - BORE.holeRy, 'the patient fits the bore');
  assert.ok(ZOOM.x > PATIENT.body.x + SLIDE && ZOOM.x < PATIENT.body.x + PATIENT.body.w + SLIDE, 'the zoom goes into the body');
  const cells = picture();
  assert.equal(cells.length, SCREEN.n ** 2);
  assert.ok(cells.every((c) => c.g >= 0 && c.g <= 1 && c.x >= SCREEN.x && c.x + c.size <= SCREEN.x + SCREEN.size + 1e-9));
  assert.ok(SCREEN.y + SCREEN.size <= VIEW.h, 'the picture fits the board');
  assert.equal(scanPixel(0.99, 0.99), 0, 'outside the head is dark');
  assert.equal(scanPixel(0.3, 0.1), scanPixel(-0.3, 0.1), 'the illustration is left-right symmetric');
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

test('7. the learner-facing copy is verbatim from the Revision 4 list, in its order; Revision 2 lines unchanged; the page shows it in that order and nothing after the final line', () => {
  const ordered = [COPY.scanner[0], COPY.scanner[1], COPY.opening, COPY.slideIn, COPY.inside, COPY.zoomIn, `${COPY.atoms.o}, ${COPY.atoms.h}`, COPY.water[0], COPY.water[1], COPY.closer,
    `${COPY.poles.n}, ${COPY.poles.s}`, COPY.proton[0], COPY.proton[1], COPY.hook, COPY.totalLabel, COPY.totalMeans, `${COPY.sum.plus} ${COPY.sum.equals} ${COPY.sum.more}`,
    COPY.task, COPY.hint, `${COPY.groupZero} (under`, COPY.check1.question, ...COPY.check1.choices, COPY.check1.after,
    COPY.reached[0], COPY.reached[1], COPY.lookCloser, COPY.check2.question, ...COPY.check2.choices, COPY.check2.right, COPY.check2.wrong,
    COPY.answer, COPY.arrangements[0], COPY.cover.intro, `${COPY.cover.mark} (on the covered`, COPY.cover.question, ...COPY.cover.choices, COPY.cover.after,
    COPY.arrangements[1], COPY.cover.again, COPY.cover.look, COPY.arrangements[2], COPY.cover.again, COPY.cover.look, COPY.reveal,
    COPY.magnetQuestion, COPY.switchOn, ...COPY.magnet, COPY.listen, COPY.picture, ...COPY.closing, COPY.final];
  let at = 0;
  for (const line of ordered) {
    const i = copyList.indexOf(line, at);
    assert.ok(i >= 0, `not in the Revision 4 list, in order: ${line}`);
    at = i;
  }
  assert.ok(copyList.trimEnd().endsWith('Nothing comes after line 49.') && copyList.includes(`49. ${COPY.final}`), 'the final line is last');
  for (const line of [COPY.opening, COPY.task, COPY.check1.question, COPY.check1.after, ...COPY.reached, COPY.lookCloser, COPY.check2.question, COPY.check2.right, COPY.check2.wrong, ...COPY.arrangements, COPY.reveal, COPY.totalLabel])
    assert.ok(rev2.includes(line), `a Revision 2 line, unchanged: ${line}`);
  assert.equal(COPY.check2.intended, 'No');
  for (const line of ordered) assert.ok(line.split(/(?<=[.?!])\s+/).length <= 2, `at most two sentences: ${line}`);
  const calls = ['COPY.scanner[0]', 'COPY.scanner[1]', 'COPY.opening', 'COPY.slideIn', 'COPY.inside', 'COPY.zoomIn', 'COPY.water[0]', 'COPY.water[1]', 'COPY.closer',
    'COPY.proton[0]', 'COPY.proton[1]', 'COPY.hook', 'COPY.totalMeans', 'COPY.task', 'COPY.hint', 'COPY.check1.question', 'COPY.check1.after', 'COPY.reached[0]', 'COPY.reached[1]',
    'COPY.lookCloser', 'COPY.check2.question', 'COPY.check2.right', 'COPY.answer', 'COPY.check2.wrong', 'COPY.arrangements[0]', 'COPY.cover.intro', 'COPY.cover.question',
    'COPY.cover.after', 'COPY.arrangements[1]', 'COPY.cover.again', 'COPY.cover.look', 'COPY.arrangements[2]', 'COPY.reveal',
    'COPY.magnetQuestion', 'COPY.switchOn', 'COPY.magnet[0]', 'COPY.magnet[1]', 'COPY.magnet[2]', 'COPY.magnet[3]', 'COPY.listen', 'COPY.picture',
    'COPY.closing[0]', 'COPY.closing[1]', 'COPY.final'];
  const pos = calls.map((c) => main.indexOf(c, main.indexOf('// ── the story')));
  assert.ok(pos.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => pos[k] < 0)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|button\(|choices\(|press\(|ask\(/.test(tail.replace("say(COPY.final, 'final');", '')), 'nothing is shown after the final line');
  for (const line of [COPY.task, COPY.hook, COPY.totalMeans, COPY.reveal, COPY.final, ...COPY.magnet, ...COPY.closing]) assert.ok(!main.includes(line), `copy belongs in copy.js: ${line}`);
});

test('8. the frame: ↑ and ↓ magnets mirrored, never rotated; no curve or compass; no concept in the title; light page; reduced motion', () => {
  for (const [name, src] of [['main.js', main], ['try.css', css]]) {
    assert.ok(!/needle|compass|north|south|rotate\(|atan2|offset-path|animateMotion/i.test(src), `${name}: no curve, compass or rotation`);
  }
  assert.match(main, /const mirror = \(d\) => `scale\(1, \$\{d > 0 \? 1 : -1\}\)`/, 'a ↓ is a mirrored ↑');
  assert.match(main, /class: 's-part'/);
  assert.match(main, /class: 'n-part'/);
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
