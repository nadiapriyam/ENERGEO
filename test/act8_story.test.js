// Act VIII story-integration and mathematical-correction pass (2026-11-16). Guards the decisions in
// docs/restructure_decisions.md, "Act VIII story-integration and mathematical-correction pass": the common-form chart
// continued to orbit behaviour, the circle as a Fourier character, kernel vs orbit closure, the H3-c split, the
// corrected STAR-B / STAR-C / t-vs-c / c wording (old wording kept as superseded), recovered provenance, and story
// contribution alongside the percentages.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

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
const live = rec.slice(0, rec.indexOf('## Superseded wording'));
const map = read('research/master_math_map.md');
const pass = (...ids) => ids.every((id) => latest[id]?.verdict === 'PASS');
const decided = (t) => decisions.includes(t);

test('1. every story-pass card is on the ledger and passes', () => {
  assert.ok(existsSync(new URL('../verify/verify_A8S.py', import.meta.url)));
  assert.equal(A.storyCards.length, 18);
  assert.ok(pass(...A.storyCards));
});

test('2. the decisions are verbatim; the report register and the Pair B decision are recovered', () => {
  for (const t of ['geometry alone does not determine periodicity.', 'Do not claim one universal M.', 'Keep STAR-B RESTRICTED.', 'Preserve STAR-C as RESTRICTED.',
    'The group parameter in the Lorentz one-parameter subgroup is rapidity φ, not c.', 'Do not merge these back together.', 'Do NOT derive the mass-wave theory in this pass.',
    'In particular, STAR-A failing must not be treated as equivalent to the Foundation/backbone failing.'])
    assert.ok(decided(t), t);
  assert.ok(decided('Update AMB-7. Do not reduce Pair B to “both use a circle.”'), 'Pair B decision recovered');
  const rr3 = read('docs/restructure_report_rev3.md');
  for (const n of [1, 7, 15]) assert.ok(rr3.includes(`### AMB-${n}:`), `AMB-${n}`);
  // no live record points to a missing ambiguity entry
  const files = ['research/theories.json', 'research/foundation.json', 'research/act8.json', 'research/master_math_map.md', ...readdirSync(new URL('../docs/', import.meta.url)).filter((f) => f.endsWith('.md')).map((f) => `docs/${f}`)];
  for (const f of files) for (const m of read(f).matchAll(/AMB-(\d+)/g)) assert.ok(rr3.includes(`### AMB-${m[1]}:`), `${f}: AMB-${m[1]} has a record`);
  assert.equal(reg.get('T-TIME-CIRCLE-0').audit.note.includes('recovered to docs/restructure_report_rev3.md'), true);
});

test('3. the generator theorem places Act VIII after the common-form chart', () => {
  assert.match(A.generatorTheorem.statement, /KᵀM \+ MK = 0 ⟺ A\(s\)ᵀMA\(s\) = M/);
  assert.equal(A.generatorTheorem.chain, 'preserved relation → preserving group → generator → one-parameter transformation → orbit/stabilizer → observable dynamics');
  assert.match(A.generatorTheorem.scope, /no universal M/);
  assert.deepEqual(A.chartRows.map((r) => r.row), ['Euclidean / SO(2)', 'Lorentz / SO(1,1)', 'Fourier character ℝ → U(1)', 'multi-frequency torus flow']);
  for (const r of A.chartRows) assert.ok(r.notProved.length > 10 && pass(...r.cards), r.row);
  assert.ok(map.includes('### Act VIII story integration (2026-11-16): preserved geometry → generator → dynamics'));
  assert.ok(map.includes('B_M → G_M = {A : AᵀMA = M} → 𝔤_M = {K : KᵀM + MK = 0} → e^(sK) → orbit / stabilizer → dynamical'));
  assert.equal(br.get('BR81').objects.join(' '), 'A8G CF4 A8A');
  assert.match(obj.get('CF4').foundationRole, /continued in Act VIII/);
});

test('4. SO(2) vs SO(1,1) is an exact canonical comparison, not a signature theorem', () => {
  assert.match(A.so2so11.result, /same abstract infinitesimal preservation equation KᵀM \+ MK = 0/);
  assert.match(A.so2so11.scope, /signature alone does not determine the dynamics/);
  assert.equal(br.get('BR86').strength, 'FAILED CONNECTION');
  assert.ok(pass('A8Ea', 'A8Eb', 'A8Ec'));
});

