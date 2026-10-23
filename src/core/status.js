// Level and verdict display. The app reads research/claims.json (statements and their levels) and
// verify/ledger/latest.json (each card's latest verdict and whether it has ever failed). It never writes them.
// A visual can't raise a statement's level: the badge comes from the research file, the verdict from the ledger.

import claims from '../../research/claims.json';
import ledger from '../../verify/ledger/latest.json';
import { h } from './dom.js';

export const LEVELS = {
  1: { name: 'Established', title: 'Level 1: Established / Known' },
  2: { name: 'Derived', title: 'Level 2: Derived connection / Supported inference' },
  3: { name: 'Hypothesis', title: 'Level 3: Testable hypothesis' },
  4: { name: 'Open', title: 'Level 4: Open or speculative connection' },
};

export const REPO = 'https://github.com/nadiapriyam/ENERGEO/blob/main/';

export const statement = (id) => {
  const st = claims.statements[id];
  if (!st) throw new Error(`unknown statement ${id}`);
  return st;
};

export const card = (id) => ledger.cards[id];

export const ledgerStamp = () => ({ generated: ledger.generated, commit: ledger.commit });

export function levelBadge(level) {
  const L = LEVELS[level];
  return h('span', { class: `level level-${level}`, title: L.title }, L.name);
}

export function cardChip(id) {
  const c = card(id);
  if (!c) return h('span', { class: 'card-chip', title: 'No verdict on the ledger yet' }, `${id} no verdict`);
  const fail = c.verdict !== 'PASS';
  return h(
    'span',
    { class: `card-chip${fail ? ' fail' : ''}`, title: `${c.script}: ${c.claim}` },
    `${id} ${c.verdict}`,
    c.everFailed && !fail ? h('span', { class: 'was', title: 'This card has failed before; the failure stays on the ledger.' }, ' (failed before)') : null,
  );
}

/** One statement row: its text, its level badge, and the verdicts of the cards behind it. */
export function statementRow(id) {
  const st = statement(id);
  return h(
    'li',
    { class: 'statement' },
    h('p', null, st.text),
    h(
      'div',
      { class: 'meta' },
      levelBadge(st.level),
      st.cards.map(cardChip),
      st.source ? h('a', { href: REPO + st.source, target: '_blank', rel: 'noopener' }, 'Read it') : null,
    ),
  );
}
