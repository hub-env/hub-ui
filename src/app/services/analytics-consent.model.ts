/**
 * Domain models and constants for the analytics consent service.
 *
 * These types describe the persisted consent preference handled by
 * {@link AnalyticsConsentService}.
 */

/** Persisted storage key for analytics consent choice. */
export const ANALYTICS_CONSENT_STORAGE_KEY = 'hub-ui.analytics-consent';

/** Supported analytics consent values. */
export type AnalyticsConsentState = 'granted' | 'denied' | 'unknown';
