# Gate 4 decision (verbatim record)

Nadia's Gate 4 decision, kept word for word. Only the formatting changed: LaTeX delimiters were converted so GitHub renders the math. One display line in §6 lost its opening bracket in the original; it is restored and marked.

---

Gate 4 decision: Choose Option A — Vite + three.js site, Python verifiers, hosted on GitHub Pages.

Keep `CLAUDE.md`. I want future sessions to automatically load the project rules, especially the distinctions between established mathematics, derived connections, hypotheses, and open questions.

A few requirements for Gate 4:

## 1. The interactive is part of the mathematical investigation

Do not treat the visuals as illustrations added after the mathematics.
The purpose is to make otherwise hidden geometry visible.
For example, for orthogonality I do not only want two arrows becoming perpendicular.
I eventually want the same mathematical relationship

$$\langle u, v \rangle = 0$$

to become visible when the objects are:

- ordinary 2D vectors,
- higher-dimensional vectors,
- Fourier basis functions,
- functions in $L^2$,
- projected components,
- or other spaces where "90 degrees" cannot literally be drawn.

The interactive should reveal the pattern that tells us this is orthogonality even when our eyes cannot directly see it.
That principle should guide the architecture.

## 2. Use one shared mathematical object across interactives where possible

Follow the Master Map principle:
Never abandon a mathematical object once the learner understands it. Transform or extend it.
For example:

$$\text{waveform} \rightarrow \text{vector} \rightarrow \text{Fourier coefficients} \rightarrow \text{orthogonal decomposition} \rightarrow \text{geometric object}.$$

The application should therefore support carrying state or an object from one interactive into the next rather than resetting every page.

## 3. Keep three layers separate

I want the codebase to preserve:

```
research/
    mathematical claims, hypotheses, connections, sources

verify/
    executable checks of mathematical claims

src/
    interactive implementation
```

The UI must not turn a Level 3 or Level 4 statement into an established fact simply because it can be visualized.
If an interactive explores a hypothesis, label it clearly as an investigation/conjecture laboratory.

## 4. Build the geometry engine before trying to build all 20 interactives

Gate 4 should establish the reusable system first.
I want a common interactive frame with:

- equation / mathematical object,
- live geometry,
- manipulation controls,
- numerical invariant/readout,
- "what changed?",
- "what remained invariant?",
- "what became visible in this representation?",
- connection to the preceding and following interactive.

The shared conceptual schema is:

$$\boxed{\text{Object} \rightarrow \text{Representation} \rightarrow \text{Transformation} \rightarrow \text{Invariant} \rightarrow \text{Geometry}}$$

plus:

$$\boxed{\text{What information became visible, hidden, or lost?}}$$

## 5. The visual quality should be closer to Mathigon than to a standard plotting dashboard

Do not make this look like a collection of Plotly charts or textbook graphs.
Use three.js where spatial/geometric reasoning benefits from it, but do not force everything into 3D.
The visual should be chosen according to the mathematics:

- 2D when 2D is mathematically sufficient,
- 3D when rotation/projection/spatial structure benefits from it,
- multiple projections, matrices, color maps, or linked views when the actual space is higher-dimensional,
- never fake literal visualization of 4D or infinite-dimensional space.

The important goal is visual reasoning, not visual spectacle.

## 6. Orthogonality should be an early architecture test

Before building the full Master Map, make sure the platform can represent the same orthogonality relationship several ways.
For example:

**Visible Euclidean case**

$$u \cdot v = 0.$$

Two perpendicular vectors.

**Projection case**

$$\operatorname{proj}_u(v) = 0.$$

The projection disappears.

**Gram-matrix case**

$$G_{ij} = \langle e_i, e_j \rangle.$$

For an orthonormal system,

$$G = I.$$

The off-diagonal relationships disappear.

**Pythagorean case**

$$\|u+v\|^2 = \|u\|^2 + \|v\|^2$$

*(The original read `|u|^2+|v|^2 ]`; its opening bracket and left-hand side were lost in transit. Restored to the evident statement.)*

when

$$u \perp v.$$

**Fourier/function-space case**

$$\langle e_m, e_n \rangle = 0, \qquad m \neq n.$$

The positive and negative contributions to the integral cancel even though there are no literal arrows at 90°.
If the architecture can make all of these look like manifestations of the same mathematical relationship, then it is doing what I want.

## 7. Every interactive needs Guided, Explore, and Advanced layers

Guided: introduces the geometry step-by-step.
Explore: lets the learner manipulate it freely.
Advanced: exposes the deeper equations, matrices, metrics, numerical values, or proof-related structure.
Do not make the main experience elementary, but do make it understandable without assuming graduate-level mathematics.

## 8. Build exact mathematics before decorative animation

For every visual element that claims to represent a mathematical relationship, its position/state should come from the tested math in `src/math` wherever feasible.
Avoid animations whose only purpose is to look like a concept.
If a point is on an orbit, calculate the orbit.
If two functions are orthogonal, calculate the inner product.
If something is invariant, display the invariant numerically while the transformation happens.
If a manifold projection is only a projection, explicitly tell the learner that it is not the full manifold.

## 9. Keep failures useful

The verifier ledger remains append-only.
An interactive can eventually use failed conjectures as useful exploratory cases.
A FAIL does not mean hide the idea. It means:

$$\boxed{\text{the proposed mathematical statement did not survive that test}.}$$

That distinction is important to the research philosophy of the project.

## 10. Gate 4 scope

For Gate 4, do not build all 20 Master Map interactives yet.
Build:

1. the application architecture,
2. the shared interactive shell,
3. the state/object-carrying mechanism,
4. the mathematics-to-visualization interface,
5. the level/status display for Established / Derived / Hypothesis / Open,
6. and one serious prototype that proves the architecture can reveal hidden geometry.

I recommend the first serious prototype be Orthogonality and Zero, because it tests the hardest requirement: showing a geometric relationship that remains meaningful after we move beyond what can literally be seen.
Once that foundation is working, we can map the 20-interactive Master Map onto it.
Proceed with Gate 4 using Option A.

One additional choice I would make: keep three.js as a capability, not as the rendering engine for everything. For Fourier integrals, Gram matrices, coefficient maps, error landscapes, and similar views, SVG/Canvas can communicate the mathematics more cleanly. Three.js becomes especially useful when we reach rotations, projections, orbit geometry, higher-dimensional shadows, Minkowski-style views, and manifolds.
