"""Foundation V1 data (the dependency architecture), 2026-11-12.
Writes research/foundation.json and renders research/foundation_dependencies.md, research/foundation_bridges.md and
research/foundation_user_theories.md. research/master_math_map.md and research/foundation_completion.md are written by
hand and cite these ids. test/foundation.test.js checks every card, registry id and enum.
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
obj('R3', 'Parseval / Plancherel', E, ['PRESERVED STRUCTURE'], '‖f‖² = Σ|f̂(k)|²', 'ESTABLISHED', cards=['S2b', 'B4a', 'O2b'], depends=['R1', 'R2'], bears=['T-ENERGY-MEANING'], bs=25, slop=5,
    fail='none', role='what one representation change preserves', guide='Guide: Fourier (#7, #8)')
obj('R4', 'Translation becomes phase', E, ['TRANSFORMATION', 'REPRESENTATION'], 'T_τ e_k = e^{−2πikτ} e_k', 'ESTABLISHED', cards=['S3'], depends=['R1'], supports=['T-H2'], bs=20, slop=5,
    fail='none', role='a transformation diagonalized by a representation', guide='Guide: Fourier')
obj('R5', 'Fourier transform as a quarter-turn', E, ['REPRESENTATION', 'TRANSFORMATION'], 'F h_n = (−i)^n h_n, F⁴ = I; oscillator flow (x, p) → (p, −x)', 'ESTABLISHED', cards=['S11', 'S11b'],
    docs=['research/connections/C4.md'], bs=20, slop=5, fail='none', role='representation change as a group action (C4a)', guide='Guide: Fourier')
obj('R6', 'Circle / phase representation of an unbounded parameter', E, ['REPRESENTATION', 'DYNAMICS / CONTINUATION'], 't ↦ e^{iωt} ∈ S¹, t ∈ ℝ', 'ESTABLISHED', cards=['C8a', 'G1c'],
    supports=['T-TIME-CIRCLE', 'B-FINITE-INFINITE'], bs=30, slop=5, fail='none', role='canonical finite geometry / unbounded parameter example', guide='Act II / Act IV')
obj('R7', 'Prediction map of a model', PB, ['REPRESENTATION', 'GEOMETRY'], 'θ ↦ Y(θ); model manifold 𝒴 = {Y(θ)}', 'ESTABLISHED', docs=['research/sources/quinn2023.md'], reg=['T-INFOGEO'],
    bs=20, slop=10, fail='—', role='parameters represented as predictions', guide='Guide: model manifolds', gap='paper PDF not yet in the repository (P-2)')
obj('R8', 'Projection of an orthonormal source', PC, ['REPRESENTATION', 'ZERO / BALANCE / NULL'], 'x ↦ P_n x, P_n = I − (1/n)11ᵀ', 'ESTABLISHED', cards=['G2a', 'G2n'], reg=['T-R4-TETRA'],
    bs=30, slop=5, fail='none', role='the first outside-in construction', guide='Act III')
obj('R9', 'Different objects or different descriptions of one object?', UT, ['REPRESENTATION'], '—', 'OPEN', reg=['T-REPRESENTATION', 'T-VISIBLE-HIDDEN', 'T-BACKBONE-SECONDARY'],
    bs=None, slop=None, fail='—', role='the oldest project question', guide='all Acts')
obj('R10', 'Common structural law rather than analogy', UT, ['REPRESENTATION', 'CROSS-SYSTEM TRANSFER'], 'phenomena satisfying one exact relation under a representation → search for a shared law', 'HYPOTHESIS',
    reg=['T-BACKBONE-SECONDARY'], bs=25, slop=30, fail='"appropriate representation" left unrestricted makes any two systems satisfy one relation (AMB-18)', role='backbone (secondary)', guide='all Acts')

# ── relation / common form (Layer 2) ───────────────────────────────────────────────────────────
obj('CF1', 'Form preservation ⟺ AᵀMA = M', E, ['RELATION', 'PRESERVED STRUCTURE', 'GEOMETRY'], '(AᵀMA)_ij = B_M(Ae_i, Ae_j); B_M(Ax, Ay) = B_M(x, y) ∀x,y ⟺ AᵀMA = M', 'ESTABLISHED',
    cards=['C1b', 'S4e', 'S4f', 'S5c', 'O1a'], docs=['research/connections/C1.md'], supports=['T-BACKBONE-INVARIANT'], bs=40, slop=10,
    fail='none (theorem)', role='the common-form core: a relation and the transformations that keep it', guide='Foundation (currently Guide: forms; see decision L1)')
obj('CF2', 'Zero relations are kept by form-preserving maps', E, ['ZERO / BALANCE / NULL', 'PRESERVED STRUCTURE'], 'AᵀMA = M ⇒ (B_M(x, y) = 0 ⇒ B_M(Ax, Ay) = 0)', 'ESTABLISHED',
    cards=['C1b'], depends=['CF1'], supports=['T-BACKBONE-INVARIANT'], bears=['T-ZERO-ORTHOGONAL-B'], bs=40, slop=10, fail='none', role='where invariant-form work and zero work meet', guide='Act IV / Guide')
obj('CF3', 'Preserving zero resultants identifies no form', NG, ['ZERO / BALANCE / NULL', 'PRESERVED STRUCTURE'], 'every linear A keeps Σv = 0; 2I keeps every zero resultant but DᵀMD = M only for M = 0', 'ESTABLISHED',
    cards=['Z4a', 'Z4b'], reg=['T-ZERO-NO-FORM'], bs=30, slop=5, fail='—', role='boundary: a zero relation alone does not fix a geometry', guide='Act III (research note)')
obj('CF4', 'Global preserved form → generator rule', E, ['TRANSFORMATION', 'PRESERVED STRUCTURE'], 'exp(sK)ᵀ M exp(sK) = M ∀s ⟺ KᵀM + MK = 0', 'ESTABLISHED', cards=['S9', 'S9(2)', 'S9(3)', 'B1a', 'C9c'],
    docs=['research/connections/C1.md'], depends=['CF1'], bs=35, slop=10, fail='none', role='global geometry → infinitesimal rule (rotation, boost, symplectic)', guide='Guide: forms / generators')
obj('CF5', 'Invariant form ⟺ conservation along a linear flow', E, ['DYNAMICS / CONTINUATION', 'PRESERVED STRUCTURE'], 'z\' = Kz: d/dt(zᵀMz) = zᵀ(KᵀM + MK)z = 0 ⟺ KᵀM + MK = 0 (M symmetric)', 'ESTABLISHED',
    cards=['S9b', 'C2a'], docs=['research/connections/C2.md'], depends=['CF4'], bs=35, slop=10, fail='none', role='symmetry → conservation, linear case', guide='Guide: conservation')
obj('CF6', 'Hamiltonian flow conserves H', E, ['DYNAMICS / CONTINUATION'], 'ż = J∇H, J antisymmetric ⇒ dH/dt = ∇HᵀJ∇H = 0', 'ESTABLISHED', cards=['C1a', 'C1a(2)', 'C1c', 'S9(3)'],
    depends=['CF4'], bs=30, slop=10, fail='none', role='geometric constraint → conserved quantity', guide='Guide: conservation')
obj('CF7', 'Noether: continuous symmetry → conserved quantity (Lagrangian)', E, ['TRANSFORMATION', 'DYNAMICS / CONTINUATION'], 'δL = 0 under a one-parameter symmetry ⇒ d/dt(∂L/∂q̇ · δq) = 0', 'ESTABLISHED',
    docs=[SPEC, 'research/connections/C2.md'], bs=30, slop=10, fail='none (theorem, under its assumptions)', role='symmetry → conservation, general', guide='Guide: conservation',
    gap='no card and no source card; only the linear-flow special case (CF5) is carded')
obj('CF8', 'Sign of the invariant decides bounded / unbounded', PD, ['GEOMETRY', 'DYNAMICS / CONTINUATION'], 'traceless J: J² = −det J · I → rotation / boost / shear; Kepler sign(E) = sign(e − 1)', 'ESTABLISHED',
    cards=['S4a', 'S4b', 'S4c', 'S4d', 'B1b', 'B1c', 'S10'], docs=['research/connections/C3.md'], bears=['T-H3', 'T-STAR'], bs=30, slop=15, fail='Kepler is a supporting exploration, not the same object (C3)', role='trichotomy of continuation', guide='Act IV / Guide')
obj('CF9', 'Weighted inner product read off a zero relation', PC, ['RELATION', 'GEOMETRY'], '⟨x, y⟩_D = xᵀDy, D = diag(m): first-moment zero = ⟨1, C_m x⟩_D = 0', 'ESTABLISHED', cards=['G5b', 'G5d'],
    reg=['T-WMC', 'T-CENTERING-OPERATOR'], bs=45, slop=15, td='STRUCTURAL TRANSFER', breadth=2, fail='1ᵀG1 = 0 or non-positive weights', role='a metric that emerged from a relation', guide='Act III')
obj('CF10', 'Fisher / Riemannian metric on parameters', PB, ['RELATION', 'GEOMETRY'], 'ds² = dθᵀ g(θ) dθ, g = JᵀJ/σ² (Gaussian noise)', 'ESTABLISHED', docs=['research/sources/quinn2023.md', SPEC],
    depends=['R7'], bs=20, slop=10, fail='—', role='a metric induced by a representation', guide='Guide: model manifolds', gap='no card for g = JᵀJ/σ²; S14 cards use it numerically')
obj('CF11', 'Common-form architecture (project-level candidate)', PD, ['RELATION', 'TRANSFORMATION', 'PRESERVED STRUCTURE', 'GEOMETRY'],
    'relation R → G_R = {A : R(Ax, Ay) = R(x, y)} → geometry characterized by (R, G_R)', 'HYPOTHESIS', depends=['CF1', 'CF4', 'CF9', 'CF10'], reg=['T-BACKBONE-INVARIANT', 'T-H2-ROLES'],
    bs=35, slop=25, td='STRUCTURAL TRANSFER', breadth=3, fail='a geometry the project needs whose rule is not a preserved relation (e.g. zero-resultant preservation, CF3)', role='the proposed common architecture of old and new work', guide='Act III–IV, Guide')

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
obj('Z9', 'Model-manifold null / nonidentifiable direction', PB, ['ZERO / BALANCE / NULL', 'GEOMETRY'], 'g(θ) v = 0: a parameter direction with no effect on predictions', 'ESTABLISHED',
    docs=['research/sources/quinn2023.md', SPEC], reg=['T-INFOGEO'], bs=20, slop=15, fail='—', role='a statistical null, distinct from a quadratic null (OB1)', guide='Guide: model manifolds',
    gap='no card; NEEDS ONE DERIVATION (a reparametrization-redundant model has g v = 0)')
obj('Z10', 'Definite quadratic zero (identifies the state)', NG, ['ZERO / BALANCE / NULL'], '|x|² = 0 ⟺ x = 0', 'ESTABLISHED', cards=['Z5a'], bs=10, slop=5, fail='—',
    role='boundary: some zeros hide nothing', guide='Act I (formal note)')
obj('Z11', 'Zero as connector / interface', UT, ['ZERO / BALANCE / NULL', 'CROSS-SYSTEM TRANSFER'], 'source relations → representation → zero/resultant interface', 'HYPOTHESIS', depends=['Z3', 'H2'],
    reg=['T-ZERO-CONNECTOR', 'T-BACKBONE-PRIMARY'], bs=25, slop=30, td='STRUCTURAL TRANSFER', breadth=3, fail='zeros repeatedly inherited or nonlinear with no connector formulation', role='working backbone hypothesis', guide='Act III')
obj('Z12', 'The visible zero does not determine where the hidden information lives', PD, ['ZERO / BALANCE / NULL', 'INFORMATION', 'CROSS-SYSTEM TRANSFER'],
    'spins: contribution geometry blind, independent symmetry decisive (FOUR-SPIN-B); mass: contribution geometry decisive, symmetry partial', 'DERIVED', cards=['FS2b', 'FS2c', 'MB2a', 'MB2b', 'Q2d', 'Q2h'],
    reg=['T-ZERO-SYMMETRY-ARCHITECTURE', 'T-FOURSPIN-SYMMETRY', 'T-MASS-SECOND-MOMENT'], bs=35, slop=20, td='STRUCTURAL TRANSFER', breadth=2,
    fail='a system where neither geometry nor independent symmetry carries the hidden label', role='strongest defensible cross-domain methodological result', guide='Act III')

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
obj('T3', 'Translation defect ↔ autocorrelation ↔ power spectrum', E, ['TRANSFORMATION', 'INFORMATION'], 'D_x(τ) = 1 − ρ_x(τ); ρ_x ↔ |x̂|² (Wiener–Khinchin)', 'ESTABLISHED',
    cards=['B5b', 'P1a', 'B5a2'], depends=['T2', 'R4'], reg=['T-SAME-SPECTRUM'], bs=30, slop=10, fail='none', role='transformation geometry ↔ correlation ↔ spectral magnitude',
    guide='Guide (Block 5) / Act IV', gap='the combined continuous statement (D ↔ ρ ↔ |x̂|²) is assembled from separate cards; NEEDS ONE DERIVATION card')
obj('T4', 'Small translation ↔ spectral second moment', E, ['TRANSFORMATION', 'INFORMATION'], 'D_x(τ) ≈ (τ²/2)∫ω² dμ_x(ω), dμ_x = |x̂|²dω/‖x‖²', 'ESTABLISHED', docs=[SPEC], depends=['T3'],
    bs=25, slop=10, fail='—', role='translation sensitivity = spectral spread', guide='Guide (Blocks 5, 8)', gap='no card; NEEDS ONE DERIVATION')
obj('T5', 'Localization / uncertainty', E, ['INFORMATION'], 'Δt Δω ≥ 1/2 (convention-dependent)', 'ESTABLISHED', docs=[SPEC], depends=['T4'], reg=['T-SENSITIVITY'], bs=20, slop=10, fail='—',
    role='spread in two representations; not the same equation as T4', guide='Guide (Block 8)', gap='no card and no source card; NEEDS SOURCE')

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
obj('M1', 'Sloppy spectrum of a sum of exponentials', PB, ['GEOMETRY', 'INFORMATION'], 'FIM eigenvalues roughly evenly spaced in log', 'ESTABLISHED', cards=['S14b'], docs=['research/sources/quinn2023.md'],
    bs=15, slop=15, fail='S14a FAIL kept (span 3.1 decades, threshold 4)', role='paper-backed territory', guide='Guide: model manifolds', gap='S14b is weak (tolerance set after the data)')
obj('M2', 'Hyperribbons, boundaries, effective models (MBAM)', PB, ['GEOMETRY', 'INFORMATION'], 'hierarchical widths; manifold boundaries = reduced models', 'ESTABLISHED', docs=['research/sources/quinn2023.md', SPEC],
    reg=['T-INFOGEO'], bs=15, slop=15, fail='—', role='paper-backed reduced descriptions', guide='Guide: model manifolds', gap='no card; source PDF pending (P-2)')
obj('M3', 'Michaelis–Menten effective manifold', PB, ['INFORMATION'], 'singular-perturbation reduction of a mass-action model', 'ESTABLISHED', docs=[SPEC], bs=10, slop=15, fail='—',
    role='a worked reduction', guide='Guide: model manifolds', gap='spec only; NEEDS SOURCE and a card')
obj('M4', 'C7: coefficient decay vs Fisher eigenvalue decay', OQ, ['INFORMATION', 'CROSS-SYSTEM TRANSFER'], 'find an operator/map/asymptotic theorem, or show the resemblance is superficial', 'OPEN',
    cards=['S14b', 'S7'], reg=['T-C7'], docs=['research/connections/C7.md'], bs=10, slop=45, td='NOT YET FORMALIZED', breadth=0, fail='S14a FAIL kept', role='active open comparison', guide='Guide: model manifolds')

# ── wavelets / scattering (Layer 11) ──────────────────────────────────────────────────────────
obj('W1', 'Wavelet cancellation', E, ['ZERO / BALANCE / NULL', 'REPRESENTATION'], '∫ψ = 0', 'ESTABLISHED', reg=['T-WAVELETS'], bs=15, slop=10, fail='—', role='a designed zero',
    guide='Guide: wavelets / scattering', gap='no card and no source; NEEDS SOURCE (Mallat) and a card')
obj('W2', 'Scattering: filter → modulus → average, iterated', PB, ['INFORMATION', 'REPRESENTATION'], 'S f = (f ∗ φ, |f ∗ ψ_λ| ∗ φ, ||f ∗ ψ_λ₁| ∗ ψ_λ₂| ∗ φ, …)', 'ESTABLISHED', reg=['T-WAVELETS'],
    bs=15, slop=15, fail='—', role='information destroyed by averaging and retained by modulus at the next order', guide='Guide: wavelets / scattering', gap='not in the repository: NEEDS SOURCE (Mallat 2012) and a card')
obj('W3', 'DYADIC PACKETS', UT, ['REPRESENTATION'], 'definition OPEN (not normalized to standard wavelet packets)', 'OPEN', reg=['T-DYADIC'], bs=None, slop=None, fail='—', role='user-origin research term', guide='Guide: wavelets')
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
    cards=['G5a', 'G5b', 'G5c', 'G5d', 'G5e', 'G5f', 'G4m'], reg=['T-WMC', 'T-CENTERING-OPERATOR', 'T-PAIRA-BRIDGE'], depends=['H1'], bs=45, slop=15, td='STRUCTURAL TRANSFER', breadth=2,
    fail='Fourier k ≠ 0, Σ weights = 0, nonlinear zeros', role='GENERAL CONSTRUCTION (locked to 1)', guide='Act III')
obj('H5', 'Larger generating geometry', UT, ['GEOMETRY', 'ZERO / BALANCE / NULL'], 'hidden information in a lower-dimensional manifestation may be encoded in the larger geometry that generates it', 'HYPOTHESIS',
    depends=['H1', 'H2', 'H3'], reg=['B-HIGHER-GEOMETRY', 'B-HIGHER-GEOMETRY-CHAIN'], bs=35, slop=25, td='STRUCTURAL TRANSFER', breadth=2, fail='zeros with no source reconstruction under any class', role='backbone hypothesis', guide='Act III')
obj('H6', 'Effective / reduced representations (question)', OQ, ['INFORMATION'], 'what survives when a richer source is reduced to an effective representation?', 'OPEN', depends=['ON3', 'H1', 'H4', 'M2', 'M3'],
    bs=None, slop=None, fail='—', role='compares projection, simplex, centering, MBAM, singular perturbation, coarse-graining without equating them', guide='Act III / Guide',
    gap='coarse-graining (Block 17) and renormalization have no source or card')

# ── quantum same zero (Layer 3/12) ────────────────────────────────────────────────────────────
obj('QZ1', 'Same zero, different states (two spins)', E, ['ZERO / BALANCE / NULL', 'INFORMATION'], 'S_z A = S_z B = 0, S² separates', 'ESTABLISHED', cards=['Q1a', 'Q1b', 'Q1c', 'Q1e'],
    reg=['T-QUANTUM-ZERO', 'T-ZERO-GENERAL'], bs=25, slop=5, fail='—', role='Chapter I stage 2b', guide='Act I')
obj('QZ2', 'Quantum cancellation pair, restricted obstruction, exchange', PC, ['ZERO / BALANCE / NULL', 'TRANSFORMATION'], 'S_z^(1)|1,0⟩ = (ħ/2)|0,0⟩ = −S_z^(2)|1,0⟩; Gram-class descriptors cannot separate; P c₁ = ±c₂ does', 'ESTABLISHED',
    cards=['Q2a', 'Q2b', 'Q2c', 'Q2d', 'Q2e', 'Q2h'], reg=['T-QACP', 'T-QACP-OBSTRUCTION-RESTRICTED', 'T-QACP-EXCHANGE'], bs=40, slop=8, breadth=1, fail='non-eigenstates of P (Q2g)', role='same-zero test 1', guide='Act I / III')
obj('QZ3', 'Four spins: FOUR-SPIN-B', PC, ['ZERO / BALANCE / NULL', 'TRANSFORMATION', 'INFORMATION'], 'contribution Gram blind (phases); S₄ cyclic dimension 1/3/2 = S 2/1/0', 'ESTABLISHED',
    cards=['FS1a', 'FS1c', 'FS1d', 'FS1e', 'FS2b', 'FS2c', 'FS2e'], reg=['T-FOURSPIN-SYMMETRY', 'T-FOURSPIN-GEOMETRY-BLIND', 'T-FOURSPIN-SIMPLEX'], bs=40, slop=8, breadth=1,
    fail='none in H₀', role='same-zero test 2 (VALIDATION OF KNOWN MATHEMATICS)', guide='Act III')
obj('QZ4', 'Measurement, dephasing, which-path', E, ['INFORMATION'], 'non-selective S² measurement: ρ_AB → 0, S_z = 0 kept; which-path markers: cross term × ⟨m_a|m_b⟩', 'ESTABLISHED',
    cards=['W1a', 'W1b', 'W1c', 'W2a', 'W2b', 'W2c', 'W2d', 'W3a', 'W3b', 'Q1g', 'Q1h'], reg=['B-JOINT-ALTERNATIVES', 'B-ZERO-INTERNAL-CHANGE', 'T-S2-DEPHASING'], bs=25, slop=25, td='TRIVIAL CONSEQUENCE', breadth=2,
    fail='—', role='leave / change within / interrogate: kept apart', guide='Act III')
obj('QZ5', 'Zero-preserving interrogation (method)', 'ORIGINAL USER THEORY', ['ZERO / BALANCE / NULL'], 'do not leave the defining zero merely to obtain observability', 'GOVERNANCE',
    reg=['B-ZERO-PRESERVE', 'B-ZERO-LOSS', 'B-ZERO-INTERNAL-CHANGE', 'B-INDEPENDENT-SYMMETRY'], bs=None, slop=None, fail='—', role='method rule', guide='all Acts')

# ── pairs, mass–wave, gravity (Layers 14–15) ──────────────────────────────────────────────────
obj('P1', 'Real-signal conjugate symmetry', E, ['RELATION', 'REPRESENTATION'], 'f̂(−k) = conj f̂(k) for real f', 'ESTABLISHED', reg=['T-CONJUGACY'], bs=10, slop=10, fail='—', role='the established Fourier pair case',
    guide='Guide: Fourier', gap='used in #7, no card; NEEDS ONE DERIVATION card')
obj('P2', 'Physical pairs from deeper conjugacy or symmetry?', UT, ['CROSS-SYSTEM TRANSFER'], '—', 'OPEN', depends=['P1'], reg=['T-CONJUGACY'], bs=None, slop=None, fail='—', role='open user question', guide='Guide / Act IV')
obj('MW1', 'Mass is waves too, it\'s just a different form', UT, ['OBJECT', 'REPRESENTATION'], '—', 'HYPOTHESIS', reg=['T-MASS-WAVE-SEED', 'T-MASS-WAVE', 'T-MASS-WAVE-Q', 'T-MATTER-FIELD'], bs=20, slop=35, fail='—',
    role='original user theory (verbatim, recorded 2026-11-12)', guide='Guide: Lorentz / waves')
obj('MW2', 'Relativistic dispersion (supporting mathematics)', E, ['RELATION'], 'PᵀηP = m²c² ⟺ E² = p²c² + m²c⁴; with E = ħω, p = ħk: ω² = c²k² + m²c⁴/ħ²', 'ESTABLISHED', cards=['S12'],
    bears=['T-MASS-WAVE-SEED', 'T-MASS-WAVE'], bs=20, slop=20, fail='—', role='one exact relation in two sets of variables; not a proof of MW1', guide='Guide: Lorentz',
    gap='the ω–k form is not carded; NEEDS ONE DERIVATION card')
obj('MW3', 'Mass attraction may not be far removed', UT, ['CROSS-SYSTEM TRANSFER'], '—', 'OPEN', reg=['T-GRAVITY-ATTRACTION'], bs=5, slop=60, fail='—', role='speculative, retained, no construction', guide='unplaced')

# ── application (Layer 16) ────────────────────────────────────────────────────────────────────
obj('A1', 'Energeo', UT, ['APPLICATION'], 'can energy behavior be represented so that hidden balance, null relations and invariant structure become geometrically explicit?', 'OPEN',
    reg=['T-ENERGEO', 'T-ENERGEO-INTENT'], bs=None, slop=None, fail='—', role='downstream translator; not evidence upstream', guide='Final Act')
obj('A2', 'ThermaLens / Energeo implementation mathematics', UT, ['APPLICATION'], '—', 'OPEN', reg=['T-THERMALENS'], bs=None, slop=None, fail='—', role='kept separate from Foundation proof',
    guide='Final Act', gap='not in this repository: provenance gap (NEEDS SOURCE)')
obj('A3', 'Physical energy vs L² energy', E, ['OBJECT', 'APPLICATION'], '‖x‖₂² is signal energy only by name; physical energy depends on the variable and its units', 'ESTABLISHED', docs=[SPEC],
    depends=['ON9'], reg=['T-ENERGY-MEANING'], bs=15, slop=5, fail='—', role='wording guard', guide='Final Act / Guide', gap='NEEDS WORDING ONLY')

# ── philosophical lenses ──────────────────────────────────────────────────────────────────────
obj('PL1', 'Philosophical lenses (retained)', PL, ['OBJECT', 'CROSS-SYSTEM TRANSFER'], 'existence as zero; part / whole and the fractal; space exploration; looking inside zero; irreversible formation; subconscious; relational perception', 'OPEN',
    reg=['T-EXISTENCE-ZERO', 'B-PART-WHOLE', 'T-SPACE-EXPLORATION', 'T-LOOK-INSIDE', 'T-IRREVERSIBLE-FORMATION', 'T-SUBCONSCIOUS', 'T-PERCEPTION-RELATIVITY', 'T-NATURE-OR-DESCRIPTION'],
    docs=['docs/author_philosophy.md'], bs=None, slop=None, fail='—', role='intellectual origin; not proof', guide='About the Author / Act III close (part / whole)')

# ── failures (Part XIII) ──────────────────────────────────────────────────────────────────────
obj('F1', 'Failures that define boundaries', NG, ['CROSS-SYSTEM TRANSFER'], 'kept FAIL cards S14a, C8c, B5a, Z1a, Z2b; T′ unchanged fails on unequal masses, quantum, Fourier k ≠ 0, orthogonality; contribution geometry fails for spins; R1 misses M5; P1 converse fails; ε undefined off exchange eigenstates; linear template fails on nonlinear zeros', 'NEGATIVE',
    cards=['S14a', 'C8c', 'B5a', 'Z1a', 'Z2b', 'G4m', 'FS2c', 'FS2d', 'MB2a', 'Q2g', 'Q2b'], docs=['research/application_matrix.md'], bs=None, slop=None, td='FAIL', fail='—', role='what does not unify', guide='research record')

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

reg = {r['id']: r for r in json.loads((ROOT / 'research/theories.json').read_text())['theories']}
data = dict(about='Foundation V1 dependency architecture (2026-11-12). Generated by research/tools/foundation_source.py.', layers=LAYERS, stages=STAGES, statuses=STATUS, transferDepths=TD, objects=O, bridges=B)
(ROOT / 'research/foundation.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')

cell = lambda x: '—' if x in (None, '', []) else str(x).replace('|', '\\|')
pct = lambda x: '—' if x is None else f'{x}%'
lines = ['# Foundation dependency table', '', 'Generated from `research/tools/foundation_source.py` (`research/foundation.json`). Do not edit by hand. "Supports" means the evidence carries the record; "bears on" means it is relevant without supporting it. Ratings are per object; there is no overall score.', '',
         '| ID | Name | Type | Stage(s) | Depends on | Supports | Bears on | Exact equation | Status | Source (cards / docs / registry) | Backbone Support | AI Slop Risk | Transfer Depth | Application Breadth | Failure condition | Foundation role | Guide location | Gap |',
         '|' + '---|' * 18]
for o in O:
    src = '; '.join(filter(None, [', '.join(o['cards']), ', '.join(o['docs']), ', '.join(o['registry'])]))
    lines.append(f"| {o['id']} | {cell(o['name'])} | {o['layer']} | {cell(', '.join(o['stages']))} | {cell(', '.join(o['dependsOn']))} | {cell(', '.join(o['supports']))} | {cell(', '.join(o['bearsOn']))} | {cell(o['equation'])} | {o['status']} | {cell(src)} | {pct(o['backboneSupport'])} | {pct(o['slopRisk'])} | {o['transferDepth']} | {cell(o['applicationBreadth'])} | {cell(o['failureCondition'])} | {cell(o['foundationRole'])} | {cell(o['guideLocation'])} | {cell(o['gap'])} |")
(ROOT / 'research/foundation_dependencies.md').write_text('\n'.join(lines) + '\n')

bl = ['# Foundation bridges', '', 'Each row is a mathematical bridge: an exact connector between two objects, not a topic. Generated from `research/tools/foundation_source.py`. "Project-specific" bridges were constructed in this project; "established" bridges are textbook.', '',
      '| ID | Left object | Right object | Exact mathematical connector | Status | Established or project-specific | Cards | What it does NOT prove | Foundation objects |', '|' + '---|' * 9]
for b in B:
    bl.append(f"| {b['id']} | {cell(b['left'])} | {cell(b['right'])} | {cell(b['connector'])} | {b['status']} | {b['scope']} | {cell(', '.join(b['cards']))} | {cell(b['doesNotProve'])} | {cell(', '.join(b['objects']))} |")
(ROOT / 'research/foundation_bridges.md').write_text('\n'.join(bl) + '\n')

ul = ['# Original user theories (Foundation Part X, detail)', '', 'Every user-origin record in `research/theories.json`, with its original wording, normalized reading and status kept separate. Generated; do not edit by hand.', '',
      '| Registry ID | Original wording | Normalized interpretation | Kind | Status | Foundation objects |', '|---|---|---|---|---|---|']
where = {}
for o in O:
    for r in o['registry']: where.setdefault(r, []).append(o['id'])
for r in reg.values():
    if r['origin'] != 'user': continue
    ul.append(f"| {r['id']} | {cell(r['words'])} | {cell(r['normalizedStatement'])} | {r['kind']} | {r['status']} | {cell(', '.join(where.get(r['id'], [])))} |")
(ROOT / 'research/foundation_user_theories.md').write_text('\n'.join(ul) + '\n')
est = [o for o in O if o['status'] in ('ESTABLISHED', 'DERIVED')]
carded = [o for o in est if o['cards']]
print(len(O), 'objects;', len(B), 'bridges; established/derived carded', len(carded), '/', len(est))
