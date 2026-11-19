// Level 1, "Inside a note", the violin, at try/ (docs/levels_spec.md). Guards:
// - the hidden notes are what a bowed A really carries: 1, 2, 3, 4 × 440 Hz, the notes A, A, E, A;
// - they add up exactly to the A's shape, on screen too;
// - the magnifying glass hands over to the camera without a seam;
// - the zoom targets and the drawing fit;
// - the four notes fit their rows;
// - the copy is verbatim from the spec list and in order, with the take-home last;
// - the frame: sound only after the learner touches the bow, Level 1's white style, reduced motion.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PITCH, A_NOTE, STEPS, HIDDEN, nearestNote, wave, part, peak, STAGE, lane, trace, PX, LABEL_W, EAR, HEARD, SQUEEZE, squeezedEnd, funnel, heardPath } from '../src/math/tones.js';
import {
  VIEW, HOME, toView, toWorld, lensCamera, lerpCamera, coverRadius, LENS, VIOLIN, STRINGS, A_STRING, BOW, musicians, ZOOMS, closeUp, stringPath,
} from '../src/math/violin.js';
import { COPY } from '../src/levels/copyNote.js';
import { LEVELS } from '../src/levels/copyLevels.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const spec = read('docs/levels_spec.md');
const rev3 = spec;   // the governing document
const copyList = spec.slice(spec.indexOf('## Level 1, "Inside a note": learner copy'), spec.indexOf('## Level 2, "Inside the scanner": learner copy'));
const main = read('src/levels/note.js');
const css = read('src/levels/note.css') + read('src/levels/base.css');
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;

test('1. the hidden notes are what a bowed A carries: 1, 2, 3, 4 × 440 Hz, the notes A, A, E, A', () => {
  assert.equal(PITCH, 440);
  assert.deepEqual(HIDDEN.map((h) => h.hz), [440, 880, 1320, 1760]);
  const names = HIDDEN.map((h) => nearestNote(h.hz));
  assert.deepEqual(names.map((n) => n.name), ['A', 'A', 'E', 'A']);
  assert.ok(names.every((n) => Math.abs(n.cents) < 3), 'each within 3 cents of the piano note');
  assert.deepEqual(names.map((n) => n.octavesUp), [0, 1, 1, 2], 'A, the A above, an E, the A above that');
  assert.deepEqual(COPY.notes.map((s) => s.split(' ').pop()), ['A', 'A', 'E', 'A'], 'the names the learner sees');
  assert.deepEqual(A_NOTE, [3, 2, 1, 1]);
  assert.ok(A_NOTE.every((a, k) => k === 0 || a <= A_NOTE[k - 1]), "the tones fall off, as a bowed string's do");
  assert.equal(HIDDEN.length, 4, 'Hidden inside: four notes.');
});

test("2. the four notes add up exactly to the A's shape, and on screen they use one scale, so they add up there too", () => {
  for (const x of [0.03, 0.21, 0.4, 0.77, 1.33, 2.1]) {
    assert.ok(near(A_NOTE.reduce((s, _, k) => s + wave(part(A_NOTE, k), x), 0), wave(A_NOTE, x)));
  }
  const cy = lane(0, 1).cy;
  const ys = (d) => d.slice(1).split('L').map((pt) => +pt.split(' ')[1]);
  const sum = ys(trace(A_NOTE, cy));
  const parts = A_NOTE.map((_, k) => ys(trace(part(A_NOTE, k), cy)));
  sum.forEach((y, i) => assert.ok(Math.abs((y - cy) - parts.reduce((s, p) => s + (p[i] - cy), 0)) < 0.25, `point ${i}`));
  assert.ok(peak(A_NOTE) > 1.5, 'the A is not one smooth wave');
});

