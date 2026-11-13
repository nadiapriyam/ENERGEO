// Pass 3 architectural correction (2026-11-12): the Transformation Architecture (TA0) with R1 representation
// covariance, R2 structural invariance / symmetry and R3 equivariance / intertwining. The historical CF11-B → CF11-F2
// result is kept; these tests guard the corrected classification (docs/restructure_decisions.md, "Pass 3
// architectural correction").

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const F = JSON.parse(read('research/foundation.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const br = new Map(F.bridges.map((b) => [b.id, b]));
const src = new Map(F.sources.map((s) => [s.id, s]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const map = read('research/master_math_map.md');
const pass = (...ids) => ids.every((id) => latest[id]?.verdict === 'PASS');
const level = (id) => obj.get(id).transformationLevel;

test('1. the historical CF11-F2 result is preserved', () => {
  assert.equal(F.cf11b.outcome, 'CF11-F2');
  assert.equal(F.cf11b.classification, 'REFINED');
  const result = read('research/constructions/cf11b_fisher_test.md');
  assert.ok(result.includes('**CF11-F2, PARTIAL SURVIVAL**') && result.includes('## 11. Architectural correction'), 'result kept; correction appended');
  assert.ok(read('research/constructions/cf11b_fisher_prereg.md').includes('**CF11-F2**'), 'the anticipated outcome in the preregistration is untouched');
  assert.match(F.cf11b.correction, /CF11-F2 is unchanged/);
  assert.equal(reg.get('T-CF11-REFINEMENT').supersededBy, 'T-TRANSFORMATION-ARCH');
  assert.ok(obj.has('CF11-R') && obj.has('CF11-B'), 'CF11 stays historically visible');
});

test('2. R1, R2 and R3 are separate records', () => {
  assert.deepEqual([level('TA1'), level('TA2'), level('TA3')], [['R1'], ['R2'], ['R3']]);
  assert.equal(new Set(['TA1', 'TA2', 'TA3'].map((i) => obj.get(i).equation)).size, 3);
  assert.deepEqual(obj.get('TA0').dependsOn, ['TA1', 'TA2', 'TA3']);
  assert.ok(!/three meanings of ("|“)?preserved/i.test(map.replace(/\*Superseded framing[^\n]*\n[^\n]*\n[^\n]*/, '')), 'the superseded framing appears only as superseded');
});

test('3. R1 is not labelled symmetry', () => {
  const r1 = obj.get('TA1');
  assert.ok(!/symmetr/i.test(r1.name));
  assert.ok(r1.equation.includes('not an active symmetry') && r1.equation.includes('never written F*g = g'));
  for (const o of F.objects) if (o.transformationLevel.length === 1 && o.transformationLevel[0] === 'R1') assert.ok(!/symmetr/i.test(o.name), `${o.id}`);
});

test('4. R2 uses pullback invariance', () => {
  assert.ok(obj.get('TA2').equation.startsWith('active symmetry: F*T = T'));
  assert.match(br.get('BR42').connector, /F\*T = T ⟺ T_\{F\(x\)\}\(dF u, dF v\) = T_x\(u, v\)/);
  assert.ok(pass(...br.get('BR42').cards));
});

test('5. A†MA = M is the coordinate special case of R2', () => {
  assert.deepEqual(level('CF1'), ['R2']);
  assert.ok(obj.get('TA2').equation.includes('A†MA = M (CF1)'));
  const b = br.get('BR36');
  assert.equal(b.strength, 'EXACT IDENTITY');
  assert.ok(b.objects.includes('CF1') && pass('CFT1a'));
});

test('6. K†M + MK = 0 is the matrix form of infinitesimal invariance', () => {
  const e = obj.get('TA2I').equation;
  for (const s of ['L_X T = 0', 'KᵀM + MK = 0', 'K†M + MK = 0']) assert.ok(e.includes(s), s);
  assert.equal(br.get('BR43').strength, 'THEOREM');
  assert.ok(pass('TRA1a', 'TRA1b', 'TRA1c'));
  assert.deepEqual(level('CF4'), ['R2']);
  assert.ok(!level('CF5').includes('R3') && !level('CF7').includes('R3'), 'conservation is downstream of R2, not R3');
});

test('7. R3 uses an intertwining / equivariance equation and is not invariance', () => {
  assert.ok(obj.get('TA3').equation.startsWith('C ρ_V(g) = ρ_W(g) C'));
  assert.ok(pass('TRA3a', 'TRA3b'));
});

test('8. Fourier shift → phase is classified under R3', () => {
  const b = br.get('BR46');
  assert.ok(b.objects.includes('TA3') && b.connector.startsWith('R3: F T_a = M_a F'));
  assert.deepEqual(level('R4'), ['R3']);
  assert.match(b.doesNotProve, /not .*physical spacetime symmetry|physical spacetime symmetry/);
});

test('9. weighted centering is an operator-compatibility mechanism, not an isometry', () => {
  assert.deepEqual(level('H4'), ['R3']);
  assert.match(br.get('BR40').connector, /^R3: .*not an isometry/);
  assert.ok(pass('CFT8a', 'CFT8b', 'CFT8c'));
  const wc = F.transformationClassesByDomain.find((d) => d.domain === 'Weighted centering');
  assert.ok(wc.classes['OPERATOR-COMPATIBLE TRANSFORMATIONS'] && !wc.classes['REPRESENTATION CHANGES']);
});

test('10. Fisher reparametrization is R1, not R2', () => {
  assert.deepEqual(level('CF13'), ['R1']);
  const fisher = F.transformationClassesByDomain.find((d) => d.domain === 'Fisher / Riemannian').classes;
  assert.match(fisher['REPRESENTATION CHANGES'], /reparametrizations: g_φ = Jᵀ g J/);
  assert.match(fisher['GEOMETRIC SYMMETRIES'], /isometries, F\*g = g/);
  assert.match(br.get('BR37').doesNotProve, /never written F\*g = g/);
});

test('11. zero relations follow from R2 only in the justified direction', () => {
  const b = br.get('BR44');
  assert.equal(b.strength, 'EXACT IMPLICATION');
  assert.match(b.doesNotProve, /converse fails/);
  assert.ok(pass('TRA2a', 'TRA2b'));
  for (const line of map.split('\n')) if (/every zero is generated by symmetry|all zeros arise from a preserved form/i.test(line)) assert.match(line, /not/, line);
});

test('12. "admissible transformation" is always qualified by its class', () => {
  const classes = F.transformationClasses;
  assert.deepEqual(classes, ['REPRESENTATION CHANGES', 'GEOMETRIC SYMMETRIES', 'SYSTEM-SUPPLIED TRANSFORMATIONS', 'OPERATOR-COMPATIBLE TRANSFORMATIONS']);
  const verbatim = [reg.get('T-CF11-B').words, reg.get('T-BACKBONE-INVARIANT').words];
  for (const f of ['research/master_math_map.md', 'research/foundation_completion.md', 'research/foundation_dependencies.md', 'research/foundation_bridges.md', 'research/foundation_sources.md', 'research/constructions/cf11b_fisher_test.md'])
    for (const line of read(f).split('\n'))
      if (/admissible transformation/i.test(line))
        assert.ok(verbatim.some((w) => line.includes(w)) || classes.some((c) => line.includes(c)) || line.includes('never used without naming the class'), `${f}: unqualified "${line.slice(0, 90)}"`);
  for (const c of classes) assert.ok(map.includes(c), c);
});

test('13. known mathematics is not labelled project novelty', () => {
  for (const id of ['TA1', 'TA2', 'TA2I', 'TA3', 'CF1', 'CF12']) {
    assert.equal(obj.get(id).novelty, 'KNOWN MATHEMATICS', id);
    assert.equal(obj.get(id).mathematicalStatus, 'TEXTBOOK / KNOWN', id);
  }
  assert.equal(obj.get('TA0').novelty, 'PROJECT ARCHITECTURAL SYNTHESIS');
  assert.equal(obj.get('TAH').status, 'HYPOTHESIS');
  for (const o of F.objects) if (o.mathematicalStatus === 'TEXTBOOK / KNOWN') assert.ok(!/PROJECT/.test(o.novelty ?? ''), o.id);
  const ch = src.get('SRC-CHENTSOV-1982');
  assert.deepEqual(ch.supports, [], 'Čencov is not completed evidence');
  assert.ok(ch.bearsOn.includes('TAC') && obj.get('TAC').status === 'OPEN');
});
