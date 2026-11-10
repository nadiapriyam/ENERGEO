"""Authoring source for research/theories.json (the theory registry). Run once to (re)generate the JSON:
    python3 research/tools/theories_source.py
After that the JSON is the record; edit it directly or edit here and regenerate. test/theories.test.js checks every
quote against its source document, and research/tools/build_coverage.mjs renders research/theory_coverage.md."""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
P, G2, G3, MM, SPEC, RD = ('docs/claude_code_prompt.md', 'docs/gate2_answers.md', 'docs/gate3_decisions.md',
                           'docs/Interactive_Master_Map.extracted.md', 'docs/Mathematical_Basis_Interactive_Design_Spec.md', 'docs/restructure_decisions.md')
G4 = 'docs/gate4_decisions.md'
H1, H2, H3 = 'research/hypotheses/H1.md', 'research/hypotheses/H2.md', 'research/hypotheses/H3.md'

def line_from(path, start):
    for ln in (ROOT / path).read_text().splitlines():
        s = ln.lstrip('> ').strip()
        if s.startswith(start):
            return s
    raise SystemExit(f'not found in {path}: {start}')

R = []
def T(id, label, words, src, origin, kind, status, *, norm=None, variants=(), pro=(), con=(), bounds=(), sup=None, supers=None,
      acts=(), objs=(), audit=('preserved', ''), ui='none', graph=None, ref=None, target=None):
    R.append(dict(id=id, label=label, words=words, variants=[dict(words=w, source=s) for w, s in variants],
                  normalizedStatement=norm, origin=origin, kind=kind, status=status,
                  evidenceFor=[dict(ref=r, note=n) for r, n in pro], evidenceAgainst=[dict(ref=r, note=n) for r, n in con],
                  boundaries=list(bounds), supersededBy=sup, supersedes=supers, relatedActs=list(acts), relatedObjects=list(objs),
                  relatedCards=sorted({r.split(':', 1)[1] for r, _ in list(pro) + list(con) if r.startswith('card:')}),
                  sourceDocs=[src] + [s for _, s in variants], auditRef=ref, audit=dict(before=audit[0], note=audit[1]),
                  interactive=ui, graphRecord=graph,
                  # research execution (docs/research_method.md): separate from the reported status above
                  researchMode='theorem-target', proofTarget=proof_target(**target) if target else None))

OUTCOMES = ('proved', 'known-theorem', 'constructive-realization', 'special-case', 'exact-obstruction', 'proof-obligation')
def proof_target(targetStatement, source=RD, **kw):
    """A proof program. Fields fill in gradually; an empty list is an unstarted obligation, not a verdict."""
    pt = dict(targetStatement=targetStatement, targetSource=source, requiredObjects=[], requiredMaps=[], candidateInvariants=[],
              requiredEquivalences=[], proofObligations=[], exactSearchQueries=[], knownTheorems=[], unresolvedObligations=[],
              lastResearchOutcome=None)
    for k, v in kw.items():
        assert k in pt, k
        pt[k] = v
    assert pt['lastResearchOutcome'] in (None,) + OUTCOMES
    return pt

U, A = 'user', 'assistant-proposed'

# ── the founding statement and its evidence ──────────────────────────────────────────────────────
T('T-ORIGIN', 'The founding hypothesis, whole', line_from(P, 'i want to prove a theory correct'), P, U, 'hypothesis', 'hypothesis',
  norm='Split by Nadia into H1 → H2 → H3 (prompt §1a); every part below keeps its own record.', acts=['I–IX'],
  audit=('preserved', 'objective.md and the prompt; split into H1–H3'), graph='program', ref='prompt §1')
T('T-EVIDENCE', 'The Fourier evidence', line_from(P, 'fourier transform: there is an orthonormal basis'), P, U, 'hypothesis', 'hypothesis',
  norm='f̂(k) = ⟨f, e_k⟩ with e_k orthonormal; the pattern Nadia noticed is what f̂(k) and e^{2πikt} represent together.',
  variants=[('What these terms represent *together* is seen everywhere in Fourier series and the Fourier transform.', P)],
  pro=[('card:S2a', 'e_k orthonormal'), ('card:O2a', 'f̂(k) is the projection ⟨f, e_k⟩'), ('card:S2b', 'Parseval')],
  bounds=['The established parts are the projection and orthonormality; the "pattern" across fields is the hypothesis.'],
  acts=['III', 'IV'], ui='Fourier Coefficients (#7) and Orthogonality and Zero (#8), to become stages 6–8',
  audit=('preserved', 'shared evidence block of H1–H3'), graph='H1, H2, H3', ref='prompt §1, §1b')

# ── H1 and its refinements ───────────────────────────────────────────────────────────────────────
T('T-H1', 'H1: orthogonality, quadratics, representation', line_from(P, 'first i want to prove what is the significance of having orthogonality'), P, U, 'hypothesis', 'hypothesis',
  pro=[('card:S1a', 'Pythagoras ⟺ orthogonality'), ('card:O1e', 'signature together'), ('card:S7', 'Bessel'), ('card:S13', 'projection residual')],
  bounds=['Each consequence of orthogonality is Level 1; why orthogonality keeps appearing across representations is the hypothesis (Gate 3).'],
  acts=['IV', 'V'], objs=['obj.pair'], ui='Orthogonality and Zero (#8), stage 7 of the restructure', graph='H1', ref='H1',
  target=dict(targetStatement='Characterize the complete class of geometric/quadratic consequences equivalent to or generated by ⟨u,v⟩ = 0, and identify which are representation invariant.'))
T('T-H1-SIGNATURE', 'H1-1: orthogonality makes components separable',
  'The significance I want to investigate is that orthogonality makes components mathematically separable.', G3, U, 'established', 'established',
  norm='Zero cross terms, independent projection coefficients, Pythagorean/Parseval additivity, residual ⟂ retained part; G = I.',
  pro=[('card:S1a', ''), ('card:O1e', ''), ('card:S2b', ''), ('card:B2a', ''), ('card:O2f', 'cross-talk when G ≠ I')],
  acts=['IV'], ui='#7 stage 4, #8 stages 1–3 and 6', graph='claim:ortho.signature', ref='H1-1')
