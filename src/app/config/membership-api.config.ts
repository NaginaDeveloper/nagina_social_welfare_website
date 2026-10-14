/**
 * Community membership API (Admin Cloud Functions, europe-west2).
 */
const FUNCTIONS_ORIGIN = 'https://europe-west2-nagina-social-welfare-uk.cloudfunctions.net';

/**
 * Dev-only override: on localhost with `localStorage['nagina-emu'] = '1'` the membership
 * API and Firebase Auth point at the local emulators, so sign-in can be tested against
 * seeded members instead of production. Production builds never match.
 */
function emulatorMode(): boolean {
  try {
    if (typeof location === 'undefined' || typeof localStorage === 'undefined') return false;
    const host = location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') return false;
    return localStorage.getItem('nagina-emu') === '1';
  } catch {
    return false;
  }
}

const EMULATOR_FUNCTIONS_ORIGIN = 'http://127.0.0.1:5001/nagina-social-welfare-uk/europe-west2';

export const USE_MEMBERSHIP_EMULATOR = emulatorMode();

/** Firebase Auth emulator origin while `USE_MEMBERSHIP_EMULATOR` is on, else null. */
export const MEMBER_AUTH_EMULATOR_URL = USE_MEMBERSHIP_EMULATOR ? 'http://127.0.0.1:9099' : null;

const ORIGIN = USE_MEMBERSHIP_EMULATOR ? EMULATOR_FUNCTIONS_ORIGIN : FUNCTIONS_ORIGIN;

export const SUBMIT_MEMBERSHIP_URL = `${ORIGIN}/submitMembership`;

export const MEMBERSHIP_STATUS_URL = `${ORIGIN}/getMembershipStatus`;

export const MEMBERSHIP_API_BASE = `${ORIGIN}/membershipApi`;

export const LAST_MEMBERSHIP_ID_KEY = 'nagina-membership-id';
export const LAST_MEMBERSHIP_EMAIL_KEY = 'nagina-membership-email';
export const MEMBER_SESSION_KEY = 'nagina-member-session';

/** Set while a member is signed in on this browser, so other pages know to restore the session. */
export const MEMBER_HINT_KEY = 'nagina-member-hint';
