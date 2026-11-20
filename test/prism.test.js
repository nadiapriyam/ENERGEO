// Level 3, "A prism for sound", at try/ (docs/levels_spec.md, Level 3 Revision 5). Guards:
// - the hall: the stage light misses at first, is caught when aimed anywhere at the chandelier, goes into the prism's
//   near face, and the colours leave in a real prism's order (red bent least, violet most);
// - the tuner's little signal is the big signal, laid exactly on its screen;
// - the four bars are exactly the A note's tones; dragging sets one bar; one bar is a pure tone;
// - the scanner: the magnets spin faster to the right, coloured like their frequency's bar; taking each row's signal
//   apart (an exact Fourier transform) gives back every row of the 48 × 48 image; the four parts stand left to right;
//   the signal and the image move exactly into the pattern's third row;
// - the faces are well formed (yours with its bucket hat, dark hair and yellow shirt; the technician's copper and
//   blue), and the eyes never leave their sockets;
// - the copy is verbatim and in order, with Nadia's sentences, each part of her scanner sentence lit by its step, no
//   music in the scanner part, and Fourier named once at the end;
// - the frame: sound after a tap, reduced motion, Level 3 after Level 2, and the app's own Fourier math untouched.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BOARD, fit, triangle, HALL, RAINBOW, BEND, crystalCorners, nearFace, aimAngle, toCrystal, startAngle, edge, lightPath,
  STRIP, STRIP_BOX, signal, samplesPath, TUNER, onTuner, SPECTRUM, GLYPH, barX, barHeight, barAt, stepsAt, pureTone, allBack,
  NOTE_LED, neon, ROWS, MRI, RATE, spinRate, coarseRows, magnetSpots, colourAt, chordSamples, unmix, mriBar, rowOrder, FIRST_ROW,
  rowIn, outlineIn, toSignal, FACE, hairPath, shirtPath, lookAt, PLAYER, TECH, bucketHat, beamHeightAt,
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
const rev5 = level3.slice(level3.indexOf('### Revision 5'));
const copyList = rev5.slice(rev5.indexOf('#### Level 3 learner copy (Revision 5)'), rev5.indexOf('#### What the new lines claim'));
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

test('4. the scanner: the magnets spin faster to the right, each coloured like its frequency\'s bar; the four parts stand left to right on the board', () => {
  for (let i = 1; i <= 10; i++) assert.ok(spinRate(i / 10) > spinRate((i - 1) / 10), 'further right: faster');
  assert.equal(spinRate(0), RATE);
  const ms = magnetSpots();
  assert.ok(ms.length > 20 && ms.every((m) => m.amount > 0), 'tiny magnets only where there is some of you');
  for (const m of ms) {
    assert.ok(inside({ x: MRI.head.x, y: MRI.head.y, w: MRI.head.size, h: MRI.head.size }, m.x, m.y), 'inside your head\'s box');
    const k = Math.min(ROWS - 1, Math.floor(m.xf * ROWS));
    assert.equal(colourAt(m.xf), neon(k, ROWS), 'a magnet is the colour of the bar its place sends');
    assert.ok(same(m.xf, (m.x - MRI.head.x) / MRI.head.size), 'xf is how far across it is');
  }
  const { head, signal: sig, bars, picture, arrows, glyph } = MRI;
  assert.ok(head.x + head.size < arrows[0].x1 && arrows[0].x2 < sig.x && sig.x + sig.w < arrows[1].x1 && arrows[1].x2 < picture.x && picture.x + picture.size < BOARD.w, 'head → signal → image, left to right');
  assert.ok(same(bars.x, sig.x) && same(bars.w, sig.w) && sig.y + sig.h < triangle(glyph)[0].y && triangle(glyph)[1].y < bars.y, 'the frequencies under the signal, the little prism between');
  assert.ok(arrows[0].y > sig.y && arrows[0].y < sig.y + sig.h && arrows[1].y > bars.y && arrows[1].y < bars.y + bars.h, 'magnets → signal; frequencies → image');
  for (const b of [{ x: head.x, y: head.y, w: head.size, h: head.size }, sig, bars, { x: picture.x, y: picture.y, w: picture.size, h: picture.size }]) assert.ok(inside({ x: 0, y: 0, w: BOARD.w, h: BOARD.h }, b.x, b.y) && inside({ x: 0, y: 0, w: BOARD.w, h: BOARD.h }, b.x + b.w, b.y + b.h));
  assert.ok(fits(toSignal(), STRIP_BOX, sig), "the violin's signal box becomes the MRI signal's");
  for (let k = 0; k < ROWS; k++) {
    const r = mriBar(k, 1);
    assert.ok(inside(bars, r.x, r.y) && inside(bars, r.x + r.w, r.y + r.h) && same(mriBar(k, 0.5).h, r.h / 2) && mriBar(k, -0.2).h === 0, 'bars in their box, as tall as their amount');
    if (k) assert.ok(r.x > mriBar(k - 1, 1).x + mriBar(k - 1, 1).w, 'bars apart');
  }
});

