import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubInputComponent, HubInputPrefixDirective } from 'ng-hub-ui-forms';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Search-box `hub-input`: a leading icon **projected** as a `<hub-icon>` (so it
 * uses any pack via the `pack:variant:name` shorthand), the built-in `[clearable]`
 * ✕ button (no manual wiring), and a debounced `search` output driving a live
 * filter. Affixes use logical CSS properties, so the icon sits inline-start
 * (left in LTR, right in RTL) automatically.
 */
@Component({
	selector: 'app-forms-input-search-typeahead-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent, HubInputPrefixDirective, HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div style="display: grid; gap: 1rem; max-width: 28rem;">
			<hub-input
				[formControl]="ctrl"
				label="Search frameworks"
				placeholder="Type to filter…"
				[clearable]="true"
				[debounceTime]="300"
				(search)="onSearch($event)"
			>
				<hub-icon hubInputPrefix name="fa:solid:magnifying-glass" />
			</hub-input>

			<p style="font-size: 0.85rem; color: var(--hub-sys-text-muted);">
				Debounced term (after 300&nbsp;ms): <code>{{ lastSearch() || '—' }}</code>
			</p>

			<ul style="margin: 0; padding-inline-start: 1.1rem; display: grid; gap: 0.25rem;">
				@for (item of results(); track item) {
					<li>{{ item }}</li>
				} @empty {
					<li style="color: var(--hub-sys-text-muted); list-style: none;">No matches</li>
				}
			</ul>
		</div>
	`
})
export class FormsInputSearchTypeaheadExampleComponent {
	/** Frameworks filtered by the debounced search term. */
	private readonly frameworks = ['Angular', 'React', 'Vue', 'Svelte', 'Solid', 'Qwik', 'Preact', 'Lit'];

	/** Search field control. */
	readonly ctrl = new FormControl('', { nonNullable: true });

	/** Last term emitted by the debounced `search` output (the clear button emits ''). */
	readonly lastSearch = signal('');

	/** Frameworks matching the last debounced term (case-insensitive). */
	readonly results = computed(() => {
		const q = this.lastSearch().trim().toLowerCase();
		return q ? this.frameworks.filter((f) => f.toLowerCase().includes(q)) : this.frameworks;
	});

	/**
	 * Stores the debounced term so the list re-filters only after the user pauses
	 * typing. The internal clear (✕) button emits an empty term, resetting the filter.
	 *
	 * @param value - The term emitted by `<hub-input>`'s `search` output.
	 */
	onSearch(value: string): void {
		this.lastSearch.set(value);
	}

	static readonly templateCode = `<hub-input
  [formControl]="ctrl"
  label="Search frameworks"
  placeholder="Type to filter…"
  [clearable]="true"
  [debounceTime]="300"
  (search)="onSearch($event)">
  <!-- project any icon; the shorthand picks the pack -->
  <hub-icon hubInputPrefix name="fa:solid:magnifying-glass" />
</hub-input>`;

	static readonly componentCode = `import { HubInputComponent, HubInputPrefixDirective } from 'ng-hub-ui-forms';
import { HubIconComponent } from 'ng-hub-ui-icons';

// Project a <hub-icon> into hubInputPrefix/hubInputSuffix — any pack, any shorthand.
// [clearable] renders the ✕ button itself (emits '' via search on clear).
// (search) emits the term debounceTime ms after typing stops — repeats are skipped.
readonly ctrl = new FormControl('', { nonNullable: true });
readonly lastSearch = signal('');

onSearch(value: string): void {
  this.lastSearch.set(value); // drive your live filter / autocomplete here
}`;
}
