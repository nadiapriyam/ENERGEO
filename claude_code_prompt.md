# Prompt for Claude Code: interactive geometry of my hypothesis

## 0. Read this first

I'm building interactive, step-by-step mathematical explorations of a hypothesis of mine. The goal is not for you to judge the hypothesis, correct it, or shrink it into something already known. The goal is to **represent it faithfully in mathematics and geometry** so that I can see it, test it, and learn from it as it takes shape. I'm learning the mathematics at the same time as we build. Mathematics is the basis for everything here, and every visual must come from an equation.

The hypothesis is **not an assumption you need to fix**. It's still at the hypothesis stage, may have rough edges, and must not be treated as true or false. When something is unclear, **ask me. Don't fill the gap with your own reading.** An earlier assistant shortened my hypothesis down to the parts that matched known theorems. Don't do that.

Read the mathematics the way a mathematician looking for connections nobody has drawn yet would read it: look for where the same structure reappears across blocks and domains, and build interactives that make those connections visible and understandable to other people. Every connection you propose is a hypothesis with a level (§6) until a verifier passes it.

### Files that must be in the project folder

| File | What it is |
|---|---|
| `claude_code_prompt.md` | this prompt |
| `Mathematical_Basis_Interactive_Design_Spec.md` | **the mathematical backbone and design spec: 18 interactive blocks, 4 learning paths, panel layout, learner modes** |
| `verify_S1_S5.py`, `verify_S6_S8.py`, `verify_S9_S14.py` | SymPy/NumPy verifier scripts (§5) |

## 1. My hypothesis (in my words, and this governs)

