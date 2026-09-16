import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { NavComponent } from './nav.component';

/**
 * Every claim the nav documentation makes is hand-written prose: the page's API rows, both
 * READMEs, `BREAKING_CHANGES.md` and `FUNCTIONALITIES.md`. Nothing failed when an input was
 * renamed, a config option added or a release cut, so the documentation drifted until it
 * described an API the library does not have — a README row for a `variant` input that had
 * become `color`, a BREAKING rename with no migration note, ten releases the page never
 * mentioned. This suite is the missing compiler: it reads the manifest, the models, the
 * component sources and the changelog, and makes the documentation answer to them.
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

const LIB = `${REPO_ROOT}/projects/nav`;

/** Both language editions of the README, keyed by the name a failure message should show. */
const READMES: ReadonlyArray<[string, string]> = [
	['README.md', readFileSync(`${LIB}/README.md`, 'utf8')],
	['README.es.md', readFileSync(`${LIB}/README.es.md`, 'utf8')]
];

const MANIFEST = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8')) as { version: string };

/** Builds the page outside a template, which is the only way to read `navLibrary`. */
function buildPage(): NavComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new NavComponent());
	page.ngOnInit();
	return page;
}

/** The signal inputs a component source declares, in declaration order. */
function declaredInputs(source: string): string[] {
	return [...source.matchAll(/readonly (\w+) = (?:input|model)(?:\.required)?</g)].map(([, name]) => name);
}

/**
 * Components and directives the package actually exports, paired with the inputs each one
 * declares. `kind` filters the two apart: the API table is expected to name every component
 * input, while the directive inputs only have to be real when the table does name one.
 */
function exportedInputs(kind: 'components' | 'directives'): Map<string, string[]> {
	const publicApi = readFileSync(`${LIB}/src/public-api.ts`, 'utf8');
	const inputs = new Map<string, string[]>();

	for (const [, path] of publicApi.matchAll(new RegExp(`^export \\* from '\\./(${kind}/[\\w/.-]+)';$`, 'gm'))) {
		const source = readFileSync(`${LIB}/src/${path}.ts`, 'utf8');
		const selector = /selector: '\[?([\w-]+)/.exec(source)?.[1] ?? path;
		inputs.set(selector, declaredInputs(source));
	}
	return inputs;
}

/**
 * The identifier each segment of an API row's `name` starts with. A grouped row lists several
 * inputs separated by slashes and names the owning selectors in parentheses, and a couple of
 * rows carry a sentence of prose after the selector — only the leading identifier is a claim
 * that some input exists.
 */
function claimedInputNames(name: string): string[] {
	return name
		.replace(/\([^)]*\)/g, '')
		.split('/')
		.map((segment) => /^\s*([A-Za-z_]\w*)/.exec(segment)?.[1])
		.filter((identifier): identifier is string => Boolean(identifier));
}

/** Every property of an interface declared in the models folder, with its type. */
function interfaceMembers(file: string, name: string): Map<string, string> {
	const source = readFileSync(`${LIB}/src/models/${file}`, 'utf8');
	const start = source.indexOf(`export interface ${name} {`);
	const block = source.slice(start, source.indexOf('\n}', start));

	const members = new Map<string, string>();
	for (const [, property, type] of block.matchAll(/^\t(\w+)\??: (.+);$/gm)) {
		members.set(property, type.trim());
	}
	return members;
}

/** Released versions, newest first, as the CHANGELOG records them. */
function releasedVersions(): { version: string; date: string }[] {
	const changelog = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
	return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)].map(([, version, date]) => ({
		version,
		date
	}));
}

/**
 * Versions whose CHANGELOG entry calls itself BREAKING, and therefore owe a migration note.
 * The library's major tracks Angular, so a breaking change can only ship as a minor and
 * `BREAKING_CHANGES.md` is the only warning a consumer ever gets. Mentions of the file name
 * itself are not the word.
 */
