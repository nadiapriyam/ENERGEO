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

const KEY = 'energeo.journey.v1';

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

    /** Read a representation, deriving it from `from` with `derive` when missing or stale. */
    rep(id, rep, from, derive, action) {
      const obj = objects[id];
      const have = obj.reps[rep];
      const src = from && obj.reps[from];
      const stale = have && src && have.from && have.from.version !== src.version;
      if (!have || stale) {
        if (!src) return have?.data;
        const data = derive(src.data);
        obj.reps[rep] = { data, version: (have?.version ?? 0) + 1, from: { rep: from, version: src.version } };
        obj.trail.push({ rep, action: stale ? `${action} (rebuilt: the ${from} pair changed)` : action });
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
