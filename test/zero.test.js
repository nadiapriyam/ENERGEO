import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as z from '../src/math/zero.js';
import { norm, sub, add, scale, rotationAxisAngle } from '../src/math/linalg.js';

const close = (a, b, tol = 1e-12) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test('stage 1: v + (−v) is exactly zero while both vectors are nonzero; many pairs give the same reading', () => {
  for (const v of [[1.6, 0.9], [-0.3, 2.1], [2.5, -1.25]]) {
    const r = z.pairResultant(v, scale(v, -1));
    assert.deepEqual(r.r.map(Math.abs), [0, 0]);
    assert.ok(r.lengths[0] > 0 && r.lengths[1] > 0);
  }
  assert.ok(z.pairResultant([1, 0], [-0.9, 0.1]).size > z.ZERO_TOL);
});

test('stage 2: the first constructed state sums to exactly 0 in floating point, with equal nonzero lengths', () => {
  const ms = z.tetraConfiguration(1.6);
  assert.deepEqual(z.resultant(ms).map(Math.abs), [0, 0, 0]);
  for (const m of ms) close(norm(m), 1.6);
});

test('stage 2: completing to zero keeps the resultant exactly 0 when the last contribution adjusts', () => {
  const ms = z.tetraConfiguration();
  ms[0] = z.fromAngles(0.4, 0.2, 2.1);
  ms[1] = z.fromAngles(2.2, -0.5, 0.9);
  const out = z.completeToZero(ms, 3);
  assert.ok(out.ok);
  assert.deepEqual(z.resultant(out.ms).map(Math.abs), [0, 0, 0]);
  // a different adjusting contribution: exact in construction, a floating-point residual at most
  const other = z.completeToZero(ms, 1);
  assert.ok(norm(z.resultant(other.ms)) < 1e-14);
  // refusing to let a contribution vanish
  const bad = z.completeToZero([[1, 0, 0], [-1, 0, 0], [0, 0.1, 0], [0, 0, 0]], 3);
  assert.equal(bad.ok, false);
});

test('stage 3b: a pair twist changes both contributions and keeps their sum, so the zero is kept', () => {
  const ms = z.randomZeroConfiguration(5, 7);
  const tw = z.pairTwist(ms, 0, 2, 1.1);
  close(norm(sub(add(tw[0], tw[2]), add(ms[0], ms[2]))), 0, 1e-12);
  assert.ok(norm(sub(tw[0], ms[0])) > 0.1);
  assert.ok(norm(z.resultant(tw)) < 1e-12);
  // antiparallel pair: sum 0, any axis
  const anti = z.pairTwist([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]], 0, 1, 0.7);
  assert.ok(norm(z.resultant(anti)) < 1e-12);
});

test('stage 3b: changes applied to every contribution keep zero; changes to one contribution do not', () => {
  const ms = z.randomZeroConfiguration(4, 3);
  const R = rotationAxisAngle([0.3, 1, 0.2], 0.8);
  assert.ok(norm(z.resultant(z.CHANGES.turnAll(ms, R))) < 1e-12);
  assert.ok(norm(z.resultant(z.CHANGES.scaleAll(ms, 1.5))) < 1e-12);
  assert.ok(norm(z.resultant(z.CHANGES.reverseAll(ms))) < 1e-12);
  assert.ok(norm(z.resultant(z.CHANGES.swap(ms, 0, 3))) < 1e-12);
  assert.ok(norm(z.resultant(z.CHANGES.turnOne(ms, 1, R))) > 0.05);
  assert.ok(norm(z.resultant(z.CHANGES.scaleOne(ms, 1, 1.5))) > 0.05);
});

test('stage 3b: generated configurations are exact zeros with every contribution nonzero and lengths that differ', () => {
  for (let seed = 1; seed < 20; seed++) {
    const ms = z.randomZeroConfiguration(4, seed);
    assert.deepEqual(z.resultant(ms).map(Math.abs), [0, 0, 0]);
    for (const m of ms) assert.ok(norm(m) >= z.MIN_LENGTH);
    const L = ms.map(norm);
    assert.ok(Math.max(...L) - Math.min(...L) > 1e-6);
  }
});

test('stage 3: F(R) = M (R_CM − R), so for positive masses the only zero is the balancing point', () => {
  const m = [1, 2.5, 0.7];
  const r = [[-1.5, 0.4], [1.2, 1.1], [0.3, -1.8]];
  const M = z.totalMass(m);
  const C = z.balancingPoint(m, r);
  for (const R of [[0, 0], [2, -1], C]) {
    const { F } = z.firstMoment(m, r, R);
    const expect = scale(sub(C, R), M);
    close(F[0], expect[0], 1e-12);
    close(F[1], expect[1], 1e-12);
  }
  assert.ok(norm(z.firstMoment(m, r, C).F) < 1e-12);
});

test('stage 3: shifting every mass by a moves the balancing point by a (card Z3c)', () => {
  const m = [1, 2.5, 0.7];
  const r = [[-1.5, 0.4], [1.2, 1.1], [0.3, -1.8]];
  const a = [0.6, -0.35];
  const C1 = z.balancingPoint(m, r.map((p) => add(p, a)));
  const C0 = z.balancingPoint(m, r);
  close(C1[0], C0[0] + a[0]);
  close(C1[1], C0[1] + a[1]);
});
