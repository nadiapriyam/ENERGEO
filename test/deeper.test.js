// "Go deeper" (docs/levels_spec.md, "The final level: "Go deeper", the research behind ENERGEO"). Guards:
// - the page's research content is read from the records, unchanged: Nadia's hypotheses in her words, the statuses,
//   the proved and open groups, and the current application matrix (rows, ratings, novelty line);
// - ENERGEO is shown as a hypothesis, its own application as open, and the known applications as known mathematics;
// - every word the page adds, and the card at the end of the final level, are listed in the spec with Nadia's message;
// - going to a scene does not wait for the lines passed over while fast-forwarding.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DEEPER } from '../src/deeper/copyDeeper.js';
import { hypothesis, currentApplications } from '../src/deeper/records.js';
import { LEVELS } from '../src/levels/copyLevels.js';
import { COPY as PRISM } from '../src/levels/copyPrism.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const data = JSON.parse(read('research/preview.json'));
const strings = (o) => (typeof o === 'string' ? [o] : Object.values(o).flatMap(strings));

test('1. the hypotheses: H1–H3 in Nadia\'s words, verbatim from the records, and her shared evidence', () => {
  const hs = ['H1', 'H2', 'H3'].map((id) => [id, read(`research/hypotheses/${id}.md`)]);
  for (const [id, md] of hs) {
    const x = hypothesis(md);
    assert.equal(x.id, id);
    assert.ok(x.title.length > 10, `${id}: title`);
    const block = md.slice(md.indexOf('## Your words'));
    const firstQuote = /\n> ([^\n]+)/.exec(block)[1];
    assert.ok(x.words.startsWith(firstQuote.trim()), `${id}: Nadia's words, verbatim`);
    assert.ok(x.evidence.startsWith('fourier transform: there is an orthonormal basis'), `${id}: her shared evidence`);
  }
  assert.match(read('docs/objective.md'), /HYPOTHESIS/, 'the objective gives H1–H3 the status HYPOTHESIS');
  assert.equal(DEEPER.hypothesis, 'Hypothesis');
  const main = read('src/deeper/main.js');
  assert.match(main, /class: 'badge badge-open' }, h\('i', \{ 'aria-hidden': 'true' \}\), DEEPER\.hypothesis\)/, 'each hypothesis carries the open badge, "Hypothesis"');
});

test('2. the applications tested: the current version of the application matrix, unchanged', () => {
  const md = read('research/application_matrix.md');
  const a = currentApplications(md);
  assert.match(a.title, /: current$/, 'the version marked current');
  const block = md.slice(md.indexOf('\n## Version'), md.indexOf('\n## ', md.indexOf('\n## Version') + 4));
  const rows = block.split('\n').filter((l) => l.startsWith('|')).slice(2).map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
  assert.ok(rows.length >= 1);
  assert.equal(a.rows.length, rows.length, 'every row');
  a.rows.forEach((r, k) => {
    assert.ok(rows[k].includes(r.candidate) && rows[k].includes(r.result) && rows[k].includes(r.depth), `row ${k + 1}: as recorded`);
    assert.ok(rows[k].includes(String(r.support)) && rows[k].includes(String(r.risk)), `row ${k + 1}: Backbone Support % and AI Slop / Delusion Risk %, as recorded`);
    assert.ok(Number.isFinite(r.support) && Number.isFinite(r.risk));
  });
  assert.match(a.novelty, /VALIDATION OF KNOWN MATHEMATICS/);
  assert.match(a.novelty, /No nontrivial predictive transfer\.$/);
  assert.deepEqual(DEEPER.apps.columns, ['Candidate', 'Result', 'Transfer depth', 'Backbone support', 'AI slop / delusion risk']);
  const main = read('src/deeper/main.js');
  assert.match(main, /h\('p', \{ class: 'novelty' \}, apps\.novelty\)/, 'with its novelty line');
});

