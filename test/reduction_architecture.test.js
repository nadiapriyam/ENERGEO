// Reduction / Information-Changing Architecture (2026-11-13): a parallel architecture for maps Φ: X → Y that may
// change, collapse or discard information. Guards the amendment's twelve requirements (docs/restructure_decisions.md,
// "Reduction / Information-Changing Architecture"); R1 / R2 / R3 and CF11-F2 stay unchanged.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const F = JSON.parse(read('research/foundation.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const br = new Map(F.bridges.map((b) => [b.id, b]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const map = read('research/master_math_map.md');
const rmap = (name) => F.reductionMaps.find((r) => r.name.startsWith(name));
const pass = (...ids) => ids.every((id) => latest[id]?.verdict === 'PASS');

test('1. R1 / R2 / R3 and CF11-F2 are unchanged; there is no R4', () => {
  assert.ok(obj.get('TA1').equation.startsWith('same abstract object, different coordinate representation, covariant transformation law'));
  assert.ok(obj.get('TA2').equation.startsWith('active symmetry: F*T = T'));
  assert.ok(obj.get('TA3').equation.startsWith('C ρ_V(g) = ρ_W(g) C'));
  assert.deepEqual(obj.get('TA0').dependsOn, ['TA1', 'TA2', 'TA3']);
  for (const o of F.objects) for (const l of o.transformationLevel) assert.ok(['R1', 'R2', 'R3'].includes(l), `${o.id}: ${l}`);
  assert.equal(F.cf11b.outcome, 'CF11-F2');
});

test('2. information-changing maps are not automatically R1', () => {
  const ic = F.objects.filter((o) => o.reductionRole === 'INFORMATION-CHANGING');
  assert.ok(ic.length >= 10);
  for (const o of ic) assert.ok(!o.transformationLevel.includes('R1'), `${o.id} is information-changing and labelled R1`);
  for (const r of F.reductionMaps) if (/information-changing/.test(r.axisA)) assert.ok(!r.axisB.includes('covariant'), `${r.name}: an information-changing map is not a covariant change of representation`);
});

test('3. projection is not treated as a coordinate change', () => {
  const s = rmap('Simplex projection');
  assert.match(s.axisA, /^noninvertible; information-changing/);
  assert.equal(br.get('BR48').strength, 'FAILED CONNECTION');
  for (const id of ['R8', 'H1', 'ON5']) assert.equal(obj.get(id).reductionRole, 'INFORMATION-CHANGING', id);
  assert.ok(pass('TRA4b', 'RIC1a'));
});

test('4. weighted centering has both an information-changing and an R3 role', () => {
  const h4 = obj.get('H4');
  assert.equal(h4.reductionRole, 'INFORMATION-CHANGING');
  assert.deepEqual(h4.transformationLevel, ['R3']);
  const wc = rmap('Weighted centering');
  assert.ok(wc.axisB.includes('equivariant') && /not an isometry/.test(wc.symmetry));
  assert.ok(pass('RIC1b', 'CFT8b', 'CFT8c'));
});

test('5. the Fourier transform itself is not labelled lossy', () => {
  const f = rmap('Fourier transform (unitary)');
  assert.equal(f.axisA, 'invertible; information-preserving');
  assert.ok(f.collapses === 'nothing' && f.lost === 'nothing');
  for (const id of ['R1', 'R2', 'R3', 'R5']) assert.equal(obj.get(id).reductionRole, null, id);
  assert.deepEqual(obj.get('R5').transformationLevel, ['R1']);
  assert.deepEqual(obj.get('R4').transformationLevel, ['R3']);
});

test('6. magnitude-only and coefficient removal are information-changing', () => {
  for (const name of ['Keeping Fourier magnitudes only', 'Discarding Fourier coefficients']) assert.match(rmap(name).axisA, /information-changing/, name);
  assert.equal(rmap('Keeping Fourier magnitudes only').lost, 'phase');
  assert.ok(pass('RIC1c'));
  assert.equal(obj.get('T3').reductionRole, 'INFORMATION-CHANGING');
});

