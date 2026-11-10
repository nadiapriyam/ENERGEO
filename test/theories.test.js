// The theory registry (research/theories.json). These protect provenance: Nadia's words stay exact, a theory is
// never deleted because evidence went against it, and the coverage table cannot drift from the registry.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { render } from '../research/tools/build_coverage.mjs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const reg = JSON.parse(read('research/theories.json'));
const T = reg.theories;
const byId = new Map(T.map((r) => [r.id, r]));
const ledger = JSON.parse(read('verify/ledger/latest.json')).cards;
const graph = JSON.parse(read('research/graph.json'));
const ORIGINS = ['user', 'established-support', 'assistant-proposed'];
const FIELDS = ['id', 'label', 'words', 'variants', 'normalizedStatement', 'origin', 'kind', 'status', 'evidenceFor', 'evidenceAgainst', 'boundaries',
  'supersededBy', 'supersedes', 'relatedActs', 'relatedObjects', 'relatedCards', 'sourceDocs', 'auditRef', 'audit', 'interactive', 'graphRecord',
  'researchMode', 'proofTarget'];

test('every record has the TheoryRecord fields and valid enums; ids are unique', () => {
  assert.equal(byId.size, T.length, 'duplicate id');
  for (const r of T) {
    assert.deepEqual(Object.keys(r).sort(), [...FIELDS].sort(), r.id);
    assert.ok(ORIGINS.includes(r.origin), `${r.id}: origin`);
    assert.ok(reg.kinds.includes(r.kind), `${r.id}: kind`);
    assert.ok(reg.statuses.includes(r.status), `${r.id}: status`);
    assert.ok(['preserved', 'partial', 'title-only', 'missing'].includes(r.audit.before), `${r.id}: audit`);
  }
});

test('original wording: every quote appears verbatim in its source document', () => {
  for (const r of T) {
    assert.ok(r.words && r.words.length > 0, `${r.id}: a record keeps its original words`);
    for (const s of r.sourceDocs) assert.ok(existsSync(new URL(`../${s}`, import.meta.url)), `${r.id}: missing ${s}`);
    assert.ok(read(r.sourceDocs[0]).includes(r.words), `${r.id}: words not verbatim in ${r.sourceDocs[0]}`);
    for (const v of r.variants) assert.ok(read(v.source).includes(v.words), `${r.id}: variant not verbatim in ${v.source}`);
  }
});

test('evidence against never deletes: superseded wordings keep their record, and links are reciprocal', () => {
  for (const r of T) {
    if (r.supersededBy) assert.equal(byId.get(r.supersededBy)?.supersedes, r.id, `${r.id} → ${r.supersededBy}`);
    if (r.supersedes) assert.equal(byId.get(r.supersedes)?.supersededBy, r.id, `${r.id} ← ${r.supersedes}`);
    if (r.kind === 'historical-conjecture') assert.ok(r.supersededBy || r.evidenceAgainst.length, `${r.id}: history records why`);
  }
  const ever = read('research/theories.ids').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (const id of ever) assert.ok(byId.has(id), `${id} was recorded once and must not be removed (append-only list)`);
  for (const r of T) assert.ok(ever.includes(r.id), `${r.id}: add it to research/theories.ids`);
});

test('cited cards are on the ledger; an established record rests on PASS cards or a stated definition', () => {
  for (const r of T) {
    for (const c of r.relatedCards) assert.ok(ledger[c], `${r.id}: ${c} not on the ledger`);
    if (r.status === 'established') {
      const cards = r.evidenceFor.filter((e) => e.ref.startsWith('card:')).map((e) => e.ref.slice(5));
      const definition = r.evidenceFor.some((e) => e.ref.startsWith('definition:'));
      assert.ok(cards.length || definition, `${r.id}: established with nothing under it`);
      for (const c of cards) assert.equal(ledger[c].verdict, 'PASS', `${r.id}: ${c} is ${ledger[c].verdict}`);
    }
  }
});

test('every research-graph statement has a registry record; Energeo and DYADIC PACKETS stay open', () => {
  const tokens = new Set(T.flatMap((r) => String(r.graphRecord ?? '').split(/[\s,()]+/)));
  for (const s of graph.statements) assert.ok(tokens.has(s.id), `${s.id} has no theory record`);
  for (const id of ['T-ENERGEO', 'T-ENERGEO-INTENT', 'T-DYADIC', 'T-WAVELETS', 'T-C7', 'T-REP-MANIFOLD']) assert.equal(byId.get(id).status, 'open', id);
  for (const k of [1, 2, 3, 4, 5, 6]) assert.equal(byId.get(`T-TQ-${k}`).evidenceFor.length, 0, 'transfer questions carry no answers');
});

test('research/theory_coverage.md is generated from the registry and up to date', () => {
  assert.equal(read('research/theory_coverage.md'), render(), 'run node research/tools/build_coverage.mjs');
});