T('T-H1-TWO-ZEROS', 'H1-2: "equals zero" can encode two different relationships',
  'They are interesting precisely because "equals zero" can encode two different geometric relationships.', G3, U, 'established', 'established',
  norm='⟨u, v⟩_M = 0 (orthogonality) and q_M(v) = 0 with v ≠ 0 (null vector, indefinite M) are distinct and never merged.',
  pro=[('card:S12b', 'light ray orthogonal to itself'), ('card:B1d', 'null vector'), ('card:S1a', 'orthogonality')],
  acts=['I', 'V'], ui='none yet (claim ortho.null-later exists but is not on screen)', graph='claim:ortho.null-later', ref='H1-2')
T('T-BEYOND-EUCLID-0', '"Anything beyond Euclidean is a representation" (original wording)',
  'and anything beyond euliciden is a repsentation from representation theory.', P, U, 'historical-conjecture', 'hypothesis',
  con=[(f'doc:{G2}', 'Nadia, Gate 2 answer 7: "the sentence itself is too absolute and should not be treated as a theorem"')],
  sup='T-BEYOND-EUCLID', acts=['IV', 'V'], audit=('partial', 'kept only inside the H1 quotation'), graph='H1 (inside its words)', ref='prompt §1, H1')
T('T-BEYOND-EUCLID', 'Unseen geometries are accessed through representations',
  'When a geometry cannot be directly seen in ordinary Euclidean space, mathematics gives us a representation through which its relationships can still be studied.', G2, U, 'hypothesis', 'hypothesis',
  variants=[('It is better to say that we access many abstract or higher-dimensional geometries through representations.', G2)],
  pro=[('card:O1b', 'a projection does not preserve angles'), ('card:S6', 'G = I built without a picture'), ('card:O2c', 'inner products of waves as arrow dot products')],
  supers='T-BEYOND-EUCLID-0', acts=['IV', 'V'], objs=['obj.pair'], ui='#8 stages 4–8 (restructure stage 8)',
  audit=('partial', 'objective.md terms list only'), graph='objective.md "beyond Euclidean"', ref='Gate 2 answer 7')
T('T-SEE-ORTHOGONALITY', 'Seeing orthogonality where it cannot be drawn',
  'your stated goal is to show the pattern that lets us see orthogonality when we cannot see it directly.', SPEC, U, 'open-question', 'open',
  pro=[('card:O1e', ''), ('card:S6', ''), ('card:O1f', 'domain is part of the inner product')],
  variants=[('how to get an orthonormal basis when you can\'t visualize it. There must be a way to find that.', P),
            ('The interactive should reveal the pattern that tells us this is orthogonality even when our eyes cannot directly see it.', G4)],
  acts=['IV'], ui='#8 stages 4–8', audit=('preserved', 'H1 "orthogonality detector"'), graph='H1', ref='spec Block 2; prompt §1b')
T('T-INF-FIN-0', '"Infinite things converge, finite things don\'t" (original wording)', "Infinite things converge, finite things don't.", P, U, 'historical-conjecture', 'hypothesis',
  con=[(f'doc:{G2}', 'Nadia, Gate 2 answer 2: "I am not claiming that finite things do not converge"'), ('card:C8c', 'FAIL kept: pointwise vs mean-square')],
  sup='T-INF-FIN', acts=['VI', 'VIII'], audit=('partial', 'mentioned in H1 clarifications; no record'), graph=None, ref='prompt §1b')
T('T-INF-FIN', 'An indefinitely extendable process approaching a finite structure',
  'I am interested in how an indefinitely extendable process can approach or define a bounded or finite structure.', G2, U, 'open-question', 'open',
  pro=[('card:C8c2', 'Fourier partial sums: mean-square convergence, RMS ~ N^(-1/2)'), ('card:S7', 'Bessel bound')],
  con=[('card:C8c', 'FAIL kept: the overshoot at a jump never shrinks (convergence depends on the measure)')],
  supers='T-INF-FIN-0', acts=['VI', 'VIII'], ui='none (Act VI, mean-square convergence)', audit=('partial', 'H1/H3 clarifications only'), ref='Gate 2 answer 2')
T('T-RELATIONSHIP-RIDDEN', 'Structure lives in relationships', 'the structure I am interested in seems to live in relationships among objects, transformations, and invariants, rather than in individual numbers considered alone.', G2, U,
  'philosophical-exploration', 'open', bounds=['A guiding intuition, never stated as a theorem (Gate 2 answer 5).'], acts=['I–IX'],
  audit=('partial', 'objective.md terms list'), graph='objective.md "relationship ridden"', ref='Gate 2 answer 5')

# ── H2 and representation ────────────────────────────────────────────────────────────────────────
T('T-H2', 'H2: a pattern of representations and how they develop', line_from(P, 'second i want to prove that due to this geometry'), P, U, 'hypothesis', 'hypothesis',
  pro=[('card:S3', 'shift becomes phase'), ('card:S2b', 'Parseval'), ('card:S11', 'Fourier transform as quarter-turn'), ('card:B5a2', 'what is lost: phase')],
  bounds=['H2-3: false if no consistent structural relationship appears; failures are kept (several families may result).'],
  acts=['II', 'III', 'IV', 'V'], ui='#7 and #8 (pattern rows); Chapter I indirectly', graph='H2, claim:H2.pattern', ref='H2',
  target=dict(targetStatement='Construct the common architecture: object → representation → transformation → invariant → decomposition → geometry across the specified domains, and determine the precise categorical/algebraic conditions under which two examples instantiate the same structure.'))
T('T-REPRESENTATION', 'R1: different descriptions, one object?', 'Can apparently different descriptions become the same object under the correct representation?', RD, U, 'open-question', 'hypothesis',
  variants=[('Are these different objects, or different descriptions of one object?', MM),
            ('I am investigating whether this repeated architecture occurs broadly enough to constitute a meaningful common structure.', G3)],
  norm='Object → representation → transformation → invariant → decomposition → geometry (H2-1, Level 3; universality Level 4).',
  pro=[('card:S3', ''), ('card:S2b', ''), ('card:O2c', 'one signal, three representations, one inner product')],
  bounds=['Not every representation must follow the pattern (Gate 3, H2-1).'], acts=['II', 'III', 'IV'],
  ui='#7 → #8 hand-off carries one signal through representations', audit=('partial', 'H2-1 holds the pattern; the question itself had no record'), graph='H2', ref='R1; Master Map #5; H2-1')
