// Research progress preview: data (2026-11-17). Read-only. Every field is taken or computed from existing records:
// research/canonical_story.json, research/foundation.json, research/theories.json, research/p17.json, research/c7_lock.json,
// research/application_matrix.md, verify/ledger/latest.json and the test files. Nothing here adds a relation or a status.
// Run: node research/tools/preview_data.mjs   (writes research/preview.json; test/preview.test.js checks it is current)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => readFileSync(path.join(ROOT, p), 'utf8');
const json = (p) => JSON.parse(read(p));

export function buildPreview() {
  const C = json('research/canonical_story.json');
  const F = json('research/foundation.json');
  const T = json('research/theories.json').theories;
  const P17 = json('research/p17.json');
  const K = json('research/c7_lock.json');
  const ledger = json('verify/ledger/latest.json').cards;
  const obj = new Map(F.objects.map((o) => [o.id, o]));
  const reg = new Map(T.map((r) => [r.id, r]));
  const pass = (c) => ledger[c]?.verdict === 'PASS';
  const passCount = (cards) => [...new Set(cards)].filter(pass).length;
  const cardsOf = (...ids) => [...new Set(ids.flatMap((i) => obj.get(i)?.cards ?? []))];

  // ── provenance / status classes (the legend) ──────────────────────────────────────────────────────
  const CLASSES = {
    known: 'known / established mathematics',
    derived: 'project-derived',
    construction: 'project construction / synthesis',
    open: 'open hypothesis / question',
    failed: 'failed / refined',
  };
  const classOfObject = (o) => {
    if (o.status === 'NEGATIVE') return 'failed';
    if (o.status === 'OPEN' || o.status === 'HYPOTHESIS') return 'open';
    if (o.provenance === 'TEXTBOOK / STANDARD' || o.provenance === 'PRIMARY-PAPER BACKED') return 'known';
    if (o.provenance === 'PROJECT-CONSTRUCTION' || o.provenance === 'SPECULATIVE PROJECT CONNECTION') return 'construction';
    if (o.provenance === 'PROJECT-DERIVED FROM ESTABLISHED MATH') return /SYNTHESIS|ARCHITECTURAL/.test(o.novelty ?? '') ? 'construction' : 'derived';
    return 'open';
  };
  const classOfRecord = (r) => (r.kind === 'historical-conjecture' ? 'failed' : ['open', 'hypothesis'].includes(r.status) ? 'open' : r.origin === 'user' ? 'known' : 'derived');

  // ── Section 1: the journey (20 nodes) ─────────────────────────────────────────────────────────────
  const ids = [...obj.keys()];
  const expand = (tok) => {
    const m = tok.match(/^([A-Z]+)(\d+)[–-]\1?(\d+)$/);
    if (m) return ids.filter((i) => { const n = i.match(/^([A-Z]+)(\d+)$/); return n && n[1] === m[1] && +n[2] >= +m[2] && +n[2] <= +m[3]; });
    if (/^P17F[–-]P17X$/.test(tok)) return ids.filter((i) => i.startsWith('P17'));
    return [tok];
  };
  const refsOf = (repo) => repo.split(/[\s,;()]+/).filter(Boolean).flatMap(expand);
  const journey = C.master.map((m) => {
    const refs = refsOf(m.repo);
    const objects = refs.filter((r) => obj.has(r)).map((r) => obj.get(r));
    const cards = refs.filter((r) => ledger[r] && !obj.has(r));
    const records = refs.filter((r) => reg.has(r)).map((r) => reg.get(r));
    const classes = new Set(objects.map(classOfObject));
    for (const c of cards) {
      if (!pass(c)) classes.add('failed');
      else for (const o of F.objects.filter((x) => x.cards.includes(c) && x.status !== 'NEGATIVE')) classes.add(classOfObject(o));
    }
    for (const r of records) classes.add(classOfRecord(r));
    const failures = C.failures.filter((f) => new RegExp(`#${m.n}(?!\\d)`).test(f.question));
    if (failures.length) classes.add('failed');
    const edgesIn = C.edges.filter((e) => e.dst === `M${m.n}`);
    const edgesOut = C.edges.filter((e) => e.src === `M${m.n}`);
    return {
      n: m.n, title: m.title, question: m.q, relation: m.rel, next: m.nxt, trigger: m.trigger,
      status: Object.keys(CLASSES).filter((k) => classes.has(k)),
      predecessors: edgesIn.filter((e) => ['NEXT QUESTION', 'EARLIER PREDECESSOR'].includes(e.type)).map((e) => ({ node: +e.src.slice(1), type: e.type, why: e.why })),
      crossReferences: [...edgesIn, ...edgesOut].filter((e) => e.type === 'CROSS-REFERENCE').map((e) => ({ from: +e.src.slice(1), to: +e.dst.slice(1), why: e.why })),
      outgoing: edgesOut.filter((e) => e.type !== 'CROSS-REFERENCE').map((e) => ({ node: +e.dst.slice(1), type: e.type })),
      evidence: objects.map((o) => ({ id: o.id, name: o.name, status: o.status, cls: classOfObject(o), equation: o.equation })),
      failures: failures.map((f) => ({ failure: f.failure, taught: f.taught })),
    };
  });

  // ── Section 2: what we have actually proved (grouped) ─────────────────────────────────────────────
  const matrix = read('research/application_matrix.md');
  const v4 = matrix.slice(matrix.indexOf('## Version 4'), matrix.indexOf('## Version 3'));
  const crossRow = v4.split('\n').find((l) => l.startsWith('| Cross-domain architecture |')).split('|').map((x) => x.trim());
  const c7cx = (K.eq2.why.filter((w) => /^example \((i|ii)\)/.test(w))).length;
  const group = (id, title, question, tex, points, objectIds, extraCards = [], extra = {}) => {
    const cards = [...new Set([...cardsOf(...objectIds), ...extraCards])];
    return { id, title, question, tex, points, objects: objectIds, cardsPass: passCount(cards), cardsTotal: cards.length, provenance: [...new Set(objectIds.map((i) => obj.get(i).provenance))], ...extra };
  };
  const proved = [
    group('A', 'Translation and spectrum', 'If I shift a signal, what does that tell me about its frequencies?',
      ['D_x(\\tau) = 1-\\int\\cos(\\omega\\tau)\\,d\\mu_x(\\omega)', "D_x''(0) = \\int\\omega^2\\,d\\mu_x = \\frac{\\|x'\\|^2}{\\|x\\|^2} = \\Delta\\omega^2+\\bar\\omega^2"],
      [{ text: 'translation defect = 1 − (normalized autocorrelation) = 1 − spectral cosine average; dμ_x = |x̂|²dω / (2π‖x‖²)', cards: ['FB1a', 'FB1b'] },
       { text: 'second derivative at 0 = spectral second moment = ‖x′‖²/‖x‖² = spectral variance + squared spectral mean (exact when ∫ω²|x̂|² < ∞)', cards: ['FB2a', 'FB2d'] },
       { text: 'the uncertainty inequality is a different statement (T5, source-only theorem; instances carded)', cards: ['FB3a'] }],
      ['T3', 'T4'], [], { }),
    group('B', 'Zero and weighted geometry', 'What geometry does the mass-balance zero carry?',
      ['C_m = I - \\frac{\\mathbf 1 m^{\\mathsf T}}{M}', '\\sum_i m_i\\,(r_i - R_{\\mathrm{CM}}) = 0'],
      [{ text: 'C_m is an orthogonal projector for the weighted inner product D = diag(m): C_m² = C_m, C_m 1 = 0', cards: ['CFT8a', 'G5b'] },
       { text: 'self-adjoint for D: D C_m = C_mᵀ D', cards: ['CFT8a', 'G5d'] },
       { text: 'not an isometry: C_mᵀ D C_m ≠ D (it removes the direction 1)', cards: ['CFT8b'] },
       { text: 'compatible with the relevant symmetry subgroup: D-isometries fixing 1 commute with C_m; maps outside that subgroup do not', cards: ['CFT8c'] }],
      ['H4'], [], { }),
    group('C', 'Same visible zero, hidden structure', 'Does the same visible zero carry the same hidden information in two systems?',
      ['S_z\\psi = 0 \\quad\\text{and}\\quad \\textstyle\\sum_i u_i = 0'],
      [{ text: 'six spin targets (four labelled spin-½, S_z = 0): the contribution geometry is blind; the independently supplied S₄ action separates all six into the S² sectors, preregistered', cards: ['FS2b', 'FS2c'] },
       { text: 'six mass configurations M1–M6 (equal masses): the contribution geometry predicts second-moment isotropy in all six; symmetry predicts correctly where it predicts (M1, M4) and misses M5', cards: ['MB2a', 'MB2b', 'MB2c'] },
       { text: `transferred: ${crossRow[5]} (${crossRow[7]})`, cards: ['FS2e', 'MB2c'] },
       { text: 'did not transfer: which side carries the information — geometry blind in the spins, decisive in the masses (roles inverted)', cards: ['FS2c', 'MB2a'] },
       { text: 'no nontrivial predictive transfer was found (application matrix, version 4)', cards: [] }],
      ['QZ3', 'Z12'], ['MB1a', 'MB1b', 'MB2a', 'MB2b', 'MB2c'], { counts: { spin: 6, mass: 6 } }),
    group('D', 'Preserved structure and geometry', 'What does it mean for a transformation to keep a geometry?',
      ['F^{*}T = T', 'A^{\\mathsf T} M A = M'],
      [{ text: 'coordinate-free: a symmetry pulls the defining tensor back to itself; with a constant form and a linear map this is AᵀMA = M', cards: ['CFT1a', 'C1b'] },
       { text: 'kept apart: (1) representation change (R1, covariance); (2) actual invariance / symmetry (R2, F*T = T); (3) equivariant / compatible operators (R3, C ρ_V(g) = ρ_W(g) C)', cards: ['TRA4a', 'TRA2a', 'TRA3a'] }],
      ['CF12', 'CF1', 'TA0', 'TA1', 'TA2', 'TA3'], [], { }),
    group('E', 'Fourier → model geometry; the Quinn audit', 'Can a decaying Fourier spectrum bound the geometry of a model\'s predictions?',
      ['Y(\\Theta) \\subseteq V_m D_m[-1,1]^m \\oplus [-R_m, R_m]^N', 'w_u \\le 2r\\sigma + 2\\varepsilon\\|u\\|_1', 'H_P \\oplus B_2(\\delta) \\subseteq E(Q),\\; Q = 2(AA^{\\mathsf T} + \\delta^2 I)'],
      [{ text: 'surviving bridge (C7-R, restricted): a uniform coefficient envelope gives a prediction-space enclosure — an upper bound only', cards: ['C7f', 'C7Lp'] },
       { text: `${c7cx} exact counterexamples to Quinn et al. 2019, Eq. (2), under the audited Euclidean interpretation`, cards: ['C7Lc'] },
       { text: 'corrected directional bound: the sampled error lies in a box, so the width along u is at most 2rσ + 2ε‖u‖₁', cards: ['C7Lb'] },
       { text: 'corrected enclosure: a proved conservative ellipsoid', cards: ['C7Le'] },
       { text: `no novelty or priority claim yet: ${K.novelty.discipline.split(';')[0]}`, cards: [] }],
      ['C7D', 'C7C', 'C7Q'], ['C7Lb', 'C7Le'], { novelty: 'POSSIBLE NOVELTY — PRIORITY NOT ESTABLISHED', noveltyAppliesTo: 'the Eq. (2) counterexamples and corrections only' }),
    group('F', '#17: the mass-shell relation', 'Do physical pairings reflect a symmetry analogous to Fourier conjugacy? — the mass/wave candidate',
      ['\\left(\\frac{\\omega}{c}\\right)^{2}-k^{2} = \\left(\\frac{mc}{\\hbar}\\right)^{2}'],
      [{ text: P17.words.level, cards: ['P17Lg'] },
       { text: 'm = 0 ⇒ null level, q(P) = 0', cards: ['P17Dc'], cls: 'null' },
       { text: 'm > 0 ⇒ a nonzero mass-shell level, q(P) = (mc/ħ)² > 0', cards: ['P17De'], cls: 'massive' },
       { text: P17.words.boost, cards: ['P17La'] }],
      ['P17F', 'P17R', 'P17N', 'P17M'], P17.lockCards,
      { failed: 'FAILED interpretation: mass and wave are complex-conjugate partners (MW-C).', open: 'OPEN: whether particle and wave descriptions represent a deeper common structure (MW-D).' }),
  ];

  // ── Section 3: what is still open ─────────────────────────────────────────────────────────────────
  const openGroup = (id, title, ids) => {
    const recs = ids.map((i) => reg.get(i));
    const forCards = [...new Set(recs.flatMap((r) => r.evidenceFor.filter((e) => e.ref.startsWith('card:')).map((e) => e.ref.slice(5))))];
    const against = recs.flatMap((r) => r.evidenceAgainst.filter((e) => e.ref.startsWith('card:')).map((e) => ({ card: e.ref.slice(5), note: e.note, verdict: ledger[e.ref.slice(5)]?.verdict ?? '—' })));
    return { id, title, question: recs[0].words, related: recs.slice(1).map((r) => ({ id: r.id, words: r.words, status: r.status })),
             record: recs[0].id, status: recs[0].status, evidencePass: forCards.filter(pass).length,
             failures: [...new Map(against.map((a) => [a.card, a])).values()] };
  };
  const open = [
    openGroup('1', 'Zero → hidden structure', ['T-Q.zero-generators', 'Q-R4-8-INVERSE', 'T-HIDDEN-FAMILY', 'T-BACKBONE-PRIMARY']),
    openGroup('2', 'Same mathematical relation → shared structural law?', ['T-TRANSFORMATION-DEEP', 'T-Q.pairA-transfer']),
    openGroup('3', 'Geometry / constraints → observable behaviour', ['T-GEOM-RULES', 'T-STAR', 'T-GEN-DYN-Q']),
    openGroup('4', 'Physical pairings / mass–wave', ['T-CONJUGACY', 'T-MW-D', 'T-P17-MASS-SPECTRAL-Q', 'T-MW-C']),
    openGroup('5', 'Invariant Fourier → model-manifold geometry', ['T-C7-FINV', 'T-C7-FRAW', 'T-C7-LB']),
    openGroup('6', 'Energeo: the downstream application', ['T-ENERGEO']),
  ];

  // ── Section 5: numbers (auditable only) ───────────────────────────────────────────────────────────
  const cards = Object.values(ledger);
  const testFiles = readdirSync(path.join(ROOT, 'test')).filter((f) => f.endsWith('.test.js'));
  const tests = testFiles.reduce((n, f) => n + (read(`test/${f}`).match(/^test\(/gm) ?? []).length, 0);
  const projectDerived = F.objects.filter((o) => ['PROJECT-DERIVED FROM ESTABLISHED MATH', 'PROJECT-CONSTRUCTION'].includes(o.provenance) && ['ESTABLISHED', 'DERIVED'].includes(o.status));
  const KIND = { 'open-question': 'open questions', hypothesis: 'hypotheses', established: 'established', 'derived-connection': 'derived connections', 'philosophical-exploration': 'philosophical explorations',
                 'method-rule': 'method / decision rules', 'historical-conjecture': 'historical conjectures', 'construction-backed-direction': 'construction-backed directions' };
  const byKind = (recs) => Object.entries(recs.reduce((m, r) => ({ ...m, [r.kind]: (m[r.kind] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${n} ${n === 1 ? (KIND[k] ?? k).replace(/ies$/, 'y').replace(/s( \/|$)/, '$1').replace(/s$/, '') : KIND[k] ?? k}`).join(', ');
  const userRecs = T.filter((r) => r.origin === 'user');
  const openRecs = T.filter((r) => r.status === 'open');
  const pdCount = (prov) => projectDerived.filter((o) => o.provenance === prov).length;
  const numbers = [
    { label: 'Verifier cards passing (latest ledger run)', value: `${cards.filter((c) => c.verdict === 'PASS').length} / ${cards.length}` },
    { label: 'Retained FAIL cards (kept, never rewritten)', value: String(cards.filter((c) => c.verdict !== 'PASS').length), detail: Object.entries(ledger).filter(([, c]) => c.verdict !== 'PASS').map(([k]) => k).sort().join(', ') },
    { label: 'Verifier scripts', value: String(readdirSync(path.join(ROOT, 'verify')).filter((f) => /^verify_.*\.py$/.test(f)).length) },
    { label: 'Automated tests', value: String(tests), detail: `${testFiles.length} test files` },
    { label: 'Canonical story nodes', value: String(C.master.length), detail: `${C.edges.length} typed edges` },
    { label: 'Foundation objects', value: String(F.objects.length), detail: `${F.bridges.length} bridges, ${F.sources.length} sources` },
    { label: 'User provenance: registry records tagged USER-ORIGIN', value: String(userRecs.length),
      detail: `records traced to Nadia's prompts and decision records — ${byKind(userRecs)}. Not a count of independent theories or original ideas.` },
    { label: 'Project-derived / project-built: Foundation objects classified PROJECT-DERIVED or PROJECT-BUILT (status established or derived)', value: String(projectDerived.length),
      detail: `${pdCount('PROJECT-DERIVED FROM ESTABLISHED MATH')} project-derived from established mathematics, ${pdCount('PROJECT-CONSTRUCTION')} project constructions; includes derivations, constructions, classifications, reformulations and architecture records. Not a count of novel theorems or independent discoveries.` },
    { label: 'Open questions: registry records with status OPEN, including subquestions', value: String(openRecs.length),
      detail: `${byKind(openRecs)}; many are subquestions or refinements of the six open groups above. Not a count of independent research programmes.` },
    { label: 'Open long-term Foundation domains', value: String(F.domains.filter((d) => d.status === 'OPEN LONG-TERM').length), detail: `of ${F.domains.length} domains; ${F.domains.filter((d) => d.status === 'LOCKED').length} locked` },
    { label: '#17: exact counterexamples', value: String(P17.counterexamples.length), detail: `P17-X1–X5, plus ${P17.supportingCounterexamples.length} supporting` },
    { label: 'Quinn et al. 2019, Eq. (2): exact counterexamples', value: String(c7cx), detail: 'under the audited Euclidean interpretation (C7Lc)' },
  ];
  const note = 'Verification counts report executable checks in this repository. They are not peer review, independent replication, probabilities of truth, or measures of originality.';
  const countsNote = 'Repository counts describe records and executable checks in this project. They are not counts of independent discoveries, peer-reviewed results, probabilities of truth, or measures of originality.';

  const provenance = [
    { label: 'USER-ORIGIN', text: 'Question or hypothesis can be traced to Nadia\'s prompts/decision records.' },
    { label: 'PROJECT/CLAUDE-DERIVED', text: 'Formal derivation, construction, proof or counterexample was produced during this project.' },
    { label: 'KNOWN MATHEMATICS', text: 'Imported or independently rederived mathematics already established externally.' },
    { label: 'POSSIBLE NOVELTY', text: 'Only used where a result has not yet been located in prior literature. Currently only the Quinn Eq. (2) correction / counterexamples carry it, as POSSIBLE NOVELTY — PRIORITY NOT ESTABLISHED.' },
  ];

  return {
    about: 'Research progress preview (read-only). Generated by research/tools/preview_data.mjs from existing records; nothing here adds a relation or a status.',
    generatedFrom: ['research/canonical_story.json', 'research/foundation.json', 'research/theories.json', 'research/p17.json', 'research/c7_lock.json', 'research/application_matrix.md', 'verify/ledger/latest.json', 'test/*.test.js'],
    lock: { act8: C.lock.choice, p17: P17.lock.choice, stop: P17.lock.stop },
    classes: CLASSES, journey, proved, open, numbers, note, countsNote, provenance,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = buildPreview();
  writeFileSync(path.join(ROOT, 'research/preview.json'), JSON.stringify(data, null, 1) + '\n');
  console.log(`preview: ${data.journey.length} nodes; ${data.proved.length} proved groups; ${data.open.length} open groups; ${data.numbers[0].value} cards; ${data.numbers[3].value} tests`);
}
