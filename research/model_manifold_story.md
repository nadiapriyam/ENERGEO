# Model-manifold research story

Generated from `research/tools/model_manifold_source.py` (`research/model_manifold.json`). Do not edit by hand. Decisions: `docs/restructure_decisions.md`, "Model-manifold invariance + research-story audit". Cards: `verify/verify_MMI.py`.

> Do not audit away the research story. Audit the status of each connection. (T-MM-GOV)

The paper is not the thesis: a paper result does not prove the project interpretation, and the project interpretation is not paper novelty. Novelty classes: KNOWN MODEL-MANIFOLD / INFORMATION GEOMETRY; PROJECT SYNTHESIS; OPEN PHYSICAL / QUANTUM-LIKE INTERPRETATION.

Kept apart throughout: parameter space ≠ prediction space; prediction space ≠ physical spacetime; model manifold ≠ quantum state space.

Status classes: ESTABLISHED MATHEMATICS; PAPER-BACKED RESULT; PROJECT-DERIVED CONNECTION; PROJECT HYPOTHESIS; OPEN CONNECTION; PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS; FAILED / NEGATIVE RESULT.

## The story, arrow by arrow

**CHAIN-1** (T-MM-STORY): "larger prediction / possibility space → rules constrain an allowable manifold → representations expose different aspects of it → observation / reduction may expose an accessible manifestation → ask what geometry and information survive"

| # | From | To | Status | Also | Exact object | Cards | Note |
|---|---|---|---|---|---|---|---|
| 1 | larger prediction / possibility space | rules constrain an allowable manifold | ESTABLISHED MATHEMATICS | PROJECT-DERIVED CONNECTION | M = Y(Θ) ⊆ P: the model rule Y and the parameter domain Θ fix the realizable set M inside the prediction space P (finite ℝᵐ, or a function space, MMIh) | MMIh, MMIg, FB11c | the definition is established; reading Y and Θ as the "rules" is the project connection (T-MM-RULES), exact in this definitional sense |
| 2 | rules constrain an allowable manifold | representations expose different aspects of it | PROJECT-DERIVED CONNECTION | — | charts (R1: g_φ = Jᵀ g J), prediction-space metrics (Σ) and embeddings: components, eigenvalues and singular values change; rank, nullity, lengths, volume element, curvature, widths and the boundary set do not change under charts | MMIa, MMIb, MMIc, MMId, MMIe, MMIf | which aspect is exposed depends on the representation; what is geometric is what survives every chart |
| 3 | representations expose different aspects of it | observation / reduction may expose an accessible manifestation | OPEN CONNECTION | — | exact only for named maps: a boundary limit (a family degeneration, MMIg, paper-backed), a projection (RIC1a), quantum non-selective measurement ρ ↦ Σₖ PₖρPₖ (W2a, established quantum mechanics) | MMIg, RIC1a, W2a | no single construction of "observation" covers these; the general arrow stays OPEN (T-MM-OBSERVE) |
| 4 | observation / reduction may expose an accessible manifestation | ask what geometry and information survive | PROJECT-DERIVED CONNECTION | OPEN CONNECTION | the seven Reduction / Information-Changing questions per map (survives, collapses, zero, lost, reconstructible, fibers, symmetry) | RIC1a, W2a, MMIg | answered per map; no general law of what survives (OPEN) |

**CHAIN-2** (T-MM-STORY): "possibility / prediction space → rules constrain an allowable manifold → geometry organizes distinguishability → observation/reduction exposes an accessible manifestation → ask what survives, disappears, or becomes observable"

