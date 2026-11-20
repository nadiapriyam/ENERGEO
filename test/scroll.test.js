// Scrolling through the levels, as in a Mathigon course, and full screen (docs/levels_spec.md, "All three levels:
// scrolling, and full screen"). Guards:
// - a kept part's still copy points at its own ids, so the live picture keeps its own clip paths, gradients and filters;
// - every level keeps each part when it clears its lines; full screen hides the kept parts and the other levels;
// - the switch and its labels; Nadia's request, verbatim.

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

test('2. every level keeps its parts on the page; full screen shows only the level being played; the switch and its words', () => {
  for (const f of ['note', 'mri']) assert.match(read(`src/levels/${f}.js`), /const clear = \(\) => keepPart\(\[figure[\],]/, `${f}.js keeps each part`);
  const prism = read('src/levels/prism.js');
  const clearFn = prism.slice(prism.indexOf('async function clear()'), prism.indexOf('}\n', prism.indexOf('keepPart([figure], prompt)')) + 1);
  assert.ok(/if \(fullScreen\(\)\)[\s\S]*leaving[\s\S]*keepPart\(\[figure\], prompt\)/.test(clearFn), 'Level 3 fades its lines only in full screen, and keeps each part');
  const scroll = read('src/levels/scroll.js');
  assert.ok(/framed/.test(scroll) && /instant/.test(scroll), 'no parts are kept in a frame of the review strip, or while fast-forwarding');
  assert.ok(/getBoundingClientRect\(\)\.top < innerHeight;[^\n]*before/.test(scroll), 'whether you are following is measured before the kept part is added');
  assert.ok(/part\.inert = true/.test(scroll), 'a kept part cannot be pressed');
  const html = read('try/index.html');
  assert.ok(/<section class="level live" id="level-1">\s*<p class="level-tag" id="level-1-tag"><\/p>\s*<main class="lesson" id="note-lesson"><\/main>\s*<p class="lesson"><button[^>]*id="next-level"/.test(html), 'Level 1 is a level like the others, live first');
  const page = read('src/levels/page.js');
  assert.ok(/classList\.add\('live'\)/.test(page) && /LEVELS\.fullScreen/.test(page) && /LEVELS\.exitFullScreen/.test(page) && /requestFullscreen/.test(page) && /fullscreenchange/.test(page), 'the switch');
  const css = read('src/levels/base.css');
  assert.ok(css.includes('html.full-screen .kept-part, html.full-screen .level:not(.live) { display: none; }'), 'full screen: only the live level, one part at a time');
  assert.ok(css.includes('html { overflow-anchor: none; }') && /\.kept-part \.action \{ display: none; \}/.test(css), 'a kept part pushes the story down; its finished buttons are gone');
  assert.equal(LEVELS.fullScreen, 'Full screen');
  assert.equal(LEVELS.exitFullScreen, 'Exit full screen');
  const spec = read('docs/levels_spec.md');
  const section = spec.slice(spec.indexOf('## All three levels: scrolling, and full screen'), spec.indexOf('## Level 3, "A prism for sound"'));
  assert.ok(section.includes('> also i want it to be like mathigon.org how you just scroll to go through the levels. this right now can be a full screen mode'), "Nadia's request, verbatim");
  assert.ok(section.includes('"Full screen"') && section.includes('"Exit full screen"') && /No new claims/.test(section));
});
