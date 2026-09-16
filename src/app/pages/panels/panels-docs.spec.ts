import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { TestBed } from '@angular/core/testing';
import ar from '../../i18n/docs/ar.json';
import de from '../../i18n/docs/de.json';
import en from '../../i18n/docs/en.json';
import es from '../../i18n/docs/es.json';
import fr from '../../i18n/docs/fr.json';
import ja from '../../i18n/docs/ja.json';
import ru from '../../i18n/docs/ru.json';
import zh from '../../i18n/docs/zh.json';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { MixinPanelsExampleComponent } from '../examples/panels/mixin-panels-example.component';
import { PanelsComponent } from './panels.component';

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

function resolve(bundle: Record<string, any>, key: string): unknown {
	return key.split('.').reduce<any>((node, segment) => (node == null ? undefined : node[segment]), bundle);
}

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

const LIBRARY_ROOT = `${REPO_ROOT}/projects/panels`;

/** The component sources whose declared members the documentation has to cover. */
const COMPONENT_SOURCES = [
	`${LIBRARY_ROOT}/src/lib/components/panels/panels.component.ts`,
	`${LIBRARY_ROOT}/src/lib/components/panel/panel.component.ts`,
	`${LIBRARY_ROOT}/src/lib/components/tab-nav/tab-nav.component.ts`,
	`${LIBRARY_ROOT}/src/lib/components/side-panel/side-panel.component.ts`
];

/**
 * Public reactive members declared by the library, read straight off the sources. Only
 * top-level `readonly x = input|model|output(...)` declarations count: a `protected` member
 * is indented the same way but carries the modifier, so the anchor excludes it.
 */
function declaredMembers(): { name: string; kind: 'input' | 'model' | 'output' }[] {
	return COMPONENT_SOURCES.flatMap((file) =>
		[...readFileSync(file, 'utf8').matchAll(/^\treadonly (\w+) = (input|model|output)\b/gm)].map((match) => ({
			name: match[1],
			kind: match[2] as 'input' | 'model' | 'output'
		}))
	);
}

/** Every symbol the package entry point exports. */
function publicApiExports(): Set<string> {
	const source = readFileSync(`${LIBRARY_ROOT}/src/public-api.ts`, 'utf8');
	return new Set([...source.matchAll(/\b([A-Z]\w+)\b/g)].map((match) => match[1]));
}

/** The two READMEs, keyed by the name that identifies them in a failure message. */
function readmes(): [string, string][] {
	return [
		['README.md', readFileSync(`${LIBRARY_ROOT}/README.md`, 'utf8')],
		['README.es.md', readFileSync(`${LIBRARY_ROOT}/README.es.md`, 'utf8')]
	];
}

