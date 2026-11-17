# Master Map #17: conjugacy and physical pairs (first construction; locked 2026-11-17)

**LOCK #17 — STORY AND MATHEMATICS ALIGNED** (2026-11-17). Lock cards: `verify/verify_P17L.py` (P17La–P17Lg). The lock section and the superseded construction-pass wording are at the end.

Generated from `research/tools/p17_source.py` (`research/p17.json`). Do not edit by hand. Cards: `verify/verify_P17.py` (34, one ledger run), with FB4a–FB4c and FB8a–FB8c. Decisions: `docs/restructure_decisions.md`, "Pre-#17 story patches and the first #17 construction".

Discovery order kept: Fourier pair → exact mathematical conjugacy → what information does the pairing encode? → do physical pairings ever share an exact relation of comparable structural depth? The answer is not assumed to be yes. The branch is not defined as "mass-wave": mass/wave is one candidate investigation within it, entered only after the question is explicit.

## A. The historical #17 question

- Node: **17. Conjugacy and physical pairs — Search for hidden relationships**; historical predecessor: **12. Fourier pairs — Change the representation, not the underlying information** (EARLIER PREDECESSOR edge #12 → #17).
- Question: Do observable physical pairings or complementarities reflect deeper symmetry analogous to mathematical conjugacy? (T-CONJUGACY, RD R12)
- The Master Map scene (verbatim):
  - "Begin with a complex Fourier coefficient and its conjugate."
  - "Then show how pairs of conjugate-frequency coefficients help produce a real-valued signal."
  - "Once the mathematical relationship is established, introduce your broader question about physical pairs and whether observable relationships reflect deeper symmetry in nature."
  - "The interface could let the visitor compare several kinds of pairing—mathematical conjugacy, reflection, and physical complementarity—and investigate which share formal properties."
- Seed for one candidate route: mass is waves too, it's just a different form. (T-MASS-WAVE-SEED; recorded as the historical seed for one candidate route, not promoted)

## B. Fourier conjugacy: the source relation for #17

Convention: x̂(ω) = ∫x(t)e^{−iωt}dt; DFT X_k = Σx_n e^{−2πikn/N}.

| Item | Exact statement | Cards |
|---|---|---|
| continuous | x̂(ω) = ∫x(t)e^{−iωt}dt. For x = u + iv: x̂(−ω) − conj x̂(ω) = 2i·v̂(−ω). For x ∈ L¹(ℝ): x̂(−ω) = conj x̂(ω) for every ω ⟺ v = 0 almost everywhere — the converse by the uniqueness theorem on L¹ (Zhou–Siadat Theorem 1.15, read), and independently for finite signals and finite Hermite expansions. Realness is exactly the property that forces the conjugacy | P17Fa, FB4a, P17Lc, P17Ld, P17Le |
| the operation behind it | C: x ↦ conj x and C̃: X(ω) ↦ conj X(−ω) are antilinear involutions with F∘C = C̃∘F; real signals = Fix(C), Hermitian-symmetric spectra = Fix(C̃) | P17Fb |
| four properties separated | conjugate pair ⟺ equal magnitude AND opposite phase (where X ≠ 0); equal magnitude alone ((1+i)e^{−t²/2}) and opposite phase alone (e^{−(ω−1)²/2}e^{iω}) do not give a conjugate pair | P17Fc |
| DFT (finite index) | X_k = Σx_n e^{−2πikn/N}; for real x: X_{(−k) mod N} = conj X_k; pairs k ↔ N − k | P17Fd, FB4b |
| DC and Nyquist exceptions | self-paired indices: k = 0 always, k = N/2 iff N even; there X_k is real (phase 0 or π) and the "pair" degenerates to a reality condition on one coefficient; continuous: ω = 0 only | P17Fd, P17Ff |
| redundant degrees of freedom | x ↦ (X₀, …, X_⌊N/2⌋) is invertible over ℝ (N real numbers either way); the conjugate half carries no independent information | P17Fe |
| what the pairing encodes | each pair (X_k, X_{N−k}) is one real oscillation (2/N)\|X_k\|cos(2πkn/N + arg X_k): one amplitude, one phase; the imaginary parts of the pair cancel identically (a cancellation zero) | P17Fh |
| failure case (P17-X1) | for a generic complex-valued signal the symmetry need not hold: x = (1, i, 0, 0) gives X = (1 + i, 2, 1 − i, 0); e^{−t²/2}e^{it} (FB4c) | P17Fg, FB4c |
| representation-theoretic origin | for a unitary character χ of an abelian group conj χ = χ⁻¹, so a real function has f̂(χ⁻¹) = conj f̂(χ): ℝ (ω ↦ −ω), ℤ_N (k ↦ N − k), ℝ² with η (P ↦ −P) — one structure | P17Cg |

**What forces the conjugacy:** x = conj x (realness), and nothing weaker: the defect of the symmetry, x̂(−ω) − conj x̂(ω), is exactly 2i·v̂(−ω), where v = Im x, and v̂ ≡ 0 only for v = 0 a.e. (P17Fa; uniqueness on L¹, Zhou–Siadat Theorem 1.15; exact without imported theorems for finite signals, P17Lc, and finite Hermite expansions, P17Ld).

## C. What "same structure" would have to mean

Transfer criteria (Nadia's list, 2026-11-17): **TC1** a transformation relating the pair; **TC2** an involution or symmetry operation; **TC3** a preserved relation; **TC4** a reconstruction or reality constraint; **TC5** paired coordinates carrying non-independent information; **TC6** a common quadratic/bilinear relation; **TC7** a group/representation-theoretic origin.

Levels: **L0 visual analogy** — a shared word or picture only (both "waves", both "pairs", both ±, both contain c); **L1 shared equation** — the same equation or quadratic form holds on both sides; **L2 shared transformation structure** — the same transformation or involution acts on both sides and preserves the stated relation; **L3 shared representation-theoretic structure** — both sides arise from the same group and the same representation-theoretic fact. Not every candidate must meet every criterion. A level is awarded only on cards; words, ± signs and the letter c are never evidence.

### Candidate pairs (questions, not answers: no deeper common relation is filled in)

| ID | Candidate | Object | Representation | Relation | Transformation | Invariant | Zero / null | Kind | TC1 | TC2 | TC3 | TC4 | TC5 | TC6 | TC7 | Level | Genuinely shared | Not shared | Cards |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PC-0 | Fourier coefficient pair (the source) | a real signal x | x̂ (or the DFT X) | x̂(−ω) = conj x̂(ω) | ω ↦ −ω with complex conjugation (C̃) | \|x̂(ω)\|² = \|x̂(−ω)\|²; realness | self-paired ω = 0 (zero index; X₀ real) | conjugacy / reality constraint | yes | yes | yes | yes | yes | partial | yes | L3 (the source) | — | — | P17Fa, P17Fb, P17Fd, P17Fh, P17Cg |
| PC-1 | real classical field: mode at P and mode at −P | a real solution φ(t, x) of the Klein–Gordon-form PDE | space-time spectrum φ̃(ω, k) (mode amplitudes a, b) | φ̃(−ω, −k) = conj φ̃(ω, k); b(k) = conj a(−k) | P ↦ −P with complex conjugation | q(P) (both modes on the same level set) | — | conjugacy / reality constraint | yes | yes | yes | yes | yes | yes | yes | L3 — because it is the same theorem (characters of ℝ²): TRIVIAL CONSEQUENCE, not a new physical relation | the whole source structure: antilinear involution, reality constraint, redundancy, conj χ = χ⁻¹ | the two partners are not two physical entities (P17-X4); the pairing says nothing the reality of φ did not already say | P17Rb, P17Rc, P17Rd, P17Re, P17Cg, P17Cd |
| PC-2 | upper and lower mass-shell branches | points of the level set q(P) = μ² | (ω/c, k) | q(−P) = q(P); S_t and −I exchange the branches | −I (det +1, not in SO⁺(1,1)) or S_t = diag(−1, 1) | q | none for μ > 0 (P17-X3) | sign symmetry (as points); with amplitudes it is the reality pairing PC-1 | yes | yes | yes | no | no | yes | partial | L2 | an involution preserving the quadratic relation | no reality constraint or redundancy without amplitudes; a physical reading of the lower branch belongs to a specific field theory (future branch, not used) | P17Ca, P17Rc |
| PC-3 | right- and left-movers: (ω, k) and (ω, −k) | modes of one real field | (ω/c, k) | both on the same level set (the relation is even in k) | S_x = diag(1, −1) | q | — | sign symmetry; independent physical states | yes | yes | yes | no | no | yes | partial | L2 (not conjugacy) | an involution preserving q | amplitudes independent: cos(kx − ωt) has a(k) = 1/2, a(−k) = 0 (P17-X2) | P17Cb, P17Rd, P17Ca |
| PC-4 | massless and massive levels | the level sets q = 0 and q = μ² | (ω/c, k) | one form, two levels | none inside O(1,1) maps one level to another (boosts and reflections preserve q) | q | q = 0 is null (contains P ≠ 0 and the zero index P = 0); q = μ² has no null point | same equation, different levels | no | no | yes | no | no | yes | partial | L1 (MW-B) | the quadratic form q | no transformation or involution relating the levels; the null level and a timelike level of the same form carry different SO⁺(1,1) orbit structure (four null half-lines vs two branches); m selects the level, the form is unchanged | P17Dc, P17De, P17Dh, P17Cc |
| PC-5 | mass and wave variables as a conjugate pair (MW-C) | m and (ω, k) | μ = mc/ħ = √q(P) on the support | m² = ħ²q(P)/c² | none: conjugation and boosts fix m | m itself (the orbit label) | m = 0 ⟺ null level | not a pairing: m labels the level; (ω, k) is a point on it | no | no | yes | no | partial | yes | partial | L1 only; FAIL as conjugacy | the quadratic relation m² ∝ q(P) | complex conjugation maps the mass-m shell to itself and never relates m to (ω, k) (P17Ch) | P17Ch, P17Di |
| PC-6 | rest frequency mc²/ħ and the proper-time phase | one mode on the mass shell, along its group worldline | the phase e^{−i(mc²/ħ)τ} | phase accumulation at mc²/ħ per unit proper time along the worldline of the same on-shell momentum (up to sign convention) | proper-time translation τ ↦ τ + s (a character, as in #18) | mc²/ħ (Lorentz invariant) | m = 0: the phase is constant along the light ray | a proper-time phase rate — not a demonstrated pairing | yes | no | yes | no | no | yes | partial | L1: a phase-rate equation; no Fourier-conjugate pairing of m and τ is established (P17Lf) | the character structure of #18 (an unbounded parameter in a bounded phase) | no antilinear involution; no spectral family in which m is a variable; restricted to the worldline of the same on-shell momentum | P17Dg, P17Lb, P17Lf, A8Fa |
| PC-7 | massive particle dispersion and a string on an elastic foundation | two physical systems | (ω, k) | the same ω² = c²k² + μ²c² | — | q | — | shared equation | no | no | yes | no | no | yes | no | L1 | the dispersion relation, its levels and its gap | the physics: a stiffness is not a mass; no particle in the string (boundary for MW-D) | P17Mx |
| PC-8 | "positive" and "negative" frequency as labels | the two halves of a real spectrum | complex exponentials with a chosen sign convention | labels swap with the kernel sign; absent in the real (cos/sin) and one-sided representations | change of representation | the real signal | — | notation-dependent pairing | partial | no | no | no | yes | no | no | L0 as a physical pair (P17-X5) | — | disappears under a different representation with no information lost | P17Ce, P17Db |

## D. Dispersion and mass-shell mathematics (spectral variables, not spacetime)

| Statement | Cards | Status |
|---|---|---|
| The PDE φ_tt − c²φ_xx + μ²c²φ = 0 (a parameter μ, units 1/length) has plane waves e^{i(kx − ωt)} exactly when ω² = c²k² + μ²c²; its symbol in the project convention is c²k² + μ²c² − ω² = −c²(q(P) − μ²), P = (ω/c, k) | P17Ra, P17Db | ESTABLISHED |
| Dimensions: [ω/c] = [k] = [mc/ħ] = L⁻¹, [mc²/ħ] = T⁻¹; ω, k angular (hν = ħω, p = h/λ = ħk) | P17Da | ESTABLISHED |
| With μ = mc/ħ: ω² = c²k² + m²c⁴/ħ² ⟺ (ω/c)² − k² = (mc/ħ)² | FB8a, FB8b, P17Ea | ESTABLISHED (μ = mc/ħ is an identification) |
| Convention: the physics positive-frequency wave e^{−iω₀t} sits at −ω₀ in x̂(ω) = ∫x e^{−iωt}dt; "positive frequency" is a convention-dependent label | P17Db, P17Ce | ESTABLISHED |
| (ω/c, k) is a pair of coordinates in a plane carrying the Lorentzian quadratic form q = η(P, P); boosts act on it as on (ct, x) because the phase η(P, X) is invariant. It is a relation in frequency-wavevector / energy-momentum variables, not physical spacetime | P17Dd, P17Dh, P17De | ESTABLISHED |

## E. The massless null case

m = 0: ω² = c²k² ⟺ (ω/c)² − k² = 0 ⟺ ω = ±ck, a null relation of the Lorentzian form in the spectral plane (P17Dc). They are not one kind of zero:

| Object | Where it lives | Relation | Kind of zero (#13) | Cards |
|---|---|---|---|---|
| spacetime null vector | event plane X = (ct, x) | η(X, X) = 0, X ≠ 0 (x = ±ct) | null / balance / cancellation | S12b, P17Dd |
| spectral (energy–momentum) null relation | spectral plane P = (ω/c, k) | q(P) = 0, P ≠ 0 (ω = ±ck, m = 0); ηP ≠ 0, so not a kernel vector | null / balance / cancellation | P17Dc, P17Dd, FB8b |
| Fourier zero coefficient | coefficients of a signal | f̂(k) = ⟨f, e_k⟩ = 0 while f ≠ 0 | zero relation | O2a |
| model-manifold null direction | parameter space | Jv = 0 ⟺ g(θ)v = 0 (a kernel vector of a semidefinite metric) | null / balance / cancellation (semidefinite: kernel) | FB7d |
| zero index on the massless cone | spectral plane | P = 0: the constant mode (ω = 0, k = 0) — on the cone for m = 0, not on the shell for m > 0 | zero index / frequency | P17Dc, P17Cc |

The spectral null P and the spacetime null ray are related only through η: the wave e^{−iη(P, X)} with P null has constant phase along the null ray parallel to P (P17Dd). They are not one kind of zero, and they are not the same object.

## F. The massive level-set case

| Statement | Cards | Status |
|---|---|---|
| m > 0: q(P) = μ² is a hyperbola (1 + 1) with branches ω/c = ±√(k² + μ²); in 1 + 3 a two-sheeted hyperboloid | P17De, P17Df | ESTABLISHED |
| Proper orthochronous Lorentz boosts preserve each positive- or negative-energy mass-shell branch separately. Each branch is one SO⁺(1,1) orbit: the boost with tanh φ = ck/ω (= v_g/c) carries a positive-energy point to (μ, 0) and a negative-energy point to (−μ, 0). Not claimed for the full Lorentz group: time reversal S_t and −I preserve q and exchange the branches (P17La, P17Ca) | P17De, P17La, P17Ca | DERIVED |
| the branches are asymptotic to the null cone (ω − c\|k\| = μ²c²/(ω + c\|k\|) → 0) and tend to it as μ → 0 at fixed k | P17De | DERIVED |
| frequency gap: no real k for \|ω\| < μc (evanescent waves); min ω = μc = mc²/ħ at k = 0 | P17Df, P17Dg | DERIVED |
| Along the worldline associated with the same on-shell four-momentum, the free massive plane-wave phase accumulates at the invariant proper-time rate mc²/ħ, up to sign convention. — assumptions (P17Lb): a single free massive plane wave e^{−iη(P, X)}; P on the shell q(P) = (mc/ħ)²; the straight worldline X(τ) = X₀ + (cτ/μ)P of the same on-shell momentum, on which τ is proper time; the sign convention e^{−iη(P, X)} (the opposite convention reverses the sign). On another worldline the rate differs (lab frame: ω). m = 0: the phase is constant along the light ray. This establishes a proper-time phase rate. It does NOT by itself establish that mass and proper time are Fourier-conjugate variables. | P17Dg, P17Lb, P17Lf | DERIVED (under the stated assumptions) |
| mass selects the level: Mass labels/selects the invariant level of the same Lorentzian quadratic form. m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level). The form and the group SO⁺(1,1) are the same for every m; μ = mc/ħ labels the invariant level as r labels a rotation orbit (#14 chart: Kᵀη + ηK = 0, JᵀI + IJ = 0); μ is not a form parameter like c | P17Di, P17Lg, A8Wb | DERIVED; its reading as a #14 ⇢ #17 connection is PROJECT SYNTHESIS |

**Does mass appear as a parameter selecting a non-null level set of the same quadratic form whose m=0 case is null? Yes, exactly: Mass labels/selects the invariant level of the same Lorentzian quadratic form. m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level). The form q = (ω/c)² − k² and the group acting on it are the same for every m; m does not change the geometry, it selects the level (P17Db, P17Dc, P17De, P17Lg). Consequences of the selected level (derived): a frequency gap at mc²/ħ, a rest frame, and the proper-time phase rate stated below. This does not say that mass is a wave.**

Mass labels/selects the invariant level of the same Lorentzian quadratic form. m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level).

Proper orthochronous Lorentz boosts preserve each positive- or negative-energy mass-shell branch separately.

Along the worldline associated with the same on-shell four-momentum, the free massive plane-wave phase accumulates at the invariant proper-time rate mc²/ħ, up to sign convention. This establishes a proper-time phase rate. It does NOT by itself establish that mass and proper time are Fourier-conjugate variables.

Assumptions: assumptions (P17Lb): a single free massive plane wave e^{−iη(P, X)}; P on the shell q(P) = (mc/ħ)²; the straight worldline X(τ) = X₀ + (cτ/μ)P of the same on-shell momentum, on which τ is proper time; the sign convention e^{−iη(P, X)} (the opposite convention reverses the sign). On another worldline the rate differs (lab frame: ω).

Open, not investigated (Q17-4): Is there a physically meaningful formulation in which mass/rest energy acts as a genuine spectral variable conjugate to proper time?

## G. Positive and negative frequency

- **Mathematics.** Mathematical Fourier redundancy: the same theorem in two variables. A real field has φ̃(−ω, −k) = conj φ̃(ω, k), i.e. b(k) = conj a(−k) (P17Rb, P17Rc). The partner of (ω, k) is (−ω, −k), not (−ω, k) (P17Rd).
- **When it holds.** It follows from the field being real, and only then: the equation admits complex solutions (P17Re); the reality pairing is available because the operator commutes with conjugation (P17Ra); for iψ_t + αψ_xx = 0 it is not (P17Rf, a PDE contrast only).
- **Classical physical reading.** Physical mode interpretation (classical): a real field's negative-frequency part is fixed by its positive-frequency part; together they make one set of real oscillations. Which half is called positive depends on the sign convention (P17Db, P17Ce).
- **Quantum reading.** Quantum particle/antiparticle interpretation: NOT USED. It needs a specific field theory and is recorded as a future branch.

For a real classical field the space-time spectrum satisfies φ̃(−ω, −k) = conj φ̃(ω, k): the reality condition pairs the mode at P = (ω/c, k) with the mode at −P, which lies on the same level set of q and on the other branch.

## H. Comparison with true Fourier conjugacy

Seven kinds of pairing are kept apart: conjugacy, sign symmetry, orbit symmetry, reality constraint, independent physical states, notation-dependent pairing, and Fourier duality.

| Kind | Meaning | Examples | Cards |
|---|---|---|---|
| conjugacy | an antilinear involution relating X(ω) and X(−ω) (C̃), defined on any spectrum | C̃ on x̂; P ↦ −P with conjugation on φ̃ | P17Fb, P17Rc |
| reality constraint | the condition that an object be fixed by that involution (x = conj x ⟺ X = C̃X) | real signals; real fields: b(k) = conj a(−k) | P17Fa, P17Rb |
| sign symmetry | a reflection that preserves a relation, imposing nothing on amplitudes | k ↦ −k and ω ↦ −ω on the dispersion relation (P17-X2) | P17Ca, P17Cb |
| orbit symmetry | a group element moving points within one level set | boosts along a mass-shell branch; Doppler scaling on the cone | P17De, P17Dh |
| independent physical states | two modes related by a symmetry whose amplitudes are independent | right- and left-movers (ω, ±k) | P17Rd, P17Cb |
| notation-dependent pairing | a pairing that exists in one representation only | "positive / negative frequency" labels; the (ω, −ω) pair of a real signal, absent in the one-sided and cos/sin representations (P17-X5) | P17Ce, P17Db |
| Fourier duality | a bilinear pairing between a variable and its Fourier variable (a different meaning of "conjugate"); the uncertainty inequality belongs here (T5) | (t, ω), (x, k). Not established for mass and proper time (P17Lf) | P17Cf, P17Lf |

| Pairing asked about | Verdict |
|---|---|
| (k, −k) or (ω, −ω) alone | sign symmetry of the relation; not conjugacy (P17Cb, P17Rd) |
| (ω, k) and (−ω, −k) with conjugate amplitudes | conjugacy / reality constraint — the same theorem as #12 (P17Rc, P17Cg) |
| the mass shell | a different sort of pairing: a level set with two branches exchanged by −I (sign symmetry as points); mass labels the level, it is not paired with (ω, k) (P17Ca, P17Ch) |
| Lorentz boosts | orbit symmetry: they relate points on the same branch of the same level set (P17De); null rays are only rescaled (P17Dh) |
| real-field condition | produces a meaningful conjugate pairing of positive- and negative-frequency modes, of the (ω, k) ↔ (−ω, −k) kind, as a reality constraint, not as two physical entities (P17Rb, P17Cd) |

## I. The mass/wave seed: exact readings

The seed "mass is waves too, it's just a different form." is kept verbatim and not promoted (T-MASS-WAVE-SEED stays a HYPOTHESIS). What it yields in this pass: three precise questions (MW-A, MW-B, MW-C) with exact answers and one interpretive statement (MW-D) left OPEN. Not reinterpreted as QFT.

| Reading | Words (2026-11-17 decisions) | Precise form | Status | Basis | Cards |
|---|---|---|---|---|---|
| MW-A — de Broglie relation | Massive particles admit wave variables through: | E = ħω, p = ħk | **RESTRICTED** | RESTRICTED to the physical setting where E = ħω and p = ħk apply (identifications used as inputs). Derived under them, with assumptions explicit: v_g = dω/dk = c²k/ω = pc²/E; for a relativistic particle with p = γmv and E = γmc², pc²/E = v; ω₀ = mc²/ħ at k = 0 (P17Eb); the level-set geometry is rescaled by ħ (P17Ea). Not classical identities; no physical data carded here | P17Ea, P17Eb, FB8a |
| MW-B — common quadratic geometry | Massless and massive cases occupy different level sets of the same Lorentzian quadratic form in energy-momentum / spectral variables. | q(P) = 0 vs q(P) = (mc/ħ)² | **ESTABLISHED** | exact: one Lorentzian quadratic form; m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level). Spectral variables, not spacetime (P17Dc, P17De, P17Di, P17Lg, FB8b) | P17Dc, P17De, P17Di, P17Lg, FB8b |
| MW-C — conjugate pairing | Mass and wave variables form a conjugate pair in the same mathematical sense as Fourier conjugates. | complex conjugacy between m and (ω, k) | **FAIL** | FAIL: complex conjugation maps the mass-m shell to itself and never relates m to (ω, k) (P17Ch). What survives: mass determines the invariant mass-shell level and the associated rest-frame/proper-time phase rate. (P17Lb, P17Lg). That is not a conjugate pairing, and no Fourier-duality claim replaces the failure (P17Lf). The further question is kept separately as OPEN and not investigated: Is there a physically meaningful formulation in which mass/rest energy acts as a genuine spectral variable conjugate to proper time? | P17Ch, P17Lf |
| MW-D — representation statement | Particle-like and wave-like descriptions may be different representations/aspects of the same physical state. | a physics interpretation | **OPEN** | OPEN, not promoted: a physics interpretation that requires exact theory-specific wording. The classical elastic-foundation counterexample stays in the record because the same dispersion equation alone cannot establish particle ontology (P17Mx) | P17Mx |

## J. Counterexamples

| ID | Required (verbatim) | Example | What it breaks | Cards |
|---|---|---|---|---|
| P17-X1 | A complex signal without conjugate symmetry. | x = (1, i, 0, 0): X₃ = 0 ≠ conj X₁ = 2; e^{−t²/2}e^{it} (FB4c) | conjugacy without realness | P17Fg, FB4c |
| P17-X2 | A sign-paired relation that is not complex conjugacy. | k ↦ −k on ω² = c²k² + μ²c²: both modes allowed, amplitudes unrelated (e^{i(kx − ωt)} alone; cos(kx − ωt) with a(−k) = 0) | "± in the relation ⇒ conjugate pair" | P17Cb |
| P17-X3 | A massive dispersion relation that has no null state. | μ > 0: q(P) = μ² has no null point and does not contain P = 0 | "every dispersion level has a null state" | P17Cc |
| P17-X4 | Two mathematically paired variables that do not correspond to two independent physical entities. | X_k and X_{N−k} of a real signal; a(k) and b(−k) = conj a(k) of a real field: 8 real amplitudes, 4 independent | "two paired variables ⇒ two physical things" | P17Cd, P17Fe |
| P17-X5 | An apparent “physical pair” whose pairing disappears under a different representation. | the one-sided (analytic-signal) spectrum and the cos/sin basis carry no (ω, −ω) pair and lose nothing; the sign convention swaps the labels | "a pair in one representation is a physical pair" | P17Ce |

Supporting: P17Rf: iψ_t + αψ_xx = 0 (a PDE contrast only): one dispersion branch, conj ψ is not a solution, no reality pairing; P17Mx: a string on an elastic foundation satisfies the massive dispersion relation with no particle.

## K. Status table (separate statuses; no umbrella status)

Statuses: ESTABLISHED, DERIVED, RESTRICTED, PROJECT SYNTHESIS, FAIL, OPEN.

| Item | Status | Basis | Cards |
|---|---|---|---|
| Fourier conjugacy (real signal; continuous and DFT) | **ESTABLISHED** | for x ∈ L¹(ℝ): Hermitian symmetry ⟺ x real a.e. (forward P17Fa; converse by uniqueness on L¹, Zhou–Siadat Theorem 1.15, read; exact without imported theorems for finite signals and finite Hermite expansions, P17Lc, P17Ld); DC/Nyquist self-paired; complex signals fail | P17Fa, P17Fb, P17Fc, P17Fd, P17Fe, P17Ff, P17Fg, P17Fh, FB4a, FB4b, FB4c, P17Lc, P17Ld, P17Le |
| real-field positive / negative mode relation | **DERIVED** | the established theorem in two variables: φ̃(−ω, −k) = conj φ̃(ω, k), b(k) = conj a(−k); a condition (realness), not a consequence of the equation | P17Ra, P17Rb, P17Rc, P17Rd, P17Re, P17Cg |
| massless null-cone relation (spectral variables) | **ESTABLISHED** | q(P) = 0 ⟺ ω = ±ck; not a kernel vector; distinct from the spacetime null ray, the Fourier zero and the model-manifold null | FB8b, P17Dc, P17Dd, P17Dh |
| massive mass-shell level set | **DERIVED** | m selects a nonzero timelike level of the same form; each branch is one SO⁺(1,1) orbit, preserved by proper orthochronous boosts (not by the full Lorentz group); gap; rest frame; proper-time phase rate along the worldline of the same on-shell momentum | P17De, P17Df, P17Dg, P17Di, P17La, P17Lb, P17Lg |
| E = ħω, p = ħk | **RESTRICTED** | physical identifications (Planck–Einstein, de Broglie), established in their physical context; inputs here, not classical identities; the algebra they induce is exact | FB8a, P17Ea, P17Eb |
| MW-A (de Broglie relation) | **RESTRICTED** | holds under the identifications; v_g = v and ω₀ = mc²/ħ derived | P17Ea, P17Eb |
| MW-B (common quadratic geometry) | **ESTABLISHED** | one Lorentzian form, levels 0 and (mc/ħ)² | P17Dc, P17De, P17Di, FB8b |
| MW-C (conjugate pairing) | **FAIL** | as complex conjugacy (P17Ch); what survives: mass determines the invariant mass-shell level and the associated rest-frame/proper-time phase rate. No Fourier-duality claim (P17Lf) | P17Ch, P17Lf |
| proper-time phase rate ω_C = mc²/ħ (worldline of the same on-shell momentum) | **DERIVED** | Along the worldline associated with the same on-shell four-momentum, the free massive plane-wave phase accumulates at the invariant proper-time rate mc²/ħ, up to sign convention. assumptions (P17Lb): a single free massive plane wave e^{−iη(P, X)}; P on the shell q(P) = (mc/ħ)²; the straight worldline X(τ) = X₀ + (cτ/μ)P of the same on-shell momentum, on which τ is proper time; the sign convention e^{−iη(P, X)} (the opposite convention reverses the sign). On another worldline the rate differs (lab frame: ω). | P17Dg, P17Lb |
| mass / rest energy as a genuine spectral variable conjugate to proper time | **OPEN** | not established (P17Lf); kept as Q17-4 and not investigated | P17Lf |
| boost scope on the mass shell | **ESTABLISHED** | Proper orthochronous Lorentz boosts preserve each positive- or negative-energy mass-shell branch separately. Not claimed for the full Lorentz group (S_t, −I exchange the branches) | P17La, P17Ca |
| MW-D (representation statement) | **OPEN** | theory-specific; the dispersion relation alone does not decide it (P17Mx) | P17Mx |
| kinds of pairing (seven kept apart) | **PROJECT SYNTHESIS** | classification of carded examples; not an exhaustive classification | P17Ca, P17Cb, P17Ce, P17Cf, P17Rd |
| the broader #17 physical-pair hypothesis (T-CONJUGACY) | **OPEN** | the one exact conjugate pairing found in a physical candidate is the reality constraint (the same theorem); no physical pairing of independent entities was found to be a conjugate pair; "physical complementarity" in the Fourier-duality sense is not yet tested beyond mc²/ħ ↔ τ | P17Rc, P17Cd, P17Ch |

## L. Canonical-story placement

No new story node. The Master Map order is unchanged. Edges (in `research/canonical_story.md`): 

- M12 → M17 (EARLIER PREDECESSOR): historical (existing): #17 "Begin[s] with a complex Fourier coefficient and its conjugate" (MM)
- M14 → M17 (CROSS-REFERENCE): later mathematical connection: the mass shell is a level set of the Lorentzian form; mass is the orbit invariant (P17Di), as r is for circles
- M19 → M17 (CROSS-REFERENCE): later mathematical connection: boosts act on (ω/c, k) as on (ct, x); proper orthochronous boosts preserve each mass-shell branch; Doppler on the null cone; tanh φ = ck/ω brings a positive-energy mode to rest (P17De, P17Dh, P17La)
- M18 → M17 (CROSS-REFERENCE): later mathematical connection: along the worldline of the same on-shell momentum the phase e^{−imc²τ/ħ} is a character of an unbounded parameter in the bounded circle, as in #18 (P17Lb, A8Fa); a phase rate, not a Fourier-conjugate pairing
- M13 → M17 (CROSS-REFERENCE): later mathematical connection: spectral null, spacetime null, Fourier zero coefficient and model-manifold null kept apart; the zero index P = 0 lies on the massless cone only (P17Dd, P17Cc)

### Story contribution

| Result | Historical question answered | Relation discovered | Next question it creates |
|---|---|---|---|
| Fourier conjugacy, source-locked | #12 → #17: "Begin with a complex Fourier coefficient and its conjugate." (MM); what property forces the pairing? | x real ⟺ x̂(−ω) = conj x̂(ω) (the fixed points of an antilinear involution) | what information does the pairing encode? |
| what the pairing encodes | what information does the pairing encode? (2026-11-17 decisions) | one real oscillation per pair: amplitude and phase; the imaginary parts cancel; the conjugate half is redundant | do physical pairings ever share an exact relation of comparable structural depth? |
| real classical field pairing | do physical pairings ever share an exact relation of comparable structural depth? — first physical candidate | yes for a real field, and only as the same theorem: φ̃(−ω, −k) = conj φ̃(ω, k); the partners are one real oscillation, not two entities | which physical pairings are not this reality constraint? (sign symmetry, orbit symmetry, independent states) |
| kinds of pairing | "compare several kinds of pairing—mathematical conjugacy, reflection, and physical complementarity—and investigate which share formal properties" (MM #17) | seven kinds kept apart, with the criteria TC1–TC7 and levels L0–L3 | in which sense of "conjugate" is "physical complementarity" meant: complex conjugacy or Fourier duality? |
| massless null relation | in what sense is ω² = c²k² null? (2026-11-17 decisions) | the null level of q in spectral variables; four nulls kept apart (#13 ⇢ #17) | what does m change? |
| massive level set | Does mass appear as a parameter selecting a non-null level set of the same quadratic form whose m=0 case is null? (2026-11-17 decisions) | yes: Mass labels/selects the invariant level of the same Lorentzian quadratic form. m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level). Proper orthochronous boosts preserve each branch; gap; rest frame (#14 ⇢ #17, #19 ⇢ #17) | is mass paired with wave variables (MW-C)? |
| MW-C tested | Mass and wave variables form a conjugate pair in the same mathematical sense as Fourier conjugates. (MW-C) | FAIL as complex conjugacy. What survives: mass determines the invariant mass-shell level and the associated rest-frame/proper-time phase rate. The phase e^{−imc²τ/ħ} along that worldline is a character of proper time, as in #18 (#18 ⇢ #17); it is a phase rate, not a Fourier-conjugate pairing | Q17-4 (OPEN, not investigated): Is there a physically meaningful formulation in which mass/rest energy acts as a genuine spectral variable conjugate to proper time? MW-D stays OPEN |

Next questions created (not begun):

- Q17-1: Does any physical pairing of independent entities carry an exact relation beyond the reality constraint (not reducible to conj χ = χ⁻¹)?
- Q17-2: In which sense of "conjugate" is the Master Map's "physical complementarity" meant — complex conjugacy (i) or Fourier duality (ii)?
- Q17-3: MW-D in a specific theory, with exact theory-specific wording (future branch).
- Q17-4: Is there a physically meaningful formulation in which mass/rest energy acts as a genuine spectral variable conjugate to proper time? (OPEN; recorded at the #17 lock, not investigated)

Future branches (marked, not expanded): a physical reading of the lower mass-shell branch / negative frequencies in a specific field theory (particle/antiparticle); the orbit classification of momentum space as the first step of Wigner's 1939 representation theory; position–momentum duality through p = ħk (quantum); creation/annihilation operators, CPT, Dirac sea, virtual particles — none used, none needed by any relation above.

## M. What the branch does NOT establish

- that observable physical pairs are mathematically conjugate in general (T-CONJUGACY stays OPEN)
- that mass is a wave (T-MASS-WAVE-SEED stays a HYPOTHESIS; MW-D OPEN)
- that mass and wave variables are a conjugate pair (MW-C FAIL)
- that (ω/c, k) is physical spacetime, or that the spectral null cone is the light cone
- any particle/antiparticle, QFT, CPT, creation/annihilation, Dirac-sea or virtual-particle statement
- a physical meaning of the lower branch
- that E = ħω and p = ħk are classical identities
- that the elastic-foundation string and a massive particle are the same physics
- any physical validation (no physical data are carded)
- anything about Energeo / finite energy (#20)

## N. Ratings (secondary metadata)

| Item | Backbone Support | AI Slop / Delusion Risk | Transfer Depth | Application Breadth | Why |
|---|---|---|---|---|---|
| Fourier conjugacy source lock (P17F) | 15% | 5% | not a transfer | 2 | textbook; locked as the source relation with its exact forcing property and exceptions |
| real-field reality pairing (P17R) | 20% | 10% | TRIVIAL CONSEQUENCE | 2 | the same theorem in two variables; exact, but adds no physical relation beyond realness |
| massless spectral null (P17N) | 20% | 10% | TRIVIAL CONSEQUENCE | 2 | the Z5 null of the η-form in spectral variables; kept apart from three other nulls |
| mass shell: level, orbit invariant, gap, proper-time rate (P17M) | 30% | 15% | STRUCTURAL TRANSFER | 2 | the #14 chart (preserved form → generator → orbit) applies unchanged in spectral variables: m selects the invariant level (P17Lg), each branch is one SO⁺(1,1) orbit (P17La); m plays the orbit-invariant role, not the role of c |
| E = ħω, p = ħk scaling (P17E) | 15% | 10% | TRIVIAL CONSEQUENCE | 1 | a linear scaling by ħ; the content is the physical identification, an input |
| kinds of pairing (P17K) | 30% | 15% | not a transfer | 3 | separates conjugacy from sign symmetry, orbit symmetry, independent states, notation and duality on carded examples; not exhaustive |
| proper-time phase rate (P17C) | 15% | 10% | TRIVIAL CONSEQUENCE | 2 | exact under the stated assumptions (P17Lb); a phase rate, not a Fourier-conjugate pairing (P17Lf) |
| MW-C as conjugacy | 0% | 5% | FAIL | 1 | conjugation fixes m |
| T-CONJUGACY (#17 hypothesis) | 15% | 30% | NOT YET FORMALIZED | 2 | one physical candidate reproduces the source structure only as the same theorem; no independent physical pair found conjugate; the question stays open |

Application Breadth: Fourier signals (continuous, DFT) and one classical field family (Klein–Gordon form; elastic-foundation string as a second realization of the same equation) — 2 independent mathematical families; no physical system or dataset.

## O. Files

- `verify/verify_P17.py` (34 cards, one ledger run); `research/tools/p17_source.py` → `research/p17.json`, this record.
- Registry: T-P17-GOV, T-P17-CRITERIA, T-P17-DEPTH, T-MW-A, T-MW-B, T-MW-C, T-MW-D, T-P17-REALFIELD, T-P17-MASS-LEVEL, T-P17-PAIRING-KINDS, T-P17-REST-CLOCK; notes on T-CONJUGACY, T-MASS-WAVE-SEED, T-MASS-WAVE, T-MASS-WAVE-Q, T-MATTER-FIELD.
- Foundation: objects P17F, P17R, P17N, P17M, P17E, P17K, P17C, P17MW, P17X; bridges BR87–BR92; domain D41; sources SRC-FOLLAND-1995, SRC-SCOTT-1969, SRC-WIGNER-1939 (bears on only).
- Canonical story: cross-reference edges #13, #14, #18, #19 ⇢ #17; chain P17. Master map: Part III block "#17: conjugacy and physical pairs"; Parts X, XII, XIII, XV. Application matrix: version 5.

## P. Recommendation

**READY FOR #17 ADVERSARIAL LOCK**

Every item of the construction brief is answered by PASS cards in the decided order: the source relation is locked with its forcing property and exceptions; the criteria and levels are defined before the physical candidates; the dispersion, null and level-set mathematics is carded in spectral variables; the positive/negative-frequency relation is derived and separated from its physical and quantum readings; MW-A–MW-D each have their own status; the five required counterexamples are carded; statuses are separate. (Construction-pass recommendation, kept as history; the lock verdict is below.)

Lock targets: re-derive the realness ⟺ Hermitian-symmetry converse (Fourier uniqueness, source-only) and the 2D pairing with an independent card; audit every live statement for an implied "physical pairs are conjugate" or "mass is a wave"; check the four new cross-reference edges against the historical record (they must stay cross-references); decide whether Q17-2 (complementarity as Fourier duality) is in scope for the #17 lock or a separate question.

Limits: The broader #17 hypothesis and MW-D stay OPEN; they are open research questions, not misplacements.

## Q. Final adversarial lock (2026-11-17)

**LOCK #17 — STORY AND MATHEMATICS ALIGNED**

The four flagged statements are corrected (boost scope, mass selects the level, the scoped proper-time phase rate, the withdrawn Fourier-duality claim); the Fourier converse is source-locked from a text actually read and proved exactly on finite signals and finite Hermite expansions; MW-A–MW-D keep separate statuses with the MW-C failure unsoftened; the live-text audit finds no remaining claim of the six flagged kinds; #12 → #17 stays the only historical edge into #17, and #13, #14, #18, #19 stay cross-references.

Story order kept: Fourier conjugacy → question about physical pairings → candidate mass/wave investigation → exact mass-shell relation → failed conjugacy interpretation → more precise open question.

### The Fourier converse

- Statement: for x ∈ L¹(ℝ): x̂(−ω) = conj x̂(ω) for every ω ⟺ x is real almost everywhere.
- Forward: x real ⇒ Hermitian symmetry: the identity x̂(−ω) − conj x̂(ω) = 2i·v̂(−ω), v = Im x (P17Fa).
- Converse: Hermitian symmetry ⇒ x real a.e.: with y = conj x, ŷ(ω) = conj x̂(−ω) (P17Le), so ŷ = x̂ and the uniqueness theorem on L¹ gives y = x a.e. — Zhou and Siadat, Notes on Harmonic Analysis I (arXiv:1709.03377), Theorem 1.15: "If f ∈ L1 (R) and fˆ = 0 everywhere (fˆ is always continuous), then f = 0 a.e." (full text read; research/sources/zhou_siadat_2017.md).
- Independent exact proofs: proved exactly without importing any theorem: finite signals, every N (P17Lc: F F* = N·I; a Hermitian-symmetric X has a real inverse); finite Hermite expansions (P17Ld: the defect has h_n-coefficient 2i√(2π)iⁿ·Im c_n); and, given the inversion theorem (x, x̂ ∈ L¹), the imaginary part of the inversion integral has an odd integrand (P17Le).

### Mathematical lock

| Live statement | Cards | Assumptions / scope |
|---|---|---|
| Fourier conjugacy: x ∈ L¹, Hermitian symmetry ⟺ x real a.e. | P17Fa, P17Lc, P17Ld, P17Le, FB4a, FB4b, FB4c | converse by uniqueness on L¹ (Zhou–Siadat Th. 1.15, read); exact without imported theorems for finite signals and finite Hermite expansions |
| real-field reality pairing P ↦ −P | P17Rb, P17Rc, P17Rd, P17Re, P17Cg | a real field; the partner of (ω, k) is (−ω, −k) |
| massless null level (spectral) | P17Dc, P17Dd, P17Dh, FB8b | spectral variables; distinct from the spacetime null and every other zero / null |
| m selects the level: m = 0 ⇒ q(P) = 0; m > 0 ⇒ q(P) = (mc/ħ)² > 0 | P17Db, P17De, P17Lg | the form and the group do not depend on m |
| proper orthochronous boosts preserve each branch | P17La, P17De | not the full Lorentz group |
| proper-time phase rate mc²/ħ | P17Dg, P17Lb | single free plane wave; worldline of the same on-shell momentum; sign convention |
| MW-C FAIL | P17Ch, P17Lf | no Fourier-duality claim replaces it |
| MW-D OPEN; the dispersion equation alone cannot establish particle ontology | P17Mx | the elastic-foundation string |

### Live-text audit

| Wording searched for | Result |
|---|---|
| physical pairs are generally complex conjugates | none live; T-CONJUGACY OPEN; the only exact conjugate pairing found is the reality constraint of a real field (P17R) |
| mass is a wave | none live; stated only as what is not established (T-MASS-WAVE-SEED stays a HYPOTHESIS) |
| mass and wave are Fourier-conjugate | withdrawn: the construction-pass wording "mc²/ħ and proper time are a Fourier-dual pair" is superseded (P17Lf); the further question is Q17-4 (OPEN) |
| positive and negative frequency automatically mean particle/antiparticle | none live; the quantum reading is "NOT USED" (G) |
| the spectral mass shell is physical spacetime | none live; "spectral variables, not spacetime" (D, E) |
| every Lorentz transformation preserves an energy branch | corrected: only proper orthochronous boosts; S_t and −I exchange branches (P17La) |
| mass changes the shape of the geometry | corrected: mass selects the level; the form and the group are the same for every m (P17Lg) |

### Superseded construction-pass wording (kept)

The two sentences below were the original wording of registry records T-P17-REST-CLOCK (superseded by T-P17-PHASE-RATE) and T-P17-MASS-LEVEL (normalized statement corrected). They are kept as provenance, not as live claims.

> Along the group worldline of any mode on the mass shell the phase advances at mc²/ħ per unit proper time, so the rest frequency mc²/ħ and proper time τ are a Fourier-dual pair; this is duality, not complex conjugacy.

> In the spectral variables P = (ω/c, k) the dispersion relation is the level set q(P) = (mc/ħ)² of the Lorentzian form q = (ω/c)² − k²: m = 0 selects the null level, m > 0 a non-null level whose branches are single boost orbits, with mc/ħ the orbit invariant.

| Where | Old | New | Why |
|---|---|---|---|
| B. source relation, continuous | x̂(ω) = ∫x(t)e^{−iωt}dt. For x = u + iv: x̂(−ω) − conj x̂(ω) = 2i·v̂(−ω). So x̂(−ω) = conj x̂(ω) for every ω ⟺ v = 0 (Fourier uniqueness). Realness is exactly the property that forces the conjugacy | x̂(ω) = ∫x(t)e^{−iωt}dt. For x = u + iv: x̂(−ω) − conj x̂(ω) = 2i·v̂(−ω). For x ∈ L¹(ℝ): x̂(−ω) = conj x̂(ω) for every ω ⟺ v = 0 almost everywhere — the converse by the uniqueness theorem on L¹ (Zhou–Siadat Theorem 1.15, read), and independently for finite signals and finite Hermite expansions. Realness is exactly the property that forces the conjugacy | lock 5: the converse source-locked and carded |
| B. what forces the conjugacy | x = conj x (realness), and nothing weaker: the defect of the symmetry, x̂(−ω) − conj x̂(ω), is exactly 2i·v̂(−ω), where v = Im x, and v̂ ≡ 0 only for v = 0 (P17Fa). | x = conj x (realness), and nothing weaker: the defect of the symmetry, x̂(−ω) − conj x̂(ω), is exactly 2i·v̂(−ω), where v = Im x, and v̂ ≡ 0 only for v = 0 a.e. (P17Fa; uniqueness on L¹, Zhou–Siadat Theorem 1.15; exact without imported theorems for finite signals, P17Lc, and finite Hermite expansions, P17Ld). | lock 5 |
| F. massive level set, row 2 | each branch is one SO⁺(1,1) orbit: the boost with tanh φ = ck/ω (= v_g/c) carries any point to the rest point (μ, 0); boosts never change the branch | Proper orthochronous Lorentz boosts preserve each positive- or negative-energy mass-shell branch separately. Each branch is one SO⁺(1,1) orbit: the boost with tanh φ = ck/ω (= v_g/c) carries a positive-energy point to (μ, 0) and a negative-energy point to (−μ, 0). Not claimed for the full Lorentz group: time reversal S_t and −I preserve q and exchange the branches (P17La, P17Ca) | lock 1: boost scope |
| F. massive level set, row 5 | proper-time phase rate mc²/ħ along the group worldline, for every k; constant phase along the light ray when m = 0 | Along the worldline associated with the same on-shell four-momentum, the free massive plane-wave phase accumulates at the invariant proper-time rate mc²/ħ, up to sign convention. — assumptions (P17Lb): a single free massive plane wave e^{−iη(P, X)}; P on the shell q(P) = (mc/ħ)²; the straight worldline X(τ) = X₀ + (cτ/μ)P of the same on-shell momentum, on which τ is proper time; the sign convention e^{−iη(P, X)} (the opposite convention reverses the sign). On another worldline the rate differs (lab frame: ω). m = 0: the phase is constant along the light ray. This establishes a proper-time phase rate. It does NOT by itself establish that mass and proper time are Fourier-conjugate variables. | lock 3 and lock 4: scoped; no Fourier-duality claim |
| F. massive level set, row 6 | mass as the orbit invariant: μ = mc/ħ labels the boost orbit as r labels the rotation orbit (#14 chart: Kᵀη + ηK = 0, JᵀI + IJ = 0); μ is not a form parameter like c | mass selects the level: Mass labels/selects the invariant level of the same Lorentzian quadratic form. m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level). The form and the group SO⁺(1,1) are the same for every m; μ = mc/ħ labels the invariant level as r labels a rotation orbit (#14 chart: Kᵀη + ηK = 0, JᵀI + IJ = 0); μ is not a form parameter like c | lock 2: mass selects the level; no change of geometry |
| F. answer | Does mass appear as a parameter selecting a non-null level set of the same quadratic form whose m=0 case is null? Yes, exactly: m ↦ the level (mc/ħ)² of q = (ω/c)² − k²; m = 0 is the null level (P17Db, P17Dc, P17De). What m changes geometrically: the level and the orbit type (two branches instead of four null half-lines), a frequency gap, the existence of a rest frame, and a Lorentz-invariant proper-time frequency (P17Dg). This does not say that mass is a wave. | Does mass appear as a parameter selecting a non-null level set of the same quadratic form whose m=0 case is null? Yes, exactly: Mass labels/selects the invariant level of the same Lorentzian quadratic form. m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level). The form q = (ω/c)² − k² and the group acting on it are the same for every m; m does not change the geometry, it selects the level (P17Db, P17Dc, P17De, P17Lg). Consequences of the selected level (derived): a frequency gap at mc²/ħ, a rest frame, and the proper-time phase rate stated below. This does not say that mass is a wave. | lock 2 |
| C. PC-4 not shared | no transformation or involution relating them; different orbit types (four half-line orbits vs two branches) | no transformation or involution relating the levels; the null level and a timelike level of the same form carry different SO⁺(1,1) orbit structure (four null half-lines vs two branches); m selects the level, the form is unchanged | lock 2 |
| C. PC-6 | rest frequency mc²/ħ and proper time τ; kind: Fourier duality (a different meaning of "conjugate"); level: L3 of a different kind: Fourier duality, not complex conjugacy; known (de Broglie) | rest frequency mc²/ħ and the proper-time phase; kind: a proper-time phase rate — not a demonstrated pairing; level: L1: a phase-rate equation; no Fourier-conjugate pairing of m and τ is established (P17Lf) | lock 4: the Fourier-duality claim is withdrawn |
| H. kinds: Fourier duality examples | (t, ω), (x, k); mc²/ħ and proper time τ | (t, ω), (x, k). Not established for mass and proper time (P17Lf) | lock 4 |
| I. MW-A basis | established physics as identifications (inputs). Derived under them: v_g = pc²/E = v (group velocity = particle velocity) and ω₀ = mc²/ħ (P17Eb); the level-set geometry is ħ-scaled (P17Ea). Not classical identities; no physical data carded here | RESTRICTED to the physical setting where E = ħω and p = ħk apply (identifications used as inputs). Derived under them, with assumptions explicit: v_g = dω/dk = c²k/ω = pc²/E; for a relativistic particle with p = γmv and E = γmc², pc²/E = v; ω₀ = mc²/ħ at k = 0 (P17Eb); the level-set geometry is rescaled by ħ (P17Ea). Not classical identities; no physical data carded here | lock 6: assumptions explicit |
| I. MW-B basis | exact (P17Dc, P17De, P17Di, FB8b); spectral variables, not spacetime; mass is the orbit invariant (r-role, not c-role) | exact: one Lorentzian quadratic form; m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level). Spectral variables, not spacetime (P17Dc, P17De, P17Di, P17Lg, FB8b) | lock 2 |
| I. MW-C basis | complex conjugation maps the mass-m shell to itself and never relates m to (ω, k) (P17Ch). Restricted different reading: mc²/ħ and proper time τ are Fourier-dual along the group worldline (P17Dg) — RESTRICTED, known (de Broglie), and not the same sense as Fourier coefficient conjugacy | FAIL: complex conjugation maps the mass-m shell to itself and never relates m to (ω, k) (P17Ch). What survives: mass determines the invariant mass-shell level and the associated rest-frame/proper-time phase rate. (P17Lb, P17Lg). That is not a conjugate pairing, and no Fourier-duality claim replaces the failure (P17Lf). The further question is kept separately as OPEN and not investigated: Is there a physically meaningful formulation in which mass/rest energy acts as a genuine spectral variable conjugate to proper time? | lock 4 and lock 6: the failure is not softened |
| I. MW-D basis | requires exact theory-specific wording; not established by the dispersion relation, which a string on an elastic foundation also satisfies (P17Mx) | OPEN, not promoted: a physics interpretation that requires exact theory-specific wording. The classical elastic-foundation counterexample stays in the record because the same dispersion equation alone cannot establish particle ontology (P17Mx) | lock 6 |
| K. Fourier conjugacy basis | realness ⟺ Hermitian symmetry; DC/Nyquist self-paired; complex signals fail | for x ∈ L¹(ℝ): Hermitian symmetry ⟺ x real a.e. (forward P17Fa; converse by uniqueness on L¹, Zhou–Siadat Theorem 1.15, read; exact without imported theorems for finite signals and finite Hermite expansions, P17Lc, P17Ld); DC/Nyquist self-paired; complex signals fail | lock 5 |
| K. massive level set basis | hyperbola branches = boost orbits; gap; rest frame; proper-time phase rate; mass = orbit invariant | m selects a nonzero timelike level of the same form; each branch is one SO⁺(1,1) orbit, preserved by proper orthochronous boosts (not by the full Lorentz group); gap; rest frame; proper-time phase rate along the worldline of the same on-shell momentum | lock 1 and lock 2 |
| K. MW-C basis | as complex conjugacy; the Fourier-duality reading mc²/ħ ↔ τ is a separate RESTRICTED result | as complex conjugacy (P17Ch); what survives: mass determines the invariant mass-shell level and the associated rest-frame/proper-time phase rate. No Fourier-duality claim (P17Lf) | lock 4 |
| K. status table | MW-C′ (rest frequency and proper time, Fourier duality): RESTRICTED — exact along the group worldline; known (de Broglie); a different meaning of "conjugate" | proper-time phase rate ω_C = mc²/ħ (worldline of the same on-shell momentum): DERIVED | lock 3 and lock 4 |
| L. story: massive level set | yes: m labels the level and the orbit (r-role); gap; rest frame; invariant proper-time frequency (#14 ⇢ #17, #19 ⇢ #17) | yes: Mass labels/selects the invariant level of the same Lorentzian quadratic form. m = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level). Proper orthochronous boosts preserve each branch; gap; rest frame (#14 ⇢ #17, #19 ⇢ #17) | lock 1 and 2 |
| L. story: MW-C | FAIL as complex conjugacy; mc²/ħ and proper time are Fourier-dual (a different sense; #18 ⇢ #17) | FAIL as complex conjugacy. What survives: mass determines the invariant mass-shell level and the associated rest-frame/proper-time phase rate. The phase e^{−imc²τ/ħ} along that worldline is a character of proper time, as in #18 (#18 ⇢ #17); it is a phase rate, not a Fourier-conjugate pairing | lock 4 |
| L. story: MW-C next | MW-D needs a specific theory and exact wording (OPEN; future branch) | Q17-4 (OPEN, not investigated): Is there a physically meaningful formulation in which mass/rest energy acts as a genuine spectral variable conjugate to proper time? MW-D stays OPEN | lock 4 |
| N. ratings: mass shell | the #14 chart (preserved form → generator → orbit) applies unchanged in spectral variables and gives the exact role of m (orbit invariant), not c | the #14 chart (preserved form → generator → orbit) applies unchanged in spectral variables: m selects the invariant level (P17Lg), each branch is one SO⁺(1,1) orbit (P17La); m plays the orbit-invariant role, not the role of c | lock 1 and 2 |
| N. ratings | MW-C′: mc²/ħ ↔ proper time (P17C): 20% / 25%, STRUCTURAL TRANSFER | proper-time phase rate (P17C): 15% / 10%, TRIVIAL CONSEQUENCE | lock 4 |
| L. edge M19 ⇢ M17 | later mathematical connection: boosts act on (ω/c, k) as on (ct, x); Doppler on the null cone; tanh φ = ck/ω brings a massive mode to rest (P17De, P17Dh) | later mathematical connection: boosts act on (ω/c, k) as on (ct, x); proper orthochronous boosts preserve each mass-shell branch; Doppler on the null cone; tanh φ = ck/ω brings a positive-energy mode to rest (P17De, P17Dh, P17La) | lock 1 |
| L. edge M18 ⇢ M17 | later mathematical connection: the proper-time phase e^{−i(mc²/ħ)τ} is a character of an unbounded parameter in the bounded circle, as in #18 (P17Dg, A8Fa) | later mathematical connection: along the worldline of the same on-shell momentum the phase e^{−imc²τ/ħ} is a character of an unbounded parameter in the bounded circle, as in #18 (P17Lb, A8Fa); a phase rate, not a Fourier-conjugate pairing | lock 3 and 4 |

### Stopping point

Research is paused after the #17 lock. No subsequent branch has been started. The preview represents the current canonical state of the project.
