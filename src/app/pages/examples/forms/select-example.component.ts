import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubDatepickerComponent, HubInputComponent, HubSelectComponent } from 'ng-hub-ui-forms';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * `hub-select` dropdown — single and multiple selection over the vendored ng-select engine.
 */
@Component({
	selector: 'app-forms-select-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent, HubSelectComponent, HubDatepickerComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-select
				formControlName="country"
				label="Country"
				[items]="countries"
				bindLabel="name"
				bindValue="code"
				placeholder="Select a country"
			/>
			<hub-select formControlName="tags" label="Tags" [items]="tags" [multiple]="true" placeholder="Pick some tags" />
			<hub-select formControlName="city" labelType="floating" label="City" [items]="cities" />
			<hub-input formControlName="street" labelType="floating" label="Street" />
			<hub-select formControlName="langs" labelType="floating" label="Languages" [items]="tags" [multiple]="true" />
			<hub-datepicker [locale]="locale()" formControlName="arrival" labelType="floating" label="Arrival" />
		</form>
	`
})
export class FormsSelectExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	readonly countries = [
		{ code: 'es', name: 'Spain' },
		{ code: 'fr', name: 'France' },
		{ code: 'de', name: 'Germany' },
		{ code: 'it', name: 'Italy' },
		{ code: 'pt', name: 'Portugal' }
	];

	readonly tags = ['Angular', 'Signals', 'Forms', 'RxJS', 'TypeScript'];

	readonly cities = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'];

	readonly form = new FormGroup({
		country: new FormControl<string | null>(null),
		tags: new FormControl<string[]>([]),
		city: new FormControl<string | null>(null),
		street: new FormControl<string | null>('Gran Via 2'),
		langs: new FormControl<string[]>(['Angular', 'Signals']),
		arrival: new FormControl<Date | null>(null)
	});

	static readonly templateCode = `<!-- single, object items with bindLabel/bindValue -->
<hub-select formControlName="country" label="Country"
  [items]="countries" bindLabel="name" bindValue="code" placeholder="Select a country" />

<!-- multiple, primitive items -->
<hub-select formControlName="tags" label="Tags" [items]="tags" [multiple]="true" placeholder="Pick some tags" />

<!-- floating label: sits inside the control and lifts on focus or on a value.
     The select and the input read the same three --hub-field-floating-* tokens,
     so side by side they are one field, not two that resemble each other. -->
<hub-select formControlName="city" labelType="floating" label="City" [items]="cities" />
<hub-input formControlName="street" labelType="floating" label="Street" />
<hub-select formControlName="langs" labelType="floating" label="Languages" [items]="tags" [multiple]="true" />
<hub-datepicker formControlName="arrival" labelType="floating" label="Arrival" />`;

	static readonly componentCode = `readonly countries = [
  { code: 'es', name: 'Spain' },
  { code: 'fr', name: 'France' },
  // …
];
readonly tags = ['Angular', 'Signals', 'Forms', 'RxJS', 'TypeScript'];
readonly cities = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'];

readonly form = new FormGroup({
  country: new FormControl<string | null>(null),
  tags: new FormControl<string[]>([]),
  city: new FormControl<string | null>(null)
});`;
}
