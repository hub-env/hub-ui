import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { SortableComponent } from './sortable.component';

/**
 * Everything the sortable documentation says is hand-written prose: the page's API rows, the two
 * READMEs and the changelog. Nothing failed when the directive grew an input or a release was cut,
 * so the documentation drifted until it described a library that does not exist — an optional input
 * marked required, thirteen of thirty-seven inputs listed, outputs typed as a class the directive
 * abandoned, and four published releases the changelog never mentioned. This suite is the missing
 * compiler: it reads the directive source, the manifest and the registry's own history, and makes
 * the documentation answer to them.
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

const LIB = `${REPO_ROOT}/projects/sortable`;
const DIRECTIVE = readFileSync(`${LIB}/src/lib/sortable.directive.ts`, 'utf8');
const CHANGELOG = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;

/** Both language editions of the README, keyed by the name a failure message should show. */
const READMES: ReadonlyArray<[string, string]> = [
	['README.md', readFileSync(`${LIB}/README.md`, 'utf8')],
	['README.es.md', readFileSync(`${LIB}/README.es.md`, 'utf8')]
];

/**
 * Versions the registry serves, from `npm view ng-hub-ui-sortable versions --json`. The changelog
 * owes an entry to every one of them; a version documented but never published is a separate
 * problem, so the check runs one way only. `19.0.0` and below were published under the upstream
 * package name and are outside this list on purpose.
 */
const PUBLISHED = [
	'20.0.0',
	'21.0.0',
	'21.0.1',
	'21.1.0',
	'21.1.1',
	'21.2.0',
	'21.3.0',
	'22.1.0',
	'22.1.1',
	'22.1.2',
	'22.1.3',
	'22.1.4'
] as const;

/**
 * Every signal input the directive declares, under the name a consumer binds — which is the alias
 * when there is one, since `items` is written `[hubSortable]` in a template and nowhere else.
 */
function declaredInputs(): string[] {
	return [...DIRECTIVE.matchAll(/readonly (\w+) = input(?:\.required)?<[^;]*?\);/gs)].map(([block, name]) => {
		const alias = /alias: '(\w+)'/.exec(block);
		return alias ? alias[1] : name;
	});
}

/** Inputs the directive declares with `input.required`, which is currently none of them. */
function requiredInputs(): string[] {
	return [...DIRECTIVE.matchAll(/readonly (\w+) = input\.required</g)].map(([, name]) => name);
}

/** Every output the directive declares. */
function declaredOutputs(): string[] {
	return [...DIRECTIVE.matchAll(/readonly (\w+) = output</g)].map(([, name]) => name);
}

/**
 * Every demo source under the sortable examples folder, concatenated. The coverage table claims an
 * example exists for a given option; this is the text that claim has to be visible in.
 */
function exampleSources(): string {
	const root = `${REPO_ROOT}/src/app/pages/examples/sortable`;
	const collect = (directory: string): string[] =>
		readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
			const full = `${directory}/${entry.name}`;
			if (entry.isDirectory()) return collect(full);
			return /\.(ts|html)$/.test(entry.name) && !entry.name.endsWith('.spec.ts') ? [full] : [];
		});

	return collect(root)
		.map((file) => readFileSync(file, 'utf8'))
		.join('\n');
}

/** Released versions, with their dates, as the CHANGELOG records them. */
function releasedVersions(): Map<string, string> {
	return new Map(
		[...CHANGELOG.matchAll(/^## \[?(\d+\.\d+\.\d+)\]? - (\d{4}-\d{2}-\d{2})\s*$/gm)].map(([, version, date]) => [
			version,
			date
		])
	);
}

/** Orders two `major.minor.patch` strings. */
function compare(a: string, b: string): number {
	const left = a.split('.').map(Number);
	const right = b.split('.').map(Number);
	for (let index = 0; index < 3; index++) {
		if (left[index] !== right[index]) {
			return left[index] - right[index];
		}
	}
	return 0;
}

