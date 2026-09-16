import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubDatepickerComponent } from 'ng-hub-ui-forms';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * `hub-datepicker` with `granularity="minute"` — the validity window that motivated the time axis.
 *
 * A building access code valid "today from 9 to 21" cannot be expressed as a whole day: rounding it
 * up turns a single-use courier code into one that opens the door around the clock. Each endpoint
 * carries its own time, and the emitted value is a full ISO 8601 timestamp with the offset of that
 * very date.
 */
@Component({
	selector: 'app-forms-datepicker-time-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubDatepickerComponent, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 46rem;">
			<div style="display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
				<hub-datepicker
					[locale]="locale()"
					formControlName="window"
					mode="range"
					granularity="minute"
					[minuteStep]="15"
					label="Access window"
					placeholder="From – to"
					[min]="today"
					formText="Each end carries its own time."
				/>

				<hub-datepicker
					[locale]="locale()"
					formControlName="reminder"
					granularity="minute"
					[minuteStep]="5"
					label="Reminder"
					placeholder="When should it fire?"
					formText="A single instant, minute precision."
				/>
			</div>

			<div
				style="display: grid; gap: 0.35rem; padding: 0.75rem 1rem; border-radius: 0.5rem; background: var(--hub-ref-color-gray-100, #f8f9fa);"
			>
				<strong style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Emitted value</strong>
				<code style="font-size: 0.8rem; word-break: break-all;">{{ form.value | json }}</code>
			</div>
		</form>
	`
})
export class FormsDatepickerTimeExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	readonly today = new Date();

	readonly form = new FormGroup({
		window: new FormControl<{ start: string | null; end: string | null } | null>(null),
		reminder: new FormControl<string | null>(null)
	});

	static readonly templateCode = `<!-- a validity window: each endpoint carries its own time -->
<hub-datepicker
  formControlName="window"
  mode="range"
  granularity="minute"
  [minuteStep]="15"
  label="Access window"
  [min]="today" />

<!-- a single instant -->
<hub-datepicker
  formControlName="reminder"
  granularity="minute"
  [minuteStep]="5"
  label="Reminder" />`;

	static readonly componentCode = `readonly today = new Date();

readonly form = new FormGroup({
  window: new FormControl<{ start: string | null; end: string | null } | null>(null),
  reminder: new FormControl<string | null>(null)
});

// The emitted value is ISO 8601 in the reader's zone, with the offset of that
// date — so a January and an August pick in Madrid carry +01:00 and +02:00.
//
//   window:   { start: "2026-09-01T09:00:00+02:00",
//               end:   "2026-09-01T21:00:00+02:00" }
//   reminder: "2026-09-01T09:35:00+02:00"
//
// Need UTC instead? new Date(value).toISOString() converts losslessly.`;
}
