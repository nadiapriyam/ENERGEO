// Orthogonality and Zero (Master Map 8). The relationship ⟨u,v⟩ = 0, carried through eight representations.
// Positions and numbers all come from src/math; this file only wires them to views and words.

import { h } from '../../core/dom.js';
import { slider, button, row, group } from '../../core/controls.js';
import { num, signed, deg, signClass, sci } from '../../core/format.js';
import { tex, texEl } from '../../core/tex.js';
import { createVectorPlane } from '../../views/vectorPlane.js';
import { createContributionStrip } from '../../views/contributionStrip.js';
import { createPythagorasBars } from '../../views/pythagorasBars.js';
import { createShadows } from '../../views/shadows.js';
import { createGramMatrix } from '../../views/gramMatrix.js';
import { createCompareBars } from '../../views/compareBars.js';
import { createWavesPlot } from '../../views/wavesPlot.js';
import { createFunctionPlot } from '../../views/functionPlot.js';
import {
  pairReadings, projectedAngle, rotatePair, coordinatePlanes, coordinateShadow,
  basisSignature, perturbBasis,
} from '../../math/orthogonality.js';
import {
  arrowOf, waveFromCoords, sampledInnerCoords, sampledPredictedCoords, aliasedCoords, intervalInner, productCurveCoords, realBasisGram,
} from '../../math/coefficients.js';
import { add, scale, norm, rotationAxisAngle, dot, identity } from '../../math/linalg.js';
import { SIGNAL, C3, DEFAULT_SIGNAL, ensureSignal, liveCoeffs, delayed, DELAY } from '../signal.js';

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

// ── carried objects ──────────────────────────────────────────────────────────────────────────────
// The pair is made from the signal of Fourier Coefficients (#7). u holds the coefficient arrows √2 f̂(k) of your
// signal f; v holds those of g, your signal delayed by DELAY of a period. Coordinates are real coefficients in the
// orthonormal basis b = (√2 cos 2πt, −√2 sin 2πt, √2 cos 4πt, −√2 sin 4πt), so u·v = ⟨f, g⟩ on [0, 1] (card O2c).
const R2 = '\\mathbb R^2';
const R3 = '\\mathbb R^3';
const R4 = '\\mathbb R^4';
const RN = '\\mathbb R^N';
const L2 = 'L^2[0,L]';
const B4 = '\\{b_k\\}\\subset\\mathbb R^4';
const SRC = { id: SIGNAL, rep: C3 };

/** Whether your signal has a first harmonic to hand over (it can be removed, or dragged to almost nothing, in #7). */
function hasFirstHarmonic(J) {
  ensureSignal(J);
  return Math.hypot(...liveCoeffs(J.get(SIGNAL).reps[C3].data)[0]) > 0.1;
}
/** The signal's coefficients for the hand-off; without a first harmonic it falls back to the example's. */
function handoffCoeffs(J) {
  return hasFirstHarmonic(J) ? liveCoeffs(J.get(SIGNAL).reps[C3].data) : liveCoeffs(DEFAULT_SIGNAL);
}
const fromSignal = (J) => () => {
  const f = handoffCoeffs(J);
  const g = delayed(f);
  return { u: arrowOf(f[0]), v: arrowOf(g[0]), exact: false };
};
// `exact` marks a pair built to be orthogonal by an exact construction (and not dragged since). Adding a
// coordinate adds a contribution u_i v_i, so exactness survives only when that contribution is exactly 0.
const extend = (J, part) => (d) => {
  const f = handoffCoeffs(J);
  const g = delayed(f);
  const pick = (c) => Math.SQRT2 * c[1][part];
  const p = d.theta ? rotatePair(d.u, d.v, AXIS, d.theta) : d;
  const u = [...p.u, pick(f)];
  const v = [...p.v, pick(g)];
  return { u, v, theta: 0, exact: !!d.exact && u.at(-1) * v.at(-1) === 0 };
};
const shown3 = (d) => (d.theta ? rotatePair(d.u, d.v, AXIS, d.theta) : { u: d.u, v: d.v });

const PAIR2 = {
  name: 'two waves as coefficient arrows (u from your signal f, v from g = f delayed)',
  read: (J) => {
    const own = hasFirstHarmonic(J);
    const u = own ? 'u = √2 f̂(1) from your signal' : 'u = √2 f̂(1) of the example signal, because your signal’s first harmonic is removed or almost zero';
    return J.rep('pair', R2, SRC, fromSignal(J), `${u}; v = √2 ĝ(1), where g is ${own ? 'your' : 'that'} signal delayed by ${DELAY} of a period`);
  },
  write: (J, d) => J.update('pair', R2, d),
  trail: (J) => J.trail('pair'),
};
const PAIR3 = {
  ...PAIR2,
  read: (J) => (PAIR2.read(J), J.rep('pair', R3, R2, extend(J, 0), 'a third coordinate: the real part of each wave’s second-harmonic arrow')),
  write: (J, d) => J.update('pair', R3, d),
};
const PAIR4 = {
  ...PAIR2,
  read: (J) => (PAIR3.read(J), J.rep('pair', R4, R3, extend(J, 1), 'a fourth coordinate: the imaginary part of the second-harmonic arrow')),
  write: (J, d) => J.update('pair', R4, d),
};
const BASIS = {
  name: 'the Fourier basis behind the coordinates, and x (the wave g from stage 5)',
  read: (J) => {
    J.ensure('basis', 'basis', B4, { eps: 0, retained: 2 }, 'the orthonormal basis b₁…b₄ that the coordinates refer to');
    return { ...J.get('basis').reps[B4].data, x: PAIR4.read(J).v };
  },
  write: (J, d) => J.update('basis', B4, { eps: d.eps, retained: d.retained }),
  trail: (J) => J.trail('basis'),
};
const SAMPLES = {
  ...PAIR2,
  read: (J) => {
    const d = PAIR4.read(J);
    const set = J.rep('pair', RN, R4, () => ({ N: 8 }), 'the same two waves, sampled at N points: two vectors in ℝᴺ');
    return { ...d, ...set };
  },
  write: (J, d) => J.update('pair', RN, { N: d.N }),
};
const FUNCS = {
  ...PAIR2,
  read: (J) => {
    const d = PAIR4.read(J);
    const set = J.rep('pair', L2, R4, () => ({ L: 1, showSamples: false }), 'N → ∞: the same two waves as functions on [0, L]');
    return { ...d, ...set, N: J.get('pair').reps[RN]?.data?.N ?? 8 };
  },
  write: (J, d) => J.update('pair', L2, { L: d.L, showSamples: d.showSamples }),
};

