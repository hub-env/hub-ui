import { Component, inject, OnInit, ChangeDetectionStrategy, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { CALENDAR_PLAYGROUND } from './calendar-playground';
import { BasicCalendarExampleComponent } from '../examples/calendar/basic-calendar-example.component';
import { NavigationCalendarExampleComponent } from '../examples/calendar/navigation-calendar-example.component';
import { EventsCalendarExampleComponent } from '../examples/calendar/events-calendar-example.component';
import { EventOverflowCalendarExampleComponent } from '../examples/calendar/event-overflow-calendar-example.component';
import { DragDropCalendarExampleComponent } from '../examples/calendar/drag-drop-calendar-example.component';
import { TemplatesCalendarExampleComponent } from '../examples/calendar/templates-calendar-example.component';
import { ConfigurationCalendarExampleComponent } from '../examples/calendar/configuration-calendar-example.component';
import { StylingCalendarExampleComponent } from '../examples/calendar/styling-calendar-example.component';
import { VariantCalendarExampleComponent } from '../examples/calendar/variant-calendar-example.component';
import { I18nCalendarExampleComponent } from '../examples/calendar/i18n-calendar-example.component';
import { MixinCalendarExampleComponent } from '../examples/calendar/mixin-calendar-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const CALENDAR_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'calendar-basic': BasicCalendarExampleComponent,
	'calendar-navigation': NavigationCalendarExampleComponent,
	'calendar-events': EventsCalendarExampleComponent,
	'calendar-event-overflow': EventOverflowCalendarExampleComponent,
	'calendar-drag-drop': DragDropCalendarExampleComponent,
	'calendar-templates': TemplatesCalendarExampleComponent,
	'calendar-configuration': ConfigurationCalendarExampleComponent,
	'calendar-styling': StylingCalendarExampleComponent,
	'calendar-variant': VariantCalendarExampleComponent,
	'calendar-i18n': I18nCalendarExampleComponent
};

/**
 * Main calendar library page component
 */