function versionsMarkedBreaking(): string[] {
	const changelog = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
	return changelog
		.split(/^## /m)
		.filter((section) => /^\[\d+\.\d+\.\d+\]/.test(section) && /BREAKING(?!_CHANGES)/.test(section))
		.map((section) => /^\[(\d+\.\d+\.\d+)\]/.exec(section)![1]);
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

/** First cell of every row of the README's own inputs table, which is what a reader copies. */
function readmeInputRows(readme: string): string[] {
	const start = readme.indexOf('#### Inputs');
	const table = readme.slice(start, readme.indexOf('#### Outputs', start));
	return [...table.matchAll(/^\| `(\w+)`/gm)].map(([, name]) => name);
}

describe('nav documentation page', () => {
	it('lists every released version of the library, with its release date', () => {
		const documented = new Map(buildPage().navLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('names every input of every component the package exports', () => {
		const claimed = new Set(buildPage().navLibrary.api.inputs.flatMap((input) => claimedInputNames(input.name)));
		const components = exportedInputs('components');
		expect(components.size, 'components exported from public-api').toBeGreaterThan(4);

		for (const [selector, inputs] of components) {
			for (const input of inputs) {
				expect(claimed, `${input} of ${selector}`).toContain(input);
			}
		}
	});

	it('names no input the library does not declare', () => {
		const declared = new Set([...exportedInputs('components').values(), ...exportedInputs('directives').values()].flat());
		const configOptions = interfaceMembers('nav-config.model.ts', 'HubNavConfig');

		for (const row of buildPage().navLibrary.api.inputs) {
			for (const name of claimedInputNames(row.name)) {
				expect(declared.has(name) || configOptions.has(name), `"${name}" in row "${row.name}"`).toBe(true);
			}
		}
	});
});

describe('nav README', () => {
	it('announces the version the manifest publishes', () => {
		for (const [name, source] of READMES) {
			expect(source, `version banner in ${name}`).toContain(`\`${MANIFEST.version}\``);
		}
	});

	it('tabulates only inputs `HubNavComponent` actually declares', () => {
		const declared = declaredInputs(readFileSync(`${LIB}/src/components/nav/nav.component.ts`, 'utf8'));
		expect(declared, 'the accent input is called color, not variant').toContain('color');

		for (const [name, source] of READMES) {
			const rows = readmeInputRows(source);
			expect(rows.length, `inputs table in ${name}`).toBe(declared.length);
			for (const row of rows) {
				expect(declared, `"${row}" tabulated in ${name}`).toContain(row);
			}
		}
	});

	it('declares every `HubNavConfig` option in its interface snippet', () => {
		const options = interfaceMembers('nav-config.model.ts', 'HubNavConfig');
		expect(options.size, 'options found in HubNavConfig').toBeGreaterThan(15);

		for (const [name, source] of READMES) {
			for (const option of options.keys()) {
				expect(source, `${option} in ${name}`).toContain(`\t${option}`);
			}
		}
	});

	it('lists every overridable label `HubNavLabels` declares', () => {
		const labels = interfaceMembers('nav-labels.model.ts', 'HubNavLabels');
		expect(labels.size, 'labels found in HubNavLabels').toBe(7);

		for (const [name, source] of READMES) {
			for (const label of labels.keys()) {
				expect(source, `${label} in ${name}`).toContain(`\`${label}\``);
			}
		}
	});

	it('mentions no `variant` input, which was renamed to `color` in 22.7.0', () => {
		for (const [name, source] of READMES) {
			expect(source, `stale variant mention in ${name}`).not.toMatch(/`variant`/);
		}
	});
});

describe('nav reference documents', () => {
	it('gives every version the CHANGELOG marks BREAKING a section in BREAKING_CHANGES.md', () => {
		const breaking = versionsMarkedBreaking();
		expect(breaking.length, 'versions marked BREAKING in the CHANGELOG').toBeGreaterThan(0);

		const notes = readFileSync(`${LIB}/BREAKING_CHANGES.md`, 'utf8');
		for (const version of breaking) {
			const heading = new RegExp(`^## (Version |\\[)${version.replaceAll('.', '\\.')}`, 'm');
			expect(notes, `migration note for ${version}`).toMatch(heading);
		}
	});

	it('orders the CHANGELOG newest first', () => {
		const versions = releasedVersions().map((release) => release.version);
		expect(versions.length, 'released versions').toBeGreaterThan(10);
		expect(versions).toEqual([...versions].sort(compare).reverse());
	});

	it('ships a FUNCTIONALITIES.md naming every input and every config option', () => {
		const functionalities = readFileSync(`${LIB}/FUNCTIONALITIES.md`, 'utf8');
		const inputs = declaredInputs(readFileSync(`${LIB}/src/components/nav/nav.component.ts`, 'utf8'));

		for (const name of [...inputs, ...interfaceMembers('nav-config.model.ts', 'HubNavConfig').keys()]) {
			expect(functionalities, `row for ${name}`).toContain(name);
		}
	});

	it('documents every member of a union type the config JSDoc enumerates', () => {
		const source = readFileSync(`${LIB}/src/models/nav-config.model.ts`, 'utf8');
		const start = source.indexOf('\t/**\n\t * Expansion mode for child items');
		const jsdoc = source.slice(start, source.indexOf('*/', start));
		const members = /export type HubNavVerticalExpandMode = ([^;]+);/.exec(source)![1];

		for (const [, member] of members.matchAll(/'(\w+)'/g)) {
			expect(jsdoc, `verticalExpandMode JSDoc entry for ${member}`).toContain(`\`${member}\``);
		}
	});
});

describe('nav library folder', () => {
	it('ships the same reference documents its siblings ship', () => {
		const siblings = readdirSync(`${REPO_ROOT}/projects`).filter((library) =>
			existsSync(`${REPO_ROOT}/projects/${library}/FUNCTIONALITIES.md`)
		);
		expect(siblings.length, 'libraries shipping a functionality matrix').toBeGreaterThan(5);
		expect(siblings, 'nav among them').toContain('nav');
	});
});
