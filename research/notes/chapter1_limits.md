# Chapter I: what a preserved zero resultant cannot do

Research note. Not shown to learners: stage 3b's TQ-5 ("which transformations keep it in the zero state and which do
not?") stays an open prompt, and this note would answer part of it.

## Established (cards Z4a, Z4b)

If $\sum_i v_i = 0$, then for every linear map $A$,

$$\sum_i A v_i = A \sum_i v_i = A\,0 = 0.$$

So every linear map keeps every zero resultant at zero (Z4a). Doubling every vector, $D = 2I$, is one of them, and it
preserves a bilinear form $M$ ($D^T M D = M$) only when $M = 0$ (Z4b).

## Established conclusion (narrowed at the audit)

Zero-resultant preservation alone does not identify a particular preserved bilinear or metric form (claim
`zero.no-preserved-form`, cards Z4a, Z4b). That is all Z4b proves: the maps that keep every zero resultant include
$D = 2I$, and $D$ preserves no nonzero bilinear form, so no particular form is singled out.

## Historical wording, kept

The first version of this note said that preservation of a zero resultant alone is "too weak to identify a unique
geometry". That wording claimed more than Z4b proves, if "geometry" means more than a preserved bilinear or metric form.
It stays here as history, superseded by the conclusion above (theory registry: `T-ZERO-WEAK-0` → `T-ZERO-NO-FORM`).

## Open questions (Nadia's words)

> Is zero preservation sufficient to identify a geometry in some broader sense?

> What additional preserved relations are needed to identify the geometry?

Not to be answered with $A^\dagger M A = M$ yet. That equation belongs after the learner discovers which additional
relations survive (DR-1, stage 9).
