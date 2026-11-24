// Going to a scene from "Scroll through" (page.js): try/?jump=level-2.7 opens Level 2 and fast-forwards it through the
// parts before that scene (every wait, line and action at once, the board without animation) until 7 parts have
// ended (record.js counts them), then the scene plays as usual. Each comic part knows where it starts (comic.json:
// `start`, recorded by tools/record_comic.mjs). Nadia (2026-11-24): "add an option in the scroll through where the user
// can tap on a scene and the main display goes there".

const m = /^(level-[123])\.(\d+)$/.exec(new URLSearchParams(location.search).get('jump') ?? '');
/** The scene asked for: its level, and how many of the level's parts end before it (null if none was asked for). */
export const jumpTo = m ? { level: m[1], start: Number(m[2]) } : null;
let arrived = !jumpTo || jumpTo.start === 0;

/** Whether `level` is still fast-forwarding to the scene asked for. */
export const jumping = (level) => !arrived && jumpTo.level === level;

/** Calls `fn` (once) when `level` reaches the scene asked for: the parts before it have all ended. */
export function onArrive(level, fn) {
  if (!jumping(level)) return;
  const check = (e) => {
    if (e.detail.level !== level || e.detail.count < jumpTo.start) return;
    arrived = true;
    document.removeEventListener('part-ended', check);
    fn();
  };
  document.addEventListener('part-ended', check);
}
