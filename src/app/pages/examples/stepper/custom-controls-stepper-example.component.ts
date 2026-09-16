import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
	NextButtonDirective,
	PreviousButtonDirective,
	StepComponent,
	StepperComponent,
	SubmitButtonDirective
} from '../../../../../projects/stepper/src/public-api';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates how to override default stepper controls with projected custom buttons.
 */
@Component({
	selector: 'app-custom-controls-stepper-example',
	standalone: true,
	imports: [
		StepperComponent,
		StepComponent,
		PreviousButtonDirective,
		NextButtonDirective,
		SubmitButtonDirective,
		HubButtonComponent
	],
	template: `
		<hub-stepper>
			<hub-step title="Account">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
				<button nextButton hubButton class="btn--next">Next step -></button>
			</hub-step>

			<hub-step title="Profile">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
				<div class="actions">
					<button previousButton hubButton class="btn--back"><- Back</button>
					<button nextButton hubButton class="btn--next">Continue -></button>
				</div>
			</hub-step>

			<hub-step title="Confirm">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
				<div class="actions">
					<button previousButton hubButton class="btn--back"><- Edit</button>
					<button submitButton hubButton class="btn--submit">Complete</button>
				</div>
			</hub-step>
		</hub-stepper>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.actions {
				display: flex;
				gap: 0.5rem;
			}

			.btn {
				border: 1px solid transparent;
				border-radius: 0.5rem;
				padding: 0.5rem 0.75rem;
				font-size: 0.875rem;
				font-weight: 600;
			}

			.btn--back {
				border-color: #adb5bd;
				background: var(--hub-sys-surface-page, #ffffff);
				color: #343a40;
			}

			.btn--next,
			.btn--submit {
				background: #0d6efd;
				color: #ffffff;
			}
		`
	]
})
export class CustomControlsStepperExampleComponent {
	/** Snippet displayed in the HTML tab. */
	static readonly templateCode = `<hub-stepper>
  <hub-step title="Account">
    <button nextButton hubButton class="btn--next">Next step -></button>
  </hub-step>
  <hub-step title="Profile">
    <button previousButton hubButton class="btn--back"><- Back</button>
    <button nextButton hubButton class="btn--next">Continue -></button>
  </hub-step>
  <hub-step title="Confirm">
    <button previousButton hubButton class="btn--back"><- Edit</button>
    <button submitButton hubButton class="btn--submit">Complete</button>
  </hub-step>
</hub-stepper>`;

	/** Snippet displayed in the TypeScript tab. */
	static readonly componentCode = `import { Component } from '@angular/core';
import {
  NextButtonDirective,
  PreviousButtonDirective,
  StepComponent,
  StepperComponent,
  SubmitButtonDirective
} from 'ng-hub-ui-stepper';

@Component({
  selector: 'app-custom-controls-stepper-example',
  standalone: true,
  imports: [
    StepperComponent,
    StepComponent,
    PreviousButtonDirective,
    NextButtonDirective,
    SubmitButtonDirective
  ],
  template: \`...\`,
  styles: [\`...\`]
})
export class CustomControlsStepperExampleComponent {}`;

	/** Snippet displayed in the CSS tab. */
	static readonly cssCode = `.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  border: 1px solid transparent;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn--back {
  border-color: #adb5bd;
  background: var(--hub-sys-surface-page, #ffffff);
  color: #343a40;
}

.btn--next,
.btn--submit {
  background: #0d6efd;
  color: #ffffff;
}`;

	readonly templateCode = CustomControlsStepperExampleComponent.templateCode;
	readonly componentCode = CustomControlsStepperExampleComponent.componentCode;
	readonly cssCode = CustomControlsStepperExampleComponent.cssCode;
}
