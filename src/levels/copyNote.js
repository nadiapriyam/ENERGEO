// Every learner-facing line of Level 1, "Inside a note", verbatim from docs/levels_spec.md (checked by
// test/note.test.js). Drafted at Nadia's request for her review. Nothing else on the page is learner-facing text,
// apart from accessibility labels.

export const COPY = {
  opening: [
    "Tonight, you're the first violin.",
    'Before a concert, every player tunes to the same note, so the whole orchestra plays in tune.',
    'Tonight, that note is yours: an A note. The whole orchestra trusts you to get it right.',
  ],
  bow: 'Drag the bow to play your A note.',
  tuned: "Everyone's in tune with your A note.",
  lens1: 'Drag the magnifying glass onto your violin.',
  lens2: 'Now find the A string.',
  stringLabel: 'A',
  shaking: 'Your A string shakes back and forth 440 times a second.',
  shape: 'This is the shape of that shaking.',
  oneNote: { question: 'The whole orchestra trusts this A note. Is it just one note?', choices: ['Yes', 'No', 'Not sure'], after: "Let's see." },
  xray: 'Slide the glass across the sound.',
  hidden: 'Hidden inside: four notes.',
  notes: ['A', 'high A', 'E', 'higher A'],
  tapNotes: 'Tap each one to hear it.',
  together: 'Play them together',
  heard: 'A note',
  oneA: 'Your ear takes in all four and hears just one A note. Inside, it is many notes at once.',
  final: 'One thing on the outside. Many hidden parts inside.',
};
