# Mathematical Basis + Interactive Design Spec
## For Claude: Theory Database and Interactive Learning System

### Purpose
This document turns the mathematical theory work from our conversations into a connected interactive design specification.

The goal is not to reduce everything to Energeo. The goal is to give Claude a mathematical backbone for:
1. understanding the theory,
2. keeping established mathematics separate from your synthesis/hypotheses,
3. generating interactive learning experiences,
4. visually revealing geometry that is often hidden in equations.

The interaction style should be closer to Mathigon:
- not overly elementary,
- visually rich,
- conceptually rigorous,
- exploratory rather than lecture-only,
- always showing the geometry behind the formula.

---

# Global Design Rules for Every Interactive

## Core pattern
Every interactive should follow this structure:
1. Object
2. Transformation / Representation
3. Invariant / Preserved quantity
4. Lost / hidden / unresolved information
5. Geometric consequence

## Standard interactive panel layout
- Left panel: equation, definitions, compact explanation
- Center panel: live geometric visualization
- Right panel: controls, readouts, and “what to notice”
- Bottom panel: “derived insight” or “connection to other blocks”

## Standard learner flow
- Explore mode
- Guided mode
- Advanced mode

---

# Master Thread Connecting the Blocks
The whole project should keep returning to:

representation -> transformation -> invariant -> geometry

many degrees of freedom -> distinguishability -> effective geometry

symmetry -> conservation -> constraint -> allowed motion

---

# Interactive Block 1 — Invariant-Form Geometry

## Core equations
A^† M A = M

Examples:
R^T I R = I
Λ^T η Λ = η
U^† U = I

## Main idea
A transformation preserves a geometric form.

## Geometry to show
- unit circle / ellipses / hyperbolas depending on M
- how transformations move points while preserving the form

## Controls
- choose matrix M: Euclidean, weighted, Minkowski-style
- choose transformation A
- drag a point x
- toggle “show preserved form value”

## Step-by-step learner sequence
1. Start with the Euclidean case M = I.
2. Move a point on the unit circle.
3. Apply different rotations and observe the point moves but the radius stays fixed.
4. Switch to a nontrivial positive-definite M and show ellipses.
5. Apply M-preserving transformations and show the point remains on the same ellipse.
6. Switch to Minkowski M = η and show hyperbolic geometry.

## What the learner should notice
- The point moves.
- The coordinates change.
- The value x^† M x stays constant.
- Geometry is defined by what is preserved.

## Visual orthogonality focus
Show two vectors u,v and compute u^† M v.
When it is zero, highlight the special pattern:
- standard orthogonality if M = I,
- generalized M-orthogonality otherwise.

## Connection field
Connects directly to inner-product geometry, Lorentz geometry, and the recurring pattern block.

---

# Interactive Block 2 — Inner Product, Norm, and Orthogonality

## Core equations
<x,y>
||x||^2 = <x,x>
<x,y> = 0

## Main idea
Orthogonality is not just “90 degrees” visually. It means zero inner product.

## Geometry to show
- vectors in 2D / 3D
- projection shadow
- angle and inner-product heatmap

## Controls
- drag vectors x and y
- choose standard or weighted inner product
- toggle projection and Gram matrix

## Step-by-step learner sequence
1. Show two vectors in standard Euclidean space.
2. Move them until the dot product becomes zero.
3. Freeze the angle and show the projection disappears.
4. Change the metric / inner product.
5. Show that “visually 90°” is not the only notion of orthogonality once the metric changes.
6. Display the Gram matrix.

## What the learner should notice
- Orthogonality means “one vector has no component along the other.”
- Orthogonality depends on the chosen geometry.
- Zero inner product is often the hidden pattern we need the interactive to reveal.

## Special design note
This should be one of the strongest interactives because your stated goal is to show the pattern that lets us see orthogonality when we cannot see it directly.

## Connection field
Foundational for Fourier, projections, Hilbert spaces, and symmetry decomposition.

---

# Interactive Block 3 — Fourier Transform as Change of Representation

## Core equations
x(t) <-> x̂(ω)
||x||_2 = ||x̂||_2

## Main idea
A signal can be represented in time or frequency; it is the same object in two representations.

## Geometry to show
- waveform in time
- spectral spikes / continuous spectrum
- “same object, different coordinates” view

## Controls
- build a signal from sliders
- add sine/cosine components
- switch between time and frequency view
- toggle inverse reconstruction

## Step-by-step learner sequence
1. Start with a single sinusoid.
2. Add a second component.
3. Observe the waveform becomes more complex while the spectrum shows simple separate components.
4. Toggle between time and frequency views.
5. Show that the object is the same but represented differently.

## What the learner should notice
- Complexity in one representation can be simplicity in another.
- Representation changes can reveal hidden structure.

