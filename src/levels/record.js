// Keeping each part of a story (docs/levels_spec.md, "All three levels: reading at your own pace", and "the whole story
// as a comic"). When a part ends, its lines leave the page, and a still copy of its picture and its lines is kept in a
// hidden list: the reader's Back button pages back through it (reader.js), and on try/?record, the comic's recorder
// photographs it (tools/record_comic.mjs). In a frame of the review strip, or while Level 3 fast-forwards, the lines
// simply clear (except when recording).

const html = () => document.documentElement;
const recording = () => new URLSearchParams(location.search).has('record');
const keeping = () => recording() || (!html().classList.contains('framed') && !html().classList.contains('instant'));

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
const last = new WeakMap();                                  // the live picture → the part it last recorded, and its markup

/**
 * The end of a part. `shown` lists what makes the picture (the live figure first, then anything shown under it, such
 * as Level 1's notes); `prompt` holds the part's lines, which leave the page.
 * - A still copy of the picture and the lines go into the hidden list, marked with their level. If the picture has not
 *   changed since the last part, the lines join that part instead of repeating the picture.
 * - In a frame of the review strip, or while fast-forwarding (and not recording), the lines simply clear.
 */
export function keepPart(shown, prompt) {
  const lines = [...prompt.children];
  if (!lines.length) return;
  if (!keeping()) { prompt.replaceChildren(); return; }
  const live = shown[0];
  let list = document.getElementById('story-record');
  if (!list) {
    list = Object.assign(document.createElement('div'), { id: 'story-record', hidden: true });
    document.body.append(list);
  }
  lines.forEach((l) => l.classList.remove('leaving'));
  for (const l of lines) for (const b of l.matches('button') ? [l] : l.querySelectorAll('button')) b.disabled = true;
  const pictures = shown.filter(shownNow);
  const markup = pictures.map((n) => n.outerHTML).join('');
  const before = last.get(live);
  if (before && before.markup === markup && before.part === list.lastElementChild) { before.part.querySelector('.recorded-words').append(...lines); return; }
  const words = Object.assign(document.createElement('div'), { className: 'prompt recorded-words' });
  words.append(...lines);
  const part = Object.assign(document.createElement('div'), { className: 'recorded-part' });
  part.dataset.level = live.closest('.level')?.id ?? '';
  part.dataset.alt = live.querySelector('svg[aria-label]')?.getAttribute('aria-label') ?? '';
  part.append(...pictures.map(still), words);
  list.append(part);
  last.set(live, { markup, part });
  document.dispatchEvent(new CustomEvent('part-kept'));     // the reader's Back button can now reach it
}