| # | From | To | Status | Also | Exact object | Cards | Note |
|---|---|---|---|---|---|---|---|
| 1 | possibility / prediction space | rules constrain an allowable manifold | ESTABLISHED MATHEMATICS | PROJECT-DERIVED CONNECTION | M = Y(Θ) ⊆ P | MMIh | as in chain 1 |
| 2 | rules constrain an allowable manifold | geometry organizes distinguishability | ESTABLISHED MATHEMATICS | PAPER-BACKED RESULT | locally: the Fisher length √(dθᵀ g dθ) is the prediction-space distance per unit noise (MMId) and g(v, v) = 0 ⟺ Jv = 0 marks first-order indistinguishable directions (FB7b); globally: hyperribbon widths (TMS 2011; Quinn et al. 2019) | MMId, FB7b, MMIf | local statement ESTABLISHED MATHEMATICS; the global width hierarchy PAPER-BACKED RESULT |
| 3 | geometry organizes distinguishability | observation/reduction exposes an accessible manifestation | OPEN CONNECTION | — | as in chain 1, arrow 3 | W2a, MMIg | OPEN in general |
| 4 | observation/reduction exposes an accessible manifestation | ask what survives, disappears, or becomes observable | PROJECT-DERIVED CONNECTION | OPEN CONNECTION | per map: survives / is lost (IC questions); "becomes observable": after non-selective S² measurement the S² outcomes are defined while the sector coherence is gone (W2b) | W2b, RIC1a | "becomes observable" is exact for the quantum instance only |

**Historical intuition** (T-VIEWER-FORM): "matter does not form until a viewer looks at it." Status: PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS. Labels: ORIGINAL USER INTUITION; PHILOSOPHICAL / QUANTUM-INTERPRETIVE; NOT ESTABLISHED PHYSICS; ORIGINAL VERBATIM NOT RECOVERED (recorded as given, 2026-11-13, "approximately").

Normalized question (kept beside it, not replacing it): "What changes when a richer state/representation becomes an observable manifestation?"

conscious observer requirement = NOT ESTABLISHED.

Investigable part: which maps from a richer state to an observable manifestation exist, and what each keeps, removes or makes available (T-MM-OBSERVE; exact instances W2a, W2b, RIC1a, MMIg).

## Story table

