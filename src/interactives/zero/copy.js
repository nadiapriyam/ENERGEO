// Every learner-facing sentence of Chapter I, kept apart from the wiring so test/copy.test.js can check it:
//   · no structure is named for the set of configurations behind a zero (no kernel, fiber, manifold, orbit…);
//   · nothing explains a pattern before the stage's formalize phase (revealTerms);
//   · steps run in the discovery order observe → manipulate → detect → conjecture → test → formalize (DR-1).
// Wording is declarative. The research questions are quoted from Nadia (docs/restructure_decisions.md).

export const PHASES = ['observe', 'manipulate', 'detect', 'conjecture', 'test', 'formalize'];
export const PHASE_LABEL = { observe: 'Observe', manipulate: 'Manipulate', detect: 'Detect', conjecture: 'Conjecture', test: 'Test', formalize: 'Formalize' };

export const CHAPTER = {
  kicker: 'Chapter I',
  title: 'Changing the Meaning of 0',
  question: 'Each stage takes a measurement that reads 0. Each time, look at what produced the 0.',
};

export const STAGES = {
  1: {
    title: 'Two arrows, one reading',
    question: 'Two arrows, $v$ and $w$. The measurement adds them and reports one arrow, the resultant. Drag the tip of $w$ and watch the reading.',
    measurement: {
      equation: 'F(v, w) = v + w',
      symbols: [
        ['v,\\ w', 'two arrows in the plane; both tips can be dragged'],
        ['F(v, w)', 'the measurement: the resultant, drawn from the origin'],
        ['\\|v\\|,\\ \\|w\\|', 'the lengths of the two arrows'],
      ],
    },
    observations: {
      nonzero: 'Both arrows are nonzero.',
      zero: 'The resultant is 0.',
      breaks: 'Changing one arrow breaks the zero.',
      another: 'Another pair also gives 0.',
    },
    steps: [
      { phase: 'observe', prompt: 'Read the measurement before touching anything.', then: 'The resultant is zero. Both vectors are nonzero.' },
      { phase: 'manipulate', prompt: 'Drag the tip of $w$ anywhere.', then: 'The reading changes as soon as $w$ moves. Most places for $w$ give a resultant that is not 0.' },
      { phase: 'conjecture', prompt: 'Predict: leave $v$ alone, put $w$ where you expect the reading to return to 0, and press Commit prediction.', then: 'Your prediction is recorded with the reading it gave.' },
      { phase: 'test', prompt: 'Move $v$ somewhere new, then find a $w$ that gives 0 again.', then: 'Another pair reads 0. Each $v$ you tried needed its own $w$.' },
      { phase: 'formalize', prompt: 'The rule behind what you found.', then: 'One reading, 0, comes from a whole family of pairs of nonzero arrows.' },
    ],
    formal: {
      equation: 'v + w = 0 \\iff w = -v',
      lines: [
        'The resultant is zero. Both vectors are nonzero.',
        'Every nonzero $v$ has exactly one partner $w = -v$. So the reading 0 does not say which pair produced it.',
      ],
      statements: ['zero.pair', 'idea.hidden-family'],
    },
    notice: {
      changed: 'The two arrows.',
      held: 'The reading 0, for every pair $(v, -v)$.',
      visible: 'A zero reading can come from two nonzero objects.',
      hidden: 'Which pair produced the zero. The reading alone cannot say.',
    },
    revealTerms: ['−v', '= -v', '-v', 'opposite', 'partner'],
  },

  2: {
    title: 'Many contributions, zero total',
    question: 'Four contributions, each a direction and a length in space, and the one reading their total gives.',
    origin: 'This is the kind of zero the project began with: cancellation among proton contributions, a question that arose from MRI. The screen holds only the mathematics of the cancellation state: nonzero contributions and their total. Nothing here simulates a scanner.',
    measurement: {
      equation: 'F(m_1, \\dots, m_n) = \\sum_{j=1}^{n} m_j',
      symbols: [
        ['m_j', 'one contribution: a direction and a length. It has no position.'],
        ['\\sum_j m_j', 'the measurement: the total of all the contributions'],
        ['n', 'how many contributions there are (4 here)'],
      ],
    },
    observations: {
      nonzero: 'Every contribution is nonzero.',
      zero: 'The total is 0.',
      adjusts: 'When one contribution changes, the total stays 0 only because the marked contribution changes with it.',
      unequal: 'A configuration with unequal lengths also totals 0.',
      another: 'A configuration with different directions also totals 0.',
    },
    steps: [
      { phase: 'observe', prompt: 'Turn the view with a drag, and read the total.', then: 'The total is 0. No contribution is 0.' },
      { phase: 'manipulate', prompt: 'Pick a contribution and change its direction or length. The screen keeps the total at 0 by adjusting the contribution marked "adjusts".', then: 'The configuration changed. The reading did not.' },
      { phase: 'conjecture', prompt: 'Construct another configuration with the same reading, this time with unequal lengths.', then: 'Unequal lengths, the same zero.' },
      { phase: 'test', prompt: 'Press Another configuration and compare it with yours.', then: 'Different directions, different lengths, the same reading.' },
      { phase: 'formalize', prompt: 'The rule behind what you found.', then: 'One reading, 0, comes from many hidden configurations.' },
    ],
    formal: {
      equation: 'm_n = -(m_1 + \\dots + m_{n-1}) \\;\\Longrightarrow\\; \\sum_{j=1}^{n} m_j = 0',
      lines: [
        'The resultant is zero. No contribution is zero.',
        'Any $n - 1$ contributions fix the last one. So one reading, 0, comes from a whole family of hidden configurations.',
      ],
      statements: ['zero.ensemble', 'idea.hidden-family'],
    },
    questions: ['Q.cancellation-information'],
    notice: {
      changed: 'The directions and lengths of the contributions.',
      held: 'The reading: a total of 0.',
      visible: 'A zero total from contributions that are all nonzero.',
      hidden: 'Which configuration lies behind the zero. The reading is the same for all of them.',
    },
    revealTerms: ['−(m', '-(m', 'fix the last', 'n − 1', 'n - 1'],
  },

  '2b': {
    title: 'Same reading, different states',
    question: 'Two states, A and B, of a pair of spin-½ particles. The measurement is $S_z$, the total spin of the pair along one direction. At first you see each state only through that reading.',
    origin: 'A separate case. Stage 2’s cancellation is the MRI intuition that led to the project; this two-particle case is not a model of it, and the two are kept apart. Here the system is exactly two spin-½ particles, and every statement is exact quantum mechanics.',
    measurement: {
      equation: 'S_z = S_{z,1} + S_{z,2}',
      symbols: [
        ['S_z', 'the measurement: the total spin of the pair along one direction, in units of $\\hbar$'],
        ['A,\\ B', 'two states of the pair. What is inside them is hidden at first.'],
        ['|{\\uparrow\\downarrow}\\rangle', 'particle 1 up and particle 2 down; $|{\\downarrow\\uparrow}\\rangle$ is the reverse'],
      ],
    },
    observations: {
      szA: 'State A: $S_z \\to 0$.',
      szB: 'State B: $S_z \\to 0$.',
      inside: 'Inside, A and B have the same two terms with the same sizes. Only the sign between the terms differs.',
      s2: 'A second measurement, $S^2$, separates them: $2\\hbar^2$ for A and $0$ for B.',
    },
    steps: [
      { phase: 'observe', prompt: 'Measure $S_z$ on A and on B. Is this reading enough to conclude that A and B are the same state?', then: 'Both read 0. Equal readings, so this measurement alone cannot tell.' },
      { phase: 'manipulate', prompt: 'Press Look inside and compare the two states term by term.', then: 'The same two terms with the same sizes. Only the sign between them differs.' },
      { phase: 'conjecture', prompt: 'Predict: could another measurement tell A from B? Commit your prediction.', then: 'Your prediction is recorded.' },
      { phase: 'test', prompt: 'Measure a second observable, the total spin $S^2$, on both states.', then: '$S^2$ gives different values: a second measurement separates states that $S_z$ could not.' },
      { phase: 'formalize', prompt: 'The rule behind what you found.', then: 'One measurement returned zero for both states. The zero did not uniquely specify the state.' },
    ],
    formal: {
      equation: '\\begin{aligned} S_z|1,0\\rangle &= 0, & S^2|1,0\\rangle &= 2\\hbar^2\\,|1,0\\rangle\\\\ S_z|0,0\\rangle &= 0, & S^2|0,0\\rangle &= 0 \\end{aligned}',
      lines: [
        'A is the triplet state $|1,0\\rangle = \\tfrac{1}{\\sqrt2}\\big(|{\\uparrow\\downarrow}\\rangle + |{\\downarrow\\uparrow}\\rangle\\big)$. B is the singlet state $|0,0\\rangle = \\tfrac{1}{\\sqrt2}\\big(|{\\uparrow\\downarrow}\\rangle - |{\\downarrow\\uparrow}\\rangle\\big)$.',
        'One measurement returned zero for both states. The zero did not uniquely specify the state.',
      ],
      statements: ['quantum.sz-zero', 'zero.not-identifying'],
    },
    questions: ['Q.zero-distinguishable'],
    notice: {
      changed: 'Which state was measured, and then which measurement.',
      held: 'The $S_z$ reading: 0 for both states.',
      visible: 'A second measurement, $S^2$, separates states that $S_z$ could not.',
      hidden: 'The sign between the two terms. $S_z$ does not see it.',
    },
    revealTerms: ['triplet', 'singlet', '|1,0', '|0,0', '|1, 0', '|0, 0'],
  },

  3: {
    title: 'A zero that marks a place',
    question: 'Masses at points in the plane, and a point $R$ you can move. The measurement weighs each mass by its displacement from $R$ and adds.',
    measurement: {
      equation: 'F(R) = \\sum_{i} m_i\\,(r_i - R)',
      symbols: [
        ['m_i', 'a positive mass; drag it to move it. Its disc area shows its size.'],
        ['r_i', 'where mass $i$ sits'],
        ['R', 'a candidate origin; drag it'],
        ['m_i\\,(r_i - R)', 'mass $i$’s weighted displacement, drawn from $R$'],
        ['F(R)', 'the measurement: the resultant of the weighted displacements'],
      ],
    },
    observations: {
      positive: 'Every mass is positive, so the total mass is not 0.',
      moves: 'The reading changes as $R$ moves.',
      points: 'From every $R$ tried, the resultant points toward the same place.',
      zero: 'At one place the reading is 0.',
      again: 'After the masses change, the zero is at a new place.',
      shifted: 'Shifting every mass together carries the zero with them.',
    },
    steps: [
      { phase: 'observe', prompt: 'Drag $R$ and watch the weighted displacements and their resultant.', then: 'The reading depends on where $R$ is.' },
      { phase: 'detect', prompt: 'Keep moving $R$ to different places. Where does the resultant point?', then: 'From every $R$ you tried, it points toward one place.' },
      { phase: 'conjecture', prompt: 'Predict the place where the reading is 0: press Place prediction, then tap the plane.', then: 'Your prediction is on the plane.' },
      { phase: 'test', prompt: 'Move $R$ to your prediction and read it. Then change a mass, or press Shift every mass, and find the zero again.', then: 'One zero for each configuration. It moves when the masses change.' },
      { phase: 'formalize', prompt: 'The rule behind what you found.', then: 'The zero does not mean no mass. It marks a place.' },
    ],
    formal: {
      equation: 'F(R) = M\\,(R_{\\mathrm{CM}} - R),\\qquad R_{\\mathrm{CM}} = \\frac{\\sum_i m_i r_i}{M},\\qquad M = \\sum_i m_i > 0',
      lines: [
        'The resultant is zero at $R_{\\mathrm{CM}}$ and nowhere else. The masses are not zero: the zero marks a distinguished balancing location.',
        'Shifting every mass by the same step moves $R_{\\mathrm{CM}}$ by that step.',
      ],
      statements: ['zero.first-moment', 'zero.cm-shift'],
    },
    questions: ['Q.pairA'],
    notice: {
      changed: '$R$, and the masses and their places.',
      held: 'The rule: weigh each displacement by its mass, then add.',
      visible: 'A zero that identifies a structural property of the system: one balancing location.',
      hidden: 'The individual masses. Many configurations share the same balancing location.',
    },
    revealTerms: ['R_{\\mathrm{CM}}', 'R_CM', 'centre of mass', 'center of mass', 'M\\,(R', 'M(R', '\\sum_i m_i r_i'],
  },

  '3b': {
    title: 'Return to the zero',
    question: 'We began with a zero we did not understand. We studied another zero whose hidden structure is known. What questions can we now bring back to the first zero?',
    measurement: {
      equation: 'F(m_1, \\dots, m_n) = \\sum_{j=1}^{n} m_j',
      symbols: [
        ['m_j', 'your contributions from stage 2: directions and lengths, no positions'],
        ['\\sum_j m_j', 'the measurement: the total'],
      ],
    },
    observations: {
      same: 'Your stage 2 configuration still totals 0.',
      twist: 'Turning two contributions together keeps the total 0, though both of them change.',
      collected: 'Several collected configurations, different underneath, all total 0.',
      keeps: 'Some changes keep the total at 0.',
      leaves: 'Some changes would leave 0. They are shown as previews and not applied.',
    },
    steps: [
      { phase: 'observe', prompt: 'This is the configuration you built in stage 2. Read its total.', then: 'The same zero as before.' },
      { phase: 'manipulate', prompt: 'Move through configurations that keep the total at 0: turn a pair together, or change one contribution while the marked one adjusts. Press Collect to keep each one.', then: 'Several hidden configurations, one reading.' },
      { phase: 'conjecture', prompt: 'Choose a change below. Before applying it, commit a prediction: will the total stay 0?', then: 'Prediction committed.' },
      { phase: 'test', prompt: 'Apply it. Repeat until you have seen a change that keeps the zero and one that would not.', then: 'Some changes keep the zero and some would not. Which ones, and why, is TQ-5. No rule is given here.' },
    ],
    changes: {
      turnAll: 'Turn every contribution the same way',
      scaleAll: 'Lengthen every contribution 1.5 times',
      reverseAll: 'Reverse every contribution',
      swap: 'Swap two contributions',
      turnOne: 'Turn one contribution only',
      scaleOne: 'Lengthen one contribution only',
    },
    ladder: {
      title: 'Three observations from this chapter',
      intro: 'Of increasing strength, and kept separate: they are not one theorem, and the mass zero and the spin zero are not claimed to share a physical mechanism.',
      items: [
        { title: 'A. Vector cancellation', equation: '\\sum_i v_i = 0', text: 'Many nonzero configurations can map to one zero resultant.', question: 'What configurations produce the zero?' },
        { title: 'B. Mass balance', equation: '\\sum_i m_i\\,(r_i - R_{\\mathrm{CM}}) = 0', text: 'A zero additionally identifies a distinguished structural feature.', question: 'What structural property does the zero constrain?' },
        { title: 'C. Quantum zero', equation: 'S_z = 0', text: 'Two different states can give the same zero result for one observable while differing under another observable.', question: 'What information is invisible to this measurement but visible to another relation?' },
      ],
    },
    transferIntro: 'Each is a research prompt, not a finding: the proton zero is not assumed to have a balancing point, a position, or anything else the mass system has.',
    questions: ['Q.zero-inference', 'Q.zero-generators', 'Q.cancellation-information', 'Q.zero-distinguishable'],
    notice: {
      changed: 'The hidden configuration.',
      held: 'The reading: 0.',
      visible: 'Many configurations behind one zero, and changes that keep it.',
      hidden: 'What, if anything, the zero itself determines about the configuration. TQ-1 to TQ-6 ask it.',
    },
    revealTerms: [],
  },
};

/** Phrases the project's copy rule excludes (restructuring brief §16). */
export const BANNED_PHRASES = ["let's explore", 'imagine', 'fascinating', 'at its core', 'think of it', 'everything is connected'];
/** Structure names not used for the zero-producing configuration set in learner copy (rev 3). */
export const BANNED_STRUCTURE_TERMS = ['kernel', 'fiber', 'fibre', 'manifold', 'equivalence class', 'null space', 'orbit', 'orthogonal', 'projection'];
