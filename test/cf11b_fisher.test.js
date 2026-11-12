// Foundation Completion Pass 3 (2026-11-12): the preregistered CF11-B test under Fisher / Riemannian geometry.
// Guards: the preregistration fixed the outcomes and decision rule; CF11-B's wording is unchanged; the reported
// outcome is the one the preregistered rule gives on the ledger's card verdicts; passive coordinate changes are kept
// apart from active symmetries; the kept FAIL and the non-preregistered cards are labelled.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const F = JSON.parse(read('research/foundation.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const prereg = read('research/constructions/cf11b_fisher_prereg.md');
const result = read('research/constructions/cf11b_fisher_test.md');
const pass = (...ids) => ids.every((id) => latest[id]?.verdict === 'PASS');
const CF11B = 'Can relation + admissible transformations + preserved structure provide a broader organizing architecture across the geometries investigated in this project?';

test('the preregistration fixed the object, the four outcomes, the decision rule and the card list', () => {
  for (const s of ['CF11-F1', 'CF11-F2', 'CF11-F3', 'CF11-F4', 'There is no fifth outcome.', 'Decision rule', 'Type A (passive) coordinate change', 'Type B, active',
    'F^*T = T', 'Pullback preservation is evaluated here as a candidate common form', 'Anticipated outcome (knowledge leakage)', 'Vacuity test', 'F-C′', '## 13. Cards (fixed)'])
    assert.ok(prereg.includes(s), s);
  assert.ok(prereg.replace(/\s+/g, ' ').includes(CF11B), 'locked wording recorded in the preregistration (line wrapping ignored)');
  for (const id of ['CFT1a', 'CFT2a', 'CFT3c', 'CFT4c', 'CFT5b', 'CFT5c', 'CFT6a–c', 'CFT7a–b', 'CFT8a–c', 'CFT9a–c', 'CFT10a–b']) assert.ok(prereg.includes(id), `${id} listed before the test`);
  assert.ok(!prereg.includes('CFT11'), 'CFT11 cards were not preregistered');
});

test('CF11-B wording is unchanged by the test', () => {
  assert.equal(reg.get('T-CF11-B').words, CF11B);
  assert.equal(obj.get('CF11-B').equation, CF11B);
  assert.equal(obj.get('CF11-B').status, 'HYPOTHESIS');
});

test('the reported outcome is the one the preregistered rule gives on the ledger', () => {
  const q1 = pass('CFT1a', 'CFT1b', 'CFT1c', 'CFT9a', 'CFT2a', 'CFT2c', 'CFT3b', 'CFT4d', 'CFT6c') && latest.CFT5a?.verdict === 'PASS';
  const q2 = pass('CFT3c', 'CFT4c', 'CFT4e', 'CFT5d');
  const q4 = pass('CFT1c', 'CFT2b', 'CFT3b', 'CFT4d', 'CFT6c', 'CFT9b', 'CFT10a', 'CFT10b');
  const q3failsFCprime = pass('CFT5a', 'CFT5c');                // F-C′: no supplied symmetry, yet an exact null
  const refinementCovers = pass('CFT11b', 'CFT10a');
  const expected = q1 && q2 && q4 && !q3failsFCprime ? 'CF11-F1'
    : q1 && q2 && q4 && q3failsFCprime && refinementCovers ? 'CF11-F2'
    : !q1 ? 'CF11-F3 or CF11-F4' : 'CF11-F3';
  assert.equal(F.cf11b.outcome, expected);
  assert.ok(F.cf11b.outcomes.includes(F.cf11b.outcome) && F.cf11b.classifications.includes(F.cf11b.classification));
  assert.equal(F.cf11b.classification, 'REFINED');
  assert.equal(F.cf11b.preregCommit, 'e6f3db8');
  assert.ok(result.includes(`**${F.cf11b.outcome}, PARTIAL SURVIVAL**`));
  assert.equal((result.match(/\*\*CF11-F[1-4]\*\*/g) ?? []).length, 1, 'exactly one outcome stated as the result');
});

test('passive coordinate change and active symmetry are kept apart', () => {
  const map = read('research/master_math_map.md');
  for (const t of [result, map]) assert.ok(!/\bg is unchanged\b/.test(t), 'never "g is unchanged"');
  assert.ok(result.includes('| Type A, passive | Type B, active |') && result.includes('never F*g = g'));
  const br37 = F.bridges.find((b) => b.id === 'BR37');
  assert.match(br37.doesNotProve, /never written F\*g = g/);
  assert.ok(obj.get('CF13').equation.includes('g_φ = Jᵀ g(θ(φ)) J') && obj.get('CF13').equation.includes('not invariant: the component eigenvalues'));
  assert.ok(pass('CFT4e', 'CFT5e'));
});

test('the pullback bridge is the coordinate form of the matrix law, with its scope', () => {
  const b = F.bridges.find((x) => x.id === 'BR36');
  assert.equal(b.strength, 'EXACT IDENTITY');
  assert.ok(pass(...b.cards));
  assert.equal(F.cf11b.pullbackCommonForm, 'YES');
  assert.ok(result.includes('Not all geometry = pullback invariance') || result.includes('**Not "all geometry = pullback invariance".**'));
  assert.equal(obj.get('CF12').mathematicalStatus, 'TEXTBOOK / KNOWN');
  assert.match(obj.get('CF12').foundationRole, /KNOWN MATHEMATICS, HIGH FOUNDATION RELEVANCE/);
});

test('the kept FAIL and the non-preregistered cards are labelled; ratings stay separate', () => {
  assert.equal(latest.CFT6b?.verdict, 'FAIL', 'CFT6b stays on the ledger as FAIL');
  assert.ok(latest.CFT6b2?.verdict === 'PASS' && latest.CFT6b2.claim.startsWith('[added after CFT6b FAILED'));
  assert.ok(obj.get('F1').cards.includes('CFT6b'));
  for (const id of ['CFT11a', 'CFT11b']) assert.ok(latest[id]?.claim.startsWith('[not preregistered'), id);
  const r = ['CF11-A', 'CF11-B', 'CF11-R', 'CF12'].map((i) => obj.get(i));
  assert.equal(new Set(r.map((o) => `${o.backboneSupport}/${o.slopRisk}`)).size, 4, 'four separate ratings');
  for (const o of r) assert.ok(o.applicationBreadth <= 3, `${o.id}: mathematical domains are not empirical breadth`);
  assert.ok(!Object.values(latest).some((c) => /NONTRIVIAL PREDICTIVE/.test(c.claim)), 'no predictive transfer claimed');
});
