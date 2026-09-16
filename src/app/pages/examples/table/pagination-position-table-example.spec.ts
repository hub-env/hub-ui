import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubTranslationService } from 'ng-hub-ui-utils';

import { PaginationPositionTableExampleComponent } from './pagination-position-table-example.component';

/**
 * `paginationPosition` is the one table input the documentation site described but never showed,
 * and the reason it needs showing is the reason it was once implemented wrong: the value does not
 * move the paginator, it moves the whole bar — page links, page-size selector and row count.
 *
 * So the demo is asserted on that, not on the switch changing a signal. A demo whose `top` merely
 * dropped the paginator, or moved it while leaving the row count under the rows, would still look
 * like a working example.
 */
describe('PaginationPositionTableExampleComponent', () => {
	let fixture: ComponentFixture<PaginationPositionTableExampleComponent>;

	/** Where each bar sits relative to the rows, in document order. */
	function barPlacements(): Array<'top' | 'bottom'> {
		const container: Element = fixture.nativeElement.querySelector('.hub-table__container');
		return [...fixture.nativeElement.querySelectorAll('.hub-table__bottom-bar')].map((bar) =>
			container.compareDocumentPosition(bar as Node) & Node.DOCUMENT_POSITION_PRECEDING ? 'top' : 'bottom'
		);
	}

	/** Clicks the switch button carrying the given placement. */
	function choose(placement: string): void {
		const host: HTMLElement = fixture.nativeElement;
		const button = [...host.querySelectorAll<HTMLButtonElement>('button')].find(
			(candidate) => candidate.textContent?.trim() === placement
		);
		expect(button, `the demo offers a "${placement}" button`).toBeTruthy();
		button!.click();
		fixture.detectChanges();
	}

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [HubTranslationService] });
		fixture = TestBed.createComponent(PaginationPositionTableExampleComponent);
		fixture.detectChanges();
	});

	it('starts on the default placement, with the bar under the rows', () => {
		expect(barPlacements()).toEqual(['bottom']);
	});

	it('moves the whole bar above the rows on "top"', () => {
		choose('top');

		expect(barPlacements()).toEqual(['top']);

		// The three pieces travel together. Counting them is what separates a relocation from
		// the old behaviour, where `top` simply removed the paginator.
		expect(fixture.nativeElement.querySelectorAll('.hub-table__bottom-bar--top hub-paginator').length).toBe(1);
		expect(
			fixture.nativeElement.querySelectorAll('.hub-table__bottom-bar--top .hub-table__bottom-bar-settings').length
		).toBe(1);
		expect(fixture.nativeElement.querySelectorAll('.hub-table__bottom-bar--top .hub-table__bottom-bar-info').length).toBe(
			1
		);
	});

	it('draws the bar at both edges on "both"', () => {
		choose('both');

		expect(barPlacements()).toEqual(['top', 'bottom']);
		expect(fixture.nativeElement.querySelectorAll('hub-paginator').length).toBe(2);
		expect(fixture.nativeElement.querySelectorAll('.hub-table__bottom-bar-settings').length).toBe(2);
	});

	it('goes back to the bottom, so the switch is a switch and not a one-way trip', () => {
		choose('both');
		choose('bottom');

		expect(barPlacements()).toEqual(['bottom']);
	});

	it('pages enough rows for the paginator to have somewhere to go', () => {
		// A single page hides the very control the example is about.
		expect(fixture.nativeElement.querySelectorAll('.hub-paginator__link').length).toBeGreaterThan(1);
	});
});
