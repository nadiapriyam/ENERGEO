// Fourier Coefficients and Orthonormal Bases (Master Map 7). Basis e_k(t) = e^{2πikt} on [0, 1] (your C4b form).
// Builds a signal from coefficient arrows, recovers each coefficient as a projection, removes one exactly,
// then tilts the basis to show cross-talk. The signal is carried into Orthogonality and Zero (#8).

import { h } from '../../core/dom.js';
import { slider, button, row, group } from '../../core/controls.js';
import { num, sci, deg } from '../../core/format.js';
import { texEl } from '../../core/tex.js';
import { createPhasorPanel } from '../../views/phasorPanel.js';
import { createWavesPlot } from '../../views/wavesPlot.js';
import { createWindingView } from '../../views/windingView.js';
import { createEnergyBars } from '../../views/energyBars.js';
import { createComponentBars } from '../../views/componentBars.js';
import { createGramMatrix } from '../../views/gramMatrix.js';
import { cx, sampleSignal, energy, energyFromSamples, winding, componentProjections, crosstalk, valueFromVector, fourierIndex } from '../../math/coefficients.js';
import { SIGNAL, C3, DEFAULT_SIGNAL, readSignal } from '../signal.js';

const K = 3;
const SUBS = ['₁', '₂', '₃'];
const cTex = (c) => `${num(c[0], 3)} ${c[1] < 0 ? '-' : '+'} ${num(Math.abs(c[1]), 3)}\\,i`;
const cText = (c) => `${num(c[0], 3)} ${c[1] < 0 ? '−' : '+'} ${num(Math.abs(c[1]), 3)}i`;

const SIG = {
  name: 'your signal f',
  read: (J) => readSignal(J),
  write: (J, d) => J.update(SIGNAL, C3, d),
  trail: (J) => J.trail(SIGNAL),
};

function figure(...children) {
  return h('div', { class: 'figure' }, children);
}

const coefReadouts = (sig) => sig.coeffs.map((c, i) => [`$\\hat f(${i + 1})$`, sig.active[i] ? cText(c) : 'removed']);

function wavesRows(sig, { ghostRemoved = false } = {}) {
  const samp = sampleSignal(sig.coeffs, { active: sig.active });
  const full = ghostRemoved ? sampleSignal(sig.coeffs) : null;
  const rows = [
    {
      label: 'f, the sum',
      yMax: 4.5,
      series: [...(full ? [{ values: full.f, style: 'ghost' }] : []), { values: samp.f, style: 'ink', width: 2.25 }],
    },
    ...samp.comps.map((vals, i) => ({
      label: sig.active[i] ? `harmonic ${i + 1}` : `harmonic ${i + 1}, removed`,
      muted: !sig.active[i],
      yMax: 2.5,
      series: [{ values: vals, style: sig.active[i] ? 'ink2' : 'ghost' }],
    })),
  ];
  return { t: samp.t, rows };
}

const ROW_SPEC = [{ height: 110 }, { height: 62 }, { height: 62 }, { height: 62 }];

