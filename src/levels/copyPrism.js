// Every learner-facing line of Level 3, "A prism for sound", verbatim from docs/levels_spec.md (Revision 6, checked by
// test/prism.test.js). Drafted at Nadia's request for her review: a story that picks up right after Level 2, in as few
// words as it can. `you` holds the player's own lines (shown beside their face, a thought in a thought bubble) and
// `tech` the technician's. `mri` is Nadia's description of the scanner, in four parts: it is shown faded, and each part
// lights up as it happens on the board (`step` is the moment that lights it). `bodyParts` name the head's parts on the
// board. Nothing else on the page is learner-facing
// text, apart from accessibility labels.

export const COPY = {
  opening: 'After your scan, you head back to the concert hall.',
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
  see: { question: 'Four notes hide in this signal. Can you see them?', choices: ['Yes', 'Not really'], after: 'Neither can anyone, just by looking.' },
  apart: 'Take it apart',
  split: 'Your A note, taken apart into four pure tones.',
  notes: ['A', 'high A', 'E', 'higher A'],
  pure: 'Drag the bars. Can you make a single pure tone, like a tuning fork?',
  pureHint: 'Drag all the bars but one down to 0.',
  pureDone: 'One bar, one smooth wave: a tuning fork.',
  back: 'Now bring the others back.',
  backDone: 'Every bump in the signal comes from a bar.',
  arrives: 'At the break, the technician from your scan comes over.',
  you: {
    think: 'If a prism is a tool that can take apart light, is there a tool that can take apart a sound?',
    tookApart: 'My tuner just took my A note apart!',
  },
  tech: {
    same: 'My scanner works the same way.',
    pattern: { question: 'Do you notice a pattern?', choices: ['Yes', 'Not yet'], after: 'Let me help you out.' },
  },
  mri: [
    { text: "Each tiny magnet behaves differently depending on which body part it's in.", step: 0 },
    { text: ' Collecting that data', step: 1 },
    { text: ' and converting it into pixel data', step: 2 },
    { text: ' helps us see an MRI picture, with the Fourier transform.', step: 3 },
  ],
  tapParts: 'Tap the body parts.',
  bodyParts: ['skin', 'bone', 'fluid', 'gray matter', 'white matter'],
  collect: 'Collect the data',
  convert: 'Convert it to pixels',
  pattern: ['Violin note → pure tones', 'Stage light → its full color spectrum', 'Proton frequencies → image'],
  name: ['All three come down to the same geometric math: the Fourier transform.', 'Joseph Fourier came up with it about 200 years ago.'],
  final: 'Here it is: the mathematical tool that lets us start seeing what hides inside.',
};
