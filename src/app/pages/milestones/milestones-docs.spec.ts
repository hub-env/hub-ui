import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { MILESTONES_FUNCTIONALITIES } from './milestones-functionalities';
import { MILESTONES_PLAYGROUND } from './milestones-playground';
import { MilestonesComponent } from './milestones.component';

/**
 * The milestones page, the two READMEs and the eight locale files describe an API none of them
 * can see: every row is hand-written prose, so nothing breaks when a peer dependency becomes
 * required, a token default changes or a release ships. This suite is the missing compiler — it
 * reads the components, the stylesheet, the manifest and the CHANGELOG, and makes the
 * documentation answer to them.
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

const LIBRARY = `${REPO_ROOT}/projects/milestones`;
const PAGE = `${REPO_ROOT}/src/app/pages/milestones`;
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;
const READMES = ['README.md', 'README.es.md'] as const;

/** Released versions of the library, as the CHANGELOG records them. */
function releasedVersions(): { version: string; date: string }[] {
	const changelog = readFileSync(`${LIBRARY}/CHANGELOG.md`, 'utf8');
	return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)].map(([, version, date]) => ({
		version,
		date
	}));
}

/** Peer dependencies a consumer has to install by hand, i.e. everything Angular does not bring. */
function requiredPeers(): string[] {
	const manifest = JSON.parse(readFileSync(`${LIBRARY}/package.json`, 'utf8'));
	return Object.keys(manifest.peerDependencies ?? {})
		.filter((name) => !name.startsWith('@angular/'))
		.filter((name) => manifest.peerDependenciesMeta?.[name]?.optional !== true);
}

/** Every symbol `public-api.ts` exports, which is exactly what a consumer can reach for. */
function exportedSymbols(): string[] {
	const api = readFileSync(`${LIBRARY}/src/public-api.ts`, 'utf8');
	return [...api.matchAll(/export (?:type )?\{([^}]+)\}/g)].flatMap(([, names]) =>
		names.split(',').map((name) => name.trim())
	);
}

/** Default the component stylesheet declares for one `--hub-milestone-*` token. */
function declaredTokenDefault(token: string): string {
	const scss = readFileSync(`${LIBRARY}/src/lib/milestones.component.scss`, 'utf8');
	const declared = new RegExp(`^\\t${token}: (.+);$`, 'm').exec(scss);

	if (declared) {
		return declared[1];
	}

	// A token the root block does not declare still has a default: the fallback of the `var()`
	// that reads it. `--hub-milestone-connector-bg` is deliberately one of those — resolving its
	// fallback at the root would freeze it to the global accent and lose a per-node `color` — so
	// the value the control must name lives at the point of use, not upstream.
	const fallback = new RegExp(`var\\(${token},\\s*([^)]+\\))\\)`).exec(scss);

	if (!fallback) {
		throw new Error(`${token} is neither declared nor read with a fallback in milestones.component.scss`);
	}
	return fallback[1];
}

