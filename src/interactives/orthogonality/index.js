// Orthogonality and Zero (Master Map 8). The relationship ⟨u,v⟩ = 0, carried through eight representations.
// Positions and numbers all come from src/math; this file only wires them to views and words.

import { h } from '../../core/dom.js';
import { slider, button, select, row, group } from '../../core/controls.js';
import { num, signed, deg, signClass, sci } from '../../core/format.js';
import { tex, texEl } from '../../core/tex.js';
import { createVectorPlane } from '../../views/vectorPlane.js';
import { createContributionStrip } from '../../views/contributionStrip.js';
import { createPythagorasBars } from '../../views/pythagorasBars.js';
import { createShadows } from '../../views/shadows.js';
import { createGramMatrix } from '../../views/gramMatrix.js';
import { createCompareBars } from '../../views/compareBars.js';
import { createFunctionPlot } from '../../views/functionPlot.js';
import {
  pairReadings, projectedAngle, rotatePair, pad, coordinatePlanes, coordinateShadow,
  basisSignature, tiltedOrthonormalBasis, perturbBasis,
  sampleWave, sampledInner, functionInner, productCurve, normalisedTrigGram,
} from '../../math/orthogonality.js';
import { add, scale, norm, rotationAxisAngle, dot } from '../../math/linalg.js';
import { trigBasis, basisValue } from '../../math/fourier.js';

const TOL = 0.02; // "orthogonal" in drag stages means |u·v| < 0.02; the readout always shows the exact value
const AXIS = (() => {
  const a = [1, 2, 0.6];
  const n = Math.hypot(...a);
  return a.map((x) => x / n);
})();
const TWO_PI = 2 * Math.PI;
const NICE = [0.25, 0.5, 1, 2, 4, 6, 9, 12, 18, 24, 36];
const nice = (x) => NICE.find((n) => n >= x * 1.02) ?? Math.ceil(x);
const prefixMax = (vals) => {
  let acc = 0;
  let m = 0;
  for (const v of vals) {
    acc += v;
    m = Math.max(m, Math.abs(acc));
  }
  return m;
};
const SUB = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈'];
const vecTex = (x, d = 2) => `\\begin{pmatrix}${x.map((c) => num(c, d)).join('\\\\')}\\end{pmatrix}`;
const matTex = (M, d = 2) => `\\begin{pmatrix}${M.map((r) => r.map((c) => num(c, d)).join('&')).join('\\\\')}\\end{pmatrix}`;
const fnTex = (f) => `\\${f.kind} ${f.k === 1 ? '' : f.k}t`;
const fnText = (f) => `${f.kind} ${f.k === 1 ? '' : f.k}t`;

// ── carried objects ──────────────────────────────────────────────────────────────────────────────
const R2 = '\\mathbb R^2';
const R3 = '\\mathbb R^3';
const R4 = '\\mathbb R^4';
const RN = '\\mathbb R^N';
const L2 = 'L^2[0,L]';
const B4 = '\\{e_k\\}\\subset\\mathbb R^4';

const ensurePair = (J) => J.ensure('pair', 'pair', R2, { u: [2, 0.8], v: [0.6, 1.7] }, 'two arrows in the plane');
const lift = (d) => ({ u: [...d.u, 0], v: [...d.v, 0], theta: 0 });
const shown3 = (d) => (d.theta ? rotatePair(d.u, d.v, AXIS, d.theta) : { u: d.u, v: d.v });

const PAIR2 = {
  name: 'the pair (u, v)',
  read: (J) => (ensurePair(J), J.get('pair').reps[R2].data),
  write: (J, d) => J.update('pair', R2, d),
  trail: (J) => J.trail('pair'),
};
const PAIR3 = {
  ...PAIR2,
  read: (J) => (ensurePair(J), J.rep('pair', R3, R2, lift, 'lifted into space: third coordinate 0')),
  write: (J, d) => J.update('pair', R3, d),
};
const PAIR4 = {
  ...PAIR2,
  read: (J) => {
    PAIR3.read(J);
    return J.rep('pair', R4, R3, (d) => {
      const p = shown3(d);
      return { u: pad(p.u, 4), v: pad(p.v, 4) };
    }, 'given a fourth coordinate, 0');
  },
  write: (J, d) => J.update('pair', R4, d),
};
const BASIS = {
  name: 'a basis of four directions, and x (your v from stage 5)',
  read: (J) => {
    J.ensure('basis', 'basis', B4, { eps: 0, retained: 2 }, 'an orthonormal basis of R⁴, tilted so no vector lies on an axis');
    return { ...J.get('basis').reps[B4].data, x: PAIR4.read(J).v };
  },
  write: (J, d) => J.update('basis', B4, { eps: d.eps, retained: d.retained }),
  trail: (J) => J.trail('basis'),
};
const ensureWaves = (J) => J.ensure('waves', 'waves', RN, { f: { kind: 'cos', k: 1 }, g: { kind: 'cos', k: 3 }, N: 8 }, 'two cosines sampled at N points: two vectors in ℝᴺ');
const WAVES = {
  name: 'two sampled waves (f, g)',
  read: (J) => (ensureWaves(J), J.get('waves').reps[RN].data),
  write: (J, d) => J.update('waves', RN, d),
  trail: (J) => J.trail('waves'),
};
const FUNCS = {
  ...WAVES,
  name: 'two functions (f, g)',
  read: (J) => (ensureWaves(J), J.rep('waves', L2, RN, (d) => ({ f: d.f, g: d.g, L: TWO_PI, showSamples: false, N: d.N }), 'N → ∞: the samples become functions on [0, L]')),
  write: (J, d) => J.update('waves', L2, d),
};

// ── shared pieces ────────────────────────────────────────────────────────────────────────────────
function figure(...children) {
  return h('div', { class: 'figure' }, children);
}

function planeBox(el) {
  return h('div', { style: { maxWidth: '440px', width: '100%', justifySelf: 'center' } }, el);
}

function liveVerdict() {
  const el = h('div', { class: 'verdict', 'aria-live': 'polite' });
  return {
    el,
    set(inner, tol = TOL, what = 'u·v') {
      const ok = Math.abs(inner) < tol;
      el.className = `verdict${ok ? ' holds' : ''}`;
      el.innerHTML = ok
        ? `<b>Orthogonal here.</b> ${what} = ${num(inner, 4)}, within ±${tol} of 0.`
        : `<b>Not orthogonal.</b> ${what} = ${num(inner, 4)}.`;
    },
  };
}

