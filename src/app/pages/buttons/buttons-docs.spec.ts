import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { ButtonsDocsComponent } from './buttons.component';

/**
 * The buttons documentation is hand-written prose about a library that keeps shipping, and
 * nothing broke when it fell behind: the READMEs still printed the pre-22.3.0 token literals,
 * promised a speed-dial item default the component never had, and left `extended`, `size`,
 * `trigger` and the content slots out of the tables entirely, while `BREAKING_CHANGES.md`
 * covered one of the four releases that break a consumer silently. This suite reads the
 * library's own sources and makes every one of those claims answer to them.
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

const LIBRARY = `${REPO_ROOT}/projects/buttons`;
const COMPONENTS = `${LIBRARY}/src/lib/components`;
const READMES = ['README.md', 'README.es.md'] as const;
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;

/** The three components whose inputs and outputs the READMEs tabulate, with their headings. */
const DOCUMENTED_COMPONENTS = [
	['hub-fab', `${COMPONENTS}/fab/fab.component.ts`, '### `HubFabComponent` — `<hub-fab>`'],
	['hub-speed-dial', `${COMPONENTS}/speed-dial/speed-dial.component.ts`, '### `HubSpeedDialComponent` — `<hub-speed-dial>`'],
	[
		'hub-speed-dial-item',
		`${COMPONENTS}/speed-dial/speed-dial-item/speed-dial-item.component.ts`,
		'### `HubSpeedDialItemComponent` — `<hub-speed-dial-item>`'
	]
] as const;

/** The heading each README opens its CSS custom-property block with. */
const CSS_SECTION: Record<string, string> = {
	'README.md': '## CSS Customisation',
	'README.es.md': '## Personalización CSS'
};

function read(path: string): string {
	return readFileSync(path, 'utf8');
}

/** Builds the page outside a template, which is the only way to read `buttonsLibrary`. */
function buildPage(): ButtonsDocsComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new ButtonsDocsComponent());
	page.ngOnInit();
	return page;
}

/**
 * Released versions as `CHANGELOG.md` records them, with their dates. The `[Unreleased]`
 * heading carries no version and is skipped by the same pattern.
 */
