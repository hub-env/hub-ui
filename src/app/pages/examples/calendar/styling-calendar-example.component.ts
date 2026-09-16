import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * Calendar example with CSS variables customization.
 */
@Component({
	selector: 'app-styling-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent],
	templateUrl: './styling-calendar-example.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './styling-calendar-example.component.scss'
})
export class StylingCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	title = 'CSS Variables Theming';
	description = 'Customize calendar styles by overriding --hub-calendar-* variables.';

	events = signal<CalendarEvent[]>([
		{
			id: '1',
			title: 'Design Review',
			start: new Date(new Date().setHours(10, 0, 0, 0)),
			end: new Date(new Date().setHours(11, 0, 0, 0))
		},
		{
			id: '2',
			title: 'Client Call',
			start: new Date(new Date().setDate(new Date().getDate() + 1)),
			allDay: true
		},
		{
			id: '3',
			title: 'Roadmap Planning',
			start: new Date(new Date().setDate(new Date().getDate() + 2)),
			allDay: true
		}
	]);

	static readonly templateCode = `<div class="theme-preview">
  <p>
    This example customizes the calendar using <code>--hub-calendar-*</code> CSS variables.
  </p>
  <hub-calendar class="theme-sunset" [events]="events()" [height]="560"></hub-calendar>
</div>`;

	static readonly componentCode = `/* Example variables override */
hub-calendar.theme-sunset {
  --hub-calendar-bg: #1f1a17;
  --hub-calendar-header-bg: #2a211d;
  --hub-calendar-btn-active-bg: #ff9f4a;
  --hub-calendar-day-selected-bg: #6d4329;
  --hub-calendar-event-bg: #ff9f4a;
}`;
}
