// "Go deeper" (try/deeper/): the research behind ENERGEO, opened from the end of the final level. Its own words are
// in copyDeeper.js; everything else is laid out from the research records, unchanged: the hypotheses in Nadia's words
// (research/hypotheses/H1–H3.md), the path the questions took and every status (research/preview.json and
// research/canonical_story.json, both generated from the records), and the applications tested (the current version
// of research/application_matrix.md). Nothing here computes a status or adds a relation.
import '../levels/base.css';
import './deeper.css';

import data from '../../research/preview.json';
import story from '../../research/canonical_story.json';
import h1 from '../../research/hypotheses/H1.md?raw';
import h2 from '../../research/hypotheses/H2.md?raw';
import h3 from '../../research/hypotheses/H3.md?raw';
import matrix from '../../research/application_matrix.md?raw';
import { h } from '../core/dom.js';
import { tex } from '../core/tex.js';
import { DEEPER } from './copyDeeper.js';
import { hypothesis, currentApplications } from './records.js';

const badge = (cls) => h('span', { class: `badge badge-${cls}`, title: data.classes[cls] }, h('i', { 'aria-hidden': 'true' }), data.classes[cls]);
const badges = (list) => h('span', { class: 'badges' }, ...list.map(badge));
const eq = (src) => h('div', { class: 'eq', html: tex(src, true) });
const section = (id, title, lede, ...kids) => h('section', { id, class: 'deep-section' }, h('h2', null, title), lede ? h('p', { class: 'deep-lede' }, lede) : null, ...kids);

const hyps = [h1, h2, h3].map(hypothesis);
const apps = currentApplications(matrix);

const page = h('main', { class: 'deeper' },
  h('header', { class: 'deep-top' },
    h('a', { class: 'deep-back', href: '../' }, DEEPER.back),
    h('p', { class: 'deep-kicker' }, DEEPER.kicker),
    h('h1', null, DEEPER.title),
    h('p', { class: 'deep-top-lede' }, DEEPER.lede),
    h('nav', { class: 'deep-toc', 'aria-label': DEEPER.contents }, ...['what', 'path', 'proved', 'open', 'apps'].map((id) => h('a', { href: `#${id}` }, DEEPER[id].title)))),

  section('what', DEEPER.what.title, DEEPER.what.lede,
    h('div', { class: 'hyps' }, ...hyps.map((x) => h('article', { class: 'hyp' },
      h('p', { class: 'hyp-id' }, h('span', null, x.id), h('span', { class: 'badge badge-open' }, h('i', { 'aria-hidden': 'true' }), DEEPER.hypothesis)),
      h('h3', null, x.title),
      h('blockquote', null, x.words)))),
    h('p', { class: 'deep-sub' }, DEEPER.what.evidence),
    h('blockquote', { class: 'evidence' }, hyps[0].evidence),
    h('p', { class: 'deep-sub' }, DEEPER.what.formula),
    eq(String.raw`f(t) = \sum_{k} \hat f(k)\, e^{2\pi i k t}, \qquad \hat f(k) = \langle f, e_k \rangle`),
    h('p', { class: 'deep-sub' }, DEEPER.what.method),
    h('ul', { class: 'rules' }, ...DEEPER.what.rules.map((r) => h('li', null, r))),
    h('p', { class: 'honest' }, DEEPER.what.honest),
    h('p', { class: 'names' }, DEEPER.what.names)),

  section('path', DEEPER.path.title, DEEPER.path.lede,
    h('p', { class: 'deep-sub' }, DEEPER.path.spine),
    h('ol', { class: 'spine' }, ...story.spine.map((s) => h('li', null, s.toLowerCase()))),
    h('ol', { class: 'journey' }, ...data.journey.map((j) => h('li', null,
      h('span', { class: 'j-n' }, j.n),
      h('span', { class: 'j-body' }, h('strong', null, j.title), h('span', { class: 'j-rel' }, j.relation), badges(j.status)))))),

  section('proved', DEEPER.proved.title, DEEPER.proved.lede,
    h('div', { class: 'results' }, ...data.proved.map((g) => h('article', { class: 'result' },
      h('p', { class: 'r-head' }, h('span', { class: 'r-letter' }, g.id), h('strong', null, g.title)),
      h('p', { class: 'r-q' }, g.question),
      eq(g.tex[0]),
      h('p', { class: 'r-foot' }, `${g.cardsPass} / ${g.cardsTotal} verifier cards pass`))))),

  section('open', DEEPER.open.title, DEEPER.open.lede,
    h('ol', { class: 'opens' }, ...data.open.map((g) => h('li', null, h('strong', null, g.title), h('span', null, g.question), badge('open'))))),

  section('apps', DEEPER.apps.title, null,
    h('p', { class: 'deep-sub' }, DEEPER.apps.known),
    h('ul', { class: 'known-apps' }, ...DEEPER.apps.knownList.map(([t, d]) => h('li', null, h('strong', null, t), h('span', null, d), badge('known')))),
    h('p', { class: 'deep-sub' }, DEEPER.apps.tested),
    h('p', { class: 'deep-lede' }, DEEPER.apps.testedLede),
    eq(String.raw`x \text{ real} \iff \hat x(-\omega) = \overline{\hat x(\omega)}`),
    h('div', { class: 'table-wrap' }, h('table', { class: 'apps' },
      h('thead', null, h('tr', null, ...DEEPER.apps.columns.map((c) => h('th', null, c)))),
      h('tbody', null, ...apps.rows.map((r) => h('tr', null, h('td', null, r.candidate), h('td', null, r.result), h('td', null, r.depth), h('td', { class: 'num' }, `${r.support}%`), h('td', { class: 'num' }, `${r.risk}%`)))))),
    h('p', { class: 'novelty' }, apps.novelty),
    h('p', { class: 'deep-sub' }, DEEPER.apps.energeo),
    (() => { const e = data.open.find((g) => /energeo/i.test(g.title)); return h('p', { class: 'energeo-q' }, h('strong', null, e.title), ' ', e.question, ' ', badge('open')); })()),

  h('p', { class: 'deep-more' }, h('a', { href: '../../research-preview/' }, DEEPER.more)));

document.getElementById('deeper').replaceWith(page);
document.title = DEEPER.title;
