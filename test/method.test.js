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
