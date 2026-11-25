// The reader (docs/levels_spec.md, "All three levels: reading at your own pace", and "One way forward at a time, and
// one bar for the whole story"). A level's words no longer come and go on a timer.
// - One way forward at a time. Where you act (a button, a choice, a drag), that is the way on, and there is no Next.
//   Lines of the same part follow each other by themselves, at reading pace (src/math/reading.js: each line is given the
//   time it takes to read it), and stay. Only where the story would turn the page on its own does it wait: then Next
//   appears under the level, glowing, once the words on show have been read. A level's buttons appear then too.
// - One bar for the whole story, at the top of the page: Level 1, Level 2, the final level, each ending in a marker.
//   Each Next sends stars up into it and fills a notch; when a level is done, its section is full and its marker filled.
// - Back pages back through the parts already read (a still picture of the board, with its words, kept by record.js);
//   Next pages forward again, to now. Keys: → or Enter for Next, ← for Back.
import { LEVELS } from './copyLevels.js';
import { readBy, READING } from '../math/reading.js';
import { COMIC } from './comic.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const RECORDING = new URLSearchParams(location.search).has('record');   // the comic's recorder: the story moves on by itself
const BEAT = 900;                                            // ms between lines of the same part, at least (reading pace: reading.js)
const ORDER = ['level-1', 'level-2', 'level-3'];
const make = (tag, className, attrs = {}) => Object.assign(document.createElement(tag), { className, ...attrs });
let current = null;                                          // the reader of the level being played: the keys go to it
export const readers = {};                                   // by level, for automated checks (window.__reader)
window.__reader = readers;

addEventListener('keydown', (e) => {                       // only when nothing else has the key (a board being aimed, a button)
  if (!current || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || document.documentElement.classList.contains('side-open')) return;
  const a = document.activeElement;
  if (a && a !== document.body && !current.el.querySelector('.reader').contains(a)) return;
  if (e.key === 'ArrowRight' || (e.key === 'Enter' && (!a || a === document.body))) { if (current.forward()) e.preventDefault(); }
  else if (e.key === 'ArrowLeft') { if (current.backward()) e.preventDefault(); }
  else if (e.key === ' ' && (!a || a === document.body)) { current.skip(); e.preventDefault(); }   // Space skips (Nadia, 2026-11-25)
});

// ── the bar for the whole story, at the top: one section per level, each ending in its marker ─────────────────────
let top = null;
/** The bar (made once, on first use; page.js makes it before the first level's intro). */
export function storyBar() {
  if (top) return top;
  const el = make('div', 'story-bar', { role: 'progressbar' });
  el.setAttribute('aria-label', LEVELS.progress);
  el.setAttribute('aria-valuemin', '0');
  el.setAttribute('aria-valuemax', '100');
  const names = { 'level-1': LEVELS.level1, 'level-2': LEVELS.level2, 'level-3': LEVELS.level3 };
  const sections = ORDER.map((id) => {
    const fill = make('span', 'story-fill');
    const track = make('span', 'story-track');
    track.append(fill);
    const mark = make('span', 'story-mark', { textContent: id === 'level-3' ? '★' : '' });
    const row = make('span', 'story-row');
    row.append(track, mark);
    const s = make('span', 'story-section');
    s.dataset.level = id;
    s.append(row, make('span', 'story-name', { textContent: names[id] }));
    return { id, s, row, fill, mark, f: 0 };
  });
  const row = make('div', 'story-sections');
  row.append(...sections.map((x) => x.s));
  const brand = make('span', 'story-brand');                 // the top left corner: ENERGEO Learn, the education layer (Nadia, 2026-11-25)
  brand.append(make('span', 'story-brand-name', { textContent: LEVELS.brand }), make('span', 'story-brand-tag', { textContent: LEVELS.layer }));
  el.append(brand, row);
  document.body.append(el);
  document.documentElement.classList.add('has-story-bar');
  const find = (id) => sections.find((y) => y.id === id);
  const set = (id, f) => {
    const x = find(id);
    if (!x) return;
    x.f = f;
    x.fill.style.width = `${(100 * f).toFixed(1)}%`;
    sections.forEach((y) => y.s.classList.toggle('now', y.id === id));
    el.setAttribute('aria-valuenow', String(Math.round((100 * sections.reduce((t, y) => t + y.f, 0)) / sections.length)));
  };
  const gain = (id) => { const x = find(id); x.s.classList.remove('gain'); void x.s.offsetWidth; x.s.classList.add('gain'); };
  const end = (id) => find(id)?.fill.getBoundingClientRect();
  const done = (id) => {                                     // the level is done: its section full, its marker filled
    const x = find(id);
    if (!x) return;
    set(id, 1);
    x.s.classList.add('done');
  };
  top = { el, set, gain, end, done };
  return top;
}

