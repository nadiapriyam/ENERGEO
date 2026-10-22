import { test } from 'node:test';
import assert from 'node:assert/strict';

import { matVec, axisAngle, norm, dot, matMul, transpose, identity, maxAbs, matSub } from '../src/math/linalg.js';
import * as forms from '../src/math/forms.js';
import * as ip from '../src/math/innerProduct.js';
import * as fourier from '../src/math/fourier.js';
import * as defect from '../src/math/defect.js';
import * as groups from '../src/math/groups.js';
import * as proj from '../src/math/projection.js';

const close = (a, b, tol = 1e-9, msg) => assert.ok(Math.abs(a - b) <= tol, msg ?? `${a} ≉ ${b} (tol ${tol})`);

test('block 1: exp(sJ) preserves every form; shear and stretch do not', () => {
  for (const { M } of Object.values(forms.METRICS)) {
    for (const s of [-1.3, 0.2, 0.9, 2.5]) {
      const A = forms.groupElement(M, s);
      close(forms.preservationResidual(A, M), 0, 1e-12);
      const x = [0.7, -0.4];
      close(forms.Q(M, matVec(A, x)), forms.Q(M, x), 1e-12);
    }
    assert.ok(forms.preservationResidual(forms.transformation('shear', M, 0.6), M) > 1e-3);
    assert.ok(forms.preservationResidual(forms.transformation('stretch', M, 0.6), M) > 1e-3);
  }
});

test('block 1: Euclidean group element is the ordinary rotation; Minkowski is a boost', () => {
  const R = forms.groupElement(forms.METRICS.euclidean.M, 0.8);
  close(maxAbs(matSub(R, forms.transformation('rotation', null, 0.8))), 0, 1e-12);
  const B = forms.groupElement(forms.METRICS.minkowski.M, 0.5);
  close(B[0][0], Math.cosh(0.5), 1e-12);
  close(B[0][1], Math.sinh(0.5), 1e-12);
});

test('block 1: level sets satisfy xᵀMx = q, and the orbit stays on one level set', () => {
  for (const [key, q] of [['weighted', 1.7], ['minkowski', 0.6], ['minkowski', -0.6]]) {
    const { M } = forms.METRICS[key];
    for (const curve of forms.levelSet(M, q)) for (const p of curve) close(forms.Q(M, p), q, 1e-9);
  }
  const { M } = forms.METRICS.minkowski;
  const x0 = [1.2, 0.5];
  for (const p of forms.orbit(M, x0)) close(forms.Q(M, p), forms.Q(M, x0), 1e-9);
});

test('block 1: null vectors are η-orthogonal to themselves', () => {
  const { M } = forms.METRICS.minkowski;
  close(forms.mInner(M, [1, 1], [1, 1]), 0);
  const u = [0.3, 0.9];
  close(forms.mInner(M, u, forms.mOrthogonalDirection(M, u)), 0, 1e-12);
});

test('block 2: residual of G-projection is G-orthogonal; plane normal is Gu', () => {
  const G = ip.metricFromSpectrum([3, 1, 0.4], [0.3, -0.5, 0.9]);
  const u = [1, 0.2, -0.4];
  const v = [-0.3, 1.1, 0.6];
  const { residual } = ip.projectG(G, v, u);
  close(ip.inner(G, u, residual), 0, 1e-12);
  const { normal } = ip.orthogonalPlane(G, u);
  close(dot(normal, residual), 0, 1e-12);
  close(ip.tangentAtDirection(G, u).misalignment, 0, 1e-12);
});

test('block 2: Euclidean-perpendicular vectors are not G-orthogonal in general', () => {
  const G = ip.metricFromSpectrum([3, 1, 0.4], [0.3, -0.5, 0.9]);
  const u = [1, 0, 0];
  const v = [0, 1, 0];
  close(ip.angleEuclid(u, v), Math.PI / 2);
  assert.ok(Math.abs(ip.inner(G, u, v)) > 1e-3);
  assert.ok(ip.orthogonalPlane(G, u).tilt > 1e-3);
});