test('3. the magnifying glass hands over to the camera without a seam', () => {
  const cams = [HOME, closeUp(0), { ax: 100, ay: 50, wx: 33, wy: 44, z: 3.7 }];
  for (const c of cams) {
    for (const q of [{ x: 10, y: 20 }, { x: 320, y: 200 }, { x: 600, y: 390 }]) {
      const back = toView(c, toWorld(c, q));
      assert.ok(near(back.x, q.x) && near(back.y, q.y), 'view → world → view');
    }
    for (const M of [2.6, 4]) {
      const L = { x: 180, y: 300 };
      const lc = lensCamera(c, L, M);
      const w = toWorld(c, L);
      const at = toView(lc, w);
      assert.ok(near(at.x, L.x) && near(at.y, L.y), 'the point under the glass stays under it');
      assert.ok(near(lc.z, c.z * M), 'magnified M times');
      const p = { x: w.x + 1, y: w.y };                     // a world unit next to it is M times wider in the glass
      assert.ok(near(toView(lc, p).x - toView(lc, w).x, (toView(c, p).x - toView(c, w).x) * M));
    }
  }
  const a = closeUp(0); const b = closeUp(1);
  assert.deepEqual(lerpCamera(a, b, 0), a);
  for (const k of ['ax', 'ay', 'wx', 'wy', 'z']) assert.ok(near(lerpCamera(a, b, 1)[k], b[k]));
  assert.ok(near(lerpCamera(a, b, 0.5).z, Math.sqrt(a.z * b.z)), 'the zoom grows evenly');
  for (const L of [{ x: 0, y: 0 }, { x: 320, y: 200 }, { x: 600, y: 50 }]) {
    for (const corner of [{ x: 0, y: 0 }, { x: VIEW.w, y: 0 }, { x: 0, y: VIEW.h }, { x: VIEW.w, y: VIEW.h }]) {
      assert.ok(Math.hypot(corner.x - L.x, corner.y - L.y) <= coverRadius(L), 'the grown glass covers the whole view');
    }
  }
});

test('4. the two close-ups: the glass finds your violin, then the A string; each zooms in further, never back', () => {
  const [z1, z2] = ZOOMS;
  assert.ok(z1.target.x > VIOLIN.fingerboard.x && z1.target.x < VIOLIN.lower.cx && Math.abs(z1.target.y - VIOLIN.upper.cy) < VIOLIN.upper.ry, 'target 1 is on the violin');
  const t1 = toView(HOME, z1.target);
  assert.ok(t1.x > 0 && t1.x < VIEW.w && t1.y > 0 && t1.y < VIEW.h);
  assert.equal(z2.target.y, A_STRING.y, 'target 2 is on the A string');
  assert.ok(z2.target.x > A_STRING.x1 && z2.target.x < A_STRING.x2);
  const t2 = toView(closeUp(0), z2.target);
  assert.ok(t2.x > LENS.r && t2.x < VIEW.w - LENS.r && t2.y > 0 && t2.y < VIEW.h, 'target 2 is on screen in the first close-up');
  assert.ok(HOME.z * z1.mag <= z1.z && z1.z * z2.mag <= z2.z, 'after the glass covers the view, the camera keeps zooming in');
  const label = toView(closeUp(1), { x: z2.target.x - 18, y: A_STRING.y });
  assert.ok(label.x > 0 && label.x < VIEW.w, 'the A label is in view in the string close-up');
  const lr = toView(HOME, LENS.rest);
  assert.ok(Math.hypot(lr.x - t1.x, lr.y - t1.y) > z1.snap, 'the glass starts away from its target');
});