const stripScales = (vals) => ({ yMax: nice(Math.max(...vals.map(Math.abs), 0.1)), runMax: nice(Math.max(prefixMax(vals), 0.1)) });

const pairReadouts = (r) => [
  ['$u\\cdot v$', signed(r.inner), signClass(r.inner)],
  ...r.contributions.map((c, i) => [`$u_${i + 1}v_${i + 1}$`, signed(c), signClass(c)]),
  ['angle', deg(r.angle)],
];

const removeShadow = (u, v) => {
  const r = pairReadings(u, v);
  return norm(r.residual) > 1e-6 ? r.residual : v;
};

const pairAdvanced = (m) =>
  h(
    'div',
    null,
    texEl(`u = ${vecTex(m.u)},\\quad v = ${vecTex(m.v)}`, { display: true, tag: 'div' }),
    texEl(`u\\cdot v = ${m.u.map((ui, i) => `(${num(ui, 2)})(${num(m.v[i], 2)})`).join(' + ')} = ${num(m.r.inner, 4)}`, { display: true, tag: 'div', cls: 'equation' }),
    texEl(`G = \\begin{pmatrix} u\\cdot u & u\\cdot v \\\\ v\\cdot u & v\\cdot v\\end{pmatrix} = ${matTex(m.r.gram, 3)}`, { display: true, tag: 'div' }),
  );

// ── stages ───────────────────────────────────────────────────────────────────────────────────────

const stage1 = {
  id: 'two-arrows',
  title: 'Two arrows',
  rep: R2,
  question: 'Drag the tip of $v$. Below the plane, each coordinate adds a signed contribution to $u\\cdot v$.',
  equation: 'u\\cdot v = u_1v_1 + u_2v_2',
  symbols: [
    ['u,\\ v', 'two arrows, each a pair of numbers'],
    ['u_iv_i', 'what coordinate $i$ contributes: warm if positive, cool if negative'],
    ['u\\cdot v', 'the sum of the contributions: the inner product'],
  ],
  statements: ['ortho.inner-is-sum'],
  carry: PAIR2,
  steps: [
    { prompt: 'Drag the tip of $v$ and watch the two bars.', done: (m, c) => !!c.flags.touched, then: 'Each bar is one coordinate’s contribution $u_iv_i$. Warm bars add to $u\\cdot v$; cool bars subtract from it.' },
    {
      prompt: 'Find a direction for $v$ where the two bars cancel.',
      meter: (m) => `$u\\cdot v$ = ${signed(m.r.inner)} (target: within ±${TOL})`,
      done: (m, c) => {
        if (!m.orthogonal) return false;
        c.flags.side1 = Math.sign(m.u[0] * m.v[1] - m.u[1] * m.v[0]);
        return true;
      },
      then: 'The bars are equal and opposite, so $u\\cdot v = 0$, and the angle is 90°. In the plane, a zero inner product and a right angle are the same fact.',
    },
    {
      prompt: 'Find a second direction, on the other side of $u$, where they cancel.',
      meter: (m) => `$u\\cdot v$ = ${signed(m.r.inner)}`,
      done: (m, c) => {
        if (!m.orthogonal) return false;
        const side = Math.sign(m.u[0] * m.v[1] - m.u[1] * m.v[0]);
        if (!c.flags.side1) {
          c.flags.side1 = side;
          return false;
        }
        return side !== c.flags.side1;
      },
      then: 'Both directions lie on one line through the origin. In the plane, the arrows orthogonal to $u$ form a line.',
    },
  ],
  notice: {
    changed: 'The coordinates of $v$, both contributions, and the angle.',
    held: 'The rule for combining coordinates, $u_1v_1+u_2v_2$.',
    visible: 'Orthogonality as cancellation: two signed contributions summing to zero.',
    hidden: 'Nothing yet. In the plane, the angle and the contributions tell the same story.',
  },
  model(ctx) {
    const { u, v } = ctx.data();
    const r = pairReadings(u, v);
    return { u, v, r, orthogonal: Math.abs(r.inner) < TOL };
  },
  readouts: (m) => pairReadouts(m.r),
  advanced: pairAdvanced,
  build(ctx) {
    const plane = createVectorPlane({
      draggable: ctx.mode === 'guided' ? ['v'] : ['u', 'v'],
      onDrag: (name, p) => ctx.setData({ ...ctx.data(), [name]: p }),
    });
    const strip = createContributionStrip({ title: 'Each coordinate’s contribution uᵢvᵢ', runTitle: 'Adding them up: the running total ends at u·v' });
    const verdict = liveVerdict();
    const reset = button({ label: 'Reset the pair', onclick: () => ctx.setData({ u: [2, 0.8], v: [0.6, 1.7] }) });
    return {
      figure: figure(planeBox(plane.el), strip.el),
      controls: group(h('p', { class: 'note', 'data-modes': 'explore advanced' }, 'Both tips can be dragged. Arrow keys move a focused tip (Shift for larger steps).'), h('p', { class: 'note', 'data-modes': 'guided' }, 'Drag the tip of v, or focus it and use the arrow keys.'), row(reset.el)),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        plane.update({ u: m.u, v: m.v, r: m.r, showShadow: false });
        strip.bars({ values: m.r.contributions, labels: ['u₁v₁', 'u₂v₂'], ...stripScales(m.r.contributions), total: m.r.inner });
        verdict.set(m.r.inner);
      },
    };
  },
};

