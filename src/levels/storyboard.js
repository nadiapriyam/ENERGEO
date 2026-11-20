// The review strip (try/?steps): every named step of Level 3, left to right, each frame the level itself stopped at
// that step (try/?step=<id>), with "Play from here" (try/?from=<id>) to fast-forward to it and play on.
// For going back and forth without playing the interactions. The steps are listed in stepsPrism.js.
import './storyboard.css';
import { LEVELS } from './copyLevels.js';
import { STEPS } from './stepsPrism.js';

const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  e.append(...kids);
  return e;
};

const frames = el('div', { class: 'frames', tabindex: '0', 'aria-label': LEVELS.steps });
STEPS.forEach((s, n) => {
  frames.append(el('figure', { class: 'frame', id: `step-${s.id}` },
    el('figcaption', {}, el('span', { class: 'frame-number', text: `${n + 1}` }), el('span', { class: 'frame-title', text: s.title })),
    el('iframe', { src: `./?step=${s.id}`, loading: n < 3 ? 'eager' : 'lazy', title: s.title }),
    el('a', { class: 'action play-from in', href: `./?from=${s.id}`, text: LEVELS.playFrom })));
});
const count = el('span', { class: 'count' });
const prev = el('button', { type: 'button', class: 'choice', 'aria-label': 'Previous step', text: '←' });
const next = el('button', { type: 'button', class: 'choice', 'aria-label': 'Next step', text: '→' });
const width = () => frames.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(frames).columnGap || '0');
const at = () => Math.round(frames.scrollLeft / width());
let index = 0;                                              // the step the strip is going to (arrows move it one at a time, however fast)
const show = () => { count.textContent = `${index + 1} / ${STEPS.length}`; };
const go = (d) => {
  index = Math.max(0, Math.min(STEPS.length - 1, index + d));
  frames.scrollTo({ left: index * width(), behavior: 'smooth' });
  show();
};
prev.addEventListener('click', () => go(-1));
next.addEventListener('click', () => go(1));
let settle = null;
frames.addEventListener('scroll', () => { clearTimeout(settle); settle = setTimeout(() => { index = at(); show(); }, 160); }, { passive: true });
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
});

document.body.append(el('main', { class: 'storyboard' },
  el('header', { class: 'storyboard-head' },
    el('h1', { text: LEVELS.steps }),
    el('p', { class: 'storyboard-hint', text: LEVELS.stepsHint }),
    el('nav', { class: 'storyboard-nav' }, prev, count, next, el('a', { class: 'storyboard-back', href: './', text: LEVELS.back }))),
  frames));
show();
