# Master mathematical map: Foundation V1 (consolidation, 2026-11-12)

This is the canonical conceptual map of Geometry of Representation. "Foundation" means the complete mathematical and
theoretical architecture of the project, old and new, not only the recent zero research. Object IDs (OB1, R1, CF1,
…) refer to the generated dependency table `research/foundation_dependencies.md`. Bridge IDs (BR1, …) refer to
`research/foundation_bridges.md`. Completion status is in `research/foundation_completion.md`.

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

The project's current architecture. It is not a proven universal law.

```
OBJECT → REPRESENTATION → RELATION → ZERO / BALANCE / NULL → TRANSFORMATION → PRESERVED STRUCTURE
       → GEOMETRY → INFORMATION → DYNAMICS / CONTINUATION → CROSS-SYSTEM TRANSFER  ⟶  APPLICATION
```

| Stage | Foundation objects | Notes |
|---|---|---|
| OBJECT | OB1, MW1, A3, PL1 | What is the object before we choose how to represent or measure it? Shared vocabulary does not imply a shared object. |
| REPRESENTATION | R1–R10, ON4, ON5, W1–W3, P1, MW1 | x → R(x): Fourier, basis changes, Lorentz frames, prediction maps, phase, projection |
| RELATION | CF1, CF9, CF10, CF11, ON1–ON3, ON6, ON7, ON9, T2, Z4, P1, MW2 | the common-form / preserved-relation architecture (Part III) |
| ZERO / BALANCE / NULL | Z1–Z12, CF2, CF3, ON6, R8, H1, H4, H5, QZ1–QZ5, W1 | the zero taxonomy (Part IV); zero as connector (Z11, hypothesis) |
| TRANSFORMATION | CF4, CF7, R4, R5, T1–T4, L3, QZ2, QZ3 | groups, generators, orbits, stabilizers |
| PRESERVED STRUCTURE | CF1, CF2, CF3, CF4, CF5, R3, ON2, L1 | what a transformation keeps |
| GEOMETRY | CF1, CF8–CF11, R7, ON7, ON8, L1, L3, L4, I3, H1, H2, H5, Z9 | a geometry characterized by a preserved relation (candidate CF11) |
| INFORMATION | ON3, ON5, T3–T5, M1–M4, W2, W4, H2, H3, H6, QZ1, QZ3, QZ4, Z12 | what a representation keeps, hides, loses or recovers |
| DYNAMICS / CONTINUATION | CF5, CF6, CF7, CF8, R6, I1–I3, L2 | conservation; unbounded parameter in a bounded geometry |
| CROSS-SYSTEM TRANSFER | R10, Z11, Z12, L4, M4, P2, MW3, F1 | transfer depth is rated per transfer |
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

| Geometry | Object | Relation / form | Allowed transformations | Preserved | Meaning of zero / null | Geometry produced | Project connection | Status |
|---|---|---|---|---|---|---|---|---|
| Euclidean | ℝⁿ | M = I | AᵀA = I (O1a, S4e) | lengths, angles, ⟨u, v⟩ | ⟨u, v⟩ = 0: orthogonality | rotations / reflections | H1, Chapter I, #8 | ESTABLISHED |
| Complex Hilbert / unitary | ℂⁿ, L² | ⟨x, y⟩ = x^†y | U^†U = I | inner products, Parseval | orthogonality; coefficient zero | unitary geometry | Fourier (R3), quantum (QZ) | ESTABLISHED |
| General bilinear / quadratic | ℝⁿ | B_M(x, y) = xᵀMy | AᵀMA = M (C1b) | B_M, and every B_M-zero | B_M(x, y) = 0; q_M(v) = 0 | the form's group | C1, CF1 | ESTABLISHED |
| Lorentz | spacetime (t, x) | η_c = diag(1, −1/c²) | ΛᵀηΛ = η (S5c, C9a) | the interval | light-like null q_η(v) = 0 (S12b) | Minkowski geometry; c → ∞ degenerates it (C9b) | H3, C5, C9, L1–L4 | ESTABLISHED |
| Symplectic | phase space z | J antisymmetric | AᵀJA = J (S9(3), C1c) | xᵀJx = 0 for every x (C1a); H along Hamiltonian flow | every vector is J-null | Hamiltonian geometry | CF6, Block 15 | ESTABLISHED |
| Weighted inner product / centering | index space ℝⁿ | ⟨x, y⟩_D = xᵀDy, D = diag(m) | D-orthogonal maps; C_m is the D-orthogonal projector (G5b) | weighted relations | ⟨1, C_m x⟩_D = 0: the first-moment zero | the D-metric, **read off a zero relation** | WMC, C_G (CF9, H4) | ESTABLISHED (project-derived) |
| Fisher / Riemannian | parameter space θ | ds² = dθᵀg(θ)dθ, g = JᵀJ/σ² | reparametrizations (isometries of the prediction map) | statistical distances | g v = 0: nonidentifiable direction (Z9) | model-manifold geometry | R7, C7, Blocks 11–14 | PAPER-BACKED (no card for g; gap) |
| Fourier as a change of representation | L², ℓ² | ⟨f, g⟩ = ⟨f̂, ĝ⟩ | the unitary F (F⁴ = I, S11) | Parseval | f̂(k) = 0 | the same object in another basis | C4, R1–R5 | ESTABLISHED |
| *Zero-resultant preservation (negative row)* | (ℝᵈ)ⁿ | Σvᵢ = 0 | every linear map (Z4a) | the zero resultant | Σv = 0 | **no particular form** (Z4b) | CF3 | ESTABLISHED (boundary) |

