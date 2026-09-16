import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import {
	HUB_ACTION_SHEET_CONFIG,
	HUB_ACTION_SHEET_DEFAULTS,
	HubActionSheet,
	HubActionSheetRef,
	provideHubActionSheet
} from 'ng-hub-ui-action-sheet';
import { LIBRARY_VERSIONS } from '../../seo/library-versions.generated';
import { ActionSheetComponent } from './action-sheet.component';

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

const REFERENCE = `${REPO_ROOT}/projects/action-sheet/docs/css-variables-reference.md`;

/**
 * The page is the first thing a reader consults, so a claim it makes that the package
 * does not back is worse than no claim at all. These guards catch the two ways it drifts:
 * a changelog that stops before the published version, and an API table that omits an
 * export a reader can already import.
 */
describe('action-sheet documentation page', () => {
	let page: ActionSheetComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		page = TestBed.runInInjectionContext(() => new ActionSheetComponent());
	});

	it('opens its changelog on the version the registry actually serves', () => {
		expect(page.actionSheetLibrary.overview.changelog[0].version).toBe(LIBRARY_VERSIONS['action-sheet']);
	});

	it('documents every method and provider entry the public API exports', () => {
		const documented = (page.actionSheetLibrary.api.methods ?? []).map((method) => method.name);

		// Named rather than reflected: the point is that the page lists them, and a
		// reflection over the module would pass by restating whatever the page already says.
		expect(documented).toContain('HubActionSheetRef.settled');
		expect(documented).toContain('provideHubActionSheet');
		expect(documented).toContain('HUB_ACTION_SHEET_CONFIG');
		expect(documented).toContain('HUB_ACTION_SHEET_DEFAULTS');

		// And that each of them is a thing the package really exports.
		expect(Object.getOwnPropertyNames(HubActionSheetRef.prototype)).toContain('settled');
		expect(typeof provideHubActionSheet).toBe('function');
		expect(HUB_ACTION_SHEET_CONFIG).toBeDefined();
		expect(HUB_ACTION_SHEET_DEFAULTS).toBeDefined();
	});
});

/**
 * The CSS variables reference is the page a reader consults before writing a theme, and it
 * states a default for every token. Nothing compiled it: the table is prose beside a
 * stylesheet, so a default that moves in the SCSS leaves the reference quietly wrong. This
 * suite reads the stylesheet the library actually ships — the one injected in the document,
 * after the build has compiled and scoped it — and holds the table to it.
 */
describe('action-sheet CSS variables reference', () => {
	/** Every `| --token | default |` row of the library's reference. */
	function documentedDefaults(): [string, string][] {
		const reference = readFileSync(REFERENCE, 'utf8');
		return [...reference.matchAll(/^\|\s*`(--hub-action-sheet-[a-z-]+)`\s*\|\s*`([^`]+)`\s*\|/gm)].map(
			([, token, value]) => [token, value] as [string, string]
		);
	}

	function shippedCss(): string {
		return Array.from(document.querySelectorAll('style'))
			.map((style) => style.textContent ?? '')
			.filter((text) => text.includes('hub-action-sheet'))
			.join('\n');
	}

	beforeEach(() => {
		TestBed.configureTestingModule({});
		TestBed.inject(HubActionSheet).open({ header: 'Theming', buttons: [{ text: 'Ok' }] });
	});

	afterEach(() => {
		document.querySelectorAll('hub-action-sheet').forEach((element) => element.remove());
	});

	it('states, for every token, the default the stylesheet falls back to', () => {
		const css = shippedCss();
		// The accent family is left out on purpose: the reference documents it generatively —
		// one slot, roles derived from whatever it holds — so its cells describe the derivation
		// rather than the literal text the stylesheet compiles to.
		const rows = documentedDefaults().filter(([token]) => !/accent|selected/.test(token));

		expect(rows.length).toBeGreaterThan(20);
		for (const [token, value] of rows) {
			expect(css, `${token} in the CSS variables reference`).toContain(`var(${token}, ${value})`);
		}
	});

	it('sends the reader to a selector the sheet does not outrank', () => {
		const reference = readFileSync(REFERENCE, 'utf8');

		// The sheet is mounted on `document.body`, so `:root` is the only place an application
		// can theme it from — which is why the stylesheet must not declare the tokens itself.
		expect(reference).toContain('Set them on `:root`');
		expect(shippedCss()).not.toMatch(/\[_nghost-[^\]]+\]\s*\{[^}]*--hub-action-sheet-bg\s*:/);
	});
});
