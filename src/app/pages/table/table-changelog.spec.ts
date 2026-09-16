import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * The "Recent changes" block on the paginable page is a hand-written copy of the library's
 * `CHANGELOG.md`, and nothing forced the copy to stay honest: it ran from the current release
 * down to `19.10.2` while silently dropping twenty-three releases on the way — the whole 21.x
 * line among them — and the `19.10.2` entry it did print announced an `added` and a
 * `changed` for a release whose only section is `Fixed`. A reader comparing the page with the
 * package got a history that was neither complete nor true.
 *
 * `library-changelog.spec.ts` guards the head of every page, deliberately allowing a curated
 * slice of older history. This suite is the paginable half of the same contract, and it is
 * stricter because this page claims a continuous history: down to `HISTORY_FLOOR` it must list
 * every release, on the date the library published it, announcing only kinds of change that
 * release actually contained.
 *
 * The page is read as text rather than instantiated: `TableComponent` reaches for `inject()`,
 * so `new` would throw NG0203 and building it would buy nothing this needs.
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
 * Oldest release the page is expected to cover without gaps. Everything below it — the 2019
 * entries that open the history — is a deliberate bookend, not a claim of continuity. Moving
 * this line is a decision about what the page promises, so it is made here and on purpose.
 */
const HISTORY_FLOOR = '19.10.2';

/** Section headings this changelog has used over the years, mapped onto the page's vocabulary. */
const TYPE_OF_SECTION: Record<string, string> = {
	added: 'added',
	changed: 'changed',
	deprecated: 'deprecated',
	removed: 'removed',
	fixed: 'fixed',
	'bug fixes': 'fixed',
	security: 'security',
	documentation: 'changed',
	docs: 'changed',
	refactor: 'changed',
	performance: 'changed'
};

interface Release {
	version: string;
	date: string;
	types: Set<string>;
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
 * What the library actually published, read off its changelog. The pre-22 headings are written
 * without brackets, so both spellings count.
 */
const RELEASED: Map<string, Release> = (() => {
	const changelog = readFileSync(`${REPO_ROOT}/projects/paginable/CHANGELOG.md`, 'utf8');
	const headings = [...changelog.matchAll(/^## \[?(\d+\.\d+\.\d+)\]? - (\d{4}-\d{2}-\d{2})\s*$/gm)];

	return new Map(
		headings.map((heading, index) => {
			const body = changelog.slice(heading.index! + heading[0].length, headings[index + 1]?.index);
			const types = [...body.matchAll(/^### (.+)$/gm)]
				.map(([, section]) => TYPE_OF_SECTION[section.trim().toLowerCase()])
				.filter((type): type is string => Boolean(type));
			return [heading[1], { version: heading[1], date: heading[2], types: new Set(types) }];
		})
	);
})();

/**
 * What the page announces. Splitting on the `version:` key rather than matching a whole entry
 * keeps the reading independent of how prettier happened to wrap any given block.
 */
const ANNOUNCED: Release[] = (() => {
	const page = readFileSync(`${REPO_ROOT}/src/app/pages/table/table.component.ts`, 'utf8');
	const block = page.slice(page.indexOf('changelog: ['), page.indexOf('functionalities: ['));

	return block
		.split(/(?=version: ')/)
		.slice(1)
		.map((entry) => ({
			version: entry.match(/version: '([\d.]+)'/)![1],
			date: entry.match(/date: '(\d{4}-\d{2}-\d{2})'/)![1],
			types: new Set([...entry.matchAll(/type: '(\w+)'/g)].map(([, type]) => type))
		}));
})();

describe('the paginable page history', () => {
	it('reads both histories', () => {
		expect(RELEASED.size).toBeGreaterThan(50);
		expect(ANNOUNCED.length).toBeGreaterThan(20);
	});

	it('announces only releases the library published, on the date it published them', () => {
		for (const entry of ANNOUNCED) {
			expect(RELEASED.has(entry.version), `page announces ${entry.version}`).toBe(true);
			expect(entry.date, `date of ${entry.version}`).toBe(RELEASED.get(entry.version)!.date);
		}
	});

	it('announces no kind of change the release did not contain', () => {
		for (const entry of ANNOUNCED) {
			const published = RELEASED.get(entry.version);
			if (!published) {
				continue; // Already reported by the test above.
			}
			expect(
				[...entry.types].filter((type) => !published.types.has(type)),
				`${entry.version} is announced with change types its changelog entry has not`
			).toEqual([]);
		}
	});

	it(`skips no release between the newest and ${HISTORY_FLOOR}`, () => {
		const announced = new Set(ANNOUNCED.map((entry) => entry.version));
		const covered = [...RELEASED.keys()].filter((version) => compare(version, HISTORY_FLOOR) >= 0);

		expect(covered.filter((version) => !announced.has(version)).sort(compare), 'releases the page leaves out').toEqual([]);
	});

	it('runs from newest to oldest', () => {
		const versions = ANNOUNCED.map((entry) => entry.version);
		expect(versions).toEqual([...versions].sort(compare).reverse());
	});
});
