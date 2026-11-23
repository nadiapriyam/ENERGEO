// The magazine's boxes (docs/levels_spec.md, "All three levels: the magazine, and the thought it builds"): a
// "Did you know?" box, for a fact beside the story, and "The big idea", a bold statement pulled out like a magazine
// quote. Both are lines of the story: they fade in like the others, stay, and are kept for Back and the comic.
import { LEVELS } from './copyLevels.js';

const make = (tag, className, text) => Object.assign(document.createElement(tag), { className, ...(text ? { textContent: text } : {}) });

/** A "Did you know?" box. */
export function fact(text) {
  const a = make('aside', 'line fact');
  a.append(make('span', 'fact-tag', LEVELS.didYouKnow), make('span', 'fact-text', text));
  return a;
}

/** The big idea: a bold statement, pulled out. */
export function bigIdea(text) {
  const p = make('p', 'line big-idea');
  p.append(make('span', 'idea-tag', LEVELS.bigIdea), make('span', 'idea-text', text));
  return p;
}
