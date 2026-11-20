// try/: the levels on one page (docs/levels_spec.md). Level 1, the violin, starts at once. When a level's last line is
// shown, a button offers the next one, which then starts underneath: Level 2, the MRI scanner; Level 3, a prism
// for sound.
import './base.css';
import { LEVELS } from './copyLevels.js';

const tag = (id, text, note) => {
  const t = document.getElementById(id);
  t.textContent = text;
  if (note) t.append(Object.assign(document.createElement('span'), { className: 'level-note', textContent: note }));
};
tag('level-1-tag', LEVELS.level1, LEVELS.soundOn);
tag('level-2-tag', LEVELS.level2);
tag('level-3-tag', LEVELS.level3, LEVELS.soundOn);
const query = new URLSearchParams(location.search);
if (!query.has('step')) {                                    // the review strip: every step of Level 3, without playing it
  const a = Object.assign(document.createElement('a'), { className: 'level-steps', href: './?steps', textContent: LEVELS.allSteps });
  document.getElementById('level-3-tag').append(a);
}

const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
/** When the level in `from` ends, the button `buttonId` appears; pressing it opens `section` and starts its module. */
function chain(from, buttonId, text, section, load) {
  const next = document.getElementById(buttonId);
  next.textContent = text;
  document.getElementById(from).addEventListener('level-finished', () => {
    next.hidden = false;
    requestAnimationFrame(() => next.classList.add('in'));
  }, { once: true });
  next.addEventListener('click', async () => {
    next.remove();
    const s = document.getElementById(section);
    s.hidden = false;
    await load();                                            // the level builds itself, then the page brings it into view
    requestAnimationFrame(() => s.scrollIntoView({ behavior, block: 'start' }));
  }, { once: true });
}
chain('note-lesson', 'next-level', LEVELS.next, 'level-2', () => import('./mri.js'));
chain('mri-lesson', 'next-level-3', LEVELS.next3, 'level-3', () => import('./prism.js'));

// Opening one level on its own, for review: try/#level-2 or try/#level-3 skips straight to it. try/?steps shows every
// step of Level 3 side by side.
const review = query.has('step') || query.has('from');     // a Level 3 step (no #anchor, so a frame never scrolls the page around it)
const direct = { '#level-2': ['level-2', () => import('./mri.js')], '#level-3': ['level-3', () => import('./prism.js')] }[review ? '#level-3' : location.hash];
const dropLevel1 = () => {
  document.getElementById('next-level')?.parentElement.remove();
  for (const id of ['level-1-tag', 'note-lesson']) document.getElementById(id)?.remove();
};
if (query.has('step')) document.documentElement.classList.add('framed');   // one frame of the review strip
if (query.has('steps')) {
  dropLevel1();
  for (const id of ['level-2', 'level-3']) document.getElementById(id)?.remove();
  import('./storyboard.js');
} else if (direct) {
  dropLevel1();
  for (const id of ['level-2', 'level-3']) if (id !== direct[0]) document.getElementById(id).hidden = true;
  document.getElementById(direct[0]).hidden = false;
  direct[1]();
} else {
  import('./note.js');                                        // Level 1 starts the page
}