test('5. the drawing: twelve players clear of your violin and of each other; the bow crosses every string; strings are fixed at both ends', () => {
  const m = musicians();
  assert.equal(m.length, 12);
  for (const p of m) {
    assert.ok(p.x > 20 && p.x < VIEW.w - 20 && p.y > 40 && p.y < BOW.top - 20, `player at ${p.x},${p.y} on stage, above your violin`);
  }
  for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) assert.ok(Math.hypot(m[i].x - m[j].x, m[i].y - m[j].y) > 40, 'players apart');
  assert.ok(BOW.x > VIOLIN.fingerboard.x + VIOLIN.fingerboard.w && BOW.x < VIOLIN.bridge.x, 'the bow plays between the fingerboard and the bridge');
  assert.ok(BOW.top + BOW.travel < STRINGS[0].y && BOW.bottom - BOW.travel > STRINGS[3].y, 'wherever it is pushed, the bow still crosses all four strings');
  assert.deepEqual(STRINGS.map((s) => s.name), ['E', 'A', 'D', 'G']);
  for (const s of STRINGS) {
    const pts = stringPath(s, 3, 1).slice(1).split('L').map((pt) => pt.split(' ').map(Number));
    assert.ok(near(pts[0][0], VIOLIN.nut) && near(pts[0][1], s.y, 1e-3) && near(pts.at(-1)[0], VIOLIN.bridge.x) && near(pts.at(-1)[1], s.y, 1e-3), 'still at the nut and the bridge');
  }
});

test('6. inside the sound: four rows inside the stage, each note in its own row; then into the ear, and out comes one A note', () => {
  for (let k = 0; k < 4; k++) {
    const ln = lane(k, 4);
    assert.ok(ln.top >= STAGE.y - 1e-9 && ln.top + ln.h <= STAGE.y + STAGE.h + 1e-9);
    assert.ok(peak(part(A_NOTE, k)) * PX < ln.half, `note ${k + 1} stays in its row`);
  }
  assert.ok(peak(A_NOTE) * PX < lane(0, 1).half, 'the whole A fits the stage');
  assert.ok(LABEL_W >= 100, 'room for the names');
  const firstX = +trace(A_NOTE, 100).slice(1).split(' ')[0];
  assert.ok(firstX >= STAGE.x + LABEL_W);
  // the ear: each row's squeezed end feeds a line into the ear; what comes out is the A note, right of the ear
  const end = squeezedEnd();
  assert.ok(near(end, STAGE.x + LABEL_W + (STAGE.w - LABEL_W - 16) * SQUEEZE));
  for (let k = 0; k < 4; k++) {
    const nums = funnel(k).match(/-?[\d.]+/g).map(Number);
    assert.ok(near(nums[0], end, 0.06) && near(nums[1], lane(k, 4).cy, 0.06), `note ${k + 1} leaves its row`);
    assert.ok(near(nums.at(-2), EAR.x - 4, 0.06) && near(nums.at(-1), EAR.y + 6, 0.06), `note ${k + 1} enters the ear`);
  }
  assert.ok(end < EAR.x - 40 && EAR.x + 50 < HEARD.x0 && HEARD.x1 <= STAGE.x + STAGE.w - 8, 'rows, then the ear, then what you hear');
  const heardYs = heardPath().slice(1).split('L').map((pt) => +pt.split(' ')[1]);
  heardYs.forEach((y, i) => {
    const u = i / (heardYs.length - 1);
    assert.ok(Math.abs(y - (HEARD.cy - wave(A_NOTE, u * HEARD.periods) * PX * 0.7)) < 0.1, 'what you hear is the four notes added up');
  });
  assert.ok(HEARD.cy - peak(A_NOTE) * PX * 0.7 > STAGE.y && HEARD.cy + peak(A_NOTE) * PX * 0.7 < STAGE.y + STAGE.h);
});

