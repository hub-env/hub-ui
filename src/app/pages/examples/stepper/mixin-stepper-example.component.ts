import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

/**
 * Live demo for the `hub-stepper-theme` SCSS mixin. The `.stepper-mixin-scope` block sets
 * the same `--hub-stepper-*` custom properties the mixin emits, so the rendered result
 * matches the SCSS shown alongside it in the docs. `--hub-stepper-accent` (mirrored on the
 * active nav link background) re-tones the current step, while `--hub-stepper-gap` opens up
 * the spacing between the navigation and the step content.
 */
@Component({
	selector: 'app-mixin-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.stepper-mixin-scope {
				--hub-stepper-accent: #7c3aed;
				--hub-stepper-nav-link-active-bg: #7c3aed;
				--hub-stepper-nav-link-active-color: #ffffff;
				--hub-stepper-gap: 1.5rem;
			}
		</style>
		<div class="stepper-mixin-scope">
			<hub-stepper>
				<hub-step title="Account">The active step follows the themed accent.</hub-step>
				<hub-step title="Details">Move between steps with a click or the arrow keys.</hub-step>
				<hub-step title="Review">The layout picks up the themed gap.</hub-step>
			</hub-stepper>
		</div>
	`,
	styles: []
})
export class MixinStepperExampleComponent {}