| Idea | Exact mathematical object | Established / paper result | Project connection | Project hypothesis | Quantum-like / philosophical extension | What would falsify / weaken | Status | Cards | Registry |
|---|---|---|---|---|---|---|---|---|---|
| Prediction space | P = ℝᵐ for m outputs with metric Σ⁻¹; for a continuously indexed output with a stated inner product, a function space (L²). Not the parameter space Θ. | TMS 2010/2011 (data space); finite metric in function space: g_ij = 2/(θᵢ + θⱼ)³ (MMIh) | "infinite prediction space" is exact as a function space (T-PREDICTION-INFINITE) | the larger space carries structure that one projection does not show (Interactive Master Map, Stage IV) | not a quantum state space; not physical spacetime | none for the definition; the infinite reading needs a stated inner product | ESTABLISHED MATHEMATICS | MMIh | T-PREDICTION-INFINITE |
| Model manifold | M = Y(Θ) ⊆ P; dimension = rank J where J has constant rank; induced metric g = JᵀΣ⁻¹J | TMS 2010/2011; Quinn et al. 2023 (review) | "allowable manifold": the set of predictions the rules permit | rules constrain a geometry of allowed states (T-RULES-GEOMETRY, open) | — | none for the definition | ESTABLISHED MATHEMATICS | MMIg, MMIh | T-INFOGEO, T-MM-STORY |
| Parameters vs model rule vs image | model rule Y (functional form); parameter domain Θ; parameter values θ (coordinates on M); image M = Y(Θ). A reparametrization is a chart change (R1); M is unchanged | parametrizations are charts (Lee 2018; Amari 2016) | "the rules of the manifold were the model parameters." Unpacked: Y and Θ fix M; θ is a point coordinate; the domain's limits are M's boundaries (T-MM-RULES, DERIVED) | governing rules play a broader role in allowable geometry (T-MM-RULES-Q) | — | a feature of M that depends on the chart would contradict the unpacking (none: MMIa, MMIf) | PROJECT-DERIVED CONNECTION | MMIa, MMIf, MMIg | T-MM-RULES, T-MM-RULES-Q |
| Fisher metric | g = JᵀΣ⁻¹J, a symmetric (0,2)-tensor on Θ: the pullback of the prediction-space metric. Components transform g_φ = Jᵀ g J (R1); an isometry F*g = g (R2) exists only when the system supplies it | Rao 1945; Amari 2016; FB6a/FB6b; CFT4c (R1 checked) | placed in the Transformation Architecture: reparametrizations R1, isometries R2 (TA0) | — | — | a reparametrization reported as "g unchanged" (false for components) | ESTABLISHED MATHEMATICS | FB6a, FB6b, CFT4c, MMIa | T-INFOGEO |
| Null directions | g(v, v) = 0 ⟺ Jv = 0 ⟺ gv = 0 (g = JᵀΣ⁻¹J, Σ SPD). Kept apart: sloppy (λ small, nonzero), Lorentz null (vᵀηv = 0, ηv ≠ 0), bilinear null (B(u, v) = 0, u, v ≠ 0), collapsed zero (Φ(x) = 0, x ≠ 0) | FB7a–FB7d; Amari 2016 (singular regions) | "a zero geometric length can expose hidden non-identifiability / redundancy." (T-ZERO-LENGTH, DERIVED); survives charts (CFT5d) and noise models (MMIe) | — | observable zero does not uniquely specify underlying state (T-QUANTUM-ZERO): a STRUCTURAL ANALOGUE, no map given | a zero-length direction along which predictions change (impossible for SPD Σ) | ESTABLISHED MATHEMATICS | FB7a, FB7b, FB7c, FB7d, CFT5d, MMIe | T-ZERO-LENGTH |
| Sloppy directions | small nonzero eigenvalues of g in a stated chart; the raw spectrum is chart-dependent (MMIb, CFT5e). Invariant versions: widths (row hyperribbon-widths) or generalized eigenvalues of g relative to a system-supplied tensor h | Gutenkunst et al. 2007; TMS 2010; S14b (weak); S14a FAIL kept | M1 restated: the spectrum is a statement in log-parameter coordinates | — | — | already weakened: raw eigenvalues are not geometric invariants (NEGATIVE result for any raw-spectrum comparison) | FAILED / NEGATIVE RESULT | MMIb, CFT5e, S14b, S14a | T-INFOGEO, T-C7 |
| Hyperribbon widths | cross-sectional extents of the image set M in (P, Σ⁻¹), measured along geodesics (TMS 2011); bounded by a hyperellipsoid whose widths decay geometrically for analytic models (Chebyshev, Quinn et al. 2019). Parametrization-independent, metric-dependent (MMIf) | TMS 2011; Quinn, Wilber, Townsend, Sethna 2019 | the recommended C7 target object (T-C7 gate) | C7: a structural relation between coefficient decay and model-manifold geometry (T-C7, OPEN) | — | a width definition that changes with the chart (would contradict MMIf); the C7 residue reducing to Quinn 2019 (then VALIDATION OF KNOWN MATHEMATICS) | PAPER-BACKED RESULT | MMIf | T-C7, T-INFOGEO |
| Manifold boundaries | limits Y(θ) as θ → ∂Θ: lower-dimensional faces of M; the limit set is chart-independent, the approach rate is not; the dimension drops (rank 2 → 1, MMIg) | Transtrum–Qiu 2014; FB11c; MMIg | simpler structure as a boundary of a richer model (T-SIMPLER-BOUNDARY-Q) | — | — | a boundary that depends on the chart (none: MMIg) | PAPER-BACKED RESULT | MMIg, FB11c | T-SIMPLER-BOUNDARY-Q |
| Effective models | the boundary model (e.g. e^{−θ₁t}); MBAM reaches it along a geodesic. In the Reduction architecture a limit is a degeneration of the family, not a map Φ: X → Y on states | Transtrum–Qiu 2014 (MBAM, source-only); Machta et al. 2013 | H6 / T-EFFECTIVE-Q examples; what survives: θ₁ (FB11c) | effective representations follow a general law (H6, OPEN) | — | an effective model not reachable as any boundary (would bound the reading; MBAM source-only) | PAPER-BACKED RESULT | FB11c, MMIg | T-EFFECTIVE-Q, T-SIMPLER-BOUNDARY-Q |
| Larger possibility space | P ⊋ M (the ambient contains predictions no parameter value reaches); a source X → reduced Y (Φ) | the strict inclusion is definitional; MMIh (P infinite-dimensional, M 2-dimensional) | "A mathematical space can contain more structure than a single visible projection reveals." (Stage IV carry-forward) | the larger possibility space is the right frame for the project (T-MM-STORY) | quantum-like possibility space (row quantum-like) | a system where the ambient adds nothing beyond M (would weaken the frame there) | PROJECT HYPOTHESIS | MMIh | T-MM-STORY, T-PREDICTION-INFINITE |
| Observation / manifestation | a named information-changing map Φ: X → Y; quantum: ρ ↦ Σₖ PₖρPₖ (non-selective measurement) | W2a (established quantum mechanics); RIC1a (projection) | observation as a map to a restricted manifestation (T-MM-OBSERVE, OPEN) | — | "matter does not form until a viewer looks at it." (T-VIEWER-FORM: ORIGINAL USER INTUITION, NOT ESTABLISHED PHYSICS); conscious observer requirement = NOT ESTABLISHED | a measurement whose effect is not representable as such a map (none known); for the viewer intuition: physical theory or data, not a construction | OPEN CONNECTION | W2a, W2b, RIC1a | T-MM-OBSERVE, T-VIEWER-FORM |
| Connection to c / governing rules | η_c = diag(1, −1/c²) = Pᵀ diag(1, −1) P, P = diag(1, 1/c); c → ∞: diag(1, 0), rank 1 (C9b, MMIi). Model: θ₂ → ∞, rank 2 → 1 (MMIg) | C9b; Quinn et al. 2023 treat c as a model parameter whose c → ∞ boundary gives Newtonian kinematics (snippet-confirmed, PDF pending) | verdict: STRUCTURAL CONNECTION for the parameter-limit → degenerate-boundary role only (T-RULES-GEOMETRY) | rules constrain a geometry of allowed states (T-RULES-GEOMETRY, open); the two roles of c (T-C-ROLES) | — | the invariant-form role does not transfer (FAIL): c is a structure constant up to units, θ is a coordinate; the Lorentz allowed set is one orbit, M is not homogeneous (CFT5f) | PROJECT-DERIVED CONNECTION | MMIi, C9b, MMIg, CFT5f | T-RULES-GEOMETRY, T-C-ROLES, T-MM-DISTINGUISHED-Q |
| Quantum-like possibility space | a state space (density matrices on ℂ⁴ for two spins) and an observable; the S_z = 0 eigenspace is 2-dimensional, so a zero value does not fix the state (Q1a–Q1d) | Q1a, Q1c, Q1d, Q2b (established quantum mechanics) | same zero ↔ observationally indistinguishable parameters: STRUCTURAL ANALOGUE / OPEN CONNECTION (no explicit map between the two) | — | a richer state becoming an observable manifestation (T-VIEWER-FORM, normalized question) | an explicit map showing the two indistinguishabilities differ in kind (would bound the analogue) | PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS | Q1a, Q1c, Q1d, Q2b | T-QUANTUM-ZERO, T-VIEWER-FORM |
| Measurement / reduction | the Reduction / Information-Changing Architecture (RI0): for each map, what survives, collapses, becomes zero, is lost, is reconstructible, the fibers, symmetry | RIC1a–RIC1d, W2a, W3a (instances) | model-manifold boundaries join as limits (MMIg), dephasing as a map (W2a) | transform vs reduce governs the project (T-TRANSFORM-REDUCE, open) | measurement as reduction (T-MM-OBSERVE) | a reduction where the seven questions cannot be posed | PROJECT-DERIVED CONNECTION | RIC1a, W2a, MMIg | T-REDUCTION-ARCH, T-TRANSFORM-REDUCE |
| Information loss / distinguishability | Fisher length = local distinguishability per unit noise (MMId); fibers Y⁻¹(y) = parameters with identical predictions; information distinctions below | Rao 1945; Amari 2016; FB7b; MMId | geometry encodes accessible / inaccessible / indistinguishable information (T-GEOM-INFO-Q, open) | — | what the geometry says about distinguishability in quantum measurement (open) | two parameter values with zero Fisher distance but distinguishable predictions (impossible locally) | ESTABLISHED MATHEMATICS | MMId, FB7b, FB7a | T-GEOM-INFO-Q |
| Representations expose different aspects | charts, noise metrics, embeddings: what changes (entries, det, raw eigenvalues, condition number, singular values) and what stays (rank, nullity, length, volume element, curvature, widths, boundary set) | Lee 2018 (tensor law); MMIa–MMIf | arrow 2 of the story (T-MM-STORY) | — | — | a "geometric" claim that rests on a chart-dependent number (MMIb shows how it fails) | PROJECT-DERIVED CONNECTION | MMIa, MMIb, MMIc, MMId, MMIe, MMIf | T-MM-STORY |
| Raw FIM eigenvalue spectrum as C7's object | eigenvalues of the component matrix g in one chart | CFT5e, MMIb (not invariant) | C7 compared coefficient decay with this spectrum (BR28) | — | — | already failed as a geometric object: it changes with units and charts | FAILED / NEGATIVE RESULT | MMIb, CFT5e | T-C7 |

