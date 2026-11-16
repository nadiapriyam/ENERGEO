"""Act VIII first construction pass (2026-11-16): finite/infinite representation → H3 → c-indexed structures → relativistic/Galilean limit.
Writes research/act8.json and renders research/constructions/act8_finite_infinite_h3_c.md.
Decisions: docs/restructure_decisions.md, "Act VIII first construction pass". Cards: verify/verify_A8.py (41 cards).
H3 and ★ are investigated separately; their hierarchy is not decided. t (the action parameter) and c (the family parameter) are kept apart.
Stop: no mass-wave/conjugacy, no dispersion, no quantum work, no Energeo, no final Foundation freeze.
Run: python3 research/tools/act8_source.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]

STATUSES = ['PROVED', 'ESTABLISHED INSTANCE', 'RESTRICTED', 'PROJECT SYNTHESIS', 'FAIL', 'OPEN']
OUTCOMES = ['same mathematical construction', 'structural analogy', 'superficial analogy', 'no transfer']
CARDS = (['A8Ca', 'A8Cb', 'A8Cc', 'A8Cd', 'A8Ce', 'A8Cf', 'A8Ta', 'A8Tb', 'A8Tc', 'A8Te', 'A8Ua', 'A8X1', 'A8X2', 'A8X3', 'A8X4', 'A8X5', 'A8X6', 'A8Yb',
          'A8Pa', 'A8Pb', 'A8Pc', 'A8Pd', 'A8Pe', 'A8Pg', 'A8Da', 'A8Db', 'A8Ma', 'A8Mb', 'A8Mc', 'A8Md', 'A8Me', 'A8La', 'A8Lb', 'A8Lc', 'A8Sa', 'A8Sb',
          'A8Ra', 'A8Rb', 'A8Rc', 'A8Rd', 'A8Za'])
reg = {r['id']: r for r in json.loads((ROOT / 'research/theories.json').read_text())['theories']}

# ── A. Historical wording (kept verbatim; nothing rewritten) ─────────────────────────────────────
ORIGINALS = [
 dict(id='H3-original', record='T-H3', words=reg['T-H3']['words'], source='docs/claude_code_prompt.md', note='Nadia\'s words, kept as the record H3-original; Gate 3 split it into H3-1 (the two roles of c, T-C-ROLES) and H3-2 (the common object, T-SCHEMA)'),
 dict(id='STAR-original', record='T-STAR', words=reg['T-STAR']['words'], source='docs/restructure_decisions.md', note='kept as the record STAR-original; research question T-GEOM-RULES: "' + reg['T-GEOM-RULES']['words'] + '"'),
 dict(id='old infinity wording', record='T-TIME-CIRCLE-0', words=reg['T-TIME-CIRCLE-0']['words'], source='docs/Interactive_Master_Map.extracted.md', note='historical conjecture (Master Map #18); FAIL in this pass (A8Cc)'),
 dict(id='Gate 2 wording', record='T-TIME-CIRCLE', words=reg['T-TIME-CIRCLE']['words'], source='docs/gate2_answers.md', note='the corrected circle statement already on record'),
 dict(id='corrected intuition', record='T-UNBOUNDED-EVOLUTION', words='An unbounded parameter can generate indefinitely continuing evolution in a bounded geometry.', source='docs/restructure_decisions.md', note='preserved; not elevated to H3'),
 dict(id='finite / infinite backbone', record='B-FINITE-INFINITE', words=reg['B-FINITE-INFINITE']['words'], source='docs/restructure_decisions.md', note='the 2026-11-11 backbone statement; unchanged'),
 dict(id='H3-2 common object', record='T-SCHEMA', words=reg['T-SCHEMA']['words'], source='docs/gate3_decisions.md', note='wrapping, quasi-periodic winding and boundary approach not assumed the same (Gate 3)'),
 dict(id='H3-1 two roles of c', record='T-C-ROLES', words=reg['T-C-ROLES']['words'], source='docs/gate3_decisions.md', note='three roles of c kept apart (2026-11-15)'),
]
for o in ORIGINALS:
    if o['record'] in reg: o['source'] = reg[o['record']]['sourceDocs'][0]
MISSING = [
 'the "Acts I–IX restructuring report" (revision 3): no copy is in the repository; its Act VIII content is known only through registry records that cite it (audit fields "quoted only in the report")',
 'AMB-1: no record anywhere in the repository (searched docs/, research/, src/, test/)',
 'AMB-7: known only through T-STAR\'s boundary ("bound by rules", "periodic", "can be": a–c)',
 'AMB-15: known only through T-TIME-CIRCLE-0\'s audit field ("quoted only in the report (AMB-15)")',
]
READ = ['H3 (research/hypotheses/H3.md)', '★ (T-STAR, T-GEOM-RULES, T-CIRCLE-NOT-THESIS)', 'C8, C9, C3 (supporting only), C5', 'cards S4a–d, S5a–d, S10, S12, B5c, B7a, G1c, C8a–d, C9a–d',
        'spec Blocks 9, 10, 14', 'Master Map #18, #19', 'the c records (T-C-ROLES, T-C9, T-RULES-GEOMETRY, T-MANIFOLDS) and the model-manifold three-role verdict (research/model_manifold_story.md, MMPm, MMIi)']

# ── B. Finite / infinite taxonomy ────────────────────────────────────────────────────────────────
PROPS = [
 ('unbounded parameter domain', 't ranges over ℝ (or [0, ∞))', 'a property of the acting group, not of the geometry; true in every example below'),
 ('compact orbit closure', 'the closure of {Φ_t(x)} in the state space X is compact', 'compact image: S¹ ⊂ ℂ (A8Cd)'),
 ('unbounded lift', 'the orbit lifted to the universal cover of X is unbounded', 'θ(t) = ωt on the cover ℝ → S¹ (A8Cf); trivial on simply connected X (ℝ², intervals)'),
 ('bounded observable', 'a stated observable (here the ambient Euclidean coordinates) stays bounded for all t', 'cos ωt, sin ωt ∈ [−1, 1] (A8Ca); metric-dependent (A8Pg)'),
 ('infinitely many cycles', 'the full state completes infinitely many periods: non-constant periodic orbit, N(t) = ⌊t/T⌋ → ∞', 'circle (A8Cd); a fixed point completes no cycle'),
 ('convergence', 'lim_(t→+∞) Φ_t(x) exists in the ambient space', 'fails for e^(iωt), ω ≠ 0 (A8Cc)'),
 ('recurrence', 'Φ_(t_n)(x) → x for some t_n → ∞', 'exact return or near return (A8Tc)'),
 ('periodicity', 'Φ_T(x) = x for some T > 0 (Stab(x) ≠ {0}; fixed points included)', 'Stab = Tℤ or ℝ (A8Pa)'),
 ('dense orbit', 'the orbit closure is all of X', 'irrational torus (Kronecker, A8Tb); also the logistic orbit (0, 1) in [0, 1]'),
 ('noncompact drift', 'the forward orbit leaves every compact subset of X', 'cylinder (A8X2); boundary approach in (−1, 1) (A8Pg)'),
]
TABLE_ROWS = [
 ('circle ω≠0 on S¹', (1, 1, 1, 1, 1, 0, 1, 1, 1, 0)), ('circle ω=0 (fixed point)', (1, 1, 0, 1, 0, 1, 1, 1, 0, 0)),
 ('torus (1, 3/2)', (1, 1, 1, 1, 1, 0, 1, 1, 0, 0)), ('torus (1, √2)', (1, 1, 1, 1, 0, 0, 1, 0, 1, 0)),
 ('cylinder (ω, v≠0)', (1, 0, 1, 0, 0, 0, 0, 0, 0, 1)), ('logistic on [0, 1]', (1, 1, 0, 1, 0, 1, 0, 0, 1, 0)),
 ('velocity flow on (−1, 1)', (1, 0, 0, 1, 0, 1, 0, 0, 1, 1)), ('rotation of ℝ²', (1, 1, 0, 1, 1, 0, 1, 1, 0, 0)),
 ('translation on ℝ', (1, 0, 1, 0, 0, 0, 0, 0, 1, 1)), ('contraction ẋ = −x on ℝ', (1, 0, 1, 0, 0, 1, 0, 0, 0, 0)),
]
TAXONOMY = dict(properties=[dict(name=a, definition=b, example=c) for a, b, c in PROPS], rows=[dict(system=s, values=list(v)) for s, v in TABLE_ROWS], cards=['A8Da', 'A8Db'],
  implications=['periodic ⇒ recurrent', 'infinitely many cycles ⇒ periodic (by definition)', 'periodic ⇒ compact orbit closure', 'compact orbit closure ⇒ bounded (any continuous observable)', 'recurrent ⇒ no drift', 'compact orbit closure ⇒ no drift'],
  nonImplications=['compact ⇏ periodic', 'bounded ⇏ convergent', 'unbounded parameter ⇏ unbounded observable', 'recurrent ⇏ periodic', 'dense ⇏ recurrent', 'convergent ⇏ bounded', 'periodic ⇏ unbounded lift'],
  note='"Infinite" is no longer used without naming the object: the parameter domain, the lift, the cycle count and the orbit length can be unbounded while the image is compact. "Bounded" depends on the chosen observable and metric: the velocity orbit is bounded in v and unbounded in the rapidity artanh v, which is a topological conjugacy (A8Pg); compactness of the orbit closure does not depend on that choice.')

# ── C–E. Circle, torus, cylinder ─────────────────────────────────────────────────────────────────
CIRCLE = [
 dict(statement='Φ_t(z) = e^(iωt)z is a one-parameter group action of (ℝ, +) on S¹: Φ_0 = id, Φ_t∘Φ_s = Φ_(t+s); |γ_ω(t)| = 1 for every real t', cards=['A8Ca'], status='PROVED'),
 dict(statement='for ω ≠ 0 the minimal positive period is T = 2π/|ω|', cards=['A8Cb'], status='PROVED'),
 dict(statement='for ω ≠ 0, lim_(t→∞) cos ωt and sin ωt do not exist; both stay in [−1, 1]: the old wording "sines and cosines converge to infinity" is FALSE', cards=['A8Cc'], status='PROVED'),
 dict(statement='t, the phase lift θ = ωt and the cycle count N(t) are unbounded; the image is the compact S¹, reached in one period', cards=['A8Cd'], status='PROVED'),
 dict(statement='Stab(z) = Tℤ for every z (Stab = ℝ when ω = 0); the orbit map induces ℝ/Tℤ ≅ S¹, and with p(σ) = e^(2πiσ), γ_ω(t) = p(ωt/2π): ℝ/Tℤ ≅ ℝ/ℤ ≅ S¹ by t ↦ ωt/2π (T ↦ ±1)', cards=['A8Ce'], status='PROVED'),
 dict(statement='p: ℝ → S¹ is a covering map (fibres σ + ℤ, deck translations, local diffeomorphism); the lift of γ_ω is σ(t) = ωt/2π. The unbounded object is the covering coordinate; S¹ is compact and is not called infinite', cards=['A8Cf'], status='PROVED'),
]
CIRCLE_NOTE = 'The acting parameter is ℝ; the orbit/image geometry is S¹. The finite/infinite relation is exact: an unbounded covering parameter represents a compact periodic geometry because points separated by the period are identified (the quotient ℝ/Tℤ). Nothing about the circle converges.'
TORUS = [
 dict(statement='(e^(iω_1t), …, e^(iω_nt)) is periodic ⟺ ∃T > 0 with Tω_j ∈ 2πℤ for all j ⟺ (for ω ≠ 0) all ratios ω_j/ω_k are rational (commensurable); minimal period T/2π = lcm(b_j)/gcd(a_j) for ω_j = a_j/b_j > 0', cards=['A8Ta'], status='PROVED'),
 dict(statement='(1, √2): Stab = {0} at every point (the orbit map ℝ → T² is injective); the orbit is dense in T² (Kronecker; checked: 400 section returns come within 0.016 of every grid point)', cards=['A8Tb'], status='PROVED (stabilizer); density: known theorem, source-locked, numerical instance carded'),
 dict(statement='near-recurrence is not periodicity: distances 2|sin(π√2q)| at continued-fraction denominators decrease below 0.01 and are never 0', cards=['A8Tc'], status='PROVED'),
 dict(statement='rationally dependent but not commensurable, (1, √2, 1 + √2): relation lattice ℤ(1, 1, −1), the orbit lies in the 2-dimensional subtorus z₃ = z₁z₂ (dense there by Kronecker), not periodic', cards=['A8Te'], status='PROVED (confinement); density on the subtorus: source-locked'),
 dict(statement='compact/constrained image ⇏ exact periodic orbit: on T² the (1, √2) flow preserves |z₁| = |z₂| = 1, has no fixed point and NO periodic orbit at all', cards=['A8X1'], status='PROVED'),
 dict(statement='the orbit-closure dimension is n − rank(integer relation lattice of ω): the frequency vector\'s arithmetic decides the behaviour; the torus and its invariants are identical in every case', cards=['A8Ua'], status='PROVED for the examples; the general statement is the Kronecker–Weyl theorem (source-locked)'),
]
CYLINDER = [
 dict(statement='Φ_t(z, x) = (e^(iωt)z, x + vt) on S¹ × ℝ, v ≠ 0: the angular projection is periodic (period 2π/|ω|); the full state has Stab = {0}; x(t) is unbounded; the orbit leaves every compact set (not recurrent)', cards=['A8X2'], status='PROVED'),
 dict(statement='a periodic state makes every observable periodic; a periodic observable (Re z) does not make the state periodic (x(t + T) − x(t) = 2πv/ω ≠ 0)', cards=['A8Yb'], status='PROVED'),
]
CYLINDER_NOTE = 'One unbounded parameter drives a bounded periodic projection and an unbounded coordinate at the same time. Periodicity of a representation/projection is a different property from periodicity of the full state.'

# ── F. Action / stabilizer framework ─────────────────────────────────────────────────────────────
FRAMEWORK = dict(
 definitions=['one-parameter action: a continuous map Φ: ℝ × X → X on a Hausdorff (here metric) space X with Φ_0 = id and Φ_t∘Φ_s = Φ_(t+s)',
              'orbit: O(x) = {Φ_t(x) : t ∈ ℝ}; forward orbit: t ≥ 0',
              'stabilizer: Stab(x) = {t ∈ ℝ : Φ_t(x) = x}, a subgroup of ℝ; it is closed because it is the preimage of the point x under the continuous map t ↦ Φ_t(x) into a Hausdorff space'],
 theorem='Stab(x) ∈ {ℝ, Tℤ (T > 0), {0}}. Proof: a closed subgroup H ≠ {0} has τ = inf(H ∩ (0, ∞)); if τ = 0, H contains arbitrarily small positive elements, so it is dense and, being closed, H = ℝ; if τ > 0, τ ∈ H (closed) and every h ∈ H lies in τℤ (division with remainder). The dense subgroup ℤ + √2ℤ is not closed and is never a stabilizer (A8Pa).',
 classes=[
  dict(name='fixed', condition='Stab(x) = ℝ', example='ω = 0 circle', cards=['A8Pa']),
  dict(name='periodic', condition='Stab(x) = Tℤ; T is the minimal period and the orbit is homeomorphic to ℝ/Tℤ ≅ S¹ (continuous bijection from a compact space onto a Hausdorff space)', example='circle, rational torus, rotation of ℝ²', cards=['A8Ce', 'A8Ta', 'A8X4']),
  dict(name='free, compact orbit closure, recurrent ("aperiodic recurrent"; quasi-periodic is the torus-linear-flow example of it)', condition='Stab(x) = {0}; forward orbit closure compact; Φ_(t_n)(x) → x for some t_n → ∞', example='(1, √2) torus', cards=['A8Tb', 'A8Tc']),
  dict(name='free, compact orbit closure, not recurrent', condition='Stab(x) = {0}; closure compact; no return near x', example='logistic orbit converging to fixed points; θ̇ = 1 − cos θ on S¹', cards=['A8X3', 'A8Pd']),
  dict(name='free, drift', condition='Stab(x) = {0}; the forward orbit leaves every compact subset of X', example='cylinder, translation on ℝ, the velocity flow on (−1, 1) (boundary approach)', cards=['A8X2', 'A8Pg']),
  dict(name='free, noncompact closure, not escaping', condition='Stab(x) = {0}; closure noncompact but the orbit returns to some compact set for arbitrarily large t', example='none carded in this pass; kept as a class', cards=[]),
 ],
 exhaustive='The stabilizer trichotomy is logically exhaustive (theorem above). The sub-classes of free orbits come from two dichotomies (orbit closure compact or not; recurrent or not, resp. escaping or not), so the six classes are exhaustive as a decision tree; the named examples are known examples, not an exhaustive classification for this project.',
 terminology=['"periodic" only for Stab = Tℤ (or fixed points when stated); an irrational torus flow is never called periodic',
              '"quasi-periodic" only for linear flows on tori with rationally independent frequencies (or functions of such flows), not for every bounded non-periodic orbit',
              '"recurrent" = positively recurrent (x lies in its own ω-limit set); near return ≠ exact return',
              '"drift" = escapes every compact set; "boundary approach" is drift in an open state space that converges in an ambient space (A8Pg)',
              'Poincaré recurrence is a measure statement: invariant measure, finite total measure, almost every point (A8Pd); it is not implied by compactness alone'],
 explains='It explains which behaviour occurs from objects the system supplies: the stabilizer (from the action), the orbit closure and recurrence (from the action and the topology of X). Unboundedness of the parameter is common to every row of the distinction table and decides nothing (A8Da).')

# ── G. ★ verdicts ──────────────────────────────────────────────────────────────────────────────
STAR = [
 dict(id='STAR-A', name='forced periodicity', words='A constrained geometry forces every admissible evolution to be periodic.', status='FAIL',
      verdict='FAIL. Compact T² with preserved invariants |z₁| = |z₂| = 1 and the (1, √2) flow has no periodic orbit at all (A8X1); compact [0, 1] with the logistic flow has no periodic non-fixed orbit (A8X3). Rejected: compact geometry ⇒ periodicity (A8Ra).', cards=['A8X1', 'A8X3', 'A8Ra']),
 dict(id='STAR-B', name='existence', words='A constrained geometry admits at least one periodic evolution.', status='RESTRICTED',
      verdict='RESTRICTED. If fixed points count as periodic, the claim is vacuous: every space carries Φ_t = id (A8Pe). For a non-constant periodic orbit the answer depends on the class: flows on ℝ or an interval have none (orbits are monotone; a continuous injection ℝ/Tℤ → ℝ is impossible), the circle has them, and every smooth manifold of dimension ≥ 2 admits one (a rotation field in a coordinate disk multiplied by a bump function; the local model is A8X4; this general construction is a project argument, not carded). "Bound by rules" does not decide it; the topology of the space and the admissible class of dynamics do.', cards=['A8Pe', 'A8X4']),
 dict(id='STAR-C', name='recurrence', words='Compact/constrained geometry tends to produce recurrence or near return.', status='RESTRICTED',
      verdict='RESTRICTED to the Poincaré recurrence theorem (known; PROVED under its hypotheses): an invariant measure, finite total measure, conclusion for almost every point. Each hypothesis is needed (A8Pd): infinite measure (cylinder) — no point recurs; Lebesgue not invariant (logistic) — no interior point recurs; on compact S¹ with θ̇ = 1 − cos θ the only invariant probability is δ₀ and every other orbit is non-recurrent. Topological recurrence (some recurrent point exists on a compact metric space — a minimal set, Birkhoff) is a separate, weaker statement, source-only here.', cards=['A8Pd', 'A8Tc']),
]
STAR_NOTE = '★ (STAR-original, T-STAR) keeps its wording and stays OPEN; the three readings are separate records (T-STAR-A/B/C) with independent statuses. ★ is not rewritten into the surviving reading, and the H3/★ hierarchy is not decided.'

# ── H. H3 candidate formalizations ──────────────────────────────────────────────────────────────
H3_CANDIDATES = [
 dict(id='H3-action', record='T-H3-ACTION', words='H3-CANDIDATE: An unbounded parameter acting on a constrained state space can produce bounded, periodic, quasi-periodic, or recurrent observable structure; which behavior occurs is controlled not by unboundedness itself but by the action, its stabilizer, orbit closure, and invariants.',
      status='PROJECT SYNTHESIS', classification='project synthesis of definitions and known theorems; one clause corrected',
      clauses=[('"can produce bounded, periodic, quasi-periodic, or recurrent observable structure"', 'ESTABLISHED INSTANCES (circle, torus, A8Ca, A8Tb, A8Tc)'),
               ('"controlled not by unboundedness itself"', 'PROVED: the parameter domain is ℝ in every row of the distinction table while every behaviour varies (A8Da)'),
               ('"by the action, its stabilizer, orbit closure"', 'DEFINITION + THEOREM: periodicity is Stab ≠ {0}; the stabilizer trichotomy is a theorem; orbit closure and recurrence are definitions (A8Pa, A8Pb)'),
               ('"and invariants"', 'CORRECTED: preserved invariants confine the orbit to a level set but do not decide the class; the same invariants |z_j| = 1 hold for periodic and dense torus flows, and the integer relations of the generator decide (A8Ua)')],
      scope='It covers parameters that act (group actions); a parameter that indexes a family without acting on the state space (c on spacetime, the truncation index N) is outside it (A8Sa, A8X6).'),
 dict(id='H3-quotient', record='T-H3-QUOTIENT', words='The distinction between an unbounded parameter and a bounded representation is naturally encoded by a quotient, covering map, orbit, or compact orbit closure.',
      status='RESTRICTED', classification='too broad as worded (with "orbit"); RESTRICTED without it',
      clauses=[('"orbit"', 'TOO BROAD: every representation of an action is an orbit image, so this alternative makes the statement true of everything'),
               ('"quotient, covering map"', 'PROVED for the periodic class: Stab = Tℤ gives the orbit ≅ ℝ/Tℤ and the covering ℝ → S¹ (A8Ce, A8Cf); also for a periodic projection (cylinder)'),
               ('"compact orbit closure"', 'PROVED for the free recurrent class: the (1, √2) orbit is injective (no quotient) and its bounded representation is its compact closure T² (A8Tb)'),
               ('boundary approach / drift', 'NOT ENCODED by any of the three: the velocity orbit is all of (−1, 1), injective, with noncompact closure; its boundedness is an artifact of the coordinate, removed by the conjugacy artanh (A8Pg)')],
      scope='Holds for the periodic and compact-recurrent classes; fails for boundary approach, which needs a compactification (added limit points) — a different object.'),
]
H3_ORIGINAL = dict(status='OPEN', components=[
 ('"a common structure where infinite things are combined my a finite thing to produce a representation"', 'too weak as stated ("parameters can be infinite while outputs are finite" is too weak, decision item 20); the exact candidates are H3-action (PROJECT SYNTHESIS) and H3-quotient (RESTRICTED)'),
 ('"like time and a finite circle geometry producing an infinite sine and cosine with bounds"', 'ESTABLISHED INSTANCE in the corrected reading: unbounded t, unbounded continuation and cycle count, bounded values (A8Ca, A8Cd); "converge to infinity" FAIL (A8Cc)'),
 ('"that invarient variable like the speed of light which also converges to infinity"', 'c does not converge inside a theory; it is fixed. Only the family index tends to infinity (Role 3); in the circle the corresponding role is played by the form constant r, not by t (A8Sb)'),
 ('"is an invarient variable that acts as a rule in the manifold"', 'ESTABLISHED (Role 2): c fixes the preserved form M_c, the null cone x = ±ct and the boost group (A8La); restricted common object with the circle: a one-parameter subgroup preserving a quadratic form (A8Sb)')],
 note='H3-original is not replaced by either candidate; neither candidate is called H3. Its strongest surviving exact content is H3-action (PROJECT SYNTHESIS) and the restricted t/c correspondence (H3-c).')
COMPARISON = 'Neither candidate reproduces H3-original: H3-original names a common structure linking the time–circle example with c; H3-action does not reach c (c is not an action on spacetime) and H3-quotient fails for the boundary-approach behaviour that c-bounded velocities show. The comparison is complete; neither candidate is renamed H3.'

# ── Rules (item 11) ─────────────────────────────────────────────────────────────────────────────
RULES = [
 dict(example='circle rotation', candidates='|z| = 1; the group action; the stabilizer Tℤ; rotation symmetry', decides='the action\'s generator iω, through the stabilizer Tℤ, decides periodicity and the period; the preserved form |z|² confines the orbit to the circle and fixes the observable bound; compactness of S¹ alone does not decide periodicity (torus)', cards=['A8Ce', 'A8Ca', 'A8X1']),
 dict(example='torus flow', candidates='the frequency vector; the translation action; the torus geometry; integer relations among frequencies', decides='the integer relation lattice of ω (orbit-closure dimension n − rank); torus geometry and invariants are identical across periodic, subtorus and dense cases', cards=['A8Ua', 'A8Ta', 'A8Te']),
 dict(example='cylinder', candidates='the product geometry; the periodic angular projection; the translational drift', decides='ω decides the projection\'s period; v ≠ 0 decides that the full state is free and drifts; the product geometry decides neither', cards=['A8X2', 'A8Yb']),
 dict(example='Lorentz boosts (fixed c)', candidates='the preserved form q_c; the boost group; the generator type', decides='q_c fixes the boost group, the hyperbolic level sets and the velocity bound c; the generator type (K̂² = I, hyperbolic) decides that orbits are noncompact', cards=['A8La', 'A8Sb']),
]
RULES_NOTE = '"Geometry" is not used where the dynamics/action is doing the work: in every example the behaviour is decided by the action (its generator and stabilizer); the preserved form confines and bounds.'

# ── I–J. c-indexed family and the c → ∞ limit ──────────────────────────────────────────────────
CFAMILY = [
 dict(statement='M_c = diag(1, −1/c²) = P_cᵀηP_c, P_c = diag(1, 1/c), η = diag(1, −1); q_c = t² − x²/c²; for finite c₁, c₂, SᵀM_(c₂)S = M_(c₁) with S = diag(1, c₂/c₁): finite-c congruence / representation normalization only', cards=['A8Ma'], status='PROVED'),
 dict(statement='finite c > 0: det = −1/c², rank 2, eigenvalues {1, −1/c²}, signature (1, 1), inverse diag(1, −c²)', cards=['A8Mb'], status='PROVED'),
 dict(statement='null cone x = ±ct; null directions (1, ±c)/√(1 + c²) → (0, ±1); in x̃ = x/c every finite-c cone is x̃ = ±t. Changing coordinates inside one finite-c theory moves the cone\'s slope; changing c across the family is a different operation, and only the family reaches the limit', cards=['A8Md'], status='PROVED'),
]
CFAMILY_NOTE = 'Not inferred: that physical c is meaningless. The congruence says only that, inside one theory, the value of c is fixed by the choice of spatial unit; the invariant content of the family is whether c is finite (A8Mc, A8Lc).'
CLIMIT = [
 dict(statement='M_c → M_∞ = diag(1, 0): a degenerate bilinear form (rank 1, det 0, eigenvalues {1, 0}, signature (+, 0)); no inverse; M_c⁻¹ diverges while c⁻²M_c⁻¹ → h = diag(0, −1); M_∞ = ττᵀ with τ = dt and hτ = 0. P_c → diag(1, 0) is singular and det(PᵀηP) = −det(P)² ≠ 0 for invertible P: no change of coordinates reaches M_∞. M_∞ is not called "the Newtonian metric": it is one degenerate form; Galilean / Newton–Cartan-type structure also needs the cometric h (Malament 2012, source-locked) and more', cards=['A8Mc'], status='PROVED'),
 dict(statement='the null set of M_∞ is the single line t = 0 (a double root)', cards=['A8Md'], status='PROVED'),
 dict(statement='preservation group of M_∞: A = [[±1, 0], [k, d]], d ≠ 0 — a 2-parameter identity component including spatial dilations; it is NOT automatically the Galilean group; also preserving h forces d = ±1', cards=['A8Me'], status='PROVED'),
 dict(statement='Lorentz boost t′ = γ_c(t − vx/c²), x′ = γ_c(x − vt): ΛᵀM_cΛ = M_c, det 1, rapidity group law, relativistic velocity addition', cards=['A8La'], status='PROVED'),
 dict(statement='fixed finite v: γ_c → 1, t′ → t, x′ → x − vt, v₁ ⊕ v₂ → v₁ + v₂ (the Galilean boost limit); the Galilean boost preserves M_∞ and h', cards=['A8Lb'], status='PROVED'),
 dict(statement='group contraction (İnönü–Wigner): [K_c, H] = −P, [K_c, P] = −H/c², [H, P] = 0; derived algebra dimension 2 for every finite c and 1 at c = ∞, so Poincaré(1+1) ≇ Galilei(1+1), while all finite c are isomorphic (K′ = cK, P′ = cP)', cards=['A8Lc'], status='PROVED (known; İnönü–Wigner 1953 source-locked)'),
 dict(statement='form degeneration (M_c → M_∞) and group contraction (Lorentz → Galilean boosts) are related but not identical: the limit form\'s preservation group (2 parameters) is larger than the contracted boost group (1 parameter); the contraction is a statement about generators and structure constants', cards=['A8Lc', 'A8Me'], status='PROVED'),
 dict(statement='c → ∞ with β = v/c fixed (and x̃ = x/c): no limit in (t, x), nothing changes in (t, x̃): no contraction and no rank loss. "c → ∞" has content only once what is held fixed is stated', cards=['A8X5'], status='PROVED'),
]

# ── K. t versus c ──────────────────────────────────────────────────────────────────────────────
TC_TABLE = [
 ('parameter object', 't ∈ ℝ: the parameter of the one-parameter group Φ_t = e^(iωt)', 'c ∈ (0, ∞): the constant of the form M_c; σ = log c parametrizes the congruence action D_σ = diag(1, e^(−σ)) on forms (A8Sa)'),
 ('what stays fixed', 'the system: generator iω, state space S¹, invariant |z|', 'inside one theory: c itself (the rapidity s varies along a boost orbit)'),
 ('what varies', 'the state along one orbit', 'the theory: form, boost group, cone slope in fixed units'),
 ('state space', 'S¹ ⊂ ℂ', 'spacetime ℝ² for each c; the family lives in the space of symmetric forms Sym(2)'),
 ('geometry', 'a compact periodic orbit', 'the Lorentzian plane (ℝ², q_c); in Sym(2), a free orbit drifting to a degenerate boundary point'),
 ('invariant', '|z|² (Euclidean form)', 'q_c (Lorentzian form); c is part of it'),
 ('limit', 't → ∞: none (periodic; A8Cc)', 'c → ∞ (v, x fixed): M_c → diag(1, 0), boosts → Galilean, algebra contracts; with β fixed: nothing (A8X5)'),
 ('quotient', 'ℝ/Tℤ ≅ S¹ (A8Ce)', 'none: the boost group ≅ ℝ acts freely; Stab(η) = {0} for the dilation action'),
 ('internal or external', 'internal: acts on the state of one system', 'external: indexes systems; acts only on the space of forms'),
 ('flow / action', 'yes: Φ: ℝ × S¹ → S¹', 'not an action on spacetime (B_1(1)B_2(1) preserves no M_(c₃)); yes on Sym(2) through σ = log c'),
 ('changes the theory', 'no', 'yes (in fixed units); c = ∞ is the only non-isomorphic member (A8Lc)'),
 ('role under the shared exact object (one-parameter subgroup preserving a quadratic form)', 't ↔ the rapidity s (group parameter); the circle radius r ↔ c', 'generator type: elliptic (ωJ)² = −ω²I for the circle; hyperbolic K̂² = I for boosts, parabolic K_∞² = 0 at c = ∞; no member of the c-family is elliptic (A8Sb)'),
]
TC_VERDICT = dict(outcome='structural analogy',
  sameConstruction='NO: t is an internal action parameter on a fixed state space; c is an external family index (A8Sa)',
  analogy='STRUCTURAL ANALOGY through one exact object shared by both examples: a one-parameter subgroup of the preservation group of a nondegenerate quadratic form on ℝ², with orbits in level sets (the known CF1/S4 trichotomy). Under it t corresponds to the rapidity s and c corresponds to the circle\'s radius r (the form constant that sets the observable bound); the bound r is attained, the bound c is not (A8Sb)',
  superficial='SUPERFICIAL as H3-original states it ("c also converges to infinity" like t): t ranges over ℝ inside one system; c is fixed inside each system and only the family index tends to infinity',
  noTransfer='the periodic (wrapping) mechanism does not transfer to c: no member or limit of the c-family has an elliptic generator, and the c-family itself drifts to a degenerate boundary point (never periodic, never recurrent)')
SIX = [
 ('Does finite c function as an invariant rule inside Lorentzian geometry?', 'YES (A8La): c fixes the preserved form M_c, the null cone x = ±ct and the boost group; known mathematics and physics'),
 ('Does varying c give a meaningful family of geometries/forms?', 'YES in fixed units (t, x) (A8Ma, A8Md), but every finite member is congruent to η: inside one theory the value of c is a unit choice; the family\'s invariant content is finiteness (A8Mc, A8Lc)'),
 ('Does c → ∞ produce a singular/degenerate limit?', 'YES with v and x fixed: the rank drops from 2 to 1, the limit lies outside every congruence class, and the algebra contracts (A8Mc, A8Lc); the drop need not occur under another scaling: NO with β = v/c fixed (A8X5)'),
 ('Is that structurally the same phenomenon as t ∈ ℝ ↦ e^(iωt) ∈ S¹?', 'NO (A8Sa, A8Sb): an external family parameter drifting to a degenerate boundary point, not an internal action wrapping onto a compact orbit'),
 ('If not the same, is there a narrower common categorical/geometric statement?', 'YES, restricted: both examples are one-parameter subgroups preserving a quadratic form, with t ↔ rapidity s and r ↔ c (A8Sb); and both c and the circle family are orbits of one-parameter groups (on different spaces: S¹ vs Sym(2)) with opposite behaviour classes'),
 ('If even that is too weak, record the negative result.', 'Recorded: the H3 wrapping mechanism does not transfer to c (FAIL as same construction); "c converges to infinity like t" is SUPERFICIAL. The surviving correspondence is the known CF1/S4 object, not a new H3 structure'),
]
ROLES_LINK = 'H3-1 (the two roles of c), restricted answer: Role 2 (c fixes the invariant form) and Role 3 (c → ∞) are roles of the same form constant. At finite c the value of c is not an isomorphism invariant (all finite-c forms are congruent and all finite-c algebras isomorphic); what is invariant is finiteness: M_c is nondegenerate and the algebra is Poincaré exactly when c < ∞ (A8Ma, A8Mc, A8Lc). This is known mathematics; it does not by itself make c an instance of the circle mechanism.'

# ── L. Counterexamples ──────────────────────────────────────────────────────────────────────────
COUNTER = [
 dict(id='H3-X1', card='A8X1', example='(1, √2) flow on T²', breaks='the implication "unbounded parameter + compact image ⇒ exact periodicity" (it fails); STAR-A'),
 dict(id='H3-X2', card='A8X2', example='(e^(iωt), vt) on S¹ × ℝ', breaks='the implication "periodic projection ⇒ periodic or bounded state" (it fails)'),
 dict(id='H3-X3', card='A8X3', example='logistic flow on [0, 1]; (1, √2) torus', breaks='the implications "compact geometry ⇒ periodicity" and "compact geometry ⇒ recurrence" (both fail)'),
 dict(id='H3-X4', card='A8X4', example='rotation of ℝ²', breaks='the claim "periodicity requires a compact state space" (it fails)'),
 dict(id='H3-X5', card='A8X5', example='c → ∞ with β = v/c fixed', breaks='the implication "parameter → ∞ ⇒ contraction / dimension loss" (it fails); "c → ∞" without a stated scaling'),
 dict(id='H3-X6', card='A8X6', example='Fourier truncation index N vs flow time t on one coefficient space', breaks='"an unbounded parameter" as a shared structure: an idempotent semigroup of projections (approximation) vs a group of invertible maps (no limit); no group law, orbit or limit type in common'),
]
REJECTED = [
 dict(claim='compact geometry ⇒ periodicity', card='A8Ra', status='FAIL'),
 dict(claim='bounded observable ⇒ convergence', card='A8Rb', status='FAIL'),
 dict(claim='unbounded parameter ⇒ unbounded observable', card='A8Rc', status='FAIL'),
 dict(claim='parameter → ∞ ⇒ dimension loss', card='A8Rd', status='FAIL (a rank drop depends on what the limit holds fixed)'),
]
REAL_RESULT = dict(required='an exact object shared by more than one example: quotient by a stabilizer; covering; orbit closure; one-parameter subgroup; preserved quadratic form; singular limit of a family of forms; group contraction',
  found=[('quotient by a stabilizer / covering', 'circle, rational torus, cylinder projection, rotation of ℝ² (the periodic class)', 'shared exactly; known'),
         ('compact orbit closure', 'irrational and subtorus flows, logistic orbit', 'shared; recurrence must be stated separately'),
         ('one-parameter subgroup preserving a quadratic form', 'circle rotation and Lorentz boosts (and Galilean shears at c = ∞)', 'shared exactly (CF1/S4); t ↔ s, r ↔ c'),
         ('singular limit of a family of forms + group contraction', 'the c-family only in this pass', 'not shared with the time–circle example: the circle family has no contraction (its algebra is ℝ for every ω)')],
  verdict='Structural-transfer credit is given only to the preserved-form / one-parameter-subgroup object (already Foundation CF1) and to the stabilizer/quotient object within the action examples. No new object shared by the time–circle example and the c-family was found.')

# ── M. Status table ─────────────────────────────────────────────────────────────────────────────
STATUS_TABLE = [
 dict(id='H3-original', record='T-H3', status='OPEN', basis='not proved and not failed; components: circle instance ESTABLISHED, "converge to infinity" FAIL, c-as-rule ESTABLISHED, the common structure only restricted (H3-c)', cards=['A8Ca', 'A8Cc', 'A8La', 'A8Sb']),
 dict(id='H3-action', record='T-H3-ACTION', status='PROJECT SYNTHESIS', basis='definitions + known theorems (stabilizer trichotomy, Kronecker, Poincaré); the "invariants" clause corrected', cards=['A8Pa', 'A8Pb', 'A8Da', 'A8Ua']),
 dict(id='H3-quotient', record='T-H3-QUOTIENT', status='RESTRICTED', basis='periodic and compact-recurrent classes only; too broad with "orbit"; fails for boundary approach', cards=['A8Ce', 'A8Cf', 'A8Tb', 'A8Pg']),
 dict(id='H3-c', record='T-H3-C', status='RESTRICTED', basis='same construction FAIL; superficial as worded; restricted structural analogy through the preserved-form subgroup (t ↔ s, r ↔ c)', cards=['A8Sa', 'A8Sb', 'A8Mc', 'A8Lc']),
 dict(id='STAR-A', record='T-STAR-A', status='FAIL', basis='irrational torus; logistic interval', cards=['A8X1', 'A8X3']),
 dict(id='STAR-B', record='T-STAR-B', status='RESTRICTED', basis='vacuous with fixed points; class-dependent for non-constant periodic orbits', cards=['A8Pe']),
 dict(id='STAR-C', record='T-STAR-C', status='RESTRICTED', basis='= Poincaré recurrence under its hypotheses (PROVED, known); fails without them', cards=['A8Pd']),
 dict(id='old infinity wording', record='T-TIME-CIRCLE-0', status='FAIL', basis='sin, cos bounded with no limit', cards=['A8Cc']),
 dict(id='corrected intuition', record='T-UNBOUNDED-EVOLUTION', status='ESTABLISHED INSTANCE', basis='circle; not elevated to H3', cards=['A8Ca', 'A8Cd']),
 dict(id='STAR-original', record='T-STAR', status='OPEN', basis='kept; readings decided separately', cards=['A8X1', 'A8Pe', 'A8Pd']),
]
DERIVED_STATUSES_CARD = 'A8Za'

# ── N. Ratings ──────────────────────────────────────────────────────────────────────────────────
RATINGS = [
 dict(item='circle finite/infinite relation', bs=35, slop=5, td='TRIVIAL CONSEQUENCE', breadth=1, status='ESTABLISHED INSTANCE (old wording FAIL)', why='exact (ℝ/Tℤ ≅ S¹, covering ℝ → S¹); known mathematics; immediate from the definitions'),
 dict(item='torus extension', bs=30, slop=8, td='STRUCTURAL TRANSFER', breadth=2, status='PROVED (criterion); Kronecker source-locked', why='the action/stabilizer framework applies unchanged from circle to torus and changes the verdict: the arithmetic of ω decides; a counterexample to compact ⇒ periodic'),
 dict(item='H3-action', bs=30, slop=15, td='STRUCTURAL TRANSFER', breadth=2, status='PROJECT SYNTHESIS', why='applies unchanged to every action example (circle, tori, cylinder, interval, plane, velocity flow); content is definitions plus known theorems; risk: close to a restatement of dynamical-systems vocabulary'),
 dict(item='H3-quotient', bs=20, slop=15, td='STRUCTURAL TRANSFER', breadth=1, status='RESTRICTED', why='exact for the periodic class and (as compact closure) the recurrent class; vacuous with "orbit"; fails for boundary approach'),
 dict(item='H3-c', bs=10, slop=25, td='FAIL', breadth=1, status='RESTRICTED', why='the H3 wrapping mechanism does not transfer to c (transfer depth FAIL); what survives is the known CF1/S4 correspondence t ↔ s, r ↔ c, and finiteness of c as the invariant content'),
 dict(item='★', bs=15, slop=20, td='NOT YET FORMALIZED', breadth=2, status='STAR-original OPEN; STAR-A FAIL; STAR-B RESTRICTED; STAR-C RESTRICTED', why='the forced reading fails on compact spaces; the existence reading is vacuous or class-dependent; the recurrence reading is Poincaré\'s theorem with its hypotheses'),
 dict(item='Act VIII overall', bs=25, slop=15, td='STRUCTURAL TRANSFER', breadth=2, status='mixed (see the status table; no umbrella verdict)', why='the action/stabilizer framework is exact and applies unchanged across the examples; c relates only through the known preserved-form object; every surviving statement is known mathematics'),
]
RATING_CHANGES = [
 dict(object='I2 (★)', fromBs=20, toBs=15, reason='STAR-A fails on compact spaces (A8X1, A8X3); STAR-B is vacuous with fixed points; STAR-C is Poincaré with its hypotheses'),
 dict(object='L4 (two roles of c)', fromBs=25, toBs=30, reason='restricted exact answer: both roles belong to the same form constant, and the invariant content is finiteness (A8Mc, A8Lc); known mathematics, no transfer to the circle mechanism'),
]

NEXT = ['One adversarial lock pass for Act VIII, then close it: re-derive the STAR-B dimension ≥ 2 statement (carded only through its local model A8X4), the free-orbit decision tree and its "noncompact, not escaping" class (no carded example), the boundary-approach ≅ drift classification against C8 and S5b, and the finiteness-invariant answer to H3-1; check that no record calls an irrational flow periodic or M_∞ "the Newtonian metric".',
        'A narrower second construction is not recommended: the open item (H3-original) has no candidate object beyond the known ones found here.',
        'Not begun (stop list): mass-wave/conjugacy, dispersion, quantum work, Energeo, the final Foundation freeze.']
SOURCES = ['SRC-HATCHER-2002', 'SRC-KATOK-HASSELBLATT-1995', 'SRC-HARDY-WRIGHT-2008', 'SRC-WEYL-1916', 'SRC-WALTERS-1982', 'SRC-POINCARE-1890', 'SRC-MALAMENT-2012', 'SRC-INONU-WIGNER-1953', 'SRC-LEVY-LEBLOND-1965', 'SRC-STEIN-SHAKARCHI-2003']

data = dict(about='Act VIII first construction pass (2026-11-16). Generated by research/tools/act8_source.py.', statuses=STATUSES, outcomes=OUTCOMES, cards=CARDS,
            originals=ORIGINALS, missing=MISSING, read=READ, taxonomy=TAXONOMY, circle=CIRCLE, circleNote=CIRCLE_NOTE, torus=TORUS, cylinder=CYLINDER, cylinderNote=CYLINDER_NOTE,
            framework=FRAMEWORK, star=STAR, starNote=STAR_NOTE, h3Candidates=[dict(c, clauses=[dict(clause=a, verdict=b) for a, b in c['clauses']]) for c in H3_CANDIDATES],
            h3Original=dict(H3_ORIGINAL, components=[dict(phrase=a, verdict=b) for a, b in H3_ORIGINAL['components']]), comparison=COMPARISON,
            rules=RULES, rulesNote=RULES_NOTE, cFamily=CFAMILY, cFamilyNote=CFAMILY_NOTE, cLimit=CLIMIT,
            tVsC=[dict(aspect=a, t=b, c=c) for a, b, c in TC_TABLE], tVsCVerdict=TC_VERDICT, sixQuestions=[dict(question=a, answer=b) for a, b in SIX], rolesLink=ROLES_LINK,
            counterexamples=COUNTER, rejected=REJECTED, realResult=dict(REAL_RESULT, found=[dict(object=a, examples=b, verdict=c) for a, b, c in REAL_RESULT['found']]),
            statusTable=STATUS_TABLE, statusCard=DERIVED_STATUSES_CARD, ratings=RATINGS, ratingChanges=RATING_CHANGES, next=NEXT, sources=SOURCES)
(ROOT / 'research/act8.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')

cell = lambda x: '—' if x in (None, '', []) else str(x).replace('|', '\\|')
yn = lambda b: 'yes' if b else 'no'
L = ['# Act VIII: finite / infinite representation, H3, ★ and c (first construction pass)', '',
     'Generated from `research/tools/act8_source.py` (`research/act8.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Act VIII first construction pass". Cards: `verify/verify_A8.py` (' + ', '.join(CARDS) + ').', '',
     'H3 and ★ are investigated separately and their hierarchy is not decided. The time parameter t and the theory parameter c are kept apart. Statuses: ' + '; '.join(STATUSES) + '.', '',
     '## A. Historical wording', '', '| Name | Record | Wording (verbatim) | Source | Note |', '|---|---|---|---|---|']
L += [f'| {o["id"]} | {o["record"]} | {cell(o["words"])} | `{o["source"]}` | {cell(o["note"])} |' for o in ORIGINALS]
L += ['', 'Read for this pass: ' + '; '.join(READ) + '.', '', 'Not in the repository:'] + [f'- {m}' for m in MISSING]
L += ['', '## B. Finite / infinite taxonomy', '', '| Property | Definition | Example |', '|---|---|---|'] + [f'| {p["name"]} | {cell(p["definition"])} | {cell(p["example"])} |' for p in TAXONOMY['properties']]
L += ['', '| System | ' + ' | '.join(p[0] for p in PROPS) + ' |', '|---|' + '---|' * len(PROPS)] + [f'| {s} | ' + ' | '.join(yn(x) for x in v) + ' |' for s, v in TABLE_ROWS]
L += ['', 'Implications that hold: ' + '; '.join(TAXONOMY['implications']) + '.', '', 'Non-implications, each witnessed by a row: ' + '; '.join(TAXONOMY['nonImplications']) + ' (A8Da, A8Db).', '', TAXONOMY['note']]
sec = lambda title, rows, note=None: ['', title, '', '| Statement | Status | Cards |', '|---|---|---|'] + [f'| {cell(r["statement"])} | {r["status"]} | {", ".join(r["cards"])} |' for r in rows] + (['', note] if note else [])
L += sec('## C. Circle result', CIRCLE, CIRCLE_NOTE) + sec('## D. Torus result', TORUS) + sec('## E. Cylinder result', CYLINDER, CYLINDER_NOTE)
L += ['', '## F. Action / stabilizer framework', ''] + [f'- {d}' for d in FRAMEWORK['definitions']] + ['', f'**Theorem.** {FRAMEWORK["theorem"]}', '', '| Class | Condition | Example | Cards |', '|---|---|---|---|']
L += [f'| {c["name"]} | {cell(c["condition"])} | {cell(c["example"])} | {cell(", ".join(c["cards"]))} |' for c in FRAMEWORK['classes']]
L += ['', FRAMEWORK['exhaustive'], '', 'Terminology:'] + [f'- {t}' for t in FRAMEWORK['terminology']] + ['', FRAMEWORK['explains']]
L += ['', '### The "rule" in each example', '', '| Example | Candidate structures | What decides the behaviour | Cards |', '|---|---|---|---|'] + [f'| {r["example"]} | {cell(r["candidates"])} | {cell(r["decides"])} | {", ".join(r["cards"])} |' for r in RULES] + ['', RULES_NOTE]
L += ['', '## G. ★ verdict', '', STAR_NOTE, '', '| Reading | Wording (verbatim) | Status | Verdict | Cards |', '|---|---|---|---|---|'] + [f'| {s["id"]} ({s["name"]}) | {cell(s["words"])} | {s["status"]} | {cell(s["verdict"])} | {", ".join(s["cards"])} |' for s in STAR]
L += ['', '## H. H3 candidate formalizations', '']
for c in H3_CANDIDATES:
    L += [f'### {c["id"]} ({c["record"]}): {c["status"]}', '', f'> {c["words"]}', '', f'Classification: {c["classification"]}.', '', '| Clause | Verdict |', '|---|---|'] + [f'| {cell(a)} | {cell(b)} |' for a, b in c['clauses']] + ['', f'Scope: {c["scope"]}', '']
L += [f'### H3-original (T-H3): {H3_ORIGINAL["status"]}', '', '| Phrase | Verdict |', '|---|---|'] + [f'| {cell(a)} | {cell(b)} |' for a, b in H3_ORIGINAL['components']] + ['', H3_ORIGINAL['note'], '', COMPARISON]
L += sec('## I. c-indexed family', CFAMILY, CFAMILY_NOTE) + sec('## J. c → ∞: form degeneration and the Lorentz / Galilean limit', CLIMIT)
L += ['', '## K. t versus c', '', '| Aspect | t (circle) | c (Lorentz family) |', '|---|---|---|'] + [f'| {a} | {cell(b)} | {cell(c)} |' for a, b, c in TC_TABLE]
L += ['', f'**Outcome: {TC_VERDICT["outcome"].upper()}** (from: {", ".join(OUTCOMES)}).', '', f'- Same construction: {TC_VERDICT["sameConstruction"]}.', f'- Structural analogy: {TC_VERDICT["analogy"]}.', f'- Superficial: {TC_VERDICT["superficial"]}.', f'- No transfer: {TC_VERDICT["noTransfer"]}.']
L += ['', '### Does c support H3?', '', '| Question | Answer |', '|---|---|'] + [f'| {cell(q)} | {cell(a)} |' for q, a in SIX] + ['', ROLES_LINK]
L += ['', '## L. Counterexamples (all kept)', '', '| ID | Card | Example | Breaks |', '|---|---|---|---|'] + [f'| {c["id"]} | {c["card"]} | {cell(c["example"])} | {cell(c["breaks"])} |' for c in COUNTER]
L += ['', 'Rejected implications:', '', '| Claim | Status | Card |', '|---|---|---|'] + [f'| {r["claim"]} | {r["status"]} | {r["card"]} |' for r in REJECTED]
L += ['', '### What would count as a real H3 result', '', f'Required: {REAL_RESULT["required"]}.', '', '| Object | Examples sharing it | Verdict |', '|---|---|---|'] + [f'| {a} | {cell(b)} | {cell(c)} |' for a, b, c in REAL_RESULT['found']] + ['', REAL_RESULT['verdict']]
L += ['', '## M. H3 status table', '', f'Separate statuses; no umbrella verdict. Derived by fixed rules from the card verdicts in {DERIVED_STATUSES_CARD}.', '', '| Item | Record | Status | Basis | Cards |', '|---|---|---|---|---|']
L += [f'| {s["id"]} | {s["record"]} | {s["status"]} | {cell(s["basis"])} | {", ".join(s["cards"])} |' for s in STATUS_TABLE]
L += ['', '## N. Backbone assessment and ratings (separate; no overall score)', '', '| Item | Backbone Support | AI Slop Risk | Transfer Depth | Breadth | Status | Why |', '|---|---|---|---|---|---|---|']
L += [f'| {r["item"]} | {r["bs"]}% | {r["slop"]}% | {r["td"]} | {r["breadth"]} | {cell(r["status"])} | {cell(r["why"])} |' for r in RATINGS]
L += ['', 'Foundation rating changes:'] + [f'- {c["object"]}: Backbone Support {c["fromBs"]}% → {c["toBs"]}% ({c["reason"]}).' for c in RATING_CHANGES]
L += ['', 'Low Backbone Support is not a reason to discard a branch: every weak and negative connection above is kept.', '',
      '## O. Files', '', '- `verify/verify_A8.py` (41 cards, one ledger run); `research/tools/act8_source.py` → `research/act8.json`, this record; registry records T-ACT8-GOV, T-UNBOUNDED-EVOLUTION, T-COMPACT-NOT-PERIODIC, T-H3-ACTION, T-H3-QUOTIENT, T-H3-C, T-STAR-A, T-STAR-B, T-STAR-C; Foundation objects A8A, A8C, A8T, A8D, A8S, A8H, A8M, A8L, A8K, A8X, bridges BR75–BR80, domains D37–D39; sources ' + ', '.join(SOURCES[:7]) + '; `test/act8.test.js`.',
      '', '## P. Recommendation for the next pass', ''] + [f'- {n}' for n in NEXT]
(ROOT / 'research/constructions/act8_finite_infinite_h3_c.md').write_text('\n'.join(L) + '\n')
print(f'{len(CARDS)} cards; {len(STATUS_TABLE)} status rows; t vs c: {TC_VERDICT["outcome"]}')
