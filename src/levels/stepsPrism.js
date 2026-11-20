// The named steps of Level 3, in order: the review strip (try/?steps) shows each one, frozen, and "Play from here"
// starts the level at it (docs/levels_spec.md, Revision 10). The level calls step(id) at each of these moments, and
// test/prism.test.js checks that every id here is reached in this order. The titles are for review, not learner copy.

export const STEPS = [
  { id: 'hall', title: 'The hall: the lights dim' },
  { id: 'aim', title: 'Aim the light at the chandelier' },
  { id: 'rainbow', title: 'The glass takes the light apart' },
  { id: 'colors', title: 'Where did the colours come from?' },
  { id: 'thought', title: 'A tool for sound? Your tuner' },
  { id: 'tuner', title: 'Play your A note' },
  { id: 'signal', title: 'The signal on the tuner' },
  { id: 'hidden', title: 'Four notes hide in this signal' },
  { id: 'apart', title: 'Take it apart' },
  { id: 'bars', title: 'Four pure tones' },
  { id: 'fork', title: 'A tuning fork' },
  { id: 'back', title: 'Every bump, a different pure tone' },
  { id: 'break', title: 'The break: the radiologist comes over' },
  { id: 'talk', title: 'The MRI scanner works the same way' },
  { id: 'brain', title: 'Tap a part of the brain' },
  { id: 'skull', title: 'Now tap the skull' },
  { id: 'behaves', title: 'Each body part behaves differently' },
  { id: 'collect', title: 'Collecting that data' },
  { id: 'picture', title: 'Pixel data: an MRI picture' },
  { id: 'pattern', title: 'Do you notice a pattern?' },
  { id: 'slide1', title: 'Violin note → pure tones' },
  { id: 'slide2', title: 'Stage light → its full color spectrum' },
  { id: 'slide3', title: 'MRI image → proton frequencies' },
  { id: 'together', title: 'All three' },
  { id: 'reveal', title: 'The grand reveal' },
  { id: 'end', title: 'The applications are endless' },
];
