// Master Map #17, first construction (2026-11-17), and the two pre-#17 story-fidelity patches. Guards the decisions in
// docs/restructure_decisions.md, "Pre-#17 story patches and the first #17 construction": the torus wording is scoped; STAR-A's
// failure is a lesson followed by a cross-reference, not the cause of the generator question; #17 starts from Fourier
// conjugacy and is not defined as mass-wave; candidate physical pairs are tested against explicit criteria; each mass/wave
// reading has its own status; no QFT shortcut; no new story node.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const P = JSON.parse(read('research/p17.json'));
const C = JSON.parse(read('research/canonical_story.json'));
const A8 = JSON.parse(read('research/act8.json'));
const F = JSON.parse(read('research/foundation.json'));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const decisions = read('docs/restructure_decisions.md');
const rec = read('research/constructions/p17_conjugacy_physical_pairs.md');
const story = read('research/canonical_story.md');
const map = read('research/master_math_map.md');
const decided = (t) => decisions.includes(t);
const pass = (...ids) => ids.every((c) => latest[c]?.verdict === 'PASS');
const edge = (a, b) => C.edges.find((e) => e.src === a && e.dst === b);
const live = (t) => t.split('\n').filter((l) => !/[Ss]uperseded|SUPERSEDED|kept as history|Moved 2026-11-17/.test(l)).join('\n');

test('1. the #17 cards are on the ledger and pass; the kept FAILs are unchanged', () => {
  assert.equal(P.cards.length, 34);
  assert.deepEqual([...P.cards].sort(), Object.keys(latest).filter((k) => k.startsWith('P17')).sort());
  assert.ok(pass(...P.cards, ...P.earlierCards));
  assert.deepEqual(Object.keys(latest).filter((k) => latest[k].verdict !== 'PASS').sort(), ['B5a', 'C8c', 'CFT6b', 'S14a', 'Z1a', 'Z2b']);
});

test('2. pre-#17 patch 1: the torus wording is scoped, and the same torus also carries periodic flows', () => {
  for (const t of ['the irrational/rationally-independent torus flow used here has dense orbit and no exact period.', 'Preserve that the same torus geometry can also carry periodic flows.', 'Do not reopen Act VIII.']) assert.ok(decided(t), t);
  const torus = C.act8.find((x) => x.item.startsWith('torus'));
  assert.match(torus.item, /the irrational\/rationally-independent torus flow used here has dense orbit and no exact period/);
  assert.match(torus.item, /the same torus geometry also carries periodic flows/);
  assert.equal(torus.group, '#18 answer');
  const storyLive = story.slice(0, story.indexOf('## Superseded statements')) + story.slice(story.indexOf('## H–I. Verdicts'));
  for (const t of [live(storyLive), JSON.stringify(C.act8), JSON.stringify(C.chains), JSON.stringify(A8.placement), live(map)]) {
    assert.ok(!/dense irrational flow, never periodic|torus: compact, possibly never periodic/.test(t));
  }
  assert.match(C.mathLock.find((r) => r.statement.startsWith('irrational torus flow')).assumptions, /the same torus geometry carries periodic flows/);
  assert.ok(reg.get('T-COMPACT-NOT-PERIODIC').variants.some((v) => v.words === 'Preserve that the same torus geometry can also carry periodic flows.'));
});

