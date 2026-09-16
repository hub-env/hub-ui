import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HubSignatureComponent } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';

/** Shows the framework-agnostic label contract used by external i18n streams. */
@Component({
	selector: 'app-i18n-signature-example',
	standalone: true,
	imports: [HubSignatureComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<hub-signature
		[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.LABEL')"
		[formText]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.HELP')"
	/>`,
	styles: []
})
export class I18nSignatureExampleComponent {
	/** Translation facade used by the documentation application. */
	protected readonly i18n = inject(AppI18nService);

	/** Shows Signature's dictionary entries; the complete shared-adapter setup lives in the Utils documentation. */
	static readonly sourceCode: Record<string, string> = {
		'1. app.config.ts': `// Configure this once for the whole application.
import { provideHubTranslationAdapter } from 'ng-hub-ui-utils';

provideHubTranslationAdapter(() => {
  const transloco = inject(TranslocoService);
  return {
    dictionary: transloco.selectTranslation('HUBUI'),
    namespace: 'HUBUI'
  };
});`,
		'2. assets/i18n/en.json': `{
  "HUBUI": {
    "SIGNATURE": {
      "LABEL": "Signature",
      "HELP": "Draw with a mouse, touch screen, pen or keyboard.",
      "KEYBOARD_HINT": "Sign with the keyboard: arrow keys move the pen, holding Shift moves it further, Space or Enter lowers and lifts it, and Escape discards the stroke in progress.",
      "ARIA_LABEL": "Signature",
      "ACTION": {
        "CLEAR": "Clear signature",
        "UNDO": "Undo stroke",
        "REDO": "Redo stroke"
      }
    }
  }
}`,
		'3. contract-signature.component.ts': `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { HubSignatureComponent } from 'ng-hub-ui-signature';

@Component({
  standalone: true,
  imports: [HubSignatureComponent, TranslocoPipe],
  templateUrl: './contract-signature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractSignatureComponent {
}`,
		'4. contract-signature.component.html': `<hub-signature
  [label]="'HUBUI.SIGNATURE.LABEL' | transloco"
  [formText]="'HUBUI.SIGNATURE.HELP' | transloco"
/>`
	};

	static readonly templateCode = I18nSignatureExampleComponent.sourceCode['4. contract-signature.component.html'];
	static readonly componentCode = I18nSignatureExampleComponent.sourceCode['3. contract-signature.component.ts'];
}
