import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSliderComponent } from 'ng-hub-ui-forms';

/**
 * `hub-slider` — single thumb and dual-thumb range.
 */
@Component({
	selector: 'app-forms-slider-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSliderComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.75rem; max-width: 28rem;">
			<hub-slider formControlName="volume" label="Volume" [min]="0" [max]="100" [step]="5" />
			<hub-slider
				formControlName="price"
				label="Price range"
				[range]="true"
				[min]="0"
				[max]="1000"
				[step]="50"
				formText="Dual-thumb range."
			/>
		</form>
	`
})
export class FormsSliderExampleComponent {
	readonly form = new FormGroup({
		volume: new FormControl(30),
		price: new FormControl<[number, number]>([200, 800])
	});

	static readonly templateCode = `<!-- single thumb -->
<hub-slider formControlName="volume" label="Volume" [min]="0" [max]="100" [step]="5" />

<!-- dual-thumb range (value is a [lower, upper] tuple) -->
<hub-slider formControlName="price" label="Price range" [range]="true"
  [min]="0" [max]="1000" [step]="50" />`;

	static readonly componentCode = `readonly form = new FormGroup({
  volume: new FormControl(30),
  price: new FormControl<[number, number]>([200, 800])
});`;
}
