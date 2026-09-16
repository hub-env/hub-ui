import { provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignalBreadcrumbsExampleComponent } from './signal-breadcrumbs-example.component';

/**
 * The example exists to show one thing: a header reading `HubBreadcrumbsService.breadcrumbs`
 * outside the breadcrumb component and re-titling itself when the trail moves. A demo that
 * renders but does not do that teaches nothing, and nothing else on the site would notice — so
 * the claim is pinned here rather than left to a reader to check by eye.
 */
describe('SignalBreadcrumbsExampleComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [SignalBreadcrumbsExampleComponent],
			providers: [provideRouter([]), provideZoneChangeDetection()]
		});
	});

	/**
	 * The demo's own destination button, found by its label. A plain `button` query would
	 * answer with the breadcrumb's collapsed indicator, which is a button too and comes first.
	 */
	const destination = (root: HTMLElement, label: string): HTMLButtonElement =>
		Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find((button) => button.textContent?.trim() === label)!;

	it('titles the header from the last crumb of the trail', () => {
		const fixture = TestBed.createComponent(SignalBreadcrumbsExampleComponent);
		fixture.detectChanges();

		const root: HTMLElement = fixture.nativeElement;
		expect(root.querySelector('h3')?.textContent?.trim()).toBe('INV-2026-0184');
		expect(root.querySelector('p')?.textContent).toContain('in Invoices');
	});

	it('re-titles the header when the trail moves, with nothing subscribed to it', () => {
		const fixture = TestBed.createComponent(SignalBreadcrumbsExampleComponent);
		fixture.detectChanges();

		const root: HTMLElement = fixture.nativeElement;
		destination(root, 'Workspaces').click();
		fixture.detectChanges();

		expect(root.querySelector('h3')?.textContent?.trim()).toBe('Workspaces');
		expect(root.querySelector('p')?.textContent).toContain('in Home');
	});

	it('feeds the breadcrumb component from the same trail', () => {
		const fixture = TestBed.createComponent(SignalBreadcrumbsExampleComponent);
		fixture.detectChanges();

		const crumbs = fixture.nativeElement.querySelectorAll('hub-breadcrumb .hub-breadcrumb__item');
		expect(crumbs.length).toBeGreaterThan(0);
		expect(fixture.nativeElement.querySelector('hub-breadcrumb')?.textContent).toContain('INV-2026-0184');
	});
});
