// Level 2, "Inside a note" (docs/level2_spec.md): the picture and the camera. Pure functions, no DOM.
//
// One drawing holds the whole story at different sizes: an orchestra in the back, and your violin in front, with its
// four strings and its bow. A camera looks at the drawing: a world point (wx, wy) is shown at the view point (ax, ay),
// magnified z times. A magnifying glass at view point L shows the same drawing magnified M more times around the
// world point under L. When the glass reaches its target it grows to fill the view, and the camera takes over what the
// glass showed, so the zoom has no seam. The camera then glides on to the next close-up.

export const VIEW = { w: 640, h: 400 };
export const HOME = { ax: 320, ay: 200, wx: 320, wy: 200, z: 1 };

/** The camera's transform (CSS, on a group) and its two maps. */
export const transform = (c) => `translate(${c.ax}px, ${c.ay}px) scale(${c.z}) translate(${-c.wx}px, ${-c.wy}px)`;
export const toView = (c, p) => ({ x: c.ax + (p.x - c.wx) * c.z, y: c.ay + (p.y - c.wy) * c.z });
export const toWorld = (c, q) => ({ x: c.wx + (q.x - c.ax) / c.z, y: c.wy + (q.y - c.ay) / c.z });
/** What a magnifying glass at view point L, magnifying M times, shows: a camera anchored at L. */
export function lensCamera(c, L, M) {
  const w = toWorld(c, L);
  return { ax: L.x, ay: L.y, wx: w.x, wy: w.y, z: c.z * M };
}
/** Between two cameras: anchors and world points move evenly, the zoom grows evenly in steps of ratio (geometrically). */
export const lerpCamera = (a, b, t) => ({
  ax: a.ax + (b.ax - a.ax) * t, ay: a.ay + (b.ay - a.ay) * t,
  wx: a.wx + (b.wx - a.wx) * t, wy: a.wy + (b.wy - a.wy) * t,
  z: a.z * (b.z / a.z) ** t,
});
/** How big the glass must grow from view point L to cover the whole view. */
export const coverRadius = (L) => Math.hypot(Math.max(L.x, VIEW.w - L.x), Math.max(L.y, VIEW.h - L.y)) + 2;
export const LENS = { r: 70, rest: { x: 540, y: 300 } };

// ── the drawing (world units; at z = 1 it fills the view) ───────────────────────────────────────────
/** Your violin lies across the front: scroll on the left, body on the right. */
export const VIOLIN = {
  scroll: { x: 50, y: 318, r: 11 },
  neck: { x: 60, y: 312, w: 60, h: 12 },
  fingerboard: { x: 92, y: 307, w: 120, h: 22 },
  upper: { cx: 168, cy: 318, rx: 38, ry: 31 },    // the body: two bouts and a waist
  lower: { cx: 246, cy: 318, rx: 44, ry: 36 },
  waist: { x: 168, y: 296, w: 78, h: 44 },
  bridge: { x: 234, y: 304, w: 4, h: 28 },
  tailpiece: { x: 262, y: 309, w: 26, h: 18 },
  nut: 62,
};
/** The four strings, top to bottom, from the nut to the bridge. */
export const STRINGS = [
  { name: 'E', y: 309 },
  { name: 'A', y: 315 },
  { name: 'D', y: 321 },
  { name: 'G', y: 327 },
].map((s) => ({ ...s, x1: VIOLIN.nut, x2: VIOLIN.bridge.x }));
export const A_STRING = STRINGS[1];
/** The bow crosses the strings between the fingerboard and the bridge; you move it up and down along itself. */
export const BOW = { x: 220, top: 236, bottom: 398, travel: 46 };

/** The orchestra: two curved rows of players behind your violin, each with an instrument. */
const ROWS = [
  { y: 118, n: 7, x0: 110, x1: 610, scale: 0.8 },
  { y: 190, n: 5, x0: 330, x1: 610, scale: 1 },
];
const KINDS = ['violin', 'cello', 'flute', 'violin', 'horn', 'cello', 'violin', 'flute', 'violin', 'cello', 'horn', 'violin'];
export function musicians() {
  const out = [];
  ROWS.forEach((row, r) => {
    for (let i = 0; i < row.n; i++) {
      const u = row.n === 1 ? 0.5 : i / (row.n - 1);
      const x = row.x0 + (row.x1 - row.x0) * u;
      const y = row.y - 14 * Math.sin(Math.PI * u);          // the rows curve away a little in the middle
      out.push({ x: +x.toFixed(1), y: +y.toFixed(1), s: row.scale, kind: KINDS[out.length % KINDS.length], row: r });
    }
  });
  return out;
}

/** The two close-ups: your violin, then the A string. Each has a target, the camera that shows it, and the glass's power. */
export const ZOOMS = [
  { name: 'violin', target: { x: 172, y: 318 }, z: 2.5, mag: 2.4, snap: 56 },
  { name: 'string', target: { x: 132, y: A_STRING.y }, z: 13, mag: 4, snap: 44 },
];
export const closeUp = (k) => ({ ax: VIEW.w / 2, ay: VIEW.h / 2, wx: ZOOMS[k].target.x, wy: ZOOMS[k].target.y, z: ZOOMS[k].z });

/** A string's path while it shakes: a standing wave between nut and bridge, swing s ∈ [−1, 1], half-width `amp`. */
export function stringPath(str, amp = 0, s = 0, n = 80) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = str.x1 + (str.x2 - str.x1) * u;
    const y = str.y + amp * s * Math.sin(Math.PI * u);
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(3)}`;
  }
  return d;
}
