import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HubSignatureComponent } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';

/** Demonstrates the standalone signature field with its built-in action history. */
@Component({
	selector: 'app-basic-signature-example',
	standalone: true,
	imports: [HubSignatureComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<hub-signature
		[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.LABEL')"
		[formText]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.HELP')"
	/>`,
	styles: []
})
export class BasicSignatureExampleComponent {
	/** Translation facade used to keep the interactive documentation locale-aware. */
	protected readonly i18n = inject(AppI18nService);

	static readonly templateCode = `<hub-signature
  label="Signature"
  formText="Draw with a mouse, touch screen or pen."
/>`;
	static readonly componentCode = `import { HubSignatureComponent } from 'ng-hub-ui-signature';`;
}
