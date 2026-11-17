// Research progress preview (read-only). Renders research/preview.json, which research/tools/preview_data.mjs generates from
// the canonical story, the Foundation, the registry, the #17 and C7 records, the application matrix and the ledger.
// Nothing here computes a status or adds a relation; it only lays the records out.
import '@fontsource/atkinson-hyperlegible-next/latin-400.css';
import '@fontsource/atkinson-hyperlegible-next/latin-400-italic.css';
import '@fontsource/atkinson-hyperlegible-next/latin-600.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-400.css';
import './preview.css';

import data from '../../research/preview.json';
import { h } from '../core/dom.js';
import { tex } from '../core/tex.js';

const CLASS_ORDER = Object.keys(data.classes);
const badge = (cls) => h('span', { class: `badge badge-${cls}`, title: data.classes[cls] }, h('i', { 'aria-hidden': 'true' }), data.classes[cls]);
const badges = (list) => h('span', { class: 'badges' }, ...list.map(badge));
const cards = (list) => (list.length ? h('span', { class: 'cards' }, list.join(' · ')) : null);
const eq = (src) => h('div', { class: 'eq', html: tex(src, true) });

function header() {
  return h('header', { class: 'top' },
    h('p', { class: 'kicker' }, 'Geometry of Representation · research preview'),
    h('h1', null, 'What has been discovered, proved, falsified, and left open'),
    h('p', { class: 'lede' }, 'A read-only view of the repository as it stands. Every statement, status and number below is taken from the research records; nothing is added here.'),
    h('ul', { class: 'locks' }, h('li', null, data.lock.act8), h('li', null, data.lock.p17)),
    h('p', { class: 'stop-top' }, data.lock.stop),
    h('nav', { class: 'toc', 'aria-label': 'Sections' },
      ...[['proved', 'What we have proved'], ['open', 'What is still open'], ['journey', 'How the questions led on'], ['provenance', 'Provenance'], ['numbers', 'Numbers']]
        .map(([id, t]) => h('a', { href: `#${id}` }, t))),
  );
}

function proved() {
  const groups = data.proved.map((g) => {
    const levels = g.id === 'F'
      ? h('div', { class: 'levels' },
          ...g.points.filter((p) => p.cls).map((p) => h('div', { class: `level level-${p.cls}` }, h('span', { class: 'level-mark', 'aria-hidden': 'true' }), h('span', null, p.text), cards(p.cards))))
      : null;
    const points = g.points.filter((p) => !p.cls);
    return h('article', { class: 'result', id: `proved-${g.id}` },
      h('div', { class: 'result-head' }, h('span', { class: 'letter' }, g.id), h('h3', null, g.title)),
      h('p', { class: 'question' }, g.question),
      h('div', { class: 'eqs' }, ...g.tex.map(eq)),
      levels,
      h('ul', { class: 'points' }, ...points.map((p) => h('li', null, p.text, ' ', cards(p.cards)))),
      g.failed ? h('p', { class: 'verdict verdict-failed' }, badge('failed'), ' ', g.failed) : null,
      g.open ? h('p', { class: 'verdict verdict-open' }, badge('open'), ' ', g.open) : null,
      g.novelty ? h('p', { class: 'novelty' }, h('strong', null, g.novelty), ` — ${g.noveltyAppliesTo}.`) : null,
      h('p', { class: 'foot' }, `${g.cardsPass} / ${g.cardsTotal} verifier cards pass`, g.counts ? ` · ${g.counts.spin} spin cases, ${g.counts.mass} mass cases` : '', ` · ${[...new Set(g.provenance)].join(' + ').toLowerCase()}`),
    );
  });
  return h('section', { id: 'proved', class: 'band' },
    h('h2', null, 'What we have actually proved'),
    h('p', { class: 'section-lede' }, 'Six groups of results, each with its question, its exact equations and the cards behind it.'),
    h('div', { class: 'results' }, ...groups));
}

