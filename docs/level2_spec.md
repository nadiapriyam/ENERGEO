# Level 2: "Inside a note"

Nadia's specification for Level 2, which follows Level 1 (the MRI story, `docs/prototype_try_spec.md`). **Revision 2
(2026-11-18) governs.** Revision 1, the notebook version, is kept below as history. Level 1 is at `try/` and Level 2 at
`try/level-2/`. Every learner-facing line of Level 2 is copied from the Revision 2 list, and `test/level2.test.js`
checks that.

## Revision 2 (2026-11-18): back to Level 1's style, one take-home message — governs

Nadia, verbatim:

> not sure if i like the note book style go back to the previous style also the making it zero took way too long maybe make it simpler, also the main thing is for the user to realize that a violin note isn:t a pure tuning fork signal its a mix of many like in zero it can have so many frequencies embended and the level two is too long make it have this one take home message you dont have to introduce fourier right now. be knowledgable about attention span and also use a leaqrning technique that makes the learner learn by themself not you just telling them what to do, be creative with this but also make sure the story is good.

### The one take-home message

A violin note isn't one pure tone like a tuning fork: it is a mix of many. Just like Level 1's 0, one thing on the
outside can have many parts hiding inside.

### What changed

- **Back to Level 1's style.** A white page, the system sans and one accent. The notebook (cover, ruled paper, tabs,
  handwriting, page turns) is gone. `notebook/` now forwards to `try/`. Level 1 is unchanged. After its last line, a
  link leads to Level 2.
- **Short.** The story runs for about half a minute, plus the learner's own experimenting.
- **Reaching 0 is simpler.** There are four tuning forks, and tapping a fork strikes it harder (1, 2, 3; once more lets
  it fall silent). The match takes seven taps in all. The violin is 3, 2, 1, 1.
- **Removed:** Fourier (not named), the return to the MRI scanner, the other notes, and the "agree at one moment" step.

### How the learner learns it themselves

The page never says what is inside the note until the learner has found it and said it.

1. **Contrasting cases.** A tuning fork and a violin play the same note, and their waves sit one above the other: one
   smooth, one jagged.
2. **Prediction.** "Same note. So why do they sound so different?" Any answer gets "Let's find out." Nothing is marked
   right or wrong.
3. **Productive failure.** "Can your tuning fork match the violin?" One fork, struck as hard as you like, never gets the
   DIFFERENCE below 40%. The learner sees and hears it fail.
4. **A prediction about the failure.** "Can one tuning fork ever match the violin?" Then "Let's open the box."
5. **Discovery.** Three smaller forks (higher tones) come out of the box. The learner strikes them, hears them, and
   watches the gap close until the DIFFERENCE is exactly 0. This echoes Level 1's 0, now as the sign of a perfect match.
6. **Self-explanation before the reveal.** "So what's hiding inside one violin note?" Only after the learner answers
   does the violin's wave come apart into its four tones.
7. **The take-home**, said once, tied to Level 1.

### Level 2 learner copy, in order (drafted by Claude at Nadia's request, for her review)

1. Before a concert, the whole orchestra tunes to one note.
2. [Hear a tuning fork]
3. tuning fork, violin (the labels on the two waves)
4. [Hear a violin]
5. Same note. So why do they sound so different? [The violin is louder] [It is a different note] [Something else is mixed in]
6. Let's find out.
7. Can your tuning fork match the violin?
8. violin, yours (the labels on the two waves)
9. DIFFERENCE (the readout, as a percentage, and as 0 in a box when the match is exact)
10. [Play violin] [Play mine]
11. Tap the fork to strike it. (only after 6 seconds without a tap)
12. Can one tuning fork ever match the violin? [Yes] [No] [Not sure]
13. Let's open the box.
14. Can you match it now?
15. You got 0.
16. So what's hiding inside one violin note? [One pure tone] [Several tones at once]
17. Look.
18. A violin note isn't one pure tone like a tuning fork. It's a mix of many.
19. Just like the 0 in Level 1: one thing on the outside, many parts hiding inside.

Nothing comes after line 19.

Around the levels: "Level 1", "Level 2", "Turn your sound on." and "Next: Level 2".

### The physics and the mathematics behind it

The numbers are computed in `src/math/tones.js` and checked by `test/level2.test.js`.

- **Line 1.** Orchestras tune to one note, an A (usually 440 Hz, often given by the oboe). Line 1 says "one note" and
  does not say who plays it. A tuning fork's ring is very nearly one pure tone.
