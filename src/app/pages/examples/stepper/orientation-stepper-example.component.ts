import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { StepComponent, StepperComponent, StepperLayout } from '../../../../../projects/stepper/src/public-api';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Layout example toggling between vertical and sidebar dispositions.
 */
@Component({
	selector: 'app-orientation-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent, HubButtonComponent],
	template: `
		<div class="controls">
			<button hubButton (click)="setLayout(StepperLayout.Vertical)">Vertical</button>
			<button hubButton (click)="setLayout(StepperLayout.Sidebar)">Sidebar</button>
		</div>

		<hub-stepper [options]="{ layout: layout() }">
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
		`
	]
})
export class OrientationStepperExampleComponent {
	readonly StepperLayout = StepperLayout;
	layout = signal<StepperLayout>(StepperLayout.Vertical);

	/**
	 * Updates the stepper layout orientation.
	 *
	 * @param layout The layout orientation to apply.
	 */
	setLayout(layout: StepperLayout) {
		this.layout.set(layout);
	}

	static readonly templateCode = `<hub-stepper [options]="{ layout: layout() }">
  ...
</hub-stepper>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { StepComponent, StepperComponent, StepperLayout } from 'ng-hub-ui-stepper';

@Component({
  selector: 'app-orientation-stepper-example',
  standalone: true,
  imports: [StepperComponent, StepComponent],
  template: \`...\`
})
export class OrientationStepperExampleComponent {
  readonly StepperLayout = StepperLayout;
  layout = signal<StepperLayout>(StepperLayout.Vertical);

  setLayout(layout: StepperLayout) {
    this.layout.set(layout);
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
}`;

	readonly templateCode = OrientationStepperExampleComponent.templateCode;
	readonly componentCode = OrientationStepperExampleComponent.componentCode;
	readonly cssCode = OrientationStepperExampleComponent.cssCode;
}
