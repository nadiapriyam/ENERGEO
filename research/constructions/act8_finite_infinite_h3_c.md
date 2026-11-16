# Act VIII: finite / infinite representation, H3, ★ and c (first construction pass)

Generated from `research/tools/act8_source.py` (`research/act8.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Act VIII first construction pass". Cards: `verify/verify_A8.py` (A8Ca, A8Cb, A8Cc, A8Cd, A8Ce, A8Cf, A8Ta, A8Tb, A8Tc, A8Te, A8Ua, A8X1, A8X2, A8X3, A8X4, A8X5, A8X6, A8Yb, A8Pa, A8Pb, A8Pc, A8Pd, A8Pe, A8Pg, A8Da, A8Db, A8Ma, A8Mb, A8Mc, A8Md, A8Me, A8La, A8Lb, A8Lc, A8Sa, A8Sb, A8Ra, A8Rb, A8Rc, A8Rd, A8Za).

H3 and ★ are investigated separately and their hierarchy is not decided. The time parameter t and the theory parameter c are kept apart. Statuses: PROVED; ESTABLISHED INSTANCE; RESTRICTED; PROJECT SYNTHESIS; FAIL; OPEN.

## A. Historical wording

| Name | Record | Wording (verbatim) | Source | Note |
|---|---|---|---|---|
| H3-original | T-H3 | leading to my theory of the relationship ridden equation- rather geometry that says that there is a common structure where infinite things are combined my a finite thing to produce a representation. like time and a finite circle geometry producing an infinite sine and cosine with bounds. and that invarient variable like the speed of light which also converges to infinity is an invarient variable that acts as a rule in the manifold (https://pmc.ncbi.nlm.nih.gov/articles/PMC10018491/) | `docs/claude_code_prompt.md` | Nadia's words, kept as the record H3-original; Gate 3 split it into H3-1 (the two roles of c, T-C-ROLES) and H3-2 (the common object, T-SCHEMA) |
| STAR-original | T-STAR | ★ Any geometrical object that is bound by rules can be periodic. | `docs/restructure_decisions.md` | kept as the record STAR-original; research question T-GEOM-RULES: "What observable rules arise because an object is constrained by a particular geometry?" |
| old infinity wording | T-TIME-CIRCLE-0 | Adding an infinite object like time to a finite circle geometry makes sines and cosines converge to infinity. | `docs/Interactive_Master_Map.extracted.md` | historical conjecture (Master Map #18); FAIL in this pass (A8Cc) |
| Gate 2 wording | T-TIME-CIRCLE | an unbounded time parameter combined with a finite circular geometry generates an indefinitely continuing sine/cosine evolution whose values remain bounded | `docs/gate2_answers.md` | the corrected circle statement already on record |
| corrected intuition | T-UNBOUNDED-EVOLUTION | An unbounded parameter can generate indefinitely continuing evolution in a bounded geometry. | `docs/restructure_decisions.md` | preserved; not elevated to H3 |
| finite / infinite backbone | B-FINITE-INFINITE | An indefinitely continuing/infinite structure may be governed by rules manifested through a finite geometry. | `docs/restructure_decisions.md` | the 2026-11-11 backbone statement; unchanged |
| H3-2 common object | T-SCHEMA | an unbounded parameter interacting with or being represented through a constrained geometry | `docs/gate3_decisions.md` | wrapping, quasi-periodic winding and boundary approach not assumed the same (Gate 3) |
| H3-1 two roles of c | T-C-ROLES | That transition between the two roles is what interests me. | `docs/gate3_decisions.md` | three roles of c kept apart (2026-11-15) |

Read for this pass: H3 (research/hypotheses/H3.md); ★ (T-STAR, T-GEOM-RULES, T-CIRCLE-NOT-THESIS); C8, C9, C3 (supporting only), C5; cards S4a–d, S5a–d, S10, S12, B5c, B7a, G1c, C8a–d, C9a–d; spec Blocks 9, 10, 14; Master Map #18, #19; the c records (T-C-ROLES, T-C9, T-RULES-GEOMETRY, T-MANIFOLDS) and the model-manifold three-role verdict (research/model_manifold_story.md, MMPm, MMIi).

Not in the repository:
- the "Acts I–IX restructuring report" (revision 3): no copy is in the repository; its Act VIII content is known only through registry records that cite it (audit fields "quoted only in the report")
- AMB-1: no record anywhere in the repository (searched docs/, research/, src/, test/)
- AMB-7: known only through T-STAR's boundary ("bound by rules", "periodic", "can be": a–c)
- AMB-15: known only through T-TIME-CIRCLE-0's audit field ("quoted only in the report (AMB-15)")

## B. Finite / infinite taxonomy

| Property | Definition | Example |
|---|---|---|
| unbounded parameter domain | t ranges over ℝ (or [0, ∞)) | a property of the acting group, not of the geometry; true in every example below |
| compact orbit closure | the closure of {Φ_t(x)} in the state space X is compact | compact image: S¹ ⊂ ℂ (A8Cd) |
| unbounded lift | the orbit lifted to the universal cover of X is unbounded | θ(t) = ωt on the cover ℝ → S¹ (A8Cf); trivial on simply connected X (ℝ², intervals) |
| bounded observable | a stated observable (here the ambient Euclidean coordinates) stays bounded for all t | cos ωt, sin ωt ∈ [−1, 1] (A8Ca); metric-dependent (A8Pg) |
| infinitely many cycles | the full state completes infinitely many periods: non-constant periodic orbit, N(t) = ⌊t/T⌋ → ∞ | circle (A8Cd); a fixed point completes no cycle |
| convergence | lim_(t→+∞) Φ_t(x) exists in the ambient space | fails for e^(iωt), ω ≠ 0 (A8Cc) |
| recurrence | Φ_(t_n)(x) → x for some t_n → ∞ | exact return or near return (A8Tc) |
| periodicity | Φ_T(x) = x for some T > 0 (Stab(x) ≠ {0}; fixed points included) | Stab = Tℤ or ℝ (A8Pa) |
| dense orbit | the orbit closure is all of X | irrational torus (Kronecker, A8Tb); also the logistic orbit (0, 1) in [0, 1] |
| noncompact drift | the forward orbit leaves every compact subset of X | cylinder (A8X2); boundary approach in (−1, 1) (A8Pg) |

| System | unbounded parameter domain | compact orbit closure | unbounded lift | bounded observable | infinitely many cycles | convergence | recurrence | periodicity | dense orbit | noncompact drift |
|---|---|---|---|---|---|---|---|---|---|---|
| circle ω≠0 on S¹ | yes | yes | yes | yes | yes | no | yes | yes | yes | no |
| circle ω=0 (fixed point) | yes | yes | no | yes | no | yes | yes | yes | no | no |
| torus (1, 3/2) | yes | yes | yes | yes | yes | no | yes | yes | no | no |
| torus (1, √2) | yes | yes | yes | yes | no | no | yes | no | yes | no |
| cylinder (ω, v≠0) | yes | no | yes | no | no | no | no | no | no | yes |
| logistic on [0, 1] | yes | yes | no | yes | no | yes | no | no | yes | no |
| velocity flow on (−1, 1) | yes | no | no | yes | no | yes | no | no | yes | yes |
| rotation of ℝ² | yes | yes | no | yes | yes | no | yes | yes | no | no |
| translation on ℝ | yes | no | yes | no | no | no | no | no | yes | yes |
| contraction ẋ = −x on ℝ | yes | no | yes | no | no | yes | no | no | no | no |

Implications that hold: periodic ⇒ recurrent; infinitely many cycles ⇒ periodic (by definition); periodic ⇒ compact orbit closure; compact orbit closure ⇒ bounded (any continuous observable); recurrent ⇒ no drift; compact orbit closure ⇒ no drift.

Non-implications, each witnessed by a row: compact ⇏ periodic; bounded ⇏ convergent; unbounded parameter ⇏ unbounded observable; recurrent ⇏ periodic; dense ⇏ recurrent; convergent ⇏ bounded; periodic ⇏ unbounded lift (A8Da, A8Db).

"Infinite" is no longer used without naming the object: the parameter domain, the lift, the cycle count and the orbit length can be unbounded while the image is compact. "Bounded" depends on the chosen observable and metric: the velocity orbit is bounded in v and unbounded in the rapidity artanh v, which is a topological conjugacy (A8Pg); compactness of the orbit closure does not depend on that choice.

## C. Circle result

| Statement | Status | Cards |
|---|---|---|
| Φ_t(z) = e^(iωt)z is a one-parameter group action of (ℝ, +) on S¹: Φ_0 = id, Φ_t∘Φ_s = Φ_(t+s); \|γ_ω(t)\| = 1 for every real t | PROVED | A8Ca |
| for ω ≠ 0 the minimal positive period is T = 2π/\|ω\| | PROVED | A8Cb |
| for ω ≠ 0, lim_(t→∞) cos ωt and sin ωt do not exist; both stay in [−1, 1]: the old wording "sines and cosines converge to infinity" is FALSE | PROVED | A8Cc |
| t, the phase lift θ = ωt and the cycle count N(t) are unbounded; the image is the compact S¹, reached in one period | PROVED | A8Cd |
| Stab(z) = Tℤ for every z (Stab = ℝ when ω = 0); the orbit map induces ℝ/Tℤ ≅ S¹, and with p(σ) = e^(2πiσ), γ_ω(t) = p(ωt/2π): ℝ/Tℤ ≅ ℝ/ℤ ≅ S¹ by t ↦ ωt/2π (T ↦ ±1) | PROVED | A8Ce |
| p: ℝ → S¹ is a covering map (fibres σ + ℤ, deck translations, local diffeomorphism); the lift of γ_ω is σ(t) = ωt/2π. The unbounded object is the covering coordinate; S¹ is compact and is not called infinite | PROVED | A8Cf |

The acting parameter is ℝ; the orbit/image geometry is S¹. The finite/infinite relation is exact: an unbounded covering parameter represents a compact periodic geometry because points separated by the period are identified (the quotient ℝ/Tℤ). Nothing about the circle converges.

## D. Torus result

| Statement | Status | Cards |
|---|---|---|
| (e^(iω_1t), …, e^(iω_nt)) is periodic ⟺ ∃T > 0 with Tω_j ∈ 2πℤ for all j ⟺ (for ω ≠ 0) all ratios ω_j/ω_k are rational (commensurable); minimal period T/2π = lcm(b_j)/gcd(a_j) for ω_j = a_j/b_j > 0 | PROVED | A8Ta |
| (1, √2): Stab = {0} at every point (the orbit map ℝ → T² is injective); the orbit is dense in T² (Kronecker; checked: 400 section returns come within 0.016 of every grid point) | PROVED (stabilizer); density: known theorem, source-locked, numerical instance carded | A8Tb |
| near-recurrence is not periodicity: distances 2\|sin(π√2q)\| at continued-fraction denominators decrease below 0.01 and are never 0 | PROVED | A8Tc |
| rationally dependent but not commensurable, (1, √2, 1 + √2): relation lattice ℤ(1, 1, −1), the orbit lies in the 2-dimensional subtorus z₃ = z₁z₂ (dense there by Kronecker), not periodic | PROVED (confinement); density on the subtorus: source-locked | A8Te |
| compact/constrained image ⇏ exact periodic orbit: on T² the (1, √2) flow preserves \|z₁\| = \|z₂\| = 1, has no fixed point and NO periodic orbit at all | PROVED | A8X1 |
| the orbit-closure dimension is n − rank(integer relation lattice of ω): the frequency vector's arithmetic decides the behaviour; the torus and its invariants are identical in every case | PROVED for the examples; the general statement is the Kronecker–Weyl theorem (source-locked) | A8Ua |

## E. Cylinder result

| Statement | Status | Cards |
|---|---|---|
| Φ_t(z, x) = (e^(iωt)z, x + vt) on S¹ × ℝ, v ≠ 0: the angular projection is periodic (period 2π/\|ω\|); the full state has Stab = {0}; x(t) is unbounded; the orbit leaves every compact set (not recurrent) | PROVED | A8X2 |
| a periodic state makes every observable periodic; a periodic observable (Re z) does not make the state periodic (x(t + T) − x(t) = 2πv/ω ≠ 0) | PROVED | A8Yb |

One unbounded parameter drives a bounded periodic projection and an unbounded coordinate at the same time. Periodicity of a representation/projection is a different property from periodicity of the full state.

## F. Action / stabilizer framework

- one-parameter action: a continuous map Φ: ℝ × X → X on a Hausdorff (here metric) space X with Φ_0 = id and Φ_t∘Φ_s = Φ_(t+s)
- orbit: O(x) = {Φ_t(x) : t ∈ ℝ}; forward orbit: t ≥ 0
- stabilizer: Stab(x) = {t ∈ ℝ : Φ_t(x) = x}, a subgroup of ℝ; it is closed because it is the preimage of the point x under the continuous map t ↦ Φ_t(x) into a Hausdorff space

**Theorem.** Stab(x) ∈ {ℝ, Tℤ (T > 0), {0}}. Proof: a closed subgroup H ≠ {0} has τ = inf(H ∩ (0, ∞)); if τ = 0, H contains arbitrarily small positive elements, so it is dense and, being closed, H = ℝ; if τ > 0, τ ∈ H (closed) and every h ∈ H lies in τℤ (division with remainder). The dense subgroup ℤ + √2ℤ is not closed and is never a stabilizer (A8Pa).

| Class | Condition | Example | Cards |
|---|---|---|---|
| fixed | Stab(x) = ℝ | ω = 0 circle | A8Pa |
| periodic | Stab(x) = Tℤ; T is the minimal period and the orbit is homeomorphic to ℝ/Tℤ ≅ S¹ (continuous bijection from a compact space onto a Hausdorff space) | circle, rational torus, rotation of ℝ² | A8Ce, A8Ta, A8X4 |
| free, compact orbit closure, recurrent ("aperiodic recurrent"; quasi-periodic is the torus-linear-flow example of it) | Stab(x) = {0}; forward orbit closure compact; Φ_(t_n)(x) → x for some t_n → ∞ | (1, √2) torus | A8Tb, A8Tc |
| free, compact orbit closure, not recurrent | Stab(x) = {0}; closure compact; no return near x | logistic orbit converging to fixed points; θ̇ = 1 − cos θ on S¹ | A8X3, A8Pd |
| free, drift | Stab(x) = {0}; the forward orbit leaves every compact subset of X | cylinder, translation on ℝ, the velocity flow on (−1, 1) (boundary approach) | A8X2, A8Pg |
| free, noncompact closure, not escaping | Stab(x) = {0}; closure noncompact but the orbit returns to some compact set for arbitrarily large t | none carded in this pass; kept as a class | — |

The stabilizer trichotomy is logically exhaustive (theorem above). The sub-classes of free orbits come from two dichotomies (orbit closure compact or not; recurrent or not, resp. escaping or not), so the six classes are exhaustive as a decision tree; the named examples are known examples, not an exhaustive classification for this project.

Terminology:
- "periodic" only for Stab = Tℤ (or fixed points when stated); an irrational torus flow is never called periodic
- "quasi-periodic" only for linear flows on tori with rationally independent frequencies (or functions of such flows), not for every bounded non-periodic orbit
- "recurrent" = positively recurrent (x lies in its own ω-limit set); near return ≠ exact return
- "drift" = escapes every compact set; "boundary approach" is drift in an open state space that converges in an ambient space (A8Pg)
- Poincaré recurrence is a measure statement: invariant measure, finite total measure, almost every point (A8Pd); it is not implied by compactness alone

It explains which behaviour occurs from objects the system supplies: the stabilizer (from the action), the orbit closure and recurrence (from the action and the topology of X). Unboundedness of the parameter is common to every row of the distinction table and decides nothing (A8Da).

### The "rule" in each example

| Example | Candidate structures | What decides the behaviour | Cards |
|---|---|---|---|
| circle rotation | \|z\| = 1; the group action; the stabilizer Tℤ; rotation symmetry | the action's generator iω, through the stabilizer Tℤ, decides periodicity and the period; the preserved form \|z\|² confines the orbit to the circle and fixes the observable bound; compactness of S¹ alone does not decide periodicity (torus) | A8Ce, A8Ca, A8X1 |
| torus flow | the frequency vector; the translation action; the torus geometry; integer relations among frequencies | the integer relation lattice of ω (orbit-closure dimension n − rank); torus geometry and invariants are identical across periodic, subtorus and dense cases | A8Ua, A8Ta, A8Te |
| cylinder | the product geometry; the periodic angular projection; the translational drift | ω decides the projection's period; v ≠ 0 decides that the full state is free and drifts; the product geometry decides neither | A8X2, A8Yb |
| Lorentz boosts (fixed c) | the preserved form q_c; the boost group; the generator type | q_c fixes the boost group, the hyperbolic level sets and the velocity bound c; the generator type (K̂² = I, hyperbolic) decides that orbits are noncompact | A8La, A8Sb |

"Geometry" is not used where the dynamics/action is doing the work: in every example the behaviour is decided by the action (its generator and stabilizer); the preserved form confines and bounds.

## G. ★ verdict

★ (STAR-original, T-STAR) keeps its wording and stays OPEN; the three readings are separate records (T-STAR-A/B/C) with independent statuses. ★ is not rewritten into the surviving reading, and the H3/★ hierarchy is not decided.

| Reading | Wording (verbatim) | Status | Verdict | Cards |
|---|---|---|---|---|
| STAR-A (forced periodicity) | A constrained geometry forces every admissible evolution to be periodic. | FAIL | FAIL. Compact T² with preserved invariants \|z₁\| = \|z₂\| = 1 and the (1, √2) flow has no periodic orbit at all (A8X1); compact [0, 1] with the logistic flow has no periodic non-fixed orbit (A8X3). Rejected: compact geometry ⇒ periodicity (A8Ra). | A8X1, A8X3, A8Ra |
| STAR-B (existence) | A constrained geometry admits at least one periodic evolution. | RESTRICTED | RESTRICTED. If fixed points count as periodic, the claim is vacuous: every space carries Φ_t = id (A8Pe). For a non-constant periodic orbit the answer depends on the class: flows on ℝ or an interval have none (orbits are monotone; a continuous injection ℝ/Tℤ → ℝ is impossible), the circle has them, and every smooth manifold of dimension ≥ 2 admits one (a rotation field in a coordinate disk multiplied by a bump function; the local model is A8X4; this general construction is a project argument, not carded). "Bound by rules" does not decide it; the topology of the space and the admissible class of dynamics do. | A8Pe, A8X4 |
| STAR-C (recurrence) | Compact/constrained geometry tends to produce recurrence or near return. | RESTRICTED | RESTRICTED to the Poincaré recurrence theorem (known; PROVED under its hypotheses): an invariant measure, finite total measure, conclusion for almost every point. Each hypothesis is needed (A8Pd): infinite measure (cylinder) — no point recurs; Lebesgue not invariant (logistic) — no interior point recurs; on compact S¹ with θ̇ = 1 − cos θ the only invariant probability is δ₀ and every other orbit is non-recurrent. Topological recurrence (some recurrent point exists on a compact metric space — a minimal set, Birkhoff) is a separate, weaker statement, source-only here. | A8Pd, A8Tc |

## H. H3 candidate formalizations

### H3-action (T-H3-ACTION): PROJECT SYNTHESIS

> H3-CANDIDATE: An unbounded parameter acting on a constrained state space can produce bounded, periodic, quasi-periodic, or recurrent observable structure; which behavior occurs is controlled not by unboundedness itself but by the action, its stabilizer, orbit closure, and invariants.

Classification: project synthesis of definitions and known theorems; one clause corrected.

| Clause | Verdict |
|---|---|
| "can produce bounded, periodic, quasi-periodic, or recurrent observable structure" | ESTABLISHED INSTANCES (circle, torus, A8Ca, A8Tb, A8Tc) |
| "controlled not by unboundedness itself" | PROVED: the parameter domain is ℝ in every row of the distinction table while every behaviour varies (A8Da) |
| "by the action, its stabilizer, orbit closure" | DEFINITION + THEOREM: periodicity is Stab ≠ {0}; the stabilizer trichotomy is a theorem; orbit closure and recurrence are definitions (A8Pa, A8Pb) |
| "and invariants" | CORRECTED: preserved invariants confine the orbit to a level set but do not decide the class; the same invariants \|z_j\| = 1 hold for periodic and dense torus flows, and the integer relations of the generator decide (A8Ua) |

Scope: It covers parameters that act (group actions); a parameter that indexes a family without acting on the state space (c on spacetime, the truncation index N) is outside it (A8Sa, A8X6).

### H3-quotient (T-H3-QUOTIENT): RESTRICTED

> The distinction between an unbounded parameter and a bounded representation is naturally encoded by a quotient, covering map, orbit, or compact orbit closure.

Classification: too broad as worded (with "orbit"); RESTRICTED without it.

| Clause | Verdict |
|---|---|
| "orbit" | TOO BROAD: every representation of an action is an orbit image, so this alternative makes the statement true of everything |
| "quotient, covering map" | PROVED for the periodic class: Stab = Tℤ gives the orbit ≅ ℝ/Tℤ and the covering ℝ → S¹ (A8Ce, A8Cf); also for a periodic projection (cylinder) |
| "compact orbit closure" | PROVED for the free recurrent class: the (1, √2) orbit is injective (no quotient) and its bounded representation is its compact closure T² (A8Tb) |
| boundary approach / drift | NOT ENCODED by any of the three: the velocity orbit is all of (−1, 1), injective, with noncompact closure; its boundedness is an artifact of the coordinate, removed by the conjugacy artanh (A8Pg) |

Scope: Holds for the periodic and compact-recurrent classes; fails for boundary approach, which needs a compactification (added limit points) — a different object.

### H3-original (T-H3): OPEN

| Phrase | Verdict |
|---|---|
| "a common structure where infinite things are combined my a finite thing to produce a representation" | too weak as stated ("parameters can be infinite while outputs are finite" is too weak, decision item 20); the exact candidates are H3-action (PROJECT SYNTHESIS) and H3-quotient (RESTRICTED) |
| "like time and a finite circle geometry producing an infinite sine and cosine with bounds" | ESTABLISHED INSTANCE in the corrected reading: unbounded t, unbounded continuation and cycle count, bounded values (A8Ca, A8Cd); "converge to infinity" FAIL (A8Cc) |
| "that invarient variable like the speed of light which also converges to infinity" | c does not converge inside a theory; it is fixed. Only the family index tends to infinity (Role 3); in the circle the corresponding role is played by the form constant r, not by t (A8Sb) |
| "is an invarient variable that acts as a rule in the manifold" | ESTABLISHED (Role 2): c fixes the preserved form M_c, the null cone x = ±ct and the boost group (A8La); restricted common object with the circle: a one-parameter subgroup preserving a quadratic form (A8Sb) |

H3-original is not replaced by either candidate; neither candidate is called H3. Its strongest surviving exact content is H3-action (PROJECT SYNTHESIS) and the restricted t/c correspondence (H3-c).

Neither candidate reproduces H3-original: H3-original names a common structure linking the time–circle example with c; H3-action does not reach c (c is not an action on spacetime) and H3-quotient fails for the boundary-approach behaviour that c-bounded velocities show. The comparison is complete; neither candidate is renamed H3.

## I. c-indexed family

| Statement | Status | Cards |
|---|---|---|
| M_c = diag(1, −1/c²) = P_cᵀηP_c, P_c = diag(1, 1/c), η = diag(1, −1); q_c = t² − x²/c²; for finite c₁, c₂, SᵀM_(c₂)S = M_(c₁) with S = diag(1, c₂/c₁): finite-c congruence / representation normalization only | PROVED | A8Ma |
| finite c > 0: det = −1/c², rank 2, eigenvalues {1, −1/c²}, signature (1, 1), inverse diag(1, −c²) | PROVED | A8Mb |
| null cone x = ±ct; null directions (1, ±c)/√(1 + c²) → (0, ±1); in x̃ = x/c every finite-c cone is x̃ = ±t. Changing coordinates inside one finite-c theory moves the cone's slope; changing c across the family is a different operation, and only the family reaches the limit | PROVED | A8Md |

Not inferred: that physical c is meaningless. The congruence says only that, inside one theory, the value of c is fixed by the choice of spatial unit; the invariant content of the family is whether c is finite (A8Mc, A8Lc).

## J. c → ∞: form degeneration and the Lorentz / Galilean limit

| Statement | Status | Cards |
|---|---|---|
| M_c → M_∞ = diag(1, 0): a degenerate bilinear form (rank 1, det 0, eigenvalues {1, 0}, signature (+, 0)); no inverse; M_c⁻¹ diverges while c⁻²M_c⁻¹ → h = diag(0, −1); M_∞ = ττᵀ with τ = dt and hτ = 0. P_c → diag(1, 0) is singular and det(PᵀηP) = −det(P)² ≠ 0 for invertible P: no change of coordinates reaches M_∞. M_∞ is not called "the Newtonian metric": it is one degenerate form; Galilean / Newton–Cartan-type structure also needs the cometric h (Malament 2012, source-locked) and more | PROVED | A8Mc |
| the null set of M_∞ is the single line t = 0 (a double root) | PROVED | A8Md |
| preservation group of M_∞: A = [[±1, 0], [k, d]], d ≠ 0 — a 2-parameter identity component including spatial dilations; it is NOT automatically the Galilean group; also preserving h forces d = ±1 | PROVED | A8Me |
| Lorentz boost t′ = γ_c(t − vx/c²), x′ = γ_c(x − vt): ΛᵀM_cΛ = M_c, det 1, rapidity group law, relativistic velocity addition | PROVED | A8La |
| fixed finite v: γ_c → 1, t′ → t, x′ → x − vt, v₁ ⊕ v₂ → v₁ + v₂ (the Galilean boost limit); the Galilean boost preserves M_∞ and h | PROVED | A8Lb |
| group contraction (İnönü–Wigner): [K_c, H] = −P, [K_c, P] = −H/c², [H, P] = 0; derived algebra dimension 2 for every finite c and 1 at c = ∞, so Poincaré(1+1) ≇ Galilei(1+1), while all finite c are isomorphic (K′ = cK, P′ = cP) | PROVED (known; İnönü–Wigner 1953 source-locked) | A8Lc |
| form degeneration (M_c → M_∞) and group contraction (Lorentz → Galilean boosts) are related but not identical: the limit form's preservation group (2 parameters) is larger than the contracted boost group (1 parameter); the contraction is a statement about generators and structure constants | PROVED | A8Lc, A8Me |
| c → ∞ with β = v/c fixed (and x̃ = x/c): no limit in (t, x), nothing changes in (t, x̃): no contraction and no rank loss. "c → ∞" has content only once what is held fixed is stated | PROVED | A8X5 |

## K. t versus c

| Aspect | t (circle) | c (Lorentz family) |
|---|---|---|
| parameter object | t ∈ ℝ: the parameter of the one-parameter group Φ_t = e^(iωt) | c ∈ (0, ∞): the constant of the form M_c; σ = log c parametrizes the congruence action D_σ = diag(1, e^(−σ)) on forms (A8Sa) |
| what stays fixed | the system: generator iω, state space S¹, invariant \|z\| | inside one theory: c itself (the rapidity s varies along a boost orbit) |
| what varies | the state along one orbit | the theory: form, boost group, cone slope in fixed units |
| state space | S¹ ⊂ ℂ | spacetime ℝ² for each c; the family lives in the space of symmetric forms Sym(2) |
| geometry | a compact periodic orbit | the Lorentzian plane (ℝ², q_c); in Sym(2), a free orbit drifting to a degenerate boundary point |
| invariant | \|z\|² (Euclidean form) | q_c (Lorentzian form); c is part of it |
| limit | t → ∞: none (periodic; A8Cc) | c → ∞ (v, x fixed): M_c → diag(1, 0), boosts → Galilean, algebra contracts; with β fixed: nothing (A8X5) |
| quotient | ℝ/Tℤ ≅ S¹ (A8Ce) | none: the boost group ≅ ℝ acts freely; Stab(η) = {0} for the dilation action |
| internal or external | internal: acts on the state of one system | external: indexes systems; acts only on the space of forms |
| flow / action | yes: Φ: ℝ × S¹ → S¹ | not an action on spacetime (B_1(1)B_2(1) preserves no M_(c₃)); yes on Sym(2) through σ = log c |
| changes the theory | no | yes (in fixed units); c = ∞ is the only non-isomorphic member (A8Lc) |
| role under the shared exact object (one-parameter subgroup preserving a quadratic form) | t ↔ the rapidity s (group parameter); the circle radius r ↔ c | generator type: elliptic (ωJ)² = −ω²I for the circle; hyperbolic K̂² = I for boosts, parabolic K_∞² = 0 at c = ∞; no member of the c-family is elliptic (A8Sb) |

**Outcome: STRUCTURAL ANALOGY** (from: same mathematical construction, structural analogy, superficial analogy, no transfer).

- Same construction: NO: t is an internal action parameter on a fixed state space; c is an external family index (A8Sa).
- Structural analogy: STRUCTURAL ANALOGY through one exact object shared by both examples: a one-parameter subgroup of the preservation group of a nondegenerate quadratic form on ℝ², with orbits in level sets (the known CF1/S4 trichotomy). Under it t corresponds to the rapidity s and c corresponds to the circle's radius r (the form constant that sets the observable bound); the bound r is attained, the bound c is not (A8Sb).
- Superficial: SUPERFICIAL as H3-original states it ("c also converges to infinity" like t): t ranges over ℝ inside one system; c is fixed inside each system and only the family index tends to infinity.
- No transfer: the periodic (wrapping) mechanism does not transfer to c: no member or limit of the c-family has an elliptic generator, and the c-family itself drifts to a degenerate boundary point (never periodic, never recurrent).

### Does c support H3?

| Question | Answer |
|---|---|
| Does finite c function as an invariant rule inside Lorentzian geometry? | YES (A8La): c fixes the preserved form M_c, the null cone x = ±ct and the boost group; known mathematics and physics |
| Does varying c give a meaningful family of geometries/forms? | YES in fixed units (t, x) (A8Ma, A8Md), but every finite member is congruent to η: inside one theory the value of c is a unit choice; the family's invariant content is finiteness (A8Mc, A8Lc) |
| Does c → ∞ produce a singular/degenerate limit? | YES with v and x fixed: the rank drops from 2 to 1, the limit lies outside every congruence class, and the algebra contracts (A8Mc, A8Lc); the drop need not occur under another scaling: NO with β = v/c fixed (A8X5) |
| Is that structurally the same phenomenon as t ∈ ℝ ↦ e^(iωt) ∈ S¹? | NO (A8Sa, A8Sb): an external family parameter drifting to a degenerate boundary point, not an internal action wrapping onto a compact orbit |
| If not the same, is there a narrower common categorical/geometric statement? | YES, restricted: both examples are one-parameter subgroups preserving a quadratic form, with t ↔ rapidity s and r ↔ c (A8Sb); and both c and the circle family are orbits of one-parameter groups (on different spaces: S¹ vs Sym(2)) with opposite behaviour classes |
| If even that is too weak, record the negative result. | Recorded: the H3 wrapping mechanism does not transfer to c (FAIL as same construction); "c converges to infinity like t" is SUPERFICIAL. The surviving correspondence is the known CF1/S4 object, not a new H3 structure |

H3-1 (the two roles of c), restricted answer: Role 2 (c fixes the invariant form) and Role 3 (c → ∞) are roles of the same form constant. At finite c the value of c is not an isomorphism invariant (all finite-c forms are congruent and all finite-c algebras isomorphic); what is invariant is finiteness: M_c is nondegenerate and the algebra is Poincaré exactly when c < ∞ (A8Ma, A8Mc, A8Lc). This is known mathematics; it does not by itself make c an instance of the circle mechanism.

## L. Counterexamples (all kept)

| ID | Card | Example | Breaks |
|---|---|---|---|
| H3-X1 | A8X1 | (1, √2) flow on T² | the implication "unbounded parameter + compact image ⇒ exact periodicity" (it fails); STAR-A |
| H3-X2 | A8X2 | (e^(iωt), vt) on S¹ × ℝ | the implication "periodic projection ⇒ periodic or bounded state" (it fails) |
| H3-X3 | A8X3 | logistic flow on [0, 1]; (1, √2) torus | the implications "compact geometry ⇒ periodicity" and "compact geometry ⇒ recurrence" (both fail) |
| H3-X4 | A8X4 | rotation of ℝ² | the claim "periodicity requires a compact state space" (it fails) |
| H3-X5 | A8X5 | c → ∞ with β = v/c fixed | the implication "parameter → ∞ ⇒ contraction / dimension loss" (it fails); "c → ∞" without a stated scaling |
| H3-X6 | A8X6 | Fourier truncation index N vs flow time t on one coefficient space | "an unbounded parameter" as a shared structure: an idempotent semigroup of projections (approximation) vs a group of invertible maps (no limit); no group law, orbit or limit type in common |

Rejected implications:

| Claim | Status | Card |
|---|---|---|
| compact geometry ⇒ periodicity | FAIL | A8Ra |
| bounded observable ⇒ convergence | FAIL | A8Rb |
| unbounded parameter ⇒ unbounded observable | FAIL | A8Rc |
| parameter → ∞ ⇒ dimension loss | FAIL (a rank drop depends on what the limit holds fixed) | A8Rd |

### What would count as a real H3 result

Required: an exact object shared by more than one example: quotient by a stabilizer; covering; orbit closure; one-parameter subgroup; preserved quadratic form; singular limit of a family of forms; group contraction.

| Object | Examples sharing it | Verdict |
|---|---|---|
| quotient by a stabilizer / covering | circle, rational torus, cylinder projection, rotation of ℝ² (the periodic class) | shared exactly; known |
| compact orbit closure | irrational and subtorus flows, logistic orbit | shared; recurrence must be stated separately |
| one-parameter subgroup preserving a quadratic form | circle rotation and Lorentz boosts (and Galilean shears at c = ∞) | shared exactly (CF1/S4); t ↔ s, r ↔ c |
| singular limit of a family of forms + group contraction | the c-family only in this pass | not shared with the time–circle example: the circle family has no contraction (its algebra is ℝ for every ω) |

Structural-transfer credit is given only to the preserved-form / one-parameter-subgroup object (already Foundation CF1) and to the stabilizer/quotient object within the action examples. No new object shared by the time–circle example and the c-family was found.

## M. H3 status table

Separate statuses; no umbrella verdict. Derived by fixed rules from the card verdicts in A8Za.

| Item | Record | Status | Basis | Cards |
|---|---|---|---|---|
| H3-original | T-H3 | OPEN | not proved and not failed; components: circle instance ESTABLISHED, "converge to infinity" FAIL, c-as-rule ESTABLISHED, the common structure only restricted (H3-c) | A8Ca, A8Cc, A8La, A8Sb |
| H3-action | T-H3-ACTION | PROJECT SYNTHESIS | definitions + known theorems (stabilizer trichotomy, Kronecker, Poincaré); the "invariants" clause corrected | A8Pa, A8Pb, A8Da, A8Ua |
| H3-quotient | T-H3-QUOTIENT | RESTRICTED | periodic and compact-recurrent classes only; too broad with "orbit"; fails for boundary approach | A8Ce, A8Cf, A8Tb, A8Pg |
| H3-c | T-H3-C | RESTRICTED | same construction FAIL; superficial as worded; restricted structural analogy through the preserved-form subgroup (t ↔ s, r ↔ c) | A8Sa, A8Sb, A8Mc, A8Lc |
| STAR-A | T-STAR-A | FAIL | irrational torus; logistic interval | A8X1, A8X3 |
| STAR-B | T-STAR-B | RESTRICTED | vacuous with fixed points; class-dependent for non-constant periodic orbits | A8Pe |
| STAR-C | T-STAR-C | RESTRICTED | = Poincaré recurrence under its hypotheses (PROVED, known); fails without them | A8Pd |
| old infinity wording | T-TIME-CIRCLE-0 | FAIL | sin, cos bounded with no limit | A8Cc |
| corrected intuition | T-UNBOUNDED-EVOLUTION | ESTABLISHED INSTANCE | circle; not elevated to H3 | A8Ca, A8Cd |
| STAR-original | T-STAR | OPEN | kept; readings decided separately | A8X1, A8Pe, A8Pd |

## N. Backbone assessment and ratings (separate; no overall score)

| Item | Backbone Support | AI Slop Risk | Transfer Depth | Breadth | Status | Why |
|---|---|---|---|---|---|---|
| circle finite/infinite relation | 35% | 5% | TRIVIAL CONSEQUENCE | 1 | ESTABLISHED INSTANCE (old wording FAIL) | exact (ℝ/Tℤ ≅ S¹, covering ℝ → S¹); known mathematics; immediate from the definitions |
| torus extension | 30% | 8% | STRUCTURAL TRANSFER | 2 | PROVED (criterion); Kronecker source-locked | the action/stabilizer framework applies unchanged from circle to torus and changes the verdict: the arithmetic of ω decides; a counterexample to compact ⇒ periodic |
| H3-action | 30% | 15% | STRUCTURAL TRANSFER | 2 | PROJECT SYNTHESIS | applies unchanged to every action example (circle, tori, cylinder, interval, plane, velocity flow); content is definitions plus known theorems; risk: close to a restatement of dynamical-systems vocabulary |
| H3-quotient | 20% | 15% | STRUCTURAL TRANSFER | 1 | RESTRICTED | exact for the periodic class and (as compact closure) the recurrent class; vacuous with "orbit"; fails for boundary approach |
| H3-c | 10% | 25% | FAIL | 1 | RESTRICTED | the H3 wrapping mechanism does not transfer to c (transfer depth FAIL); what survives is the known CF1/S4 correspondence t ↔ s, r ↔ c, and finiteness of c as the invariant content |
| ★ | 15% | 20% | NOT YET FORMALIZED | 2 | STAR-original OPEN; STAR-A FAIL; STAR-B RESTRICTED; STAR-C RESTRICTED | the forced reading fails on compact spaces; the existence reading is vacuous or class-dependent; the recurrence reading is Poincaré's theorem with its hypotheses |
| Act VIII overall | 25% | 15% | STRUCTURAL TRANSFER | 2 | mixed (see the status table; no umbrella verdict) | the action/stabilizer framework is exact and applies unchanged across the examples; c relates only through the known preserved-form object; every surviving statement is known mathematics |

Foundation rating changes:
- I2 (★): Backbone Support 20% → 15% (STAR-A fails on compact spaces (A8X1, A8X3); STAR-B is vacuous with fixed points; STAR-C is Poincaré with its hypotheses).
- L4 (two roles of c): Backbone Support 25% → 30% (restricted exact answer: both roles belong to the same form constant, and the invariant content is finiteness (A8Mc, A8Lc); known mathematics, no transfer to the circle mechanism).

Low Backbone Support is not a reason to discard a branch: every weak and negative connection above is kept.

## O. Files

- `verify/verify_A8.py` (41 cards, one ledger run); `research/tools/act8_source.py` → `research/act8.json`, this record; registry records T-ACT8-GOV, T-UNBOUNDED-EVOLUTION, T-COMPACT-NOT-PERIODIC, T-H3-ACTION, T-H3-QUOTIENT, T-H3-C, T-STAR-A, T-STAR-B, T-STAR-C; Foundation objects A8A, A8C, A8T, A8D, A8S, A8H, A8M, A8L, A8K, A8X, bridges BR75–BR80, domains D37–D39; sources SRC-HATCHER-2002, SRC-KATOK-HASSELBLATT-1995, SRC-HARDY-WRIGHT-2008, SRC-WEYL-1916, SRC-WALTERS-1982, SRC-POINCARE-1890, SRC-MALAMENT-2012; `test/act8.test.js`.

## P. Recommendation for the next pass

- One adversarial lock pass for Act VIII, then close it: re-derive the STAR-B dimension ≥ 2 statement (carded only through its local model A8X4), the free-orbit decision tree and its "noncompact, not escaping" class (no carded example), the boundary-approach ≅ drift classification against C8 and S5b, and the finiteness-invariant answer to H3-1; check that no record calls an irrational flow periodic or M_∞ "the Newtonian metric".
- A narrower second construction is not recommended: the open item (H3-original) has no candidate object beyond the known ones found here.
- Not begun (stop list): mass-wave/conjugacy, dispersion, quantum work, Energeo, the final Foundation freeze.
