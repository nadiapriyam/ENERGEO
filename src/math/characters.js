// The characters, drawn the same in every level (docs/levels_spec.md): you, the player, in the style of the picture
// Nadia shared (short dark hair, big round glasses, a yellow shirt) with a bucket hat; and the radiologist (the same
// deadpan face, copper hair, a blue shirt, a white coat). Pure geometry, no DOM: src/levels/characters.js draws them.

export const FACE = {
  view: { w: 120, h: 132 },
  head: { cx: 60, cy: 58, rx: 34, ry: 40 },
  ears: [{ cx: 26, cy: 62, rx: 6, ry: 9 }, { cx: 94, cy: 62, rx: 6, ry: 9 }],
  eyes: [{ cx: 45, cy: 58 }, { cx: 75, cy: 58 }],
  eyeR: 9,
  pupilR: 3.2,
  rimR: 12.5,
  brows: [{ x1: 34, y1: 41, x2: 55, y2: 43 }, { x1: 65, y1: 43, x2: 86, y2: 41 }],
  mouth: { x1: 52, x2: 68, y: 84 },
  neck: { x: 51, y: 92, w: 18, h: 16 },
};
/** The hair: a short cap over the top of the head. */
export function hairPath() {
  const { cx, cy, rx, ry } = FACE.head;
  return `M ${cx - rx - 1} ${cy - 4} C ${cx - rx - 1} ${cy - ry - 20} ${cx + rx + 1} ${cy - ry - 20} ${cx + rx + 1} ${cy - 4} C ${cx + rx - 6} ${cy - ry + 2} ${cx - rx + 6} ${cy - ry + 2} ${cx - rx - 1} ${cy - 4} Z`;
}
export function shirtPath() {
  const { w, h } = FACE.view;
  return `M 12 ${h} C 14 ${h - 20} 34 ${h - 28} ${w / 2} ${h - 28} C ${w - 34} ${h - 28} ${w - 14} ${h - 20} ${w - 12} ${h} Z`;
}
/** Where a pupil sits when its eye looks toward `target`: as far that way as it can go and still stay inside the eye. */
export function lookAt(eye, target) {
  const dx = target.x - eye.cx;
  const dy = target.y - eye.cy;
  const d = Math.hypot(dx, dy);
  const reach = FACE.eyeR - FACE.pupilR - 1;
  const k = d < 1e-9 ? 0 : Math.min(reach, d) / d;
  return { x: eye.cx + dx * k, y: eye.cy + dy * k };
}

/** You, the player: dark hair, a yellow shirt and a bucket hat. The radiologist: the same face, copper hair, a blue shirt, a white coat. */
export const PLAYER = { hair: '#2a2a2a', shirt: '#ffd21f', hat: '#c4a46a', band: '#8a7140' };
export const RADIOLOGIST = { hair: '#b5602c', shirt: '#4f8fe8' };
/** The bucket hat: a crown over the top of the head (covering the hair), a band, and a brim that slopes down and out all round. */
export function bucketHat() {
  const { cx, cy, rx, ry } = FACE.head;
  const top = cy - ry - 24;                                  // the crown's curve rises above the hair
  const base = cy - ry + 13;                                 // where the crown meets the brim, just above the brows
  const wide = rx + 16;                                      // the brim reaches past the head on both sides
  return {
    crown: `M ${cx - rx - 1} ${base} C ${cx - rx + 2} ${top} ${cx + rx - 2} ${top} ${cx + rx + 1} ${base} Z`,
    band: `M ${cx - rx} ${base - 6} Q ${cx} ${base - 9} ${cx + rx} ${base - 6} L ${cx + rx + 1} ${base} L ${cx - rx - 1} ${base} Z`,
    brim: `M ${cx - rx - 2} ${base - 2} Q ${cx} ${base - 6} ${cx + rx + 2} ${base - 2} L ${cx + wide} ${base + 6} Q ${cx} ${base + 10} ${cx - wide} ${base + 6} Z`,
    top, base, wide,
  };
}

/** The radiologist's white coat over the shirt, as seen in the face: two lapels, the blue shirt showing between them. */
export function coatLapels() {
  const { w, h } = FACE.view;
  return [
    `M 12 ${h} C 14 ${h - 16} 26 ${h - 24} 46 ${h - 27} L 57 ${h} Z`,
    `M ${w - 12} ${h} C ${w - 14} ${h - 16} ${w - 26} ${h - 24} ${w - 46} ${h - 27} L ${w - 57} ${h} Z`,
  ];
}

// ── the break: you and the radiologist, standing in the hall ─────────────────────────────────────────────
/** A whole figure, in its own units: the face's 120 × 132 on top, then a body and legs below (a white coat for the radiologist). */
export const FIGURE = {
  view: { w: 120, h: 250 },
  torso: { x: 18, y: 112, w: 84, h: 92, r: 18 },
  legs: [{ x: 34, y: 196, w: 22, h: 54, r: 6 }, { x: 64, y: 196, w: 22, h: 54, r: 6 }],
  coat: [{ x: 16, y: 108, w: 32, h: 112, r: 10 }, { x: 72, y: 108, w: 32, h: 112, r: 10 }],
};

/** Where a figure stands, centred at x, its feet on the floor at y = floor, `height` tall. */
export function figureAt(cx, floor, height) {
  const w = (height * FIGURE.view.w) / FIGURE.view.h;
  return { x: cx - w / 2, y: floor - height, w, h: height };
}
