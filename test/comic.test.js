// The whole story as a comic, on the side (docs/levels_spec.md, "All three levels: the whole story as a comic, on the
// side"). Guards:
// - a recorded part's still copy points at its own ids, so the live picture keeps its own clip paths and filters;
// - the comic holds every level, start to end, each part a picture that exists, and every word still the levels' own
//   wording (re-record with npm run comic after changing the words);
// - each part is kept (for Back, and for the recorder on try/?record); the tab, the panel and their words; no "All steps".

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { relink } from '../src/levels/record.js';
import { COPY as NOTE } from '../src/levels/copyNote.js';
import { COPY as MRI } from '../src/levels/copyMri.js';
import { COPY as PRISM } from '../src/levels/copyPrism.js';
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

test('2. the comic is the whole story, start to end, in the levels\' own words; the levels play as before; the tab and the panel', () => {
  const comic = JSON.parse(read('src/levels/comic/comic.json'));
  assert.deepEqual(comic.levels.map((l) => l.id), ['level-1', 'level-2', 'level-3'], 'all three levels, in order');
  const strings = (o) => (typeof o === 'string' ? [o] : Array.isArray(o) ? o.flatMap(strings) : o && typeof o === 'object' ? Object.values(o).flatMap(strings) : []);
  const own = {
    'level-1': new Set(strings(NOTE)),
    'level-2': new Set(strings(MRI)),
    'level-3': new Set([...strings(PRISM), PRISM.mri.map((f) => f.text).join('').trim()]),
  };
  const texts = (level) => level.parts.flatMap((p) => p.words.flatMap((w) => (w.kind === 'speaker' ? w.bubbles.map((b) => b.text) : [w.text])));
  for (const level of comic.levels) {
    assert.ok(level.parts.length >= 8, `${level.id}: a part for each moment`);
    for (const part of level.parts) {
      assert.ok(existsSync(new URL(`../src/levels/comic/${part.img}`, import.meta.url)) && part.w === 680 && part.h > 300, `${part.img}: its picture`);
      assert.ok(part.alt.length > 10, `${part.img}: described for screen readers`);
    }
    for (const t of texts(level)) assert.ok(own[level.id].has(t), `${level.id}: "${t}" is no longer the level's wording; record the comic again (npm run comic)`);
  }
  const [l1, l2, l3] = comic.levels.map(texts);
  assert.equal(l1[0], NOTE.opening[0]); assert.equal(l1.at(-1), NOTE.final);
  assert.equal(l2[0], MRI.scanner); assert.equal(l2.at(-1), MRI.final);
  assert.equal(l3[0], PRISM.opening); assert.equal(l3.at(-1), PRISM.final);
  for (const t of [MRI.patient, PRISM.reveal, PRISM.tapBrain, PRISM.mri.map((f) => f.text).join('').trim()]) assert.ok([...l2, ...l3].includes(t), `the comic includes: ${t}`);

  for (const f of ['note', 'mri']) assert.match(read(`src/levels/${f}.js`), /const clear = \(\) => keepPart\(\[figure[\],]/, `${f}.js: its lines clear through keepPart`);
  const prism = read('src/levels/prism.js');
  assert.match(prism, /old\.forEach\(\(n\) => n\.classList\.add\('leaving'\)\);\s*await pause\(REDUCED \? 0 : 280\);\s*keepPart\(\[figure\], prompt\);/, 'Level 3 fades its lines out as before');
  const record = read('src/levels/record.js');
  assert.match(record, /has\('record'\)/);
  assert.match(record, /const keeping = \(\) => recording\(\) \|\| \(!html\(\)\.classList\.contains\('framed'\) && !html\(\)\.classList\.contains\('instant'\)\);/, 'parts are kept for Back and for the recorder, but not in review frames or while fast-forwarding');
  assert.match(record, /if \(!keeping\(\)\) \{ prompt\.replaceChildren\(\); ended\(\); return; \}/);
  const page = read('src/levels/page.js');
  for (const k of ['scrollThrough', 'wholeStory', 'close', 'level1', 'level2', 'level3']) assert.ok(page.includes(`LEVELS.${k}`), `the panel uses ${k}`);
  assert.ok(/import\('\.\/comic\.js'\)/.test(page) && /loading: 'lazy'/.test(page) && /alt: part\.alt/.test(page), 'the comic is drawn from the recording, its pictures loaded as they come into view');
  assert.ok(/aria-expanded/.test(page) && /Escape/.test(page) && /panel\.inert = !on/.test(page), 'the tab opens and closes the panel; closed, it cannot be reached');
  assert.ok(!/allSteps|level-steps/.test(page), 'no "All steps" link');
  assert.deepEqual([LEVELS.scrollThrough, LEVELS.wholeStory, LEVELS.close], ['Scroll through', 'The whole story', 'Close']);
  assert.match(JSON.parse(read('package.json')).scripts.comic, /node tools\/record_comic\.mjs/);
  const spec = read('docs/levels_spec.md');
  const section = spec.slice(spec.indexOf('## All three levels: the whole story as a comic, on the side'), spec.indexOf('## Level 3, "A prism for sound"'));
  assert.ok(section.includes('> like just like a comic book scroll through the user doesnt need to finish it to see the whole story, its like a shortcut to see the whole thing quickly'), "Nadia's request, verbatim");
  assert.ok(section.includes('> take out the all steps in level 3'), "Nadia's request, verbatim");
  assert.ok(section.includes('"Scroll through"') && section.includes('"The whole story"') && /No new claims/.test(section));
});

test('3. go to a scene from the comic: each picture knows where its scene starts; ?jump fast-forwards that level to it (Nadia, 2026-11-24)', () => {
  const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
  const comic = JSON.parse(read('src/levels/comic/comic.json'));
  for (const l of comic.levels) {
    const starts = l.parts.map((p) => p.start);
    assert.ok(starts.every(Number.isInteger) && starts[0] === 0, `${l.id}: every scene's start is recorded, the first at 0`);
    assert.ok(starts.every((v, i) => !i || v > starts[i - 1]), `${l.id}: scenes start in order`);
  }
  const page = read('src/levels/page.js');
  assert.match(page, /href: `\?jump=\$\{level\.id\}\.\$\{part\.start\}`/, 'each picture links to its scene');
  assert.match(page, /LEVELS\.goHere/);
  const jump = read('src/levels/jump.js');
  assert.match(jump, /\^\(level-\[123\]\)\\\.\(\\d\+\)\$/, '?jump=level-N.start');
  assert.match(jump, /e\.detail\.count < jumpTo\.start/, 'it stops once that many parts have ended');
  for (const [f, level] of [['note', 'level-1'], ['mri', 'level-2'], ['prism', 'level-3']]) {
    const main = read(`src/levels/${f}.js`);
    assert.ok(main.includes(`jumping('${level}')`) && main.includes(`onArrive('${level}'`), `${f}.js fast-forwards to a scene, then plays on`);
  }
  assert.match(read('src/levels/record.js'), /partsEnded\[level\] = start \+ 1;/, 'every end of a part is counted, kept or not');
  assert.ok(read('docs/levels_spec.md').includes('> add an option in the scroll through where the user can tap on a scene and the main display goes there'), "Nadia's message, verbatim");
});
