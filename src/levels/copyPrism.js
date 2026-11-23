// Every learner-facing line of Level 3, "A prism for sound", verbatim from docs/levels_spec.md (Revision 12, checked by
// test/prism.test.js). Drafted at Nadia's request for her review: a story that picks up right after Level 2, in as few
// words as it can. `you` holds the player's own lines (shown beside their face, a thought in a thought bubble) and
// `radiologist` the radiologist's. `mri` is Nadia's description of the scanner, in four parts, shown one at a time as
// each happens on the board, the earlier parts turning grey. `bodyParts` label the head's parts on the board. The level
// ends the thought the three levels build (Revision 12): going from a whole to its hidden parts is possible; we have
// found a few ways; what we have found is just the surface (`mapKnown`, `mapUnknown`: the map on the board); then
// ENERGEO. Nothing else on the page is learner-facing text, apart from accessibility labels.

export const COPY = {
  opening: 'After your scan, you head back to the concert hall, still wondering.',
  dim: 'The lights dim. You notice a stage light shining.',
  aim: 'Drag to aim it at the chandelier.',
  aimHint: 'Drag across the picture to swing the light.',
  where: {
    question: 'Where did the colors come from?',
    choices: ['The glass', 'The white light'],
    after: 'From the white light. The glass on the chandelier is a prism: it takes light apart into its colors.',
  },
  surprise: "Surprise: it's your tuner.",
  play: 'Play your A note',
  tunerLetter: 'A',
  drawsSignal: "The tuner draws your note's signal, its shape over time, and names it: A.",
  see: {
    question: 'Four notes hide in this signal. Can you see them?',
    choices: ['Yes', 'Not really'],
    yes: "Careful: the bumps aren't the notes. Each bump is all four notes, added together.",
    notReally: 'Neither can anyone, just by looking. Each bump is all four notes, added together.',
  },
  apart: 'Take it apart',
  split: 'Your A note, taken apart into four pure tones.',
  notes: ['A', 'high A', 'E', 'higher A'],
  pure: 'Drag the bars. Can you make a single pure tone, like a tuning fork?',
  pureHint: 'Drag all the bars but one down to 0.',
  pureDone: 'One bar, one smooth wave: a tuning fork.',
  back: 'Now bring the others back.',
  backDone: 'Every bump in the signal comes from a different pure tone.',
  arrives: 'At the break, the radiologist who read your scan comes over.',
  you: {
    think: 'If a prism is a tool that can take apart light, is there a tool that can take apart a sound?',
    tookApart: 'My tuner just took my A note apart!',
  },
  radiologist: {
    same: 'The MRI scanner works the same way.',
    pattern: { question: 'Do you notice a pattern?', choices: ['Yes', 'Not yet'], after: 'Let me help you out.' },
  },
  mri: [
    { text: "Each tiny magnet behaves differently depending on which body part it's in.", step: 0 },
    { text: ' Collecting that data', step: 1 },
    { text: ' and converting it into pixel data', step: 2 },
    { text: ' helps us see an MRI picture, with the Fourier transform.', step: 3 },
  ],
  tapBrain: 'Tap a part of the brain.',
  tapSkull: 'Now tap the skull.',
  bodyParts: ['skin', 'skull', 'fluid', 'outer brain', 'inner brain'],
  collect: 'Collect the data',
  convert: 'Convert it to pixels',
  pattern: ['Violin note → pure tones', 'Stage light → its full color spectrum', 'MRI image → proton frequencies'],
  revealTitle: 'the Fourier transform',
  reveal: 'The mathematical tool that lets us start seeing what hides inside: the Fourier transform.',
  name: 'All three come down to the same geometric math.',
  fourier: 'Joseph Fourier came up with it about 200 years ago, while working out how heat spreads.',
  bigIdea: 'Going from a whole to the hidden parts inside it is possible.',
  mapKnown: ['sound', 'light', 'MRI'],
  mapUnknown: '?',
  few: "Surprise: we've already figured out a few, from a simple tuner to looking inside your brain.",
  surface: "But the possibilities are endless. What we've discovered is just the surface.",
  energeo: {
    name: 'ENERGEO',
    field: 'energy geometry',
    lines: [
      'Meet ENERGEO: the start of a new science, energy geometry.',
      'It sets out to map transformations like the Fourier transform.',
      "And to build tools that help us see what we couldn't before, but that was always there.",
    ],
  },
  final: 'You just took your first steps into it.',
};
