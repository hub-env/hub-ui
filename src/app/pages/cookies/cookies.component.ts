import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { AppI18nService } from '../../services/app-i18n.service';

/**
 * Cookie Policy page component.
 *
 * Renders a GDPR-compliant cookie policy using i18n keys resolved by TranslatePipe.
 * All content lives in the UI.COOKIES namespace of the per-language JSON files.
 * Only Google Analytics 4 cookies are declared, as they are the only ones used by the site.
 * The link to the privacy policy is localised via the AppI18nService lang signal.
 */
@Component({
	selector: 'app-cookies',
	standalone: true,
	imports: [RouterLink, TranslatePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<article class="container py-5" style="max-width: 860px">
			<header class="mb-5">
				<h1 class="display-5 fw-bold">{{ 'UI.COOKIES.TITLE' | translate }}</h1>
				<p class="text-muted">{{ 'UI.COOKIES.UPDATED' | translate }}</p>
				<p class="lead">{{ 'UI.COOKIES.INTRO' | translate }}</p>
			</header>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.COOKIES.WHAT_HEADING' | translate }}</h2>
				<p>{{ 'UI.COOKIES.WHAT_P1' | translate }}</p>
				<p>{{ 'UI.COOKIES.WHAT_P2' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.COOKIES.USED_HEADING' | translate }}</h2>
				<p>{{ 'UI.COOKIES.USED_INTRO' | translate }}</p>
				<div class="table-responsive mt-3">
					<table class="table table-bordered table-sm">
						<thead class="table-light">
							<tr>
								<th>{{ 'UI.COOKIES.TABLE_COL_NAME' | translate }}</th>
								<th>{{ 'UI.COOKIES.TABLE_COL_PROVIDER' | translate }}</th>
								<th>{{ 'UI.COOKIES.TABLE_COL_PURPOSE' | translate }}</th>
								<th>{{ 'UI.COOKIES.TABLE_COL_DURATION' | translate }}</th>
								<th>{{ 'UI.COOKIES.TABLE_COL_TYPE' | translate }}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>_ga</code></td>
								<td>Google Analytics</td>
								<td>{{ 'UI.COOKIES.ROW_GA_PURPOSE' | translate }}</td>
								<td>{{ 'UI.COOKIES.ROW_GA_DURATION' | translate }}</td>
								<td>{{ 'UI.COOKIES.ROW_GA_TYPE' | translate }}</td>
							</tr>
							<tr>
								<td><code>_ga_*</code></td>
								<td>Google Analytics</td>
								<td>{{ 'UI.COOKIES.ROW_GA_STAR_PURPOSE' | translate }}</td>
								<td>{{ 'UI.COOKIES.ROW_GA_STAR_DURATION' | translate }}</td>
								<td>{{ 'UI.COOKIES.ROW_GA_STAR_TYPE' | translate }}</td>
							</tr>
							<tr>
								<td><code>_gid</code></td>
								<td>Google Analytics</td>
								<td>{{ 'UI.COOKIES.ROW_GID_PURPOSE' | translate }}</td>
								<td>{{ 'UI.COOKIES.ROW_GID_DURATION' | translate }}</td>
								<td>{{ 'UI.COOKIES.ROW_GID_TYPE' | translate }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.COOKIES.NECESSARY_HEADING' | translate }}</h2>
				<p>{{ 'UI.COOKIES.NECESSARY_P1' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.COOKIES.MANAGE_HEADING' | translate }}</h2>
				<p>{{ 'UI.COOKIES.MANAGE_P1' | translate }}</p>
				<p>{{ 'UI.COOKIES.MANAGE_P2' | translate }}</p>
				<p>{{ 'UI.COOKIES.MANAGE_P3' | translate }}</p>
				<p>{{ 'UI.COOKIES.MANAGE_P4' | translate }}</p>
				<p>{{ 'UI.COOKIES.MANAGE_P5' | translate }}</p>
			</section>

			<section class="mb-4">
				<h2 class="h4 fw-semibold mb-2">{{ 'UI.COOKIES.CHANGES_HEADING' | translate }}</h2>
				<p>{{ 'UI.COOKIES.CHANGES_P1' | translate }}</p>
			</section>

			<footer class="mt-5 pt-4 border-top">
				<a [routerLink]="['/', i18n.lang(), 'privacy']" class="text-decoration-none me-3">
					{{ 'UI.COOKIES.LINK_PRIVACY' | translate }}
				</a>
			</footer>
		</article>
	`
})
export class CookiePolicyComponent {
	/** Provides the current language code for building localised router links. */
	protected readonly i18n = inject(AppI18nService);
}
