import assert from 'node:assert/strict';
import { VISIT_IDLE_MS, isNewVisit, londonDateKey } from './pingVisitorStats';

const key = londonDateKey(new Date('2026-09-14T23:30:00Z'));
assert.match(key, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(londonDateKey(new Date('2026-09-14T12:00:00+01:00')), '2026-09-14');

const now = Date.parse('2026-10-15T12:00:00Z');
assert.equal(isNewVisit(undefined, now), true, 'first ping of a tab is a visit');
assert.equal(isNewVisit(now - 60_000, now), false, 'heartbeat is not a visit');
assert.equal(isNewVisit(now - VISIT_IDLE_MS + 1, now), false, 'just under idle window');
assert.equal(isNewVisit(now - VISIT_IDLE_MS, now), true, 'idle 30 min starts a new visit');

console.log('pingVisitorStats.selftest: ok');
