// Chapter I's copy against the discovery rules (DR-1, DR-2) and the naming rule for the zero-producing set.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STAGES, CHAPTER, PHASES, BANNED_PHRASES, BANNED_STRUCTURE_TERMS } from '../src/interactives/zero/copy.js';

const strings = (x) => (typeof x === 'string' ? [x] : Array.isArray(x) ? x.flatMap(strings) : x && typeof x === 'object' ? Object.values(x).flatMap(strings) : []);

test('no banned phrase or structure name anywhere in Chapter I', () => {
  for (const s of [...strings(CHAPTER), ...strings(STAGES)]) {
    const low = s.toLowerCase();
    for (const b of [...BANNED_PHRASES, ...BANNED_STRUCTURE_TERMS]) assert.ok(!low.includes(b), `"${b}" in: ${s}`);
  }
});

test('DR-1: steps run in discovery order and a formalize step, when present, comes last', () => {
  for (const [num, st] of Object.entries(STAGES)) {
    const idx = st.steps.map((s) => PHASES.indexOf(s.phase));
    assert.ok(idx.every((i) => i >= 0), `stage ${num}: unknown phase`);
    for (let i = 1; i < idx.length; i++) assert.ok(idx[i] >= idx[i - 1], `stage ${num}: ${st.steps[i].phase} after ${st.steps[i - 1].phase}`);
    const f = st.steps.findIndex((s) => s.phase === 'formalize');
    if (f >= 0) assert.equal(f, st.steps.length - 1, `stage ${num}: formalize is not last`);
    assert.equal(f >= 0, !!st.formal, `stage ${num}: a formal block needs a formalize step, and the reverse`);
  }
});

test('DR-2: nothing shown before the formalize phase uses the terms that explain the pattern', () => {
  for (const [num, st] of Object.entries(STAGES)) {
    const f = st.steps.findIndex((s) => s.phase === 'formalize');
    const before = [st.title, st.question, st.origin ?? '', ...strings(st.measurement), ...strings(st.observations), ...st.steps.slice(0, f < 0 ? undefined : f).flatMap((s) => [s.prompt, s.then])];
    for (const s of before) for (const t of st.revealTerms) assert.ok(!s.includes(t), `stage ${num}: "${t}" appears before formalization in: ${s}`);
  }
});

test('stage 2 has no position and no measurement axis (D3)', () => {
  for (const s of [...strings(STAGES[2]), ...strings(STAGES['3b'])]) assert.ok(!/\baxis\b/i.test(s), s);
  assert.ok(STAGES[2].measurement.symbols.some(([, t]) => /no position/i.test(t)));
});