T('T-VISIBLE-HIDDEN', 'R1: what became visible, hidden, preserved or lost?', 'What became visible, hidden, preserved or lost?', RD, U, 'open-question', 'open',
  variants=[('What became visible, and what information became hidden or lost?', G3.replace('gate3_decisions', 'gate3_decisions'))],
  pro=[('card:B5a2', 'phase lost to the symmetry defect')], acts=['I–IX'], ui='every stage\'s "what became visible / hidden" notes',
  audit=('preserved', 'built into every stage as notes'), graph='frame notice', ref='R1; H2-1')
T('T-H2-ROLES', 'H2-2: the form defines, orthogonality organizes', 'Both, but they play different roles.', G3, U, 'derived-connection', 'derived',
  norm='M (or the inner product) defines the geometry; orthogonality organizes independent directions inside it; A†MA = M says which relationships survive. Not the same concept.',
  pro=[('card:C1b', 'preservation ⟺ AᵀMA = M')], acts=['IV', 'V'], audit=('preserved', 'H2.md'), graph='H2', ref='H2-2')

# ── H3, infinity, time, the circle ──────────────────────────────────────────────────────────────
T('T-H3', 'H3: the relationship-ridden geometry', line_from(P, 'leading to my theory of the relationship ridden equation'), P, U, 'hypothesis', 'hypothesis',
  pro=[('card:C8a', 'wrapping'), ('card:C8d', 'quasi-periodic'), ('card:C9c', 'boost → shear as c → ∞')],
  bounds=['One universal common geometry: Level 4. A common schema with subclasses: Level 3 (Gate 3).'],
  acts=['VIII'], graph='H3', ref='H3',
  target=dict(targetStatement='Classify maps from unbounded parameters into constrained geometries, their orbit/recurrence/limit structure, and identify a common invariant formulation covering the examples Nadia specified.'))
T('T-SCHEMA', 'Unbounded parameter through a constrained geometry: a schema with subclasses',
  'an unbounded parameter interacting with or being represented through a constrained geometry', G3, U, 'hypothesis', 'hypothesis',
  variants=[('are wrapping, quasi-periodic recurrence and boundary approach different subclasses of a common schema?', RD),
            ('what happens when an unbounded parameter is represented through bounded geometry?', RD)],
  pro=[('card:C8a', 'wrapping: exact returns'), ('card:C8d', 'quasi-periodic: near returns only'), ('card:C8b', 'boundary approach'), ('card:S5b', 'tanh bound')],
  con=[('card:C8c', 'FAIL kept (mean-square vs pointwise)')],
  bounds=['The three behaviours are opposite at infinity (exact return, near return, convergence): "useful evidence, not a problem" (Gate 3).'],
  acts=['VIII'], audit=('preserved', 'H3-2 and C8'), graph='H3, C8', ref='R7; H3-2')
T('T-TIME-CIRCLE-0', 'Time + finite circle: "sines and cosines converge to infinity" (original wording)',
  'Adding an infinite object like time to a finite circle geometry makes sines and cosines converge to infinity.', MM, U, 'historical-conjecture', 'hypothesis',
  con=[('card:C8a', '|e^{iωt}| = 1 for all t: sine and cosine stay in [−1, 1]'), (f'doc:{G2}', 'Nadia, Gate 2 answer 6: "That wording in Master Map #18 is misleading"')],
  sup='T-TIME-CIRCLE', acts=['VIII'], audit=('title-only', 'quoted only in the report (AMB-15); no record'), ref='R7; Master Map #18')
T('T-TIME-CIRCLE', 'Unbounded time, bounded circle, bounded values',
  'an unbounded time parameter combined with a finite circular geometry generates an indefinitely continuing sine/cosine evolution whose values remain bounded', G2, U, 'hypothesis', 'hypothesis',
  norm='t ∈ ℝ unbounded; t ↦ (cos ωt, sin ωt) ∈ S¹ bounded; cycles → ∞ while values stay in [−1, 1].',
  pro=[('card:C8a', '')], supers='T-TIME-CIRCLE-0', acts=['II', 'VIII'], ui='none yet (stage 5 will show t ↦ e^{iωt})', graph='H3', ref='R7; Gate 2 answer 6')
T('T-TWO-INFINITIES', 'Two kinds of infinity', 'So there are potentially two very different kinds of infinity:', G2, U, 'open-question', 'open',
  norm='t → ∞ and the number of completed cycles → ∞, while sin ωt, cos ωt ∈ [−1, 1].', acts=['VIII'], audit=('partial', 'H3 clarifications'), graph='H3', ref='Gate 2 answer 6')
T('T-ANALOGUES', 'Deeper analogues of an unbounded quantity through a bounded geometry',
  'The question I want to investigate is whether this type of relationship—an unbounded quantity expressed through a bounded geometry—has deeper mathematical analogues elsewhere.', G2, U, 'open-question', 'open',
  pro=[('card:C8d', ''), ('card:C8b', '')], acts=['VIII'], audit=('partial', 'H3 clarifications'), graph='H3, C8', ref='Gate 2 answer 8')
T('T-TIME-BOUND', 'Can time be bound to finite geometry, and paired with another infinite structure?',
  'From there, introduce your questions about whether time could be bound to finite geometry and paired with another infinite structure.', MM, U, 'open-question', 'open',
  variants=[('can time be bound to finite geometry?', RD), ('can finite geometry be paired with another infinite structure?', RD)],
  acts=['VIII'], audit=('title-only', 'Master Map #18 only'), ref='R7; Master Map #18')
T('T-NATURE-OR-DESCRIPTION', 'Nature, or only our descriptions?', 'Do these relationships tell us something about nature, or only about our mathematical descriptions of it?', MM, U,
  'philosophical-exploration', 'open', acts=['VIII', 'IX'], audit=('missing', 'Master Map closing questions only'), ref='Master Map (after the time investigation)')
T('T-C-ROLES', 'R19: the two roles of c', 'That transition between the two roles is what interests me.', G3, U, 'hypothesis', 'hypothesis',
  variants=[('the same parameter linking these roles may reveal something structurally important.', RD)],
  norm='Within a theory c helps define the invariant structure; across theories c → ∞ moves toward the Newtonian boundary. spacetime geometry ≠ model-manifold geometry.',
  pro=[('card:C9a', ''), ('card:C9b', 'form degenerates'), ('card:C9c', 'boost → shear'), ('card:S5d', 'Galilean limit'), ('source:research/sources/quinn2023.md', 'c → ∞ as a model-manifold boundary (PDF pending, P-2)')],
  bounds=['C9 is not inferred from the paper; the two manifolds are linked only through c (Gate 3).'], acts=['VIII'], audit=('preserved', 'H3-1, C9'), graph='H3, C9', ref='R19; H3-1')
