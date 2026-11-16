"""Authoring source for research/theories.json (the theory registry). Run once to (re)generate the JSON:
    python3 research/tools/theories_source.py
After that the JSON is the record; edit it directly or edit here and regenerate. test/theories.test.js checks every
quote against its source document, and research/tools/build_coverage.mjs renders research/theory_coverage.md."""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
P, G2, G3, MM, SPEC, RD = ('docs/claude_code_prompt.md', 'docs/gate2_answers.md', 'docs/gate3_decisions.md',
                           'docs/Interactive_Master_Map.extracted.md', 'docs/Mathematical_Basis_Interactive_Design_Spec.md', 'docs/restructure_decisions.md')
G4 = 'docs/gate4_decisions.md'
AP = 'docs/author_philosophy.md'
CX = 'research/constructions/r4_tetrahedral_zero.md'
ZC = 'research/constructions/zero_connector_linear.md'
CM = 'research/constructions/centering_comparison.md'
CQ = 'research/constructions/quantum_additive_cancellation.md'
F4 = 'research/constructions/four_spin_zero.md'
MS = 'research/constructions/mass_second_moment.md'
WM = 'research/constructions/weighted_mass_centering.md'
H1, H2, H3 = 'research/hypotheses/H1.md', 'research/hypotheses/H2.md', 'research/hypotheses/H3.md'

def line_from(path, start):
    for ln in (ROOT / path).read_text().splitlines():
        s = ln.lstrip('> ').strip()
        if s.startswith(start):
            return s
    raise SystemExit(f'not found in {path}: {start}')

R = []
def T(id, label, words, src, origin, kind, status, *, norm=None, variants=(), pro=(), con=(), bounds=(), sup=None, supers=None,
      acts=(), objs=(), audit=('preserved', ''), ui='none', graph=None, ref=None, target=None, build=None, related=(), history=()):
    R.append(dict(id=id, label=label, words=words, variants=[dict(words=w, source=s) for w, s in variants],
                  normalizedStatement=norm, origin=origin, kind=kind, status=status,
                  evidenceFor=[dict(ref=r, note=n) for r, n in pro], evidenceAgainst=[dict(ref=r, note=n) for r, n in con],
                  boundaries=list(bounds), supersededBy=sup, supersedes=supers, relatedActs=list(acts), relatedObjects=list(objs),
                  relatedCards=sorted({r.split(':', 1)[1] for r, _ in list(pro) + list(con) if r.startswith('card:')}),
                  sourceDocs=[src] + [s for _, s in variants], auditRef=ref, audit=dict(before=audit[0], note=audit[1]),
                  interactive=ui, graphRecord=graph,
                  # research execution (docs/research_method.md): separate from the reported status above
                  researchMode='theorem-target', researchDirection='outside-in',
                  construction=construction(**build) if build else None,
                  proofTarget=proof_target(**target) if target else None, related=list(related),
                  history=[dict(date=d, change=c) for d, c in history], relatedActsRev3=[], assessment=None))

OUTCOMES = ('proved', 'known-theorem', 'constructive-realization', 'special-case', 'exact-obstruction', 'proof-obligation', 'candidate-new-class')
def proof_target(targetStatement, source=RD, **kw):
    """A proof program. Fields fill in gradually; an empty list is an unstarted obligation, not a verdict."""
    pt = dict(targetStatement=targetStatement, targetSource=source, requiredObjects=[], requiredMaps=[], candidateInvariants=[],
              requiredEquivalences=[], proofObligations=[], exactSearchQueries=[], knownTheorems=[], unresolvedObligations=[],
              previousTargets=[], lastResearchOutcome=None)
    for k, v in kw.items():
        assert k in pt, k
        pt[k] = v
    assert pt['lastResearchOutcome'] in (None,) + OUTCOMES
    return pt

def construction(sequence=(), questions=(), doNotReason=(), known=(), exhaustive=False, basis=None, source=RD):
    """The primary (outside-in) program: construct first, classify second. knownExamples are never assumed exhaustive
    unless a stated theorem (basis) makes them so (anti-closure rule)."""
    assert not exhaustive or basis, 'an exhaustive list needs its theorem'
    return dict(sequence=list(sequence), questions=list(questions), doNotReason=list(doNotReason),
                knownExamples=dict(items=list(known), exhaustive=exhaustive, basis=basis), candidateNewClasses=[], source=source)

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
  con=[('card:C8d', 'a quasi-periodic winding never returns exactly: this limits ★ only if "periodic" means exact return; under B-NONEXHAUSTIVE its near-returns are kept as a possible member of a broader class'),
       ('card:S5b', 'tanh stays bounded and never repeats: a boundary under the exact-return reading')],
  bounds=['Whether these limit ★ depends on "bound by rules", "periodic" and "can be" (AMB-7 a–c).'], acts=['II', 'VIII'], graph='stmt.rule-bound-periodicity', ref='R5',
  target=dict(targetStatement='derive the behavior generated by a geometry first',
              previousTargets=[dict(targetStatement='What exact geometric/dynamical conditions guarantee periodicity, recurrence, quasi-periodicity or bounded orbit behavior?',
                                    targetSource=RD, replacedBecause='it chose among known categories; ★ must not be reduced to choosing among existing definitions (outside-in clarification, item 7)')]),
  build=dict(sequence=['develop geometric rule → observe repeated/structured behavior → derive its representation → test whether Fourier analysis describes one class of that behavior'],
             questions=['and only afterwards ask whether existing mathematics calls that behavior periodic, recurrent, quasi-periodic, closed, etc.'],
             doNotReason=["Fourier is known → therefore Nadia's periodic structure must be Fourier"],
             known=['exact periodic orbit', 'closed orbit', 'quasi-periodicity', 'recurrence', 'bounded repetition']),
  related=['B-NONEXHAUSTIVE', 'B-FINITE-INFINITE', 'B-ORTHO-FORM', 'T-FIXED-RELATIONS-Q'])
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


# ── outside-in backbone (2026-11-11) ─────────────────────────────────────────────────────────────
NEW_AUDIT = ('new', 'stated at the outside-in clarification (2026-11-11)')
BR = 'backbone-rule'
MR, GOV = 'method-rule', 'governance'   # method / governance rules carry no epistemic status (2026-11-12)
SPLIT = '2026-11-12'
T('B-OUTSIDE-IN', 'Outside-in geometry construction', 'Construct geometry from observed relations first; compare it to existing mathematical structures second.', RD, U, MR, GOV,
  history=[(SPLIT, 'reclassified from backbone-rule / HYPOTHESIS to method-rule / governance: a governance rule, not a claim requiring proof (Nadia)')],
  variants=[('observe / collect relations → construct a geometry → discover the rules of that geometry → determine which known structures it contains', RD),
            ('The intended eventual result is a geometry that can act as: a guide for existing structures rather than merely a guide to existing structures.', RD),
            ('Construct first. Classify second.', RD), ('Look from the outside in.', RD)],
  norm='Method / governance rule: the primary research direction. The intended result (a guide for existing structures) is an aim, not a claim requiring proof.',
  bounds=['Theorem-seeking is kept as the secondary mode (existing-theorem scan); it never redefines the constructed geometry.'],
  build=dict(sequence=['phenomena / zero / cancellation / relation → collect exact behavior → construct representation → construct geometry → infer its internal rules → test those rules across systems → only then compare against existing mathematics'],
             doNotReason=['user theory → search existing mathematics → identify nearest theorem → fit theory into theorem']),
  acts=['I–IX'], audit=NEW_AUDIT, ui='none (method)', related=['B-NONEXHAUSTIVE', 'T-GOR-MEANING'], ref='outside-in 0, 27')
T('B-ZERO-PRESERVE', 'Zero Preservation Rule', 'Do not perturb a defining zero merely to obtain information. Investigate the structure of the system while the zero remains zero.', RD, U, MR, GOV,
  history=[(SPLIT, 'split: this record is the method rule (method-rule / governance); the hypothesis it carried moved to B-ZERO-LOSS with its wording (Nadia: do not use one record for governance and a claim)')],
  variants=[('Do not leave the defining zero merely to make the system observable.', RD), ('zero-preserving interrogation', RD),
            ('find information inside the zero', RD), ('the complete structure of the system while its defining relation remains zero', RD),
            ('Preserve the zero. Investigate its geometry.', RD), ('Do not destroy the zero to understand it. Look inside its structure.', AP)],
  norm='Method / governance rule: while F(x) = 0 defines the state, research performs zero-preserving interrogation (other observables, internal relations, transformations that stay inside the zero, the larger space it arises from). It does not depend on whether B-ZERO-LOSS is proved.',
  pro=[('card:Q1g', 'example of the rule in use: measuring S² keeps S_z = 0 for every S_z = 0 state'),
       ('card:Q1h', 'the state may change inside the eigenspace while the zero is preserved: zero-preserving, not "non-perturbing"'),
       ('card:Z2c', 'example: a transformation that stays inside the zero set (a pair twist)')],
  bounds=['Leaving the zero is allowed only in a separate, labelled experiment that studies what is lost by leaving it.',
          '"Do not perturb zero" never means "do not inspect the state": inspecting it more deeply is the program.',
          'Preserving the defining zero relation does not mean nothing in the state changes (Q1h).'],
  build=dict(sequence=['zero remains zero → examine its internal structure → examine its geometry → examine other relations/invariants/measurements → examine transformations that remain inside the zero state → examine the larger space from which the zero state arises'],
             doNotReason=['hidden zero → perturb system → obtain visible nonzero response → infer hidden state'],
             known=['other observables', 'internal relations', 'pairwise relationships', 'higher-order quantities', 'symmetry', 'transformations', 'invariants', 'configuration-space structure',
                    'dimensional structure', 'origin structure', 'higher-dimensional representations', 'families of zero-producing configurations', 'relations between those configurations']),
  acts=['I–IX'], audit=NEW_AUDIT, ui='Chapter I keeps every zero intact; stage 2b\'s S² measurement is zero-preserving interrogation',
  related=['T-Q.zero-internal-inference', 'T-RECONSTRUCT', 'T-LOOK-INSIDE', 'B-HIGHER-GEOMETRY', 'T-HIDDEN-FAMILY'], ref='outside-in 1–2, 27')
T('B-HIGHER-GEOMETRY', 'The larger generating geometry', 'Hidden information in a lower-dimensional manifestation may be encoded in the larger geometry that generates it.', RD, U, 'hypothesis', 'hypothesis',
  variants=[('The most likely way to find the hidden information is to look at the bigger picture: the geometry of the origin geometry — for example, the four-dimensional geometry behind a three-dimensional manifestation.', RD),
            ('the zero/lower-dimensional state is carrying structure inherited from a larger geometry.', RD),
            ('observed lower-dimensional state → larger generating geometry → relations invisible in the lower-dimensional manifestation.', RD)],
  pro=[('card:O1b', 'ℝ⁴ seen through projections: the shadows disagree with the true angle, so a relation exact in the larger space is not visible in its lower-dimensional views')],
  bounds=['The larger geometry is derived from the behavior, not chosen because an existing theory already uses it.',
          'Not to be identified in advance with spacetime, the prediction/model manifold or a representation manifold (objective.md terms).'],
  build=dict(sequence=['zero appears informationally incomplete in lower-dimensional representation → determine what larger geometry would make it complete → derive required properties of that larger geometry → THEN compare with Hilbert-space or other known constructions'],
             questions=['If this is true, what must the larger geometry look like?', 'Which relations in the observed state would be shadows/restrictions of relations there?',
                        'Which quantities would become distinguishable in the larger geometry?', 'What transformations in the larger geometry leave the observed zero unchanged?',
                        'What information is lost when the larger structure is viewed only through the lower-dimensional representation?',
                        'Can multiple observed zero states correspond to different locations/orientations/relations in the larger geometry?'],
             doNotReason=['quantum mechanics uses Hilbert space → therefore the answer is Hilbert space'],
             known=['projection', 'embedding', 'section', 'quotient', 'fiber', 'shadow', 'boundary', 'higher-dimensional state space', 'configuration space', 'Hilbert space']),
  acts=['foundational'], audit=NEW_AUDIT, related=['B-ZERO-PRESERVE', 'T-BEYOND-3D', 'T-REP-MANIFOLD', 'T-ZERO-ORTHOGONAL-C', 'T-4D-EVENTS', 'T-MANIFOLDS'], ref='outside-in 3–4, 24, 27')
T('B-NONEXHAUSTIVE', 'Known structures are examples, not the boundary', 'Existing named mathematical structures are known examples, not assumed exhaustive classes.', RD, U, MR, GOV,
  history=[(SPLIT, 'reclassified from backbone-rule / HYPOTHESIS to method-rule / governance (Nadia); the earlier normalized "premise (HYPOTHESIS)" sentence was dropped')],
  variants=[('We do not know how many kinds of periodic relationships or pairs exist. Assuming the known cases are exhaustive is itself a limitation the project is intended to overcome.', RD),
            ('Known structures are examples, not the boundary of the search space.', RD), ('DO NOT CLOSE THE SEARCH SPACE WITH KNOWN MATHEMATICS', RD),
            ('Fourier pairs are examples. They are not the universe of possible pairs.', RD), ('Circle periodicity is an example. It is not the universe of possible periodic behavior.', RD)],
  norm='Method / governance rule: a list of possibilities is either shown logically exhaustive by a stated theorem, or marked "These are known examples, not an exhaustive classification for this project." A behavior fitting no category is kept as a candidate new class.',
  bounds=['Where a classification is a theorem within stated assumptions, the rule asks for the assumptions to be stated, not for the theorem to be doubted.'],
  acts=['I–IX'], audit=NEW_AUDIT, ui='none (method)', related=['T-STAR', 'T-PAIRB', 'T-CONJUGACY', 'B-OUTSIDE-IN'], ref='outside-in 6–7, 25, 27')
T('B-FINITE-INFINITE', 'Finite rule, infinite structure, finite form', 'An indefinitely continuing/infinite structure may be governed by rules manifested through a finite geometry.', RD, U, 'hypothesis', 'hypothesis',
  variants=[('An infinite structure can be bound/generated by rules that manifest as a finite shape.', RD)],
  pro=[('card:C8a', 'the circle: θ ∈ ℝ unbounded, |e^{iθ}| = 1, exact return'), ('card:G1c', 'the compass trace closes while θ runs over all of ℝ')],
  bounds=['The circle is one known case; the theory is not reduced to it (Nadia).', 'One universal common geometry stays Level 4 (H3).'],
  build=dict(questions=['What kinds of finite geometries can encode or generate indefinitely continuing structure through their internal rules?',
                        'What makes a geometric form stable enough that its rules persist while the structure continues indefinitely?'],
             known=['circle (exact return)', 'torus winding (quasi-periodic near-return)', 'bounded interval under tanh (boundary approach)']),
  acts=['foundational', 'II', 'VIII'], audit=NEW_AUDIT, ui='proposed: "A Shape From One Rule" (not built)',
  related=['T-H3', 'T-SCHEMA', 'T-TIME-CIRCLE', 'T-STAR', 'T-ANALOGUES', 'T-INF-FIN', 'T-FINITE-GEOMETRIES-Q', 'T-STABLE-FORM-Q', 'T-IRREVERSIBLE-FORMATION'], ref='outside-in 16, 27')
T('B-PART-WHOLE', 'What the part is to the whole', 'The object/observer is not merely located in the larger structure; it is a constituent of it. The research question is therefore what the part is to the whole geometry.', RD, U, 'philosophical-exploration', 'hypothesis',
  history=[('2026-11-12b', 'placed at the end of Act III with the governing question "What is the visible object/result to the larger geometry that generated it?"; the R4 construction is a part/whole example, not a fractal')],
  variants=[('People are also part of the fractal. We are not simply “in” a fractal as external observers. We are in one as constituents of it.', AP),
            ('The question is not “Where on the fractal are we?” The question is “What are we to the fractal?”', AP), ('part ↔ whole geometry', AP),
            ('What is the visible object/result to the larger geometry that generated it?', RD)],
  bounds=['The word fractal is kept. Not yet translated into fractal dimension, Mandelbrot coordinates, scale invariance, self-similarity, renormalization or cosmology; these may later become tests (known examples, not an exhaustive classification for this project).'],
  build=dict(questions=['What mathematical properties would the project\'s geometry need in order for Nadia\'s part/whole “we are to the fractal” intuition to become exact?'], source=AP),
  acts=['foundational'], audit=NEW_AUDIT, related=['T-FRACTAL-PROPERTIES-Q', 'T-SPACE-EXPLORATION', 'T-EXISTENCE-ZERO', 'T-IRREVERSIBLE-FORMATION'], ref='outside-in 10, 18, 27')
T('B-ORTHO-FORM', 'Organized orthogonality and form', 'Organized orthogonality may participate in the generation or persistence of geometric form and its global rules.', RD, U, 'hypothesis', 'hypothesis',
  variants=[('What role does the organization of orthogonality play in allowing a geometry to form and obey global rules?', RD),
            ('Could the amount, organization, or continuity of orthogonality possessed by a shape relate to global rules such as π, sine, cosine, periodicity, closure, or other geometric behavior?', RD),
            ('It is that a very simple constraint generates the entire shape.', RD)],
  pro=[('card:G1a', 'the established example: radius ⊥ tangent at every point of the compass circle'),
       ('card:G1d', 'an ingredient, not an answer: for a differentiable curve x: I → ℝⁿ, x·x′ = 0 for all t ∈ I iff |x(t)| is constant on each connected component of I (fixed distance from the origin ↔ position orthogonal to velocity)')],
  history=[(SPLIT, 'evidence note tightened: the loose G1b reading ("for any plane curve … iff …") replaced by the precise G1d statement; G1b stays on the ledger')],
  bounds=['"Every smooth curve has a normal" is a local fact and not an answer (Nadia).', 'Not concluded: that orthogonality alone caused the circle (Nadia).'],
  build=dict(questions=['How much of this shape\'s global behavior is encoded in the relationships that remain fixed while it is generated?',
                        'Which fixed relationships made the shape possible?', 'Which global rules are consequences of those fixed relationships?',
                        'What geometric constraints produce the circular parameterization?', 'Which quantities depend on the fixed-radius rule?',
                        'Which depend specifically on Euclidean metric structure?', 'Where does π enter?', 'Where do sine/cosine enter?',
                        'Which of these relations generalize to other geometries?']),
  acts=['foundational', 'II', 'IV'], audit=NEW_AUDIT, ui='Act II stage 4 contract, "A Shape From One Rule" (docs/act_map.md; not built)',
  related=['T-H1', 'T-ZERO-ORTHOGONAL-D', 'T-CIRCLE-ORTHO', 'T-FIXED-RELATIONS-Q', 'B-FINITE-INFINITE', 'T-ORTHO-DEEPER', 'T-ORTHO-CLUE'], ref='outside-in 14, 27')
T('T-CIRCLE-ORTHO', 'The compass circle: radius ⊥ tangent', 'At each boundary point of a smooth circle: radius ⊥ tangent.', RD, U, 'established', 'established',
  variants=[("x(θ)·x'(θ)=0.", RD), ('This exact relation may be used as an established example.', RD)],
  pro=[('card:G1a', ''), ('card:G1c', 'the trace closes'), ('card:G1d', 'fixed distance from the origin ↔ position orthogonal to velocity, on each connected component')],
  acts=['foundational', 'II'], audit=NEW_AUDIT, ui='Act II stage 4 contract (not built)', ref='outside-in 14')
T('T-FIXED-RELATIONS-Q', 'What the fixed relations encode', 'How much of this shape\'s global behavior is encoded in the relationships that remain fixed while it is generated?', RD, U, 'open-question', 'open',
  acts=['foundational', 'II'], audit=NEW_AUDIT, ui='proposed: closing question of "A Shape From One Rule"', related=['B-ORTHO-FORM', 'B-FINITE-INFINITE'], ref='outside-in 15')
T('T-FINITE-GEOMETRIES-Q', 'Which finite geometries generate continuing structure?', 'What kinds of finite geometries can encode or generate indefinitely continuing structure through their internal rules?', RD, U, 'open-question', 'open',
  acts=['foundational', 'II', 'VIII'], audit=NEW_AUDIT, related=['B-FINITE-INFINITE'], ref='outside-in 16')
T('T-STABLE-FORM-Q', 'What makes a form stable?', 'What makes a geometric form stable enough that its rules persist while the structure continues indefinitely?', RD, U, 'open-question', 'open',
  acts=['foundational', 'VIII'], audit=NEW_AUDIT, related=['B-FINITE-INFINITE', 'T-IRREVERSIBLE-FORMATION'], ref='outside-in 16')
T('T-ZERO-ORTHOGONAL', 'Seed: "0 is orthogonal"', '0 is orthogonal.', RD, U, 'hypothesis', 'open',
  norm='A seed with four readings (A–D), kept as separate construction branches; none is chosen as the intended deeper claim.',
  acts=['foundational', 'I', 'IV'], audit=NEW_AUDIT, related=['T-ZERO-ORTHOGONAL-A', 'T-ZERO-ORTHOGONAL-B', 'T-ZERO-ORTHOGONAL-C', 'T-ZERO-ORTHOGONAL-D', 'T-H1'], ref='outside-in 13')
T('T-ZERO-ORTHOGONAL-A', '"0 is orthogonal", reading A', 'The zero vector satisfies ⟨0,v⟩=0 for every v.', RD, U, 'established', 'established',
  pro=[('card:G0a', 'for the dot product and every bilinear form')], acts=['foundational'], audit=NEW_AUDIT, ref='outside-in 13A')
T('T-ZERO-ORTHOGONAL-B', '"0 is orthogonal", reading B', 'An inner-product result of zero identifies orthogonality: ⟨u,v⟩=0.', RD, U, 'established', 'established',
  pro=[('definition:research/hypotheses/H1.md', 'orthogonality is defined by ⟨u, v⟩ = 0'), ('card:S1a', 'equivalent to the Pythagorean relation')], acts=['foundational', 'IV'], audit=NEW_AUDIT, ref='outside-in 13B')
T('T-ZERO-ORTHOGONAL-C', '"0 is orthogonal", reading C', 'A cancellation state may be generated by a larger orthogonal organization even when the visible cancellation is not itself simply a pair of perpendicular vectors.', RD, U, 'hypothesis', 'hypothesis',
  acts=['foundational', 'I'], audit=NEW_AUDIT, related=['B-HIGHER-GEOMETRY', 'T-HIDDEN-FAMILY'], ref='outside-in 13C')
T('T-ZERO-ORTHOGONAL-D', '"0 is orthogonal", reading D', 'Orthogonality may participate in generating stable geometric form.', RD, U, 'hypothesis', 'hypothesis',
  acts=['foundational', 'II'], audit=NEW_AUDIT, related=['B-ORTHO-FORM'], ref='outside-in 13D')
T('T-EXISTENCE-ZERO', 'Existing things as zeros', 'People, and more generally things that exist, can be thought of analogously as zeros: what appears as one formed thing may be the cancellation, balance, or organization of many things underneath it.', AP, U, 'philosophical-exploration', 'hypothesis',
  variants=[('Can an apparently singular existing object be represented as the stable zero/balance of a richer set of relations?', AP)],
  bounds=['Not the Stage 3 mass example, and not "existence = center of mass" (Nadia).'],
  build=dict(questions=['Can an apparently singular existing object be represented as the stable zero/balance of a richer set of relations?'], source=AP),
  acts=['foundational'], audit=NEW_AUDIT, related=['B-PART-WHOLE', 'T-HIDDEN-FAMILY', 'B-ZERO-PRESERVE'], ref='outside-in 9')
T('T-SPACE-EXPLORATION', 'Exploring space from inside the structure', 'Humans treat space exploration as exploring something outside our world. But if we are constituents of the same larger structure, exploring outward remains an exploration of the structure of which we are already a part.', AP, U, 'philosophical-exploration', 'open',
  variants=[('If we are part of the fractal, it is impossible to explore the fractal without continually encountering the structure that also produced us.', AP)],
  bounds=['Not a cosmological claim yet.'], acts=['foundational'], audit=NEW_AUDIT, related=['B-PART-WHOLE'], ref='outside-in 11')
T('T-LOOK-INSIDE', 'Looking inside oneself, looking inside zero', 'A Buddhist-style idea says that looking inside oneself holds the key. In this project, looking inside zero plays an analogous role.', AP, U, 'philosophical-exploration', 'open',
  variants=[('Do not destroy the zero to understand it. Look inside its structure.', AP)],
  bounds=['Not a mathematical proof. Kept for a future "About the Author / Why Zero?" section.'], acts=['foundational'], audit=NEW_AUDIT, related=['B-ZERO-PRESERVE'], ref='outside-in 12')
T('T-IRREVERSIBLE-FORMATION', 'Irreversible geometric formation', 'Our existence may only be possible because geometry produces something that becomes irreversibly formed, while still belonging to an endlessly continuing/fractal structure.', AP, U, 'philosophical-exploration', 'open',
  variants=[('irreversible geometric formation', AP)],
  bounds=['Definition OPEN. Candidate meanings, none selected: thermodynamic irreversibility, entropy production, topological protection, symmetry breaking, measurement collapse, hysteresis. These are known examples, not an exhaustive classification for this project.'],
  acts=['foundational'], audit=NEW_AUDIT, related=['B-FINITE-INFINITE', 'B-PART-WHOLE', 'T-STABLE-FORM-Q'], ref='outside-in 17')
T('T-FRACTAL-PROPERTIES-Q', 'What would make "what are we to the fractal" exact?', 'What mathematical properties would the project\'s geometry need in order for Nadia\'s part/whole “we are to the fractal” intuition to become exact?', AP, U, 'open-question', 'open',
  acts=['foundational'], audit=NEW_AUDIT, related=['B-PART-WHOLE'], ref='outside-in 18')
T('T-GOR-MEANING', 'Direction for "Geometry of Representation" (not locked)', 'Construct a geometry capable of showing how apparently complete objects/states are manifestations of deeper relationships, and use that geometry as a guide across existing mathematical and physical structures.', RD, U, MR, GOV,
  history=[(SPLIT, 'reclassified from backbone-rule / OPEN to method-rule / governance: a project-definition direction, not a claim')],
  bounds=['Not locked as the final definition (Nadia).'], acts=['I–IX'], audit=NEW_AUDIT, ui='none (project definition)', related=['B-OUTSIDE-IN'], ref='outside-in 20')


# ── first outside-in construction (2026-11-12) ───────────────────────────────────────────────────
C_AUDIT = ('new', 'first outside-in construction (2026-11-12)')
T('B-ZERO-LOSS', 'Leaving a zero may destroy information', 'Leaving a natural zero/cancellation state may destroy information encoded in the relations that generated that zero.', RD, U, 'hypothesis', 'hypothesis',
  variants=[('Perturbing a natural zero state can destroy information encoded in the relationships that produced that zero, even when the perturbation appears to make the system more observable.', RD)],
  bounds=['No card yet: nothing in the repository shows information destroyed by leaving a zero.', 'The method rule (B-ZERO-PRESERVE) does not depend on this being proved.'],
  history=[(SPLIT, 'split out of B-ZERO-PRESERVE, which had carried this premise; its wording moved here unchanged')],
  acts=['I', 'III'], audit=C_AUDIT, related=['B-ZERO-PRESERVE', 'T-Q.zero-internal-inference', 'Q-R4-8'], ref='construction 2')
