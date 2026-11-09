// Chapter I — Changing the Meaning of 0 (Act I). Stages 1, 2, 3 and the return, 3b.
// Each stage is a measurement whose zero holds nonzero objects. The words live in copy.js; every number comes from
// src/math/zero.js. Discovery order (DR-1, DR-4): the left pane shows what is measured and what has been observed;
// the rule appears only at the formalize step, in every mode.

import { h } from '../../core/dom.js';
import { slider, button, row, group, select } from '../../core/controls.js';
import { num, sci } from '../../core/format.js';
import { texEl } from '../../core/tex.js';
import { transferCards } from '../../core/graph.js';
import { cardChip } from '../../core/status.js';
import { createSumPlane } from '../../views/sumPlane.js';
import { createMassPlane } from '../../views/massPlane.js';
import { createConfigStrip } from '../../views/configStrip.js';
import { createZeroIndicator, zeroState, vecText } from '../../views/zeroIndicator.js';
import * as Z from '../../math/zero.js';
import { norm, sub, add, dot, rotationAxisAngle } from '../../math/linalg.js';
import { CHAPTER, STAGES } from './copy.js';

const SUB = ['₁', '₂', '₃', '₄', '₅', '₆'];
const V0 = [1.6, 0.9];
const figure = (...children) => h('div', { class: 'figure' }, children);
const box = (el, max = 440) => h('div', { style: { maxWidth: `${max}px`, width: '100%', justifySelf: 'center' } }, el);
const readingBlock = (indicator) => h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'The reading'), indicator.el);
/** A learner's prediction is a commitment to test, never a research status (R-21). */
const conjectureBox = () => h('div', { class: 'conjecture', hidden: true });

/** Text, steps, observations and formal content for a stage, from copy.js, with the stage's done() rules. */
function fromCopy(num, done) {
  const c = STAGES[num];
  return {
    num: String(num),
    discovery: true,
    title: c.title,
    question: c.question,
    origin: c.origin,
    rep: c.rep,
    measurement: c.measurement,
    observations: c.observations,
    formal: c.formal,
    questions: c.questions,
    notice: c.notice,
    statements: [],
    steps: c.steps.map((s, i) => ({ ...s, done: done[i] })),
  };
}

// ── carried objects ──────────────────────────────────────────────────────────────────────────────
// Three separate objects. None is derived from another: stage 3 is not built from stage 2 (Pair A carries questions,
// never data), and stage 3b reads the very object built in stage 2.
const carry = (id, rep, initial, action, name) => ({
  name,
  read: (J) => J.ensure(id, id, rep, initial(), action).reps[rep].data,
  write: (J, d) => J.update(id, rep, d),
  trail: (J) => J.trail(id),
});
const startPair = () => ({ v: [...V0], w: [-V0[0], -V0[1]], exact: true, prediction: null });
const startMoments = () => ({ ms: Z.tetraConfiguration(1.6), exact: true, adjust: 3, selected: 0, seed: 1, collection: [], predictions: [], change: 'turnAll', pending: null });
const startMasses = () => ({ masses: [1.0, 2.2, 0.8], positions: [[-1.8, 0.9], [1.3, 1.2], [0.4, -1.7]], R: [-1.6, -1.4], exact: false, prediction: null, selected: 1, placing: false, firstZeroCm: null, shiftSign: 1 });
const PAIR = carry('opposition', '\\mathbb R^2', startPair, 'two nonzero arrows in a starting position', 'two arrows, v and w');
const MOMENTS = carry('moments', '(\\mathbb R^3)^n', startMoments, 'four contributions of equal length, in a starting configuration', 'your configuration of contributions');
const MASSES = carry('distribution', '\\mathbb R^2', startMasses, 'three positive masses and a candidate origin R', 'masses in the plane and the point R');

// ── stage 1 ──────────────────────────────────────────────────────────────────────────────────────

