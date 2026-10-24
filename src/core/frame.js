// The shared interactive frame. Every interactive is a list of stages; every stage supplies:
//   equation, symbols          (left: the mathematical object, every symbol explained)
//   build(ctx) → { figure, controls, update(model), destroy() }   (centre + right)
//   model(ctx)                 (computed only through src/math; views draw what it returns)
//   readouts(model)            (live numbers)
//   steps                      (Guided: the reader acts first, then the text explains what they did)
//   statements                 (ids in research/claims.json; level badges + ledger verdicts)
//   notice                     (what changed / what held / what became visible / what became hidden)
//   carry                      (which object and representation it works on, and how it is derived)
// Modes: Guided shows the steps; Explore frees every control; Advanced adds the full numbers and matrices.

import { h, clear } from './dom.js';
import { createStore, safeStorage } from './store.js';
import { texEl, richText } from './tex.js';
import { statementRow, levelBadge, statement, ledgerStamp, REPO } from './status.js';
import { MASTER_MAP, neighbours } from '../interactives/registry.js';

const MODES = [
  ['guided', 'Guided'],
  ['explore', 'Explore'],
  ['advanced', 'Advanced'],
];

export function mountInteractive(root, def, journey) {
  const progressKey = `energeo.progress.${def.id}`;
  const prefs = createStore({
    mode: safeStorage.read('energeo.mode', 'guided'),
    stage: stageFromHash(def) ?? 0,
    progress: safeStorage.read(progressKey, {}),
  });

  // ── static shell ──
  const modeButtons = MODES.map(([key, label]) =>
    h('button', { type: 'button', role: 'radio', 'data-mode': key, onclick: () => prefs.set({ mode: key }) }, label),
  );
  const header = h(
    'header',
    { class: 'top' },
    h(
      'div',
      { class: 'top-titles' },
      h('div', { class: 'brand' }, h('b', null, 'Geometry of Representation'), h('span', null, `Master Map, interactive ${def.mapNumber}`)),
      h('h1', { class: 'title' }, def.title),
      h('p', { class: 'top-question', html: richText(def.question) }),
    ),
    h('div', { class: 'modes', role: 'radiogroup', 'aria-label': 'Mode' }, modeButtons),
  );
  const railList = h('ol');
  const rail = h('nav', { class: 'rail', 'aria-label': 'Stages' }, railList);
  const left = h('section', { class: 'pane left', 'aria-label': 'Equation and statements' });
  const centre = h('section', { class: 'pane centre', 'aria-label': 'Live geometry' });
  const right = h('section', { class: 'pane right', 'aria-label': 'Controls and readouts' });
  const strip = h('section', { class: 'strip', 'aria-label': 'What changed, what held, and connections' });
  const stamp = ledgerStamp();
  const foot = h(
    'footer',
    { class: 'foot' },
    h('span', null, `Verdicts from the verifier ledger, run ${stamp.generated.slice(0, 16).replace('T', ' ')} UTC (commit ${stamp.commit}).`),
    h('span', null, 'Every number and position on this page is computed by the tested functions in src/math.'),
    h('a', { href: REPO.replace('/blob/main/', ''), target: '_blank', rel: 'noopener' }, 'Source and research files'),
  );
  root.append(h('div', { class: 'app' }, header, rail, h('main', { class: 'plate' }, left, centre, right), strip, foot));

  def.stages.forEach((st, i) => {
    railList.append(
      h('li', null, h('button', { type: 'button', 'data-i': i, onclick: () => go(i) }, h('span', { class: 'num' }, String(i + 1)), h('span', null, st.title), h('span', { class: 'rep', html: richText(`$${st.rep}$`) }))),
    );
  });

  // ── stage lifecycle ──
  let ui = null;
  let ctx = null;
  let readoutEl = null;
  let stepsEl = null;
  let advancedEl = null;

  function go(i) {
    prefs.set({ stage: i });
    const token = `${def.hashPrefix}-${i + 1}`;
    if (location.hash !== `#${token}`) history.replaceState(null, '', `#${token}`);
  }

  window.addEventListener('hashchange', () => {
    const i = stageFromHash(def);
    if (i != null && i !== prefs.get().stage) prefs.set({ stage: i });
  });

  function makeCtx(stage) {
    const flags = {};
    const c = {
      stage,
      flags,
      get mode() {
        return prefs.get().mode;
      },
      data: () => stage.carry.read(journey),
      setData(next) {
        stage.carry.write(journey, next);
        flags.touched = true;
        refresh();
      },
      flag(name, value = true) {
        flags[name] = value;
        refresh();
      },
      refresh: () => refresh(),
      journey,
    };
    return c;
  }

  function renderStage() {
    ui?.destroy?.();
    const st = def.stages[prefs.get().stage];
    document.title = `${def.title}: ${st.title}`;
    ctx = makeCtx(st);
    st.carry.read(journey); // make sure the carried object exists (and is derived) before anything reads its trail
    ui = st.build(ctx);

    clear(centre).append(
      h('div', { class: 'stage-head' }, h('h2', null, `${prefs.get().stage + 1}. ${st.title}`), h('p', { html: richText(st.question) })),
      ui.figure,
    );

    readoutEl = h('dl', { class: 'readouts' });
    clear(right).append(
      h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Controls'), ui.controls),
      h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live readout'), readoutEl),
      ui.instruments ?? null,
    );

    stepsEl = h('ol', { class: 'steps' });
    advancedEl = h('div', { class: 'block advanced' });
    clear(left).append(
      h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'The equation'), texEl(st.equation, { display: true, tag: 'div', cls: 'equation' }), symbolList(st.symbols)),
      h('div', { class: 'block' }, h('div', { class: 'section-label' }, prefs.get().mode === 'guided' ? 'Steps' : 'Things to try'), stepsEl),
      h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Statements on this stage'), h('ul', { class: 'statements' }, st.statements.map(statementRow))),
      advancedEl,
    );

    renderStrip(st);
    renderRail();
    applyMode();
    refresh();
  }

  function symbolList(symbols) {
    const dl = h('dl', { class: 'symbols' });
    for (const [sym, text] of symbols) dl.append(h('dt', { html: richText(`$${sym}$`) }), h('dd', { html: richText(text) }));
    return dl;
  }

  function refresh() {
    const st = def.stages[prefs.get().stage];
    const model = st.model(ctx);
    ui.update(model);

    clear(readoutEl);
    for (const [label, value, cls] of st.readouts(model, ctx)) {
      readoutEl.append(h('dt', { html: richText(label) }), h('dd', { class: cls ?? '' }, value));
    }

    // guided steps: complete in order; each completes when its condition holds after the reader acts
    const progress = { ...prefs.get().progress };
    let done = progress[st.id] ?? 0;
    while (done < st.steps.length && st.steps[done].done(model, ctx)) done += 1;
    if (done !== (progress[st.id] ?? 0)) {
      progress[st.id] = done;
      safeStorage.write(progressKey, progress);
      prefs.set({ progress });
      return; // prefs subscriber re-renders the step list
    }
    renderSteps(st, model);
    if (prefs.get().mode === 'advanced' && st.advanced) clear(advancedEl).append(h('div', { class: 'section-label' }, 'Mathematics in full'), st.advanced(model, ctx));
    else clear(advancedEl);
  }

  function renderSteps(st, model) {
    const done = prefs.get().progress[st.id] ?? 0;
    const guided = prefs.get().mode === 'guided';
    clear(stepsEl);
    st.steps.forEach((step, i) => {
      const state = !guided ? '' : i < done ? 'done' : i === done ? 'current' : 'later';
      const li = h('li', { class: state }, h('span', { class: 'prompt', html: richText(step.prompt) }));
      if (guided && i < done) li.append(h('p', { class: 'then', html: richText(step.then) }));
      if (guided && i === done && step.meter) li.append(h('span', { class: 'meter', html: richText(step.meter(model, ctx)) }));
      stepsEl.append(li);
    });
    if (guided && done >= st.steps.length && prefs.get().stage < def.stages.length - 1) {
      const nx = def.stages[prefs.get().stage + 1];
      stepsEl.append(h('li', { class: 'current' }, h('button', { type: 'button', class: 'btn', onclick: () => go(prefs.get().stage + 1) }, `Carry this into stage ${prefs.get().stage + 2}: ${nx.title}`)));
    }
  }

  function renderStrip(st) {
    const n = st.notice;
    const map = neighbours(def.mapNumber);
    const trail = st.carry.trail(journey);
    clear(strip).append(
      h('div', { class: 'notice' }, h('h3', null, 'What changed'), h('p', { html: richText(n.changed) })),
      h('div', { class: 'notice' }, h('h3', null, 'What stayed the same'), h('p', { html: richText(n.held) })),
      h('div', { class: 'notice' }, h('h3', null, 'What became visible'), h('p', { html: richText(n.visible) })),
      h('div', { class: 'notice' }, h('h3', null, 'What became hidden or lost'), h('p', { html: richText(n.hidden) })),
      h(
        'div',
        { class: 'wide' },
        h('h3', null, `The object you are carrying: ${st.carry.name}`),
        h('ol', { class: 'trail' }, trail.map((t) => h('li', null, h('span', { class: 'rep', html: richText(`$${t.rep}$`) }), t.action))),
      ),
      h(
        'div',
        { class: 'wide' },
        h('h3', null, 'Connections and investigation'),
        h(
          'ul',
          { class: 'links' },
          def.connections.map(([id, note]) => h('li', null, h('a', { href: `${REPO}research/connections/${id}.md`, target: '_blank', rel: 'noopener' }, id), h('span', { class: 'muted' }, note))),
          def.investigation.map((id) =>
            h('li', null, levelBadge(statement(id).level), h('a', { href: REPO + statement(id).source, target: '_blank', rel: 'noopener' }, id.split('.')[0]), h('span', { class: 'muted' }, 'an investigation, not a result')),
          ),
          h('li', null, h('span', null, 'Before:'), mapLink(map.prev)),
          h('li', null, h('span', null, 'After:'), mapLink(map.next)),
        ),
      ),
    );
  }

  const mapLink = (m) => (m ? h('span', null, `${m.n}. ${m.title}`, h('span', { class: 'muted' }, ` (${m.status}${m.note ? `: ${m.note}` : ''})`)) : h('span', { class: 'muted' }, 'none'));

  function renderRail() {
    const { stage, progress } = prefs.get();
    railList.querySelectorAll('button').forEach((b) => {
      const i = Number(b.dataset.i);
      const st = def.stages[i];
      b.toggleAttribute('aria-current', i === stage);
      if (i === stage) b.setAttribute('aria-current', 'step');
      b.parentElement.classList.toggle('done', (progress[st.id] ?? 0) >= st.steps.length);
    });
  }

  function applyMode() {
    const { mode } = prefs.get();
    modeButtons.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
    root.querySelectorAll('[data-modes]').forEach((el) => {
      el.hidden = !el.dataset.modes.split(' ').includes(mode);
    });
  }

  let lastStage = -1;
  let lastMode = '';
  prefs.subscribe(({ stage, mode }) => {
    safeStorage.write('energeo.mode', mode);
    if (stage !== lastStage || mode !== lastMode) {
      lastStage = stage;
      lastMode = mode;
      renderStage();
    } else {
      renderRail();
      refresh();
    }
  });
  lastStage = prefs.get().stage;
  lastMode = prefs.get().mode;
  renderStage();
}

function stageFromHash(def) {
  const m = location.hash.match(new RegExp(`^#${def.hashPrefix}-(\\d+)$`));
  if (!m) return null;
  const i = Number(m[1]) - 1;
  return i >= 0 && i < def.stages.length ? i : null;
}
