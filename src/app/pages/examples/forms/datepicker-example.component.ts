import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubDatepickerComponent } from 'ng-hub-ui-forms';

/**
 * `hub-datepicker` — single date and a date range, with `min`/`max` bounds.
 *
 * The locale switch is part of the example rather than a detail left to prose: every string in
 * the panel comes from `Intl`, so the header reads "August 2026" in English and "agosto de 2026"
 * in Spanish — a phrase, not a word. Rendering only the English form once hid a defect where the
 * particle was title-cased into "Agosto De 2026", which no consumer could override.
 *
 * Open the range picker and pick a start date to see the other half of the behaviour: the band
 * the range would take is previewed against the day under the pointer, or the one the arrow keys
 * last moved to. Watch the emitted value while doing it — a half-picked range is a question, not
 * an answer, so nothing reaches the control until the second end lands, and clicking away with
 * only one end picked leaves whatever was there before untouched.
 */
@Component({
	selector: 'app-forms-datepicker-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubDatepickerComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 46rem;">
			<label style="display: flex; align-items: center; gap: 0.5rem;">
				<span>Locale:</span>
				<select [value]="locale()" (change)="onLocaleChange($event)" style="padding: 0.35rem 0.5rem;">
					<option value="en-US">English (en-US)</option>
					<option value="es">Español (es)</option>
					<option value="fr">Français (fr)</option>
					<option value="de">Deutsch (de)</option>
				</select>
			</label>

			<div style="display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
				<hub-datepicker
					formControlName="birthday"
					label="Birthday"
					placeholder="Pick a date"
					[locale]="locale()"
					[max]="today"
					formText="No future dates."
				/>
				<hub-datepicker
					formControlName="stay"
					mode="range"
					label="Stay"
					placeholder="Check-in – Check-out"
					[locale]="locale()"
					[min]="today"
					formText="Pick a start, then sweep to preview."
				/>
			</div>

			<!-- The panel is exactly as wide as the day grid it frames, so paging through the year
			     never resizes it — and the header lives on what the nav groups leave, about 102px.
			     That is why the month is abbreviated by default. Open both and page to September in
			     Spanish: the first reads «sept 2026», the second wants «septiembre de 2026», needs
			     152px for it, and is cut off. That is the trade-off shown rather than hidden.
			     The long form needs a wider panel, and widening is GLOBAL: the calendar renders in
			     an overlay attached to document.body, outside this component's subtree, so a
			     custom property set on the field never reaches it. Declare the two tokens the
			     width is arithmetic on at :root — cell size and grid gap — and every panel widens
			     together. Measured: 268px clipped, 336px with the month spelled out in full. -->
			<div style="display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
				<hub-datepicker
					formControlName="abbreviated"
					label="Month abbreviated (default)"
					placeholder="Pick a date"
					[locale]="locale()"
					formText="The panel is 268px in every month of the year."
				/>
				<hub-datepicker
					formControlName="spelledOut"
					label="Month spelled out (needs a wider panel)"
					placeholder="Pick a date"
					[locale]="locale()"
					[monthFormat]="'long'"
					formText="Ellipsised at the default width — widening is global, see below."
				/>
			</div>
		</form>
	`
})
export class FormsDatepickerExampleComponent {
	readonly today = new Date().toISOString().slice(0, 10);

	readonly locale = signal('es');

	readonly form = new FormGroup({
		birthday: new FormControl<string | null>(null, Validators.required),
		stay: new FormControl<{ start: string | null; end: string | null } | null>(null),
		abbreviated: new FormControl<string | null>(null),
		spelledOut: new FormControl<string | null>(null)
	});

	/**
	 * Switches the locale driving the panel's month, weekday and header strings.
	 * @param event The change event from the locale select element.
	 */
	onLocaleChange(event: Event): void {
		this.locale.set((event.target as HTMLSelectElement).value);
	}

	static readonly templateCode = `<!-- single date, bounded with [max] -->
<hub-datepicker formControlName="birthday" label="Birthday" [locale]="locale()"
  [max]="today" formText="No future dates." />

<!-- range mode (value is { start, end }); the pending half is previewed while picking -->
<hub-datepicker formControlName="stay" mode="range" label="Stay"
  placeholder="Check-in – Check-out" [locale]="locale()" [min]="today" />`;

	static readonly componentCode = `readonly today = new Date().toISOString().slice(0, 10);

// Any BCP-47 tag. Defaults to the application's LOCALE_ID when left unbound.
readonly locale = signal('es');

readonly form = new FormGroup({
  birthday: new FormControl<string | null>(null, Validators.required),
  stay: new FormControl<{ start: string | null; end: string | null } | null>(null)
});`;
}
