# Prototype spec: Interactive 01 at `try/`

Nadia's specification, verbatim. **Revision 2 (2026-11-18) governs.** Revision 1 is kept below, superseded. Every
learner-facing line of the prototype is copied from Revision 2, and `test/try.test.js` checks that.

## Revision 2 (2026-11-18): focused correction pass — governs

Revise ONLY the existing `/try/` Interactive 01.
This is a focused correction pass.
Do not redesign the site.
Do not modify the research preview.
Do not create another interactive.
Do not introduce another mathematical concept.
Do not add your own interpretation of the project.
The learner experience must follow the specification below exactly.

THE ONE PURPOSE OF THIS INTERACTIVE
Everything in this interactive must serve this single statement:
To show that a result of 0 can come from nonzero parts cancelling each other, so 0 may contain hidden structure rather than mean “nothing.”
Do not expand this into another theory.
Do not add a second takeaway.
Do not end with another philosophical statement.

MATHIGON IS THE BASELINE
Use Mathigon interactive courses as the fixed baseline for the learner experience.
This means:

- extremely small learning steps;
- direct manipulation;
- minimal text;
- learner action before explanation;
- progressive reveal;
- small questions embedded naturally into the interaction;
- immediate friendly feedback;
- visual discovery instead of paragraphs;
- no concept-heavy lesson title;
- no dashboard UI;
- no large explanatory cards;
- no decorative animation that does not teach something;
- mathematics revealed through the learner's actions.

Do not create a new visual or interaction philosophy.
The objective is:
a small Mathigon-style learning moment built from Nadia's research question.
Claude has implementation freedom only for minor technical details such as spacing, responsive dimensions, accessibility, and exact easing.
Claude does NOT have freedom to change:

- the interaction metaphor;
- the wording;
- the sequence;
- the mathematical idea;
- the role of MRI;
- the questions;
- the final takeaway.

If you think something should change, put it under:
`PARKED SUGGESTION`
Do not implement it.

CURRENT PROBLEMS TO CORRECT
The present version has several problems.

1. REMOVE THE CURVE
The existing curve/path is confusing.
The learner can reasonably wonder:

- What does the curve represent?
- Why are the pieces travelling along it?
- Is the curve mathematically important?

It is not needed for this discovery.
Remove it completely.
No:

- curved path;
- circular guide;
- unexplained trajectory;
- decorative geometric line connecting cancellation.

2. REMOVE THE COMPASS-NEEDLE METAPHOR
The existing pieces resemble compass needles.
This introduces unnecessary questions about:

- north and south;
- compass physics;
- magnetic poles;
- rotation.

None of these belongs in Interactive 01.
Replace the compass needles with extremely simple directional pieces.
Use only:
←
and
→
at this stage.
The pieces can be rendered as polished, rounded arrows or short bars with clear arrowheads.
They should feel tactile and visually satisfying, but mathematically obvious.
Do not use arbitrary angles.
Do not rotate them.
Do not introduce vector terminology.
The learner only needs to perceive:
this points one way;
this points the opposite way.

3. MAKE CANCELLATION OBVIOUS
Use approximately 6–8 individual nonzero pieces.
Example initial set:
`← → → ← ← →`
The learner can drag a left-pointing piece beside a right-pointing piece.
When opposite pieces come sufficiently close:

1. they gently snap together;
2. a tiny temporary `0` appears between/below them;
3. both pieces remain visible;
4. the central TOTAL updates.

Do NOT:

- make the pieces disappear;
- send them along a curve;
- rotate them;
- merge them into one object;
- create elaborate effects.

The learner must be able to visually understand:
these two things are still here, but their contributions cancel.
Use generous snapping so the interaction feels effortless rather than like a precision game.
Support tap/click pairing as an alternative to dragging.

4. CENTRAL TOTAL
Keep a simple visual TOTAL near the center/top of the interactive area.
As the learner forms cancelling pairs, the total visibly reduces.
Do not show a graph.
Do not show equations.
Do not show vector notation.
When every contribution is balanced, the total becomes a large clean:
0
This must be visually unmistakable.

5. OPENING
Keep the introduction extremely short.
Show:
You know more about an MRI than you think.
Then:
Try this.
Small button:
Start
Do not explain MRI.
Do not explain what the arrows represent yet.
After Start, show:
Can you make the total 0?
Then let the learner play.