- **The forks.** Fork k plays the pure tone sin(2π k x) at k times 440 Hz (k = 1…4). A fork sings higher the shorter
  its prongs, so the forks are drawn with heights ∝ 1/√k, the scaling of a fork's prong length with pitch. Striking
  harder makes a fork louder: struck 1, 2 or 3, and once more lets it fall silent, as touching a ringing fork stops it.
- **The violin is a synthesized violin-like note, not a recording.** It is the four tones in amounts 3, 2, 1, 1, the
  way a bowed string's tones fall off (roughly 1/k). That keeps it exactly rebuildable from four forks. A real violin
  note mixes many more tones, dozens of them, which is why line 18 says "a mix of many". Every held note (the violin's
  and yours) gets the same bow and gentle vibrato, so comparing by ear stays fair.
- **DIFFERENCE.** It is the mean of the squared gap between the violin and yours over a whole period, as a share of
  the violin's own size. Because the tones are orthogonal, it equals ½ Σ (a_k − b_k)² / 9 exactly (Parseval). It is
  exactly 0 only when every fork matches, and never by rounding.
- **One fork alone gets no closer than 40%.** Struck 1, 2 or 3 it reads 67%, 47% or 40%. Each fork can be tuned on its
  own, because fixing one never undoes another.

## Revision 1 (2026-11-18): the notebook version — superseded, kept as history

### Nadia's request, verbatim

> give us a clean bridge from zero into Fourier and eventually Energy Geometry building on the mri interactive. I want it to be level two, and mri to be level one of understanding nadias inventions notebook. So make it notebook themed, make mri interactive portion level one, and the following music section level two. like the last one it should be a story and at the end the user should learn and think to themselves, wow Level 1 showed that a single result like 0 can hide many nonzero parts behind it. Level 2 takes the next step: even when two systems agree at one point, that single agreement can still hide differences across the whole system. and i can understand a hugely missed theorom so important aka fourier. Love if you could be creative and add cool effects for the prompt below that makes the story like a whole different dimension than the last one but it needs ot have the same kind of structure to preserve that these two relate to each other, be creative when adding to the story that relates the previous mri story.
> I would make the learner hear a single violin note first while seeing its complicated waveform moving across the screen. Then say something like:
> “Can you build what you just heard?”
> Below it are several playable simple tones. The learner can tap each one to hear it and adjust how much of it is included. As they add and tune the tones, a second waveform grows and begins to resemble the violin waveform. They can repeatedly press Play Mine / Play Violin to compare by ear.
> One mathematical caution: I would not actually use piano + flute + harp recordings as the ingredients, because those sounds already contain many frequencies themselves. That would muddy the Fourier idea. We can make the controls visually musical—keys, strings, tuning knobs—but underneath they should be simple harmonic tones:
> \[ f,\quad 2f,\quad 3f,\quad 4f,\ldots \]
> So the learner doesn't know yet that these are Fourier components. To them they are simply individual sounds they are mixing.
> The interaction could progress like this:
>
> 1. Hear it. Violin plays; complex waveform appears.
> 2. “Can you build what you just heard?”
> 3. Learner taps Tone 1. Too simple.
> 4. Adds Tone 2. Shape changes.
> 5. Adds Tone 3, Tone 4... suddenly it begins sounding surprisingly violin-like.
> 6. Each tone has a large tactile dial controlling how much of that tone is present.
> 7. Target violin waveform is faintly visible behind their reconstruction.
> 8. As they tune, the gap between target and their signal visibly shrinks.
> 9. Near the end we introduce a small display called DIFFERENCE.
> 10. When their reconstruction matches sufficiently well, that difference approaches:
>
> \[ \boxed{0} \]
> And that is how I would connect it beautifully to Level 1.
> Level 1 ended with:
> Many nonzero things can combine and produce 0.
> Level 2 starts with a completely different experience and eventually reveals:
> Many simple things can combine and produce something complex.
> Then we subtract what they built from the original:
> \[ \text{violin signal}-\text{your reconstruction} \]
> and, when they match,
> \[ \approx 0. \]
> So the zero is no longer the starting lesson. It returns unexpectedly as a test of whether two representations describe the same thing.
> The one-sentence Level 2 goal
> I think this is considerably better than our previous version:
> To show that something complex can be built from simpler hidden parts, and that we can test how completely those parts reproduce the original by measuring what is left over.
> And this begins the real road toward Energy Geometry:
> \[ \text{sound} \rightarrow \text{hidden tones} \rightarrow \text{amount of each tone} \rightarrow \text{Fourier coefficients} \rightarrow \text{squared amounts} \rightarrow \text{energy distribution} \rightarrow \text{geometry of that distribution}. \]
> Crucially, we don't tell the learner any of that yet. They first experience the almost magical fact that a violin sound they thought was “one thing” can be reconstructed from a collection of much simpler things.
> That feels like a genuine Level 2 after the MRI experience: Level 1 is visually simple and physical; Level 2 becomes auditory, richer, more exploratory, and starts revealing representation without using the word yet.

