# Model-manifold research story

Generated from `research/tools/model_manifold_source.py` (`research/model_manifold.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Model-manifold invariance + research-story audit" (2026-11-13) and "Model-manifold precision corrections" (2026-11-15). Cards: `verify/verify_MMI.py`, `verify/verify_MMP.py`.

> Do not audit away the research story. Audit the status of each connection. (T-MM-GOV)

The paper is not the thesis: a paper result does not prove the project interpretation, and the project interpretation is not paper novelty. Novelty classes: KNOWN MODEL-MANIFOLD / INFORMATION GEOMETRY; PROJECT SYNTHESIS; OPEN PHYSICAL / QUANTUM-LIKE INTERPRETATION.

Kept apart throughout: parameter space ≠ prediction space; prediction space ≠ physical spacetime; model manifold ≠ quantum state space.

Row status classes (2026-11-13): ESTABLISHED MATHEMATICS; PAPER-BACKED RESULT; PROJECT-DERIVED CONNECTION; PROJECT HYPOTHESIS; OPEN CONNECTION; PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS; FAILED / NEGATIVE RESULT. Arrow status classes (2026-11-15): ESTABLISHED MATHEMATICS; PROJECT-DERIVED; STRUCTURAL ANALOGY; OPEN; PHILOSOPHICAL / HISTORICAL INTUITION.

## Precision corrections (2026-11-15)

Each overstated statement of 2026-11-13 is kept here with its correction. The MMI card outputs are unchanged; the MMP cards scope their wording.

| Topic | Old claim (superseded) | Corrected claim | Reason | Status | Cards |
|---|---|---|---|---|---|
| model image vs manifold | "The model manifold is M = Y(Θ) ⊆ P." | M = Y(Θ) ⊆ P is the model image / model set in general; it is a smooth model manifold on a regular region only (constant local rank, locally injective). Rank loss, non-identifiability, self-intersections, singular strata and boundary strata are possible. | an immersion's image can self-intersect and a rank drop can make a cusp (MMPa); the F-C image has an edge from interior rank-drop points (MMPj) | ESTABLISHED MATHEMATICS | MMPa, MMPj |
| parameters vs coordinates | "A parameter value is a coordinate on M." / "θ is a point coordinate." | θ ∈ Θ is a parameter value; Y(θ) is its prediction. Parameters parameterize the image and give local coordinates only where the parameterization is locally regular and locally identifiable; different parameter values may represent the same prediction. | F-C: Y(1, 2) = Y(2, 1); rank 1 on the diagonal; e^{−(θ₁+θ₂)t} has rank 1 everywhere (MMPb) | ESTABLISHED MATHEMATICS | MMPb |
| Fisher notation | g = JᵀΣ⁻¹J and g_φ = Jᵀ g J (one symbol J for two Jacobians) | J_Y = ∂Y/∂θ, g_θ = J_Yᵀ Σ⁻¹ J_Y; A = ∂θ/∂φ, g_φ = Aᵀ g_θ A. The tensor is one object; g_θ and g_φ are its component matrices. | notation clash; the law itself was right (MMPc checks it directly) | ESTABLISHED MATHEMATICS | MMPc |
| null directions | "g(v, v) = 0 ⟺ Jv = 0" (hypothesis not always attached) | g(v, v) = (J_Y v)ᵀ Σ⁻¹ (J_Y v); for positive-definite Σ⁻¹, g(v, v) = 0 ⟺ J_Y v = 0. Not for singular metrics or arbitrary observation models. | a singular weight gives g(v, v) = 0 with J_Y v ≠ 0 (MMPd) | ESTABLISHED MATHEMATICS | MMPd |
| noise model | "Rank and null directions do not depend on the noise model." | For g = J_Yᵀ Σ⁻¹ J_Y with a fixed positive-definite Σ⁻¹: ker g = ker J_Y, rank g = rank J_Y; changing one positive-definite weighting to another does not change them. Not claimed for singular observation metrics, parameter-dependent covariances, or noise laws that add Fisher terms. | y ~ N(e^{−(θ₁+θ₂)}, e^{θ₁}) has J_μ(1, −1) = 0 but g((1, −1), (1, −1)) = 1/2 (MMPe) | ESTABLISHED MATHEMATICS (restricted theorem) + caveat | MMPe, MMPd |
| volume element | "√det g dθ is invariant" (density and element not separated) | The invariant object is the full element √det g_θ dθ¹⋯dθⁿ. det g and √det g alone change under reparametrization (by (det A)² and \|det A\|). | √det g changes from 0.0137649 to 0.0412947 at one point while the volume of a region agrees in both charts (MMPf) | ESTABLISHED MATHEMATICS | MMPf |
| widths | "Widths are invariant under reparametrization." / "Hyperribbon widths: parametrization-independent." | Geometric widths defined from the image set with a fixed prediction metric (Transtrum-style geodesic widths with geometrically fixed directions; Quinn-style enclosing-hyperellipsoid widths) may be reparametrization-invariant. Coordinate proxies (raw Fisher / Hessian eigenvalues, J_Y singular values, parameter-axis lengths, condition numbers, widths along a chart's FIM eigendirections) are not. | FIM eigendirections rotate with the chart (MMPg); the exact width definitions have not been taken from the sources | ESTABLISHED MATHEMATICS (proxies); OPEN (exact geometric definitions) | MMPg, MMPh, MMIf |
| boundary language | "The limits of the parameter domain are the boundaries of the model manifold." | Five objects are kept apart: ∂Θ; parameter limits; their images in P; limiting boundary strata (MBAM sense); the topological boundary of Y(Θ). A model-manifold boundary can arise as a limiting / degenerate model family in P; not every parameter-domain boundary gives one, and not every one is a finite boundary point in parameter coordinates. | MMPi (chart-dependent finite points; a domain boundary mapping inside the image; empty interior in P); MMPj (an edge from interior points) | ESTABLISHED MATHEMATICS | MMPi, MMPj |
| function-space example | g_ij = 2/(θᵢ + θⱼ)³ stated beside "function-space prediction space" | g_ij = 2/(θᵢ + θⱼ)³ is the Fisher metric of the specific model e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞); dim P = ∞ while dim M = 2. | θ₁e^{−T} + θ₂e^{−2T} in the same space has a constant metric (MMPk) | ESTABLISHED MATHEMATICS | MMPk, MMIh |
| c verdict | "A finite c is just a change of units"; "FAIL for the invariant-form role"; "sending one model parameter to infinity drops dimension 2 → 1" | Three roles kept apart: Role 1 representation-level normalization (established for the stated form); Role 2 the Lorentzian invariant role (established physics in its native setting); Role 3 the theory-family singular limit (structural analogy worth preserving). Transfer to arbitrary model-manifold geometry: OPEN. The universal "rules constrain states" reading: too weak by itself. c → ∞ gives a degenerate limiting bilinear form, not by itself the Newtonian metric. The 2 → 1 drop is a result of the F-C example. | MMIi checks a representation only; no representation change reaches diag(1, 0) (MMPm); dimension drops depend on the model and the limit (MMPl) | see the three-role verdict | MMPm, MMPl, MMIi, C9a, C9b |
| quantum measurement | "non-selective measurement keeps S_z = 0 and removes coherence between sectors" (stated generically) | The named channel D(ρ) = P_t ρ P_t + P_s ρ P_s (non-selective S² measurement) on \|ud⟩ removes ⟨1,0\|ρ\|0,0⟩ = ⟨0,0\|ρ\|1,0⟩ = 1/2; S_z = 0 survives because [P_t, S_z] = [P_s, S_z] = 0 and S_z ρ = 0. Generic form: a non-selective projective measurement removes coherence between the measured eigenspaces; preservation of S_z must be checked. | a non-selective S_x⁽¹⁾ measurement on the same state gives ⟨S_z⟩ = −ħ/2 (MMPn) | ESTABLISHED (quantum mechanics, the named channel) | MMPn, W2a, W2b |
| observation maps | observation, projection and boundary limits listed together as instances of one arrow | Quantum measurement, projection, marginalization, quotient / reduction, manifold boundary limits, coarse graining and parameter non-identifiability are different operations. Whether they share a deeper structural pattern is OPEN; it is NOT established that they are the same operation. | they differ in what they act on and in idempotence (MMPo) | OPEN (the shared pattern) | MMPo |
| story arrow statuses | arrow statuses in the seven-class vocabulary only | every arrow also carries a status in ESTABLISHED MATHEMATICS / PROJECT-DERIVED / STRUCTURAL ANALOGY / OPEN / PHILOSOPHICAL / HISTORICAL INTUITION; cross-links and the viewer intuition included | Nadia's precision decision (2026-11-15) | GOVERNANCE | — |
| zero / null governance | five null kinds | nine kinds kept distinct: J_Y v = 0, zero Fisher length (equivalent only under its hypothesis), sloppy (not a null), Lorentz null, bilinear null, collapsed zero, equal expectations, same-zero quantum example, symmetry-dependent distinction (independently supplied symmetry only) | no one type of nullity is universal | GOVERNANCE | MMPd, MMPe |
| C7 target | "One recommendation: hyperribbon widths." | C7 requires an explicitly defined geometric width object; both Transtrum-style and Quinn-style notions are kept; five preconditions fixed before derivation. C7 is not "hyperribbon widths exist". T-C7 stays OPEN. | a width object was named before its definition was fixed, and widths were called parametrization-independent without separating proxies (MMPg) | OPEN (NOT READY FOR DERIVATION) | MMPg, MMIf |

Scope of the MMI card wording:

- **MMIa**: its "volume element √det g |dθ| IS invariant" means the full element √det g_θ dθ¹⋯dθⁿ; √det g alone is not (MMPf).
- **MMIc**: "the kernel is invariant" holds for positive-definite weights (MMPd).
- **MMIe**: the null direction survives a change between fixed positive-definite weights; not a θ-dependent noise law (MMPe).
- **MMIf**: "Widths are parametrization-independent" holds for widths defined from the image set (here a 1-D total length); widths along chart FIM eigendirections are chart-dependent (MMPg).
- **MMIg**: "the dimension drops from 2 to 1" is a result of the F-C example and that limit (MMPl).
- **MMIh**: g_ij = 2/(θᵢ + θⱼ)³ is the metric of that specific model (MMPk).
- **MMIi**: "different finite c are related by a change of units (R1), so the invariant content is the signature" is a statement about the matrix representation (Role 1); it does not remove the invariant physical role of c (Role 2) (MMPm).

## The story, arrow by arrow

**CHAIN-1** (T-MM-STORY): "larger prediction / possibility space → rules constrain an allowable manifold → representations expose different aspects of it → observation / reduction may expose an accessible manifestation → ask what geometry and information survive"

| # | From | To | Status (2026-11-15) | Also | Row class (2026-11-13) | Exact object | Cards | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | larger prediction / possibility space | rules constrain an allowable manifold | ESTABLISHED MATHEMATICS | PROJECT-DERIVED | ESTABLISHED MATHEMATICS / PROJECT-DERIVED CONNECTION | M = Y(Θ) ⊆ P: the model rule Y and the parameter domain Θ fix the model image (the allowable family) inside the prediction space P (finite ℝᵐ, or a function space, MMIh); a smooth manifold only on regular regions (MMPa) | MMIh, MMPa, MMIg, FB11c | the definition is established; reading Y and Θ as the "rules" is the project connection (T-MM-RULES) |
| 2 | rules constrain an allowable manifold | representations expose different aspects of it | PROJECT-DERIVED | — | PROJECT-DERIVED CONNECTION | charts (R1: g_φ = Aᵀ g_θ A), prediction-space metrics (Σ) and embeddings: components, eigenvalues and singular values change; rank, nullity (for fixed positive-definite Σ⁻¹), lengths, the volume element and curvature do not change under charts; widths only when defined from the image set (MMPg) | MMIa, MMIb, MMIc, MMId, MMPc, MMPf, MMPg | which aspect is exposed depends on the representation; what is geometric is what survives every chart |
| 3 | representations expose different aspects of it | observation / reduction may expose an accessible manifestation | OPEN | — | OPEN CONNECTION | exact only for named maps: a boundary limit (a family degeneration, MMIg), a projection (RIC1a), the non-selective S² measurement D(ρ) = P_t ρ P_t + P_s ρ P_s on \|ud⟩ (W2a, MMPn) | MMIg, RIC1a, W2a, MMPn | these are different operations (MMPo); no single construction of "observation" covers them; the general arrow stays OPEN (T-MM-OBSERVE) |
| 4 | observation / reduction may expose an accessible manifestation | ask what geometry and information survive | PROJECT-DERIVED | OPEN | PROJECT-DERIVED CONNECTION / OPEN CONNECTION | the seven Reduction / Information-Changing questions per map (survives, collapses, zero, lost, reconstructible, fibers, symmetry) | RIC1a, W2a, MMIg | answered per map; no general law of what survives (OPEN) |

**CHAIN-2** (T-MM-STORY): "possibility / prediction space → rules constrain an allowable manifold → geometry organizes distinguishability → observation/reduction exposes an accessible manifestation → ask what survives, disappears, or becomes observable"

| # | From | To | Status (2026-11-15) | Also | Row class (2026-11-13) | Exact object | Cards | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | possibility / prediction space | rules constrain an allowable manifold | ESTABLISHED MATHEMATICS | PROJECT-DERIVED | ESTABLISHED MATHEMATICS / PROJECT-DERIVED CONNECTION | M = Y(Θ) ⊆ P (model image) | MMIh, MMPa | as in chain 1 |
| 2 | rules constrain an allowable manifold | geometry organizes distinguishability | ESTABLISHED MATHEMATICS | — | ESTABLISHED MATHEMATICS / PAPER-BACKED RESULT | locally, for a fixed positive-definite Σ⁻¹: the Fisher length √(dθᵀ g_θ dθ) is the prediction-space distance per unit noise (MMId) and g(v, v) = 0 ⟺ J_Y v = 0 marks first-order indistinguishable directions (FB7b, MMPd); globally: a width hierarchy (paper-backed; definition open, MMPg) | MMId, FB7b, MMPd, MMIf | local statement ESTABLISHED MATHEMATICS under its hypothesis; the global width hierarchy PAPER-BACKED RESULT, with the width object still to be fixed |
| 3 | geometry organizes distinguishability | observation/reduction exposes an accessible manifestation | OPEN | — | OPEN CONNECTION | as in chain 1, arrow 3 | W2a, MMIg, MMPo | OPEN in general |
| 4 | observation/reduction exposes an accessible manifestation | ask what survives, disappears, or becomes observable | PROJECT-DERIVED | OPEN | PROJECT-DERIVED CONNECTION / OPEN CONNECTION | per map: survives / is lost (IC questions); "becomes observable": after the non-selective S² measurement the S² outcomes are defined while the triplet–singlet coherence is gone (W2b, MMPn) | W2b, RIC1a, MMPn | "becomes observable" is exact for the named quantum channel only |

Cross-links (not arrows of the chain):

| Link | Status | Cards | Note |
|---|---|---|---|
| c → ∞ (theory family) ↔ model-parameter limits (model family) | STRUCTURAL ANALOGY | C9b, MMPm, MMIg, MMPl | both families have degenerate limits; transfer of c's invariant role to model geometry is OPEN |
| same-zero quantum states ↔ observationally indistinguishable parameters | STRUCTURAL ANALOGY | Q1d, Q2b, FB7a, MMPb | no explicit map between the two |
| quantum measurement, projection, marginalization, quotient, boundary limits, coarse-graining, non-identifiability: one pattern? | OPEN | MMPo | It is NOT established that they are the same operation |
| "matter does not form until a viewer looks at it." | PHILOSOPHICAL / HISTORICAL INTUITION | — | historical / project provenance only; not established physics |

**Historical intuition** (T-VIEWER-FORM): "matter does not form until a viewer looks at it." Status: PHILOSOPHICAL / HISTORICAL INTUITION (PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS). Labels: ORIGINAL USER INTUITION; PHILOSOPHICAL / QUANTUM-INTERPRETIVE; NOT ESTABLISHED PHYSICS; ORIGINAL VERBATIM NOT RECOVERED (recorded as given, 2026-11-13, "approximately"); HISTORICAL / PROJECT PROVENANCE ONLY (2026-11-15).

Normalized question (kept beside it, not replacing it): "What changes when a richer state/representation becomes an observable manifestation?"

Investigable forms: "What changes when a richer state or representation is mapped to an observable manifestation?" "Which structures survive a specified map, reduction, observation, quotient, projection, or limit?"

conscious observer requirement = NOT ESTABLISHED.

Investigable part: which maps from a richer state to an observable manifestation exist, and what each keeps, removes or makes available (T-MM-OBSERVE; exact instances W2a, W2b, RIC1a, MMIg).

## Model image, parameters, notation

- M = Y(Θ) ⊆ P is the model image / model set, in full generality; it may be called a smooth model manifold on a regular region only: constant local rank and local injectivity (immersion plus embedding-type conditions).
  - rank loss: F-C on the diagonal θ₁ = θ₂ (rank J_Y = 1); the cusp (θ², θ³) at θ = 0 (MMPa, MMPb, CFT5b)
  - non-identifiability: F-C: Y(1, 2) = Y(2, 1); Y = e^{−(θ₁+θ₂)t} depends on θ₁ + θ₂ only (MMPb, FB7a)
  - self-intersection: the node (θ² − 1, θ³ − θ): an immersion with Y(1) = Y(−1) (MMPa)
  - singular stratum: the cusp (θ², θ³) at the origin (MMPa)
  - boundary / limiting stratum: the edge of the F-C image from the interior diagonal (MMPj); the θ₂ → ∞ face (MMIg) (MMPj, MMIg)
- θ ∈ Θ is a parameter value in parameter space; Y(θ) is the corresponding prediction / model point. Parameters: parameters parameterize the model image; they give local coordinates only where the parameterization is locally regular and locally identifiable; different parameter values may represent the same prediction (F-C: Y(1, 2) = Y(2, 1)). Project interpretation, kept: the model rule Y and the parameter domain Θ constrain the allowable family (T-MM-RULES); this is not a differential-geometric coordinate claim (MMPb).
- Notation: J_Y = ∂Y/∂θ, the prediction (model) Jacobian; A = ∂θ/∂φ, the Jacobian of a reparametrization θ = θ(φ); g_θ = J_Yᵀ Σ⁻¹ J_Y (Gaussian noise with a fixed covariance Σ); g_φ = Aᵀ g_θ A. g is one symmetric (0,2)-tensor on Θ; g_θ and g_φ are its component matrices in two charts. The components change; the tensor does not (MMPc). Note: earlier records (CF13, BR41, the Transformation Architecture) write the coordinate-change Jacobian as J in g_φ = Jᵀ g J; there J = ∂θ/∂φ = A, not J_Y.
- Null directions: g(v, v) = vᵀ J_Yᵀ Σ⁻¹ J_Y v = (J_Y v)ᵀ Σ⁻¹ (J_Y v); for positive-definite Σ⁻¹, g(v, v) = 0 ⟺ J_Y v = 0. Hypothesis: Σ⁻¹ positive definite (and Σ fixed, not θ-dependent). Fails: a singular observation weight: J_Y v ≠ 0 with g(v, v) = 0 (MMPd); a θ-dependent noise law: J_μ v = 0 with g(v, v) = 1/2 (MMPe).
- Noise model (restricted theorem): For g = J_Yᵀ Σ⁻¹ J_Y with a fixed positive-definite Σ⁻¹: ker g = ker J_Y and rank g = rank J_Y. Changing one positive-definite weighting to another does not change those null directions / rank. Not claimed for: singular observation metrics (MMPd); parameter-dependent covariance: the full Fisher information must be computed (MMPe); noise laws that contribute additional Fisher terms (MMPe: ∇s∇sᵀ/(2s²)).
- Volume: the invariant object is the full element √det g_θ dθ¹⋯dθⁿ (= √det g_φ dφ¹⋯dφⁿ); not invariant: det g (×(det A)²), √det g alone (×|det A|) (MMPf).
- Function-space example: g_ij = 2/(θᵢ + θⱼ)³ is the Fisher metric of the specific continuous-output model Y(T) = e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞) (white noise per unit time); not a general formula; the linear model θ₁e^{−T} + θ₂e^{−2T} in the same space has the constant metric [[1/2, 1/3], [1/3, 1/4]]. dim P = ∞, while dim M = 2 (< ∞). A prediction space can be infinite-dimensional while the model image itself remains finite-dimensional.

## Boundary language

| Notion | Object | Chart-dependent? | Example | Cards |
|---|---|---|---|---|
| boundary of the parameter domain ∂Θ | ∂Θ as a subset of parameter space (or of a compactification) | yes | θ₂ = 0 is a finite boundary point in θ but lies at λ₂ → −∞ in λ = log θ | MMPi |
| limiting behaviour of parameters | a family θ(r) with, e.g., θᵢ → ∞ | yes | θ₂ → ∞ in F-C; θ₁ = θ₂ = r → ∞ (a different limit with a different image) | MMIg, MMPl |
| image of a limit in prediction space | lim Y(θ(r)) in P, when it exists | no | e^{−θ₁t} (θ₂ → ∞); 0 (θ₁ = θ₂ → ∞); no limit for Y = e^{−θ₁t} + θ₂t | MMIg, MMPl, MMPi |
| limiting boundary stratum / reduced-model boundary (MBAM sense) | a lower-dimensional limiting model family in P reached as parameters approach appropriate limits | no | the one-exponential family as a face of F-C; MBAM reaches such faces along geodesics (source-only) | MMIg, FB11c |
| ordinary topological boundary of Y(Θ) in P | closure minus interior of the set Y(Θ) in P | no | for dim M < dim P the interior is empty, so this boundary is the whole closure (MMPi); an edge of the image can come from interior rank-drop points (MMPj) | MMPi, MMPj |

- These five are not automatically identical.
- A model-manifold boundary can arise as a limiting/degenerate model family in prediction space as parameters approach appropriate limits.
- Not every parameter-domain boundary gives a distinct model-manifold boundary (MMPi).
- Not every model-manifold boundary should be described as an ordinary finite boundary point in parameter coordinates (MMPi, MMPj).

## Widths

Do not merge these categories: geometric widths (A) may be reparametrization-invariant; coordinate-dependent proxies (B) are not in general.

**A. Geometric widths (kept for C7):**
- Transtrum-style geodesic widths (SRC-TMS-2011): widths of the model image measured along geodesics in prediction space (TMS 2010/2011; snippet-level). Invariance: potentially reparametrization-invariant if the start point and directions are fixed geometrically in prediction space; chart-dependent if the directions are a chart's FIM eigendirections (MMPg). The exact operational definition must come from the source text.
- Quinn-style enclosing-hyperellipsoid widths / bounds (SRC-QUINN-2019): widths of a hyperellipsoid enclosing the model image, bounded through Chebyshev approximation (geometric decay for analytic models). Invariance: potentially reparametrization-invariant: built from the image set in P with a fixed metric; depends on the prediction metric, the outputs and the input interval of the Chebyshev construction. The exact definition must come from the source text.
- Carded illustration: total length of a 1-D model image: carded: chart-independent, metric-dependent (MMIf).

**B. Coordinate-dependent proxies (not invariant in general):**
- raw FIM eigenvalues (MMIb, CFT5e)
- raw Hessian eigenvalues (MMPh)
- prediction-Jacobian singular values (MMIc)
- parameter-coordinate axis lengths
- condition number (MMIb)
- widths taken along a chart's FIM eigendirections (MMPg)
- any width defined directly from a chosen parameter chart unless proved otherwise

## Story table

| Idea | Exact mathematical object | Established / paper result | Project connection | Project hypothesis | Quantum-like / philosophical extension | What would falsify / weaken | Status | Cards | Registry |
|---|---|---|---|---|---|---|---|---|---|
| Prediction space | P = ℝᵐ for m outputs with metric Σ⁻¹; for a continuously indexed output with a stated inner product, a function space (L²). Not the parameter space Θ. | TMS 2010/2011 (data space); for the specific model e^{−θ₁T} + e^{−θ₂T} in L²(0, ∞) the Fisher metric is g_ij = 2/(θᵢ + θⱼ)³ (MMIh; example-specific, MMPk) | "infinite prediction space" is exact as a function space: dim P = ∞ while dim M < ∞ (T-PREDICTION-INFINITE) | the larger space carries structure that one projection does not show (Interactive Master Map, Stage IV) | not a quantum state space; not physical spacetime | none for the definition; the infinite reading needs a stated inner product | ESTABLISHED MATHEMATICS | MMIh, MMPk | T-PREDICTION-INFINITE |
| Model image / model manifold | M = Y(Θ) ⊆ P, the model image (a set) in general; a smooth model manifold only on a regular region (constant local rank, locally injective). Rank loss, non-identifiability, self-intersections, singular strata and boundary strata can occur (MMPa, MMPb, MMPj). Induced metric g_θ = J_Yᵀ Σ⁻¹ J_Y | TMS 2010/2011; Quinn et al. 2023 (review) | "allowable manifold": the set of predictions the rules permit (an allowable family / image) | rules constrain a geometry of allowed states (T-RULES-GEOMETRY, open) | — | none for the definition; any statement that treats Y(Θ) as a smooth manifold must state its regular region | ESTABLISHED MATHEMATICS | MMPa, MMPj, MMIg, MMIh | T-INFOGEO, T-MM-STORY |
| Parameters vs model rule vs image | model rule Y (functional form); parameter domain Θ; parameter values θ ∈ Θ; predictions Y(θ); image M = Y(Θ). Parameters parameterize the image and give local coordinates only where the parameterization is locally regular and locally identifiable (MMPb); different θ may give the same prediction | local coordinates from an immersion that is locally injective (Lee 2018; Amari 2016) | "the rules of the manifold were the model parameters." Unpacked: Y and Θ fix the allowable image; θ is a parameter value, a local coordinate only on regular identifiable regions; parameter limits can produce limiting strata of the image (T-MM-RULES, DERIVED) | governing rules play a broader role in allowable geometry (T-MM-RULES-Q) | — | a feature of the image that depends on the chart would contradict the unpacking (none: MMIa, MMIf, MMPf) | PROJECT-DERIVED CONNECTION | MMPb, MMIa, MMIf, MMIg | T-MM-RULES, T-MM-RULES-Q |
| Fisher metric | g_θ = J_Yᵀ Σ⁻¹ J_Y with J_Y = ∂Y/∂θ (fixed Σ): the component matrix of a symmetric (0,2)-tensor on Θ, the pullback of the prediction-space metric. Under θ = θ(φ), A = ∂θ/∂φ: g_φ = Aᵀ g_θ A (R1, MMPc); an isometry F*g = g (R2) exists only when the system supplies it | Rao 1945; Amari 2016; FB6a/FB6b; CFT4c and MMPc (R1 checked) | placed in the Transformation Architecture: reparametrizations R1, isometries R2 (TA0) | — | — | a reparametrization reported as "g unchanged" (false for components) | ESTABLISHED MATHEMATICS | FB6a, FB6b, CFT4c, MMPc | T-INFOGEO |
| Null directions | g(v, v) = (J_Y v)ᵀ Σ⁻¹ (J_Y v); for positive-definite Σ⁻¹ (and fixed Σ), g(v, v) = 0 ⟺ J_Y v = 0 ⟺ g v = 0. Fails for a singular weight (MMPd) and for a θ-dependent noise law (MMPe). Kept apart: sloppy (λ small, nonzero), Lorentz null (vᵀηv = 0, ηv ≠ 0), bilinear null, collapsed zero, equal expectations, same-zero quantum states, symmetry-dependent distinctions | FB7a–FB7d; Amari 2016 (singular regions); MMPd | "a zero geometric length can expose hidden non-identifiability / redundancy." (T-ZERO-LENGTH, DERIVED under the hypothesis); survives charts (CFT5d) and a change between fixed positive-definite weights (MMIe, MMPe) | — | observable zero does not uniquely specify underlying state (T-QUANTUM-ZERO): a STRUCTURAL ANALOGUE, no map given | a zero-length direction along which predictions change (impossible for positive-definite fixed Σ⁻¹; possible otherwise, MMPd) | ESTABLISHED MATHEMATICS | FB7a, FB7b, FB7c, FB7d, CFT5d, MMIe, MMPd, MMPe | T-ZERO-LENGTH |
| Sloppy directions | small nonzero eigenvalues of g in a stated chart; the raw spectrum is chart-dependent (MMIb, CFT5e). Invariant candidates: a geometric width hierarchy defined from the image (definition open, MMPg) or generalized eigenvalues of g relative to a system-supplied tensor h | Gutenkunst et al. 2007; TMS 2010; S14b (weak); S14a FAIL kept | M1 restated: the spectrum is a statement in log-parameter coordinates | — | — | already weakened: raw eigenvalues are not geometric invariants (NEGATIVE result for any raw-spectrum comparison) | FAILED / NEGATIVE RESULT | MMIb, CFT5e, S14b, S14a | T-INFOGEO, T-C7 |
| Hyperribbon widths | two width notions kept: Transtrum-style geodesic widths of the image (TMS 2011) and Quinn-style enclosing-hyperellipsoid widths / bounds, decaying geometrically for analytic models (Quinn et al. 2019). Either may be reparametrization-invariant when defined from the image set with a fixed prediction metric; widths taken along a chart's FIM eigendirections are not (MMPg). Exact definitions to be fixed from the source text | TMS 2010/2011; Quinn, Wilber, Townsend, Sethna 2019 | C7 needs an explicitly defined geometric width object (T-C7, preconditions); both notions kept | C7: a structural relation between coefficient decay and a coordinate-independent width hierarchy (T-C7, OPEN) | — | a width definition that changes with the chart; a C7 result that reduces to Quinn 2019 (then VALIDATION OF KNOWN MATHEMATICS) | PAPER-BACKED RESULT | MMIf, MMPg | T-C7, T-INFOGEO |
| Manifold boundaries / limiting strata | five objects kept apart: ∂Θ; parameter limits (e.g. θᵢ → ∞); their images in P; limiting boundary strata (MBAM sense); the topological boundary of Y(Θ) in P. A model-manifold boundary can arise as a limiting / degenerate model family in P as parameters approach appropriate limits (MMIg, MMPi, MMPj, MMPl) | Transtrum–Qiu 2014; FB11c; MMIg | simpler structure as a boundary of a richer model (T-SIMPLER-BOUNDARY-Q) | — | — | treating every parameter-domain boundary as an image boundary (fails: MMPi) or a dimension drop as general (fails: MMPl) | PAPER-BACKED RESULT | MMIg, FB11c, MMPi, MMPj, MMPl | T-SIMPLER-BOUNDARY-Q |
| Effective models | the boundary model (e.g. e^{−θ₁t}); MBAM reaches it along a geodesic. In the Reduction architecture a limit is a degeneration of the family, not a map Φ: X → Y on states | Transtrum–Qiu 2014 (MBAM, source-only); Machta et al. 2013 | H6 / T-EFFECTIVE-Q examples; what survives: θ₁ (FB11c) | effective representations follow a general law (H6, OPEN) | — | an effective model not reachable as any boundary (would bound the reading; MBAM source-only) | PAPER-BACKED RESULT | FB11c, MMIg | T-EFFECTIVE-Q, T-SIMPLER-BOUNDARY-Q |
| Larger possibility space | P ⊋ M (the ambient contains predictions no parameter value reaches); a source X → reduced Y (Φ) | the strict inclusion is definitional; dim P = ∞ with dim M = 2 for the function-space example (MMIh, MMPk) | "A mathematical space can contain more structure than a single visible projection reveals." (Stage IV carry-forward) | the larger possibility space is the right frame for the project (T-MM-STORY) | quantum-like possibility space (row quantum-like) | a system where the ambient adds nothing beyond M (would weaken the frame there) | PROJECT HYPOTHESIS | MMIh, MMPk | T-MM-STORY, T-PREDICTION-INFINITE |
| Observation / manifestation | a named information-changing map Φ: X → Y; quantum: the non-selective S² measurement D(ρ) = P_t ρ P_t + P_s ρ P_s, which removes the triplet–singlet coherence of \|ud⟩ and keeps S_z = 0 because [P_t, S_z] = [P_s, S_z] = 0 (MMPn) | W2a, W2b, MMPn (established quantum mechanics); RIC1a (projection) | observation as a map to a restricted manifestation (T-MM-OBSERVE, OPEN); measurement, projection, marginalization, quotient, limits, coarse-graining and non-identifiability are different operations (MMPo) | — | "matter does not form until a viewer looks at it." (T-VIEWER-FORM: historical / project provenance; NOT ESTABLISHED PHYSICS); conscious observer requirement = NOT ESTABLISHED | a measurement whose effect is not representable as such a map (none known); for the viewer intuition: physical theory or data, not a construction | OPEN CONNECTION | W2a, W2b, RIC1a, MMPn, MMPo | T-MM-OBSERVE, T-VIEWER-FORM |
| Connection to c / governing rules | three roles of c kept apart: (1) representation: η_c = P_cᵀ diag(1, −1) P_c, P_c = diag(1, 1/c), for the stated matrix form; (2) invariant: Λ_cᵀ η_c Λ_c = η_c and the light cone in Lorentzian spacetime; (3) theory family: c → ∞ gives the degenerate limiting bilinear form diag(1, 0) (C9b, MMPm). Model side: in F-C, θ₂ → ∞ gives a 1-dimensional face (example-specific, MMPl) | C9a, C9b; Quinn et al. 2023 treat c as a model parameter whose c → ∞ boundary gives Newtonian kinematics (snippet-confirmed, PDF pending) | theory-family singular limit: STRUCTURAL ANALOGY with model-family limits (T-RULES-GEOMETRY) | rules constrain a geometry of allowed states (T-RULES-GEOMETRY, open); the two roles of c (T-C-ROLES) | — | transfer of the invariant role to arbitrary model-manifold geometry is OPEN; diag(1, 0) is not by itself the Newtonian metric; the general phrase is too weak | OPEN CONNECTION | MMPm, MMIi, C9a, C9b, MMIg, MMPl, CFT5f | T-RULES-GEOMETRY, T-C-ROLES, T-MM-DISTINGUISHED-Q |
| Quantum-like possibility space | a state space (density matrices on ℂ⁴ for two spins) and an observable; the S_z = 0 eigenspace is 2-dimensional, so a zero value does not fix the state (Q1a–Q1d) | Q1a, Q1c, Q1d, Q2b (established quantum mechanics) | same zero ↔ observationally indistinguishable parameters: STRUCTURAL ANALOGUE / OPEN CONNECTION (no explicit map between the two) | — | a richer state becoming an observable manifestation (T-VIEWER-FORM, normalized question) | an explicit map showing the two indistinguishabilities differ in kind (would bound the analogue) | PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS | Q1a, Q1c, Q1d, Q2b | T-QUANTUM-ZERO, T-VIEWER-FORM |
| Measurement / reduction | the Reduction / Information-Changing Architecture (RI0): for each map, what survives, collapses, becomes zero, is lost, is reconstructible, the fibers, symmetry. The maps are different operations (MMPo) | RIC1a–RIC1d, W2a, W3a, MMPo (instances) | model-manifold boundaries join as limits (MMIg), the named S² channel as a map (W2a, MMPn) | transform vs reduce governs the project (T-TRANSFORM-REDUCE, open); whether the operations share a deeper pattern (open) | measurement as reduction (T-MM-OBSERVE) | a reduction where the seven questions cannot be posed | PROJECT-DERIVED CONNECTION | RIC1a, W2a, MMIg, MMPo | T-REDUCTION-ARCH, T-TRANSFORM-REDUCE |
| Information loss / distinguishability | for fixed positive-definite Σ⁻¹: Fisher length = local distinguishability per unit noise (MMId); fibers Y⁻¹(y) = parameters with identical predictions; information distinctions below | Rao 1945; Amari 2016; FB7b; MMId; MMPd | geometry encodes accessible / inaccessible / indistinguishable information (T-GEOM-INFO-Q, open) | — | what the geometry says about distinguishability in quantum measurement (open) | two parameter values with zero Fisher distance but distinguishable predictions (impossible locally for positive-definite fixed Σ⁻¹) | ESTABLISHED MATHEMATICS | MMId, FB7b, FB7a, MMPd | T-GEOM-INFO-Q |
| Representations expose different aspects | charts, noise metrics, embeddings: what changes (entries, det, √det g alone, raw Fisher / Hessian eigenvalues, condition number, singular values, chart-defined widths) and what stays under charts (rank, nullity for fixed positive-definite Σ⁻¹, length, the volume element, curvature, image-defined quantities) | Lee 2018 (tensor law); MMIa–MMId; MMPc, MMPf–MMPh | arrow 2 of the story (T-MM-STORY) | — | — | a "geometric" claim that rests on a chart-dependent number (MMIb, MMPg show how it fails) | PROJECT-DERIVED CONNECTION | MMIa, MMIb, MMIc, MMId, MMPc, MMPf, MMPg, MMPh | T-MM-STORY |
| Raw FIM eigenvalue spectrum as C7's object | eigenvalues of the component matrix g in one chart | CFT5e, MMIb (not invariant) | C7 compared coefficient decay with this spectrum (BR28) | — | — | already failed as a geometric object: it changes with units and charts | FAILED / NEGATIVE RESULT | MMIb, CFT5e | T-C7 |

## Zero / null kinds, kept distinct

No one type of nullity is universal. A symmetry enters only if the system supplies it independently (B-INDEPENDENT-SYMMETRY).

| Kind | Law | Cards |
|---|---|---|
| local non-identifiability | J_Y v = 0 (first-order predictions unchanged along v) | FB7a, MMPb |
| zero Fisher length | g(v, v) = (J_Y v)ᵀ Σ⁻¹ (J_Y v) = 0; equivalent to J_Y v = 0 exactly when Σ⁻¹ is positive definite and fixed (MMPd, MMPe) | FB7b, MMPd, MMPe |
| sloppy direction (not a null) | g(v, v) > 0 but small relative to other directions in a stated chart | FB7c |
| Lorentz null | vᵀηv = 0 with ηv ≠ 0 (indefinite form) | FB7d |
| bilinear-form null | B(u, v) = 0 for nonzero u, v (orthogonality) | TRA2a |
| collapsed zero | Φ(x) = 0 with x ≠ 0 for a non-injective Φ | RIC1a, RIC2c |
| equal expectation values | ⟨O⟩_ρ = ⟨O⟩_σ with ρ ≠ σ | W3a, W2c |
| same-zero quantum example | S_z ψ = 0 on a 2-dimensional eigenspace: the zero value does not fix the state | Q1c, Q1d |
| symmetry-dependent distinction | states sharing a zero separated by an independently supplied symmetry (exchange parity; S₄ sectors), never one chosen after the conclusion | Q2d, FS2b |

## Quantum measurement: the named channel

- Channel: non-selective projective measurement of total spin S², D(ρ) = P_t ρ P_t + P_s ρ P_s.
- Observable: S², with spectral projectors P_t (triplet) and P_s (singlet).
- Pre-measurement state: ρ = |ud⟩⟨ud|, |ud⟩ = (|1,0⟩ + |0,0⟩)/√2 (S_z = 0).
- Removed: the off-diagonal terms ⟨1,0|ρ|0,0⟩ = ⟨0,0|ρ|1,0⟩ = 1/2: the coherence between the triplet and singlet eigenspaces.
- Preserved: S_z = 0, because [P_t, S_z] = [P_s, S_z] = 0 and S_z ρ = 0 give S_z D(ρ) = 0.
- Not generic: the non-selective S_x⁽¹⁾ measurement on the same state gives Tr(S_z E(ρ)) = −ħ/2: preservation is not generic.
- Generic safe form: A non-selective projective measurement in a specified basis removes coherence between the measured eigenspaces. Preservation of a quantity such as S_z requires the relevant state/channel/observable relation to be checked explicitly.

## Observation-type operations, kept distinct

| Operation | What it is | Property | Cards |
|---|---|---|---|
| quantum measurement | a channel on density matrices (D(ρ) = Σₖ PₖρPₖ for a named observable) | idempotent; not induced by any map on state vectors (purity 1 → 1/2) | MMPn, MMPo, W2a |
| projection | a linear map on vectors (Pₙ = I − 11ᵀ/n) | idempotent; fibers x + ker Pₙ | RIC1a, MMPo |
| marginalization | a linear map from joint distributions to marginals (a different space) | many-to-one (different joints, equal marginals) | MMPo |
| quotient / reduction | the map to equivalence classes (fibers Φ⁻¹(y)) | defined by its fibers | RIC1a, RIC1b |
| manifold boundary limit | a limit of a model family, not a map on states | the image of a stated limit; depends on the model and the limit | MMIg, MMPi, MMPl |
| coarse graining | a map on couplings (decimation: tanh K′ = tanh²K) | not idempotent | FB11d, MMPo |
| parameter non-identifiability | a property of Y: fibers Y⁻¹(y) in parameter space | not an operation at all | FB7a, MMPb |

The open research question is whether they share a deeper structural pattern. It is NOT established that they are the same operation.

## Manifestation terminology

| Term | Meaning | Status | Example |
|---|---|---|---|
| mathematical manifestation | the image Φ(x) of a stated map, or the boundary model reached by a stated limit | ESTABLISHED MATHEMATICS | Pₙx (RIC1a); e^{−θ₁t} as the θ₂ → ∞ face of F-C (MMIg) |
| observable manifestation | what a stated measurement returns: outcomes and the post-measurement state | ESTABLISHED MATHEMATICS | after the non-selective S² measurement on \|ud⟩: outcomes 2ħ² and 0, triplet–singlet coherence gone (W2a, W2b, MMPn) |
| physical manifestation | physical coming-into-form, the subject of the historical intuition | PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS | none: needs physical theory or data (T-PHYSICAL-MANIFEST-Q, T-VIEWER-FORM) |

Connected to the Reduction architecture's source / manifestation question (T-SOURCE-MANIFEST).

## Transformation Architecture placement

| Level | Model-manifold placement |
|---|---|
| R1 | reparametrizations (charts): g_φ = Aᵀ g_θ A with A = ∂θ/∂φ; rank, nullity, lengths, the volume element, curvature and image-defined quantities invariant (MMIa–MMId, MMPc, MMPf, CFT4c) |
| R2 | isometries F*g = g only when the system supplies them (F-C exchange CFT5a; location–scale CFT4d); none in general (CFT5f) |
| R3 | none claimed: no operator compatibility is carded for model manifolds in this audit |
| outside | a change of noise model Σ changes the metric itself (MMIe), and a θ-dependent noise law adds Fisher terms (MMPe): not R1, R2 or R3; a boundary limit is a family degeneration (Reduction architecture), not a transformation |

## c: three roles (2026-11-15)

Registry: T-RULES-GEOMETRY.

| Role | Statement | Status | Cards | Note |
|---|---|---|---|---|
| Role 1 — representation/coefficient role | in the matrix representation η_c = diag(1, −1/c²) on (t, x), a finite nonzero c can be normalized: η_c = P_cᵀ diag(1, −1) P_c with P_c = diag(1, 1/c) (a rescaling of x) | ESTABLISHED for the stated form | MMIi, MMPm | a statement about a representation; it does not prove that physical c has no invariant significance |
| Role 2 — invariant geometric/physical role | in Lorentzian spacetime c participates in the invariant relationship between temporal and spatial structure and in the causal / light-cone structure: Λ_cᵀ η_c Λ_c = η_c | ESTABLISHED PHYSICS in its native setting | C9a, S5c | not claimed to have transferred to arbitrary model manifolds; kept as the original comparison being investigated |
| Role 3 — theory-family / singular-limit role | varying c between theories, c → ∞ is a singular theory limit: η_c → diag(1, 0), a degenerate limiting bilinear form (rank 1, zero on every purely spatial displacement); no change of representation within one finite-c form reaches it; the boost generator contracts to a shear | STRUCTURAL ANALOGY worth preserving | C9b, C9c, C9d, MMPm | diag(1, 0) is not by itself "the Newtonian metric": Galilean / Newton–Cartan structure requires more than this rank-one limit. Model-side comparison: in F-C, θ₂ → ∞ gives a 1-dimensional face; that dimension drop is a result of the specific example (MMPl) |
| Transfer to arbitrary model-manifold geometry | whether Role 2 or Role 3 has a counterpart for model parameters in general | OPEN | CFT5f, MMPl | a generic model image is not homogeneous (CFT5f); parameter limits differ by model and limit (MMPl) |
| Universal "rules constrain states" interpretation | every constraint restricts a set of allowed states | TOO WEAK by itself | — | it distinguishes nothing without a stated invariant or limit |

Superseded verdict (2026-11-13, kept): **STRUCTURAL CONNECTION**, restricted to the parameter-limit → degenerate-boundary role only; a parameter limit is a degenerate boundary (rank drop): STRUCTURAL CONNECTION; c as the invariant of a form (structure constant): FAIL; "rules constrain allowed states", stated generally: TOO WEAK. Superseded on 2026-11-15: collapsed distinct roles of c: a representation-level normalization (Role 1) was read as removing the invariant role (Role 2); the rank-drop comparison generalized one example (MMPl).

## Information distinctions

| Term | Exact object | Geometry | Cards | Not the same as |
|---|---|---|---|---|
| Shannon information | entropy H(p) = −Σ p log p of an outcome distribution (mutual information between variables) | not a metric on parameters; not carded | — | Fisher information |
| Fisher information | g = E[∂ℓ ∂ℓᵀ]; = J_Yᵀ Σ⁻¹ J_Y for Gaussian noise with fixed Σ (a θ-dependent covariance adds terms, MMPe) | the induced metric of the image on regular regions; chart covariance R1 (MMPc) | FB6a, FB6b, MMIa, MMPe | Shannon entropy; identifiability (global) |
| parameter identifiability | injectivity of Y on Θ (global); rank J_Y = dim Θ (local, first order) | fibers Y⁻¹(y); null directions g(v, v) = 0 (positive-definite fixed Σ⁻¹) | FB7a, FB7b, MMPb | sloppiness (identifiable but poorly constrained) |
| prediction sensitivity | J_Y = ∂Y/∂θ | chart-dependent components and singular values (MMIc); its kernel is invariant | MMIc | distinguishability (needs the noise metric) |
| observable distinguishability | distance in P per unit noise; locally the Fisher length (MMId) | lengths (chart-independent, noise-dependent); geometric widths when defined from the image | MMId, MMIf | identifiability (zero distance only along nulls) |
| reconstruction information | what Φ(x) determines about x under stated assumptions (fibers Φ⁻¹(y)) | Reduction architecture (IC questions) | G3b, G4c, RIC1a | Fisher information (local, parametric) |
| phase information | what \|x̂\| discards: equal power spectra, different signals | fibers of x ↦ \|x̂\| (not a subspace) | P1c, FB1d | Fisher information of a phase parameter |
| quantum information | density matrices; coherences ⟨A\|ρ\|B⟩; what a named measurement removes or makes available (MMPn) | not the Fisher metric of this audit; quantum Fisher information is not carded | W2a, W2b, Q1c, MMPn | classical identifiability |

## Spine instantiation (model manifolds)

| Spine stage | Model-manifold instance |
|---|---|
| OBJECT | a model rule Y: Θ → P with parameter domain Θ and a noise model Σ |
| REPRESENTATION | a parameterization θ of the model image (local coordinates only on regular identifiable regions); the prediction space P (ℝᵐ or L²) with metric Σ⁻¹ |
| RELATION | the Fisher metric g_θ = J_Yᵀ Σ⁻¹ J_Y (pullback of the prediction metric) |
| ZERO / BALANCE / NULL | for positive-definite fixed Σ⁻¹: g(v, v) = 0 ⟺ J_Y v = 0 (first-order non-identifiability, FB7b, MMPd); rank drop at a limit in the F-C example (MMIg) |
| TRANSFORMATION | R1 reparametrizations g_φ = Aᵀ g_θ A (MMPc); R2 isometries only when supplied (CFT5a, CFT4d); a change of noise model changes the metric (not R1, MMIe, MMPe); a boundary limit is a family degeneration, not a map |
| PRESERVED STRUCTURE | under charts: rank, nullity, null directions, lengths, the volume element, curvature, image-defined quantities. Not preserved: entries, det, √det g alone, raw Fisher / Hessian eigenvalues, condition number, singular values, chart-defined widths |
| GEOMETRY | the model image in P with its induced metric on regular regions; width hierarchy (definition open); limiting strata; curvature (not homogeneous, CFT5f) |
| INFORMATION | Fisher information (local distinguishability per unit noise); identifiability (fibers of Y) |
| DYNAMICS / CONTINUATION | geodesics to boundaries (MBAM, source-only); the c → ∞ degenerate limiting form (C9b, MMPm) |
| CROSS-SYSTEM TRANSFER | c (theory family) ↔ model-parameter limits (STRUCTURAL ANALOGY; transfer OPEN); same-zero quantum ↔ indistinguishable parameters (STRUCTURAL ANALOGY / OPEN); C7 (OPEN; preconditions) |
| APPLICATION | none (Energeo not begun) |

## C7: preconditions (no derivation)

Status: OPEN; NOT READY FOR DERIVATION. C7 requires an explicitly defined geometric width object before any invariant spectral-decay claim can be evaluated. C7 is not "hyperribbon widths exist": that is established literature (TMS 2010/2011; Quinn et al. 2019).

Candidate bridge: Fourier / spectral / coefficient decay ?⟹ coordinate-independent geometric width hierarchy. A possible chain: Fourier/spectral decay → approximation/coefficient decay → Quinn-style width bounds (NOT ESTABLISHED).

Width notions kept: Transtrum-style geodesic widths; Quinn-style enclosing-hyperellipsoid widths / bounds. Keep both Transtrum-style and Quinn-style width notions available until the next construction pass determines which one the proposed bridge can actually reach.

The next C7 pass must determine whether there is: an exact theorem; a bound; an implication under explicit assumptions; an asymptotic correspondence; a counterexample showing spectral decay alone is insufficient.

Preconditions before derivation:
1. the exact geometric width object
2. the prediction/noise metric
3. the class of models/functions
4. the exact spectral/coefficient-decay object
5. what the proposed result adds beyond Quinn et al. 2019 and existing approximation theory

Not C7's object:
- raw FIM eigenvalues: a coordinate-dependent proxy
- raw Hessian eigenvalues: a coordinate-dependent proxy
- prediction-Jacobian singular values: a coordinate-dependent proxy
- parameter-coordinate axis lengths: a coordinate-dependent proxy
- condition number: a coordinate-dependent proxy
- widths taken along a chart's FIM eigendirections: a coordinate-dependent proxy
- any width defined directly from a chosen parameter chart unless proved otherwise: a coordinate-dependent proxy
- generalized eigenvalues of (g, h): invariant, but needs a system-supplied reference tensor h; none is supplied

Superseded (2026-11-13, kept): "hyperribbon widths" (one recommended target object, with gates). Superseded on 2026-11-15: a single width object was named before its definition was fixed, and widths were stated as parametrization-independent without separating geometric widths from chart proxies (MMPg).

**Update, C7 pass 1 (2026-11-15).** The status and readiness above are the state before pass 1. Pass 1 fixed the five preconditions for a restricted class and reached principal status C7-KNOWN-REFORMULATION; the bridge holds as a RESTRICTED STRUCTURAL CONNECTION (sufficient, upper bound); C7 as first posed (Fisher spectra) stays OPEN. Record: `research/constructions/c7_fourier_width.md`.
1. width object: the Quinn-style enclosure W_j^bound (source-locked; Transtrum widths not used, T-TMS-WIDTHS)
2. metric: Euclidean on N samples; sup norm in function space
3. class: families on [−1, 1] with a family-wide summable coefficient envelope
4. decay object: r_k ≥ sup_θ |a_k(θ)| for the cosine-Fourier / Chebyshev coefficients
5. beyond Quinn 2019: reformulation only (x = cos φ, general envelope, zonotope form, exact axes at Chebyshev nodes, corrected Eq. (2) error term)

## Negative results

| Result | Status | Cards |
|---|---|---|
| raw FIM eigenvalues, condition number, determinant and Jacobian singular values are not coordinate invariants | stands | MMIb, MMIc, MMIa, CFT5e |
| C7 read as "coefficient decay vs raw Fisher eigenvalue decay" compares a chart-dependent number | stands | MMIb, CFT5e |
| the invariant-form role of c does not transfer to model parameters — withdrawn as too strong: MMIi shows a representation-level normalization only. What stands: no representation change reaches the c → ∞ form (MMPm) and a generic model image is not homogeneous (CFT5f). The transfer is OPEN | revised 2026-11-15 | MMIi |
| "rules constrain allowed states" stated generally is too weak to test | stands | — |
| a generic model manifold is not homogeneous: no group orbit plays the role of the Lorentz allowed set | stands | CFT5f, MMIi |
| a function-space prediction space does not make M infinite-dimensional | stands | MMIh, MMPk |
| a boundary limit is not a map on states: the Reduction architecture records it as a family degeneration | stands | MMIg, MMPo |
| no single construction of "observation" covers quantum dephasing, projection and boundary limits | stands | W2a, RIC1a, MMIg, MMPo |
| S14a stays FAIL (span 3.1 decades, threshold 4) | stands | S14a |
| widths taken along a chart's FIM eigendirections are chart-dependent | new 2026-11-15 | MMPg |
| the raw Hessian is not tensorial off a critical point; its eigenvalues are chart proxies | new 2026-11-15 | MMPh |
| zero Fisher length ≠ J_Y v = 0 without a positive-definite, θ-independent noise weight | new 2026-11-15 | MMPd, MMPe |
| a parameter → ∞ need not drop the dimension 2 → 1, nor give a boundary at all | new 2026-11-15 | MMPl |
| a parameter-domain boundary need not give an image boundary, and an image edge can come from interior parameter points | new 2026-11-15 | MMPi, MMPj |
| an immersion's image need not be a manifold (self-intersection); a rank drop can make a cusp | new 2026-11-15 | MMPa |

## Ratings (separate dimensions; no overall score)

| Dimension | Backbone Support | AI Slop Risk | Transfer Depth | Application Breadth | Status | Why | Change |
|---|---|---|---|---|---|---|---|
| Model-manifold established mathematics | 25% | 5% | TRIVIAL CONSEQUENCE | 3 | ESTABLISHED MATHEMATICS | definitions and textbook facts, carded on several model families (F-C, e^{−(θ₁+θ₂)t}, the one-exponential curve, the cusp and node, two function-space models), each under its stated hypothesis | — |
| Parameter / rule → allowable-manifold connection | 35% | 5% | TRIVIAL CONSEQUENCE | 2 | PROJECT-DERIVED CONNECTION | exact in the definitional sense M = Y(Θ); parameters are local coordinates only on regular identifiable regions; parameter limits give limiting strata, not "the boundaries"; adds the word "rules", not a theorem | 2026-11-15: from 40% / 5% (the unpacking no longer includes the coordinate and boundary claims (MMPb, MMPi)) |
| Prediction-space / larger-space connection | 30% | 20% | NOT YET FORMALIZED | 2 | PROJECT HYPOTHESIS | the prediction space and its function-space form are exact (dim P = ∞, dim M = 2: MMIh, MMPk); the "larger possibility space" beyond P is a project frame | — |
| c / model-rule analogy | 20% | 20% | NOT YET FORMALIZED | 2 | OPEN CONNECTION | three roles of c kept apart: Role 1 established for the stated form, Role 2 established physics in its native setting, Role 3 a structural analogy with model-family limits; transfer to model-manifold geometry OPEN; the general phrase TOO WEAK | 2026-11-15: from 25% / 20%, STRUCTURAL TRANSFER (the 2026-11-13 verdict collapsed the roles of c and generalized one example; transfer is OPEN (MMPm, MMPl)) |
| Observation / reduction connection | 15% | 35% | NOT YET FORMALIZED | 1 | OPEN CONNECTION | exact for named maps (the S² channel on \|ud⟩, MMPn; RIC1a; MMIg), which are different operations (MMPo); no construction covers "observation" as one class | — |
| Quantum-like manifestation hypothesis | 5% | 55% | NOT YET FORMALIZED | 0 | PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS | historical intuition (provenance only) and its investigable questions kept; no physical theory or data; conscious observer requirement = NOT ESTABLISHED | — |
| C7 readiness | 5% | 30% | NOT YET FORMALIZED | 0 | OPEN CONNECTION | NOT READY FOR DERIVATION: five preconditions open (width object, metric, model class, decay object, residue beyond Quinn 2019 and approximation theory); no derivation; the raw-spectrum reading is NEGATIVE | 2026-11-15: from 10% / 30% (the single recommended width object is withdrawn; the width definition and four further preconditions are open) |

Section rating (2026-11-15), Model-manifold section overall: Backbone Support 30%, AI Slop Risk 10%, Transfer Depth NOT YET FORMALIZED, Application Breadth 3, Status PROJECT-DERIVED CONNECTION. mostly established mathematics, classified by the project under stated hypotheses (MMI, MMP cards across several model families); the cross-links (c, same-zero quantum, observation) stay STRUCTURAL ANALOGY or OPEN; no transfer is established; tests passing are not counted as support.

## What would be lost if this branch were reduced to the paper alone

- the story as one chain (prediction space → allowable family / model image → representation → manifestation → what survives), with a status per arrow
- the user-origin questions: infinite prediction space, rules → geometry of allowed states, the two roles of c, observation as manifestation, what is accessible vs indistinguishable
- the historical viewer intuition and its investigable questions (PHILOSOPHICAL / HISTORICAL, kept)
- the link to the zero programme: a zero length as non-identifiability (under its hypothesis); same-zero quantum states (STRUCTURAL ANALOGY)
- the link to the Transformation and Reduction architectures (R1 for charts; limits as degenerations; IC questions per map)
- C7 as a project question (the paper answers a neighbouring question, Chebyshev widths, not C7 as posed)

## Decisions for Nadia

1. Add the PDFs (Quinn et al. 2023, Quinn et al. 2019, TMS 2010/2011, Transtrum–Qiu 2014) so the two width definitions, the MBAM boundary notion and the c-boundary claim can be quoted?
2. Is the historical wording "matter does not form until a viewer looks at it." recoverable?
3. For the next C7 construction pass: which model / function class (precondition 3) should the bridge be attempted on first?

Answered:
- Adopt the c verdict (STRUCTURAL CONNECTION for the limit role; FAIL for the invariant-form role; TOO WEAK in general)? revised by Nadia, 2026-11-15: three roles of c; transfer OPEN; the general phrase too weak.
- Approve hyperribbon widths as C7's target object, and choose the width definition? Nadia, 2026-11-15: do not choose one width definition yet; keep both Transtrum-style and Quinn-style notions; record five preconditions.
- Should the restricted c connection get its own construction pass? not now: this pass is precision only (2026-11-15).
