import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HubInputComponent } from 'ng-hub-ui-forms';
import { HubSignatureComponent } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';

/**
 * The theming path most consumers actually take: skin the form once and let the signature follow.
 *
 * Not one `--hub-signature-*` property is set here. The field's own slots default through
 * `--hub-input-*` for the drawing surface and `--hub-label-*` for the label, so the text input and
 * the signature beside it read the same eight declarations — which is why they end up with the same
 * ground, border, radius, focus colour and label tone.
 *
 * Worth contrasting with the `hub-signature-theme` demo, which needs `ViewEncapsulation.None` and
 * has to target `.hub-signature` itself. Setting `--hub-signature-*` on this wrapper would do
 * nothing, because the component declares those slots on the field element and a property declared
 * on an element beats an inherited one. `--hub-input-*` is different in kind: the component never
 * declares it, so it is read off the inherited value through `var()` — which a wrapper supplies
 * perfectly well, encapsulation and all.
 */
@Component({
	selector: 'app-signature-inherited-theme-example',
	standalone: true,
	imports: [HubInputComponent, HubSignatureComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.form-theme-scope {
				/* The form's skin. Nothing here names the signature. */
				--hub-input-bg: #fffdf7;
				--hub-input-color: #4a3f35;
				--hub-input-border-color: #d9c9a3;
				--hub-input-border-width: 2px;
				--hub-input-border-radius: 0.5rem;
				--hub-input-focus-border-color: #b08968;
				--hub-label-color: #7a6a58;
				--hub-label-font-size: 0.8125rem;
			}

			.form-theme-scope {
				display: grid;
				gap: 1rem;
				padding: 1.25rem;
				background: #f4ecdd;
				border-radius: 0.75rem;
			}
		</style>
		<div class="form-theme-scope">
			<hub-input
				[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.INHERITED.INPUT_LABEL')"
				[placeholder]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.INHERITED.INPUT_PLACEHOLDER')"
			/>
			<hub-signature
				[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.INHERITED.SIGNATURE_LABEL')"
				[formText]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.INHERITED.HELP')"
			/>
		</div>
	`,
	styles: []
})
export class InheritedThemeSignatureExampleComponent {
	/** Translation facade used to keep the interactive documentation locale-aware. */
	protected readonly i18n = inject(AppI18nService);

	static readonly templateCode = `<div class="consent-form">
  <hub-input label="Full name" placeholder="As it appears on the contract" />
  <hub-signature label="Signature" formText="Sign with a pointer or the keyboard." />
</div>`;

	static readonly cssCode = `/* Skin the form once. The signature field's slots default through
   --hub-input-* for the drawing surface and --hub-label-* for the label,
   so it follows with no --hub-signature-* rule of its own. */
.consent-form {
  --hub-input-bg: #fffdf7;
  --hub-input-color: #4a3f35;
  --hub-input-border-color: #d9c9a3;
  --hub-input-border-width: 2px;
  --hub-input-border-radius: 0.5rem;
  --hub-input-focus-border-color: #b08968;
  --hub-label-color: #7a6a58;
  --hub-label-font-size: 0.8125rem;
}

/* Note the asymmetry: this works from a wrapper because the component reads
   --hub-input-* through var() off the inherited value. Setting
   --hub-signature-* here would NOT work — those slots are declared on the
   field element itself, and a declaration on an element beats an inherited
   one. Reach for hub-signature-theme() when you need to override them. */`;

	static readonly componentCode = `import { HubInputComponent } from 'ng-hub-ui-forms';
import { HubSignatureComponent } from 'ng-hub-ui-signature';`;
}