### What was built

- **The notebook** (`notebook/`):
  - A cover titled "Nadia's Inventions Notebook".
  - Index tabs for Level 1, Level 2 and a locked Level 3.
  - Cream ruled paper with a margin line and spiral holes.
  - Handwritten headings (Caveat, self-hosted). Everything the learner reads inside a level stays in the plain system
    sans, so its 0 is a plain 0.
  - Pages turn over like paper.
  - `try/` opens the notebook at Level 1.
- **Level 1, "Inside the scanner"**: the MRI story, unchanged (`docs/prototype_try_spec.md`, Revision 4). It is a white
  card taped into the page. After its last line the notebook offers "Turn the page".
- **Level 2, "Inside a note"**: the lights go down, and the page turns to night.
  - Waves glow on a dark stage: the violin is gold, your sound is cyan, the gap between them is violet.
  - Six simple tones, each with a string (tone k vibrates in k humps), a large dial (0 to 10 clicks) and − / +.
  - Play violin / Play mine, to compare by ear.
  - One moment where both waves read 0, which proves nothing.
  - A DIFFERENCE readout across the whole wave, which the learner drives to an exact, boxed 0.
  - Two more notes whose recipes are hidden, then revealed.
  - A return to Level 1: the scanner's faint reply is unmixed into its tones, and the picture paints row by row.
  - The idea is named after Fourier, with Nadia's two sentences about the levels.
- **Level 3**: a locked tab with no title. The road to Energy Geometry is not shown to the learner (below).

#### The same structure in both levels

| Step | Level 1, "Inside the scanner" | Level 2, "Inside a note" |
| --- | --- | --- |
| Setting | An MRI scanner; slide in, zoom into the water | The lights go down; a violin plays one note |
| The objects | Protons as tiny magnets, ↑ and ↓ | Six simple tones, each a string with a dial |
| The readout on top | TOTAL: the arrows added up (↑ + ↓ + … = n) | DIFFERENCE: the violin minus yours, across the whole wave |
| The task | Can you make the total 0? | Can you build what you just heard? → Can you make the difference 0? |
| Checkpoint 1 | Can every piece still be here while the total is 0? | Both waves are at 0 here. Are they the same sound? |
| Reaching 0 | You got 0. But did everything disappear? | You got 0. But did the violin disappear? |
| Checkpoint 2 | If the total is 0, are the pieces gone? | If the difference is 0, is the violin gone? |
| Look behind | Covered drops: What's behind this 0? | Hidden recipes: What's behind this sound? |
| The second act | Switch on the magnet: one arrow flips, the scanner listens | The scanner's reply is a chord: unmix it, paint the picture |
| The lesson | A single result like 0 can hide many nonzero parts | One moment of agreement can hide differences across the whole system |

### Level 2 learner copy (Revision 1), in order

Lines marked (Nadia) are her wording. Lines marked (R2) reuse her Level 1 wording.

