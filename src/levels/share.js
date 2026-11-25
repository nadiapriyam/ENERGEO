// Sharing the whole thing by email (Nadia, 2026-11-25: "can you make it sharable through email, the whole thing"): the
// three levels and the research behind ENERGEO (try/deeper/). "Share by email" opens an email with a subject and both
// links filled in; "Copy link" copies the link to the levels (where the whole thing starts). The links are worked out
// from the page's own address, so they are right wherever the site is served. The words are in copyLevels.js.
import { LEVELS, SHARE_BODY } from './copyLevels.js';

/**
 * The two links, from the address of the page they are shared from: `page` is 'levels' (try/) or 'deeper'
 * (try/deeper/). Any query (a scene, a review frame) or #anchor is left out: the levels start from the beginning.
 */
export function shareLinks(href, page = 'levels') {
  const levels = new URL(page === 'deeper' ? '../' : './', href);
  return { levels: levels.href, deeper: new URL('deeper/', levels).href };
}

/** The email: its subject, and its body with both links. */
export function shareEmail(links) {
  return { subject: LEVELS.shareSubject, body: SHARE_BODY.join('\n').replace('{levels}', links.levels).replace('{deeper}', links.deeper) };
}

/** A mailto: link for the email (RFC 6068: every character encoded, line breaks as CRLF). */
export const mailto = ({ subject, body }) => `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\r?\n/g, '\r\n'))}`;

/** "Share by email" and "Copy link", as a row of two controls (in the browser). */
export function shareRow(page, className = '') {
  const links = shareLinks(location.href, page);
  const row = Object.assign(document.createElement('div'), { className: `share-row ${className}`.trim() });
  const email = Object.assign(document.createElement('a'), { className: 'share-email', href: mailto(shareEmail(links)) });
  email.append(Object.assign(document.createElement('span'), { className: 'share-icon', textContent: '✉' }), Object.assign(document.createElement('span'), { className: 'share-text', textContent: LEVELS.share }));
  email.querySelector('.share-icon').setAttribute('aria-hidden', 'true');
  email.title = LEVELS.share;
  email.setAttribute('aria-label', LEVELS.share);                  // the envelope alone, where room is short, still says what it does
  const copy = Object.assign(document.createElement('button'), { type: 'button', className: 'share-copy', textContent: LEVELS.copyLink });
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(links.levels); } catch { window.prompt(LEVELS.copyLink, links.levels); return; }   // no clipboard: show the link to copy
    copy.textContent = LEVELS.linkCopied;
    setTimeout(() => { copy.textContent = LEVELS.copyLink; }, 2200);
  });
  row.append(email, copy);
  return row;
}