## Orthogonality focus
Show basis functions sin(nω0 t), cos(nω0 t) and compute their inner products over a chosen interval.
Display a matrix where orthogonal basis functions light up as zeros off-diagonal.

## Connection field
Connects to Parseval, uncertainty, and same-object/different-representation.

---

# Interactive Block 4 — Parseval / Plancherel and Energy Across Representations

## Core equations
∫|x(t)|² dt = ∫|x̂(f)|² df

## Main idea
The L² magnitude is preserved under Fourier transform.

## Geometry to show
- energy bars for time and frequency
- stacked component decomposition
- orthogonal energy partition

## Controls
- add/remove frequency components
- scale amplitudes
- compare time-domain and frequency-domain total L² norm

## Step-by-step learner sequence
1. Construct a signal from orthogonal modes.
2. Show each mode’s contribution to total norm.
3. Display time-domain total and frequency-domain total.
4. Change amplitudes and watch both totals change together.

## What the learner should notice
- The total L² quantity is preserved.
- Orthogonal modes let the total break into clean additive pieces.

## Orthogonality focus
Explicitly show:
||x1+x2||² = ||x1||² + ||x2||²
only when x1 ⟂ x2.

Animate the cross-term:
2<x1,x2>
If orthogonal, it disappears.

## Connection field
Critical for your “bounds / sine-cosine / same structure in another representation” theme.

---

# Interactive Block 5 — Translation Symmetry, Autocorrelation, and Symmetry Defect

## Core equations
D_x(g) = ||x-U_g x||² / (2||x||²)

For translations:
D_x(τ) = 1 - ρ_x(τ)

## Main idea
A signal’s relation to its shifted self creates a geometry of recurrence and symmetry.

## Geometry to show
- original waveform and shifted waveform
- recurrence curve
- defect landscape over τ

## Controls
- choose signal type
- drag shift τ
- show normalized correlation and defect together

## Step-by-step learner sequence
1. Start with a periodic signal.
2. Shift it slowly.
3. Watch overlap, correlation, and defect change.
4. Identify lags where defect is near zero.
5. Switch to nonperiodic or mixed signals.

## What the learner should notice
- Symmetry can be measured continuously.
- Recurrence is a geometric property of how an object compares with its transformed copies.

## Visual geometry note
Plot D_x(τ) as a landscape so that symmetries appear as valleys/minima.

## Connection field
Connects to Fourier magnitude, Wiener–Khinchin, and later candidate geometries.

---

# Interactive Block 6 — Orbit and Stabilizer Geometry

## Core equations
O_x = {U_g x : g in G}
Stab(x) = {g in G : U_g x = x}

## Main idea
All allowed transformed versions of one object form its orbit; transformations that leave it unchanged form the stabilizer.

## Geometry to show
- orbit traced in state space
- highlighted stabilizer points / symmetries

## Controls
- choose group: rotations, shifts, reflections
- choose object: generic, symmetric, highly symmetric
- animate group action

## Step-by-step learner sequence
1. Pick an object with little symmetry.
2. Apply group action and trace the orbit.
3. Note few stabilizer elements.
4. Pick a highly symmetric object.
5. Show a larger stabilizer and more repeated structure.

## What the learner should notice
- Symmetry reduces distinctness under transformation.
- Orbit measures what can change.
- Stabilizer measures what cannot.

## Connection field
Connects to invariant-form geometry and group representations.

---

# Interactive Block 7 — Projection onto Symmetric Subspaces

## Core equations
P_H x = (1/|H|) Σ_{h in H} U_h x

## Main idea
Averaging over a subgroup extracts the symmetric part.

## Geometry to show
- original object
- projected symmetric object
- residual asymmetry

## Controls
- choose subgroup H
- choose object
- toggle projected component and residual

## Step-by-step learner sequence
1. Start with an asymmetric object.
2. Choose a symmetry subgroup.
3. Apply averaging.
4. Observe the symmetric component emerge.
5. Examine the residual.

## What the learner should notice
- Symmetry can be extracted, not just checked.
- Projection is a geometric operation.

## Orthogonality focus
Display:
x = P_H x + (x - P_H x)
and show the decomposition visually, ideally with an inner-product check when appropriate.

## Connection field
Connects to inner-product geometry and orbit/stabilizer.

---

# Interactive Block 8 — Uncertainty / Localization Geometry

## Core equations
Δx Δk ≳ 1/2
Δx Δp ≥ ħ/2

## Main idea
Localization in one representation forces spread in the dual representation.

## Geometry to show
- localized packet in position
- corresponding spread in spectrum
- uncertainty rectangle / tradeoff curve

## Controls
- change packet width
- choose Gaussian, box, or custom signal
- show Δx, Δk

## Step-by-step learner sequence
1. Start with a wide Gaussian.
2. Narrow it.
3. Watch the spectrum broaden.
4. Show the product ΔxΔk.
5. Compare different window shapes.