// ── shared pieces ────────────────────────────────────────────────────────────────────────────────
function figure(...children) {
  return h('div', { class: 'figure' }, children);
}

function planeBox(el) {
  return h('div', { style: { maxWidth: '440px', width: '100%', justifySelf: 'center' } }, el);
}

// Three distinct states. Mathematically u ⟂ v ⟺ u·v = 0; a dragged pair can only get near that.
//   exact: zero in exact arithmetic (an exact construction, or a closed form); only floating-point error remains
//   approximate: within the interactive tolerance, which is a convenience for dragging, not orthogonality
function liveVerdict() {
  const el = h('div', { class: 'verdict', 'aria-live': 'polite' });
  return {
    el,
    set(inner, { tol = TOL, what = 'u·v', exact = false, why = 'by construction', hint = 'Remove the shadow constructs that.' } = {}) {
      const tiny = Math.abs(inner) < 1e-9;
      if (exact && tiny) {
        el.className = 'verdict holds';
        el.innerHTML = `<b>Exactly orthogonal</b> ${why}: ${what} = 0.${inner === 0 ? '' : ` The displayed remainder, ${sci(inner)}, is floating-point error.`}`;
      } else if (Math.abs(inner) < tol) {
        el.className = 'verdict approx';
        el.innerHTML = `<b>Approximately orthogonal</b>, within the interactive tolerance |${what}| &lt; ${tol}. Now ${what} = ${num(inner, 4)}. Exactly orthogonal means ${what} = 0. ${hint}`;
      } else {
        el.className = 'verdict';
        el.innerHTML = `<b>Not orthogonal.</b> ${what} = ${num(inner, 4)}.`;
      }
    },
  };
}

const stripScales = (vals) => ({ yMax: nice(Math.max(...vals.map(Math.abs), 0.1)), runMax: nice(Math.max(prefixMax(vals), 0.1)) });

const pairReadouts = (r) => [
  ['$u\\cdot v$', signed(r.inner), signClass(r.inner)],
  ...r.contributions.map((c, i) => [`$u_${i + 1}v_${i + 1}$`, signed(c), signClass(c)]),
  ['angle', deg(r.angle)],
];

/** The exact construction v ↦ v − proj_u v. When v lies along u the residual is 0, so nothing is replaced. */
const removeShadow = (u, v) => {
  const r = pairReadings(u, v);
  return norm(r.residual) > 1e-6 ? { v: r.residual, exact: true } : { v, exact: false };
};

/** The two waves behind the arrows, drawn under the geometry: f from u, g from v (same scale). */
function wavesUnder(caption = 'Each coordinate is the coefficient of one basis wave, so u and v are waves too.') {
  const plot = createWavesPlot({ rows: [{ height: 96 }] });
  const t = Array.from({ length: 301 }, (_, i) => i / 300);
  const el = h('div', null, h('p', { class: 'caption' }, h('strong', null, 'The waves: f from u (solid), g from v (dashed). '), caption), plot.el);
  return {
    el,
    update(u, v) {
      plot.update(t, [{ label: 'f and g', yMax: 4, series: [{ values: t.map((x) => waveFromCoords(u, x)), style: 'ink' }, { values: t.map((x) => waveFromCoords(v, x)), style: 'dashed' }] }]);
    },
  };
}

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
  question: 'Your signal arrives as an arrow. $u$ is its first-harmonic coefficient $\\sqrt2\\,\\hat f(1)$; $v$ is the same for a second wave $g$, your signal delayed by a fraction of a period. Drag the tip of $v$: below the plane, each coordinate adds a signed contribution to $u\\cdot v$.',
  equation: 'u\\cdot v = u_1v_1 + u_2v_2',
  symbols: [
    ['u,\\ v', 'the arrows $\\sqrt2\\,\\hat f(1)$ and $\\sqrt2\\,\\hat g(1)$ from Fourier Coefficients: each a pair of numbers'],
    ['u_iv_i', 'what coordinate $i$ contributes: warm if positive, cool if negative'],
    ['u\\cdot v', 'the sum of the contributions. It equals $\\int_0^1 f_1(t)\\,g_1(t)\\,dt$, the inner product of the two first harmonics (card O2c)'],
  ],
  statements: ['ortho.inner-is-sum', 'coef.arrows'],
  carry: PAIR2,
  steps: [
    { prompt: 'Drag the tip of $v$ and watch the two bars.', done: (m, c) => !!c.flags.touched, then: 'Each bar is one coordinate’s contribution $u_iv_i$. Warm bars add to $u\\cdot v$; cool bars subtract from it.' },
    {
      prompt: 'Find a direction for $v$ where the two bars cancel.',
      meter: (m) => `$u\\cdot v$ = ${signed(m.r.inner)} (target: within the interactive tolerance ±${TOL})`,
      done: (m, c) => {
        if (!m.orthogonal) return false;
        c.flags.side1 = Math.sign(m.u[0] * m.v[1] - m.u[1] * m.v[0]);
        return true;
      },
      then: 'The bars nearly cancel: $u\\cdot v$ is within the interactive tolerance of 0, and the dashed square marks an angle close to 90°. Look at the waves: $g$ now runs a quarter period away from $f$, and $\\int_0^1 f_1 g_1\\,dt$ is nearly 0. Exactly, $u\\perp v \\iff u\\cdot v = 0$; stage 2 shows how to construct it exactly.',
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
      then: 'Both directions lie close to one line through the origin. In the plane, the arrows exactly orthogonal to $u$ form that line.',
    },
  ],
  notice: {
    changed: 'The coordinates of $v$, both contributions, and the angle.',
    held: 'The rule for combining coordinates, $u_1v_1+u_2v_2$.',
    visible: 'Orthogonality as cancellation, and the same zero in the waves: $u\\perp v$ exactly when $\\int_0^1 f_1g_1\\,dt = 0$.',
    hidden: 'Only the first harmonics are in this picture; the other harmonics wait for more coordinates (stages 4 and 5).',
  },
  model(ctx) {
    const { u, v, exact } = ctx.data();
    const r = pairReadings(u, v);
    return { u, v, r, orthogonal: Math.abs(r.inner) < TOL, exact: !!exact && Math.abs(r.inner) < 1e-9 };
  },
  readouts: (m) => pairReadouts(m.r),
  advanced: pairAdvanced,
  build(ctx) {
    const plane = createVectorPlane({
      extent: 2.5,
      draggable: ctx.mode === 'guided' ? ['v'] : ['u', 'v'],
      onDrag: (name, p) => ctx.setData({ ...ctx.data(), [name]: p, exact: false }),
    });
    const strip = createContributionStrip({ title: 'Each coordinate’s contribution uᵢvᵢ', runTitle: 'Adding them up: the running total ends at u·v' });
    const verdict = liveVerdict();
    const waves = wavesUnder('Here only the first harmonics. Moving v reshapes g: the arrow’s length is the amplitude, its angle the phase.');
    const reset = button({ label: 'Reset to your signal', onclick: () => ctx.setData(fromSignal(ctx.journey)()) });
    return {
      figure: figure(planeBox(plane.el), waves.el, strip.el),
      controls: group(h('p', { class: 'note', 'data-modes': 'explore advanced' }, 'Both tips can be dragged. Arrow keys move a focused tip (Shift for larger steps).'), h('p', { class: 'note', 'data-modes': 'guided' }, 'Drag the tip of v, or focus it and use the arrow keys.'), row(reset.el)),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        plane.update({ u: m.u, v: m.v, r: m.r, showShadow: false, exact: m.exact });
        waves.update(m.u, m.v);
        strip.bars({ values: m.r.contributions, labels: ['u₁v₁', 'u₂v₂'], ...stripScales(m.r.contributions), total: m.r.inner });
        verdict.set(m.r.inner, { exact: m.exact });
      },
    };
  },
};

