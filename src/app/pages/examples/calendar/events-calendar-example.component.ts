import { DatePipe } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CalendarDay, CalendarEvent, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

@Component({
	selector: 'app-events-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent, DatePipe],
	template: `
		<div class="events-demo">
			<hub-calendar
				[locale]="locale()"
				[events]="events()"
				[eventClass]="getEventClass"
				(eventClick)="onEventClick($event)"
				(dayClick)="onDayClick($event)"
			>
			</hub-calendar>

			<div class="event-info">
				@if (lastClickedEvent()) {
					<div class="clicked-event">
						<h4>Last Clicked Event:</h4>
						<p>
							<strong>{{ lastClickedEvent()?.title }}</strong>
						</p>
						<p>{{ lastClickedEvent()?.start | date: 'medium' }}</p>
					</div>
				}
				@if (lastClickedDay()) {
					<div class="clicked-day">
						<h4>Last Clicked Day:</h4>
						<p>{{ lastClickedDay()?.date | date: 'fullDate' }}</p>
						<p>{{ lastClickedDay()?.events?.length || 0 }} events</p>
					</div>
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.events-demo {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		.event-info {
			display: flex;
			gap: 1rem;
		}
		.clicked-event,
		.clicked-day {
			flex: 1;
			padding: 1rem;
			border-radius: 0.5rem;
		}
		.clicked-event {
			background: #e8f5e9;
		}
		.clicked-day {
			background: #fff3e0;
		}
		.clicked-event h4,
		.clicked-day h4 {
			margin: 0 0 0.5rem 0;
		}
		.clicked-event p,
		.clicked-day p {
			margin: 0.25rem 0;
		}
	`
})
export class EventsCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	title = 'Event Handling';
	description = 'Handle event clicks and day clicks with dynamic CSS classes.';

	lastClickedEvent = signal<CalendarEvent | null>(null);
	lastClickedDay = signal<CalendarDay | null>(null);

	events = signal<CalendarEvent[]>([
		{
			id: '1',
			title: 'Important Meeting',
			start: new Date(),
			end: new Date(Date.now() + 2 * 60 * 60 * 1000),
			data: { priority: 'high' }
		},
		{
			id: '2',
			title: 'Casual Lunch',
			start: new Date(Date.now() + 4 * 60 * 60 * 1000),
			data: { priority: 'low' }
		},
		{
			id: '3',
			title: 'Project Review',
			start: new Date(Date.now() + 24 * 60 * 60 * 1000),
			data: { priority: 'medium' }
		}
	]);

	/**
	 * Resolves the CSS class for an event based on its priority metadata.
	 * @param event The calendar event whose priority class is requested.
	 * @returns The CSS class corresponding to the event priority.
	 */
	getEventClass = (event: CalendarEvent): string => {
		const priority = event.data?.priority;
		if (priority === 'high') return 'event-priority-high';
		if (priority === 'medium') return 'event-priority-medium';
		return 'event-priority-low';
	};

	/**
	 * Stores the most recently clicked calendar event for display.
	 * @param event The calendar event that was clicked.
	 */
	onEventClick(event: CalendarEvent): void {
		this.lastClickedEvent.set(event);
	}

	/**
	 * Stores the most recently clicked calendar day for display.
	 * @param day The calendar day that was clicked.
	 */
	onDayClick(day: CalendarDay): void {
		this.lastClickedDay.set(day);
	}

	static readonly templateCode = `<hub-calendar 
  [events]="events()" 
  [eventClass]="getEventClass"
  (eventClick)="onEventClick($event)"
  (dayClick)="onDayClick($event)">
</hub-calendar>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HubCalendarComponent, CalendarEvent, CalendarDay } from 'ng-hub-ui-calendar';

@Component({
	selector: 'app-events-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent, DatePipe],
  template: \`
    <hub-calendar 
      [events]="events()" 
      [eventClass]="getEventClass"
      (eventClick)="onEventClick($event)"
      (dayClick)="onDayClick($event)">
    </hub-calendar>
  \`
})
export class EventsCalendarExampleComponent {
  events = signal<CalendarEvent[]>([
    { id: '1', title: 'Important Meeting', start: new Date(), data: { priority: 'high' } },
    { id: '2', title: 'Casual Lunch', start: new Date(), data: { priority: 'low' } }
  ]);
  
  getEventClass = (event: CalendarEvent): string => {
    const priority = event.data?.priority;
    if (priority === 'high') return 'event-priority-high';
    return 'event-priority-low';
  };
  
  onEventClick(event: CalendarEvent): void {
    console.log('Event clicked:', event);
  }
  
  onDayClick(day: CalendarDay): void {
    console.log('Day clicked:', day);
  }
}`;
}