## What the learner should notice
- Dual representations constrain one another.
- Localization is geometric, not just algebraic.

## Connection field
Connects to Fourier representation, matter/wave discussion, phase-space thinking.

---

# Interactive Block 9 — Lorentz Geometry and Invariant Interval

## Core equations
Λ^T η Λ = η
s² = c² t² - x² - y² - z²

## Main idea
Different observers use different coordinates for the same event, while the spacetime interval stays invariant.

## Geometry to show
- Minkowski diagram
- light cone
- event under Lorentz transformation

## Controls
- move event
- change velocity v
- show transformed coordinates

## Step-by-step learner sequence
1. Place an event on the diagram.
2. Change observer velocity.
3. Show coordinate axes tilt.
4. Show the event’s coordinates change.
5. Verify the interval stays fixed.

## What the learner should notice
- Representation changes do not necessarily change the underlying object.
- c acts as the invariant scale defining allowed observer transformations.

## Connection field
Connects to same-object/different-representation and theory-space blocks.

---

# Interactive Block 10 — Wave Variables and Particle Variables

## Core equations
E = ħω, p = ħk
E² = p² c² + m² c⁴
ω² = c² k² + m² c⁴ / ħ²

## Main idea
Wave and particle descriptions are linked representations of one physical structure.

## Geometry to show
- dispersion curve
- point in (k,ω) and corresponding point in (p,E)

## Controls
- vary m, k, or p
- toggle massless vs massive case

## Step-by-step learner sequence
1. Start with the massless case.
2. Show linear dispersion.
3. Add mass.
4. Show the dispersion curve changes.
5. Track corresponding energy-momentum point.

## What the learner should notice
- The same constraint appears in different variables.
- Mass changes the geometry of allowed modes.

## Connection field
Connects to matter/waves, Fourier, same-object/different-representation.

---

# Interactive Block 11 — Model Manifolds and Sloppiness

## Core equations
θ -> Y(θ)
ds² = dθ^T g(θ) dθ

## Main idea
Varying parameters traces a manifold of predictions; some directions change predictions strongly, others weakly.

## Geometry to show
- model manifold embedded in prediction space
- stiff and sloppy directions
- hyperribbon widths

## Controls
- vary parameters
- show tangent vectors / eigen-directions
- add noise level

## Step-by-step learner sequence
1. Start with a two-parameter model.
2. Vary each parameter independently.
3. Show trajectory of predictions in data space.
4. Compute local metric.
5. Highlight large and small eigenvalue directions.

## What the learner should notice
- Not all parameters matter equally.
- The model may effectively be lower-dimensional even if many parameters exist.

## Connection field
Connects to Fisher geometry, MBAM, Michaelis–Menten, RG/coarse-graining.

---

# Interactive Block 12 — Fisher Geometry and Distinguishability

## Core equations
x = y(θ) + ε, with ε ~ N(0,σ² I)
ds² = (1/σ²) ||dy||²
g(θ) = J^T J / σ²

## Main idea
Noise determines which prediction differences are distinguishable.

## Geometry to show
- tangent ellipse / metric ellipse in parameter space
- distinguishable vs indistinguishable perturbations

## Controls
- vary noise level σ
- vary parameter perturbation
- show Fisher ellipse

## Step-by-step learner sequence
1. Set a low noise level.
2. Show many directions are distinguishable.
3. Increase noise.
4. Watch small directions become unresolved.
5. Relate to stiff/sloppy eigenvalues.

## What the learner should notice
- Geometry depends on measurement precision.
- Effective dimensionality can come from observational limits.

## Connection field
Directly connected to model manifolds.

---

# Interactive Block 13 — Michaelis–Menten and Effective Manifolds

## Core equations
E + S ↔ ES → E + P
v = V_max [S] / (K_M + [S])

## Main idea
A higher-dimensional dynamical system can collapse onto a lower-dimensional effective law.

## Geometry to show
- phase portrait of fast and slow variables
- slow manifold
- reduced curve

## Controls
- adjust timescale separation
- show full model vs reduced model

## Step-by-step learner sequence
1. Show full dynamics in the fast/slow plane.
2. Animate trajectories relaxing quickly toward a slow manifold.
3. Then moving slowly along it.
4. Compare with the reduced Michaelis–Menten law.

## What the learner should notice
- Reduction is not arbitrary; it is geometric.
- A complicated system can obey a simpler law because motion collapses to a constrained subspace.

## Connection field
Connects to sloppiness and coarse-graining, but by a different mechanism.

---

# Interactive Block 14 — Manifold Boundaries and Theory Limits

## Core equations
θ -> Y(θ)
with limits such as c -> ∞ and ħ -> 0

## Main idea
Simpler theories can appear as boundary limits of richer theories.

