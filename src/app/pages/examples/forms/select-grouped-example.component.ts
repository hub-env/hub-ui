import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSelectComponent } from 'ng-hub-ui-forms';

/**
 * `hub-select` with grouped options — `groupBy` renders a sticky group header per
 * distinct value of the given property.
 */
@Component({
	selector: 'app-forms-select-grouped-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSelectComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-select
				formControlName="city"
				label="City"
				[items]="cities"
				bindLabel="name"
				bindValue="id"
				groupBy="country"
				placeholder="Select a city"
			/>
		</form>
	`
})
export class FormsSelectGroupedExampleComponent {
	readonly cities = [
		{ id: 'mad', name: 'Madrid', country: 'Spain' },
		{ id: 'bcn', name: 'Barcelona', country: 'Spain' },
		{ id: 'par', name: 'Paris', country: 'France' },
		{ id: 'lyo', name: 'Lyon', country: 'France' },
		{ id: 'ber', name: 'Berlin', country: 'Germany' },
		{ id: 'mun', name: 'Munich', country: 'Germany' }
	];

	readonly form = new FormGroup({
		city: new FormControl<string | null>(null)
	});

	static readonly templateCode = `<!-- groupBy renders a header per distinct "country" -->
<hub-select formControlName="city" label="City"
  [items]="cities" bindLabel="name" bindValue="id"
  groupBy="country" placeholder="Select a city" />`;

	static readonly componentCode = `readonly cities = [
  { id: 'mad', name: 'Madrid', country: 'Spain' },
  { id: 'bcn', name: 'Barcelona', country: 'Spain' },
  { id: 'par', name: 'Paris', country: 'France' },
  { id: 'lyo', name: 'Lyon', country: 'France' },
  { id: 'ber', name: 'Berlin', country: 'Germany' },
  { id: 'mun', name: 'Munich', country: 'Germany' }
];

readonly form = new FormGroup({
  city: new FormControl<string | null>(null)
});`;
}
