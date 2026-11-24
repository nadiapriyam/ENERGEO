// Reading pace for the levels' words (docs/levels_spec.md, "All three levels: words at reading pace"). Nadia
// (2026-11-24): "in every scene the sentence sections appear too fast, match the average reading speed to when the
// sections appear, same with the next button". A line is given the time it takes to read it at an average reading
// speed (READING.wpm words a minute), plus a moment to take it in; the next line of the same part, and the Next
// button, wait for it. Pure functions, no DOM.

export const READING = { wpm: 230, settle: 400, min: 1000 };   // a little quicker since 2026-11-24 (Nadia: "increase the appear rate for the section just a bit")

/** The words in a line of text (numbers and symbols such as "+1" or "→" are read too, as one word each). */
export const wordCount = (text) => (String(text).match(/[^\s]+/g) ?? []).filter((w) => /[\p{L}\p{N}→↑↓?]/u.test(w)).length;

/** How long a line takes to read, in ms: none for no words; otherwise at least READING.min. */
export function readingTime(text) {
  const n = wordCount(text);
  return n ? Math.max(READING.min, READING.settle + (n * 60000) / READING.wpm) : 0;
}

/**
 * When everything shown so far will have been read: lines shown while earlier ones are still being read queue up after
 * them. `until` is the time the earlier lines are read by, `now` the time this line appears.
 */
export const readBy = (until, now, text) => Math.max(until, now) + readingTime(text);
