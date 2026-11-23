// Reading at your own pace (docs/levels_spec.md, "All three levels: reading at your own pace, and a simpler Level 2",
// and "One way forward at a time, and one bar for the whole story"). Guards:
// - no level waits a set time for you to read, and words never leave on a timer;
// - one way forward at a time: Next only where the story would turn the page itself; lines of one part follow a beat
//   apart and stay; Next is hidden when it is not the way on;
// - one bar for the whole story at the top, a section per level ending in its marker: stars fly up into it (+1), and a
//   finished level's marker turns gold (Level up!); plain style; reduced motion keeps it still.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LEVELS } from '../src/levels/copyLevels.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('1. no words wait on a timer, and one way forward at a time: Next only where the story would turn the page itself', () => {
  const nexts = {};
  for (const [f, lesson] of [['note', 'note-lesson'], ['mri', 'mri-lesson'], ['prism', 'prism-lesson']]) {
    const main = read(`src/levels/${f}.js`);
    assert.ok(!/reading\(/.test(main), `${f}.js: no reading time left`);
    assert.ok(/import \{ reader \} from '\.\/reader\.js';/.test(main) && /const story = reader\(root[,)]/.test(main) && /root\.append\(story\.el\);/.test(main), `${f}.js: the reader, under the level`);
    nexts[f] = (main.match(/await story\.next\(\);/g) ?? []).length;
    assert.ok((main.match(/await story\.beat\(/g) ?? []).length >= 4, `${f}.js: lines of one part follow a beat apart`);
    // never a Next right before something you do: a button, a choice or a drag is the way on
    const after = [...main.matchAll(/await story\.next\(\);[^\n]*\n((?:[^\n]*\n){1,3})/g)].map((m) => m[1]);
    for (const a of after) assert.ok(!/^\s*(await )?(press|ask|button|choices)\(/.test(a), `${f}.js: a Next right before an action: ${a.trim().split('\n')[0]}`);
    assert.ok(!/await pause\(\d+\);\s*clear\(\);/.test(main), `${f}.js: no words cleared on a timer`);
    assert.ok(read('try/index.html').includes(`id="${lesson}"`));
  }
  assert.deepEqual(nexts, { note: 2, mri: 6, prism: 7 }, 'few Next presses: 2, 6, and 6 plus the three slides (in one loop)');
  assert.match(read('src/levels/prism.js'), /reader\(root, \{ fast: \(\) => FAST \}\)/, 'fast-forwarding never waits');
  const comic = JSON.parse(read('src/levels/comic/comic.json'));
  for (const l of comic.levels) assert.ok(Number.isInteger(l.steps) && l.steps >= 2, `${l.id}: its count of Next presses (${l.steps})`);
  assert.match(read('src/levels/base.css'), /\.reader-next:not\(\.ready\):not\(\.paging\) \{ visibility: hidden; \}/, 'Next shows only when it is the way on');
});

test('2. one bar for the whole story, at the top: a section per level, each ending in its marker; stars fly up into it; Level up!', () => {
  const r = read('src/levels/reader.js');
  for (const k of ['goBack', 'forward', 'progress', 'earlier', 'levelUp', 'level1', 'level2', 'level3']) assert.ok(r.includes(`LEVELS.${k}`), `the reader says ${k}`);
  assert.deepEqual([LEVELS.goBack, LEVELS.forward, LEVELS.progress, LEVELS.earlier, LEVELS.levelUp], ['Back', 'Next', 'Progress', 'Earlier', 'Level up!']);
  assert.match(r, /const ORDER = \['level-1', 'level-2', 'level-3'\];/, 'the three levels, in order');
  assert.match(r, /'story-mark'/, 'each section ends in its marker');
  assert.match(r, /document\.body\.append\(el\);/, 'one bar, for the whole page');
  assert.match(r, /'story-spark'/, 'stars fly from Next up into the bar');
  assert.match(r, /'story-plus', \{ textContent: '\+1' \}/, '+1');
  assert.match(r, /root\.addEventListener\('level-finished', \(\) => \{ done = true; bar\?\.done\(level\);/, 'a finished level: its marker turns gold');
  assert.match(r, /'story-confetti'/, 'with confetti');
  assert.match(r, /bar\.set\(level, Math\.min\(0\.96, count \/ total\)\)/, 'a section only fills completely when its level is done');
  assert.match(r, /if \(REDUCED \|\| !bar\) return;/, 'reduced motion: no stars');
  assert.match(r, /#story-record \.recorded-part/, 'Back pages through the kept parts');
  assert.match(r, /e\.key === 'ArrowRight'/);
  assert.match(r, /e\.key === 'ArrowLeft'/);
  assert.match(r, /e\.defaultPrevented/, 'a key a board already uses is left to the board');
  const css = read('src/levels/base.css');
  assert.ok(!/linear-gradient|\bred\b/.test(css), 'in the levels\' plain style');
  assert.match(css, /\.story-bar \{\s*position: fixed; top: 0;/, 'the bar at the top');
  assert.match(css, /html\.has-story-bar body \{ padding-top: 62px; \}/, 'clear of the page under it');
  assert.match(css, /\.story-section\.done \.story-mark \{ background: #ffc531;/, 'a finished level: gold');
  assert.match(css, /\.reader \{\s*position: sticky; bottom: 0;/, 'Back (and Next when it is needed) stay in reach');
  assert.match(css, /\.reader-next\.ready \{ animation: next-glow/, 'Next glows when the story waits for you');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\n  \.reader-next\.ready, \.story-section\.gain \.story-track, \.story-section\.done \.story-mark, \.story-levelup \{ animation: none; \}/);
  assert.match(read('src/levels/record.js'), /dispatchEvent\(new CustomEvent\('part-kept'\)\)/, 'Back can reach a part as soon as it is kept');
  const spec = read('docs/levels_spec.md');
  assert.ok(spec.includes('develop a user friendly way that is also aestheticly clean to achieve the ability for the user to go back and click to go to the next words'), "Nadia's message, verbatim");
  assert.ok(spec.includes('> theres too many next buttons also put the progress bar at the top') && spec.includes('> make sure the progress bar is for the whole 3 levels and make sure theres intervals at each levels'), "Nadia's messages, verbatim");
  for (const s of ['"Back"', '"Next"', '"Level up!"', '"Earlier"']) assert.ok(spec.includes(s), `the spec lists ${s}`);
});