const stage1 = {
  id: 'two-arrows',
  ...fromCopy(1, [
    (m, c) => c.observed.has('nonzero') && c.observed.has('zero'),
    (m, c) => c.observed.has('breaks'),
    (m) => !!m.prediction,
    (m, c) => c.observed.has('another'),
    () => true,
  ]),
  rep: '\\mathbb R^2',
  carry: PAIR,
  model(ctx) {
    const d = ctx.data();
    const r = Z.pairResultant(d.v, d.w);
    return { ...d, ...r, zero: zeroState(r.size, d.exact), moved: norm(sub(d.v, V0)) > 0.3 };
  },
  observe(m, ctx) {
    const out = [];
    if (m.lengths[0] > 0.2 && m.lengths[1] > 0.2) out.push('nonzero');
    if (m.zero !== 'none') out.push('zero');
    if (ctx.flags.touched && m.size > 0.3) out.push('breaks');
    if (m.zero !== 'none' && m.moved && ctx.observed.has('breaks')) out.push('another');
    return out;
  },
  readouts: (m) => [
    ['$v + w \\to$', vecText(m.r, 3)],
    ['$|v + w|$', m.size < 1e-3 ? sci(m.size) : num(m.size, 3)],
    ['$\\|v\\|$', num(m.lengths[0], 3)],
    ['$\\|w\\|$', num(m.lengths[1], 3)],
  ],
  advanced(m, ctx, { formal }) {
    const rows = [
      texEl(`v = ${vec2(m.v)},\\quad w = ${vec2(m.w)}`, { display: true, tag: 'div' }),
      texEl(`v + w = ${vec2(m.r, 6)},\\qquad |v + w| = ${m.size < 1e-3 ? sci(m.size).replace('−', '-') : num(m.size, 6)}`, { display: true, tag: 'div' }),
    ];
    if (formal) rows.push(texEl(`v + w = 0 \\iff (v_1 + w_1,\\ v_2 + w_2) = (0, 0) \\iff w = -v = ${vec2(m.v.map((x) => -x))}`, { display: true, tag: 'div', cls: 'equation' }));
    return h('div', null, rows);
  },
  build(ctx) {
    const plane = createSumPlane({
      onDrag: (name, p) => ctx.setData({ ...ctx.data(), [name]: p, exact: false }),
    });
    const indicator = createZeroIndicator();
    const conj = conjectureBox();
    const commit = button({
      label: 'Commit prediction',
      onclick: () => {
        const d = ctx.data();
        ctx.setData({ ...d, prediction: { w: d.w, size: Z.pairResultant(d.v, d.w).size } });
      },
    });
    const exactBtn = button({ label: 'Set w = −v exactly', onclick: () => { const d = ctx.data(); ctx.setData({ ...d, w: d.v.map((x) => -x), exact: true }); } });
    const reset = button({ label: 'Start again', onclick: () => ctx.setData(startPair()) });
    return {
      figure: figure(box(plane.el)),
      controls: group(h('p', { class: 'note' }, 'Drag either tip. A focused tip also moves with the arrow keys.'), row(commit.el, reset.el), exactBtn.el, conj),
      instruments: readingBlock(indicator),
      update(m) {
        plane.update({ v: m.v, w: m.w, r: m.r, zero: m.zero });
        indicator.set({ what: 'v + w', value: m.r, size: m.size, state: m.zero, sizeLabel: '|v + w|' });
        exactBtn.el.hidden = !ctx.formal;
        conj.hidden = !m.prediction;
        if (m.prediction) conj.innerHTML = `<b>Your prediction.</b> w = ${vecText(m.prediction.w)}. The reading there: |v + w| = ${num(m.prediction.size, 3)}.`;
      },
    };
  },
};
const vec2 = (v, d = 2) => `(${v.map((x) => num(x, d).replace('−', '-')).join(',\\ ')})`;

// ── stages 2 and 3b: the contributions ───────────────────────────────────────────────────────────

const angleBetween = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (norm(a) * norm(b)))));

function momentsModel(ctx) {
  const d = ctx.data();
  const total = Z.resultant(d.ms);
  const size = norm(total);
  const lengths = d.ms.map(norm);
  const preview = ctx.flags.preview ?? null;
  const pTotal = preview ? Z.resultant(preview) : null;
  return {
    ...d,
    total,
    size,
    lengths,
    zero: zeroState(size, d.exact),
    unequal: Math.max(...lengths) - Math.min(...lengths) > 0.1,
    turned: d.ms.some((m, j) => angleBetween(m, Z.TETRA[j]) > 0.2),
    preview,
    pTotal,
    pSize: pTotal ? norm(pTotal) : null,
  };
}

