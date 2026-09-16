import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { TABLE_EXAMPLE_GROUPS } from './table-example-groups';

/**
 * An example is only ever reached through the page that names it — a `registerExamples()` entry,
 * the preview map, a mixin demo — and nothing checked that the naming happened. Sixteen files
 * under the paginable example folders were therefore invisible: off the page, out of the tests,
 * and free to rot. One of them had, demonstrating a `paginationPosition` of `top` that the table
 * template never draws.
 *
 * This suite is that missing check, scoped to the folders the paginable page owns. A component
 * nobody imports fails here instead of waiting for a reader who never sees it, and so does a
 * model or a template left behind when its only example went.
 *
 * Specs deliberately do not count as readers. A dead example whose sole importer is the snapshot
 * test that walks the folder is still dead, and counting it would make this suite pass on the
 * very files it exists to find.
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

/**
 * The example folders the paginable (`table`) page owns, one per component the package ships.
 * `paginator/` holds no example today; it stays on the list so the first one added is guarded.
 */
const FOLDERS = ['table', 'list', 'paginator'] as const;

const EXAMPLES_ROOT = `${REPO_ROOT}/src/app/pages/examples`;

/** Every file under a directory, recursively, as paths relative to it. */
function filesUnder(directory: string): string[] {
	if (!existsSync(directory)) {
		return [];
	}
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory() ? filesUnder(`${directory}/${entry.name}`).map((child) => `${entry.name}/${child}`) : [entry.name]
	);
}

/** The files of one example folder, split by the role each plays. */
function exampleFiles(folder: string): { components: string[]; helpers: string[] } {
	const files = filesUnder(`${EXAMPLES_ROOT}/${folder}`).filter((file) => !file.endsWith('.spec.ts'));
	return {
		components: files.filter((file) => file.endsWith('.component.ts')),
		helpers: files.filter((file) => !file.endsWith('.component.ts'))
	};
}

/**
 * Everything that may legitimately keep an example alive: the pages, the shared shell and the
 * models, minus the example tree itself and minus every spec.
 */
const READERS = (() => {
	const sources: string[] = [];

	for (const root of [`${REPO_ROOT}/src`, `${REPO_ROOT}/shared`]) {
		for (const file of filesUnder(root)) {
			if (!file.endsWith('.ts') || file.endsWith('.spec.ts') || file.startsWith('app/pages/examples/')) {
				continue;
			}
			sources.push(readFileSync(`${root}/${file}`, 'utf8'));
		}
	}

	return sources.join('\n');
})();