const stage1 = {
  id: 'signal',
  title: 'Your signal',
  rep: '\\hat f(k)',
  question: 'A signal built from three harmonics. Each coefficient $\\hat f(k)$ is a complex number: drag its arrow to change the amplitude (its length) and the phase (its angle) of harmonic $k$.',
  equation: '\\begin{aligned} f(t) &= \\sum_{k\\neq 0}\\hat f(k)\\,e^{2\\pi i k t}\\\\ &= \\sum_{k=1}^{3} 2\\,\\mathrm{Re}\\big(\\hat f(k)\\,e^{2\\pi i k t}\\big)\\end{aligned}',
  symbols: [
    ['e_k(t) = e^{2\\pi i k t}', 'the basis waves: a point going round the circle $k$ times per period'],
    ['\\hat f(k)', 'the coefficient: how much of $e_k$, and with what phase'],
    ['\\hat f(-k) = \\overline{\\hat f(k)}', 'forced because $f$ is real, so only $k = 1, 2, 3$ are drawn'],
  ],
  statements: ['coef.basis'],
  carry: SIG,
  steps: [
    { prompt: 'Drag the arrow of $\\hat f(2)$.', done: (m, c) => !!c.flags.touched, then: 'Harmonic 2 changed size with the arrow’s length and shifted in time with its angle. The other two harmonics did not change at all, and the sum changed by exactly what harmonic 2 changed.' },
    {
      prompt: 'Turn the arrow of $\\hat f(1)$ by about a quarter turn.',
      meter: (m) => `phase of $\\hat f(1)$: ${deg(cx.arg(m.sig.coeffs[0]), 0)}`,
      done: (m, c) => {
        const a0 = cx.arg(DEFAULT_SIGNAL.coeffs[0]);
        let d = Math.abs(cx.arg(m.sig.coeffs[0]) - a0);
        if (d > Math.PI) d = 2 * Math.PI - d;
        return !!c.flags.touched && d > Math.PI / 3;
      },
      then: 'Turning the arrow slides harmonic 1 along in time without changing its size. Amplitude is the length, phase is the angle.',
    },
  ],
  notice: {
    changed: 'One harmonic at a time, and the sum by exactly that harmonic’s change.',
    held: 'The basis waves $e_k$, and every coefficient you did not touch.',
    visible: 'A wave as a short list of arrows: one complex number per harmonic.',
    hidden: 'Nothing is lost: the arrows determine the wave, and stage 2 recovers the arrows from the wave.',
  },
  model: (ctx) => ({ sig: ctx.data() }),
  readouts: (m) => [...coefReadouts(m.sig), ['$\\|f\\|^2$', num(energy(m.sig.coeffs, m.sig.active).total)]],
  advanced: (m) => texEl(`f(t) = ${m.sig.coeffs.map((c, i) => `2\\,\\mathrm{Re}\\big((${cTex(c)})\\,e^{${2 * (i + 1)}\\pi i t}\\big)`).join(' + ')}`, { display: true, tag: 'div' }),
  build(ctx) {
    const phasors = createPhasorPanel({
      K,
      onDrag: (i, p) => {
        const d = ctx.data();
        const coeffs = d.coeffs.map((c, j) => (j === i ? p : c));
        ctx.setData({ ...d, coeffs });
      },
    });
    const waves = createWavesPlot({ rows: ROW_SPEC });
    const reset = button({ label: 'Reset the example signal', onclick: () => ctx.setData({ ...DEFAULT_SIGNAL }) });
    return {
      figure: figure(phasors.el, h('p', { class: 'caption' }, h('strong', null, 'The sum and its three harmonics. '), 'Each row below is one term of the sum; the top row adds them point by point.'), waves.el),
      controls: group(h('p', { class: 'note' }, 'Drag an arrow’s tip, or focus it and use the arrow keys.'), row(reset.el)),
      update(m) {
        phasors.update(m.sig.coeffs, { active: m.sig.active });
        const w = wavesRows(m.sig);
        waves.update(w.t, w.rows);
      },
    };
  },
};

