# The levels: Level 1, "Inside a note" (the violin), and Level 2, "Inside the scanner" (the MRI)

Nadia's specification for the two levels as one experience at `try/`. **This document governs (2026-11-19).** The
earlier histories are kept in `docs/violin_level_spec.md` (the violin, Revisions 1–4, then called Level 2) and
`docs/prototype_try_spec.md` (the MRI, Revisions 1–4, then called Level 1; its Revision 2 holds Nadia's original
wording). Every learner-facing line of both levels is copied from the lists below. `test/note.test.js` and
`test/mri.test.js` check that.

## Nadia's request (2026-11-19), verbatim

> can you combine level one and level two. also for level one, i also want to make the point that what we perviece that produces one image with an eyeball is hiding more than it seems, also make violin level 1 and mri level 2 and change the do you see a similarity part to the mri level by saying do you see a similarity to the violin level? also the zero total should indicate 0 signal. and the users assuming they have zero knowledge about the mri, what mri does is makes that 0 into a small number manipulating the original state, but in actuallity that 0 signal is way more knowledegable than the mri signal of manipulation of magnet

## What changes

- **One page, in a new order.** `try/` holds both levels:
  - Level 1, the violin, starts at once.
  - When its last line is shown, "Next: Level 2" appears, and the MRI level opens underneath.
  - `try/level-2/` and `notebook/` forward to `try/`.
- **The violin level ends on its own take-home.** The question "Notice a similarity with the MRI scanner?" and the
  side-by-side move to the MRI level, which now comes second.
- **0 signal.** The MRI level's TOTAL is now the TOTAL SIGNAL. "The TOTAL SIGNAL adds up every arrow in the drop. A
  scanner can only pick up this total." Reaching 0 says "You got 0 signal."
- **What an MRI does, for someone who knows nothing about it.** After the magnet tips the balance: "That's what an MRI
  does: it turns your 0 signal into a small signal it can read." Then: "But the 0 was holding far more: every single
  tiny magnet, not just the few left over."
- **The eye.** After the scanner paints its picture, the picture moves aside, lines run from all over it into an eye,
  and out comes the same picture, small, labelled "one picture". The line is "Your eye sees just one picture. It's
  hiding far more than it seems." This is the MRI level's twin of the violin level's ear.
- **The similarity, now in the MRI level.** "Do you see a similarity to the violin level?" (Yes / Not yet) gets
  "Look." Then side by side: YOUR A NOTE (A + high A + E + higher A = A) and TOTAL SIGNAL (↑ + ↓ + ↑ + ↓ = 0). "In
  Level 1, one A note hid many notes. Here, one 0 signal hides countless tiny magnets."

## Level 1, "Inside a note": learner copy, in order (drafted by Claude at Nadia's request, for her review)

1. Tonight, you're the first violin.
2. Before a concert, every player tunes to the same note, so the whole orchestra plays in tune.
3. Tonight, that note is yours: an A note. The whole orchestra trusts you to get it right.
4. Drag the bow to play your A note.
5. Everyone's in tune with your A note.
6. Drag the magnifying glass onto your violin.
7. Now find the A string.
8. A (the label on the A string)
9. Your A string shakes back and forth 440 times a second.
10. This is the shape of that shaking.
11. The whole orchestra trusts this A note. Is it just one note? [Yes] [No] [Not sure]
12. Let's see. (Nadia's wording)
13. Slide the glass across the sound.
14. Hidden inside: four notes.
15. A, high A, E, higher A (the four notes, to tap)
16. Tap each one to hear it.
17. [Play them together]
18. A note (the label on what comes out of the ear)
19. Your ear takes in all four and hears just one A note. Inside, it is many notes at once.
20. One thing on the outside. Many hidden parts inside.

Nothing comes after line 20 in Level 1.

## Level 2, "Inside the scanner": learner copy, in order (drafted by Claude at Nadia's request, for her review)

Lines marked (R2) are Nadia's own wording, from `docs/prototype_try_spec.md` Revision 2.

