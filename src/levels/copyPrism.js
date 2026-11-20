// Every learner-facing line of Level 3, "A prism for sound", verbatim from docs/levels_spec.md (Revision 4, checked by
// test/prism.test.js). Drafted at Nadia's request for her review: a story that picks up right after Level 2, in as few
// words as it can. `you` holds the player's own lines (shown beside their face, a thought in a thought bubble) and
// `tech` the technician's. Nothing else on the page is learner-facing text, apart from accessibility labels.

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
    same: 'My scanner works the same way. Look: one row of your head.',
    spin: "The tiny magnets in each spot spin. Right now they all spin at the same speed, so I can't tell the spots apart.",
    own: 'Now each spot spins at its own speed: its own frequency.',
    picks: 'My scanner picks up every spot at once, as one signal.',
    bars: 'Each frequency comes from one spot. Its bar shows how many tiny magnets are there.',
    brighter: "More tiny magnets, brighter spot. That's one row of your picture.",
    rows: 'Every row works the same way. Real scanners use many more spots, so the picture comes out sharp.',
    pattern: { question: 'Do you notice a pattern?', choices: ['Yes', 'Not yet'], after: 'Let me help you out.' },
  },
  stronger: 'Make the right side stronger',
  listen: 'Listen',
  makePicture: 'Make the picture',
  nextRow: 'Next row',
  pattern: ['Violin note → pure tones', 'Stage light → its full color spectrum', 'Proton frequencies → image'],
  name: ['All three come down to the same geometric math: the Fourier transform.', 'Joseph Fourier came up with it about 200 years ago.'],
  final: 'Here it is: the mathematical tool that lets us start seeing what hides inside.',
};
