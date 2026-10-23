// Tiny DOM builders. h() makes HTML elements, s() makes SVG elements.

const SVG_NS = 'http://www.w3.org/2000/svg';

function apply(el, attrs) {
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.setAttribute('class', v);
    else if (k === 'text') el.textContent = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  return el;
}

function append(el, children) {
  for (const c of [children].flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export const h = (tag, attrs, ...children) => append(apply(document.createElement(tag), attrs), children);
export const s = (tag, attrs, ...children) => append(apply(document.createElementNS(SVG_NS, tag), attrs), children);

/** Set SVG/HTML attributes in place (used by views on every update). */
export const set = (el, attrs) => apply(el, attrs);

export const clear = (el) => {
  while (el.firstChild) el.firstChild.remove();
  return el;
};
