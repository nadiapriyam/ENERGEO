// Canonical story (diagnostic 2026-11-16; Act VIII final lock, story fidelity, 2026-11-17). Guards the decisions in
// docs/restructure_decisions.md, "Canonical story diagnostic" and "Act VIII final lock: story fidelity": the 20-node
// Master Map is the canonical story, read as a directed relation graph with typed edges; the Foundation spine is only its
// abstract structural summary; zero frequency is a zero index, not a zero value; #15/#16 ⇢ #18/#19 is a cross-reference,
// not a causal edge; Act VIII is placed inside the story; the κ-family is parked.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const C = JSON.parse(read('research/canonical_story.json'));
const F = JSON.parse(read('research/foundation.json'));
const A8 = JSON.parse(read('research/act8.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const mm = read('docs/Interactive_Master_Map.extracted.md');
const decisions = read('docs/restructure_decisions.md');
const map = read('research/master_math_map.md');
const md = read('research/canonical_story.md');
const decided = (t) => decisions.includes(t);
const edge = (a, b) => C.edges.find((e) => e.src === a && e.dst === b);
const live = (t) => t.split('\n').filter((l) => !/[Ss]uperseded|SUPERSEDED|kept as history|Moved 2026-11-17|parked|PARKED/.test(l)).join('\n');

test('1. the canonical story is the 20-node Master Map, in its order, titles verbatim, each with a discovery trigger', () => {
  assert.equal(C.master.length, 20);
  C.master.forEach((m, i) => {
    assert.equal(m.n, i + 1);
    assert.ok(mm.includes(`${m.n}. ${m.title}`), `M${m.n} title verbatim`);
    assert.ok(m.q && m.rel && m.nxt && m.trigger, `M${m.n}: question, relation, next question, discovery trigger`);
  });
  for (const t of C.mmTransitions) assert.ok(mm.includes(t.text), t.text);
  assert.ok(md.includes('| Node | Historical question | Relation learned | What question it created | Edge type (outgoing) | Discovery trigger |'));
});

test('2. the spine is labelled as the abstract structural summary and does not govern order', () => {
  assert.ok(decided('ABSTRACT STRUCTURAL SUMMARY OF THE CANONICAL STORY.'));
  assert.ok(map.includes('## Part I. Foundation spine\n\n**ABSTRACT STRUCTURAL SUMMARY OF THE CANONICAL STORY.**'));
  assert.match(map, /It does not govern chronological order\./);
  assert.equal(C.spineLabel.label, 'ABSTRACT STRUCTURAL SUMMARY OF THE CANONICAL STORY.');
});

test('3. the story is a graph: typed edges, and adjacency is not automatically causal (Correction C)', () => {
  assert.deepEqual(Object.keys(C.edgeTypes), ['NEXT QUESTION', 'EARLIER PREDECESSOR', 'CROSS-REFERENCE', 'APPLICATION HANDOFF', 'OPEN / NO DIRECT CAUSAL EDGE']);
  assert.ok(decided('NEXT QUESTION; EARLIER PREDECESSOR; CROSS-REFERENCE; APPLICATION HANDOFF; OPEN / NO DIRECT CAUSAL EDGE'));
  for (const e of C.edges) assert.ok(C.edgeTypes[e.type] && /^M\d+$/.test(e.src) && /^M\d+$/.test(e.dst) && e.why, `${e.src} → ${e.dst}`);
  for (let i = 1; i < 20; i++) assert.ok(edge(`M${i}`, `M${i + 1}`), `every consecutive pair is typed: M${i} → M${i + 1}`);
  for (const [a, b] of [['M9', 'M10'], ['M12', 'M13'], ['M16', 'M17'], ['M17', 'M18']]) assert.equal(edge(a, b).type, 'OPEN / NO DIRECT CAUSAL EDGE', `${a} → ${b}`);
  assert.equal(edge('M12', 'M17').type, 'EARLIER PREDECESSOR');
  assert.equal(edge('M18', 'M19').type, 'NEXT QUESTION');
  assert.equal(edge('M19', 'M20').type, 'APPLICATION HANDOFF');
});

test('4. #15/#16 ⇢ #18/#19 is a cross-reference, never a causal edge (Correction B)', () => {
  for (const [a, b] of [['M15', 'M18'], ['M16', 'M18'], ['M15', 'M19']]) assert.equal(edge(a, b).type, 'CROSS-REFERENCE', `${a} ⇢ ${b}`);
  assert.ok(!C.edges.some((e) => ['M15', 'M16'].includes(e.src) && ['M18', 'M19'].includes(e.dst) && e.type !== 'CROSS-REFERENCE'));
  for (const t of ['It does NOT mean model manifolds and spacetime are the same structure.', 'It does NOT mean model-manifold theory generated relativity historically.']) assert.ok(decided(t), t);
  assert.match(md, /The historical route to relativity is #18 → #19\./);
  assert.ok(map.includes('*Cross-reference, not a causal edge (Act VIII lock, Correction B):*'));
  assert.ok(!/c → ∞ also entered here, as a model-family limit \(Gate 2 answer 3\), before it reached relativity/.test(live(map)));
  assert.match(C.act8.find((x) => x.item.startsWith('c → ∞')).question, /cross-reference from #15 \/ #16 \(Correction B\), not its cause/);
});

test('5. zero frequency is a zero index, kept at #13 in its own kind (Correction A)', () => {
  assert.deepEqual(C.zeroKinds.map((z) => z.kind), ['zero object / value', 'zero relation', 'zero index / frequency', 'null / balance / cancellation']);
  assert.match(C.zeroKinds[2].meaning, /a zero in the index \/ coordinate domain, not a zero value/);
  assert.ok(decided('It is a zero in the index/coordinate domain.'));
  assert.ok(map.includes('**Kinds of zero (Master Map #13; Act VIII lock, Correction A, 2026-11-17).**'));
  assert.ok(!map.includes('| Zero frequency (k = 0, ω = 0; Master Map #13) | e₀ = 1'), 'the zero-frequency row left the zero-value table');
  assert.match(C.master[12].rel, /zero index\/frequency/);
  assert.ok(/zero-frequency/.test(C.master[12].q), 'zero frequency stays in #13');
});

test('6. the historical relations are visible, in discovery order and with the decided notation', () => {
  assert.equal(C.master[0].nxt, 'What properties belong to the physical thing and what belong to its representation? (lock decisions)');
  assert.ok(C.master[2].nxt.startsWith('What remains unchanged under transformation?'));
  assert.equal(C.master[7].q, 'What relation vanished? (lock decisions)');
  assert.ok(C.master[14].q.startsWith('If distance and magnitude depend on the geometry, how should distance be understood when the valid predictions form a model/prediction manifold?'));
  assert.match(C.master[16].rel, /not claimed to be mathematically conjugate/);
  assert.ok(C.master[17].rel.startsWith('The corrected relation is that an unbounded parameter can produce indefinitely continuing evolution while an observable representation remains bounded.'));
  const Fo = C.chains.F.steps.map((s) => s.text);
  assert.ok(Fo.findIndex((t) => /What relation vanished\?/.test(t)) < Fo.findIndex((t) => /δ_jk/.test(t)), 'the vanished relation before orthogonality');
  const A = C.chains.A.steps.map((s) => s.text);
  assert.ok(A.findIndex((t) => /M ≠ I/.test(t)) < A.findIndex((t) => /A†MA = M \(CF1\)/.test(t)), 'q_M before A†MA = M');
  for (const t of [...A, map.slice(map.indexOf('*How the question arrived'), map.indexOf('**The architecture**'))]) assert.ok(!/\|x\|/.test(t), 'vectors use ‖x‖');
  assert.ok(C.chains.IG.steps.some((s) => /C7 does not create this branch/.test(s.text)));
  assert.ok(C.chains.E.steps.some((s) => /never upstream evidence/.test(s.text)));
});

test('7. Act VIII final placement: answers #18 / #19, connectors backward, supporting only, optional, failures', () => {
  const groups = new Set(C.act8.map((x) => x.group));
  for (const g of ['#18 answer', '#19 answer', 'connector backward', 'supporting only', 'optional (parked)', 'refinement / failure']) assert.ok(groups.has(g), g);
  const by = (start) => C.act8.find((x) => x.item.startsWith(start));
  for (const [s, g] of [['circle', '#18 answer'], ['torus', '#18 answer'], ['cylinder', '#18 answer'], ['exact versus near recurrence', '#18 answer'], ['rapidity', '#19 answer'], ['roles of c', '#19 answer'], ['c → ∞', '#19 answer'],
    ['Fourier character', 'connector backward'], ['SO(2) / SO(1,1)', 'connector backward'], ['generator theorem', 'supporting only'], ['stabilizer', 'supporting only'], ['elliptic', 'supporting only'], ['κ-family', 'optional (parked)'],
    ['old wording', 'refinement / failure'], ['literal t ↔ c', 'refinement / failure']]) assert.equal(by(s)?.group, g, s);
  for (const x of C.act8.filter((y) => y.group === 'supporting only')) assert.equal(x.category, 'C', x.item);
  assert.deepEqual(A8.placement, C.act8);
});

test('8. the κ-family is parked and no live statement uses it', () => {
  assert.equal(C.kappa.verdict, 'PARK AS OPTIONAL (supporting note)');
  assert.match(obj.get('A8Q').foundationRole, /^PARKED AS OPTIONAL/);
  for (const id of ['A8K', 'A8HCF']) assert.ok(!/κ = /.test(obj.get(id).equation), id);
  assert.ok(!/A8Q\)/.test(obj.get('L4').foundationRole), 'L4 cites C9c, not the κ-family');
  assert.ok(!/κ/.test(reg.get('T-H3-C-FAMILY').normalizedStatement.replace(/The κ-family comparison[^.]*\./, '')));
  for (const b of reg.get('T-C-ROLES').boundaries.filter((x) => /A8Qa/.test(x))) assert.match(b, /^SUPERSEDED/);
  assert.ok(!/κ/.test(A8.tVsCVerdict.analogy) && !/κ/.test(A8.rolesLink));
});

test('9. the mathematical lock rests on PASS cards with their assumptions; failures say what they taught', () => {
  assert.equal(C.mathLock.length, 8);
  for (const r of C.mathLock) {
    const cards = r.cards.split(/,\s*/);
    assert.ok(cards.every((c) => latest[c]?.verdict === 'PASS'), r.statement);
    assert.ok(r.assumptions, r.statement);
  }
  assert.match(C.mathLock.find((r) => r.statement.startsWith('c → ∞')).assumptions, /v and x held fixed; with β = v\/c fixed nothing contracts/);
  assert.equal(C.mathLock.find((r) => r.statement === 'STAR-A FAIL').status, 'LOCKED as FAIL');
  assert.equal(reg.get('T-STAR').status, 'hypothesis');
  assert.equal(obj.get('I2').backboneSupport, 20);
  for (const f of C.failures) assert.ok(f.question && f.taught && f.nextQuestion, f.failure);
});

test('10. every Foundation domain is aligned once; the lock verdict is one of the two decided, with the next question', () => {
  assert.deepEqual(C.alignment.map((a) => a.domain).sort(), F.domains.map((d) => d.id).sort());
  for (const a of C.alignment) assert.ok(a.actions.every((x) => C.actions.includes(x)), a.domain);
  assert.ok(['LOCK ACT VIII — STORY AND MATHEMATICS ALIGNED', 'DO NOT LOCK — SPECIFIC STORY OR MATHEMATICAL MISALIGNMENT REMAINS'].includes(C.lock.choice));
  assert.ok(decided(C.lock.choice));
  assert.match(C.lock.nextQuestion, /^#17 — "Do observable physical pairings or complementarities reflect deeper symmetry analogous to mathematical conjugacy\?"/);
  assert.ok(C.superseded.some((x) => /M15 → M19/.test(x.old)), 'the 2026-11-16 causal edge is kept as superseded');
  const pa = reg.get('T-PAIRA-Q');
  assert.equal(pa.words, 'A mass-balance zero identifies a distinguished structural location.');
  assert.ok(decided(pa.words));
});
