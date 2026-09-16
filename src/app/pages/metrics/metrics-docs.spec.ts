import { Type, reflectComponentType } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { HubMeterComponent, HubProgressComponent, HubRingComponent } from 'ng-hub-ui-metrics';
import { MeterMetricsExampleComponent } from '../examples/metrics/meter-metrics-example.component';
import { MixinMetricsExampleComponent } from '../examples/metrics/mixin-metrics-example.component';
import { RingMetricsExampleComponent } from '../examples/metrics/ring-metrics-example.component';
import { StylingMetricsExampleComponent } from '../examples/metrics/styling-metrics-example.component';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { METRICS_FUNCTIONALITIES } from './metrics-functionalities';
import { MetricsComponent } from './metrics.component';

/**
 * The metrics page, the two READMEs and the eight locale files describe an API none of them
 * can see: every row is hand-written prose, so nothing breaks when an input turns optional,
 * a token is added or a release ships. This suite is the missing compiler — it reads the
 * components, the stylesheets, the manifest and the CHANGELOG, and makes the documentation
 * answer to them.
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

const LIBRARY = `${REPO_ROOT}/projects/metrics`;
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;
const READMES = ['README.md', 'README.es.md'] as const;

/** Row prefix the page uses to say which component an API row belongs to. */
const COMPONENTS: ReadonlyArray<{ prefix: string; type: Type<unknown> }> = [
	{ prefix: 'hub-progress · ', type: HubProgressComponent },
	{ prefix: 'hub-meter · ', type: HubMeterComponent },
	{ prefix: 'hub-ring · ', type: HubRingComponent }
];

/**
 * Token tables the READMEs print, against the defaults each component declares. `--hub-meter-fill`
 * is excluded because it is not a knob: the band modifiers resolve it from the `-bg` tokens, and
 * only the CSS reference documents it as an internal slot.
 */
const TOKEN_TABLES: ReadonlyArray<{ scss: string; block: string; prefix: string; internal?: string[] }> = [
	{ scss: 'progress/progress.component.scss', block: ':where(.hub-progress)', prefix: '--hub-progress-' },
	{ scss: 'meter/meter.component.scss', block: ':where(.hub-meter)', prefix: '--hub-meter-', internal: ['--hub-meter-fill'] },
	{ scss: 'ring/ring.component.scss', block: ':where(.hub-ring)', prefix: '--hub-ring-' }
];

/** Every public input of the three components, named the way the page names it. */
function declaredInputs(): string[] {
	return COMPONENTS.flatMap(({ prefix, type }) => {
		const mirror = reflectComponentType(type);
		if (!mirror) {
			throw new Error(`${type.name} is not a component`);
		}
		return mirror.inputs.map((input) => `${prefix}${input.templateName}`);
	});
}

/** Custom properties a component declares as its own defaults, minus the derived slots. */
function declaredTokens(table: (typeof TOKEN_TABLES)[number]): string[] {
	const scss = readFileSync(`${LIBRARY}/src/lib/components/${table.scss}`, 'utf8');
	const start = scss.indexOf(`${table.block} {`);
	const block = scss.slice(start, scss.indexOf('\n}', start));

	return [...block.matchAll(/^\t(--[\w-]+):/gm)]
		.map(([, name]) => name)
		.filter((name) => name.startsWith(table.prefix) && !(table.internal ?? []).includes(name));
}

/** Released versions of the library, newest first, as the CHANGELOG records them. */
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

