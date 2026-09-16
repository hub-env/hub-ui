import { DatePipe } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
	CalendarEvent,
	HubCalendarDayCellTemplateDirective,
	HubCalendarEventTemplateDirective,
	HubCalendarComponent
} from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

@Component({
	selector: 'app-templates-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent, HubCalendarEventTemplateDirective, HubCalendarDayCellTemplateDirective, DatePipe],
	template: `
		<hub-calendar [locale]="locale()" [events]="events()">
			<!-- Custom Event Template -->
			<ng-template eventTpt let-event="event">
				<div class="custom-event" [class.event-important]="event.data?.important">
					<span class="event-icon">{{ event.data?.important ? '⭐' : '📅' }}</span>
					<span class="event-title">{{ event.title }}</span>
				</div>
			</ng-template>

			<!-- Custom Day Cell Template -->
			<ng-template dayCellTpt let-day="day">
				<div class="custom-day">
					<span class="day-number">{{ day.date | date: 'd' }}</span>
					@if (day.events?.length) {
						<span class="event-count">{{ day.events.length }} events</span>
					}
				</div>
			</ng-template>
		</hub-calendar>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.custom-event {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			padding: 0.25rem 0.5rem;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			border-radius: 0.25rem;
			font-size: 0.75rem;
		}
		.custom-event.event-important {
			background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		}
		.event-icon {
			font-size: 0.75rem;
		}
		.custom-day {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.25rem;
		}
		.day-number {
			font-weight: 600;
			font-size: 1.1rem;
		}
		.event-count {
			font-size: 0.625rem;
			color: var(--hub-sys-text-muted, #6c757d);
		}
	`
})
export class TemplatesCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	title = 'Custom Templates';
	description = 'Customize event and day cell rendering with templates.';

	events = signal<CalendarEvent[]>([
		{
			id: '1',
			title: 'Important Meeting',
			start: new Date(),
			data: { important: true }
		},
		{
			id: '2',
			title: 'Regular Task',
			start: new Date(),
			data: { important: false }
		},
		{
			id: '3',
			title: 'VIP Call',
			start: new Date(Date.now() + 24 * 60 * 60 * 1000),
			data: { important: true }
		}
	]);

	static readonly templateCode = `<hub-calendar [events]="events()">
  <!-- Custom Event Template -->
  <ng-template eventTpt let-event="event">
    <div class="custom-event" [class.event-important]="event.data?.important">
      <span class="event-icon">{{ event.data?.important ? '⭐' : '📅' }}</span>
      <span class="event-title">{{ event.title }}</span>
    </div>
  </ng-template>
  
  <!-- Custom Day Cell Template -->
  <ng-template dayCellTpt let-day="day">
    <div class="custom-day">
      <span class="day-number">{{ day.date | date:'d' }}</span>
      @if (day.events?.length) {
        <span class="event-count">{{ day.events.length }} events</span>
      }
    </div>
  </ng-template>
</hub-calendar>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HubCalendarComponent, CalendarEvent, HubCalendarEventTemplateDirective, HubCalendarDayCellTemplateDirective, CalendarDay } from 'ng-hub-ui-calendar';

@Component({
	selector: 'app-templates-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent, HubCalendarEventTemplateDirective, HubCalendarDayCellTemplateDirective, DatePipe],
  template: \`
    <hub-calendar [events]="events()">
      <ng-template eventTpt let-event="event">
        <div class="custom-event">
          {{ event.data?.important ? '⭐' : '📅' }} {{ event.title }}
        </div>
      </ng-template>
      
      <ng-template dayCellTpt let-day="day">
        <div class="custom-day">
          {{ day.date | date:'d' }}
        </div>
      </ng-template>
    </hub-calendar>
  \`
})
export class TemplatesCalendarExampleComponent {
  events = signal<CalendarEvent[]>([
    { id: '1', title: 'Important', start: new Date(), data: { important: true } },
    { id: '2', title: 'Regular', start: new Date(), data: { important: false } }
  ]);
}`;
}
