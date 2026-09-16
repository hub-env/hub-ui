import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

@Component({
	selector: 'app-drag-drop-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent],
	template: `
		<div class="drag-drop-demo">
			<p class="instructions">Drag events to move them to different days.</p>
			<hub-calendar [locale]="locale()" [events]="events()" (eventDrop)="onEventDrop($event)"> </hub-calendar>

			<div class="drop-log">
				<h4>Drop Log:</h4>
				@if (dropLog().length === 0) {
					<p class="empty">No drops yet. Try dragging an event!</p>
				}
				<ul>
					@for (log of dropLog(); track log) {
						<li>{{ log }}</li>
					}
				</ul>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.drag-drop-demo {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		.instructions {
			padding: 0.75rem 1rem;
			background: #e3f2fd;
			border-radius: 0.5rem;
			margin: 0;
		}
		.drop-log {
			padding: 1rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 0.5rem;
		}
		.drop-log h4 {
			margin: 0 0 0.5rem 0;
		}
		.drop-log ul {
			margin: 0;
			padding-left: 1.5rem;
		}
		.drop-log .empty {
			color: var(--hub-sys-text-muted, #6c757d);
			font-style: italic;
			margin: 0;
		}
	`
})
export class DragDropCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	title = 'Drag & Drop Events';
	description = 'Move events between days using drag and drop.';

	dropLog = signal<string[]>([]);

	events = signal<CalendarEvent[]>([
		{
			id: '1',
			title: 'Movable Meeting',
			start: new Date(),
			end: new Date(Date.now() + 2 * 60 * 60 * 1000)
		},
		{
			id: '2',
			title: 'Reschedule This',
			start: new Date(Date.now() + 24 * 60 * 60 * 1000),
			allDay: true
		},
		{
			id: '3',
			title: 'Flexible Task',
			start: new Date(Date.now() + 48 * 60 * 60 * 1000)
		}
	]);

	/**
	 * Logs an event drag-and-drop, recording the source and destination dates.
	 * @param event The drop payload with the moved event and its previous and new dates.
	 */
	onEventDrop(event: { event: CalendarEvent; newDate: Date; previousDate: Date }): void {
		const log = `"${event.event.title}" moved from ${event.previousDate.toLocaleDateString()} to ${event.newDate.toLocaleDateString()}`;
		this.dropLog.update((logs) => [log, ...logs.slice(0, 4)]);
	}

	static readonly templateCode = `<hub-calendar 
  [events]="events()"
  (eventDrop)="onEventDrop($event)">
</hub-calendar>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubCalendarComponent, CalendarEvent } from 'ng-hub-ui-calendar';

@Component({
  selector: 'app-drag-drop-calendar-example',
  standalone: true,
  imports: [HubCalendarComponent],
  template: \`
    <hub-calendar 
      [events]="events()"
      (eventDrop)="onEventDrop($event)">
    </hub-calendar>
  \`
})
export class DragDropCalendarExampleComponent {
  events = signal<CalendarEvent[]>([
    { id: '1', title: 'Movable Meeting', start: new Date() },
    { id: '2', title: 'Reschedule This', start: new Date(Date.now() + 24 * 60 * 60 * 1000) }
  ]);
  
  onEventDrop(event: { event: CalendarEvent; newDate: Date; previousDate: Date }): void {
    console.log(\`Moved "\${event.event.title}" to \${event.newDate.toLocaleDateString()}\`);
  }
}`;
}