/** A 3D view that loads three.js on first use, then follows the stage's model. */
function lazyEnsemble(ctx) {
  const host = h('div', { class: 'scene-host' });
  let view = null;
  let lastModel = null;
  import('../../views/ensemble3d.js').then(({ createEnsemble3d }) => {
    view = createEnsemble3d({ onOrbit: () => (ctx.flags.turned = true) });
    host.append(view.el);
    if (lastModel) view.update(lastModel);
  });
  return {
    el: host,
    update(m) {
      lastModel = m;
      view?.update(m);
    },
    destroy: () => view?.destroy(),
  };
}

/** Change one contribution's direction or length while the marked contribution adjusts (exact by construction). */
function contributionControls(ctx) {
  const pick = h('div', { class: 'btn-row', role: 'group', 'aria-label': 'Contribution to change' });
  const pickBtns = [0, 1, 2, 3].map((j) => button({ label: `m${SUB[j]}`, pressed: false, onclick: () => ctx.setData({ ...ctx.data(), selected: j }) }));
  pick.append(...pickBtns.map((b) => b.el));
  const adjustSel = select({
    label: 'Adjusts to keep the total at 0',
    options: [0, 1, 2, 3].map((j) => [String(j), `m${SUB[j]}`]),
    value: String(ctx.data().adjust),
    onchange: (v) => {
      const d = ctx.data();
      ctx.setData({ ...d, adjust: Number(v), selected: d.selected === Number(v) ? (Number(v) + 1) % 4 : d.selected });
    },
  });
  const note = h('p', { class: 'note' });
  const change = (key) => (x) => {
    const d = ctx.data();
    const a = Z.anglesOf(d.ms[d.selected]);
    const next = { ...a, [key]: x };
    const ms = d.ms.map((m, j) => (j === d.selected ? Z.fromAngles(next.az, next.el, next.length) : m));
    const out = Z.completeToZero(ms, d.adjust);
    if (!out.ok) {
      ctx.flags.rejected = true;
      ctx.refresh();
      return;
    }
    ctx.flags.rejected = false;
    ctx.flags.adjusted = true;
    ctx.flags.preview = null;
    ctx.setData({ ...d, ms: out.ms, exact: true });
  };
  const az = slider({ label: 'Direction (around)', min: -Math.PI, max: Math.PI, step: 0.01, value: 0, format: (x) => `${num((x * 180) / Math.PI, 0)}°`, oninput: change('az') });
  const el = slider({ label: 'Tilt (up and down)', min: -1.5, max: 1.5, step: 0.01, value: 0, format: (x) => `${num((x * 180) / Math.PI, 0)}°`, oninput: change('el') });
  const len = slider({ label: 'Length', min: 0.3, max: 2.4, step: 0.01, value: 1, format: (x) => num(x, 2), oninput: change('length') });
  return {
    el: group(h('div', { class: 'sub-label' }, 'Change a contribution'), pick, az.el, el.el, len.el, adjustSel.el, note),
    update(m) {
      pickBtns.forEach((b, j) => b.press(j === m.selected));
      const a = Z.anglesOf(m.ms[m.selected]);
      az.set(a.az);
      el.set(a.el);
      len.set(a.length);
      adjustSel.set(String(m.adjust));
      const locked = m.selected === m.adjust;
      [az, el, len].forEach((s) => s.el.querySelector('input').toggleAttribute('disabled', locked));
      note.textContent = locked
        ? `m${SUB[m.adjust]} is the contribution that adjusts. Pick another one to change.`
        : ctx.flags.rejected
          ? `That change would make m${SUB[m.adjust]} shorter than ${Z.MIN_LENGTH}. Every contribution stays nonzero, so the change was not made.`
          : `Changing m${SUB[m.selected]}: m${SUB[m.adjust]} adjusts so the total stays 0.`;
    },
  };
}

function momentReadouts(m) {
  return [
    ['$\\sum_j m_j \\to$', vecText(m.total, 3)],
    ['$|\\sum_j m_j|$', m.size < 1e-3 ? sci(m.size) : num(m.size, 3)],
    ...m.lengths.map((L, j) => [`$\\|m_${j + 1}\\|$`, num(L, 3)]),
  ];
}

function momentTable(m) {
  const rows = m.ms.map((v, j) => `m_${j + 1} & ${v.map((x) => num(x, 4).replace('−', '-')).join(' & ')} & ${num(norm(v), 4)}`).join('\\\\');
  return texEl(`\\begin{array}{lrrrr} & x & y & z & \\text{length}\\\\ \\hline ${rows}\\\\ \\hline \\textstyle\\sum & ${m.total.map((x) => (Math.abs(x) < 1e-3 ? sci(x).replace('−', '-') : num(x, 4).replace('−', '-'))).join(' & ')} & \\end{array}`, { display: true, tag: 'div', cls: 'equation' });
}

