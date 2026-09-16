import { TestBed } from '@angular/core/testing';
import { readdirSync, readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BasicPortalExampleComponent } from '../examples/portal/basic-portal-example.component';
import { ComponentRenderingExampleComponent } from '../examples/portal/component-rendering-example.component';
import { ContentProjectionExampleComponent } from '../examples/portal/content-projection-example.component';
import { DataPassingExampleComponent } from '../examples/portal/data-passing-example.component';
import { PositioningPortalExampleComponent } from '../examples/portal/positioning-portal-example.component';
import { ProgressiveOpenExampleComponent } from '../examples/portal/progressive-open-example.component';
import { ServicePortalExampleComponent } from '../examples/portal/service-portal-example.component';
import { StringContentExampleComponent } from '../examples/portal/string-content-example.component';
import { TemplaterefRenderingExampleComponent } from '../examples/portal/templateref-rendering-example.component';
import { ToggleExampleComponent } from '../examples/portal/toggle-example.component';
import { PortalComponent } from './portal.component';

/**
 * The portal page used to sell a library that does not exist: robust positioning strategies,
 * backdrop support, named outlets, a directive API and fifteen `--portal-*` custom properties,
 * against a library whose entire stylesheet is seven lines and whose public surface is three
 * services and an enum. Its six feature groups carried no examples at all, and its registry
 * entries introduced each demo with an English literal `LiveExample` does not even declare.
 *
 * Prose cannot be compiled, so this suite reads the library's own files — the stylesheet, the
 * manifest, the changelog — and makes the documentation answer to them.
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

const LIBRARY = `${REPO_ROOT}/projects/portal`;
const READMES = ['README.md', 'README.es.md'] as const;
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;

/** Fields `LiveExample` declares. Anything else the page hands the registry is never printed. */
const LIVE_EXAMPLE_FIELDS = ['id', 'title', 'componentName', 'packagePath', 'files', 'sourceCode', 'loader'];

/** Every registered example, paired with the class the page must preview for it. */
const EXAMPLES = [
	['portal-component-rendering', ComponentRenderingExampleComponent],
	['portal-templateref-rendering', TemplaterefRenderingExampleComponent],
	['portal-string-content', StringContentExampleComponent],
	['portal-data-passing', DataPassingExampleComponent],
	['portal-content-projection', ContentProjectionExampleComponent],
	['portal-progressive-open', ProgressiveOpenExampleComponent],
	['portal-toggle', ToggleExampleComponent],
	['portal-basic', BasicPortalExampleComponent],
	['portal-positioning', PositioningPortalExampleComponent],
	['portal-service', ServicePortalExampleComponent]
] as const;

/** Builds the page outside a template, which is the only way to read `portalLibrary`. */
function buildPage(): PortalComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new PortalComponent());
	page.ngOnInit();
	return page;
}

