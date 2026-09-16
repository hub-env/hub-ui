import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * The paginable documentation is prose about a library that keeps moving, and prose does not
 * fail a build: the READMEs and this page were teaching selectors the library never declared
 * (`<hub-ui-paginator>`, `<hub-ui-icon>`), template directives it never matched (`notFoundTpt`,
 * `tableRow`, `listItem`) and template contexts it never passes (`let-data="data"` on a cell).
 * A reader who copied any of them got silence — the template is simply never captured.
 *
 * This suite reads the library's own sources and makes the documentation answer to them: every
 * element and every `<ng-template …>` directive the docs name has to be a selector that exists,
 * every `let-…` has to read a key some outlet actually passes, and every input table has to
 * list exactly the inputs its component declares.
 *
 * The page is read as text rather than instantiated, the way the changelog suite reads all
 * two dozen of them: `TableComponent` reaches for `inject()`, so `new` would throw NG0203 and
 * building it would buy nothing this needs.
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

const LIBRARY = `${REPO_ROOT}/projects/paginable`;
const PAGE = readFileSync(`${REPO_ROOT}/src/app/pages/table/table.component.ts`, 'utf8');
const READMES = ['README.md', 'README.es.md'] as const;

/**
 * Element names the docs mention on purpose without the library declaring them: the migration
 * guide quotes the pre-1.52 selector to show what it replaced, and 22.22.0 has to name the
 * `hub-icon` it gave back to `ng-hub-ui-icons` in order to say what to write instead.
 */
const HISTORICAL_ELEMENTS = new Set(['paginable-table', 'hub-icon']);

/** Every `.ts` file under the library's source tree. */
function sourceFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = `${directory}/${entry.name}`;
		if (entry.isDirectory()) {
			return sourceFiles(path);
		}
		return entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts') ? [path] : [];
	});
}

/** Every `selector:` the library declares, split into element names and attribute names. */
const SELECTORS = (() => {
	const elements = new Set<string>();
	const attributes = new Set<string>();

	for (const file of sourceFiles(`${LIBRARY}/src/lib`)) {
		const source = readFileSync(file, 'utf8');
		for (const [, selector] of source.matchAll(/selector:\s*\n?\s*'([^']+)'/g)) {
			for (const alternative of selector.split(',').map((part) => part.trim())) {
				const scoped = alternative.match(/^([a-z][\w-]*)?\[([^\]]+)\]$/);
				if (scoped) {
					if (scoped[1]) {
						elements.add(scoped[1]);
					}
					attributes.add(scoped[2]);
				} else {
					elements.add(alternative);
				}
			}
		}
	}
	return { elements, attributes };
})();

/**
 * Every name the package's public entry point exposes, following the barrels it re-exports.
 * Resolved from the sources rather than from a build, so the suite needs no `dist/`.
 */
const EXPORTED = (() => {
	const names = new Set<string>();

	const visit = (file: string, seen = new Set<string>()) => {
		if (seen.has(file) || !existsSync(file)) {
			return;
		}
		seen.add(file);
		const source = readFileSync(file, 'utf8');

		for (const [, list] of source.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
			for (const entry of list.split(',')) {
				const name = entry
					.trim()
					.split(/\s+as\s+/)
					.pop()
					?.trim();
				if (name) {
					names.add(name);
				}
			}
		}
		for (const [, declared] of source.matchAll(
			/^export (?:declare )?(?:abstract )?(?:class|interface|type|enum|const|function) ([A-Za-z_]\w*)/gm
		)) {
			names.add(declared);
		}
		for (const [, relative] of source.matchAll(/export \* from '(\.[^']+)'/g)) {
			const base = `${dirname(file)}/${relative}`;
			visit(`${base}.ts`, seen);
			visit(`${base}/index.ts`, seen);
		}
	};

	visit(`${LIBRARY}/src/lib/index.ts`);
	return names;
})();

/**
 * Inputs a component declares, keyed by the name a consumer binds — the alias when the input
 * carries one (`rows` is bound as `data`). Both spellings count: the signal `input()`/`model()`
 * form and the `@Input()` accessor form.
 */