const stage2 = {
  id: 'cancellation',
  ...fromCopy(2, [
    (m, c) => c.observed.has('nonzero') && c.observed.has('zero'),
    (m, c) => c.observed.has('adjusts'),
    (m, c) => c.observed.has('unequal'),
    (m, c) => !!c.flags.generated && c.observed.has('another'),
    () => true,
  ]),
  rep: '(\\mathbb R^3)^n',
  carryLabel: 'Continue to stage',
  pair: 'pair.A',
  carry: MOMENTS,
  model: momentsModel,
  observe(m, ctx) {
    const out = [];
    if (m.lengths.every((L) => L >= Z.MIN_LENGTH)) out.push('nonzero');
    if (m.zero !== 'none') out.push('zero');
    if (ctx.flags.adjusted && m.zero !== 'none') out.push('adjusts');
    if (m.zero !== 'none' && m.unequal) out.push('unequal');
    if (m.zero !== 'none' && m.turned && m.unequal && ctx.flags.generated) out.push('another');
    return out;
  },
  readouts: momentReadouts,
  advanced(m, ctx, { formal }) {
    const parts = [momentTable(m)];
    if (formal) {
      const others = m.ms.filter((_, j) => j !== m.adjust);
      parts.push(texEl(`m_${m.adjust + 1} = -\\Big(\\textstyle\\sum_{j \\ne ${m.adjust + 1}} m_j\\Big) = ${vec3(others.length ? Z.resultant(others).map((x) => -x) : [0, 0, 0])}`, { display: true, tag: 'div', cls: 'equation' }));
    }
    return h('div', null, parts);
  },
  build(ctx) {
    const scene = lazyEnsemble(ctx);
    const indicator = createZeroIndicator();
    const contrib = contributionControls(ctx);
    let showChain = false;
    const chainBtn = button({ label: 'Lay them head to tail', pressed: false, onclick: () => { showChain = !showChain; ctx.refresh(); } });
    const another = button({
      label: 'Another configuration',
      onclick: () => {
        const d = ctx.data();
        ctx.flags.generated = true;
        ctx.setData({ ...d, ms: Z.randomZeroConfiguration(4, d.seed + 1), seed: d.seed + 1, exact: true });
      },
    });
    const equal = button({ label: 'Equal lengths again', onclick: () => ctx.setData({ ...ctx.data(), ms: Z.tetraConfiguration(1.6), exact: true }) });
    return {
      figure: figure(scene.el, h('p', { class: 'caption' }, h('strong', null, 'Drag to turn the view. '), 'Every contribution is drawn from the same point: a contribution has a direction and a length, and no position.')),
      controls: group(contrib.el, row(another.el, equal.el), chainBtn.el),
      instruments: readingBlock(indicator),
      update(m) {
        scene.update({ ms: m.ms, selected: m.selected, adjust: m.adjust, showChain, zero: m.zero });
        indicator.set({ what: 'Σ mⱼ', value: m.total, size: m.size, state: m.zero, sizeLabel: '|Σ mⱼ|' });
        contrib.update(m);
        chainBtn.press(showChain);
      },
      destroy: scene.destroy,
    };
  },
};
const vec3 = (v) => `(${v.map((x) => num(x, 3).replace('−', '-')).join(',\\ ')})`;

// ── stage 3 ──────────────────────────────────────────────────────────────────────────────────────