## Null directions, kept distinct

| Kind | Law | Cards |
|---|---|---|
| Fisher null (statistical) | g(v, v) = 0 ⟺ Jv = 0 ⟺ gv = 0 (g ⪰ 0) | FB7b, FB7a |
| sloppy direction | g(v, v) > 0 but small relative to other directions in a stated chart or width | FB7c |
| Lorentz null | vᵀηv = 0 with ηv ≠ 0 (indefinite form) | FB7d |
| bilinear null | B(u, v) = 0 for nonzero u, v (orthogonality) | TRA2a |
| collapsed zero | Φ(x) = 0 with x ≠ 0 for a non-injective Φ | RIC1a, RIC2c |

## Manifestation terminology

| Term | Meaning | Status | Example |
|---|---|---|---|
| mathematical manifestation | the image Φ(x) of a stated map, or the boundary model reached by a stated limit | ESTABLISHED MATHEMATICS | Pₙx (RIC1a); e^{−θ₁t} as the θ₂ → ∞ face (MMIg) |
| observable manifestation | what a stated measurement returns: outcomes and the post-measurement state | ESTABLISHED MATHEMATICS | after non-selective S² measurement: outcomes 2ħ² and 0, sector coherence gone (W2a, W2b) |
| physical manifestation | physical coming-into-form, the subject of the historical intuition | PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS | none: needs physical theory or data (T-PHYSICAL-MANIFEST-Q, T-VIEWER-FORM) |

