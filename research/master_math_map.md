# Master mathematical map: Foundation V1 (consolidation and Pass 2, 2026-11-12)

This is the canonical conceptual map of Geometry of Representation. "Foundation" means the complete mathematical and
theoretical architecture of the project, old and new, not only the recent zero research. Object IDs (OB1, R1, CF1,
…) refer to the generated dependency table `research/foundation_dependencies.md`. Bridge IDs (BR1, …) refer to
`research/foundation_bridges.md`. Completion status is in `research/foundation_completion.md`. External sources (Pass 2)
are in `research/foundation_sources.md`.

**Two maps (locked in Pass 2).** This file is the **research ontology**: it answers *What mathematical objects,
bridges, hypotheses and constructions make up Geometry of Representation?* `docs/act_map.md` is the **teaching /
discovery order**: it answers *In what order should a learner discover these ideas?* The two need not share an
ordering. Mathematics taught later in the Guide (orthogonality, common forms, Lorentz / c, model manifolds,
Noether / Hamiltonian, Fourier) is Foundation all the same.

**Provenance (Pass 2).** Every record has one primary provenance class: USER-ORIGIN; TEXTBOOK / STANDARD;
PRIMARY-PAPER BACKED; PROJECT-DERIVED FROM ESTABLISHED MATH; PROJECT-CONSTRUCTION; SPECULATIVE PROJECT CONNECTION;
PHILOSOPHICAL. Every bridge has one strength class: EXACT IDENTITY; EXACT IMPLICATION; THEOREM; SPECIAL-CASE
CONSTRUCTION; STRUCTURAL ANALOGUE; OPEN CONNECTION; FAILED CONNECTION.

**Historical layers, never collapsed into each other:**

- ORIGINAL USER THEORY
- ESTABLISHED MATHEMATICS
- PROJECT-DERIVED CONNECTION
- PROJECT CONSTRUCTION
- PAPER-BACKED CONNECTION
- OPEN RESEARCH QUESTION
- PHILOSOPHICAL LENS
- FAILED / NEGATIVE RESULT

Every list of kinds below (geometries, zeros, behaviors, representations) is a list of **known/project-observed
examples, not a logically exhaustive classification**.

---

## Part I. Foundation spine

The project's current architecture. It is a PROJECT ARCHITECTURE, not a proven universal law. Neither zero alone
nor the common-form mechanism alone is its center:

- **Zero is a central investigative interface inside the architecture.** It is not the entire Foundation.
- **Common-form / preserved-relation mathematics is a major unifying mechanism inside the architecture.** It is not
  the entire Foundation.

```
OBJECT → REPRESENTATION → RELATION → ZERO / BALANCE / NULL → TRANSFORMATION → PRESERVED STRUCTURE
       → GEOMETRY → INFORMATION → DYNAMICS / CONTINUATION → CROSS-SYSTEM TRANSFER  ⟶  APPLICATION
```

**Annotation of TRANSFORMATION → PRESERVED STRUCTURE (Pass 3 correction).** This step distinguishes three
relationships, never collapsed (Transformation Architecture, TA0; Part III):

- **R1, representation covariance:** the same structure in a new representation;
- **R2, actual structural invariance:** F*T = T;
- **R3, operator equivariance / intertwining:** C ρ_V(g) = ρ_W(g) C.

Transformation is not symmetry, and representation change is not physical change.

**Cross-cutting branch at REPRESENTATION (2026-11-13).** Two related architectures leave the REPRESENTATION stage.
Both feed zero, geometry, information, reconstruction, dynamics and cross-system transfer.

```
                                   REPRESENTATION
                    ┌───────────────────┴────────────────────┐
     TRANSFORMATION RELATIONSHIPS (TA0)        REDUCTION / INFORMATION CHANGE (RI0)
     R1 covariance · R2 invariance ·           Φ: X → Y — what survives, collapses, becomes zero,
     R3 equivariance                           is lost, is reconstructible; fibers; symmetry
                    └───────── intersection: information-changing maps that are also equivariant (RI1) ─────────┘
                                                        ↓
                    zero · geometry · information · reconstruction · dynamics · cross-system transfer
```

The linear spine is not rewritten; this is a cross-cutting architecture.

| Stage | Foundation objects | Notes |
|---|---|---|
| OBJECT | OB1, MW1, A3, PL1 | What is the object before we choose how to represent or measure it? Shared vocabulary does not imply a shared object. |
| REPRESENTATION | R1–R10, ON4, ON5, W1–W3, P1, MW1 | x → R(x): Fourier, basis changes, Lorentz frames, prediction maps, phase, projection |
| RELATION | CF1, CF9, CF10, CF11-A, CF11-B, ON1–ON3, ON6, ON7, ON9, T2, Z4, P1, MW2 | the common-form / preserved-relation architecture (Part III) |
| ZERO / BALANCE / NULL | Z1–Z12, CF2, CF3, ON6, R8, H1, H4, H5, QZ1–QZ5, W1 | the zero taxonomy (Part IV); zero as connector (Z11, hypothesis) |
| TRANSFORMATION | TA0–TA3, TA2I, CF4, CF7, R4, R5, T1–T4, L3, QZ2, QZ3 | R1 representation covariance; R2 symmetry (groups, generators, orbits, stabilizers); R3 equivariance / intertwining |
| PRESERVED STRUCTURE | CF1, CF2, CF3, CF4, CF5, R3, ON2, L1 | what a transformation keeps |
| GEOMETRY | CF1, CF8–CF10, CF11-A, CF11-B, R7, ON7, ON8, L1, L3, L4, I3, H1, H2, H5, Z9 | a geometry characterized by a preserved relation (pattern CF11-A; project hypothesis CF11-B) |
| INFORMATION | ON3, ON5, T3–T5, M1–M4, W2, W4, H2, H3, H6, H7, QZ1, QZ3, QZ4, Z12 | what a representation keeps, hides, loses or recovers |
| DYNAMICS / CONTINUATION | CF5, CF6, CF7, CF8, R6, I1–I3, L2 | conservation; unbounded parameter in a bounded geometry |
| CROSS-SYSTEM TRANSFER | R10, CF11-B, Z11, Z12, L4, M4, P2, MW3, F1 | transfer depth is rated per transfer |
| APPLICATION | A1, A2, A3 | downstream: never evidence for the upstream mathematics until tested |

Objects that span several stages are listed under each stage.

## Part II. Mathematical objects

The kinds of objects the project has used. These are known examples, not an exhaustive classification for this
project.

