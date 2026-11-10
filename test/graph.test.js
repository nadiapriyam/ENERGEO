// The research graph's rules (restructuring report §9). These protect status, not code: a relation cannot claim
// more than its cards support, a pair cannot carry an answer, and Nadia's statements are quoted exactly.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const graph = JSON.parse(read('research/graph.json'));
const ledger = JSON.parse(read('verify/ledger/latest.json')).cards;
const claims = JSON.parse(read('research/claims.json')).statements;
const relations = new Map(graph.relations.map((r) => [r.id, r]));
const statements = new Map(graph.statements.map((s) => [s.id, s]));

test('rule 1–2: every cited card exists; established relations cite only cards whose latest verdict is PASS', () => {
  for (const r of graph.relations) {
    for (const id of [...r.cards, ...(r.history ?? [])]) assert.ok(ledger[id], `${r.id}: card ${id} is not on the ledger`);
    if (r.status === 'established') {
      assert.ok(r.cards.length > 0, `${r.id}: established with no card`);
      for (const id of r.cards) assert.equal(ledger[id].verdict, 'PASS', `${r.id}: ${id} is ${ledger[id].verdict}`);
    }
    for (const id of r.history ?? []) assert.notEqual(ledger[id].verdict, 'PASS', `${r.id}: history is for FAIL cards kept on record`);
  }
});

test('rule 3: a hypothesis or open relation has no geometric meaning unless a repository file supports it', () => {
  for (const r of graph.relations) {
    if (r.status === 'hypothesis' || r.status === 'open') {
      assert.ok(!r.geometricMeaning || (r.geometricMeaningSource && existsSync(new URL(`../${r.geometricMeaningSource}`, import.meta.url))), r.id);
    }
  }
});

const RANK = { open: 0, hypothesis: 1, derived: 2, established: 3 };

test('rule 4: no relation joins the two objects of a pair above the pair\'s own status', () => {
  for (const p of graph.pairs) {
    const ends = new Set([p.sourceObject.id, p.targetObject.id]);
    for (const r of graph.relations) {
      const touches = r.connectsTo.filter((c) => ends.has(c));
      if (ends.has(r.object) && touches.some((c) => c !== r.object)) assert.ok(RANK[r.status] <= RANK[p.status], `${r.id} joins ${p.id}`);
    }
    assert.equal(p.candidateCommonRelation, null, `${p.id}: no common relation is filled in yet`);
  }
});

test('rule 6: statements quote their source exactly, and displayed statements match claims.json', () => {
  for (const s of graph.statements) {
    assert.ok(existsSync(new URL(`../${s.source}`, import.meta.url)), `${s.id}: missing ${s.source}`);
    if (s.words) assert.ok(read(s.source).includes(s.words), `${s.id}: words not found verbatim in ${s.source}`);
    if (s.claim) assert.equal(claims[s.claim].text, s.words, `${s.id}: claims.json text differs`);
  }
  for (const id of graph.program.children) assert.ok(statements.has(id), `program child ${id} has no statement`);
  assert.equal(statements.get('Q.energeo').status, 'open', 'Energeo stays OPEN QUESTION (D1)');
  for (const h of ['H1', 'H2', 'H3']) assert.ok(read(statements.get(h).source).startsWith(`# ${h}.`), `${h} keeps its own file`);
});

const BANNED_IN_TQ = /\b(R_CM|R_\{?CM|balancing|centre of mass|center of mass|moment|mass|location|axis|direction|subspace)\b/i;

test('rule 7–8: transfer questions cite established source relations, carry no answer, and name no source object', () => {
  for (const p of graph.pairs) {
    if (p.directed) assert.ok(p.directionMeaning && /epistemic/i.test(p.directionMeaning), `${p.id}: direction needs its meaning`);
    for (const q of p.transferQuestions) {
      assert.deepEqual(Object.keys(q).sort(), ['context', 'id', 'learnedFrom', 'status', 'text', 'title'], `${q.id}: unexpected fields (no answers)`);
      assert.equal(q.status, 'open');
      assert.ok(!BANNED_IN_TQ.test(q.text), `${q.id}: question text names a source object or suggests an answer`);
      for (const rid of q.learnedFrom) {
        const r = relations.get(rid);
        assert.ok(r && r.status === 'established' && r.object === p.sourceObject.id, `${q.id}: ${rid} is not an established source relation`);
      }
    }
  }
});

test('zero-producing sets have no structure chosen in advance', () => {
  for (const z of graph.zeroProducingSets) assert.equal(z.structure, null, z.id);
});

test('the spin pair is recorded as distinct from the MRI-motivated ensemble (no conflation)', () => {
  const spin = graph.objects.find((o) => o.id === 'obj.spin-pair');
  assert.ok(spin.distinctFrom.includes('obj.moments'));
  for (const p of graph.pairs) assert.ok(![p.sourceObject.id, p.targetObject.id].includes('obj.spin-pair'), `${p.id} must not pair the spin case with the ensemble`);
});

test('states consistent with one observed value: no structure chosen; the distinction cites PASS cards', () => {
  for (const c of graph.consistentSets) assert.equal(c.structure, null, c.id);
  for (const d of graph.distinctions) for (const id of d.cards) assert.equal(ledger[id]?.verdict, 'PASS', `${d.id}: ${id}`);
});

test('the three Chapter I observations stay separate, each resting on established relations', () => {
  const steps = graph.observationLadder.steps;
  assert.equal(steps.length, 3);
  for (const st of steps) for (const rid of st.relations) assert.equal(relations.get(rid)?.status, 'established', `${st.id}: ${rid}`);
  assert.match(graph.observationLadder.note, /not one theorem/);
});

test('A2: a shared algebraic form is established by PASS cards, says what it does not establish, and leaves the pair open', () => {
  for (const p of graph.pairs) {
    const f = p.sharedAlgebraicForm;
    if (!f) continue;
    assert.equal(p.status, 'open', `${p.id}: a shared form does not close the pair`);
    assert.equal(p.candidateCommonRelation, null, `${p.id}: the deeper common relation stays unfilled`);
    assert.equal(f.status, 'established');
    assert.ok(f.cards.length > 0);
    for (const id of f.cards) assert.equal(ledger[id]?.verdict, 'PASS', `${p.id}: ${id}`);
    for (const c of f.claims) assert.ok(claims[c], `${p.id}: claim ${c}`);
    assert.ok(f.doesNotEstablish.length >= 4, `${p.id}: the limits of the shared form are recorded`);
    assert.ok(p.unresolvedQuestions.includes('Q.pairA-transfer'), `${p.id}: the transfer question stays open`);
  }
});