T('T-R4-TETRA', 'R4 construction: an orthogonal basis projects to a tetrahedral zero', 'An orthogonal basis in R^4 can project into a 3-dimensional subspace as four equal tetrahedral vectors whose sum is zero.', RD, 'established-support', 'established', 'established',
  norm='P = I − ¼11ᵀ; vᵢ = Peᵢ = eᵢ − ¼1 ∈ 1⊥; Σvᵢ = 0; ‖vᵢ‖² = ¾; vᵢ·vⱼ = −¼; uᵢ·uⱼ = −⅓; Gram G = I − ¼J = P, spectrum {1,1,1,0}; span = 1⊥.',
  pro=[(f'card:G2{c}', '') for c in 'abcdefgh'], acts=['III'], audit=C_AUDIT, ui='none (Act III; construction record)',
  related=['B-HIGHER-GEOMETRY', 'T-ZERO-ORTHOGONAL-C', 'T-R4-DERIVED', 'T-R4-STAGE2'], ref='construction 5.3')
T('T-R4-GENERAL', 'The same construction for every n', 'the same identities hold for every n ≥ 2', CX, 'established-support', 'established', 'established',
  norm='Pₙ = I − (1/n)11ᵀ, vᵢ = Pₙeᵢ: Σvᵢ = 0, ‖vᵢ‖² = (n−1)/n, vᵢ·vⱼ = −1/n, normalized −1/(n−1); vᵢ − vⱼ = eᵢ − eⱼ, so the vᵢ are a regular simplex in 1⊥.',
  pro=[('card:G2n', 'derived symbolically in n, checked exactly for n = 2..10'), ('card:G2j', 'pairwise equidistant and affinely spanning: a regular simplex')],
  bounds=['Derived inside the project; does not replace the R4 case, which stays the concrete bridge to Stage 2.'], acts=['III'], audit=C_AUDIT,
  related=['T-R4-TETRA', 'Q-R4-3', 'Q-R4-7'], ref='construction 16')
T('T-R4-DERIVED', 'Orthogonal organization → zero-sum organization (constructed example)', 'higher-dimensional orthogonal organization → lower-dimensional zero-sum organization', RD, U, 'derived-connection', 'derived',
  norm='In the constructed example: Σvᵢ = P(Σeᵢ) = P1 = 0 (the zero is the image of the one removed direction); the shadow\'s Gram matrix is P itself; vᵢ − vⱼ = eᵢ − eⱼ.',
  pro=[('card:G2c', 'the zero sum'), ('card:G2g', 'the shadow\'s Gram matrix is P'), ('card:G2j', 'differences survive exactly')],
  bounds=['For the constructed example only; not universal.', 'Not established: anything about physical protons or a physical fourth dimension.'],
  acts=['III'], audit=C_AUDIT, related=['T-R4-TETRA', 'B-HIGHER-GEOMETRY-CHAIN', 'T-ZERO-ORTHOGONAL-C'], ref='construction 5.3')
T('T-R4-STAGE2', 'Stage 2\'s tetrahedron is an exact realization of the R4 construction', 'Stage 2 tetrahedral cancellation ← exact realization of projected R4 orthonormal basis', CX, U, 'established', 'established',
  variants=[('Stage 2 is an exact coordinate realization of a configuration that is orthogonally equivalent to the projected R^4 construction.', RD)],
  history=[('2026-11-12b', 'precise wording adopted (Nadia): ORTHOGONALLY EQUIVALENT, not "exactly equivalent"; an isometry H → R^3 must be chosen')],
  norm='ORTHOGONALLY EQUIVALENT: under the isometry Φ: 1⊥ → ℝ³, x ↦ (h₁·x, h₂·x, h₃·x) with h₁ = ½(1,1,−1,−1), h₂ = ½(1,−1,1,−1), h₃ = ½(1,−1,−1,1), Φ(uᵢ) = TETRAᵢ with no permutation and no sign; Stage 2 starts at 1.6·TETRA.',
  pro=[('card:G2i', 'computed from the app\'s own TETRA')],
  bounds=['Chronology: the tetrahedron was first chosen for cancellation clarity (D3); the R4 projection construction was discovered later. Stage 2\'s history is not rewritten.'],
  acts=['I', 'III'], objs=['obj.moments'], audit=C_AUDIT, related=['T-R4-TETRA', 'T-HIDDEN-FAMILY'], graph='rel.r4-stage2-realization', ref='construction 5.4')
T('B-HIGHER-GEOMETRY-CHAIN', 'Construction-backed direction under B-HIGHER-GEOMETRY', 'zero output ← lower-dimensional relational structure ← higher-dimensional organization', RD, U, 'construction-backed-direction', 'hypothesis',
  norm='CONSTRUCTION-BACKED DIRECTION: one exact instance (the R4 orthogonal-source construction); not universal, not promoted to a theorem.',
  pro=[('card:G2c', 'one exact instance: the zero sum'), ('card:G2g', 'the lower-dimensional relational structure (Gram matrix) of that instance')],
  bounds=['One instance does not make the chain universal.', 'Not every case is assumed to be a projection.'],
  acts=['III'], audit=C_AUDIT, related=['B-HIGHER-GEOMETRY', 'T-R4-DERIVED', 'Q-R4-6', 'Q-R4-8'], ref='construction 8')
APPLY = '2026-11-12b'
QR4 = {  # resolved at the application pass (2026-11-12): status, evidence for, evidence against, outcome
    'Q-R4-1': ('established', [('card:G3b', 'with the source class known, everything survives except the sign of one normal and the ambient isometry'), ('card:G2j', 'differences survive exactly')],
               [('card:G4c', 'with no source class, only the Gram matrix survives; the removed relation is not determined')], 'proved'),
    'Q-R4-2': ('established', [('card:G3a', "Nadia's e_i = v_i + ½n is orthonormal"), ('card:G3b', 'unique up to ±n and the ambient isometry fixing the span'), ('card:G3n', 'every n')], [], 'proved'),
    'Q-R4-3': ('established', [('card:G2n', ''), ('card:G2j', 'pairwise equidistant, affinely spanning 1⊥')], [], 'proved'),
    'Q-R4-4': ('established', [('card:G3c', 'zero sum forces Gram ∝ I − J/n; equal Gram gives an isometry of spans')], [], 'proved'),
    'Q-R4-5': ('established', [('card:G2g', 'the full Gram'), ('card:G3d', 'an orthonormal source exists iff a multiple of the Gram is idempotent; the zero sum alone (G1 = 0) cannot guarantee it')], [], 'proved'),
    'Q-R4-6': ('established', [('card:G3d', 'two readings: any orthogonal projection of an orthonormal basis (tight Gram); or projection onto 1⊥ (regular simplices only, G3c)')], [], 'proved'),
    'Q-R4-7': ('open', [('card:G2k', 'every exact Stage 1 state is the n = 2 member'), ('card:G2i', "Stage 2's first state is the n = 4 member"), ('card:G4m', 'Stage 3 with equal masses at e_i gives the family')],
               [('card:G3d', "Stage 2's varied-magnitude states and Stage 3 in general are not members")], 'special-case'),
    'Q-R4-8': ('open', [], [], None)}
for qid, words, src, origin in [
    ('Q-R4-1', 'What information about the original orthonormal basis survives in the projected tetrahedral zero-sum configuration?', RD, U),
    ('Q-R4-2', 'Given only the tetrahedral zero-sum configuration in H, can the R^4 orthogonal-source construction be reconstructed uniquely, up to a natural equivalence?', RD, U),
    ('Q-R4-3', 'For n orthonormal basis vectors in R^n, project onto 1⊥. Does the resulting set always form a regular simplex in R^(n-1)?', RD, U),
    ('Q-R4-4', 'Does every regular simplex zero-sum configuration arise, up to orthogonal equivalence and scale, from this projection construction?', RD, U),
    ('Q-R4-5', 'What properties of the higher-dimensional source are encoded by Σ_i v_i = 0, versus by the stronger Gram-matrix structure G_ij = 3/4 (i = j), −1/4 (i ≠ j)?', RD, U),
    ('Q-R4-6', 'Which lower-dimensional zero-sum configurations do not admit an orthogonal-source construction of this type?', RD, U),
    ('Q-R4-7', 'Does the Chapter I sequence instantiate one family indexed by n?', CX, A),
    ('Q-R4-8', 'For other maps from a larger geometry, does a lower-dimensional zero always record a direction the map removes?', CX, A)]:
    st, pro, con, outcome = QR4[qid]
    hist = [] if qid == 'Q-R4-3' else ([(APPLY, f'resolved at the application pass: {st}' + (f', outcome {outcome}' if outcome else ''))] if qid != 'Q-R4-8' else
            [(APPLY, 'split (Nadia): the established linear statement is T-ZERO-CONNECTOR-LINEAR; the inverse problem is Q-R4-8-INVERSE. The wording "lower-dimensional zero" is kept as written; current wording: a zero in the lower-dimensional representation')])
    norm = {'Q-R4-2': 'PROVED UNDER EQUIVALENCE (ambient orthogonal transformation; vertex permutation; sign of the normal), assuming an orthonormal source and an orthogonal projection onto the span: f_i = v_i + w with |w| = ½, w ⊥ span.'}.get(qid)
    T(qid, f'R4 construction question {qid}', words, src, origin, 'open-question', st, pro=pro, con=con, norm=norm,
      target=dict(targetStatement=words, source=src, lastResearchOutcome=outcome) if outcome else None,
      sup='Q-R4-8-INVERSE' if qid == 'Q-R4-8' else None,
      acts=['III'], audit=C_AUDIT, related=['T-R4-TETRA'] + (['T-SIMPLEX-FAMILY'] if qid in ('Q-R4-3', 'Q-R4-7') else []), ref=f'construction {qid}', history=hist)

# ── the application pass (2026-11-12): connector, family, internal change, measurement branch ─────
A_AUDIT = ('new', 'application pass (2026-11-12)')
T('T-SIMPLEX-FAMILY', 'The dimension-indexed simplex family', 'R^n orthogonal basis → 1⊥ ≅ R^(n-1) → regular simplex with zero centroid/resultant.', RD, 'established-support', 'established', 'established',
  norm='n = 2 opposed pair; n = 3 equilateral 120°; n = 4 tetrahedron; n = 5 4-simplex; … Σv_i = 0, |v_i|² = (n−1)/n, v_i·v_j = −1/n, normalized −1/(n−1).',
  pro=[('card:G2n', ''), ('card:G2j', ''), ('card:G3c', 'every regular-simplex zero-sum configuration is in it'), ('card:G3n', 'reconstructible up to sign')],
  bounds=['Not every natural zero has this origin.'], acts=['III'], audit=A_AUDIT, related=['T-R4-GENERAL', 'Q-R4-7', 'Q-R4-3'], ref='application 8')
T('T-ZERO-CONNECTOR-LINEAR', 'Zero as connector: the linear case', 'source relation in ker L → zero in the target representation', RD, 'established-support', 'established', 'established',
  norm='For linear L: Σ L x_i = L(Σ x_i), so Σ L x_i = 0 iff Σ x_i ∈ ker L. With L known the source is determined mod ker L; with L unknown the zero alone does not determine the removed relation.',
  pro=[('card:G4a', ''), ('card:G4b', 'recoverability with L known')],
  bounds=['Does not establish T-ZERO-CONNECTOR in general.', 'The inverse problem without L is obstructed in general (G4c).', 'Nonlinear zeros (null vectors, |x|² = 0) are outside it.'],
  acts=['III'], audit=A_AUDIT, related=['T-ZERO-CONNECTOR', 'Q-R4-8-INVERSE'], ref='application 6–7')
T('T-ZERO-CONNECTOR', 'Zero as connector / interface (project hypothesis)', 'A zero/resultant may more generally function as an interface between information in a larger geometry and what appears in a lower-dimensional representation.', RD, U, 'hypothesis', 'hypothesis',
  variants=[('0 acts as a connector/interface between dimensional descriptions.', RD), ('Zero is a connector/interface, not automatically a lower-dimensional object.', RD),
            ('A zero may appear as a resultant in one representation while connecting to nonzero relations in a larger/source representation.', RD)],
  pro=[('card:G4a', 'the linear case, exact'), ('card:G4m', 'an independent system with the same structure (mass balance)'), ('card:G3b', 'the removed relation recoverable when the source class is known')],
  con=[('card:G4c', 'the zero alone does not determine whether or which source relation was removed; a zero can be inherited'), ('card:Z5a', '|x|² = 0 connects to no nonzero relation')],
  bounds=['Not established by the linear case.'], acts=['III', 'all'], audit=A_AUDIT, related=['T-ZERO-CONNECTOR-LINEAR', 'B-HIGHER-GEOMETRY', 'B-HIGHER-GEOMETRY-CHAIN'], ref='application 6')
T('Q-R4-8-INVERSE', 'The inverse problem: recover the removed relation without the map', 'Given only the target zero/configuration, and without already knowing L, can the removed source direction or larger geometry be recovered?', RD, U, 'open-question', 'open',
  pro=[('card:G3b', 'special case proved: orthonormal source, orthogonal projection: recovered up to sign'), ('card:G3n', 'every n')],
  con=[('card:G4c', 'exact obstruction without constraints on L or the source')],
  target=dict(targetStatement='Given only the target zero/configuration, and without already knowing L, can the removed source direction or larger geometry be recovered?', lastResearchOutcome='special-case'),
  supers='Q-R4-8', acts=['III'], audit=A_AUDIT, related=['Q-CONNECT-1', 'T-ZERO-CONNECTOR'], ref='application 7')
T('Q-CONNECT-1', 'Which source classes make the removed relation recoverable?', 'Which source classes, other than orthonormal sets, make the removed relation recoverable from the target zero alone?', ZC, A, 'open-question', 'open',
  acts=['III'], audit=A_AUDIT, related=['Q-R4-8-INVERSE'], ref='connector 10')
T('Q-CONNECT-2', 'A connector template for nonlinear zeros?', 'Is there a connector template for nonlinear zero conditions', ZC, A, 'open-question', 'open',
  acts=['III'], audit=A_AUDIT, related=['T-ZERO-CONNECTOR', 'T-H1-TWO-ZEROS'], ref='connector 10')
T('B-ZERO-INTERNAL-CHANGE', 'Change inside the same zero', 'What information can change, be destroyed, become distinguishable, or become inaccessible while the system remains inside the same defining zero condition?', RD, U, 'open-question', 'open',
  pro=[('card:Q1h', 'S² measured on |↑↓⟩ keeps S_z = 0 and changes the state'), ('card:W1d', 'the A–B coherence (1/2) becomes 0 while S_z = 0 holds'),
       ('card:W2c', 'the composition of the zero changes: ⟨S_z⁽¹⁾⟩ goes ħ/2 → 0 and ⟨S_z⁽²⁾⟩ −ħ/2 → 0 while S_z = 0 holds'),
       ('card:W2e', 'two incompatible zero-preserving interrogations: S² and S_z⁽¹⁾ both commute with S_z but not with each other'),
       ('card:W3a', 'for every S_z = 0 state, the expectation-level composition of the zero is ħ Re ρ_AB, removed by S² dephasing')],
  bounds=['Distinct from leaving the zero (B-ZERO-LOSS) and from state-preserving interrogation; the three operations are not merged.'],
  acts=['I', 'III'], audit=A_AUDIT, related=['B-ZERO-PRESERVE', 'B-ZERO-LOSS', 'B-JOINT-ALTERNATIVES'], ref='application 9')
T('B-JOINT-ALTERNATIVES', 'Information that destroys a joint relation (measurement branch)', 'Can obtaining one form of information destroy another relation that existed only while alternatives remained jointly represented?', RD, U, 'open-question', 'open',
  pro=[('card:W1a', 'two-path reference: the cross term is weighted by the marker overlap'), ('card:W1b', 'orthogonal markers (full which-path information) zero the cross term'),
       ('card:W1c', 'V² + D² = 1'), ('card:W1d', 'the same structure inside stage 2b, with the defining zero preserved'),
       ('card:W2d', 'exact overlap: the same dephasing map [[a, c], [c*, b]] → [[a, 0], [0, b]] on a two-sector decomposition, in both systems'),
       ('card:W2e', 'inside one zero: obtaining S² information destroys the S_z⁽¹⁾ definiteness and conversely')],
  bounds=['No claim that a conscious viewer causes collapse; the terms are measurement, interaction, which-path information.',
          'The double-slit / which-path model has no defining zero; it does not prove B-ZERO-LOSS.',
          'Kept apart: A leaving the defining zero; B changing the state while remaining inside the zero condition; C extracting information while preserving both zero and the relevant internal relation.', 'Not claimed to be the same mechanism as information loss at a natural zero; the exact relation is to be constructed first.', 'No physical data used.'],
  acts=['III'], audit=A_AUDIT, related=['B-ZERO-INTERNAL-CHANGE', 'B-ZERO-LOSS', 'T-H1-SIGNATURE'], ref='application 10')


# ── transfer pass (2026-11-12): Pair A bridge, WMC, the centering operator, quantum dephasing ─────
T_AUDIT = ('new', 'transfer pass (2026-11-12)')
T('T-PAIRA-BRIDGE', 'Pair A: exact special-case bridge', 'Exact special-case bridge: Equal-mass centering of the standard basis produces the same regular-simplex zero configuration as projection of an orthonormal basis onto 1⊥.', RD, U, 'established', 'established',
  norm='For equal masses at r_i = e_i: R_CM = (1/n)1, so r_i − R_CM = e_i − (1/n)1 = P_n e_i (G4m); for n = 4 these are Stage 2\'s first-state vectors up to the isometry of G2i.',
  pro=[('card:G4m', ''), ('card:G2n', ''), ('card:G2i', 'n = 4: Stage 2\'s first state')],
  bounds=['Not a universal Pair A solution; Pair A\'s shared algebraic form is unchanged; the deeper common relation stays unfilled.', 'Unequal masses do not share T′ (FAIL unchanged).'],
  acts=['I', 'III'], objs=['obj.distribution', 'obj.moments'], audit=T_AUDIT, related=['T-PAIRA-SHARED', 'T-SIMPLEX-FAMILY', 'T-WMC'], graph='pair.A.exactSpecialCaseBridges', ref='transfer 2')
T('T-WMC', 'WMC — Weighted Mass Centering (a separate construction, not T′)', 'WMC — Weighted Mass Centering', RD, 'established-support', 'established', 'established',
  norm='C_m = I − 1mᵀ/M, u = D C_m X with D = diag(m): Σu_i = 0; C_m idempotent, kernel span{1}, image m⊥, D-self-adjoint, Euclidean-oblique; L_m = D C_m symmetric PSD, image 1⊥, not idempotent.',
  pro=[('card:G5a', ''), ('card:G5b', ''), ('card:G5c', ''), ('card:G5e', 'configurations for unequal masses')],
  bounds=['Not T′ and not a repaired T′.', 'Does not apply to the directional ensemble (no positions or masses).'],
  acts=['I', 'III'], audit=T_AUDIT, related=['T-CENTERING-OPERATOR', 'T-PAIRA-BRIDGE', 'Q-WMC-1'], ref='transfer 4')
T('T-CENTERING-OPERATOR', 'One operator containing T′ and WMC', 'G-orthogonal removal of the uniform direction', CM, 'established-support', 'established', 'established',
  history=[('2026-11-12c', 'locked (Nadia): the distinguished direction stays the uniform direction 1 with positive diagonal G; removal of an arbitrary direction d is not an active family (see B-INDEPENDENT-DIRECTION, Q-DISTINGUISHED-MODE)')],
  norm='C_G = I − 1 1ᵀG/(1ᵀG1), G positive diagonal: idempotent, kills 1, G-self-adjoint, ⟨1, C_G x⟩_G = 0; G = I gives P_n, G = diag(m) gives C_m; the metric is read off each zero relation.',
  pro=[('card:G5d', ''), ('card:G5b', '')], con=[('card:G5f', 'boundaries: content only with a nonzero removed mode; undefined for 1ᵀG1 = 0; complex weights excluded')],
  bounds=['Operator and zero-relation level only; the regular-simplex configuration is the special case G ∝ I.', 'A standard object (weighted centering); allowing any removed direction would make it contain every hyperplane zero, so that is not adopted.'],
  acts=['III'], audit=T_AUDIT, related=['T-WMC', 'Q-CENTERING', 'T-SIMPLEX-FAMILY'], ref='transfer 5')
T('Q-CENTERING', 'A general centering geometry?', 'Is there a general geometry of centering/removing a distinguished direction or weighted mode that contains the simplex projection and mass balance as exact cases?', RD, U, 'open-question', 'open',
  pro=[('card:G5d', 'an exact operator-level construction for the uniform direction with diagonal weights')],
  target=dict(targetStatement='Is there a general geometry of centering/removing a distinguished direction or weighted mode that contains the simplex projection and mass balance as exact cases?', lastResearchOutcome='constructive-realization'),
  bounds=['Formulated as a research question only after the operator comparison; whether it is a project geometry or only standard weighted centering is open.'],
  acts=['III'], audit=T_AUDIT, related=['T-CENTERING-OPERATOR'], ref='transfer 17')
T('Q-WMC-1', 'WMC reconstruction in the D-metric', 'Does a reconstruction analogous to G3b hold for WMC in the D-metric?', WM, A, 'open-question', 'open', acts=['III'], audit=T_AUDIT, related=['T-WMC', 'Q-R4-2'], ref='WMC 10')
T('Q-WMC-2', "Stage 3's zero-preserving changes as D-orthogonal maps", "Which of Stage 3's zero-preserving changes, if any, are induced by D-orthogonal maps of the index space that fix", WM, A, 'open-question', 'open', acts=['I', 'III'], audit=T_AUDIT, related=['T-WMC'], ref='WMC 10')
T('T-S2-DEPHASING', 'Stage 2b under an S² measurement (outcome ignored)', 'relative coherence between the two S² sectors is lost', RD, 'established-support', 'established', 'established',
  variants=[('S_z remains zero', RD), ('S² information becomes available', RD)],
  norm='ρ = |↑↓⟩⟨↑↓|, in the {|1,0⟩, |0,0⟩} basis [[½, ½], [½, ½]] → ρ\' = [[½, 0], [0, ½]]; S_z ρ\' = 0; outcomes 2ħ² and 0 with probability ½ each; purity 1 → ½; ⟨S_z⁽¹⁾⟩: ħ/2 → 0, ⟨S_z⁽²⁾⟩: −ħ/2 → 0.',
  pro=[('card:W2a', ''), ('card:W2b', ''), ('card:W2c', '')], acts=['I', 'III'], audit=T_AUDIT, related=['B-ZERO-INTERNAL-CHANGE', 'B-JOINT-ALTERNATIVES'], ref='transfer 11')


# ── two-zeros pass (2026-11-12): distinguished directions, the quantum cancellation pair ──────────
Z_AUDIT = ('new', 'two-zeros pass (2026-11-12)')
T('B-INDEPENDENT-DIRECTION', 'Distinguished directions must be specified independently', 'A distinguished direction may only enter a construction if it is independently specified by the system before observing the desired zero.', RD, U, MR, GOV,
  variants=[('system identifies d independently → derive its map → predict the zero → test the prediction', RD)],
  bounds=['Forbidden order: observe zero → choose d that makes the map work.'], acts=['all'], audit=Z_AUDIT, ui='none (method)', related=['T-CENTERING-OPERATOR', 'Q-DISTINGUISHED-MODE'], ref='two-zeros 1')
T('Q-DISTINGUISHED-MODE', 'Independent systems with a naturally distinguished removed mode', 'Are there independent systems in which a distinguished source mode d arises naturally and is removed by the representation, with zero/resultant structure appearing in the target?', RD, U, 'open-question', 'open',
  bounds=['An open construction target, not an active family.'], acts=['III'], audit=Z_AUDIT, related=['B-INDEPENDENT-DIRECTION', 'Q-CENTERING'], ref='two-zeros 2')
T('T-QACP', 'Quantum Additive Cancellation Pair', 'The zero is produced by two nonzero vectors in the Hilbert space cancelling exactly.', RD, U, 'established', 'established',
  norm='S_z^(1)|1,0⟩ = +(ħ/2)|0,0⟩, S_z^(2)|1,0⟩ = −(ħ/2)|0,0⟩; S_z^(1)|0,0⟩ = +(ħ/2)|1,0⟩, S_z^(2)|0,0⟩ = −(ħ/2)|1,0⟩. Each zero is built from the other state.',
  variants=[('one state + decomposition of an observable → two nonzero state-space contributions → exact zero total action', RD)],
  pro=[('card:Q2a', ''), ('card:W2f', '')], bounds=['Not part of Pair A; the spin pair stays distinct from the MRI-motivated ensemble.', 'Level A (additive algebra) is trivial; Level C (larger geometry) is open.'],
  acts=['I', 'III'], objs=['obj.qacp'], audit=Z_AUDIT, related=['T-QACP-OBSTRUCTION', 'T-QACP-EXCHANGE', 'Q-QACP-C', 'T-QUANTUM-ZERO'], graph='rel.qacp-cancellation', ref='two-zeros 3')
T('T-QACP-OBSTRUCTION', 'The zero-producing structure alone does not separate the two zeros (wording superseded: too broad)', 'The zero-producing structure alone cannot tell the two zeros apart.', CQ, 'established-support', 'established', 'established',
  sup='T-QACP-OBSTRUCTION-RESTRICTED', history=[('2026-11-12d', 'wording superseded (Nadia): too strong; replaced by the restricted lemma T-QACP-OBSTRUCTION-RESTRICTED (card Q2h); the cards Q2b, Q2c stand')],
  norm='U = exp(iπS_z^(1)/ħ) commutes with S_z^(1) and S_z^(2) and maps |1,0⟩ → i|0,0⟩ with every contribution; Gram(c1, c2), Gram(ψ, c1, c2), norms and signs coincide (Q2b, Q2c).',
  pro=[('card:Q2b', ''), ('card:Q2c', '')], acts=['I', 'III'], objs=['obj.qacp'], audit=Z_AUDIT, related=['T-QACP', 'Q-SAME-ZERO'], graph='rel.qacp-obstruction', ref='two-zeros 7–8')
