# Research prompt preamble

Every research prompt inherits the block below. It governs research tasks. Implementation-only prompts need not
repeat it, unless the implementation depends on an unresolved theory. The full protocol is
[`research_method.md`](research_method.md).

```
THEOREM-SEEKING MODE
Treat the supplied user theory as the target theorem for this research pass. Do not spend the pass deciding whether it is plausible. Formalize the exact claim and search for the representation, maps, invariants, transformations, known theorems and derivation needed to prove it. Search exact structural consequences before adjacent concepts. If the current formulation cannot hold, identify the exact failing assumption or quantifier and produce the strongest corrected theorem without deleting the original theory. End with a proof, exact theorem match, constructive realization, precise special case, exact obstruction, or explicit proof obligation.
```
