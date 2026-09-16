import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { UtilsComponent } from './utils.component';

/**
 * A ✅ in `FUNCTIONALITIES.md` promises the reader can run the thing, not merely that it
 * exists — and the promise is kept in two separate files, so it can rot in either. This
 * suite reads both sides: the table's mark, and the source of the examples the page actually
 * registers. Marking a row covered without writing the demo fails here, and so does deleting
 * a demo the table still counts on.
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

const FUNCTIONALITIES = `${REPO_ROOT}/projects/utils/FUNCTIONALITIES.md`;
const EXAMPLES_DIR = `${REPO_ROOT}/src/app/pages/examples/utils`;
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;

/**
 * The rows that had no example, paired with the export whose demo now covers them.
 *
 * The pairing is the point: "Transition utilities" says nothing a grep can check, so each row
 * names the symbol a reader would have to see used before believing the mark.
 */
const DEMONSTRATED: ReadonlyArray<readonly [row: string, symbol: string]> = [
	['`PopupService<T>`', 'PopupService'],
	['Programmatic popup creation', 'PopupService'],
	['`hubRunTransition()` function', 'hubRunTransition'],
	['Transition utilities', 'hubCompleteTransition'],
	['CSS transition helpers', 'TransitionOptions'],
	['`UnwrapAsyncPipe`', 'UnwrapAsyncPipe'],
	['`closest()`', 'closest'],
	['`reflow()`', 'reflow'],
	['`getActiveElement()`', 'getActiveElement'],
	['`runInZone()` operator', 'runInZone'],
	['`toRgb()`', 'toRgb'],
	['`isValidColor()`', 'isValidColor'],
	['`HUB_NAMED_COLORS`', 'HUB_NAMED_COLORS'],
	['`relativeLuminance()`', 'relativeLuminance'],
	['`compositeOver()`', 'compositeOver']
];

/** Builds the page outside a template, which is the only way to read its library object. */
function buildPage(): UtilsComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new UtilsComponent());
	page.ngOnInit();
	return page;
}

/** The examples the page registers for this package, in registration order. */
function registeredExamples(): { id: string; title: string; componentName: string }[] {
	buildPage();
	return TestBed.inject(ExampleRegistry)
		.getAll()
		.filter((example) => example.packagePath === 'utils')
		.map(({ id, title, componentName }) => ({ id, title, componentName }));
}

/** The source of every example file whose component the page registers. */
function registeredExampleSources(): string[] {
	const registered = registeredExamples().map((example) => example.componentName);

	return readdirSync(EXAMPLES_DIR)
		.filter((file) => file.endsWith('.component.ts'))
		.map((file) => readFileSync(`${EXAMPLES_DIR}/${file}`, 'utf8'))
		.filter((source) => registered.some((name) => source.includes(`export class ${name}`)));
}

/** The names a file imports from the library, across every import statement it has. */
function importsFromUtils(source: string): string[] {
	return [...source.matchAll(/import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*'ng-hub-ui-utils'/g)]
		.flatMap(([, names]) => names.split(','))
		.map((name) => name.replace(/^\s*type\s+/, '').trim())
		.filter(Boolean);
}

/** Walks a dotted translation key down a parsed dictionary. */
function lookup(dictionary: unknown, key: string): unknown {
	return key.split('.').reduce<unknown>((node, segment) => {
		if (node && typeof node === 'object' && segment in node) {
			return (node as Record<string, unknown>)[segment];
		}
		return undefined;
	}, dictionary);
}

/** The coverage table row that starts with the given cell text. */
function tableRow(row: string): string {
	const lines = readFileSync(FUNCTIONALITIES, 'utf8').split('\n');
	const matches = lines.filter((line) => line.startsWith('|') && line.includes(`| ${row}`));

	expect(matches, `one row for ${row}`).toHaveLength(1);
	return matches[0];
}

describe('utils coverage table', () => {
	it.each(DEMONSTRATED)('marks %s as covered', (row) => {
		expect(tableRow(row)).not.toContain('❌');
	});

	it.each(DEMONSTRATED)('%s is demonstrated by a registered example using %s', (_row, symbol) => {
		const demos = registeredExampleSources().filter((source) => importsFromUtils(source).includes(symbol));

		expect(demos.length, `a registered example importing ${symbol}`).toBeGreaterThan(0);
	});
});

