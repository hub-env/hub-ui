import { Type, reflectComponentType } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { HubBadgeComponent, HubChipComponent, HubChipSetComponent } from 'ng-hub-ui-badges';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BADGES_FUNCTIONALITIES } from './badges-functionalities';
import { BADGES_PLAYGROUND } from './badges-playground';
import { BadgesDocsComponent } from './badges.component';

/**
 * The badges page describes an API it cannot see: its rows are hand-written data, so nothing
 * fails when the library grows an input, renames an output type or cuts a release. This suite
 * is that missing compiler — it reads the components, the CHANGELOG and the stylesheet and
 * makes the page answer to them.
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

/** Row prefix the page uses to say which component an API row belongs to. */
const COMPONENTS: ReadonlyArray<{ prefix: string; type: Type<unknown> }> = [
	{ prefix: '', type: HubBadgeComponent },
	{ prefix: 'hub-chip · ', type: HubChipComponent },
	{ prefix: 'hub-chip-set · ', type: HubChipSetComponent }
];

/** Every public input / output of the three components, named the way the page names them. */
function declaredApi(): { inputs: string[]; outputs: string[] } {
	const inputs: string[] = [];
	const outputs: string[] = [];

	for (const { prefix, type } of COMPONENTS) {
		const mirror = reflectComponentType(type);
		if (!mirror) {
			throw new Error(`${type.name} is not a component`);
		}
		inputs.push(...mirror.inputs.map((input) => `${prefix}${input.templateName}`));
		outputs.push(...mirror.outputs.map((output) => `${prefix}${output.templateName}`));
	}

	return { inputs, outputs };
}

/** Builds the page outside a template, which is the only way to read `badgesLibrary`. */
function buildPage(): { page: BadgesDocsComponent; registry: ExampleRegistry } {
	TestBed.configureTestingModule({});
	const registry = TestBed.inject(ExampleRegistry);
	const page = TestBed.runInInjectionContext(() => new BadgesDocsComponent());
	page.ngOnInit();
	return { page, registry };
}

/**
 * Unwraps `var(--token, fallback)` down to the literal the browser lands on when the design
 * system is not loaded — which is exactly what a playground default has to mirror.
 */
function resolveFallback(value: string): string {
	let current = value.trim();
	let match = /^var\(\s*--[\w-]+\s*,\s*([\s\S]+)\)$/.exec(current);
	while (match) {
		current = match[1].trim();
		match = /^var\(\s*--[\w-]+\s*,\s*([\s\S]+)\)$/.exec(current);
	}
	return current;
}

/** The `--hub-badge-*` defaults declared in the component's base block. */
function badgeTokenDefaults(): Map<string, string> {
	const scss = readFileSync(`${REPO_ROOT}/projects/badges/src/lib/components/badge/badge.component.scss`, 'utf8');
	const start = scss.indexOf(':where(.hub-badge) {');
	const block = scss.slice(start, scss.indexOf('\n}', start));

	const defaults = new Map<string, string>();
	for (const [, name, value] of block.matchAll(/^\t(--hub-badge-[\w-]+):\s*([^;]+);$/gm)) {
		defaults.set(name, resolveFallback(value));
	}
	return defaults;
}

/** Released versions of the library, newest first, as the CHANGELOG records them. */
function releasedVersions(): { version: string; date: string }[] {
	const changelog = readFileSync(`${REPO_ROOT}/projects/badges/CHANGELOG.md`, 'utf8');
	return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)].map(([, version, date]) => ({
		version,
		date
	}));
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

describe('badges documentation page', () => {
	it('documents every input the three components declare, and no other', () => {
		const { page } = buildPage();
		const documented = page.badgesLibrary.api.inputs.map((row) => row.name);

		expect([...documented].sort()).toEqual([...declaredApi().inputs].sort());
	});

	it('documents every output the three components declare, and no other', () => {
		const { page } = buildPage();
		const documented = page.badgesLibrary.api.outputs.map((row) => row.name);

		expect([...documented].sort()).toEqual([...declaredApi().outputs].sort());
	});

	it('types outputs as OutputEmitterRef, which is what output() and model() produce', () => {
		const { page } = buildPage();

		for (const row of page.badgesLibrary.api.outputs) {
			expect(row.type, `output "${row.name}"`).toMatch(/^OutputEmitterRef<.+>$/);
		}
	});

	it('lists every released version of the library, with its release date', () => {
		const { page } = buildPage();
		const documented = new Map(page.badgesLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('groups every registered example under a feature heading', () => {
		const { registry } = buildPage();
		const registered = registry.getAll().map((example) => example.id);
		const grouped = BADGES_FUNCTIONALITIES.flatMap((group) => group.exampleIds);

		expect([...registered].sort()).toEqual([...grouped].sort());
	});

	it('offers only colours the stylesheet actually registers in the playground', () => {
		const scss = readFileSync(`${REPO_ROOT}/projects/badges/src/lib/components/badge/badge.component.scss`, 'utf8');
		const loop = /@each \$color in ([^{]+)\{/.exec(scss);
		const builtIn = [...(loop?.[1] ?? '').matchAll(/'([\w-]+)'/g)].map(([, name]) => name);
		const colour = BADGES_PLAYGROUND[0].controls.find((control) => control.name === 'color');

		expect(builtIn.length).toBeGreaterThan(0);
		expect(colour?.options?.map((option) => option.value)).toEqual(builtIn);
	});

	it('seeds the playground token controls with the values the stylesheet defaults to', () => {
		const defaults = badgeTokenDefaults();
		const derived = ['--hub-badge-accent-subtle', '--hub-badge-accent-emphasis', '--hub-badge-accent-border'];

		for (const control of BADGES_PLAYGROUND[0].cssVariables ?? []) {
			if (derived.includes(control.name)) {
				continue;
			}
			expect(defaults.get(control.name), `default of ${control.name}`).toBe(control.default);
		}
	});

	it('translates every key the page and its feature groups reference, in all eight languages', () => {
		const { page } = buildPage();
		const keys = [
			...page.badgesLibrary.api.inputs.map((row) => row.description),
			...page.badgesLibrary.api.outputs.map((row) => row.description),
			...page.badgesLibrary.api.templates.map((slot) => slot.description),
			...BADGES_FUNCTIONALITIES.flatMap((group) => [group.title, group.description])
		].filter((key) => key?.startsWith('DOCS.'));

		for (const language of LANGUAGES) {
			const dictionary = JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`, 'utf8'));
			for (const key of keys) {
				expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
			}
		}
	});
});