function releasedVersions(): { version: string; date: string; body: string }[] {
	const changelog = read(`${LIBRARY}/CHANGELOG.md`);
	const headings = [...changelog.matchAll(/^## \[?(\d+\.\d+\.\d+)\]? - (\d{4}-\d{2}-\d{2})\s*$/gm)];

	return headings.map((heading, index) => ({
		version: heading[1],
		date: heading[2],
		body: changelog.slice(heading.index! + heading[0].length, headings[index + 1]?.index ?? changelog.length)
	}));
}

/** Every public signal input or model a component declares, mapped to its default expression. */
function declaredInputs(source: string): Map<string, string> {
	const declarations = source.matchAll(/^\t(\w+) = (?:input|model)(?:\.required)?(?:<[^>]*>)?\(([^\n]*)$/gm);
	return new Map([...declarations].map((declaration) => [declaration[1], declaration[2]]));
}

/** Every output a component declares. */
function declaredOutputs(source: string): string[] {
	return [...source.matchAll(/^\t(\w+) = output</gm)].map((declaration) => declaration[1]);
}

/** The slice of a README that belongs to one `###` heading. */
function section(readme: string, heading: string): string {
	const start = readme.indexOf(heading);
	if (start === -1) {
		return '';
	}
	const rest = readme.slice(start + heading.length);
	const end = rest.indexOf('\n### ');
	return end === -1 ? rest : rest.slice(0, end);
}

/** The `Default` column of a README table, keyed by the input the row documents. */
function documentedDefaults(sectionText: string): Map<string, string> {
	const defaults = new Map<string, string>();

	for (const line of sectionText.split('\n')) {
		if (!line.startsWith('|')) {
			continue;
		}
		// Cells may contain escaped pipes (`\|` inside a union type), which never split a row.
		const cells = line
			.split(/(?<!\\)\|/)
			.slice(1, -1)
			.map((cell) => cell.trim());

		if (cells.length === 4 && cells[0].startsWith('`')) {
			defaults.set(cells[0].replaceAll('`', ''), cells[2].replaceAll('`', ''));
		}
	}

	return defaults;
}

/**
 * The default a component stylesheet declares for each `--hub-*` token. Only the component
 * sheets count: the mixins declare the same names from their own parameters, which are not
 * what a consumer reads when they copy the README block.
 */
function declaredTokens(): Map<string, string> {
	const sheets = [
		`${COMPONENTS}/btn/button.component.scss`,
		`${COMPONENTS}/fab/fab.component.scss`,
		`${COMPONENTS}/speed-dial/speed-dial.component.scss`,
		`${COMPONENTS}/speed-dial/speed-dial-item/speed-dial-item.component.scss`,
		`${COMPONENTS}/dropdown-panel/dropdown-panel.component.scss`,
		`${COMPONENTS}/dropdown-item/dropdown-item.component.scss`
	];
	const tokens = new Map<string, string>();

	for (const sheet of sheets) {
		for (const declaration of read(sheet).matchAll(/^\s*(--hub-[\w-]+):\s*(.+?);\s*$/gm)) {
			if (!tokens.has(declaration[1])) {
				tokens.set(declaration[1], declaration[2]);
			}
		}
	}

	return tokens;
}

/** The token defaults a README prints in its CSS customisation block. */
function documentedTokens(readme: string, file: string): Map<string, string> {
	const block = readme.split(CSS_SECTION[file])[1].split('```')[1];
	return new Map([...block.matchAll(/^(--hub-[\w-]+):\s+(.+?);/gm)].map((line) => [line[1], line[2]]));
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
		dictionary: JSON.parse(read(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`))
	}));
}

describe('buttons documentation page', () => {
	it('lists every released version of the library, with its release date', () => {
		const documented = new Map(buildPage().buttonsLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		expect(releasedVersions().length).toBeGreaterThan(0);
		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('describes every input, output and slot through a translation key, not through English prose', () => {
		const api = buildPage().buttonsLibrary.api;
		const documented = [...api.inputs, ...api.outputs, ...api.templates];

		expect(documented.length).toBeGreaterThan(0);
		for (const entry of documented) {
			expect(entry.description, `description of ${entry.name}`).toMatch(/^DOCS\.BUTTONS\.API\./);
		}
	});

	it('resolves every API description it references, in all eight languages', () => {
		const api = buildPage().buttonsLibrary.api;
		const keys = [...api.inputs, ...api.outputs, ...api.templates].map((entry) => entry.description);

		for (const { language, dictionary } of dictionaries()) {
			for (const key of keys) {
				expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
			}
		}
	});

	it('documents every content slot the components project', () => {
		const templates = buildPage().buttonsLibrary.api.templates;
		const projected = [`${COMPONENTS}/fab/fab.component.html`, `${COMPONENTS}/speed-dial/speed-dial.component.html`]
			.flatMap((template) => [...read(template).matchAll(/<ng-content select="([^"]+)"/g)])
			.map((slot) => slot[1]);

		expect(projected.length).toBeGreaterThan(0);
		for (const slot of projected) {
			expect(
				templates.some((entry) => entry.name.includes(slot)),
				`a documented template entry for ${slot}`
			).toBe(true);
		}
	});
});

describe('buttons example snippets', () => {
	/**
	 * A snippet that reproduces the whole component — the ones declaring a `selector` — is
	 * copied as a starting point, so the names in it have to be the names of the example the
	 * reader is looking at. Fragments that show only a method are deliberately not held to it.
	 */
	it('names the real selector and class wherever it reproduces the component', () => {
		const example = read(`${REPO_ROOT}/src/app/pages/examples/buttons/speed-dial-buttons-example.component.ts`);
		const snippet = example.split('static readonly componentCode')[1];

		expect(snippet).toContain("selector: 'app-speed-dial-buttons-example'");
		expect(snippet).toContain('export class SpeedDialButtonsExampleComponent');
		expect(snippet).not.toContain('SpeedDialExampleComponent {');
	});
});

describe('ng-hub-ui-buttons README', () => {
	it('ships the coverage table the family documents itself with', () => {
		expect(existsSync(`${LIBRARY}/FUNCTIONALITIES.md`)).toBe(true);
	});

	it.each(READMES)('%s tabulates every input and output of the components it documents', (file) => {
		const readme = read(`${LIBRARY}/${file}`);

		for (const [component, source, heading] of DOCUMENTED_COMPONENTS) {
			const sectionText = section(readme, heading);
			expect(sectionText, `${component} section`).not.toBe('');

			const documented = documentedDefaults(sectionText);
			for (const input of declaredInputs(read(source)).keys()) {
				expect(documented.has(input), `${component}.${input} has a row`).toBe(true);
			}
			for (const output of declaredOutputs(read(source))) {
				expect(sectionText, `${component} names its ${output} output`).toContain(`\`${output}\``);
			}
		}
	});

	it.each(READMES)('%s prints the defaults the components declare', (file) => {
		const readme = read(`${LIBRARY}/${file}`);

		for (const [component, source, heading] of DOCUMENTED_COMPONENTS) {
			const documented = documentedDefaults(section(readme, heading));

			for (const [input, declaration] of declaredInputs(read(source))) {
				// A required input has no default, and an empty string is documented as "—".
				const literal = declaration.match(/^'([^']+)'/) ?? declaration.match(/^(false|true)[,)]/);
				if (!literal) {
					continue;
				}
				expect(documented.get(input), `documented default of ${component}.${input}`).toBe(literal[1]);
			}
		}
	});

	it.each(READMES)('%s prints the token defaults the stylesheets declare', (file) => {
		const declared = declaredTokens();
		const documented = documentedTokens(read(`${LIBRARY}/${file}`), file);
		let checked = 0;

		for (const [token, value] of documented) {
			// The spinner glyph is a data URI the README elides on purpose.
			if (!declared.has(token) || value.includes('…')) {
				continue;
			}
			checked++;
			expect(value, `documented default of ${token}`).toBe(declared.get(token));
		}

		expect(checked).toBeGreaterThan(20);
	});

	it.each(READMES)('%s lists every mixin the public styles entry forwards', (file) => {
		const readme = read(`${LIBRARY}/${file}`);
		const forwarded = [...read(`${LIBRARY}/src/lib/styles/_index.scss`).matchAll(/^@forward '([\w-]+)'/gm)].map(
			(entry) => entry[1]
		);

		expect(forwarded.length).toBeGreaterThan(0);
		for (const partial of forwarded) {
			for (const mixin of read(`${LIBRARY}/src/lib/styles/_${partial}.scss`).matchAll(/^@mixin ([\w-]+)/gm)) {
				expect(readme, `the mixin table lists ${mixin[1]}`).toContain(`\`${mixin[1]}`);
			}
		}
	});
});

