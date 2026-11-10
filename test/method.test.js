// The theorem-seeking research method (docs/research_method.md). These guard methodology and provenance, so the
// rule cannot quietly disappear. They never claim that a theory has been proved: a theory's status still
// changes only on a verifier verdict.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const decisions = read('docs/restructure_decisions.md');
const reg = JSON.parse(read('research/theories.json'));

// Nadia's wording for each document, taken from the verbatim decision record so the two cannot drift apart.
const quoted = (start) => {
  const line = decisions.split('\n').find((l) => l.startsWith(`> ${start}`));
  assert.ok(line, `decision record has no line starting "${start}"`);
  return line.slice(2);
};

test('restructure_decisions.md records the governing decision and both core sentences', () => {
  for (const s of [
    'Treat each theory as the target theorem when searching. Do not make “is the theory true?” the first research question.',
    'The theory is fixed for the research pass; the proof is what must be found.',
    'Search as though the theorem is true. Report only what the evidence actually proves.',
    'The theory is the fixed research target; the proof is what must be found.',
  ]) assert.ok(decisions.includes(s), s);
});

test('CLAUDE.md loads the research method first and carries the compact research-stance rule', () => {
  const md = read('CLAUDE.md');
  const order = ['docs/research_method.md', 'docs/claude_code_prompt.md', 'docs/objective.md', 'docs/restructure_decisions.md', 'research/'].map((f) => md.indexOf(f));
  assert.ok(order.every((i) => i >= 0), 'every read-order entry is present');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'read order: method, prompt, objective, decisions, registry');
  assert.ok(md.includes(quoted('Research stance: Every user-origin theory').replace('Research stance: ', '')), 'compact rule');
});

test('objective.md states the research posture and the status/mode distinction, keeping the earlier wording', () => {
  const md = read('docs/objective.md');
  assert.match(md, /^## Research posture$/m);
  assert.ok(md.includes(quoted('Geometry of Representation is not a survey')), 'posture text');
  assert.ok(md.includes(quoted('Their reported epistemic status remains HYPOTHESIS')), 'status clarification');
  assert.ok(md.includes('hypotheses, neither assumed true nor assumed false.'), 'earlier wording kept for provenance');
  assert.ok(md.indexOf('## Research posture') < md.indexOf('## Scope now'), 'posture sits near the objective');
});

test('claude_code_prompt.md distinguishes research stance from reported status, keeping the earlier wording', () => {
  const md = read('docs/claude_code_prompt.md');
  assert.ok(md.includes(quoted('The hypothesis is the target theorem for research.')), 'operational rule');
  assert.match(md, /Research stance is not reported status\./);
  assert.ok(md.includes('must not be treated as true or false'), 'earlier wording kept for provenance');
  assert.ok(md.includes("we can't assume this is false or true. take this as a hypothesis"), "Nadia's §1 statement untouched");
});

test('research_method.md is canonical and complete; the preamble carries the theorem-seeking block', () => {
  const md = read('docs/research_method.md');
  for (const h of ['## 1. Theorem-target stance', '## 2. Proof-obligation decomposition', '## 3. Exact-search hierarchy', '## 4. Outcome contract',
    '## 5. Evidence and counterexamples', '## 6. Research mode and reported status', '## 7. Examples']) assert.ok(md.includes(h), h);
  for (const k of ['**H1**', '**H2**', '**H3**', '**Zero**', '**Pair A**', '**Pair B**', '**Mass/wave**']) assert.ok(md.includes(k), `example ${k}`);
  for (const o of reg.researchOutcomes) assert.ok(md.includes(`\`${o}\``), `outcome ${o} documented`);
  const pre = read('docs/research_prompt_preamble.md');
  assert.ok(pre.includes(`THEOREM-SEEKING MODE\n${quoted('Treat the supplied user theory as the target theorem')}`), 'preamble block');
});

test('status hypothesis/open coexists with researchMode theorem-target (not a contradiction)', () => {
  const user = reg.theories.filter((r) => r.origin === 'user');
  for (const r of user) assert.equal(r.researchMode, 'theorem-target', `${r.id}: every user-origin theory is a target theorem`);
  for (const st of ['hypothesis', 'open']) assert.ok(user.some((r) => r.status === st && r.researchMode === 'theorem-target'), st);
});

test('proof targets: valid fields, Nadia\'s target wording, and no outcome claimed before a research pass reports one', () => {
  const KEYS = ['targetStatement', 'targetSource', 'requiredObjects', 'requiredMaps', 'candidateInvariants', 'requiredEquivalences', 'proofObligations',
    'exactSearchQueries', 'knownTheorems', 'unresolvedObligations', 'lastResearchOutcome'];
  for (const r of reg.theories) {
    assert.ok(reg.researchModes.includes(r.researchMode), r.id);
    const pt = r.proofTarget;
    if (!pt) continue;
    assert.deepEqual(Object.keys(pt).sort(), [...KEYS].sort(), r.id);
    assert.ok(read(pt.targetSource).includes(pt.targetStatement), `${r.id}: target not verbatim in ${pt.targetSource}`);
    assert.ok(pt.lastResearchOutcome === null || reg.researchOutcomes.includes(pt.lastResearchOutcome), `${r.id}: outcome`);
    if (pt.lastResearchOutcome === 'proved') assert.equal(r.status, 'established', `${r.id}: "proved" needs the status to follow a verifier verdict`);
  }
});

test('negative evidence never removes a user-origin theory', () => {
  const ids = new Set(reg.theories.map((r) => r.id));
  const ever = read('research/theories.ids').split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  for (const id of ever) assert.ok(ids.has(id), `${id} was removed`);
  for (const r of reg.theories.filter((t) => t.origin === 'user' && (t.evidenceAgainst.length || t.supersededBy))) {
    assert.ok(r.words, `${r.id}: original wording kept`);
    assert.equal(r.researchMode, 'theorem-target', `${r.id}: still a target (refined, not abandoned)`);
  }
});
