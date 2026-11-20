// The characters on the page, the same in every level: you (the player: dark hair, a yellow shirt, a bucket hat) and
// the radiologist (copper hair, a blue shirt, a white coat). Their faces sit beside their speech bubbles; their whole
// figures can stand on a board. Every position comes from src/math/characters.js. Styles: base.css.
import { FACE, hairPath, shirtPath, lookAt, PLAYER, RADIOLOGIST, bucketHat, coatLapels, FIGURE } from '../math/characters.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  e.append(...kids);
  return e;
};
const svg = (tag, attrs = {}, ...kids) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  e.append(...kids);
  return e;
};

/** A character's face and shoulders, in FACE's units, looking toward `look`: you in a bucket hat; the radiologist in a white coat. */
export function faceParts(who, look) {
  const F = FACE;
  const you = who === 'you';
  const C = you ? PLAYER : RADIOLOGIST;
  const [e0, e1] = F.eyes;
  const hat = bucketHat();
  return [
    svg('path', { class: 'shirt', d: shirtPath(), fill: C.shirt }),
    ...(you ? [] : coatLapels().map((d) => svg('path', { class: 'coat', d }))),
    svg('rect', { class: 'skin', x: F.neck.x, y: F.neck.y, width: F.neck.w, height: F.neck.h }),
    ...F.ears.map((e) => svg('ellipse', { class: 'skin', cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry })),
    svg('ellipse', { class: 'skin', cx: F.head.cx, cy: F.head.cy, rx: F.head.rx, ry: F.head.ry }),
    svg('path', { class: 'hair', d: hairPath(), fill: C.hair }),
    ...(you ? [svg('path', { class: 'hat', d: hat.crown, fill: PLAYER.hat }), svg('path', { class: 'hat-band', d: hat.band, fill: PLAYER.band }), svg('path', { class: 'hat', d: hat.brim, fill: PLAYER.hat })] : []),
    svg('g', { class: 'eyes' },
      ...F.eyes.map((e) => svg('circle', { class: 'eye', cx: e.cx, cy: e.cy, r: F.eyeR })),
      ...F.eyes.map((e) => { const p = lookAt(e, look); return svg('circle', { class: 'pupil', cx: p.x.toFixed(2), cy: p.y.toFixed(2), r: F.pupilR }); })),
    ...F.eyes.map((e) => svg('circle', { class: 'rim', cx: e.cx, cy: e.cy, r: F.rimR })),
    svg('path', { class: 'rim', d: `M ${e0.cx + F.rimR} ${e0.cy - 2} Q ${(e0.cx + e1.cx) / 2} ${e0.cy - 6} ${e1.cx - F.rimR} ${e1.cy - 2}` }),
    svg('path', { class: 'rim', d: `M ${e0.cx - F.rimR} ${e0.cy - 2} L ${F.ears[0].cx + 2} ${F.ears[0].cy - 6} M ${e1.cx + F.rimR} ${e1.cy - 2} L ${F.ears[1].cx - 2} ${F.ears[1].cy - 6}` }),
    ...F.brows.map((b) => svg('line', { class: 'brow', x1: b.x1, y1: b.y1, x2: b.x2, y2: b.y2, stroke: C.hair })),
    svg('rect', { class: 'mouth', x: F.mouth.x1, y: F.mouth.y - 1.3, width: F.mouth.x2 - F.mouth.x1, height: 2.6, rx: 1.3 }),
  ];
}

/** The face beside a character's bubbles: looking up, at the board. */
export function face(who) {
  const s = svg('svg', { viewBox: `0 0 ${FACE.view.w} ${FACE.view.h}`, class: `face ${who}`, 'aria-hidden': 'true' });
  s.append(...faceParts(who, { x: FACE.head.cx + (who === 'you' ? -30 : 30), y: -200 }));
  return s;
}

/** A whole figure standing in `box` (from figureAt), looking toward `look`. */
export function person(who, box, look) {
  const you = who === 'you';
  return svg('svg', { x: box.x.toFixed(1), y: box.y.toFixed(1), width: box.w.toFixed(1), height: box.h.toFixed(1), viewBox: `0 0 ${FIGURE.view.w} ${FIGURE.view.h}`, class: `person figure-${who}` },
    ...FIGURE.legs.map((l) => svg('rect', { class: 'legs', x: l.x, y: l.y, width: l.w, height: l.h, rx: l.r })),
    svg('rect', { x: FIGURE.torso.x, y: FIGURE.torso.y, width: FIGURE.torso.w, height: FIGURE.torso.h, rx: FIGURE.torso.r, fill: (you ? PLAYER : RADIOLOGIST).shirt }),
    ...(you ? [] : FIGURE.coat.map((c) => svg('rect', { class: 'coat', x: c.x, y: c.y, width: c.w, height: c.h, rx: c.r }))),
    ...faceParts(who, look));
}

/**
 * speaker(prompt) gives speak(text, who, thought): a character's line, as a bubble beside their face (one face for
 * lines in a row). `who` is 'you' or 'radiologist'; a thought gets a thought bubble. `later` runs the fade-in.
 */
export function speaker(prompt, later = (fn) => requestAnimationFrame(fn)) {
  return function speak(text, who = 'radiologist', thought = false) {
    let block = prompt.lastElementChild;
    if (!block || !block.classList.contains('speaker') || block.dataset.who !== who) {
      block = el('div', { class: `speaker ${who}`, 'data-who': who, role: 'group', 'aria-label': who === 'you' ? 'You' : 'The radiologist' },
        el('div', { class: 'who' }, face(who)), el('div', { class: 'bubbles' }));
      prompt.append(block);
      later(() => block.classList.add('in'));
    }
    const b = el('p', { class: `bubble${thought ? ' thought' : ''}`, text });
    block.querySelector('.bubbles').append(b);
    later(() => b.classList.add('in'));
    const f = block.querySelector('.face');
    f.classList.remove('talking');
    f.getBoundingClientRect();
    if (!thought) f.classList.add('talking');
    return b;
  };
}