/**
 * The reader for the level whose lesson is `root`. `fast()` says the level is fast-forwarding (Level 3's review
 * frames): then nothing waits. Returns { el, next, beat }: `el` is the level's column of words, with Back (and Next,
 * when it is needed) under them, made around the level's prompt; `await next()` waits for Next; `await beat()` is the
 * short pause between lines of the same part.
 */
export function reader(root, { fast = () => false } = {}) {
  const level = root.closest('.level')?.id ?? '';
  const total = Math.max(1, COMIC.levels.find((l) => l.id === level)?.steps ?? 6);
  const bar = document.documentElement.classList.contains('framed') ? null : storyBar();
  const back = make('button', 'reader-back', { type: 'button', textContent: `‹ ${LEVELS.goBack}` });
  const go = make('button', 'reader-next', { type: 'button', textContent: `${LEVELS.forward} ›` });
  const row = make('div', 'reader');
  row.setAttribute('role', 'group');
  row.append(back, go);
  const words = root.querySelector(':scope > .prompt');
  const el = make('div', 'reader-column');                   // the level's words, with Back and Next under them
  words?.before(el);
  el.append(...(words ? [words] : []), row);
  // Reading pace: every line, speech bubble or big idea shown here (and each part of a sentence shown a part at a time)
  // adds its reading time; the next line of the part, and Next, wait until it has been read (reading.js).
  let readUntil = 0;
  const readable = (n) => {
    if (n.nodeType !== 1 || n.closest('button, .choices')) return '';
    if (n.matches('.mri-sentence')) return [...n.querySelectorAll('.frag.shown')].map((f) => f.textContent).join(' ');
    if (n.matches('.line, .bubble')) return n.textContent;
    return [...n.querySelectorAll('.line:not(.mri-sentence), .bubble')].map((e) => e.textContent).join(' ');
  };
  const ingest = (records) => {
    for (const m of records) {
      const texts = m.type === 'childList' ? [...m.addedNodes].map(readable)
        : m.target.classList?.contains('frag') && m.target.classList.contains('shown') && !/\bshown\b/.test(m.oldValue ?? '') ? [m.target.textContent] : [];
      for (const t of texts) if (t.trim()) readUntil = readBy(readUntil, performance.now(), t);
    }
  };
  const watch = words ? new MutationObserver((records) => {
    ingest(records);
    if (records.some((m) => m.type === 'childList')) requestAnimationFrame(() => words.scrollTo({ top: words.scrollHeight, behavior: REDUCED ? 'auto' : 'smooth' }));
  }) : null;
  watch?.observe(words, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });   // and the newest line always in view
  const caughtUp = () => { if (watch) ingest(watch.takeRecords()); return RECORDING ? 0 : Math.max(0, readUntil - performance.now()); };
  const layer = make('div', 'reader-earlier');               // a part read earlier, shown over the level
  layer.hidden = true;
  root.prepend(layer);

  let count = 0;
  let waiting = null;                                        // resolves the story's next(), while it waits for you
  let page = -1;                                             // -1: now; otherwise the index of the earlier part on show
  let done = false;
  let readyAt = 0;                                           // Next lights up once the words on show have been read
  const skippable = new Set();                               // the waits Space can cut short: a line on its way, a button
  const waitFor = (ms) => new Promise((resolve) => {
    const done = () => { clearTimeout(timer); skippable.delete(done); resolve(); };
    const timer = setTimeout(done, ms);
    skippable.add(done);
  });
  let readyTimer = 0;
  const parts = () => [...document.querySelectorAll('#story-record .recorded-part')].filter((p) => p.dataset.level === level);
  const fill = () => { if (bar && !done) bar.set(level, Math.min(0.96, count / total)); };
  const refresh = () => {
    back.disabled = page === 0 || parts().length === 0;
    const read = performance.now() >= readyAt;
    go.classList.toggle('ready', page < 0 && !!waiting && read);
    go.classList.toggle('paging', page >= 0);
    go.disabled = !(page >= 0 || (waiting && read));
    row.classList.toggle('looking-back', page >= 0);
  };
  const show = (i) => {                                      // page through the parts read earlier; -1 is now
    page = i;
    if (i < 0) { layer.hidden = true; layer.replaceChildren(); root.classList.remove('reading-back'); refresh(); return; }
    const view = parts()[i].cloneNode(true);
    view.className = 'reader-part';
    layer.replaceChildren(make('p', 'reader-earlier-tag', { textContent: `${LEVELS.earlier} · ${i + 1} / ${parts().length}` }), view);
    layer.style.bottom = `${row.offsetHeight + 8}px`;           // above the bar, which stays in reach
    layer.hidden = false;
    layer.scrollTop = 0;
    root.classList.add('reading-back');
    refresh();
  };
  const burst = () => {                                      // stars from Next up into the bar at the top
    if (REDUCED || !bar) return;
    const b = go.getBoundingClientRect();
    const t = bar.end(level);
    const from = { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    const to = { x: t.right, y: t.top + t.height / 2 };
    for (let k = 0; k < 7; k++) {
      const s = make('span', 'story-spark', { textContent: k % 2 ? '✦' : '★' });
      document.body.append(s);
      const a = (Math.PI * 2 * k) / 7;
      const mid = { x: from.x + Math.cos(a) * 30, y: from.y + Math.sin(a) * 24 - 30 };
      s.animate([
        { transform: `translate(${from.x}px, ${from.y}px) scale(0.4)`, opacity: 1 },
        { transform: `translate(${mid.x}px, ${mid.y}px) scale(1.15)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${to.x}px, ${to.y}px) scale(0.5)`, opacity: 0.3 },
      ], { duration: 760 + k * 35, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)' }).onfinish = () => s.remove();
    }
    go.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.9)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 320 });
    setTimeout(() => bar.gain(level), 700);
  };
  const forward = () => {
    if (page >= 0) { show(page + 1 < parts().length ? page + 1 : -1); return true; }
    if (!waiting || performance.now() < readyAt) return false;
    const r = waiting;
    waiting = null;
    count++;
    burst();
    fill();
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
  root.addEventListener('level-finished', () => { done = true; bar?.done(level); refresh(); });   // the section fills

  const self = {
    el, forward, backward,
    get count() { return count; }, get waiting() { return !!waiting; },
    /** The story waits here for you to press Next (or moves on at once while fast-forwarding). */
    next() {
      current = self;
      if (fast()) { count++; fill(); return Promise.resolve(); }
      return new Promise((resolve) => {
        waiting = resolve;
        const left = caughtUp() * READING.nextShare;          // Next lights up sooner than a line follows (reading.js)
        readyAt = performance.now() + left;
        clearTimeout(readyTimer);
        if (left) readyTimer = setTimeout(refresh, left + 20);
        refresh();
        if (RECORDING) setTimeout(forward, 250);
      });
    },
    /** Resolves once the words on show have been read (at once while fast-forwarding or recording). */
    read() { return fast() ? Promise.resolve() : waitFor(caughtUp() * READING.nextShare); },
    /**
     * Space: skip ahead (Nadia, 2026-11-25: "add an option to press space to skip"). A line on its way, or a button,
     * comes at once; where the story waits for Next, Next is pressed; looking back, the next part shows.
     */
    skip() {
      if (page >= 0) return forward();
      if (waiting) { readyAt = 0; clearTimeout(readyTimer); refresh(); return forward(); }
      if (!skippable.size) return false;
      for (const done of [...skippable]) done();
      return true;
    },
    /** A beat between lines of the same part: the next line follows by itself, once the earlier ones have been read (at least `ms`), and they stay. */
    beat(ms = BEAT) {
      if (fast()) return Promise.resolve();
      const left = RECORDING ? ms : Math.max(ms, caughtUp());
      return waitFor(left);
    },
  };
  current = self;
  readers[level] = self;
  fill();
  refresh();
  return self;
}