const stage3 = {
  id: 'balance',
  ...fromCopy(3, [
    (m, c) => c.observed.has('moves'),
    (m, c) => c.observed.has('points'),
    (m) => !!m.prediction,
    (m, c) => c.observed.has('zero') && (c.observed.has('again') || c.observed.has('shifted')),
    () => true,
  ]),
  rep: '\\mathbb R^2',
  carryLabel: 'Continue to stage',
  pair: 'pair.A',
  carry: MASSES,
  model(ctx) {
    const d = ctx.data();
    const M = Z.totalMass(d.masses);
    const { terms, F } = Z.firstMoment(d.masses, d.positions, d.R);
    const size = norm(F);
    const cm = Z.balancingPoint(d.masses, d.positions);
    const tol = Z.ZERO_TOL * M;
    const atPrediction = d.prediction ? norm(Z.firstMoment(d.masses, d.positions, d.prediction).F) : null;
    return { ...d, M, terms, F, size, tol, cm, zero: zeroState(size, d.exact, tol), atPrediction };
  },
  observe(m, ctx) {
    const out = ['positive'];
    const f = ctx.flags;
    if (f.movedR) out.push('moves');
    if (f.movedR && m.size > m.tol) {
      f.samples = f.samples ?? [];
      if (f.samples.every((p) => norm(sub(p, m.R)) > 0.6)) f.samples.push(m.R);
      if (f.samples.length >= 3) out.push('points');
    }
    if (m.zero !== 'none') {
      out.push('zero');
      if (!m.firstZeroCm) ctx.journey.update('distribution', '\\mathbb R^2', { ...ctx.data(), firstZeroCm: m.cm });
      else if (norm(sub(m.cm, m.firstZeroCm)) > 0.3) out.push(f.shifted ? 'shifted' : 'again');
    }
    return out;
  },
  readouts: (m, ctx) => [
    ['$F(R) \\to$', vecText(m.F, 3)],
    ['$|F(R)|$', m.size < 1e-3 ? sci(m.size) : num(m.size, 3)],
    ['$R$', vecText(m.R)],
    ['total mass', num(m.M, 2)],
    ...(ctx.formal ? [['$R_{\\mathrm{CM}}$', vecText(m.cm, 3)]] : []),
  ],
  advanced(m, ctx, { formal }) {
    const rows = m.masses.map((mi, i) => `${i + 1} & ${num(mi, 2)} & ${vec2(m.positions[i])} & ${vec2(m.terms[i], 3)}`).join('\\\\');
    const parts = [texEl(`\\begin{array}{clll} i & m_i & r_i & m_i(r_i - R)\\\\ \\hline ${rows}\\\\ \\hline & & & F(R) = ${vec2(m.F, 4)}\\end{array}`, { display: true, tag: 'div', cls: 'equation' })];
    if (formal) {
      parts.push(texEl(`M\\,(R_{\\mathrm{CM}} - R) = ${num(m.M, 2)}\\,\\big(${vec2(m.cm, 3)} - ${vec2(m.R, 3)}\\big) = ${vec2(m.F, 4)}`, { display: true, tag: 'div', cls: 'equation' }));
    }
    return h('div', null, parts);
  },
  build(ctx) {
    const set = (patch) => ctx.setData({ ...ctx.data(), ...patch });
    const plane = createMassPlane({
      onMoveR: (p) => {
        ctx.flags.movedR = true;
        set({ R: p, exact: false });
      },
      onMoveMass: (i, p) => {
        const d = ctx.data();
        set({ positions: d.positions.map((q, k) => (k === i ? p : q)), exact: false });
      },
      onSelect: (i) => set({ selected: i }),
      onPlace: (p) => set({ prediction: p, placing: false }),
    });
    const indicator = createZeroIndicator();
    const conj = conjectureBox();
    const massSl = slider({
      label: 'Selected mass',
      min: 0.3, max: 3, step: 0.05, value: ctx.data().masses[ctx.data().selected],
      format: (x) => num(x, 2),
      oninput: (x) => {
        const d = ctx.data();
        set({ masses: d.masses.map((m, i) => (i === d.selected ? x : m)), exact: false });
      },
    });
    const place = button({ label: 'Place prediction', pressed: false, onclick: () => set({ placing: !ctx.data().placing }) });
    const shift = button({
      label: 'Shift every mass',
      onclick: () => {
        const d = ctx.data();
        const a = [0.7 * d.shiftSign, 0.45 * d.shiftSign];
        ctx.flags.shifted = true;
        set({ positions: d.positions.map((p) => add(p, a)), shiftSign: -d.shiftSign, exact: false });
      },
    });
    const exactBtn = button({ label: 'Put R at R_CM exactly', onclick: () => { const d = ctx.data(); set({ R: Z.balancingPoint(d.masses, d.positions), exact: true }); } });
    const reset = button({ label: 'Start again', onclick: () => ctx.setData(startMasses()) });
    return {
      figure: figure(box(plane.el, 460), h('p', { class: 'caption' }, h('strong', null, 'One scale for every arrow. '), 'The weighted displacements and their resultant F(R) are drawn from R at 0.22 of their size.')),
      controls: group(h('p', { class: 'note' }, 'Drag R or a mass. Tap a mass to select it.'), massSl.el, row(place.el, shift.el), row(exactBtn.el, reset.el), conj),
      instruments: readingBlock(indicator),
      update(m) {
        plane.update({ ...m, cm: ctx.formal ? m.cm : null, zero: m.zero });
        indicator.set({ what: 'F(R)', value: m.F, size: m.size, state: m.zero, tol: num(m.tol, 3), sizeLabel: '|F(R)|' });
        massSl.set(m.masses[m.selected]);
        place.press(!!m.placing);
        exactBtn.el.hidden = !ctx.formal;
        conj.hidden = !m.prediction;
        if (m.prediction) conj.innerHTML = `<b>Your prediction.</b> ${vecText(m.prediction)}. The reading there: |F| = ${num(m.atPrediction, 3)}.`;
      },
    };
  },
};

