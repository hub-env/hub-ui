import { DatePipe } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarViewType, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

@Component({
	selector: 'app-navigation-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent, DatePipe],
	template: `
		<div class="navigation-demo">
			<p class="current-date">Current Date: {{ selectedDate() | date: 'fullDate' }}</p>
			<hub-calendar
				[locale]="locale()"
				[events]="events()"
				[(selectedDate)]="selectedDate"
				[(view)]="view"
				(dateChange)="onDateChange($event)"
			>
			</hub-calendar>
			<div class="event-log">
				<h4>Navigation Log:</h4>
				<ul>
					@for (log of navigationLog(); track log) {
						<li>{{ log }}</li>
					}
				</ul>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.navigation-demo {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		.current-date {
			padding: 0.75rem 1rem;
			background: #e3f2fd;
			border-radius: 0.5rem;
			font-weight: 500;
		}
		.event-log {
			padding: 1rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 0.5rem;
			max-height: 150px;
			overflow-y: auto;
		}
		.event-log h4 {
			margin: 0 0 0.5rem 0;
		}
		.event-log ul {
			margin: 0;
			padding-left: 1.5rem;
		}
	`
})
export class NavigationCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	title = 'Navigation';
	description = 'Navigate between periods with previous/next buttons and jump to today.';

	selectedDate = signal(new Date());
	view = signal<CalendarViewType>(CalendarViewType.MONTH);
	navigationLog = signal<string[]>([]);

	events = signal<CalendarEvent[]>([
		{
			id: '1',
			title: "Today's Event",
			start: new Date(),
			allDay: true
		}
	]);

	/**
	 * Logs each calendar navigation event, keeping only the most recent entries.
	 * @param date The date the calendar navigated to.
	 */
	onDateChange(date: Date): void {
		const log = `Navigated to: ${date.toLocaleDateString()}`;
		this.navigationLog.update((logs) => [log, ...logs.slice(0, 4)]);
	}

	static readonly templateCode = `<hub-calendar 
  [events]="events()" 
  [(selectedDate)]="selectedDate"
  [(view)]="view"
  (dateChange)="onDateChange($event)">
</hub-calendar>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HubCalendarComponent, CalendarEvent, CalendarViewType } from 'ng-hub-ui-calendar';

@Component({
	selector: 'app-navigation-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent, DatePipe],
  template: \`
    <p>Current Date: {{ selectedDate() | date:'fullDate' }}</p>
    <hub-calendar 
      [events]="events()" 
      [(selectedDate)]="selectedDate"
      [(view)]="view"
      (dateChange)="onDateChange($event)">
    </hub-calendar>
  \`
})
export class NavigationCalendarExampleComponent {
  selectedDate = signal(new Date());
  view = signal<CalendarViewType>('month');
  events = signal<CalendarEvent[]>([]);
  
  onDateChange(date: Date): void {
    console.log('Navigated to:', date);
  }
}`;
}
