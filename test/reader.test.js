// Reading at your own pace (docs/levels_spec.md, "All three levels: reading at your own pace, and a simpler Level 2").
// Guards:
// - no level waits a set time for you to read: every such wait is `await story.next()`, which waits for Next;
// - every level has the reader under it: ‹ Back, the bar, Next ›; Back pages through the parts kept by record.js;
// - Next is fun, in the levels' plain style: stars into the bar, +1, Level up! at the end; no gradients; reduced motion
//   keeps it still; the bar fills by each level's own count of Next presses, recorded with the comic.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LEVELS } from '../src/levels/copyLevels.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('1. no words wait on a timer: every level waits for Next, and has the reader under it', () => {
  for (const [f, lesson] of [['note', 'note-lesson'], ['mri', 'mri-lesson'], ['prism', 'prism-lesson']]) {
    const main = read(`src/levels/${f}.js`);
    assert.ok(!/reading\(/.test(main), `${f}.js: no reading time left`);
    assert.ok(/import \{ reader \} from '\.\/reader\.js';/.test(main) && /const story = reader\(root[,)]/.test(main) && /root\.append\(story\.el\);/.test(main), `${f}.js: the reader, under the level`);
    assert.ok((main.match(/await story\.next\(\);/g) ?? []).length >= 8, `${f}.js: the story waits for Next`);
    assert.ok(read('try/index.html').includes(`id="${lesson}"`));
  }
  assert.match(read('src/levels/prism.js'), /reader\(root, \{ fast: \(\) => FAST \}\)/, 'fast-forwarding never waits');
  const comic = JSON.parse(read('src/levels/comic/comic.json'));
  for (const l of comic.levels) assert.ok(Number.isInteger(l.steps) && l.steps >= 8, `${l.id}: its count of Next presses (${l.steps})`);
});

test('2. Next levels you up, Back reads again: the bar, the stars, +1, Level up!, Earlier; plain style; keys', () => {
  const r = read('src/levels/reader.js');
  for (const k of ['goBack', 'forward', 'progress', 'earlier', 'levelUp']) assert.ok(r.includes(`LEVELS.${k}`), `the reader says ${k}`);
  assert.deepEqual([LEVELS.goBack, LEVELS.forward, LEVELS.progress, LEVELS.earlier, LEVELS.levelUp], ['Back', 'Next', 'Progress', 'Earlier', 'Level up!']);
  assert.match(r, /xp-spark/, 'stars fly from Next into the bar');
  assert.match(r, /'xp-plus', \{ textContent: '\+1' \}/, '+1 pops up');
  assert.match(r, /addEventListener\('level-finished'/, 'the bar fills at the end of the level');
  assert.match(r, /xp-confetti/, 'with confetti');
  assert.match(r, /setFill\(Math\.min\(0\.96, count \/ total\)\)/, 'it only fills completely when the level is done');
  assert.match(r, /if \(REDUCED\) return;/, 'reduced motion: no stars');
  assert.match(r, /#story-record \.recorded-part/, 'Back pages through the kept parts');
  assert.match(r, /e\.key === 'ArrowRight'/);
  assert.match(r, /e\.key === 'ArrowLeft'/);
  assert.match(r, /e\.defaultPrevented/, 'a key a board already uses is left to the board');
  const css = read('src/levels/base.css');
  assert.ok(!/linear-gradient|\bred\b/.test(css), 'in the levels\' plain style');
  assert.match(css, /\.reader \{\s*position: sticky; bottom: 0;/, 'the bar stays in reach');
  assert.match(css, /\.reader-next\.ready \{ animation: next-glow/, 'Next glows when the story waits for you');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\n  \.reader-next\.ready, \.xp\.gain \.xp-fill, \.levelled \.xp-fill, \.xp-levelup \{ animation: none; \}/);
  const record = read('src/levels/record.js');
  assert.match(record, /dispatchEvent\(new CustomEvent\('part-kept'\)\)/, 'Back can reach a part as soon as it is kept');
  const spec = read('docs/levels_spec.md');
  assert.ok(spec.includes('develop a user friendly way that is also aestheticly clean to achieve the ability for the user to go back and click to go to the next words'), "Nadia's message, verbatim");
  for (const s of ['"Back"', '"Next"', '"Level up!"', '"Earlier"']) assert.ok(spec.includes(s), `the spec lists ${s}`);
});
