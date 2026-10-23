import '@fontsource/atkinson-hyperlegible-next/latin-400.css';
import '@fontsource/atkinson-hyperlegible-next/latin-400-italic.css';
import '@fontsource/atkinson-hyperlegible-next/latin-600.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-400.css';
import './styles/app.css';

import { mountInteractive } from './core/frame.js';
import { createJourney } from './core/journey.js';
import orthogonality from './interactives/orthogonality/index.js';

// One interactive exists so far. The journey is shared, so the next interactive can pick up
// the objects this one leaves behind (the pair, the basis, the waves).
const journey = createJourney();
mountInteractive(document.getElementById('app'), orthogonality, journey);