const stage2 = {
  id: 'shadow',
  title: 'The shadow',
  rep: R2,
  question: 'How much of $v$ lies along $u$? Its shadow on the line of $u$ answers that. For the waves: how much of $g_1$ moves in step with $f_1$. When the shadow is gone, $v$ is orthogonal to $u$.',
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
    { prompt: 'Make the shadow (nearly) disappear by dragging.', meter: (m) => `shadow length ${num(norm(m.r.shadow), 3)}`, done: (m) => m.orthogonal, then: 'The shadow is within the interactive tolerance of zero: almost no part of $v$ lies along $u$. No shadow at all is exactly what $u\\cdot v = 0$ says, and dragging can only come close.' },
    { prompt: 'Move $v$ off again, then press Remove the shadow.', done: (m, c) => !!c.flags.removed, then: 'Subtracting the shadow is an exact construction: $u\\cdot(v-\\operatorname{proj}_u v) = 0$ in exact arithmetic, and any remainder shown is floating-point error. Repeated vector by vector, this step is Gram–Schmidt: a way to build an orthogonal basis without ever seeing it (card S6).' },
  ],
  notice: {
    changed: 'The shadow’s length and the sign of its direction.',
    held: 'The residual is orthogonal to $u$ for every $v$.',
    visible: 'Orthogonality as an absence: no shadow, so no part of $g_1$ moves in step with $f_1$.',
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
    const plane = createVectorPlane({ extent: 2.5, draggable: ctx.mode === 'guided' ? ['v'] : ['u', 'v'], onDrag: (name, p) => ctx.setData({ ...ctx.data(), [name]: p, exact: false }) });
    const strip = createContributionStrip({ title: 'Each coordinate’s contribution uᵢvᵢ', runTitle: 'Running total: u·v, which sets the shadow' });
    const waves = wavesUnder('Here only the first harmonics. When the shadow is gone, g runs exactly a quarter period from f.');
    const verdict = liveVerdict();
    const remove = button({
      label: 'Remove the shadow',
      onclick: () => {
        const d = ctx.data();
        ctx.flags.removed = true;
        ctx.setData({ ...d, ...removeShadow(d.u, d.v) });
      },
    });
    return {
      figure: figure(planeBox(plane.el), waves.el, strip.el),
      controls: group(row(remove.el), h('p', { class: 'note' }, 'Remove the shadow replaces v with its residual: the exact orthogonal construction.')),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        plane.update({ u: m.u, v: m.v, r: m.r, showShadow: true, exact: m.exact });
        waves.update(m.u, m.v);
        strip.bars({ values: m.r.contributions, labels: ['u₁v₁', 'u₂v₂'], ...stripScales(m.r.contributions), total: m.r.inner });
        verdict.set(m.r.inner, { exact: m.exact });
      },
    };
  },
};

const stage3 = {
  id: 'pythagoras',
  title: 'Pythagoras',
  rep: R2,
  question: 'When do squared lengths simply add? Compare $\\|u\\|^2+\\|v\\|^2$ with $\\|u+v\\|^2$. For the waves, these are $\\int f_1^2 + \\int g_1^2$ against $\\int (f_1+g_1)^2$.',
  equation: '\\|u+v\\|^2 = \\|u\\|^2 + \\|v\\|^2 + 2\\,u\\cdot v',
  symbols: [
    ['\\|u\\|^2', 'squared length, $u\\cdot u$'],
    ['2\\,u\\cdot v', 'the cross term: the only part that depends on how $u$ and $v$ sit relative to each other'],
  ],
  statements: ['ortho.pythagoras'],
  carry: PAIR2,
  steps: [
    { prompt: 'Drag $v$ and compare the two bars.', done: (m, c) => !!c.flags.touched, then: 'They always differ by exactly $2\\,u\\cdot v$, the cross term: warm when it adds length, cool when it takes length away.' },
    { prompt: 'Make the two bars equal.', meter: (m) => `cross term $2\\,u\\cdot v$ = ${signed(m.r.crossTerm)}`, done: (m) => m.orthogonal, then: 'The cross term is within the interactive tolerance of 0, so the bars nearly match and the triangle nearly has a right angle. Exactly, Pythagoras holds if and only if $u\\cdot v = 0$. Remove the shadow makes it exact.' },
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
    const plane = createVectorPlane({ extent: 2.5, triangle: true, draggable: ctx.mode === 'guided' ? ['v'] : ['u', 'v'], onDrag: (name, p) => ctx.setData({ ...ctx.data(), [name]: p, exact: false }) });
    const bars = createPythagorasBars();
    const verdict = liveVerdict();
    const remove = button({ label: 'Remove the shadow', onclick: () => ctx.setData({ ...ctx.data(), ...removeShadow(ctx.data().u, ctx.data().v) }) });
    return {
      figure: figure(planeBox(plane.el), bars.el),
      controls: group(row(remove.el), h('p', { class: 'note' }, 'The thin dashed copy of v starts at the tip of u, so the three sides form a triangle.')),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        plane.update({ u: m.u, v: m.v, r: m.r, showShadow: false, exact: m.exact });
        bars.update(m.r);
        verdict.set(m.r.inner, { exact: m.exact });
      },
    };
  },
};

