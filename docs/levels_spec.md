# The levels: Level 1, "Inside a note" (the violin); Level 2, "Inside the scanner" (the MRI); Level 3, "A prism for sound"

Nadia's specification for the levels as one experience at `try/`. **This document governs (2026-11-19).** The
earlier histories are kept in `docs/violin_level_spec.md` (the violin, Revisions 1–4, then called Level 2) and
`docs/prototype_try_spec.md` (the MRI, Revisions 1–4, then called Level 1; its Revision 2 holds Nadia's original
wording). Every learner-facing line of every level is copied from the lists below. `test/note.test.js`,
`test/mri.test.js` and `test/prism.test.js` check that. One level can be opened on its own for review: `try/#level-2`
or `try/#level-3`.

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
4. You: That's me! No pressure. (beside your face: the player, in the bucket hat, who carries on into Levels 2 and 3)
5. Drag the bow to play your A note.
6. Everyone's in tune with your A note.
7. Drag the magnifying glass onto your violin.
8. Now find the A string.
9. A (the label on the A string)
10. Your A string shakes back and forth 440 times a second.
11. This is the shape of that shaking.
12. The whole orchestra trusts this A note. Is it just one note? [Yes] [No] [Not sure]
13. Let's see. (Nadia's wording)
14. Slide the glass across the sound.
15. Hidden inside: four notes.
16. A, high A, E, higher A (the four notes, to tap)
17. Tap each one to hear it.
18. [Play them together]
19. A note (the label on what comes out of the ear)
20. Your ear takes in all four and hears just one A note. Inside, it is many notes at once.
21. The big idea: One thing on the outside. Many hidden parts inside. (pulled out as the level's big idea; since 2026-11-23. The "Did you know?" box that stood before it, on what our ears can hear, was taken out on 2026-11-24)

Nothing comes after line 21 in Level 1.

## Level 2, "Inside the scanner": learner copy, in order (drafted by Claude at Nadia's request, for her review)

Lines marked (R2) are Nadia's own wording, from `docs/prototype_try_spec.md` Revision 2. Shortened on 2026-11-23 (see
"All three levels: reading at your own pace, and a simpler Level 2" below); the words move on when you press Next.