6. FIRST MICRO-QUESTION
After the learner has successfully cancelled some pairs but before completing all of them, pause naturally.
Show a small Mathigon-style checkpoint directly within the flow.
Ask:
Can every piece still be here while the total is 0?
Choices:
Yes
No
Not sure
After any selection say only:
Let's see.
Do not say whether they were right.
Immediately return to the interaction.
The learner should discover the answer through what happens next.

7. REACHING ZERO
When the final opposite pair is formed:
the central TOTAL becomes:
0
Every individual piece must remain clearly visible.
Pause briefly.
Then show:
You got 0.
Then:
But did everything disappear?
Button:
Look closer
No paragraph.
No explanation yet.

8. SECOND MICRO-QUESTION
After Look closer, make the paired pieces slightly more visually prominent while the large 0 remains visible.
Ask:
If the total is 0, are the pieces gone?
Choices:
Yes
No
If the learner chooses No:
Exactly. They cancelled.
If the learner chooses Yes:
Look again — they're still there.
Allow another selection.
Do not use red error styling.
Do not make this feel like an exam.

9. AFTER-QUESTION ANIMATION — THE MOST IMPORTANT REVEAL
After the learner understands that the pieces still exist, DO NOT explain the idea with a paragraph.
Instead, use animation to reveal the deeper point:
the same visible result of 0 can have many different nonzero arrangements behind it.
This animation must be a central teaching moment.
Keep the 0 fixed
Place a large:
0
at the center.
The `0` should stay in exactly the same place throughout the sequence.
The learner is now looking at the result.
Behind/around it, change the underlying arrangements.
ARRANGEMENT 1
Start with the configuration the learner just created.
For example:
`← → ← → ← →`
The result remains:
0
Small temporary text:
Same result.
ARRANGEMENT 2
Smoothly rearrange into a clearly different configuration.
For example:
`← ← → → ← →`
Still:
0
Small temporary text:
Different arrangement.
ARRANGEMENT 3
Increase the number of pieces.
For example:
`← ← ← → → → ← →`
Still:
0
Small temporary text:
Still 0.
The important visual event here is that more things can exist behind the same visible result.
ARRANGEMENT 4
Create an even denser but still visually understandable set of cancelling pieces.
The arrangement should look substantially different from the previous three.
The center must remain:
0
Do not make the learner calculate.
Do not introduce formal addition.
The visual should make the idea self-evident.

10. ANIMATION RULES
This is NOT decorative animation.
The animation exists to distinguish:
what we observe
from
what produced what we observe.
Use simple Mathigon-style motion:

- pieces smoothly move to new locations;
- additional paired pieces can fade/slide into view;
- opposite pieces remain visually identifiable;
- transitions should be short and readable.

Do not use:

- cinematic effects;
- explosions;
- confetti;
- random particles;
- glowing portals;
- complex 3D;
- curves;
- unnecessary rotation.

The learner's attention must stay on:
0 stays the same; what is behind it changes.

11. VISUAL REVEAL AFTER THE ANIMATION
After the final arrangement:
keep the large 0 prominent.
Allow the many nonzero pieces to remain visible behind/around it.
Then show only:
One result. Many possible arrangements behind it.
Pause.
This should be the moment where the learner begins to understand what “hidden structure” means without needing the phrase explained academically.

12. MRI CONNECTION
Only after the learner has made the discovery should MRI appear.
Keep it extremely brief.
Show:
This same basic idea appears in MRI: tiny magnetic contributions can cancel each other.
Then:
You just understood one idea inside one of medicine's most complex machines.
Nothing more.
Do NOT explain:

- protons;
- longitudinal magnetization;
- transverse magnetization;
- B0;
- magnetic fields in detail;
- RF pulses;
- Larmor frequency;
- MRI signal formation.

MRI is an example.
MRI is not the lesson.

13. REMOVE THE CURRENT LONG ENDING
The existing ending contains too much text.
Delete it.
The final line of this interactive must be exactly:
To show that a result of 0 can come from nonzero parts cancelling each other, so 0 may contain hidden structure rather than mean “nothing.”
Do NOT put another sentence after it.
Do not add:

- “Maybe zero is where geometry begins.”
- a next lesson teaser;
- another research question;
- explanation of “hidden structure”;
- philosophical commentary.