/** Builds the page outside a template, which is the only way to read `milestonesLibrary`. */
function buildPage(): { page: MilestonesComponent; registry: ExampleRegistry } {
	TestBed.configureTestingModule({});
	const registry = TestBed.inject(ExampleRegistry);
	const page = TestBed.runInInjectionContext(() => new MilestonesComponent());
	page.ngOnInit();
	return { page, registry };
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

describe('milestones documentation page', () => {
	it('lists every released version of the library, with its release date', () => {
		const { page } = buildPage();
		const documented = new Map(page.milestonesLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('types the reveal row as the optional input the component declares', () => {
		const source = readFileSync(`${LIBRARY}/src/lib/milestones.component.ts`, 'utf8');
		expect(source).toContain('readonly reveal = input<boolean | undefined>(undefined)');

		const { page } = buildPage();
		const row = page.milestonesLibrary.api.inputs.find((input) => input.name === 'reveal (hub-milestones)');

		// `true` is what the container resolves to, not what the input holds: an unset `reveal`
		// reads the global config, so a reader told the default is `true` cannot tell that
		// `provideHubMilestones({ reveal: false })` wins over it.
		expect(row?.type).toBe('boolean | undefined');
		expect(row?.defaultValue).toContain('HubMilestonesConfig');
	});

	it('names the schematic that actually ships the peer dependency', () => {
		const { page } = buildPage();
		const entry = page.milestonesLibrary.overview.changelog.find((release) => release.version === '22.3.0');
		const peerNote = entry?.changes.map((change) => change.description).join(' ') ?? '';

		expect(peerNote).toContain('ng-hub-ui-utils');
		expect(peerNote).toContain('ng add ng-hub-ui');
	});

	it('hands the examples panel the feature groups it declares', () => {
		const source = readFileSync(`${PAGE}/milestones.component.ts`, 'utf8');

		// Declared but never bound, the groups never head the Examples tab and the panel
		// renders one flat run instead.
		expect(source).toContain('[exampleGroups]="exampleGroups"');
		expect(MILESTONES_FUNCTIONALITIES.length).toBeGreaterThan(0);
	});

	it('groups every registered example under a feature heading', () => {
		const { registry } = buildPage();
		const registered = registry.getAll().map((example) => example.id);
		const grouped = MILESTONES_FUNCTIONALITIES.flatMap((group) => group.exampleIds);

		expect([...registered].sort()).toEqual([...grouped].sort());
	});

	it('starts the connector playground control at the default the stylesheet declares', () => {
		// Only the free-text controls are checked: a colour picker needs a literal, so those
		// defaults are a starting point rather than a claim. This one names a value, and naming
		// the gradient removed in 22.0.2 taught a default the library no longer has.
		const control = MILESTONES_PLAYGROUND[0].cssVariables?.find(
			(variable) => variable.name === '--hub-milestone-connector-bg'
		);

		expect(control?.default).toBe(declaredTokenDefault('--hub-milestone-connector-bg'));
	});

	it('translates every key the page and its feature groups reference, in all eight languages', () => {
		const { page } = buildPage();
		const keys = [
			...page.milestonesLibrary.api.inputs.map((row) => row.description),
			...page.milestonesLibrary.api.templates.map((slot) => slot.description),
			...MILESTONES_FUNCTIONALITIES.flatMap((group) => [group.title, group.description])
		].filter((key) => key?.startsWith('DOCS.'));

		for (const language of LANGUAGES) {
			const dictionary = JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`, 'utf8'));
			for (const key of keys) {
				expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
			}
		}
	});
});

describe('milestones README', () => {
	it.each(READMES)('%s names every peer dependency the consumer has to install', (file) => {
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');
		const install = /```bash\n(npm install [^\n]+)\n```/.exec(readme);

		expect(requiredPeers().length).toBeGreaterThan(0);
		for (const peer of requiredPeers()) {
			expect(install?.[1], `install command in ${file}`).toContain(peer);
		}
	});

	it.each(READMES)('%s does not claim to have no dependencies while it declares a required peer', (file) => {
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');

		expect(requiredPeers().length).toBeGreaterThan(0);
		expect(readme).not.toMatch(/Zero runtime dependencies|Sin dependencias en tiempo de ejecución/);
	});

	it.each(READMES)('%s documents every symbol the public API exports', (file) => {
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');

		for (const symbol of exportedSymbols()) {
			expect(readme.includes(symbol), `${symbol} documented in ${file}`).toBe(true);
		}
	});

	it.each(READMES)('%s documents the stylesheets the package ships', (file) => {
		const ngPackage = JSON.parse(readFileSync(`${LIBRARY}/ng-package.json`, 'utf8'));
		const shipsStyles = (ngPackage.assets ?? []).some((asset: { output?: string }) => asset.output === 'styles');
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');

		expect(shipsStyles, 'ng-package.json emits the SCSS entry point').toBe(true);
		expect(readme).toContain("@use 'ng-hub-ui-milestones/styles'");
		expect(readme).toContain('hub-milestones-theme');
	});

	it.each(READMES)('%s promises a `:root` override the stylesheet actually yields to', (file) => {
		const scss = readFileSync(`${LIBRARY}/src/lib/milestones.component.scss`, 'utf8');
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');

		// The component is unencapsulated, so its defaults block competes with the application's
		// own `:root` at equal specificity and wins on injection order — unless it is wrapped in
		// `:where()`. Both READMEs send the reader to `:root`, so the wrapper is what makes the
		// sentence true, and saying why keeps the next reader from removing it.
		expect(scss).toContain(':where(:root) {');
		expect(scss).not.toMatch(/^:root \{/m);
		expect(readme).toContain(':where(:root)');
	});

	it.each(READMES)('%s does not call the node directive structural', (file) => {
		const directive = readFileSync(`${LIBRARY}/src/lib/milestone-node.directive.ts`, 'utf8');
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');

		// A structural directive owns a ViewContainerRef and decides where its template is
		// instantiated. This one only holds the TemplateRef; `<hub-milestone>` renders it.
		expect(directive).not.toContain('ViewContainerRef');
		expect(readme).not.toMatch(/structural directive|[Dd]irectiva estructural/);
	});
});

describe('milestones package documentation', () => {
	it('warns about the release that made a peer dependency required', () => {
		// The family's major tracks the Angular major, so semver cannot signal a breaking
		// change and this file is the warning in its place.
		expect(existsSync(`${LIBRARY}/BREAKING_CHANGES.md`), 'BREAKING_CHANGES.md exists').toBe(true);

		const breaking = readFileSync(`${LIBRARY}/BREAKING_CHANGES.md`, 'utf8');
		expect(breaking).toContain('## [22.3.0]');
		for (const peer of requiredPeers()) {
			expect(breaking, `migration note for ${peer}`).toContain(peer);
		}
	});

	it('ships the coverage table the family documents itself with', () => {
		expect(existsSync(`${LIBRARY}/FUNCTIONALITIES.md`)).toBe(true);
	});
});
