import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarEvent, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * The presentation format axes, live.
 *
 * Every control here changes one axis and nothing else, which is the point: the header title, the
 * weekday headers, the hour ruler and the clock inside a chip are separate decisions, and the
 * defaults are what the calendar has always drawn. The vocabulary is the datepicker's, so an
 * application that already calls `provideHubForms()` states the same things the same way through
 * `provideHubCalendar()`.
 */
@Component({
	selector: 'app-calendar-formats-example',
	standalone: true,
	imports: [HubCalendarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="format-controls">
			<label>
				<span>hourFormat:</span>
				<select (change)="onHourFormat($event)">
					<option value="">locale decides</option>
					<option value="12">12</option>
					<option value="24">24</option>
				</select>
			</label>

			<label>
				<span>weekdayFormat:</span>
				<select [value]="weekdayFormat()" (change)="weekdayFormat.set($any($event.target).value)">
					<option value="short">short</option>
					<option value="narrow">narrow</option>
					<option value="long">long</option>
				</select>
			</label>

			<label>
				<span>monthFormat:</span>
				<select [value]="monthFormat()" (change)="monthFormat.set($any($event.target).value)">
					<option value="long">long</option>
					<option value="short">short</option>
				</select>
			</label>

			<label>
				<span>displayFormat:</span>
				<select (change)="onDisplayFormat($event)">
					<option value="">built-in</option>
					<option value="MMMM yyyy">pattern: MMMM yyyy</option>
					<option value="MMM ''yy">pattern: MMM ''yy</option>
				</select>
			</label>

			<label>
				<span>slotLabelFormat:</span>
				<select (change)="onSlotFormat($event)">
					<option value="">built-in (9:00)</option>
					<option value="HH:mm">pattern: HH:mm</option>
					<option value="h a">pattern: h a</option>
				</select>
			</label>
		</div>

		<hub-calendar
			[locale]="locale()"
			[events]="events()"
			[height]="520"
			[hourFormat]="hourFormat()"
			[weekdayFormat]="weekdayFormat()"
			[monthFormat]="monthFormat()"
			[displayFormat]="displayFormat()"
			[slotLabelFormat]="slotLabelFormat()"
		/>
	`,
	styles: `
		.format-controls {
			display: flex;
			flex-wrap: wrap;
			gap: 1rem;
			margin-bottom: 1rem;
			padding: 1rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 0.5rem;
		}
		.format-controls label {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
		.format-controls select {
			padding: 0.375rem;
			border-radius: 0.25rem;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
		}
	`
})
export class FormatsCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	title = 'Date and Time Formats';
	description =
		'Each axis is independent and each default is what the calendar has always drawn. hourFormat decides the clock everywhere at once — including the answer to whether a tooltip reads 9:00 or 9:00 AM — while displayFormat, slotLabelFormat, weekdayFormat and monthFormat each govern one surface. Every one of them takes Intl options, an Angular date pattern or a function, and every one can be set once for the whole application with provideHubCalendar().';

	protected readonly hourFormat = signal<'12' | '24' | undefined>(undefined);
	protected readonly weekdayFormat = signal<'short' | 'narrow' | 'long'>('short');
	protected readonly monthFormat = signal<'short' | 'long'>('long');
	protected readonly displayFormat = signal<string | undefined>(undefined);
	protected readonly slotLabelFormat = signal<string | undefined>(undefined);

	protected readonly events = signal<CalendarEvent[]>([
		{ id: '1', title: 'Company Offsite', start: this.at(0), allDay: true },
		{ id: '2', title: 'Team Sync', start: this.at(9), end: this.at(10) },
		{ id: '3', title: 'Client Call', start: this.at(13, 40), end: this.at(14, 30) },
		{ id: '4', title: 'Retro', start: this.at(17), end: this.at(18) }
	]);

	/**
	 * Anchors an event to a whole hour of today, so the demo lands on the ruler's own lines
	 * whatever time the page is opened.
	 * @param hour Hour of the day.
	 * @param minute Minutes past the hour.
	 * @returns The corresponding local Date.
	 */
	private at(hour: number, minute = 0): Date {
		const date = new Date();
		date.setHours(hour, minute, 0, 0);
		return date;
	}

	/** Reads the empty option back as `undefined`, which is what "let the locale decide" is. */
	protected onHourFormat(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this.hourFormat.set(value === '' ? undefined : (value as '12' | '24'));
	}

	protected onDisplayFormat(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this.displayFormat.set(value === '' ? undefined : value);
	}

	protected onSlotFormat(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this.slotLabelFormat.set(value === '' ? undefined : value);
	}

	static readonly templateCode = `<hub-calendar
  [events]="events()"
  [height]="520"

  <!-- one clock for the whole calendar: ruler, chips and tooltips -->
  hourFormat="24"

  <!-- Intl options, an Angular date pattern, or a function -->
  [displayFormat]="{ year: 'numeric', month: 'long' }"
  slotLabelFormat="HH:mm"
  weekdayFormat="narrow"
  monthFormat="short" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubCalendarComponent, CalendarEvent } from 'ng-hub-ui-calendar';

@Component({
  selector: 'app-calendar-formats-example',
  standalone: true,
  imports: [HubCalendarComponent],
  template: \`
    <hub-calendar [events]="events()" [height]="520" hourFormat="24" slotLabelFormat="HH:mm" />
  \`
})
export class FormatsCalendarExampleComponent {
  events = signal<CalendarEvent[]>([
    { id: '1', title: 'Company Offsite', start: new Date(), allDay: true },
    { id: '2', title: 'Team Sync', start: new Date() }
  ]);
}

// Or once, for every calendar in the application — the same shape provideHubForms()
// takes for <hub-datepicker>, with the same names for the same ideas:
//
// bootstrapApplication(App, {
//   providers: [
//     provideHubCalendar({
//       formats: { hourFormat: '24', weekdayFormat: 'narrow', monthFormat: 'short' }
//     })
//   ]
// });`;
}
