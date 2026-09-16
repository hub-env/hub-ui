import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { StepComponent, StepperComponent } from '../../../../../projects/stepper/src/public-api';

/**
 * Demonstrates RTL rendering mode configured through stepper options.
 */
@Component({
	selector: 'app-rtl-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent],
	template: `
		<div class="controls">
			<label class="controls__label" for="rtlToggle">RTL</label>
			<input id="rtlToggle" type="checkbox" [checked]="rtl()" (change)="rtl.set($any($event.target).checked)" />
		</div>

		<hub-stepper [options]="{ rtl: rtl() }">
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
			.controls {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-bottom: 0.75rem;
			}

			.controls__label {
				font-weight: 600;
				font-size: 0.875rem;
			}
		`
	]
})
export class RtlStepperExampleComponent {
	/** Toggles right-to-left mode in stepper options. */
	rtl = signal(false);

	static readonly templateCode = `<hub-stepper [options]="{ rtl: true }">
  <hub-step title="Account"></hub-step>
  <hub-step title="Profile"></hub-step>
  <hub-step title="Confirm"></hub-step>
</hub-stepper>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

@Component({
  selector: 'app-rtl-stepper-example',
  standalone: true,
  imports: [StepperComponent, StepComponent],
  template: \`...\`
})
export class RtlStepperExampleComponent {}`;

	static readonly cssCode = `/* Use options.rtl to enable right-to-left rendering. */`;

	readonly templateCode = RtlStepperExampleComponent.templateCode;
	readonly componentCode = RtlStepperExampleComponent.componentCode;
	readonly cssCode = RtlStepperExampleComponent.cssCode;
}
