// Canonical story diagnostic (2026-11-16). Guards docs/restructure_decisions.md, "Canonical story diagnostic": the
// Master Story (the historical question-by-question journey) is kept beside the Foundation Spine; every relation is
// placed between the question that demanded it and the question it created; every Foundation domain is aligned;
// Act VIII is placed inside the existing story; the κ-family is parked; missing connectives are added.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const C = JSON.parse(read('research/canonical_story.json'));
const F = JSON.parse(read('research/foundation.json'));
const A8 = JSON.parse(read('research/act8.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const mm = read('docs/Interactive_Master_Map.extracted.md');
const decisions = read('docs/restructure_decisions.md');
const map = read('research/master_math_map.md');
const md = read('research/canonical_story.md');

test('1. the Master Story keeps the 20 historical nodes in their order, titles verbatim', () => {
  assert.equal(C.master.length, 20);
  C.master.forEach((m, i) => {
    assert.equal(m.n, i + 1);
    assert.ok(mm.includes(`${m.n}. ${m.title}`), `M${m.n} title verbatim`);
    assert.ok(m.q && m.rel && m.nxt && m.spine.every((s) => C.spine.includes(s)), `M${m.n}`);
  });
  for (const t of C.mmTransitions) assert.ok(mm.includes(t.text), t.text);
  assert.ok(decisions.includes('> 18. Finite circle / unbounded time / infinity question.'));
});

test('2. both levels are kept: the spine summarizes the Master Story and does not replace it', () => {
  assert.match(md, /\*\*This is a diagnostic artifact, not a replacement architecture\.\*\*/);
  assert.ok(map.includes('**Two levels: the Master Story and the Foundation Spine (canonical story diagnostic, 2026-11-16).**'));
  assert.ok(decided('is a higher-level summary of the same story, not a replacement for the historical sequence.'));
  assert.match(C.provenance.notAvailable, /not in this repository/);
});
function decided(t) { return decisions.includes(t); }

test('3. every chain runs question → relation → next question, in discovery order', () => {
  for (const [k, ch] of Object.entries(C.chains)) {
    assert.equal(ch.steps[0].kind, 'Q', k);
    ch.steps.forEach((s, i) => { if (i) assert.notEqual(s.kind, ch.steps[i - 1].kind, `${k}: alternates`); });
  }
  const A = C.chains.A.steps.map((s) => s.text);
  const iM = A.findIndex((t) => /What happens when M ≠ I\?/.test(t)), iA = A.findIndex((t) => /A†MA = M \(CF1\)/.test(t)), iX = A.findIndex((t) => /relative to zero/.test(t));
  assert.ok(iX === 0 && iX < iM && iM < iA, 'Chain A: zero and norm before M, M before A†MA = M');
  const Fo = C.chains.F.steps.map((s) => s.text);
  const iZero = Fo.findIndex((t) => /f̂\(k\) = 0 while f ≠ 0/.test(t)), iOrth = Fo.findIndex((t) => /⟨e_j, e_k⟩ = δ_jk/.test(t));
  assert.ok(iZero >= 0 && iZero < iOrth, 'Fourier: the zero coefficient before orthogonality');
  assert.ok(C.chains.PB.steps.some((s) => /a refinement of the original question, not a new story/.test(s.text)));
  assert.ok(C.chains.IG.steps.some((s) => /C7 is not why model manifolds are in the story/.test(s.text)));
  assert.ok(C.chains.E.steps.some((s) => /never upstream evidence/.test(s.text)));
  assert.ok((md.match(/```mermaid/g) || []).length === 1 + Object.keys(C.chains).length);
});

test('4. every Foundation domain is aligned once, with actions from the allowed list', () => {
  const doms = F.domains.map((d) => d.id).sort();
  assert.deepEqual(C.alignment.map((a) => a.domain).sort(), doms);
  for (const a of C.alignment) {
    assert.ok(a.actions.length && a.actions.every((x) => C.actions.includes(x)), a.domain);
    assert.ok(a.predecessor && a.verdict, a.domain);
  }
  const d40 = C.alignment.find((a) => a.domain === 'D40');
  for (const x of ['RECLASSIFY', 'SUPERSEDE WORDING', 'PARK AS OPTIONAL']) assert.ok(d40.actions.includes(x), x);
  assert.equal(F.domains.find((d) => d.id === 'D40').name, 'Supporting mathematics for #14 → #18 / #19 (Act VIII)');
});

test('5. Act VIII is placed inside the existing story, not as a replacement', () => {
  const cat = new Map(C.act8.map((x) => [x.objects, x.category]));
  for (const x of C.act8) assert.ok(Object.keys(C.categories).includes(x.category), x.item);
  assert.equal(cat.get('A8C'), 'A');
  assert.equal(C.act8.find((x) => x.item.startsWith('generator theorem')).category, 'C');
  assert.equal(cat.get('A8F'), 'B');
  assert.equal(cat.get('A8E'), 'B');
  assert.equal(cat.get('A8Q'), 'D');
  assert.match(C.act8.find((x) => x.item.startsWith('generator theorem')).note, /the existing CF4 \(BR11\), re-carded/);
  assert.match(obj.get('A8G').foundationRole, /existing CF4 \/ BR11, re-carded/);
  assert.match(A8.story.contribution, /does not replace the circle \/ periodicity \/ infinity question/);
  assert.ok(A8.superseded.some((x) => /Act VIII supplies the exact link/.test(x.old)));
  assert.ok(map.includes('*The historical question leads (F10, canonical story):*'));
});

test('6. the κ-family is parked: kept, not a story node, not expanded', () => {
  assert.equal(C.kappa.verdict, 'PARK AS OPTIONAL (supporting note)');
  assert.match(C.kappa.question, /None directly/);
  assert.match(obj.get('A8Q').foundationRole, /^PARKED AS OPTIONAL/);
  assert.match(A8.kappa.status, /^PARKED AS OPTIONAL/);
  assert.ok(map.includes('*Parked as an optional later construction (canonical story\n  diagnostic; not a story node):*'));
  assert.ok(reg.get('T-H3-C-FAMILY').boundaries.some((b) => /κ-family part \(A8Qa, A8Qb\) is PARKED AS OPTIONAL/.test(b)));
});

test('7. the missing connectives are in the master map, each before the material it explains', () => {
  const before = (a, b) => map.indexOf(a) >= 0 && map.indexOf(a) < map.indexOf(b);
  assert.ok(before('*How the question arrived (Chain A, canonical story):*', '**The architecture** (CF1, CF2):'));
  assert.ok(before('*Story order for Fourier (F2, canonical story):*', '| signals / functions |'));
  assert.ok(before('*Why model manifolds are in the story (F3, canonical story):*', '### Model manifolds: invariance and the research story'));
  assert.ok(before('*Where the energy question comes from (F9, canonical story):*', '- **A1, Energeo:**'));
  assert.ok(map.includes('| Zero frequency (k = 0, ω = 0; Master Map #13) |'));
  assert.equal(C.missing.length, 10);
});

test('8. continuity: every numbered transition is checked, and every "no" names its repair', () => {
  for (let i = 1; i < 20; i++) assert.ok(C.continuity.some((c) => c.transition === `M${i} → M${i + 1}`), `M${i} → M${i + 1}`);
  for (const c of C.continuity) if (/^no|^partly/.test(c.verdict)) assert.match(c.verdict, /repaired by/, c.transition);
  for (const e of C.extraEdges) assert.ok(/^M\d+$/.test(e.src) && /^M\d+$/.test(e.dst) && e.why, `${e.src} → ${e.dst}`);
});

test('9. Pair A keeps the question that created it; the lock choice is one of the two decided', () => {
  const pa = reg.get('T-PAIRA-Q');
  assert.equal(pa.words, 'A mass-balance zero identifies a distinguished structural location.');
  assert.equal(pa.status, 'open');
  assert.ok(decided(pa.words));
  assert.ok(['READY FOR ACT VIII ADVERSARIAL LOCK AFTER STORY ALIGNMENT', 'STORY ALIGNMENT STILL HAS A SPECIFIC GAP'].includes(C.lock.choice));
  assert.ok(decided(C.lock.choice));
});
