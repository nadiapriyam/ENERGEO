// Level 2, "Inside the scanner", the MRI, at try/ (docs/levels_spec.md; history in docs/prototype_try_spec.md). Guards:
// - only ↑ and ↓ pieces (no curve, no compass, no rotation);
// - the TOTAL SIGNAL adds up the arrows in the drop, shown as a sum with + and =, and is an exact 0 only when every
//   piece is paired;
// - every balanced group is drawn as a group with its own 0;
// - four different arrangements sit behind the same 0;
// - the magnet tips the balance by exactly one flip;
// - the MRI numbers in the copy;
// - the eye and the side by side with Level 1 fit;
// - the learner-facing copy is verbatim from the Level 2 list, in its order, ending with the final line;
// - the page frame.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  start, pair, dropTarget, tapTarget, totalOf, pairedCount, total, dirOf, layout, pattern, puzzleGroups, frame, sumLayout, crowd, crowdDirections, crowdTotal,
  ARRANGEMENTS, PAIRS, ROWS, VIEW, PIECE, PANEL, DROP, DROP_LINE, CROWD, CROWD_SHOWN, FIELD_LINES, FIELD_SPAN, FLIP, RADIO, POP,
  ZERO, CROWD_ZERO, insideZero, zeroFromResult, RESULT_GLYPH, zeroTag, METER, PUZZLE_FULL, share, meterBars, meterBarSpots, meterWave, inPlay,
} from '../src/math/pieces.js';
import {
  excessPerMillion, timesEarth, hydrogenInDrop, molecules, hydrogenSpot, picture, scanPixel, PHYS,
  HOUSING, BORE, PATIENT, SLIDE, ZOOM, SCREEN, PICTURE_SHIFT, EYE, SEEN, eyeFeeds, seenTransform, COMPARE, OPERATOR, FLOOR,
} from '../src/math/scanner.js';
import { figureAt, FACE, FIGURE } from '../src/math/characters.js';
import { COPY } from '../src/levels/copyMri.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const specAll = read('docs/prototype_try_spec.md');
const rev2 = specAll.slice(specAll.indexOf('## Revision 2 ('), specAll.indexOf('## Revision 1'));
const levels = read('docs/levels_spec.md');
const copyList = levels.slice(levels.indexOf('## Level 2, "Inside the scanner": learner copy'), levels.indexOf('## What the new lines claim'));
const main = read('src/levels/mri.js');
const css = read('src/levels/mri.css') + read('src/levels/base.css');   // the MRI level's styles and the shared page
const level1Css = read('src/levels/mri.css');
const html = read('try/index.html');
const notebookHtml = read('notebook/index.html');
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
  finished.forEach((g, k) => {
    assert.deepEqual(g.map((s) => s.id), [`D${k}`, `U${k}`], 'arrangement 1 is the learner\'s own drop: its three ↓↑ pairs');
    assert.ok(g[0].x < g[1].x && g[0].y === g[1].y, 'each pair side by side, ↓ then ↑, as the learner made it');
  });
  for (let k = 1; k < 4; k++) for (const g of layout(k)) {
    const ups = g.filter((s) => dirOf(s.id) > 0);
    const downs = g.filter((s) => dirOf(s.id) < 0);
    assert.deepEqual(ups.map((s) => s.x), downs.map((s) => s.x), 'one ↓ directly under each ↑');
    assert.ok(ups.every((u) => u.y < downs[0].y));
  }
  for (let k = 1; k < 4; k++) for (const id of ARRANGEMENTS[k - 1].groups.flat()) assert.ok(ARRANGEMENTS[k].groups.flat().includes(id), `${id} stays from ${k} to ${k + 1}`);
});

