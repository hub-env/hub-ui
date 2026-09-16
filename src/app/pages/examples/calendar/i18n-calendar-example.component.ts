import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarEvent, HubCalendarComponent } from 'ng-hub-ui-calendar';

/**
 * The calendar's own localization: `locale` drives every string it renders, and a dictionary
 * supplied through `provideHubTranslationAdapter()` overrides it when the application has one.
 *
 * Both switches are live here on purpose. Localization is the one thing a static screenshot
 * cannot demonstrate, and an example that only claimed it in prose let a real defect through —
 * the header buttons were hard-coded English while the weekday names came from the dictionary,
 * so a Spanish calendar rendered "Lun, Mar, Mié" underneath "Today / Month / Week".
 */
@Component({
	selector: 'app-i18n-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent],
	template: `
		<div class="i18n-demo">
			<div class="language-controls">
				<label>
					<span>Locale:</span>
					<select [value]="locale()" (change)="onLocaleChange($event)">
						<option value="en">English (bundled)</option>
						<option value="es">Español (bundled)</option>
						<option value="fr">Français (not bundled)</option>
					</select>
				</label>

				<label>
					<span>Week starts on:</span>
					<select [value]="weekStartsOn()" (change)="onWeekStartChange($event)">
						<option value="0">Sunday (US)</option>
						<option value="1">Monday (EU)</option>
					</select>
				</label>
			</div>

			<hub-calendar [events]="events()" [locale]="locale()" [weekStartsOn]="weekStartsOn()" />

			<div class="i18n-info">
				<h4>What moves with the locale</h4>
				<p>
					Weekday and month names, the <code>Today</code> shortcut and the view switcher all read from the same
					dictionary — chrome and data in one language, never half of each.
				</p>
				<p>
					<code>en</code> and <code>es</code> ship with the library. Pick <code>fr</code> to see the documented
					fallback: an unbundled locale resolves to English rather than rendering blanks or raw keys.
				</p>
				<p>
					To override the bundled strings, feed <code>HUBUI.CALENDAR.*</code> through
					<code>provideHubTranslationAdapter()</code>; the dictionary wins over <code>locale</code>, and the built-in
					entries remain the fallback.
				</p>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.i18n-demo {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		.language-controls {
			display: flex;
			flex-wrap: wrap;
			gap: 1.5rem;
			padding: 1rem;
			background: #e3f2fd;
			border-radius: 0.5rem;
		}
		.language-controls label {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
		.language-controls select {
			padding: 0.5rem;
			border-radius: 0.25rem;
			border: 1px solid #90caf9;
		}
		.i18n-info {
			padding: 1rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 0.5rem;
		}
		.i18n-info h4 {
			margin: 0 0 0.5rem 0;
		}
		.i18n-info p {
			margin: 0.25rem 0;
		}
		.i18n-info code {
			background: var(--hub-sys-state-hover-bg, #e9ecef);
			padding: 0.125rem 0.25rem;
			border-radius: 0.25rem;
			font-size: 0.875rem;
		}
	`
})
export class I18nCalendarExampleComponent {
	title = 'Internationalization (i18n)';
	description = 'Calendar labels, header buttons and week start following the selected locale.';

	locale = signal<string>('es');

	weekStartsOn = signal<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);

	events = signal<CalendarEvent[]>([
		{
			id: '1',
			title: 'International Meeting',
			start: new Date(),
			allDay: true
		}
	]);

	/**
	 * Switches the calendar's locale from the select control value.
	 * @param event The change event from the locale select element.
	 */
	onLocaleChange(event: Event): void {
		this.locale.set((event.target as HTMLSelectElement).value);
	}

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
  [locale]="locale()"
  [weekStartsOn]="weekStartsOn()" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubCalendarComponent, CalendarEvent } from 'ng-hub-ui-calendar';

@Component({
  selector: 'app-i18n-calendar-example',
  standalone: true,
  imports: [HubCalendarComponent],
  template: \`
    <hub-calendar
      [events]="events()"
      [locale]="locale()"
      [weekStartsOn]="weekStartsOn()" />
  \`
})
export class I18nCalendarExampleComponent {
  // 'en' and 'es' ship with the library; anything else falls back to English.
  locale = signal('es');
  weekStartsOn = signal<0 | 1 | 2 | 3 | 4 | 5 | 6>(1); // Monday (EU)
  events = signal<CalendarEvent[]>([]);
}

// To override the bundled strings application-wide, provide HUBUI.CALENDAR.*
// once in app.config.ts — the dictionary wins over \`locale\`:
//
// provideHubTranslationAdapter(() => ({
//   dictionary: transloco.selectTranslation('HUBUI'), namespace: 'HUBUI'
// }))`;
}