/** Everything inside the example folders themselves, so a helper can be traced to its example. */
const SIBLINGS = FOLDERS.flatMap((folder) =>
	filesUnder(`${EXAMPLES_ROOT}/${folder}`)
		.filter((file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'))
		.map((file) => ({ path: `${folder}/${file}`, source: readFileSync(`${EXAMPLES_ROOT}/${folder}/${file}`, 'utf8') }))
);

const CASES = FOLDERS.map((folder) => [folder, exampleFiles(folder)] as const);

describe('paginable example wiring', () => {
	it('reads the example folders it guards', () => {
		expect(CASES.flatMap(([, files]) => files.components).length).toBeGreaterThan(20);
		expect(READERS).toContain('examples/table/basic-table-example.component');
	});

	it.each(CASES)('every %s example is loaded by a page', (folder, files) => {
		// The closing quote keeps `list-example.component` from being answered by its own
		// `nested-list-example.component` neighbour.
		const orphans = files.components.filter((file) => !READERS.includes(`examples/${folder}/${file.slice(0, -3)}'`));

		expect(orphans, `example components under ${folder}/ that no page names`).toEqual([]);
	});

	it.each(CASES)('every %s helper file belongs to an example', (folder, files) => {
		const orphans = files.helpers.filter((file) => {
			const reference = file.split('/').pop()!.replace(/\.ts$/, '');
			return !SIBLINGS.some((sibling) => sibling.path !== `${folder}/${file}` && sibling.source.includes(reference));
		});

		expect(orphans, `models and templates under ${folder}/ that no example uses`).toEqual([]);
	});
});

/**
 * Every attribute selector any library in this repository declares, mapped to the names a
 * consumer may put in `imports` to get it: the classes its file exports, aliases included.
 * Examples project into directives from more than one package — `hubAppend` comes from
 * `ng-hub-ui-forms` — so this has to know the whole workspace, not just paginable.
 */
const LIBRARY_ATTRIBUTES = (() => {
	const attributes = new Map<string, Set<string>>();

	for (const project of readdirSync(`${REPO_ROOT}/projects`, { withFileTypes: true })) {
		if (!project.isDirectory()) {
			continue;
		}
		const root = `${REPO_ROOT}/projects/${project.name}/src`;
		for (const file of filesUnder(root)) {
			if (!file.endsWith('.ts') || file.endsWith('.spec.ts')) {
				continue;
			}
			const source = readFileSync(`${root}/${file}`, 'utf8');
			const selectors = [...source.matchAll(/selector:\s*\n?\s*'([^']+)'/g)];
			if (!selectors.length) {
				continue;
			}

			// Every name the file publishes for its own declarations, so an example importing
			// `PaginableEmptyStateDirective` counts as importing the class it aliases.
			const exported = new Set([
				...[...source.matchAll(/^export (?:abstract )?class (\w+)/gm)].map(([, name]) => name),
				...[...source.matchAll(/\bas (\w+)\s*[},]/g)].map(([, name]) => name)
			]);

			for (const [, selector] of selectors) {
				for (const alternative of selector.split(',')) {
					const scoped = alternative.trim().match(/^(?:[a-z][\w-]*)?\[([^\]]+)\]$/);
					if (!scoped) {
						continue;
					}
					const names = attributes.get(scoped[1]) ?? new Set<string>();
					exported.forEach((name) => names.add(name));
					attributes.set(scoped[1], names);
				}
			}
		}
	}

	return attributes;
})();

/**
 * The directive names an example projects into, live template and published snippets alike.
 * `let-…` is a context variable rather than a directive, so it is not one of them.
 */
function projectedDirectives(source: string): string[] {
	return [...source.matchAll(/<ng-template\s+\*?([A-Za-z][\w-]*)/g)]
		.map(([, directive]) => directive)
		.filter((directive) => !directive.startsWith('let-'));
}

describe('paginable example templates', () => {
	it('reads the selectors the workspace declares', () => {
		expect(LIBRARY_ATTRIBUTES.get('paginableTableCell')).toContain('HubPaginableTableCellDirective');
		expect(LIBRARY_ATTRIBUTES.get('listItemTpt')).toContain('HubPaginableListItemDirective');
	});

	/**
	 * An `<ng-template>` carrying a directive name nothing declares is not an error anywhere: the
	 * template is simply never captured, the component draws its own default, and the example goes
	 * on looking plausible. Three examples had been demonstrating custom empty, error, loading and
	 * filter templates through names — `hubTableNotFound`, `hubTableError`, `hubTableLoading`,
	 * `hubTableFilter` — that no library has ever declared, so every one of them was showing the
	 * built-in rendering while its code tab taught the reader a spelling that cannot work.
	 *
	 * The published snippets are read alongside the live templates on purpose: a snippet that
	 * teaches a dead directive misleads exactly as much as a demo that uses one.
	 */
	it('projects only into template directives a library declares', () => {
		const unmatched = SIBLINGS.flatMap(({ path, source }) =>
			projectedDirectives(source)
				.filter((directive) => !LIBRARY_ATTRIBUTES.has(directive))
				.map((directive) => `${path}: [${directive}]`)
		);

		expect(unmatched, 'example templates projecting into a directive nothing matches').toEqual([]);
	});

	/**
	 * Matching the directive is only half of it: it is standalone, so an example that names it
	 * without importing it gets the same silence — the template is dropped and the default is
	 * drawn. The empty/error/loading example was in exactly that state as well as the other.
	 */
	it('imports every template directive it projects into', () => {
		const missing = SIBLINGS.flatMap(({ path, source }) => {
			const imported = /imports:\s*\[([\s\S]*?)\]/.exec(source)?.[1] ?? '';
			return projectedDirectives(source)
				.filter((directive) => LIBRARY_ATTRIBUTES.has(directive))
				.filter((directive) => ![...LIBRARY_ATTRIBUTES.get(directive)!].some((name) => imported.includes(name)))
				.map((directive) => `${path}: [${directive}]`);
		});

		expect(missing, 'template directives projected into but never imported').toEqual([]);
	});
});