describe('utils feature guides', () => {
	it('offers a live preview for every feature-guide example', () => {
		const missing = buildPage()
			.utilsLibrary.functionalities.flatMap((group) => group.examples)
			.filter((example) => !example.previewComponent)
			.map((example) => example.title);

		expect(missing).toEqual([]);
	});

	it('registers a distinct example for the popup service, rather than borrowing the overlay one', () => {
		const previews = new Map(
			buildPage()
				.utilsLibrary.functionalities.flatMap((group) => group.examples)
				.map((example) => [example.title, example.previewComponent])
		);

		expect(previews.get('DOCS.UTILS.FEATURE.POPUP_CREATION.TITLE')).toBeDefined();
		expect(previews.get('DOCS.UTILS.FEATURE.POPUP_CREATION.TITLE')).not.toBe(
			previews.get('DOCS.UTILS.FEATURE.OVERLAY_SERVICE.TITLE')
		);
	});
});

describe('utils example titles', () => {
	it('translates the title of every registered example, in all eight languages', () => {
		const titles = registeredExamples().map((example) => example.title);

		expect(titles.length).toBeGreaterThan(0);
		for (const language of LANGUAGES) {
			const dictionary = JSON.parse(readFileSync(`${REPO_ROOT}/src/app/i18n/docs/${language}.json`, 'utf8'));
			for (const title of titles) {
				expect(typeof lookup(dictionary, title), `${title} in ${language}.json`).toBe('string');
			}
		}
	});
});

/**
 * The other half of the promise: a name the documentation prints is a name the reader will
 * type. When the page invented `HubOverlayService` and `HubPopupService` — neither of which
 * the package has ever exported — the only way to find that out was to open `public-api.ts`,
 * which is exactly the reading the documentation exists to spare. These cases read the
 * package's real surface and hold the prose to it.
 */

const LIBRARY_SOURCE = `${REPO_ROOT}/projects/utils/src`;
const PAGE = `${REPO_ROOT}/src/app/pages/utils/utils.component.ts`;
const READMES = [`${REPO_ROOT}/projects/utils/README.md`, `${REPO_ROOT}/projects/utils/README.es.md`];
const DOCUMENTS = [...READMES, FUNCTIONALITIES, PAGE];

/**
 * The only `hub`-shaped names the docs may print without this package exporting them: a local
 * variable inside a snippet, and a sibling library's selector, named because its `placement`
 * input is half of the collision that `[hubTooltip]` exists to end.
 */
const NOT_OURS_TO_EXPORT = ['hubTranslation', 'hubDropdown'];

/** Every `.ts` file of the library, read once. */
function librarySources(): string[] {
	const walk = (directory: string): string[] =>
		readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
			const path = `${directory}/${entry.name}`;
			if (entry.isDirectory()) {
				return walk(path);
			}
			return entry.name.endsWith('.ts') ? [readFileSync(path, 'utf8')] : [];
		});

	return walk(LIBRARY_SOURCE);
}

/**
 * The public vocabulary of the package: exported symbols, plus the attribute selectors and
 * input aliases a consumer writes in a template, which are just as much names the docs give.
 */
function publicNames(): Set<string> {
	const names = new Set<string>();

	for (const source of librarySources()) {
		const patterns = [
			/^export\s+(?:declare\s+)?(?:abstract\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm,
			/alias:\s*'([^']+)'/g,
			/selector:\s*'\[([^\]']+)\]'/g,
			/name:\s*'([^']+)'/g
		];
		for (const pattern of patterns) {
			for (const [, name] of source.matchAll(pattern)) {
				names.add(name);
			}
		}
		for (const [, block] of source.matchAll(/^export\s*\{([^}]*)\}/gm)) {
			for (const entry of block.split(',')) {
				const name = entry
					.trim()
					.replace(/^type\s+/, '')
					.split(/\s+as\s+/)
					.pop()
					?.trim();
				if (name) {
					names.add(name);
				}
			}
		}
	}

	return names;
}

