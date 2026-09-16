import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSelectComponent } from 'ng-hub-ui-forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';

/** Shape of the in-memory dataset simulating a server-side city search. */
interface City {
	code: string;
	name: string;
	country: string;
}

/** Small in-memory dataset standing in for a remote API. */
const CITIES: City[] = [
	{ code: 'mad', name: 'Madrid', country: 'Spain' },
	{ code: 'bcn', name: 'Barcelona', country: 'Spain' },
	{ code: 'val', name: 'Valencia', country: 'Spain' },
	{ code: 'par', name: 'Paris', country: 'France' },
	{ code: 'mar', name: 'Marseille', country: 'France' },
	{ code: 'ber', name: 'Berlin', country: 'Germany' },
	{ code: 'mun', name: 'Munich', country: 'Germany' },
	{ code: 'rom', name: 'Rome', country: 'Italy' },
	{ code: 'mil', name: 'Milan', country: 'Italy' },
	{ code: 'lis', name: 'Lisbon', country: 'Portugal' },
	{ code: 'ams', name: 'Amsterdam', country: 'Netherlands' },
	{ code: 'vie', name: 'Vienna', country: 'Austria' }
];

/**
 * `hub-select` async typeahead — a `[typeahead]` Subject receives each search
 * term (client-side filtering switches off), the component simulates a server
 * round-trip and feeds the results back through `[items]`, with `[loading]`
 * shown while "fetching" and `[minTermLength]` gating short terms. A second
 * select shows `[addTag]` creating items from the typed term.
 */
@Component({
	selector: 'app-forms-select-typeahead-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSelectComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-select
				formControlName="city"
				label="City"
				[items]="cities()"
				bindLabel="name"
				bindValue="code"
				[typeahead]="citySearch$"
				[minTermLength]="2"
				[loading]="loading()"
				placeholder="Type at least 2 characters…"
				notFoundText="No matching city"
				formText="Async typeahead — each term is pushed to the Subject and the results come back from the 'server'."
			/>

			<hub-select
				formControlName="tags"
				label="Tags"
				[items]="tags"
				[multiple]="true"
				[addTag]="true"
				addTagText="Create tag"
				placeholder="Pick or type a new tag…"
				formText="addTag creates an item from the search term when nothing matches."
			/>

			<p class="mb-0 text-body-secondary">
				city: <strong>{{ form.controls.city.value || '—' }}</strong> · tags:
				<strong>{{ form.controls.tags.value?.join(', ') || '—' }}</strong>
			</p>
		</form>
	`
})
export class SelectTypeaheadFormsExampleComponent implements OnDestroy {
	/** Subject wired to `[typeahead]` — receives every search term ≥ minTermLength. */
	readonly citySearch$ = new Subject<string>();

	/** Results of the simulated server search, fed back through `[items]`. */
	readonly cities = signal<City[]>([]);

	/** Whether the simulated request is in flight. */
	readonly loading = signal(false);

	/** Static options for the tag picker; `addTag` extends them at runtime. */
	readonly tags = ['angular', 'signals', 'forms', 'a11y'];

	readonly form = new FormGroup({
		city: new FormControl<string | null>(null),
		tags: new FormControl<string[]>([])
	});

	private readonly _search: Subscription;

	private _pending: ReturnType<typeof setTimeout> | undefined;

	constructor() {
		this._search = this.citySearch$
			// The vendor pushes `null` through the Subject when it clears the search
			// box (e.g. right after selecting an option) — filter it out.
			.pipe(
				filter((term): term is string => term != null),
				debounceTime(250),
				distinctUntilChanged()
			)
			.subscribe((term) => this.fetchCities(term));
	}

	ngOnDestroy(): void {
		this._search.unsubscribe();
		clearTimeout(this._pending);
	}

	/**
	 * Simulates a server-side search over the in-memory dataset.
	 *
	 * @param term Search term pushed by the typeahead Subject.
	 */
	private fetchCities(term: string): void {
		this.loading.set(true);
		clearTimeout(this._pending);
		this._pending = setTimeout(() => {
			const needle = term.toLowerCase();
			this.cities.set(
				CITIES.filter((city) => city.name.toLowerCase().includes(needle) || city.country.toLowerCase().includes(needle))
			);
			this.loading.set(false);
		}, 400);
	}

	static readonly templateCode = `<!-- async typeahead: terms go to the Subject, results come back through [items] -->
<hub-select formControlName="city" label="City"
  [items]="cities()" bindLabel="name" bindValue="code"
  [typeahead]="citySearch$" [minTermLength]="2" [loading]="loading()"
  placeholder="Type at least 2 characters…" />

<!-- addTag: create items from the search term (true, or a mapping fn — sync or Promise) -->
<hub-select formControlName="tags" label="Tags"
  [items]="tags" [multiple]="true"
  [addTag]="true" addTagText="Create tag" />`;

	static readonly componentCode = `readonly citySearch$ = new Subject<string>();
readonly cities = signal<City[]>([]);
readonly loading = signal(false);

constructor() {
  this.citySearch$
    // ng-select pushes null when it clears the search box (e.g. on select)
    .pipe(
      filter((term): term is string => term != null),
      debounceTime(250),
      distinctUntilChanged()
    )
    .subscribe((term) => this.fetchCities(term));
}

private fetchCities(term: string): void {
  this.loading.set(true);
  this.api.searchCities(term).subscribe((cities) => {
    this.cities.set(cities);
    this.loading.set(false);
  });
}`;
}