const stage2 = {
  id: 'projection',
  title: 'A coefficient is a projection',
  rep: '\\langle f, e_k\\rangle',
  question: 'How do you get $\\hat f(k)$ back from the wave alone? Wind the wave around the circle at frequency $k$ and take the centre of mass of the curve.',
  equation: '\\hat f(k) = \\langle f, e_k\\rangle = \\int_0^1 f(t)\\,e^{-2\\pi i k t}\\,dt',
  symbols: [
    ['f(t)\\,e^{-2\\pi i k t}', 'the wave wound around the circle at frequency $k$'],
    ['\\langle f, e_k\\rangle', 'the centroid of that wound curve: the projection of $f$ onto $e_k$'],
    ['f_j', 'the $j$-th harmonic of $f$, $2\\,\\mathrm{Re}(\\hat f(j)e^{2\\pi i j t})$'],
  ],
  statements: ['coef.projection', 'coef.independence'],
  carry: SIG,
  steps: [
    { prompt: 'Pick a frequency $k$ to project onto.', done: (m, c) => !!c.flags.picked, then: 'The centroid of the wound curve lands on the dashed arrow, the coefficient you set: projecting onto $e_k$ recovers $\\hat f(k)$ (card O2a). The readout shows the difference is floating-point error.' },
    { prompt: 'Change a different coefficient (not $\\hat f(k)$) and watch the centroid.', done: (m, c) => !!c.flags.otherChanged, then: 'The wound curve changed shape, but its centroid did not move. Every other harmonic contributes exactly 0 to $\\langle f, e_k\\rangle$, because $\\langle e_j, e_k\\rangle = 0$ for $j\\ne k$. That is why each coefficient can be isolated.' },
    { prompt: 'In the 3D view, switch between Side and End.', done: (m, c) => !!c.flags.viewed, then: 'From the side you see time. From the end, the time axis collapses and you see the winding picture: the same curve, a different projection. The line through the centroid becomes a single point, the coefficient.' },
  ],
  notice: {
    changed: 'The frequency you project onto, and the shape of the wound curve.',
    held: 'The centroid for frequency $k$, whatever the other harmonics do.',
    visible: 'A coefficient as a centre of mass: the projection made geometric.',
    hidden: 'In the end view, time order is hidden: the projection keeps where the curve goes, not when.',
  },
  model(ctx) {
    const sig = ctx.data();
    const k = sig.k ?? 2;
    const wound = winding(sig.coeffs, k, { active: sig.active });
    const given = sig.active[k - 1] ? sig.coeffs[k - 1] : [0, 0];
    const live = sig.coeffs.map((c, i) => (sig.active[i] ? c : [0, 0]));
    return { sig, k, wound, given, contrib: componentProjections(live, k), diff: cx.abs(cx.sub(wound.centroid, given)) };
  },
  readouts: (m) => [
    ['$k$', String(m.k)],
    ['centroid $\\langle f, e_k\\rangle$', cText(m.wound.centroid)],
    ['coefficient $\\hat f(k)$ as set', cText(m.given)],
    ['difference', sci(m.diff)],
  ],
  advanced: (m) =>
    texEl(`\\langle f, e_${m.k}\\rangle = \\frac1M\\sum_{j=0}^{M-1} f(\\tfrac jM)\\,e^{-2\\pi i ${m.k} j/M} = ${cTex(m.wound.centroid)}\\quad (M = 720,\\ \\text{exact for trigonometric polynomials of degree} < M)`, { display: true, tag: 'div' }),
  build(ctx) {
    const wind = createWindingView();
    const bars = createComponentBars({ K, title: 'What each harmonic contributes to the projection' });
    const phasors = createPhasorPanel({
      K,
      onDrag: (i, p) => {
        const d = ctx.data();
        if (i !== (d.k ?? 2) - 1) ctx.flags.otherChanged = true;
        ctx.setData({ ...d, coeffs: d.coeffs.map((c, j) => (j === i ? p : c)) });
      },
    });
    const host = h('div', { class: 'scene3d', style: { display: 'grid', placeItems: 'center' } }, h('p', { class: 'fallback' }, 'Loading the 3D view…'));
    let helix = null;
    let last = null;
    let destroyed = false;
    import('../../views/helix3d.js').then(({ createHelix3d }) => {
      if (destroyed) return;
      helix = createHelix3d();
      host.replaceWith(helix.el);
      if (last) helix.update(last);
    });
    const kBtns = [1, 2, 3].map((k) =>
      button({ label: `k = ${k}`, pressed: (ctx.data().k ?? 2) === k, onclick: () => { ctx.flags.picked = true; ctx.setData({ ...ctx.data(), k }); } }),
    );
    const side = button({ label: 'Side view (time)', onclick: () => { helix?.view('side'); ctx.flag('viewed'); } });
    const end = button({ label: 'End view (winding)', onclick: () => { helix?.view('end'); ctx.flag('viewed'); } });
    return {
      figure: figure(
        h('div', { class: 'figure-row' },
          h('div', null, h('p', { class: 'caption' }, h('strong', null, 'Wound around the circle. '), 'The solid arrow is the centroid; the dashed arrow is the coefficient you set.'), wind.el),
          h('div', null, h('p', { class: 'caption' }, h('strong', null, 'The same curve along time. '), 'Drag to orbit. End view looks down the time axis.'), host),
        ),
        h('p', { class: 'caption' }, h('strong', null, 'What each harmonic contributes to ⟨f, eₖ⟩. '), 'Only harmonic k should light up.'),
        bars.el,
        h('p', { class: 'caption' }, h('strong', null, 'The coefficients. '), 'Change one that is not k.'),
        phasors.el,
      ),
      controls: group(h('div', { class: 'control' }, h('span', { class: 'control-label' }, 'Project onto frequency'), row(...kBtns.map((b) => b.el))), row(side.el, end.el)),
      update(m) {
        last = { wound: m.wound };
        wind.update({ wound: m.wound, coefficient: m.given, k: m.k });
        helix?.update(last);
        bars.update({ values: m.contrib, target: `e${SUBS[m.k - 1]}` });
        phasors.update(m.sig.coeffs, { active: m.sig.active });
        kBtns.forEach((b, i) => b.press(m.k === i + 1));
      },
      destroy() {
        destroyed = true;
        helix?.destroy();
      },
    };
  },
};

