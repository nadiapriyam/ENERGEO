// try/: the levels on one page (docs/levels_spec.md), laid out like a magazine. Each level opens with a cover: its
// name, its headline and the question it asks. Level 1, the violin, starts at once. When a level's last line is shown,
// an "Up next" card offers the next one, its headline and question carrying the thought on, and the level then starts
// underneath: Level 2, the MRI scanner; the final level, a prism for sound. Each level plays on one board, its lines clearing between parts. "Scroll through", on the side, shows the
// whole story as a comic, to see it quickly without playing it.
import './base.css';
import { LEVELS } from './copyLevels.js';
import { jumpTo } from './jump.js';
import { storyBar } from './reader.js';
import { readingTime } from '../math/reading.js';

const span = (className, textContent) => Object.assign(document.createElement('span'), { className, textContent });
/** Each level's cover: its name, then its headline and the question it asks (and, where it needs sound, a note). */
const COVERS = {
  'level-1': [LEVELS.level1, LEVELS.title1, LEVELS.dek1, LEVELS.soundOn],
  'level-2': [LEVELS.level2, LEVELS.title2, LEVELS.dek2],
  'level-3': [LEVELS.level3, LEVELS.title3, LEVELS.dek3, LEVELS.soundOn],
};
for (const [id, [name, title, dek, note]] of Object.entries(COVERS)) {   // the name (and the sound note) on one line
  const t = document.getElementById(`${id}-tag`);
  t.replaceChildren(span('level-kicker', name), ...(note ? [span('level-note', note)] : []), span('level-title', title), span('level-dek', dek));
}
const query = new URLSearchParams(location.search);

// Each level opens with an intro scene (Nadia, 2026-11-24: "when introducting each level including level one, add
// introduction scenes where it displays the title and the sub title of each level before the user sees the start of the
// level"): a title card over the level's screen, on the boards' #172B3A, with the level's name, its title, its
// question and (where it needs sound) the sound note. It moves on by itself once it has been read, or at a tap or a
// key; then the level starts. Not while recording the comic, in a review frame, fast-forwarding or going to a scene.
const noIntro = ['record', 'step', 'from', 'steps'].some((k) => query.has(k)) || !!jumpTo;
const REDUCED_PAGE = matchMedia('(prefers-reduced-motion: reduce)').matches;
let firstIntro = true;                                       // the first title slide says how to skip (Space, or a tap)
function intro(section) {
  if (noIntro) return Promise.resolve();
  const level = document.getElementById(section);
  const [name, title, dek, note] = COVERS[section];
  const card = Object.assign(document.createElement('button'), { type: 'button', className: 'level-intro' });
  card.setAttribute('aria-label', [name, title, dek, note].filter(Boolean).join('. '));
  card.append(span('intro-kicker', name), span('intro-title', title), span('intro-rule', ''), span('intro-dek', dek), ...(note ? [span('intro-note', note)] : []));
  if (firstIntro) {                                          // "Press space to skip" (a touch screen: "Tap to skip")
    const [before, after] = LEVELS.skipKey.split('space');
    const key = span('intro-skip-key', before);
    key.append(Object.assign(document.createElement('kbd'), { textContent: 'space' }), after);
    const hint = span('intro-skip', '');
    hint.append(key, span('intro-skip-tap', LEVELS.skipTap));
    card.append(hint);
  }
  firstIntro = false;
  level.append(card);
  requestAnimationFrame(() => card.classList.add('in'));
  const stay = Math.min(7000, Math.max(3500, readingTime([title, dek, note].filter(Boolean).join(' ')) + 1500));
  return new Promise((resolve) => {
    let gone = false;
    const go = () => {
      if (gone) return;
      gone = true;
      clearTimeout(timer);
      removeEventListener('keydown', key, true);
      card.classList.add('out');                             // the card lifts away as the level begins under it
      setTimeout(() => card.remove(), REDUCED_PAGE ? 0 : 750);
      resolve();
    };
    const key = (e) => { if (['Enter', ' ', 'ArrowRight'].includes(e.key)) { e.preventDefault(); go(); } };
    const timer = setTimeout(go, stay);
    card.addEventListener('click', go);
    addEventListener('keydown', key, true);
  });
}

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
    document.getElementById(from).querySelector('.reader-column')?.append(card);   // under the level's words, on its screen
    card.hidden = false;
    next.hidden = false;
    requestAnimationFrame(() => { card.classList.add('in'); next.classList.add('in'); });
  }, { once: true });
  next.addEventListener('click', async () => {
    card.remove();
    const s = document.getElementById(section);
    s.hidden = false;
    requestAnimationFrame(() => s.scrollIntoView({ behavior, block: 'start' }));   // the page brings the level into view …
    await intro(section);                                    // … its intro scene plays …
    await load();                                            // … and then the level builds itself and starts
  }, { once: true });
}
chain('note-lesson', 'next-level', LEVELS.next, 'level-2', () => import('./mri.js'));
chain('mri-lesson', 'next-level-3', LEVELS.next3, 'level-3', () => import('./prism.js'));

