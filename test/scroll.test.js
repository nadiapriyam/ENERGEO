// Scrolling through on the side (docs/levels_spec.md, "All three levels: the regular layout, and scrolling through on
// the side"). Guards:
// - a kept part's still copy points at its own ids, so the live picture keeps its own clip paths, gradients and filters;
// - every level plays as before and keeps each part, when it clears its lines, in the side panel, never on the page;
// - the tab, the panel and their words; Nadia's request, verbatim.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { relink } from '../src/levels/scroll.js';
import { LEVELS } from '../src/levels/copyLevels.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test("1. a still copy's references are its own: url(#id) and #id are renamed together, nothing else is touched", () => {
  const ids = new Map([['p3-glow', 'p3-glow--kept-1'], ['lens', 'lens--kept-1']]);
  assert.equal(relink('url(#p3-glow)', ids), 'url(#p3-glow--kept-1)');
  assert.equal(relink("url('#lens')", ids), "url('#lens--kept-1')");
  assert.equal(relink('url("#lens")', ids), 'url("#lens--kept-1")');
  assert.equal(relink('#lens', ids), '#lens--kept-1', 'an href');
  assert.equal(relink('filter: url(#p3-glow); clip-path: url(#lens)', ids), 'filter: url(#p3-glow--kept-1); clip-path: url(#lens--kept-1)', 'an inline style');
  for (const v of ['url(#other)', '#other', 'M 0 0 L 10 10', 'lens', '#lens and more', 'translate(4px, 2px)']) assert.equal(relink(v, ids), v, `left alone: ${v}`);
});

test('2. the regular layout plays; every finished part goes into the side panel, to scroll through; the tab, the panel and their words', () => {
  for (const f of ['note', 'mri']) assert.match(read(`src/levels/${f}.js`), /const clear = \(\) => keepPart\(\[figure[\],]/, `${f}.js keeps each part`);
  const prism = read('src/levels/prism.js');
  const clearFn = prism.slice(prism.indexOf('async function clear()'), prism.indexOf('}\n', prism.indexOf('keepPart([figure], prompt)')) + 1);
  assert.ok(/old\.forEach\(\(n\) => n\.classList\.add\('leaving'\)\);\s*await pause\(REDUCED \? 0 : 280\);\s*keepPart\(\[figure\], prompt\);/.test(clearFn), 'Level 3 fades its lines out as before, then keeps the part');
  assert.ok(!/fullScreen|full-screen/.test(prism + read('src/levels/page.js') + read('src/levels/base.css')), 'no full screen mode');
  const scroll = read('src/levels/scroll.js');
  assert.ok(/framed/.test(scroll) && /instant/.test(scroll), 'no parts are kept in a frame of the review strip, or while fast-forwarding');
  assert.ok(/querySelector\('\.side-parts'\)/.test(scroll) && /list\.append\(part\)/.test(scroll) && !/\.before\(part\)/.test(scroll) && !/scrollIntoView/.test(scroll), 'a part goes into the panel, never onto the page, and the page is not moved');
  assert.ok(/part\.inert = true/.test(scroll), 'a kept part cannot be pressed');
  assert.ok(/<section class="level" id="level-1">\s*<p class="level-tag" id="level-1-tag"><\/p>\s*<main class="lesson" id="note-lesson"><\/main>/.test(read('try/index.html')), 'Level 1 is a level like the others, so its parts go under its name');
  const page = read('src/levels/page.js');
  for (const k of ['scrollThrough', 'soFar', 'soFarEmpty', 'close']) assert.ok(page.includes(`LEVELS.${k}`), `the panel uses ${k}`);
  assert.ok(/aria-expanded/.test(page) && /Escape/.test(page) && /panel\.inert = !on/.test(page), 'the tab opens and closes the panel; closed, it cannot be reached');
  const css = read('src/levels/base.css');
  assert.ok(css.includes('html.side-open .side { transform: none;') && css.includes('.kept-part .action { display: none; }'), 'the panel slides in; finished buttons are gone');
  assert.deepEqual([LEVELS.scrollThrough, LEVELS.soFar, LEVELS.soFarEmpty, LEVELS.close], ['Scroll through', 'The story so far', 'Each part you finish appears here.', 'Close']);
  const spec = read('docs/levels_spec.md');
  const section = spec.slice(spec.indexOf('## All three levels: the regular layout, and scrolling through on the side'), spec.indexOf('## Level 3, "A prism for sound"'));
  assert.ok(section.includes('> no make he regular without scroll aka how we had it before the scroll, the defult and make a scroll through feature on the side.'), "Nadia's request, verbatim");
  assert.ok(section.includes('"Scroll through"') && section.includes('"The story so far"') && section.includes('"Close"') && /No new claims/.test(section));
  assert.ok(spec.includes('## All three levels: scrolling, and full screen (2026-11-20), superseded by the next section.'), 'the scroll layout is kept in the record, superseded');
});