/** Builds the page outside a template, which is the only way to read `sortableLibrary`. */
function buildPage(): SortableComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new SortableComponent());
	page.ngOnInit();
	return page;
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

describe('sortable documentation page', () => {
	it('names every input the directive declares', () => {
		const declared = declaredInputs();
		const listed = new Set(buildPage().sortableLibrary.api.inputs.map((input) => input.name));

		expect(declared.length, 'inputs found on the directive').toBe(39);
		for (const input of declared) {
			expect(listed, `API row for the "${input}" input`).toContain(input);
		}
	});

	it('names no input the directive does not declare', () => {
		const declared = new Set(declaredInputs());

		for (const row of buildPage().sortableLibrary.api.inputs) {
			expect(declared.has(row.name), `"${row.name}" is a real input`).toBe(true);
		}
	});

	it('marks no input required, because the directive declares none with input.required', () => {
		expect(requiredInputs(), 'inputs declared with input.required').toEqual([]);
		expect(DIRECTIVE, 'the selector matches the bare attribute').toContain("selector: '[hubSortable]'");

		for (const row of buildPage().sortableLibrary.api.inputs) {
			expect(row.required, `"${row.name}" marked required`).toBe(false);
		}
	});

	it('names exactly the outputs the directive declares', () => {
		const declared = declaredOutputs();
		const listed = buildPage().sortableLibrary.api.outputs.map((output) => output.name);

		expect(declared.length, 'outputs found on the directive').toBe(13);
		expect([...listed].sort()).toEqual([...declared].sort());
	});

	it('resolves every API description it references, in all eight languages', () => {
		const page = buildPage();
		const keys = [...page.sortableLibrary.api.inputs, ...page.sortableLibrary.api.outputs].map(
			(entry) => entry.description
		);

		expect(keys.length, 'API rows on the page').toBe(52);
		for (const { language, dictionary } of dictionaries()) {
			for (const key of keys) {
				expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
			}
		}
	});

	it('dates every release it announces exactly as the CHANGELOG dates it', () => {
		const released = releasedVersions();
		const announced = buildPage().sortableLibrary.overview.changelog;

		expect(announced.length, 'releases on the page').toBeGreaterThan(0);
		for (const entry of announced) {
			expect(released.get(entry.version), `CHANGELOG entry for ${entry.version}`).toBe(entry.date);
		}
	});

	it('announces every release the CHANGELOG records back to the first one under this name', () => {
		const announced = new Set(buildPage().sortableLibrary.overview.changelog.map((entry) => entry.version));

		for (const version of releasedVersions().keys()) {
			if (compare(version, '20.0.0') >= 0) {
				expect(announced, `page entry for ${version}`).toContain(version);
			}
		}
	});
});

