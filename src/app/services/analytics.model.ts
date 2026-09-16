/**
 * Domain models for the analytics service.
 *
 * Declares the global `Window` augmentation required by the GA4 Google tag so
 * that {@link AnalyticsService} can reference `window.dataLayer` / `window.gtag`
 * in a type-safe way. Importing this module anywhere in the compilation makes
 * the augmentation globally available.
 */

export {};

declare global {
	interface Window {
		/** GA4 event queue populated by the Google tag bootstrap. */
		dataLayer?: unknown[];
		/** Global GA4 command function injected by the Google tag. */
		gtag?: (...args: unknown[]) => void;
	}
}
