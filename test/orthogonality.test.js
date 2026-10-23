import { test } from 'node:test';
import assert from 'node:assert/strict';

import * as o from '../src/math/orthogonality.js';
import { dot, norm, identity, maxAbs, matSub } from '../src/math/linalg.js';
import { trigBasis } from '../src/math/fourier.js';

const close = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol, `${a} ≉ ${b} (tol ${tol})`);

test('pair readings: contributions sum to the inner product; residual is always ⟂ u', () => {
  const u = [2, 0.8];
  for (const v of [[1, 1], [-0.8, 2], [0.3, -1.4]]) {
    const r = o.pairReadings(u, v);
    close(r.contributions.reduce((s, c) => s + c, 0), r.inner, 1e-12);
    close(r.residualDot, 0, 1e-12);
    close(r.normSum2, r.pythagoras + r.crossTerm, 1e-12);
  }
});

test('pair readings: orthogonal pair has zero shadow, zero cross term, right angle', () => {
  const r = o.pairReadings([2, 0.8], [-0.8, 2]);
  close(r.inner, 0, 1e-12);
  close(norm(r.shadow), 0, 1e-12);
  close(r.crossTerm, 0, 1e-12);
  close(r.angle, Math.PI / 2, 1e-12);
});

test('screen projection distorts angles; rotation of both vectors does not change ⟨u,v⟩', () => {
  const u = [1, 0, 0];
  const v = [0, 1, 0];
  close(o.projectedAngle(u, v, [1, 1, 1]), (2 * Math.PI) / 3, 1e-12);
  close(o.projectedAngle([1, 0, 1], [0, 1, 1], [0, 0, 1]), Math.PI / 2, 1e-12);
  const { u: ru, v: rv } = o.rotatePair([1, 0.4, -0.2], [0.3, -0.5, 0.9], [0.2, 1, -0.4], 1.1);
  close(dot(ru, rv), dot([1, 0.4, -0.2], [0.3, -0.5, 0.9]), 1e-12);
});

test('coordinate shadows of an orthogonal pair in R⁴ need not look orthogonal', () => {
  const u = [1, 1, 1, 1];
  const v = [1, -1, 1, -1];
  close(dot(u, v), 0);
  const angles = o.coordinatePlanes(4).map(([i, j]) => o.coordinateShadow(u, v, i, j).angle);
  assert.equal(angles.length, 6);
  assert.ok(angles.some((a) => Math.abs(a - Math.PI / 2) > 0.1));
  assert.ok(angles.some((a) => Math.abs(a - Math.PI / 2) < 1e-12));
});

test('basis signature: all four checks vanish for an orthonormal basis and appear when perturbed', () => {
  for (const n of [4, 6]) {
    const Q = o.tiltedOrthonormalBasis(n);
    close(maxAbs(matSub(Q.map((a) => Q.map((b) => dot(a, b))), identity(n))), 0, 1e-12);
    const x = Array.from({ length: n }, (_, i) => Math.sin(i + 1));
    const s0 = o.basisSignature(Q, x);
    close(s0.crossTerms, 0, 1e-12);
    close(s0.reconError, 0, 1e-12);
    close(s0.parsevalGap, 0, 1e-12);
    close(s0.residualMax, 0, 1e-12);
    const s1 = o.basisSignature(o.perturbBasis(Q, 0.4), x);
    close(s1.diagDeviation, 0, 1e-12);
    for (const k of ['crossTerms', 'reconError', 'residualMax']) assert.ok(s1[k] > 1e-3, k);
    assert.ok(Math.abs(s1.parsevalGap) > 1e-3);
  }
});

test('sampled waves: discrete orthogonality is exact; sums approach the integral off-period', () => {
  const c1 = { kind: 'cos', k: 1 };
  const c3 = { kind: 'cos', k: 3 };
  close(o.sampledInner(c1, c3, 8), 0, 1e-12);
  close(o.sampledInner(c1, c1, 8), Math.PI, 1e-12);
  const L = 4.1;
  const exact = o.functionInner(c1, c3, L);
  const e1 = Math.abs(o.sampledInner(c1, c3, 64, L) - exact);
  const e2 = Math.abs(o.sampledInner(c1, c3, 1024, L) - exact);
  assert.ok(e2 < e1 / 8);
});

test('product curve: positive and negative areas cancel over a full period', () => {
  const pc = o.productCurve({ kind: 'cos', k: 2 }, { kind: 'cos', k: 3 }, 2 * Math.PI, 2000);
  close(pc.running[pc.running.length - 1], 0, 1e-9);
  close(pc.positive + pc.negative, 0, 1e-9);
  assert.ok(pc.positive > 1);
});

test('normalised trig Gram is I over a full period only', () => {
  const B = trigBasis(3);
  close(maxAbs(matSub(o.normalisedTrigGram(B, 2 * Math.PI), identity(6))), 0, 1e-12);
  assert.ok(maxAbs(matSub(o.normalisedTrigGram(B, 2 * Math.PI * 0.8), identity(6))) > 0.05);
});
