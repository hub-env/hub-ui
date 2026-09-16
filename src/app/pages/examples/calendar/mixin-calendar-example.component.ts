import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarEvent, CalendarViewType, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * Live demo for the `hub-calendar-theme` SCSS mixin. The `.calendar-mixin-scope` block sets
 * the same `--hub-calendar-*` custom properties the mixin emits, so the rendered result
 * matches the SCSS shown alongside it in the docs. `--hub-calendar-accent` re-tones the
 * today/selected day and navigation buttons, `--hub-calendar-border-radius` rounds the grid,
 * and the event tokens tint the pills and make them fully rounded.
 */
@Component({
	selector: 'app-mixin-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.calendar-mixin-scope {
				--hub-calendar-accent: #7c3aed;
				--hub-calendar-border-radius: 0.75rem;
				--hub-calendar-event-bg: #7c3aed;
				--hub-calendar-event-border-radius: 999px;
			}
		</style>
		<div class="calendar-mixin-scope">
			<hub-calendar [locale]="locale()" [events]="events()" [view]="view()" [height]="460"></hub-calendar>
		</div>
	`,
	styles: []
})
export class MixinCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	/** Month grid so the themed accent, radius and event pills are all visible. */
	protected readonly view = signal<CalendarViewType>(CalendarViewType.MONTH);

	/** A couple of realistic events so the themed event pills render. */
	protected readonly events = signal<CalendarEvent[]>([
		{
			id: '1',
			title: 'Team Sync',
			start: new Date(),
			end: new Date(Date.now() + 60 * 60 * 1000)
		},
		{
			id: '2',
			title: 'Release',
			start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
			allDay: true
		}
	]);
}
