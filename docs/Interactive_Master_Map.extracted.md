<!-- Text extracted from docs/Interactive_Master_Map.docx (paragraph by paragraph, no edits) so the theory registry can
     quote it and test/theories.test.js can check quotes verbatim. The .docx is the governing document. -->

Master Map — Creative Interactive Experiences

Recovered topic map from the Paper Structure Review discussion

I would keep your original 19 topics in the same intellectual progression and add finite-energy systems as the final application. Rather than making each interactive feel like a separate lesson, I want the visitor to feel as though they are discovering one mathematical idea that gradually transforms into another.

Everything will build on something the visitor has already seen. The same wave that begins as music eventually becomes a vector, a Fourier representation, a geometric object, and finally part of a physical energy system.

Here is how I imagine each interactive, described entirely in words—no code or visual mockups yet.

Stage I — From physical experience to mathematical representation

The visitor begins with something familiar and gradually discovers the mathematics hidden inside it.

1. What is a signal? — Make the invisible visible

Imagine the screen opens with a beautifully animated guitar string. The visitor plucks it, hears a note, and watches the string vibrate.

Beside it, a thin line begins drawing the vibration as a waveform. They can pluck harder, stop the vibration, or change the string's tension.

The important discovery is that something physical can be represented by a mathematical function.

What carries forward: The waveform remains available for the next interactive.

2. Music as a mathematical language — Build your own sound

The waveform from the previous display becomes a tiny musical laboratory.

The visitor can choose a piano, violin, or flute-like synthesized sound. The visual wave changes with each selection.

Then they are given two simple controls: pitch and amplitude. They can hear and see the difference between changing frequency and changing magnitude.

Now introduce a comparison: what if the signal measured electrical power instead of sound?

The shape could be mathematically similar, even though the physical quantities and units are different.

What carries forward: A function can represent different physical phenomena, but its meaning depends on what is measured.

3. Periodicity in nature — Find the repeating pattern

The visitor sees the waveform extending across the screen.

They can select one segment and attempt to slide it along the rest of the signal. When it aligns perfectly with a repeating segment, both portions illuminate.

They have discovered a period.

Then let them try a nonperiodic sound or a single impulse. The same alignment no longer works indefinitely.

This sets up your larger question about periodicity in the physical world without assuming everything must be periodic.

What carries forward: Repetition introduces a mathematical transformation that preserves a pattern.

4. Symmetry across space and time — Move without changing

The previous waveform stays on screen.

The visitor drags the entire waveform horizontally. As it moves, its position changes, but its repeating pattern remains the same.

Then show a rotating wheel. The wheel can rotate through a complete revolution and return to the same arrangement.

The visitor discovers that symmetry does not necessarily mean something looks like a mirror image. It can mean that an object or pattern remains unchanged under a particular transformation.

This is where we can introduce Dr. Osgood's discussion of periodicity and symmetry.

What carries forward: Symmetry is connected to what remains unchanged when something moves or transforms.

5. What is a representation? — One thing, different mathematical views

Return to the musical note.

The visitor can switch between a vibrating string, a waveform, a rotating point, and a numerical description of the same idealized signal.

Instead of simply switching pictures, the representations transform into one another.

They can alter the waveform and watch the other mathematical views update.

The question becomes: Are these different objects, or different descriptions of one object?

What carries forward: Mathematical representations can look different while preserving relationships. This prepares the visitor for Fourier analysis.

Stage II — Fourier analysis, infinity, and orthogonality

The visitor now investigates how simple periodic components can combine into complex structures.

6. Fourier series — Construct a complex wave from circles

Begin with the rotating point from the previous section.

The visitor adds a second rotating point, then a third. Each produces its own sine or cosine component.

As more components are added, the combined waveform becomes increasingly complicated.

Instead of immediately showing an infinite series, provide an Add Harmonic control. Each click introduces another component, so the visitor watches complexity emerge from simple motions.

Eventually reveal the mathematical expression describing what they have built.

What carries forward: Complex signals can be represented as combinations of simpler basis functions.

