import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppI18nService } from '../../services/app-i18n.service';

/**
 * Not-found page rendered by the catch-all routes (both the top-level one and
 * the per-language one). Served with `noindex` metadata through the SeoService
 * `notFound` route type, so unknown URLs stop presenting themselves as
 * indexable copies of the homepage shell.
 */
@Component({
	selector: 'app-not-found',
	standalone: true,
	imports: [RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'not-found' },
	template: `
		<section class="not-found__wrap">
			<p class="not-found__code" aria-hidden="true">404</p>
			<h1 class="not-found__title">{{ i18n.translate('UI.NOT_FOUND.TITLE') }}</h1>
			<p class="not-found__message">{{ i18n.translate('UI.NOT_FOUND.MESSAGE') }}</p>
			<a class="not-found__cta" [routerLink]="homeLink()">{{ i18n.translate('UI.NOT_FOUND.CTA') }}</a>
		</section>
	`,
	styles: `
		.not-found__wrap {
			min-height: 60vh;
			display: grid;
			place-content: center;
			text-align: center;
			gap: 0.75rem;
			padding: 3rem 1rem;
		}
		.not-found__code {
			font-size: 4rem;
			font-weight: 700;
			margin: 0;
			color: var(--hub-sys-color-primary, #0d6efd);
		}
		.not-found__title {
			margin: 0;
			font-size: 1.75rem;
		}
		.not-found__message {
			margin: 0;
			color: var(--hub-sys-text-muted, #6c757d);
		}
		.not-found__cta {
			margin-top: 0.75rem;
			justify-self: center;
		}
	`
})
export class NotFoundComponent {
	protected readonly i18n = inject(AppI18nService);

	/** Home link localized to the active language. */
	protected homeLink(): string {
		return `/${this.i18n.lang()}`;
	}
}
