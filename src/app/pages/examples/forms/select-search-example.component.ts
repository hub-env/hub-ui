import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSelectComponent } from 'ng-hub-ui-forms';

/**
 * `hub-select` as a typeahead — `searchable` (on by default) filters the options
 * by the typed term as you type. Pair with `[multiple]` to build a tag picker.
 */
@Component({
	selector: 'app-forms-select-search-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSelectComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-select
				formControlName="country"
				label="Country"
				[items]="countries"
				bindLabel="name"
				bindValue="code"
				[searchable]="true"
				placeholder="Type to filter…"
			/>

			<hub-select
				formControlName="frameworks"
				label="Frameworks"
				[items]="frameworks"
				[multiple]="true"
				[searchable]="true"
				placeholder="Search and add…"
			/>
		</form>
	`
})
export class FormsSelectSearchExampleComponent {
	readonly countries = [
		{ code: 'es', name: 'Spain' },
		{ code: 'fr', name: 'France' },
		{ code: 'de', name: 'Germany' },
		{ code: 'it', name: 'Italy' },
		{ code: 'pt', name: 'Portugal' },
		{ code: 'nl', name: 'Netherlands' },
		{ code: 'se', name: 'Sweden' },
		{ code: 'pl', name: 'Poland' },
		{ code: 'gr', name: 'Greece' },
		{ code: 'ie', name: 'Ireland' }
	];

	readonly frameworks = ['Angular', 'React', 'Vue', 'Svelte', 'Solid', 'Qwik', 'Preact', 'Lit'];

	readonly form = new FormGroup({
		country: new FormControl<string | null>(null),
		frameworks: new FormControl<string[]>([])
	});

	static readonly templateCode = `<!-- typeahead: searchable filters the list as you type -->
<hub-select formControlName="country" label="Country"
  [items]="countries" bindLabel="name" bindValue="code"
  [searchable]="true" placeholder="Type to filter…" />

<!-- multiple + searchable = a tag picker -->
<hub-select formControlName="frameworks" label="Frameworks"
  [items]="frameworks" [multiple]="true" [searchable]="true"
  placeholder="Search and add…" />`;

	static readonly componentCode = `readonly countries = [
  { code: 'es', name: 'Spain' }, { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' }, /* …more… */
];
readonly frameworks = ['Angular', 'React', 'Vue', 'Svelte', 'Solid', 'Qwik', 'Preact', 'Lit'];

readonly form = new FormGroup({
  country: new FormControl<string | null>(null),
  frameworks: new FormControl<string[]>([])
});`;
}
