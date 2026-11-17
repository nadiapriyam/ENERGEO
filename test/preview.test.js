// Research progress preview (read-only, 2026-11-17). Guards docs/restructure_decisions.md, "#17 final adversarial lock":
// the preview is generated from existing records and is current; it adds no relation and no status; numbers are auditable
// counts with the decided note and no percentages; the novelty label is used only for the Quinn Eq. (2) correction.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { buildPreview } from '../research/tools/preview_data.mjs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const V = JSON.parse(read('research/preview.json'));
const C = JSON.parse(read('research/canonical_story.json'));
const ledger = JSON.parse(read('verify/ledger/latest.json')).cards;
const decisions = read('docs/restructure_decisions.md');

test('1. research/preview.json is generated from the records and is current', () => {
  assert.deepEqual(V, JSON.parse(JSON.stringify(buildPreview())), 'run node research/tools/preview_data.mjs');
});

test('2. the journey is the canonical 20-node story, in order, with only the five status classes', () => {
  assert.equal(V.journey.length, 20);
  V.journey.forEach((n, i) => {
    const m = C.master[i];
    assert.equal(n.n, m.n);
    assert.equal(n.question, m.q);
    assert.equal(n.relation, m.rel);
    assert.ok(n.status.length > 0 && n.status.every((s) => s in V.classes), `node ${n.n}`);
  });
  assert.deepEqual(Object.keys(V.classes), ['known', 'derived', 'construction', 'open', 'failed']);
  const n17 = V.journey[16];
  assert.deepEqual(n17.predecessors.map((p) => [p.node, p.type]), [[12, 'EARLIER PREDECESSOR']]);
  assert.ok(n17.crossReferences.length >= 4);
});

test('3. proved results: every cited card passes; the #17 group shows the null and massive levels, the failure and the open question', () => {
  assert.deepEqual(V.proved.map((g) => g.id), ['A', 'B', 'C', 'D', 'E', 'F']);
  for (const g of V.proved) {
    for (const p of g.points) for (const c of p.cards) assert.equal(ledger[c]?.verdict, 'PASS', `${g.id}: ${c}`);
    assert.ok(g.cardsPass <= g.cardsTotal && g.cardsTotal > 0, g.id);
  }
  const F = V.proved.find((g) => g.id === 'F');
  assert.ok(F.points.some((p) => p.cls === 'null' && /m = 0 ⇒ null level/.test(p.text)));
  assert.ok(F.points.some((p) => p.cls === 'massive' && /m > 0 ⇒ a nonzero mass-shell level/.test(p.text)));
  assert.match(F.failed, /^FAILED interpretation: mass and wave are complex-conjugate partners/);
  assert.match(F.open, /^OPEN: whether particle and wave descriptions represent a deeper common structure/);
  const C_ = V.proved.find((g) => g.id === 'C');
  assert.deepEqual(C_.counts, { spin: 6, mass: 6 });
  assert.ok(C_.points.some((p) => /no nontrivial predictive transfer/.test(p.text)));
});

test('4. the novelty label is attached only to the Quinn correction, as decided', () => {
  assert.ok(decisions.includes('POSSIBLE NOVELTY — PRIORITY NOT ESTABLISHED'));
  const labelled = V.proved.filter((g) => g.novelty);
  assert.deepEqual(labelled.map((g) => g.id), ['E']);
  assert.equal(labelled[0].novelty, 'POSSIBLE NOVELTY — PRIORITY NOT ESTABLISHED');
  assert.ok(V.proved.find((g) => g.id === 'E').points.some((p) => /^2 exact counterexamples to Quinn et al\. 2019, Eq\. \(2\)/.test(p.text)));
});

test('5. open questions: six groups, exact recorded wording, no confidence values', () => {
  const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
  assert.equal(V.open.length, 6);
  for (const g of V.open) {
    assert.equal(g.question, reg.get(g.record).words, g.id);
    assert.equal(g.status, reg.get(g.record).status, g.id);
    assert.ok(!/%/.test(JSON.stringify(g)), `${g.id}: no percentages`);
  }
});

test('6. numbers are auditable counts with the decided note; no percentages for truth, confidence or novelty', () => {
  assert.equal(V.note, 'Verification counts report executable checks in this repository. They are not peer review, independent replication, probabilities of truth, or measures of originality.');
  assert.ok(decisions.includes(V.note));
  for (const n of V.numbers) assert.ok(!/%/.test(n.value) && !/confidence|originality|probability/i.test(n.label), n.label);
  assert.equal(V.countsNote, 'Repository counts describe records and executable checks in this project. They are not counts of independent discoveries, peer-reviewed results, probabilities of truth, or measures of originality.');
  const lab = (re) => V.numbers.find((n) => re.test(n.label));
  assert.match(lab(/^User provenance/).label, /registry records tagged USER-ORIGIN/);
  assert.match(lab(/^User provenance/).detail, /Not a count of independent theories or original ideas\./);
  assert.match(lab(/^Project-derived \/ project-built/).label, /Foundation objects classified PROJECT-DERIVED or PROJECT-BUILT/);
  assert.match(lab(/^Project-derived \/ project-built/).detail, /Not a count of novel theorems or independent discoveries\./);
  assert.match(lab(/^Open questions/).label, /including subquestions/);
  assert.match(lab(/^Open questions/).detail, /Not a count of independent research programmes\./);
  assert.ok(!V.numbers.some((n) => /original ideas|discoveries$|theories$/i.test(n.label)), 'labels do not present records as discoveries');
  const cards = Object.values(ledger);
  assert.equal(V.numbers[0].value, `${cards.filter((c) => c.verdict === 'PASS').length} / ${cards.length}`);
});

test('7. the preview page is a separate read-only entry in the build; the stopping point is stated', () => {
  assert.ok(existsSync(new URL('../research-preview/index.html', import.meta.url)));
  assert.match(read('vite.config.js'), /research-preview\/index\.html/);
  const js = read('src/preview/main.js');
  assert.ok(!/localStorage|fetch\(|journey\.js|research\/[a-z_]+\.json'\s*;?\s*$/m.test(js.replace("import data from '../../research/preview.json';", '')), 'reads only research/preview.json');
  assert.ok(!/writeFile|innerHTML\s*=/.test(js), 'no writing');
  assert.equal(V.lock.stop, 'Research is paused after the #17 lock. No subsequent branch has been started. The preview represents the current canonical state of the project.');
  assert.ok(decisions.includes(V.lock.stop));
});
