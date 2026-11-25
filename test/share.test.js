// Sharing the whole thing by email (docs/levels_spec.md, "All three levels and "Go deeper": share the whole thing by
// email"). Guards: the two links are worked out from the page's address (the levels from the beginning, and the
// research page); the email carries both, encoded for a mailto: link; the buttons are on the "Go deeper" card, in the
// "Scroll through" panel and on the research page; the link preview is set on both pages; every word is in the spec.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { LEVELS, SHARE_BODY } from '../src/levels/copyLevels.js';
import { shareLinks, shareEmail, mailto } from '../src/levels/share.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const SITE = 'https://nadiapriyam.github.io/ENERGEO/';

test('1. the links: the levels from the beginning, and the research page, from wherever they are shared', () => {
  const both = { levels: `${SITE}try/`, deeper: `${SITE}try/deeper/` };
  for (const href of [`${SITE}try/`, `${SITE}try/index.html`, `${SITE}try/?jump=level-2.4`, `${SITE}try/#level-3`, `${SITE}try/?jump=level-3.12#level-3`]) {
    assert.deepEqual(shareLinks(href, 'levels'), both, href);
  }
  for (const href of [`${SITE}try/deeper/`, `${SITE}try/deeper/index.html`, `${SITE}try/deeper/#apps`]) assert.deepEqual(shareLinks(href, 'deeper'), both, href);
  assert.deepEqual(shareLinks('http://localhost:4318/try/'), { levels: 'http://localhost:4318/try/', deeper: 'http://localhost:4318/try/deeper/' }, 'wherever the site is served');
});

test('2. the email: its subject, and a body with both links; a mailto: link with everything encoded and CRLF line breaks', () => {
  const links = shareLinks(`${SITE}try/`);
  const e = shareEmail(links);
  assert.equal(e.subject, LEVELS.shareSubject);
  assert.ok(e.body.includes(`Start here:\n${links.levels}\n`), 'the levels, under "Start here:"');
  assert.ok(e.body.endsWith(`tested so far:\n${links.deeper}`), 'the research, last');
  assert.ok(!/\{levels\}|\{deeper\}/.test(e.body), 'both links filled in');
  const m = mailto(e);
  assert.ok(m.startsWith('mailto:?subject='));
  assert.ok(!/[\s]/.test(m), 'nothing unencoded');
  const u = new URL(m);
  assert.equal(u.searchParams.get('subject'), e.subject);
  assert.equal(u.searchParams.get('body'), e.body.replace(/\n/g, '\r\n'));
  assert.ok(m.includes('%0D%0A') && !/%0A(?<!%0D%0A)/.test(m.replace(/%0D%0A/g, '')), 'line breaks as CRLF');
  assert.ok(m.length < 2000, 'short enough for every email app');
});

test('3. where: the "Go deeper" card, the "Scroll through" panel, the research page (top and end)', () => {
  const page = read('src/levels/page.js');
  assert.match(page, /import \{ shareRow \} from '\.\/share\.js'/);
  assert.match(page, /open, shareRow\('levels', 'card-share'\)\)/, 'on the "Go deeper" card, under its button');
  assert.match(page, /close\), shareRow\('levels', 'side-share'\), parts\)/, 'at the top of the "Scroll through" panel');
  const main = read('src/deeper/main.js');
  assert.match(main, /shareRow\('deeper', 'top-share'\)/);
  assert.match(main, /shareRow\('deeper', 'end-share'\)/);
  const share = read('src/levels/share.js');
  assert.match(share, /navigator\.clipboard\.writeText\(links\.levels\)/, '"Copy link": the levels');
  assert.match(share, /window\.prompt\(LEVELS\.copyLink, links\.levels\)/, 'no clipboard: the link to copy by hand');
  assert.match(share, /email\.setAttribute\('aria-label', LEVELS\.share\)/, 'the envelope alone still says what it does');
  const css = read('src/levels/base.css');
  assert.match(css, /\.reader-column > \.go-deeper \.share-email \.share-text \{ display: none; \}/, 'the slim row: the envelope alone');
});

test('4. the link preview: both pages, one picture from the level, absolute addresses; the levels keep the title "Try this"', () => {
  assert.ok(existsSync(new URL('../public/share/energeo-learn.jpg', import.meta.url)), 'the picture');
  const jpg = readFileSync(new URL('../public/share/energeo-learn.jpg', import.meta.url));
  assert.equal(jpg.readUInt16BE(0), 0xffd8, 'a JPEG');
  assert.ok(jpg.length < 300_000, 'small enough to load quickly');
  for (const [file, url, title] of [['try/index.html', 'try/', 'ENERGEO Learn: three short interactives'], ['try/deeper/index.html', 'try/deeper/', 'The research behind ENERGEO']]) {
    const html = read(file);
    assert.ok(html.includes(`<meta property="og:title" content="${title}" />`), `${file}: title`);
    assert.ok(html.includes(`<meta property="og:url" content="${SITE}${url}" />`), `${file}: its address`);
    assert.ok(html.includes(`<meta property="og:image" content="${SITE}share/energeo-learn.jpg" />`), `${file}: the picture`);
    assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image" />'));
  }
  assert.equal(read('try/index.html').match(/<title>([^<]*)<\/title>/)[1], 'Try this');
});

test('5. every word is in the spec, with Nadia\'s message', () => {
  const spec = read('docs/levels_spec.md');
  assert.ok(spec.includes('> can you make it sharable through email, the whole thing'), "Nadia's message, verbatim");
  for (const k of ['share', 'copyLink', 'linkCopied', 'shareSubject']) assert.ok(spec.includes(`"${LEVELS[k]}"`), `in the spec: ${LEVELS[k]}`);
  for (const l of SHARE_BODY.filter((x) => x && !x.startsWith('{'))) assert.ok(spec.includes(`"${l}"`), `in the spec: ${l}`);
  for (const w of ['"ENERGEO LEARN"', '"Three short interactives"', '"A violin, an MRI scanner and a prism for sound, and the research behind ENERGEO."', '"ENERGEO Learn: three short interactives"']) assert.ok(spec.includes(w), `in the spec: ${w}`);
  const words = [LEVELS.share, LEVELS.copyLink, LEVELS.linkCopied, LEVELS.shareSubject, ...SHARE_BODY].join(' ');
  assert.ok(!/\b(stronger|closer|promising|interesting|important|suggestive|proves?|proven|discover\w*)\b/i.test(words), "no praise, no claim");
});
