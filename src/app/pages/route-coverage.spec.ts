import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Route } from '@angular/router';
import { routes } from '../app.routes';
import { LIBRARY_SEO } from '../seo/seo.config';
import { NavigationService } from '../services/navigation.service';
import { DEFAULT_APP_LANG } from '../services/app-i18n.service';

/**
 * The site has no end-to-end runner, and it does not need one to answer "do the pages open":
 * the production build prerenders every discovered route and fails when one throws, which is
 * roughly nineteen hundred render assertions per build.
 *
 * What that cannot catch is the opposite failure — a link the shell offers to a route the
 * table does not serve. Prerender only ever visits routes that exist; a sidebar entry pointing
 * at a missing one is invisible to it and lands the reader on the not-found page. Same for a
 * library that has SEO metadata, and therefore structured data and an entry in the sitemap
 * cluster, but no page behind it.
 *
 * This suite reads the two lists and compares them. It renders nothing, so it costs
 * milliseconds and stays honest about its scope: it proves the link goes somewhere, not that
 * what is there is any good.
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

const SHELL_FILE = `${REPO_ROOT}/src/app/components/app-shell/app-shell.component.ts`;

/**
 * Reads one `new Set([...])` of route ids out of the shell.
 *
 * Out of the source rather than by import, the way `example-nav-coverage.spec.ts` already
 * does: these are file-private constants, and exporting them only for a test would widen the
 * component's surface for no caller.
 *
 * @param name Constant name declared in the shell.
 * @returns The ids the constant lists.
 */
function shellIdSet(name: string): string[] {
	const source = readFileSync(SHELL_FILE, 'utf8');
	const start = source.indexOf(`const ${name} = new Set([`);
	if (start === -1) {
		throw new Error(`${name} not found in app-shell.component.ts`);
	}
	const block = source.slice(start, source.indexOf(']);', start));
	return [...block.matchAll(/'([a-z-]+)'/g)].map(([, id]) => id);
}

/** The localized route tree, i.e. everything mounted under `/<lang>`. */
const localizedRoutes: Route[] = (() => {
	const language = routes.find((route) => route.path === DEFAULT_APP_LANG);
	if (!language?.children) {
		throw new Error(`no route tree under /${DEFAULT_APP_LANG}`);
	}
	return language.children;
})();

/** Content paths that resolve to something: a component, or a redirect to one. */
const SERVED: Map<string, Route[]> = new Map(
	localizedRoutes
		.filter((route) => typeof route.path === 'string' && route.path !== '**')
		.map((route) => [route.path as string, route.children ?? []])
);

/**
 * Whether `<path>/<tab>` reaches the reader, either by rendering or by redirecting.
 *
 * A redirect counts: the installer deliberately answers `api` and `styles` with one, so a
 * bookmark from before the page existed still lands on the overview instead of 404.
 *
 * @param path Content path, without the language prefix.
 * @param tab Child segment.
 */
function serves(path: string, tab: string): boolean {
	const children = SERVED.get(path);
	if (!children) {
		return false;
	}
	const child = children.find((route) => route.path === tab);
	return !!child && (!!child.component || !!child.redirectTo);
}

/** Tabs the sidebar renders for a library, given what the shell was told about it. */
function tabsOfferedFor(id: string): string[] {
	const tabs = ['overview', 'examples'];
	if (!WITHOUT_API_SECTIONS.includes(id)) {
		tabs.push('api', 'styles');
	}
	if (WITH_PLAYGROUND.includes(id)) {
		tabs.push('playground');
	}
	return tabs;
}

const TABBED = shellIdSet('TABBED_LIBRARY_IDS');
const WITH_PLAYGROUND = shellIdSet('LIBRARIES_WITH_PLAYGROUND');
const WITHOUT_API_SECTIONS = shellIdSet('LIBRARIES_WITHOUT_API_SECTIONS');

describe('every route the shell links to exists', () => {
	it('reads both lists it compares', () => {
		expect(TABBED.length, 'libraries with a sidebar entry').toBeGreaterThan(20);
		expect(SERVED.size, 'content paths in the route table').toBeGreaterThan(20);
	});

	it('serves the top-level path of every primary menu entry', () => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const menu = TestBed.inject(NavigationService).getMainMenu();
		const missing = menu
			.map((item) => item.route ?? '')
			.filter((route) => route.startsWith('/') && route !== '/')
			.map((route) => route.slice(1))
			.filter((path) => !SERVED.has(path));

		expect(missing, 'sidebar entries pointing at no route').toEqual([]);
	});

	it.each(TABBED)('serves every tab the sidebar offers for %s', (id) => {
		const missing = tabsOfferedFor(id).filter((tab) => !serves(id, tab));

		expect(missing, `${id} tabs linked from the sidebar with nothing behind them`).toEqual([]);
	});

	it('gives a page to every library that carries SEO metadata', () => {
		const missing = Object.values(LIBRARY_SEO)
			.map((entry) => entry.route)
			.filter((route) => !serves(route, 'overview'));

		expect(missing, 'libraries with structured data and no page').toEqual([]);
	});

	it('does not offer an API section for a library whose route table has no API page', () => {
		const contradicting = WITHOUT_API_SECTIONS.filter((id) => {
			const child = (SERVED.get(id) ?? []).find((route) => route.path === 'api');
			return !!child?.component;
		});

		expect(contradicting, 'libraries hidden from the sidebar that still render an API tab').toEqual([]);
	});
});
