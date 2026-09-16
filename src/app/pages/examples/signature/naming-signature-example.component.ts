import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HubSignatureComponent, type HubSignatureLabels } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';

/**
 * The two texts a single field can override on its own: the accessible name of a surface with
 * no visible label, and the wording of the built-in action row.
 *
 * `[ariaLabel]` is consulted only when there is no `[label]` — a field with one is named by it
 * through `aria-labelledby`, so the two can never disagree. `[labels]` is the per-field escape
 * hatch from the application-wide dictionary, and it is held in a `computed()` rather than
 * written as an object literal in the template: a literal is a new identity on every change
 * detection cycle, which tears down and resubscribes every reactive label source behind it.
 */
@Component({
	selector: 'app-signature-naming-example',
	standalone: true,
	imports: [HubSignatureComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="row g-4">
			<div class="col-12 col-md-6">
				<p class="fw-semibold mb-2">{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.NAMING.CAPTION') }}</p>
				<hub-signature [controls]="false" [ariaLabel]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.NAMING.ARIA_LABEL')" />
			</div>

			<div class="col-12 col-md-6">
				<hub-signature [label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.NAMING.LABELLED')" [labels]="actionLabels()" />
			</div>
		</div>
	`,
	styles: []
})
export class NamingSignatureExampleComponent {
	/** Translation facade used to keep the interactive documentation locale-aware. */
	protected readonly i18n = inject(AppI18nService);

	/** One stable object per language, which is what the reactive label contract asks for. */
	protected readonly actionLabels = computed<Partial<HubSignatureLabels>>(() => ({
		clear: this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.NAMING.CLEAR'),
		undo: this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.NAMING.UNDO'),
		redo: this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.NAMING.REDO')
	}));

	static readonly templateCode = `<!-- No visible label of its own: the surrounding layout names it, and the
     accessible name comes from [ariaLabel]. -->
<p>Authorised signatory</p>
<hub-signature [controls]="false" [ariaLabel]="'Signature of the authorised signatory'" />

<!-- One field's actions, worded differently from the rest of the application. -->
<hub-signature label="Signature" [labels]="actionLabels()" />`;

	static readonly componentCode = `import { Component, computed, inject } from '@angular/core';
import { HubSignatureComponent, type HubSignatureLabels } from 'ng-hub-ui-signature';

export class NamingComponent {
  // Held in a computed, never written as an object literal in the template: a
  // literal is a new identity on every change detection cycle, so the label
  // effect would tear down and resubscribe every reactive source behind it.
  readonly actionLabels = computed<Partial<HubSignatureLabels>>(() => ({
    clear: 'Start over',
    undo: 'Undo last stroke',
    redo: 'Redo last stroke'
  }));

  // [ariaLabel] is only read on a field with no [label]. Left empty it resolves
  // through [labels] / provideHubSignature(), then HUBUI.SIGNATURE.ARIA_LABEL,
  // then the English fallback.
}`;
}
