// Scrolling through on the side (docs/levels_spec.md, "All three levels: the regular layout, and scrolling through on
// the side"). The levels play as they were built: one board, the lines clearing between parts. When a part ends, a
// still copy of its picture and its lines goes into the side panel, under its level's name, so every part you have
// finished can be scrolled through there. page.js makes the panel and its "Scroll through" tab.

const root = () => document.documentElement;
/** Parts are kept everywhere but in a frame of the review strip, and while Level 3 fast-forwards to a step. */
const keeping = () => !root().classList.contains('framed') && !root().classList.contains('instant');

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
const make = (tag, className, text) => Object.assign(document.createElement(tag), { className, ...(text ? { textContent: text } : {}) });

/** The side panel's list for the level that `live` is in, made the first time, under the level's name (null: no panel). */
function listFor(live) {
  const parts = document.querySelector('.side-parts');
  if (!parts) return null;
  const level = live.closest('.level');
  const id = level?.id ?? 'level';
  let group = [...parts.children].find((g) => g.dataset.level === id);
  if (!group) {
    group = make('section', 'side-level');
    group.dataset.level = id;
    group.append(make('h3', 'side-level-name', level?.querySelector('.level-tag')?.firstChild?.textContent ?? ''));
    parts.append(group);
  }
  return group;
}

/**
 * The part that just ended goes into the side panel. `shown` lists what makes the picture (the live figure first, then
 * anything shown under it, such as Level 1's notes); `prompt` holds the part's lines, which leave the page.
 * - A still copy of the picture, and the lines, become a kept part at the end of the level's list in the panel. If the
 *   picture has not changed since the last kept part, the lines join that part instead of repeating the picture.
 * - If the panel is open and scrolled to its end, it follows the new part; the tab shows that something was added.
 * - In a frame of the review strip, or while fast-forwarding, the lines simply clear.
 */
export function keepPart(shown, prompt) {
  const lines = [...prompt.children];
  if (!lines.length) return;
  const live = shown[0];
  const list = keeping() ? listFor(live) : null;
  if (!list) { prompt.replaceChildren(); return; }
  const panel = list.closest('.side');
  const atEnd = panel.scrollHeight - panel.scrollTop - panel.clientHeight < 60;
  lines.forEach((l) => l.classList.remove('leaving'));
  for (const b of prompt.querySelectorAll('button')) b.disabled = true;
  const pictures = shown.filter(shownNow);
  const markup = pictures.map((n) => n.outerHTML).join('');
  const before = last.get(live);
  if (before && before.markup === markup && before.part === list.lastElementChild) before.part.querySelector('.kept-words').append(...lines);
  else {
    const words = make('div', 'prompt kept-words');
    words.append(...lines);
    const part = make('div', 'kept-part');
    part.inert = true;
    part.append(...pictures.map(still), words);
    list.append(part);
    last.set(live, { markup, part });
  }
  panel.querySelector('.side-empty')?.remove();
  if (atEnd && root().classList.contains('side-open')) requestAnimationFrame(() => panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' }));
  const tab = document.querySelector('.side-toggle');
  if (tab) { tab.classList.remove('new'); void tab.offsetWidth; tab.classList.add('new'); }
}
