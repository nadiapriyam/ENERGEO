// Final adversarial C7 lock / audit (2026-11-16). Guards the audit (docs/restructure_decisions.md, "Final adversarial
// C7 lock / audit"): the published Quinn wording and the corrections search, the Eq. (2) verdict and its exact
// geometry, the constants, the analyticity and normalization conventions, the split C7 statuses with terminal values
// only, preserved history, and the branch lock.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const K = JSON.parse(read('research/c7_lock.json'));
const C1 = JSON.parse(read('research/c7_bridge.json'));
const F = JSON.parse(read('research/foundation.json'));
const obj = new Map(F.objects.map((o) => [o.id, o]));
const br = new Map(F.bridges.map((b) => [b.id, b]));
const reg = new Map(JSON.parse(read('research/theories.json')).theories.map((r) => [r.id, r]));
const latest = JSON.parse(read('verify/ledger/latest.json')).cards;
const decisions = read('docs/restructure_decisions.md');
const rec = read('research/constructions/c7_lock_audit.md');
const q19 = read('research/sources/quinn2019.md');
const pass = (...ids) => ids.every((id) => latest[id]?.verdict === 'PASS');
const row = (id) => K.table.find((t) => t.id === id);

test('1. all audit cards are on the ledger and pass', () => {
  assert.ok(existsSync(new URL('../verify/verify_C7L.py', import.meta.url)));
  assert.deepEqual(K.cards, [...'abcdefghijklmnopqr'].map((c) => `C7L${c}`));
  assert.ok(pass(...K.cards));
});

