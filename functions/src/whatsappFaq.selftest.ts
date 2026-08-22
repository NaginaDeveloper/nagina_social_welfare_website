import {
  cannedReply,
  classifyWhatsappTurn,
  formatWhatsappText,
  parseWebsitePrefill,
} from './whatsappFaq';

function assert(cond: unknown, message: string): void {
  if (!cond) {
    throw new Error(message);
  }
}

assert(classifyWhatsappTurn('hello') === 'greeting', 'hello should be a greeting');
assert(classifyWhatsappTurn('Assalamu alaikum') === 'greeting', 'salam should be a greeting');
assert(classifyWhatsappTurn('', 'about') === 'about', 'list about should map');
assert(classifyWhatsappTurn('2') === 'apply', '2 should be apply');
assert(classifyWhatsappTurn('I want to donate zakat') === 'donate', 'zakat should be donate');
assert(classifyWhatsappTurn('how do I apply for madrasa') === 'apply', 'apply intent');
assert(classifyWhatsappTurn('what is your charity number') === 'about', 'charity number is about');
assert(classifyWhatsappTurn('please speak to a person') === 'handoff', 'handoff');
assert(classifyWhatsappTurn('this is a safeguarding concern about abuse') === 'safeguarding', 'safeguarding');
assert(
  parseWebsitePrefill(
    'Assalamu alaikum\nName: Ali\nReason: Donation\nI want to give zakat',
  ) === 'donate',
  'contact form donation prefill',
);
assert(
  parseWebsitePrefill('Assalamu alaikum, I have a question about donating to Nagina Social Welfare.') ===
    'donate',
  'donate CTA prefill',
);
assert(
  parseWebsitePrefill('Assalamu alaikum, I would like to get in touch with Nagina Social Welfare.') ===
    'greeting',
  'hero CTA prefill',
);

const about = cannedReply('about', 'en');
assert(about.includes('1196514'), 'about should include charity number');
assert(about.includes('info@naginasocialwelfare.co.uk'), 'about should include email');

const apply = cannedReply('apply', 'en');
assert(apply.includes('/apply/'), 'apply should link to the form');
assert(!apply.toLowerCase().includes('google form'), 'must not mention the old Google Form');

const donate = cannedReply('donate', 'en');
assert(donate.includes('54-21-38'), 'donate should include sort code');
assert(donate.includes('/donate/'), 'donate should link to the page');

const formatted = formatWhatsappText('See [Donate](https://example.com/donate) and **card**.');
assert(formatted.includes('https://example.com/donate'), 'should keep URL');
assert(!formatted.includes('**'), 'should strip markdown bold');

console.log('whatsappFaq.selftest: all passed');