7. Fourier coefficients and orthonormal bases — Give every harmonic a role

Now display the harmonic components as individual objects.

The visitor can change the amplitude and phase of each component and immediately watch the reconstructed waveform change.

Each harmonic has its own coefficient.

Then introduce the idea that these components form an orthonormal basis under an appropriate inner product.

An interesting interaction would let the visitor temporarily remove one coefficient and see exactly what information disappears from the reconstructed function.

What carries forward: Each coefficient specifies how much of a basis component contributes to the overall representation.

8. Orthogonality and zero — Find the relationship that disappears

Start with two arrows on a plane.

The visitor rotates one while the other remains stationary. A numerical dot product responds continuously.

When the arrows become perpendicular, the dot product reaches zero.

Then bring back two Fourier basis functions and calculate their inner product over a full period.

The visitor can see positive and negative contributions cancel.

This introduces zero not as an empty space, but as the result of a particular mathematical relationship.

What carries forward: Orthogonality is a property defined through an inner product, not only through visible perpendicular lines.

9. Orthogonality beyond visible dimensions — Explore what cannot be seen

Begin with two-dimensional vectors. Then allow the visitor to switch to three dimensions and rotate the coordinate system.

Next, introduce four-dimensional vectors.

Rather than pretending to show literal 4D space, let the visitor examine several different 2D and 3D projections of the same vectors.

Something intriguing can happen: two vectors may look perpendicular in a projection even though their actual higher-dimensional inner product is not zero.

The visitor learns that geometric relationships can exist independently of our ability to visualize them directly.

What carries forward: Geometry is not limited to physically visible dimensions.

10. Mean-square convergence — Watch infinity being approached

Return to the Fourier reconstruction.

The visitor selects a square wave and begins adding harmonics one at a time.

The approximation improves, but an overshoot appears near each discontinuity.

Give the visitor three ways to measure the approximation: error at an individual point, maximum error, and mean-square error.

They can discover that improvement according to one measure does not always mean improvement according to another.

The number of included terms increases, while the display makes clear that every calculation still uses a finite approximation.

What carries forward: Convergence depends on how we define and measure closeness.

11. Squared coefficients, length, and energy — Where did the magnitude go?

The visitor now sees the waveform alongside its Fourier coefficients.

On one side, its squared L² norm is calculated from the function. On the other, squared Fourier coefficient magnitudes are added together.

As coefficients change, both quantities update together according to Parseval's identity, with consistent normalization.

Then allow the visitor to switch the signal's physical interpretation from sound pressure to electrical power.

The squared mathematical norm still exists, but the meaning and units of the quantity change.

This is where your question about mathematical energy as strength, magnitude, or importance becomes central.

What carries forward: Squared magnitude can be preserved across representations, but its physical interpretation requires care.

12. Fourier pairs — Change the representation, not the underlying information

Take the same signal and present two synchronized windows: time domain and frequency domain.

The visitor can change the timing or shape of the signal and observe what happens to its Fourier representation.

A particularly interesting experiment would be to change only the phase while keeping coefficient magnitudes unchanged.

The frequency magnitude display may remain identical while the time-domain signal changes considerably.

This directly introduces your question: If mathematical energy is preserved, what other information distinguishes two representations?

What carries forward: A representation may preserve one property while expressing other properties differently.

Stage III — Zero, quadratic geometry, and the identity matrix

The visitor moves from the geometry of individual signals to the rules by which mathematical objects are measured.

13. Zero as a mathematical cornerstone — Explore different meanings of nothing

Begin with a completely blank coordinate plane and a point at the origin.

The visitor creates a vector by dragging away from zero. Its coordinates and length appear.

Then provide several different situations: a zero-length vector, a zero Fourier coefficient, a zero inner product, and the zero-frequency Fourier component.

Let the visitor explore each and discover that these are not interchangeable, even though they all involve zero.

This would be a useful place to incorporate Osgood's remark about zero, after checking the original lecture.

