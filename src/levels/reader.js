// The reader (docs/levels_spec.md, "All three levels: reading at your own pace"). A level's words no longer come and go
// on a timer. Where the story waits for you, the Next button lights up; pressing it sends a few stars into the level's
// bar, which fills a notch (+1), and the next words come. At the end of the level the bar is full: Level up! The Back
// button pages back through the parts already read (a still picture of the board, with its words, kept by record.js),
// and Next pages forward again, to now. Keys: → or Enter for Next, ← for Back.
import { LEVELS } from './copyLevels.js';
import { COMIC } from './comic.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const RECORDING = new URLSearchParams(location.search).has('record');   // the comic's recorder: the story moves on by itself
const make = (tag, className, attrs = {}) => Object.assign(document.createElement(tag), { className, ...attrs });
let current = null;                                          // the reader of the level being played: the keys go to it
export const readers = {};                                   // by level, for automated checks (window.__reader)
window.__reader = readers;

addEventListener('keydown', (e) => {                       // only when nothing else has the key (a board being aimed, a button)
  if (!current || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || document.documentElement.classList.contains('side-open')) return;
  const a = document.activeElement;
  if (a && a !== document.body && !current.el.contains(a)) return;
  if (e.key === 'ArrowRight' || (e.key === 'Enter' && (!a || a === document.body))) { if (current.forward()) e.preventDefault(); }
  else if (e.key === 'ArrowLeft') { if (current.backward()) e.preventDefault(); }
});

/**
 * The reader for the level whose lesson is `root`. `fast()` says the level is fast-forwarding (Level 3's review
 * frames): then the story never waits. Returns { el, next }: `el` is the bar to put under the level; `await next()`
 * waits for you to press Next.
 */