/** The `HubX` / `HUB_X` / `hubX` identifiers a document names. */
function claimedNames(document: string): string[] {
	const source = readFileSync(document, 'utf8');
	const matches = source.matchAll(/(?<![\w$-])(Hub[A-Z][A-Za-z0-9]*|HUB_[A-Z0-9_]+|hub[A-Z][A-Za-z0-9]*)/g);
	return [...new Set([...matches].map(([, name]) => name))];
}

describe('utils documented names', () => {
	it.each(DOCUMENTS)('%s names only symbols the package exports', (document) => {
		const known = publicNames();
		const invented = claimedNames(document).filter((name) => !known.has(name) && !NOT_OURS_TO_EXPORT.includes(name));

		expect(invented).toEqual([]);
	});

	it.each(READMES)('%s documents the public surface a consumer has to discover elsewhere', (readme) => {
		// Exports that greped zero in both READMEs while `public-api.ts` exported them, plus the
		// `OverlayRef` / `OverlayPosition` methods added in 22.11.0 and never written down.
		const expected = [
			'HubTooltipDirective',
			'hubOverflowTooltip',
			'provideHubTooltip',
			'HUB_TOOLTIP_ADAPTER',
			'HubDragDropService',
			'moveItemInArray',
			'transferArrayItem',
			'createPointerDragSession',
			'resolveHubAccent',
			'HUB_TRANSLATION_PREFIX',
			'HUB_DROPDOWN_POSITIONS',
			'onKeydown',
			'onBackdropClick',
			'hasAttached',
			'withDirection',
			'mergeDeep',
			'generateUniqueId',
			'debouncedSignal'
		];
		const source = readFileSync(readme, 'utf8');

		expect(expected.filter((name) => !source.includes(name))).toEqual([]);
	});

	it.each(READMES)('%s teaches the tooltip directive that is not deprecated', (readme) => {
		const source = readFileSync(readme, 'utf8');

		expect(source).toContain('HubTooltipDirective');
		expect(source).toContain('hubTooltipPlacement');
	});

	it.each(READMES)('%s lists every theme token the tooltip controller forwards', (readme) => {
		// The forwarding list is the whole contract: a token missing from it does nothing, and a
		// token missing from the README can only be found by reading the controller.
		const controller = readFileSync(`${LIBRARY_SOURCE}/lib/tooltip/tooltip-controller.ts`, 'utf8');
		const forwarded = [...controller.matchAll(/'(--hub-tooltip-[a-z-]+)'/g)].map(([, token]) => token);
		const source = readFileSync(readme, 'utf8');

		expect(forwarded.length).toBeGreaterThan(10);
		expect(forwarded.filter((token) => !source.includes(token))).toEqual([]);
	});
});

describe('utils release list', () => {
	it('skips no release between the newest it shows and the oldest', () => {
		const changelog = readFileSync(`${REPO_ROOT}/projects/utils/CHANGELOG.md`, 'utf8');
		const compare = (a: string, b: string) => {
			const left = a.split('.').map(Number);
			const right = b.split('.').map(Number);
			const difference = left.findIndex((part, index) => part !== right[index]);
			return difference === -1 ? 0 : left[difference] - right[difference];
		};

		const released = [...changelog.matchAll(/^## \[?(\d+\.\d+\.\d+)\]? - \d{4}-\d{2}-\d{2}\s*$/gm)].map(
			([, version]) => version
		);
		const shown = [...readFileSync(PAGE, 'utf8').matchAll(/version: '(\d+\.\d+\.\d+)'/g)].map(([, version]) => version);

		expect(shown.length).toBeGreaterThan(0);
		const oldest = shown.reduce((lowest, version) => (compare(version, lowest) < 0 ? version : lowest));
		const newest = shown.reduce((highest, version) => (compare(version, highest) > 0 ? version : highest));
		const inRange = released.filter((version) => compare(version, oldest) >= 0 && compare(version, newest) <= 0);

		expect(inRange.filter((version) => !shown.includes(version))).toEqual([]);
	});
});
