import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { TestBed } from '@angular/core/testing';
import { InstallerComponent } from './installer.component';
import { INSTALLER_FUNCTIONALITIES } from './installer-functionalities';

/**
 * The installer is the one published package of the family that ships no components, and its
 * page is shaped by that: Overview and Examples, no API reference, no Styles. Two things can
 * quietly undo it. A key can be added to English and forgotten in the other seven, and the
 * reader of a translated page gets a raw `DOCS.INSTALLER.…` string where a heading should be.
 * And the sentence that used to be true — "the installer has no page on the site" — is still
 * written in four documents, so this suite keeps it from surviving the page it now contradicts.
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

/** Reads a dotted key out of a dictionary, or `undefined` when any segment is missing. */
function lookup(dictionary: unknown, key: string): unknown {
	return key.split('.').reduce<unknown>((node, segment) => {
		if (node && typeof node === 'object' && segment in (node as Record<string, unknown>)) {
			return (node as Record<string, unknown>)[segment];
		}
		return undefined;
	}, dictionary);
}

function dictionary(area: 'docs' | 'seo', language: string): unknown {
	return JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/${area}/${language}.json`, 'utf8'));
}

/** Every `DOCS.INSTALLER.*` key the page and the shell hand to the translator. */
const DOC_KEYS: string[] = (() => {
	const page = readFileSync(`${REPO_ROOT}/src/app/pages/installer/installer.component.ts`, 'utf8');
	const shell = readFileSync(`${REPO_ROOT}/src/app/components/app-shell/app-shell.component.ts`, 'utf8');
	const groups = INSTALLER_FUNCTIONALITIES.flatMap((group) => [group.title, group.description]);
	const literal = [...(page + shell).matchAll(/'(DOCS\.INSTALLER\.[A-Z0-9_.]+)'/g)].map(([, key]) => key);

	// The example descriptions are built from the id at run time, never written out.
	const derived = INSTALLER_FUNCTIONALITIES.flatMap((group) =>
		group.exampleIds.map(
			(id) =>
				`DOCS.INSTALLER.EXAMPLE.${id
					.replace(/^installer-/, '')
					.replace(/-/g, '_')
					.toUpperCase()}.DESCRIPTION`
		)
	);

	return [...new Set([...groups, ...literal, ...derived])].sort();
})();

/** Every `SEO.LIBRARY.INSTALLER.*` key the shared library page reads for this route. */
const SEO_KEYS = [
	'SEO.LIBRARY.INSTALLER.HEADLINE',
	'SEO.LIBRARY.INSTALLER.DESCRIPTION',
	'SEO.LIBRARY.INSTALLER.INTRO',
	'SEO.LIBRARY.INSTALLER.OVERVIEW',
	'SEO.LIBRARY.INSTALLER.HIGHLIGHT.0.TITLE',
	'SEO.LIBRARY.INSTALLER.HIGHLIGHT.1.TITLE',
	'SEO.LIBRARY.INSTALLER.HIGHLIGHT.2.TITLE',
	'SEO.LIBRARY.INSTALLER.USE_CASE.0',
	'SEO.LIBRARY.INSTALLER.FAQ.0.Q',
	'SEO.LIBRARY.INSTALLER.FAQ.0.A'
];

describe('installer documentation page', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	function page(): InstallerComponent {
		const instance = TestBed.runInInjectionContext(() => new InstallerComponent());
		instance.ngOnInit();
		return instance;
	}

	it('names three example ids, and registers exactly those', () => {
		const declared = INSTALLER_FUNCTIONALITIES.flatMap((group) => group.exampleIds);
		const built = page().installerLibrary.functionalities.flatMap((feature) => feature.examples);

		expect(declared.length).toBe(3);
		expect(built.length, 'feature examples that found their registry entry').toBe(declared.length);
	});

	it('claims no component API, because there is none to claim', () => {
		const api = page().installerLibrary.api;

		expect([api.inputs.length, api.outputs.length, api.templates.length, api.cssVariables.length]).toEqual([0, 0, 0, 0]);
		expect(api.methods ?? [], 'a schematic exposes no methods to import').toEqual([]);
	});

	it.each(LANGUAGES)('resolves every DOCS.INSTALLER key it references, in %s', (language) => {
		const dict = dictionary('docs', language);
		const missing = ['DOCS.COMMON.LIBRARY.INSTALLER', ...DOC_KEYS].filter((key) => typeof lookup(dict, key) !== 'string');

		expect(missing, `keys missing from src/app/i18n/docs/${language}.json`).toEqual([]);
	});

	it.each(LANGUAGES)('resolves every SEO.LIBRARY.INSTALLER key the page reads, in %s', (language) => {
		const dict = dictionary('seo', language);
		const missing = SEO_KEYS.filter((key) => typeof lookup(dict, key) !== 'string');

		expect(missing, `keys missing from src/app/i18n/seo/${language}.json`).toEqual([]);
	});

	it('stops the package documents saying the installer has no page on the site', () => {
		const documents = [
			'projects/installer/README.md',
			'projects/installer/README.es.md',
			'projects/installer/FUNCTIONALITIES.md'
		];

		const offending = documents.filter((file) => {
			const text = readFileSync(`${REPO_ROOT}/${file}`, 'utf8').toLowerCase();
			return (
				text.includes('no page on the site') ||
				text.includes('no page of its own') ||
				text.includes('has no page') ||
				text.includes('no tiene página')
			);
		});

		expect(offending, 'documents still denying the page this suite is testing').toEqual([]);
	});
});