test('block 2: unit ball radii are 1/√λ and Gram–Schmidt gives Gram = I', () => {
  const G = ip.metricFromSpectrum([4, 1, 0.25]);
  const { radii } = ip.unitBall(G);
  close(radii[0], 2, 1e-10);
  close(radii[2], 0.5, 1e-10);
  const E = ip.gramSchmidtG(G, [[1, 1, 0], [0, 1, 1], [1, 0, 1]]);
  close(maxAbs(matSub(ip.gram(G, E), identity(3))), 0, 1e-10);
});

test('block 3: trig basis is orthogonal over one period, not over a partial one', () => {
  const basis = fourier.trigBasis(3);
  const full = fourier.basisGram(basis, 2 * Math.PI);
  full.forEach((row, i) => row.forEach((v, j) => close(v, i === j ? Math.PI : 0, 1e-12)));
  const part = fourier.basisGram(basis, 2 * Math.PI * 0.8);
  const off = part.flatMap((row, i) => row.filter((_, j) => j !== i));
  assert.ok(Math.max(...off.map(Math.abs)) > 0.05);
});

test('block 3: closed-form basis inner products match numerical integration', () => {
  const L = 4.1;
  const pairs = [
    [{ kind: 'cos', k: 1 }, { kind: 'cos', k: 3 }],
    [{ kind: 'sin', k: 2 }, { kind: 'cos', k: 1 }],
    [{ kind: 'sin', k: 2 }, { kind: 'sin', k: 2 }],
  ];
  for (const [f, g] of pairs) {
    const num = fourier.simpson((t) => fourier.basisValue(f, t) * fourier.basisValue(g, t), 0, L, 4096);
    close(fourier.basisInner(f, g, L), num, 1e-10);
  }
});

test('block 3: FFT recovers component amplitudes', () => {
  const comps = [{ k: 2, a: 1, b: 0 }, { k: 5, a: 0.3, b: 0.4 }];
  const { x } = fourier.sample(comps, { n: 256 });
  const { amp } = fourier.spectrum(x);
  close(amp[2], 1, 1e-10);
  close(amp[5], 0.5, 1e-10);
  close(amp[3], 0, 1e-10);
});

test('block 4: Parseval holds in both discrete and continuous form', () => {
  const comps = [{ k: 1, a: 0.8, b: 0 }, { k: 3, a: -0.2, b: 0.5 }, { k: 4, a: 0.1, b: 0.1 }];
  const d = fourier.discreteParseval(fourier.sample(comps, { n: 512 }).x);
  close(d.time, d.freq, 1e-8);
  const c = fourier.continuousParseval(comps);
  close(c.time, c.freq, 1e-9);
});

test('block 4: cross term vanishes over a full period, and ‖x‖² = Σ‖xᵢ‖² + cross always', () => {
  const parts = [{ k: 1, a: 1, b: 0 }, { k: 2, a: 0.6, b: 0.2 }, { k: 3, a: 0, b: 0.7 }];
  const full = fourier.partsGeometry(parts, 2 * Math.PI);
  close(full.crossTerm, 0, 1e-12);
  const part = fourier.partsGeometry(parts, 2 * Math.PI * 0.62);
  assert.ok(Math.abs(part.crossTerm) > 1e-3);
  const L = 2 * Math.PI * 0.62;
  const num = fourier.simpson((t) => parts.reduce((s, c) => s + fourier.componentValue(c, t), 0) ** 2, 0, L, 4096);
  close(part.total, num, 1e-9);
  // the embedding is faithful: embedded vectors reproduce the Gram matrix
  const E = part.embedding;
  close(maxAbs(matSub(matMul(E, transpose(E)), part.G)), 0, 1e-10);
});

