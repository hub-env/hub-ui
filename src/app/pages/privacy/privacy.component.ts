import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { AppI18nService } from '../../services/app-i18n.service';

/**
 * Privacy Policy page component.
 *
 * Renders a GDPR-compliant privacy policy using i18n keys resolved by TranslatePipe.
 * All content lives in the UI.PRIVACY namespace of the per-language JSON files.
 * The link to the cookie policy is localised via the AppI18nService lang signal.
 */
@Component({
	selector: 'app-privacy',
	standalone: true,
	imports: [RouterLink, TranslatePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<article class="container py-5" style="max-width: 860px">
			<header class="mb-5">
				<h1 class="display-5 fw-bold">{{ 'UI.PRIVACY.TITLE' | translate }}</h1>
				<p class="text-muted">{{ 'UI.PRIVACY.UPDATED' | translate }}</p>
				<p class="lead">{{ 'UI.PRIVACY.INTRO' | translate }}</p>
			</header>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S1_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S1_P1' | translate }}</p>
				<p>{{ 'UI.PRIVACY.S1_P2' | translate }}</p>
				<p>{{ 'UI.PRIVACY.S1_P3' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S2_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S2_P1' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S3_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S3_P1' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S4_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S4_P1' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S5_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S5_P1' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S6_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S6_P1' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S7_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S7_P1' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S8_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S8_P1' | translate }}</p>
				<p>{{ 'UI.PRIVACY.S8_P2' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S9_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S9_P1' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S10_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S10_P1' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.PRIVACY.S11_HEADING' | translate }}</h2>
				<p>{{ 'UI.PRIVACY.S11_P1' | translate }}</p>
			</section>

			<footer class="mt-5 pt-4 border-top">
				<a [routerLink]="['/', i18n.lang(), 'cookies']" class="text-decoration-none me-3">
					{{ 'UI.PRIVACY.LINK_COOKIES' | translate }}
				</a>
			</footer>
		</article>
	`
})
export class PrivacyPolicyComponent {
	/** Provides the current language code for building localised router links. */
	protected readonly i18n = inject(AppI18nService);
}