const PAGE = readFileSync(`${REPO_ROOT}/src/app/pages/table/table.component.ts`, 'utf8');

/** Which `--hub-table-*` custom properties each `hub-table-theme` parameter emits. */
const MIXIN_TOKENS = (() => {
	const scss = readFileSync(`${REPO_ROOT}/projects/paginable/src/lib/styles/mixins/_table-theme.scss`, 'utf8');
	const tokens = new Map<string, string[]>();

	for (const [, parameter, body] of scss.matchAll(/@if \$([\w-]+) != null \{([\s\S]*?)\n\t\}/g)) {
		tokens.set(
			parameter,
			[...body.matchAll(/(--hub-table-[\w-]+):/g)].map(([, token]) => token)
		);
	}

	return tokens;
})();

/** The mixin demos the page authors, each pairing a live preview with the SCSS printed beside it. */
const DEMOS = (() => {
	// Bounded at the closing bracket of the array: `previewComponent` is also how the feature
	// guides below name their previews, and those are not mixin demos.
	const start = PAGE.indexOf('demos: [');
	const block = PAGE.slice(start, PAGE.indexOf('\n\t\t\t]', start));
	const previews = [...block.matchAll(/previewComponent: (\w+)/g)].map(([, name]) => name);
	const snippets = [...block.matchAll(/code: `([\s\S]*?)`\n/g)].map(([, code]) => code);
	return previews.map((preview, index) => ({ preview, snippet: snippets[index] ?? '' }));
})();

/** Every `static readonly …Code` snippet an example publishes, keyed by property name. */
function publishedSnippets(component: string): Map<string, string> {
	const snippets = new Map<string, string>();
	for (const [, property, code] of previewSource(component).matchAll(/static readonly (\w+Code) = `([\s\S]*?)`;/g)) {
		snippets.set(property, code);
	}
	return snippets;
}

/** The parameters a mixin snippet quotes, as `$name` → value. */
function quotedParameters(snippet: string): Map<string, string> {
	return new Map([...snippet.matchAll(/\$([\w-]+):\s*([^,\n)]+)/g)].map(([, parameter, value]) => [parameter, value.trim()]));
}

/** The source of the example component that declares the given class. */
function previewSource(component: string): string {
	for (const { source } of SIBLINGS) {
		if (source.includes(`export class ${component}`)) {
			return source;
		}
	}
	throw new Error(`no paginable example declares ${component}`);
}