const stage2 = {
  id: 'shadow',
  title: 'The shadow',
  rep: R2,
  question: 'How much of $v$ lies along $u$? Its shadow on the line of $u$ answers that. When the shadow is gone, $v$ is orthogonal to $u$.',
  equation: '\\operatorname{proj}_u v = \\frac{u\\cdot v}{u\\cdot u}\\,u',
  symbols: [
    ['\\operatorname{proj}_u v', 'the shadow of $v$ on the line through $u$'],
    ['\\tfrac{u\\cdot v}{u\\cdot u}', 'how many copies of $u$ long the shadow is; its sign says which way it points'],
    ['v-\\operatorname{proj}_u v', 'the residual: what is left of $v$ (dashed)'],
  ],
  statements: ['ortho.shadow'],
  carry: PAIR2,
  steps: [
    { prompt: 'Drag $v$ and watch its shadow on the line of $u$.', done: (m, c) => !!c.flags.touched, then: 'The shadow points along $u$ when $u\\cdot v>0$ (warm) and against it when $u\\cdot v<0$ (cool). The dashed residual always meets the line of $u$ at a right angle.' },
    { prompt: 'Make the shadow disappear.', meter: (m) => `shadow length ${num(norm(m.r.shadow), 3)}`, done: (m) => m.orthogonal, then: 'No shadow means no part of $v$ lies along $u$. That is what $u\\cdot v = 0$ says.' },
    { prompt: 'Move $v$ off again, then press Remove the shadow.', done: (m, c) => !!c.flags.removed, then: 'Subtracting the shadow leaves the residual, which is orthogonal to $u$ by construction. Repeated vector by vector, this one step is Gram–Schmidt: a way to build an orthogonal basis without ever seeing it (card S6).' },
  ],
  notice: {
    changed: 'The shadow’s length and the sign of its direction.',
    held: 'The residual is orthogonal to $u$ for every $v$.',
    visible: 'Orthogonality as an absence: no shadow.',
    hidden: 'The shadow does not show the residual’s length: many different $v$ cast the same shadow.',
  },
  model: stage1.model,
  readouts: (m) => [
    ['$u\\cdot v$', signed(m.r.inner), signClass(m.r.inner)],
    ['shadow coefficient $\\tfrac{u\\cdot v}{u\\cdot u}$', signed(m.r.shadowCoeff), signClass(m.r.shadowCoeff)],
    ['shadow length', num(norm(m.r.shadow))],
    ['residual $\\cdot\\, u$', sci(m.r.residualDot)],
  ],
  advanced: pairAdvanced,
  build(ctx) {
    const plane = createVectorPlane({ draggable: ctx.mode === 'guided' ? ['v'] : ['u', 'v'], onDrag: (name, p) => ctx.setData({ ...ctx.data(), [name]: p }) });
    const strip = createContributionStrip({ title: 'Each coordinate’s contribution uᵢvᵢ', runTitle: 'Running total: u·v, which sets the shadow' });
    const verdict = liveVerdict();
    const remove = button({
      label: 'Remove the shadow',
      onclick: () => {
        const d = ctx.data();
        ctx.flags.removed = true;
        ctx.setData({ ...d, v: removeShadow(d.u, d.v) });
      },
    });
    return {
      figure: figure(planeBox(plane.el), strip.el),
      controls: group(row(remove.el), h('p', { class: 'note' }, 'Remove the shadow replaces v with its residual.')),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        plane.update({ u: m.u, v: m.v, r: m.r, showShadow: true });
        strip.bars({ values: m.r.contributions, labels: ['u₁v₁', 'u₂v₂'], ...stripScales(m.r.contributions), total: m.r.inner });
        verdict.set(m.r.inner);
      },
    };
  },
};

const stage3 = {
  id: 'pythagoras',
  title: 'Pythagoras',
  rep: R2,
  question: 'When do squared lengths simply add? Compare $\\|u\\|^2+\\|v\\|^2$ with $\\|u+v\\|^2$.',
  equation: '\\|u+v\\|^2 = \\|u\\|^2 + \\|v\\|^2 + 2\\,u\\cdot v',
  symbols: [
    ['\\|u\\|^2', 'squared length, $u\\cdot u$'],
    ['2\\,u\\cdot v', 'the cross term: the only part that depends on how $u$ and $v$ sit relative to each other'],
  ],
  statements: ['ortho.pythagoras'],
  carry: PAIR2,
  steps: [
    { prompt: 'Drag $v$ and compare the two bars.', done: (m, c) => !!c.flags.touched, then: 'They always differ by exactly $2\\,u\\cdot v$, the cross term: warm when it adds length, cool when it takes length away.' },
    { prompt: 'Make the two bars equal.', meter: (m) => `cross term $2\\,u\\cdot v$ = ${signed(m.r.crossTerm)}`, done: (m) => m.orthogonal, then: 'The cross term is gone, so squared lengths add. The triangle $u$, $v$, $u+v$ has a right angle. Pythagoras holds exactly when $u\\cdot v = 0$.' },
  ],
  notice: {
    changed: 'The cross term, and the length of $u+v$.',
    held: '$\\|u\\|^2$ and $\\|v\\|^2$: neither depends on the angle between the arrows.',
    visible: 'Orthogonality as additivity: no cross term.',
    hidden: 'Which way the cross term pushes shows only in its sign.',
  },
  model: stage1.model,
  readouts: (m) => [
    ['$\\|u\\|^2+\\|v\\|^2$', num(m.r.pythagoras)],
    ['$\\|u+v\\|^2$', num(m.r.normSum2)],
    ['cross term $2\\,u\\cdot v$', signed(m.r.crossTerm), signClass(m.r.crossTerm)],
  ],
  advanced: pairAdvanced,
  build(ctx) {
    const plane = createVectorPlane({ triangle: true, draggable: ctx.mode === 'guided' ? ['v'] : ['u', 'v'], onDrag: (name, p) => ctx.setData({ ...ctx.data(), [name]: p }) });
    const bars = createPythagorasBars();
    const verdict = liveVerdict();
    const remove = button({ label: 'Remove the shadow', modes: 'explore advanced', onclick: () => ctx.setData({ ...ctx.data(), v: removeShadow(ctx.data().u, ctx.data().v) }) });
    return {
      figure: figure(planeBox(plane.el), bars.el),
      controls: group(row(remove.el), h('p', { class: 'note' }, 'The thin dashed copy of v starts at the tip of u, so the three sides form a triangle.')),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        plane.update({ u: m.u, v: m.v, r: m.r, showShadow: false });
        bars.update(m.r);
        verdict.set(m.r.inner);
      },
    };
  },
};

