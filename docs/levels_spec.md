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
21. One thing on the outside. Many hidden parts inside.

Nothing comes after line 21 in Level 1.

## Level 2, "Inside the scanner": learner copy, in order (drafted by Claude at Nadia's request, for her review)

Lines marked (R2) are Nadia's own wording, from `docs/prototype_try_spec.md` Revision 2.

1. This is an MRI scanner.
2. It can see inside a body: no X-rays, no cuts.
3. Your first patient is here. You're about to take their MRI scan!
4. You know more about an MRI than you think. Let's see if you can do it correctly! (the first sentence is R2; the second is Nadia's, 2026-11-20)
5. [Slide your patient in]
6. Inside, a giant magnet surrounds your patient.
7. [Zoom in]
8. O, H (the letters on the atoms)
9. Your patient's body is full of water.
10. One drop holds billions of trillions of hydrogen atoms.
11. [Closer]
12. N, S (the letters on every magnet)
13. At the heart of each hydrogen atom is a proton: a tiny magnet.
14. Picture each one as an arrow, pointing from S to N.
15. So many tiny magnets. Why don't they add up to one giant magnet?
16. TOTAL SIGNAL (the label on the total; Nadia's "TOTAL", now naming the signal)
17. The TOTAL SIGNAL adds up every arrow in the drop. Your scanner can only pick up this total.
18. + = … (the adding, written inside the TOTAL SIGNAL)
19. Can you make the total 0? (R2)
20. Drag a ↓ next to an ↑. (only after 6 seconds without a move)
21. 0 (under every balanced group)
22. Can every piece still be here while the total is 0? [Yes] [No] [Not sure] (R2)
23. Let's see. (R2)
24. You: Oh no! I got 0 signal for my MRI! (Nadia: "oh no you got no signal for your mri")
25. But did everything disappear? [Look closer] (R2)
26. If the total is 0, are the pieces gone? [Yes] [No] (R2)
27. Exactly. They cancelled. (R2; after No)
28. Look again — they're still there. (R2; after Yes)
29. That's the answer: inside your patient, opposite tiny magnets cancel each other out.
30. Same result. (R2)
31. Here's a look at some more protons in another part of your patient's body. Its total is 0 too. (Nadia, 2026-11-20: "heres a look at some more protons in another part of your patients body")
32. ? (on the covered drop, and in its TOTAL SIGNAL)
33. What's behind this 0? [Nothing] [Something]
34. Let's see. (R2)
35. Different arrangement. (R2)
36. And another. [Look inside]
37. Still 0. (R2)
38. And another. [Look inside]
39. One result. Many possible arrangements behind it. (R2)
40. You (thinking): My patient's total signal is 0. So how will my scanner see anything?
41. [Switch on the magnet]
42. Its magnet is tens of thousands of times stronger than Earth's.
43. It tips the balance, just barely: a few more arrows point with it than against it.
44. That's what an MRI does: it turns your patient's 0 signal into a small signal it can read.
45. In a real body, only about five to ten in every million are left over.
46. But the 0 was holding far more: every single tiny magnet, not just the few left over.
47. Your scanner nudges them with radio waves and picks up their faint reply.
48. [Take the scan]
49. From that faint reply, it paints a picture of your patient's insides.
50. You: I did it! My first MRI scan!
51. one picture (the label on what the eye sees)
52. Your eye sees just one picture. It's hiding far more than it seems.
53. You just figured out one of the core principles of MRI.
54. Do you see a similarity to the violin level? [Yes] [Not yet]
55. Look.
56. YOUR A NOTE, TOTAL SIGNAL, +, =, 0, A (the side by side)
57. In Level 1, one A note hid many notes. Here, one 0 signal hides countless tiny magnets.
58. A 0 isn't always nothing. Sometimes it's a whole person: countless tiny magnets, perfectly balanced.

Nothing comes after line 58.

Around the levels: "Level 1", "Level 2", "Level 3", "Turn your sound on." (Levels 1 and 3 need sound), "Next: Level 2"
and "Next: Level 3". The switch at the top right: "Full screen", and in full screen "Exit full screen" (see "All three
levels: scrolling, and full screen" below).

## What the new lines claim, and what they do not

- **"0 signal" (lines 16, 17 and 24).** An MRI scanner's coil picks up the net magnetization: the total of all the
  tiny magnets, not each one. When they cancel, that total is 0 and there is nothing to pick up.
- **"That's what an MRI does" (line 44).** The scanner's magnet tips the balance, so the total is no longer 0 but a
  small number it can read. In the drawing it is 2. In a real body it is about five to ten in every million (line 45).
- **"But the 0 was holding far more" (line 46).** This states only what is certain. The 0 is one number, the total.
  Behind it were all the tiny magnets, while the scanner's small signal reflects only the few left over. Nadia's
  stronger wording, "that 0 signal is way more knowledegable than the mri signal of manipulation of magnet", belongs to
  her hypothesis **B-ZERO-LOSS**: "leaving a natural zero/cancellation state may destroy information encoded in the
  relations that generated that zero" (`research/foundation_user_theories.md`, status: hypothesis). Until that
  hypothesis is established, the learner is not told that leaving the 0 destroys information, or that the 0 "knows"
  more.
- **The eye (lines 51 and 52).** The eye takes in light from every part of the picture and we see one picture. The
  drawing shows what is seen, not how the eye works. "It's hiding far more than it seems" refers to what the story has
  shown: behind every grey dot of the picture are countless tiny magnets.
- **The side by side (lines 56 and 57).** The left side is the violin level's arithmetic: the four notes' waves add up
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

## All three levels: scrolling, and full screen (2026-11-20). Nadia, verbatim:

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

### Revision 9 (2026-11-20), which governs Level 3. Nadia, verbatim (two messages):

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