test('block 5: defect closed form matches the waveform time-average, and ignores phase', () => {
  const tones = defect.twoTone(Math.SQRT2, { a1: 1, a2: 0.7, phi: 1.1 });
  for (const tau of [0.4, 2, 7.5]) {
    close(defect.defectTones(tones, tau), defect.defectTonesNumeric(tones, tau, { window: 3000, samples: 300000 }), 2e-3);
  }
  const rephased = defect.twoTone(Math.SQRT2, { a1: 1, a2: 0.7, phi: -2.4 });
  close(defect.defectTones(tones, 3.3), defect.defectTones(rephased, 3.3), 1e-15);
});

test('block 5: rational r has an exact zero-defect valley at τ = 2πq; irrational does not', () => {
  close(defect.defectTones(defect.twoTone(3 / 2), 2 * Math.PI * 2), 0, 1e-12);
  const v = defect.valleys(defect.twoTone(Math.SQRT2), { tauMax: 40 * Math.PI, below: 0.5 });
  assert.ok(v.length > 0 && v.every(({ D }) => D > 1e-6));
  const cf = defect.convergents(Math.SQRT2, 5).map(({ p, q }) => `${p}/${q}`);
  assert.deepEqual(cf, ['1/1', '3/2', '7/5', '17/12', '41/29']);
});

test('block 6: cube groups satisfy the axioms and orbit–stabilizer', () => {
  for (const { make } of Object.values(groups.GROUPS)) {
    const G = make();
    assert.ok(groups.isGroup(G));
    for (const { x } of Object.values(groups.SPECIAL_POINTS)) {
      const { points } = groups.orbit(G, x);
      assert.equal(points.length * groups.stabilizer(G, x).length, G.length);
    }
  }
  const O = groups.cubeRotations();
  assert.equal(O.length, 24);
  const sizes = Object.fromEntries(
    Object.entries(groups.SPECIAL_POINTS).map(([k, { x }]) => [k, groups.orbit(O, x).points.length]),
  );
  assert.deepEqual(sizes, { generic: 24, edge: 12, vertex: 8, face: 6 });
});

test('block 6: proper action path ends at g·x and stays on the sphere', () => {
  const O = groups.cubeRotations();
  const x = groups.SPECIAL_POINTS.generic.x;
  for (const g of O) {
    const path = groups.actionPath(g, x);
    const end = path[path.length - 1];
    close(norm(end.map((v, i) => v - matVec(g, x)[i])), 0, 1e-9);
    path.forEach((p) => close(norm(p), 1, 1e-9));
  }
});

test('block 7: C₃ shift is a 120° rotation about (1,1,1)', () => {
  const { axis, angle } = axisAngle(proj.SHIFT);
  close(angle, (2 * Math.PI) / 3, 1e-12);
  axis.forEach((a) => close(a, 1 / Math.sqrt(3), 1e-12));
});

test('block 7: group averaging is an orthogonal projection onto Fix(H)', () => {
  const x = [1.4, -0.3, 0.5];
  for (const { elements } of Object.values(proj.SUBGROUPS)) {
    const d = proj.decompose(elements, x);
    close(d.idempotence, 0, 1e-12);
    close(d.selfAdjoint, 0, 1e-12);
    close(d.crossInner, 0, 1e-12);
    close(d.pythagoras, 0, 1e-12);
    for (const h of elements) close(norm(matVec(h, d.sym).map((v, i) => v - d.sym[i])), 0, 1e-12);
  }
  assert.equal(proj.decompose(proj.SUBGROUPS.c3.elements, x).rank, 1);
  assert.equal(proj.decompose(proj.SUBGROUPS.z2.elements, x).rank, 2);
});

test('block 7: averaging over shifts by d keeps exactly the d-periodic part', () => {
  const n = 8;
  const x = Array.from({ length: n }, (_, i) => Math.cos((2 * Math.PI * 2 * i) / n) + 0.5 * Math.cos((2 * Math.PI * 1 * i) / n));
  const p = proj.cyclicSubgroupAverage(x, 4);
  p.forEach((v, i) => close(v, Math.cos((2 * Math.PI * 2 * i) / n), 1e-12));
});
