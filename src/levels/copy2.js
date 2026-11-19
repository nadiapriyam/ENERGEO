// Every learner-facing line of Level 2, "Inside a note", verbatim from docs/level2_spec.md (checked by
// test/level2.test.js). Drafted at Nadia's request for her review. Nothing else on the page is learner-facing text,
// apart from accessibility labels.

export const COPY = {
  opening: ["Tonight, you're the first violin.", 'Before the concert, the whole orchestra tunes to your A.'],
  bow: 'Drag the bow to play it.',
  tuned: "Everyone's in tune with you.",
  lens1: 'Drag the magnifying glass onto your violin.',
  lens2: 'Now find the A string.',
  stringLabel: 'A',
  shaking: 'Your A string shakes back and forth 440 times a second.',
  shape: 'This is the shape of that shaking.',
  oneNote: { question: 'The whole orchestra trusts this A. Is it just one note?', choices: ['Yes', 'No', 'Not sure'], after: "Let's see." },
  xray: 'Slide the glass across the sound.',
  hidden: 'Hidden inside: four notes.',
  notes: ['A', 'high A', 'E', 'higher A'],
  tapNotes: 'Tap each one to hear it.',
  together: 'Play them together',
  oneA: "To your ears it's one A. Inside, it's many notes at once.",
  mri: { question: 'Notice a similarity with the MRI scanner?', choices: ['Yes', 'Not yet'], after: 'Look.' },
  labels: { total: 'TOTAL', yourA: 'YOUR A' },
  plus: '+',
  equals: '=',
  zero: '0',
  oneAName: 'A',
  compare: 'In Level 1, one 0 hid many arrows. Here, one A hides many notes.',
  final: 'One thing on the outside. Many hidden parts inside.',
};
