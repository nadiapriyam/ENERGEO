import '@fontsource/atkinson-hyperlegible-next/latin-400.css';
import '@fontsource/atkinson-hyperlegible-next/latin-400-italic.css';
import '@fontsource/atkinson-hyperlegible-next/latin-600.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-400.css';
import './styles/app.css';

import { mountInteractive } from './core/frame.js';
import { createJourney } from './core/journey.js';
import chapterOne from './interactives/zero/index.js';
import coefficients from './interactives/coefficients/index.js';
import orthogonality from './interactives/orthogonality/index.js';

// The built interactives. Chapter I opens the journey; its stages are numbered globally (#s1, #s2, #s3, #s3b).
// Fourier Coefficients (#coeff-n) and Orthogonality and Zero (#ortho-n) keep their links until the restructure reaches
// Acts III–IV. With no hash the journey starts at Chapter I. The journey store is shared across all of them.
const BUILT = [chapterOne, coefficients, orthogonality];
const journey = createJourney();
const root = document.getElementById('app');
let mounted = null;
let current = null;

function route() {
  const prefix = /^#s\w+$/.test(location.hash) ? 's' : location.hash.match(/^#([a-z]+)-\d+$/)?.[1];
  const def = BUILT.find((d) => d.hashPrefix === prefix) ?? mounted ?? BUILT[0];
  if (def === mounted) return;
  current?.destroy();
  mounted = def;
  current = mountInteractive(root, def, journey);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
