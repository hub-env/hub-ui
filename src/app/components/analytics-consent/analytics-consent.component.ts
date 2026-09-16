import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { AppI18nService } from '../../services/app-i18n.service';
import { AnalyticsConsentService } from '../../services/analytics-consent.service';

/**
 * Lightweight analytics consent banner for GA4 tracking.
 * Includes a localized link to the Cookie Policy page.
 */
@Component({
	selector: 'app-analytics-consent',
	standalone: true,
	imports: [TranslatePipe, RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (consent.shouldShowBanner()) {
			<section class="analytics-consent" role="dialog" aria-live="polite" aria-labelledby="analytics-consent-title">
				<div class="analytics-consent__content">
					<h2 id="analytics-consent-title" class="analytics-consent__title">
						{{ 'UI.CONSENT.TITLE' | translate }}
					</h2>
					<p class="analytics-consent__text">
						{{ 'UI.CONSENT.BODY' | translate }}
					</p>
					<a [routerLink]="cookiePolicyLink()" class="analytics-consent__policy-link">
						{{ 'UI.CONSENT.POLICY_LINK' | translate }}
					</a>
				</div>

				<div class="analytics-consent__actions">
					<button
						type="button"
						class="analytics-consent__button analytics-consent__button--secondary"
						(click)="consent.deny()"
					>
						{{ 'UI.CONSENT.REJECT' | translate }}
					</button>
					<button
						type="button"
						class="analytics-consent__button analytics-consent__button--primary"
						(click)="consent.grant()"
					>
						{{ 'UI.CONSENT.ACCEPT' | translate }}
					</button>
				</div>
			</section>
		}
	`,
	styleUrl: './analytics-consent.component.scss'
})
export class AnalyticsConsentComponent {
	protected readonly consent = inject(AnalyticsConsentService);
	protected readonly i18n = inject(AppI18nService);

	/** Builds the localized routerLink array for the Cookie Policy page. */
	protected readonly cookiePolicyLink = computed(() => ['/', this.i18n.lang(), 'cookies']);
}
