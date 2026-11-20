// The whole story as a comic, for the side panel (page.js): the parts of every level in order, each a picture of the
// board and its lines, recorded from the levels themselves by tools/record_comic.mjs. test/comic.test.js checks that
// every line is still the levels' own wording, so a change to the levels' words shows up until the comic is recorded
// again (npm run comic). Before the first recording there is no comic, and the panel is empty.

const recorded = import.meta.glob('./comic/comic.json', { eager: true, import: 'default' });
export const COMIC = recorded['./comic/comic.json'] ?? { levels: [] };

/** Each picture's address in the built site, by file name. */
export const pictures = Object.fromEntries(
  Object.entries(import.meta.glob('./comic/*.webp', { eager: true, query: '?url', import: 'default' })).map(([k, v]) => [k.slice('./comic/'.length), v]),
);