describe('the ng-hub-ui index', () => {
	it.each(READMES)('%s describes the buttons package by what it actually ships', (file) => {
		const row = read(`${REPO_ROOT}/${file}`)
			.split('\n')
			.find((line) => line.includes('[`ng-hub-ui-buttons`]'));

		expect(row, `the ng-hub-ui-buttons row of ${file}`).toBeDefined();
		expect(row).toContain('[hubDropdown]');
		// Neither ever existed in this package: `ls projects/buttons/src/lib/components`.
		expect(row!.toLowerCase()).not.toContain('split button');
		expect(row!.toLowerCase()).not.toContain('button group');
	});
});

describe('ng-hub-ui-buttons BREAKING_CHANGES', () => {
	const breaking = () => read(`${LIBRARY}/BREAKING_CHANGES.md`);

	/**
	 * "Breaking" has to be the release's own verdict, not any mention of the word. An entry that
	 * says it filled in `BREAKING_CHANGES.md` for older releases talks about breaks without being
	 * one, and matching on the bare word turned that housekeeping into a demand for a section
	 * describing a migration that does not exist.
	 */
	it('has a section for every release the changelog marks breaking', () => {
		const marked = releasedVersions().filter((release) =>
			/(_\(breaking\)_|\(BREAKING\)|\*\*BREAKING|BREAKING CHANGE)/.test(release.body)
		);

		expect(marked.length).toBeGreaterThan(0);
		for (const { version } of marked) {
			expect(breaking(), `a section for ${version}`).toContain(`## [${version}]`);
		}
	});

	/**
	 * 22.2.0 renamed the selectors and the shell tokens without the word "breaking" anywhere in
	 * the changelog, and nothing fails at build time: markup on `hub-btn` renders an unknown
	 * element and an override on `--hub-btn-padding-x` sets a property no rule reads.
	 */
	it('covers the 22.2.0 renames, which no compiler catches', () => {
		expect(breaking()).toContain('## [22.2.0]');
		expect(breaking()).toContain('hubButton');
		expect(breaking()).toContain('--hub-button-');
	});
});