T('T-MANIFOLDS', 'Three manifolds kept apart', 'That is different from spacetime as a manifold in relativity.', G2, U, 'established', 'established',
  pro=[('definition:docs/objective.md', 'a distinction of terms fixed by Nadia, not a result')],
  norm='prediction/model manifold ≠ spacetime manifold ≠ possible representation manifold.', acts=['VII', 'VIII'], audit=('preserved', 'objective.md'), ref='Gate 2 answer 4')
T('T-REP-MANIFOLD', 'A manifold of representations', 'It is also different from a possible future manifold of representations, which is something we may investigate but have not yet formally defined.', G2, U,
  'open-question', 'open', acts=['V', 'VII'], audit=('partial', 'objective.md says "undefined so far"; no record'), ref='Gate 2 answer 4')

# ── zero, cancellation, Chapter I ───────────────────────────────────────────────────────────────
T('T-BACKBONE-PRIMARY', 'Primary backbone', 'What appears as zero, cancellation, or balance in one representation may be evidence of an underlying geometric constraint.', RD, U, 'hypothesis', 'hypothesis',
  pro=[('card:Z3b', 'a zero that marks a distinguished place'), ('card:Q1a', 'a zero that hides a distinction')],
  con=[('card:Z5a', 'boundary: some zeros carry no hidden structure (|x|² = 0 only at 0)'), ('card:Z4b', 'boundary: preserving zero resultants identifies no particular form')],
  acts=['I–IX'], ui='Chapter I (investigation link)', graph='backbone.primary', ref='backbone')
T('T-BACKBONE-SECONDARY', 'Secondary backbone', 'If physically different phenomena satisfy the same mathematical relation under an appropriate representation, they may be instances of the same structural law rather than merely analogous systems.', RD, U, 'hypothesis', 'hypothesis',
  pro=[('card:Z3d', 'bears on it: Pair A shares a zero-sum form; this does not show a shared law')],
  bounds=['AMB-18: without a restriction on "appropriate", any two systems can be given representations satisfying one relation.'],
  acts=['I', 'II'], graph='backbone.secondary', ref='backbone')
T('T-BACKBONE-INVARIANT', 'Invariant-geometry direction', 'If a relation is preserved under the admissible transformations of a space, that relation may encode part of the geometry of that space.', RD, U, 'hypothesis', 'hypothesis',
  pro=[('card:C1b', 'preserving B for all pairs ⟺ AᵀMA = M'), ('card:S9', '')],
  con=[('card:Z4b', 'boundary: the zero-resultant relation is preserved by maps that preserve no nonzero form')],
  acts=['V'], graph='backbone.invariant', ref='backbone')
for i, (lvl, ev, st) in enumerate([
    ('zero may arise from nonzero structure', [('card:Z1a2', ''), ('card:Z2a', ''), ('card:Q1a', '')], 'established'),
    ('zero may encode balance', [('card:Z3a', ''), ('card:Z3b', '')], 'established'),
    ('zero may define an exact relation', [('card:S1a', 'orthogonality'), ('card:B2a', '')], 'established'),
    ('zero may identify a distinguished structural feature', [('card:Z3b', 'R_CM')], 'established'),
    ('one zero may correspond to multiple hidden configurations', [('card:Z1b', ''), ('card:Z2b2', ''), ('card:Q1d', ''), ('card:Q1f', '')], 'established'),
    ('a preserved zero relation may indicate a geometric constraint', [('card:C1b', '')], 'hypothesis'),
    ('knowledge about one zero system may help interrogate another', [('card:Z3d', 'shared zero-sum form (Pair A)')], 'hypothesis')], 1):
    T(f'T-ZERO-L{i}', f'R2 level {i}', lvl, RD, U, 'established' if st == 'established' else 'hypothesis', st, pro=ev,
      variants=[('The positive and negative contributions to the integral cancel even though there are no literal arrows at 90°.', G4)] if i == 3 else [],
      con=[('card:Z4b', 'boundary')] if i == 6 else [], acts=['I'] if i != 3 else ['I', 'IV'],
      ui={1: 'Chapter I stages 1, 2, 2b', 2: 'Chapter I stage 3', 3: '#8 (Act IV)', 4: 'Chapter I stage 3', 5: 'Chapter I stages 1, 2, 2b, 3b', 6: 'none (Act V)', 7: 'Chapter I stage 3b (transfer questions)'}[i],
      audit=('partial', 'spread across the backbone, the tracked idea and Pair A; not separate records'), ref=f'R2.{i}')
T('T-HIDDEN-FAMILY', 'Tracked idea: one zero, a family of hidden states', 'A single observed zero may correspond to a nontrivial family of hidden states.', RD, U, 'hypothesis', 'hypothesis',
  pro=[('card:Z1b', ''), ('card:Z2b2', ''), ('card:Q1d', '')], con=[('card:Z5a', 'boundary: not every zero has a family behind it')],
  acts=['I'], ui='Chapter I', graph='idea.hidden-family', ref='Chapter I',
  target=dict(targetStatement='For each zero condition, characterize the complete zero-producing set and determine what invariants, equivalence relations and distinguishable quantities survive inside it.',
         requiredObjects=['a measurement F', 'its zero set Z = {x : F(x)=0}'],
         proofObligations=['the dimension/structure of Z', 'invariants on Z', 'transformations preserving Z', 'distinguishable quantities within Z',
                           'conditions under which x is identifiable from F(x)=0', 'additional observables required when it is not',
                           'whether the zero condition defines or implies a stronger structure']))
T('T-ZERO-GENERAL-0', 'General zero statement (first wording)', 'F(x)=0 \\not\\Rightarrow x\\text{ is uniquely determined}', RD, U, 'historical-conjecture', 'hypothesis',
  con=[('card:Z5a', 'too universal: F(x) = |x|² is 0 only at x = 0')], sup='T-ZERO-GENERAL', acts=['I'], audit=('preserved', 'was the claim text until A1'), graph='claim:zero.not-identifying (old text)', ref='A1')
