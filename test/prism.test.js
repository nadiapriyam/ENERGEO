// Level 3, "A prism for sound", at try/ (docs/levels_spec.md, Level 3 Revision 3). Guards:
// - the hall: the stage light misses the prism at first, is caught when aimed at it, and the colours leave in a real
//   prism's order (red bent least, violet most);
// - the tuner's little signal is the big signal, laid exactly on its screen;
// - the four bars are exactly the A note's tones; dragging sets one bar; one bar is a pure tone;
// - the scanner: each spot its own note once the right side is stronger; the prism for sound (an exact Fourier
//   transform) gives back every row of the picture; each bar stands under its spot; the row goes back where it came from;
// - the technician's face is well formed, and his eyes never leave their sockets;
// - the copy is verbatim and in order, with no glasses, no "squiggle", and Fourier named once at the end;
// - the frame: sound after a tap, reduced motion, Level 3 after Level 2, and the app's own Fourier math untouched.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BOARD, fit, triangle, HALL, RAINBOW, BEND, crystalCorners, nearFace, aimAngle, toCrystal, startAngle, edge, lightPath,
  STRIP, STRIP_BOX, signal, samplesPath, TUNER, onTuner, SPECTRUM, GLYPH, barX, barHeight, barAt, stepsAt, pureTone, allBack,
  NOTE_LED, neon, ROWS, BASE_HZ, spotHz, RATE, spinRate, coarseRows, sharpRows, chordSamples, unmix, tallest, rowOrder, HAND_ROW,
  REPLY_BOX, toReply, GLYPH2, PIC, cell, headOutline, rowBand, BENCH, spotX, ROW_BOX, benchToRow, spotAt, WEDGE, wedge,
  SPOT_BARS, spotBarHeight, FACE, hairPath, shirtPath, lookAt,
} from '../src/math/prism.js';
import { A_NOTE, STEPS, part, wave } from '../src/math/tones.js';
import { scanPixel } from '../src/math/scanner.js';
import * as appFourier from '../src/math/fourier.js';
import { COPY } from '../src/levels/copyPrism.js';
import { LEVELS } from '../src/levels/copyLevels.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const spec = read('docs/levels_spec.md');
const level3 = spec.slice(spec.indexOf('## Level 3, "A prism for sound"'));
const rev3 = level3.slice(level3.indexOf('### Revision 3'));
const copyList = rev3.slice(rev3.indexOf('#### Level 3 learner copy (Revision 3)'), rev3.indexOf('#### What the new lines claim'));
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