1. The lights go down.
2. A violin plays one note.
3. [Listen]
4. violin, yours (the labels on the two waves)
5. One note. It sounds like one single thing.
6. But look at its shape: it repeats, and it isn't simple.
7. Can you build what you just heard? (Nadia)
8. Here are six simple tones.
9. Tap a string to hear it. Turn its dial to mix it in.
10. Tone 1 … Tone 6, − and + (on the dials)
11. [Play violin] [Play mine] (Nadia: Play Mine / Play Violin)
12. Start with Tone 1: turn its dial. (only after 8 seconds without a move)
13. One tone: too smooth, too plain.
14. The shape changed. Keep going.
15. Look at this moment: both waves are at exactly 0.
16. violin: 0, yours: 0 (the readout at that moment)
17. They agree here. Are they the same sound? [Yes] [No] [Not sure]
18. Let's listen.
19. One moment agreeing can't tell you. You have to check the whole wave.
20. DIFFERENCE (the readout's label, Nadia), shown as a percentage, and as 0 in a box at the end
21. Meet the DIFFERENCE: the violin minus yours, across the whole wave.
22. Can you make the difference 0?
23. You got 0. (R2)
24. But did the violin disappear? [Look closer] (R2: Look closer)
25. If the difference is 0, is the violin gone? [Yes] [No]
26. Exactly. It's all still there, rebuilt from simple tones. (after No)
27. Listen again — it's still there. (after Yes)
28. Six simple tones, combined, make one complex sound.
29. Here's a different note.
30. ? (on each hidden dial)
31. What's behind this sound? [One tone] [Many tones]
32. Let's see. (R2)
33. Different sound.
34. And another. [Look inside]
35. Different recipe.
36. Many sounds. The same simple tones behind each one.
37. Remember the MRI scanner in Level 1?
38. Its faint reply was a chord: many radio tones at once, one from each spot along a line through you.
39. [Unmix it]
40. How much of each tone tells how much of you is at that spot.
41. Row by row, that is how it painted your picture.
42. What you just did has a name: Fourier's idea.
43. Over two hundred years ago, Joseph Fourier showed that repeating signals can be built from simple waves.
44. Today it runs inside MRI scanners, phones and music apps.
45. Level 1 showed that a single result like 0 can hide many nonzero parts behind it. (Nadia)
46. Level 2 takes the next step: even when two systems agree at one point, that single agreement can still hide differences across the whole system. (Nadia)
47. One note, six simple tones inside it. And a 0 that proves it.

Nothing comes after line 47.

The notebook's own text: "Nadia's Inventions Notebook", "Open the notebook", the tabs "Level 1", "Level 2" and
"Level 3", the page titles "Inside the scanner", "Inside a note" and "?", "Turn your sound on.", "Coming soon." and
"Turn the page".

### The mathematics and the physics behind Level 2

The numbers are computed in `src/math/tones.js` and checked by `test/notebook_level2.test.js`.

- **The tones.** Tone k is the pure wave sin(2π k x), where x is time in periods of the note: k times the note's pitch
  (440 Hz), for k = 1…6. These are Nadia's f, 2f, 3f, …. A dial gives a tone 0 to 10 clicks, and a note is the sum of
  its tones. The learner is not told that these are Fourier components until the end, and then only by name.
- **The violin is a synthesized violin-like note, not a recording.** Its recipe is 10, 5, 4, 3, 2, 2 clicks. A bowed
  string's tones fall off roughly as 1/k (a sawtooth), and this recipe is shaped a little by the body. It is exactly
  periodic, so it can be rebuilt exactly. A recording would not be. Every note (the violin, yours, the others) gets the
  same gentle vibrato when it plays, so comparing by ear stays fair. The drawn waves have no vibrato.
- **One moment proves nothing.** Every tone is 0 at every half period, so any two recipes agree at those moments. The
  marker stands at one of them, and both waves read exactly 0 even when the sounds differ. This is Nadia's "even when
  two systems agree at one point, that single agreement can still hide differences across the whole system".
- **DIFFERENCE is measured across the whole wave.** It is the mean of the squared gap between the violin and yours over
  one period, given as a share of the violin's own size. Because the tones are orthogonal, the mean squared gap equals
  ½ Σ (a_k − b_k)² / 100 exactly (Parseval). So DIFFERENCE is exactly 0 only when every dial matches. Any other
  setting shows at least 1%, because a 0 is never produced by rounding.

  Each dial can also be tuned on its own: fixing one never undoes another. This is what makes the recipe findable. It
  is the first step on Nadia's road to "squared amounts → energy distribution", and it is not told to the learner.
- **Fourier.** Joseph Fourier presented the idea in his 1807 memoir on heat and in his 1822 book (*Théorie analytique
  de la chaleur*). For a repeating signal of finite energy, the sum of its tones approaches the signal in exactly the
  whole-wave sense that DIFFERENCE measures: the mean squared leftover goes to 0. "Runs inside MRI scanners, phones and
  music apps":
  - MRI images are reconstructed with a Fourier transform.
  - 4G, 5G and Wi-Fi use the fast Fourier transform (OFDM).
  - Audio codecs and equalizers use Fourier-type transforms.
- **Back to Level 1.** In an MRI scanner a gradient field makes protons at different positions along one direction
  answer at different radio frequencies. The reply is a chord, and the amount of each tone gives how much signal comes
  from that position. The page computes the unmixing for real: each row of the picture is turned into a chord, and the
  chord is unmixed by a discrete Fourier transform back into its amounts, which paint the row.

  It is a simplification. Real scanners also use phase encoding, and the image comes from a two-dimensional Fourier
  transform. The picture is the same illustration as in Level 1, not a real scan.

### The road ahead (Nadia's), not shown to the learner

sound → hidden tones → amount of each tone → Fourier coefficients → squared amounts → energy distribution → geometry of
that distribution.

Level 2 takes the learner as far as "amount of each tone", and its DIFFERENCE is already a squared, whole-wave measure.
Nothing about energy is said to the learner. Level 3 is a locked tab with no title. The finite-energy (Energeo)
application has not been started, per the project rules.
