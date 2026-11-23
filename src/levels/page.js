// try/: the levels on one page (docs/levels_spec.md), laid out like a magazine. Each level opens with a cover: its
// name, its headline and the question it asks. Level 1, the violin, starts at once. When a level's last line is shown,
// an "Up next" card offers the next one, its headline and question carrying the thought on, and the level then starts
// underneath: Level 2, the MRI scanner; the final level, a prism for sound. Each level plays on one board, its lines clearing between parts. "Scroll through", on the side, shows the
// whole story as a comic, to see it quickly without playing it.
import './base.css';
import { LEVELS } from './copyLevels.js';

const span = (className, textContent) => Object.assign(document.createElement('span'), { className, textContent });
/** Each level's cover: its name, then its headline and the question it asks (and, where it needs sound, a note). */
const COVERS = {
  'level-1': [LEVELS.level1, LEVELS.title1, LEVELS.dek1, LEVELS.soundOn],
  'level-2': [LEVELS.level2, LEVELS.title2, LEVELS.dek2],
  'level-3': [LEVELS.level3, LEVELS.title3, LEVELS.dek3, LEVELS.soundOn],
};
for (const [id, [name, title, dek, note]] of Object.entries(COVERS)) {
  const t = document.getElementById(`${id}-tag`);
  t.textContent = name;
  t.append(span('level-title', title), span('level-dek', dek));
  if (note) t.append(span('level-note', note));
}
const query = new URLSearchParams(location.search);

const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
/**
 * When the level in `from` ends, the "Up next" card appears, with the next level's name, headline and question, and
 * the button `buttonId`; pressing it opens `section` and starts its module.
 */
function chain(from, buttonId, text, section, load) {
  const next = document.getElementById(buttonId);
  next.textContent = text;
  const [name, title, dek] = COVERS[section];
  const card = Object.assign(document.createElement('div'), { className: 'up-next', hidden: true });
  next.before(card);
  card.append(span('up-next-kicker', `${LEVELS.upNext} · ${name}`), span('up-next-title', title), span('up-next-dek', dek), next);
  document.getElementById(from).addEventListener('level-finished', () => {
    card.hidden = false;
    next.hidden = false;
    requestAnimationFrame(() => { card.classList.add('in'); next.classList.add('in'); });
  }, { once: true });
  next.addEventListener('click', async () => {
    card.remove();
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
const dropLevel1 = () => document.getElementById('level-1')?.remove();
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

// Scroll through, on the side: a tab at the right edge opens the whole story as a comic, from the first part of Level 1
// to the end of Level 3, so it can be seen quickly without playing it. Each part is a picture of the board and its
// lines, as recorded from the levels themselves (tools/record_comic.mjs → src/levels/comic/). Not in a frame of the
// review strip, nor on the strip itself.
if (!query.has('step') && !query.has('steps')) {
  const html = document.documentElement;
  const make = (tag, attrs, ...kids) => { const e = Object.assign(document.createElement(tag), attrs); e.append(...kids); return e; };
  const close = make('button', { type: 'button', className: 'side-close', textContent: LEVELS.close });
  const parts = make('div', { className: 'side-parts' });
  const panel = make('aside', { className: 'side', id: 'side-panel', inert: true }, make('div', { className: 'side-head' }, make('h2', { textContent: LEVELS.wholeStory }), close), parts);
  panel.setAttribute('aria-label', LEVELS.wholeStory);
  const tab = make('button', { type: 'button', className: 'side-toggle', textContent: LEVELS.scrollThrough });
  tab.setAttribute('aria-controls', 'side-panel');
  tab.setAttribute('aria-expanded', 'false');
  let filled = false;
  const fill = async () => {                                   // the comic is drawn the first time the panel opens
    filled = true;
    const [{ COMIC, pictures }, { face }, { fact, bigIdea }] = await Promise.all([import('./comic.js'), import('./characters.js'), import('./magazine.js')]);
    const names = { 'level-1': LEVELS.level1, 'level-2': LEVELS.level2, 'level-3': LEVELS.level3 };
    for (const level of COMIC.levels) {
      const group = make('section', { className: 'side-level' }, make('h3', { className: 'side-level-name', textContent: names[level.id] }));
      for (const part of level.parts) {
        const box = (n) => { n.classList.add('in'); return n; };
        const words = make('div', { className: 'comic-words' }, ...part.words.map((w) => (w.kind === 'speaker'
          ? make('div', { className: `speaker ${w.who} in` }, make('div', { className: 'who' }, face(w.who)),
            make('div', { className: 'bubbles' }, ...w.bubbles.map((b) => make('p', { className: `bubble in${b.thought ? ' thought' : ''}`, textContent: b.text }))))
          : w.kind === 'fact' ? box(fact(w.text))
            : w.cls.includes('big-idea') ? box(bigIdea(w.text))
              : make('p', { className: ['line', 'in', ...w.cls].join(' '), textContent: w.text }))));
        group.append(make('figure', { className: 'comic-part' },
          make('img', { src: pictures[part.img], width: part.w, height: part.h, alt: part.alt, loading: 'lazy', decoding: 'async' }), words));
      }
      parts.append(group);
    }
  };
  const open = (on) => {
    html.classList.toggle('side-open', on);
    panel.inert = !on;
    tab.setAttribute('aria-expanded', String(on));
    if (on && !filled) fill();
    if (on) close.focus({ preventScroll: true });
  };
  tab.addEventListener('click', () => open(!html.classList.contains('side-open')));
  close.addEventListener('click', () => { open(false); tab.focus({ preventScroll: true }); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && html.classList.contains('side-open')) { open(false); tab.focus({ preventScroll: true }); } });
  document.body.append(tab, panel);
}