/**
 * When the final level ends, "Go deeper" appears under its last line, like an "Up next" card: for those who want to
 * explore more deeply, it opens the research behind ENERGEO (try/deeper/: what ENERGEO is mathematically, its
 * geometries, what is proved and open, and the applications tested, laid out from the research records). Nadia
 * (2026-11-25): "a snapshot ... that we can put on the last slide for those who want to explore more deeply".
 */
function goDeeper(from) {
  const open = Object.assign(document.createElement('a'), { className: 'action next-level', href: 'deeper/', textContent: LEVELS.deeperOpen });
  const card = Object.assign(document.createElement('div'), { className: 'up-next go-deeper', hidden: true });
  card.append(span('up-next-kicker', LEVELS.deeperKicker), span('up-next-title', LEVELS.deeperTitle), span('up-next-dek', LEVELS.deeperDek), open);
  document.getElementById(from).addEventListener('level-finished', () => {
    const column = document.getElementById(from).querySelector('.reader-column');
    column?.append(card);                                    // under the final level's words …
    card.hidden = false;
    const words = column?.querySelector(':scope > .prompt');
    requestAnimationFrame(() => { card.classList.add('in'); open.classList.add('in'); words?.scrollTo({ top: words.scrollHeight }); });   // … its last line still in view
  }, { once: true });
}
goDeeper('prism-lesson');

// Opening one level on its own, for review: try/#level-2 or try/#level-3 skips straight to it. try/?steps shows every
// step of Level 3 side by side.
const review = query.has('step') || query.has('from');     // a Level 3 step (no #anchor, so a frame never scrolls the page around it)
const scene = jumpTo && jumpTo.level !== 'level-1' ? `#${jumpTo.level}` : null;   // a scene from Scroll through (jump.js)
const direct = { '#level-2': ['level-2', () => import('./mri.js')], '#level-3': ['level-3', () => import('./prism.js')] }[review ? '#level-3' : scene ?? (jumpTo ? '' : location.hash)];
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
  if (!review && !document.documentElement.classList.contains('framed')) storyBar();
  intro(direct[0]).then(direct[1]);
} else {
  storyBar();                                                 // the bar first, so the page does not shift when Level 1 starts
  intro('level-1').then(() => {
    import('./note.js');                                        // Level 1 starts the page
  });
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
    const [{ COMIC, pictures }, { face }, { bigIdea }] = await Promise.all([import('./comic.js'), import('./characters.js'), import('./magazine.js')]);
    const names = { 'level-1': LEVELS.level1, 'level-2': LEVELS.level2, 'level-3': LEVELS.level3 };
    for (const level of COMIC.levels) {
      const group = make('section', { className: 'side-level' }, make('h3', { className: 'side-level-name', textContent: names[level.id] }));
      for (const part of level.parts) {
        const box = (n) => { n.classList.add('in'); return n; };
        const words = make('div', { className: 'comic-words' }, ...part.words.map((w) => (w.kind === 'speaker'
          ? make('div', { className: `speaker ${w.who} in` }, make('div', { className: 'who' }, face(w.who)),
            make('div', { className: 'bubbles' }, ...w.bubbles.map((b) => make('p', { className: `bubble in${b.thought ? ' thought' : ''}`, textContent: b.text }))))
          : w.cls.includes('big-idea') ? box(bigIdea(w.text))
            : make('p', { className: ['line', 'in', ...w.cls].join(' '), textContent: w.text }))));
        const img = make('img', { src: pictures[part.img], width: part.w, height: part.h, alt: part.alt, loading: 'lazy', decoding: 'async' });
        const go = Number.isInteger(part.start)                // tap a picture: the main display goes to that scene (jump.js)
          ? make('a', { className: 'comic-go', href: `?jump=${level.id}.${part.start}` }, img, make('span', { className: 'comic-go-tag', textContent: `${LEVELS.goHere} ›` }))
          : img;
        group.append(make('figure', { className: 'comic-part' }, go, words));
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
