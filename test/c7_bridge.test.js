// C7 construction pass 1 (2026-11-15). Guards the first C7 construction (docs/restructure_decisions.md, "C7
// construction pass 1"): source-locked width objects, the chain with each arrow labelled, the restricted theorem and
// its proof steps, the required counterexamples, one principal status, separate ratings, and T-C7 left OPEN.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const C = JSON.parse(read('research/c7_bridge.json'));
const F = JSON.parse(read('research/foundation.json'));
const M = JSON.parse(read('research/model_manifold.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const br = new Map(F.bridges.map((b) => [b.id, b]));
const srcs = new Map(F.sources.map((s) => [s.id, s]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const decisions = read('docs/restructure_decisions.md');
const rec = read('research/constructions/c7_fourier_width.md');
const pass = (...ids) => ids.every((id) => latest[id]?.verdict === 'PASS');

test('1. every C7 card is on the ledger and passes', () => {
  assert.ok(existsSync(new URL('../verify/verify_C7.py', import.meta.url)));
  assert.deepEqual(C.cards, [...'abcdefghijklmnopqrstu'].map((c) => `C7${c}`));
  assert.ok(pass(...C.cards));
});

test('2. the width objects are source-locked with verbatim quotations', () => {
  const q19 = read('research/sources/quinn2019.md');
  for (const s of ['uniformly in θ', 'ℓj(HP) = 2rσj(X)', 'forming an upper bound on possible lengths of the manifolds', 'Tj(t) = cos(j arccos t)', 'arXiv v1', 'Not read:']) assert.ok(q19.includes(s), s);
  const tms = read('research/sources/tms2011.md');
  for (const s of ['each of the eigendirections of the metric', 'some point located near the center', 'may not agree if the parameters utilize different units']) assert.ok(tms.includes(s), s);
  assert.ok(read('research/sources/quinn2023.md').includes('classical kinematics is a boundary of the manifold of special relativities'), 'P-2 quotation');
  for (const id of ['SRC-QUINN-2019', 'SRC-TMS-2010', 'SRC-TMS-2011', 'SRC-QUINN-2023']) assert.equal(srcs.get(id).status, 'FULL TEXT READ (arXiv version); CLAIM QUOTED', id);
  assert.ok(F.sourceStatuses.includes('FULL TEXT READ (arXiv version); CLAIM QUOTED'));
});

test('3. the primary target is the Quinn-style enclosure; Transtrum widths are not used as an invariant', () => {
  assert.equal(C.target.name, 'W_j^bound');
  assert.match(C.target.invariance, /not on θ-coordinates/);
  for (const n of ['Fisher eigenvalues', 'Jacobian singular values', 'Hessian eigenvalues', 'Transtrum geodesic widths', 'intrinsic geodesic diameter']) assert.ok(C.target.notIdentified.includes(n), n);
  assert.match(C.transtrum.decision, /NOT C7's primary invariant object/);
  assert.ok(decided('Do NOT assume that “Transtrum geodesic widths” are a coordinate-independent invariant object merely because geodesic length is invariant.'));
  assert.equal(reg.get('T-TMS-WIDTHS').status, 'established');
  const inv = new Map(M.invariance.map((r) => [r.quantity, r]));
  assert.equal(inv.get('Quinn enclosure axes W_j^bound (source-locked, C7 pass 1)').invariant, 'yes');
  assert.ok(pass('C7k', 'MMPg'));
});
function decided(t) { return decisions.includes(t); }

test('4. the chain keeps its three claims apart, each arrow labelled', () => {
  assert.deepEqual(C.chain.map((a) => a.id), ['C7-A', 'C7-B', 'C7-B′', 'C7-C', 'C7-D']);
  const st = new Map(C.chain.map((a) => [a.id, a.status]));
  assert.equal(st.get('C7-A'), 'EXACT IDENTITY');
  assert.match(st.get('C7-B'), /UNIFORMITY REQUIRED/);
  assert.match(st.get('C7-C'), /UPPER BOUND ONLY/);
  assert.match(st.get('C7-D'), /UPPER BOUND ONLY; NOT NECESSARY/);
  for (const a of C.chain) assert.ok(a.cards.length && pass(...a.cards), a.id);
  assert.ok(decided('Chebyshev coefficients of f_θ(x) correspond to cosine-Fourier coefficients of F_θ(φ) = f_θ(cos φ).'));
});

test('5. the theorem states every hypothesis, is an upper bound, and lists what it does not claim', () => {
  const t = C.theorem;
  assert.ok(t.hypotheses.some((h) => /uniform envelope: \|a_k\(θ\)\| ≤ r_k for all θ/.test(h)));
  assert.ok(t.hypotheses.some((h) => /Euclidean/.test(h)));
  assert.equal(t.nature.upperBoundOnly, true);
  assert.equal(t.nature.asymptotic, false);
  assert.match(t.nature.infiniteN, /\(a\)/);
  for (const n of ['lower bounds', 'necessity', 'pointwise', 'Fisher', 'Transtrum']) assert.ok(t.notClaimed.some((x) => x.includes(n)), n);
  for (const p of C.proof) assert.ok(p.argument && p.cards.length && pass(...p.cards), p.step);
});

test('6. the required counterexamples are carded and preserved', () => {
  const byId = new Map(C.counterexamples.map((c) => [c.id, c]));
  for (const [id, card] of [['A', 'C7d'], ['B', 'C7l'], ['C', 'C7m'], ['D', 'C7k'], ['E', 'C7o'], ['F', 'C7p'], ['G', 'C7n'], ['H', 'C7j']]) {
    assert.equal(byId.get(id)?.card, card, id);
    assert.ok(pass(card), card);
    assert.ok(rec.includes(`| ${id} | ${byId.get(id).name} |`), `${id} rendered`);
  }
  assert.match(byId.get('A').breaks, /FAIL/);
  assert.match(byId.get('G').breaks, /necessary/);
});

test('7. one principal status from the allowed five; novelty is reformulation', () => {
  assert.deepEqual(C.statuses, ['C7-PROVED', 'C7-RESTRICTED', 'C7-KNOWN-REFORMULATION', 'C7-PARTIAL', 'C7-FAIL']);
  assert.ok(decided(C.statuses.join('; ')));
  assert.equal(C.principal, 'C7-KNOWN-REFORMULATION');
  assert.equal((rec.match(/Principal status: /g) || []).length, 1);
  assert.equal(C.novelty, 'reformulation');
  assert.ok(C.noveltyScale.includes(C.novelty));
  assert.match(C.noveltyNote, /not a new theorem/);
  assert.equal(C.label, 'RESTRICTED STRUCTURAL CONNECTION');
  assert.ok(C.subsidiary.some((s) => /Fisher/.test(s.claim) && /OPEN/.test(s.status)));
});

test('8. T-C7 stays OPEN with its words; the new records are verbatim and labelled', () => {
  const c7 = reg.get('T-C7');
  assert.equal(c7.status, 'open');
  assert.equal(c7.words, 'possible structural relation/analogy between coefficient spectra / Bessel-type decomposition and Fisher/sloppy spectra');
  assert.ok(c7.boundaries.some((b) => b.startsWith('C7 pass 1 (2026-11-15)')));
  for (const id of ['T-C7-GOV', 'T-C7-BRIDGE', 'T-C7-SPECTRAL-CHAIN', 'T-C7-UNIFORM', 'T-C7-NOT-NECESSARY', 'T-TMS-WIDTHS']) assert.ok(decided(reg.get(id).words), id);
  assert.equal(reg.get('T-C7-GOV').status, 'governance');
  assert.ok(reg.get('T-C7-SPECTRAL-CHAIN').boundaries.some((b) => b.includes('RESTRICTED STRUCTURAL CONNECTION')));
  assert.ok(reg.get('T-C7-BRIDGE').boundaries.some((b) => b.includes('C7-KNOWN-REFORMULATION')));
  assert.equal(obj.get('M4').status, 'OPEN');
  for (const s of F.sources) assert.ok(!s.supports.includes('M4'), `${s.id}: no paper is evidence for C7 as first posed`);
});

test('9. Foundation records the C7 objects, the bridges with their strengths, and the domain', () => {
  for (const [id, status] of [['C7A', 'ESTABLISHED'], ['C7B', 'ESTABLISHED'], ['C7C', 'ESTABLISHED'], ['C7D', 'DERIVED'], ['C7E', 'ESTABLISHED']]) assert.equal(obj.get(id)?.status, status, id);
  for (const [id, strength] of [['BR63', 'EXACT IDENTITY'], ['BR64', 'EXACT IDENTITY'], ['BR65', 'THEOREM'], ['BR66', 'FAILED CONNECTION'], ['BR67', 'FAILED CONNECTION'], ['BR68', 'FAILED CONNECTION'], ['BR69', 'FAILED CONNECTION']])
    assert.equal(br.get(id)?.strength, strength, id);
  assert.ok(F.domains.some((d) => d.id === 'D34' && d.objects.join(' ') === 'C7A C7B C7C C7D C7E'));
  assert.ok(obj.get('C7C').sources.includes('SRC-QUINN-2019'));
});

test('10. ratings are separate, not inflated, and no predictive transfer is claimed', () => {
  assert.deepEqual(C.ratings.map((r) => r.item), ['Fourier → Chebyshev identity', 'coefficient decay → approximation control', 'approximation control → prediction-space width bound', 'full C7 chain', 'direct periodic Fourier route']);
  for (const r of C.ratings) {
    assert.ok(Number.isInteger(r.bs) && r.bs <= 50 && Number.isInteger(r.slop), r.item);
    assert.ok(['TRIVIAL CONSEQUENCE', 'STRUCTURAL TRANSFER', 'NOT YET FORMALIZED', 'FAIL'].includes(r.td), r.item);
    assert.ok(Number.isInteger(r.breadth) && r.breadth >= 0 && r.breadth <= 5 && r.status, r.item);
  }
});

test('11. what C7 must not claim is not claimed', () => {
  const live = rec.split('\n').filter((l) => !/\bnot\b|NOT|no |FAIL/.test(l));
  for (const l of live) assert.ok(!/all model manifolds are hyperribbons|Fourier eigenvalues are|Fisher eigenvalues are invariant|ellipsoid axes equal|smoothness is necessary|spectral decay is necessary/i.test(l), l.slice(0, 90));
  assert.match(C.spectralChainVerdict, /only as an upper bound/);
  assert.equal(M.c7.pass1.principal, C.principal);
  assert.match(C.next[0], /^Adversarial C7 lock \/ audit pass/);
});