/** Builds the page outside a template, which is the only way to read `metricsLibrary`. */
function buildPage(): { page: MetricsComponent; registry: ExampleRegistry } {
	TestBed.configureTestingModule({});
	const registry = TestBed.inject(ExampleRegistry);
	const page = TestBed.runInInjectionContext(() => new MetricsComponent());
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

describe('metrics documentation page', () => {
	it('documents every input the three components declare, and no other', () => {
		const { page } = buildPage();
		const documented = page.metricsLibrary.api.inputs.map((row) => row.name);

		expect([...documented].sort()).toEqual([...declaredInputs()].sort());
	});

	it('types the progress color row as the optional input the component declares', () => {
		const source = readFileSync(`${LIBRARY}/src/lib/components/progress/progress.component.ts`, 'utf8');
		expect(source).toContain('readonly color = input<HubMetricsColor | undefined>(undefined)');

		const { page } = buildPage();
		const row = page.metricsLibrary.api.inputs.find((input) => input.name === 'hub-progress · color');

		expect(row?.type).toBe('HubMetricsColor | undefined');
		expect(row?.defaultValue).toBe('undefined');
	});

	it('lists every released version of the library, with its release date', () => {
		const { page } = buildPage();
		const documented = new Map(page.metricsLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('groups every registered example under a feature heading', () => {
		const { registry } = buildPage();
		const registered = registry.getAll().map((example) => example.id);
		const grouped = METRICS_FUNCTIONALITIES.flatMap((group) => group.exampleIds);

		expect([...registered].sort()).toEqual([...grouped].sort());
	});

	it('translates every key the page and its feature groups reference, in all eight languages', () => {
		const { page } = buildPage();
		const keys = [
			...page.metricsLibrary.api.inputs.map((row) => row.description),
			...page.metricsLibrary.api.templates.map((slot) => slot.description),
			...METRICS_FUNCTIONALITIES.flatMap((group) => [group.title, group.description])
		].filter((key) => key?.startsWith('DOCS.'));

		for (const language of LANGUAGES) {
			const dictionary = JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`, 'utf8'));
			for (const key of keys) {
				expect(typeof lookup(dictionary, key), `${key} in ${language}.json`).toBe('string');
			}
		}
	});

	it('describes the progress color input as reaching the accent token, not only the semantic families', () => {
		for (const language of LANGUAGES) {
			const dictionary = JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`, 'utf8'));
			const description = lookup(dictionary, 'DOCS.METRICS.API.PROGRESS.INPUT.COLOR.DESCRIPTION') as string;

			expect(description, `color description in ${language}.json`).toContain('--hub-progress-accent');
		}
	});
});

describe('metrics README', () => {
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
		expect(readme).not.toMatch(/Zero external dependencies|Sin dependencias externas/);
	});

	it.each(READMES)('%s tables every token the components declare as themeable', (file) => {
		const readme = readFileSync(`${LIBRARY}/${file}`, 'utf8');
		// Anchored at the start of the row: a token also shows up as another row's default
		// value, and a mention there is not documentation of the token itself.
		const documented = new Set([...readme.matchAll(/^\| `(--[\w-]+)` \|/gm)].map(([, token]) => token));

		for (const table of TOKEN_TABLES) {
			for (const token of declaredTokens(table)) {
				expect(documented.has(token), `${token} tabled in ${file}`).toBe(true);
			}
		}
	});

	it('ships the coverage table the family documents itself with', () => {
		expect(existsSync(`${LIBRARY}/FUNCTIONALITIES.md`)).toBe(true);
	});
});

describe('metrics example snippets', () => {
	/**
	 * ExampleViewer reads the snippets off the class before it ever constructs one, so an
	 * example that keeps them as instance fields renders empty code tabs the day it reaches
	 * for `inject()`.
	 */
	it.each([
		['StylingMetricsExampleComponent', StylingMetricsExampleComponent],
		['MixinMetricsExampleComponent', MixinMetricsExampleComponent]
	] as const)('%s exposes its snippets statically', (_name, ctor) => {
		const type = ctor as unknown as { templateCode?: string; componentCode?: string };

		expect(typeof type.templateCode).toBe('string');
		expect(type.templateCode).not.toBe('');
		expect(typeof type.componentCode).toBe('string');
		expect(type.componentCode).not.toBe('');
	});

	/**
	 * A theme set on a bare wrapper is shadowed: each component declares its own defaults on
	 * `:where(.hub-<comp>)`, and a custom property on the element beats one inherited from an
	 * ancestor. The snippet in the CSS tab is what a reader copies, so it must not teach the
	 * mistake the 22.0.1 release note exists to warn about.
	 */
	it('scopes the theming snippet on the components, not on the bare wrapper', () => {
		const css = StylingMetricsExampleComponent.cssCode;
		const wrapperBlock = /\.metrics-brand-theme \{([\s\S]*?)\n\}/.exec(css);

		expect(wrapperBlock?.[1]).toBeDefined();
		expect(wrapperBlock?.[1]).not.toMatch(/^\s*--hub-/m);
		expect(css).toContain('.metrics-brand-theme :where(');
	});
});

