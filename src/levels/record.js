// Recording the whole story as a comic (docs/levels_spec.md, "All three levels: the whole story as a comic, on the
// side"). Only on try/?record, which tools/record_comic.mjs opens: when a part of a story ends, a still copy of its
// picture and its lines are kept in a hidden list for the recorder to photograph. Everywhere else, the lines simply
// clear, as they always have. The comic the panel shows is that recording (src/levels/comic/).

const recording = () => new URLSearchParams(location.search).has('record');

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
 * as Level 1's notes); `prompt` holds the part's lines.
 * - Recording: a still copy of the picture and the lines go into the hidden list, marked with their level. If the
 *   picture has not changed since the last part, the lines join that part instead of repeating the picture.
 * - Otherwise: the lines clear.
 */
export function keepPart(shown, prompt) {
  const lines = [...prompt.children];
  if (!lines.length) return;
  if (!recording()) { prompt.replaceChildren(); return; }
  const live = shown[0];
  let list = document.getElementById('comic-record');
  if (!list) {
    list = Object.assign(document.createElement('div'), { id: 'comic-record', hidden: true });
    document.body.append(list);
  }
  lines.forEach((l) => l.classList.remove('leaving'));
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
}
