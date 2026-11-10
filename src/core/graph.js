// The research graph (research/graph.json), read only. Pairs carry questions, never answers; the cards behind each
// transferred question are the source system's, shown so the reader can see where the question came from.

import graph from '../../research/graph.json';
import { h } from './dom.js';
import { levelBadge, cardChip } from './status.js';

const LEVEL = { established: 1, derived: 2, hypothesis: 3, open: 4 };
const objects = new Map(graph.objects.map((o) => [o.id, o]));
const relations = new Map(graph.relations.map((r) => [r.id, r]));
const pairs = new Map(graph.pairs.map((p) => [p.id, p]));

export const pair = (id) => pairs.get(id);
export const relation = (id) => relations.get(id);

const STAGE_OF = (objId) => objects.get(objId)?.stage;

/** A candidate pair as a card: its two objects, what both visibly show, and its status. No common relation is shown. */
/** opts.showShared: show the established shared algebraic form (only after the stages that formalize both sides). */
export function pairCard(id, opts = {}) {
  const p = pairs.get(id);
  const name = id.replace('pair.', 'Pair ');
  const side = (role, o) => h('div', { class: 'pair-side' }, h('span', { class: 'pair-role' }, role), h('span', null, `${objects.get(o.id).label} (stage ${STAGE_OF(o.id)})`));
  return h(
    'div',
    { class: 'pair-card' },
    h('div', { class: 'pair-head' }, h('strong', null, name), levelBadge(LEVEL[p.status]), h('span', { class: 'muted' }, p.directed ? 'directed' : 'not directed')),
    p.directed ? side('source', p.sourceObject) : side('one side', p.sourceObject),
    p.directed ? side('target', p.targetObject) : side('other side', p.targetObject),
    h('p', null, h('span', { class: 'pair-role' }, 'shared observation'), ' ', p.sharedObservation),
    opts.showShared && p.sharedAlgebraicForm
      ? h('p', null, h('span', { class: 'pair-role' }, 'shared algebraic form'), ' ', levelBadge(LEVEL[p.sharedAlgebraicForm.status]), ' ', `${p.sharedAlgebraicForm.description}: ${p.sharedAlgebraicForm.target} and ${p.sharedAlgebraicForm.source}. It does not establish ${p.sharedAlgebraicForm.doesNotEstablish.join('; ')}.`)
      : null,
    h('p', null, h('span', { class: 'pair-role' }, 'deeper common relation'), ' ', 'open; not filled in'),
    p.directionMeaning ? h('p', { class: 'muted' }, p.directionMeaning) : null,
  );
}

/** The transfer questions of a directed pair, as research prompts. */
export function transferCards(id) {
  const p = pairs.get(id);
  return p.transferQuestions.map((q) => {
    const cards = q.learnedFrom.flatMap((rid) => relations.get(rid).cards);
    return h(
      'article',
      { class: 'tq-card' },
      h('div', { class: 'tq-head' }, h('span', { class: 'tq-id' }, q.id), h('strong', null, q.title), levelBadge(LEVEL[q.status])),
      h('p', { class: 'tq-text' }, q.text),
      h('p', { class: 'tq-from' }, h('span', { class: 'pair-role' }, `learned from stage ${STAGE_OF(p.sourceObject.id)}`), ' ', q.context, ' ', ...cards.map(cardChip)),
    );
  });
}