const stage4 = {
  id: 'space',
  title: 'Turn the view',
  rep: R3,
  question: 'A third coordinate: the real part of each wave’s second-harmonic arrow, from your signal. Two different changes are possible here: orbit the camera, which changes only the picture, or rotate the vectors, which changes the vectors and so the waves.',
  equation: '(Ru)\\cdot(Rv) = u\\cdot v',
  symbols: [
    ['R', 'a rotation applied to both vectors: it moves them'],
    ['u\\cdot v', '$u_1v_1+u_2v_2+u_3v_3$: now three contributions. The new one, $u_3v_3$, comes from the second harmonics'],
    ['\\text{camera}', 'moving the viewpoint moves nothing; it changes only the projection onto your screen'],
    ['\\text{screen angle}', 'the angle the arrows make in that projection: a picture of the pair, not the pair'],
  ],
  statements: ['ortho.camera', 'ortho.rotation-invariance'],
  carry: PAIR3,
  steps: [
    {
      prompt: 'Make the pair orthogonal (Remove the shadow makes it exact), then drag the figure to orbit the camera.',
      meter: (m) => `$u\\cdot v$ = ${signed(m.r.inner)}, screen angle ${deg(m.screen)}`,
      done: (m, c) => m.orthogonal && !!c.flags.orbited,
      then: 'The vectors did not move, so neither did $u\\cdot v$ or the true angle. Only their projection onto your screen changed, and a projection need not preserve angles (card O1b). The representation hid the right angle without changing the relationship.',
    },
    { prompt: 'Now rotate the vectors themselves with the rotation slider.', done: (m, c) => !!c.flags.rotated, then: 'This time the vectors moved: every coordinate changed, and so did each contribution $u_iv_i$. Their sum did not, because rotations preserve the inner product, $(Ru)\\cdot(Rv)=u\\cdot v$ (card O1a). The camera changes the picture; a rotation changes the vectors and keeps their relationship.' },
    {
      prompt: 'Tilt $v$ out of its plane with the height slider, then remove the shadow again.',
      meter: (m) => `$v_3$ = ${num(m.v[2], 2)}, $u\\cdot v$ = ${signed(m.r.inner)}`,
      done: (m) => m.orthogonal && Math.abs(m.v[2]) > 0.3,
      then: 'You found another vector orthogonal to $u$. Show the plane orthogonal to $u$: every arrow in it qualifies exactly. A line of them in the plane, a whole plane of them in space.',
    },
  ],
  notice: {
    changed: 'Orbiting the camera: only the screen angle. Rotating the vectors: every coordinate and every contribution $u_iv_i$.',
    held: 'Under both: $u\\cdot v$, the true angle and both lengths. Under orbiting, the vectors themselves.',
    visible: 'A right angle belongs to the pair, not to its picture.',
    hidden: 'On screen, the true angle: the camera shows a projection, which can hide a right angle without changing it.',
  },
  model(ctx) {
    const d = ctx.data();
    const { u, v } = shown3(d);
    const r = pairReadings(u, v);
    const view = ctx.flags.view ?? [0.55, -0.68, 0.45];
    return {
      u, v, r, theta: d.theta ?? 0,
      orthogonal: Math.abs(r.inner) < TOL,
      exact: !!d.exact && Math.abs(r.inner) < 1e-9,
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
    const waves = wavesUnder('Three coordinates: the first harmonic, plus the cosine part of the second.');
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

    const setShown = (u, v, exact) => {
      // store the base pair so the rotation slider keeps its meaning
      const d = ctx.data();
      const back = d.theta ? rotatePair(u, v, AXIS, -d.theta) : { u, v };
      ctx.setData({ ...d, u: back.u, v: back.v, exact });
    };
    const theta = slider({
      label: 'Rotate both vectors, θ',
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
        setShown(p.u, [p.v[0], p.v[1], x], false);
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
    const remove = button({ label: 'Remove the shadow', onclick: () => { const p = shown3(ctx.data()); const r = removeShadow(p.u, p.v); setShown(p.u, r.v, r.exact); } });
    const plane = button({ label: 'Show the plane orthogonal to u', pressed: false, onclick: () => { ctx.flags.complement = !ctx.flags.complement; plane.press(ctx.flags.complement); ctx.refresh(); } });

    return {
      figure: figure(sceneHost, h('p', { class: 'caption' }, h('strong', null, 'Drag to orbit, scroll to zoom. '), 'Orbiting moves the camera, not the vectors. The camera is orthographic, so the screen angle readout is exactly the angle drawn on your screen.'), waves.el, strip.el),
      controls: group(row(orbit.el, remove.el), theta.el, tilt.el, row(plane.el)),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        last = m;
        scene?.update(m);
        waves.update(m.u, m.v);
        strip.bars({ values: m.r.contributions, labels: ['u₁v₁', 'u₂v₂', 'u₃v₃'], ...stripScales(m.r.contributions), total: m.r.inner });
        verdict.set(m.r.inner, { exact: m.exact });
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
  question: 'A fourth coordinate completes both harmonics of each wave. No single 2D or 3D picture shows this pair faithfully. Every drawing below is a shadow on one coordinate plane; the waves show the whole pair.',
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
      then: 'You found a right angle that no single 2D or 3D projection shows faithfully. The contributions are the evidence: the inner product keeps the relationship that the shadows can hide.',
    },
  ],
  notice: {
    changed: 'The shadows, and the angle each one appears to make.',
    held: '$u\\cdot v$: one number, computed from all four coordinates at once.',
    visible: 'Orthogonality as cancellation of contributions, which still works where pictures fail.',
    hidden: 'No single 2D or 3D projection faithfully shows the four-dimensional angle. The inner product preserves the relationship that the projections can hide.',
  },
  model(ctx) {
    const { u, v, exact } = ctx.data();
    const r = pairReadings(u, v);
    return { u, v, r, orthogonal: Math.abs(r.inner) < TOL, exact: !!exact && Math.abs(r.inner) < 1e-9 };
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
          ctx.setData({ ...d, v, exact: false });
        },
      }),
    );
    const preset = button({ label: 'Load u = (1,1,1,1), v = (1,−1,1,−1)', onclick: () => { ctx.flags.preset = true; ctx.setData({ ...ONE_PAIR, exact: true }); } });
    const remove = button({ label: 'Remove the shadow', onclick: () => { const d = ctx.data(); ctx.setData({ ...d, ...removeShadow(d.u, d.v) }); } });
    const uText = h('p', { class: 'note' });
    const waves = wavesUnder();
    return {
      figure: figure(
        h('p', { class: 'callout-projection' }, 'Six shadows of one pair, one per coordinate plane. A shadow is a projection: it drops two coordinates. No single panel shows the four-dimensional angle faithfully; the contributions below do not depend on any of them.'),
        shadows.el,
        waves.el,
        strip.el,
      ),
      controls: group(uText, ...vs.map((x) => x.el), row(preset.el, remove.el)),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        shadows.update(m.u, m.v);
        waves.update(m.u, m.v);
        strip.bars({ values: m.r.contributions, labels: ['u₁v₁', 'u₂v₂', 'u₃v₃', 'u₄v₄'], ...stripScales(m.r.contributions), total: m.r.inner });
        verdict.set(m.r.inner, { exact: m.exact });
        vs.forEach((x, i) => x.set(m.v[i]));
        uText.innerHTML = `${tex(`u = (${m.u.map((c) => num(c, 2)).join(',\\ ')})`)}, the wave f. The sliders change v, the wave g.`;
      },
    };
  },
};

