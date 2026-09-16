import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarViewType, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * Calendar example that validates long event content does not break the month grid layout.
 */
@Component({
	selector: 'app-event-overflow-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent],
	template: `
		<div class="overflow-example">
			<p class="overflow-example__description">
				This example uses very long event titles and descriptions to verify that overflowing content does not resize
				calendar columns or break the month grid layout.
			</p>

			<hub-calendar [locale]="locale()" [events]="events()" [view]="view()" [height]="560"></hub-calendar>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.overflow-example {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.overflow-example__description {
			margin: 0;
			color: #4b5563;
		}
	`
})
export class EventOverflowCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	/**
	 * Example title rendered by the documentation page.
	 */
	title = 'Event Content Overflow';

	/**
	 * Example description rendered by the documentation page.
	 */
	description = 'Long event content is truncated and the calendar grid keeps stable column widths.';

	/**
	 * Fixed month view to make the grid behavior easy to validate.
	 */
	view = signal<CalendarViewType>(CalendarViewType.MONTH);

	/**
	 * Events with intentionally oversized content (including long unbroken tokens).
	 */
	events = signal<CalendarEvent[]>([
		{
			id: 'overflow-1',
			title: 'LONG_EVENT_IDENTIFIER_WITHOUT_BREAKS_2026_RELEASE_READINESS_CHECKLIST_PHASE_ALPHA_001',
			start: new Date(new Date().setDate(new Date().getDate() + 1)),
			allDay: true
		},
		{
			id: 'overflow-2',
			title: 'Cross-team review with architecture, platform, QA, operations, and compliance stakeholders',
			description:
				'Detailed_notes_with_multiple_unbreakable_segments_to_force_overflow_behavior_and_verify_ellipsis_rendering_in_tight_cells',
			start: new Date(new Date().setDate(new Date().getDate() + 3)),
			allDay: true
		},
		{
			id: 'overflow-3',
			title: 'Customer workshop: scope alignment, backlog refinement, and technical constraints review',
			start: new Date(new Date().setDate(new Date().getDate() + 5)),
			allDay: true
		}
	]);

	/**
	 * Template code displayed in the docs code viewer.
	 */
	static readonly templateCode = `<hub-calendar [events]="events()" [view]="view()" [height]="560"></hub-calendar>`;

	/**
	 * Component code displayed in the docs code viewer.
	 */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubCalendarComponent, CalendarEvent, CalendarViewType } from 'ng-hub-ui-calendar';

@Component({
  selector: 'app-event-overflow-calendar-example',
  standalone: true,
  imports: [HubCalendarComponent],
  template: \`<hub-calendar [events]="events()" [view]="view()" [height]="560"></hub-calendar>\`
})
export class EventOverflowCalendarExampleComponent {
  view = signal<CalendarViewType>(CalendarViewType.MONTH);

  events = signal<CalendarEvent[]>([
    {
      id: 'overflow-1',
      title: 'LONG_EVENT_IDENTIFIER_WITHOUT_BREAKS_2026_RELEASE_READINESS_CHECKLIST_PHASE_ALPHA_001',
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      allDay: true
    }
  ]);
}`;
}
