import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CalendarConfig, CalendarEvent, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

@Component({
	selector: 'app-configuration-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent],
	template: `
		<div class="config-demo">
			<div class="config-controls">
				<label>
					<span>Week starts on:</span>
					<select (change)="onWeekStartChange($event)">
						<option value="0">Sunday</option>
						<option value="1" selected>Monday</option>
						<option value="6">Saturday</option>
					</select>
				</label>
			</div>

			<hub-calendar [locale]="locale()" [events]="events()" [weekStartsOn]="weekStartsOn()" [config]="config()">
			</hub-calendar>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.config-demo {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		.config-controls {
			display: flex;
			gap: 1.5rem;
			padding: 1rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 0.5rem;
			flex-wrap: wrap;
		}
		.config-controls label {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
		.config-controls select {
			padding: 0.5rem;
			border-radius: 0.25rem;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
		}
	`
})
export class ConfigurationCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	title = 'Calendar Configuration';
	description =
		'Configure the first day of the week and the month-view options. The week-number column is numbered from the day the week starts on, so changing the select renumbers it.';

	weekStartsOn = signal<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);

	config = signal<CalendarConfig>({
		showWeekNumbers: true,
		dayStartHour: 8,
		dayEndHour: 18
	});

	events = signal<CalendarEvent[]>([
		{
			id: '1',
			title: 'Morning Standup',
			start: new Date(new Date().setHours(9, 0, 0, 0)),
			end: new Date(new Date().setHours(9, 30, 0, 0))
		},
		{
			id: '2',
			title: 'Lunch Break',
			start: new Date(new Date().setHours(12, 0, 0, 0)),
			end: new Date(new Date().setHours(13, 0, 0, 0))
		}
	]);

	/**
	 * Updates the first day of the week from the select control value.
	 * @param event The change event from the week-start select element.
	 */
	onWeekStartChange(event: Event): void {
		const select = event.target as HTMLSelectElement;
		this.weekStartsOn.set(parseInt(select.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6);
	}

	static readonly templateCode = `<hub-calendar 
  [events]="events()"
  [weekStartsOn]="weekStartsOn()"
  [config]="config()">
</hub-calendar>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubCalendarComponent, CalendarEvent, CalendarConfig } from 'ng-hub-ui-calendar';

@Component({
  selector: 'app-configuration-calendar-example',
  standalone: true,
  imports: [HubCalendarComponent],
  template: \`
    <hub-calendar 
      [events]="events()"
      [weekStartsOn]="weekStartsOn()"
      [config]="config()">
    </hub-calendar>
  \`
})
export class ConfigurationCalendarExampleComponent {
  weekStartsOn = signal<0 | 1 | 2 | 3 | 4 | 5 | 6>(1); // Monday
  
  config = signal<CalendarConfig>({
    showWeekNumbers: true,
    dayStartHour: 8,
    dayEndHour: 18
  });
  
  events = signal<CalendarEvent[]>([]);
}`;
}
