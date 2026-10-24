# Objective

## In your words

> I'm building interactive, step-by-step mathematical explorations of a hypothesis of mine. The goal is not for you to judge the hypothesis, correct it, or shrink it into something already known. The goal is to **represent it faithfully in mathematics and geometry** so that I can see it, test it, and learn from it as it takes shape. I'm learning the mathematics at the same time as we build. Mathematics is the basis for everything here, and every visual must come from an equation.

The hypothesis, verbatim (`claude_code_prompt.md` §1):

> i want to prove a theory correct. evidence: fourier transform: there is an orthonormal basis that is ubiquitous its the inner product of its coefficents. However more importantly, I focus on the relatonship between the coefficents and noticed a pattern. the relationship between f hat (k) * e^2pi*ikt. first i want to prove what is the significance of having orthogonality: examining quadratics- the geometry and it equaling to 0/ it relation to the eucliden geometry. and anything beyond euliciden is a repsentation from representation theory. second i want to prove that due to this geometry there is a pattern of representations and how they develop, leading to my theory of the relationship ridden equation- rather geometry that says that there is a common structure where infinite things are combined my a finite thing to produce a representation. like time and a finite circle geometry producing an infinite sine and cosine with bounds. and that invarient variable like the speed of light which also converges to infinity is an invarient variable that acts as a rule in the manifold (https://pmc.ncbi.nlm.nih.gov/articles/PMC10018491/) remember these are theories that are waiting to be proved, might hace some rough edges however its important to remember we can't assume this is false or true. take this as a hypothesis

It is split into three hypotheses (your split, `claude_code_prompt.md` §1a). They are worked on separately and kept linked:

| | File | Depends on |
|---|---|---|
| H1 | [Orthogonality, quadratics, and representation theory](../research/hypotheses/H1.md) | — |
| H2 | [A pattern of representations and how they develop](../research/hypotheses/H2.md) | H1 ("due to this geometry") |
| H3 | [The relationship-ridden geometry, with the invariant as a rule in the manifold](../research/hypotheses/H3.md) | H2 ("leading to") |

**Status of all three:** hypotheses, neither assumed true nor assumed false.

## Scope now

- **In scope:** the mathematics itself and the connected geometries (Gate 2, answer 9).
- **Parked:** the finite-energy / spacecraft application (Energeo). Applications come only when you ask (§9).
- **Names (Gate 4 review):** the learning platform is **Geometry of Representation**. ENERGEO stays the repository name and the name of the later finite-energy application. Not every result here is part of an energy theory.

## Which document governs what

| Source | Governs |
|---|---|
| [`Mathematical_Basis_Interactive_Design_Spec.md`](Mathematical_Basis_Interactive_Design_Spec.md) | Theory and equations: what is established, what is derived, what is your hypothesis, what is open. Also the 18 blocks, the panel layout and the learner modes. |
| [`Interactive_Master_Map.docx`](Interactive_Master_Map.docx) | How the ideas become consecutive interactives: the "journey of one signal". Every interactive transforms an object the learner already understands. |
| [`claude_code_prompt.md`](claude_code_prompt.md) | How we work (§6): the verifier decides, levels, step cards, gates. |
| [`gate2_answers.md`](gate2_answers.md) | Your clarifications of the wording in §1. |
| [`research/`](../research/) | The hypotheses, the connections (each with a level), open questions and sources. |
| [`verify/`](../verify/) and its ledger | The verdicts. Nothing is accepted without one. The ledger is append-only in spirit: failures stay visible even after a later test passes. |

## Terms (from Gate 2)

Words are read by the role they play (§2). These are fixed by your answers:

- **manifold** — always name which one. In sloppiness, MBAM, Fisher geometry and $c \to \infty$ it means the **prediction/model manifold** $\mathcal Y = \{Y(\theta) : \theta \in \Theta\}$. This is not spacetime, and not a "manifold of representations" (that one is undefined so far). *(answer 4)*
- **develop** (H2) — transform, extend, or reinterpret an object through successive mathematical representations while tracking what remains invariant. *(answer 1)*
- **$c \to \infty$** — a parameter limit in a family of theories, $c \mapsto Y(c)$. It is not a physical process. *(answer 3)*
- **converge** — a property of a sequence, series, family or limiting process. "Infinite things converge, finite things don't" is never to be used as a mathematical statement. *(answer 2)*
- **relationship ridden** — a guiding intuition: structure lives in relationships among objects, transformations and invariants. It is not a term and never appears as a theorem. *(answer 5)*
- **beyond Euclidean** — other measuring rules ($q_M(x) = x^\dagger M x$ with $M \ne I$) and spaces we can't see directly. We *access* these geometries through representations; the claim is not that they are "only representations". *(answer 7)*

## Claim levels (§6)

| Level | Label |
|---|---|
| 1 | Established / Known |
| 2 | Derived connection / Supported inference |
| 3 | Testable hypothesis |
| 4 | Open or speculative connection |

*(Labels set by Nadia at Gate 3.)*

A connection is never promoted just because several equations look alike. These stay distinct even where they connect: quadratic invariance, Noether conservation, symplectic preservation, and metric invariance.

A level changes only on a verifier verdict. Level 3 and 4 ideas are never removed. Each one records what experiment would move it up.
