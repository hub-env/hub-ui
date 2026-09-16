import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { HubToastService, provideToast } from 'ng-hub-ui-toast';
import { ConfigToastExampleComponent } from '../examples/toast/config-toast-example.component';
import { ToastDocsComponent } from './toast.component';

/**
 * Everything the toast documentation says is hand-written prose: the page's API rows, both
 * READMEs, `BREAKING_CHANGES.md` and `FUNCTIONALITIES.md`. Nothing fails when the library grows
 * a peer dependency, renames a token, widens a type or cuts a release, so the documentation
 * drifts silently and a consumer acts on the lie. This suite is the missing compiler: it reads
 * the manifest, the stylesheets, the type declarations, the public API and the changelog, and
 * makes the documentation answer to them.
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

const LIB = `${REPO_ROOT}/projects/toast`;

/** Both language editions of the README, keyed by the name a failure message should show. */
const READMES: ReadonlyArray<[string, string]> = [
	['README.md', readFileSync(`${LIB}/README.md`, 'utf8')],
	['README.es.md', readFileSync(`${LIB}/README.es.md`, 'utf8')]
];

const MANIFEST = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8')) as {
	peerDependencies: Record<string, string>;
};

/** Builds the page outside a template, which is the only way to read `toastLibrary`. */
function buildPage(): ToastDocsComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new ToastDocsComponent());
	page.ngOnInit();
	return page;
}

/** Every sentence the page shows as prose, where a stale claim about the code would hide. */
function pageProse(page: ToastDocsComponent): string[] {
	const { description, overview } = page.toastLibrary;
	return [description, overview.text, ...(overview.highlights ?? []).map((highlight) => highlight.description)];
}

/**
 * The `--hub-toast-*` defaults, read from the one block in each stylesheet that declares the
 * token contract — not from the `[data-type]` rules below it, which re-base a few of them.
 */
function tokenDefaults(): Map<string, string> {
	const blocks = [
		[`${LIB}/src/lib/components/toast/toast.component.scss`, ':where(:host) {'],
		[`${LIB}/src/lib/components/toast-container/toast-container.component.scss`, ':host {']
	] as const;

	const defaults = new Map<string, string>();
	for (const [file, opener] of blocks) {
		const scss = readFileSync(file, 'utf8');
		const start = scss.indexOf(opener);
		const block = scss.slice(start, scss.indexOf('\n}', start));
		for (const [, name, value] of block.matchAll(/^\t(--hub-toast-[\w-]+):\s*([^;]+);$/gm)) {
			defaults.set(name, value.trim());
		}
	}
	return defaults;
}

/** Each `HubToastConfig` option and the type the interface gives it. */
function configOptionTypes(): Map<string, string> {
	const source = readFileSync(`${LIB}/src/lib/models/toast.types.ts`, 'utf8');
	const start = source.indexOf('export interface HubToastConfig {');
	const block = source.slice(start, source.indexOf('\n}', start));

	const options = new Map<string, string>();
	for (const [, name, type] of block.matchAll(/^\t(\w+): (.+);$/gm)) {
		options.set(name, type.trim());
	}
	return options;
}

/** Every symbol `public-api.ts` re-exports, values and types alike. */
function publicExports(): string[] {
	const source = readFileSync(`${LIB}/src/public-api.ts`, 'utf8');
	return [...source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)]
		.flatMap(([, names]) => names.split(','))
		.map((name) => name.trim().split(/\s+as\s+/)[0])
		.filter(Boolean);
}

/** Released versions, newest first, as the CHANGELOG records them. */
function releasedVersions(): { version: string; date: string }[] {
	const changelog = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
	return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)].map(([, version, date]) => ({
		version,
		date
	}));
}

