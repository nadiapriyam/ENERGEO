# Research method: outside-in geometry construction

This is the canonical protocol for every research pass in Geometry of Representation. Other files point here and
do not restate it. It rests on two of Nadia's backbone decisions in `docs/restructure_decisions.md`:

- **Research method: theorem-seeking.** It is kept, now as the secondary mode.
- **Outside-in geometry construction.** It sets the primary direction.

It governs how research is conducted. It does not change the epistemic-status system. Every substantive result also
carries the ratings of §12.

> construct first → derive consequences → test across contexts → compare to existing mathematics

> **Construct first. Apply unchanged. Record what survives and what fails.**
>
> **Construct first. Classify second.**
>
> **Preserve the zero. Investigate its geometry.**
>
> **Zero is a connector/interface, not automatically a lower-dimensional object.**
>
> **Known structures are examples, not the boundary of the search space.**
>
> **Look from the outside in.**
>
> **A construction must survive independent application before it can count as backbone proof.**
>
> **Low support means continue carefully, not discard.**
>
> **Archive only after repeated independent mathematical/empirical failure.**
>
> **Do not invent a geometry that only works because we designed it around the answer.**

---

## 1. Direction: outside-in

The primary direction:

> observe / collect relations → construct a geometry → discover the rules of that geometry → determine which known structures it contains

In full:

> phenomena / zero / cancellation / relation → collect exact behavior → construct representation → construct geometry → infer its internal rules → test those rules across systems → only then compare against existing mathematics

Not this, which is inside-out:

> user theory → search existing mathematics → identify nearest theorem → fit theory into theorem

Existing mathematics is a reference library and a validation surface. It is also a source of already-known special
cases, of proof techniques, and of counterexamples and boundaries. It is not the ontology from which Nadia's
geometry must be assembled.

The intended eventual result is a geometry that acts as a **guide for existing structures**, rather than merely a
guide *to* them. This direction is never silently reversed.

## 2. Working stance: the theory holds during construction

> The theory is the fixed research target; the proof is what must be found.

> Search as though the theorem is true. Report only what the evidence actually proves.

During construction, Nadia's theory or premise is taken as true, and its consequences are built. A pass does not
spend its effort deciding whether the premise deserves investigation. It does **not** open with:

- Is this true?
- Is this plausible?
- Is there anything vaguely related?
- What existing theory is closest?

It opens with construction questions:

- If this holds, what must the geometry look like?
- What exact behavior has been observed? Which relations hold exactly, and which stay fixed while the system changes?
- What representation makes the statement exact? What object realizes it?
- What map sends the compared systems into a common space?
- What invariant would have to be preserved, and by which transformations?
- What assumptions make it exact?
- If the current formulation fails, which exact assumption or quantifier fails?

**When the wording has several exact readings,** each reading becomes its own construction branch, labelled as a
reading. None is chosen silently (see "0 is orthogonal", §11). The prompt's rule still holds: Claude does not fill
a gap with its own reading.

## 3. Primary mode: geometry construction

**Construction rule.** Do not search for the named structure before constructing the relational object.

- **Not this:** Stage 2 looks tetrahedral → search regular simplex theorem → explain Stage 2 as simplex geometry.
- **This:** derive the projected vectors → compute their Gram matrix → discover equal norms + equal pairwise
  products + zero sum → characterize the resulting object → only then compare to regular-simplex theory.

The first construction done this way is `research/constructions/r4_tetrahedral_zero.md`.

Each step produces something that can be checked. The registry carries the program as each record's
`construction` field (§9).

