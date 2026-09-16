import { provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HubCalendarComponent } from 'ng-hub-ui-calendar';
import { HubDatepickerComponent } from 'ng-hub-ui-forms';
import { BasicCalendarExampleComponent } from '../pages/examples/calendar/basic-calendar-example.component';
import { EventsCalendarExampleComponent } from '../pages/examples/calendar/events-calendar-example.component';
import { I18nCalendarExampleComponent } from '../pages/examples/calendar/i18n-calendar-example.component';
import { VariantCalendarExampleComponent } from '../pages/examples/calendar/variant-calendar-example.component';
import { FormsDatepickerGranularityExampleComponent } from '../pages/examples/forms/datepicker-granularity-example.component';
import { AppI18nService } from '../services/app-i18n.service';

/**
 * The examples follow the language switcher.
 *
 * A library component that formats dates takes the language as an input, and every example left it
 * at its default — so `/es/calendar/examples` laid a Spanish page out around an English calendar,
 * and `/ar/` flipped the whole layout and still said "SUN MON TUE". What is pinned here is that the
 * shell's language reaches the component inside the example, and that it keeps reaching it when the
 * reader switches: not that the wiring compiles, but that the component ends up holding the new
 * value and drawing with it.
 */
describe('examples follow the site language', () => {
	let i18n: AppI18nService;
	let documentDir: string | null;
	let documentLang: string | null;

	beforeEach(() => {
		// `setLang` stamps `dir` and `lang` on the document element, which outlives the fixture and
		// the worker's next spec. Left behind, an `[dir='ltr']` ancestor makes a descendant selector
		// anchored on a fixture match nodes the fixture does not contain.
		documentDir = document.documentElement.getAttribute('dir');
		documentLang = document.documentElement.getAttribute('lang');

		TestBed.configureTestingModule({
			providers: [provideRouter([]), provideZoneChangeDetection()]
		});
		i18n = TestBed.inject(AppI18nService);
		i18n.setLang('en', false);
	});

	afterEach(() => {
		restoreAttribute('dir', documentDir);
		restoreAttribute('lang', documentLang);
	});

	function restoreAttribute(name: string, value: string | null): void {
		if (value === null) {
			document.documentElement.removeAttribute(name);
			return;
		}
		document.documentElement.setAttribute(name, value);
	}

	/** Mounts an example and returns the `locale` its inner calendar is holding. */
	function calendarLocaleOf(type: unknown): { read: () => string; refresh: () => void } {
		const fixture = TestBed.createComponent(type as never);
		fixture.detectChanges();
		const calendar = fixture.debugElement.query(By.directive(HubCalendarComponent));
		expect(calendar).not.toBeNull();
		return {
			read: () => calendar.componentInstance.locale(),
			refresh: () => fixture.detectChanges()
		};
	}

	it('hands the shell language to the calendar of an example', () => {
		const locale = calendarLocaleOf(BasicCalendarExampleComponent);

		expect(locale.read()).toBe('en');
	});

	it('follows the switcher, which is the whole point', () => {
		const locale = calendarLocaleOf(BasicCalendarExampleComponent);

		i18n.setLang('es', false);
		locale.refresh();

		expect(locale.read()).toBe('es');
	});

	it('redraws in the new language rather than merely holding it', () => {
		const fixture = TestBed.createComponent(EventsCalendarExampleComponent);
		fixture.detectChanges();
		const weekdays = () =>
			[...(fixture.nativeElement as HTMLElement).querySelectorAll('.hub-calendar__weekday')].map((el) =>
				(el.textContent ?? '').trim()
			);

		expect(weekdays()[0]).toBe('Sun');

		i18n.setLang('es', false);
		fixture.detectChanges();

		// The defect as it was reported: a page in one language around a calendar in another.
		expect(weekdays()[0]).toBe('Dom');
	});

	it('reaches an example that was not written with language in mind', () => {
		const locale = calendarLocaleOf(VariantCalendarExampleComponent);

		i18n.setLang('es', false);
		locale.refresh();

		expect(locale.read()).toBe('es');
	});

	it('hands it to a datepicker too, which takes the same input', () => {
		const fixture = TestBed.createComponent(FormsDatepickerGranularityExampleComponent);
		fixture.detectChanges();
		const picker = fixture.debugElement.query(By.directive(HubDatepickerComponent));

		expect(picker).not.toBeNull();

		i18n.setLang('es', false);
		fixture.detectChanges();

		expect(picker.componentInstance.locale()).toBe('es');
	});

	it('leaves the i18n example to its own control, whose subject is the language', () => {
		const fixture = TestBed.createComponent(I18nCalendarExampleComponent);
		fixture.detectChanges();
		const calendar = fixture.debugElement.query(By.directive(HubCalendarComponent));

		// It ships with a locale select and a calendar bound to it; tying that to the switcher
		// would leave the reader a control that changes nothing.
		i18n.setLang('en', false);
		fixture.detectChanges();

		expect(calendar.componentInstance.locale()).toBe('es');
	});
});