| Object | Where | Example |
|---|---|---|
| signals / functions | Fourier (#7, #8), P1 | f ∈ L²[0,1] |
| vectors | Chapter I, R4 construction | v ∈ ℝⁿ |
| basis coefficients | R2, O2 | f̂(k) = ⟨f, e_k⟩ |
| quantum states | stage 2b, four spins | ψ ∈ (ℂ²)^⊗n |
| operators | S_z, S², P_σ, projectors | S_z = ΣS_z⁽ⁱ⁾ |
| mass configurations | Stage 3, WMC, M1–M6 | (mᵢ, rᵢ) |
| prediction vectors | model manifolds (R7) | Y(θ) |
| model manifolds | Quinn et al. (source card) | 𝒴 = {Y(θ)} |
| spacetime events | Lorentz (L1–L3) | (t, x) with η_c |
| geometric configurations | simplex family, compass circle | vᵢ = Pₙeᵢ; x(θ) = r(cos θ, sin θ) |
| energy time series | Energeo (application) | parked |

**OB1, the distinctness rule.** These must remain distinct even where vocabulary is shared:

- L² energy ≠ physical energy;
- null vector (q(v) = 0) ≠ statistical null direction (g v = 0) ≠ zero observable (Aψ = 0) ≠ mass balance.

## Part III. Common forms and invariants

**The architecture** (CF1, CF2):

```
choose a relation → determine the transformations preserving it → infer the geometry characterized by that preserved structure
```

For bilinear and quadratic geometries, B_M(x, y) = x^†My:

- if A^†MA = M, then B_M(Ax, Ay) = B_M(x, y);
- so B_M(x, y) = 0 ⇒ B_M(Ax, Ay) = 0.

This is where the older invariant-form work and the zero work meet (BR10, CF2).

| Geometry | Space / object | Relation | Preserving transformations | Generator condition | Zero / null relation | Source | Status | Similar to CF11 | Different |
|---|---|---|---|---|---|---|---|---|---|
| Euclidean | ℝⁿ | ⟨u, v⟩ = uᵀv (M = I) | AᵀA = I (S4e, O1a) | Kᵀ + K = 0 (S9) | ⟨u, v⟩ = 0: orthogonality; ‖v‖² = 0 only at v = 0 (Z10) | SRC-AXLER-2015, SRC-FULTON-HARRIS-1991, SRC-KLEIN-1872 | ESTABLISHED (textbook) | relation + preserving group characterize the geometry | definite form: no nonzero null vectors |
| Unitary / Hilbert | ℂⁿ, L² | ⟨x, y⟩ = x^†y | U^†U = I | K^† + K = 0 | orthogonality; coefficient zero f̂(k) = 0 | SRC-AXLER-2015, SRC-STEIN-SHAKARCHI-2003 | ESTABLISHED (textbook) | same pattern | sesquilinear; infinite-dimensional for L² |
| General bilinear / quadratic | ℝⁿ | B_M(x, y) = xᵀMy | AᵀMA = M (C1b) | KᵀM + MK = 0 (S9) | B_M(x, y) = 0; q_M(v) = 0 | SRC-FULTON-HARRIS-1991 | ESTABLISHED (textbook) | the general statement of the pattern | what a zero means depends on M's symmetry and signature |
| Lorentz | spacetime (t, x) | η_c = diag(1, −1/c²) | ΛᵀηΛ = η (S5c, C9a) | Kᵀη + ηK = 0 (boosts, S9(2)) | light-like null q_η(v) = 0, v ≠ 0 (S12b): a condition that selects the light cone | SRC-MINKOWSKI-1909, SRC-EINSTEIN-1905; SRC-INONU-WIGNER-1953 (c → ∞) | ESTABLISHED (textbook) | same pattern; c sits inside the form | indefinite; the form degenerates as c → ∞ (C9b) |
| Symplectic | phase space z ∈ ℝ²ⁿ | ω(u, v) = uᵀJv, J antisymmetric | AᵀJA = J (S9(3), C1c, FB9c) | KᵀJ + JK = 0 (Hamiltonian generators) | ω(u, v) = 0 is **symplectic orthogonality**, a relation between two vectors. ω(v, v) = 0 holds for every v because ω is alternating: an **alternating self-pairing zero, not a Lorentz-type null vector** (FB9a, FB9b, BR29) | SRC-ARNOLD-1989 | ESTABLISHED (textbook) | same pattern: the preserved pairing characterizes the geometry | alternating, not symmetric; the self-pairing carries no information (preserving xᵀJx = 0 does not identify J, C1c) |
| Weighted inner product / centering | index space ℝⁿ | ⟨x, y⟩_D = xᵀDy, D = diag(m) | D-orthogonal maps; C_m is the D-orthogonal projector (G5b) | KᵀD + DK = 0 | ⟨1, C_m x⟩_D = 0: the first-moment zero | project cards G5b, G5d; SRC-ARNOLD-1989 (centre of mass) | ESTABLISHED (project-derived) | once the metric is in hand, the pattern applies | the relation came first and the metric was **read off it** (outside-in), not given |
| Fisher / Riemannian | parameter space θ | ds² = dθᵀg(θ)dθ, g = JᵀJ/σ² for Gaussian noise (FB6a) | reparametrizations θ ↦ φ(θ), under which g transforms as a tensor; isometries where they exist | — (no single linear group) | g v = 0 ⟺ Jv = 0: nonidentifiable direction (FB7a, FB7b); a small nonzero eigenvalue is sloppy, not null (FB7c) | SRC-RAO-1945, SRC-AMARI-2016, SRC-TMS-2011 | ESTABLISHED (paper / textbook) | a metric induced by a representation (the prediction map) | the metric varies point to point; reparametrizations are not form-preserving linear maps; CF11-B is untested here |
| Fourier as a change of representation | L², ℓ² | ⟨f, g⟩ = (1/2π)⟨f̂, ĝ⟩ (Plancherel) | the unitary F (F⁴ = I, S11); translation → phase (FB1a) | — | f̂(k) = 0 | SRC-STEIN-SHAKARCHI-2003 | ESTABLISHED (textbook) | the inner product survives a change of representation | it relates two representations of one object rather than acting inside one geometry |
| *Zero-resultant preservation (negative row)* | (ℝᵈ)ⁿ | Σvᵢ = 0 | every linear map (Z4a) | — | Σv = 0 | project cards Z4a, Z4b | ESTABLISHED (boundary) | it is a preserved relation | the preserving group is all of GL: it characterizes **no form** (CF3) |

**Not one fixed matrix.** The rows do not reduce to one M. The Fisher metric varies point to point, and the
weighted metric is read off a relation. No row is included because the word "zero" or "null" appears in it: the
zero / null column names a different object in each row (`research/foundation_sources.md`, "Recurring words").

**CF11 is two records (Pass 2), rated separately.**

- **CF11-A, established pattern (DERIVED / ESTABLISHED PATTERN):** *In many established geometries, a relational
  structure together with the transformations preserving it characterizes substantial geometric structure.*
  - Examples: the Euclidean, unitary, general bilinear / quadratic, Lorentz and symplectic rows, and the weighted
    row once its metric is derived. This is the Erlangen-program type statement (SRC-KLEIN-1872), not a universal
    theorem about all geometry: the zero-resultant row is a counter-case (CF3).
  - Mathematical Status TEXTBOOK / KNOWN. Backbone Support 55%, AI Slop / Delusion Risk 10%, Application Breadth 4,
    TRIVIAL CONSEQUENCE across the textbook rows.
- **CF11-B, project hypothesis (HYPOTHESIS / OPEN):** *Can relation + admissible transformations + preserved structure provide a broader organizing architecture across the geometries investigated in this project?*
  - Mathematical Status SPECULATIVE MAPPING. Backbone Support 30%, AI Slop / Delusion Risk 30%, Application
    Breadth 2, NOT YET FORMALIZED.
  - CF11-A's confidence does not transfer to CF11-B. No cross-domain test has been chosen in advance.
- The earlier single wording ("choose a relation → find the transformations that preserve it → the geometry is the
  pair", 35% / 25%) is superseded: it compressed CF11-A and CF11-B into one claim.

### Pass 3 result (historical) and the Transformation Architecture

**The historical result is unchanged.**

- The preregistered test (`research/constructions/cf11b_fisher_prereg.md`, result `cf11b_fisher_test.md`, cards
  CFT) gave **CF11-F2, PARTIAL SURVIVAL**. CF11-B is classified **REFINED**, and its wording is unchanged.
- History: CF11 original → Fisher preregistered test → CF11-F2 → architectural correction → Transformation
  Architecture R1/R2/R3.
- *Superseded framing (the Pass 3 report):* "three meanings of preserved" (P1, P2, P3). That wording compressed three
  distinct transformation relationships into one word. P1 is R2, P2 is R1 and P3 is R3 below. CF11-R is kept as the
  historical step and is superseded by TA0.

#### The Transformation Architecture (TA0): a project-level organizing architecture, derived from established mathematics

> A mathematical structure may be investigated by distinguishing: (1) how it transforms when its representation changes, (2) which transformations leave the structure invariant, and (3) which maps/operators remain compatible with those transformations.

It is not a new theorem. Each level is known mathematics, sourced and carded separately.

```
                        ABSTRACT STRUCTURE T
        ┌──────────────────────┼────────────────────────────┐
  R1 (TA1)                 R2 (TA2)                     R3 (TA3)
  How does the same        Which actual transformations Which derived maps / operators
  structure change         preserve the structure?      remain compatible with them?
  representation?          F*T = T                      C ρ_V(g) = ρ_W(g) C
  covariance law           ├─ matrix: A†MA = M (CF1)     (commuting operator when V = W)
                           ├─ infinitesimal: L_X T = 0,
                           │  KᵀM + MK = 0 (TA2I) → conservation (Noether, CF5–CF7)
                           ├─ invariant zero relations (BR44)
                           └─ symmetry set Aut(T) = stabilizer (BR45)
```

The three levels are related, but none is collapsed into another:

- *transformation* is not *symmetry*;
- *representation change* is not *physical change*.

**R1, representation covariance (TA1).** Same abstract object, different coordinate representation, covariant
transformation law.

| Object | Law |
|---|---|
| bilinear form | x = Px′ gives M′ = PᵀMP, and B′(x′, y′) = B(Px′, Py′) (TRA4a) |
| metric | g_φ = Jᵀ g_θ J, with dθᵀ g_θ dθ = dφᵀ g_φ dφ (CFT3c, CFT4c, CFT4e) |
| vector | v_φ = J⁻¹ v_θ (CFT5d) |

- The matrix entries change and the geometric quantities do not. Never "g is numerically unchanged", and never F*g = g
  for a passive change.
- Examples:
  - signal ↔ Fourier coefficients (a change of orthonormal basis; Parseval, S2b);
  - basis changes;
  - prediction-space and parameter coordinates (Fisher reparametrization);
  - spacetime coordinate descriptions.
- **Scope correction.** Higher-dimensional *projections* are not R1. Pₙ is not invertible and does not keep inner
  products (TRA4b, BR48). A projection is a representation *map* that loses information, recorded in the Reduction /
  Information-Changing Architecture (Part VI). Its transformation relationship is R3: Pₙ commutes with permutations.
- **R1 formalizes part of the old H2 program.** It gives an exact criterion for "same object, different coordinates ≠
  different object" (CFT7) and for "coordinate-dependent components ≠ coordinate-invariant quantities" (CFT5e,
  CFT10a). H2 is unchanged and not promoted to a theorem.

**R2, structural invariance / symmetry (TA2).** Active symmetries.

| Structure | Symmetry condition | Cards |
|---|---|---|
| any defining tensor/form T | F*T = T | CFT1b, BR42 |
| Riemannian / Fisher metric | F*g = g | CFT4d |
| symplectic form | F*ω = ω | CFT2a |
| Lorentz metric | F*η = η | CFT1c |

- **Matrix bridge (exact, BR36).** For F(x) = Ax and B_M(x, y) = xᵀMy, F*B_M = B_M ⟺ AᵀMA = M. In the complex case,
  A†HA = H (CFT1a). The old central form A†MA = M is the coordinate / matrix realization of F*T = T.
- **Scope.** Several major geometries in the Foundation admit a coordinate-free symmetry condition in which a defining
  tensor/form is preserved under pullback. Not all geometry.
- **Infinitesimal (TA2I, BR43).** F_t*T = T ⟹ L_X T = 0 (TRA1b), with
  (L_X g)_ij = X^k∂_k g_ij + g_kj∂_iX^k + g_ik∂_jX^k. For constant forms with A(t) = e^{tK}, this becomes
  KᵀM + MK = 0, or K†M + MK = 0 in the complex case (TRA1a, TRA1c, CF4).
- **Downstream: conservation** under Noether's assumptions (CF5–CF7). This branch belongs to R2, not to R3.
- **Zero relations (BR44).** F*T = T and T(u, v) = 0 ⟹ T(dF u, dF v) = 0 (TRA2a, C1b): structural invariance
  preserves the zero relations defined by that structure. The converse fails: 2I keeps every zero without preserving
  B_M (TRA2b). This is one exact mechanism inside the zero architecture. It does not say that every zero is generated
  by symmetry.
- **Stabilizer (BR45).** Aut(T) = {F : F*T = T} is the stabilizer of T. Invariance identifies a stabilizer / symmetry
  set, conceptually linked to G_x = {g : g·x = x} and to D_x(g) = 0 ⟺ g ∈ G_x (Z8). The two act on different
  objects and are not equated.

**R3, equivariance / intertwining (TA3).** Maps compatible with transformations.

- **The law.** C ρ_V(g) = ρ_W(g) C. This is an intertwiner when the source and target representations differ, and a
  commuting operator when V = W.
- **R3 is not R2 (TRA3b).** Commuting or intertwining is not invariance of a structure.

| Example | Equation | Card / bridge |
|---|---|---|
| Fourier | F T_a = M_a F: (T_a f)^(ω) = e^{−iωa} f̂(ω) for the continuous transform. For the finite DFT the identity holds for integer cyclic sample shifts modulo N (TRA3a's "every a" ranges over these; no interpolated shift is defined in the repository). Translation in one representation ↔ phase multiplication in another. Not a physical spacetime symmetry. | TRA3a, FB1a, BR46 |
| Weighted centering | C_m is a geometry-derived operator compatible with a symmetry subgroup, not a symmetry: a D-orthogonal, D-self-adjoint projector, not an isometry, with A C_m = C_m A for D-isometries preserving span{1} | CFT8a–c, BR40 |
| Quantum (results unchanged) | group action (S₄, the exchange P) → representation sectors → operators commuting with the action (S² with P_σ) → Schur-type restrictions (scalar on multiplicity-free blocks). Particle exchange is not universalized. | FS2e, Q2d/Q2e, MB2c, BR47 |
| Projections | Pₙ commutes with the permutations of its source basis | TRA4b, Q2f |

**Classification note (Fourier).** F T_a F⁻¹ = M_a also states how the translation operator is represented in the
Fourier basis, which is an R1 reading for operators. As an equation between two representations of the translation
group, it is an intertwining relation. It is classified under R3, and the R1 reading is recorded, not collapsed.

**The four transformation sets.** These are not the same set. They may overlap, but they need not coincide.
"Admissible transformation" is never used without naming the class.

| Domain | REPRESENTATION CHANGES | GEOMETRIC SYMMETRIES | SYSTEM-SUPPLIED TRANSFORMATIONS | OPERATOR-COMPATIBLE TRANSFORMATIONS |
|---|---|---|---|---|
| Constant forms (Euclidean, Lorentz, unitary) | basis changes M′ = PᵀMP (TRA4a) | A†MA = M | — | — |
| Symplectic | — | symplectomorphisms (nonlinear allowed) | the Hamiltonian flow of a given H | — |
| Fisher / Riemannian | reparametrizations g_φ = Jᵀ g J | isometries F*g = g | location–scale (F-B), the exchange (F-C), none (F-C′); a proper subset of the isometries in F-B (CFT11a) | — (none defined) |
| Fourier | change to the Fourier basis | — | translations T_a | F intertwines T_a and M_a |
| Weighted centering | — | D-isometries | — | D-isometries preserving span{1} (commute with C_m) |
| Quantum same-zero | — | unitaries commuting with every S_z⁽ⁱ⁾ | S₄ factor permutations; the exchange P | S² commutes with the S₄ action |
| Mass balance | — | the configuration's isometries | permutations of equal masses; O(d) | the second moment commutes with the stabilizer isometries |
| Simplex projection | not R1 (lossy) | — | permutations of the source basis | Pₙ commutes with them |

**Fisher placement.**

- **R1:** reparametrization, g_φ = Jᵀ g_θ J.
- **R2:** actual isometries, F*g = g. These are the location–scale maps and the exchange.
- **Zero branch:** g(v, v) = 0 with g = JᵀJ/σ² ⟺ Jv = 0, a nonidentifiable tangent direction (FB7, CFT5, Z13). None
  exists in positive-definite cases (F-B).
- **R3:** no derived operator is defined, so none is listed.

**ČENCOV / CHENTSOV — FUTURE HIGH-RELEVANCE CHECK (TAC).** *Does the characterization of the Fisher metric under
statistically meaningful transformations provide a deeper example of the project's transformation-class →
distinguished-geometry relationship?* KNOWN THEOREM, NOT YET INTEGRATED (SRC-CHENTSOV-1982 bears on CF13 and TAC). It
is not used as evidence.

**Old Foundation rules, re-sorted (none changed).**

| Level | Rules |
|---|---|
| R1 | Fourier as a change of orthonormal basis (R1–R3, Parseval); Fisher reparametrization (CF13); the coordinate law of the S14 parameters (log-coordinates) |
| R2 | AᵀMA = M (CF1); zero relations kept by form-preserving maps (CF2); the generator rule (CF4); linear and Hamiltonian conservation, Noether (CF5–CF7); Lorentz invariance (L1); defect zero ⟺ stabilizer (Z8, T2); the pullback common form (CF12); the symmetry-forced Fisher null (Z13); the quantum restricted obstruction (Q2h: the class of unitaries commuting with S_z⁽ⁱ⁾) |
| R3 | translation → phase (R4, BR5, BR46); symmetry averaging as projection (ON3, C6); Pₙ and permutations (Q2f); weighted centering (H4, CFT8); S² and the S₄ action (FS2e); T and the stabilizer (MB2c) |

**The deeper question stays open (TAH, HYPOTHESIS / OPEN).**

> Do recurring relationships among representation covariance, structural invariance, zero relations, and equivariance reveal a deeper common architecture across the systems studied in Geometry of Representation?

Novelty is kept separate:

- F*T = T, A†MA = M, Lie derivatives, intertwiners and the Fourier shift theorem are KNOWN MATHEMATICS.
- The open project question is whether the chain representation → covariance → symmetry → zero relations →
  equivariant structure → information → generated behavior is a useful common architecture across the domains.

**Ratings (separate records; no single number).**

| Record | Mathematical Status | Novelty | Transfer Depth | Backbone Support | AI Slop Risk | Breadth |
|---|---|---|---|---|---|---|
| TA1, R1 | TEXTBOOK / KNOWN | KNOWN MATHEMATICS | STRUCTURAL TRANSFER | 65% | 5% | 3 |
| TA2, R2 (= CF12) | TEXTBOOK / KNOWN | KNOWN MATHEMATICS | STRUCTURAL TRANSFER | 70% | 5% | 3 |
| CF1, matrix form A†MA = M | TEXTBOOK / KNOWN | KNOWN MATHEMATICS | STRUCTURAL TRANSFER | 65% (was 40%) | 5% (was 10%) | 3 |
| TA2I, infinitesimal L_X T = 0 | TEXTBOOK / KNOWN | KNOWN MATHEMATICS | STRUCTURAL TRANSFER | 60% | 5% | 3 |
| TA3, R3 | TEXTBOOK / KNOWN | KNOWN MATHEMATICS | STRUCTURAL TRANSFER | 60% | 5% | 3 |
| TA0, Transformation Architecture | PROJECT-DERIVED FROM KNOWN DEFINITIONS | PROJECT ARCHITECTURAL SYNTHESIS | STRUCTURAL TRANSFER | 45% | 15% | 3 |
| TAH, deeper common-architecture hypothesis | SPECULATIVE MAPPING | PROJECT ARCHITECTURAL SYNTHESIS (open) | NOT YET FORMALIZED | 25% | 35% | 2 |
| CF11-A / CF11-B / CF11-R (historical) | as in Pass 3 | — | — | 60% / 35% / 45% | 8% / 25% / 20% | 3 |

**How to read these numbers.**

- **The mathematics of R1, R2, R3, the matrix form and the infinitesimal form is established and carded.** Their
  mathematical status is TEXTBOOK / KNOWN. Backbone Support is not that confidence: it measures how much each record
  carries the project architecture across independent systems, so it stays below 100%.
- **Breadth is 3:** three independent mathematical systems, none empirical.
- **CF1 changes from 40% / 10% to 65% / 5%.** CFT1a shows CF1 to be the exact coordinate form of R2 across every
  constant-form row.

**Old Pass 3 tables, kept.** The preservation-type table and the Erlangen boundary from the Pass 3 report are kept in
`research/constructions/cf11b_fisher_test.md`. Their column "P1" reads as R2, "passive coordinate change" as R1, and
"P3" as R3.

## Part IV. Zero taxonomy

Known/project-observed categories. Not logically exhaustive. Not reduced to kernels.

| Zero | Equation | Objects | What zero means | What may remain inside | Preserving transformations | Larger / source geometry known? | Generated, inherited or observed? |
|---|---|---|---|---|---|---|---|
| Additive / resultant (Z1) | Σvⱼ = 0 | contributions | cancellation | the contributions; their Gram (tight or not, G3d) | common linear maps (Z4a), twists (Z2c) | sometimes (orthonormal source when tight, G3b/d); not in general (G4c) | generated or inherited (G4c) |
| Linear-functional (Z3, Z7) | ℓ(x) = 0 | vectors, signals | x ∈ ker ℓ | everything except the ℓ-component | maps preserving ker ℓ | the whole space; removed direction known when ℓ is (G4b) | generated by the map |
| Inner-product / bilinear (Z4) | B(u, v) = 0 | vector pairs | orthogonality | Pythagorean additivity | AᵀMA = M (CF2) | — | a relation between two objects |
| Quadratic null (Z5) | q(v) = 0, v ≠ 0 | vectors, events | light-like direction | the direction on the cone | the form's group | none | observed |
| Definite quadratic zero (Z10) | ‖x‖² = 0 | vectors | x = 0 | nothing: the zero identifies the state | — | none | boundary case |
| Observable / eigenvalue (Z6) | Aψ = 0 (or ⟨A⟩ = 0, a larger set) | states | an eigenspace | commuting observables, internal composition (W2c), symmetry action (QZ2, QZ3) | unitaries commuting with A | the state space is given, not derived | observed |
| Coefficient / spectral (Z7) | f̂(k) = 0 | signals | f ⊥ e_k | every other coefficient | multipliers, shifts (phase) | L² with a basis | generated by removing a component |
| Balance / moment (Z2) | Σmᵢ(rᵢ − R_CM) = 0 | mass configurations | balance point | relative positions; the second moment, via the contribution Gram (MB2) | rigid motions; D-orthogonal maps fixing **1** | configuration space minus translation (G5b) | generated by centering |
| Symmetry defect (Z8) | D_x(g) = 0 | a signal and a transformation | g ∈ stabilizer | the orbit structure | conjugation in the group | — | observed |
| Model-manifold null (Z9, Z13) | g(θ)v = 0 ⟺ Jv = 0 | parameters | first-order predictions unchanged along v (exact structural nonidentifiability); not a small sloppy eigenvalue, not a Lorentz null (FB7); a coordinate invariant (CFT5d) | identifiable combinations | reparametrizations (P2); a supplied symmetry forces it at fixed points but is not necessary (Z13, CFT5b, CFT5c) | the prediction map | observed (FB7a–d, CFT5) |

Not a zero category: the symplectic self-pairing ω(v, v) = 0 holds for every v (alternating, FB9a). It is kept out of
the taxonomy because it selects nothing.

**PRESERVED ZERO vs COLLAPSED ZERO (RI2, 2026-11-13).** An additional relationship that does not replace the
taxonomy above:

| | Mechanism | Card / bridge |
|---|---|---|
| **Preserved zero** (transformation) | under R2, F*T = T and T(u, v) = 0 ⟹ T(dF u, dF v) = 0, and the vectors themselves survive (Λv ≠ 0) | TRA2a, RIC1d, BR44 |
| **Collapsed zero** (reduction) | a nonzero source x has Φ(x) = 0 (linear: x ∈ ker Φ; Pₙ1 = 0, C_m1 = 0) | RIC1a, RIC1b, RIC1d, BR50 |

- They are different mechanisms (BR51).
- "Zero in the target ↔ hidden source structure" is ONE exact mechanism, the collapsed zero.
- Not written: all zeros arise from projection; all zeros are hidden higher dimensions.
- Some zeros are neither, for example Z10 and Z6.

**Zero as connector (Z11)**, a HYPOTHESIS:

> 0 may function as an interface/resultant between relational structure in one representation and structure visible in another.

Exact cases:

- the linear case Σ L xᵢ = 0 ⟺ Σxᵢ ∈ ker L (Z3, BR25);
- the higher-dimensional case ℝⁿ → **1**^⊥ → regular-simplex zero (H1).

Not written: "zero is lower-dimensional", "every zero comes from projection", "zero = kernel". Counter-cases: Z10, and
inherited zeros (G4c).

**Strongest cross-domain result (Z12, DERIVED):**

> The visible zero alone does not determine where the hidden information lives.

- In spin systems, the contribution geometry is blind and the independent symmetry decides (FOUR-SPIN-B).
- In mass balance, the contribution geometry decides and symmetry is sound but incomplete.

The method that follows from it: preserve the zero, and inspect the relationships, geometry and symmetries the system
supplies independently. Rating: Backbone Support 35%, AI Slop / Delusion Risk 20%, STRUCTURAL TRANSFER, Application
Breadth 2.

**Method rules (GOVERNANCE):** zero-preserving interrogation (B-ZERO-PRESERVE), with three operations kept apart.

| Operation | Record |
|---|---|
| leave the zero | B-ZERO-LOSS |
| change within the zero | B-ZERO-INTERNAL-CHANGE |
| interrogate without changing the state | — |

Also: B-INDEPENDENT-SYMMETRY and B-INDEPENDENT-DIRECTION.

## Part V. Transformations, groups, generators

| Chain | Objects | Bridges |
|---|---|---|
| Group action → orbit, stabilizer → symmetry defect (zero ⟺ stabilizer) | T1, T2, Z8 | BR8 |
| Translation → phase | R4 | BR5 |
| Translation → autocorrelation → spectral magnitude (carded as one chain, FB1) | T3 | BR5, BR6, BR7 |
| Small translation → spectral second moment (exact D″(0), FB2) ↔ localization (uncertainty, FB3): two statements, not one | T4, T5 | BR9, BR31 |
| Global preserved form → generator rule (rotation, boost, symplectic) | CF4 | BR11 |
| Matrix law AᵀMA = M → coordinate-free pullback F*T = T; coordinate change → tensor law (P2) | CF12, CF13 | BR36, BR37 |
| Generator / symmetry → conservation (linear flows CF5; Hamiltonian CF6; Noether CF7, general theorem source-only, instance FB5) | CF5, CF6, CF7 | BR12 |
| Sign of the invariant → rotation / boost / shear; Kepler trichotomy | CF8 | — |
| Fourier transform as a quarter-turn | R5 | — |
| Symmetry averaging = orthogonal projection | ON3 (C6) | BR2 |
| Independent symmetries acting on zero-producing tuples (S₂, S₄) | QZ2, QZ3 | BR21, BR24 |

## Part VI. Information preservation and loss

The governing question (W4) is a question, not one theorem:

> When a representation suppresses information, what relational structure survives and what new representation can expose it?

The mechanisms below are kept separate. These are known examples, not an exhaustive classification for this project.

| Mechanism | What survives | What is lost | Objects / cards |
|---|---|---|---|
| Fourier magnitude vs phase | power spectrum = second-order information | phase; the signal (P1b, P1c) | T3, R3 |
| Kernel / linear map | the image | the component in ker L; with L unknown, even which relation (G4c) | Z3, H3 |
| Projection onto **1**^⊥ | all differences eᵢ − eⱼ | the common part (centroid), recoverable up to sign given the class (G3b) | H1, H2 |
| Centering (WMC) | relative positions | R_CM | H4 |
| Quasi-steady-state reduction (Michaelis–Menten) | K_M and V_max | one combination of (k₁, k₋₁, k₂); validity needs e₀/(S₀ + K_M) ≪ 1 | M3 (FB11a, FB11b) |
| Coarse-graining by decimation (1D Ising) | the coupling form, renormalized: tanh K′ = tanh²K | the decimated spins | H7 (FB11d) |
| Manifold boundaries | effective model (θ₁ in the two-exponential example) | the limit parameter (θ₂) | M2 (FB11c; MBAM source-only) |
| Scattering (Mallat) | first order: translation-invariant averaged modulus (FB10c); the next order recovers part of what averaging removed (source-only) | phase, position | W2 (SRC-MALLAT-2012, SRC-BRUNA-MALLAT-2013) |
| Quantum dephasing / measurement | the zero (S_z = 0); sector populations | sector coherence ρ_AB; the zero's ±ħ/2 composition (W2c, W3a) | QZ4 |
| Shadows of ℝⁿ | the projected configuration | true angles (O1b) | ON5 |

### Reduction / Information-Changing Architecture (RI0, 2026-11-13)

A project-level organizing architecture, derived from established mathematics. It runs **parallel** to the
Transformation Architecture and is not an R4 inside it. It studies maps Φ: X → Y, where Φ need not be invertible:
maps that project, compress, aggregate, average, filter, coarse-grain, reduce dimension, discard degrees of freedom,
or collapse several source states to one target state. The defining question is not "information is always lost":

> What information survives, collapses, is discarded, or remains reconstructible under Φ?

**For every map, seven questions.** These are not reduced to kernels.

| | Question |
|---|---|
| IC1 | What survives? |
| IC2 | What collapses (Φ(x₁) = Φ(x₂))? |
| IC3 | What becomes zero (Φ(x) = 0)? |
| IC4 | What is lost? |
| IC5 | What is reconstructible, and under which assumptions? |
| IC6 | What are the fibers Φ⁻¹(y) (ker Φ in the linear case)? |
| IC7 | Does Φ ρ_X(g) = ρ_Y(g) Φ hold? |

The full table, one row per map, is generated in `research/foundation_reduction_maps.md`.

**Distinctions (locked).**

- information-changing ≠ symmetry;
- information-changing ≠ change of coordinates;
- **an information-changing map may still be equivariant.**

The intersection of the two architectures is explicit (RI1, BR52): information-changing maps that are also
equivariant.

| Map | Axis A | Axis B (R-relationship) |
|---|---|---|
| Fourier transform (unitary) | invertible; information-preserving | R1 (change of basis) + R3 (translation ↔ phase) |
| Simplex projection Pₙ | noninvertible; information-changing | R3: commutes with permutations |
| Weighted centering C_m | noninvertible; information-changing | R3 under the D-isometries preserving span{1} |
| Band-limiting / discarding coefficients | noninvertible; information-changing | R3: commutes with integer cyclic shifts (RIC1c) |
| Magnitude only, x ↦ \|x̂\| | noninvertible, nonlinear; information-changing | invariant under translations |
| Scattering averaging | information-changing | produces translation invariance and deformation stability (source-only) |

Axes A and B are an analytic tool for Foundation V1, not final universal categories.

**Simplex projection, revisited (RIC1a, G3b, G3n, G4c).**

| Question | Pₙ: ℝⁿ → 1^⊥ |
|---|---|
| What survives | every difference, vᵢ − vⱼ = eᵢ − eⱼ; Σvᵢ = 0; the regular-simplex Gram |
| What collapses | x and x + c1, one mode |
| What becomes zero | Pₙ1 = 0, a nonzero source with zero image |
| What is lost | the common component 1ᵀx/n |
| What is reconstructible | only under the orthonormal-source assumptions: the source as vᵢ + w with \|w\|² = 1/n, up to ±n̂ and an isometry; not without the source class (G4c) |
| Fibers | x + span{1} |

This is COLLAPSE of one mode + PRESERVATION of selected relational structure. It is one example, not a universal
theorem.

**Weighted centering, dual placement (RIC1b, CFT8).**

- *Information-changing role:* C_m removes the weighted common / translation mode. The weighted mean is lost and
  relative positions survive.
- *R3 role:* A C_m = C_m A for the D-isometries preserving span{1}.
- Both roles are recorded; neither replaces the other. C_m is not an isometry.

**Fourier: the transform vs lossy derived operations.**

- The unitary Fourier transform is not lossy. It is R1, a change of representation, and its translation-to-phase
  relation is R3.
- The following *are* information-changing and are kept distinct from the transform itself:
  - discarding coefficients;
  - keeping magnitudes only;
  - band-limiting;
  - averaging;
  - thresholding and subsampling (listed; not carded).

**Mallat / wavelets, by operation.** Mallat does not prove the project architecture. Schematically:

```
x → x ∗ ψ_λ → |x ∗ ψ_λ| → further wavelet transforms → averaging
```

| Operation | Survives | Disappears | Becomes invariant | Recoverable | Needs higher order |
|---|---|---|---|---|---|
| wavelet transform / filtering | everything, with all scales and an admissible wavelet (Grossmann–Morlet, source) | the dropped bands, if scales are restricted | — (translation-covariant, FB10c) | yes, with all scales (source) | — |
| modulus | the envelope in each band | phase within the band | — (commutes with translations) | partly, through other bands and orders (source) | — |
| higher-order propagation | part of what averaging removes (source-only) | — | — | — | yes (source-only) |
| low-pass averaging | the averaged modulus (FB10c) | position; high-frequency structure | translation invariance (FB10c); deformation stability (source-only) | no, from the average alone | the high-frequency structure (source-only) |

- **Established and carded:** the zero mean and admissibility (FB10a, FB10b); translation covariance, first-order
  invariance and many-to-one behaviour (FB10c).
- **Source-only:** deformation stability, energy, higher-order recovery.
- **Not written:** "Mallat proves hidden information in zero"; "scattering is the universal form of reduction".

**Source / manifestation.**

> What can a reduced manifestation tell us about the richer source structure that generated it?

- A source does not automatically mean a higher physical spatial dimension, and a reduction does not automatically
  mean a projection.
- The source may be higher-dimensional, higher-information, higher-resolution, more parameterized, less averaged or
  less quotient-like, depending on the system.

**Placeholders, not pre-answered.**

- **Model reduction / manifold boundary (BR54):** the invariants, coordinate dependence and effective variables are
  for the model-manifold invariance audit.
- **Coarse-graining / RG (BR55):** one carded instance (FB11d). No equivalence with projection, wavelet packets,
  Mallat or model manifolds is asserted.

**Open project question (RI3, BR56).**

> Is the Geometry of Representation fundamentally governed by both how structure behaves under transformations and how structure behaves under reduction?

OPEN PROJECT QUESTION, not promoted. The project-specific part is whether a shared analysis of SURVIVAL + COLLAPSE +
ZERO + RECONSTRUCTION + SYMMETRY COMPATIBILITY gives a useful cross-domain geometry of representation. Each object
involved is known mathematics: linear projection, kernels, quotients / fibers, wavelet decomposition, scattering,
coarse-graining, equivariance.

## Part VII. Finite / infinite and continuation

- **Canonical exact example (R6):** t ∈ ℝ ↦ e^{iωt} ∈ S¹. Unbounded parameter, bounded geometry, repeated structure.
- **Known behaviors, not exhaustive (I1):**
  - periodic return (C8a);
  - quasi-periodic near-return (C8d);
  - boundary approach (C8b, S5b);
  - mean-square convergence, with pointwise failure (C8c FAIL, kept; C8c2).
- **Trichotomy:** rotation / boost / shear by the sign of the invariant; Kepler (CF8).
- **Compass circle (ON7):** x·x′ = 0 ⟺ |x| constant on each connected component. That is constraint → orthogonality
  → constant radius → shape. It does not show that orthogonality alone generates every form (ON8, B-ORTHO-FORM).
- **★, verbatim, USER HYPOTHESIS / OPEN (I2):** *Any geometrical object that is bound by rules can be periodic.*
  Research question: what repeated or continuing behavior follows from the internal constraints of a geometry?
- **H3 and B-FINITE-INFINITE (I3)** are kept as separate records.

## Part VIII. Higher / source / effective representations

| Construction | Exact content | Status |
|---|---|---|
| Simplex family (H1) | vᵢ = Pₙeᵢ: Σ = 0, vᵢ·vⱼ = −1/n, normalized −1/(n−1) | GENERAL CONSTRUCTION |
| Reconstruction (H2) | fᵢ = vᵢ + w, \|w\|² = 1/n, unique up to ±n̂ given the class | proved under assumptions |
| Tight-frame boundary (H2) | an orthonormal-basis source exists ⟺ a multiple of G is idempotent | proved |
| Inverse problem (H3) | special case proved; exact obstruction without class (G4c) | OPEN |
| WMC / C_G (H4) | C_G = I − 11ᵀG/(1ᵀG1), G positive diagonal; locked to **1** | GENERAL CONSTRUCTION |
| Larger generating geometry (H5) | B-HIGHER-GEOMETRY | HYPOTHESIS |
| Effective / reduced (H6) | what survives a reduction: projection, simplex, centering, MBAM, singular perturbation, coarse-graining, RG. These mechanisms are compared, not equated. Worked examples: M3 (FB11a), a manifold boundary (FB11c), 1D decimation (H7, FB11d) | OPEN (question); examples carded and sourced |

## Part IX. Paper-backed and textbook territories

Sources are listed in full, with what each does **not** establish, in `research/foundation_sources.md`. A source
supports only the established or derived object it states; it may bear on a hypothesis without supporting it.

| Territory | Established result (source) | Project interpretation | Open project connection | Kept apart |
|---|---|---|---|---|
| Standard Fisher geometry | Fisher information as a Riemannian metric (SRC-RAO-1945, SRC-AMARI-2016); g = JᵀJ/σ² for Gaussian noise (FB6a) | a metric induced by a representation (CF10) | C7 (M4) | the textbook metric is not a Transtrum–Sethna result |
| Transtrum / Sethna model manifolds | bounded hyperribbons, hierarchical widths, boundaries, sloppy spectra (SRC-TMS-2010, SRC-TMS-2011, SRC-GUTENKUNST-2007, SRC-MACHTA-2013); MBAM (SRC-TRANSTRUM-QIU-2014) | prediction space as a representation geometry (R7, M1, M2) | higher / infinite prediction spaces (T-PREDICTION-INFINITE) | FB11c checks one boundary limit, not MBAM |
| Quinn et al. (review) | c as a model parameter; the c → ∞ boundary gives Newtonian kinematics (SRC-QUINN-2023; PDF pending, P-2) | the model-manifold boundary statement only | the two roles of c (L4) | C9 is not inferred from it; spacetime ≠ model manifold |
| Project C7 | — (no source contains the relation C7 needs) | — | coefficient decay vs Fisher decay (M4; SPECULATIVE PROJECT CONNECTION) | no paper is evidence for C7 |
| Relativity | Lorentz transformations (SRC-EINSTEIN-1905); the invariant interval and light cone (SRC-MINKOWSKI-1909); contraction to Galilei as c → ∞ (SRC-INONU-WIGNER-1953) and the Carroll limit (SRC-LEVY-LEBLOND-1965) | c in the form and in the limit (L1–L3) | L4: *the same parameter participating in invariant geometry and theory transition may encode a deeper structural relation* (project-origin) | the contraction is not evidence for L4 |
| Fourier analysis | orthonormality, Parseval, translation → phase, conjugate symmetry, Weyl equidistribution (SRC-STEIN-SHAKARCHI-2003); Wiener–Khinchin (SRC-WIENER-1930, SRC-KHINTCHINE-1934) | the founding evidence | conjugacy and physical pairs (P2) | the defect identities T3, T4 are project-derived (FB1, FB2) |
| Uncertainty / localization | Δt·Δω ≥ 1/2, equality for Gaussians (SRC-KENNARD-1927, SRC-FOLLAND-SITARAM-1997; convention FB3c) | T5 | the link to spectral spread (BR31) | a different result from the second-moment identity (FB3d) |
| Conservation | Noether's theorems (SRC-NOETHER-1918); Hamiltonian mechanics and the mechanics form of Noether (SRC-ARNOLD-1989) | CF5–CF7 | what law follows from a constraint | the linear card CF5 is not Noether's theorem |
| Wavelets / scattering | admissibility and zero mean (SRC-GROSSMANN-MORLET-1984, SRC-DAUBECHIES-1992, SRC-MALLAT-2009); scattering, translation invariance, deformation stability (SRC-MALLAT-2012); higher orders (SRC-BRUNA-MALLAT-2013) | information destroyed and retained (W1, W2) | DYADIC PACKETS (W3, open definition) | Mallat does not prove the zero theory, nor that information is hidden inside every zero |
| Reductions | quasi-steady state (SRC-BRIGGS-HALDANE-1925, SRC-JOHNSON-GOODY-2011) and its validity (SRC-SEGEL-SLEMROD-1989); decimation RG (SRC-NELSON-FISHER-1975); block spins and RG (SRC-KADANOFF-1966, SRC-WILSON-KOGUT-1974, source-only) | M3, H7, M2 | H6 | compared, not equated |
| Representation theory | Schur's lemma; Schur–Weyl duality; classical groups as form-preserving groups (SRC-FULTON-HARRIS-1991) | secondary match for FS2e, MB2c; CF1, CF4 | Q-SYM-NOVEL | four spins are VALIDATION OF KNOWN MATHEMATICS |
| Quantum mechanics | spin addition (SRC-SAKURAI-2017); projective measurement and dephasing (SRC-NIELSEN-CHUANG-2010) | QZ1, QZ4 | B-ZERO-LOSS | dephasing and which-path share a generic map only |
| Differential geometry | tensor law, pullbacks, isometries, curvature invariance (SRC-LEE-2018); isometry groups are Lie groups (SRC-MYERS-STEENROD-1939); uniqueness of the Fisher metric under sufficient statistics (SRC-CHENTSOV-1982) | CF12, CF13 | CF11-B, CF11-R | the textbook statements are not evidence for the project architecture; the CFT test is |

## Part X. Original user theories

Every user-origin record, with its original wording, normalized reading and status kept separate, is listed in
`research/foundation_user_theories.md` (generated from the registry). The governing statements, verbatim:

- **The founding statement:** the H1/H2/H3 split in `docs/claude_code_prompt.md` §1a (T-ORIGIN, T-H1, T-H2, T-H3).
- **★:** *Any geometrical object that is bound by rules can be periodic.* (T-STAR)
- **Mass and waves:** *mass is waves too, it's just a different form.* (T-MASS-WAVE-SEED, recorded 2026-11-12)
  - Normalized target: construct a representation in which mass-like and wave-like behavior satisfy a common exact
    relation.
  - Supporting mathematics, not proof: S12. QFT is a secondary reference.
- **Mass attraction:** *Keep the original intuition that mass attraction may not be far removed if the deeper
  structural principle is shared.* (T-GRAVITY-ATTRACTION, SPECULATIVE / OPEN). **ORIGINAL VERBATIM NOT RECOVERED:**
  these are Nadia's 2026-11-12 words describing the intuition; its historic wording is not in the repository
  history.
- **Zero:**
  - the backbone (T-BACKBONE-PRIMARY);
  - "0 is orthogonal" (T-ZERO-ORTHOGONAL, readings A–D);
  - looking inside zero and the larger / origin geometry (T-LOOK-INSIDE, B-HIGHER-GEOMETRY);
  - existing things as zeros (T-EXISTENCE-ZERO);
  - zero preservation (B-ZERO-PRESERVE).
- **Representation:** "Are these different objects, or different descriptions of one object?" (T-REPRESENTATION);
  common structural law rather than analogy (T-BACKBONE-SECONDARY).
- **c:** the two roles of c (T-C-ROLES).
- **Continuation:** finite rule / infinite structure (B-FINITE-INFINITE, T-SCHEMA, T-TIME-CIRCLE); and its
  historical first wording, kept (T-TIME-CIRCLE-0).
- **Orthogonality and form:** B-ORTHO-FORM.
- **Information:**
  - **DYADIC PACKETS** (T-DYADIC): ORIGINAL USER RESEARCH TERM, OPEN DEFINITION.
    - Intended thematic role: connected to organizing or preserving frequency/scale information within the
      wavelet/scattering branch.
    - *Current candidate architectural role (2026-11-13), not the definition:* a hierarchical organization of
      information across repeated splits/reductions, schematically X → (X₀, X₁) → (X₀₀, X₀₁, X₁₀, X₁₁) → …. It is
      investigated within the Reduction / Information-Changing Architecture.
    - DYADIC STRUCTURE — CANDIDATE, NOT UNIVERSAL: no significance is drawn from base 2.
    - Not identified with standard wavelet packets, dyadic wavelet trees, scattering paths or multiresolution
      analysis.
    - Open questions (W5): *Can a hierarchy of packets encode how information survives, separates, disappears, or
      remains reconstructible under repeated reduction?* *Can relationships between packets preserve information not
      visible in any one packet individually?*
  - Information loss (T-MAGPHASE, T-REP-COMPLETE); effective representations (T-EFFECTIVE-Q, registry record added
    in Pass 2).
  - *Provenance correction (Pass 2):* C7 (T-C7) was listed here in V1, but the registry records it as an
    assistant-proposed connection adopted at Gate 3. Its primary class is SPECULATIVE PROJECT CONNECTION (M4).
- **Common forms:** CF11-B (T-CF11-B), the project hypothesis; its earlier form T-BACKBONE-INVARIANT.
- **Pairs and fields:** conjugacy (T-CONJUGACY); matter and fields (T-MATTER-FIELD).
- **Philosophy:** part / whole and the fractal (B-PART-WHOLE); `docs/author_philosophy.md`.
- **Application:** Energeo (T-ENERGEO, T-ENERGEO-INTENT); ThermaLens (T-THERMALENS): APPLICATION PROVENANCE INCOMPLETE.

## Part XI. Project-derived constructions

Each has stated assumptions and failure conditions; see the construction records.

| Construction | Record | Assumptions | Failure condition |
|---|---|---|---|
| ℝ⁴ → ℝ³ tetrahedral zero; simplex family | `constructions/r4_tetrahedral_zero.md` | orthonormal source, orthogonal projection onto **1**^⊥ | non-regular zero sums |
| Linear zero connector | `constructions/zero_connector_linear.md` | linear map | nonlinear and inherited zeros |
| WMC; comparison with T′ (C_G) | `constructions/weighted_mass_centering.md`, `centering_comparison.md` | positive weights; removed direction **1** | Σw = 0; complex weights |
| Quantum additive cancellation pair | `constructions/quantum_additive_cancellation.md` | two spin-½; canonical exchange | non-exchange-eigenstates |
| Four spins (blind) | `constructions/four_spin_zero.md` | labelled factors; S₄ | none in H₀ (validation only) |
| Mass second moment (blind) | `constructions/mass_second_moment.md` | equal masses | R1 misses accidental isotropy |
| Compass circle | `docs/act_map.md` stage 4 contract; G1 cards | differentiable curve, connected interval | — |

## Part XII. Candidate common laws

Only explicit candidates are listed. Ratings are per proposition.

| Candidate | Statement | Status | Support / Slop | Transfer Depth | Breadth |
|---|---|---|---|---|---|
| CF11-B | Can relation + admissible transformations + preserved structure provide a broader organizing architecture across the geometries investigated in this project? | HYPOTHESIS (Pass 3: CF11-F2, REFINED) | 35% / 25% | STRUCTURAL TRANSFER (with the refinement) | 3 |
| CF11-R | A geometry may be characterized by relational structure together with transformations under which that structure is preserved or transforms coherently (explicit form) | HYPOTHESIS (historical; superseded by TA0) | 45% / 20% | STRUCTURAL TRANSFER | 3 |
| TA0 | Transformation Architecture: (1) representation covariance, (2) structural invariance, (3) compatible maps / operators | PROJECT-LEVEL ORGANIZING ARCHITECTURE | 45% / 15% | STRUCTURAL TRANSFER | 3 |
| TAH | Do recurring relationships among representation covariance, structural invariance, zero relations, and equivariance reveal a deeper common architecture across the systems studied in Geometry of Representation? | HYPOTHESIS / OPEN | 25% / 35% | NOT YET FORMALIZED | 2 |
| RI0 | Reduction / Information-Changing Architecture: what survives, collapses, becomes zero, is lost, is reconstructible under Φ | PROJECT-LEVEL ORGANIZING ARCHITECTURE | 45% / 20% | STRUCTURAL TRANSFER | 3 |
| RI1 | information-changing maps that are also equivariant | DERIVED | 50% / 10% | STRUCTURAL TRANSFER | 3 |
| RI2 | PRESERVED ZERO vs COLLAPSED ZERO | DERIVED | 40% / 10% | STRUCTURAL TRANSFER | 3 |
| RI3 | Is the Geometry of Representation fundamentally governed by both how structure behaves under transformations and how structure behaves under reduction? | OPEN PROJECT QUESTION | — | — | — |
| Z11 | zero as connector / interface | HYPOTHESIS | 25% / 30% | STRUCTURAL | 3 |
| Z12 | the visible zero does not determine where hidden information lives | DERIVED | 35% / 20% | STRUCTURAL | 2 |
| H5 | the larger generating geometry | HYPOTHESIS | 35% / 25% | STRUCTURAL | 2 |
| R10 | common structural law rather than analogy | HYPOTHESIS | 25% / 30% | — | — |
| ON8 | organized orthogonality may generate form | HYPOTHESIS | 20% / 35% | — | — |
| I2 / I3 | ★; finite rule → infinite structure | HYPOTHESIS | 20–25% / 25–30% | — | — |
| L4 | the two roles of c are linked | HYPOTHESIS | 25% / 30% | — | — |

**Established chains that work as laws inside known mathematics (not project candidates):**

- CF11-A, the common-form pattern in established geometries (60% / 8%, breadth 3);
- CF12, its coordinate-free form F*T = T (70% / 5%, breadth 3), and CF13, naturality of the Fisher metric;
- preserved form → generator → conservation (CF1 → CF4 → CF5, CF6);
- defect zero ⟺ stabilizer (Z8).

## Part XIII. Failed and negative results (what does not unify)

- **Kept FAIL cards:**
  - S14a (sloppy span);
  - C8c (pointwise convergence);
  - B5a (a check error, re-carded as B5a2);
  - Z1a and Z2b (check errors, re-carded as Z1a2 and Z2b2).
- **CF3:** zero-resultant preservation identifies no form.
- **T′ applied unchanged fails on:** unequal masses (G4m), quantum S_z, Fourier k ≠ 0, orthogonality with u not ∝ **1**.
- **Contribution geometry fails as a descriptor for spin sectors** (Q2b, FS2c). It succeeds for the mass second
  moment, so the two results are opposite.
- **Symmetry is incomplete for mass:** R1 misses M5.
- **P1's converse fails:** the regular-simplex Gram also occurs at S = 0 (FS2d).
- **ε is undefined off exchange eigenstates** (Q2g).
- **The linear connector template fails** on nonlinear zeros (Z5, Z10).
- **C7:** no operator, map or theorem found. The resemblance is not established.
- **Pair A:** the deeper common relation is unfilled. Only the shared algebraic form and the equal-mass bridge are
  established.
- **No nontrivial predictive transfer** has been found in any pass.
- **Pass 3 (CF11-B Fisher test):**
  - With structural invariance alone (P1, now R2), CF11-B does not organize generic Fisher geometry: F-C′ has an exact
    null and no supplied symmetry (CFT5c).
  - Fisher nulls do not require a symmetry (CFT5c).
  - The component eigenvalues of g are parametrization-dependent (CFT5e).
  - F-C is not homogeneous (CFT5f).
  - The isometries of T differ from the transformations a system supplies (CFT11a).
  - Weighted centering is not a symmetry (CFT8b).
  - CFT6b is a kept FAIL (a check error), re-carded as CFT6b2.

## Part XIV. Application layer

- **A1, Energeo:**
  - Core question: can energy behavior be represented so that hidden balance, null relations and invariant structure
    become geometrically explicit?
  - A downstream translator: not evidence until tested.
- **A2, ThermaLens / Energeo implementation mathematics:** prior project / application work, not a paper-backed
  source. Kept separate from Foundation proof and not counted toward upstream validation. APPLICATION PROVENANCE
  INCOMPLETE: its mathematics is not in this repository.
- **A3, physical vs L² energy:** "energy" is always named by kind. Physical units are system-dependent.

## Part XV. Missing mathematical obligations before Foundation V1

Only material gaps; the full ledger, with a status for each domain, is `research/foundation_completion.md`.

1. **Model-manifold invariance audit.**
   - Pass 3 showed that component eigenvalues of a Fisher metric are not coordinate invariants (CFT5e).
   - The sloppy spectrum (M1, S14) is stated in log-parameter coordinates.
   - Every model-manifold quantity the Foundation uses must be stated as invariant or as coordinate-stated before C7.
2. **The CF11 refinement is resolved by the architectural correction.** It is recorded as the Transformation
   Architecture (TA0: R1 / R2 / R3); CF11-R is superseded. The deeper hypothesis (TAH) stays open.
3. **Provenance.**
   - The quinn2023 PDF (P-2).
   - The ThermaLens mathematics (APPLICATION PROVENANCE INCOMPLETE).
   - The original mass-attraction wording (ORIGINAL VERBATIM NOT RECOVERED).
   - No source has been quoted at full text.
   - R5 has no source.
4. **Source-only theorems.** These are cited, with instances or exact parts carded; they are not reproved here:
   - the uncertainty inequality;
   - Noether's general theorem;
   - Mallat's deformation stability and higher-order scattering;
   - the MBAM procedure;
   - fixed-point RG;
   - flat-space rigidity;
   - Myers–Steenrod.

Resolved:

- **Pass 2:** the act-map framing; the two meanings of "Foundation"; the eight uncarded bridges; the wavelet and
  reduction branches.
- **Pass 3:** CF11-B tested (preregistered, CF11-F2), and the coordinate-free common form identified (CF12).
