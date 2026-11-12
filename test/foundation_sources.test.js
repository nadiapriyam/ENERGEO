// Foundation Completion Pass 2 (2026-11-12): the source registry, the CF11 split, the symplectic correction, the
// two-map lock, DYADIC PACKETS, provenance classes, application separation and kept FAIL cards. One test per
// requirement of the pass (docs/restructure_decisions.md, "Foundation Completion Pass 2").

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const F = JSON.parse(read('research/foundation.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const srcs = new Map(F.sources.map((s) => [s.id, s]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const flat = (t) => t.replace(/\s+/g, ' ');
const HYP = ['HYPOTHESIS', 'OPEN', 'GOVERNANCE'];
const NOT_EVIDENCE = ['USER-ORIGIN', 'SPECULATIVE PROJECT CONNECTION', 'PHILOSOPHICAL'];

test('1. every canonical external claim has a source or an explicit SOURCE MISSING', () => {
  const md = read('research/foundation_sources.md');
  for (const o of F.objects) {
    for (const s of o.sources) assert.ok(srcs.has(s), `${o.id}: unknown source ${s}`);
    if (F.externalProvenance.includes(o.provenance))
      assert.ok(o.sources.length > 0 || /^SOURCE MISSING/.test(o.sourceStatus ?? ''), `${o.id}: external claim needs a source or SOURCE MISSING`);
    if (o.sourceStatus) assert.ok(md.includes(o.sourceStatus), `${o.id}: missing source listed in the registry`);
  }
  for (const b of F.bridges) {
    for (const s of b.sources) assert.ok(srcs.has(s), `${b.id}: unknown source ${s}`);
    if (b.scope === 'established') assert.ok(b.sources.length > 0, `${b.id}: an established bridge cites its source`);
  }
  for (const s of F.sources) {
    assert.ok(md.includes(`| ${s.id} |`), `${s.id} rendered`);
    for (const k of ['authors', 'title', 'year', 'sourceType', 'identifier', 'claim', 'doesNotEstablish', 'checked'])
      assert.ok(typeof s[k] === 'string' && s[k].length > 0, `${s.id}: ${k}`);
    assert.ok(F.sourceClasses.includes(s.sourceClass) && F.sourceStatuses.includes(s.status), `${s.id}: class and status`);
  }
  assert.ok(md.includes('No full text could be opened in this environment'), 'the registry states its verification limit');
});

test('2. a source supports only established or derived objects, never a project hypothesis', () => {
  for (const s of F.sources) {
    for (const id of s.supports) {
      const o = obj.get(id);
      assert.ok(o, `${s.id}: ${id}`);
      assert.ok(!HYP.includes(o.status) && !NOT_EVIDENCE.includes(o.provenance), `${s.id} must not support ${id} (${o.status}, ${o.provenance}); use bearsOn`);
    }
    for (const id of s.bearsOn) assert.ok(obj.has(id), `${s.id}: bears on ${id}`);
    assert.ok(s.doesNotEstablish.length > 5, `${s.id}: what it does NOT establish`);
  }
  for (const o of F.objects) if (HYP.includes(o.status)) assert.deepEqual(o.sources, [], `${o.id}: a hypothesis carries no supporting source`);
  for (const id of ['SRC-MALLAT-2012', 'SRC-BRUNA-MALLAT-2013']) assert.match(srcs.get(id).doesNotEstablish + srcs.get('SRC-MALLAT-2012').doesNotEstablish, /zero theory/);
  assert.ok(!/Mallat proves/i.test(read('research/foundation_sources.md')), 'no "Mallat proves …" line');
  assert.ok(srcs.get('SRC-INONU-WIGNER-1953').bearsOn.includes('L4') && !srcs.get('SRC-INONU-WIGNER-1953').supports.includes('L4'), 'the contraction is not evidence for L4');
  for (const s of F.sources) assert.ok(!s.supports.includes('M4'), `${s.id}: no paper is evidence for C7`);
});

test('3. CF11-A and CF11-B are separate records with separate ratings', () => {
  assert.ok(!obj.has('CF11'), 'the compressed CF11 is gone');
  const a = obj.get('CF11-A'), b = obj.get('CF11-B');
  assert.equal(a.status, 'DERIVED');
  assert.equal(b.status, 'HYPOTHESIS');
  assert.equal(a.mathematicalStatus, 'TEXTBOOK / KNOWN');
  assert.equal(b.mathematicalStatus, 'SPECULATIVE MAPPING');
  assert.ok(a.backboneSupport !== b.backboneSupport || a.slopRisk !== b.slopRisk, 'not one shared rating');
  assert.ok(b.dependsOn.includes('CF11-A') && b.sources.length === 0, 'B rests on A without inheriting its sources');
  assert.equal(reg.get('T-CF11-A').words, 'In many established geometries, a relational structure together with the transformations preserving it characterizes substantial geometric structure.');
  assert.equal(reg.get('T-CF11-B').words, 'Can relation + admissible transformations + preserved structure provide a broader organizing architecture across the geometries investigated in this project?');
  assert.equal(reg.get('T-CF11-B').status, 'hypothesis');
  const comp = read('research/foundation_completion.md');
  assert.ok(comp.includes('| CF11-A (DERIVED) |') && comp.includes('| CF11-B (HYPOTHESIS) |'));
});

test('4. the symplectic self-pairing is not labelled a Lorentz-style null', () => {
  for (const f of ['research/master_math_map.md', 'research/foundation_dependencies.md', 'research/foundation_bridges.md', 'research/foundation_completion.md', 'research/zero_taxonomy.md'])
    assert.ok(!/J-null|every vector is (J-)?null/i.test(read(f)), f);
  const map = flat(read('research/master_math_map.md'));
  const row = map.slice(map.indexOf('| Symplectic |'), map.indexOf('| Weighted inner product / centering |'));
  assert.ok(row.includes('symplectic orthogonality') && row.includes('alternating self-pairing zero, not a Lorentz-type null vector'), 'corrected row');
  const br = F.bridges.find((x) => x.id === 'BR29');
  assert.equal(br.strength, 'FAILED CONNECTION');
  assert.ok(read('docs/restructure_decisions.md').includes('alternating self-pairing zero ≠ Lorentz quadratic null vector'));
  for (const id of ['FB9a', 'FB9b']) assert.equal(latest[id]?.verdict, 'PASS', id);
});

test('5. the Act map is explicitly pedagogical; the master map is the research ontology', () => {
  const act = read('docs/act_map.md');
  assert.ok(act.includes('The Act map is a pedagogical discovery sequence. It does not determine which mathematics belongs to the Foundation ontology.'));
  assert.ok(!/not the project's source ontology/.test(act), 'the demotion is removed');
  assert.ok(flat(act).includes('they remain part of the Foundation even when taught later'));
  assert.ok(flat(read('research/master_math_map.md')).includes('This file is the **research ontology**'));
  assert.ok(read('CLAUDE.md').includes('RESEARCH ONTOLOGY'));
});

test('6. DYADIC PACKETS stays an open user term', () => {
  const w3 = obj.get('W3');
  assert.equal(w3.status, 'OPEN');
  assert.equal(w3.provenance, 'USER-ORIGIN');
  assert.ok(w3.equation.includes('ORIGINAL USER RESEARCH TERM') && w3.equation.includes('OPEN DEFINITION'));
  const r = reg.get('T-DYADIC');
  assert.equal(r.status, 'open');
  assert.equal(r.normalizedStatement, null, 'no definition imported');
  for (const f of ['research/master_math_map.md', 'research/foundation_sources.md', 'research/foundation_dependencies.md', 'research/theories.json', 'docs/act_map.md'])
    assert.ok(!/DYADIC PACKETS\s*(=|is|are|means|denotes)\s*(the |a )?(standard )?(wavelet packets|dyadic wavelet|scattering path)/i.test(read(f)), f);
  for (const s of F.sources) assert.ok(!s.supports.includes('W3') && !s.bearsOn.includes('W3'), `${s.id}: no source attached to DYADIC PACKETS`);
});

test('7. every carded bridge has assumptions and failure conditions; FB cards name their Foundation target', () => {
  for (const b of F.bridges) if (b.cards.length) {
    assert.ok(b.assumptions && b.assumptions !== '—', `${b.id}: assumptions`);
    assert.ok(b.failureCondition && b.failureCondition !== '—', `${b.id}: failure condition`);
  }
  const fb = Object.entries(latest).filter(([id]) => /^FB\d/.test(id));
  assert.ok(fb.length >= 37, 'the Pass 2 cards are on the ledger');
  for (const [id, c] of fb) assert.match(c.claim, /^\[[^\]]+\]/, `${id}: names its Foundation object or bridge`);
  const groups = new Set(fb.map(([id]) => id.match(/^FB\d+/)[0]));
  for (const g of groups) assert.ok(fb.some(([id, c]) => id.startsWith(g) && /failure condition|failure contrast|fails? |not an identity|sloppy ≠ null|kept distinct/i.test(c.claim)), `${g}: a failure condition or boundary`);
});

test('8. no user-origin hypothesis is replaced by a textbook interpretation', () => {
  for (const o of F.objects) if (o.provenance === 'USER-ORIGIN') {
    assert.ok(HYP.includes(o.status), `${o.id}: a user-origin record keeps its open status`);
    assert.deepEqual(o.sources, [], `${o.id}: no source re-labels it as textbook`);
  }
  for (const [id, st] of [['T-MASS-WAVE-SEED', 'hypothesis'], ['T-STAR', 'hypothesis'], ['T-CONJUGACY', 'open'], ['T-GRAVITY-ATTRACTION', 'open'], ['T-DYADIC', 'open'], ['T-CF11-B', 'hypothesis']])
    assert.equal(reg.get(id).status, st, id);
  for (const id of ['MW1', 'L4', 'I2', 'P2', 'CF11-B']) assert.ok(HYP.includes(obj.get(id).status), `${id} stays open although its ingredients are carded`);
  assert.ok(obj.get('MW2').foundationRole.includes('ESTABLISHED INGREDIENT') && obj.get('MW2').foundationRole.includes('not a proof'));
  assert.ok(reg.get('T-GRAVITY-ATTRACTION').boundaries.some((b) => b.startsWith('ORIGINAL VERBATIM NOT RECOVERED')));
  assert.equal(obj.get('M4').provenance, 'SPECULATIVE PROJECT CONNECTION', 'C7 is assistant-proposed (provenance correction)');
  for (const r of reg.values()) if (r.origin === 'user') assert.ok(r.words && r.words.length > 3, `${r.id}: original wording kept`);
});

test('9. application records do not count as upstream evidence', () => {
  const app = F.objects.filter((o) => o.stages.includes('APPLICATION')).map((o) => o.id);
  for (const o of F.objects) if (!o.stages.includes('APPLICATION')) assert.ok(!o.dependsOn.some((d) => app.includes(d)), `${o.id} depends on an application record`);
  for (const id of ['A1', 'A2']) assert.ok(HYP.includes(obj.get(id).status) && obj.get(id).sources.length === 0, id);
  assert.match(obj.get('A2').gap, /APPLICATION PROVENANCE INCOMPLETE/);
  for (const s of F.sources.filter((x) => ['application', 'project note'].includes(x.sourceClass))) assert.deepEqual(s.supports, [], `${s.id} supports nothing`);
  assert.equal(srcs.get('SRC-THERMALENS').status, 'APPLICATION PROVENANCE INCOMPLETE');
  for (const b of F.bridges) assert.ok(!b.sources.some((s) => ['SRC-THERMALENS', 'SRC-PROJECT-SPEC'].includes(s)), b.id);
  const external = F.sources.filter((s) => ['primary', 'textbook', 'review'].includes(s.sourceClass)).length;
  assert.ok(F.ratings.find((r) => r.dimension === 'Paper / source coverage').reason.startsWith(`${external} external sources`), 'source coverage counts external sources only');
  assert.equal(F.ratings.find((r) => r.dimension === 'Application validation').rating, 0);
});

test('10. no FAIL card is deleted from the ledger', () => {
  const rows = read('verify/ledger/ledger.jsonl').trim().split('\n').map((l) => JSON.parse(l));
  const failed = new Set(rows.filter((r) => r.verdict === 'FAIL').map((r) => r.id));
  for (const id of failed) assert.ok(latest[id], `${id} failed once and must stay on the latest ledger`);
  for (const id of ['S14a', 'C8c', 'B5a', 'Z1a', 'Z2b']) assert.equal(latest[id]?.verdict, 'FAIL', `${id} is kept as FAIL`);
  for (const id of ['S14a', 'C8c', 'B5a', 'Z1a', 'Z2b']) assert.ok(obj.get('F1').cards.includes(id), `${id} recorded in F1`);
});