test('5. positions: the arrangements fit inside the 0 and the magnet crowd fits the drop and its wide 0, without overlaps; groups and their 0s apart; one flip tips the TOTAL to 2', () => {
  const framesApart = (fs, tag) => {
    for (let i = 0; i < fs.length; i++) for (let j = i + 1; j < fs.length; j++) {
      const a = fs[i], b = fs[j];
      assert.ok(a.x + a.w < b.x || b.x + b.w < a.x || a.label.y + 8 < b.y || b.label.y + 8 < a.y, `${tag}: groups ${i} and ${j} overlap`);
    }
  };
  /** A group's outline and its small 0, all inside the hollow of the 0 `z`. */
  const inZero = (fs, z, tag) => {
    for (const f of fs) for (const p of [{ x: f.x, y: f.y }, { x: f.x + f.w, y: f.y }, { x: f.x, y: f.y + f.h }, { x: f.x + f.w, y: f.y + f.h }, f.label])
      assert.ok(insideZero(p, z, 2), `${tag}: group and its 0 inside the big 0 (${p.x.toFixed(0)}, ${p.y.toFixed(0)})`);
  };
  for (const z of [ZERO, CROWD_ZERO]) {
    assert.ok(z.cy - z.ry > PANEL.y + PANEL.h && z.cy + z.ry < VIEW.h && z.cx - z.rx >= 0 && z.cx + z.rx <= VIEW.w, 'the 0 is under the TOTAL, on the board');
    assert.ok(z.side > z.end, 'a bold 0: its sides thicker than its top and bottom');
  }
  for (let k = 0; k < 4; k++) {
    const groups = layout(k);
    apart(groups.flat(), ZERO.scale, `arrangement ${k + 1}`);
    const fs = groups.map((g) => frame(g, ZERO.scale, ZERO.labelGap));
    framesApart(fs, `arrangement ${k + 1}`);
    inZero(fs, ZERO, `arrangement ${k + 1}`);
  }
  const c = crowd();
  assert.equal(c.length, 12);
  const ends = c.flatMap((p) => [p.down, p.up]);
  inDrop(ends, CROWD.scale, 'crowd');
  apart(ends, CROWD.scale, 'crowd');
  const fs = c.map((p) => frame([p.down, p.up], CROWD.scale, CROWD.labelGap));
  framesApart(fs, 'crowd');
  inZero(fs, CROWD_ZERO, 'crowd');
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

test('5b. the MRI SIGNAL gets weaker as each ↓ joins and is flat at 0; the 0 grows from the TOTAL\'s own 0 (Nadia, 2026-11-24)', () => {
  // the meter: beside the TOTAL, on the board, not over it
  assert.ok(METER.x > PANEL.x + PANEL.w && METER.x + METER.w <= VIEW.w && METER.y >= 0 && METER.y + METER.h < DROP.y + 20, 'the MRI SIGNAL beside the TOTAL, in the same scene');
  const bars = meterBarSpots();
  assert.equal(bars.length, METER.bars.n);
  for (const b of bars) assert.ok(b.x >= METER.x && b.x + b.w <= METER.x + METER.w && b.y + b.h <= METER.y + METER.h, 'its bars inside it');
  assert.ok(bars.every((b, i) => !i || b.h > bars[i - 1].h), 'signal bars, each taller than the last');
  // the puzzle: each ↑ added to the TOTAL makes the signal stronger (Nadia, 2026-11-25), then each ↓ joining makes it
  // weaker, down to flat at 0
  const rising = [1, 2, 3].map((k) => share(k, PUZZLE_FULL));
  assert.deepEqual(rising.map(meterBars), [1, 3, 4], 'one bar, three, four as the ↑ join');
  assert.ok(rising.every((v, i) => !i || v > rising[i - 1]) && rising[2] === 1, 'stronger with every ↑, full at three');
  assert.match(main, /showSignal\(total\(groups\.flat\(\)\.map\(\(r\) => dirs\[r\] \?\? dirOf\(r\)\)\), PUZZLE_FULL\);/, 'the meter grows as each ↑ joins');
  let s = start();
  const shares = [share(totalOf(s), PUZZLE_FULL)];
  for (const [id, p] of [['D0', 0], ['D1', 1], ['D2', 2]]) { s = pair(s, id, p); shares.push(share(totalOf(s), PUZZLE_FULL)); }
  assert.deepEqual(shares, [1, 2 / 3, 1 / 3, 0], 'full, then weaker with every ↓, then 0');
  assert.deepEqual(shares.map(meterBars), [4, 3, 1, 0], 'four bars, three, one, none');
  assert.ok(shares.every((v, i) => !i || v < shares[i - 1]), 'always weaker, never stronger, as the arrows balance');
  assert.ok(!/[1-9]/.test(meterWave(0).replace(/M[\d.]+ |L[\d.]+ /g, '').replace(new RegExp(String(METER.wave.y), 'g'), '')), 'at 0 the wave is a flat line');
  // the magnet: the crowd's signal comes back, faint
  const faint = share(crowdTotal(true), Object.keys(crowdDirections(true)).length);
  assert.ok(faint > 0 && faint < 0.1 && meterBars(faint) === 1, 'with the magnet on, a faint signal: one bar');
  assert.equal(share(crowdTotal(false), 24), 0, 'before the magnet, flat');
  // the 0 grows from the 0 of "= 0", in the TOTAL
  const from = zeroFromResult(ZERO);
  assert.ok(Math.abs(ZERO.cx + from.dx - PANEL.valueX) < 1e-9 && Math.abs(ZERO.cy + from.dy - PANEL.resultY) < 1e-9, 'it starts where the TOTAL\'s 0 is');
  assert.ok(Math.abs(from.s * 2 * ZERO.ry - RESULT_GLYPH.h) < 1e-9 && from.s < 0.25, 'as small as that 0');
  assert.ok(PANEL.eqX < PANEL.valueX && POP.x > PANEL.valueX, '"=" then the value, and +1 beside it');
  for (const z of [ZERO, CROWD_ZERO]) {
    const t = zeroTag(z);
    assert.ok(t.y > z.ry - z.end && t.y < z.ry, 'the tag sits on the 0\'s bottom band');
  }
  // the scene: the meter in the drop's scene (no new scene); the magnets inside the 0; the covered 0 frosted
  assert.match(main, /board\.append\(scanner, lens, water, puzzle, screenShift, eyeScene, panel, meter, piecesLayer, frost, compareLayer\);/);
  assert.match(main, /showSignal\(totalOf\(state\), PUZZLE_FULL\);/, 'each ↓ that joins: the signal gets weaker');
  assert.match(main, /await intoZero\(\);/, 'at 0, the magnets go inside the 0');
  assert.match(main, /const covered = \(v\) => \{ frost\.classList\.toggle\('on', v\)/, 'a covered 0 is the 0, frosted, not a box');
  assert.ok(!/class: 'cover'/.test(main), 'no box over the drop');
  assert.match(main, /say\(COPY\.natural\);[^\n]*\n\s*tagVessel\(COPY\.zeroTag\.natural\);/, 'the natural state: said, and tagged on the 0');
  assert.match(main, /vessel\.classList\.add\('tipped'\);[^\n]*\n\s*tagVessel\(COPY\.zeroTag\.nudged\);/, 'the magnet nudges the 0');
  assert.match(COPY.original, /nudged, faint version/);
  assert.match(COPY.original, /balanced 0 is the original/);
  assert.ok(!/destroy|loses? (information|everything)/i.test(COPY.original + COPY.natural), 'no claim that leaving the 0 loses anything (B-ZERO-LOSS stays a hypothesis)');
  assert.ok(levels.includes('> when adding the magnets to the total signal in level 2, 1. make sure when adding magnets it shows the signal to the mri is getting weaker'), "Nadia's message, verbatim");
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
  assert.ok(COPY.magnet.some((l) => /about five to ten in every million/.test(l)));
  const t = PHYS.fields.map(timesEarth);
  assert.ok(t.every((x) => x >= 10_000 && x < 100_000), 'tens of thousands of times Earth\'s field');
  const h = hydrogenInDrop();
  assert.ok(h >= 1e21 && h < 1e24, 'billions of trillions');
  assert.match(COPY.water[1], /billions of trillions of hydrogen atoms/);
  // the eye: lines from all over the moved picture into the eye; what it sees, small, to its right; all on the board
  for (const f of eyeFeeds()) {
    assert.ok(f.from.x > SCREEN.x + PICTURE_SHIFT && f.from.x < SCREEN.x + PICTURE_SHIFT + SCREEN.size && f.from.y > SCREEN.y && f.from.y < SCREEN.y + SCREEN.size, 'a line starts on the picture');
    assert.ok(Math.abs(f.to.x - (EYE.x + EYE.look - 2)) < 1e-9 && f.to.y === EYE.y, 'and ends in the eye');
  }
  assert.ok(SCREEN.x + PICTURE_SHIFT + SCREEN.size < EYE.x - EYE.rx && EYE.x + EYE.rx < SEEN.x, 'picture, eye, what it sees: left to right');
  const seen = seenTransform();
  assert.ok(Math.abs((SCREEN.size + 12) * seen.s - SEEN.size) < 1e-9 && SEEN.x + SEEN.size <= VIEW.w && SEEN.y + SEEN.size <= VIEW.h, 'one picture, small, on the board');
  for (const side of [COMPARE.left, COMPARE.right]) assert.ok(side.x >= 0 && side.x + side.w <= VIEW.w && side.y >= 0 && side.y + side.h <= VIEW.h);
  assert.ok(COMPARE.left.x + COMPARE.left.w < COMPARE.right.x, 'the violin level on the left, the MRI level on the right');
  // you, taking the scan: standing on the floor beside the scanner, on the board, clear of it
  const you = figureAt(OPERATOR.cx, FLOOR, OPERATOR.height);
  assert.ok(Math.abs(you.y + you.h - FLOOR) < 1e-9 && you.x > 0 && you.x + you.w < HOUSING.x && you.y > 0, 'you stand on the floor, left of the scanner');
  assert.ok(OPERATOR.look.x > HOUSING.x, 'looking toward your patient');
  assert.ok(Math.abs(you.w / you.h - FIGURE.view.w / FIGURE.view.h) < 1e-9 && FACE.view.w === FIGURE.view.w, 'drawn like every character');
});

test('7. the learner-facing copy is verbatim from the Level 2 list, in its order; Nadia\'s Revision 2 lines unchanged; the page shows it in that order and nothing after the final line', () => {
  const ordered = [COPY.scanner, COPY.patient, COPY.slideIn, COPY.inside, COPY.zoomIn, `${COPY.atoms.o}, ${COPY.atoms.h}`, COPY.water[0], COPY.water[1], COPY.closer,
    `${COPY.poles.n}, ${COPY.poles.s}`, COPY.proton[0], COPY.proton[1], COPY.hook, COPY.totalLabel, COPY.totalMeans, `${COPY.meterLabel} (the label`, `${COPY.sum.plus} ${COPY.sum.equals} ${COPY.sum.more}`, `${COPY.sum.up}, ${COPY.sum.down}`,
    COPY.task, COPY.hint, `${COPY.groupZero} (under`, COPY.check1.question, ...COPY.check1.choices, COPY.check1.after,
    COPY.reached, COPY.check2.question, ...COPY.check2.choices, COPY.check2.right, COPY.check2.wrong,
    COPY.answer, COPY.natural, `${COPY.zeroTag.natural} (the tag`, COPY.arrangements[0], COPY.cover.intro, `${COPY.cover.mark} (on the covered`, COPY.cover.question, ...COPY.cover.choices,
    COPY.arrangements[1], COPY.cover.again, COPY.cover.look, COPY.arrangements[2], COPY.cover.again, COPY.cover.look, COPY.reveal,
    COPY.magnetQuestion, COPY.switchOn, `${COPY.zeroTag.nudged} (the 0's tag`, ...COPY.magnet, COPY.original, COPY.listen, COPY.picture, `You: ${COPY.you.didIt}`, `${COPY.eye.label} (the label`, COPY.eye.line, COPY.bigIdea, COPY.whole, COPY.unknown,
    COPY.similar.question, ...COPY.similar.choices, COPY.similar.after,
    `${COPY.compareLabels.note}, ${COPY.compareLabels.signal}, ${COPY.sum.plus}, ${COPY.sum.equals}, ${COPY.zero}, ${COPY.aName}`, COPY.compare, COPY.final];
  let at = 0;
  for (const line of ordered) {
    const i = copyList.indexOf(line, at);
    assert.ok(i >= 0, `not in the Level 2 list, in order: ${line}`);
    at = i;
  }
  assert.ok(copyList.includes(`59. ${COPY.final}`) && copyList.includes('Nothing comes after line 59.') && !/^60\. /m.test(copyList), 'the final line is last');
  assert.match(main, /put\(bigIdea\(COPY\.bigIdea\)\);[\s\S]{0,240}say\(COPY\.whole\);[\s\S]{0,240}say\(COPY\.unknown\);/, 'the big idea, then what hides behind the 0');
  assert.ok(levels.includes('task 2: the second level is a bit confusing try to make the word count lower and simple.'), "Nadia's 2026-11-23 message, verbatim");
  const words = ordered.join(' ').split(/\s+/).length;
  assert.ok(words < 560, `fewer words: ${words}`);
  // you take the scan, of a patient (Nadia, 2026-11-20); the fun lines are yours
  assert.ok(levels.includes('change the preceeding wording to match the user taking an mri scan of a patient'), "Nadia's message, verbatim");
  assert.match(COPY.patient, /Let's see if you can take their MRI scan correctly!$/, "Nadia's: let's see if you can do it correctly");
  assert.match(COPY.patient, /patient.*MRI scan/);
  for (const line of [COPY.slideIn, COPY.inside, COPY.water[0], COPY.answer, COPY.magnet[1], COPY.picture]) assert.match(line, /patient/, `the patient's, not yours: ${line}`);
  assert.ok(!/inside you,|surrounds you\.|Your body|your insides|Sometimes it's you/.test(JSON.stringify(COPY)), 'you are not the one in the scanner');
  assert.match(COPY.reached, /^Oh no! I got 0 signal for my MRI!$/, 'oh no: no signal');
  assert.match(main, /speak\(COPY\.reached, 'you'\)/);
  assert.match(main, /speak\(COPY\.magnetQuestion, 'you', true\)/);
  assert.match(main, /speak\(COPY\.you\.didIt, 'you'\)/);
  assert.match(main, /person\('you', figureAt\(OPERATOR\.cx, FLOOR, OPERATOR\.height\), OPERATOR\.look\)/, 'you, beside the scanner');
  assert.ok([COPY.totalLabel, COPY.totalMeans, COPY.reached, COPY.magnetQuestion, COPY.magnet[1], COPY.compare].every((l) => /signal/i.test(l)), 'the total is a signal, and 0 is 0 signal');
  assert.match(COPY.similar.question, /violin level/);
  for (const line of [COPY.task, COPY.check1.question, COPY.check1.after, COPY.check2.question, COPY.check2.right, COPY.check2.wrong, ...COPY.arrangements, COPY.reveal])
    assert.ok(rev2.includes(line), `a Revision 2 line, unchanged: ${line}`);
  assert.equal(COPY.check2.intended, 'No');
  for (const line of ordered) assert.ok(line.split(/(?<=[.?!])\s+/).length <= 2, `at most two sentences: ${line}`);
  const calls = ['COPY.scanner', 'COPY.patient', 'COPY.slideIn', 'COPY.inside', 'COPY.zoomIn', 'COPY.water[0]', 'COPY.water[1]', 'COPY.closer',
    'COPY.proton[0]', 'COPY.proton[1]', 'COPY.hook', 'COPY.totalMeans', 'COPY.task', 'COPY.hint', 'COPY.check1.question', 'COPY.check1.after', 'COPY.reached',
    'COPY.check2.question', 'COPY.check2.right', 'COPY.answer', 'COPY.natural', 'COPY.zeroTag.natural', 'COPY.check2.wrong', 'COPY.arrangements[0]', 'COPY.cover.intro', 'COPY.cover.question',
    'COPY.arrangements[1]', 'COPY.cover.again', 'COPY.cover.look', 'COPY.arrangements[2]', 'COPY.reveal',
    'COPY.magnetQuestion', 'COPY.switchOn', 'COPY.zeroTag.nudged', 'COPY.magnet[0]', 'COPY.magnet[1]', 'COPY.magnet[2]', 'COPY.magnet[3]', 'COPY.original', 'COPY.listen',
    'COPY.picture', 'COPY.you.didIt', 'COPY.eye.line', 'COPY.bigIdea', 'COPY.whole', 'COPY.unknown', 'COPY.similar.question', 'COPY.similar.after', 'COPY.compareLabels.note', 'COPY.compare', 'COPY.final'];
  const pos = calls.map((c) => main.indexOf(c, main.indexOf('// ── the story')));
  assert.ok(pos.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => pos[k] < 0)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|button\(|choices\(|press\(|ask\(/.test(tail.replace("say(COPY.final, 'final');", '')), 'nothing is shown after the final line');
  for (const line of [COPY.task, COPY.hook, COPY.totalMeans, COPY.reveal, COPY.final, ...COPY.magnet, COPY.bigIdea, COPY.whole, COPY.unknown, COPY.eye.line, COPY.compare, COPY.natural, COPY.original, COPY.meterLabel, COPY.zeroTag.natural]) assert.ok(!main.includes(line), `copy belongs in copyMri.js: ${line}`);
  // gaps filled with pictures, not words: +1 and −1 as arrows join the TOTAL (its result counting with them), and radio
  // waves in, a faint reply out, while that line is on screen
  assert.ok(COPY.sum.up === '+1' && COPY.sum.down === '−1');
  assert.match(main, /drawResult\(total\(groups\.flat\(\)\.map\(\(r\) => dirs\[r\] \?\? dirOf\(r\)\)\)\);\s*\/\/[^\n]*\n\s*popValue\(/, 'the result counts up as each arrow joins, with +1');
  assert.match(main, /drawResult\(totalOf\(state\)\);\s*popValue\(/, 'each ↓ dragged in: −1');
  assert.match(main, /say\(COPY\.magnet\[3\]\);[^\n]*\n\s*on\(radio\);/, 'radio waves while the radio line is on screen');
  assert.match(main, /on\(radio, false\)/);
  assert.ok(POP.x > PANEL.cx + 20 && POP.x + 40 < PANEL.x + PANEL.w && Math.abs(POP.y - PANEL.resultY) < 10, '+1 beside the result, in the panel');
  assert.ok(RADIO.from[0] >= DROP.x && RADIO.from[1] <= DROP.x + DROP.w && RADIO.y > DROP.y && RADIO.y < DROP.y + DROP.h && RADIO.from[0] + RADIO.travel < RADIO.reply.x, 'radio waves come in across the drop, toward its middle');
});

test('8. the frame: ↑ and ↓ magnets mirrored, never rotated; no curve or compass; no concept in the title; light page; reduced motion', () => {
  for (const [name, src] of [['level1.js', main], ['level1.css', level1Css]]) {
    assert.ok(!/needle|compass|north|south|rotate\(|atan2|offset-path|animateMotion/i.test(src), `${name}: no curve, compass or rotation`);
  }
  assert.match(main, /const mirror = \(d\) => `scale\(1, \$\{d > 0 \? 1 : -1\}\)`/, 'a ↓ is a mirrored ↑');
  assert.match(main, /class: 's-part'/);
  assert.match(main, /class: 'n-part'/);
  assert.ok(!existsSync(new URL('../src/math/needles.js', import.meta.url)), 'the needle model is gone');
  assert.equal(html.match(/<title>([^<]*)<\/title>/)[1], 'Try this');
  assert.ok(!/zero|cancel|\b0\b|nothing|<h1/i.test(html), 'the page shell names no concept');
  assert.match(html, /id="next-level" hidden/, 'Level 2 is offered only after Level 1 ends');
  assert.ok(html.indexOf('id="note-lesson"') < html.indexOf('id="mri-lesson"'), 'one page: the violin, then the MRI');
  assert.match(read('src/levels/page.js'), /chain\('note-lesson', 'next-level', LEVELS\.next, 'level-2', \(\) => import\('\.\/mri\.js'\)\)/, 'the MRI level starts when Level 1 is done');
  assert.match(notebookHtml, /url=\.\.\/try\//, 'the old notebook link opens the levels');
  assert.match(read('try/level-2/index.html'), /url=\.\.\//, 'the old Level 2 link opens the levels');
  assert.match(css, /--bg: #ffffff;/, 'a light page: white (Nadia\'s "Contemporary European" palette, 2026-11-24)');
  assert.ok(!/prefers-color-scheme: dark|linear-gradient|\bred\b|crimson/i.test(css), 'no dark theme, no gradients, no red');
  for (const hex of css.match(/#[0-9a-f]{6}\b/gi) ?? []) {
    if (hex.toLowerCase() === '#e76f51') continue;   // the palette's coral (Nadia, 2026-11-24): an accent, never a wrong answer's colour
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    assert.ok(!(r - g > 80 && r - b > 80), `no error red: ${hex}`);
  }
  assert.ok(!/\.(missed|wrong|feedback)[^{]*\{[^}]*(coral|#e76f51)/i.test(css), 'coral never marks a wrong answer');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(read('vite.config.js'), /try\/index\.html/);
});