T('T-ZERO-GENERAL', 'A zero need not determine the state', 'A zero-valued measurement need not uniquely determine the underlying state.', RD, U, 'derived-connection', 'derived',
  variants=[('In the measurement maps examined here, one zero output can correspond to multiple underlying states or configurations.', RD)],
  pro=[('card:Z1b', ''), ('card:Z2b2', ''), ('card:Q1a', ''), ('card:Q1d', '')], con=[('card:Z5a', 'boundary: sometimes it does')],
  supers='T-ZERO-GENERAL-0', acts=['I'], ui='Chapter I stage 2b (formal block)', graph='claim:zero.not-identifying', ref='A1')
T('T-QUANTUM-ZERO', 'Same S_z zero, different states', 'A zero-valued observable can fail to uniquely determine a quantum state.', RD, U, 'established', 'established',
  pro=[('card:Q1a', ''), ('card:Q1b', ''), ('card:Q1c', ''), ('card:Q1e', '')], acts=['I'], objs=['obj.spin-pair'], ui='Chapter I stage 2b', graph='rel.sz-zero-two-states', ref='stage 2b')
T('T-RECONSTRUCT', 'Reconstructing the hidden state from the zero alone (not established)', 'the hidden state can be reconstructed from the zero alone', RD, U, 'open-question', 'open',
  bounds=['Stage 2b does not establish it: the second observable S² supplied the information.'], acts=['I'], ui='Chapter I stage 2b (stated as not established)', audit=('missing', 'added at A5'), graph='rel.sz-zero-two-states.doesNotEstablish', ref='A5')
for qid, words, lab, aud in [
    ('Q.cancellation-information', 'What information is contained in the cancellation state itself?', 'Stage 2 question', 'preserved'),
    ('Q.zero-inference', 'What can be inferred from the zero state while it remains zero?', 'Pair A question', 'preserved'),
    ('Q.zero-generators', 'When presented with a zero-valued result, can we determine the hidden rules or structure that generated that zero?', 'Pair A, longer-term', 'preserved'),
    ('Q.pairA', 'Are proton cancellation and mass balance two unrelated constructions, or do they admit a common representation?', 'Stage 3 question', 'preserved'),
    ('Q.pairA-transfer', 'Does the shared zero-sum form preserve enough additional structure for knowledge from one system to constrain the other?', 'Pair A, after the shared form', 'missing'),
    ('Q.zero-distinguishable', 'When a measurement is zero, what additional structure remains distinguishable?', 'Stage 2b question', 'preserved'),
    ('Q.zero-internal-inference', 'What information, if any, can be inferred from the internal structure of a zero state without perturbing it into a nonzero state?', 'Hiding vs recovering', 'missing'),
    ('Q.additional-relations', 'What additional preserved relations are needed to identify the geometry?', 'Chapter I limitation', 'preserved'),
    ('Q.zero-geometry-broader', 'Is zero preservation sufficient to identify a geometry in some broader sense?', 'Chapter I limitation, broader', 'missing')]:
    T(f'T-{qid}', lab, words, RD, U, 'open-question', 'open', acts=['I'], ui='Chapter I (research questions)' if qid not in ('Q.additional-relations', 'Q.zero-geometry-broader') else 'none (research note)',
      audit=(aud, 'added at this audit' if aud == 'missing' else 'graph statement'), graph=qid, ref='Chapter I')
T('T-ZERO-WEAK-0', 'Zero preservation "too weak to identify a unique geometry" (first wording)', 'Therefore preservation of a zero resultant alone is too weak to identify a unique geometry.', RD, U, 'historical-conjecture', 'derived',
  con=[('card:Z4b', 'Z4b proves less: only that no particular preserved form is identified')], sup='T-ZERO-NO-FORM', acts=['I', 'V'], audit=('preserved', 'was claim zero.too-weak until A3'), ref='A3')
T('T-ZERO-NO-FORM', 'Zero preservation identifies no particular form', 'zero-resultant preservation alone does not identify a particular preserved bilinear or metric form.', RD, U, 'established', 'established',
  pro=[('card:Z4a', ''), ('card:Z4b', '')], supers='T-ZERO-WEAK-0', acts=['I', 'V'], ui='none (research note; would answer part of TQ-5)', graph='claim:zero.no-preserved-form', ref='A3')
T('T-PAIRA-SHARED', 'Pair A shared algebraic form', 'Under the representations currently used, both systems can exhibit a zero-sum vector relation.', RD, U, 'established', 'established',
  pro=[('card:Z2a', ''), ('card:Z2b2', ''), ('card:Z3d', '')],
  bounds=['Does not establish: the same physical mechanism; the same geometry; that mass explains proton cancellation; that all information transfers.'],
  acts=['I'], objs=['obj.distribution', 'obj.moments'], ui='Chapter I stage 3b (pair card)', audit=('missing', 'added at A2'), graph='pair.A.sharedAlgebraicForm', ref='A2')
for k in range(1, 7):
    T(f'T-TQ-{k}', f'Transfer question TQ-{k}', None, RD, U, 'open-question', 'open', acts=['I'], ui='Chapter I stage 3b', graph=f'pair.A TQ-{k}', ref=f'TQ-{k}')

# ── orthogonality as a clue; mass and waves; matter and fields ──────────────────────────────────
T('T-ORTHO-CLUE', 'R3: why orthogonality matters', 'can encode an exact geometric relationship; orthogonal decompositions remove cross terms; quadratic magnitude becomes additive; and under appropriate transformations the zero relation can be preserved.', RD, U, 'hypothesis', 'hypothesis',
  pro=[('card:S1a', ''), ('card:O1e', ''), ('card:S2b', ''), ('card:O1a', 'rotation preserves the zero relation')], bounds=['Not "energy is orthogonal" (R3).'],
  acts=['IV', 'V'], ui='#7, #8', audit=('partial', 'inside H1 and H1-1'), graph='H1', ref='R3')
T('T-ORTHO-DEEPER', 'R3: orthogonality as the first visible example of something deeper?', 'Is orthogonality only the first visible example of a deeper invariant relationship?', RD, U, 'open-question', 'open',
  pro=[('card:C1b', 'orthogonality is one preserved bilinear relation among several kinds')], acts=['IV', 'V'], audit=('missing', ''), ref='R3')
