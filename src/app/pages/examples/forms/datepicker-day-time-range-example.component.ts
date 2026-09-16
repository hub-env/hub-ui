import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubDatepickerComponent } from 'ng-hub-ui-forms';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * `mode="day-time-range"` — one day, two times within it.
 *
 * Booking a meeting room is not two free instants; it is the day, from 09:00 to 11:00. `range`
 * cannot say that: its two ends are free to land on different days, so a product that needs a
 * same-day span ends up bolting a validator on top and rejecting the impossible one after the
 * user has already expressed it.
 *
 * The two pickers are shown side by side because the difference is only visible in contrast.
 * Take both to 22:00 – 06:00 and watch the emitted values: the range picker will happily carry
 * the end into the following morning, and the day-time-range picker simply cannot.
 */
@Component({
	selector: 'app-forms-datepicker-day-time-range-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubDatepickerComponent, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 46rem;">
			<div style="display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
				<hub-datepicker
					[locale]="locale()"
					formControlName="meeting"
					mode="day-time-range"
					granularity="minute"
					[minuteStep]="15"
					label="Meeting room"
					placeholder="Day, from – to"
					[min]="today"
					formText="One day, two times — never crosses midnight."
				/>

				<hub-datepicker
					[locale]="locale()"
					formControlName="stay"
					mode="range"
					granularity="minute"
					[minuteStep]="15"
					label="Stay (free range)"
					placeholder="From – to"
					[min]="today"
					formText="Two instants — the ends may fall on different days."
				/>
			</div>

			<div
				style="display: grid; gap: 0.35rem; padding: 0.75rem 1rem; border-radius: 0.5rem; background: var(--hub-ref-color-gray-100, #f8f9fa);"
			>
				<strong style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Emitted value</strong>
				<code style="font-size: 0.8rem; word-break: break-all;">{{ form.value | json }}</code>
				<span style="font-size: 0.8rem;">
					meeting spans <strong>{{ span(form.value.meeting) }}</strong> · stay spans
					<strong>{{ span(form.value.stay) }}</strong>
				</span>
			</div>
		</form>
	`
})
export class FormsDatepickerDayTimeRangeExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	readonly today = new Date();

	readonly form = new FormGroup({
		// Same shape as a plain range — what the mode adds is that both ends share a day.
		meeting: new FormControl<{ start: string | null; end: string | null } | null>(null),
		stay: new FormControl<{ start: string | null; end: string | null } | null>(null)
	});

	/**
	 * Describes how many calendar days a span touches, which is the whole point of the mode and
	 * the one thing the raw JSON above does not make obvious at a glance.
	 *
	 * @param value - The emitted range, or null when nothing is picked yet.
	 * @returns A short human reading of the span's day coverage.
	 */
	protected span(value: { start: string | null; end: string | null } | null | undefined): string {
		if (!value?.start || !value?.end) {
			return '—';
		}

		const start = new Date(value.start);
		const end = new Date(value.end);

		return start.toDateString() === end.toDateString() ? 'one day' : 'two days';
	}

	static readonly templateCode = `<!-- one day and two times within it: a room, a slot, a shift -->
<hub-datepicker
  formControlName="meeting"
  mode="day-time-range"
  granularity="minute"
  [minuteStep]="15"
  label="Meeting room"
  placeholder="Day, from – to"
  [min]="today" />

<!-- the same value shape, but each end is free to land on a different day -->
<hub-datepicker
  formControlName="stay"
  mode="range"
  granularity="minute"
  label="Stay"
  [min]="today" />`;

	static readonly componentCode = `readonly today = new Date();

// day-time-range emits the SAME shape as range — a { start, end } pair — so
// serialization, min/max, valueFormat and any back end that already takes a
// span need no change at all.
readonly form = new FormGroup({
  meeting: new FormControl<{ start: string | null; end: string | null } | null>(null),
  stay: new FormControl<{ start: string | null; end: string | null } | null>(null)
});

// What the mode adds is the guarantee, not the shape:
//
//   meeting: { start: "2026-09-01T09:00:00+02:00",
//              end:   "2026-09-01T11:00:00+02:00" }   <- always the same day
//
// It is enforced by a control that cannot express anything else, rather than by
// a validator that rejects the span after the user has already built it. One
// click on the day settles both ends; the two time strips carry the rest.
//
// The mode implies a time, so a granularity coarser than 'hour' is raised to it,
// and a stored span that crosses midnight is pulled onto the start's day.`;
}