test('5. taking each row\'s signal apart gives back every row of the image exactly; rows are read from the middle out; the signal and the image move into the pattern', () => {
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
  for (const box of [MRI.head, MRI.picture]) {
    assert.ok(same(rowIn(box, ROWS - 1).y + rowIn(box, ROWS - 1).h, box.y + box.size) && same(rowIn(box, 0).y, box.y), 'rows fill the box');
    const O = outlineIn(box);
    rows.forEach((row, j) => row.forEach((a, i) => {
      const x = box.x + ((i + 0.5) * box.size) / ROWS;
      const y = box.y + ((j + 0.5) * box.size) / ROWS;
      if (((x - O.cx) / O.rx) ** 2 + ((y - O.cy) / O.ry) ** 2 > 1) assert.equal(a, 0, 'nothing of you outside your head');
    }));
  }
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

test("6. the faces: yours (bucket hat, dark hair, yellow shirt) and the technician's (copper hair, blue shirt) are well formed, and the pupils stay inside the eyes", () => {
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
  assert.ok(TECH.hair === '#b5602c' && TECH.shirt === '#4f8fe8', 'the technician: copper hair and a blue shirt (swapped in Revision 5)');
  assert.match(hairPath(), /^M [\d.]+ [\d.]+ C .* Z$/);
  assert.match(shirtPath(), / Z$/);
  assert.ok(F.neck.y < H.cy + H.ry && F.neck.y + F.neck.h > F.view.h - 28, 'a neck from head to shirt');
  const hat = bucketHat();
  const curveTop = (a, c) => 0.25 * a + 0.75 * c;              // the top of a symmetric cubic from height a with controls at height c
  assert.ok(curveTop(hat.base, hat.top) < curveTop(H.cy - 4, H.cy - H.ry - 20), 'the crown covers the hair');
  assert.ok(hat.wide > H.rx, 'the brim reaches past the head');
  assert.ok(hat.base + 10 <= Math.min(...F.brows.map((b) => Math.min(b.y1, b.y2))), 'the brim stays above the brows');
  assert.ok(PLAYER.hair !== TECH.hair && PLAYER.shirt !== TECH.shirt, 'two people, told apart');
  assert.match(main, /face\(who\)/, 'one face for both');
});

test('7. the copy is verbatim from the Revision 5 list and in order: the hall as Nadia told it, you and the technician, her scanner sentence lit part by part, her pattern; Fourier once at the end', () => {
  const T = (s) => `Technician: ${s}`;
  const sentence = COPY.mri.map((f) => f.text).join('');
  const ordered = [COPY.opening, COPY.dim, COPY.aim, COPY.aimHint, COPY.where.question, ...COPY.where.choices, COPY.where.after,
    `You (thinking): ${COPY.you.think}`, COPY.surprise, `[${COPY.play}]`, `${COPY.tunerLetter} (the letter`, COPY.drawsSignal, COPY.see.question,
    ...COPY.see.choices, COPY.see.after, `[${COPY.apart}]`, COPY.split, COPY.notes.join(', '), COPY.pure, COPY.pureHint, COPY.pureDone, COPY.back,
    COPY.backDone, COPY.arrives, `You: ${COPY.you.tookApart}`, T(COPY.tech.same), `25. ${sentence}`, `[${COPY.flip}]`, `[${COPY.apart}]`,
    `[${COPY.makeImage}]`, T(COPY.tech.pattern.question), ...COPY.tech.pattern.choices, T(COPY.tech.pattern.after), ...COPY.pattern, ...COPY.name, COPY.final];
  let at = 0;
  for (const l of ordered) {
    const i = copyList.indexOf(l, at);
    assert.ok(i >= 0, `not in the Revision 5 list, in order: ${l}`);
    at = i + 1;
  }
  assert.ok(copyList.includes(`36. ${COPY.final}\n\nNothing comes after line 36.`) && !/^37\. /m.test(copyList), 'the final line is last');
  assert.ok(rev5.includes('mri takes frequnecy from your magnets flipping from the mri signal and translates that into a physical image') && rev5.includes('swap the characters hair color and shirt color'), "Nadia's Revision 5 message, verbatim");
  assert.equal(sentence, 'MRI takes the frequencies of your flipping magnets from the MRI signal, and translates them into a physical image.', "Nadia's sentence, as one sentence");
  assert.deepEqual(COPY.mri.map((f) => f.step).sort(), [0, 1, 2, 3], 'each part lit by one step');
  for (const [step, words] of [[0, /flipping magnets/], [1, /MRI signal/], [2, /frequencies/], [3, /physical image/]]) assert.match(COPY.mri.find((f) => f.step === step).text, words, `step ${step} lights what it shows`);
  for (const [cls, said] of [[0, `\\[${COPY.flip}\\]`], [2, `\\[${COPY.apart}\\]`], [3, `\\[${COPY.makeImage}\\]`]]) assert.match(copyList, new RegExp(`"${COPY.mri.find((f) => f.step === cls).text.trim()}" with ${said}`), 'the spec says which button lights which part');
  assert.equal(COPY.you.think, 'If a prism is a tool that can take apart light, is there a tool that can take apart a sound?', "the thought is Nadia's sentence");
  assert.match(COPY.aim, /chandelier/, 'aim at the chandelier');
  assert.ok(!/prism/i.test(COPY.dim + COPY.aim + COPY.aimHint + COPY.where.question + COPY.where.choices.join(' ')), 'the prism is not named before the colours appear');
  assert.ok(/pure tones/.test(COPY.pattern[0]) && /full color spectrum/.test(COPY.pattern[1]) && /^Proton frequencies → image$/.test(COPY.pattern[2]), "Nadia's pattern");
  assert.match(COPY.name[0], /geometric math/);
  const scannerPart = JSON.stringify(COPY.tech) + sentence + COPY.flip + COPY.makeImage;
  assert.ok(!/note|tone|music|sound|hear|most of you|paint/i.test(scannerPart), 'the scanner part: no music, no "most of you", no painting rule');
  assert.ok(Object.keys(COPY.tech).length === 2, 'the technician says little: the scanner works the same way, and the pattern');
  const all = JSON.stringify(COPY);
  assert.ok(!/squiggle|glasses|very helpful|terrible|nobody's watching|could take a while/i.test(all), 'no glasses, no squiggle, no sarcasm');
  assert.match(COPY.opening, /After your scan/, 'the story picks up from Level 2');
  const texts = ordered.map((l) => l.replace(/^(Technician|You|You \(thinking\)): /, '').replace(/^25\. /, '').replace(/^\[|\]$/g, ''));
  for (const l of texts) assert.ok(l.split(/(?<=[.?!…])\s+(?=[A-Z])/).length <= 2, `at most two sentences: ${l}`);
  const lines = ordered.filter((l) => !/^\[/.test(l));
  const first = lines.findIndex((l) => /Fourier/.test(l));
  assert.ok(lines[first] === COPY.name[0] && first === lines.length - 3, "Fourier's name, once, at the end");
  assert.ok(!/coefficient|sine|cosine|energy|equation|integral|gradient|larmor/i.test(all), "no jargon beyond Nadia's own words");
  assert.ok(level3.includes('Here is the mathematical tool that lets us start seeing it.'), "Nadia's goal sentence");
  for (const s of [LEVELS.level3, LEVELS.next3]) assert.ok(spec.includes(s));
  const calls = ['COPY.opening', 'COPY.dim', 'COPY.aim', 'COPY.aimHint', 'COPY.where.question', 'COPY.where.after', 'COPY.you.think', 'COPY.surprise',
    'COPY.play', 'COPY.drawsSignal', 'COPY.see.question', 'COPY.see.after', 'COPY.apart', 'COPY.split', 'COPY.pure', 'COPY.pureHint', 'COPY.pureDone',
    'COPY.back', 'COPY.backDone', 'COPY.arrives', 'COPY.you.tookApart', 'COPY.tech.same', 'COPY.mri', 'COPY.flip', 'COPY.makeImage',
    'COPY.tech.pattern.question', 'COPY.tech.pattern.after', 'COPY.pattern', 'COPY.name[0]', 'COPY.name[1]', 'COPY.final'];
  const story = main.indexOf('// ── the story');
  const at1 = (c) => { const i = main.slice(story).search(new RegExp(`${c.replace(/[.[\]]/g, '\\$&')}(?![\\w.])`)); return i < 0 ? -1 : story + i; };
  const pos = calls.map((c) => (c === 'COPY.mri' ? story + main.slice(story).indexOf('sentence()') : at1(c)));
  assert.ok(pos.every((i) => i >= story), JSON.stringify(calls.filter((c, k) => pos[k] < story)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  for (const step of [0, 1, 2, 3]) assert.match(main, new RegExp(`light\\(${step}\\)`), `step ${step} lights its part`);
  for (const c of ['same', 'pattern.question', 'pattern.after']) assert.match(main, new RegExp(`speak\\(COPY\\.tech\\.${c.replace('.', '\\.')}\\)`), `the technician says ${c}`);
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
  assert.match(main, /if \(REDUCED\) \{ MAGNETS\.forEach\(\(m, k\) => turn\(m, magnets\[k\], 90\)\); return; \}/, 'reduced motion: the magnets are shown flipped, not spinning');
  assert.match(css, /\.strip \{ transform-box: view-box; transform-origin: 0 0;/, 'the signal moves as one piece');
  assert.match(css, /\.mri-image \{ transform-box: view-box; transform-origin: 0 0;/, 'so does the image');
  assert.match(main, /from '\.\.\/math\/prism\.js'/);
  assert.match(read('src/levels/page.js'), /chain\('mri-lesson', 'next-level-3', LEVELS\.next3, 'level-3', \(\) => import\('\.\/prism\.js'\)\)/, 'Level 3 opens when Level 2 ends');
  assert.match(read('try/index.html'), /id="prism-lesson"/);
  for (const name of ['basisValue', 'basisInner', 'basisGram']) assert.equal(typeof appFourier[name], 'function', `the app's fourier.js still has ${name}`);
});
