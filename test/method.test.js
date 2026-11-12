// The research method (docs/research_method.md): outside-in geometry construction first, theorem-seeking second.
// These tests guard methodology and provenance, so the rules cannot quietly disappear. They never claim that a
// theory has been proved: a theory's status still changes only on a verifier verdict.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const decisions = read('docs/restructure_decisions.md');
const method = read('docs/research_method.md');
const reg = JSON.parse(read('research/theories.json'));
const byId = new Map(reg.theories.map((r) => [r.id, r]));
const MARK = 'These are known examples, not an exhaustive classification for this project.';
const SLOGANS = ['Construct first. Classify second.', 'Preserve the zero. Investigate its geometry.', 'Known structures are examples, not the boundary of the search space.', 'Look from the outside in.'];

// Nadia's wording for each document, taken from the verbatim decision record so the two cannot drift apart.
const quoted = (start) => {
  const line = decisions.split('\n').find((l) => l.startsWith(`> ${start}`));
  assert.ok(line, `decision record has no line starting "${start}"`);
  return line.slice(2);
};

test('restructure_decisions.md records both backbone decisions: theorem-seeking, then outside-in as primary', () => {
  for (const s of [
    'Treat each theory as the target theorem when searching. Do not make “is the theory true?” the first research question.',
    'Search as though the theorem is true. Report only what the evidence actually proves.',
    'The previous theorem-seeking method is useful, but it is secondary.',
    'OUTSIDE-IN GEOMETRY CONSTRUCTION',
    'Do not allow the secondary mode to redefine the primary geometry.',
    'Perturbing a natural zero state can destroy information encoded in the relationships that produced that zero',
    'DO NOT CLOSE THE SEARCH SPACE WITH KNOWN MATHEMATICS',
    ...SLOGANS,
  ]) assert.ok(decisions.includes(s), s);
  assert.ok(decisions.indexOf('## Research method: theorem-seeking') < decisions.indexOf('## Outside-in geometry construction'), 'history kept in order');
});

test('CLAUDE.md loads the method first, states the outside-in direction, and carries both permanent rules', () => {
  const md = read('CLAUDE.md');
  const order = ['docs/research_method.md', 'docs/claude_code_prompt.md', 'docs/objective.md', 'docs/restructure_decisions.md', 'research/'].map((f) => md.indexOf(f));
  assert.ok(order.every((i) => i >= 0), 'every read-order entry is present');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'read order: method, prompt, objective, decisions, registry');
  for (const s of SLOGANS) assert.ok(md.includes(s), s);
  assert.ok(md.indexOf('Research direction (primary)') < md.indexOf('Research stance (within construction)'), 'construction before theorem-seeking');
  assert.ok(md.includes(quoted('Research stance: Every user-origin theory').replace('Research stance: ', '')), 'compact theorem-seeking rule kept');
  assert.match(md, /Perturb a defining zero/, 'Zero Preservation Rule');
  assert.ok(md.includes(MARK), 'anti-closure rule');
});

