import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import * as modalPublicApi from 'ng-hub-ui-modal';
import { ProjectionModalExampleComponent } from '../examples/modal/projection-modal-example.component';
import { ModalComponent } from './modal.component';

/**
 * The modal page describes an API it cannot see: every row is hand-written data, so nothing
 * fails when an option is added, a symbol is renamed or a release is cut. That is how the page
 * came to document a `closeOnNavigation` the library never had, to sell a `ModalService` and a
 * `ModalRef` that are not exported, to skip eleven published versions and to invent a `1.2.0`.
 * This suite is the missing compiler: it reads the library's own source and makes the page
 * answer to it.
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

/** Builds the page outside a template, which is the only way to read `modalLibrary`. */
function buildPage(): ModalComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new ModalComponent());
	page.ngOnInit();
	return page;
}

/**
 * Members of `HubModalOptions`, read from the source: it is an interface, so it leaves nothing
 * behind at runtime to reflect over.
 */
function declaredOptions(): string[] {
	const source = readFileSync(`${REPO_ROOT}/projects/modal/src/lib/modal-config.ts`, 'utf8');
	const start = source.indexOf('export interface HubModalOptions');
	const body = source.slice(start, source.indexOf('\n}', start));

	return [...body.matchAll(/^\t([A-Za-z]\w*)\??:/gm)].map(([, name]) => name);
}

/** Released versions of the library, as the CHANGELOG records them. */
function releasedVersions(): { version: string; date: string }[] {
	const changelog = readFileSync(`${REPO_ROOT}/projects/modal/CHANGELOG.md`, 'utf8');
	return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)].map(([, version, date]) => ({
		version,
		date
	}));
}

/** Class names the library's stylesheet actually declares, expanded from its BEM nesting. */
function styledClasses(): Set<string> {
	const scss = readFileSync(`${REPO_ROOT}/projects/modal/src/lib/modal.scss`, 'utf8');
	const classes = new Set<string>();

	for (const [, name] of scss.matchAll(/&(__|--)([\w-]+)/g)) {
		classes.add(name);
	}
	for (const [, separator, name] of scss.matchAll(/&(__|--)([\w-]+)/g)) {
		classes.add(`hub-modal${separator}${name}`);
	}
	for (const [, name] of scss.matchAll(/\.([a-z][\w-]*)/g)) {
		classes.add(name);
	}

	return classes;
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

describe('modal documentation page', () => {
	it('documents every option HubModalOptions declares, and no other', () => {
		const documented = buildPage().modalLibrary.api.inputs.map((row) => row.name);

		expect([...documented].sort()).toEqual([...declaredOptions()].sort());
	});

	it('lists every released version of the library, with its release date', () => {
		const documented = new Map(buildPage().modalLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('invents no version the CHANGELOG does not record', () => {
		const released = new Set(releasedVersions().map((entry) => entry.version));

		for (const entry of buildPage().modalLibrary.overview.changelog) {
			expect(released.has(entry.version), `${entry.version} is in the CHANGELOG`).toBe(true);
		}
	});

	/** The overview is the first thing a reader trusts, so it may only name exported symbols. */
	it('names only symbols the package exports in its overview', () => {
		const page = buildPage();
		const prose = [
			page.modalLibrary.overview.text ?? '',
			...(page.modalLibrary.overview.highlights ?? []).map((highlight) => `${highlight.title} ${highlight.description}`)
		].join(' ');
		const exported = new Set(Object.keys(modalPublicApi));

		for (const [symbol] of prose.matchAll(/\b[A-Z]\w*Modal\w*\b/g)) {
			expect(exported.has(symbol), `${symbol} is exported by ng-hub-ui-modal`).toBe(true);
		}
	});

	/** A snippet is copied verbatim, so a class the stylesheet never declares ships unstyled. */
	it('writes only classes the stylesheet declares in its template snippets', () => {
		const declared = styledClasses();

		for (const slot of buildPage().modalLibrary.api.templates ?? []) {
			for (const [, attribute] of (slot.example ?? '').matchAll(/class="([^"]+)"/g)) {
				for (const name of attribute.split(/\s+/).filter(Boolean)) {
					expect(declared.has(name), `class "${name}" is declared in modal.scss`).toBe(true);
				}
			}
		}
	});

	it('translates every key the page references, in all eight languages', () => {
		const page = buildPage();
		const keys = [
			...page.modalLibrary.api.inputs.map((row) => row.description),
			...(page.modalLibrary.api.outputs ?? []).map((row) => row.description),
			...(page.modalLibrary.api.templates ?? []).flatMap((slot) => [slot.name, slot.description]),
			...page.modalLibrary.functionalities.flatMap((group) => [group.title, group.description])
		].filter((key): key is string => !!key && key.startsWith('DOCS.'));

		for (const language of LANGUAGES) {
			const dictionary = JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`, 'utf8'));
			for (const key of keys) {
				expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
			}
		}
	});
});

describe('modal projection example', () => {
	afterEach(() => {
		document.querySelectorAll('hub-modal-window, hub-modal-backdrop').forEach((element) => element.remove());
	});

	/**
	 * Naming a slot is what makes the library draw its own header, so this is the one example
	 * where the dismiss button exists at all. That button has no text — its glyph is painted by
	 * CSS — so a demo that leaves `closeAriaLabel` alone ships the English literal the option
	 * exists to replace, and the snippet beside it teaches the reader to do the same.
	 */
	it('names the dismiss button the library draws for it', () => {
		TestBed.configureTestingModule({});
		const fixture = TestBed.createComponent(ProjectionModalExampleComponent);
		fixture.detectChanges();

		fixture.componentInstance.openModal();

		const closeButton = document.querySelector('.hub-modal__close');
		expect(closeButton, 'the library draws its own header for a named slot').not.toBeNull();
		expect(closeButton?.getAttribute('aria-label')).toBe('Close the projected dialog');
	});

	it('carries the option into the snippet a reader copies', () => {
		expect(ProjectionModalExampleComponent.componentCode).toContain('closeAriaLabel');
		expect(ProjectionModalExampleComponent.componentCode).toContain('HubModalConfig');
	});
});