T('T-QACP-EXCHANGE', 'Exchange separates the two zeros', 'With P, the relation between the two contributions differs: Pc₁ = +c₂ for the triplet and Pc₁ = −c₂ for the singlet.', CQ, 'established-support', 'established', 'established',
  variants=[('same S_z=0 + different action under an independently defined swap → two distinguishable zero states', RD)],
  norm='ε (P c1 = ε c2, P the canonical exchange) = +1 for |1,0⟩, −1 for |0,0⟩; ε = the state\'s exchange parity (covariance); undefined for non-eigenstates (|↑↓⟩) and for a non-canonical summand swap V = PU. Blind test (protocol pre-registered): separation PASS; prediction of S² from the project geometry NOT YET POSSIBLE (only via the textbook identity S² = ħ²(1 + P)).',
  pro=[('card:Q2d', ''), ('card:Q2e', 'reveal after the descriptor was fixed'), ('card:Q2f', 'T′: source transpositions act with sign +1'), ('card:Q2g', 'domain: exchange eigenstates only')],
  bounds=['Carries the same information as the known exchange parity / S²; adds where the distinction lives, not a new label.', 'Not a nontrivial predictive transfer: the test was procedurally blind, not blind in knowledge.',
          'Not normalized into "all hidden information in zero is symmetry information" or "exchange is the geometry of zero" (unsupported, Nadia).'],
  acts=['I', 'III'], objs=['obj.qacp'], audit=Z_AUDIT, related=['T-QACP', 'Q-SAME-ZERO', 'T-SIMPLEX-FAMILY'], graph='rel.qacp-exchange', ref='two-zeros 7–10')
T('T-QACP-CROSSTERM', 'What the S² dephasing removes from the zero', '⟨S_z⁽¹⁾⟩ = ħ Re ρ_AB', CQ, 'established-support', 'established', 'established',
  norm='For ψ = α|1,0⟩ + β|0,0⟩, S_z^(1) is a pure cross-term observable in the S² basis; its expectation (the expectation-level composition of the zero) is ħ Re ρ_AB and vanishes under S² dephasing (W3a); the shared mathematics with which-path dephasing is the generic two-sector map (W3b).',
  pro=[('card:W3a', ''), ('card:W3b', 'generic: any zero-diagonal observable')], acts=['I', 'III'], audit=Z_AUDIT, related=['B-ZERO-INTERNAL-CHANGE', 'B-JOINT-ALTERNATIVES', 'T-S2-DEPHASING'], ref='two-zeros 12–13')
T('Q-QACP-C', 'Level C of the quantum cancellation pair', 'Does the source construction reveal a representation/geometric structure analogous to any previously constructed zero?', RD, U, 'open-question', 'open',
  acts=['III'], audit=Z_AUDIT, related=['T-QACP'], ref='two-zeros 4')
T('Q-SAME-ZERO', 'Two systems, the same exact zero', 'Can two systems with the same exact zero be geometrically distinguished using structure that remains present while the zero is preserved?', RD, U, 'open-question', 'open',
  variants=[('What distinguishes two exact zeros while both remain zero?', RD)],
  pro=[('card:Q2d', 'separated once the exchange structure is included; [P, S_z] = 0')], con=[('card:Q2c', 'not separated by the zero-producing structure alone')],
  target=dict(targetStatement='Can two systems with the same exact zero be geometrically distinguished using structure that remains present while the zero is preserved?', lastResearchOutcome='special-case'),
  acts=['I', 'III'], audit=Z_AUDIT, related=['T-QACP-OBSTRUCTION', 'T-QACP-EXCHANGE', 'B-ZERO-PRESERVE', 'T-Q.zero-distinguishable'], ref='two-zeros 20')
T('Q-QACP-1', 'Four spin-½: does the internal-zero representation with S₄ separate states?', 'For four spin-½ (S_z = 0 requires an even number)', CQ, A, 'open-question', 'open', acts=['III'], audit=Z_AUDIT, related=['T-QACP-EXCHANGE'], ref='QACP 10')
T('Q-QACP-2', 'A non-quantum system of the quantum type?', 'Is there a non-quantum system where the contributions to a zero are generated from one source by exchange-related maps', CQ, A, 'open-question', 'open', acts=['III'], audit=Z_AUDIT, related=['T-QACP-EXCHANGE'], ref='QACP 10')


# ── four spins and a non-quantum transfer (2026-11-12) ────────────────────────────────────────────
F_AUDIT = ('new', 'four-spin and mass pass (2026-11-12)')
T('B-INDEPENDENT-SYMMETRY', 'Symmetries must be supplied independently by the system', 'A zero may be analyzed together with structures or symmetries independently supplied by its system.', RD, U, MR, GOV,
  variants=[('A symmetry cannot be introduced because it happens to distinguish the zero states after inspection. It must exist independently in the system before the desired distinction is examined.', RD)],
  bounds=['No symmetry is part of the universal definition of a zero.'], acts=['all'], audit=F_AUDIT, ui='none (method)', related=['B-INDEPENDENT-DIRECTION', 'T-ZERO-SYMMETRY-ARCHITECTURE'], ref='four-spin 2')
T('T-QACP-OBSTRUCTION-RESTRICTED', 'Two-spin obstruction, restricted to its exact class', 'U = exp(iπS_z⁽¹⁾/ħ) acts on ℂ² ⊗ ℂ² and commutes with S_z⁽¹⁾, S_z⁽²⁾ and S_z.', CQ, 'established-support', 'established', 'established',
  norm='U maps C(|1,0⟩) = (ψ, S_z^(1)ψ, S_z^(2)ψ) to i·C(|0,0⟩); every descriptor invariant under unitaries commuting with S_z^(1), S_z^(2) and under global phase (every function of the Gram matrix of C: norms, inner products, c2 = −c1) is equal on the two; descriptors using an operator not commuting with U (e.g. the exchange P) are outside the class.',
  pro=[('card:Q2h', ''), ('card:Q2b', ''), ('card:Q2c', '')], supers='T-QACP-OBSTRUCTION', acts=['I', 'III'], objs=['obj.qacp'], audit=F_AUDIT, related=['T-QACP', 'T-FOURSPIN-GEOMETRY-BLIND'], ref='four-spin 1')
T('T-FOURSPIN-ZERO', 'The four-spin zero space and its contributions', 'H₀ = ker S_z, with dim H₀ = 6', F4, 'established-support', 'established', 'established',
  pro=[('card:FS1a', ''), ('card:FS1b', 'covariant factor permutations')], acts=['III'], objs=['obj.four-spin'], audit=F_AUDIT, related=['T-FOURSPIN-SYMMETRY'], ref='four-spin 4–5')
T('T-FOURSPIN-GEOMETRY-BLIND', 'Contribution geometry is blind to the four-spin sectors', 'D1 and D2 (Gram, rank, eigenvalues, norms) are blind to the relative phases between raw states.', F4, 'established-support', 'established', 'established',
  pro=[('card:FS1c', 'diagonal unitaries commute with every contribution operator'), ('card:FS2c', 'identical Grams across S = 0 / 1 and S = 0 / 2')],
  acts=['III'], objs=['obj.four-spin'], audit=F_AUDIT, related=['T-QACP-OBSTRUCTION-RESTRICTED', 'T-FOURSPIN-SYMMETRY'], graph='rel.fourspin-geometry-blind', ref='four-spin 6')
T('T-FOURSPIN-SYMMETRY', 'FOUR-SPIN-B: the independent S₄ action separates the hidden sectors', 'The contribution geometry does not distinguish the sectors; the independently supplied symmetry does.', F4, 'established-support', 'established', 'established',
  norm='Blind (preregistered at 966be69): classes by cyclic dimension 1, 3, 2 = sectors S = 2, 1, 0 for all six targets (FS2b). Known theory: Schur–Weyl in the S_z = 0 weight space (FS2e). VALIDATION OF KNOWN MATHEMATICS.',
  variants=[('same visible zero + internal relational/symmetry structure → distinguishable hidden states.', RD)],
  pro=[('card:FS1d', 'blind descriptors'), ('card:FS1f', 'classes fixed before the reveal'), ('card:FS2b', ''), ('card:FS2e', 'secondary match')],
  acts=['III'], objs=['obj.four-spin'], audit=F_AUDIT, related=['T-QACP-EXCHANGE', 'B-INDEPENDENT-SYMMETRY', 'Q-SYM-NOVEL'], graph='rel.fourspin-symmetry', ref='four-spin 6–11')
T('T-FOURSPIN-SIMPLEX', 'The S₄-fixed zero state has the T′ regular-simplex contributions', 'The S₄-fixed zero state has the regular-simplex contributions, and that is the T′ n = 4 configuration.', F4, 'established-support', 'established', 'established',
  pro=[('card:FS1e', 'preregistered prediction P1'), ('card:G3c', 'the reason, derived before')], con=[('card:FS2d', 'the converse fails: the regular-simplex Gram also occurs at S = 0')],
  acts=['III'], objs=['obj.four-spin'], audit=F_AUDIT, related=['T-SIMPLEX-FAMILY', 'T-R4-STAGE2'], graph='rel.fourspin-simplex', ref='four-spin P1')
T('T-MASS-SECOND-MOMENT', 'Mass zero: the contributions predict the hidden second moment', 'R2 cannot fail, because T and G share their nonzero spectrum.', MS, 'established-support', 'established', 'established',
  norm='Blind (preregistered at 966be69): R2 (contribution Gram spectrum) right for M1–M6; R1 (symmetry) right whenever it predicts (M1, M4), silent on M2, M3, M6, misses M5 (isotropic, trivial symmetry).',
  pro=[('card:MB1b', 'blind predictions'), ('card:MB2a', ''), ('card:MB2b', ''), ('card:MB2c', '')], acts=['I', 'III'], objs=['obj.distribution'], audit=F_AUDIT,
  related=['T-ZERO-SYMMETRY-ARCHITECTURE', 'T-WMC'], graph='rel.mass-second-moment', ref='four-spin 14–16')
T('T-ZERO-SYMMETRY-ARCHITECTURE', 'Zero + independent symmetry: the architecture across quantum and mass', 'An independently supplied group acts covariantly on the zero-producing tuple, and a hidden quadratic quantity commutes with that action.', MS, U, 'derived-connection', 'derived',
  variants=[('zero/resultant + relationships preserved within the zero → information about the hidden configuration.', RD), ('The visible zero alone does not determine where the hidden information lives.', RD)],
  norm='Both systems: the hidden quadratic (S², T) commutes with the independent group and is scalar on each irreducible block (Schur). Roles inverted: four spins, geometry blind and symmetry decisive; mass, geometry decisive and symmetry sound but incomplete.',
  pro=[('card:FS2e', 'quantum: Schur–Weyl'), ('card:MB2c', 'mass: Schur'), ('card:FS1e', 'S_n-invariant zero → T′ simplex, quantum'), ('card:G2i', 'and mass / Stage 2')],
  con=[('card:FS2c', 'contribution geometry fails in the quantum system'), ('card:MB2a', 'symmetry misses M5 in the mass system')],
  bounds=['The common object is textbook (Schur\'s lemma); what transfers is the analysis architecture, not a new theorem.'],
  acts=['III'], audit=F_AUDIT, related=['B-INDEPENDENT-SYMMETRY', 'T-FOURSPIN-SYMMETRY', 'T-MASS-SECOND-MOMENT'], ref='four-spin 16–17')
T('Q-SYM-NOVEL', 'A system where the zero + symmetry descriptor separates what no known label separates?', 'Is there a system where "zero-producing tuple + independently supplied symmetry" separates states that no already-known label separates?', F4, A, 'open-question', 'open',
  acts=['III'], audit=F_AUDIT, related=['T-FOURSPIN-SYMMETRY'], ref='four-spin 10')


# ── Foundation V1 consolidation (2026-11-12): original theories not previously in the repository ──
ACTS_ALREADY_NEW = {'T-MASS-WAVE-SEED', 'T-GRAVITY-ATTRACTION', 'T-THERMALENS'}   # placed directly in the new Act map
V_AUDIT = ('missing', 'not in the repository before the Foundation consolidation (2026-11-12); recorded from Nadia\'s message')
T('T-MASS-WAVE-SEED', 'Mass is waves too (original seed)', "mass is waves too, it's just a different form.", RD, U, 'hypothesis', 'hypothesis',
  norm='Construction target: a representation in which mass-like and wave-like behavior satisfy a common exact relation. Supporting mathematics (not proof): E² = p²c² + m²c⁴ with E = ħω, p = ħk (S12).',
  variants=[('construct a representation in which mass-like and wave-like behavior satisfy a common exact relation', RD)],
  pro=[('card:S12', 'supporting: one invariant relation in two sets of variables')], bounds=['Not rewritten into QFT language; QFT is a secondary reference, not a proof of this theory.'],
  acts=['Guide'], audit=V_AUDIT, related=['T-MASS-WAVE', 'T-MASS-WAVE-Q', 'T-MATTER-FIELD', 'T-GRAVITY-ATTRACTION'], ref='Foundation 34')
T('T-GRAVITY-ATTRACTION', 'Mass attraction and a shared structural principle', 'Keep the original intuition that mass attraction may not be far removed if the deeper structural principle is shared.', RD, U, 'hypothesis', 'open',
  bounds=['SPECULATIVE / OPEN; no project construction. The intuition\'s original wording is not in the repository; this is Nadia\'s 2026-11-12 description of it.'],
  acts=['unplaced'], audit=V_AUDIT, related=['T-MASS-WAVE-SEED'], ref='Foundation 35')
T('T-THERMALENS', 'ThermaLens / Energeo implementation mathematics', 'Keep the existing ThermaLens/Energeo implementation mathematics separate from general Foundation proof.', RD, U, 'open-question', 'open',
  bounds=['The implementation mathematics is not in this repository: provenance gap.', 'Downstream application; not evidence for upstream mathematics until tested.'],
  acts=['Final'], audit=V_AUDIT, related=['T-ENERGEO', 'T-ENERGEO-INTENT'], ref='Foundation 37')

# ── Foundation Completion Pass 2 (2026-11-12): CF11 split into an established pattern and a project hypothesis ──
P2 = '2026-11-12'
P2_AUDIT = ('missing', 'stated in Foundation Completion Pass 2 (2026-11-12); the earlier single CF11 compressed both statements')
ACTS_ALREADY_NEW |= {'T-CF11-A', 'T-CF11-B'}
T('T-CF11-A', 'CF11-A: the established common-form pattern', 'In many established geometries, a relational structure together with the transformations preserving it characterizes substantial geometric structure.', RD, U, 'derived-connection', 'derived',
  pro=[('card:C1b', 'AᵀMA = M ⟺ the form B_M is preserved, and B_M-zeros with it'), ('card:S4e', 'Euclidean: AᵀA = I'), ('card:S5c', 'Lorentz: ΛᵀηΛ = η'), ('card:S9(3)', 'symplectic generator rule'),
       ('card:FB9c', 'a symplectic map preserves symplectic orthogonality'), ('card:G5b', 'weighted centering: the D-metric read off a zero relation')],
  con=[('card:Z4b', 'zero-resultant preservation is kept by every linear map and identifies no form (CF3): the pattern is not universal')],
  bounds=['An established pattern across known form-preserving geometries (Erlangen-program type statement); not a universal theorem about all geometry.',
          'Its rating is separate from CF11-B (Nadia, Pass 2: "Do not give CF11-A and CF11-B one shared rating.").'],
  acts=['Guide'], audit=P2_AUDIT, related=['T-CF11-B', 'T-BACKBONE-INVARIANT', 'T-H2-ROLES'], ref='Foundation Pass 2, 3',
  history=[(P2, 'CF11 split: this record holds the established pattern (Foundation object CF11-A)')])
T('T-CF11-B', 'CF11-B: the common-form architecture as a project hypothesis', 'Can relation + admissible transformations + preserved structure provide a broader organizing architecture across the geometries investigated in this project?', RD, U, 'hypothesis', 'hypothesis',
  pro=[('card:G5b', 'one project geometry (weighted centering) whose metric is read off its own zero relation'), ('card:FS2e', 'the four-spin zero is organized by an independently given group action (Schur)')],
  con=[('card:Z4b', 'the zero-resultant relation is preserved by all of GL and characterizes no metric (CF3)')],
  bounds=['HYPOTHESIS / OPEN. Not supported merely by CF11-A: the established pattern does not show that the project\'s own geometries are organized this way.',
          'No cross-domain test chosen in advance yet; none is run in Pass 2 (stop condition).'],
  acts=['all'], audit=P2_AUDIT, related=['T-CF11-A', 'T-BACKBONE-INVARIANT'], ref='Foundation Pass 2, 3',
  history=[(P2, 'CF11 split: this record holds the project hypothesis (Foundation object CF11-B)')])

ACTS_ALREADY_NEW |= {'T-EFFECTIVE-Q'}
T('T-EFFECTIVE-Q', 'Effective / reduced representations (question)', 'What survives when a richer source description is reduced to an effective representation?', RD, U, 'open-question', 'open',
  pro=[('card:FB11a', 'Michaelis–Menten: only K_M and V_max survive the quasi-steady-state reduction'), ('card:FB11c', 'a model-manifold boundary: θ₁ survives, θ₂ is lost'), ('card:FB11d', '1D decimation: the coupling form survives, renormalized')],
  bounds=['The worked reductions are compared, not equated (Pass 2). Kadanoff block spins and Wilson fixed-point RG are source-only.',
          'Recorded in Pass 2 (2026-11-12): the question was in the V1 decision record without a registry record (provenance correction).'],
  acts=['III', 'Guide'], audit=('missing', 'stated in the Foundation V1 message (2026-11-12); registry record added in Pass 2'), ref='Foundation 36', history=[(P2, 'registry record added (provenance correction)')])

# ── Foundation Completion Pass 3 (2026-11-12): CF11-B test, records stated before the test ──
P3_AUDIT = ('missing', 'stated in Foundation Completion Pass 3 (2026-11-12), recorded before the CF11-B test')
ACTS_ALREADY_NEW |= {'T-CF11-REFINEMENT', 'T-CF-PULLBACK-Q'}
T('T-CF11-REFINEMENT', 'CF11-CANDIDATE-REFINEMENT', 'A geometry may be characterized by relational structure together with transformations under which that structure is preserved or transforms coherently.', RD, U, 'hypothesis', 'hypothesis',
  bounds=['Candidate only: tested in Pass 3, not adopted before the test (preregistration research/constructions/cf11b_fisher_prereg.md).',
          'Tested only in explicit form: tensor T; F*T = T for symmetries; T_(p∘θ) = θ*T_p for reparametrizations; invariants; failure cases. Without a stated law, "transforms coherently" is too generic.'],
  acts=['all'], audit=P3_AUDIT, related=['T-CF11-B', 'T-CF11-A'], ref='Foundation Pass 3, 18', history=[('2026-11-12', 'recorded before the CF11-B Fisher test')])
T('T-CF-PULLBACK-Q', 'Pullback preservation as a common form (question)', 'Is pullback preservation a more general common-form bridge than fixed matrix equality?', RD, U, 'open-question', 'open',
  bounds=['Evaluated in Pass 3 against preregistered criteria (YES / PARTIAL / NO); Fisher coordinate reparametrization is never counted as F*g = g unless F is an isometry.'],
  acts=['Guide'], audit=P3_AUDIT, related=['T-CF11-B', 'T-CF11-A'], ref='Foundation Pass 3, 17', history=[('2026-11-12', 'recorded before the CF11-B Fisher test')])

# ── Pass 3 architectural correction (2026-11-12): the Transformation Architecture ──
PC_AUDIT = ('missing', 'stated in the Pass 3 architectural correction (2026-11-12)')
ACTS_ALREADY_NEW |= {'T-TRANSFORMATION-ARCH', 'T-TRANSFORMATION-DEEP', 'T-CENCOV-CHECK'}
T('T-TRANSFORMATION-ARCH', 'Transformation Architecture (R1 / R2 / R3)', 'A mathematical structure may be investigated by distinguishing: (1) how it transforms when its representation changes, (2) which transformations leave the structure invariant, and (3) which maps/operators remain compatible with those transformations.', RD, U, 'derived-connection', 'derived',
  variants=[('How does the same mathematical structure appear when its representation or coordinates change?', RD), ('Which actual transformations of the object or space preserve the defining structure?', RD),
            ('Which derived maps/operators remain compatible with those transformations?', RD)],
  norm='R1 representation covariance (components transform by a covariant law, invariants unchanged; e.g. g_φ = Jᵀ g_θ J); R2 structural invariance / symmetry (F*T = T; matrix case A†MA = M; infinitesimal L_X T = 0, matrix K†M + MK = 0); R3 equivariance / intertwining (C ρ_V(g) = ρ_W(g) C; commuting operator when V = W).',
  pro=[('card:TRA4a', 'R1 and R2 are distinct questions even with the same matrix'), ('card:TRA1b', 'R2 → infinitesimal: F_t*g = g ⟹ L_X g = 0'), ('card:TRA3a', 'R3: the DFT intertwines translation and modulation'),
       ('card:CFT4c', 'R1 verified against direct computation'), ('card:CFT8c', 'R3: weighted centering commutes with a symmetry subgroup')],
  con=[('card:TRA4b', 'projections are not R1: lossy representation maps sit outside the three levels (their compatibility is R3)')],
  bounds=['PROJECT-LEVEL ORGANIZING ARCHITECTURE, DERIVED FROM ESTABLISHED MATHEMATICS; not a new mathematical theorem. Each level is known mathematics, sourced separately.',
          'History: CF11 original → Fisher preregistered test → CF11-F2 → architectural correction → Transformation Architecture R1/R2/R3. CF11-B → CF11-F2 stands.'],
  supers='T-CF11-REFINEMENT', acts=['all'], audit=PC_AUDIT, related=['T-CF11-B', 'T-CF-PULLBACK-Q', 'T-TRANSFORMATION-DEEP', 'T-H2'], ref='Pass 3 correction, 17',
  history=[('2026-11-12', 'recorded in the Pass 3 architectural correction; supersedes the "three meanings of preserved" reading of T-CF11-REFINEMENT')])
T('T-TRANSFORMATION-DEEP', 'Representation covariance, invariance, zero relations and equivariance: a deeper common architecture?', 'Do recurring relationships among representation covariance, structural invariance, zero relations, and equivariance reveal a deeper common architecture across the systems studied in Geometry of Representation?', RD, U, 'hypothesis', 'hypothesis',
  pro=[('card:TRA2a', 'R2 keeps the zero relations its structure defines'), ('card:CFT5b', 'a supplied symmetry forces a Fisher null at its fixed points'), ('card:FS2b', 'four spins: an independent symmetry separates states sharing a zero')],
  con=[('card:CFT5c', 'a Fisher null without any symmetry'), ('card:TRA2b', 'zero preservation does not imply invariance'), ('card:MB2a', 'mass: geometry, not symmetry, carries the hidden label')],
  bounds=['HYPOTHESIS / OPEN. The three-level architecture is not the final theory; this record keeps the larger question open.'],
  acts=['all'], audit=PC_AUDIT, related=['T-TRANSFORMATION-ARCH', 'T-ZERO-SYMMETRY-ARCHITECTURE', 'T-CF11-B'], ref='Pass 3 correction, 18')
T('T-CENCOV-CHECK', 'Čencov / Chentsov: future high-relevance check', "Does the characterization of the Fisher metric under statistically meaningful transformations provide a deeper example of the project's transformation-class → distinguished-geometry relationship?", RD, U, 'open-question', 'open',
  bounds=['KNOWN THEOREM, NOT YET INTEGRATED (SRC-CHENTSOV-1982). Not used as evidence and not used to raise any rating until examined precisely in a later pass.'],
  acts=['Guide'], audit=PC_AUDIT, related=['T-TRANSFORMATION-ARCH'], ref='Pass 3 correction, 21')

# ── Reduction / Information-Changing Architecture (2026-11-13) ──
RD_AUDIT = ('missing', 'stated in the Reduction / Information-Changing Architecture amendment (2026-11-13)')
ACTS_ALREADY_NEW |= {'T-REDUCTION-ARCH', 'T-SOURCE-MANIFEST', 'T-DYADIC-Q1', 'T-DYADIC-Q2', 'T-TRANSFORM-REDUCE'}
T('T-REDUCTION-ARCH', 'Reduction / Information-Changing Architecture', 'What information survives, collapses, is discarded, or remains reconstructible under Φ?', RD, U, 'derived-connection', 'derived',
  norm='For a map Φ: X → Y (not necessarily invertible) record what survives, what collapses (Φ(x₁) = Φ(x₂)), what becomes zero, what is lost, what is reconstructible (and under which assumptions), the fibers Φ⁻¹(y), and whether Φ respects a symmetry (Φ ρ_X(g) = ρ_Y(g) Φ, an R3 relationship that does not make Φ lossless).',
  pro=[('card:RIC1a', 'simplex projection: one mode collapses, every difference survives'), ('card:RIC1b', 'weighted centering: the weighted mean is lost, relative positions survive'),
       ('card:RIC1c', 'a lossy Fourier-side operation can be equivariant (band-limiting) or invariant (magnitude)'), ('card:G3b', 'reconstruction of the source under stated assumptions')],
  con=[('card:G4c', 'without the source class, the removed relation is not recoverable')],
  bounds=['PROJECT-LEVEL ORGANIZING ARCHITECTURE, DERIVED FROM ESTABLISHED MATHEMATICS; parallel to the Transformation Architecture, not an R4 inside it.',
          'Not reduced to kernels. Open: whether a shared analysis of SURVIVAL + COLLAPSE + ZERO + RECONSTRUCTION + SYMMETRY COMPATIBILITY gives a useful cross-domain geometry of representation.'],
  acts=['III', 'Guide'], audit=RD_AUDIT, related=['T-TRANSFORMATION-ARCH', 'T-SOURCE-MANIFEST', 'T-TRANSFORM-REDUCE', 'T-DYADIC'], ref='Reduction amendment, 2–3')
T('T-SOURCE-MANIFEST', 'What a reduced manifestation tells about its source (question)', 'What can a reduced manifestation tell us about the richer source structure that generated it?', RD, U, 'open-question', 'open',
  pro=[('card:G3b', 'simplex: the source is recovered up to a sign and an isometry when its class is known')], con=[('card:G4c', 'with the class unknown, recovery fails')],
  bounds=['Source does not automatically mean higher physical spatial dimension; reduction does not automatically mean projection. The source may be higher-dimensional, higher-information, higher-resolution, more parameterized, less averaged or less quotient-like, depending on the system.'],
  acts=['III'], audit=RD_AUDIT, related=['T-REDUCTION-ARCH', 'B-HIGHER-GEOMETRY'], ref='Reduction amendment, 16')
T('T-DYADIC-Q1', 'DYADIC PACKETS research question 1', 'Can a hierarchy of packets encode how information survives, separates, disappears, or remains reconstructible under repeated reduction?', RD, U, 'open-question', 'open',
  bounds=['An open question, not a theorem and not the definition of DYADIC PACKETS. DYADIC STRUCTURE — CANDIDATE, NOT UNIVERSAL.'], acts=['Guide'], audit=RD_AUDIT, related=['T-DYADIC', 'T-DYADIC-Q2'], ref='Reduction amendment, 12')
T('T-DYADIC-Q2', 'DYADIC PACKETS research question 2', 'Can relationships between packets preserve information not visible in any one packet individually?', RD, U, 'open-question', 'open',
  bounds=['Not connected yet to Fourier components, wavelet scales, scattering paths, source / reduced geometry, zero relations or projection: those links are for later passes.'], acts=['Guide'], audit=RD_AUDIT, related=['T-DYADIC', 'T-DYADIC-Q1'], ref='Reduction amendment, 12')
