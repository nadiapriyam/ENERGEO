// The "Go deeper" page (try/deeper/), opened from the end of the final level: the research behind ENERGEO, for those
// who want to explore it more deeply (Nadia, 2026-11-25: "a snapshot of what we worked on with energeo before starting
// these interactives ... mathematically what energeo specifically is and the geometries associated with it, and a
// snapshot of some applications associated with what we talked about"). These are the page's own words, listed in
// docs/levels_spec.md for her review. Everything else on the page (the hypotheses in Nadia's words, every status, every
// proved result, open question and tested application, every number) is read from the research records
// (research/preview.json, research/hypotheses/, research/application_matrix.md); nothing here adds a status.

export const DEEPER = {
  kicker: 'ENERGEO Learn · Go deeper',
  title: 'The research behind ENERGEO',
  lede: 'For anyone who wants more than the story: what ENERGEO is, mathematically, the geometries the research works with, what has been proved and what is still open, and the applications tested so far. Every status here is taken from the project\'s research records.',
  back: '‹ Back to the levels',
  what: {
    title: 'What ENERGEO is, mathematically',
    lede: 'ENERGEO starts from a hypothesis of Nadia\'s, in three parts. Each is a target: the research looks for the mathematics that would realise it, and records only what is proved.',
    evidence: 'Her evidence, in her words',
    formula: 'The Fourier relation it starts from: a signal is the sum of its pure tones, and each tone\'s amount is an inner product.',
    method: 'How the research works',
    rules: ['Construct first.', 'Classify second.', 'Preserve the zero.', 'Investigate its geometry.', 'Known structures are examples, not the boundary of the search space.'],
    honest: 'Search as though the theorem is true. Report only what the evidence actually proves.',
    names: 'The research programme is called Geometry of Representation; ENERGEO is the name of the project and of its later energy application.',
  },
  path: {
    title: 'The geometries, step by step',
    lede: 'The questions that led from one mathematical relation to the next, in order, and the general structure that became visible along the way. Each step carries the status of what it holds.',
    spine: 'The structure that became visible',
  },
  proved: { title: 'What has been proved', lede: 'Six groups of results, each with its question and its exact equation, checked by the project\'s verifier.' },
  open: { title: 'What is still open', lede: 'The questions the research is still working on.' },
  apps: {
    title: 'Applications',
    known: 'In the levels: known applications of the same mathematics',
    knownList: [
      ['Sound', 'Tuners and spectrum analysers take a note apart into its pure tones with the Fourier transform.'],
      ['Light', 'A prism, and the spectrometers built on the same idea, take light apart into its colors.'],
      ['MRI', 'A scanner collects its signal as frequencies and turns it into a picture with the Fourier transform.'],
      ['Pictures and phones', 'JPEG images and Wi-Fi signals are stored and sent as sums of waves, using close relatives of the Fourier transform.'],
    ],
    tested: 'Tested in the research: does the same rule carry over unchanged?',
    testedLede: 'Each candidate pair of physical things was tested against one mathematical rule, applied unchanged: a real signal\'s frequencies come in mirror pairs, each the complex conjugate of the other. "Transfer depth" says how far the rule carried over. "Backbone support" is how directly and deeply the result supports the backbone of the theory; "AI slop / delusion risk" is how much of a claimed connection rests on interpretation or framing rather than on the mathematics.',
    columns: ['Candidate', 'Result', 'Transfer depth', 'Backbone support', 'AI slop / delusion risk'],
    energeo: 'ENERGEO\'s own application',
  },
  more: 'See every result, open question and number: the full research preview ›',
  contents: 'Contents',
  hypothesis: 'Hypothesis',
};