describe('sortable CHANGELOG', () => {
	it('records every version the registry has published', () => {
		const released = releasedVersions();

		for (const version of PUBLISHED) {
			expect(released.get(version), `entry for the published version ${version}`).toBeDefined();
		}
	});

	it('says so where a documented version was never published', () => {
		const pending = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8')).version as string;
		const phantom = [...releasedVersions().keys()].filter(
			(version) =>
				compare(version, '20.0.0') >= 0 &&
				version !== pending &&
				!PUBLISHED.includes(version as (typeof PUBLISHED)[number])
		);

		expect(phantom, 'versions documented but absent from the registry').toContain('22.0.0');
		for (const version of phantom) {
			const section = CHANGELOG.slice(CHANGELOG.indexOf(`## [${version}]`)).split(/\n## /)[0];
			expect(section, `note on ${version}, which npm has never served`).toMatch(/never published/i);
		}
	});

	it('orders its releases newest first', () => {
		const versions = [...releasedVersions().keys()];

		expect(versions.length, 'released versions').toBeGreaterThan(10);
		expect(versions).toEqual([...versions].sort(compare).reverse());
	});
});

describe('sortable README', () => {
	it.each(READMES)('%s types the outputs as the directive declares them', (name, source) => {
		expect(DIRECTIVE, 'outputs declared with output()').toContain('= output<');
		expect(DIRECTIVE, 'no EventEmitter in the directive').not.toContain('EventEmitter<');

		expect(source, `OutputEmitterRef rows in ${name}`).toContain('`OutputEmitterRef<Sortable>`');
		expect(source, `stale EventEmitter row in ${name}`).not.toMatch(/`EventEmitter</);
	});

	it.each(READMES)('%s does not ask the reader to install a dependency the package already carries', (name, source) => {
		const manifest = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8'));

		expect(Object.keys(manifest.dependencies), 'sortablejs is a dependency').toContain('sortablejs');
		expect(Object.keys(manifest.peerDependencies), 'sortablejs is not a peer').not.toContain('sortablejs');
		expect(source, `install line in ${name}`).not.toMatch(/(?:npm install|yarn add) ng-hub-ui-sortable sortablejs/);
	});

	it('gives the Spanish edition every section the English one has', () => {
		const sections = READMES.map(([, source]) => [...source.matchAll(/^## /gm)].length);

		expect(sections[1], 'sections in README.es.md').toBe(sections[0]);
		for (const [name, source] of READMES) {
			expect(source, `migration guide link in ${name}`).toContain('(./MIGRATION.md)');
		}
	});
});

describe('sortable package', () => {
	it('ships the reference documents the family documents itself with', () => {
		expect(existsSync(`${LIB}/FUNCTIONALITIES.md`), 'FUNCTIONALITIES.md').toBe(true);
		expect(existsSync(`${LIB}/BREAKING_CHANGES.md`), 'BREAKING_CHANGES.md').toBe(true);
	});

	it('packs the documents the README links to, so the links resolve from node_modules', () => {
		const ngPackage = JSON.parse(readFileSync(`${LIB}/ng-package.json`, 'utf8'));

		expect(ngPackage.assets, 'assets in ng-package.json').toContain('CHANGELOG.md');
		expect(ngPackage.assets, 'assets in ng-package.json').toContain('MIGRATION.md');
	});

	it('links from both READMEs every document it packs, so nothing ships unreachable', () => {
		const assets = JSON.parse(readFileSync(`${LIB}/ng-package.json`, 'utf8')).assets as string[];

		expect(Array.isArray(assets) && assets.length > 0, 'assets in ng-package.json').toBe(true);
		for (const asset of assets) {
			expect(existsSync(`${LIB}/${asset}`), `packed ${asset} exists`).toBe(true);
			for (const [name, source] of READMES) {
				expect(source, `link to ${asset} in ${name}`).toContain(`(./${asset})`);
			}
		}
	});

	it('names every input of the directive in FUNCTIONALITIES.md', () => {
		const functionalities = readFileSync(`${LIB}/FUNCTIONALITIES.md`, 'utf8');

		for (const input of declaredInputs()) {
			expect(functionalities, `row naming the "${input}" input`).toContain(input);
		}
		for (const output of declaredOutputs()) {
			expect(functionalities, `row naming the "${output}" output`).toContain(output);
		}
	});

	it('claims an example only for the options an example actually sets', () => {
		const functionalities = readFileSync(`${LIB}/FUNCTIONALITIES.md`, 'utf8');
		const covered = [...functionalities.matchAll(/\|\s*`(\w+)`\s*\|\s*✅\s*\|/g)].map(([, option]) => option);
		const demos = exampleSources();

		expect(covered.length, 'options marked covered in FUNCTIONALITIES.md').toBeGreaterThan(0);
		for (const option of covered) {
			// Exercised as `name:` inside an Options object, as an `[name]` input or as an `(name)` output.
			const exercised = new RegExp(`(?:[[(]${option}[\\])]\\s*=|\\b${option}\\s*:)`).test(demos);
			expect(exercised, `an example that sets "${option}", which the coverage table marks ✅`).toBe(true);
		}
	});
});