test('5. the circle is the translation character; kernel and orbit closure are kept distinct', () => {
  assert.match(A.fourier.character, /one-dimensional unitary representation \(character\) of the additive translation group/);
  assert.match(A.fourier.finiteInfinite, /identifies values differing by the kernel\. The circle itself is compact and is not called infinite/);
  assert.match(obj.get('R6').equation, /translation character χ_ω/);
  assert.match(A.kernelClosure.periodic, /^periodic case — quotient\/kernel structure/);
  assert.match(A.kernelClosure.dense, /^quasi-periodic\/dense case — orbit closure\/subtorus structure/);
  assert.match(A.kernelClosure.chain, /periodicity is equivalent to a nontrivial kernel/);
  assert.match(reg.get('T-H3-QUOTIENT').normalizedStatement, /The two cases use different objects/);
  assert.equal(br.get('BR83').strength, 'FAILED CONNECTION');
});

test('6. STAR-B is stated in an explicit category; STAR-C distinguishes the theorem from recurrence', () => {
  const sb = A.star.find((s) => s.id === 'STAR-B'); const sc = A.star.find((s) => s.id === 'STAR-C');
  assert.equal(sb.status, 'RESTRICTED'); assert.equal(sc.status, 'RESTRICTED');
  assert.match(sb.verdict, /Category: smooth manifolds without boundary/);
  assert.match(sb.verdict, /Not stated for arbitrary "geometrical objects"/);
  assert.ok(!/this general construction is a project argument, not carded/.test(live));
  assert.match(sc.verdict, /not necessary conditions for recurrence/);
  assert.ok(!/Each hypothesis is needed/.test(live));
  assert.ok(A.superseded.some((x) => x.where === 'STAR-C verdict' && /Each hypothesis is needed/.test(x.old)), 'old STAR-C wording kept');
  assert.ok(pass('A8Ba', 'A8Va'));
});

test('7. t vs c: θ ↔ φ; "radius r ↔ c" and the finiteness claim are superseded, not live', () => {
  assert.match(A.tVsCVerdict.analogy, /The correct comparison is θ ↔ φ/);
  for (const l of live.split('\n').filter((x) => /r ↔ c/.test(x))) assert.match(l, /discarded|superseded|FAIL|no exact map/, l.slice(0, 100));
  for (const l of map.split('\n').filter((x) => /r ↔ c/.test(x))) assert.match(l, /superseded|discarded|no exact map/, l.slice(0, 100));
  for (const l of live.split('\n').filter((x) => /invariant content of c is whether it is finite|the invariant content is finiteness|invariant content of the family is whether c is finite/.test(x)))
    assert.match(l, /superseded/, l.slice(0, 100));   // only history entries marked superseded may quote it
  for (const b of reg.get('T-C-ROLES').boundaries.filter((x) => /invariant content is finiteness/.test(x))) assert.match(b, /^SUPERSEDED/);
  assert.match(obj.get('L4').foundationRole, /not a claim that c means only finiteness/);
  assert.match(reg.get('T-H3-C').normalizedStatement, /superseded/);
  assert.ok(A.superseded.some((x) => x.where === 't vs c: analogy' && /r ↔ c|radius r/.test(x.old)));
  assert.match(A.cFamilyNote, /does NOT mean that physical c has no significance beyond finiteness/);
  assert.ok(pass('A8Wa', 'A8Wb', 'A8Wc', 'A8Qa', 'A8Qb'));
});

