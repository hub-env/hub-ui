import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHistoryStore } from 'ng-hub-ui-history';
import { HistoryComponent } from './history.component';
import { BasicHistoryExampleComponent } from '../examples/history/basic-history-example.component';
import { NestedHistoryExampleComponent } from '../examples/history/nested-history-example.component';
import { ReactiveFormHistoryExampleComponent } from '../examples/history/reactive-form-history-example.component';
import { TransactionLimitsHistoryExampleComponent } from '../examples/history/transaction-limits-history-example.component';

/**
 * The history examples used to dress themselves with component-scoped rules and the page
 * used to smuggle an extra `id` past `FeatureExample` with a double cast. Neither breaks a
 * build, so both would come back unnoticed; this suite is what notices.
 *
 * It also holds the page to the package. Everything the page prints is hand-written data, so
 * nothing failed while it advertised branching timelines, a keyboard directive, an injectable
 * service and deep-frozen snapshots — none of which the library has ever exported — and filed
 * store functions as component inputs for a package that ships no component. The store, the
 * changelog and the eight dictionaries are the sources; these tests make the page answer to them.
 */

/** Walks up from the runner's working directory until the workspace file appears. */
const REPO_ROOT = (() => {
	let directory = process.cwd();
	while (!existsSync(`${directory}/angular.json`)) {
		const parent = dirname(directory);
		if (parent === directory) {
			throw new Error('repository root not found from ' + process.cwd());
		}
		directory = parent;
	}
	return directory;
})();

const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;

/** Reads a dotted translation key out of one of the documentation dictionaries. */
function lookup(dictionary: unknown, key: string): unknown {
	return key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], dictionary);
}

/** Asserts that every `DOCS.` key in the list is translated in all eight languages. */
function expectTranslated(keys: readonly string[]): void {
	expect(keys.length).toBeGreaterThan(0);
	for (const language of LANGUAGES) {
		const dictionary = JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`, 'utf8'));
		for (const key of keys) {
			expect(key.startsWith('DOCS.HISTORY.'), `${key} is a translation key`).toBe(true);
			expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
		}
	}
}

/** Reads the styles the compiler baked into a component definition. */
function compiledStyles(component: Type<unknown>): readonly string[] {
	const definition = (component as unknown as { ɵcmp?: { styles?: string[] } }).ɵcmp;
	if (!definition) {
		throw new Error('component definition not found; the class was never compiled');
	}
	return definition.styles ?? [];
}

/** Every member the store hands back, which is the whole runtime surface of the package. */
function storeMembers(): string[] {
	return Object.keys(createHistoryStore<{ id: string }, string>());
}

const EXAMPLES: ReadonlyArray<readonly [string, Type<unknown>]> = [
	['BasicHistoryExampleComponent', BasicHistoryExampleComponent],
	['NestedHistoryExampleComponent', NestedHistoryExampleComponent],
	['ReactiveFormHistoryExampleComponent', ReactiveFormHistoryExampleComponent],
	['TransactionLimitsHistoryExampleComponent', TransactionLimitsHistoryExampleComponent]
];

/** The whole public surface of `FeatureExample`; anything else needed a cast to get in. */
const FEATURE_EXAMPLE_KEYS = [
	'title',
	'description',
	'import',
	'template',
	'component',
	'additionalFiles',
	'styles',
	'previewComponent'
];

/** Builds the page outside a template, which is the only way to read `historyLibrary`. */
function buildPage(): HistoryComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new HistoryComponent());
	page.ngOnInit();
	return page;
}

describe('history documentation page', () => {
	it.each(EXAMPLES)('%s carries no component-scoped styles', (_name, component) => {
		expect(compiledStyles(component)).toEqual([]);
	});

	it('renders the state dump without padding it with template whitespace', () => {
		TestBed.configureTestingModule({ imports: [BasicHistoryExampleComponent] });
		const fixture = TestBed.createComponent(BasicHistoryExampleComponent);
		fixture.detectChanges();

		const dump = (fixture.nativeElement as HTMLElement).querySelector('pre')?.textContent ?? '';
		expect(dump.startsWith('{')).toBe(true);
		expect(dump.endsWith('}')).toBe(true);
	});

	it('describes every feature example with the fields FeatureExample declares', () => {
		const examples = buildPage().historyLibrary.functionalities.flatMap((feature) => feature.examples);

		expect(examples).toHaveLength(4);
		for (const example of examples) {
			expect(Object.keys(example).filter((key) => !FEATURE_EXAMPLE_KEYS.includes(key))).toEqual([]);
			expect(example.previewComponent).toBeDefined();
		}
	});

	it('files nothing under Inputs, Outputs or Templates for a package with no component', () => {
		const api = buildPage().historyLibrary.api;

		expect(api.inputs).toEqual([]);
		expect(api.outputs).toEqual([]);
		expect(api.templates).toEqual([]);
	});

	it('documents only members the store actually returns', () => {
		const members = storeMembers();
		const documented = buildPage().historyLibrary.api.methods ?? [];

		expect(documented.length).toBeGreaterThan(0);
		for (const method of documented) {
			if (method.name === 'createHistoryStore') {
				continue;
			}
			expect(method.name.startsWith('HistoryStore.'), `${method.name} is qualified`).toBe(true);
			expect(members, `${method.name} exists on the store`).toContain(method.name.slice('HistoryStore.'.length));
		}
	});

	it('writes every highlight card as a translated key that points at a documented feature', () => {
		const library = buildPage().historyLibrary;
		const featureTitles = library.functionalities.map((feature) => feature.title);
		const highlights = library.overview.highlights ?? [];

		expect(highlights.length).toBeGreaterThan(0);
		for (const highlight of highlights) {
			// A card only deep-links to its feature guide when both name the same key.
			expect(featureTitles, `${highlight.title} names a feature`).toContain(highlight.title);
		}
		expectTranslated(highlights.flatMap((highlight) => [highlight.title, highlight.description]));
	});

	it('titles and describes every feature example with a translated key', () => {
		const library = buildPage().historyLibrary;
		const examples = library.functionalities.flatMap((feature) => feature.examples);

		expectTranslated([
			...library.functionalities.flatMap((feature) => [feature.title, feature.description]),
			...examples.flatMap((example) => [example.title, example.description])
		]);
	});

	it('dates every release the way the library dates it', () => {
		const changelog = readFileSync(`${REPO_ROOT}/projects/history/CHANGELOG.md`, 'utf8');
		const released = new Map(
			[...changelog.matchAll(/^## \[?(\d+\.\d+\.\d+)\]? - (\d{4}-\d{2}-\d{2})\s*$/gm)].map(([, version, date]) => [
				version,
				date
			])
		);

		const printed = buildPage().historyLibrary.overview.changelog ?? [];
		expect(printed.length).toBeGreaterThan(0);
		for (const entry of printed) {
			expect(released.get(entry.version), `page entry for ${entry.version}`).toBe(entry.date);
		}
	});

	it.each(EXAMPLES)('%s publishes its template and its component code statically', (_name, component) => {
		const snippets = component as unknown as { templateCode?: string; componentCode?: string };

		expect(typeof snippets.templateCode).toBe('string');
		expect(snippets.templateCode?.trim().length).toBeGreaterThan(0);
		expect(typeof snippets.componentCode).toBe('string');
		expect(snippets.componentCode?.trim().length).toBeGreaterThan(0);
	});
});