T('T-TRANSFORM-REDUCE', 'Transform vs reduce (question)', 'Is the Geometry of Representation fundamentally governed by both how structure behaves under transformations and how structure behaves under reduction?', RD, U, 'open-question', 'open',
  bounds=['OPEN PROJECT QUESTION; not promoted.'], acts=['all'], audit=RD_AUDIT, related=['T-TRANSFORMATION-ARCH', 'T-REDUCTION-ARCH'], ref='Reduction amendment, 19')

# ── Model-manifold invariance + research-story audit (2026-11-13) ──
MM_AUDIT = ('missing', 'stated in the model-manifold invariance + research-story audit (2026-11-13)')
ACTS_ALREADY_NEW |= {'T-MM-GOV', 'T-MM-STORY', 'T-MM-RULES', 'T-MM-RULES-Q', 'T-MM-DISTINGUISHED-Q', 'T-RULES-GEOMETRY', 'T-ZERO-LENGTH', 'T-MM-OBSERVE',
                     'T-VIEWER-FORM', 'T-PHYSICAL-MANIFEST-Q', 'T-GEOM-INFO-Q', 'T-SIMPLER-BOUNDARY-Q'}
MMS = 'research/model_manifold_story.md'
T('T-MM-GOV', 'Audit the status of each connection, not the story', 'Do not audit away the research story. Audit the status of each connection.', RD, U, MR, GOV,
  variants=[('The paper is not the thesis.', RD)],
  norm='Method / governance rule: every arrow of the research story keeps its record and receives its own status (ESTABLISHED MATHEMATICS, PAPER-BACKED RESULT, PROJECT-DERIVED CONNECTION, PROJECT HYPOTHESIS, OPEN CONNECTION, PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS, FAILED / NEGATIVE RESULT). A weak arrow is labelled, not removed; a paper result does not prove the project interpretation, and the project interpretation is not paper novelty.',
  acts=['all'], audit=MM_AUDIT, related=['T-MM-STORY'], ref='model-manifold audit, 0')
T('T-MM-STORY', 'The research story: possibility space → allowable manifold → manifestation', 'larger prediction / possibility space → rules constrain an allowable manifold → representations expose different aspects of it → observation / reduction may expose an accessible manifestation → ask what geometry and information survive', RD, U, 'hypothesis', 'hypothesis',
  variants=[('possibility / prediction space → rules constrain an allowable manifold → geometry organizes distinguishability → observation/reduction exposes an accessible manifestation → ask what survives, disappears, or becomes observable', RD)],
  norm='Arrow by arrow (research/model_manifold_story.md): (1) prediction space P ⊇ M = Y(Θ): ESTABLISHED MATHEMATICS; (2) the model rule Y and the parameter domain Θ fix M: ESTABLISHED (definition), with the broader rules → geometry reading a PROJECT HYPOTHESIS; (3) representations expose different aspects (charts, noise metrics, embeddings; R1 vs metric dependence, cards MMIa–MMIf): PROJECT-DERIVED CONNECTION; (4) observation / reduction exposes an accessible manifestation: OPEN CONNECTION in general, exact only for stated maps (boundary limits MMIg; non-selective quantum measurement W2a); (5) what survives: answered per map by the Reduction / Information-Changing Architecture, OPEN as a general law.',
  pro=[('card:MMIa', 'rank, nullity and the volume element survive every change of parametrization'), ('card:MMId', 'lengths are chart-invariant and equal prediction-space arc length'),
       ('card:MMIg', 'a boundary limit is a property of the set; the dimension drops 2 → 1'), ('card:W2a', 'one exact observation map (non-selective measurement) that keeps the zero and removes a coherence')],
  con=[('card:MMIb', 'raw eigenvalues and the condition number are representation artifacts: not every visible spectrum is geometry'), ('card:MMIe', 'magnitudes depend on the noise model, so "the" geometry needs a stated prediction-space metric')],
  bounds=['KNOWN MODEL-MANIFOLD / INFORMATION GEOMETRY (arrows 1–2, 3 in part); PROJECT SYNTHESIS (the chain as one story); OPEN PHYSICAL / QUANTUM-LIKE INTERPRETATION (arrow 4 beyond stated maps).',
          'parameter space ≠ prediction space; prediction space ≠ physical spacetime; model manifold ≠ quantum state space.'],
  acts=['Guide'], audit=MM_AUDIT, related=['T-MM-GOV', 'T-MM-RULES', 'T-MM-OBSERVE', 'T-PREDICTION-INFINITE', 'T-INFOGEO', 'T-REDUCTION-ARCH', 'T-SOURCE-MANIFEST'], ref='model-manifold audit, story')
T('T-MM-RULES', 'The rules of the manifold were the model parameters', 'the rules of the manifold were the model parameters.', RD, U, 'derived-connection', 'derived',
  norm='the model structure and parameterization constrain the set of allowable predictions. Unpacked: the model rule Y (the functional form) and the parameter domain Θ fix the allowable set M = Y(Θ) ⊆ P; a particular parameter value is a point coordinate on M, not a constraint on it; the domain\'s limits give M\'s boundaries (θ₂ → ∞, MMIg); the parametrization is a chart, so a reparametrization leaves M unchanged (MMIa, MMIf).',
  variants=[('the model structure and parameterization constrain the set of allowable predictions.', RD)],
  pro=[('card:MMIf', 'the same set in three charts has one width'), ('card:MMIg', 'the parameter domain\'s limit is a boundary of the set'), ('card:FB11c', 'what survives the boundary: θ₁')],
  con=[('card:MMIi', 'parameter values are coordinates on one manifold, not structure constants of a form: the parameter ↔ c reading needs this distinction')],
  bounds=['The definition M = Y(Θ) is ESTABLISHED MATHEMATICS (Transtrum–Machta–Sethna 2010/2011; Quinn et al. 2023). The project connection is the reading "rules constrain an allowable set", which is PROJECT-DERIVED and exact in this definitional sense.'],
  acts=['Guide'], audit=MM_AUDIT, related=['T-MM-STORY', 'T-MM-RULES-Q', 'T-RULES-GEOMETRY'], ref='model-manifold audit, parameters')
T('T-MM-RULES-Q', 'Do governing rules shape allowable geometry more broadly?', 'Do governing parameters/rules play a broader role in determining the geometry of allowable representations?', RD, U, 'hypothesis', 'hypothesis',
  pro=[('card:MMIg', 'model rule: a parameter limit drops the dimension'), ('card:C9b', 'Lorentz form: c → ∞ degenerates the form (rank drop)')],
  con=[('card:MMIi', 'for finite c, c is absorbed by a change of units; a model parameter is a coordinate. The two "rules" act on different objects')],
  bounds=['PROJECT HYPOTHESIS. The shared exact content found so far is limited to "a parameter limit is a degenerate boundary with a rank drop" (T-RULES-GEOMETRY).'],
  acts=['Guide'], audit=MM_AUDIT, related=['T-MM-RULES', 'T-RULES-GEOMETRY', 'T-MM-DISTINGUISHED-Q', 'T-C-ROLES'], ref='model-manifold audit, parameters')
T('T-MM-DISTINGUISHED-Q', 'What does a distinguished rule/parameter determine?', 'What role does a distinguished rule/parameter play in determining allowable transformations, allowable states, or geometric structure?', RD, U, 'open-question', 'open',
  bounds=['Known instance: c fixes the Lorentz group (the transformations keeping η_c) and the allowed set uᵀηu = 1 (one boost orbit, MMIi). Model-manifold instance: Y and Θ fix M; no transformation group is fixed by a model parameter in general (CFT5f). These are known examples, not an exhaustive classification for this project.'],
  acts=['Guide'], audit=MM_AUDIT, related=['T-MM-RULES-Q', 'T-RULES-GEOMETRY', 'T-C-ROLES'], ref='model-manifold audit, c')
T('T-RULES-GEOMETRY', 'Rules constrain a geometry of allowed states: c and model manifolds', 'Do both illustrate a broader pattern in which rules constrain a geometry of allowed states?', RD, U, 'open-question', 'open',
  variants=[('larger ambient possibility space → constrained allowed manifold', RD)],
  pro=[('card:MMIi', 'both have a parameter limit that is a degenerate boundary (c → ∞: diag(1, 0), rank 1; θ₂ → ∞: rank 2 → 1)'), ('card:MMIg', 'model boundary: rank drop'), ('card:C9b', 'form boundary: rank drop')],
  con=[('card:MMIi', 'the invariant-form role does not transfer: η_c is one form up to units (signature is the invariant), the Lorentz allowed set is one group orbit, while a model manifold is not homogeneous (CFT5f) and its parameters are coordinates')],
  bounds=['Verdict (2026-11-13, from STRUCTURAL CONNECTION / USEFUL ANALOGY / TOO WEAK / FAIL): STRUCTURAL CONNECTION for the parameter-limit → degenerate-boundary role only (both a rank drop; Quinn et al. 2023 treat c as a model parameter, PDF quote pending); TOO WEAK for "rules constrain allowed states" stated generally (every constraint does that); the invariant-form role: FAIL as a transfer (model parameters are not structure constants).',
          'Spacetime geometry ≠ model-manifold geometry (Gate 3).'],
  acts=['Guide'], audit=MM_AUDIT, related=['T-MM-RULES-Q', 'T-C-ROLES', 'T-MM-DISTINGUISHED-Q'], ref='model-manifold audit, c verdict')
T('T-ZERO-LENGTH', 'A zero geometric length exposes non-identifiability', 'a zero geometric length can expose hidden non-identifiability / redundancy.', RD, U, 'derived-connection', 'derived',
  norm='For a Fisher metric g = JᵀΣ⁻¹J (Σ SPD), g(v, v) = 0 ⟺ Jv = 0: a zero-length tangent vector is a first-order non-identifiable direction (exact, any chart, any SPD noise model). A curve whose tangent has zero length everywhere is a set of parameter values with identical predictions (exact redundancy, FB7a). Distinct from a sloppy direction (small, nonzero), a Lorentz null (vᵀηv = 0 with ηv ≠ 0) and a collapsed zero of a lossy map.',
  pro=[('card:FB7b', 'uᵀgu = 0 ⟺ Ju = 0 ⟺ gu = 0'), ('card:FB7a', 'a zero-length curve: θ₁ + θ₂ fixed'), ('card:MMIe', 'the null survives a change of noise model'), ('card:CFT5d', 'and a change of chart')],
  con=[('card:FB7c', 'a sloppy direction is not a zero length'), ('card:FB7d', 'a Lorentz null is not a kernel vector')],
  bounds=['PROJECT-DERIVED FROM ESTABLISHED MATHEMATICS; first-order statement. Global identifiability needs the whole fiber Y⁻¹(Y(θ)) (F-C is 2-to-1 by exchange off the diagonal while g has full rank there).'],
  acts=['Guide'], audit=MM_AUDIT, related=['T-INFOGEO', 'T-GEOM-INFO-Q'], ref='model-manifold audit, null')
T('T-MM-OBSERVE', 'Observation as a map to a restricted manifestation', 'Can observation or measurement be modeled geometrically as a map from a richer state/representation space to a more restricted observable manifestation?', RD, U, 'open-question', 'open',
  pro=[('card:W2a', 'non-selective S² measurement: ρ ↦ P_t ρ P_t + P_s ρ P_s removes the sector coherence (an information-changing map)'), ('card:W2d', 'the same map as two-path which-path dephasing'), ('card:RIC1a', 'a classical reduction with stated survivors, collapses and fiber')],
  con=[('card:Q2b', 'states with the same zero can look identical to every blind descriptor: a manifestation need not determine its source')],
  bounds=['OPEN CONNECTION. Exact only for stated maps: quantum non-selective measurement / dephasing, projections, coarse-graining, boundary limits. No general measurement theory is claimed. Observation here means measurement, interaction or which-path information.'],
  acts=['Guide'], audit=MM_AUDIT, related=['T-VIEWER-FORM', 'T-REDUCTION-ARCH', 'T-SOURCE-MANIFEST', 'T-QUANTUM-ZERO', 'T-MM-STORY'], ref='model-manifold audit, observation')
T('T-VIEWER-FORM', 'Matter does not form until a viewer looks at it (historical intuition)', 'matter does not form until a viewer looks at it.', RD, U, 'philosophical-exploration', 'open',
  norm='What changes when a richer state/representation becomes an observable manifestation?',
  variants=[('What changes when a richer state/representation becomes an observable manifestation?', RD)],
  bounds=['ORIGINAL VERBATIM NOT RECOVERED: recorded as given on 2026-11-13 ("approximately"); the historical wording is not in the repository.',
          'ORIGINAL USER INTUITION; PHILOSOPHICAL / QUANTUM-INTERPRETIVE; NOT ESTABLISHED PHYSICS.',
          'conscious observer requirement = NOT ESTABLISHED. The investigable part is the normalized question: which maps from a richer state to an observable manifestation exist, and what each keeps, removes or creates (T-MM-OBSERVE). Both wordings are kept.'],
  acts=['Final'], audit=MM_AUDIT, related=['T-MM-OBSERVE', 'T-SUBCONSCIOUS', 'T-PHYSICAL-MANIFEST-Q'], ref='model-manifold audit, quantum-like')
T('T-PHYSICAL-MANIFEST-Q', 'Physical manifestation through a geometry of constraints?', 'Could physical manifestation eventually be understood through a similar geometry-of-constraints framework?', RD, U, 'open-question', 'open',
  bounds=['PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS, long-term. No physical theory or data in the repository addresses it; a mathematical construction is not physical validation.'],
  acts=['Final'], audit=MM_AUDIT, related=['T-VIEWER-FORM', 'T-MM-OBSERVE', 'T-RULES-GEOMETRY'], ref='model-manifold audit, quantum-like')
T('T-GEOM-INFO-Q', 'Can geometry encode accessible and indistinguishable information?', 'Can geometry encode what information is accessible, inaccessible, or indistinguishable in a representation?', RD, U, 'open-question', 'open',
  variants=[('What does the geometry say about distinguishability?', RD)],
  pro=[('card:FB7b', 'local: a zero-length direction is first-order indistinguishable'), ('card:MMId', 'Fisher length = prediction-space distance (local distinguishability)'), ('card:Q2b', 'quantum: same zero, descriptors that cannot distinguish')],
  bounds=['Exact locally for Fisher geometry (distinguishability per unit noise). Shannon, identifiability, reconstruction, phase and quantum information are different quantities (research/model_manifold_story.md, information distinctions); no single geometry is claimed to encode them all.'],
  acts=['Guide'], audit=MM_AUDIT, related=['T-ZERO-LENGTH', 'T-MAGPHASE', 'T-SAME-SPECTRUM', 'T-QUANTUM-ZERO'], ref='model-manifold audit, information')
T('T-SIMPLER-BOUNDARY-Q', 'Simpler observable structure as a boundary of a richer model?', 'Can simpler observable structure emerge as a boundary/reduction of a richer model?', RD, U, 'open-question', 'open',
  pro=[('card:MMIg', 'the one-exponential model is a boundary of the two-exponential model'), ('card:FB11c', 'what survives: θ₁'), ('card:C9b', 'Newtonian kinematics as the c → ∞ boundary of the form')],
  bounds=['Exact for stated limits (paper-backed: Transtrum–Qiu 2014, Quinn et al. 2023). A limit is not a map on states: the Reduction architecture records it as a family degeneration, not as Φ: X → Y.'],
  acts=['Guide'], audit=MM_AUDIT, related=['T-EFFECTIVE-Q', 'T-REDUCTION-ARCH', 'T-MM-STORY'], ref='model-manifold audit, boundaries')

# ── C7 construction pass 1 (2026-11-15) ──
C7_AUDIT = ('missing', 'stated in the C7 construction pass 1 brief (2026-11-15)')
C7REC = 'research/constructions/c7_fourier_width.md'
ACTS_ALREADY_NEW |= {'T-C7-GOV', 'T-C7-BRIDGE', 'T-C7-SPECTRAL-CHAIN', 'T-C7-UNIFORM', 'T-C7-NOT-NECESSARY', 'T-TMS-WIDTHS'}
T('T-C7-GOV', 'C7: do not force a positive theorem', 'Do not force a positive theorem.', RD, U, MR, GOV,
  variants=[('Do not invent another connection merely to rescue C7.', RD), ('A restricted theorem, upper-bound theorem, equivalence under assumptions, or exact counterexample is an acceptable C7 result.', RD)],
  norm='Method / governance rule for C7: a restricted theorem, an upper bound, an equivalence under assumptions or an exact counterexample are all acceptable outcomes; a failed arrow is preserved and named, never rescued by a new connection.',
  acts=['Guide'], audit=C7_AUDIT, related=['T-C7', 'T-C7-BRIDGE'], ref='C7 pass 1, 0')
T('T-C7-BRIDGE', 'C7 bridge: spectral coefficient decay ⟹ prediction-space width hierarchy', 'Fourier / spectral coefficient decay ⟹ coordinate-independent prediction-space width hierarchy', RD, U, 'derived-connection', 'derived',
  norm='C7-R (restricted): if the cosine-Fourier coefficients of F_θ(φ) = f_θ(cos φ) (equivalently the Chebyshev coefficients of f_θ) obey a FAMILY-WIDE envelope |a_k(θ)| ≤ r_k with Σ r_k < ∞, then the model image Y(Θ) at N sample points lies in V_m D_m·[−1, 1]^m ⊕ [−R_m, R_m]^N, R_m = Σ_(k≥m) r_k, so its extent along every direction u is ≤ 2‖D_m V_mᵀu‖₁ + 2R_m‖u‖₁, its distance to an m-dimensional subspace is ≤ √N R_m, and the function family has Kolmogorov m-width ≤ R_m in C[−1, 1]. The bound is reparametrization-invariant, metric- and sampling-dependent, an UPPER bound only, and not necessary for a hierarchy.',
  pro=[('card:C7a', 'exact coefficient identity'), ('card:C7f', 'evaluation operator and enclosure'), ('card:C7h', 'axes: exact at Chebyshev nodes; Quinn Theorem 2'), ('card:C7i', 'tail bound'),
       ('card:C7k', 'reparametrization-invariant'), ('card:C7s', 'N-independent function-space form'), ('card:C7t', 'holds on the project\'s F-C model')],
  con=[('card:C7d', 'pointwise decay without a uniform envelope gives nothing'), ('card:C7n', 'a hierarchy can occur without coefficient decay'), ('card:C7q', 'the bound overestimates the actual widths 2–5×'),
       ('card:C7l', 'metric-dependent'), ('card:C7m', 'sampling-dependent')],
  bounds=['Principal status C7-KNOWN-REFORMULATION: Quinn, Wilber, Townsend, Sethna 2019 (arXiv v1) plus standard approximation theory after x = cos φ; elementary extensions only (general envelope, zonotope form, exact axes at Chebyshev nodes). Novelty: reformulation.',
          'RESTRICTED STRUCTURAL CONNECTION, not universal: sufficient, upper-bound, for uniformly enveloped families on an interval.'],
  acts=['Guide'], audit=C7_AUDIT, related=['T-C7', 'T-C7-SPECTRAL-CHAIN', 'T-C7-UNIFORM', 'T-C7-NOT-NECESSARY', 'T-INFOGEO'], ref='C7 pass 1')
T('T-C7-SPECTRAL-CHAIN', 'Orthogonal spectral representation → hierarchical model geometry', 'orthogonal spectral representation → decay of representation coefficients → bounded accessible directions in prediction space → hierarchical model geometry', RD, U, 'derived-connection', 'derived',
  variants=[('If this chain is proved only under restricted assumptions, label it RESTRICTED STRUCTURAL CONNECTION, not universal.', RD)],
  norm='Arrow by arrow (C7 pass 1): orthogonal representation → coefficient decay: a uniform envelope of cosine-Fourier / Chebyshev coefficients (hypothesis, exact identity C7a); → bounded accessible directions: the enclosure Y(Θ) ⊆ V_m D_m·[−1, 1]^m ⊕ [−R_m, R_m]^N (theorem, C7f–C7i); → hierarchical model geometry: only as an UPPER bound on the image\'s widths (C7o–C7q), not as its width spectrum, and not necessary (C7n).',
  pro=[('card:C7f', ''), ('card:C7h', ''), ('card:C7u', 'verdict')], con=[('card:C7o', 'bound, not width'), ('card:C7n', 'not necessary')],
  bounds=['RESTRICTED STRUCTURAL CONNECTION (Nadia\'s label for a chain proved only under restricted assumptions).'],
  acts=['Guide'], audit=C7_AUDIT, related=['T-C7-BRIDGE', 'T-C7'], ref='C7 pass 1, 13')
T('T-C7-UNIFORM', 'Pointwise spectral decay does not constrain the global geometry', 'A single function having fast Fourier decay does not automatically constrain the global geometry of the entire model image.', RD, U, 'established', 'established',
  pro=[('card:C7d', 'f_θ = cos(θx): every member super-geometric, no uniform envelope, no width hierarchy (σ_6/σ_1 = 0.980)')],
  bounds=['The bridge needs a family-wide envelope sup_θ |a_k(θ)| ≤ r_k; Quinn\'s Theorem 1 states its bound "uniformly in θ".'],
  acts=['Guide'], audit=C7_AUDIT, related=['T-C7-BRIDGE'], ref='C7 pass 1, 6')
T('T-C7-NOT-NECESSARY', 'Hierarchies need not come from smoothness', 'A model can potentially possess hierarchical widths for reasons unrelated to Fourier/Chebyshev smoothness.', RD, U, 'established', 'established',
  pro=[('card:C7n', 'θT_20: a one-width image with no coefficient decay'), ('card:C7m', 'clustered sampling: hierarchy from a flat envelope')],
  bounds=['Coefficient decay is SUFFICIENT for the enclosure bound and NOT NECESSARY for a hierarchy; the implication is not reversed.'],
  acts=['Guide'], audit=C7_AUDIT, related=['T-C7-BRIDGE'], ref='C7 pass 1, 12')
T('T-TMS-WIDTHS', 'Geodesic widths along chart eigendirections are not an invariant spectrum', 'Geodesic length itself is coordinate invariant, but a collection of widths selected by coordinate-dependent eigendirections need not automatically define an invariant width spectrum.', RD, U, 'established', 'established',
  variants=[('Do NOT assume that “Transtrum geodesic widths” are a coordinate-independent invariant object merely because geodesic length is invariant.', RD)],
  pro=[('card:MMPg', 'the metric eigendirections, pushed to prediction space, rotate with the chart (0.626°, 4.43°)'), ('source:research/sources/tms2011.md', 'widths along "each of the eigendirections of the metric" from "some point located near the center"')],
  bounds=['Transtrum-style widths are not used as C7\'s primary invariant object; the Quinn-style enclosure is.'],
  acts=['Guide'], audit=C7_AUDIT, related=['T-C7', 'T-INFOGEO'], ref='C7 pass 1, 1')

# ── Final adversarial C7 lock / audit (2026-11-16) ──
C7L_AUDIT = ('missing', 'stated in the final adversarial C7 lock / audit brief (2026-11-16)')
ACTS_ALREADY_NEW |= {'T-C7-LOCK', 'T-C7-R', 'T-C7-FRAW', 'T-C7-FINV', 'T-C7-LB', 'T-C7-CHAIN-FINAL'}
T('T-C7-LOCK', 'C7 enclosure branch locked', 'After this pass, the Fourier/Chebyshev/model-manifold enclosure branch should be considered LOCKED unless the audit discovers a genuine mathematical failure.', RD, U, MR, GOV,
  variants=[('This pass is for closing the current branch, not opening the next one.', RD), ('Do not attempt to solve C7-F(inv).', RD)],
  norm='Method / governance rule: C7-R is locked after the final audit (2026-11-16, decision LOCK C7-R / CLOSE THIS BRANCH); reopening needs a genuine mathematical failure. C7-F(inv) and C7-LB+ are separate future questions, not part of this branch.',
  acts=['Guide'], audit=C7L_AUDIT, related=['T-C7-R', 'T-C7-FINV', 'T-C7'], ref='C7 lock')
T('T-C7-R', 'C7-R: representation / enclosure bridge (locked)', 'C7-R — representation/enclosure bridge', RD, U, 'derived-connection', 'derived',
  variants=[('C7-R = KNOWN-REFORMULATION', RD)],
  norm='C7-R (final, locked 2026-11-16): for F = {f_θ} ⊆ C[−1, 1] with a family-wide envelope |a_k(θ)| ≤ r_k on the Chebyshev (= cosine-Fourier of f_θ∘cos) coefficients, Σ r_k < ∞, and N sample points in a Euclidean prediction space: (1) d_m(F; C[−1, 1]) ≤ R_m = Σ_(k≥m) r_k; (2) Y(Θ) ⊆ V_mD_m·[−1, 1]^m ⊕ [−R_m, R_m]^N (exact Minkowski enclosure); (3) width_u ≤ 2‖D_mV_mᵀu‖₁ + 2R_m‖u‖₁; (4) Y(Θ) ⊆ E(2(m·V_mD_m²V_mᵀ + NR_m²I)); (5) exact axes at Gauss–Chebyshev (first-kind) nodes, unweighted; (6) geometric envelope from uniform analyticity (even, 2π-periodic strip form); (7) all set-level, unchanged by reparametrizations that keep the set. Upper bound only.',
  pro=[('card:C7Lp', 'final status'), ('card:C7Le', 'proved enclosing ellipsoid'), ('card:C7Lb', 'error-box support function'), ('card:C7Lh', 'exact analyticity statement'), ('card:C7Li', 'node convention'), ('card:C7Lk', 'Kolmogorov width'), ('card:C7Lo', 'set-level invariance')],
  con=[('card:C7Ll', 'no lower bound from an envelope alone'), ('card:C7Lc', 'Quinn\'s Eq. (2) additive ellipsoid fails (Euclidean reading)')],
  bounds=['FINAL STATUS: KNOWN-REFORMULATION; transfer depth RESTRICTED STRUCTURAL CONNECTION; LOCKED (2026-11-16). Refines the pass-1 umbrella status of T-C7-BRIDGE (kept).'],
  acts=['Guide'], audit=C7L_AUDIT, related=['T-C7-BRIDGE', 'T-C7-LOCK', 'T-C7-LB', 'T-C7-FRAW', 'T-C7-FINV'], ref='C7 lock, 6')
T('T-C7-FRAW', 'C7-F(raw): coefficient decay vs raw Fisher spectrum', 'C7-F(raw) — Fourier/coefficient decay vs raw Fisher/sloppy eigenvalue spectrum', RD, U, 'historical-conjecture', 'hypothesis',
  variants=[('C7-F(raw) = FAIL', RD), ('spectral hierarchy ⟹ universal Fisher hierarchy', RD)],
  norm='The raw-spectrum reading of C7: output coefficient decay implies a decay of the raw Fisher / sloppy eigenvalues, universally and chart-independently.',
  con=[('card:C7Lm', 'θ = aφ gives g_φ = a²g_θ; θ = θ₀ + A(φ − φ₀) realizes any positive spectrum, with the function set unchanged'), ('card:C7Lq', 'final status FAIL'), ('card:MMIb', 'raw eigenvalues are chart-dependent'), ('card:CFT5e', 'component eigenvalues are not invariants')],
  bounds=['FINAL STATUS: FAIL as an invariant universal claim (2026-11-16). Kept as a historical conjecture, superseded by the invariant question T-C7-FINV; the original C7 wording stays in T-C7.'],
  sup='T-C7-FINV', acts=['Guide'], audit=C7L_AUDIT, related=['T-C7', 'T-C7-FINV'], ref='C7 lock, 6')