What carries forward: Zero has different roles depending on the mathematical structure in which it appears.

14. Quadratic geometry and the identity matrix — Change the rule for measuring space

Return to the vector from the previous interactive.

Initially, all points of equal distance from the origin form a circle.

Then introduce the matrix M. The visitor changes its entries and watches those circular level sets become ellipses for positive-definite matrices.

The vector itself has not moved, yet its quadratic measurement may change.

Set M = I, and the ordinary squared Euclidean norm returns.

This creates a visual explanation for your earlier questions about the relationship between the origin, norm, squared norm, zero, and the identity matrix.

What carries forward: Geometry depends partly on how we define measurement.

Stage IV — Information geometry and prediction spaces

This stage should connect closely with the multiparameter paper you studied.

15. Information geometry — Turn predictions into geometry

Start with a simple mathematical model controlled by two parameters.

The visitor adjusts the parameters and watches the model produce different predicted curves.

Next, each prediction becomes a point in a separate representation of prediction space.

As the parameters change, the point moves along a surface representing the model's possible predictions.

The visitor can explore why some parameter changes strongly alter predictions while others produce almost no visible difference.

Introduce a distance measure and, eventually, a geodesic path along the model manifold.

What carries forward: A family of predictions can possess a geometry, and distances in that geometry can express meaningful differences between model outputs.

16. Higher-dimensional prediction space — What exists beyond the visible model?

Continue using the same model.

Introduce additional measured times or outputs so each prediction is represented by more coordinates.

The visitor can change projections and examine the same prediction geometry from different viewpoints.

Then introduce your question about a possible infinite prediction space.

Could a mathematical description contain relationships that cannot be represented directly in our familiar three spatial dimensions?

This display could introduce your speculative connection to a four-dimensional description in which events exist together, while carefully distinguishing a model's prediction space from physical spacetime.

What carries forward: A mathematical space can contain more structure than a single visible projection reveals.

Stage V — Conjugacy, perception, infinity, and time

This is where the educational journey becomes more exploratory and begins directly investigating your original thesis.

17. Conjugacy and physical pairs — Search for hidden relationships

Begin with a complex Fourier coefficient and its conjugate.

The visitor changes one and observes its mathematical relationship to the other.

Then show how pairs of conjugate-frequency coefficients help produce a real-valued signal.

Once the mathematical relationship is established, introduce your broader question about physical pairs and whether observable relationships reflect deeper symmetry in nature.

The interface could let the visitor compare several kinds of pairing—mathematical conjugacy, reflection, and physical complementarity—and investigate which share formal properties.

Your subconscious analogy could appear as an optional philosophical exploration of the distinction between an underlying structure and what is consciously accessible.

What carries forward: Mathematical symmetry and conjugacy provide a foundation for asking whether observed relationships point toward deeper structures.

18. Infinity, circular geometry, and time — Your central conjecture laboratory

This is the display I would give the most room for experimentation.

Begin with the familiar rotating circle.

The visitor can let it complete one revolution, ten revolutions, a thousand revolutions, or continue indefinitely in the mathematical description.

A counter tracks elapsed time, another tracks completed cycles, while a point remains confined to the circle.

Then extend the picture into a cylindrical geometry, with the circular phase as one coordinate and unbounded elapsed time as another.

Now invite the visitor to explore your original thesis:

Adding an infinite object like time to a finite circle geometry makes sines and cosines converge to infinity.

Rather than programming that result into the animation, let the visitor compare what happens to elapsed time, number of revolutions, sine and cosine values, cumulative quantities, and mathematical limits.

From there, introduce your questions about whether time could be bound to finite geometry and paired with another infinite structure.

A separate mode could explore the idea of events represented together in four-dimensional spacetime, connecting back to your earlier questions about distance, time, and prediction space without treating them as identical structures.

What carries forward: The visitor has enough mathematical knowledge to distinguish different forms of infinity and investigate whether a geometric relationship supports your conjecture.

Stage VI — Relativity, perception, and the boundaries of mathematics

