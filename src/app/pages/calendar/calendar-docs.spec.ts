import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { HubCalendarComponent } from 'ng-hub-ui-calendar';
import { CalendarComponent } from './calendar.component';

/**
 * The calendar page drifted far enough from the library that it advertised event resizing,
 * multi-resource columns, a "+N more" popover and timezone support, none of which exist, and
 * its changelog stopped two releases short while listing a version the library never cut.
 * Prose cannot be diffed, so these specs pin the parts that can: the API tables against the
 * component's own metadata, the changelog against `CHANGELOG.md`, and every translation key
 * the page emits against all eight dictionaries.
 */

const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;

/** Angular records the declared inputs/outputs on the component definition. */
interface ComponentDef {
	inputs: Record<string, unknown>;
	outputs: Record<string, unknown>;
}

const def = (HubCalendarComponent as unknown as { ɵcmp: ComponentDef }).ɵcmp;

/**
 * Builds the page instance the way the router would, without rendering the shared library
 * page (which would drag in the whole documentation shell).
 */
function buildPage(): CalendarComponent {
	const page = TestBed.runInInjectionContext(() => new CalendarComponent());
	page.ngOnInit();
	return page;
}

/** Released version headings of the library changelog, newest first. `Unreleased` is skipped. */
function releasedVersions(): { version: string; date: string }[] {
	const changelog = readFileSync('projects/calendar/CHANGELOG.md', 'utf8');
	return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)].map((m) => ({
		version: m[1],
		date: m[2]
	}));
}

/** Compares two `major.minor.patch` strings numerically. */
function compareVersions(a: string, b: string): number {
	const pa = a.split('.').map(Number);
	const pb = b.split('.').map(Number);
	return pa[0] - pb[0] || pa[1] - pb[1] || pa[2] - pb[2];
}

/** Resolves a dotted translation key against a parsed dictionary. */
function lookup(dictionary: unknown, key: string): unknown {
	return key.split('.').reduce<any>((node, segment) => (node == null ? undefined : node[segment]), dictionary);
}

describe('calendar documentation page', () => {
	describe('API tables', () => {
		it('lists every input the component declares, and no other', () => {
			const documented = buildPage().calendarLibrary.api.inputs.map((input) => input.name);

			expect(documented.slice().sort()).toEqual(Object.keys(def.inputs).sort());
		});

		it('lists every output the component declares, and no other', () => {
			const documented = buildPage().calendarLibrary.api.outputs.map((output) => output.name);

			expect(documented.slice().sort()).toEqual(Object.keys(def.outputs).sort());
		});
	});

	describe('changelog', () => {
		it('reaches the newest released version of the library', () => {
			const page = buildPage().calendarLibrary.overview.changelog;

			expect(page[0].version).toBe(releasedVersions()[0].version);
		});

		it('carries every released version, with its release date', () => {
			const page = buildPage().calendarLibrary.overview.changelog;
			const onPage = new Map(page.map((entry) => [entry.version, entry.date]));

			for (const released of releasedVersions()) {
				expect(onPage.get(released.version)).toBe(released.date);
			}
		});

		it('invents no version the library never released', () => {
			const page = buildPage().calendarLibrary.overview.changelog;
			const released = new Set(releasedVersions().map((entry) => entry.version));

			expect(page.filter((entry) => !released.has(entry.version))).toEqual([]);
		});

		it('runs newest first', () => {
			const versions = buildPage().calendarLibrary.overview.changelog.map((entry) => entry.version);

			for (let i = 1; i < versions.length; i++) {
				expect(compareVersions(versions[i - 1], versions[i])).toBeGreaterThan(0);
			}
		});
	});

	describe('overview highlights', () => {
		/**
		 * Each of these named a capability the page used to promise and the library has never had.
		 * They are cheap to reintroduce by copying a competitor's feature list, and expensive for a
		 * reader who builds on the promise, so they stay pinned.
		 */
		it.each(['resiz', 'timezone', 'popover', 'resource'])('claims no %s support', (absent) => {
			const highlights = buildPage().calendarLibrary.overview.highlights ?? [];
			const offenders = highlights.filter((highlight) =>
				`${highlight.title} ${highlight.description}`.toLowerCase().includes(absent)
			);

			expect(offenders).toEqual([]);
		});
	});

	describe('translation keys', () => {
		const dictionaries = LANGUAGES.map((language) => ({
			language,
			catalogue: JSON.parse(readFileSync(`src/app/i18n/docs/${language}.json`, 'utf8'))
		}));

		it.each(dictionaries)('$language defines every key the page references', ({ catalogue }) => {
			const library = buildPage().calendarLibrary;
			const keys = [
				...library.api.inputs.map((input) => input.description),
				...library.api.outputs.map((output) => output.description),
				...library.api.templates.map((template) => template.description),
				...library.functionalities.flatMap((group) => [group.title, group.description])
			].filter((key): key is string => typeof key === 'string' && key.startsWith('DOCS.'));

			expect(keys.length).toBeGreaterThan(0);
			expect(keys.filter((key) => lookup(catalogue, key) === undefined)).toEqual([]);
		});
	});
});