T('T-C7-FINV', 'C7-F(inv): invariant reformulation (open)', 'C7-F(inv) — invariant reformulation', RD, U, 'open-question', 'open',
  variants=[('C7-F(inv) = OPEN', RD)],
  norm='Which independently supplied structure (a parameter metric h transforming as a tensor and a prediction metric W; generalized eigenvalues of a metric pair; or prediction-space geometric widths) would make a spectral comparison with coefficient decay invariant, and does coefficient decay then control it? Not attempted.',
  pro=[('card:C7Ln', 'with a tensor h and a metric W, σ(W^(1/2)J_Yh^(−1/2)) is invariant; with h = I in every chart it is not')],
  bounds=['FINAL STATUS: OPEN (2026-11-16). A separate future research question; the C7-R lock does not cover it.'],
  supers='T-C7-FRAW', acts=['Guide'], audit=C7L_AUDIT, related=['T-C7', 'T-C7-FRAW', 'T-C7-LOCK'], ref='C7 lock, 6')
T('T-C7-LB', 'An envelope alone gives no lower bound on actual widths', 'Envelope alone ⇏ nonzero actual-width lower bound.', RD, U, 'established', 'established',
  pro=[('card:C7Ll', 'families of arbitrarily small diameter, and the singleton {0}, satisfy every envelope')],
  bounds=['FINAL STATUS of the claim "an envelope gives a nonzero lower bound": FAIL (2026-11-16). A lower bound would need occupancy of a coefficient region, surjectivity, a bi-Lipschitz map θ ↦ a(θ) or a lower singular-value bound: a future optional branch (C7-LB+, OPEN), not pursued.'],
  acts=['Guide'], audit=C7L_AUDIT, related=['T-C7-R', 'T-C7-BRIDGE'], ref='C7 lock, 9')
T('T-C7-CHAIN-FINAL', 'The surviving spectral chain', 'orthogonal spectral representation → coefficient hierarchy → restricted accessible coefficient region → bounded prediction-space directions', RD, U, 'derived-connection', 'derived',
  pro=[('card:C7Lp', 'C7-R final'), ('card:C7a', 'coefficient identity'), ('card:C7Le', 'enclosure')], con=[('card:C7Lm', 'not a universal Fisher hierarchy'), ('card:C7Ll', 'no lower bound')],
  bounds=['Holds for uniformly enveloped families as an upper-bound statement about accessible prediction-space directions; it is not "spectral hierarchy ⟹ universal Fisher hierarchy" (T-C7-FRAW, FAIL).'],
  acts=['Guide'], audit=C7L_AUDIT, related=['T-C7-SPECTRAL-CHAIN', 'T-C7-R', 'T-C7-FRAW'], ref='C7 lock, 15')

# ── Act VIII first construction pass (2026-11-16): finite/infinite representation, H3, ★, c ──
A8_AUDIT = ('missing', 'stated in the Act VIII first construction pass brief (2026-11-16)')
A8_REC = 'research/constructions/act8_finite_infinite_h3_c.md'
ACTS_ALREADY_NEW |= {'T-ACT8-GOV', 'T-UNBOUNDED-EVOLUTION', 'T-COMPACT-NOT-PERIODIC', 'T-H3-ACTION', 'T-H3-QUOTIENT', 'T-H3-C', 'T-STAR-A', 'T-STAR-B', 'T-STAR-C'}
T('T-ACT8-GOV', 'Act VIII: H3 and ★ kept apart; t and c kept apart', 'Do not merge H3 with ★.', RD, U, MR, GOV,
  variants=[('Do not assume H3 is true.', RD), ('Do not merge the time parameter t with the theory parameter c.', RD), ('Do not rescue H3 by broadening it until it becomes unfalsifiable.', RD),
            ('Do not rewrite ★ into whichever version survives.', RD), ('The word “infinite” must no longer be used without naming the object.', RD),
            ('Do not call either candidate H3 until the comparison with the original wording is complete.', RD), ('Do not use “geometry” where the dynamics/action is doing the work.', RD)],
  norm='Method / governance rule (Act VIII, 2026-11-16): H3-original (T-H3) and STAR-original (T-STAR) are investigated separately and their hierarchy is not decided; t (an action parameter) and c (a family parameter) are not merged; candidate formalizations get separate records and are not renamed H3; "infinite" always names its object (parameter domain, lift, cycle count, orbit).',
  acts=['II–IV'], audit=A8_AUDIT, related=['T-H3', 'T-STAR', 'T-H3-ACTION', 'T-H3-QUOTIENT', 'T-H3-C', 'T-STAR-A', 'T-STAR-B', 'T-STAR-C'], ref='Act VIII, 2')
T('T-UNBOUNDED-EVOLUTION', 'Corrected intuition: unbounded parameter, bounded geometry', 'An unbounded parameter can generate indefinitely continuing evolution in a bounded geometry.', RD, U, 'established', 'established',
  variants=[('But do not yet elevate that to H3.', RD)],
  norm='Instance: t ∈ ℝ, Φ_t(z) = e^(iωt)z on the compact S¹; the parameter, the lift ωt and the cycle count are unbounded while the image is S¹ and the values stay in [−1, 1].',
  pro=[('card:A8Ca', 'group action; |γ_ω(t)| = 1 for every t'), ('card:A8Cd', 'lift and cycle count unbounded; image S¹')],
  bounds=['Act VIII (2026-11-16): ESTABLISHED INSTANCE (the circle). Preserved and not elevated to H3. It does not say which behaviour occurs: compact images also carry non-periodic (A8X1) and non-recurrent (A8X3) evolutions.'],
  acts=['II–IV'], audit=A8_AUDIT, related=['T-TIME-CIRCLE', 'T-TIME-CIRCLE-0', 'T-H3', 'B-FINITE-INFINITE'], ref='Act VIII, 3')
T('T-COMPACT-NOT-PERIODIC', 'A compact image does not force an exact periodic orbit', 'compact/constrained image ⇏ exact periodic orbit', RD, U, 'established', 'established',
  variants=[('Do not call an irrational torus flow periodic.', RD)],
  norm='On the compact torus T² the flow (θ₁ + t, θ₂ + √2t) preserves |z₁| = |z₂| = 1, has no fixed point and no periodic orbit (Stab = {0} at every point); on the compact interval [0, 1] the logistic flow has no non-constant periodic orbit.',
  pro=[('card:A8X1', 'irrational torus: no periodic orbit at all'), ('card:A8X3', 'logistic flow on [0, 1]'), ('card:A8Ra', 'compact ⇒ periodic rejected'), ('card:A8Tc', 'near return without exact return')],
  supers='T-STAR-A', acts=['II–IV'], audit=A8_AUDIT, related=['T-STAR', 'T-STAR-A', 'T-CIRCLE-NOT-THESIS'], ref='Act VIII, 6')
T('T-H3-ACTION', 'H3-action: an unbounded parameter acting on a constrained state space', 'H3-CANDIDATE: An unbounded parameter acting on a constrained state space can produce bounded, periodic, quasi-periodic, or recurrent observable structure; which behavior occurs is controlled not by unboundedness itself but by the action, its stabilizer, orbit closure, and invariants.', RD, U, 'derived-connection', 'derived',
  norm='For a continuous action Φ of (ℝ, +) on a Hausdorff space X: Stab(x) ∈ {ℝ, Tℤ, {0}} (closed subgroups of ℝ); periodicity ⟺ Stab ≠ {0}; free orbits split by orbit-closure compactness and recurrence. The same unbounded parameter domain produces every class (A8Da), so unboundedness decides nothing. Correction to the worded clause "and invariants": preserved invariants confine the orbit to a level set but do not decide the class; on tori the integer relations of the generator decide (A8Ua).',
  pro=[('card:A8Pa', 'stabilizer trichotomy'), ('card:A8Pb', 'free orbits are not one class'), ('card:A8Da', 'the parameter domain is unbounded in every row while every behaviour varies'), ('card:A8Ca', ''), ('card:A8Tb', ''), ('card:A8X2', '')],
  con=[('card:A8Ua', 'same invariants, different behaviour: the "invariants" clause is corrected'), ('card:A8X6', 'a parameter that indexes without acting is outside the candidate')],
  bounds=['Act VIII (2026-11-16): PROJECT SYNTHESIS of definitions and known theorems (stabilizer trichotomy, Kronecker–Weyl, Poincaré recurrence); one clause corrected. Candidate only: not renamed H3; H3-original (T-H3) is kept.'],
  acts=['II–IV'], audit=A8_AUDIT, related=['T-H3', 'T-H3-QUOTIENT', 'T-SCHEMA', 'T-ACT8-GOV'], ref='Act VIII, 10')
T('T-H3-QUOTIENT', 'H3-quotient: quotient / cover / orbit closure encodes the bound', 'The distinction between an unbounded parameter and a bounded representation is naturally encoded by a quotient, covering map, orbit, or compact orbit closure.', RD, U, 'derived-connection', 'derived',
  norm='Restricted form: for Stab = Tℤ the orbit is ℝ/Tℤ ≅ S¹ and ℝ → S¹ is a covering (A8Ce, A8Cf); for free recurrent orbits the bounded representation is the compact orbit closure (A8Tb). With the alternative "orbit" the statement is true of every action (too broad). Boundary approach is encoded by none of quotient, covering or compact closure: the velocity orbit is injective with noncompact closure and is conjugate to translation (A8Pg).',
  pro=[('card:A8Ce', 'ℝ/Tℤ ≅ S¹'), ('card:A8Cf', 'covering ℝ → S¹'), ('card:A8Tb', 'compact orbit closure without a quotient')],
  con=[('card:A8Pg', 'boundary approach ≅ drift: no quotient, cover or compact closure')],
  bounds=['Act VIII (2026-11-16): RESTRICTED (periodic and compact-recurrent classes); too broad as worded because of "orbit". Candidate only: not renamed H3.'],
  acts=['II–IV'], audit=A8_AUDIT, related=['T-H3', 'T-H3-ACTION', 'T-SCHEMA'], ref='Act VIII, 10')
T('T-H3-C', 'H3-c: c as an instance of the H3 structure', 'that invarient variable like the speed of light which also converges to infinity is an invarient variable that acts as a rule in the manifold', P, U, 'hypothesis', 'hypothesis',
  norm='Tested reading: c → ∞ is an instance of the time–circle construction (an unbounded parameter through a constrained geometry). Result: t is an internal action parameter on a fixed state space; c is an external family index (not an action on spacetime) whose family is a free orbit of the dilation congruence action on forms, drifting to the degenerate diag(1, 0). Surviving restricted correspondence: both examples are one-parameter subgroups preserving a quadratic form (CF1/S4), with t ↔ rapidity s and the circle radius r ↔ c; no member or limit of the c-family is elliptic.',
  pro=[('card:A8La', 'c fixes the preserved form (Role 2)'), ('card:A8Mc', 'c → ∞: degenerate limit (Role 3)'), ('card:A8Lc', 'group contraction'), ('card:A8Sb', 'restricted correspondence t ↔ s, r ↔ c')],
  con=[('card:A8Sa', 'c is not a group parameter on spacetime'), ('card:A8X5', 'c → ∞ with β fixed: no contraction'), ('card:A8Sb', 'never elliptic: the wrapping mechanism does not transfer')],
  bounds=['Act VIII (2026-11-16): RESTRICTED. Same construction as t ↦ e^(iωt): NO (FAIL); "c also converges to infinity" like t: SUPERFICIAL; restricted structural analogy through the known preserved-form object. The words are the c-clause of H3-original, kept verbatim.'],
  acts=['II–IV', 'Guide'], audit=A8_AUDIT, related=['T-H3', 'T-C-ROLES', 'T-C9', 'T-ACT8-GOV'], ref='Act VIII, 16–17')
T('T-STAR-A', 'STAR-A: constrained geometry forces periodicity', 'A constrained geometry forces every admissible evolution to be periodic.', RD, U, 'historical-conjecture', 'hypothesis',
  con=[('card:A8X1', 'compact T², preserved invariants, no periodic orbit'), ('card:A8X3', 'compact [0, 1], no non-constant periodic orbit'), ('card:A8Ra', 'compact ⇒ periodic rejected')],
  bounds=['Act VIII (2026-11-16): FAIL. A reading of ★ (T-STAR), which keeps its wording; superseded by the established negative T-COMPACT-NOT-PERIODIC.'],
  sup='T-COMPACT-NOT-PERIODIC', acts=['II–IV'], audit=A8_AUDIT, related=['T-STAR', 'T-STAR-B', 'T-STAR-C'], ref='Act VIII, 9')
T('T-STAR-B', 'STAR-B: constrained geometry admits a periodic evolution', 'A constrained geometry admits at least one periodic evolution.', RD, U, 'derived-connection', 'derived',
  norm='Restricted form: with fixed points counted as periodic the claim is vacuous (the trivial flow); for a non-constant periodic orbit it is false on ℝ and on intervals (orbits are monotone), true on S¹, and true on every smooth manifold of dimension ≥ 2 (rotation field in a coordinate disk times a bump function; local model A8X4; the general construction is a project argument, not carded). It depends on the class of spaces and dynamics, not on "bound by rules".',
  pro=[('card:A8Pe', 'trivial flow; monotone orbits on intervals; circle has periodic orbits'), ('card:A8X4', 'local model: rotation of ℝ²')],
  bounds=['Act VIII (2026-11-16): RESTRICTED. A reading of ★ (T-STAR), which keeps its wording.'],
  acts=['II–IV'], audit=A8_AUDIT, related=['T-STAR', 'T-STAR-A', 'T-STAR-C'], ref='Act VIII, 9')
T('T-STAR-C', 'STAR-C: constrained geometry tends to produce recurrence', 'Compact/constrained geometry tends to produce recurrence or near return.', RD, U, 'derived-connection', 'derived',
  norm='Restricted form = the Poincaré recurrence theorem: for a measure-preserving flow on a space of finite total measure, almost every point is recurrent. Each hypothesis is needed (A8Pd: infinite measure — cylinder; non-invariant Lebesgue — logistic; δ₀ the only invariant probability — θ̇ = 1 − cos θ on S¹). Compactness alone gives only topological recurrence of some point (minimal sets), source-only here.',
  pro=[('card:A8Pd', 'every hypothesis needed; almost-every conclusion'), ('card:A8Tc', 'near return on the torus')],
  bounds=['Act VIII (2026-11-16): RESTRICTED to Poincaré recurrence (known; PROVED under its hypotheses). A reading of ★ (T-STAR), which keeps its wording.'],
  acts=['II–IV'], audit=A8_AUDIT, related=['T-STAR', 'T-STAR-A', 'T-STAR-B'], ref='Act VIII, 9')

# ── Act VIII story-integration and mathematical-correction pass (2026-11-16) ──
A8S_AUDIT = ('missing', 'stated in the Act VIII story-integration pass brief (2026-11-16)')
ACTS_ALREADY_NEW |= {'T-H3-C-DIRECT', 'T-H3-GROUP', 'T-H3-C-FAMILY', 'T-GEOM-GEN-DYN', 'T-STAR-A-LESSON', 'T-GEN-DYN-Q'}
T('T-H3-C-DIRECT', 'H3-c-direct: unbounded t compared literally with c → ∞', 'H3-c-direct: literal analogy between unbounded time t and c→∞. Status: FAIL / superficial.', RD, U, 'historical-conjecture', 'hypothesis',
  norm='The literal analogy: c → ∞ plays the role that unbounded time t plays in t ↦ e^(iωt) ∈ S¹.',
  con=[('card:A8Sa', 'c is not a group parameter on spacetime'), ('card:A8Wa', 'the Lorentz group parameter is the rapidity φ, tanh φ = v/c'), ('card:A8Wb', 'no exact map "circle radius r ↔ c"')],
  bounds=['Story-integration pass (2026-11-16): FAIL / SUPERFICIAL. One of three records split from T-H3-C; not merged back. Superseded by the exact correspondence T-H3-GROUP (θ ↔ φ).'],
  sup='T-H3-GROUP', acts=['II–IV', 'Guide'], audit=A8S_AUDIT, related=['T-H3', 'T-H3-C', 'T-H3-C-FAMILY'], ref='Act VIII story pass, H3-c split')
T('T-H3-GROUP', 'H3-group: rotations and boosts as preserved-form one-parameter groups', 'H3-group: circle rotations and Lorentz boosts are both one-parameter symmetry groups preserving quadratic forms and satisfying the generator equation. Status: established structural pattern in the canonical examples.', RD, U, 'established', 'established',
  norm='For constant M and A(s) = e^(sK): KᵀM + MK = 0 ⟺ A(s)ᵀMA(s) = M (A8Ga). Canonical instances: e^(θJ) on (ℝ², I) and e^(φK) on (ℝ², η), with θ ↔ φ as group parameters (tanh φ = v/c); the continuation types differ (K² = −det(K)·I: elliptic vs hyperbolic; A8Ec).',
  pro=[('card:A8Ga', 'generator theorem'), ('card:A8Gb', 'six supplied forms'), ('card:A8Ea', 'SO(2)'), ('card:A8Eb', 'SO(1,1)'), ('card:A8Ec', 'same equation, different continuation')],
  bounds=['Story-integration pass (2026-11-16): ESTABLISHED INSTANCE (established structural pattern in the canonical examples; the generator theorem is proved). An exact canonical 2D comparison: signature alone does not decide the dynamics in higher dimensions (A8Ec).'],
  supers='T-H3-C-DIRECT', acts=['II–IV', 'Guide'], audit=A8S_AUDIT, related=['T-H3', 'T-H3-C', 'T-H3-C-FAMILY', 'T-GEOM-GEN-DYN'], ref='Act VIII story pass, H3-c split')
T('T-H3-C-FAMILY', 'H3-c-family: c-indexed Lorentzian forms and their Galilean limit', 'H3-c-family: varying c indexes a family of Lorentzian structures/forms whose c→∞ limit is singular and whose Lorentz transformations have a Galilean limit under fixed-v scaling. Status: restricted/established pieces; project connection to H3 remains open.', RD, U, 'derived-connection', 'derived',
  norm='Established pieces: M_c → diag(1, 0) outside every congruence class (A8Mc); fixed-v Galilean boost limit (A8Lb); contraction Poincaré(1+1) → Galilei(1+1) (A8Lc); the family M_κ = diag(1, κ), K_κ = [[0, κ], [−1, 0]] with κ = −1/c² for boosts and κ = ω² for the oscillator, both reaching the parabolic member κ = 0 when the physical variables are held fixed (A8Qa). Restricted: every limit depends on the scaling held fixed (A8X5, A8Qb).',
  pro=[('card:A8Mc', ''), ('card:A8Lb', ''), ('card:A8Lc', ''), ('card:A8Qa', 'the κ-family'), ('card:A8Wc', 'restricted content of c')], con=[('card:A8X5', 'β fixed: nothing contracts'), ('card:A8Qb', 'normalized circle: no contraction')],
  bounds=['Story-integration pass (2026-11-16): RESTRICTED (established pieces); the project connection to H3 remains OPEN. One of three records split from T-H3-C; not merged back.'],
  acts=['II–IV', 'Guide'], audit=A8S_AUDIT, related=['T-H3', 'T-H3-C', 'T-C-ROLES', 'T-C9'], ref='Act VIII story pass, H3-c split')
T('T-GEOM-GEN-DYN', 'Geometry constrains the action; the generator decides the continuation', 'geometry constrains the admissible symmetry/action structure, but the generator/action determines whether the resulting orbit is periodic, recurrent, hyperbolic, dense, or drifting.', RD, U, 'derived-connection', 'derived',
  norm='Formal content only as M ↦ (G_M, 𝔤_M): the supplied form fixes the admissible transformations and generators (CF1, CF4, A8Ga); for K ∈ 𝔤_M the orbit type of e^(sK) is fixed by K — the sign of det K for traceless 2×2 K (A8Ec), the integer relations of ω on tori (A8Ua) — not by M alone (three generator types on diag(1, 1, −1), A8Ec).',
  pro=[('card:A8Ga', ''), ('card:A8Ec', ''), ('card:A8Ua', ''), ('card:A8Gc', 'the equation is relative to the supplied form')],
  bounds=['Story-integration pass (2026-11-16): PROJECT SYNTHESIS, exact in the canonical examples (2×2 forms, tori, diag(1, 1, −1)); not a universal theorem — "geometry constrains" is defined here only as M ↦ (G_M, 𝔤_M). The main explanatory bridge GEOMETRY → DYNAMICS/CONTINUATION.'],
  acts=['II–IV'], audit=A8S_AUDIT, related=['T-STAR', 'T-STAR-A', 'T-STAR-A-LESSON', 'T-H3-ACTION', 'T-GEN-DYN-Q'], ref='Act VIII story pass')
T('T-STAR-A-LESSON', 'What STAR-A\'s failure teaches', 'geometry alone does not determine periodicity.', RD, U, 'established', 'established',
  variants=[('In particular, STAR-A failing must not be treated as equivalent to the Foundation/backbone failing.', RD)],
  norm='One compact torus with the same invariants carries periodic, subtorus and dense orbits, decided by the generator\'s integer relations (A8Ua); one Lorentzian form diag(1, 1, −1) carries elliptic, hyperbolic and parabolic generators (A8Ec).',
  pro=[('card:A8Ua', ''), ('card:A8Ec', ''), ('card:A8X1', '')],
  bounds=['Story-integration pass (2026-11-16): the lesson of STAR-A\'s FAIL (kept). It names the missing condition — the generator/action — and is not a failure of the Foundation backbone.'],
  acts=['II–IV'], audit=A8S_AUDIT, related=['T-STAR', 'T-STAR-A', 'T-GEOM-GEN-DYN'], ref='Act VIII story pass')
T('T-GEN-DYN-Q', 'Preserved relation → generator → dynamics', 'Given a preserved geometric relation, what transformations preserve it, what generators produce those transformations, and what observable dynamics follow?', RD, U, 'open-question', 'open',
  variants=[('preserved relation → preserving group → generator → one-parameter transformation → orbit/stabilizer → observable dynamics.', RD), ('Only apply this construction when the form and transformation family are independently supplied by the system.', RD)],
  norm='Answered exactly in the canonical rows (Euclidean/SO(2), Lorentz/SO(1,1), the Fourier character ℝ → U(1), multi-frequency torus flows; A8Ea, A8Eb, A8Fa, A8Ka); open in general.',
  pro=[('card:A8Ga', 'generator theorem'), ('card:A8Fa', 'Fourier character'), ('card:A8Ka', 'torus kernel')],
  acts=['II–IV'], audit=A8S_AUDIT, related=['T-GEOM-GEN-DYN', 'T-GEOM-RULES', 'T-STAR'], ref='Act VIII story pass')

PAIR_A = proof_target('Starting from the established common zero-sum form Σv_i = 0, identify all additional invariants/relations of the mass system that can be translated into mathematically meaningful tests on the directional cancellation system.',
                      requiredObjects=['the established shared form Σv_i = 0 (pair.A.sharedAlgebraicForm)'])
next(r for r in R if r['id'] == 'T-Q.pairA-transfer')['proofTarget'] = PAIR_A
next(r for r in R if r['id'] == 'T-Q.pairA-transfer')['construction'] = construction(
    sequence=['mass zero exposes structure → identify the structural information mathematically → ask what type of information a zero-state geometry can encode in general → construct the proton zero geometry → determine what structure emerges there'],
    doNotReason=['mass has center of mass → find center-of-mass analogue in proton zero', "transfer the source object's ontology"])

# Act map (2026-11-12, docs/act_map.md). Records stated before it keep their rev-3 labels in relatedActsRev3.
OLD_TO_NEW = {'I': ['I'], 'II': ['IV'], 'III': ['Guide'], 'IV': ['Guide'], 'V': ['Guide'], 'VI': ['Guide'], 'VII': ['Guide'],
              'VIII': ['II–IV'], 'IX': ['Final'], 'I–IX': ['all']}
VIII_TO_GUIDE = {'T-C-ROLES', 'T-C9', 'T-MANIFOLDS', 'T-PERCEPTION-RELATIVITY', 'T-MASS-WAVE', 'T-MASS-WAVE-Q', 'T-MATTER-FIELD', 'T-CONJUGACY'}
VIII_UNPLACED = {'T-NATURE-OR-DESCRIPTION', 'T-SUBCONSCIOUS', 'T-MATH-BOUNDARIES', 'T-REP-COMPLETE', 'T-4D-EVENTS'}
NEW_ACTS = {  # records stated at or after the outside-in clarification, placed directly in the new map
    'B-OUTSIDE-IN': ['all'], 'B-ZERO-PRESERVE': ['all'], 'B-NONEXHAUSTIVE': ['all'], 'T-GOR-MEANING': ['all'],
    'B-HIGHER-GEOMETRY': ['III'], 'B-FINITE-INFINITE': ['II', 'IV'], 'B-PART-WHOLE': ['III'], 'B-ORTHO-FORM': ['II'],
    'T-CIRCLE-ORTHO': ['II'], 'T-FIXED-RELATIONS-Q': ['II'], 'T-FINITE-GEOMETRIES-Q': ['II', 'IV'], 'T-STABLE-FORM-Q': ['IV'],
    'T-ZERO-ORTHOGONAL': ['I', 'II', 'III'], 'T-ZERO-ORTHOGONAL-A': ['II'], 'T-ZERO-ORTHOGONAL-B': ['II', 'Guide'],
    'T-ZERO-ORTHOGONAL-C': ['III'], 'T-ZERO-ORTHOGONAL-D': ['II'], 'T-EXISTENCE-ZERO': ['unplaced'], 'T-SPACE-EXPLORATION': ['unplaced'],
    'T-LOOK-INSIDE': ['unplaced'], 'T-IRREVERSIBLE-FORMATION': ['unplaced'], 'T-FRACTAL-PROPERTIES-Q': ['unplaced']}
for r in R:
    if r['id'] in ACTS_ALREADY_NEW:
        continue
    if r['audit']['before'] == 'new':
        if r['id'] in NEW_ACTS:
            r['relatedActs'] = NEW_ACTS[r['id']]
        continue
    old = r['relatedActs']
    new = []
    for a in old:
        m = OLD_TO_NEW[a]
        if a == 'VIII' and r['id'] in VIII_TO_GUIDE: m = ['Guide']
        if a == 'VIII' and r['id'] in VIII_UNPLACED: m = ['unplaced']
        new += [x for x in m if x not in new]
    r['relatedActsRev3'], r['relatedActs'] = old, new
    r['history'].append(dict(date=SPLIT, change=f"Act labels remapped to the new Act map (rev 3: {', '.join(old) or '—'})"))