Connected to the Reduction architecture's source / manifestation question (T-SOURCE-MANIFEST).

## Transformation Architecture placement

| Level | Model-manifold placement |
|---|---|
| R1 | reparametrizations (charts): g_φ = Jᵀ g J; rank, nullity, lengths, curvature, widths, boundary set invariant (MMIa–MMIf, CFT4c) |
| R2 | isometries F*g = g only when the system supplies them (F-C exchange CFT5a; location–scale CFT4d); none in general (CFT5f) |
| R3 | none claimed: no operator compatibility is carded for model manifolds in this audit |
| outside | a change of noise model Σ changes the metric itself (MMIe): not R1, R2 or R3; a boundary limit is a family degeneration (Reduction architecture), not a transformation |

## c and governing rules: verdict

Verdict (T-RULES-GEOMETRY): **STRUCTURAL CONNECTION**, restricted to the parameter-limit → degenerate-boundary role only.

| Role | Verdict | Cards | Note |
|---|---|---|---|
| a parameter limit is a degenerate boundary (rank drop) | STRUCTURAL CONNECTION | MMIi, C9b, MMIg | c → ∞: η_c → diag(1, 0), rank 1; θ₂ → ∞: rank J 2 → 1. Quinn et al. 2023 treat c as a model parameter (PDF quote pending) |
| c as the invariant of a form (structure constant) | FAIL | MMIi, CFT5f | for finite c, c is absorbed by a change of units (R1): the invariant is the signature. Model parameters are coordinates on one manifold; M is not homogeneous |
| "rules constrain allowed states", stated generally | TOO WEAK | — | every constraint does this; it distinguishes nothing |

## Information distinctions