const stage3 = {
  id: 'remove',
  title: 'Remove a coefficient',
  rep: '\\|f\\|^2',
  question: 'Take one coefficient out. Exactly what disappears, and what stays?',
  equation: '\\begin{aligned}\\|f\\|^2 &= \\int_0^1 f(t)^2\\,dt\\\\ &= \\sum_{k\\ne0}|\\hat f(k)|^2 = 2\\sum_{k\\ge1}|\\hat f(k)|^2\\end{aligned}',
  symbols: [
    ['\\|f\\|^2', 'measured on the wave: $\\int_0^1 f(t)^2\\,dt$'],
    ['2|\\hat f(k)|^2', 'the share of harmonic $k$ (the $\\pm k$ pair of a real signal)'],
  ],
  statements: ['coef.removal'],
  carry: SIG,
  steps: [
    { prompt: 'Remove harmonic 2.', done: (m) => !m.sig.active[1], then: 'Exactly its component left the wave, and $\\|f\\|^2$, measured on the wave, dropped by exactly $2|\\hat f(2)|^2$. The other coefficients, measured again by projection, did not change (card O2b).' },
    { prompt: 'Restore it.', done: (m, c) => m.sig.active.every(Boolean) && !!c.flags.removedOnce, then: 'Removing and restoring are clean because the harmonics are orthogonal: nothing else was entangled with harmonic 2.' },
  ],
  notice: {
    changed: 'One harmonic, and $\\|f\\|^2$ by exactly its share.',
    held: 'Every other coefficient, re-measured by projection.',
    visible: 'Orthogonal components come apart cleanly: their energies simply add.',
    hidden: 'The removed harmonic is gone from the wave; only its coefficient remembers it.',
  },
  model(ctx) {
    const sig = ctx.data();
    if (!sig.active.every(Boolean)) ctx.flags.removedOnce = true;
    const e = energy(sig.coeffs, sig.active);
    const all = energy(sig.coeffs);
    const timeSide = energyFromSamples(sig.coeffs, { active: sig.active });
    const remeasured = [1, 2, 3].map((k) => winding(sig.coeffs, k, { active: sig.active }).centroid);
    const drift = Math.max(...remeasured.map((c, i) => (sig.active[i] ? cx.abs(cx.sub(c, sig.coeffs[i])) : cx.abs(c))));
    return { sig, e, all, timeSide, drift };
  },
  readouts: (m) => [
    ['$\\|f\\|^2$ on the wave', num(m.timeSide, 4)],
    ['$2\\sum|\\hat f(k)|^2$ kept', num(m.e.total, 4)],
    ['drop from the full signal', num(m.all.total - m.timeSide, 4)],
    ['shares removed, $2|\\hat f(k)|^2$', num(m.all.total - m.e.total, 4)],
    ['other coefficients moved by', sci(m.drift)],
  ],
  build(ctx) {
    const waves = createWavesPlot({ rows: ROW_SPEC });
    const bars = createEnergyBars();
    const toggles = [0, 1, 2].map((i) =>
      button({
        label: `Remove harmonic ${i + 1}`,
        pressed: !ctx.data().active[i],
        onclick: () => {
          const d = ctx.data();
          const active = d.active.map((a, j) => (j === i ? !a : a));
          ctx.setData({ ...d, active });
        },
      }),
    );
    return {
      figure: figure(waves.el, h('p', { class: 'caption' }, h('strong', null, 'Energy, two ways. '), 'Top: from the coefficients. Bottom: measured on the wave. The dashed line marks where they meet.'), bars.el),
      controls: group(row(...toggles.map((b) => b.el)), h('p', { class: 'note' }, 'The faint dotted curve in the top row is the full signal, for comparison.')),
      update(m) {
        const w = wavesRows(m.sig, { ghostRemoved: true });
        waves.update(w.t, w.rows);
        bars.update({ parts: m.all.parts, active: m.sig.active, timeSide: m.timeSide });
        toggles.forEach((b, i) => {
          b.press(!m.sig.active[i]);
          b.el.textContent = m.sig.active[i] ? `Remove harmonic ${i + 1}` : `Restore harmonic ${i + 1}`;
        });
      },
    };
  },
};

