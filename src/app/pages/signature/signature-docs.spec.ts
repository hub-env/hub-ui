import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import ar from '../../i18n/docs/ar.json';
import de from '../../i18n/docs/de.json';
import en from '../../i18n/docs/en.json';
import es from '../../i18n/docs/es.json';
import fr from '../../i18n/docs/fr.json';
import ja from '../../i18n/docs/ja.json';
import ru from '../../i18n/docs/ru.json';
import zh from '../../i18n/docs/zh.json';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { SignatureComponent } from './signature.component';

/**
 * Every claim the signature documentation makes is hand-written prose: the API tables on the
 * page, both READMEs, `FUNCTIONALITIES.md` and the migration guide. Nothing fails when the
 * component grows an input, an output is renamed, a warning outlives the defect it describes or
 * a release is cut, so the documentation drifts silently and a consumer acts on the lie. This
 * suite is the missing compiler: it reads the component sources, the changelog and the reference
 * documents, and makes the documentation answer to them.
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

const LIB = `${REPO_ROOT}/projects/signature`;

const COMPONENT = readFileSync(`${LIB}/src/lib/components/signature/signature.component.ts`, 'utf8');
const TEMPLATE = readFileSync(`${LIB}/src/lib/components/signature/signature.component.html`, 'utf8');
const MIGRATION = readFileSync(`${LIB}/MIGRATION.md`, 'utf8');
const FUNCTIONALITIES = readFileSync(`${LIB}/FUNCTIONALITIES.md`, 'utf8');

/** The two base classes whose inputs reach `<hub-signature>` without being redeclared there. */
const BASES = [
	readFileSync(`${REPO_ROOT}/projects/forms/src/lib/shared/hub-field-control.ts`, 'utf8'),
	readFileSync(`${REPO_ROOT}/projects/forms/src/lib/shared/hub-form-control.ts`, 'utf8')
];

/** Both language editions of the README, keyed by the name a failure message should show. */
const READMES: ReadonlyArray<[string, string]> = [
	['README.md', readFileSync(`${LIB}/README.md`, 'utf8')],
	['README.es.md', readFileSync(`${LIB}/README.es.md`, 'utf8')]
];

const TRANSLATIONS: Array<[string, Record<string, any>]> = [
	['en', en],
	['es', es],
	['de', de],
	['fr', fr],
	['ja', ja],
	['ru', ru],
	['zh', zh],
	['ar', ar]
];

/**
 * Public signal members of one class body, by factory.
 *
 * The leading single tab is what separates a class member from anything nested inside a method,
 * and the absence of a `protected` / `private` prefix is what makes it part of the public surface
 * a consumer can bind.
 */
function signalMembers(source: string, factory: 'input' | 'model' | 'output'): string[] {
	return [...source.matchAll(new RegExp(`^\\treadonly (\\w+) = ${factory}[<(]`, 'gm'))].map(([, name]) => name);
}

/** Every input a consumer can bind on `<hub-signature>`, inherited ones included. */
function declaredInputs(): string[] {
	return [COMPONENT, ...BASES].flatMap((source) => [...signalMembers(source, 'input'), ...signalMembers(source, 'model')]);
}

/** Every output a consumer can listen to, including the write half of each two-way model. */
function declaredOutputs(): string[] {
	return [COMPONENT, ...BASES].flatMap((source) => [
		...signalMembers(source, 'output'),
		...signalMembers(source, 'model').map((name) => `${name}Change`)
	]);
}

/** Released versions, newest first, as the library CHANGELOG records them. */
function releasedVersions(): { version: string; date: string }[] {
	const changelog = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
	return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)].map(([, version, date]) => ({
		version,
		date
	}));
}

/** Builds the page outside a template, which is the only way to read `library`. */
function buildPage(): SignatureComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new SignatureComponent());
	page.ngOnInit();
	return page;
}

function resolve(bundle: Record<string, any>, key: string): unknown {
	return key.split('.').reduce<any>((node, segment) => (node == null ? undefined : node[segment]), bundle);
}

