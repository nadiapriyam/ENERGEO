// Every learner-facing line of Level 2, "Inside a note", verbatim from docs/level2_spec.md (checked by
// test/level2.test.js). Drafted at Nadia's request for her review. Nothing else on the page is learner-facing text,
// apart from accessibility labels.

export const COPY = {
  opening: 'Before a concert, the whole orchestra tunes to one note.',
  hearFork: 'Hear a tuning fork',
  hearViolin: 'Hear a violin',
  labels: { fork: 'tuning fork', violin: 'violin', mine: 'yours' },
  why: {
    question: 'Same note. So why do they sound so different?',
    choices: ['The violin is louder', 'It is a different note', 'Something else is mixed in'],
    after: "Let's find out.",
  },
  task1: 'Can your tuning fork match the violin?',
  strikeHint: 'Tap the fork to strike it.',
  differenceLabel: 'DIFFERENCE',
  percent: '%',
  zero: '0',
  oneFork: { question: 'Can one tuning fork ever match the violin?', choices: ['Yes', 'No', 'Not sure'], after: "Let's open the box." },
  task2: 'Can you match it now?',
  playViolin: 'Play violin',
  playMine: 'Play mine',
  reached: 'You got 0.',
  inside: { question: "So what's hiding inside one violin note?", choices: ['One pure tone', 'Several tones at once'], after: 'Look.' },
  takeaway: "A violin note isn't one pure tone like a tuning fork. It's a mix of many.",
  final: 'Just like the 0 in Level 1: one thing on the outside, many parts hiding inside.',
};
