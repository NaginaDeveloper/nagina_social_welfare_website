import { parseDonationAmount } from './amount';

function assert(cond: unknown, message: string): void {
  if (!cond) {
    throw new Error(message);
  }
}

const ok10 = parseDonationAmount(10);
assert(ok10.ok && ok10.amount === 10, '£10 should be valid');

const ok11 = parseDonationAmount(11);
assert(ok11.ok && ok11.amount === 11, '£11 should be accepted by our API (SumUp sandbox fails the charge)');

const tooSmall = parseDonationAmount(4.99);
assert(!tooSmall.ok, 'Below £5 should be rejected');

const okFive = parseDonationAmount(5);
assert(okFive.ok && okFive.amount === 5, '£5 should be valid');

const bad = parseDonationAmount('abc');
assert(!bad.ok, 'Non-numeric should be rejected');

const rounded = parseDonationAmount(10.456);
assert(rounded.ok && rounded.amount === 10.46, 'Should round to 2dp');

console.log('amount.selftest: all passed');