const IDX = fourierIndex(K);
const GRAM_LABELS = IDX.map((j) => `e${j < 0 ? '₋' : ''}${['', '₁', '₂', '₃'][Math.abs(j)]}`);

const stage4 = {
  id: 'crosstalk',
  title: 'Cross-talk',
  rep: '\\tilde e_k',
  question: 'Tilt the basis so its waves are no longer orthogonal, and project again. What happens to the coefficients?',
  equation: '\\tilde a_k = \\langle f, \\tilde e_k\\rangle,\\qquad G_{jk} = \\langle \\tilde e_j, \\tilde e_k\\rangle',
  symbols: [
    ['\\tilde e_k', 'the basis waves tilted by $\\varepsilon$; each still has length 1'],
    ['\\tilde a_k', 'the naive projection coefficients (dashed arrows)'],
    ['G', 'their Gram matrix; off-diagonal cells are cross-talk'],
  ],
  statements: ['coef.crosstalk', 'ortho.signature'],
  carry: SIG,
  steps: [
    { prompt: 'Push the basis off orthogonal with ε.', done: (m) => m.eps > 0.15, then: 'Off-diagonal cells appear in $G$, the dashed arrows $\\tilde a_k$ drift away from the true coefficients, and the rebuilt wave no longer matches $f$ (card O2f).' },
    { prompt: 'With ε still above 0.15, drag $\\hat f(1)$ and watch the dashed arrows of harmonics 2 and 3.', done: (m, c) => !!c.flags.dragged1 && m.eps > 0.15, then: 'Changing harmonic 1 moved the other naive coefficients: cross-talk. In the bars, harmonics $j \\ne k$ now contribute to $\\tilde a_k$.' },
    { prompt: 'Bring ε back to 0.', done: (m, c) => m.eps === 0 && !!c.flags.wasOff, then: 'Everything separates again: $G = I$, each coefficient is its own projection, and the rebuild is exact. Orthogonality is what made the coefficients independent. The next interactive asks what that zero is, in every representation.' },
  ],
  notice: {
    changed: 'The basis: its Gram matrix, every naive coefficient, and the rebuild.',
    held: 'The signal itself and its true coefficients.',
    visible: 'Cross-talk: in a non-orthogonal basis, coefficients leak into one another.',
    hidden: 'With cross-talk, no single coefficient says how much of one wave is present.',
  },
  model(ctx) {
    const sig = ctx.data();
    const eps = sig.eps ?? 0;
    if (eps > 0.15) ctx.flags.wasOff = true;
    const k = sig.k ?? 2;
    const ct = crosstalk(sig.coeffs, eps, sig.active);
    const naive = [1, 2, 3].map((j) => ct.naive[IDX.indexOf(j)]);
    const leak = [0, 1, 2].map((j) => {
      const only = sig.coeffs.map((c, i) => (i === j && sig.active[i] ? c : [0, 0]));
      return crosstalk(only, eps).naive[IDX.indexOf(k)];
    });
    const t = Array.from({ length: 401 }, (_, i) => i / 400);
    const f = t.map((x) => valueFromVector(ct.F, K, x));
    const rebuilt = t.map((x) => valueFromVector(ct.rebuilt, K, x));
    return { sig, eps, k, ct, naive, leak, t, f, rebuilt };
  },
  readouts: (m) => [
    ['ε', num(m.eps, 2)],
    ...m.naive.map((a, i) => [`$\\tilde a_${i + 1}$ (naive)`, cText(a)]),
  ],
  advanced: (m) => texEl(`G = \\begin{pmatrix}${m.ct.G.map((r) => r.map((x) => num(x, 3)).join('&')).join('\\\\')}\\end{pmatrix}`, { display: true, tag: 'div', cls: 'equation' }),
  build(ctx) {
    const phasors = createPhasorPanel({
      K,
      onDrag: (i, p) => {
        const d = ctx.data();
        if (i === 0) ctx.flags.dragged1 = true;
        ctx.setData({ ...d, coeffs: d.coeffs.map((c, j) => (j === i ? p : c)) });
      },
    });
    const gram = createGramMatrix({ labels: GRAM_LABELS, cell: 40 });
    const bars = createComponentBars({ K, title: 'What each harmonic contributes to one naive coefficient' });
    const waves = createWavesPlot({ rows: [{ height: 120 }] });
    const eps = slider({ label: 'Tilt the basis, ε', min: 0, max: 0.6, step: 0.01, value: ctx.data().eps ?? 0, format: (x) => num(x, 2), oninput: (x) => ctx.setData({ ...ctx.data(), eps: x }) });
    const kBtns = [1, 2, 3].map((k) => button({ label: `ã${SUBS[k - 1]}`, pressed: (ctx.data().k ?? 2) === k, onclick: () => ctx.setData({ ...ctx.data(), k }) }));
    const sigList = h('ul', { class: 'signature' });
    return {
      figure: figure(
        h('p', { class: 'caption' }, h('strong', null, 'True coefficients (solid) and naive projections (dashed). '), 'At ε = 0 they coincide.'),
        phasors.el,
        h('div', { class: 'figure-row' },
          h('div', null, h('p', { class: 'caption' }, h('strong', null, 'Gram matrix of the tilted basis. '), 'Orthonormal means a warm diagonal on an empty field.'), gram.el),
          h('div', null, h('p', { class: 'caption' }, h('strong', null, 'Leakage into one naive coefficient. '), 'Which harmonics contribute to the selected ãₖ.'), bars.el),
        ),
        h('p', { class: 'caption' }, h('strong', null, 'f (solid) and its rebuild Σ ãₖẽₖ (dashed). '), 'Equal curves mean the naive coefficients still work.'),
        waves.el,
      ),
      controls: group(eps.el, h('div', { class: 'control' }, h('span', { class: 'control-label' }, 'Inspect the naive coefficient'), row(...kBtns.map((b) => b.el)))),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'The orthogonality signature (H1-1), live'), sigList),
      update(m) {
        phasors.update(m.sig.coeffs, { active: m.sig.active, ghosts: m.naive });
        gram.update(m.ct.G, { showValues: ctx.mode === 'advanced' });
        bars.update({ values: m.leak, target: `ẽ${SUBS[m.k - 1]}` });
        waves.update(m.t, [{ label: 'f and rebuild', yMax: 4.5, series: [{ values: m.f, style: 'ink', width: 2.25 }, { values: m.rebuilt, style: 'dashed' }] }]);
        eps.set(m.eps);
        kBtns.forEach((b, i) => b.press(m.k === i + 1));
        const items = [
          ['Zero cross terms', 'max |G_jk|, j ≠ k', m.ct.crossTerms],
          ['Coefficients rebuild f', '‖f − Σ ãₖẽₖ‖', m.ct.rebuildError],
          ['Parseval additivity', '‖f‖² − Σ |ãₖ|²', m.ct.parsevalGap],
        ];
        sigList.replaceChildren(
          ...items.map(([name, what, val]) => {
            const holds = Math.abs(val) < 1e-9;
            const state = val === 0 ? 'holds exactly' : holds ? 'holds; the value is floating-point error (|value| < 10⁻⁹)' : 'fails';
            return h('li', { class: holds ? 'holds' : '' }, h('span', null, name), h('span', { class: 'val' }, sci(val)), h('span', { class: 'state' }, `${what}: ${state}`));
          }),
        );
      },
    };
  },
};

export default {
  id: 'coefficients',
  hashPrefix: 'coeff',
  mapNumber: 7,
  title: 'Fourier Coefficients',
  question: 'A wave is a sum of basis waves, $f = \\sum_k \\hat f(k)\\,e_k$, and each coefficient is a projection, $\\hat f(k) = \\langle f, e_k\\rangle$. Why can each coefficient be read off on its own? Because the basis is orthonormal. See what happens when it is not.',
  stages: [stage1, stage2, stage3, stage4],
  connections: [
    ['C4', 'C4b: Fourier series as unitary coordinates, f̂(k) = ⟨f, e_k⟩; your evidence, built'],
    ['C6', 'projection onto orthogonal pieces is how representations decompose'],
    ['C1', 'one preservation equation; here the inner product the basis is orthonormal for'],
  ],
  investigation: ['H1', 'H2.pattern'],
  next: { label: 'Continue to Orthogonality and Zero, carrying your signal', hash: 'ortho-1' },
};