test('objective.md: research posture with the outside-in direction, the foundation → guide → translator order, earlier wording kept', () => {
  const md = read('docs/objective.md');
  assert.match(md, /^## Research posture$/m);
  assert.ok(md.indexOf('## Research posture') < md.indexOf('## Scope now'), 'posture sits near the objective');
  for (const s of [quoted('Geometry of Representation is not a survey'), quoted('Their reported epistemic status remains HYPOTHESIS'),
    'outside-in geometry construction', 'Foundational geometry', 'Mathematical guide', 'Translator / application',
    quoted('Construct a geometry capable of showing how apparently complete objects/states'), 'hypotheses, neither assumed true nor assumed false.']) assert.ok(md.includes(s), s);
});

test('claude_code_prompt.md distinguishes research stance from reported status, keeping the earlier wording', () => {
  const md = read('docs/claude_code_prompt.md');
  assert.ok(md.includes(quoted('The hypothesis is the target theorem for research.')), 'operational rule');
  assert.match(md, /Research stance is not reported status\./);
  assert.ok(md.includes('must not be treated as true or false'), 'earlier wording kept for provenance');
  assert.ok(md.includes("we can't assume this is false or true. take this as a hypothesis"), "Nadia's §1 statement untouched");
});

test('research_method.md: construction is primary, the theorem scan secondary; both rules and all examples present', () => {
  for (const s of SLOGANS) assert.ok(method.includes(s), s);
  for (const h of ['## 1. Direction: outside-in', '## 2. Working stance', '## 3. Primary mode: geometry construction', '## 4. The zero program',
    '### 4.1 Zero Preservation Rule', '### 4.2 "From the zero itself"', '### 4.3 The larger generating geometry', '## 5. Anti-closure rule',
    '## 6. Secondary mode: existing-theorem scan', '## 7. Proof obligations', '## 8. Outcome contract', '## 9. Research mode, direction and reported status',
    '## 10. Order: foundation, guide, translator', '## 11. Examples']) assert.ok(method.includes(h), h);
  assert.ok(method.indexOf('Primary mode') < method.indexOf('Secondary mode'), 'construct first, match second');
  assert.ok(method.split(MARK).length - 1 >= 2, 'the anti-closure marker is used where possibilities are listed');
  for (const k of ['**Fourier**', '**★**', '**Zero**', '**Pair A**', '**Higher dimensions**', '**H1**', '**H2**', '**H3', '**Pair B**', '**Mass/wave**', '**"0 is orthogonal"**'])
    assert.ok(method.includes(k), `example ${k}`);
  for (const o of reg.researchOutcomes) assert.ok(method.includes(`\`${o}\``), `outcome ${o} documented`);
});

test('the preamble carries the outside-in block first, then the theorem-seeking block verbatim', () => {
  const pre = read('docs/research_prompt_preamble.md');
  const a = pre.indexOf('OUTSIDE-IN MODE');
  const b = pre.indexOf(`THEOREM-SEEKING MODE\n${quoted('Treat the supplied user theory as the target theorem')}`);
  assert.ok(a >= 0 && b > a, 'outside-in first, theorem-seeking second');
  for (const s of [...SLOGANS, quoted('Do not perturb a defining zero merely'), MARK]) assert.ok(pre.slice(a, b).includes(s), s);
});

test('status hypothesis/open coexists with theorem-target and outside-in (not a contradiction)', () => {
  for (const r of reg.theories) {
    assert.ok(reg.researchModes.includes(r.researchMode), r.id);
    assert.ok(reg.researchDirections.includes(r.researchDirection), r.id);
  }
  const user = reg.theories.filter((r) => r.origin === 'user');
  for (const r of user) assert.equal(r.researchMode, 'theorem-target', r.id);
  for (const st of ['hypothesis', 'open']) assert.ok(user.some((r) => r.status === st && r.researchDirection === 'outside-in'), st);
});

test('the seven backbone records exist, keep Nadia\'s words, and are linked', () => {
  for (const id of ['B-ZERO-PRESERVE', 'B-HIGHER-GEOMETRY', 'B-OUTSIDE-IN', 'B-NONEXHAUSTIVE', 'B-FINITE-INFINITE', 'B-PART-WHOLE', 'B-ORTHO-FORM']) {
    const r = byId.get(id);
    assert.ok(r, id);
    assert.equal(r.origin, 'user');
    assert.ok(decisions.includes(r.words), `${id}: words verbatim in the decision record`);
  }
  assert.ok(byId.get('B-ZERO-PRESERVE').construction.doNotReason.some((d) => /perturb system/.test(d)), 'the perturb-to-observe pattern is named as not the program');
  assert.ok(byId.get('B-HIGHER-GEOMETRY').construction.questions.length === 6, 'the six construction questions');
});

test('anti-closure in the registry: known-example lists are not exhaustive unless a theorem says so; candidate new classes allowed', () => {
  for (const r of reg.theories) {
    const c = r.construction;
    if (!c) continue;
    assert.deepEqual(Object.keys(c).sort(), ['candidateNewClasses', 'doNotReason', 'knownExamples', 'questions', 'sequence', 'source'], r.id);
    assert.ok(!c.knownExamples.exhaustive || c.knownExamples.basis, `${r.id}: an exhaustive list needs its theorem`);
    assert.ok(Array.isArray(c.candidateNewClasses), r.id);
    for (const q of [...c.sequence, ...c.questions]) assert.ok(read(c.source).includes(q), `${r.id}: "${q.slice(0, 50)}…" not verbatim in ${c.source}`);
  }
  assert.ok(reg.researchOutcomes.includes('candidate-new-class'));
});

test('proof targets: valid fields, Nadia\'s target wording, earlier targets kept, no outcome claimed before a pass reports one', () => {
  const KEYS = ['targetStatement', 'targetSource', 'requiredObjects', 'requiredMaps', 'candidateInvariants', 'requiredEquivalences', 'proofObligations',
    'exactSearchQueries', 'knownTheorems', 'unresolvedObligations', 'previousTargets', 'lastResearchOutcome'];
  for (const r of reg.theories) {
    const pt = r.proofTarget;
    if (!pt) continue;
    assert.deepEqual(Object.keys(pt).sort(), [...KEYS].sort(), r.id);
    for (const t of [pt, ...pt.previousTargets]) assert.ok(read(t.targetSource).includes(t.targetStatement), `${r.id}: target not verbatim in ${t.targetSource}`);
    assert.ok(pt.lastResearchOutcome === null || reg.researchOutcomes.includes(pt.lastResearchOutcome), `${r.id}: outcome`);
    if (pt.lastResearchOutcome === 'proved') assert.equal(r.status, 'established', `${r.id}: "proved" needs the status to follow a verifier verdict`);
  }
  assert.equal(byId.get('T-STAR').proofTarget.previousTargets.length, 1, '★: the closed-menu target is kept as history');
});

test('author_philosophy.md holds the six origin ideas verbatim, each pointing to a registry record', () => {
  const md = read('docs/author_philosophy.md');
  for (const id of ['T-EXISTENCE-ZERO', 'B-PART-WHOLE', 'T-SPACE-EXPLORATION', 'T-LOOK-INSIDE', 'B-FINITE-INFINITE', 'T-IRREVERSIBLE-FORMATION', 'T-ZERO-ORTHOGONAL']) {
    assert.ok(md.includes(`\`${id}\``), `${id} named`);
    assert.ok(byId.has(id), `${id} exists`);
  }
  for (const r of reg.theories.filter((t) => t.sourceDocs.includes('docs/author_philosophy.md'))) assert.equal(r.origin, 'user', r.id);
  assert.ok(md.includes(MARK), 'candidate meanings of "irreversible" are marked non-exhaustive');
});

test('negative evidence never removes a user-origin theory', () => {
  const ever = read('research/theories.ids').split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  for (const id of ever) assert.ok(byId.has(id), `${id} was removed`);
  for (const r of reg.theories.filter((t) => t.origin === 'user' && (t.evidenceAgainst.length || t.supersededBy))) {
    assert.ok(r.words, `${r.id}: original wording kept`);
    assert.equal(r.researchMode, 'theorem-target', `${r.id}: still a target (refined, not abandoned)`);
  }
});

// ── first outside-in construction and the new Act map (2026-11-12) ──────────────────────────────

test('method rules are separate from hypotheses: rules carry governance status, claims live in their own records', () => {
  for (const id of ['B-OUTSIDE-IN', 'B-NONEXHAUSTIVE', 'B-ZERO-PRESERVE']) {
    assert.equal(byId.get(id).kind, 'method-rule', id);
    assert.equal(byId.get(id).status, 'governance', id);
  }
  const loss = byId.get('B-ZERO-LOSS');
  assert.equal(loss.kind, 'hypothesis');
  assert.equal(loss.status, 'hypothesis', 'the hypothesis stays a theory target');
  assert.ok(!byId.get('B-ZERO-PRESERVE').variants.some((v) => v.words === loss.variants[0].words), 'the claim moved out of the rule record');
  assert.ok(byId.get('B-ZERO-PRESERVE').history.length > 0, 'the split is recorded, not silent');
});

test('zero-preserving interrogation, never "non-perturbing measurement"', () => {
  assert.ok(method.includes('zero-preserving interrogation'));
  for (const f of ['docs/research_method.md', 'CLAUDE.md', 'docs/act_map.md', 'src/interactives/zero/copy.js', 'src/interactives/zero/index.js'])
    assert.ok(!/non-perturbing measurement(?!" is not used)/.test(read(f).replace('"non-perturbing measurement" is not used', '').replace('never call it a "non-perturbing measurement"', '')), f);
  for (const r of reg.theories) for (const e of [...r.evidenceFor, ...r.evidenceAgainst]) assert.ok(!/leaves each S_z = 0 state unchanged/.test(e.note), `${r.id}: old wording`);
});

test('the construction rule is in the method: construct the relational object before naming the structure', () => {
  assert.ok(method.includes('Do not search for the named structure before constructing the relational object.'));
  assert.ok(method.indexOf('derive the projected vectors') < method.indexOf('only then compare to regular-simplex theory'));
});

test('the R4 construction record has exactly its eleven sections, and says what it does not establish', () => {
  const md = read('research/constructions/r4_tetrahedral_zero.md');
  const heads = md.split('\n').filter((l) => l.startsWith('## ')).map((l) => l.slice(3));
  assert.deepEqual(heads, ['1. Construction target', '2. Source geometry', '3. Projection map', '4. Exact identities', '5. Lower-dimensional realization',
    '6. What is established', '7. What is derived', '8. What is NOT established', '9. Connection to Stage 2', '10. Questions generated', '11. Next construction tests']);
  const not = md.slice(md.indexOf('## 8.'), md.indexOf('## 9.'));
  assert.match(not, /physical proton cancellation comes from a hidden fourth spatial dimension/);
  assert.match(md, /ORTHOGONALLY EQUIVALENT/);
  assert.match(md, /first chosen for cancellation clarity/, 'chronology kept');
  const affirming = md.slice(md.indexOf('## 1.'), md.indexOf('## 8.')) + md.slice(md.indexOf('## 9.'));   // outside the header's naming note and §8
  for (const bad of ['origin geometry', 'true higher geometry', 'quantum geometry'])
    assert.ok(!affirming.includes(bad), `"${bad}" is used only where the record says it is not`);
});

test('the R4 records: established pieces rest on PASS cards; the chain stays a construction-backed direction', () => {
  for (const id of ['T-R4-TETRA', 'T-R4-GENERAL', 'T-R4-STAGE2']) assert.equal(byId.get(id).status, 'established', id);
  assert.equal(byId.get('T-R4-DERIVED').status, 'derived');
  const chain = byId.get('B-HIGHER-GEOMETRY-CHAIN');
  assert.equal(chain.kind, 'construction-backed-direction');
  assert.equal(chain.status, 'hypothesis', 'not promoted to a universal theorem');
  assert.ok(chain.related.includes('B-HIGHER-GEOMETRY'));
  for (const q of ['Q-R4-7', 'Q-R4-8']) assert.equal(byId.get(q).status, 'open', q);
  for (const q of ['Q-R4-1', 'Q-R4-2', 'Q-R4-3', 'Q-R4-4', 'Q-R4-5', 'Q-R4-6']) {
    assert.equal(byId.get(q).status, 'established', `${q}: resolved only with PASS cards`);
    assert.equal(byId.get(q).proofTarget.lastResearchOutcome, 'proved', q);
  }
});

test('learner copy says nothing about a physical fourth dimension behind Chapter I', () => {
  for (const f of ['src/interactives/zero/copy.js', 'src/interactives/zero/index.js'])
    assert.ok(!/fourth (spatial )?dimension|four-dimensional|\b4D\b|R\^4|ℝ⁴|\\mathbb R\^4/.test(read(f)), f);
});

test('the Act map: Foundation Acts I–IV in order, the superseded map kept, the app pointing at the new Act II', () => {
  const md = read('docs/act_map.md');
  const titles = ['Changing the Meaning of 0', 'From Zero to Form', 'Larger Geometry, Visible Shadow', 'Rule, Continuation, and Repetition'];
  const at = titles.map((t) => md.indexOf(`| ${['I', 'II', 'III', 'IV'][titles.indexOf(t)]} | ${t} |`));
  assert.ok(at.every((i) => i >= 0) && [...at].sort((a, b) => a - b).join() === at.join(), 'Foundation Acts I–IV in order');
  assert.ok(md.indexOf('## Foundation') < md.indexOf('## Guide through known mathematics') && md.indexOf('## Guide through known mathematics') < md.indexOf('## Final Act'));
  for (const old of ['I · Changing the Meaning of 0', 'II · One Relation, Different Forms', 'III · Projection Reveals Structure', 'IV · Zero Becomes Geometry',
    'V · Preserved Relations', 'VI · Information Lost and Recovered', 'VII · Geometry of Models', 'VIII · Finite / Infinite Representation', 'IX · Energeo'])
    assert.ok(md.includes(old), `superseded map keeps ${old}`);
  assert.match(md, /4 · A Shape From One Rule/);
  assert.match(read('src/interactives/zero/index.js'), /next: \{ n: 'Chapter II', title: 'From Zero to Form'/);
});

test('the compass-circle contract keeps the explanatory terms hidden until formalize', () => {
  const md = read('docs/act_map.md');
  const contract = md.slice(md.indexOf('## Stage 4 contract'));
  const hidden = contract.slice(contract.indexOf('**Hidden until formalize:**'), contract.indexOf('**Never written:**'));
  for (const w of ['*circle*', '*orthogonal*', '*sin*', '*cos*', '*π*', '*periodic*']) assert.ok(hidden.includes(w), w);
  assert.match(contract, /orthogonality caused the circle/);
  assert.ok(contract.includes('Which fixed relationships made the shape possible?') && contract.includes('Which global rules are consequences of those fixed relationships?'));
  const rows = contract.slice(contract.indexOf('| Observe |'), contract.indexOf('| Formalize |'));
  for (const w of ['circle', 'orthogonal', 'perpendicular', 'sin', 'cos', 'π', 'periodic']) assert.ok(!new RegExp(`\\b${w}\\b`).test(rows.replace('(the angle turned so far)', '')), `"${w}" before formalize`);
});

// ── evaluation framework, connector wording, application pass (2026-11-12) ──────────────────────

const RULES = ['Zero is a connector/interface, not automatically a lower-dimensional object.', 'A construction must survive independent application before it can count as backbone proof.',
  'Low support means continue carefully, not discard.', 'Archive only after repeated independent mathematical/empirical failure.', 'Do not invent a geometry that only works because we designed it around the answer.'];

test('the permanent rules and the evaluation framework are visible in the backbone', () => {
  const claude = read('CLAUDE.md');
  for (const r of RULES) { assert.ok(method.includes(r), `method: ${r}`); assert.ok(claude.includes(r), `CLAUDE.md: ${r}`); assert.ok(decisions.includes(r), `decisions: ${r}`); }
  for (const h of ['## 12. Evaluation and anti-delusion', '### 12.1 Two ratings', '### 12.2 The audit', '### 12.3 Application validity', '### 12.4 Anti-slop guard', '### 12.5 Low support is not discard', '### 4.4 Three operations, kept apart'])
    assert.ok(method.includes(h), h);
  assert.ok(method.includes('Would this mathematical statement still be meaningful if we removed all references to Nadia\'s project?'));
  assert.match(read('docs/research_prompt_preamble.md'), /```\nEVALUATION\n/);
  assert.match(claude, /Backbone Support %/);
});

test('zero is never called the lower-dimensional object', () => {
  for (const f of ['CLAUDE.md', 'docs/research_method.md', 'docs/act_map.md', 'research/constructions/r4_tetrahedral_zero.md', 'research/constructions/zero_connector_linear.md', 'research/application_matrix.md'])
    assert.ok(!/zero is (a |the )?lower-dimensional|zero = lower-dimensional/i.test(read(f)), f);
});

test('ratings: every assessment is complete and consistent with the evaluation rules', () => {
  const STATUSES = ['TEXTBOOK / KNOWN', 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'NEW PROJECT CONSTRUCTION', 'EMPIRICAL', 'SPECULATIVE MAPPING'];
  const BREADTH = ['one configuration', 'one mathematical family', 'multiple independent mathematical families', 'multiple physical systems', 'real dataset(s)'];
  const V = ['pass', 'partial', 'fail', 'not-yet', 'n/a'];
  const rated = reg.theories.filter((r) => r.assessment);
  assert.ok(rated.length >= 10, 'the substantive results of the application pass are rated');
  for (const r of rated) {
    const a = r.assessment;
    assert.ok(STATUSES.includes(a.mathematicalStatus) && BREADTH.includes(a.breadth), r.id);
    for (const k of ['backboneSupport', 'slopRisk']) assert.ok(Number.isInteger(a[k]) && a[k] >= 0 && a[k] <= 100, `${r.id}: ${k}`);
    assert.ok(a.why.split(/(?<=[.!?])\s+/).filter(Boolean).length <= 5, `${r.id}: "why" is at most 5 sentences`);
    assert.ok(a.increase && a.falsify, `${r.id}: increase and falsify stated`);
    for (const t of ['construction', 'generalization', 'transfer', 'failureCondition', 'outOfSample']) assert.ok(V.includes(a.validity[t]), `${r.id}: ${t}`);
    assert.ok(['EXAMPLE', 'GENERAL CONSTRUCTION', 'BACKBONE PROOF'].includes(a.classification), r.id);
    if (a.breadth === 'one configuration') assert.equal(a.classification, 'EXAMPLE', `${r.id}: one context is an EXAMPLE`);
    if (a.classification === 'BACKBONE PROOF') assert.ok(a.validity.generalization === 'pass' && a.validity.transfer === 'pass', `${r.id}: backbone proof needs generalization and transfer`);
    if (a.backboneSupport === 100) assert.ok(a.classification === 'BACKBONE PROOF' && ['pass', 'n/a'].includes(a.validity.outOfSample), `${r.id}: 100% needs independent application`);
    assert.ok(['active', 'low-confidence-active', 'inactive-archived'].includes(a.branchState), r.id);
    assert.ok(['TRIVIAL CONSEQUENCE', 'STRUCTURAL TRANSFER', 'NONTRIVIAL PREDICTIVE TRANSFER', 'FAIL', 'NOT YET FORMALIZED'].includes(a.transferDepth), `${r.id}: transfer depth`);
    assert.ok(['established', 'established under assumptions', 'not established'].includes(a.mathematicalCorrectness), `${r.id}: correctness rated separately`);
    if (a.transferDepth === 'NONTRIVIAL PREDICTIVE TRANSFER')
      assert.ok(a.prediction && a.prediction.statement && a.prediction.recordedOn && a.prediction.verifiedBy, `${r.id}: a predictive transfer needs the prediction recorded before its verifying card`);
    if (a.branchState === 'inactive-archived') {
      const kinds = new Set(a.failures.map((f) => f.kind));
      assert.ok(kinds.has('formulation') && kinds.has('application') && a.noGeneralizationSurvives && a.noEstablishedSupport && a.failures.length >= 4, `${r.id}: archive only when all four conditions hold`);
    }
    for (const h of a.ratingHistory) assert.ok(h.reason, `${r.id}: a rating change states its reason`);
    assert.ok(Number.isInteger(a.applicationBreadth) && a.applicationBreadth >= 0 && a.applicationBreadth <= 5, `${r.id}: application breadth 0–5`);
  }
});

test('the three zero operations are separate records; the measurement branch makes no observer claim', () => {
  const ids = ['B-ZERO-PRESERVE', 'B-ZERO-LOSS', 'B-ZERO-INTERNAL-CHANGE'];
  assert.equal(new Set(ids.map((i) => byId.get(i).words)).size, 3);
  assert.equal(byId.get('B-ZERO-PRESERVE').status, 'governance');
  assert.equal(byId.get('B-ZERO-INTERNAL-CHANGE').status, 'open');
  const ja = byId.get('B-JOINT-ALTERNATIVES');
  assert.ok(ja.boundaries.some((b) => /conscious/.test(b) && /No claim/.test(b)));
  for (const f of ['docs/research_method.md', 'research/application_matrix.md', 'research/constructions/zero_connector_linear.md'])
    assert.ok(!/conscious (viewer|observer) causes/i.test(read(f)), f);
});

test('Stage 2 stays ORTHOGONALLY EQUIVALENT; Q-R4-2 is proved under its stated equivalence; Q-R4-8 is split', () => {
  assert.match(read('research/constructions/r4_tetrahedral_zero.md'), /Result: ORTHOGONALLY EQUIVALENT/);
  assert.ok(byId.get('T-R4-STAGE2').variants.some((v) => /orthogonally equivalent to the projected/.test(v.words)));
  assert.equal(byId.get('Q-R4-2').status, 'established');
  assert.match(byId.get('Q-R4-2').normalizedStatement, /PROVED UNDER EQUIVALENCE/);
  assert.equal(byId.get('Q-R4-8').supersededBy, 'Q-R4-8-INVERSE');
  assert.equal(byId.get('Q-R4-8-INVERSE').status, 'open');
  assert.equal(byId.get('T-ZERO-CONNECTOR-LINEAR').status, 'established');
  assert.equal(byId.get('T-ZERO-CONNECTOR').status, 'hypothesis', 'the general connector is not established by the linear case');
  assert.ok(byId.get('B-PART-WHOLE').relatedActs.includes('III'));
});

test('construction records share the eleven-section format; the application matrix has its columns and records failures', () => {
  const SECTIONS = ['1. Construction target', '2. Source geometry', '3. Projection map', '4. Exact identities', '5. Lower-dimensional realization',
    '6. What is established', '7. What is derived', '8. What is NOT established', '9. Connection to Stage 2', '10. Questions generated', '11. Next construction tests'];
  for (const f of ['research/constructions/r4_tetrahedral_zero.md', 'research/constructions/zero_connector_linear.md', 'research/constructions/weighted_mass_centering.md', 'research/constructions/quantum_additive_cancellation.md', 'research/constructions/four_spin_zero.md', 'research/constructions/mass_second_moment.md'])
    assert.deepEqual(read(f).split('\n').filter((l) => l.startsWith('## ')).map((l) => l.slice(3)), SECTIONS, f);
  const m = read('research/application_matrix.md');
  assert.ok(m.includes('| System / dataset | Observed zero / relation | Source representation | Target representation | Candidate larger geometry | Map | What becomes zero | What survives | What is lost | Independent of construction example? | Mathematical status | Backbone Support % | AI Slop Risk % | Failure condition |'));
  for (const row of ['Opposed vector pair', 'n-simplex family', 'Mass center / first moment', 'Quantum S_z = 0 pair', 'Fourier zero coefficient', 'Orthogonality zero']) assert.ok(m.includes(row), row);
  const results = m.slice(m.indexOf('## Results per row'));
  assert.match(results, /fails/, 'failures are recorded, not hidden');
  for (const cell of results.split('\n').filter((l) => /^\| \d\./.test(l)).flatMap((l) => l.replace(/\\\|/g, '¦').split('|').slice(2, 4)))
    assert.match(cell.trim(), /^(same rule works|partially works|fails|not yet formalized)/, `result label: ${cell.trim()}`);
});

// ── transfer pass (2026-11-12) ──────────────────────────────────────────────────────────────────

test('transfer depth is defined in the method and used in the application matrix version 2, with version 1 kept', () => {
  for (const d of ['TRIVIAL CONSEQUENCE', 'STRUCTURAL TRANSFER', 'NONTRIVIAL PREDICTIVE TRANSFER', 'FAIL', 'NOT YET FORMALIZED']) assert.ok(method.includes(`| ${d} |`), d);
  assert.ok(method.includes('Construct first. Apply unchanged. Record what survives and what fails.'));
  assert.ok(method.includes('One failure is never enough.'));
  const m = read('research/application_matrix.md');
  assert.ok(m.indexOf('## Version 2') < m.indexOf('## Version 1'), 'version 1 kept as history below version 2');
  assert.ok(m.includes('| Observed zero | Zero kind | Underlying objects | Map / relation | Source structure | Target structure | Known or inferred larger geometry | What becomes zero | What survives | What is lost | Transfer Depth | Same rule unchanged? | Backbone Support % | AI Slop / Delusion Risk % | Exact failure condition |'));
  const v2 = m.slice(m.indexOf('## Version 2'), m.indexOf('## Version 1'));
  const rows = v2.split('\n').filter((l) => /^\| \d\. /.test(l));
  assert.equal(rows.length, 7, 'the seven systems of the pass');
  for (const r of rows) assert.match(r, /TRIVIAL CONSEQUENCE|STRUCTURAL TRANSFER|NONTRIVIAL PREDICTIVE TRANSFER|FAIL|NOT YET FORMALIZED/, r.slice(0, 40));
  assert.ok(!/NONTRIVIAL PREDICTIVE TRANSFER/.test(v2.slice(v2.indexOf('| 1.'))), 'no predictive transfer claimed in this pass');
  assert.ok(!/T′_(mass|quantum|Fourier|orthogonality)/.test(m) && !reg.theories.some((r) => /T′_/.test(r.id + r.label)), 'no per-system rescue variants of T′ (the method names them only to forbid them)');
});

test('Pair A: the equal-mass bridge is added beside, not instead of, the shared algebraic form', () => {
  const graph = JSON.parse(read('research/graph.json'));
  const ledger = JSON.parse(read('verify/ledger/latest.json')).cards;
  const pa = graph.pairs.find((p) => p.id === 'pair.A');
  assert.ok(pa.sharedAlgebraicForm && pa.sharedAlgebraicForm.status === 'established', 'shared algebraic form kept');
  assert.equal(pa.candidateCommonRelation, null);
  assert.equal(pa.status, 'open');
  const [b] = pa.exactSpecialCaseBridges;
  assert.equal(b.transferDepth, 'STRUCTURAL TRANSFER');
  assert.ok(b.description.startsWith('Exact special-case bridge: Equal-mass centering of the standard basis'));
  for (const c of b.cards) assert.equal(ledger[c]?.verdict, 'PASS', c);
  assert.ok(b.doesNotEstablish.some((x) => /universal Pair A solution/.test(x)));
  assert.deepEqual(Object.keys(b.layers), ['sharedZeroAlgebra', 'exactSharedConstruction', 'possibleBroaderGeometry']);
});

test('WMC is its own construction; the comparison follows the six steps and answers with an allowed label', () => {
  const wmc = byId.get('T-WMC');
  assert.ok(wmc.boundaries.some((x) => /Not T′/.test(x)));
  const cmp = read('research/constructions/centering_comparison.md');
  const steps = cmp.split('\n').filter((l) => l.startsWith('## Step ')).map((l) => l.slice(3, 9));
  assert.deepEqual(steps, ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6']);
  assert.match(cmp, /\*\*Answer: (YES — exact construction|YES — special case only|PARTIAL|NO UNDER CURRENT DEFINITIONS|OPEN — missing specific derivation)\*\*/);
  assert.ok(cmp.indexOf('## Step 6') > cmp.indexOf('## Step 5'), 'existing mathematics searched only after the derivation');
  assert.equal(byId.get('Q-CENTERING').status, 'open', 'the geometry question stays open');
});

test('the zero taxonomy is descriptive and explicitly non-exhaustive', () => {
  const t = read('research/zero_taxonomy.md');
  assert.ok(t.includes('These are known/project-observed categories, not an exhaustive classification.'));
  for (const c of ['A. Additive / resultant zero', 'B. Linear-functional zero', 'C. Inner-product / bilinear zero', 'D. Quadratic null', 'E. Observable / eigenvalue zero', 'F. Coefficient / spectral zero', 'G. Balance / moment zero'])
    assert.ok(t.includes(c), c);
  assert.ok(!/theorem:/i.test(t.split('\n')[0]));
});

// ── two-zeros pass (2026-11-12) ─────────────────────────────────────────────────────────────────

test('C_G is locked to the uniform direction; distinguished directions must be specified before the zero', () => {
  assert.ok(method.includes('A distinguished direction may only enter a construction if it is independently specified by the system before observing the desired zero.'));
  assert.ok(method.includes('**Forbidden order:** observe zero → choose d that makes the map work.'));
  assert.equal(byId.get('B-INDEPENDENT-DIRECTION').status, 'governance');
  assert.equal(byId.get('Q-DISTINGUISHED-MODE').status, 'open', 'arbitrary d stays an open question, not an active family');
  assert.ok(byId.get('T-CENTERING-OPERATOR').history.some((h) => /locked/.test(h.change)));
  assert.match(read('CLAUDE.md'), /Choose a distinguished direction after seeing the zero/);
});

test('the quantum cancellation pair is its own object, outside Pair A, with both states derived', () => {
  const graph = JSON.parse(read('research/graph.json'));
  const q = graph.objects.find((o) => o.id === 'obj.qacp');
  assert.ok(q && q.distinctFrom.includes('obj.moments'));
  for (const p of graph.pairs) assert.ok(![p.sourceObject.id, p.targetObject.id].includes('obj.qacp'), `${p.id} must not contain the quantum pair`);
  const ledger = JSON.parse(read('verify/ledger/latest.json')).cards;
  for (const c of ['Q2a', 'Q2b', 'Q2c', 'Q2d', 'Q2e', 'Q2f', 'Q2g', 'W3a', 'W3b']) assert.equal(ledger[c]?.verdict, 'PASS', c);
  assert.equal(byId.get('T-QACP').status, 'established');
  assert.equal(byId.get('Q-QACP-C').status, 'open', 'Level C stays open');
});

test('the blind-label test was pre-registered and is not called a predictive transfer', () => {
  const proto = read('research/constructions/qacp_blind_protocol.md');
  assert.match(proto, /pre-registered/i);
  assert.match(proto, /Pre-registered prediction rule/);
  assert.match(proto, /not blind in knowledge/);
  const ex = byId.get('T-QACP-EXCHANGE');
  assert.notEqual(ex.assessment.transferDepth, 'NONTRIVIAL PREDICTIVE TRANSFER');
  assert.match(ex.normalizedStatement, /separation PASS/);
  assert.match(ex.normalizedStatement, /NOT YET POSSIBLE/);
  for (const r of reg.theories) if (r.assessment) assert.notEqual(r.assessment.transferDepth, 'NONTRIVIAL PREDICTIVE TRANSFER', `${r.id}: none found in any pass so far`);
});

test('application breadth, the four quantum events, and matrix version 3', () => {
  assert.ok(method.includes('**Application Breadth (0–5)**'));
  for (const e of ['**Structural zero:**', '**Internal cancellation:**', '**Measurement intervention:**', '**Dephasing:**']) assert.ok(method.includes(e), e);
  const m = read('research/application_matrix.md');
  assert.ok(m.indexOf('## Version 3') < m.indexOf('## Version 2') && m.indexOf('## Version 2') < m.indexOf('## Version 1'), 'versions kept in order');
  const v3 = m.slice(m.indexOf('## Version 3'), m.indexOf('## Version 2'));
  assert.ok(v3.includes('| System | Observed zero | Contributions | Exchange acting on contributions | ε | Transfer Depth | Same rule unchanged? | Backbone Support % | AI Slop / Delusion Risk % | Application Breadth | Exact failure condition |'));
  assert.match(v3, /\| FAIL/, 'failures recorded');
  assert.match(v3, /NOT YET FORMALIZED/);
});

// ── four spins and a non-quantum transfer (2026-11-12) ──────────────────────────────────────────

test('preregistration came first: the blind descriptor ran before the reveal, at an earlier commit', () => {
  const rows = read('verify/ledger/ledger.jsonl').trim().split('\n').map((l) => JSON.parse(l));
  const first = (id) => rows.findIndex((r) => r.id === id);
  for (const [blind, reveal] of [['FS1d', 'FS2b'], ['MB1b', 'MB2a']]) {
    assert.ok(first(blind) >= 0 && first(reveal) > first(blind), `${blind} before ${reveal}`);
    assert.notEqual(rows[first(blind)].commit, rows[first(reveal)].commit, `${reveal} first ran after a new commit (the preregistration)`);
  }
  const proto = read('research/constructions/fourspin_mass_protocol.md');
  for (const s of ['Procedurally blind', 'Mathematically novel', 'VALIDATION OF KNOWN MATHEMATICS', 'P1.', 'P2.', 'P3.', 'R1 (symmetry)', 'R2 (contribution geometry)'])
    assert.ok(proto.includes(s), s);
  assert.ok(proto.includes('Four subsystems have nothing to do with four spatial dimensions'));
});

test('independent-symmetry rule; corrected obstruction keeps the old wording as superseded', () => {
  assert.equal(byId.get('B-INDEPENDENT-SYMMETRY').status, 'governance');
  assert.ok(method.includes('A symmetry cannot be introduced because it happens to distinguish the zero states after inspection.'));
  assert.equal(byId.get('T-QACP-OBSTRUCTION').supersededBy, 'T-QACP-OBSTRUCTION-RESTRICTED');
  assert.match(byId.get('T-QACP-OBSTRUCTION-RESTRICTED').normalizedStatement, /outside the class/);
  const q = read('research/constructions/quantum_additive_cancellation.md');
  assert.match(q, /It does \*\*not\*\* cover every conceivable descriptor/);
  assert.match(read('CLAUDE.md'), /Introduce a symmetry because it separates zero states after inspection/);
});

test('four-spin result is FOUR-SPIN-B, classified as validation; the mass result inverts the roles; nothing is called a new theorem', () => {
  const f = read('research/constructions/four_spin_zero.md');
  assert.match(f, /\*\*Result: FOUR-SPIN-B\.\*\*/);
  assert.match(f, /VALIDATION OF KNOWN MATHEMATICS/);
  const ledger = JSON.parse(read('verify/ledger/latest.json')).cards;
  for (const c of ['FS1a', 'FS1b', 'FS1c', 'FS1d', 'FS1e', 'FS2a', 'FS2b', 'FS2c', 'FS2d', 'FS2e', 'MB1a', 'MB1b', 'MB2a', 'MB2b', 'MB2c', 'Q2h']) assert.equal(ledger[c]?.verdict, 'PASS', c);
  for (const id of ['T-FOURSPIN-SYMMETRY', 'T-FOURSPIN-SIMPLEX', 'T-MASS-SECOND-MOMENT', 'T-ZERO-SYMMETRY-ARCHITECTURE', 'T-QACP-EXCHANGE'])
    assert.equal(byId.get(id).assessment.novelty, 'VALIDATION OF KNOWN MATHEMATICS', id);
  const m = read('research/application_matrix.md');
  assert.ok(m.indexOf('## Version 4') < m.indexOf('## Version 3'));
  assert.match(m.slice(m.indexOf('## Version 4'), m.indexOf('## Version 3')), /No nontrivial predictive transfer/);
});
