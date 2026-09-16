import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubTranslationService } from 'ng-hub-ui-utils';
import { STEPPER_DICTIONARIES, StepComponent, StepperComponent } from '../../../../../projects/stepper/src/public-api';

/**
 * Demonstrates runtime language switching for stepper default labels.
 */
@Component({
	selector: 'app-i18n-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent],
	// Example-scoped service: the demo switches languages at runtime and must
	// never mutate the app-wide dictionary (it used to flip the whole docs page
	// to English and broke SSR with NG0100).
	providers: [HubTranslationService],
	template: `
		<div class="language-selector">
			<label class="language-selector__label">Language / Idioma</label>
			<select class="language-selector__select" [value]="currentLang()" (change)="setLanguage($any($event.target).value)">
				@for (option of languageOptions; track option.code) {
					<option [value]="option.code">{{ option.label }}</option>
				}
			</select>
		</div>

		<hub-stepper>
			<hub-step title="Account">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>

			<hub-step title="Profile">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>

			<hub-step title="Confirm">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
		</hub-stepper>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.language-selector {
				display: grid;
				gap: 0.5rem;
				margin-bottom: 0.75rem;
			}

			.language-selector__label {
				font-weight: 600;
				font-size: 0.875rem;
			}

			.language-selector__select {
				max-width: 240px;
				border: 1px solid var(--hub-sys-border-color-default, #ced4da);
				border-radius: 0.375rem;
				padding: 0.25rem 0.625rem;
				background: var(--hub-sys-surface-page, #ffffff);
				font-size: 0.875rem;
			}
		`
	]
})
export class I18nStepperExampleComponent {
	private readonly translation = inject(HubTranslationService);

	/** Snapshot of the app-level dictionary the demo languages are layered on top of. */
	private readonly appTranslations = inject(HubTranslationService, { skipSelf: true }).translations;

	/** Active language for the example controls. */
	currentLang = signal<string>('es');

	/** Languages shown in the example selector. */
	readonly languageOptions = [
		{ code: 'es', label: 'Castellano' },
		{ code: 'ca', label: 'Catala' },
		{ code: 'eu', label: 'Euskera' },
		{ code: 'gl', label: 'Galego' },
		{ code: 'ast', label: 'Astur-leones' },
		{ code: 'an', label: 'Aragones' },
		{ code: 'ar', label: 'Arabic' },
		{ code: 'de', label: 'Deutsch' },
		{ code: 'zh', label: 'Chinese' },
		{ code: 'en', label: 'English' },
		{ code: 'hi', label: 'Hindi' }
	] as const;

	/**
	 * The ten dictionaries the library publishes, plus an eleventh the demo invents, to show
	 * that `STEPPER_DICTIONARIES` is a plain record a consumer can extend rather than a closed
	 * set. Until 22.9.0 they were internal and this demo reached into the library sources for
	 * them, which no application could copy.
	 */
	private readonly dictionaries: Record<string, Record<string, string>> = {
		...STEPPER_DICTIONARIES,
		hi: {
			BACK: 'piche',
			CONTINUE: 'jari rakhen',
			SUBMIT: 'bhejen'
		}
	};

	/**
	 * Initializes the component with Spanish as the default stepper language.
	 */
	constructor() {
		this.setLanguage('es');
	}

	/**
	 * Updates translations in runtime for this example.
	 */
	setLanguage(lang: string): void {
		this.currentLang.set(lang);
		this.translation.setTranslations({
			...this.appTranslations,
			HUBUI: { STEPPER: this.dictionaries[lang] ?? this.dictionaries['es'] }
		});
	}

	static readonly templateCode = `<div class="language-selector">
  <select [value]="currentLang()" (change)="setLanguage($any($event.target).value)">
    @for (option of languageOptions; track option.code) {
    <option [value]="option.code">{{ option.label }}</option>
    }
  </select>
</div>

<hub-stepper>
  <hub-step title="Account"></hub-step>
  <hub-step title="Profile"></hub-step>
  <hub-step title="Confirm"></hub-step>
</hub-stepper>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { STEPPER_DICTIONARIES, StepComponent, StepperComponent, provideHubStepper } from 'ng-hub-ui-stepper';
import { HubTranslationService, provideHubTranslation } from 'ng-hub-ui-utils';

@Component({
  selector: 'app-i18n-stepper-example',
  standalone: true,
  imports: [StepperComponent, StepComponent],
  // Scoped to the demo, so switching language here never rewrites the rest of the page.
  providers: [HubTranslationService],
  template: \`...\`
})
export class I18nStepperExampleComponent {
  private readonly translation = inject(HubTranslationService);

  setLanguage(lang: string): void {
    this.translation.setTranslations({ HUBUI: { STEPPER: STEPPER_DICTIONARIES[lang] } });
  }
}

// Back, Continue and Submit are the only strings the stepper renders on its own, and it
// reads them as HUBUI.STEPPER.BACK / .CONTINUE / .SUBMIT before falling back to the bare
// key. HubTranslationService is not providedIn: 'root', so something has to register it or
// the first render throws NullInjectorError.

// The answer: provideHubStepper() registers the ten bundled dictionaries and that service in
// one call. It is what replaces the forRoot() of the module 23.0.0 takes away.
bootstrapApplication(AppComponent, {
  providers: [provideHubStepper({ language: 'es', fallbackLanguage: 'en' })]
});

// It writes HUB_TRANSLATION_CONFIG, one application-wide token, so an app that already calls
// provideHubTranslation() at the root merges the labels into that call instead — the
// dictionaries are exported for exactly this — or scopes provideHubStepper() to the route:
provideHubTranslation({
  language: 'es',
  fallbackLanguage: 'en',
  dictionaries: {
    es: { ...STEPPER_DICTIONARIES['es'], ...myOwnSpanishStrings },
    en: { ...STEPPER_DICTIONARIES['en'], ...myOwnEnglishStrings }
  }
});

// Per instance, when three strings is the whole requirement, no provider is needed for them:
//     <hub-stepper backLabel="Atrás" continueLabel="Continuar" submitLabel="Enviar">

// And an application that already has an i18n framework bridges it once and is done:
provideHubTranslationAdapter(() => ({ dictionary: transloco.selectTranslation(), namespace: 'HUBUI' }));`;

	static readonly cssCode = `.language-selector {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.language-selector__select {
  max-width: 240px;
  border: 1px solid var(--hub-sys-border-color-default, #ced4da);
  border-radius: 0.375rem;
  padding: 0.25rem 0.625rem;
}`;

	readonly templateCode = I18nStepperExampleComponent.templateCode;
	readonly componentCode = I18nStepperExampleComponent.componentCode;
	readonly cssCode = I18nStepperExampleComponent.cssCode;
}
