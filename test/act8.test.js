// Act VIII first construction pass (2026-11-16). Guards the decisions in docs/restructure_decisions.md, "Act VIII first
// construction pass": H3 and ★ kept apart and verbatim, the old infinity wording FAIL, the action/stabilizer testbed,
// the torus and cylinder counterexamples, separate ★ readings and H3 candidates, the c-family kept at finite-c
// congruence, form degeneration kept apart from group contraction, t kept apart from c, and separate statuses.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const A = JSON.parse(read('research/act8.json'));
const F = JSON.parse(read('research/foundation.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const br = new Map(F.bridges.map((b) => [b.id, b]));
const srcs = new Map(F.sources.map((s) => [s.id, s]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const decisions = read('docs/restructure_decisions.md');
const rec = read('research/constructions/act8_finite_infinite_h3_c.md');
const map = read('research/master_math_map.md');
const pass = (...ids) => ids.every((id) => latest[id]?.verdict === 'PASS');
const decided = (t) => decisions.includes(t);

test('1. every Act VIII card is on the ledger and passes', () => {
  assert.ok(existsSync(new URL('../verify/verify_A8.py', import.meta.url)));
  assert.equal(A.cards.length, 41);
  // story-integration pass (2026-11-16) added verify/verify_A8S.py; both card sets are on the ledger
  assert.deepEqual([...A.cards, ...A.storyCards].sort(), Object.keys(latest).filter((k) => k.startsWith('A8')).sort());
  assert.ok(pass(...A.cards));
});

test('2. the decisions are recorded verbatim and the new records quote them', () => {
  for (const t of ['This is Act VIII, not a continuation of C7.', 'Do not merge H3 with ★.', 'Do not merge the time parameter t with the theory parameter c.',
    'compact/constrained image ⇏ exact periodic orbit', 'Do not call an irrational torus flow periodic.', 'Do not rewrite ★ into whichever version survives.',
    'the preservation group of the degenerate limiting form is not automatically the Galilean group.', 'Do not rescue H3 by broadening it until it becomes unfalsifiable.'])
    assert.ok(decided(t), t);
  for (const id of ['T-ACT8-GOV', 'T-UNBOUNDED-EVOLUTION', 'T-COMPACT-NOT-PERIODIC', 'T-H3-ACTION', 'T-H3-QUOTIENT', 'T-STAR-A', 'T-STAR-B', 'T-STAR-C']) assert.ok(decided(reg.get(id).words), id);
  assert.ok(read('docs/claude_code_prompt.md').includes(reg.get('T-H3-C').words), 'T-H3-C quotes the c-clause of H3');
  assert.ok(read('research/theories.ids').includes('T-H3-ACTION'));
});

test('3. H3-original and STAR-original keep their words and open status; candidates are not renamed H3', () => {
  assert.match(reg.get('T-H3').words, /^leading to my theory of the relationship ridden equation/);
  assert.equal(reg.get('T-STAR').words, '★ Any geometrical object that is bound by rules can be periodic.');
  assert.equal(reg.get('T-H3').status, 'hypothesis');
  assert.equal(reg.get('T-STAR').status, 'hypothesis');
  assert.ok(reg.get('T-H3').boundaries.some((b) => b.includes('this record is H3-original')));
  assert.ok(reg.get('T-STAR').boundaries.some((b) => b.includes('this record is STAR-original')));
  assert.deepEqual(A.originals.slice(0, 2).map((o) => [o.id, o.record]), [['H3-original', 'T-H3'], ['STAR-original', 'T-STAR']]);
  for (const c of A.h3Candidates) assert.ok(c.record !== 'T-H3' && /candidate only|not renamed H3/.test(reg.get(c.record).boundaries.join(' ')), c.id);
  assert.match(A.comparison, /neither candidate is renamed H3/);
  assert.ok(map.includes('Any geometrical object that is bound by rules can be periodic.'));
});

test('4. the old infinity wording is kept and classified FAIL; the corrected intuition is not elevated', () => {
  const old = reg.get('T-TIME-CIRCLE-0');
  assert.equal(old.words, 'Adding an infinite object like time to a finite circle geometry makes sines and cosines converge to infinity.');
  assert.equal(old.kind, 'historical-conjecture');
  assert.ok(old.evidenceAgainst.some((e) => e.ref === 'card:A8Cc'));
  const row = (id) => A.statusTable.find((s) => s.id === id);
  assert.equal(row('old infinity wording').status, 'FAIL');
  assert.equal(row('corrected intuition').status, 'ESTABLISHED INSTANCE');
  assert.ok(reg.get('T-UNBOUNDED-EVOLUTION').boundaries.some((b) => /not elevated to H3/.test(b)));
  assert.ok(pass('A8Ca', 'A8Cb', 'A8Cc', 'A8Cd'));
});

test('5. the circle is a quotient / cover of the parameter, and the circle is never called infinite', () => {
  assert.ok(A.circle.some((c) => /ℝ\/Tℤ ≅ ℝ\/ℤ ≅ S¹ by t ↦ ωt\/2π/.test(c.statement)));
  assert.ok(A.circle.some((c) => /not called infinite/.test(c.statement)));
  for (const l of rec.split('\n')) assert.ok(!/(circle|S¹) (itself )?is infinite/i.test(l) || /not|never/.test(l), l.slice(0, 90));
  assert.ok(pass('A8Ce', 'A8Cf'));
});

test('6. torus: commensurability criterion, Kronecker source-locked, an irrational flow is never called periodic', () => {
  assert.ok(A.torus.some((t) => /Tω_j ∈ 2πℤ for all j/.test(t.statement)));
  for (const l of rec.split('\n').filter((x) => /irrational|\(1, √2\)/.test(x) && /periodic/.test(x)))
    assert.match(l, /not|no |never|non-|⇏|NO|FAIL|fail|aperiodic|commensurable|rational torus|Stab = \{0\}/, l.slice(0, 100));
  assert.ok(obj.get('A8T').sources.includes('SRC-KATOK-HASSELBLATT-1995') && obj.get('A8T').sources.includes('SRC-HARDY-WRIGHT-2008'));
  assert.ok(pass('A8Ta', 'A8Tb', 'A8Tc', 'A8Te', 'A8Ua', 'A8X1'));
});

test('7. the action framework: stabilizer trichotomy, non-exhaustive examples, terminology', () => {
  assert.match(A.framework.theorem, /Stab\(x\) ∈ \{ℝ, Tℤ \(T > 0\), \{0\}\}/);
  assert.equal(A.framework.classes.length, 6);
  assert.match(A.framework.exhaustive, /known examples, not an exhaustive classification for this project/);
  assert.ok(A.framework.terminology.some((t) => /Poincaré recurrence is a measure statement/.test(t)));
  assert.equal(A.taxonomy.properties.length, 10);
  assert.ok(pass('A8Pa', 'A8Pb', 'A8Pc', 'A8Pd', 'A8Pe', 'A8Pg', 'A8Da', 'A8Db'));
});

test('8. ★ readings have independent statuses; ★ is not rewritten', () => {
  const st = Object.fromEntries(A.star.map((s) => [s.id, s.status]));
  assert.deepEqual(st, { 'STAR-A': 'FAIL', 'STAR-B': 'RESTRICTED', 'STAR-C': 'RESTRICTED' });
  assert.match(A.star.find((s) => s.id === 'STAR-C').verdict, /finite total measure/);
  assert.match(A.star.find((s) => s.id === 'STAR-C').verdict, /almost every point/);
  assert.equal(reg.get('T-STAR-A').kind, 'historical-conjecture');
  assert.equal(reg.get('T-STAR-A').supersededBy, 'T-COMPACT-NOT-PERIODIC');
  assert.match(A.starNote, /not rewritten/);
  assert.equal(obj.get('I2').status, 'HYPOTHESIS');
});

test('9. c: finite-c congruence only, a degenerate limit that is not called the Newtonian metric, form ≠ group', () => {
  assert.ok(A.cFamily.some((c) => /finite-c congruence \/ representation normalization only/.test(c.statement)));
  assert.match(A.cFamilyNote, /Not inferred: that physical c is meaningless/);
  assert.ok(A.cLimit.some((c) => /NOT automatically the Galilean group/.test(c.statement)));
  assert.ok(A.cLimit.some((c) => /related but not identical/.test(c.statement)));
  for (const t of [rec, map, read('research/connections/C9.md')])
    for (const l of t.split('\n').filter((x) => /Newtonian metric/.test(x))) assert.match(l, /not/, l.slice(0, 100));
  assert.equal(br.get('BR79').strength, 'FAILED CONNECTION');
  assert.ok(pass('A8Ma', 'A8Mb', 'A8Mc', 'A8Md', 'A8Me', 'A8La', 'A8Lb', 'A8Lc'));
});

test('10. t versus c: every aspect compared, one outcome, six questions answered, no merge', () => {
  const aspects = A.tVsC.map((r) => r.aspect);
  for (const a of ['parameter object', 'what stays fixed', 'what varies', 'state space', 'geometry', 'invariant', 'limit', 'quotient', 'internal or external', 'flow / action', 'changes the theory'])
    assert.ok(aspects.includes(a), a);
  assert.ok(A.outcomes.includes(A.tVsCVerdict.outcome));
  assert.equal(A.tVsCVerdict.outcome, 'structural analogy');
  assert.match(A.tVsCVerdict.sameConstruction, /^NO/);
  assert.match(A.tVsCVerdict.superficial, /^SUPERFICIAL/);
  assert.equal(A.sixQuestions.length, 6);
  assert.match(A.sixQuestions[3].answer, /^NO/);
  assert.ok(pass('A8Sa', 'A8Sb'));
  assert.equal(obj.get('A8HC').status, 'HYPOTHESIS');
  assert.equal(obj.get('A8HC').provenance, 'USER-ORIGIN');
  assert.deepEqual(obj.get('A8HC').sources, []);
});

test('11. counterexamples X1–X6 and the four rejected implications are carded and kept', () => {
  assert.deepEqual(A.counterexamples.map((c) => c.id), ['H3-X1', 'H3-X2', 'H3-X3', 'H3-X4', 'H3-X5', 'H3-X6']);
  for (const c of A.counterexamples) assert.ok(pass(c.card) && rec.includes(`| ${c.id} | ${c.card} |`), c.id);
  assert.deepEqual(A.rejected.map((r) => r.card), ['A8Ra', 'A8Rb', 'A8Rc', 'A8Rd']);
  for (const r of A.rejected) assert.match(r.status, /^FAIL/);
  assert.equal(obj.get('A8X').status, 'NEGATIVE');
});

test('12. separate statuses from the allowed six; no umbrella verdict', () => {
  assert.deepEqual(A.statuses, ['PROVED', 'ESTABLISHED INSTANCE', 'RESTRICTED', 'PROJECT SYNTHESIS', 'FAIL', 'OPEN']);
  assert.ok(decided(A.statuses.join('; ')));
  const st = Object.fromEntries(A.statusTable.map((s) => [s.id, s.status]));
  // story-integration pass: H3-c split into three records (decision: "Do not merge these back together.")
  assert.deepEqual([st['H3-original'], st['H3-action'], st['H3-quotient'], st['H3-c-direct'], st['H3-group'], st['H3-c-family'], st['STAR-A'], st['STAR-B'], st['STAR-C']],
    ['OPEN', 'PROJECT SYNTHESIS', 'RESTRICTED', 'FAIL', 'ESTABLISHED INSTANCE', 'RESTRICTED', 'FAIL', 'RESTRICTED', 'RESTRICTED']);
  assert.ok(!('H3-c' in st), 'the merged H3-c row is not live');
  for (const s of A.statusTable) assert.ok(A.statuses.includes(s.status) && pass(...s.cards), s.id);
  assert.ok(pass(A.statusCard));
  assert.match(A.ratings.find((r) => r.item === 'Act VIII overall').status, /no umbrella verdict/);
});

test('13. ratings are separate and not inflated; no predictive transfer is claimed', () => {
  assert.deepEqual(A.ratings.map((r) => r.item), ['circle finite/infinite relation', 'torus extension', 'H3-action', 'H3-quotient', 'H3-c-direct', 'H3-group', 'H3-c-family', '★', 'Act VIII overall']);
  for (const r of A.ratings) {
    assert.ok(Number.isInteger(r.bs) && r.bs <= 40 && Number.isInteger(r.slop), r.item);
    assert.ok(['TRIVIAL CONSEQUENCE', 'STRUCTURAL TRANSFER', 'NOT YET FORMALIZED', 'FAIL'].includes(r.td), r.item);
    assert.ok(Number.isInteger(r.breadth) && r.breadth >= 0 && r.breadth <= 5, r.item);
  }
  assert.equal(obj.get('I2').backboneSupport, 20, 'story pass: restored; STAR-A alone does not lower ★');
  assert.equal(obj.get('L4').status, 'HYPOTHESIS');
});

test('14. Foundation records the Act VIII objects, bridges, sources and domains', () => {
  for (const [id, status] of [['A8A', 'ESTABLISHED'], ['A8C', 'ESTABLISHED'], ['A8T', 'ESTABLISHED'], ['A8D', 'DERIVED'], ['A8SA', 'NEGATIVE'], ['A8SB', 'DERIVED'], ['A8SC', 'ESTABLISHED'],
    ['A8HA', 'DERIVED'], ['A8HQ', 'DERIVED'], ['A8HC', 'HYPOTHESIS'], ['A8M', 'ESTABLISHED'], ['A8L', 'ESTABLISHED'], ['A8K', 'DERIVED'], ['A8X', 'NEGATIVE']])
    assert.equal(obj.get(id)?.status, status, id);
  for (const id of ['BR75', 'BR76', 'BR77', 'BR78', 'BR79', 'BR80']) assert.ok(br.has(id), id);
  for (const id of ['SRC-HATCHER-2002', 'SRC-KATOK-HASSELBLATT-1995', 'SRC-HARDY-WRIGHT-2008', 'SRC-WEYL-1916', 'SRC-WALTERS-1982', 'SRC-POINCARE-1890', 'SRC-MALAMENT-2012'])
    assert.ok(srcs.has(id) && /CLAIM NOT QUOTED/.test(srcs.get(id).status), id);
  assert.ok(!srcs.get('SRC-INONU-WIGNER-1953').supports.includes('L4'));
  assert.ok(['D37', 'D38', 'D39'].every((d) => F.domains.some((x) => x.id === d)));
});

test('15. the pass stops where it was told to', () => {
  // Act VIII final lock (2026-11-17): the recommendation is superseded by the lock verdict; the earlier ones are kept
  assert.match(A.next[0], /^LOCKED \(2026-11-17\): LOCK ACT VIII — STORY AND MATHEMATICS ALIGNED/);
  assert.ok(A.superseded.some((x) => x.where === 'next pass (lock)' && x.old.some((o) => /^READY FOR ADVERSARIAL LOCK/.test(o))));
  assert.ok(A.superseded.some((x) => x.where === 'next pass' && x.old.some((o) => /^One adversarial lock pass for Act VIII/.test(o))), 'pass-1 recommendation kept as superseded');
  assert.ok(A.next.some((n) => /Not begun \(stop list\): mass-wave\/conjugacy, dispersion, quantum work, Energeo, the final Foundation freeze/.test(n)));
  assert.equal(reg.get('T-C7').status, 'open');
  assert.equal(reg.get('T-DYADIC').status, 'open');
});
