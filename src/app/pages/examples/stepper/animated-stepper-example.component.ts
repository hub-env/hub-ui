import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { StepComponent, StepperComponent } from '../../../../../projects/stepper/src/public-api';

/**
 * Animation example showing optional step content transitions and runtime configuration.
 */
@Component({
	selector: 'app-animated-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent],
	template: `
		<div class="controls">
			<label class="field">
				<span>Animation</span>
				<select [value]="enabled() ? 'on' : 'off'" (change)="setEnabled(($any($event.target).value ?? 'off') === 'on')">
					<option value="on">Enabled</option>
					<option value="off">Disabled</option>
				</select>
			</label>
			<label class="field">
				<span>Type</span>
				<select [value]="type()" (change)="setType($any($event.target).value)">
					<option value="slide">Slide</option>
					<option value="fade">Fade</option>
				</select>
			</label>
			<label class="field">
				<span>Duration (ms)</span>
				<input
					type="number"
					min="120"
					max="800"
					step="20"
					[value]="duration()"
					(input)="setDuration($any($event.target).valueAsNumber)"
				/>
			</label>
		</div>

		<hub-stepper
			[class.hub-stepper--animated]="enabled()"
			[class.hub-stepper--anim-fade]="type() === 'fade'"
			[class.hub-stepper--anim-slide]="type() === 'slide'"
			[style.--hub-stepper-animation-duration.ms]="duration()"
		>
			<hub-step title="Profile">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
			<hub-step title="Address">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
			<hub-step title="Summary">
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
				flex-wrap: wrap;
				gap: 0.75rem;
				margin-bottom: 0.75rem;
			}

			.field {
				display: grid;
				gap: 0.25rem;
				min-width: 170px;
			}

			.field span {
				font-size: 0.75rem;
				color: var(--hub-sys-text-muted, #6c757d);
			}

			.field select,
			.field input {
				border: 1px solid var(--hub-sys-border-color-default, #ced4da);
				border-radius: 0.375rem;
				padding: 0.35rem 0.5rem;
				background: var(--hub-sys-surface-page, #fff);
			}
		`
	]
})
export class AnimatedStepperExampleComponent {
	/** Enables or disables animated transitions. */
	readonly enabled = signal(true);

	/** Stores the selected transition style. */
	readonly type = signal<'slide' | 'fade'>('slide');

	/** Stores transition duration in milliseconds. */
	readonly duration = signal(260);

	/**
	 * Updates animation enabled state.
	 *
	 * @param value New enabled value.
	 */
	setEnabled(value: boolean): void {
		this.enabled.set(value);
	}

	/**
	 * Updates animation transition style.
	 *
	 * @param value New animation type value.
	 */
	setType(value: string): void {
		if (value === 'fade' || value === 'slide') {
			this.type.set(value);
		}
	}

	/**
	 * Updates animation duration with sane bounds.
	 *
	 * @param value Input value in milliseconds.
	 */
	setDuration(value: number): void {
		if (!Number.isFinite(value)) {
			return;
		}
		const boundedValue = Math.min(800, Math.max(120, Math.round(value)));
		this.duration.set(boundedValue);
	}

	/** Template snippet shown in the code panel. */
	static readonly templateCode = `<hub-stepper
  class="hub-stepper--animated hub-stepper--anim-slide"
  style="--hub-stepper-animation-duration: 260ms;">
  <hub-step title="Profile"></hub-step>
  <hub-step title="Address"></hub-step>
  <hub-step title="Summary"></hub-step>
</hub-stepper>`;

	/** Component snippet shown in the code panel. */
	static readonly componentCode = `import { Component } from '@angular/core';
import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

@Component({
  standalone: true,
  imports: [StepperComponent, StepComponent],
  template: \`...\`
})
export class AnimatedStepperExampleComponent {}`;

	/** CSS snippet shown in the code panel. */
	static readonly cssCode = `/* Optional override for duration via CSS variable:
hub-stepper.hub-stepper--animated {
  --hub-stepper-animation-duration: 320ms;
  --hub-stepper-animation-easing: ease-in-out;
  --hub-stepper-animation-distance: 24px;
}`;

	readonly templateCode = AnimatedStepperExampleComponent.templateCode;
	readonly componentCode = AnimatedStepperExampleComponent.componentCode;
	readonly cssCode = AnimatedStepperExampleComponent.cssCode;
}
