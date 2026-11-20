// Level 3, "A prism for sound", at try/ (docs/levels_spec.md, Level 3 Revision 7). Guards:
// - the hall: the stage light misses at first, is caught when aimed anywhere at the chandelier, goes into the prism's
//   near face, and the colours leave in a real prism's order (red bent least, violet most);
// - the tuner's little signal is the big signal, laid exactly on its screen;
// - the four bars are exactly the A note's tones; dragging sets one bar; one bar is a pure tone;
// - the scanner: every pixel of the head is exactly one body part; each part's signal is as strong as the part is
//   bright, and fades at its own pace; converting each row's data (an exact Fourier transform) gives back every row
//   of the 48 × 48 picture; the three parts stand left to right; the data and the picture move into the pattern;
// - the break: you and the radiologist stand on the floor, apart and clear of the prism, and the radiologist walks in;
//   the faces are well formed (yours with its bucket hat; the radiologist's with a white coat), eyes in their sockets;
// - the big labelled head: each label points at its own part, level with it;
// - the copy is verbatim and in order, with Nadia's sentences, each part of her scanner wording lit by its step, no
//   magnets drawn and no music in the scanner part;
// - the frame: sound after a tap, reduced motion, Level 3 after Level 2, and the app's own Fourier math untouched.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BOARD, fit, triangle, HALL, RAINBOW, BEND, crystalCorners, nearFace, aimAngle, toCrystal, startAngle, edge, lightPath,
  STRIP, STRIP_BOX, signal, samplesPath, TUNER, onTuner, SPECTRUM, GLYPH, barX, barHeight, barAt, stepsAt, pureTone, allBack,
  NOTE_LED, neon, ROWS, MRI, BODY_PARTS, partOf, strength, partAt, partWave, coarseRows, chordSamples, unmix, rowOrder, FIRST_ROW,
  rowIn, toSignal, BRAIN, SKULL, EXPLORE, exploreHead, exploreData, labels, coatLapels, FIGURE, BREAK, figureBox, FACE, hairPath, shirtPath, lookAt, PLAYER, RADIOLOGIST, bucketHat, beamHeightAt,
  PATTERN, patternBox, PIC_FRAME, stripToPattern, picToPattern, patternBars, patternLight,
} from '../src/math/prism.js';
import { A_NOTE, STEPS, part, wave } from '../src/math/tones.js';
import { scanPixel } from '../src/math/scanner.js';
import * as appFourier from '../src/math/fourier.js';
import { COPY } from '../src/levels/copyPrism.js';
import { LEVELS } from '../src/levels/copyLevels.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const spec = read('docs/levels_spec.md');
const level3 = spec.slice(spec.indexOf('## Level 3, "A prism for sound"'));
const rev7 = level3.slice(level3.indexOf('### Revision 7'));
const copyList = rev7.slice(rev7.indexOf('#### Level 3 learner copy (Revision 7)'), rev7.indexOf('#### What the new lines claim'));
const main = read('src/levels/prism.js');
const css = read('src/levels/prism.css');
const inside = (r, x, y, e = 1e-6) => x >= r.x - e && x <= r.x + r.w + e && y >= r.y - e && y <= r.y + r.h + e;
const ys = (d) => d.slice(1).split('L').map((pt) => +pt.split(' ')[1]);
const apply = (f, p) => ({ x: f.tx + p.x * f.sx, y: f.ty + p.y * f.sy });
const same = (a, b, e = 1e-9) => Math.abs(a - b) < e;
const fits = (f, from, to) => {
  const a = apply(f, { x: from.x, y: from.y });
  const b = apply(f, { x: from.x + from.w, y: from.y + from.h });
  return same(a.x, to.x) && same(a.y, to.y) && same(b.x, to.x + to.w) && same(b.y, to.y + to.h);
};
const DEG = Math.PI / 180;