// ── stage 3b ─────────────────────────────────────────────────────────────────────────────────────

const TURN = rotationAxisAngle([0.4, 1, 0.3], 0.6);
const CHANGE_FNS = {
  turnAll: (ms) => Z.CHANGES.turnAll(ms, TURN),
  scaleAll: (ms) => Z.CHANGES.scaleAll(ms, 1.5),
  reverseAll: (ms) => Z.CHANGES.reverseAll(ms),
  swap: (ms) => Z.CHANGES.swap(ms, 0, 2),
  turnOne: (ms) => Z.CHANGES.turnOne(ms, 1, TURN),
  scaleOne: (ms) => Z.CHANGES.scaleOne(ms, 1, 1.5),
};
const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

const stage3b = {
  id: 'return',
  ...fromCopy('3b', [
    (m, c) => c.observed.has('same'),
    (m) => m.collection.length >= 3,
    (m) => m.predictions.length >= 1,
    (m, c) => c.observed.has('keeps') && c.observed.has('leaves'),
  ]),
  rep: '(\\mathbb R^3)^n',
  carryLabel: 'Return to stage',
  pair: 'pair.A',
  carry: MOMENTS,
  model: momentsModel,
  observe(m, ctx) {
    const out = [];
    if (m.zero !== 'none') out.push('same');
    if (ctx.flags.twisted && m.zero !== 'none') out.push('twist');
    if (m.collection.length >= 2) out.push('collected');
    if (m.predictions.some((p) => p.kept)) out.push('keeps');
    if (m.predictions.some((p) => !p.kept)) out.push('leaves');
    return out;
  },
  readouts: (m) => [
    ...momentReadouts(m),
    ...(m.preview ? [['preview, not applied: $\\sum_j m_j \\to$', vecText(m.pTotal, 3)]] : []),
  ],
  advanced(m) {
    return h(
      'div',
      null,
      momentTable(m),
      h('p', { class: 'note' }, 'Turning a pair together keeps the pair’s sum: ', cardChip('Z2c'), '. Changing one contribution while another adjusts: ', cardChip('Z2b2'), '.'),
    );
  },
  build(ctx) {
    const scene = lazyEnsemble(ctx);
    const indicator = createZeroIndicator();
    const contrib = contributionControls(ctx);
    const strip = createConfigStrip();
    const conj = conjectureBox();
    const C = STAGES['3b'];
    let pairIdx = 1;
    const pairSel = select({ label: 'Pair', options: PAIRS.map(([i, j], k) => [String(k), `m${SUB[i]} and m${SUB[j]}`]), value: String(pairIdx), onchange: (v) => (pairIdx = Number(v)) });
    const twist = (sign) => () => {
      const d = ctx.data();
      const [i, j] = PAIRS[pairIdx];
      ctx.flags.twisted = true;
      ctx.flags.preview = null;
      ctx.setData({ ...d, ms: Z.pairTwist(d.ms, i, j, (sign * 20 * Math.PI) / 180), exact: true });
    };
    const tw1 = button({ label: 'Turn the pair −20°', onclick: twist(-1) });
    const tw2 = button({ label: 'Turn the pair +20°', onclick: twist(1) });
    const collect = button({ label: 'Collect this configuration', onclick: () => { const d = ctx.data(); ctx.setData({ ...d, collection: [...d.collection, { ms: d.ms, exact: d.exact }].slice(-8) }); } });

    const changeSel = select({ label: 'A change to test', options: Object.entries(C.changes), value: ctx.data().change, onchange: (v) => { ctx.flags.preview = null; ctx.setData({ ...ctx.data(), change: v, pending: null }); } });
    const predictKeep = button({ label: 'Predict: stays 0', onclick: () => ctx.setData({ ...ctx.data(), pending: 'stays' }) });
    const predictLeave = button({ label: 'Predict: leaves 0', onclick: () => ctx.setData({ ...ctx.data(), pending: 'leaves' }) });
    const apply = button({
      label: 'Apply',
      onclick: () => {
        const d = ctx.data();
        if (!d.pending) return;
        const next = CHANGE_FNS[d.change](d.ms);
        const kept = norm(Z.resultant(next)) < 1e-9;
        const predictions = [...d.predictions, { change: d.change, predicted: d.pending, kept }];
        if (kept) {
          ctx.flags.preview = null;
          ctx.setData({ ...d, ms: next, exact: true, pending: null, predictions });
        } else {
          ctx.flags.preview = next;
          ctx.setData({ ...d, pending: null, predictions });
        }
      },
    });
    const back = button({ label: 'Back to the zero', onclick: () => { ctx.flags.preview = null; ctx.refresh(); } });

    const tq = h('section', { class: 'transfer' }, h('h3', null, 'Questions brought back from the mass zero'), h('p', { class: 'note' }, C.transferIntro), ...transferCards('pair.A'));
    return {
      figure: figure(
        scene.el,
        h('p', { class: 'caption' }, h('strong', null, 'Collected configurations. '), 'Each is drawn in one fixed oblique view, which is a 2D picture, not the configuration itself.'),
        strip.el,
        tq,
      ),
      controls: group(
        h('div', { class: 'sub-label' }, 'Move without leaving 0'),
        pairSel.el,
        row(tw1.el, tw2.el),
        contrib.el,
        collect.el,
        h('div', { class: 'sub-label' }, 'Test a change'),
        changeSel.el,
        row(predictKeep.el, predictLeave.el),
        row(apply.el, back.el),
        conj,
      ),
      instruments: readingBlock(indicator),
      update(m) {
        scene.update({ ms: m.ms, selected: m.selected, adjust: m.adjust, preview: m.preview, zero: m.zero });
        if (m.preview) indicator.set({ what: 'Preview, not applied: Σ mⱼ', value: m.pTotal, size: m.pSize, state: zeroState(m.pSize, false), sizeLabel: '|Σ mⱼ|' });
        else indicator.set({ what: 'Σ mⱼ', value: m.total, size: m.size, state: m.zero, sizeLabel: '|Σ mⱼ|' });
        contrib.update(m);
        strip.update(m.collection);
        changeSel.set(m.change);
        predictKeep.press(m.pending === 'stays');
        predictLeave.press(m.pending === 'leaves');
        apply.el.toggleAttribute('disabled', !m.pending);
        back.el.hidden = !m.preview;
        const n = m.predictions.length;
        conj.hidden = !n && !m.pending;
        const matched = m.predictions.filter((p) => (p.predicted === 'stays') === p.kept).length;
        conj.innerHTML = [
          m.pending ? `<b>Committed:</b> “${C.changes[m.change]}” ${m.pending === 'stays' ? 'stays 0' : 'leaves 0'}. Press Apply to test it.` : '',
          n ? `<b>Your predictions:</b> ${matched} of ${n} matched the test.<br>${m.predictions.slice(-4).map((p) => `${C.changes[p.change]}: predicted ${p.predicted === 'stays' ? 'stays' : 'leaves'}, ${p.kept ? 'stayed 0' : 'would leave 0'}`).join('<br>')}` : '',
        ].filter(Boolean).join('<br>');
      },
      destroy: scene.destroy,
    };
  },
};

export default {
  id: 'zero',
  kicker: CHAPTER.kicker,
  title: CHAPTER.title,
  question: CHAPTER.question,
  hashPrefix: 's',
  stages: [stage1, stage2, stage3, stage3b],
  connections: [],
  investigation: [
    ['backbone.primary', 'Primary backbone'],
    ['idea.hidden-family', 'A zero and its hidden family'],
  ],
  map: { prev: null, next: { n: 'Chapter II', title: 'One Relation, Different Forms', status: 'not built' } },
};
