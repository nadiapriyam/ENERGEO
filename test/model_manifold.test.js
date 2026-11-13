// Model-manifold invariance + research-story audit (2026-11-13). Guards the audit's requirements
// (docs/restructure_decisions.md, "Model-manifold invariance + research-story audit"): the story is kept whole with a
// status per connection, invariance verdicts rest on cards or sources, one C7 target object is recommended (T-C7 stays
// open), the quantum-like extension stays separated and unestablished, and R1 / R2 / R3, the Reduction architecture,
// CF11-F2 and DYADIC PACKETS are unchanged.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const M = JSON.parse(read('research/model_manifold.json'));
const F = JSON.parse(read('research/foundation.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const br = new Map(F.bridges.map((b) => [b.id, b]));
const srcIds = new Set(F.sources.map((s) => s.id));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const decisions = read('docs/restructure_decisions.md');
const story = read('research/model_manifold_story.md');
const invmd = read('research/model_manifold_invariance.md');
const map = read('research/master_math_map.md');
const STATUSES = ['ESTABLISHED MATHEMATICS', 'PAPER-BACKED RESULT', 'PROJECT-DERIVED CONNECTION', 'PROJECT HYPOTHESIS', 'OPEN CONNECTION',
  'PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS', 'FAILED / NEGATIVE RESULT'];
const KEPT_FAILS = new Set(['S14a']);
const cardOk = (c) => latest[c] && (latest[c].verdict === 'PASS' || KEPT_FAILS.has(c));

test('1. the governing rule and the status classes are recorded verbatim', () => {
  const g = reg.get('T-MM-GOV');
  assert.equal(g.words, 'Do not audit away the research story. Audit the status of each connection.');
  assert.equal(g.status, 'governance');
  assert.ok(decisions.includes(g.words));
  assert.deepEqual(M.storyStatuses, STATUSES);
  assert.ok(decisions.includes(STATUSES.join('; ')));
  assert.ok(story.includes('The paper is not the thesis'));
});

test('2. the story is kept whole: both chains verbatim, every arrow carries one status', () => {
  const s = reg.get('T-MM-STORY');
  assert.equal(M.chains[0].words, s.words);
  assert.ok(s.variants.some((v) => v.words === M.chains[1].words));
  for (const ch of M.chains) {
    assert.ok(decisions.includes(ch.words), ch.id);
    assert.ok(story.includes(ch.words), `${ch.id} rendered`);
    assert.equal(ch.arrows.length, 4, ch.id);
    for (const a of ch.arrows) {
      assert.ok(STATUSES.includes(a.status), `${ch.id}: ${a.frm} → ${a.to}`);
      assert.ok(a.also === null || STATUSES.includes(a.also));
      assert.ok(a.exact && a.cards.length && a.cards.every(cardOk), `${ch.id}: ${a.frm} → ${a.to} rests on cards`);
    }
  }
  // observation / reduction is OPEN, not promoted
  assert.equal(M.chains[0].arrows[2].status, 'OPEN CONNECTION');
  assert.equal(M.chains[1].arrows[2].status, 'OPEN CONNECTION');
});

test('3. story table: at least 15 rows, the required ideas, all eight columns, real cards / registry / sources', () => {
  assert.deepEqual(M.storyColumns, ['Idea', 'Exact mathematical object', 'Established / paper result', 'Project connection', 'Project hypothesis',
    'Quantum-like / philosophical extension', 'What would falsify / weaken', 'Status']);
  assert.ok(M.story.length >= 15);
  const keys = new Set(M.story.map((r) => r.key));
  for (const k of ['prediction-space', 'model-manifold', 'parameters-rules', 'fisher-metric', 'null-directions', 'sloppy-directions', 'hyperribbon-widths',
    'manifold-boundaries', 'effective-models', 'larger-possibility-space', 'observation-manifestation', 'c-governing-rules', 'quantum-like',
    'measurement-reduction', 'information-distinguishability']) assert.ok(keys.has(k), k);
  for (const r of M.story) {
    assert.ok(STATUSES.includes(r.status), r.key);
    for (const f of ['idea', 'object', 'established', 'connection', 'hypothesis', 'extension', 'falsify']) assert.ok(r[f], `${r.key}: ${f}`);
    for (const c of r.cards) assert.ok(cardOk(c), `${r.key}: ${c}`);
    for (const id of r.registry) assert.ok(reg.has(id), `${r.key}: ${id}`);
    for (const id of r.sources) assert.ok(srcIds.has(id), `${r.key}: ${id}`);
    assert.ok(story.includes(`| ${r.idea} |`), `${r.key} rendered`);
  }
  assert.equal(M.story.find((r) => r.key === 'sloppy-directions').status, 'FAILED / NEGATIVE RESULT');
});

test('4. invariance verdicts: chart artifacts are NOT invariant, geometric quantities are, each with a card or source', () => {
  const inv = new Map(M.invariance.map((r) => [r.quantity, r]));
  assert.ok(M.invariance.length >= 14);
  for (const q of ['Raw eigenvalues', 'Condition number', 'Matrix entries g_ij', 'Determinant', 'Jacobian singular values']) assert.equal(inv.get(q)?.invariant, 'no', q);
  for (const q of ['Fisher metric tensor', 'Rank', 'Nullity / null directions', 'Curvature', 'Geodesic / curve length', 'Volume element', 'Hyperribbon widths', 'Model-manifold boundary structure'])
    assert.equal(inv.get(q)?.invariant, 'yes', q);
  assert.ok(inv.has('Sloppy hierarchy'));
  for (const r of M.invariance) {
    assert.ok(r.cards.length || r.source, r.quantity);
    for (const c of r.cards) assert.ok(cardOk(c), `${r.quantity}: ${c}`);
    for (const f of ['definition', 'coordinateInvariant', 'embedding', 'model', 'noise', 'reduction', 'failure', 'c7']) assert.ok(r[f], `${r.quantity}: ${f}`);
    assert.ok(invmd.includes(`| ${r.quantity} |`), `${r.quantity} rendered`);
  }
  assert.match(inv.get('Raw eigenvalues').c7, /NEGATIVE/);
  assert.match(inv.get('Hyperribbon widths').embedding, /^YES/);
  for (const c of ['MMIa', 'MMIb', 'MMIc', 'MMId', 'MMIe', 'MMIf', 'MMIg', 'MMIh', 'MMIi']) assert.equal(latest[c]?.verdict, 'PASS', c);
});

test('5. null directions: g(v, v) = 0 ⟺ Jv = 0, kept distinct from sloppy, Lorentz, bilinear and collapsed nulls', () => {
  assert.deepEqual(M.nulls.map((n) => n.kind), ['Fisher null (statistical)', 'sloppy direction', 'Lorentz null', 'bilinear null', 'collapsed zero']);
  assert.match(M.nulls[0].law, /g\(v, v\) = 0 ⟺ Jv = 0/);
  for (const n of M.nulls) assert.ok(n.cards.length && n.cards.every(cardOk), n.kind);
  assert.equal(reg.get('T-ZERO-LENGTH').words, 'a zero geometric length can expose hidden non-identifiability / redundancy.');
});

test('6. one C7 target object; T-C7 stays OPEN with its words; raw eigenvalues rejected', () => {
  assert.equal(M.c7.recommendation, 'hyperribbon widths');
  assert.equal(M.c7.notReady, false);
  assert.equal((story.match(/One recommendation:/g) || []).length, 1);
  assert.ok(M.c7.gates.length >= 3 && M.c7.rejected.some((x) => x.object === 'raw FIM eigenvalues'));
  const c7 = reg.get('T-C7');
  assert.equal(c7.status, 'open');
  assert.equal(c7.words, 'possible structural relation/analogy between coefficient spectra / Bessel-type decomposition and Fisher/sloppy spectra');
  assert.ok(c7.boundaries.some((b) => /C7 target gate/.test(b) && /NEGATIVE/.test(b)));
  assert.equal(obj.get('M4').status, 'OPEN');
  assert.equal(obj.get('MM11').status, 'ESTABLISHED');
  assert.ok(srcIds.has('SRC-QUINN-2019'));
});

test('7. conscious observer requirement = NOT ESTABLISHED; no affirmative consciousness or collapse claims', () => {
  assert.equal(M.viewer.conscious, 'conscious observer requirement = NOT ESTABLISHED');
  const v = reg.get('T-VIEWER-FORM');
  assert.equal(v.words, 'matter does not form until a viewer looks at it.');
  assert.equal(v.kind, 'philosophical-exploration');
  assert.equal(v.status, 'open');
  assert.equal(v.normalizedStatement, 'What changes when a richer state/representation becomes an observable manifestation?');
  for (const b of ['ORIGINAL USER INTUITION; PHILOSOPHICAL / QUANTUM-INTERPRETIVE; NOT ESTABLISHED PHYSICS.', 'conscious observer requirement = NOT ESTABLISHED'])
    assert.ok(v.boundaries.some((x) => x.includes(b)), b);
  for (const [f, t] of [['story', story], ['invariance', invmd], ['master map', map], ['bridges', read('research/foundation_bridges.md')], ['dependencies', read('research/foundation_dependencies.md')]]) {
    assert.ok(!/conscious (viewer|observer) (causes|creates|is required|collapses)|consciousness collapse/i.test(t), f);
    assert.ok(!/prediction space\s*=\s*Hilbert space|model manifold\s*=\s*quantum wavefunction|observation\s*=\s*consciousness/i.test(t), f);
  }
  assert.ok(story.includes(M.viewer.normalized) && story.includes(v.words), 'both wordings kept');
});

test('8. quantum-like connections are preserved but not established', () => {
  for (const id of ['T-MM-OBSERVE', 'T-PHYSICAL-MANIFEST-Q', 'T-GEOM-INFO-Q', 'T-SIMPLER-BOUNDARY-Q']) assert.equal(reg.get(id).status, 'open', id);
  assert.equal(br.get('BR61').strength, 'OPEN CONNECTION');
  assert.equal(br.get('BR62').strength, 'STRUCTURAL ANALOGUE');
  assert.match(br.get('BR62').doesNotProve, /no(ne given)?|not/);
  assert.equal(M.story.find((r) => r.key === 'quantum-like').status, 'PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS');
  assert.equal(M.story.find((r) => r.key === 'observation-manifestation').status, 'OPEN CONNECTION');
  assert.deepEqual(M.manifestation.map((m) => m.term), ['mathematical manifestation', 'observable manifestation', 'physical manifestation']);
  assert.equal(M.manifestation[2].status, 'PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS');
  for (const o of ['MM6', 'MM7', 'MM8']) assert.equal(obj.get(o).status, 'OPEN', o);
  assert.deepEqual(M.separations, ['parameter space ≠ prediction space', 'prediction space ≠ physical spacetime', 'model manifold ≠ quantum state space']);
});

test('9. the c verdict is one of the four allowed, and restricted to the limit role', () => {
  assert.deepEqual(M.cVerdicts, ['STRUCTURAL CONNECTION', 'USEFUL ANALOGY', 'TOO WEAK', 'FAIL']);
  assert.ok(M.cVerdicts.includes(M.cVerdict.verdict));
  for (const p of M.cVerdict.parts) assert.ok(M.cVerdicts.includes(p.verdict) && p.cards.every(cardOk), p.role);
  assert.equal(M.cVerdict.verdict, 'STRUCTURAL CONNECTION');
  assert.match(M.cVerdict.scope, /limit/);
  assert.ok(M.cVerdict.parts.some((p) => p.verdict === 'FAIL' && /invariant/.test(p.role)));
  assert.equal(br.get('BR60').strength, 'STRUCTURAL ANALOGUE');
  assert.ok(reg.get('T-RULES-GEOMETRY').boundaries.some((b) => b.startsWith('Verdict (2026-11-13')));
});

test('10. no invented R3; locks unchanged (R1 / R2 / R3, Reduction architecture, CF11-F2, DYADIC PACKETS)', () => {
  assert.match(M.transformation.R3, /^none claimed/);
  for (const o of F.objects.filter((x) => x.id.startsWith('MM'))) assert.ok(!o.transformationLevel.includes('R3'), o.id);
  for (const o of F.objects) for (const l of o.transformationLevel) assert.ok(['R1', 'R2', 'R3'].includes(l), `${o.id}: ${l}`);
  assert.equal(F.cf11b.outcome, 'CF11-F2');
  assert.ok(obj.get('TA0') && obj.get('RI0') && obj.get('RI2'));
  assert.equal(reg.get('T-DYADIC').status, 'open');
  assert.ok(reg.get('T-DYADIC').boundaries.some((b) => b.includes('ORIGINAL USER RESEARCH TERM, OPEN DEFINITION')));
  const red = F.reductionMaps.find((r) => r.name.startsWith('Model reduction / manifold boundary'));
  assert.match(red.name, /a limit, not a map/);
  assert.equal(br.get('BR54').strength, 'OPEN CONNECTION');
});

test('11. information distinctions are kept apart', () => {
  assert.deepEqual(M.information.map((i) => i.term), ['Shannon information', 'Fisher information', 'parameter identifiability', 'prediction sensitivity',
    'observable distinguishability', 'reconstruction information', 'phase information', 'quantum information']);
  for (const i of M.information) {
    assert.ok(i.object && i.geometry && i.notSame, i.term);
    for (const c of i.cards) assert.ok(cardOk(c), `${i.term}: ${c}`);
  }
  assert.ok(decisions.includes('Shannon information; Fisher information; parameter identifiability; prediction sensitivity; observable distinguishability; reconstruction information; phase information; quantum information'));
});

test('12. ratings are separate dimensions with all five fields; no overall score', () => {
  assert.deepEqual(M.ratings.map((r) => r.dimension), ['Model-manifold established mathematics', 'Parameter / rule → allowable-manifold connection',
    'Prediction-space / larger-space connection', 'c / model-rule analogy', 'Observation / reduction connection', 'Quantum-like manifestation hypothesis', 'C7 readiness']);
  const TD = ['TRIVIAL CONSEQUENCE', 'STRUCTURAL TRANSFER', 'NONTRIVIAL PREDICTIVE TRANSFER', 'FAIL', 'NOT YET FORMALIZED'];
  for (const r of M.ratings) {
    for (const k of ['bs', 'slop']) assert.ok(Number.isInteger(r[k]) && r[k] >= 0 && r[k] <= 100, `${r.dimension}: ${k}`);
    assert.ok(TD.includes(r.td) && r.td !== 'NONTRIVIAL PREDICTIVE TRANSFER', r.dimension);
    assert.ok(Number.isInteger(r.breadth) && r.breadth >= 0 && r.breadth <= 5, r.dimension);
    assert.ok(STATUSES.includes(r.status), r.dimension);
  }
  assert.ok(!/overall (score|rating)\s*[:|]\s*\d/i.test(story));
});

test('13. user-origin wording of this audit is verbatim in the decision record and kept in the registry', () => {
  for (const id of ['T-MM-STORY', 'T-MM-RULES', 'T-MM-RULES-Q', 'T-MM-DISTINGUISHED-Q', 'T-RULES-GEOMETRY', 'T-ZERO-LENGTH', 'T-MM-OBSERVE', 'T-VIEWER-FORM',
    'T-PHYSICAL-MANIFEST-Q', 'T-GEOM-INFO-Q', 'T-SIMPLER-BOUNDARY-Q']) {
    const r = reg.get(id);
    assert.equal(r.origin, 'user', id);
    assert.ok(decisions.includes(r.words), id);
  }
  assert.equal(reg.get('T-MM-RULES').normalizedStatement.split('. ')[0] + '.', 'the model structure and parameterization constrain the set of allowable predictions.');
  for (const id of ['T-PREDICTION-INFINITE', 'T-INFOGEO', 'T-C-ROLES', 'T-QUANTUM-ZERO', 'T-SUBCONSCIOUS', 'T-4D-EVENTS']) assert.ok(reg.has(id), `${id} kept`);
});
