import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CalendarConfig, CalendarEvent, CalendarViewType, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * Builds a small, deterministic set of sample events anchored to the current
 * month so the live preview always shows populated day cells regardless of when
 * it is rendered. Using day-of-month offsets (rather than absolute dates) keeps
 * the demo meaningful across navigation and is safe during server-side rendering.
 * Three of them land on today, because that is the only day the week and day views
 * open on and the hour grid has nothing to show without it.
 *
 * @returns A canonical list of calendar events for the preview.
 */
function buildSampleEvents(): CalendarEvent[] {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const at = (day: number, hour: number): Date => new Date(year, month, day, hour, 0, 0, 0);

	const today = now.getDate();

	return [
		{ id: 1, title: 'Team Standup', start: at(3, 9), end: at(3, 10) },
		{ id: 2, title: 'Design Review', start: at(8, 14), end: at(8, 16) },
		{ id: 3, title: 'Sprint Planning', start: at(12, 11), end: at(12, 12) },
		{ id: 4, title: '1:1 with Manager', start: at(12, 15), end: at(12, 16) },
		{ id: 5, title: 'Product Demo', start: at(18, 10), end: at(18, 11) },
		{ id: 6, title: 'Release Window', start: at(24, 17), end: at(24, 19) },
		// The week and day views open on today, so the set that shows how events are placed
		// against the hour ruler — and how an overlapping pair splits the column — has to be
		// anchored there rather than to a fixed day of the month nobody may be looking at.
		{ id: 7, title: 'Kickoff', start: at(today, 9), end: at(today, 11) },
		{ id: 8, title: 'Vendor Call', start: at(today, 10), end: at(today, 12) },
		{ id: 9, title: 'Retro', start: at(today, 16), end: at(today, 17) }
	];
}

/**
 * Thin, SSR-safe preview wrapper for the playground.
 *
 * `HubCalendarComponent` exposes its boolean/numeric scheduling options through a
 * single object input (`config`), whereas the playground binds each control to a
 * flat, top-level `@Input`. This wrapper flattens those nested options into
 * individual inputs, recomposes them into a `CalendarConfig` via a `computed`, and
 * supplies a canonical event set so the calendar renders fully populated. It adds
 * no behaviour of its own beyond forwarding inputs.
 */
