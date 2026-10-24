// The journey: mathematical objects carried from one stage (and later, one interactive) to the next.
//
// Master Map principle: never abandon an object once the learner understands it; transform or extend it.
// So an object is not reset when the view changes. It holds one entry per representation it has been
// given (R², R³, Rⁿ, …), each derived from an earlier one by a named transformation, and a trail that
// records every derivation. If the source representation changes later, the derived one is rebuilt and
// the trail says so.
//
// Object shape:
//   { id, kind, reps: { [repId]: { data, version, from?: { rep, version } } }, trail: [{ rep, action, at }] }

import { safeStorage } from './store.js';

// v2: the pair is now derived from the signal of Fourier Coefficients, so v1 objects are not reused.
const KEY = 'energeo.journey.v2';

export function createJourney() {
  let objects = safeStorage.read(KEY, {});
  const subs = new Set();
  const save = () => safeStorage.write(KEY, objects);
  const emit = (id) => subs.forEach((f) => f(id, objects[id]));

  const api = {
    get: (id) => objects[id],

    /** Create the object if it doesn't exist yet. Returns it. */
    ensure(id, kind, rep, data, action) {
      if (!objects[id]) {
        objects[id] = { id, kind, reps: { [rep]: { data, version: 1 } }, trail: [{ rep, action }] };
        save();
      }
      return objects[id];
    },

    /**
     * Read a representation, deriving it with `derive` when missing or stale. `from` names the source:
     * a representation of the same object (a string), or of another object ({ id, rep }), so one
     * interactive's object can be built from what an earlier interactive left behind.
     */
    rep(id, rep, from, derive, action) {
      const src = typeof from === 'string' ? { id, rep: from } : from;
      const srcRep = src && objects[src.id]?.reps[src.rep];
      if (!objects[id]) {
        if (!srcRep) return undefined;
        objects[id] = { id, kind: id, reps: {}, trail: [] };
      }
      const obj = objects[id];
      const have = obj.reps[rep];
      const stale = have && srcRep && have.from && (have.from.version !== srcRep.version || (have.from.id ?? id) !== src.id);
      if (!have || stale) {
        if (!srcRep) return have?.data;
        const data = derive(srcRep.data);
        obj.reps[rep] = { data, version: (have?.version ?? 0) + 1, from: { id: src.id, rep: src.rep, version: srcRep.version } };
        obj.trail.push({ rep, action: stale ? `${action} (rebuilt: its source changed)` : action });
        save();
      }
      return obj.reps[rep].data;
    },

    /** Replace a representation's data after the learner changes it. */
    update(id, rep, data) {
      const r = objects[id].reps[rep];
      r.data = data;
      r.version += 1;
      save();
      emit(id);
    },

    /** Start an object over (keeps nothing). */
    reset(id) {
      delete objects[id];
      save();
      emit(id);
    },

    trail: (id) => objects[id]?.trail ?? [],

    subscribe(f) {
      subs.add(f);
      return () => subs.delete(f);
    },
  };
  return api;
}