test('3. pre-#17 patch 2: STAR-A failure → lesson, then a CROSS-REFERENCE; it did not cause the generator question', () => {
  assert.ok(decided("STAR-A's failure must NOT be represented as historically causing the invariant-form/generator question."));
  assert.ok(decided('STAR-A failure → geometry alone does not force periodicity'));
  const pb = C.chains.PB.steps;
  const fail = pb.findIndex((s) => s.kind === 'R' && /STAR-A FAIL → geometry alone does not force periodicity/.test(s.text));
  assert.ok(fail > 0, 'the lesson step');
  assert.equal(pb[fail + 1].kind, 'X', 'a cross-reference follows the lesson, not a question it created');
  assert.match(pb[fail + 1].text, /already-existing invariant-geometry questions about constraints .* symmetries .* preserved relations and transformations/);
  assert.ok(!pb.slice(fail + 1).some((s) => s.kind === 'Q'), 'no question in chain PB is presented as created by STAR-A');
  assert.match(story, /PB5 -\. xref \.-> PB6/);
  const f = C.failures.find((x) => x.failure.startsWith('STAR-A'));
  assert.match(f.nextQuestion, /^none created .*CROSS-REFERENCE/);
  for (const t of [JSON.stringify(C.act8), JSON.stringify(A8.placement)]) assert.ok(!/created by STAR-A\\?'s failure', 'the next question of the ★ chain/.test(t));
  for (const b of reg.get('T-GEN-DYN-Q').boundaries.filter((x) => /created by STAR-A/.test(x))) assert.match(b, /^SUPERSEDED/);
  assert.match(A8.story.starAvsBackbone, /CROSS-REFERENCE/);
  assert.match(A8.story.starAvsBackbone, /did not historically cause/);
  assert.match(A8.story.starAvsBackbone, /not the Foundation\/backbone failing/);
  assert.equal(A8.star.find((s) => s.id === 'STAR-A').status, 'FAIL', 'Act VIII not reopened: STAR-A stays FAIL');
});

test('4. #17 begins at the historical question and Fourier conjugacy; it is not defined as mass-wave', () => {
  for (const t of ['Do NOT assume yes.', 'Do NOT define the branch as “mass-wave” before testing this question.', 'Mass/wave is one candidate investigation within the branch.',
    'Fourier pair → exact mathematical conjugacy → what information does the pairing encode? → do physical pairings ever share an exact relation of comparable structural depth?']) assert.ok(decided(t), t);
  assert.equal(P.history.path, 'Fourier pair → exact mathematical conjugacy → what information does the pairing encode? → do physical pairings ever share an exact relation of comparable structural depth?');
  assert.match(P.history.notAssumed, /not assumed to be yes/);
  const m17 = C.master[16];
  assert.match(m17.rel, /not claimed to be mathematically conjugate/);
  assert.match(m17.nxt, /mass\/wave being one/);
  assert.ok(!/the parked mass-wave branch/.test(m17.nxt));
  assert.equal(reg.get('T-P17-GOV').status, 'governance');
  assert.ok(rec.indexOf('## B. Fourier conjugacy') < rec.indexOf('### Candidate pairs') && rec.indexOf('### Candidate pairs') < rec.indexOf('## D. Dispersion'), 'source relation and criteria before the physical mathematics');
  const steps = C.chains.P17.steps.map((s) => s.text);
  assert.ok(steps.findIndex((t) => /what information does the pairing encode/.test(t)) < steps.findIndex((t) => /real classical field/.test(t)));
  assert.ok(steps.findIndex((t) => /do physical pairings ever share/.test(t)) < steps.findIndex((t) => /dispersion relation/.test(t)));
});

test('5. the source relation: what forces the conjugacy, the DFT, DC and Nyquist, the failure case', () => {
  assert.match(P.forcedBy, /realness/);
  const items = P.source.map((s) => s.item);
  for (const i of ['continuous', 'DFT (finite index)', 'DC and Nyquist exceptions', 'redundant degrees of freedom', 'what the pairing encodes', 'failure case (P17-X1)', 'four properties separated']) assert.ok(items.includes(i), i);
  for (const s of P.source) assert.ok(pass(...s.cards), s.item);
  assert.match(P.source.find((s) => s.item === 'four properties separated').statement, /equal magnitude AND opposite phase/);
  assert.ok(decided('for a generic complex-valued signal, this conjugate symmetry need not hold.'));
});

test('6. "same structure" is defined before any physical example; candidate pairs carry no filled-in common relation', () => {
  const tc = ['a transformation relating the pair;', 'an involution or symmetry operation;', 'a preserved relation;', 'a reconstruction or reality constraint;', 'paired coordinates carrying non-independent information;', 'a common quadratic/bilinear relation;', 'a group/representation-theoretic origin.'];
  for (const t of tc) assert.ok(decided(t), t);
  assert.deepEqual(P.criteria.map((c) => `${c.text}${c.id === 'TC7' ? '.' : ';'}`), tc);
  assert.deepEqual(P.levels.map((l) => l.name), ['visual analogy', 'shared equation', 'shared transformation structure', 'shared representation-theoretic structure']);
  for (const c of P.candidates) {
    assert.equal(c.candidateCommonRelation, null, c.id);
    assert.deepEqual(Object.keys(c.criteria), ['TC1', 'TC2', 'TC3', 'TC4', 'TC5', 'TC6', 'TC7'], c.id);
    for (const k of ['object', 'representation', 'relation', 'transformation', 'invariant', 'null', 'shared', 'notShared']) assert.ok(c[k], `${c.id}: ${k}`);
    assert.ok(pass(...c.cards), c.id);
  }
  assert.match(P.candidates.find((c) => c.id === 'PC-1').level, /same theorem/);
});

test('7. dispersion in spectral variables; four nulls kept apart; mass selects a non-null level', () => {
  for (const t of ['Do not call this physical spacetime.', 'They are not one kind of zero.', 'Does mass appear as a parameter selecting a non-null level set of the same quadratic form whose m=0 case is null?']) assert.ok(decided(t), t);
  assert.ok(P.dispersion.some((d) => /not physical spacetime/.test(d.statement)));
  const kinds = P.nulls.map((n) => n.object);
  for (const o of ['spacetime null vector', 'spectral (energy–momentum) null relation', 'Fourier zero coefficient', 'model-manifold null direction']) assert.ok(kinds.includes(o), o);
  assert.match(P.nullLink, /not one kind of zero/);
  assert.ok(P.massAnswer.startsWith('Does mass appear as a parameter selecting a non-null level set of the same quadratic form whose m=0 case is null? Yes, exactly'));
  assert.match(P.massAnswer, /This does not say that mass is a wave\./);
  assert.ok(!/\bmass is a wave\b/i.test(live(rec).replace(/does not say that mass is a wave|that mass is a wave \(|that mass is a wave;|“mass is a wave\.”|"mass is a wave"/g, '')), 'no live claim that mass is a wave');
  assert.equal(reg.get('T-P17-MASS-LEVEL').status, 'derived');
});

test('8. positive / negative frequency: the pairing is (ω, k) ↔ (−ω, −k), from realness; no particle/antiparticle reading', () => {
  assert.match(P.posNeg.math, /not \(−ω, k\)/);
  assert.match(P.posNeg.condition, /admits complex solutions/);
  assert.match(P.posNeg.quantum, /NOT USED/);
  assert.ok(pass('P17Rb', 'P17Rc', 'P17Rd', 'P17Re', 'P17Rf'));
  for (const l of rec.split('\n').filter((x) => /antiparticle|Dirac|CPT|virtual particle|creation\/annihilation|excitations of quantum fields/i.test(x)))
    assert.match(l, /NOT USED|future branch|none used|No particle|not used|any particle/i, l.slice(0, 120));
});

test('9. the mass/wave seed: kept verbatim, not promoted; four readings with their own statuses', () => {
  assert.equal(reg.get('T-MASS-WAVE-SEED').words, "mass is waves too, it's just a different form.");
  assert.equal(reg.get('T-MASS-WAVE-SEED').status, 'hypothesis');
  assert.deepEqual(Object.fromEntries(P.mw.map((m) => [m.id, m.status])), { 'MW-A': 'RESTRICTED', 'MW-B': 'ESTABLISHED', 'MW-C': 'FAIL', 'MW-D': 'OPEN' });
  for (const m of P.mw) { assert.ok(decided(m.words), m.id); assert.ok(pass(...m.cards), m.id); }
  assert.deepEqual(['T-MW-A', 'T-MW-B', 'T-MW-C', 'T-MW-D'].map((i) => reg.get(i).status), ['derived', 'established', 'hypothesis', 'open']);
  assert.equal(reg.get('T-MW-C').assessment.transferDepth, 'FAIL');
  assert.match(P.seedNote, /Not reinterpreted as QFT/);
});

test('10. the five required counterexamples, verbatim and carded', () => {
  assert.deepEqual(P.counterexamples.map((x) => x.id), ['P17-X1', 'P17-X2', 'P17-X3', 'P17-X4', 'P17-X5']);
  for (const x of P.counterexamples) { assert.ok(decided(x.words), x.id); assert.ok(pass(...x.cards), x.id); }
});

test('11. separate statuses, never one umbrella status', () => {
  assert.ok(decided('Do not give a single umbrella status.'));
  const st = Object.fromEntries(P.statusTable.map((r) => [r.item, r.status]));
  for (const r of P.statusTable) assert.ok(P.statuses.includes(r.status), r.item);
  assert.equal(st['Fourier conjugacy (real signal; continuous and DFT)'], 'ESTABLISHED');
  assert.equal(st['real-field positive / negative mode relation'], 'DERIVED');
  assert.equal(st['massless null-cone relation (spectral variables)'], 'ESTABLISHED');
  assert.equal(st['massive mass-shell level set'], 'DERIVED');
  assert.equal(st['E = ħω, p = ħk'], 'RESTRICTED');
  assert.equal(st['the broader #17 physical-pair hypothesis (T-CONJUGACY)'], 'OPEN');
  assert.equal(reg.get('T-CONJUGACY').status, 'open');
  assert.equal(F.objects.find((o) => o.id === 'P2').status, 'OPEN');
});

test('12. story placement: no new node, #12 → #17 historical, the new edges are cross-references', () => {
  assert.equal(C.master.length, 20);
  assert.equal(edge('M12', 'M17').type, 'EARLIER PREDECESSOR');
  assert.equal(edge('M16', 'M17').type, 'OPEN / NO DIRECT CAUSAL EDGE');
  assert.equal(edge('M17', 'M18').type, 'OPEN / NO DIRECT CAUSAL EDGE');
  for (const a of ['M13', 'M14', 'M18', 'M19']) assert.equal(edge(a, 'M17').type, 'CROSS-REFERENCE', `${a} ⇢ M17`);
  const into = C.edges.filter((e) => e.dst === 'M17' && !['CROSS-REFERENCE', 'OPEN / NO DIRECT CAUSAL EDGE'].includes(e.type));
  assert.deepEqual(into.map((e) => e.src), ['M12'], 'the only causal edge into #17 is the historical one from #12');
  for (const t of ['Do not reorder the Master Map around the new mathematics.', 'These are cross-references unless the historical record says otherwise.']) assert.ok(decided(t), t);
  for (const s of P.story) assert.ok(s.answers && s.relation && s.next, s.result);
  assert.ok(F.domains.some((d) => d.id === 'D41') && C.alignment.some((a) => a.domain === 'D41'));
});

test('13. the recommendation is one of the two decided strings; no vague praise; ratings are secondary', () => {
  assert.ok(['READY FOR #17 ADVERSARIAL LOCK', 'NEEDS A NARROWER SECOND CONSTRUCTION PASS'].includes(P.recommendation.choice));
  assert.ok(decided(P.recommendation.choice));
  assert.ok(!/\b(promising|stronger|closer|interesting|important|suggestive)\b/i.test(rec));
  for (const r of P.ratings) assert.ok(Number.isInteger(r.bs) && Number.isInteger(r.slop) && r.td && Number.isInteger(r.breadth) && r.why, r.item);
  assert.ok(decided('This is more important than Backbone Support %.'));
  assert.ok(!P.ratings.some((r) => r.td === 'NONTRIVIAL PREDICTIVE TRANSFER'));
});
