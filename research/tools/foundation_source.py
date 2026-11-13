"""Foundation data (the dependency architecture): V1 consolidation and Pass 2 (2026-11-12).
Writes research/foundation.json and renders research/foundation_dependencies.md, research/foundation_bridges.md,
research/foundation_sources.md, research/foundation_completion.md and research/foundation_user_theories.md.
research/master_math_map.md is written by hand and cites these ids. test/foundation.test.js and
test/foundation_sources.test.js check every card, registry id, source and enum.
Run: python3 research/tools/foundation_source.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]

LAYERS = ['ORIGINAL USER THEORY', 'ESTABLISHED MATHEMATICS', 'PROJECT-DERIVED CONNECTION', 'PROJECT CONSTRUCTION', 'PAPER-BACKED CONNECTION',
          'OPEN RESEARCH QUESTION', 'PHILOSOPHICAL LENS', 'FAILED / NEGATIVE RESULT']
STAGES = ['OBJECT', 'REPRESENTATION', 'RELATION', 'ZERO / BALANCE / NULL', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY', 'INFORMATION',
          'DYNAMICS / CONTINUATION', 'CROSS-SYSTEM TRANSFER', 'APPLICATION']
STATUS = ['ESTABLISHED', 'DERIVED', 'HYPOTHESIS', 'OPEN', 'GOVERNANCE', 'NEGATIVE']
TD = ['TRIVIAL CONSEQUENCE', 'STRUCTURAL TRANSFER', 'NONTRIVIAL PREDICTIVE TRANSFER', 'FAIL', 'NOT YET FORMALIZED', 'not a transfer']
O = []
def obj(id, name, layer, stages, eq, status, *, cards=(), docs=(), reg=(), depends=(), supports=(), bears=(), bs=None, slop=None, td='not a transfer',
        breadth=None, fail='', role='', guide='', gap=None):
    O.append(dict(id=id, name=name, layer=layer, stages=list(stages), equation=eq, status=status, cards=list(cards), docs=list(docs),
                  registry=list(reg), dependsOn=list(depends), supports=list(supports), bearsOn=list(bears), backboneSupport=bs, slopRisk=slop,
                  transferDepth=td, applicationBreadth=breadth, failureCondition=fail, foundationRole=role, guideLocation=guide, gap=gap))
E, PD, PC, PB, OQ, UT, PL, NG = LAYERS[1], LAYERS[2], LAYERS[3], LAYERS[4], LAYERS[5], LAYERS[0], LAYERS[6], LAYERS[7]
SPEC = 'docs/Mathematical_Basis_Interactive_Design_Spec.md'

# ── Part II: objects before representation ─────────────────────────────────────────────────────
obj('OB1', 'Distinct objects behind shared vocabulary', PD, ['OBJECT'], 'L²-energy ≠ physical energy; null vector (q(v) = 0) ≠ statistical null direction (g v = 0) ≠ zero observable (Aψ = 0) ≠ mass balance (Σm(r − R) = 0)', 'DERIVED',
    docs=['docs/objective.md', SPEC], reg=['T-MANIFOLDS', 'T-ENERGY-MEANING'], bs=20, slop=5, fail='a single object shown to underlie two of these readings would merge them (none shown)', role='guards against equating objects by their names', guide='all Acts (wording rule)', gap='definitional distinction (no card needed)')

# ── representation (Layer 1) ───────────────────────────────────────────────────────────────────
obj('R1', 'Fourier basis is orthonormal', E, ['REPRESENTATION', 'RELATION'], '⟨e_j, e_k⟩ = δ_jk, e_k(t) = e^{2πikt} on [0,1]', 'ESTABLISHED', cards=['S2a', 'O2-0', 'B3a'],
    supports=['T-EVIDENCE'], bs=20, slop=5, fail='none (theorem)', role='the founding evidence object', guide='Guide: Fourier (#7 built)')
obj('R2', 'Fourier coefficient is a projection', E, ['REPRESENTATION'], 'f̂(k) = ⟨f, e_k⟩; f = Σ f̂(k) e_k', 'ESTABLISHED', cards=['O2a'], depends=['R1'], supports=['T-EVIDENCE'], bs=20, slop=5,
    fail='none', role='representation as projection onto an orthonormal basis', guide='Guide: Fourier (#7)')
obj('R3', 'Parseval / Plancherel', E, ['PRESERVED STRUCTURE'], '‖f‖² = Σ|f̂(k)|²', 'ESTABLISHED', cards=['S2b', 'B4a', 'O2b', 'CFT9a'], depends=['R1', 'R2'], bears=['T-ENERGY-MEANING'], bs=25, slop=5,
    fail='none', role='what one representation change preserves', guide='Guide: Fourier (#7, #8)')
obj('R4', 'Translation becomes phase', E, ['TRANSFORMATION', 'REPRESENTATION'], 'T_τ e_k = e^{−2πikτ} e_k', 'ESTABLISHED', cards=['S3', 'CFT9c'], depends=['R1'], supports=['T-H2'], bs=20, slop=5,
    fail='none', role='a transformation diagonalized by a representation; R3: the Fourier transform intertwines translation and phase multiplication (BR46)', guide='Guide: Fourier')
obj('R5', 'Fourier transform as a quarter-turn', E, ['REPRESENTATION', 'TRANSFORMATION'], 'F h_n = (−i)^n h_n, F⁴ = I; oscillator flow (x, p) → (p, −x)', 'ESTABLISHED', cards=['S11', 'S11b'],
    docs=['research/connections/C4.md'], bs=20, slop=5, fail='none', role='representation change as a group action (C4a)', guide='Guide: Fourier')
obj('R6', 'Circle / phase representation of an unbounded parameter', E, ['REPRESENTATION', 'DYNAMICS / CONTINUATION'], 't ↦ e^{iωt} ∈ S¹, t ∈ ℝ', 'ESTABLISHED', cards=['C8a', 'G1c'],
    supports=['T-TIME-CIRCLE', 'B-FINITE-INFINITE'], bs=30, slop=5, fail='none', role='canonical finite geometry / unbounded parameter example', guide='Act II / Act IV')
obj('R7', 'Prediction map of a model', PB, ['REPRESENTATION', 'GEOMETRY'], 'θ ↦ Y(θ); model manifold 𝒴 = {Y(θ)}', 'ESTABLISHED', docs=['research/sources/quinn2023.md'], reg=['T-INFOGEO'],
    bs=20, slop=10, fail='—', role='parameters represented as predictions', guide='Guide: model manifolds (Foundation ontology)', gap='definitional (no card needed); quinn2023 PDF pending (P-2)')
obj('R8', 'Projection of an orthonormal source', PC, ['REPRESENTATION', 'ZERO / BALANCE / NULL'], 'x ↦ P_n x, P_n = I − (1/n)11ᵀ', 'ESTABLISHED', cards=['G2a', 'G2n'], reg=['T-R4-TETRA'],
    bs=30, slop=5, fail='none', role='the first outside-in construction', guide='Act III')
obj('R9', 'Different objects or different descriptions of one object?', UT, ['REPRESENTATION'], '—', 'OPEN', reg=['T-REPRESENTATION', 'T-VISIBLE-HIDDEN', 'T-BACKBONE-SECONDARY'],
    bs=None, slop=None, fail='—', role='the oldest project question', guide='all Acts')
obj('R10', 'Common structural law rather than analogy', UT, ['REPRESENTATION', 'CROSS-SYSTEM TRANSFER'], 'phenomena satisfying one exact relation under a representation → search for a shared law', 'HYPOTHESIS',
    reg=['T-BACKBONE-SECONDARY'], bs=25, slop=30, fail='"appropriate representation" left unrestricted makes any two systems satisfy one relation (AMB-18)', role='backbone (secondary)', guide='all Acts')

# ── relation / common form (Layer 2) ───────────────────────────────────────────────────────────
obj('CF1', 'Form preservation ⟺ AᵀMA = M', E, ['RELATION', 'PRESERVED STRUCTURE', 'GEOMETRY'], '(AᵀMA)_ij = B_M(Ae_i, Ae_j); B_M(Ax, Ay) = B_M(x, y) ∀x,y ⟺ AᵀMA = M', 'ESTABLISHED',
    cards=['C1b', 'S4e', 'S4f', 'S5c', 'O1a', 'CFT1a'], docs=['research/connections/C1.md'], supports=['T-BACKBONE-INVARIANT'], bs=65, slop=5,
    fail='none (theorem)', role='the common-form core: a relation and the transformations that keep it; R2 in matrix coordinates (A†MA = M is the coordinate form of F*T = T, BR36)', guide='Foundation (currently Guide: forms; see decision L1)')
obj('CF2', 'Zero relations are kept by form-preserving maps', E, ['ZERO / BALANCE / NULL', 'PRESERVED STRUCTURE'], 'AᵀMA = M ⇒ (B_M(x, y) = 0 ⇒ B_M(Ax, Ay) = 0)', 'ESTABLISHED',
    cards=['C1b'], depends=['CF1'], supports=['T-BACKBONE-INVARIANT'], bears=['T-ZERO-ORTHOGONAL-B'], bs=40, slop=10, fail='none', role='where invariant-form work and zero work meet', guide='Act IV / Guide')
obj('CF3', 'Preserving zero resultants identifies no form', NG, ['ZERO / BALANCE / NULL', 'PRESERVED STRUCTURE'], 'every linear A keeps Σv = 0; 2I keeps every zero resultant but DᵀMD = M only for M = 0', 'ESTABLISHED',
    cards=['Z4a', 'Z4b'], reg=['T-ZERO-NO-FORM'], bs=30, slop=5, fail='—', role='boundary: a zero relation alone does not fix a geometry', guide='Act III (research note)')
obj('CF4', 'Global preserved form → generator rule', E, ['TRANSFORMATION', 'PRESERVED STRUCTURE'], 'exp(sK)ᵀ M exp(sK) = M ∀s ⟺ KᵀM + MK = 0', 'ESTABLISHED', cards=['S9', 'S9(2)', 'S9(3)', 'B1a', 'C9c'],
    docs=['research/connections/C1.md'], depends=['CF1'], bs=35, slop=10, fail='none', role='global geometry → infinitesimal rule (rotation, boost, symplectic); the matrix case of L_X T = 0 (TA2I)', guide='Guide: forms / generators')
obj('CF5', 'Invariant form ⟺ conservation along a linear flow', E, ['DYNAMICS / CONTINUATION', 'PRESERVED STRUCTURE'], 'z\' = Kz: d/dt(zᵀMz) = zᵀ(KᵀM + MK)z = 0 ⟺ KᵀM + MK = 0 (M symmetric)', 'ESTABLISHED',
    cards=['S9b', 'C2a'], docs=['research/connections/C2.md'], depends=['CF4'], bs=35, slop=10, fail='none', role='symmetry → conservation, linear case', guide='Guide: conservation')
obj('CF6', 'Hamiltonian flow conserves H; the symplectic pairing', E, ['DYNAMICS / CONTINUATION', 'RELATION'], 'ż = J∇H with J constant antisymmetric and H time-independent ⇒ dH/dt = ∇HᵀJ∇H = 0. Symplectic pairing ω(u, v) = uᵀJv: ω(u, v) = 0 is symplectic orthogonality; ω(v, v) = 0 for every v because ω is alternating (an alternating self-pairing zero, not a Lorentz-type null vector)', 'ESTABLISHED', cards=['C1a', 'C1a(2)', 'C1c', 'S9(3)', 'FB5c', 'FB9a', 'FB9c'],
    depends=['CF4'], bs=30, slop=10, fail='explicitly time-dependent H (FB5c): dH/dt = ∂H/∂t', role='geometric constraint → conserved quantity; the symplectic row of Part III', guide='Guide: conservation (Foundation ontology)')
obj('CF7', 'Noether: continuous symmetry → conserved quantity (Lagrangian)', E, ['TRANSFORMATION', 'DYNAMICS / CONTINUATION'], 'one-parameter symmetry with δL = 0 (to first order), on solutions of the Euler–Lagrange equations ⇒ dQ/dt = 0 for Q = (∂L/∂q̇)·δq', 'ESTABLISHED',
    cards=['FB5a', 'FB5b'], docs=[SPEC, 'research/connections/C2.md'], bs=30, slop=10, fail='no symmetry (FB5b: V = x² + 2y² gives dQ/dt = −2xy)', role='symmetry → conservation, general (kept separate from the linear card CF5)', guide='Guide: conservation (Foundation ontology)',
    gap='FB5 cards one instance and its failure; the general theorem (fields, divergence symmetries, the second theorem) is source-only')
obj('CF8', 'Sign of the invariant decides bounded / unbounded', PD, ['GEOMETRY', 'DYNAMICS / CONTINUATION'], 'traceless J: J² = −det J · I → rotation / boost / shear; Kepler sign(E) = sign(e − 1)', 'ESTABLISHED',
    cards=['S4a', 'S4b', 'S4c', 'S4d', 'B1b', 'B1c', 'S10'], docs=['research/connections/C3.md'], bears=['T-H3', 'T-STAR'], bs=30, slop=15, fail='Kepler is a supporting exploration, not the same object (C3)', role='trichotomy of continuation', guide='Act IV / Guide')
obj('CF9', 'Weighted inner product read off a zero relation', PC, ['RELATION', 'GEOMETRY'], '⟨x, y⟩_D = xᵀDy, D = diag(m): first-moment zero = ⟨1, C_m x⟩_D = 0', 'ESTABLISHED', cards=['G5b', 'G5d'],
    reg=['T-WMC', 'T-CENTERING-OPERATOR'], bs=45, slop=15, td='STRUCTURAL TRANSFER', breadth=2, fail='1ᵀG1 = 0 or non-positive weights', role='a metric that emerged from a relation', guide='Act III')
obj('CF10', 'Fisher / Riemannian metric on parameters', PB, ['RELATION', 'GEOMETRY'], 'ds² = dθᵀ g(θ) dθ; for y = Y(θ) + ε, ε ~ N(0, σ²I): g = E[∂ℓ∂ℓᵀ] = JᵀJ/σ², J = ∂Y/∂θ (unequal variances: JᵀΣ⁻¹J)', 'ESTABLISHED', cards=['FB6a', 'FB6b'], docs=['research/sources/quinn2023.md', SPEC],
    depends=['R7'], bs=20, slop=10, fail='heteroscedastic or correlated noise (FB6b): the formula becomes JᵀΣ⁻¹J', role='a metric induced by a representation', guide='Guide: model manifolds (Foundation ontology)')
obj('CF11-A', 'Common-form pattern in established geometries', PD, ['RELATION', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY'],
    'In many established geometries, a relational structure together with the transformations preserving it characterizes substantial geometric structure (Euclidean, unitary, bilinear / quadratic, Lorentz, symplectic, weighted; not the zero-resultant row, CF3)', 'DERIVED',
    cards=['C1b', 'S4e', 'S5c', 'S9(3)', 'C1c', 'FB9c', 'G5b', 'CFT1a', 'CFT2a', 'CFT4d'], depends=['CF1', 'CF4', 'CF9'], reg=['T-CF11-A', 'T-H2-ROLES'],
    bs=60, slop=8, td='TRIVIAL CONSEQUENCE', breadth=3, fail='a geometry whose structure is not characterized by a preserved relation (zero-resultant preservation already is one, CF3)', role='established pattern inside the architecture; not the center (Pass 2 lock)', guide='Guide: forms (Foundation ontology)')
obj('CF11-B', 'Common-form architecture across the project\'s geometries', UT, ['RELATION', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY', 'CROSS-SYSTEM TRANSFER'],
    'Can relation + admissible transformations + preserved structure provide a broader organizing architecture across the geometries investigated in this project?', 'HYPOTHESIS', depends=['CF11-A', 'CF3', 'CF9', 'CF10', 'CF12', 'CF13'], reg=['T-CF11-B', 'T-BACKBONE-INVARIANT'],
    cards=['CFT1a', 'CFT2a', 'CFT4d', 'CFT5a', 'CFT5c', 'CFT5f', 'CFT11b'], docs=['research/constructions/cf11b_fisher_prereg.md', 'research/constructions/cf11b_fisher_test.md'],
    bs=35, slop=25, td='STRUCTURAL TRANSFER', breadth=3, fail='with structural invariance alone (P1 = R2) it organizes generic Fisher geometry only vacuously (F-C′: CFT5a, CFT5c)', role='Pass 3 (preregistered): CF11-F2, PARTIAL SURVIVAL; classified REFINED; wording unchanged; architectural correction: recorded as the Transformation Architecture (TA0)', guide='all Acts')
obj('CF11-R', 'CF11-CANDIDATE-REFINEMENT (explicit form)', UT, ['RELATION', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY', 'CROSS-SYSTEM TRANSFER'],
    'A geometry may be characterized by relational structure together with transformations under which that structure is preserved or transforms coherently. Explicit form tested: tensor T; P1 F*T = T for symmetries; P2 g_(p∘θ) = θ*g_p (g_φ = Jᵀ g J) for reparametrizations; P3 A C = C A for derived operators; invariants ds², K, rank; failure cases', 'HYPOTHESIS',
    cards=['CFT3c', 'CFT4c', 'CFT11b', 'CFT10a', 'CFT8c'], depends=['CF11-B', 'CF12', 'CF13'], reg=['T-CF11-REFINEMENT'], docs=['research/constructions/cf11b_fisher_test.md'],
    bs=45, slop=20, td='STRUCTURAL TRANSFER', breadth=3, fail='"transforms coherently" without a stated law (too generic); weighted centering needs P3, beyond P1 and P2', role='historical step between CF11-F2 and the Transformation Architecture; superseded by TA0 (architectural correction): P1, P2, P3 are R2, R1, R3, not three meanings of one word', guide='all Acts')
obj('CF12', 'Pullback preservation: the coordinate-free common form', E, ['RELATION', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY'],
    'F*T = T, i.e. T_{F(x)}(dF u, dF v) = T_x(u, v); coordinates: dF(x)ᵀ M(F(x)) dF(x) = M(x); constant form and linear F: AᵀMA = M (A†HA = H); covers Euclidean, unitary, Lorentz, symplectic (nonlinear maps allowed) and Fisher isometries', 'ESTABLISHED',
    cards=['CFT1a', 'CFT1b', 'CFT1c', 'CFT1d', 'CFT2a', 'CFT2b', 'CFT2c', 'CFT3b', 'CFT4d', 'CFT6c', 'CFT9a', 'CFT9b', 'CFT11a'], depends=['CF1', 'CF4'], reg=['T-CF-PULLBACK-Q'],
    bs=70, slop=5, td='STRUCTURAL TRANSFER', breadth=3, fail='a map that is not a symmetry (shear, generic matrix, (q, 2p), non-isometries: CFT1c, CFT2b, CFT4d); a reparametrization is not F*g = g', role='KNOWN MATHEMATICS, HIGH FOUNDATION RELEVANCE: the common form behind AᵀMA = M; the Pass 3 record of R2 (TA2)', guide='Guide: forms (Foundation ontology)')
obj('CF13', 'Naturality of the Fisher metric; coordinate invariants', E, ['REPRESENTATION', 'GEOMETRY', 'INFORMATION'],
    'reparametrization θ = θ(φ): g_φ = Jᵀ g(θ(φ)) J (the pullback of the model\'s metric); invariant: ds², vector lengths, Gaussian curvature, rank and null directions, total length; not invariant: the component eigenvalues of g', 'ESTABLISHED',
    cards=['CFT3c', 'CFT4c', 'CFT4e', 'CFT5d', 'CFT5e', 'CFT6b2', 'CFT7a', 'CFT7b', 'CFT10a', 'CFT11b'], depends=['CF10'],
    bs=30, slop=5, fail='a coordinate-dependent pseudo-structure (the identity matrix in every chart) fails the law (CFT10a)', role='separates same model / different coordinates from different model / different geometry (H2); an R1 instance (TA1)', guide='Guide: model manifolds (Foundation ontology)')

obj('TA0', 'Transformation Architecture (R1 / R2 / R3)', PD, ['REPRESENTATION', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY'],
    'A mathematical structure may be investigated by distinguishing: (1) how it transforms when its representation changes, (2) which transformations leave the structure invariant, and (3) which maps/operators remain compatible with those transformations. R1 representation covariance; R2 structural invariance / symmetry (F*T = T); R3 equivariance / intertwining (C ρ_V(g) = ρ_W(g) C)', 'DERIVED',
    cards=['TRA4a', 'TRA1b', 'TRA2a', 'TRA3a', 'TRA3b', 'TRA4b', 'CFT4c', 'CFT8c'], depends=['TA1', 'TA2', 'TA3'], reg=['T-TRANSFORMATION-ARCH'], bears=['T-H2'],
    docs=['research/constructions/cf11b_fisher_test.md'], bs=45, slop=15, td='STRUCTURAL TRANSFER', breadth=3,
    fail='vacuity: if every transformation could be sorted into some level, the architecture would organize nothing; each level must name its class, law, invariant and a failure (TRA2b, TRA3b, TRA4a, TRA4b)',
    role='PROJECT-LEVEL ORGANIZING ARCHITECTURE, DERIVED FROM ESTABLISHED MATHEMATICS (not a new theorem); supersedes CF11-R; history: CF11 → Fisher test → CF11-F2 → architectural correction → R1/R2/R3', guide='all Acts')
obj('TA1', 'R1 — Representation covariance', E, ['REPRESENTATION', 'TRANSFORMATION'],
    'same abstract object, different coordinate representation, covariant transformation law: bilinear form M′ = PᵀMP for x = Px′; metric g_φ = Jᵀ g_θ J; vectors v_φ = J⁻¹ v_θ; scalars unchanged (ds² = dθᵀ g_θ dθ = dφᵀ g_φ dφ). A change of description, not an active symmetry: never written F*g = g', 'ESTABLISHED',
    cards=['TRA4a', 'CFT3c', 'CFT4c', 'CFT4e', 'CFT5d', 'CFT11b', 'S2b'], depends=['CF13'], bears=['T-H2'], bs=65, slop=5, td='STRUCTURAL TRANSFER', breadth=3,
    fail='a lossy map (projection) is not R1 (TRA4b); a coordinate-dependent pseudo-structure does not transform covariantly (CFT10a)', role='formalizes one of the oldest project questions (H2): different representations may look different while preserving deeper structure', guide='all Acts')
obj('TA2', 'R2 — Structural invariance / symmetry', E, ['TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY'],
    'active symmetry: F*T = T. Riemannian F*g = g; symplectic F*ω = ω; Lorentz F*η = η; constant form and linear F: A†MA = M (CF1); infinitesimal: L_X T = 0 (TA2I); consequences: invariant zero relations (BR44), the symmetry set Aut(T) = {F : F*T = T} (BR45), conservation under Noether\'s assumptions (CF5–CF7)', 'ESTABLISHED',
    cards=['CFT1a', 'CFT1b', 'CFT2a', 'CFT4d', 'CFT5a', 'TRA2a', 'TRA2b'], depends=['CF12', 'CF1'], bs=70, slop=5, td='STRUCTURAL TRANSFER', breadth=3,
    fail='non-symmetries fail (CFT1c, CFT2b, CFT4d); preserving zeros does not imply invariance (TRA2b)', role='Several major geometries in the Foundation admit a coordinate-free symmetry condition in which a defining tensor/form is preserved under pullback (established mathematics)', guide='Guide: forms (Foundation ontology)')
obj('TA2I', 'R2, infinitesimal: L_X T = 0', E, ['TRANSFORMATION', 'PRESERVED STRUCTURE', 'DYNAMICS / CONTINUATION'],
    'F_t*T = T for a one-parameter group with generator X ⟹ L_X T = 0; coordinates (L_X g)_ij = X^k∂_k g_ij + g_kj∂_iX^k + g_ik∂_jX^k; constant matrix form, A(t) = e^{tK}: KᵀM + MK = 0 (K†M + MK = 0)', 'ESTABLISHED',
    cards=['TRA1a', 'TRA1b', 'TRA1c', 'S9'], depends=['TA2', 'CF4'], bs=60, slop=5, td='STRUCTURAL TRANSFER', breadth=3,
    fail='a non-Killing field (σ∂_μ on the normal family) has L_X g ≠ 0 (TRA1b)', role='R2 → generator → (under Noether\'s assumptions) conservation: a downstream branch of R2, not of R3', guide='Guide: generators / conservation')
obj('TA3', 'R3 — Equivariance / intertwining', E, ['TRANSFORMATION', 'INFORMATION'],
    'C ρ_V(g) = ρ_W(g) C for a map C: V → W (intertwiner); when V = W with one representation, C ρ(g) = ρ(g) C (commuting operator). Examples: Fourier F T_a = M_a F (translation ↔ phase multiplication); weighted centering A C_m = C_m A for D-isometries preserving span{1}; Pₙ commutes with permutations; S² commutes with the S₄ action (Schur sectors)', 'ESTABLISHED',
    cards=['TRA3a', 'TRA3b', 'TRA4b', 'CFT8c', 'CFT9c', 'FB1a', 'FS2e', 'MB2c', 'Q2f'], bs=60, slop=5, td='STRUCTURAL TRANSFER', breadth=3,
    fail='commuting or intertwining is not invariance: C_m is not an isometry, the DFT is not a symmetry of the shift (TRA3b)', role='compatibility of derived maps / operators with transformations; not another form of structural invariance', guide='Guide: Fourier / symmetry')
obj('TAH', 'A deeper common transformation–zero architecture?', UT, ['TRANSFORMATION', 'ZERO / BALANCE / NULL', 'INFORMATION', 'CROSS-SYSTEM TRANSFER'],
    'Do recurring relationships among representation covariance, structural invariance, zero relations, and equivariance reveal a deeper common architecture across the systems studied in Geometry of Representation?', 'HYPOTHESIS',
    depends=['TA0', 'Z12', 'Z13'], reg=['T-TRANSFORMATION-DEEP'], bs=25, slop=35, td='NOT YET FORMALIZED', breadth=2,
    fail='the recurring relationships are each textbook and compose into no statement beyond their parts', role='open project question; keeps the three-level architecture from being the final theory', guide='all Acts')
obj('TAC', 'Čencov / Chentsov: future high-relevance check', OQ, ['GEOMETRY', 'TRANSFORMATION'],
    "Does the characterization of the Fisher metric under statistically meaningful transformations provide a deeper example of the project's transformation-class → distinguished-geometry relationship?", 'OPEN',
    reg=['T-CENCOV-CHECK'], bs=None, slop=None, fail='—', role='KNOWN THEOREM, NOT YET INTEGRATED; not evidence; no rating raised by it', guide='Guide: model manifolds')

obj('RI0', 'Reduction / Information-Changing Architecture', PD, ['REPRESENTATION', 'ZERO / BALANCE / NULL', 'INFORMATION', 'GEOMETRY'],
    'For Φ: X → Y, not necessarily invertible: what survives, what collapses (Φ(x₁) = Φ(x₂)), what becomes zero (Φ(x) = 0), what is lost, what is reconstructible and under which assumptions, the fibers Φ⁻¹(y) (ker Φ in the linear case; not reduced to kernels), and whether Φ ρ_X(g) = ρ_Y(g) Φ (an R3 relationship that does not make Φ lossless)', 'DERIVED',
    cards=['RIC1a', 'RIC1b', 'RIC1c', 'RIC1d', 'G3b', 'G4c', 'FB1d', 'FB10c'], depends=['H1', 'H2', 'H4', 'W2', 'QZ4'], reg=['T-REDUCTION-ARCH', 'T-SOURCE-MANIFEST'], bears=['T-H2'],
    bs=45, slop=20, td='STRUCTURAL TRANSFER', breadth=3,
    fail='breadth: almost every non-injective map can be described this way; it organizes only while each placement names the map, its domain, what survives, the fibers and a reconstruction statement with its assumptions',
    role='PROJECT-LEVEL ORGANIZING ARCHITECTURE, DERIVED FROM ESTABLISHED MATHEMATICS; parallel to the Transformation Architecture (TA0), not an R4 inside it', guide='Act III / Guide')
obj('RI1', 'Information-changing maps that are also equivariant', PD, ['INFORMATION', 'TRANSFORMATION'],
    'Φ ρ_X(g) = ρ_Y(g) Φ with Φ not invertible: Pₙ commutes with permutations; C_m commutes with D-isometries preserving span{1}; band-limiting commutes with integer cyclic shifts; |x̂| is shift-invariant (equivariant with trivial target action); finite-scale averaging is translation-covariant, and the global average of the wavelet modulus is invariant under circular shifts', 'DERIVED',
    cards=['RIC1c', 'TRA4b', 'CFT8c', 'FB10c', 'RIC1a'], depends=['RI0', 'TA3'], bs=50, slop=10, td='STRUCTURAL TRANSFER', breadth=3,
    fail='equivariance does not make a map lossless (RIC1c); not every reduction is equivariant', role='the explicit intersection of the two architectures', guide='Act III / Guide')
obj('RI2', 'PRESERVED ZERO vs COLLAPSED ZERO', PD, ['ZERO / BALANCE / NULL', 'TRANSFORMATION', 'INFORMATION'],
    'preserved zero (R2): F*T = T and T(u, v) = 0 ⟹ T(dF u, dF v) = 0, with the vectors surviving; collapsed zero (reduction): a nonzero source x with Φ(x) = 0 (linear: x ∈ ker Φ). Different mechanisms; an additional relationship, not a replacement of the zero taxonomy', 'DERIVED',
    cards=['RIC1d', 'TRA2a', 'RIC1a', 'RIC1b', 'RIC2c'], depends=['TA2', 'RI0'], bs=40, slop=10, td='STRUCTURAL TRANSFER', breadth=3,
    fail='zeros that are neither (a definite form, Z10; an observable zero, Z6)', role='a target zero may have nonzero preimages: the fiber Φ⁻¹(0) (for a linear map, the kernel) describes the ambiguity / source states collapsed to that zero; x ≠ 0 with Φ(x) = 0 is one exact example of a COLLAPSED ZERO, but not every target zero implies a nonzero hidden source (RIC2c); not all zeros arise from projection or hidden higher dimensions', guide='Act III')
obj('RI3', 'Transform vs reduce (open project question)', UT, ['TRANSFORMATION', 'INFORMATION', 'CROSS-SYSTEM TRANSFER'],
    'Is the Geometry of Representation fundamentally governed by both how structure behaves under transformations and how structure behaves under reduction?', 'OPEN',
    depends=['TA0', 'RI0'], reg=['T-TRANSFORM-REDUCE'], bs=None, slop=None, fail='—', role='OPEN PROJECT QUESTION; not promoted', guide='all Acts')
obj('W5', 'DYADIC PACKETS research questions (open)', UT, ['INFORMATION', 'REPRESENTATION'],
    'Can a hierarchy of packets encode how information survives, separates, disappears, or remains reconstructible under repeated reduction? Can relationships between packets preserve information not visible in any one packet individually?', 'OPEN',
    depends=['W3', 'RI0'], reg=['T-DYADIC-Q1', 'T-DYADIC-Q2'], bs=None, slop=None, fail='—', role='open questions, not theorems; no connection to Fourier, wavelets, scattering, zero or projection is asserted yet', guide='Guide: wavelets')

# ── zero / balance / null (Layer 3) ────────────────────────────────────────────────────────────
obj('Z1', 'Additive / resultant zero', E, ['ZERO / BALANCE / NULL'], 'Σ v_j = 0 with nonzero v_j', 'ESTABLISHED', cards=['Z1a2', 'Z1b', 'Z2a', 'Z2b2', 'Z2c'], docs=['research/zero_taxonomy.md'],
    bs=20, slop=5, fail='—', role='Chapter I stages 1–2', guide='Act I')
obj('Z2', 'Balance / first-moment zero', E, ['ZERO / BALANCE / NULL'], 'Σ m_i (r_i − R_CM) = 0; F(R) = M(R_CM − R)', 'ESTABLISHED', cards=['Z3a', 'Z3b', 'Z3c', 'Z3d', 'G5a'], bs=25, slop=5,
    fail='—', role='Chapter I stage 3; Pair A source', guide='Act I')
obj('Z3', 'Linear-functional / kernel zero', E, ['ZERO / BALANCE / NULL'], 'Σ L x_i = L(Σ x_i): zero ⟺ Σx_i ∈ ker L', 'ESTABLISHED', cards=['G4a', 'G4b'], reg=['T-ZERO-CONNECTOR-LINEAR'],
    bs=20, slop=10, td='TRIVIAL CONSEQUENCE', breadth=3, fail='nonlinear zeros', role='the exact linear case of the connector', guide='Act III')
obj('Z4', 'Inner-product / bilinear zero (orthogonality)', E, ['ZERO / BALANCE / NULL', 'RELATION'], '⟨u, v⟩ = 0', 'ESTABLISHED', cards=['S1a', 'O1e'], reg=['T-H1-TWO-ZEROS'], bs=30, slop=5,
    fail='—', role='first of the two zeros of H1-2', guide='Act IV / Guide')
obj('Z5', 'Quadratic null', E, ['ZERO / BALANCE / NULL'], 'q_η(v) = 0, v ≠ 0 (light ray orthogonal to itself)', 'ESTABLISHED', cards=['S12b', 'B1d'], docs=['research/connections/C5.md'], reg=['T-H1-TWO-ZEROS'],
    bs=30, slop=5, fail='—', role='second of the two zeros of H1-2', guide='Guide: Lorentz')
obj('Z6', 'Observable / eigenvalue zero', E, ['ZERO / BALANCE / NULL'], 'S_z ψ = 0 (two-dimensional complex eigenspace for two spins; dimension 6 for four)', 'ESTABLISHED', cards=['Q1a', 'Q1d', 'Q1f', 'FS1a'],
    reg=['T-QUANTUM-ZERO'], bs=25, slop=5, fail='—', role='Chapter I stage 2b', guide='Act I')
obj('Z7', 'Coefficient / spectral zero', E, ['ZERO / BALANCE / NULL'], 'f̂(k) = 0 ⟺ f ⊥ e_k', 'ESTABLISHED', cards=['O2a', 'O2b'], depends=['R2'], bs=15, slop=10, fail='—', role='removing a component', guide='Guide: Fourier')
obj('Z8', 'Symmetry-defect zero', E, ['ZERO / BALANCE / NULL', 'TRANSFORMATION'], 'D_x(g) = ‖x − U_g x‖² / 2‖x‖² = 0 ⟺ g ∈ G_x (stabilizer)', 'ESTABLISHED', cards=['B5b', 'B5c'],
    bs=30, slop=10, fail='—', role='zero of a defect measures exact symmetry', guide='Guide: symmetry (Block 5)')
obj('Z9', 'Model-manifold null / nonidentifiable direction', PB, ['ZERO / BALANCE / NULL', 'GEOMETRY'], 'g = JᵀJ/σ² ⪰ 0: vᵀgv = 0 ⟺ Jv = 0 ⟺ gv = 0 (first-order predictions unchanged along v). Kept apart: exact structural nonidentifiability (Jv = 0 everywhere), a small nonzero sloppy eigenvalue, a Lorentz null vector (vᵀηv = 0, ηv ≠ 0)', 'ESTABLISHED',
    cards=['FB7a', 'FB7b', 'FB7c', 'FB7d'], docs=['research/sources/quinn2023.md', SPEC], reg=['T-INFOGEO'], bs=20, slop=15, fail='a sloppy direction is not a null (FB7c: λ_min > 0)', role='a statistical null, distinct from a quadratic null (OB1)', guide='Guide: model manifolds (Foundation ontology)')
obj('Z10', 'Definite quadratic zero (identifies the state)', NG, ['ZERO / BALANCE / NULL'], '|x|² = 0 ⟺ x = 0', 'ESTABLISHED', cards=['Z5a'], bs=10, slop=5, fail='—',
    role='boundary: some zeros hide nothing', guide='Act I (formal note)')
obj('Z11', 'Zero as connector / interface', UT, ['ZERO / BALANCE / NULL', 'CROSS-SYSTEM TRANSFER'], 'source relations → representation → zero/resultant interface', 'HYPOTHESIS', depends=['Z3', 'H2'],
    reg=['T-ZERO-CONNECTOR', 'T-BACKBONE-PRIMARY'], bs=25, slop=30, td='STRUCTURAL TRANSFER', breadth=3, fail='zeros repeatedly inherited or nonlinear with no connector formulation', role='working backbone hypothesis', guide='Act III')
obj('Z12', 'The visible zero does not determine where the hidden information lives', PD, ['ZERO / BALANCE / NULL', 'INFORMATION', 'CROSS-SYSTEM TRANSFER'],
    'spins: contribution geometry blind, independent symmetry decisive (FOUR-SPIN-B); mass: contribution geometry decisive, symmetry partial', 'DERIVED', cards=['FS2b', 'FS2c', 'MB2a', 'MB2b', 'Q2d', 'Q2h'],
    reg=['T-ZERO-SYMMETRY-ARCHITECTURE', 'T-FOURSPIN-SYMMETRY', 'T-MASS-SECOND-MOMENT'], bs=35, slop=20, td='STRUCTURAL TRANSFER', breadth=2,
    fail='a system where neither geometry nor independent symmetry carries the hidden label', role='strongest defensible cross-domain methodological result', guide='Act III')

obj('Z13', 'Symmetry-forced Fisher null (sufficient, not necessary)', PD, ['ZERO / BALANCE / NULL', 'TRANSFORMATION', 'GEOMETRY'],
    'Y∘S = Y for an involution S ⇒ S*g = g and Jv = 0 at fixed points for dS v = −v; F-C: J(1, −1) = 0 on θ₁ = θ₂; control F-C′ (no symmetry): J(2, −1) = 0 there anyway', 'DERIVED',
    cards=['CFT5a', 'CFT5b', 'CFT5c', 'CFT11b'], reg=['T-INFOGEO'], depends=['Z9', 'CF12'], bs=25, slop=10, td='TRIVIAL CONSEQUENCE', breadth=1,
    fail='nulls without symmetry (F-C′): the symmetry is sufficient, not necessary', role='zero metric length ↔ nonidentifiable tangent direction, with an independently supplied symmetry; mirrors Z12 (mass: symmetry sound but incomplete)', guide='Guide: model manifolds')

# ── orthogonality and norm (Layers 4–5) ───────────────────────────────────────────────────────
obj('ON1', 'Orthogonality ⟺ Pythagoras; polarization', E, ['RELATION'], '‖u + v‖² = ‖u‖² + ‖v‖² + 2⟨u, v⟩; ⟨u, v⟩ = (Q(u + v) − Q(u − v))/4', 'ESTABLISHED', cards=['S1a', 'S1b', 'B4b'],
    supports=['T-H1-SIGNATURE'], bs=30, slop=5, fail='none', role='H1-1 core', guide='Act IV / Guide (#8 built)')
obj('ON2', 'Orthogonality signature: zero cross terms, independent coefficients, G = I', E, ['RELATION', 'PRESERVED STRUCTURE'], 'G = I ⟺ Parseval gap 0 ⟺ exact reconstruction', 'ESTABLISHED',
    cards=['O1e', 'O1f', 'O2d', 'O2f', 'O1c', 'O1g', 'O2e'], depends=['ON1'], supports=['T-H1-SIGNATURE'], bs=35, slop=5, fail='perturbed bases (O2f) show cross-talk', role='separability (H1-1)', guide='Guide (#8)')
obj('ON3', 'Projection residual is orthogonal', E, ['RELATION', 'INFORMATION'], 'uᵀG(v − proj) = 0; P_H = avg U_h orthogonal projector', 'ESTABLISHED', cards=['B2a', 'S13', 'B7b'],
    docs=['research/connections/C6.md'], bs=25, slop=5, fail='none', role='decomposition = projection', guide='Guide (#8) / Act III')
obj('ON4', 'Bessel, Gram–Schmidt, symmetric operators', E, ['REPRESENTATION', 'RELATION'], 'Σ⟨f, e_k⟩² ≤ ‖f‖²; GS(1, x, x², x³) = Legendre; symmetric L ⇒ orthogonal eigenvectors', 'ESTABLISHED',
    cards=['S7', 'S6', 'S8'], supports=['T-SEE-ORTHOGONALITY'], bs=25, slop=5, fail='none', role='orthogonality without a picture', guide='Guide')
obj('ON5', 'Shadows do not preserve angles', E, ['REPRESENTATION', 'INFORMATION'], 'orthogonal axes seen along (1,1,1) appear at 120°', 'ESTABLISHED', cards=['O1b'], bears=['T-BEYOND-3D', 'B-HIGHER-GEOMETRY'],
    bs=25, slop=10, fail='none', role='the n = 3 member of the simplex family, first met as a projection lesson', guide='Act III')
obj('ON6', '"0 is orthogonal": four readings kept apart', UT, ['ZERO / BALANCE / NULL', 'RELATION'], 'A: ⟨0, v⟩ = 0; B: ⟨u, v⟩ = 0 defines orthogonality; C: a cancellation generated by a larger orthogonal organization; D: orthogonality generating form', 'OPEN',
    cards=['G0a'], reg=['T-ZERO-ORTHOGONAL', 'T-ZERO-ORTHOGONAL-A', 'T-ZERO-ORTHOGONAL-B', 'T-ZERO-ORTHOGONAL-C', 'T-ZERO-ORTHOGONAL-D'], bs=None, slop=None, fail='—', role='seed', guide='Act II / III')
obj('ON7', 'Orthogonality → constant radius (local–global, exact)', E, ['RELATION', 'GEOMETRY'], 'x·x\' = 0 on I ⟺ |x| constant on each connected component of I', 'ESTABLISHED', cards=['G1a', 'G1d', 'G1c'],
    reg=['T-CIRCLE-ORTHO'], bears=['B-ORTHO-FORM'], bs=30, slop=10, fail='none for the lemma', role='the compass circle', guide='Act II stage 4')
obj('ON8', 'Organized orthogonality may generate form', UT, ['GEOMETRY'], '—', 'HYPOTHESIS', depends=['ON7'], reg=['B-ORTHO-FORM', 'T-ORTHO-DEEPER'], bs=20, slop=35, fail='—', role='open branch', guide='Act II')
obj('ON9', 'Squared magnitude: meaning and kinds', OQ, ['RELATION', 'INFORMATION'], '‖x‖² additive under orthogonal decomposition and unitary-invariant; ∫|x|² dt ≠ physical energy', 'OPEN',
    cards=['S2b', 'B4b'], reg=['T-ENERGY-MEANING', 'T-ORIGIN-NORM-ZERO'], bs=None, slop=None, fail='—', role='"energy" always named by kind', guide='Act IV / Guide / Final')

# ── translation, correlation, symmetry defect, spectrum ───────────────────────────────────────
obj('T1', 'Orbit and stabilizer', E, ['TRANSFORMATION'], '|orbit|·|stab| = |G| (cube rotation group, 24)', 'ESTABLISHED', cards=['B6a', 'B6b'], bs=20, slop=5, fail='none', role='group-action vocabulary', guide='Guide (Block 6)')
obj('T2', 'Symmetry defect', E, ['TRANSFORMATION', 'RELATION'], 'D_x(g) = ‖x − U_g x‖²/2‖x‖² = 1 − Re⟨x, U_g x⟩/‖x‖²', 'ESTABLISHED', cards=['B5b', 'B5c'], depends=['T1'], bs=30, slop=10,
    fail='none', role='measures how far a transformation is from a symmetry', guide='Guide (Block 5)')
obj('T3', 'Translation defect ↔ autocorrelation ↔ power spectrum', PD, ['TRANSFORMATION', 'INFORMATION'], 'D_x(τ) = 1 − Re⟨x, T_τx⟩/‖x‖² = 1 − ∫cos(ωτ) dμ_x(ω), dμ_x = |x̂|²dω/(2π‖x‖²); ∫⟨x, T_τx⟩e^{iωτ}dτ = |x̂(ω)|² (x̂(ω) = ∫x e^{−iωt}dt)', 'DERIVED',
    cards=['B5b', 'P1a', 'B5a2', 'FB1a', 'FB1b', 'FB1c', 'FB1d'], depends=['T2', 'R4'], reg=['T-SAME-SPECTRUM'], bs=30, slop=10, fail='the defect does not determine the signal (FB1d: x(t) and x(−t))', role='transformation geometry ↔ correlation ↔ spectral magnitude',
    guide='Guide (Block 5) / Act IV')
obj('T4', 'Small translation ↔ spectral second moment', PD, ['TRANSFORMATION', 'INFORMATION'], 'D_x\'\'(0) = ∫ω² dμ_x = ‖x′‖²/‖x‖² = Δω² + ω̄² (exact when ∫ω²|x̂|² < ∞); D_x(τ) = (τ²/2)∫ω² dμ_x + o(τ²) (asymptotic, not an identity)', 'DERIVED', cards=['FB2a', 'FB2b', 'FB2c', 'FB2d'], docs=[SPEC], depends=['T3'],
    bs=25, slop=10, fail='infinite spectral second moment (FB2c: the box gives D = |τ|)', role='translation sensitivity = spectral spread', guide='Guide (Blocks 5, 8)')
obj('T5', 'Localization / uncertainty', E, ['INFORMATION'], 'Δt·Δω ≥ 1/2 for x̂(ω) = ∫x e^{−iωt}dt, variances with weights |x|² and |x̂|²; equality for Gaussians; Δt·Δξ ≥ 1/(4π) in the 2π convention', 'ESTABLISHED', cards=['FB3a', 'FB3b', 'FB3c', 'FB3d'], docs=[SPEC], depends=['T4'], reg=['T-SENSITIVITY'], bs=20, slop=10,
    fail='infinite moments (the variances are undefined)', role='spread in two representations; a different statement from T4 (FB3d keeps them apart)', guide='Guide (Block 8)', gap='FB3 cards the equality case, strict instances and the convention; the inequality for every x is source-only')

# ── Lorentz and c (Layer 9) ────────────────────────────────────────────────────────────────────
obj('L1', 'Lorentz invariance of the interval', E, ['PRESERVED STRUCTURE', 'GEOMETRY'], 'ΛᵀηΛ = η; x² − c²t² preserved', 'ESTABLISHED', cards=['S5c', 'C9a', 'S4f'], depends=['CF1'], bs=30, slop=5, fail='none',
    role='c inside the invariant structure', guide='Guide: Lorentz')
obj('L2', 'Rapidity addition and the bound c', E, ['DYNAMICS / CONTINUATION'], 'tanh(s₁ + s₂) = (tanh s₁ + tanh s₂)/(1 + tanh s₁ tanh s₂); |v| < c', 'ESTABLISHED', cards=['S5a', 'S5b'],
    bears=['T-SCHEMA', 'B-FINITE-INFINITE'], bs=25, slop=10, fail='none', role='unbounded parameter, bounded value (boundary approach)', guide='Act IV / Guide')
obj('L3', 'c → ∞: Galilean limit; the form degenerates', E, ['TRANSFORMATION', 'GEOMETRY'], 'M_c = diag(1, −1/c²) → diag(1, 0); boost → shear', 'ESTABLISHED', cards=['S5d', 'C9b', 'C9c', 'C9d'],
    docs=['research/connections/C9.md'], bs=30, slop=10, fail='none', role='c as a limit between theories', guide='Guide: Lorentz')
obj('L4', 'The two roles of c may be structurally linked', UT, ['GEOMETRY', 'CROSS-SYSTEM TRANSFER'], 'c fixes η and indexes the limit c → ∞', 'HYPOTHESIS', depends=['L1', 'L3'], reg=['T-C-ROLES', 'T-H3'],
    bs=25, slop=30, fail='—', role='H3-1 (user)', guide='Act IV / Guide')

# ── finite / infinite (Layer 8) ───────────────────────────────────────────────────────────────
obj('I1', 'Known continuation behaviors (not exhaustive)', E, ['DYNAMICS / CONTINUATION'], 'exact return (C8a); near-return (C8d); boundary approach (C8b, S5b); mean-square convergence (C8c2)', 'ESTABLISHED',
    cards=['C8a', 'C8b', 'C8d', 'C8c2'], docs=['research/connections/C8.md'], bears=['T-SCHEMA', 'T-STAR'], bs=30, slop=10, fail='C8c FAIL kept (pointwise vs mean-square)', role='comparison targets, derived behavior first', guide='Act IV')
obj('I2', '★ Any geometrical object that is bound by rules can be periodic', UT, ['DYNAMICS / CONTINUATION'], '—', 'HYPOTHESIS', reg=['T-STAR'], bs=20, slop=30, fail='—', role='user hypothesis', guide='Act IV')
obj('I3', 'Finite rule, infinite structure, finite form', UT, ['DYNAMICS / CONTINUATION', 'GEOMETRY'], '—', 'HYPOTHESIS', depends=['R6', 'I1'], reg=['B-FINITE-INFINITE', 'T-H3', 'T-SCHEMA', 'T-TIME-CIRCLE'],
    bs=25, slop=25, fail='—', role='H3 and the 2026-11-11 backbone', guide='Act II / IV')

# ── model manifolds (Layer 10) ────────────────────────────────────────────────────────────────
obj('M1', 'Sloppy spectrum of a sum of exponentials', PB, ['GEOMETRY', 'INFORMATION'], 'FIM eigenvalues roughly evenly spaced in log, computed in log-parameter coordinates (S14); the component spectrum depends on the parametrization (CFT5e)', 'ESTABLISHED', cards=['S14b', 'CFT5e'], docs=['research/sources/quinn2023.md'],
    bs=15, slop=15, fail='S14a FAIL kept (span 3.1 decades, threshold 4)', role='paper-backed territory', guide='Guide: model manifolds', gap='S14b is weak (tolerance set after the data)')
obj('M2', 'Hyperribbons, boundaries, effective models (MBAM)', PB, ['GEOMETRY', 'INFORMATION'], 'hierarchical widths; manifold boundaries = reduced models; e.g. θ₂ → ∞ in e^{−θ₁t} + e^{−θ₂t} gives e^{−θ₁t}', 'ESTABLISHED', cards=['FB11c'], docs=['research/sources/quinn2023.md', SPEC],
    reg=['T-INFOGEO'], bs=15, slop=15, fail='—', role='paper-backed reduced descriptions', guide='Guide: model manifolds (Foundation ontology)', gap='one boundary limit carded (FB11c); the MBAM geodesic procedure and the hyperribbon widths are source-only; quinn2023 PDF pending (P-2)')
obj('M3', 'Michaelis–Menten quasi-steady-state reduction', PB, ['INFORMATION'], 'dC/dt = 0 ⇒ C = e₀S/(K_M + S), rate V_max S/(K_M + S), K_M = (k₋₁ + k₂)/k₁, V_max = k₂e₀; valid when e₀/(S₀ + K_M) ≪ 1', 'ESTABLISHED', cards=['FB11a', 'FB11b'], docs=[SPEC], bs=10, slop=15, fail='e₀ comparable to S₀ + K_M (FB11b)',
    role='a worked reduction: three rate constants → two surviving combinations', guide='Guide: model manifolds (Foundation ontology)')
obj('M4', 'C7: coefficient decay vs Fisher eigenvalue decay', OQ, ['INFORMATION', 'CROSS-SYSTEM TRANSFER'], 'find an operator/map/asymptotic theorem, or show the resemblance is superficial', 'OPEN',
    cards=['S14b', 'S7'], reg=['T-C7'], docs=['research/connections/C7.md'], bs=10, slop=45, td='NOT YET FORMALIZED', breadth=0, fail='S14a FAIL kept', role='active open comparison', guide='Guide: model manifolds')

# ── wavelets / scattering (Layer 11) ──────────────────────────────────────────────────────────
obj('W1', 'Wavelet cancellation and admissibility', E, ['ZERO / BALANCE / NULL', 'REPRESENTATION'], '∫ψ = 0; C_ψ = ∫|ψ̂(ω)|²/|ω| dω < ∞ (for integrable ψ this forces ψ̂(0) = 0); W_s x = x ∗ ψ_s', 'ESTABLISHED', cards=['FB10a', 'FB10b'], reg=['T-WAVELETS'], bs=15, slop=10, fail='a nonzero-mean filter is not admissible (FB10b)', role='a designed zero',
    guide='Guide: wavelets / scattering (Foundation ontology)')
obj('W2', 'Scattering: filter → modulus → average, iterated', PB, ['INFORMATION', 'REPRESENTATION'], 'S x = (x ∗ φ, |x ∗ ψ_λ₁| ∗ φ, ||x ∗ ψ_λ₁| ∗ ψ_λ₂| ∗ φ, …)', 'ESTABLISHED', cards=['FB10c'], reg=['T-WAVELETS'],
    bs=15, slop=15, fail='the first-order invariant is many-to-one (FB10c)', role='information destroyed by averaging and retained by modulus at the next order', guide='Guide: wavelets / scattering (Foundation ontology)',
    gap='translation covariance and the invariance of the global average under circular shifts carded (FB10c, RIC2b); local invariance at finite scale, deformation stability, energy preservation and the higher-order results are source-only')
obj('W3', 'DYADIC PACKETS', UT, ['REPRESENTATION', 'INFORMATION'], 'ORIGINAL USER RESEARCH TERM; OPEN DEFINITION. Intended thematic role: organizing or preserving frequency/scale information within the wavelet/scattering branch. Current candidate architectural role (not the definition): a hierarchical organization of information across repeated splits/reductions, schematically X → (X₀, X₁) → (X₀₀, X₀₁, X₁₀, X₁₁) → …, investigated within the Reduction / Information-Changing Architecture. DYADIC STRUCTURE — CANDIDATE, NOT UNIVERSAL. Not identified with standard wavelet packets, dyadic wavelet trees, scattering paths or multiresolution analysis.', 'OPEN', reg=['T-DYADIC'], depends=['RI0'],
    bs=15, slop=40, fail='—', role='user-origin research term (open definition); rating is of the candidate role only (preserved term, architecture fit, existing analogues), not of a definition', guide='Guide: wavelets')
obj('W4', 'Information lost and recovered (question)', OQ, ['INFORMATION'], 'when a representation suppresses information, what relational structure survives and what representation exposes it?', 'OPEN',
    cards=['P1b', 'P1c', 'G4c', 'W2a', 'W3a'], reg=['T-MAGPHASE', 'T-REP-COMPLETE', 'T-VISIBLE-HIDDEN'], bs=None, slop=None, fail='—', role='unifies a question, not a mechanism', guide='Act III / Guide')

# ── higher / source / effective (Layer 13) ────────────────────────────────────────────────────
obj('H1', 'Simplex family from orthonormal sources', PC, ['REPRESENTATION', 'ZERO / BALANCE / NULL', 'GEOMETRY'], 'v_i = P_n e_i: Σv_i = 0, v_i·v_j = −1/n, normalized −1/(n−1), regular simplex', 'ESTABLISHED',
    cards=['G2n', 'G2j', 'G3c', 'G2i', 'G2k'], reg=['T-SIMPLEX-FAMILY', 'T-R4-TETRA'], bs=30, slop=5, td='STRUCTURAL TRANSFER', breadth=2, fail='zero-sum configurations that are not regular simplices', role='GENERAL CONSTRUCTION', guide='Act III')
obj('H2', 'Reconstruction of the source; tight-frame boundary', PC, ['INFORMATION', 'GEOMETRY'], 'f_i = v_i + w, |w|² = 1/n, unique up to ±n̂; orthonormal-basis source exists ⟺ a multiple of G is idempotent', 'ESTABLISHED',
    cards=['G3a', 'G3b', 'G3n', 'G3d'], reg=['Q-R4-2', 'Q-R4-6'], depends=['H1'], bs=40, slop=10, fail='non-tight zero sums ((1,0), (0,1), (−1,−1))', role='what survives a projection', guide='Act III')
obj('H3', 'Inverse problem: removed relation from the zero alone', PC, ['INFORMATION'], 'special case proved (G3b); exact obstruction without constraints (G4c)', 'OPEN', cards=['G3b', 'G4c'], reg=['Q-R4-8-INVERSE'],
    bs=35, slop=15, fail='—', role='open', guide='Act III')
obj('H4', 'Weighted mass centering and C_G', PC, ['RELATION', 'ZERO / BALANCE / NULL'], 'C_G = I − 11ᵀG/(1ᵀG1), G positive diagonal: G = I gives P_n, G = diag(m) gives C_m', 'ESTABLISHED',
    cards=['G5a', 'G5b', 'G5c', 'G5d', 'G5e', 'G5f', 'G4m', 'CFT8a', 'CFT8b', 'CFT8c'], reg=['T-WMC', 'T-CENTERING-OPERATOR', 'T-PAIRA-BRIDGE'], depends=['H1'], bs=45, slop=15, td='STRUCTURAL TRANSFER', breadth=2,
    fail='Fourier k ≠ 0, Σ weights = 0, nonlinear zeros', role='GENERAL CONSTRUCTION (locked to 1); R3: C_m is a geometry-derived operator compatible with a symmetry subgroup, not a symmetry (BR40)', guide='Act III')
obj('H5', 'Larger generating geometry', UT, ['GEOMETRY', 'ZERO / BALANCE / NULL'], 'hidden information in a lower-dimensional manifestation may be encoded in the larger geometry that generates it', 'HYPOTHESIS',
    depends=['H1', 'H2', 'H3'], reg=['B-HIGHER-GEOMETRY', 'B-HIGHER-GEOMETRY-CHAIN'], bs=35, slop=25, td='STRUCTURAL TRANSFER', breadth=2, fail='zeros with no source reconstruction under any class', role='backbone hypothesis', guide='Act III')
obj('H6', 'Effective / reduced representations (question)', OQ, ['INFORMATION'], 'What survives when a richer source description is reduced to an effective representation?', 'OPEN', cards=['FB11a', 'FB11c', 'FB11d'], depends=['ON3', 'H1', 'H4', 'M2', 'M3', 'H7'], reg=['T-EFFECTIVE-Q'],
    bs=None, slop=None, fail='—', role='compares projection, simplex, centering, MBAM, singular perturbation, coarse-graining / RG without equating them', guide='Act III / Guide',
    gap='three worked reductions carded (QSSA, a manifold boundary, 1D decimation); Kadanoff block spins and Wilson fixed-point RG are source-only; no general statement')

obj('H7', 'Coarse-graining by decimation (1D Ising)', PB, ['INFORMATION', 'TRANSFORMATION'], 'Σ_{s₂=±1} e^{Ks₂(s₁+s₃)} = A e^{K′s₁s₃}, tanh K′ = tanh²K, A = 2√cosh 2K (zero field)', 'ESTABLISHED', cards=['FB11d'],
    bs=10, slop=10, fail='a field h ≠ 0: the pure-K recursion does not close (FB11d)', role='one exact coarse-graining: what survives is the coupling form, renormalized', guide='Guide: effective representations')

# ── quantum same zero (Layer 3/12) ────────────────────────────────────────────────────────────
obj('QZ1', 'Same zero, different states (two spins)', E, ['ZERO / BALANCE / NULL', 'INFORMATION'], 'S_z A = S_z B = 0, S² separates', 'ESTABLISHED', cards=['Q1a', 'Q1b', 'Q1c', 'Q1e'],
    reg=['T-QUANTUM-ZERO', 'T-ZERO-GENERAL'], bs=25, slop=5, fail='—', role='Chapter I stage 2b', guide='Act I')
obj('QZ2', 'Quantum cancellation pair, restricted obstruction, exchange', PC, ['ZERO / BALANCE / NULL', 'TRANSFORMATION'], 'S_z^(1)|1,0⟩ = (ħ/2)|0,0⟩ = −S_z^(2)|1,0⟩; Gram-class descriptors cannot separate; P c₁ = ±c₂ does', 'ESTABLISHED',
    cards=['Q2a', 'Q2b', 'Q2c', 'Q2d', 'Q2e', 'Q2h'], reg=['T-QACP', 'T-QACP-OBSTRUCTION-RESTRICTED', 'T-QACP-EXCHANGE'], bs=40, slop=8, breadth=1, fail='non-eigenstates of P (Q2g)', role='same-zero test 1', guide='Act I / III')
obj('QZ3', 'Four spins: FOUR-SPIN-B', PC, ['ZERO / BALANCE / NULL', 'TRANSFORMATION', 'INFORMATION'], 'contribution Gram blind (phases); S₄ cyclic dimension 1/3/2 = S 2/1/0', 'ESTABLISHED',
    cards=['FS1a', 'FS1c', 'FS1d', 'FS1e', 'FS2b', 'FS2c', 'FS2e'], reg=['T-FOURSPIN-SYMMETRY', 'T-FOURSPIN-GEOMETRY-BLIND', 'T-FOURSPIN-SIMPLEX'], bs=40, slop=8, breadth=1,
    fail='none in H₀', role='same-zero test 2 (VALIDATION OF KNOWN MATHEMATICS); R3: S² commutes with the S₄ action (BR47)', guide='Act III')
obj('QZ4', 'Measurement, dephasing, which-path', E, ['INFORMATION'], 'non-selective S² measurement: ρ_AB → 0, S_z = 0 kept; which-path markers: cross term × ⟨m_a|m_b⟩', 'ESTABLISHED',
    cards=['W1a', 'W1b', 'W1c', 'W2a', 'W2b', 'W2c', 'W2d', 'W3a', 'W3b', 'Q1g', 'Q1h'], reg=['B-JOINT-ALTERNATIVES', 'B-ZERO-INTERNAL-CHANGE', 'T-S2-DEPHASING'], bs=25, slop=25, td='TRIVIAL CONSEQUENCE', breadth=2,
    fail='—', role='leave / change within / interrogate: kept apart', guide='Act III')
obj('QZ5', 'Zero-preserving interrogation (method)', 'ORIGINAL USER THEORY', ['ZERO / BALANCE / NULL'], 'do not leave the defining zero merely to obtain observability', 'GOVERNANCE',
    reg=['B-ZERO-PRESERVE', 'B-ZERO-LOSS', 'B-ZERO-INTERNAL-CHANGE', 'B-INDEPENDENT-SYMMETRY'], bs=None, slop=None, fail='—', role='method rule', guide='all Acts')

# ── pairs, mass–wave, gravity (Layers 14–15) ──────────────────────────────────────────────────
obj('P1', 'Real-signal conjugate symmetry', E, ['RELATION', 'REPRESENTATION'], 'x real ⇒ x̂(−ω) = conj x̂(ω) (continuous) and X_{N−k} = conj X_k (DFT)', 'ESTABLISHED', cards=['FB4a', 'FB4b', 'FB4c'], reg=['T-CONJUGACY'], bs=10, slop=10, fail='complex x (FB4c)', role='the established Fourier pair case',
    guide='Guide: Fourier (Foundation ontology)')
obj('P2', 'Physical pairs from deeper conjugacy or symmetry?', UT, ['CROSS-SYSTEM TRANSFER'], '—', 'OPEN', depends=['P1'], reg=['T-CONJUGACY'], bs=None, slop=None, fail='—', role='open user question', guide='Guide / Act IV')
obj('MW1', 'Mass is waves too, it\'s just a different form', UT, ['OBJECT', 'REPRESENTATION'], '—', 'HYPOTHESIS', reg=['T-MASS-WAVE-SEED', 'T-MASS-WAVE', 'T-MASS-WAVE-Q', 'T-MATTER-FIELD'], bs=20, slop=35, fail='—',
    role='original user theory (verbatim, recorded 2026-11-12)', guide='Guide: Lorentz / waves')
obj('MW2', 'Relativistic dispersion (established ingredient)', E, ['RELATION'], 'PᵀηP = m²c² ⟺ E² = p²c² + m²c⁴; with E = ħω, p = ħk (inputs): ω² = c²k² + m²c⁴/ħ²; (ω/c)² − k² = m²c²/ħ² (null cone when m = 0); v_p v_g = c²', 'ESTABLISHED', cards=['S12', 'FB8a', 'FB8b', 'FB8c'],
    bears=['T-MASS-WAVE-SEED', 'T-MASS-WAVE'], bs=20, slop=20, fail='without E = ħω and p = ħk the ω–k form does not follow; non-relativistic ω = ħk²/2m gives v_p v_g ≠ c²', role='ESTABLISHED INGREDIENT; not a proof that mass is waves (MW1)', guide='Guide: Lorentz (Foundation ontology)')
obj('MW3', 'Mass attraction may not be far removed', UT, ['CROSS-SYSTEM TRANSFER'], '— (ORIGINAL VERBATIM NOT RECOVERED: the registry holds Nadia\'s 2026-11-12 description of the intuition)', 'OPEN', reg=['T-GRAVITY-ATTRACTION'], bs=5, slop=60, fail='—', role='speculative, retained, no construction', guide='unplaced')

# ── application (Layer 16) ────────────────────────────────────────────────────────────────────
obj('A1', 'Energeo', UT, ['APPLICATION'], 'can energy behavior be represented so that hidden balance, null relations and invariant structure become geometrically explicit?', 'OPEN',
    reg=['T-ENERGEO', 'T-ENERGEO-INTENT'], bs=None, slop=None, fail='—', role='downstream translator; not evidence upstream', guide='Final Act')
obj('A2', 'ThermaLens / Energeo implementation mathematics', UT, ['APPLICATION'], '—', 'OPEN', reg=['T-THERMALENS'], bs=None, slop=None, fail='—', role='kept separate from Foundation proof; not upstream evidence',
    guide='Final Act', gap='APPLICATION PROVENANCE INCOMPLETE: prior project/application work, not paper-backed; the mathematics is not in this repository')
obj('A3', 'Physical energy vs L² energy', E, ['OBJECT', 'APPLICATION'], '‖x‖₂² is signal energy only by name; physical energy depends on the variable and its units', 'ESTABLISHED', docs=[SPEC],
    depends=['ON9'], reg=['T-ENERGY-MEANING'], bs=15, slop=5, fail='—', role='wording guard', guide='Final Act / Guide', gap='NEEDS WORDING ONLY')

# ── philosophical lenses ──────────────────────────────────────────────────────────────────────
obj('PL1', 'Philosophical lenses (retained)', PL, ['OBJECT', 'CROSS-SYSTEM TRANSFER'], 'existence as zero; part / whole and the fractal; space exploration; looking inside zero; irreversible formation; subconscious; relational perception', 'OPEN',
    reg=['T-EXISTENCE-ZERO', 'B-PART-WHOLE', 'T-SPACE-EXPLORATION', 'T-LOOK-INSIDE', 'T-IRREVERSIBLE-FORMATION', 'T-SUBCONSCIOUS', 'T-PERCEPTION-RELATIVITY', 'T-NATURE-OR-DESCRIPTION'],
    docs=['docs/author_philosophy.md'], bs=None, slop=None, fail='—', role='intellectual origin; not proof', guide='About the Author / Act III close (part / whole)')

# ── failures (Part XIII) ──────────────────────────────────────────────────────────────────────
obj('F1', 'Failures that define boundaries', NG, ['CROSS-SYSTEM TRANSFER'], 'kept FAIL cards S14a, C8c, B5a, Z1a, Z2b, CFT6b (check error, re-carded CFT6b2); CF11-B with one meaning of "preserved" does not organize generic Fisher geometry (CFT5c); component FIM eigenvalues are not coordinate invariants (CFT5e); weighted centering is not a symmetry (CFT8b); T′ unchanged fails on unequal masses, quantum, Fourier k ≠ 0, orthogonality; contribution geometry fails for spins; R1 misses M5; P1 converse fails; ε undefined off exchange eigenstates; linear template fails on nonlinear zeros', 'NEGATIVE',
    cards=['S14a', 'C8c', 'B5a', 'Z1a', 'Z2b', 'CFT6b', 'G4m', 'FS2c', 'FS2d', 'MB2a', 'Q2g', 'Q2b'], docs=['research/application_matrix.md'], bs=None, slop=None, td='FAIL', fail='—', role='what does not unify', guide='research record')

# ── bridges ───────────────────────────────────────────────────────────────────────────────────
B = []
def bridge(id, left, right, connector, status, scope, cards=(), not_proven='', objs=()):
    B.append(dict(id=id, left=left, right=right, connector=connector, status=status, scope=scope, cards=list(cards), doesNotProve=not_proven, objects=list(objs)))
EST, PS = 'established', 'project-specific'
bridge('BR1', 'zero', 'orthogonality', '⟨u, v⟩ = 0 defines orthogonality; ⟨0, v⟩ = 0 for every v (two different readings)', 'ESTABLISHED', EST, ['G0a', 'S1a'], 'that every zero is an orthogonality, or reading C/D of "0 is orthogonal"', ['ON6', 'Z4'])
bridge('BR2', 'orthogonality', 'decomposition', 'x = Σ⟨x, e_k⟩e_k for an orthonormal basis; residual of a projection ⟂ retained part', 'ESTABLISHED', EST, ['O2a', 'B2a', 'S13'], 'that decomposition needs orthogonality (frames decompose without it)', ['ON2', 'ON3'])
bridge('BR3', 'decomposition', 'squared norm', '‖x‖² = Σ|a_k|² exactly when cross terms vanish', 'ESTABLISHED', EST, ['S1a', 'B4b', 'O1e'], 'that ‖x‖² is physical energy', ['ON1', 'ON9'])
bridge('BR4', 'squared norm', 'Parseval', '‖f‖² = Σ|f̂(k)|² (unitary change of representation)', 'ESTABLISHED', EST, ['S2b', 'O2b'], 'anything about phase (Parseval sees magnitudes only)', ['R3'])
bridge('BR5', 'translation', 'phase', 'T_τ e_k = e^{−2πikτ}e_k', 'ESTABLISHED', EST, ['S3'], 'that phase can be recovered from magnitudes (it cannot: P1b, P1c)', ['R4'])
bridge('BR6', 'translation', 'autocorrelation', 'D_x(τ) = 1 − ρ_x(τ) (normalized, unitary translation)', 'ESTABLISHED', EST, ['B5b'], 'that the defect function determines the signal (it determines the autocorrelation only)', ['T2', 'T3'])
bridge('BR7', 'autocorrelation', 'spectral magnitude', 'Wiener–Khinchin: |x̂|² = DFT of the circular autocorrelation', 'ESTABLISHED', EST, ['P1a'], 'that the spectrum determines the signal (P1b, P1c)', ['T3'])
bridge('BR8', 'symmetry defect', 'stabilizer', 'D_x(g) = 0 ⟺ U_g x = x ⟺ g ∈ G_x', 'ESTABLISHED', EST, ['B5b', 'B5c'], 'that a small nonzero defect means g is near the stabilizer in the group (it measures distance in signal space)', ['T2', 'Z8'])
bridge('BR9', 'small translation', 'spectral spread', 'D_x(τ) ≈ (τ²/2)∫ω² dμ_x', 'ESTABLISHED', EST, [], 'that it is the uncertainty inequality (a different statement)', ['T4', 'T5'])
bridge('BR10', 'preserved form', 'geometry', 'AᵀMA = M ⟺ B_M preserved; zero relations of B_M preserved', 'ESTABLISHED', EST, ['C1b'], 'that every geometry is a bilinear form (CF3, the common-form candidate is a hypothesis)', ['CF1', 'CF2'])
bridge('BR11', 'continuous symmetry', 'generator', 'exp(sK) preserves M ⟺ KᵀM + MK = 0', 'ESTABLISHED', EST, ['S9', 'S9(2)', 'S9(3)'], 'that the generators of different geometries are physically the same', ['CF4'])
bridge('BR12', 'generator / symmetry', 'conservation', 'd/dt(zᵀMz) = 0 ⟺ KᵀM + MK = 0; dH/dt = ∇HᵀJ∇H = 0', 'ESTABLISHED', EST, ['S9b', 'C2a', 'C1a'], 'Noether in general (no card, CF7)', ['CF5', 'CF6', 'CF7'])
bridge('BR13', 'bounded geometry', 'unbounded parameter', 't ∈ ℝ ↦ e^{iωt} ∈ S¹; s ↦ tanh s ∈ (−1, 1)', 'ESTABLISHED', EST, ['C8a', 'S5b', 'C8d'], 'that every bounded geometry repeats (★ is a hypothesis)', ['R6', 'I1', 'L2'])
bridge('BR14', 'c', 'invariant geometry', 'ΛᵀηΛ = η with η = diag(1, −1/c²)', 'ESTABLISHED', EST, ['C9a', 'S5c'], 'the user hypothesis that the two roles are linked', ['L1'])
bridge('BR15', 'c', 'theory limit', 'c → ∞: η_c → diag(1, 0), boost → Galilean shear', 'ESTABLISHED', EST, ['C9b', 'C9d', 'S5d'], 'that spacetime and model manifolds are the same object', ['L3'])
bridge('BR16', 'prediction map', 'Fisher metric', 'g = JᵀJ/σ² for Gaussian noise', 'ESTABLISHED', EST, [], 'that sloppiness equals spectral decay (C7 open)', ['R7', 'CF10'])
bridge('BR17', 'Fisher metric', 'identifiability', 'g v = 0 ⟺ v changes no prediction (to first order)', 'ESTABLISHED', EST, [], 'that a statistical null is a quadratic null of an indefinite form (OB1 keeps them apart)', ['Z9'])
bridge('BR18', 'wavelet zero mean', 'cancellation', '∫ψ = 0: a wavelet sums to zero by design', 'ESTABLISHED', EST, [], 'that scattering proves the zero hypothesis', ['W1'])
bridge('BR19', 'modulus', 'information retention', '|f ∗ ψ| removes phase; averaging removes position; the next order recovers part of what averaging removed', 'ESTABLISHED', EST, [], 'that this mechanism equals Fourier phase loss or dephasing', ['W2'])
bridge('BR20', 'projection', 'hidden source structure', 'v_i = P_n e_i; source recovered as v_i + w (|w|² = 1/n) when the class is known', 'ESTABLISHED', PS, ['G2n', 'G3b', 'G3n'], 'recovery without knowing the class (G4c obstruction)', ['H1', 'H2', 'H3'])
bridge('BR21', 'zero', 'system-supplied symmetry', 'independent group acting covariantly on the zero-producing tuple; commuting hidden quadratic scalar on irreducible blocks (Schur)', 'DERIVED', PS,
       ['FS2b', 'FS2e', 'MB2c', 'Q2d'], 'that hidden information is in general symmetry information (mass inverts the roles)', ['Z12', 'QZ2', 'QZ3'])
bridge('BR22', 'centering', 'weighted geometry', 'Σm(r − R_CM) = 0 ⟺ ⟨1, C_m x⟩_D = 0; C_m D-orthogonal', 'ESTABLISHED', PS, ['G5b', 'G5d'], 'that WMC and T′ are one geometry beyond the operator family C_G', ['H4', 'CF9'])
bridge('BR23', 'equal-mass balance', 'simplex projection', 'R_CM = (1/n)1 at r_i = e_i, so r_i − R_CM = P_n e_i', 'ESTABLISHED', PS, ['G4m', 'G2i'], 'a universal Pair A solution', ['H1', 'H4'])
bridge('BR24', 'S_n-invariant zero', 'regular simplex', 'zero sum + full permutation symmetry ⇒ Gram ∝ I − J/n (G3c)', 'ESTABLISHED', PS, ['G3c', 'FS1e'], 'the converse (FS2d)', ['H1', 'QZ3'])
bridge('BR25', 'zero', 'kernel', 'Σ L x_i = 0 ⟺ Σx_i ∈ ker L', 'ESTABLISHED', EST, ['G4a'], 'that zero = kernel (inherited and nonlinear zeros, G4c, Z5a)', ['Z3'])
bridge('BR26', 'measurement', 'coherence loss', 'non-selective projective measurement: off-diagonal blocks → 0; zero-diagonal observables lose their expectation', 'ESTABLISHED', EST, ['W2a', 'W3a', 'W3b'], 'that it is the same physical mechanism as which-path (generic map only)', ['QZ4'])
bridge('BR27', 'relativistic invariant', 'wave dispersion', 'E² = p²c² + m²c⁴ with E = ħω, p = ħk', 'ESTABLISHED', EST, ['S12'], 'that mass is waves (MW1 stays a hypothesis)', ['MW2', 'MW1'])
bridge('BR28', 'Fourier coefficient decay', 'Fisher eigenvalue decay', 'none found (open)', 'OPEN', PS, ['S14a', 'S14b', 'S7'], 'any shared geometry', ['M4'])

# ══ Foundation Completion Pass 2 (2026-11-12) ═════════════════════════════════════════════════════
# Provenance classes (one primary per record), bridge strength classes, the source registry, domain
# statuses and the completion ratings. Decisions: docs/restructure_decisions.md, "Foundation Completion Pass 2".
PROVENANCE = ['USER-ORIGIN', 'TEXTBOOK / STANDARD', 'PRIMARY-PAPER BACKED', 'PROJECT-DERIVED FROM ESTABLISHED MATH', 'PROJECT-CONSTRUCTION',
              'SPECULATIVE PROJECT CONNECTION', 'PHILOSOPHICAL']
UO, TB, PP, PDM, PCN, SPC, PHL = PROVENANCE
PROV = {}
for ids, cls in (('R9 R10 CF11-B Z11 ON6 ON8 ON9 L4 I2 I3 W3 W4 H5 H6 QZ5 P2 MW1 MW3 A1 A2', UO), ('M4', SPC), ('PL1', PHL),
                 ('R8 CF9 H1 H2 H3 H4 QZ2 QZ3', PCN), ('OB1 CF3 CF8 CF11-A Z8 Z12 ON7 T2 T3 T4 A3 F1', PDM),
                 ('R7 M1 M2 M3 W2 H7', PP), ('CF11-R', UO), ('Z13', PDM), ('TA0', PDM), ('TA1 TA2 TA2I TA3', TB), ('TAH TAC RI3 W5', UO), ('RI0 RI1 RI2', PDM),
                 ('R1 R2 R3 R4 R5 R6 CF1 CF2 CF4 CF5 CF6 CF7 CF10 CF12 CF13 Z1 Z2 Z3 Z4 Z5 Z6 Z7 Z9 Z10 ON1 ON2 ON3 ON4 ON5 T1 T5 L1 L2 L3 I1 W1 QZ1 QZ4 P1 MW2', TB)):
    for i in ids.split():
        assert i not in PROV, i
        PROV[i] = cls
EXTERNAL = (TB, PP)                  # records whose central claim comes from outside the project: each needs a source or SOURCE MISSING
TLEVEL = {'TA1': ['R1'], 'CF13': ['R1'], 'R5': ['R1'], 'R3': ['R1'], 'R2': ['R1'], 'RI1': ['R3'], 'RI2': ['R2'], 'TA2': ['R2'], 'TA2I': ['R2'], 'CF12': ['R2'], 'CF1': ['R2'], 'CF2': ['R2'], 'CF4': ['R2'], 'CF5': ['R2'], 'CF6': ['R2'], 'CF7': ['R2'],
          'L1': ['R2'], 'Z8': ['R2'], 'Z13': ['R2'], 'TA3': ['R3'], 'R4': ['R3'], 'H4': ['R3'], 'QZ3': ['R3'], 'QZ2': ['R3'], 'TA0': ['R1', 'R2', 'R3'], 'CF11-B': ['R1', 'R2', 'R3'], 'CF11-R': ['R1', 'R2', 'R3']}
REDROLE = {i: 'INFORMATION-CHANGING' for i in ('R8', 'H1', 'H4', 'ON3', 'T3', 'Z7', 'W2', 'QZ4', 'M2', 'M3', 'H7', 'ON5', 'RI0', 'RI1')}
IC = ['survives', 'collapses', 'zero', 'lost', 'reconstructible', 'fibers', 'symmetry']
RMAPS = []
def rmap(name, objs, cards, axisA, axisB, ic, status='carded'):
    assert set(ic) == set(IC), name
    RMAPS.append(dict(name=name, objects=objs, cards=cards, axisA=axisA, axisB=axisB, status=status, **ic))
rmap('Simplex projection Pₙ: ℝⁿ → 1^⊥', ['R8', 'H1', 'H2'], ['RIC1a', 'G2n', 'G2j', 'G3b', 'G3n', 'G4c', 'Q2f'], 'noninvertible; information-changing', ['equivariant'],
     dict(survives='pairwise differences vᵢ − vⱼ = eᵢ − eⱼ survive exactly while the common mode is removed; Σvᵢ = 0. The source Gram I does not survive: the projected simplex has the exact Gram matrix Pₙ = I − 11ᵀ/n (|vᵢ|² = (n − 1)/n, vᵢ·vⱼ = −1/n, G2n)', collapses='x and x + c1 (one mode)', zero='Pₙ1 = 0: a nonzero source with zero image; Pₙx = 0 ⟺ x ∈ span{1}',
          lost='the common component 1ᵀx/n', reconstructible='under the orthonormal-source assumptions: the source as vᵢ + w, |w|² = 1/n, unique up to ±n̂ and an isometry (G3b, G3n); without the source class, no (G4c)',
          fibers='x + span{1} = x + ker Pₙ', symmetry='commutes with permutations (R3)'))
rmap('Weighted centering C_m = I − 1mᵀ/M', ['H4', 'CF9'], ['RIC1b', 'CFT8a', 'CFT8b', 'CFT8c', 'G5b'], 'noninvertible; information-changing', ['equivariant'],
     dict(survives='relative positions: (C_m y)ᵢ − (C_m y)ⱼ = yᵢ − yⱼ', collapses='y and y + c1 (the weighted common / translation mode)', zero='C_m1 = 0; C_m y = 0 ⟺ y ∈ span{1}',
          lost='the weighted mean mᵀy/M (R_CM)', reconstructible='y from (C_m y, mᵀy/M); not from C_m y alone', fibers='y + span{1}', symmetry='commutes with D-isometries preserving span{1} (R3, CFT8c); not an isometry'))
rmap('Fourier transform (unitary)', ['R1', 'R2', 'R3', 'R5'], ['CFT9a', 'RIC1c', 'S2b', 'TRA3a'], 'invertible; information-preserving', ['covariant', 'equivariant'],
     dict(survives='everything: inner products (Parseval)', collapses='nothing', zero='only 0 ↦ 0', lost='nothing', reconstructible='fully (inverse transform)', fibers='single points',
          symmetry='R1 (change of orthonormal basis) and R3 (F T_a = M_a F)'))
rmap('Keeping Fourier magnitudes only (x ↦ |x̂|)', ['T3'], ['RIC1c', 'FB1d', 'P1a', 'P1b', 'P1c'], 'noninvertible; nonlinear; information-changing', ['invariant'],
     dict(survives='the power spectrum, equivalently the autocorrelation (second-order information)', collapses='all translates; reversals of real signals; and signals unrelated by these (P1c)', zero='|x̂| ≡ 0 only for x = 0',
          lost='phase', reconstructible='not in general (phase retrieval needs extra assumptions; none carded)', fibers='signals with equal power spectrum (not a linear subspace)', symmetry='invariant under translations'))
rmap('Discarding Fourier coefficients / band-limiting', ['Z7', 'ON3'], ['RIC1c', 'O2a'], 'noninvertible; information-changing', ['equivariant'],
     dict(survives='the kept coefficients', collapses='signals differing only in the discarded modes', zero='P x = 0 ⟺ x lies in the discarded modes', lost='the discarded modes',
          reconstructible='only for signals known to lie in the kept band', fibers='x + span(discarded modes)', symmetry='commutes with integer cyclic shifts (R3)'))
rmap('Thresholding; subsampling', [], [], 'noninvertible; information-changing', ['none'],
     {k: 'not carded in the repository' for k in IC}, status='listed, not carded')
rmap('Single wavelet / filter channel (x ↦ x ∗ ψ_λ)', ['W1', 'W2'], ['RIC2a', 'RIC3a', 'RIC3b', 'FB10c'], 'need not be invertible: injectivity depends on the signal space and the frequency response. Finite periodic / discrete: a zero-mean channel annihilates the constant mode (RIC2a). L²(ℝ): decided by the multiplier ψ̂_λ, not by zero mean alone; a zero set of measure zero gives injectivity (Mexican hat), possibly without a bounded inverse (RIC3a); a zero set of positive measure gives a nontrivial kernel (RIC3b). Information-changing whenever not injective, or not boundedly invertible', ['equivariant'],
     dict(survives='the part of x where ψ̂_λ is nonzero', collapses='signals differing only where ψ̂_λ vanishes (finite periodic: the constant mode of a zero-mean channel; L²(ℝ): a nontrivial set only if that zero set has positive measure)', zero='x with x̂ supported in the zero set of ψ̂_λ', lost='content where ψ̂_λ vanishes; where ψ̂_λ is small, recoverable only without a bounded inverse',
          reconstructible='not from one channel in general; an injective channel on L²(ℝ) may lack a bounded inverse (RIC3a)', fibers='x + {y : ŷ supported in the zero set of ψ̂_λ}', symmetry='translation covariance (T_a x) ∗ ψ_λ = T_a(x ∗ ψ_λ): an equivariance (R3) relation, not invariance'))
rmap('Complete continuous wavelet transform (all required scales / translations)', ['W1', 'W2'], ['FB10a'], 'invertible on L²(ℝ) by the reconstruction formula, under the standard admissibility and finite-energy assumptions (Grossmann–Morlet; source-only); information-preserving under those assumptions. Different from the invertibility of one fixed channel', ['equivariant'],
     dict(survives='everything, under the stated assumptions', collapses='nothing, under the stated assumptions', zero='only 0, under the stated assumptions', lost='nothing under the assumptions; with restricted scales, the dropped bands',
          reconstructible='yes: the reconstruction formula, under admissibility and finite energy (source-only)', fibers='single points, under the stated assumptions', symmetry='translation covariance (R3)'), status='source-only (reconstruction); admissibility carded (FB10a)')
rmap('Undecimated convolutional analysis bank x ↦ (H₁x, …, H_m x)', ['W1', 'W2'], ['RIC2a', 'RIC3c'], 'injective iff, at every frequency of the stated signal space, some channel multiplier is nonzero (finite periodic: every DFT bin, carded RIC3c; L²(ℝ): almost every frequency, stated not carded); information-preserving when injective', ['equivariant'],
     dict(survives='everything, when the multipliers have no common zero on the signal space', collapses='signals differing only at common zeros of all multipliers', zero='x supported at the common zeros', lost='content at the common zeros',
          reconstructible='a left inverse exists in the finite periodic case when there is no common zero (RIC2a, RIC3c)', fibers='x + {y supported at the common zeros}', symmetry='translation covariance (R3)'))
rmap('Critically sampled / multirate filter bank', ['W1', 'W2'], ['RIC3d'], 'perfect reconstruction requires the analysis / synthesis polyphase system to be invertible, R(z)E(z) = c z^(−K) I (type-1 convention); the scalar no-common-zero condition is not sufficient (RIC3d: filters with no common zero, injective undecimated, give a non-invertible decimated bank); Haar satisfies R E = I', ['equivariant'],
     dict(survives='everything, when the polyphase system is invertible (Haar, RIC3d)', collapses='when det E(z) vanishes on the unit circle: the corresponding polyphase component (RIC3d)', zero='as for collapse', lost='as for collapse',
          reconstructible='iff the polyphase system is invertible; FIR perfect reconstruction iff R(z)E(z) = c z^(−K) I with FIR R', fibers='x + ker of the decimated analysis map', symmetry='covariant under shifts by the decimation factor only (not under all integer shifts)'), status='carded (finite periodic instances)')
rmap('Wavelet modulus (|x ∗ ψ_λ|)', ['W2'], ['FB10c'], 'noninvertible; nonlinear; information-changing', ['equivariant'],
     dict(survives='the envelope (local amplitude) in each band', collapses='signals differing by phase within a band', zero='where the band component vanishes', lost='phase within the band',
          reconstructible='partly, through other bands and higher orders (source-only)', fibers='not a linear subspace', symmetry='commutes with translations'))
rmap('Higher-order scattering propagation', ['W2'], [], 'information-changing at each order', ['equivariant'],
     dict(survives='part of what first-order averaging removes (source-only: Bruna–Mallat 2013)', collapses='source-only', zero='source-only', lost='source-only',
          reconstructible='source-only', fibers='source-only', symmetry='translation covariance kept (source-only)'), status='source-only')
rmap('Finite-scale low-pass averaging (∗ φ_J)', ['W2'], ['RIC2b'], 'noninvertible in general; information-changing', ['equivariant'],
     dict(survives='content passed by φ_J (structure coarser than the averaging scale)', collapses='signals differing only in what φ_J suppresses', zero='components in the zeros of φ̂_J', lost='detail finer than the averaging scale; high-frequency structure (higher orders retain part, source-only)',
          reconstructible='not in general', fibers='x + (the suppressed subspace)', symmetry='translation covariance (T_a x) ∗ φ_J = T_a(x ∗ φ_J) (RIC2b), NOT exact invariance; translation insensitivity / local invariance at the averaging scale is the sourced theorem (Mallat 2012), not carded'))
rmap('Global average (full-domain sum, or the limit of infinite averaging scale)', ['W2'], ['FB10c', 'RIC2b'], 'noninvertible; information-changing', ['invariant'],
     dict(survives='the global average Σ|x ⊛ ψ| of the first-order modulus (FB10c)', collapses='all translates; also x and its reversal (FB10c)', zero='—', lost='all position information',
          reconstructible='no, from the average alone', fibers='many-to-one (FB10c)', symmetry='exact translation invariance under circular shifts for the full-domain sum (FB10c, RIC2b); in the continuous setting, invariance in the limit of infinite averaging scale (source-only, Mallat 2012); deformation stability (source-only)'))
rmap('Non-selective measurement / dephasing (quantum)', ['QZ4'], ['W2a', 'W3a', 'W3b'], 'noninvertible; information-changing', ['none'],
     dict(survives='the zero S_z = 0; sector populations', collapses='states differing only in sector coherence', zero='the cross term ρ_AB → 0 (the zero\'s ±ħ/2 composition, W3a)', lost='sector coherence',
          reconstructible='not from the dephased state alone', fibers='states with the same block-diagonal part', symmetry='not carded'))
rmap('Model reduction / manifold boundary (placeholder)', ['M2', 'M3'], ['FB11a', 'FB11c'], 'information-changing', ['none'],
     dict(survives='instances only: K_M and V_max (FB11a); θ₁ (FB11c). In general: LATER PASS (model-manifold invariance audit)', collapses='instances only: one rate-constant combination; θ₂',
          zero='LATER PASS', lost='instances only', reconstructible='LATER PASS', fibers='LATER PASS', symmetry='LATER PASS'), status='placeholder; not pre-answered')
rmap('Coarse-graining / RG decimation (instance)', ['H7'], ['FB11d'], 'noninvertible; information-changing', ['none'],
     dict(survives='the nearest-neighbour coupling form, renormalized: tanh K′ = tanh²K', collapses='configurations of the decimated spins', zero='—', lost='the decimated spins',
          reconstructible='no', fibers='spin configurations agreeing on the kept spins', symmetry='not carded'), status='one instance; general RG source-only')
TRANSFORMATION_CLASSES = ['REPRESENTATION CHANGES', 'GEOMETRIC SYMMETRIES', 'SYSTEM-SUPPLIED TRANSFORMATIONS', 'OPERATOR-COMPATIBLE TRANSFORMATIONS']
RC, GS, SS, OC = TRANSFORMATION_CLASSES
TCLASS = [
 ('Constant forms (Euclidean, Lorentz, unitary)', {RC: 'basis changes: M′ = PᵀMP (TRA4a)', GS: 'A†MA = M (CFT1a, CFT1c)'}),
 ('Symplectic', {GS: 'symplectomorphisms, F*ω = ω, nonlinear allowed (CFT2a)', SS: 'the Hamiltonian flow of a given H (preserves ω and H, CF6)'}),
 ('Fisher / Riemannian', {RC: 'reparametrizations: g_φ = Jᵀ g J (CFT3c, CFT4c)', GS: 'isometries, F*g = g (CFT4d, CFT11a)', SS: 'location–scale from x ↦ ax + b; the exchange in F-C; none in F-C′ (CFT4d, CFT5a); a proper subset of the isometries in F-B (CFT11a)'}),
 ('Fourier', {RC: 'change to the Fourier basis (Parseval, S2b)', SS: 'translations T_a', OC: 'F intertwines T_a and M_a (TRA3a)'}),
 ('Weighted centering', {GS: 'D-isometries', OC: 'the D-isometries preserving span{1} commute with C_m (CFT8c)'}),
 ('Quantum same-zero', {GS: 'unitaries commuting with every S_z⁽ⁱ⁾ (Q2h class)', SS: 'factor permutations S₄; the exchange P (FS1b, Q2d)', OC: 'S² commutes with the S₄ action (FS2e)'}),
 ('Mass balance', {SS: 'permutations of equal masses; O(d) (MB1b)', GS: 'the configuration\'s isometries (stabilizer, MB1b)', OC: 'the second-moment tensor commutes with the stabilizer isometries (MB2c)'}),
 ('Simplex projection', {SS: 'permutations of the source basis', OC: 'Pₙ commutes with them (TRA4b, Q2f)'}),
]
MISSING = {'R5': 'SOURCE MISSING: Hermite functions as eigenfunctions of the Fourier transform (textbook); no source verified in Pass 2'}
MATH_STATUS = {'CF11-A': 'TEXTBOOK / KNOWN', 'CF11-B': 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'CF11-R': 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'CF12': 'TEXTBOOK / KNOWN',
               'CF1': 'TEXTBOOK / KNOWN', 'TA1': 'TEXTBOOK / KNOWN', 'TA2': 'TEXTBOOK / KNOWN', 'TA2I': 'TEXTBOOK / KNOWN', 'TA3': 'TEXTBOOK / KNOWN', 'TA0': 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'TAH': 'SPECULATIVE MAPPING', 'RI0': 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'RI1': 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'RI2': 'PROJECT-DERIVED FROM KNOWN DEFINITIONS'}
NOVELTY = {'TA1': 'KNOWN MATHEMATICS', 'TA2': 'KNOWN MATHEMATICS', 'TA2I': 'KNOWN MATHEMATICS', 'TA3': 'KNOWN MATHEMATICS', 'CF1': 'KNOWN MATHEMATICS', 'CF12': 'KNOWN MATHEMATICS', 'TA0': 'PROJECT ARCHITECTURAL SYNTHESIS', 'TAH': 'PROJECT ARCHITECTURAL SYNTHESIS (open)', 'RI0': 'PROJECT ARCHITECTURAL SYNTHESIS', 'RI1': 'KNOWN MATHEMATICS (examples); PROJECT CLASSIFICATION', 'RI2': 'PROJECT CLASSIFICATION OF KNOWN MATHEMATICS'}

STRENGTHS = ['EXACT IDENTITY', 'EXACT IMPLICATION', 'THEOREM', 'SPECIAL-CASE CONSTRUCTION', 'STRUCTURAL ANALOGUE', 'OPEN CONNECTION', 'FAILED CONNECTION']
EI, EIM, THM, SCC, SAN, OPC, FC = STRENGTHS
SOURCE_STATUSES = ['METADATA VERIFIED; CLAIM NOT QUOTED', 'METADATA PARTLY VERIFIED; CLAIM NOT QUOTED', 'METADATA VERIFIED; CLAIM SNIPPET-CONFIRMED; PDF PENDING',
                   'PROJECT NOTE (not an external source)', 'APPLICATION PROVENANCE INCOMPLETE']
SV, SP, SQ, SN, SA = SOURCE_STATUSES
SOURCE_CLASSES = ['primary', 'textbook', 'review', 'project note', 'application']
CHK = 'bibliographic record checked by web search of publisher / index records, 2026-11-12; full text not opened in this environment'
S = []
def src(id, authors, title, year, typ, ident, cls, status, claim, not_est, supports=(), bears=(), checked=CHK):
    S.append(dict(id=id, authors=authors, title=title, year=year, sourceType=typ, identifier=ident, sourceClass=cls, status=status, claim=claim,
                  doesNotEstablish=not_est, supports=list(supports), bearsOn=list(bears), checked=checked))

# Fourier, translation, uncertainty
src('SRC-STEIN-SHAKARCHI-2003', 'Elias M. Stein; Rami Shakarchi', 'Fourier Analysis: An Introduction (Princeton Lectures in Analysis I)', '2003', 'book', 'Princeton University Press; ISBN 978-0-691-11384-5', 'textbook', SV,
    'Fourier series and transform: orthonormal exponentials, Parseval / Plancherel, translation ↔ multiplication by a phase, conjugate symmetry for real functions, mean-square convergence, Weyl equidistribution, the Heisenberg uncertainty inequality (in the book\'s 2π normalization)',
    'the project\'s defect identities (T3, T4: project-derived, FB1–FB2); anything about physical pairs (P2) or about periodicity of rule-bound geometries (★)', ['R1', 'R2', 'R3', 'R4', 'R6', 'Z7', 'P1', 'I1', 'T5', 'TA3'], ['P2', 'I2'])
src('SRC-WIENER-1930', 'Norbert Wiener', 'Generalized harmonic analysis', '1930', 'journal article', 'Acta Mathematica 55, 117–258; DOI 10.1007/BF02546511', 'primary', SV,
    'the spectrum of a signal with finite power is the Fourier transform of its autocorrelation (the deterministic Wiener–Khinchin relation)',
    'the project\'s defect identity D_x(τ) = 1 − Re⟨x, T_τx⟩/‖x‖² (project-derived, FB1b); that the spectrum determines the signal (it does not, FB1d)', ['T3'])
src('SRC-KHINTCHINE-1934', 'A. Khintchine', 'Korrelationstheorie der stationären stochastischen Prozesse', '1934', 'journal article', 'Mathematische Annalen 109, 604–615; DOI 10.1007/BF01449156', 'primary', SV,
    'the stationary-process form: the correlation function of a (wide-sense) stationary process is the Fourier transform of a spectral measure',
    'the energy-signal form used here (a convolution-theorem corollary, FB1c); the defect identity', ['T3'])
src('SRC-KENNARD-1927', 'E. H. Kennard', 'Zur Quantenmechanik einfacher Bewegungstypen', '1927', 'journal article', 'Zeitschrift für Physik 44, 326–352 (DOI not verified)', 'primary', SP,
    'σ_x σ_p ≥ ħ/2, the first rigorous form of Heisenberg\'s relation; in Fourier variables Δt·Δω ≥ 1/2',
    'the second-moment defect identity (T4, a different statement); the project\'s sensitivity hypothesis (T-SENSITIVITY)', ['T5'])
src('SRC-FOLLAND-SITARAM-1997', 'Gerald B. Folland; Alladi Sitaram', 'The uncertainty principle: a mathematical survey', '1997', 'review article', 'Journal of Fourier Analysis and Applications 3(3), 207–238; DOI 10.1007/BF02649110', 'review', SV,
    'Heisenberg\'s inequality on L²(ℝ) with the e^{−2πixξ} convention, equality exactly for Gaussians (up to translation and modulation), and related uncertainty principles',
    'the project\'s ω-convention constant (converted and checked in FB3c); the defect identity (T4)', ['T5'])
# linear algebra, groups, forms, mechanics
src('SRC-AXLER-2015', 'Sheldon Axler', 'Linear Algebra Done Right (3rd ed.)', '2015', 'book', 'Springer, Undergraduate Texts in Mathematics; DOI 10.1007/978-3-319-11080-6', 'textbook', SV,
    'inner-product spaces: orthogonality, the Pythagorean theorem, orthonormal bases and expansions, orthogonal projections (residual orthogonal to the range), Gram–Schmidt, the spectral theorem for self-adjoint operators, kernels, positive definiteness',
    'any reading of "0 is orthogonal" beyond ⟨0, v⟩ = 0 (ON6); that orthogonality generates form (ON8)', ['ON1', 'ON2', 'ON3', 'ON4', 'ON5', 'Z1', 'Z3', 'Z4', 'Z10'], ['ON6', 'ON8'])
src('SRC-DUMMIT-FOOTE-2004', 'David S. Dummit; Richard M. Foote', 'Abstract Algebra (3rd ed.)', '2004', 'book', 'John Wiley & Sons (ISBN not verified)', 'textbook', SP,
    'group actions, orbits and stabilizers; |orbit| · |stabilizer| = |G|', 'the project\'s symmetry defect (T2, project-defined)', ['T1'])
src('SRC-FULTON-HARRIS-1991', 'William Fulton; Joe Harris', 'Representation Theory: A First Course (Graduate Texts in Mathematics 129)', '1991', 'book', 'Springer; DOI 10.1007/978-1-4612-0979-9 (later printing)', 'textbook', SV,
    'the classical groups as groups preserving a bilinear form (AᵀMA = M) and their Lie algebras (XᵀM + MX = 0); Schur\'s lemma; representations of the symmetric group; Schur–Weyl duality',
    'that the project\'s geometries are organized by preserved relations (CF11-B); a label beyond Schur–Weyl for four spins (Q-SYM-NOVEL)', ['CF1', 'CF2', 'CF4', 'CF11-A', 'CF12', 'TA2', 'TA3', 'QZ3'], ['CF11-B'])
src('SRC-KLEIN-1872', 'Felix Klein', 'Vergleichende Betrachtungen über neuere geometrische Forschungen (the Erlangen program)', '1872 (reprinted 1893)', 'programme / journal article', 'Erlangen, 1872; Mathematische Annalen 43, 63–100 (1893); EuDML 157672 (no DOI found)', 'primary', SV,
    'a geometry is studied through the invariants of a group of transformations of a space; different groups give different geometries',
    'CF11-B (the project hypothesis); that every geometry the project needs is a preserved-relation geometry (CF3 is a counter-case)', ['CF11-A'], ['CF11-B'])
src('SRC-ARNOLD-1989', 'V. I. Arnold', 'Mathematical Methods of Classical Mechanics (2nd ed., Graduate Texts in Mathematics 60)', '1989', 'book', 'Springer; DOI 10.1007/978-1-4757-2063-1', 'textbook', SV,
    'Hamilton\'s equations ż = J∇H and conservation of a time-independent H; the symplectic form and skew-orthogonality; Noether\'s theorem for Lagrangian systems with a one-parameter symmetry group; the centre of mass of a system',
    'Noether\'s theorem for fields and the second theorem; anything about zero', ['CF4', 'CF5', 'CF6', 'CF7', 'CF12', 'Z2'])
src('SRC-NOETHER-1918', 'Emmy Noether (English translation by M. A. Tavel)', 'Invariante Variationsprobleme / Invariant variation problems', '1918 (translation 1971)', 'journal article + translation',
    'Nachr. Ges. Wiss. Göttingen, Math.-Phys. Kl. 1918, 235–257; Transport Theory and Statistical Physics 1(3), 1971 (start page 183 or 186 in different records); arXiv:physics/0503066', 'primary', SV,
    'invariance of a variational problem under a finite continuous group gives as many conserved quantities (first theorem); invariance under an infinite group gives identities (second theorem)',
    'the project\'s linear-flow card CF5 (a special case derived separately); conservation from a symmetry introduced after inspection (B-INDEPENDENT-SYMMETRY)', ['CF7'])
# relativity and dispersion
src('SRC-EINSTEIN-1905', 'Albert Einstein', 'Zur Elektrodynamik bewegter Körper', '1905', 'journal article', 'Annalen der Physik 17 (vol. 322 in continuous numbering), 891–921; DOI 10.1002/andp.19053221004', 'primary', SV,
    'the Lorentz transformation from the relativity principle and the constancy of c; relativistic velocity addition', 'the metric form ΛᵀηΛ = η (Minkowski); the two roles of c (L4)', ['L1', 'L2', 'MW2'], ['L4'])
src('SRC-MINKOWSKI-1909', 'Hermann Minkowski', 'Raum und Zeit', '1909', 'lecture (journal print)', 'Physikalische Zeitschrift 10, 104–111 (lecture of 21 September 1908; no DOI found)', 'primary', SV,
    'spacetime with an invariant interval; Lorentz transformations as the transformations preserving it; the light cone', 'L4; anything about model manifolds', ['L1', 'Z5'], ['L4'])
src('SRC-INONU-WIGNER-1953', 'E. İnönü; E. P. Wigner', 'On the contraction of groups and their representations', '1953', 'journal article', 'Proceedings of the National Academy of Sciences 39(6), 510–524; DOI 10.1073/pnas.39.6.510', 'primary', SV,
    'group contraction: a singular limit of the generators gives a new group; the relativistic group contracts to the Galilei group as c → ∞',
    'Nadia\'s deeper hypothesis that the same parameter participating in invariant geometry and theory transition may encode a deeper structural relation (L4, project-origin)', ['L3'], ['L4'])
src('SRC-LEVY-LEBLOND-1965', 'Jean-Marc Lévy-Leblond', 'Une nouvelle limite non-relativiste du groupe de Poincaré', '1965', 'journal article', 'Annales de l\'I.H.P. Section A 3(1), 1–12 (Numdam AIHPA_1965__3_1_1_0)', 'primary', SV,
    'a second contraction of the Poincaré group (the Carroll limit), distinct from the Galilean one', 'L4: it shows the Galilean limit is one of several contractions, not that the two roles of c are linked', ['L3'], ['L4'])
src('SRC-DEBROGLIE-1925', 'Louis de Broglie', 'Recherches sur la théorie des quanta', '1925', 'thesis (journal print)', 'Annales de Physique, 10e série, 3, 22–128; DOI 10.1051/anphys/192510030022', 'primary', SV,
    'a frequency and wavelength associated with a material particle (E = hν, p = h/λ), consistent with relativistic energy and momentum', 'that mass is waves in Nadia\'s sense (MW1 stays a hypothesis)', ['MW2'], ['MW1'])
src('SRC-KLEIN-GORDON-1926', 'Oskar Klein; Walter Gordon', 'Quantentheorie und fünfdimensionale Relativitätstheorie; Der Comptoneffekt nach der Schrödingerschen Theorie', '1926', 'journal articles', 'Zeitschrift für Physik 37, 895–906 (Klein); 40, 117–133 (Gordon); DOIs not verified', 'primary', SP,
    'the relativistic scalar wave equation, whose plane waves satisfy ω² = c²k² + m²c⁴/ħ²', 'MW1; any field-theory interpretation', ['MW2'], ['MW1'])
# wavelets and scattering
src('SRC-GROSSMANN-MORLET-1984', 'A. Grossmann; J. Morlet', 'Decomposition of Hardy functions into square integrable wavelets of constant shape', '1984', 'journal article', 'SIAM Journal on Mathematical Analysis 15(4), 723–736; DOI 10.1137/0515056', 'primary', SV,
    'the continuous wavelet transform with an admissible wavelet (finite ∫|ψ̂|²/|ω|) and its reconstruction formula', 'scattering; DYADIC PACKETS; any project zero hypothesis', ['W1'])
src('SRC-DAUBECHIES-1992', 'Ingrid Daubechies', 'Ten Lectures on Wavelets (CBMS-NSF Regional Conference Series in Applied Mathematics 61)', '1992', 'book', 'SIAM; ISBN 0-89871-274-2 (DOI not verified)', 'textbook', SP,
    'admissibility and zero mean of wavelets, the continuous wavelet transform, frames, orthonormal bases of compactly supported dyadic wavelets', 'the meaning of DYADIC PACKETS (open; not identified with dyadic wavelet decompositions)', ['W1'])
src('SRC-MALLAT-2009', 'Stéphane Mallat', 'A Wavelet Tour of Signal Processing: The Sparse Way (3rd ed.)', '2009', 'book', 'Academic Press / Elsevier; ISBN 978-0-12-374370-1', 'textbook', SV,
    'the wavelet transform as convolution with dilated wavelets, its translation covariance, admissibility; wavelet packets (the standard definition)', 'that standard wavelet packets are DYADIC PACKETS (an open user term)', ['W1', 'W2'])
src('SRC-MALLAT-2012', 'Stéphane Mallat', 'Group Invariant Scattering', '2012', 'journal article', 'Communications on Pure and Applied Mathematics 65(10), 1331–1398; DOI 10.1002/cpa.21413; arXiv:1101.2286', 'primary', SV,
    'the scattering transform (iterated wavelet convolutions and moduli along paths, then low-pass averaging); translation invariance in the limit of large averaging scale (translation insensitivity at finite scale); Lipschitz continuity to the action of C² diffeomorphisms (deformation stability); norm preservation; all under the paper\'s admissibility conditions, whose exact statements are not quoted here',
    'the zero theory; that information is hidden inside every zero; DYADIC PACKETS', ['W2'], ['W4'])
src('SRC-BRUNA-MALLAT-2013', 'Joan Bruna; Stéphane Mallat', 'Invariant Scattering Convolution Networks', '2013', 'journal article', 'IEEE Transactions on Pattern Analysis and Machine Intelligence 35(8), 1872–1886; DOI 10.1109/TPAMI.2012.230; arXiv:1203.1513', 'primary', SV,
    'windowed scattering networks; higher-order coefficients restore high-frequency information that averaging removes at first order; in the reported experiments most energy lies in paths of order ≤ 2',
    'that higher orders recover all information; anything about zeros', ['W2'], ['W4'])
# Fisher geometry and model manifolds
src('SRC-RAO-1945', 'C. Radhakrishna Rao', 'Information and the accuracy attainable in the estimation of statistical parameters', '1945', 'journal article', 'Bulletin of the Calcutta Mathematical Society 37(3), 81–91 (81–89 in some records); reprinted in Breakthroughs in Statistics I (Springer, 1992), DOI 10.1007/978-1-4612-0919-5_16', 'primary', SV,
    'the Fisher information matrix as a Riemannian metric on a parametric family (with the Cramér–Rao bound)', 'the least-squares form JᵀJ/σ² (a derived special case, FB6a); sloppiness; C7', ['CF10'], ['M4'])
src('SRC-AMARI-2016', 'Shun-ichi Amari', 'Information Geometry and Its Applications (Applied Mathematical Sciences 194)', '2016', 'book', 'Springer; DOI 10.1007/978-4-431-55978-8', 'textbook', SV,
    'the Fisher metric, its reparametrization invariance, and the singular (degenerate) regions of models where parameters are not identifiable', 'the Transtrum–Sethna model-manifold results; C7', ['CF10', 'Z9', 'CF13'], ['M4'])
src('SRC-TMS-2010', 'Mark K. Transtrum; Benjamin B. Machta; James P. Sethna', 'Why are nonlinear fits to data so challenging?', '2010', 'journal article', 'Physical Review Letters 104, 060201; DOI 10.1103/PhysRevLett.104.060201; arXiv:0909.3884', 'primary', SV,
    'the model manifold of predictions is typically bounded, with widths spread over many orders of magnitude (a hyperribbon); geodesic acceleration for Levenberg–Marquardt', 'C7 (no relation between coefficient decay and Fisher spectra)', ['R7', 'M1', 'M2'], ['M4'])
src('SRC-TMS-2011', 'Mark K. Transtrum; Benjamin B. Machta; James P. Sethna', 'Geometry of nonlinear least squares with applications to sloppy models and optimization', '2011', 'journal article', 'Physical Review E 83, 036701; DOI 10.1103/PhysRevE.83.036701; arXiv:1010.1449', 'primary', SV,
    'least squares as geometry in data space: the model manifold, the induced metric JᵀJ (the Fisher metric for unit Gaussian noise), boundaries, hyperribbons, parameter-effects curvature', 'C7; Quinn et al.\'s c-boundary claim', ['R7', 'CF10', 'Z9', 'M2'], ['M4'])
src('SRC-GUTENKUNST-2007', 'Gutenkunst; Waterfall; Casey; Brown; Myers; Sethna', 'Universally sloppy parameter sensitivities in systems biology models', '2007', 'journal article', 'PLoS Computational Biology 3(10), e189; DOI 10.1371/journal.pcbi.0030189', 'primary', SV,
    '17 systems-biology models all show sloppy sensitivity spectra (eigenvalues roughly evenly spread over many decades)', 'that every model is sloppy; the S14a threshold (a project choice; the FAIL is kept)', ['M1'])
src('SRC-MACHTA-2013', 'Benjamin B. Machta; Ricky Chachra; Mark K. Transtrum; James P. Sethna', 'Parameter space compression underlies emergent theories and predictive models', '2013', 'journal article', 'Science 342(6158), 604–607; DOI 10.1126/science.1238723; arXiv:1303.6738', 'primary', SV,
    'a few stiff parameter combinations control macroscopic predictions; coarse-graining compresses parameter space, linking sloppiness to emergent effective theories', 'a general answer to the effective-representation question (H6); C7', ['M2'], ['H6', 'M4'])
src('SRC-TRANSTRUM-QIU-2014', 'Mark K. Transtrum; Peng Qiu', 'Model reduction by manifold boundaries', '2014', 'journal article', 'Physical Review Letters 113, 098701 (DOI not individually confirmed)', 'primary', SP,
    'the manifold boundary approximation method (MBAM): follow a geodesic to a boundary of the model manifold to obtain a reduced model; tested on sums of exponentials, a signalling model and a generalized Ising model',
    'that every reduction is a boundary; FB11c checks one boundary limit, not the MBAM procedure', ['M2'], ['H6'])
src('SRC-QUINN-2023', 'Katherine N. Quinn; Michael C. Abbott; Mark K. Transtrum; Benjamin B. Machta; James P. Sethna', 'Information geometry for multiparameter models: new perspectives on the origin of simplicity', '2023', 'review article',
    'Reports on Progress in Physics 86, 035901; DOI 10.1088/1361-6633/aca6f8; arXiv:2111.07176; source card research/sources/quinn2023.md', 'review', SQ,
    'review of model manifolds, sloppiness, hyperribbons, boundaries and effective models; the specific claim used: c as a model parameter, whose c → ∞ boundary gives Newtonian kinematics',
    'C9 (the degeneration of spacetime\'s form, Gate 3); that spacetime geometry is model-manifold geometry; C7', ['R7', 'M1', 'M2'], ['L4', 'M4'],
    checked='bibliographic record verified; the claim is confirmed by search-engine snippets only; PDF pending (P-2)')
# reductions
src('SRC-JOHNSON-GOODY-2011', 'Kenneth A. Johnson; Roger S. Goody (translating L. Michaelis and M. L. Menten)', 'The original Michaelis constant: translation of the 1913 Michaelis–Menten paper', '2011', 'journal article (translation of a primary source)',
    'Biochemistry 50(39), 8264–8269; DOI 10.1021/bi201284u. Original: Biochemische Zeitschrift 49, 333–369 (1913), as cited there', 'primary', SV,
    'the 1913 rate law v = V S/(K + S), derived by Michaelis and Menten under a rapid-equilibrium assumption, with a modern translation and reanalysis', 'the quasi-steady-state K_M = (k₋₁ + k₂)/k₁ (Briggs–Haldane); validity conditions (Segel–Slemrod)', ['M3'])
src('SRC-BRIGGS-HALDANE-1925', 'G. E. Briggs; J. B. S. Haldane', 'A note on the kinetics of enzyme action', '1925', 'journal article', 'Biochemical Journal 19(2), 338–339; DOI 10.1042/bj0190338', 'primary', SV,
    'the quasi-steady-state derivation of the Michaelis–Menten rate with K_M = (k₋₁ + k₂)/k₁', 'the validity condition (Segel–Slemrod)', ['M3'])
src('SRC-SEGEL-SLEMROD-1989', 'Lee A. Segel; Marshall Slemrod', 'The quasi-steady-state assumption: a case study in perturbation', '1989', 'journal article', 'SIAM Review 31(3), 446–477; DOI 10.1137/1031091', 'primary', SV,
    'the QSSA as a singular-perturbation reduction, with time-scale estimates giving the small parameter ε = e₀/(S₀ + K_M)', 'the effective-representation question in general (H6)', ['M3'], ['H6'])
src('SRC-KADANOFF-1966', 'Leo P. Kadanoff', 'Scaling laws for Ising models near T_c', '1966', 'journal article', 'Physics Physique Fizika 2(6), 263–272; DOI 10.1103/PhysicsPhysiqueFizika.2.263', 'primary', SV,
    'block-spin coarse-graining of the Ising model near the critical point, leading to scaling laws', 'any carded statement here (source-only); H6 in general', [], ['H6'])
src('SRC-WILSON-KOGUT-1974', 'Kenneth G. Wilson; J. Kogut', 'The renormalization group and the ε expansion', '1974', 'review article', 'Physics Reports 12(2), 75–199 (end page 200 in some records); DOI 10.1016/0370-1573(74)90023-4', 'review', SV,
    'the renormalization group: fixed points, relevant and irrelevant directions, the ε expansion', 'any carded statement here (source-only); H6 in general', [], ['H6'])
src('SRC-NELSON-FISHER-1975', 'David R. Nelson; Michael E. Fisher', 'Soluble renormalization groups and scaling fields for low-dimensional Ising systems', '1975', 'journal article', 'Annals of Physics 91, 226–274; DOI 10.1016/0003-4916(75)90284-5', 'primary', SV,
    'exactly soluble decimation renormalization groups for one-dimensional Ising systems (the zero-field recursion tanh K′ = tanh²K is carded in FB11d; its location in the paper is not quoted)', 'RG fixed-point theory in general; H6 in general', ['H7'], ['H6'])
# quantum
src('SRC-SAKURAI-2017', 'J. J. Sakurai; Jim Napolitano', 'Modern Quantum Mechanics (2nd ed.)', '2017', 'book', 'Cambridge University Press; ISBN 978-1-108-42241-3; DOI 10.1017/9781108499996 (digital edition)', 'textbook', SV,
    'addition of spin-½ angular momenta: S_z and S² eigenstates, the triplet and the singlet', 'the project\'s zero-preserving descriptors (QZ2, QZ3); Q-SYM-NOVEL', ['Z6', 'QZ1'])
src('SRC-NIELSEN-CHUANG-2010', 'Michael A. Nielsen; Isaac L. Chuang', 'Quantum Computation and Quantum Information (10th anniversary ed.)', '2010', 'book', 'Cambridge University Press; ISBN 978-1-107-00217-3 (DOI not verified)', 'textbook', SP,
    'projective measurement and the non-selective measurement map (off-diagonal blocks removed); dephasing', 'that dephasing and which-path marking are one physical mechanism (generic map only, BR26); B-ZERO-LOSS', ['QZ4'])
# differential geometry (Pass 3)
src('SRC-LEE-2018', 'John M. Lee', 'Introduction to Riemannian Manifolds (2nd ed., Graduate Texts in Mathematics 176)', '2018', 'book', 'Springer; DOI 10.1007/978-3-319-91755-9', 'textbook', SV,
    'tensor fields and their transformation law under coordinate changes; pullbacks; isometries (F*g = g); Gaussian curvature as an isometry invariant; isometries of flat space', 'any project architecture claim (CF11-B, CF11-R, TA0)', ['CF12', 'CF13', 'TA1', 'TA2', 'TA2I'], ['CF11-B', 'CF11-R', 'TA0'])
src('SRC-MYERS-STEENROD-1939', 'S. B. Myers; N. E. Steenrod', 'The group of isometries of a Riemannian manifold', '1939', 'journal article', 'Annals of Mathematics 40(2), 400–416; DOI 10.2307/1968928', 'primary', SV,
    'the isometry group of a Riemannian manifold is a Lie group (finite-dimensional), and distance-preserving maps are smooth isometries', 'that a given (e.g. Fisher) metric has nontrivial isometries; generic metrics have none', ['CF12'], ['CF11-B'])
src('SRC-CHENTSOV-1982', 'N. N. Čencov (Chentsov)', 'Statistical Decision Rules and Optimal Inference (Translations of Mathematical Monographs 53)', '1982', 'book', 'American Mathematical Society (some records give 1981; ISBN not verified)', 'primary', SP,
    'the Fisher metric is, up to scale, the unique Riemannian metric on statistical models invariant under sufficient statistics (Markov morphisms): a naturality theorem for the Fisher metric', 'the project\'s CF11 architecture or Transformation Architecture; anything about sloppiness or C7. KNOWN THEOREM, NOT YET INTEGRATED: bears on CF13 and TAC; not used as evidence', [], ['TAC', 'CF13'])
# project notes and application work
src('SRC-PROJECT-SPEC', 'assistant-written project document', 'Mathematical Basis and Interactive Design Spec', '2026', 'project note', 'docs/Mathematical_Basis_Interactive_Design_Spec.md', 'project note', SN,
    'the project\'s block-by-block plan; it supports no external claim', 'any external mathematical claim', [], [], checked='repository file')
src('SRC-THERMALENS', 'Nadia (prior project / application work)', 'ThermaLens / Energeo implementation mathematics', '—', 'application work', 'not in this repository', 'application', SA,
    'none recorded: the implementation mathematics is not available here', 'any Foundation claim; it does not count toward upstream validation', [], ['A1', 'A2'], checked='not available')

# Bridge strength classes, sources, assumptions and failure conditions (plus Pass 2 connector / card / scope updates)
BMETA = {
 'BR1': (EI, ['SRC-AXLER-2015'], 'an inner-product space', 'none for the identity; readings C and D of "0 is orthogonal" are not implied'),
 'BR2': (THM, ['SRC-AXLER-2015'], 'an orthonormal basis (complete, for L²)', 'non-orthogonal frames also decompose: orthogonality is sufficient, not necessary'),
 'BR3': (EI, ['SRC-AXLER-2015'], 'mutually orthogonal components', 'nonzero cross terms between components'),
 'BR4': (THM, ['SRC-STEIN-SHAKARCHI-2003'], 'an orthonormal basis; f ∈ L²', 'none for the theorem (phase is not seen)'),
 'BR5': (EI, ['SRC-STEIN-SHAKARCHI-2003'], 'the project convention x̂(ω) = ∫x e^{−iωt}dt (series: e_k = e^{2πikt})', 'another sign convention flips the sign of the phase'),
 'BR6': (EI, [], 'x ∈ L², x ≠ 0; T_τ unitary; the project\'s normalization', 'a non-unitary transformation (the defect formula changes)'),
 'BR7': (THM, ['SRC-WIENER-1930', 'SRC-KHINTCHINE-1934', 'SRC-STEIN-SHAKARCHI-2003'], 'energy signals (convolution theorem) or wide-sense stationary processes (Khintchine)', 'the spectrum does not determine the signal (FB1d)'),
 'BR8': (EIM, [], 'a unitary representation U_g', 'a non-unitary U_g'),
 'BR9': (EI, [], 'a finite spectral second moment (x′ ∈ L²)', 'the box function: D = |τ|, not twice differentiable (FB2c)'),
 'BR10': (EIM, ['SRC-FULTON-HARRIS-1991'], 'a bilinear or sesquilinear form B_M', 'zero-resultant preservation is not a form preservation (CF3)'),
 'BR11': (THM, ['SRC-FULTON-HARRIS-1991', 'SRC-ARNOLD-1989'], 'a one-parameter group exp(sK); constant M', 'none for the theorem'),
 'BR12': (THM, ['SRC-NOETHER-1918', 'SRC-ARNOLD-1989'], 'a Lagrangian with a continuous symmetry, on solutions; or constant antisymmetric J with time-independent H', 'no symmetry (FB5b); explicit time dependence (FB5c)'),
 'BR13': (SCC, ['SRC-STEIN-SHAKARCHI-2003'], 'the two stated maps', 'a bounded geometry without repetition would not follow (★ is open)'),
 'BR14': (EI, ['SRC-MINKOWSKI-1909', 'SRC-EINSTEIN-1905'], 'η_c = diag(1, −1/c²) in 1 + 1 dimensions', 'none for the identity'),
 'BR15': (THM, ['SRC-INONU-WIGNER-1953', 'SRC-LEVY-LEBLOND-1965'], 'c → ∞ with the time coordinate fixed', 'the c → 0 contraction is a different group (Carroll)'),
 'BR16': (EI, ['SRC-RAO-1945', 'SRC-AMARI-2016', 'SRC-TMS-2011'], 'independent Gaussian noise with equal known σ; differentiable Y(θ)', 'unequal noise levels: JᵀΣ⁻¹J (FB6b)'),
 'BR17': (EIM, ['SRC-AMARI-2016', 'SRC-TMS-2011'], 'g = JᵀJ/σ² positive semidefinite', 'a small nonzero eigenvalue is sloppy, not null (FB7c)'),
 'BR18': (EIM, ['SRC-GROSSMANN-MORLET-1984', 'SRC-DAUBECHIES-1992'], 'ψ ∈ L¹ ∩ L², admissible', 'a nonzero-mean filter is not admissible (FB10b)'),
 'BR19': (THM, ['SRC-MALLAT-2012', 'SRC-BRUNA-MALLAT-2013'], 'admissible wavelets and an averaging scale, with the exact hypotheses of the source', 'the first-order invariant is many-to-one (FB10c)'),
 'BR20': (SCC, [], 'orthonormal source; orthogonal projection onto 1^⊥; source class known', 'source class unknown (G4c)'),
 'BR21': (SCC, ['SRC-FULTON-HARRIS-1991'], 'an independently supplied group acting covariantly; a hidden quadratic commuting with it', 'the roles invert between spins and masses'),
 'BR22': (EI, [], 'positive weights', 'Σm = 0 or non-positive weights'),
 'BR23': (SCC, [], 'equal masses at r_i = e_i', 'unequal masses (G4m)'),
 'BR24': (EIM, [], 'a zero sum and full S_n symmetry', 'the converse fails (FS2d)'),
 'BR25': (EIM, ['SRC-AXLER-2015'], 'L linear', 'nonlinear and inherited zeros (Z5a, G4c)'),
 'BR26': (EI, ['SRC-NIELSEN-CHUANG-2010'], 'a non-selective projective measurement', 'a selective measurement; the same physical mechanism as which-path is not shown'),
 'BR27': (EIM, ['SRC-DEBROGLIE-1925', 'SRC-KLEIN-GORDON-1926', 'SRC-EINSTEIN-1905'], 'E = ħω and p = ħk as inputs', 'without these inputs; non-relativistic dispersion (FB8c)'),
 'BR28': (OPC, [], 'none established', 'S14a FAIL kept; no operator found'),
}
UPD = {'BR5': dict(cards=['FB1a']), 'BR6': dict(cards=['FB1b'], scope='project-specific'), 'BR7': dict(cards=['FB1c', 'FB1d'], connector='∫⟨x, T_τx⟩e^{iωτ}dτ = |x̂(ω)|² (energy signals); Wiener–Khinchin: power spectrum = transform of the autocorrelation'),
       'BR8': dict(scope='project-specific'), 'BR9': dict(cards=['FB2a', 'FB2b', 'FB2c', 'FB2d'], scope='project-specific', connector='D_x\'\'(0) = ∫ω² dμ_x (exact, finite second moment); D_x(τ) = (τ²/2)∫ω² dμ_x + o(τ²)'),
       'BR12': dict(cards=['FB5a', 'FB5b', 'FB5c'], doesNotProve='that the project\'s linear card is Noether\'s theorem: the general theorem is source-only (FB5 cards one instance)'),
       'BR16': dict(cards=['FB6a', 'FB6b']), 'BR17': dict(cards=['FB7a', 'FB7b', 'FB7c']), 'BR18': dict(cards=['FB10a', 'FB10b']),
       'BR19': dict(cards=['FB10c'], doesNotProve='that this mechanism equals Fourier phase loss or dephasing; that Mallat\'s theorems bear on the zero hypothesis as proof'),
       'BR27': dict(cards=['FB8a', 'FB8b', 'FB8c'])}
for b in B:
    for k, v in UPD.get(b['id'], {}).items():
        b[k] = b[k] + [c for c in v if c not in b[k]] if k == 'cards' else v
bridge('BR29', 'symplectic self-pairing', 'Lorentz quadratic null', 'ω(v, v) = vᵀJv = 0 for every v (alternating); q_η(v) = vᵀηv = 0 only on the light cone', 'ESTABLISHED', EST, ['FB9a', 'FB9b'],
       'that "null" names one object: alternating self-pairing zero ≠ Lorentz quadratic null vector', ['CF6', 'Z5'])
bridge('BR30', 'statistical null', 'Lorentz null', 'for g ⪰ 0: vᵀgv = 0 ⟺ gv = 0 ⟺ Jv = 0; for η: vᵀηv = 0 with ηv ≠ 0', 'ESTABLISHED', EST, ['FB7b', 'FB7d'], 'that a model-manifold null and a light-like vector are one kind of zero', ['Z9', 'Z5'])
bridge('BR31', 'spectral second moment', 'uncertainty', 'for real x with finite moments: D_x\'\'(0) = Δω² ≥ 1/(4Δt²)', 'DERIVED', PS, ['FB2d', 'FB3d'], 'that the defect identity is the uncertainty theorem (two different results)', ['T4', 'T5'])
bridge('BR32', 'quasi-steady state', 'reduced rate law', 'dC/dt = 0 ⇒ rate = V_max S/(K_M + S): (k₁, k₋₁, k₂) → (K_M, V_max)', 'ESTABLISHED', EST, ['FB11a', 'FB11b'], 'that every reduction is one mechanism (H6)', ['M3', 'H6'])
bridge('BR33', 'manifold boundary', 'reduced model', 'θ₂ → ∞: e^{−θ₁t} + e^{−θ₂t} → e^{−θ₁t}, ∂Y/∂θ₂ → 0', 'ESTABLISHED', EST, ['FB11c'], 'the MBAM procedure in general', ['M2', 'H6'])
bridge('BR34', 'decimation', 'renormalized coupling', 'Σ_{s₂} e^{Ks₂(s₁+s₃)} = A e^{K′s₁s₃}, tanh K′ = tanh²K', 'ESTABLISHED', EST, ['FB11d'], 'RG fixed-point theory in general; H6 beyond one example', ['H7', 'H6'])
bridge('BR36', 'matrix form AᵀMA = M', 'pullback F*T = T', '(F*B)(u, v) = uᵀ(AᵀMA)v for F(x) = Ax and constant B_M (A†HA = H for Hermitian forms); in general (F*T)_x = dF_xᵀ M(F(x)) dF_x', 'ESTABLISHED', EST,
       ['CFT1a', 'CFT1b'], 'that every geometry is pullback-invariant; that the preserving classes are alike; that a reparametrization is F*g = g (BR-CF-PULLBACK)', ['CF1', 'CF12'])
bridge('BR37', 'coordinate change', 'tensor law', 'θ = θ(φ): g_φ = Jᵀ g(θ(φ)) J, verified against direct Fisher computation; ds², vector lengths, K and rank invariant; component eigenvalues not', 'ESTABLISHED', EST,
       ['CFT3c', 'CFT4c', 'CFT4e', 'CFT5d', 'CFT5e'], 'that a coordinate change is a symmetry (it is never written F*g = g)', ['CF13', 'CF10'])
bridge('BR38', 'system-supplied symmetry', 'Fisher null', 'Y∘S = Y ⇒ S*g = g and Jv = 0 at fixed points for dS v = −v', 'DERIVED', PS, ['CFT5a', 'CFT5b', 'CFT5c'], 'that Fisher nulls require a symmetry (F-C′ has one without, CFT5c)', ['Z13', 'Z9'])
bridge('BR39', 'isometries of T', 'system-supplied transformations', 'normal family: the isometry group of g (3-dimensional) strictly contains the location–scale group (2-dimensional) induced by x ↦ ax + b', 'ESTABLISHED', EST, ['CFT11a', 'CFT4d'],
       'that "admissible" means "preserves T": the two classes differ', ['CF12', 'CF10'])
bridge('BR40', 'weighted centering (geometry-derived operator)', 'symmetries of (D, line span{1})', 'R3: C_m is a D-orthogonal, D-self-adjoint projector, not an isometry; A C_m = C_m A exactly for D-isometries preserving the line span{1}', 'ESTABLISHED', PS, ['CFT8a', 'CFT8b', 'CFT8c'],
       'that C_m is a structure-preserving transformation (it is a derived, equivariant operator)', ['H4', 'CF9'])
bridge('BR41', 'representation change', 'covariance', 'R1: x = Px′ gives M′ = PᵀMP; a metric changes as g_φ = Jᵀ g_θ J, vectors as v_φ = J⁻¹ v_θ; scalars (B(x, y), ds²) unchanged', 'ESTABLISHED', EST,
       ['TRA4a', 'CFT3c', 'CFT4c', 'CFT4e'], 'that a representation change is a symmetry or a physical change; lossy maps (projections) are not R1 (TRA4b)', ['TA1', 'CF13'])
bridge('BR42', 'structural symmetry', 'pullback invariance', 'R2: F is a symmetry of T ⟺ F*T = T ⟺ T_{F(x)}(dF u, dF v) = T_x(u, v)', 'ESTABLISHED', EST, ['CFT1b', 'CFT2a', 'CFT4d'],
       'that all geometry is F*T = T; that the preserving classes of different T are alike (CFT2c)', ['TA2', 'CF12'])
bridge('BR43', 'finite symmetry', 'infinitesimal generator', 'F_t*T = T for all t ⟹ L_X T = 0; matrix case A(t)ᵀMA(t) = M ⟹ KᵀM + MK = 0 (K†M + MK = 0)', 'ESTABLISHED', EST, ['TRA1a', 'TRA1b', 'TRA1c'],
       'conservation without Noether\'s assumptions; the converse (L_X T = 0 ⟹ global symmetry) needs a complete flow', ['TA2I', 'CF4'])
bridge('BR44', 'invariant form', 'invariant zero relation', 'F*T = T and T(u, v) = 0 ⟹ T(dF u, dF v) = 0; constant forms: A†MA = M ⟹ (B_M(x, y) = 0 ⟹ B_M(Ax, Ay) = 0)', 'ESTABLISHED', EST, ['TRA2a', 'TRA2b', 'C1b'],
       'that every zero is generated by symmetry or arises from a preserved form; the converse fails (2I keeps every zero, TRA2b)', ['TA2', 'CF2'])
bridge('BR45', 'symmetry', 'stabilizer', 'Aut(T) = {F : F*T = T} is the stabilizer of T under the action of maps on structures; for a group acting on x, G_x = {g : g·x = x}; D_x(g) = 0 ⟺ g ∈ G_x (Z8)', 'ESTABLISHED', EST,
       ['B5b', 'B5c', 'CFT4d'], 'that an automorphism group of a structure equals the signal stabilizer of Z8 (they act on different objects)', ['TA2', 'Z8', 'T1'])
bridge('BR46', 'Fourier transform', 'translation / modulation intertwining', 'R3: F T_a = M_a F, i.e. (T_a f)^(ω) = e^{−iωa} f̂(ω) for the continuous transform; for the finite DFT the identity holds for integer cyclic sample shifts modulo N (TRA3a; no interpolated shift is defined in the repository): translation in one representation ↔ phase multiplication in another', 'ESTABLISHED', EST,
       ['TRA3a', 'FB1a', 'S3'], 'that the Fourier transform is a physical spacetime symmetry; that T_a and M_a are the same operator', ['TA3', 'R4'])
bridge('BR47', 'commuting symmetry', 'representation-sector decomposition', 'an operator commuting with a group action preserves its isotypic sectors and is scalar on each multiplicity-free irreducible block (Schur)', 'ESTABLISHED', EST,
       ['FS2e', 'MB2c', 'Q2e'], 'labels beyond known ones (four spins: VALIDATION OF KNOWN MATHEMATICS); that particle exchange is universal', ['TA3', 'QZ3', 'Z12'])
bridge('BR48', 'projection', 'representation change', 'Pₙ is not invertible and does not keep inner products: (Pₙeᵢ)·(Pₙeⱼ) = −1/n for i ≠ j while eᵢ·eⱼ = 0, and |Pₙeᵢ|² = (n − 1)/n (G2n; the explicit n = 3 case gives −1/3, TRA4b); its transformation relationship is R3 (commutes with permutations)', 'ESTABLISHED', PS,
       ['TRA4b', 'G2n', 'Q2f'], 'that a lossy representation map is a covariant change of description', ['TA1', 'R8'])
bridge('BR49', 'information-changing map', 'fibers / collapse', 'linear Φ: Φ(x₁) = Φ(x₂) ⟺ x₁ − x₂ ∈ ker Φ; Pₙ: fibers x + span{1}; C_m: y + span{1}', 'ESTABLISHED', EST, ['RIC1a', 'RIC1b'],
       'that fibers are kernels in general (|x̂| and scattering are nonlinear: their fibers are not subspaces)', ['RI0', 'H1'])
bridge('BR50', 'collapsed zero', 'the zero fiber Φ⁻¹(0)', 'a target zero may have nonzero preimages: Φ⁻¹(0) (linear: ker Φ) is the set of source states collapsed to 0; x ≠ 0 with Φ(x) = 0 is a COLLAPSED ZERO (Pₙ1 = 0, C_m1 = 0); when Φ⁻¹(0) = {0} (an injective map) a target zero implies a zero source (RIC2c)', 'DERIVED', PS, ['RIC1a', 'RIC1b', 'RIC1d', 'RIC2c'],
       'that every target zero implies a nonzero hidden source; that all zeros arise from projection or are hidden higher dimensions; the zero taxonomy is broader', ['RI2', 'Z3', 'H1'])
bridge('BR51', 'preserved zero', 'collapsed zero', 'preserved: F*T = T keeps T(u, v) = 0 with dF u ≠ 0; collapsed: a non-invertible Φ sends x ≠ 0 to 0', 'ESTABLISHED', EST, ['RIC1d', 'TRA2a'],
       'that the two are one mechanism', ['RI2', 'TA2'])
bridge('BR52', 'information-changing map', 'equivariance', 'Φ ρ_X(g) = ρ_Y(g) Φ with Φ not invertible: Pₙ with permutations, C_m with D-isometries preserving span{1}, band-limiting with integer cyclic shifts, |x̂| invariant under shifts', 'DERIVED', PS,
       ['RIC1c', 'TRA4b', 'CFT8c', 'FB10c'], 'that equivariance makes a map lossless; that every reduction is equivariant', ['RI1', 'TA3', 'RI0'])
bridge('BR53', 'scattering operations', 'Reduction / Information-Changing Architecture', 'filtering (translation-covariant; a single channel need not be invertible, decided by the signal space and its multiplier; an undecimated bank is injective when its multipliers have no common zero on the stated signal space; a critically sampled bank needs an invertible polyphase system, R(z)E(z) = c z^(−K) I; the complete CWT admits reconstruction under admissibility), modulus (discards phase), finite-scale averaging (translation-covariant; local invariance at the averaging scale is source-only), global averaging (exactly invariant under circular shifts)', 'ESTABLISHED', EST, ['FB10a', 'FB10c', 'RIC2a', 'RIC2b', 'RIC3a', 'RIC3b', 'RIC3c', 'RIC3d'],
       'that Mallat proves hidden information in zero; that scattering is the universal form of reduction; higher-order recovery (source-only)', ['W2', 'RI0'])
bridge('BR54', 'model reduction / manifold boundary', 'Reduction / Information-Changing Architecture', 'placeholder: instances FB11a, FB11c; invariants, coordinate dependence and effective variables are for a later pass', 'OPEN', PS, ['FB11a', 'FB11c'],
       'what invariants survive, what coordinate dependence remains, which effective variables are retained (not pre-answered)', ['M2', 'M3', 'RI0'])
bridge('BR55', 'coarse-graining / RG', 'Reduction / Information-Changing Architecture', 'instance: 1D decimation (FB11d); general RG source-only', 'OPEN', PS, ['FB11d'],
       'equivalence with projection, wavelet packets, Mallat scattering or model manifolds', ['H7', 'RI0'])
bridge('BR56', 'transform', 'reduce', 'Transformation Architecture (R1 / R2 / R3) and Reduction / Information-Changing Architecture; intersection: information-changing maps that are also equivariant (RI1)', 'OPEN', PS, [],
       'that the project is governed by these two (OPEN PROJECT QUESTION, not promoted)', ['TA0', 'RI0', 'RI3'])
bridge('BR35', 'wavelet transform', 'translation', '(T_τx) ∗ ψ = T_τ(x ∗ ψ); Σ|x ⊛ ψ| invariant under circular shifts', 'ESTABLISHED', EST, ['FB10c'], 'deformation stability or higher-order recovery (source-only)', ['W2', 'R4'])
BMETA.update({
 'BR29': (FC, ['SRC-ARNOLD-1989', 'SRC-MINKOWSKI-1909'], 'J antisymmetric; η indefinite', 'none: the distinction holds for every antisymmetric J and indefinite η'),
 'BR30': (FC, ['SRC-AMARI-2016', 'SRC-MINKOWSKI-1909'], 'g positive semidefinite; η indefinite', 'none: the distinction holds for every such pair'),
 'BR31': (EIM, ['SRC-KENNARD-1927', 'SRC-FOLLAND-SITARAM-1997'], 'x real; finite second moments in t and ω', 'complex x adds ω̄² to D\'\'(0) (FB2d)'),
 'BR32': (THM, ['SRC-BRIGGS-HALDANE-1925', 'SRC-SEGEL-SLEMROD-1989'], 'mass action; e₀/(S₀ + K_M) ≪ 1', 'e₀ comparable to S₀ + K_M (FB11b)'),
 'BR33': (SCC, ['SRC-TRANSTRUM-QIU-2014'], 't > 0', 'a boundary limit is not the MBAM geodesic procedure'),
 'BR34': (EI, ['SRC-NELSON-FISHER-1975'], 'zero field, nearest-neighbour couplings', 'a field h ≠ 0 needs a renormalized field too (FB11d)'),
 'BR35': (EI, ['SRC-MALLAT-2009'], 'convolution with a fixed wavelet; circular shifts for the discrete invariant', 'the invariant is many-to-one (FB10c)'),
 'BR36': (EI, ['SRC-LEE-2018', 'SRC-FULTON-HARRIS-1991'], 'a pairing T of tangent vectors; F smooth (linear for the matrix form)', 'none for the identity; a map that is not a symmetry fails F*T = T (CFT1c, CFT2b)'),
 'BR37': (EI, ['SRC-LEE-2018', 'SRC-AMARI-2016'], 'a regular model; an invertible reparametrization J', 'a coordinate-dependent pseudo-structure fails the law (CFT10a); component eigenvalues change (CFT5e)'),
 'BR38': (EIM, [], 'an involution S with Y∘S = Y; a fixed point of S', 'no symmetry: the lemma predicts nothing, and a null can still occur (CFT5c)'),
 'BR39': (FC, ['SRC-LEE-2018'], 'the normal family with its Fisher metric', 'none: the hyperbolic inversion is an isometry no data map induces (CFT11a)'),
 'BR40': (EIM, [], 'positive weights; D = diag(m)', 'a D-isometry not preserving span{1}, or a non-isometry fixing 1, does not commute (CFT8c)'),
 'BR49': (EI, ['SRC-AXLER-2015'], 'a linear map Φ', 'nonlinear maps: fibers are not cosets of a kernel'),
 'BR50': (EIM, [], 'a non-invertible linear Φ', 'zeros that do not arise from collapse (Z5 preserved nulls, Z10)'),
 'BR51': (FC, ['SRC-LEE-2018'], 'F invertible with F*T = T; Φ non-invertible', 'none: the distinction holds for every such pair'),
 'BR52': (SCC, ['SRC-FULTON-HARRIS-1991'], 'a group acting on source and target; the stated maps', 'a reduction that respects no supplied symmetry'),
 'BR53': (SCC, ['SRC-MALLAT-2012', 'SRC-MALLAT-2009', 'SRC-GROSSMANN-MORLET-1984'], 'admissible wavelets; exact hypotheses in the sources', 'the first-order invariant is many-to-one (FB10c)'),
 'BR54': (OPC, [], 'none established', 'not pre-answered'),
 'BR55': (OPC, [], 'none established', 'no equivalence asserted'),
 'BR56': (OPC, [], 'none established', 'not promoted'),
 'BR41': (EI, ['SRC-LEE-2018', 'SRC-AXLER-2015'], 'an invertible change of representation (P or J invertible)', 'a non-invertible map is not a change of representation (TRA4b)'),
 'BR42': (EI, ['SRC-LEE-2018'], 'a pairing T of tangent vectors; F a smooth map of the space to itself', 'a non-symmetry fails (CFT1c, CFT2b, CFT4d)'),
 'BR43': (THM, ['SRC-LEE-2018', 'SRC-ARNOLD-1989'], 'a smooth one-parameter group F_t with generator X', 'a non-Killing field: L_X g ≠ 0 (TRA1b)'),
 'BR44': (EIM, ['SRC-LEE-2018', 'SRC-FULTON-HARRIS-1991'], 'F*T = T', 'the converse fails: zero preservation without invariance (TRA2b)'),
 'BR45': (EI, ['SRC-DUMMIT-FOOTE-2004', 'SRC-LEE-2018'], 'a group acting on a set (structures, or signals)', 'none for the identity; the two stabilizers concern different objects'),
 'BR46': (EI, ['SRC-STEIN-SHAKARCHI-2003'], 'the project convention x̂(ω) = ∫x e^{−iωt}dt; the DFT for the discrete form', 'none for the identity; a different sign convention flips the phase'),
 'BR47': (THM, ['SRC-FULTON-HARRIS-1991'], 'a finite group (or compact group) acting linearly; an operator commuting with the action', 'with multiplicities, an operator need not be scalar on an isotypic sector'),
 'BR48': (FC, [], 'Pₙ = I − 11ᵀ/n', 'none: the distinction holds for every n ≥ 2'),
})

# ══ Model-manifold invariance + research-story audit (2026-11-13) ═════════════════════════════════
# Decisions: docs/restructure_decisions.md, "Model-manifold invariance + research-story audit". Cards: verify/verify_MMI.py.
# Story and invariance tables: research/model_manifold_story.md, research/model_manifold_invariance.md (research/tools/model_manifold_source.py).
MMDOCS = ['research/model_manifold_story.md', 'research/model_manifold_invariance.md']
obj('MM0', 'Model-manifold research story (status per arrow)', UT, ['REPRESENTATION', 'GEOMETRY', 'INFORMATION'],
    'larger prediction / possibility space → rules constrain an allowable manifold → representations expose different aspects of it → observation / reduction may expose an accessible manifestation → ask what geometry and information survive', 'HYPOTHESIS',
    docs=MMDOCS, reg=['T-MM-STORY', 'T-MM-GOV'], depends=['MM1', 'MM2', 'MM4', 'MM6', 'RI0'], bs=30, slop=30, td='NOT YET FORMALIZED', breadth=2,
    fail='a system whose observable manifestation is not a reduction of any richer description in the stated sense', role='the story kept whole; each arrow carries its own status (T-MM-GOV: audit the status of each connection)', guide='Guide: model manifolds')
obj('MM1', 'Prediction space and model manifold M = Y(Θ) ⊆ P', PB, ['REPRESENTATION', 'GEOMETRY'],
    'P = ℝᵐ with metric Σ⁻¹ (m outputs), or a function space with a stated inner product (continuously indexed outputs: g_ij = 2/(θᵢ + θⱼ)³ for e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞)); M = Y(Θ), dimension rank J', 'ESTABLISHED',
    cards=['MMIh', 'MMIg'], docs=MMDOCS + ['research/sources/quinn2023.md'], reg=['T-PREDICTION-INFINITE', 'T-INFOGEO'], depends=['R7'], bs=25, slop=5, fail='none for the definition; an infinite-dimensional P does not make M infinite-dimensional (MMIh)',
    role='parameter space ≠ prediction space; prediction space ≠ physical spacetime; model manifold ≠ quantum state space', guide='Guide: model manifolds')
obj('MM2', 'Model rule and parameter domain fix the allowable set', PD, ['OBJECT', 'GEOMETRY'],
    'the model rule Y and the domain Θ fix M = Y(Θ); a parameter value is a point coordinate on M; a reparametrization is a chart change (M unchanged); the domain\'s limits give M\'s boundaries', 'DERIVED',
    cards=['MMIa', 'MMIf', 'MMIg'], docs=MMDOCS, reg=['T-MM-RULES'], depends=['MM1'], bs=40, slop=5, td='TRIVIAL CONSEQUENCE', breadth=2, fail='a feature of M that changes with the chart (none: MMIa, MMIf)',
    role='"the rules of the manifold were the model parameters", unpacked', guide='Guide: model manifolds')
obj('MM3', 'Broader role of governing rules (question)', UT, ['GEOMETRY', 'CROSS-SYSTEM TRANSFER'],
    'Do governing parameters/rules play a broader role in determining the geometry of allowable representations? What role does a distinguished rule/parameter play in determining allowable transformations, allowable states, or geometric structure?', 'HYPOTHESIS',
    reg=['T-MM-RULES-Q', 'T-MM-DISTINGUISHED-Q'], depends=['MM2', 'MM5'], bs=None, slop=None, fail='—', role='PROJECT HYPOTHESIS; shared exact content so far: a parameter limit is a rank-drop boundary (MM5)', guide='Guide: model manifolds')
obj('MM4', 'Model-manifold invariance audit', PD, ['TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY'],
    'under an invertible reparametrization (R1): rank, nullity, null directions, lengths, √det g dθ, curvature, widths and the boundary set are invariant; entries, det (×det(P)²), raw eigenvalues, condition number and Jacobian singular values are not; every magnitude depends on the noise model Σ, the null directions do not (SPD Σ)', 'DERIVED',
    cards=['MMIa', 'MMIb', 'MMIc', 'MMId', 'MMIe', 'MMIf', 'CFT5d', 'CFT5e', 'CFT5f'], docs=MMDOCS, reg=['T-INFOGEO'], depends=['CF10', 'CF13', 'TA1'], bs=35, slop=5, td='not a transfer', breadth=3,
    fail='an orthogonal linear reparametrization keeps the eigenvalues; the audit concerns general charts', role='separates geometry from chart artifacts before any C7 comparison', guide='Guide: model manifolds')
obj('MM5', 'c ↔ model-parameter limit: rank-drop boundary', PD, ['GEOMETRY', 'CROSS-SYSTEM TRANSFER'],
    'η_c = Pᵀ diag(1, −1) P, P = diag(1, 1/c): finite c is a change of units (R1); c → ∞: diag(1, 0), rank 1. Model: θ₂ → ∞, rank J 2 → 1. Verdict: STRUCTURAL CONNECTION for the limit role only; FAIL for the invariant-form role; TOO WEAK in general', 'DERIVED',
    cards=['MMIi', 'MMIg', 'C9b'], docs=MMDOCS, reg=['T-RULES-GEOMETRY'], bears=['T-C-ROLES'], depends=['L3', 'M2', 'MM1'], bs=25, slop=20, td='STRUCTURAL TRANSFER', breadth=2,
    fail='the invariant-form role: model parameters are coordinates, the Lorentz allowed set is one orbit while M is not homogeneous (CFT5f)', role='the exact content of "rules constrain a geometry of allowed states" for c', guide='Guide: model manifolds / Act IV')
obj('MM6', 'Observation as an information-changing map (open)', OQ, ['INFORMATION', 'REPRESENTATION'],
    'Can observation or measurement be modeled geometrically as a map from a richer state/representation space to a more restricted observable manifestation? Exact instances: ρ ↦ Σₖ PₖρPₖ (W2a), projection (RIC1a), boundary limits (MMIg)', 'OPEN',
    cards=['W2a', 'W2b', 'RIC1a', 'MMIg'], reg=['T-MM-OBSERVE'], depends=['RI0', 'QZ4'], bs=15, slop=35, td='NOT YET FORMALIZED', breadth=1,
    fail='no single construction covers the instances', role='OPEN CONNECTION; measurement, interaction or which-path information, never a conscious-observer claim', guide='Guide: model manifolds / Act III')
obj('MM7', 'Viewer intuition (historical)', PL, ['INFORMATION'],
    'matter does not form until a viewer looks at it. Normalized question: What changes when a richer state/representation becomes an observable manifestation?', 'OPEN',
    reg=['T-VIEWER-FORM'], bs=None, slop=None, fail='—', role='ORIGINAL USER INTUITION; PHILOSOPHICAL / QUANTUM-INTERPRETIVE; NOT ESTABLISHED PHYSICS; conscious observer requirement = NOT ESTABLISHED; ORIGINAL VERBATIM NOT RECOVERED', guide='Final / About the Author')
obj('MM8', 'Physical manifestation through a geometry of constraints (question)', OQ, ['APPLICATION', 'GEOMETRY'],
    'Could physical manifestation eventually be understood through a similar geometry-of-constraints framework?', 'OPEN', reg=['T-PHYSICAL-MANIFEST-Q'], bs=None, slop=None, fail='—',
    role='long-term; needs physical theory or data, not a construction', guide='Final')
obj('MM9', 'Geometry and distinguishability (question)', OQ, ['INFORMATION', 'GEOMETRY', 'ZERO / BALANCE / NULL'],
    'Can geometry encode what information is accessible, inaccessible, or indistinguishable in a representation? Exact locally: Fisher length = distinguishability per unit noise (MMId); g(v, v) = 0 ⟺ Jv = 0 (FB7b)', 'OPEN',
    cards=['MMId', 'FB7b'], reg=['T-GEOM-INFO-Q', 'T-ZERO-LENGTH'], depends=['Z9', 'MM4'], bs=None, slop=None, fail='—', role='eight information notions kept apart (research/model_manifold_story.md)', guide='Guide: model manifolds')
obj('MM10', 'Simpler structure as a boundary of a richer model (question)', OQ, ['INFORMATION', 'GEOMETRY'],
    'Can simpler observable structure emerge as a boundary/reduction of a richer model? Exact for stated limits: e^{−θ₁t} as the θ₂ → ∞ face (MMIg, FB11c); Newtonian kinematics as c → ∞ (C9b)', 'OPEN',
    cards=['MMIg', 'FB11c', 'C9b'], reg=['T-SIMPLER-BOUNDARY-Q'], depends=['M2', 'MM5'], bs=None, slop=None, fail='—', role='a limit is a family degeneration, not a map on states', guide='Guide: model manifolds')
obj('MM11', 'Hyperribbon widths', PB, ['GEOMETRY', 'INFORMATION'],
    'cross-sectional extents of M in (P, Σ⁻¹): measured along geodesics (TMS 2011); a bounding hyperellipsoid with geometrically decaying widths for analytic models, via Chebyshev approximation (Quinn et al. 2019). Chart-independent, metric-dependent (MMIf)', 'ESTABLISHED',
    cards=['MMIf'], docs=MMDOCS, reg=['T-INFOGEO'], bears=['T-C7'], depends=['MM1', 'MM4'], bs=15, slop=15, fail='a non-analytic model: algebraic decay only (per the source)',
    role='the recommended C7 target object (four gates; no derivation)', guide='Guide: model manifolds', gap='carded only as a 1-D illustration of chart independence and metric dependence (MMIf); multi-dimensional widths and the Chebyshev bound are source-only; PDFs not opened')
for o in O:
    if o['id'] == 'R7':
        o['cards'] = ['MMIh', 'MMIg']; o['gap'] = 'quinn2023 PDF pending (P-2); the prediction space is finite (ℝᵐ) or a function space (MMIh)'
    if o['id'] == 'M1':
        o['cards'] += ['MMIb']; o['failureCondition'] = 'S14a FAIL kept (span 3.1 decades, threshold 4); raw eigenvalues are not coordinate invariants (MMIb, CFT5e)'
    if o['id'] == 'M2':
        o['cards'] += ['MMIg', 'MMIf']; o['gap'] = 'boundary limit carded with its rank drop and chart independence (FB11c, MMIg); widths carded as a 1-D illustration (MMIf); the MBAM geodesic procedure is source-only; quinn2023 PDF pending (P-2)'
    if o['id'] == 'M4':
        o['cards'] += ['MMIb', 'MMIf']; o['foundationRole'] = 'active open comparison; target object recommended: hyperribbon widths (MM11), with four gates; the raw-spectrum reading is NEGATIVE (MMIb, CFT5e); no derivation begun'
    if o['id'] == 'Z9':
        o['registry'] += ['T-ZERO-LENGTH']; o['cards'] += ['MMIe']
PROV.update({'MM0': UO, 'MM1': PP, 'MM2': PDM, 'MM3': UO, 'MM4': PDM, 'MM5': PDM, 'MM6': UO, 'MM7': PHL, 'MM8': UO, 'MM9': UO, 'MM10': UO, 'MM11': PP})
MATH_STATUS.update({'MM1': 'TEXTBOOK / KNOWN', 'MM2': 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'MM4': 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'MM5': 'PROJECT-DERIVED FROM KNOWN DEFINITIONS', 'MM11': 'TEXTBOOK / KNOWN', 'MM0': 'SPECULATIVE MAPPING'})
NOVELTY.update({'MM0': 'PROJECT SYNTHESIS', 'MM1': 'KNOWN MATHEMATICS', 'MM2': 'KNOWN MATHEMATICS (definition); PROJECT READING', 'MM4': 'PROJECT CLASSIFICATION OF KNOWN MATHEMATICS', 'MM5': 'PROJECT SYNTHESIS (restricted structural connection)',
                'MM7': 'OPEN PHYSICAL / QUANTUM-LIKE INTERPRETATION', 'MM11': 'KNOWN MATHEMATICS'})
TLEVEL.update({'MM4': ['R1'], 'MM5': ['R1']})
REDROLE.update({'MM6': 'INFORMATION-CHANGING', 'MM10': 'INFORMATION-CHANGING'})
src('SRC-QUINN-2019', 'Katherine N. Quinn; Heather Wilber; Alex Townsend; James P. Sethna', 'Chebyshev approximation and the global geometry of model predictions', '2019', 'journal article',
    'Physical Review Letters 122, 158302; DOI 10.1103/PhysRevLett.122.158302; arXiv:1809.08280', 'primary', SV,
    'the hyperribbon structure of model manifolds follows from smoothness: Chebyshev approximation bounds the cross-sectional widths of a hyperellipsoid enclosing the model manifold, with geometric decay for analytic models',
    'C7 as posed (one signal\'s Fourier / Bessel coefficients vs Fisher spectra); any statement about raw FIM eigenvalues; the project story', ['MM11'], ['M4', 'MM0'],
    checked='bibliographic record and abstract checked by web search, 2026-11-13; full text not opened')
for x in S:
    if x['id'] == 'SRC-TMS-2011': x['supports'] += ['MM1', 'MM11']
    if x['id'] == 'SRC-TMS-2010': x['supports'] += ['MM1']
    if x['id'] == 'SRC-QUINN-2023': x['bearsOn'] += ['MM5']
    if x['id'] == 'SRC-NIELSEN-CHUANG-2010': x['bearsOn'] += ['MM6']
for m in RMAPS:
    if m['name'] == 'Model reduction / manifold boundary (placeholder)':
        m.update(name='Model reduction / manifold boundary (a limit, not a map)', objects=['M2', 'M3', 'MM10'], cards=['FB11a', 'FB11c', 'MMIg'],
                 axisA='a degeneration of the model family (a limit), not a map Φ: X → Y on states; information-changing (dimension 2 → 1)',
                 survives='θ₁ (FB11c, MMIg); K_M and V_max (FB11a); the boundary set itself is chart-independent (MMIg)', collapses='the removed parameter: ∂Y/∂λ₂ → 0, the dimension drops 2 → 1 (MMIg)',
                 zero='the tangent direction of the removed parameter has zero length on the face (rank drop)', lost='the removed parameter (θ₂); one rate-constant combination (FB11a)',
                 reconstructible='no: every value of the removed parameter has the same limit', fibers='not defined for a limit; near the face, a shrinking width (source-only)',
                 symmetry='none supplied; only the approach rate depends on the chart (MMIg)', status='carded instances; MBAM source-only')
for b in B:
    if b['id'] == 'BR54':
        b['connector'] = 'a manifold boundary is a limit (a degeneration of the model family), not a map on states: the limit set is chart-independent, the dimension drops 2 → 1, θ₁ survives (MMIg, FB11c); QSSA keeps K_M, V_max (FB11a). Whether every reduction has a boundary form stays open'
        b['cards'] = ['FB11a', 'FB11c', 'MMIg']; b['objects'] = ['M2', 'M3', 'RI0', 'MM10']
bridge('BR57', 'prediction space', 'model manifold', 'M = Y(Θ) ⊆ P, P = ℝᵐ (finite outputs) or a function space with a stated inner product; dim M = rank J (MMIh: L²(0, ∞) gives a 2-dimensional M with g_ij = 2/(θᵢ + θⱼ)³)', 'ESTABLISHED', EST, ['MMIh', 'MMIg'],
       'that P is a quantum state space or physical spacetime; that an infinite-dimensional P makes M infinite-dimensional', ['MM1', 'R7'])
bridge('BR58', 'raw FIM eigenvalues', 'geometric invariant', 'eigenvalues of the component matrix g change under a change of units or chart (MMIb, CFT5e); the invariants are rank, nullity, lengths, √det g dθ, curvature, widths (MM4)', 'ESTABLISHED', EST, ['MMIb', 'CFT5e', 'MMIc'],
       'that sloppiness is only a chart artifact (widths are invariant and carry the hierarchy)', ['M1', 'MM4', 'M4'])
bridge('BR59', 'hyperribbon widths', 'Chebyshev coefficient decay', 'for analytic model predictions the widths of a hyperellipsoid enclosing M are bounded through Chebyshev coefficients and decay geometrically (Quinn, Wilber, Townsend, Sethna 2019; source-only)', 'ESTABLISHED', EST, [],
       'C7 as posed (one signal\'s Fourier / Bessel coefficients vs Fisher spectra); anything about raw eigenvalues; not carded here', ['MM11', 'M4'])
bridge('BR60', 'c', 'model-parameter limit', 'both are degenerate boundaries with a rank drop: η_c → diag(1, 0) as c → ∞; rank J 2 → 1 as θ₂ → ∞ (MMIi, MMIg, C9b)', 'DERIVED', PS, ['MMIi', 'MMIg', 'C9b'],
       'that spacetime is a model manifold; that c is a model coordinate; the invariant-form role (FAIL: finite c is a change of units)', ['MM5', 'L3', 'M2'])
bridge('BR61', 'observation', 'information-changing map', 'non-selective measurement ρ ↦ Σₖ PₖρPₖ keeps S_z = 0 and removes the sector coherence (W2a, W3a); projection (RIC1a) and boundary limits (MMIg) are other named instances', 'OPEN', PS, ['W2a', 'W3a', 'RIC1a'],
       'a general theory of observation; any conscious-observer requirement (NOT ESTABLISHED); that matter forms on being observed', ['MM6', 'QZ4', 'RI0'])
bridge('BR62', 'same-zero quantum states', 'observationally indistinguishable parameters', 'both: an observed value that does not fix what underlies it (S_z = 0 on a 2-dimensional eigenspace, Q1d, Q2b; Y(θ) constant along θ₁ + θ₂ = const, FB7a)', 'OPEN', PS, ['Q1d', 'Q2b', 'FB7a'],
       'an explicit map between a quantum state space and a parameter manifold (none given); that a model manifold is a quantum state space', ['QZ1', 'Z9', 'MM9'])
BMETA.update({
 'BR57': (EI, ['SRC-TMS-2011'], 'differentiable Y; a stated metric (inner product) on P', 'none for the definition'),
 'BR58': (FC, ['SRC-LEE-2018'], 'an invertible change of parameters that is not orthogonal-linear', 'orthogonal linear reparametrizations do keep the eigenvalues'),
 'BR59': (THM, ['SRC-QUINN-2019', 'SRC-TMS-2011'], 'analytic predictions on a bounded input interval; the exact hypotheses of the source', 'non-analytic models: algebraic decay only (per the source)'),
 'BR60': (SAN, ['SRC-QUINN-2023', 'SRC-INONU-WIGNER-1953'], 'the stated limits', 'the invariant-form role: for finite c, c is absorbed by a change of units (MMIi)'),
 'BR61': (OPC, ['SRC-NIELSEN-CHUANG-2010'], 'named maps only', 'no single construction covers the instances'),
 'BR62': (SAN, [], 'none beyond the two separate facts', 'an explicit map showing the two indistinguishabilities differ in kind'),
})
for b in B:
    st, srcs, asm, fl = BMETA[b['id']]
    b.update(strength=st, sources=srcs, assumptions=asm, failureCondition=fl)

for o in O:
    o['provenance'] = PROV[o['id']]
    o['sources'] = [x['id'] for x in S if o['id'] in x['supports']]
    o['sourceStatus'] = MISSING.get(o['id'])
    o['mathematicalStatus'] = MATH_STATUS.get(o['id'])
    o['transformationLevel'] = TLEVEL.get(o['id'], [])
    o['novelty'] = NOVELTY.get(o['id'])
    o['reductionRole'] = REDROLE.get(o['id'])
    if o['provenance'] in EXTERNAL:
        assert o['sources'] or o['sourceStatus'], f"{o['id']}: external claim without a source"

# Domain statuses after Pass 2 (research/foundation_completion.md)
DOMAIN_STATUSES = ['LOCKED', 'SOURCE-COMPLETE', 'MATH-CARDED', 'SOURCE+CARD COMPLETE', 'NEEDS DERIVATION', 'NEEDS CROSS-DOMAIN TEST', 'OPEN LONG-TERM', 'WORDING ONLY']
D = []
def dom(id, name, objs, status, note):
    D.append(dict(id=id, name=name, objects=objs.split(), status=status, note=note))
dom('D1', 'Foundation definition, spine, two-map system', 'OB1', 'LOCKED', 'the whole architecture; zero = central investigative interface; common forms = major unifying mechanism; master map = research ontology; Act map = teaching order')
dom('D2', 'Status, provenance and bridge-strength systems; method rules', 'QZ5', 'LOCKED', 'seven provenance classes, seven bridge strengths, the source registry; B-* method rules')
dom('D3', 'Fourier / L² representation', 'R1 R2 R3 R4 R5 R6 Z7 P1', 'SOURCE+CARD COMPLETE', 'R5 (Fourier transform as a quarter-turn) is carded but SOURCE MISSING')
dom('D4', 'Orthogonality and norm', 'ON1 ON2 ON3 ON4 ON5 ON7 Z4 Z10', 'SOURCE+CARD COMPLETE', '—')
dom('D5', 'Common forms, generators, conservation', 'CF1 CF2 CF3 CF4 CF5 CF6 CF7 CF8 CF9 CF10 CF11-A', 'SOURCE+CARD COMPLETE', 'Noether in general is source-only (FB5 cards an instance); CF11-A is the established pattern')
dom('D6', 'Common-form architecture as project hypothesis', 'CF11-B CF11-R', 'SOURCE+CARD COMPLETE', 'Pass 3 preregistered test: CF11-F2 (stands); CF11-B classified REFINED; architectural correction: CF11-R superseded by the Transformation Architecture (D28)')
dom('D28', 'Transformation Architecture (R1 / R2 / R3)', 'TA0 TA1 TA2 TA2I TA3', 'SOURCE+CARD COMPLETE', 'each level is known mathematics, carded and sourced; TA0 is the project-level organizing architecture')
dom('D29', 'Deeper transformation–zero question; Čencov check', 'TAH TAC', 'OPEN LONG-TERM', 'TAH: HYPOTHESIS / OPEN; TAC: KNOWN THEOREM, NOT YET INTEGRATED')
dom('D30', 'Reduction / Information-Changing Architecture', 'RI0 RI1 RI2', 'SOURCE+CARD COMPLETE', 'every existing lossy map answers the seven questions where carded; model reduction and coarse-graining are placeholders for later passes')
dom('D31', 'Transform vs reduce; DYADIC packet hierarchy questions', 'RI3 W5', 'OPEN LONG-TERM', 'OPEN PROJECT QUESTION; DYADIC STRUCTURE — CANDIDATE, NOT UNIVERSAL')
dom('D27', 'Coordinate-free common form and covariance', 'CF12 CF13 Z13', 'SOURCE+CARD COMPLETE', 'F*T = T across constant-form, symplectic and Fisher isometries; naturality of the Fisher metric; symmetry-forced null (sufficient, not necessary)')
dom('D7', 'Zero taxonomy', 'Z1 Z2 Z3 Z5 Z6 Z8 Z9 Z12', 'SOURCE+CARD COMPLETE', 'Z9 now separates exact structural null, sloppy direction, Lorentz null (FB7)')
dom('D8', 'Zero as connector; the inverse problem', 'Z11 H3', 'OPEN LONG-TERM', 'special cases proved; general statement open')
dom('D9', 'Translation, correlation, spectrum, localization', 'T1 T2 T3 T4 T5', 'SOURCE+CARD COMPLETE', 'T3/T4 project-derived and carded; the uncertainty inequality itself is source-only (FB3 cards its instances)')
dom('D10', 'Lorentz and c', 'L1 L2 L3', 'SOURCE+CARD COMPLETE', 'İnönü–Wigner sourced for the c → ∞ contraction; it is not evidence for L4')
dom('D11', 'Known continuation behaviours', 'I1', 'SOURCE+CARD COMPLETE', '—')
dom('D12', 'Model manifolds and Fisher geometry', 'R7 CF10 Z9 M1 M2', 'SOURCE+CARD COMPLETE', 'quinn2023 quote pending (P-2); M1 rests on the weak S14b and is a statement in log-parameter coordinates (component eigenvalues are not invariant, CFT5e, MMIb); the MBAM procedure is source-only; invariance classified in D33 (research/model_manifold_invariance.md)')
dom('D13', 'C7: coefficient decay vs Fisher eigenvalue decay', 'M4', 'NEEDS DERIVATION', 'an explicit operator / map / asymptotic theorem, or an exact obstruction. Target object recommended (2026-11-13): hyperribbon widths (MM11), with four gates; the raw-spectrum reading is NEGATIVE (MMIb, CFT5e); derivation not begun')
dom('D32', 'Model-manifold research story and extensions', 'MM0 MM3 MM6 MM7 MM8 MM9 MM10', 'OPEN LONG-TERM', 'every arrow of the story has a status (research/model_manifold_story.md); observation, manifestation and the viewer intuition stay open or philosophical; conscious observer requirement = NOT ESTABLISHED')
dom('D33', 'Model-manifold invariance', 'MM1 MM2 MM4 MM5 MM11', 'SOURCE+CARD COMPLETE', 'MMI cards; widths carded as a 1-D illustration, the Chebyshev bound source-only; c verdict: STRUCTURAL CONNECTION for the limit role only')
dom('D14', 'Wavelets and scattering', 'W1 W2', 'SOURCE-COMPLETE', 'W1 carded; W2: exact first-order parts carded, deformation stability and higher orders source-only')
dom('D15', 'DYADIC PACKETS; information lost and recovered', 'W3 W4', 'OPEN LONG-TERM', 'DYADIC PACKETS: ORIGINAL USER RESEARCH TERM, OPEN DEFINITION; candidate role in the Reduction / Information-Changing Architecture (not the definition)')
dom('D16', 'Effective / reduced representations (examples)', 'M3 M2 H7', 'SOURCE+CARD COMPLETE', 'three reductions, each with what survives; compared, not equated. The question itself (H6) is OPEN LONG-TERM')
dom('D17', 'Higher / source constructions', 'R8 H1 H2 H4 CF9', 'MATH-CARDED', 'project constructions: carded with assumptions and failure conditions; no external source needed beyond textbook linear algebra')
dom('D18', 'Quantum same-zero', 'Z6 QZ1 QZ2 QZ3 QZ4', 'SOURCE+CARD COMPLETE', 'QZ3 is VALIDATION OF KNOWN MATHEMATICS (Schur–Weyl)')
dom('D19', 'Cross-domain transfer', 'Z12 H5 R10', 'NEEDS CROSS-DOMAIN TEST', 'Q-SYM-NOVEL; Q-DISTINGUISHED-MODE; no nontrivial predictive transfer yet')
dom('D20', 'Pairs and mass–wave: established ingredients', 'P1 MW2', 'SOURCE+CARD COMPLETE', 'ingredients only; MW1 is not proved by them')
dom('D21', 'Continuation, c, pairs, mass–wave: user hypotheses', 'I2 I3 L4 MW1 MW3 P2 ON8 ON6 R9', 'OPEN LONG-TERM', 'kept verbatim; MW3: ORIGINAL VERBATIM NOT RECOVERED')
dom('D22', 'Effective-representation question', 'H6', 'OPEN LONG-TERM', 'no general statement; Kadanoff and Wilson source-only')
dom('D23', 'Philosophical lenses', 'PL1', 'OPEN LONG-TERM', 'origin, not proof')
dom('D24', 'Failures and boundaries', 'F1', 'LOCKED', 'every FAIL card kept')
dom('D25', 'Application', 'A1 A2', 'OPEN LONG-TERM', 'A2: APPLICATION PROVENANCE INCOMPLETE; not upstream evidence')
dom('D26', 'Physical energy vs L² energy; meaning of squared magnitude', 'A3 ON9', 'WORDING ONLY', 'name the kind of "energy" every time')
for d in D:
    assert d['status'] in DOMAIN_STATUSES
    for i in d['objects']: assert any(o['id'] == i for o in O), i

reg = {r['id']: r for r in json.loads((ROOT / 'research/theories.json').read_text())['theories']}
est = [o for o in O if o['status'] in ('ESTABLISHED', 'DERIVED')]
carded = [o for o in est if o['cards']]
ext = [o for o in O if o['provenance'] in EXTERNAL]
ext_src = [o for o in ext if o['sources']]
CF11B = dict(outcome='CF11-F2', classification='REFINED', outcomes=['CF11-F1', 'CF11-F2', 'CF11-F3', 'CF11-F4'], classifications=['LOCKED FOR V1', 'NEEDS ONE MORE TEST', 'REFINED', 'FAILED', 'OPEN LONG-TERM'],
             prereg='research/constructions/cf11b_fisher_prereg.md', preregCommit='e6f3db8', record='research/constructions/cf11b_fisher_test.md', pullbackCommonForm='YES',
             correction='architectural correction (2026-11-12): P1, P2, P3 are not three meanings of one word; they are R2 structural invariance, R1 representation covariance and R3 equivariance / intertwining of the Transformation Architecture (TA0). CF11-F2 is unchanged.')
RATINGS = [
 ('Foundation architecture completeness', 91, 90, 'The model-manifold branch is audited: which quantities are invariant, chart-dependent, noise-dependent or reduction-dependent (MM4, MMI cards); the research story is kept whole with a status per arrow (MM0); the c connection has a restricted verdict (MM5); observation and the viewer intuition are recorded and kept open (MM6, MM7); C7 has one recommended target object (MM11). Still short: DYADIC definition, no general statement for effective representations, no application mathematics, the C7 derivation.'),
 ('Mathematical verification coverage', round(100 * len(carded) / len(est)), 96, f'{len(carded)} of {len(est)} established or derived objects have PASS cards (computed). New and carded: MM1, MM2, MM4, MM5, MM11 (MMI cards); R7 now carded (MMIh). Not carded: OB1 (definitional), A3 (wording).'),
 ('Cross-domain validation', 30, 30, 'Unchanged.'),
 ('Project-specific construction maturity', 45, 45, 'Unchanged.'),
 ('Paper / source coverage', 55, 55, f'{sum(1 for x in S if x["sourceClass"] in ("primary", "textbook", "review"))} external sources registered with verified bibliographic records ({sum(1 for x in S if x["status"] == SP)} only partly verified), each with the exact claim it supports and what it does not establish. {len(ext_src)} of {len(ext)} external-claim objects have a source; R5 is SOURCE MISSING. Unchanged (SRC-QUINN-2019 added; no text quoted).'),
 ('Application validation', 0, 0, 'Unchanged.'),
]
data = dict(about='Foundation dependency architecture (V1, revised in Pass 2, 2026-11-12). Generated by research/tools/foundation_source.py.', layers=LAYERS, stages=STAGES, statuses=STATUS, transferDepths=TD,
            provenanceClasses=PROVENANCE, bridgeStrengths=STRENGTHS, sourceStatuses=SOURCE_STATUSES, sourceClasses=SOURCE_CLASSES, domainStatuses=DOMAIN_STATUSES, externalProvenance=list(EXTERNAL),
            objects=O, bridges=B, sources=S, domains=D, cf11b=CF11B, transformationClasses=TRANSFORMATION_CLASSES,
            transformationClassesByDomain=[dict(domain=a, classes=b) for a, b in TCLASS], reductionMaps=RMAPS, reductionQuestions=IC, ratings=[dict(dimension=a, rating=b, previous=c, reason=d) for a, b, c, d in RATINGS])
(ROOT / 'research/foundation.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')

cell = lambda x: '—' if x in (None, '', []) else str(x).replace('|', '\\|')
pct = lambda x: '—' if x is None else f'{x}%'
lines = ['# Foundation dependency table', '', 'Generated from `research/tools/foundation_source.py` (`research/foundation.json`). Do not edit by hand. "Supports" means the evidence carries the record; "bears on" means it is relevant without supporting it. Ratings are per object; there is no overall score. Provenance is the record\'s one primary class (Pass 2); sources are in `research/foundation_sources.md`.', '',
         '| ID | Name | Type | Provenance | Stage(s) | Depends on | Supports | Bears on | Exact equation | Status | Source (cards / docs / registry) | External sources | Backbone Support | AI Slop Risk | Transfer Depth | Application Breadth | Failure condition | Foundation role | Guide location | Gap |',
         '|' + '---|' * 20]
for o in O:
    srcs = '; '.join(filter(None, [', '.join(o['cards']), ', '.join(o['docs']), ', '.join(o['registry'])]))
    ext_s = ', '.join(o['sources']) or (o['sourceStatus'] or '')
    lines.append(f"| {o['id']} | {cell(o['name'])} | {o['layer']} | {o['provenance']} | {cell(', '.join(o['stages']))} | {cell(', '.join(o['dependsOn']))} | {cell(', '.join(o['supports']))} | {cell(', '.join(o['bearsOn']))} | {cell(o['equation'])} | {o['status']} | {cell(srcs)} | {cell(ext_s)} | {pct(o['backboneSupport'])} | {pct(o['slopRisk'])} | {o['transferDepth']} | {cell(o['applicationBreadth'])} | {cell(o['failureCondition'])} | {cell(o['foundationRole'])} | {cell(o['guideLocation'])} | {cell(o['gap'])} |")
(ROOT / 'research/foundation_dependencies.md').write_text('\n'.join(lines) + '\n')

bl = ['# Foundation bridges', '', 'Each row is a mathematical bridge: an exact connector between two objects, not a topic. Generated from `research/tools/foundation_source.py`. "Project-specific" bridges were constructed or derived in this project; "established" bridges are textbook or paper-backed. Strength classes (Pass 2): ' + '; '.join(STRENGTHS) + '. A FAILED CONNECTION row records that a shared word does not name a shared object.', '',
      '| ID | Left object | Right object | Exact mathematical connector | Strength | Status | Established or project-specific | Assumptions | Failure condition | Cards | Sources | What it does NOT prove | Foundation objects |', '|' + '---|' * 13]
for b in B:
    bl.append(f"| {b['id']} | {cell(b['left'])} | {cell(b['right'])} | {cell(b['connector'])} | {b['strength']} | {b['status']} | {b['scope']} | {cell(b['assumptions'])} | {cell(b['failureCondition'])} | {cell(', '.join(b['cards']))} | {cell(', '.join(b['sources']))} | {cell(b['doesNotProve'])} | {cell(', '.join(b['objects']))} |")
(ROOT / 'research/foundation_bridges.md').write_text('\n'.join(bl) + '\n')

sl = ['# Foundation source registry', '', 'Generated from `research/tools/foundation_source.py` (`research/foundation.json`, key `sources`). Do not edit by hand. Pass 2 (2026-11-12).', '',
      'Purpose: to separate what Nadia proposed, what the project derived, what is textbook mathematics, what a paper establishes, and what remains only an analogy. A source **supports** only established or derived Foundation objects whose central claim it states; it may **bear on** a hypothesis without supporting it. No source is cited for a broader hypothesis than it supports.', '',
      '**Verification limits, stated once.** Every bibliographic record below was checked on 2026-11-12 by web search against publisher, repository or index records (DOIs, volumes, pages). No full text could be opened in this environment, so the "exact claim" column is the standard, widely restated content of the source, not a quotation, and no theorem or page number is quoted. A later pass that opens the texts should add quotations and locations. Records marked "partly verified" have an identifier (usually a DOI) that could not be confirmed and is therefore omitted.', '',
      'Source statuses: ' + '; '.join(SOURCE_STATUSES) + '.', '',
      '| Source ID | Author(s) | Title | Year | Source type | Identifier | Supports (Foundation objects) | Exact claim supported | What it does NOT establish | Bears on (not support) | Class | Status |', '|' + '---|' * 12]
for x in S:
    sl.append(f"| {x['id']} | {cell(x['authors'])} | {cell(x['title'])} | {x['year']} | {x['sourceType']} | {cell(x['identifier'])} | {cell(', '.join(x['supports']))} | {cell(x['claim'])} | {cell(x['doesNotEstablish'])} | {cell(', '.join(x['bearsOn']))} | {x['sourceClass']} | {x['status']} |")
sl += ['', '## External claims without a source', '']
sl += [f"- **{k}:** {v}" for k, v in MISSING.items()]
sl += ['', '## Recurring words, actual objects', '', 'A shared word is not shared mathematics. Each recurring term below names several different objects in the Foundation.', '',
       '| Word | Objects it names here | Kept apart by |', '|---|---|---|',
       '| energy | ‖x‖² = ∫\\|x\\|²dt (L² "energy"); physical energy E (MW2); the Hamiltonian H (CF6); scattering "energy" = an L² norm (W2) | A3, ON9, OB1 |',
       '| null | quadratic null q(v) = 0, v ≠ 0 (Z5); kernel / statistical null Jv = 0 (Z9); alternating self-pairing ω(v, v) = 0 (CF6); a zero observable Aψ = 0 (Z6) | BR29, BR30, FB7, FB9 |',
       '| balance | first-moment zero Σmᵢ(rᵢ − R_CM) = 0 (Z2); quasi-steady state dC/dt = 0 (M3) | Z2 vs M3: one is a configuration constraint, the other an approximation of a dynamics |',
       '| dimension | dimension of a state space (dim H₀ = 6); number of subsystems; number of parameters; physical spatial dimension | four-spin record; no physical dimension is inferred |',
       '| invariance | exact preservation of a form (AᵀMA = M); scattering translation invariance (approximate, scale-dependent, W2); Fisher-metric reparametrization invariance (CF10); conserved quantities (CF5–CF7) | the source registry\'s "does not establish" column |']
(ROOT / 'research/foundation_sources.md').write_text('\n'.join(sl) + '\n')

cl = ['# Foundation completion ledger (Pass 2)', '', 'Generated from `research/tools/foundation_source.py`. Do not edit by hand. Pass 2: 2026-11-12. Object IDs are from `research/foundation_dependencies.md`; sources from `research/foundation_sources.md`.', '',
      'Foundation V1 may contain open questions. What blocks completion is limited to: missing architecture; an unresolved contradiction; an undefined central object; an incorrect mathematical bridge; major provenance loss. An open hypothesis does not block V1.', '',
      '## LOCKED (Pass 2)', '',
      '- **Foundation** is the complete mathematical and theoretical architecture developed throughout the project. The zero work is one part of it.',
      '- **The spine** OBJECT → REPRESENTATION → RELATION → ZERO / BALANCE / NULL → TRANSFORMATION → PRESERVED STRUCTURE → GEOMETRY → INFORMATION → DYNAMICS / CONTINUATION → CROSS-SYSTEM TRANSFER → APPLICATION is a project architecture, not a theorem.',
      '- **Zero is a central investigative interface inside the architecture.** It is not the entire Foundation.',
      '- **Common-form / preserved-relation mathematics is a major unifying mechanism inside the architecture.** It is not the entire Foundation.',
      '- **Two maps:** `research/master_math_map.md` is the research ontology; `docs/act_map.md` is the teaching / discovery order. They need not share an ordering.',
      '- **CF11** is two records, rated separately: CF11-A (established pattern) and CF11-B (project hypothesis).',
      '- **DYADIC PACKETS** is an ORIGINAL USER RESEARCH TERM with an OPEN DEFINITION.',
      '- **Classification systems:** seven provenance classes, seven bridge strength classes, the source registry, and the domain statuses below.',
      '- **Transformation Architecture (TA0, Pass 3 correction):** R1 representation covariance; R2 structural invariance / symmetry (F*T = T); R3 equivariance / intertwining (C ρ_V(g) = ρ_W(g) C). Related but distinct; never collapsed. Transformation classes named in every domain: ' + '; '.join(TRANSFORMATION_CLASSES) + '.',
      '- **Reduction / Information-Changing Architecture (RI0, 2026-11-13):** for Φ: X → Y, what survives, collapses, becomes zero, is lost, is reconstructible, the fibers, and symmetry compatibility. Parallel to the Transformation Architecture, not an R4; their intersection is information-changing maps that are also equivariant (RI1). PRESERVED ZERO vs COLLAPSED ZERO (RI2) is an additional relationship in the zero architecture. The seven answers per map are in `research/foundation_reduction_maps.md`.', '',
      '## CF11-B after Pass 3', '',
      f"- **Outcome:** {CF11B['outcome']} (PARTIAL SURVIVAL), by the decision rule preregistered in `{CF11B['prereg']}` (commit {CF11B['preregCommit']}). Result: `{CF11B['record']}`.",
      f"- **Classification:** {CF11B['classification']}. The wording of CF11-B is unchanged.",
      '- **Why:** one law, F*T = T, expresses the symmetries of constant-form, symplectic and Fisher geometry, but structural invariance alone organizes generic Fisher geometry only vacuously (F-C′ has an exact null and no supplied symmetry). Representation covariance under reparametrization covers it non-vacuously; derived operators such as weighted centering need equivariance.',
      f"- **Architectural correction:** {CF11B['correction']} History: CF11 original → Fisher preregistered test → CF11-F2 → architectural correction → Transformation Architecture R1/R2/R3.",
      f"- **Pullback common form:** {CF11B['pullbackCommonForm']}. Several major geometries in the Foundation admit a common coordinate-free preservation form in which an admissible symmetry preserves a defining tensor/form under pullback (CF12, BR36). Not all geometry; not reparametrizations.", '',
      '## Domain statuses', '', 'Statuses: ' + '; '.join(DOMAIN_STATUSES) + '.', '',
      '| Domain | Foundation objects | Status | Note |', '|---|---|---|---|']
for d in D:
    cl.append(f"| {d['id']}. {d['name']} | {', '.join(d['objects'])} | {d['status']} | {cell(d['note'])} |")
cl += ['', '## Blocking items for Foundation V1', '', '| Kind | Item |', '|---|---|',
       '| missing architecture | none at the level of branches; CF11-B is tested (REFINED); the explicit refinement awaits adoption |',
       '| unresolved contradiction | none found (the Act-map framing and the two meanings of "Foundation" are resolved) |',
       '| undefined central object | none (DYADIC PACKETS is an open user term, not a central object of the spine) |',
       '| incorrect mathematical bridge | none found; every bridge has a strength class, assumptions, a failure condition and what it does not prove |',
       '| provenance loss | the quinn2023 PDF (P-2); ThermaLens mathematics (APPLICATION PROVENANCE INCOMPLETE); the original mass-attraction wording (ORIGINAL VERBATIM NOT RECOVERED); no source opened at full text |',
       '', '## Foundation ratings (separate dimensions, no overall score)', '', '| Dimension | Rating | Previous (Reduction architecture pass) | Reason for the change |', '|---|---|---|---|']
for a, b_, c, d in RATINGS:
    cl.append(f"| {a} | {b_}% | {c}% | {d} |")
cl += ['', '## CF11 and Transformation Architecture ratings (separate records)', '', '| Record | Statement | Mathematical Status | Novelty | Transfer Depth | Backbone Support | AI Slop Risk | Application Breadth |', '|---|---|---|---|---|---|---|---|']
short = {'CF11-A': 'In many established geometries, a relational structure together with the transformations preserving it characterizes substantial geometric structure', 'CF11-B': None, 'CF11-R': 'A geometry may be characterized by relational structure together with transformations under which that structure is preserved or transforms coherently (explicit form: P1 + P2, P3 for derived operators)', 'CF12': 'F*T = T, the coordinate-free common form (BR36)'}
short.update({'CF1': 'A†MA = M (R2, matrix form)', 'TA1': 'R1 representation covariance', 'TA2': 'R2 structural invariance, F*T = T', 'TA2I': 'R2 infinitesimal, L_X T = 0; KᵀM + MK = 0', 'TA3': 'R3 equivariance / intertwining', 'TA0': 'Transformation Architecture (project-level organizing architecture)', 'TAH': None})
short.update({'RI0': 'Reduction / Information-Changing Architecture', 'RI1': 'information-changing maps that are also equivariant', 'RI2': 'PRESERVED ZERO vs COLLAPSED ZERO', 'W3': 'DYADIC PACKETS: candidate role only (ORIGINAL USER RESEARCH TERM; OPEN DEFINITION)'})
for i in ('CF11-A', 'CF11-B', 'CF11-R', 'CF12', 'TA1', 'TA2', 'CF1', 'TA2I', 'TA3', 'TA0', 'TAH', 'RI0', 'RI1', 'RI2', 'W3'):
    o = next(o for o in O if o['id'] == i)
    cl.append(f"| {i} ({o['status']}) | {short[i] or o['equation']} | {o['mathematicalStatus']} | {o.get('novelty') or '—'} | {o['transferDepth']} | {o['backboneSupport']}% | {o['slopRisk']}% | {o['applicationBreadth']} |")
cl += ['', 'CF11-A\'s confidence does not transfer to CF11-B. Pass 3 changes: CF11-A 55% / 10% → 60% / 8% (breadth corrected 4 → 3 to the rubric); CF11-B 30% / 30% → 35% / 25%, NOT YET FORMALIZED → STRUCTURAL TRANSFER (with the refinement), SPECULATIVE MAPPING → PROJECT-DERIVED FROM KNOWN DEFINITIONS, breadth 2 → 3. Mathematical novelty of CF12: none (KNOWN MATHEMATICS); Foundation relevance: high.', '',
       '## Recommended next pass (one primary obligation)', '',
       '**Model-manifold invariance audit.** Pass 3 found that the component eigenvalues of a Fisher metric are not coordinate invariants (CFT5e), and the project\'s sloppy-spectrum card S14 (M1) is computed in log-parameter coordinates. Before any C7 work, restate every model-manifold quantity the Foundation uses (the sloppy spectrum, hyperribbon widths, null directions, the C7 comparison object) as either coordinate-invariant, with its invariant definition, or explicitly coordinate-stated, and card the difference.']
(ROOT / 'research/foundation_completion.md').write_text('\n'.join(cl) + '\n')

rl = ['# Reduction / information-changing maps', '', 'Generated from `research/tools/foundation_source.py` (`research/foundation.json`, key `reductionMaps`). Do not edit by hand. 2026-11-13.', '',
      'For each map Φ: X → Y: what survives, what collapses, what becomes zero, what is lost, what is reconstructible (with its assumptions), the fibers Φ⁻¹(y), and whether Φ respects a symmetry. Axis A: invertible or not, information-preserving or information-changing. Axis B: covariant, invariant, equivariant or none. These are an analytic tool for Foundation V1, not final universal categories. Mechanisms are kept separate; the shared item is the question, not one theorem.', '',
      '| Map | Axis A | Axis B | Survives | Collapses | Becomes zero | Lost | Reconstructible | Fibers | Symmetry compatibility | Cards | Status |', '|' + '---|' * 12]
for r in RMAPS:
    rl.append(f"| {cell(r['name'])} | {cell(r['axisA'])} | {', '.join(r['axisB'])} | {cell(r['survives'])} | {cell(r['collapses'])} | {cell(r['zero'])} | {cell(r['lost'])} | {cell(r['reconstructible'])} | {cell(r['fibers'])} | {cell(r['symmetry'])} | {cell(', '.join(r['cards']))} | {r['status']} |")
(ROOT / 'research/foundation_reduction_maps.md').write_text('\n'.join(rl) + '\n')

ul = ['# Original user theories (Foundation Part X, detail)', '', 'Every user-origin record in `research/theories.json`, with its original wording, normalized reading and status kept separate. Generated; do not edit by hand.', '',
      '| Registry ID | Original wording | Normalized interpretation | Kind | Status | Foundation objects |', '|---|---|---|---|---|---|']
where = {}
for o in O:
    for r in o['registry']: where.setdefault(r, []).append(o['id'])
for r in reg.values():
    if r['origin'] != 'user': continue
    ul.append(f"| {r['id']} | {cell(r['words'])} | {cell(r['normalizedStatement'])} | {r['kind']} | {r['status']} | {cell(', '.join(where.get(r['id'], [])))} |")
(ROOT / 'research/foundation_user_theories.md').write_text('\n'.join(ul) + '\n')
print(len(O), 'objects;', len(B), 'bridges;', len(S), 'sources; established/derived carded', len(carded), '/', len(est), f'({round(100 * len(carded) / len(est))}%); external sourced', len(ext_src), '/', len(ext))