The visitor now uses the mathematics they have learned to investigate your philosophical questions.

19. Einstein, relativity, and mathematical reality — Change the observer

Begin with a simple moving object.

The visitor can switch between observers or reference frames and see how the object's measured motion changes.

Introduce spacetime diagrams and transformations, showing which measurements depend on the observer and which relationships remain invariant.

Then invite the visitor to explore your proposed connection between relational human perception and physical relativity.

The second part would focus on mathematical representation itself.

Present a mathematical model beside the physical or simulated phenomenon it describes. The visitor changes definitions, assumptions, coordinates, or measurement rules and sees how the representation changes.

This provides a way to approach your response to Einstein: If mathematics has boundaries imposed by the way it represents nature, can those boundaries be expanded?

Your philosophical questions can remain open for exploration rather than being reduced to predetermined answers.

What carries forward: We now understand mathematical representations well enough to ask whether they preserve everything about the natural phenomena they describe.

Stage VII — Finite-energy systems and potential space exploration applications

The final stage brings everything into a physical problem. This is not a conclusion to your thesis, but a place to test whether the mathematical tools provide useful insights.

20. Finite energy — Can geometry reveal something useful?

Begin with a simple spacecraft in orbit.

The spacecraft receives solar power when illuminated, consumes power to operate its systems, and stores a limited amount of energy in a battery.

The visitor can change sunlight availability, electrical demand, battery capacity, and the timing of different activities.

They can watch the battery's stored energy increase and decrease.

Now introduce representations from earlier chapters.

The visitor can view the electrical demand as a time-domain signal, examine its Fourier components, compare its mathematical squared norm with physical energy consumption, and study how different system parameters affect predictions.

One especially useful experiment would let them compare two demand patterns with the same total physical energy use but different timing.

Do the two patterns produce the same battery outcome? What changes if some activities are moved into sunlight or eclipse?

Finally, let the visitor examine whether an information-geometric model or another mathematical representation reveals relationships that help predict or manage the system.

This could become your first connection to NASA-relevant finite-energy problems without requiring you to know the eventual application in advance.

How I would make the entire journey consecutive

There is one principle I would apply to every display: never abandon a mathematical object once the visitor understands it. Transform or extend it.

For example, the visitor's original musical waveform could become a recurring reference:

The journey of one signal

A guitar string produces a waveform.

The waveform reveals periodicity and symmetry.

A rotating point generates the waveform.

Harmonics reconstruct the waveform.

Fourier coefficients give it another representation.

Orthogonality explains the basis components.

Its norm and quadratic measurements introduce geometry.

A family of similar signals introduces prediction space.

Its periodic behavior motivates your questions about infinite time and finite geometry.

A power-demand signal brings the same mathematical methods into a physically finite-energy system.

The signal used in the final step need not literally be the guitar recording; the visitor would recognize the mathematical tools they learned from the original waveform.

Each interactive should also end with a small discovery that makes the next question almost unavoidable.

For example:

After discovering periodicity: What remains unchanged when the pattern shifts?

After discovering symmetry: Could the same pattern have another representation?

After Fourier reconstruction: Why can these components be separated?

After orthogonality: What does perpendicular mean beyond three dimensions?

After Parseval's identity: What does mathematical energy actually measure?

After information geometry: Could a similar geometric representation help describe time?

After your time investigation: Do these relationships tell us something about nature, or only about our mathematical descriptions of it?

After the philosophical exploration: Can these mathematical ideas improve how we model finite physical resources?

That continuity is what will distinguish this experience from an ordinary collection of mathematics demonstrations.

My strongest recommendation is that we design one interactive at a time, beginning with "What is a signal?" For each one, we should work through the exact opening scene, what the visitor can manipulate, what changes visibly, what they discover, and how that discovery leads into the next display—then refine the visual and mathematical details before moving forward.

This keeps the educational progression intact while giving your own geometric investigation room to develop, including all the hypotheses that remain open.

Document note: This version preserves the original topic-map wording and sequence; formatting has been cleaned for readability.