## Geometry to show
- manifold with a boundary
- geodesic toward a boundary approximation

## Controls
- vary a parameter toward its boundary
- choose example: relativity to Newtonian, quantum to classical

## Step-by-step learner sequence
1. Start inside the full theory.
2. Move along a sloppy direction.
3. Approach a manifold boundary.
4. Watch predictions simplify.
5. Interpret the limiting theory.

## What the learner should notice
- Simpler theories need not be unrelated theories.
- They can emerge as limiting geometry.

## Connection field
Connects model manifolds to relativity and quantum-classical limits.

---

# Interactive Block 15 — Noether, Hamiltonian Geometry, and Conserved Motion

## Core equations
ż = J ∇H
dH/dt = 0

## Main idea
Conserved quantities constrain motion to level sets.

## Geometry to show
- phase space
- Hamiltonian level sets
- tangent vector field

## Controls
- choose Hamiltonian
- drag initial condition
- animate trajectory

## Step-by-step learner sequence
1. Show energy contours.
2. Pick a starting point.
3. Animate motion.
4. Show tangent direction.
5. Verify motion stays on one contour.

## What the learner should notice
- Conservation creates geometry.
- Motion changes state without changing total Hamiltonian.

## Connection field
Connects symmetry to conservation to constrained motion.

---

# Interactive Block 16 — Fourier Magnitude, Phase, and Hidden Information

## Core equations
x̂(ω) = |x̂(ω)| e^{iφ(ω)}

## Main idea
Magnitude and phase play different roles; magnitude can preserve second-order structure while losing waveform detail.

## Geometry to show
- spectrum magnitude
- phase sliders
- reconstructed waveform
- autocorrelation

## Controls
- hold |x̂| fixed
- vary φ
- compare multiple reconstructions

## Step-by-step learner sequence
1. Start with one signal.
2. Freeze the magnitude spectrum.
3. Randomize or alter phase.
4. Reconstruct.
5. Compare waveform, autocorrelation, and defect geometry.

## What the learner should notice
- Same magnitude can correspond to different signals.
- Some geometries preserve only partial information.

## Connection field
Connects to translation defect and “what survives / what is lost.”

---

# Interactive Block 17 — Coarse-Graining and Relevant Structure

## Main idea
Coarse-graining removes details and reveals which directions matter macroscopically.

## Geometry to show
- repeated smoothing / block averaging
- parameter relevance bars
- flow in theory space

## Controls
- coarse-graining scale
- initial fine-scale pattern
- relevant/irrelevant parameter toggles

## Step-by-step learner sequence
1. Start with a detailed microscopic pattern.
2. Coarse-grain once.
3. Repeat multiple times.
4. Show some features survive, others vanish.
5. Track relevant vs irrelevant directions.

## What the learner should notice
- Not all structure is equally persistent.
- Effective geometry depends on scale.

## Connection field
Connects to Michaelis–Menten, sloppiness, Fisher geometry.

---

# Interactive Block 18 — Physical Energy vs L² “Energy”

## Core equations
E_signal = ∫ |x(t)|² dt
E_physical = ∫ P(t) dt

## Main idea
Representational “energy” and physical energy are not automatically the same thing.

## Geometry to show
- two signals with same physical energy but different L² energy
- Parseval comparison

## Controls
- choose what the signal represents: power, voltage, abstract amplitude
- compare integrals

## Step-by-step learner sequence
1. Choose two power signals with equal area.
2. Compute physical energy.
3. Compare squared norms.
4. Fourier-transform both and show Parseval still holds for the L² quantity.

## What the learner should notice
- Conservation in representation space is not identical to conservation in physical law.
- Interpretation depends on what the measured function actually means.

## Connection field
Critical for preventing conceptual confusion.

---

# Recommended order for the interactive learning path

## Path A — Core geometry path
1. Invariant-form geometry
2. Inner product / orthogonality
3. Fourier as change of representation
4. Parseval / orthogonal energy decomposition
5. Translation symmetry defect
6. Orbit and stabilizer
7. Symmetric-subspace projection

## Path B — Duality and physics path
8. Uncertainty / localization
9. Lorentz geometry
10. Wave variables and particle variables
15. Hamiltonian geometry

## Path C — Effective theory path
11. Model manifold
12. Fisher geometry
13. Michaelis–Menten reduction
14. Manifold boundaries
17. Coarse-graining

## Path D — Information and limits path
16. Fourier magnitude vs phase
18. Physical energy vs L² energy

---

# Final design principle

Every interactive must help a learner answer this question:

What is the hidden geometry of this equation, and what becomes visible when I transform, decompose, or constrain the object?

And especially for this project:
Can the learner see orthogonality, invariance, symmetry, loss of information, and effective dimensional reduction — even when they are not visually obvious at first?