@Component({
	selector: 'app-calendar-playground-preview',
	standalone: true,
	imports: [HubCalendarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-calendar
			[events]="events"
			[view]="view()"
			[variant]="variant()"
			[weekStartsOn]="weekStartsOn()"
			[locale]="locale()"
			[height]="height()"
			[config]="config()"
		></hub-calendar>
	`
})
export class CalendarPlaygroundPreviewComponent {
	/** Initial view rendered by the calendar (month, week, day or year). */
	readonly view = input<CalendarViewType>(CalendarViewType.MONTH);

	/** Semantic accent re-basing `--hub-calendar-accent`. */
	readonly variant = input<string>('primary');

	/** First day of the week (0 = Sunday … 6 = Saturday). */
	readonly weekStartsOn = input<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);

	/** BCP-47-ish language code used for weekday and month labels. */
	readonly locale = input<string>('en');

	/**
	 * Height handed to the calendar. `auto` grows to the content instead of scrolling; a
	 * number is read as pixels.
	 */
	readonly height = input<number | string>(420);

	/** Whether the month view draws its leading week-number column. */
	readonly showWeekNumbers = input<boolean>(false);

	/** First hour shown in day/week time grids (0-23). */
	readonly dayStartHour = input<number>(8);

	/** Last hour shown in day/week time grids (1-24). */
	readonly dayEndHour = input<number>(20);

	/** Whether events can be dragged to a different day. */
	readonly dragAndDropEnabled = input<boolean>(true);

	/** Canonical sample events shown in every preview state. */
	protected readonly events: CalendarEvent[] = buildSampleEvents();

	/**
	 * Recomposes the flat scheduling inputs into the object shape the calendar
	 * expects. Re-evaluated automatically whenever any source input changes.
	 */
	protected readonly config = computed<CalendarConfig>(() => ({
		showWeekNumbers: this.showWeekNumbers(),
		dayStartHour: this.dayStartHour(),
		dayEndHour: this.dayEndHour(),
		dragAndDropEnabled: this.dragAndDropEnabled()
	}));
}

/**
 * Interactive playground definitions for the ng-hub-ui-calendar documentation page.
 *
 * The calendar is driven entirely through inputs (`view`, `variant`, `weekStartsOn`,
 * `locale`, `config`, `events`), so a single previewable component exposes the full set
 * of configurable options alongside its real `--hub-calendar-*` styling tokens.
 */
export const CALENDAR_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'calendar',
		title: 'Calendar',
		tag: 'hub-calendar',
		description:
			'Month, week, day and year views with localisation, configurable week start and time grid. Tweak the options and styling tokens to preview the calendar live.',
		component: CalendarPlaygroundPreviewComponent,
		controls: [
			{
				name: 'view',
				label: 'View',
				type: 'select',
				default: 'month',
				options: [
					{ label: 'month', value: 'month' },
					{ label: 'week', value: 'week' },
					{ label: 'day', value: 'day' },
					{ label: 'year', value: 'year' }
				]
			},
			{
				name: 'variant',
				label: 'Variant (accent)',
				type: 'select',
				default: 'primary',
				options: [
					{ label: 'primary', value: 'primary' },
					{ label: 'secondary', value: 'secondary' },
					{ label: 'success', value: 'success' },
					{ label: 'danger', value: 'danger' },
					{ label: 'warning', value: 'warning' },
					{ label: 'info', value: 'info' },
					{ label: 'neutral', value: 'neutral' },
					{ label: 'light', value: 'light' },
					{ label: 'dark', value: 'dark' }
				],
				description:
					'Re-bases --hub-calendar-accent: the today / selected day, the active view button and the event chips. Any other string is also accepted and read as --hub-sys-color-<variant>.'
			},
			{
				name: 'weekStartsOn',
				label: 'Week starts on',
				type: 'select',
				default: 1,
				options: [
					{ label: 'Sunday', value: 0 },
					{ label: 'Monday', value: 1 },
					{ label: 'Tuesday', value: 2 },
					{ label: 'Wednesday', value: 3 },
					{ label: 'Thursday', value: 4 },
					{ label: 'Friday', value: 5 },
					{ label: 'Saturday', value: 6 }
				]
			},
			{
				name: 'locale',
				label: 'Locale',
				type: 'select',
				default: 'en',
				options: [
					{ label: 'English (en)', value: 'en' },
					{ label: 'Español (es)', value: 'es' },
					{ label: 'Français (fr)', value: 'fr' },
					{ label: 'Deutsch (de)', value: 'de' }
				],
				description: 'Falls back to English when the language pack is unavailable.'
			},
			{
				name: 'height',
				label: 'Height',
				type: 'select',
				default: 420,
				options: [
					{ label: '320px', value: 320 },
					{ label: '420px', value: 420 },
					{ label: '600px', value: 600 },
					{ label: 'auto (grow, no scroll)', value: 'auto' },
					{ label: '60vh', value: '60vh' }
				],
				description:
					'Sizes the calendar without a stylesheet, which is the point: a scoped hub-calendar rule outranks the component\u2019s own layout and can unstack it. auto grows to the content and scrolls nothing.'
			},
			{
				name: 'showWeekNumbers',
				label: 'Show week numbers',
				type: 'boolean',
				default: false,
				description:
					'Adds a week-number column to the month view, numbered from the day the week starts on (ISO-8601 when that day is Monday).'
			},
			{
				name: 'dayStartHour',
				label: 'Day start hour',
				type: 'number',
				default: 8,
				min: 0,
				max: 23,
				step: 1,
				description: 'First hour shown in the day and week time grids.'
			},
			{
				name: 'dayEndHour',
				label: 'Day end hour',
				type: 'number',
				default: 20,
				min: 1,
				max: 24,
				step: 1,
				description: 'Last hour shown in the day and week time grids.'
			},
			{
				name: 'dragAndDropEnabled',
				label: 'Drag & drop',
				type: 'boolean',
				default: true,
				description: 'Allow events to be dragged onto a different day.'
			}
		],
		cssVariables: [
			{ name: '--hub-calendar-bg', label: 'Background', type: 'color', default: '#ffffff' },
			{ name: '--hub-calendar-color', label: 'Text color', type: 'color', default: '#1f2937' },
			{ name: '--hub-calendar-border-color', label: 'Border color', type: 'color', default: '#e5e7eb' },
			{ name: '--hub-calendar-border-radius', label: 'Border radius', type: 'text', default: '0.5rem' },
			{ name: '--hub-calendar-header-bg', label: 'Header background', type: 'color', default: '#f9fafb' },
			{ name: '--hub-calendar-primary', label: 'Primary accent', type: 'color', default: '#0d6efd' },
			{ name: '--hub-calendar-muted', label: 'Muted text', type: 'color', default: '#6b7280' },
			{ name: '--hub-calendar-day-min-height', label: 'Day cell min height', type: 'text', default: '80px' },
			{
				name: '--hub-calendar-day-today-bg',
				label: 'Today background',
				type: 'color',
				default: '#edf4ff',
				description: 'Derived from the accent by default (8% of --hub-calendar-accent over the calendar background).'
			},
			{
				name: '--hub-calendar-day-selected-bg',
				label: 'Selected day background',
				type: 'color',
				default: '#e4efff',
				description: 'Defaults to --hub-calendar-accent-subtle, itself derived from the accent.'
			},
			{ name: '--hub-calendar-day-weekend-bg', label: 'Weekend background', type: 'color', default: '#fafafa' },
			{ name: '--hub-calendar-day-hover-bg', label: 'Day hover background', type: 'color', default: '#f3f4f6' },
			{ name: '--hub-calendar-event-bg', label: 'Event background', type: 'color', default: '#0d6efd' },
			{ name: '--hub-calendar-event-color', label: 'Event text', type: 'color', default: '#ffffff' },
			{ name: '--hub-calendar-event-border-radius', label: 'Event radius', type: 'text', default: '0.25rem' },
			{ name: '--hub-calendar-event-font-size', label: 'Event font size', type: 'text', default: '0.75rem' },
			{
				name: '--hub-calendar-hour-height',
				label: 'Hour row height',
				type: 'text',
				default: '60px',
				description:
					'Height of one hour in the week and day grids, and the unit their events are measured in — the bands re-scale with the ruler.'
			},
			{
				name: '--hub-calendar-event-min-height',
				label: 'Event min height',
				type: 'text',
				default: '1.5rem',
				description: 'Floor under a very short event, so it stays legible without its top edge misstating the start.'
			},
			{ name: '--hub-calendar-btn-active-bg', label: 'Active button background', type: 'color', default: '#0d6efd' },
			{ name: '--hub-calendar-btn-active-color', label: 'Active button text', type: 'color', default: '#ffffff' },
			{ name: '--hub-calendar-btn-hover-bg', label: 'Button hover background', type: 'color', default: '#f3f4f6' }
		]
	}
];