describe('panels documentation page', () => {
	let page: PanelsComponent;
	let registry: ExampleRegistry;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		registry = TestBed.inject(ExampleRegistry);
		page = TestBed.runInInjectionContext(() => new PanelsComponent());
		page.ngOnInit();
	});

	/**
	 * The mixin demo shipped as a preview inside the Styles tab only, so the Angular code
	 * behind it was unreachable: nothing registered it, and the viewer has no other way to
	 * reach an example.
	 */
	it('registers the mixin demo as an example of its own', async () => {
		expect(registry.get('panels-mixin')).toBeDefined();
		await expect(registry.loadComponent('panels-mixin')).resolves.toBe(MixinPanelsExampleComponent);
	});

	/**
	 * ExampleViewer reads the snippets off the class before it ever constructs one, so an
	 * example that publishes none renders empty code tabs without saying so.
	 */
	it('fills the mixin example code tabs from static properties', () => {
		const type = MixinPanelsExampleComponent as unknown as {
			templateCode?: string;
			componentCode?: string;
			cssCode?: string;
		};

		for (const tab of ['templateCode', 'componentCode', 'cssCode'] as const) {
			expect(`${tab}:${typeof type[tab]}`).toBe(`${tab}:string`);
			expect(`${tab}:${type[tab]}`).not.toBe(`${tab}:`);
		}

		expect(type.templateCode).toContain('<hub-panels>');
		expect(type.componentCode).toContain('MixinPanelsExampleComponent');
		expect(type.cssCode).toContain('hub-panels-theme');
	});

	it('titles the mixin example in every language bundle', () => {
		const key = 'DOCS.PANELS.EXAMPLE.MIXIN.TITLE';

		for (const [language, bundle] of TRANSLATIONS) {
			const title = resolve(bundle, key);

			expect(`${language}:${typeof title}`).toBe(`${language}:string`);
			expect(`${language}:${title}`).not.toBe(`${language}:`);
		}
	});

	it('titles every registered panels example with a key the bundles define', () => {
		for (const example of registry.getAll().filter((item) => item.packagePath === 'panels')) {
			expect(`${example.id}:${resolve(en, example.title)}`).not.toBe(`${example.id}:undefined`);
		}
	});

	/**
	 * The page's API tables are hand-written while the component API moves, so every table
	 * drifted at once: the container's `variant`, the panel's `id` and the panel's own
	 * `activeChange` were all absent, and a reader had to open the source to find them.
	 */
	it('documents every input and model the library declares', () => {
		const documented = new Set(page.panelsLibrary.api.inputs.map((row) => row.name));
		const missing = declaredMembers()
			.filter((member) => member.kind !== 'output')
			.map((member) => member.name)
			.filter((name) => !documented.has(name));

		expect(missing).toEqual([]);
	});

	it('documents every output the library declares, plus the change half of each model', () => {
		const documented = new Set(page.panelsLibrary.api.outputs.map((row) => row.name));
		const missing = declaredMembers()
			.filter((member) => member.kind !== 'input')
			.map((member) => (member.kind === 'model' ? `${member.name}Change` : member.name))
			.filter((name) => !documented.has(name));

		expect(missing).toEqual([]);
	});

	/**
	 * `variant` and `activeChange` are each declared twice — once on the container or the panel,
	 * once on the other component — and a single row silently stood for both, so the row that
	 * described the alert colour was read as documenting the strip accent added in 22.1.0.
	 */
	it('gives each duplicated member name a row per owning component', () => {
		const rows = (name: string, list: { name: string }[]) => list.filter((row) => row.name === name).length;

		expect(`variant:${rows('variant', page.panelsLibrary.api.inputs)}`).toBe('variant:2');
		expect(`activeChange:${rows('activeChange', page.panelsLibrary.api.outputs)}`).toBe('activeChange:2');
	});

	/**
	 * Descriptions are i18n keys, so a row added without its bundle entries renders as the raw
	 * key. English is the source of truth, but a key missing anywhere shows through in that
	 * language alone, which is exactly the kind of gap nobody reads their way to.
	 */
	it('resolves every API description key in every language bundle', () => {
		const api = page.panelsLibrary.api;
		const keys = [
			...api.inputs.map((row) => row.description),
			...api.outputs.map((row) => row.description),
			...(api.methods ?? []).map((row) => row.description)
		].filter((key) => key.startsWith('DOCS.'));

		expect(keys.length).toBeGreaterThan(0);
		for (const [language, bundle] of TRANSLATIONS) {
			for (const key of keys) {
				const text = resolve(bundle, key);
				expect(`${language}:${key}:${typeof text}`).toBe(`${language}:${key}:string`);
				expect(`${language}:${key}:${text}`).not.toBe(`${language}:${key}:`);
			}
		}
	});

	/**
	 * `removePanelAndRefocus` was announced in 22.9.0 and appeared in no reference at all, so the
	 * only way to find the container's imperative surface was to read the component.
	 */
	it('documents the container methods a consumer can call', () => {
		const names = (page.panelsLibrary.api.methods ?? []).map((method) => method.name);

		expect(names).toContain('HubPanelsComponent.removePanelAndRefocus');
		expect(names).toContain('HubPanelsComponent.selectPanel');
		expect(names).toContain('HubPanelsComponent.togglePanel');
		expect(names).toContain('HubPanelsComponent.removePanel');
	});

	/**
	 * A type name printed in the API table has to be one the consumer can import. The `variant`
	 * row named `HubSemanticColor`, which belongs to ng-hub-ui-buttons and does not exist here.
	 */
	it('names only Hub types the package actually exports', () => {
		const exported = publicApiExports();
		const declared = [...page.panelsLibrary.api.inputs, ...page.panelsLibrary.api.outputs]
			.flatMap((row) => [...row.type.matchAll(/\bHub[A-Z]\w*/g)].map((match) => match[0]))
			.filter((name) => !exported.has(name));

		expect(declared).toEqual([]);
	});

	/**
	 * The card view landed in 22.4.0 and the prose kept promising three. The package's own
	 * `PanelsType` is the count that matters, so the page is checked against it rather than
	 * against a number written down here.
	 */
	it('names every visualization the type union offers', () => {
		const types = readFileSync(`${LIBRARY_ROOT}/src/lib/models/panels.types.ts`, 'utf8');
		const union = /export type PanelsType = ([^;]+);/.exec(types)![1];
		const views = [...union.matchAll(/'(\w+)'/g)].map((match) => match[1]);
		const overview = page.panelsLibrary.overview;
		const prose = [
			page.panelsLibrary.description,
			overview.text,
			...(overview.highlights ?? []).map((highlight) => `${highlight.title} ${highlight.description}`)
		]
			.join(' ')
			.toLowerCase();

		expect(views.length).toBeGreaterThan(1);
		for (const view of views) {
			expect(`${view}:${prose.includes(view)}`).toBe(`${view}:true`);
		}
		expect(resolve(en, 'DOCS.PANELS.API.INPUT.TYPE.DESCRIPTION')).toContain('card');
		expect(resolve(en, 'DOCS.PANELS.FEATURE.VISUALIZATIONS.DESCRIPTION')).toContain('card');
	});

	/**
	 * "Recent changes" is a copy of the changelog and nothing forced the copy to be complete: four
	 * releases were missing, among them the 22.8.2 patch that shipped two CSS-contract breaks.
	 */
	it('announces every release the library changelog records', () => {
		const changelog = readFileSync(`${LIBRARY_ROOT}/CHANGELOG.md`, 'utf8');
		const released = [...changelog.matchAll(/^## \[?(\d+\.\d+\.\d+)\]? - \d{4}-\d{2}-\d{2}\s*$/gm)].map(
			(match) => match[1]
		);
		const announced = new Set(page.panelsLibrary.overview.changelog.map((entry) => entry.version));

		expect(released.filter((version) => !announced.has(version))).toEqual([]);
	});
});

