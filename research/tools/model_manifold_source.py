"""Model-manifold invariance + research-story audit (2026-11-13), with the precision corrections of 2026-11-15.
Writes research/model_manifold.json and renders research/model_manifold_story.md and research/model_manifold_invariance.md.
Decisions: docs/restructure_decisions.md, "Model-manifold invariance + research-story audit" and "Model-manifold precision corrections".
Cards: verify/verify_MMI.py (2026-11-13; outputs unchanged) and verify/verify_MMP.py (2026-11-15; scopes the MMI wording).
Superseded statements are kept: each correction records the old claim, the corrected claim, the reason and the status.
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
# arrow statuses (2026-11-15); the 2026-11-13 seven-class status of each arrow is kept beside it
ARROW_STATUSES = ['ESTABLISHED MATHEMATICS', 'PROJECT-DERIVED', 'STRUCTURAL ANALOGY', 'OPEN', 'PHILOSOPHICAL / HISTORICAL INTUITION']
A_EM, A_PD, A_SA, A_OP, A_PH = ARROW_STATUSES
PREC = '2026-11-15'


# ── notation and the precise objects (2026-11-15) ─────────────────────────────────────────────
NOTATION = dict(J_Y='J_Y = ∂Y/∂θ, the prediction (model) Jacobian', A='A = ∂θ/∂φ, the Jacobian of a reparametrization θ = θ(φ)',
                g='g_θ = J_Yᵀ Σ⁻¹ J_Y (Gaussian noise with a fixed covariance Σ)', law='g_φ = Aᵀ g_θ A',
                tensor='g is one symmetric (0,2)-tensor on Θ; g_θ and g_φ are its component matrices in two charts. The components change; the tensor does not',
                cards=['MMPc', 'CFT4c'],
                older='earlier records (CF13, BR41, the Transformation Architecture) write the coordinate-change Jacobian as J in g_φ = Jᵀ g J; there J = ∂θ/∂φ = A, not J_Y')
STRUCTURE = dict(image='M = Y(Θ) ⊆ P is the model image / model set, in full generality',
                 manifold='it may be called a smooth model manifold on a regular region only: constant local rank and local injectivity (immersion plus embedding-type conditions)',
                 phenomena=[dict(kind='rank loss', example='F-C on the diagonal θ₁ = θ₂ (rank J_Y = 1); the cusp (θ², θ³) at θ = 0', cards=['MMPa', 'MMPb', 'CFT5b']),
                            dict(kind='non-identifiability', example='F-C: Y(1, 2) = Y(2, 1); Y = e^{−(θ₁+θ₂)t} depends on θ₁ + θ₂ only', cards=['MMPb', 'FB7a']),
                            dict(kind='self-intersection', example='the node (θ² − 1, θ³ − θ): an immersion with Y(1) = Y(−1)', cards=['MMPa']),
                            dict(kind='singular stratum', example='the cusp (θ², θ³) at the origin', cards=['MMPa']),
                            dict(kind='boundary / limiting stratum', example='the edge of the F-C image from the interior diagonal (MMPj); the θ₂ → ∞ face (MMIg)', cards=['MMPj', 'MMIg'])])
PARAMS = dict(value='θ ∈ Θ is a parameter value in parameter space', point='Y(θ) is the corresponding prediction / model point',
              role='parameters parameterize the model image; they give local coordinates only where the parameterization is locally regular and locally identifiable',
              many='different parameter values may represent the same prediction (F-C: Y(1, 2) = Y(2, 1))',
              project='project interpretation, kept: the model rule Y and the parameter domain Θ constrain the allowable family (T-MM-RULES); this is not a differential-geometric coordinate claim',
              cards=['MMPb', 'MMPa'])
NULL_THM = dict(statement='g(v, v) = vᵀ J_Yᵀ Σ⁻¹ J_Y v = (J_Y v)ᵀ Σ⁻¹ (J_Y v); for positive-definite Σ⁻¹, g(v, v) = 0 ⟺ J_Y v = 0',
                hypothesis='Σ⁻¹ positive definite (and Σ fixed, not θ-dependent)',
                fails=['a singular observation weight: J_Y v ≠ 0 with g(v, v) = 0 (MMPd)', 'a θ-dependent noise law: J_μ v = 0 with g(v, v) = 1/2 (MMPe)'], cards=['MMPd', 'MMPe', 'FB7b'])
NOISE = dict(theorem='For g = J_Yᵀ Σ⁻¹ J_Y with a fixed positive-definite Σ⁻¹: ker g = ker J_Y and rank g = rank J_Y. Changing one positive-definite weighting to another does not change those null directions / rank.',
             caveats=['singular observation metrics (MMPd)', 'parameter-dependent covariance: the full Fisher information must be computed (MMPe)', 'noise laws that contribute additional Fisher terms (MMPe: ∇s∇sᵀ/(2s²))'],
             cards=['MMPe', 'MMPd', 'MMIe'])
VOLUME = dict(invariant='the full element √det g_θ dθ¹⋯dθⁿ (= √det g_φ dφ¹⋯dφⁿ)', notInvariant=['det g (×(det A)²)', '√det g alone (×|det A|)'],
              cards=['MMPf', 'MMIa'])
BOUNDARY = [
 dict(notion='boundary of the parameter domain ∂Θ', object='∂Θ as a subset of parameter space (or of a compactification)', chartDependent=True,
      example='θ₂ = 0 is a finite boundary point in θ but lies at λ₂ → −∞ in λ = log θ', cards=['MMPi']),
 dict(notion='limiting behaviour of parameters', object='a family θ(r) with, e.g., θᵢ → ∞', chartDependent=True,
      example='θ₂ → ∞ in F-C; θ₁ = θ₂ = r → ∞ (a different limit with a different image)', cards=['MMIg', 'MMPl']),
 dict(notion='image of a limit in prediction space', object='lim Y(θ(r)) in P, when it exists', chartDependent=False,
      example='e^{−θ₁t} (θ₂ → ∞); 0 (θ₁ = θ₂ → ∞); no limit for Y = e^{−θ₁t} + θ₂t', cards=['MMIg', 'MMPl', 'MMPi']),
 dict(notion='limiting boundary stratum / reduced-model boundary (MBAM sense)', object='a lower-dimensional limiting model family in P reached as parameters approach appropriate limits',
      chartDependent=False, example='the one-exponential family as a face of F-C; MBAM reaches such faces along geodesics (source-only)', cards=['MMIg', 'FB11c']),
 dict(notion='ordinary topological boundary of Y(Θ) in P', object='closure minus interior of the set Y(Θ) in P', chartDependent=False,
      example='for dim M < dim P the interior is empty, so this boundary is the whole closure (MMPi); an edge of the image can come from interior rank-drop points (MMPj)', cards=['MMPi', 'MMPj']),
]
BOUNDARY_RULES = ['These five are not automatically identical.', 'A model-manifold boundary can arise as a limiting/degenerate model family in prediction space as parameters approach appropriate limits.',
                  'Not every parameter-domain boundary gives a distinct model-manifold boundary (MMPi).', 'Not every model-manifold boundary should be described as an ordinary finite boundary point in parameter coordinates (MMPi, MMPj).']
FUNCSPACE = dict(formula='g_ij = 2/(θᵢ + θⱼ)³', scope='the Fisher metric of the specific continuous-output model Y(T) = e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞) (white noise per unit time); not a general formula',
                 other='the linear model θ₁e^{−T} + θ₂e^{−2T} in the same space has the constant metric [[1/2, 1/3], [1/3, 1/4]]', dims='dim P = ∞, while dim M = 2 (< ∞)',
                 keep='A prediction space can be infinite-dimensional while the model image itself remains finite-dimensional.', cards=['MMIh', 'MMPk'])
WIDTHS = dict(
 geometric=[dict(name='Transtrum-style geodesic widths', source='SRC-TMS-2011', definition='widths of the model image measured along geodesics in prediction space (TMS 2010/2011; snippet-level)',
                 invariance='potentially reparametrization-invariant if the start point and directions are fixed geometrically in prediction space; chart-dependent if the directions are a chart\'s FIM eigendirections (MMPg). The exact operational definition must come from the source text', cards=['MMPg', 'MMId']),
            dict(name='Quinn-style enclosing-hyperellipsoid widths / bounds', source='SRC-QUINN-2019', definition='widths of a hyperellipsoid enclosing the model image, bounded through Chebyshev approximation (geometric decay for analytic models)',
                 invariance='potentially reparametrization-invariant: built from the image set in P with a fixed metric; depends on the prediction metric, the outputs and the input interval of the Chebyshev construction. The exact definition must come from the source text', cards=['MMIf'])],
 illustration=dict(name='total length of a 1-D model image', status='carded: chart-independent, metric-dependent (MMIf)', cards=['MMIf']),
 proxies=[dict(name='raw FIM eigenvalues', cards=['MMIb', 'CFT5e']), dict(name='raw Hessian eigenvalues', cards=['MMPh']), dict(name='prediction-Jacobian singular values', cards=['MMIc']),
          dict(name='parameter-coordinate axis lengths', cards=[]), dict(name='condition number', cards=['MMIb']), dict(name='widths taken along a chart\'s FIM eigendirections', cards=['MMPg']),
          dict(name='any width defined directly from a chosen parameter chart unless proved otherwise', cards=[])],
 rule='Do not merge these categories: geometric widths (A) may be reparametrization-invariant; coordinate-dependent proxies (B) are not in general.')

# ── the story, arrow by arrow (both chains as Nadia gave them) ───────────────────────────────────
CHAINS = [
 dict(id='CHAIN-1', words='larger prediction / possibility space → rules constrain an allowable manifold → representations expose different aspects of it → observation / reduction may expose an accessible manifestation → ask what geometry and information survive',
      registry='T-MM-STORY', arrows=[
   dict(frm='larger prediction / possibility space', to='rules constrain an allowable manifold', status=EM, also=PDC, arrowStatus=A_EM, arrowAlso=A_PD,
        exact='M = Y(Θ) ⊆ P: the model rule Y and the parameter domain Θ fix the model image (the allowable family) inside the prediction space P (finite ℝᵐ, or a function space, MMIh); a smooth manifold only on regular regions (MMPa)',
        cards=['MMIh', 'MMPa', 'MMIg', 'FB11c'], note='the definition is established; reading Y and Θ as the "rules" is the project connection (T-MM-RULES)'),
   dict(frm='rules constrain an allowable manifold', to='representations expose different aspects of it', status=PDC, also=None, arrowStatus=A_PD, arrowAlso=None,
        exact='charts (R1: g_φ = Aᵀ g_θ A), prediction-space metrics (Σ) and embeddings: components, eigenvalues and singular values change; rank, nullity (for fixed positive-definite Σ⁻¹), lengths, the volume element and curvature do not change under charts; widths only when defined from the image set (MMPg)',
        cards=['MMIa', 'MMIb', 'MMIc', 'MMId', 'MMPc', 'MMPf', 'MMPg'], note='which aspect is exposed depends on the representation; what is geometric is what survives every chart'),
   dict(frm='representations expose different aspects of it', to='observation / reduction may expose an accessible manifestation', status=OC, also=None, arrowStatus=A_OP, arrowAlso=None,
        exact='exact only for named maps: a boundary limit (a family degeneration, MMIg), a projection (RIC1a), the non-selective S² measurement D(ρ) = P_t ρ P_t + P_s ρ P_s on |ud⟩ (W2a, MMPn)',
        cards=['MMIg', 'RIC1a', 'W2a', 'MMPn'], note='these are different operations (MMPo); no single construction of "observation" covers them; the general arrow stays OPEN (T-MM-OBSERVE)'),
   dict(frm='observation / reduction may expose an accessible manifestation', to='ask what geometry and information survive', status=PDC, also=OC, arrowStatus=A_PD, arrowAlso=A_OP,
        exact='the seven Reduction / Information-Changing questions per map (survives, collapses, zero, lost, reconstructible, fibers, symmetry)',
        cards=['RIC1a', 'W2a', 'MMIg'], note='answered per map; no general law of what survives (OPEN)'),
 ]),
 dict(id='CHAIN-2', words='possibility / prediction space → rules constrain an allowable manifold → geometry organizes distinguishability → observation/reduction exposes an accessible manifestation → ask what survives, disappears, or becomes observable',
      registry='T-MM-STORY', arrows=[
   dict(frm='possibility / prediction space', to='rules constrain an allowable manifold', status=EM, also=PDC, arrowStatus=A_EM, arrowAlso=A_PD, exact='M = Y(Θ) ⊆ P (model image)', cards=['MMIh', 'MMPa'], note='as in chain 1'),
   dict(frm='rules constrain an allowable manifold', to='geometry organizes distinguishability', status=EM, also=PB, arrowStatus=A_EM, arrowAlso=None,
        exact='locally, for a fixed positive-definite Σ⁻¹: the Fisher length √(dθᵀ g_θ dθ) is the prediction-space distance per unit noise (MMId) and g(v, v) = 0 ⟺ J_Y v = 0 marks first-order indistinguishable directions (FB7b, MMPd); globally: a width hierarchy (paper-backed; definition open, MMPg)',
        cards=['MMId', 'FB7b', 'MMPd', 'MMIf'], note='local statement ESTABLISHED MATHEMATICS under its hypothesis; the global width hierarchy PAPER-BACKED RESULT, with the width object still to be fixed'),
   dict(frm='geometry organizes distinguishability', to='observation/reduction exposes an accessible manifestation', status=OC, also=None, arrowStatus=A_OP, arrowAlso=None, exact='as in chain 1, arrow 3', cards=['W2a', 'MMIg', 'MMPo'], note='OPEN in general'),
   dict(frm='observation/reduction exposes an accessible manifestation', to='ask what survives, disappears, or becomes observable', status=PDC, also=OC, arrowStatus=A_PD, arrowAlso=A_OP,
        exact='per map: survives / is lost (IC questions); "becomes observable": after the non-selective S² measurement the S² outcomes are defined while the triplet–singlet coherence is gone (W2b, MMPn)',
        cards=['W2b', 'RIC1a', 'MMPn'], note='"becomes observable" is exact for the named quantum channel only'),
 ]),
]
CROSSLINKS = [
 dict(link='c → ∞ (theory family) ↔ model-parameter limits (model family)', arrowStatus=A_SA, cards=['C9b', 'MMPm', 'MMIg', 'MMPl'], note='both families have degenerate limits; transfer of c\'s invariant role to model geometry is OPEN'),
 dict(link='same-zero quantum states ↔ observationally indistinguishable parameters', arrowStatus=A_SA, cards=['Q1d', 'Q2b', 'FB7a', 'MMPb'], note='no explicit map between the two'),
 dict(link='quantum measurement, projection, marginalization, quotient, boundary limits, coarse-graining, non-identifiability: one pattern?', arrowStatus=A_OP, cards=['MMPo'], note='It is NOT established that they are the same operation'),
 dict(link='"matter does not form until a viewer looks at it."', arrowStatus=A_PH, cards=[], note='historical / project provenance only; not established physics'),
]
VIEWER = dict(words='matter does not form until a viewer looks at it.', registry='T-VIEWER-FORM', status=PQ, arrowStatus=A_PH,
              normalized='What changes when a richer state/representation becomes an observable manifestation?',
              investigableForms=['What changes when a richer state or representation is mapped to an observable manifestation?',
                                 'Which structures survive a specified map, reduction, observation, quotient, projection, or limit?'],
              labels=['ORIGINAL USER INTUITION', 'PHILOSOPHICAL / QUANTUM-INTERPRETIVE', 'NOT ESTABLISHED PHYSICS', 'ORIGINAL VERBATIM NOT RECOVERED (recorded as given, 2026-11-13, "approximately")', 'HISTORICAL / PROJECT PROVENANCE ONLY (2026-11-15)'],
              conscious='conscious observer requirement = NOT ESTABLISHED',
              investigable='which maps from a richer state to an observable manifestation exist, and what each keeps, removes or makes available (T-MM-OBSERVE; exact instances W2a, W2b, RIC1a, MMIg)')

COLS = ['Idea', 'Exact mathematical object', 'Established / paper result', 'Project connection', 'Project hypothesis', 'Quantum-like / philosophical extension', 'What would falsify / weaken', 'Status']
ROWS = []
def row(key, idea, obj, est, conn, hyp, ext, fals, status, *, cards=(), registry=(), sources=()):
    assert status in STORY_STATUSES, key
    ROWS.append(dict(key=key, idea=idea, object=obj, established=est, connection=conn, hypothesis=hyp, extension=ext, falsify=fals, status=status,
                     cards=list(cards), registry=list(registry), sources=list(sources)))
row('prediction-space', 'Prediction space', 'P = ℝᵐ for m outputs with metric Σ⁻¹; for a continuously indexed output with a stated inner product, a function space (L²). Not the parameter space Θ.',
    'TMS 2010/2011 (data space); for the specific model e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞) the Fisher metric is g_ij = 2/(θᵢ + θⱼ)³ (MMIh; example-specific, MMPk)', '"infinite prediction space" is exact as a function space: dim P = ∞ while dim M < ∞ (T-PREDICTION-INFINITE)',
    'the larger space carries structure that one projection does not show (Interactive Master Map, Stage IV)', 'not a quantum state space; not physical spacetime', 'none for the definition; the infinite reading needs a stated inner product',
    EM, cards=['MMIh', 'MMPk'], registry=['T-PREDICTION-INFINITE'], sources=['SRC-TMS-2011'])
row('model-manifold', 'Model image / model manifold', 'M = Y(Θ) ⊆ P, the model image (a set) in general; a smooth model manifold only on a regular region (constant local rank, locally injective). Rank loss, non-identifiability, self-intersections, singular strata and boundary strata can occur (MMPa, MMPb, MMPj). Induced metric g_θ = J_Yᵀ Σ⁻¹ J_Y',
    'TMS 2010/2011; Quinn et al. 2023 (review)', '"allowable manifold": the set of predictions the rules permit (an allowable family / image)', 'rules constrain a geometry of allowed states (T-RULES-GEOMETRY, open)', '—', 'none for the definition; any statement that treats Y(Θ) as a smooth manifold must state its regular region',
    EM, cards=['MMPa', 'MMPj', 'MMIg', 'MMIh'], registry=['T-INFOGEO', 'T-MM-STORY'], sources=['SRC-TMS-2010', 'SRC-TMS-2011', 'SRC-QUINN-2023'])
row('parameters-rules', 'Parameters vs model rule vs image', 'model rule Y (functional form); parameter domain Θ; parameter values θ ∈ Θ; predictions Y(θ); image M = Y(Θ). Parameters parameterize the image and give local coordinates only where the parameterization is locally regular and locally identifiable (MMPb); different θ may give the same prediction',
    'local coordinates from an immersion that is locally injective (Lee 2018; Amari 2016)', '"the rules of the manifold were the model parameters." Unpacked: Y and Θ fix the allowable image; θ is a parameter value, a local coordinate only on regular identifiable regions; parameter limits can produce limiting strata of the image (T-MM-RULES, DERIVED)',
    'governing rules play a broader role in allowable geometry (T-MM-RULES-Q)', '—', 'a feature of the image that depends on the chart would contradict the unpacking (none: MMIa, MMIf, MMPf)',
    PDC, cards=['MMPb', 'MMIa', 'MMIf', 'MMIg'], registry=['T-MM-RULES', 'T-MM-RULES-Q'], sources=['SRC-LEE-2018', 'SRC-AMARI-2016'])
row('fisher-metric', 'Fisher metric', 'g_θ = J_Yᵀ Σ⁻¹ J_Y with J_Y = ∂Y/∂θ (fixed Σ): the component matrix of a symmetric (0,2)-tensor on Θ, the pullback of the prediction-space metric. Under θ = θ(φ), A = ∂θ/∂φ: g_φ = Aᵀ g_θ A (R1, MMPc); an isometry F*g = g (R2) exists only when the system supplies it',
    'Rao 1945; Amari 2016; FB6a/FB6b; CFT4c and MMPc (R1 checked)', 'placed in the Transformation Architecture: reparametrizations R1, isometries R2 (TA0)', '—', '—',
    'a reparametrization reported as "g unchanged" (false for components)', EM, cards=['FB6a', 'FB6b', 'CFT4c', 'MMPc'], registry=['T-INFOGEO'], sources=['SRC-RAO-1945', 'SRC-AMARI-2016'])
row('null-directions', 'Null directions', 'g(v, v) = (J_Y v)ᵀ Σ⁻¹ (J_Y v); for positive-definite Σ⁻¹ (and fixed Σ), g(v, v) = 0 ⟺ J_Y v = 0 ⟺ g v = 0. Fails for a singular weight (MMPd) and for a θ-dependent noise law (MMPe). Kept apart: sloppy (λ small, nonzero), Lorentz null (vᵀηv = 0, ηv ≠ 0), bilinear null, collapsed zero, equal expectations, same-zero quantum states, symmetry-dependent distinctions',
    'FB7a–FB7d; Amari 2016 (singular regions); MMPd', '"a zero geometric length can expose hidden non-identifiability / redundancy." (T-ZERO-LENGTH, DERIVED under the hypothesis); survives charts (CFT5d) and a change between fixed positive-definite weights (MMIe, MMPe)',
    '—', 'observable zero does not uniquely specify underlying state (T-QUANTUM-ZERO): a STRUCTURAL ANALOGUE, no map given', 'a zero-length direction along which predictions change (impossible for positive-definite fixed Σ⁻¹; possible otherwise, MMPd)',
    EM, cards=['FB7a', 'FB7b', 'FB7c', 'FB7d', 'CFT5d', 'MMIe', 'MMPd', 'MMPe'], registry=['T-ZERO-LENGTH'], sources=['SRC-AMARI-2016'])
row('sloppy-directions', 'Sloppy directions', 'small nonzero eigenvalues of g in a stated chart; the raw spectrum is chart-dependent (MMIb, CFT5e). Invariant candidates: a geometric width hierarchy defined from the image (definition open, MMPg) or generalized eigenvalues of g relative to a system-supplied tensor h',
    'Gutenkunst et al. 2007; TMS 2010; S14b (weak); S14a FAIL kept', 'M1 restated: the spectrum is a statement in log-parameter coordinates', '—', '—',
    'already weakened: raw eigenvalues are not geometric invariants (NEGATIVE result for any raw-spectrum comparison)', NEG, cards=['MMIb', 'CFT5e', 'S14b', 'S14a'], registry=['T-INFOGEO', 'T-C7'], sources=['SRC-GUTENKUNST-2007', 'SRC-TMS-2010'])
row('hyperribbon-widths', 'Hyperribbon widths', 'two width notions kept: Transtrum-style geodesic widths of the image (TMS 2011) and Quinn-style enclosing-hyperellipsoid widths / bounds, decaying geometrically for analytic models (Quinn et al. 2019). Either may be reparametrization-invariant when defined from the image set with a fixed prediction metric; widths taken along a chart\'s FIM eigendirections are not (MMPg). Exact definitions to be fixed from the source text',
    'TMS 2010/2011; Quinn, Wilber, Townsend, Sethna 2019', 'C7 needs an explicitly defined geometric width object (T-C7, preconditions); both notions kept', 'C7: a structural relation between coefficient decay and a coordinate-independent width hierarchy (T-C7, OPEN)', '—',
    'a width definition that changes with the chart; a C7 result that reduces to Quinn 2019 (then VALIDATION OF KNOWN MATHEMATICS)', PB, cards=['MMIf', 'MMPg'], registry=['T-C7', 'T-INFOGEO'], sources=['SRC-TMS-2011', 'SRC-QUINN-2019'])
row('manifold-boundaries', 'Manifold boundaries / limiting strata', 'five objects kept apart: ∂Θ; parameter limits (e.g. θᵢ → ∞); their images in P; limiting boundary strata (MBAM sense); the topological boundary of Y(Θ) in P. A model-manifold boundary can arise as a limiting / degenerate model family in P as parameters approach appropriate limits (MMIg, MMPi, MMPj, MMPl)',
    'Transtrum–Qiu 2014; FB11c; MMIg', 'simpler structure as a boundary of a richer model (T-SIMPLER-BOUNDARY-Q)', '—', '—', 'treating every parameter-domain boundary as an image boundary (fails: MMPi) or a dimension drop as general (fails: MMPl)',
    PB, cards=['MMIg', 'FB11c', 'MMPi', 'MMPj', 'MMPl'], registry=['T-SIMPLER-BOUNDARY-Q'], sources=['SRC-TRANSTRUM-QIU-2014'])
row('effective-models', 'Effective models', 'the boundary model (e.g. e^{−θ₁t}); MBAM reaches it along a geodesic. In the Reduction architecture a limit is a degeneration of the family, not a map Φ: X → Y on states',
    'Transtrum–Qiu 2014 (MBAM, source-only); Machta et al. 2013', 'H6 / T-EFFECTIVE-Q examples; what survives: θ₁ (FB11c)', 'effective representations follow a general law (H6, OPEN)', '—',
    'an effective model not reachable as any boundary (would bound the reading; MBAM source-only)', PB, cards=['FB11c', 'MMIg'], registry=['T-EFFECTIVE-Q', 'T-SIMPLER-BOUNDARY-Q'], sources=['SRC-TRANSTRUM-QIU-2014', 'SRC-MACHTA-2013'])
row('larger-possibility-space', 'Larger possibility space', 'P ⊋ M (the ambient contains predictions no parameter value reaches); a source X → reduced Y (Φ)', 'the strict inclusion is definitional; dim P = ∞ with dim M = 2 for the function-space example (MMIh, MMPk)',
    '"A mathematical space can contain more structure than a single visible projection reveals." (Stage IV carry-forward)', 'the larger possibility space is the right frame for the project (T-MM-STORY)', 'quantum-like possibility space (row quantum-like)',
    'a system where the ambient adds nothing beyond M (would weaken the frame there)', PH, cards=['MMIh', 'MMPk'], registry=['T-MM-STORY', 'T-PREDICTION-INFINITE'])
row('observation-manifestation', 'Observation / manifestation', 'a named information-changing map Φ: X → Y; quantum: the non-selective S² measurement D(ρ) = P_t ρ P_t + P_s ρ P_s, which removes the triplet–singlet coherence of |ud⟩ and keeps S_z = 0 because [P_t, S_z] = [P_s, S_z] = 0 (MMPn)', 'W2a, W2b, MMPn (established quantum mechanics); RIC1a (projection)',
    'observation as a map to a restricted manifestation (T-MM-OBSERVE, OPEN); measurement, projection, marginalization, quotient, limits, coarse-graining and non-identifiability are different operations (MMPo)', '—', '"matter does not form until a viewer looks at it." (T-VIEWER-FORM: historical / project provenance; NOT ESTABLISHED PHYSICS); conscious observer requirement = NOT ESTABLISHED',
    'a measurement whose effect is not representable as such a map (none known); for the viewer intuition: physical theory or data, not a construction', OC, cards=['W2a', 'W2b', 'RIC1a', 'MMPn', 'MMPo'], registry=['T-MM-OBSERVE', 'T-VIEWER-FORM'], sources=['SRC-NIELSEN-CHUANG-2010'])
row('c-governing-rules', 'Connection to c / governing rules', 'three roles of c kept apart: (1) representation: η_c = P_cᵀ diag(1, −1) P_c, P_c = diag(1, 1/c), for the stated matrix form; (2) invariant: Λ_cᵀ η_c Λ_c = η_c and the light cone in Lorentzian spacetime; (3) theory family: c → ∞ gives the degenerate limiting bilinear form diag(1, 0) (C9b, MMPm). Model side: in F-C, θ₂ → ∞ gives a 1-dimensional face (example-specific, MMPl)',
    'C9a, C9b; Quinn et al. 2023 treat c as a model parameter whose c → ∞ boundary gives Newtonian kinematics (snippet-confirmed, PDF pending)', 'theory-family singular limit: STRUCTURAL ANALOGY with model-family limits (T-RULES-GEOMETRY)',
    'rules constrain a geometry of allowed states (T-RULES-GEOMETRY, open); the two roles of c (T-C-ROLES)', '—', 'transfer of the invariant role to arbitrary model-manifold geometry is OPEN; diag(1, 0) is not by itself the Newtonian metric; the general phrase is too weak',
    OC, cards=['MMPm', 'MMIi', 'C9a', 'C9b', 'MMIg', 'MMPl', 'CFT5f'], registry=['T-RULES-GEOMETRY', 'T-C-ROLES', 'T-MM-DISTINGUISHED-Q'], sources=['SRC-QUINN-2023', 'SRC-INONU-WIGNER-1953'])
row('quantum-like', 'Quantum-like possibility space', 'a state space (density matrices on ℂ⁴ for two spins) and an observable; the S_z = 0 eigenspace is 2-dimensional, so a zero value does not fix the state (Q1a–Q1d)',
    'Q1a, Q1c, Q1d, Q2b (established quantum mechanics)', 'same zero ↔ observationally indistinguishable parameters: STRUCTURAL ANALOGUE / OPEN CONNECTION (no explicit map between the two)', '—',
    'a richer state becoming an observable manifestation (T-VIEWER-FORM, normalized question)', 'an explicit map showing the two indistinguishabilities differ in kind (would bound the analogue)',
    PQ, cards=['Q1a', 'Q1c', 'Q1d', 'Q2b'], registry=['T-QUANTUM-ZERO', 'T-VIEWER-FORM'], sources=['SRC-SAKURAI-2017'])
row('measurement-reduction', 'Measurement / reduction', 'the Reduction / Information-Changing Architecture (RI0): for each map, what survives, collapses, becomes zero, is lost, is reconstructible, the fibers, symmetry. The maps are different operations (MMPo)', 'RIC1a–RIC1d, W2a, W3a, MMPo (instances)',
    'model-manifold boundaries join as limits (MMIg), the named S² channel as a map (W2a, MMPn)', 'transform vs reduce governs the project (T-TRANSFORM-REDUCE, open); whether the operations share a deeper pattern (open)', 'measurement as reduction (T-MM-OBSERVE)', 'a reduction where the seven questions cannot be posed',
    PDC, cards=['RIC1a', 'W2a', 'MMIg', 'MMPo'], registry=['T-REDUCTION-ARCH', 'T-TRANSFORM-REDUCE'])
row('information-distinguishability', 'Information loss / distinguishability', 'for fixed positive-definite Σ⁻¹: Fisher length = local distinguishability per unit noise (MMId); fibers Y⁻¹(y) = parameters with identical predictions; information distinctions below', 'Rao 1945; Amari 2016; FB7b; MMId; MMPd',
    'geometry encodes accessible / inaccessible / indistinguishable information (T-GEOM-INFO-Q, open)', '—', 'what the geometry says about distinguishability in quantum measurement (open)', 'two parameter values with zero Fisher distance but distinguishable predictions (impossible locally for positive-definite fixed Σ⁻¹)',
    EM, cards=['MMId', 'FB7b', 'FB7a', 'MMPd'], registry=['T-GEOM-INFO-Q'], sources=['SRC-RAO-1945', 'SRC-AMARI-2016'])
row('representations-aspects', 'Representations expose different aspects', 'charts, noise metrics, embeddings: what changes (entries, det, √det g alone, raw Fisher / Hessian eigenvalues, condition number, singular values, chart-defined widths) and what stays under charts (rank, nullity for fixed positive-definite Σ⁻¹, length, the volume element, curvature, image-defined quantities)',
    'Lee 2018 (tensor law); MMIa–MMId; MMPc, MMPf–MMPh', 'arrow 2 of the story (T-MM-STORY)', '—', '—', 'a "geometric" claim that rests on a chart-dependent number (MMIb, MMPg show how it fails)',
    PDC, cards=['MMIa', 'MMIb', 'MMIc', 'MMId', 'MMPc', 'MMPf', 'MMPg', 'MMPh'], registry=['T-MM-STORY'], sources=['SRC-LEE-2018'])
row('raw-spectrum-c7', 'Raw FIM eigenvalue spectrum as C7\'s object', 'eigenvalues of the component matrix g in one chart', 'CFT5e, MMIb (not invariant)', 'C7 compared coefficient decay with this spectrum (BR28)', '—', '—',
    'already failed as a geometric object: it changes with units and charts', NEG, cards=['MMIb', 'CFT5e'], registry=['T-C7'])
assert len(ROWS) >= 15

# ── invariance table ────────────────────────────────────────────────────────────────────────────
ICOLS = ['Quantity', 'Definition', 'Coordinate invariant?', 'Embedding dependent?', 'Model dependent?', 'Noise-model dependent?', 'Reduction dependent?', 'Source', 'Failure example', 'C7 relevance']
INV = []
def inv(q, d, coord, emb, model, noise, red, source, fail, c7, *, invariant, cards=(), group=None):
    assert invariant in ('yes', 'no', 'conditional'), q
    INV.append(dict(quantity=q, definition=d, coordinateInvariant=coord, embedding=emb, model=model, noise=noise, reduction=red, source=source, failure=fail, c7=c7,
                    invariant=invariant, cards=list(cards), group=group))
Y_EMB = 'yes: the pullback of the prediction-space metric; changes with the outputs (sampling points) and their metric'
PD_NOISE = 'no for a change between fixed positive-definite weights (MMIe, MMPe); can change with a singular weight (MMPd) or a θ-dependent noise law (MMPe)'
inv('Fisher metric tensor', 'g as a (0,2)-tensor on Θ; component matrix g_θ = J_Yᵀ Σ⁻¹ J_Y (J_Y = ∂Y/∂θ, fixed Σ)', 'YES as a tensor; its component matrix changes: g_φ = Aᵀ g_θ A with A = ∂θ/∂φ (MMPc)', Y_EMB, 'yes', 'yes (Σ)', 'yes: on a boundary it is the boundary model\'s metric (rank drops)',
    'Rao 1945; Amari 2016; Lee 2018; FB6a, CFT4c, MMPc', '"g is unchanged" under reparametrization is false for components (CFT4c, MMPc)', 'not itself C7\'s object', invariant='yes', cards=['FB6a', 'CFT4c', 'MMPc'], group='tensor')
inv('Matrix entries g_ij', 'components of g in a chart', 'NO', Y_EMB, 'yes', 'yes', 'yes', 'CFT4c; MMIb; MMPc', 'θ = diag(1, 10)θ′ rescales the entries (MMIb)', 'not an object for C7', invariant='no', cards=['MMIb', 'CFT4c', 'MMPc'], group='proxy')
inv('Rank', 'rank g = rank J_Y (positive-definite Σ⁻¹)', 'YES under invertible reparametrizations', 'yes: too few outputs can lower it', 'yes', PD_NOISE, 'yes: drops on a boundary (MMIg)', 'MMIa; CFT5d; MMIe; MMPe', 'a singular (non-invertible) chart change can lower it; a θ-dependent noise law can raise it (MMPe)', 'the dimension of the regular part of the image', invariant='yes', cards=['MMIa', 'CFT5d', 'MMIe', 'MMPe', 'MMIg'], group='tensor')
inv('Nullity / null directions', 'ker g = ker J_Y for positive-definite fixed Σ⁻¹ (tangent vectors; they transform by A⁻¹)', 'YES (as tangent vectors)', 'yes', 'yes', PD_NOISE, 'yes', 'FB7b; CFT5d; MMIe; MMPd; MMPe', 'a singular weight adds nulls (MMPd); a θ-dependent covariance can remove them (MMPe)', 'a null is a zero-width direction at a point', invariant='yes', cards=['FB7b', 'CFT5d', 'MMIe', 'MMPd', 'MMPe'], group='tensor')
inv('Raw eigenvalues', 'eigenvalues of the component matrix g', 'NO', 'yes', 'yes', 'yes', 'yes', 'CFT5e; MMIb', 'F-C at θ = (1, 6/5): 0.001285, 0.36 → 0.003487, 13.26 under θ = diag(1, 10)θ′ (MMIb)', 'NEGATIVE: not C7\'s object', invariant='no', cards=['MMIb', 'CFT5e'], group='proxy')
inv('Raw Hessian eigenvalues', 'eigenvalues of the cost Hessian ∂²C/∂θ² in a chart', 'NO: off a critical point the Hessian matrix does not even transform as a tensor (H_λ = Aᵀ H_θ A + diag(θᵢ ∂C/∂θᵢ), MMPh)', 'yes', 'yes', 'yes', 'yes', 'MMPh', 'F-C at θ = (1, 3): the extra term is nonzero (MMPh)', 'a chart proxy, not C7\'s object', invariant='no', cards=['MMPh'], group='proxy')
inv('Condition number', 'λ_max / λ_min of the component matrix', 'NO', 'yes', 'yes', 'yes', 'yes', 'MMIb', 'moves under a change of units (MMIb)', 'not an object for C7', invariant='no', cards=['MMIb'], group='proxy')
inv('Determinant', 'det g', 'NO: det g_φ = (det A)² det g_θ', 'yes', 'yes', 'yes', 'yes: 0 on a rank drop', 'MMIa; MMPf', 'any chart with det A ≠ ±1', 'not an object for C7', invariant='no', cards=['MMIa', 'MMPf'], group='proxy')
inv('√det g alone', 'the density √det g without its coordinate differentials', 'NO: it scales by |det A| (MMPf)', 'yes', 'yes', 'yes', 'yes', 'MMPf', 'F-C at θ = (1, 3): 0.0137649 in θ vs 0.0412947 in log θ (MMPf)', 'not an object for C7', invariant='no', cards=['MMPf'], group='proxy')
inv('Volume element', 'the full element √det g_θ dθ¹⋯dθⁿ', 'YES (change of variables: √det g_φ dφ¹⋯dφⁿ is the same element)', 'yes', 'yes', 'yes', 'yes: degenerates on a boundary', 'MMIa; MMPf; Amari 2016', 'total volume may be infinite (unbounded Θ)', 'related to widths only heuristically; not carded', invariant='yes', cards=['MMIa', 'MMPf'], group='tensor')
inv('Geodesic / curve length', '∫√(θ′ᵀ g_θ θ′) ds', 'YES', 'yes: equals the arc length of the image curve in P (MMId)', 'yes', 'yes', 'yes', 'MMId; Lee 2018', 'the same curve has another length under another noise model (MMIf)', 'width notions are built from lengths: relevant', invariant='yes', cards=['MMId', 'MMIf'], group='tensor')
inv('Curvature', 'Gaussian curvature K of the induced metric on a regular region (intrinsic); extrinsic curvature of the image in P', 'YES (K is a scalar invariant)', 'intrinsic K: no beyond g; extrinsic curvature: yes', 'yes', 'yes', 'yes', 'CFT5f; Lee 2018; TMS 2011 (curvature small relative to widths, source-only)', 'F-C: K(1, 2) = −0.8877, K(1, 3) = −1.155 (varies; CFT5f)', 'background for widths (source-only)', invariant='yes', cards=['CFT5f'], group='tensor')
inv('Jacobian singular values', 'singular values of J_Y (= √eig(J_Yᵀ J_Y) in a Euclidean chart)', 'NO', 'yes', 'yes', 'yes', 'yes', 'MMIc', 'θ vs log θ vs Σ = diag(1, 2, 3) give three different sets (MMIc)', 'not C7\'s object (same defect as raw eigenvalues)', invariant='no', cards=['MMIc'], group='proxy')
inv('Parameter-coordinate axis lengths', 'Euclidean extents along the axes of a chosen parameter chart', 'NO: a chart quantity by definition (Δθ = 1 on θ ∈ [1, 2] is Δλ = log 2 in λ = log θ)', 'no', 'no', 'no', 'yes', 'definition (chart quantity)', 'any rescaling of a coordinate', 'a chart proxy, not a width', invariant='no', cards=[], group='proxy')
inv('Widths along a chart\'s FIM eigendirections', 'extents measured from a point along the eigenvectors of the component matrix g in a chosen chart', 'NO: the eigendirections, pushed to prediction space, rotate with the chart (0.626° for log θ, 4.43° for a change of units at θ = (1, 6/5), MMPg)', 'yes', 'yes', 'yes', 'yes', 'MMPg', 'MMPg', 'must not be used as C7\'s width object', invariant='no', cards=['MMPg'], group='proxy')
inv('Geometric widths: Transtrum-style geodesic widths', 'widths of the image measured along geodesics in prediction space (TMS 2011; definition to be taken from the source text)', 'CONDITIONAL: potentially YES if the start point and directions are fixed geometrically in prediction space; NO if the directions are a chart\'s FIM eigendirections (MMPg)', 'YES: depends on the prediction metric and the outputs', 'yes', 'yes', 'yes: a boundary face has fewer widths', 'SRC-TMS-2011 (snippet-level); MMPg; MMId', 'a direction choice taken from a chart (MMPg)', 'candidate C7 width object (kept)', invariant='conditional', cards=['MMPg', 'MMId'], group='geometric')
inv('Geometric widths: Quinn-style enclosing-hyperellipsoid widths', 'widths of a hyperellipsoid enclosing the image, bounded through Chebyshev approximation (Quinn et al. 2019; definition to be taken from the source text)', 'CONDITIONAL: potentially YES (built from the image set in P with a fixed metric); to be confirmed from the source definition', 'YES: depends on the prediction metric, the outputs and the input interval', 'yes', 'yes', 'yes', 'SRC-QUINN-2019 (abstract-level)', 'not carded', 'candidate C7 width object (kept)', invariant='conditional', cards=[], group='geometric')
inv('Total length of a 1-D model image', 'arc length of the curve Y(Θ) in P (the only width of a 1-D image)', 'YES (a property of the image set; θ, log θ and e^{−θ} charts agree, MMIf)', 'YES: 1.863 → 3.935 under the metric diag(1, 4, 9) (MMIf)', 'yes', 'yes', 'yes', 'MMIf', 'none for charts; the metric changes it', 'illustrates the geometric category in 1-D only', invariant='yes', cards=['MMIf'], group='geometric')
inv('Sloppy hierarchy', 'the pattern of decay of stiffness / width', 'NO as a raw eigenvalue pattern; potentially YES only when restated with a geometric width object', 'yes', 'yes', 'yes', 'yes', 'Gutenkunst 2007; S14b (weak); S14a FAIL kept', 'S14a: span 3.1 decades, threshold 4 (FAIL kept)', 'restate with a geometric width object before comparing', invariant='no', cards=['S14b', 'S14a', 'MMIb'], group='proxy')
inv('Parameter-domain boundary ∂Θ (as finite points)', 'boundary points of Θ in a chosen chart', 'NO: θ₂ = 0 is finite in θ, at λ₂ → −∞ in log θ (MMPi)', 'no', 'yes', 'no', '—', 'MMPi', 'MMPi', 'not a boundary of the image by itself', invariant='no', cards=['MMPi'], group='boundary')
inv('Image of a specified limit', 'lim Y(θ(r)) in P for a stated limiting family', 'YES (the limit set; the approach rate is chart-dependent)', 'yes (as a subset of P)', 'yes', 'the set: no; its metric: yes', 'it is the reduced model', 'MMIg; MMPi; FB11c', 'different limits give different images (a face, a point, none: MMPl)', 'widths shrink toward faces (source-only)', invariant='yes', cards=['MMIg', 'MMPi', 'MMPl'], group='boundary')
inv('Limiting boundary stratum (MBAM sense)', 'a lower-dimensional limiting model family in P reached as parameters approach appropriate limits', 'CONDITIONAL: a property of the image family once defined; MBAM\'s geodesic procedure is source-only', 'yes', 'yes', 'the set: no; its metric: yes', 'it is the reduction', 'Transtrum–Qiu 2014 (source-only); MMIg; FB11c', 'not every parameter-domain boundary gives one (MMPi)', 'background for widths', invariant='conditional', cards=['MMIg', 'FB11c'], group='boundary')
inv('Topological boundary of Y(Θ) in P', 'closure minus interior of the image set in P', 'YES (a set property), but for dim M < dim P it is the whole closure (MMPi): not the MBAM boundary', 'yes', 'yes', 'no', 'yes', 'MMPi; MMPj', 'uninformative for lower-dimensional images; an image edge can come from interior parameter points (MMPj)', 'not C7\'s object', invariant='yes', cards=['MMPi', 'MMPj'], group='boundary')
inv('Generalized eigenvalues of (g, h)', 'eig(h⁻¹g) for a second tensor h', 'YES if h is a tensor', 'depends on h', 'yes', 'yes', 'yes', 'MMIb', 'h = I in every chart is not a tensor; the result then changes', 'an invariant spectrum only with a system-supplied h (none supplied)', invariant='yes', cards=['MMIb'], group='tensor')
assert len(INV) >= 14
SUPERSEDED_INV = [
 dict(quantity='Hyperribbon widths', coordinateInvariant='YES (a property of the image set)', invariant='yes', date='2026-11-13', supersededOn=PREC,
      supersededBy=['Geometric widths: Transtrum-style geodesic widths', 'Geometric widths: Quinn-style enclosing-hyperellipsoid widths', 'Widths along a chart\'s FIM eigendirections', 'Total length of a 1-D model image'],
      reason='overstated: only widths defined from the image set with a fixed prediction metric are candidates for invariance; widths along chart FIM eigendirections are chart-dependent (MMPg); exact definitions not yet taken from the sources'),
 dict(quantity='Model-manifold boundary structure', coordinateInvariant='YES (the limit set; the approach rate is chart-dependent)', invariant='yes', date='2026-11-13', supersededOn=PREC,
      supersededBy=['Parameter-domain boundary ∂Θ (as finite points)', 'Image of a specified limit', 'Limiting boundary stratum (MBAM sense)', 'Topological boundary of Y(Θ) in P'],
      reason='merged five different objects ("the faces lim Y(θ) as θ → ∂Θ"); they are not automatically identical (MMPi, MMPj, MMPl)'),
]

# ── information distinctions ────────────────────────────────────────────────────────────────────
INFO = [
 dict(term='Shannon information', object='entropy H(p) = −Σ p log p of an outcome distribution (mutual information between variables)', geometry='not a metric on parameters; not carded', cards=[], notSame='Fisher information'),
 dict(term='Fisher information', object='g = E[∂ℓ ∂ℓᵀ]; = J_Yᵀ Σ⁻¹ J_Y for Gaussian noise with fixed Σ (a θ-dependent covariance adds terms, MMPe)', geometry='the induced metric of the image on regular regions; chart covariance R1 (MMPc)', cards=['FB6a', 'FB6b', 'MMIa', 'MMPe'], notSame='Shannon entropy; identifiability (global)'),
 dict(term='parameter identifiability', object='injectivity of Y on Θ (global); rank J_Y = dim Θ (local, first order)', geometry='fibers Y⁻¹(y); null directions g(v, v) = 0 (positive-definite fixed Σ⁻¹)', cards=['FB7a', 'FB7b', 'MMPb'], notSame='sloppiness (identifiable but poorly constrained)'),
 dict(term='prediction sensitivity', object='J_Y = ∂Y/∂θ', geometry='chart-dependent components and singular values (MMIc); its kernel is invariant', cards=['MMIc'], notSame='distinguishability (needs the noise metric)'),
 dict(term='observable distinguishability', object='distance in P per unit noise; locally the Fisher length (MMId)', geometry='lengths (chart-independent, noise-dependent); geometric widths when defined from the image', cards=['MMId', 'MMIf'], notSame='identifiability (zero distance only along nulls)'),
 dict(term='reconstruction information', object='what Φ(x) determines about x under stated assumptions (fibers Φ⁻¹(y))', geometry='Reduction architecture (IC questions)', cards=['G3b', 'G4c', 'RIC1a'], notSame='Fisher information (local, parametric)'),
 dict(term='phase information', object='what |x̂| discards: equal power spectra, different signals', geometry='fibers of x ↦ |x̂| (not a subspace)', cards=['P1c', 'FB1d'], notSame='Fisher information of a phase parameter'),
 dict(term='quantum information', object='density matrices; coherences ⟨A|ρ|B⟩; what a named measurement removes or makes available (MMPn)', geometry='not the Fisher metric of this audit; quantum Fisher information is not carded', cards=['W2a', 'W2b', 'Q1c', 'MMPn'], notSame='classical identifiability'),
]

SPINE = [
 ('OBJECT', 'a model rule Y: Θ → P with parameter domain Θ and a noise model Σ'),
 ('REPRESENTATION', 'a parameterization θ of the model image (local coordinates only on regular identifiable regions); the prediction space P (ℝᵐ or L²) with metric Σ⁻¹'),
 ('RELATION', 'the Fisher metric g_θ = J_Yᵀ Σ⁻¹ J_Y (pullback of the prediction metric)'),
 ('ZERO / BALANCE / NULL', 'for positive-definite fixed Σ⁻¹: g(v, v) = 0 ⟺ J_Y v = 0 (first-order non-identifiability, FB7b, MMPd); rank drop at a limit in the F-C example (MMIg)'),
 ('TRANSFORMATION', 'R1 reparametrizations g_φ = Aᵀ g_θ A (MMPc); R2 isometries only when supplied (CFT5a, CFT4d); a change of noise model changes the metric (not R1, MMIe, MMPe); a boundary limit is a family degeneration, not a map'),
 ('PRESERVED STRUCTURE', 'under charts: rank, nullity, null directions, lengths, the volume element, curvature, image-defined quantities. Not preserved: entries, det, √det g alone, raw Fisher / Hessian eigenvalues, condition number, singular values, chart-defined widths'),
 ('GEOMETRY', 'the model image in P with its induced metric on regular regions; width hierarchy (definition open); limiting strata; curvature (not homogeneous, CFT5f)'),
 ('INFORMATION', 'Fisher information (local distinguishability per unit noise); identifiability (fibers of Y)'),
 ('DYNAMICS / CONTINUATION', 'geodesics to boundaries (MBAM, source-only); the c → ∞ degenerate limiting form (C9b, MMPm)'),
 ('CROSS-SYSTEM TRANSFER', 'c (theory family) ↔ model-parameter limits (STRUCTURAL ANALOGY; transfer OPEN); same-zero quantum ↔ indistinguishable parameters (STRUCTURAL ANALOGY / OPEN); C7 (OPEN; preconditions)'),
 ('APPLICATION', 'none (Energeo not begun)'),
]

MANIFEST = [
 dict(term='mathematical manifestation', meaning='the image Φ(x) of a stated map, or the boundary model reached by a stated limit', status=EM, example='Pₙx (RIC1a); e^{−θ₁t} as the θ₂ → ∞ face of F-C (MMIg)', cards=['RIC1a', 'MMIg']),
 dict(term='observable manifestation', meaning='what a stated measurement returns: outcomes and the post-measurement state', status=EM, example='after the non-selective S² measurement on |ud⟩: outcomes 2ħ² and 0, triplet–singlet coherence gone (W2a, W2b, MMPn)', cards=['W2a', 'W2b', 'MMPn']),
 dict(term='physical manifestation', meaning='physical coming-into-form, the subject of the historical intuition', status=PQ, example='none: needs physical theory or data (T-PHYSICAL-MANIFEST-Q, T-VIEWER-FORM)', cards=[]),
]
TRANSFORM = dict(R1='reparametrizations (charts): g_φ = Aᵀ g_θ A with A = ∂θ/∂φ; rank, nullity, lengths, the volume element, curvature and image-defined quantities invariant (MMIa–MMId, MMPc, MMPf, CFT4c)',
                 R2='isometries F*g = g only when the system supplies them (F-C exchange CFT5a; location–scale CFT4d); none in general (CFT5f)',
                 R3='none claimed: no operator compatibility is carded for model manifolds in this audit',
                 outside='a change of noise model Σ changes the metric itself (MMIe), and a θ-dependent noise law adds Fisher terms (MMPe): not R1, R2 or R3; a boundary limit is a family degeneration (Reduction architecture), not a transformation')

# ── c: three roles (2026-11-15); the 2026-11-13 verdict is kept as history ────────────────────
C_VERDICT = dict(date=PREC, registry='T-RULES-GEOMETRY',
 roles=[
  dict(role='Role 1 — representation/coefficient role', statement='in the matrix representation η_c = diag(1, −1/c²) on (t, x), a finite nonzero c can be normalized: η_c = P_cᵀ diag(1, −1) P_c with P_c = diag(1, 1/c) (a rescaling of x)',
       status='ESTABLISHED for the stated form', cards=['MMIi', 'MMPm'], note='a statement about a representation; it does not prove that physical c has no invariant significance'),
  dict(role='Role 2 — invariant geometric/physical role', statement='in Lorentzian spacetime c participates in the invariant relationship between temporal and spatial structure and in the causal / light-cone structure: Λ_cᵀ η_c Λ_c = η_c',
       status='ESTABLISHED PHYSICS in its native setting', cards=['C9a', 'S5c'], note='not claimed to have transferred to arbitrary model manifolds; kept as the original comparison being investigated'),
  dict(role='Role 3 — theory-family / singular-limit role', statement='varying c between theories, c → ∞ is a singular theory limit: η_c → diag(1, 0), a degenerate limiting bilinear form (rank 1, zero on every purely spatial displacement); no change of representation within one finite-c form reaches it; the boost generator contracts to a shear',
       status='STRUCTURAL ANALOGY worth preserving', cards=['C9b', 'C9c', 'C9d', 'MMPm'], note='diag(1, 0) is not by itself "the Newtonian metric": Galilean / Newton–Cartan structure requires more than this rank-one limit. Model-side comparison: in F-C, θ₂ → ∞ gives a 1-dimensional face; that dimension drop is a result of the specific example (MMPl)'),
  dict(role='Transfer to arbitrary model-manifold geometry', statement='whether Role 2 or Role 3 has a counterpart for model parameters in general', status='OPEN', cards=['CFT5f', 'MMPl'],
       note='a generic model image is not homogeneous (CFT5f); parameter limits differ by model and limit (MMPl)'),
  dict(role='Universal "rules constrain states" interpretation', statement='every constraint restricts a set of allowed states', status='TOO WEAK by itself', cards=[], note='it distinguishes nothing without a stated invariant or limit'),
 ],
 history=[dict(date='2026-11-13', verdict='STRUCTURAL CONNECTION', scope='the parameter-limit → degenerate-boundary role only',
               parts=[dict(role='a parameter limit is a degenerate boundary (rank drop)', verdict='STRUCTURAL CONNECTION'),
                      dict(role='c as the invariant of a form (structure constant)', verdict='FAIL', note='"for finite c, c is absorbed by a change of units (R1): the invariant is the signature"'),
                      dict(role='"rules constrain allowed states", stated generally', verdict='TOO WEAK')],
               supersededOn=PREC, reason='collapsed distinct roles of c: a representation-level normalization (Role 1) was read as removing the invariant role (Role 2); the rank-drop comparison generalized one example (MMPl)')])

NULLS = [
 dict(kind='local non-identifiability', law='J_Y v = 0 (first-order predictions unchanged along v)', cards=['FB7a', 'MMPb']),
 dict(kind='zero Fisher length', law='g(v, v) = (J_Y v)ᵀ Σ⁻¹ (J_Y v) = 0; equivalent to J_Y v = 0 exactly when Σ⁻¹ is positive definite and fixed (MMPd, MMPe)', cards=['FB7b', 'MMPd', 'MMPe']),
 dict(kind='sloppy direction (not a null)', law='g(v, v) > 0 but small relative to other directions in a stated chart', cards=['FB7c']),
 dict(kind='Lorentz null', law='vᵀηv = 0 with ηv ≠ 0 (indefinite form)', cards=['FB7d']),
 dict(kind='bilinear-form null', law='B(u, v) = 0 for nonzero u, v (orthogonality)', cards=['TRA2a']),
 dict(kind='collapsed zero', law='Φ(x) = 0 with x ≠ 0 for a non-injective Φ', cards=['RIC1a', 'RIC2c']),
 dict(kind='equal expectation values', law='⟨O⟩_ρ = ⟨O⟩_σ with ρ ≠ σ', cards=['W3a', 'W2c']),
 dict(kind='same-zero quantum example', law='S_z ψ = 0 on a 2-dimensional eigenspace: the zero value does not fix the state', cards=['Q1c', 'Q1d']),
 dict(kind='symmetry-dependent distinction', law='states sharing a zero separated by an independently supplied symmetry (exchange parity; S₄ sectors), never one chosen after the conclusion', cards=['Q2d', 'FS2b']),
]
NULL_RULE = 'No one type of nullity is universal. A symmetry enters only if the system supplies it independently (B-INDEPENDENT-SYMMETRY).'

QCHANNEL = dict(name='non-selective projective measurement of total spin S²', map='D(ρ) = P_t ρ P_t + P_s ρ P_s', observable='S², with spectral projectors P_t (triplet) and P_s (singlet)',
                preState='ρ = |ud⟩⟨ud|, |ud⟩ = (|1,0⟩ + |0,0⟩)/√2 (S_z = 0)',
                removed='the off-diagonal terms ⟨1,0|ρ|0,0⟩ = ⟨0,0|ρ|1,0⟩ = 1/2: the coherence between the triplet and singlet eigenspaces',
                preserved='S_z = 0, because [P_t, S_z] = [P_s, S_z] = 0 and S_z ρ = 0 give S_z D(ρ) = 0',
                counterexample='the non-selective S_x⁽¹⁾ measurement on the same state gives Tr(S_z E(ρ)) = −ħ/2: preservation is not generic',
                generic='A non-selective projective measurement in a specified basis removes coherence between the measured eigenspaces. Preservation of a quantity such as S_z requires the relevant state/channel/observable relation to be checked explicitly.',
                cards=['W1d', 'W2a', 'W2b', 'MMPn'])
OBS_OPS = [
 dict(op='quantum measurement', object='a channel on density matrices (D(ρ) = Σₖ PₖρPₖ for a named observable)', property='idempotent; not induced by any map on state vectors (purity 1 → 1/2)', cards=['MMPn', 'MMPo', 'W2a']),
 dict(op='projection', object='a linear map on vectors (Pₙ = I − 11ᵀ/n)', property='idempotent; fibers x + ker Pₙ', cards=['RIC1a', 'MMPo']),
 dict(op='marginalization', object='a linear map from joint distributions to marginals (a different space)', property='many-to-one (different joints, equal marginals)', cards=['MMPo']),
 dict(op='quotient / reduction', object='the map to equivalence classes (fibers Φ⁻¹(y))', property='defined by its fibers', cards=['RIC1a', 'RIC1b']),
 dict(op='manifold boundary limit', object='a limit of a model family, not a map on states', property='the image of a stated limit; depends on the model and the limit', cards=['MMIg', 'MMPi', 'MMPl']),
 dict(op='coarse graining', object='a map on couplings (decimation: tanh K′ = tanh²K)', property='not idempotent', cards=['FB11d', 'MMPo']),
 dict(op='parameter non-identifiability', object='a property of Y: fibers Y⁻¹(y) in parameter space', property='not an operation at all', cards=['FB7a', 'MMPb']),
]
OBS_RULE = dict(open='The open research question is whether they share a deeper structural pattern.', established='It is NOT established that they are the same operation.')

# ── C7: preconditions (2026-11-15); the 2026-11-13 recommendation is kept as history ──────────
C7 = dict(status='OPEN', readiness='NOT READY FOR DERIVATION', uniqueDefinitionChosen=False, registry='T-C7',
          requirement='C7 requires an explicitly defined geometric width object before any invariant spectral-decay claim can be evaluated.',
          notJust='C7 is not "hyperribbon widths exist": that is established literature (TMS 2010/2011; Quinn et al. 2019).',
          candidateBridge='Fourier / spectral / coefficient decay ?⟹ coordinate-independent geometric width hierarchy',
          possibleChain='Fourier/spectral decay → approximation/coefficient decay → Quinn-style width bounds', chainStatus='NOT ESTABLISHED',
          widthCandidates=[w['name'] for w in WIDTHS['geometric']],
          keepBoth='Keep both Transtrum-style and Quinn-style width notions available until the next construction pass determines which one the proposed bridge can actually reach.',
          outcomes=['an exact theorem', 'a bound', 'an implication under explicit assumptions', 'an asymptotic correspondence', 'a counterexample showing spectral decay alone is insufficient'],
          preconditions=['the exact geometric width object', 'the prediction/noise metric', 'the class of models/functions', 'the exact spectral/coefficient-decay object',
                         'what the proposed result adds beyond Quinn et al. 2019 and existing approximation theory'],
          rejected=[dict(object=p['name'], why='a coordinate-dependent proxy') for p in WIDTHS['proxies']] + [dict(object='generalized eigenvalues of (g, h)', why='invariant, but needs a system-supplied reference tensor h; none is supplied')],
          history=[dict(date='2026-11-13', recommendation='hyperribbon widths', note='one recommended target object, with gates', supersededOn=PREC,
                        reason='a single width object was named before its definition was fixed, and widths were stated as parametrization-independent without separating geometric widths from chart proxies (MMPg)')])

NEGATIVE = [
 dict(result='raw FIM eigenvalues, condition number, determinant and Jacobian singular values are not coordinate invariants', cards=['MMIb', 'MMIc', 'MMIa', 'CFT5e'], status='stands'),
 dict(result='C7 read as "coefficient decay vs raw Fisher eigenvalue decay" compares a chart-dependent number', cards=['MMIb', 'CFT5e'], status='stands'),
 dict(result='the invariant-form role of c does not transfer to model parameters', cards=['MMIi'], status='revised 2026-11-15',
      revision='withdrawn as too strong: MMIi shows a representation-level normalization only. What stands: no representation change reaches the c → ∞ form (MMPm) and a generic model image is not homogeneous (CFT5f). The transfer is OPEN'),
 dict(result='"rules constrain allowed states" stated generally is too weak to test', cards=[], status='stands'),
 dict(result='a generic model manifold is not homogeneous: no group orbit plays the role of the Lorentz allowed set', cards=['CFT5f', 'MMIi'], status='stands'),
 dict(result='a function-space prediction space does not make M infinite-dimensional', cards=['MMIh', 'MMPk'], status='stands'),
 dict(result='a boundary limit is not a map on states: the Reduction architecture records it as a family degeneration', cards=['MMIg', 'MMPo'], status='stands'),
 dict(result='no single construction of "observation" covers quantum dephasing, projection and boundary limits', cards=['W2a', 'RIC1a', 'MMIg', 'MMPo'], status='stands'),
 dict(result='S14a stays FAIL (span 3.1 decades, threshold 4)', cards=['S14a'], status='stands'),
 dict(result='widths taken along a chart\'s FIM eigendirections are chart-dependent', cards=['MMPg'], status='new 2026-11-15'),
 dict(result='the raw Hessian is not tensorial off a critical point; its eigenvalues are chart proxies', cards=['MMPh'], status='new 2026-11-15'),
 dict(result='zero Fisher length ≠ J_Y v = 0 without a positive-definite, θ-independent noise weight', cards=['MMPd', 'MMPe'], status='new 2026-11-15'),
 dict(result='a parameter → ∞ need not drop the dimension 2 → 1, nor give a boundary at all', cards=['MMPl'], status='new 2026-11-15'),
 dict(result='a parameter-domain boundary need not give an image boundary, and an image edge can come from interior parameter points', cards=['MMPi', 'MMPj'], status='new 2026-11-15'),
 dict(result='an immersion\'s image need not be a manifold (self-intersection); a rank drop can make a cusp', cards=['MMPa'], status='new 2026-11-15'),
]
RATINGS = [
 dict(dimension='Model-manifold established mathematics', bs=25, slop=5, td='TRIVIAL CONSEQUENCE', breadth=3, status=EM, why='definitions and textbook facts, carded on several model families (F-C, e^{−(θ₁+θ₂)t}, the one-exponential curve, the cusp and node, two function-space models), each under its stated hypothesis', history=[]),
 dict(dimension='Parameter / rule → allowable-manifold connection', bs=35, slop=5, td='TRIVIAL CONSEQUENCE', breadth=2, status=PDC, why='exact in the definitional sense M = Y(Θ); parameters are local coordinates only on regular identifiable regions; parameter limits give limiting strata, not "the boundaries"; adds the word "rules", not a theorem',
      history=[dict(date=PREC, fromBs=40, fromSlop=5, reason='the unpacking no longer includes the coordinate and boundary claims (MMPb, MMPi)')]),
 dict(dimension='Prediction-space / larger-space connection', bs=30, slop=20, td='NOT YET FORMALIZED', breadth=2, status=PH, why='the prediction space and its function-space form are exact (dim P = ∞, dim M = 2: MMIh, MMPk); the "larger possibility space" beyond P is a project frame', history=[]),
 dict(dimension='c / model-rule analogy', bs=20, slop=20, td='NOT YET FORMALIZED', breadth=2, status=OC, why='three roles of c kept apart: Role 1 established for the stated form, Role 2 established physics in its native setting, Role 3 a structural analogy with model-family limits; transfer to model-manifold geometry OPEN; the general phrase TOO WEAK',
      history=[dict(date=PREC, fromBs=25, fromSlop=20, fromTd='STRUCTURAL TRANSFER', reason='the 2026-11-13 verdict collapsed the roles of c and generalized one example; transfer is OPEN (MMPm, MMPl)')]),
 dict(dimension='Observation / reduction connection', bs=15, slop=35, td='NOT YET FORMALIZED', breadth=1, status=OC, why='exact for named maps (the S² channel on |ud⟩, MMPn; RIC1a; MMIg), which are different operations (MMPo); no construction covers "observation" as one class', history=[]),
 dict(dimension='Quantum-like manifestation hypothesis', bs=5, slop=55, td='NOT YET FORMALIZED', breadth=0, status=PQ, why='historical intuition (provenance only) and its investigable questions kept; no physical theory or data; conscious observer requirement = NOT ESTABLISHED', history=[]),
 dict(dimension='C7 readiness', bs=5, slop=30, td='NOT YET FORMALIZED', breadth=0, status=OC, why='NOT READY FOR DERIVATION: five preconditions open (width object, metric, model class, decay object, residue beyond Quinn 2019 and approximation theory); no derivation; the raw-spectrum reading is NEGATIVE',
      history=[dict(date=PREC, fromBs=10, fromSlop=30, reason='the single recommended width object is withdrawn; the width definition and four further preconditions are open')]),
]
SECTION_RATING = dict(dimension='Model-manifold section overall', bs=30, slop=10, td='NOT YET FORMALIZED', breadth=3, status=PDC,
                      why='mostly established mathematics, classified by the project under stated hypotheses (MMI, MMP cards across several model families); the cross-links (c, same-zero quantum, observation) stay STRUCTURAL ANALOGY or OPEN; no transfer is established; tests passing are not counted as support')
LOST = [
 'the story as one chain (prediction space → allowable family / model image → representation → manifestation → what survives), with a status per arrow',
 'the user-origin questions: infinite prediction space, rules → geometry of allowed states, the two roles of c, observation as manifestation, what is accessible vs indistinguishable',
 'the historical viewer intuition and its investigable questions (PHILOSOPHICAL / HISTORICAL, kept)',
 'the link to the zero programme: a zero length as non-identifiability (under its hypothesis); same-zero quantum states (STRUCTURAL ANALOGY)',
 'the link to the Transformation and Reduction architectures (R1 for charts; limits as degenerations; IC questions per map)',
 'C7 as a project question (the paper answers a neighbouring question, Chebyshev widths, not C7 as posed)',
]
DECISIONS = [
 'Add the PDFs (Quinn et al. 2023, Quinn et al. 2019, TMS 2010/2011, Transtrum–Qiu 2014) so the two width definitions, the MBAM boundary notion and the c-boundary claim can be quoted?',
 'Is the historical wording "matter does not form until a viewer looks at it." recoverable?',
 'For the next C7 construction pass: which model / function class (precondition 3) should the bridge be attempted on first?',
]
DECISIONS_ANSWERED = [
 dict(question='Adopt the c verdict (STRUCTURAL CONNECTION for the limit role; FAIL for the invariant-form role; TOO WEAK in general)?', answer='revised by Nadia, 2026-11-15: three roles of c; transfer OPEN; the general phrase too weak'),
 dict(question='Approve hyperribbon widths as C7\'s target object, and choose the width definition?', answer='Nadia, 2026-11-15: do not choose one width definition yet; keep both Transtrum-style and Quinn-style notions; record five preconditions'),
 dict(question='Should the restricted c connection get its own construction pass?', answer='not now: this pass is precision only (2026-11-15)'),
]

# ── corrections: old claim → corrected claim (2026-11-15) ─────────────────────────────────────
CORRECTIONS = [
 dict(topic='model image vs manifold', old='"The model manifold is M = Y(Θ) ⊆ P."', new='M = Y(Θ) ⊆ P is the model image / model set in general; it is a smooth model manifold on a regular region only (constant local rank, locally injective). Rank loss, non-identifiability, self-intersections, singular strata and boundary strata are possible.',
      reason='an immersion\'s image can self-intersect and a rank drop can make a cusp (MMPa); the F-C image has an edge from interior rank-drop points (MMPj)', status='ESTABLISHED MATHEMATICS', cards=['MMPa', 'MMPj'], supersedes=['MM1 equation', 'story row model-manifold']),
 dict(topic='parameters vs coordinates', old='"A parameter value is a coordinate on M." / "θ is a point coordinate."', new='θ ∈ Θ is a parameter value; Y(θ) is its prediction. Parameters parameterize the image and give local coordinates only where the parameterization is locally regular and locally identifiable; different parameter values may represent the same prediction.',
      reason='F-C: Y(1, 2) = Y(2, 1); rank 1 on the diagonal; e^{−(θ₁+θ₂)t} has rank 1 everywhere (MMPb)', status='ESTABLISHED MATHEMATICS', cards=['MMPb'], supersedes=['T-MM-RULES normalized statement', 'MM2 equation', 'master map Parameters bullets']),
 dict(topic='Fisher notation', old='g = JᵀΣ⁻¹J and g_φ = Jᵀ g J (one symbol J for two Jacobians)', new='J_Y = ∂Y/∂θ, g_θ = J_Yᵀ Σ⁻¹ J_Y; A = ∂θ/∂φ, g_φ = Aᵀ g_θ A. The tensor is one object; g_θ and g_φ are its component matrices.',
      reason='notation clash; the law itself was right (MMPc checks it directly)', status='ESTABLISHED MATHEMATICS', cards=['MMPc'], supersedes=['model-manifold records; CF13, BR41 and the Transformation Architecture keep J = ∂θ/∂φ with a notation note']),
 dict(topic='null directions', old='"g(v, v) = 0 ⟺ Jv = 0" (hypothesis not always attached)', new='g(v, v) = (J_Y v)ᵀ Σ⁻¹ (J_Y v); for positive-definite Σ⁻¹, g(v, v) = 0 ⟺ J_Y v = 0. Not for singular metrics or arbitrary observation models.',
      reason='a singular weight gives g(v, v) = 0 with J_Y v ≠ 0 (MMPd)', status='ESTABLISHED MATHEMATICS', cards=['MMPd'], supersedes=['MMIc wording ("the kernel is invariant")', 'null-directions row']),
 dict(topic='noise model', old='"Rank and null directions do not depend on the noise model."', new='For g = J_Yᵀ Σ⁻¹ J_Y with a fixed positive-definite Σ⁻¹: ker g = ker J_Y, rank g = rank J_Y; changing one positive-definite weighting to another does not change them. Not claimed for singular observation metrics, parameter-dependent covariances, or noise laws that add Fisher terms.',
      reason='y ~ N(e^{−(θ₁+θ₂)}, e^{θ₁}) has J_μ(1, −1) = 0 but g((1, −1), (1, −1)) = 1/2 (MMPe)', status='ESTABLISHED MATHEMATICS (restricted theorem) + caveat', cards=['MMPe', 'MMPd'], supersedes=['MMIe wording', 'MM4 equation', 'invariance summary line']),
 dict(topic='volume element', old='"√det g dθ is invariant" (density and element not separated)', new='The invariant object is the full element √det g_θ dθ¹⋯dθⁿ. det g and √det g alone change under reparametrization (by (det A)² and |det A|).',
      reason='√det g changes from 0.0137649 to 0.0412947 at one point while the volume of a region agrees in both charts (MMPf)', status='ESTABLISHED MATHEMATICS', cards=['MMPf'], supersedes=['MMIa wording', 'Volume element row']),
 dict(topic='widths', old='"Widths are invariant under reparametrization." / "Hyperribbon widths: parametrization-independent."', new='Geometric widths defined from the image set with a fixed prediction metric (Transtrum-style geodesic widths with geometrically fixed directions; Quinn-style enclosing-hyperellipsoid widths) may be reparametrization-invariant. Coordinate proxies (raw Fisher / Hessian eigenvalues, J_Y singular values, parameter-axis lengths, condition numbers, widths along a chart\'s FIM eigendirections) are not.',
      reason='FIM eigendirections rotate with the chart (MMPg); the exact width definitions have not been taken from the sources', status='ESTABLISHED MATHEMATICS (proxies); OPEN (exact geometric definitions)', cards=['MMPg', 'MMPh', 'MMIf'], supersedes=['MMIf wording ("Widths are parametrization-independent")', 'Hyperribbon widths row (invariance table)', 'MM11 equation']),
 dict(topic='boundary language', old='"The limits of the parameter domain are the boundaries of the model manifold."', new='Five objects are kept apart: ∂Θ; parameter limits; their images in P; limiting boundary strata (MBAM sense); the topological boundary of Y(Θ). A model-manifold boundary can arise as a limiting / degenerate model family in P; not every parameter-domain boundary gives one, and not every one is a finite boundary point in parameter coordinates.',
      reason='MMPi (chart-dependent finite points; a domain boundary mapping inside the image; empty interior in P); MMPj (an edge from interior points)', status='ESTABLISHED MATHEMATICS', cards=['MMPi', 'MMPj'], supersedes=['MM2 equation', 'Model-manifold boundary structure row', 'T-MM-RULES normalized statement']),
 dict(topic='function-space example', old='g_ij = 2/(θᵢ + θⱼ)³ stated beside "function-space prediction space"', new='g_ij = 2/(θᵢ + θⱼ)³ is the Fisher metric of the specific model e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞); dim P = ∞ while dim M = 2.',
      reason='θ₁e^{−T} + θ₂e^{−2T} in the same space has a constant metric (MMPk)', status='ESTABLISHED MATHEMATICS', cards=['MMPk', 'MMIh'], supersedes=['MMIh wording', 'T-PREDICTION-INFINITE note']),
 dict(topic='c verdict', old='"A finite c is just a change of units"; "FAIL for the invariant-form role"; "sending one model parameter to infinity drops dimension 2 → 1"', new='Three roles kept apart: Role 1 representation-level normalization (established for the stated form); Role 2 the Lorentzian invariant role (established physics in its native setting); Role 3 the theory-family singular limit (structural analogy worth preserving). Transfer to arbitrary model-manifold geometry: OPEN. The universal "rules constrain states" reading: too weak by itself. c → ∞ gives a degenerate limiting bilinear form, not by itself the Newtonian metric. The 2 → 1 drop is a result of the F-C example.',
      reason='MMIi checks a representation only; no representation change reaches diag(1, 0) (MMPm); dimension drops depend on the model and the limit (MMPl)', status='see the three-role verdict', cards=['MMPm', 'MMPl', 'MMIi', 'C9a', 'C9b'], supersedes=['MMIi wording', 'MM5 equation', 'BR60', 'T-RULES-GEOMETRY verdict (2026-11-13)', 'master map c verdict']),
 dict(topic='quantum measurement', old='"non-selective measurement keeps S_z = 0 and removes coherence between sectors" (stated generically)', new='The named channel D(ρ) = P_t ρ P_t + P_s ρ P_s (non-selective S² measurement) on |ud⟩ removes ⟨1,0|ρ|0,0⟩ = ⟨0,0|ρ|1,0⟩ = 1/2; S_z = 0 survives because [P_t, S_z] = [P_s, S_z] = 0 and S_z ρ = 0. Generic form: a non-selective projective measurement removes coherence between the measured eigenspaces; preservation of S_z must be checked.',
      reason='a non-selective S_x⁽¹⁾ measurement on the same state gives ⟨S_z⟩ = −ħ/2 (MMPn)', status='ESTABLISHED (quantum mechanics, the named channel)', cards=['MMPn', 'W2a', 'W2b'], supersedes=['story arrows (observation)', 'MM6 equation', 'BR61']),
 dict(topic='observation maps', old='observation, projection and boundary limits listed together as instances of one arrow', new='Quantum measurement, projection, marginalization, quotient / reduction, manifold boundary limits, coarse graining and parameter non-identifiability are different operations. Whether they share a deeper structural pattern is OPEN; it is NOT established that they are the same operation.',
      reason='they differ in what they act on and in idempotence (MMPo)', status='OPEN (the shared pattern)', cards=['MMPo'], supersedes=['story arrow 3 notes']),
 dict(topic='story arrow statuses', old='arrow statuses in the seven-class vocabulary only', new='every arrow also carries a status in ESTABLISHED MATHEMATICS / PROJECT-DERIVED / STRUCTURAL ANALOGY / OPEN / PHILOSOPHICAL / HISTORICAL INTUITION; cross-links and the viewer intuition included',
      reason='Nadia\'s precision decision (2026-11-15)', status='GOVERNANCE', cards=[], supersedes=[]),
 dict(topic='zero / null governance', old='five null kinds', new='nine kinds kept distinct: J_Y v = 0, zero Fisher length (equivalent only under its hypothesis), sloppy (not a null), Lorentz null, bilinear null, collapsed zero, equal expectations, same-zero quantum example, symmetry-dependent distinction (independently supplied symmetry only)',
      reason='no one type of nullity is universal', status='GOVERNANCE', cards=['MMPd', 'MMPe'], supersedes=['nulls table']),
 dict(topic='C7 target', old='"One recommendation: hyperribbon widths."', new='C7 requires an explicitly defined geometric width object; both Transtrum-style and Quinn-style notions are kept; five preconditions fixed before derivation. C7 is not "hyperribbon widths exist". T-C7 stays OPEN.',
      reason='a width object was named before its definition was fixed, and widths were called parametrization-independent without separating proxies (MMPg)', status='OPEN (NOT READY FOR DERIVATION)', cards=['MMPg', 'MMIf'], supersedes=['C7 section', 'MM11 role', 'M4 role', 'T-C7 note (2026-11-13)']),
]
MMI_SCOPE = [
 dict(card='MMIa', scope='its "volume element √det g |dθ| IS invariant" means the full element √det g_θ dθ¹⋯dθⁿ; √det g alone is not (MMPf)'),
 dict(card='MMIc', scope='"the kernel is invariant" holds for positive-definite weights (MMPd)'),
 dict(card='MMIe', scope='the null direction survives a change between fixed positive-definite weights; not a θ-dependent noise law (MMPe)'),
 dict(card='MMIf', scope='"Widths are parametrization-independent" holds for widths defined from the image set (here a 1-D total length); widths along chart FIM eigendirections are chart-dependent (MMPg)'),
 dict(card='MMIg', scope='"the dimension drops from 2 to 1" is a result of the F-C example and that limit (MMPl)'),
 dict(card='MMIh', scope='g_ij = 2/(θᵢ + θⱼ)³ is the metric of that specific model (MMPk)'),
 dict(card='MMIi', scope='"different finite c are related by a change of units (R1), so the invariant content is the signature" is a statement about the matrix representation (Role 1); it does not remove the invariant physical role of c (Role 2) (MMPm)'),
]

data = dict(about='Model-manifold invariance + research-story audit (2026-11-13), with the precision corrections of 2026-11-15. Generated by research/tools/model_manifold_source.py.',
            governance=dict(words='Do not audit away the research story. Audit the status of each connection.', registry='T-MM-GOV'),
            storyStatuses=STORY_STATUSES, arrowStatuses=ARROW_STATUSES, cVerdicts=C_VERDICTS, noveltyClasses=NOVELTY, separations=SEP, chains=CHAINS, crossLinks=CROSSLINKS, viewer=VIEWER,
            storyColumns=COLS, story=ROWS, invarianceColumns=ICOLS, invariance=INV, supersededInvariance=SUPERSEDED_INV, information=INFO, spine=[dict(stage=a, instance=b) for a, b in SPINE],
            notation=NOTATION, structure=STRUCTURE, parameters=PARAMS, nullTheorem=NULL_THM, noise=NOISE, volume=VOLUME, boundary=BOUNDARY, boundaryRules=BOUNDARY_RULES, functionSpace=FUNCSPACE,
            widths=WIDTHS, cVerdict=C_VERDICT, nulls=NULLS, nullRule=NULL_RULE, quantumChannel=QCHANNEL, observationOps=OBS_OPS, observationRule=OBS_RULE, c7=C7,
            negative=NEGATIVE, manifestation=MANIFEST, transformation=TRANSFORM, ratings=RATINGS, sectionRating=SECTION_RATING, lostIfPaperOnly=LOST, decisions=DECISIONS,
            decisionsAnswered=DECISIONS_ANSWERED, corrections=CORRECTIONS, mmiScope=MMI_SCOPE)
(ROOT / 'research/model_manifold.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')

cell = lambda x: '—' if x in (None, '', []) else str(x).replace('|', '\\|')
L = ['# Model-manifold research story', '',
     'Generated from `research/tools/model_manifold_source.py` (`research/model_manifold.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Model-manifold invariance + research-story audit" (2026-11-13) and "Model-manifold precision corrections" (2026-11-15). Cards: `verify/verify_MMI.py`, `verify/verify_MMP.py`.', '',
     '> Do not audit away the research story. Audit the status of each connection. (T-MM-GOV)', '',
     'The paper is not the thesis: a paper result does not prove the project interpretation, and the project interpretation is not paper novelty. Novelty classes: ' + '; '.join(NOVELTY) + '.', '',
     'Kept apart throughout: ' + '; '.join(SEP) + '.', '',
     'Row status classes (2026-11-13): ' + '; '.join(STORY_STATUSES) + '. Arrow status classes (2026-11-15): ' + '; '.join(ARROW_STATUSES) + '.', '',
     '## Precision corrections (2026-11-15)', '', 'Each overstated statement of 2026-11-13 is kept here with its correction. The MMI card outputs are unchanged; the MMP cards scope their wording.', '',
     '| Topic | Old claim (superseded) | Corrected claim | Reason | Status | Cards |', '|---|---|---|---|---|---|']
L += [f'| {c["topic"]} | {cell(c["old"])} | {cell(c["new"])} | {cell(c["reason"])} | {cell(c["status"])} | {cell(", ".join(c["cards"]))} |' for c in CORRECTIONS]
L += ['', 'Scope of the MMI card wording:', ''] + [f'- **{m["card"]}**: {m["scope"]}.' for m in MMI_SCOPE]
L += ['', '## The story, arrow by arrow', '']
for ch in CHAINS:
    L += [f'**{ch["id"]}** ({ch["registry"]}): "{ch["words"]}"', '', '| # | From | To | Status (2026-11-15) | Also | Row class (2026-11-13) | Exact object | Cards | Note |', '|---|---|---|---|---|---|---|---|---|']
    for i, a in enumerate(ch['arrows'], 1):
        L.append(f'| {i} | {cell(a["frm"])} | {cell(a["to"])} | {a["arrowStatus"]} | {cell(a["arrowAlso"])} | {a["status"]}{" / " + a["also"] if a["also"] else ""} | {cell(a["exact"])} | {cell(", ".join(a["cards"]))} | {cell(a["note"])} |')
    L.append('')
L += ['Cross-links (not arrows of the chain):', '', '| Link | Status | Cards | Note |', '|---|---|---|---|'] + [f'| {cell(x["link"])} | {x["arrowStatus"]} | {cell(", ".join(x["cards"]))} | {cell(x["note"])} |' for x in CROSSLINKS]
L += ['', '**Historical intuition** (' + VIEWER['registry'] + '): "' + VIEWER['words'] + '" Status: ' + VIEWER['arrowStatus'] + ' (' + VIEWER['status'] + '). Labels: ' + '; '.join(VIEWER['labels']) + '.', '',
      'Normalized question (kept beside it, not replacing it): "' + VIEWER['normalized'] + '"', '', 'Investigable forms: ' + ' '.join(f'"{q}"' for q in VIEWER['investigableForms']), '',
      VIEWER['conscious'] + '.', '', 'Investigable part: ' + VIEWER['investigable'] + '.', '',
      '## Model image, parameters, notation', '', f'- {STRUCTURE["image"]}; {STRUCTURE["manifold"]}.'] + [f'  - {p["kind"]}: {p["example"]} ({", ".join(p["cards"])})' for p in STRUCTURE['phenomena']]
L += [f'- {PARAMS["value"]}; {PARAMS["point"]}. Parameters: {PARAMS["role"]}; {PARAMS["many"]}. {PARAMS["project"][0].upper() + PARAMS["project"][1:]} (MMPb).',
      f'- Notation: {NOTATION["J_Y"]}; {NOTATION["A"]}; {NOTATION["g"]}; {NOTATION["law"]}. {NOTATION["tensor"]} (MMPc). Note: {NOTATION["older"]}.',
      f'- Null directions: {NULL_THM["statement"]}. Hypothesis: {NULL_THM["hypothesis"]}. Fails: ' + '; '.join(NULL_THM['fails']) + '.',
      f'- Noise model (restricted theorem): {NOISE["theorem"]} Not claimed for: ' + '; '.join(NOISE['caveats']) + '.',
      f'- Volume: the invariant object is {VOLUME["invariant"]}; not invariant: ' + ', '.join(VOLUME['notInvariant']) + ' (MMPf).',
      f'- Function-space example: {FUNCSPACE["formula"]} is {FUNCSPACE["scope"]}; {FUNCSPACE["other"]}. {FUNCSPACE["dims"]}. {FUNCSPACE["keep"]}', '',
      '## Boundary language', '', '| Notion | Object | Chart-dependent? | Example | Cards |', '|---|---|---|---|---|']
L += [f'| {b["notion"]} | {cell(b["object"])} | {"yes" if b["chartDependent"] else "no"} | {cell(b["example"])} | {", ".join(b["cards"])} |' for b in BOUNDARY]
L += [''] + [f'- {r}' for r in BOUNDARY_RULES]
L += ['', '## Widths', '', WIDTHS['rule'], '', '**A. Geometric widths (kept for C7):**'] + [f'- {w["name"]} ({w["source"]}): {w["definition"]}. Invariance: {w["invariance"]}.' for w in WIDTHS['geometric']]
L += [f'- Carded illustration: {WIDTHS["illustration"]["name"]}: {WIDTHS["illustration"]["status"]}.', '', '**B. Coordinate-dependent proxies (not invariant in general):**'] + [f'- {p["name"]}' + (f' ({", ".join(p["cards"])})' if p['cards'] else '') for p in WIDTHS['proxies']]
L += ['', '## Story table', '', '| ' + ' | '.join(COLS) + ' | Cards | Registry |', '|' + '---|' * (len(COLS) + 2)]
for r in ROWS:
    L.append('| ' + ' | '.join(cell(r[k]) for k in ('idea', 'object', 'established', 'connection', 'hypothesis', 'extension', 'falsify', 'status')) + f' | {cell(", ".join(r["cards"]))} | {cell(", ".join(r["registry"]))} |')
L += ['', '## Zero / null kinds, kept distinct', '', NULL_RULE, '', '| Kind | Law | Cards |', '|---|---|---|'] + [f'| {n["kind"]} | {cell(n["law"])} | {", ".join(n["cards"])} |' for n in NULLS]
L += ['', '## Quantum measurement: the named channel', '', f'- Channel: {QCHANNEL["name"]}, {QCHANNEL["map"]}.', f'- Observable: {QCHANNEL["observable"]}.', f'- Pre-measurement state: {QCHANNEL["preState"]}.',
      f'- Removed: {QCHANNEL["removed"]}.', f'- Preserved: {QCHANNEL["preserved"]}.', f'- Not generic: {QCHANNEL["counterexample"]}.', f'- Generic safe form: {QCHANNEL["generic"]}', '',
      '## Observation-type operations, kept distinct', '', '| Operation | What it is | Property | Cards |', '|---|---|---|---|'] + [f'| {o["op"]} | {cell(o["object"])} | {cell(o["property"])} | {", ".join(o["cards"])} |' for o in OBS_OPS]
L += ['', OBS_RULE['open'] + ' ' + OBS_RULE['established']]
L += ['', '## Manifestation terminology', '', '| Term | Meaning | Status | Example |', '|---|---|---|---|'] + [f'| {m["term"]} | {cell(m["meaning"])} | {m["status"]} | {cell(m["example"])} |' for m in MANIFEST]
L += ['', 'Connected to the Reduction architecture\'s source / manifestation question (T-SOURCE-MANIFEST).', '', '## Transformation Architecture placement', '', '| Level | Model-manifold placement |', '|---|---|'] + [f'| {k} | {cell(v)} |' for k, v in TRANSFORM.items()]
L += ['', '## c: three roles (2026-11-15)', '', f'Registry: {C_VERDICT["registry"]}.', '', '| Role | Statement | Status | Cards | Note |', '|---|---|---|---|---|']
L += [f'| {r["role"]} | {cell(r["statement"])} | {r["status"]} | {cell(", ".join(r["cards"]))} | {cell(r["note"])} |' for r in C_VERDICT['roles']]
h = C_VERDICT['history'][0]
L += ['', f'Superseded verdict ({h["date"]}, kept): **{h["verdict"]}**, restricted to {h["scope"]}; ' + '; '.join(f'{p["role"]}: {p["verdict"]}' for p in h['parts']) + f'. Superseded on {h["supersededOn"]}: {h["reason"]}.']
L += ['', '## Information distinctions', '', '| Term | Exact object | Geometry | Cards | Not the same as |', '|---|---|---|---|---|']
L += [f'| {i["term"]} | {cell(i["object"])} | {cell(i["geometry"])} | {cell(", ".join(i["cards"]))} | {cell(i["notSame"])} |' for i in INFO]
L += ['', '## Spine instantiation (model manifolds)', '', '| Spine stage | Model-manifold instance |', '|---|---|'] + [f'| {a} | {cell(b)} |' for a, b in SPINE]
L += ['', '## C7: preconditions (no derivation)', '', f'Status: {C7["status"]}; {C7["readiness"]}. {C7["requirement"]} {C7["notJust"]}', '',
      f'Candidate bridge: {C7["candidateBridge"]}. A possible chain: {C7["possibleChain"]} ({C7["chainStatus"]}).', '', f'Width notions kept: ' + '; '.join(C7['widthCandidates']) + '. ' + C7['keepBoth'], '',
      'The next C7 pass must determine whether there is: ' + '; '.join(C7['outcomes']) + '.', '', 'Preconditions before derivation:'] + [f'{i}. {p}' for i, p in enumerate(C7['preconditions'], 1)]
L += ['', 'Not C7\'s object:'] + [f'- {x["object"]}: {x["why"]}' for x in C7['rejected']]
h = C7['history'][0]
L += ['', f'Superseded ({h["date"]}, kept): "{h["recommendation"]}" ({h["note"]}). Superseded on {h["supersededOn"]}: {h["reason"]}.']
L += ['', '## Negative results', '', '| Result | Status | Cards |', '|---|---|---|'] + [f'| {cell(n["result"])}{(" — " + n["revision"]) if n.get("revision") else ""} | {n["status"]} | {cell(", ".join(n["cards"]))} |' for n in NEGATIVE]
L += ['', '## Ratings (separate dimensions; no overall score)', '', '| Dimension | Backbone Support | AI Slop Risk | Transfer Depth | Application Breadth | Status | Why | Change |', '|---|---|---|---|---|---|---|---|']
L += [f'| {r["dimension"]} | {r["bs"]}% | {r["slop"]}% | {r["td"]} | {r["breadth"]} | {r["status"]} | {cell(r["why"])} | {cell("; ".join(f"{x["date"]}: from {x["fromBs"]}% / {x["fromSlop"]}%{(", " + x["fromTd"]) if x.get("fromTd") else ""} ({x["reason"]})" for x in r["history"]))} |' for r in RATINGS]
sr = SECTION_RATING
L += ['', f'Section rating (2026-11-15), {sr["dimension"]}: Backbone Support {sr["bs"]}%, AI Slop Risk {sr["slop"]}%, Transfer Depth {sr["td"]}, Application Breadth {sr["breadth"]}, Status {sr["status"]}. {sr["why"]}.']
L += ['', '## What would be lost if this branch were reduced to the paper alone', ''] + [f'- {x}' for x in LOST]
L += ['', '## Decisions for Nadia', ''] + [f'{i}. {d}' for i, d in enumerate(DECISIONS, 1)]
L += ['', 'Answered:'] + [f'- {d["question"]} {d["answer"]}.' for d in DECISIONS_ANSWERED]
(ROOT / 'research/model_manifold_story.md').write_text('\n'.join(L) + '\n')

V = ['# Model-manifold invariance table', '',
     'Generated from `research/tools/model_manifold_source.py` (`research/model_manifold.json`). Do not edit by hand. Cards: `verify/verify_MMI.py` (MMIa–MMIi), `verify/verify_MMP.py` (MMPa–MMPo) and earlier cards as cited. Corrected 2026-11-15; superseded rows are listed at the end.', '',
     '"Coordinate invariant" means unchanged under an invertible reparametrization θ = θ(φ) of Θ (A = ∂θ/∂φ, R1). "Embedding dependent" means it changes with the choice of outputs and the prediction-space metric in which the model image sits. "Reduction dependent" means it changes on a boundary / reduced model. CONDITIONAL means invariant only under the stated condition, not yet confirmed from the source definition. Model F-C: Y = e^{−θ₁t} + e^{−θ₂t}, t = 1, 2, 3, σ = 1. Notation: J_Y = ∂Y/∂θ, g_θ = J_Yᵀ Σ⁻¹ J_Y.', '',
     '| ' + ' | '.join(ICOLS) + ' | Group | Cards |', '|' + '---|' * (len(ICOLS) + 2)]
for r in INV:
    V.append('| ' + ' | '.join(cell(r[k]) for k in ('quantity', 'definition', 'coordinateInvariant', 'embedding', 'model', 'noise', 'reduction', 'source', 'failure', 'c7')) + f' | {r["group"]} | {", ".join(r["cards"]) or "—"} |')
V += ['', 'Summary. Coordinate invariant: ' + ', '.join(r['quantity'] for r in INV if r['invariant'] == 'yes') + '. Conditional: ' + ', '.join(r['quantity'] for r in INV if r['invariant'] == 'conditional') + '. Not coordinate invariant: ' + ', '.join(r['quantity'] for r in INV if r['invariant'] == 'no') + '.',
      'Noise model: for a change between fixed positive-definite weights, null directions and rank do not change (MMIe, MMPe); a singular weight (MMPd) or a θ-dependent noise law (MMPe) can change them. Every magnitude depends on the noise model. These are the quantities audited, not an exhaustive classification for this project.', '',
      '## Superseded rows (2026-11-13, kept)', '', '| Quantity | Old verdict | Superseded by | Reason |', '|---|---|---|---|']
V += [f'| {r["quantity"]} | {r["coordinateInvariant"]} | {cell("; ".join(r["supersededBy"]))} | {cell(r["reason"])} |' for r in SUPERSEDED_INV]
(ROOT / 'research/model_manifold_invariance.md').write_text('\n'.join(V) + '\n')
print(f'{len(ROWS)} story rows; {len(INV)} invariance rows; {len(INFO)} information terms; {len(CORRECTIONS)} corrections')
