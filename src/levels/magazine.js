// The magazine's box (docs/levels_spec.md, "All three levels: the magazine, and the thought it builds"): "The big
// idea", a bold statement pulled out like a magazine quote. It is a line of the story: it fades in like the others,
// stays, and is kept for Back and the comic.
import { LEVELS } from './copyLevels.js';

const make = (tag, className, text) => Object.assign(document.createElement(tag), { className, ...(text ? { textContent: text } : {}) });

/** The big idea: a bold statement, pulled out. */
export function bigIdea(text) {
  const p = make('p', 'line big-idea');
  p.append(make('span', 'idea-tag', LEVELS.bigIdea), make('span', 'idea-text', text));
  return p;
}
