// #17 final adversarial lock (2026-11-17). Guards docs/restructure_decisions.md, "#17 final adversarial lock": boost scope,
// mass selects the level, the scoped proper-time phase rate, the withdrawn Fourier-duality claim, the Fourier converse
// (source read + exact cards), separate MW statuses with MW-C unsoftened, the live-text audit, story fidelity, the verdict.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const P = JSON.parse(read('research/p17.json'));
const C = JSON.parse(read('research/canonical_story.json'));
const F = JSON.parse(read('research/foundation.json'));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const decisions = read('docs/restructure_decisions.md');
const rec = read('research/constructions/p17_conjugacy_physical_pairs.md');
const map = read('research/master_math_map.md');
const matrix = read('research/application_matrix.md');
const decided = (t) => decisions.includes(t);
const pass = (...ids) => ids.every((c) => latest[c]?.verdict === 'PASS');
const obj = new Map(F.objects.map((o) => [o.id, o]));
const br = new Map(F.bridges.map((b) => [b.id, b]));
// live text: the record before its superseded section and audit table; the master map without superseded lines
const recLive = rec.slice(0, rec.indexOf('### Live-text audit'));
const mapLive = map.split('\n').filter((l) => !/[Ss]uperseded|SUPERSEDED|withdrawn/.test(l)).join('\n');
const block17 = mapLive.slice(mapLive.indexOf('### #17: conjugacy and physical pairs'), mapLive.indexOf('## Part IV.'));

test('1. the lock cards pass on the ledger; the kept FAILs are unchanged', () => {
  assert.deepEqual(P.lockCards, ['P17La', 'P17Lb', 'P17Lc', 'P17Ld', 'P17Le', 'P17Lf', 'P17Lg']);
  assert.ok(pass(...P.lockCards));
  assert.deepEqual(Object.keys(latest).filter((k) => latest[k].verdict !== 'PASS').sort(), ['B5a', 'C8c', 'CFT6b', 'S14a', 'Z1a', 'Z2b']);
});

test('2. boost scope: proper orthochronous boosts only, never the full Lorentz group', () => {
  for (const t of ['Proper orthochronous Lorentz boosts preserve each positive- or negative-energy mass-shell branch separately.', 'Do not make this claim for the full Lorentz group.']) assert.ok(decided(t), t);
  assert.equal(P.words.boost, 'Proper orthochronous Lorentz boosts preserve each positive- or negative-energy mass-shell branch separately.');
  assert.ok(recLive.includes(P.words.boost) && block17.includes('this is not claimed for the full Lorentz group'));
  for (const t of [recLive, block17, JSON.stringify(C.chains.P17), JSON.stringify(P.massive), JSON.stringify(P.statusTable)])
    assert.ok(!/never (change|between) (the )?branch|boosts never/.test(t), 'no unscoped branch claim');
  assert.match(P.massive[1].statement, /Not claimed for the full Lorentz group/);
  assert.ok(pass('P17La', 'P17Ca'));
});

test('3. mass selects the level of one unchanged form; no "shape" claim; the spectral null stays distinct', () => {
  for (const t of ['Mass labels/selects the invariant level of the same Lorentzian quadratic form.', 'm=0 ⇒ q(P)=0,', 'm>0 ⇒ q(P)=(mc/ħ)²>0.', 'Keep spectral/frequency-momentum null distinct from spacetime null and every other zero/null in the project.']) assert.ok(decided(t), t);
  assert.equal(P.words.levels, 'm = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level).');
  assert.match(P.massAnswer, /m does not change the geometry, it selects the level/);
  for (const t of [recLive, block17]) assert.ok(!/(mass|m) (fundamentally )?changes the (shape|geometry)\b(?! of)/i.test(t.replace(/m does not change the geometry/g, '')), 'no shape claim');
  assert.ok(P.nulls.length >= 4 && new Set(P.nulls.map((n) => n.where)).size >= 3);
  assert.ok(pass('P17Lg'));
});