test('7. the copy is verbatim from the Level 1 list and in order; the take-home is last; the page shows it in that order', () => {
  const ordered = [...COPY.opening, COPY.bow, COPY.tuned, COPY.lens1, COPY.lens2, `${COPY.stringLabel} (the label`, COPY.shaking, COPY.shape,
    COPY.oneNote.question, ...COPY.oneNote.choices, COPY.oneNote.after, COPY.xray, COPY.hidden, COPY.notes.join(', '), COPY.tapNotes, COPY.together,
    `${COPY.heard} (the label`, COPY.oneA, COPY.final];
  let at = 0;
  for (const line of ordered) {
    const i = copyList.indexOf(line, at);
    assert.ok(i >= 0, `not in the Level 1 list, in order: ${line}`);
    at = i;
  }
  assert.ok(copyList.includes(`20. ${COPY.final}\n\nNothing comes after line 20 in Level 1.`) && !/^21\. /m.test(copyList), 'the final line is last');
  assert.ok([COPY.opening[2], COPY.bow, COPY.tuned, COPY.oneNote.question, COPY.oneA].every((l) => l.includes('A note')), 'the A is called an A note');
  assert.ok(!/MRI|scanner|Level 2/.test(JSON.stringify(COPY)), 'Level 1 comes first: it does not refer to the MRI level');
  for (const s of Object.values(LEVELS)) assert.ok(rev3.includes(s), `around the levels: ${s}`);
  for (const line of ordered) assert.ok(line.split(/(?<=[.?!])\s+(?=[A-Z])/).length <= 2, `at most two sentences: ${line}`);
  assert.ok(!/fourier|frequenc|harmonic|spectrum|DIFFERENCE/i.test(JSON.stringify(COPY)), 'nothing named yet, and no tuning game');
  const calls = ['COPY.opening[0]', 'COPY.opening[1]', 'COPY.opening[2]', 'COPY.bow', 'COPY.tuned', 'COPY.lens1', 'COPY.lens2', 'COPY.shaking', 'COPY.shape', 'COPY.oneNote.question',
    'COPY.oneNote.after', 'COPY.xray', 'COPY.hidden', 'COPY.notes[k]', 'COPY.tapNotes', 'COPY.together', 'COPY.oneA', 'COPY.final'];
  const pos = calls.map((c) => main.indexOf(c, main.indexOf('// ── the story')));
  assert.ok(pos.every((i) => i >= 0), JSON.stringify(calls.filter((c, k) => pos[k] < 0)));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'the story shows the copy in order');
  const tail = main.slice(main.indexOf("say(COPY.final, 'final');"));
  assert.ok(!/say\(|ask\(|button\(/.test(tail.replace("say(COPY.final, 'final');", '').split('function miniTrace')[0]), 'nothing is shown after the final line');
  for (const line of [COPY.opening[0], COPY.shaking, COPY.oneA, COPY.final]) assert.ok(!main.includes(line), `copy belongs in copyNote.js: ${line}`);
});

test("8. the frame: sound only after the learner touches the bow, Level 1's white style, a page of its own, reduced motion", () => {
  assert.equal((main.match(/new AC\(\)/g) ?? []).length, 1, 'one place makes the audio context');
  const story = main.slice(main.indexOf('// ── the story'));
  const opening = story.slice(story.indexOf('async function opening'), story.indexOf('function bowTheA'));
  assert.ok(opening.indexOf('await bowTheA()') < opening.indexOf('orchestraTunes()'), 'the orchestra tunes only after you bow');
  const bowing = story.slice(story.indexOf('function bowTheA'), story.indexOf('function lookCloser'));
  assert.match(bowing, /if \(kind === 'down'\) \{ sound \?\?= violinA\(\);/, 'the first sound starts when the bow is touched');
  assert.ok(!/violinA\(|playA\(|pureTone\(|orchestraTunes\(/.test(story.slice(0, story.indexOf('function bowTheA')).replace('orchestraTunes();', '')), 'nothing sounds before the bow');
  assert.match(main, /createPeriodicWave\(real, imag, \{ disableNormalization: true \}\)/, 'the A is exactly its four notes played as one');
  assert.ok(!/recording|real violin/i.test(JSON.stringify(COPY)), 'the copy never calls the sound a recording');
  assert.match(read('src/levels/base.css'), /--bg: #ffffff;/, "Level 1's white page");
  assert.ok(!/prefers-color-scheme: dark|linear-gradient|caveat|night/i.test(css), 'no dark stage, no notebook');
  assert.match(read('try/index.html'), /src\/levels\/page\.js/);
  assert.match(read('src/levels/page.js'), /import\('\.\/note\.js'\);\s+\/\/ Level 1 starts the page/, 'the violin is Level 1: it starts the page');
  assert.match(main, /<use|svg\('use'/, 'the glass shows the same drawing, magnified');
  assert.match(css, /prefers-reduced-motion: reduce/);
});