@Component({
	selector: 'app-calendar',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page [library]="calendarLibrary" [package]="'calendar'" [playground]="playgroundConfigs">
		</app-library-page>
	`
})
export class CalendarComponent implements OnInit {
	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = CALENDAR_PLAYGROUND;

	/**
	 * Complete calendar library data
	 */
	calendarLibrary: Library = {
		title: 'ng-hub-ui-calendar',
		description:
			'A flexible and powerful calendar component for Angular applications. Supports month, week, day, and year views with drag & drop, custom templates, and i18n.',
		overview: {
			text: 'This component provides a complete solution for calendar interfaces with support for event management, multiple views, and full customization.',
			highlights: [
				{
					icon: 'fa-solid fa-calendar-days',
					title: 'Month, Week, Day & Year Views',
					description:
						'Switch between a full-month grid, week and day time grids built from dayStartHour / dayEndHour, and a year overview of month cards. config.availableViews decides which of the four the switcher offers, and config.showWeekNumbers adds a week-number column numbered from the day the week starts on.'
				},
				{
					icon: 'fa-solid fa-bars-staggered',
					title: 'All-Day Events Have a Place, Not a Badge',
					description:
						'Week and day views open with a strip above the hour grid, labelled "all day" in the hour margin, where all-day events live. An event drawn there is an all-day event, so no icon and no tooltip has to say so. The month grid has no room for a strip, so it inverts the contrast instead: a timed event prints its start time behind a coloured dot, an all-day one keeps the filled bar.'
				},
				{
					icon: 'fa-solid fa-ruler-vertical',
					title: 'Events Sit At Their Hour',
					description:
						'In week and day views a timed event occupies the band its own clock gives it: the top follows start, the height follows the duration, and the band is cut to the part of the event the ruler shows. Events that overlap in time split the width of the column into equal side-by-side bands, so none is drawn over another. --hub-calendar-hour-height re-scales the ruler and the events with it.'
				},
				{
					icon: 'fa-solid fa-calendar-check',
					title: 'Typed Event Interactions',
					description:
						'Clicking an event or a day cell emits a typed CalendarEvent or CalendarDay. The calendar never mutates your list, so creating, editing and deleting stay in your own state, driven by those outputs.'
				},
				{
					icon: 'fa-solid fa-layer-group',
					title: 'Event & Day Cell Templates',
					description:
						'Take over the rendering of an event chip with the eventTpt template, or of an entire day cell with dayCellTpt. The built-in markup is the fallback, not a ceiling.'
				},
				{
					icon: 'fa-solid fa-arrows-left-right',
					title: 'Drag to Another Day',
					description:
						'Native HTML5 drag-and-drop moves an event onto another day in the month, week and day views and emits eventDrop with the previous and new dates. Pointer-only, and the drop lands on a day rather than a time slot.'
				},
				{
					icon: 'fa-solid fa-circle-dot',
					title: 'Event Overflow Indicator',
					description:
						'A month cell renders at most three events and summarises the rest behind a localized "+N more" label \u2014 hover it and it lists the day\u2019s whole agenda \u2014 the all-day event named, the timed ones under their hour, one per line, rather than leaving you to open the day. A chip whose title is clipped reveals the whole row, title and hour, in a tooltip. A timed event states its start time at the end of the chip behind a coloured dot, so the filled bars left standing are the all-day ones.'
				},
				{
					icon: 'fa-solid fa-clock',
					title: 'Formats You Decide, Named As The Datepicker Names Them',
					description:
						'Every date and time the calendar writes is an option \u2014 the header title, the weekday headers, the hour ruler, the hour a month chip prints and the clock in both tooltips \u2014 and every default is what the calendar has always drawn. displayFormat, timeDisplayFormat, eventTimeFormat, slotLabelFormat, weekdayFormat and monthFormat each govern one surface; hourFormat governs all the clocks at once, and left unset it means whatever the reader\u2019s language says. Each takes Intl options, an Angular date pattern or a function, and provideHubCalendar() states them once for the whole application. The vocabulary is <hub-datepicker>\u2019s on purpose: same names, same types, same resolution order.'
				},
				{
					icon: 'fa-solid fa-globe',
					title: 'Dictionary-Driven Localization',
					description:
						'Weekday, month, header and count labels all come from one dictionary. locale picks a bundled language (English and Spanish ship with the library) and a HUBUI.CALENDAR.* dictionary fed through provideHubTranslationAdapter() overrides it live.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'CSS Variable Theming',
					description:
						'Event colours, header backgrounds, grid borders and the today highlight are all CSS custom properties, re-based in one step by the variant accent or by the hub-calendar-theme() Sass mixin.'
				},
				{
					icon: 'fa-solid fa-universal-access',
					title: 'Keyboard & Screen Reader Support',
					description:
						'The month view is a WAI-ARIA grid with a roving tabindex: arrows, Home/End and PageUp/PageDown move the selected day, Enter/Space activate it, and the header title is an aria-live region that announces every period change.'
				}
			],
			changelog: [
				{
					version: '22.8.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								'BREAKING \u2014 the two template directives are renamed HubCalendarDayCellTemplateDirective and HubCalendarEventTemplateDirective. EventTemplateDirective is a name any application might pick for a directive of its own, and an unprefixed export takes it out of the consumer\u2019s hands. The prefix carries the library\u2019s own name as well, because Hub alone does not say enough: an event template is exactly the sort of thing several packages in this family will want to offer. The selectors, eventTpt and dayCellTpt, are untouched, so no template changes. Both old names stay exported as deprecated aliases resolving to the same classes and are removed in 23.0.0. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency, >=22.0.0. The stylesheet has read --hub-sys-* tokens for several releases and every read carries its own fallback, so nothing about the rendering changes; what was missing was the manifest saying so. A package manager could not warn that a ng-hub-ui-ds older than the --hub-ref-* / --hub-sys-* architecture would leave the calendar themed by its fallbacks, and a reader of the manifest had no way to learn that installing the token package is what turns the theme on.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'added',
							description:
								'Timed events are placed against the hour ruler in the week and day views. The ruler was drawn and read by nothing: every timed event was stacked from the top of its column in the order the caller supplied, so an 11:00 event sat exactly where 00:00 is and a two-hour meeting was the same height as a five-minute one. An event now owns the band its own clock gives it \u2014 the top follows start, the height follows the duration \u2014 cut to the part of it that falls inside the ruler, so an event that began yesterday starts at the top of today rather than above it. An event that declares no end is drawn one hour long, which is what FullCalendar assumes for the same case, and so is one whose end precedes its start. Three tokens size the result: --hub-calendar-hour-height (60px) is the height of one hour and the unit every band is measured in, so re-scaling it moves the events with the ruler; --hub-calendar-event-min-height (1.5rem) keeps a fifteen-minute event legible without inflating its duration, the top edge still marking the real start; and --hub-calendar-event-gutter (2px) is the gap between two events sharing a column. See BREAKING_CHANGES.md: every week and day view redraws.'
						},
						{
							type: 'added',
							description:
								'Events that overlap in time share the width of the day column. Two events at the same hour cannot both take the whole column, and drawing one over the other hides it. The rule is the greedy column packing FullCalendar, Google Calendar and Outlook Web all build on: events are grouped into clusters of overlap, each event takes the first column free at its start time, and every event of a cluster ends up 1 / columns wide. A pair at 09:00 becomes two halves and leaves an unrelated event at 17:00 at full width; a column freed by an event that has already ended is reused rather than doubling the count; two events that merely touch, one ending where the next starts, are not treated as in conflict; and on a tie the longer event takes the leftmost column so the short ones stack to its right. Two refinements of those calendars are deliberately left out, and said here so the absence is not read as an oversight: an event does not grow rightwards into columns nothing occupies while it runs, and the bands are not offset to show through one another. Both can be added later without changing anything a consumer depends on.'
						},
						{
							type: 'added',
							description:
								'getTimedEventPlacements(day) is public, and so is the CalendarEventPlacement interface it returns: one entry per drawable event, with offset and span in hours from the top of the ruler and left and right in percent of the day column. A consumer laying out an hour grid of its own can reuse the arithmetic instead of reimplementing it.'
						},
						{
							type: 'changed',
							description:
								'A timed event whose hours fall entirely outside config.dayStartHour and config.dayEndHour is no longer drawn. While the events were merely stacked, an hour the ruler did not reach made no difference to where the chip landed; now it does, and a ruler that stops at 18:00 has nowhere honest to put 23:00. The event is left out rather than pinned to an edge that would misstate its time, which is what FullCalendar does with slotMinTime and slotMaxTime. The default ruler covers the whole day, so this only reaches a calendar that bounds it \u2014 widen the window to bring the event back.'
						},
						{
							type: 'added',
							description:
								'config.showWeekNumbers draws the column it always promised. The option was declared, defaulted and documented — this page\u2019s own playground described the column it would add — and no line of the component read it, so switching it on changed nothing and left nothing to debug. Month view now renders a leading week-number column: a rowheader cell per week row under its own column header. The numbering generalizes ISO-8601 rather than hardcoding it, numbering a week within the year of its middle day, so a Sunday-first calendar gets numbers that agree with the rows they label instead of with a Monday grid it is not drawing. Off by default; the column width is the new --hub-calendar-week-number-width token.'
						},
						{
							type: 'added',
							description:
								'Two dictionary keys for the new column: weekAbbr, the short column header, and weekNumberLabel, the accessible name of a cell, carrying a {count} placeholder. Both ship filled in English and Spanish and are reachable from an application dictionary under HUBUI.CALENDAR.*; an unfilled key falls back to English rather than rendering blank, because a bare number announced on its own says nothing about what it counts. CalendarWeek.weekNumber is populated too — it was part of the public type and never filled in.'
						},
						{
							type: 'added',
							description:
								'CalendarMonth.shortName is populated, and the year view is typed by the public interface. The same defect one type further down: CalendarMonth is exported from the public API and documents four fields, but the year view assembled anonymous { date, name, eventCount } objects, so shortName was declared, documented as the name to use when space is limited, and written by nothing. It was the only reader the monthsShort dictionary entry ever had, which left that entry shipping filled in both bundled languages, listed in the CALENDAR_I18N docs as a translation a new language must supply, and read by no line of the component. The months signal is now typed CalendarMonth[] and fills all four fields, shortName through the same lookup as every other label, so it follows the locale input and an application dictionary alike. The built-in month card still prints the full name; what changes is that a consumer reading months to lay the year out in less room finally gets the short name the type promised.'
						},
						{
							type: 'added',
							description:
								'An all-day strip above the week and day grids. Both views now open with a row of their own above the hour ruler, separated by a rule and labelled "all day" in the same left margin the hours use, and all-day events are drawn there instead of in the hour columns. The position is the whole explanation: an event sitting in that row is an all-day event, which is why the chip carries no badge, no icon and no tooltip saying so — the arrangement FullCalendar, Google Calendar, Outlook Web, Kendo and Syncfusion all landed on. The strip is drawn whether or not the period holds an all-day event, so the label stays where the reader learned it and the hour grid does not shift by a row from one week to the next, and it sits outside the scrolling area so it does not slide away as the day is scrolled. Two new tokens size it: --hub-calendar-time-column-width and --hub-calendar-all-day-min-height.'
						},
						{
							type: 'changed',
							description:
								'CalendarEvent.allDay now decides something. The flag was declared, documented as displaying at the top of the day and week views, and shipped with a translated all-day label nothing ever rendered: an all-day event drew exactly like a timed one, wherever the caller had left it in the array. It now decides placement. In the week and day views the event moves into the all-day strip. In the month view, where a grid of stacked bars leaves no room for a strip, the contrast is made the other way round: a timed event prints its start time in front of the title behind a dot in the event colour and carries a hub-calendar__event--timed modifier, while an all-day event keeps the filled bar and states no time. All-day events still lead their day, still carry hub-calendar__event--all-day and still append the localized all-day label to their accessible name, which is the only way a distinction made of position and typography reaches a screen reader. The start time follows the locale input rather than the application LOCALE_ID, and is printed only on the day the event starts. See BREAKING_CHANGES.md — in the month view every timed chip changes appearance, not only the all-day ones.'
						},
						{
							type: 'fixed',
							description:
								'The --hub-calendar-* tokens could not be set from the application. The whole family was declared in a single :root, :host block, and the component uses emulated encapsulation: the build rewrote that into a :root half compiled to a selector matching nothing and a :host half landing on the hub-calendar element itself. A declaration on an element beats any value inherited from an ancestor whatever its specificity, so an application setting a token in its own :root saw nothing happen, and even the hub-calendar recipe both READMEs print lost to it. The defaults are now read where they are painted, as var(--token, default), so nothing is claimed on the host and a rule written anywhere above the calendar takes effect — the same fix applied to ng-hub-ui-action-sheet and ng-hub-ui-milestones. Every default keeps its full chain and the derived accent roles resolve at the point of use, so re-basing --hub-calendar-accent alone moves the today tint, the selected day and the chips with it. Rendering is unchanged; what changes is who wins. See BREAKING_CHANGES.md.'
						},
						{
							type: 'removed',
							description:
								'config.initialView, config.slotDuration and config.eventCreationEnabled are gone. All three were declared in CalendarConfig, given defaults and written up in both READMEs, and not one was read anywhere in the component: setting them did nothing, silently. They were withdrawn rather than implemented because each is a redesign and not an omission. slotDuration presumes a grid that snaps an event to a slot; the same release taught the week and day grids to position an event against the ruler, but at its exact time, so there is still no resolution for the value to change \u2014 bound the ruler with dayStartHour / dayEndHour and re-scale it with --hub-calendar-hour-height. eventCreationEnabled presumes creation affordances and an output the component does not have, and the calendar deliberately never mutates the events array. initialView would be a second source of truth for state the two-way view model already owns, with no way to tell an unbound binding from one explicitly set to month; bind view instead. See BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.6.4',
					date: '2026-09-06',
					changes: [
						{
							type: 'fixed',
							description:
								'locale stopped at the header. 22.6.1 moved the header buttons into the dictionary and left the rest behind: the month cell still overflowed into +2 more, a year-view card still read 3 events and announced that same count to a screen reader, and the week and day headings took their weekday and month names from DatePipe, which follows the application LOCALE_ID rather than the calendar locale. All four now resolve through the same lookup as the weekday and month names, and the two counts arrive as new dictionary keys, moreEvents and eventCount, each carrying a {count} placeholder so a locale can move the number or reword the label around it. English output is unchanged.'
						},
						{
							type: 'fixed',
							description:
								'config.weekStartsOn decided nothing. The weekStartsOn input documented itself as an override of the config field, but it was the only value any grid ever read, so an application that centralised its settings in a shared CalendarConfig still opened every calendar on Sunday. The documented precedence now holds: the input wins when it is bound, the config answers when it is not, and Sunday stays the default of last resort. To tell an unbound input from an explicit Sunday the input type is now 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined, which only matters to code that reads the signal directly; template bindings are unaffected.'
						},
						{
							type: 'fixed',
							description:
								'Four of the nine accents could not be re-pointed from a stylesheet. secondary, neutral, light and dark were treated as foreign variants, so the component wrote --hub-calendar-accent as an inline style on the host, which outranks any consumer rule, including the hub-calendar[data-variant] recipe the library itself documents. All nine canonical variants now resolve through the stylesheet. Rendering is unchanged; what changes is that a consumer rule finally takes effect. Custom variants keep their inline fallback, since no stylesheet rule backs them.'
						},
						{
							type: 'fixed',
							description:
								'BREAKING_CHANGES.md sent readers to a stylesheet path that no longer exists, filed the base.scss rename under 21.0.0 although it shipped in 22.0.0, and promised breaking changes in major versions, which this library cannot deliver: its major tracks the Angular major it targets, so a break arrives in a minor and that file is the only warning a reader gets. Each break now sits under the version that shipped it, with a migration that resolves.'
						},
						{
							type: 'fixed',
							description:
								'The README omitted selectedDateChange from its outputs table, leaving a reader who worked from the table alone no way to know that selectedDate has a two-way half. It also documented the translation dictionary as the top-level calendar.* namespace only, and the CALENDAR_I18N JSDoc said the same, while 22.6.0 made HUBUI.CALENDAR.* resolve first. Both now lead with HUBUI.CALENDAR.* and keep the legacy branch documented as the fallback.'
						},
						{
							type: 'fixed',
							description:
								'Changelog heading order. The 21.1.1 entry sat between 22.1.0 and 22.0.0, which makes the file unreadable as a history and unreliable as the source for the documentation site that mirrors it.'
						},
						{
							type: 'fixed',
							description:
								'The CSS variables reference called itself complete while two accent tokens were missing. --hub-calendar-accent-emphasis and --hub-calendar-accent-on are declared by the component and were announced in 22.2.0 as part of the accent family, yet the only file that catalogues the tokens listed neither, and the repo parity check cannot catch the omission because it exempts the accent slots. A reader taking the file at its word could not learn that the two roles are overridable, least of all -on, which decides whether text on the accent is readable. The table now covers all 44 declared tokens.'
						},
						{
							type: 'added',
							description:
								'FUNCTIONALITIES.md. Nine other libraries in the monorepo ship one, and the calendar had no single place showing what the component actually supports and how much of it a running example demonstrates. The table is written against the code, so the accessibility layer and the application-dictionary path are marked as supported but unexampled rather than implied to be covered.'
						},
						{
							type: 'changed',
							description:
								'The component now declares ChangeDetectionStrategy.OnPush. Its own JSDoc and the 22.6.0 entry both describe the calendar as running under OnPush, and every sibling library in the monorepo says so in its metadata, but this one never did. Nothing changes at runtime: Angular 22 already applies OnPush unless a component opts into Eager, and every value the template reads is a signal. What changes is that the source now states the contract instead of relying on the framework default staying where it is.'
						},
						{
							type: 'added',
							description:
								'A height input, so a fixed-size calendar needs no stylesheet. The calendar has always filled its container, and the only way to give it a size was a hub-calendar { height: … } rule \u2014 which works right up until someone writes display: block beside the height, as one naturally does. A scoped element selector outranks the component\u2019s own :host, so that display unstacks the flex column the internal scrolling is built on and the hour grid grows to its full day instead of scrolling. It had already happened in three examples on this site. [height] cannot be got wrong that way: a number is read as pixels, any other CSS length passes through, and auto grows to the content and scrolls nothing \u2014 the spelling and the meaning FullCalendar gives its own height option. Left unset, nothing changes. The input writes --hub-calendar-height on the host, so the token stays available for sizing every calendar at once from :root, and the instance still wins.'
						},
						{
							type: 'added',
							description:
								'The +N more chip shows the day\u2019s whole agenda. It named a number and nothing else, so the only way to find out what was behind it was to open the day. Hovering it now lists every event of that day \u2014 the three chips already on screen and the ones the label stands for \u2014 one per line. Every event, not only the hidden ones: a list of the leftovers has to be added by eye to what is drawn above it, and seeing the day at a glance is the whole reason to hover the label. The list reads as an agenda \u2014 an all-day event has no hour to file it under, so its line is named instead, with the localized all day label and the title, and a timed one goes under a bullet, its clock time and a colon: "All day: Office Closed / - 9:00: Team Meeting / - 13:40: Lunch Break". One all-day line per such event, so every line is one event; a day with none starts straight at the bullets. The heading is the dictionary\u2019s existing allDay key, the same word the week and day views print in the margin of their all-day strip, so it is already translated and cannot drift out of step with it. The hour is written with its minutes even where the chip abbreviates them away, and follows locale like every other label. Google Calendar answers the same question with a popover listing the rest; a tooltip is the modest version of that, and needs no overlay, no focus trap and no dismissal contract this component does not otherwise have. The same list is the chip\u2019s accessible name, because a hover tooltip is a pointer affordance and this chip is not focusable.'
						},
						{
							type: 'changed',
							description:
								'The header is three tracks, and the title is centred on the calendar. It was the middle child of a space-between flex row, so it was centred on whatever gap the navigation and the view switcher happened to leave between them; those two are never the same width, so it always leaned towards the narrower one and in a tight header it touched it. The two extremes now share the free space equally, so the middle track lands on the centre of the calendar with one view button or with four, and --hub-calendar-header-gap is the floor on the distance to either side.'
						},
						{
							type: 'changed',
							description:
								'The header stacks when the three pieces no longer fit on one row. Below 48rem of CALENDAR width \u2014 the calendar\u2019s own, asked with a container query, because this component often sits in a column far narrower than the window and a media query would answer about the window \u2014 the title takes a row of its own, still centred, and the two groups take the next one. That row wraps too, so a four-view switcher that will not fit beside the navigation drops below it rather than past the calendar\u2019s edge, and a button shortens its own label before anything is cut off by that edge. The month and the year are never clipped and never split: if September 2026 does not fit beside the buttons, it is the row that breaks, not the title.'
						},
						{
							type: 'changed',
							description:
								'Both header clusters are drawn as one joined control. The previous / today / next buttons and the view switcher were loose rows with a gap between them; they read as one control each now, the way an input group does \u2014 no gaps, one shared border instead of two stacked into a seam, and rounded corners only at the two ends. The radii are logical, so a right-to-left calendar rounds the end the reader sees as last with no mirrored rule, and the active button and the focused one are lifted above the neighbour that would otherwise draw its border over theirs.'
						},
						{
							type: 'changed',
							description:
								'The month chip reads dot, title, hour, in smaller type, in a tighter cell. The hour used to come first, which pushed the title into whatever was left; Apple Calendar puts it at the far end of the row, and that is what the chip does now. The hour keeps its width whatever happens beside it, so the title is the only piece ever clipped \u2014 an all-day event has neither dot nor hour, so it is a title alone and the order leaves it no hole to fall into. Two defaults move with the shape: the chip font size drops one step, and the day-cell padding drops from --hub-ref-space-2 to --hub-ref-space-1, so a cell holds more. The hour has its own size, --hub-calendar-event-time-font-size (0.9em), relative on purpose. The order is deliberately not carried into the week and day views, where an event is placed against the ruler and its position already states the time. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'The month view keeps its weekday row in place while the grid scrolls. The row scrolled away with the weeks, which in a calendar given a fixed height meant the columns lost their headings as soon as the month was longer than the box. It is sticky inside the same scroller rather than lifted out of it, which is what keeps the seven headers on the seven columns they label.'
						},
						{
							type: 'fixed',
							description:
								'A timed chip shows its overflow tooltip again. The tooltip was measured on the chip, which worked while a chip was a plain block whose own box did the clipping and stopped working the moment the timed chip became a flex row: a flex child that clips its own text never lets the overflow reach its parent, so the chip reported no truncation and quietly retired its own tooltip. All-day chips, still plain blocks, kept theirs. Truncation is now measured on the title, the one box that actually clips, in every chip shape and in all three views \u2014 and what it announces is the whole row, title and hour, because the hour is exactly what a narrow cell squeezes out from beside the title. The tooltip belongs to the whole chip, which is one control and says so with role=button, and the chip\u2019s parts are inert to the pointer. Attaching the listener to the chip was not enough on its own: hit-testing resolves to whichever span the pointer happens to be over, and hovering the hour of a month chip produced nothing while the dot and the title beside it produced the label. Every point inside a chip now resolves to the chip; splitting the two is what hubOverflowTooltipMeasure is for, added to [hubOverflowTooltip] in ng-hub-ui-utils 22.13.0, which the calendar now requires. See BREAKING_CHANGES.md.'
						},
						{
							type: 'deprecated',
							description:
								'CalendarModule is deprecated and will be removed in 23.0.0. It imports and exports HubCalendarComponent, EventTemplateDirective and DayCellTemplateDirective, all three standalone and all three already exported from the entry point, and provides nothing of its own, so importing them directly is the whole migration. The class described itself as the path for legacy NgModule applications but carried no @deprecated tag, so neither an editor nor the build warned anyone. See BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.6.3',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								'The homepage in the manifest points at this library’s own documentation page rather than at the site root. It is the link a registry shows beside the package, and landing on a front page the reader then has to search is a worse answer than landing on the reference for the package they were already looking at. Metadata only.'
						}
					]
				},
				{
					version: '22.6.2',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'The package shipped without its licence notice. package.json declared MIT, but no LICENSE file travelled in the tarball — and MIT itself requires the copyright notice to be included in distributions. The notice ships now.'
						}
					]
				},
				{
					version: '22.6.1',
					date: '2026-08-16',
					changes: [
						{
							type: 'fixed',
							description:
								'The header buttons ignored the locale. Today was written into the template by hand and the view switcher title-cased the enum, while the weekday and month names came from the dictionary — so a calendar with locale="es" rendered "Lun, Mar, Mié" underneath "Today / Month / Week / Day / Year", with nothing a consumer could pass to reconcile them. All five labels now resolve through the same lookup as the day and month names, honouring the injected translation service first and falling back to the built-in dictionary. English is unchanged.'
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-08-14',
					changes: [
						{
							type: 'changed',
							description:
								'Labels now resolve HUBUI.CALENDAR.* before the legacy calendar.* branch. The collision-safe namespace lets an application dictionary feed the calendar through provideHubTranslationAdapter() without reserving a top-level calendar key. Existing calendar.* dictionaries keep working — the legacy branch is still the fallback.'
						},
						{
							type: 'changed',
							description:
								'Dictionary changes are now reactive. The component tracks translation-source emissions, so switching language refreshes the calendar labels instead of leaving the strings resolved at first render under OnPush.'
						},
						{
							type: 'added',
							description:
								'README documentation for the application-wide translation adapter (provideHubTranslationAdapter() from ng-hub-ui-utils).'
						}
					]
				},
				{
					version: '22.5.1',
					date: '2026-08-08',
					changes: [
						{
							type: 'fixed',
							description:
								'Documentation links now point at the canonical localized URLs. The README linked to https://hubui.dev/<path> with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.'
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'added',
							description:
								'WAI-ARIA grid semantics on the month view (grid/row/columnheader/gridcell, aria-selected, aria-current="date", localized full-date labels).'
						},
						{
							type: 'added',
							description:
								'Keyboard navigation on the month grid: roving tabindex, arrow keys by day/week, Home/End, PageUp/PageDown across months, Enter/Space to activate a day.'
						},
						{
							type: 'added',
							description:
								'Event chips and year-view month cards are keyboard-activatable buttons (role="button", tabindex, Enter/Space); labelled prev/next buttons and aria-pressed view switcher.'
						},
						{
							type: 'added',
							description: 'Starter unit test suite for the component (rendering, navigation, keyboard, ARIA).'
						},
						{
							type: 'fixed',
							description:
								'SSR-safe drag-end cleanup: the drag-over class sweep is scoped to the host element instead of the global document.'
						}
					]
				},
				{
					version: '22.4.1',
					date: '2026-07-26',
					changes: [
						{
							type: 'fixed',
							description:
								'Declared the real ng-hub-ui-utils peer range (>=22.6.0); the previous >=1.0.0 floor resolved to a utils major without HubOverflowTooltipDirective.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'changed',
							description:
								'Breaking (packaging): the theme mixin builds to dist/calendar/styles/... instead of dist/calendar/src/lib/styles/..., so @use ‘ng-hub-ui-calendar/styles’ resolves. Update any @use that reached into src/lib/styles.'
						}
					]
				},
				{
					version: '22.3.1',
					date: '2026-07-02',
					changes: [
						{
							type: 'fixed',
							description:
								'CSS variable fallbacks realigned to the ds light defaults (--hub-sys-color-primary, --hub-sys-state-hover-bg, --hub-sys-transition-base, --hub-ref-font-family-base). Fallbacks only apply when ng-hub-ui-ds is not loaded.'
						},
						{
							type: 'fixed',
							description:
								'The stale old-palette fallbacks for the today and selected day backgrounds (#eff6ff, #dbeafe) now mirror the accent-derived host defaults, so they follow a custom accent even when the host declarations are unset.'
						},
						{
							type: 'fixed',
							description:
								'The two bare day-cell / day-column hover transitions now match the ds base timing (background 0.2s ease-in-out).'
						},
						{
							type: 'fixed',
							description:
								'docs/css-variables-reference.md default values resynchronized with the actual code declarations.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-06-30',
					changes: [
						{
							type: 'added',
							description:
								'Tooltip on truncated event titles. Hovering an event whose title is clipped now reveals the full text through the hub-ui tooltip, applied automatically by ng-hub-ui-utils’ [hubOverflowTooltip] and only when the title actually overflows. Swappable with provideHubTooltip(); requires ng-hub-ui-utils >= 22.6.0 and the tooltip styles.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-26',
					changes: [
						{
							type: 'changed',
							description:
								'Accent system migrated to the open-set "local accent slot" pattern. variant re-bases a single --hub-calendar-accent slot and the role family is derived locally from it with color-mix(in oklch, ...), mirroring the ng-hub-ui-ds engine. The built-in variant list grew from five to the nine canonical accents, and a bare [data-variant] block lets any custom accent work at runtime with one CSS rule.'
						},
						{
							type: 'added',
							description:
								'New tokens --hub-calendar-accent-on (grayscale contrast flip driven by the accent’s own lightness) and --hub-calendar-accent-emphasis.'
						},
						{
							type: 'fixed',
							description:
								'Migrated the accent color-mix() derivations from srgb to oklch for perceptually uniform tints, matching ng-hub-ui-ds.'
						}
					]
				},
				{
					version: '22.1.2',
					date: '2026-06-26',
					changes: [
						{
							type: 'fixed',
							description:
								'Corrected the ng-hub-ui-utils peer dependency range to >=1.0.0. The previous caret range (^1.x) resolved to >=1 <2, which excluded the current ng-hub-ui-utils (22.x) and made the peer impossible to satisfy.'
						}
					]
				},
				{
					version: '22.1.1',
					date: '2026-06-25',
					changes: [
						{
							type: 'fixed',
							description:
								'Design-token consistency pass: inline fallback defaults aligned with the canonical ng-hub-ui-ds values, and hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) routed through their --hub-sys-* / --hub-ref-* tokens so they follow the active theme. No visual change when the ds tokens are loaded.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-06-24',
					changes: [
						{
							type: 'added',
							description:
								'New variant input on <hub-calendar> selecting a semantic accent: variant="success" recolours the today / selected day, the active view button and the event chips. Any other string is also accepted — the accent reads --hub-sys-color-<variant>. New tokens --hub-calendar-accent and --hub-calendar-accent-subtle.'
						},
						{
							type: 'added',
							description:
								'New hub-calendar-theme() Sass mixin — theme a calendar in one call: accent, surfaces, header, nav/view buttons, day cells and event chips. Every parameter is optional, so only the ones you pass are emitted as --hub-calendar-* overrides.'
						},
						{
							type: 'fixed',
							description:
								'The today cell background and the selected-day / active-button / event colours now derive from --hub-calendar-accent instead of being hard-wired to a fixed blue, so they follow the variant and theme overrides.'
						},
						{
							type: 'changed',
							description:
								'Breaking: the uniform padding shorthands (--hub-calendar-day-padding, --hub-calendar-header-padding, --hub-calendar-month-card-padding) were replaced by the canonical directional -padding-x / -padding-y tokens. No visual change; set the -x / -y tokens instead.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{
							type: 'changed',
							description: 'Aligned with Angular 22.'
						}
					]
				},
				{
					version: '21.1.1',
					date: '2026-03-19',
					changes: [
						{
							type: 'changed',
							description:
								'Co-locate the SCSS with the component via styleUrl; no manual @use import is needed any more.'
						},
						{
							type: 'changed',
							description:
								'Removed the hardcoded design-system token defaults from the stylesheet; they are expected from the host application.'
						},
						{
							type: 'fixed',
							description:
								'Fixed grid overflow: min-width: 0 on tracks, day cells and event containers, and full-width clipping on event elements.'
						}
					]
				},
				{
					version: '21.1.0',
					date: '2026-03-10',
					changes: [
						{
							type: 'changed',
							description:
								'Breaking: the global src/lib/styles/base.scss file was renamed to src/lib/styles/calendar.scss.'
						},
						{
							type: 'changed',
							description:
								'Added the host class .hub-calendar directly to the hub-calendar element for better encapsulation.'
						}
					]
				},
				{
					version: '21.0.0',
					date: '2026-03-09',
					changes: [
						{
							type: 'changed',
							description:
								'Breaking: the SCSS custom properties were consolidated and prefixed strictly as --hub-calendar-*. See BREAKING_CHANGES.md for the migration.'
						}
					]
				},
				{
					version: '19.0.3',
					date: '2026-02-09',
					changes: [
						{
							type: 'changed',
							description: 'Relax the Angular peer dependencies to >=19.0.0.'
						}
					]
				},
				{
					version: '19.0.2',
					date: '2026-02-05',
					changes: [
						{
							type: 'changed',
							description: 'Documentation updates and CI/CD workflow integration.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [],
			outputs: [],
			templates: [],
			cssVariables: MD_CSS_VARIABLES['calendar'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['calendar'],
			demos: [
				{
					title: 'Theming with hub-calendar-theme',
					previewComponent: MixinCalendarExampleComponent,
					code: `@use 'ng-hub-ui-calendar/styles' as calendar;

.calendar-mixin-scope {
	@include calendar.hub-calendar-theme(
		$accent: #7c3aed,
		$border-radius: 0.75rem,
		$event-bg: #7c3aed,
		$event-border-radius: 999px
	);
}`
				}
			]
		}
	};

	/**
	 * Angular lifecycle hook. Registers the examples and populates the
	 * functionalities and API sections of the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();
		this.populateApi();
	}

	/**
	 * Registers every calendar example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'calendar-basic',
				title: 'DOCS.CALENDAR.EXAMPLE.BASIC.TITLE',
				componentName: 'BasicCalendarExampleComponent',
				files: ['basic-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/basic-calendar-example.component').then((m) => m.BasicCalendarExampleComponent)
			},
			{
				id: 'calendar-navigation',
				title: 'DOCS.CALENDAR.EXAMPLE.NAVIGATION.TITLE',
				componentName: 'NavigationCalendarExampleComponent',
				files: ['navigation-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/navigation-calendar-example.component').then(
						(m) => m.NavigationCalendarExampleComponent
					)
			},
			{
				id: 'calendar-events',
				title: 'DOCS.CALENDAR.EXAMPLE.EVENTS.TITLE',
				componentName: 'EventsCalendarExampleComponent',
				files: ['events-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/events-calendar-example.component').then(
						(m) => m.EventsCalendarExampleComponent
					)
			},
			{
				id: 'calendar-event-overflow',
				title: 'DOCS.CALENDAR.EXAMPLE.EVENT_OVERFLOW.TITLE',
				componentName: 'EventOverflowCalendarExampleComponent',
				files: ['event-overflow-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/event-overflow-calendar-example.component').then(
						(m) => m.EventOverflowCalendarExampleComponent
					)
			},
			{
				id: 'calendar-drag-drop',
				title: 'DOCS.CALENDAR.EXAMPLE.DRAG_DROP.TITLE',
				componentName: 'DragDropCalendarExampleComponent',
				files: ['drag-drop-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/drag-drop-calendar-example.component').then(
						(m) => m.DragDropCalendarExampleComponent
					)
			},
			{
				id: 'calendar-templates',
				title: 'DOCS.CALENDAR.EXAMPLE.TEMPLATES.TITLE',
				componentName: 'TemplatesCalendarExampleComponent',
				files: ['templates-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/templates-calendar-example.component').then(
						(m) => m.TemplatesCalendarExampleComponent
					)
			},
			{
				id: 'calendar-formats',
				title: 'DOCS.CALENDAR.EXAMPLE.FORMATS.TITLE',
				componentName: 'FormatsCalendarExampleComponent',
				files: ['formats-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/formats-calendar-example.component').then(
						(m) => m.FormatsCalendarExampleComponent
					)
			},
			{
				id: 'calendar-configuration',
				title: 'DOCS.CALENDAR.EXAMPLE.CONFIGURATION.TITLE',
				componentName: 'ConfigurationCalendarExampleComponent',
				files: ['configuration-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/configuration-calendar-example.component').then(
						(m) => m.ConfigurationCalendarExampleComponent
					)
			},
			{
				id: 'calendar-styling',
				title: 'DOCS.CALENDAR.EXAMPLE.STYLING.TITLE',
				componentName: 'StylingCalendarExampleComponent',
				files: [
					'styling-calendar-example.component.ts',
					'styling-calendar-example.component.html',
					'styling-calendar-example.component.scss'
				],
				loader: () =>
					import('../examples/calendar/styling-calendar-example.component').then(
						(m) => m.StylingCalendarExampleComponent
					)
			},
			{
				id: 'calendar-variant',
				title: 'DOCS.CALENDAR.EXAMPLE.VARIANT.TITLE',
				componentName: 'VariantCalendarExampleComponent',
				files: ['variant-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/variant-calendar-example.component').then(
						(m) => m.VariantCalendarExampleComponent
					)
			},
			{
				id: 'calendar-i18n',
				title: 'DOCS.CALENDAR.EXAMPLE.I18N.TITLE',
				componentName: 'I18nCalendarExampleComponent',
				files: ['i18n-calendar-example.component.ts'],
				loader: () =>
					import('../examples/calendar/i18n-calendar-example.component').then((m) => m.I18nCalendarExampleComponent)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'calendar'
			});
		});
	}

	/**
	 * Populates the functionalities section, mapping each registered example to a
	 * live-preview component so the Overview "Feature guides" render interactively.
	 */
	private populateFunctionalities(): void {
		const examples = this._exampleRegistry.getAll().filter((ex) => ex.packagePath === 'calendar');

		const mapToFeature = (ex: any): FeatureExample => ({
			title: ex.title,
			description: ex.title,
			import: '',
			template: '',
			component: '',
			previewComponent: CALENDAR_PREVIEW_COMPONENTS[ex.id]
		});

		const pick = (...ids: string[]): FeatureExample[] =>
			ids
				.map((id) => examples.find((ex) => ex.id === id))
				.filter((ex): ex is NonNullable<typeof ex> => ex !== undefined)
				.map(mapToFeature);

		this.calendarLibrary.functionalities = [
			{
				title: 'DOCS.CALENDAR.FEATURE.VIEWS_NAVIGATION.TITLE',
				description: 'DOCS.CALENDAR.FEATURE.VIEWS_NAVIGATION.DESCRIPTION',
				examples: pick('calendar-basic', 'calendar-navigation')
			},
			{
				title: 'DOCS.CALENDAR.FEATURE.EVENTS.TITLE',
				description: 'DOCS.CALENDAR.FEATURE.EVENTS.DESCRIPTION',
				examples: pick('calendar-events', 'calendar-event-overflow', 'calendar-drag-drop')
			},
			{
				title: 'DOCS.CALENDAR.FEATURE.TEMPLATES.TITLE',
				description: 'DOCS.CALENDAR.FEATURE.TEMPLATES.DESCRIPTION',
				examples: pick('calendar-templates')
			},
			{
				title: 'DOCS.CALENDAR.FEATURE.CONFIGURATION.TITLE',
				description: 'DOCS.CALENDAR.FEATURE.CONFIGURATION.DESCRIPTION',
				examples: pick('calendar-configuration')
			},
			{
				title: 'DOCS.CALENDAR.FEATURE.STYLING_I18N.TITLE',
				description: 'DOCS.CALENDAR.FEATURE.STYLING_I18N.DESCRIPTION',
				examples: pick('calendar-styling', 'calendar-variant', 'calendar-i18n')
			}
		];
	}

	/**
	 * Populates the API section with inputs, outputs, and templates
	 */
	private populateApi(): void {
		this.calendarLibrary.api.inputs = [
			{
				name: 'variant',
				type: 'string',
				required: false,
				defaultValue: 'undefined',
				description: 'DOCS.CALENDAR.API.INPUT.VARIANT.DESCRIPTION'
			},
			{
				name: 'events',
				type: 'CalendarEvent<T>[]',
				required: false,
				defaultValue: '[]',
				description: 'DOCS.CALENDAR.API.INPUT.EVENTS.DESCRIPTION'
			},
			{
				name: 'view',
				type: "'month' | 'week' | 'day' | 'year'",
				required: false,
				defaultValue: "'month'",
				description: 'DOCS.CALENDAR.API.INPUT.VIEW.DESCRIPTION'
			},
			{
				name: 'selectedDate',
				type: 'Date',
				required: false,
				defaultValue: 'new Date()',
				description: 'DOCS.CALENDAR.API.INPUT.SELECTED_DATE.DESCRIPTION'
			},
			{
				name: 'config',
				type: 'CalendarConfig',
				required: false,
				defaultValue: '{}',
				description: 'DOCS.CALENDAR.API.INPUT.CONFIG.DESCRIPTION'
			},
			{
				name: 'eventClass',
				type: 'string | ((event: CalendarEvent) => string)',
				required: false,
				defaultValue: 'undefined',
				description: 'DOCS.CALENDAR.API.INPUT.EVENT_CLASS.DESCRIPTION'
			},
			{
				name: 'weekStartsOn',
				type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined',
				required: false,
				defaultValue: 'undefined',
				description: 'DOCS.CALENDAR.API.INPUT.WEEK_STARTS_ON.DESCRIPTION'
			},
			{
				name: 'locale',
				type: 'string',
				required: false,
				defaultValue: "'en'",
				description: 'DOCS.CALENDAR.API.INPUT.LOCALE.DESCRIPTION'
			},
			{
				name: 'height',
				type: 'number | string',
				required: false,
				defaultValue: 'undefined',
				description: 'DOCS.CALENDAR.API.INPUT.HEIGHT.DESCRIPTION'
			},
			{
				name: 'displayFormat',
				type: 'Intl.DateTimeFormatOptions | string | ((date: Date) => string)',
				required: false,
				defaultValue: 'undefined',
				description: 'DOCS.CALENDAR.API.INPUT.DISPLAY_FORMAT.DESCRIPTION'
			},
			{
				name: 'timeDisplayFormat',
				type: 'Intl.DateTimeFormatOptions',
				required: false,
				defaultValue: "{ hour: 'numeric', minute: '2-digit' }",
				description: 'DOCS.CALENDAR.API.INPUT.TIME_DISPLAY_FORMAT.DESCRIPTION'
			},
			{
				name: 'eventTimeFormat',
				type: 'Intl.DateTimeFormatOptions | string | ((date: Date) => string)',
				required: false,
				defaultValue: 'undefined',
				description: 'DOCS.CALENDAR.API.INPUT.EVENT_TIME_FORMAT.DESCRIPTION'
			},
			{
				name: 'slotLabelFormat',
				type: 'Intl.DateTimeFormatOptions | string | ((date: Date) => string)',
				required: false,
				defaultValue: 'undefined',
				description: 'DOCS.CALENDAR.API.INPUT.SLOT_LABEL_FORMAT.DESCRIPTION'
			},
			{
				name: 'hourFormat',
				type: "'12' | '24'",
				required: false,
				defaultValue: 'undefined',
				description: 'DOCS.CALENDAR.API.INPUT.HOUR_FORMAT.DESCRIPTION'
			},
			{
				name: 'weekdayFormat',
				type: "'short' | 'narrow' | 'long'",
				required: false,
				defaultValue: "'short'",
				description: 'DOCS.CALENDAR.API.INPUT.WEEKDAY_FORMAT.DESCRIPTION'
			},
			{
				name: 'monthFormat',
				type: "'short' | 'long'",
				required: false,
				defaultValue: "'long'",
				description: 'DOCS.CALENDAR.API.INPUT.MONTH_FORMAT.DESCRIPTION'
			}
		];

		this.calendarLibrary.api.outputs = [
			{
				name: 'eventClick',
				type: 'CalendarEvent<T>',
				required: false,
				description: 'DOCS.CALENDAR.API.OUTPUT.EVENT_CLICK.DESCRIPTION'
			},
			{
				name: 'dayClick',
				type: 'CalendarDay<T>',
				required: false,
				description: 'DOCS.CALENDAR.API.OUTPUT.DAY_CLICK.DESCRIPTION'
			},
			{
				name: 'eventDrop',
				type: '{ event: CalendarEvent<T>; newDate: Date; previousDate: Date }',
				required: false,
				description: 'DOCS.CALENDAR.API.OUTPUT.EVENT_DROP.DESCRIPTION'
			},
			{
				name: 'viewChange',
				type: 'CalendarViewType',
				required: false,
				description: 'DOCS.CALENDAR.API.OUTPUT.VIEW_CHANGE.DESCRIPTION'
			},
			{
				name: 'selectedDateChange',
				type: 'Date',
				required: false,
				description: 'DOCS.CALENDAR.API.OUTPUT.SELECTED_DATE_CHANGE.DESCRIPTION'
			},
			{
				name: 'dateChange',
				type: 'Date',
				required: false,
				description: 'DOCS.CALENDAR.API.OUTPUT.DATE_CHANGE.DESCRIPTION'
			}
		];

		this.calendarLibrary.api.templates = [
			{
				name: 'eventTpt',
				description: 'DOCS.CALENDAR.API.TEMPLATE.0.DESCRIPTION',
				example: '<ng-template eventTpt let-event="event">{{ event.title }}</ng-template>'
			},
			{
				name: 'dayCellTpt',
				description: 'DOCS.CALENDAR.API.TEMPLATE.1.DESCRIPTION',
				example: '<ng-template dayCellTpt let-day="day">{{ day.date | date }}</ng-template>'
			}
		];
	}
}