1. This is an MRI scanner. It can see inside a body: no X-rays, no cuts.
2. Your first patient is here. Let's see if you can take their MRI scan correctly! (Nadia, 2026-11-20: "lets see if you can do it correctly")
3. [Slide your patient in]
4. Inside, a giant magnet surrounds your patient.
5. [Zoom in]
6. O, H (the letters on the atoms)
7. Your patient's body is full of water.
8. One drop holds billions of trillions of hydrogen atoms.
9. [Closer]
10. N, S (the letters on every magnet)
11. Inside each hydrogen atom is a proton: a tiny magnet.
12. Think of each one as an arrow.
13. So many tiny magnets. Why don't they add up to one giant magnet?
14. TOTAL SIGNAL (the label on the total; Nadia's "TOTAL", now naming the signal)
15. Your scanner only picks up the TOTAL SIGNAL: every arrow in the drop, added up.
16. MRI SIGNAL (the label on the small monitor beside the TOTAL SIGNAL, in the same scene: its wave and its four bars shrink as each ↓ joins, and go flat at 0; Nadia, 2026-11-24: "shows the signal to the mri is getting weaker in a additional visual, dont add another scene rather add to the scene")
17. + = … (the adding, written inside the TOTAL SIGNAL), and +1, −1 (popping up beside its result as each arrow joins, the result counting with it)
18. Can you make the total 0? (R2)
19. Drag a ↓ next to an ↑. (only after 6 seconds without a move)
20. 0 (under every balanced group)
21. Can every piece still be here while the total is 0? [Yes] [No] [Not sure] (R2)
22. Let's see. (R2)
23. You: Oh no! I got 0 signal for my MRI! (Nadia: "oh no you got no signal for your mri"; just before it, the 0 of the TOTAL SIGNAL grows into a big bold 0 and closes around the balanced magnets, which now sit inside it: Nadia, 2026-11-24, "the magnets need to be inside 0 visually because we a showing that 0 has a geometry")
24. If the total is 0, are the pieces gone? [Yes] [No] (R2)
25. Exactly. They cancelled. (R2; after No)
26. Look again — they're still there. (R2; after Yes)
27. Inside your patient, opposite tiny magnets cancel out.
28. This balanced 0 is their natural state. (Nadia, 2026-11-24: "make sure the user know that the magnets balanced are the normal balanced state")
29. NATURAL STATE (the tag on the 0's band, appearing with line 28)
30. Same result. (R2)
31. Here's a look at some more protons in another part of your patient's body. Its total is 0 too. (Nadia, 2026-11-20: "heres a look at some more protons in another part of your patients body")
32. ? (on the covered 0: its inside frosted over, the magnets in there out of sight; and in its TOTAL SIGNAL)
33. What's behind this 0? [Nothing] [Something]
34. Different arrangement. (R2)
35. And another. [Look inside]
36. Still 0. (R2)
37. And another. [Look inside]
38. One result. Many possible arrangements behind it. (R2)
39. You (thinking): My patient's signal is 0. How will my scanner see anything?
40. [Switch on the magnet]
41. NUDGED (the 0's tag once the magnet tips the balance: the 0 leans and pales, and the MRI SIGNAL comes back, faint)
42. It tips the balance: a few more arrows point with the magnet.
43. That's what an MRI does: it turns your patient's 0 signal into a small signal it can read.
44. In a real body, it's only about five to ten in every million.
45. Your scanner nudges them with radio waves and picks up their faint reply. (radio waves come in from both sides; a faint reply spreads back out, in rings)
46. That's a nudged, faint version. The balanced 0 is the original: the MRI just made us aware of it. (Nadia, 2026-11-24: "in energeo it is paramount that we use the origninal geometry not a manipulated/faint version like an mri, however the mri made us aware of this geometry")
47. [Take the scan]
48. From that faint reply, it paints a picture of your patient's insides.
49. You: I did it! My first MRI scan!
50. one picture (the label on what the eye sees)
51. Your eye sees one picture, painted from a faint reply: a few tiny magnets in every million.
52. The big idea: There's far more hiding in a 0 than the signal shows us. (pulled out as the level's big idea; Nadia, 2026-11-23: "the bold statement")
53. A 0 isn't always nothing. Sometimes it's a whole person: countless tiny magnets, perfectly balanced.
54. And there are still so many things we don't know about, hiding behind the 0. (Nadia, 2026-11-23: "there are still so many things that we don't know about hiding behind the 0")
55. Do you see a similarity to the violin level? [Yes] [Not yet]
56. Look.
57. YOUR A NOTE, TOTAL SIGNAL, +, =, 0, A (the side by side)
58. In Level 1, one A note hid many notes. Here, one 0 signal hides countless tiny magnets.
59. Hidden things are everywhere. There are even frequencies our ears can't hear. (Nadia, 2026-11-23: "there are frequencies our ear cna't even percieve")

Nothing comes after line 59.

Around the levels: "Level 1", "Level 2", "Final level" (Level 3), "Turn your sound on." (Levels 1 and 3 need sound),
"Next: Level 2" and "Next: Final level". Each level's cover (since 2026-11-23): Level 1, "Inside a note", "Can one sound
hide more than you hear?"; Level 2, "Inside the scanner", "If one note can hide many, what could a 0 hide?"; the final
level, "A prism for sound", "Is there any way to perceive these hidden things?". The card between levels: "Up next"
(with the next level's name, headline and question, and its button). The box: "The big idea". The reader under each
level's words (see "All three levels: reading at your own pace, and a simpler Level 2" below): "Back", "Next", the bar
at the top ("Progress", for screen readers) and "Earlier" (with the part's number). The side panel (see "All three levels: the whole story as a comic, on the side"
below): the tab "Scroll through" (in the top bar), the panel's title "The whole story", and "Close"; and "Go here ›" on
each picture in the panel (tap it, and the level goes to that scene: see "Scroll through: go to a scene" below). While
more lines are on their way: "…" (three pulsing dots, no words).

## What the new lines claim, and what they do not

- **"0 signal" (lines 14, 15 and 22).** An MRI scanner's coil picks up the net magnetization: the total of all the
  tiny magnets, not each one. When they cancel, that total is 0 and there is nothing to pick up.
- **"That's what an MRI does" (line 39).** The scanner's magnet tips the balance, so the total is no longer 0 but a
  small number it can read. In the drawing it is 2. In a real body it is about five to ten in every million (line 40).
- **"There's far more hiding in a 0 than the signal shows us" (line 47, the big idea), and line 48.** This states only what is certain. The 0 is one number, the total.
  Behind it were all the tiny magnets, while the scanner's small signal reflects only the few left over. Nadia's
  stronger wording, "that 0 signal is way more knowledegable than the mri signal of manipulation of magnet", belongs to
  her hypothesis **B-ZERO-LOSS**: "leaving a natural zero/cancellation state may destroy information encoded in the
  relations that generated that zero" (`research/foundation_user_theories.md`, status: hypothesis). Until that
  hypothesis is established, the learner is not told that leaving the 0 destroys information, or that the 0 "knows"
  more.
- **The eye (lines 45 and 46).** The eye takes in light from every part of the picture and we see one picture. The
  drawing shows what is seen, not how the eye works. "It's hiding far more than it seems" refers to what the story has
  shown: behind every grey dot of the picture are countless tiny magnets.
- **The side by side (lines 52 and 53).** The left side is the violin level's arithmetic: the four notes' waves add up
  exactly to the A note's wave. The right side is the MRI level's: ↑ = +1 and ↓ = −1, so each pair is 0 and the total
  signal is 0.

## Levels 1 and 2 revision (2026-11-20): you take the scan. Nadia, verbatim:

> have more fun with this, like oh no you got no signal for your mri, for this: You know more about an MRI than you think make sure you make it fun like your about to take an mri scan, lets see if you can do it correctly. then change the preceeding wording to match the user taking an mri scan of a patient so change wordings, also introduce the use character from level 1.

### What changes

- **You take the scan.** In Level 2 the learner is no longer the patient: you are taking an MRI scan of a patient.
  - "Your first patient is here. You're about to take their MRI scan!" Then: "You know more about an MRI than you
    think. Let's see if you can do it correctly!"
  - Every line that spoke of "you" as the one in the scanner now speaks of your patient: "Slide your patient in";
    "Inside, a giant magnet surrounds your patient."; "Your patient's body is full of water."; "inside your patient,
    opposite tiny magnets cancel each other out"; "your patient's 0 signal"; "a picture of your patient's insides".
  - The scanner is "your scanner".
  - The last line is now "Sometimes it's a whole person", since the person in the scanner is no longer you.
- **More fun.**
  - When you reach 0 you say it yourself: "Oh no! I got 0 signal for my MRI!"
  - Before the magnet, you wonder: "My patient's total signal is 0. So how will my scanner see anything?"
  - When the picture is painted: "I did it! My first MRI scan!"
- **The player, from Level 1 on.**
  - The character from Level 3 (the bucket hat, dark hair, yellow shirt) is introduced in Level 1. After "The whole
    orchestra trusts you to get it right.", your face appears beside your first line: "That's me! No pressure."
  - In Level 2 you stand beside the scanner in the first scene, and your lines appear beside your face.
  - The faces and figures are drawn by one shared module (`src/levels/characters.js`, `src/math/characters.js`), the
    same in every level.
- **Level 3 still fits.** "After your scan" and "the radiologist who read your scan" now mean the scan you took. Its
  descriptions for screen readers say "your patient's head".

### What the new lines claim

- **"Oh no! I got 0 signal for my MRI!" (Level 2, line 24).** As before (the note on lines 16, 17 and 24): when the tiny magnets
  cancel, the total the scanner can pick up is 0.
- **"I did it! My first MRI scan!" (Level 2, line 50).** The story's scan: the drawing's tipped balance, then the
  picture. It is the same simplification as before, not a real scan.
- **Everything else** is unchanged in substance: only whose body it is has changed.

### Level 2, lines 31 and 47–49 (2026-11-20, later). Nadia, verbatim (two messages):

> change heres another drop to heres a look at some more protons in another part of your patients body

> also in that same section listen to the scan doesn:t make any sense

- Line 31 is now "Here's a look at some more protons in another part of your patient's body. Its total is 0 too."
- The button that starts the picture was [Listen]. Nothing on the page is heard, and you are the one taking the scan,
  so it is now [Take the scan] (line 48).
- Lines 47 and 49 drop the listening picture too:
  - line 47: "Your scanner nudges them with radio waves and picks up their faint reply.", as line 17's "Your scanner
    can only pick up this total";
  - line 49: "From that faint reply, it paints a picture of your patient's insides." ("whisper" is gone).
- **What line 47 claims.** The radio waves tip the tiny magnets, and as they turn they send out a faint radio signal
  that the scanner's coil picks up: the same total as line 17, now no longer 0.
- **What line 31 claims.** The covered drop is still drawn as a drop of water, and its protons are tiny magnets like the
  first drop's. Water is everywhere in the body, so another drop is another part of the patient's body. Its total is
  0 as well; behind that 0 is a different arrangement (lines 35 and 37), as before.

## All three levels: scrolling, and full screen (2026-11-20), superseded by the next section. Nadia, verbatim:

> also i want it to be like mathigon.org how you just scroll to go through the levels. this right now can be a full screen mode

### What changes

- **Scrolling, as in a Mathigon course.** This is now how the page works by default.
  - When a part of a story ends, its picture and its lines stay on the page. The next part starts underneath, and the
    page scrolls down to it.
  - Scroll up at any time to see every earlier part. A kept part is a still copy: nothing in it can be pressed, and
    its finished buttons are gone.
  - If the picture has not changed since the last kept part, the new lines join that part, so no picture repeats.
  - If you have scrolled up to look back, the page does not pull you down. Scroll down to carry on.
  - The levels still follow one another on one page ("Next: Level 2", "Next: Level 3").
- **Full screen: the way it was.**
  - The "Full screen" switch, at the top right, shows only the level being played, one part at a time. Its picture is
    as large as fits, and the lines clear between parts.
  - "Exit full screen" goes back to the scroll, with every part kept, even the ones played in full screen.
  - Where the browser allows it, the switch also asks for the browser's own full screen. Leaving that (Esc) leaves
    full screen too.
- **Unchanged.** The words, their order and every interaction. The review strip (`try/?steps`) still shows one step
  per frame, and a level fast-forwarding to a step ("Play from here") keeps no parts until it hands over.
- **No new claims.** Only the layout changes.
- Files: `src/levels/scroll.js` (keeping a part), `src/levels/page.js` (the switch), `src/levels/base.css`.

## All three levels: the regular layout, and scrolling through on the side (2026-11-20), its panel superseded by the next section. Nadia, verbatim:

> no make he regular without scroll aka how we had it before the scroll, the defult and make a scroll through feature on the side.

### What changes

- **The regular layout is the default again**, as before the scroll: each level plays on one board, and its lines
  clear between parts. The page no longer moves down by itself, and the "Full screen" switch is gone.
- **Scroll through, on the side.**
  - A "Scroll through" tab sits at the right edge of the screen. It opens a side panel, "The story so far".
  - The panel holds every part finished so far, in order, under each level's name: a still copy of its picture,
    then its lines. Scroll through it at any time; "Close" (or Esc) puts it away.
  - Nothing in the panel can be pressed, and its finished buttons are gone.
  - If a picture has not changed since the last part, the new lines join that part, so no picture repeats.
  - When a part is added, the tab lights up. If the panel is open at its end, it follows the new part.
- **Unchanged.** The words, their order and every interaction. The review strip (`try/?steps`) and its frames have no
  panel, and a level fast-forwarding to a step ("Play from here") adds no parts until it hands over.
- **No new claims.** Only the layout changes.
- Files: `src/levels/scroll.js` (keeping a part), `src/levels/page.js` (the tab and the panel), `src/levels/base.css`.

## All three levels: the whole story as a comic, on the side (2026-11-20). Nadia, verbatim (two messages):

> like just like a comic book scroll through the user doesnt need to finish it to see the whole story, its like a shortcut to see the whole thing quickly

> take out the all steps in level 3

### What changes

- **"Scroll through" shows the whole story, from the start.** The levels still play the regular way. The tab at the
  right edge opens "The whole story": every part of all three levels, in order, as a comic. Nothing has to be played
  or finished to see it.
  - Each part is a picture of the board as that part ends, with that part's lines under it: what is said, and who
    says it, beside their face.
  - It is a shortcut: about 40 pictures, from "Tonight, you're the first violin." to "The applications are endless!".
  - The questions are in it, and the lines that answer them; the answer buttons and the other buttons are not.
- **How the comic is made.** It is recorded from the levels themselves, not drawn separately.
  - `npm run comic` plays every level once in a browser, on `try/?record`, where each part that ends is kept
    (`src/levels/record.js`). Then it photographs each part's picture and writes down its lines, word for word, in
    `src/levels/comic/`.
  - Levels 1 and 2 are played the way a learner plays them. Level 3 fast-forwards to its end, which does each
    interaction for it (in the first question, that picks "The glass"; the line that follows is the same either way).
  - `test/comic.test.js` checks that every line in the comic is still the levels' own wording, and that each level's
    comic runs from its first line to its last. After a change to the words, it fails until the comic is recorded
    again.
- **"All steps" is gone** from the Level 3 tag. The review strip itself still opens at `try/?steps` for review.
- **No new claims.** The comic shows the levels' own pictures and words.
- Files: `src/levels/record.js`, `tools/record_comic.mjs`, `src/levels/comic/` (the recording),
  `src/levels/comic.js`, `src/levels/page.js` (the tab and the panel), `src/levels/base.css`.

## All three levels: reading at your own pace, and a simpler Level 2 (2026-11-23). Nadia, verbatim:

> change level 3 to the final level. Four notes hide in this signal. "Can you see them?
>
> Yes
> Not really
> Neither can anyone, just by looking." This script needs to be changed. when i press yes, the answer is still neither can anyone just by looking. also the signal that is presented with this script, it is aparaent that there are 4 bumps so maybe the unknowledgable user might assume that the are different notes. find a way to make that more clear. task 2: the second level is a bit confusing try to make the word count lower and simple. go through it, find gaps in which an unexperienced user would find it difficult, and if you need to add something, don't add words, add visuals. task 3: go through the whole 3 levels, and instead of the words just appearing after a set amount of seconds and disapearing with no ability for the user to go back to re read something they missed, develop a user friendly way that is also aestheticly clean to achieve the ability for the user to go back and click to go to the next words. For the click to go to the next words don't make it simple, make it fun, like for the click adda fun animation that associates them leveling up.

The first part (Level 3 as the final level, and its four-notes question) is Level 3 Revision 11, below.

### Reading at your own pace (all three levels)

- **No more timers for words.** Wherever a level used to wait a set time for you to read, it now waits for you. Under
  each level sits one slim bar, which stays at the bottom of the screen while the level is on screen:
  "‹ Back", the level's bar, and "Next ›".
- **Next, with a level-up.** When the story is waiting for you, Next glows. Pressing it (or →, or Enter) brings the
  next words. Each press sends a burst of stars into the level's bar, a "+1" pops up, and the bar fills a notch. At the
  end of the level the bar is full and turns gold: "Level up!", with confetti.
  - How far each press fills the bar comes from how many presses each level takes. The comic's recorder counts them
    (`steps` in `src/levels/comic/comic.json`).
  - While you act on the board (drag, tap, choose), Next stays grey: the story is waiting for that, not for Next.
- **Back, to read again.** "‹ Back" (or ←) shows the part before: a still picture of the board as that part ended,
  with its words, tagged "Earlier" and its number. Back again goes further back. Next pages forward, and then returns
  to now. Nothing in the level is lost while you look back.
- **Unchanged.** The words of Levels 1 and 3 (apart from Level 3's question), and what you do on the boards. With
  reduced motion there are no stars or confetti; the bar simply fills.
- Files: `src/levels/reader.js` (the bar, Back, Next), `src/levels/record.js` (keeping each part), the levels'
  `await story.next()`, and `src/levels/base.css` (in the levels' plain style: one accent, no gradients).

### A simpler Level 2

- **Fewer words: 53 lines instead of 58.** The list above is the new one.
  - The opening is two lines instead of four: "This is an MRI scanner. It can see inside a body: no X-rays, no cuts."
    and "Your first patient is here. Let's see if you can take their MRI scan correctly!"
  - Some of Nadia's earlier lines (R2) are gone because the next line asks the same thing: "You know more about an MRI
    than you think.", "But did everything disappear?" with its [Look closer] button, and the second "Let's see." (after
    "What's behind this 0?", where the drop then shows what is behind it). They can come back if she wants them.
  - The magnet's six lines are now five, each shorter. "Its magnet is tens of thousands of times stronger than
    Earth's." is gone: the field lines show the magnet is on.
- **Pictures for the gaps, instead of words.**
  - *How arrows add up.* A new learner may not see why three ↑ make 3. Now, as each arrow joins the TOTAL, "+1" pops
    up beside its result, and the result counts up with it: = 1, = 2, = 3. Each ↓ you drag in pops "−1", and the result
    counts down to 0.
  - *What "radio waves and a faint reply" means.* While that line is on screen, radio waves come in from both sides of
    the drop toward the tiny magnets, and a faint reply spreads back out from among them, in rings, until you press
    [Take the scan].
- **What the new lines claim.** The same as before, in fewer words (the notes above, renumbered). "+1" and "−1" are the
  rule the side by side already showed: ↑ = +1, ↓ = −1. The radio waves are drawn as a picture of what the line says:
  the scanner sends radio waves, and the tiny magnets send back a faint radio signal that its coils pick up. They are
  not drawn to scale or in their real shape.

## All three levels: one way forward at a time, and one bar for the whole story (2026-11-23). Nadia, verbatim (two messages):

> theres too many next buttons also put the progress bar at the top

> make sure the progress bar is for the whole 3 levels and make sure theres intervals at each levels

This changes the reader of the section above; the rest of that section stands.

### What changes

- **One way forward at a time: far fewer Nexts.**
  - Where you act next (a button, a choice, a drag, a tap), that is the way on: there is no Next before it.
  - Lines of the same part follow each other by themselves, a beat apart (under a second), and stay on the page. The
    page turns only when you press something.
  - Next appears only where the story would otherwise turn the page by itself: 2 times in Level 1, 6 in Level 2, and
    4 in the final level plus its three pattern slides. When it is not the way on, it is not shown; at the bottom,
    only "‹ Back" stays.
  - The final level's pattern slides no longer have a Next of their own: the one Next, under the level, moves them on.
  - At the end of a level, the only Next is the button to the next level.
  - Captions that used to leave after a few seconds ("Same result.", "Different arrangement.", "Still 0.") now stay;
    nothing leaves on a timer.
- **One bar for the whole story, at the top of the page.**
  - It stays at the top of the screen. It has three sections, Level 1, Level 2 and the final level, each ending in its
    marker (the last one a star), with the level's name under it; the level being played is named in blue.
  - Each Next sends stars from the button up into the bar, a "+1" appears, and the level's section fills a notch.
  - When a level is done, its section fills and its marker turns gold, with confetti: "Level up!".
  - How far each press fills a section comes from that level's count of presses (`steps` in the comic recording).
- Files: `src/levels/reader.js`, `src/levels/base.css`, and the levels' `story.next()` and `story.beat()`.

## All three levels: the magazine, and the thought it builds (2026-11-23). Nadia, verbatim:

> i think we should add, the bold statement around from the reply, we get an image portion in level 2. that theres a lot hiding in 0, more than what we see when the magnet from the mri shows us a visible signal. and then change words in this level to lead up to this, like faint reply, there are still so many things that we don't know about hiding behind the 0. and then say when relatin gthat to the violin, there are frequnecies our ear cna't even percieve, is there any possible way to percieve these hidden things. Well supreise we've already figured out a few, but there are endless possibilities to this, what weve discovered is just the surfect. Ok this is a very important assimgnemtn that i want you to take your time with. I need you to read carefully through this prompt and go over the 3 levels and change wordings, chagne themes, to achieve this thought of "there are still so many things that we don't know about hiding behind the 0. and then say when relatin gthat to the violin, there are frequnecies our ear cna't even percieve, is there any possible way to percieve these hidden things. Well supreise we've already figured out a few, but there are endless possibilities to this, what weve discovered is just the surfect. " in order to do this I want you to think of this as one of those nat geo kids magezine but tech, that ultimately introduces ENERGEO a platform but also a new discipline of study/ a sector of a new science: energy geometry so this would be the eductation introduction of how all the information the user learns is building their knowledge of what this field is. this is the Design Assignment to finnally get these levels in their rightful place. 1. change the transitions, make it so the user thinks that thought i mentioned in this prompt at the end of these three levels, a builded up thought. the end product isn't just them understanding what fourier transform is but its a crucial piece that is needed to know that going from a whole thing to its parts that we can't see is possible. Energeo maps all the transfomations that can occur such as the fourier transfomation and develops a geometry science to deveop tools that help us see thing that we couldn't but have always existed.

### The thought the three levels build

Each level adds one step, and each "Up next" card carries the thought into the next level:

1. **Level 1, Inside a note.** *Can one sound hide more than you hear?* One A note hides four notes, and your ear hears
   one. A "Did you know?" box adds that our ears only hear part of what there is: bats hear far higher, elephants
   rumble too low. The big idea: *One thing on the outside. Many hidden parts inside.*
2. **Up next: Inside the scanner.** *If one note can hide many, what could a 0 hide?*
3. **Level 2, Inside the scanner.** A 0 signal hides countless tiny magnets. The scanner's magnet turns it into a faint
   reply, a few in every million, and paints a picture from it. The big idea: *There's far more hiding in a 0 than the
   signal shows us.* A 0 can be a whole person, and there are still so many things we don't know about, hiding behind
   the 0. Then, side by side with the violin: hidden things are everywhere, even frequencies our ears can't hear.
4. **Up next: A prism for sound.** *Is there any way to perceive these hidden things?*
5. **The final level, A prism for sound.** The answer: a prism takes light apart, the tuner takes sound apart, the
   scanner takes the MRI image apart, and all three are the same math, the Fourier transform. The big idea: *Going
   from a whole to the hidden parts inside it is possible.* Surprise: we've already figured out a few ways. But the
   possibilities are endless, and what we've discovered is just the surface: on the board, a map with the Fourier
   transform and the three things it already takes apart lit, and question marks everywhere else, spreading past the
   edges.
6. **ENERGEO.** Its name appears over the map: the start of a new science, energy geometry. It sets out to map
   transformations like the Fourier transform, and to build tools that help us see what we couldn't before, but that
   was always there. *You just took your first steps into it.*

So the end product is not only knowing what the Fourier transform is. It is knowing that going from a whole to the
parts we can't see is possible, that we know a few ways, and that ENERGEO sets out to find and map the rest.

### The magazine (a kids' science magazine, about technology)

- **Covers.** Each level opens like a magazine cover: its name, a big headline, and the question it asks, in italics.
- **"Up next".** Between levels, a card in a heavy outline with a gold shadow: "Up next", the next level's name,
  headline and question, and its button. It replaces the bare button.
- **"Did you know?"** A pale gold box for a fact beside the story: in Level 1, what our ears can and can't hear; in the
  final level, where Fourier's idea came from.
- **"The big idea".** One bold statement per level, pulled out with a thick blue rule, at the moment it is earned.
- **The finale.** The board becomes a map of transformations, and then carries the name ENERGEO, energy geometry.
- All in the levels' plain style: white, one accent, and the gold of "Level up!". The boxes are lines of the story:
  they stay, Back reaches them, and the comic shows them.

### What the new lines claim, and what they do not

- **Hearing (Level 1, line 21; Level 2, line 54).** People hear roughly 20 to 20,000 vibrations a second. Bats
  hear and call far above that, and elephants use rumbles below it. "Frequencies our ears can't hear" are real
  sounds outside that range.
- **"There's far more hiding in a 0 than the signal shows us" (Level 2, line 47).** Behind the 0 are all the tiny
  magnets; the signal reflects only the few left over, about five to ten in every million (Level 2, lines 39 and 40).
  This says what is behind the 0 and what the signal shows, nothing more. It does not say that leaving the 0 destroys
  information, or that the 0 "knows" more: that is Nadia's hypothesis **B-ZERO-LOSS**, which stays a hypothesis
  (the note on Level 2 line 47, above).
- **"Still so many things we don't know about, hiding behind the 0" (Level 2, line 49).** One 0 can stand for many
  arrangements (Level 2, lines 27–35): the 0 alone does not tell which one is there.
- **"Going from a whole to the hidden parts inside it is possible" (final level).** For a signal made of waves, the
  Fourier transform finds its parts exactly: on the board, the A note's four tones and every row of the picture are
  recovered exactly (`test/prism.test.js`).
- **The map.** The three lit nodes are real uses of the Fourier transform: sound (the tuner), light (a prism's
  spectrum), MRI. The question marks are not claims about particular transformations; they are a picture of how much
  is still to find.
- **ENERGEO.** The lines say what ENERGEO sets out to do, the platform's and the new field's aim, in Nadia's words.
  They do not say that energy geometry has already found new transformations or built new tools.
- Files: `src/levels/magazine.js` (the boxes), `src/levels/page.js` (covers, "Up next"), the levels' copy files,
  `src/math/prism.js` (`MAP`, `mapKnown`, `mapUnknown`, `revealToHub`), `src/levels/base.css`, `src/levels/prism.css`.

## All three levels: one screen per level, and no "Did you know?", +1 or Level up! (2026-11-24). Nadia, verbatim (three messages):

> take the did you know part out, also take the +1 and level up parts out

> i dont want to scroll to see anything in a level in each section,i dont mind scrolling to the next level though

> i can't see the mri brain, skull signal anymore, bring those signals back that came from the interactive clicking the brain scan

### What changes

- **Taken out.**
  - Both "Did you know?" boxes. Level 1's, on what our ears can hear, is gone. The final level's goes back to the
    plain line it was before: "Joseph Fourier came up with it about 200 years ago."
  - The "+1" that popped up on each Next, and the "Level up!" badge with its confetti. Next still sends stars up into
    the bar at the top, and a finished level's section of the bar is full, its marker filled.
  - Level 2's "+1" and "−1" beside the TOTAL stay: they are the picture of how the arrows add up, not a reward.
- **One screen per level.** Each level fills the screen under the bar, and nothing in it is below the screen.
  - On a wide screen (a laptop): the board on the left, as large as fits; the level's words, with Back and Next under
    them, in a column on the right.
  - On a narrow or tall screen (a phone, a tablet held upright): the board on top, the words under it.
  - If a part's words outgrow their space, the newest line stays in view by itself (Back shows earlier parts).
  - The "Up next" card appears under the level's words, on the same screen; the page scrolls only from one level to the
    next.
  - "Scroll through" moved into the top bar, so it no longer covers the right edge of a board.
- **The brain and skull signals.** They were still drawn when you tap, in the box beside the head, but on a
  laptop-sized screen the final level was taller than the screen: reading "Tap a part of the brain" meant scrolling
  down, and the box with the signal went out of view above. With one screen per level, the head, the signal and the
  words are all in view as you tap.
- **No new claims.**

## Level 2's 0, and a new look for all three levels (2026-11-24). Nadia, verbatim:

> when adding the magnets to the total signal in level 2, 1. make sure when adding magnets it shows the signal to the mri is getting weaker in a additional visual, dont add another scene rather add to the scene, 2. on the screen where the magnets are hidden under 0 by a box and a question mark, its not visually supported for the user to believe that the magnets are physically inside 0, the magnets right now just seem like they are in a box. so fix this level 2 visual to include the visual meaning of the total signal in relation to showing the mri signal physically getting week, but at the same time make sure the user know that the magnets balanced are the normal balanced state because in energeo it is paramount that we use the origninal geometry not a manipulated/faint version like an mri, however the mri made us aware of this geometry. 2. the magnets need to be inside 0 visually because we a showing that 0 has a geometry, be creative. 3. go over the whole thing. make things more professsional, yet fun finding the inbetween is hard, so use a nat geo color palate, bold times new roman be creative along the lines of fun but professional through out the whole project, i expect a major design change in all levels, all text, all animations, everything.

### Level 2: the MRI SIGNAL, in the same scene

- Beside the TOTAL SIGNAL, in the drop's own scene (no new scene), a small black monitor labelled MRI SIGNAL: a moving
  yellow wave over four bars, like a phone's signal bars.
- Its wave is as tall as the share of the drop's arrows that line up, |TOTAL| ÷ arrows (`src/math/pieces.js`:
  `share`). Three ↑: the wave is full and all four bars are lit. Each ↓ that joins makes it weaker: 2 of 4 (two bars),
  1 of 5 (one bar), 0 of 6 (a flat grey line, no bars, the monitor's frame dimming in and out).
- It stays flat through every covered 0 and every arrangement. When the magnet tips the balance, it comes back,
  faint: 2 of 24, one bar. It stays on while the picture is painted, and leaves with the TOTAL.

### Level 2: the magnets inside the 0

- When the TOTAL reaches 0, its own 0 (in "= 0") grows into a big bold numeral 0, in the signature yellow, and closes
  around the balanced magnets; the drop they were in fades away. From then on the magnets sit inside the 0, in its
  hollow, and every arrangement is drawn inside it: the learner's own ↓↑ pairs in a row; the others stacked, each
  group's ↑ on top and its ↓ mirrored under them. Every group keeps its own small 0 under it, inside the big one.
- The 0's band carries a tag. "NATURAL STATE" appears with the line "This balanced 0 is their natural state."
- A covered 0 (the "?" screens) is the same 0 with its inside frosted over and a big "?" on the frost: the magnets
  are in the 0, out of sight. "Look inside" opens the frost like an iris, from the edge to the middle.
- For the scanner's many pairs the 0 stretches wider around them. When the magnet tips the balance, the 0 leans, like
  an italic 0, its band pales and turns dashed, and its tag reads "NUDGED". After the radio waves: "That's a nudged,
  faint version. The balanced 0 is the original: the MRI just made us aware of it."
- Every position is from `src/math/pieces.js` (`ZERO`, `CROWD_ZERO`, `layout`, `zeroFromResult`, `METER`), checked by
  `test/mri.test.js`: every group and its small 0 inside the 0's hollow, nothing overlapping, the 0 below the TOTAL and
  on the board, the monitor beside the TOTAL.

### All three levels: a new look (a field magazine: fun, but professional)

- **Type.** Bold Times New Roman throughout: the lines, the buttons, the covers, the labels on every board. Italic for
  questions on the covers, captions and hints.
- **Colour.** White pages and ink black, one signature yellow (always a fill, a bar or a marker with black, never
  yellow words on white), warm paper, and the earth's own tones around them: ocean blue for the N half of every
  magnet, forest, ochre, sand, sage and slate. Level 1's concert hall is warm paper and sand; the scanner is in warm
  greys; the final level's dark is a night-sky black, its name at the end in yellow. No red, no gradients, no dark
  theme.
- **Shapes.** Flat print shapes with crisp offset shadows: square-cornered yellow buttons with a black edge and shadow
  that press down when pressed; boards framed by a hairline, like photographs on a page.
- **The top bar.** A black masthead with a yellow rule under it; each level's section fills in yellow, its marker
  turning yellow when the level is done. "Scroll through" sits in it, outlined in yellow.
- **Covers.** Each level opens with a yellow kicker tab ("Level 1"), then its headline rising in, then its question,
  in italics.
- **The big idea.** A black pull-quote with a yellow edge and a yellow "The big idea" tab; it wipes open.
- **Up next.** A card with a black edge and a yellow offset shadow; it springs up.
- **Animations.** Lines slide in from the left; the opening line of a part gets a short yellow rule that wipes in
  above it; buttons and answers spring; a chosen answer turns yellow; speech bubbles pop from the speaker's face.
- **No new claims beyond the lines above.**

### What the new lines claim, and what they do not

- "This balanced 0 is their natural state.": outside a magnet, the protons' tiny magnets point every which way and
  cancel: their total, the net magnetization, is 0. That is the state they rest in.
- The MRI SIGNAL monitor is a picture of how strong a signal the scanner could pick up from the drop. A scanner's
  signal follows the net magnetization; the monitor shows the share of the drop's arrows that line up. It is not a
  measured value, and it does not model noise.
- "That's a nudged, faint version. The balanced 0 is the original: the MRI just made us aware of it.": the scanner
  reads the tipped state (about five to ten in every million lined up, line 44) and the faint reply to its radio
  waves; the balanced arrangement is the one the magnets rest in, without the scanner. The line does not say that
  leaving the 0 loses anything (that stays the open hypothesis B-ZERO-LOSS), and it says nothing about what ENERGEO
  has found.
- The 0 drawn around the magnets is a picture of the TOTAL (what the magnets add up to), with the arrangement that
  gives it inside: "a 0 has a geometry" in Nadia's words. It is not a claim that a 0 is a physical container.

## The final level: the skull's signal, and the data box (2026-11-24). Nadia, verbatim (two messages; the second with a screenshot of the finished MRI picture, its middle empty):

> i cant see the skulls signal when i tap on the skull but i can see the inner brain signal when i tap on the inner brain pop up

> also where is the middle part

### What changes

- **The skull's signal can be seen.** It was drawn, but so small and so short (it faded within a third of a wave)
  that it looked like nothing.
  - Every body part's signal is now drawn against the loudest one (the skin's), which fills the data box; the others
    are in proportion to it, as before.
  - The skull's signal lasts about one wave before it fades. It is still the faintest of the parts you tap first (less
    than a third of the brain's) and still the quickest to fade.
  - The part you tapped last is drawn bolder; the earlier ones step further back, so the brain's big signal no longer
    hides the skull's small one.
- **The middle part (the data box between the head and the picture).** Found (Nadia: "chrome one mac"): in a
  play-through all three levels' styles are on one page, and Level 2's radio waves are hidden by a rule for the class
  "radio", the very name the final level gave its data box. So from the break on, the data box, and every body part's
  signal in it, was invisible; opening the final level on its own (as the checks did) never loaded Level 2's styles. The
  data box now has a name of its own, every rule that reached another level's pieces (Level 1's strings and skin, the
  floor, the ghosts, the waves) now names its own level's board, and a test checks that no level's styles reach another
  level's pieces. The data box also settles into place at the end of its move without relying on the animation.
- **Back, on one screen.** Back showed an earlier part with its picture too wide on a laptop, cut off at the bottom,
  and the live board peeking out under it. Now the earlier part is laid out like the level, its picture sized to fit
  above Back and Next, and the live board fades out while you look back.
- **No new claims.** In a real MRI scan, bone gives very little signal, and it fades very fast: the drawing exaggerates
  how long it lasts so that it can be seen.

## All three levels: the "Bold intellectual" palette (2026-11-24). Nadia, verbatim:

> also i like the details, dont change them, just change the color palate, it seems a little mismatched to the theme use this color palate 4. Bold intellectual
> #172B3A
>
> #247C78
>
> #C5D6C0
>
> #E5A34B
>
> #F5F0E6
>
> Midnight blue · Teal · Eucalyptus · Amber · Ivory

### What changes (colours only; every detail stays)

- **Ivory** (#F5F0E6) is the page. Cards, bubbles and panels on it are a lighter ivory.
- **Midnight blue** (#172B3A) is the ink: every line of text, the edges and shadows of the buttons, the top bar, the big
  idea's box, the MRI SIGNAL monitor, and the final level's dark (the hall when its lights dim).
- **Amber** (#E5A34B) takes the yellow's place: the buttons, the kicker tabs, the bar's progress, the rules, the big
  idea's edge and tag, the bold 0 that holds the magnets, the MRI SIGNAL's wave and bars, the final level's signal and
  its name, ENERGEO.
- **Teal** (#247C78) is the second accent: the N half of every magnet, the eye, a page turned back with Back.
- **Eucalyptus** (#C5D6C0) is the soft one: the S half of every magnet, your speech bubbles, the scanner's data, the
  glass.
- Drawings keep their own natural colours where they need them (the violin's wood, skin, the LED lights of the final
  level, a prism's rainbow). The four hidden notes are slate blue, teal, violet and amber, the hues of their lights in
  the final level. No red, no gradients, no dark theme.

## The final level: a prism for sound you can see, a reveal under the stage light, ENERGEO's aim; all three levels: words at reading pace (2026-11-24). Nadia, verbatim (four messages):

> the rainbow triangle that takes apart the A tone in level three doesn't seem like it belongs there. In other words, its not intuitive to the user that its a prisim for sound, make that more aparent, maybe by making the triangle in all scenes a regular shaped prisim with no rainbow outline. and also introducing a scene where a prisim is breaking up light, and in that same scene a prisim breaking apart sound into its components. I was thinking this change should be when the yellow shirt guy is thinking is there a prisim for music and pairing the just said visual to it in a thought bubble.

> so when the big reveal is fourier. making the text rainbow isn't nessesary its a bit unprofessional or kidish. it can be a fun reveal with a stage light perhaps to keep it on theme.

> also the main goal of energeo isn't to use fourier to uncover more things we can't see. fourier is also just an example of using a specific geometry to uncover its given resultants. there are a bunch of geometries, that is the aim

> also in every scene the sentence sections appear too fast, match the average reading speed to when the sections appear, same with the next button

### What changes

- **One prism, everywhere.** Every triangle in the final level is now the same glass prism as the one on the chandelier:
  a plain glass triangle with a highlight on its left face, no rainbow outline. That is the prism the A note falls
  through into its four bars, and the one between the scanner's data and the picture. The rainbow outlines around the
  marked row of the head and of the picture are amber now.
- **The thought, as a picture** (Revision 13, line 7). When you think "If a prism is a tool that can take apart light,
  is there a tool that can take apart a sound?", the hall dims and you stand in it, thinking. A thought bubble rises
  from your head. In it, a prism takes white light apart into its colors (red bent least); then, under it, the same
  prism takes your A note's wave apart into its four pure tones (A, high A, E, higher A, each as strong as it is in the
  note, in their light colours). The two rows are labelled "light" and "sound". Then: "Surprise: it's your tuner."
- **The grand reveal, under the stage light** (line 42). The name is no longer in rainbow letters. The stage light from
  the start of the level stands on the floor again, swings on, flickers like a real one and lights a pool in the middle
  of the board; "the Fourier transform" appears in its light, big, in ivory. The light goes off as the name moves to
  the hub of the map, which is amber now.
- **ENERGEO's aim** (lines 53, 55, 56). "The Fourier transform is just one example: one geometry, and what it can
  uncover." and "There are a whole bunch of geometries. ENERGEO sets out to find them, and what each one uncovers."
  take the place of "It sets out to map transformations like the Fourier transform." and "And to build tools that help
  us see what we couldn't before, but that was always there." As ENERGEO is named, some of the map's unknown nodes
  light up as hubs of their own, each with three spokes: other geometries, none of them named.
- **Words at reading pace** (all three levels). Each line, speech bubble or big idea is given the time it takes to read
  at an average reading speed, 200 words a minute (`src/math/reading.js`), with a moment to take it in (a short line
  gets at least about a second). Since then a little quicker (Nadia: "increase the appear rate for the section just a
  bit"): 230 words a minute, a short line at least a second. The next line of the same part waits until the earlier ones have been read; so do
  Next and every button that moves the story on. Questions show their answers at once. While Level 3 fast-forwards to
  a step, or the comic is recorded, nothing waits.

### What the new lines claim, and what they do not

- The thought bubble is a thought: the prism for sound in it is the question, drawn as its answer would look. The tuner
  that follows is the real one; the bars it shows come from the same four amounts as the A note itself.
- ENERGEO's lines say what it sets out to do: find more geometries and what each uncovers. They do not say it has found
  any, and the other hubs on the map are unnamed and marked as unknown.
- The stage light, the pool of light and the flicker are staging, not a claim.

## Scroll through: go to a scene; bigger text; "…"; the "Contemporary European" palette (2026-11-24). Nadia, verbatim (three messages):

> add an option in the scroll through where the user can tap on a scene and the main display goes there

> also make all the text a bit bigger includeing all the titles subtext the top bar, and then add ... when there are going to be more sectionals that appear

> that navy color is boring change the color palate to this: Contemporary European
> #174A7E
>
> #4B72B2
>
> #8C52A0
>
> #E5A000
>
> #E75A42

### What changes

- **Go to a scene.** Every picture in the side panel ("Scroll through") is a link, tagged "Go here ›" in its corner.
  Tap one, and the page opens that level and goes to that scene: the parts before it run at once, without waiting,
  sound or animation (every button pressed, every question answered, every drag done for you), and the scene then
  plays as usual, from its start. How: each level counts the parts that have ended (`src/levels/record.js`), the comic's
  recorder stores where each picture's scene starts (`comic.json`: `start`), and `try/?jump=level-2.7` fast-forwards
  Level 2 until 7 parts have ended (`src/levels/jump.js`). The levels before the one you go to are left out; the
  "Up next" card still leads on.
- **Bigger text.** About a tenth bigger everywhere on the page: the lines and bubbles, the buttons and answers, each
  level's name, headline and question, the big idea, the "Up next" card, the top bar's level names and "Scroll
  through", Back and Next, and the side panel. The writing on the boards keeps its size.
- **"…" while more is coming.** When the next line of a part is on its way by itself (it waits for the earlier ones to
  be read), three dots pulse under the words; they go the moment the line comes. Where the story waits for you (Next, a
  button, a choice), there are no dots.
- **The palette.** "Contemporary European" takes the place of "Bold intellectual": a white page; deep blue (#174A7E)
  for every line of text, the top bar and the edges and shadows of the buttons; gold (#E5A000) the bright fill (the
  buttons, the tabs, the bar's progress, the bold 0, the MRI SIGNAL's wave, ENERGEO); coral (#E75A42) the highlight
  (the rule under the top bar, the short rule over a part's first line, the big idea's edge; never the colour of a
  wrong answer); blue (#4B72B2) the N half of every magnet and a page turned back; purple (#8C52A0) the big idea's box
  and your speech bubbles' tint. The final level's dark is a deeper shade of the deep blue, so its lights still glow.
  The four hidden notes are blue, coral, purple and gold, in Level 1, in Level 2's side by side and as the final
  level's lights. Every detail stays.

## All three levels: a trailing "…", and Next sooner (2026-11-24). Nadia, verbatim (two messages):

> increase the appear rate for the section just a bit

> the .. looks like loading try something mor eintuitive to the situation, also make the speed of when the next appears faster than the sections speed

### What changes

- **Lines a little quicker**: 230 words a minute (was 200), a short line at least a second.
- **"…" as the sentence trailing off.** The three pulsing dots under the words looked like something loading. Now,
  while the next line is on its way, a "…" in the same type follows the last line on show (or the last speech bubble,
  or the big idea), fading softly in and out, as a story pauses before it goes on. It goes the moment the next line
  comes, and it is never kept for Back or the comic.
- **Next sooner than the next line.** Next (and a button that moves the story on, such as "Zoom in") lights up once
  half of the reading time left has passed (`src/math/reading.js`: `nextShare`), so it comes faster than the lines of a
  part follow each other.

## All three levels: the "Fresh intellectual" palette (2026-11-24). Nadia, verbatim:

> try Fresh intellectual
> #123B35
>
> #008F87 (first two for the top bar and top line)
>
> #38A9D6
>
> #E9C46A
>
> #E76F51
>
> Pine · Turquoise · Sky blue · Mustard · Coral

### What changes (colours only; every detail stays)

It takes the place of "Contemporary European":

- **The top bar** is pine (#123B35), with a turquoise (#008F87) line under it.
- **Pine** is also the ink: every line of text, the edges and shadows of the buttons, the big idea's box, the MRI SIGNAL
  monitor. The final level's dark is a deeper pine.
- **Mustard** (#E9C46A) is the bright fill: the buttons, the tabs, the bar's progress, the bold 0, the MRI SIGNAL's
  wave, the final level's signal and ENERGEO.
- **Coral** (#E76F51) is the highlight: the short rule over a part's first line and the big idea's edge, never the
  colour of a wrong answer.
- **Turquoise** is the N half of every magnet and a page turned back with Back.
- **Sky blue** (#38A9D6) is the water, the glass and your speech bubbles' tint.
- The four hidden notes are sky blue, coral, turquoise and mustard, in Level 1, in Level 2's side by side and as the
  final level's lights. The page stays white.

## Level 3, "A prism for sound" (2026-11-19; first called "The magic glasses")

### Nadia's request, verbatim

> lets start on level 3, the main goal in one sentnece is here is the mathematical tool that lets us start seeing it. basically introduction of fourier.  i want to do this creatively without being to mathematical, more interactive understanding than words, i want fourier to be learned intuitively and to achieve that the user needs to do more interactive interactions than just reading. this is very important because fourier is not considered something intuitive. I was think using a tuner for the violin, then using a interactive that demonstrates how signal turns into a image using fourier machiene. I want you to have sarcasticly but educational style of words like, if only there was this magical tool that could help us see all the signals- this would be the script, and the sarcastically education visual aid would be like a pair of magical rainbow glasses that the user clicks to put on, and the glasses seem like its put on the user by getting closer to the screen. something like that but make sure it makes sense and its not overly complicated of a user that doesn:t know what fourier is, that is the hard part and Id advise you to be super careful of not overkilling with the knowledge you give them.

### The goal, in one sentence (Nadia's)

Here is the mathematical tool that lets us start seeing it.

### How it is learned by doing, not by reading (Revision 1, superseded by Revision 3 below)

The learner is given one idea only: the same sound can be seen two ways, as a squiggle in time or as bars, one per
hidden note. Fourier's name comes only at the very end, once the learner has used the tool.

1. **The tuner (familiar, and not enough).** The learner taps "Play your A note". The tuner's needle swings to the
   middle, its light turns green, and it shows one letter: A. It hears one note, like the ear in Level 1.
2. **The squiggle (it fails).** The A note's squiggle runs across the screen. "Can you see them?" Whatever the answer,
   "Nobody can."
3. **The magic glasses (one tap).** "If only there were a magical pair of glasses…" One tap: rainbow glasses fly up
   from the bottom of the screen toward the learner's face and past it, and the board gets a rainbow frame: you are
   wearing them. The four notes lift out of the squiggle and drop into four bars, labelled A, high A, E and higher A,
   as tall as how much of each. "Like a prism splits light into a rainbow, the glasses split a sound into its notes."
4. **Off and on (the two views are one sound).** The learner takes the glasses off (the bars vanish, the squiggle
   stays) and puts them back on.
5. **Hands on the bars (one bar is a tuning fork).** With the glasses on, the bars can be dragged.
   - The first challenge is a pure tone: drag all but one bar to 0. The squiggle goes smooth: a tuning fork.
   - The second is to bring the notes back: the bumps return. "Every bump in the squiggle comes from a bar."
   - Each release plays the sound.
6. **The Fourier machine (squiggle in, picture out).** The scanner's reply from Level 2 is a much messier squiggle.
   "Glasses on" turns it into many thin rainbow bars, one per spot in the body. Then a machine with the glasses built
   in: the learner turns its crank, and each turn feeds one squiggle through and prints one row of the picture. The
   first rows are from the middle, so the head shows at once. After four turns: "Okay, this could take a while.
   Let's speed it up."
7. **Its name, last.** "Fine, the glasses aren't really magic. They're math, and they're called the Fourier
   transform." One line of history and use, and the goal sentence.

### Level 3 learner copy (Revision 1, superseded by Revision 2 below), in order

1. Level 1: one A note hid four notes. Level 2: one 0 hid countless tiny magnets.
2. It would be nice to actually see what's hiding.
3. Musicians already own a gadget that listens to notes.
4. [Play your A note]
5. A (the letter on the tuner)
6. Your tuner listens very carefully and announces: A.
7. Thank you, tuner. Very helpful.
8. It hears one note, just like your ear.
9. Here's the sound itself. Four notes are hiding in this squiggle.
10. Can you see them? [Obviously] [Not really]
11. Nobody can. Squiggles are terrible at sharing secrets.
12. If only there were a magical pair of glasses that showed every note hiding in a sound…
13. [Put on the magic glasses]
14. Oh look. Four notes, and how much of each.
15. A, high A, E, higher A (the labels under the bars)
16. Like a prism splits light into a rainbow, the glasses split a sound into its notes.
17. Take them off and put them back on. Go on, nobody's watching.
18. [Take them off] / [Put them on]
19. Same sound. Two ways to see it.
20. With the glasses on, you can change the notes. Can you make a pure tone, like a tuning fork?
21. Drag the bars down to 0, all but one. (only after 9 seconds)
22. One bar, one smooth wave. Your very own tuning fork.
23. Now bring the other notes back.
24. Every bump in the squiggle comes from a bar.
25. Now the big one. Remember the scanner's faint reply in Level 2?
26. It's a squiggle too. A much messier one.
27. [Glasses on]
28. Lots of bars this time. Each one comes from a different spot in your body: the taller the bar, the more of you is there.
29. The scanner has these glasses built in. Turn the crank.
30. [Turn the crank]
31. Okay, this could take a while. Let's speed it up.
32. Squiggles in. A picture of you out.
33. Fine, the glasses aren't really magic. They're math, and they're called the Fourier transform.
34. Joseph Fourier came up with the idea about 200 years ago. Today it is at work in MRI scanners, phones and music apps.
35. Here it is: the mathematical tool that lets us start seeing what hides inside.

Nothing came after line 35.

### What Level 3 claims, and what it leaves out (Revision 1)

The numbers are computed in `src/math/prism.js` (then `glasses.js`) and checked by `test/prism.test.js`.

- **The tuner.** A tuner measures a note's pitch and shows the nearest note's name. It does not show the other notes
  inside, and line 8 says only that.
- **The glasses.** They show a sound's spectrum: one bar per pure tone, as tall as how much of it the sound has.
  - The bars are exact. For the A note they are its four tones, and dragging a bar changes the squiggle by exactly that
    tone.
  - The prism comparison is the standard one: a prism separates light into the colours (frequencies) it is made of.
- **The machine (lines 25–32).** Each squiggle the crank feeds in is a chord of radio tones, one per spot along a row
  of the picture. The machine unmixes it with a real discrete Fourier transform, and the amounts it finds are the
  row's brightness, exact to within 10⁻¹².

  This is the same simplification as in Level 2. A real scanner encodes position this way along one direction only,
  and builds the image with a two-dimensional Fourier transform. The picture is the illustration from Level 2, not a
  real scan.
- **Line 34.** Fourier presented the idea in 1807, and in his 1822 book. MRI scanners build their images with Fourier
  transforms. Phones use them in 4G, 5G and Wi-Fi (OFDM). Music apps use them in audio coding and equalizers.
- **Left out on purpose.** Equations, sines and cosines, "frequency", "spectrum" and "coefficient" are left out. So are
  energy, and anything about Level 4. "Fourier transform" is the one technical term, given once, at the end.

### Revision 2 (2026-11-19), superseded by Revision 3 below. Nadia, verbatim:

> i dont like the word squiggle thats too sarcastic, dial down on the sarcasam, maybe instead of introducing the glasses first, lets introduce a prism first then make the rainbow more cyber city palleted rainbow so darker but vibrant colored rainbow almost like led lights. also to clear up the squiggle, use signal and show signal on the tuner so theres more of a transition. you need to work on transitions its a bit choppy, and more of a story please including the transition from level 2. this is later going to be directly aftert level 2

#### What changes

- **"Signal", not "squiggle".** The sarcasm is gone: no "Thank you, tuner. Very helpful.", no "Squiggles are terrible
  at sharing secrets.", no "nobody's watching" and no "this could take a while". What warmth remains is gentle ("But
  you know better.").
- **A story straight after Level 2.** "After your scan, you head back to the concert hall. The concert starts soon.
  You clip a tuner onto your violin to check your A note." The tuner is drawn clipped to the violin's scroll.
- **The signal on the tuner, and the first transition.** When the learner plays the A note, the tuner's screen draws
  it as a glowing signal and then shows "A". The little signal then grows out of the screen into the big signal while
  the tuner slides away. It is one drawing, moved, not two.
- **A prism before the glasses.** "A stage light shines through a glass prism." A white beam draws itself into a prism
  and fans out as coloured rays, below the signal, where the bars will later stand. Then: "If only there were a prism
  for sound…" "There is. Picture it as a pair of glasses."
- **Cyber-city colours.** When the glasses go on, the board dims to a night-city dark. The signal, the bars, the frame,
  the machine's window and its crank glow in saturated LED colours (magenta, violet, blue, cyan, green, yellow,
  orange). The four notes keep their Level 1 colours as LEDs. Taking the glasses off brings the daylight back.
- **Smoother transitions everywhere.** Pieces move into place instead of scenes swapping:
  - The prism's rays give way to the bars as the notes land.
  - The violin's signal fades into the scanner's.
  - The signal box and the bars shrink into the machine's input and window while the machine forms around them.
  - Text fades out before new text fades in, and the button row keeps its height, so nothing jumps.

#### Level 3 learner copy (Revision 2), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall. The concert starts soon.
2. You clip a tuner onto your violin to check your A note.
3. [Play your A note]
4. A (the letter on the tuner)
5. The tuner draws your note as a signal: the shape of the sound over time.
6. Then it names one note: A.
7. But you know better. Four notes are hiding in this signal.
8. Can you see them? [Yes] [Not really]
9. Neither can anyone, just by looking.
10. A stage light shines through a glass prism.
11. The prism splits white light into all the colors hiding inside it.
12. If only there were a prism for sound…
13. There is. Picture it as a pair of glasses.
14. [Put on the glasses]
15. Your A note, split into the four notes inside it.
16. A, high A, E, higher A (the labels under the bars)
17. Each bar shows how much of that note there is.
18. Take them off, then put them back on.
19. [Take them off] / [Put them on]
20. Same sound, seen two ways: as a signal, and as its notes.
21. With the glasses on, you can change the notes. Can you turn it into a pure tone, like a tuning fork?
22. Drag the bars down to 0, all but one. (only after 9 seconds)
23. One bar, one smooth wave: a tuning fork.
24. Now bring the other notes back.
25. Every bump in the signal comes from a bar.
26. Now think back to the scanner. Its faint reply was a signal too, a much busier one.
27. [Look through the glasses]
28. Lots of bars this time. Each one comes from a different spot in your body: the taller the bar, the more of you is there.
29. The scanner has these glasses built into a machine. Turn its crank.
30. [Turn the crank]
31. Each turn changes one signal into one row of your picture.
32. The machine takes it from here.
33. Signal in, picture out.
34. The glasses are made up. What they do is real math, called the Fourier transform.
35. Joseph Fourier came up with the idea about 200 years ago. Today it is at work in MRI scanners, phones and music apps.
36. Here it is: the mathematical tool that lets us start seeing what hides inside.

Nothing came after line 36.

#### What the new lines claim

- **Line 5.** A signal is a sound's shape over time. Many digital tuners draw it as well as the note's name. The drawn
  signal is the same four-tone A note as in Level 1.
- **Lines 10–13.** A prism really does separate white light into the colours it is made of. "A prism for sound"
  exists: it is what the Fourier transform does, and it is how spectrum analyzers show sound. The glasses are only a
  picture of it, and line 34 says so plainly.
- **Everything else** is as in Revision 1's notes above: the bars are exact, the machine's unmixing is a real discrete
  Fourier transform, the MRI story is simplified to one direction, and line 35's history and uses are checked. Fourier's
  name comes only once, at the end, and the jargon is left out.

### Revision 3 (2026-11-19), superseded by Revision 4 below. Nadia, verbatim:

> the transitions are nice, hovewer the prisim can definately be expained a little more visually and verbally, like saying you go back to the concert hall, you notice a light shining then you see a prisim splitting the light into a bunch of its components you think to your self, hmm if theres a prisim for a light wave shouldn:t there be a prisim for a sound wave. suprise its a tuner. the second thing thats still confusing is the relationship between the tuner and the mri machine crank, its not obvious how the crank is similar at converting something that hides a lot to an image, it just seems like you are generateing an image from nothing. bring out the relation for understanding how these two relate try to make it easier to understand you can make a character like this

With it she shared a picture for the character: a cartoon man with short dark hair, big round glasses, a flat
expression and a yellow shirt. The picture itself is not kept in the repository; the technician is drawn in its style.

#### What changes

- **The prism, as a story the learner takes part in.**
  - Back at the hall, the lights dim and only a stage light stays on. A glass prism hangs from the chandelier.
  - The learner drags to aim the light. Where the beam misses, white light reaches the wall. Where it catches the
    prism, a fan of LED colours leaves it, red bent least and violet most.
  - Then: "Where did the colors come from?" and "They were in the white light all along. The prism only spreads them
    apart."
- **The tuner is the prism for sound.**
  - "Hmm. If there's a prism for light, shouldn't there be a prism for sound?" "Surprise: your tuner has one inside."
  - The tuner slides up into view. The rest of the tuner scene is kept from Revision 2: the signal on its screen, the
    signal growing, the four bars and the tuning fork.
  - [Turn on the prism] replaces [Put on the glasses]: the four notes pass through a small prism into their bars.
- **The glasses are retired, and the level is renamed "A prism for sound".**
  - The flying glasses, the LED frame and the take-them-off-and-on step are gone.
  - The night-city colours now come from the dimmed hall.
- **A character: the technician who scanned you.** He speaks in bubbles beside his face, drawn in the style of Nadia's
  picture. His part is the relation between the tuner and the scanner, shown on one row of spots across your head:
  1. The row lifts out of the picture and spreads across the board. In every spot, tiny magnets spin, all at the same
     speed. Every spot sends the same note, so he can't tell them apart.
  2. The learner makes the right side of the magnet stronger. The spins fan out: slow on the left, fast on the right.
     Each spot now has its own note.
  3. The learner taps spots and hears them. The notes are low on the left and high on the right; loud where there is a
     lot of you, and silent outside your head.
  4. "Hear them all at once": all the notes together become one busy signal at the top. This is the scanner's faint
     reply from Level 2.
  5. "Turn on the prism": the signal splits into bars, and each bar stands under its own spot.
  6. "Which spot holds the most of you? Tap its bar." Then: tall bar, bright dot. The bars become a row of grey dots,
     and the row slides back into its place in your picture.
  7. Two more rows by hand, then the rest, row after row. Then the sharp picture of Level 2: "A real scanner uses far
     more spots."
  8. "Your tuner splits a sound into its notes. My scanner splits its signal into the spots inside you."
- **The machine and its crank are gone.** Every step the crank hid now happens on the board.

#### Level 3 learner copy (Revision 3), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall. The concert starts soon.
2. The lights dim. Only a stage light is still on.
3. A glass prism hangs from the chandelier.
4. Drag to aim the light at the prism.
5. Drag across the picture to swing the light. (only after 8 seconds)
6. Where did the colors come from? [The prism made them] [They were in the white light]
7. They were in the white light all along. The prism only spreads them apart.
8. Hmm. If there's a prism for light, shouldn't there be a prism for sound?
9. Surprise: your tuner has one inside.
10. You clip your tuner onto your violin.
11. [Play your A note]
12. A (the letter on the tuner)
13. The tuner draws your note as a signal: the shape of the sound over time.
14. Then it names one note: A.
15. But you know better. Four notes are hiding in this signal.
16. Can you see them? [Yes] [Not really]
17. Neither can anyone, just by looking.
18. [Turn on the prism]
19. Your A note, split into the four notes inside it.
20. A, high A, E, higher A (the labels under the bars)
21. Each bar shows how much of that note there is.
22. Same sound, seen two ways: as a signal, and as its notes.
23. Now you can change the notes. Can you turn it into a pure tone, like a tuning fork?
24. Drag the bars down to 0, all but one. (only after 9 seconds)
25. One bar, one smooth wave: a tuning fork.
26. Now bring the other notes back.
27. Every bump in the signal comes from a bar.
28. At the break, the technician who scanned you comes over to say hi.
29. Technician: Your tuner has a prism for sound. So does my scanner!
30. Technician: Here is one row of spots across your head. In each spot, tiny magnets are spinning.
31. Technician: Right now they all spin at the same speed, so every spot sends the same note. I can't tell them apart!
32. [Make the right side stronger]
33. Technician: Now the further right a spot is, the faster its tiny magnets spin, and the higher its note.
34. Tap the spots to hear them.
35. The real notes are radio waves. Here you hear them as sound. (on the first tap, or after 6 seconds)
36. [Hear them all at once]
37. Technician: That's what my scanner hears: every spot at once, as one signal.
38. [Turn on the prism]
39. Technician: Each spot has its own note, so each bar stands under its spot.
40. Which spot holds the most of you? Tap its bar.
41. Technician: The tallest bars: the most of you. More of you means more tiny magnets, and a louder note.
42. Technician: So I paint each spot as bright as its bar is tall.
43. [Paint the row]
44. Technician: One signal, one row of your picture. On to the next row!
45. [Next row] (twice)
46. Technician: My scanner does the rest, row after row.
47. Technician: A real scanner uses far more spots, so its picture comes out sharp.
48. Signal in, picture out.
49. Technician: Your tuner splits a sound into its notes. My scanner splits its signal into the spots inside you.
50. This prism for sound is real math, called the Fourier transform.
51. Joseph Fourier came up with the idea about 200 years ago. Today it is at work in MRI scanners, phones and music apps.
52. Here it is: the mathematical tool that lets us start seeing what hides inside.

Nothing came after line 52.

#### What the new lines claim

The numbers are computed in `src/math/prism.js` and checked by `test/prism.test.js`.

- **Lines 2–7, the prism.**
  - A glass prism separates white light into the colours it is made of. Newton showed this in his prism experiments
    from 1666, and that the colours can be put back together into white. So the colours were in the light before; the
    prism spreads them by bending each colour a different amount, red least and violet most.
  - The board bends the rays in that order. The angles drawn are illustrative.
  - Chandelier crystals are commonly cut as prisms, which is why they throw small rainbows.
- **Line 9, the tuner.** Many digital tuners and tuning apps find a note this way: they split the sound into its tones
  (a Fourier transform, or a close relative) and name the main one. Some tuners use other methods. The story's tuner is
  one that splits the sound, and the level shows what it finds.
- **Lines 30–33, spinning and the stronger side.**
  - The tiny magnets (protons) turn about the scanner's field: they precess. How fast depends on the field's strength:
    the stronger the field, the faster. At 1.5 T it is about 64 million turns a second (the Larmor frequency).
  - The scanner adds a field that grows steadily across the body (a gradient). So the rate, and the radio note each
    spot sends, grows steadily from one side to the other.
  - On the board, spot k turns at (k + 1) × 0.22 turns a second, in step with its note. Before the right side is made
    stronger, every spot turns at the leftmost spot's rate. Real rates are millions of times faster, and the
    differences between spots are tiny next to the rate itself.
- **Lines 34–35, the notes as sound.** The notes are radio waves. The page plays spot k as (k + 1) × 110 Hz, as loud as
  how much of you is in it. Spots outside the head have nothing to send and stay silent.
- **Lines 36–41, one signal and its bars.**
  - The signal is all the spots' notes added together, which is what a real scanner's coil receives.
  - The prism for sound is an exact discrete Fourier transform. For each of the 16 rows it gives back each spot's
    amount to within 10⁻¹².
  - "More of you" stands for more hydrogen: more water, more tiny magnets. A real image's brightness also depends on
    how fast the tiny magnets settle back (relaxation), which is left out.
- **Lines 42–47, row by row.**
  - Here, one signal makes one row. Real scanners encode position by note along one direction only. They use a second
    trick (phase encoding) for the other direction, then a two-dimensional Fourier transform. Some early methods did
    build the picture one line at a time.
  - The 16 × 16 picture is Level 2's head illustration, sampled at 16 spots a side. Line 47's sharp picture is Level
    2's own 48 × 48 picture. Real images are typically 256 × 256 or more. Neither is a real scan.
- **Line 51** is as in Revision 1's notes.
- **Left out on purpose.** As before: no equations, and no "frequency", "spectrum" or "coefficient". "Radio waves" is
  the only technical term added, and Level 2 already uses it. "Fourier transform" is still given once, at the end.

### Revision 4 (2026-11-20), superseded by Revision 5 below. Nadia, verbatim:

> here are some suggestions for level 3: theres a lot of words so i am goin got try and cut down some, drag to aim at the chandilier instead of prisim. if there is a prisim is too abrupt assumption, if a prisim is a tool that can take a part light then is there a tool that can take apart a sound. I remember writing this exact sentence in a previous prompt can you look back at my promopt to help you out with the story. also make a player character for level 3 thats the user with a bucket hat same no smile person with different hair color. for the mri part, there is a lot of words -the most of you- doesn:t m,ake sense,  this - So I paint each spot as bright as its bar is tall. - is too confusing. you dont have to relate it back to music just say it works in the same way. basically mri takes frequnecy from your magnets flipping from the mri signal and translates that into a physical image. do you notice a pattern. let me help you out. in music its, violin note to pure tones, for stage lights its light to its full color spectrum, and in mri its proton frequency to image, all using a geometric math/formula to get there

The earlier prompt she means is Revision 3's: "you go back to the concert hall, you notice a light shining then you see
a prisim splitting the light into a bunch of its components you think to your self, hmm if theres a prisim for a light
wave shouldn:t there be a prisim for a sound wave. suprise its a tuner." Revision 4 follows that sequence, with her new
sentence for the thought.

#### What changes

- **Fewer words.** 43 lines instead of 52, and most lines are shorter: about 385 words of learner copy, buttons
  included, down from about 525.
- **The hall, as Nadia told it.**
  - You notice a stage light shining. The learner drags to aim it at the chandelier: anywhere from just above its arm
    down to just below the glass hanging from it catches the beam.
  - The glass is not called a prism until the colours have appeared: "Where did the colors come from?" "From the
    white light. The glass on the chandelier is a prism: it takes light apart into its colors."
  - Your thought, in Nadia's sentence: "If a prism is a tool that can take apart light, is there a tool that can take
    apart a sound?" Then: "Surprise: it's your tuner."
  - [Take it apart] replaces [Turn on the prism], in the tuner and in the scanner.
- **A player character: you.** The same deadpan face as the technician (round glasses, no smile) with copper hair, a
  bucket hat and a blue shirt. Your thought appears in a thought bubble beside your face. At the break you speak
  first: "My tuner just took my A note apart!"
- **The scanner, with fewer words and no music.**
  - The technician: "My scanner works the same way." No notes, no tapping spots to hear them, no "the most of you", no
    "paint each spot as bright as its bar is tall".
  - The steps stay on the board: the row lifts out; [Make the right side stronger] gives each spot its own spinning
    speed, "its own frequency"; [Listen] merges every spot into one signal; [Take it apart] puts a bar under each
    spot, "how many tiny magnets are there"; [Make the picture] turns the bars into grey spots ("More tiny magnets,
    brighter spot") and slides the row home; [Next row], then the rest, then the sharp picture.
- **The pattern, in Nadia's words.** "Do you notice a pattern?" "Let me help you out." The signal and the picture
  slide down into a third row, and three rows build up beside three lines:
  - Violin note → pure tones (the A note's wave → its four bars)
  - Stage light → its full color spectrum (a white beam into a prism → a fan of colours)
  - Proton frequencies → image (the scanner's signal → your picture)
  - Then: "All three come down to the same geometric math: the Fourier transform."

#### Level 3 learner copy (Revision 4), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound?
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really]
13. Neither can anyone, just by looking.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a bar.
22. At the break, the technician from your scan comes over.
23. You: My tuner just took my A note apart!
24. Technician: My scanner works the same way. Look: one row of your head.
25. Technician: The tiny magnets in each spot spin. Right now they all spin at the same speed, so I can't tell the spots apart.
26. [Make the right side stronger]
27. Technician: Now each spot spins at its own speed: its own frequency.
28. [Listen]
29. Technician: My scanner picks up every spot at once, as one signal.
30. [Take it apart]
31. Technician: Each frequency comes from one spot. Its bar shows how many tiny magnets are there.
32. [Make the picture]
33. Technician: More tiny magnets, brighter spot. That's one row of your picture.
34. [Next row]
35. Technician: Every row works the same way. Real scanners use many more spots, so the picture comes out sharp.
36. Technician: Do you notice a pattern? [Yes] [Not yet]
37. Technician: Let me help you out.
38. Violin note → pure tones
39. Stage light → its full color spectrum
40. Proton frequencies → image
41. All three come down to the same geometric math: the Fourier transform.
42. Joseph Fourier came up with it about 200 years ago.
43. Here it is: the mathematical tool that lets us start seeing what hides inside.

Nothing came after line 43.

#### What the new lines claim

The numbers are computed in `src/math/prism.js` and checked by `test/prism.test.js`. Everything Revision 3's notes say
about the prism, the tuner, the exact unmixing, the row-by-row simplification and Fourier's dates still holds. New or
changed:

- **Line 3.** Aiming anywhere at the chandelier counts: the beam is caught if it crosses the chandelier's line between
  just above its arm and just below the glass, and it then goes into the glass's near face.
- **Line 15, "pure tones".** Each bar is one pure tone (a single smooth wave), and the four add up exactly to the
  signal.
- **Lines 25–27, spinning and frequency.**
  - After the scanner's radio nudge (Level 2), the tiny magnets are tipped over, "flipped" in Nadia's word. They then
    turn about the magnet's direction (they precess), and that turning is what sends the signal.
  - How many turns a second is their frequency. It is set by the magnet's strength, so a magnet that grows stronger
    across the body gives each spot its own frequency.
- **Line 29.** The scanner's coil picks up the sum of every spot's signal at once.
- **Lines 31 and 33.** A bar's height is how many tiny magnets (hydrogen nuclei) are in its spot, and the spot is
  painted that bright. Real images also depend on how fast the tiny magnets settle back (relaxation), which is left
  out.
- **Lines 38–40** are Nadia's pattern, from her message: violin note to pure tones; light to its full color spectrum;
  proton frequency to image. "Frequency" is introduced at line 27, as a spot's spinning speed, before it is used here.
  "Spectrum" appears only here, after the stage light has shown one.
- **Line 41, "the same geometric math".**
  - Violin note: a steady sound is a sum of pure tones, and Fourier's formula gives how much of each. Here it is exact.
  - Stage light: the glass does the separating, not a computer. It bends each frequency of light by a different
    amount. Which colours come out, and how much of each, is the light's spectrum, which is what the Fourier transform
    of the light wave gives. So the prism's result comes down to the same math.
  - Scanner: MRI images are built with Fourier transforms. Here, one-dimensional and exact, one row at a time.
  - Geometric: each amount is a projection, how much the signal lines up with one pure wave (an inner product). This
    is established mathematics: Master Map #7, and `basisInner` and `basisGram` in `src/math/fourier.js`. It is not a
    project hypothesis.
- **Left out on purpose.** Equations and "coefficient". The music is not brought back into the scanner part: its
  spots no longer play notes.

### Revision 5 (2026-11-20), superseded by Revision 6 below. Nadia, verbatim:

> swap the characters hair color and shirt color, and instead of the tiny magnets above your head part change the interactive whole by replacing it with basically mri takes frequnecy from your magnets flipping from the mri signal and translates that into a physical image. do you notice a pattern. the interactive has to show this sentence, and not be too long like the current magnet interactive

#### What changes

- **The characters swap hair and shirt colours.** You (the player) now have dark hair and a yellow shirt, with the
  bucket hat, as in Nadia's picture. The technician now has copper hair and a blue shirt.
- **The scanner part is one short interactive built around Nadia's sentence.** It is edited only to read as one
  sentence: "MRI takes the frequencies of your flipping magnets from the MRI signal, and translates them into a
  physical image." Her words were "mri takes frequnecy from your magnets flipping from the mri signal and translates
  that into a physical image."
  - The board shows four parts left to right: your head with its tiny magnets → the MRI signal (the violin's signal
    box, moved), with its frequencies under it → the physical image.
  - The sentence appears faded under the board. Three buttons, and each part of the sentence lights up as it happens:
    1. [Flip the magnets]: the tiny magnets flip over and spin, faster towards the right ("of your flipping
       magnets"). Their signal appears in the signal box ("from the MRI signal,").
    2. [Take it apart]: the signal splits into thin bars, one per frequency, each coloured like the place it comes
       from ("MRI takes the frequencies").
    3. [Make the image]: row after row, each row's signal is taken apart and painted, and the image of your head
       appears ("and translates them into a physical image.").
  - Gone: the row lifted out of the picture, making the right side stronger as a step, Listen, Make the picture,
    Next row, and the technician's six explaining lines.
  - The image is now computed at 48 × 48 places, Level 2's own size, so the sharpening step is gone too.
- **Then, as in Revision 4:** "Do you notice a pattern?" The signal box and the image slide into the third row.

#### Level 3 learner copy (Revision 5), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound?
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really]
13. Neither can anyone, just by looking.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a bar.
22. At the break, the technician from your scan comes over.
23. You: My tuner just took my A note apart!
24. Technician: My scanner works the same way.
25. MRI takes the frequencies of your flipping magnets from the MRI signal, and translates them into a physical image. (shown faded; each part lights up as it happens on the board: "of your flipping magnets" with [Flip the magnets], "from the MRI signal," when the signal appears, "MRI takes the frequencies" with [Take it apart], "and translates them into a physical image." with [Make the image])
26. [Flip the magnets]
27. [Take it apart]
28. [Make the image]
29. Technician: Do you notice a pattern? [Yes] [Not yet]
30. Technician: Let me help you out.
31. Violin note → pure tones
32. Stage light → its full color spectrum
33. Proton frequencies → image
34. All three come down to the same geometric math: the Fourier transform.
35. Joseph Fourier came up with it about 200 years ago.
36. Here it is: the mathematical tool that lets us start seeing what hides inside.

Nothing came after line 36.

#### What the new lines claim

The numbers are computed in `src/math/prism.js` and checked by `test/prism.test.js`. Lines 1–21 and 29–36 are as in
Revision 4 and keep its notes. New:

- **Line 25, "your flipping magnets".** The scanner's radio pulse tips the tiny magnets over: Level 2's nudge, and
  Nadia's "flipping". They then turn about the magnet's direction (they precess), and that turning sends the signal.
  The board shows the flip as a quarter turn, then the spin.
- **Line 25, "the frequencies".**
  - A frequency is how many turns a second. The scanner makes its magnet a little stronger across the body, so the
    spin, and the frequency each place sends, grows from left to right.
  - The board shows this without words: the spin speed, and a colour that matches each place to its bar.
  - On the board, a place at fraction x across turns at 0.25 × (1 + 4x) turns a second. Real rates are millions of
    times faster.
- **Line 25, "from the MRI signal".** The scanner's coil picks up every place's signal at once. The box shows one
  row's signal, and the glowing band on the head shows which row.
- **Line 25, "translates them into a physical image".**
  - The amount at each frequency is how many tiny magnets are at that place, and it is painted as that place's
    brightness.
  - It is exact: a discrete Fourier transform gives back each of the 48 rows to within 10⁻¹³.
  - One signal per row is the simplification noted in Revision 3, and relaxation is left out.
  - The image is Level 2's head illustration, without its grain. It is not a real scan.
- **The edits to Nadia's sentence** are for grammar only: "frequency" became "the frequencies", "your magnets
  flipping" became "your flipping magnets", and "that" became "them".

### Revision 6 (2026-11-20), superseded by Revision 7 below. Nadia, verbatim (two messages):

> no flipping the magents inside your body. and each magnet behaves differently based on what body part its in. collecting that data and converting it to pizel data helps us see a mri picture with fourier transform

> i want you to scrap that whole part with the magnets built in the interactive and i want you build a new interactive based on this wording i sent you before

Claude asked whether "no flipping" meant to drop the flipping or to reword it. Nadia's second message answered: scrap
the magnet interactive, and build a new one on her wording.

#### What changes

- **The magnet interactive is gone.** No tiny magnets are drawn, nothing flips or spins, and there are no frequency
  bars.
- **A new interactive, on Nadia's wording.** It is lightly edited into two sentences: "Each tiny magnet behaves
  differently depending on which body part it's in. Collecting that data and converting it into pixel data helps us
  see an MRI picture, with the Fourier transform."
  - The board shows three parts, left to right: your head as its body parts (skin, bone, fluid, gray matter, white
    matter, each in its own colour) → the data box (the violin's signal box, moved) → the MRI picture.
  - The words appear faded under the board, and each part lights up as it happens:
    1. "Tap the body parts." Tapping one lights it, names it under the head, and draws its own signal in the data box:
       strong or weak, quick or slow to fade. Bone sends almost nothing. Fluid is weak but fades slowest. After two
       parts, "Each tiny magnet behaves differently depending on which body part it's in." lights, and [Collect the
       data] appears (it also appears after 7 seconds).
    2. [Collect the data]: the separate signals give way to one busy signal, from a marked row of your head
       ("Collecting that data").
    3. [Convert it to pixels]: row after row, each row's data is converted and painted as grey pixels ("and
       converting it into pixel data"). When the picture is done: "helps us see an MRI picture, with the Fourier
       transform."
  - The Fourier transform is now named here, in Nadia's words, before the pattern. The pattern's closing line names
    it again.
- **Unchanged:** the hall, the tuner, the characters, and the pattern ("Do you notice a pattern?").

#### Level 3 learner copy (Revision 6), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound?
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really]
13. Neither can anyone, just by looking.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a bar.
22. At the break, the technician from your scan comes over.
23. You: My tuner just took my A note apart!
24. Technician: My scanner works the same way.
25. Each tiny magnet behaves differently depending on which body part it's in. Collecting that data and converting it into pixel data helps us see an MRI picture, with the Fourier transform. (shown faded; each part lights up as it happens on the board: "Each tiny magnet behaves differently depending on which body part it's in." once you have tapped two body parts, "Collecting that data" with [Collect the data], "and converting it into pixel data" with [Convert it to pixels], "helps us see an MRI picture, with the Fourier transform." when the picture is done)
26. Tap the body parts.
27. skin, bone, fluid, gray matter, white matter (the name of the part you tap, on the board)
28. [Collect the data] (after two body parts, or after 7 seconds)
29. [Convert it to pixels]
30. Technician: Do you notice a pattern? [Yes] [Not yet]
31. Technician: Let me help you out.
32. Violin note → pure tones
33. Stage light → its full color spectrum
34. Proton frequencies → image
35. All three come down to the same geometric math: the Fourier transform.
36. Joseph Fourier came up with it about 200 years ago.
37. Here it is: the mathematical tool that lets us start seeing what hides inside.

Nothing came after line 37.

#### What the new lines claim

The numbers are computed in `src/math/prism.js` and checked by `test/prism.test.js`. Lines 1–24 and 30–37 are as in
Revision 5 and keep its notes. New:

- **Line 25, "Each tiny magnet behaves differently depending on which body part it's in."**
  - True, and it is why body parts look different in an MRI picture. How many tiny magnets (hydrogen nuclei) a
    tissue has differs from tissue to tissue. So does how fast they settle back after the scanner's radio nudge
    (relaxation, T1 and T2).
  - On the board, each part's signal is as strong as that part is bright in Level 2's picture. How fast it fades is
    an illustration, chosen to agree with real tissue: bone sends almost nothing, and fluid fades slowest.
  - The picture is the kind where fluid looks dark, so fluid's signal is weak but lasting.
- **Line 27, the body parts.** They are the regions of Level 2's head illustration:
  - the bright outer ring is skin;
  - the dark ring, with its thin inner layer, is bone;
  - the dark spaces in the middle and in the grooves are fluid;
  - the grey rim is gray matter;
  - the bright inside is white matter.

  Every pixel of the head belongs to exactly one of them. The illustration is not a real scan.
- **Line 25, "Collecting that data".** The scanner's coil collects every body part's signal at once. The data box
  shows one row's, and the glowing band shows which row.
- **Line 25, "converting it into pixel data … with the Fourier transform".**
  - Each row's data is converted with a discrete Fourier transform into that row's 48 pixel brightnesses, exactly
    (to within 10⁻¹³).
  - It works because the scanner gives each place across a row its own frequency. That is not shown or said here.
    One signal per row is the simplification noted in Revision 3.
- **Line 34, "Proton frequencies → image"** is still Nadia's own pattern line, from Revision 4. "Frequency" is no
  longer introduced before it, since the scanner part now uses Nadia's newer wording.

### Revision 7 (2026-11-20), superseded by Revision 8 below. Nadia, verbatim:

> make that last part more user friendly, body parts is vague the user doesn:t know to point at the brain part specifically, also at break make sure to paint that scene before putting the brain back up. also put the technician as radiologist. and put him at the start of the scene when you say the radiologist comes over during the break. also for the each tuny magnet behaves paragraph should be more user friendly, right now they bold each sentence but maybe introduce one sentnece at a time and then the preceding sentence becomes gray and make sure to take the people and their textboxes away when going over that paragraph

#### What changes

- **The technician is now the radiologist who read your scan.** Same face, copper hair, blue shirt, now with a white
  coat. He says: "The MRI scanner works the same way."
- **The break is a scene of its own.**
  - The hall's lights come back on, and you stand by the stage.
  - As the line "At the break, the radiologist who read your scan comes over." appears, the radiologist walks in from
    the right and stops beside you.
  - You say "My tuner just took my A note apart!" and he answers.
  - Then the people and their speech bubbles go, and only then does your head come back up.
- **Your head, big and labelled, with clear instructions.**
  - The head fills the board, with each part named beside it on a dotted line: skin, skull, fluid, outer brain,
    inner brain.
  - "Tap the brain." The brain pulses until you tap it. Then "Now tap the skull.", which pulses in turn.
  - Each tap lights that part and draws its own signal in the data box. The brain's is strong; the skull's is much
    weaker.
  - You can keep tapping other parts until you collect the data. Tapping a name works too.
- **Nadia's paragraph, one part at a time.**
  - With the people gone, the paragraph comes in piece by piece, each piece as it happens. When the next piece
    appears, the earlier ones turn grey.
  - "Each tiny magnet behaves differently depending on which body part it's in." comes after the two taps.
  - [Collect the data] → "Collecting that data": the head moves aside and one busy signal fills the data box.
  - [Convert it to pixels] → "and converting it into pixel data": row after row, the pixels fill in.
  - When the picture is done: "helps us see an MRI picture, with the Fourier transform."
- **Then, as before,** the radiologist asks "Do you notice a pattern?"

#### Level 3 learner copy (Revision 7), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound?
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really]
13. Neither can anyone, just by looking.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a bar.
22. At the break, the radiologist who read your scan comes over. (the radiologist walks over to you on the board as this appears)
23. You: My tuner just took my A note apart!
24. Radiologist: The MRI scanner works the same way.
25. Tap the brain.
26. skin, skull, fluid, outer brain, inner brain (the labels beside the head)
27. Now tap the skull.
28. Each tiny magnet behaves differently depending on which body part it's in.
29. [Collect the data]
30. Collecting that data
31. [Convert it to pixels]
32. and converting it into pixel data
33. helps us see an MRI picture, with the Fourier transform. (lines 28, 30, 32 and 33 are one paragraph, shown one part at a time, the earlier parts turning grey; the people and their bubbles are gone while it is shown)
34. Radiologist: Do you notice a pattern? [Yes] [Not yet]
35. Radiologist: Let me help you out.
36. Violin note → pure tones
37. Stage light → its full color spectrum
38. Proton frequencies → image
39. All three come down to the same geometric math: the Fourier transform.
40. Joseph Fourier came up with it about 200 years ago.
41. Here it is: the mathematical tool that lets us start seeing what hides inside.

Nothing came after line 41.

#### What the new lines claim

The numbers are computed in `src/math/prism.js` and checked by `test/prism.test.js`. The paragraph's notes are
Revision 6's, and the rest is as in Revision 5. New:

- **Line 22, the radiologist.** A radiologist is the doctor who reads MRI pictures, so "the radiologist who read your
  scan" is accurate. The scanner is usually run by a radiographer (an MRI technologist).
- **Lines 25–27, the labels.**
  - The labels name the regions of Level 2's head illustration:
    - the bright outer ring is the skin;
    - the dark ring, with its thin inner layer, is the skull;
    - the dark spaces are fluid;
    - the grey rim is the outer brain (gray matter, the brain's outer layer);
    - the bright inside is the inner brain (white matter).
  - Each label points at a pixel of its own part. The illustration is not a real scan.
- **Why the brain, then the skull.** They make the difference easy to see. On the board, the skull's signal is less than
  a third of the brain's, as in a real MRI, where bone gives very little signal.

### Revision 8 (2026-11-20), superseded by Revision 9 below. Nadia, verbatim:

> 1. Violin note → pure tones
> 2. Stage light → its full color spectrum
> 3. Proton frequencies → image needs to be on the screen for longer. and needs to be attached to each of its pictures slide by slide. and say the applications are endless! from a simple tuner to looking inside your brain. here it is isn:t nessecasary. the grand reveal before line 39. the mathematical tool needs to be specified. 21. every bump in the bar doesn:t make sense, every bump in the signal comes from a different pure tone. also introduce a skip feature for all of this so i can go back and forth without playing the interactive. also make it so i can go back and forth seeing everything on one scroll left to right

#### What changes

- **The pattern, slide by slide.**
  - Each of the three lines is now a caption on the board, under its own pictures. Each is a slide of its own that
    stays until [Next]:
    1. the A note's wave → its four bars;
    2. a white beam into a prism → a fan of colours;
    3. the scanner's signal → the picture of your head.
  - Then all three stand together, each caption under its pictures.
- **The grand reveal, before line 39's "All three come down to the same geometric math".**
  - The rows dim, and "the Fourier transform" appears big and glowing in the middle of the board.
  - The line that names it: "The mathematical tool that lets us start seeing what hides inside: the Fourier
    transform." "Here it is" is gone, and the tool is named.
  - "All three come down to the same geometric math." follows, without repeating the name.
- **A new last line:** "The applications are endless! From a simple tuner to looking inside your brain."
- **Line 21** is now "Every bump in the signal comes from a different pure tone."
- **Skipping, and everything on one scroll.**
  - `try/?steps` shows every step of Level 3 left to right: 26 frames, one scroll. The ← → buttons and the arrow
    keys move one step at a time.
  - Each frame is the level itself, fast-forwarded and stopped at that step, so nothing has to be played.
  - "Play from here" under each frame fast-forwards the level to that step, then lets you play on.
  - An "All steps" link on the Level 3 tag opens the strip.
  - The steps are listed in `src/levels/stepsPrism.js`.

#### Level 3 learner copy (Revision 8), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound?
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really]
13. Neither can anyone, just by looking.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a different pure tone.
22. At the break, the radiologist who read your scan comes over. (the radiologist walks over to you on the board as this appears)
23. You: My tuner just took my A note apart!
24. Radiologist: The MRI scanner works the same way.
25. Tap the brain.
26. skin, skull, fluid, outer brain, inner brain (the labels beside the head)
27. Now tap the skull.
28. Each tiny magnet behaves differently depending on which body part it's in.
29. [Collect the data]
30. Collecting that data
31. [Convert it to pixels]
32. and converting it into pixel data
33. helps us see an MRI picture, with the Fourier transform. (lines 28, 30, 32 and 33 are one paragraph, shown one part at a time, the earlier parts turning grey; the people and their bubbles are gone while it is shown)
34. Radiologist: Do you notice a pattern? [Yes] [Not yet]
35. Radiologist: Let me help you out.
36. Violin note → pure tones (the caption under its pictures, the A note's wave → its four bars, on a slide of its own)
37. [Next]
38. Stage light → its full color spectrum (on a slide of its own: a white beam into a prism → a fan of colours)
39. [Next]
40. Proton frequencies → image (on a slide of its own: the scanner's signal → the picture of your head)
41. [Next] (then all three together, each caption under its pictures)
42. the Fourier transform (the grand reveal: big and glowing in the middle of the board)
43. The mathematical tool that lets us start seeing what hides inside: the Fourier transform.
44. All three come down to the same geometric math.
45. Joseph Fourier came up with it about 200 years ago.
46. The applications are endless! From a simple tuner to looking inside your brain.

Nothing comes after line 46.

#### The review strip's labels (for review, not learner copy)

- All steps (the link on the Level 3 tag)
- Level 3, step by step (the strip's title)
- Scroll left and right, or use the arrows. Each frame is the level itself, stopped at that step.
- Play from here
- Back to the levels

The 26 step titles are in `src/levels/stepsPrism.js`.

#### What the new lines claim

The numbers are computed in `src/math/prism.js` and checked by `test/prism.test.js`. Lines 1–20 and 22–35 are as in
Revision 7 and keep its notes. New:

- **Line 21.** Each bump in the signal is one of the pure tones added in. The signal is exactly the sum of its four
  pure tones (Revision 1's notes).
- **Lines 36–41.** The captions are Nadia's pattern from Revision 4, unchanged. Only where they appear has changed:
  under their own pictures, one slide at a time.
- **Line 43** is Nadia's goal sentence ("Here is the mathematical tool that lets us start seeing it"), with the tool
  named.
- **Line 46.** "Endless" is a figure of speech. The two ends it names are both real: tuning apps, and MRI scanners.
  The Fourier transform is used across science and engineering, for example in sound and image compression, phones
  and Wi-Fi, and astronomy.
- **The review strip.** Each frame runs the real level with no waiting, and each interaction is done for it:
  - the light is aimed at the chandelier;
  - the first choice is picked;
  - a tuning fork is made, then the bars are brought back;
  - the brain and then the skull are tapped;
  - each button is pressed.

  It stops at the frame's step. Nothing in a frame is drawn separately from the level.

### Revision 9 (2026-11-20), superseded by Revision 10 below. Nadia, verbatim (two messages):

> this should be - proton magnet frequencies make up image something like this make it make sense not my wording but follow the theme of something being inside and decoding it like violin -> pure tones inside
> Proton frequencies → image

> make the signal coming out from tapping a part of the brain more associative or more apparent, also change tap the brain to tap a part of the brain.

#### What changes

- **The scanner's line of the pattern (line 40)** is now "MRI signal → proton frequencies → image".
  - Like "Violin note → pure tones", it starts from what you get, the signal, and decodes what is inside it: the
    protons' frequencies. Those make up the image.
  - On its slide, small glowing bars stand on the arrow between the signal and the picture: the proton frequencies
    found in the signal.
  - A caption that would run off the board is set a little smaller.
- **Tapping a part of the head (lines 25–27).**
  - Line 25 is now "Tap a part of the brain." The outer or the inner brain counts, as before.
  - The signal now comes out of the spot you tap. Rings grow out of the spot, and a glowing line in the part's colour
    runs from it to the data box. The wave is drawn from the left as it arrives.
  - The data box's edge takes the part's colour, and the part's name (one of line 26's labels) stands above the box.
  - The parts tapped before stay faint behind the new wave, so they can be compared.
  - No sound is added: the scanner part stays free of music (Revision 4).

#### Level 3 learner copy (Revision 9), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound?
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really]
13. Neither can anyone, just by looking.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a different pure tone.
22. At the break, the radiologist who read your scan comes over. (the radiologist walks over to you on the board as this appears)
23. You: My tuner just took my A note apart!
24. Radiologist: The MRI scanner works the same way.
25. Tap a part of the brain. (the outer or the inner brain; its signal comes out of the spot you tap, runs to the data box and is drawn there, under its name)
26. skin, skull, fluid, outer brain, inner brain (the labels beside the head)
27. Now tap the skull.
28. Each tiny magnet behaves differently depending on which body part it's in.
29. [Collect the data]
30. Collecting that data
31. [Convert it to pixels]
32. and converting it into pixel data
33. helps us see an MRI picture, with the Fourier transform. (lines 28, 30, 32 and 33 are one paragraph, shown one part at a time, the earlier parts turning grey; the people and their bubbles are gone while it is shown)
34. Radiologist: Do you notice a pattern? [Yes] [Not yet]
35. Radiologist: Let me help you out.
36. Violin note → pure tones (the caption under its pictures, the A note's wave → its four bars, on a slide of its own)
37. [Next]
38. Stage light → its full color spectrum (on a slide of its own: a white beam into a prism → a fan of colours)
39. [Next]
40. MRI signal → proton frequencies → image (on a slide of its own: the scanner's signal → small bars of its proton frequencies, on the arrow → the picture of your patient's head)
41. [Next] (then all three together, each caption under its pictures)
42. the Fourier transform (the grand reveal: big and glowing in the middle of the board)
43. The mathematical tool that lets us start seeing what hides inside: the Fourier transform.
44. All three come down to the same geometric math.
45. Joseph Fourier came up with it about 200 years ago.
46. The applications are endless! From a simple tuner to looking inside your brain.

Nothing comes after line 46.

#### The review strip's labels (for review, not learner copy)

- All steps (the link on the Level 3 tag)
- Level 3, step by step (the strip's title)
- Scroll left and right, or use the arrows. Each frame is the level itself, stopped at that step.
- Play from here
- Back to the levels

The 26 step titles are in `src/levels/stepsPrism.js`.

#### What the new lines claim

The numbers are computed in `src/math/prism.js` and checked by `test/prism.test.js`. Lines 1–24, 26–39 and 41–46 are
as in Revision 8 and keep its notes. New:

- **Line 40, "MRI signal → proton frequencies → image".** This is how a real scanner tells places apart.
  - While it listens, an extra magnet (a gradient) makes the protons at each place along one direction turn at a
    slightly different frequency. So the signal is a mix of frequencies.
  - The Fourier transform finds how much of each frequency is in the mix. That says how much signal came from each
    place: one line of the image.
  - Real scanners also use the waves' timing (phase) for the other direction. The board, as since Revision 6, gives
    each place in a row its own frequency.
- **The bars on the arrow.** They are 8 of the 48 amounts the Fourier transform finds in the middle row's signal (every
  fifth one, across the head).
  - Each equals the brightness of that pixel of the row, exactly: they are the numbers that become that row of the
    picture.
  - They are coloured as each frequency is coloured elsewhere on the board.
- **The tapped part's signal.** On the board, each part's signal is shown on its own, coming out of the spot you
  tapped.
  - The line from the spot to the data box only shows which part the wave belongs to.
  - In a real scanner, the signal is a radio wave picked up by coils around the head, and every part's signal arrives
    at once, mixed. The "Collect the data" step shows that mix.
  - The wave's strength and fade are as in Revision 6's notes. It is as strong as the part is bright in the picture;
    how long it lasts is an illustration.

### Revision 10 (2026-11-20), superseded by Revision 11 below. Nadia, verbatim:

> Violin note → pure tones
> Stage light → its full color spectrum
> MRI image → proton frequencies

#### What changes

- **The scanner's line of the pattern (line 40)** is now Nadia's "MRI image → proton frequencies". All three lines now
  read the same way: a thing, then what is inside it.
- **Its slide matches it.**
  - On the left: the MRI picture of your patient's head, with its middle row marked.
  - On the right: that row's proton frequencies, one thin glowing bar for each of the row's 48 frequencies, like the
    violin's four bars.
  - The scanner's signal no longer stands in this row, and the small bars over the arrow (Revision 9) are gone.

#### Level 3 learner copy (Revision 10), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound?
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really]
13. Neither can anyone, just by looking.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a different pure tone.
22. At the break, the radiologist who read your scan comes over. (the radiologist walks over to you on the board as this appears)
23. You: My tuner just took my A note apart!
24. Radiologist: The MRI scanner works the same way.
25. Tap a part of the brain. (the outer or the inner brain; its signal comes out of the spot you tap, runs to the data box and is drawn there, under its name)
26. skin, skull, fluid, outer brain, inner brain (the labels beside the head)
27. Now tap the skull.
28. Each tiny magnet behaves differently depending on which body part it's in.
29. [Collect the data]
30. Collecting that data
31. [Convert it to pixels]
32. and converting it into pixel data
33. helps us see an MRI picture, with the Fourier transform. (lines 28, 30, 32 and 33 are one paragraph, shown one part at a time, the earlier parts turning grey; the people and their bubbles are gone while it is shown)
34. Radiologist: Do you notice a pattern? [Yes] [Not yet]
35. Radiologist: Let me help you out.
36. Violin note → pure tones (the caption under its pictures, the A note's wave → its four bars, on a slide of its own)
37. [Next]
38. Stage light → its full color spectrum (on a slide of its own: a white beam into a prism → a fan of colours)
39. [Next]
40. MRI image → proton frequencies (on a slide of its own: the MRI picture of your patient's head, its middle row marked → that row's proton frequencies, one thin bar each)
41. [Next] (then all three together, each caption under its pictures)
42. the Fourier transform (the grand reveal: big and glowing in the middle of the board)
43. The mathematical tool that lets us start seeing what hides inside: the Fourier transform.
44. All three come down to the same geometric math.
45. Joseph Fourier came up with it about 200 years ago.
46. The applications are endless! From a simple tuner to looking inside your brain.

Nothing comes after line 46.

#### The review strip's labels (for review, not learner copy)

- Level 3, step by step (the strip's title)
- Scroll left and right, or use the arrows. Each frame is the level itself, stopped at that step.
- Play from here
- Back to the levels

The 26 step titles are in `src/levels/stepsPrism.js`.

#### What the new lines claim

The numbers are computed in `src/math/prism.js` and checked by `test/prism.test.js`. Lines 1–39 and 41–46 are as in
Revision 9 and keep its notes. New:

- **Line 40, "MRI image → proton frequencies".** In a real scanner, while it listens, the protons at each place along
  one direction turn at their own slightly different frequency (Revision 9's notes). So how bright a pixel is says how
  much signal came at that place's frequency. A row of the image, taken apart, is the protons' frequencies.
- **The bars.** They are the 48 amounts the Fourier transform finds in the marked row's signal, one for each
  frequency. Each equals the brightness of that row's pixel exactly: the bars are the row of the picture, taken apart.
  Where the row is outside the head, the amount is 0 and there is no bar. They are coloured as each frequency is
  coloured elsewhere on the board.
- On the board, as since Revision 6, each place in a row has its own frequency. Real scanners also use the waves'
  timing (phase) for the other direction.

### Revision 11 (2026-11-23), superseded by Revision 12 below. Nadia, verbatim (the first part of her message; all of it is in
"All three levels: reading at your own pace, and a simpler Level 2"):

> change level 3 to the final level. Four notes hide in this signal. "Can you see them?
>
> Yes
> Not really
> Neither can anyone, just by looking." This script needs to be changed. when i press yes, the answer is still neither can anyone just by looking. also the signal that is presented with this script, it is aparaent that there are 4 bumps so maybe the unknowledgable user might assume that the are different notes. find a way to make that more clear.

#### What changes

- **The final level.** Its tag now reads "Final level", and Level 2 ends with "Next: Final level".
- **The answer depends on yours (line 13).**
  - After Yes: "Careful: the bumps aren't the notes. Each bump is all four notes, added together."
  - After Not really: "Neither can anyone, just by looking. Each bump is all four notes, added together."
- **The bumps are not the notes, shown.** After you answer, the signal holds still. Faint bands mark each repeat of its
  shape, with a dashed line between them. A glowing copy of the first repeat slides onto the second and fits it
  exactly. So the bumps are one shape, again and again, and counting them is not counting notes. Then "Take it apart"
  shows the four notes, each a smooth wave all the way across.

#### Level 3 learner copy (Revision 11), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound?
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really] (then the signal holds still: faint bands mark each repeat of its shape, and a glowing copy of the first repeat slides onto the second and fits it exactly)
13. After Yes: Careful: the bumps aren't the notes. Each bump is all four notes, added together. After Not really: Neither can anyone, just by looking. Each bump is all four notes, added together.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a different pure tone.
22. At the break, the radiologist who read your scan comes over. (the radiologist walks over to you on the board as this appears)
23. You: My tuner just took my A note apart!
24. Radiologist: The MRI scanner works the same way.
25. Tap a part of the brain. (the outer or the inner brain; its signal comes out of the spot you tap, runs to the data box and is drawn there, under its name)
26. skin, skull, fluid, outer brain, inner brain (the labels beside the head)
27. Now tap the skull.
28. Each tiny magnet behaves differently depending on which body part it's in.
29. [Collect the data]
30. Collecting that data
31. [Convert it to pixels]
32. and converting it into pixel data
33. helps us see an MRI picture, with the Fourier transform. (lines 28, 30, 32 and 33 are one paragraph, shown one part at a time, the earlier parts turning grey; the people and their bubbles are gone while it is shown)
34. Radiologist: Do you notice a pattern? [Yes] [Not yet]
35. Radiologist: Let me help you out.
36. Violin note → pure tones (the caption under its pictures, the A note's wave → its four bars, on a slide of its own)
37. [Next]
38. Stage light → its full color spectrum (on a slide of its own: a white beam into a prism → a fan of colours)
39. [Next]
40. MRI image → proton frequencies (on a slide of its own: the MRI picture of your patient's head, its middle row marked → that row's proton frequencies, one thin bar each)
41. [Next] (then all three together, each caption under its pictures)
42. the Fourier transform (the grand reveal: big and glowing in the middle of the board)
43. The mathematical tool that lets us start seeing what hides inside: the Fourier transform.
44. All three come down to the same geometric math.
45. Joseph Fourier came up with it about 200 years ago.
46. The applications are endless! From a simple tuner to looking inside your brain.

Nothing comes after line 46.

#### The review strip's labels (for review, not learner copy)

- Level 3, step by step (the strip's title)
- Scroll left and right, or use the arrows. Each frame is the level itself, stopped at that step.
- Play from here
- Back to the levels

The 26 step titles are in `src/levels/stepsPrism.js`.

#### What the new lines claim

The numbers are computed in `src/math/prism.js` and checked by `test/prism.test.js`. Lines 1–12 and 14–46 are as in
Revision 10 and keep its notes. New:

- **"Each bump is all four notes, added together" (line 13).** At every moment, the signal is exactly the sum of the
  four pure tones (Revision 1's notes). So a bump is a place where they add up a certain way, not one of the notes.
- **The repeats.** The A note's signal repeats exactly: on the board it shows two and a half repeats, and the copy of
  the first is the same curve, moved by one repeat (`repeats()`). The real A repeats 440 times a second.

### Revision 12 (2026-11-23), superseded by Revision 13 below

Nadia's message, verbatim, is in "All three levels: the magazine, and the thought it builds", above.

#### What changes

- **Line 1** ties back to Level 2's question: "After your scan, you head back to the concert hall, still wondering."
- **The ending, after the grand reveal (lines 45–57):**
  - Fourier's date becomes a "Did you know?" box, with where the idea came from: how heat spreads.
  - The big idea: "Going from a whole to the hidden parts inside it is possible."
  - The board becomes a map: the title shrinks into a glowing hub, the Fourier transform; sound, light and MRI light up
    around it; then question marks spread out everywhere else, past the edges.
  - "Surprise: we've already figured out a few, from a simple tuner to looking inside your brain." and "But the
    possibilities are endless. What we've discovered is just the surface." These replace "Joseph Fourier came up with
    it about 200 years ago." as a line and "The applications are endless! From a simple tuner to looking inside your
    brain.", in Nadia's new words.
  - ENERGEO's name appears over the map, then three lines introduce it, and the level ends: "You just took your first
    steps into it."
- **Two new review steps** (`src/levels/stepsPrism.js`): "Just the surface" and "ENERGEO", in place of "The
  applications are endless".
- **Two more Next stops**, both page turns: after the "Did you know?" box (to the map) and after "just the surface" (to
  ENERGEO). The final level now takes 9 presses: 6 page turns and its three slides.

#### Level 3 learner copy (Revision 12), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall, still wondering.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound?
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really] (then the signal holds still: faint bands mark each repeat of its shape, and a glowing copy of the first repeat slides onto the second and fits it exactly)
13. After Yes: Careful: the bumps aren't the notes. Each bump is all four notes, added together. After Not really: Neither can anyone, just by looking. Each bump is all four notes, added together.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a different pure tone.
22. At the break, the radiologist who read your scan comes over. (the radiologist walks over to you on the board as this appears)
23. You: My tuner just took my A note apart!
24. Radiologist: The MRI scanner works the same way.
25. Tap a part of the brain. (the outer or the inner brain; its signal comes out of the spot you tap, runs to the data box and is drawn there, under its name)
26. skin, skull, fluid, outer brain, inner brain (the labels beside the head)
27. Now tap the skull.
28. Each tiny magnet behaves differently depending on which body part it's in.
29. [Collect the data]
30. Collecting that data
31. [Convert it to pixels]
32. and converting it into pixel data
33. helps us see an MRI picture, with the Fourier transform. (lines 28, 30, 32 and 33 are one paragraph, shown one part at a time, the earlier parts turning grey; the people and their bubbles are gone while it is shown)
34. Radiologist: Do you notice a pattern? [Yes] [Not yet]
35. Radiologist: Let me help you out.
36. Violin note → pure tones (the caption under its pictures, the A note's wave → its four bars, on a slide of its own)
37. [Next]
38. Stage light → its full color spectrum (on a slide of its own: a white beam into a prism → a fan of colours)
39. [Next]
40. MRI image → proton frequencies (on a slide of its own: the MRI picture of your patient's head, its middle row marked → that row's proton frequencies, one thin bar each)
41. [Next] (then all three together, each caption under its pictures)
42. the Fourier transform (the grand reveal: big and glowing in the middle of the board)
43. The mathematical tool that lets us start seeing what hides inside: the Fourier transform.
44. All three come down to the same geometric math.
45. Did you know? Joseph Fourier came up with it about 200 years ago, while working out how heat spreads. (a "Did you know?" box)
46. [Next]
47. The big idea: Going from a whole to the hidden parts inside it is possible. (the rows fade, and the glowing title shrinks into the hub of a map, labelled the Fourier transform)
48. sound, light, MRI (the three things it already takes apart, lit around the hub)
49. Surprise: we've already figured out a few, from a simple tuner to looking inside your brain.
50. ? (on every node of the map not yet found, smaller and fainter the further out, spreading past the board's edges)
51. But the possibilities are endless. What we've discovered is just the surface.
52. [Next]
53. ENERGEO, energy geometry (the name and the field, at the top of the map)
54. Meet ENERGEO: the start of a new science, energy geometry.
55. It sets out to map transformations like the Fourier transform.
56. And to build tools that help us see what we couldn't before, but that was always there.
57. You just took your first steps into it.

Nothing comes after line 57.

#### The review strip's labels (for review, not learner copy)

- Level 3, step by step (the strip's title)
- Scroll left and right, or use the arrows. Each frame is the level itself, stopped at that step.
- Play from here
- Back to the levels

The 27 step titles are in `src/levels/stepsPrism.js`.

#### What the new lines claim

Lines 2–44 are as in Revision 11 and keep its notes. The new lines are covered in "All three levels: the magazine, and
the thought it builds" (above). Also:

- **Line 45.** Fourier set out his series in his work on how heat flows (presented in 1807, published in 1822).
- **Line 49.** The tuner, a prism's spectrum and the MRI scanner are the three uses the level has just shown.

### Revision 13 (2026-11-24), which governs Level 3

Nadia's messages, verbatim, are in "All three levels: one screen per level, and no "Did you know?", +1 or Level up!",
above. Only line 45 changes: the "Did you know?" box goes, and the line is the plain one it was before Revision 12.
Everything else, and every note, is as in Revision 12.

#### Level 3 learner copy (Revision 13), in order (drafted by Claude at Nadia's request, for her review)

1. After your scan, you head back to the concert hall, still wondering.
2. The lights dim. You notice a stage light shining.
3. Drag to aim it at the chandelier.
4. Drag across the picture to swing the light. (only after 8 seconds)
5. Where did the colors come from? [The glass] [The white light]
6. From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.
7. You (thinking): If a prism is a tool that can take apart light, is there a tool that can take apart a sound? (on the board, the hall dims and you stand in it, thinking; a thought bubble rises from your head: a prism takes white light apart into its colors, then the same prism takes your A note apart into its four pure tones) light, sound (the two rows' labels)
8. Surprise: it's your tuner.
9. [Play your A note]
10. A (the letter on the tuner)
11. The tuner draws your note's signal, its shape over time, and names it: A.
12. Four notes hide in this signal. Can you see them? [Yes] [Not really] (then the signal holds still: faint bands mark each repeat of its shape, and a glowing copy of the first repeat slides onto the second and fits it exactly)
13. After Yes: Careful: the bumps aren't the notes. Each bump is all four notes, added together. After Not really: Neither can anyone, just by looking. Each bump is all four notes, added together.
14. [Take it apart]
15. Your A note, taken apart into four pure tones.
16. A, high A, E, higher A (the labels under the bars)
17. Drag the bars. Can you make a single pure tone, like a tuning fork?
18. Drag all the bars but one down to 0. (only after 9 seconds)
19. One bar, one smooth wave: a tuning fork.
20. Now bring the others back.
21. Every bump in the signal comes from a different pure tone.
22. At the break, the radiologist who read your scan comes over. (the radiologist walks over to you on the board as this appears)
23. You: My tuner just took my A note apart!
24. Radiologist: The MRI scanner works the same way.
25. Tap a part of the brain. (the outer or the inner brain; its signal comes out of the spot you tap, runs to the data box and is drawn there, under its name)
26. skin, skull, fluid, outer brain, inner brain (the labels beside the head)
27. Now tap the skull.
28. Each tiny magnet behaves differently depending on which body part it's in.
29. [Collect the data]
30. Collecting that data
31. [Convert it to pixels]
32. and converting it into pixel data
33. helps us see an MRI picture, with the Fourier transform. (lines 28, 30, 32 and 33 are one paragraph, shown one part at a time, the earlier parts turning grey; the people and their bubbles are gone while it is shown)
34. Radiologist: Do you notice a pattern? [Yes] [Not yet]
35. Radiologist: Let me help you out.
36. Violin note → pure tones (the caption under its pictures, the A note's wave → its four bars, on a slide of its own)
37. [Next]
38. Stage light → its full color spectrum (on a slide of its own: a white beam into a prism → a fan of colours)
39. [Next]
40. MRI image → proton frequencies (on a slide of its own: the MRI picture of your patient's head, its middle row marked → that row's proton frequencies, one thin bar each)
41. [Next] (then all three together, each caption under its pictures)
42. the Fourier transform (the grand reveal: the stage light from the start of the level stands on the floor again, swings on, flickers and lights the middle of the board; the name appears in its light, big, in ivory)
43. The mathematical tool that lets us start seeing what hides inside: the Fourier transform.
44. All three come down to the same geometric math.
45. Joseph Fourier came up with it about 200 years ago.
46. [Next]
47. The big idea: Going from a whole to the hidden parts inside it is possible. (the rows fade, and the glowing title shrinks into the hub of a map, labelled the Fourier transform)
48. sound, light, MRI (the three things it already takes apart, lit around the hub)
49. Surprise: we've already figured out a few, from a simple tuner to looking inside your brain.
50. ? (on every node of the map not yet found, smaller and fainter the further out, spreading past the board's edges)
51. But the possibilities are endless. What we've discovered is just the surface.
52. [Next]
53. ENERGEO, energy geometry (the name and the field, at the top of the map; around the map, other hubs light up, each with spokes of its own: other geometries, none of them named)
54. Meet ENERGEO: the start of a new science, energy geometry.
55. The Fourier transform is just one example: one geometry, and what it can uncover. (Nadia, 2026-11-24: "fourier is also just an example of using a specific geometry to uncover its given resultants")
56. There are a whole bunch of geometries. ENERGEO sets out to find them, and what each one uncovers. (Nadia: "there are a bunch of geometries, that is the aim")
57. You just took your first steps into it.

Nothing comes after line 57.

#### The review strip's labels (for review, not learner copy)

- Level 3, step by step (the strip's title)
- Scroll left and right, or use the arrows. Each frame is the level itself, stopped at that step.
- Play from here
- Back to the levels

The 27 step titles are in `src/levels/stepsPrism.js`.

