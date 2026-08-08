/**
 * Base URL for donation APIs (no trailing slash).
 * Proxied via Firebase Hosting → Cloud Functions (europe-west2).
 */
export const DONATION_API_BASE = 'https://nagina-social-welfare-uk.web.app';

export const CREATE_DONATION_CHECKOUT_URL = `${DONATION_API_BASE}/createDonationCheckout`;
