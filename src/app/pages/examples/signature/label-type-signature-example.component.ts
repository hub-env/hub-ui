import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HubSignatureComponent } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';

/**
 * The two label placements the field honours, side by side.
 *
 * `horizontal` puts the label in a first grid column and stacks the action row, the helper text
 * and the validation feedback in the second, which is the shape the sibling fields of
 * `ng-hub-ui-forms` produce — the point of the input is that a signature lines up with the
 * inputs around it. `floating` is accepted and falls back to `stacked`: it reuses the space an
 * empty text control's value would occupy, and a canvas has neither a value nor a placeholder.
 */
@Component({
	selector: 'app-signature-label-type-example',
	standalone: true,
	imports: [HubSignatureComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-4">
			<hub-signature
				[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.LABEL_TYPE.STACKED')"
				[formText]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.HELP')"
				[controls]="false"
			/>

			<hub-signature
				labelType="horizontal"
				[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.LABEL_TYPE.HORIZONTAL')"
				[formText]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.HELP')"
				[controls]="false"
			/>
		</div>
	`,
	styles: []
})
export class LabelTypeSignatureExampleComponent {
	/** Translation facade used to keep the interactive documentation locale-aware. */
	protected readonly i18n = inject(AppI18nService);

	static readonly templateCode = `<hub-signature label="Stacked label" formText="Draw with a mouse, touch screen or pen." />

<hub-signature
  labelType="horizontal"
  label="Horizontal label"
  formText="Draw with a mouse, touch screen or pen."
/>`;

	static readonly componentCode = `import { HubSignatureComponent } from 'ng-hub-ui-signature';

// labelType takes the shared HubLabelType of ng-hub-ui-forms. 'stacked' is the
// default; 'horizontal' caps the label column at --hub-form-label-horizontal-max-width
// and stacks the actions, helper text and feedback beside it. 'floating' is accepted
// and falls back to stacked — a label parked inside the box would sit on top of the ink.`;
}