const stage4 = {
  id: 'space',
  title: 'Turn the view',
  rep: R3,
  question: 'Your pair, lifted into space. Orbit the camera: does the right angle survive a change of viewpoint?',
  equation: '(Ru)\\cdot(Rv) = u\\cdot v',
  symbols: [
    ['R', 'any rotation of space. Orbiting the camera is a rotation too, seen from the other side'],
    ['u\\cdot v', '$u_1v_1+u_2v_2+u_3v_3$: now three contributions'],
    ['\\text{screen angle}', 'the angle the arrows make on your screen: a projection of the pair, not the pair'],
  ],
  statements: ['ortho.rotation-invariance', 'ortho.screen-distorts'],
  carry: PAIR3,
  steps: [
    {
      prompt: 'Make the pair orthogonal (Remove the shadow works here too), then drag the figure to orbit the camera.',
      meter: (m) => `$u\\cdot v$ = ${signed(m.r.inner)}, screen angle ${deg(m.screen)}`,
      done: (m, c) => m.orthogonal && !!c.flags.orbited,
      then: 'On screen the angle swings away from 90°, and $u\\cdot v$ does not move. The screen is a projection, and projections do not preserve angles (card O1b).',
    },
    { prompt: 'Turn both vectors with the rotation slider.', done: (m, c) => !!c.flags.rotated, then: 'Every coordinate changed, and so did each contribution $u_iv_i$. Their sum did not: rotations preserve the inner product (card O1a).' },
    {
      prompt: 'Tilt $v$ out of its plane with the height slider, then remove the shadow again.',
      meter: (m) => `$v_3$ = ${num(m.v[2], 2)}, $u\\cdot v$ = ${signed(m.r.inner)}`,
      done: (m) => m.orthogonal && Math.abs(m.v[2]) > 0.3,
      then: 'You found another vector orthogonal to $u$. Show the plane orthogonal to $u$: every arrow in it qualifies. A line of them in the plane, a whole plane of them in space.',
    },
  ],
  notice: {
    changed: 'The screen angle, every coordinate, and every single contribution $u_iv_i$.',
    held: '$u\\cdot v$, the true angle, and both lengths.',
    visible: 'A right angle belongs to the pair, not to the picture of it.',
    hidden: 'The true angle on screen: the camera shows a projection.',
  },
  model(ctx) {
    const d = ctx.data();
    const { u, v } = shown3(d);
    const r = pairReadings(u, v);
    const view = ctx.flags.view ?? [0.55, -0.68, 0.45];
    return {
      u, v, r, theta: d.theta ?? 0,
      orthogonal: Math.abs(r.inner) < TOL,
      screen: projectedAngle(u, v, view),
      view,
      showComplement: !!ctx.flags.complement,
      rotationAxis: (d.theta ?? 0) !== 0 ? AXIS : null,
    };
  },
  readouts: (m) => [...pairReadouts(m.r).slice(0, 4), ['true angle', deg(m.r.angle)], ['screen angle', deg(m.screen)]],
  advanced(m) {
    const R = rotationAxisAngle(AXIS, m.theta);
    return h(
      'div',
      null,
      pairAdvanced(m),
      texEl(`R(\\theta{=}${num(m.theta, 2)}) = ${matTex(R, 3)},\\quad \\text{axis } ${vecTex(AXIS, 3)}`, { display: true, tag: 'div' }),
      texEl(`\\text{view direction } n = ${vecTex(m.view, 3)}`, { display: true, tag: 'div' }),
    );
  },
  build(ctx) {
    const strip = createContributionStrip({ title: 'Each coordinate’s contribution uᵢvᵢ', runTitle: 'Running total: u·v' });
    const verdict = liveVerdict();
    const sceneHost = h('div', { class: 'scene3d', style: { display: 'grid', placeItems: 'center' } }, h('p', { class: 'fallback' }, 'Loading the 3D view…'));
    let scene = null;
    let last = null;
    let destroyed = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    import('../../views/scene3d.js').then(({ createScene3d }) => {
      if (destroyed) return;
      let pending = 0;
      scene = createScene3d({
        onView: (dir, ev) => {
          if (ev === 'interacted') ctx.flags.orbited = true;
          if (dir) ctx.flags.view = dir;
          // camera motion reports every frame; refresh the readouts at most ~20 times a second
          const now = performance.now();
          if (now - pending > 50) {
            pending = now;
            ctx.refresh();
          }
        },
      });
      sceneHost.replaceWith(scene.el);
      if (last) scene.update(last);
    });

    const setShown = (u, v) => {
      // store the base pair so the rotation slider keeps its meaning
      const d = ctx.data();
      const back = d.theta ? rotatePair(u, v, AXIS, -d.theta) : { u, v };
      ctx.setData({ ...d, u: back.u, v: back.v });
    };
    const theta = slider({
      label: 'Turn both vectors, θ',
      min: 0, max: TWO_PI, step: 0.01, value: ctx.data().theta ?? 0,
      format: (x) => deg(x, 0),
      oninput: (x) => {
        ctx.flags.rotated = true;
        ctx.setData({ ...ctx.data(), theta: x });
      },
    });
    const tilt = slider({
      label: 'Height of v, v₃',
      min: -2.2, max: 2.2, step: 0.01, value: shown3(ctx.data()).v[2],
      format: (x) => num(x, 2),
      oninput: (x) => {
        const p = shown3(ctx.data());
        setShown(p.u, [p.v[0], p.v[1], x]);
      },
    });
    const orbit = button({
      label: reduce ? 'Turn the camera 30°' : 'Orbit the camera',
      pressed: reduce ? null : false,
      onclick: () => {
        if (!scene) return;
        if (reduce) scene.turnCamera(30);
        else {
          ctx.flags.orbiting = !ctx.flags.orbiting;
          ctx.flags.orbited = true;
          scene.setOrbit(ctx.flags.orbiting);
          orbit.press(ctx.flags.orbiting);
        }
      },
    });
    const remove = button({ label: 'Remove the shadow', onclick: () => { const p = shown3(ctx.data()); setShown(p.u, removeShadow(p.u, p.v)); } });
    const plane = button({ label: 'Show the plane orthogonal to u', pressed: false, onclick: () => { ctx.flags.complement = !ctx.flags.complement; plane.press(ctx.flags.complement); ctx.refresh(); } });

    return {
      figure: figure(sceneHost, h('p', { class: 'caption' }, h('strong', null, 'Drag to orbit, scroll to zoom. '), 'The camera is orthographic, so the screen angle readout is exactly the angle drawn on your screen.'), strip.el),
      controls: group(row(orbit.el, remove.el), theta.el, tilt.el, row(plane.el)),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        last = m;
        scene?.update(m);
        strip.bars({ values: m.r.contributions, labels: ['u₁v₁', 'u₂v₂', 'u₃v₃'], ...stripScales(m.r.contributions), total: m.r.inner });
        verdict.set(m.r.inner);
        theta.set(m.theta);
        tilt.set(m.v[2]);
      },
      destroy() {
        destroyed = true;
        scene?.destroy();
      },
    };
  },
};

