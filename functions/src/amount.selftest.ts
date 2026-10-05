import {
  donationDescription,
  parseDonationAmount,
  parseDonationCampus,
  parseDonationFund,
} from './amount';
import { parseCampusTowns } from './donationCampuses';

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

assert(parseDonationFund('zakat') === 'zakat', 'zakat fund should parse');
assert(parseDonationFund('unknown') === 'sadaqah', 'unknown fund should default to sadaqah');
assert(
  donationDescription('lillah') === 'Lillah - Nagina Social Welfare UK',
  'lillah description should be labelled',
);
assert(
  donationDescription('zakat', 'Manchester') === 'Zakat - Manchester - Nagina Social Welfare UK',
  'centre gifts should name the town',
);

assert(parseDonationCampus('Manchester') === 'manchester', 'campus id should normalise');
assert(parseDonationCampus(undefined) === 'general', 'missing campus should be general');
assert(parseDonationCampus('<script>') === 'general', 'malformed campus should be general');

const towns = parseCampusTowns({
  campuses: [
    { id: 'peterborough', addressLine: '103 Burmer Road, Peterborough PE1 3HT', postcode: 'PE1 3HT' },
    {
      id: 'manchester',
      cityLabel: 'Quran Academy',
      addressLine: 'Partington Community Centre, Manchester M31 4FL',
      postcode: 'M31 4FL',
    },
  ],
});
assert(towns.get('peterborough') === 'Peterborough', 'Peterborough town from address');
assert(towns.get('manchester') === 'Manchester', 'Manchester town from address, not label');

console.log('amount.selftest: all passed');
