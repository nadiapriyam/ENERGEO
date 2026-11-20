// Level 3, "A prism for sound", at try/ (docs/levels_spec.md, Level 3 Revision 4). Guards:
// - the hall: the stage light misses at first, is caught when aimed anywhere at the chandelier, goes into the prism's
//   near face, and the colours leave in a real prism's order (red bent least, violet most);
// - the tuner's little signal is the big signal, laid exactly on its screen;
// - the four bars are exactly the A note's tones; dragging sets one bar; one bar is a pure tone;
// - the scanner: each spot its own frequency once the right side is stronger; taking the signal apart (an exact
//   Fourier transform) gives back every row of the picture; each bar stands under its spot; the row goes back where it
//   came from; the signal and the picture move exactly into the pattern's third row;
// - the faces are well formed (the technician's and yours, with its bucket hat), and the eyes never leave their sockets;
// - the copy is verbatim and in order, with Nadia's sentence for the thought and her pattern, no music in the scanner
//   part, and Fourier named once at the end;
// - the frame: sound after a tap, reduced motion, Level 3 after Level 2, and the app's own Fourier math untouched.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BOARD, fit, triangle, HALL, RAINBOW, BEND, crystalCorners, nearFace, aimAngle, toCrystal, startAngle, edge, lightPath,
  STRIP, STRIP_BOX, signal, samplesPath, TUNER, onTuner, SPECTRUM, GLYPH, barX, barHeight, barAt, stepsAt, pureTone, allBack,
  NOTE_LED, neon, ROWS, BASE_HZ, spotHz, RATE, spinRate, coarseRows, sharpRows, chordSamples, unmix, tallest, rowOrder, HAND_ROW,
  REPLY_BOX, toReply, GLYPH2, PIC, cell, headOutline, rowBand, BENCH, spotX, ROW_BOX, benchToRow, spotAt, WEDGE, wedge,
  SPOT_BARS, spotBarHeight, FACE, hairPath, shirtPath, lookAt, PLAYER, bucketHat, beamHeightAt,
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
const rev4 = level3.slice(level3.indexOf('### Revision 4'));
const copyList = rev4.slice(rev4.indexOf('#### Level 3 learner copy (Revision 4)'), rev4.indexOf('#### What the new lines claim'));
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

test('4. the scanner: an even magnet gives every spot the same frequency; the stronger right side gives each its own, in step with how fast it spins', () => {
  for (let k = 0; k < ROWS; k++) {
    assert.equal(spinRate(k, false), RATE, 'even magnet: every spot alike');
    assert.ok(same(spinRate(k, true) / RATE, spotHz(k) / BASE_HZ), 'spin and note keep step');
    if (k) assert.ok(spinRate(k, true) > spinRate(k - 1, true) && spotHz(k) > spotHz(k - 1), 'further right: faster, higher');
  }
  assert.equal(spinRate(0, true), spinRate(0, false), 'the leftmost spot is where the stronger side starts from');
  const w = wedge();
  assert.ok(w[2].y - w[1].y > w[3].y - w[0].y && same(w[0].x, ROW_BOX.x) && same(w[1].x, ROW_BOX.x + ROW_BOX.w), 'the wedge: thin left, thick right, under the whole row');
  assert.ok(WEDGE.y - WEDGE.thick / 2 > BENCH.y + BENCH.r && WEDGE.y + WEDGE.thick / 2 < SPOT_BARS.base - SPOT_BARS.full, 'between the spots and the bars');
  const row = coarseRows()[HAND_ROW];
  assert.ok(row[0] === 0 && row.at(-1) === 0 && Math.max(...row) > 0.5, 'the row crosses your head: empty at the ends, a lot of you in between');
  assert.deepEqual(tallest(unmix(chordSamples(row), ROWS)), [4, 5, 6, 9, 10, 11], 'the tallest bars');
});

