import { test } from 'node:test';
import assert from 'node:assert/strict';

import * as c from '../src/math/coefficients.js';
import { dot, identity, maxAbs, matSub } from '../src/math/linalg.js';

const close = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol, `${a} ≉ ${b} (tol ${tol})`);
const SIG = [[0.6, -0.35], [0.25, 0.3], [-0.15, 0.1]]; // f̂(1), f̂(2), f̂(3)

test('a coefficient is a projection: the wound curve’s centroid is f̂(k), exactly', () => {
  for (let k = 1; k <= 3; k++) {
    const { centroid } = c.winding(SIG, k);
    close(centroid[0], SIG[k - 1][0], 1e-12);
    close(centroid[1], SIG[k - 1][1], 1e-12);
  }
});

test('independence: only component k contributes to ⟨f, e_k⟩', () => {
  for (let k = 1; k <= 3; k++) {
    c.componentProjections(SIG, k).forEach((p, j) => {
      const want = j === k - 1 ? SIG[k - 1] : [0, 0];
      close(p[0], want[0], 1e-12);
      close(p[1], want[1], 1e-12);
    });
  }
});

test('Parseval and removal: dropping f̂(k) lowers ‖f‖² by exactly 2|f̂(k)|² and moves no other coefficient', () => {
  const { parts, total } = c.energy(SIG);
  close(total, c.energyFromSamples(SIG), 1e-12);
  const active = [true, false, true];
  close(c.energyFromSamples(SIG, { active }), total - parts[1], 1e-12);
  for (const k of [1, 3]) {
    const { centroid } = c.winding(SIG, k, { active });
    close(centroid[0], SIG[k - 1][0], 1e-12);
    close(centroid[1], SIG[k - 1][1], 1e-12);
  }
});

test('cross-talk: orthonormal at ε = 0; Gram, rebuild and Parseval all break when perturbed; rebuild stays real', () => {
  const z = c.crosstalk(SIG, 0);
  close(maxAbs(matSub(z.G, identity(6))), 0, 1e-12);
  close(z.rebuildError, 0, 1e-12);
  close(z.parsevalGap, 0, 1e-12);
  const p = c.crosstalk(SIG, 0.3);
  assert.ok(p.crossTerms > 1e-3 && p.rebuildError > 1e-3 && Math.abs(p.parsevalGap) > 1e-3);
  const idx = p.idx;
  idx.forEach((j, a) => {
    const b = idx.indexOf(-j);
    close(p.rebuilt[a][0], p.rebuilt[b][0], 1e-12);
    close(p.rebuilt[a][1], -p.rebuilt[b][1], 1e-12);
  });
});

test('arrows: ⟨f, g⟩ over [0,1] equals the dot product of the √2 f̂(k) arrows', () => {
  const G2 = [[-0.2, 0.5], [0.4, -0.1], [0.05, 0.3]];
  const x = SIG.flatMap(c.arrowOf);
  const y = G2.flatMap(c.arrowOf);
  for (const t of [0, 0.13, 0.5, 0.91]) close(c.waveFromCoords(x, t), c.signalValue(SIG, t), 1e-12);
  let s = 0;
  const M = 512;
  for (let j = 0; j < M; j++) s += c.signalValue(SIG, j / M) * c.signalValue(G2, j / M);
  close(s / M, dot(x, y), 1e-12);
  close(c.intervalInner(x, y, 1), dot(x, y), 1e-12);
});

test('the domain is part of the inner product: real basis Gram is I on [0,1], 2I on [0,2], partial on [0,1.5]', () => {
  close(maxAbs(matSub(c.realBasisGram(4, 1), identity(4))), 0, 1e-12);
  close(maxAbs(matSub(c.realBasisGram(4, 2), identity(4).map((r) => r.map((v) => 2 * v)))), 0, 1e-12);
  const G = c.realBasisGram(4, 1.5);
  const off = G.flatMap((r, i) => r.filter((_, j) => j > i));
  assert.ok(off.some((v) => Math.abs(v) < 1e-12) && off.some((v) => Math.abs(v) > 0.05));
});

test('sampled inner product: equals the root-of-unity prediction for every N, and the true value once N > 2K', () => {
  const x = [1.1, -0.4, 0.3, 0.7];
  const y = [-0.2, 0.9, 0.5, -0.6];
  for (let N = 2; N <= 12; N++) close(c.sampledInnerCoords(x, y, N), c.sampledPredictedCoords(x, y, N), 1e-12);
  for (let N = 5; N <= 12; N++) close(c.sampledInnerCoords(x, y, N), dot(x, y), 1e-12);
  assert.ok(Math.abs(c.sampledInnerCoords(x, y, 3) - dot(x, y)) > 1e-3);
});

test('aliased terms: the sampled sum is u·v plus them; zero once N > 2K, and exactly zero when a harmonic is absent', () => {
  const x = [1.1, -0.4, 0.3, 0.7];
  const y = [-0.2, 0.9, 0.5, -0.6];
  for (let N = 1; N <= 12; N++) close(c.sampledInnerCoords(x, y, N), dot(x, y) + c.aliasedCoords(x, y, N), 1e-12);
  for (let N = 5; N <= 12; N++) assert.equal(c.aliasedCoords(x, y, N), 0);
  assert.ok(Math.abs(c.aliasedCoords(x, y, 2)) > 1e-3);
  // second harmonic removed from both: k + l = ±3 and ±4 need a second harmonic, so N = 3 and N = 4 alias nothing
  const x1 = [1.1, -0.4, 0, 0];
  const y1 = [-0.2, 0.9, 0, 0];
  assert.equal(c.aliasedCoords(x1, y1, 3), 0);
  assert.equal(c.aliasedCoords(x1, y1, 4), 0);
  assert.ok(Math.abs(c.aliasedCoords(x1, y1, 2)) > 1e-3);
});