test('1. the hall: the light first misses the prism; aimed at it, the beam goes into its near face and the colours leave red-first, violet bent most', () => {
  const miss = lightPath(startAngle());
  assert.ok(!miss.hit && miss.rays.length === 0, 'at first the light misses: white light on the wall');
  assert.ok(same(miss.beam.to.x, BOARD.w) && miss.beam.to.y > HALL.crystal.cy + 100, 'it lands on the wall, well below the prism');
  const hit = lightPath(toCrystal());
  const [top, right, left] = crystalCorners();
  assert.ok(hit.hit && same(hit.beam.to.x, nearFace().x) && same(hit.beam.to.y, nearFace().y), 'the beam goes in at the middle of the near face');
  assert.ok(same(nearFace().x, (top.x + left.x) / 2) && same(nearFace().y, (top.y + left.y) / 2));
  assert.ok(lightPath(toCrystal() + 3 * DEG).hit && lightPath(toCrystal() + 3 * DEG).angle === toCrystal(), 'close enough: the beam snaps onto the prism');
  assert.ok(!lightPath(toCrystal() + 12 * DEG).hit && !lightPath(toCrystal() - 12 * DEG).hit, 'too far off: no colours');
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

test('4. the scanner: an even magnet gives every spot the same note; the stronger right side gives each its own, in step with how fast it spins', () => {
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

test('5. the prism for sound gives back every row exactly; each bar stands under its spot; the row goes back where it came from', () => {
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
});

test("6. the technician: his face is well formed, and wherever he looks his pupils stay inside his eyes", () => {
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
});

test('7. the copy is verbatim from the Revision 3 list and in order: the prism first, the tuner as the prism for sound, the technician; no glasses, no "squiggle", Fourier once at the end', () => {
  const ordered = [COPY.opening, COPY.dim, COPY.crystal, COPY.aim, COPY.aimHint, COPY.where.question, ...COPY.where.choices, COPY.where.after, COPY.think,
    COPY.surprise, COPY.clipOn, `[${COPY.play}]`, `${COPY.tunerLetter} (the letter`, COPY.drawsSignal, COPY.namesOne, COPY.knowBetter, COPY.see.question,
    ...COPY.see.choices, COPY.see.after, `[${COPY.prismOn}]`, COPY.split, COPY.notes.join(', '), COPY.howMuch, COPY.twoWays, COPY.pure, COPY.pureHint,
    COPY.pureDone, COPY.back, COPY.backDone, COPY.arrives, `Technician: ${COPY.tech.hi}`, `Technician: ${COPY.tech.row}`, `Technician: ${COPY.tech.same}`,
    `[${COPY.stronger}]`, `Technician: ${COPY.tech.faster}`, COPY.tapSpots, COPY.radio, `[${COPY.allAtOnce}]`, `Technician: ${COPY.tech.hears}`, `[${COPY.prismOn}]`,
    `Technician: ${COPY.tech.underSpot}`, COPY.most, `Technician: ${COPY.tech.tallest}`, `Technician: ${COPY.tech.paint}`, `[${COPY.paintRow}]`,
    `Technician: ${COPY.tech.oneRow}`, `[${COPY.nextRow}]`, `Technician: ${COPY.tech.rest}`, `Technician: ${COPY.tech.sharp}`, COPY.pictureOut,
    `Technician: ${COPY.tech.bothWays}`, ...COPY.name, COPY.final];
  let at = 0;
  for (const line of ordered) {
    const i = copyList.indexOf(line, at);
    assert.ok(i >= 0, `not in the Revision 3 list, in order: ${line}`);
    at = i + 1;
  }
  assert.ok(copyList.includes(`52. ${COPY.final}\n\nNothing comes after line 52.`) && !/^53\. /m.test(copyList), 'the final line is last');
  const all = JSON.stringify(COPY);
  assert.ok(!/squiggle|glasses|very helpful|terrible|nobody's watching|could take a while/i.test(all), 'a prism, not glasses; signal, not squiggle; no sarcasm');
  assert.match(COPY.opening, /After your scan/, 'the story picks up from Level 2');
  assert.ok(ordered.indexOf(COPY.crystal) < ordered.indexOf(COPY.think) && ordered.indexOf(COPY.think) < ordered.indexOf(COPY.surprise) && /tuner/.test(COPY.surprise), 'a prism for light, then: surprise, the tuner');
  const texts = ordered.map((l) => l.replace(/^Technician: /, '').replace(/^\[|\]$/g, ''));
  for (const line of texts) assert.ok(line.split(/(?<=[.?!…])\s+(?=[A-Z])/).length <= 2, `at most two sentences: ${line}`);
  const lines = ordered.filter((l) => !/^\[/.test(l));
  const first = lines.findIndex((l) => /Fourier/.test(l));
  assert.ok(lines[first] === COPY.name[0] && first === lines.length - 3, "Fourier's name, once, at the end");
  assert.ok(!/frequenc|spectrum|coefficient|sine|cosine|energy|equation|integral|gradient|larmor|proton/i.test(all), 'no jargon');
  assert.ok(level3.includes('Here is the mathematical tool that lets us start seeing it.'), "Nadia's goal sentence");
  assert.ok(rev3.includes('suprise its a tuner') && rev3.includes('you can make a character like this'), "Nadia's Revision 3 message, verbatim");
  for (const s of [LEVELS.level3, LEVELS.next3]) assert.ok(spec.includes(s));
  const calls = ['COPY.opening', 'COPY.dim', 'COPY.crystal', 'COPY.aim', 'COPY.aimHint', 'COPY.where.question', 'COPY.where.after', 'COPY.think', 'COPY.surprise',
    'COPY.clipOn', 'COPY.play', 'COPY.drawsSignal', 'COPY.namesOne', 'COPY.knowBetter', 'COPY.see.question', 'COPY.see.after', 'COPY.prismOn', 'COPY.split',
    'COPY.howMuch', 'COPY.twoWays', 'COPY.pure', 'COPY.pureHint', 'COPY.pureDone', 'COPY.back', 'COPY.backDone', 'COPY.arrives', 'COPY.tech.hi', 'COPY.tech.row',
    'COPY.tech.same', 'COPY.stronger', 'COPY.tech.faster', 'COPY.tapSpots', 'COPY.radio', 'COPY.allAtOnce', 'COPY.tech.hears', 'COPY.tech.underSpot', 'COPY.most',
    'COPY.tech.tallest', 'COPY.tech.paint', 'COPY.paintRow', 'COPY.tech.oneRow', 'COPY.nextRow', 'COPY.tech.rest', 'COPY.tech.sharp', 'COPY.pictureOut',
    'COPY.tech.bothWays', 'COPY.name[0]', 'COPY.name[1]', 'COPY.final'];
  const story = main.indexOf('// ── the story');
  const at1 = (c) => { const i = main.slice(story).search(new RegExp(`${c.replace(/[.[\]]/g, '\\$&')}(?![\\w.])`)); return i < 0 ? -1 : story + i; };
  const pos = calls.map(at1);
  assert.ok(pos.every((i) => i >= story), JSON.stringify(calls.filter((c, k) => pos[k] < story)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  for (const c of Object.keys(COPY.tech)) assert.match(main, new RegExp(`speak\\(COPY\\.tech\\.${c}\\)`), `the technician says ${c}`);
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