test('7. the finite-DFT shift statement is scoped to integer cyclic shifts', () => {
  assert.match(br.get('BR46').connector, /finite DFT the identity holds for integer cyclic sample shifts modulo N/);
  for (const f of ['research/master_math_map.md', 'research/foundation_bridges.md', 'research/foundation_dependencies.md', 'research/foundation_reduction_maps.md'])
    for (const line of read(f).split('\n'))
      if (/DFT/.test(line) && /every (shift|a\b)|all shifts|any shift/i.test(line)) assert.match(line, /integer cyclic/, `${f}: "${line.slice(0, 90)}"`);
});

test('8. DYADIC PACKETS remains an open definition', () => {
  const w3 = obj.get('W3');
  assert.equal(w3.status, 'OPEN');
  assert.ok(w3.equation.startsWith('ORIGINAL USER RESEARCH TERM; OPEN DEFINITION.'));
  assert.equal(reg.get('T-DYADIC').normalizedStatement, null);
  assert.equal(reg.get('T-DYADIC').status, 'open');
  for (const id of ['T-DYADIC-Q1', 'T-DYADIC-Q2']) assert.equal(reg.get(id).kind, 'open-question', id);
  assert.equal(obj.get('W3').mathematicalStatus, null, 'not rated as established mathematics');
});

test('9. DYADIC PACKETS is not silently renamed standard wavelet packets', () => {
  const w3 = obj.get('W3');
  assert.equal(w3.name, 'DYADIC PACKETS');
  assert.ok(w3.equation.includes('not the definition') && w3.equation.includes('DYADIC STRUCTURE — CANDIDATE, NOT UNIVERSAL'));
  assert.ok(w3.equation.includes('Not identified with standard wavelet packets, dyadic wavelet trees, scattering paths or multiresolution analysis'));
  for (const f of ['research/master_math_map.md', 'research/foundation_reduction_maps.md', 'research/foundation_dependencies.md'])
    assert.ok(!/DYADIC PACKETS\s*(=|is|are|means|denotes)\s*(the |a )?(standard )?(wavelet packets|dyadic wavelet|scattering path|multiresolution)/i.test(read(f)), f);
});

test('10. preserved zero and collapsed zero remain distinct; the zero taxonomy is kept', () => {
  assert.equal(br.get('BR51').strength, 'FAILED CONNECTION');
  assert.ok(map.includes('**Preserved zero** (transformation)') && map.includes('**Collapsed zero** (reduction)'));
  assert.ok(pass('RIC1d'));
  for (const z of ['Additive / resultant (Z1)', 'Quadratic null (Z5)', 'Definite quadratic zero (Z10)', 'Observable / eigenvalue (Z6)']) assert.ok(map.includes(`| ${z} |`), z);
  assert.match(br.get('BR50').doesNotProve, /all zeros arise from projection or are hidden higher dimensions/);
});

test('11. the simplex projection records both lost and surviving structure', () => {
  const s = rmap('Simplex projection');
  assert.match(s.survives, /vᵢ − vⱼ = eᵢ − eⱼ/);
  assert.match(s.collapses, /x and x \+ c1/);
  assert.match(s.zero, /Pₙ1 = 0/);
  assert.match(s.lost, /common component/);
  assert.match(s.reconstructible, /orthonormal-source assumptions/);
  assert.match(s.reconstructible, /without the source class, no/);
  assert.ok(pass('RIC1a', 'G3b', 'G4c'));
});

test('12. no equivalence among coarse-graining, scattering, model reduction and projection is asserted without a card', () => {
  const groups = [['H7'], ['W1', 'W2'], ['M2', 'M3'], ['H1', 'R8', 'ON3']];
  for (const b of F.bridges) {
    const hit = groups.filter((g) => g.some((id) => b.objects.includes(id))).length;
    if (hit >= 2) assert.ok(['OPEN CONNECTION', 'FAILED CONNECTION'].includes(b.strength) || (b.cards.length && pass(...b.cards)), `${b.id} links two mechanisms`);
  }
  for (const id of ['BR54', 'BR55']) assert.equal(br.get(id).strength, 'OPEN CONNECTION', id);
  const kw = [/coarse-grain|renormaliz|\bRG\b/i, /scattering|Mallat/i, /model reduction|manifold boundar|MBAM/i, /projection/i];
  for (const line of map.split('\n')) {
    if (kw.filter((r) => r.test(line)).length >= 2 && /equivalent|the same mechanism|is a form of|reduces to/i.test(line)) assert.match(line, /\bnot\b|no equivalence/i, line.slice(0, 120));
  }
});

