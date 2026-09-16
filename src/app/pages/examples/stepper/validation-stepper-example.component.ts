import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { StepComponent, StepperComponent } from '../../../../../projects/stepper/src/public-api';

/**
 * Validation example: the next step is enabled only when current conditions are met.
 */
@Component({
	selector: 'app-validation-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent],
	template: `
		<div class="validation-demo">
			<hub-stepper>
				<hub-step title="Account">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.
					</p>
					<p>
						Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.
					</p>
					<label>
						<input
							type="checkbox"
							[checked]="step1Valid()"
							(change)="step1Valid.set($any($event.target).checked)"
						/>
						I accept the terms
					</label>
				</hub-step>

				<hub-step title="Profile" [disabled]="!step1Valid()">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.
					</p>
					<p>
						Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.
					</p>
					<input
						type="text"
						class="form-input"
						[value]="name()"
						(input)="name.set($any($event.target).value)"
						placeholder="Your name"
					/>
				</hub-step>

				<hub-step title="Summary" [disabled]="!step1Valid() || name().trim().length < 3">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.
					</p>
					<p>
						Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.
					</p>
				</hub-step>
			</hub-stepper>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.validation-demo {
				display: grid;
				gap: 0.75rem;
			}

			.form-input {
				padding: 0.5rem 0.75rem;
				border: 1px solid var(--hub-sys-border-color-default, #ced4da);
				border-radius: 0.375rem;
			}
		`
	]
})
export class ValidationStepperExampleComponent {
	step1Valid = signal(false);
	name = signal('');

	static readonly templateCode = `<hub-stepper>
  <hub-step title="Account">
    <input type="checkbox" />
  </hub-step>
  <hub-step title="Profile" [disabled]="!step1Valid()">
    <input type="text" />
  </hub-step>
  <hub-step title="Summary" [disabled]="!step1Valid() || name().trim().length < 3">
  </hub-step>
</hub-stepper>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

@Component({
  selector: 'app-validation-stepper-example',
  standalone: true,
  imports: [StepperComponent, StepComponent],
  template: \`...\`
})
export class ValidationStepperExampleComponent {
  step1Valid = signal(false);
  name = signal('');
}`;

	static readonly cssCode = `.validation-demo {
  display: grid;
  gap: 0.75rem;
}

.form-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--hub-sys-border-color-default, #ced4da);
  border-radius: 0.375rem;
}`;

	readonly templateCode = ValidationStepperExampleComponent.templateCode;
	readonly componentCode = ValidationStepperExampleComponent.componentCode;
	readonly cssCode = ValidationStepperExampleComponent.cssCode;
}
