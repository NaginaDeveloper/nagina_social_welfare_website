/**
 * Base URL for donation APIs (no trailing slash).
 * Dedicated Firebase Hosting site (separate from Admin) → Cloud Functions.
 */
export const DONATION_API_BASE = 'https://nagina-donations.web.app';

export const CREATE_DONATION_CHECKOUT_URL = `${DONATION_API_BASE}/createDonationCheckout`;