test('2. the published Eq. (2) is quoted, and the corrections search is recorded with the required sentence', () => {
  const eq2 = 'we can define a hyperellipsoid HY that must enclose model manifold Y, where the cross-sectional widths are given by ℓj(HY) = 2rσj(X) + 2‖y − pN−1‖∞';
  assert.ok(q19.includes(eq2) && K.source.eq2.includes(eq2));
  assert.ok(q19.includes('PHYSICAL REVIEW LETTERS 122, 158302 (2019)') && q19.includes('par.nsf.gov'));
  assert.equal(K.source.correctionVerdict, 'No official correction was located in this audit.');
  assert.ok(decisions.includes(K.source.correctionVerdict) && q19.includes(K.source.correctionVerdict) && rec.includes(K.source.correctionVerdict));
  const liveRec = rec.replace(/## Pass-1 statements refined by this audit[\s\S]*?(?=\n## )/, '');   // that table quotes superseded wording on purpose
  assert.ok(!/might already have fixed|may already be fixed|may already fix/i.test(q19 + liveRec), 'no speculation that the published paper fixed it');
  assert.equal(F.sources.find((s) => s.id === 'SRC-QUINN-2019').status, 'FULL TEXT READ (published version); CLAIM QUOTED');
});

test('3. Eq. (2): exact error-box support function, counterexample, and the precise verdict wording', () => {
  assert.ok(pass('C7La', 'C7Lb', 'C7Lc'));
  assert.equal(K.eq2.verdict, 'Counterexample to Eq. (2) as written under the ordinary Euclidean prediction-space interpretation.');
  assert.ok(decided(K.eq2.verdict));
  assert.match(latest.C7Lb.claim, /ε‖u‖₁/);
  assert.match(latest.C7Lc.claim, /0\.0834 > 0 \(exact\)/);
  assert.match(K.eq2.notClaimed, /not "the published paper is wrong" in every reading/);
  assert.ok(!/the published paper is wrong\b(?! in every reading)/i.test(rec.replace(K.eq2.notClaimed, '')));
});
function decided(t) { return decisions.includes(t); }

test('4. directional width, exact Minkowski enclosure and ellipsoid containment are kept apart; the relaxation is proved', () => {
  const g = new Map(K.geometry.map((x) => [x.object, x]));
  for (const o of ['error set', 'exact enclosure', 'directional width bound', 'conservative enclosing ellipsoid', 'Eq. (2) additive ellipsoid']) assert.ok(g.has(o), o);
  assert.equal(g.get('conservative enclosing ellipsoid').status, 'PROVED');
  assert.match(g.get('conservative enclosing ellipsoid').exact, /E\(2\(AAᵀ \+ Nε²I\)\)/);
  assert.equal(g.get('Eq. (2) additive ellipsoid').status, 'FAIL');
  assert.match(g.get('exact enclosure').exact, /Minkowski sums, not ellipsoids/);
  assert.ok(pass('C7Ld', 'C7Le'));
  assert.equal(br.get('BR72').strength, 'EXACT IMPLICATION');
  assert.equal(br.get('BR73').strength, 'FAILED CONNECTION');
});

test('5. coefficient radius and Eq. (8): internal constant inconsistency, not a new result', () => {
  assert.ok(pass('C7Lf', 'C7Lg'));
  assert.equal(K.constant.verdict, 'internal constant inconsistency / likely typographical factor; not a new mathematical result');
  assert.ok(K.constant.facts.some((f) => /M√\(4N − 3\)/.test(f) && /valid but loose by exactly 4/.test(K.constant.facts.join(' '))));
  assert.ok(q19.includes('‖c̃‖2 < 4M√(4N − 3)'));
});

test('6. analyticity, node and periodic conventions are stated exactly', () => {
  assert.ok(pass('C7Lh', 'C7Li', 'C7Lj', 'C7Lk'));
  assert.match(K.analyticity.statement, /EVEN/);
  assert.match(K.analyticity.statement, /annulus ρ\^\(−1\) < \|z\| < ρ is the strip \|Im φ\| < log ρ/);
  assert.match(K.analyticity.supersedes, /pass 1/);
  const conv = new Map(K.conventions.map((c) => [c.item, c.statement]));
  assert.match(conv.get('Chebyshev nodes'), /Gauss–Chebyshev \(first-kind\) nodes x_i = cos\(\(i \+ 1\/2\)π\/N\)/);
  assert.match(conv.get('Chebyshev nodes'), /fail for Chebyshev–Lobatto/);
  assert.match(conv.get('periodic Fourier route'), /complex basis[\s\S]*2K \+ 1 ≤ N[\s\S]*Nyquist/);
  assert.match(conv.get('Kolmogorov width'), /inf_\(dim L = m\)[\s\S]*span\{T_0, …, T_\(m−1\)\}[\s\S]*not a prediction-space ellipsoid axis/);
  assert.match(conv.get('reparametrization'), /changed: the raw Fisher matrix/);
});

test('7. final status table: separate rows, terminal statuses only, the required verdicts', () => {
  assert.deepEqual(K.terminalStatuses, ['PROVED', 'KNOWN-REFORMULATION', 'RESTRICTED', 'FAIL', 'OPEN']);
  assert.ok(decided(K.terminalStatuses.join('; ')));
  for (const t of K.table) assert.ok(K.terminalStatuses.includes(t.status), `${t.id}: ${t.status}`);
  const want = { 'C7-A': 'KNOWN-REFORMULATION', 'C7-B': 'KNOWN-REFORMULATION', 'C7-R': 'KNOWN-REFORMULATION', 'C7-LB': 'FAIL', 'C7-F(raw)': 'FAIL', 'C7-F(inv)': 'OPEN', 'TMS-W': 'OPEN' };
  for (const [id, st] of Object.entries(want)) assert.equal(row(id)?.status, st, id);
  assert.match(row('C7-R').scope, /RESTRICTED STRUCTURAL CONNECTION/);
  assert.match(row('TMS-W').scope, /NOT ESTABLISHED/);
  for (const t of K.table) if (t.cards.length) assert.ok(t.cards.every((c) => latest[c]?.verdict === 'PASS'), t.id);
  assert.ok(rec.includes('| C7-F(raw) |') && rec.includes('**FAIL**'));
});

test('8. C7-F(raw) fails by an explicit reparametrization; C7-F(inv) stays open; envelope alone gives no lower bound', () => {
  assert.ok(pass('C7Lm', 'C7Lq', 'C7Ln', 'C7Lr', 'C7Ll'));
  assert.match(K.fisherRaw.proof[0], /θ = aφ: g_φ = a²g_θ/);
  const fr = reg.get('T-C7-FRAW');
  assert.equal(fr.kind, 'historical-conjecture');
  assert.equal(fr.supersededBy, 'T-C7-FINV');
  assert.equal(reg.get('T-C7-FINV').supersedes, 'T-C7-FRAW');
  assert.equal(reg.get('T-C7-FINV').status, 'open');
  assert.ok(fr.boundaries.some((b) => b.startsWith('FINAL STATUS: FAIL')));
  assert.equal(reg.get('T-C7-LB').words, 'Envelope alone ⇏ nonzero actual-width lower bound.');
  assert.equal(K.lowerBound.verdict, 'FAIL');
  assert.match(K.lowerBound.future, /optional/);
  for (const [id, st] of [['C7F', 'NEGATIVE'], ['C7G', 'OPEN'], ['C7H', 'NEGATIVE'], ['C7Q', 'NEGATIVE']]) assert.equal(obj.get(id)?.status, st, id);
});

test('9. history is preserved: pass-1 record, T-C7 wording and the old umbrella status stay', () => {
  assert.equal(C1.principal, 'C7-KNOWN-REFORMULATION');
  assert.equal(C1.auditedBy, 'research/constructions/c7_lock_audit.md');
  const c7 = reg.get('T-C7');
  assert.equal(c7.status, 'open');
  assert.equal(c7.words, 'possible structural relation/analogy between coefficient spectra / Bessel-type decomposition and Fisher/sloppy spectra');
  assert.ok(c7.boundaries.some((b) => b.startsWith('Final C7 audit (2026-11-16)')));
  assert.ok(reg.get('T-C7-BRIDGE').boundaries.some((b) => /refined, not erased/.test(b)));
  assert.ok(K.superseded.length >= 8 && K.superseded.every((x) => x.passOne && x.now));
  assert.ok(read('research/connections/C7.md').includes('## Final audit (2026-11-16): split and locked'));
});

test('10. backbone, novelty discipline and ratings', () => {
  assert.equal(K.backbone.surviving, 'orthogonal spectral representation → coefficient hierarchy → restricted accessible coefficient region → bounded prediction-space directions');
  assert.equal(K.backbone.notYet, 'spectral hierarchy ⟹ universal Fisher hierarchy');
  assert.ok(decided(K.backbone.surviving) && decided(K.backbone.notYet));
  assert.match(K.novelty.discipline, /neither observation is presented as a novel theorem, and no priority is claimed/);
  assert.deepEqual(K.ratings.map((r) => r.item), ['C7-R', 'C7-F(raw)', 'C7-F(inv)', 'model-manifold / Fourier connection overall']);
  for (const r of K.ratings) assert.ok(Number.isInteger(r.bs) && Number.isInteger(r.slop) && r.td && Number.isInteger(r.breadth) && r.novelty, r.item);
  const raw = K.ratings.find((r) => r.item === 'C7-F(raw)');
  assert.ok(raw.bs === 0 && raw.td === 'FAIL');
});

test('11. the branch is locked and the pass stops', () => {
  assert.equal(K.lock.decision, 'LOCK C7-R / CLOSE THIS BRANCH');
  assert.ok(rec.trimEnd().includes('**LOCK C7-R / CLOSE THIS BRANCH**'));
  assert.equal(reg.get('T-C7-LOCK').status, 'governance');
  assert.ok(F.domains.some((d) => d.id === 'D34' && d.status === 'LOCKED'));
  assert.ok(F.domains.some((d) => d.id === 'D36' && d.status === 'OPEN LONG-TERM' && d.objects.includes('C7G')));
  for (const id of ['T-ENERGEO', 'T-DYADIC']) assert.equal(reg.get(id).status, 'open', `${id} untouched`);
  assert.match(rec, /Stop: no work on C7-F\(inv\), H3, mass-wave, quantum, relativity or Energeo/);
});