for r in R:
    assert all(a in ('I', 'II', 'III', 'IV', 'II–IV', 'Guide', 'Final', 'all', 'unplaced') for a in r['relatedActs']), (r['id'], r['relatedActs'])

# Cross-links (symmetric): existing records that the new backbone touches
RELATED = {'T-H1': ['B-ORTHO-FORM', 'T-ZERO-ORTHOGONAL'], 'T-ZERO-ORTHOGONAL-C': ['T-R4-TETRA', 'T-R4-DERIVED'], 'T-H3': ['B-FINITE-INFINITE'], 'T-HIDDEN-FAMILY': ['B-ZERO-PRESERVE', 'B-HIGHER-GEOMETRY'],
           'T-Q.pairA-transfer': ['B-ZERO-PRESERVE', 'B-OUTSIDE-IN'], 'T-PAIRB': ['B-NONEXHAUSTIVE'], 'T-EVIDENCE': ['B-NONEXHAUSTIVE']}
byid = {r['id']: r for r in R}
for k, ids in RELATED.items():
    byid[k]['related'] += [i for i in ids if i not in byid[k]['related']]

# ── ratings (docs/research_method.md §12); every substantive result carries both percentages ───────
KN, PD, CE, EC, SM = 'TEXTBOOK / KNOWN', 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'NEW PROJECT CONSTRUCTION', 'EMPIRICAL', 'SPECULATIVE MAPPING'   # names set 2026-11-12
ONE, FAM, MULTI, PHYS, DATA = 'one configuration', 'one mathematical family', 'multiple independent mathematical families', 'multiple physical systems', 'real dataset(s)'
def rate(id, status, breadth, bs, slop, why, increase, falsify, cls, validity, state='active', depth='NOT YET FORMALIZED', correct='established'):
    v = dict(zip(('construction', 'generalization', 'transfer', 'failureCondition', 'outOfSample'), validity))
    byid[id]['assessment'] = dict(date='2026-11-12', mathematicalStatus=status, breadth=breadth, backboneSupport=bs, slopRisk=slop, why=why,
                                  increase=increase, falsify=falsify, classification=cls, validity=v, branchState=state, failures=[],
                                  transferDepth=depth, mathematicalCorrectness=correct, prediction=None, ratingHistory=[], applicationBreadth=None, novelty=None)
GC, EX = 'GENERAL CONSTRUCTION', 'EXAMPLE'
rate('T-R4-STAGE2', CE, ONE, 10, 5, 'An exact coordinate identity computed from the app\'s own TETRA. It records provenance only. It says nothing about what a zero carries.',
     'None needed; it is a provenance fact.', 'A change to TETRA that breaks G2i.', EX, ('pass', 'n/a', 'n/a', 'pass', 'n/a'))
rate('Q-R4-2', PD, FAM, 40, 10, 'Under an orthonormal source and orthogonal projection, the zero-sum configuration determines the source up to the sign of one normal and an ambient isometry (G3b, G3n). That is an exact case of hidden information being recoverable from the larger geometry. The source class is assumed, not inferred from the target, and G4c shows recovery fails without it.',
     'Recovery with the source class inferred from target-side data, or the same reconstruction on an independent system (weighted mass balance).', 'Two non-isometric orthonormal sources for one configuration within the class (ruled out by G3b), or the reconstruction failing on every independent system.',
     GC, ('pass', 'pass', 'partial', 'pass', 'not-yet'))
rate('Q-R4-1', PD, FAM, 35, 10, 'With the source class known, everything survives except one sign and an isometry. With no class, only the Gram matrix survives. The answer depends on an assumption, which is stated.',
     'A source-class inference from the target alone.', 'A configuration where the stated survivors are not recoverable within the class.', GC, ('pass', 'pass', 'partial', 'pass', 'not-yet'))
rate('Q-R4-4', KN, FAM, 25, 5, 'Zero sum forces the Gram matrix of a regular simplex to a multiple of I − J/n, so every such configuration is the projected basis up to scale and isometry. This is standard linear algebra.',
     'An independent system whose zero has this exact Gram structure for a reason not built in.', 'A regular-simplex zero-sum configuration with a different Gram (impossible by G3c).', GC, ('pass', 'pass', 'not-yet', 'pass', 'n/a'))
rate('Q-R4-5', PD, FAM, 35, 10, 'The zero sum is one linear condition, G1 = 0. The full Gram fixes the configuration up to isometry. An orthonormal source of this type exists exactly when a multiple of the Gram is idempotent, which the zero sum alone does not guarantee.',
     'The same separation of strengths on an independent system.', 'A zero-sum configuration with non-tight Gram that still has an orthonormal source of this type (ruled out by G3d).', GC, ('pass', 'pass', 'not-yet', 'pass', 'n/a'))
rate('Q-R4-6', PD, FAM, 40, 10, 'It is an exact boundary: the chain zero ← relational structure ← orthonormal organization holds precisely for zero-sum configurations with a single nonzero Gram eigenvalue. The counterexample (1,0), (0,1), (−1,−1) shows that generic zero sums lack such a source. This bounds the backbone as much as it supports it.',
     'A larger source class that covers non-tight zero sums.', 'An orthonormal-basis projection with non-idempotent Gram (impossible).', GC, ('pass', 'pass', 'not-yet', 'pass', 'n/a'))
rate('T-SIMPLEX-FAMILY', KN, FAM, 30, 5, 'The family is standard: a centered standard simplex for every n. It lifts the construction-backed direction from one configuration to a family. It does not reach systems that were not built this way.',
     'An independent system that produces a member of the family for a reason not built in.', 'A member whose Gram is not a multiple of I − J/n.', GC, ('pass', 'pass', 'partial', 'pass', 'not-yet'))
rate('T-ZERO-CONNECTOR-LINEAR', KN, MULTI, 35, 15, 'The statement is exact for every linear map and holds unchanged on four independent linear rows of the application matrix. In three of them it is only the textbook kernel statement. The inverse problem is obstructed without the map (G4c), and nonlinear zeros are outside it.',
     'A nonlinear extension that reduces to it (Q-CONNECT-2), and recovery results for wider source classes (Q-CONNECT-1).', 'None for the linear statement itself; the connector reading weakens wherever zeros are inherited rather than created.', GC, ('pass', 'pass', 'pass', 'pass', 'not-yet'))
rate('T-ZERO-CONNECTOR', SM, MULTI, 30, 30, 'The linear case is exact and transfers in the kernel sense. Recovering the source relation needs the map or the source class, and some zeros connect to nothing (|x|² = 0) or are inherited. The general interface claim goes beyond the mathematics so far.',
     'A nonlinear template, and a system where the connector reading predicts something the kernel statement alone does not.', 'Independent zeros repeatedly found to be inherited, with no removed source relation, or nonlinear zeros resisting every connector formulation.', GC, ('pass', 'partial', 'partial', 'pass', 'not-yet'))
rate('Q-R4-8-INVERSE', PD, FAM, 35, 15, 'Special case proved: with an orthonormal source, the removed direction is recovered up to sign (G3b). Exact obstruction without constraints (G4c). The general question is open.',
     'Recovery for a wider source class.', 'A proof that no target-side data can identify the source class.', GC, ('pass', 'partial', 'not-yet', 'pass', 'n/a'))
rate('B-HIGHER-GEOMETRY', CE, FAM, 35, 25, 'One exact family (R4 and every n) realizes hidden information encoded in a larger geometry, with reconstruction up to sign. The larger geometry is assumed orthonormal, not derived from the target. Transfer is partial (equal masses only).',
     'A larger geometry derived from target-side behavior, and an independent system where the template applies unchanged.', 'Repeated independent zeros with no larger-geometry reconstruction under any source class.', GC, ('pass', 'pass', 'partial', 'pass', 'not-yet'))
rate('B-HIGHER-GEOMETRY-CHAIN', PD, FAM, 40, 15, 'The chain holds exactly for every zero-sum configuration with a tight Gram (G3d), and fails for the rest. Mass balance shows the same structure in an independent system with equal masses.',
     'The weighted mass-balance reconstruction, and a non-linear instance.', 'An independent system where the chain is claimed but the Gram is not tight.', GC, ('pass', 'pass', 'partial', 'pass', 'not-yet'))
rate('Q-R4-7', CE, FAM, 15, 35, 'Stage 1 fits trivially, since every opposed pair is the n = 2 member. Stage 2\'s first state and equal-mass Stage 3 fit exactly. Varied-magnitude Stage 2 and general Stage 3 do not. The reading is retrospective.',
     'A reason, independent of the construction, why Chapter I\'s configurations should lie in the family.', 'Already partly falsified for later Stage 2 states and general Stage 3.', EX, ('pass', 'partial', 'partial', 'pass', 'n/a'), 'low-confidence-active')
rate('B-ZERO-INTERNAL-CHANGE', CE, ONE, 25, 25, 'One exact instance exists: S² measured on |↑↓⟩ keeps S_z = 0 and destroys the A–B coherence (W1d). There is no second system yet.',
     'A classical instance (for example, inside Stage 2\'s zero set) where an operation within the zero destroys a relation.', 'Every operation inside every studied zero set preserving all relations.', EX, ('pass', 'not-yet', 'not-yet', 'pass', 'n/a'))
rate('B-JOINT-ALTERNATIVES', CE, FAM, 25, 35, 'Established physics: which-path information (orthogonal markers) zeroes the interference cross term, with V² + D² = 1. The same projective structure occurs inside stage 2b with the defining zero preserved. That this is the project\'s zero mechanism is interpretation, and no physical data were used.',
     'An exact map from the marker model to zero-preserving interrogation, or a non-quantum system with the same structure.', 'The exact relation failing to hold beyond the projective-measurement family.', EX, ('pass', 'partial', 'partial', 'pass', 'not-yet'))
rate('B-ZERO-LOSS', SM, ONE, 10, 40, 'No card shows information destroyed by leaving a natural zero. The nearest exact result (W1d) concerns change inside the zero, which is a different operation.',
     'A construction where leaving a zero and returning provably loses a relation, compared with a zero-preserving route.', 'Natural zeros where leaving and returning always loses nothing.', EX, ('not-yet', 'not-yet', 'not-yet', 'pass', 'not-yet'), 'low-confidence-active')

def update(id, depth, correct='established', bs=None, slop=None, reason=None):
    a = byid[id]['assessment']
    a['transferDepth'], a['mathematicalCorrectness'] = depth, correct
    if bs is not None and (bs != a['backboneSupport'] or slop != a['slopRisk']):
        a['ratingHistory'].append(dict(date='2026-11-12', fromBackbone=a['backboneSupport'], fromSlop=a['slopRisk'], toBackbone=bs, toSlop=slop, reason=reason))
        a['backboneSupport'], a['slopRisk'] = bs, slop
NYF, TRIV, STRUCT = 'NOT YET FORMALIZED', 'TRIVIAL CONSEQUENCE', 'STRUCTURAL TRANSFER'
for i in ('T-R4-STAGE2', 'Q-R4-4', 'Q-R4-6'): update(i, NYF)
for i in ('Q-R4-1', 'Q-R4-2', 'Q-R4-5', 'Q-R4-8-INVERSE'): update(i, NYF, 'established under assumptions')
update('T-SIMPLEX-FAMILY', STRUCT)
update('B-HIGHER-GEOMETRY', STRUCT, 'established under assumptions')
update('B-HIGHER-GEOMETRY-CHAIN', STRUCT, 'established under assumptions')
update('Q-R4-7', STRUCT)
update('T-ZERO-CONNECTOR-LINEAR', TRIV, bs=20, slop=10, reason='transfer-depth discipline: on every independent row the linear connector is the textbook kernel statement (TRIVIAL CONSEQUENCE)')
update('T-ZERO-CONNECTOR', STRUCT, 'not established', bs=25, slop=30, reason='rows 3–5 are trivial consequences; the one structural transfer is equal-mass centering, which belongs to the centering construction more than to the connector')
update('B-ZERO-INTERNAL-CHANGE', NYF, bs=30, slop=25, reason='W2c computes what changes inside the zero (⟨S_z⁽¹⁾⟩: ħ/2 → 0) and W2e gives two incompatible zero-preserving interrogations; still one system')
update('B-JOINT-ALTERNATIVES', TRIV)
update('B-ZERO-LOSS', NYF, 'not established')
rate('T-PAIRA-BRIDGE', KN, FAM, 45, 8, 'T′\'s operator Pₙ transfers unchanged to every equal-mass configuration, and with positions eᵢ the full regular-simplex configuration reappears. It links Pair A\'s two sides through Stage 2\'s first state (G2i). It covers equal masses only, and mean-centering is a standard operation.',
     'An unequal-mass or non-mass system using the same unchanged operator, or a prediction made from it.', 'Already bounded: unequal masses fail T′ unchanged (G4m).', GC, ('pass', 'pass', 'partial', 'pass', 'not-yet'), depth=STRUCT)
rate('T-WMC', KN, FAM, 30, 10, 'Weighted centering is standard mechanics. Deriving it outside-in shows the metric D emerging from the zero relation itself (G5b). It is a separate construction from T′.',
     'An application to a weighted zero not built from masses, with depth above TRIVIAL CONSEQUENCE.', 'Weights with Σmᵢ = 0 or non-positive weights (outside its definition).', GC, ('pass', 'pass', 'not-yet', 'pass', 'n/a'))
rate('T-CENTERING-OPERATOR', PD, MULTI, 45, 15, 'One unchanged operator family C_G contains T′ (G = I) and WMC (G = D) exactly, with the metric read off each zero relation. It excludes Fourier k ≠ 0, weights with Σ = 0 and nonlinear zeros (G5f), so it can fail. It is the standard weighted-centering object and has one independent system so far.',
     'A third independent system with a nonzero removed uniform mode and positive weights, or a prediction from C_G verified before computing it.', 'A system with this zero-relation form where C_G does not reproduce the zero, or evidence that it is only a relabelling of every weighted zero.', GC,
     ('pass', 'pass', 'partial', 'pass', 'not-yet'), depth=STRUCT)
rate('T-S2-DEPHASING', KN, ONE, 25, 15, 'A textbook Lüders measurement computed exactly. The defining zero is kept, while the sector coherence and the ±ħ/2 composition of the zero are lost. It is the same dephasing map as which-path marking (W2d), but the double slit has no defining zero.',
     'A non-quantum zero where an operation inside the zero destroys a relation in the same way.', 'None for the calculation; the project mapping fails if the parallel holds for no non-quantum zero.', EX, ('pass', 'not-yet', 'not-yet', 'pass', 'n/a'), depth=TRIV)

rate('T-CF11-A', KN, MULTI, 55, 10, 'The pattern is textbook (Klein\'s Erlangen program; classical groups as form-preserving groups) and carded in five geometries: Euclidean, unitary, general bilinear, Lorentz, symplectic, plus the project\'s weighted metric. CF3 shows it is not universal: a preserved zero resultant characterizes no form.',
     'A geometry the project needs, characterized by its preserved relation, that was not chosen because it fits.', 'A geometry in the project\'s table whose transformations preserving its relation fail to characterize it (CF3 is already such a boundary).', GC, ('pass', 'pass', 'partial', 'pass', 'n/a'), depth=TRIV)

# Pass 2 provenance notes (appended; original wording untouched)
for rid, bound, change in (
    ('T-DYADIC', 'ORIGINAL USER RESEARCH TERM; OPEN DEFINITION (Pass 2 decision). Intended thematic role: connected to organizing or preserving frequency/scale information within the wavelet/scattering branch. Not identified with standard wavelet packets, dyadic wavelet decomposition or Mallat scattering paths.',
     'Pass 2: recorded as ORIGINAL USER RESEARCH TERM / OPEN DEFINITION with its thematic role; still undefined'),
    ('T-GRAVITY-ATTRACTION', 'ORIGINAL VERBATIM NOT RECOVERED: the recorded words are Nadia\'s 2026-11-12 instruction describing an earlier intuition; the historic wording is not in the repository history (searched).',
     'Pass 2: marked ORIGINAL VERBATIM NOT RECOVERED'),
    ('T-THERMALENS', 'APPLICATION PROVENANCE INCOMPLETE: prior project/application work, not a paper-backed source; it does not count toward upstream validation.',
     'Pass 2: marked APPLICATION PROVENANCE INCOMPLETE'),
    ('T-BACKBONE-INVARIANT', 'Pass 2: its project-level form is CF11-B (T-CF11-B, HYPOTHESIS); the established pattern it rests on is CF11-A (T-CF11-A), rated separately.',
     'Pass 2: linked to the CF11-A / CF11-B split')):
    byid[rid]['boundaries'].append(bound)
    byid[rid]['history'].append(dict(date=P2, change=change))
byid['T-BACKBONE-INVARIANT']['related'] += ['T-CF11-A', 'T-CF11-B']

BREADTH = {'B-HIGHER-GEOMETRY': 2, 'B-ZERO-LOSS': 0, 'T-R4-STAGE2': 0, 'B-HIGHER-GEOMETRY-CHAIN': 2, 'Q-R4-1': 1, 'Q-R4-2': 1, 'Q-R4-4': 1, 'Q-R4-5': 1,
           'Q-R4-6': 1, 'Q-R4-7': 1, 'T-SIMPLEX-FAMILY': 2, 'T-ZERO-CONNECTOR-LINEAR': 3, 'T-ZERO-CONNECTOR': 3, 'Q-R4-8-INVERSE': 1, 'B-ZERO-INTERNAL-CHANGE': 1,
           'B-JOINT-ALTERNATIVES': 2, 'T-PAIRA-BRIDGE': 2, 'T-WMC': 1, 'T-CENTERING-OPERATOR': 2, 'T-S2-DEPHASING': 0}
rate('T-QACP', KN, FAM, 20, 10, 'Both S_z = 0 zeros are exact cancellations of nonzero state-space vectors. At Level A this is additive algebra and carries little backbone weight. Its value is as the object on which the two-zeros test runs.',
     'A Level-C result: a representation that relates this source construction to another zero without being chosen for it.', 'None for the calculation.', GC, ('pass', 'pass', 'not-yet', 'pass', 'n/a'), depth=TRIV)
rate('T-QACP-OBSTRUCTION', PD, FAM, 35, 10, 'It answers the two-zeros question exactly for the zero-producing structure: nothing in it separates the triplet and singlet zeros, because a symmetry of that structure maps one onto the other. It also states precisely what must be added. It is limited to one system.',
     'The same obstruction-plus-added-structure pattern in a second, independent system.', 'A descriptor built only from (ψ, S_z^(1), S_z^(2), ⟨·,·⟩) that separates them (impossible by Q2c).', GC, ('pass', 'pass', 'not-yet', 'pass', 'n/a'))
rate('T-QACP-EXCHANGE', PD, MULTI, 30, 20, 'The canonical exchange separates the two zeros through the sign ε of P acting on the cancelling contributions (blind separation PASS). The same covariance identity governs T′, whose source transpositions act with ε = +1, matching the triplet only. ε equals the known exchange parity, so it adds location, not a new label.',
     'A system where ε (or its S_n analogue) separates states that no known label separates, tested blind.', 'ε failing to be defined on the next system (only exchange eigenstates qualify, Q2g).', GC, ('pass', 'partial', 'partial', 'pass', 'not-yet'), depth=STRUCT)
rate('T-QACP-CROSSTERM', KN, FAM, 25, 20, 'The S² dephasing removes exactly the expectation-level composition of the zero (⟨S_z^(1)⟩ = ħ Re ρ_AB) and keeps S_z = 0. The shared mathematics with which-path dephasing is the generic two-sector map (W3b). The specific part, that the removed cross term is the zero\'s own internal composition, has no double-slit counterpart.',
     'A non-quantum zero whose internal composition is a pure cross term under some sector decomposition.', 'None for the calculation.', EX, ('pass', 'pass', 'partial', 'pass', 'n/a'), depth=TRIV)
rate('Q-SAME-ZERO', PD, FAM, 35, 15, 'For the first rigorous test (triplet / singlet) the answer is exact: not with the zero-producing structure alone (Q2c), yes once the exchange structure, which preserves the zero, is included (Q2d). The separating structure coincides with known quantum labels, so no new information was found.',
     'A second system, and a blind test where the separating structure is not already equivalent to a known label.', 'The separating structure always reducing to a known label in every system tested.', GC, ('pass', 'partial', 'not-yet', 'pass', 'not-yet'))
BREADTH.update({'T-QACP': 1, 'T-QACP-OBSTRUCTION': 0, 'T-QACP-EXCHANGE': 2, 'T-QACP-CROSSTERM': 2, 'Q-SAME-ZERO': 0})
for k, b in BREADTH.items():
    byid[k]['assessment']['applicationBreadth'] = b

update('T-QACP-EXCHANGE', NYF, bs=40, slop=8, reason='baseline set by Nadia at 42% / 7% (breadth 1); four spins reproduce the same pattern (symmetry separates, geometry blind: FS2b, FS2c), but the mass test inverts the roles (geometry decisive there), so the specific pattern is not cross-domain: 40% / 8%')
byid['T-QACP-EXCHANGE']['assessment']['novelty'] = 'VALIDATION OF KNOWN MATHEMATICS'
rate('T-QACP-OBSTRUCTION-RESTRICTED', PD, FAM, 30, 5, 'An exact lemma with its class stated: descriptors invariant under unitaries commuting with the contribution operators cannot separate the two zeros. Its four-spin form (FS1c) shows the same blindness to phases. It says where the contribution geometry stops, not what lies beyond.',
     'The same lemma in a non-quantum system, or a system where the class is broader.', 'A descriptor in the stated class that separates the two (impossible by Q2h).', GC, ('pass', 'pass', 'not-yet', 'pass', 'n/a'))
rate('T-FOURSPIN-GEOMETRY-BLIND', PD, FAM, 30, 5, 'Exact: the four-spin contribution Gram depends only on |amplitudes|², and explicit pairs share a Gram across sectors. It is a precise boundary of the zero-producing geometry as a descriptor in quantum systems. In the mass system the opposite holds.',
     'A characterization of exactly which hidden labels a contribution Gram can and cannot see.', 'None for the lemma.', GC, ('pass', 'pass', 'fail', 'pass', 'n/a'), depth='FAIL')
rate('T-FOURSPIN-SYMMETRY', KN, FAM, 40, 8, 'The exact rule "same visible zero + independently specified symmetry → distinguishable hidden states" holds blind for all three four-spin sectors. The symmetry was specified before the distinction (B-INDEPENDENT-SYMMETRY), and the preregistration predates the reveal. It is Schur–Weyl duality, so it is a validation, not a new theorem.',
     'Q-SYM-NOVEL: a system where the descriptor separates states that no known label separates.', 'A sector pair not separated by the S₄ action (none in H₀; FS2e).', GC, ('pass', 'pass', 'partial', 'pass', 'pass'))
byid['T-FOURSPIN-SYMMETRY']['assessment']['novelty'] = 'VALIDATION OF KNOWN MATHEMATICS'
rate('T-FOURSPIN-SIMPLEX', PD, MULTI, 35, 10, 'The preregistered prediction P1 (from G3c, derived before) held: the S₄-fixed four-spin zero has exactly the T′ regular-simplex contributions, the same configuration as Stage 2\'s first state and the mass tetrahedron. Its converse fails (FS2d). The correlations themselves are known.',
     'A system where the simplex configuration of the contributions predicts a label not implied by its symmetry.', 'Already bounded: the regular-simplex Gram also occurs at S = 0.', GC, ('pass', 'pass', 'pass', 'pass', 'pass'), depth=STRUCT)
byid['T-FOURSPIN-SIMPLEX']['assessment']['novelty'] = 'VALIDATION OF KNOWN MATHEMATICS'
rate('T-MASS-SECOND-MOMENT', KN, FAM, 25, 5, 'Blind and correct, but textbook: the contribution Gram shares its nonzero spectrum with the second-moment tensor, so it predicts isotropy for every configuration. Symmetry predicts only when it acts irreducibly and misses accidental isotropy.',
     'A hidden mass-system quantity that the contribution Gram cannot see but an independent symmetry can.', 'None for the theorem.', GC, ('pass', 'pass', 'not-yet', 'pass', 'pass'))
byid['T-MASS-SECOND-MOMENT']['assessment']['novelty'] = 'VALIDATION OF KNOWN MATHEMATICS'
rate('T-ZERO-SYMMETRY-ARCHITECTURE', KN, MULTI, 35, 20, 'The same precise object appears unchanged in a quantum and a non-quantum zero: an independent group acting covariantly on the zero-producing tuple, with a commuting hidden quadratic that is scalar on irreducible blocks. The roles of geometry and symmetry are inverted between the two systems, so only the architecture transfers, not the pattern. The object is Schur\'s lemma.',
     'A third system, chosen before testing, where the architecture predicts a hidden quantity that is not textbook-implied.', 'A system with an independent symmetry and a commuting hidden quadratic where neither geometry nor symmetry carries the hidden label.', GC, ('pass', 'pass', 'pass', 'pass', 'pass'), depth=STRUCT)
byid['T-ZERO-SYMMETRY-ARCHITECTURE']['assessment']['novelty'] = 'VALIDATION OF KNOWN MATHEMATICS'
BREADTH.update({'T-QACP-EXCHANGE': 1, 'T-QACP-OBSTRUCTION-RESTRICTED': 1, 'T-FOURSPIN-GEOMETRY-BLIND': 1, 'T-FOURSPIN-SYMMETRY': 1, 'T-FOURSPIN-SIMPLEX': 2, 'T-MASS-SECOND-MOMENT': 1, 'T-ZERO-SYMMETRY-ARCHITECTURE': 2, 'T-CF11-A': 3})
for k, b in BREADTH.items():
    byid[k]['assessment']['applicationBreadth'] = b

# ── Pass 3 (2026-11-12): the CF11-B Fisher test (prereg e6f3db8; result research/constructions/cf11b_fisher_test.md) ──
CF_TEST = 'research/constructions/cf11b_fisher_test.md'
def evidence(rid, pro=(), con=(), bound=None, change=None, status=None):
    r = byid[rid]
    r['evidenceFor'] += [dict(ref=a, note=b) for a, b in pro]
    r['evidenceAgainst'] += [dict(ref=a, note=b) for a, b in con]
    r['relatedCards'] = sorted(set(r['relatedCards']) | {a.split(':', 1)[1] for a, _ in list(pro) + list(con) if a.startswith('card:')})
    if bound: r['boundaries'].append(bound)
    if change: r['history'].append(dict(date='2026-11-12', change=change))
    if status: r['status'] = status
