// Every learner-facing line of the prototype, verbatim from docs/prototype_try_spec.md (checked by test/try.test.js).
// Nothing else on the page is learner-facing text, apart from accessibility labels.

export const COPY = {
  step1: ['You probably understand more about an MRI than you think.', 'Try this.'],
  start: 'Start',
  step2: 'Can you make the total disappear?',
  step3: { question: 'Can every piece still be there and the total become 0?', choices: ['Yes', 'No', 'Not sure'], after: "Let's find out." },
  zero: '0',
  step4: ['You got 0.', 'But did everything disappear?'],
  lookCloser: 'Look closer',
  step5: {
    question: 'The total is 0. What does that tell us?',
    options: ['Nothing is there', 'The parts can still be there', 'Every part must be 0'],
    intended: 'The parts can still be there',
    right: 'Exactly. They cancel.',
    wrong: 'Look again — the pieces are still there.',
  },
  step6: [
    'This same cancellation idea appears inside MRI physics. Tiny magnetic contributions can oppose one another even though the individual contributions are still there.',
    "You just uncovered one idea inside one of medicine's most complex machines.",
  ],
  step7: [
    "The meaning of 0 just changed, didn't it?",
    '0 can be the result of nonzero parts cancelling each other.',
    'If the answer is 0, what can the arrangement behind it still tell us?',
  ],
};
