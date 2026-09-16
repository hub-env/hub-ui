import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { BasicCardSkeletonExampleComponent } from '../examples/skeleton/basic-card-skeleton-example.component';
import { CompactDslSkeletonExampleComponent } from '../examples/skeleton/compact-dsl-skeleton-example.component';
import { CompactVariantSkeletonExampleComponent } from '../examples/skeleton/compact-variant-skeleton-example.component';
import { CustomPresetSkeletonExampleComponent } from '../examples/skeleton/custom-preset-skeleton-example.component';
import { DashboardSkeletonExampleComponent } from '../examples/skeleton/dashboard-skeleton-example.component';
import { InlineTemplateSkeletonExampleComponent } from '../examples/skeleton/inline-template-skeleton-example.component';
import { PresetCatalogueSkeletonExampleComponent } from '../examples/skeleton/preset-catalogue-skeleton-example.component';
import { ResponsiveTableSkeletonExampleComponent } from '../examples/skeleton/responsive-table-skeleton-example.component';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { SkeletonComponent } from './skeleton.component';

/**
 * The skeleton page and its two READMEs are hand-written prose about a library that keeps
 * shipping: nothing breaks when a release lands or a packaging entry moves, so the page
 * quietly falls behind `CHANGELOG.md` and the READMEs keep teaching a superseded import
 * path. This suite reads the library's own files and makes the documentation answer to them.
 *
 * The page also used to introduce its examples by constructing them and reading English
 * literals off the instance, so a reader in any of the other seven languages got the copy in
 * English and any example reaching for `inject()` would have taken the page down with it.
 * Both ends are held here too: the copy is a translation key that resolves everywhere, and
 * the examples carry nothing the page would have to be built to read.
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

const LIBRARY = `${REPO_ROOT}/projects/skeleton`;
const READMES = ['README.md', 'README.es.md'] as const;
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;

/** Every example the page groups under a feature, paired with the class it previews. */
const EXAMPLES = [
	['skeleton-card-preset', BasicCardSkeletonExampleComponent],
	['skeleton-preset-catalogue', PresetCatalogueSkeletonExampleComponent],
	['skeleton-inline-template', InlineTemplateSkeletonExampleComponent],
	['skeleton-compact-dsl', CompactDslSkeletonExampleComponent],
	['skeleton-custom-preset', CustomPresetSkeletonExampleComponent],
	['skeleton-responsive-table', ResponsiveTableSkeletonExampleComponent],
	['skeleton-compact-variant', CompactVariantSkeletonExampleComponent],
	['skeleton-dashboard-composition', DashboardSkeletonExampleComponent]
] as const;

/**
 * Released versions as the CHANGELOG records them. The pre-22 releases are written without
 * brackets, so both spellings of the heading count.
 */
function releasedVersions(): { version: string; date: string }[] {
	const changelog = readFileSync(`${LIBRARY}/CHANGELOG.md`, 'utf8');
	return [...changelog.matchAll(/^## \[?(\d+\.\d+\.\d+)\]? - (\d{4}-\d{2}-\d{2})$/gm)].map(([, version, date]) => ({
		version,
		date
	}));
}

/** Builds the page outside a template, which is the only way to read `skeletonLibrary`. */
function buildPage(): SkeletonComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new SkeletonComponent());
	page.ngOnInit();
	return page;
}

/** Every example the page attached to a feature group, flattened. */
function featureExamples(page: SkeletonComponent) {
	return page.skeletonLibrary.functionalities.flatMap((feature) => feature.examples);
}

/** Resolves a dotted translation key against one parsed language file. */
function lookup(dictionary: unknown, key: string): unknown {
	return key.split('.').reduce<unknown>((node, segment) => {
		if (node && typeof node === 'object' && segment in node) {
			return (node as Record<string, unknown>)[segment];
		}
		return undefined;
	}, dictionary);
}

