import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * An example reaches the reader through two lists that nobody keeps together: the
 * `registerExamples()` entry on the library page, and the label in the shell's
 * `LIBRARY_EXAMPLES_NAV`. Only the second one builds the sidebar panel — and
 * `buildExampleAnchorItems` quietly drops any id it has no label for.
 *
 * The failure is therefore silent by construction. The example still renders on the
 * Examples tab and still answers to its own anchor, so nothing breaks; it simply never
 * appears in the panel, and the only person who finds out is a reader who goes looking
 * and leaves. Seventeen examples across four libraries were in that state.
 *
 * `paginable-examples-wiring.spec.ts` guards the same seam for one library. This suite is
 * the whole-site version: it names the library and the missing id, so the fix is one line
 * away instead of an afternoon of clicking.
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

const PAGES_DIR = `${REPO_ROOT}/src/app/pages`;
const SHELL_FILE = `${REPO_ROOT}/src/app/components/app-shell/app-shell.component.ts`;

/**
 * Library page folders whose name differs from the route id the sidebar keys on.
 * The paginable package is documented by the page that still lives under `table/`.
 */
const FOLDER_TO_LIBRARY: Record<string, string> = { table: 'paginable' };

/**
 * Ids the sidebar can label, per library route id.
 *
 * Read out of the source rather than imported because the map is a file-private const —
 * exporting it only for the test would widen the component's surface for no caller.
 */
const LABELLED: Record<string, string[]> = (() => {
	const shell = readFileSync(SHELL_FILE, 'utf8');
	const start = shell.indexOf('const LIBRARY_EXAMPLES_NAV');
	const block = shell.slice(start, shell.indexOf('\n};', start));
	const libraries: Record<string, string[]> = {};

	for (const entry of block.matchAll(/\n\t'?([a-z-]+)'?: \[([\s\S]*?)\n\t\]/g)) {
		libraries[entry[1]] = [...entry[2].matchAll(/\{ id: '([^']+)'/g)].map(([, id]) => id);
	}

	return libraries;
})();

/**
 * Ids each library page hands to the `ExampleRegistry`, in declaration order.
 *
 * An entry is recognised by the `loader:` that follows its id, which is what separates a
 * registration from the playground configs and preview maps that also carry an `id`.
 */
const REGISTERED: Record<string, string[]> = (() => {
	const libraries: Record<string, string[]> = {};

	for (const folder of readdirSync(PAGES_DIR, { withFileTypes: true })) {
		if (!folder.isDirectory()) {
			continue;
		}

		const library = FOLDER_TO_LIBRARY[folder.name] ?? folder.name;

		for (const file of readdirSync(`${PAGES_DIR}/${folder.name}`)) {
			if (!file.endsWith('.ts') || file.endsWith('.spec.ts')) {
				continue;
			}

			const source = readFileSync(`${PAGES_DIR}/${folder.name}/${file}`, 'utf8');
			const ids = [...source.matchAll(/id: '([^']+)'/g)];

			ids.forEach((match, index) => {
				const until = index + 1 < ids.length ? ids[index + 1].index! : source.length;
				if (source.slice(match.index! + match[0].length, until).includes('loader:')) {
					(libraries[library] ??= []).push(match[1]);
				}
			});
		}
	}

	return libraries;
})();

const LIBRARIES = Object.keys(LABELLED).sort();

describe('example nav coverage', () => {
	it('reads both lists it compares', () => {
		expect(LIBRARIES.length, 'libraries with a sidebar example panel').toBeGreaterThan(20);
		expect(Object.keys(REGISTERED).length, 'library pages registering examples').toBeGreaterThan(20);
	});

	it.each(LIBRARIES)('%s registers the examples its panel links to', (library) => {
		expect(REGISTERED[library] ?? [], `${library} page registers no example at all`).not.toEqual([]);
		expect(
			(LABELLED[library] ?? []).filter((id) => !(REGISTERED[library] ?? []).includes(id)),
			`${library} panel links pointing at nothing`
		).toEqual([]);
	});

	it.each(LIBRARIES)('%s labels every example it registers, so the panel keeps it', (library) => {
		expect(
			(REGISTERED[library] ?? []).filter((id) => !(LABELLED[library] ?? []).includes(id)),
			`${library} examples registered, rendered and unreachable from the sidebar`
		).toEqual([]);
	});

	it('gives every library that registers examples a panel to list them in', () => {
		expect(
			Object.keys(REGISTERED).filter((library) => !LABELLED[library]),
			'library pages whose examples the sidebar never offers'
		).toEqual([]);
	});

	it('names each example once per panel', () => {
		const duplicates = LIBRARIES.flatMap((library) =>
			(LABELLED[library] ?? []).filter((id, index, ids) => ids.indexOf(id) !== index).map((id) => `${library}/${id}`)
		);

		expect(duplicates, 'ids listed twice in the same panel').toEqual([]);
	});
});
