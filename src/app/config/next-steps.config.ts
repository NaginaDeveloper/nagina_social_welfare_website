/**
 * Cross-links shown at the foot of a page: where a visitor is most likely to
 * go next. Keyed by route path; values are route paths whose label and hint
 * come from the navigation config (or the centre list for centre pages).
 */
export const NEXT_STEPS: Readonly<Record<string, readonly string[]>> = {
  '/about': ['/work', '/impact', '/madrasa', '/events', '/donate', '/contact'],
  '/basic-beliefs': ['/khatme-nabuwwat', '/ahle-bait', '/sahaba-ikram', '/aulia-karam', '/guidance', '/assistant'],
  '/khatme-nabuwwat': ['/basic-beliefs', '/ahle-bait', '/sahaba-ikram', '/aulia-karam', '/sermons', '/assistant'],
  '/ahle-bait': ['/basic-beliefs', '/khatme-nabuwwat', '/sahaba-ikram', '/aulia-karam', '/sermons', '/events'],
  '/sahaba-ikram': ['/basic-beliefs', '/khatme-nabuwwat', '/ahle-bait', '/aulia-karam', '/hadith', '/sermons'],
  '/aulia-karam': ['/basic-beliefs', '/ahle-bait', '/sahaba-ikram', '/spiritual-guide', '/sermons', '/events'],
  '/apply': ['/apply/track', '/madrasa', '/safe-drop-off', '/guides', '/apps', '/contact'],
  '/apply/success': ['/apply/track', '/safe-drop-off', '/guides', '/apps', '/portals', '/contact'],
  '/apply/track': ['/apply', '/madrasa', '/guides', '/portals', '/contact'],
  '/apps': ['/guides', '/portals', '/apply', '/assistant', '/contact'],
  '/assistant': ['/namaz', '/zakat', '/apply', '/events', '/donate', '/contact'],
  '/books': ['/seedha-rastah', '/sermons', '/guidance', '/quran', '/hadith', '/spiritual-guide'],
  '/sermons': ['/books', '/seedha-rastah', '/spiritual-guide', '/guidance', '/events', '/quran'],
  '/seedha-rastah': ['/books', '/sermons', '/spiritual-guide', '/guidance', '/quran', '/hadith'],
  '/spiritual-guide': ['/sermons', '/books', '/seedha-rastah', '/aulia-karam', '/events', '/guidance'],
  '/quran': ['/hadith', '/duas', '/namaz', '/books', '/sermons', '/assistant'],
  '/hadith': ['/quran', '/duas', '/books', '/sahaba-ikram', '/guidance', '/assistant'],
  '/contact': ['/apply', '/donate', '/namaz', '/events', '/safeguarding', '/assistant'],
  '/donate/thanks': ['/impact', '/work', '/zakat', '/events', '/membership', '/contact'],
  '/events': ['/namaz', '/calendar', '/ramadan', '/spiritual-guide', '/donate', '/contact'],
  '/guides': ['/apps', '/portals', '/apply/track', '/safe-drop-off', '/madrasa', '/contact'],
  '/membership': ['/membership/track', '/membership/login', '/events', '/donate', '/work', '/contact'],
  '/membership/success': ['/membership/track', '/membership/login', '/events', '/donate', '/contact'],
  '/membership/track': ['/membership', '/membership/login', '/events', '/donate', '/contact'],
  '/membership/login': ['/membership', '/membership/track', '/portals', '/events', '/contact'],
  '/portals': ['/guides', '/apps', '/membership/login', '/apply/track', '/madrasa', '/contact'],
  '/privacy': ['/safeguarding', '/contact', '/about', '/donate', '/membership'],
  '/safe-drop-off': ['/madrasa', '/apply', '/safeguarding', '/guides', '/namaz', '/contact'],
  '/safeguarding': ['/safe-drop-off', '/contact', '/privacy', '/madrasa', '/about'],
};