const ONE_PAIR = { u: [1, 1, 1, 1], v: [1, -1, 1, -1] };

const stage5 = {
  id: 'beyond-sight',
  title: 'Beyond sight',
  rep: R4,
  question: 'Four coordinates. No picture can show this pair. Every drawing below is a shadow on one coordinate plane.',
  equation: 'u\\cdot v = \\sum_{i=1}^{4} u_iv_i',
  symbols: [
    ['u,\\ v\\in\\mathbb R^4', 'arrows with four coordinates each'],
    ['(x_i, x_j)', 'a coordinate plane: the shadow keeps two coordinates and drops the other two'],
  ],
  statements: ['ortho.screen-distorts', 'ortho.inner-is-sum'],
  carry: PAIR4,
  steps: [
    { prompt: 'Raise $v_4$ and watch the six shadows.', done: (m) => Math.abs(m.v[3]) > 0.3, then: 'Each panel shows the pair on one coordinate plane, and their angles disagree with each other. None of them is the pair.' },
    { prompt: 'Load the pair $u=(1,1,1,1)$, $v=(1,-1,1,-1)$.', done: (m, c) => !!c.flags.preset, then: 'Its contributions are $+1, -1, +1, -1$, so $u\\cdot v = 0$. Some shadows look perpendicular and some do not. The contributions decide; the shadows cannot.' },
    {
      prompt: 'Build your own orthogonal pair with the sliders, using all four coordinates.',
      meter: (m) => `$u\\cdot v$ = ${signed(m.r.inner)}`,
      done: (m, c) => m.orthogonal && !!c.flags.slid && m.v.every((x) => Math.abs(x) > 0.1),
      then: 'You found a right angle that cannot be drawn. The bars are the evidence.',
    },
  ],
  notice: {
    changed: 'The shadows, and the angle each one appears to make.',
    held: '$u\\cdot v$: one number, computed from all four coordinates at once.',
    visible: 'Orthogonality as cancellation, now the only way to see it.',
    hidden: 'The true angle has no drawing. It exists only as $\\arccos$ of a number.',
  },
  model(ctx) {
    const { u, v } = ctx.data();
    const r = pairReadings(u, v);
    return { u, v, r, orthogonal: Math.abs(r.inner) < TOL };
  },
  readouts: (m) => [...pairReadouts(m.r)],
  advanced(m) {
    const planes = coordinatePlanes(4).map(([i, j]) => `(x_${i + 1},x_${j + 1}):\\ ${num((coordinateShadow(m.u, m.v, i, j).angle ?? NaN) * (180 / Math.PI), 1)}^\\circ`);
    return h('div', null, pairAdvanced(m), texEl(`\\text{shadow angles: } ${planes.join(',\\ ')}`, { display: true, tag: 'div' }));
  },
  build(ctx) {
    const shadows = createShadows({ n: 4 });
    const strip = createContributionStrip({ title: 'Each coordinate’s contribution uᵢvᵢ', runTitle: 'Running total: u·v' });
    const verdict = liveVerdict();
    const vs = [0, 1, 2, 3].map((i) =>
      slider({
        label: `v${SUB[i]}`,
        min: -2.2, max: 2.2, step: 0.01, value: ctx.data().v[i],
        format: (x) => num(x, 2),
        oninput: (x) => {
          const d = ctx.data();
          const v = [...d.v];
          v[i] = x;
          ctx.flags.slid = true;
          ctx.setData({ ...d, v });
        },
      }),
    );
    const preset = button({ label: 'Load u = (1,1,1,1), v = (1,−1,1,−1)', onclick: () => { ctx.flags.preset = true; ctx.setData({ ...ONE_PAIR }); } });
    const remove = button({ label: 'Remove the shadow', onclick: () => { const d = ctx.data(); ctx.setData({ ...d, v: removeShadow(d.u, d.v) }); } });
    const uText = h('p', { class: 'note' });
    return {
      figure: figure(
        h('p', { class: 'callout-projection' }, 'Six shadows of one pair, one per coordinate plane. A shadow is a projection: it drops two coordinates. None of these panels is the four-dimensional pair.'),
        shadows.el,
        strip.el,
      ),
      controls: group(uText, ...vs.map((x) => x.el), row(preset.el, remove.el)),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        shadows.update(m.u, m.v);
        strip.bars({ values: m.r.contributions, labels: ['u₁v₁', 'u₂v₂', 'u₃v₃', 'u₄v₄'], ...stripScales(m.r.contributions), total: m.r.inner });
        verdict.set(m.r.inner);
        vs.forEach((x, i) => x.set(m.v[i]));
        uText.innerHTML = `${tex(`u = (${m.u.map((c) => num(c, 2)).join(',\\ ')})`)}, carried from the earlier stages.`;
      },
    };
  },
};