describe('signature documentation page', () => {
	it('documents every input the component and its base classes declare', () => {
		const documented = new Set(buildPage().library.api.inputs.map((row) => row.name));

		for (const input of declaredInputs()) {
			expect(documented.has(input), `api.inputs row for [${input}]`).toBe(true);
		}
	});

	it('documents no input the component does not declare', () => {
		const declared = new Set(declaredInputs());

		for (const row of buildPage().library.api.inputs) {
			expect(declared.has(row.name), `api.inputs row "${row.name}" has no declaration`).toBe(true);
		}
	});

	it('documents every output, the write half of each two-way model included', () => {
		const documented = new Set(buildPage().library.api.outputs.map((row) => row.name));

		for (const output of declaredOutputs()) {
			expect(documented.has(output), `api.outputs row for (${output})`).toBe(true);
		}
	});

	/**
	 * `model()` and `output()` both produce an `OutputEmitterRef`, never the `EventEmitter` of the
	 * decorator era: a consumer who copies the documented type into a handler signature or a
	 * `viewChild` annotation gets a compile error out of the documentation.
	 */
	it('types outputs the way output() and model() type them', () => {
		for (const row of buildPage().library.api.outputs) {
			expect(row.type, `output "${row.name}"`).toMatch(/^OutputEmitterRef<.+>$/);
		}
	});

	/** A method the migration guide instructs the reader to call has to appear in the API table. */
	it('documents resizeCanvas(), which the migration guide tells consumers to call', () => {
		expect(MIGRATION, 'the guide still asks for the call').toContain('Call `resizeCanvas()` yourself');
		expect(COMPONENT, 'the method is still public').toMatch(/^\tresizeCanvas\(\): void \{/m);

		const documented = (buildPage().library.api.methods ?? []).map((method) => method.name);
		expect(documented, 'api.methods').toContain('resizeCanvas');
	});

	it('lists every released version of the library, with its release date', () => {
		const documented = new Map(buildPage().library.overview.changelog.map((entry) => [entry.version, entry.date]));

		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	/**
	 * `classlist` is bound on the host, so a rule written against the canvas matches nothing —
	 * and nothing errors to say why.
	 */
	it('puts classlist on the host, which is where the component binds it', () => {
		expect(COMPONENT, 'the host binding').toContain("host: { '[class]': 'classlist()'");

		const row = buildPage().library.api.inputs.find((input) => input.name === 'classlist');
		expect(row?.description, 'classlist description').toContain('host');
		expect(row?.description, 'classlist description').not.toMatch(/classes applied to the drawing surface/i);
	});

	it('registers every new example and titles it in every language bundle', async () => {
		buildPage();
		const registry = TestBed.inject(ExampleRegistry);

		for (const id of ['signature-surface', 'signature-label-type', 'signature-naming', 'signature-projected-templates']) {
			const example = registry.get(id);
			expect(example, `registered example ${id}`).toBeDefined();
			await expect(registry.loadComponent(id)).resolves.toBeTruthy();

			for (const [language, bundle] of TRANSLATIONS) {
				for (const suffix of ['TITLE', 'DESCRIPTION']) {
					const key = `${example!.title.replace(/\.TITLE$/, '')}.${suffix}`;
					const text = resolve(bundle, key);

					expect(`${language} ${key}: ${typeof text}`).toBe(`${language} ${key}: string`);
				}
			}
		}
	});
});

describe('signature reference documents', () => {
	/**
	 * `redraw()` has been browser-guarded since 22.6.1. A warning that outlives its defect sends a
	 * reader to budget for work already done, and makes the surrounding warnings cheaper to ignore.
	 */
	it('does not warn about unguarded server-side rendering while redraw() guards it', () => {
		expect(COMPONENT, 'the guard').toMatch(/private redraw\(\): void \{\n\t\tif \(!this\.isBrowser\) return;/);

		expect(MIGRATION, 'MIGRATION.md').not.toContain('Server-side rendering is not guarded');
		expect(MIGRATION, 'MIGRATION.md').not.toContain('calls `redraw()` unconditionally');
		expect(MIGRATION, 'the migration checklist').not.toContain(
			'Server-side rendering proven for a page containing the field'
		);
	});

	/**
	 * 22.5.0 gave the drawing surface the danger border. The touched-state section still denied it,
	 * three screens below the section that documents it.
	 */
	it('does not deny the invalid border the template applies', () => {
		expect(TEMPLATE, 'the invalid class').toContain('[class.hub-signature--invalid]="isInvalid"');
		expect(MIGRATION, 'MIGRATION.md').not.toContain('there is still no border change');
	});

	it('describes classlist against the host in FUNCTIONALITIES.md too', () => {
		expect(FUNCTIONALITIES, 'FUNCTIONALITIES.md').not.toContain('`classlist` on the drawing surface');
		expect(FUNCTIONALITIES, 'FUNCTIONALITIES.md').toContain('`classlist` on the host element');
	});

	it('gives every input a row in the FUNCTIONALITIES.md table', () => {
		// The table only: the closing prose names inputs too, and would hide a missing row.
		const table = FUNCTIONALITIES.split('\n')
			.filter((line) => line.startsWith('|') && !line.startsWith('| :'))
			.join('\n');
		expect(table.split('\n').length, 'rows found').toBeGreaterThan(30);

		for (const input of declaredInputs()) {
			// Opening backtick only: a row may qualify the name, as `formTextType="tooltip"` does.
			expect(table, `row mentioning \`${input}\``).toContain(`\`${input}`);
		}
	});

	/** `strokeColor` is bound by the reactive-form example, so its row cannot claim no coverage. */
	it('marks a functionality covered when an example actually exercises it', () => {
		const example = readFileSync(
			`${REPO_ROOT}/src/app/pages/examples/signature/form-signature-example.component.ts`,
			'utf8'
		);
		expect(example, 'the form example').toContain('[strokeColor]="\'#212529\'"');

		const row = FUNCTIONALITIES.split('\n').find((line) => line.includes('`strokeColor`'));
		expect(row, 'the strokeColor row').toContain('[x]');
	});
});

describe('signature README', () => {
	it('names every input a consumer can bind, in both languages', () => {
		for (const [name, source] of READMES) {
			for (const input of declaredInputs()) {
				expect(source, `\`${input}\` in ${name}`).toContain(`\`${input}\``);
			}
		}
	});

	/**
	 * The migration guide is the document that says which stored signatures cannot be loaded back
	 * at all. A Spanish reader arriving from `angular2-signaturepad` was never told it exists.
	 */
	it('points at the migration guide in both languages', () => {
		for (const [name, source] of READMES) {
			expect(source, `MIGRATION.md link in ${name}`).toContain('](./MIGRATION.md)');
			expect(source, `migration heading in ${name}`).toMatch(/^## Migra/m);
		}
	});
});
