/**
 * Online admission API (Admin Cloud Functions, europe-west2).
 * Public submit only — Accept runs from the Flutter admin with a separate token.
 */
export const SUBMIT_ADMISSION_URL =
  'https://europe-west2-nagina-social-welfare-uk.cloudfunctions.net/submitAdmission';

/** GET on the submit endpoint lists each madrasa with office edits applied. */
export const CAMPUSES_URL = SUBMIT_ADMISSION_URL;

/** Build-time snapshot written by `scripts/fetch-campuses.mjs`. */
export const CAMPUSES_FALLBACK_URL = '/campuses.json';

/** UK postcode → coordinates for prayer times and Qibla at each madrasa. */
export const POSTCODE_LOOKUP_URL = 'https://api.postcodes.io/postcodes/';

export const APPLICATION_STATUS_URL =
  'https://europe-west2-nagina-social-welfare-uk.cloudfunctions.net/getApplicationStatus';

export const LAST_APPLICATION_ID_KEY = 'nagina-application-id';
export const LAST_APPLICATION_EMAIL_KEY = 'nagina-application-email';