> i want to prove a theory correct. evidence: fourier transform: there is an orthonormal basis that is ubiquitous its the inner product of its coefficents. However more importantly, I focus on the relatonship between the coefficents and noticed a pattern. the relationship between f hat (k) * e^2pi*ikt. first i want to prove what is the significance of having orthogonality: examining quadratics- the geometry and it equaling to 0/ it relation to the eucliden geometry. and anything beyond euliciden is a repsentation from representation theory. second i want to prove that due to this geometry there is a pattern of representations and how they develop, leading to my theory of the relationship ridden equation- rather geometry that says that there is a common structure where infinite things are combined my a finite thing to produce a representation. like time and a finite circle geometry producing an infinite sine and cosine with bounds. and that invarient variable like the speed of light which also converges to infinity is an invarient variable that acts as a rule in the manifold (https://pmc.ncbi.nlm.nih.gov/articles/PMC10018491/) remember these are theories that are waiting to be proved, might hace some rough edges however its important to remember we can't assume this is false or true. take this as a hypothesis

### 1a. The three hypotheses inside that statement

The split follows my own markers ("first", "second", "leading to my theory"). Every word is mine. Work on each hypothesis separately, keep them linked, and don't re-split or merge them without asking me.

**Evidence (shared by all three):**
> fourier transform: there is an orthonormal basis that is ubiquitous its the inner product of its coefficents. However more importantly, I focus on the relatonship between the coefficents and noticed a pattern. the relationship between f hat (k) * e^2pi*ikt.

**H1. Orthogonality, quadratics, and representation theory**
> first i want to prove what is the significance of having orthogonality: examining quadratics- the geometry and it equaling to 0/ it relation to the eucliden geometry. and anything beyond euliciden is a repsentation from representation theory.

**H2. A pattern of representations and how they develop**
> second i want to prove that due to this geometry there is a pattern of representations and how they develop,

**H3. The relationship-ridden equation (rather, geometry), with the invariant as a rule in the manifold**
> leading to my theory of the relationship ridden equation- rather geometry that says that there is a common structure where infinite things are combined my a finite thing to produce a representation. like time and a finite circle geometry producing an infinite sine and cosine with bounds. and that invarient variable like the speed of light which also converges to infinity is an invarient variable that acts as a rule in the manifold (https://pmc.ncbi.nlm.nih.gov/articles/PMC10018491/)

**Dependency:** H1 → H2 → H3. H2 holds "due to this geometry" (H1), and H3 is what H2 is "leading to".

**Status of all three:**
> remember these are theories that are waiting to be proved, might hace some rough edges however its important to remember we can't assume this is false or true. take this as a hypothesis

### 1b. My clarifications (also my words)

- It's not a pattern *between* f̂(k) and e^{2πikt}. What these terms represent *together* is seen everywhere in Fourier series and the Fourier transform.
- The vector projection of v onto u is ⟨v,u⟩u. Decomposing a vector breaks it into its very components. A Fourier coefficient is exactly a projection: ⟨f, e^{2πint}⟩ = ∫₀¹ f(t) e^{−2πint} dt = f̂(n). So f(t) = Σ_{k=−∞}^{∞} ⟨f, e^{2πikt}⟩ e^{2πikt}, which gives the length of f's projection onto its k-th component.
- "This is the start of my question: how to get an orthonormal basis when you can't visualize it. There must be a way to find that. Infinite things converge, finite things don't." This is a premise that leads into the orthogonality / quadratic / representation-theory hypothesis, and it also involves eigenvalues. It isn't a question for you to answer.
- The paper is *Information geometry of multiparameter models: New perspectives on the origin of simplicity* (Quinn, Abbott, Transtrum, Machta, Sethna). arXiv: https://arxiv.org/abs/2111.07176. What I take from it: eigenvalues, geodesics, prediction space, invariants, parameter space, and **above all that the speed of light acts as an invariant variable in the manifold** (c → ∞ is a boundary of the space of theories that gives Newtonian mechanics).

### 1c. Open questions you must ask me about. Don't resolve them yourself.

1. What "develop" means in "how representations develop".
2. What exactly "infinite things converge, finite things don't" refers to.
3. In "the speed of light … converges to infinity", what is going to infinity.
4. Which manifold "the manifold" refers to (spacetime, the model manifold, a manifold of representations, or something else).
5. What "relationship ridden" refers to.
6. Anything else in §1 that has more than one reading.

## 2. How to treat words

Don't take words like *eigenvalues*, *prediction space*, *energy*, *invariant*, or *manifold* in only their literal textbook sense. I use them for the **role** they play in a structure. For example, the L² norm in Fourier could be energy, it could be strength, and in information geometry it's distance in units of noise. Name the role, show it in each domain, and ask me if a role is unclear. Block 18 of the spec, physical energy vs L² energy, exists for exactly this reason.

## 3. The backbone: the design spec

`Mathematical_Basis_Interactive_Design_Spec.md` is the mathematical backbone. Read all of it before proposing anything. Use as given:

- **The core pattern of every interactive:** Object → Transformation/Representation → Invariant → Lost/hidden information → Geometric consequence.
- **The panel layout:** equations on the left, live geometry in the center, controls on the right, derived insight and connections at the bottom.
- **The learner modes:** Explore, Guided, Advanced.
- **The master threads:** representation → transformation → invariant → geometry; many degrees of freedom → distinguishability → effective geometry; symmetry → conservation → constraint → allowed motion.
- **The 18 blocks** and their step-by-step learner sequences.
- **The 4 learning paths:** A core geometry, B duality and physics, C effective theory, D information and limits.
- **The final design principle:** *What is the hidden geometry of this equation, and what becomes visible when I transform, decompose, or constrain the object?* Can the learner see orthogonality, invariance, symmetry, loss of information, and effective dimensional reduction even when they aren't visually obvious?

Domains the pattern is looked for in: Fourier/projection, relativity/Lorentz, representation theory, and information geometry. All four appear across the blocks.

## 4. Connections map (Claude's synthesis, to be tested; not settled)

These are connections across the spec's blocks that bear on my hypothesis. Each underlying fact is a known theorem and has passed a verifier card (§5). **The claim that they form one recurring structure is the hypothesis.** Build interactives that let me *see* each connection, and show me where it breaks.

| # | Connection | Bears on | Blocks | Verified by |
|---|---|---|---|---|
| C1 | **One equation, many geometries.** A^T M A = M with M = I (rotation, Parseval/unitary), M = η (Lorentz), M = J (symplectic/Hamiltonian), and M = g(θ) (Fisher metric, varying point to point). My "invariant that acts as a rule in the manifold" may be M itself. | H1, H3 | 1, 4, 9, 12, 15 | S4, S9 |
| C2 | **Conservation = invariant form, infinitesimally.** A linear flow z′ = Kz conserves zᵀMz exactly when KᵀM + MK = 0. Symmetry → conservation → constraint → allowed motion is this one condition. | H3 | 1, 15 | S9b |
| C3 | **The sign of the invariant decides bounded vs unbounded.** Rotation/boost/shear (sign of J²) and Kepler orbits (sign of energy: ellipse, parabola, hyperbola) are the same trichotomy. "Infinite time + finite circle → bounded sine and cosine" is the compact case. | H2, H3 | 1, 9, 15 | S4, S10 |
| C4 | **The Fourier transform is itself a rotation.** It's a quarter-turn in time–frequency phase space (the harmonic-oscillator flow for a quarter period); its eigenvectors are the Hermite functions with eigenvalues (−i)ⁿ, and F⁴ = I. So the representation change of Block 3 is a group action of Block 1, with eigenvalues. | H1, H2 | 3, 8, 15 | S11 |
| C5 | **"The quadratic equaling 0" has two faces.** Orthogonality ⟨u,v⟩_M = 0, and null vectors Q(v) = 0. In Minkowski geometry, light is orthogonal to itself. Mass is the invariant form of 4-momentum: E² = p²c² + m²c⁴ is Block 9's interval in other variables. | H1, H3 | 2, 9, 10 | S12 |
| C6 | **Projection by symmetry averaging is orthogonal projection.** P_H² = P_H, P_Hᵀ = P_H, and the residual is perpendicular to the symmetric part. Representation theory decomposes by projecting. | H1, H2 | 2, 6, 7 | S13 |
| C7 | **Sloppiness looks like spectral decay.** Fisher eigenvalues of a sum of exponentials are roughly evenly spaced on a log scale, like decaying Fourier coefficients. "Infinitely many parameters combined into a finite effective geometry" (hyperribbon) may be the same pattern as Bessel's inequality. Level 2: the even spacing passed with a tolerance chosen after seeing the data, and the span was smaller than I expected (S14a FAIL). Needs a proper test. | H3 | 4, 11, 12, 17 | S7, S14 |

The "Bears on" column is Claude's mapping, not mine. Check it with me.

You may propose more connections. Each one gets a level and a verifier card before it goes into an interactive as anything other than "hypothesis".

## 5. Verified so far

Run all three scripts first.

| Card | Claim | Verdict |
|---|---|---|
| S1 | ⟨u,v⟩ = 0 ⟺ Pythagoras; polarization recovers ⟨·,·⟩ from the quadratic | PASS |
| S2 | {e^{2πikt}} orthonormal; Parseval | PASS |
| S3 | T_τ e_k = e^{−2πikτ} e_k | PASS |
| S4 | traceless 2×2 J: J² = −det(J)·I, so rotation/boost/shear; each preserves its form | PASS |
| S5 | tanh velocity addition; tanh s → ±1; Lorentz preserves x² − c²t²; c → ∞ gives Galilean | PASS |
| S6 | Gram–Schmidt on 1, x, x², x³ gives Legendre (no picture needed) | PASS |
| S7 | Bessel: Σ⟨f,e_k⟩² ≤ ‖f‖² | PASS |
| S8 | symmetric operator ⇒ orthogonal eigenvectors | PASS |
| S9 | AᵀMA = M and KᵀM + MK = 0 for M = I, η, J; conservation of zᵀMz | PASS |
| S10 | Kepler: sign(E) = sign(e − 1) | PASS |
| S11 | F hₙ = (−i)ⁿ hₙ; quarter-period oscillator flow = (x,p) → (p,−x) | PASS |
| S12 | PᵀηP = m²c² ⟺ E² = p²c² + m²c⁴; light ray has ⟨l,l⟩_η = 0 | PASS |
| S13 | symmetry average is an orthogonal projection | PASS |
| S14a | 5-parameter Fisher spectrum spans > 4 decades | **FAIL** (3.1) |
| S14b | log-gaps roughly even (spread 0.31 < 0.35; tolerance set after seeing the data) | PASS, weak |

Known theorems mentioned along the way but not yet carded: Jordan–Chevalley decomposition; bounded orbit ⟺ an invariant positive-definite form exists; Day–Dixmier (amenable groups); Dixmier's unitarizability problem (open); Peter–Weyl and Pontryagin duality (compact → discrete spectrum, non-compact → continuous); İnönü–Wigner contraction; Noether's theorem; Wiener–Khinchin. Cite and card these before relying on them.

## 6. How we work (rules I've set)

- **The LLM proposes, a verifier decides.** No claim is accepted because you said it. SymPy, NumPy or Lean gives the verdict. Never declare a result true yourself.
- **Never move a threshold after seeing a result.** If a test fails, keep the failure on the ledger and add a new, clearly labeled test (as S14a/S14b show).
- **Baby steps, all visible.** Every mathematical step is a *step card* returning `value`, `figure`, and `check` (verifier, metric, PASS/FAIL, tolerance), recorded in a step ledger I can click through.
- **Persistent research state on disk, not in the chat:** `objective.md`, `hypotheses/`, `connections/`, `verified_results/`, `failed_attempts/`, `open_questions.md`, `ledger.json`.
- **Classify every claim:** Level 1 (established), Level 2 (buildable), Level 3 (testable forward hypothesis), Level 4 (speculative analogy). Label statements as Known, Supported inference, Testable hypothesis, or Long-term possibility. Don't remove Level 3 or 4 ideas. Ask what experiment would move each one up a level.
- **Never present a hypothesis as evidence**, and never call a result successful because the visual looks good.
- **Don't over-explain to me in chat.** Teaching belongs inside the interactives. In chat, be brief and ask precise questions.

## 7. Interactive style

- **Main inspiration: Mathigon**, https://mathigon.org. Study its approach: interactive, step-by-step reveal, the reader acting before being told, intuition first and formalism after. Not overly elementary.
- It should feel **human-made**: hand-chosen colors and typography, considered motion, a clear voice. Avoid generic templated dashboards, stock gradients, and decoration that doesn't encode mathematics.
- **Each interactive follows the spec's core pattern and learner sequence.** Never leave an equation unexplained; explain every symbol, then return to the picture.
- **Build each interactive step by step**, one stage at a time, and show me each stage before the next.
- **Think about 3D with three.js for every interactive.** Before building, write a short 3D design note: what each axis, color and motion represents *mathematically*, and why 3D shows something 2D can't. If 3D adds nothing, say so and keep it 2D. No decorative 3D. Candidates: the quadratic form as an ellipsoid vs a hyperboloid and its light cone (Blocks 1, 9); a vector and its shadows on three axes (Block 2); the model manifold as a hyperribbon in prediction space (Block 11); Hamiltonian level sets as surfaces with trajectories on them (Block 15); time–frequency phase space with the Fourier transform as a rotation (C4).
- Every interactive shows a live **verifier verdict**: numerical invariant checks that match the cards.
- Each interactive's bottom panel shows which connections (C1–C7) it touches.

## 8. Skill to use

Load the `equation-geometry` skill (saved to my account) before building any visual. Existing Three.js skill packs (e.g. https://github.com/cloudai-x/threejs-skills, MIT) may help with library details. `equation-geometry` governs how equations become geometry. The spec's panel layout and learner modes take precedence over any layout the skill suggests.

## 9. Applications come last

Applications are for after the mathematics is built and verified. The ones I'm interested in are **space** (orbits, Kepler, relativity) and **conservation** (Noether, Hamiltonian motion). The earlier energy/building project (Energeo) is parked. Don't build applications until I ask.

## 10. First session: do these in order, and stop at each gate

1. Read this prompt, the design spec, and the paper. Run the three verifier scripts and report the ledger.
2. **Gate:** ask me the questions in §1c plus any you have about §1 or the spec. Don't build until I've answered.
3. Write `objective.md`, plus `hypotheses/H1.md`, `H2.md` and `H3.md` (each opens with my exact words from §1a, then lists its open questions, the blocks and connections that bear on it, and what would move it up a level), plus `connections/C1–C7.md`. No narrowing. **Gate:** I approve them.
4. Propose 2–3 options for the build form (e.g. Vite + three.js site with a Python verifier, vs standalone HTML pages, vs another option), with trade-offs. **Gate:** I choose.
5. Propose which block or connection to build first, which hypothesis (H1, H2, H3) it serves, and why. **Gate:** I choose.
6. Build it stage by stage (§7), with its step cards and 3D design note.