1. This is an MRI scanner.
2. It can see inside your body: no X-rays, no cuts.
3. You know more about an MRI than you think. (R2)
4. [Slide in]
5. Inside, a giant magnet surrounds you.
6. [Zoom in]
7. O, H (the letters on the atoms)
8. Your body is full of water.
9. One drop holds billions of trillions of hydrogen atoms.
10. [Closer]
11. N, S (the letters on every magnet)
12. At the heart of each hydrogen atom is a proton: a tiny magnet.
13. Picture each one as an arrow, pointing from S to N.
14. So many tiny magnets. Why don't they add up to one giant magnet?
15. TOTAL SIGNAL (the label on the total; Nadia's "TOTAL", now naming the signal)
16. The TOTAL SIGNAL adds up every arrow in the drop. A scanner can only pick up this total.
17. + = … (the adding, written inside the TOTAL SIGNAL)
18. Can you make the total 0? (R2)
19. Drag a ↓ next to an ↑. (only after 6 seconds without a move)
20. 0 (under every balanced group)
21. Can every piece still be here while the total is 0? [Yes] [No] [Not sure] (R2)
22. Let's see. (R2)
23. You got 0 signal.
24. But did everything disappear? [Look closer] (R2)
25. If the total is 0, are the pieces gone? [Yes] [No] (R2)
26. Exactly. They cancelled. (R2; after No)
27. Look again — they're still there. (R2; after Yes)
28. That's the answer: inside you, opposite tiny magnets cancel each other out.
29. Same result. (R2)
30. Here's another drop. Its total is 0 too.
31. ? (on the covered drop, and in its TOTAL SIGNAL)
32. What's behind this 0? [Nothing] [Something]
33. Let's see. (R2)
34. Different arrangement. (R2)
35. And another. [Look inside]
36. Still 0. (R2)
37. And another. [Look inside]
38. One result. Many possible arrangements behind it. (R2)
39. Your total signal is 0. So how can a scanner see anything?
40. [Switch on the magnet]
41. Its magnet is tens of thousands of times stronger than Earth's.
42. It tips the balance, just barely: a few more arrows point with it than against it.
43. That's what an MRI does: it turns your 0 signal into a small signal it can read.
44. In a real body, only about five to ten in every million are left over.
45. But the 0 was holding far more: every single tiny magnet, not just the few left over.
46. The scanner nudges them with radio waves and listens for their faint reply.
47. [Listen]
48. From that whisper, it paints a picture of your insides.
49. one picture (the label on what the eye sees)
50. Your eye sees just one picture. It's hiding far more than it seems.
51. You just figured out one of the core principles of MRI.
52. Do you see a similarity to the violin level? [Yes] [Not yet]
53. Look.
54. YOUR A NOTE, TOTAL SIGNAL, +, =, 0, A (the side by side)
55. In Level 1, one A note hid many notes. Here, one 0 signal hides countless tiny magnets.
56. A 0 isn't always nothing. Sometimes it's you: countless tiny magnets, perfectly balanced.

Nothing comes after line 56.

Around the levels: "Level 1", "Level 2", "Turn your sound on." (Level 1 needs sound) and "Next: Level 2".

## What the new lines claim, and what they do not

- **"0 signal" (lines 15, 16 and 23).** An MRI scanner's coil picks up the net magnetization: the total of all the
  tiny magnets, not each one. When they cancel, that total is 0 and there is nothing to pick up.
- **"That's what an MRI does" (line 43).** The scanner's magnet tips the balance, so the total is no longer 0 but a
  small number it can read. In the drawing it is 2. In a real body it is about five to ten in every million (line 44).
- **"But the 0 was holding far more" (line 45).** This states only what is certain. The 0 is one number, the total.
  Behind it were all the tiny magnets, while the scanner's small signal reflects only the few left over. Nadia's
  stronger wording, "that 0 signal is way more knowledegable than the mri signal of manipulation of magnet", belongs to
  her hypothesis **B-ZERO-LOSS**: "leaving a natural zero/cancellation state may destroy information encoded in the
  relations that generated that zero" (`research/foundation_user_theories.md`, status: hypothesis). Until that
  hypothesis is established, the learner is not told that leaving the 0 destroys information, or that the 0 "knows"
  more.
- **The eye (lines 49 and 50).** The eye takes in light from every part of the picture and we see one picture. The
  drawing shows what is seen, not how the eye works. "It's hiding far more than it seems" refers to what the story has
  shown: behind every grey dot of the picture are countless tiny magnets.
- **The side by side (lines 54 and 55).** The left side is the violin level's arithmetic: the four notes' waves add up
  exactly to the A note's wave. The right side is the MRI level's: ↑ = +1 and ↓ = −1, so each pair is 0 and the total
  signal is 0.
