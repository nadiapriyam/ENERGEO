# Research prompt preamble

Every research prompt inherits the three blocks below, in this order. They govern research tasks. Implementation-only
prompts need not repeat them, unless the implementation depends on an unresolved theory. The full protocol is
[`research_method.md`](research_method.md).

The first block is assembled from Nadia's own sentences (`restructure_decisions.md`, "Outside-in geometry
construction"). The second is her theorem-seeking block, kept verbatim; it now applies inside construction and in
the secondary existing-theorem scan. The third (EVALUATION) carries the 2026-11-12 evaluation decisions.

```
OUTSIDE-IN MODE
Construct first. Classify second. Preserve the zero. Investigate its geometry. Known structures are examples, not the boundary of the search space. Look from the outside in.
phenomena / zero / cancellation / relation → collect exact behavior → construct representation → construct geometry → infer its internal rules → test those rules across systems → only then compare against existing mathematics
Do not perturb a defining zero merely to obtain information. Investigate the structure of the system while the zero remains zero.
DO NOT CLOSE THE SEARCH SPACE WITH KNOWN MATHEMATICS. These are known examples, not an exhaustive classification for this project.
```

```
THEOREM-SEEKING MODE
Treat the supplied user theory as the target theorem for this research pass. Do not spend the pass deciding whether it is plausible. Formalize the exact claim and search for the representation, maps, invariants, transformations, known theorems and derivation needed to prove it. Search exact structural consequences before adjacent concepts. If the current formulation cannot hold, identify the exact failing assumption or quantifier and produce the strongest corrected theorem without deleting the original theory. End with a proof, exact theorem match, constructive realization, precise special case, exact obstruction, or explicit proof obligation.
```

```
EVALUATION
Every substantive result carries a Backbone Support % and an AI Slop / Delusion Risk %, the audit (mathematical status, breadth, why, what would increase support, what would falsify), and the application-validity tests (construction, generalization, transfer, failure condition, out-of-sample). A one-context construction is an EXAMPLE, not a BACKBONE PROOF. Would this statement still be meaningful without the project? Does the same rule apply to objects not used to derive it? Low support means continue carefully, not discard. Archive only after repeated independent mathematical/empirical failure.
```