test('3. statuses come from the records: badges use the preview\'s classes; ENERGEO\'s application is open; known applications are known', () => {
  const main = read('src/deeper/main.js');
  assert.match(main, /import data from '\.\.\/\.\.\/research\/preview\.json'/);
  assert.match(main, /data\.classes\[cls\]/, 'badge names from the records');
  assert.match(main, /badges\(j\.status\)/, 'each step of the journey: its recorded statuses');
  assert.match(main, /data\.open\.map\(\(g\) => .*badge\('open'\)/, 'every open question: open');
  assert.match(main, /data\.open\.find\(\(g\) => \/energeo\/i\.test\(g\.title\)\)/, 'ENERGEO\'s application: the open question from the records');
  const e = data.open.find((g) => /energeo/i.test(g.title));
  assert.equal(e.status, 'open');
  assert.match(main, /knownList\.map\(.*badge\('known'\)/, 'the known applications: known mathematics');
  assert.equal(data.proved.length, 6);
  for (const g of data.proved) assert.ok(g.tex.length && Number.isInteger(g.cardsPass) && Number.isInteger(g.cardsTotal));
  assert.match(main, /`\$\{g\.cardsPass\} \/ \$\{g\.cardsTotal\} verifier cards pass`/);
});

test('4. the page\'s own words: listed in the spec with Nadia\'s message; no overclaim, no vague praise', () => {
  const spec = read('docs/levels_spec.md');
  assert.ok(spec.includes('> is there a way we can include a snapshot of what we worked on with energeo before starting these interactives that we can put on the last slide for those who want to explore more deeply, and mathematically what energeo specifically is and the geometries associated with it, and a snapshot of some applications associated with what we talked about?'), "Nadia's message, verbatim");
  for (const s of strings(DEEPER)) assert.ok(spec.includes(`"${s}"`), `in the spec: ${s}`);
  for (const k of ['deeperKicker', 'deeperTitle', 'deeperDek', 'deeperOpen']) assert.ok(spec.includes(`"${LEVELS[k]}"`), `in the spec: ${LEVELS[k]}`);
  const own = strings(DEEPER).join(' ');
  assert.ok(!/\b(stronger|closer|promising|interesting|important|suggestive)\b/i.test(own), 'no vague praise');
  assert.ok(!/\b(proves?|proven|confirms?|discover(ed|s)?)\b/i.test(own.replace('Report only what the evidence actually proves.', '')), 'ENERGEO is not said to be proved');
  assert.match(DEEPER.what.lede, /hypothesis/);
  assert.match(DEEPER.what.lede, /records only what is proved/);
  assert.equal(DEEPER.what.honest, 'Search as though the theorem is true. Report only what the evidence actually proves.');
  assert.ok(read('docs/objective.md').includes(DEEPER.what.honest), 'the objective\'s own words');
  assert.ok(!/fourth dimension|proton|conscious/i.test(own));
});

test('5. on the last slide: the "Go deeper" card after the final level\'s last line; the page is built', () => {
  const page = read('src/levels/page.js');
  assert.match(page, /function goDeeper\(from\)/);
  assert.match(page, /goDeeper\('prism-lesson'\)/);
  assert.match(page, /href: 'deeper\/', textContent: LEVELS\.deeperOpen/);
  assert.match(page, /addEventListener\('level-finished'/);
  assert.equal(LEVELS.deeperKicker, 'Go deeper');
  assert.equal(LEVELS.deeperTitle, DEEPER.title);
  assert.equal(PRISM.final, 'You just took your first steps into it.', 'the story still ends on its last line');
  assert.match(read('vite.config.js'), /deeper: resolve\(here, 'try\/deeper\/index\.html'\)/);
  assert.match(read('try/deeper/index.html'), /<script type="module" src="\/src\/deeper\/main\.js"><\/script>/);
  assert.match(read('src/deeper/main.js'), /href: '\.\.\/\.\.\/research-preview\/' \}, DEEPER\.more/, 'and on to the full research preview');
});

test('6. going to a scene: lines passed over while fast-forwarding are not waited for', () => {
  const reader = read('src/levels/reader.js');
  const ingest = reader.slice(reader.indexOf('const ingest = (records) => {'), reader.indexOf('const watch ='));
  assert.match(ingest, /^const ingest = \(records\) => \{\n\s+if \(fast\(\)\) return;/);
});