function declaredInputs(file: string): Set<string> {
	const lines = readFileSync(file, 'utf8').split('\n');
	const names = new Set<string>();

	lines.forEach((line, index) => {
		const signal = line.match(/^\s*(?:readonly\s+)?([A-Za-z_][\w$]*)\s*=\s*(?:input|model)\b/);
		if (signal) {
			const alias = lines
				.slice(index, index + 8)
				.join('\n')
				.match(/alias:\s*'([^']+)'/);
			names.add(alias ? alias[1] : signal[1]);
			return;
		}
		if (/^\s*@Input\(/.test(line)) {
			const declaration = lines
				.slice(index + 1, index + 4)
				.join('\n')
				.match(/(?:set|get)\s+([A-Za-z_][\w$]*)\s*\(/);
			if (declaration) {
				names.add(declaration[1]);
			}
		}
	});

	return names;
}

/** The names listed in the `#### Inputs` markdown table that follows the given heading. */
function documentedInputs(readme: string, heading: RegExp): Set<string> {
	const source = readFileSync(`${LIBRARY}/${readme}`, 'utf8');
	const start = source.search(heading);
	expect(start, `${readme} has a section matching ${heading}`).toBeGreaterThan(-1);
	const section = source.slice(start).split(/\n### /)[0];
	// The Outputs table that follows lists names too, and they are not inputs.
	const inputs = section.slice(section.search(/^#### Inputs$/m)).split(/\n#### /)[0];
	return new Set([...inputs.matchAll(/^\| `([A-Za-z]\w*)`\s*\|/gm)].map(([, name]) => name));
}

/**
 * What each projected template is actually handed, per directive. The keys are asserted
 * against the host's own outlets below, so this table cannot drift away from the code either.
 */
interface TemplateContext {
	/** Which component template owns the outlet. */
	host: 'table' | 'list';
	/** Every selector alternative that captures this template. */
	directives: string[];
	/** The context keys the outlet hands over, sorted. */
	keys: string[];
}

const CONTEXTS: TemplateContext[] = [
	{ host: 'table', directives: ['headerTpt', 'paginableTableHeader'], keys: ['header', 'property'] },
	{ host: 'table', directives: ['cellTpt', 'paginableTableCell'], keys: ['header', 'item', 'property', 'row'] },
	{ host: 'table', directives: ['filterTpt', 'paginableTableFilter'], keys: ['formControl', 'header'] },
	{ host: 'table', directives: ['rowTpt', 'paginableTableRow'], keys: ['$implicit'] },
	{
		host: 'table',
		directives: ['expandingRowTpt', 'paginableTableExpandingRow'],
		keys: ['colspan', 'item']
	},
	{ host: 'list', directives: ['listItemTpt'], keys: ['collapsed', 'data', 'depth', 'index', 'selected'] },
	{
		host: 'table',
		directives: [
			'loadingTpt',
			'paginableLoading',
			'paginableTableLoading',
			'errorTpt',
			'paginableError',
			'paginableTableError',
			'noResultsTpt',
			'paginableNoResults',
			'emptyStateTpt',
			'paginableEmptyState',
			'noDataTpt',
			'paginableTableNotFound'
		],
		keys: []
	}
];

/**
 * The keys of one object-literal body, ignoring everything inside the values — `property:
 * header | get: header.property` has one key, and a naive scan reads three.
 */
function objectKeys(body: string): string[] {
	const keys: string[] = [];
	let depth = 0;
	let entry = '';

	const take = () => {
		const [key] = entry.split(':');
		const name = key.trim();
		if (name) {
			keys.push(name);
		}
		entry = '';
	};

	for (const character of body) {
		if ('([{'.includes(character)) {
			depth++;
		} else if (')]}'.includes(character)) {
			depth--;
		}
		if (character === ',' && depth === 0) {
			take();
			continue;
		}
		entry += character;
	}
	take();

	return keys;
}

/** The key sets every `ngTemplateOutletContext` of a host template hands over, each sorted. */
function outletContexts(host: 'table' | 'list'): string[][] {
	const file =
		host === 'table'
			? `${LIBRARY}/src/lib/components/table/table.component.html`
			: `${LIBRARY}/src/lib/components/list/paginable-list/list.component.html`;
	const html = readFileSync(file, 'utf8');
	return [...html.matchAll(/ngTemplateOutletContext\]="\{([^}]*)\}/g)].map(([, body]) => objectKeys(body).sort());
}

/**
 * The member names of an interface or object type quoted in a fenced block, keyed by type name.
 * `TableRowEvent` is written as an intersection with `TableRow`, so a `&`-joined body counts too.
 */
function quotedTypeMembers(source: string): Map<string, string[]> {
	const quoted = new Map<string, string[]>();

	for (const [, name, body] of source.matchAll(
		/(?:export )?(?:interface|type) ([A-Z]\w*)(?:<[^>]*>)?\s*=?\s*(?:[\w<>,\s&]*&\s*)?\{([\s\S]*?)\n\}/g
	)) {
		quoted.set(
			name,
			[...body.matchAll(/^\t([A-Za-z_]\w*)\??\s*:/gm)].map(([, member]) => member)
		);
	}

	return quoted;
}

/** The member names the library's own declaration of a type carries, following one intersection. */
function declaredMembers(name: string): string[] {
	for (const file of sourceFiles(`${LIBRARY}/src/lib/interfaces`)) {
		const source = readFileSync(file, 'utf8');
		const members = quotedTypeMembers(source).get(name);
		if (!members) {
			continue;
		}
		const intersected = source.match(new RegExp(`(?:interface|type) ${name}(?:<[^>]*>)? *=? *(?:extends )?(\\w+)<`));
		return intersected ? [...declaredMembers(intersected[1]), ...members] : members;
	}
	throw new Error(`the library declares no ${name}`);
}

/** The `example:` snippets of the page's `api.templates` block. */
const PAGE_TEMPLATE_EXAMPLES = (() => {
	const block = PAGE.slice(PAGE.indexOf('templates: ['), PAGE.indexOf('cssVariables:'));
	return [...block.matchAll(/example: '([^']+)'/g)].map(([, example]) => example);
})();

/** The `name:` entries of the page's `api.inputs` block. */
const PAGE_INPUTS = (() => {
	const block = PAGE.slice(PAGE.indexOf('inputs: ['), PAGE.indexOf('outputs: ['));
	return [...block.matchAll(/name: '([A-Za-z]\w*)'/g)].map(([, name]) => name);
})();

/** The names the page's `api.inputs` block marks as required. */
const PAGE_REQUIRED_INPUTS = (() => {
	const block = PAGE.slice(PAGE.indexOf('inputs: ['), PAGE.indexOf('outputs: ['));
	return [...block.matchAll(/name: '([A-Za-z]\w*)',[\s\S]{0,200}?required: (true|false)/g)]
		.filter(([, , required]) => required === 'true')
		.map(([, name]) => name);
})();

describe('paginable documentation', () => {
	it('reads the page and the library it documents', () => {
		expect(PAGE_TEMPLATE_EXAMPLES.length).toBeGreaterThan(0);
		expect(PAGE_INPUTS.length).toBeGreaterThan(0);
		expect(SELECTORS.elements.has('hub-table')).toBe(true);
	});

	it.each(READMES)('%s names only elements the library declares', (readme) => {
		const source = readFileSync(`${LIBRARY}/${readme}`, 'utf8');
		const used = new Set([...source.matchAll(/<((?:hub|paginable|ng-hub-ui)-[a-z-]+)[\s>]/g)].map(([, name]) => name));

		for (const element of used) {
			if (HISTORICAL_ELEMENTS.has(element)) {
				continue;
			}
			expect(SELECTORS.elements.has(element), `${readme} uses <${element}>`).toBe(true);
		}
	});

	it.each(READMES)('%s quotes each interface with the members it really has', (readme) => {
		const quoted = quotedTypeMembers(readFileSync(`${LIBRARY}/${readme}`, 'utf8'));
		expect(quoted.size, `${readme} quotes at least one interface`).toBeGreaterThan(0);

		for (const [name, members] of quoted) {
			const declared = declaredMembers(name);
			expect([...members].sort(), `${readme} quotes ${name}`).toEqual([...declared].sort());
		}
	});

	it.each(READMES)('%s imports only names the package exports', (readme) => {
		const source = readFileSync(`${LIBRARY}/${readme}`, 'utf8');

		for (const [, list] of source.matchAll(/import\s+\{([^}]*)\}\s+from\s+'ng-hub-ui-paginable'/g)) {
			for (const entry of list.split(',')) {
				const name = entry
					.trim()
					.split(/\s+as\s+/)[0]
					.trim();
				if (name) {
					expect(EXPORTED.has(name), `${readme} imports { ${name} }`).toBe(true);
				}
			}
		}
	});

	it.each(READMES)('%s names only template directives the library matches', (readme) => {
		const source = readFileSync(`${LIBRARY}/${readme}`, 'utf8');
		const used = new Set([...source.matchAll(/<ng-template\s+\*?([A-Za-z][\w-]*)/g)].map(([, name]) => name));

		for (const directive of used) {
			expect(SELECTORS.attributes.has(directive), `${readme} projects into [${directive}]`).toBe(true);
		}
	});

	it('the page teaches only template directives the library matches', () => {
		for (const example of PAGE_TEMPLATE_EXAMPLES) {
			const directive = example.match(/<ng-template\s+\*?([A-Za-z][\w-]*)/);
			expect(directive, `example "${example}" projects into a template`).not.toBeNull();
			expect(SELECTORS.attributes.has(directive![1]), `page projects into [${directive![1]}]`).toBe(true);
		}
	});

	it.each(CONTEXTS)('the $host outlet still hands $keys to [$directives]', ({ host, keys }) => {
		const contexts = outletContexts(host);

		if (keys.length === 0) {
			// A state template is rendered by `hub-state-outlet`, which hands over no context:
			// its `context` input only feeds the inputs of a registered default component.
			const outlet = readFileSync(
				`${LIBRARY}/src/lib/components/state-outlet/paginable-state-outlet.component.ts`,
				'utf8'
			);
			expect(outlet).toContain('[ngTemplateOutlet]="tpl"');
			expect(outlet).not.toContain('ngTemplateOutletContext');
			return;
		}
		expect(contexts).toContainEqual([...keys].sort());
	});

	it('the docs read only context variables the outlet behind that directive hands over', () => {
		const prose = [
			...PAGE_TEMPLATE_EXAMPLES,
			...READMES.map((readme) => readFileSync(`${LIBRARY}/${readme}`, 'utf8'))
		].join('\n');

		for (const [, attributes] of prose.matchAll(/<ng-template\s+([^>]*)>/g)) {
			const directive = attributes.match(/^\*?([A-Za-z][\w-]*)/);
			const read = [...attributes.matchAll(/let-\w+="(\w+)"/g)].map(([, key]) => key);
			if (!directive || read.length === 0) {
				continue;
			}

			const context = CONTEXTS.find((entry) => entry.directives.includes(directive[1]));
			expect(context, `[${directive[1]}] has no context declared in this suite`).toBeDefined();

			for (const key of read) {
				expect(
					context!.keys.includes(key),
					`docs read let-…="${key}" off [${directive[1]}], which hands over ${context!.keys.join(', ') || 'nothing'}`
				).toBe(true);
			}
		}
	});

	it('the page lists exactly the inputs the table declares', () => {
		const declared = declaredInputs(`${LIBRARY}/src/lib/components/table/table.component.ts`);
		const documented = new Set(PAGE_INPUTS);

		expect(
			[...declared].filter((name) => !documented.has(name)),
			'page omits'
		).toEqual([]);
		expect(
			[...documented].filter((name) => !declared.has(name)),
			'page invents'
		).toEqual([]);
	});

	it('the page marks an input required only when the component does', () => {
		const source = readFileSync(`${LIBRARY}/src/lib/components/table/table.component.ts`, 'utf8');
		const required = new Set(
			[...source.matchAll(/^\s*(?:readonly\s+)?([A-Za-z_][\w$]*)\s*=\s*(?:input|model)\.required/gm)].map(
				([, name]) => name
			)
		);

		for (const name of PAGE_REQUIRED_INPUTS) {
			expect(required.has(name), `page marks ${name} required`).toBe(true);
		}
	});

	it.each([
		['Table', /^### (Table Component|Componente de tabla) \(/m, 'components/table/table.component.ts'],
		['List', /^### (List Component|Componente de lista) \(/m, 'components/list/paginable-list/list.component.ts'],
		['Paginator', /^### (Paginator Component|Componente paginador) \(/m, 'components/paginator/paginator.component.ts']
	])('both READMEs list exactly the %s inputs the component declares', (_label, heading, file) => {
		const declared = declaredInputs(`${LIBRARY}/src/lib/${file}`);

		for (const readme of READMES) {
			const documented = documentedInputs(readme, heading);
			expect(
				[...declared].filter((name) => !documented.has(name)),
				`${readme} omits`
			).toEqual([]);
			expect(
				[...documented].filter((name) => !declared.has(name)),
				`${readme} invents`
			).toEqual([]);
		}
	});
});
