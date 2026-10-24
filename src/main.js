import '@fontsource/atkinson-hyperlegible-next/latin-400.css';
import '@fontsource/atkinson-hyperlegible-next/latin-400-italic.css';
import '@fontsource/atkinson-hyperlegible-next/latin-600.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-400.css';
import './styles/app.css';

import { mountInteractive } from './core/frame.js';
import { createJourney } from './core/journey.js';
import coefficients from './interactives/coefficients/index.js';
import orthogonality from './interactives/orthogonality/index.js';

// The built interactives, in Master Map order. The hash names one and its stage (#coeff-2, #ortho-5); with no
// hash the path starts at the first. The journey is shared, so #8 picks up the signal that #7 leaves behind.
const BUILT = [coefficients, orthogonality];
const journey = createJourney();
const root = document.getElementById('app');
let mounted = null;
let current = null;

function route() {
  const prefix = location.hash.match(/^#([a-z]+)-\d+$/)?.[1];
  const def = BUILT.find((d) => d.hashPrefix === prefix) ?? mounted ?? BUILT[0];
  if (def === mounted) return;
  current?.destroy();
  mounted = def;
  current = mountInteractive(root, def, journey);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