/** The eight parsed locale files, in the order the site offers them. */
function dictionaries(): { language: string; dictionary: unknown }[] {
	return LANGUAGES.map((language) => ({
		language,
		dictionary: JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`, 'utf8'))
	}));
}

/**
 * Every symbol reachable from `public-api.ts`, resolved by reading the modules it re-exports.
 * A name missing from this set is plumbing: the compiler will not let a consumer reach it,
 * whatever the documentation says about it.
 */
function publishedSymbols(): Set<string> {
	const publicApi = readFileSync(`${LIBRARY}/src/public-api.ts`, 'utf8');
	const names = new Set<string>();

	for (const [, module] of publicApi.matchAll(/^export \* from '(\.[^']+)';$/gm)) {
		const source = readFileSync(`${LIBRARY}/src/${module}.ts`, 'utf8');
		for (const [, name] of source.matchAll(
			/^export (?:declare )?(?:abstract )?(?:class|const|function|interface|type|enum) (\w+)/gm
		)) {
			names.add(name);
		}
	}

	return names;
}

/**
 * Names the DSL module declares that never reach `public-api.ts`. The READMEs listed six of
 * them as exported helpers, so a reader who imported one got a build error from a package
 * that had promised the symbol in writing.
 */
function unexportedDslSymbols(): string[] {
	const source = readFileSync(`${LIBRARY}/src/lib/utils/hub-skeleton-dsl.ts`, 'utf8');
	const published = publishedSymbols();

	return [...source.matchAll(/^export (?:function|const|interface|type|enum) (\w+)/gm)]
		.map(([, name]) => name)
		.filter((name) => !published.has(name));
}

describe('skeleton documentation page', () => {
	it('lists every released version of the library, with its release date', () => {
		const documented = new Map(buildPage().skeletonLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		expect(releasedVersions().length).toBeGreaterThan(0);
		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('introduces every example through a translation key, not through English prose', () => {
		const examples = featureExamples(buildPage());

		expect(examples.length).toBeGreaterThan(0);
		for (const example of examples) {
			expect(example.title, `title of ${example.import}`).toMatch(/^DOCS\.SKELETON\.EXAMPLE\.[A-Z_]+\.TITLE$/);
			expect(example.description, `description of ${example.import}`).toMatch(
				/^DOCS\.SKELETON\.EXAMPLE\.[A-Z_]+\.DESCRIPTION$/
			);
		}
	});

	it('names the mixin demo through a translation key as well', () => {
		const demos = buildPage().skeletonLibrary.mixins?.demos ?? [];

		expect(demos.length).toBeGreaterThan(0);
		for (const demo of demos) {
			expect(demo.title).toMatch(/^DOCS\.SKELETON\./);
		}
	});

	it('resolves every title and description it references, in all eight languages', () => {
		const page = buildPage();
		const keys = [
			...featureExamples(page).flatMap((example) => [example.title, example.description]),
			...(page.skeletonLibrary.mixins?.demos ?? []).map((demo) => demo.title)
		];

		expect(keys.length).toBeGreaterThan(0);
		for (const { language, dictionary } of dictionaries()) {
			for (const key of keys) {
				expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
			}
		}
	});

	it('prints the snippets the class exposes, for every registered example', () => {
		const examples = featureExamples(buildPage());

		for (const [, ctor] of EXAMPLES) {
			const previewed = examples.find((example) => example.previewComponent === ctor);

			expect(previewed, `${ctor.name} is grouped under a feature`).toBeDefined();
			expect(previewed?.template).toBe(ctor.templateCode);
			expect(previewed?.component).toBe(ctor.componentCode);
		}
	});

	it('registers the same examples the feature groups preview, under the same title keys', () => {
		TestBed.configureTestingModule({});
		const registry = TestBed.inject(ExampleRegistry);
		const page = TestBed.runInInjectionContext(() => new SkeletonComponent());
		page.ngOnInit();
		const previewed = new Map(featureExamples(page).map((example) => [example.previewComponent, example.title]));

		for (const [id, ctor] of EXAMPLES) {
			const registered = registry.getAll().find((entry) => entry.id === id);

			expect(registered, `${id} is registered`).toBeDefined();
			expect(registered?.title, `${id} title key`).toBe(previewed.get(ctor));
		}
	});
});

describe('skeleton example components', () => {
	/**
	 * The page reads the snippets off the class, and `ExampleViewer` does the same. An instance
	 * copy is dead weight that only made sense while something constructed the example, and the
	 * moment an example needs `inject()` that construction throws NG0203.
	 */
	it.each(EXAMPLES)('%s carries no instance copy of what the class already exposes', (_id, ctor) => {
		const instance = new ctor() as Record<string, unknown>;

		expect(typeof (ctor as { templateCode?: string }).templateCode).toBe('string');
		expect(instance['templateCode']).toBeUndefined();
		expect(instance['componentCode']).toBeUndefined();
		expect(instance['title']).toBeUndefined();
		expect(instance['description']).toBeUndefined();
	});
});

describe('skeleton README', () => {
	it('ships the coverage table the family documents itself with', () => {
		expect(existsSync(`${LIBRARY}/FUNCTIONALITIES.md`)).toBe(true);
	});

	it.each(READMES)('%s reaches the theming mixin through the packaged styles entry', (file) => {
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');

		expect(readme).toContain("@use 'ng-hub-ui-skeleton/styles' as *;");
		expect(readme).not.toContain('ng-hub-ui-skeleton/styles/mixins/skeleton-theme');
	});

	it.each(READMES)('%s names no DSL helper the package keeps to itself', (file) => {
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');
		const internal = unexportedDslSymbols();

		expect(internal.length, 'symbols the DSL module keeps internal').toBeGreaterThan(0);

		for (const name of internal) {
			expect(readme, `${file} presents the unexported \`${name}\` as part of the API`).not.toContain(`\`${name}\``);
		}
	});
});
