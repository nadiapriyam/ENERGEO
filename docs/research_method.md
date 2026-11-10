# Research method: theorem-seeking

This is the canonical protocol for every research pass in Geometry of Representation. Other files point here and
do not restate it. Nadia set it as a project-wide backbone decision (`docs/restructure_decisions.md`, "Research
method"). It changes how research is conducted. It does not change the epistemic-status system.

> The theory is the fixed research target; the proof is what must be found.

> Search as though the theorem is true. Report only what the evidence actually proves.

The two sentences hold together. The first governs the **search**; the second governs the **report**.

---

## 1. Theorem-target stance

When Nadia supplies a theory, conjecture or structural claim, it is the theorem to be proved. The theory is not
the variable under investigation; the proof structure is.

A research pass does **not** open with:

- Is this true?
- Is this plausible?
- Is there anything vaguely related?
- What existing theory is closest?

It opens with:

- What representation makes this statement exact?
- What mathematical object realizes it?
- What map sends the compared systems into a common space?
- What invariant would have to be preserved?
- Which transformation group preserves that invariant?
- What known theorem already proves this statement or a precise special case?
- What factorization, decomposition, quotient, limit, conserved form, spectral representation, symmetry or
  equivalence produces the claimed relation?
- What assumptions make the theorem exact?
- What is the shortest proof path?
- If the current formulation fails, what exact assumption or quantifier fails?

The search is narrow, structural and equation-driven. Broad thematic similarity is searched only after the exact
structural searches are exhausted.

**When the wording has several exact readings.** The prompt's rule still holds: Claude does not fill a gap with
its own reading (`claude_code_prompt.md` §0). Each reading becomes its own target, labelled as a reading. None is
chosen silently, and Nadia is asked when the choice changes the theorem.

## 2. Proof-obligation decomposition

Every theory under research is turned into explicit proof obligations, in this structure:

```
THEORY TARGET              the statement, in Nadia's words (registry record id)
Definitions                every term fixed for this pass, by the role it plays (§2 of the prompt)
Objects                    what the statement is about
Candidate common representation
Required map(s)            e.g. R_m, R_w into a common codomain
Required invariant(s)
Required transformation law
Exact theorem statement    the precise formal claim this pass tries to prove
Proof obligations          the lemmas that together prove it
Known results that would discharge each obligation
Unresolved obligations
Adversarial / boundary checks   (Pass E, only after formalization)
```

The registry carries this as each record's `proofTarget` (§6). The fields fill in over time; an empty field is
an unstarted obligation, not a verdict.

Structures are named only once the mathematics establishes them. A zero-producing set is not called a kernel,
fiber, manifold, orbit, variety, equivalence class or null space until it is shown to be one (the same rule as
learner copy).

## 3. Exact-search hierarchy

Literature and internet searches run in this order.

| Pass | What is searched | Example queries |
|---|---|---|
| **A. Exact mathematical consequence** | the precise equation, transformation law, invariant or structural consequence the theory predicts | `A† M A = M preservation theorem`; `zero first moment distinguished point`; `same spectral magnitude nonunique reconstruction`; `compact geometry periodic flows`; `common representation mass field wave dispersion invariant` |
| **B. Equivalent formulations** | other names for the same structure, only when the theory itself calls for them | intertwining map, unitary equivalence, conjugacy, representation equivalence, invariant bilinear form, orbit structure, stabilizer, level set, spectral decomposition, normal form, group action |
| **C. Theorem identification** | named theorems or papers that prove the required relation or a precise special case | |
| **D. Proof construction** | a direct derivation from the definitions and established results; each step a verifier card | |
| **E. Adversarial test** | after formalization only: counterexamples to a specific quantifier, degenerate cases, boundary cases, which assumptions are really needed | |

Adjacent frameworks are not imported because they sound relevant. A framework enters only when an exact
construction requires it.

## 4. Outcome contract

These are not endpoints:

- interesting analogy
- possible connection
- there may be something here
- this resembles X
- more research is needed

Every pass ends with at least one of these, recorded as the record's `lastResearchOutcome`:

| Outcome | `lastResearchOutcome` | Meaning |
|---|---|---|
| A. Exact proof / derivation | `proved` | the target follows from stated assumptions |
| B. Existing theorem | `known-theorem` | a known theorem proves the target or a clearly specified portion of it |
| C. Constructive realization | `constructive-realization` | an explicit representation, map, invariant, transformation or model realizes the target |
| D. Precise special case | `special-case` | a nontrivial exact subclass is proved |
| E. Exact obstruction | `exact-obstruction` | a specific assumption, quantifier or formulation prevents the theorem as written, e.g. "The statement fails only when Σm_i = 0." (not "the idea seems too broad") |
| F. Explicit proof obligation | `proof-obligation` | a sharply stated missing lemma remains, e.g. "It remains to prove that R_m and R_w intertwine the same group action." (not "this remains speculative") |

The terminal research object is always mathematically actionable.

## 5. Evidence and counterexamples

A counterexample is not permission to abandon the theory. When a specific formulation fails:

1. preserve the original theory;
2. identify the exact failed quantifier or assumption;
3. find the maximal subclass where it holds;
4. formulate the corrected theorem;
5. continue the proof program on that theorem;
6. record the relationship to the original.

In the repository this means:

- the original record keeps its words, and the evidence goes in its `evidenceAgainst`;
- the corrected theorem is a new record, linked by `supersedes` / `supersededBy`;
- its id is appended to `research/theories.ids`, which is append-only;
- a FAIL card stays on the ledger, and a new labelled card is added.

*Example (★).* For "Any geometrical object that is bound by rules can be periodic", a counterexample does not mean
"★ is false; remove it". It sharpens the target to: *What exact geometric/dynamical conditions guarantee
periodicity, recurrence, quasi-periodicity or bounded orbit behavior?*

Every verifier rule in `claude_code_prompt.md` §6 still applies: the verifier decides, and no threshold moves
after a result.

## 6. Research mode and reported status

| | Research mode (search) | Reported status (registry, app, chat) |
|---|---|---|
| What it says | how the theory is investigated | how much of the proof exists now |
| Values | `researchMode: "theorem-target"` | ESTABLISHED · DERIVED CONNECTION · HYPOTHESIS · OPEN QUESTION |
| Changes when | never lowered by a status | only on a verifier verdict or an established source |

A record can say `status: "hypothesis"` and `researchMode: "theorem-target"` at once. That is intentional, and the
tests accept it. A HYPOTHESIS or OPEN label never lowers how seriously or aggressively a theory is investigated.
Neither does a status of established for one part.

The theorem-seeking stance never licenses a status claim. During the search the theory is treated as the
theorem. After it, the report states exactly which of A–F was obtained, and the status changes only if a card or
an established source supports the change. Level 3 and 4 claims are still never presented as evidence.

The schema in `research/theories.json` (optional, filled gradually):

```
researchMode: "theorem-target"
proofTarget: {
  targetStatement, requiredObjects[], requiredMaps[], candidateInvariants[], requiredEquivalences[],
  proofObligations[], exactSearchQueries[], knownTheorems[], unresolvedObligations[],
  lastResearchOutcome: "proved" | "known-theorem" | "constructive-realization" | "special-case"
                     | "exact-obstruction" | "proof-obligation" | null
}
```

## 7. Examples

Each pair is "not this / this". The targets are Nadia's (`restructure_decisions.md`), and the registry record that
carries each one is named. None of these is a result; each is where a research pass starts.

**H1** (`T-H1`). Not *Is orthogonality important?* Instead:
> Characterize the complete class of geometric/quadratic consequences equivalent to or generated by ⟨u,v⟩ = 0, and identify which are representation invariant.

**H2** (`T-H2`). Not *Are there patterns across representations?* Instead:
> Construct the common architecture: object → representation → transformation → invariant → decomposition → geometry across the specified domains, and determine the precise categorical/algebraic conditions under which two examples instantiate the same structure.

Category theory is not imported because the wording resembles it; it enters only if an exact construction needs it.

**H3** (`T-H3`). Not *Could finite and infinite structures be related?* Instead:
> Classify maps from unbounded parameters into constrained geometries, their orbit/recurrence/limit structure, and identify a common invariant formulation covering the examples Nadia specified.

**Zero** (`T-HIDDEN-FAMILY`). Not *Can zero contain information?* Instead, given a measurement F and zero set
Z = {x : F(x)=0}, characterize:

- the dimension/structure of Z;
- invariants on Z;
- transformations preserving Z;
- distinguishable quantities within Z;
- conditions under which x is identifiable from F(x)=0;
- additional observables required when it is not;
- and whether the zero condition defines or implies a stronger structure.

The structure is not named before it is derived.

**Pair A** (`T-Q.pairA-transfer`). Instead of asking whether the two zeros are alike:
> Starting from the established common zero-sum form Σv_i = 0, identify all additional invariants/relations of the mass system that can be translated into mathematically meaningful tests on the directional cancellation system.

The output is a list of tests on the target system. Each needs its own card there. No data crosses the pair, and
the pair's deeper common relation stays unfilled until cards establish it (CLAUDE.md).

**Pair B** (`T-PAIRB`). Instead of asking whether spatial and temporal periodicity are alike:
> Given spatial periodic structure and temporal/phase periodic structure, identify the most general geometric condition that generates repeated behavior in both, and determine whether the commonality is group action, compactness, symmetry, orbit closure, or another exact structure.

None of these is chosen before it is derived.

**Mass/wave** (`T-MASS-WAVE`). Not *Could mass and waves be related?* Instead: find a representation R_m for the
mass-like system and R_w for the wave-like system such that both satisfy the same relation P. Identify:

- the common codomain;
- the maps R_m and R_w;
- the invariant I;
- the transformations preserving I;
- and a theorem proving the equivalence.

Also as a target statement:
> Find a common representation in which the mass-like and wave/field-like objects satisfy the same mathematical relation. Specify the maps, state space, invariant and transformation law required for exact equivalence.

**★** (`T-STAR`). After a counterexample, the target becomes
*What exact geometric/dynamical conditions guarantee periodicity, recurrence, quasi-periodicity or bounded orbit
behavior?* (§5).
