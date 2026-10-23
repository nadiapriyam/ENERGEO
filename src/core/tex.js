import katex from 'katex';
import 'katex/dist/katex.min.css';
import { h } from './dom.js';

export const tex = (src, display = false) =>
  katex.renderToString(src, { displayMode: display, throwOnError: false, output: 'html' });

/** An element holding rendered TeX. */
export const texEl = (src, { display = false, tag = 'span', cls } = {}) => h(tag, { class: cls, html: tex(src, display) });

/** Render inline $…$ segments inside plain text. */
export const richText = (text) =>
  text
    .split(/(\$[^$]+\$)/g)
    .map((part) => (part.startsWith('$') && part.endsWith('$') ? tex(part.slice(1, -1)) : escapeHtml(part)))
    .join('');

const escapeHtml = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
