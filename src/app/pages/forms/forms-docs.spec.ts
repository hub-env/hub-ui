import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { FORMS_FUNCTIONALITIES } from './forms-functionalities';
import { FormsComponent } from './forms.component';

/**
 * Everything the forms documentation says is hand-written prose — both READMEs, the page's API
 * rows, its "Recent changes" block — so nothing breaks when the library drops a peer dependency,
 * renames a field's input, moves its stylesheets or cuts a release. It had drifted far enough
 * that three separate instructions made a consumer who followed them fail: install `@angular/cdk`,
 * write `format="switch"`, `@use 'ng-hub-ui-forms/src/lib/styles/index'`. This suite is the
 * missing compiler — it reads the manifest, the component sources, the public API and the
 * changelog, and makes the documentation answer to them.
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

const LIB = `${REPO_ROOT}/projects/forms`;
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;
const READMES = ['README.md', 'README.es.md'] as const;

/** Every field of the family, paired with the source file that declares it. */
const FIELDS: ReadonlyArray<readonly [string, string]> = [
	['hub-input', 'components/input/input.component.ts'],
	['hub-otp-input', 'components/otp/otp.component.ts'],
	['hub-textarea', 'components/textarea/textarea.component.ts'],
	['hub-slider', 'components/slider/slider.component.ts'],
	['hub-segmented', 'components/segmented/segmented.component.ts'],
	['hub-select', 'select/select.component.ts'],
	['hub-datepicker', 'components/datepicker/datepicker.component.ts'],
	['hub-timepicker', 'components/timepicker/timepicker.component.ts'],
	['hub-file-input', 'components/file-input/file-input.component.ts']
];

function readme(file: (typeof READMES)[number]): string {
	return readFileSync(`${LIB}/${file}`, 'utf8');
}

function fieldSource(file: string): string {
	return readFileSync(`${LIB}/src/lib/${file}`, 'utf8');
}

/** Peer dependencies a consumer installs by hand, i.e. everything Angular does not bring. */
function requiredPeers(): string[] {
	const manifest = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8'));
	return Object.keys(manifest.peerDependencies ?? {}).filter((name) => !name.startsWith('@angular/'));
}

/** Subpaths the package manifest actually exports, which is what a `@use` may name. */
function exportedSubpaths(): string[] {
	const manifest = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8'));
	return Object.keys(manifest.exports ?? {}).map((subpath) => subpath.replace(/^\./, 'ng-hub-ui-forms'));
}

/** Released versions of the library, with their dates, as the CHANGELOG records them. */
function releasedVersions(): Map<string, string> {
	const changelog = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
	return new Map(
		[...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})\s*$/gm)].map(([, version, date]) => [
			version,
			date
		])
	);
}

/** The fields that publish a `valueChange`, whether as an output or as the half of a model. */
function fieldsPublishingValueChange(): string[] {
	return FIELDS.filter(([, file]) => {
		const source = fieldSource(file);
		return /readonly valueChange = output</.test(source) || /readonly value = model</.test(source);
	}).map(([name]) => name);
}

