import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppI18nService } from '../../../services/app-i18n.service';

/** Documents the one-time bridge between an application's i18n service and Hub UI libraries. */
@Component({
	selector: 'app-external-translation-adapter-utils-example',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<p class="mb-0">{{ i18n.translate('DOCS.UTILS.EXAMPLE.EXTERNAL_ADAPTER.DESCRIPTION') }}</p>`,
	styles: []
})
export class ExternalTranslationAdapterUtilsExampleComponent {
	/** Documentation translation facade used for the example introduction. */
	protected readonly i18n = inject(AppI18nService);

	/** Complete Transloco integration, including the shared dictionary delivered to every Hub UI library. */
	static readonly sourceCode: Record<string, string> = {
		'1. app.config.ts': `import { ApplicationConfig, inject } from '@angular/core';
import { provideHubTranslationAdapter } from 'ng-hub-ui-utils';
import { TranslocoService } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHubTranslationAdapter(() => {
      const transloco = inject(TranslocoService);
      return {
        dictionary: transloco.selectTranslation('HUBUI'),
        namespace: 'HUBUI'
      };
    })
  ]
};`,
		'2. assets/i18n/en.json': `{
  "HUBUI": {
    "SIGNATURE": {
      "ACTION": { "CLEAR": "Clear signature", "UNDO": "Undo stroke", "REDO": "Redo stroke" }
    }
  }
}`,
		'3. deliberate override': `// Keep the shared HUB dictionary, but deliberately source one label elsewhere.
provideHubTranslationAdapter(() => ({
  dictionary: transloco.selectTranslation('HUBUI'),
  namespace: 'HUBUI',
  overrides: {
    SIGNATURE: {
      ACTION: { UNDO: transloco.selectTranslate('CONTRACTS.SIGNATURE.UNDO') }
    }
  }
}));`,
		'4. ngx-translate equivalent': `import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { provideHubTranslationAdapter } from 'ng-hub-ui-utils';
import { map, startWith } from 'rxjs';

provideHubTranslationAdapter(() => {
  const translate = inject(TranslateService);
  return {
    dictionary: translate.onLangChange.pipe(
      startWith({}),
      map(() => translate.instant('HUBUI'))
    ),
    namespace: 'HUBUI'
  };
});`
	};

	static readonly templateCode = ExternalTranslationAdapterUtilsExampleComponent.sourceCode['1. app.config.ts'];
	static readonly componentCode = ExternalTranslationAdapterUtilsExampleComponent.sourceCode['2. assets/i18n/en.json'];
}
