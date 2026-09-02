/** Shared legal, contact and social details for Nagina Social Welfare UK. */
export const ORGANIZATION = {
  legalName: 'Nagina Social Welfare UK Limited',
  shortName: 'Nagina Social Welfare',
  charityName: 'Nagina Social Welfare UK',
  companyNumber: '08342937',
  charityNumber: '1196514',
  companiesHouseUrl:
    'https://find-and-update.company-information.service.gov.uk/company/08342937',
  charityCommissionUrl:
    'https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/5173741',
  email: 'info@naginasocialwelfare.co.uk',
  phoneDisplay: '07831 684738',
  phoneTel: '+447831684738',
  whatsappDigits: '447831684738',
  streetAddress: '103 Burmer Road',
  addressLocality: 'Peterborough',
  postalCode: 'PE1 3HT',
  addressCountry: 'GB',
  addressCountryName: 'United Kingdom',
  addressFull: '103 Burmer Road, Peterborough PE1 3HT, United Kingdom',
  mapsQuery: '103 Burmer Road, Peterborough PE1 3HT',
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=103%20Burmer%20Road%20Peterborough%20PE1%203HT&output=embed',
  mapsDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=103%20Burmer%20Road%2C%20Peterborough%20PE1%203HT',
  loginUrl: 'https://admin.naginasocialwelfare.co.uk/',
  quizUrl: 'https://admin.naginasocialwelfare.co.uk/quiz',
  facebookUrl: 'https://www.facebook.com/naginasocial.welfare.5',
  facebookPhotosUrl: 'https://www.facebook.com/naginasocial.welfare.5/photos',
  instagramUrl: 'https://www.instagram.com/naginasocialwelfare/',
  youtubeUrl: 'https://www.youtube.com/@naginasocialwelfareuk7419',
  /** Charity Commission currently lists Gift Aid as not recognised by HMRC. */
  giftAidRecognised: false,
} as const;

export function whatsappHref(prefill = ''): string {
  const base = `https://wa.me/${ORGANIZATION.whatsappDigits}`;
  const text = prefill.trim();
  if (!text) {
    return base;
  }
  return `${base}?text=${encodeURIComponent(text)}`;
}