describe('paginable mixin demo', () => {
	/**
	 * The preview and the SCSS printed under it are read against each other, because the demo is
	 * the only place a reader sees the mixin work. Two ways it can lie, and the page had been
	 * doing both: quoting parameters with values the preview never sets, and setting them on a
	 * bare wrapper — the table declares its own token defaults on `:host`, which shadows anything
	 * inherited from an ancestor, so the reader gets the default theme under a snippet promising
	 * another one.
	 */
	it.each(DEMOS)('the $preview preview paints what its snippet declares', ({ preview, snippet }) => {
		const style = /<style>([\s\S]*?)<\/style>/.exec(previewSource(preview));
		expect(style, `${preview} inlines the CSS the mixin would emit`).not.toBeNull();

		const css = style![1];
		// The class selector, not the tag: the table declares its defaults on `:host`, which
		// out-ranks a `hub-table { … }` rule as surely as it out-ranks a value inherited from
		// an ancestor.
		expect(css, `${preview} sets the tokens on the table, not on a wrapper the host shadows`).toMatch(/\.hub-table\b/);

		const parameters = [...snippet.matchAll(/\$([\w-]+):\s*([^,\n)]+)/g)];
		expect(parameters.length, 'parameters quoted in the snippet').toBeGreaterThan(0);

		for (const [, parameter, value] of parameters) {
			const tokens = MIXIN_TOKENS.get(parameter);
			expect(tokens, `hub-table-theme takes a ${parameter}`).toBeDefined();

			for (const token of tokens!) {
				expect(css, `${preview} sets ${token} to ${value.trim()}`).toContain(`${token}: ${value.trim()};`);
			}
		}
	});

	/**
	 * The page's snippet is not the only code a reader copies: the example publishes its own,
	 * and that is the one the code tab prints. It had drifted into teaching the very defect the
	 * check above exists to catch — tokens on a bare wrapper — under a third parameter list and
	 * a deep partial path, while the page beside it said something else.
	 */
	it.each(DEMOS)('the $preview code tab publishes the include the page teaches', ({ preview, snippet }) => {
		const carrying = [...publishedSnippets(preview)].filter(([, code]) => code.includes('@include'));
		expect(carrying.length, `${preview} publishes exactly one snippet holding the include`).toBe(1);

		const [, published] = carrying[0];

		// The package root, not a partial reached by path: it is the entry the READMEs teach and
		// the only one that survives the package rearranging its `styles/` folder.
		expect(published, `${preview} uses the canonical styles entry point`).toContain("@use 'ng-hub-ui-paginable/styles'");
		expect(published, `${preview} includes the mixin on the table, not on a wrapper`).toMatch(
			/\.hub-table\b[^{]*\{[\s\S]*@include/
		);

		expect([...quotedParameters(published).entries()].sort(), `${preview} quotes the parameters the page does`).toEqual(
			[...quotedParameters(snippet).entries()].sort()
		);
	});
});

/**
 * The example nav panel is built from three lists that have to agree: the `registerExamples()`
 * entry the page writes, the group in `TABLE_EXAMPLE_GROUPS` that orders it, and the label in the
 * shell's `LIBRARY_EXAMPLES_NAV`.
 *
 * The label is the half that is easy to forget and impossible to notice, because
 * `buildExampleAnchorItems` filters a group's ids down to the ones it has a label for. An example
 * missing from that map still renders on the page and still answers to its own anchor — it just
 * never appears in the panel, so nobody arrives at it. Two were in that state, and adding a third
 * is a single forgotten line away.
 */
describe('paginable example panel wiring', () => {
	/** Ids the page registers, in declaration order. */
	const REGISTERED = [...PAGE.matchAll(/register\(\{\s*\n\s*id: '([^']+)'/g)].map(([, id]) => id);

	/** Ids the shell can label, which is what decides whether the panel keeps a link. */
	const LABELLED = (() => {
		const shell = readFileSync(`${REPO_ROOT}/src/app/components/app-shell/app-shell.component.ts`, 'utf8');
		const start = shell.indexOf('\tpaginable: [');
		const block = shell.slice(start, shell.indexOf('\n\t],', start));
		return [...block.matchAll(/\{ id: '([^']+)'/g)].map(([, id]) => id);
	})();

	/** Ids the groups order, which is the order the panel and the Examples tab both follow. */
	const GROUPED = TABLE_EXAMPLE_GROUPS.flatMap((group) => group.exampleIds);

	it('reads the three lists it compares', () => {
		expect(REGISTERED.length).toBeGreaterThan(40);
		expect(LABELLED.length).toBeGreaterThan(40);
		expect(GROUPED.length).toBeGreaterThan(40);
	});

	it('registers every example a group orders', () => {
		expect(
			GROUPED.filter((id) => !REGISTERED.includes(id)),
			'grouped ids no registry entry answers'
		).toEqual([]);
	});

	it('labels every example a group orders, so the panel keeps it', () => {
		expect(
			GROUPED.filter((id) => !LABELLED.includes(id)),
			'grouped ids the panel silently drops'
		).toEqual([]);
	});

	it('links to no example the page never registers', () => {
		expect(
			LABELLED.filter((id) => !REGISTERED.includes(id)),
			'panel links pointing at nothing'
		).toEqual([]);
	});

	it('names each example once per list', () => {
		expect(
			LABELLED.filter((id, index) => LABELLED.indexOf(id) !== index),
			'duplicate panel labels'
		).toEqual([]);
		expect(
			GROUPED.filter((id, index) => GROUPED.indexOf(id) !== index),
			'ids ordered by two groups'
		).toEqual([]);
	});
});