STOP there.

14. TEXT BUDGET
The learner should interact far more than they read.
Aim for roughly:
80% interaction / visual discovery
20% text
No learner-facing paragraph should exceed two short sentences.
Most text should be one line.
Never display all instructional text simultaneously.
Reveal it progressively.

15. FULL REQUIRED LEARNER FLOW
The experience must now be:
1
You know more about an MRI than you think.
Try this.
2
Learner starts.
Can you make the total 0?
3
Learner pairs opposite directional pieces.
TOTAL reduces.
4
Midway checkpoint:
Can every piece still be here while the total is 0?
Yes / No / Not sure
Let's see.
5
Learner finishes pairing.
TOTAL becomes:
0
6
You got 0.
But did everything disappear?
Look closer
7
Second checkpoint:
If the total is 0, are the pieces gone?
Yes / No
Short feedback only.
8
The large 0 stays fixed.
Several different nonzero cancelling arrangements animate behind it.
Text appears sequentially:
Same result.
Different arrangement.
Still 0.
9
Final arrangement remains visible.
One result. Many possible arrangements behind it.
10
MRI connection:
This same basic idea appears in MRI: tiny magnetic contributions can cancel each other.
You just understood one idea inside one of medicine's most complex machines.
11
Final sentence exactly:
To show that a result of 0 can come from nonzero parts cancelling each other, so 0 may contain hidden structure rather than mean “nothing.”
STOP.

16. DO NOT ADD
Do not add:

- a lesson title such as “Understanding Zero”;
- a learning objective;
- a progress dashboard;
- a research panel;
- equations;
- formal vector notation;
- extra MRI education;
- explanation cards;
- sources;
- verifier information;
- another interactive;
- navigation to the next theory.

The concept should be discovered through the interaction itself.

17. ACCEPTANCE CHECK
Before stopping, verify all of the following:

1. The curve is completely removed.
2. Compass needles are completely removed.
3. Pieces are simple left/right directional objects.
4. Pairing opposite pieces is visually obvious.
5. Paired pieces remain visible.
6. The learner can reach exactly 0.
7. The first micro-question appears before completion.
8. The second micro-question appears after zero.
9. Incorrect quiz choices receive short, friendly feedback.
10. The after-question animation shows at least four visibly different nonzero arrangements that all produce 0.
11. The 0 stays visually fixed while underlying arrangements change.
12. The animation clearly communicates that the result alone does not reveal the full arrangement.
13. MRI appears only after the mathematical discovery.
14. MRI explanation is no longer than the two specified sentences.
15. There are no advanced MRI terms.
16. The final sentence is exactly the specified sentence.
17. Nothing appears after that sentence.
18. No next interactive is started.
19. Desktop and mobile both work.
20. Touch and mouse both work.
21. No horizontal overflow.
22. Reduced-motion mode still communicates the same idea through sequential static configurations.

STOP
Modify ONLY `/try/`.

## Revision 1 (2026-11-18): superseded, kept as history


Mathigon controls the interaction language. Chatgpt and Nadia conversations control the intellectual story. Claude controls only the code necessary to combine the two.

Mathigon itself describes its approach as: content broken into small sections, active participation required before the next step is revealed, exploration through simulations/patterns, and narrative designed around curiosity, surprise, and discovery rather than simply telling the learner the result.

## NON-NEGOTIABLE REFERENCE: MATHIGON

Use Mathigon interactive courses as the baseline for the entire learner experience.
Do not interpret “Mathigon-like” loosely.
The prototype should follow these specific Mathigon characteristics:

- one small idea at a time;
- short pieces of text integrated directly into the experience;
- learner action before explanation;
- the next piece of content appears only after the learner interacts;
- direct manipulation of mathematical objects;
- prediction/checkpoint questions inserted naturally into the flow;
- immediate, friendly feedback;
- visual change that responds directly to the learner's action;
- discovery first, terminology second;
- curiosity and surprise are more important than decorative animation;
- no dashboard feel;
- no large cards explaining theory;
- no long instructional paragraphs;
- no upfront learning objective;
- no title revealing the mathematical concept being taught.

The learner should initially not know that this is a lesson about zero.
The interaction itself must cause that realization.

## VISUAL BASELINE

Follow the general visual restraint of a polished Mathigon course interaction:

