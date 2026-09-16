import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSelectComponent } from 'ng-hub-ui-forms';

/**
 * Alternative `hub-select` formats that render their own UI (no dropdown): buttons, radio, checkbox.
 */
@Component({
	selector: 'app-forms-select-formats-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSelectComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-select
				formControlName="size"
				label="Size"
				format="buttons"
				[items]="sizes"
				bindLabel="label"
				bindValue="value"
			/>
			<hub-select
				formControlName="plan"
				label="Plan"
				format="radio"
				[items]="plans"
				bindLabel="label"
				bindValue="value"
				[vertical]="true"
			/>
			<hub-select formControlName="perks" label="Perks" format="checkbox" [items]="perks" />
		</form>
	`
})
export class FormsSelectFormatsExampleComponent {
	readonly sizes = [
		{ value: 's', label: 'S' },
		{ value: 'm', label: 'M' },
		{ value: 'l', label: 'L' },
		{ value: 'xl', label: 'XL' }
	];

	readonly plans = [
		{ value: 'free', label: 'Free' },
		{ value: 'pro', label: 'Pro' },
		{ value: 'enterprise', label: 'Enterprise' }
	];

	readonly perks = ['Angular', 'Signals', 'Forms'];

	readonly form = new FormGroup({
		size: new FormControl<string | null>('m'),
		plan: new FormControl<string | null>('pro'),
		perks: new FormControl<string[]>(['Angular'])
	});

	static readonly templateCode = `<!-- toggle-button group (single, with bindValue) -->
<hub-select formControlName="size" label="Size" format="buttons"
  [items]="sizes" bindLabel="label" bindValue="value" />

<!-- vertical radio list (single) -->
<hub-select formControlName="plan" label="Plan" format="radio"
  [items]="plans" bindLabel="label" bindValue="value" [vertical]="true" />

<!-- checkbox list (multiple) -->
<hub-select formControlName="perks" label="Perks" format="checkbox" [items]="perks" />`;

	static readonly componentCode = `readonly form = new FormGroup({
  size: new FormControl<string | null>('m'),
  plan: new FormControl<string | null>('pro'),
  perks: new FormControl<string[]>(['Angular'])
});`;
}
