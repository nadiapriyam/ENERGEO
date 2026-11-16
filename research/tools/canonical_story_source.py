"""Canonical story diagnostic (2026-11-16): the question → relation → next-question graph of Geometry of Representation,
and the alignment of the current repository with it.
Writes research/canonical_story.json and renders research/canonical_story.md.
Decisions: docs/restructure_decisions.md, "Canonical story diagnostic". This is a DIAGNOSTIC ARTIFACT, not a replacement
architecture: the Master Story (the historical question-by-question journey, docs/Interactive_Master_Map.extracted.md)
and the Foundation Spine (research/master_math_map.md, Part I) are both kept.
No new mathematics: every relation cited here is already carded or sourced in the repository.
Run: python3 research/tools/canonical_story_source.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
MM = 'docs/Interactive_Master_Map.extracted.md'
G2 = 'docs/gate2_answers.md'
RD = 'docs/restructure_decisions.md'
CP = 'docs/claude_code_prompt.md'
ACTIONS = ['KEEP', 'MOVE', 'RECLASSIFY', 'ADD CONNECTIVE SENTENCE', 'ADD DIAGRAM EDGE', 'SPLIT', 'PARK AS OPTIONAL', 'SUPERSEDE WORDING', 'DELETE DUPLICATE/ASSISTANT-INVENTED LIVE CLAIM']
CATEGORIES = {'A': 'ANSWERS AN EXISTING QUESTION', 'B': 'CONNECTS TWO EXISTING QUESTIONS', 'C': 'SUPPORTING MATHEMATICS', 'D': 'OPTIONAL RESEARCH BRANCH', 'E': 'CONTRADICTS / REFINES AN OLD CONJECTURE'}
SPINE = ['OBJECT', 'REPRESENTATION', 'RELATION', 'ZERO/BALANCE/NULL', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY', 'INFORMATION', 'DYNAMICS/CONTINUATION', 'CROSS-SYSTEM TRANSFER', 'APPLICATION']

PROVENANCE = dict(
 used=[f'{MM} (the original Master Map, "Recovered topic map from the Paper Structure Review discussion": 20 topics, each with "What carries forward", and its own list of next questions)',
       f'{CP} §1–1b (H1–H3 in Nadia\'s words; the projection clarification f̂(n) = ⟨f, e_n⟩)', f'{G2} (answers 1–9: develop, convergence, c → ∞, which manifold, relationship ridden, the circle wording, q_M, the infinite/finite objects, the Master Map\'s role)',
       f'{RD} (backbone statements, R1–R19, D1–D13, Pair A/Pair B decisions, the model-manifold story, the Act VIII decisions and this diagnostic\'s decisions)',
       'docs/restructure_report_rev3.md (AMB register), docs/act_map.md (teaching order), docs/author_philosophy.md'],
 notAvailable='The project conversations "Refine ThermaLens Thesis", "Paper Structure Review", "Explain Translation Invariance" and "Sustainability Essay Outline" are not in this repository and could not be opened here (they are not in the connected Drive). The Master Map preserves the Paper Structure Review sequence; the Chain A questions are taken from Nadia\'s recollection recorded verbatim in the 2026-11-16 decisions. Nothing below is quoted from those conversations directly.',
 rule='Question → mathematical relation discovered → next question created by that relation. No theorem-first ordering.')

# ── A. The Master Story: the 20 historical nodes (titles verbatim from the Master Map) ───────────────
# q = the question Nadia was asking; rel = the relation that answered or sharpened it; nxt = the next question it created.
# Quoted text marked (MM), (G2 n), (RD), (brief) is verbatim from that document; unmarked text is a short neutral gloss.
MASTER = [
 dict(n=1, title='What is a signal? — Make the invisible visible', q='What is a signal? (MM)', rel='"something physical can be represented by a mathematical function" (MM): x(t)',
      nxt='what if the signal measured electrical power instead of sound? (MM, #2)', carries='The waveform remains available for the next interactive. (MM)', spine=['OBJECT', 'REPRESENTATION'], repo='OB1; Part II (signals); Act I–IV teaching order'),
 dict(n=2, title='Music as a mathematical language — Build your own sound', q='what if the signal measured electrical power instead of sound? (MM)', rel='"A function can represent different physical phenomena, but its meaning depends on what is measured." (MM)',
      nxt='find the repeating pattern (#3); the meaning of a measured quantity returns at #11 and #20', carries='A function can represent different physical phenomena, but its meaning depends on what is measured. (MM)', spine=['OBJECT'], repo='OB1 (shared vocabulary ≠ shared object), A3, ON9'),
 dict(n=3, title='Periodicity in nature — Find the repeating pattern', q='does a segment align with the rest of the signal, and what happens for a nonperiodic sound? (MM)', rel='a period: x(t + T) = x(t); "Repetition introduces a mathematical transformation that preserves a pattern." (MM)',
      nxt='"What remains unchanged when the pattern shifts?" (MM)', carries='Repetition introduces a mathematical transformation that preserves a pattern. (MM)', spine=['TRANSFORMATION', 'DYNAMICS/CONTINUATION'], repo='R6, T1, C8, I1; Act IV; Pair B (T-PAIRB)'),
 dict(n=4, title='Symmetry across space and time — Move without changing', q='"What remains unchanged when the pattern shifts?" (MM)', rel='translation T_τ and the rotating wheel: "Symmetry is connected to what remains unchanged when something moves or transforms." (MM)',
      nxt='"Could the same pattern have another representation?" (MM)', carries='Symmetry is connected to what remains unchanged when something moves or transforms. (MM)', spine=['TRANSFORMATION', 'PRESERVED STRUCTURE'], repo='T1–T4 (translation → correlation → symmetry defect), TA0, the rotation case of the S4 trichotomy'),
 dict(n=5, title='What is a representation? — One thing, different mathematical views', q='"Are these different objects, or different descriptions of one object?" (MM)', rel='"Mathematical representations can look different while preserving relationships." (MM)',
      nxt='Fourier: "This prepares the visitor for Fourier analysis." (MM)', carries='Mathematical representations can look different while preserving relationships. This prepares the visitor for Fourier analysis. (MM)', spine=['REPRESENTATION'], repo='T-REPRESENTATION, TA0 (R1 covariance), Act III'),
 dict(n=6, title='Fourier series — Construct a complex wave from circles', q='can a complex wave be built from rotating points? (MM)', rel='f = Σ c_k e^(2πikt); "Complex signals can be represented as combinations of simpler basis functions." (MM)',
      nxt='"Why can these components be separated?" (MM)', carries='Complex signals can be represented as combinations of simpler basis functions. (MM)', spine=['REPRESENTATION'], repo='R1, R2, R6 (the rotating point), D3'),
 dict(n=7, title='Fourier coefficients and orthonormal bases — Give every harmonic a role', q='"Why can these components be separated?" (MM)', rel='the coefficient is a projection: f̂(n) = ⟨f, e^(2πint)⟩ (CP §1b); removing a coefficient removes exactly that component; f̂(k) = 0 while f ≠ 0',
      nxt='what does that zero mean? f̂(k) = 0 "does not mean f = 0. … It means a relation between f and the mode e_k." (brief)', carries='Each coefficient specifies how much of a basis component contributes to the overall representation. (MM)', spine=['REPRESENTATION', 'RELATION'], repo='R2, Z7; Master Map #7 interactive (built)'),
 dict(n=8, title='Orthogonality and zero — Find the relationship that disappears', q='what does a zero coefficient, or a zero dot product, mean?', rel='⟨e_j, e_k⟩ = δ_jk; ⟨u, v⟩ = 0; "zero not as an empty space, but as the result of a particular mathematical relationship" (MM); projection residual ⊥ retained part; Pythagoras',
      nxt='"What does perpendicular mean beyond three dimensions?" (MM)', carries='Orthogonality is a property defined through an inner product, not only through visible perpendicular lines. (MM)', spine=['RELATION', 'ZERO/BALANCE/NULL'], repo='ON1–ON3, Z4, Z7, BR1–BR3; #8 interactive (built)'),
 dict(n=9, title='Orthogonality beyond visible dimensions — Explore what cannot be seen', q='"What does perpendicular mean beyond three dimensions?" (MM)', rel='inner products in ℝⁿ and L²; a projection can show perpendicular vectors that are not orthogonal (O1b); "Geometry is not limited to physically visible dimensions." (MM)',
      nxt='what is reached in the limit of infinitely many components (#10); what larger geometry stands behind a visible shadow (Act III, R4 construction)', carries='Geometry is not limited to physically visible dimensions. (MM)', spine=['GEOMETRY', 'REPRESENTATION'], repo='ON4, ON5, R8, H1, H2 (R4 tetrahedral construction), T-BEYOND-3D, Act III'),
 dict(n=10, title='Mean-square convergence — Watch infinity being approached', q='"how an indefinitely extendable process can approach or define a bounded or finite structure" (G2 2)', rel='‖S_N − f‖₂ → 0 while the pointwise overshoot persists (C8c FAIL kept, C8c2); "Convergence depends on how we define and measure closeness." (MM)',
      nxt='"Where did the magnitude go?" (MM, #11)', carries='Convergence depends on how we define and measure closeness. (MM)', spine=['INFORMATION', 'DYNAMICS/CONTINUATION'], repo='C8c, C8c2, T-INF-FIN'),
 dict(n=11, title='Squared coefficients, length, and energy — Where did the magnitude go?', q='"What does mathematical energy actually measure?" (MM); "What does squared mathematical magnitude actually mean when it is not literally physical energy?" (RD, R16)', rel='‖f‖² = Σ|f̂(k)|² (Parseval, R3); squared magnitude is additive under orthogonal decomposition; "Squared magnitude can be preserved across representations, but its physical interpretation requires care." (MM)',
      nxt='"If mathematical energy is preserved, what other information distinguishes two representations?" (MM, #12)', carries='Squared magnitude can be preserved across representations, but its physical interpretation requires care. (MM)', spine=['PRESERVED STRUCTURE', 'INFORMATION'], repo='R3, ON1, ON9, A3, D26'),
 dict(n=12, title='Fourier pairs — Change the representation, not the underlying information', q='"If mathematical energy is preserved, what other information distinguishes two representations?" (MM)', rel='x(t) ↔ x̂(ω); a phase change keeps |x̂| and changes x (magnitude does not determine the signal); translation ↔ phase (R4)',
      nxt='what does zero mean in each of these structures (#13); conjugate pairs of coefficients (#17); what is lost and recovered (Act VI)', carries='A representation may preserve one property while expressing other properties differently. (MM)', spine=['REPRESENTATION', 'INFORMATION'], repo='R4, P1, T-MAGPHASE, B5a FAIL kept, RI0, D14, D15'),
 dict(n=13, title='Zero as a mathematical cornerstone — Explore different meanings of nothing', q='a zero-length vector, a zero Fourier coefficient, a zero inner product, the zero-frequency component: are they the same zero? (MM)', rel='"Zero has different roles depending on the mathematical structure in which it appears." (MM); same visible result “0” can arise from different hidden relations (brief)',
      nxt='"the relationship between the origin, norm, squared norm, zero, and the identity matrix" (MM, #14); later the primary backbone statement and the zero questions (RD)', carries='Zero has different roles depending on the mathematical structure in which it appears. (MM)', spine=['ZERO/BALANCE/NULL'], repo='Z1–Z13, D7, D8, Act I (Chapter I), T-BACKBONE-PRIMARY'),
 dict(n=14, title='Quadratic geometry and the identity matrix — Change the rule for measuring space', q='What does it mean for x to be relative to zero? What is |x|, |x|²? Why does the squared norm look energy-like? What happens when M ≠ I? (brief)', rel='|x| = distance from x to 0; q_I(x) = x†x = |x|²; q_M(x) = x†Mx (G2 7); if x′ = Ax, x†A†MAx = x†Mx for all x ⟺ A†MA = M (CF1); "Geometry depends partly on how we define measurement." (MM)',
      nxt='which transformations keep a relation, and what do they generate (CF4; later T-GEN-DYN-Q); what distance means on a model / prediction manifold (#15)', carries='Geometry depends partly on how we define measurement. (MM)', spine=['RELATION', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY'], repo='CF1–CF4, D5, D27; Gate 2 answer 7'),
 dict(n=15, title='Information geometry — Turn predictions into geometry', q='"What does distance mean when the valid representations lie on a model/prediction manifold?" (brief)', rel='ds² = dθᵀg(θ)dθ, g = JᵀJ/σ² — a position-dependent measuring rule ("distance in units of noise", CP §2); geodesics; stiff / sloppy directions; exact null directions (Z9)',
      nxt='"What exists beyond the visible model?" (MM, #16); "Could a similar geometric representation help describe time?" (MM → #18); c → ∞ as a model-family limit (G2 3 → #19)', carries='A family of predictions can possess a geometry, and distances in that geometry can express meaningful differences between model outputs. (MM)', spine=['GEOMETRY', 'INFORMATION'], repo='R7, CF10, M1, M2, Z9, D12, D33; later C7 (D13, D34–D36)'),
 dict(n=16, title='Higher-dimensional prediction space — What exists beyond the visible model?', q='"Could a mathematical description contain relationships that cannot be represented directly in our familiar three spatial dimensions?" (MM)', rel='"A mathematical space can contain more structure than a single visible projection reveals." (MM); larger possibility space → rules constrain an allowable manifold → manifestation (T-MM-STORY)',
      nxt='"Could a similar geometric representation help describe time?" (MM → #18); what survives a reduction (H6, RI0)', carries='A mathematical space can contain more structure than a single visible projection reveals. (MM)', spine=['INFORMATION', 'GEOMETRY'], repo='MM0–MM11, D32, D33, RI0, D16, D22, T-BEYOND-3D'),
 dict(n=17, title='Conjugacy and physical pairs — Search for hidden relationships', q='"Do observable physical pairings or complementarities reflect deeper symmetry analogous to mathematical conjugacy?" (RD)', rel='for a real signal f̂(−k) = conj f̂(k) (P1) — a relation created at #7/#12, not at #16',
      nxt='mass-like and wave-like descriptions (R4, R18; MW1) — the parked mass-wave branch', carries='Mathematical symmetry and conjugacy provide a foundation for asking whether observed relationships point toward deeper structures. (MM)', spine=['CROSS-SYSTEM TRANSFER'], repo='P1, P2, MW1–MW3, D20, D21'),
 dict(n=18, title='Infinity, circular geometry, and time — Your central conjecture laboratory', q='"The question I want to investigate is whether this type of relationship—an unbounded quantity expressed through a bounded geometry—has deeper mathematical analogues elsewhere." (G2 8); "whether time could be bound to finite geometry and paired with another infinite structure" (MM)', rel='t ↦ e^(iωt): bounded, no limit, periodic; ℝ/ker χ_ω ≅ S¹; a multi-frequency torus may be dense and never periodic; the cylinder has a periodic projection and an unbounded state (Act VIII); old wording "converge to infinity" FAIL',
      nxt='"Do these relationships tell us something about nature, or only about our mathematical descriptions of it?" (MM → #19); for ★: what transformations and generators produce the continuation (T-GEN-DYN-Q)', carries='The visitor has enough mathematical knowledge to distinguish different forms of infinity and investigate whether a geometric relationship supports your conjecture. (MM)', spine=['DYNAMICS/CONTINUATION'], repo='R6, I1–I3, D11, D37, D38; Act VIII record'),
 dict(n=19, title='Einstein, relativity, and mathematical reality — Change the observer', q='which measurements depend on the observer and which relationships remain invariant (MM); "If mathematics has boundaries imposed by the way it represents nature, can those boundaries be expanded?" (MM); c → ∞ "as a parameter limit in a family of theories/models" (G2 3)', rel='ΛᵀηΛ = η (L1); the boost parameter is the rapidity, tanh φ = v/c (L2); c\'s three roles; c → ∞: degenerate limit and Galilean contraction (L3, A8M, A8L)',
      nxt='"Can these mathematical ideas improve how we model finite physical resources?" (MM → #20); the two roles of c (H3-1, open)', carries='We now understand mathematical representations well enough to ask whether they preserve everything about the natural phenomena they describe. (MM)', spine=['GEOMETRY', 'PRESERVED STRUCTURE', 'CROSS-SYSTEM TRANSFER'], repo='L1–L4, D10, D39, MM5, T-C-ROLES'),
 dict(n=20, title='Finite energy — Can geometry reveal something useful?', q='"Can energy behavior be represented in a space where hidden balances, null relations, and invariants become geometrically explicit?" (RD)', rel='none yet: parked downstream (G2 9); physical energy ≠ L² magnitude unless a model identifies them (A3)',
      nxt='— (the application test; never upstream evidence)', carries='This is not a conclusion to your thesis, but a place to test whether the mathematical tools provide useful insights. (MM)', spine=['APPLICATION'], repo='A1, A2, A3, D25, D26'),
]
# The Master Map's own next-question list (verbatim, MM lines 390–404)
MM_TRANSITIONS = [('3', '4', 'After discovering periodicity: What remains unchanged when the pattern shifts?'), ('4', '5', 'After discovering symmetry: Could the same pattern have another representation?'),
                  ('6', '7', 'After Fourier reconstruction: Why can these components be separated?'), ('8', '9', 'After orthogonality: What does perpendicular mean beyond three dimensions?'),
                  ('11', '12', 'After Parseval\'s identity: What does mathematical energy actually measure?'), ('15', '18', 'After information geometry: Could a similar geometric representation help describe time?'),
                  ('18', '19', 'After your time investigation: Do these relationships tell us something about nature, or only about our mathematical descriptions of it?'), ('19', '20', 'After the philosophical exploration: Can these mathematical ideas improve how we model finite physical resources?')]

# Non-linear predecessor edges: the Master Map's numbering is the teaching order; these edges record where a question came from.
EXTRA_EDGES = [
 ('M6', 'M18', 'the rotating point is carried forward: "Its periodic behavior motivates your questions about infinite time and finite geometry." (MM)'),
 ('M6', 'M10', '#10 "Return[s] to the Fourier reconstruction" (MM)'),
 ('M7', 'M13', 'the zero coefficient is one of the zeros #13 collects'), ('M8', 'M13', 'the zero inner product is one of the zeros #13 collects'),
 ('M12', 'M17', '#17 "Begin[s] with a complex Fourier coefficient and its conjugate" (MM): its question comes from the coefficient pairs, not from #16'),
 ('M15', 'M18', '"After information geometry: Could a similar geometric representation help describe time?" (MM)'),
 ('M15', 'M19', 'c → ∞ entered from the model-manifold discussion: "The idea came from the model-manifold discussion" (G2 3)'),
 ('M11', 'M20', 'the meaning of squared magnitude vs physical energy (R16) is the energy question the application must keep apart'),
 ('M2', 'M20', '"what if the signal measured electrical power instead of sound?" (MM) returns as the power-demand signal'),
 ('M4', 'M12', 'translation ↔ phase: T_τ e_k = e^(−2πikτ)e_k (R4); the translation chain T1–T5'),
 ('M14', 'M18', 'a preserved form and its one-parameter group: rotation keeps I (CF4, S4)'), ('M14', 'M19', 'a preserved form and its one-parameter group: the boost keeps η (CF4, L1)'),
 ('M9', 'M16', 'geometry beyond the visible returns as prediction space beyond the visible model'),
]

# ── B. The relation graph: question → relation → next question, chain by chain ───────────────────────
# step kinds: Q = question node, R = relation node; each Q after the first is created by the R before it.
CHAINS = {
 'A': dict(name='Zero, magnitude and geometry', steps=[
   ('Q', 'What is x? What does it mean for x to be relative to zero? (brief)'), ('R', '|x| = distance from x to 0 (ON1, Z10)'),
   ('Q', 'What is |x|²? Why does the squared norm look energy-like? (brief)'), ('R', 'x†x = |x|² = q_I(x); orthogonal decomposition makes it additive (Pythagoras, Parseval: ON2, R3)'),
   ('Q', 'What does it mean when the quantity is mathematical L² magnitude rather than physical energy? (brief; RD R16)'), ('R', 'L² magnitude ≠ physical energy unless a model identifies them (A3, ON9)'),
   ('Q', 'What happens when M ≠ I? (brief; G2 7; MM #14)'), ('R', 'q_M(x) = x†Mx: circles become ellipses; "Geometry depends partly on how we define measurement." (MM)'),
   ('Q', 'If the representation changes, x′ = Ax, what must happen for the relation to remain the same? (brief)'), ('R', 'x†A†MAx = x†Mx for all x ⟺ A†MA = M (CF1); zero relations of B_M are kept (CF2)'),
   ('Q', 'Which transformations preserve a relation, what generates them, and what dynamics follow? (T-GEN-DYN-Q, a later question)'), ('R', 'e^(sK) preserves M ⟺ KᵀM + MK = 0 (CF4, BR11; re-carded A8Ga)')]),
 'F': dict(name='Fourier, question-driven', steps=[
   ('Q', 'What remains unchanged when the pattern shifts? (MM, after #3)'), ('R', 'a periodic signal; translation preserves its pattern (T1)'),
   ('Q', 'Could the same pattern have another representation? (MM, after #4)'), ('R', 'f = Σ c_k e_k: a sum of rotating points (#6; R1, R6)'),
   ('Q', 'Why can these components be separated? (MM, after #6)'), ('R', 'f̂(k) = ⟨f, e_k⟩: each coefficient is a projection (CP §1b; R2)'),
   ('Q', 'f̂(k) = 0 while f ≠ 0: what does that zero mean? (brief)'), ('R', 'a relation between f and e_k: f ⊥ e_k (Z7); ⟨e_j, e_k⟩ = δ_jk (R1)'),
   ('Q', 'What does perpendicular mean beyond three dimensions? (MM, after #8)'), ('R', 'inner products in ℝⁿ and L²; residual ⊥ retained part; Pythagoras (ON2, ON3)'),
   ('Q', 'What does mathematical energy actually measure? (MM, after #11)'), ('R', '‖f‖² = Σ|f̂(k)|² (Parseval, R3); energy-like, not physical energy (A3)'),
   ('Q', 'If mathematical energy is preserved, what other information distinguishes two representations? (MM, #12)'), ('R', 'phase: |x̂| does not determine x (T-MAGPHASE; B5a FAIL kept)')]),
 'Z': dict(name='Zero stays relational', steps=[
   ('Q', 'Are a zero-length vector, a zero coefficient, a zero inner product and the zero-frequency component the same zero? (MM #13)'), ('R', '"Zero has different roles depending on the mathematical structure in which it appears." (MM)'),
   ('Q', 'What appears as zero, cancellation, or balance in one representation may be evidence of an underlying geometric constraint. (RD, primary backbone)'), ('R', 'kept as distinct levels: zero may arise from nonzero structure, encode balance, define an exact relation, identify a distinguished feature, hide multiple configurations (RD, R2)'),
   ('Q', 'What can be inferred from the zero state while it remains zero? (RD)'), ('R', 'one observed zero, many hidden configurations; zero-preserving interrogation (Act I stages 2, 2b; B-ZERO-PRESERVE)'),
   ('Q', 'When presented with a zero-valued result, can we determine the hidden rules or structure that generated that zero? (RD)'), ('R', 'recovery with a known source class, obstruction without it (G3b, G4c; Q-R4-8); the zero taxonomy Z1–Z13 keeps every kind apart')]),
 'PA': dict(name='Pair A: transfer the question, not the objects', steps=[
   ('Q', 'A mass-balance zero identifies a distinguished structural location. Could another zero/cancellation state likewise encode hidden structural information? (brief)'), ('R', 'the mass-balance zero fixes the centre of mass and keeps the second moment (MB1, MB2)'),
   ('Q', 'Which questions can be transferred to the proton-cancellation zero? (RD, D5: TQ-1–TQ-6)'), ('R', 'shared algebraic form only; the equal-mass bridge; the common relation deliberately left empty (T-PAIRA-SHARED, T-PAIRA-BRIDGE)')]),
 'PB': dict(name='Pair B and ★: geometry, rules and repeated behaviour', steps=[
   ('Q', 'a physically observable periodic structure in space and a wave/phase structure in time may be manifestations of shared geometric rules. (RD, R5)'), ('R', 'the circle is one transparent case: geometric structure → constraints / symmetries → repeated behavior (RD, Pair B)'),
   ('Q', 'What observable rules arise because an object is constrained by a particular geometry? and ★ Any geometrical object that is bound by rules can be periodic. (RD)'), ('R', 'circle: periodic exactly (ℝ/ker ≅ S¹); torus: compact, possibly never periodic; cylinder: periodic projection, unbounded state (Act VIII)'),
   ('Q', 'geometry alone does not force exact periodicity — so what else bears on the continuation? (brief)'), ('R', 'the geometry, allowed transformations, generator/frequency relations, stabilizer and orbit closure all bear on the observed continuation (brief; A8Ua, A8Ec)'),
   ('Q', 'Given a preserved geometric relation, what transformations preserve it, what generators produce those transformations, and what observable dynamics follow? (RD; T-GEN-DYN-Q — a refinement of the original question, not a new story)'), ('R', 'answered in the canonical cases only (rotation, boost, Fourier character, torus); open in general')]),
 'IG': dict(name='Why model manifolds entered', steps=[
   ('Q', 'What is |x − y|? (distance as separation; brief, Chain A)'), ('R', 'distance under a measuring rule q_M (CF1; #14)'),
   ('Q', 'What does distance mean when the valid representations lie on a model/prediction manifold? (brief)'), ('R', 'Fisher metric g = JᵀJ/σ² (distance in units of noise), geodesics, identifiability, exact null directions (FB6a, Z9, M1, M2)'),
   ('Q', 'Could a spectral / coefficient hierarchy constrain prediction-space geometry? (C7, later, assistant-proposed at Gate 3)'), ('R', 'C7-R KNOWN-REFORMULATION (an enclosure, upper bound only); C7-F(raw) FAIL; C7-F(inv) OPEN — placed inside this node; C7 is not why model manifolds are in the story')]),
 'PS': dict(name='Possibility space → allowable space → manifestation', steps=[
   ('Q', 'Could a mathematical description contain relationships that cannot be represented directly in our familiar three spatial dimensions? (MM #16)'), ('R', 'larger prediction / possibility space → rules constrain an allowable manifold → representations expose different aspects (RD, T-MM-STORY)'),
   ('Q', 'What changes when a richer state or representation is mapped to an observable manifestation? (RD)'), ('R', 'what survives, collapses, becomes zero or is lost, map by map (RI0); measurement, marginalization, projection, quotient, manifold limits and coarse-graining kept as separate operations'),
   ('Q', 'The question is whether they share a deeper structural pattern. (brief)'), ('R', 'OPEN (MM6–MM10; H6)')]),
 'TC': dict(name='Circle, time, c', steps=[
   ('Q', 'Adding an infinite object like time to a finite circle geometry makes sines and cosines converge to infinity. (MM #18, historical; FAIL)'), ('R', '−1 ≤ sin t, cos t ≤ 1 (G2 6); |e^(iωt)| = 1, no limit (C8a, A8Cc)'),
   ('Q', 'an unbounded parameter → bounded geometry → indefinitely repeated structure: does it have deeper mathematical analogues elsewhere? (G2 8)'), ('R', 'χ_ω is the translation character; ker χ_ω = (2π/|ω|)ℤ, ℝ/ker ≅ S¹ (A8Fa); tori and cylinders refine it (Act VIII)'),
   ('Q', 'Do these relationships tell us something about nature, or only about our mathematical descriptions of it? (MM, after #18)'), ('R', 'relativity: observers change, ΛᵀηΛ = η stays (L1); the boost parameter is the rapidity, tanh φ = v/c (A8Eb, A8Wa) — the comparison with the circle is θ ↔ φ'),
   ('Q', 'In "the speed of light … converges to infinity," what is going to infinity? (G2 3)'), ('R', 'c → ∞ is a family limit: M_c → diag(1, 0), Lorentz → Galilean at fixed v, a contraction (L3, A8Mc, A8Lb, A8Lc); c\'s three roles stay distinct'),
   ('Q', 'That transition between the two roles is what interests me. (T-C-ROLES)'), ('R', 'OPEN (H3-1; restricted: the bare congruence class of M_c does not distinguish finite values of c, A8Wc)')]),
 'E': dict(name='Energy stays downstream', steps=[
   ('Q', 'what if the signal measured electrical power instead of sound? (MM #2)'), ('R', 'the same function, different physical meaning (OB1)'),
   ('Q', 'What does mathematical energy actually measure? (MM, after #11)'), ('R', 'L² magnitude ≠ physical energy unless a physical model identifies them (A3, ON9)'),
   ('Q', 'Can energy behavior be represented in a space where hidden balances, null relations, and invariants become geometrically explicit? (RD)'), ('R', 'parked: ThermaLens / Energeo is downstream testing, never upstream evidence (A1, A2; G2 9)')]),
 'T': dict(name='Translation invariance', steps=[
   ('Q', 'What remains unchanged when the pattern shifts? (MM, after #3)'), ('R', 'T_τ; invariance means T_τx = x; autocorrelation; the symmetry defect D_x(τ) (T1, T2, T3)'),
   ('Q', 'how much does a small shift change the signal, and where does it show in the spectrum? (D9)'), ('R', 'D_x(τ) from the power spectrum (Wiener–Khinchin, T3); spectral second moment and localization (T4, T5)'),
   ('Q', 'what does translation do to a Fourier mode? (MM #12)'), ('R', 'translation becomes phase: T_τe_k = e^(−2πikτ)e_k (R4); the phase is the character χ (A8F) — the circle of #18')]),
}

# ── C. Current-repository alignment: every Foundation domain ──────────────────────────────────────────
# (domain, predecessor node, relation contributed, next node fed, verdict, actions)
ALIGN = [
 ('D1', 'all (the spine summarizes M1–M20)', 'the two-map system', '—', 'correct placement; missing the Master Story level', ['KEEP', 'ADD CONNECTIVE SENTENCE']),
 ('D2', 'method rules (no story node)', 'statuses, provenance, bridge strengths', '—', 'supporting only', ['KEEP']),
 ('D3', 'M5, M6', 'f = Σ f̂(k)e_k; translation → phase', 'M7, M8, M12', 'correct content; the ontology lists the orthonormal basis (R1) first — story order is coefficient → zero → orthogonality', ['KEEP', 'ADD CONNECTIVE SENTENCE']),
 ('D4', 'M7 (the zero coefficient)', '⟨e_j, e_k⟩ = δ_jk; projection; Pythagoras', 'M9, M11', 'correct', ['KEEP']),
 ('D5', 'M13, M14 (Chain A)', 'A†MA = M; zero relations kept; generators; conservation', 'M15, M18, M19', 'missing connective: A†MA = M appears without the |x| → |x|² → M questions', ['KEEP', 'ADD CONNECTIVE SENTENCE']),
 ('D6', 'M14 + "relationship ridden" (G2 5)', 'the common-form hypothesis', 'cross-system tests', 'correct', ['KEEP']),
 ('D28', 'M5 ("different objects, or different descriptions?")', 'covariance / invariance / equivariance', 'what survives (RI0)', 'correct', ['KEEP', 'ADD DIAGRAM EDGE']),
 ('D29', 'D28 (later Nadia question)', '—', '—', 'open, correctly placed', ['KEEP']),
 ('D30', 'M12, M16', 'what survives a map', 'possibility → manifestation', 'correct', ['KEEP']),
 ('D31', 'M12 / Act VI (DYADIC PACKETS, Nadia\'s term)', '—', '—', 'open, correctly placed', ['KEEP']),
 ('D27', 'M14', 'coordinate-free F*T = T', '—', 'supporting only', ['KEEP']),
 ('D7', 'M13', 'the zero taxonomy', 'Chain Z questions', 'correct; the zero-frequency component named at #13 has no row', ['KEEP', 'ADD CONNECTIVE SENTENCE']),
 ('D8', 'Chain Z (RD zero questions)', 'zero as connector; the inverse problem', 'Pair A, R4 construction', 'correct', ['KEEP']),
 ('D9', 'M3, M4 ("What remains unchanged when the pattern shifts?")', 'translation → correlation → symmetry defect → spectrum', 'M12 (translation ↔ phase), M18 (χ_ω)', 'missing diagram edges to its predecessor and successor', ['KEEP', 'ADD DIAGRAM EDGE']),
 ('D10', 'M19', 'ΛᵀηΛ = η; rapidity; c → ∞', 'M20, H3-1', 'correct', ['KEEP']),
 ('D11', 'M18, M10', 'known continuation behaviours', 'M18 (Act VIII)', 'correct', ['KEEP']),
 ('D12', 'M14 → M15 (distance on a model manifold)', 'Fisher metric, geodesics, null directions', 'M16, M19 (c → ∞)', 'missing connective: why model manifolds entered (distance), not C7', ['KEEP', 'ADD CONNECTIVE SENTENCE']),
 ('D13', 'M15 + M7/M11 (coefficients)', 'C7 as first posed', '—', 'correctly placed inside M15 (a later question)', ['KEEP']),
 ('D34', 'D13', 'C7-R enclosure', '—', 'correct (locked)', ['KEEP']),
 ('D35', 'D13', 'C7 negative results', '—', 'correct (locked)', ['KEEP']),
 ('D36', 'D13', 'C7-F(inv)', '—', 'open, correctly placed', ['KEEP']),
 ('D37', 'M18 (G2 6, 8), M3', 'circle quotient, torus, cylinder, distinction table, counterexamples', 'M19; T-GEN-DYN-Q', 'correct content; missing the historical question as its lead', ['KEEP', 'ADD CONNECTIVE SENTENCE']),
 ('D38', 'H3, ★ (M18; Pair B)', 'readings and candidate formalizations', 'T-GEN-DYN-Q', 'correct; ★\'s refinement must read as refinement of the original question', ['KEEP', 'ADD CONNECTIVE SENTENCE']),
 ('D40', 'M14 → M18 / M19', 'CF4 re-carded; rotation / boost re-carded; the Fourier character connecting R4 and R6; kernel vs orbit closure; κ-family', 'M18, M19', 'misplaced label: titled as "Act VIII story integration" that places Act VIII in the spine; it is connecting / supporting mathematics, and its theorems re-card CF4 and the S4 trichotomy', ['RECLASSIFY', 'SUPERSEDE WORDING', 'PARK AS OPTIONAL']),
 ('D39', 'M19 + M15 (G2 3)', 'c-indexed forms; Galilean limit; t ≠ c', 'H3-1', 'correct; add the M15 → M19 edge', ['KEEP', 'ADD DIAGRAM EDGE']),
 ('D32', 'M16', 'the model-manifold research story', 'possibility → manifestation (open)', 'correct', ['KEEP']),
 ('D33', 'M15', 'model-manifold invariance', '—', 'supporting only', ['KEEP']),
 ('D14', 'M12 / Act VI (information lost and recovered)', 'wavelets, modulus, scattering', 'D15', 'correct', ['KEEP']),
 ('D15', 'Act VI', 'DYADIC PACKETS (open)', '—', 'open, correctly placed', ['KEEP']),
 ('D16', 'M16', 'reduced representations (examples)', 'H6', 'correct', ['KEEP']),
 ('D17', 'M9 → Act III', 'R4 tetrahedral / simplex constructions', 'Chain Z inverse question', 'correct; add the M9 → Act III edge', ['KEEP', 'ADD DIAGRAM EDGE']),
 ('D18', 'Chain Z (Act I stage 2: the proton zero)', 'quantum same-zero', 'Pair A', 'correct', ['KEEP']),
 ('D19', 'Pair A', 'cross-domain transfer', '—', 'correct; the Pair A origin question has no record', ['KEEP', 'ADD CONNECTIVE SENTENCE']),
 ('D20', 'M12, M17', 'conjugate pairs; mass-wave ingredients', 'mass-wave (parked)', 'correct; add the M12 → M17 edge', ['KEEP', 'ADD DIAGRAM EDGE']),
 ('D21', 'M17, M18, M19 (user hypotheses)', '—', '—', 'open, correctly placed', ['KEEP']),
 ('D22', 'M16', 'the effective-representation question', '—', 'open, correctly placed', ['KEEP']),
 ('D23', 'M17, M19 (philosophical lenses)', '—', '—', 'open, correctly placed', ['KEEP']),
 ('D24', 'every failed reading', 'failures and boundaries', 'the next question each failure forced', 'correct', ['KEEP']),
 ('D25', 'M20', 'application (downstream)', '—', 'correct', ['KEEP']),
 ('D26', 'M2, M11', 'physical energy vs L² magnitude', 'M20', 'correct; add the M11 → M20 edge', ['KEEP', 'ADD DIAGRAM EDGE']),
]

# ── D. Act VIII placement in the existing story ─────────────────────────────────────────────────────
ACT8 = [
 ('circle: |e^(iωt)| = 1, period, no limit, ℝ/Tℤ ≅ S¹, covering', 'A8C', 'A', 'M18: G2 6 and 8 (unbounded t, bounded S¹)', 'answers the question as Nadia restated it; the old "converge to infinity" wording is E (FAIL, kept)'),
 ('distinction table (parameter, lift, cycles, bounded, convergence, recurrence, periodicity, density, drift)', 'A8D', 'A', 'M18: "compare what happens to elapsed time, number of revolutions, sine and cosine values, cumulative quantities, and mathematical limits" (MM); G2 6 "two very different kinds of infinity"', 'answers'),
 ('torus: commensurability; dense irrational flow, never periodic; kernel vs orbit closure', 'A8T, A8KC', 'A', 'M3 ("try a nonperiodic sound", MM) and M18 (G2 8: "deeper analogues")', 'answers; also E for STAR-A'),
 ('cylinder: periodic projection, unbounded state', 'A8X2', 'A', 'M18: "extend the picture into a cylindrical geometry" (MM)', 'answers'),
 ('stabilizer / orbit framework', 'A8A', 'C', 'M3, M18 (periodicity is a nontrivial stabilizer)', 'supporting machinery'),
 ('★ readings STAR-A/B/C; STAR-A lesson', 'A8SA–A8SC, A8GD', 'E', 'Pair B / ★ (RD)', 'refines the ★ question; ★ kept verbatim and open'),
 ('H3 candidates (H3-action, H3-quotient)', 'A8HA, A8HQ', 'C', 'H3 (CP §1a)', 'formalizations; H3-original stays open'),
 ('rapidity: tanh φ = v/c; θ ↔ φ', 'A8Eb, A8Wa', 'A', 'M19 (which transformations change the observer)', 'answers; and E: corrects the literal t ↔ c analogy'),
 ('c-family M_c; restricted content of c', 'A8M, A8Wc', 'A', 'M19 and G2 3 (what goes to infinity)', 'answers'),
 ('c → ∞: degenerate form, Galilean boosts, contraction', 'A8L', 'B', 'M15 (the c → ∞ boundary of the model manifold, G2 3) → M19', 'connects'),
 ('SO(2) / SO(1,1)', 'A8E', 'B', 'M14 (preserved forms I, η) → M18 (rotation) and M19 (boost)', 'connects; re-cards the existing trichotomy (S4, B1b, B1c), adding only the 3D scope check'),
 ('generator theorem KᵀM + MK = 0 ⟺ e^(sK) preserves M', 'A8G', 'C', 'M14 → M18 / M19', 'supporting: the theorem is the existing CF4 (BR11), re-carded; only the step to orbit behaviour (BR81) is new. It explains part of the M18 question and does not replace it'),
 ('Fourier character χ_ω', 'A8F', 'B', 'M4 (translation) and M12 (translation ↔ phase, R4) → M18 (the circle)', 'connects existing nodes R4 and R6; no new theorem'),
 ('elliptic / parabolic / hyperbolic language', 'A8Ec', 'C', 'Part VII "Trichotomy: rotation / boost / shear by the sign of the invariant" (S4)', 'pre-existing vocabulary, supporting'),
 ('κ-family M_κ', 'A8Q', 'D', 'none required (see E)', 'optional later construction'),
 ('H3-c split (direct / group / family)', 'A8HCD, A8HG, A8HCF', 'E', 'H3 c-clause (CP §1a), G2 3', 'direct FAIL kept; group = the rotation/boost connection (B); family answers G2 3 (A)'),
 ('counterexamples X1–X6', 'A8X', 'E', 'M18, ★, G2 2 (X6: an index that converges vs a flow that does not), G2 3 (X5: scaling)', 'each refines a question'),
 ('boundary approach ≅ drift', 'A8Pg', 'B', 'C8 (wrapping / near return / boundary approach) and S5b (tanh bound) → M18', 'connects'),
 ('T-GEN-DYN-Q', 'A8G', 'E', 'created by STAR-A\'s failure', 'the next question of the ★ chain — a refinement of the original question'),
]

KAPPA = dict(
 verdict='PARK AS OPTIONAL (supporting note)',
 question='What pre-existing Nadia question does M_κ answer? None directly. Gate 2 answer 3 asks what goes to infinity for c (answered by A8M, A8L); Gate 2 answer 8 asks whether "an unbounded quantity expressed through a bounded geometry" has deeper analogues (answered by A8F, A8T, A8X2). Neither asks for a common family of the circle frequency and c.',
 nodes='It touches M14 (forms), M18 (circle) and M19 (c), but the M18–M19 connection the story needs is already supplied, more faithfully, by the rotation/boost comparison (A8E) and the rapidity correction (A8Wa).',
 origin='It is a later synthesis by Claude (2026-11-16): its circle is the harmonic oscillator in (p, q), not the Fourier circle of #6/#18, and its shared limit (ω → 0, c → ∞) depends on the scaling held fixed (A8Qb, A8X5).',
 action='Kept on the ledger (A8Qa, A8Qb) and in the record as an optional later construction; not a story node, not a bridge the story uses; no further κ-research. Not deleted for low support, not promoted for elegance.')

MISSING = [
 ('F1', 'M13 → M14 → CF1', 'the Chain A path |x| → |x|² → q_I → q_M → A†MA = M; Part III opens with the architecture "choose a relation → determine the transformations" instead', 'connective sentence at the top of Part III'),
 ('F2', 'M7 → M8', 'story order: f̂(k) = ⟨f, e_k⟩ → f̂(k) = 0 with f ≠ 0 → what does that zero mean → orthogonality; the ontology lists the orthonormal basis (R1) first', 'connective sentence in Part II'),
 ('F3', 'M14 → M15', 'why model manifolds entered: distance under a measuring rule → distance on a model / prediction manifold (Fisher metric as a position-dependent measuring rule); C7 is a later question inside this node', 'connective sentence before the Part IX model-manifold block'),
 ('F4', 'M3 / M4 → D9 → M12 → M18', 'the translation chain has no stated predecessor ("What remains unchanged when the pattern shifts?") or successor (translation → phase → the circle χ_ω)', 'diagram edges (this graph) and one sentence in Part VII'),
 ('F5', 'M12 → M17', 'conjugacy\'s question comes from the coefficient pairs, not from prediction space', 'diagram edge'),
 ('F6', 'M15 → M19', 'c → ∞ entered from the model-manifold discussion (G2 3)', 'diagram edge'),
 ('F7', 'M13 → Part IV', 'the zero-frequency component named at #13 has no row in the zero taxonomy', 'one taxonomy row (existing cards only)'),
 ('F8', 'Pair A', 'the question that created Pair A is not recorded; only the shared form and the bridge are', 'registry record T-PAIRA-Q and one sentence'),
 ('F9', 'M2 / M11 → M20', 'the energy question\'s predecessors are not stated in Part XIV', 'connective sentence in Part XIV'),
 ('F10', 'Pair B / ★ → T-GEN-DYN-Q', 'the Act VIII results must read as a refinement of the original question, with the original question first', 'connective sentence leading the Act VIII section in Part VII'),
]
MOVES = [
 ('master map Part I', 'add "Two levels: the Master Story and the Foundation Spine" (the 20 historical nodes and a pointer to this graph)', 'ADD CONNECTIVE SENTENCE'),
 ('master map Part II', 'F2 story order sentence', 'ADD CONNECTIVE SENTENCE'),
 ('master map Part III', 'F1 Chain A sentence before "The architecture"', 'ADD CONNECTIVE SENTENCE'),
 ('master map Part IV', 'F7 zero-frequency row; "same visible 0, different hidden relations"', 'ADD CONNECTIVE SENTENCE'),
 ('master map Part VII, Act VIII', 'F10 historical lead (G2 8; MM #18) before the first-construction bullets; F4 translation sentence', 'ADD CONNECTIVE SENTENCE'),
 ('master map Part VII, "Act VIII story integration" block', 'retitled as supporting mathematics for #14 → #18/#19; "places Act VIII in the spine" superseded; the generator theorem labelled as CF4 re-carded and SO(2)/SO(1,1) as the S4 trichotomy re-carded; the κ-family bullet parked', 'RECLASSIFY; SUPERSEDE WORDING; PARK AS OPTIONAL'),
 ('master map Part IX', 'F3 sentence before the model-manifold block', 'ADD CONNECTIVE SENTENCE'),
 ('master map Part XIV', 'F9 sentence', 'ADD CONNECTIVE SENTENCE'),
 ('Foundation D40', 'renamed "Supporting mathematics for #14 → #18/#19 (Act VIII)"; A8G, A8E, A8F roles state what they re-card; A8Q PARKED', 'RECLASSIFY; SUPERSEDE WORDING; PARK AS OPTIONAL'),
 ('Act VIII record', 'header "place Act VIII in the Foundation spine" and the story contribution "supplies the exact link" superseded; a canonical-placement table (categories A–E); κ-family PARKED', 'SUPERSEDE WORDING; RECLASSIFY; PARK AS OPTIONAL'),
 ('registry', 'T-PAIRA-Q (F8); placement boundaries on T-GEN-DYN-Q, T-GEOM-GEN-DYN, T-H3-GROUP, T-H3-C-FAMILY', 'ADD CONNECTIVE SENTENCE'),
]
ADD_DELETE = dict(
 connective=['Part I two levels', 'Part II Fourier story order (F2)', 'Part III Chain A (F1)', 'Part IV zero-frequency row and the same-zero sentence (F7)', 'Part VII Act VIII historical lead and translation sentence (F10, F4)', 'Part IX why model manifolds entered (F3)', 'Part XIV energy predecessors (F9)', 'T-PAIRA-Q (F8)'],
 edges=['M3/M4 → D9 → M12 → M18 (F4)', 'M12 → M17 (F5)', 'M15 → M19 (F6)', 'M11 → M20, M2 → M20', 'M6 → M18, M6 → M10', 'M7, M8 → M13', 'M9 → Act III → D17', 'M14 → M18, M14 → M19', 'M5 → D28'],
 move=['none required: the material is in the right Parts; only labels and lead sentences were wrong'],
 park=['κ-family M_κ (A8Q; BR85) → optional later construction / supporting note'],
 supersede=['"Act VIII story integration … places Act VIII in [the spine]" (master map, Act VIII record header)', '"Act VIII supplies the exact link from a preserved relation to continuation behaviour" (Act VIII record, story contribution)', 'D40 name "Preserved geometry → generator → dynamics (Act VIII story integration)"', 'A8Q role "exact place of c beside the circle frequency"'],
 delete=['no deletion: the duplicate theorems (A8G = CF4; A8E = the S4/B1 trichotomy) are relabelled as re-cardings, because their cards are on the append-only ledger'])

# ── I. Story continuity check: does each answer explain why the next question was asked? ──────────────
CONTINUITY = [
 ('M1 → M2', 'yes', 'a signal is a function; then: what does the function measure?'),
 ('M2 → M3', 'yes', 'with a function on screen, its repeating pattern is the first structure to find'),
 ('M3 → M4', 'yes', 'MM: "After discovering periodicity: What remains unchanged when the pattern shifts?"'),
 ('M4 → M5', 'yes', 'MM: "After discovering symmetry: Could the same pattern have another representation?"'),
 ('M5 → M6', 'yes', 'MM: "This prepares the visitor for Fourier analysis."'),
 ('M6 → M7', 'yes', 'MM: "After Fourier reconstruction: Why can these components be separated?"'),
 ('M7 → M8', 'yes, once F2 is stated', 'the zero coefficient (f ≠ 0) creates the question that orthogonality answers'),
 ('M8 → M9', 'yes', 'MM: "After orthogonality: What does perpendicular mean beyond three dimensions?"'),
 ('M9 → M10', 'partly — repaired by the edge M6 → M10', '#10 returns to the Fourier reconstruction and to G2 2 (convergence as a limiting process), not to #9'),
 ('M10 → M11', 'yes', 'mean-square closeness is measured by the squared norm: where did the magnitude go?'),
 ('M11 → M12', 'yes', 'MM #12: "If mathematical energy is preserved, what other information distinguishes two representations?"'),
 ('M12 → M13', 'partly — repaired by the edges M7, M8 → M13', '#13 gathers the zeros met at #7, #8 and #6 (zero frequency); the Stage III shift is "to the rules by which mathematical objects are measured"'),
 ('M13 → M14', 'yes', 'MM: "your earlier questions about the relationship between the origin, norm, squared norm, zero, and the identity matrix"'),
 ('M14 → M15', 'yes, once F3 is stated', 'a measuring rule M → distance between predictions (Fisher metric as a position-dependent rule)'),
 ('M15 → M16', 'yes', 'more measured outputs → more coordinates: what exists beyond the visible model?'),
 ('M16 → M17', 'no — repaired by the edge M12 → M17', '#17 begins from a complex coefficient and its conjugate; its question is created by #7/#12'),
 ('M17 → M18', 'no — repaired by the edges M15 → M18 and M6 → M18', 'MM: "After information geometry: Could a similar geometric representation help describe time?"; the rotating point is carried from #6'),
 ('M18 → M19', 'yes', 'MM: "After your time investigation: Do these relationships tell us something about nature, or only about our mathematical descriptions of it?"; c enters from M15 (G2 3)'),
 ('M19 → M20', 'yes', 'MM: "After the philosophical exploration: Can these mathematical ideas improve how we model finite physical resources?"'),
 ('Chain A: |x|² → M ≠ I → A†MA = M', 'yes, once F1 is stated', 'each relation creates the next question'),
 ('Pair B / ★ → STAR-A FAIL → T-GEN-DYN-Q', 'yes', 'the failure ("geometry alone does not force exact periodicity") forces the question of what else bears on the continuation'),
 ('M15 → C7', 'yes', 'C7 is a later question inside M15, not the reason M15 exists'),
 ('M18 → M19 via c', 'yes', 'G2 3: c → ∞ came from the model-manifold discussion; the circle comparison is θ ↔ φ, not t ↔ c'),
]
LOCK = dict(choice='READY FOR ACT VIII ADVERSARIAL LOCK AFTER STORY ALIGNMENT',
 why='Every transition is either explained by the previous relation or repaired by a predecessor edge from the historical record; the Act VIII results are placed under M18/M19 (and connect M14, M4/M12) without replacing the circle / periodicity / infinity question; the κ-family is parked; the missing connectives F1–F10 are added in this pass. No gap remains that needs new mathematics.',
 limits='The four named conversations could not be opened; the Chain A questions rest on Nadia\'s 2026-11-16 recollection. The lock should check that every live Act VIII statement leads with its historical question.')

data = dict(about='Canonical story diagnostic (2026-11-16). Generated by research/tools/canonical_story_source.py. A diagnostic artifact, not a replacement architecture.',
            provenance=PROVENANCE, spine=SPINE, actions=ACTIONS, categories=CATEGORIES, master=MASTER, mmTransitions=[dict(src=a, dst=b, text=c) for a, b, c in MM_TRANSITIONS],
            extraEdges=[dict(src=a, dst=b, why=c) for a, b, c in EXTRA_EDGES], chains={k: dict(name=v['name'], steps=[dict(kind=a, text=b) for a, b in v['steps']]) for k, v in CHAINS.items()},
            alignment=[dict(domain=a, predecessor=b, relation=c, next=d, verdict=e, actions=f) for a, b, c, d, e, f in ALIGN],
            act8=[dict(item=a, objects=b, category=c, question=d, note=e) for a, b, c, d, e in ACT8], kappa=KAPPA,
            missing=[dict(id=a, between=b, what=c, repair=d) for a, b, c, d in MISSING], moves=[dict(where=a, change=b, action=c) for a, b, c in MOVES], addDelete=ADD_DELETE,
            continuity=[dict(transition=a, verdict=b, why=c) for a, b, c in CONTINUITY], lock=LOCK)
(ROOT / 'research/canonical_story.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')

# ── render ─────────────────────────────────────────────────────────────────────────────────────────
cell = lambda x: '—' if x in (None, '', []) else str(x).replace('|', '\\|')
mlab = lambda s: s.replace('"', "'").replace('|', '‖').replace(';', ',').replace('#', 'no. ')
L = ['# Canonical story: question → relation → next question', '',
     'Generated from `research/tools/canonical_story_source.py` (`research/canonical_story.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Canonical story diagnostic".', '',
     '**This is a diagnostic artifact, not a replacement architecture.** Two levels are kept: the **Master Story** (the actual question-by-question journey, `docs/Interactive_Master_Map.extracted.md`) and the **Foundation Spine** (the abstract categories those questions revealed, `research/master_math_map.md` Part I). ' + PROVENANCE['rule'], '',
     f'Sources used: ' + '; '.join(PROVENANCE['used']) + '.', '', f'*Not available:* {PROVENANCE["notAvailable"]}', '',
     '## A. The Master Story (historical order; titles verbatim from the Master Map)', '', '| # | Node | Question | Relation that answered it | Next question it created | Spine | Where it lives now |', '|---|---|---|---|---|---|---|']
L += [f'| M{m["n"]} | {cell(m["title"])} | {cell(m["q"])} | {cell(m["rel"])} | {cell(m["nxt"])} | {", ".join(m["spine"])} | {cell(m["repo"])} |' for m in MASTER]
L += ['', 'The Master Map\'s own next questions (verbatim):', ''] + [f'- M{a} → M{b}: "{c}"' for a, b, c in MM_TRANSITIONS]
L += ['', '### Overview graph', '', 'Solid arrows: the Master Map\'s numbered order. Dotted arrows: where a question actually came from (predecessor edges from the historical record).', '', '```mermaid', 'flowchart TD']
L += [f'  M{m["n"]}["{m["n"]}. {mlab(m["title"].split(" — ")[0])}"]' for m in MASTER]
L += [f'  M{i} --> M{i + 1}' for i in range(1, 20)] + [f'  {a} -.-> {b}' for a, b, _ in EXTRA_EDGES] + ['```', '', '| Predecessor edge | Why |', '|---|---|'] + [f'| {a} → {b} | {cell(c)} |' for a, b, c in EXTRA_EDGES]
L += ['', '## B. Relation graph, chain by chain', '', 'Q = a question node; R = the mathematical relation that answered or sharpened it. Each Q after the first is the next question created by the R before it.']
for k, ch in CHAINS.items():
    L += ['', f'### Chain {k}: {ch["name"]}', '', '```mermaid', 'flowchart TD']
    for i, (kind, text) in enumerate(ch['steps']):
        node = f'{k}{i}'
        L.append(f'  {node}["{kind}: {mlab(text)}"]' if kind == 'Q' else f'  {node}("{kind}: {mlab(text)}")')
        if i: L.append(f'  {k}{i - 1} --> {node}')
    L += ['```']
L += ['', '## C. Current-repository alignment (every Foundation domain)', '', f'Actions used: {"; ".join(ACTIONS)}.', '', '| Domain | Canonical predecessor | Relation it contributes | Next question it feeds | Verdict | Actions |', '|---|---|---|---|---|---|']
L += [f'| {a} | {cell(b)} | {cell(c)} | {cell(d)} | {cell(e)} | {"; ".join(f)} |' for a, b, c, d, e, f in ALIGN]
L += ['', '## D. Act VIII placement in the existing story', '', 'Categories: ' + '; '.join(f'{k} = {v}' for k, v in CATEGORIES.items()) + '. Act VIII refines and connects the M18 / M19 questions; it is not a replacement story, and "preserved form → generator → dynamics" explains part of the M18 question without replacing it.', '',
      '| Result | Objects | Category | Historical question it serves | Note |', '|---|---|---|---|---|'] + [f'| {cell(a)} | {b} | {c} | {cell(d)} | {cell(e)} |' for a, b, c, d, e in ACT8]
L += ['', '## E. κ-family diagnostic', '', f'**Verdict: {KAPPA["verdict"]}.**', '', f'- {KAPPA["question"]}', f'- {KAPPA["nodes"]}', f'- {KAPPA["origin"]}', f'- {KAPPA["action"]}',
      '', '## F. Missing connectors (between existing story nodes only)', '', '| ID | Between | What is missing | Repair |', '|---|---|---|---|'] + [f'| {a} | {b} | {cell(c)} | {cell(d)} |' for a, b, c, d in MISSING]
L += ['', '## G. Reordering / categorization changes made in this pass', '', '| Where | Change | Action |', '|---|---|---|'] + [f'| {a} | {cell(b)} | {c} |' for a, b, c in MOVES]
L += ['', '## H. Add / delete diagnostic', ''] + [f'- **{k}:** ' + '; '.join(v) + '.' for k, v in [('Add connective wording', ADD_DELETE['connective']), ('Add diagram edges', ADD_DELETE['edges']), ('Move', ADD_DELETE['move']), ('Park', ADD_DELETE['park']), ('Supersede', ADD_DELETE['supersede']), ('Delete', ADD_DELETE['delete'])]]
L += ['', '## I. Story continuity check', '', '| Transition | Does the previous answer explain the next question? | Why |', '|---|---|---|'] + [f'| {a} | {b} | {cell(c)} |' for a, b, c in CONTINUITY]
L += ['', '## J. Lock recommendation', '', f'**{LOCK["choice"]}**', '', LOCK['why'], '', f'Limits: {LOCK["limits"]}']
(ROOT / 'research/canonical_story.md').write_text('\n'.join(L) + '\n')
print(f'{len(MASTER)} master nodes; {len(CHAINS)} chains; {len(ALIGN)} domains aligned; {len(ACT8)} Act VIII items; lock: {LOCK["choice"]}')