T('T-MASS-WAVE', 'R4: mass-like and wave-like descriptions', 'mass-like and wave-like descriptions may be different representations of a deeper common principle.', RD, U, 'hypothesis', 'hypothesis',
  variants=[('Wave and particle descriptions are linked representations of one physical structure.', SPEC)],
  pro=[('card:S12', 'E² = p²c² + m²c⁴ is the Lorentz form of four-momentum (one constraint in two sets of variables)')],
  bounds=['Not claimed: that classical mass distributions (stage 3) are waves; not a generic wave–particle duality lesson.'],
  acts=['VIII'], ui='none (spec Block 10)', audit=('title-only', 'spec Block 10 and "matter/wave discussion" in connection fields'), ref='R4; spec Block 10',
  target=dict(targetStatement='Find a common representation in which the mass-like and wave/field-like objects satisfy the same mathematical relation. Specify the maps, state space, invariant and transformation law required for exact equivalence.',
         requiredMaps=['R_m: the mass-like system → the common codomain', 'R_w: the wave-like system → the common codomain'],
         proofObligations=['the common codomain', 'the maps R_m and R_w', 'the invariant I', 'the transformations preserving I', 'a theorem proving the equivalence']))
T('T-MASS-WAVE-Q', 'R4: one relation for mass-like and wave-like phenomena?', 'Can mass-like and wave-like phenomena be represented so that the same underlying relation governs both?', RD, U, 'open-question', 'open',
  pro=[('card:S12', '')], acts=['VIII'], audit=('missing', ''), ref='R4')
T('T-MATTER-FIELD', 'R18: matter as one form of deeper structure', 'matter-like objects and waves/fields may be different forms/representations of deeper structure.', RD, U, 'hypothesis', 'hypothesis',
  variants=[("Also preserve Nadia's intuition that matter itself has wave/field descriptions.", RD)],
  pro=[('card:S12', 'dispersion relation (mass shell)'), ('uncarded', 'QFT field description, particle excitations, wave packets: established physics, not yet carded here')],
  bounds=['The standard QFT account supports part of it; it does not replace the broader question of a common geometry.'],
  acts=['VIII'], audit=('title-only', '"matter/waves" appears only in spec connection fields'), ref='R18; R4')

# ── periodicity and geometry (Pair B) ───────────────────────────────────────────────────────────
T('T-STAR', '★ rule-bound periodicity', '★ Any geometrical object that is bound by rules can be periodic.', RD, U, 'hypothesis', 'hypothesis',
  pro=[('card:C8a', 'the circle: exact return'), ('card:B7a', 'a cyclic shift of three samples repeats with period 3')],
  con=[('card:C8d', 'boundary: quasi-periodic winding never returns exactly'), ('card:S5b', 'boundary: tanh stays bounded and never repeats')],
  bounds=['Whether these limit ★ depends on "bound by rules", "periodic" and "can be" (AMB-7 a–c).'], acts=['II', 'VIII'], graph='stmt.rule-bound-periodicity', ref='R5',
  target=dict(targetStatement='What exact geometric/dynamical conditions guarantee periodicity, recurrence, quasi-periodicity or bounded orbit behavior?'))
T('T-GEOM-RULES', 'What observable rules arise from a geometry?', 'What observable rules arise because an object is constrained by a particular geometry?', RD, U, 'open-question', 'open', acts=['II', 'V', 'VIII'], graph='Q.geometry-rules', ref='R5')
T('T-PAIRB', 'R5: spatial and temporal periodicity, shared rules?', 'a physically observable periodic structure in space and a wave/phase structure in time may be manifestations of shared geometric rules.', RD, U, 'hypothesis', 'hypothesis',
  variants=[('This sets up your larger question about periodicity in the physical world without assuming everything must be periodic.', MM)],
  acts=['II'], audit=('partial', 'Pair B recorded only "repeated behavior"'), graph='pair.B', ref='R5; Master Map #3',
  target=dict(targetStatement='Given spatial periodic structure and temporal/phase periodic structure, identify the most general geometric condition that generates repeated behavior in both, and determine whether the commonality is group action, compactness, symmetry, orbit closure, or another exact structure.'))
T('T-CIRCLE-NOT-THESIS', 'R6: the circle is one case, not the thesis', 'circle ≠ all periodicity', RD, U, 'derived-connection', 'derived',
  variants=[('Every new geometry should be interrogated for what behavior follows from its own constraints.', RD)],
  pro=[('card:B7a', 'periodicity from a cyclic group acting on ℝ³'), ('card:C8d', 'recurrence on a torus')], acts=['II', 'V', 'VIII'], audit=('partial', 'AMB-7 and DR-3 only'), ref='R6')

# ── higher dimensions, prediction space, information geometry ──────────────────────────────────
T('T-BEYOND-3D', 'R8: relationships that cannot be drawn in three dimensions', 'Could a mathematical description contain relationships that cannot be represented directly in our familiar three spatial dimensions?', MM, U, 'open-question', 'open',
  variants=[('Could a mathematical description contain relationships that cannot be represented directly in familiar three-dimensional space?', RD)],
  pro=[('card:O1b', 'shadows disagree with the true angle'), ('card:O2c', 'ℝ⁴ and L² inner products'), ('card:S6', '')], acts=['IV', 'VII'], ui='#8 stages 5–8 for ℝ⁴ and L²',
  audit=('title-only', 'Master Map #16'), ref='R8; Master Map #16')
T('T-PREDICTION-INFINITE', 'R8: an infinite prediction space?', 'Then introduce your question about a possible infinite prediction space.', MM, U, 'open-question', 'open',
  variants=[('Could prediction space be effectively/inherently infinite-dimensional?', RD)], acts=['VII'], audit=('title-only', 'Master Map #16'), ref='R8')
T('T-4D-EVENTS', 'R8: a four-dimensional description in which events exist together', 'This display could introduce your speculative connection to a four-dimensional description in which events exist together, while carefully distinguishing a model\'s prediction space from physical spacetime.', MM, U,
  'philosophical-exploration', 'open', bounds=['prediction-space geometry ≠ spacetime geometry; that they differ does not erase the speculative connection.'], acts=['VII', 'VIII'], audit=('title-only', 'Master Map #16'), ref='R8')
T('T-INFOGEO', 'R9: information geometry of models', 'prediction manifold, Fisher metric, stiff / sloppy directions, exact null direction, model boundaries, effective models', RD, U, 'open-question', 'open',
  pro=[('card:S14b', 'weak: roughly even log spacing (tolerance set after seeing data)'), ('source:research/sources/quinn2023.md', '')],
  con=[('card:S14a', 'FAIL kept: span 3.1 decades, not > 4')], bounds=['"Exact null direction" has three possible readings (AMB-14).'],
  acts=['VII'], audit=('title-only', 'spec Blocks 11–14, 17 and the Act VII title'), ref='R9')