describe('panels package documentation', () => {
	/**
	 * `resolveHubAccent` moved to ng-hub-ui-utils in 22.10.0 and the peer became required, but the
	 * READMEs kept listing the four Angular packages only, so installing what they said left the
	 * import unresolved at build time.
	 */
	it('lists every declared peer dependency in both READMEs', () => {
		const manifest = JSON.parse(readFileSync(`${LIBRARY_ROOT}/package.json`, 'utf8'));
		const peers = Object.entries<string>(manifest.peerDependencies);

		for (const [name, source] of readmes()) {
			const block = /### Peer [Dd]ependencies\s*\n+```json\n([\s\S]*?)```/.exec(source);
			expect(`${name}:${block ? 'found' : 'missing'}`).toBe(`${name}:found`);

			const listed = JSON.parse(block![1]);
			for (const [peer, range] of peers) {
				expect(`${name}:${peer}:${listed[peer]}`).toBe(`${name}:${peer}:${range}`);
			}
		}
	});

	it('documents every input, model and output in both READMEs', () => {
		const members = declaredMembers();

		for (const [name, source] of readmes()) {
			const missing = members
				.map((member) => (member.kind === 'model' ? [member.name, `${member.name}Change`] : [member.name]))
				.flat()
				.filter((member) => !new RegExp(`\\| \`${member}\``).test(source));

			expect(`${name}:${missing.join(',')}`).toBe(`${name}:`);
		}
	});

	/**
	 * `hubPanelHeadingActions` has been exported since 22.8.0 and taught in the prose, yet the
	 * import block and the directive list of both READMEs still named three directives.
	 */
	it('names every exported directive in both READMEs', () => {
		const exported = [...publicApiExports()].filter((symbol) => symbol.endsWith('Directive'));

		expect(exported.length).toBeGreaterThan(0);
		for (const [name, source] of readmes()) {
			for (const directive of exported) {
				// The class carries the prefix since the rename; the selector always did, so
				// deriving one from the other has to strip it first or it comes out doubled.
				const selector = `hub${directive.replace(/^Hub/, '').replace(/Directive$/, '')}`;
				expect(`${name}:${directive}:${source.includes(directive)}`).toBe(`${name}:${directive}:true`);
				expect(`${name}:${selector}:${source.includes(selector)}`).toBe(`${name}:${selector}:true`);
			}
		}
	});

	it('names only Hub types the package actually exports', () => {
		const exported = publicApiExports();

		for (const [name, source] of readmes()) {
			const invented = [...source.matchAll(/\bHub[A-Z]\w*/g)]
				.map((match) => match[0])
				.filter((symbol) => !exported.has(symbol));

			expect(`${name}:${[...new Set(invented)].join(',')}`).toBe(`${name}:`);
		}
	});

	/**
	 * Nine sibling libraries ship a feature matrix and the repository's conventions ask for one;
	 * panels built its matrix on the site only, so it never reached the package.
	 */
	it('ships a feature matrix with the package', () => {
		expect(existsSync(`${LIBRARY_ROOT}/FUNCTIONALITIES.md`)).toBe(true);
	});

	/**
	 * The library forwards `hub-panels-theme` from `ng-hub-ui-panels/styles`, and the Styling
	 * section of both READMEs described only the raw custom properties.
	 */
	it('documents the public SCSS mixin in both READMEs', () => {
		const styles = readFileSync(`${LIBRARY_ROOT}/src/lib/styles/_panels-theme.scss`, 'utf8');
		const mixin = /@mixin ([\w-]+)\(/.exec(styles)![1];

		for (const [name, source] of readmes()) {
			expect(`${name}:${source.includes(mixin)}`).toBe(`${name}:true`);
			expect(`${name}:${source.includes("'ng-hub-ui-panels/styles'")}`).toBe(`${name}:true`);
		}
	});
});
