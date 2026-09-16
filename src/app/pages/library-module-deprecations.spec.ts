import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';

/**
 * The compatibility NgModules are retired in 23.0.0, and the whole value of that decision is
 * that a consumer can find out before the release takes the symbol away. Three artifacts carry
 * the notice — the `@deprecated` tag an editor surfaces, the changelog entry, and the migration
 * in `BREAKING_CHANGES.md` — and any one of them going missing puts the reader back where they
 * started: a module that disappears from a version they had no warning about. Nothing links the
 * three, so this suite is what keeps them together through the next edit of whichever file.
 *
 * The last block extends the first requirement to the deprecated components, which have the
 * same tag and only that one artifact to carry it.
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
 * Symbols announced for removal in 23.0.0, with the file that declares each.
 *
 * Mostly compatibility NgModules. `HubActionSheetComponent` is here for the same reason and
 * not because it is one: it is exported by accident — the sheet is opened through the
 * service, and a hand-mounted one cannot close itself — so it leaves on the same release,
 * and a consumer holding it deserves the same three warnings.
 */
const ANNOUNCED = [
	['action-sheet', 'HubActionSheetComponent', 'src/lib/components/action-sheet/action-sheet.component.ts'],
	['breadcrumbs', 'HubBreadcrumbsModule', 'src/lib/breadcrumbs.module.ts'],
	['calendar', 'CalendarModule', 'src/lib/calendar.module.ts'],
	['modal', 'HubModalModule', 'src/lib/modal.module.ts'],
	['portal', 'HubPortalModule', 'src/lib/portal.module.ts'],
	['skeleton', 'HubSkeletonModule', 'src/lib/hub-skeleton.module.ts'],
	['stepper', 'StepperModule', 'src/lib/stepper.module.ts'],
	['paginable', 'HubUITableModule', 'src/lib/paginable.module.ts']
] as const;

/**
 * The compiler itself, loaded at run time so the spec bundle does not carry it.
 *
 * Reading the tag off the text is not enough: a decorated class starts at its decorator, so a
 * JSDoc block written between `@NgModule(…)` and `export class` sits *inside* the declaration
 * and TypeScript attaches nothing — the editor stays silent and the tag is decoration for
 * whoever opens the file. Only the compiler's own view distinguishes that from a tag that works.
 */
const ts = createRequire(import.meta.url)('typescript');

/** The JSDoc text TypeScript attaches to a class, tags included — empty when it attaches none. */
function docCommentFor(source: string, className: string): string {
	const parsed = ts.createSourceFile(`${className}.ts`, source, ts.ScriptTarget.ES2022, true);
	let doc = '';

	parsed.forEachChild((node: any) => {
		if (!ts.isClassDeclaration(node) || node.name?.text !== className) {
			return;
		}
		doc = ts
			.getJSDocCommentsAndTags(node)
			.map((block: any) => block.getFullText())
			.join('\n');
	});

	return doc;
}

/**
 * Every released version block, newest first.
 *
 * The deprecation is announced once, in the release that shipped the mark, and stays there while
 * later patches pile on top of it. Reading only the newest block would fail on the first patch
 * after that release, which is a property of the calendar and not of the announcement.
 */
function releaseBlocks(changelog: string): string[] {
	return changelog
		.split(/^## /m)
		.slice(1)
		.filter((block) => block.startsWith('['));
}

describe.each(ANNOUNCED)('%s: %s is announced for removal in 23.0.0', (library, className, modulePath) => {
	const root = `${REPO_ROOT}/projects/${library}`;
	const source = readFileSync(`${root}/${modulePath}`, 'utf8');
	const changelog = readFileSync(`${root}/CHANGELOG.md`, 'utf8');
	const breaking = readFileSync(`${root}/BREAKING_CHANGES.md`, 'utf8');

	it('marks the class where the compiler reads it, so an editor warns before the release cannot', () => {
		const doc = docCommentFor(source, className);
		expect(doc, `JSDoc TypeScript attaches to ${className}`).toContain('@deprecated');
		expect(doc, `removal version in the ${className} JSDoc`).toContain('23.0.0');
	});

	it('records the deprecation under the release that shipped the mark', () => {
		const announcing = releaseBlocks(changelog).filter(
			(block) => block.includes('### Deprecated') && block.slice(block.indexOf('### Deprecated')).includes(className)
		);

		expect(
			announcing.length,
			`release block naming ${className} under Deprecated in ${library}/CHANGELOG.md`
		).toBeGreaterThan(0);
	});

	it('gives the migration in BREAKING_CHANGES.md, the only warning the version number cannot', () => {
		expect(breaking, `${className} in ${library}/BREAKING_CHANGES.md`).toContain(className);
		const announcement = breaking.slice(breaking.indexOf(className));
		expect(announcement.slice(0, 2000), `removal version beside ${className}`).toContain('23.0.0');
	});
});

/**
 * Deprecated components. A component has no `forRoot()` to make its name conspicuous, so the
 * tag is the only thing standing between a consumer and a surface that is already superseded.
 */
const SUPERSEDED = [
	[
		'paginable',
		'HubPaginableTableDropdownComponent',
		'src/lib/components/paginable-table-dropdown/paginable-table-dropdown.component.ts'
	]
] as const;

describe.each(SUPERSEDED)('%s: %s is marked superseded', (library, className, componentPath) => {
	const source = readFileSync(`${REPO_ROOT}/projects/${library}/${componentPath}`, 'utf8');

	it('carries the tag where the compiler reads it, decorator or no decorator', () => {
		expect(docCommentFor(source, className), `JSDoc TypeScript attaches to ${className}`).toContain('@deprecated');
	});
});
