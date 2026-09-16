import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { HUB_TRANSLATION_CONFIG, HubTranslationService, TranslatePipe } from 'ng-hub-ui-utils';

/**
 * Example demonstrating the translation service and pipe
 */
@Component({
	selector: 'app-translation-utils-example',
	standalone: true,
	imports: [TranslatePipe],
	providers: [
		HubTranslationService,
		{
			provide: HUB_TRANSLATION_CONFIG,
			useValue: {
				dictionaries: {
					en: {
						greeting: 'Hello, {{name}}!',
						welcome: 'Welcome to ng-hub-ui',
						buttons: {
							save: 'Save',
							cancel: 'Cancel',
							delete: 'Delete'
						}
					}
				},
				language: 'en'
			}
		}
	],
	template: `
		<div class="examples-container">
			<h4>TranslatePipe - Basic usage</h4>
			<div class="example-row">
				<code>'welcome' | translate</code>
				<span class="result">→ {{ 'welcome' | translate }}</span>
			</div>

			<h4 class="mt-4">TranslatePipe - With parameters</h4>
			<div class="example-row">
				<code>'greeting' | translate:{{ '{' }} name: 'Carlos' {{ '}' }}</code>
				<span class="result">→ {{ 'greeting' | translate: { name: 'Carlos' } }}</span>
			</div>

			<h4 class="mt-4">TranslatePipe - Nested keys</h4>
			<div class="example-row">
				<code>'buttons.save' | translate</code>
				<span class="result">→ {{ 'buttons.save' | translate }}</span>
			</div>
			<div class="example-row">
				<code>'buttons.cancel' | translate</code>
				<span class="result">→ {{ 'buttons.cancel' | translate }}</span>
			</div>

			<h4 class="mt-4">Programmatic access</h4>
			<div class="example-row">
				<code>translationService.getTranslation('buttons.delete')</code>
				<span class="result">→ {{ deleteTranslation }}</span>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.examples-container {
			padding: 1rem;
		}
		.example-row {
			display: flex;
			gap: 1rem;
			align-items: center;
			padding: 0.5rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 4px;
			margin-bottom: 0.5rem;
		}
		.example-row code {
			background: var(--hub-sys-state-hover-bg, #e9ecef);
			padding: 0.25rem 0.5rem;
			border-radius: 4px;
			font-family: monospace;
		}
		.result {
			color: #28a745;
			font-weight: 500;
		}
		h4 {
			margin-bottom: 0.75rem;
			color: var(--hub-sys-text-secondary, #495057);
		}
		.mt-4 {
			margin-top: 1.5rem;
		}
	`
})
export class TranslationUtilsExampleComponent {
	private translationService = inject(HubTranslationService);

	deleteTranslation = this.translationService.getTranslation('buttons.delete');

	// ===========================================
	// CÓDIGO PARA LAS PESTAÑAS (OBLIGATORIO)
	// ===========================================

	static readonly templateCode = `<!-- Basic translation -->
<p>{{ 'welcome' | translate }}</p>

<!-- With parameters -->
<p>{{ 'greeting' | translate:{ name: userName } }}</p>

<!-- Nested keys -->
<button>{{ 'buttons.save' | translate }}</button>
<button>{{ 'buttons.cancel' | translate }}</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubTranslationService, TranslatePipe, HUB_TRANSLATION_CONFIG } from 'ng-hub-ui-utils';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TranslatePipe],
  providers: [
    HubTranslationService,
    {
      provide: HUB_TRANSLATION_CONFIG,
      useValue: {
        dictionaries: {
          en: {
            'welcome': 'Welcome',
            'buttons': { 'save': 'Save' }
          }
        },
        language: 'en'
      }
    }
  ],
  template: \`
    <p>{{ 'welcome' | translate }}</p>
    <button>{{ 'buttons.save' | translate }}</button>
  \`
})
export class ExampleComponent {
  private translationService = inject(HubTranslationService);
  
  // Programmatic access
  saveLabel = this.translationService.getTranslation('buttons.save');
}`;
}