**Not one fixed matrix.** The rows do not reduce to one M. The Fisher metric varies point to point, and the
weighted metric is read off a relation.

**The candidate project-level architecture (CF11):** relation R → its preserving group G_R → the geometry (R, G_R).

- Status: HYPOTHESIS. Backbone Support 35%, AI Slop / Delusion Risk 25%, STRUCTURAL TRANSFER, Application Breadth 3.
- It holds as stated for every row above except zero-resultant preservation (CF3). There the preserving group is all
  of GL, and it characterizes no metric.
- It fails, as stated, for any geometry the project needs whose rule is not a preserved relation.

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
| Model-manifold null (Z9) | g(θ)v = 0 | parameters | nonidentifiable direction | identifiable combinations | reparametrizations | the prediction map | observed (gap: no card) |

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
| Translation → autocorrelation → spectral magnitude | T3 | BR6, BR7 |
| Small translation → spectral second moment ↔ localization (two statements, not one) | T4, T5 | BR9 |
| Global preserved form → generator rule (rotation, boost, symplectic) | CF4 | BR11 |
| Generator / symmetry → conservation (linear flows, Hamiltonian, Noether) | CF5, CF6, CF7 | BR12 |
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
| Coarse-graining / model reduction | relevant directions (stiff) | sloppy directions | M2, M3, H6 (no card) |
| Manifold boundaries | effective model | the limit parameters | M2 (paper) |
| Scattering (Mallat) | modulus at the next order recovers part of what averaging removed | phase, position | W2 (NEEDS SOURCE) |
| Quantum dephasing / measurement | the zero (S_z = 0); sector populations | sector coherence ρ_AB; the zero's ±ħ/2 composition (W2c, W3a) | QZ4 |
| Shadows of ℝⁿ | the projected configuration | true angles (O1b) | ON5 |

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
| Effective / reduced (H6) | what survives a reduction: projection, simplex, centering, MBAM, singular perturbation, coarse-graining, RG. These mechanisms are compared, not equated. | OPEN (coarse-graining, RG: no source) |

## Part IX. Paper-backed territories

