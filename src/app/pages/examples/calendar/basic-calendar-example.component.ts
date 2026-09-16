import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarViewType, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

@Component({
	selector: 'app-basic-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent],
	template: `
		<div class="example-controls">
			<label>
				<span>View:</span>
				<select (change)="onViewChange($event)">
					<option value="month">Month</option>
					<option value="week">Week</option>
					<option value="day">Day</option>
					<option value="year">Year</option>
				</select>
			</label>
		</div>
		<hub-calendar [locale]="locale()" [events]="events()" [view]="view()" [height]="600" (viewChange)="view.set($event)">
		</hub-calendar>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.example-controls {
			margin-bottom: 1rem;
			padding: 1rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 0.5rem;
		}
		.example-controls label {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
		.example-controls select {
			padding: 0.5rem;
			border-radius: 0.25rem;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
		}
	`
})
export class BasicCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	title = 'Calendar Views';
	description =
		'Basic calendar showing month, week, day, and year views. Today holds an all-day event and three timed ones, so every distinction the calendar makes is visible at once: the month grid gives a timed event its hour behind a dot, the week and day grids lift the all-day one into the strip above the hours and place the rest against the ruler at their real time. The 9:00 meeting and the 10:00 call overlap, so they split the column; the 13:00 lunch, which collides with neither, keeps the whole width.';

	view = signal<CalendarViewType>(CalendarViewType.MONTH);

	events = signal<CalendarEvent[]>([
		{
			id: '0',
			title: 'Office Closed',
			start: this.today(),
			allDay: true,
			cssClass: 'event-holiday'
		},
		{
			id: '1',
			title: 'Team Meeting',
			start: this.today(9),
			end: this.today(11),
			cssClass: 'event-meeting'
		},
		{
			id: '2',
			title: 'Client Call',
			start: this.today(10),
			end: this.today(12),
			cssClass: 'event-meeting'
		},
		{
			id: '3',
			title: 'Lunch Break',
			start: this.today(13),
			end: this.today(14),
			cssClass: 'event-personal'
		},
		{
			id: '4',
			title: 'Project Deadline',
			start: this.today(0, 1),
			allDay: true,
			cssClass: 'event-deadline'
		}
	]);

	/**
	 * Anchors the demo events to whole hours of the current day instead of to the moment the
	 * page happens to load: an hour grid is only legible when the bars land on the ruler's own
	 * lines, and a run late at night would otherwise push half the set into tomorrow.
	 * @param hour Hour of the day the event starts at.
	 * @param dayOffset Days from today, for an event that is not today's.
	 * @returns The corresponding local Date.
	 */
	private today(hour = 0, dayOffset = 0): Date {
		const date = new Date();
		date.setHours(hour, 0, 0, 0);
		date.setDate(date.getDate() + dayOffset);
		return date;
	}

	/**
	 * Updates the active calendar view from the select control value.
	 * @param event The change event from the view select element.
	 */
	onViewChange(event: Event): void {
		const select = event.target as HTMLSelectElement;
		this.view.set(select.value as CalendarViewType);
	}

	static readonly templateCode = `<!-- [height] sizes the calendar without a stylesheet, and without the
     trap that comes with one: a scoped \`hub-calendar { … }\` rule outranks the
     component's own :host, so a display slipped in beside the height unstacks
     the flex column the hour grid scrolls inside. -->
<hub-calendar
  [events]="events()"
  [view]="view()"
  [height]="600"
  (viewChange)="view.set($event)">
</hub-calendar>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubCalendarComponent, CalendarEvent, CalendarViewType } from 'ng-hub-ui-calendar';

@Component({
  selector: 'app-basic-calendar-example',
  standalone: true,
  imports: [HubCalendarComponent],
  template: \`
    <hub-calendar
      [events]="events()"
      [view]="view()"
      [height]="600"
      (viewChange)="view.set($event)">
    </hub-calendar>
  \`
})
export class BasicCalendarExampleComponent {
  view = signal<CalendarViewType>('month');
  
  events = signal<CalendarEvent[]>([
    { id: '0', title: 'Office Closed', start: this.today(), allDay: true },
    // These two overlap, so the week and day grids split the column between them.
    { id: '1', title: 'Team Meeting', start: this.today(9), end: this.today(11) },
    { id: '2', title: 'Client Call', start: this.today(10), end: this.today(12) },
    { id: '3', title: 'Lunch Break', start: this.today(13), end: this.today(14) },
    { id: '4', title: 'Project Deadline', start: this.today(0, 1), allDay: true }
  ]);

  /** Anchors an event to a whole hour of the current day, so it lands on a ruler line. */
  private today(hour = 0, dayOffset = 0): Date {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    date.setDate(date.getDate() + dayOffset);
    return date;
  }
}`;
}
