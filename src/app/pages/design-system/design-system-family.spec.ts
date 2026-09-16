import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHubTranslationAdapter } from 'ng-hub-ui-utils';
import { of } from 'rxjs';
import { deepMerge, en } from '../../i18n';
import { raw as es } from '../../i18n/locales/es';
import { DesignSystemComponent } from './design-system.component';
import { DS_FAMILY_LIBRARIES } from './design-system-family';

/** Stand-in for the library pages the gallery links to. */
@Component({ standalone: true, template: '' })
class StubLibraryComponent {}

/**
 * The gallery publishes a token-integration badge for the whole family, so a row that
 * drifts tells the reader the opposite of the truth: it claimed avatar, milestones and
 * utils were still pending long after they read `--hub-sys-*`, and knew nothing at all
 * of seven libraries. The links are relative on purpose — an absolute `/avatar` only
 * resolves through the unprefixed-legacy redirect table, which `action-sheet` is not in,
 * and it drops a reader of the Spanish page into the English docs.
 *
 * The real Spanish dictionary is handed to the page rather than a stub, so the badge text
 * asserted below is the one a Spanish reader gets. That makes this suite the guard for the
 * page's own localization too: the copy used to be hard-coded Spanish and showed up
 * untranslated on `/en/design-system`, and a key that goes missing from `es.json` now
 * fails here instead of quietly falling back to English in front of the reader.
 */
describe('design-system family gallery', () => {
	let page: HTMLElement;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			providers: [
				provideHubTranslationAdapter(() => of(deepMerge(en as unknown as Record<string, unknown>, es))),
				provideRouter([
					{
						path: 'es',
						children: [
							{ path: 'design-system', component: DesignSystemComponent },
							...DS_FAMILY_LIBRARIES.map((library) => ({ path: library.name, component: StubLibraryComponent }))
						]
					}
				])
			]
		});

		// Routed through the harness, not created directly: the relative links resolve
		// against the ActivatedRoute the outlet supplies, which is the whole point here.
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl('/es/design-system', DesignSystemComponent);
		page = harness.routeNativeElement as HTMLElement;
	});

	/** The gallery cards, in render order. */
	function cards(): HTMLAnchorElement[] {
		return Array.from(page.querySelectorAll('.ds-gallery__card'));
	}

	it('renders one card per library of the ecosystem', () => {
		const names = cards().map((card) => card.querySelector('.ds-gallery__name')?.textContent?.trim());

		expect(names).toEqual(DS_FAMILY_LIBRARIES.map((library) => library.name));
		expect(names).toContain('action-sheet');
		expect(names).toContain('badges');
		expect(names).toContain('buttons');
		expect(names).toContain('icons');
		expect(names).toContain('loading');
		expect(names).toContain('metrics');
		expect(names).toContain('signature');
	});

	it('badges avatar, milestones and utils as wired, since they read --hub-sys-* today', () => {
		const badge = (name: string) =>
			cards()
				.find((card) => card.querySelector('.ds-gallery__name')?.textContent?.trim() === name)
				?.querySelector('.ds-gallery__badge');

		for (const name of ['avatar', 'milestones', 'utils']) {
			expect(badge(name)?.classList.contains('ds-gallery__badge--wired')).toBe(true);
			expect(badge(name)?.textContent).toContain('Integrada');
		}
	});

	it('keeps the pending libraries pending', () => {
		const pending = cards()
			.filter((card) => card.querySelector('.ds-gallery__badge--pending'))
			.map((card) => card.querySelector('.ds-gallery__name')?.textContent?.trim());

		expect(pending).toEqual(['history', 'portal', 'skeleton', 'sortable']);
	});

	it('links each card inside the language the reader is on', () => {
		const hrefs = cards().map((card) => card.getAttribute('href'));

		expect(hrefs).toEqual(DS_FAMILY_LIBRARIES.map((library) => `/es/${library.name}`));
	});
});
