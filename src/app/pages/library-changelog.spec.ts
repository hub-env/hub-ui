import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * A library's `CHANGELOG.md` is the source and the "Recent changes" block on its page is the
 * copy, and nothing ever forced the copy to be made: fifteen pages had drifted one or two
 * releases behind at once, so the site announced an old version and stayed silent about fixes
 * that were already published. This suite is the missing link — a release that never reaches
 * the page fails here instead of going unnoticed until a reader compares the two.
 *
 * It checks the head only. A page is free to show a curated slice of the older history, and
 * several deliberately skip patch releases they have nothing to say about.
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

/** Libraries whose page directory is not named after the package. */
const PAGE_OVERRIDES: Record<string, string> = { paginable: 'table' };

/** Every library that has a documentation page, paired with that page's source file. */
function documentedLibraries(): (readonly [string, string])[] {
	return readdirSync(`${REPO_ROOT}/projects`)
		.filter((library) => existsSync(`${REPO_ROOT}/projects/${library}/CHANGELOG.md`))
		.map((library) => {
			const directory = PAGE_OVERRIDES[library] ?? library;
			return [library, `${REPO_ROOT}/src/app/pages/${directory}/${directory}.component.ts`] as const;
		})
		.filter(([, page]) => existsSync(page));
}

/** Orders two `major.minor.patch` strings. */
function compare(a: string, b: string): number {
	const left = a.split('.').map(Number);
	const right = b.split('.').map(Number);
	for (let index = 0; index < 3; index++) {
		if (left[index] !== right[index]) {
			return left[index] - right[index];
		}
	}
	return 0;
}

/**
 * Released versions the library's own changelog records, with their dates. The pre-22
 * releases are written without brackets, so both spellings of the heading count.
 */
function releasedVersions(library: string): Map<string, string> {
	const changelog = readFileSync(`${REPO_ROOT}/projects/${library}/CHANGELOG.md`, 'utf8');
	return new Map(
		[...changelog.matchAll(/^## \[?(\d+\.\d+\.\d+)\]? - (\d{4}-\d{2}-\d{2})\s*$/gm)].map(([, version, date]) => [
			version,
			date
		])
	);
}

/**
 * Versions the page prints, with their dates. Every `version:` in these files belongs to the
 * "Recent changes" block and is immediately followed by its `date:`, which is what lets a
 * plain read of the source stand in for building two dozen page components.
 */
function documentedVersions(page: string): Map<string, string> {
	const source = readFileSync(page, 'utf8');
	return new Map(
		[...source.matchAll(/version: '(\d+\.\d+\.\d+)',\s*\n\s*date: '(\d{4}-\d{2}-\d{2})'/g)].map(([, version, date]) => [
			version,
			date
		])
	);
}

describe('library documentation pages', () => {
	it('finds a page for every library it is meant to check', () => {
		expect(documentedLibraries().length).toBeGreaterThan(20);
	});

	it.each(documentedLibraries())('%s announces its latest release, dated as the library dates it', (library, page) => {
		const released = releasedVersions(library);
		const latest = [...released.keys()].sort(compare).pop();

		expect(latest, `${library} has a released version`).toBeDefined();
		expect(documentedVersions(page).get(latest!), `${library} page entry for ${latest}`).toBe(released.get(latest!));
	});
});
