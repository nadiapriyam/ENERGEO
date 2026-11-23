// The magazine, and the thought it builds (docs/levels_spec.md, "All three levels: the magazine, and the thought it
// builds"). Guards:
// - each level opens with a cover (name, headline, question) and ends with an "Up next" card carrying the thought on;
// - the thought builds in order: Level 1's big idea (hidden parts), Level 2's (far more hiding in a 0, still so much we
//   don't know, frequencies we can't hear), the final level's (a whole into its hidden parts is possible; a few ways
//   found; just the surface), then ENERGEO, said as what it sets out to do;
// - the "Did you know?" and "The big idea" boxes, kept for Back and the comic; the finale's map, from its math.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LEVELS } from '../src/levels/copyLevels.js';
import { COPY as NOTE } from '../src/levels/copyNote.js';
import { COPY as MRI } from '../src/levels/copyMri.js';
import { COPY as PRISM } from '../src/levels/copyPrism.js';
import { BOARD, MAP, REVEAL, mapKnown, mapUnknown, revealToHub } from '../src/math/prism.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const order = (code, marks, msg) => {
  const at = marks.map((m) => code.indexOf(m));
  assert.ok(at.every((i) => i >= 0), `${msg}: ${marks.filter((m, k) => at[k] < 0)}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, msg);
};

test('1. covers, "Up next" cards and the thought the three levels build, in order, in honest words', () => {
  assert.deepEqual([LEVELS.title1, LEVELS.title2, LEVELS.title3], ['Inside a note', 'Inside the scanner', 'A prism for sound']);
  for (const d of [LEVELS.dek1, LEVELS.dek2, LEVELS.dek3]) assert.ok(d.endsWith('?'), `each cover asks its question: ${d}`);
  assert.equal(LEVELS.dek3, 'Is there any way to perceive these hidden things?', "Nadia's question opens the final level");
  assert.deepEqual([LEVELS.upNext, LEVELS.didYouKnow, LEVELS.bigIdea], ['Up next', 'Did you know?', 'The big idea']);
  const page = read('src/levels/page.js');
  assert.match(page, /'level-1': \[LEVELS\.level1, LEVELS\.title1, LEVELS\.dek1, LEVELS\.soundOn\]/);
  assert.match(page, /span\('up-next-kicker', `\$\{LEVELS\.upNext\} · \$\{name\}`\), span\('up-next-title', title\), span\('up-next-dek', dek\), next\)/, 'the card: Up next, the next level, its headline and question, its button');
  assert.match(page, /next\.addEventListener\('click', async \(\) => \{\s*card\.remove\(\);/, 'the card gives way to the level');
  const mag = read('src/levels/magazine.js');
  assert.match(mag, /make\('aside', 'line fact'\)/);
  assert.match(mag, /make\('span', 'fact-tag', LEVELS\.didYouKnow\)/);
  assert.match(mag, /make\('p', 'line big-idea'\)/);
  assert.match(mag, /make\('span', 'idea-tag', LEVELS\.bigIdea\)/);
  // the thought, level by level
  order(read('src/levels/note.js'), ['say(COPY.oneA)', 'put(fact(COPY.ears))', 'put(bigIdea(COPY.final))'], 'Level 1: one note, many inside; what our ears miss; the big idea');
  assert.match(NOTE.ears, /20 to 20,000/);
  order(read('src/levels/mri.js'), ['say(COPY.magnet[3])', 'say(COPY.picture)', 'say(COPY.eye.line)', 'put(bigIdea(COPY.bigIdea))', 'say(COPY.whole)', 'say(COPY.unknown)', 'say(COPY.compare)', "say(COPY.final, 'final')"],
    'Level 2: the faint reply, the picture, the big idea, a whole person, still so much unknown, then the violin and what our ears miss');
  assert.ok(/faint reply/.test(MRI.magnet[3]) && /faint reply/.test(MRI.picture) && /faint reply/.test(MRI.eye.line), 'the faint reply leads up to the big idea');
  assert.equal(MRI.bigIdea, "There's far more hiding in a 0 than the signal shows us.");
  assert.ok(!/destroy|lost|loses|knows/i.test(MRI.bigIdea + MRI.unknown + MRI.whole), 'B-ZERO-LOSS stays a hypothesis: nothing about leaving the 0 destroying information');
  assert.match(MRI.unknown, /still so many things we don't know about, hiding behind the 0/);
  assert.match(MRI.final, /frequencies our ears can't hear/);
  order(read('src/levels/prism.js'), ['say(COPY.reveal', 'say(COPY.name)', 'put(fact(COPY.fourier))', 'put(bigIdea(COPY.bigIdea))', "mapLayer.classList.add('known')", 'say(COPY.few)', "mapLayer.classList.add('endless')", 'say(COPY.surface', "mapLayer.classList.add('named')", 'say(COPY.energeo.lines[0]', 'say(COPY.final'],
    'the final level: the tool, the big idea, a few found, just the surface, then ENERGEO');
  assert.equal(PRISM.bigIdea, 'Going from a whole to the hidden parts inside it is possible.');
  assert.match(PRISM.opening, /still wondering\.$/, 'the final level picks up the question');
  assert.ok(/^Meet ENERGEO: the start of a new science, energy geometry\.$/.test(PRISM.energeo.lines[0]) && /sets out to map transformations like the Fourier transform/.test(PRISM.energeo.lines[1]), 'ENERGEO, and what it sets out to do');
  assert.match(PRISM.energeo.lines[2], /see what we couldn't before, but that was always there/);
  // kept for Back and the comic, drawn the same in the comic
  const rec = read('tools/record_comic.mjs');
  assert.match(rec, /kind: 'fact'/);
  assert.match(rec, /cls: \['big-idea'\]/);
  assert.match(page, /w\.kind === 'fact' \? box\(fact\(w\.text\)\)/);
  const spec = read('docs/levels_spec.md');
  assert.ok(spec.includes('> i think we should add, the bold statement around from the reply, we get an image portion in level 2.') && spec.includes('Energeo maps all the transfomations that can occur such as the fourier transfomation'), "Nadia's message, verbatim");
  assert.ok(spec.includes('### The thought the three levels build') && spec.includes('### What the new lines claim, and what they do not'));
  const css = read('src/levels/base.css');
  for (const c of ['.fact {', '.big-idea {', '.up-next {', '.level-title {', '.level-dek {']) assert.ok(css.includes(c), `styled: ${c}`);
});

test('2. the finale map: the Fourier transform at the hub, sound, light and MRI lit, and "?" spreading past the edges', () => {
  const { hub, leaf, label } = MAP;
  const known = mapKnown();
  assert.equal(known.length, 3);
  assert.deepEqual(PRISM.mapKnown, ['sound', 'light', 'MRI']);
  known.forEach((p, k) => {
    assert.ok(Math.abs(Math.hypot(p.x - hub.x, p.y - hub.y) - leaf) < 1e-9 && p.x < hub.x, 'around the hub, on its left');
    assert.ok(p.y < hub.y + label.dy - 24, "clear of the hub's label");
    if (k) assert.ok(p.y > known[k - 1].y, 'top to bottom: sound, light, MRI');
  });
  const unknown = mapUnknown();
  assert.ok(unknown.length >= 100 && unknown.filter((n) => n.mark).length >= 20, 'many, many "?"');
  unknown.forEach((n, k) => {
    assert.ok(n.x > hub.x + 40, 'on the far side of the hub');
    assert.ok(!(n.y < MAP.clearTop && Math.abs(n.x - MAP.title.x) < 200), 'clear of the name at the top');
    assert.ok(!(Math.abs(n.x - hub.x) < label.halfW + 12 && Math.abs(n.y - (hub.y + label.dy)) < 22), "clear of the hub's label");
    for (const p of known) assert.ok(Math.hypot(n.x - p.x, n.y - p.y) > MAP.leafR + n.r, 'clear of the lit ones');
    if (k) assert.ok(n.d >= unknown[k - 1].d && n.r <= unknown[k - 1].r + 1e-9 && n.opacity <= unknown[k - 1].opacity + 1e-9, 'further out: smaller and fainter');
  });
  assert.ok(unknown.some((n) => n.x > BOARD.w || n.y < 0 || n.y > BOARD.h), 'spreading past the edges of the board: endless');
  const h = revealToHub();
  assert.ok(h.s < 0.5 && Math.abs(REVEAL.x + h.dx - hub.x) < 1e-9 && Math.abs(REVEAL.y + h.dy - (hub.y + label.dy)) < 1e-9, 'the reveal\'s title becomes the hub\'s label');
});