const B_LABELS = ['b₁', 'b₂', 'b₃', 'b₄'];

const stage6 = {
  id: 'basis',
  title: 'A basis you can’t see',
  rep: B4,
  question: 'The four coordinates are coefficients in a basis of waves, $b_1=\\sqrt2\\cos 2\\pi t$, $b_2=-\\sqrt2\\sin 2\\pi t$, $b_3=\\sqrt2\\cos 4\\pi t$, $b_4=-\\sqrt2\\sin 4\\pi t$. Written in its own coordinates, each $b_k$ is one of the four unit directions of $\\mathbb R^4$, all at right angles. How would you know, without a picture?',
  equation: 'G_{ij} = \\langle b_i, b_j\\rangle,\\qquad G = I',
  symbols: [
    ['b_1,\\dots,b_4', 'the basis waves behind the coordinates: the first two harmonics, as cosine and sine'],
    ['G', 'the Gram matrix: every inner product $\\langle b_i,b_j\\rangle = \\int_0^1 b_ib_j\\,dt$ at once'],
    ['\\varepsilon', 'how far the basis is pushed off orthogonal: each $b_k$ tilts by $\\varepsilon$ in a fixed direction, then is rescaled to length 1'],
    ['a_k=\\langle x,b_k\\rangle', 'the coefficient of $x$ along $b_k$; here $x$ is the wave $g$, your $v$ from stage 5'],
  ],
  statements: ['ortho.signature', 'coef.crosstalk'],
  carry: BASIS,
  steps: [
    { prompt: 'Push the basis off orthogonal with the slider.', done: (m) => m.eps > 0.15, then: 'Off-diagonal cells appear: the basis waves now overlap, $\\langle b_i,b_j\\rangle\\ne0$. The coefficients stop working independently, so $\\sum_k a_kb_k$ no longer rebuilds $g$: the dashed wave pulls away, and the four checks on the right move off zero together. This is the cross-talk of Fourier Coefficients, in the real coordinates.' },
    { prompt: 'Bring the slider back to 0.', done: (m, c) => m.eps === 0 && !!c.flags.wasOff, then: 'All four checks return to zero at once: no cross terms, coefficients that rebuild $g$, squared coefficients that add up to $\\|g\\|^2$, and a residual orthogonal to what was kept. This is the H1-1 signature, read in a space with no picture.' },
  ],
  notice: {
    changed: 'The off-diagonal Gram entries, the rebuilt wave, and all four checks.',
    held: 'Every basis wave keeps length 1: the diagonal stays at 1.',
    visible: 'Orthogonality as a pattern in a table: a diagonal Gram matrix, and coefficients that rebuild the wave.',
    hidden: 'The directions themselves: no projection shows them faithfully, yet their inner products still reveal the geometry.',
  },
  model(ctx) {
    const d = ctx.data();
    const fromV = norm(d.x) > 0.2;
    const x = fromV ? d.x : d.u;
    const basis = perturbBasis(identity(4), d.eps);
    const sig = basisSignature(basis, x, d.retained);
    const recon = basis.reduce((acc, e, k) => add(acc, scale(e, sig.coeffs[k])), [0, 0, 0, 0]);
    if (d.eps > 0.15) ctx.flags.wasOff = true;
    return { ...d, x, fromV, basis, sig, recon };
  },
  readouts: (m) => [
    ['perturbation ε', num(m.eps, 2)],
    ['$\\|g\\|^2$', num(dot(m.x, m.x))],
    ['$\\sum_k a_k^2$', num(m.sig.coeffs.reduce((s, a) => s + a * a, 0))],
  ],
  advanced(m) {
    return h(
      'div',
      null,
      texEl(`G = ${matTex(m.sig.G, 3)}`, { display: true, tag: 'div' }),
      texEl(`a = (${m.sig.coeffs.map((a) => num(a, 3)).join(',\\ ')})`, { display: true, tag: 'div' }),
      texEl(`x = ${vecTex(m.x, 3)},\\quad \\textstyle\\sum_k a_kb_k = ${vecTex(m.recon, 3)}`, { display: true, tag: 'div' }),
    );
  },
  build(ctx) {
    const gram = createGramMatrix({ labels: B_LABELS, cell: 52 });
    const compare = createCompareBars({ aLabel: 'x', bLabel: 'Σ aₖbₖ, rebuilt from the coefficients', yMax: 2.5 });
    const waves = createWavesPlot({ rows: [{ height: 96 }] });
    const t = Array.from({ length: 301 }, (_, i) => i / 300);
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
        h('p', { class: 'caption' }, h('strong', null, 'Gram matrix of the basis waves. '), 'Diagonal: each wave with itself. Off-diagonal: each pair. Orthonormal means a warm diagonal on an empty field.'),
        gram.el,
        h('p', { class: 'caption' }, h('strong', null, 'The wave and its rebuild. '), 'Solid: g. Dashed: Σ aₖbₖ, built from the simple projection coefficients. They coincide only when the basis is orthonormal.'),
        waves.el,
        compare.el,
      ),
      controls: group(eps.el, kept.el, xNote),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'The orthogonality signature (H1-1), live'), sigList),
      update(m) {
        gram.update(m.sig.G, { showValues: ctx.mode === 'advanced' });
        compare.update(m.x, m.recon, ['x₁', 'x₂', 'x₃', 'x₄']);
        waves.update(t, [{ label: 'g, and its rebuild', yMax: 4, series: [{ values: t.map((s) => waveFromCoords(m.x, s)), style: 'ink' }, { values: t.map((s) => waveFromCoords(m.recon, s)), style: 'dashed' }] }]);
        eps.set(m.eps);
        kept.set(m.retained);
        xNote.textContent = m.fromV ? 'x is the wave g: the v you built in stage 5.' : 'Your v from stage 5 is almost zero, so x = u, the wave f, stands in.';
        const items = [
          ['Zero cross terms', 'max |G_ij|, i ≠ j', m.sig.crossTerms],
          ['Independent coefficients', '‖x − Σ aₖbₖ‖', m.sig.reconError],
          ['Parseval additivity', '‖x‖² − Σ aₖ²', m.sig.parsevalGap],
          [`Residual ⟂ the ${m.retained} kept`, 'max |⟨x − kept, bⱼ⟩|', m.sig.residualMax],
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

// Harmonics stop at k = 2, so the aliased root-of-unity sums (N | k + l, k + l ≠ 0) all vanish once N > 4 (card O2e).
const KMAX = 2;
const halfTick = (m) => String(m / 2);

const stage7 = {
  id: 'samples',
  title: 'Waves as vectors',
  rep: RN,
  question: 'The same two waves, $f$ from $u$ and $g$ from $v$, sampled at $N$ equally spaced times in one period. Each becomes a list of $N$ numbers: a vector in $\\mathbb R^N$.',
  equation: '\\langle \\mathbf f,\\mathbf g\\rangle_N = \\frac1N\\sum_{j=0}^{N-1} f(t_j)\\,g(t_j)',
  symbols: [
    ['t_j', '$j/N$: $N$ equally spaced times in one period $[0,1)$'],
    ['\\mathbf f', '$(f(t_0),\\dots,f(t_{N-1}))$: the wave as a vector'],
    ['f(t_j)g(t_j)', 'one contribution per sample, exactly like $u_iv_i$'],
    ['\\tfrac1N', 'a fixed scale, so the total can be compared across $N$, and with $u\\cdot v$'],
  ],
  statements: ['coef.sampled', 'ortho.inner-is-sum'],
  carry: SAMPLES,
  steps: [
    { prompt: 'Compare the sample dots with the bars: each bar is $f(t_j)g(t_j)/N$. Change $N$.', done: (m, c) => !!c.flags.touched, then: 'The same picture as for arrows: one signed contribution per coordinate, summed. For every $N$ above 4 the total is exactly $u\\cdot v$, the dot product of the arrows.' },
    { prompt: 'Lower $N$ until the total stops matching $u\\cdot v$.', done: (m) => Math.abs(m.gap) > 1e-6, then: 'With only $N$ samples, $e^{2\\pi ikt}$ and $e^{2\\pi i(k-N)t}$ take the same values (aliasing), so pairs of harmonics with $N\\mid k+l$ join the sum (card O2e). Because these waves stop at harmonic 2, $N>4$ is enough to exclude every such pair. That is a sufficient condition, not the definition: for some pairs the extra terms happen to cancel.' },
    { prompt: 'Raise $N$ to at least 32.', done: (m) => m.N >= 32, then: 'Thinner bars, and they trace a curve: the product $f(t)g(t)$. The next stage follows them to the limit.' },
  ],
  notice: {
    changed: 'The number of coordinates, $N$.',
    held: 'The rule: multiply matching coordinates and add. And for every $N>4$, the total itself.',
    visible: 'A wave is a vector, and the sample inner product equals the arrow inner product once the sampling resolves every harmonic present.',
    hidden: 'Everything between the samples.',
  },
  model(ctx) {
    const d = ctx.data();
    const { u, v, N } = d;
    const tj = Array.from({ length: N }, (_, j) => j / N);
    const fs = tj.map((t) => waveFromCoords(u, t));
    const gs = tj.map((t) => waveFromCoords(v, t));
    const contrib = fs.map((x, j) => (x * gs[j]) / N);
    const total = sampledInnerCoords(u, v, N);
    const uv = dot(u, v);
    const predicted = sampledPredictedCoords(u, v, N);
    const aliased = aliasedCoords(u, v, N);
    const curve = productCurveCoords(u, v, 1, 400);
    const resolved = N > 2 * KMAX;
    // ⟨f,g⟩_N = u·v + aliased terms. With u·v = 0 by construction, the samples are exactly orthogonal when the
    // aliased terms are exactly 0: always for N > 4, and at smaller N when each aliased pair meets a zero coefficient.
    return { ...d, tj, fs, gs, contrib, total, uv, predicted, aliased, gap: total - uv, curve, resolved, arrowsExact: !!d.exact, exact: !!d.exact && aliased === 0 };
  },
  readouts: (m) => [
    ['$\\langle\\mathbf f,\\mathbf g\\rangle_N$', signed(m.total, 4), signClass(m.total, 1e-9)],
    ['$u\\cdot v$, from the arrows', signed(m.uv, 4), signClass(m.uv, 1e-9)],
    ['difference', sci(m.gap)],
    ['aliased terms', m.aliased === 0 ? '0 exactly' : signed(m.aliased, 4)],
    ['root-of-unity prediction', signed(m.predicted, 4)],
    ['$N$', String(m.N)],
    ['sufficient condition $N>4$', m.resolved ? 'holds' : 'does not hold'],
  ],
  advanced(m) {
    const rows = m.tj.slice(0, 8).map((t, j) => `${j} & ${num(t, 3)} & ${num(m.fs[j], 3)} & ${num(m.gs[j], 3)} & ${num(m.contrib[j], 4)}`).join('\\\\');
    return h(
      'div',
      null,
      texEl(`\\begin{array}{rrrrr} j & t_j & f(t_j) & g(t_j) & \\tfrac1N f g\\\\ \\hline ${rows}${m.N > 8 ? '\\\\ \\vdots&&&&' : ''}\\end{array}`, { display: true, tag: 'div', cls: 'equation' }),
      texEl('\\frac1N\\sum_{j=0}^{N-1} e^{2\\pi i p j/N} = \\begin{cases} 1 & N\\mid p\\\\ 0 & \\text{otherwise}\\end{cases}', { display: true, tag: 'div' }),
      texEl('\\langle\\mathbf f,\\mathbf g\\rangle_N = \\sum_{N\\mid k+l}\\hat f(k)\\,\\hat g(l)\\qquad (k,l = \\pm1,\\pm2)', { display: true, tag: 'div' }),
    );
  },
  build(ctx) {
    const plot = createFunctionPlot();
    const strip = createContributionStrip({ title: 'Each sample’s contribution f(tⱼ)g(tⱼ)/N', runTitle: 'Running total: ⟨f, g⟩ in ℝᴺ' });
    const match = h('div', { class: 'verdict', 'aria-live': 'polite' });
    const verdict = liveVerdict();
    const nSl = slider({ label: 'Samples, N', min: 1, max: 64, step: 1, value: ctx.data().N, format: (x) => String(x), oninput: (x) => { ctx.flags.touched = true; ctx.setData({ ...ctx.data(), N: x }); } });
    return {
      figure: figure(plot.el, strip.el),
      controls: group(nSl.el, h('p', { class: 'note' }, 'f and g are the waves of your u and v from stage 5. Solid dots: samples of f. Open dots: samples of g.')),
      instruments: h(
        'div',
        { class: 'block' },
        h('div', { class: 'section-label' }, 'Samples against arrows'),
        match,
        h('div', { class: 'section-label' }, 'Live check (this configuration)'),
        verdict.el,
      ),
      update(m) {
        const yMax = nice(Math.max(...m.curve.f.map(Math.abs), ...m.curve.g.map(Math.abs), 0.5));
        plot.update({ curve: m.curve, L: 1, yMax, tickStep: 0.5, samples: { t: m.tj, f: m.fs, g: m.gs }, fLabel: 'f, from u', gLabel: 'g, from v' });
        strip.bars({ values: m.contrib, labels: m.N <= 8 ? m.tj.map((_, j) => `j=${j}`) : null, yMax: nice(Math.max(...m.contrib.map(Math.abs), 0.05)), runMax: nice(Math.max(prefixMax(m.contrib), Math.abs(m.uv), 0.1)), total: m.total });
        if (m.resolved) {
          match.className = 'verdict holds';
          match.innerHTML = `<b>Equal to u·v exactly.</b> With harmonics up to 2, every aliased root-of-unity sum vanishes once N &gt; 4, so the samples give the arrows’ inner product (card O2e). The displayed difference, ${sci(m.gap)}, is floating-point error.`;
        } else if (m.aliased === 0) {
          match.className = 'verdict holds';
          match.innerHTML = `<b>Equal to u·v exactly</b>, although N ≤ 4: every aliased pair of harmonics meets a coefficient that is exactly 0 (a harmonic this pair does not have). N &gt; 4 is sufficient, not necessary. The displayed difference, ${sci(m.gap)}, is floating-point error.`;
        } else if (Math.abs(m.aliased) > 1e-9) {
          match.className = 'verdict';
          match.innerHTML = `<b>Aliasing at N = ${m.N}.</b> Pairs of harmonics with N | k + l, k + l ≠ 0, join the sum. The sample total differs from u·v by ${num(m.gap, 4)}, the aliased terms the root-of-unity prediction names.`;
        } else {
          match.className = 'verdict approx';
          match.innerHTML = `<b>Nearly equal to u·v</b>, although N ≤ 4: for this pair the aliased terms almost cancel, leaving ${sci(m.aliased)}.`;
        }
        verdict.set(m.total, { what: '⟨f, g⟩_N', exact: m.exact, why: `by construction (carried from stage 5), and the aliased terms are exactly 0${m.resolved ? ' because N > 4' : ''}`, hint: m.arrowsExact ? 'The arrows are exactly orthogonal; at this N the aliased terms keep the samples from it.' : 'Remove the shadow, in stages 2 to 5, constructs that.' });
        nSl.set(m.N);
      },
    };
  },
};

const stage8 = {
  id: 'functions',
  title: 'Functions',
  rep: L2,
  question: 'Let $N$ grow without bound. The sum becomes an integral over one period, and the bars become an area. Then change the interval itself.',
  equation: '\\langle f, g\\rangle_L = \\int_0^{L} f(t)\\,g(t)\\,dt',
  symbols: [
    ['f(t)g(t)', 'the contribution at each instant: warm area above zero, cool area below'],
    ['L', 'the domain $[0,L]$ is part of the inner product. Over one period, $L=1$, it is exactly $u\\cdot v$'],
    ['b_1,\\dots,b_4', 'the basis waves of stage 6; their Gram matrix over $[0,L]$ is shown below'],
  ],
  statements: ['ortho.samples-to-integral', 'coef.arrows', 'coef.interval'],
  carry: FUNCS,
  steps: [
    { prompt: 'At $L=1$, compare the running integral with $u\\cdot v$. Then drag $L$ away from 1.', done: (m) => Math.abs(m.L - 1) > 0.15, then: 'Changing $L$ changes the inner product itself. $\\langle f,g\\rangle_L$ no longer equals $u\\cdot v$, some cross terms of the basis appear, and the diagonal moves off 1. The coordinates $u$ and $v$ did not change; the inner product they are measured with did.' },
    { prompt: 'Press Set L = 2.', done: (m) => m.L === 2, then: 'Two full periods: every cross term is exactly zero again, yet $G = 2I$, so the basis is orthogonal but not unit length, and $\\langle f,g\\rangle_2 = 2\\,u\\cdot v$ (card O2d).' },
    { prompt: 'Bring $L$ back to 1 (the button does it exactly).', done: (m, c) => m.L === 1 && !!c.flags.wasOff, then: 'One period gives $G=I$ by the closed form: the H1-1 signature, now for functions. The arrows of Fourier Coefficients, the vectors of stages 1 to 5, the samples of stage 7 and these functions are one object, and they give one number: $u\\cdot v = \\langle\\mathbf f,\\mathbf g\\rangle_N$ for $N>4$, $= \\int_0^1 fg\\,dt$.' },
  ],
  notice: {
    changed: 'The domain $[0,L]$, and with it the inner product: some cross terms, the diagonal, and the balance of warm and cool area.',
    held: 'The waves $f$ and $g$ themselves, and their coordinates $u$ and $v$: only how much of the product is integrated changes.',
    visible: 'The domain is part of the inner product, and so part of the geometry. Over one period the integral is the arrow inner product, and the basis has $G=I$.',
    hidden: 'Pointwise detail: one number now stands for the whole product curve.',
  },
  model(ctx) {
    const d = ctx.data();
    const { u, v, L } = d;
    const curve = productCurveCoords(u, v, L, 600);
    const inner = intervalInner(u, v, L);
    const uv = dot(u, v);
    const G = realBasisGram(4, L);
    let off = 0;
    let zeroCross = 0;
    G.forEach((r, i) => r.forEach((g, j) => {
      if (i !== j) off = Math.max(off, Math.abs(g));
      if (i < j && Math.abs(g) < 1e-12) zeroCross += 1;
    }));
    const diag = G.map((r, i) => r[i]);
    if (Math.abs(L - 1) > 0.15) ctx.flags.wasOff = true;
    let samples = null;
    if (d.showSamples) {
      const N = d.N ?? 8;
      const t = Array.from({ length: N }, (_, j) => (L * j) / N);
      const product = t.map((x) => waveFromCoords(u, x) * waveFromCoords(v, x));
      samples = { t, product, sum: (L / N) * product.reduce((a, b) => a + b, 0), N };
    }
    const wholePeriods = Number.isInteger(L) && L >= 1;
    return {
      ...d, curve, inner, uv, G, off, zeroCross, diag, samples, wholePeriods,
      exact: !!d.exact && wholePeriods,
      yMax: nice(Math.max(...Array.from(curve.product, Math.abs), 0.25)),
      runMax: nice(Math.max(...Array.from(curve.running, Math.abs), Math.abs(uv), 0.25)),
      fMax: nice(Math.max(...Array.from(curve.f, Math.abs), ...Array.from(curve.g, Math.abs), 0.5)),
    };
  },
  readouts: (m) => [
    ['$\\langle f,g\\rangle_L$ (closed form)', signed(m.inner, 4), signClass(m.inner, 1e-9)],
    ['$u\\cdot v$, from the arrows', signed(m.uv, 4), signClass(m.uv, 1e-9)],
    ['warm area', num(m.curve.positive, 4)],
    ['cool area', num(m.curve.negative, 4)],
    ['$L$', num(m.L, 2)],
    ['largest off-diagonal of $G$', sci(m.off)],
    ['cross terms zero (|value| < 10⁻¹²)', `${m.zeroCross} of 6`],
    ['diagonal of $G$', Math.max(...m.diag) - Math.min(...m.diag) < 1e-12 ? num(m.diag[0], 3) : `${num(Math.min(...m.diag), 3)} to ${num(Math.max(...m.diag), 3)}`],
    ...(m.samples ? [[`sample sum, $N=${m.samples.N}$`, signed(m.samples.sum, 4)]] : []),
  ],
  advanced(m) {
    return h(
      'div',
      null,
      texEl(`\\int_0^{${num(m.L, 2)}} f\\,g\\,dt = u^{\\mathsf T} G(L)\\, v = ${num(m.inner, 5)}`, { display: true, tag: 'div' }),
      texEl(`G(L) = ${matTex(m.G, 3)}`, { display: true, tag: 'div', cls: 'equation' }),
    );
  },
  build(ctx) {
    const plot = createFunctionPlot();
    const strip = createContributionStrip({ title: 'The contribution at each instant, f(t)g(t)', runTitle: 'Running integral: ends at ⟨f, g⟩_L' });
    const gram = createGramMatrix({ labels: B_LABELS, cell: 46 });
    const verdict = liveVerdict();
    const lSl = slider({ label: 'Interval length, L', min: 0.1, max: 2, step: 0.01, value: ctx.data().L, format: (x) => num(x, 2), oninput: (x) => ctx.setData({ ...ctx.data(), L: x }) });
    const one = button({ label: 'Set L = 1', onclick: () => ctx.setData({ ...ctx.data(), L: 1 }) });
    const two = button({ label: 'Set L = 2', onclick: () => ctx.setData({ ...ctx.data(), L: 2 }) });
    const samp = button({ label: 'Show the samples from stage 7', pressed: !!ctx.data().showSamples, modes: 'explore advanced', onclick: () => { const d = ctx.data(); ctx.setData({ ...d, showSamples: !d.showSamples }); } });
    return {
      figure: figure(
        plot.el,
        strip.el,
        h('div', { class: 'figure-row' }, h('div', null, h('p', { class: 'caption' }, h('strong', null, 'Gram matrix of the four basis waves over [0, L]. '), 'At L = 1 it is I, at L = 2 it is 2I. Other intervals change some entries, not necessarily all. Colour runs from −2 (cool) through 0 to +2 (warm), so I and 2I look different.'), gram.el)),
      ),
      controls: group(lSl.el, row(one.el, two.el, samp.el)),
      instruments: h('div', { class: 'block' }, h('div', { class: 'section-label' }, 'Live check (this configuration)'), verdict.el),
      update(m) {
        plot.update({ curve: m.curve, L: m.L, yMax: m.fMax, tickStep: 0.5, fLabel: 'f, from u', gLabel: 'g, from v' });
        strip.area({ curve: m.curve, L: m.L, yMax: m.yMax, runMax: m.runMax, total: m.inner, samples: m.samples, tickStep: 0.5, tickLabel: halfTick });
        gram.update(m.G, { showValues: true, digits: 2, scaleMax: 2 });
        verdict.set(m.inner, { what: '⟨f, g⟩_L', exact: m.exact, why: 'by construction (carried from stage 5), and over whole periods G = L·I', hint: 'Remove the shadow, in stages 2 to 5, constructs that.' });
        lSl.set(m.L);
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
  question: 'One relationship, $\\langle u,v\\rangle = 0$, followed from the coefficient arrows of your signal into spaces you cannot see. In every view an inner product is a sum of signed contributions, and orthogonality is when they cancel.',
  stages: [stage1, stage2, stage3, stage4, stage5, stage6, stage7, stage8],
  connections: [
    ['C1', 'one preservation equation, many geometries'],
    ['C4', 'C4b: Fourier series as unitary coordinates, where your evidence started'],
    ['C5', 'the other zero, q(v) = 0, compared later and never merged'],
    ['C6', 'projection by averaging is orthogonal projection'],
  ],
  investigation: ['H1', 'H2.pattern'],
};
