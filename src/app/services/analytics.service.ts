import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { GA_MEASUREMENT_ID } from '../analytics/analytics.config';
import { SITE_URL } from '../seo/seo.config';
import { AnalyticsConsentService } from './analytics-consent.service';
// Side-effect import: brings the global `Window` augmentation (dataLayer/gtag) into scope.
import './analytics.model';

/** Script source used by the GA4 Google tag. */
const GOOGLE_TAG_SCRIPT_URL = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

/**
 * Loads GA4 only after explicit consent and tracks Angular route changes as page views.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
	private readonly document = inject(DOCUMENT);
	private readonly platformId = inject(PLATFORM_ID);
	private readonly router = inject(Router);
	private readonly consentService = inject(AnalyticsConsentService);

	private hasInitializedGoogleTag = false;

	/**
	 * Bootstraps GA4 once consent is granted and tracks subsequent route changes
	 * as page views.
	 */
	constructor() {
		effect(() => {
			if (!this.consentService.isGranted()) {
				return;
			}

			this.initializeGoogleAnalytics();
		});

		this.router.events
			.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
			.subscribe((event) => {
				if (!this.hasInitializedGoogleTag) {
					return;
				}

				this.trackPageView(event.urlAfterRedirects);
			});
	}

	/**
	 * Injects the Google tag script and configures GA4 once.
	 */
	private initializeGoogleAnalytics(): void {
		if (!isPlatformBrowser(this.platformId) || this.hasInitializedGoogleTag) {
			return;
		}

		this.ensureGoogleTagScript();
		this.bootstrapGoogleTagApi();
		this.configureGoogleAnalytics();
		this.trackPageView(this.router.url);
		this.hasInitializedGoogleTag = true;
	}

	/**
	 * Appends the remote Google tag script when it is not already present.
	 */
	private ensureGoogleTagScript(): void {
		const existingScript = this.document.head.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_TAG_SCRIPT_URL}"]`);

		if (existingScript) {
			return;
		}

		const script = this.document.createElement('script');
		script.async = true;
		script.src = GOOGLE_TAG_SCRIPT_URL;
		this.document.head.appendChild(script);
	}

	/**
	 * Creates the global dataLayer/gtag objects expected by GA4.
	 */
	private bootstrapGoogleTagApi(): void {
		const windowRef = this.document.defaultView;
		if (!windowRef) {
			return;
		}

		windowRef.dataLayer = windowRef.dataLayer ?? [];
		windowRef.gtag =
			windowRef.gtag ??
			function gtag() {
				// eslint-disable-next-line prefer-rest-params -- gtag must push the Arguments object itself; rest params would break GA
				windowRef.dataLayer?.push(arguments);
			};

		windowRef.gtag('js', new Date());
	}

	/**
	 * Sends the initial GA4 configuration using consent-gated tracking.
	 */
	private configureGoogleAnalytics(): void {
		this.document.defaultView?.gtag?.('config', GA_MEASUREMENT_ID, {
			send_page_view: false,
			anonymize_ip: true
		});
	}

	/**
	 * Tracks a page view for the given Angular route.
	 *
	 * @param rawUrl Router URL, including optional query string.
	 */
	private trackPageView(rawUrl: string): void {
		const normalizedUrl = rawUrl || '/';
		const pageLocation = new URL(normalizedUrl, SITE_URL).toString();

		this.document.defaultView?.gtag?.('event', 'page_view', {
			page_title: this.document.title,
			page_location: pageLocation,
			page_path: normalizedUrl
		});
	}
}