/** Versions whose CHANGELOG entry calls itself BREAKING, and therefore owe a migration note. */
function versionsMarkedBreaking(): string[] {
	const changelog = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
	const sections = changelog.split(/^## /m).filter((section) => /^\[\d+\.\d+\.\d+\]/.test(section));
	return sections
		.filter((section) => section.includes('BREAKING'))
		.map((section) => /^\[(\d+\.\d+\.\d+)\]/.exec(section)![1]);
}

describe('toast documentation page', () => {
	it('lists every released version of the library, with its release date', () => {
		const documented = new Map(buildPage().toastLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('types outputs as OutputEmitterRef, which is what output() produces', () => {
		for (const row of buildPage().toastLibrary.api.outputs) {
			expect(row.type, `output "${row.name}"`).toMatch(/^OutputEmitterRef<.+>$/);
		}
	});

	it('does not sell the package as dependency-free while the manifest declares a non-Angular peer', () => {
		const foreignPeers = Object.keys(MANIFEST.peerDependencies).filter((name) => !name.startsWith('@angular/'));
		expect(foreignPeers.length, 'this test only has something to say once a foreign peer exists').toBeGreaterThan(0);

		for (const sentence of pageProse(buildPage())) {
			expect(sentence, 'page prose').not.toMatch(/zero[- ]dependenc|no external dependenc/i);
		}
	});

	it('does not claim zero manual change detection while the service calls detectChanges()', () => {
		const service = readFileSync(`${LIB}/src/lib/services/toast.service.ts`, 'utf8');
		expect(service, 'the service still drives the container by hand').toContain('detectChanges()');

		for (const sentence of pageProse(buildPage())) {
			expect(sentence, 'page prose').not.toMatch(/zero manual change[- ]detection/i);
		}
	});
});

describe('toast README', () => {
	it('declares every peer dependency the manifest declares', () => {
		for (const [name, source] of READMES) {
			for (const [peer, range] of Object.entries(MANIFEST.peerDependencies)) {
				expect(source, `${peer} in ${name}`).toContain(`"${peer}": "${range}"`);
			}
		}
	});

	it('documents every --hub-toast-* token with the default the stylesheets declare', () => {
		const defaults = tokenDefaults();
		expect(defaults.size, 'tokens found in the stylesheets').toBeGreaterThan(20);

		for (const [name, source] of READMES) {
			for (const [token, value] of defaults) {
				expect(source, `${token} in ${name}`).toContain(`| \`${token}\` | \`${value}\` |`);
			}
		}
	});

	it('types every HubToastConfig option the way the interface types it', () => {
		const options = configOptionTypes();
		expect(options.size, 'options found in HubToastConfig').toBe(12);

		for (const [name, source] of READMES) {
			for (const [option, type] of options) {
				const cell = `| \`${option}\` | \`${type.replaceAll('|', '\\|')}\` |`;
				expect(source, `${option} in ${name}`).toContain(cell);
			}
		}
	});

	it('names every symbol the public API exports', () => {
		const exported = publicExports();
		expect(exported).toContain('HubToastConfigService');

		for (const [name, source] of READMES) {
			for (const symbol of exported) {
				expect(source, `${symbol} in ${name}`).toContain(symbol);
			}
		}
	});
});

describe('toast reference documents', () => {
	it('gives every version the CHANGELOG marks BREAKING a section in BREAKING_CHANGES.md', () => {
		const breaking = versionsMarkedBreaking();
		expect(breaking.length, 'versions marked BREAKING in the CHANGELOG').toBeGreaterThan(0);

		const notes = readFileSync(`${LIB}/BREAKING_CHANGES.md`, 'utf8');
		for (const version of breaking) {
			expect(notes, `migration note for ${version}`).toContain(`## [${version}]`);
		}
	});

	it('records every configuration option in FUNCTIONALITIES.md', () => {
		const functionalities = readFileSync(`${LIB}/FUNCTIONALITIES.md`, 'utf8');

		for (const option of configOptionTypes().keys()) {
			expect(functionalities, `row for ${option}`).toContain(`\`${option}\``);
		}
	});
});

describe('toast configuration example', () => {
	/** Collects the per-call config the example hands the service, without opening a toast. */
	function spyService(): { calls: Record<string, unknown>[]; service: unknown } {
		const calls: Record<string, unknown>[] = [];
		const record = (_message: string, _title: string, config: Record<string, unknown>) => calls.push(config);
		return { calls, service: { info: record, warning: record } };
	}

	/**
	 * The `×` is decorative, so `closeButtonAriaLabel` is the whole name a screen reader has for
	 * the toast's only control. An example that never passes it leaves the option invisible on
	 * the site and its snippet teaches the English literal as if it were a given.
	 */
	it('passes the name it shows to every toast it fires', () => {
		const { calls, service } = spyService();
		TestBed.configureTestingModule({ providers: [{ provide: HubToastService, useValue: service }] });

		const fixture = TestBed.createComponent(ConfigToastExampleComponent);
		fixture.detectChanges();
		fixture.componentInstance.closeButtonAriaLabel = 'Cerrar el aviso';
		fixture.componentInstance.showConfigured();
		fixture.componentInstance.showPersistent();

		expect(calls).toHaveLength(2);
		for (const config of calls) {
			expect(config['closeButtonAriaLabel']).toBe('Cerrar el aviso');
		}
	});

	/**
	 * The demo states what a call inherits when it says nothing. Repeating the literal would let
	 * the page keep claiming a default `provideToast()` had already replaced.
	 */
	it('reads the application-wide default rather than repeating it', () => {
		const { service } = spyService();
		TestBed.configureTestingModule({
			providers: [{ provide: HubToastService, useValue: service }, provideToast({ closeButtonAriaLabel: 'Cerrar' })]
		});

		const fixture = TestBed.createComponent(ConfigToastExampleComponent);
		fixture.detectChanges();

		expect(fixture.componentInstance.globalCloseButtonAriaLabel).toBe('Cerrar');
		expect(fixture.componentInstance.closeButtonAriaLabel).toBe('Cerrar');

		const copy = (fixture.nativeElement as HTMLElement).textContent ?? '';
		expect(copy, 'the demo states the inherited default').toContain('"Cerrar"');
		expect(copy, 'and the call that sets it once').toContain('provideToast({ closeButtonAriaLabel })');
	});

	it('shows both levels of configuration in the snippet a reader copies', () => {
		expect(ConfigToastExampleComponent.componentCode).toContain('provideToast(');
		expect(ConfigToastExampleComponent.componentCode).toContain('closeButtonAriaLabel');
	});
});