test('1. the hall: the light first misses; aimed anywhere at the chandelier, the beam goes into the prism\'s near face and the colours leave red-first, violet bent most', () => {
  const miss = lightPath(startAngle());
  assert.ok(!miss.hit && miss.rays.length === 0, 'at first the light misses: white light on the wall');
  assert.ok(same(miss.beam.to.x, BOARD.w) && miss.beam.to.y > HALL.crystal.cy + 100, 'it lands on the wall, well below the prism');
  const hit = lightPath(toCrystal());
  const [top, right, left] = crystalCorners();
  assert.ok(hit.hit && same(hit.beam.to.x, nearFace().x) && same(hit.beam.to.y, nearFace().y), 'the beam goes in at the middle of the near face');
  assert.ok(same(nearFace().x, (top.x + left.x) / 2) && same(nearFace().y, (top.y + left.y) / 2));
  assert.ok(lightPath(toCrystal() + 3 * DEG).hit && lightPath(toCrystal() + 3 * DEG).angle === toCrystal(), 'close enough: the beam snaps onto the prism');
  const atHeight = (y) => aimAngle({ x: HALL.crystal.cx, y });
  for (const y of [HALL.catchTop + 1, HALL.chandelier.armY, HALL.crystal.cy, right.y + HALL.catchBelow - 1]) {
    assert.ok(same(beamHeightAt(atHeight(y), HALL.crystal.cx), y, 1e-6) && lightPath(atHeight(y)).hit, `aimed at the chandelier (y ${y}): caught`);
  }
  for (const y of [HALL.catchTop - 12, right.y + HALL.catchBelow + 12]) assert.ok(!lightPath(atHeight(y)).hit, `above or below the chandelier (y ${y}): no colours`);
  assert.ok(HALL.catchTop < HALL.chandelier.armY - 9 - 6, 'the catch reaches above the bulbs');
  assert.equal(hit.rays.length, RAINBOW.length);
  hit.rays.forEach((r, i) => {
    assert.ok(same(r.from.x, (top.x + right.x) / 2) && same(r.from.y, (top.y + right.y) / 2), 'each colour leaves the far face');
    assert.ok(same(r.to.x, BOARD.w) && r.to.y > 0 && r.to.y < HALL.floor, 'and lands on the wall');
    if (i) assert.ok(r.bent > hit.rays[i - 1].bent, 'each colour is bent more than the one before');
  });
  assert.ok(same(hit.rays[0].bent - hit.angle, BEND.least) && same(hit.rays.at(-1).bent - hit.angle, BEND.most));
  assert.match(RAINBOW[0], /^hsl\(0,/, 'red is bent least');
  assert.match(RAINBOW.at(-1), /^hsl\(275,/, 'violet most');
  assert.ok(aimAngle({ x: 0, y: 400 }) === HALL.aim.max && aimAngle({ x: HALL.light.x, y: -999 }) === HALL.aim.min, 'the light only points up and to the right');
  const e = edge({ x: 100, y: 100 }, -Math.PI / 4);
  assert.ok(same(e.y, 0) && same(e.x, 200), 'edge: where a ray leaves the board');
  const [t0, t1, t2] = triangle({ cx: 0, cy: 0, size: 6 });
  assert.ok(same((t0.x + t1.x + t2.x) / 3, 0) && same((t0.y + t1.y + t2.y) / 3, 0) && same(Math.hypot(t1.x - t0.x, t1.y - t0.y), 6), 'an equilateral triangle about its centre');
});

test("2. the tuner: its little signal is the big signal laid exactly on its screen; the letter and the light sit clear of it", () => {
  const s = TUNER.signalArea;
  assert.ok(fits(onTuner(), STRIP, s), 'the strip maps onto the signal area');
  const sc = TUNER.screen;
  assert.ok(inside(sc, s.x, s.y) && inside(sc, s.x + s.w, s.y + s.h), 'the signal is on the screen');
  assert.ok(inside(sc, TUNER.letter.x, TUNER.letter.y) && TUNER.letter.y > s.y + s.h + 12, 'the letter is under the signal');
  const bd = TUNER.body;
  assert.ok(inside(bd, sc.x, sc.y) && inside(bd, sc.x + sc.w, sc.y + sc.h) && inside(bd, TUNER.light.cx, TUNER.light.cy) && TUNER.light.cy > sc.y + sc.h);
  assert.ok(TUNER.clip.y <= TUNER.scroll.cy + TUNER.scroll.r && TUNER.clip.y + TUNER.clip.h >= bd.y, 'clipped to the scroll, holding the tuner');
});

test('3. the four bars are exactly the A note\'s tones and the signal is their sum; dragging sets one bar; one bar is a tuning fork', () => {
  A_NOTE.forEach((a) => assert.equal(barHeight(a), a * SPECTRUM.unit));
  const whole = ys(signal(A_NOTE));
  const parts = A_NOTE.map((_, k) => ys(signal(part(A_NOTE, k))));
  const mid = STRIP.y + STRIP.h / 2;
  whole.forEach((y, i) => assert.ok(Math.abs((y - mid) - parts.reduce((s, p) => s + (p[i] - mid), 0)) < 0.25, 'every bump comes from a bar'));
  for (const y of whole) assert.ok(y > STRIP.y && y < STRIP.y + STRIP.h);
  for (let k = 0; k < SPECTRUM.slots; k++) {
    assert.equal(barAt(barX(k)), k);
    assert.equal(barAt(barX(k) - SPECTRUM.barW / 2 + 1), k);
    assert.equal(barAt(barX(k) + SPECTRUM.barW / 2 - 1), k);
  }
  assert.ok(barAt(-100) === 0 && barAt(10000) === SPECTRUM.slots - 1);
  for (let v = 0; v <= STEPS; v++) assert.equal(stepsAt(SPECTRUM.base - barHeight(v)), v);
  assert.ok(stepsAt(SPECTRUM.base + 40) === 0 && stepsAt(0) === STEPS);
  assert.ok(pureTone([3, 0, 0, 0]) && pureTone([0, 0, 2, 0]) && !pureTone(A_NOTE) && !pureTone([0, 0, 0, 0]));
  assert.ok(allBack(A_NOTE) && allBack([1, 1, 1, 1]) && !allBack([3, 1, 0, 1]));
  for (const x of [0.07, 0.31, 0.62]) assert.ok(Math.abs(wave([3, 0, 0, 0], x) - Math.sin(2 * Math.PI * x)) < 1e-12, 'one bar: a smooth wave');
  const g = triangle(GLYPH);
  assert.ok(g[0].y > STRIP_BOX.y + STRIP_BOX.h && g[1].y < SPECTRUM.base - barHeight(STEPS), 'the little prism sits between the signal and the bars');
  assert.equal(NOTE_LED.length, 4);
});

test('4. the scanner: every pixel of your head is exactly one body part, and each part behaves differently; the three parts stand left to right', () => {
  const rows = coarseRows();
  const count = BODY_PARTS.map(() => 0);
  for (const row of rows) for (const v of row) {
    if (v === 0) { assert.equal(partOf(v), -1, 'outside the head: no body part'); continue; }
    const k = partOf(v);
    assert.ok(k >= 0, `brightness ${v} belongs to a body part`);
    assert.equal(BODY_PARTS.filter((b) => b.values.some((w) => Math.abs(w - v) < 1e-9)).length, 1, 'exactly one');
    count[k]++;
  }
  assert.ok(count.every((c) => c > 50), 'every body part is big enough to tap');
  assert.equal(BODY_PARTS.length, COPY.bodyParts.length, 'a name for each');
  const { head, data, picture, arrows, glyph, label } = MRI;
  const cell = head.size / ROWS;
  rows.forEach((row, j) => row.forEach((v, i) => assert.equal(partAt({ x: head.x + (i + 0.5) * cell, y: head.y + (j + 0.5) * cell }, rows), partOf(v), 'tapping a pixel finds its part')));
  assert.ok(partAt({ x: head.x - 5, y: head.y + 20 }) === -1 && partAt({ x: head.x + 2, y: head.y + 2 }) === -1, 'off the head: nothing');
  const ends = (d) => { const y = ys(d); const mid = STRIP.y + STRIP.h / 2; const a = (from, to) => Math.max(...y.slice(from, to).map((v) => Math.abs(v - mid))); return [a(0, 40), a(y.length - 40, y.length)]; };
  BODY_PARTS.forEach((b, k) => {
    assert.ok(same(strength(k), b.values.reduce((s, v) => s + v, 0) / b.values.length), 'as strong as the part is bright');
    for (const y of ys(partWave(k))) assert.ok(y > STRIP.y && y < STRIP.y + STRIP.h, 'inside the data box');
    const [start, end] = ends(partWave(k));
    assert.ok(end < start, 'every signal fades');
  });
  const bone = 1, fluid = 2, white = 4;
  assert.ok(strength(bone) < strength(fluid) + 0.05 && strength(white) > strength(bone), 'bone sends almost nothing');
  assert.equal(Math.max(...BODY_PARTS.map((b) => b.fade)), BODY_PARTS[fluid].fade, 'fluid fades slowest');
  assert.equal(Math.min(...BODY_PARTS.map((b) => b.fade)), BODY_PARTS[bone].fade, 'bone fades fastest');
  assert.ok(head.x + head.size < arrows[0].x1 && arrows[0].x2 < data.x && data.x + data.w <= arrows[1].x1 && arrows[1].x2 < picture.x && picture.x + picture.size < BOARD.w, 'body parts → data → picture, left to right');
  assert.ok(arrows.every((a) => a.y > data.y && a.y < data.y + data.h), 'the arrows run through the data box');
  assert.ok(triangle(glyph)[1].y < arrows[1].y && glyph.cx > arrows[1].x1 && glyph.cx < arrows[1].x2, 'the little prism sits over the second arrow');
  assert.ok(label.y > head.y + head.size + 10 && label.y < BOARD.h && same(label.x, head.x + head.size / 2), 'the part\'s name, under the head');
  for (const b of [{ x: head.x, y: head.y, w: head.size, h: head.size }, data, { x: picture.x, y: picture.y, w: picture.size, h: picture.size }]) assert.ok(inside({ x: 0, y: 0, w: BOARD.w, h: BOARD.h }, b.x, b.y) && inside({ x: 0, y: 0, w: BOARD.w, h: BOARD.h }, b.x + b.w, b.y + b.h));
  assert.ok(fits(toSignal(), STRIP_BOX, data), "the violin's signal box becomes the data box");
  const E = EXPLORE;
  const sq = (b) => ({ x: b.x, y: b.y, w: b.size, h: b.size });
  assert.ok(fits(exploreHead(), sq(MRI.head), sq(E.head)) && same(exploreHead().sx, exploreHead().sy) && exploreHead().sx > 1.4, 'while you tap, the same head, bigger');
  assert.ok(fits(exploreData(), STRIP_BOX, E.data) && E.head.x + E.head.size < E.data.x && E.data.x + E.data.w < BOARD.w && E.head.y + E.head.size < BOARD.h, 'the data box to its right, all on the board');
  const L = labels(rows);
  assert.equal(L.length, BODY_PARTS.length);
  const ec = E.head.size / ROWS;
  L.forEach((l) => {
    assert.equal(partOf(rows[l.j][l.i]), l.k, `the ${COPY.bodyParts[l.k]} label points at the ${COPY.bodyParts[l.k]}`);
    assert.ok(same(l.anchor.x, E.head.x + (l.i + 0.5) * ec) && same(l.anchor.y, E.head.y + (l.j + 0.5) * ec), 'at that pixel, on the big head');
    assert.ok(same(l.label.y, l.anchor.y) && l.label.x < E.head.x && l.label.x - 110 > 0, 'its name to the left, level with it: no lines cross');
  });
  const ysorted = L.map((l) => l.label.y).sort((a, b) => a - b);
  for (let n = 1; n < ysorted.length; n++) assert.ok(ysorted[n] - ysorted[n - 1] >= 30, 'names apart');
  assert.deepEqual(BRAIN.map((k) => COPY.bodyParts[k]), ['outer brain', 'inner brain']);
  assert.equal(COPY.bodyParts[SKULL], 'skull');
  assert.ok(strength(SKULL) < 0.35 * Math.min(...BRAIN.map(strength)), 'brain then skull: the skull\'s signal is less than a third of the brain\'s');
});

test('5. converting each row\'s data gives back every row of the picture exactly; rows are converted from the middle out; the data and the picture move into the pattern', () => {
  const rows = coarseRows();
  assert.equal(rows.length, ROWS);
  assert.equal(ROWS, 48, "Level 2's own size: no sharpening needed");
  rows.forEach((row, j) => {
    row.forEach((a, i) => assert.equal(a, scanPixel(((i + 0.5) / ROWS) * 2 - 1, ((j + 0.5) / ROWS) * 2 - 1), "Level 2's head"));
    const samples = chordSamples(row);
    assert.ok(samples.length > 2 * ROWS);
    unmix(samples, ROWS).forEach((a, i) => assert.ok(Math.abs(a - row[i]) < 1e-12, 'exact'));
    for (const y of ys(samplesPath(samples, STRIP))) assert.ok(y >= STRIP.y && y <= STRIP.y + STRIP.h);
  });
  const order = rowOrder(ROWS);
  assert.deepEqual([...order].sort((a, b) => a - b), Array.from({ length: ROWS }, (_, i) => i), 'every row, once');
  assert.ok(order[0] === FIRST_ROW && Math.abs(order[1] - FIRST_ROW) === 1 && Math.abs(order[2] - FIRST_ROW) === 1, 'from the middle out');
  assert.ok(rows[FIRST_ROW].some((a) => a > 0.5), 'the first row read crosses the head');
  for (const box of [MRI.head, MRI.picture]) assert.ok(same(rowIn(box, ROWS - 1).y + rowIn(box, ROWS - 1).h, box.y + box.size) && same(rowIn(box, 0).y, box.y), 'rows fill the box');
  rows.forEach((row, j) => row.forEach((a, i) => {
    const u = ((i + 0.5) / ROWS) * 2 - 1;
    const v = ((j + 0.5) / ROWS) * 2 - 1;
    if ((u / 0.8) ** 2 + (v / 0.95) ** 2 > 1) assert.equal(a, 0, 'nothing of you outside your head');
  }));
  assert.ok(fits(stripToPattern(), STRIP_BOX, patternBox(2, 'left')) && fits(picToPattern(), PIC_FRAME, patternBox(2, 'right')), 'the signal and the image move exactly into the third row');
  assert.ok(same(picToPattern().sx, picToPattern().sy) && same(PIC_FRAME.x, MRI.picture.x - 4), 'the image keeps its shape');
  const B = { x: 0, y: 0, w: BOARD.w, h: BOARD.h };
  for (let i = 0; i < 3; i++) for (const side of ['left', 'right']) {
    const b = patternBox(i, side);
    assert.ok(inside(B, b.x, b.y) && inside(B, b.x + b.w, b.y + b.h), 'the pattern fits the board');
    if (i) assert.ok(b.y > patternBox(i - 1, side).y + PATTERN.h, 'rows apart');
  }
  const r0 = patternBox(0, 'right');
  patternBars().forEach((b, k) => assert.ok(same(b.h / (r0.h - 8), A_NOTE[k] / STEPS) && same(b.y + b.h, r0.y + r0.h) && inside(r0, b.x, b.y) && inside(r0, b.x + b.w, b.y), "the A note's four bars"));
  const pl = patternLight();
  const [pt, , pleft] = pl.corners;
  assert.ok(same(pl.beam.to.x, (pt.x + pleft.x) / 2) && same(pl.beam.to.y, (pt.y + pleft.y) / 2) && inside(patternBox(1, 'left'), pl.beam.from.x, pl.beam.from.y), 'a white beam into the prism');
  pl.rays.forEach((r, i) => { assert.equal(r.color, RAINBOW[i]); assert.ok(inside(patternBox(1, 'right'), r.to.x, r.to.y)); });
});

test("6. the break and the faces: you and the radiologist stand apart on the floor, clear of the prism; yours (bucket hat, dark hair, yellow shirt) and the radiologist's (copper hair, blue shirt, white coat) are well formed", () => {
  const F = FACE;
  const H = F.head;
  const inHead = (x, y) => ((x - H.cx) / H.rx) ** 2 + ((y - H.cy) / H.ry) ** 2 <= 1;
  for (const e of F.eyes) {
    assert.ok(inHead(e.cx - F.rimR, e.cy) && inHead(e.cx + F.rimR, e.cy), 'the glasses sit on the face');
    assert.ok(F.rimR > F.eyeR, 'each eye inside its lens');
    for (const t of [{ x: e.cx, y: -500 }, { x: 900, y: e.cy }, { x: -40, y: 300 }, { x: e.cx + 1, y: e.cy }, { x: e.cx, y: e.cy }]) {
      const p = lookAt(e, t);
      assert.ok(Math.hypot(p.x - e.cx, p.y - e.cy) + F.pupilR <= F.eyeR - 1 + 1e-9, 'the pupil stays in the eye');
    }
    const up = lookAt(e, { x: e.cx, y: -500 });
    assert.ok(up.y < e.cy && same(up.x, e.cx), 'looking up, at the board');
  }
  assert.ok(F.eyes[1].cx - F.eyes[0].cx > 2 * F.rimR, 'two lenses and a bridge');
  F.brows.forEach((b, i) => assert.ok(Math.max(b.y1, b.y2) < F.eyes[i].cy - F.rimR, 'brows above the glasses'));
  assert.ok(F.mouth.y > F.eyes[0].cy + F.rimR && inHead(F.mouth.x1, F.mouth.y) && inHead(F.mouth.x2, F.mouth.y), 'mouth below them');
  assert.ok(F.ears.every((e, i) => (i ? e.cx > H.cx + H.rx - e.rx : e.cx < H.cx - H.rx + e.rx)), 'an ear on each side');
  assert.ok(/^#ff[cd]/i.test(PLAYER.shirt) && PLAYER.hair === '#2a2a2a', "you: dark hair and a yellow shirt, as in Nadia's picture");
  assert.ok(RADIOLOGIST.hair === '#b5602c' && RADIOLOGIST.shirt === '#4f8fe8', 'the radiologist: copper hair and a blue shirt (swapped in Revision 5)');
  assert.match(hairPath(), /^M [\d.]+ [\d.]+ C .* Z$/);
  assert.match(shirtPath(), / Z$/);
  assert.ok(F.neck.y < H.cy + H.ry && F.neck.y + F.neck.h > F.view.h - 28, 'a neck from head to shirt');
  const hat = bucketHat();
  const curveTop = (a, c) => 0.25 * a + 0.75 * c;              // the top of a symmetric cubic from height a with controls at height c
  assert.ok(curveTop(hat.base, hat.top) < curveTop(H.cy - 4, H.cy - H.ry - 20), 'the crown covers the hair');
  assert.ok(hat.wide > H.rx, 'the brim reaches past the head');
  assert.ok(hat.base + 10 <= Math.min(...F.brows.map((b) => Math.min(b.y1, b.y2))), 'the brim stays above the brows');
  assert.ok(PLAYER.hair !== RADIOLOGIST.hair && PLAYER.shirt !== RADIOLOGIST.shirt, 'two people, told apart');
  assert.match(main, /faceParts\(who, look\)/, 'one face for both');
  for (const d of coatLapels()) assert.match(d, /^M [\d.]+ [\d.]+ C .* Z$/, 'the radiologist\'s coat lapels');
  const you = figureBox(BREAK.you);
  const rad = figureBox(BREAK.radiologist);
  for (const b of [you, rad]) assert.ok(same(b.y + b.h, HALL.floor) && b.x > 0 && b.x + b.w < BOARD.w && same(b.w / b.h, FIGURE.view.w / FIGURE.view.h), 'standing on the floor, on the board');
  assert.ok(you.x + you.w < rad.x, 'you on the left, the radiologist on the right');
  const [, cr] = crystalCorners();
  const headLeft = rad.x + (rad.w * (FACE.head.cx - FACE.head.rx - 8)) / FIGURE.view.w;
  assert.ok(headLeft > cr.x, "the radiologist's head is clear of the hanging prism");
  assert.ok(BREAK.walkFrom > 0 && rad.x + BREAK.walkFrom > BOARD.w - 40, 'the radiologist walks in from the right');
  for (const l of FIGURE.legs) assert.ok(same(l.y + l.h, FIGURE.view.h) && l.y < FIGURE.torso.y + FIGURE.torso.h, 'legs from the body to the floor');
  assert.ok(FIGURE.torso.y < FACE.view.h && FIGURE.coat.every((c) => c.y + c.h > FIGURE.torso.y + FIGURE.torso.h), 'the body under the face; the coat longer than the shirt');
});

test('7. the copy is verbatim from the Revision 7 list and in order: the radiologist at the break, the people gone before the paragraph, the brain then the skull, the paragraph one part at a time', () => {
  const R = (s) => `Radiologist: ${s}`;
  const ordered = [COPY.opening, COPY.dim, COPY.aim, COPY.aimHint, COPY.where.question, ...COPY.where.choices, COPY.where.after,
    `You (thinking): ${COPY.you.think}`, COPY.surprise, `[${COPY.play}]`, `${COPY.tunerLetter} (the letter`, COPY.drawsSignal, COPY.see.question,
    ...COPY.see.choices, COPY.see.after, `[${COPY.apart}]`, COPY.split, COPY.notes.join(', '), COPY.pure, COPY.pureHint, COPY.pureDone, COPY.back,
    COPY.backDone, COPY.arrives, `You: ${COPY.you.tookApart}`, R(COPY.radiologist.same), COPY.tapBrain, COPY.bodyParts.join(', '), COPY.tapSkull,
    `28. ${COPY.mri[0].text.trim()}`, `[${COPY.collect}]`, `30. ${COPY.mri[1].text.trim()}`, `[${COPY.convert}]`, `32. ${COPY.mri[2].text.trim()}`,
    `33. ${COPY.mri[3].text.trim()}`, R(COPY.radiologist.pattern.question), ...COPY.radiologist.pattern.choices, R(COPY.radiologist.pattern.after),
    ...COPY.pattern, ...COPY.name, COPY.final];
  let at = 0;
  for (const l of ordered) {
    const i = copyList.indexOf(l, at);
    assert.ok(i >= 0, `not in the Revision 7 list, in order: ${l}`);
    at = i + 1;
  }
  assert.ok(copyList.includes(`41. ${COPY.final}\n\nNothing comes after line 41.`) && !/^42\. /m.test(copyList), 'the final line is last');
  assert.ok(rev7.includes('put the technician as radiologist') && rev7.includes('introduce one sentnece at a time and then the preceding sentence becomes gray'), "Nadia's Revision 7 message, verbatim");
  assert.equal(COPY.mri.map((f) => f.text).join(''), "Each tiny magnet behaves differently depending on which body part it's in. Collecting that data and converting it into pixel data helps us see an MRI picture, with the Fourier transform.", "Nadia's wording");
  assert.deepEqual(COPY.mri.map((f) => f.step), [0, 1, 2, 3], 'shown in reading order, one part at a time');
  assert.match(COPY.arrives, /radiologist/);
  assert.ok(!/technician/i.test(JSON.stringify(COPY)), 'a radiologist now, not a technician');
  assert.ok(/brain/.test(COPY.tapBrain) && /skull/.test(COPY.tapSkull), 'it says exactly where to tap');
  assert.equal(COPY.you.think, 'If a prism is a tool that can take apart light, is there a tool that can take apart a sound?', "the thought is Nadia's sentence");
  assert.ok(/pure tones/.test(COPY.pattern[0]) && /full color spectrum/.test(COPY.pattern[1]) && /^Proton frequencies → image$/.test(COPY.pattern[2]), "Nadia's pattern");
  const scannerPart = JSON.stringify(COPY.radiologist) + COPY.mri.map((f) => f.text).join('') + COPY.tapBrain + COPY.tapSkull + COPY.collect + COPY.convert;
  assert.ok(!/note|tone|music|sound|hear|flip|spin|most of you|paint/i.test(scannerPart), 'the scanner part: no flipping or spinning, no music');
  assert.ok(!/MAGNETS|spinning\(/.test(main), 'no magnets drawn');
  const all = JSON.stringify(COPY);
  assert.ok(!/squiggle|glasses|very helpful|terrible|nobody's watching|could take a while/i.test(all), 'no glasses, no squiggle, no sarcasm');
  const texts = ordered.map((l) => l.replace(/^(Radiologist|You|You \(thinking\)): /, '').replace(/^\d+\. /, '').replace(/^\[|\]$/g, ''));
  for (const l of texts) assert.ok(l.split(/(?<=[.?!…])\s+(?=[A-Z])/).length <= 2, `at most two sentences: ${l}`);
  assert.ok(!/coefficient|sine|cosine|energy|equation|integral|gradient|larmor/i.test(all), "no jargon beyond Nadia's own words");
  assert.ok(level3.includes('Here is the mathematical tool that lets us start seeing it.'), "Nadia's goal sentence");
  for (const s of [LEVELS.level3, LEVELS.next3]) assert.ok(spec.includes(s));
  const calls = ['COPY.opening', 'COPY.dim', 'COPY.aim', 'COPY.aimHint', 'COPY.where.question', 'COPY.where.after', 'COPY.you.think', 'COPY.surprise',
    'COPY.play', 'COPY.drawsSignal', 'COPY.see.question', 'COPY.see.after', 'COPY.apart', 'COPY.split', 'COPY.pure', 'COPY.pureHint', 'COPY.pureDone',
    'COPY.back', 'COPY.backDone', 'COPY.arrives', 'COPY.you.tookApart', 'COPY.radiologist.same', 'COPY.tapBrain', 'COPY.tapSkull', 'COPY.collect',
    'COPY.convert', 'COPY.radiologist.pattern.question', 'COPY.radiologist.pattern.after', 'COPY.pattern', 'COPY.name[0]', 'COPY.name[1]', 'COPY.final'];
  const story = main.indexOf('// ── the story');
  const at1 = (c) => { const i = main.slice(story).search(new RegExp(`${c.replace(/[.[\]]/g, '\\$&')}(?![\\w.])`)); return i < 0 ? -1 : story + i; };
  const pos = calls.map(at1);
  assert.ok(pos.every((i) => i >= story), JSON.stringify(calls.filter((c, k) => pos[k] < story)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  const brain = main.slice(main.indexOf('async function theBrain()'), main.indexOf('async function thePattern()'));
  const idx = (t) => brain.indexOf(t);
  assert.ok(idx('await clear();') < idx('on(scan);'), 'the people and their bubbles go before your head comes back up');
  assert.ok(idx('say(COPY.tapBrain)') < idx('say(COPY.tapSkull)') && idx('say(COPY.tapSkull)') < brain.lastIndexOf('await clear();', idx('sentence()')) && brain.lastIndexOf('await clear();', idx('sentence()')) < idx('sentence()'), 'brain, then skull, then the words clear for the paragraph');
  assert.ok(idx('show(0)') < idx('press(COPY.collect)') && idx('press(COPY.collect)') < idx('show(1)') && idx('show(1)') < idx('press(COPY.convert)') && idx('press(COPY.convert)') < idx('show(2)') && idx('show(2)') < idx('for (const j of rowOrder(ROWS))') && idx('for (const j of rowOrder(ROWS))') < idx('show(3)'), 'one part at a time, as each happens');
  assert.match(main, /else if \(f\.step < step\) spans\[i\]\.classList\.add\('past'\)/, 'the earlier parts turn grey');
  assert.match(css, /\.mri-sentence \.frag\.past \{ color: var\(--ink-3\); \}/);
  const brk = main.slice(main.indexOf('async function theRadiologist()'), main.indexOf('async function theBrain()'));
  assert.ok(brk.indexOf('on(breakScene)') < brk.indexOf('say(COPY.arrives)') && brk.indexOf('say(COPY.arrives)') < brk.indexOf("radiologistFigure.style.transform = 'none'"), 'the break is painted, and the radiologist walks over as the line says so');
  for (const c of ['same', 'pattern.question', 'pattern.after']) assert.match(main, new RegExp(`speak\\(COPY\\.radiologist\\.${c.replace('.', '\\.')}\\)`), `the radiologist says ${c}`);
  assert.match(main, /speak\(COPY\.you\.think, 'you', true\)/, 'your thought, in a thought bubble');
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|speak\(|ask\(|press\(/.test(tail.replace("say(COPY.final, 'final');", '')), 'nothing is shown after the final line');
});

test("8. the frame: sound after a tap, the dark comes with the dimmed lights, reduced motion, Level 3 after Level 2, and the app's own Fourier math untouched", () => {
  assert.equal((main.match(/new AC\(\)/g) ?? []).length, 1, 'one place makes the audio context');
  const story = main.slice(main.indexOf('// ── the story'));
  assert.ok(story.indexOf('await press(COPY.play)') < story.indexOf('await play(A_NOTE'), 'the first sound waits for a tap');
  assert.ok(story.indexOf("board.classList.add('night')") > story.indexOf('say(COPY.opening') && story.indexOf("board.classList.add('night')") < story.indexOf('say(COPY.dim)'), 'the board goes dark as the lights dim');
  assert.match(css, /\.night \.bg \{ fill: var\(--night\); \}/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(main, /await pause\(REDUCED \? 0 : j === FIRST_ROW \? 500 : 45\)/, 'reduced motion: the pixels appear at once');
  assert.match(main, /g\.setAttribute\('tabindex', '0'\)/, 'the body parts can be chosen with the keyboard too');
  assert.match(css, /\.strip \{ transform-box: view-box; transform-origin: 0 0;/, 'the signal moves as one piece');
  assert.match(css, /\.mri-image \{ transform-box: view-box; transform-origin: 0 0;/, 'so does the image');
  assert.match(main, /from '\.\.\/math\/prism\.js'/);
  assert.match(read('src/levels/page.js'), /chain\('mri-lesson', 'next-level-3', LEVELS\.next3, 'level-3', \(\) => import\('\.\/prism\.js'\)\)/, 'Level 3 opens when Level 2 ends');
  assert.match(read('try/index.html'), /id="prism-lesson"/);
  for (const name of ['basisValue', 'basisInner', 'basisGram']) assert.equal(typeof appFourier[name], 'function', `the app's fourier.js still has ${name}`);
});
