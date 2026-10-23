// One shared hover tooltip for marks (bars, cells). Content is plain text.

let tipEl;

export function showTip(text, x, y) {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'tip';
    tipEl.setAttribute('role', 'tooltip');
    document.body.append(tipEl);
  }
  tipEl.textContent = text;
  tipEl.hidden = false;
  const w = tipEl.offsetWidth;
  const left = Math.min(window.innerWidth - w - 8, x + 12);
  tipEl.style.left = `${Math.max(8, left)}px`;
  tipEl.style.top = `${y + 14}px`;
}

export function hideTip() {
  if (tipEl) tipEl.hidden = true;
}

/** Attach hover/focus tooltip behaviour to an element. */
export function withTip(el, getText) {
  el.addEventListener('pointermove', (e) => showTip(getText(), e.clientX, e.clientY));
  el.addEventListener('pointerleave', hideTip);
  return el;
}
