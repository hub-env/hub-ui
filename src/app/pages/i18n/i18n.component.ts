import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppI18nService } from '../../services/app-i18n.service';

/**
 * Canonical cross-library internationalization guide.
 * It centralizes the one-time application setup so individual library pages only need to document their own keys.
 */
@Component({
	selector: 'app-i18n-guide',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="library-page">
			<header class="library-page__header">
				<div class="library-page__header-content">
					<h1 class="library-page__title">{{ i18n.translate('I18N_GUIDE.TITLE') }}</h1>
					<p class="library-page__description">{{ i18n.translate('I18N_GUIDE.INTRO') }}</p>
				</div>
			</header>
			<div class="library-page__content">
				<section class="library-page__section">
					<h2 class="library-page__section-title">1 · {{ i18n.translate('I18N_GUIDE.SETUP') }}</h2>
					<p class="library-page__text">{{ i18n.translate('I18N_GUIDE.RESERVED') }}</p>
					<pre class="library-page__code"><code>{{ translocoCode }}</code></pre>
				</section>
				<section class="library-page__section">
					<h2 class="library-page__section-title">2 · {{ i18n.translate('I18N_GUIDE.DICTIONARY') }}</h2>
					<pre class="library-page__code"><code>{{ dictionaryCode }}</code></pre>
					<p class="library-page__text">
						{{ i18n.translate('I18N_GUIDE.BRANCHES') }}
					</p>
				</section>
				<section class="library-page__section">
					<h2 class="library-page__section-title">3 · {{ i18n.translate('I18N_GUIDE.OVERRIDE') }}</h2>
					<p class="library-page__text">{{ i18n.translate('I18N_GUIDE.OVERRIDE_TEXT') }}</p>
					<pre class="library-page__code"><code>{{ overrideCode }}</code></pre>
				</section>
				<section class="library-page__section">
					<h2 class="library-page__section-title">{{ i18n.translate('I18N_GUIDE.PRIORITY') }}</h2>
					<p class="library-page__text">{{ i18n.translate('I18N_GUIDE.PRIORITY_TEXT') }}</p>
				</section>
			</div>
		</div>
	`
})
export class I18nGuideComponent {
	/** Documentation translation facade for the guide title. */
	protected readonly i18n = inject(AppI18nService);
	/** Copyable Transloco bootstrap configuration. */
	protected readonly translocoCode = `provideHubTranslationAdapter(() => ({
  dictionary: inject(TranslocoService).selectTranslation('HUBUI'),
  namespace: 'HUBUI'
}))`;

	/** Builds a minimal collision-safe dictionary using the active Signature action label. */
	protected get dictionaryCode(): string {
		const clear = this.i18n.translate('DOCS.SIGNATURE.ACTION.CLEAR');
		return `{
  "HUBUI": {
    "SIGNATURE": { "ACTION": { "CLEAR": "${clear}" } },
    "PAGINABLE": { "SEARCH": "…" },
    "STEPPER": { "CONTINUE": "…" },
    "CALENDAR": { "today": "…" }
  }
}`;
	}

	/** Shows the hybrid mapping used when an application needs a different source for one label. */
	protected readonly overrideCode = `provideHubTranslationAdapter(() => ({
  dictionary: transloco.selectTranslation('HUBUI'),
  namespace: 'HUBUI',
  overrides: {
    SIGNATURE: { ACTION: { UNDO: transloco.selectTranslate('CONTRACTS.UNDO') } }
  }
}))`;
}