/** Two-way `model()` inputs `hub-input` declares, each of which pairs with a `Change` output. */
function inputModelNames(): string[] {
	return [...fieldSource('components/input/input.component.ts').matchAll(/readonly (\w+) = model[(<]/g)].map(
		([, name]) => name
	);
}

/** Inputs `hub-input` still exposes but marks `@deprecated`. */
function deprecatedInputNames(): string[] {
	const source = fieldSource('components/input/input.component.ts');
	return [...source.matchAll(/@deprecated[\s\S]*?\n\treadonly (\w+) = input[(<]/g)].map(([, name]) => name);
}

/** Builds the page outside a template, the only way to read `formsLibrary`. */
function buildPage(): { page: FormsComponent; registry: ExampleRegistry } {
	TestBed.configureTestingModule({});
	const registry = TestBed.inject(ExampleRegistry);
	const page = TestBed.runInInjectionContext(() => new FormsComponent());
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

describe('forms READMEs', () => {
	it.each(READMES)('%s names every peer dependency the consumer has to install', (file) => {
		// Taken together, because the Quick Start splits the package and its peer into two steps.
		const commands = [...readme(file).matchAll(/```bash\n(npm install [^\n]+)\n```/g)]
			.map(([, command]) => command)
			.join('\n');

		expect(requiredPeers().length).toBeGreaterThan(0);
		for (const peer of requiredPeers()) {
			expect(commands, `install commands in ${file}`).toContain(peer);
		}
	});

	it.each(READMES)('%s asks for no package the library does not depend on', (file) => {
		const manifest = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8'));
		const declared = new Set([
			...Object.keys(manifest.peerDependencies ?? {}),
			...Object.keys(manifest.dependencies ?? {})
		]);
		const asked = [...readme(file).matchAll(/npm install ([^\n`]+)/g)].flatMap(([, line]) => line.trim().split(/\s+/));

		for (const packageName of asked) {
			if (packageName === 'ng-hub-ui-forms') {
				continue;
			}
			expect(declared.has(packageName), `${packageName} asked for in ${file} but not declared`).toBe(true);
		}
	});

	it.each(READMES)('%s lists the real peer block, not a remembered one', (file) => {
		const block = /### Peer [Dd]ependencies\n\n```json\n([\s\S]*?)\n```/.exec(readme(file));
		const declared = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8')).peerDependencies;

		expect(block?.[1], `peer block in ${file}`).toBeDefined();
		expect(JSON.parse(block![1]), `peer block in ${file}`).toEqual(declared);
	});

	it.each(READMES)('%s imports the stylesheets by a subpath the manifest exports', (file) => {
		const exported = exportedSubpaths();
		const used = [...readme(file).matchAll(/@use '(ng-hub-ui-forms[^']*)'/g)].map(([, subpath]) => subpath);

		expect(used.length).toBeGreaterThan(0);
		for (const subpath of used) {
			expect(exported, `@use '${subpath}' in ${file}`).toContain(subpath);
		}
	});

	it.each(READMES)('%s binds hub-input snippets to inputs the component declares', (file) => {
		const source = fieldSource('components/input/input.component.ts');
		const attributes = [...readme(file).matchAll(/<hub-input\b([^>]*)>/g)]
			.flatMap(([, tag]) => [...tag.matchAll(/(?:^|\s)\[?\(?([a-zA-Z][\w]*)\)?\]?=/g)])
			.map(([, name]) => name)
			.filter((name) => !name.startsWith('formControl') && !name.startsWith('ng'));

		expect(attributes.length).toBeGreaterThan(0);
		for (const name of new Set(attributes)) {
			const declared =
				new RegExp(`readonly ${name} = (input|model|output)[(<]`).test(source) ||
				new RegExp(`readonly ${name} = `).test(fieldSource('shared/hub-field-control.ts')) ||
				new RegExp(`readonly ${name} = `).test(fieldSource('shared/hub-form-control.ts')) ||
				['class', 'style', 'required', 'disabled', 'readonly'].includes(name);

			expect(declared, `<hub-input ${name}=…> in ${file}`).toBe(true);
		}
	});

	it.each(READMES)('%s documents every field the library ships', (file) => {
		const text = readme(file);

		for (const [name] of FIELDS) {
			expect(text.includes(`\`${name}\``), `${name} named in ${file}`).toBe(true);
		}
		// The timepicker had lived for ten releases as a passing mention in two lists of
		// addon-capable fields, with its own inputs written down nowhere.
		expect(text, `timepicker section in ${file}`).toMatch(/^### Timepicker$/m);
	});

	it.each(READMES)('%s introduces the cross-library adapter the package exports', (file) => {
		expect(readFileSync(`${LIB}/src/public-api.ts`, 'utf8')).toContain('hubFormControlAdapter');
		expect(readme(file), `hubFormControlAdapter in ${file}`).toContain('hubFormControlAdapter');
	});

	it('ships the coverage table the family documents itself with', () => {
		expect(existsSync(`${LIB}/FUNCTIONALITIES.md`)).toBe(true);
	});
});

describe('forms documentation page', () => {
	it('scopes the valueChange row to the fields that actually publish one', () => {
		const publishing = fieldsPublishingValueChange();
		const silent = FIELDS.map(([name]) => name).filter((name) => !publishing.includes(name));
		const row = buildPage().page.formsLibrary.api.outputs.find((output) => output.name.split(' ')[0] === 'valueChange');

		expect(row, 'a valueChange row').toBeDefined();
		expect(silent.length, 'at least one field publishes no valueChange').toBeGreaterThan(0);
		// An unqualified name reads as "every field", which is the claim that was false.
		expect(row!.name, 'valueChange row').not.toBe('valueChange');
		for (const field of silent) {
			expect(row!.name, 'valueChange row').toContain(field);
		}
	});

	it('lists the Change output of every two-way model hub-input declares', () => {
		const row = buildPage().page.formsLibrary.api.outputs.find((output) => output.name.includes('Change (hub-input)'));

		expect(row, 'the model-change row').toBeDefined();
		expect(inputModelNames().length).toBeGreaterThan(0);
		for (const name of inputModelNames()) {
			expect(row!.name, `${name}Change`).toContain(`${name}Change`);
		}
	});

	it('documents the bounds of every field that declares min and max', () => {
		const { page } = buildPage();
		const bounded = FIELDS.filter(([, file]) => {
			const source = fieldSource(file);
			return /readonly min = (input|model)[(<]/.test(source) && /readonly max = (input|model)[(<]/.test(source);
		}).map(([name]) => name);

		expect(bounded).toContain('hub-slider');
		for (const field of bounded) {
			const row = page.formsLibrary.api.inputs.find(
				(input) => input.name.startsWith('min / max') && input.name.includes(field)
			);
			expect(row, `min / max row for ${field}`).toBeDefined();
		}
	});

	it('documents the deprecated inputs hub-input still exposes', () => {
		const { page } = buildPage();
		const rows = page.formsLibrary.api.inputs.filter((input) => input.name.includes('hub-input'));

		expect(deprecatedInputNames().length).toBeGreaterThan(0);
		for (const name of deprecatedInputNames()) {
			expect(
				rows.some((row) => new RegExp(`\\b${name}\\b`).test(row.name)),
				`${name} documented as a hub-input input`
			).toBe(true);
		}
	});

	it('documents the projection directives the package exports for the input affixes', () => {
		const { page } = buildPage();
		const publicApi = readFileSync(`${LIB}/src/public-api.ts`, 'utf8');
		const english = JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/en.json`, 'utf8'));
		// What the reader ends up with: the rendered name and description, plus the snippet.
		const slots = page.formsLibrary.api.templates
			.flatMap((slot) => [
				lookup(english, slot.name) ?? slot.name,
				lookup(english, slot.description) ?? slot.description,
				slot.example ?? ''
			])
			.join(' ');

		expect(publicApi, 'HubInputPrefixDirective exported').toContain('HubInputPrefixDirective');
		expect(publicApi, 'HubInputSuffixDirective exported').toContain('HubInputSuffixDirective');
		for (const selector of ['hubInputPrefix', 'hubInputSuffix']) {
			expect(slots, `${selector} shown in api.templates`).toContain(selector);
		}
	});

	it('documents the standalone autoresize directive, not only the textarea input', () => {
		const { page } = buildPage();
		const directive = readFileSync(`${LIB}/src/lib/directives/autoresize.directive.ts`, 'utf8');

		expect(directive).toContain('readonly hubAutoresize = input(');
		expect(
			page.formsLibrary.api.inputs.some((input) => input.name.startsWith('hubAutoresize')),
			'a hubAutoresize row'
		).toBe(true);
	});

	it('names the cross-library adapter somewhere on the page', () => {
		const { page } = buildPage();
		const prose = [
			page.formsLibrary.description,
			page.formsLibrary.overview.text,
			...(page.formsLibrary.overview.highlights ?? []).map((highlight) => `${highlight.title} ${highlight.description}`)
		].join(' ');

		expect(prose).toContain('hubFormControlAdapter');
	});

	it('claims no dependency the library has dropped', () => {
		const { page } = buildPage();
		const prose = [page.formsLibrary.description, page.formsLibrary.overview.text].join(' ');

		expect(prose).not.toContain('CDK');
	});

	it('lists every released version of the library, with its release date', () => {
		const { page } = buildPage();
		const documented = new Map(page.formsLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		for (const [version, date] of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('groups every registered example under a feature heading', () => {
		const { registry } = buildPage();
		const registered = registry.getAll().map((example) => example.id);
		const grouped = FORMS_FUNCTIONALITIES.flatMap((group) => group.exampleIds);

		expect([...registered].sort()).toEqual([...grouped].sort());
	});

	it('translates every key the API tables and the feature groups reference, in all eight languages', () => {
		const { page } = buildPage();
		const keys = [
			...page.formsLibrary.api.inputs.map((row) => row.description),
			...page.formsLibrary.api.outputs.map((row) => row.description),
			...page.formsLibrary.api.templates.flatMap((slot) => [slot.name, slot.description]),
			...FORMS_FUNCTIONALITIES.flatMap((group) => [group.title, group.description])
		].filter((key): key is string => typeof key === 'string' && key.startsWith('DOCS.'));

		for (const language of LANGUAGES) {
			const dictionary = JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`, 'utf8'));
			for (const key of keys) {
				expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
			}
		}
	});
});