test('5. taking the signal apart gives back every row exactly; each bar stands under its spot; the row goes back where it came from; the signal and the picture move into the pattern', () => {
  const rows = coarseRows();
  assert.equal(rows.length, ROWS);
  rows.forEach((row, j) => {
    row.forEach((a, i) => assert.equal(a, scanPixel(((i + 0.5) / ROWS) * 2 - 1, ((j + 0.5) / ROWS) * 2 - 1), "Level 2's head, at 16 spots a side"));
    const samples = chordSamples(row);
    assert.ok(samples.length > 2 * ROWS);
    unmix(samples, ROWS).forEach((a, i) => assert.ok(Math.abs(a - row[i]) < 1e-12, 'exact'));
    for (const y of ys(samplesPath(samples, STRIP))) assert.ok(y >= STRIP.y && y <= STRIP.y + STRIP.h);
  });
  for (let k = 0; k < ROWS; k++) {
    assert.equal(spotAt(spotX(k)), k);
    assert.ok(inside({ x: 0, y: 0, w: BOARD.w, h: BOARD.h }, spotX(k) - BENCH.r, SPOT_BARS.base - spotBarHeight(1)), 'spots and bars on the board');
  }
  assert.equal(spotBarHeight(-0.01), 0);
  assert.ok(BENCH.step > 2 * BENCH.r && SPOT_BARS.w < BENCH.step, 'spots and bars apart');
  for (const j of [0, HAND_ROW, ROWS - 1]) assert.ok(fits(benchToRow(j), ROW_BOX, rowBand(j)), 'the row slides back into its own place');
  assert.ok(same(rowBand(ROWS - 1).y + cell(), PIC.y + PIC.size));
  const order = rowOrder(ROWS);
  assert.deepEqual([...order].sort((a, b) => a - b), Array.from({ length: ROWS }, (_, i) => i), 'every row, once');
  assert.ok(order[0] === HAND_ROW && Math.abs(order[1] - HAND_ROW) === 1 && Math.abs(order[2] - HAND_ROW) === 1, 'the row by hand first, then its neighbours');
  const O = headOutline();
  rows.forEach((row, j) => row.forEach((a, i) => {
    const x = PIC.x + (i + 0.5) * cell();
    const y = PIC.y + (j + 0.5) * cell();
    if (((x - O.cx) / O.rx) ** 2 + ((y - O.cy) / O.ry) ** 2 > 1) assert.equal(a, 0, 'nothing of you outside your head');
  }));
  assert.ok(fits(toReply(), STRIP_BOX, REPLY_BOX), "the violin's signal box becomes the scanner's");
  assert.ok(REPLY_BOX.y + REPLY_BOX.h < triangle(GLYPH2)[0].y && triangle(GLYPH2)[1].y < BENCH.y - BENCH.r && REPLY_BOX.y + REPLY_BOX.h < PIC.y, 'signal, prism, spots: top to bottom');
  assert.equal(sharpRows().length, 48, "the sharp picture is Level 2's own");
  assert.ok(fits(stripToPattern(), STRIP_BOX, patternBox(2, 'left')) && fits(picToPattern(), PIC_FRAME, patternBox(2, 'right')), 'the signal and the picture move exactly into the third row');
  assert.ok(same(picToPattern().sx, picToPattern().sy), 'the picture keeps its shape');
  const B = { x: 0, y: 0, w: BOARD.w, h: BOARD.h };
  for (let i = 0; i < 3; i++) for (const side of ['left', 'right']) {
    const b = patternBox(i, side);
    assert.ok(inside(B, b.x, b.y) && inside(B, b.x + b.w, b.y + b.h), 'the pattern fits the board');
    if (i) assert.ok(b.y > patternBox(i - 1, side).y + PATTERN.h, 'rows apart');
  }
  assert.ok(patternBox(0, 'left').x + patternBox(0, 'left').w < PATTERN.arrow.x1 && PATTERN.arrow.x2 < patternBox(0, 'right').x, 'left → right');
  const r0 = patternBox(0, 'right');
  patternBars().forEach((b, k) => assert.ok(same(b.h / (r0.h - 8), A_NOTE[k] / STEPS) && same(b.y + b.h, r0.y + r0.h) && inside(r0, b.x, b.y) && inside(r0, b.x + b.w, b.y), 'the A note\'s four bars'));
  const pl = patternLight();
  const [pt, pr, pleft] = pl.corners;
  assert.ok(same(pl.beam.to.x, (pt.x + pleft.x) / 2) && same(pl.beam.to.y, (pt.y + pleft.y) / 2) && inside(patternBox(1, 'left'), pl.beam.from.x, pl.beam.from.y), 'a white beam into the prism');
  pl.rays.forEach((r, i) => { assert.equal(r.color, RAINBOW[i]); assert.ok(inside(patternBox(1, 'right'), r.to.x, r.to.y)); });
  assert.ok(inside(patternBox(1, 'left'), pr.x, pr.y) && inside(patternBox(1, 'left'), pleft.x, pleft.y) && inside(patternBox(1, 'left'), pt.x, pt.y));
});

