import { Component, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { StepComponent, StepperComponent } from '../../../../../projects/stepper/src/public-api';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Programmatic control example using StepperComponent public methods and events.
 */
@Component({
	selector: 'app-programmatic-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent, HubButtonComponent],
	template: `
		<div class="controls">
			<button hubButton (click)="go(0)">Go to 1</button>
			<button hubButton (click)="go(1)">Go to 2</button>
			<button hubButton (click)="go(2)">Go to 3</button>
		</div>

		<hub-stepper
			#stepper
			(nextStep)="events = 'next: ' + $event"
			(previousStep)="events = 'prev: ' + $event"
			(completed)="events = 'completed'"
		>
			<hub-step title="One">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
			<hub-step title="Two">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
			<hub-step title="Three">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
		</hub-stepper>

		<p class="events">Event: {{ events }}</p>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.controls {
				display: flex;
				gap: 0.5rem;
				margin-bottom: 0.5rem;
			}

			.btn {
				padding: 0.25rem 0.5rem;
				border: 1px solid var(--hub-sys-border-color-default, #ced4da);
				background: var(--hub-sys-surface-page, #fff);
				border-radius: 0.375rem;
			}

			.events {
				color: var(--hub-sys-text-muted, #6c757d);
			}
		`
	]
})
export class ProgrammaticStepperExampleComponent {
	readonly stepper = viewChild<StepperComponent>('stepper');
	events = '-';

	/**
	 * Navigates the stepper programmatically to the step at the given index.
	 *
	 * @param index The zero-based index of the step to navigate to.
	 */
	go(index: number) {
		this.stepper()?.goTo(index);
	}

	static readonly templateCode = `<div class="controls">
  <button hubButton (click)="go(0)">Go to 1</button>
  <button hubButton (click)="go(1)">Go to 2</button>
  <button hubButton (click)="go(2)">Go to 3</button>
</div>

<hub-stepper
  #stepper
  (nextStep)="events = 'next: ' + $event"
  (previousStep)="events = 'prev: ' + $event"
  (completed)="events = 'completed'">
  <hub-step title="One">
    <p>First step.</p>
  </hub-step>
  <hub-step title="Two">
    <p>Second step.</p>
  </hub-step>
  <hub-step title="Three">
    <p>Third step.</p>
  </hub-step>
</hub-stepper>`;

	static readonly componentCode = `import { Component, viewChild } from '@angular/core';
import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

@Component({
  selector: 'app-programmatic-stepper-example',
  standalone: true,
  imports: [StepperComponent, StepComponent],
  template: \`...\`,
  styles: [\`...\`]
})
export class ProgrammaticStepperExampleComponent {
  readonly stepper = viewChild<StepperComponent>('stepper');
  events = '-';

  go(index: number) {
    this.stepper()?.goTo(index);
  }
}`;

	static readonly cssCode = `.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--hub-sys-border-color-default, #ced4da);
  background: var(--hub-sys-surface-page, #fff);
  border-radius: 0.375rem;
}

.events {
  color: var(--hub-sys-text-muted, #6c757d);
}`;

	readonly templateCode = ProgrammaticStepperExampleComponent.templateCode;
	readonly componentCode = ProgrammaticStepperExampleComponent.componentCode;
	readonly cssCode = ProgrammaticStepperExampleComponent.cssCode;
}