| Term | Exact object | Geometry | Cards | Not the same as |
|---|---|---|---|---|
| Shannon information | entropy H(p) = −Σ p log p of an outcome distribution (mutual information between variables) | not a metric on parameters; not carded | — | Fisher information |
| Fisher information | g = E[∂ℓ ∂ℓᵀ] = JᵀΣ⁻¹J (Gaussian noise): local sensitivity of the likelihood, a metric | the induced metric of M; chart covariance R1 | FB6a, FB6b, MMIa | Shannon entropy; identifiability (global) |
| parameter identifiability | injectivity of Y on Θ (global); rank J = dim Θ (local, first order) | fibers Y⁻¹(y); null directions g(v, v) = 0 | FB7a, FB7b | sloppiness (identifiable but poorly constrained) |
| prediction sensitivity | J = ∂Y/∂θ | chart-dependent components and singular values (MMIc); its kernel is invariant | MMIc | distinguishability (needs the noise metric) |
| observable distinguishability | distance in P per unit noise; locally the Fisher length (MMId) | lengths and widths (chart-independent, noise-dependent) | MMId, MMIf | identifiability (zero distance only along nulls) |
| reconstruction information | what Φ(x) determines about x under stated assumptions (fibers Φ⁻¹(y)) | Reduction architecture (IC questions) | G3b, G4c, RIC1a | Fisher information (local, parametric) |
| phase information | what \|x̂\| discards: equal power spectra, different signals | fibers of x ↦ \|x̂\| (not a subspace) | P1c, FB1d | Fisher information of a phase parameter |
| quantum information | density matrices; coherences ⟨A\|ρ\|B⟩; what a measurement removes or makes available | not the Fisher metric of this audit; quantum Fisher information is not carded | W2a, W2b, Q1c | classical identifiability |

## Spine instantiation (model manifolds)

| Spine stage | Model-manifold instance |
|---|---|
| OBJECT | a model rule Y: Θ → P with parameter domain Θ and a noise model Σ |
| REPRESENTATION | a chart θ of M; the prediction space P (ℝᵐ or L²) with metric Σ⁻¹ |
| RELATION | the Fisher metric g = JᵀΣ⁻¹J (pullback of the prediction metric) |
| ZERO / BALANCE / NULL | g(v, v) = 0 ⟺ Jv = 0 (first-order non-identifiability, FB7b); rank drop at a boundary (MMIg) |
| TRANSFORMATION | R1 reparametrizations g_φ = Jᵀ g J; R2 isometries only when supplied (CFT5a, CFT4d); a change of noise model changes the metric (not R1, MMIe); a boundary limit is a family degeneration, not a map |
| PRESERVED STRUCTURE | under charts: rank, nullity, null directions, lengths, volume element, curvature, widths, boundary set. Not preserved: entries, det, raw eigenvalues, condition number, singular values |
| GEOMETRY | M ⊆ P with its induced metric; widths; boundaries; curvature (not homogeneous, CFT5f) |
| INFORMATION | Fisher information (local distinguishability per unit noise); identifiability (fibers of Y) |
| DYNAMICS / CONTINUATION | geodesics to boundaries (MBAM, source-only); the c → ∞ boundary (C9b) |
| CROSS-SYSTEM TRANSFER | c ↔ model parameter limit (STRUCTURAL ANALOGUE); same-zero quantum ↔ indistinguishable parameters (STRUCTURAL ANALOGUE / OPEN); C7 (OPEN; target object: widths) |
| APPLICATION | none (Energeo not begun) |

## C7 target object

One recommendation: **hyperribbon widths**, the hyperribbon widths of the model manifold: cross-sectional extents of M in a stated prediction-space metric. T-C7 stays OPEN; no derivation is begun.

Why:
- parametrization-independent (MMIf), unlike raw FIM eigenvalues (MMIb, CFT5e: NEGATIVE)
- the geometric quantity the sloppy phenomenology is about (TMS 2011)
- known mathematics already links widths to coefficient decay: Chebyshev coefficients bound them for analytic models (Quinn et al. 2019)

Gates before any derivation:
- fix the width definition from the source text (TMS 2011 geodesic widths vs Quinn 2019 bounding-hyperellipsoid widths); the PDFs are not opened here
- state the prediction-space metric (noise model): widths depend on it (MMIf)
- state C7's project-specific residue relative to Quinn 2019 before deriving; otherwise the outcome is VALIDATION OF KNOWN MATHEMATICS
- T-C7 wording unchanged; no derivation in this pass

Not recommended:
- raw FIM eigenvalues: coordinate-dependent (MMIb, CFT5e)
- Jacobian singular values: coordinate- and metric-dependent (MMIc)
- generalized eigenvalues of (g, h): invariant, but needs a system-supplied reference tensor h; none is supplied

## Negative results