function open() {
  const rows = data.open.map((g) => h('article', { class: 'open-row' },
    h('div', { class: 'open-num' }, g.id),
    h('div', { class: 'open-body' },
      h('h3', null, g.title, ' ', badge(g.status === 'hypothesis' || g.status === 'open' ? 'open' : 'known')),
      h('p', { class: 'quote' }, `“${g.question}”`, h('span', { class: 'rec' }, ` ${g.record}`)),
      h('p', { class: 'meta' },
        h('span', null, `${g.evidencePass} cited cards pass`),
        g.failures.length ? h('span', null, ` · known counterexamples / evidence against: ${g.failures.map((f) => f.card).join(', ')}`) : h('span', null, ' · no counterexample carded yet')),
      g.related.length
        ? h('details', { class: 'more' }, h('summary', null, `${g.related.length} related record${g.related.length > 1 ? 's' : ''}`),
            h('ul', null, ...g.related.map((r) => h('li', null, h('span', { class: 'rec' }, r.id), ` (${r.status}) — “${r.words}”`))),
            g.failures.length ? h('ul', { class: 'against' }, ...g.failures.map((f) => h('li', null, h('span', { class: 'rec' }, f.card), ` ${f.note}`))) : null)
        : null)));
  return h('section', { id: 'open', class: 'band' },
    h('h2', null, 'What is still open'),
    h('p', { class: 'section-lede' }, 'Each question in its exact recorded wording, with how much is carded around it and what is already known to fail. No confidence is assigned.'),
    h('div', { class: 'open-list' }, ...rows));
}

function journey() {
  const edgeType = (t) => t.toLowerCase();
  const nodes = data.journey.map((n) => h('li', { class: 'node', id: `node-${n.n}` },
    h('span', { class: 'node-num', 'aria-hidden': 'true' }, String(n.n)),
    h('div', { class: 'node-body' },
      h('p', { class: 'node-title' }, h('span', { class: 'sr' }, `Node ${n.n}: `), n.title),
      h('p', { class: 'node-q' }, n.question),
      h('p', { class: 'node-rel' }, n.relation),
      badges(n.status),
      h('details', { class: 'more' }, h('summary', null, 'Details'),
        h('dl', null,
          h('dt', null, 'Predecessor'), h('dd', null, n.predecessors.length ? n.predecessors.map((p) => `#${p.node} (${edgeType(p.type)})`).join(', ') : '— (none in the record)'),
          h('dt', null, 'Cross-references (not causal)'), h('dd', null, n.crossReferences.length ? n.crossReferences.map((x) => `#${x.from} ⇢ #${x.to}`).join(', ') : '—'),
          h('dt', null, 'Next question'), h('dd', null, n.next),
          h('dt', null, 'Outgoing edge'), h('dd', null, n.outgoing.map((o) => `#${o.node}: ${edgeType(o.type)}`).join('; ') || '—'),
          n.evidence.length ? h('dt', null, 'Records and equations') : null,
          n.evidence.length ? h('dd', null, h('ul', { class: 'evidence' }, ...n.evidence.slice(0, 6).map((e) => h('li', null, badge(e.cls), ' ', h('span', { class: 'rec' }, e.id), ` ${e.name}`, e.equation && e.equation !== '—' && !e.equation.startsWith('— (') ? [' — ', h('span', { class: 'eqtext' }, e.equation)] : null)))) : null,
          n.failures.length ? h('dt', null, 'Failed or refined here') : null,
          n.failures.length ? h('dd', null, h('ul', null, ...n.failures.map((f) => h('li', null, h('em', null, f.failure), ' — ', f.taught)))) : null,
        )))));
  return h('section', { id: 'journey', class: 'band' },
    h('h2', null, 'How the questions led from one result to the next'),
    h('p', { class: 'section-lede' }, 'The canonical 20-node story, in order. Open a node for its predecessor, cross-references, next question and the exact equations of its records.'),
    h('ol', { class: 'journey' }, ...nodes));
}

function provenance() {
  return h('section', { id: 'provenance', class: 'band band-narrow' },
    h('h2', null, 'Provenance'),
    h('dl', { class: 'legend' }, ...data.provenance.flatMap((p) => [h('dt', null, p.label), h('dd', null, p.text)])),
    h('h3', null, 'Status marks used in the journey'),
    h('p', { class: 'legend-badges' }, ...CLASS_ORDER.map(badge)));
}

function numbers() {
  return h('section', { id: 'numbers', class: 'band band-narrow' },
    h('h2', null, 'Numbers'),
    h('p', { class: 'note' }, data.note),
    h('p', { class: 'note note-counts' }, data.countsNote),
    h('dl', { class: 'numbers' }, ...data.numbers.flatMap((n) => [h('dt', null, n.label, n.detail ? h('span', { class: 'num-detail' }, n.detail) : null), h('dd', null, h('span', { class: 'num' }, n.value))])));
}

function footer() {
  return h('footer', { class: 'bottom' },
    h('p', { class: 'stop' }, data.lock.stop),
    h('p', { class: 'src' }, `Generated from: ${data.generatedFrom.join(', ')}.`));
}

document.getElementById('preview').replaceChildren(header(), proved(), open(), journey(), provenance(), numbers(), footer());