test("6. the faces: the technician's and yours (same face, other hair, a bucket hat) are well formed, and the pupils stay inside the eyes", () => {
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
  assert.match(F.shirt, /^#ff[cd]/i, 'a yellow shirt');
  assert.match(hairPath(), /^M [\d.]+ [\d.]+ C .* Z$/);
  assert.match(shirtPath(), / Z$/);
  assert.ok(F.neck.y < H.cy + H.ry && F.neck.y + F.neck.h > F.view.h - 28, 'a neck from head to shirt');
  const hat = bucketHat();
  const curveTop = (a, c) => 0.25 * a + 0.75 * c;              // the top of a symmetric cubic from height a with controls at height c
  assert.ok(curveTop(hat.base, hat.top) < curveTop(H.cy - 4, H.cy - H.ry - 20), 'the crown covers the hair');
  assert.ok(hat.wide > H.rx, 'the brim reaches past the head');
  assert.ok(hat.base + 10 <= Math.min(...F.brows.map((b) => Math.min(b.y1, b.y2))), 'the brim stays above the brows');
  assert.ok(PLAYER.hair !== '#2a2a2a' && PLAYER.shirt !== F.shirt, 'you: other hair, other shirt');
  assert.match(main, /face\(who\)/, 'one face for both');
});

test('7. the copy is verbatim from the Revision 4 list and in order: the hall as Nadia told it, the player and the technician, her pattern; no music in the scanner part, Fourier once at the end', () => {
  const T = (s) => `Technician: ${s}`;
  const ordered = [COPY.opening, COPY.dim, COPY.aim, COPY.aimHint, COPY.where.question, ...COPY.where.choices, COPY.where.after,
    `You (thinking): ${COPY.you.think}`, COPY.surprise, `[${COPY.play}]`, `${COPY.tunerLetter} (the letter`, COPY.drawsSignal, COPY.see.question,
    ...COPY.see.choices, COPY.see.after, `[${COPY.apart}]`, COPY.split, COPY.notes.join(', '), COPY.pure, COPY.pureHint, COPY.pureDone, COPY.back,
    COPY.backDone, COPY.arrives, `You: ${COPY.you.tookApart}`, T(COPY.tech.same), T(COPY.tech.spin), `[${COPY.stronger}]`, T(COPY.tech.own),
    `[${COPY.listen}]`, T(COPY.tech.picks), `[${COPY.apart}]`, T(COPY.tech.bars), `[${COPY.makePicture}]`, T(COPY.tech.brighter), `[${COPY.nextRow}]`,
    T(COPY.tech.rows), T(COPY.tech.pattern.question), ...COPY.tech.pattern.choices, T(COPY.tech.pattern.after), ...COPY.pattern, ...COPY.name, COPY.final];
  let at = 0;
  for (const l of ordered) {
    const i = copyList.indexOf(l, at);
    assert.ok(i >= 0, `not in the Revision 4 list, in order: ${l}`);
    at = i + 1;
  }
  assert.ok(copyList.includes(`43. ${COPY.final}\n\nNothing comes after line 43.`) && !/^44\. /m.test(copyList), 'the final line is last');
  assert.ok(rev4.includes('if a prisim is a tool that can take a part light then is there a tool that can take apart a sound') && rev4.includes('all using a geometric math/formula to get there'), "Nadia's Revision 4 message, verbatim");
  assert.equal(COPY.you.think, 'If a prism is a tool that can take apart light, is there a tool that can take apart a sound?', "the thought is Nadia's sentence");
  assert.match(COPY.aim, /chandelier/, 'aim at the chandelier');
  assert.ok(!/prism/i.test(COPY.dim + COPY.aim + COPY.aimHint + COPY.where.question + COPY.where.choices.join(' ')), 'the prism is not named before the colours appear');
  assert.deepEqual(COPY.pattern.map((p) => p.split(' → ').length), [2, 2, 2], 'three rows: one thing → what it is made of');
  assert.ok(/pure tones/.test(COPY.pattern[0]) && /full color spectrum/.test(COPY.pattern[1]) && /^Proton frequencies → image$/.test(COPY.pattern[2]), "Nadia's pattern");
  assert.match(COPY.name[0], /geometric math/);
  const scannerPart = JSON.stringify(COPY.tech) + COPY.stronger + COPY.listen + COPY.makePicture + COPY.nextRow;
  assert.ok(!/note|tone|music|sound|hear|most of you|paint/i.test(scannerPart), 'the scanner part: no music, no "most of you", no painting rule');
  assert.ok(COPY.tech.own.indexOf('frequency') > 0 && ordered.indexOf(T(COPY.tech.own)) < ordered.indexOf(COPY.pattern[2]), '"frequency" is introduced before the pattern uses it');
  const all = JSON.stringify(COPY);
  assert.ok(!/squiggle|glasses|very helpful|terrible|nobody's watching|could take a while/i.test(all), 'no glasses, no squiggle, no sarcasm');
  assert.match(COPY.opening, /After your scan/, 'the story picks up from Level 2');
  const texts = ordered.map((l) => l.replace(/^(Technician|You|You \(thinking\)): /, '').replace(/^\[|\]$/g, ''));
  for (const l of texts) assert.ok(l.split(/(?<=[.?!…])\s+(?=[A-Z])/).length <= 2, `at most two sentences: ${l}`);
  const lines = ordered.filter((l) => !/^\[/.test(l));
  const first = lines.findIndex((l) => /Fourier/.test(l));
  assert.ok(lines[first] === COPY.name[0] && first === lines.length - 3, "Fourier's name, once, at the end");
  assert.ok(!/coefficient|sine|cosine|energy|equation|integral|gradient|larmor/i.test(all), 'no jargon beyond Nadia\'s own words');
  assert.ok(level3.includes('Here is the mathematical tool that lets us start seeing it.'), "Nadia's goal sentence");
  for (const s of [LEVELS.level3, LEVELS.next3]) assert.ok(spec.includes(s));
  const calls = ['COPY.opening', 'COPY.dim', 'COPY.aim', 'COPY.aimHint', 'COPY.where.question', 'COPY.where.after', 'COPY.you.think', 'COPY.surprise',
    'COPY.play', 'COPY.drawsSignal', 'COPY.see.question', 'COPY.see.after', 'COPY.apart', 'COPY.split', 'COPY.pure', 'COPY.pureHint', 'COPY.pureDone',
    'COPY.back', 'COPY.backDone', 'COPY.arrives', 'COPY.you.tookApart', 'COPY.tech.same', 'COPY.tech.spin', 'COPY.stronger', 'COPY.tech.own', 'COPY.listen',
    'COPY.tech.picks', 'COPY.tech.bars', 'COPY.makePicture', 'COPY.tech.brighter', 'COPY.nextRow', 'COPY.tech.rows', 'COPY.tech.pattern.question',
    'COPY.tech.pattern.after', 'COPY.pattern', 'COPY.name[0]', 'COPY.name[1]', 'COPY.final'];
  const story = main.indexOf('// ── the story');
  const at1 = (c) => { const i = main.slice(story).search(new RegExp(`${c.replace(/[.[\]]/g, '\\$&')}(?![\\w.])`)); return i < 0 ? -1 : story + i; };
  const pos = calls.map(at1);
  assert.ok(pos.every((i) => i >= story), JSON.stringify(calls.filter((c, k) => pos[k] < story)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  for (const c of ['same', 'spin', 'own', 'picks', 'bars', 'brighter', 'rows', 'pattern.question', 'pattern.after']) assert.match(main, new RegExp(`speak\\(COPY\\.tech\\.${c.replace('.', '\\.')}\\)`), `the technician says ${c}`);
  assert.match(main, /speak\(COPY\.you\.think, 'you', true\)/, 'your thought, in a thought bubble');
  assert.match(main, /speak\(COPY\.you\.tookApart, 'you'\)/, 'and your words');
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
  assert.match(main, /if \(!v \|\| REDUCED\) return;/, 'no spinning with reduced motion');
  assert.match(css, /\.strip \{ transform-box: view-box; transform-origin: 0 0;/, 'the signal moves as one piece');
  assert.match(css, /\.scene\.bench \{ transform-box: view-box; transform-origin: 0 0;/, 'so does the row');
  assert.match(main, /from '\.\.\/math\/prism\.js'/);
  assert.match(read('src/levels/page.js'), /chain\('mri-lesson', 'next-level-3', LEVELS\.next3, 'level-3', \(\) => import\('\.\/prism\.js'\)\)/, 'Level 3 opens when Level 2 ends');
  assert.match(read('try/index.html'), /id="prism-lesson"/);
  for (const name of ['basisValue', 'basisInner', 'basisGram']) assert.equal(typeof appFourier[name], 'function', `the app's fourier.js still has ${name}`);
});
