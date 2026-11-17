# Act VIII: finite / infinite representation, H3, ★ and c (first construction pass + story-integration pass)

Generated from `research/tools/act8_source.py` (`research/act8.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Act VIII first construction pass" and "Act VIII story-integration and mathematical-correction pass". Cards: `verify/verify_A8.py` (A8Ca, A8Cb, A8Cc, A8Cd, A8Ce, A8Cf, A8Ta, A8Tb, A8Tc, A8Te, A8Ua, A8X1, A8X2, A8X3, A8X4, A8X5, A8X6, A8Yb, A8Pa, A8Pb, A8Pc, A8Pd, A8Pe, A8Pg, A8Da, A8Db, A8Ma, A8Mb, A8Mc, A8Md, A8Me, A8La, A8Lb, A8Lc, A8Sa, A8Sb, A8Ra, A8Rb, A8Rc, A8Rd, A8Za); `verify/verify_A8S.py` (A8Ga, A8Gb, A8Gc, A8Ea, A8Eb, A8Ec, A8Fa, A8Fb, A8Ka, A8Kb, A8Ba, A8Va, A8Wa, A8Wb, A8Wc, A8Qa, A8Qb, A8Zb).

Canonical story placement (2026-11-16): the results below answer and refine the Master Story's #18 (circle / unbounded time) and #19 (relativity / c) questions; sections S1–S9 are connecting and supporting mathematics that explain part of #18 and do not replace it (`research/canonical_story.md`). Superseded wording, kept: "sections S1–S9 below place Act VIII in the Foundation spine". Corrected statements keep their old wording under "Superseded wording".

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

Not in the repository (story-integration pass: recovered):
- none: every AMB entry cited by a live record (AMB-1, 7, 13, 14, 15, 16, 18) is in docs/restructure_report_rev3.md

Recovered provenance:
- the Acts I–IX Restructure Report (revision 3): its decision table, ambiguity register AMB-1 to AMB-23, Act rows and open decisions are now in docs/restructure_report_rev3.md (recovered from the session copy of the report; the report is Claude's proposal document, not Nadia's words)
- AMB-1 (decided, D1): H1–H3 not replaced, merged or rewritten; ★ a distinct HYPOTHESIS cross-linked to H3 — Nadia's D1 words are in docs/restructure_decisions.md
- AMB-7 (Pair B decided; the terms of ★ (a)–(c) left open, tested in Act VIII as STAR-A/B/C) — Nadia's Pair B decision is now recorded verbatim in docs/restructure_decisions.md ("Revision 2 decision: Pair B (recovered 2026-11-16)")
- AMB-15: the Gate 2 wording applies; the Master Map #18 wording is the historical conjecture T-TIME-CIRCLE-0 (FAIL)

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
| STAR-B (existence) | A constrained geometry admits at least one periodic evolution. | RESTRICTED | RESTRICTED, in an explicitly defined category. Category: smooth manifolds without boundary (Hausdorff, second countable); admissible dynamics: flows of smooth complete vector fields. Statement: such a manifold carries a flow with a non-constant periodic orbit ⟺ some component has dimension ≥ 2 or is diffeomorphic to S¹. ⇐: a compactly supported bump-rotation field in a chart (A8Ba; compact support gives completeness, Lee 2013), or rotation of S¹. ⇒: otherwise every component is a point or ℝ (classification of 1-manifolds, Milnor 1965) and a flow on ℝ has no non-constant periodic orbit (A8Pe). If fixed points count as periodic, the claim is vacuous (Φ_t = id). Not stated for arbitrary "geometrical objects". | A8Ba, A8Pe, A8X4 |
| STAR-C (recurrence) | Compact/constrained geometry tends to produce recurrence or near return. | RESTRICTED | RESTRICTED to the Poincaré recurrence theorem (known; PROVED under its hypotheses): for a measure-preserving flow on a space of finite total measure, almost every point is recurrent. These are the hypotheses of the standard theorem — of its guarantee — not necessary conditions for recurrence: the rotation of ℝ² (infinite measure) and θ̇ = 2 + cos θ on S¹ (Lebesgue not invariant; invariant density 1/(2 + cos θ)) recur everywhere (A8Va). In A8Pd's examples (cylinder: μ = ∞; logistic: Lebesgue not invariant; θ̇ = 1 − cos θ: only δ₀ invariant) the guarantee is unavailable and recurrence in fact fails there. Topological recurrence (some recurrent point on a compact metric space: minimal sets, Birkhoff) is a separate, weaker statement, source-only here. | A8Pd, A8Va, A8Tc |

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

Classification: too broad as worded (with "orbit"); RESTRICTED without it; corrected so that the periodic and the dense case use different objects (kernel/quotient vs orbit closure).

| Clause | Verdict |
|---|---|
| "orbit" | TOO BROAD: every representation of an action is an orbit image, so this alternative makes the statement true of everything |
| "quotient, covering map" | PROVED for the periodic case only: for a continuous homomorphism χ: ℝ → S¹ or Tⁿ with kernel Tℤ ≠ {0}, ℝ/ker χ ≅ image (a homeomorphism) and ℝ → S¹ is a covering (A8Fa, A8Ka, A8Ce, A8Cf) |
| "compact orbit closure" | PROVED for the dense / quasi-periodic case, as a DIFFERENT object: ker χ = {0}, the image is not closed and χ is not a homeomorphism onto it; the bounded representation is the orbit closure, a subtorus of dimension n − rank(integer relations) (A8Kb, A8Te, A8Ua) |
| boundary approach / drift | NOT ENCODED by any of the three: the velocity orbit is all of (−1, 1), injective, with noncompact closure; its boundedness is an artifact of the coordinate, removed by the conjugacy artanh (A8Pg) |

Scope: Periodic case: quotient/kernel structure. Quasi-periodic/dense case: orbit closure/subtorus structure. Boundary approach: neither (it needs added limit points, a compactification). The same quotient statement is not used for two of these situations.

### H3-original (T-H3): OPEN

| Phrase | Verdict |
|---|---|
| "a common structure where infinite things are combined my a finite thing to produce a representation" | too weak as stated ("parameters can be infinite while outputs are finite" is too weak, decision item 20); the exact candidates are H3-action (PROJECT SYNTHESIS) and H3-quotient (RESTRICTED) |
| "like time and a finite circle geometry producing an infinite sine and cosine with bounds" | ESTABLISHED INSTANCE in the corrected reading: unbounded t, unbounded continuation and cycle count, bounded values (A8Ca, A8Cd); "converge to infinity" FAIL (A8Cc) |
| "that invarient variable like the speed of light which also converges to infinity" | c does not converge inside a theory; it is fixed. Only the family index tends to infinity (Role 3). The literal analogy t ↔ c → ∞ FAILS (H3-c-direct, A8Wa); the group parameter on the Lorentz side is the rapidity φ (θ ↔ φ), and c is a distinct object — a form / unit constant (A8Wa, A8Wc) |
| "is an invarient variable that acts as a rule in the manifold" | ESTABLISHED (Role 2): c fixes the preserved form M_c, the null cone x = ±ct and the boost group (A8La). Common object with the circle (H3-group, ESTABLISHED INSTANCE): one-parameter groups preserving quadratic forms, generated by K with KᵀM + MK = 0 (A8Ga, A8Ea, A8Eb) |

H3-original is not replaced by any candidate; none is called H3. Its strongest surviving exact content: H3-action (PROJECT SYNTHESIS), H3-group (ESTABLISHED INSTANCE) and H3-c-family (RESTRICTED; connection to H3 OPEN). H3-c-direct FAILS.

Neither candidate reproduces H3-original: H3-original names a common structure linking the time–circle example with c; H3-action does not reach c (c is not an action on spacetime) and H3-quotient fails for the boundary-approach behaviour that c-bounded velocities show. The comparison is complete; neither candidate is renamed H3.

## I. c-indexed family

| Statement | Status | Cards |
|---|---|---|
| M_c = diag(1, −1/c²) = P_cᵀηP_c, P_c = diag(1, 1/c), η = diag(1, −1); q_c = t² − x²/c²; for finite c₁, c₂, SᵀM_(c₂)S = M_(c₁) with S = diag(1, c₂/c₁): finite-c congruence / representation normalization only | PROVED | A8Ma |
| finite c > 0: det = −1/c², rank 2, eigenvalues {1, −1/c²}, signature (1, 1), inverse diag(1, −c²) | PROVED | A8Mb |
| null cone x = ±ct; null directions (1, ±c)/√(1 + c²) → (0, ±1); in x̃ = x/c every finite-c cone is x̃ = ±t. Changing coordinates inside one finite-c theory moves the cone's slope; changing c across the family is a different operation, and only the family reaches the limit | PROVED | A8Md |

Not inferred: that physical c is meaningless. Restricted result (A8Wc): for the bare family M_c = diag(1, −1/c²), all finite c > 0 forms are congruent under a spatial rescaling, so the congruence class of this isolated bilinear form does not distinguish the numerical finite value of c. This does NOT mean that physical c has no significance beyond finiteness. Kept distinct: (1) finite-c coordinate/unit normalization; (2) causal/Lorentzian structure (the null cone x = ±ct, A8Md); (3) dimensionless physical ratios such as v/c (tanh φ = v/c, A8Wa, A8Wc); (4) the external theory-family limit c → ∞ (A8Mc, A8Lb).

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
| role under the shared exact object (one-parameter group preserving a quadratic form) | θ = ωt, exactly linear in t, is the group parameter of e^(θJ); orbit invariant r² = \|z₀\|² | the rapidity φ (tanh φ = v/c) is the group parameter of e^(φK); c is not a group parameter; orbit invariant q_c on the orbit (t₀² − x₀²/c²); no member or limit of the c-family is elliptic (A8Wa, A8Wb, A8Sb) |

**Outcome: STRUCTURAL ANALOGY** (from: same mathematical construction, structural analogy, superficial analogy, no transfer).

- Same construction: NO: t is an internal action parameter on a fixed state space; c is an external family index (A8Sa).
- Structural analogy: STRUCTURAL ANALOGY through one exact object shared by both examples (H3-group): a one-parameter group e^(sK) preserving a quadratic form, KᵀM + MK = 0 (CF4, re-carded A8Ga). The correct comparison is θ ↔ φ — the angle θ = ωt of e^(θJ) and the rapidity φ (tanh φ = v/c) of e^(φK) — not t ↔ c (A8Wa). c is a distinct object: a constant of the form, not a group parameter. The earlier "circle radius r ↔ c" has no exact map and is discarded (A8Wb).
- Superficial: SUPERFICIAL as H3-original states it ("c also converges to infinity" like t): t ranges over ℝ inside one system; c is fixed inside each system and only the family index tends to infinity.
- No transfer: the periodic (wrapping) mechanism does not transfer to c: no member or limit of the c-family has an elliptic generator, and the c-family itself drifts to a degenerate boundary point (never periodic, never recurrent).

### Does c support H3?

| Question | Answer |
|---|---|
| Does finite c function as an invariant rule inside Lorentzian geometry? | YES (A8La): c fixes the preserved form M_c, the null cone x = ±ct and the boost group; known mathematics and physics |
| Does varying c give a meaningful family of geometries/forms? | YES in fixed units (t, x) (A8Ma, A8Md). Restricted: the bare forms M_c for finite c are congruent by a spatial rescaling, so the congruence class of the isolated form does not distinguish the finite value of c (A8Wc); c still enters the causal structure (x = ±ct), the dimensionless ratio v/c and the family limit |
| Does c → ∞ produce a singular/degenerate limit? | YES with v and x fixed: the rank drops from 2 to 1, the limit lies outside every congruence class, and the algebra contracts (A8Mc, A8Lc); the drop need not occur under another scaling: NO with β = v/c fixed (A8X5) |
| Is that structurally the same phenomenon as t ∈ ℝ ↦ e^(iωt) ∈ S¹? | NO (A8Sa, A8Sb): an external family parameter drifting to a degenerate boundary point, not an internal action wrapping onto a compact orbit |
| If not the same, is there a narrower common categorical/geometric statement? | YES, restricted (H3-group, ESTABLISHED INSTANCE): both are one-parameter groups preserving a quadratic form; the correspondence is θ ↔ φ (A8Wa), with c a form / unit constant (A8Wc); the c-family and the circle orbit are orbits of one-parameter groups on different spaces (Sym(2) vs S¹) with different behaviour classes |
| If even that is too weak, record the negative result. | Recorded: the literal analogy t ↔ c → ∞ FAILS (H3-c-direct); "c converges to infinity like t" is SUPERFICIAL. What survives is H3-group (ESTABLISHED INSTANCE) and H3-c-family (RESTRICTED; its connection to H3 OPEN) |

H3-1 (the two roles of c), restricted answer: in the velocity parametrization the boost generator is K_c = [[0, −1/c²], [−1, 0]] with det K_c = −1/c² < 0 (C9c). Role 2 (c fixes the invariant form M_c and this hyperbolic generator) and Role 3 (c → ∞ at fixed v: det K_c → 0 and K_c → the Galilean shear K_∞, K_∞² = 0; C9c, A8Lb, A8Lc) are two aspects of this one constant. The bare congruence class of M_c does not distinguish finite values of c (A8Wc); this is not a claim that c means only finiteness. Known mathematics; the connection to H3 stays OPEN.

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
| one-parameter group preserving a quadratic form (generator theorem) | circle rotation and Lorentz boosts (and Galilean shears at c = ∞) | shared exactly (CF1/CF4, A8Ga); θ ↔ φ as group parameters; c is not a group parameter (A8Wa) |
| singular limit of a family of forms + group contraction | the c-family (#19) | not shared with the time–circle example in the canonical story; the oscillator comparison (κ-family, A8Qa) is parked as optional |

Structural-transfer credit goes to the preserved-form / one-parameter-group object (H3-group; Foundation CF1/CF4, re-carded A8Ga) and to the kernel/stabilizer object within the action examples. The singular-limit object belongs to the c-family (#19); the κ-family comparison with an oscillator is parked as optional. No object makes t correspond to c.

## M. H3 status table

Separate statuses; no umbrella verdict. Derived by fixed rules from the card verdicts in A8Za.

| Item | Record | Status | Basis | Cards |
|---|---|---|---|---|
| H3-original | T-H3 | OPEN | not proved and not failed; components: circle instance ESTABLISHED, "converge to infinity" FAIL, c-as-rule ESTABLISHED, the common structure only restricted (H3-c) | A8Ca, A8Cc, A8La, A8Sb |
| H3-action | T-H3-ACTION | PROJECT SYNTHESIS | definitions + known theorems (stabilizer trichotomy, Kronecker, Poincaré); the "invariants" clause corrected | A8Pa, A8Pb, A8Da, A8Ua |
| H3-quotient | T-H3-QUOTIENT | RESTRICTED | periodic case: kernel/quotient (A8Fa, A8Ka); dense case: orbit closure/subtorus, a different object (A8Kb); too broad with "orbit"; fails for boundary approach | A8Ce, A8Cf, A8Fa, A8Ka, A8Kb, A8Pg |
| H3-c-direct | T-H3-C-DIRECT | FAIL | t is the additive parameter of one action on one fixed state space; c is fixed inside each theory and is not a group parameter on spacetime (A8Sa); the Lorentz group parameter is the rapidity φ, tanh φ = v/c (A8Wa); "radius r ↔ c" has no exact map (A8Wb). As H3-original words it ("c also converges to infinity" like t): SUPERFICIAL | A8Sa, A8Wa, A8Wb |
| H3-group | T-H3-GROUP | ESTABLISHED INSTANCE | the generator theorem is PROVED (A8Ga) and realized on supplied forms (A8Gb); circle rotations (A8Ea) and Lorentz boosts (A8Eb) are its canonical instances, with θ ↔ φ as the group parameters; the continuation types differ (A8Ec) | A8Ga, A8Gb, A8Ea, A8Eb, A8Ec |
| H3-c-family | T-H3-C-FAMILY | RESTRICTED | established pieces: the c-family M_c and its degenerate limit (A8Mc), the fixed-v Galilean boost limit (A8Lb), group contraction (A8Lc), the restricted content of c (A8Wc); restricted because every limit depends on what is held fixed (A8X5); the κ-family (A8Qa, A8Qb) is parked as optional; connection to H3: OPEN | A8Mc, A8Lb, A8Lc, A8Wc, A8X5 |
| STAR-A | T-STAR-A | FAIL | irrational torus; logistic interval | A8X1, A8X3 |
| STAR-B | T-STAR-B | RESTRICTED | vacuous with fixed points; in the smooth-manifold category: a non-constant periodic orbit exists ⟺ some component has dimension ≥ 2 or is S¹ | A8Pe, A8Ba |
| STAR-C | T-STAR-C | RESTRICTED | = Poincaré recurrence under its hypotheses (PROVED, known); the hypotheses are those of the guarantee, not necessary for recurrence | A8Pd, A8Va |
| old infinity wording | T-TIME-CIRCLE-0 | FAIL | sin, cos bounded with no limit | A8Cc |
| corrected intuition | T-UNBOUNDED-EVOLUTION | ESTABLISHED INSTANCE | circle; not elevated to H3 | A8Ca, A8Cd |
| STAR-original | T-STAR | OPEN | kept; readings decided separately | A8X1, A8Pe, A8Pd |
| geometry constrains, generator decides | T-GEOM-GEN-DYN | PROJECT SYNTHESIS | exact in the canonical examples (2×2 forms, tori, diag(1, 1, −1)); not a universal theorem: no classification of continuation types from (M, K) in every dimension or for nonlinear flows is claimed | A8Ga, A8Gc, A8Ec, A8Ua |
| STAR-A lesson: geometry alone does not determine periodicity | T-STAR-A-LESSON | PROVED | same torus, same invariants, different behaviour (A8Ua); three generator types on one form (A8Ec) | A8Ua, A8Ec, A8X1 |

## N. Backbone assessment and ratings (separate; no overall score)

| Item | Backbone Support | AI Slop Risk | Transfer Depth | Breadth | Status | Backbone story contribution | Why |
|---|---|---|---|---|---|---|---|
| circle finite/infinite relation | 35% | 5% | TRIVIAL CONSEQUENCE | 1 | ESTABLISHED INSTANCE (old wording FAIL) | REPRESENTATION → DYNAMICS/CONTINUATION: the circle is the image of the translation character, ℝ/ker χ_ω ≅ S¹ (A8Fa, A8Fb) | exact (ℝ/Tℤ ≅ S¹, covering ℝ → S¹); known mathematics; immediate from the definitions |
| torus extension | 30% | 8% | STRUCTURAL TRANSFER | 2 | PROVED (criterion); Kronecker source-locked | GEOMETRY → DYNAMICS/CONTINUATION: same compact geometry, behaviour decided by the generator's integer relations; kernel and orbit closure separated (A8Ua, A8Ka, A8Kb) | the action/stabilizer framework applies unchanged from circle to torus and changes the verdict: the arithmetic of ω decides; a counterexample to compact ⇒ periodic |
| H3-action | 30% | 15% | STRUCTURAL TRANSFER | 2 | PROJECT SYNTHESIS | PRESERVED STRUCTURE → GEOMETRY → DYNAMICS/CONTINUATION: stabilizer and orbit closure of the generated action decide the continuation type | applies unchanged to every action example (circle, tori, cylinder, interval, plane, velocity flow); content is definitions plus known theorems; risk: close to a restatement of dynamical-systems vocabulary |
| H3-quotient | 20% | 15% | STRUCTURAL TRANSFER | 1 | RESTRICTED | REPRESENTATION → DYNAMICS/CONTINUATION, periodic case only (quotient by the kernel); dense case handled by orbit closure | exact for the periodic class and (as compact closure) the recurrent class; vacuous with "orbit"; fails for boundary approach |
| H3-c-direct | 0% | 5% | FAIL | 1 | FAIL | none: a failed overreach, kept | t is an action parameter, c a form/unit constant; the literal analogy has no exact map |
| H3-group | 35% | 10% | STRUCTURAL TRANSFER | 2 | ESTABLISHED INSTANCE | PRESERVED STRUCTURE → TRANSFORMATION → DYNAMICS/CONTINUATION: the common-form chart (CF1/CF4) now reaches orbit behaviour | the generator theorem is proved and realized on supplied forms; circle and boost are its canonical instances |
| H3-c-family | 20% | 20% | STRUCTURAL TRANSFER | 2 | RESTRICTED (H3 connection OPEN) | GEOMETRY → CROSS-SYSTEM TRANSFER (prepared): the family of forms and its singular limit; handoff to the mass-wave branch | established pieces (degenerate limit, Galilean limit at fixed v, contraction); every limit depends on the scaling held fixed; the κ-family is parked as optional |
| ★ | 20% | 20% | NOT YET FORMALIZED | 2 | STAR-original OPEN; STAR-A FAIL; STAR-B RESTRICTED; STAR-C RESTRICTED | GEOMETRY → DYNAMICS/CONTINUATION: STAR-A's failure identifies the missing condition (the generator); STAR-B and STAR-C are restricted to named categories and theorems | the forced reading fails on compact spaces; the existence reading is vacuous or class-dependent; the recurrence reading is Poincaré's theorem with its hypotheses; story-integration pass: Backbone Support restored from 15% to 20% — STAR-A's failure identified the missing condition and does not reduce ★'s research question |
| Act VIII overall | 25% | 15% | STRUCTURAL TRANSFER | 2 | mixed (see the status table; no umbrella verdict) | PRESERVED STRUCTURE → GEOMETRY → DYNAMICS/CONTINUATION, made exact by the generator theorem and the chain preserved relation → group → generator → one-parameter transformation → orbit/stabilizer → dynamics | the action/stabilizer framework is exact and applies unchanged across the examples; c relates only through the known preserved-form object; every surviving statement is known mathematics |

Foundation rating changes:
- I2 (★): Backbone Support 20% → 15% (STAR-A fails on compact spaces (A8X1, A8X3); STAR-B is vacuous with fixed points; STAR-C is Poincaré with its hypotheses).
- L4 (two roles of c): Backbone Support 25% → 30% ([reason superseded on 2026-11-16 by the story-integration entry below; kept as history] restricted exact answer: both roles belong to the same form constant, and the invariant content is finiteness (A8Mc, A8Lc); known mathematics, no transfer to the circle mechanism).
- I2 (★): Backbone Support 15% → 20% (story-integration pass: the reduction rested on STAR-A alone; STAR-A's failure identifies the missing condition (the generator) and the governing criterion is the Foundation story, not the percentage).
- L4 (two roles of c): Backbone Support 30% → 30% ([reason restated on 2026-11-17 without the parked κ-family; kept as history] percentage kept; reason replaced: the deleted finiteness statement is superseded by the restricted link κ = det K_c = −1/c² (Role 2: the hyperbolic generator; Role 3: κ → 0⁻) (A8Qa, A8Wc)).
- L4 (two roles of c): Backbone Support 30% → 30% (Act VIII lock (2026-11-17): percentage kept; reason restated through the boost generator itself: det K_c = −1/c² for the velocity-parametrized generator (Role 2) and its contraction to the Galilean shear as c → ∞ at fixed v (Role 3) (C9c, A8Lc); the κ-family is parked).

Low Backbone Support is not a reason to discard a branch: every weak and negative connection above is kept.

## O. Files

- `verify/verify_A8.py` (41 cards, one ledger run); `research/tools/act8_source.py` → `research/act8.json`, this record; registry records T-ACT8-GOV, T-UNBOUNDED-EVOLUTION, T-COMPACT-NOT-PERIODIC, T-H3-ACTION, T-H3-QUOTIENT, T-H3-C, T-STAR-A, T-STAR-B, T-STAR-C; Foundation objects A8A, A8C, A8T, A8D, A8S, A8H, A8M, A8L, A8K, A8X, bridges BR75–BR80, domains D37–D39; sources SRC-HATCHER-2002, SRC-KATOK-HASSELBLATT-1995, SRC-HARDY-WRIGHT-2008, SRC-WEYL-1916, SRC-WALTERS-1982, SRC-POINCARE-1890, SRC-MALAMENT-2012; `test/act8.test.js`.
- Story-integration pass: `verify/verify_A8S.py` (18 cards, one ledger run); `docs/restructure_report_rev3.md` (recovered); registry records T-H3-C-DIRECT, T-H3-GROUP, T-H3-C-FAMILY, T-GEOM-GEN-DYN, T-STAR-A-LESSON, T-GEN-DYN-Q; Foundation objects A8G, A8E, A8F, A8KC, A8Q, A8GD, A8HCD, A8HG, A8HCF, bridges BR81–BR86, domain D40; sources SRC-LEE-2012, SRC-MILNOR-1965, SRC-YAGLOM-1979; `test/act8_story.test.js`.

## P. Recommendation for the next pass

- LOCKED (2026-11-17): LOCK ACT VIII — STORY AND MATHEMATICS ALIGNED. Placement and verdicts: research/canonical_story.md.
- Next canonical unresolved question (not begun): #17 — "Do observable physical pairings or complementarities reflect deeper symmetry analogous to mathematical conjugacy?" (T-CONJUGACY), reached from #12; it leads to the parked mass-wave branch. #20 stays a parked downstream application.
- Not begun (stop list): mass-wave/conjugacy, dispersion, quantum work, Energeo, the final Foundation freeze.

## Story integration (2026-11-16): Act VIII in the Foundation spine

**Spine (unchanged):** OBJECT → REPRESENTATION → RELATION → ZERO/BALANCE/NULL → TRANSFORMATION → PRESERVED STRUCTURE → GEOMETRY → INFORMATION → DYNAMICS/CONTINUATION → CROSS-SYSTEM TRANSFER → APPLICATION.

**Spine transition advanced:** PRESERVED STRUCTURE → GEOMETRY → DYNAMICS/CONTINUATION.

Act VIII answers and refines the Master Story's circle / time question (#18) and the relativity / c question (#19). It applies the existing common-form chart (CF1, CF4: preserved form → preserving group → generator) to orbit behaviour (stabilizer and orbit closure decide the continuation type), which explains part of the #18 question; it connects #14 (A†MA = M), #4 / #12 (translation → phase) and #18 / #19. It does not replace the circle / periodicity / infinity question, and its theorems re-card existing Foundation results (CF4; the S4 rotation / boost cases; R4, R6).

- **Failed overreach:** geometry alone forces periodicity (STAR-A FAIL: A8X1, A8X3).
- **What the failure teaches:** geometry alone does not determine periodicity: on one torus with the same invariants |z_j| = 1, the integer relations of the generator decide between periodic, subtorus and dense orbits (A8Ua); on one Lorentzian form diag(1, 1, −1), elliptic, hyperbolic and parabolic generators coexist (A8Ec).
- **Surviving structural result:** action/generator/stabilizer determine the continuation type under the supplied geometry.

STAR-A failing is not the Foundation/backbone failing. The backbone claims that preserved relations encode geometry; STAR-A claimed that geometry forces one dynamical outcome. STAR-A failure → geometry alone does not force periodicity, followed by a CROSS-REFERENCE to the already-existing invariant-geometry questions about constraints (T-GEOM-RULES), symmetries (#4), preserved relations and transformations (#14, A†MA = M). STAR-A's failure did not historically cause the invariant-form / generator question (T-GEN-DYN-Q).

Next question: *none created by STAR-A. CROSS-REFERENCE to the already-existing questions "What observable rules arise because an object is constrained by a particular geometry?" (T-GEOM-RULES), "What remains unchanged when the pattern shifts?" (#4) and "What transformations leave that relation unchanged?" (#14), stated together as "Given a preserved geometric relation, what transformations preserve it, what generators produce those transformations, and what observable dynamics follow?" (T-GEN-DYN-Q)*

Backbone Support remains secondary metadata. It is kept, and contextualized by the story contribution of each item; no branch is downgraded because STAR-A failed.

### S1. The generator theorem: the common-form chart → Act VIII

**Theorem.** For a constant matrix M and A(s) = e^(sK): KᵀM + MK = 0 ⟺ A(s)ᵀMA(s) = M for every s.

Proof. Let F(s) = A(s)ᵀMA(s). Since A′ = KA, F′ = (KA)ᵀMA + AᵀM(KA) = Aᵀ(KᵀM + MK)A (A8Ga, generic 3×3). ⇒: F′ ≡ 0 and F(0) = M, so F ≡ M. ⇐: differentiate F(s) = M at s = 0.

Chart objects: CF1 (AᵀMA = M ⟺ B_M preserved), CF4 and bridge BR11 (exp(sK) preserves M ⟺ KᵀM + MK = 0). Cards: A8Ga, A8Gb, A8Gc.

Act VIII sits after the chart: preserved relation → preserving group → generator → one-parameter transformation → orbit/stabilizer → observable dynamics.

Applied only when the form and the transformation family are supplied by the system (A8Gb: six supplied forms, no universal M); the same K can preserve one form and not another (A8Gc).

### S2. Preserved geometry → generator → dynamics (master-chart block)

B_M → G_M = {A : AᵀMA = M} → 𝔤_M = {K : KᵀM + MK = 0} → e^(sK) → orbit / stabilizer → dynamical behaviour

| Row | B_M | G_M | 𝔤_M | One-parameter transformation | Orbit / stabilizer | Behaviour | Cards | Does NOT prove |
|---|---|---|---|---|---|---|---|---|
| Euclidean / SO(2) | B_I(x, y) = xᵀy on ℝ² | SO(2) (with reflections O(2)) | span{J}, J = [[0, −1], [1, 0]], J² = −I | e^(θJ) = I cos θ + J sin θ | circles \|x\| = r; Stab = 2πℤ (x ≠ 0) | periodic (elliptic) | A8Ea, A8Gb | that every compact orbit comes from a rotation; anything about other forms or higher dimensions |
| Lorentz / SO(1,1) | B_η(x, y) = x₀y₀ − x₁y₁ on ℝ² (x₀ = ct) | SO⁺(1,1) | span{K}, K = [[0, 1], [1, 0]], K² = I | e^(φK) = I cosh φ + K sinh φ, tanh φ = v/c | hyperbola branches and null rays; Stab = {0} (x ≠ 0) | free, noncompact; slope tanh φ → ±1 (boundary approach ≅ drift, A8Pg) | A8Eb, A8Wa | that signature decides the dynamics in higher dimensions (it does not, A8Ec); any physical claim beyond 1+1 boosts |
| Fourier character ℝ → U(1) | the Hermitian form \|z\|² on ℂ (preserved by multiplication by χ_ω(t)) | U(1) | iℝ (the generator iω) | χ_ω(t) = e^(iωt), the phase by which translation acts on e_ω (A8Fb) | S¹ = ℝ/ker χ_ω, ker χ_ω = (2π/\|ω\|)ℤ | periodic; the unbounded translation parameter is represented in the compact phase S¹ because values differing by the kernel are identified | A8Fa, A8Fb, A8Ce, A8Cf | that every representation of an unbounded parameter is a quotient (boundary approach is not, A8Pg); that the circle itself is infinite |
| multi-frequency torus flow | the n Hermitian forms \|z_j\|² | Tⁿ = U(1)ⁿ | iℝⁿ; the generator is the frequency vector ω | χ_ω(t) = (e^(iω₁t), …, e^(iω_nt)) | ker χ_ω = ∩ ker χ_(ω_j); periodic ⟺ ker ≠ {0} ⟺ commensurable; otherwise orbit closure = subtorus of dimension n − rank(integer relations) | periodic, or quasi-periodic dense on a subtorus (recurrent, not periodic) | A8Ka, A8Kb, A8Ta, A8Te, A8Ua | that compactness gives periodicity (compact image ⇏ nontrivial kernel); that a dense orbit is a quotient of ℝ (it is not, A8Kb) |

### S3. SO(2) versus SO(1,1): an exact canonical comparison

- Elliptic: J = [[0, −1], [1, 0]], J² = −I, JᵀI + IJ = 0, e^(θJ) = I cos θ + J sin θ: compact, periodic, Stab = 2πℤ (A8Ea).
- Hyperbolic: K = [[0, 1], [1, 0]], K² = I, Kᵀη + ηK = 0 (η = diag(1, −1)), e^(φK) = I cosh φ + K sinh φ: noncompact, free, ‖e^(φK)‖ = e^|φ| (A8Eb).

Both are one-parameter groups generated by matrices satisfying the same abstract infinitesimal preservation equation KᵀM + MK = 0; the form and the generator algebra (K² = −det(K)·I for traceless 2×2 K: det > 0 elliptic, det < 0 hyperbolic, det = 0 parabolic) lead to different continuation behaviour (A8Ec).

Scope: An exact canonical comparison in 2D. Not generalized: in 3D one Lorentzian form diag(1, 1, −1) carries elliptic, hyperbolic and parabolic generators (A8Ec), so signature alone does not determine the dynamics.

### S4. The circle as a Fourier character

- χ_ω: ℝ → U(1), χ_ω(t) = e^(iωt), is a continuous one-dimensional unitary representation (character) of the additive translation group (A8Fa).
- ker χ_ω = (2π/|ω|)ℤ for ω ≠ 0, so ℝ/ker χ_ω ≅ S¹ (a continuous bijection from a compact space onto a Hausdorff space is a homeomorphism) (A8Fa).
- translation → phase → Fourier representation: (T_τ e_ω)(t) = e_ω(t − τ) = χ_ω(−τ)e_ω(t), and on the period-1 basis T_τ e_k = e^(−2πikτ)e_k (R4); a trigonometric polynomial is translation-periodic exactly on the common kernel of its modes' characters (A8Fb).

Exact finite/infinite relation: an unbounded translation parameter can be represented in a compact phase geometry because the representation identifies values differing by the kernel. The circle itself is compact and is not called infinite.

### S5. Kernel versus orbit closure (torus)

- periodic case — quotient/kernel structure: ker χ_ω = Tℤ ≠ {0}; the image is closed and ℝ/Tℤ → image is a homeomorphism; ℝ → S¹ is a covering (A8Fa, A8Ka, A8Ce, A8Cf).
- quasi-periodic/dense case — orbit closure/subtorus structure: ker χ_ω = {0}; the image is not closed ((1, −1) is in the closure but not the image) and χ is a continuous bijection onto the image that is not a homeomorphism (χ(2πq) → χ(0) while 2πq → ∞); the bounded representation is the orbit closure, a subtorus of dimension n − rank(integer relations) (A8Kb, A8Te, A8Ua).

compact image ⇏ nontrivial kernel ⇏ periodicity — read exactly: a compact image does not imply a nontrivial kernel ((1, √2), A8Ka), and for a homomorphism χ: ℝ → Tⁿ periodicity is equivalent to a nontrivial kernel; hence a compact image does not imply periodicity. The kernel/stabilizer and the orbit closure are kept distinct.

### S6. H3-c split into three records

The pass-1 record H3-c (T-H3-C) mixed these three claims; it keeps its verbatim c-clause of H3-original and no longer carries a combined status. The three records are not merged back together.

| ID | Record | Wording (verbatim) | Status | Basis | Cards |
|---|---|---|---|---|---|
| H3-c-direct | T-H3-C-DIRECT | H3-c-direct: literal analogy between unbounded time t and c→∞. Status: FAIL / superficial. | FAIL | t is the additive parameter of one action on one fixed state space; c is fixed inside each theory and is not a group parameter on spacetime (A8Sa); the Lorentz group parameter is the rapidity φ, tanh φ = v/c (A8Wa); "radius r ↔ c" has no exact map (A8Wb). As H3-original words it ("c also converges to infinity" like t): SUPERFICIAL | A8Sa, A8Wa, A8Wb |
| H3-group | T-H3-GROUP | H3-group: circle rotations and Lorentz boosts are both one-parameter symmetry groups preserving quadratic forms and satisfying the generator equation. Status: established structural pattern in the canonical examples. | ESTABLISHED INSTANCE | the generator theorem is PROVED (A8Ga) and realized on supplied forms (A8Gb); circle rotations (A8Ea) and Lorentz boosts (A8Eb) are its canonical instances, with θ ↔ φ as the group parameters; the continuation types differ (A8Ec) | A8Ga, A8Gb, A8Ea, A8Eb, A8Ec |
| H3-c-family | T-H3-C-FAMILY | H3-c-family: varying c indexes a family of Lorentzian structures/forms whose c→∞ limit is singular and whose Lorentz transformations have a Galilean limit under fixed-v scaling. Status: restricted/established pieces; project connection to H3 remains open. | RESTRICTED | established pieces: the c-family M_c and its degenerate limit (A8Mc), the fixed-v Galilean boost limit (A8Lb), group contraction (A8Lc), the restricted content of c (A8Wc); restricted because every limit depends on the scaling held fixed (A8X5). The κ-family (A8Qa, A8Qb) is parked as optional. Connection to H3: OPEN | A8Mc, A8Lb, A8Lc, A8Wc, A8X5 |

### S7. The family M_κ (parked: optional later construction)

*Heading superseded on 2026-11-17 (kept): "S7. Rapidity, c and the family M_κ". Rapidity answers #19 (A8Wa, A8Eb); the family below is parked.*

**PARKED AS OPTIONAL (canonical story diagnostic, 2026-11-16): a later synthesis answering no historical question; kept with its cards, not a story node, no further κ-research.**

- Family: M_κ = diag(1, κ), K_κ = [[0, κ], [−1, 0]]: K_κᵀM_κ + M_κK_κ = 0, K_κ² = −κI, det K_κ = κ (a similarity invariant of the generator in the system's own parameter).
- Members: κ = ω²: e^(sK) = I cos ωs + K sin(ωs)/ω; with s = −t, the harmonic oscillator on (p, q) with its supplied form p² + ω²q² (period 2π/ω). κ = −1/c²: e^(sK) = I cosh(s/c) + cK sinh(s/c), the boost generator dΛ/dv at v = 0 (s = cφ). κ = 0: the Galilean shear.
- Limit: with s fixed, ω → 0 and c → ∞ give the same parabolic limit [[1, 0], [−s, 1]]; with planar translations, [K, H] = −P, [K, P] = κH: Euclidean e(2) (κ > 0), Poincaré(1+1) (κ < 0), Galilei(1+1) (κ = 0) (A8Qa).
- Scaling: scaling-dependent on both sides: in normalized coordinates ωJ → 0 gives the identity (A8Qb), as c → ∞ with β fixed gives nothing (A8X5).
- Roles: θ = ωt ↔ φ = s/c (group parameters); ω² ↔ −1/c² (the value κ = det K); r² ↔ q_c on the orbit (orbit invariants, A8Wb).
- Does NOT prove: a physical identification of oscillator time evolution with boosts; any meaning for "imaginary frequency"; anything about the pure Fourier character, whose form |z|² carries no ω; anything beyond the 2D family.

### S8. Geometry constrains; the generator decides

> geometry constrains the admissible symmetry/action structure, but the generator/action determines whether the resulting orbit is periodic, recurrent, hyperbolic, dense, or drifting.

Status: PROJECT SYNTHESIS (T-GEOM-GEN-DYN). Formal content: "geometry constrains" is given a formal meaning only as M ↦ (G_M, 𝔤_M): the supplied form fixes which transformations and generators are admissible (CF1, CF4, A8Ga); "the generator decides": for K ∈ 𝔤_M, the orbit type of e^(sK) is fixed by K — by the sign of det K for traceless 2×2 K (A8Ec), by the integer relations of ω on tori (A8Ua) — and not by M alone (A8Ec: three types on one form).

Scope: exact in the canonical examples (2×2 forms, tori, diag(1, 1, −1)); not a universal theorem: no classification of continuation types from (M, K) in every dimension or for nonlinear flows is claimed. Role: the main explanatory bridge from GEOMETRY to DYNAMICS/CONTINUATION in the Foundation story. Cards: A8Ga, A8Gc, A8Ec, A8Ua.

### S9. Mass-wave handoff (preparation only)

Handoff only; nothing derived. The planned mass-wave / pairs branch treats the dispersion relation as a quadratic form in (ω, k), with the massless case as its null cone. Act VIII prepares it with: the Lorentz quadratic form η and its c-family M_c (A8Ma); the null cone x = ±ct (A8Md); the role of c kept separate from group parameters (A8Wa, A8Wc); the one-parameter Lorentz symmetry e^(φK) (A8Eb); and generator preservation KᵀM + MK = 0 ⟹ e^(sK)ᵀMe^(sK) = M (A8Ga).

No dispersion form, mass shell or wave–particle statement is derived here (stop list).

## Canonical story placement (2026-11-16)

Category A answers an existing question; B connects two existing questions; C supporting mathematics; D optional branch; E refines an old conjecture.

| Result | Objects | Category | Historical question | Note |
|---|---|---|---|---|
| circle: ‖e^(iωt)‖ bounded, period 2π/\|ω\|, no limit, ℝ/Tℤ ≅ S¹, covering | A8C | A | #18: G2 6 and 8 (unbounded t, bounded S¹) | answers the question as Nadia restated it |
| distinction table (parameter, lift, cycles, bounded, convergence, recurrence, periodicity, density, drift) | A8D | A | #18: "compare what happens to elapsed time, number of revolutions, sine and cosine values, cumulative quantities, and mathematical limits" (MM); G2 6 "two very different kinds of infinity" | answers |
| torus: commensurability — the same torus geometry also carries periodic flows; the irrational/rationally-independent torus flow used here has dense orbit and no exact period; kernel vs orbit closure | A8T, A8KC | A | #18 (G2 8: "deeper analogues"); #3 ("try a nonperiodic sound") | answers; refines ★ (STAR-A) |
| exact versus near recurrence | A8Tc, A8Pc | A | #18: "one revolution, ten revolutions, a thousand" (MM) — exact return vs near return | answers |
| cylinder: periodic projection, unbounded state | A8X2, A8Yb | A | #18: "extend the picture into a cylindrical geometry" (MM) | answers |
| rapidity: tanh φ = v/c; θ ↔ φ | A8Eb, A8Wa | A | #19: which transformations change the observer (MM) | answers; also refines the literal t ↔ c reading (E) |
| roles of c: finite-c forms M_c, null cone, restricted content of c | A8M, A8Wc | A | #19 and G2 3 (what goes to infinity) | answers |
| c → ∞: degenerate form, Galilean boosts at fixed v, contraction | A8L | A | #19 and G2 3; the model-family reading of c → ∞ is a cross-reference from #15 / #16 (Correction B), not its cause | answers |
| Fourier character χ_ω | A8F | B | #4 (translation) and #12 (a shift becomes a phase, R4) → #18 (the circle) | connects existing nodes R4 and R6; no new theorem |
| SO(2) / SO(1,1) | A8E | B | #14 (preserved forms I, η) ⇢ #18 (rotation) and #19 (boost): a cross-reference | connects; re-cards the existing trichotomy (S4, B1b, B1c), adding only the 3D scope check |
| boundary approach ≅ drift | A8Pg | B | C8 (wrapping / near return / boundary approach, Gate 3) and S5b (tanh bound) → #18 | connects |
| generator theorem KᵀM + MK = 0 ⟺ e^(sK) preserves M | A8G | C | #14 ⇢ #18 / #19 | supporting: the theorem is the existing CF4 (BR11), re-carded; only the step to orbit behaviour (BR81) is new. It explains part of #18 and does not replace it |
| stabilizer / orbit terminology | A8A | C | #3, #18 (periodicity is a nontrivial stabilizer) | supporting machinery |
| elliptic / parabolic / hyperbolic language | A8Ec | C | Part VII "Trichotomy: rotation / boost / shear by the sign of the invariant" (S4) | pre-existing vocabulary |
| H3 candidate formalizations (H3-action, H3-quotient) | A8HA, A8HQ | C | H3 (CP §1a) at #18 | formalizations; H3-original stays open |
| κ-family M_κ | A8Q | D | none required (section E) | optional later construction |
| ★ readings STAR-A/B/C; STAR-A lesson | A8SA–A8SC, A8GD | E | Pair B / ★ (RD) at #3, #4, #18 | refines the ★ question; ★ kept verbatim and open |
| old wording "sines and cosines converge to infinity" | A8Cc | E | #18 (MM) | FAIL, kept as the historical conjecture T-TIME-CIRCLE-0 |
| literal t ↔ c (H3-c-direct) | A8HCD | E | H3 c-clause (CP §1a) at #19 | FAIL / superficial; the H3-c split keeps group (B) and family (A) apart |
| counterexamples X1–X6 and rejected implications | A8X | E | #18, ★, G2 2 (X6), G2 3 (X5: scaling) | each refines a question |
| T-GEN-DYN-Q | A8G | E | the already-existing invariant-geometry questions (T-GEOM-RULES, #4, #14), stated together; cross-referenced from STAR-A's failure, not created by it (pre-#17 patch, 2026-11-17) | a refinement of the original question; STAR-A's failure did not historically cause it |

## Superseded wording (kept; replaced by this pass)

| Where | Old wording | Why replaced |
|---|---|---|
| A. not in the repository | ["the \"Acts I–IX restructuring report\" (revision 3): no copy is in the repository; its Act VIII content is known only through registry records that cite it (audit fields \"quoted only in the report\")", "AMB-1: no record anywhere in the repository (searched docs/, research/, src/, test/)", "AMB-7: known only through T-STAR's boundary (\"bound by rules\", \"periodic\", \"can be\": a–c)", "AMB-15: known only through T-TIME-CIRCLE-0's audit field (\"quoted only in the report (AMB-15)\")"] | provenance recovered from project history |
| STAR-B verdict | RESTRICTED. If fixed points count as periodic, the claim is vacuous: every space carries Φ_t = id (A8Pe). For a non-constant periodic orbit the answer depends on the class: flows on ℝ or an interval have none (orbits are monotone; a continuous injection ℝ/Tℤ → ℝ is impossible), the circle has them, and every smooth manifold of dimension ≥ 2 admits one (a rotation field in a coordinate disk multiplied by a bump function; the local model is A8X4; this general construction is a project argument, not carded). "Bound by rules" does not decide it; the topology of the space and the admissible class of dynamics do. | the pass-1 "every smooth manifold of dimension ≥ 2" was stated without a carded construction or a named category |
| STAR-C verdict | RESTRICTED to the Poincaré recurrence theorem (known; PROVED under its hypotheses): an invariant measure, finite total measure, conclusion for almost every point. Each hypothesis is needed (A8Pd): infinite measure (cylinder) — no point recurs; Lebesgue not invariant (logistic) — no interior point recurs; on compact S¹ with θ̇ = 1 − cos θ the only invariant probability is δ₀ and every other orbit is non-recurrent. Topological recurrence (some recurrent point exists on a compact metric space — a minimal set, Birkhoff) is a separate, weaker statement, source-only here. | "each hypothesis is needed" read as necessity for recurrence itself; it is necessity only for the theorem's guarantee |
| H3-quotient classification | too broad as worded (with "orbit"); RESTRICTED without it | one quotient statement was used for two different situations |
| H3-quotient clauses | [["\"orbit\"", "TOO BROAD: every representation of an action is an orbit image, so this alternative makes the statement true of everything"], ["\"quotient, covering map\"", "PROVED for the periodic class: Stab = Tℤ gives the orbit ≅ ℝ/Tℤ and the covering ℝ → S¹ (A8Ce, A8Cf); also for a periodic projection (cylinder)"], ["\"compact orbit closure\"", "PROVED for the free recurrent class: the (1, √2) orbit is injective (no quotient) and its bounded representation is its compact closure T² (A8Tb)"], ["boundary approach / drift", "NOT ENCODED by any of the three: the velocity orbit is all of (−1, 1), injective, with noncompact closure; its boundedness is an artifact of the coordinate, removed by the conjugacy artanh (A8Pg)"]] | kernel/stabilizer and orbit closure kept distinct |
| H3-quotient scope | Holds for the periodic and compact-recurrent classes; fails for boundary approach, which needs a compactification (added limit points) — a different object. | separate quotient from orbit closure |
| H3-original, phrase 3 | c does not converge inside a theory; it is fixed. Only the family index tends to infinity (Role 3); in the circle the corresponding role is played by the form constant r, not by t (A8Sb) | "r ↔ c" had no exact map |
| H3-original, phrase 4 | ESTABLISHED (Role 2): c fixes the preserved form M_c, the null cone x = ±ct and the boost group (A8La); restricted common object with the circle: a one-parameter subgroup preserving a quadratic form (A8Sb) | the common object named through the generator theorem |
| H3-original note | H3-original is not replaced by either candidate; neither candidate is called H3. Its strongest surviving exact content is H3-action (PROJECT SYNTHESIS) and the restricted t/c correspondence (H3-c). | H3-c split |
| c-family note | Not inferred: that physical c is meaningless. The congruence says only that, inside one theory, the value of c is fixed by the choice of spatial unit; the invariant content of the family is whether c is finite (A8Mc, A8Lc). | "the invariant content of the family is whether c is finite" was too broad |
| t vs c table, last row | ["role under the shared exact object (one-parameter subgroup preserving a quadratic form)", "t ↔ the rapidity s (group parameter); the circle radius r ↔ c", "generator type: elliptic (ωJ)² = −ω²I for the circle; hyperbolic K̂² = I for boosts, parabolic K_∞² = 0 at c = ∞; no member of the c-family is elliptic (A8Sb)"] | "the circle radius r ↔ c" had no exact map |
| t vs c: analogy | STRUCTURAL ANALOGY through one exact object shared by both examples: a one-parameter subgroup of the preservation group of a nondegenerate quadratic form on ℝ², with orbits in level sets (the known CF1/S4 trichotomy). Under it t corresponds to the rapidity s and c corresponds to the circle's radius r (the form constant that sets the observable bound); the bound r is attained, the bound c is not (A8Sb) | "r ↔ c" discarded; θ ↔ φ |
| six questions, Q2 | YES in fixed units (t, x) (A8Ma, A8Md), but every finite member is congruent to η: inside one theory the value of c is a unit choice; the family's invariant content is finiteness (A8Mc, A8Lc) | finiteness claim too broad |
| six questions, Q5 | YES, restricted: both examples are one-parameter subgroups preserving a quadratic form, with t ↔ rapidity s and r ↔ c (A8Sb); and both c and the circle family are orbits of one-parameter groups (on different spaces: S¹ vs Sym(2)) with opposite behaviour classes | "t ↔ rapidity s and r ↔ c" corrected |
| six questions, Q6 | Recorded: the H3 wrapping mechanism does not transfer to c (FAIL as same construction); "c converges to infinity like t" is SUPERFICIAL. The surviving correspondence is the known CF1/S4 object, not a new H3 structure | H3-c split |
| H3-1 restricted answer | H3-1 (the two roles of c), restricted answer: Role 2 (c fixes the invariant form) and Role 3 (c → ∞) are roles of the same form constant. At finite c the value of c is not an isomorphism invariant (all finite-c forms are congruent and all finite-c algebras isomorphic); what is invariant is finiteness: M_c is nondegenerate and the algebra is Poincaré exactly when c < ∞ (A8Ma, A8Mc, A8Lc). This is known mathematics; it does not by itself make c an instance of the circle mechanism. | "the invariant content of c is whether it is finite, not its value" deleted as too broad |
| real-result table, singular-limit row | ["singular limit of a family of forms + group contraction", "the c-family only in this pass", "not shared with the time–circle example: the circle family has no contraction (its algebra is ℝ for every ω)"] | the oscillator realization was not considered in pass 1 |
| real-result table, preserved-form row | ["one-parameter subgroup preserving a quadratic form", "circle rotation and Lorentz boosts (and Galilean shears at c = ∞)", "shared exactly (CF1/S4); t ↔ s, r ↔ c"] | "t ↔ s, r ↔ c" corrected |
| real-result verdict | Structural-transfer credit is given only to the preserved-form / one-parameter-subgroup object (already Foundation CF1) and to the stabilizer/quotient object within the action examples. No new object shared by the time–circle example and the c-family was found. | κ-family added; t ↔ c excluded |
| status table, H3-c row | {"id": "H3-c", "record": "T-H3-C", "status": "RESTRICTED", "basis": "same construction FAIL; superficial as worded; restricted structural analogy through the preserved-form subgroup (t ↔ s, r ↔ c)", "cards": ["A8Sa", "A8Sb", "A8Mc", "A8Lc"]} | the H3-c entry mixed three claims |
| status table, H3-quotient basis | periodic and compact-recurrent classes only; too broad with "orbit"; fails for boundary approach | kernel vs closure |
| status table, STAR-B basis | vacuous with fixed points; class-dependent for non-constant periodic orbits | explicit category |
| status table, STAR-C basis | = Poincaré recurrence under its hypotheses (PROVED, known); fails without them | hypotheses vs recurrence |
| ratings | [{"item": "circle finite/infinite relation", "bs": 35, "slop": 5, "td": "TRIVIAL CONSEQUENCE", "breadth": 1, "status": "ESTABLISHED INSTANCE (old wording FAIL)", "why": "exact (ℝ/Tℤ ≅ S¹, covering ℝ → S¹); known mathematics; immediate from the definitions"}, {"item": "torus extension", "bs": 30, "slop": 8, "td": "STRUCTURAL TRANSFER", "breadth": 2, "status": "PROVED (criterion); Kronecker source-locked", "why": "the action/stabilizer framework applies unchanged from circle to torus and changes the verdict: the arithmetic of ω decides; a counterexample to compact ⇒ periodic"}, {"item": "H3-action", "bs": 30, "slop": 15, "td": "STRUCTURAL TRANSFER", "breadth": 2, "status": "PROJECT SYNTHESIS", "why": "applies unchanged to every action example (circle, tori, cylinder, interval, plane, velocity flow); content is definitions plus known theorems; risk: close to a restatement of dynamical-systems vocabulary"}, {"item": "H3-quotient", "bs": 20, "slop": 15, "td": "STRUCTURAL TRANSFER", "breadth": 1, "status": "RESTRICTED", "why": "exact for the periodic class and (as compact closure) the recurrent class; vacuous with \"orbit\"; fails for boundary approach"}, {"item": "H3-c", "bs": 10, "slop": 25, "td": "FAIL", "breadth": 1, "status": "RESTRICTED", "why": "the H3 wrapping mechanism does not transfer to c (transfer depth FAIL); what survives is the known CF1/S4 correspondence t ↔ s, r ↔ c, and finiteness of c as the invariant content"}, {"item": "★", "bs": 15, "slop": 20, "td": "NOT YET FORMALIZED", "breadth": 2, "status": "STAR-original OPEN; STAR-A FAIL; STAR-B RESTRICTED; STAR-C RESTRICTED", "why": "the forced reading fails on compact spaces; the existence reading is vacuous or class-dependent; the recurrence reading is Poincaré's theorem with its hypotheses"}, {"item": "Act VIII overall", "bs": 25, "slop": 15, "td": "STRUCTURAL TRANSFER", "breadth": 2, "status": "mixed (see the status table; no umbrella verdict)", "why": "the action/stabilizer framework is exact and applies unchanged across the examples; c relates only through the known preserved-form object; every surviving statement is known mathematics"}] | percentages contextualized by the story; H3-c split |
| next pass | ["One adversarial lock pass for Act VIII, then close it: re-derive the STAR-B dimension ≥ 2 statement (carded only through its local model A8X4), the free-orbit decision tree and its \"noncompact, not escaping\" class (no carded example), the boundary-approach ≅ drift classification against C8 and S5b, and the finiteness-invariant answer to H3-1; check that no record calls an irrational flow periodic or M_∞ \"the Newtonian metric\".", "A narrower second construction is not recommended: the open item (H3-original) has no candidate object beyond the known ones found here.", "Not begun (stop list): mass-wave/conjugacy, dispersion, quantum work, Energeo, the final Foundation freeze."] | story-integration pass completed the missing bridges |
| story contribution (canonical story diagnostic) | Act VIII supplies the exact link from a preserved relation to continuation behaviour. The preserved form M fixes the preserving group G_M = {A : AᵀMA = M} and its generators 𝔤_M = {K : KᵀM + MK = 0} (the common-form chart, CF1/CF4); a generator K ∈ 𝔤_M gives a one-parameter transformation e^(sK); its stabilizer (kernel) and orbit closure give the continuation type — periodic, quasi-periodic/dense, hyperbolic/free, drifting. It also ties back to REPRESENTATION/TRANSFORMATION: the circle e^(iωt) is the translation character χ_ω, the phase by which translation acts on a Fourier mode (R4). | "Act VIII supplies the exact link" overstated novelty: the link CF1 → CF4 already existed |
| H3-original, phrase 3 (lock) | c does not converge inside a theory; it is fixed. Only the family index tends to infinity (Role 3). The literal analogy t ↔ c → ∞ FAILS (H3-c-direct, A8Wa); the group parameter on the Lorentz side is the rapidity φ (θ ↔ φ), and c is a distinct object — a form/unit constant, entering the generator family as κ = det K = −1/c² (A8Wa, A8Qa) | the parked κ-family is no longer cited in live statements |
| t vs c table, last row (lock) | ["role under the shared exact object (one-parameter group preserving a quadratic form)", "θ = ωt, exactly linear in t, is the group parameter of e^(θJ); orbit invariant r² = \|z₀\|²; κ = det(ωJ) = ω²", "the rapidity φ (tanh φ = v/c) is the group parameter of e^(φK); c is not a group parameter; orbit invariant q_c on the orbit (t₀² − x₀²/c²); κ = det K_c = −1/c² in the velocity parametrization; no member or limit of the c-family is elliptic (A8Wa, A8Wb, A8Qa, A8Sb)"] | κ items removed (κ-family parked) |
| t vs c: analogy (lock) | STRUCTURAL ANALOGY through one exact object shared by both examples (H3-group): a one-parameter group e^(sK) preserving a quadratic form, KᵀM + MK = 0 (A8Ga). The correct comparison is θ ↔ φ — the angle θ = ωt of e^(θJ) and the rapidity φ (tanh φ = v/c) of e^(φK) — not t ↔ c (A8Wa). c is a distinct object: in the family M_κ = diag(1, κ), K_κ = [[0, κ], [−1, 0]], the circle realized as the oscillator (κ = ω²) and the boosts (κ = −1/c²) lie on opposite sides of the parabolic member κ = 0, which ω → 0 and c → ∞ both reach when the physical variables are held fixed (A8Qa, A8Qb). The earlier "circle radius r ↔ c" has no exact map and is discarded (A8Wb) | κ sentence removed (κ-family parked) |
| six questions, Q5 (lock) | YES, restricted (H3-group, ESTABLISHED INSTANCE): both are one-parameter groups preserving a quadratic form; the correspondence is θ ↔ φ (A8Wa), with c a form/unit constant (κ = −1/c², A8Qa); the c-family and the circle orbit are orbits of one-parameter groups on different spaces (Sym(2) vs S¹) with different behaviour classes | κ citation removed |
| H3-1 restricted answer (lock) | H3-1 (the two roles of c), restricted answer: in the velocity parametrization the boost generator is K_c = [[0, −1/c²], [−1, 0]] with det K_c = κ = −1/c² (A8Qa). Role 2 (c fixes the invariant form M_c and the hyperbolic generator) and Role 3 (c → ∞ at fixed v: κ → 0⁻, the parabolic Galilean member; A8Lb, A8Lc) are two aspects of this one constant. The bare congruence class of M_c does not distinguish finite values of c (A8Wc); this is not a claim that c means only finiteness. Known mathematics; the connection to H3 stays OPEN. | the parked κ-family replaced by the boost generator itself (C9c) |
| real-result table, singular-limit row (lock) | ["singular limit of a family of forms + group contraction", "the c-family; the circle when it is realized as the oscillator with its supplied form p² + ω²q² (κ = ω²)", "shared exactly within the family M_κ: ω → 0 and c → ∞ reach the same parabolic (Galilean) member when the physical variables are held fixed (A8Qa, A8Qb); for the pure Fourier character (form \|z\|², generator ωJ) ω → 0 gives the identity, not a contraction"] | κ-family parked |
| real-result verdict (lock) | Structural-transfer credit goes to the preserved-form / one-parameter-group object (H3-group; Foundation CF1/CF4, made explicit by the generator theorem A8Ga) and to the kernel/stabilizer object within the action examples. The singular-limit object is shared by the c-family and the oscillator realization of the circle (A8Qa), and it is scaling-dependent on both sides (A8X5, A8Qb). No object makes t correspond to c. | κ-family parked |
| status table, H3-c-family basis (lock) | established pieces: the c-family M_c and its degenerate limit (A8Mc), the fixed-v Galilean boost limit (A8Lb), group contraction (A8Lc), the restricted content of c (A8Wc), and the family M_κ in which κ = −1/c² and the oscillator κ = ω² reach the same parabolic member (A8Qa, A8Qb); restricted because every limit depends on what is held fixed (A8X5, A8Qb). Connection to H3: OPEN; connection to H3: OPEN | κ-family parked |
| H3-c-family basis (lock) | established pieces: the c-family M_c and its degenerate limit (A8Mc), the fixed-v Galilean boost limit (A8Lb), group contraction (A8Lc), the restricted content of c (A8Wc), and the family M_κ in which κ = −1/c² and the oscillator κ = ω² reach the same parabolic member (A8Qa, A8Qb); restricted because every limit depends on what is held fixed (A8X5, A8Qb). Connection to H3: OPEN | κ-family parked |
| rating why, H3-c-family (lock) | established pieces (degenerate limit, Galilean limit, contraction, the κ-family); every limit depends on the scaling held fixed | κ-family parked |
| next pass (lock) | ["READY FOR ADVERSARIAL LOCK, with these targets: the STAR-B category statement (A8Ba, with the completeness and 1-manifold classification theorems source-only); the free-orbit class \"noncompact closure, not escaping\" (no carded example; kept as a class); the κ-family scope (2D; scaling-dependent); every superseded statement checked absent from live text.", "Not begun (stop list): mass-wave/conjugacy, dispersion, quantum work, Energeo, the final Foundation freeze. The mass-wave handoff note is preparation only."] | Act VIII locked |
| story: STAR-A vs backbone | STAR-A failing is not the Foundation/backbone failing. The backbone claims that preserved relations encode geometry; STAR-A claimed that geometry forces one dynamical outcome. Its failure names the missing condition — the generator/action — and the chain below supplies it. | pre-#17 patch: STAR-A is not represented as causing the generator question |
| story: next question after STAR-A | Given a preserved geometric relation, what transformations preserve it, what generators produce those transformations, and what observable dynamics follow? | pre-#17 patch: cross-reference, not a causal next question |