// Four precision corrections (2026-11-13): generic simplex values, the Gram, wavelet invertibility / invariance, and
// the collapsed-zero wording. Architecture, ratings, CF11-F2, R1 / R2 / R3 and the DYADIC status are unchanged.
const scanned = ['research/master_math_map.md', 'research/foundation_bridges.md', 'research/foundation_dependencies.md', 'research/foundation_reduction_maps.md', 'research/foundation_completion.md'];

test('precision 1: generic simplex inner products are −1/n; −1/3 only for n = 3', () => {
  const b = br.get('BR48');
  assert.match(b.connector, /\(Pₙeᵢ\)·\(Pₙeⱼ\) = −1\/n for i ≠ j/);
  assert.match(b.connector, /\|Pₙeᵢ\|² = \(n − 1\)\/n/);
  assert.ok(b.cards.includes('G2n') && pass('G2n', 'TRA4b'));
  for (const f of scanned) for (const line of read(f).split('\n'))
    if (/−1\/3|-1\/3/.test(line)) assert.match(line, /n = 3/, `${f}: −1/3 without n = 3: "${line.slice(0, 90)}"`);
});

test('precision 2: the source Gram does not survive; the projected simplex has Gram Pₙ', () => {
  const s = rmap('Simplex projection');
  assert.match(s.survives, /exact Gram matrix Pₙ = I − 11ᵀ\/n/);
  assert.match(s.survives, /source Gram I does not survive/);
  assert.match(s.survives, /survive exactly while the common mode is removed/);
  assert.ok(!/regular-simplex Gram/.test(s.survives), 'the old "regular-simplex Gram survives" wording is gone');
  const row = map.split('\n').find((l) => l.startsWith('| What survives | pairwise differences'));
  assert.ok(row && row.includes('exact Gram matrix Pₙ') && row.includes('does not survive'), 'master map simplex row corrected');
  assert.match(s.reconstructible, /orthonormal-source assumptions/);
});

test('precision 3: a single filter is not invertible; finite-scale averaging is covariant, not invariant', () => {
  const single = rmap('Single wavelet filter');
  assert.match(single.axisA, /^noninvertible/);
  assert.match(single.symmetry, /translation covariance/);
  assert.match(rmap('Complete wavelet transform / filter bank').axisA, /under its stated assumptions/);
  const fin = rmap('Finite-scale low-pass averaging');
  assert.ok(!fin.axisB.includes('invariant'));
  assert.match(fin.symmetry, /NOT exact invariance/);
  for (const r of F.reductionMaps) {
    if (/single|one filter/i.test(r.name)) assert.ok(!/^invertible/.test(r.axisA), r.name);
    if (r.axisB.includes('invariant') && /average|averaging|scattering/i.test(r.name)) assert.match(r.symmetry, /full-domain|global|limit/, `${r.name}: invariance needs its assumption`);
  }
  for (const line of read('research/master_math_map.md').split('\n'))
    if (/translation[- ]invarian/i.test(line) && /averag/i.test(line)) assert.match(line, /global|limit|full-domain|circular|local|source|insensitiv|Group Invariant/i, line.slice(0, 120));
  assert.ok(pass('RIC2a', 'RIC2b'));
});

test('precision 4: a target zero need not have a nonzero preimage; preserved ≠ collapsed', () => {
  for (const f of scanned) assert.ok(!/zero in the target ↔ hidden source structure|target zero ↔ hidden source structure/i.test(read(f)), f);
  const b = br.get('BR50');
  assert.match(b.connector, /Φ⁻¹\(0\)/);
  assert.match(b.doesNotProve, /every target zero implies a nonzero hidden source/);
  assert.match(obj.get('RI2').foundationRole, /not every target zero implies a nonzero hidden source/);
  assert.equal(br.get('BR51').strength, 'FAILED CONNECTION');
  assert.ok(pass('RIC2c'));
});
