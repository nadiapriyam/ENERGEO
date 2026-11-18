# Prototype spec: one Mathigon-style step (2026-11-18)

Nadia's specification, verbatim. It governs the prototype at `try/` (`src/prototypes/try/`). Every learner-facing
line of the prototype is copied from this file, and `test/try.test.js` checks that.

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