describe('metrics example accessibility', () => {
	/**
	 * `role="meter"` is named by the author alone: the meter draws no text and the ring's
	 * projected caption is decoration, so an example that omits `label` ships a gauge that
	 * reaches a screen reader unnamed — and teaches the reader to do the same, because the
	 * code tab beside it is what gets copied.
	 */
	it.each([
		['MeterMetricsExampleComponent', MeterMetricsExampleComponent],
		['RingMetricsExampleComponent', RingMetricsExampleComponent],
		['StylingMetricsExampleComponent', StylingMetricsExampleComponent],
		['MixinMetricsExampleComponent', MixinMetricsExampleComponent]
	] as const)('%s names every meter and ring it renders', (_name, ctor) => {
		const fixture = TestBed.createComponent(ctor as Type<unknown>);
		fixture.detectChanges();

		const gauges = fixture.nativeElement.querySelectorAll('hub-meter, hub-ring') as NodeListOf<HTMLElement>;
		expect(gauges.length, 'gauges rendered by the example').toBeGreaterThan(0);

		for (const gauge of gauges) {
			expect(gauge.getAttribute('aria-label')?.trim(), `${gauge.tagName.toLowerCase()} accessible name`).toBeTruthy();
		}
	});

	/** The snippet is the half a reader takes away, so it has to carry the input too. */
	it.each([
		['MeterMetricsExampleComponent', MeterMetricsExampleComponent],
		['RingMetricsExampleComponent', RingMetricsExampleComponent],
		['StylingMetricsExampleComponent', StylingMetricsExampleComponent],
		['MixinMetricsExampleComponent', MixinMetricsExampleComponent]
	] as const)('%s names every gauge in its template snippet', (_name, ctor) => {
		const snippet = (ctor as unknown as { templateCode: string }).templateCode;
		const tags = [...snippet.matchAll(/<hub-(?:meter|ring)\b[\s\S]*?>/g)].map(([tag]) => tag);

		expect(tags.length, 'gauges written in the snippet').toBeGreaterThan(0);
		for (const tag of tags) {
			expect(tag, 'gauge in the template snippet').toMatch(/\[?label\]?=/);
		}
	});
});

describe('metrics mixin demo', () => {
	/**
	 * The preview is read beside the SCSS the page prints for it, so the two have to agree.
	 * The mixin emits its tokens ON the metrics elements; a demo that sets them on the bare
	 * scope is shadowed by each component's own `:where(.hub-<comp>)` defaults, and the reader
	 * sees the library default while the snippet next to it claims another accent and radius.
	 */
	it('paints the accent and radius the snippet beside it declares', () => {
		const { page } = buildPage();
		const snippet = page.metricsLibrary.mixins?.demos?.[0]?.code ?? '';
		const accent = /\$accent:\s*([^,\s)]+)/.exec(snippet)?.[1];
		const radius = /\$radius:\s*([^,\s)]+)/.exec(snippet)?.[1];

		expect(accent, 'accent in the mixin demo snippet').toBeDefined();
		expect(radius, 'radius in the mixin demo snippet').toBeDefined();

		const fixture = TestBed.createComponent(MixinMetricsExampleComponent);
		fixture.detectChanges();
		const progress = fixture.nativeElement.querySelector('hub-progress') as HTMLElement;
		const ring = fixture.nativeElement.querySelector('hub-ring') as HTMLElement;

		expect(getComputedStyle(progress).getPropertyValue('--hub-progress-accent').trim()).toBe(accent);
		expect(getComputedStyle(progress).getPropertyValue('--hub-progress-radius').trim()).toBe(radius);
		expect(getComputedStyle(ring).getPropertyValue('--hub-ring-indicator').trim()).toBe(accent);
	});
});