T('T-C7', 'R9 / C7: coefficient spectra and sloppy spectra', 'possible structural relation/analogy between coefficient spectra / Bessel-type decomposition and Fisher/sloppy spectra', RD, A, 'open-question', 'open',
  pro=[('card:S7', 'Bessel (not evidence for sloppiness)'), ('card:S14b', 'weak')], con=[('card:S14a', 'FAIL kept')],
  bounds=['Bessel concerns one vector\'s coefficients; the sloppy spectrum is a metric\'s eigenvalues (Gate 3, C7). Kept as an open analogy.'],
  acts=['VII'], audit=('preserved', 'C7.md (Claude-proposed in the prompt; kept by Nadia at Gate 3)'), graph='C7', ref='R9; C7')

# ── magnitude, phase, wavelets, scattering, sensitivity ─────────────────────────────────────────
T('T-MAGPHASE', 'R10: preserved energy, what else distinguishes?', 'If a norm/energy-like quantity is preserved, what information still distinguishes representations?', RD, U, 'open-question', 'open',
  variants=[('This directly introduces your question: If mathematical energy is preserved, what other information distinguishes two representations?', MM)],
  pro=[('card:B5a2', 'the symmetry defect sees amplitudes, not phases'), ('card:S2b', ''), ('card:P1c', 'equal power spectra, different signals')], acts=['VI'], audit=('title-only', 'spec Block 16, Master Map #12, Act VI title'), ref='R10; Master Map #12')
T('T-SAME-SPECTRUM', 'R10: same power spectrum, different signals', 'Same power spectrum can preserve second-order information while failing to determine the original signal.', RD, U, 'established', 'established',
  pro=[('card:P1a', 'power spectrum = DFT of the autocorrelation (second-order information)'), ('card:P1b', 'a shift keeps the spectrum'), ('card:P1c', 'two signals unrelated by shift, reversal or sign share it'), ('card:B5a2', 'phase is invisible to the symmetry defect')],
  acts=['VI'], audit=('title-only', 'spec Block 16'), ref='R10')
T('T-WAVELETS', 'R11: wavelets, scattering and what survives averaging', 'wavelet zero/cancellation, zero crossings, modulus before averaging, higher scattering paths, what survives averaging, DYADIC PACKETS', RD, U, 'open-question', 'open',
  bounds=['No definitions, cards or sources in the repository yet; nothing is imported to define them.'], acts=['VI'], audit=('title-only', 'Act VI title only; zero crossings and scattering paths were missing'), ref='R11')
T('T-DYADIC', 'R11: DYADIC PACKETS', '`DYADIC PACKETS` is an explicit user-priority research term.', RD, U, 'open-question', 'open',
  bounds=['Definition OPEN (AMB-13). The literal term is kept; no conventional meaning is assumed.'], acts=['VI'], audit=('title-only', 'named in the report only'), ref='R11')
T('T-SENSITIVITY', 'R17: sensitivity relative to representation', 'patterns of invariance and deformation may characterize sensitivity relative to representation, scale, location and transformation.', RD, U, 'hypothesis', 'open',
  pro=[('card:B5b', 'the symmetry defect measures deformation under a transformation'), ('card:S14b', 'weak')],
  bounds=['Not renamed "uncertainty": whether sensitivity and uncertainty are related is OPEN (spec Block 8 is the separate Fourier uncertainty result).'],
  acts=['VI', 'VII'], audit=('missing', 'not in the repository before this audit'), ref='R17')

# ── pairs, perception, representation's limits, energy ──────────────────────────────────────────
T('T-CONJUGACY', 'R12: physical pairs and conjugacy', 'Do observable physical pairings or complementarities reflect deeper symmetry analogous to mathematical conjugacy?', RD, U, 'hypothesis', 'open',
  variants=[('Once the mathematical relationship is established, introduce your broader question about physical pairs and whether observable relationships reflect deeper symmetry in nature.', MM)],
  pro=[('uncarded', 'f̂(−k) = conj f̂(k) for real f: used in #7, no card yet')], acts=['V', 'VIII'], audit=('title-only', 'Master Map #17; report AMB-16'), ref='R12; Master Map #17')
T('T-SUBCONSCIOUS', 'R13: underlying structure vs what is consciously accessible', 'Your subconscious analogy could appear as an optional philosophical exploration of the distinction between an underlying structure and what is consciously accessible.', MM, U,
  'philosophical-exploration', 'open', variants=[('underlying structure vs what is consciously accessible / observable', RD)],
  bounds=['Not neuroscience; optional in the learner experience.'], acts=['VIII'], audit=('missing', 'Master Map #17 only'), ref='R13; Master Map #17')
T('T-PERCEPTION-RELATIVITY', 'R14: relational perception and relativity', 'Then invite the visitor to explore your proposed connection between relational human perception and physical relativity.', MM, U,
  'philosophical-exploration', 'open', variants=[('observer-dependent physical measurement in relativity and relational aspects of human perception', RD)],
  pro=[('card:S5c', 'anchor: the interval x² − c²t² is the same for every observer')], bounds=['Not claimed to be the same phenomenon.'], acts=['VIII'], audit=('missing', 'Master Map #19 only'), ref='R14; Master Map #19')
T('T-MATH-BOUNDARIES', 'R15: can the boundaries of mathematical representation be expanded?', 'This provides a way to approach your response to Einstein: If mathematics has boundaries imposed by the way it represents nature, can those boundaries be expanded?', MM, U,
  'philosophical-exploration', 'open', variants=[('If mathematics has boundaries imposed by how it represents nature, can those boundaries be expanded?', RD)], acts=['VIII', 'IX'], audit=('title-only', 'Master Map #19'), ref='R15')
T('T-REP-COMPLETE', 'R15: does a representation preserve everything meaningful?', 'Does a mathematical representation preserve everything meaningful about the natural phenomenon it describes?', RD, U, 'philosophical-exploration', 'open',
  variants=[('We now understand mathematical representations well enough to ask whether they preserve everything about the natural phenomena they describe.', MM)],
  pro=[('card:B5a2', 'a representation that loses phase')], acts=['VI', 'VIII'], audit=('title-only', 'Master Map #19'), ref='R15')