/** Every example the page attached to a feature group, flattened. */
function featureExamples(page: PortalComponent) {
	return page.portalLibrary.functionalities.flatMap((feature) => feature.examples);
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

/** Released versions as `CHANGELOG.md` records them, keyed by version. */
function releasedVersions(): Map<string, string> {
	const changelog = readFileSync(`${LIBRARY}/CHANGELOG.md`, 'utf8');
	return new Map(
		[...changelog.matchAll(/^## \[?(\d+\.\d+\.\d+)\]? - (\d{4}-\d{2}-\d{2})\s*$/gm)].map(([, version, date]) => [
			version,
			date
		])
	);
}

describe('portal documentation page', () => {
	it('groups every registered example under a feature, instead of announcing empty groups', () => {
		const page = buildPage();
		const registry = TestBed.inject(ExampleRegistry);
		const previewed = new Map(featureExamples(page).map((example) => [example.previewComponent, example.title]));

		expect(page.portalLibrary.functionalities.length).toBeGreaterThan(0);
		for (const feature of page.portalLibrary.functionalities) {
			expect(feature.examples.length, `examples under ${feature.title}`).toBeGreaterThan(0);
		}
		for (const [id, ctor] of EXAMPLES) {
			const registered = registry.getAll().find((entry) => entry.id === id);

			expect(registered, `${id} is registered`).toBeDefined();
			expect(previewed.get(ctor), `${id} is grouped under a feature, under its own title key`).toBe(registered?.title);
		}
	});

	it('introduces every example through a translation key, not through English prose', () => {
		const examples = featureExamples(buildPage());

		expect(examples.length).toBeGreaterThan(0);
		for (const example of examples) {
			expect(example.title, `title of ${example.import}`).toMatch(/^DOCS\.PORTAL\.EXAMPLE\.[A-Z_]+\.TITLE$/);
			expect(example.description, `description of ${example.import}`).toMatch(
				/^DOCS\.PORTAL\.EXAMPLE\.[A-Z_]+\.DESCRIPTION$/
			);
		}
	});

	it('resolves every title and description it references, in all eight languages', () => {
		const page = buildPage();
		const keys = [
			...page.portalLibrary.functionalities.flatMap((feature) => [feature.title, feature.description]),
			...featureExamples(page).flatMap((example) => [example.title, example.description])
		];

		expect(keys.length).toBeGreaterThan(0);
		for (const { language, dictionary } of dictionaries()) {
			for (const key of keys) {
				expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
			}
		}
	});

	it('prints the snippets each example class exposes, both of them', () => {
		const examples = featureExamples(buildPage());

		expect(examples.length).toBeGreaterThanOrEqual(EXAMPLES.length);
		for (const example of examples) {
			expect(example.template, `template snippet of ${example.import}`).not.toBe('');
			expect(example.component, `component snippet of ${example.import}`).not.toBe('');
		}
	});

	it('hands the registry only the fields a LiveExample declares', () => {
		buildPage();
		const registered = TestBed.inject(ExampleRegistry)
			.getAll()
			.filter((example) => example.packagePath === 'portal');

		expect(registered.length).toBeGreaterThan(0);
		for (const example of registered) {
			expect(
				Object.keys(example).filter((field) => !LIVE_EXAMPLE_FIELDS.includes(field)),
				example.id
			).toEqual([]);
		}
	});

	it('documents no CSS custom property the library does not define', () => {
		const stylesheet = readFileSync(`${LIBRARY}/src/lib/portal.scss`, 'utf8');
		const documented = buildPage().portalLibrary.api.cssVariables;

		expect(documented).toEqual(MD_CSS_VARIABLES['portal'] ?? []);
		for (const group of documented) {
			for (const variable of group.variables) {
				expect(stylesheet, `${variable.name} in portal.scss`).toContain(variable.name);
			}
		}
	});

	it('announces only releases the changelog records, dated as it dates them', () => {
		const released = releasedVersions();
		const documented = buildPage().portalLibrary.overview.changelog;

		expect(documented.length).toBeGreaterThan(0);
		for (const entry of documented) {
			expect(released.get(entry.version), `changelog entry for ${entry.version}`).toBe(entry.date);
		}
	});
});

describe('portal README', () => {
	it.each(READMES)('%s quotes the peer ranges the manifest declares', (file) => {
		const manifest = JSON.parse(readFileSync(`${LIBRARY}/package.json`, 'utf8'));
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');
		const peers = manifest.peerDependencies as Record<string, string>;

		expect(readme).toContain(`(\`${peers['ng-hub-ui-utils']}\`)`);
		expect(readme).toContain(`(\`${peers['@angular/core']}\`)`);
	});
});

describe('portal FUNCTIONALITIES', () => {
	const table = () => readFileSync(`${LIBRARY}/FUNCTIONALITIES.md`, 'utf8');

	it('lists no backdrop feature, because the library draws none', () => {
		const stylesheet = readFileSync(`${LIBRARY}/src/lib/portal.scss`, 'utf8');
		const rows = table()
			.split('\n')
			.filter((line) => line.startsWith('|'));

		expect(stylesheet.toLowerCase()).not.toContain('backdrop');
		expect(rows.length).toBeGreaterThan(0);
		expect(rows.join('\n').toLowerCase()).not.toContain('backdrop');
	});

	it('uses the coverage marker its own legend defines, in the table and not only in the legend', () => {
		const covered = table()
			.split('\n')
			.filter((line) => line.startsWith('|') && line.includes('✅'));

		expect(covered.length).toBeGreaterThan(0);
	});
});

/**
 * Every portal demo the site ships, read as text. The `componentCode` string lives in the same
 * file as the `imports` array, so one read covers both halves of what a demo teaches: what it
 * compiles with, and what the reader copies out of the code tab.
 */
const EXAMPLE_SOURCES: ReadonlyArray<[string, string]> = readdirSync(`${REPO_ROOT}/src/app/pages/examples/portal`)
	.filter((file) => file.endsWith('.component.ts'))
	.map((file) => [file, readFileSync(`${REPO_ROOT}/src/app/pages/examples/portal/${file}`, 'utf8')] as [string, string]);

describe('portal documentation examples', () => {
	it('teaches the injected service, not the module 23.0.0 takes away', () => {
		expect(EXAMPLE_SOURCES.length, 'portal demos on the site').toBeGreaterThan(5);

		for (const [name, source] of EXAMPLE_SOURCES) {
			expect(source, `HubPortalModule in ${name}`).not.toContain('HubPortalModule');
		}
	});

	it('reaches the service the way the migration note prescribes, by injection', () => {
		const opening = EXAMPLE_SOURCES.filter(([, source]) => source.includes('HubPortal'));
		expect(opening.length, 'demos that use the portal service').toBeGreaterThan(0);

		for (const [name, source] of opening) {
			expect(source, `inject(HubPortal) in ${name}`).toContain('inject(HubPortal)');
		}
	});
});