evidence('T-CF11-B',
         pro=[('card:CFT1a', 'one law: F*B = B ⟺ AᵀMA = M for constant forms'), ('card:CFT2a', 'the same law expresses nonlinear symplectomorphisms'),
              ('card:CFT4d', 'the same law expresses Fisher isometries supplied by the system (location–scale)'), ('card:CFT11b', 'with naturality (P2) the architecture covers F-C′')],
         con=[('card:CFT5c', 'F-C′: an exact null with no supplied symmetry; one meaning of "preserved" (P1) organizes it only vacuously'),
              ('card:CFT5f', 'F-C is not homogeneous: its structure is carried by g, not by a transformation group')],
         bound='Pass 3 (preregistered, e6f3db8): outcome CF11-F2, PARTIAL SURVIVAL. "Preserved" needs more than one precise meaning: P1 invariance F*T = T (symmetries), P2 naturality g_φ = Jᵀ g J (reparametrizations), P3 operator equivariance (derived operators). Wording unchanged.',
         change='Pass 3: CF11-F2 (PARTIAL SURVIVAL); classified REFINED')
evidence('T-CF11-REFINEMENT',
         pro=[('card:CFT3c', 'P2 verified against direct computation (F-A, nonlinear chart)'), ('card:CFT4c', 'P2 verified in natural parameters (F-B)'),
              ('card:CFT11b', 'P2 carries F-C′\'s null structure without any symmetry'), ('card:CFT10a', 'non-vacuous: a coordinate-dependent pseudo-structure fails P2')],
         con=[('card:CFT8b', 'weighted centering fits neither P1 nor P2: it needs operator equivariance (P3, CFT8c)')],
         bound='Pass 3: supported in explicit form (tensor T; F*T = T for symmetries; g_(p∘θ) = θ*g_p for reparametrizations; invariants ds², K, rank; failure cases). Not adopted as project wording: that is Nadia\'s decision.',
         change='Pass 3: tested in explicit form; supported (outcome CF11-F2); not adopted')
evidence('T-CF-PULLBACK-Q',
         pro=[('card:CFT1a', '(F*B)(u, v) = uᵀ(AᵀMA)v: the matrix law is the coordinate form of F*B = B'), ('card:CFT1b', '(F*T)_x = dF_xᵀ M(F(x)) dF_x for any F and tensor field'),
              ('card:CFT2a', 'symplectic: F*ω = ω, nonlinear F'), ('card:CFT4d', 'Fisher isometries: F*g = g')],
         con=[('card:CFT2c', 'one law, different preserving classes'), ('card:CFT5f', 'generic Fisher geometry has no transitive isometry group')],
         bound='Pass 3 answer: YES by the preregistered criteria, with scope: several major geometries in the Foundation admit F*T = T as a common coordinate-free preservation form for their symmetries; not all geometry, not reparametrizations.',
         change='Pass 3: answered YES (scope stated)', status='derived')
# Pass 3 architectural correction: append corrections; the Pass 3 notes above stay as written
byid['T-CF11-REFINEMENT']['supersededBy'] = 'T-TRANSFORMATION-ARCH'
for rid, note in (('T-CF11-B', 'Correction (Pass 3 architectural correction): P1, P2 and P3 are not three meanings of "preserved". They are three distinct transformation relationships: R2 structural invariance (P1, F*T = T), R1 representation covariance (P2, g_φ = Jᵀ g J) and R3 equivariance / intertwining (P3). CF11-F2 stands; the architecture is recorded as T-TRANSFORMATION-ARCH.'),
                  ('T-CF11-REFINEMENT', 'Correction (Pass 3 architectural correction): superseded by T-TRANSFORMATION-ARCH. The reading "preserved or transforms coherently" compressed three distinct relationships (R1, R2, R3) into one word; it is kept as the historical step between CF11-F2 and the Transformation Architecture.')):
    byid[rid]['boundaries'].append(note)
    byid[rid]['history'].append(dict(date='2026-11-12', change='Pass 3 architectural correction: P1/P2/P3 re-recorded as R2/R1/R3 (Transformation Architecture)'))
byid['T-DYADIC']['boundaries'].append('Reduction amendment (2026-11-13): still ORIGINAL USER RESEARCH TERM, OPEN DEFINITION. Current candidate architectural role (not the definition): a hierarchical organization of information across repeated splits/reductions, schematically X → (X₀, X₁) → (X₀₀, X₀₁, X₁₀, X₁₁) → …; investigated within the Reduction / Information-Changing Architecture. DYADIC STRUCTURE — CANDIDATE, NOT UNIVERSAL: no significance is drawn from base 2. Not identified with standard wavelet packets, dyadic wavelet trees, scattering paths or multiresolution analysis.')
byid['T-DYADIC']['history'].append(dict(date='2026-11-13', change='candidate architectural role recorded (Reduction / Information-Changing Architecture); definition still open'))
byid['T-DYADIC']['related'] += ['T-DYADIC-Q1', 'T-DYADIC-Q2', 'T-REDUCTION-ARCH']
# Model-manifold invariance + research-story audit (2026-11-13): notes appended; earlier wording unchanged
def note(rid, bound, change, pro=(), con=()):
    r = byid[rid]
    r['boundaries'].append(bound)
    r['history'].append(dict(date='2026-11-13', change=change))
    r['evidenceFor'] += [dict(ref=a, note=b) for a, b in pro]
    r['evidenceAgainst'] += [dict(ref=a, note=b) for a, b in con]
    r['relatedCards'] = sorted(set(r['relatedCards']) | {a.split(':', 1)[1] for a, _ in list(pro) + list(con) if a.startswith('card:')})
note('T-C7', 'C7 target gate (2026-11-13), answering "What exact mathematical object on the model-manifold side should be compared?": raw FIM eigenvalues are NOT the object (coordinate-dependent, MMIb, CFT5e: a NEGATIVE result for that reading). Recommended object: the hyperribbon widths of the model manifold (cross-sectional extents of the image set in a stated prediction-space metric; parametrization-independent, metric-dependent, MMIf). Known mathematics already bounds them by Chebyshev coefficient decay for analytic models (Quinn, Wilber, Townsend, Sethna 2019), so a C7 derivation must state its project-specific residue first. T-C7 stays OPEN; no derivation begun.',
     'C7 target recommendation (no derivation)', con=[('card:MMIb', 'raw eigenvalues are not geometric invariants')], pro=[('card:MMIf', 'widths are a property of the set and the ambient metric')])
note('T-PREDICTION-INFINITE', 'Model-manifold audit (2026-11-13): for finitely many outputs P = ℝᵐ (finite); for a continuously indexed output with a stated inner product P is a function space (L²), infinite-dimensional, while M keeps the dimension of its identifiable parameters (MMIh: g_ij = 2/(θᵢ + θⱼ)³). "Infinite prediction space" is exact in this sense; it is not physical spacetime and not a quantum state space.',
     'finite vs function-space prediction space recorded', pro=[('card:MMIh', 'function-space prediction space with a finite metric')])
note('T-INFOGEO', 'Model-manifold audit (2026-11-13): research/model_manifold_invariance.md classifies each quantity. Invariant under reparametrization: rank, nullity, null directions, lengths, the volume element, curvature, widths, the boundary set. Not invariant: matrix entries, det, raw eigenvalues, condition number, Jacobian singular values. Dependent on the noise model: all magnitudes; not the null directions. AMB-14 ("exact null direction") resolved for this branch: the statistical null g(v, v) = 0 ⟺ Jv = 0.',
     'invariance audit recorded', pro=[('card:MMIa', ''), ('card:MMIe', '')], con=[('card:MMIb', 'raw spectra are chart-dependent')])
note('T-QUANTUM-ZERO', 'Model-manifold audit (2026-11-13): stated in the same audit as "observable zero does not uniquely specify underlying state." The comparison with observationally indistinguishable model parameters (same predictions, different θ) is a STRUCTURAL ANALOGUE / OPEN CONNECTION: no explicit map between the quantum states and a parameter manifold is given.',
     'link to the model-manifold audit recorded')
byid['T-QUANTUM-ZERO']['related'] += ['T-MM-OBSERVE', 'T-GEOM-INFO-Q']
byid['T-C7']['related'] += ['T-INFOGEO']
MM_RATE = '2026-11-13'
def rate_mm(rid, breadth_int, *a, **k):
    rate(rid, *a, **k)
    byid[rid]['assessment']['date'] = MM_RATE
    byid[rid]['assessment']['applicationBreadth'] = breadth_int
rate_mm('T-MM-RULES', 2, KN, MULTI, 40, 5, 'M = Y(Θ) is the definition of a model manifold; the parameters chart it and its domain limits give its boundaries. The project reading adds only the word "rules" for Y and Θ. Exact on F-C, the one-exponential curve and the function-space model.',
        'A system where the parameter domain alone, not the model rule, determines a non-trivial feature of M.', 'None for the definitional statement.', GC, ('pass', 'pass', 'n/a', 'pass', 'n/a'), depth='TRIVIAL CONSEQUENCE')
rate_mm('T-RULES-GEOMETRY', 2, PD, MULTI, 25, 20, 'One shared exact feature: a parameter limit that is a degenerate boundary with a rank drop (C9b, MMIg). The invariant-form role does not transfer, and the general phrase is too weak to test.',
        'A further shared invariant beyond the rank drop, stated before it is checked.', 'A model family whose parameter limits never drop rank, or a precise sense in which the Lorentz and model-manifold boundaries differ in kind.', GC, ('pass', 'partial', 'partial', 'pass', 'not-yet'), depth='STRUCTURAL TRANSFER')
rate_mm('T-MM-OBSERVE', 1, SM, FAM, 15, 35, 'Exact for named maps (non-selective measurement W2a, simplex projection RIC1a, boundary limits). There is no general construction of "observation" as one map class. It stays an open connection.',
        'A single construction covering quantum dephasing and a classical reduction with the same stated survivors, written before checking.', 'A measurement process whose effect is not representable as a map from a richer description (none known).', EX, ('pass', 'not-yet', 'not-yet', 'pass', 'not-yet'), depth='NOT YET FORMALIZED', correct='established under assumptions')
rate_mm('T-MM-STORY', 2, SM, MULTI, 30, 30, 'Arrows 1–3 are established or project-derived (MMIa–MMIh). Arrow 4 is exact only for named maps, and arrow 5 is answered per map, not as a law. The chain is a project synthesis.',
        'A system where the chain makes a prediction the separate arrows do not.', 'A system whose observable manifestation is not a reduction of any richer description in the stated sense.', GC, ('pass', 'partial', 'partial', 'pass', 'not-yet'), depth='NOT YET FORMALIZED', correct='established under assumptions')
# Model-manifold precision corrections (2026-11-15): overstated wording revised explicitly; the previous wording is kept in each record's history
PREC = '2026-11-15'
def revise(rid, field, new, why):
    r = byid[rid]
    old = r[field]
    r[field] = new
    r['history'].append(dict(date=PREC, change=f'{field} revised (precision pass): {why}. Previous wording: {old}'))
def renote(rid, ref, old_start, new_note, why):
    r = byid[rid]
    for e in r['evidenceFor'] + r['evidenceAgainst']:
        if e['ref'] == ref and e['note'].startswith(old_start):
            r['history'].append(dict(date=PREC, change=f'evidence note on {ref} revised (precision pass): {why}. Previous note: {e["note"]}'))
            e['note'] = new_note
            return
    raise SystemExit(f'{rid}: no note {ref} {old_start}')
def note15(rid, bound, change, pro=(), con=()):
    r = byid[rid]
    r['boundaries'].append(bound)
    r['history'].append(dict(date=PREC, change=change))
    r['evidenceFor'] += [dict(ref=a, note=b) for a, b in pro]
    r['evidenceAgainst'] += [dict(ref=a, note=b) for a, b in con]
    r['relatedCards'] = sorted(set(r['relatedCards']) | {a.split(':', 1)[1] for a, _ in list(pro) + list(con) if a.startswith('card:')})
def add_variant(rid, words):
    byid[rid]['variants'].append(dict(words=words, source=RD))
    byid[rid]['sourceDocs'].append(RD)
def rerate(rid, bs, slop, depth, why_new, reason):
    a = byid[rid]['assessment']
    a['ratingHistory'].append(dict(date=PREC, fromBackbone=a['backboneSupport'], fromSlop=a['slopRisk'], toBackbone=bs, toSlop=slop, fromDepth=a['transferDepth'], toDepth=depth, reason=reason))
    a['backboneSupport'], a['slopRisk'], a['transferDepth'] = bs, slop, depth
    a['why'] = why_new
revise('T-MM-RULES', 'normalizedStatement', 'the model structure and parameterization constrain the set of allowable predictions. Unpacked (2026-11-15): the model rule Y and the parameter domain Θ fix the model image M = Y(Θ) ⊆ P (a set; a smooth model manifold only on a regular region of constant local rank and local injectivity, MMPa). θ ∈ Θ is a parameter value and Y(θ) its prediction; parameters parameterize the image and give local coordinates only where the parameterization is locally regular and locally identifiable; different parameter values may represent the same prediction (MMPb). Parameter limits can produce limiting strata of the image; the parameter-domain boundary, parameter limits, their images, MBAM boundary strata and the topological boundary of Y(Θ) are different objects (MMPi, MMPj).',
       'parameters are not automatically coordinates, and the domain\'s limits are not automatically the boundaries of the image')
note15('T-MM-RULES', 'Precision pass (2026-11-15): "a parameter value is a point coordinate on M" and "the domain\'s limits give M\'s boundaries" were too strong and are superseded (see history and research/model_manifold_story.md, Precision corrections). The project interpretation (rules and the parameter domain constrain the allowable family) is kept; it is not a differential-geometric coordinate claim.',
       'precision pass: coordinate and boundary claims scoped', pro=[('card:MMPb', 'parameters give local coordinates only on regular identifiable regions'), ('card:MMPi', 'parameter-domain boundary ≠ image boundary')])
rerate('T-MM-RULES', 35, 5, 'TRIVIAL CONSEQUENCE', 'M = Y(Θ) is the definition of the model image; parameters give local coordinates only on regular identifiable regions, and parameter limits give limiting strata, not "the boundaries". The project reading adds only the word "rules" for Y and Θ. Exact on F-C, e^{−(θ₁+θ₂)t}, the one-exponential curve and the function-space models.',
       'the unpacking no longer includes the coordinate and boundary claims (MMPb, MMPi)')
note15('T-RULES-GEOMETRY', 'Verdict revised (2026-11-15), superseding the 2026-11-13 verdict above (kept): three roles of c are kept apart. Role 1, representation/coefficient: η_c = P_cᵀ diag(1, −1) P_c for the stated matrix form (ESTABLISHED for that form; it does not prove that physical c has no invariant significance). Role 2, invariant geometric/physical: the Lorentzian interval and light cone (ESTABLISHED PHYSICS in its native setting). Role 3, theory-family / singular limit: c → ∞ gives the degenerate limiting bilinear form diag(1, 0) (STRUCTURAL ANALOGY worth preserving; not by itself the Newtonian metric). Transfer to arbitrary model-manifold geometry: OPEN. The universal "rules constrain states" reading: TOO WEAK by itself. The model-side drop 2 → 1 is a result of the F-C example (MMPl).',
       'precision pass: c verdict revised to three roles', pro=[('card:MMPm', 'no change of representation reaches the c → ∞ form; it is degenerate')], con=[('card:MMPl', 'dimension drops depend on the model and the limit')])
renote('T-RULES-GEOMETRY', 'card:MMIi', 'the invariant-form role does not transfer', 'MMIi checks a representation-level normalization (η_c = P_cᵀ diag(1, −1) P_c, Role 1); it does not remove the invariant physical role of c (Role 2). Whether that role transfers to model-manifold geometry is OPEN; a generic model image is not homogeneous (CFT5f)',
       'the old note read a representation-level fact as a failed transfer')
renote('T-MM-RULES-Q', 'card:MMIi', 'for finite c, c is absorbed', 'MMIi is a representation-level normalization of the matrix η_c (Role 1); c\'s invariant role (Role 2) and its theory-family limit (Role 3) are separate. Model parameters parameterize an image and are local coordinates only on regular regions. Transfer between the two kinds of "rule" is OPEN',
       '"a finite c is just a change of units" collapsed distinct roles of c')
rerate('T-RULES-GEOMETRY', 20, 20, 'NOT YET FORMALIZED', 'Three roles of c are kept apart. The theory-family limit and model-family limits are both degenerate limits (a structural analogy); whether c\'s invariant role transfers to model-manifold geometry is OPEN; the general phrase is too weak to test.',
       'the 2026-11-13 verdict collapsed the roles of c and generalized one example (MMPm, MMPl)')
note15('T-C-ROLES', 'Precision pass (2026-11-15): three roles are kept apart. The two roles named here are Role 2 (within a theory, c helps define the invariant Lorentzian structure) and Role 3 (across theories, c → ∞ is a singular limit giving the degenerate form diag(1, 0), not by itself the Newtonian metric). Role 1 is a representation-level fact added to avoid conflation: for the matrix η_c = diag(1, −1/c²), a finite c can be normalized by rescaling x; this does not remove Role 2. The transition between Roles 2 and 3 stays the question.',
       'precision pass: three roles of c recorded', pro=[('card:MMPm', 'Role 1 vs Role 3: no representation change reaches the limit')])
note15('T-C7', 'C7 target revised (2026-11-15), superseding the 2026-11-13 recommendation above (kept): C7 requires an explicitly defined geometric width object before any invariant spectral-decay claim can be evaluated. No single width definition is chosen; Transtrum-style geodesic widths and Quinn-style enclosing-hyperellipsoid widths are both kept until the next construction pass. C7 is not "hyperribbon widths exist" (established literature). Candidate bridge: Fourier / spectral / coefficient decay ?⟹ coordinate-independent geometric width hierarchy; a possible chain (NOT established): Fourier/spectral decay → approximation/coefficient decay → Quinn-style width bounds. Preconditions: (1) the exact geometric width object; (2) the prediction/noise metric; (3) the class of models/functions; (4) the exact spectral/coefficient-decay object; (5) what the result adds beyond Quinn et al. 2019 and existing approximation theory. T-C7 stays OPEN; no derivation begun.',
       'precision pass: C7 preconditions recorded; the single target object withdrawn', con=[('card:MMPg', 'widths along a chart\'s FIM eigendirections are chart-dependent')])
renote('T-C7', 'card:MMIf', 'widths are a property', 'a width defined from the image set with a fixed prediction metric is chart-independent (1-D illustration: total length); operational width definitions must still be checked (MMPg)', 'widths were stated as parametrization-independent without separating geometric widths from chart proxies')
revise('T-ZERO-LENGTH', 'normalizedStatement', 'For g = J_Yᵀ Σ⁻¹ J_Y with J_Y = ∂Y/∂θ and a fixed (θ-independent) positive-definite Σ⁻¹: g(v, v) = (J_Y v)ᵀ Σ⁻¹ (J_Y v) = 0 ⟺ J_Y v = 0: a zero-length tangent vector is a first-order non-identifiable direction (exact, any chart). Without positive definiteness (a singular observation weight, MMPd) or with a θ-dependent noise law (MMPe) the equivalence can fail. A curve whose tangent has zero length everywhere is a set of parameter values with identical predictions (exact redundancy, FB7a). Distinct from a sloppy direction, a Lorentz null, a bilinear null, a collapsed zero, equal expectation values, same-zero quantum states and symmetry-dependent distinctions.',
       'the positive-definite and fixed-noise hypotheses attached; J_Y notation')
note15('T-ZERO-LENGTH', 'Precision pass (2026-11-15): the equivalence needs a positive-definite, θ-independent Σ⁻¹ (MMPd, MMPe).', 'precision pass: hypothesis attached',
       pro=[('card:MMPd', 'positive-definite weight: zero length ⟺ J_Y v = 0')], con=[('card:MMPd', 'a singular weight breaks it'), ('card:MMPe', 'a θ-dependent noise law breaks it')])
note15('T-PREDICTION-INFINITE', 'Precision pass (2026-11-15): g_ij = 2/(θᵢ + θⱼ)³ is the Fisher metric of the specific model e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞), not a general formula (the linear model θ₁e^{−T} + θ₂e^{−2T} has a constant metric). Kept: dim P = ∞ while dim M = 2; a prediction space can be infinite-dimensional while the model image remains finite-dimensional.',
       'precision pass: function-space formula labelled as example-specific', pro=[('card:MMPk', 'dim P = ∞, dim M = 2; formula model-specific')])
note15('T-INFOGEO', 'Precision pass (2026-11-15), correcting the 2026-11-13 note above (kept): widths are reparametrization-invariant only when defined from the image set with a fixed prediction metric (chart FIM-eigendirection widths are not, MMPg); "the boundary set" splits into five objects (∂Θ, parameter limits, their images, MBAM strata, the topological boundary of Y(Θ); MMPi, MMPj); null directions and rank are unchanged only between fixed positive-definite weights (MMPd, MMPe); the invariant volume object is √det g_θ dθ¹⋯dθⁿ, not √det g alone (MMPf); raw Hessian eigenvalues are chart proxies (MMPh).',
       'precision pass: invariance note corrected', pro=[('card:MMPf', 'the full volume element is invariant')], con=[('card:MMPg', 'chart-defined widths'), ('card:MMPh', 'raw Hessian')])
note15('T-SIMPLER-BOUNDARY-Q', 'Precision pass (2026-11-15): a model-manifold boundary can arise as a limiting / degenerate model family in prediction space as parameters approach appropriate limits; not every parameter-domain boundary gives one (MMPi), an image edge can come from interior parameter points (MMPj), and the 2 → 1 drop of F-C is example-specific (MMPl).',
       'precision pass: boundary language', pro=[('card:MMPj', 'an image edge from interior rank-drop points')], con=[('card:MMPl', 'limits need not give a face')])
add_variant('T-MM-OBSERVE', 'Which structures survive a specified map, reduction, observation, quotient, projection, or limit?')
note15('T-MM-OBSERVE', 'Precision pass (2026-11-15): the existing quantum instance is the named channel D(ρ) = P_t ρ P_t + P_s ρ P_s (non-selective S² measurement) on |ud⟩: it removes ⟨1,0|ρ|0,0⟩ = ⟨0,0|ρ|1,0⟩ = 1/2, and S_z = 0 survives because [P_t, S_z] = [P_s, S_z] = 0 (a non-selective S_x⁽¹⁾ measurement would not keep it, MMPn). Quantum measurement, projection, marginalization, quotient / reduction, manifold boundary limits, coarse graining and parameter non-identifiability are different operations (MMPo). The open research question is whether they share a deeper structural pattern. It is NOT established that they are the same operation.',
       'precision pass: named channel and non-universality', pro=[('card:MMPn', 'the named channel'), ('card:MMPo', 'the operations differ')])
add_variant('T-VIEWER-FORM', 'What changes when a richer state or representation is mapped to an observable manifestation?')
note15('T-VIEWER-FORM', 'Precision pass (2026-11-15): kept as historical / project provenance only; not converted into established quantum physics. Investigable forms: "What changes when a richer state or representation is mapped to an observable manifestation?" and "Which structures survive a specified map, reduction, observation, quotient, projection, or limit?" (T-MM-OBSERVE).',
       'precision pass: provenance-only status recorded')
note15('T-MM-STORY', 'Precision pass (2026-11-15): every arrow also carries a status in ESTABLISHED MATHEMATICS / PROJECT-DERIVED / STRUCTURAL ANALOGY / OPEN / PHILOSOPHICAL / HISTORICAL INTUITION (research/model_manifold_story.md); "allowable manifold" reads as the allowable family / model image, a smooth manifold only on regular regions. The chain is kept whole.',
       'precision pass: arrow statuses (five classes)', pro=[('card:MMPa', 'model image vs manifold')])
add_variant('T-MM-GOV', 'Do not assume the previous audit wording is automatically correct merely because its tests pass.')
byid['T-MM-GOV']['history'].append(dict(date=PREC, change='variant added (precision pass)'))
# C7 construction pass 1 (2026-11-15): notes and ratings; T-C7 stays OPEN
note15('T-C7', 'C7 pass 1 (2026-11-15): the bridge "Fourier / spectral coefficient decay ⟹ coordinate-independent prediction-space width hierarchy" was constructed for uniformly enveloped families on an interval (T-C7-BRIDGE): principal status C7-KNOWN-REFORMULATION (Quinn et al. 2019 plus standard approximation theory after x = cos φ), an UPPER bound only, not necessary (C7n), not exact (C7o–C7q), failing for pointwise decay (C7d). C7 as first posed here (coefficient spectra vs Fisher / sloppy spectra) stays OPEN: no invariant relation to Fisher eigenvalues was found, and raw Fisher spectra are chart-dependent (MMIb). Record: research/constructions/c7_fourier_width.md.',
       'C7 pass 1: bridge constructed (known reformulation); C7 as posed stays OPEN', pro=[('card:C7u', 'pass-1 verdict')], con=[('card:C7q', 'enclosure, not widths')])
note15('T-INFOGEO', 'C7 pass 1 (2026-11-15): a prediction-space width bound that IS chart-independent: the Quinn-style enclosure from a uniform coefficient envelope (C7f–C7k); Transtrum-style widths along chart eigendirections are not an invariant spectrum (T-TMS-WIDTHS).',
       'C7 pass 1: invariant enclosure recorded', pro=[('card:C7k', 'enclosure unchanged by reparametrization')])
note15('T-PREDICTION-INFINITE', 'C7 pass 1 (2026-11-15): with a uniform coefficient envelope the function family has Kolmogorov m-width ≤ R_m in C[−1, 1], an N-independent statement; at N samples the Euclidean bound carries √N (C7s).',
       'C7 pass 1: N-independent function-space bound recorded', pro=[('card:C7s', '')])
C7RATE = '2026-11-15'
def rate_c7(rid, breadth_int, *a, **k):
    rate(rid, *a, **k)
    byid[rid]['assessment']['date'] = C7RATE
    byid[rid]['assessment']['applicationBreadth'] = breadth_int
    byid[rid]['assessment']['novelty'] = 'VALIDATION OF KNOWN MATHEMATICS'
rate_c7('T-C7-BRIDGE', 3, KN, MULTI, 30, 15, 'Valid sufficient upper bound for uniformly enveloped families, checked on four families including F-C. Every ingredient is Quinn et al. 2019 or standard approximation theory after x = cos φ. It gives no lower bound and no converse.',
        'A lower bound on the actual widths under a stated non-degeneracy condition, or a relation to an invariant geometric spectrum stated before checking.', 'A uniformly enveloped family whose image leaves the stated enclosure (none: C7f–C7t).',
        GC, ('pass', 'pass', 'partial', 'pass', 'n/a'), depth='STRUCTURAL TRANSFER')
rate_c7('T-C7-SPECTRAL-CHAIN', 3, KN, MULTI, 30, 15, 'The first three arrows hold for uniformly enveloped families; the last holds only as an upper bound on the image. It is a restricted structural connection, not universal.',
        'The same as T-C7-BRIDGE.', 'A family where the enclosure fails, or a claimed width spectrum that the bound does not control.', GC, ('pass', 'pass', 'partial', 'pass', 'n/a'), depth='STRUCTURAL TRANSFER')
