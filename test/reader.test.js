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

test('2. one bar for the whole story, at the top: a section per level, each ending in its marker; stars fly up into it', () => {
  const r = read('src/levels/reader.js');
  for (const k of ['goBack', 'forward', 'progress', 'earlier', 'level1', 'level2', 'level3']) assert.ok(r.includes(`LEVELS.${k}`), `the reader says ${k}`);
  assert.deepEqual([LEVELS.goBack, LEVELS.forward, LEVELS.progress, LEVELS.earlier], ['Back', 'Next', 'Progress', 'Earlier']);
  assert.ok(!('levelUp' in LEVELS) && !/story-plus|'\+1'|confetti|levelUp/.test(r), 'no +1, no Level up!, no confetti (Nadia, 2026-11-24)');
  assert.match(r, /const ORDER = \['level-1', 'level-2', 'level-3'\];/, 'the three levels, in order');
  assert.match(r, /'story-mark'/, 'each section ends in its marker');
  assert.match(r, /document\.body\.append\(el\);/, 'one bar, for the whole page');
  assert.match(r, /'story-spark'/, 'stars fly from Next up into the bar');
  assert.match(r, /root\.addEventListener\('level-finished', \(\) => \{ done = true; bar\?\.done\(level\);/, 'a finished level: its marker turns gold');
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
  assert.match(css, /\.story-section\.done \.story-mark \{ background: var\(--accent\);/, 'a finished level: its section full, its marker filled');
  assert.ok(!/story-levelup|story-confetti|story-plus/.test(css));
  assert.match(css, /\.reader \{\s*position: sticky; bottom: 0;/, 'Back (and Next when it is needed) stay in reach');
  assert.match(css, /\.reader-next\.ready \{ animation: next-glow/, 'Next glows when the story waits for you');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\n  \.reader-next\.ready, \.story-section\.gain \.story-track \{ animation: none; \}/);
  assert.match(read('src/levels/record.js'), /dispatchEvent\(new CustomEvent\('part-kept'\)\)/, 'Back can reach a part as soon as it is kept');
  const spec = read('docs/levels_spec.md');
  assert.ok(spec.includes('develop a user friendly way that is also aestheticly clean to achieve the ability for the user to go back and click to go to the next words'), "Nadia's message, verbatim");
  assert.ok(spec.includes('> theres too many next buttons also put the progress bar at the top') && spec.includes('> make sure the progress bar is for the whole 3 levels and make sure theres intervals at each levels'), "Nadia's messages, verbatim");
  for (const s of ['"Back"', '"Next"', '"Earlier"']) assert.ok(spec.includes(s), `the spec lists ${s}`);
});

test('3. one screen per level: everything in a level is in view, the words in their own column with Back and Next', () => {
  const css = read('src/levels/base.css');
  assert.match(css, /\.level \{\s*display: flex; flex-direction: column; height: calc\(100vh - var\(--bar-h\)\); height: calc\(100svh - var\(--bar-h\)\);/, 'each level is one screen under the bar');
  assert.match(css, /:is\(#note-lesson, #mri-lesson, #prism-lesson\) \{\s*flex: 1 1 0; min-height: 0; width: 100%; padding: 1\.2vh 0 0;\s*display: flex; flex-direction: column; container-type: size;/, 'the board is sized from the room the level has');
  assert.match(css, /> \.figure \{\s*flex: none; align-self: center; margin: 0 0 0\.5em;\s*width: min\(100%, calc\(\(100cqh - var\(--reserve\) - clamp\(170px, 34cqh, 300px\)\) \* var\(--aspect\)\)\);/, 'stacked: the board leaves room for the words');
  assert.match(css, /@media \(min-width: 1000px\) and \(min-aspect-ratio: 1\/1\) \{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(300px, 380px\);[\s\S]*> \.reader-column \{ grid-column: 2; grid-row: 1 \/ -1; \}/, 'wide: the board on the left, the words on the right');
  assert.match(css, /\.reader-column > \.prompt \{ flex: 1 1 0; min-height: 0; overflow-y: auto;/);
  const r = read('src/levels/reader.js');
  assert.match(r, /const el = make\('div', 'reader-column'\);[^\n]*\n\s*words\?\.before\(el\);\s*el\.append\(\.\.\.\(words \? \[words\] : \[\]\), row\);/, 'the column: the level\'s words, Back and Next under them');
  assert.match(r, /new MutationObserver\(\(\) => requestAnimationFrame\(\(\) => words\.scrollTo\(\{ top: words\.scrollHeight/, 'the newest line stays in view by itself');
  assert.match(read('src/levels/page.js'), /document\.getElementById\(from\)\.querySelector\('\.reader-column'\)\?\.append\(card\);/, 'the Up next card, on the level\'s own screen');
  assert.match(css, /\.side-toggle \{\s*top: 9px;[^}]*writing-mode: horizontal-tb;/, '"Scroll through" in the top bar, off the boards');
  // Back, on one screen too: the earlier part's picture sized to fit above Back and Next, the live board faded out under it
  assert.match(css, /\.reading-back > :is\(\.figure, \.notes, \.transport, \.controls\) \{ opacity: 0; pointer-events: none; \}/);
  assert.match(css, /\.reader-earlier \.reader-part > \.figure \{ width: min\(100%, calc\(\(100cqh - 120px - clamp\(140px, 30cqh, 260px\)\) \* var\(--aspect\)\)\);/);
  const spec = read('docs/levels_spec.md');
  assert.ok(spec.includes("> i dont want to scroll to see anything in a level in each section,i dont mind scrolling to the next level though") && spec.includes('> take the did you know part out, also take the +1 and level up parts out') && spec.includes("> i can't see the mri brain, skull signal anymore"), "Nadia's messages, verbatim");
});

test('4. one page, three levels: no level styles another level\'s pieces (Level 2\'s .radio once hid the final level\'s data box: Nadia, 2026-11-24, "also where is the middle part")', () => {
  // In a play-through all three stylesheets are on the page. A rule that styles a class on its own (no ancestor in its
  // selector) must not name a class another level puts on its elements, unless the shared page (base.css) owns it.
  const shared = new Set([...read('src/levels/base.css').matchAll(/\.([a-z][\w-]*)/g)].map((m) => m[1]));
  const bare = (s) => new Set([...s.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(?:^|[},]\s*)\s*\.([a-z][\w-]*)((?:\.[a-z][\w-]*|:[\w-]+(?:\([^)]*\))?)*)\s*(?=[{,])/gm)].map((m) => m[1]));
  const used = (s) => new Set([...s.matchAll(/class: [`'"]([^`'"]+)[`'"]/g)].flatMap((m) => m[1].replace(/\$\{[^}]*\}/g, ' ').split(/\s+/))
    .concat([...s.matchAll(/classList\.(?:add|toggle)\(\s*'([\w-]+)'/g)].map((m) => m[1])).filter(Boolean));
  const levels = { note: 'note', mri: 'mri', prism: 'prism' };
  for (const a of Object.keys(levels)) {
    const styled = bare(read(`src/levels/${a}.css`));
    for (const b of Object.keys(levels)) if (a !== b) {
      const u = used(read(`src/levels/${b}.js`));
      const both = [...styled].filter((c) => u.has(c) && !shared.has(c));
      assert.deepEqual(both, [], `${a}.css styles classes that ${b}.js uses: ${both.join(' ')}`);
    }
  }
  assert.match(read('src/levels/prism.js'), /strip\.classList\.add\('scanner-data'\)/, 'the final level\'s data box has a name of its own');
  assert.ok(read('docs/levels_spec.md').includes('> also where is the middle part'), "Nadia's message, verbatim");
});