- clean white or very light background;
- simple, high-contrast typography;
- one strong accent color for active mathematical objects;
- secondary colors only when they encode mathematical meaning;
- flat/clean shapes rather than cinematic or highly decorative graphics;
- generous whitespace;
- text positioned close to the object/action it refers to;
- mathematical objects should dominate the screen;
- controls should appear only when needed;
- avoid dark SaaS dashboards, glass effects, excessive gradients, glowing UI, marketing-page styling, or elaborate hero sections.

Do not invent a new visual language for Nadia.
For this prototype, Mathigon is the visual and interaction baseline.

## INTERACTION BASELINE

Do not create a generic drag-and-drop demo and then place explanation underneath it.
The interaction must progress in small steps.

STEP 1
Show only:
You probably understand more about an MRI than you think.
Then:
Try this.
A small Start control.
No explanation.

STEP 2
Reveal the magnetic-needle objects and the prompt:
Can you make the total disappear?
Nothing else.
The learner interacts.
Do not show the answer or explain cancellation yet.

STEP 3
After the learner has successfully matched/cancelled some pieces, pause naturally and reveal only:
Can every piece still be there and the total become 0?
Choices:
Yes
No
Not sure
After any choice:
Let's find out.
Then immediately return control to the learner.

STEP 4
The learner completes the arrangement.
The center reaches:
0
All contributing pieces remain visibly present.
Give the result a short visual pause.
Then reveal:
You got 0.
Then:
But did everything disappear?
Button:
Look closer

STEP 5
After Look closer, visually emphasize that the individual pieces are still present while the total remains 0.
Then show only:
The total is 0. What does that tell us?
Options:
Nothing is there
The parts can still be there
Every part must be 0
For the intended answer:
Exactly. They cancel.
For another answer:
Look again — the pieces are still there.
Allow the learner to try again.

STEP 6
Only now introduce MRI:
This same cancellation idea appears inside MRI physics. Tiny magnetic contributions can oppose one another even though the individual contributions are still there.
Then:
You just uncovered one idea inside one of medicine's most complex machines.
Do not explain MRI further.

STEP 7
Move away from MRI and return attention to the mathematical discovery.
Reveal:
The meaning of 0 just changed, didn't it?
Then:
0 can be the result of nonzero parts cancelling each other.
Finally:
If the answer is 0, what can the arrangement behind it still tell us?
Stop.
Do not answer this question.
Do not introduce the next lesson.

## MATHEMATICAL OBJECT DESIGN

The objects should resemble simple magnetic needles but behave mathematically like directional contributions.
Use approximately 6–8 pieces.
They should be visually simple enough that the learner understands direction immediately.
Each piece remains visible throughout the interaction.
When two opposite pieces cancel:

- pair them visually;
- use a short Mathigon-like motion/snap;
- update the central total;
- keep both pieces visible.

Do not make them explode, disappear, glow dramatically, or behave like a video game reward.
The interesting event is the mathematics itself.

## CENTRAL TOTAL

The total must be visually obvious and continuously respond to the arrangement.
Use a simple central directional indicator.
As contributions cancel, its magnitude decreases.
When the total becomes zero, replace the directional indicator with a clear:
0
The learner should understand the change visually before any explanation appears.

## CLAUDE'S ALLOWED FREEDOM

Claude may choose only minor implementation details such as:

- exact spacing;
- responsive dimensions;
- exact neutral/accent shades within the Mathigon-like visual baseline;
- technically appropriate easing;
- SVG implementation details;
- touch/mouse handling;
- accessibility implementation.

Claude may NOT independently choose:

- a different visual design philosophy;
- a new color/style concept;
- a different story;
- different learner questions;
- different ordering;
- extra explanations;
- additional mathematical concepts;
- additional MRI content;
- a different final takeaway;
- another interaction;
- a dashboard or chapter system.

If Claude believes any of those should change, do not implement the change.
Place it in:
`PARKED SUGGESTION`
and stop.

## SUCCESS STANDARD

The prototype should feel like one small step from a Mathigon course built around Nadia's question, not a website inspired by Mathigon.
The learner should finish thinking:
“Wait — zero doesn't necessarily mean there was nothing there.”
They should NOT finish thinking:
“I just read an explanation of MRI and cancellation.”
Build only this experience and stop.