| Step | What it produces |
|---|---|
| 1. Observe, collect relations | the exact behavior: which quantities, which relations hold exactly, what stays fixed while the system changes |
| 2. Construct a representation | the objects and the maps that carry the observed relations exactly |
| 3. Construct a geometry | the space those maps land in, with what is preserved in it |
| 4. Infer its internal rules | the constraints, invariants, preserved relations and repeated behavior that follow (DR-3's questions) |
| 5. Test the rules across systems | each rule tested on another system, with its own card; no data crosses a pair |
| 6. Then compare with existing mathematics | the secondary mode (§6) |

The geometry is derived from the behavior. It is never chosen because an existing theory already uses it.

**Common structure.** Construct the common geometry first. Then determine what mathematical equivalence relation
best describes what emerged. These are comparison tools, not a ladder that decides the answer:

- the same equation;
- the same invariant;
- the same group action;
- isomorphism.

The final common structure is not decided in advance to be an equation, an invariant, a group, an isomorphism, a
category, a manifold, a Fourier representation, or any currently named object. The geometry is primary; its
classification is secondary.

**Distinguished-direction rule** (methodology decision, 2026-11-12):

A distinguished direction may only enter a construction if it is independently specified by the system before observing the desired zero.

- **Required order:** system identifies d independently → derive its map → predict the zero → test the prediction.
- **Forbidden order:** observe zero → choose d that makes the map work.
- **Why:** if d is chosen after the zero is seen, almost any codimension-one relation can be written as the removal
  of a chosen direction, and the construction loses its power to discriminate.
- **The current state:** C_G stays locked to the uniform direction **1**, with positive diagonal G. The general case
  remains an open question (`Q-DISTINGUISHED-MODE`), not an active family.

**Independent-symmetry rule** (B-INDEPENDENT-SYMMETRY, 2026-11-12):

A zero may be analyzed together with structures or symmetries independently supplied by its system.

Examples include:

- particle/subsystem exchange;
- rotational symmetry;
- translation symmetry;
- permutation symmetry;
- reflection;
- time translation;
- another independently defined group action.

These are known examples, not an exhaustive classification for this project.

A symmetry cannot be introduced because it happens to distinguish the zero states after inspection. It must exist
independently in the system before the desired distinction is examined. No symmetry is part of the universal
definition of a zero.

**Possible architecture, not formalized.** The final geometry need not reduce every zero to one operator. It may be
one broader geometry containing several zero mechanisms. Examples so far:

- additive;
- centering;
- orthogonal;
- quadratic;
- spectral;
- observable.

These are known examples, not an exhaustive classification for this project. A branch is not rejected because it
fails C_G.

**Representation-change template.** Every construction records:

- the source object;
- the map / representation;
- the target object;
- what survives;
- what collapses;
- what becomes zero;
- what remains reconstructible (with the map known, and with it unknown);
- what information is lost.

**Recurring invariant question.** After every representation change, ask: *What survived?* and *What disappeared or
collapsed?* The invariant is not assumed known in advance. This question recurs throughout the project:

- R4 → R3;
- circle generation;
- Fourier;
- phase / magnitude;
- quadratic geometry;
- wavelets / scattering;
- information geometry;
- relativity;
- Energeo.

It has no separate Act.

## 4. The zero program

### 4.1 Zero Preservation Rule (permanent)

**The rule** (method, `B-ZERO-PRESERVE`): do not leave the defining zero merely to make the system observable. When
the defining state is F(x) = 0, research performs **zero-preserving interrogation**. The system is not perturbed
merely so that F(x) ≠ 0 in order to obtain more information.

**The hypothesis it is kept apart from** (theory target, `B-ZERO-LOSS`): leaving a natural zero/cancellation state
may destroy information encoded in the relations that generated that zero.

The rule does not depend on whether the hypothesis is proved.

"Zero-preserving" means the defining zero relation is preserved. It does not mean nothing in the state changes:
"non-perturbing measurement" is not used as a universal phrase.

- **Not the program:** hidden zero → perturb system → obtain visible nonzero response → infer hidden state. MRI's
  external field is the motivating example of this.
- **The program:** zero remains zero → examine its internal structure → examine its geometry → examine other
  relations, invariants and measurements → examine transformations that remain inside the zero state → examine the
  larger space from which the zero state arises.
- **The exception:** the defining zero stays intact unless a separate experiment explicitly studies what is lost
  by leaving it. Such an experiment is labelled as one.

### 4.2 "From the zero itself"

This does not mean the scalar 0 alone. It means *the complete structure of the system while its defining relation
remains zero*. All of these are open to investigation without breaking the zero:

- other observables;
- internal relations;
- pairwise relationships;
- higher-order quantities;
- symmetry, transformations and invariants;
- configuration-space structure;
- dimensional structure;
- origin structure;
- higher-dimensional representations;
- families of zero-producing configurations, and the relations between them.

"Do not perturb zero" never means "do not inspect the state". The opposite is intended: inspect the zero state more
deeply rather than destroying it.

*Example already in the repository: zero-preserving interrogation in stage 2b.*

- S_z = 0 for both states A and B. S² commutes with S_z (Q1e).
- Measuring S² preserves the defining zero for **every** state with S_z = 0: both outcomes still have S_z = 0 (Q1g).
- The state itself can change inside the S_z = 0 eigenspace. For |↑↓⟩ the outcomes are A and B, neither a
  multiple of |↑↓⟩ (Q1h).
- A and B, being eigenstates of S², happen to be left unchanged (Q1b, Q1h).

The measurement distinguishes A from B without leaving the zero. That is the rule's sense of "preserving".

### 4.3 The larger generating geometry (B-HIGHER-GEOMETRY)

> The most likely way to find the hidden information is to look at the bigger picture: the geometry of the origin geometry — for example, the four-dimensional geometry behind a three-dimensional manifestation.

**Zero as connector.** A zero may appear as a resultant in one representation while connecting to nonzero relations in
a larger/source representation. The zero is an interface between descriptions; it is not "the lower-dimensional
object", and a higher dimension does not automatically explain it.

- **Established linear case** (G4a): Σᵢ L xᵢ = L(Σᵢ xᵢ), so Σᵢ L xᵢ = 0 iff Σᵢ xᵢ ∈ ker L. A source relation in
  ker L becomes a zero in the target.
- **The project hypothesis** (`T-ZERO-CONNECTOR`) is broader and is not established by the linear case.
- **The inverse problem** (`Q-R4-8-INVERSE`): without knowing L, the target zero alone does not determine whether,
  or which, source relation was removed (G4c). With the source class known, it can be (G3b).

*Superseded wording, kept as Nadia's:* "the zero/lower-dimensional state is carrying structure inherited from a
larger geometry" (B-HIGHER-GEOMETRY's variants). During construction the premise holds in the connector form above.
Its consequences are constructed:

- If this is true, what must the larger geometry look like?
- Which relations in the observed state would be shadows/restrictions of relations there?
- Which quantities would become distinguishable in the larger geometry?
- What transformations in the larger geometry leave the observed zero unchanged?
- What information is lost when the larger structure is viewed only through the lower-dimensional representation?
- Can multiple observed zero states correspond to different locations/orientations/relations in the larger geometry?

These are possible realizations to be tested:

- projection;
- embedding;
- section;
- quotient;
- fiber;
- shadow;
- boundary;
- higher-dimensional state space;
- configuration space;
- Hilbert space.

*These are known examples, not an exhaustive classification for this project.* Existing quantum formalisms are
known realizations to compare against afterwards. They do not limit what may be constructed.

Structures are named only once the mathematics establishes them. A zero-producing set is not called a kernel,
fiber, manifold, orbit, variety, equivalence class or null space before that.

### 4.4 Three operations, kept apart

| Operation | Record | Example |
|---|---|---|
| Leave the zero | `B-ZERO-LOSS` (hypothesis: leaving may destroy information) | MRI's external field (motivating) |
| Move or change within the zero | `B-ZERO-INTERNAL-CHANGE` (open: what changes, is destroyed, becomes distinguishable or inaccessible while the zero holds) | S² measured on \|↑↓⟩: S_z = 0 is kept, the A–B coherence is destroyed (Q1h, W1d) |
| Interrogate structure without changing the underlying state | state-preserving interrogation | S² measured on its eigenstates A or B (Q1h); computing the Gram matrix of a configuration |

Zero-preserving interrogation covers the second and third rows. The Zero Preservation Rule forbids only the first,
done merely to obtain observability. These operations are not merged.

In Nadia's terms (transfer pass) these are:

- **A.** leaving the defining zero;
- **B.** changing the state while remaining inside the zero condition;
- **C.** extracting information while preserving both the zero and the relevant internal relation.

In quantum examples these are kept apart:

| Notion | Card that shows it |
|---|---|
| state change | Q1h |
| loss of off-diagonal coherence | W2a: ⟨1,0\|ρ\|0,0⟩ goes from ½ to 0 |
| which-path information | W1b |
| measurement backaction on an internal relation | W2c: ⟨S_z⁽¹⁾⟩ goes from ħ/2 to 0 |
| the observable value remaining zero | W2b |
| incompatible zero-preserving interrogations | W2e |

The double-slit model has no defining zero and does not prove B-ZERO-LOSS.

Four different mathematical events, never merged:

1. **Structural zero:** S_zψ = 0.
2. **Internal cancellation:** S_z⁽¹⁾ψ + S_z⁽²⁾ψ = 0, with both terms nonzero.
3. **Measurement intervention:** measuring S².
4. **Dephasing:** loss of off-diagonal coherence when the outcome is ignored.

## 5. Anti-closure rule

> DO NOT CLOSE THE SEARCH SPACE WITH KNOWN MATHEMATICS

A named mathematical structure is never assumed exhaustive merely because it is established. Whenever a text says
"the possibilities are A, B, C", it determines which of these is the case:

- **A, B, C are logically exhaustive.** Then the theorem and its assumptions are stated.
- **They are only currently known examples.** Then it says explicitly:
  *These are known examples, not an exhaustive classification for this project.*

This matters most for these, and the list is itself open:

- periodicity;
- conjugacy and pairs;
- symmetry;
- dimensions;
- zero structures;
- invariant relations;
- spectral pairs;
- geometries;
- recurrence;
- decompositions.

Fourier pairs are examples, not the universe of possible pairs. Circle periodicity is an example, not the universe
of periodic behavior. Known symmetry groups are not a precondition for describing a rule-generated geometry. Each is
an observed member of a potentially larger class.

**A behavior outside every known category** is preserved as a *candidate new class*
(`lastResearchOutcome: candidate-new-class`). It is not forced into the nearest category.

In the registry, every `construction.knownExamples` carries `exhaustive: false`. It carries `true` only with the
theorem that makes the list exhaustive (`test/method.test.js`).

## 6. Secondary mode: existing-theorem scan

This is an inside-out reference check, run after a candidate structure exists. It never redefines the primary
geometry.

| Order | Step |
|---|---|
| First | Construct what Nadia's theory requires (§3). |
| Second | Derive exact consequences. |
| Third | Search whether existing mathematics already contains the same relation, a restricted case, a coordinate realization, a similar invariant, or part of the proof. |
| Fourth | Map the known theory **into** the project's geometry, where that is justified. The project is never mapped into the known theory automatically. |

The search passes, in order, all after construction:

| Pass | What is searched |
|---|---|
| A. Exact consequence | the precise equation, transformation law, invariant or structural consequence the constructed geometry predicts |
| B. Equivalent formulations | other names for the same structure (intertwining map, unitary equivalence, conjugacy, invariant bilinear form, orbit structure, stabilizer, level set, spectral decomposition, normal form, group action, …), only when the construction calls for them |
| C. Theorem identification | named theorems or papers that prove a derived consequence or a precise special case |
| D. Proof construction | a derivation from the definitions and established results; each step a verifier card |
| E. Adversarial test | after formalization only: counterexamples to a specific quantifier, degenerate and boundary cases, which assumptions are really needed |

Adjacent frameworks are not imported because they sound relevant.

## 7. Proof obligations

When a constructed geometry yields a precise claim, it is turned into proof obligations. The registry carries this
as `proofTarget`.

```
THEORY TARGET              the statement, in Nadia's words (registry record id)
Definitions                every term, by the role it plays (prompt §2)
Objects
Candidate common representation   (from the construction)
Required map(s)
Required invariant(s)
Required transformation law
Exact theorem statement
Proof obligations
Known results that would discharge each obligation   (secondary mode)
Unresolved obligations
Adversarial / boundary checks
```

## 8. Outcome contract and counterexamples

These are not endpoints:

- interesting analogy;
- possible connection;
- there may be something here;
- this resembles X;
- more research is needed.

Every pass ends with at least one of these outcomes, recorded as `lastResearchOutcome`:

| Outcome | Value | Meaning |
|---|---|---|
| A. Exact proof / derivation | `proved` | the target follows from stated assumptions |
| B. Existing theorem | `known-theorem` | a known theorem proves a clearly specified portion (found in the secondary mode) |
| C. Constructive realization | `constructive-realization` | an explicit representation, map, invariant, transformation, geometry or model realizes the target |
| D. Precise special case | `special-case` | a nontrivial exact subclass is proved |
| E. Exact obstruction | `exact-obstruction` | a specific assumption or quantifier prevents the statement as written, e.g. "The statement fails only when Σm_i = 0." |
| F. Explicit proof obligation | `proof-obligation` | a sharply stated missing lemma, e.g. "It remains to prove that R_m and R_w intertwine the same group action." |
| G. Candidate new class | `candidate-new-class` | a constructed behavior that fits no existing category, kept as a possible new class (§5) |

**Counterexamples.** A counterexample is not permission to abandon the theory. When a formulation fails:

1. preserve the original;
2. identify the exact failed quantifier or assumption;
3. find the maximal subclass where it holds;
4. state the corrected theorem;
5. continue the program on that theorem;
6. record the relationship to the original.

In the repository:

- the original record keeps its words, and the evidence is attached as `evidenceAgainst`;
- the corrected statement is a new record, linked by `supersedes`;
- `research/theories.ids` is append-only;
- a FAIL card stays on the ledger.

A behavior that misses a known category is first checked against §5: it may be a candidate new class, not a
counterexample.

## 9. Research mode, direction and reported status

| | Research (how a theory is investigated) | Reported status (registry, app, chat) |
|---|---|---|
| Fields | `researchMode: "theorem-target"` (the theory holds during construction) · `researchDirection: "outside-in"` (construct first, classify second) | `status` |
| Values | as given | ESTABLISHED · DERIVED CONNECTION · HYPOTHESIS · OPEN QUESTION |
| Changes when | never lowered by a status | only on a verifier verdict or an established source |

Method / governance rules (kind `method-rule`, for example B-OUTSIDE-IN, B-NONEXHAUSTIVE, B-ZERO-PRESERVE) carry
`status: "governance"`: no epistemic status and no proof obligation. A scientific claim they relate to is a separate
record (B-ZERO-PRESERVE's is B-ZERO-LOSS). One record never holds both a rule and a claim.

A record can be `status: "hypothesis"` and still be investigated in full. That is intentional, and tests accept
it. A HYPOTHESIS or OPEN label describes current proof status, never how seriously the theory is pursued. Level 3
and 4 claims are still never presented as evidence. Every verifier rule in `claude_code_prompt.md` §6 applies.

The registry fields fill in gradually. Empty fields are unstarted work, not verdicts.

- **`construction`** has these parts:
  - `sequence`, the steps in Nadia's words;
  - `questions`;
  - `doNotReason`, the inside-out patterns to avoid;
  - `knownExamples`, which holds `items`, `exhaustive` and `basis`;
  - `candidateNewClasses`;
  - `source`.
- **`proofTarget`** has these parts:
  - `targetStatement` and `targetSource`;
  - the required objects, maps, invariants and equivalences;
  - `proofObligations`, `exactSearchQueries`, `knownTheorems` and `unresolvedObligations`;
  - `previousTargets`;
  - `lastResearchOutcome`.

## 10. Order: foundation, guide, translator

The Act sequence that implements this order is `docs/act_map.md`.


1. **Foundational geometry:** zero, cancellation, origin, higher-dimensional generating geometry, orthogonality,
   shape generation, finite rule / infinite continuation, part / whole, the fractal relation, representation,
   invariant relation.
2. **Mathematical guide:** Fourier, orthogonal bases, quadratic forms, information geometry, relativity,
   wavelets/scattering, other existing structures. These are known examples that the developing geometry may
   organize.
3. **Translator / application:** energy, Energeo, physical systems, space systems, other domains. These come only
   later.

The geometry is primary. Use cases are consequences, and the energy application is never the reason the
foundational geometry exists.

## 11. Examples

Each example pairs "not this" with "this". The targets are Nadia's (`restructure_decisions.md`), and the registry
record that carries each one is named. None of these is a result.

**Fourier** (`T-STAR`, `T-EVIDENCE`).
- Not this: Fourier is known → therefore Nadia's periodic structure must be Fourier.
- This: develop geometric rule → observe repeated/structured behavior → derive its representation → test whether
  Fourier analysis describes one class of that behavior.

Fourier may become a coordinate system or a known special case. It does not define all possible periodicity.

**★** (`T-STAR`). ★ is not reduced to choosing among existing definitions:
> derive the behavior generated by a geometry first

Only afterwards is it asked whether existing mathematics calls that behavior periodic, recurrent, quasi-periodic or
closed. A behavior that fits none of these is kept as a candidate new class. The earlier target, "What exact
geometric/dynamical conditions guarantee periodicity, recurrence, quasi-periodicity or bounded orbit behavior?", is
kept in `previousTargets`, because it chose from a closed menu.

**Zero** (`T-HIDDEN-FAMILY`, `B-ZERO-PRESERVE`). Given a measurement F and zero set Z = {x : F(x)=0}, characterize,
while F stays 0:

- the dimension/structure of Z;
- invariants on Z;
- transformations preserving Z;
- distinguishable quantities within Z;
- conditions under which x is identifiable from F(x)=0;
- additional observables required when it is not;
- whether the zero condition defines or implies a stronger structure;
- the larger geometry it may inherit from (§4.3).

The structure is not named before it is derived.

**Pair A** (`T-Q.pairA-transfer`).
- Not this: mass has center of mass → find center-of-mass analogue in proton zero.
- This: mass zero exposes structure → identify the structural information mathematically → ask what type of
  information a zero-state geometry can encode in general → construct the proton zero geometry → determine what
  structure emerges there.

Transfer questions stay questions. The source object's ontology is not transferred.

**Higher dimensions** (`B-HIGHER-GEOMETRY`).
- Not this: quantum mechanics uses Hilbert space → therefore the answer is Hilbert space.
- This: zero appears informationally incomplete in lower-dimensional representation → determine what larger
  geometry would make it complete → derive required properties of that larger geometry → THEN compare with
  Hilbert-space or other known constructions.

**H1** (`T-H1`). Characterize the complete class of geometric/quadratic consequences equivalent to or generated by
⟨u,v⟩ = 0, and identify which are representation invariant. This now includes the shape-generating role
(`B-ORTHO-FORM`), not only separability.

**H2** (`T-H2`). Construct the common architecture across the specified domains first, then determine which
equivalence describes what emerged (§3). Category theory enters only if an exact construction requires it.

**H3 and the finite rule** (`T-H3`, `B-FINITE-INFINITE`). Classify maps from unbounded parameters into constrained
geometries by constructing their behavior first. The circle is one known case, and the theory is not reduced to it.

**Pair B** (`T-PAIRB`). Identify the most general geometric condition that generates repeated behavior in both
spatial and temporal/phase structure. Whether the commonality is group action, compactness, symmetry, orbit
closure, or another exact structure is not chosen before it is derived.

**Mass/wave** (`T-MASS-WAVE`). Find R_m and R_w such that both systems satisfy the same relation P. That means
finding:

- the common codomain;
- the maps;
- the invariant I;
- the transformations preserving I;
- the theorem.

All of these are constructed from the two systems' behavior, not taken from a known duality.

**"0 is orthogonal"** (`T-ZERO-ORTHOGONAL`). Four readings, each a separate branch, none chosen as the intended
one:

- A: ⟨0, v⟩ = 0 for every v;
- B: ⟨u, v⟩ = 0 identifies orthogonality;
- C: a cancellation generated by a larger orthogonal organization;
- D: orthogonality participating in stable form.

## 12. Evaluation and anti-delusion (required in every substantive result)

### 12.1 Two ratings

**Backbone Support %:** how directly and deeply the result supports Nadia's actual Geometry of Representation
backbone.

| Range | Meaning |
|---|---|
| 0–20% | Little demonstrated relation to the backbone yet. |
| 20–40% | A plausible structural correlation exists but lacks a general mechanism. |
| 40–60% | An exact connection exists in one or a few cases, but generalization is weak. |
| 60–80% | A general mathematical construction supports a significant portion of the backbone, but independent applications are still missing. |
| 80–95% | General mathematics plus multiple independent realizations support the target. |
| 95–99% | Nearly complete mathematical support with clear generalization and successful independent application. |
| 100% | The specified proposition is completed under explicit assumptions and has survived application outside the examples used to construct it. Never awarded because a bespoke example can be made to fit. |

**AI Slop / Delusion Risk %:** how much of the claimed connection depends on model-created interpretation, bespoke
framing, unsupported extrapolation, or mathematics constructed only to make the target theory appear true.

| Range | Meaning |
|---|---|
| 0–5% | Standard mathematics / exact derivation / textbook-level support. |
| 5–20% | Established mathematics with a project-specific but controlled interpretation. |
| 20–40% | Meaningful construction, but the mapping to the backbone requires interpretation. |
| 40–60% | Substantial extrapolation beyond established mathematics. |
| 60–80% | Mostly speculative structural correspondence. |
| 80–100% | Little independent mathematical support; primarily model-generated narrative. |

Words such as "stronger", "closer", "promising", "interesting", "important" or "suggestive" are not used without
immediately giving three things: the exact mathematical change, the Backbone Support %, and why that percentage was
assigned.

### 12.2 The audit (every construction meant to support the backbone)

```
Mathematical status   TEXTBOOK / KNOWN | PROJECT-DERIVED FROM KNOWN DEFINITIONS | NEW PROJECT CONSTRUCTION
                      | EMPIRICAL | SPECULATIVE MAPPING
Breadth               one configuration | one mathematical family | multiple independent mathematical families
                      | multiple physical systems | real dataset(s)
Backbone Support      XX%
AI Slop / Delusion    XX%
Why                   3–5 precise sentences
Would increase        the exact missing derivation or application
Would falsify         the exact failure condition
```

The registry carries this as each assessed record's `assessment` field.

### 12.2a Transfer Depth and the separate dimensions of a rating

Every transfer (an application of a construction to a system it was not built from) gets one **Transfer Depth**:

| Value | Definition |
|---|---|
| TRIVIAL CONSEQUENCE | A broad textbook identity applies, but no project-specific structure has transferred. For example, L(x) = 0 ⟺ x ∈ ker L applied to a Fourier coefficient. |
| STRUCTURAL TRANSFER | A nontrivial configuration, representation, invariant, Gram structure, geometric constraint, or construction derived in one setting reappears in another setting without altering the mathematical rule. |
| NONTRIVIAL PREDICTIVE TRANSFER | A rule constructed before examining the target system predicts a mathematically non-obvious relation in that target, and the prediction is subsequently verified. Never awarded retrospectively because two known equations look alike. The registry requires the prediction's statement and date, recorded before the verifying card. |
| FAIL | The unchanged construction does not apply. It is not repaired merely to avoid the FAIL. |
| NOT YET FORMALIZED | No transfer has been attempted or stated precisely yet. |

**Application Breadth (0–5)** is a count, recorded in research summaries. It is not a third confidence percentage.
It records how widely the rule has actually been tested.

| Breadth | Meaning |
|---|---|
| 0 | one bespoke configuration |
| 1 | one mathematical family |
| 2 | two independent mathematical systems |
| 3 | multiple independent mathematical systems |
| 4 | at least one physical/empirical system beyond the construction domain |
| 5 | repeated cross-domain/data validation |

Breadth is not increased because a general theorem has infinitely many parameter values. Only independent systems
count.

Three things are rated separately and never conflated:

- **mathematical correctness**: established, established under assumptions, or not established;
- **Backbone Support %**;
- **Transfer Depth**.

A textbook identity can be essentially certain, rate 20% Backbone Support, and be a TRIVIAL CONSEQUENCE.

A failed template is never rescued by renaming per-system variants (T′_mass, T′_Fourier, …). If another system needs
a different construction, that construction is recorded separately under its own name. Whether both are instances of
a broader geometry is asked afterwards.

**Blind tests and knowledge leakage.** Claude knows the standard theory, so procedural blindness alone is not
enough. Two properties are kept apart:

- **Procedurally blind:** the code or record defining the descriptor was committed before the target labels were
  calculated. The ledger's commit field shows the order.
- **Mathematically novel:** the descriptor predicts a relationship not already implied by known theory.

A blind result that reproduces a known relation is reported as **VALIDATION OF KNOWN MATHEMATICS**, never as a new
predictive theorem.

The protocol is:

1. Commit the preregistration: the protocol, the target amplitudes or configurations, and the descriptor code.
2. Run the descriptor cards.
3. Write and run the reveal cards.

The first instance is `research/constructions/fourspin_mass_protocol.md`.

### 12.3 Application validity

| Test | Question |
|---|---|
| Construction | Was the rule derived independently of the desired conclusion? |
| Generalization | Does it apply to a class rather than one chosen example? |
| Transfer | Can the same rule be used unchanged on a system/domain not used to construct it? |
| Failure condition | What data/configuration would make the proposed structure fail? |
| Out-of-sample | Where applicable, does it hold on new data or a new domain without changing the rule? |

**The application standard.** For every proposed common structure, ask:

- Does the rule predict anything? A restatement does not count.
- Can it compress multiple cases, with one unchanged object explaining several rows?
- Can it distinguish cases that should differ? If every zero is called a "connector", the rule has no discriminating
  power.
- Can it fail? There must be explicit configurations where it says "not this structure".
- Does it survive new data?

A one-context construction is an **EXAMPLE**, not a **BACKBONE PROOF**. The application matrix
(`research/application_matrix.md`) records the transfer tests. The template is never altered to force agreement, and
failures are recorded.

### 12.4 Anti-slop guard

Before a construction is accepted:

1. *Would this mathematical statement still be meaningful if we removed all references to Nadia's project?* If no,
   it is likely bespoke and gets a high AI Slop / Delusion Risk.
2. *Does the same rule apply to objects that were not used when deriving it?* If no, it remains an example. If yes,
   it may be a general construction.

### 12.5 Low support is not discard

Weak evidence ≠ discard. A branch with any coherent mathematical or empirical connection stays active; at low ratings
it is a *low-confidence active branch*. The ratings are not a search-ending mechanism.

A branch is flagged as a candidate for inactive status only when **all** of these hold:

- multiple independent mathematical formulations fail;
- multiple applications fail;
- no generalization survives;
- there is no meaningful established mathematics supporting the connection.

One failure is never enough. A branch with one exact connection remains in the graph even if broad generalization
fails.

Even then it is archived as an *inactive research branch*, never deleted, with its provenance and failed reasoning
kept.
