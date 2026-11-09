import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as q from '../src/math/spin.js';
import { resultant } from '../src/math/zero.js';
import { matVec, norm } from '../src/math/linalg.js';

test('stage 2b: S_z returns 0 with certainty for both states', () => {
  for (const psi of [q.STATE_A, q.STATE_B]) {
    const r = q.reading(q.SZ, psi);
    assert.equal(r.value, 0);
    assert.equal(r.residual, 0);
    assert.ok(r.definite);
  }
});

test('stage 2b: S² separates them, 2ħ² for A and 0 for B, and S² commutes with S_z', () => {
  const a = q.reading(q.S2, q.STATE_A);
  const b = q.reading(q.S2, q.STATE_B);
  assert.ok(a.definite && b.definite);
  assert.ok(Math.abs(a.value - 2) < 1e-12);
  assert.ok(Math.abs(b.value) < 1e-12);
  assert.ok(q.commutes(q.S2, q.SZ));
});

test('stage 2b: the same S_z result, but not the same state; every mix of ↑↓ and ↓↑ also gives S_z = 0', () => {
  assert.equal(q.sameState(q.STATE_A, q.STATE_B), false);
  assert.ok(q.sameState(q.STATE_A, q.STATE_A.map((x) => -x)));
  for (const t of [0.3, 1.1, 2.4]) {
    const psi = [0, Math.cos(t), Math.sin(t), 0];
    assert.equal(q.reading(q.SZ, psi).value, 0);
    assert.ok(q.reading(q.SZ, psi).definite);
  }
});

test('research note (Z4a): any linear map applied to every vector keeps a zero resultant at zero', () => {
  const vs = [[1, 2], [-3, 0.5], [2, -2.5]];
  assert.deepEqual(resultant(vs).map(Math.abs), [0, 0]);
  for (const A of [[[2, 0], [0, 2]], [[1, 3], [0, 1]], [[0.4, -1.2], [2.2, 0.7]]]) {
    assert.ok(norm(resultant(vs.map((v) => matVec(A, v)))) < 1e-12);
  }
});