T('T-ENERGY-MEANING', 'R16: what squared magnitude means', 'What does squared mathematical magnitude actually mean when it is not literally physical energy?', RD, U, 'open-question', 'open',
  variants=[('This is where your question about mathematical energy as strength, magnitude, or importance becomes central.', MM),
            ("For example, the L² norm in Fourier could be energy, it could be strength, and in information geometry it's distance in units of noise.", P)],
  pro=[('card:S2b', 'Parseval keeps ‖x‖²'), ('card:B4a', '')], bounds=['‖x‖₂² may be called signal energy; physical energy depends on the variable and units (spec Block 18).'],
  acts=['IV', 'VI', 'IX'], audit=('partial', 'spec Block 18 and prompt §2 as a units warning'), ref='R16; Master Map #11')
T('T-ORIGIN-NORM-ZERO', 'Origin, norm, squared norm, zero and the identity matrix', 'This creates a visual explanation for your earlier questions about the relationship between the origin, norm, squared norm, zero, and the identity matrix.', MM, U,
  'open-question', 'open', pro=[('card:S4e', 'M = I keeps x² + y²')], acts=['I', 'V'], audit=('missing', 'Master Map #14 only'), ref='Master Map #14')
T('T-ZERO-ROLES', 'Zero has different roles', 'What carries forward: Zero has different roles depending on the mathematical structure in which it appears.', MM, U, 'derived-connection', 'derived',
  variants=[("This would be a useful place to incorporate Osgood's remark about zero, after checking the original lecture.", MM)],
  pro=[('card:Z1a2', ''), ('card:Z3b', ''), ('card:Q1a', ''), ('card:S12b', '')], bounds=["Osgood's remark is not yet checked against the lecture."],
  acts=['I'], ui='Chapter I', audit=('title-only', 'Master Map #13; now Chapter I'), ref='Master Map #13')
T('T-BOUNDS-THEME', 'The "bounds / sine-cosine / same structure in another representation" theme', 'Critical for your “bounds / sine-cosine / same structure in another representation” theme.', SPEC, U, 'hypothesis', 'open',
  pro=[('card:S2b', ''), ('card:C8a', '')], acts=['II', 'IV', 'VIII'], audit=('missing', 'spec Block 4 connection field only'), ref='spec Block 4')
T('T-ENERGEO', 'R20: Energeo', 'Can energy behavior be represented in a space where hidden balances, null relations, and invariants become geometrically explicit?', RD, U, 'open-question', 'open',
  variants=[('Can energy behavior be represented in a space where hidden balances, null relations and invariants become geometrically explicit?', RD)],
  bounds=['A downstream test domain, not evidence for anything upstream; parked until Nadia asks.'], acts=['IX'], graph='Q.energeo', ref='R20')
T('T-ENERGEO-INTENT', 'R20: is energy behavior represented in the most informative way?', 'conventional analytics commonly summarize totals, baselines, forecasts or deviations; Energeo asks whether energy behavior itself is being represented in the most informative mathematical way.', RD, U,
  'open-question', 'open', variants=[('This could become your first connection to NASA-relevant finite-energy problems without requiring you to know the eventual application in advance.', MM)],
  acts=['IX'], audit=('missing', 'the intention was not recorded'), ref='R20; Master Map #20')

# ── connections (assistant-proposed, adopted at Gate 3) ─────────────────────────────────────────
for cid, title, st, cards, acts in [
    ('C1', 'One preservation equation, many geometries', 'established', ['C1b', 'S9'], ['V']),
    ('C2', 'Conservation = invariant form, infinitesimally', 'established', ['S9b', 'C2a'], ['V']),
    ('C3', 'The sign of the invariant decides bounded vs unbounded', 'derived', ['S4a', 'S10'], ['VIII']),
    ('C4', 'Fourier as a change of representation: two different settings', 'established', ['S2a', 'S11'], ['III', 'V']),
    ('C5', '"The quadratic equaling 0" has two faces', 'established', ['S12b', 'B1d'], ['I', 'V']),
    ('C6', 'Projection by symmetry averaging is orthogonal projection', 'established', ['S13', 'B7b'], ['IV', 'V']),
    ('C8', 'Unbounded parameters can generate different kinds of constrained asymptotic geometry', 'hypothesis', ['C8a', 'C8d', 'C8b'], ['VIII']),
    ('C9', 'indexes a family of invariant forms', 'established', ['C9a', 'C9c'], ['VIII'])]:
    T(f'T-{cid}', f'Connection {cid}', title, f'research/connections/{cid}.md', A, 'derived-connection' if st != 'established' else 'established', st,
      pro=[(f'card:{c}', '') for c in cards], con=[('card:C8c', 'FAIL kept')] if cid == 'C8' else [],
      acts=acts, audit=('preserved', f'{cid}.md'), graph=cid, ref=cid)

PAIR_A = proof_target('Starting from the established common zero-sum form Σv_i = 0, identify all additional invariants/relations of the mass system that can be translated into mathematically meaningful tests on the directional cancellation system.',
                      requiredObjects=['the established shared form Σv_i = 0 (pair.A.sharedAlgebraicForm)'])
next(r for r in R if r['id'] == 'T-Q.pairA-transfer')['proofTarget'] = PAIR_A

out = ROOT / 'research' / 'theories.json'
tq = {q['id']: q for p in json.loads((ROOT / 'research' / 'graph.json').read_text())['pairs'] for q in p['transferQuestions']}
for r in R:
    if r['id'].startswith('T-TQ-'):
        q = tq[r['id'][2:]]
        r['words'] = q['text']; r['label'] = f"{q['id']}: {q['title']}"
out.write_text(json.dumps({
    'about': 'Theory registry (provenance layer of the research graph, with each theory\'s proof program). Every record keeps the original wording; evidence against a theory is attached, never used to delete it. Generated from research/tools/theories_source.py; checked by test/theories.test.js; rendered to research/theory_coverage.md.',
    'kinds': ['hypothesis', 'open-question', 'derived-connection', 'philosophical-exploration', 'historical-conjecture', 'established'],
    'statuses': ['established', 'derived', 'hypothesis', 'open'],
    'researchModes': ['theorem-target'],
    'researchOutcomes': list(OUTCOMES),
    'researchNote': 'status is the reported epistemic status (how much is proved now). researchMode is how the theory is investigated (docs/research_method.md): every record is a theorem target, whatever its status. proofTarget is the proof program, filled gradually; lastResearchOutcome stays null until a theorem-seeking pass reports one of researchOutcomes.',
    'theories': R}, ensure_ascii=False, indent=2) + '\n')
print(len(R), 'records')
