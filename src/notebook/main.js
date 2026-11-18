// Nadia's Inventions Notebook (docs/notebook_spec.md): a cover, a tab per level, and one paper page per level. A level
// is mounted the first time its page opens (its module builds into the page's lesson container and starts its story).
// Level 1 is the MRI story; Level 2 is the sound story; Level 3 is a locked tab. Page turns are the only navigation.
import '@fontsource/caveat/600.css';
import '@fontsource/caveat/700.css';
import './notebook.css';
import { NOTEBOOK } from './copyNotebook.js';

const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  e.append(...kids);
  return e;
};

const app = document.getElementById('notebook');
const [L1, L2, L3] = NOTEBOOK.levels;

// tabs, like index tabs sticking out of the notebook's edge
const tabs = el('nav', { class: 'tabs', 'aria-label': 'Pages' });
const tab = (key, level, extra = {}) => {
  const t = el('a', { class: `tab tab-${key}`, href: `#${key}`, text: level.tab, ...extra });
  tabs.append(t);
  return t;
};
const tab1 = tab('level-1', L1);
const tab2 = tab('level-2', L2);
const tab3 = el('span', { class: 'tab tab-level-3 locked', 'aria-disabled': 'true', title: L3.locked, text: L3.tab });
tabs.append(tab3);

// the cover
const cover = el('section', { class: 'page cover', id: 'cover', 'aria-label': NOTEBOOK.title, hidden: '' },
  el('div', { class: 'cover-inner' },
    el('h1', { class: 'cover-title', text: NOTEBOOK.title }),
    el('ol', { class: 'cover-list' },
      el('li', {}, el('span', { class: 'cover-level', text: L1.tab }), el('span', { class: 'cover-name', text: L1.title })),
      el('li', {}, el('span', { class: 'cover-level', text: L2.tab }), el('span', { class: 'cover-name', text: L2.title })),
      el('li', { class: 'locked' }, el('span', { class: 'cover-level', text: L3.tab }), el('span', { class: 'cover-name', text: L3.title }))),
    el('a', { class: 'action in open', href: '#level-1', text: NOTEBOOK.open })));

// a paper page per level
const levelPage = (n, level) => {
  const turn = el('a', { class: 'turn', href: `#level-${n + 1}`, hidden: '', text: NOTEBOOK.turnPage });
  const head = el('header', { class: 'page-head' }, el('span', { class: 'page-level', text: level.tab }), el('h2', { class: 'page-title', text: level.title }));
  if (level.note) head.append(el('p', { class: 'page-note', text: level.note }));
  return el('section', { class: `page level-${n}`, id: `page-level-${n}`, hidden: '' }, head,
    el('div', { class: 'lesson', id: `level-${n}-lesson` }), el('footer', { class: 'page-foot' }, turn));
};
const page1 = levelPage(1, L1);
const page2 = levelPage(2, L2);
page2.querySelector('.turn').remove();                      // Level 3 is not written yet
app.append(tabs, cover, page1, page2);

page1.addEventListener('level-finished', () => {           // Level 1's last line is shown: offer the next page
  const t = page1.querySelector('.turn');
  t.hidden = false;
  requestAnimationFrame(() => t.classList.add('in'));
});

const pages = { cover, 'level-1': page1, 'level-2': page2 };
const mounted = new Set();
const mount = { 'level-1': () => import('./level1.js'), 'level-2': () => import('./level2.js') };
let current = null;

function show(key) {
  const next = pages[key] ?? cover;
  const name = pages[key] ? key : 'cover';
  if (next === current) return;
  const prev = current;
  current = next;
  for (const [k, t] of [['level-1', tab1], ['level-2', tab2]]) {
    if (k === name) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
  }
  const open = () => {
    next.hidden = false;
    if (!REDUCED) { next.classList.add('flip-in'); next.addEventListener('animationend', () => next.classList.remove('flip-in'), { once: true }); }
    if (mount[name] && !mounted.has(name)) { mounted.add(name); mount[name](); }
    window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
  };
  if (prev && !REDUCED) {                                   // the old page turns over like paper
    prev.classList.add('flip-out');
    prev.addEventListener('animationend', () => { prev.hidden = true; prev.classList.remove('flip-out'); open(); }, { once: true });
  } else {
    if (prev) prev.hidden = true;
    open();
  }
}

addEventListener('hashchange', () => show(location.hash.slice(1)));
show(location.hash.slice(1));