| Result | Cards |
|---|---|
| raw FIM eigenvalues, condition number, determinant and Jacobian singular values are not coordinate invariants | MMIb, MMIc, MMIa, CFT5e |
| C7 read as "coefficient decay vs raw Fisher eigenvalue decay" compares a chart-dependent number | MMIb, CFT5e |
| the invariant-form role of c does not transfer to model parameters | MMIi |
| "rules constrain allowed states" stated generally is too weak to test | — |
| a generic model manifold is not homogeneous: no group orbit plays the role of the Lorentz allowed set | CFT5f, MMIi |
| a function-space prediction space does not make M infinite-dimensional | MMIh |
| a boundary limit is not a map on states: the Reduction architecture records it as a family degeneration | MMIg |
| no single construction of "observation" covers quantum dephasing, projection and boundary limits | W2a, RIC1a, MMIg |
| S14a stays FAIL (span 3.1 decades, threshold 4) | S14a |

## Ratings (separate dimensions; no overall score)

| Dimension | Backbone Support | AI Slop Risk | Transfer Depth | Application Breadth | Status | Why |
|---|---|---|---|---|---|---|
| Model-manifold established mathematics | 25% | 5% | TRIVIAL CONSEQUENCE | 3 | ESTABLISHED MATHEMATICS | definitions and textbook facts, carded on three models (F-C, the one-exponential curve, the function-space model) |
| Parameter / rule → allowable-manifold connection | 40% | 5% | TRIVIAL CONSEQUENCE | 2 | PROJECT-DERIVED CONNECTION | exact in the definitional sense M = Y(Θ); the domain's limits give boundaries; adds the word "rules", not a theorem |
| Prediction-space / larger-space connection | 30% | 20% | NOT YET FORMALIZED | 2 | PROJECT HYPOTHESIS | the prediction space and its function-space form are exact (MMIh); the "larger possibility space" beyond P is a project frame |
| c / model-rule analogy | 25% | 20% | STRUCTURAL TRANSFER | 2 | PROJECT-DERIVED CONNECTION | STRUCTURAL CONNECTION for the limit → rank-drop role only; FAIL for the invariant-form role; TOO WEAK in general |
| Observation / reduction connection | 15% | 35% | NOT YET FORMALIZED | 1 | OPEN CONNECTION | exact for named maps (W2a, RIC1a, MMIg); no construction covers "observation" as one class |
| Quantum-like manifestation hypothesis | 5% | 55% | NOT YET FORMALIZED | 0 | PHILOSOPHICAL / QUANTUM-LIKE HYPOTHESIS | historical intuition and its normalized question kept; no physical theory or data; conscious observer requirement = NOT ESTABLISHED |
| C7 readiness | 10% | 30% | NOT YET FORMALIZED | 0 | OPEN CONNECTION | target object recommended (widths) with four gates; no derivation; the raw-spectrum reading is NEGATIVE |

## What would be lost if this branch were reduced to the paper alone

- the story as one chain (prediction space → allowable manifold → representation → manifestation → what survives), with a status per arrow
- the user-origin questions: infinite prediction space, rules → geometry of allowed states, the two roles of c, observation as manifestation, what is accessible vs indistinguishable
- the historical viewer intuition and its normalized question (PHILOSOPHICAL, kept)
- the link to the zero programme: a zero length as non-identifiability; same-zero quantum states (STRUCTURAL ANALOGUE)
- the link to the Transformation and Reduction architectures (R1 for charts; limits as degenerations; IC questions per map)
- C7 as a project question (the paper answers a neighbouring question, Chebyshev widths, not C7 as posed)

## Decisions for Nadia

1. Adopt the c verdict: STRUCTURAL CONNECTION for the parameter-limit → degenerate-boundary role only; FAIL for the invariant-form role; TOO WEAK in general?
2. Approve hyperribbon widths as C7's target object, and choose the width definition (TMS 2011 geodesic widths or Quinn 2019 bounding-hyperellipsoid widths)?
3. Is the historical wording "matter does not form until a viewer looks at it." recoverable? Is the normalized question acceptable as the investigable form?
4. Add the PDFs (Quinn et al. 2023, Quinn et al. 2019, TMS 2011) so the widths and the c-boundary claim can be quoted?
5. Should the restricted c connection (parameter limits as rank-drop boundaries across systems) get its own construction pass, or stay open?