# Final adversarial C7 lock / audit (2026-11-16): notes and ratings; T-C7 stays OPEN (invariant reading)
def note16(rid, bound, change, pro=(), con=()):
    r = byid[rid]
    r['boundaries'].append(bound)
    r['history'].append(dict(date='2026-11-16', change=change))
    r['evidenceFor'] += [dict(ref=a, note=b) for a, b in pro]
    r['evidenceAgainst'] += [dict(ref=a, note=b) for a, b in con]
    r['relatedCards'] = sorted(set(r['relatedCards']) | {a.split(':', 1)[1] for a, _ in list(pro) + list(con) if a.startswith('card:')})
note16('T-C7', 'Final C7 audit (2026-11-16): C7 is split. C7-A, C7-B and C7-R (the enclosure bridge) are KNOWN-REFORMULATION and locked (T-C7-R); C7-LB (envelope → lower bound) FAIL (T-C7-LB); C7-F(raw), the raw Fisher-spectrum reading of this record, FAIL as an invariant universal claim (T-C7-FRAW); C7-F(inv), the invariant reading, OPEN (T-C7-FINV). This record keeps its original wording and stays OPEN in its invariant reading. Record: research/constructions/c7_lock_audit.md.',
       'final C7 audit: split statuses recorded', pro=[('card:C7Lr', 'C7-F(inv) OPEN')], con=[('card:C7Lq', 'C7-F(raw) FAIL')])
note16('T-C7-BRIDGE', 'Final C7 audit (2026-11-16): refined, not erased. The pass-1 umbrella status C7-KNOWN-REFORMULATION is split: this bridge is now C7-R (T-C7-R, KNOWN-REFORMULATION, locked). Corrections: the analyticity link needs the even, 2π-periodic statement (C7Lh); exact axes hold at Gauss–Chebyshev (first-kind) nodes only (C7Li); the periodic "√N × envelope" holds in the complex convention with 2K + 1 ≤ N (C7Lj); the enclosing ellipsoid is proved (C7Le); reparametrization invariance is set-level (C7Lo).',
       'final C7 audit: scope refined to C7-R', pro=[('card:C7Lp', 'C7-R final')])
rate('T-C7-R', KN, MULTI, 30, 10, 'The enclosure bridge survives the audit in corrected form: exact Minkowski enclosure, directional bound, a proved conservative ellipsoid, locked conventions. Every ingredient is known mathematics after x = cos φ. Upper bound only.',
     'A lower bound under stated non-degeneracy (C7-LB+), outside this locked branch.', 'A uniformly enveloped family leaving the stated enclosure (none found).', GC, ('pass', 'pass', 'partial', 'pass', 'n/a'), depth='STRUCTURAL TRANSFER')
byid['T-C7-R']['assessment'].update(date='2026-11-16', applicationBreadth=3, novelty='VALIDATION OF KNOWN MATHEMATICS')
rate('T-C7-FRAW', SM, MULTI, 0, 5, 'Reparametrizations that keep the function set rescale or reshape the raw Fisher spectrum arbitrarily, while every output-side object is fixed. So no universal chart-independent implication from coefficient decay to raw Fisher decay exists.',
     'None for the raw reading; an invariant reading is T-C7-FINV.', 'Already falsified as a universal claim (C7Lm).', GC, ('fail', 'fail', 'fail', 'pass', 'n/a'), state='low-confidence-active', depth='FAIL', correct='not established')
byid['T-C7-FRAW']['assessment'].update(date='2026-11-16', applicationBreadth=3)
# C7 lock wording patches (2026-11-16, Act VIII pass; C7 not reopened)
_r = byid['T-C7-R']
_old = _r['normalizedStatement']
_r['normalizedStatement'] = _old.replace('(2) Y(Θ) ⊆ V_mD_m·[−1, 1]^m ⊕ [−R_m, R_m]^N (exact Minkowski enclosure)', '(2) the exact coefficient-box/Minkowski set inclusion used in the argument is Y(Θ) ⊆ V_mD_m·[−1, 1]^m ⊕ [−R_m, R_m]^N (equality with the model image not claimed)').replace('(1) d_m(F; C[−1, 1]) ≤ R_m = Σ_(k≥m) r_k;', '(1) choosing L_m = span{T_0, …, T_(m−1)} proves d_m(F; C[−1, 1]) ≤ R_m = Σ_(k≥m) r_k (equality not guaranteed for an arbitrary enveloped family; sharpness needs an extremal family and is stated separately);')
assert _r['normalizedStatement'] != _old
_r['history'].append(dict(date='2026-11-16', change=f'wording patch (Act VIII pass; C7 not reopened): "exact Minkowski enclosure" → exact coefficient-box/Minkowski set inclusion; Kolmogorov sharpness not claimed. Previous wording: {_old}'))
_a = _r['assessment']; _oldwhy = _a['why']
_a['why'] = _oldwhy.replace('exact Minkowski enclosure', 'the exact coefficient-box/Minkowski set inclusion used in the argument')
_r['history'].append(dict(date='2026-11-16', change=f'rating "why" wording patch. Previous wording: {_oldwhy}'))
# Act VIII first construction pass (2026-11-16): notes on the existing records and ratings of the new ones
A8REC = 'research/constructions/act8_finite_infinite_h3_c.md'
note16('T-H3', f'Act VIII (2026-11-16): this record is H3-original; status OPEN, not replaced. Components: the time–circle example is an ESTABLISHED INSTANCE in its corrected reading (A8Ca, A8Cd); "converge to infinity" (T-TIME-CIRCLE-0) FAIL; c as "a rule in the manifold" ESTABLISHED (c fixes the preserved form, A8La); "c also converges to infinity" like t is SUPERFICIAL (c is fixed in each theory; only the family index tends to ∞). Candidates, not renamed H3: T-H3-ACTION (PROJECT SYNTHESIS), T-H3-QUOTIENT (RESTRICTED), T-H3-C (RESTRICTED). Record: {A8REC}.',
       'Act VIII: H3-original kept; candidates recorded separately', pro=[('card:A8Ca', 'circle instance')], con=[('card:A8Sa', 'c is a family index, not an action parameter like t')])
note16('T-STAR', f'Act VIII (2026-11-16): this record is STAR-original; it keeps its wording and stays OPEN. Readings with independent statuses: T-STAR-A (forced periodicity) FAIL; T-STAR-B (existence) RESTRICTED; T-STAR-C (recurrence) RESTRICTED to Poincaré recurrence. The H3/★ hierarchy is not decided. Record: {A8REC}.',
       'Act VIII: three readings tested separately', con=[('card:A8X1', 'the forced-periodicity reading fails on the compact torus')])
note16('T-TIME-CIRCLE-0', 'Act VIII (2026-11-16): FAIL. For ω ≠ 0, cos ωt and sin ωt stay in [−1, 1] and have no limit as t → ∞; they neither converge nor tend to infinity (A8Cc). Kept verbatim as a historical conjecture.',
       'Act VIII: classified FAIL', con=[('card:A8Cc', 'bounded, no limit')])
note16('T-TIME-CIRCLE', 'Act VIII (2026-11-16): exact form — t ∈ ℝ acts on S¹ by Φ_t(z) = e^(iωt)z; Stab = (2π/|ω|)ℤ; ℝ/Tℤ ≅ S¹ via t ↦ ωt/2π; the covering ℝ → S¹ carries the unbounded lift (A8Ce, A8Cf). The circle itself is compact and is not called infinite.',
       'Act VIII: quotient / covering form', pro=[('card:A8Ce', 'stabilizer and quotient'), ('card:A8Cf', 'covering'), ('card:A8Cd', 'lift and cycles unbounded')])
note16('T-SCHEMA', 'Act VIII (2026-11-16): in the one-parameter-action framework the three behaviours are distinct classes of one decision tree: wrapping = periodic (Stab = Tℤ); quasi-periodic winding = free with compact closure and recurrence; boundary approach = drift (the velocity flow on (−1, 1) is conjugate to translation on ℝ by artanh, A8Pg). They are not the same.',
       'Act VIII: the three behaviours classified', pro=[('card:A8Pg', 'boundary approach ≅ drift'), ('card:A8Pb', 'free orbits split')])
note16('T-C-ROLES', 'Act VIII (2026-11-16), restricted answer to H3-1: Role 2 (c fixes the invariant form) and Role 3 (c → ∞) are roles of the same form constant. At finite c the value of c is not an isomorphism invariant (finite-c forms congruent, finite-c algebras isomorphic); the invariant content is finiteness — M_c nondegenerate and the algebra Poincaré exactly when c < ∞ (A8Ma, A8Mc, A8Lc). Known mathematics; it does not make c an instance of the circle mechanism (T-H3-C).',
       'Act VIII: H3-1 restricted answer', pro=[('card:A8Mc', 'degenerate limit outside the congruence class'), ('card:A8Lc', 'contraction: c = ∞ is the only non-isomorphic member')])
note16('T-GEOM-RULES', 'Act VIII (2026-11-16), answer in the examples: the behaviour is decided by the action (generator and stabilizer; on tori the integer relations of ω), while preserved forms confine the orbit and fix observable bounds; the same torus with the same invariants carries periodic, subtorus and dense orbits (A8Ua).',
       'Act VIII: rule identified in each example', pro=[('card:A8Ua', 'integer relation lattice decides')])
note16('T-CIRCLE-NOT-THESIS', 'Act VIII (2026-11-16): confirmed — a compact image does not force periodicity (A8X1), and periodicity does not need a compact state space (A8X4).',
       'Act VIII: two counterexamples', pro=[('card:A8X1', ''), ('card:A8X4', '')])
note16('B-FINITE-INFINITE', 'Act VIII (2026-11-16): the precise form available is H3-action (PROJECT SYNTHESIS): an unbounded parameter acting on a constrained state space, with the behaviour decided by the action, its stabilizer and orbit closure; "infinite" names its object.',
       'Act VIII: precise form recorded', pro=[('card:A8Da', 'finite/infinite distinction table')])
def rate_a8(rid, breadth_int, novelty, *a, **k):
    rate(rid, *a, **k)
    byid[rid]['assessment'].update(date='2026-11-16', applicationBreadth=breadth_int, novelty=novelty)
VKM = 'VALIDATION OF KNOWN MATHEMATICS'
rate_a8('T-H3-ACTION', 2, VKM, KN, MULTI, 30, 15, 'Applies unchanged to every action example (circle, tori, cylinder, interval, plane, velocity flow): the stabilizer trichotomy and orbit-closure dichotomies decide the class, and the unbounded parameter domain is common to all. Its content is definitions plus known theorems; the "invariants" clause is corrected.',
        'A system where the classes predict something not already in the definitions, stated before checking.', 'A continuous action whose behaviour class is not fixed by its stabilizer, orbit closure and recurrence (impossible by definition).', GC, ('pass', 'pass', 'pass', 'pass', 'n/a'), depth='STRUCTURAL TRANSFER')
rate_a8('T-H3-QUOTIENT', 1, VKM, KN, FAM, 20, 15, 'Exact for the periodic class (quotient ℝ/Tℤ, covering) and, through the compact orbit closure, for the free recurrent class; true of everything with the alternative "orbit"; fails for boundary approach.',
        'An object that encodes boundary approach (a compactification) shared with the periodic examples.', 'Already restricted: boundary approach is encoded by none of the listed objects (A8Pg).', GC, ('pass', 'partial', 'partial', 'pass', 'n/a'), depth='STRUCTURAL TRANSFER')
rate_a8('T-H3-C', 1, VKM, PD, FAM, 10, 25, 'The wrapping mechanism does not transfer to c: c is a family index, its family drifts to a degenerate boundary form, and no member or limit has an elliptic generator. What survives is the known preserved-form correspondence (t ↔ rapidity s, circle radius r ↔ c) and finiteness of c as the invariant content.',
        'An exact object, stated before checking, shared by the time–circle action and the c-family beyond the known preserved-form subgroup.', 'Already falsified as "same construction" (A8Sa, A8Sb).', GC, ('pass', 'fail', 'fail', 'pass', 'n/a'), state='low-confidence-active', depth='FAIL', correct='established under assumptions')
rate_a8('T-STAR-A', 1, VKM, SM, MULTI, 0, 5, 'Fails on compact spaces: the irrational torus flow has no periodic orbit; the logistic flow on [0, 1] has no non-constant periodic orbit.',
        'None for this reading; ★ itself stays open.', 'Already falsified (A8X1, A8X3).', GC, ('fail', 'fail', 'fail', 'pass', 'n/a'), state='low-confidence-active', depth='FAIL', correct='not established')
rate_a8('T-STAR-B', 2, 'PROJECT CLASSIFICATION OF KNOWN MATHEMATICS', PD, MULTI, 15, 20, 'Vacuous if fixed points count; for non-constant periodic orbits it depends on the space (false on intervals, true on S¹ and on manifolds of dimension ≥ 2).',
        'A carded proof of the dimension ≥ 2 construction.', 'A smooth manifold of dimension ≥ 2 with no flow having a non-constant periodic orbit (none: the bump construction gives one).', GC, ('pass', 'partial', 'n/a', 'pass', 'n/a'))
rate_a8('T-STAR-C', 2, VKM, KN, MULTI, 15, 10, 'Reduces to the Poincaré recurrence theorem with all its hypotheses (invariant measure, finite total measure, almost every point); each hypothesis is needed.',
        'A recurrence statement that needs fewer hypotheses for a stated class of rule-bound geometries.', 'A measure-preserving flow on a finite measure space with a positive-measure set of non-recurrent points (impossible by the theorem).', GC, ('pass', 'pass', 'n/a', 'pass', 'n/a'), depth='TRIVIAL CONSEQUENCE')

# Act VIII story-integration pass (2026-11-16): corrections keep the old wording in history; the H3-c split; recovered provenance
RR3 = 'docs/restructure_report_rev3.md'
def a8s_norm(rid, new, why):
    r = byid[rid]
    old = r['normalizedStatement']
    r['normalizedStatement'] = new
    r['history'].append(dict(date='2026-11-16', change=f'story-integration pass: {why}. Previous wording: {old}'))
a8s_norm('T-STAR-B', 'Restricted form, in an explicit category: smooth manifolds without boundary (Hausdorff, second countable) with flows of smooth complete vector fields. Such a manifold carries a flow with a non-constant periodic orbit ⟺ some component has dimension ≥ 2 (a compactly supported bump-rotation field in a chart, A8Ba; completeness: Lee 2012) or is diffeomorphic to S¹; otherwise every component is a point or ℝ (Milnor 1965) and flows on ℝ have no non-constant periodic orbit (A8Pe). With fixed points counted as periodic the claim is vacuous (the trivial flow). Not stated for arbitrary "geometrical objects".', 'restricted to an explicitly defined category (the pass-1 "dimension ≥ 2" was too broad)')
note16('T-STAR-B', 'Story-integration pass (2026-11-16): stays RESTRICTED; the category (smooth manifolds, complete smooth flows) is now explicit and the dimension ≥ 2 construction is carded (A8Ba).', 'story pass: category made explicit', pro=[('card:A8Ba', 'bump-rotation field: a non-constant periodic orbit')])
a8s_norm('T-STAR-C', 'Restricted form = the Poincaré recurrence theorem: for a measure-preserving flow on a space of finite total measure, almost every point is recurrent. These are the hypotheses of the standard theorem (its guarantee), not necessary conditions for recurrence: the rotation of ℝ² (infinite measure) and θ̇ = 2 + cos θ on S¹ (Lebesgue not invariant; invariant density 1/(2 + cos θ)) recur everywhere (A8Va). In A8Pd\'s examples the guarantee is unavailable and recurrence in fact fails there. Compactness alone gives only topological recurrence of some point (minimal sets), source-only here.', '"each hypothesis is needed" corrected: hypotheses of the guarantee, not of recurrence itself')
note16('T-STAR-C', 'Story-integration pass (2026-11-16): stays RESTRICTED; wording corrected — the finite invariant measure and measure preservation are hypotheses of the standard theorem, not necessary for recurrence (A8Va).', 'story pass: hypotheses vs recurrence', pro=[('card:A8Va', 'recurrence without the hypotheses')])
a8s_norm('T-H3-QUOTIENT', 'Restricted and corrected: periodic case — for a continuous homomorphism χ: ℝ → S¹ or Tⁿ with kernel Tℤ ≠ {0}, ℝ/ker χ ≅ image (homeomorphism) and ℝ → S¹ is a covering (A8Fa, A8Ka, A8Ce, A8Cf); quasi-periodic/dense case — ker χ = {0}, the image is not closed and χ is not a homeomorphism onto it; the bounded representation is the orbit closure, a subtorus of dimension n − rank(integer relations) (A8Kb, A8Te). The two cases use different objects. With the alternative "orbit" the statement is true of every action (too broad). Boundary approach is encoded by neither (A8Pg).', 'quotient and orbit closure separated')
note16('T-H3-QUOTIENT', 'Story-integration pass (2026-11-16): stays RESTRICTED; the periodic case (kernel/quotient) and the dense case (orbit closure/subtorus) are kept as different objects (A8Ka, A8Kb).', 'story pass: kernel vs closure', pro=[('card:A8Ka', ''), ('card:A8Fa', '')], con=[('card:A8Kb', 'the dense case is not a quotient of ℝ')])
note16('T-H3-C', 'Story-integration pass (2026-11-16): SPLIT into T-H3-C-DIRECT (literal t ↔ c → ∞: FAIL / superficial), T-H3-GROUP (preserved-form one-parameter groups: ESTABLISHED INSTANCE) and T-H3-C-FAMILY (c-indexed forms, singular and Galilean limits: RESTRICTED; H3 connection OPEN). This record keeps the verbatim c-clause of H3-original; its pass-1 combined rating is superseded and the three records are not merged back.', 'story pass: H3-c split')
_a = byid['T-H3-C']['assessment']
_a['ratingHistory'].append(dict(date='2026-11-16', fromBackbone=_a['backboneSupport'], fromSlop=_a['slopRisk'], toBackbone=_a['backboneSupport'], toSlop=_a['slopRisk'], reason='superseded by the split (T-H3-C-DIRECT, T-H3-GROUP, T-H3-C-FAMILY); kept as history'))
# branchState stays as rated (allowed values: active, low-confidence-active, inactive-archived); the split is recorded in ratingHistory and boundaries
_old = byid['T-H3-C']['normalizedStatement']
byid['T-H3-C']['normalizedStatement'] = _old.replace('Surviving restricted correspondence: both examples are one-parameter subgroups preserving a quadratic form (CF1/S4), with t ↔ rapidity s and the circle radius r ↔ c; no member or limit of the c-family is elliptic.', 'Pass-1 correspondence superseded (2026-11-16): the comparison is θ ↔ φ (rapidity, tanh φ = v/c), c is a distinct object, and "circle radius r ↔ c" has no exact map (A8Wa, A8Wb).')
assert byid['T-H3-C']['normalizedStatement'] != _old
byid['T-H3-C']['history'].append(dict(date='2026-11-16', change=f'story-integration pass: "r ↔ c" removed from the live statement. Previous wording: {_old}'))
for _b in list(byid['T-C-ROLES']['boundaries']):
    if 'the invariant content is finiteness' in _b:
        i = byid['T-C-ROLES']['boundaries'].index(_b)
        byid['T-C-ROLES']['boundaries'][i] = 'SUPERSEDED (2026-11-16, story-integration pass; too broad): ' + _b
byid['T-C-ROLES']['history'].append(dict(date='2026-11-16', change='story-integration pass: the boundary "the invariant content is finiteness" marked SUPERSEDED (kept verbatim) and replaced by the restricted statement'))
note16('T-C-ROLES', 'Story-integration pass (2026-11-16), restricted answer to H3-1 (replaces the superseded finiteness statement): for the bare family M_c = diag(1, −1/c²), all finite c > 0 forms are congruent under a spatial rescaling, so the congruence class of this isolated form does not distinguish the finite value of c (A8Wc). This does NOT mean that physical c has no significance beyond finiteness: kept distinct are finite-c unit normalization, the causal structure (x = ±ct), dimensionless ratios such as v/c (tanh φ = v/c), and the external family limit c → ∞. In the velocity parametrization det K_c = −1/c² links Role 2 (the hyperbolic generator) and Role 3 (κ → 0⁻) (A8Qa).',
       'story pass: restricted content of c', pro=[('card:A8Wc', ''), ('card:A8Qa', '')])
note16('T-H3', 'Story-integration pass (2026-11-16): H3-original kept verbatim and OPEN. The pass-1 candidate H3-c is split: H3-c-direct FAIL / superficial; H3-group ESTABLISHED INSTANCE (θ ↔ φ, the generator theorem); H3-c-family RESTRICTED, connection to H3 OPEN. Correct comparison: θ ↔ φ (rapidity), not t ↔ c.', 'story pass: H3-c split', pro=[('card:A8Ga', 'generator theorem'), ('card:A8Fa', 'Fourier character')])
note16('T-STAR', f'Story-integration pass (2026-11-16): STAR-A\'s FAIL is kept and its lesson recorded (T-STAR-A-LESSON: geometry alone does not determine periodicity); it is not a failure of the backbone. The terms of ★ left open in AMB-7 (a)–(c) are in {RR3}.', 'story pass: STAR-A lesson; AMB-7 recovered', pro=[('card:A8Ua', 'the generator decides')])
_r = byid['T-STAR']
_r['boundaries'] = [b.replace('(AMB-7 a–c).', f'(AMB-7 a–c, {RR3}).') for b in _r['boundaries']]
_r = byid['T-TIME-CIRCLE-0']
_oa = dict(_r['audit']) if isinstance(_r['audit'], dict) else _r['audit']
if isinstance(_r['audit'], dict) and 'note' in _r['audit']:
    _r['audit']['note'] = _r['audit']['note'].replace('quoted only in the report (AMB-15); no record', f'quoted in the report (AMB-15), recovered to {RR3} on 2026-11-16')
_r['history'].append(dict(date='2026-11-16', change=f'story-integration pass: AMB-15 recovered to {RR3}; audit note updated. Previous audit: {_oa}'))
def rate_a8s(rid, breadth_int, novelty, *a, **k):
    rate(rid, *a, **k)
    byid[rid]['assessment'].update(date='2026-11-16', applicationBreadth=breadth_int, novelty=novelty)
rate_a8s('T-H3-GROUP', 2, VKM, KN, MULTI, 35, 10, 'The generator theorem is proved (A8Ga) and realized on six supplied forms (A8Gb); circle rotations and Lorentz boosts are its canonical instances with θ ↔ φ; the continuation types differ (A8Ec). Story contribution: PRESERVED STRUCTURE → TRANSFORMATION → DYNAMICS/CONTINUATION.',
         'A further independently supplied form whose generator type predicts a behaviour not yet carded, stated before checking.', 'A K with KᵀM + MK = 0 whose flow fails to preserve M (impossible by A8Ga).', GC, ('pass', 'pass', 'pass', 'pass', 'n/a'), depth='STRUCTURAL TRANSFER')
rate_a8s('T-H3-C-DIRECT', 1, VKM, SM, FAM, 0, 5, 'c is a form/unit constant, fixed inside each theory; the group parameter is the rapidity. The literal analogy has no exact map.',
         'None for this reading.', 'Already falsified (A8Sa, A8Wa, A8Wb).', GC, ('fail', 'fail', 'fail', 'pass', 'n/a'), state='low-confidence-active', depth='FAIL', correct='not established')
rate_a8s('T-H3-C-FAMILY', 2, VKM, KN, MULTI, 20, 20, 'Established pieces (degenerate limit, fixed-v Galilean limit, contraction, the κ-family shared with the oscillator); restricted because every limit depends on the scaling held fixed. Connection to H3 OPEN. Story contribution: GEOMETRY → CROSS-SYSTEM TRANSFER (prepared; mass-wave handoff).',
         'An exact object linking the family limit to the time–circle continuation beyond the shared parabolic member, stated before checking.', 'A scaling in which the stated limits fail (A8X5 already shows one where nothing contracts).', GC, ('pass', 'partial', 'partial', 'pass', 'n/a'), depth='STRUCTURAL TRANSFER')
rate_a8s('T-GEOM-GEN-DYN', 2, 'PROJECT CLASSIFICATION OF KNOWN MATHEMATICS', PD, MULTI, 30, 15, 'Exact in the canonical examples: the supplied form fixes G_M and 𝔤_M; the generator decides the orbit type (det sign in 2D; integer relations on tori; three types on one 3D Lorentzian form). Not a universal theorem. Story contribution: the main GEOMETRY → DYNAMICS/CONTINUATION bridge.',
         'A general classification of continuation types from (M, K) in a stated class, proved.', 'A supplied form whose generators all give the same continuation type although they differ in the deciding invariant (not found).', GC, ('pass', 'partial', 'n/a', 'pass', 'n/a'), depth='STRUCTURAL TRANSFER')

update('T-CF11-A', TRIV, bs=60, slop=8, reason='Pass 3: the pattern holds in coordinate-free form (F*T = T) across constant-form, symplectic and homogeneous Fisher geometries, and its boundary is now exact (generic Fisher geometry is not characterized by a transformation group, CFT5f). Application Breadth corrected from 4 to 3: the rubric reserves 4 for a physical/empirical system')

for r in R:
    for i in r['related']:
        assert i in byid, f"{r['id']}: related {i} missing"
        if r['id'] not in byid[i]['related']:
            byid[i]['related'].append(r['id'])

out = ROOT / 'research' / 'theories.json'
tq = {q['id']: q for p in json.loads((ROOT / 'research' / 'graph.json').read_text())['pairs'] for q in p['transferQuestions']}
for r in R:
    if r['id'].startswith('T-TQ-'):
        q = tq[r['id'][2:]]
        r['words'] = q['text']; r['label'] = f"{q['id']}: {q['title']}"
out.write_text(json.dumps({
    'about': 'Theory registry (provenance layer of the research graph, with each theory\'s proof program). Every record keeps the original wording; evidence against a theory is attached, never used to delete it. Generated from research/tools/theories_source.py; checked by test/theories.test.js; rendered to research/theory_coverage.md.',
    'kinds': ['hypothesis', 'open-question', 'derived-connection', 'philosophical-exploration', 'historical-conjecture', 'established', 'method-rule', 'construction-backed-direction'],
    'statuses': ['established', 'derived', 'hypothesis', 'open', 'governance'],
    'statusNote': 'governance marks a method / governance rule (kind method-rule): it carries no epistemic status and needs no proof. The four epistemic statuses apply to every other record.',
    'acts': ['I', 'II', 'III', 'IV', 'II–IV', 'Guide', 'Final', 'all', 'unplaced'],
    'researchModes': ['theorem-target'],
    'researchDirections': ['outside-in'],
    'researchOutcomes': list(OUTCOMES),
    'researchNote': 'status is the reported epistemic status (how much is proved now). researchDirection outside-in: construct first, classify second (docs/research_method.md). researchMode theorem-target: the theory holds during construction, whatever its status. construction is the primary program and proofTarget the proof program, both filled gradually; lastResearchOutcome stays null until a research pass reports one of researchOutcomes. knownExamples are never exhaustive unless a stated theorem (basis) makes them so.',
    'theories': R}, ensure_ascii=False, indent=2) + '\n')
print(len(R), 'records')