const stage6 = {
  id: 'basis',
  title: 'A basis you can’t see',
  rep: B4,
  question: 'Four directions in $\\mathbb R^4$, each at right angles to the others. How would you know, without a picture?',
  equation: 'G_{ij} = \\langle e_i, e_j\\rangle,\\qquad G = I',
  symbols: [
    ['e_1,\\dots,e_4', 'four unit vectors in $\\mathbb R^4$'],
    ['G', 'the Gram matrix: every inner product of the basis at once'],
    ['a_k=\\langle x,e_k\\rangle', 'the coefficient of $x$ along $e_k$; here $x$ is your $v$ from stage 5'],
  ],
  statements: ['ortho.signature'],
  carry: BASIS,
  steps: [
    { prompt: 'Push the basis off orthogonal with the slider.', done: (m) => m.eps > 0.15, then: 'Off-diagonal cells appear: the basis vectors now cast shadows on one another. The rebuild of $x$ from its coefficients drifts, and the four checks on the right move off zero together.' },
    { prompt: 'Bring the slider back to 0.', done: (m, c) => m.eps === 0 && !!c.flags.wasOff, then: 'All four checks return to zero at once: no cross terms, coefficients that rebuild $x$, squared coefficients that add up to $\\|x\\|^2$, and a residual orthogonal to what was kept. This is the H1-1 signature, read in a space with no picture.' },
  ],
  notice: {
    changed: 'The off-diagonal Gram entries, the rebuild of $x$, and all four checks.',
    held: 'Every basis vector keeps length 1: the diagonal stays at 1.',
    visible: 'Orthogonality as a pattern in a table: a diagonal Gram matrix.',
    hidden: 'The directions themselves. You never see them, only their inner products.',
  },
  model(ctx) {
    const d = ctx.data();
    const x = norm(d.x) > 0.2 ? d.x : [1, 0.5, -0.8, 0.3];
    const basis = perturbBasis(tiltedOrthonormalBasis(4), d.eps);
    const sig = basisSignature(basis, x, d.retained);
    const recon = basis.reduce((acc, e, k) => add(acc, scale(e, sig.coeffs[k])), [0, 0, 0, 0]);
    if (d.eps > 0.15) ctx.flags.wasOff = true;
    return { ...d, x, xFromPair: norm(d.x) > 0.2, basis, sig, recon };
  },
  readouts: (m) => [
    ['perturbation ε', num(m.eps, 2)],
    ['$\\|x\\|^2$', num(dot(m.x, m.x))],
    ['$\\sum_k a_k^2$', num(m.sig.coeffs.reduce((s, a) => s + a * a, 0))],
  ],
  advanced(m) {
    return h(
      'div',
      null,
      texEl(`G = ${matTex(m.sig.G, 3)}`, { display: true, tag: 'div' }),
      texEl(`a = (${m.sig.coeffs.map((a) => num(a, 3)).join(',\\ ')})`, { display: true, tag: 'div' }),
      texEl(`x = ${vecTex(m.x, 3)},\\quad \\textstyle\\sum_k a_ke_k = ${vecTex(m.recon, 3)}`, { display: true, tag: 'div' }),
    );
  },
  build(ctx) {
    const gram = createGramMatrix({ labels: ['e₁', 'e₂', 'e₃', 'e₄'], cell: 52 });
    const compare = createCompareBars({ aLabel: 'x', bLabel: 'Σ aₖeₖ, rebuilt from the coefficients', yMax: 2.5 });
    const eps = slider({
      label: 'Push off orthogonal, ε',
      min: 0, max: 0.6, step: 0.01, value: ctx.data().eps,
      format: (x) => num(x, 2),
      oninput: (x) => ctx.setData({ ...ctx.data(), eps: x }),
    });
    const kept = slider({
      label: 'Components kept for the residual check, r',
      min: 1, max: 3, step: 1, value: ctx.data().retained, modes: 'explore advanced',
      format: (x) => String(x),
      oninput: (x) => ctx.setData({ ...ctx.data(), retained: x }),
    });
    const sigList = h('ul', { class: 'signature' });
    const xNote = h('p', { class: 'note' });
    return {
      figure: figure(
        h('p', { class: 'caption' }, h('strong', null, 'Gram matrix. '), 'Diagonal: each direction with itself. Off-diagonal: each pair. Orthonormal means a warm diagonal on an empty field.'),
        gram.el,
        h('p', { class: 'caption' }, h('strong', null, 'x and its rebuild from the coefficients. '), 'Equal bars mean each coefficient did its work independently of the others.'),
        compare.el,
      ),
      controls: group(eps.el, kept.el, xNote),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'The orthogonality signature (H1-1), live'), sigList),
      update(m) {
        gram.update(m.sig.G, { showValues: ctx.mode === 'advanced' });
        compare.update(m.x, m.recon, ['x₁', 'x₂', 'x₃', 'x₄']);
        eps.set(m.eps);
        kept.set(m.retained);
        xNote.textContent = m.xFromPair ? 'x is the v you built in stage 5.' : 'Your v from stage 5 is almost zero, so x = (1, 0.5, −0.8, 0.3) stands in.';
        const items = [
          ['Zero cross terms', 'max |G_ij|, i ≠ j', m.sig.crossTerms],
          ['Independent coefficients', '‖x − Σ aₖeₖ‖', m.sig.reconError],
          ['Parseval additivity', '‖x‖² − Σ aₖ²', m.sig.parsevalGap],
          [`Residual ⟂ the ${m.retained} kept`, 'max |⟨x − kept, eⱼ⟩|', m.sig.residualMax],
        ];
        sigList.replaceChildren(
          ...items.map(([name, what, val]) => {
            const holds = Math.abs(val) < 1e-9;
            return h('li', { class: holds ? 'holds' : '' }, h('span', null, name), h('span', { class: 'val' }, sci(val)), h('span', { class: 'state' }, `${what}: ${holds ? 'holds (|value| < 10⁻⁹)' : 'fails'}`));
          }),
        );
      },
    };
  },
};

const WAVE_OPTIONS = ['cos', 'sin'].flatMap((kind) => [1, 2, 3, 4, 5].map((k) => [`${kind}${k}`, `${kind} ${k === 1 ? '' : k}t`]));
const parseWave = (s) => ({ kind: s.slice(0, 3), k: Number(s.slice(3)) });
const waveKey = (f) => `${f.kind}${f.k}`;