test('4. the proper-time phase rate is scoped, with its assumptions carded', () => {
  assert.ok(decided('Along the worldline associated with the same on-shell four-momentum, the free massive plane-wave phase accumulates at the invariant proper-time rate mc²/ħ, up to sign convention.'));
  assert.equal(reg.get('T-P17-PHASE-RATE').words, P.words.phaseRate);
  assert.equal(reg.get('T-P17-PHASE-RATE').status, 'derived');
  assert.match(latest.P17Lb.claim, /\(A1\).*\(A2\).*\(A3\).*\(A4\)/);
  for (const t of [recLive, block17, JSON.stringify(P.statusTable), JSON.stringify(F.objects.find((o) => o.id === 'P17C'))])
    assert.ok(!/every mode's phase|for every k;|for EVERY k/.test(t), 'no unscoped phase-rate claim');
});

test('5. the Fourier-duality claim is withdrawn; the stronger question is open and not investigated', () => {
  for (const t of ['It does NOT by itself establish that mass and proper time are Fourier-conjugate variables.', 'Is there a physically meaningful formulation in which mass/rest energy acts as a genuine spectral variable conjugate to proper time?', 'Do not investigate it in this pass.']) assert.ok(decided(t), t);
  const live = [recLive, block17, JSON.stringify(P.candidates), JSON.stringify(P.kinds), JSON.stringify(P.mw), JSON.stringify(P.statusTable), JSON.stringify(P.story), JSON.stringify(C.chains.P17),
    JSON.stringify(obj.get('P17C')), JSON.stringify(br.get('BR92')), JSON.stringify(br.get('BR91')), reg.get('T-MW-C').normalizedStatement];
  for (const t of live) assert.ok(!/Fourier-dual pair|is Fourier-dual to proper time|dual to proper time τ \(P17Dg|Fourier-duality reading (mc|BR92 does)/.test(t.replace(/not a Fourier-dual pair/g, '')), 'duality claim withdrawn from live text');
  const rc = reg.get('T-P17-REST-CLOCK');
  assert.equal(rc.supersededBy, 'T-P17-PHASE-RATE');
  assert.equal(reg.get('T-P17-PHASE-RATE').supersedes, 'T-P17-REST-CLOCK');
  assert.equal(rc.assessment.mathematicalCorrectness, 'not established');
  assert.equal(reg.get('T-P17-MASS-SPECTRAL-Q').status, 'open');
  assert.ok(P.nextQuestions.some((q) => q.startsWith('Q17-4: Is there a physically meaningful formulation')));
  assert.match(matrix, /that\nresult is withdrawn|result is withdrawn/);
  assert.ok(pass('P17Lf'));
});

test('6. the Fourier converse: a source actually read, and exact cards under stated hypotheses', () => {
  assert.ok(decided('Do not rely only on a catalogue record.'));
  const src = F.sources.find((x) => x.id === 'SRC-ZHOU-SIADAT-2017');
  assert.equal(src.status, 'FULL TEXT READ (arXiv version); CLAIM QUOTED');
  assert.ok(src.supports.includes('P17F'));
  assert.match(read('research/sources/zhou_siadat_2017.md'), /Theorem 1\.15 \(Uniqueness Theorem\)\. If f ∈ L1 \(R\) and fˆ = 0 everywhere/);
  assert.equal(P.converse.statement, 'for x ∈ L¹(ℝ): x̂(−ω) = conj x̂(ω) for every ω ⟺ x is real almost everywhere');
  assert.ok(pass('P17Lc', 'P17Ld', 'P17Le'));
  assert.match(latest.P17Lc.claim, /no theorem imported/);
  assert.match(latest.P17Ld.claim, /no uniqueness theorem imported/);
});

test('7. MW-A–MW-D keep separate statuses; MW-C fails without being softened; MW-D is not promoted', () => {
  assert.deepEqual(Object.fromEntries(P.mw.map((m) => [m.id, m.status])), { 'MW-A': 'RESTRICTED', 'MW-B': 'ESTABLISHED', 'MW-C': 'FAIL', 'MW-D': 'OPEN' });
  const mw = Object.fromEntries(P.mw.map((m) => [m.id, m]));
  assert.match(mw['MW-A'].basis, /pc²\/E/);
  assert.match(mw['MW-A'].basis, /p = γmv and E = γmc²/);
  assert.ok(decided('mass determines the invariant mass-shell level and the associated rest-frame/proper-time phase rate.'));
  assert.match(mw['MW-C'].basis, /^FAIL: .*What survives: mass determines the invariant mass-shell level and the associated rest-frame\/proper-time phase rate\./);
  assert.match(mw['MW-C'].basis, /no Fourier-duality claim replaces the failure/);
  assert.match(mw['MW-D'].basis, /cannot establish particle ontology/);
  assert.equal(reg.get('T-MW-D').status, 'open');
  assert.equal(reg.get('T-MASS-WAVE-SEED').status, 'hypothesis');
});

test('8. the physical-pairing audit covers the six flagged claims, and none remains live', () => {
  const claims = P.audit.map((a) => a.claim);
  for (const c of ['physical pairs are generally complex conjugates', 'mass is a wave', 'mass and wave are Fourier-conjugate', 'positive and negative frequency automatically mean particle/antiparticle', 'the spectral mass shell is physical spacetime', 'every Lorentz transformation preserves an energy branch']) assert.ok(claims.includes(c), c);
  for (const t of [recLive, block17]) {
    assert.ok(!/physical pairs are (mathematically |generally )?(complex )?conjugate(?! in general \(T-CONJUGACY)/i.test(t.replace(/that observable physical pairs are mathematically conjugate in general|"physical pairs are conjugate"/g, '')), 'pairs');
    for (const l of t.split('\n').filter((x) => /antiparticle/i.test(x))) assert.match(l, /NOT USED|future branch|not used|no particle|any particle|none used/i, l.slice(0, 100));
  }
});

test('9. story fidelity: #12 → #17 historical, the rest cross-references, the decided order, no new node', () => {
  assert.equal(C.master.length, 20);
  const edge = (a, b) => C.edges.find((e) => e.src === a && e.dst === b);
  assert.equal(edge('M12', 'M17').type, 'EARLIER PREDECESSOR');
  for (const a of ['M13', 'M14', 'M18', 'M19']) assert.equal(edge(a, 'M17').type, 'CROSS-REFERENCE');
  assert.ok(decided('Do not convert them into causal predecessors.'));
  const steps = C.chains.P17.steps.map((s) => `${s.kind}: ${s.text}`);
  const at = (re) => steps.findIndex((t) => re.test(t));
  const order = [/Fourier conjugacy/, /Do observable physical pairings/, /candidate mass\/wave investigation/, /exact mass-shell relation/, /^R: FAIL/, /spectral variable conjugate to proper time/];
  const idx = order.map(at);
  assert.ok(idx.every((i) => i >= 0), JSON.stringify(idx));
  assert.deepEqual([...idx].sort((a, b) => a - b), idx, 'the decided order');
  assert.equal(C.chains.P17.steps.find((s) => /candidate mass\/wave investigation/.test(s.text)).kind, 'X', 'the seed enters as a cross-reference');
});

test('10. the verdict is one of the two decided strings; the stopping point is recorded', () => {
  assert.ok(['LOCK #17 — STORY AND MATHEMATICS ALIGNED', 'DO NOT LOCK #17 — SPECIFIC MISALIGNMENT REMAINS'].includes(P.lock.choice));
  assert.ok(decided(P.lock.choice));
  assert.equal(C.p17.lock, P.lock.choice);
  assert.equal(F.domains.find((d) => d.id === 'D41').status, 'LOCKED');
  assert.ok(decided(P.lock.stop));
  assert.ok(map.includes('**LOCK #17 — STORY AND MATHEMATICS ALIGNED** (2026-11-17)'));
});
