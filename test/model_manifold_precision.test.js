// Model-manifold precision corrections (2026-11-15). Guards Nadia's precision decisions
// (docs/restructure_decisions.md, "Model-manifold precision corrections"): every overstated statement of the
// 2026-11-13 audit is corrected AND kept as history; the MMI card outputs are unchanged; C7 stays OPEN.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const M = JSON.parse(read('research/model_manifold.json'));
const F = JSON.parse(read('research/foundation.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const br = new Map(F.bridges.map((b) => [b.id, b]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const decisions = read('docs/restructure_decisions.md');
const story = read('research/model_manifold_story.md');
const liveStory = story.replace(/## Precision corrections[\s\S]*?(?=\n## )/, '');
const invmd = read('research/model_manifold_invariance.md');
const liveInv = invmd.replace(/## Superseded rows[\s\S]*$/, '');
const map = read('research/master_math_map.md');
const mmSection = map.slice(map.indexOf('### Model manifolds: invariance and the research story'), map.indexOf('## Part X.'));
const fdeps = read('research/foundation_dependencies.md');
const fbr = read('research/foundation_bridges.md');
const inv = new Map(M.invariance.map((r) => [r.quantity, r]));
const pass = (...ids) => ids.every((id) => latest[id]?.verdict === 'PASS');
const decided = (text) => decisions.includes(text);

test('0. the MMP cards are on the ledger and pass; the MMI card outputs are unchanged (scoped, not rewritten)', () => {
  const mmp = Object.keys(latest).filter((k) => /^MMP[a-o]$/.test(k));
  assert.equal(mmp.length, 15);
  assert.ok(pass(...mmp));
  assert.match(latest.MMIi.claim, /different finite c are related by a change of units/, 'MMIi output kept as recorded');
  assert.match(latest.MMIf.claim, /Widths are parametrization-independent/, 'MMIf output kept as recorded');
  assert.deepEqual(M.mmiScope.map((x) => x.card), ['MMIa', 'MMIc', 'MMIe', 'MMIf', 'MMIg', 'MMIh', 'MMIi']);
  for (const x of M.mmiScope) assert.match(x.scope, /MMP[a-o]/, `${x.card} scoped by an MMP card`);
});

test('1. model image vs smooth manifold', () => {
  assert.ok(decided('M = Y(Θ) ⊆ P as the model image/model set in full generality.'));
  assert.match(M.structure.image, /model image \/ model set, in full generality/);
  assert.match(M.structure.manifold, /regular region only: constant local rank and local injectivity/);
  assert.deepEqual(M.structure.phenomena.map((p) => p.kind), ['rank loss', 'non-identifiability', 'self-intersection', 'singular stratum', 'boundary / limiting stratum']);
  assert.ok(pass('MMPa', 'MMPj'));
  assert.match(obj.get('MM1').name, /model image/);
  assert.match(obj.get('MM1').equation, /smooth model manifold only on a regular region/);
  assert.ok(!/The model manifold is M = Y\(Θ\)/.test(liveStory + mmSection));
});

test('2. a parameterization is not automatically a local coordinate system', () => {
  assert.match(M.parameters.role, /local coordinates only where the parameterization is locally regular and locally identifiable/);
  assert.match(M.parameters.many, /different parameter values may represent the same prediction/);
  const r = reg.get('T-MM-RULES');
  assert.match(r.normalizedStatement, /local coordinates only where the parameterization is locally regular and locally identifiable/);
  assert.ok(!/point coordinate/.test(r.normalizedStatement));
  assert.ok(r.history.some((h) => /Previous wording: .*point coordinate/.test(h.change)), 'old normalized statement kept in history');
  assert.ok(!/point coordinate/.test(obj.get('MM2').equation + mmSection + liveStory));
  assert.ok(pass('MMPb'));
});

test('3. Fisher reparametrization notation: J_Y and A, tensor vs components', () => {
  assert.equal(M.notation.law, 'g_φ = Aᵀ g_θ A');
  assert.match(M.notation.J_Y, /J_Y = ∂Y\/∂θ/);
  assert.match(M.notation.A, /A = ∂θ\/∂φ/);
  assert.match(M.notation.tensor, /components change; the tensor does not/);
  assert.match(obj.get('MM4').equation, /g_φ = Aᵀ g_θ A/);
  for (const id of ['CF13', 'TA1']) assert.match(obj.get(id).equation, /here J = ∂θ\/∂φ is the reparametrization Jacobian, written A/, id);
  for (const id of ['BR37', 'BR41']) assert.match(br.get(id).connector, /written A in the model-manifold records/, id);
  for (const line of (liveStory + liveInv + mmSection).split('\n').filter((l) => /g_φ = Jᵀ g J|JᵀΣ⁻¹J/.test(l)))
    assert.match(line, /earlier records|Older records/, `J-for-both notation only where the older convention is explained: ${line.slice(0, 80)}`);
  assert.ok(pass('MMPc'));
});

test('4. the null equivalence carries its positive-definite hypothesis', () => {
  assert.ok(decided('This equivalence holds when the prediction/noise metric Σ⁻¹ is positive definite.'));
  assert.match(M.nullTheorem.statement, /\(J_Y v\)ᵀ Σ⁻¹ \(J_Y v\); for positive-definite Σ⁻¹, g\(v, v\) = 0 ⟺ J_Y v = 0/);
  assert.match(M.nullTheorem.hypothesis, /positive definite/);
  assert.equal(M.nullTheorem.fails.length, 2);
  assert.match(obj.get('Z9').equation, /positive definite/);
  assert.match(br.get('BR17').connector, /positive-definite/);
  assert.match(reg.get('T-ZERO-LENGTH').normalizedStatement, /positive-definite Σ⁻¹/);
  assert.ok(pass('MMPd'));
});

test('5. the noise-model theorem is restricted; its caveats are recorded separately', () => {
  assert.ok(decided('Therefore changing one positive-definite weighting to another does not change those null directions/rank.'));
  assert.match(M.noise.theorem, /fixed positive-definite Σ⁻¹: ker g = ker J_Y and rank g = rank J_Y/);
  assert.equal(M.noise.caveats.length, 3);
  assert.match(M.noise.caveats.join(' '), /singular observation metrics[\s\S]*parameter-dependent covariance[\s\S]*additional Fisher terms/);
  for (const q of ['Rank', 'Nullity / null directions']) assert.match(inv.get(q).noise, /fixed positive-definite[\s\S]*θ-dependent/, q);
  assert.ok(!/null directions and rank do not \(for SPD Σ\)/.test(liveInv));
  assert.ok(pass('MMPe'));
});

test('6. the invariant object is the full volume element', () => {
  assert.ok(decided('The full differential volume form/element is invariant.'));
  assert.match(M.volume.invariant, /√det g_θ dθ¹⋯dθⁿ/);
  assert.equal(inv.get('√det g alone').invariant, 'no');
  assert.equal(inv.get('Determinant').invariant, 'no');
  assert.equal(inv.get('Volume element').invariant, 'yes');
  assert.match(inv.get('Volume element').definition, /full element √det g_θ dθ¹⋯dθⁿ/);
  assert.ok(pass('MMPf'));
});

test('7. geometric widths vs coordinate-dependent proxies are not merged', () => {
  const geo = M.invariance.filter((r) => r.group === 'geometric' && r.quantity.startsWith('Geometric widths'));
  assert.equal(geo.length, 2);
  for (const r of geo) assert.equal(r.invariant, 'conditional', r.quantity);
  for (const q of ['Raw eigenvalues', 'Raw Hessian eigenvalues', 'Jacobian singular values', 'Parameter-coordinate axis lengths', 'Condition number', 'Widths along a chart\'s FIM eigendirections'])
    assert.ok(inv.get(q)?.invariant === 'no' && inv.get(q).group === 'proxy', q);
  assert.deepEqual(M.widths.proxies.map((p) => p.name).slice(0, 6), ['raw FIM eigenvalues', 'raw Hessian eigenvalues', 'prediction-Jacobian singular values', 'parameter-coordinate axis lengths', 'condition number', 'widths taken along a chart\'s FIM eigendirections']);
  assert.match(M.widths.rule, /Do not merge these categories/);
  assert.ok(!/[Ww]idths are (parametrization-independent|invariant under reparametrization)/.test(liveStory + liveInv + mmSection + obj.get('MM11').equation));
  assert.ok(pass('MMPg', 'MMPh'));
});

test('8. boundary objects are kept apart', () => {
  assert.deepEqual(M.boundary.map((b) => b.notion), ['boundary of the parameter domain ∂Θ', 'limiting behaviour of parameters', 'image of a limit in prediction space',
    'limiting boundary stratum / reduced-model boundary (MBAM sense)', 'ordinary topological boundary of Y(Θ) in P']);
  for (const t of ['A model-manifold boundary can arise as a limiting/degenerate model family in prediction space as parameters approach appropriate limits.',
    'Not every parameter-domain boundary gives a distinct model-manifold boundary.', 'Not every model-manifold boundary should be described as an ordinary finite boundary point in parameter coordinates.'])
    assert.ok(decided(t), t);
  assert.ok(!/domain's limits (give|are) M's boundaries/.test(liveStory + mmSection + obj.get('MM2').equation + reg.get('T-MM-RULES').normalizedStatement));
  assert.ok(pass('MMPi', 'MMPj'));
});

test('9. a finite-dimensional model image inside an infinite-dimensional prediction space; the metric formula is example-specific', () => {
  assert.match(M.functionSpace.scope, /specific continuous-output model[\s\S]*not a general formula/);
  assert.equal(M.functionSpace.dims, 'dim P = ∞, while dim M = 2 (< ∞)');
  assert.ok(decided(M.functionSpace.keep));
  assert.ok(reg.get('T-PREDICTION-INFINITE').boundaries.some((b) => /not a general formula/.test(b)));
  assert.match(obj.get('MM1').equation, /not a general formula/);
  assert.ok(pass('MMPk', 'MMIh'));
});

test('10. the three roles of c are kept apart; "a finite c is just a change of units" is not retained', () => {
  for (const r of ['Role 1 — representation/coefficient role', 'Role 2 — invariant geometric/physical role', 'Role 3 — theory-family / singular-limit role']) assert.ok(decided(r), r);
  assert.ok(decided('representation-level normalization: established for the stated form if proved; Lorentzian invariant role: established physics in its native setting; theory-family singular limit: structural analogy worth preserving; transfer to arbitrary model-manifold geometry: OPEN; universal "rules constrain states" interpretation: too weak by itself.'));
  assert.match(M.cVerdict.roles[0].note, /does not prove that physical c has no invariant significance/);
  for (const k of ['Role 1', 'Role 2', 'Role 3']) assert.match(obj.get('MM5').equation, new RegExp(k));
  assert.equal(obj.get('MM5').transferDepth, 'NOT YET FORMALIZED');
  for (const [f, t] of [['story', liveStory], ['master map section', mmSection], ['bridges', fbr], ['dependencies', fdeps]])
    for (const line of t.split('\n').filter((l) => /(finite c is|c is absorbed by|just) a change of units/.test(l)))
      assert.match(line, /was used|superseded|Superseded/, `${f}: only as quoted superseded wording: ${line.slice(0, 80)}`);
  for (const line of map.split('\n').filter((l) => /change of units/.test(l))) assert.match(line, /was used|superseded|Revised|representation/, line.slice(0, 100));
  assert.ok(F.precisionCorrections.some((x) => x.id === 'MM5' && x.field === 'equation' && /change of units/.test(x.old)), 'old MM5 wording kept');
});

test('11. c → ∞ gives a degenerate limiting bilinear form, not by itself the Newtonian metric', () => {
  const r3 = M.cVerdict.roles[2];
  assert.match(r3.statement, /degenerate limiting bilinear form/);
  assert.match(r3.note, /not by itself "the Newtonian metric"/);
  for (const t of [map, story, fbr, fdeps, read('research/connections/C9.md')])
    for (const line of t.split('\n').filter((l) => /Newtonian metric/.test(l))) assert.match(line, /\bnot\b|NOT/, line.slice(0, 100));
  assert.ok(pass('MMPm', 'C9b'));
});

test('12. a dimension drop under a parameter limit is example-specific', () => {
  assert.match(M.mmiScope.find((x) => x.card === 'MMIg').scope, /F-C example/);
  assert.match(br.get('BR60').connector, /example-specific/);
  assert.match(obj.get('MM5').equation, /example-specific/);
  for (const t of [map, fbr, read('research/foundation_reduction_maps.md')])
    for (const line of t.split('\n').filter((l) => /2 → 1/.test(l))) assert.match(line, /F-C|example|need not|generalized/, line.slice(0, 100));
  assert.ok(pass('MMPl'));
});

test('13. the quantum measurement channel is named; S_z preservation is checked, not generic', () => {
  const q = M.quantumChannel;
  assert.equal(q.map, 'D(ρ) = P_t ρ P_t + P_s ρ P_s');
  assert.match(q.observable, /S²/);
  assert.match(q.preState, /\|ud⟩ = \(\|1,0⟩ \+ \|0,0⟩\)\/√2/);
  assert.match(q.removed, /⟨1,0\|ρ\|0,0⟩ = ⟨0,0\|ρ\|1,0⟩ = 1\/2/);
  assert.match(q.preserved, /\[P_t, S_z\] = \[P_s, S_z\] = 0/);
  assert.match(q.counterexample, /−ħ\/2/);
  assert.ok(decided(q.generic));
  assert.match(obj.get('MM6').equation, /D\(ρ\) = P_t ρ P_t \+ P_s ρ P_s/);
  assert.ok(pass('MMPn', 'W2a', 'W2b'));
});

test('14. observation-type maps are different operations; their unification is OPEN', () => {
  assert.deepEqual(M.observationOps.map((o) => o.op), ['quantum measurement', 'projection', 'marginalization', 'quotient / reduction', 'manifold boundary limit', 'coarse graining', 'parameter non-identifiability']);
  assert.ok(decided(M.observationRule.open) && decided(M.observationRule.established));
  assert.ok(reg.get('T-MM-OBSERVE').boundaries.some((b) => /NOT established that they are the same operation/.test(b)));
  assert.equal(reg.get('T-MM-OBSERVE').status, 'open');
  assert.ok(pass('MMPo'));
});

test('15. C7 remains OPEN: preconditions recorded, no derivation', () => {
  assert.equal(reg.get('T-C7').status, 'open');
  assert.equal(obj.get('M4').status, 'OPEN');
  assert.equal(M.c7.status, 'OPEN');
  assert.ok(decided(M.c7.requirement) && decided(M.c7.keepBoth));
  assert.ok(decided(M.c7.candidateBridge) && decided(M.c7.possibleChain));
  assert.equal(M.c7.chainStatus, 'NOT ESTABLISHED');
  assert.ok(decided(M.c7.preconditions.join('; ') + '.'));
  assert.equal(M.c7.outcomes.length, 5);
  assert.match(M.c7.notJust, /not "hyperribbon widths exist"/);
  for (const s of F.sources) assert.ok(!s.supports.includes('M4'), `${s.id}: no paper is evidence for C7`);
});

test('16. the story is preserved; every arrow has a status in the five-class vocabulary', () => {
  assert.deepEqual(M.arrowStatuses, ['ESTABLISHED MATHEMATICS', 'PROJECT-DERIVED', 'STRUCTURAL ANALOGY', 'OPEN', 'PHILOSOPHICAL / HISTORICAL INTUITION']);
  assert.ok(decided(M.arrowStatuses.join('; ')));
  for (const ch of M.chains) for (const a of ch.arrows) assert.ok(M.arrowStatuses.includes(a.arrowStatus) && a.status, `${ch.id}: ${a.frm}`);
  assert.equal(M.chains[0].arrows.length, 4);
  assert.equal(M.viewer.arrowStatus, 'PHILOSOPHICAL / HISTORICAL INTUITION');
  const used = new Set([...M.chains.flatMap((c) => c.arrows.map((a) => a.arrowStatus)), ...M.crossLinks.map((x) => x.arrowStatus), M.viewer.arrowStatus]);
  for (const s of M.arrowStatuses) assert.ok(used.has(s), `${s} used`);
  for (const q of ['What changes when a richer state or representation is mapped to an observable manifestation?', 'Which structures survive a specified map, reduction, observation, quotient, projection, or limit?'])
    assert.ok(M.viewer.investigableForms.includes(q) && decided(q), q);
  assert.equal(reg.get('T-VIEWER-FORM').words, 'matter does not form until a viewer looks at it.');
});

test('17. supersede, never erase: every correction keeps its old claim; negative results are kept or revised, not deleted', () => {
  assert.ok(M.corrections.length >= 15);
  for (const c of M.corrections) {
    assert.ok(c.old && c.new && c.reason && c.status, c.topic);
    for (const id of c.cards) assert.ok(pass(id), `${c.topic}: ${id}`);
    assert.ok(story.includes(`| ${c.topic} |`), `${c.topic} rendered`);
  }
  const neg = M.negative.map((n) => n.result);
  for (const r of ['the invariant-form role of c does not transfer to model parameters', 'S14a stays FAIL (span 3.1 decades, threshold 4)']) assert.ok(neg.includes(r), r);
  assert.equal(M.negative.find((n) => n.result.startsWith('the invariant-form role')).status, 'revised 2026-11-15');
  for (const id of ['T-MM-RULES', 'T-ZERO-LENGTH']) assert.ok(reg.get(id).history.some((h) => /Previous wording:/.test(h.change)), id);
  assert.ok(F.precisionCorrections.length >= 20 && F.precisionCorrections.every((x) => x.old !== undefined && x.new && x.reason));
  assert.ok(decided('Do not assume the previous audit wording is automatically correct merely because its tests pass.'));
});

test('18. ratings are not inflated by passing tests', () => {
  const s = M.sectionRating;
  assert.equal(s.dimension, 'Model-manifold section overall');
  assert.ok(Number.isInteger(s.bs) && s.bs <= 40 && Number.isInteger(s.slop));
  assert.notEqual(s.td, 'NONTRIVIAL PREDICTIVE TRANSFER');
  const c7 = M.ratings.find((r) => r.dimension === 'C7 readiness');
  assert.ok(c7.bs <= 10 && c7.history.length && c7.bs <= c7.history[0].fromBs);
  const cr = M.ratings.find((r) => r.dimension === 'c / model-rule analogy');
  assert.ok(cr.bs <= cr.history[0].fromBs && cr.td === 'NOT YET FORMALIZED');
  for (const r of M.ratings) for (const h of r.history) assert.ok(h.reason && h.date === '2026-11-15', r.dimension);
});
