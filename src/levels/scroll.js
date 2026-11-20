// Scrolling through the levels, as in a Mathigon course (docs/levels_spec.md, "Scrolling, and full screen"). When a
// part of a story ends, its picture and its lines stay on the page as a kept part, and the story goes on underneath:
// the page scrolls down to the live picture, where the next part begins. Scroll up at any time to see every earlier
// part. Full screen shows only the level being played, one part at a time, the lines clearing between parts (the
// kept parts are still made, hidden, so leaving full screen shows them all).

const root = () => document.documentElement;
/** Full screen: only the level being played, one part at a time. */
export const fullScreen = () => root().classList.contains('full-screen');
/** The parts are kept everywhere but in a frame of the review strip, and while Level 3 fast-forwards to a step. */
const keeping = () => !root().classList.contains('framed') && !root().classList.contains('instant');
const motion = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

/**
 * One attribute value with its references to renamed ids rewritten: url(#id), as in fill, clip-path and filter,
 * and a bare #id, as in href. `ids` maps each old id to its new one. A pure function.
 */
export function relink(value, ids) {
  return value
    .replace(/url\(\s*(['"]?)#([^'")\s]+)\1\s*\)/g, (m, q, id) => (ids.has(id) ? `url(${q}#${ids.get(id)}${q})` : m))
    .replace(/^#(\S+)$/, (m, id) => (ids.has(id) ? `#${ids.get(id)}` : m));
}

let made = 0;
/**
 * A still copy of a live element: the same picture, its ids its own (so the live picture's clip paths, gradients and
 * filters stay the live ones), and nothing in it to tab to or to press.
 */
export function still(node) {
  const copy = node.cloneNode(true);
  const n = ++made;
  const ids = new Map();
  for (const e of copy.querySelectorAll('[id]')) { ids.set(e.id, `${e.id}--kept-${n}`); e.id = ids.get(e.id); }
  if (ids.size) for (const e of copy.querySelectorAll('*')) for (const a of [...e.attributes]) {
    const v = relink(a.value, ids);
    if (v !== a.value) e.setAttribute(a.name, v);
  }
  for (const e of copy.querySelectorAll('[tabindex]')) e.removeAttribute('tabindex');
  return copy;
}

const shownNow = (n) => n.childElementCount > 0 && n.offsetHeight > 0 && getComputedStyle(n).opacity !== '0';
const last = new WeakMap();                                  // the live picture → the kept part it last made, and its markup

/**
 * The part that just ended stays on the page. `shown` lists what makes the picture (the live figure first, then
 * anything shown under it, such as Level 1's notes); `prompt` holds the part's lines.
 * - The lines, and a still copy of the picture, move into a kept part just above the live figure. If the picture has
 *   not changed since the last kept part, the lines join that part instead of repeating the picture.
 * - Then, if you are following the story (not reading further up), the page scrolls down to the live figure.
 * - In a frame of the review strip, or while fast-forwarding, the lines simply clear.
 */
export function keepPart(shown, prompt) {
  const lines = [...prompt.children];
  if (!lines.length) return;
  if (!keeping()) { prompt.replaceChildren(); return; }
  const live = shown[0];
  const following = live.getBoundingClientRect().top < innerHeight;   // measured before the kept part pushes it down
  lines.forEach((l) => l.classList.remove('leaving'));
  for (const b of prompt.querySelectorAll('button')) b.disabled = true;
  const pictures = shown.filter(shownNow);
  const markup = pictures.map((n) => n.outerHTML).join('');
  const before = last.get(live);
  if (before && before.markup === markup && before.part.nextElementSibling === live) before.part.querySelector('.kept-words').append(...lines);
  else {
    const words = Object.assign(document.createElement('div'), { className: 'prompt kept-words' });
    words.append(...lines);
    const part = Object.assign(document.createElement('div'), { className: 'kept-part' });
    part.inert = true;
    part.append(...pictures.map(still), words);
    live.before(part);
    last.set(live, { markup, part });
  }
  if (following && !fullScreen()) {                         // once the kept part has its size, scroll on to the live picture
    requestAnimationFrame(() => requestAnimationFrame(() => live.scrollIntoView({ behavior: motion(), block: 'start' })));
  }
}
