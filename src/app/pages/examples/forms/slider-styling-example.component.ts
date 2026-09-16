import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSliderComponent } from 'ng-hub-ui-forms';

/**
 * `hub-slider` styling — gradient fill and flush (label-less) rail.
 *
 * `--hub-slider-track-fill` accepts a full `<image>` (e.g. a `linear-gradient`) for
 * the filled part of the track; it renders intact, clipped to the current
 * percentage. Setting `[showValue]="false"` collapses the value-bubble headroom
 * (`--hub-slider-value-space`) so a slider with no bubble sits flush.
 */
@Component({
	selector: 'app-forms-slider-styling-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSliderComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			.gradient-slider {
				--hub-slider-track-fill: linear-gradient(to right, #22c55e, #eab308, #ef4444);
			}
		</style>

		<form [formGroup]="form" style="display: grid; gap: 1.75rem; max-width: 28rem;">
			<hub-slider
				class="gradient-slider"
				formControlName="level"
				label="Risk level (gradient fill)"
				[min]="0"
				[max]="100"
				[step]="1"
			/>
			<hub-slider
				formControlName="compact"
				label="Compact — flush, no value bubble"
				[showValue]="false"
				[min]="0"
				[max]="100"
				[step]="1"
			/>
		</form>
	`
})
export class FormsSliderStylingExampleComponent {
	readonly form = new FormGroup({
		level: new FormControl(65),
		compact: new FormControl(40)
	});

	static readonly templateCode = `<style>
  .gradient-slider {
    --hub-slider-track-fill: linear-gradient(to right, #22c55e, #eab308, #ef4444);
  }
</style>

<!-- gradient fill via --hub-slider-track-fill -->
<hub-slider class="gradient-slider" formControlName="level" label="Risk level" [min]="0" [max]="100" />

<!-- flush: no value bubble, collapses --hub-slider-value-space to 0 -->
<hub-slider formControlName="compact" label="Compact" [showValue]="false" [min]="0" [max]="100" />`;

	static readonly componentCode = `readonly form = new FormGroup({
  level: new FormControl(65),
  compact: new FormControl(40)
});`;
}