const stage7 = {
  id: 'waves',
  title: 'Waves as vectors',
  rep: RN,
  question: 'A new pair: two waves, sampled at $N$ points. Each becomes a list of $N$ numbers, which is a vector in $\\mathbb R^N$.',
  equation: '\\langle \\mathbf f,\\mathbf g\\rangle_N = \\frac{2\\pi}{N}\\sum_{j=0}^{N-1} f(t_j)\\,g(t_j)',
  symbols: [
    ['t_j', '$2\\pi j/N$: the $N$ equally spaced sample times'],
    ['\\mathbf f', '$(f(t_0),\\dots,f(t_{N-1}))$: the wave as a vector'],
    ['f(t_j)g(t_j)', 'one contribution per sample, exactly like $u_iv_i$'],
    ['\\tfrac{2\\pi}{N}', 'a fixed scale, so the sum can be compared across $N$'],
  ],
  statements: ['ortho.discrete', 'ortho.inner-is-sum'],
  carry: WAVES,
  steps: [
    { prompt: 'Compare the sample dots with the bars: each bar is $f(t_j)g(t_j)$. Change $N$.', done: (m, c) => !!c.flags.touched, then: 'The same picture as for arrows: one signed contribution per coordinate, summed.' },
    { prompt: 'Choose a different pair of waves, keeping $m+n<N$, and read the total.', done: (m, c) => !!c.flags.picked && m.distinct && m.belowAlias && Math.abs(m.total) < 1e-9, then: 'Different harmonics cancel exactly, at every such $N$ (card O1c for cosines). Two sampled waves can be orthogonal vectors.' },
    { prompt: 'Now take cos t and cos 3t and lower $N$ to 4.', done: (m) => m.distinct && !m.belowAlias && Math.abs(m.total) > 1e-6, then: 'With too few samples the waves alias: at $N=4$ the samples of cos 3t are exactly the samples of cos t, so the sum no longer cancels. The sampling is part of the inner product.' },
    { prompt: 'Raise $N$ to at least 64.', done: (m) => m.N >= 64, then: 'Thinner bars, and they trace a curve. The next stage follows them to the limit.' },
  ],
  notice: {
    changed: 'The number of coordinates, $N$.',
    held: 'The rule: multiply matching coordinates and add.',
    visible: 'A wave is a vector, and orthogonality of waves is cancellation of sample products.',
    hidden: 'Everything between the samples.',
  },
  model(ctx) {
    const { f, g, N } = ctx.data();
    const tj = Array.from({ length: N }, (_, j) => (TWO_PI * j) / N);
    const fs = sampleWave(f, N);
    const gs = sampleWave(g, N);
    const contrib = fs.map((x, j) => (TWO_PI / N) * x * gs[j]);
    const total = sampledInner(f, g, N);
    const curve = productCurve(f, g, TWO_PI, 400);
    const distinct = waveKey(f) !== waveKey(g);
    const sameKind = f.kind === g.kind;
    return { f, g, N, tj, fs, gs, contrib, total, curve, distinct, belowAlias: f.k + g.k < N, exact: functionInner(f, g), sameKind };
  },
  readouts: (m) => [
    ['$\\langle\\mathbf f,\\mathbf g\\rangle_N$', signed(m.total, 4), signClass(m.total, 1e-9)],
    ['$\\int_0^{2\\pi} f g\\,dt$ (for comparison)', signed(m.exact, 4)],
    ['$N$', String(m.N)],
    ['$m+n<N$?', m.f.k + m.g.k < m.N ? 'yes' : 'no'],
  ],
  advanced(m) {
    const rows = m.tj.slice(0, 8).map((t, j) => `${j} & ${num(t, 3)} & ${num(m.fs[j], 3)} & ${num(m.gs[j], 3)} & ${num(m.contrib[j], 4)}`).join('\\\\');
    return texEl(`\\begin{array}{rrrrr} j & t_j & f(t_j) & g(t_j) & \\tfrac{2\\pi}{N}f g\\\\ \\hline ${rows}${m.N > 8 ? '\\\\ \\vdots&&&&' : ''}\\end{array}`, { display: true, tag: 'div', cls: 'equation' });
  },
  build(ctx) {
    const plot = createFunctionPlot();
    const strip = createContributionStrip({ title: 'Each sample’s contribution (2π/N)·f(tⱼ)g(tⱼ)', runTitle: 'Running total: ⟨f, g⟩ in ℝᴺ' });
    const verdict = liveVerdict();
    const fSel = select({ label: 'f', options: WAVE_OPTIONS, value: waveKey(ctx.data().f), onchange: (v) => { ctx.flags.picked = true; ctx.setData({ ...ctx.data(), f: parseWave(v) }); } });
    const gSel = select({ label: 'g', options: WAVE_OPTIONS, value: waveKey(ctx.data().g), onchange: (v) => { ctx.flags.picked = true; ctx.setData({ ...ctx.data(), g: parseWave(v) }); } });
    const nSl = slider({ label: 'Samples, N', min: 3, max: 128, step: 1, value: ctx.data().N, format: (x) => String(x), oninput: (x) => ctx.setData({ ...ctx.data(), N: x }) });
    return {
      figure: figure(plot.el, strip.el),
      controls: group(row(fSel.el, gSel.el), nSl.el),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        plot.update({ curve: m.curve, L: TWO_PI, samples: { t: m.tj, f: m.fs, g: m.gs }, fLabel: `f = ${fnText(m.f)}`, gLabel: `g = ${fnText(m.g)}` });
        strip.bars({ values: m.contrib, labels: m.N <= 8 ? m.tj.map((_, j) => `j=${j}`) : null, yMax: nice(TWO_PI / m.N), runMax: 4, total: m.total });
        verdict.set(m.total, 1e-9, '⟨f, g⟩_N');
        nSl.set(m.N);
        fSel.set(waveKey(m.f));
        gSel.set(waveKey(m.g));
      },
    };
  },
};

const TRIG6 = trigBasis(3);
const TRIG_LABELS = ['c₁', 's₁', 'c₂', 's₂', 'c₃', 's₃'];

