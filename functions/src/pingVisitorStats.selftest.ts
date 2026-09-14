import assert from 'node:assert/strict';
import { londonDateKey } from './pingVisitorStats';

const key = londonDateKey(new Date('2026-09-14T23:30:00Z'));
assert.match(key, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(londonDateKey(new Date('2026-09-14T12:00:00+01:00')), '2026-09-14');

console.log('pingVisitorStats.selftest: ok');