| Territory | Paper-established result | Project interpretation | Open project connection | Provenance |
|---|---|---|---|---|
| Model manifolds (Quinn, Abbott, Transtrum, Machta, Sethna) | sloppy spectra, hyperribbons, hierarchical widths, manifold boundaries, effective models | prediction space as a representation geometry (R7) | C7 (M4); higher/infinite prediction spaces (T-PREDICTION-INFINITE) | `research/sources/quinn2023.md`; PDF pending (P-2) |
| Relativity (textbook) | Lorentz invariance, rapidity, Galilean limit, the four-momentum invariant | c in the form and in the limit (L1–L3) | the two roles of c (L4, H3-1) | cards S5, S12, C9 |
| Fourier analysis (textbook) | orthonormality, Parseval, shift → phase, Wiener–Khinchin, the transform as a quarter-turn | the founding evidence | conjugacy and pairs (P2) | cards S2, S3, S11, O2, P1 |
| Conservation (textbook) | Noether; Hamiltonian flow | CF5, CF6 | what law follows from a constraint | linear case carded; Noether NEEDS SOURCE |
| Wavelets / scattering (Mallat) | ∫ψ = 0; filter → modulus → average; stability and invariance | information destroyed and retained (W1, W2) | DYADIC PACKETS (W3) | **not in the repository: NEEDS SOURCE** |
| Representation theory (textbook) | Schur's lemma; Schur–Weyl duality; S₄ characters | secondary match for FS2e and MB2c | Q-SYM-NOVEL | cards FS2e, MB2c (no source card) |
| Uncertainty / localization | Δt Δω ≥ 1/2 | T5 | the link to spectral spread (BR9) | spec only: NEEDS SOURCE |
| Michaelis–Menten / effective manifolds | singular-perturbation reduction | M3 | H6 | spec only: NEEDS SOURCE |

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
  structural principle is shared.* (T-GRAVITY-ATTRACTION, SPECULATIVE / OPEN; the original wording is not in the
  repository)
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
- **Information:** C7 (T-C7); DYADIC PACKETS (T-DYADIC); information loss (T-MAGPHASE, T-REP-COMPLETE).
- **Pairs and fields:** conjugacy (T-CONJUGACY); matter and fields (T-MATTER-FIELD).
- **Philosophy:** part / whole and the fractal (B-PART-WHOLE); `docs/author_philosophy.md`.
- **Application:** Energeo (T-ENERGEO, T-ENERGEO-INTENT); ThermaLens (T-THERMALENS, provenance gap).

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
| CF11 | relation → preserving group → geometry | HYPOTHESIS | 35% / 25% | STRUCTURAL | 3 |
| Z11 | zero as connector / interface | HYPOTHESIS | 25% / 30% | STRUCTURAL | 3 |
| Z12 | the visible zero does not determine where hidden information lives | DERIVED | 35% / 20% | STRUCTURAL | 2 |
| H5 | the larger generating geometry | HYPOTHESIS | 35% / 25% | STRUCTURAL | 2 |
| R10 | common structural law rather than analogy | HYPOTHESIS | 25% / 30% | — | — |
| ON8 | organized orthogonality may generate form | HYPOTHESIS | 20% / 35% | — | — |
| I2 / I3 | ★; finite rule → infinite structure | HYPOTHESIS | 20–25% / 25–30% | — | — |
| L4 | the two roles of c are linked | HYPOTHESIS | 25% / 30% | — | — |

**Established chains that work as laws inside known mathematics (not project candidates):**

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

## Part XIV. Application layer

- **A1, Energeo:**
  - Core question: can energy behavior be represented so that hidden balance, null relations and invariant structure
    become geometrically explicit?
  - A downstream translator: not evidence until tested.
- **A2, ThermaLens / Energeo implementation mathematics:** kept separate from Foundation proof. It is not in this
  repository, which is a provenance gap.
- **A3, physical vs L² energy:** "energy" is always named by kind. Physical units are system-dependent.

## Part XV. Missing mathematical obligations before Foundation V1

Only material gaps. The full ledger is `research/foundation_completion.md`.

1. **Missing architecture: wavelets / scattering (W1, W2).** No mathematics or source is in the repository. The
   branch exists only as titles.
2. **Missing architecture: effective / reduced representations (M2, M3, H6).** No cards. Coarse-graining and RG have
   no source.
3. **Uncarded established bridges in the older strands.** Each is a derivation the map depends on:
   - the combined translation → autocorrelation → spectrum card (T3);
   - small translation → spectral second moment (T4);
   - the uncertainty source (T5);
   - Noether in general (CF7);
   - the Fisher metric formula (CF10);
   - the model-manifold null (Z9);
   - conjugate symmetry (P1);
   - the ω–k dispersion (MW2).
4. **Provenance gaps.** The quinn2023 PDF (P-2); Mallat; ThermaLens; the original wording of the mass-attraction
   intuition.
5. **Unresolved contradictions in the architecture:**
   - The act map files the older pillars (common forms, Fourier/orthogonality, conservation, Lorentz, model manifolds)
     under "Guide … not the source ontology". The Foundation lock now counts them as Foundation.
   - "Foundation" names both the learner Acts I–IV and the research architecture.
6. **No cross-domain test chosen in advance for CF11**, the candidate central architecture.