test('8. H3-c is split into three records and not merged back', () => {
  const st = Object.fromEntries(A.h3Split.map((h) => [h.id, h.status]));
  assert.deepEqual(st, { 'H3-c-direct': 'FAIL', 'H3-group': 'ESTABLISHED INSTANCE', 'H3-c-family': 'RESTRICTED' });
  assert.equal(A.h3Split.find((h) => h.id === 'H3-c-family').h3Connection, 'OPEN');
  assert.equal(reg.get('T-H3-C-DIRECT').kind, 'historical-conjecture');
  assert.equal(reg.get('T-H3-C-DIRECT').supersededBy, 'T-H3-GROUP');
  assert.equal(reg.get('T-H3-GROUP').status, 'established');
  for (const id of ['T-H3-C-DIRECT', 'T-H3-GROUP', 'T-H3-C-FAMILY']) assert.ok(decided(reg.get(id).words), id);
  assert.equal(reg.get('T-H3-C').words, 'that invarient variable like the speed of light which also converges to infinity is an invarient variable that acts as a rule in the manifold');
  assert.ok(reg.get('T-H3-C').boundaries.some((b) => /SPLIT into T-H3-C-DIRECT/.test(b)));
  assert.ok(!A.statusTable.some((r) => r.id === 'H3-c'));
  for (const [id, status] of [['A8HCD', 'NEGATIVE'], ['A8HG', 'DERIVED'], ['A8HCF', 'DERIVED']]) assert.equal(obj.get(id).status, status, id);
  assert.ok(pass('A8Zb'));
});

test('9. STAR-A stays FAIL, its lesson is recorded, and it is not a backbone failure', () => {
  assert.equal(A.star.find((s) => s.id === 'STAR-A').status, 'FAIL');
  assert.equal(reg.get('T-STAR-A').kind, 'historical-conjecture');
  assert.equal(reg.get('T-STAR-A-LESSON').words, 'geometry alone does not determine periodicity.');
  assert.equal(reg.get('T-STAR-A-LESSON').status, 'established');
  assert.match(A.story.starAvsBackbone, /not the Foundation\/backbone failing/);
  assert.equal(reg.get('T-STAR').words, '★ Any geometrical object that is bound by rules can be periodic.');
  assert.equal(reg.get('T-GEOM-GEN-DYN').status, 'derived');
  assert.ok(reg.get('T-GEOM-GEN-DYN').boundaries.some((b) => /not a universal theorem/.test(b)));
});

test('10. story contribution contextualizes the percentages; the spine is unchanged', () => {
  assert.deepEqual(A.story.spine, ['OBJECT', 'REPRESENTATION', 'RELATION', 'ZERO/BALANCE/NULL', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY', 'INFORMATION', 'DYNAMICS/CONTINUATION', 'CROSS-SYSTEM TRANSFER', 'APPLICATION']);
  assert.equal(A.story.advances, 'PRESERVED STRUCTURE → GEOMETRY → DYNAMICS/CONTINUATION');
  assert.equal(A.story.failedOverreach.startsWith('geometry alone forces periodicity'), true);
  assert.equal(A.story.surviving, 'action/generator/stabilizer determine the continuation type under the supplied geometry');
  for (const r of A.ratings) assert.ok(typeof r.story === 'string' && r.story.length > 3 && Number.isInteger(r.bs), r.item);
  assert.ok(rec.includes('| Item | Backbone Support | AI Slop Risk | Transfer Depth | Breadth | Status | Backbone story contribution | Why |'));
  assert.equal(obj.get('I2').backboneSupport, 20);
});

test('11. the mass-wave branch is prepared, not begun', () => {
  assert.match(A.massWaveHandoff.note, /^Handoff only; nothing derived/);
  assert.match(A.massWaveHandoff.notBegun, /No dispersion form, mass shell or wave–particle statement is derived here/);
  assert.equal(reg.get('T-MASS-WAVE-SEED').words, "mass is waves too, it's just a different form.");
});

test('12. Foundation records the story-pass objects, bridges, sources and domain', () => {
  for (const [id, status] of [['A8G', 'ESTABLISHED'], ['A8E', 'ESTABLISHED'], ['A8F', 'ESTABLISHED'], ['A8KC', 'ESTABLISHED'], ['A8Q', 'ESTABLISHED'], ['A8GD', 'DERIVED']])
    assert.equal(obj.get(id)?.status, status, id);
  for (const id of ['BR81', 'BR82', 'BR83', 'BR84', 'BR85', 'BR86']) assert.ok(br.has(id), id);
  for (const id of ['SRC-LEE-2012', 'SRC-MILNOR-1965', 'SRC-YAGLOM-1979']) assert.ok(srcs.has(id) && /CLAIM NOT QUOTED/.test(srcs.get(id).status), id);
  assert.ok(F.domains.some((d) => d.id === 'D40' && d.objects.join(' ') === 'A8G A8E A8F A8KC A8Q A8GD'));
  assert.match(A.next[0], /^READY FOR ADVERSARIAL LOCK/);
});
