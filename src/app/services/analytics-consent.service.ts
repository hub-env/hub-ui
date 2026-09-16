import { afterNextRender, computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ANALYTICS_CONSENT_STORAGE_KEY, type AnalyticsConsentState } from './analytics-consent.model';

// Re-export the consent state type so existing imports from this service keep working.
export type { AnalyticsConsentState };

/**
 * Manages the user's analytics consent preference in a browser-safe way.
 *
 * The signal always starts as `'unknown'` so the SSR-rendered HTML and the
 * client initial state are identical — preventing hydration mismatches that
 * caused the banner to reappear on refresh or ignore clicks. After the first
 * render cycle, `afterNextRender` reads localStorage and updates the signal,
 * which makes the banner disappear immediately without a hydration conflict.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsConsentService {
	private readonly platformId = inject(PLATFORM_ID);

	/** Internal writable signal. Always starts as 'unknown' to match SSR output. */
	private readonly consentState = signal<AnalyticsConsentState>('unknown');

	/** Current consent state. */
	readonly state = this.consentState.asReadonly();

	/** Whether the consent banner should be visible. */
	readonly shouldShowBanner = computed(() => this.consentState() === 'unknown');

	/** Whether analytics is currently allowed. */
	readonly isGranted = computed(() => this.consentState() === 'granted');

	constructor() {
		if (isPlatformBrowser(this.platformId)) {
			// Read storage after the first render so the initial SSR HTML and the
			// client bootstrap state are always in sync (both 'unknown'). This
			// eliminates the hydration mismatch that prevented the banner from
			// hiding on refresh or made clicks unreliable with withEventReplay().
			afterNextRender(() => {
				try {
					const stored = localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
					if (stored === 'granted' || stored === 'denied') {
						this.consentState.set(stored);
					}
				} catch {
					// Storage access can fail in private/restricted contexts; ignore.
				}
			});
		}
	}

	/**
	 * Grants analytics consent and persists the decision.
	 */
	grant(): void {
		this.updateConsentState('granted');
	}

	/**
	 * Denies analytics consent and persists the decision.
	 */
	deny(): void {
		this.updateConsentState('denied');
	}

	/**
	 * Updates the in-memory signal and persists the choice to localStorage.
	 *
	 * @param nextState New consent value to store.
	 */
	private updateConsentState(nextState: AnalyticsConsentState): void {
		this.consentState.set(nextState);

		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		try {
			localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, nextState);
		} catch {
			// Storage access can fail in private contexts; ignore safely.
		}
	}
}