export function reader(root, { fast = () => false } = {}) {
  const level = root.closest('.level')?.id ?? '';
  const total = Math.max(1, COMIC.levels.find((l) => l.id === level)?.steps ?? 20);
  const back = make('button', 'reader-back', { type: 'button', textContent: `‹ ${LEVELS.goBack}` });
  const go = make('button', 'reader-next', { type: 'button', textContent: `${LEVELS.forward} ›` });
  const fill = make('span', 'xp-fill');
  const track = make('span', 'xp', { role: 'progressbar' });
  track.setAttribute('aria-label', LEVELS.progress);
  track.setAttribute('aria-valuemin', '0');
  track.setAttribute('aria-valuemax', '100');
  track.append(fill, make('span', 'xp-star', { textContent: '★' }));
  const el = make('div', 'reader');
  el.setAttribute('role', 'group');
  el.append(back, track, go);
  const layer = make('div', 'reader-earlier');               // a part read earlier, shown over the level
  layer.hidden = true;
  root.prepend(layer);

  let count = 0;
  let waiting = null;                                        // resolves the story's next(), while it waits for you
  let page = -1;                                             // -1: now; otherwise the index of the earlier part on show
  let done = false;
  const parts = () => [...document.querySelectorAll('#story-record .recorded-part')].filter((p) => p.dataset.level === level);
  const setFill = (f) => {
    fill.style.width = `${(100 * f).toFixed(1)}%`;
    track.setAttribute('aria-valuenow', String(Math.round(100 * f)));
  };
  const refresh = () => {
    const n = parts().length;
    back.disabled = page === 0 || n === 0;
    go.disabled = page < 0 && !waiting;
    go.classList.toggle('ready', page < 0 && !!waiting);
    el.classList.toggle('looking-back', page >= 0);
  };
  const show = (i) => {                                      // page through the parts read earlier; -1 is now
    page = i;
    if (i < 0) { layer.hidden = true; layer.replaceChildren(); root.classList.remove('reading-back'); refresh(); return; }
    const part = parts()[i];
    const view = part.cloneNode(true);
    view.className = 'reader-part';
    layer.replaceChildren(make('p', 'reader-earlier-tag', { textContent: `${LEVELS.earlier} · ${i + 1} / ${parts().length}` }), view);
    layer.style.bottom = `${el.offsetHeight + 8}px`;            // above the bar, which stays in reach
    layer.hidden = false;
    layer.scrollTop = 0;
    root.classList.add('reading-back');
    refresh();
  };
  const burst = () => {                                      // stars from the button into the bar, +1, and a notch more
    if (REDUCED) return;
    const b = go.getBoundingClientRect();
    const t = track.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const from = { x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top };
    const to = { x: t.left + (t.width * count) / total - r.left, y: t.top + t.height / 2 - r.top };
    for (let k = 0; k < 7; k++) {
      const s = make('span', 'xp-spark', { textContent: k % 2 ? '✦' : '★' });
      el.append(s);
      const a = (Math.PI * 2 * k) / 7;
      const mid = { x: from.x + Math.cos(a) * 26, y: from.y + Math.sin(a) * 22 - 12 };
      s.animate([
        { transform: `translate(${from.x}px, ${from.y}px) scale(0.4)`, opacity: 1 },
        { transform: `translate(${mid.x}px, ${mid.y}px) scale(1.1)`, opacity: 1, offset: 0.35 },
        { transform: `translate(${to.x}px, ${to.y}px) scale(0.5)`, opacity: 0.2 },
      ], { duration: 620 + k * 30, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)' }).onfinish = () => s.remove();
    }
    const plus = make('span', 'xp-plus', { textContent: '+1' });
    plus.style.left = `${to.x}px`;
    plus.style.top = `${to.y}px`;
    el.append(plus);
    plus.animate([{ transform: 'translate(-50%, -40%)', opacity: 0 }, { transform: 'translate(-50%, -140%)', opacity: 1, offset: 0.3 }, { transform: 'translate(-50%, -220%)', opacity: 0 }],
      { duration: 900, easing: 'ease-out' }).onfinish = () => plus.remove();
    go.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.9)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 320 });
    setTimeout(() => { track.classList.remove('gain'); void track.offsetWidth; track.classList.add('gain'); }, 520);
  };
  const forward = () => {
    if (page >= 0) { show(page + 1 < parts().length ? page + 1 : -1); return true; }
    if (!waiting) return false;
    const r = waiting;
    waiting = null;
    count++;
    if (!done) setFill(Math.min(0.96, count / total));
    burst();
    refresh();
    r();
    return true;
  };
  const backward = () => {
    const n = parts().length;
    if (!n || page === 0) return false;
    show(page < 0 ? n - 1 : page - 1);
    return true;
  };
  document.addEventListener('part-kept', refresh);
  go.addEventListener('click', forward);
  back.addEventListener('click', backward);
  root.addEventListener('level-finished', () => {            // the bar fills: Level up!
    done = true;
    setFill(1);
    el.classList.add('levelled');
    const badge = make('span', 'xp-levelup', { textContent: LEVELS.levelUp });
    track.append(badge);
    if (!REDUCED) for (let k = 0; k < 18; k++) {
      const c = make('span', 'xp-confetti');
      c.style.background = `hsl(${(k * 47) % 360}, 90%, 60%)`;
      track.append(c);
      const a = (Math.PI * 2 * k) / 18;
      c.animate([{ transform: 'translate(0, 0) rotate(0deg)', opacity: 1 }, { transform: `translate(${Math.cos(a) * (60 + (k % 4) * 18)}px, ${Math.sin(a) * 40 - 30}px) rotate(${k * 70}deg)`, opacity: 0 }],
        { duration: 1100 + (k % 5) * 80, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' }).onfinish = () => c.remove();
    }
  });

  const self = {
    el, forward, backward,
    get count() { return count; }, get waiting() { return !!waiting; },
    /** The story waits here for you to press Next (or moves on at once while fast-forwarding). */
    next() {
      current = self;
      if (fast()) { count++; setFill(Math.min(0.96, count / total)); return Promise.resolve(); }
      return new Promise((resolve) => {
        waiting = resolve;
        refresh();
        if (RECORDING) setTimeout(forward, 250);
      });
    },
  };
  current = self;
  readers[level] = self;
  setFill(0);
  refresh();
  return self;
}
