"""Model-manifold invariance + research-story audit (2026-11-13).
Writes research/model_manifold.json and renders research/model_manifold_story.md and research/model_manifold_invariance.md.
Decisions: docs/restructure_decisions.md, "Model-manifold invariance + research-story audit". Cards: verify/verify_MMI.py.
Governing rule (T-MM-GOV): "Do not audit away the research story. Audit the status of each connection."
This file classifies; it does not begin the C7 derivation, a quantum derivation, H3, mass-wave or Energeo.
test/model_manifold.test.js checks every card, registry id, status and verdict.
Run: python3 research/tools/model_manifold_source.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]

STORY_STATUSES = ['ESTABLISHED MATHEMATICS', 'PAPER-BACKED RESULT', 'PROJECT-DERIVED CONNECTION', 'PROJECT HYPOTHESIS', 'OPEN CONNECTION',
                  'PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS', 'FAILED / NEGATIVE RESULT']
EM, PB, PDC, PH, OC, PQ, NEG = STORY_STATUSES
C_VERDICTS = ['STRUCTURAL CONNECTION', 'USEFUL ANALOGY', 'TOO WEAK', 'FAIL']
NOVELTY = ['KNOWN MODEL-MANIFOLD / INFORMATION GEOMETRY', 'PROJECT SYNTHESIS', 'OPEN PHYSICAL / QUANTUM-LIKE INTERPRETATION']
SEP = ['parameter space ≠ prediction space', 'prediction space ≠ physical spacetime', 'model manifold ≠ quantum state space']

# ── the story, arrow by arrow (both chains as Nadia gave them) ───────────────────────────────────
CHAINS = [
 dict(id='CHAIN-1', words='larger prediction / possibility space → rules constrain an allowable manifold → representations expose different aspects of it → observation / reduction may expose an accessible manifestation → ask what geometry and information survive',
      registry='T-MM-STORY', arrows=[
   dict(frm='larger prediction / possibility space', to='rules constrain an allowable manifold', status=EM, also=PDC,
        exact='M = Y(Θ) ⊆ P: the model rule Y and the parameter domain Θ fix the realizable set M inside the prediction space P (finite ℝᵐ, or a function space, MMIh)',
        cards=['MMIh', 'MMIg', 'FB11c'], note='the definition is established; reading Y and Θ as the "rules" is the project connection (T-MM-RULES), exact in this definitional sense'),
   dict(frm='rules constrain an allowable manifold', to='representations expose different aspects of it', status=PDC, also=None,
        exact='charts (R1: g_φ = Jᵀ g J), prediction-space metrics (Σ) and embeddings: components, eigenvalues and singular values change; rank, nullity, lengths, volume element, curvature, widths and the boundary set do not change under charts',
        cards=['MMIa', 'MMIb', 'MMIc', 'MMId', 'MMIe', 'MMIf'], note='which aspect is exposed depends on the representation; what is geometric is what survives every chart'),
   dict(frm='representations expose different aspects of it', to='observation / reduction may expose an accessible manifestation', status=OC, also=None,
        exact='exact only for named maps: a boundary limit (a family degeneration, MMIg, paper-backed), a projection (RIC1a), quantum non-selective measurement ρ ↦ Σₖ PₖρPₖ (W2a, established quantum mechanics)',
        cards=['MMIg', 'RIC1a', 'W2a'], note='no single construction of "observation" covers these; the general arrow stays OPEN (T-MM-OBSERVE)'),
   dict(frm='observation / reduction may expose an accessible manifestation', to='ask what geometry and information survive', status=PDC, also=OC,
        exact='the seven Reduction / Information-Changing questions per map (survives, collapses, zero, lost, reconstructible, fibers, symmetry)',
        cards=['RIC1a', 'W2a', 'MMIg'], note='answered per map; no general law of what survives (OPEN)'),
 ]),
 dict(id='CHAIN-2', words='possibility / prediction space → rules constrain an allowable manifold → geometry organizes distinguishability → observation/reduction exposes an accessible manifestation → ask what survives, disappears, or becomes observable',
      registry='T-MM-STORY', arrows=[
   dict(frm='possibility / prediction space', to='rules constrain an allowable manifold', status=EM, also=PDC, exact='M = Y(Θ) ⊆ P', cards=['MMIh'], note='as in chain 1'),
   dict(frm='rules constrain an allowable manifold', to='geometry organizes distinguishability', status=EM, also=PB,
        exact='locally: the Fisher length √(dθᵀ g dθ) is the prediction-space distance per unit noise (MMId) and g(v, v) = 0 ⟺ Jv = 0 marks first-order indistinguishable directions (FB7b); globally: hyperribbon widths (TMS 2011; Quinn et al. 2019)',
        cards=['MMId', 'FB7b', 'MMIf'], note='local statement ESTABLISHED MATHEMATICS; the global width hierarchy PAPER-BACKED RESULT'),
   dict(frm='geometry organizes distinguishability', to='observation/reduction exposes an accessible manifestation', status=OC, also=None, exact='as in chain 1, arrow 3', cards=['W2a', 'MMIg'], note='OPEN in general'),
   dict(frm='observation/reduction exposes an accessible manifestation', to='ask what survives, disappears, or becomes observable', status=PDC, also=OC,
        exact='per map: survives / is lost (IC questions); "becomes observable": after non-selective S² measurement the S² outcomes are defined while the sector coherence is gone (W2b)',
        cards=['W2b', 'RIC1a'], note='"becomes observable" is exact for the quantum instance only'),
 ]),
]
VIEWER = dict(words='matter does not form until a viewer looks at it.', registry='T-VIEWER-FORM', status=PQ,
              normalized='What changes when a richer state/representation becomes an observable manifestation?',
              labels=['ORIGINAL USER INTUITION', 'PHILOSOPHICAL / QUANTUM-INTERPRETIVE', 'NOT ESTABLISHED PHYSICS', 'ORIGINAL VERBATIM NOT RECOVERED (recorded as given, 2026-11-13, "approximately")'],
              conscious='conscious observer requirement = NOT ESTABLISHED',
              investigable='which maps from a richer state to an observable manifestation exist, and what each keeps, removes or makes available (T-MM-OBSERVE; exact instances W2a, W2b, RIC1a, MMIg)')

COLS = ['Idea', 'Exact mathematical object', 'Established / paper result', 'Project connection', 'Project hypothesis', 'Quantum-like / philosophical extension', 'What would falsify / weaken', 'Status']
ROWS = []
def row(key, idea, obj, est, conn, hyp, ext, fals, status, *, cards=(), registry=(), sources=()):
    assert status in STORY_STATUSES, key
    ROWS.append(dict(key=key, idea=idea, object=obj, established=est, connection=conn, hypothesis=hyp, extension=ext, falsify=fals, status=status,
                     cards=list(cards), registry=list(registry), sources=list(sources)))
row('prediction-space', 'Prediction space', 'P = ℝᵐ for m outputs with metric Σ⁻¹; for a continuously indexed output with a stated inner product, a function space (L²). Not the parameter space Θ.',
    'TMS 2010/2011 (data space); finite metric in function space: g_ij = 2/(θᵢ + θⱼ)³ (MMIh)', '"infinite prediction space" is exact as a function space (T-PREDICTION-INFINITE)',
    'the larger space carries structure that one projection does not show (Interactive Master Map, Stage IV)', 'not a quantum state space; not physical spacetime', 'none for the definition; the infinite reading needs a stated inner product',
    EM, cards=['MMIh'], registry=['T-PREDICTION-INFINITE'], sources=['SRC-TMS-2011'])
row('model-manifold', 'Model manifold', 'M = Y(Θ) ⊆ P; dimension = rank J where J has constant rank; induced metric g = JᵀΣ⁻¹J', 'TMS 2010/2011; Quinn et al. 2023 (review)',
    '"allowable manifold": the set of predictions the rules permit', 'rules constrain a geometry of allowed states (T-RULES-GEOMETRY, open)', '—', 'none for the definition',
    EM, cards=['MMIg', 'MMIh'], registry=['T-INFOGEO', 'T-MM-STORY'], sources=['SRC-TMS-2010', 'SRC-TMS-2011', 'SRC-QUINN-2023'])
row('parameters-rules', 'Parameters vs model rule vs image', 'model rule Y (functional form); parameter domain Θ; parameter values θ (coordinates on M); image M = Y(Θ). A reparametrization is a chart change (R1); M is unchanged',
    'parametrizations are charts (Lee 2018; Amari 2016)', '"the rules of the manifold were the model parameters." Unpacked: Y and Θ fix M; θ is a point coordinate; the domain\'s limits are M\'s boundaries (T-MM-RULES, DERIVED)',
    'governing rules play a broader role in allowable geometry (T-MM-RULES-Q)', '—', 'a feature of M that depends on the chart would contradict the unpacking (none: MMIa, MMIf)',
    PDC, cards=['MMIa', 'MMIf', 'MMIg'], registry=['T-MM-RULES', 'T-MM-RULES-Q'], sources=['SRC-LEE-2018', 'SRC-AMARI-2016'])
row('fisher-metric', 'Fisher metric', 'g = JᵀΣ⁻¹J, a symmetric (0,2)-tensor on Θ: the pullback of the prediction-space metric. Components transform g_φ = Jᵀ g J (R1); an isometry F*g = g (R2) exists only when the system supplies it',
    'Rao 1945; Amari 2016; FB6a/FB6b; CFT4c (R1 checked)', 'placed in the Transformation Architecture: reparametrizations R1, isometries R2 (TA0)', '—', '—',
    'a reparametrization reported as "g unchanged" (false for components)', EM, cards=['FB6a', 'FB6b', 'CFT4c', 'MMIa'], registry=['T-INFOGEO'], sources=['SRC-RAO-1945', 'SRC-AMARI-2016'])
row('null-directions', 'Null directions', 'g(v, v) = 0 ⟺ Jv = 0 ⟺ gv = 0 (g = JᵀΣ⁻¹J, Σ SPD). Kept apart: sloppy (λ small, nonzero), Lorentz null (vᵀηv = 0, ηv ≠ 0), bilinear null (B(u, v) = 0, u, v ≠ 0), collapsed zero (Φ(x) = 0, x ≠ 0)',
    'FB7a–FB7d; Amari 2016 (singular regions)', '"a zero geometric length can expose hidden non-identifiability / redundancy." (T-ZERO-LENGTH, DERIVED); survives charts (CFT5d) and noise models (MMIe)',
    '—', 'observable zero does not uniquely specify underlying state (T-QUANTUM-ZERO): a STRUCTURAL ANALOGUE, no map given', 'a zero-length direction along which predictions change (impossible for SPD Σ)',
    EM, cards=['FB7a', 'FB7b', 'FB7c', 'FB7d', 'CFT5d', 'MMIe'], registry=['T-ZERO-LENGTH'], sources=['SRC-AMARI-2016'])
row('sloppy-directions', 'Sloppy directions', 'small nonzero eigenvalues of g in a stated chart; the raw spectrum is chart-dependent (MMIb, CFT5e). Invariant versions: widths (row hyperribbon-widths) or generalized eigenvalues of g relative to a system-supplied tensor h',
    'Gutenkunst et al. 2007; TMS 2010; S14b (weak); S14a FAIL kept', 'M1 restated: the spectrum is a statement in log-parameter coordinates', '—', '—',
    'already weakened: raw eigenvalues are not geometric invariants (NEGATIVE result for any raw-spectrum comparison)', NEG, cards=['MMIb', 'CFT5e', 'S14b', 'S14a'], registry=['T-INFOGEO', 'T-C7'], sources=['SRC-GUTENKUNST-2007', 'SRC-TMS-2010'])
row('hyperribbon-widths', 'Hyperribbon widths', 'cross-sectional extents of the image set M in (P, Σ⁻¹), measured along geodesics (TMS 2011); bounded by a hyperellipsoid whose widths decay geometrically for analytic models (Chebyshev, Quinn et al. 2019). Parametrization-independent, metric-dependent (MMIf)',
    'TMS 2011; Quinn, Wilber, Townsend, Sethna 2019', 'the recommended C7 target object (T-C7 gate)', 'C7: a structural relation between coefficient decay and model-manifold geometry (T-C7, OPEN)', '—',
    'a width definition that changes with the chart (would contradict MMIf); the C7 residue reducing to Quinn 2019 (then VALIDATION OF KNOWN MATHEMATICS)', PB, cards=['MMIf'], registry=['T-C7', 'T-INFOGEO'], sources=['SRC-TMS-2011', 'SRC-QUINN-2019'])
row('manifold-boundaries', 'Manifold boundaries', 'limits Y(θ) as θ → ∂Θ: lower-dimensional faces of M; the limit set is chart-independent, the approach rate is not; the dimension drops (rank 2 → 1, MMIg)',
    'Transtrum–Qiu 2014; FB11c; MMIg', 'simpler structure as a boundary of a richer model (T-SIMPLER-BOUNDARY-Q)', '—', '—', 'a boundary that depends on the chart (none: MMIg)',
    PB, cards=['MMIg', 'FB11c'], registry=['T-SIMPLER-BOUNDARY-Q'], sources=['SRC-TRANSTRUM-QIU-2014'])
row('effective-models', 'Effective models', 'the boundary model (e.g. e^{−θ₁t}); MBAM reaches it along a geodesic. In the Reduction architecture a limit is a degeneration of the family, not a map Φ: X → Y on states',
    'Transtrum–Qiu 2014 (MBAM, source-only); Machta et al. 2013', 'H6 / T-EFFECTIVE-Q examples; what survives: θ₁ (FB11c)', 'effective representations follow a general law (H6, OPEN)', '—',
    'an effective model not reachable as any boundary (would bound the reading; MBAM source-only)', PB, cards=['FB11c', 'MMIg'], registry=['T-EFFECTIVE-Q', 'T-SIMPLER-BOUNDARY-Q'], sources=['SRC-TRANSTRUM-QIU-2014', 'SRC-MACHTA-2013'])
row('larger-possibility-space', 'Larger possibility space', 'P ⊋ M (the ambient contains predictions no parameter value reaches); a source X → reduced Y (Φ)', 'the strict inclusion is definitional; MMIh (P infinite-dimensional, M 2-dimensional)',
    '"A mathematical space can contain more structure than a single visible projection reveals." (Stage IV carry-forward)', 'the larger possibility space is the right frame for the project (T-MM-STORY)', 'quantum-like possibility space (row quantum-like)',
    'a system where the ambient adds nothing beyond M (would weaken the frame there)', PH, cards=['MMIh'], registry=['T-MM-STORY', 'T-PREDICTION-INFINITE'])
row('observation-manifestation', 'Observation / manifestation', 'a named information-changing map Φ: X → Y; quantum: ρ ↦ Σₖ PₖρPₖ (non-selective measurement)', 'W2a (established quantum mechanics); RIC1a (projection)',
    'observation as a map to a restricted manifestation (T-MM-OBSERVE, OPEN)', '—', '"matter does not form until a viewer looks at it." (T-VIEWER-FORM: ORIGINAL USER INTUITION, NOT ESTABLISHED PHYSICS); conscious observer requirement = NOT ESTABLISHED',
    'a measurement whose effect is not representable as such a map (none known); for the viewer intuition: physical theory or data, not a construction', OC, cards=['W2a', 'W2b', 'RIC1a'], registry=['T-MM-OBSERVE', 'T-VIEWER-FORM'], sources=['SRC-NIELSEN-CHUANG-2010'])
row('c-governing-rules', 'Connection to c / governing rules', 'η_c = diag(1, −1/c²) = Pᵀ diag(1, −1) P, P = diag(1, 1/c); c → ∞: diag(1, 0), rank 1 (C9b, MMIi). Model: θ₂ → ∞, rank 2 → 1 (MMIg)',
    'C9b; Quinn et al. 2023 treat c as a model parameter whose c → ∞ boundary gives Newtonian kinematics (snippet-confirmed, PDF pending)', 'verdict: STRUCTURAL CONNECTION for the parameter-limit → degenerate-boundary role only (T-RULES-GEOMETRY)',
    'rules constrain a geometry of allowed states (T-RULES-GEOMETRY, open); the two roles of c (T-C-ROLES)', '—', 'the invariant-form role does not transfer (FAIL): c is a structure constant up to units, θ is a coordinate; the Lorentz allowed set is one orbit, M is not homogeneous (CFT5f)',
    PDC, cards=['MMIi', 'C9b', 'MMIg', 'CFT5f'], registry=['T-RULES-GEOMETRY', 'T-C-ROLES', 'T-MM-DISTINGUISHED-Q'], sources=['SRC-QUINN-2023', 'SRC-INONU-WIGNER-1953'])
row('quantum-like', 'Quantum-like possibility space', 'a state space (density matrices on ℂ⁴ for two spins) and an observable; the S_z = 0 eigenspace is 2-dimensional, so a zero value does not fix the state (Q1a–Q1d)',
    'Q1a, Q1c, Q1d, Q2b (established quantum mechanics)', 'same zero ↔ observationally indistinguishable parameters: STRUCTURAL ANALOGUE / OPEN CONNECTION (no explicit map between the two)', '—',
    'a richer state becoming an observable manifestation (T-VIEWER-FORM, normalized question)', 'an explicit map showing the two indistinguishabilities differ in kind (would bound the analogue)',
    PQ, cards=['Q1a', 'Q1c', 'Q1d', 'Q2b'], registry=['T-QUANTUM-ZERO', 'T-VIEWER-FORM'], sources=['SRC-SAKURAI-2017'])
row('measurement-reduction', 'Measurement / reduction', 'the Reduction / Information-Changing Architecture (RI0): for each map, what survives, collapses, becomes zero, is lost, is reconstructible, the fibers, symmetry', 'RIC1a–RIC1d, W2a, W3a (instances)',
    'model-manifold boundaries join as limits (MMIg), dephasing as a map (W2a)', 'transform vs reduce governs the project (T-TRANSFORM-REDUCE, open)', 'measurement as reduction (T-MM-OBSERVE)', 'a reduction where the seven questions cannot be posed',
    PDC, cards=['RIC1a', 'W2a', 'MMIg'], registry=['T-REDUCTION-ARCH', 'T-TRANSFORM-REDUCE'])
row('information-distinguishability', 'Information loss / distinguishability', 'Fisher length = local distinguishability per unit noise (MMId); fibers Y⁻¹(y) = parameters with identical predictions; information distinctions below', 'Rao 1945; Amari 2016; FB7b; MMId',
    'geometry encodes accessible / inaccessible / indistinguishable information (T-GEOM-INFO-Q, open)', '—', 'what the geometry says about distinguishability in quantum measurement (open)', 'two parameter values with zero Fisher distance but distinguishable predictions (impossible locally)',
    EM, cards=['MMId', 'FB7b', 'FB7a'], registry=['T-GEOM-INFO-Q'], sources=['SRC-RAO-1945', 'SRC-AMARI-2016'])
row('representations-aspects', 'Representations expose different aspects', 'charts, noise metrics, embeddings: what changes (entries, det, raw eigenvalues, condition number, singular values) and what stays (rank, nullity, length, volume element, curvature, widths, boundary set)',
    'Lee 2018 (tensor law); MMIa–MMIf', 'arrow 2 of the story (T-MM-STORY)', '—', '—', 'a "geometric" claim that rests on a chart-dependent number (MMIb shows how it fails)',
    PDC, cards=['MMIa', 'MMIb', 'MMIc', 'MMId', 'MMIe', 'MMIf'], registry=['T-MM-STORY'], sources=['SRC-LEE-2018'])
row('raw-spectrum-c7', 'Raw FIM eigenvalue spectrum as C7\'s object', 'eigenvalues of the component matrix g in one chart', 'CFT5e, MMIb (not invariant)', 'C7 compared coefficient decay with this spectrum (BR28)', '—', '—',
    'already failed as a geometric object: it changes with units and charts', NEG, cards=['MMIb', 'CFT5e'], registry=['T-C7'])
assert len(ROWS) >= 15

# ── invariance table ────────────────────────────────────────────────────────────────────────────
ICOLS = ['Quantity', 'Definition', 'Coordinate invariant?', 'Embedding dependent?', 'Model dependent?', 'Noise-model dependent?', 'Reduction dependent?', 'Source', 'Failure example', 'C7 relevance']
INV = []
def inv(q, d, coord, emb, model, noise, red, source, fail, c7, *, invariant, cards=()):
    assert invariant in ('yes', 'no'), q
    INV.append(dict(quantity=q, definition=d, coordinateInvariant=coord, embedding=emb, model=model, noise=noise, reduction=red, source=source, failure=fail, c7=c7,
                    invariant=invariant, cards=list(cards)))
Y_EMB = 'yes: the pullback of the prediction-space metric; changes with the outputs (sampling points) and their metric'
inv('Fisher metric tensor', 'g = JᵀΣ⁻¹J as a (0,2)-tensor on Θ', 'YES as a tensor (components transform by R1, g_φ = Jᵀ g J)', Y_EMB, 'yes', 'yes (Σ)', 'yes: on a boundary it is the boundary model\'s metric (rank drops)',
    'Rao 1945; Amari 2016; Lee 2018; FB6a, CFT4c', '"g is unchanged" under reparametrization is false for components (CFT4c)', 'not itself C7\'s object', invariant='yes', cards=['FB6a', 'CFT4c'])
inv('Matrix entries g_ij', 'components of g in a chart', 'NO', Y_EMB, 'yes', 'yes', 'yes', 'CFT4c; MMIb', 'θ = diag(1, 10)θ′ rescales the entries (MMIb)', 'not an object for C7', invariant='no', cards=['MMIb', 'CFT4c'])
inv('Rank', 'rank g = rank J', 'YES under invertible reparametrizations', 'yes: too few outputs can lower it', 'yes', 'no for SPD Σ (MMIe)', 'yes: drops on a boundary (MMIg)', 'MMIa; CFT5d; MMIe', 'a singular (non-invertible) chart change can lower it', 'the number of nonzero widths is the dimension', invariant='yes', cards=['MMIa', 'CFT5d', 'MMIe', 'MMIg'])
inv('Nullity / null directions', 'ker g = ker J (tangent vectors; they transform by J⁻¹)', 'YES (as tangent vectors)', 'yes', 'yes', 'no for SPD Σ (MMIe)', 'yes', 'FB7b; CFT5d; MMIe', 'a singular noise weighting (not SPD) can add nulls', 'a null is a zero-width direction at a point', invariant='yes', cards=['FB7b', 'CFT5d', 'MMIe'])
inv('Raw eigenvalues', 'eigenvalues of the component matrix g', 'NO', 'yes', 'yes', 'yes', 'yes', 'CFT5e; MMIb', 'F-C at θ = (1, 6/5): 0.001285, 0.36 → 0.003487, 13.26 under θ = diag(1, 10)θ′ (MMIb)', 'NEGATIVE: not C7\'s object', invariant='no', cards=['MMIb', 'CFT5e'])
inv('Condition number', 'λ_max / λ_min of the component matrix', 'NO', 'yes', 'yes', 'yes', 'yes', 'MMIb', 'moves under a change of units (MMIb)', 'not an object for C7', invariant='no', cards=['MMIb'])
inv('Determinant', 'det g', 'NO: det(PᵀgP) = det(P)² det g', 'yes', 'yes', 'yes', 'yes: 0 on a rank drop', 'MMIa', 'any chart with det P ≠ ±1', 'not an object for C7', invariant='no', cards=['MMIa'])
inv('Volume element', '√det g |dθ|', 'YES (change of variables)', 'yes', 'yes', 'yes', 'yes: degenerates on a boundary', 'MMIa; Amari 2016', 'total volume may be infinite (unbounded Θ)', 'related to widths only heuristically; not carded', invariant='yes', cards=['MMIa'])
inv('Geodesic / curve length', '∫√(θ′ᵀ g θ′) ds', 'YES', 'yes: equals the arc length of the image curve in P (MMId)', 'yes', 'yes', 'yes', 'MMId; Lee 2018', 'the same curve has another length under another noise model (MMIf)', 'widths are lengths: relevant', invariant='yes', cards=['MMId', 'MMIf'])
inv('Curvature', 'Gaussian curvature K of (M, g) (intrinsic); extrinsic curvature of M ⊆ P', 'YES (K is a scalar invariant)', 'intrinsic K: no beyond g; extrinsic curvature: yes', 'yes', 'yes', 'yes', 'CFT5f; Lee 2018; TMS 2011 (curvature small relative to widths, source-only)', 'F-C: K(1, 2) = −0.8877, K(1, 3) = −1.155 (varies; CFT5f)', 'background for widths (source-only)', invariant='yes', cards=['CFT5f'])
inv('Jacobian singular values', 'singular values of J (= √eig(JᵀJ) in a Euclidean chart)', 'NO', 'yes', 'yes', 'yes', 'yes', 'MMIc', 'θ vs log θ vs Σ = diag(1, 2, 3) give three different sets (MMIc)', 'not C7\'s object (same defect as raw eigenvalues)', invariant='no', cards=['MMIc'])
inv('Hyperribbon widths', 'cross-sectional extents of M in (P, Σ⁻¹) (TMS 2011: along geodesics; Quinn 2019: bounding hyperellipsoid)', 'YES (a property of the image set)', 'YES: depends on the ambient metric and the outputs (MMIf)', 'yes', 'yes', 'yes: a boundary face has fewer widths', 'TMS 2011; Quinn et al. 2019; MMIf (1-D illustration)', 'weighting diag(1, 4, 9) changes the width 1.863 → 3.935 (MMIf)', 'RECOMMENDED C7 target', invariant='yes', cards=['MMIf'])
inv('Sloppy hierarchy', 'the pattern of decay of stiffness / width', 'NO as a raw eigenvalue pattern; YES when stated as widths', 'yes', 'yes', 'yes', 'yes', 'Gutenkunst 2007; S14b (weak); S14a FAIL kept', 'S14a: span 3.1 decades, threshold 4 (FAIL kept)', 'restate as widths before comparing', invariant='no', cards=['S14b', 'S14a', 'MMIb'])
inv('Model-manifold boundary structure', 'the faces lim Y(θ) as θ → ∂Θ', 'YES (the limit set; the approach rate is chart-dependent)', 'yes (as a subset of P)', 'yes', 'the set: no; its metric: yes', 'it is the reduction', 'MMIg; FB11c; Transtrum–Qiu 2014', 'approach rates differ between θ₂ and log θ₂ (MMIg)', 'widths shrink toward faces (source-only)', invariant='yes', cards=['MMIg', 'FB11c'])
inv('Generalized eigenvalues of (g, h)', 'eig(h⁻¹g) for a second tensor h', 'YES if h is a tensor', 'depends on h', 'yes', 'yes', 'yes', 'MMIb', 'h = I in every chart is not a tensor; the result then changes', 'an invariant spectrum only with a system-supplied h (none supplied)', invariant='yes', cards=['MMIb'])
assert len(INV) >= 14

# ── information distinctions ────────────────────────────────────────────────────────────────────
INFO = [
 dict(term='Shannon information', object='entropy H(p) = −Σ p log p of an outcome distribution (mutual information between variables)', geometry='not a metric on parameters; not carded', cards=[], notSame='Fisher information'),
 dict(term='Fisher information', object='g = E[∂ℓ ∂ℓᵀ] = JᵀΣ⁻¹J (Gaussian noise): local sensitivity of the likelihood, a metric', geometry='the induced metric of M; chart covariance R1', cards=['FB6a', 'FB6b', 'MMIa'], notSame='Shannon entropy; identifiability (global)'),
 dict(term='parameter identifiability', object='injectivity of Y on Θ (global); rank J = dim Θ (local, first order)', geometry='fibers Y⁻¹(y); null directions g(v, v) = 0', cards=['FB7a', 'FB7b'], notSame='sloppiness (identifiable but poorly constrained)'),
 dict(term='prediction sensitivity', object='J = ∂Y/∂θ', geometry='chart-dependent components and singular values (MMIc); its kernel is invariant', cards=['MMIc'], notSame='distinguishability (needs the noise metric)'),
 dict(term='observable distinguishability', object='distance in P per unit noise; locally the Fisher length (MMId)', geometry='lengths and widths (chart-independent, noise-dependent)', cards=['MMId', 'MMIf'], notSame='identifiability (zero distance only along nulls)'),
 dict(term='reconstruction information', object='what Φ(x) determines about x under stated assumptions (fibers Φ⁻¹(y))', geometry='Reduction architecture (IC questions)', cards=['G3b', 'G4c', 'RIC1a'], notSame='Fisher information (local, parametric)'),
 dict(term='phase information', object='what |x̂| discards: equal power spectra, different signals', geometry='fibers of x ↦ |x̂| (not a subspace)', cards=['P1c', 'FB1d'], notSame='Fisher information of a phase parameter'),
 dict(term='quantum information', object='density matrices; coherences ⟨A|ρ|B⟩; what a measurement removes or makes available', geometry='not the Fisher metric of this audit; quantum Fisher information is not carded', cards=['W2a', 'W2b', 'Q1c'], notSame='classical identifiability'),
]

SPINE = [
 ('OBJECT', 'a model rule Y: Θ → P with parameter domain Θ and a noise model Σ'),
 ('REPRESENTATION', 'a chart θ of M; the prediction space P (ℝᵐ or L²) with metric Σ⁻¹'),
 ('RELATION', 'the Fisher metric g = JᵀΣ⁻¹J (pullback of the prediction metric)'),
 ('ZERO / BALANCE / NULL', 'g(v, v) = 0 ⟺ Jv = 0 (first-order non-identifiability, FB7b); rank drop at a boundary (MMIg)'),
 ('TRANSFORMATION', 'R1 reparametrizations g_φ = Jᵀ g J; R2 isometries only when supplied (CFT5a, CFT4d); a change of noise model changes the metric (not R1, MMIe); a boundary limit is a family degeneration, not a map'),
 ('PRESERVED STRUCTURE', 'under charts: rank, nullity, null directions, lengths, volume element, curvature, widths, boundary set. Not preserved: entries, det, raw eigenvalues, condition number, singular values'),
 ('GEOMETRY', 'M ⊆ P with its induced metric; widths; boundaries; curvature (not homogeneous, CFT5f)'),
 ('INFORMATION', 'Fisher information (local distinguishability per unit noise); identifiability (fibers of Y)'),
 ('DYNAMICS / CONTINUATION', 'geodesics to boundaries (MBAM, source-only); the c → ∞ boundary (C9b)'),
 ('CROSS-SYSTEM TRANSFER', 'c ↔ model parameter limit (STRUCTURAL ANALOGUE); same-zero quantum ↔ indistinguishable parameters (STRUCTURAL ANALOGUE / OPEN); C7 (OPEN; target object: widths)'),
 ('APPLICATION', 'none (Energeo not begun)'),
]

MANIFEST = [
 dict(term='mathematical manifestation', meaning='the image Φ(x) of a stated map, or the boundary model reached by a stated limit', status=EM, example='Pₙx (RIC1a); e^{−θ₁t} as the θ₂ → ∞ face (MMIg)', cards=['RIC1a', 'MMIg']),
 dict(term='observable manifestation', meaning='what a stated measurement returns: outcomes and the post-measurement state', status=EM, example='after non-selective S² measurement: outcomes 2ħ² and 0, sector coherence gone (W2a, W2b)', cards=['W2a', 'W2b']),
 dict(term='physical manifestation', meaning='physical coming-into-form, the subject of the historical intuition', status=PQ, example='none: needs physical theory or data (T-PHYSICAL-MANIFEST-Q, T-VIEWER-FORM)', cards=[]),
]
TRANSFORM = dict(R1='reparametrizations (charts): g_φ = Jᵀ g J; rank, nullity, lengths, curvature, widths, boundary set invariant (MMIa–MMIf, CFT4c)',
                 R2='isometries F*g = g only when the system supplies them (F-C exchange CFT5a; location–scale CFT4d); none in general (CFT5f)',
                 R3='none claimed: no operator compatibility is carded for model manifolds in this audit',
                 outside='a change of noise model Σ changes the metric itself (MMIe): not R1, R2 or R3; a boundary limit is a family degeneration (Reduction architecture), not a transformation')
C_VERDICT = dict(verdict='STRUCTURAL CONNECTION', scope='the parameter-limit → degenerate-boundary role only',
                 parts=[dict(role='a parameter limit is a degenerate boundary (rank drop)', verdict='STRUCTURAL CONNECTION', cards=['MMIi', 'C9b', 'MMIg'], note='c → ∞: η_c → diag(1, 0), rank 1; θ₂ → ∞: rank J 2 → 1. Quinn et al. 2023 treat c as a model parameter (PDF quote pending)'),
                        dict(role='c as the invariant of a form (structure constant)', verdict='FAIL', cards=['MMIi', 'CFT5f'], note='for finite c, c is absorbed by a change of units (R1): the invariant is the signature. Model parameters are coordinates on one manifold; M is not homogeneous'),
                        dict(role='"rules constrain allowed states", stated generally', verdict='TOO WEAK', cards=[], note='every constraint does this; it distinguishes nothing')],
                 registry='T-RULES-GEOMETRY')
NULLS = [
 dict(kind='Fisher null (statistical)', law='g(v, v) = 0 ⟺ Jv = 0 ⟺ gv = 0 (g ⪰ 0)', cards=['FB7b', 'FB7a']),
 dict(kind='sloppy direction', law='g(v, v) > 0 but small relative to other directions in a stated chart or width', cards=['FB7c']),
 dict(kind='Lorentz null', law='vᵀηv = 0 with ηv ≠ 0 (indefinite form)', cards=['FB7d']),
 dict(kind='bilinear null', law='B(u, v) = 0 for nonzero u, v (orthogonality)', cards=['TRA2a']),
 dict(kind='collapsed zero', law='Φ(x) = 0 with x ≠ 0 for a non-injective Φ', cards=['RIC1a', 'RIC2c']),
]
C7 = dict(recommendation='hyperribbon widths', notReady=False,
          object='the hyperribbon widths of the model manifold: cross-sectional extents of M in a stated prediction-space metric',
          why=['parametrization-independent (MMIf), unlike raw FIM eigenvalues (MMIb, CFT5e: NEGATIVE)', 'the geometric quantity the sloppy phenomenology is about (TMS 2011)',
               'known mathematics already links widths to coefficient decay: Chebyshev coefficients bound them for analytic models (Quinn et al. 2019)'],
          gates=['fix the width definition from the source text (TMS 2011 geodesic widths vs Quinn 2019 bounding-hyperellipsoid widths); the PDFs are not opened here',
                 'state the prediction-space metric (noise model): widths depend on it (MMIf)',
                 'state C7\'s project-specific residue relative to Quinn 2019 before deriving; otherwise the outcome is VALIDATION OF KNOWN MATHEMATICS',
                 'T-C7 wording unchanged; no derivation in this pass'],
          rejected=[dict(object='raw FIM eigenvalues', why='coordinate-dependent (MMIb, CFT5e)'), dict(object='Jacobian singular values', why='coordinate- and metric-dependent (MMIc)'),
                    dict(object='generalized eigenvalues of (g, h)', why='invariant, but needs a system-supplied reference tensor h; none is supplied')],
          registry='T-C7')
NEGATIVE = [
 dict(result='raw FIM eigenvalues, condition number, determinant and Jacobian singular values are not coordinate invariants', cards=['MMIb', 'MMIc', 'MMIa', 'CFT5e']),
 dict(result='C7 read as "coefficient decay vs raw Fisher eigenvalue decay" compares a chart-dependent number', cards=['MMIb', 'CFT5e']),
 dict(result='the invariant-form role of c does not transfer to model parameters', cards=['MMIi']),
 dict(result='"rules constrain allowed states" stated generally is too weak to test', cards=[]),
 dict(result='a generic model manifold is not homogeneous: no group orbit plays the role of the Lorentz allowed set', cards=['CFT5f', 'MMIi']),
 dict(result='a function-space prediction space does not make M infinite-dimensional', cards=['MMIh']),
 dict(result='a boundary limit is not a map on states: the Reduction architecture records it as a family degeneration', cards=['MMIg']),
 dict(result='no single construction of "observation" covers quantum dephasing, projection and boundary limits', cards=['W2a', 'RIC1a', 'MMIg']),
 dict(result='S14a stays FAIL (span 3.1 decades, threshold 4)', cards=['S14a']),
]
RATINGS = [
 dict(dimension='Model-manifold established mathematics', bs=25, slop=5, td='TRIVIAL CONSEQUENCE', breadth=3, status=EM, why='definitions and textbook facts, carded on three models (F-C, the one-exponential curve, the function-space model)'),
 dict(dimension='Parameter / rule → allowable-manifold connection', bs=40, slop=5, td='TRIVIAL CONSEQUENCE', breadth=2, status=PDC, why='exact in the definitional sense M = Y(Θ); the domain\'s limits give boundaries; adds the word "rules", not a theorem'),
 dict(dimension='Prediction-space / larger-space connection', bs=30, slop=20, td='NOT YET FORMALIZED', breadth=2, status=PH, why='the prediction space and its function-space form are exact (MMIh); the "larger possibility space" beyond P is a project frame'),
 dict(dimension='c / model-rule analogy', bs=25, slop=20, td='STRUCTURAL TRANSFER', breadth=2, status=PDC, why='STRUCTURAL CONNECTION for the limit → rank-drop role only; FAIL for the invariant-form role; TOO WEAK in general'),
 dict(dimension='Observation / reduction connection', bs=15, slop=35, td='NOT YET FORMALIZED', breadth=1, status=OC, why='exact for named maps (W2a, RIC1a, MMIg); no construction covers "observation" as one class'),
 dict(dimension='Quantum-like manifestation hypothesis', bs=5, slop=55, td='NOT YET FORMALIZED', breadth=0, status=PQ, why='historical intuition and its normalized question kept; no physical theory or data; conscious observer requirement = NOT ESTABLISHED'),
 dict(dimension='C7 readiness', bs=10, slop=30, td='NOT YET FORMALIZED', breadth=0, status=OC, why='target object recommended (widths) with four gates; no derivation; the raw-spectrum reading is NEGATIVE'),
]
LOST = [
 'the story as one chain (prediction space → allowable manifold → representation → manifestation → what survives), with a status per arrow',
 'the user-origin questions: infinite prediction space, rules → geometry of allowed states, the two roles of c, observation as manifestation, what is accessible vs indistinguishable',
 'the historical viewer intuition and its normalized question (PHILOSOPHICAL, kept)',
 'the link to the zero programme: a zero length as non-identifiability; same-zero quantum states (STRUCTURAL ANALOGUE)',
 'the link to the Transformation and Reduction architectures (R1 for charts; limits as degenerations; IC questions per map)',
 'C7 as a project question (the paper answers a neighbouring question, Chebyshev widths, not C7 as posed)',
]
DECISIONS = [
 'Adopt the c verdict: STRUCTURAL CONNECTION for the parameter-limit → degenerate-boundary role only; FAIL for the invariant-form role; TOO WEAK in general?',
 'Approve hyperribbon widths as C7\'s target object, and choose the width definition (TMS 2011 geodesic widths or Quinn 2019 bounding-hyperellipsoid widths)?',
 'Is the historical wording "matter does not form until a viewer looks at it." recoverable? Is the normalized question acceptable as the investigable form?',
 'Add the PDFs (Quinn et al. 2023, Quinn et al. 2019, TMS 2011) so the widths and the c-boundary claim can be quoted?',
 'Should the restricted c connection (parameter limits as rank-drop boundaries across systems) get its own construction pass, or stay open?',
]

data = dict(about='Model-manifold invariance + research-story audit (2026-11-13). Generated by research/tools/model_manifold_source.py.',
            governance=dict(words='Do not audit away the research story. Audit the status of each connection.', registry='T-MM-GOV'),
            storyStatuses=STORY_STATUSES, cVerdicts=C_VERDICTS, noveltyClasses=NOVELTY, separations=SEP, chains=CHAINS, viewer=VIEWER, storyColumns=COLS, story=ROWS,
            invarianceColumns=ICOLS, invariance=INV, information=INFO, spine=[dict(stage=a, instance=b) for a, b in SPINE], cVerdict=C_VERDICT, nulls=NULLS, c7=C7,
            negative=NEGATIVE, manifestation=MANIFEST, transformation=TRANSFORM, ratings=RATINGS, lostIfPaperOnly=LOST, decisions=DECISIONS)
(ROOT / 'research/model_manifold.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')

cell = lambda x: '—' if x in (None, '', []) else str(x).replace('|', '\\|')
L = ['# Model-manifold research story', '',
     'Generated from `research/tools/model_manifold_source.py` (`research/model_manifold.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Model-manifold invariance + research-story audit". Cards: `verify/verify_MMI.py`.', '',
     '> Do not audit away the research story. Audit the status of each connection. (T-MM-GOV)', '',
     'The paper is not the thesis: a paper result does not prove the project interpretation, and the project interpretation is not paper novelty. Novelty classes: ' + '; '.join(NOVELTY) + '.', '',
     'Kept apart throughout: ' + '; '.join(SEP) + '.', '',
     'Status classes: ' + '; '.join(STORY_STATUSES) + '.', '', '## The story, arrow by arrow', '']
for ch in CHAINS:
    L += [f'**{ch["id"]}** ({ch["registry"]}): "{ch["words"]}"', '', '| # | From | To | Status | Also | Exact object | Cards | Note |', '|---|---|---|---|---|---|---|---|']
    for i, a in enumerate(ch['arrows'], 1):
        L.append(f'| {i} | {cell(a["frm"])} | {cell(a["to"])} | {a["status"]} | {cell(a["also"])} | {cell(a["exact"])} | {cell(", ".join(a["cards"]))} | {cell(a["note"])} |')
    L.append('')
L += ['**Historical intuition** (' + VIEWER['registry'] + '): "' + VIEWER['words'] + '" Status: ' + VIEWER['status'] + '. Labels: ' + '; '.join(VIEWER['labels']) + '.', '',
      'Normalized question (kept beside it, not replacing it): "' + VIEWER['normalized'] + '"', '', VIEWER['conscious'] + '.', '', 'Investigable part: ' + VIEWER['investigable'] + '.', '',
      '## Story table', '', '| ' + ' | '.join(COLS) + ' | Cards | Registry |', '|' + '---|' * (len(COLS) + 2)]
for r in ROWS:
    L.append('| ' + ' | '.join(cell(r[k]) for k in ('idea', 'object', 'established', 'connection', 'hypothesis', 'extension', 'falsify', 'status')) + f' | {cell(", ".join(r["cards"]))} | {cell(", ".join(r["registry"]))} |')
L += ['', '## Null directions, kept distinct', '', '| Kind | Law | Cards |', '|---|---|---|'] + [f'| {n["kind"]} | {cell(n["law"])} | {", ".join(n["cards"])} |' for n in NULLS]
L += ['', '## Manifestation terminology', '', '| Term | Meaning | Status | Example |', '|---|---|---|---|'] + [f'| {m["term"]} | {cell(m["meaning"])} | {m["status"]} | {cell(m["example"])} |' for m in MANIFEST]
L += ['', 'Connected to the Reduction architecture\'s source / manifestation question (T-SOURCE-MANIFEST).', '', '## Transformation Architecture placement', '', '| Level | Model-manifold placement |', '|---|---|'] + [f'| {k} | {cell(v)} |' for k, v in TRANSFORM.items()]
L += ['', '## c and governing rules: verdict', '', f'Verdict ({C_VERDICT["registry"]}): **{C_VERDICT["verdict"]}**, restricted to {C_VERDICT["scope"]}.', '', '| Role | Verdict | Cards | Note |', '|---|---|---|---|']
L += [f'| {p["role"]} | {p["verdict"]} | {cell(", ".join(p["cards"]))} | {cell(p["note"])} |' for p in C_VERDICT['parts']]
L += ['', '## Information distinctions', '', '| Term | Exact object | Geometry | Cards | Not the same as |', '|---|---|---|---|---|']
L += [f'| {i["term"]} | {cell(i["object"])} | {cell(i["geometry"])} | {cell(", ".join(i["cards"]))} | {cell(i["notSame"])} |' for i in INFO]
L += ['', '## Spine instantiation (model manifolds)', '', '| Spine stage | Model-manifold instance |', '|---|---|'] + [f'| {a} | {cell(b)} |' for a, b in SPINE]
L += ['', '## C7 target object', '', f'One recommendation: **{C7["recommendation"]}**, {C7["object"]}. T-C7 stays OPEN; no derivation is begun.', '', 'Why:'] + [f'- {w}' for w in C7['why']]
L += ['', 'Gates before any derivation:'] + [f'- {g}' for g in C7['gates']] + ['', 'Not recommended:'] + [f'- {x["object"]}: {x["why"]}' for x in C7['rejected']]
L += ['', '## Negative results', '', '| Result | Cards |', '|---|---|'] + [f'| {n["result"]} | {cell(", ".join(n["cards"]))} |' for n in NEGATIVE]
L += ['', '## Ratings (separate dimensions; no overall score)', '', '| Dimension | Backbone Support | AI Slop Risk | Transfer Depth | Application Breadth | Status | Why |', '|---|---|---|---|---|---|---|']
L += [f'| {r["dimension"]} | {r["bs"]}% | {r["slop"]}% | {r["td"]} | {r["breadth"]} | {r["status"]} | {cell(r["why"])} |' for r in RATINGS]
L += ['', '## What would be lost if this branch were reduced to the paper alone', ''] + [f'- {x}' for x in LOST]
L += ['', '## Decisions for Nadia', ''] + [f'{i}. {d}' for i, d in enumerate(DECISIONS, 1)]
(ROOT / 'research/model_manifold_story.md').write_text('\n'.join(L) + '\n')

V = ['# Model-manifold invariance table', '',
     'Generated from `research/tools/model_manifold_source.py` (`research/model_manifold.json`). Do not edit by hand. Cards: `verify/verify_MMI.py` (MMIa–MMIi) and earlier cards as cited.', '',
     '"Coordinate invariant" means unchanged under an invertible reparametrization of Θ (R1). "Embedding dependent" means it changes with the choice of outputs and the prediction-space metric in which M sits. "Reduction dependent" means it changes on a boundary / reduced model. Model F-C: Y = e^{−θ₁t} + e^{−θ₂t}, t = 1, 2, 3, σ = 1.', '',
     '| ' + ' | '.join(ICOLS) + ' | Cards |', '|' + '---|' * (len(ICOLS) + 1)]
for r in INV:
    V.append('| ' + ' | '.join(cell(r[k]) for k in ('quantity', 'definition', 'coordinateInvariant', 'embedding', 'model', 'noise', 'reduction', 'source', 'failure', 'c7')) + f' | {", ".join(r["cards"])} |')
V += ['', 'Summary. Coordinate invariant: ' + ', '.join(r['quantity'] for r in INV if r['invariant'] == 'yes') + '. Not coordinate invariant: ' + ', '.join(r['quantity'] for r in INV if r['invariant'] == 'no') + '.',
      'Every magnitude depends on the noise model; null directions and rank do not (for SPD Σ). These are the quantities audited, not an exhaustive classification for this project.']
(ROOT / 'research/model_manifold_invariance.md').write_text('\n'.join(V) + '\n')
print(f'{len(ROWS)} story rows; {len(INV)} invariance rows; {len(INFO)} information terms')
