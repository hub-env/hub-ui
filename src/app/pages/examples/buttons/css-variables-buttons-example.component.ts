import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates CSS variable customization for ng-hub-ui-buttons.
 * Overrides --hub-button-border-radius to produce pill-shaped buttons
 * and --hub-button-font-weight for bolder labels.
 */
@Component({
	selector: 'app-css-variables-buttons-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.custom-btn-scope {
				--hub-button-border-radius: 9999px;
				--hub-button-font-weight: 700;
			}
		</style>
		<div class="custom-btn-scope d-flex flex-wrap gap-2">
			<button hubButton variant="solid" color="primary">Primary Pill</button>
			<button hubButton variant="outline" color="success">Success Pill</button>
			<button hubButton variant="soft" color="danger">Danger Pill</button>
		</div>
	`
})
export class CssVariablesButtonsExampleComponent {
	static readonly templateCode = `<style>
  .custom-btn-scope {
    --hub-button-border-radius: 9999px;
    --hub-button-font-weight: 700;
  }
</style>

<div class="custom-btn-scope d-flex flex-wrap gap-2">
  <button hubButton variant="solid"   color="primary">Primary Pill</button>
  <button hubButton variant="outline" color="success">Success Pill</button>
  <button hubButton variant="soft"    color="danger">Danger Pill</button>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
  selector: 'app-css-variables-buttons-example',
  standalone: true,
  imports: [HubButtonComponent],
  templateUrl: './css-variables-buttons-example.component.html'
})
export class CssVariablesButtonsExampleComponent {}`;
}
