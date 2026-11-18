// Every learner-facing line of Interactive 01, verbatim from docs/prototype_try_spec.md, Revision 2 (checked by
// test/try.test.js). Nothing else on the page is learner-facing text, apart from accessibility labels.

export const COPY = {
  opening: ['You know more about an MRI than you think.', 'Try this.'],
  start: 'Start',
  task: 'Can you make the total 0?',
  totalLabel: 'TOTAL',
  pairZero: '0',
  check1: { question: 'Can every piece still be here while the total is 0?', choices: ['Yes', 'No', 'Not sure'], after: "Let's see." },
  zero: '0',
  reached: ['You got 0.', 'But did everything disappear?'],
  lookCloser: 'Look closer',
  check2: {
    question: 'If the total is 0, are the pieces gone?',
    choices: ['Yes', 'No'],
    intended: 'No',
    right: 'Exactly. They cancelled.',
    wrong: "Look again — they're still there.",
  },
  arrangements: ['Same result.', 'Different arrangement.', 'Still 0.'],
  reveal: 'One result. Many possible arrangements behind it.',
  mri: ['This same basic idea appears in MRI: tiny magnetic contributions can cancel each other.', "You just understood one idea inside one of medicine's most complex machines."],
  final: 'To show that a result of 0 can come from nonzero parts cancelling each other, so 0 may contain hidden structure rather than mean “nothing.”',
};
