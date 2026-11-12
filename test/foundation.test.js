// Foundation V1 (research/foundation.json and the consolidation files). These guard architecture and provenance:
// every object and bridge cites real cards and registry records, no user theory falls out of the map, every bridge
// names what it does not prove, and the ratings stay separate dimensions with no overall score.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const F = JSON.parse(read('research/foundation.json'));
const ledger = JSON.parse(read('verify/ledger/latest.json')).cards;
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const ids = new Set(F.objects.map((o) => o.id));

test('every Foundation object has valid enums, real cards, real registry records and a guide location', () => {
  assert.equal(ids.size, F.objects.length, 'unique ids');
  for (const o of F.objects) {
    assert.ok(F.layers.includes(o.layer), `${o.id}: layer`);
    assert.ok(o.stages.length && o.stages.every((s) => F.stages.includes(s)), `${o.id}: stages`);
    assert.ok(F.statuses.includes(o.status), `${o.id}: status`);
    assert.ok(F.transferDepths.includes(o.transferDepth), `${o.id}: transfer depth`);
    for (const c of o.cards) assert.ok(ledger[c], `${o.id}: card ${c}`);
    for (const r of [...o.registry, ...o.supports, ...o.bearsOn]) assert.ok(reg.has(r), `${o.id}: registry ${r}`);
    for (const d of o.dependsOn) assert.ok(ids.has(d), `${o.id}: depends on ${d}`);
    for (const d of o.docs) assert.ok(existsSync(new URL(`../${d}`, import.meta.url)), `${o.id}: ${d}`);
    assert.ok(o.guideLocation, `${o.id}: potential guide location`);
    assert.ok(F.provenanceClasses.includes(o.provenance), `${o.id}: one primary provenance class`);
    if (o.status === 'ESTABLISHED' || o.status === 'DERIVED')
      assert.ok(o.cards.some((c) => ledger[c].verdict === 'PASS') || /NEEDS|no card|not (yet )?in the repository|spec only|definitional/.test(o.gap ?? ''), `${o.id}: established without a PASS card must name its gap`);
    for (const k of ['backboneSupport', 'slopRisk']) assert.ok(o[k] === null || (Number.isInteger(o[k]) && o[k] >= 0 && o[k] <= 100), `${o.id}: ${k}`);
  }
});

test('every bridge is an exact connector that names what it does not prove', () => {
  for (const b of F.bridges) {
    assert.ok(b.left && b.right && b.connector, b.id);
    assert.ok(['established', 'project-specific'].includes(b.scope), `${b.id}: scope`);
    assert.ok(F.bridgeStrengths.includes(b.strength), `${b.id}: strength class`);
    assert.ok(b.doesNotProve && b.doesNotProve !== '—' && b.doesNotProve.length > 5, `${b.id}: what it does NOT prove`);
    for (const c of b.cards) assert.ok(ledger[c], `${b.id}: card ${c}`);
    for (const o of b.objects) assert.ok(ids.has(o), `${b.id}: object ${o}`);
  }
  const md = read('research/foundation_bridges.md');
  for (const b of F.bridges) assert.ok(md.includes(`| ${b.id} |`), `${b.id} rendered`);
  const dep = read('research/foundation_dependencies.md');
  for (const o of F.objects) assert.ok(dep.includes(`| ${o.id} |`), `${o.id} rendered`);
});

test('no user-origin theory falls out of the Foundation map; Nadia\'s wording is kept verbatim', () => {
  const ut = read('research/foundation_user_theories.md');
  for (const r of reg.values()) if (r.origin === 'user') assert.ok(ut.includes(`| ${r.id} |`), `${r.id} missing from Part X detail`);
  const map = read('research/master_math_map.md');
  for (const s of ["mass is waves too, it's just a different form.", 'Any geometrical object that is bound by rules can be periodic.']) {
    assert.ok(map.includes(s), s);
  }
  assert.equal(reg.get('T-MASS-WAVE-SEED').words, "mass is waves too, it's just a different form.");
  assert.ok(reg.get('T-GRAVITY-ATTRACTION') && reg.get('T-THERMALENS'));
});

test('the master map has Parts I–XV in order, keeps lists non-exhaustive, and avoids forbidden compressions', () => {
  const map = read('research/master_math_map.md');
  const parts = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'].map((p) => map.indexOf(`## Part ${p}.`));
  assert.ok(parts.every((i) => i >= 0), 'all fifteen parts present');
  assert.deepEqual([...parts].sort((a, b) => a - b), parts, 'parts in order');
  assert.ok(map.includes('not a logically exhaustive classification'));
  for (const f of ['research/master_math_map.md', 'research/foundation_completion.md', 'research/foundation_bridges.md', 'research/foundation_dependencies.md']) {
    const t = read(f);
    assert.ok(!/these are all (the )?possible|all possible (geometries|zeros|representations)|zero is (a |the )?lower-dimensional/i.test(t.replace(/Not written: "zero is lower-dimensional"[^\n]*/, '')), f);
  }
});

test('Foundation ratings are separate dimensions; verification coverage is the computed share', () => {
  const comp = read('research/foundation_completion.md');
  for (const d of ['Foundation architecture completeness', 'Mathematical verification coverage', 'Cross-domain validation', 'Project-specific construction maturity', 'Paper / source coverage', 'Application validation'])
    assert.ok(comp.includes(`| ${d} |`), d);
  assert.ok(!/overall (score|rating)\s*[:|]\s*\d/i.test(comp), 'no single overall score');
  const est = F.objects.filter((o) => o.status === 'ESTABLISHED' || o.status === 'DERIVED');
  const carded = est.filter((o) => o.cards.some((c) => ledger[c]?.verdict === 'PASS'));
  const pct = Math.round((100 * carded.length) / est.length);
  assert.ok(comp.includes(`| Mathematical verification coverage | ${pct}% |`), `coverage should read ${pct}% (${carded.length}/${est.length})`);
  assert.ok(comp.includes('## LOCKED (Pass 2)') && comp.includes('## Domain statuses'), 'Pass 2 ledger sections');
  assert.deepEqual(F.domainStatuses, ['LOCKED', 'SOURCE-COMPLETE', 'MATH-CARDED', 'SOURCE+CARD COMPLETE', 'NEEDS DERIVATION', 'NEEDS CROSS-DOMAIN TEST', 'OPEN LONG-TERM', 'WORDING ONLY']);
  for (const d of F.domains) {
    assert.ok(F.domainStatuses.includes(d.status), `${d.id}: status`);
    assert.ok(comp.includes(`| ${d.id}. ${d.name} |`) && d.objects.every((i) => ids.has(i)), `${d.id} rendered with real objects`);
  }
  for (const r of F.ratings) assert.ok(comp.includes(`| ${r.dimension} | ${r.rating}% | ${r.previous}% |`), `${r.dimension}: rating and previous value`);
  assert.deepEqual(F.ratings.map((r) => r.previous), [65, 78, 20, 45, 20, 0], 'previous V1 ratings kept for the comparison');
});