const stage8 = {
  id: 'functions',
  title: 'Functions',
  rep: L2,
  question: 'Let $N$ grow without bound. The sum becomes an integral, and the bars become an area.',
  equation: '\\langle f, g\\rangle = \\int_0^{L} f(t)\\,g(t)\\,dt',
  symbols: [
    ['f(t)g(t)', 'the contribution at each instant: warm area above zero, cool area below'],
    ['L', 'the interval is part of the inner product; change it and the geometry changes'],
    ['c_k,\\ s_k', '$\\cos kt/\\sqrt\\pi$ and $\\sin kt/\\sqrt\\pi$: unit length over $[0,2\\pi]$'],
  ],
  statements: ['ortho.samples-to-integral', 'ortho.trig-full-period', 'ortho.signature'],
  carry: FUNCS,
  steps: [
    { prompt: 'Change $g$ and compare the warm and cool areas.', done: (m, c) => !!c.flags.touched, then: 'Over a full period the warm and cool areas match exactly, so $\\int_0^{2\\pi} fg\\,dt = 0$ for different harmonics. No arrows, no angle, and still orthogonal.' },
    { prompt: 'Lengthen or shorten the interval $L$.', done: (m) => Math.abs(m.L - TWO_PI) > 0.3, then: 'Off a full period the areas no longer balance, and off-diagonal cells appear in the Gram matrix. Whether two functions are orthogonal depends on the interval, because the interval is part of the inner product.' },
    { prompt: 'Bring $L$ back to $2\\pi$ (the button does it exactly).', done: (m, c) => Math.abs(m.L - TWO_PI) < 1e-9 && !!c.flags.wasOff, then: 'The Gram matrix of the six basis waves is the identity again: the H1-1 signature, now for functions.' },
  ],
  notice: {
    changed: 'The interval, and with it the balance of warm and cool area.',
    held: 'The product curve $f(t)g(t)$ itself: only how much of it is integrated changes.',
    visible: 'Orthogonality of functions as cancelling areas, and as an identity Gram matrix.',
    hidden: 'Pointwise detail: one number now stands for the whole product curve.',
  },
  model(ctx) {
    const d = ctx.data();
    const curve = productCurve(d.f, d.g, d.L, 600);
    const exact = functionInner(d.f, d.g, d.L);
    const G = normalisedTrigGram(TRIG6, d.L);
    let off = 0;
    G.forEach((r, i) => r.forEach((g, j) => { if (i !== j) off = Math.max(off, Math.abs(g)); }));
    if (Math.abs(d.L - TWO_PI) > 0.3) ctx.flags.wasOff = true;
    let samples = null;
    if (d.showSamples) {
      const N = d.N ?? 16;
      const t = Array.from({ length: N }, (_, j) => (d.L * j) / N);
      samples = { t, product: t.map((x) => basisValue(d.f, x) * basisValue(d.g, x)), sum: sampledInner(d.f, d.g, N, d.L), N };
    }
    return { ...d, curve, exact, G, off, samples, runMax: nice(Math.max(...Array.from(curve.running, Math.abs), 0.5)) };
  },
  readouts: (m) => [
    ['$\\langle f,g\\rangle$ (closed form)', signed(m.exact, 4), signClass(m.exact, 1e-9)],
    ['warm area', num(m.curve.positive, 4)],
    ['cool area', num(m.curve.negative, 4)],
    ['$L$', `${num(m.L, 3)} (2π = ${num(TWO_PI, 3)})`],
    ['largest off-diagonal of $G$', sci(m.off)],
    ...(m.samples ? [[`sample sum, $N=${m.samples.N}$`, signed(m.samples.sum, 4)]] : []),
  ],
  advanced(m) {
    return h('div', null, texEl(`\\int_0^{${num(m.L, 3)}} ${fnTex(m.f)}\\,${fnTex(m.g)}\\,dt = ${num(m.exact, 5)}`, { display: true, tag: 'div' }), texEl(`G = ${matTex(m.G, 3)}`, { display: true, tag: 'div', cls: 'equation' }));
  },
  build(ctx) {
    const plot = createFunctionPlot();
    const strip = createContributionStrip({ title: 'The contribution at each instant, f(t)g(t)', runTitle: 'Running integral: ends at ⟨f, g⟩' });
    const gram = createGramMatrix({ labels: TRIG_LABELS, cell: 40 });
    const verdict = liveVerdict();
    const fSel = select({ label: 'f', options: WAVE_OPTIONS, value: waveKey(ctx.data().f), onchange: (v) => ctx.setData({ ...ctx.data(), f: parseWave(v) }) });
    const gSel = select({ label: 'g', options: WAVE_OPTIONS, value: waveKey(ctx.data().g), onchange: (v) => ctx.setData({ ...ctx.data(), g: parseWave(v) }) });
    const lSl = slider({ label: 'Interval length, L', min: 0.5, max: 4 * Math.PI, step: 0.01, value: ctx.data().L, format: (x) => num(x, 2), oninput: (x) => ctx.setData({ ...ctx.data(), L: x }) });
    const exact = button({ label: 'Set L = 2π', onclick: () => ctx.setData({ ...ctx.data(), L: TWO_PI }) });
    const samp = button({ label: 'Show the samples from stage 7', pressed: !!ctx.data().showSamples, modes: 'explore advanced', onclick: () => { const d = ctx.data(); ctx.setData({ ...d, showSamples: !d.showSamples }); } });
    return {
      figure: figure(
        plot.el,
        strip.el,
        h('div', { class: 'figure-row' }, h('div', null, h('p', { class: 'caption' }, h('strong', null, 'Gram matrix of six basis waves over [0, L]. '), 'At L = 2π it is the identity.'), gram.el)),
      ),
      controls: group(row(fSel.el, gSel.el), lSl.el, row(exact.el, samp.el)),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        plot.update({ curve: m.curve, L: m.L, fLabel: `f = ${fnText(m.f)}`, gLabel: `g = ${fnText(m.g)}` });
        strip.area({ curve: m.curve, L: m.L, yMax: 1, runMax: m.runMax, total: m.exact, samples: m.samples });
        gram.update(m.G, { showValues: ctx.mode === 'advanced' });
        verdict.set(m.exact, 1e-9, '⟨f, g⟩');
        lSl.set(m.L);
        fSel.set(waveKey(m.f));
        gSel.set(waveKey(m.g));
        samp.press(!!m.showSamples);
      },
    };
  },
};

export default {
  id: 'orthogonality',
  hashPrefix: 'ortho',
  mapNumber: 8,
  title: 'Orthogonality and Zero',
  question: 'One relationship, $\\langle u,v\\rangle = 0$, followed from arrows you can see into spaces you cannot. In every view an inner product is a sum of signed contributions, and orthogonality is when they cancel.',
  stages: [stage1, stage2, stage3, stage4, stage5, stage6, stage7, stage8],
  connections: [
    ['C1', 'one preservation equation, many geometries'],
    ['C4', 'C4b: Fourier series as unitary coordinates, where your evidence started'],
    ['C5', 'the other zero, q(v) = 0, compared later and never merged'],
    ['C6', 'projection by averaging is orthogonal projection'],
  ],
  investigation: ['H1', 'H2.pattern'],
};
