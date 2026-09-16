import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StepComponent, StepperComponent } from '../../../../../projects/stepper/src/public-api';

/**
 * Basic usage example for Stepper with default built-in navigation controls.
 */
@Component({
	selector: 'app-basic-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-stepper>
			<hub-step title="Data">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>

			<hub-step title="Confirmation">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>

			<hub-step title="Finish">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
		</hub-stepper>
	`
})
export class BasicStepperExampleComponent {
	/** Template snippet shown in the code panel. */
	static readonly templateCode = `<hub-stepper>
  <hub-step title="Data"></hub-step>
  <hub-step title="Confirmation"></hub-step>
  <hub-step title="Finish"></hub-step>
</hub-stepper>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

@Component({
  selector: 'app-basic-stepper-example',
  standalone: true,
  imports: [StepperComponent, StepComponent],
  template: \`...\`
})
export class BasicStepperExampleComponent {}`;

	readonly templateCode = BasicStepperExampleComponent.templateCode;
	readonly componentCode = BasicStepperExampleComponent.componentCode;
}
