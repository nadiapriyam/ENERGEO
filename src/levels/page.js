// try/: both levels on one page (docs/levels_spec.md). Level 1, the violin, starts at once. When its last line is
// shown, a button offers Level 2, the MRI scanner, which then starts underneath.
import './base.css';
import { LEVELS } from './copyLevels.js';
import './note.js';

const tag = (id, text, note) => {
  const t = document.getElementById(id);
  t.textContent = text;
  if (note) t.append(Object.assign(document.createElement('span'), { className: 'level-note', textContent: note }));
};
tag('level-1-tag', LEVELS.level1, LEVELS.soundOn);
tag('level-2-tag', LEVELS.level2);

const next = document.getElementById('next-level');
next.textContent = LEVELS.next;
document.getElementById('note-lesson').addEventListener('level-finished', () => {
  next.hidden = false;
  requestAnimationFrame(() => next.classList.add('in'));
});
next.addEventListener('click', async () => {
  next.remove();
  const section = document.getElementById('level-2');
  section.hidden = false;
  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  await import('./mri.js');                                  // Level 2 builds itself, then the page brings it into view
  requestAnimationFrame(() => section.scrollIntoView({ behavior, block: 'start' }));
}, { once: true });
